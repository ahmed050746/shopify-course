import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "index.html");
let text = fs.readFileSync(file, "utf8");

const oldBlock =
  '        <div class="m-hero__decor" aria-hidden="true">\r\n          <span class="d-hero__spotlight"></span>\r\n          <span class="m-hero__shade"></span>\r\n        </div>';

const newBlock = `        <div class="m-hero__decor" aria-hidden="true">
          <img class="d-hero__bg" src="img/hero-mentor.png" alt="">
          <div class="d-hero__overlays">
            <span class="d-hero__overlay d-hero__overlay--base"></span>
            <span class="d-hero__overlay d-hero__overlay--left"></span>
            <span class="d-hero__overlay d-hero__overlay--vignette"></span>
            <span class="d-hero__overlay d-hero__overlay--bottom"></span>
          </div>
        </div>`.replace(/\n/g, "\r\n");

const idx = text.indexOf("d-hero__spotlight");
if (idx < 0) {
  console.error("spotlight not found");
  process.exit(1);
}

if (!text.includes(oldBlock)) {
  const norm = text.replace(/\r\n/g, "\n");
  const oldLf = oldBlock.replace(/\r\n/g, "\n");
  if (norm.includes(oldLf)) {
    text = norm.replace(oldLf, newBlock.replace(/\r\n/g, "\n")).replace(/\n/g, "\r\n");
  } else {
    console.error("block not found");
    process.exit(1);
  }
} else {
  text = text.replace(oldBlock, newBlock);
}

fs.writeFileSync(file, text);
console.log("Done.");
