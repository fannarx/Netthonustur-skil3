var express 	= require('express'),
	kodemon 	= require('./models').KodeMon, 
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

//	Route: /api/es/:index
//	Expected results: 	Every document related to this index.
app.get('/api/es/:index', function(req, res){
	var index = req.params.index;
	esClient.search({
            'index': index,
            'body': {
            	'aggs': {
            		'group_by_files': {
            			'terms': {
            				'field': 'file_path'
            			}
            		}
            	}
            }
	}).then(function(body){
		res.status(200).json(body.aggregations.group_by_files.buckets);
		},
	function (error){
		res.status(error.status).send('Nothing found');
	});
});
//	Route: /api/es/kodemon/:project/:function
//	Expected Results: 		
//		Every document related to this selected function from the selected
//		project grouped by the function name.
app.post('/api/es/:index/timerange', function(req, res){
	var index = req.params.index,
		start 	 = req.body.startTime,
		end 	 = req.body.endTime;
		esClient.search({
	        'index': index,
	        'body':{
	        	'query': {
            	'filtered':{
            		'filter': {
            			'range':{ 'timestamp': { 'from': start, 'to': end} }
            		}
            		}
            	},
	        	'aggs': {
	        		'by_file':{
	        			'terms':{
	        				'field': 'file_path',
	        				'size': 0
	        			},
	        			'aggs':{
	        				'tops':{
	        					'top_hits':{
	        						'size': 1000
	        					}
	        				}
	        			}
	        		}
	        	}
            }
		}).then(function(body){
			res.status(200).json(body.aggregations.by_file.buckets);
		},
		function (error){
			res.status(error.status).send('Nothing found');
	});
});

//	Route: /api/es/:index
//	Expected results: 	Check what function has the highest load time.
app.get('/api/es/:index/loadtime/:sortBy', function(req, res){
	var index = req.params.index,
		sortBy = req.params.sortBy;
	esClient.search({
            'index': index,
            'body': {
            	'aggs': {
            		'top_execution_time':{
            			'terms':{
            				'field': 'file_path',
            				'size': 250
            			},
            			'aggs': {
            				'top_time_hits':{
            					'top_hits':{
            						'sort':[
            						{
            							'execution_time':{
            								'order': sortBy
            							}
            						}
            						],
            						'size': 1
            					}
            				}
            			}
            		}
            	}
            }
	}).then(function(body){
		res.status(200).json(body.aggregations.top_execution_time.buckets);
		},
	function (error){
		res.status(error.status).send('Nothing found');
	});
});

//	Route: /api/es/:index
//	Expected results: 	Check what function has the highest load time.
app.get('/api/es/:index/loadtime/allfiles/average', function(req, res){
	var index = req.params.index;
	esClient.search({
            'index': index,
            'body': {
            	'aggs': {
            		'avg_execution_time':{
            			'terms':{
            				'field': 'file_path',
            				'order': {'av_time': 'asc'}
            			},
            			'aggs': {
            				'av_time': {'avg': {'field': 'execution_time'}}
            			}
            		}
            	}
            }
	}).then(function(body){
		res.status(200).json(body.aggregations.avg_execution_time.buckets);
		},
	function (error){
		res.status(error.status).send('Nothing found');
	});
});

//	Route: /api/es/kodemon/:file 
//	Expected results: 	Every function and how often it has been called from this file
app.get('/api/es/:index/:file', function(req, res){
		var index = req.params.index;
		var file  = req.params.file;
		esClient.search({
                'index': index,
                'body':{
	                'query': {
	                	'filtered':{
	                		'query': {
	                			'match': {'file_path': file}
	                		}
	                		
	                	}
	                },
	                'aggs': {
	                			'group_by_functions':{
	                				'terms':{
	                					'field': 'function_name'
	                				}
	                			}
	                		}
                }                
		}).then(function(body){
			res.status(200).json(body);
			},
		function (error){
			res.status(error.status).send('Nothing found');
		});
});


//	Route: /api/es/kodemon/:file 
//	Expected results: 	Returns every logged call to this function.
app.get('/api/es/:index/:file/:func', function(req, res){
		var index = req.params.index;
		var func  = req.params.func;
		esClient.search({
                'index': index,
                'body':{
	                'query': {
	                	'filtered':{
	                		'query': {
	                			'match': {'function_name': func}
	                		}
	                		
	                	}
	                }
                }            
		}).then(function(body){
			res.status(200).json(body);
			},
		function (error){
			res.status(error.status).send('Nothing found');
		});
});


//	Route: /api/es/kodemon/:project/:function
//	Expected Results: 		
//		Every document related to this selected function from the selected
//		project grouped by the function name.
app.post('/api/es/:index/:file/timerange', function(req, res){
	var index = req.params.index,
		file 	 = req.params.file,
		start 	 = req.body.startTime,
		end 	 = req.body.endTime,
		fun 	 = req.body.fu;
		esClient.search({
	        'index': index,
	        'body':{
	            'query': {
	            	'filtered':{
	            		'query': {
	            			'bool':{
	            				'must': [
	            				{
	            					'term': {'file_path': file}
	            				},
	            				{
	            					'term': {'function_name': fun}
	            				}
	            				]
	            			}
	            		},
	            		'filter': {
	            			'range':{ 'timestamp': { 'from': start, 'to': end} }
	            		}
	            	}
	            },
	            'size': 400
	        }
		}).then(function(body){
			res.status(200).json(body.hits.hits);
		},
		function (error){
			res.status(error.status).send('Nothing found');
	});
});

// #######################################


// port used to comunicate - routes come to this port
var port = 5000;
app.listen(port, function(){
	console.log('Server is ready on port:'+ port);
});
