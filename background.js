var timeOutId
	,setting;

chrome.app.runtime.onLaunched.addListener(function() {
	getSettings(function(data){
		var outerBound = {
			width: 1000,
			height: 700,
			minWidth: 1000,
			minHeight: 700
		};
		try {
			setting  = data && data.settings;
			setting = JSON.parse(setting);

			extend(outerBound, setting.userPreference.window);
		} catch(e) {
			setting = null;
		}
		chrome.app.window.create('index.html', {
			'outerBounds': outerBound
		}, function(win){
			win.onBoundsChanged.addListener(function(){
				setUserWindowPreference(win.outerBounds);
			});
		});
	});
});

function getSettings(cb){
	chrome.storage.sync.get('settings', cb);
}

function setUserWindowPreference(outerBound) {
	if(timeOutId) {
		clearTimeout(timeOutId);
		timeOutId = null;
	}

	timeOutId = setTimeout(function(){
		setting = setting || {};

		setting.userPreference = {
			window: {
				width: outerBound.width,
				height: outerBound.height,
				left: outerBound.left,
				top: outerBound.top
			}
		};

		chrome.storage.sync.set({settings: JSON.stringify(setting)});
	}, 200);
}

function extend(obj1, obj2) {
	for(i in obj2) {
		if(obj2.hasOwnProperty(i))
			obj1[i] = obj2[i];
	}
}