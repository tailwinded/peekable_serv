/* Author: YOUR NAME HERE
*/
counter= 0;
$(document).ready(function() {   

  var socket = io.connect();

  $('#sender').bind('click', function() {
   socket.emit('message', 'Message Sent on ' + new Date());     
  });

  socket.on('server_message', function(data){
  	counter++;
  	if (counter%60==0)
		console.log(data);
	volume = data.volume;
  });
});