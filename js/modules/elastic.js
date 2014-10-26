var elasticsearch 	= require('elasticsearch');

function start() {
	var client = new elasticsearch.Client({
		host: 'localhost:9200',
			log: 'trace'
		});
};

function ping() {
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
};

exports.start	= start;
exports.ping	= ping;