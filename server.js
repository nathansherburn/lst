var express = require('express');
var server = express();

server.use(express.static(__dirname + '/public'));

server.ger("/", function (req, res) { send("hello"); } )

server.listen(3000);