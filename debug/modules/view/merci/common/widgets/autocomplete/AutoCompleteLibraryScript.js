Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibraryScript',
	$dependencies: ["modules.view.merci.common.widgets.autocomplete.AutoCompleteResources", "aria.html.controllers.Suggestions"],
	$prototype: {

		createSuggestionController: function(input) {

			var controller = {};
			this.textInput = input;
			if (typeof(input.source) == 'undefined')
				input.source = new Array();
			controller.suggestionsController = Aria.getClassInstance("aria.html.controllers.Suggestions");
			if (input.threshold == undefined) {
				input.threshold = 1;
			}
			controller.suggestionsController.setResourcesHandler(new modules.view.merci.common.widgets.autocomplete.AutoCompleteResources({
				"source": input.source,
				"threshold": input.threshold
			}));

			return controller;
		},

		reactOnType: function(evt, args) {

			this.showCross(args);

			if (args.input.keyupFn != null)
				this.$callback(args.input.keyupFn);
			var value = '';
			var inputEL = document.getElementById(args.input.id);
			/*
			 * jsonResponse.showHideAutoCompleteFlag - introduced to enable disable auto complete based on flag
			 *
			 * jsonResponse.showHideAutoCompleteFlag - false - disable auto complete in pages
			 *
			 * jsonResponse.showHideAutoCompleteFlag undefined OR true works as it is i.e shows auto complete
			 * */
			if (inputEL != null && (jsonResponse.showHideAutoCompleteFlag == undefined || jsonResponse.showHideAutoCompleteFlag)) {

				var popupShowFlag = false;
				if ((this.textInput != undefined && this.textInput.popupShow != undefined && this.textInput.popupShow == true) || inputEL.value == "") {
					popupShowFlag = true;
				}

				if ((args.showEmpty == null || args.showEmpty == false) && inputEL.value != "") {
					value = inputEL.value;
				} else if ((args.showEmpty != null && args.showEmpty == "spcialEntry:Focus" && popupShowFlag) || (args.showEmpty == null && inputEL.value == "")) {
					value = "spcialEntry:Focus";
				}

				// get suggestions
				args.suggestionsController.suggestValue(value);
			}

			// show search button
			var searchButton = document.getElementById(args.input.id + 'btn');
			if (searchButton != null) {
				if (value == '') {
					searchButton.style.display = 'none';
				} else {
					searchButton.style.display = 'block';
				}
			}

		},

		showCross: function(args) {

			var inputEL = document.getElementById(args.input.id);
			var delEL = document.getElementById('del' + args.input.id);

			if (inputEL != null && delEL != null) {
				if (inputEL.value == '') {
					delEL.className += ' hidden';
				} else if (delEL.className.indexOf('hidden') != -1) {
					delEL.className = delEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}
		},

		clearField: function(evt, args) {
			var inputEL = document.getElementById(args.input.id);
			var delEL = document.getElementById('del' + args.input.id);

			if (inputEL != null && delEL != null) {
				inputEL.value = '';
				delEL.className += ' hidden';
			}

		},

		focusSearch: function(evt, args) {
			var inputEL = document.getElementById(args.input.id);
			if (inputEL != null) {
				inputEL.focus();
			}
		},

		select: function(evt, args) {
			evt.preventDefault(true);
			args.suggestionsController.setSelected(args.suggestion);
			var inputEL = document.getElementById(args.input.id);
			if (inputEL != null) {
				// show selected result
				if (args.input.selectCode != null && args.input.selectCode == true)
					inputEL.value = args.suggestion.code;
				else
					inputEL.value = args.suggestion.label;
			}

			if (args.input.selectFn != null) {
				var cb = {
					fn: args.input.selectFn.fn,
					args: args,
					scope: args.input.selectFn.scope
				};
				this.$callback(cb);
			}
		},

		onInputBlur: function(event, args) {
			var current = this;
			args.showEmpty = true;
			if (args.input.onblur != null) {
				this.$callback(args.input.onblur);
			}
			setTimeout(function() {
				current.reactOnType(event, args)
			}, 500);
		},
		onInputFocus: function(event, args) {
			var current = this;
			args.showEmpty = "spcialEntry:Focus";
			if (args.input.onfocus != null) {
				this.$callback(args.input.onfocus);
			}
			setTimeout(function() {
				current.reactOnType(event, args)
			}, 500);
		}
	}
});