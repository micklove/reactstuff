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
		var div = React.DOM.div(null,
			React.DOM.h2(null, this.props.count),
			React.DOM.span({className: "date-box"},
				new Date().toTimeString()));

		return div;
	}

	//Don't need this, if using the PureRenderMixin
	//shouldComponentUpdate: function (nextProps, nextState_ignore) {
	//	var updateComponent = nextProps.count !== this.props.count;
	//	console.log(this.name + '::shouldComponentUpdate() ' + updateComponent);
	//	return updateComponent;
	//}

});