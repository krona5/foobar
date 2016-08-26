
var rules = {
	pattern: function (rule, value) {
		var regEx = new RegExp(rule.pattern, 'g');

		return value.match(regEx);
	}
};

module.exports = function (rule, value) {
	var ruleFn = rules[rule.name];

	if(ruleFn) {
		return ruleFn(rule, value);
	} else {
		throw new Error("No rule defined for :", rule.name);
	}
};