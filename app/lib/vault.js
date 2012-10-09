var Vault = exports;

Vault.oscers = {};

Vault.oscer = function(address, port){
	this.address = address;
	this.port = port;
	this.messages = [];
}