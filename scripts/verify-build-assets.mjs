import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(projectRoot, "dist");
const googleAnalyticsId = "G-MHNSFGHHD7";

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? findHtmlFiles(path) : path.endsWith(".html") ? [path] : [];
  });
}

const references = new Set();
const pagesMissingGoogleAnalytics = [];

for (const htmlFile of findHtmlFiles(distRoot)) {
  const html = readFileSync(htmlFile, "utf8");
  if (
    !html.includes(`googletagmanager.com/gtag/js?id=${googleAnalyticsId}`) ||
    !html.includes(`gtag("config", "${googleAnalyticsId}")`)
  ) {
    pagesMissingGoogleAnalytics.push(htmlFile);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"?#]*\/_astro\/[^"?#]+)[^\"]*"/g)) {
    references.add(match[1]);
  }
}

if (pagesMissingGoogleAnalytics.length > 0) {
  throw new Error(
    `Built pages are missing Google Analytics ${googleAnalyticsId}:\n${pagesMissingGoogleAnalytics.join("\n")}`,
  );
}

if (references.size === 0) {
  throw new Error("The build produced no Astro asset references to verify.");
}

const missing = [...references].filter((reference) => {
  const pathname = new URL(reference, "https://activityschema.com").pathname;
  return !existsSync(join(distRoot, pathname));
});

if (missing.length > 0) {
  throw new Error(`Built pages reference missing assets:\n${missing.join("\n")}`);
}

console.log(`Verified ${references.size} built Astro asset paths.`);
