{
  description = "Deno development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = [
          pkgs.deno
        ];

        # 必要ならここに env を書く
        # GH_USER, GH_TOKEN は .env や export で渡す想定
        shellHook = ''
          echo "Deno $(deno --version | head -n1)"
        '';
      };
    };
}
