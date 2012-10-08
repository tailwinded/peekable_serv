//setup Dependencies
var   dgram = require("dgram")
    , osc = require("osc-min");


var udpsock = dgram.createSocket("udp4");


udpsock.on("listening", function () {
  var address = udpsock.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

udpsock.bind(43000);

udpsock.on("message", function (msg, rinfo) {

      var oscmsg = osc.fromBuffer(msg);
      var oscargs = oscmsg.elements[0];
      console.log('server_message', oscargs, rinfo);
});

