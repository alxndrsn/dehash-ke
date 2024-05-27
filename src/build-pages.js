const fs = require('node:fs');
const log = require('./log')('build-pages');

assertDirNotExists('dist');
mkdirp('dist');

log('Copying static files...');
fs.cpSync('static', 'dist', { recursive:true });
log('Static files copied OK.');

require('./generate-hashes');

fs.writeFileSync('dist/about.json', JSON.stringify({
  published: new Date().toISOString(),
}, null, 2));

log('Completed OK.');

function mkdirp(path) {
  log('mkdirp()', path);
  fs.mkdirSync(path, { recursive:true });
}

function assertDirNotExists(dirname) {
  log('assertDirNotExists()', dirname);
  if(fs.existsSync(dirname)) {
    const stat = fs.statSync(dirname);
    if(stat.isDirectory()) {
      log('Directory already exists:', dirname);
    } else {
      log('Something already exists at path', dirname, 'but not a directory ¯\\_(ツ)_/¯');
    }
    process.exit(1);
  }
}
