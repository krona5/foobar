var React  = require('react');

var MenuStrip = require('./components/menu-strip.jsx')
	,MainContent = require('./components/main-content.jsx');

var Index = React.createClass({
	getInitialState: function () {
		return {
			filter: ''
		};
	},
	filterUpdated: function (data) {
		this.setState({
			filter: data.value
		});
	},
	render: function(){
		return (
			<div className="container">
				<MenuStrip onChange={this.filterUpdated} />
				<MainContent filter={this.state.filter} />
			</div>
		);
	}
});

module.exports = Index;