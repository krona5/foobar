var _ = require('underscore');

var saveScriptTimeout;

function initStorage() {
	chrome.storage.sync.set({scripts: []});
}

function saveScripts(data) {
	var toSave;

	if(saveScriptTimeout) saveScriptTimeout = null;

	toSave = [];

	_.each(data, function (script) {
		if(script.name.trim() != '' && script.url.trim() != '') {
			toSave.push(script);
		}
	});

	chrome.storage.sync.set({
		scripts: toSave
	});
}

module.exports = {
	getScripts: function (cb) {
		chrome.storage.sync.get('scripts', function (results) {
			var scripts = results.scripts;

			if(!Array.isArray(scripts)) {
				initStorage();
				scripts = [];
			}

			cb(scripts);
		});
	},
	saveScripts: function (data) {
		if(saveScriptTimeout) {
			clearTimeout(saveScriptTimeout);
			saveScriptTimeout = null;
		}

		saveScriptTimeout = setTimeout(saveScripts.bind(null, _.clone(data)), 250);
	}
};