const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// We will test the compiled/built components or test via direct imports
const {
  validateTemplateZip,
} = require("../lib/template-engine/validators/ZipValidator");
const {
  validateManifestSchema,
  checkManifestCompatibility,
} = require("../lib/template-engine/validators/ManifestValidator");
const {
  resolvePlaceholders,
  escapeHtml,
} = require("../lib/template-engine/core/PlaceholderResolver");
const {
  compileDesignSettingsCss,
  injectDesignSettingsIntoHtml,
} = require("../lib/template-engine/core/DesignSettingsManager");
const {
  rewriteAssetUrls,
} = require("../lib/template-engine/core/RenderingEngine");

console.log("=== RUNNING TEMPLATE ENGINE TEST SUITE ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// TEST 1: PlaceholderResolver - Safe HTML escaping & Placeholders
{
  const rawHtml = "<h1>{{groomName}}</h1><p>{{venue}}</p><b>{{story}}</b>";
  const data = {
    groomName: "Rahul <script>alert(1)</script>",
    venue: "Indore Palace & Gardens",
    story: "Love 'forever' & \"always\"",
  };

  const output = resolvePlaceholders(rawHtml, data);
  assert(
    !output.includes("<script>"),
    "XSS script tag in customer input must be escaped"
  );
  assert(
    output.includes("&lt;script&gt;"),
    "Script tags properly escaped to &lt;script&gt;"
  );
  assert(
    output.includes("Indore Palace &amp; Gardens"),
    "Ampersands safely escaped"
  );
  assert(
    output.includes("&#039;forever&#039;"),
    "Single quotes safely escaped"
  );
}

// TEST 2: DesignSettingsManager - CSS Variables
{
  const definitions = [
    { key: "backgroundColor", label: "BG", type: "color", default: "#3b0914" },
    { key: "headingFont", label: "Font", type: "font", default: "Playfair Display" },
  ];
  const overrides = { backgroundColor: "#8b0000" };

  const css = compileDesignSettingsCss(definitions, overrides);
  assert(css.includes("--background-color: #8b0000;"), "CSS variable overrides applied");
  assert(css.includes("--heading-font: \"Playfair Display\", serif;"), "CSS font variable generated with fallback");

  const sampleHtml = "<html><head><title>Test</title></head><body>Hello</body></html>";
  const injected = injectDesignSettingsIntoHtml(sampleHtml, definitions, overrides);
  assert(injected.includes("<style id=\"vv-dynamic-design-settings\">"), "Injected style block into head");
}

// TEST 3: RenderingEngine - Relative URL Rewriter
{
  const rawHtml = '<link href="css/style.css"><img src="assets/bg.png"><a href="https://google.com">Link</a>';
  const rewritten = rewriteAssetUrls(rawHtml, "/templates/royal-wedding");
  assert(
    rewritten.includes('href="/templates/royal-wedding/css/style.css"'),
    "Relative CSS link rewritten to public template asset path"
  );
  assert(
    rewritten.includes('src="/templates/royal-wedding/assets/bg.png"'),
    "Relative img src rewritten to public template asset path"
  );
  assert(
    rewritten.includes('href="https://google.com"'),
    "Absolute external URLs kept intact"
  );
}

// TEST 4: ManifestValidator - Valid and Invalid Schemas
{
  const validManifest = {
    name: "Royal Wedding",
    customerFields: [
      { key: "groomName", label: "Groom Name", type: "text", required: true },
    ],
    designSettings: [
      { key: "bg", label: "BG", type: "color", default: "#fff" },
    ],
  };

  const valResult = validateManifestSchema(validManifest);
  assert(valResult.valid === true, "Valid manifest passes validation");

  const invalidManifest = {
    name: "",
    customerFields: [{ key: "bad key with spaces!", label: "Bad", type: "invalid_type" }],
  };
  const valResultBad = validateManifestSchema(invalidManifest);
  assert(valResultBad.valid === false, "Invalid manifest rejected with errors");
  assert(valResultBad.errors.length >= 2, "Reports specific validation errors");
}

// TEST 5: Compatibility Check
{
  const oldManifest = {
    name: "Old Theme",
    entry: "index.html",
    customerFields: [
      { key: "groomName", label: "Groom", type: "text", required: true },
      { key: "venue", label: "Venue", type: "text", required: true },
    ],
    designSettings: [],
  };

  // Breaking update: removed required venue, added new required without default
  const breakingManifest = {
    name: "New Theme",
    entry: "index.html",
    customerFields: [
      { key: "groomName", label: "Groom", type: "text", required: true },
      { key: "newRequiredField", label: "New Required", type: "text", required: true },
    ],
    designSettings: [],
  };

  const compat = checkManifestCompatibility(oldManifest, breakingManifest, 5);
  assert(compat.compatible === false, "Detected breaking changes between manifests");
  assert(compat.breakingChanges.length === 2, "Identified both removed required and missing default");
  assert(compat.affectedWeddingsCount === 5, "Reports correct affected weddings count");
}

// TEST 6: ZipValidator on real royal-wedding.zip
{
  const zipPath = path.join(process.cwd(), "public", "templates", "royal-wedding.zip");
  if (fs.existsSync(zipPath)) {
    const buf = fs.readFileSync(zipPath);
    const result = validateTemplateZip(buf);
    assert(result.valid === true, "royal-wedding.zip passes all security and schema validations");
    assert(result.manifest && result.manifest.name.length > 0, "Correctly extracted manifest from zip");
  } else {
    console.warn("royal-wedding.zip not found on disk, skipping zip test");
  }
}

// TEST 7: Security - Malicious ZIP Traversal (Zip Slip)
{
  const maliciousZip = new AdmZip();
  maliciousZip.addFile("evil.js", Buffer.from("console.log('pwned')"));
  maliciousZip.addFile("manifest.json", Buffer.from(JSON.stringify({ name: "evil" })));
  maliciousZip.addFile("index.html", Buffer.from("<h1>evil</h1>"));
  // Force malicious raw traversal entry name
  maliciousZip.getEntries()[0].entryName = "../../../evil.js";
  const malBuf = maliciousZip.toBuffer();

  const secResult = validateTemplateZip(malBuf);
  assert(secResult.valid === false, "Malicious Zip Slip archive strictly rejected");
  assert(
    secResult.errors.some((e) => e.includes("Security violation") || e.includes("path traversal")),
    "Reports security violation error for path traversal"
  );
}

console.log("\n=======================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================\n");

if (failed > 0) {
  process.exit(1);
}
