/**
 * Created by mattjohansen on 12/9/13.
 *
 * Function that takes an array of request objects & an integer
 * Parses into an array of objects of n-grams (sub strings of n length)
 * Resulting Objects also include attack flag from request object
 *
 */

module.exports = function(data, n) {
  var ngramArray = [];

  for (var x = 0; x < data.length; x++) {
    var url = data[x].url;

    for(var i = 0; i <= url.length - n; i++) {
      var ngramObj = {
        str: url.substring(i, i + n),
        attack: data[x].attack
      }
      ngramArray.push(ngramObj);
    }

  }

  return ngramArray;
}