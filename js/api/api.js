var express = require('express'),
	kodemon = require('./../modules').KodeMon, 
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

app = express();

//parse application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/jason
app.use(bodyParser.json());

// connects to mongodb, keepAlive holds connection alive othervise it could 
// stop (mongodb closes it) after 2-3 hours if nothing is happening.
var connectMongo = function(){
	mongoose.connect('mongodb://localhost/test', {keepAlive: 1} );
	console.log('Connection to mongodb');
};

// if the connecton is disconnected, connectMongo is called repeatedly
mongoose.connection.on('disconnected', connectMongo);
// starts the connection the first time this file is ran.	
connectMongo();

// route to get all blogs
app.get('/api/kodemon', function(req, res){
	kodeMon.find({}, function(err, kodeMons){
		if(err){
			res.status(503).send('Unable to fetch blogs');
		}
		else {
			res.json(kodeMons);
		}
	});
 });

/*
// route finds specific slug
app.get('/api/blog/:slug', function(req, res){
	var slug = req.params.slug;
	Blog.findOne({slug: slug}, function(err, b){
		if(err){
			res.status(500).send('Try again later');
		}
		else if(!b){
			res.status(404).send('No entry with slug ' + slug);
		}
		else{
			res.status(201).json(b); 
		}
	});
});

// Route: post blog (saves it into database)
app.post('/api/blogs', function(req, res){
	var blog = new Blog(req.body);
	blog.save(function(err, b){
		if (err) {
			res.status(503).send('Unable to insert blog', err);
		}
		else {
			res.status(201).json(b);
		}
	});
});

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
app.listen(4000, function(){
	console.log('Server is ready');
});
