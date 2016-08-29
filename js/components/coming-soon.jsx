import React from 'react'

const linkStyle = {
	color: '#2196f3',
	textDecoration: 'none',
	fontWeight: 'bold',
	outline: 'none'
};

export default class ComingSoon extends React.Component {
	openSupportPage() {
		chrome.tabs.create({ url: "https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/support" });
	}
	render() {
		return (
			<div className="coming-soon" style={{padding: '0 10px'}}>
				Coming soon more...
				<div style={{paddingTop: '20px'}}>
					Give us your feedback and tell us what you want more <a onClick={this.openSupportPage} href="#" style={linkStyle}>here</a>.
					<br/>
					<br/>
					We would love to here from you.
				</div>
			</div>
		);
	}
}