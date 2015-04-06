Aria.classDefinition({
	$classpath: "modules.view.merci.common.widgets.autocomplete.AutoCompleteResources",
	$statics: {
		/**
		 * Suggestion bean that validates a given suggestion
		 * @type String
		 */
		SUGGESTION_BEAN: "aria.resources.handlers.LCResourcesHandlerBean.Suggestion",
		CONFIGURATION_BEAN: "aria.resources.handlers.LCResourcesHandlerBean.Configuration",
		INVALID_CONFIG: "Invalid handler configuration in : %1.",
		INVALD_SUGGESTION_TYPE: "Suggestions must be an array.",
		INVALID_SUGGESTIONS: "Suggestions does not match suggestion bean aria.resources.handlers.LCResourcesHandleBean.Suggestions",
		INVALID_KEYCODE: "Suggestions does not match labelKey or codeKey"
	},
	/**
	 * @param {aria.resources.handlers.LCResourcesHandlerBean:Configuration} cfg
	 */
	$constructor: function(source) {

		/**
		 * Minimum number of letters typed to return suggestions
		 * if threshold is zero the on focus entire list of auto complete will be shown
		 * @type Number
		 */
		this.threshold = source.threshold;

		/**
		 * Regular expression to look for word boundaries if <code>_labelMatchAtWordBoundaries</code> is set to
		 * <code>true</code>. Will treat the positions after each of the regex matches (RegExp.lastIndex) as
		 * markers of the start of new word.
		 * @type RegExp
		 */
		this.boundaryRegex = /\s+/g;
		/**
		 * Whether to try starting the search for the match on all word boundaries in the multi-word label, or only
		 * from the beginning of the label
		 * @protected
		 * @type Boolean
		 */
		this._labelMatchAtWordBoundaries = false;
		/**
		 * Specifies if Label Code combination has been set in Suggestions.
		 * @type Boolean
		 */
		this.__islabelCode = false;
		/**
		 * List of available suggestions.
		 * @protected
		 * @type Array
		 */
		this._suggestions = [];
		/**
		 * Specifies the default options for labelKey and codeKey.
		 * @type Object
		 */
		this._options = {
			labelKey: "label",
			codeKey: "code"
		};

		this.setSuggestions(source.source);
	},
	$destructor: function() {
		this._suggestions = null;
	},
	$onload: function() {
		jsonValidator = aria.core.JsonValidator;
		stringUtil = aria.utils.String;
		typesUtil = aria.utils.Type;
	},
	$onunload: function() {
		jsonValidator = null;
		stringUtil = null;
		typesUtil = null;
	},
	$prototype: {

		/**
		 * Call the callback with an array of suggestions in its arguments. Suggestions that are exact match are
		 * marked with parameter exactMatch set to true.
		 * @param {String} textEntry Search string
		 * @param {aria.core.CfgBeans:Callback} callback Called when suggestions are ready
		 */
		getSuggestions: function(textEntry, callback) {

			if (typesUtil.isString(textEntry) && this.threshold == 0 && textEntry == "spcialEntry:Focus") {
				this.getAllSuggestions(callback);
				return;
			}

			if (typesUtil.isString(textEntry) && textEntry.length >= this.threshold && (this.threshold != 0 || textEntry.length > 0)) {
				textEntry = stringUtil.stripAccents(textEntry).toLowerCase();

				var codeSuggestions = [],
					labelSuggestions = [],
					labelSuggestionsMultiWord = [];
				var nbSuggestions = this._suggestions.length,
					textEntryLength = textEntry.length;
				var multiWord = this._labelMatchAtWordBoundaries;
				var index, suggestion;

				for (index = 0; index < nbSuggestions; index++) {
					suggestion = this._suggestions[index];
					if ((suggestion.code.indexOf(textEntry) != -1) || (suggestion.label.indexOf(textEntry) != -1)) {
						suggestion.original.exactMatch = true;
						codeSuggestions.push(suggestion.original);
					} else if (suggestion.code.substring(0, textEntryLength) === textEntry) {
						codeSuggestions.push(suggestion.original);
						suggestion.original.exactMatch = false;
					} else {
						var boundaries = multiWord ? suggestion.wordBoundaries : [0];
						for (var j = 0, len = boundaries.length, boundary; j < len; j++) {
							boundary = boundaries[j];
							if (suggestion.label.substring(boundary, boundary + textEntryLength) !== textEntry) {
								continue;
							}

							var exactMatch = suggestion.label === textEntry;
							var startsWithMatch = (boundary === 0);

							// matches starting at the beginning are preferred - will be displayed higher
							var suggestionsContainer = startsWithMatch ? labelSuggestions : labelSuggestionsMultiWord;
							suggestion.original.multiWordMatch = !startsWithMatch; // other highlight modifier
							suggestion.original.exactMatch = exactMatch;
							if (exactMatch) {
								suggestionsContainer.push(suggestion.original);
							} else {
								suggestionsContainer.push(suggestion.original);
							}
							break; // found a match starting from 'boundary', no need to search further
						}
					}
				}

				var suggestions = codeSuggestions.concat(labelSuggestions).concat(labelSuggestionsMultiWord);
				this.$callback(callback, suggestions);
			} else {
				this.$callback(callback, null);
			}
		},

		/**
		 * Returns the classpath of the default template for this resourceHandler
		 * @return {String}
		 *
		getDefaultTemplate: function () {
			return 'aria.widgets.form.list.templates.LCTemplate';
		}, Commented for being unused*/

		/**
		 * Set the list of available suggestion
		 * @param {Array} suggestions list of suggestion objects
		 */
		setSuggestions: function(suggestions) {

			if (typesUtil.isArray(suggestions)) {
				var newSuggestions = [],
					suggestionsLabel = this._options.labelKey,
					suggestionsCode = this._options.codeKey;
				if (this._options.sortingMethod && typesUtil.isFunction(this._options.sortingMethod)) {
					suggestions.sort(this._options.sortingMethod);
				}

				for (var index = 0, l = suggestions.length; index < l; index++) {
					var suggestion = suggestions[index];
					if (this.__islabelCode && !jsonValidator.check(suggestion, this.SUGGESTION_BEAN)) {
						return this.$logError(this.INVALID_SUGGESTIONS, null, suggestions);
					} else if (!(suggestion.hasOwnProperty(suggestionsLabel) && suggestion.hasOwnProperty(suggestionsCode))) {
						suggestion = {
							label: suggestion,
							code: suggestion
						}
					}

					var newSuggestion = {};
					newSuggestion.original = suggestion;
					for (var key in suggestion) {
						if (suggestion.hasOwnProperty(key)) {
							if (typeof suggestion[key] == 'string') {
								newSuggestion[key] = stringUtil.stripAccents(suggestion[key]).toLowerCase();
							} else {
								newSuggestion[key] = suggestion[key];
							}
						}
					}

					if (this._labelMatchAtWordBoundaries) {
						newSuggestion.wordBoundaries = this.__getWordBoundaries(newSuggestion.label);
					}
					newSuggestions.push(newSuggestion);
				}
				this._suggestions = newSuggestions;

			} else {
				return this.$logError(this.INVALD_SUGGESTION_TYPE, null, suggestions);
			}

		},
		/**
		 * Set the minimum number of letter required to have suggestions proposed
		 * @param {Integer} nbOfLetters
		 */
		setThreshold: function(nbOfLetters) {
			this.threshold = nbOfLetters;
		},

		/**
		 * Provide a label for given suggestion
		 * @param {Object} suggestion
		 * @return {String}
		 */
		suggestionToLabel: function(suggestion) {
			return suggestion.label;
		},

		/**
		 * Call the callback with all possible suggestions.
		 * @param {aria.core.CfgBeans:Callback} callback
		 */
		getAllSuggestions: function(callback) {
			var originalSuggestions = this._suggestions;
			var nbSuggestions = originalSuggestions.length;
			var returnedSuggestions = [];
			var suggestion;
			for (var index = 0; index < nbSuggestions; index++) {
				suggestion = originalSuggestions[index];
				returnedSuggestions.push(suggestion.original);
			}
			this.$callback(callback, returnedSuggestions);
		},

		/**
		 * Calculate word boundaries, i.e. the indices of first letters of all the words in the label (always
		 * including 0 for the beginning of the word).
		 */
		__getWordBoundaries: function(label) {
			var boundaryRegex = this.boundaryRegex;
			var boundaries = [0]; // mandatory 0 to check the start of the label
			while (boundaryRegex.exec(label) !== null) {
				boundaries.push(boundaryRegex.lastIndex);
			}
			boundaryRegex.lastIndex = 0;
			return boundaries;
		}
	}
});