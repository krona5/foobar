import _ from 'underscore';
import React from 'react';

import {TabControl, Toast, Loader} from 'foo-lib';

import Time from './components/time.jsx'
import Encoder from './components/encoder.jsx'
import ComingSoon from './components/coming-soon.jsx'

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
		text: 'More',
		component: ComingSoon
	}
];

export default class MainContent extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedTab: 0
		};

		_.bindAll(this, 'tabUpdated');
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