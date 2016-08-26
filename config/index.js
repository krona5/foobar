var _ = require('underscore');

var config = _.extend(
	{},
	require('./dims'),
	{
		get: function(key, successor){
			var res = config[key];

			if('undefined' != typeof successor) {
				res += '' + successor;
			}

			return res;
		}
	}
);

module.exports = config;