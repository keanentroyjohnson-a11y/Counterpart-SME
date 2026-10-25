import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { FILES } from "./files.mjs";
// Separate storage names, so the SME edition never shares saved data with the lawyer edition in the same browser.
const js = FILES.map(f => readFileSync(f, "utf8")).join("\n")
  .replace('"counterpart.v2"', '"counterpart.sme.v2"').replace('"counterpart.review.v1"', '"counterpart.sme.review.v1"').replace('indexedDB.open("counterpart",1)', 'indexedDB.open("counterpart-sme",1)');
const shell = readFileSync("src/shell.html", "utf8").replace("</style>", readFileSync("src/sme.css", "utf8") + "\n</style>");
const page = shell.replace("/*SCRIPT*/", js);
mkdirSync("dist", { recursive: true });
writeFileSync("dist/artifact.html", page);
writeFileSync("dist/index.html", '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + page + "</body></html>");
console.log("Built dist/index.html (" + Math.round(page.length / 1024) + " KB)");
