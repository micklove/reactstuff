"use strict";
/*global console, document, Counter, _logMixin, ReactDOM, React, report, jslint */
var Excel = React.createClass({

	displayName: "Excel",
	headers:     React.PropTypes.arrayOf(React.PropTypes.string),
	initialData: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)),

	getInitialState: function() {
		return {
			//Use JSON methods to make a deep copy
			data: JSON.parse(JSON.stringify(this.props.initialData)),
			previousDataState: null,
			sortby: null,
			descending: false,
			edit: null //{row: index, cell: index}
		};
	},

	_sort: function(e) {
		var column = e.target.cellIndex;
		var descending = this.state.sortby === column && !this.state.descending;

		//copy the data
		var localData = this.state.data.slice();
		localData.sort(function (a,b) {
			var valA = a[column];
			var valB = b[column];

			return descending ? valA < valB : valA > valB;
		});

		this.setState({
			data: localData,
			sortby: column,
			descending: descending
		});
	},

	render: function() {
		var self = this;
		return (
			React.DOM.div(null,

			React.DOM.table(null,
				React.DOM.thead({ onClick: this._sort},
					React.DOM.tr(null,
						this.props.headers.map(function(title, idx) {

							if (this.state.sortby === idx) {
								title += this.state.descending ? ' \u2191' : ' \u2193';
							}
							return React.DOM.th({key: idx}, title);
						}.bind(this))
					)
				),
				React.DOM.tbody({onDoubleClick: self._showEditor}, self.state.data.map(function (row, rowidx) {
					return (
						React.DOM.tr({key: rowidx},
							row.map(function (cell, idx) {
								var content = cell;

								// if the `idx` and the `rowidx` match the one being edited
								// otherwise just show the text content
								var edit = self.state.edit;

								if (edit && edit.row === rowidx && edit.cell === idx) { // ...
									content = React.DOM.form({onSubmit: self._save}, React.DOM.input({
											type: 'text',
											defaultValue: content
										})
									);
								}
								return React.DOM.td({ key: idx,
									'data-row': rowidx
								}, content);
							})
						) );
				}) )
			), React.DOM.div(null,
					React.DOM.button({onClick: function() {
						self._undo();
					}}, 'UNDO' ),
					React.DOM.button({onClick: function() {
						self._reset();
					}}, 'RESET' ))
		));
	},

	_savePreviousState: function () {
		this.setState({
			edit: null, // done editing
			previousDataState: JSON.parse(JSON.stringify(this.state.data))
		});

	},

	_undo: function () {
		this._savePreviousState();
		this.setState({
			edit: null, // done editing
			data: JSON.parse(JSON.stringify(this.state.previousDataState))
		});
	},

	_reset: function () {
		this._savePreviousState();

		this.setState({
			edit: null, // done editing
			data: JSON.parse(JSON.stringify(this.props.initialData))
		});

	},

	_save: function (e) {
		e.preventDefault();

		//
		var input = e.target.firstChild;
		var data = this.state.data.slice();

		//Save previous state, so that we can undo
		this._savePreviousState();
		data[this.state.edit.row][this.state.edit.cell] = input.value;
		this.setState({
			edit: null, // done editing
			data: data
		});
	},

	_showEditor: function (e) {
		var row = parseInt(e.target.dataset.row, 10);
		var cell = e.target.cellIndex;

		this.setState({
			edit: {
				row:  row,
				cell: cell
			}
		});
		//alert('row: ' + row + '\n' + 'cell: ' + cell);
	}

});

var headers = [
	"Book", "Author", "Language", "Published", "Sales"
];

var startData = [
	["The Lord of the Rings",                    "J. R. R. Tolkien",         "English", "1954–1955", "150 million"],
	["Le Petit Prince (The Little Prince)",      "Antoine de Saint-Exupéry", "French",  "1943",      "140 million"],
	["Harry Potter and the Philosopher's Stone", "J. K. Rowling",            "English", "1997",      "107 million"],
	["And Then There Were None",                 "Agatha Christie",          "English", "1939",      "100 million"],
	["Dream of the Red Chamber",                 "Cao Xueqin",               "Chinese", "1754–1791", "100 million"],
	["The Hobbit",                               "J. R. R. Tolkien",         "English", "1937",      "100 million"],
	["She: A History of Adventure",              "H. Rider Haggard",         "English", "1887",      "100 million"]
];

ReactDOM.render(React.createElement(Excel, {
	headers: headers,
	initialData: startData
}), document.getElementById("app"));
