{
  lib,
  version,
  stdenvNoCC,

  zola,
}:
let
  pname = "comfysage-site";
in
stdenvNoCC.mkDerivation {
  inherit pname version;

  src = ./.;

  nativeBuildInputs = [
    zola
  ];

  buildPhase = ''
    runHook preBuild
    zola build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r public/* $out

    runHook postInstall
  '';

  meta = {
    homepage = "https://robinroses.xyz";
    description = "cozy site";
    license = lib.licenses.gpl3;
    maintainers = with lib.maintainers; [ comfysage ];
  };
}
