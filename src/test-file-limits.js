const fs = require('node:fs');

let i=0;

next();

function next() {
  ++i;
  const ws = fs.createWriteStream(i + '.test');
  ws.write('hi');
  setTimeout(next, 1);
}
