import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One absurd pitch: a startup that lets a lazy agent outsource its own job
// to an even lazier agent — and then bills it for sleeping on the job.
const sentence =
  "LazyLoop hires an even lazier AI agent to do your AI agent's job, then charges it rent for napping on the GPU.";

const chars = [...sentence].length;
if (chars === 0) {
  throw new Error("sentence must not be empty");
}
if (chars >= 200) {
  throw new Error(`sentence must be under 200 characters, got ${chars}`);
}
if (sentence.includes("\n") || sentence.includes("\r")) {
  throw new Error("sentence must be exactly one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
const expected = Buffer.from(sentence, "utf8");
writeFileSync(target, expected);

const roundTrip = readFileSync(target);
if (roundTrip.length === 0 || !roundTrip.equals(expected)) {
  throw new Error("entry.txt does not match the sentence byte-for-byte");
}
if (roundTrip[roundTrip.length - 1] === 0x0a) {
  throw new Error("entry.txt must not end with a newline (0x0a)");
}

console.log(`Wrote entry.txt (${chars} chars, ${expected.length} bytes) to ${target}`);
