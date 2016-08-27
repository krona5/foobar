import React from 'react';

import {TabControl, Toast} from 'foo-lib';

import Time from './components/time.jsx'
import Encoder from './components/encoder.jsx'

import emitter from './utils/toast-emitter'

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
	render() {
		return (
			<div className="main-content">
				<TabControl data={Tabs} />
				<Toast emitter={emitter} />
			</div>
		);
	}
}