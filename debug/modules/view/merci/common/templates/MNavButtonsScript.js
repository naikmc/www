Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.MNavButtonsScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.URLManager',
		'aria.utils.ScriptLoader'
	],
	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
		this.utilsManager = modules.view.merci.common.utils.URLManager;

	},
	$prototype: {
	
		$dataReady: function() {
			if (this.data.config.enableProfile != undefined && this.data.config.enableProfile.toLowerCase() == "true") {
				if (this.data.request != null && !this.utils.isEmptyObject(this.data.request.IS_USER_LOGGED_IN)) {
					this.IS_USER_LOGGED_IN = this.data.request.IS_USER_LOGGED_IN;
				} else if (this.data.request != null) {
					this.IS_USER_LOGGED_IN = this.utils.booleanValue(this.data.request.IS_DIRECT_LOGGED_IN);
				}
			}
			if (this.utils.booleanValue(this.data.config.siteCommonPageEnabled && this.moduleCtrl.getModuleData().booking != undefined && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A != undefined)) {
				if (this.moduleCtrl.getModuleData().MBookingDetails == undefined || this.moduleCtrl.getModuleData().MBookingDetails.config == undefined) {
					
					if(this.moduleCtrl.getModuleData().MBookingDetails == null){
						this.moduleCtrl.getModuleData().MBookingDetails={};
					}
					
					this.moduleCtrl.getModuleData().MBookingDetails.requestParam = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam;
					this.moduleCtrl.getModuleData().MBookingDetails.config = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.siteParam;
					this.moduleCtrl.getModuleData().MBookingDetails.labels = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.labels;
					this.moduleCtrl.getModuleData().MBookingDetails.globalList = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.globalList;
					this.moduleCtrl.getModuleData().MBookingDetails.reply = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply;
					if(this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MBookingDetails && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MBookingDetails.refundDetails){
						this.moduleCtrl.getModuleData().MBookingDetails.refundDetails = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MBookingDetails.refundDetails;
					}					
				}
			}
		},
		$viewReady: function() {
			if (this.data.pageDesc != undefined && (!this.data.isFromMenu || this.data.isFromCustomHome)) {
				this.dataUpdate = jsonResponse.ui.dataUpdate;
				if (this.utils.booleanValue(this.data.config.allowSetting) == true) {
					this.settingDataCreation();
					this.morePageDataCreation();
				};
				jsonResponse.ui.dataUpdate = false;
			}
		},
		/* Retrieves the cookie with the given cookie name */
		getCookie: function(c_name) {
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1) {
				c_start = c_value.indexOf(c_name + "=");
			}
			if (c_start == -1) {
				c_value = null;
			} else {
				c_start = c_value.indexOf("=", c_start) + 1;
				var c_end = c_value.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = c_value.length;
				}
				c_value = unescape(c_value.substring(c_start, c_end));
			}
			return c_value;
		},


		/* *****
		 * Book Flight
		 * ***** */
		isBookFlightEnabled: function() {
			return this.utils.booleanValue(this.data.config.merciEnabled) 
				&& this.utils.booleanValue(this.data.config.merciBookEnable);
		},

		/**
		 * function used to parse sub menu items
		 * @param args parameters passed from calling function
		 */
		_getSubMenuButtons: function(args) {
			
			// parse string
			var jsonString = args.buttons.substring(args.buttons.indexOf('|') + 1);
			jsonString = jsonString.substring(jsonString.indexOf('|') + 1);
			
			try {
				return JSON.parse(jsonString);
			} catch (e) {
				return [];
			}
		},
		
		/**
		 * function called when submenu's parent is clicked<br/>
		 * it is used to toggle
		 * @param event JSON object with event information
		 * @param args parameters passed from calling function
		 */
		onSubmenuClick: function(event, args) {
			var el = document.getElementById(this.$getId(args.key));
			var elHolder = document.getElementById(this.$getId(args.holderKey));
			if (el != null) {
				if (el.className.indexOf('hidden') !== -1) {
					el.className = el.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				} else {
					el.className += ' hidden';
				}
			}

			if (elHolder != null) {
				if (elHolder.className.indexOf('sub-menu-open') !== -1) {
					elHolder.className = elHolder.className.replace(/(?:^|\s)sub-menu-open(?!\S)/g, '');
				} else {
					elHolder.className += ' sub-menu-open';
				}
			}
		},
		
		/**
		 * function called when home button is clicked
		 * @param event JSON object with event information
		 * @param args parameters passed from calling function
		 */
		onHomeClick: function(event, args) {
			var that = this;
			setTimeout(function() {
				that.moduleCtrl.navigate(null, 'merci-Mindex_A');
			}, 500);
		},
		
		onBookFlightClick: function() {
			var countrySite = this.getCookie("merci.country");
			this.moduleCtrl.setValueforStorage(countrySite, 'COUNTRY_SITE');
			rqstParams = this.data.request.reply;
			rqst = this.data.request.req;

			if (this.utils.booleanValue(this.data.config.allowCustomSearch)) {
				this.moduleCtrl.navigate(null, 'merci-book-MCSMSRCH_A');
			} else {
				var enableProfile = (this.data.config.enableProfile != undefined && this.data.config.enableProfile.toLowerCase() == "true") ? true : false
				if (enableProfile && !this.utils.isEmptyObject(this.data.request.req) && this.data.request.req.ENABLE_EARLY_LOGIN == "YES") {
					var request = {
						page: 'ATC 1-Search',
						TD_ROLE_1: 'P',
						TITLE_1: rqstParams.TITLE_1,
						ENABLE_DIRECT_LOGIN: this.data.request.req.ENABLE_DIRECT_LOGIN,
						ENABLE_EARLY_LOGIN: this.data.request.req.ENABLE_EARLY_LOGIN,
						USER_ID: rqstParams.USER_ID,
						FIRST_NAME_1: rqstParams.FIRST_NAME_1,
						LAST_NAME_1: rqstParams.LAST_NAME_1,
						CONTACT_POINT_EMAIL_1_1: rqstParams.CONTACT_POINT_EMAIL_1_1,
						CONTACT_POINT_PHONE_NUMBER: rqstParams.CONTACT_POINT_PHONE_NUMBER,
						PASSWORD_1: rqstParams.PASSWORD_1,
						PASSWORD_2: rqstParams.PASSWORD_2,
						CONTACT_POINT_PHONE_TYPE: rqstParams.CONTACT_POINT_PHONE_TYPE,
						DATE_OF_BIRTH_1: rqstParams.DATE_OF_BIRTH_1,
						TRAVELLER_TYPE_1: rqstParams.TRAVELLER_TYPE_1,
						IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN,
						NUMBER_OF_PROFILES: 1
					};
				} else if (enableProfile && !this.utils.isEmptyObject(this.data.request.requestParam) && this.data.request.requestParam.ENABLE_DIRECT_LOGIN == "YES") {
					var rqstParams = this.data.request.requestParam;
					var request = {
						ENABLE_DIRECT_LOGIN: rqstParams.ENABLE_DIRECT_LOGIN,
						USER_ID: rqstParams.USER_ID,
						PASSWORD_1: rqstParams.PASSWORD_1,
						PASSWORD_2: rqstParams.PASSWORD_2,
						FIRST_NAME_1: rqstParams.FIRST_NAME_1,
						LAST_NAME_1: rqstParams.LAST_NAME_1,
						DATE_OF_BIRTH_1: rqstParams.DATE_OF_BIRTH_1,
						TITLE_1: rqstParams.TITLE_1,
						TRAVELLER_TYPE_1: rqstParams.TRAVELLER_TYPE_1,
						GENDER_1: rqstParams.GENDER_1,
						CONTACT_POINT_PHONE_TYPE: rqstParams.CONTACT_POINT_PHONE_TYPE,
						CONTACT_POINT_PHONE_COUNTRY_CODE: rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE,
						CONTACT_POINT_PHONE_AREA_CODE: rqstParams.CONTACT_POINT_PHONE_AREA_CODE,
						CONTACT_POINT_PHONE_NUMBER: rqstParams.CONTACT_POINT_PHONE_NUMBER,
						CONTACT_POINT_EMAIL_1_1: rqstParams.CONTACT_POINT_EMAIL_1_1,
						IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN,
						PASSPORT_NUMBER_1_1: rqstParams.PASSPORT_NUMBER_1_1,
						PASSPORT_COUNTRY_CODE_1_1: rqstParams.PASSPORT_COUNTRY_CODE_1_1,
						PASSPORT_EXP_DATE_1_1: rqstParams.PASSPORT_EXP_DATE_1_1,
						NUMBER_OF_PROFILES: rqstParams.NUMBER_OF_PROFILES
					};
				} else {
					var request = {
						page: 'ATC 1-Search'
					}
				};

				this.utils.sendNavigateRequest(request, 'MGlobalDispatcher.action', this);
			}
		},

		/* *****
		 * Retrieve
		 * ***** */
		isRetrieveEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowRetrieve);
		},

		onRetrieveClick: function() {
			if (this.utils.booleanValue(this.data.config.allowCustomRetrieve)) {
				var url = this.data.config.customRetrieveURL;
				document.location.href = url;
			} else {
				if (this.utils.isRequestFromApps() == true) {
					var that = this;
					this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
						if (result != null && result != '') {
							if (typeof result === 'string') {
								result = JSON.parse(result);
							}
							if (!that.utils.isEmptyObject(result)) {
								var json = that.moduleCtrl.getModuleData();
								json.result = result;
								/* Navigation will be changed by site parameter*/
								json.navigation = true;
								that.moduleCtrl.navigate(null, 'merci-MTRIPS_A');
							} else {
								that.getTripData();
							}
						} else {
							that.getTripData();
						}
					});
				} else {
					var request = null;
					if (this.data.config.enableProfile != undefined && this.data.config.enableProfile.toLowerCase() == "true") {
						if (!this.utils.isEmptyObject(this.data.request.req) && this.data.request.req.ENABLE_EARLY_LOGIN == "YES" && this.IS_USER_LOGGED_IN == true) {
							request = {
								IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN,
								lastName: this.data.request.reply.LAST_NAME_1,
								result: 'json'
							};
						} else if (!this.utils.isEmptyObject(this.data.request.requestParam) && this.data.request.requestParam.ENABLE_DIRECT_LOGIN == "YES" && this.IS_USER_LOGGED_IN == true) {
							request = {
								IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN,
								lastName: this.data.request.requestParam.LAST_NAME_1,
								result: 'json'
							};
							var request = {
								result: 'json'
							};
						}
					} else {
						var request = {
							result: 'json'
						};
					}
					this.utils.sendNavigateRequest(request, 'MMyTripChkCookie.action', this);
				};
			}
		},

		getTripData: function() {
			var that = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_GETTRIP, function(getTripObj) {
				if (getTripObj != null && getTripObj != '') {
					if (typeof getTripObj === 'string') {
						getTripObj = JSON.parse(getTripObj);
					}
					if (!that.utils.isEmptyObject(getTripObj)) {
						that.moduleCtrl.navigate(null, 'merci-MPNRTRIPS_A');
					} else {
						that.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', that);
					}
				} else {
					that.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', that);
				}
			});
		},

		/* *****
		 * Meals
		 * ***** */

		// condition added for PTR : 07626128
		isMealEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowPNRServ) && this.utils.booleanValue(this.data.config.allowSpecialMeal) && this.utils.booleanValue(this.isFlightFlown());
		},

		isFlightFlown: function() {

			if (this.data.itineraries != null) {

				// current date
				var dateParams = this.data.dateParams;
				var currentDate = new Date(dateParams.year, dateParams.month, dateParams.day, dateParams.hour, dateParams.minute, dateParams.second);

				// convert current date to seconds
				var time = currentDate.getTime() / 1000;

				// iterate on itineraries
				var allSegmentsFlown = true;
				for (var itinIndex = 0; itinIndex < this.data.itineraries.length; itinIndex++) {
					var segments = this.data.itineraries[itinIndex].segments;
					if (segments != null) {

						// iterate on segments
						for (var segIndex = 0; segIndex < segments.length; segIndex++) {
							var jsDt = segments[segIndex].beginDateGMTBean.jsDateParameters.split(',');
							var segmentTime = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]).getTime() / 1000;

							// get difference in hours
							var timeToDeparture = (segmentTime - time) / 3600;

							// added for PTR 07626025
							if (timeToDeparture >= 0) {
								allSegmentsFlown = false;
								break;
							}
						}
					}
				}

				if (allSegmentsFlown) {
					return false;
				}
			}
			return true;
		},

		isAgodaLinkEnabled: function() {

			return this.utils.booleanValue(this.data.config.displayAgodaLink);
		},

		isMerciCatalogEnabled: function() {
			return this.utils.booleanValue(this.data.config.merciServiceCatalog);
		},


		isCarLinkEnabled: function() {

			return this.utils.booleanValue(this.data.config.displaySQCarLink);
		},

		onCarRentalClick: function() {
			window.open(this.data.config.sqCarUrl);
		},

		onBookHotelClick: function() {
			window.open(this.data.config.bookHotelUrl);
		},


		onMealClick: function(evt) {
			/*Added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
			if (this.data.common.sadadPaymentInd != true) {
				/*Added as part of CR 5533028- SADAD Implementation for MeRCI- END*/
				if (this.utils.booleanValue(this.data.config.merciServiceCatalog)) {
					//When the catalogue of services is activated, the click on any service button brings to the catalogue page.
					var params = {
						DIRECT_RETRIEVE: 'true',
						ACTION: 'MODIFY',
						DIRECT_RETRIEVE_LASTNAME: this.data.rebooking.lastName,
						REC_LOC: this.data.common.recordLocator,
						PAGE_TICKET: this.data.common.pageTicket,
						IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
					};
					this.utils.sendNavigateRequest(params, 'MGetServiceCatalogFromCONF.action', this);

				} else {

					var params = {
						ACTION: "MODIFY",
						BOOL_RETRIEVE: "true",
						FROM_PNR_RETRIEVE: "true",
						REC_LOC: this.data.common.recordLocator,
						DIRECT_RETRIEVE_LASTNAME: this.data.rebooking.lastName,
						SERVICE_PRICING_MODE: "INIT_PRICE",
						PAGE_TICKET: this.data.common.pageTicket,
						IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
					};
					var action = 'MMealModifyChargeableServicesSelection.action';

					if (this.data.common.fromPage === 'CONF') {
						params.DIRECT_RETRIEVE = "true";
						action = 'MNewMealRetrieve.action';
					}

					this.utils.sendNavigateRequest(params, action, this);
				}
			}
		},

		/* *****
		 * Merci check-in
		 * ***** */
		isCheckinEnabled: function(page) {
			if (page == 'home') {
				return (this.utils.booleanValue(this.data.config.merciCheckInEnabled) || this.utils.booleanValue(this.data.config.merciSsciCheckInEnabled));
			}

			// if checkin is not enabled on site
			if (!this.utils.booleanValue(this.data.config.siteAllowCheckin)) {
				return false;
			}

			if (this.data.itineraries != null) {

				// current date
				var dateParams = this.data.dateParams;
				var currentDate = new Date(dateParams.year, dateParams.month, dateParams.day, dateParams.hour, dateParams.minute, dateParams.second);

				// convert current date to seconds
				var time = currentDate.getTime() / 1000;

				// iterate on itineraries
				for (var i = 0; i < this.data.itineraries.length; i++) {
					var segments = this.data.itineraries[i].segments;
					if (segments != null) {

						// iterate on segments
						for (var j = 0; j < segments.length; j++) {
							var jsDt = segments[j].beginDateGMTBean.jsDateParameters.split(',');
							var segmentTime = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]).getTime() / 1000;

							// get difference in hours
							var timeToDeparture = (segmentTime - time) / 3600;

							// added for PTR 07626025
							if (timeToDeparture < 0) {
								return false;
							}

							var timeFrame = 0;
							if (!this.utils.isEmptyObject(this.data.config.siteCknTimeFrame) && this.data.config.siteCknTimeFrame != "") {
								timeFrame = parseInt(this.data.config.siteCknTimeFrame);
							}

							if (timeToDeparture <= timeFrame) {
								return true;
							}
						}
					}
				}
			}

			return false;
		},

		onCheckinClick: function(event, args) {

			var actionName = "";
			if (args.page == 'home') {

				/*
				 * if MCi,SSCI true redirect to ssci
				 * or redirect to corespoding one
				 * */
				if (this.utils.booleanValue(this.data.config.merciSsciCheckInEnabled)) {
					actionName = 'gettripFlow.action';

					/* Navigate to custom check-in URL */
					/* FOR CUSTOM CHECKIN
					 * if MCi,SSCI custom checkin enabled redirect to ssci
					 * or redirect to corespoding one
					 * */
					if (this.data.config.customSsciCheckinURL != "") {
						var url = this.data.config.customSsciCheckinURL;

					}

				} else if (this.utils.booleanValue(this.data.config.merciCheckInEnabled)) {
					actionName = 'checkinFlow.action';
					/* Navigate to custom check-in URL */
					/* FOR CUSTOM CHECKIN
					 * if MCi,SSCI custom checkin enabled redirect to ssci
					 * or redirect to corespoding one
					 * */
					if (this.utils.booleanValue(this.data.config.allowCustomCheckin)) {
						var url = this.data.config.customCheckinURL;

					}
				}

				/*
				 * If condition true then loading custom URl
				 * */
				if (url != undefined && url != "") {
					args = {};
					args.forceReload = true;
					var jsonData = {};
					jsonData.url = url;
					jsonData.label = "Checkin";
					jsonResponse.ui.navData = jsonData;
					
					var actionData = {};
					actionData['url'] = url;
					actionData['navigation'] = 'checkin';
					
					this.onCustomButtonClick(event, {
						actionData: JSON.stringify(actionData), 
						action: 'openUriInner'
					});
				}


				params = '&result=json';

				var request = {
					parameters: params,
					action: actionName,
					method: 'GET',
					loading: true,
					expectedResponseType: 'json',
					defaultParams: true,
					cb: {
						fn: this.__onCheckinClickCallback,
						args: params,
						scope: this
					}
				}
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

			} else {
				if (this.utils.booleanValue(this.data.config.merciCheckInEnabled)) {

					/*
					 * for taking action sitecode from MCI URL
					 * site code is required to take because it change from booking to checkin in cases.
					 * */
					var checkInURL = this.data.config.checkInURL;
					//console.log("checkinURL === "+checkInURL);
					var tempcheckInURL = checkInURL.split("/");
					actionName = tempcheckInURL[tempcheckInURL.length - 1].split("?")[0];
					var siteCode = checkInURL.substr(checkInURL.search(/site=[a-zA-Z0-9]{1,}&/i) + 5, 8);
					var actualSiteCode = jsonResponse.data.framework.baseParams[11];
					jsonResponse.data.framework.baseParams[11] = siteCode;
					//console.log("actionName === "+actionName);
					//console.log("siteCode === "+siteCode);

					params = 'REC_LOC=' + this.data.common.recordLocator.toUpperCase() + '&LAST_NAME=' + this.data.rebooking.lastName + '&result=json';
					var request = {
						parameters: params,
						action: actionName,
						method: 'GET',
						loading: true,
						expectedResponseType: 'json',
						defaultParams: true,
						cb: {
							fn: this.__onCheckinClickCallback,
							args: params,
							scope: this
						}
					}
					modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
					/*
					 * SETTING BACK ACTUAL SITE CODE
					 * jsonResponse.data.framework.baseParams[11]=actualSiteCode;
					 * */
				} else {
					// show overlay with loading icon
					this.utils.showMskOverlay(true);

					// create URL for checkin
					var checkInURL = new this.buffer(this.data.config.checkInURL);
					var base = modules.view.merci.common.utils.URLManager.getBaseParams();

					// add extra parameters
					checkInURL.append("&LANGUAGE=" + base[12]);
					if (base[14] != null && base[14] != '') {
						checkInURL.append("&client=" + base[14]);
					}

					// navigate to external page
					document.location.href = checkInURL.formatString([this.data.common.recordLocator, this.data.rebooking.lastName]);
				}
			}

		},

		__onCheckinClickCallback: function(response, args) {

			//console.log("response === "+JSON.stringify(response));

			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null && dataId != 'Mflights_A') {
				// will be null in case page already navigated
				if (this.moduleCtrl != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.checkIn == null) {
						json.checkIn = {};
					}
					json.checkIn[dataId] = response.responseJSON.data.checkIn[dataId];
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
			if (aria.utils.HashManager.getHashString() == 'merci-MStaticPage_A') {
						this.utils.hideMskOverlay();
			} 
		},

		/* *****
		 * Fare deals
		 * ***** */
		isFareDealsEnabled: function() {
			return this.utils.booleanValue(this.data.config.enableDealsOffers);
		},

		onFareDealsClick: function() {
			var country = this.data.fareDeals.countrySite;
			if (this.utils.isEmptyObject(country)) {
				country = this._getCookie("merci.country");
			}
			this.moduleCtrl.setValueforStorage(country, 'defaultCountry');
			if (this.IS_USER_LOGGED_IN == true) {
				var request = {
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
			} else {
				var request = null;
			}
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var infoBoxFile = bp[0] + "://" + bp[1] + ":" + bp[2] + bp[10] + "/default/" + bp[9] + "/static/merciAT/dealsoffers/slider.js";
			aria.utils.ScriptLoader.load([infoBoxFile],null);
			this.utils.sendNavigateRequest(request, 'DealsOffersApi.action', this);
		},

		/* *****
		 * Contact us
		 * ***** */
		isContactUsEnabled: function() {
			return this.utils.booleanValue(this.data.config.contactUs);
		},

		onContactUsClick: function() {
			var params = 'result=json&REC_LOC=&BCKTOHOME=BCKTOHOME&DIRECT_RETRIEVE=true&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED&IS_USER_LOGGED_IN=' + this.IS_USER_LOGGED_IN;
			//this.utils.sendNavigateRequest(params, 'MContact.action', this);
			that = this;
			this.utils.sendNavigateRequest(params, 'MContact.action', this, function(result) {
				// Callback for error
				if (result) {
					var request = null;
					that.moduleCtrl.navigate(request, 'merci-MContact_A');
				}
			});
		},

		/* *****
		 * Flight info
		 * ***** */
		isFlightInfoEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowFlifo);
		},

		onFlightInfoClick: function() {
			if (this.IS_USER_LOGGED_IN == true) {
				var request = {
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
			} else {
				var request = null;
			}
			this.utils.sendNavigateRequest(request, 'MFIFOInput.action', this);
		},

		/* *****
		 * Time table
		 * ***** */
		isTimeTableEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowMCTimetable);
		},

		onTimeTableClick: function() {
			if (this.IS_USER_LOGGED_IN == true) {
				var request = {
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
			} else {
				var request = null;
			}
			this.utils.sendNavigateRequest(request, 'MTimeTableSearch.action', this);
		},

		/* *****
		 * ATC Rebooking
		 * ***** */
		isRebookEnabled: function() {
			var enabled = false;
			if (this.data.rebooking) {
				var infantRebookingEnabled = this.utils.booleanValue(this.data.config.infantRebookingEnabled);
				var hasInfant = this.utils.booleanValue(this.data.rebooking.hasInfant);
				var rebookingAllowed = this.utils.booleanValue(this.data.rebooking.rebookingAllowed);
				enabled = rebookingAllowed && (infantRebookingEnabled || !hasInfant);
			}
			if (enabled) {
				var awardPNR = this.utils.booleanValue(this.data.rebooking.isAwardPNR);
				if (awardPNR) {
					var isAwardATCEnabled = this.utils.booleanValue(this.data.config.allowAwardATC);
					enabled = enabled && isAwardATCEnabled;
				}
			}
			return enabled;
		},

		onRebookClick: function() {
			var awardPNR = this.moduleCtrl.getModuleData().MBookingDetails.reply.bookingPanel.isAwardPNR;
			var isAwardATCEnabled = this.utils.booleanValue(this.moduleCtrl.getModuleData().MBookingDetails.config.allowAwardATC);
			if (awardPNR && isAwardATCEnabled) {
				var parameters = "REC_LOC=" + this.data.common.recordLocator + "&DIRECT_RETRIEVE_LASTNAME=" + this.data.rebooking.lastName + "&DIRECT_RETRIEVE=true&ACTION=MODIFY&result=json&IS_USER_LOGGED_IN=" + this.IS_USER_LOGGED_IN;
				var value = ['-', '-'];
				value = this.moduleCtrl.getModuleData().MBookingDetails.config.siteMCATCAwrdSite.split('-');
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var request = {
					parameters: parameters,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__rebookCallback,
						scope: this
					}
				}
				request.isCompleteURL = true;
				request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + value[0] + "/" + "MRebookSearchEntry.action" + ";jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + value[1] + "&LANGUAGE=" + bp[12];
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				var parameters = {
					REC_LOC: this.data.common.recordLocator,
					DIRECT_RETRIEVE_LASTNAME: this.data.rebooking.lastName,
					DIRECT_RETRIEVE: "true",
					ACTION: "MODIFY",
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
				this.utils.sendNavigateRequest(parameters, 'MRebookSearchEntry.action', this);
			}
		},
		__rebookCallback: function(response, args) {
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null && dataId != 'Mflights_A') {
				// will be null in case page already navigated
				if (this.moduleCtrl != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.servicing == null) {
						json.servicing = {};
					}
					json.servicing[dataId] = response.responseJSON.data.servicing[dataId];
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},
		//ATC Refund Code
		onRefundClick: function() {						
				var parameters = "REC_LOC=" + this.data.common.recordLocator + "&DIRECT_RETRIEVE_LASTNAME=" + this.data.rebooking.lastName + "&result=json";
				var value = ['-', '-'];
				value = this.moduleCtrl.getModuleData().MBookingDetails.config.siteMCATCAwrdSite.split('-');
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var request = {
					parameters: parameters,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__refundCallback,
						scope: this
					}
				}
				request.isCompleteURL = true;
			request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + bp[4] + "/" + "MRefundPNR.action" + ";jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + bp[11] + "&LANGUAGE=" + bp[12];
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		
		},
		__refundCallback: function(response, args) {
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null && dataId != 'Mflights_A') {
				// will be null in case page already navigated
				if (this.moduleCtrl != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.servicing == null) {
						json.servicing = {};
					}
					//json.servicing[dataId] = response.responseJSON.data.servicing[dataId];
					// navigate to next page					
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},
		//ATC Refund Code End

		/* *****
		 * Email trip
		 * ***** */
		isEmailTripEnabled: function() {
			var isEmailAllowed = this.utils.booleanValue(this.data.config.allowEmailFrnd);
			return isEmailAllowed ? true : false;
		},

		onEmailClick: function() {
			var parameters = {
				REC_LOC: this.data.common.recordLocator,
				ACTION: "MODIFY",
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				PAGE_TICKET: this.data.common.pageTicket,
				DIRECT_RETRIEVE_LASTNAME: this.data.common.lastName,
				IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
			};
			if (this.utils.booleanValue(this.data.emailTrip.isScheduleReject)) {
				parameters.isScheduleReject = "true";
			}
			if (this.utils.booleanValue(this.data.emailTrip.isScheduleChange)) {
				parameters.isScheduleChange = "true";
			}
			var baseParams = modules.view.merci.common.utils.URLManager.getBaseParams();
			if ((baseParams[14] != null && baseParams[14] != '') || (this.utils.isRequestFromApps())) {
				this.utils.sendNavigateRequest(parameters, 'MMailRetrievePNR.action', this);
			} else {
			this.utils.sendNavigateRequest(parameters, 'MMail.action', this);
			}
			
		},

		/* *****
		 * Custom buttons
		 * ***** */
		isCustomButtonsEnabled: function() {
			return this.data.globalList.customButtons && this.data.globalList.customButtons.length > 0;
		},

		/* *****
		 * Type B link
		 * ***** */
		isTypeBLinkEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowTypeBLink);
		},

		/* *****
		 * Change Language
		 * ***** */
		isChangeLangEnabled: function() {
			return this.utils.booleanValue(this.data.config.allowChangeLang);
		},

		onChangeLanguageClick: function() {
			var request = {
				action: 'MLangInput.action',
				method: 'POST',
				parameters: 'result=json',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: 'onChangLanguageCallback',
					scope: this
				}
			}

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		onDesktopLinkClick: function() {
			
			if (!this.utils.isRequestFromApps()) {
				window.location = this.data.config.desktopURL;
			} else {
				if (typeof navigator.app != "undefined") {
					// Supported by PhoneGap - Android
					navigator.app.loadUrl(this.data.config.desktopURL, {
						openExternal: true
					});
				} else {
					// Using inappbrowser PhoneGap plugin. Workaround for iOS
					window.open(this.data.config.desktopURL, '_system');
				}
			}
		},
		
		footerCustomPage: function(evt,args) {
			
			if (!this.utils.isRequestFromApps()) {
				window.location = args.url;
			} else {
				if (typeof navigator.app != "undefined") {
					// Supported by PhoneGap - Android
					navigator.app.loadUrl(args.url, {
						openExternal: true
					});
				} else {
					// Using inappbrowser PhoneGap plugin. Workaround for iOS
					window.open(args.url, '_system');
				}
			}
		},
		onChangLanguageCallback: function(response, args) {
			if (response != null) {
				this.moduleCtrl.navigate(null, 'merci-book-MWELC_A');
			} else {
				this.utils.hideMskOverlay();
			}
		},

		/* *****
		 * Desktop link
		 * ***** */
		isDesktopLinkEnabled: function() {
			return this.data.config.desktopURL ? true : false;
		},

		_getCookie: function(c_name) {
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1) {
				c_start = c_value.indexOf(c_name + "=");
			}
			if (c_start == -1) {
				c_value = null;
			} else {
				c_start = c_value.indexOf("=", c_start) + 1;
				var c_end = c_value.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = c_value.length;
				}
				c_value = unescape(c_value.substring(c_start, c_end));
			}
			return c_value;
		},

		/* *****
		 * Trip Photos Button for Apps
		 * ***** */
		isTripPhotosEnabled: function() {
			var baseParams = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (baseParams[14] != null && baseParams[14] != '' && baseParams[14].toLowerCase() == 'iphone') {
				return true;
			}
			return false;
		},

		onTripPhotosClick: function() {

			/* => Change hard coded value "sqmobile" to one coming from siteParam (this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback)*/
			var itineraries = this.moduleCtrl.getModuleData().MFlightDetails.reply.tripplan.air.itineraries;
			var flownStatus = false;
			var noOfItineraries = itineraries.length;
			if (noOfItineraries > 0) {
				flownStatus = itineraries[noOfItineraries - 1].boolFlownStatus;
			}
			this.utils.appCallBack("sqmobile", "://?flow=servicing/tripPhotosFlown=" + flownStatus);
		},

		getTripPhotoCount: function() {
			/*Reads Hidden input tag - offer_id_list for Trip Photo value coming from Native App */
			if (document.getElementById('offer_id_list').value != null && document.getElementById('offer_id_list').value != '') {
				var photoCount = " ( " + document.getElementById('offer_id_list').value + " )";
				return photoCount;
			} else {
				return " ( 0 )";
			}
		},
		/* *****
		 * Favorite Button
		 * ***** */
		isFavLinkEnabled: function() {
			if (this.utils.booleanValue(this.data.config.allowFavorite)) {
				return true;
			} else {
				return false;
			};
		},

		onMyFavoriteClick: function() {
			if(aria.utils.HashManager.getHashString() != 'merci-MFAVOURITE_A'){
				this.utils.showMskOverlay(true);
				if (this.IS_USER_LOGGED_IN == true) {
					var request = {
						IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
					};
				} else {
					var request = null;
				}
				var that = this;
				setTimeout(function() {
					that.moduleCtrl.navigate(request, 'merci-MFAVOURITE_A');
				}, 500);
			}
		},

		isAllowBookmark: function() {
			return this.utils.booleanValue(this.data.config.allowBookmarksParam);
		},
		/* *****
		 * Setting Button
		 * ***** */
		/* Click on Settings Button for merci application */

		isSettingLinkEnabled: function() {
			if (this.utils.booleanValue(this.data.config.allowSetting)) {
				return true;
			} else {
				return false;
			};
		},
		/* Click on Settings Button for merci application */
		settingDataCreation: function() {
			var that = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						that.jsonObj = JSON.parse(result);
					} else {
						that.jsonObj = (result);
					}
				} else {
					that.jsonObj = {};
				};

				if ((that.utils.isEmptyObject(that.jsonObj)) || (that.dataUpdate == true)) {
					var gblLists = {
						"langList": that.data.globalList.langList,
						"langNameList": that.data.globalList.langNameList,
						"countryList": that.data.globalList.countryList
					};

					that.jsonObj["gblLists"] = gblLists;

					var rqstParams = {
						"countrySite": that.data.request.countrySite,
						"lastName": that.data.request.lastName,
						"bannerHtml": that.data.request.bannerHtml,
						"IS_USER_LOGGED_IN": that.IS_USER_LOGGED_IN
					};
					that.jsonObj["rqstParams"] = rqstParams;

					var labels = {
						"tx_merciapps_lbl_str_pref_last_name": that.data.labels.tx_merciapps_lbl_str_pref_last_name,
						"tx_merci_ts_home_UserProfile": that.data.labels.tx_merci_ts_home_UserProfile,
						"tx_merciapps_lbl_str_display_settings": that.data.labels.tx_merciapps_lbl_str_display_settings,
						"tx_merci_text_cont_country": that.data.labels.tx_merci_text_cont_country,
						"tx_merci_text_booking_home_language": that.data.labels.tx_merci_text_booking_home_language,
						"tx_merciapps_lbl_frequent_flyer": that.data.labels.tx_merciapps_lbl_frequent_flyer,
						"tx_merciapps_calendar": that.data.labels.tx_merciapps_calendar,
						"tx_merciapps_version": that.data.labels.tx_merciapps_version,
						"tx_merci_awards_yes": that.data.labels.tx_merci_awards_yes,
						"tx_merci_awards_no": that.data.labels.tx_merci_awards_no,
						"tx_merciapps_settings": that.data.labels.tx_merciapps_settings,
						"tx_merciapps_request_not_processed": that.data.labels.tx_merciapps_request_not_processed,
						"tx_merciapps_remember_search": that.data.labels.tx_merciapps_remember_search,
						"tx_merci_geo_location": that.data.labels.tx_merci_geo_location,
						"tx_merciapps_upgrade": that.data.labels.tx_merciapps_upgrade,
						"tx_merciapps_upgrade_prompt": that.data.labels.tx_merciapps_upgrade_prompt,
						"tx_merciapps_ok": that.data.labels.tx_merciapps_ok,
						"tx_merci_text_info_saved": that.data.labels.tx_merci_text_info_saved,
						"tx_merciapps_lbl_save": that.data.labels.tx_merciapps_lbl_save,
						"tx_merci_text_mail_btncancel": that.data.labels.tx_merci_text_mail_btncancel,
						"tx_merci_change_bkgrd": that.data.labels.tx_merci_change_bkgrd,
						"tx_merciapps_calender_details":that.data.labels.tx_merciapps_calender_details,
						"tx_merciapps_upgrade_details":that.data.labels.tx_merciapps_upgrade_details,
						"tx_merciapps_remember_search_details":that.data.labels.tx_merciapps_remember_search_details,
						"loyaltyLabels": {
							"tx_merci_li_youHave": that.data.labels.loyaltyLabels.tx_merci_li_youHave,
							"tx_merci_li_miles": that.data.labels.loyaltyLabels.tx_merci_li_miles,
							"tx_merci_li_tier": that.data.labels.loyaltyLabels.tx_merci_li_tier,
							"tx_merci_li_hello": that.data.labels.loyaltyLabels.tx_merci_li_hello,
							"tx_merci_li_youOwn": that.data.labels.loyaltyLabels.tx_merci_li_youOwn,
							"tx_merci_li_yourMileage": that.data.labels.loyaltyLabels.tx_merci_li_yourMileage
						}
					};
					that.jsonObj["labels"] = labels;

					if (that.jsonObj.siteParams != undefined) {
						if (that.jsonObj.jsonData != undefined) {
							if (that.jsonObj.jsonData.rememberSearch != undefined) {
								jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.jsonObj.jsonData.rememberSearch);
							} else {
								jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.data.config.siteRetainSearch);
							};
							if (that.jsonObj.jsonData.Calendar != undefined) {
								jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.jsonObj.jsonData.Calendar);
							} else {
								jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.data.config.calendarDisplay);
							};
						} else {
							jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.data.config.siteRetainSearch);
							jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.data.config.calendarDisplay);
						};
					} else {
						jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.data.config.siteRetainSearch);
						jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.data.config.calendarDisplay);
					}

					var siteParams = {
						"enableLoyalty": that.data.config.enableLoyalty,
						"sitePLCompanyName": that.data.config.sitePLCompanyName,
						"siteRememberSearch": that.data.config.siteRetainSearch,
						"calendarDisplay": that.data.config.calendarDisplay,
						"siteIOSStoreLink": that.data.config.siteIOSStoreLink,
						"siteAndroidStoreLink": that.data.config.siteAndroidStoreLink,
						"siteAndroidVersion": that.data.config.siteAndroidVersion,
						"siteiOSVersion": that.data.config.siteiOSVersion,
						"forceUpgradeiPhone": that.data.config.forceUpgradeiPhone, 
						"forceUpgradeAndroid": that.data.config.forceUpgradeAndroid,
						"isGeoLocationSearchEnabled": that.data.config.isGeoLocationSearchEnabled,
						"isChangeBackgroundEnabled": that.data.config.isChangeBackgroundEnabled,
						"appBackgroundImageList": that.data.config.appBackgroundImageList
					};

					jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.data.config.calendarDisplay);
					jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.data.config.siteRetainSearch);
					that.jsonObj["siteParams"] = siteParams;
					that.utils.storeLocalInDevice(merciAppData.DB_SETTINGS, that.jsonObj, "overwrite", "json");
				} else {
					if (that.jsonObj.siteParams != undefined && that.jsonObj.siteParams.siteRememberSearch == "TRUE") {
						if (that.jsonObj.jsonData != undefined) {
							jsonResponse.ui.REMEMBER_SRCH_CRITERIA = that.utils.booleanValue(that.jsonObj.jsonData.rememberSearch);
						};
					};
					if (that.jsonObj.siteParams != undefined && that.jsonObj.siteParams.calendarDisplay == "TRUE") {
						if (that.jsonObj.jsonData != undefined) {
							if (that.jsonObj.jsonData.Calendar != undefined) {
								jsonResponse.ui.CALENDAR_DISPLAY = that.utils.booleanValue(that.jsonObj.jsonData.Calendar);
							} else {
								jsonResponse.ui.CALENDAR_DISPLAY = true;
							}
						};
					};
					if (that.jsonObj.jsonData != undefined && that.jsonObj.jsonData.kfNum != "" && that.jsonObj.jsonData.kfNum != undefined) {
						jsonResponse.ui.FQTVNum = that.jsonObj.jsonData.kfNum;
					};
				};
			});
		},
		morePageDataCreation: function() {
			var that = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_MORE, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						that.jsonObj = JSON.parse(result);
					} else {
						that.jsonObj = (result);
					}
				} else {
					that.jsonObj = {};
				};

				if ((that.utils.isEmptyObject(that.jsonObj)) || (that.dataUpdate == true)) {
					var rqstParams = {
						"countrySite": that.data.request.countrySite,
						"bannerHtml": that.data.request.bannerHtml
					};
					that.jsonObj["rqstParams"] = rqstParams;

					var labels = {
						"tx_merciapps_settings": that.data.labels.tx_merciapps_settings,
						"tx_merciapps_more": that.data.labels.tx_merciapps_more,
						"tx_merci_ts_termsofuse_TermsAndConditions": that.data.labels.tx_merci_ts_termsofuse_TermsAndConditions,
						"tx_merciapps_lbl_str_faq": that.data.labels.tx_merciapps_lbl_str_faq,
						"tx_merciapps_lbl_str_privacy_policy": that.data.labels.tx_merciapps_lbl_str_privacy_policy
					};
					that.jsonObj["labels"] = labels;

					var siteParams = {
						"enableLoyalty": that.data.config.enableLoyalty,
						"homeURL": that.data.config.homeURL,
						"sitePLCompanyName": that.data.config.sitePLCompanyName
					};
					that.jsonObj["siteParams"] = siteParams;

					that.utils.storeLocalInDevice(merciAppData.DB_MORE, that.jsonObj, "overwrite", "json");
				};
			});
		},

		onSettingClick: function() {
			this.utils.showMskOverlay(true);
			if (this.IS_USER_LOGGED_IN == true) {
				var request = {
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
			} else {
				var request = null;
			}
			
			var that = this;
			setTimeout(function() {
				that.moduleCtrl.navigate(request, 'merci-MSetting_A');
			},500);
		},

		isMyProfileEnabled: function() {
			if (this.data.config.enableProfile != undefined && this.data.config.enableProfile.toLowerCase() == "true") {
				if (this.IS_USER_LOGGED_IN == false) {

					return false;
				} else if (this.IS_USER_LOGGED_IN == true) {

					return true;
				}
			}
		},
		onMyProfileClick: function() {
			event.preventDefault();
			if (!this.utils.isEmptyObject(this.data.request.req) && this.data.request.req.ENABLE_EARLY_LOGIN == "YES") {
				rqstParams = this.data.request.reply;
				rqst = this.data.request.req;
				DATE_OF_BIRTH_1 = JSON.stringify(rqstParams.DATE_OF_BIRTH_1);
				var params = 'result=json&TITLE_1=' + rqstParams.TITLE_1 + '&ENABLE_DIRECT_LOGIN=' + rqst.ENABLE_DIRECT_LOGIN + '&ENABLE_EARLY_LOGIN=' + rqst.ENABLE_EARLY_LOGIN + '&USER_ID=' + rqstParams.USER_ID + '&FIRST_NAME_1=' + rqstParams.FIRST_NAME_1 + '&LAST_NAME_1=' + rqstParams.LAST_NAME_1 +
					'&CONTACT_POINT_EMAIL_1_1=' + rqstParams.CONTACT_POINT_EMAIL_1_1 + '&CONTACT_POINT_PHONE_NUMBER=' + rqstParams.CONTACT_POINT_PHONE_NUMBER + '&PASSWORD_1=' + rqstParams.PASSWORD_1 + '&CONTACT_POINT_PHONE_TYPE=' + rqstParams.CONTACT_POINT_PHONE_TYPE +
					'&DATE_OF_BIRTH_1=' + DATE_OF_BIRTH_1 + '&TRAVELLER_TYPE_1=' + rqstParams.TRAVELLER_TYPE_1 + '&IS_USER_LOGGED_IN=' + true + '&PREF_AIR_FREQ_NUMBER_1_1=' + rqstParams.PREF_AIR_FREQ_NUMBER_1_1;
			} else if (!this.utils.isEmptyObject(this.data.request.requestParam) && this.data.request.requestParam.ENABLE_DIRECT_LOGIN == "YES") {
				var rqstParams = this.data.request.requestParam;
				var params = 'result=json&TITLE_1=' + rqstParams.TITLE_1 + '&ENABLE_DIRECT_LOGIN=' + rqstParams.ENABLE_DIRECT_LOGIN + '&ENABLE_EARLY_LOGIN=' + rqstParams.ENABLE_EARLY_LOGIN + '&USER_ID=' + rqstParams.USER_ID + '&FIRST_NAME_1=' + rqstParams.FIRST_NAME_1 + '&LAST_NAME_1=' + rqstParams.LAST_NAME_1 +
					'&CONTACT_POINT_EMAIL_1_1=' + rqstParams.CONTACT_POINT_EMAIL_1_1 + '&CONTACT_POINT_PHONE_NUMBER=' + rqstParams.CONTACT_POINT_PHONE_NUMBER + '&PASSWORD_1=' + rqstParams.PASSWORD_1 + '&CONTACT_POINT_PHONE_TYPE=' + rqstParams.CONTACT_POINT_PHONE_TYPE + '&DATE_OF_BIRTH_1=' + rqstParams.DATE_OF_BIRTH_1 + '&TRAVELLER_TYPE_1=' + rqstParams.TRAVELLER_TYPE_1 + '&IS_USER_LOGGED_IN=' + true +
					'&PAYMENT_TYPE=' + rqstParams.PAYMENT_TYPE + '&PREF_AIR_FREQ_NUMBER_1_1=' + rqstParams.PREF_AIR_FREQ_NUMBER_1_1 + '&PREF_AIR_FREQ_AIRLINE_1_1=' + rqstParams.PREF_AIR_FREQ_AIRLINE_1_1 + '&ITEM_ID_1=' + rqstParams.ITEM_ID_1 + '&TYPE_1=' + rqstParams.TYPE_1 +
					'&GENDER_1=' + rqstParams.GENDER_1 + '&PASSPORT_NUMBER_1_1=' + rqstParams.PASSPORT_NUMBER_1_1 + '&NUMBER_OF_PROFILES=' + rqstParams.NUMBER_OF_PROFILES + '&LIST_ADDRESS_INFORMATION_REGION=' + rqstParams.LIST_ADDRESS_INFORMATION_REGION + '&LIST_ADDRESS_INFORMATION_CITY=' + rqstParams.LIST_ADDRESS_INFORMATION_CITY + '&LIST_ADDRESS_INFORMATION_STATE=' + rqstParams.LIST_ADDRESS_INFORMATION_STATE +
					'&LIST_ADDRESS_INFORMATION_POSTAL_CODE=' + rqstParams.LIST_ADDRESS_INFORMATION_POSTAL_CODE + '&LIST_ADDRESS_INFORMATION_COUNTRY=' + rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY + '&LIST_ADDRESS_INFORMATION_LINE_1=' + rqstParams.LIST_ADDRESS_INFORMATION_LINE_1 + '&LIST_ADDRESS_INFORMATION_LINE_2=' + rqstParams.LIST_ADDRESS_INFORMATION_LINE_2 +
					'&PASSPORT_EXP_DATE_1_1=' + rqstParams.PASSPORT_EXP_DATE_1_1 + '&CONTACT_POINT_PHONE_COUNTRY_CODE=' + rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE + '&CONTACT_POINT_PHONE_AREA_CODE=' + rqstParams.CONTACT_POINT_PHONE_AREA_CODE;
			}
			var request = {
				parameters: params,
				action: 'MDisplayProfile.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onMyProfileClickCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onMyProfileClickCallBack: function(response) {
			console.log(response);
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {
				if (dataId != null && dataId == 'MUserProfile_A') {
					this.utils.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		logInProfile: function(event, args) {
			event.preventDefault();
			var params = 'result=json' + '&ENABLE_EARLY_LOGIN=YES';
			var request = {

				parameters: params,
				action: 'MDirectLoginAction.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onLogInProfileCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onLogInProfileCallBack: function(response, nextUrl) {
			var json = this.moduleCtrl.getModuleData();
			console.log(response);
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			console.log(nextPage);
			if (response.responseJSON.data != null) {
				if (dataId == 'MDL_A') {
					this.utils.extendModuleData(json, response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}

			}
		},

		logOutProfile: function(event, args) {
			event.preventDefault();
			var params = 'result=json';
			var request = {
				parameters: params,
				action: 'MLogoff.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onLogOutCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onLogOutCallBack: function(response) {
			var json = this.moduleCtrl.getModuleData();
			console.log(response);
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			console.log(nextPage);
			if (response.responseJSON.data != null) {
				if (dataId == 'Mindex_A') {
					var data = this.moduleCtrl.getModuleData();
					this.utils.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
					var unwantedData = this.moduleCtrl.getModuleData();
					this.moduleCtrl.navigate(null, nextPage);
					this.IS_USER_LOGGED_IN = response.responseJSON.data.booking.Mindex_A.requestParam.IS_USER_LOGGED_IN;
					this.$refresh();
				}
			}
		},

		onRepeatBookClick: function() {
			var request = {
				IS_SPEED_BOOK: "TRUE",
				TRIP_TYPE: this.data.rebooking.TRIP_TYPE,
				DIRECT_RETRIEVE: 'true',
				ACTION: 'MODIFY',
				DIRECT_RETRIEVE_LASTNAME: this.data.rebooking.lastName,
				REC_LOC: this.data.common.recordLocator
			};
			this.utils.sendNavigateRequest(request, 'MRepeatSearch.action', this);
		},

		onBoardingPassClick: function() {
			
			var that = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
				if (result != null && result != '') {
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					if (!that.utils.isEmptyObject(result)) {
						var json = that.moduleCtrl.getModuleData();
						json.result = result;
						if (!that.utils.isEmptyObject(json.result.boardingPassArray)) {
							/* Navigation will be changed by site parameter*/
							json.navigation = true;
							that.moduleCtrl.navigate(null, 'merci-checkin-MSSCILocalBoardingPassList_A');
						} else {
							that.utils.sendNavigateRequest(null, 'gettripFlow.action', that);
						}
					} else {
						that.utils.sendNavigateRequest(null, 'gettripFlow.action', that);
					}
				} else {
					that.utils.sendNavigateRequest(null, 'gettripFlow.action', that);
				}
			});

		},


		isBoardingPassPresent: function() {
				
			var that = this;
			var isBPpresent = false;

			this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
				if (result != null && result != '') {
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					if (!that.utils.isEmptyObject(result)) {
						var json = that.moduleCtrl.getModuleData();
						json.result = result;
						if (!that.utils.isEmptyObject(json.result.boardingPassArray)) {
							isBPpresent = true;
						} 
					}
				}
			});

			return isBPpresent;
		},

		/**
		 * function used to navigate to external URLs
		 * @param event JSON object with event information
		 * @param args JSON object with required parameters
		 */
		onCustomButtonClick: function(event, data) {

			if (data.action != null 
				&& data.action != 'click'){
				
				var popupData = {};
				if (data.actionData != null) {
					try{
						popupData = JSON.parse(data.actionData) ;
					}catch(e){}
				}
				
				popupData.showHeader = true ;
				popupData.showBack = true;

				if(popupData!=null && popupData.URL == null && popupData.url != null){
					popupData.URL = popupData.url ;
				}

				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				this.$json.setValue(popup, 'data', popupData);

				this.$json.setValue(popup, 'settings', {
					macro: "displayURLHTMLPopup"
				});

				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				
				// this function can be used by community app
				// or custom script to run script on click of custom buttons
				if (typeof beforeCustomLinkLoad == 'function') {
					beforeCustomLinkLoad(popupData);
				}

				this.moduleCtrl.navigate({forceReload: true}, 'Popup');
				return;
			}

			if (!this.utils.isRequestFromApps()) {
				window.location = data.url;
			} else {
				if (typeof navigator.app != "undefined") {
					// Supported by PhoneGap - Android
					navigator.app.loadUrl(data.url, {
						openExternal: true
					});
				} else {
					// Using inappbrowser PhoneGap plugin. Workaround for iOS
					window.open(data.url, '_system');
				}
			}
		},

		/**
		 * function to check if dynamic home page is enabled
		 * @return boolean
		 */
		_isDynamicHomePage: function() {
			return this.data.isDynamicHome && !this.data.isFromMenu;
		}
	}
});