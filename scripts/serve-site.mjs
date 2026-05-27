import { spawn } from "node:child_process";
import { withRubyPath } from "./lib/ruby-env.mjs";

const child = spawn(
  "bundle",
  ["exec", "jekyll", "serve", "--host", "127.0.0.1", "--port", "4000"],
  {
    env: withRubyPath({
      ...process.env,
      JEKYLL_ENV: process.env.JEKYLL_ENV || "development",
    }),
    stdio: "inherit",
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
