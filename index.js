var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('dotenv').load();

// SERVER STUFF
// =====================================================================
var mongoose   = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
// use the Schema created in time.js
var Time = require('./time');

var count = 0;

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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
    
    // io.emit('chat message', msg);
  });
  
  socket.on('disconnect', function(){
    count = (count > 0) ? count - 1 : 0;
    console.log('connection ended');
    console.log('users:', count);
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3030');
});
