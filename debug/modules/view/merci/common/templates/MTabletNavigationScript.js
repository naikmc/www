Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MTabletNavigationScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.url = modules.view.merci.common.utils.URLManager;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
	},
	$prototype: {
		$dataReady: function() {

			var actionURL = [];
			this.config = this.moduleCtrl.getModuleData().indexPageParams;

			if (this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.Mindex_A != null) {
				this.configParams = this.moduleCtrl.getModuleData().booking.Mindex_A.globalList;
			}

			if (this.isBookFlightEnabled()) {
				actionURL.push('MSearch.action');
			}

			if (this.isTimeTableEnabled()) {
				actionURL.push('MTimeTableSearch.action');
			}

			if (this.isFlightInfoEnabled()) {
				actionURL.push('MFIFOInput.action');
			}

			if (this.isContactUsEnabled()) {
				actionURL.push('MContact.action');
			}

			if (this.isFareDealsEnabled()) {
				actionURL.push('DealsOffersApi.action');
			}

			if (this.isRetrieveEnabled()) {
				actionURL.push('MMyTripChkCookie.action');
			}

			this.length = actionURL.length;
			if (this.length != 0) {
				this.makeAJAX(actionURL);
			} else {
				this.commonFunc();
			}
		},
		$displayReady: function() {
			var currentFlowClass;
			var home = aria.utils.HashManager.getHashString();
			if (localStorage.getItem("currentFlow") != null && this.moduleCtrl.data != null && this.moduleCtrl.data.currentClass != null) {
				currentFlowClass = localStorage.getItem("currentFlow");
				if (home == 'merci-Mindex_A') {
					this.utils.closeTabletPopup(this.moduleCtrl.data.currentClass);
				}
			} else {
				currentFlowClass = '.navigation.home-link.tabletBut';
			}

			this.utils.selectingTab(currentFlowClass);
		},
		isBookFlightEnabled: function() {
			if (this.moduleCtrl.getModuleData().booking == null || (this.moduleCtrl.getModuleData().booking != null && this.utils.isEmptyObject(this.moduleCtrl.getModuleData().booking.MSRCH_A))) {
				return this.utils.booleanValue(this.config.ENABLE_SEARCH);
			}
			return false;
		},
		isTimeTableEnabled: function() {
			if (this.moduleCtrl.getModuleData().servicing == null || (this.moduleCtrl.getModuleData().servicing != null && this.utils.isEmptyObject(this.moduleCtrl.getModuleData().servicing.MTT_BSR_A))) {
				return !this.utils.booleanValue(this.config.allowTimetable) && this.utils.booleanValue(this.config.ENABLE_TIMETABLE);
			}
			return false;
		},
		isFlightInfoEnabled: function() {
			if (this.moduleCtrl.getModuleData().servicing == null || (this.moduleCtrl.getModuleData().servicing != null && this.utils.isEmptyObject(this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A))) {
				return this.utils.booleanValue(this.config.ENABLE_FLIFO);
			}
			return false;
		},
		isContactUsEnabled: function() {
			if (this.moduleCtrl.getModuleData().servicing == null || (this.moduleCtrl.getModuleData().servicing != null && this.utils.isEmptyObject(this.moduleCtrl.getModuleData().servicing.MContact_A))) {
				return this.utils.booleanValue(this.config.ENABLE_CONTACT);
			}
			return false;
		},
		isFareDealsEnabled: function() {
			if (this.moduleCtrl.getModuleData().booking == null || (this.moduleCtrl.getModuleData().booking != null && this.utils.isEmptyObject(this.moduleCtrl.getModuleData().booking.MListOffers_A))) {
				return this.utils.booleanValue(this.config.ENABLE_DEALS);
			}
			return false;
		},
		isRetrieveEnabled: function() {
			if (this.moduleCtrl.getModuleData().MTripList != null || this.moduleCtrl.getModuleData().TripData != null) {
				return false;
			} else {
				return this.utils.booleanValue(this.config.ENABLE_RETRIEVE);
			}
		},
		isCustomButtonsEnabled: function() {
			return this.configParams != null && this.configParams.customButtons && this.configParams.customButtons.length > 0;
		},
		makeAJAX: function(actionURL) {
			var s = actionURL.length - this.length--;
			// 'settings' JSON
			var settings = {
				defaultParams: true,
				isSecured: true,
				appendSession: true
			}
			var current = this;
			// create complete URL if not a complete URL
			var actionURLCalled = this.url.getFullURL(actionURL[s], settings) + "&result=json";
			if (actionURLCalled.indexOf("Contact") != -1) {
				actionURLCalled = actionURLCalled + "&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED"
			}

			/* PTR 07972479: Loading Type A JSON - START */
			var queryParams = this.url.getStringParam();
			if (queryParams != null && queryParams != {} && queryParams.MT != undefined) {
				actionURLCalled += "&MT=" + queryParams.MT;
			}
			/* PTR 07972479 - END */

			var request = {
				url: actionURLCalled,
				type: 'POST',
				processData: false,
				dataType: 'json',
				crossDomain: 'true',
				success: function(resp) {
					var response = {
						error: '',
						responseJSON: '',
						responseText: '',
						responseXML: null
					};
					response.responseJSON = resp;
					// callback function
					current.__onAJAXRequestCallback(response, s, actionURL);
				},
				error: function(a, b, c, d) {
					// in case of server error
					current.utils.hideMskOverlay();
				}
			}
			$.ajax(request);
		},
		__onAJAXRequestCallback: function(response, s, actionURL) {
			if (response.responseJSON != null) {
				var json = jsonResponse.data;
				for (var key in response.responseJSON.data) {
					if (!this.utils.isEmptyObject(json[key])) {
						for (var key1 in response.responseJSON.data[key]) {
							if (response.responseJSON.data[key].hasOwnProperty(key1)) {
								json[key][key1] = response.responseJSON.data[key][key1];
							}
						}
					} else {
						if (response.responseJSON.data.hasOwnProperty(key)) {
							json[key] = response.responseJSON.data[key];
						}
					}
				}
				if (this.length != 0) {
					this.makeAJAX(actionURL);
				} else {
					this.commonFunc();
				}
			}
		},
		commonFunc: function() {
			var classArr = ['.booking.sear.tablet.search', '.timetable.tablet', '.flightStatus.tablet', '.contact.tablet', '.dealsListTablet', '.panel.list.triplist.tablet', '.booking.sear.tablet.deals'];
			this.moduleCtrl.data = jsonResponse.data;
			this.moduleCtrl.data.classArr = classArr;
			if (this.moduleCtrl.data != null && this.moduleCtrl.data.booking.MSRCH_A != null) {
				if (this.moduleCtrl.data.booking.MSRCH_A.requestParam.beginLocations != null) {
					this.moduleCtrl.data.begin = this.moduleCtrl.data.booking.MSRCH_A.requestParam.beginLocations;
				}

				if (this.moduleCtrl.data.booking.MSRCH_A.requestParam.endLocations != null) {
					this.moduleCtrl.data.end = this.moduleCtrl.data.booking.MSRCH_A.requestParam.endLocations;
				}

				if (this.moduleCtrl.data.booking.MSRCH_A.requestParam.smartDropDownContent != null) {
					this.moduleCtrl.data.smartDropDown = this.moduleCtrl.data.booking.MSRCH_A.requestParam.smartDropDownContent;
				}


				if (this.moduleCtrl.data.booking.MSRCH_A.requestParam.flow != null) {
					this.moduleCtrl.data.booking.MSRCH_A.requestParam.flow = "";
				}

				if (this.utils.isEmptyObject(this.moduleCtrl.data.booking.MSRCH_A.requestParam.beginLocations)) {
					this.moduleCtrl.data.booking.MSRCH_A.requestParam.beginLocations = this.moduleCtrl.data.begin;
				}

				if (this.utils.isEmptyObject(this.moduleCtrl.data.booking.MSRCH_A.requestParam.endLocations)) {
					this.moduleCtrl.data.booking.MSRCH_A.requestParam.endLocations = this.moduleCtrl.data.end;
				}

				if (this.utils.isEmptyObject(this.moduleCtrl.data.booking.MSRCH_A.requestParam.smartDropDownContent)) {
					this.moduleCtrl.data.booking.MSRCH_A.requestParam.smartDropDownContent = this.moduleCtrl.data.smartDropDown;
				}
			}

			this.includeTpls = true;
			this.$refresh({
				section: 'tpls'
			});

			// once loaded hide mask
			jsonResponse.ui['navBarDataLoaded'] = true;
			this.utils.hideMskOverlay();

		},
		closePopUpTpl: function(AT, args) {
			this.data.errors = new Array();
			aria.utils.Json.setValue(this.data, 'error_msg', true);

			if (args.ID == '.dealsListTablet') {
				var hashPage = aria.utils.HashManager.getHashString();
				if (hashPage != 'merci-Mindex_A') {
					aria.utils.HashManager.setHash("merci-Mindex_A");
				}
			}
			if (args.ID == '.timetable.tablet') {
				var hashPage = aria.utils.HashManager.getHashString();
				if (hashPage == 'merci-MTTBRE_A') {
					aria.utils.HashManager.setHash("merci-Mindex_A");
					/*if(!this.utils.hasClass(document.querySelector('.timetable.tablet'),'show')){
						this.utils.closeTabletPopup('.timetable.tablet');
					}*/
				}
			}
			if (args.ID == '.booking.sear.tablet.search') {
				var hashPage = aria.utils.HashManager.getHashString();
				if (hashPage != 'merci-Mindex_A' && (hashPage == 'merci-book-MCAL_A' || hashPage == 'merci-book-MOUTA_A')) {
					aria.utils.HashManager.setHash("merci-Mindex_A");
				}
			}
			this.utils.showMskOverlay(false);
			this.utils.closeTabletPopup(args.ID, args.cls);
		},
		openPopUp: function(AT, args) {
			window.scrollTo(0, 0);
			localStorage.setItem("currentFlow", args.cls);
			this.moduleCtrl.data.currentClass = args.ID;
			//localStorage.setItem("currentClass",args.ID );
			this.closePopUpTpl(AT, args)
		},

		onHomeClick: function(AT, args) {
			localStorage.setItem("currentFlow", args.cls);
			this.utils.selectingTab(args.cls);
			this.moduleCtrl.navigate(null, 'merci-Mindex_A');
		},
		isHomePage: function(flowType){
			  flowType = flowType.split('-');
			  if(flowType[1]!=undefined && flowType[1]=='H'){
				  return true;
			  }
			  return false;
		  }
	}
});