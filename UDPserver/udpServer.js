/*
	#	Requirements
*/
var dgram 			= require("dgram");
var elasticsearch 	= require('elasticsearch');

/*
	# 	Elasticsearch config.
*/
var client = new elasticsearch.Client({
		host: 'localhost:9200',
		log: 'trace'
	});
/*
	#	Check if the server is a - okeyh.
*/
client.ping({
	requestTimeout: 1000,
	hello: "elasticsearch!"
	}, function (error) {
		if(error){
			console.trace('[Elasticsearch]: Huston we have a problem. server not responding.');
		} else {
			console.log('[Elasticsearch]: Up and running');
		}
});

/*
	#	Test function to see if the server works. remember to delete this from working project.
*/

client.search({
	q: 'cinema'
}).then(function (body) {
	var hits = body.hits.hits;
	console.log(body.hits.hits);
	}, function (error) {
		console.log(error.message);
});
	
var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo){
  console.log('got message from client: ' + msg);
  sendToElasticsearch(JSON.parse(msg));
});


function sendToElasticsearch(data){
 client.index({
  	index: 'kodemon',
	type: 'Func',
	body: data
  }, function (error, res) {
  });
};

server.on('listening', function(){
  console.log('Kodemon server listening on')
  console.log('hostname: ' + server.address().address);
  console.log('port: ' + server.address().port);
});

server.bind(4000);
