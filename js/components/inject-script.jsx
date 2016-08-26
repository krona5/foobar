var _ = require('underscore')
	,React = require('react')
	,superAgent = require('superagent');

var InjectScript = React.createClass({
	injectScript: function (e) {
		var url = this.props.data.url
			,id = this.props.data.id
			,target = e.currentTarget
			,scriptTimeout;

		if(target.classList.contains('ripple') || target.classList.contains('success')) {
			return;
		}

		target.classList.remove('success');
		target.classList.remove('warn');

		target.classList.add('ripple');

		scriptTimeout = setTimeout(function () {
			scriptTimeout = null;
			target.classList.add('warn');
			target.classList.remove('ripple');
		}, 15000);

		chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
			if(!_.at(tabs, '0.id')) {
				return;
			}
			superAgent
				.get(url)
				.end(function (err, resp) {
					console.log("LEN",resp.text.length);
					chrome.tabs.sendMessage(tabs[0].id, {action: "register", url: url, id: id, data: resp.text}, function (result) {
						if(scriptTimeout) {
							clearTimeout(scriptTimeout);
							scriptTimeout = null;
						}
						if(result) {
							target.classList.add('success');
						} else {
							target.classList.add('warn');
						}
						target.classList.remove('ripple');
					});
				});
		});

		// chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tab) {
		// 	tab = tab[0];
		// 	if(tab) {
		// 		chrome.tabs.executeScript(tab.id, {file: url}, function (results) {
		// 			if(results && results[0]) {
		// 				target.classList.add('success');
		// 			} else {
		// 				target.classList.add('warn');
		// 			}
		// 		});
		// 	}
		// });
		// superagent
		// 	.get(url)
		// 	.then(function (resp) {
		// 		if(scriptTimeout) {
		// 			clearTimeout(scriptTimeout);
		// 			scriptTimeout = null;
		// 		}
		// 		target.classList.add('warn');
		// 		if(resp.statusCode==200) {
		// 				console.log(typeof resp.text, resp.text);
		// 				chrome.tabs.executeScript(null, {code: "document.body.style.backgroundColor='#ff0';window._ss='resp.text'"}, function () {
		// 					target.classList.add('success');
		// 					target.classList.remove('warn');
		//
		// 					chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
		// 						window.ttt = tabs[0];
		// 						console.log(tabs[0].url);
		// 					});
		// 				});
		// 		}
		// 		target.classList.remove('ripple');
		// 	});
			// .on('error', function (err) {
			// 	console.log(err);
			// });
	},
	makeUrlShort: function (url) {
		return url;
	},
	render: function () {
		var script = this.props.data
			,isLoaded;

		isLoaded = _.find(this.props.loadedScripts, function (loadedScriptId) {
			return loadedScriptId == script.id;
		});

		return (
			<div className="script-injector">
				<div className="info-box">
					<div className="name">{this.props.data.name}</div>
					<div className="url">
						<span>{this.makeUrlShort(this.props.data.url)}</span>
					</div>
				</div>
				<div className="control-box">
					<div className={"inject" + (isLoaded ? " success" : "")} onClick={this.injectScript}>
						<div className="title">Inject</div>
						<span>&lt;/&gt;</span>
						<i className="ic tick" />
						<i className="ic exclaim" />
					</div>
				</div>
			</div>
		);
	}
});

module.exports = InjectScript;