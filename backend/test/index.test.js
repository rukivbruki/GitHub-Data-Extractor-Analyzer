const assert = require('assert').strict;

describe('first test', function () {
  it('should be able to run', function () {
    assert.strictEqual([1, 2, 3].indexOf(4), -1);
  });
});
