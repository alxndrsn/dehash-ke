const crypto = require('node:crypto');
const fs = require('node:fs');
const log = require('./log')('generate-hashes');
const numPrefixes = require('./prefixes');

const apiPath = 'v1/phone';
const root = `dist/${apiPath}`;

const prefLen = 4;
const prefBits = Math.pow(16, prefLen);

log('Building data structures...');
const hashes = {};
fs.mkdirSync(`${root}/sha256`, { recursive:true });
for(let i=0; i<prefBits; ++i) {
  const prefix = hexify(i);
  hashes[prefix] = {};
}
log('Data structures built.');

log('Generating hashes...');
for(const numPrefix of numPrefixes) {
  for(let i=0; i<1_000_000; ++i) {
    const num = numPrefix + i.toString().padStart(6, '0');
    const hash = crypto.createHash('sha256').update(num).digest('hex');
    const prefix = hash.substr(0, prefLen);
    const rest = hash.substr(prefLen);
    hashes[prefix][rest] = num;
  }
}
log('All hashes generated.');

log('Generating data files...');
for(let i=0; i<prefBits; i++) {
  const prefix = hexify(i);
  const jsonPath = `${root}/sha256/${prefix}.json`;
  fs.writeFileSync(jsonPath, JSON.stringify(hashes[prefix]));
  delete hashes[prefix];
}
log('Data files generated.');

function hexify(x) {
  return x.toString(16).padStart(prefLen, '0');
}
