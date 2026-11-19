import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const write = (rel, data) => {
  const dest = path.join(root, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, data, "utf8");
};

/** Extract inline <style> from index.html → css/index-integrated.css */
const indexHtml = read("index.html");
const styleMatch = indexHtml.match(
  /<!-- Integrated Payment Section Styles -->\s*<style>\s*([\s\S]*?)\s*<\/style>/
);
if (styleMatch) {
  write("css/index-integrated.css", styleMatch[1].trim() + "\n");
  console.log("Wrote css/index-integrated.css");
}

/** Extract home page inline script → js/home.js */
const scriptMatch = indexHtml.match(/<body[^>]*>[\s\S]*?<script>\s*([\s\S]*?)\s*<\/script>\s*<script src="js\/awc-desktop-hero-loader/);
if (scriptMatch) {
  write("js/home.js", scriptMatch[1].trim() + "\n");
  console.log("Wrote js/home.js");
}

/** Concat core stylesheets (+ modal/payment rules when present) */
const bundleFiles = ["design-tokens.css", "design-system.css", "style.css"];
const integratedPath = path.join(root, "css", "index-integrated.css");
if (fs.existsSync(integratedPath)) bundleFiles.push("css/index-integrated.css");
const bundleParts = bundleFiles.map((f) => read(f));
let bundle = bundleParts.join("\n");

try {
  const CleanCSS = require("clean-css");
  const out = new CleanCSS({ level: 1 }).minify(bundle);
  if (!out.errors?.length) bundle = out.styles;
} catch {
  console.warn("clean-css not installed; writing unminified bundle");
}

write("assets/mobile-bundle.css", bundle);
console.log("Wrote assets/mobile-bundle.css (" + Math.round(bundle.length / 1024) + " KB)");

/** Hero PNG → WebP when source exists */
const heroPng = path.join(root, "img", "hero-mentor.png");
const heroWebp = path.join(root, "img", "hero-mentor.webp");
if (fs.existsSync(heroPng)) {
  try {
    const sharp = require("sharp");
    await sharp(heroPng)
      .resize(780, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(heroWebp);
    console.log("Wrote img/hero-mentor.webp");
  } catch (e) {
    console.warn("sharp not available; skip WebP:", e.message);
  }
} else {
  console.warn("img/hero-mentor.png missing; deploy WebP manually or add PNG and re-run");
}