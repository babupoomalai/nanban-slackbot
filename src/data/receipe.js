var request = require("request");

var options = {
  method: 'GET',
  url: 'https://tasty.p.rapidapi.com/recipes/list',
  qs: {tags: 'under_30_minutes', from: '0', sizes: '20'},
  headers: {
    'x-rapidapi-host': 'tasty.p.rapidapi.com',
    'x-rapidapi-key': 'DL8MVHW8J3RsTipw1KhlcXZ1G22AAvOL'
  }
};

request(options, function (error, response, body) {
    console.log(" in response ");
	if (error) throw new Error(error);

	console.log(body);
});