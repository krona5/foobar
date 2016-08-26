var _ = require('underscore')
	,React = require('react')
	,async = require('async');

var store = require('../core/store');

var Loader = require('./loader.jsx')
	,InjectScript = require('./inject-script.jsx');

var MainContent = React.createClass({
	getInitialState: function () {
		return {
			loadedScripts: null,
			scripts: null
		};
	},

	filter: function (script) {
		var filter = (this.props.filter || '').toLowerCase();

		return (
			~script.url.toLowerCase().indexOf(filter) ||
			~script.name.toLowerCase().indexOf(filter)
		);
	},
	getScriptList: function () {
		var self = this
			,scriptsEl
			,hasData = false;

		scriptsEl = _.map(this.state.scripts, function (script) {
			if(!self.filter(script)) {
				return null;
			}

			hasData = true;
			return (
				<InjectScript data={script} loadedScripts={self.state.loadedScripts} key={script.id} />
			);
		});

		if(!hasData) {
			scriptsEl = (
				<div>
					{
						this.state.scripts.length ?
						<div className="no-saved-script">
							No result.
						</div> :
						<div className="no-saved-script">
							There are no saved script.
							<br/>
							Add scripts in <a href="/index.html#options" target="_blank">option</a> page.
						</div>
					}
				</div>
			);
		}

		return scriptsEl;
	},
	queryScript: function (cb) {
		store
			.getScripts(function (data) {
				cb(null, data);
			});
	},
	queryLoadedScripts: function (cb) {
		var cbTimeout;

		cbTimeout = setTimeout(function () {
			cbTimeout = null;
			cb(null, []);
		}, 1000);

		chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
			if(!_.at(tabs, '0.id')) {
				clearTimeout(cbTimeout);
				cbTimeout = null;
				cb(null, []);
				return;
			}
			chrome.tabs.sendMessage(tabs[0].id, {action: "query"}, function (data) {
				if(cbTimeout) {
					cb(null, data);
					clearTimeout(cbTimeout);
					cbTimeout = null;
				}
			});
		});
	},

	componentDidMount: function () {
		var self = this
			,tasks;

		tasks = [
			this.queryScript,
			this.queryLoadedScripts
		];

		async.parallel(tasks, function (errs, results) {
			self.setState({
				scripts: results[0],
				loadedScripts: results[1]
			});
		});
		// store
		// 	.getScripts(function (data) {
		// 		self.setState({
		// 			scripts: data
		// 		});
		// 	});
	},
	render: function () {
		return (
			<div className="main-content">
				{
					this.state.scripts ?
						this.getScriptList() :
						<Loader />
				}
			</div>
		);
	}
});

module.exports = MainContent;