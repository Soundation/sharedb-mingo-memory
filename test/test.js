var expect = require('expect.js');
var ShareDBMingo = require('../index');
var getQuery = require('../get-query');

function create(callback) {
  var db = ShareDBMingo();
  callback(null, db);
}

require('@teamwork/sharedb/test/db')({create: create, getQuery: getQuery});

describe('db', function() {
  beforeEach(function() {
    this.db = new ShareDBMingo();
  });

  describe('query', function() {
    require('./query')();

    // No idea how query was supposed to fail with an "Unsupported" message.
    // I searched the whole history of mingo and the word "Unsupported" does appear there at all.
    // I searched using:
    // git log -GUnsupported --all
    // git log -SUnsupported --all
    // Before updating mocha to 5.2.0 this test was a false positive
    // because mocha didn't crash on the uncaught assertion error.
    // Notice there is no `done` callback, so the test passed synchronously
    // and the assertion error was thrown asynchronously.
    it.skip('unsupported', function() {
      this.db.query('testcollection', {$mapReduce: []}, null, null, function(err, results) {
        expect(err).ok();
        expect(err.message).match(/Unsupported/);
      });
    });
  });
});

describe('getQuery', function() {
  it('basic', function() {
    expect(getQuery({query: {foo: 2}, sort: []}))
      .eql({foo: 2});
    expect(getQuery({query: {foo: 2}, sort: [['foo', -1]]}))
      .eql({foo: 2, $sort: {foo: -1}});
    expect(getQuery({query: {foo: 2}, sort: [['foo', 1], ['bar', -1]]}))
      .eql({foo: 2, $sort: {foo: 1, bar: -1}});
  })
});
