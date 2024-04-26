const { assert } = require('chai');

const dehash = require('.');

describe('dehash()', () => {
  [
    [ '979787e565dcd7c608e02a975c060503118215db9763783226fbeab2a0a32832', '254740123456' ],
  ].forEach(([ hash, expected ]) => {
    it(`should decode ${hash} to ${expected}`, async () => {
      // expect
      assert.equal(await dehash(hash), expected);
    });
  });
});
