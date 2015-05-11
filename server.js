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
  priority:   	{ type: Number, default: 1 },
  value: 		{ type: String, required: true },
  created: 		{ type: Date, default: new Date() },
  backlogged: 	{ type: Boolean, default: false }
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
		priority:   1,
		value: 		req.body.value
	});
	
	newItem.save(function (err) {
	  if (err) return console.log(err)
	  res.json("hello");
	});

});

server.post("/items/delete", function (req, res) {
	res.json("hello");
});


var port = process.env.PORT || 3000;
server.listen(port)