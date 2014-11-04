// This API is a very simple.
// He can build up elasticsearch index from db useing the mongoose schema
var express 	= require('express'),
	kodemon 	= require('./modules').KodeMon, 
	mongoose	= require('mongoose'),
	bodyParser	= require('body-parser'),
	elastic		= require('elasticsearch'),
	cors		= require('cors'),
	app			= express();

// elastic search client fierd up.
var esClient = new elastic.Client({
	host: 'localhost:9200'
});

//parse application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// parse application/jason
app.use(bodyParser());

// connects to mongodb, keepAlive holds connection alive othervise it could 
// stop (mongodb closes it) after 2-3 hours if nothing is happening.
var connectMongo = function(){
	mongoose.connect('mongodb://localhost/test', {keepAlive: 1} );
	console.log('API connecting to mongodb');
};

// if the connecton is disconnected, connectMongo is called repeatedly
mongoose.connection.on('disconnected', connectMongo);
// starts the connection the first time this file is ran.	
connectMongo();

// checks on connection if there are any clusters in mongo DB.
mongoose.connection.on('open', function(){
	checkIfDbIsemtpy();
});

// ### Routes beging ###

// get call that creates a new ES index from 
// mongodb (with mongoose schema)
app.get('/api/reindex/:kodemon', function(req, res){
	console.log('calling api/reindex/' + kodemon);
	kodemon.find(function(err, searchResult){
		if (err) {
			res.status(503).send('Unable to find results');
		}
		else {
			createNewEsIndex(searchResult);
			res.json(searchResult);
		}
	});
 });

// Get call that checks if db has clusters
app.get('/api/checkes', function(req, res){
	checkIfDbIsemtpy(function(){
		console.log('Im instide hellu, hellu')
	});
});

// ### Routes end ###


// ### ModuleReindex end ###

// checking if database has clusters
// throws error if database has no clusters.
function checkIfDbIsemtpy(){
	mongoose.connection.db.collectionNames(function(error, names) {
		console.log('Checking if database is up and running');
	    if (error) {
	    	console.log('ERROR: There is a problem with the database: ');
	    	console.log(error);
	    	throw new Error(error);
	    } else {
	    	console.log('Database has following clusters: ')
	    	console.log('Number of clusters in DB: '+ names.map(function(cname) {
	    		console.log(cname.name);
	      }).length);
	    console.log('');
	    }
  	});
};


// Functon taht creates new ESindex from data.
function createNewEsIndex(data){
	console.log('you called createNewEsIndex');
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
				console.log("Written to ElasticSerach ");
				console.log(res.length);
		});
	}
};

// ### ModuleReindex end ###

var port = 5002;
app.listen(port, function(){
	console.log('reIndex Server is ready on port:'+ port + '\n');
});
