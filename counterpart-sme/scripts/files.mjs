// Load order matters. src/sme.js narrows the library and defines the SMEX hooks before app.js boots.
export const FILES = [
  "src/data/clauses.js",
  "src/data/standard-clauses.js",
  "src/data/agreements.js",
  "src/data/guides.js",
  "src/data/schedules.js",
  "src/data/carve-out.js",
  "src/data/variants.js",
  "src/data/practice.js",
  "src/sme.js",
  "src/docx.js",
  "src/review.js",
  "src/pro.js",
  "src/matters.js",
  "src/backup.js",
  "src/app.js"
];
