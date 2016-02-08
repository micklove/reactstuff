"use strict";
/*global React, report, jslint, console */
/*jslint nomen: true, debug: true*/

//TODO - add webStorage - https://www.npmjs.com/package/react-webstorage

var TextAreaCounter = React.createClass({
	propTypes: {
		defaultValue: React.PropTypes.string
	},
	getInitialState: function() { return {
		text: this.props.defaultValue};
	},
	_textChange: function(ev) {
		this._log('_textChange', ev);
		this.setState({
			text: ev.target.value
		});
	},
	_log: function(methodName, args) {
		console.log(methodName, args);
	},
	componentWillReceiveProps: function(newProps) {
		this.setState({
		text: newProps.defaultValue
		});
	},
	render:    function () {
		//return React.DOM.div(null,
		//	React.DOM.textarea({
		//		value: this.state.text,
		//		onChange: this._textChange
		//	}),
		//	React.DOM.h3(null, this.state.text.length));
		return (
				<div>
					<textarea onChange={this._textChange} value={this.state.text}></textarea>
					<div>{this.state.text.length}</div>
				</div>
		);
	},
	componentWillUpdate: function() {this._log('componentWillUpdate', arguments);},
	componentDidUpdate: function()  {this._log('componentDidUpdate', arguments);},
	componentWillMount: function()  {this._log('componentWillMount', arguments);},
	componentDidMount: function()   {this._log('componentDidMount', arguments);},
	componentWillUnmount: function()  {this._log('componentWillUnmount', arguments);}
});

//TODO - http://stackoverflow.com/questions/30730369/reactjs-component-not-rendering-textarea-with-state-variable

var app = document.getElementById("app");
		//ReactDOM.render(React.createElement(TextAreaCounter, {
		//	defaultValue: "Hello World!"
		//}), app);
ReactDOM.render(
		<div>
			<TextAreaCounter defaultValue="Hello World!"/>
		</div>,
		app);
