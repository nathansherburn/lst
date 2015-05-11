var express 	= require('express');
var server 		= express();
var mongoose	= require('mongoose');

server.use(express.static(__dirname + '/public'));

server.get("/items", function (req, res) {
	res.json("hello");
});

server.post("/items/add", function (req, res) {
	res.json("hello");
});

server.post("/items/delete", function (req, res) {
	res.json("hello");
});


var port = process.env.PORT || 3000;
server.listen(port)