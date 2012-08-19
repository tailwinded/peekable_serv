/* Author: YOUR NAME HERE
*/
counter= 0;
$(document).ready(function() {   

  var socket = io.connect();

  $('#sender').bind('click', function() {
   socket.emit('message', 'Message Sent on ' + new Date());     
  });

  socket.on('server_message', function(data){
	volume = data.volume;
	freqs = data.freqs;
  });
});