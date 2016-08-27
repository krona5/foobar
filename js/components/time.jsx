import _ from 'underscore';
import React from 'react'

import {utilClipboardCopy as copyToClipboard, InputText, DummyCheckbox} from 'foo-lib';

import emitter from '../utils/toast-emitter'

export default class Time extends React.Component {
	constructor(){
		super();

		this.state = {
			currentTime: Date.now(),
			convertedTimeStamp: "",
			convertedDateString: ""
		};

		_.bindAll(this, 'updateTimer', 'componentDidMount', 'copyTime', 'copyTimeString', 'convertToDateString', 'convertToTimestamp', 'copyConvertedTimestamp', 'copyConvertedDateString');
	}

	updateTimer(isActive) {
		var self = this;

		this.setState({
			currentTime: Date.now()
		});

		if(isActive) {
			setTimeout(()=>self.updateTimer(isActive), 16.67); // 1000ms/60 = 16.67 for 60fps
		}
	}
	copyText(text) {
		copyToClipboard(text);
		emitter.emit('toast', {
			id: "COMP.TIME",
			message: "Copied!"
		});
	}
	copyTime() {
		this.copyText(this.state.currentTime);
	}
	copyTimeString() {
		this.copyText(new Date().toString());
	}
	convertToDateString(name, value) {
		var convertedDate = new Date(+value)
			,convertedDateString;

		if(value.length == 0 || isNaN(convertedDate.getDate())) {
			convertedDateString = "";
		} else {
			convertedDateString = convertedDate.toString();
		}

		this.setState({
			convertedTimeStamp: value,
			convertedDateString: convertedDateString
		});
	}
	convertToTimestamp(name, value) {
		var convertedDate = new Date(value)
			,convertedTimestamp;

		if(!isNaN(convertedDate.getTime())) {
			convertedTimestamp = convertedDate.getTime();
		} else {
			convertedTimestamp = "";
		}

		this.setState({
			convertedDateString: value,
			convertedTimeStamp: convertedTimestamp
		});
	}
	copyConvertedTimestamp() {
		this.copyText(this.state.convertedTimeStamp);
	}
	copyConvertedDateString() {
		this.copyText(this.state.convertedDateString);
	}

	componentWillReceiveProps(nextProps) {
		this.updateTimer(nextProps.isActive);
	}
	componentDidMount() {
		this.updateTimer(this.props.isActive);
	}

	render() {
		return (
			<div className="time-wrapper">
				<div className="date-now">
					<label>Date now</label>
					<div className="input-wrapper">
						<input type="text" value={this.state.currentTime} readOnly={true} />
						<span className="copy-icon hover-text" onClick={this.copyTime}>
							<span className="help-text">Click to copy</span>
						</span>
					</div>
					<div className="input-wrapper">
						<input type="text" id="date-now" value={new Date(this.state.currentTime).toString()} readOnly={true} />
						<span className="copy-icon hover-text" onClick={this.copyTimeString}>
							<span className="help-text">Click to copy</span>
						</span>
					</div>
				</div>
				<div className="convert-date">
					<label>Convert</label>
					<div className="converter-container">
						<div className="timestamp-wrapper">
							<InputText hint="Timestamp" onChange={this.convertToDateString} value={this.state.convertedTimeStamp} copyClass="hover-text" copyHint="Click here to copy" />
							<span className="copy-icon hover-text" onClick={this.copyConvertedTimestamp}>
								<span className="help-text">Click to copy</span>
							</span>
						</div>
						<div className="separator"></div>
						<div className="date-wrapper">
							<InputText hint="Date string" onChange={this.convertToTimestamp} value={this.state.convertedDateString} copyClass="hover-text" copyHint="Click here to copy" />
							<span className="copy-icon hover-text" onClick={this.copyConvertedDateString}>
								<span className="help-text">Click to copy</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}