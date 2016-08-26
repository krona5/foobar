var async = require('async');

var DATA_MASTER_KEY = 'inJectScript';

function getLoadedScripts() {
	var ids = []
		,i
		,script
		,scripts = document.querySelectorAll('script[data-master="' + DATA_MASTER_KEY + '"]');

	for(i=scripts.length-1; i>=0; i--) {
		script = scripts[i];
		if(!script.hasAttribute('is-loading')) {
			ids.push(script.getAttribute('data-master-id'));
		}
	}

	return ids;
}

function loadScriptDom(tag, data, cb) {
	var el = document.createElement(tag);

	el.setAttribute('data-master', DATA_MASTER_KEY);
	el.setAttribute('data-master-id', data.id);
	el.setAttribute('is-loading', "true");

	if(data.data) {
		el.innerHTML = (data.data || '').replace(/\/\*.+\*\//g, '');
	}

	el.onload = function () {
		el.removeAttribute('is-loading');
		cb(null, true);
	};

	document.head.appendChild(el);

	return el;
}

function loadJs(data, cb) {
	var el = loadScriptDom('script', data, cb);

	el.setAttribute('type', 'text/javascript');

	if(data.data) {
		el.onload();
	} else {
		el.setAttribute('src', data.url);
	}
}

function loadCss(data, cb) {
	var el = loadScriptDom('link', data, cb);

	el.setAttribute('type', 'text/css');

	if(data.data) {
		el.onload();
	} else {
		el.setAttribute('href', data.url);
	}
}

function loadScript(data, cb) {
	var isJs,isCss
		,url
		,tasks = [];

	url = data.url || '';

	if(!url) {
		cb(false);
		return;
	}

	isJs = url.substr(-3).toLowerCase() == '.js';
	isCss = url.substr(-4).toLowerCase() == '.css';

	if(!isCss) {
		tasks.push(loadJs.bind(null, data));
	}
	if(!isJs) {
		tasks.push(loadCss.bind(null, data));
	}

	async.parallel(tasks, function (errs, results) {
		cb(results[0] || results[1]);
	});
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
	switch(message.action) {
		case 'query':
			response(getLoadedScripts());
			return true;
			break;
		case 'register':
			loadScript(message, response);
			return true;
			break;
	}
});