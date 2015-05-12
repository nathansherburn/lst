var express 	= require('express');
var mongoose	= require('mongoose');
var bodyParser 	= require('body-parser')
var server 		= express();

server.use(express.static(__dirname + '/public'));

var mongoURI = 'mongodb://localhost/test';
mongoose.connect(process.env.MONGOLAB_URI || mongoURI);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

server.use(allowCrossDomain);
server.use(bodyParser.json());

// break out
var itemSchema = new mongoose.Schema({
  value: 		{ type: String, required: true },
  created: 		{ type: Date, default: new Date() },
  backlogged: 	{ type: Boolean, default: false },
  current: 		{ type: Boolean, default: false }
});

var Item = mongoose.model('item', itemSchema);

server.get("/items", function (req, res) {
	Item.find(function (err, items) {
	  if (err) return console.error(err);
	  res.json(items)
	})
});

server.post("/items/add", function (req, res) {

	var newItem = new Item({
		value: 		req.body.value
	});
	
	newItem.save(function (err, item) {
	  if (err) return console.log(err)
	  res.json(item);
	});

});

server.post("/items/backlog", function (req, res) {
	Item.update(
		{ _id: req.body._id },
		{ $set: { "backlogged": req.body.backlogged } },
		{multi: false},
		function (err) {
			if (err) return console.log(err);
			res.json("hello")
	});
});

server.post("/items/current", function (req, res) {
console.log(req.body)
	Item.update(
		{/* find all */},
		{current: false},
		{multi: true},
		function (err) {
			if (err) return console.log(err);
			setCurrent();
	});

	var setCurrent = function () {
		Item.update(
			{_id: req.body._id},
			{current: true},
			{multi: false},
			function (err) {
				if (err) return console.log(err);
				res.json("hello")
		});
	}
});

server.post("/items/delete", function (req, res) {
	Item.findByIdAndRemove({_id: req.body._id}, function (err) {
		if (err) return console.log(err);
		res.json("done")
	})
});


var port = process.env.PORT || 3000;
server.listen(port)