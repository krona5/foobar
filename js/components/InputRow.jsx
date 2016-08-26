var _ = require('underscore')
	,React = require('react');

var validator = require('../helper/validator');

var InputRow = React.createClass({
	getInitialState: function () {
		return {
			pairKey: null,
			keyError: null,
			pairValue: null,
			valueError: null
		};
	},

	validateValue: function (value, silent) {
		var validations
			,hasError = false;

		validations = _.at(this.props, 'data.value.validations');

		for(var i=0; i<validations.length; i++) {
			if(!validator(validations[i], value)) {
				hasError = true;
				if(!silent) {
					this.setState({
						valueError: validations[i].message
					});
				}
				break;
			}
		}

		if(!hasError) {
			this.setState({
				valueError: null
			});
		}

		return !hasError;
	},
	keyChanged: function (e) {
		this.changed({
			pairKey: e.target.value.trim()
		});
	},
	valueChanged: function (e) {
		this.validateValue(e.target.value.trim());
		this.changed({
			pairValue: e.target.value.trim()
		});
	},
	changed: function (data) {
		this.setState(data);

		this.props.onChange && this.props.onChange({
			id: _.at(this.props, 'data.id', Date.now()),
			key: data.pairKey || this.state.pairKey,
			value: data.pairValue || this.state.pairValue
		});
	},
	focused: function () {
		this.setState({
			isFocused: true
		});

		this.props.onFocus && this.props.onFocus();
	},
	blured: function () {
		this.setState({
			isFocused: false
		});
	},
	deleteItem: function() {
		this.props.delete && this.props.delete(_.at(this.props, 'data.id'));
	},

	componentDidMount: function () {
		this.setState({
			pairKey: _.at(this.props, 'data.key.text'),
			pairValue: _.at(this.props, 'data.value.text')
		});
	},
	render: function () {
		return (
			<div className={"input-row" + (this.state.isFocused ? " focused" : "") + (this.props.isLive ? " has-data" : "")}>
				<div className="pair-key">
					<input placeholder={_.at(this.props, 'data.key.hint')} value={this.state.pairKey} onChange={this.keyChanged} onFocus={this.focused} onBlur={this.blured} autoFocus={this.props.isLast ? true : false} />
				</div>
				<div className="pair-value">
					<input className={this.state.valueError ? "errored" : ""} placeholder={_.at(this.props, 'data.value.hint')} value={this.state.pairValue} onChange={this.valueChanged} onFocus={this.focused} onBlur={this.blured} />
					<div className="err-msg">{this.state.valueError}</div>
				</div>
				<div className="actions">
					<div className="delete" title="Delete" onClick={this.deleteItem}>
						<i className="ic delete" />
					</div>
				</div>
			</div>
		);
	}
});

module.exports = InputRow;