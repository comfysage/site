{
  stdenv,
  mkShell,

  zola,

  inputs, # our inputs
  self ? inputs.self,
}:
mkShell {
  inputsFrom = [ self.packages.${stdenv.hostPlatform.system}.default ];

  packages = [
    zola
  ];
}
