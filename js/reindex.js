var mongoose =	require('mongoose'),
	elastic		= require('elasticsearch');

// elastic search client fierd up.
var esClient = new elastic.Client({
	host: 'localhost:9200'
});


// checking if database has clusters
// throws error if database has no clusters.
function checkIfDbIsemtpy(callback){
	mongoose.connection.db.collectionNames(function(error, names) {
		console.log('checking ElasticSerach')
		console.log('end ElasticSerach')
		console.log('Checking if database is up and running');
	    if (error) {
	    	console.log('ERROR: There is a problem with the database: ');
	    	console.log(error);
	    	throw new Error(error);
	    } else {
	    	var clustersInDb = [];
	    	console.log('Database has following clusters: ');
	    	names.map(function(cname) {
	    		console.log(cname.name);
	      	});
		    if (callback){
			    callback(names);
		    }
	    }
  	});
};

// Functon taht creates new ESindex from data.
function createNewEsIndex(indexToCreate, data){
	console.log('createNewEsIndex says WELLCOME');
	doesIndexExist(indexToCreate, function(result){
		if (result){
			console.log('Deleting INDEX' +  indexToCreate);
			deleteEsIndex(indexToCreate, function(){
				if(result){
					createEsIndex(indexToCreate, data);
				}				
			});
		}
		else {
			createEsIndex(indexToCreate, data);			
		}
	})
}


function doesIndexExist(indexToCheck, callback){
	console.log ('does index exist ?');
	esClient.cat.indices({
		index: indexToCheck
	}).then(function(body){
		console.log('inside doesIndexExist body');
		console.log(body);
		if (body){
			console.log('Index does exist');
			callback(true);
		}
		else {
			console.log('no index does exist');
			callback(false);
		}
	});

}

/// (privat) deleting index
function deleteEsIndex(indexToDelete, callback){
	esClient.deleteByQuery({
		index: indexToDelete,
		q: ''
	}, function (error, response) {
		if (error){
			console.log('ERROR: in deleting index:' + indexToDelete);
			console.log(error)
		}
		if(response){
			console.log('###########   Deleted index: ' + indexToDelete);
			console.log(response);
			callback(true);
		}
	});
}

// (private) createEsIndex(indexToCreate);
function createEsIndex(indexToCreate, data){
	console.log('Inside createESIndex, Creating ES index :)' );
	console.log(data.length);
	for (var i=0; i < data.length; i++){
		console.log('array nr. ' + i)
		console.log(data[i]);
		esClient.index({
			index: 'kodemon',
			type: 'func',
			id : String(data[i]._id),
			body: data[i]
		}, function (error, res){
			if (error)
				console.log(error);
			if (res)
				console.log("Written to ElasticSerach item: " + i );
//				console.log(res);
		});
	}
}

module.exports = {
	'checkIfDbIsemtpy': checkIfDbIsemtpy, 
	'createNewEsIndex': createNewEsIndex
};
