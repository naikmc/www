Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.services.MNewServicesCatalogScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.ServiceSelection',
		'modules.view.merci.common.utils.ServiceCatalog',
		'modules.view.merci.common.utils.MDWMContentUtil'
	],

	$statics: {
		PAGE_BOOKMARK_NAME: 'MNewServicesCatalogScript',
		BOOKMARKED_SERVICES: 'BOOKMARKED_SERVICES',
		SERVICES_CATALOG: 'SERVICESCATALOG'
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.urlManager = modules.view.merci.common.utils.URLManager;
		this.dwmUtils = modules.view.merci.common.utils.MDWMContentUtil;
		this.servicesDetails = {};
		this.servicesDetails.loaded = false;
		this.servicesDetails.categoryCode = "MEA";
		pageObj = this;
		this.bookmarkedServices = [];
	},

	$prototype: {
		$dataReady: function() {
			/**
			 * Initialize the value of the Pax to 0 when the TPL loads for the first time
			 **/
			this.selection = {};
			this.selection.paxId = 0;
			var model = this.moduleCtrl.getModuleData().servicing.MNewServicesCatalog || {};
			this.config = model.siteParam;
			this.labels = model.labels;
			this.request = model.requestParam.request;
			this.reply = model.requestParam.reply;
			this.dwmContent = model.requestParam.dwmContent || {};

			if (this.utils.booleanValue(this.request.fromPax)) {
				this.moduleCtrl.setFromPax(true);
			}
			this.moduleCtrl.setIsServicing(this.isServicingFlow());
			this.moduleCtrl.setPageTicket(this.reply.pageTicket);

			this.tripplan = this.reply.tripplan;
			this.moduleCtrl.setTripPlan(this.tripplan);

			/* Added during the CR 8231231 to prevent the tripplan from clearing the input tags while initializing the basket while coming from bookmarks page */
			if (this.request.fromPage == 'BOOKMARKS') {
				this.moduleCtrl.setInputParamsPerCategoryInBasket(JSON.parse(this.request.inputParamsString || {}));
				this.moduleCtrl.setInputTagsInBasket(JSON.parse(this.request.basketInputTags || {}));
			}

			if (!this.utils.isEmptyObject(this.reply.catalog)) {
				this.moduleCtrl.setCatalog(this.reply.catalog);
			}
			this.catalog = this.moduleCtrl.getCatalog(); //instance of ServiceCatalog class

			this.data.messages = this.moduleCtrl.getLatestMessages() || this.utils.readBEErrors(this.reply.errors);
			if (this.__allowBookmark() && this.isServicesBookmarkedForRecLoc(this.request.REC_LOC)) {
				var infoMessages = new Array();
				/* to be replaced with tx_merci_services_bookmark_update_info once string is available */
				infoMessages.push({TEXT:"The Bookmark for this PNR will be updated every time any Service is added or modified."});
				if (!this.utils.isEmptyObject(this.data.messages.infos) && !this.utils.isEmptyObject(this.data.messages.infos.list)) {
					this.data.messages.infos.list.push(infoMessages);
				}else{
					this.data.messages.infos = {};
					this.data.messages.infos.list = infoMessages;
				}
			}
			this.__createServicesCatalog();
			this.services = this.moduleCtrl.getCurrentSelection();
			this.selectedServices = this.moduleCtrl.getCurrentSelection().selectedServices || [];
			this.currencyBean = {};
			this.currencyBean.code = this.catalog.getCurrency();
			this.servicesData = this.__constructServicesData(this.selectedServices);
			this._allowAddServices = !this.moduleCtrl.getAncillaryPermission('ADD_DISABLED') || this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');


			
		},

		$displayReady: function() {
			if (this.__allowBookmark()) {
				var arr = [];
				arr.push("bkmkButton");
				var headerButton = {};
				headerButton.button = arr;
				headerButton.scope = pageObj;
				var bookmarkPage = this.PAGE_BOOKMARK_NAME;
				headerButton.bookmarkPage = bookmarkPage;
				if(this.isServicesBookmarkedForRecLoc(this.request.REC_LOC))
				{
					headerButton.myVar = '1';
					headerButton.forceBookmarkUpdate = true;
				}
				else
				{
					headerButton.myVar = '0';
				}

			}
			var items = this.getTotalItems();
			this.moduleCtrl.setHeaderInfo({
				title: this.labels.tx_merci_text_mybook_myflight,
				bannerHtmlL: this.request.bannerHtml,
				homePageURL: this.config.homeURL,
				showButton: true,
				headerButton: headerButton,
				selectedServices: {'count':items,'scope':pageObj}
			});
			var that = this;
		},

		$viewReady: function() {
			this.dwmUtils.processContainer({element:document.getElementById(this.$getId('cem_wrapper')), cb:this.selectServiceCEM});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MNewServicesCatalog",
						data:this.data
					});
			}
		},

		/**
		 * Tells whether the current flow is a servicing flow (from an existing PNR).
		 * Checks whether the DIRECT_RETRIEVE_LASTNAME input parameter is defined
		 */
		isServicingFlow: function() {
			return !this.utils.isEmptyObject(this.request.DIRECT_RETRIEVE_LASTNAME);
		},

		/**
		 * Determines the class names
		 * depending on the services
		 **/
		__getClassName: function(categoryCode) {
			var className = "";
			switch (categoryCode) {
				case 'SIT':
					className = "seat";
					break;
				case 'MEA':
					className = "meals";
					break;
				case 'BAG':
					className = "baggage";
					break;
				case 'PET':
					className = "pets";
					break;
				case 'SPO':
					className = "equipment";
					break;
				case 'SPE':
					className = "assistance";
					break;
				case 'OTH':
					className = "services";
					break;
				default:
					className = "services";
					break;
			}
			return className;
		},

		/**
		 * Creates a servicesCatalog bean which is an array of paxes and the services assigned to them
		 * Its important to note that in servicesCatalog, pax ids start from 0, whereas in selectedServices, the passengerIds start from 1 ***
		 **/
		__createServicesCatalog: function() {
			var availableServiceCategories = this.reply.serviceCategories;
			var paxes = this.tripplan.paxInfo.travellers;
			this.selectedServices = this.moduleCtrl.getCurrentSelection().selectedServices || [];
			var services = [];
			for (var j = 0; j < availableServiceCategories.length; j++) {
				var service = {};
				var catCode = availableServiceCategories[j].code;
				service.serviceCode = catCode;
				var selections = [];
				selections = this.__getPaxSelections(catCode);
				service.selections = selections;
				services.push(service);
			}
			this.paxServicesCatalog = services;
		},

		__getPaxSelections: function( categoryCode) {
			var selections = [];
			for (var i = 0; i < this.selectedServices.length; i++) {
				if (categoryCode === this.selectedServices[i].category || (categoryCode === this.selectedServices[i].code)) {
					if (!this.utils.isEmptyObject(this.selectedServices)) {
						var selection = {};
						if (categoryCode && categoryCode != "") {
							switch (categoryCode) {
								case 'SIT':
									selection = this.__getServiceForCatalog(this.selectedServices[i], "SEAT_ASSIGNMENT", this.selectedServices[i].name);
									break;
								default:
									selection = this.__getServiceForCatalog(this.selectedServices[i], "NUMBER", this.selectedServices[i].name);
									break;
							}
						}
						selections.push(selection);
					}
				}
			}
			return selections;
		},

		__getServiceForCatalog: function(service, selectionMode, serviceName) {

			var serviceProperties = service.listProperties;
			var serviceData = {};
			serviceData.selectionName = serviceName;
			serviceData.price = null;
			serviceData.state = null;
			if (!this.utils.isEmptyObject(service.price)) {
				serviceData.price = service.price;
			}
			for (var i = 0; i < serviceProperties.length; i++) {
				if ((serviceProperties[i].code !== null) && (serviceProperties[i].code === selectionMode)) {
					var inputParameters = serviceProperties[i].inputParams;
					for (var j = 0; j < inputParameters.length; j++) {
						if ((inputParameters[j].code === "VALUE") && (inputParameters[j].value !== null)) {
							serviceData.selectionValue = inputParameters[j].value;
						}
					}
				}
			}
			for (var j = 0; j < service.attributes.length; j++) {
				if (service.attributes[j].type === "STATE") {
					serviceData.state = service.attributes[j].value;
				}
			}
			return serviceData;
		},

		__getRequestedServiceInfoAmt: function(categoryCode, dataMode) {
			var pieces = 0;
			var dataInfoService = "";
			var selectedCatalog = this.paxServicesCatalog;
			for (var i = 0; i < selectedCatalog.length; i++) {
				if (categoryCode === selectedCatalog[i].serviceCode || (categoryCode === selectedCatalog[i].code)) {
					service = selectedCatalog[i];
					switch (categoryCode) {
						case 'SIT':
							pieces = service.selections.length;
							var seatNumbers = []
							for (var j = 0; j < service.selections.length; j++) {
								seatNumbers[j] = service.selections[j].selectionValue;
							}
							dataInfoService = seatNumbers.join(", ");
							if (this.utils.isEmptyObject(dataInfoService)) {
								var serviceName = this.__getClassName(categoryCode);
								dataInfoService = this.utils.formatString(this.labels.tx_merci_services_notselected, serviceName);
							}
							break;
						default:
							var individualServices = [];
							var individualUnits = [];
							for (var k = 0; k < service.selections.length; k++) {
								if (individualServices.indexOf(service.selections[k].selectionName) < 0) {
									individualServices.push(service.selections[k].selectionName);
									individualUnits.push(parseInt(service.selections[k].selectionValue));
								} else {
									var index = individualServices.indexOf(service.selections[k].selectionName);
									individualUnits[index] = individualUnits[index] + parseInt(service.selections[k].selectionValue);
								}
								pieces = pieces + parseInt(service.selections[k].selectionValue);
							}
							for (var a = 0; a < individualServices.length; a++) {
								if (individualUnits[a] > 0) {
									if (dataInfoService !== "") {
										dataInfoService += ", "
									}
									dataInfoService = dataInfoService + individualUnits[a] + " " + individualServices[a];
								}
							}
							if (this.utils.isEmptyObject(dataInfoService)) {
								var serviceName = this.__getClassName(categoryCode);
								dataInfoService = this.utils.formatString(this.labels.tx_merci_services_notselected, serviceName);
							}
							break;
					}
				}
			}
			switch (dataMode) {
				case 'SERVICE_INFO':
					return dataInfoService;
				case 'PIECES':
					return pieces;
				default:
					return null;
			}
		},

		/**
		 * Tells whether there is at least one service of the given category in the catalogue of services.
		 */
		isPresentInCatalog: function(categoryCode) {
			var isPresent = false;
			var categories = this.reply.catalog.categories;
			if (this._allowAddServices && categories) {
				for (var i = 0; i < categories.length; i++) {
					if (categoryCode === categories[i].code) {
						isPresent = true;
					}
				}
			}
			return isPresent;
		},

		getPaymentData: function(categoryCode) {
			var paymentDetails = {};
			paymentDetails.paid = null;
			paymentDetails.toPay = null;
			paymentDetails.minPrice = null;
			var paxServices = this.paxServicesCatalog || [];
			for (var i = 0; i < paxServices.length; i++) {
				if (paxServices[i].serviceCode === categoryCode) {
					var selections = paxServices[i].selections;
					if (this.utils.isEmptyObject(selections)) {
						if (this.catalog.categories) {
							for (var j = 0; j < this.catalog.categories.length; j++) {
								if (categoryCode === this.catalog.categories[j].code) {
									if (!this.utils.isEmptyObject(this.catalog.categories[j].minPrice)) {
										if (!this.utils.isEmptyObject(this.catalog.categories[j].minPrice.totalAmount)) {
											paymentDetails.minPrice = this.catalog.categories[j].minPrice.totalAmount;
										}
									}
								}
							}
						}
					} else {
						for (var k = 0; k < selections.length; k++) {
							switch (selections[k].state) {
								case 'INITIAL':
									if (!this.utils.isEmptyObject(selections[k].price) && !this.utils.isEmptyObject(selections[k].price.totalAmount)) {
										paymentDetails.paid += selections[k].price.totalAmount;
									}
									break;
								default:
									if (!this.utils.isEmptyObject(selections[k].price) && !this.utils.isEmptyObject(selections[k].price.totalAmount)) {
										paymentDetails.toPay += selections[k].price.totalAmount;
									}
									break;
							}
						}
					}
				}
			}
			return paymentDetails;
		},

		selectService: function(evt, args) {
			var categoryCode = args[0];
			var selectedPaxNumber = this.tripplan.paxInfo.travellers[this.selection.paxId].paxNumber;
			switch (categoryCode) {
				case 'SIT':
					var seatsEligibleSegments = this.__getSeatEligibleSegments();
					var seatsEligSegmentsJSON = JSON.stringify(seatsEligibleSegments);
					var segment = this.__getElement(seatsEligibleSegments[0], "segment");
					var itinerary = this.__getElement(segment.id, "itinerary");
					var params = {
						category: "SIT",
						passengerId: selectedPaxNumber || this.tripplan.paxInfo.travellers[0].paxNumber,
						seatsEligibleSegments: seatsEligSegmentsJSON,
						BOOKING_CLASS: segment.cabins[0].RBD,
						B_AIRPORT_CODE: segment.beginLocation.locationCode,
						E_AIRPORT_CODE: segment.endLocation.locationCode,
						B_DATE: segment.beginDateBean.yearMonthDay,
						B_TIME: segment.beginDateBean.formatTimeAsHHMM,
						EQUIPMENT_TYPE: segment.equipmentCode,
						E_TIME: segment.endDateBean.formatTimeAsHHMM,
						DECK: "L",
						AIRLINE_CODE: segment.airline.code,
						FLIGHT: segment.flightNumber,
						SEGMENT_ID: segment.id,
						OUTPUT_TYPE: "2",
						itinerary_index: itinerary,
						IS_SEAT_SERVICING: "TRUE",
						HAS_OTHER_SEGMENTS: ((seatsEligibleSegments.length > 1) ? "TRUE" : "FALSE")
					};
					break;
				default:
					var params;
					var tripplan = JSON.stringify(aria.utils.Json.copy(this.tripplan));
					var catalog = JSON.stringify(aria.utils.Json.copy(this.catalog));
						params = {
							category: categoryCode,
							passengerId: selectedPaxNumber || this.tripplan.paxInfo.travellers[0].paxNumber,
							tripplan: tripplan,
							catalog: catalog
						};
					break;
			}
			this.utils.sendNavigateRequest(params, 'MSelectService.action', this);
			
		},

		selectServiceCEM: function(args) {
			var params = args.params || {};
			var serviceCode = params.serviceCode || {};
			var subServiceCode = params.subServiceCode || {};
			var tags = params.tags || {};
			if((!pageObj.utils.isEmptyObject(serviceCode) && !pageObj.utils.isEmptyObject(subServiceCode)) && (pageObj.utils.isEmptyObject(tags)))
			{
				pageObj._catalog = pageObj.moduleCtrl.getCatalog();
				var services = pageObj._catalog.getServices(serviceCode);
				var paxes = pageObj.tripplan.paxInfo.travellers;
				var choices = [];
				for(var s=0; s<services.length; s++)
				{
					var service = services[s];
					if(service.code == subServiceCode)
					{
						for(var p=0; p<paxes.length; p++)
						{
							var pax = paxes[p];
							var paxId = pax.paxNumber;
							var itineraries = pageObj.tripplan.air.itineraries || [];
							for(var i=0;i <itineraries.length; i++)
							{
								var itinerary = itineraries[i];
								var segments = itinerary.segments || [];
								for(var seg=0; seg<segments.length; seg++)
								{
									var segment = segments[seg];
									var segmentId = segment.id;
									var choice = pageObj.__createChoice(service,paxId,segmentId);
									choices.push(choice);
								}
							}
						}
					}
				}
				for(var c=0; c<choices.length; c++)
				{
					tags[choices[c]] = "1";
				}
			}
			
			var perCategory = {};
			perCategory[serviceCode] = {};
			perCategory[serviceCode].inputTags = tags;
			pageObj.moduleCtrl.setInputTagsInBasket(tags);
			pageObj.moduleCtrl.setInputParamsPerCategoryInBasket(perCategory);
			if(serviceCode != 'SIT')
			{
				var request = pageObj.utils.navigateRequest(pageObj.moduleCtrl.getBasket().inputTags, 'MComputeServiceSelection.action', {
	                fn: pageObj.__selectServiceCEMCallback,
	                scope: pageObj,
	                args: {'serviceCode':serviceCode}
	            });
	            pageObj.urlManager.makeServerRequest(request, false);
			}
			else
			{
				pageObj.selectService(null,[serviceCode]);
			}
			pageObj.cemSelectedService = serviceCode;
		},

		__selectServiceCEMCallback: function(args) {
			var reply = args.responseJSON.data.reply;
			pageObj.moduleCtrl.setSelection(reply);
			var serviceCode = pageObj.cemSelectedService || "";
			pageObj.selectService(null,[serviceCode]);
		},

		__createChoice: function(service, paxNumber, segmentId) {
	        var eligGroup = this._catalog.getEligibilityGroupsFromService(service, paxNumber, null, segmentId)[0];

	        var numberProperty = this._catalog.getFirstProperty(eligGroup, 'NUMBER');
	        var tag = this._catalog.getParameterValue(numberProperty, 'VALUE', 'inputTag');
	        tag = tag.replace('[p]', paxNumber).replace('[s]', segmentId).replace('[i]', 1);
	        return tag;
	    },

		__getSeatEligibleSegments: function() {
			var eligibleSegments = [];
			var itineraries = this.tripplan.air.itineraries;
			var codeShareEnabled = this.utils.booleanValue(this.config.siteHideSeatCodeShare) ;
			var codeShareFlight ;

			for (var i = 0; i < itineraries.length; i++) {
				var segments = itineraries[i].segments;
				if (!this.utils.isEmptyObject(segments)) {
					for (var j = 0; j < segments.length; j++) {
						codeShareFlight = false;
						if( codeShareEnabled && !this.utils.isEmptyObject(segments[j].opAirline) && segments[j].opAirline.code!=segments[j].airline.code){
							codeShareFlight=true ;
						}
						if (this.utils.booleanValue(segments[j].seatMapAvailable) && !codeShareFlight) {
							eligibleSegments.push(segments[j].id);
						}
					}
				}
			}
			return eligibleSegments;
		},

		isEligibleForChangeModif: function(serviceCode) {
			var isEligible = false;
			var isTicketed = false;
			var allowMCSeatMapParam = this.utils.booleanValue(this.config.allowMCSeatMap);
			if (allowMCSeatMapParam) {
				isTicketed = true;
			} else {
				if (!this.utils.isEmptyObject(this.reply.tripplan.pnr.TICKETED)) {
					isTicketed = true;
				}
			}
			if (this.isPresentInCatalog(serviceCode)) {
				isEligible = true;
				switch (serviceCode) {
					case 'SIT':
						var seatEligibleSegments = this.__getSeatEligibleSegments();
						if (this.utils.isEmptyObject(seatEligibleSegments) || !isTicketed) {
							isEligible = false;
						}
						break;
					default:
						break;
				}
			}
			return isEligible;
		},

		__getElement: function(segmentId, selectionItem) {
			var itineraries = this.tripplan.air.itineraries;
			var segment = {};
			var itineraryId = 1;
			for (var i = 0; i < itineraries.length; i++) {
				var segments = itineraries[i].segments;
				if (!this.utils.isEmptyObject(segments)) {
					for (var j = 0; j < segments.length; j++) {
						if (segments[j].id === segmentId) {
							segment = segments[j];
							itineraryId = itineraries[i].itemId;
						}
					}
				}
			}
			switch (selectionItem) {
				case 'segment':
					return segment;
				case 'itinerary':
					return itineraryId;
				default:
					return segment;
			}
		},

		showTripDetails: function() {
			var params = {
				DIRECT_RETRIEVE_LASTNAME: this.request.DIRECT_RETRIEVE_LASTNAME,
				REC_LOC: this.request.REC_LOC,
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				ACTION: "MODIFY",
				PAGE_TICKET: this.reply.pageTicket
			};
			this.leavePage('MPNRValidate.action', params);
		},

		showPaxDetails: function() {
			var params = {
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				DIRECT_RETRIEVE_LASTNAME: this.request.DIRECT_RETRIEVE_LASTNAME,
				REC_LOC: this.request.REC_LOC,
				PAGE_TICKET: this.reply.pageTicket
			};
			this.leavePage('MTravellerDetails.action', params);
		},

		/**
		 * Calls the given action with given params to navigate to another page, after prompting the user to confirm
		 * that they are OK to cancel the modifications of the services selection
		 */
		leavePage: function(action, params) {
			var wantToLeave = true;
			var isBookmarked = this.isServicesBookmarkedForRecLoc(params.REC_LOC);
			if (this.getTotalItems() > 0 && !isBookmarked) {
				wantToLeave = confirm(this.labels.tx_merci_services_promptleaveservices);
			}
			if (wantToLeave) {
				this.moduleCtrl.rollbackBasket();
				this.utils.sendNavigateRequest(params, action, this);
			}
		},

		__constructServicesData: function(selectedServices) {
			var servicesData = [];
			var services = selectedServices;
			for (var i = 0; i < services.length; i++) {
				if (this.isPresent(services[i].category, servicesData) || (this.isPresent(services[i].code, servicesData))) {
					var service = this.__getServiceForBasket(services[i].category, servicesData);
					if (service == null ) {
						service = this.__getServiceForBasket(services[i].code, servicesData);
					}
					if (service.serviceCode) {
						switch (service.serviceCode) {
							case 'SIT':
								service.quantity = service.quantity + this.__getQuantity(services[i], "SEAT_ASSIGNMENT");
								break;
							default:
								service.quantity = service.quantity + this.__getQuantity(services[i], "NUMBER");
								break;
						}
					}
					service.toPay = service.toPay + this.__getToPay(services[i]);
				} else {
					var service = {};
					if (services[i].category)
						service.serviceCode = services[i].category;
					else 
						service.serviceCode = services[i].code;
					service.quantity = 0;
					if (service.serviceCode) {
						switch (service.serviceCode) {
							case 'SIT':
								service.quantity = service.quantity + this.__getQuantity(services[i], "SEAT_ASSIGNMENT");
								service.label = this.getLabel('SIT');
								break;
							default:
								service.quantity = service.quantity + this.__getQuantity(services[i], "NUMBER");
								service.label = this.getLabel(service.serviceCode);
								break;

						}
					}
					service.toPay = this.__getToPay(services[i]);
					servicesData.push(service);
				}
			}
			return servicesData;
		},

		isPresent: function(serviceCode, serviceData) {
			var isPresent = null;
			if (!this.utils.isEmptyObject(serviceData)) {
				for (var i = 0; i < serviceData.length; i++) {
					if (serviceCode === serviceData[i].serviceCode) {
						isPresent = serviceData[i];
					}
				}
			}
			return isPresent;
		},

		/**
		 * Event handler to remove from the basket the services of a given category
		 */
		cancelServices: function(evt, categoryCode) {
			this.moduleCtrl.cancelServices(categoryCode, {
				fn: this.__refresh,
				scope: this
			});
		},

		__getServiceForBasket: function(serviceCode, serviceData) {
			var service = null;
			if (!this.utils.isEmptyObject(serviceData)) {
				for (var i = 0; i < serviceData.length; i++) {
					if (serviceCode === serviceData[i].serviceCode) {
						service = serviceData[i];
					}
				}
			}
			return service;
		},

		__getQuantity: function(service, quantityType) {
			var quantity = 0;
			var state = this.__getState(service);
			if (state === "ADDED" || state === "MODIFIED") {
				var category = "";
				if (service.category) {
					category = service.category;
				} else {
					category = service.code;
				}
				if (category && category != "") {
					switch (service.category) {
						case 'SIT':
							quantity = 1;
							break;
						default:
							var listProperties = service.listProperties;
							if (!this.utils.isEmptyObject(listProperties)) {
								for (var i = 0; i < listProperties.length; i++) {
									if (listProperties[i].code === quantityType) {
										var inputParams = listProperties[i].inputParams;
										if (!this.utils.isEmptyObject(inputParams)) {
											for (j = 0; j < inputParams.length; j++) {
												if (inputParams[j].code === "VALUE") {
													quantity = parseInt(inputParams[j].value);
												}
											}
										}
									}
								}
							}
							break;
					}
				}
			}
			return quantity;
		},

		__getToPay: function(service) {
			var toPay = 0;
			var state = this.__getState(service);
			if (!this.utils.isEmptyObject(service.price)) {
				switch (state) {
					case 'INITIAL':
						toPay = 0;
						break;
					case 'ADDED':
					case 'MODIFIED':
						if (!this.utils.isEmptyObject(service.price.totalAmount)) {
							toPay = service.price.totalAmount;
						}
						break;
					default:
						break;
				}
			}
			return toPay;
		},

		__getState: function(service) {
			var state = null;
			var attributes = service.attributes;
			if (!this.utils.isEmptyObject(attributes)) {
				for (var i = 0; i < attributes.length; i++) {
					if (attributes[i].type === "STATE") {
						state = attributes[i].value;
					}
				}
			}
			return state;
		},

		getTotalItems: function() {
			var quantity = 0;
			if (this.servicesData != null) {
				for (var i = 0; i < this.servicesData.length; i++) {
					quantity = quantity + this.servicesData[i].quantity;
				}
			}
			return quantity;
		},

		getAllServTotal: function() {
			var total = 0;
			for (var i = 0; i < this.servicesData.length; i++) {
				total = total + this.servicesData[i].toPay;
			}
			return total;
		},

		getLabel: function(categoryCode) {
			var label = "";
			var serviceCategories = this.reply.serviceCategories;
			for (var i = 0; i < serviceCategories.length; i++) {
				if (serviceCategories[i].code === categoryCode) {
					label = serviceCategories[i].name;
				}
			}
			return label;
		},

		getListClass: function(paymentDetails) {
			var listClass = "";
			if (!this.utils.isEmptyObject(paymentDetails.toPay) && (paymentDetails.toPay != 0)) {
				listClass = "toPay";
			} else if (!this.isPresentInCatalog(service.serviceCode)) {
				listClass = "disabled";
			} else {
				listClass = "paid";
			}
			return listClass;
		},

		openCloseDrawer: function() {
			$('.drawer-contents').animate({
				height: 'toggle'
			}, 500);
		},

		proceed: function(evt) {
			//aria.utils.DomOverlay.create(document.body);
			this.moduleCtrl.commitBasket({
				fn: this.__proceedCallback,
				scope: this
			});
		},

		__proceedCallback: function(response) {
			this.utils.navigateCallback(response, this.moduleCtrl, {
				fn: this.__refresh,
				scope: this
			});
		},

		__refresh: function() {
			this.$dataReady();
			this.$refresh();
		},

		toggleServicesDisplay: function() {
			if (document.getElementById("servicesSelectContainer")) {
				document.getElementById("servicesSelectContainer").style.display = 'none';
			}
			if (document.getElementById("servicesEditContainer")) {
				document.getElementById("servicesEditContainer").style.display = 'block';
			}
		},

		/**
		 * Determines whether the bookmark button should be displayed
		 * Returns true only if :
		 * 	- The flow is retrieval flow
		 *	- The basket of services is not empty
		 * 	- The bookmark of services parameter and the favourites parameter are enabled
		 **/
		__allowBookmark: function() {
			var allowBookmark = false;
			var basket = this.moduleCtrl.getBasket().perCategory;
			if (this.utils.booleanValue(this.config.enableServicesBookmark) && !this.utils.isEmptyObject(basket) && this.utils.booleanValue(this.request.DIRECT_RETRIEVE) && this.utils.booleanValue(this.config.enableMyFavourite)) {
				allowBookmark = true;
			}
			return allowBookmark;
		},
		/**
		 * converts date bean object to JavaScript Date object
		 * @param dateBean DateBean object
		 */
		_getDateFromBean: function(dateBean) {
			return new Date(dateBean.year,
				dateBean.month,
				dateBean.day,
				dateBean.hour,
				dateBean.minute,
				0);
		},

		formatDate: function(dateBean, pattern, utcTime) {
			var format = this.utils.getFormatFromEtvPattern(pattern);
			var jsDate = this._getDateFromBean(dateBean);
			return aria.utils.Date.format(jsDate, format, utcTime);
		},

		/**
		 * This function returns the object which contains the data required to bookmark all the services
		 * that are added in the basket and retrieve this page whenever the page is loaded next time
		 *
		 **/

		getServicesBookmarkData: function(displayAlert) {
			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
				if (!pageObj.utils.isEmptyObject(result) && (result != 'undefined')) {
				if(typeof result ==='string' ){
					pageObj.jsonObj = JSON.parse(result);
				}else{
					pageObj.jsonObj = (result);
				}
					if (!pageObj.utils.isEmptyObject(pageObj.jsonObj)) {
						pageObj.bookmarkedServices = pageObj.jsonObj[pageObj.SERVICES_CATALOG] || [];
					};
				}
			var recordLocator = this.request.REC_LOC;
			var bookmarkedService = this.createServicesBookmarkData(displayAlert);
			var bookmarkPresent = false;
			if (this.bookmarkedServices.length == 0) {
				this.bookmarkedServices.push(bookmarkedService);
				pageObj.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark + 1);
				document.getElementById('favButton').setAttribute("aria-checked", true);
			} else {
				for (var i = 0; i < this.bookmarkedServices.length; i++) {
					if (this.bookmarkedServices[i].REC_LOC == recordLocator) {
						this.bookmarkedServices[i] = bookmarkedService;
						bookmarkPresent = true;
					}
				}
				if (!bookmarkPresent) {
					this.bookmarkedServices.push(bookmarkedService);
					pageObj.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark + 1);
					document.getElementById('favButton').setAttribute("aria-checked", true);
				}
			}
			return this.bookmarkedServices;
		},

		/**
		 * Creates an array of Bookmarked Services json objects,
		 *  which will be used to store in the local storage
		 **/
		createServicesBookmarkData: function(displayAlert) {
			var bookmarksData = {};
			bookmarksData.REC_LOC = this.request.REC_LOC;
			bookmarksData.DIRECT_RETRIEVE_LASTNAME = this.request.DIRECT_RETRIEVE_LASTNAME;
			bookmarksData.itineraryData = this.createBookmarkItinerariesList();
			bookmarksData.servicesData = this.servicesData;
			bookmarksData.basket = this.moduleCtrl.getBasket();
			if (displayAlert) {
				this.toggleBookmarkAlert();
			}
			return bookmarksData;
		},

		inputTagsAvailable: function() {
			var categories = this.moduleCtrl.getBasket().perCategory ;
			for (var key in categories){
				if(categories.hasOwnProperty(key)){
					if(categories[key].hasOwnProperty("inputTags")){
						if(!this.utils.isEmptyObject(categories[key]["inputTags"])){
							return true;
						}
					}
				}
			}
			return false ;
		},
		
		/**
		 * Creates the begin location, end location, begin time and end time for all the
		 * segments for all the itineraries for the entire trip
		 **/
		createBookmarkItinerariesList: function() {
			var itineraryData = {};
			var itineraries = this.tripplan.air.itineraries || [];
			/*
				The rule for one way and round trip is the same. We display the origin and destination.
				Except that we disply only one date of departure in one way and
				in round trip, we display 2 dates of departures
			*/
			if (itineraries.length == 1) {
				var segments = itineraries[0].segments || [];
				var endLocations = [];
				var endDates = [];
				itineraryData.beginLocation = segments[0].beginLocation.cityName;
				itineraryData.beginDate = this.formatDate(segments[0].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
				var endLocation = segments[segments.length - 1].endLocation.cityName;
				endLocations.push(endLocation);
				itineraryData.endLocations = endLocations;
				itineraryData.endDates = endDates;
			} else if (itineraries.length == 2) {
				var segments1 = itineraries[0].segments || [];
				var segments2 = itineraries[1].segments || [];
				var endLocations = [];
				var endDates = [];

				/* In case of round trip */
				if ((segments1[0].beginLocation.locationCode == segments2[segments2.length - 1].endLocation.locationCode) && (segments1[0].endLocation.locationCode == segments2[segments2.length - 1].beginLocation.locationCode)) {
					itineraryData.beginLocation = segments1[0].beginLocation.cityName;
					itineraryData.beginDate = this.formatDate(segments1[0].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
					var endLocation = segments1[0].endLocation.cityName;
					endLocations.push(endLocation);
					var endDate = this.formatDate(segments2[segments2.length - 1].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
					endDates.push(endDate);
					itineraryData.endLocations = endLocations;
					itineraryData.endDates = endDates;
				}

				/* In case of trips with complex itineraries*/
				else {
					itineraryData.beginLocation = segments1[0].beginLocation.cityName;
					itineraryData.beginDate = this.formatDate(segments1[0].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
					for (var i = 0; i < segments1.length; i++) {
						var endLocation = segments1[i].endLocation.cityName;
						endLocations.push(endLocation);
						itineraryData.endLocations = endLocations;
					}
					for (var j = 1; j < segments1.length; j++) {
						var endDate = this.formatDate(segments1[j].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
						endDates.push(endDate);
						itineraryData.endDates = endDates;
					}
					for (var k = 0; i < segments2.length; i++) {
						var endLocation = segments1[i].endLocation.cityName;
						endLocations.push(endLocation);
						var endDate = this.formatDate(segments1[j].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
						endDates.push(endDate);
						itineraryData.endLocations = endLocations;
						itineraryData.endDates = endDates;
					}
				}
			} else {
				var endLocations = [];
				var endDates = [];
				itineraryData.beginLocation = itineraries[0].segments[0].beginLocation.cityName;
				itineraryData.beginDate = this.formatDate(itineraries[0].segments[0].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
				for (var l = 0; l < itineraries.length; l++) {
					var segments = itineraries[l].segments;
					for (var m = 0; m < segments.length; m++) {
						var endLocation = segments[m].endLocation.cityName;
						endLocations.push(endLocation);
						var endDate = this.formatDate(segments[m].beginDateBean, this.labels.tx_merci_pattern_DateMonthNoDay, true);
						endDates.push(endDate);
						itineraryData.endLocations = endLocations;
						itineraryData.endDates = endDates;
					}
				}
			}
			var totalItineraries = itineraries.length;
			var totalSegmentsInLastItinerary = itineraries[totalItineraries - 1].segments.length;
			var lastSegmentInItinerary = itineraries[totalItineraries - 1].segments[totalSegmentsInLastItinerary - 1];
			var lastSegmentFlownDate = lastSegmentInItinerary.endDate;
			lastSegmentFlownDate = new Date(lastSegmentFlownDate);
			/* To make it inline with the existing bookmarks behaviour, the next day after the flown day is considered */
			lastSegmentFlownDate.setDate(lastSegmentFlownDate.getDate() + 1);
			itineraryData.lastSegmentFlownDate = new Date(lastSegmentFlownDate);
			return itineraryData;
		},

		toggleBookmarkAlert: function() {
			var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay'));
			this.utils.toggleClass(overlayDiv, 'on');
		},

		getBookmarkedServicesArray: function() {
			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
				if (result && result != "") {
					if (typeof result === 'string') {
						pageObj.jsonObj = JSON.parse(result);
				}else{
					pageObj.jsonObj = (result);
				}
			}
			if (!pageObj.utils.isEmptyObject(pageObj.jsonObj)) {
				if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.SERVICESCATALOG)) {
					return pageObj.jsonObj.SERVICESCATALOG;
				} else {
					return [];
				}
			} else {
				return [];
			}
		},

		isServicesBookmarkedForRecLoc: function(recLoc) {
			var bookmarkedServices = this.getBookmarkedServicesArray();
			var isBookmarked = false;
			for (var i = 0; i < bookmarkedServices.length; i++) {
				if (bookmarkedServices[i].REC_LOC.toLowerCase() == recLoc.toLowerCase()) {
					isBookmarked = true;
				}
			}
			return isBookmarked;
		},

		toggleCemShopping: function() {
			var element = document.getElementById('CemShopingCart');
			if(this.utils.hasClass(element,'CemShopingOpen'))
			{
				element.className="CemShopingClose";
				return;
			}
			if(this.utils.hasClass(element,'CemShopingClose'))
			{
				element.className="CemShopingOpen";
			}
		}
	}
});