{
  description = "Rust Project Template";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { self, nixpkgs }@inputs:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
          system: function nixpkgs.legacyPackages.${system}
        );
    in
    {
      packages = forAllSystems (pkgs: {
        example = pkgs.callPackage ./default.nix {
          version = self.shortRev or self.dirtyRev or "dirty";
        };
        default = self.packages.${pkgs.stdenv.hostPlatform.system}.example;
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.callPackage ./shell.nix { inherit inputs; };
      });

      overlays.default = final: _: { example = final.callPackage ./default.nix { }; };
    };
}
