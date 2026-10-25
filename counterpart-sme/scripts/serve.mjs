import { createServer } from "node:http";
import { readFileSync } from "node:fs";
createServer((q, r) => { r.writeHead(200, { "content-type": "text/html; charset=utf-8" }); r.end(readFileSync("dist/index.html")); }).listen(8000, () => console.log("Open http://localhost:8000"));
