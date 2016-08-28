var React = require('react')
	,ReactDom = require('react-dom')
	,Router = require('react-router').Router
	,Route = require('react-router').Route
	,browserHistory = require('react-router').hashHistory;

import Index from './index.jsx'
import Options from './options.jsx'

require('underscore').mixin(require('foo-lib').utilUnderscoreMixin);

ReactDom.render((
	<Router history={browserHistory}>
		<Route path="/" name="home" component={Index} />
		<Route path="/options" name="options" component={Options} />
	</Router>
), document.getElementById('react-container'));