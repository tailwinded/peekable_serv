//setup Dependencies

var   dgram = require("dgram"), 
      store = require("./lib/osc-store");

//authenticated OSC senders

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
    }

    store.updateSession(ip, msg);
    console.log(store.sessions);
  }

});

oscListener.bind(43000);

