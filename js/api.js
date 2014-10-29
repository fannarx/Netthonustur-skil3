var express 	= require('express'),
	kodemon 	= require('./modules').KodeMon, 
	mongoose 	= require('mongoose'),
	bodyParser 	= require('body-parser'),
	elastic 	= require('elasticsearch');
 	cors		= require('cors');
 	app 		= express();

// elastic search client fierd up.
var esClient = new elastic.Client({
		host: 'localhost:9200',
		log: 'trace'
	});

//parse application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// parse application/jason
app.use(bodyParser.json());

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

/// ######## Routes to database ##########
/// ######################################

// route to get all blogs
app.get('/api/db/kodemon', function(req, res){
	console.log('calling api/db/kodemon');
	kodemon.find(function(err, searchResult){
		if (err) {
			res.status(503).send('Unable to find results');
		}
		else {
			res.json(searchResult);
		}
	});
 });


// route finds specific key
app.get('/api/kodemon/:key', function(req, res){
	var key = req.params.key;
	kodemon.find({key: key}, function(err, searchResult){
		if(err){
			res.status(500).send('Try again later');
		}
		else if(!searchResult){
			res.status(404).send('No entry with this key ' + key);
		}
		else{
			res.status(201).json(searchResult); 
		}
	});
});

// Route: post blog (saves it into database)
app.delete('/api/kodemon/delete', function(req, res){
//	var blog = new Blog(req.body);
	kodemon.dropDatabase(function(err, b){
		if (err) {
			res.status(503).send('Unable to insert blog', err);
		}
		else {
			res.status(201).json(b);
		}
	});
});

// ###### Routes to database end #########

// #######################################
// ###### Routes to elasticSearch ########

/* Routes that we need to implement 
	/api/es/kodemon/:project 
	/api/es/kodemon/:project/:function
	/api/es/kodemon/:project/:function/single
	/api/es/kodemon/:project/:function/time
	/api/es/kodemon/:project/:function/time/:range
													*/

//	Route: /api/es/kodemon/:project 
//	Expected results: 	
//			Every document related to the project name
//		 	grouped by function.

app.get('/api/es/:customer', function(req, res){
	esClient.search({
		index: req.params.customer
	}).then(function (resp) {
	    var hits = resp.hits.hits;
	    res.status(201).json(hits);
	}, function (err) {
    	// elasticsearch error message has a status attrib.
    	// so it is not needed to do a manual error search.
    	res.status(err.status).json(err);
	});
});

//	Route: /api/es/kodemon/:project/:function
//	Expected Results: 		
//		Every document related to this selected function from the selected
//		project grouped by the function name.

app.post('/api/es/:customer/:func', function(req, res){
	var customer = req.params.customer,
		func 	 = req.params.func;
	esClient.search({
			index: customer
		}).then(function(body){
			res.status(201).json(body.hits.hits);
		},
		function (error){
			res.status(error.status).send('Nothing found');
		});	
});

//	Route: /api/es/kodemon/:project/:function/timerange
//	Expected Results: 		
//		Every document related to this selected function from the selected
//		project filtered by time condition.

app.post('/api/es/:customer/:func/timerange', function(req, res){
	var customer = req.params.customer,
		func 	 = req.params.func,
		start 	 = req.query.startTime,
		end 	 = req.query.endTime;
		esClient.search({
			index: customer,
			range: {
				startTime: start,
				endTime: end
			}
		}).then(function(body){
			res.status(201).json(body.hits.hits);
		},
		function (error){
			res.status(error.status).send('Nothing found');
		});
});


// #######################################


/*
// Route for searching - still need to implement
app.post('/api/search', function(req, res){
	var search_string = req.body.search || "";
	client.search({
		index: 'blogs',
		body: {
			query: {
				match:{
					title: search_string
				}
			} 
		}
	}, function(err, response){
		console.log(err);
		res.json(response);

	});
});
*/


// port used to comunicate - routes come to this port
var port = 5000;
app.listen(port, function(){
	console.log('Server is ready on port:'+ port);
});
