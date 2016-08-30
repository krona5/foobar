import _ from 'underscore';

var settings;

function initStorage() {
	const settings = {
		implicit: {
			lastOpenedTab: 0,
			isEncoding: true,
			encodingMethodIndex: 0,
			encodeDecodeInput: '',
			numberSavedCustomBase: 0
		}
	};

	chrome.storage.sync.set({
		settings: settings
	});

	return settings;
}


export default {
	getSettings: function (cb) {
		chrome.storage.sync.get('settings', function (results) {
			settings = results.settings;

			if(!settings || !settings.implicit) {
				settings = initStorage();
			}

			cb(settings);
		});
	},
	saveImplicit: function (data) {
		_.extend(settings.implicit, data);
		chrome.storage.sync.set({settings: settings});
	}
};