var React = require('react')
	,ReactDom = require('react-dom')
	,Router = require('react-router').Router
	,Route = require('react-router').Route
	,browserHistory = require('react-router').hashHistory;

var Index = require('./index.jsx')
	,Options = require('./options.jsx');

require('underscore').mixin(require('./helper/mixins'));

ReactDom.render((
	<Router history={browserHistory}>
		<Route path="/" name="home" component={Index} />
		<Route path="/options" name="options" component={Options} />
	</Router>
), document.getElementById('react-container'));