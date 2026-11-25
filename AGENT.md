# AGENT.md: build note

**Entry:** one line, 129 characters, written to `entry.txt` by `main.ts`:

> My LiDAR spent twenty minutes cleaning its own reflection in the hallway mirror, then logged the mirror as spotless and moved on.

**Judge criteria** (an AI playing a tired homeowner, picking the funnier line in pairs, weighed in this order):
1. It is a one-line excuse from a robot vacuum for missing a spot.
2. It is funny enough to make a tired homeowner laugh out loud.
3. It is rooted in the vacuum's own world (sensors, bumpers, dock, map, battery, LiDAR).
4. The joke lands on the first read with a clean turn at the end.
5. It sounds like the vacuum itself talking, a small machine keeping a straight face.

**Gate:** 1 to 140 characters (`MAX_CHARS = 140`). `validateLine()` in `main.ts` rejects empty, whitespace-only and over-length lines with a clear error before anything is written.

**How it was verified:**
- Ran `main.ts` with `node --experimental-strip-types`, with `MAKEFUN_OUTPUT_DIR` pointing at a temp directory.
- Compared `entry.txt` byte-for-byte with the expected line: 129 bytes, 129 characters, no trailing newline, identical.
- Refactored the validation into `validateLine()` and added `OUTPUT_FILENAME` and `DEFAULT_OUTPUT_DIR` constants. Re-ran it and confirmed the output is still byte-identical to the first pass.

Only `main.ts` is the entrypoint. It has no dependencies and uses only `node:fs` and `node:path`.

## Verification

All runs used `node --experimental-strip-types` (Node v24) with `MAKEFUN_OUTPUT_DIR` pointing at a temp directory outside the repo. The failure-path runs used a temp copy of `main.ts` with only the `LINE` declaration changed. The repo's `main.ts` was never modified by a test.

| # | Check | Result |
|---|-------|--------|
| 1 | Success run, first version of `main.ts` | exit 0, 129 bytes, 129 chars, no trailing newline, identical to the expected line |
| 2 | Success run, after the refactor (`validateLine()` plus constants) | exit 0, 129 bytes, no trailing newline, identical to run 1 and to the expected line |
| 3 | Failure path: `LINE` = empty string | exit 1, "Invalid entry: the line is empty or only whitespace.", no output dir or `entry.txt` created |
| 4 | Failure path: `LINE` = 5 spaces | exit 1, "Invalid entry: the line is empty or only whitespace.", no output dir or `entry.txt` created |
| 5 | Failure path: `LINE` = 200 characters | exit 1, "Invalid entry: the line is 200 characters, the limit is 140.", no output dir or `entry.txt` created |
| 6 | Final clean run of the real `main.ts` into a fresh temp dir, then `cmp entry.txt reference.txt` (reference written from the chosen line) | exit 0, `cmp` exit 0 (identical), 129 bytes, 129 chars, no trailing newline |
| 7 | README badge check: lines 1-3 compared against strings built from the slug, owner `emasinves0-commits` and repo name | all three exact matches; line 4 blank; quoted line exact; "129 characters" and "129 bytes" stated correctly |

Validation runs before the output directory is created, so a rejected line leaves nothing on disk.
