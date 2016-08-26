var React = require('react')
	,su = require('superagent');

var MenuStrip = React.createClass({
	getInitialState: function () {
		return {
			filter: ''
		};
	},

	filterChanged: function (e) {
		this.setState({
			filter: e.target.value
		});

		this.props.onChange && this.props.onChange({
			value: e.target.value
		});
	},
	onKeyUp: function (e) {
		if(e.which == 27 || e.keyCode == 27) {
			this.setState({
				filter: ''
			});
			e.preventDefault();
		}
	},

	render: function () {
		// su
		// 	.get('https://code.jquery.com/jquery-1.12.3.min.js')
		// 	.then(function (data) {
		// 		console.log(data.text);
		// 	});

		return (
			<div className="menu-strip">
				<div className="logo">Script Injector</div>
				<div className="toolbar">
					<div className="search-box">
						<i className="ic search" />
						<input onChange={this.filterChanged} value={this.state.filter} onKeyUp={this.onKeyUp} tabIndex="-1" />
					</div>
					<a className="icon-manage" href="/index.html#options" target="_blank" tabIndex="-1">
						<i className="ic setting"/>
					</a>
				</div>
			</div>
		);
	}
});

module.exports = MenuStrip;