var express 	= require('express');
var mongoose	= require('mongoose');
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

app.use(allowCrossDomain);

// break out
var itemSchema = new mongoose.Schema({
  priority:   	{ type: Number, required: true },
  created: 		{ type: Date, default: new Date() },
  value: 		{ type: String, required: true }
});


server.get("/items", function (req, res) {

});

server.post("/items/add", function (req, res) {

	var Item = mongoose.model('item', itemSchema);

	var newItem = new Item({
		priority:   1,
		value: 		"test"
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