import _ from 'underscore';
import React from 'react';

import TabControl from 'foo-lib/components/tab-control.jsx';
import Toast from 'foo-lib/components/toast.jsx';
import Loader from 'foo-lib/components/loader.jsx';

import Time from './components/time.jsx'
import Encoder from './components/encoder.jsx'
import Numbers from './components/numbers.jsx'
import Colors from './components/colors.jsx';

import emitter from './utils/toast-emitter'
import store from './core/store'

const Tabs = [
	{
		text: "Time",
		component: Time
	},
	{
		text: 'Encode',
		component: Encoder
	},
	{
		text: 'Numbers',
		component: Numbers
	},
	{
		text: 'Colors',
		component: Colors
	}
];

export default class MainContent extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedTab: 0
		};

		this.tabUpdated = this.tabUpdated.bind(this);
	}

	tabUpdated(tabIndex) {
		store.saveImplicit({
			lastOpenedTab: +tabIndex
		});
		this.setState({
			selectedTab: +tabIndex
		});
	}

	componentDidMount() {
		var self = this;
		store.getSettings((settings)=>{
			self.setState({
				selectedTab: _.at(settings, 'implicit.lastOpenedTab')
			});
		});
	}
	render() {
		return (
			<div className="main-content">
				<TabControl data={Tabs} selectedTab={this.state.selectedTab} onChange={this.tabUpdated} />
				<Toast emitter={emitter} />
			</div>
		);
	}
}
