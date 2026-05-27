import { spawnSync } from "node:child_process";
import { withRubyPath } from "./lib/ruby-env.mjs";

const result = spawnSync("bundle", ["exec", "jekyll", "build"], {
  env: withRubyPath({
    ...process.env,
    JEKYLL_ENV: process.env.JEKYLL_ENV || "production",
  }),
  stdio: "inherit",
});

process.exit(result.status ?? 1);
