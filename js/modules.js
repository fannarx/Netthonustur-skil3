var mongoose = require('mongoose');

var kodeMonSchema = new mongoose.Schema({
  execution_time: 	{type: Number, required: true},
  timestamp: 		{type: Date},
  token: 			{type: String},
  key: 				{type: String}
});

// kodeMonSchema.post('save')

var KodeMon = mongoose.model('KodeMon', kodeMonSchema);

module.exports = {'KodeMon': KodeMon};