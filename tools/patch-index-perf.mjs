import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html");
let h = fs.readFileSync(p, "utf8");

h = h.replace(/\s*<!-- Integrated Payment Section Styles -->\s*<style>[\s\S]*?<\/style>/, "");

h = h.replace(
  /<img class="m-hero__photo" src="img\/hero-mentor\.png\?v=20261113restore" alt="" width="390" height="260" decoding="async" fetchpriority="high">/,
  '<picture><source type="image/webp" srcset="img/hero-mentor.webp?v=20261119perfB"><img class="m-hero__photo" src="img/hero-mentor.png?v=20261113restore" alt="" width="390" height="260" decoding="async" fetchpriority="high"></picture>'
);

h = h.replace(
  /\s*<script>\s*function getRadioValue[\s\S]*?<\/script>\s*(?=<script src="js\/awc-desktop-hero-loader)/,
  '\n  <script src="js/home.js?v=20261119perfB" defer></script>\n  '
);

fs.writeFileSync(p, h);
console.log("patched index.html");