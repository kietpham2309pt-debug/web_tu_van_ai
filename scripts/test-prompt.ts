// Dump prompt for KB-07-B + chosen layout/style and run smoke checks.
// Usage: npx tsx scripts/test-prompt.ts [layout] [style]
//   layout: i-shape | l-shape | u-shape | island   (default: l-shape)
//   style:  modern | scandi | luxury | industrial   (default: modern)
import { buildComposePrompt } from "../src/lib/kitchen-prompt";
import { SCENARIOS } from "../src/data/scenarios";
import type { KitchenLayout, KitchenStyle } from "../src/lib/kitchen-prompt";

const layout = (process.argv[2] || "l-shape") as KitchenLayout;
const style = (process.argv[3] || "modern") as KitchenStyle;

const scenario = SCENARIOS.find((s) => s.id === "KB-07")!;
const tier = scenario.tiers.find((t) => t.tier === "B")!;

const prompt = buildComposePrompt({
  layout,
  style,
  scenario,
  tier,
  referencedItems: tier.items,
});

console.log("=".repeat(80));
console.log(`COMBO: KB-07-B · ${layout} · ${style} · 6 items`);
console.log("=".repeat(80));
console.log("\nITEMS:");
tier.items.forEach((it, i) => {
  console.log(`  ${i + 1}. [${it.role}] ${it.fallbackName} (SKU: ${it.sku})`);
});
console.log(`\nPROMPT LENGTH: ${prompt.length} chars\n`);
console.log("--- PROMPT ---\n");
console.log(prompt);
console.log("\n" + "=".repeat(80));

const checks: { label: string; re: RegExp }[] = [
  { label: "REFERENCE ROSTER block",          re: /REFERENCE ROSTER/i },
  { label: "Image 1 = Bếp từ",                re: /Image 1 = B[ếe]p t[ừu]/i },
  { label: "Image 2 = Máy hút mùi",           re: /Image 2 = M[áa]y h[úu]t m[ùu]i/i },
  { label: "Image 3 = Máy rửa chén",          re: /Image 3 = M[áa]y r[ửu]a ch[éeé]n/i },
  { label: "Image 4 = Lò vi sóng",            re: /Image 4 = L[òo] vi s[óo]ng/i },
  { label: "Image 5 = Chậu rửa",              re: /Image 5 = Ch[ậa]u r[ửu]a/i },
  { label: "Image 6 = Vòi rửa",               re: /Image 6 = V[òo]i r[ửu]a/i },
  { label: "ALL 6 must appear",               re: /ALL 6 appliances/ },
  { label: "L-shape ép 2 cạnh tường",         re: /TWO PERPENDICULAR wall counter runs/ },
  { label: "Island carries ONLY cooktop",     re: /carries ONLY the cooktop/ },
  { label: "No sink on island",               re: /do NOT place the sink, faucet, dishwasher/ },
  { label: "Sink 2-hố-lệch siết kích thước",  re: /one LARGE main bowl.*one SMALL secondary bowl/ },
  { label: "Faucet gun-metal vs chrome",      re: /DIFFERENT FROM stainless steel and DIFFERENT FROM polished chrome/ },
  { label: "Cooktop 80cm wide",               re: /wide 80 cm induction cooktop/ },
  { label: "Cooktop 4 zones distinct circles",re: /separate printed circle/ },
  { label: "Microwave âm tủ flush-mount",     re: /built-in compact microwave.*flush-mounted/ },
  { label: "Camera L+island thấy 3 surfaces", re: /THREE separate cabinetry surfaces/ },
  { label: "FINAL SELF-CHECK block",          re: /FINAL SELF-CHECK/ },
  { label: "Self-check (d) sink on wall",     re: /PERIMETER WALL counter run/ },
  { label: "Self-check (f) faucet finish",    re: /gun-metal stays gun-metal/ },
  { label: "No layout collapse",              re: /do NOT collapse the layout/ },
];

console.log("\n--- SMOKE CHECKS ---\n");
let pass = 0, fail = 0;
for (const c of checks) {
  const ok = c.re.test(prompt);
  console.log(`  ${ok ? "✓" : "✗"}  ${c.label}`);
  ok ? pass++ : fail++;
}
console.log(`\nResult: ${pass}/${checks.length} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
