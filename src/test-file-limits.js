const fs = require('node:fs');

let i=0;

while(true) {
  ++i;
  const ws = fs.createWriteStream(i + '.test');
  ws.write('hi');
}
