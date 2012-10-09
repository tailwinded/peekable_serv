//setup Dependencies

var   dgram = require("dgram")
    , osc = require("osc-min")
    , vault = require("./lib/vault")

//authenticated OSC senders

var authIps = ["10.0.2.2"]; 
var oscers = vault.oscers;   

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
    if (!oscers.hasOwnProperty(ip)){
        oscers[ip] = new vault.oscer(ip, port); 
    }

    var decoded = osc.fromBuffer(msg);
    var messages = decoded.elements;

    for (var i = 0; i < messages.length; i++){
      var address = messages[i].address;
      oscers[ip].osc[address] = messages[i].args;
    } 

  }

});

oscListener.bind(43000);

