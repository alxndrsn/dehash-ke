const crypto = require('node:crypto');
const fs = require('node:fs');
const log = require('./log')('generate-hashes');

const hashTypes = ['sha256'];

const apiPath = 'v1/phone';
const root = `dist/${apiPath}`;

const prefLen = 4;
const prefBits = Math.pow(16, prefLen);

log('Building data structures for hash types:', hashTypes, '...');
const hashes = {};
for(const hashType of hashTypes) {
  fs.mkdirSync(`${root}/${hashType}`, { recursive:true });
  hashes[hashType] = {};
  for(let i=0; i<prefBits; i++) {
    const hex = hexify(i);
    hashes[hashType][hex] = {};
  }
}
log('Data structures built.');

const prefixes = [
  '254110',
  '254111',
  '254740',
  '254741',
  '254742',
  '254723',
  '254746',
  '254748',
  '254790',
  '254791',
  '254792',
  '254793',
  '254794',
  '254795',
  '254796',
  '254797',
  '254798',
  '254799',
].filter((_, idx) => !process.env.DEV || idx < 2);

log('Generating hashes...');
for(const prefix of prefixes) {
  for(let i=0; i<1_000_000; ++i) {
    const num = prefix + i.toString().padStart(6, '0');
    for(const hashType of hashTypes) {
      const hash = crypto.createHash(hashType).update(num).digest('hex');
      const prefix = hash.substr(0, prefLen);
      const rest = hash.substr(prefLen);
      hashes[hashType][prefix][rest] = num;
    }
  }
}
log('All hashes generated.');

log('Generating data files...');
for(const hashType of hashTypes) {
  for(let i=0; i<prefBits; i++) {
    const hex = hexify(i);
    const jsonPath = `${root}/${hashType}/${hex}.json`;
    fs.writeFileSync(jsonPath, JSON.stringify(hashes[hashType][hex]));
  }
}
log('Data files generated.');

function hexify(x) {
  return x.toString(16).padStart(prefLen, '0');
}
