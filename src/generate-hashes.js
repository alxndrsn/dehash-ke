const crypto = require('node:crypto');
const fs = require('node:fs');
const log = require('./log')('generate-hashes');

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

// List from: https://en.wikipedia.org/wiki/Telephone_numbers_in_Kenya#Mobile_operators
const numPrefixes = [
  '254110', '254111', '254112', '254113', '254114', '254115', '254116', '254117', '254118', '254119',
  '254701', '254702', '254703', '254704', '254705', '254706', '254707', '254708', '254709',
  '254710', '254711', '254712', '254713', '254714', '254715', '254716', '254717', '254718', '254719',
  '254720', '254721', '254722', '254723', '254724', '254725', '254726', '254727', '254728', '254729',
  '254740', '254741', '254742', '254743', '254745', '254746', '254748',
  '254757', '254758', '254759',
  '254768', '254769',
  '254790', '254791', '254792', '254793', '254794', '254795', '254796', '254797', '254798', '254799',
].filter((_, idx) => !process.env.DEV || idx < 2);

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
