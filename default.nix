with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "galactus-web";

  buildInputs = [
    pkgs.yarn
  ];
}
