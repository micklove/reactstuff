

(function() {
	"use strict";

	var Excel = React.createClass({

		displayName: "Excel",
		headers:     React.PropTypes.arrayOf(React.PropTypes.string),
		initialData: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)),

		getInitialState: function() {
			return {
				//Use JSON methods to make a deep copy
				data: JSON.parse(JSON.stringify(this.props.initialData)),
				previousDataState: JSON.parse(JSON.stringify(this.props.initialData)),
				sortBy: null,
				descending: false,
				edit: null //{row: index, cell: index}
			};
		},


		render: function() {
			console.log('render');
			return React.DOM.div(null,
				this._renderTable(),
				React.DOM.div({
						className: 'excel-toolbar'
					},
					this._renderButton('SEARCH', this._search),
					this._renderButton('UNDO',   this._undo),
					this._renderButton('RESET',  this._reset)));
		},

		_renderTable: function() {
			var self = this;
			return (
				React.DOM.table(null,
					React.DOM.thead({ onClick: this._sort},
						React.DOM.tr(null,
							this.props.headers.map(function(title, idx) {

								if (this.state.sortBy === idx) {
									title += this.state.descending ? ' \u2191' : ' \u2193';
								}
								return React.DOM.th({key: idx}, title);
							}.bind(this))
						)
					),
					React.DOM.tbody({onDoubleClick: self._showEditor}, self.state.data.map(function (row, rowidx) {
							return (
								React.DOM.tr({key: rowidx},
									row.map(function (cellText, idx) {
										var content = cellText;

										// if the `idx` and the `rowidx` match the one being edited
										// create a form, with input text field, otherwise just show the text content
										var edit = self.state.edit;

										if (edit && edit.row === rowidx && edit.cell === idx) { // ...
											content = React.DOM.form({onSubmit: self._save}, React.DOM.input({
													type: 'text',
													defaultValue: content,
													//autoFocus: true,
													ref: "selectedInputField",
													//onFocus: function(e) {e.target.select();}
												})
											);
										}
										return React.DOM.td({ key: idx,
											'data-row': rowidx
										}, content);
									})
								)
							);
						})
					)
				)
			);
		},

		_handleKeyDown: function(event){

			//27 === ESC key
			if(event.keyCode === 27){
				this.setState({
					edit: null // done editing
				});
			}
			//9 === TAB key   (TODO - TAB to Previous/Next cell)
			else if(event.keyCode === 9){
				if(event.shiftKey) {
					console.log('shift tab pressed');
				} else {
					console.log('tab pressed');
				}
			}
		},

		/**
		 * After the user double clicks the cell for edit, the text input,
		 * named "inputToFocusOn", is visible, but not selected.
		 *
		 * Find the text input in the React dom...
		 * (by using the "ref: selectedInputField" property)
		 * .. and set it to selected.
		 *
		 * nb: could also have just used the slighly simpler... (to achieve the same effect)
		 * React.DOM.input({
		 *    ...
		 *    autoFocus: true
		 *    onFocus: function(e) {e.target.select();}
		 *  ...
		 *  })
		 */
		componentDidUpdate: function (){
			if(this.state.edit) {
				ReactDOM.findDOMNode(this.refs.selectedInputField).select();
			}
		},

		componentWillMount:function(){
			console.log("componentWillMount");
			document.addEventListener("keydown", this._handleKeyDown, false);
		},

		_search: function(e) {
			alert('not implemented yet... :( ');
		},


		_renderButton: function(buttonName, onClickFunc) {
			return React.DOM.button({
				onClick: function() { onClickFunc(); },
				className: 'excel-button'
			}, buttonName );
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

		/**
		 * Reset, but allow undo (by saving previous state)
		 * @private
		 */
		_reset: function () {
			var previousDataState = JSON.parse(JSON.stringify(this.state.data));
			var resetState = this.getInitialState();
			resetState.previousDataState = previousDataState;
			this.setState(resetState);
		},

		_save: function (e) {
			e.preventDefault();

			//
			var input = e.target.firstChild;
			var data = this.state.data.slice();

			//Save previous state, so that we can undo
			this._savePreviousState();
			data[this.state.edit.row][this.state.edit.cell] = input.value;

			//Updated text may need to be sorted
			if(this.state.sortBy) {
				this._sortData(this.state.edit.cell, false);
			}

			this.setState({
				edit: null, // done editing
				data: data
			});
		},

		_showEditor: function (e) {
			console.log('_showEditor');
			var row = parseInt(e.target.dataset.row, 10);
			var cell = e.target.cellIndex;

			this.setState({
				edit: {
					row:  row,
					cell: cell
				}
			});
		},

		_sort: function(e) {
			this._sortData(e.target.cellIndex, true);
		},

		_sortData: function (cellIndex, toggleSort) {
			var column = cellIndex;

			var descending = this.state.sortBy === column;

			if(toggleSort === true) {
				descending = this.state.sortBy === column && !this.state.descending;
			}

			//deep copy the data, rather than slice()
			var localData = JSON.parse(JSON.stringify(this.state.data));
			console.log(localData);
			localData.sort(function (a,b) {
				var valA = a[column];
				var valB = b[column];
				return descending ? valA < valB : valA > valB;
			});

			this.setState({
				data: localData,
				sortBy: column,
				descending: descending
			});
		}


	});
	var headers = [
		"Book", "Author(s)", "Language", "Published", "Sales"
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

}());

