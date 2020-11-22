with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "galactus-web";

  buildInputs = [
    pkgs.yarn
    pkgs.yq
    pkgs.openapi-generator-cli
  ];
}
