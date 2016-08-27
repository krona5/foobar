import React from 'react';

import {TabControl} from 'foo-lib';

import Time from './components/time.jsx'
import Encoder from './components/encoder.jsx'

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

			</div>
		);
	}
}