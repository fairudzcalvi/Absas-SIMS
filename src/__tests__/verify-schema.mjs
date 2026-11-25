// Read-only live schema check: compares tables/columns the frontend queries
// against the live Supabase database (via the PostgREST OpenAPI spec exposed
// to the anon key already used by the app). Performs only GET requests.
//
// Usage: node src/__tests__/verify-schema.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function loadEnv() {
  const env = { ...process.env };
  const p = path.join(root, '.env');
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const URL_ = env.VITE_SUPABASE_URL;
const KEY = env.VITE_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
  process.exit(2);
}
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

/* ---------- 1. Collect columns used by the frontend, per table ---------- */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '__tests__') walk(p, out); }
    else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const used = {}; // table -> Map(column -> Set(files))
function addCol(table, col, file) {
  col = col.trim();
  if (!col || col === '*' || !/^[a-z_][a-z0-9_]*$/i.test(col)) return;
  used[table] ??= new Map();
  if (!used[table].has(col)) used[table].set(col, new Set());
  used[table].get(col).add(file);
}
function splitTop(s) {
  const parts = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}

const embeds = []; // relationship selects we can't check column-wise
for (const file of walk(path.join(root, 'src'))) {
  const code = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const re = /\.from\(\s*'([a-z_]+)'\s*\)/g;
  let m;
  while ((m = re.exec(code))) {
    const table = m[1];
    if (!/^[a-z_]+$/.test(table)) continue;
    used[table] ??= new Map();
    // chain text: until next .from( or 700 chars
    const rest = code.slice(re.lastIndex, re.lastIndex + 700);
    const next = rest.indexOf('.from(');
    const chain = next >= 0 ? rest.slice(0, next) : rest;

    for (const s of chain.matchAll(/\.select\(\s*(['"`])([\s\S]*?)\1/g)) {
      for (const part of splitTop(s[2])) {
        const t = part.trim();
        if (t.includes('(')) { embeds.push(`${table}: ${t.replace(/\s+/g, ' ')} (${rel})`); continue; }
        addCol(table, t.split(':').pop().trim(), rel);
      }
    }
    for (const s of chain.matchAll(/\.(?:eq|neq|ilike|like|gt|gte|lt|lte|is|in|order|contains)\(\s*'([a-z_][a-z0-9_]*)'/gi)) addCol(table, s[1], rel);
    for (const s of chain.matchAll(/\.or\(\s*[`'"]([^`'"]*)[`'"]/g)) for (const o of s[1].matchAll(/(?:^|,)\s*([a-z_][a-z0-9_]*)\.(?:eq|neq|ilike|like|is|in|gt|gte|lt|lte)\./gi)) addCol(table, o[1], rel);
    for (const s of chain.matchAll(/onConflict:\s*'([^']+)'/g)) s[1].split(',').forEach(c => addCol(table, c, rel));
  }
}

/* ---------- 2. Probe live DB with the anon key (same access the app uses) ---------- */
// The OpenAPI schema endpoint needs a service_role key, which we deliberately do
// not use. Instead: HEAD-style GETs of `select=<col>&limit=0` per table/column.
// 404/PGRST205 => table missing; 400/42703 => column missing.
async function probe(table, select) {
  const r = await fetch(`${URL_}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=0`, { headers });
  if (r.ok) return { ok: true };
  let body = {};
  try { body = await r.json(); } catch { /* ignore */ }
  return { ok: false, status: r.status, code: body.code, message: body.message ?? '' };
}

let problems = 0;
const tables = Object.keys(used).sort();
console.log(`Frontend references ${tables.length} tables.\n`);

for (const t of tables) {
  const first = await probe(t, '*');
  if (!first.ok) {
    problems++;
    const missing = first.code === 'PGRST205' || first.status === 404;
    console.log(`[${missing ? 'MISSING TABLE' : 'BROKEN QUERY'}] ${t}: HTTP ${first.status} ${first.code ?? ''} ${first.message}`);
    continue;
  }
  const cols = [...used[t].keys()];
  const missing = [];
  const other = [];
  for (const c of cols) {
    const r = await probe(t, c);
    if (r.ok) continue;
    if (r.code === '42703' || /does not exist/i.test(r.message)) missing.push(c);
    else other.push(`${c}: HTTP ${r.status} ${r.code ?? ''} ${r.message}`);
  }
  if (missing.length || other.length) {
    problems += missing.length + other.length;
    console.log(`[PROBLEMS] ${t}`);
    for (const c of missing) console.log(`    - missing column: ${c}   (used in ${[...used[t].get(c)].join(', ')})`);
    for (const o of other) console.log(`    - ${o}`);
  } else {
    console.log(`[OK] ${t} (${cols.length} columns checked)`);
  }
}
if (embeds.length) {
  console.log('\nRelationship selects (not column-checked; verify FKs exist):');
  [...new Set(embeds)].forEach(e => console.log('  ' + e));
}

console.log(`\n${problems === 0 ? 'No schema problems found.' : problems + ' problem(s) found.'}`);
console.log('Note: insert/update payload keys are not statically extracted; only select/filter/order/onConflict columns.');
process.exit(problems ? 1 : 0);


