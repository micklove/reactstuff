"use strict";
/*global React, report, jslint, console */
/*jslint nomen: true, debug: true*/

var _logMixin = {
	_log: function(methodName, args) {
		console.log(this.name + "::" + methodName, args);
	},
	componentWillUpdate: function() {this._log('componentWillUpdate', arguments);},
	componentDidUpdate: function()  {this._log('componentDidUpdate', arguments);},
	componentWillMount: function()  {this._log('componentWillMount', arguments);},
	componentDidMount: function()   {this._log('componentDidMount', arguments);},
	componentWillUnmount: function()  {this._log('componentWillUnmount', arguments);}
};
