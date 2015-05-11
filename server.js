var express 	= require('express');
var server 		= express();
var mongoose	= require('mongoose');

server.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds037067.mongolab.com:37067/heroku_app36733834');

server.get("/items", function (req, res) {
	var Cat = mongoose.model('Cat', { name: String });

	var kitty = new Cat({ name: 'Zildjian' });
	kitty.save(function (err) {
	  if (err) return console.log(err)
	  res.json("hello");
	});
});

server.post("/items/add", function (req, res) {
	res.json("hello");
});

server.post("/items/delete", function (req, res) {
	res.json("hello");
});


var port = process.env.PORT || 3000;
server.listen(port)