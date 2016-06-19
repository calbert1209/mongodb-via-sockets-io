var app = require('express')();
var http = require('http').Server(app),
		io = require('socket.io')(http),
		count = 0;
		
require('dotenv').load();


// CONNECT TO DATABASE
// =====================================================================
var mongoose   = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
// use the Schema created in time.js
var Time = require('./time');


// ROUTING FOR CLIENT VIEW
// =====================================================================

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// ROUTING FOR WEB SOCKETS
// =====================================================================

io.on('connection', function(socket){
  
  var userId = socket.id;
  count += 1;
  console.log('connection added:', userId);
  console.log('users:', count);
  
  
  socket.on('query', function(qry){
    // reporting
    console.log(userId, 'query:',qry);
    var q = JSON.parse(qry);
    
    Time.find(q, {_id:0}, function(err, stop_times){
					if (err) io.emit('chat message', err);
					
					var nextTwoTimes = stop_times.slice(0,2);
					io.emit('chat message', 'query: ' + qry);
					io.emit('chat message','response: ' + nextTwoTimes);
			});
  });
  
  socket.on('disconnect', function(){
    count = (count > 0) ? count - 1 : 0;
    console.log('connection ended');
    console.log('users:', count);
  });
  
});

// LISTENING ON PORT 3030
// =====================================================================

http.listen(3000, function(){
  console.log('listening on *:3030');
});
