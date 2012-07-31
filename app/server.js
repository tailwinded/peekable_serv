var http = require('http')
  ,	server = http.createServer(handler)
  ,	Communicator = require('./node-MaxComm');

var dispatcher = require("./dispatcher");
server.listen(3000);

function handler(req, res){
  //wrap calls in a try catch
  //or the node js server will crash upon any code errors
  try {
    //dispatch our request
    dispatcher.dispatch(req, res); 
  } catch (err) {
    //handle errors gracefully
    console.log(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }  
}

var commu = new Communicator(43000,server);
