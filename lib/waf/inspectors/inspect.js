// Function to loop through inspectors and populate a match object

module.exports = function(reqObj, vulnClass) {
  var match = {
    type: vulnClass.type,
    ids: [],
    matches: [],
    score:0
  };

  for ( var i = 0; i < vulnClass.inspectors.length; i++) {
    if (vulnClass.inspectors[i].regex.test(reqObj.url)) {
      reqObj.attack = 'true';
      match.ids.push(vulnClass.inspectors[i].id);
      match.matches.push(reqObj.url.match(vulnClass.inspectors[i].regex)[0]);
      match.score = match.score + vulnClass.inspectors[i].score;
    }
    if (vulnClass.inspectors[i].regex.test(reqObj.body)) {
      reqObj.attack = 'true';
      match.ids.push(vulnClass.inspectors[i].id);
      match.matches.push(reqObj.body.match(vulnClass.inspectors[i].regex)[0]);
      match.score = match.score + vulnClass.inspectors[i].score;
    }
  }
  return (match.ids.length !== 0) ? match : 'No Match';
};