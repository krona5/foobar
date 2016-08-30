import _ from 'underscore'
import React from 'react'

import {OnOffSwitch, DummySelect, InputText} from 'foo-lib'

import store from '../core/store';
import {utilClipboardCopy} from 'foo-lib';
import emitter from '../utils/toast-emitter';

const encoders = [
	{
		id: "b64",
		value: "Base64"
	},
	{
		id: "uri",
		value: "URI"
	},
	{
		id: "uriComponent",
		value: "URI Components"
	}
];

export default class Encoder extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedEncoder: 0,
			isEncoding: true,
			input: "",
			result: "",
			error: ""
		};

		_.bindAll(this, 'encoderUpdated', 'changeEnDe', 'getResult', 'updateInput', 'copyResult');
	}

	updateInput(name, value) {
		this.setState({
			input: value
		});

		this.getResult(this.state.isEncoding, this.state.selectedEncoder, value);

		store.saveImplicit({
			encodeDecodeInput: value
		});
	}
	getResult(isEncoding, selectedEncoder, value) {
		var method
			,result
			,error;

		method = encoders[selectedEncoder];

		switch (method.id) {
			case "b64":
				if(isEncoding) {
					result = btoa(value);
				} else {
					try {
						result = atob(value);
					} catch (e) {
						error = "The string to be decoded is not correctly encoded.";
					}
				}
				break;
			case "uri":
				if(isEncoding) result = encodeURI(value);
				else result = decodeURI(value);
				break;
			case "uriComponent":
				if(isEncoding) result = encodeURIComponent(value);
				else result = decodeURIComponent(value);
				break;
		}

		this.setState({
			result: result,
			error: error
		});
	}
	changeEnDe(name, isEncode) {
		this.setState({
			isEncoding: isEncode
		});

		this.getResult(isEncode, this.state.selectedEncoder, this.state.input);

		store.saveImplicit({
			isEncoding: isEncode
		})
	}
	encoderUpdated(name, item, index) {
		this.setState({
			selectedEncoder: index
		});
		this.getResult(this.state.isEncoding, index, this.state.input);
		store.saveImplicit({
			encodingMethodIndex: index
		})
	}
	copyResult() {
		utilClipboardCopy(this.state.result || this.state.error);
		emitter.emit('toast', {
			id: "COMP.ENCODER",
			message: "Copied!"
		});
	}

	componentDidMount() {
		var self = this
			,isEncoding
			,encodingMethod
			,input;

		store.getSettings((settings)=>{
			isEncoding = _.at(settings, 'implicit.isEncoding');
			encodingMethod = _.at(settings, 'implicit.encodingMethodIndex');
			input = _.at(settings, 'implicit.encodeDecodeInput');

			self.setState({
				isEncoding: isEncoding,
				selectedEncoder: encodingMethod,
				input: input
			});

			if(undefined != input && undefined != isEncoding && undefined != encodingMethod) {
				self.getResult(isEncoding, encodingMethod, input);
			}
		})
	}
	render() {
		return (
			<div className="encoder-wrapper">
				<div className="control-bar">
					<div className="encode-decode-wrapper">
						<OnOffSwitch onText="Encode" offText="Decode" isOn={this.state.isEncoding} onChange={this.changeEnDe} />
					</div>
					<div className="encoder-method-wrapper">
						<DummySelect data={encoders} selectedIndex={this.state.selectedEncoder} onChange={this.encoderUpdated} />
					</div>
				</div>
				<div className="encoder-input">
					<InputText label={"Enter text for " + (this.state.isEncoding ? "en" : "de") + "coding"} onChange={this.updateInput} value={this.state.input} />
				</div>
				{
					this.state.result || this.state.error ?
						<div className="output-wrapper">
							<label>Output</label>
							<div className={"output-panel" + (this.state.error ? " error" : "")}>
								<span>{this.state.result || this.state.error}</span>
								<span className="copy-button hover-text" onClick={this.copyResult}>
									<span className="help-text">Click to copy result</span>
								</span>
							</div>
						</div> :
						""
				}
			</div>
		);
	}
}