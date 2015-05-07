var express = require('express');
var server = express();

server.use("/public", express.static(__dirname + '/public'));

server.get("/", function (req, res) { res.send("hello"); } )

var port = process.env.PORT || 3000;
server.listen(port)