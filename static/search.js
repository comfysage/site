function debounce(func, wait) {
  let timeout;

  return function () {
    // deno-lint-ignore no-this-alias
    const context = this;
    const args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

// Taken from mdbook
// The strategy is as follows:
// First, assign a value to each word in the document:
//  Words that correspond to search terms (stemmer aware): 40
//  Normal words: 2
//  First word in a sentence: 8
// Then use a sliding window with a constant number of words and count the
// sum of the values of the words within the window. Then use the window that got the
// maximum sum. If there are multiple maximas, then get the last one.
// Enclose the terms in <b>.
function makeTeaser(body, terms) {
  const TERM_WEIGHT = 40;
  const NORMAL_WORD_WEIGHT = 2;
  const FIRST_WORD_WEIGHT = 8;
  const TEASER_MAX_WORDS = 30;

  const stemmedTerms = terms.map(function (w) {
    return elasticlunr.stemmer(w.toLowerCase());
  });
  let termFound = false;
  let index = 0;
  let weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  const sentences = body.toLowerCase().split(". ");

  for (let i in sentences) {
    const words = sentences[i].split(" ");
    let value = FIRST_WORD_WEIGHT;

    for (let j in words) {
      const word = words[j];

      if (word.length > 0) {
        for (let k in stemmedTerms) {
          if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1;  // ' ' or '.' if last word in sentence
    }

    index += 1;  // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  let windowWeights = [];
  const windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  let curSum = 0;
  for (let i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (let i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  let maxSumIndex = 0;
  if (termFound) {
    let maxFound = 0;
    // backwards
    for (let i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  let teaser = [];
  let startIndex = weighted[maxSumIndex][2];
  for (let i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    const word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<b>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</b>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

function formatSearchResultItem(item, terms) {
  return '<div class="search-results__item">'
  + `<a href="${item.ref}">${item.doc.title}</a>`
  + `<p>${makeTeaser(item.doc.body, terms)}</p>`
  + '</div>';
}

function initSearch() {
  document.querySelectorAll(".search").forEach(onSearchComponent)
}

function onSearchComponent(searchEl) {
  console.log('[search] init')
  const $searchButton = searchEl.querySelector(".search-button")
  const $searchDialog = searchEl.querySelector("dialog.search-dialog")
  const $searchContainer = searchEl.querySelector(".search-container")

  $searchContainer.addEventListener('focusout', (e) => {
    const self = e.currentTarget;
    // If the document has lost focus, don't hide the container just yet, wait
    // until the focus is returned.
    if (!document.hasFocus()) {
      window.addEventListener('focus', function focusReturn() {
        // We want the listener to be triggered just once, so we have it remove
        // itself from the `focus` event.
        window.removeEventListener('focus', focusReturn);

        // Test whether the active element is within our container.
        if (!self.contains(document.activeElement)) {
          $searchDialog.close()
        }
      });
      return;
    }
    if (!self.contains(e.relatedTarget)) {
      $searchDialog.close()
    }
  })

  $searchButton.addEventListener('click', () => {
    $searchDialog.showModal()
  })

  const $searchInput = searchEl.querySelector("#search");

  const $searchResults = searchEl.querySelector(".search-results");
  const $searchResultsItems = searchEl.querySelector(".search-results__items");
  const MAX_ITEMS = 10;

  const options = {
    bool: "AND",
    fields: {
      title: {boost: 2},
      body: {boost: 1},
    }
  };
  let currentTerm = "";
  let index;

  const initIndex = async function () {
    if (index === undefined) {
      index = fetch("/search_index.en.json")
        .then(
          async function(response) {
            return await elasticlunr.Index.load(await response.json());
        }
      );
    }
    const res = await index;
    return res;
  }

  $searchInput.addEventListener("keyup", debounce(async function() {
    const term = $searchInput.value.trim();
    if (term === currentTerm) {
      return;
    }
    $searchResults.style.display = term === "" ? "none" : "block";
    $searchResultsItems.innerHTML = "";
    currentTerm = term;
    if (term === "") {
      return;
    }

    const results = (await initIndex()).search(term, options);
    if (results.length === 0) {
      $searchResults.style.display = "none";
      return;
    }

    for (let i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
      const item = document.createElement("li");
      item.innerHTML = formatSearchResultItem(results[i], term.split(" "));
      $searchResultsItems.appendChild(item);
    }
  }, 150));

  window.addEventListener('click', function(e) {
    if ($searchResults.style.display == "block" && !$searchResults.contains(e.target)) {
      $searchResults.style.display = "none";
    }
  });
}

if (document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  initSearch();
} else {
  window.addEventListener('load', initSearch)
}
