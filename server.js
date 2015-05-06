var express = require('express');
var server = express();

var port = 8080,
	dir = '/public';

server.use(express.static(__dirname+'/public'));

server.listen(8080);

console.log('Server running at port '+port+ ' & serving '+ dir);