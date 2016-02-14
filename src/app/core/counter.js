/*global console, React, _logMixin */
"use strict";

var Counter = React.createClass({
	name: "Counter",
	//mixins: [_logMixin],
	mixins: [React.addons.PureRenderMixin],

	propTypes: {
		count : React.PropTypes.number.isRequired
	},
	render: function () {
		console.log(this.name + '::render()');
		return React.DOM.span(null, this.props.count);
	}

	//Don't need this, if using the PureRenderMixin
	//shouldComponentUpdate: function (nextProps, nextState_ignore) {
	//	var updateComponent = nextProps.count !== this.props.count;
	//	console.log(this.name + '::shouldComponentUpdate() ' + updateComponent);
	//	return updateComponent;
	//}

});