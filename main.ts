// The Robot Vacuum's Best Excuse — validates one line, then writes it to
// entry.txt in $MAKEFUN_OUTPUT_DIR (default: /output).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 140;
const OUTPUT_FILENAME = "entry.txt";
const DEFAULT_OUTPUT_DIR = "/output";

const LINE =
  "My LiDAR spent twenty minutes cleaning its own reflection in the hallway mirror, then logged the mirror as spotless and moved on.";

/** Fails loudly if the line is empty, whitespace-only, or over MAX_CHARS. */
function validateLine(line: string): string {
  if (line.trim().length === 0) {
    throw new Error("Invalid entry: the line is empty or only whitespace.");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `Invalid entry: the line is ${line.length} characters, the limit is ${MAX_CHARS}.`,
    );
  }
  return line;
}

function main(): void {
  const line = validateLine(LINE);
  // An unset or empty MAKEFUN_OUTPUT_DIR falls back to the default.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || DEFAULT_OUTPUT_DIR;
  mkdirSync(outDir, { recursive: true });
  // UTF-8, no trailing newline.
  writeFileSync(join(outDir, OUTPUT_FILENAME), line, "utf8");
}

main();
