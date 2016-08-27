var _ = require('underscore')
	,React = require('react');

var Options = React.createClass({
	getInitialState: function () {
		return {
			scripts: null,
			hasScrolled: false
		};
	},
	render: function () {
		return (
			<div className="options">
			</div>
		);
	}
});

module.exports = Options;