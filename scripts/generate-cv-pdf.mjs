import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { rm } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { withRubyPath } from "./lib/ruby-env.mjs";

const root = resolve(import.meta.dirname, "..");
const siteDir = join(root, "_site");
const outputPath = join(root, "assets", "richard-hallgren-cv.pdf");

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function runBuild() {
  const result = spawnSync("bundle", ["exec", "jekyll", "build"], {
    cwd: root,
    env: withRubyPath({
      ...process.env,
      JEKYLL_ENV: process.env.JEKYLL_ENV || "production",
    }),
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function removeTemp(path) {
  try {
    await rm(path, { force: true, recursive: true });
  } catch {
    // Chrome can keep the temp profile alive briefly after PDF output.
  }
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  const absoluteCandidate = candidates.find((candidate) => existsSync(candidate));
  if (absoluteCandidate) {
    return absoluteCandidate;
  }

  for (const command of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const result = spawnSync("command", ["-v", command], {
      shell: true,
      stdio: ["ignore", "pipe", "ignore"],
    });

    if (result.status === 0) {
      return result.stdout.toString().trim();
    }
  }
}

function createStaticServer() {
  return createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    let filePath = join(siteDir, pathname);
    const relativePath = relative(siteDir, filePath);

    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    if (!existsSync(filePath)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  });
}

function hasWrittenPdf() {
  return existsSync(outputPath) && statSync(outputPath).size > 0;
}

function runChrome(chrome, args) {
  return new Promise((resolveRun) => {
    const child = spawn(chrome, args, { stdio: "inherit" });
    let settled = false;

    const finish = (code) => {
      if (settled) {
        return;
      }

      settled = true;
      clearInterval(pdfCheck);
      clearTimeout(timeout);
      resolveRun(code);
    };

    const pdfCheck = setInterval(() => {
      if (hasWrittenPdf()) {
        child.kill("SIGTERM");
        finish(0);
      }
    }, 500);

    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      finish(hasWrittenPdf() ? 0 : 124);
    }, 30000);

    child.on("exit", (code) => {
      finish(code ?? 1);
    });
  });
}

runBuild();

const chrome = findChrome();
if (!chrome) {
  console.error("Could not find Chrome. Set CHROME_BIN to the Chrome executable path.");
  process.exit(1);
}

mkdirSync(join(root, "assets"), { recursive: true });
await rm(outputPath, { force: true });

const server = createStaticServer();
await new Promise((resolveListen) => {
  server.listen(0, "127.0.0.1", resolveListen);
});

const { port } = server.address();
const userDataDir = join(tmpdir(), "riha-cv-chrome");
await removeTemp(userDataDir);

const chromeStatus = await runChrome(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-background-networking",
    "--disable-component-update",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDataDir}`,
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPath}`,
    `http://127.0.0.1:${port}/cv/pdf/`,
  ],
);

await new Promise((resolveClose) => {
  server.close(resolveClose);
});
await removeTemp(userDataDir);

if (chromeStatus !== 0) {
  process.exit(chromeStatus);
}

runBuild();
