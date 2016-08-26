module.exports = {
	at: function(obj, path, fallback){
		if('undefined' === typeof obj || obj === null || 'undefined' === typeof path || path === null) return fallback;

		var paths = path.split('.')
			,key
			,res = obj;

		while('undefined' != typeof (key = paths.shift()) && typeof res != 'undefined') {
			if(res === null) res = ({}).a;
			else res = res[key];
		}

		if(typeof res == 'undefined') return fallback;
		else return res;
	}
};