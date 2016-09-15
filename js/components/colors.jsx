import _ from 'underscore';
import React from 'react';

import colorPicker from 'foo-lib/components/color-picker.jsx';
import InputText from 'foo-lib/components/input-text.jsx';

const ColorPicker = colorPicker(React);

export default class Colors extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedColor: '#F00',
			rgbColor: 'rgb(255,0,0)',
			hexColor: '#FF0000'
		};

		_.bindAll(this, 'colorChanged');
	}

	colorChanged(name, color) {
		var hex = [];

		hex.push((+color.r).toString(16));
		hex.push((+color.g).toString(16));
		hex.push((+color.b).toString(16));

		_.each(hex, (v, i) => {
			if(v.length == 1) hex[i] = v + v;
		});

		this.setState({
			selectedColor: `rgb(${color.r},${color.g},${color.b})`,
			rgbColor: `rgb(${color.r},${color.g},${color.b})`,
			hexColor: `#${hex.join('')}`
			// hsbColor: `hsb(${color.hsb.h},${color.hsb.s},${color.hsb.b})`
		});
	}

	render() {
		return (
			<div className="colors-wrapper">
				<div className="color-picker-wrapper">
					<ColorPicker size={150} isActive={this.props.isActive} onChange={this.colorChanged} />
				</div>
				<div className="color-formats">
					<div className="selected-color" style={{background: this.state.selectedColor}}></div>
					<div className="row">
						<label htmlFor="rgbColors">RGB</label>
						<div className="input-wrapper">
							<input type="text" value={this.state.rgbColor} readOnly={true} id="rgbColors" />
							<span className="copy-icon hover-text" onClick={this.copyTime}>
								<span className="help-text">Click to copy</span>
							</span>
						</div>
					</div>
					<div className="row">
						<label htmlFor="hexColors">HEX</label>
						<div className="input-wrapper">
							<input type="text" value={this.state.hexColor} readOnly={true} id="hexColors" />
							<span className="copy-icon hover-text" onClick={this.copyTime}>
								<span className="help-text">Click to copy</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}