/**
 * Created by mattjohansen on 12/9/13.
 *
 * Tests for ngram.js
 *
 */

var ngram = require('../lib/algo/ngram');

var mocks = [
  {
    "headers" : {
      "accept" : "*/*",
      "host" : "mattjay.com"
    },
    "url" : "/blog/wp-content/themes/euclid/style.css",
    "method" : "GET",
    "dstc" : "8798067499883473",
    "remoteIP" : "192.185.82.158",
    "remotePort" : "34353",
    "attack" : "false",
    "body" : "",
    "_id" : 'ObjectId("5296c4d0b9e662eb5c000d92")',
    "attacks" : [ ],
    "requestedtimestamp" : 'ISODate("2013-11-28T04:21:36.705Z")',
    "__v" : 0
  },
  {
    "__v" : 0,
    "_id" : 'ObjectId("529ac8beb9e662eb5c008c66")',
    "attack" : "true",
    "attacks" : [ ],
    "body" : "",
    "dstc" : "3443352298345417",
    "headers" : {
      "accept" : "*/*",
      "user-agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
      "accept-encoding" : "gzip,deflate",
      "connection" : "Keep-alive",
      "host" : "blog.risk.io",
      "cookie" : "dstc=3443352298345417"
    },
    "method" : "GET",
    "remoteIP" : "168.61.82.252",
    "remotePort" : "4688",
    "requestedtimestamp" : 'ISODate("2013-12-01T05:27:26.980Z")',
    "url" : "/?param=-1+UNION+SELECT+GROUP_CONCAT(table_name)+FROM+information_schema.tables"
  }
]

describe('Trigram Parsing', function() {

  it('should be a function', function() {
    expect(typeof(ngram)).toBe('function');
  });

  it('should return an array', function() {
    var resultArray = ngram(mocks, 3);

    expect(typeof(resultArray)).toBe('object');
  });

  it('should have correctly parsed data', function() {
    var resultArray = ngram(mocks, 3);

    expect(resultArray[0].str).toBe('/bl');
    expect(resultArray[1].str).toBe('blo');
    expect(resultArray[1].attack).toBe('false');
  })

});