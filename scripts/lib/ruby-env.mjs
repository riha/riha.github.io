import { existsSync } from "node:fs";

const rubyPaths = [
  "/opt/homebrew/opt/ruby@3.3/bin",
  "/opt/homebrew/lib/ruby/gems/3.3.0/bin",
];

export function withRubyPath(env = process.env) {
  const extraPath = rubyPaths.filter((path) => existsSync(path)).join(":");

  return {
    ...env,
    PATH: extraPath ? `${extraPath}:${env.PATH}` : env.PATH,
  };
}
