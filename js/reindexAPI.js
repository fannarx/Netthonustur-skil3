// This API is a very simple.
// He builds up elasticsearch index from db 
// useing the mongoose schema
var express 	= require('express'),
	kodemon 	= require('./models').KodeMon, 
	mongoose	= require('mongoose'),
	bodyParser	= require('body-parser'),
	elastic		= require('elasticsearch'),
	cors		= require('cors'),
	reindex	= require('./reindex'),
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

var db = mongoose.connection;

// checks on connection if there are any clusters in mongo DB.
mongoose.connection.on('open', function(){
	reindex.checkIfDbIsemtpy();
});



// ### Routes beging ###

// Creates a new ES index from 
// mongodb (with mongoose schema)
app.get('/api/reindex/:indexToCreate', function(req, res){
	var indexToCreate = req.params.indexToCreate;
	console.log('calling api/reindex/' + indexToCreate);
	kodemon.find(function(err, searchResult){
		if (err) {
			res.status(503).send('Unable to find results');
		}
		else {
			reindex.createNewEsIndex(indexToCreate, searchResult);
			res.json(searchResult);
		}
	});
 });


// checks if db has collections
app.get('/api/checkcollections', function(req, res){
	reindex.checkIfDbIsemtpy(function(dbClustersName){
		res.json(dbClustersName);
	});
});


// returns all indexes from running eleasticSearc.
app.get('/api/es/showindexes', function(req, res){
	esClient.cat.indices({
	}).then(function(body){
			res.status(200).json(body.split('\n'));
	},
	function (error){
		res.status(error.status).send('Nothing found');
	});
});


app.delete('/api/delete/:collection', function(req, res){
	var collection = req.params.collection;
    // Drop the collection from this world
	mongoose.connection.collections[collection].drop( function(err) {
	    console.log('collection dropped');
	    reindex.deleteEsIndex(collection, function(bool){
		    res.status(200).json(
		    	{'message': 'collection dropped', 'collection' : collection});
	    })
	});
});

// ### Routes end ###

var port = 5002;
app.listen(port, function(){
	console.log('reIndex Server is ready on port:'+ port + '\n');
});
