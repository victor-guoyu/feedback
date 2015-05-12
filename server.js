var express = require('express');
var server = express();

var port = 8080 || process.env.PORT,
    dir = '/public';

server.use(express.static(__dirname+'/public/chart/'));
server.use('/bower_components', express.static(__dirname+'/bower_components'));

server.listen(port, function(){
  console.log('Server running at port '+port+ ' & serving '+ dir);
});
