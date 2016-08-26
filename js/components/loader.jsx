var React = require('react');

var Loader = React.createClass({
	render: function() {
		return (
			<div className="ajax-loader-android">
				<div className="loader">
					<svg className="circular">
						<circle className="path" cx="15" cy="15" r="10" fill="none" strokeWidth="3" strokeMiterlimit="10"/>
					</svg>
				</div>
			</div>
		);
	}
});

module.exports = Loader;