var mongoose 		= require('mongoose'),
	elasticsearch 	= require('elasticsearch'),
	client			= new elasticsearch.Client( {host: 'localhost:9200'} );

var kodeMonSchema = new mongoose.Schema({
  execution_time: 	{type: Number, required: true},
  timestamp: 		{type: Date},
  token: 			{type: String},
  key: 				{type: String},
  function_name:	{type: String},
  file_path:		{type: String},
}, { collection: 'kodemon' });

kodeMonSchema.post('save' , function(data){
	console.log('Writing to elasticsearch: ')
	client.index({
	  	index: 'kodemon',
		type: 'func',
		id: String(data._id),
		body: data
	  }, function (error, res) {
	  	if(error)
	  		console.log(error);
	  	if(res)
	  		console.log("Response Written to EleasticSearch "+ data._id);
  });
});

var KodeMon = mongoose.model('KodeMon', kodeMonSchema);

module.exports = {'KodeMon': KodeMon};