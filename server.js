var express = require('express');
var server = express();

server.use("/public", express.static(__dirname + '/public'));

server.get("/", function (req, res) { res.send("hello"); } )

server.listen(3000);