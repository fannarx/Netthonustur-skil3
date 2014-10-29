/// requirements
var dgram 		= require('dgram'),
  kodeMon = require('./modules').KodeMon,
	mongoose 	= require('mongoose');

var server = dgram.createSocket("udp4");


/// mongodb connection
var connectMongo = function(){
	mongoose.connect('mongodb://localhost/test', {keepAlive: 1});
	console.log('UDPserver connecting to mongodb');
};

var db = mongoose.connection;

/// Call connectMongo if connection disconnects
db.on('disconnected', connectMongo);

/// run connectMongo first time this file is ran.
connectMongo();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
  console.log('Database up and running');
});


server.on("message", function (msg, rinfo){
  console.log('got message from client: ' + msg);


  var kodeMonMsg = new kodeMon();

  var jsonMsg = JSON.parse(msg);
  // To change UnixDate to date-time
  jsonMsg.timestamp = new Date(jsonMsg.timestamp*1000); 
  var kodeMonMsg = new kodeMon(jsonMsg);
  kodeMonMsg.save(function(err, message){
    if(err){
      console.log('ERROR: unable to insert kodeMonMsg to db: ' + err);
    }
    else {
      console.log('Inserted message to db: ' + kodeMonMsg);
    } 
  });
});



server.on('listening', function(){
  console.log('Kodemon server listening on');
  console.log('hostname: ' + server.address().address);
  console.log('port: ' + server.address().port);
});

server.bind(4000);