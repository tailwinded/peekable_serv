/*
 * oscStore contains sessions with associated address:port 
 * and a map with current OSC addresses and their values.
 */

var osc = require("osc-min"),
	oscStore = exports;

oscStore.sessions = function(){};

oscStore.addSession = function (id, address, port){
	
	var sessionId;

	typeof id != "undefined" ? sessionId = id : sessionId = address;

	oscStore.sessions[sessionId] = {
		address : address,
		port : port,
		map : {}
	}
};

oscStore.updateSession = function (session, oscData){

	var decoded = osc.fromBuffer(oscData);
    var oscElements = decoded.elements;

	for (var i = 0; i < oscElements.length; i++){
      var address = oscElements[i].address;
      var args = oscElements[i].args;
      oscStore.sessions[session].map[address] = args;
    } 
};