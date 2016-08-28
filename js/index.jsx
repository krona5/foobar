import _ from 'underscore';
import React from 'react';

import {TabControl, Toast, Loader} from 'foo-lib';

import Time from './components/time.jsx'
import Encoder from './components/encoder.jsx'

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
	}
];

export default class MainContent extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedTab: null
		};
	}

	tabUpdated(tabIndex) {
		store.saveImplicit({
			lastOpenedTab: +tabIndex
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
	getContent() {
		if(null === this.state.selectedTab) {
			return (
				<div className="main-content">
					<Loader />
				</div>
			);
		} else {
			return (
				<div className="main-content">
					<TabControl data={Tabs} selectedTab={this.state.selectedTab} onChange={this.tabUpdated} />
					<Toast emitter={emitter} />
				</div>
			);
		}
	}
	render() {
		return this.getContent();
	}
}