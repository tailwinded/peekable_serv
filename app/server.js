//setup Dependencies

var   dgram = require("dgram"), 
      store = require("./lib/osc-store"),
      express = require('express'),
      backboneio = require('backbone.io');

//setup Express
var   app = express(),
      http = require('http'),
      server = http.createServer(app);

app.use(express.static(__dirname));

server.listen(3000);

//setup Backbone.io
var messages = backboneio.createBackend();
var mid = messages.use(backboneio.middleware.memoryStore());

backboneio.listen(server, {messages : messages}); 


//authenticated OSC senders, 10.0.2.2 is for tests before any real authentication is in place

var authIps = ["10.0.2.2"];   

//setup UDP socket to listen for OSC messages

var oscListener = dgram.createSocket("udp4");

oscListener.on("listening", function () {
  var address = oscListener.address();
  console.log("Listening for OSC messages on " +
              address.address + ":" + address.port);
});


oscListener.on("message", function (msg, rinfo) {

  var ip = rinfo.address;
  var port = rinfo.port;

  //check if incoming message is from authenticated address 
  if (authIps.indexOf(ip) != -1){

    //setup object per ip address to hold osc data it sends
    if (!store.sessions.hasOwnProperty(ip)){
        store.addSession(undefined, ip, port); 
        
        var req = {
                    method: 'create',
                    model: store.sessions[ip] ,
                    options: ''
        };
        mid.create(req, function(err, resp) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(resp);
                    }
        });


    }

    store.updateSession(ip, msg);
    console.log(mid);


    //messages.emit('updated', {session : store.sessions[ip]});
    //console.log(messages.stack);

  }

});

oscListener.bind(43000);


