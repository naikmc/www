Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.services.MAssistanceScript",
	$dependencies: [
		'aria.utils.Array',
		'aria.utils.Date',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.ServiceCatalog',
		'modules.view.merci.common.utils.ServiceSelection'
	],
	$statics: {
		CATEGORY_ASSISTANCE: 'SPE',
		INPUT_FREE: 'FREETXT',
		INPUT_MULTIPLE: 'MULTIPLE',
		PTY_NUMBER: 'NUMBER',
		DEFAULT_UNIT: '',
		SERVICE_STATE: 'STATE',
		STATE_BOOKED: 'INITIAL',
		STATE_ADDED: 'ADDED',
		STATE_MODIFIED: 'MODIFIED'
	},
	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
	},
	$prototype: {
		$dataReady: function() {
			var model = this.moduleCtrl.getModuleData().MAssistance;
			this.config = model.config;
			this.labels = model.labels;
			this.request = model.request;
			this.reply = model.reply;
			this.tripplan = this.moduleCtrl.getTripPlan();
			this.bookedSelection = new modules.view.merci.common.utils.ServiceSelection(this.tripplan.air.services, this.tripplan.air.itineraries);
			this.currentSelection = this.moduleCtrl.getCurrentSelection();
			this._catalog = this.moduleCtrl.getCatalog();
			this.data.messages = this.utils.readBEErrors(this.reply.errors);
			this.data.defaultPaxIndex = this.__getDefaultPaxIndex(); //Index of pax to display by default in carousel
			this.data.currency = this._catalog.getCurrency();
			this.data.assistanceData = this.__initAssistanceData();
			this.data.assistanceName = this.__getAssistanceName();
			this.data.disableContinue = true; //State of 'Continue' button
			this.data.disableModif = !this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');
			this._setDisableContinue();
			this.data.siteServicesPhone = this.config.siteServicesPhone;
			this.data.siteServicesEmail = this.config.siteServicesEmail;
		},
		$viewReady: function() {
			document.body.className = 'pnr-retrieve assistance';
			var header = this.moduleCtrl.getModuleData().headerInfo;
			this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: header.showButton
			});
			this.moduleCtrl.setHeaderCurrInfo(false);
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAssistance",
						data:this.data
					});
			}
		},
		
		/**
		 * Reads from the request the index (in the pax array) of the passenger to be selected by default in the carousel
		 */
		__getDefaultPaxIndex: function() {
			var defaultIndex = 0;
			if (!this.utils.isEmptyObject(this.request.passengerId)) {
				var defaultId = this.request.passengerId;
				var passengers = this.tripplan.paxInfo.travellers;
				for (var p = 0; p < passengers.length; p++) {
					if (String(passengers[p].paxNumber) === defaultId) {
						defaultIndex = p;
					}
				}
			}
			return defaultIndex;
		},
		/**
		 * Reads from the catalogue the localised name of the service being selected,
		 * or an empty string if no pet is available (not supposed to happen)
		 */
		__getAssistanceName: function() {
			var assistanceServices = this._catalog.getServices(this.CATEGORY_ASSISTANCE);
			var assistanceName = '';
			if (assistanceServices.length > 0) {
				assistanceName = assistanceServices[0].name;
			}
			return assistanceName;
		},
		/**
		 * Creates the object describing the available assistance options for each passenger and bound
		 * Object structure: {
		 *   passengers: [{
		 *          available:     		<whether SE in catalogue for this pax and bound>,
		 *          booked:        		<SE code in trip plan>,
		 *          choices: [{
		 *              code:      		<SE code>,
		 *              name:      		<localised SE name>,
		 *              inputTags: 		<input tags to send>,
		 *              price:     		<price for current value>
		 *          }, ...],
		 *          current:       		<an item of choices> ,
		 *      	items: [{      		<array of multiple instances of the assistance>
		 *			choice:         <selected choice for the item>,
		 *			id: 			<item id>,
		 *			state:          <whether it is modification or new booking>
		 *		},....],
		 *		itemsAddedVar       <dummy variable whose value is toggled whenever an item is added to the list >,
		 *		paxId				<passenger Id>
		 *   }, ...],
		 *   selectedPax: <an item of passengers>
		 * }
		 */
		__initAssistanceData: function() {
			var assistanceData = {
				passengers: []
			};
			var passengers = this.tripplan.paxInfo.travellers;
			//var bounds = this.tripplan.air.itineraries;
			for (var p = 0; p < passengers.length; p++) {
				var paxNumber = passengers[p].paxNumber;
				assistanceData.passengers[p] = {}
				var pnrData = this.__initPnrData(paxNumber);
				assistanceData.passengers[p] = pnrData;
				if (p === this.data.defaultPaxIndex) {
					assistanceData.selectedPax = assistanceData.passengers[p];
				}
			}
			return assistanceData;
		},
		/**
		 * Creates the object describing the available assistance options for the given passenger and bound
		 */
		__initPnrData: function(paxNumber) {
			var boundId = null;
			var services = this._catalog.getServices(this.CATEGORY_ASSISTANCE, paxNumber, boundId);
			var avail = services.length > 0;
			var pnrData = {
				paxId: paxNumber,
				available: avail,
				itemsAddedVar: true,
				items: []
			};
			var selectedServices = this.currentSelection.getServices(this.CATEGORY_ASSISTANCE, paxNumber, null, null);
			if (selectedServices.length > 0) {
				pnrData.current = [];
			}
			if (avail) {
				var choices = [];
				for (var s = 0; s < services.length; s++) {
					var choice = this.__createChoice(services[s], paxNumber);
					choices.push(choice);
					for (var m = 0; m < selectedServices.length; m++) {
						if (choice.code === selectedServices[m].code) {
							var state = this.getAttribute(selectedServices[m], this.SERVICE_STATE);
							var itemId = this.__getItemId(pnrData.items, paxNumber);
							pnrData.current.push(choice);
							var currentItem = {
								id: itemId,
								state: state
							};
							if (state == this.STATE_BOOKED || state == this.STATE_ADDED) {
								var tempChoice = aria.utils.Json.copy(choice);
								for (var t in tempChoice.inputTags) {
									var selectionIndex = selectedServices[m].selectionIndex.charAt(7);
									var tag = t.replace('[i]', selectionIndex);
									tempChoice.inputTags[tag] = tempChoice.inputTags[t];
									delete tempChoice.inputTags[t];
								}
								currentItem.choice = tempChoice;
							} else {
								currentItem.choice = choice;
							}
							pnrData.items.push(currentItem);
						}
					}
					if (choice.price) {
						pnrData.hasChargeable = true;
					}
				}
				pnrData.choices = choices;
			}
			return pnrData;
		},
		/**
		 * Creates a single option of pets for a drop-down input
		 */
		__createChoice: function(service, paxNumber) {
			var boundId = null;
			var eligGroup = this._catalog.getEligibilityGroupsFromService(service, paxNumber, boundId, null)[0];
			var choice = {
				code: service.code,
				name: service.name
			};
			var tags = {};
			var price = eligGroup.priceInfo ? eligGroup.priceInfo.totalAmount : 0;
			choice.price = price;
			var numberProperty = this._catalog.getFirstProperty(eligGroup, this.PTY_NUMBER);
			var rawTag = this._catalog.getParameterValue(numberProperty, 'VALUE', 'inputTag');
			var bounds = this.tripplan.air.itineraries;
			for (var b = 0; b < bounds.length; b++) {
				var segments = bounds[b].segments;
				for (var s = 0; s < segments.length; s++) {
					var finalTag = rawTag.replace('[p]', paxNumber).replace('[s]', segments[s].id);
					tags[finalTag] = '1';
				}
			}
			choice.inputTags = tags;
			return choice;
		},
		/**
		 * Call-back used by the carousel to tell that a new passenger was selected
		 */
		selectPax: function(pId) {
			this.$json.setValue(this.data.assistanceData, 'selectedPax', this.data.assistanceData.passengers[pId]);
		},
		/**
		 * Event handler when the user selects a value in the drop-down
		 */
		setValue: function(evt, args) {
			//args:{itemId, assistanceData}
			var value = evt.target.getValue();
			var current = null;
			var assistanceData = args.assistanceData;
			var itemsList = args.assistanceData.items;
			if (value) {
				current = {};
				current.id = args.itemId;
				if (args.state != undefined) {
					current.state = args.state;
				} else {
					current.state = "";
				}
				for (var c = 0; c < assistanceData.choices.length; c++) {
					if (assistanceData.choices[c].code === value) {
						current.choice = aria.utils.Json.copy(assistanceData.choices[c]);
						break;
					}
				}
			}
			for (var t in current.choice.inputTags) {
				if (t.indexOf('i') != -1) {
					var count = this.countInstances(current.choice.code, itemsList);
					var tag = t.replace('[i]', count + 1);
					current.choice.inputTags[tag] = current.choice.inputTags[t];
					delete current.choice.inputTags[t];
				}
			}
			for (var i = 0; i < itemsList.length; i++) {
				if (itemsList[i].id == args.itemId) {
					if (itemsList[i].state) {
						for (var t in itemsList[i].choice.inputTags) {
							if (!this.$json.isMetadata(t)) {
								if (itemsList[i].state == this.STATE_BOOKED)
									current.choice.inputTags[t] = "0";
								else if (itemsList[i].state == this.STATE_ADDED)
									current.choice.inputTags[t] = null;
							}
						}
					} else {
						if (itemsList[i].choice) {
							for (var t in itemsList[i].choice.inputTags) {
								if (itemsList[i].choice.inputTags[t] == "0" && !this.$json.isMetadata(t))
									current.choice.inputTags[t] = "0";
							}
						}
					}
					itemsList[i] = current;
				}
			}
			this.$json.setValue(assistanceData, 'current', current);
			this._setDisableContinue();
		},
		countInstances: function(code, itemsArray) {
			var count = 0;
			for (var i = 0; i < itemsArray.length; i++) {
				if (itemsArray[i].choice && code == itemsArray[i].choice.code)
					count++;
			}
			return count;
		},
		/**
		 * Updates the state of the 'Confirm' button, so that it is enabled only if something is selected
		 */
		_setDisableContinue: function() {
			var disable = true;
			var passengers = this.data.assistanceData.passengers;
			for (var p = 0; p < passengers.length; p++) {
				if (passengers[p].available && passengers[p].items.length > 0) {
					var items = passengers[p].items;
					for (var i = 0; i < items.length; i++) {
						var current = items[i].choice;
						if (!this.data.disableModif) {
							disable = false;
							break;
						} else {
							if (items[i].state != this.STATE_BOOKED && current && current.value != "") {
								disable = false;
								break;
							}
						}
					}
				}
				if (!disable) {
					break;
				}
			}
			this.$json.setValue(this.data, 'disableContinue', disable);
		},
		/**
		 * Event handler when the user clicks on confirm.
		 * Reads all the input tags from the assistanceData and replaces as required the value with the user inputs.
		 */
		confirm: function(evt) {
			var inputTags = {};
			var passengers = this.data.assistanceData.passengers;
			for (var p = 0; p < passengers.length; p++) {
				for (var i in passengers[p].items) {
					if (passengers[p].items[i].choice) {
						for (var t in passengers[p].items[i].choice.inputTags) {
							if (!this.$json.isMetadata(t)) {
								inputTags[t] = passengers[p].items[i].choice.inputTags[t];
							}
						}
					}
				}
			}
			this.moduleCtrl.updateBasket(this.CATEGORY_ASSISTANCE, inputTags, {
				fn: this.__errorCallback,
				scope: this
			});
		},
		__errorCallback: function(reply) {
			var messages = this.utils.readBEErrors(reply.errors);
			this.$json.setValue(this.data, 'messages', messages);
		},
		addItems: function(evt, pax) {
			var itemsAddedVar = this.data.assistanceData.selectedPax.itemsAddedVar;
			var arr = this.data.assistanceData.selectedPax.items;
			var itemId = this.__getItemId(arr, this.data.assistanceData.selectedPax.paxId);
			arr.push({
				id: itemId
			});
			this.$json.setValue(this.data.assistanceData.selectedPax, 'items', arr);
			this.$json.setValue(this.data.assistanceData.selectedPax, 'itemsAddedVar', !itemsAddedVar);
		},
		__getItemId: function(items, paxId) {
			var itemNumber = 0;
			for (var i = 0; i < 100; i++) {
				if (items.length > 0) {
					if (items[i] != undefined) {
						if (i != parseInt(items[i].id.substr(7, 1))) {
							itemNumber = i;
							break;
						}
					} else {
						itemNumber = i;
						break;
					}
				}
			}
			return 'itemp' + paxId + 'i' + itemNumber;
		},
		__deleteItems: function(evt, id) {
			var itemsAddedVar = this.data.assistanceData.selectedPax.itemsAddedVar;
			var arr = this.data.assistanceData.selectedPax.items;
			this.moduleCtrl.deleteItem(arr, id);
			this.$json.setValue(this.data.assistanceData.selectedPax, 'itemsAddedVar', !itemsAddedVar);
			this._setDisableContinue();
		},
		/**
		 * Returns the value of service attribute with the given type, or undefined if it does not exist.
		 */
		getAttribute: function(service, attrType) {
			var value;
			var attributes = service.attributes;
			for (var a = 0; a < attributes.length; a++) {
				if (attributes[a].type === attrType) {
					value = attributes[a].value;
					break;
				}
			}
			return value;
		}
	}
});