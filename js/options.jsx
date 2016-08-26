var _ = require('underscore')
	,React = require('react');

var InputRow = require('./components/InputRow.jsx')
	,Loader = require('./components/loader.jsx');

var store = require('./core/store');

require('./helper/for-nerds')();

var PAIR_KEY_HINT = "Name"
	,PAIR_VALUE_HINT = "URL http://www.example.com/path/to/script.js";

var emptyRowData = {
	key: {
		hint: PAIR_KEY_HINT
	},
	value: {
		hint: PAIR_VALUE_HINT
	}
};

var Options = React.createClass({
	getInitialState: function () {
		return {
			scripts: null,
			hasScrolled: false
		};
	},
	createNew: function () {
		var oldScripts = this.state.scripts;

		oldScripts.push({
			id: Date.now(),
			name: "",
			url: "",
			lastModifiedOn: Date.now()
		});

		this.setState({
			scripts: oldScripts
		});
	},
	onDataChange: function (data) {
		var scripts = this.state.scripts
			,script;

		script = _.find(scripts, {id: data.id});

		if(script) {
			script.name = data.key;
			script.url = data.value;
			script.lastModifiedOn = Date.now();
		}

		this.setState({
			scripts: scripts
		});

		store.saveScripts(scripts);
	},
	deleteScript: function (id) {
		var scripts = this.state.scripts
			,script = _.find(scripts, {id: id})
			,index;

		index = scripts.indexOf(script);

		if(index>-1) {
			scripts.splice(index, 1);

			this.setState({
				scripts: scripts
			});

			store.saveScripts(scripts);
		}
	},
	getScriptList: function () {
		var self = this
			,scriptsEls
			,existingScripts = _.map(this.state.scripts, function (script) {
				return {
					id: script.id,
					key: {
						text: script.name,
						hint: PAIR_KEY_HINT
					},
					value: {
						text: script.url,
						hint: PAIR_VALUE_HINT,
						validations: [
							{
								name: "pattern",
								pattern: "^https*://",
								message: "Please use the fully qualified URL"
							}
						]
					}
				};
			});

		scriptsEls = _.map(existingScripts, function (script, index) {
			return <InputRow isLive={true} delete={self.deleteScript} onChange={self.onDataChange} data={script} key={script.id} isLast={index == existingScripts.length-1} />
		});

		scriptsEls.push(
			<InputRow data={emptyRowData} onFocus={this.createNew} />
		);

		return (
			<div className="script-list" onScroll={this.scriptScroll}>
				{scriptsEls}
			</div>
		);
	},
	scriptScroll: function (e) {
		var target = e.currentTarget;

		if(target.scrollTop == 0) {
			this.setState({
				hasScrolled: false
			});
		} else {
			!this.state.hasScrolled && this.setState({
				hasScrolled: true
			});
		}
	},
	componentDidMount: function () {
		var self = this;

		store
			.getScripts(function (data) {
				self.setState({
					scripts: data
				});
			});
	},
	render: function () {
		return (
			<div className="options">
				<div className={"wrapper" + (this.state.hasScrolled ? " has-scrolled" : "")}>
					<div className="heading">
						<h1>Manage your scripts</h1>
					</div>
					{
						this.state.scripts ?
							this.getScriptList() :
							<div className="script-list">
								<Loader />
							</div>
					}
					<div className="footing" style={{display: 'none'}}>
						We would love to hear from you. Please provide your <a href="https://docs.google.com/forms/d/11I1LNhTdMb0lnAPKJViftEVbHLs4_RVRq6RHiN9evPg/viewform">feedback</a>.
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Options;