Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.services.MGenericServiceLoaderScript",
	$dependencies: [
		'aria.utils.Array',
		'aria.utils.Date',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.ServiceCatalog',
		'modules.view.merci.common.utils.ServiceSelection'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		/**
		 * Object to store the option data for services that have been selected 
		 * @type {Object}
		 * paxNumber:{
		 * 		elementId:{		<e.g.: SEG_1, BOUND_2, TRIP etc.>
		 * 			eligibility: <the eligibility object for the service>,
		 * 			eligibilityKey: <the eligibility key of the eligibility>,
		 * 			itineraryId : <The itinerary id @type int>,
		 * 			segmentId: <The segment id @type int>,
		 * 			serviceCode: <Four-letter code of selected service>,
		 * 			travellerId: <Passeneger id @type int>
		 * 		}
		 * }
		 */
		this._selectedServices = {};

		/**
		 * Object to store the input tags corresponding to the pax and association
		 * @type {Object}
		 * paxNumber:{
		 * 		elementId:{		<e.g.: SEG_1, BOUND_2, TRIP etc.>
		 * 			eligibilityKey:[{
		 * 				code: <The code of the list property selected>,
		 * 				id: <The input tag with placeholders replaced>,
		 * 				value: <The value for the input tag to be sent>,
		 * 				isMandatory: <Flag for specifying if the input param is mandatory or optional>,
		 * 				regex: <The regular expression to be validated. Null if not present>
		 * 			}, ..]
		 * 		}
		 * }
		 * 
		 */
		this._selectedServiceParameters = {};

		/**
		 * Array of eligibility keys which are already present in the PNR.
		 * @type {Array}
		 */
		this._pnrSelection = [];

		/**
		 * 
		 */
		this._servicesTotalInstances={};
	},

	$prototype: {

		$dataReady: function() {
			var model = this.moduleCtrl.getModuleData().MGenericServ;
			this.labels = model.labels;
			this.request = model.request;
			this.reply = model.reply
			this.tripplan = this.moduleCtrl.getTripPlan();
			this.data.currentSelection = this.moduleCtrl.getCurrentSelection();
			this.catalog = this.moduleCtrl.getCatalog();
			this.data.errors = new Array();
			this.data.siteServicesPhone = model.config.siteServicesPhone;
			this.data.siteServicesEmail = model.config.siteServicesEmail;
			this.data.currency = this.catalog.getCurrency();
			this.data.messages = this.utils.readBEErrors(this.reply.LIST_MSG);
			this.data.defaultPaxIndex = this.__getDefaultPaxIndex(); //Index of pax to display by default in carousel
			this.data.selectedPax = this.tripplan.paxInfo.travellers[this.data.defaultPaxIndex];
			this.data.category = this._getCategory(model.reply.category);
			this.initCategoryData();
			this.data.selectedServiceFromDropdown = false;
			this.data.refreshFooterFlag = false;
			this.data.displayOptionalParamters = this.utils.booleanValue(model.config.enableOptionalParameters);
			this.data.showNewDatePicker = this.utils.booleanValue(model.config.showNewDatePicker);
			this.data.disableContinue = true;
			this.data.basketServices = false;
			this.data.disableContinueFlag = true;
			this.data.disableModif = !this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');
			if (!this.data.displayedEligibilities) {
				this.data.displayedEligibilities = [];
			}
			this._initServicesTotalInstances();
			this._handleCurrentSelection(this.data.currentSelection);
			this.data.__pageLoadCounter=0;
		},

		$viewReady: function() {
			document.body.className = 'pnr-retrieve';
			if (this.data.categoryCode == "SPE") {
				document.body.className = 'pnr-retrieve assistance';
			}
			
			var header = this.moduleCtrl.getModuleData().headerInfo;
			this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: header.showButton
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MGenericServiceLoader",
						data:this.data
					});
			}
		},
		$displayReady: function() {
			var datePickers = document.getElementsByClassName("ancillaryDatePicker");
			if (datePickers.length > 0) {
				for (var d = 0; d < datePickers.length; d++) {
					var current = datePickers[d];
					this.createDatePicker(current);
				}
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

		initCategoryData: function() {
			
				this.displaySimpleCategoryService(this.data.category);
			
		},

		displaySimpleCategoryService: function(category) {
			var servicesToDisplay = {
				subcategoryCodes: [],
				serviceCodes: [],
				displayedItem: {
					type: "CATEGORY",
					value: category,
					categoryCode: category.code
				}
			};
			var nbServices = category.services.length;
			for (var i = 0; i < nbServices; i++) {
				var service = category.services[i];
				servicesToDisplay.serviceCodes.push(service.code);

			}
			this.displayServicePopup(servicesToDisplay);
		},

		displayService: function(evt, args) {
			var servicesToDisplay = {
				subcategoryCodes: [],
				serviceCodes: []
			};
			if (args.serviceCode) {
				servicesToDisplay.serviceCodes = [args.serviceCode];
				servicesToDisplay.displayedItem = {
					type: "SERVICE",
					value: this.getServiceByCode(args.serviceCode),
					categoryCode: args.categoryCode
				};
			} 
			this.displayServicePopup(servicesToDisplay);
		},

		displayServicePopup: function(servicesToDisplay) {
			this.$json.setValue(this.data, "displayedServiceCodes", servicesToDisplay.serviceCodes);
			this.$json.setValue(this.data, "displayedItem", servicesToDisplay.displayedItem);
			this.$json.setValue(this.data, "categoryCode", servicesToDisplay.displayedItem.categoryCode);
		},

		/**
		 * Method to retun the category
		 */
		_getCategory: function(categoryCode) {
			var categories = this.data.catalog.categories;
			var nbCategories = categories.length;
			for (var i = 0; i < nbCategories; i++) {
				if (categories[i].code == categoryCode) {
					return categories[i];
				}
			}
		},

		/**
		 * Method to return the services for a particular category.
		 */
		getServicesForCategory: function(categoryCode) {
			var categories = this.catalog.categories;
			for (serv in categories) {
				if (categories[serv].code == categoryCode) {
					return categories[serv].services;
				}
			}
		},

		/**
		 * Method to return the available values inside TYPE input param.
		 * @param  {Object} inputParam
		 * @return Array of available values, each of which contains the value and the label        
		 */
		handleAvailableValues: function(inputParam) {
			var availableValues = [];
			var option;
			availableValues.push({
				value: "",
				label: ""
			})
			for (value in inputParam.availableValues) {
				// first check that the current value is not AriaTemplates metadata related to widget bindings
				if (!aria.utils.Json.isMetadata(value)) {
					// if no label, use the value as label
					var label;
					if (inputParam.availableValues[value] == null) {
						label = value;
					} else {
						label = inputParam.availableValues[value];
					}
					option = {
						value: value,
						label: label
					};
					availableValues.push(option);
				}
			}
			// set the first value (EMPTY) in the bound data object if nothing present in _selectedServiceParameters
			/* if (!this._selectedServiceParameters[eligibilityKey][inputPattern]) {
                var firstValue = availableValues[0].value;
                aria.utils.Json.setValue(this._selectedServiceParameters[eligibilityKey], inputPattern, firstValue);
            }*/
			return availableValues;
		},

		toggle: function(event, args) {
			this.utils.toggleExpand(event, args);
		},

		/**
		 * Method to return the service object corresponding to the parameter service code
		 */
		getServiceByCode: function(serviceCode) {
			var categories = this.data.catalog.categories;
			var nbCategories = categories.length;
			for (var i = 0; i < nbCategories; i++) {
				var category = categories[i];
				var nbServices = category.services.length;
				for (var j = 0; j < nbServices; j++) {
					var service = category.services[j];
					if (service.code == serviceCode) {
						return service;
					}
				}
			}
		},

		/* Call-back used by the carousel to tell that a new passenger was selected
		 */
		selectPax: function(pId) {
			var selectedPax = this.data.selectedPax;
			var travellers = this.tripplan.paxInfo.travellers;
			for (var t in travellers) {
				if (travellers[t].paxNumber == pId + 1)
					selectedPax = travellers[t];
			}
			this.$json.setValue(this.data, 'selectedPax', selectedPax);
		},

		/*Method to get the services with association mode 'ITI'*/
		getServicesForWholeTrip: function(popupCategory) {
			return this.getDisplayedServices(this.data.servicesAllTrip, popupCategory);
		},

		/*Method to get the services with association mode 'GND'*/
		getSVCServices: function(categoryCode) {
			return this.getDisplayedServices(this.data.servicesSVC, categoryCode);
		},

		/*Method to get the services with association mode 'ELE'*/
		getServicesForBound: function(elementId, categoryCode) {
			return this.getDisplayedServices(this.data.mapItineraryToService[elementId], categoryCode);
		},

		/*Method to get the services with association mode 'SEG'*/
		getServicesForSegment: function(segmentId, categoryCode) {
			return this.getDisplayedServices(this.data.mapSegmentToService[segmentId], categoryCode);
		},

		getDisplayedServices: function(services, categoryCode) {
			var displayedServices = []; // put in this array the services to be displayed for the whole trip
			var displayedServiceCodes =  this.data.displayedServiceCodes; // all service codes to be displayed
			var availableServices = services[categoryCode];
			if (availableServices) {
			for (var i = 0; i < availableServices.length; i++) {
				// check that the categoryCode of the service is the same as the one of the displayed service popup and that
				// either the service code ore the subcategory code are among the ones of the codes to be displayed
				var isDisplayedService = aria.utils.Array.contains(displayedServiceCodes, availableServices[i].code);
				if (isDisplayedService) {
					displayedServices.push(availableServices[i]);
				}
			}
			}
			return displayedServices;
		},

		isServiceDisplayed: function(service) {
			var serviceCodes =  this.data.displayedServiceCodes;
			if (!service || !service.code) {
				this.$logDebug("Received service without code");
				return false;
			}
			return aria.utils.Array.contains(serviceCodes, service.code);
		},

		createElementIdentifier: function(associationMode, itineraryId, segmentId, instanceId) {
			if (associationMode == "ITI" ) {
				return "TRIP";
			} else if (associationMode == "ELE") {
				return "BOUND_" + itineraryId;
			} else if (associationMode == "SEG") {
				return "SEG_" + segmentId;
			}else if (associationMode == "GND"){
				return "SVC_" + instanceId;
			}
		},

		/**
		 * Create an option element for the category service dropdown
		 */
		_createCatDropdownOption: function(service, itineraryId, segmentId, travellerId, eligibility) {
			//Generate the label of the service
			var label = this._generateDropdownLabel(service, eligibility.eligibilityKey);
			var description = service.description;
			//Return the option element
			var option = {
				serviceCode: service.code,
				label: label,
				eligibilityKey: eligibility.eligibilityKey,
				eligibility: eligibility,
				itineraryId: itineraryId,
				segmentId: segmentId,
				travellerId: travellerId,
				categoryCode: service.categoryCode
			};
			if (description) {
				option.description = description;
			}
			return option;
		},

		/**
		 * Create a string to display as the dropdown label with the service name and price (if available at catalog retrive)
		 */
		_generateDropdownLabel: function(service, eligibilityKey) {
			var label = service.name;
			var eligibilityGroup = null;
			var nbEligGroups = service.eligibilityGroups.length;
			// find the eligibility group that contains the eligibility key of the service to display
			eligGroupsLoop: for (var i = 0; i < nbEligGroups; i++) {
				var eligibilities = service.eligibilityGroups[i].eligibilities;
				var nbEligibilities = eligibilities.length;

				for (var j = 0; j < nbEligibilities; j++) {
					if (eligibilities[j].eligibilityKey == eligibilityKey) {
						eligibilityGroup = service.eligibilityGroups[i];
						break eligGroupsLoop;
					}
				}
			}
			// if eligibility group was found and has a price, add it to the label string
			if (eligibilityGroup && eligibilityGroup.priceInfo) {
				var price = eligibilityGroup.priceInfo.totalAmount;
				var currency = eligibilityGroup.priceInfo.currency.code;
				//  var formattedPrice = utils.AriaTemplatesLocalization.formatPrice(price, currency);
				var formattedPrice = currency + " " + price;
				label = [label, formattedPrice].join('-');
				// if service is not passenger associated, add "per traveller" next to the price
				if (!service.passengerAssociated) {
					var perTravellerText = utils.AriaTemplatesLocalization.get("tx_pltg_services_per_pax");
					label = [label, perTravellerText].join(' ');
				}
			}
			return label;
		},

		getEligibleServicesInCategory: function(categoryServices) {
			var nbServices = categoryServices.length;
			var eligibleServices = [];

			serviceLoop: for (var i = 0; i < nbServices; i++) {
				var service = categoryServices[i];
				var paxAssociated = service.passengerAssociated;
				var nbEligibilityGroups = service.eligibilityGroups.length;
				for (var j = 0; j < nbEligibilityGroups; j++) {
					var eligibilities = service.eligibilityGroups[j].eligibilities;
					var nbEligibilities = eligibilities.length;
					for (var k = 0; k < nbEligibilities; k++) {
						if (paxAssociated) {
							var passengerIds = eligibilities[k].passengerIds;
							if (aria.utils.Array.contains(passengerIds, this.data.selectedPax.paxNumber)) {
								eligibleServices.push(service);
								continue serviceLoop;
							}
						} else {
							eligibleServices.push(service);
							continue serviceLoop;
						}
					}
				}
			}

			return eligibleServices;
		},

		/**
		 * Method to return the dropdownOptions that are used to fill the first dropdown.
		 */
		createCategoryData: function(services, itineraryId, segmentId) {
			//Get a shortcut to the object of selected values
			var selectedValues = this.data.selectedValues;
			var travellerId = this.data.selectedPax.paxNumber;
			//Build the traveller id, if travellerId is null, it means the service is not traveller associated
			travIdString = travellerId === null ? 'NO_TRAVELLER' : 'TRAVELLER_' + travellerId;
			// push blank option at the beggining of the list
			var dropdownOptions = [{
				value: "EMPTY",
				label: this.labels.tx_merci_text_PleaseSelect,
				eligibilityKey: "",
				eligibility: "",
				itineraryId: "",
				segmentId: "",
				travellerId: ""
			}];
			// check if there is a selectedValue in selectedValues for this eligibility
			for (var i = 0; i < services.length; i++) {
				//Get the eligibility object for the current service
				var eligibility = this.moduleCtrl.getEligibilityForService(services[i], services[i].associationMode, itineraryId, segmentId, travellerId);
				// add each eligible service as an option of the selectbox
				dropdownOptions.push(this._createCatDropdownOption(services[i], itineraryId, segmentId, travellerId, eligibility));
			}
			return dropdownOptions;
		},

		/**
		 * Event handler called on selection of first dropdown.
		 */
		selectService: function(evt, args) {
			var options = args.options;
			var elementId = args.elementId;
			var selectedServiceCode = evt.target.getValue();
			var eligibility = null;
			for (o in options) {
				if (options[o].serviceCode == selectedServiceCode) {
					this.setServiceInSelectedServices(options[o], elementId);
				}
			}
		},
		setServiceInSelectedServices: function(selectedOption, elementId){
					var eligibility = selectedOption.eligibility;
					var eligibilityKey = eligibility.eligibilityKey;
					if (!this._selectedServices[this.data.selectedPax.paxNumber]) {
						this._selectedServices[this.data.selectedPax.paxNumber] = {};
					}
					if (!this._selectedServices[this.data.selectedPax.paxNumber][elementId]) {
						this._selectedServices[this.data.selectedPax.paxNumber][elementId] = {};
					} else {
						
						delete this._selectedServices[this.data.selectedPax.paxNumber][elementId];
					
					}
					this._selectedServices[this.data.selectedPax.paxNumber][elementId] = selectedOption;
					this._setDisableContinue();
					this.$json.setValue(this.data, 'selectedServiceFromDropdown', !this.data.selectedServiceFromDropdown);
			
		},


		/**
		 * returns true if inputParam has a defined requiredLevel of MANDATORY, false otherwise
		 */
		isParamMandatory: function(property, inputParam) {

				if(property.requiredLevel.toUpperCase()=="MANDATORY" && inputParam.requiredLevel.toUpperCase()=="MANDATORY")
					return true;
				else
					return false;
		},

		/**
		 * Method called on selection of a service in the first drpdown, when the input parameters are displayed.
		 * Adds the input tags and their corresponding values to the this._selectedServiceParameters map
		 */
		addInputParameterstoMap: function(elementId, eligibilityKey, inputPattern, code, validationRegex, paramValue, isMandatory, maxValue) {
			var travellerId = this.data.selectedPax.paxNumber;
			var value = paramValue != null ? paramValue : "";
			if(parseInt(value, 10))
				value=parseInt(value,10);
			var maxValue = maxValue !=null ? maxValue : "";
			if (!this._selectedServiceParameters[travellerId]) {
				this._selectedServiceParameters[travellerId] = {};
			}
			if (!this._selectedServiceParameters[travellerId][elementId]) {
				this._selectedServiceParameters[travellerId][elementId] = {};
			} else {
				for (var eligibility in this._selectedServiceParameters[travellerId][elementId]) {
					if (eligibility != eligibilityKey) {
						for (var e in this._selectedServiceParameters[travellerId][elementId][eligibility]) {
							this._selectedServiceParameters[travellerId][elementId][eligibility][e].value = null;
						}
					}
				}
			}
			if (this._selectedServiceParameters[travellerId][elementId][eligibilityKey]) {
				var push = true;
				for (var param in this._selectedServiceParameters[travellerId][elementId][eligibilityKey]) {
					if (this._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].id == inputPattern) {
						push = false;
					}
				}
				if (push) {
					this._selectedServiceParameters[travellerId][elementId][eligibilityKey].push({
						id: inputPattern,
						value: value,
						code: code,
						regex: validationRegex,
						isMandatory: isMandatory,
						maxValue: maxValue
					});
				}
			} else {
				this._selectedServiceParameters[travellerId][elementId][eligibilityKey] = [];
				this._selectedServiceParameters[travellerId][elementId][eligibilityKey].push({
					id: inputPattern,
					value: value,
					code: code,
					regex: validationRegex,
					isMandatory: isMandatory,
					maxValue: maxValue
				});
			}
		},

		/**
		 * Event handler called when any of the input parameters are changed.
		 * Gets the value, validates it, and adds it to this._selectedServiceParameters map.
		 */
		onInputParamChange: function(evt, args) {
			var travellerId = this.data.selectedPax.paxNumber;
			var paramsArray = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey];
			var mandatory = document.getElementById(args.paramId).getAttribute("data-mandatory");
			for (var param in paramsArray) {
				if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].id == args.paramId) {
					if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].regex != null) {
						var validationRegex = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].regex;
						var value = evt.target.getValue().toUpperCase();
						if (value.match(validationRegex)) {
							this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = value;
						} else {
							document.getElementById(args.paramId).value = "";
							this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = "";
						}
					} else {
						this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = evt.target.getValue();
					}
				}
			}
			this.$json.setValue(this.data, 'refreshFooterFlag', !this.data.refreshFooterFlag);
		},
		incrValue:function(evt, args){
			var travellerId = this.data.selectedPax.paxNumber;
			var paramsArray = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey];
			var targetField=document.getElementById(args.id);
			if(targetField){
				var currentValue=parseInt(targetField.value, 10);
				var newValue=currentValue + args.value;
				for (var param in paramsArray) {
					if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].id == args.paramId) {
						var maxValue = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].maxValue;
						 if (newValue >= 0 && (!maxValue || newValue <= maxValue)){
						 	this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = newValue;
						 	targetField.value=newValue;
						 }
					}
				}
			}
			this.$json.setValue(this.data, 'refreshFooterFlag', !this.data.refreshFooterFlag);
		},

		/**
		 * Method to handle the services already present in the PNR or present in the basket.
		 */
		_handleCurrentSelection: function(currentSelection) {
			var categoryCode = this.data.category.code;
			var selectedServicesForCategory = currentSelection.getServices(categoryCode);
			if (selectedServicesForCategory.length > 0) {
				this.data.basketServices = true;
			}
			for (var s = 0; s < selectedServicesForCategory.length; s++) {
				var service = selectedServicesForCategory[s];
				var serviceCode = service.code;
				var eligibilityKey = service.eligibilityKey;
				var categoryServices = this.getServicesForCategory(categoryCode);
				var catalogEligibility = this.moduleCtrl.getCatalogEligibility(categoryServices, eligibilityKey);
				if (catalogEligibility) {
					var label=service.name;
					if(service.associationMode=="GND"){
						label=this._generateDropdownLabel(categoryServices[0], eligibilityKey);
					}
					var itineraryId = this.getBoundId(service) ? this.getBoundId(service) : 0;
					var segmentId = this.getSegmentIds(service).length > 0 ? this.getSegmentIds(service)[0] : 0;
					var travellerId = 0;
					if (service.passengerAssociated) {
						travellerId = service.passengerIds[0];
					}
					var serviceIndex=this.getServiceIndex(service);
					var elementId = this.createElementIdentifier(service.associationMode, itineraryId, segmentId, serviceIndex);
					var serviceState = this.moduleCtrl.getAttribute(service, "STATE");
					var option = {
						label: label,
						serviceCode: serviceCode,
						eligibilityKey: eligibilityKey,
						eligibility: catalogEligibility,
						itineraryId: itineraryId,
						segmentId: segmentId,
						travellerId: travellerId,
						state: serviceState,
						categoryCode:categoryCode
					}
					if(serviceState == "INITIAL" && service.price && service.price.totalAmount){
						option.bookedAmount=service.price.totalAmount;
					}
					if (serviceState == "INITIAL") {
						this._pnrSelection.push(service.eligibilityKey);
					}

					if (!this._selectedServices[travellerId]) {
						this._selectedServices[travellerId] = {};
					}
					if (!this._selectedServices[travellerId][elementId]) {
						this._selectedServices[travellerId][elementId] = {};
					}
					if (!this._selectedServiceParameters[travellerId]) {
						this._selectedServiceParameters[travellerId] = {};
					}
					if (!this._selectedServiceParameters[travellerId][elementId]) {
						this._selectedServiceParameters[travellerId][elementId] = {};
					}
					this._selectedServiceParameters[travellerId][elementId][eligibilityKey] = [];

					var serviceIndex = this.getServiceIndex(service);
					this._selectedServices[travellerId][elementId] = option;

					//Add the input tag and coresponding values in this._selectedServiceParameters
					var listProperties = service.listProperties;
					for (var i = 0; i < listProperties.length; i++) {
						var inputParams = listProperties[i].inputParams;
						for (var j = 0; j < inputParams.length; j++) {
							var inputParam = this._getInputParamByCode(catalogEligibility, listProperties[i].code, inputParams[j].code);
							if (inputParam) {
								var inputPattern = this.moduleCtrl.getInputParamPattern(eligibilityKey, inputParam.inputTag, service.passengerAssociated, service.associationMode, itineraryId, segmentId, travellerId, serviceIndex);
								var value = inputParams[j].value ? inputParams[j].value : null;
								var regex = inputParam.validationRegex ? inputParam.validationRegex : null;
								var isMandatory = inputParam.requiredLevel=="MANDATORY" ? true : false;
								this._selectedServiceParameters[travellerId][elementId][eligibilityKey].push({
									id: inputPattern,
									value: value,
									code: listProperties[i].code,
									regex: regex,
									isMandatory: isMandatory
								});
							}
						}
					}
				}
			}
			this._setDisableContinue();
		},

		/**
		 * If the service is bound-associated, returns the id of the bound to which the given service is associated.
		 * If the service is segment-associated, returns the id of the bound of which the segment is part.
		 */
		getBoundId: function(service) {
			var bound;
			if (service.selectionAssociationMode === "ELE") {
				bound = service.elementIds[0];
			} else if (service.selectionAssociationMode === "SEG") {
				bound = this._getBoundOfSegment(service.elementIds[0]);
			}
			return bound;
		},

		/**
		 * If the service is segment-associated, returns an array with the id of the segment to which the service is associated
		 * If the service is bound-associated, returns an array with the segmentIds of the bound to which the service is associated
		 */
		getSegmentIds: function(service) {
			var segmentIds=[];
			if (service.selectionAssociationMode === "ELE") {
				segmentIds = this._getSegmentsOfBound(service.elementIds[0]);
			} else if (service.selectionAssociationMode === "SEG") {
				segmentIds = [service.elementIds[0]];
			}
			return segmentIds;
		},

		/**
		 * Returns an array with the segment IDs of the given bound,
		 * or an empty array if the bound does not exist
		 */
		_getSegmentsOfBound: function(boundId) {
			var segmentIds = [];
			for (var i = 0; i < this.tripplan.air.itineraries.length; i++) {
				if (boundId === Number(this.tripplan.air.itineraries[i].itemId)) {
					var segments = this.tripplan.air.itineraries[i].segments;
					for (var s = 0; s < segments.length; s++) {
						segmentIds.push(segments[s].id);
					}
					break;
				}
			}
			return segmentIds;
		},

		/**
		 * Returns the id (as a Number) of the bound that the given segment is part of.
		 */
		_getBoundOfSegment: function(segId) {
			var boundId;
			for (var i = 0; i < this.tripplan.air.itineraries.length; i++) {
				var segments = this.tripplan.air.itineraries[i].segments;
				for (var s = 0; s < segments.length; s++) {
					if (segId === segments[s].id) {
						boundId = Number(this.tripplan.air.itineraries[i].itemId);
						break;
					}
				}
			}
			return boundId;
		},

		/**
		 * Method to get the value of selected input parameters
		 */
		getInputParamValue: function(elementId, eligibilityKey, paramId) {
			var travellerId = this.data.selectedPax.paxNumber;
			var paramsArray = [];
			var inputParamValue = "";
			if (this._selectedServiceParameters[travellerId] && this._selectedServiceParameters[travellerId][elementId] && this._selectedServiceParameters[travellerId][elementId][eligibilityKey]) {
				paramsArray = this._selectedServiceParameters[travellerId][elementId][eligibilityKey];
			}
			for (var param in paramsArray) {
				if (this._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].id == paramId) {
					inputParamValue = this._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].value;
				}
			}
			return inputParamValue;
		},

		/**
		 * Enables/disables the continue button based on the services present in this._selectedServices
		 */
		_setDisableContinue: function() {
			var selectedServices = this._selectedServices;
			if (!this.utils.isEmptyObject(selectedServices)) {
				loop: for (var pax in selectedServices) {
					if (!this.utils.isEmptyObject(selectedServices[pax])) {
						for (var element in selectedServices[pax]) {
							if (!this.utils.isEmptyObject(selectedServices[pax][element])) {
								this.data.disableContinue = false;
								this.$json.setValue(this.data, 'disableContinueFlag', !this.data.disableContinueFlag);
								break loop;
							}
						}
					} else {
						this.data.disableContinue = !this.data.basketServices;
						this.$json.setValue(this.data, 'disableContinueFlag', !this.data.disableContinueFlag);
					}
				}
			}
			if (this.data.disableContinueFlag) {
				this.data.errors = new Array();
				this.data.error_msg = true;
				aria.utils.Json.setValue(this.data, 'error_msg', false);
			}
		},

		/**
		 * Event handler called on click of confirm button.
		 * Validates that all mandatory fields have been filled.
		 * Iterates over this._selectedServiceParameters and adds them to the basket.
		 * @return {[type]} [description]
		 */
		confirm: function() {
			this._handleBoundAssociatedParameters();			
			var addToBasket = true;
			var inputTags = {};
			var selectedServiceParameters = this._selectedServiceParameters;
			for (var pax in this._selectedServiceParameters) {
				for (var element in this._selectedServiceParameters[pax]) {
					for (var eligibility in this._selectedServiceParameters[pax][element]) {
						for (var param in this._selectedServiceParameters[pax][element][eligibility]) {
							if (this._selectedServices[pax][element] && this._selectedServices[pax][element].eligibilityKey == eligibility) {
								if (this._selectedServiceParameters[pax][element][eligibility][param].isMandatory && (this._selectedServiceParameters[pax][element][eligibility][param].value == null || this._selectedServiceParameters[pax][element][eligibility][param].value == "")) {
									addToBasket = false;
									this.__addErrorMessage("missingMadatoryField", this.labels.tx_merci_missing_mandatory_fields);
									aria.utils.Json.setValue(this.data, 'error_msg', true);								
								}
							}
							if(this._selectedServiceParameters[pax][element][eligibility][param].code=="NUMBER" && (this._selectedServiceParameters[pax][element][eligibility][param].value===0 || this._selectedServiceParameters[pax][element][eligibility][param].value==="0")) {
								delete this._selectedServiceParameters[pax][element][eligibility];
							}
							else{
							inputTags[this._selectedServiceParameters[pax][element][eligibility][param].id] = this._selectedServiceParameters[pax][element][eligibility][param].value;
						}
					}
				}
			}
			}
			if (addToBasket) {
				this.moduleCtrl.updateBasket(this.data.category.code, inputTags, {
					fn: this.moduleCtrl.errorCallback,
					scope: this
				});
			}
		},

		/**
		 * Get an input parameter from the catalog from an eligibility, a property code and input parameter code
		 */
		_getInputParamByCode: function(eligibility, propertyCode, paramCode) {
			var listProperties = eligibility.listProperties;
			var nbProperties = listProperties.length;
			for (var i = 0; i < nbProperties; i++) {
				if (listProperties[i].code == propertyCode) {
					var inputParams = listProperties[i].inputParams;
					var nbParams = inputParams.length;
					for (var j = 0; j < nbParams; j++) {
						if (inputParams[j].code == paramCode) {
							return inputParams[j];
						}
					}
				}
			}
			this.$logDebug("Input param " + paramCode + " not found in eligibility " + eligibility.eligibilityKey);
		},

		/*Return the service index by parsing the "selectionIndex" with format "P1_S1_I1"
		If not found, return the default value*/
		getServiceIndex: function(service) {
			var strIndex = service.selectionIndex.lastIndexOf("_I");
			if (strIndex != -1) {
				var serviceIndex = service.selectionIndex.substr(strIndex + 2);
				if (!isNaN(serviceIndex))
					return serviceIndex;
			}
			/*return this.DEFAULT_SERVICE_INDEX;*/
			return "1";
		},

		/**
		 * Returns the total number of services selected of a particular segment/itinerary/trip
		 */
		getServiceCount: function(elementId, associationMode) {
			var serviceCount = 0;
			var weightCount=1;
			var travellerId = this.data.selectedPax.paxNumber;
			if (associationMode == "GND") {
				serviceCount=this.getSVCServiceCount(elementId, travellerId);
			} else {
			if (this._selectedServiceParameters[travellerId] && this._selectedServiceParameters[travellerId][elementId]) {
				for (var eligibility in this._selectedServiceParameters[travellerId][elementId]) {
					for (var param in this._selectedServiceParameters[travellerId][elementId][eligibility]) {
							if (this._selectedServiceParameters[travellerId][elementId][eligibility][param].value != null) {
								if (this._selectedServiceParameters[travellerId][elementId][eligibility][param].code == "NUMBER") {
							serviceCount = Number(this._selectedServiceParameters[travellerId][elementId][eligibility][param].value);
								} else if(param==0 && this._selectedServiceParameters[travellerId][elementId][eligibility][param].code == "WEIGHT"){
									weightCount=Number(this._selectedServiceParameters[travellerId][elementId][eligibility][param].value);
						}
					}
				}
			}
				}
			}
			serviceCount=serviceCount*weightCount;
			return Number(isNaN(serviceCount)) || Number(serviceCount) < 0 ? Number(0) : serviceCount;
		},
		getSVCServiceCount: function(elementId, travellerId){
			var serviceCount = 0;
			if (this._selectedServiceParameters[travellerId]) {
				for (var elementId in this._selectedServiceParameters[travellerId]) {
					for (var eligibility in this._selectedServiceParameters[travellerId][elementId]) {
						for (var param in this._selectedServiceParameters[travellerId][elementId][eligibility]) {
							if (this._selectedServiceParameters[travellerId][elementId][eligibility][param].value != null && this._selectedServiceParameters[travellerId][elementId][eligibility][param].code == "NUMBER") {
								serviceCount += Number(this._selectedServiceParameters[travellerId][elementId][eligibility][param].value);
							}
						}
					}
				}
			}
			return serviceCount;
		},

		/**
		 * Returns the total price of services selected of a particular segment/itinerary/trip
		 */
		getServicePrice: function(elementId, servicesEligibleForPax, selectedOption) {
			var servicePrice = 0;
			var service = {};
			if (selectedOption != null) {
				if (selectedOption.state && selectedOption.state == "INITIAL") {
					if (selectedOption.bookedAmount) {
						servicePrice = selectedOption.bookedAmount;
					}
				} else {
				for (var serv in servicesEligibleForPax) {
					if (servicesEligibleForPax[serv].code == selectedOption.serviceCode) {
						service = servicesEligibleForPax[serv];
					}
				}
				var nbEligGroups = service.eligibilityGroups.length;
				// find the eligibility group that contains the eligibility key of the service to display
				eligGroupsLoop: for (var i = 0; i < nbEligGroups; i++) {
					var eligibilities = service.eligibilityGroups[i].eligibilities;
					var nbEligibilities = eligibilities.length;
					for (var j = 0; j < nbEligibilities; j++) {
						if (eligibilities[j].eligibilityKey == selectedOption.eligibilityKey) {
							if (service.eligibilityGroups[i].priceInfo) {
								var priceInfo = service.eligibilityGroups[i].priceInfo;
								servicePrice = priceInfo.totalAmount;
							}
							break eligGroupsLoop;
						}
					}
				}
				}
			}
			return Number(servicePrice).toFixed(2);
		},

		/**
		 * Method to enable/disable the delete button.
		 */
		isDeleteButtonEnabled: function(elementId) {
			var travellerId = this.data.selectedPax.paxNumber;

			if (this._selectedServiceParameters[travellerId] && this._selectedServiceParameters[travellerId][elementId]) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Event handler called on clcik of delete button.
		 */
		onDeleteButtonClick: function(evt, args) {
			var travellerId = this.data.selectedPax.paxNumber;
			if (this._selectedServiceParameters[travellerId] && this._selectedServiceParameters[travellerId][args.elementId]) {
				var travellerId = this.data.selectedPax.paxNumber;
				for (var eligKey in this._selectedServiceParameters[travellerId][args.elementId]) {
					if(this._servicesTotalInstances[eligKey] && this._servicesTotalInstances[eligKey]>1)
						aria.utils.Json.setValue(this._servicesTotalInstances, eligKey, this._servicesTotalInstances[eligKey]-1);
					if (this._selectedServiceParameters[travellerId][args.elementId][eligKey]) {
						for (var o in this._selectedServiceParameters[travellerId][args.elementId][eligKey]) {
							this._selectedServiceParameters[travellerId][args.elementId][eligKey][o].value = null;
						}
					}
				}
				delete this._selectedServices[travellerId][args.elementId];
				this._setDisableContinue();
				this.$json.setValue(this.data, 'selectedServiceFromDropdown', !this.data.selectedServiceFromDropdown);
			}
		},

		/**
		 * Determine if a service has to be non-editable (already in PNR) or editable
		 */
		isServiceDisabled: function(eligibilityKey) {
			if (this._pnrSelection.length == 0) {
				return false;
			}
			// disabled service if it was present in the PNR
			if (aria.utils.Array.contains(this._pnrSelection, eligibilityKey)) {
				return true;
			}
			// editable if not present in PNR
			else {
				return false;
			}
		},

		/**
		 * Method to validate the input parameters entered by the user.
		 */
		validateInputValue: function(evt, args) {
			var travellerId = this.data.selectedPax.paxNumber;
			var paramsArray = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey];
			for (var param in paramsArray) {
				if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].id == args.paramId) {
					if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].regex != null) {
						var validationRegex = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].regex;
						var value = evt.target.getValue();
						if (!value.match(validationRegex)) {
							evt.target.setValue(value.replace(value.slice(-1), ""));
						} else {
							evt.target.setValue(value.match(validationRegex));
						}
					}
				}
			}
		},

		/**
		 * Method to send the extra tags for all segments in case bound-level services are selected.
		 */
		_handleBoundAssociatedParameters: function() {
			for (var pax in this._selectedServiceParameters) {
				for (var element in this._selectedServiceParameters[pax]) {
					if (element.indexOf("BOUND") != -1) {
						var itineraryId = element.charAt(element.length - 1); //Get the last character, which will be the itinerary id.
						var segmentIds = this._getSegmentIdsForBound(itineraryId);
						if (segmentIds.length > 1) { //Execute loop only if there are more than 1 segments.
							for (var eligKey in this._selectedServiceParameters[pax][element]) {
								var paramArray = this._selectedServiceParameters[pax][element][eligKey];
								for (var p in paramArray) {
									var paramObject = paramArray[p];
									var inputTag = paramObject.id;
									for (var s = 1; s < segmentIds.length; s++) {
										var newParamObject = aria.utils.Json.copy(paramObject);
										var newInputTag = this.utils.setCharAt(inputTag, inputTag.length - 3, segmentIds[s].toString());
										newParamObject.id = newInputTag;
										this._selectedServiceParameters[pax][element][eligKey].push(newParamObject);
									}
								}
							}
						}
					}
				}
			}
		},

		/**
		 * Return an array with the segment ids of the bound with id equal to the itineraryId argument
		 */
		_getSegmentIdsForBound: function(itineraryId) {
			var itineraries = this.tripplan.air.itineraries;
			var nbItineraries = itineraries.length;
			var segmentIds = [];
			for (var i = 0; i < nbItineraries; i++) {
				if (itineraries[i].itemId == itineraryId) {
					var segments = itineraries[i].segments;
					var nbSegments = segments.length;
					for (var j = 0; j < nbSegments; j++) {
						segmentIds.push(segments[j].id);
					}
				}
			}
			return segmentIds;
		},
		__addErrorMessage: function(key, message) {
			// if errors is empty
			if (this.data.errors == null) {
				this.data.errors = new Array();
		}
			// create JSON and append to errors
			var error = {
				'TEXT': message,
				'KEY': key
			};
			if (this.data.errors.length > 0) {
				var addMessage = true;
				for (var err in this.data.errors) {
					if (this.data.errors[err].KEY == key) {
						addMessage = false;
					}
				}
				if (addMessage) {
					this.data.errors.push(error);
				}
			} else {
				this.data.errors.push(error);
			}
		},

		createDatePicker: function(element) {
			var eligibilityKey = element.getAttribute("data-eligKey");
			var elementId = element.getAttribute("data-elementId");
			var paramId = element.getAttribute("id");
			var datePattern = element.getAttribute("data-inputFormat");
			if (datePattern == "")
				datePattern = "ddMMyy";
			var pageRef = this;
			$(element).datepicker({

				showOn: "focus",
				//buttonImage: buttonImagePath,
				// buttonImageOnly: buttonImgOnly,
				dateFormat: datePattern,
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: 0,
				maxDate: "+364D",
				defaultDate: +0,
				firstDay: 1,
				showButtonPanel: true,
				onSelect: function() {
					var travellerId = pageRef.data.selectedPax.paxNumber;
					var paramsArray = pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey];
					for (var param in paramsArray) {
						if (pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].id == paramId) {

							if (pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].regex != null) {
								var validationRegex = pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].regex;
								var value = $.datepicker.formatDate('ddmmy', $(element).datepicker('getDate'));
								pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].value = value;
								if (value.match(validationRegex)) {
									pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].value = value;
								} else {
									document.getElementById(paramId).value = "";
									pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].value = "";
								}
							} else {
								pageRef._selectedServiceParameters[travellerId][elementId][eligibilityKey][param].value = $.datepicker.formatDate('ddmmy', $(element).datepicker('getDate'));
							}
						}
					}
					pageRef.$json.setValue(pageRef.data, 'refreshFooterFlag', !pageRef.data.refreshFooterFlag);


				},
				onClose: function() {

				}
			});
			var dateValue=element.getAttribute("data-value");
			if(dateValue!=""){
				var day=dateValue.substring(0,2);
				var month=parseInt(dateValue.substring(2,4), 10)-1;
				var year=dateValue.substring(4);
				var defaultDate=new Date(year, month, day);
				defaultDate.setFullYear(defaultDate.getFullYear() +100);
				$(element).datepicker("setDate", defaultDate);	
			}
		},
		/**
		 * Init the _servicesExtraInstances if several instances of SVCs are already selected
		 */
		_initServicesTotalInstances: function() {
			// do nothing if no selected services
			if (!this.data.currentSelection || !this.data.currentSelection.selectedServices) {
				return;
			}
			var serviceSelection = this.data.currentSelection;
			var selectedServices = serviceSelection.selectedServices;
			var nbSelectedServices = selectedServices.length;
			for (var i = 0; i < nbSelectedServices; i++) {
				var service = selectedServices[i];
				var eligKey = service.eligibilityKey;
				if(!this._servicesTotalInstances[eligKey]){
					var serviceIndex = this._getNumberOfSelectedServices(eligKey);
					if (serviceIndex != 1) {
						aria.utils.Json.setValue(this._servicesTotalInstances, eligKey, serviceIndex );
					}
				}
			}
		},
		_getNumberOfSelectedServices: function(eligibilityKey){
			var count=0;
			var serviceSelection=this.data.currentSelection;
			for(var i=0; i<serviceSelection.selectedServices.length; i++){
				if(serviceSelection.selectedServices[i].eligibilityKey==eligibilityKey)
					count++;
			} 
			return count;
		},
		clickedAddService: function(evt, args){
			var eligibility = args.eligibility;
			var service = args.service;
			if (!service || !eligibility) return;
			this.addServiceInstance(service, eligibility);
		},
		addServiceInstance:function(service, eligibility){
			if (!this._servicesTotalInstances[eligibility.eligibilityKey]) {
				aria.utils.Json.setValue(this._servicesTotalInstances, eligibility.eligibilityKey, 2);
			} else {
				//make sure that max cardinality is not exceeded
				var maxCardinality = service.maxCardinality || 2;
				if (this._servicesTotalInstances[eligibility.eligibilityKey] < maxCardinality) {
					aria.utils.Json.setValue(this._servicesTotalInstances, eligibility.eligibilityKey, this._servicesTotalInstances[eligibility.eligibilityKey] + 1);
				}
			}
			this.$json.setValue(this.data, 'selectedServiceFromDropdown', !this.data.selectedServiceFromDropdown);
		},
		toggleCheckBox:function(evt, args){
			var onOffSwitch = document.getElementById('servicesOnOffSwitch_'+args.elementId);
			var travellerId = this.data.selectedPax.paxNumber;
			var paramsArray = this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey];
			if (onOffSwitch != null) {
				if (onOffSwitch.checked == false) {
					onOffSwitch.checked=true;
					for (var param in paramsArray) {
						if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].id == args.paramId) {
								this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = 1;
						}
					}
					this.$json.setValue(this.data, 'refreshFooterFlag', !this.data.refreshFooterFlag);
				}
				else {
					onOffSwitch.checked=false;
					for (var param in paramsArray) {
						if (this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].id == args.paramId) {
								this._selectedServiceParameters[travellerId][args.elementId][args.eligibilityKey][param].value = "";
						}
					}
					this.$json.setValue(this.data, 'refreshFooterFlag', !this.data.refreshFooterFlag);
				}
			}
		}
	}
});