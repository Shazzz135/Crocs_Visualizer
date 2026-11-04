import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const MAX_LINES = 250;
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'graphify-out',
  '.gemini',
  '.vscode',
]);
const TARGET_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.py',
  '.css',
]);

function countLines(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function scanDir(dirPath, violations = []) {
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      scanDir(fullPath, violations);
    } else if (stats.isFile() && TARGET_EXTENSIONS.has(extname(fullPath))) {
      const lines = countLines(fullPath);
      if (lines > MAX_LINES) {
        violations.push({ path: fullPath, lines });
      }
    }
  }
  return violations;
}

const rootDir = process.cwd();
console.log(`[audit] Auditing source files for max ${MAX_LINES} lines...`);
const violations = scanDir(rootDir);

if (violations.length > 0) {
  console.error(`\n[ERROR] Found ${violations.length} file(s) exceeding ${MAX_LINES} lines:`);
  for (const v of violations) {
    console.error(`  - ${v.path}: ${v.lines} lines (exceeds limit by ${v.lines - MAX_LINES})`);
  }
  process.exit(1);
} else {
  console.log(`[audit] PASS: All scanned source files comply with the ${MAX_LINES}-line limit.`);
}
