{
  lib,
  version,
  stdenvNoCC,

  just,
  zola,
}:
let
  pname = "comfysage-site";
in
stdenvNoCC.mkDerivation {
  inherit pname version;

  src = ./.;

  nativeBuildInputs = [
    just
    zola
  ];

  justFlags = [
    "--set"
    "prefix"
    (placeholder "out")
  ];

  meta = {
    homepage = "https://robinroses.xyz";
    description = "cozy site";
    license = lib.licenses.gpl3;
    maintainers = with lib.maintainers; [ comfysage ];
  };
}
