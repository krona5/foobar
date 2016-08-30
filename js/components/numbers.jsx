import _ from 'underscore';
import React from 'react';

import {InputText, DummySelect} from 'foo-lib';

import store from '../core/store'
import {utilClipboardCopy} from 'foo-lib';
import emitter from '../utils/toast-emitter';

var bases = [];

export default class Number extends React.Component {
	constructor() {
		super();

		for(var i=2; i<37; i++) {
			bases.push({
				id: 'b' + i,
				value: "Base " + i
			});
		}

		this.state = {
			decimal: "",
			binary: "",
			octal: "",
			hexadecimal: "",
			selectedCustomBase: 0,
			inputCustomBase: ""
		};

		_.bindAll(this, 'inputUpdated', 'customBaseChanged', 'customBaseInputUpdated', 'copyCustomBaseInput')
	}

	inputUpdated(name, value) {
		var base = parseInt(name.substr(1))
			,decimalValue = parseInt(value, base)
			,customBase = bases[this.state.selectedCustomBase];

		console.log("IN", name, value);
		if(isNaN(decimalValue)) {
			this.setState({
				decimal: "",
				binary: "",
				octal: "",
				hexadecimal: "",
				inputCustomBase: ""
			});
			return;
		}

		this.setState({
			decimal: decimalValue,
			binary: decimalValue.toString(2),
			octal: decimalValue.toString(8),
			hexadecimal: decimalValue.toString(16),
			inputCustomBase: decimalValue.toString(+customBase.id.substr(1))
		});
	}
	customBaseChanged(name, selectedItem, itemIndex) {
		this.setState({
			selectedCustomBase: itemIndex
		});

		this.inputUpdated(selectedItem.id, this.state.inputCustomBase);

		store.saveImplicit({
			numberSavedCustomBase: itemIndex
		});
	}
	customBaseInputUpdated (name, value) {
		var base = bases[this.state.selectedCustomBase];

		this.setState({
			inputCustomBase: value
		});

		this.inputUpdated(base.id, value);
	}
	copyCustomBaseInput(e) {
		var base = +e.target.getAttribute('data-base');

		if(!base) {
			base = this.state.selectedCustomBase + 2;
		}

		utilClipboardCopy(this.state.decimal.toString(base));

		emitter.emit('toast', {
			id: "COM.NUMBERS",
			message: "Copied"
		});
	}

	componentDidMount() {
		var self = this;

		store.getSettings((data)=>{
			var savedBase = _.at(data, 'implicit.numberSavedCustomBase');
			self.setState({
				selectedCustomBase: undefined != savedBase ? savedBase : 0
			});
		});
	}
	render() {
		return (
			<div className="number-wrapper">
				<div className="row">
					<div>
						<span className="hover-text" onClick={this.copyCustomBaseInput} data-base="10">
							<span className="help-text">Click here to copy</span>
						</span>
						<label htmlFor="dec">Decimal</label>
						<InputText id="dec" value={this.state.decimal} name="b10" onChange={this.inputUpdated} />
					</div>
					<div className="separator"></div>
					<div>
						<span className="hover-text" onClick={this.copyCustomBaseInput} data-base="2">
							<span className="help-text">Click here to copy</span>
						</span>
						<label htmlFor="bin">Binary</label>
						<InputText id="bin" value={this.state.binary} name="b2" onChange={this.inputUpdated} />
					</div>
				</div>
				<div className="row">
					<div>
						<span className="hover-text" onClick={this.copyCustomBaseInput} data-base="8">
							<span className="help-text">Click here to copy</span>
						</span>
						<label htmlFor="oct">Octal</label>
						<InputText id="oct" value={this.state.octal} name="b8" onChange={this.inputUpdated} />
					</div>
					<div className="separator"></div>
					<div>
						<span className="hover-text" onClick={this.copyCustomBaseInput} data-base="16">
							<span className="help-text">Click here to copy</span>
						</span>
						<label htmlFor="hex">Hexadecimal</label>
						<InputText id="hex" value={this.state.hexadecimal} name="b16" onChange={this.inputUpdated} />
					</div>
				</div>
				<div className="row">
					<div className="custom-base-wrapper">
						<div className="hover-text" onClick={this.copyCustomBaseInput}>
							<div className="help-text">Click here to copy</div>
						</div>
						<div className="bases">
							<DummySelect data={bases} selectedIndex={this.state.selectedCustomBase} onChange={this.customBaseChanged} position="up" />
						</div>
						<div className="custom-base-input">
							<InputText value={this.state.inputCustomBase} onChange={this.customBaseInputUpdated} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}