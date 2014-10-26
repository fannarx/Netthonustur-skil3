var elasticsearch 	= require('elasticsearch');

var client = new elasticsearch.Client({
		host: 'localhost:9200',
		log: 'trace'
	});
console.log('Started Client');

function ping() {
	console.log('Running ping.');
	client.ping({
		requestTimeout: 1000,
		hello: "elasticsearch!"
	}, function (error) {
		if(error){
			console.log('[Elasticsearch]: Huston we have a problem. server not responding.');
		} else {
			console.log('[Elasticsearch]: Up and running');
		}
	});
};

var eSearch = client.model('eSearch', client);

module.exports = {'eSearch': eSearch};


/*
function search(query){
	client.search({
		index: "kodemon",
		type: "func",
		body: { 
			query: {
				match: {
					key: query
				}
			}
		}
	}).then(function(body){
		return body.hits.hits;
	},
	function (error){
		return error;
	});
};

exports.ping	= ping;
exports.search 	= search;
*/

/*

	client.index({
	  	index: 'kodemon',
		type: 'Func',
		body: search
	  }, function (error, res) {
	  	if(error)
	  		console.log(error);
	  	if(res)
	  		console.log(res);
  });


*/