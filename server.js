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
  current: 		{ type: Boolean, required: true }
});

var Item = mongoose.model('item', itemSchema);

server.get("/items", function (req, res) {
	Item.find(function (err, items) {
	  if (err) return console.error(err);
	  res.json(items)
	})
});

server.post("/new", function (req, res) {

	var newItem = new Item({
		value: 		req.body.value,
		current:    req.body.current
	});
	
	newItem.save(function (err, item) {
	  if (err) return console.log(err)
	  res.json(item);
	});

});

server.post("/update", function (req, res) {

	var list = req.body;

	var completed = 0;

	var finished = function () {
		console.log(list)
		completed++;
		if (completed === list.length)
			res.json("hello")
	}

	for (var i in list) {
		Item.update(
			{ _id: list[i]._id },
			{ $set: {
				"value": 		list[i].value,
				"created": 		list[i].created,
				"backlogged": 	list[i].backlogged,
				"current": 		list[i].current}
			},
			{multi: false},
			function (err) {
				if (err) return console.log(err);
				finished();
			}
		);
	}
});

server.post("/delete", function (req, res) {
	console.log(req.body)
	Item.findByIdAndRemove({_id: req.body._id}, function (err) {
		if (err) return console.log(err);
		res.json("done")
	})
});


var port = process.env.PORT || 3000;
server.listen(port)