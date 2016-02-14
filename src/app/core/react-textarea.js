"use strict";
/*global document, Counter, _logMixin, ReactDOM, React, report, jslint, console */
/*jslint nomen: true, debug: true*/

var TextAreaCounter = React.createClass({
	name: "TextAreaCounter",
	//mixins : [_logMixin],
	propTypes: {
		defaultValue: React.PropTypes.string
	},
	getInitialState: function() { return {
		text: this.props.defaultValue};
	},
	_textChange: function(ev) {
		//this._log('_textChange', ev);
		this.setState({
			text: ev.target.value
		});
	},
	componentWillReceiveProps: function(newProps) {
		this.setState({
		text: newProps.defaultValue
		});
	},
	render:    function () {
		console.log(this.name + '::render()');

		var counter = null;
		if (this.state.text.length>0) {
			counter = React.DOM.h3(null, React.createElement(Counter, {count: this.state.text.length}));
		}
		var textAreaElement = React.DOM.textarea({
			value: this.state.text,
			onChange: this._textChange
		});

		return React.DOM.div(null, textAreaElement, counter);
		//return (
		//		<div>
		//			<textarea onChange={this._textChange} value={this.state.text}></textarea>
		//			<div>{this.state.text.length}</div>
		//		</div>
		//);
	}
});

//see http://stackoverflow.com/questions/30730369/reactjs-component-not-rendering-textarea-with-state-variable

var app = document.getElementById("app");
ReactDOM.render(React.createElement(TextAreaCounter, {
	defaultValue: "Hello World!"
}), app);
//ReactDOM.render(
//		<div>
//			<TextAreaCounter defaultValue="Hello World!"/>
//		</div>,
//		app);
