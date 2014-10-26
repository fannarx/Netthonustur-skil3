var mongoose 		= require('mongoose'),
	elasticsearch 	= require('elasticsearch'),
	client			= new elasticsearch.Client( {host: 'localhost:9200'} );

var kodeMonSchema = new mongoose.Schema({
  execution_time: 	{type: Number, required: true},
  timestamp: 		{type: Date},
  token: 			{type: String},
  key: 				{type: String}
});

kodeMonSchema.post('save' , function(data){
	client.index({
	  	index: 'kodemon',
		type: 'func',
		id: String(data._id),
		body: {
			key: data.key,
			timestamp: data.timestamp
		}
	  }, function (error, res) {
	  	if(error)
	  		console.log(error);
	  	if(res)
	  		console.log(res);
  });
});

var KodeMon = mongoose.model('KodeMon', kodeMonSchema);

module.exports = {'KodeMon': KodeMon};