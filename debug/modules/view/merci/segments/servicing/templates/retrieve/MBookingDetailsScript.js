Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MBookingDetailsScript",
	$dependencies: [
		'aria.utils.Date',
		'aria.utils.Json',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.URLManager'
	],

	$statics: {
		MEAL_CODE: 'MEA',
		SEAT_CODE: 'RQST',
		SEAT_ASSIGN_INPUT: 'PREF_AIR_SEAT_ASSIGMENT'
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		pageObjBooking = this;
		this.passengerDetails = {};
		this.passengerDetails.Loaded = false;
		this.srvcDetails = {};
		this.srvcDetails.loaded = false;

		var isTripAddedToCal = false;
		this.selectedPaxId = 0;
		pageObjBooking.printUI = false;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
		this.emailData = {
			successMessage: 'Email has been sent.',
			errorMessage: 'Error has  occured while sending email.'
		};
		this.smsData = {
			successMessage: 'SMS has been sent.',
			errorMessage: 'Error has occured while sending sms.'
		};
		this.__clearShareNotification();
	},

	$prototype: {

		$dataReady: function() {

			this.storage = false;
			if (this.moduleCtrl.getModuleData().MBookingDetails 
					&& this.moduleCtrl.getModuleData().MBookingDetails.config.sameConfRet 
					&& this.moduleCtrl.getModuleData().MBookingDetails.config.sameConfRet.toLowerCase() == "true"){
				pageObjBooking.utils.showMskOverlay(true);
			}
			if (this.utils.isRequestFromApps() == true) {
				this.jsonMTrip = this.moduleCtrl.getModuleData();
				this.mTrip = this.jsonMTrip.flowFromTrip;
				this.key = this.jsonMTrip.pnr_Loc;
				this.isTripAddedToCal = false;

				if (this.mTrip != "mTrips") {
					this.model = this.moduleCtrl.getModuleData().MBookingDetails;
					this.retrieveData = this.moduleCtrl.getModuleData();
					var recLoc = this.retrieveData.MBookingDetails.reply.tripplan.pnr.REC_LOC;
					this.printUI = true;
					pageObjBooking.MPassengerDetails = this.retrieveData.MPassengerDetails;
					this.initializeOtherVariables();
				} else {
					if (this.key != undefined || this.key != null) {
						pageObjBooking.utils.getStoredItemFromDevice(this.key, function(result) {
							if (result && result != "" && result !="{}") {
								if (typeof(result) === 'string') {
									retrieveJson = JSON.parse(result);
								} else {
									retrieveJson = (result);
								}
								pageObjBooking.flightData = retrieveJson.MFlightDetails;
								pageObjBooking.MCarDetails = retrieveJson.MCarDetails;
								pageObjBooking.MHotelDetails = retrieveJson.MHotelDetails;
								pageObjBooking.model = retrieveJson.MBookingDetails;
								pageObjBooking.MPassengerDetails = retrieveJson.MPassengerDetails;
								pageObjBooking.storage = true;
							}else{
								recLocNo=pageObjBooking.jsonMTrip.recLocNo;
								last_Name=pageObjBooking.jsonMTrip.last_Name;
								pageObjBooking.jsonMTrip.flowFromTrip = null;
								var params = {
									ACTION: "MODIFY",
									DIRECT_RETRIEVE: "true",
									TYPE: "retrieve",
									NEW_RETRIEVE: "Y",
									result: "json",
									FROM_PNR_RETRIEVE: "true",
									REC_LOC: recLocNo,
									DIRECT_RETRIEVE_LASTNAME: last_Name

								};
								var action = 'MPNRValidate.action';
								pageObjBooking.utils.sendNavigateRequest(params, action, pageObjBooking);
								pageObjBooking.utils.showMskOverlay(false);
							};
							pageObjBooking.printUI = true;
							pageObjBooking.initializeOtherVariables();
							pageObjBooking.$refresh();
						});

					};
				};
			} else {
				this.model = this.moduleCtrl.getModuleData().MBookingDetails;
				this.printUI = true;
				pageObjBooking.MPassengerDetails = this.moduleCtrl.getModuleData().MPassengerDetails;
				this.initializeOtherVariables();
				
			};
			
			if(pageObjBooking.utils.isEmptyObject(this.moduleCtrl.getModuleData().MPassengerDetailsBackup)){
					this.moduleCtrl.getModuleData().MPassengerDetailsBackup = this.moduleCtrl.getModuleData().MPassengerDetails;
			};
		},

		initializeOtherVariables: function() {

			pageObjBooking.config = pageObjBooking.model.config;
			pageObjBooking.labels = pageObjBooking.model.labels;
			pageObjBooking.globalList = pageObjBooking.model.globalList;
			pageObjBooking.request = pageObjBooking.model.request;
			pageObjBooking.reply = pageObjBooking.model.reply;
			pageObjBooking.tripplan = pageObjBooking.model.reply.tripplan;
			pageObjBooking.emailTrip = pageObjBooking.model.emailTrip;

			pageObjBooking.infoMsgs = new Array();
			pageObjBooking.data.errors = pageObjBooking.utils.readBEErrors(pageObjBooking.reply.errors);
			pageObjBooking.__initUIMessages();

			/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
			if (pageObjBooking.config.sadadpayment == 'TRUE') {
				if (pageObjBooking.reply.bookingPanel.onHoldPnrBean.sadadPaymentMade == false && pageObjBooking.reply.bookingPanel.onHoldPnrBean.sadadPaymentInd == true) {
					pageObjBooking.sadad = true;
					var opcDate = pageObjBooking._getOpcDateSadad();
					var finalWarningMessage = pageObjBooking._getFormattedDateString(opcDate);
					pageObjBooking.__addMsg("info", finalWarningMessage);
				} else {
					pageObjBooking.sadad = false;
				}
			} else {
				pageObjBooking.sadad = false;
			}
			if (pageObjBooking.storage == false) {
				pageObjBooking.onTripListParameters();
			}
			/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- END*/
		},

		$viewReady: function() {
			$('body').attr('id', 'myTrips');
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			if (bp[14] != null && bp[14] != '') {
				this.utils.appCallBack(this.model.config.appCallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MBookingDetails",
						data:this.data
					});
			}
		},

		$displayReady: function() {

			if (pageObjBooking.printUI == true) {
				this.confPageShareContentTitle = this.labels.tx_merci_text_sm_title;
				this.confPageShareContentCaption = this.labels.tx_merci_text_sm_caption;
				this.confPageShareImageURL = this.labels.tx_merci_text_sm_airlines_image_url;
				this.confPageShareContentDesc = this.getShareData();
				this.confPageShareContentLink = this.labels.tx_merci_text_sm_airlines_link;
				var baseparams = modules.view.merci.common.utils.URLManager.getBaseParams();

				var headerButton = {};

				headerButton.scope = this;

				if (this.utils.isRequestFromApps() == true) {
					var arr = [];
					var arrShare = [];
					if (this.config.siteAllowTripPhoto.toLowerCase() == "true") {
						arr.push("tripPhotoButton");
						arr.push("takePhotoButton");
					};

					arr.push("rfrshButton");

					if (this.config.siteAllowCalendar.toLowerCase() == "true") {
						if (jsonResponse.ui.CALENDAR_DISPLAY == undefined || pageObjBooking.utils.booleanValue(jsonResponse.ui.CALENDAR_DISPLAY) == true) {
							arr.push("calendarButton");
							var calendarIcon = pageObjBooking.utils.booleanValue(pageObjBooking.utils.getStoredItem((pageObjBooking.request.REC_LOC).toUpperCase() + "_CAL"));	
							headerButton.showCalendar = calendarIcon;
						}
					};

					if (this.config.siteAllowSocialMedia.toLowerCase() == "true") {
						arr.push("shareButton");
					};

					if (this.config.siteAllowEmail.toLowerCase() == "true") {
						arrShare.push(["EMAIL", "mail", "icon-email"]);
					};

					if (this.config.siteAllowSMS.toLowerCase() == "true") {
						arrShare.push(["SMS", "sms", "icon-sms"]);
					};

					if (this.config.siteAllowFacebook.toLowerCase() == "true") {
						arrShare.push(["FACEBOOK", "fb", "icon-facebook"]);
					};

					if (this.config.siteAllowTwitter.toLowerCase() == "true") {
						arrShare.push(["TWITTER", "tw", "icon-twitter"]);
					};

					if (this.config.siteAllowLinkedIn.toLowerCase() == "true") {
						arrShare.push(["LINKEDIN", "li", "icon-linkedin"]);
					};

					if (this.config.siteAllowGooglePlus.toLowerCase() == "true") {
						arrShare.push(["GOOGLEPLUS", "gp", "icon-google-plus"]);
					};

					headerButton.shreButton = arrShare;
					headerButton.button = arr;

					//var header = this.moduleCtrl.getModuleData().headerInfo;
					this.moduleCtrl.setHeaderInfo({
						title: this.labels.tx_merci_text_mybook_myflight,
						bannerHtmlL: this.request.bannerHtml,
						homePageURL: this.config.homeURL,
						showButton: true,
						headerButton: headerButton,
						manualBackURL: baseparams[0]+"://"+baseparams[1]+":"+baseparams[2]+baseparams[10]+"/"+baseparams[4]+"/MWelcome.action?"+baseparams[8]
					});

				} else {
					var arr = [];
					var arrShare = [];



					if (this.config.siteAllowSocialMedia.toLowerCase() == "true") {
						arr.push("shareButton");
					}

					if (this.config.siteAllowFacebook.toLowerCase() == "true") {
						arrShare.push(["FACEBOOK", "fb", "icon-facebook"]);
					};

					if (this.config.siteAllowGooglePlus.toLowerCase() == "true") {
						arrShare.push(["GOOGLEPLUS", "gp", "icon-google-plus"]);
					};

					if (this.config.siteAllowLinkedIn.toLowerCase() == "true") {
						arrShare.push(["LINKEDIN", "li", "icon-linkedin"]);
					}

					if (this.config.siteAllowTwitter.toLowerCase() == "true") {
						arrShare.push(["TWITTER", "tw", "icon-twitter"]);
					};

					if (this.config.siteAllowEmail.toLowerCase() == "true") {
						arrShare.push(["EMAIL", "mail", "icon-email"]);
					};

					if (this.config.siteAllowSMS.toLowerCase() == "true") {
						arrShare.push(["SMS", "sms", "icon-sms"]);
					};
					headerButton.shreButton = arrShare;

					headerButton.button = arr;
					var current = this;
					var googleAPIKey = this.config.siteGooglePlusAPIKey;
					
					if (window.location.protocol == 'http:') {
						googleAPIKey = this.config.siteGooglePlusSecretKey;
					}
					headerButton.shareData = {
						title: current.confPageShareContentTitle,
						caption: current.confPageShareContentCaption,
						link: current.confPageShareContentLink,
						description: current.confPageShareContentDesc,
						apiKey: googleAPIKey
					};
					//var header = this.moduleCtrl.getModuleData().headerInfo;
					this.moduleCtrl.setHeaderInfo({
						title: this.labels.tx_merci_text_mybook_myflight,
						bannerHtmlL: this.request.bannerHtml,
						homePageURL: this.config.homeURL,
						showButton: true,
						headerButton: headerButton,
						manualBackURL: baseparams[0]+"://"+baseparams[1]+":"+baseparams[2]+baseparams[10]+"/"+baseparams[4]+"/MMyTripChkCookie.action?"+baseparams[8],
						googlePlusData: {
							title: current.confPageShareContentTitle,
							caption: current.confPageShareContentCaption,
							link: current.confPageShareContentLink,
							description: current.confPageShareContentDesc,
							apiKey: googleAPIKey
						}

					});
					$('#share-buttons-group li:not(.btn-close) button').click(function() {
						$(".msk").show();
						$('#share-buttons-group button').removeClass("active");
						$(this).addClass("active");
						$(".panel.share-slider").attr("aria-expanded", "true");
						var title = $(this).attr("data-title")
						$(".panel.share-slider h1").html("Share <strong>" + title + "</strong>");
						var type = $(this).attr("data-type")
						$(".share-content").hide();
						$(".share-content.share-" + type).show();
					});

					$('.share-content footer button:not(.secondary)').click(function() {
						$(".msk").hide();
						$("div.panel.share-slider").hide();
						$('#share-buttons-group li:not(.btn-close) button').removeClass("active");
						$(".panel.share-slider").attr("aria-expanded", "false");

					});

					$('.share-content footer button.secondary').click(function() {
						$(".msk").hide();
						$("div.panel.share-slider").hide();
						$('#share-buttons-group li:not(.btn-close) button').removeClass("active");
						$(".panel.share-slider").attr("aria-expanded", "false");

					});
				};

				document.getElementsByTagName('body')[0].className = "pnr-retrieve over trip";
				var isMissing = pageObjBooking.__checkMissingAPIS();
				if (isMissing) {
					this.utils.showMskOverlay(false);
					document.getElementById("apisText").style.display = 'block';
					this.apisMissing = 'TRUE';
				} else {
					this.apisMissing = 'FALSE';
				}
			};
			var po = document.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = 'https://apis.google.com/js/client:plusone.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);
		},

		__checkMissingAPIS: function() {
			for (i = 0; i < pageObjBooking.tripplan.travellers.length; i++) {
				var apisSectionBean = pageObjBooking.tripplan.travellers[i].identityInformation.apisSectionBean;
				if (apisSectionBean != null) {
					isInfoComplete = pageObjBooking.__checkPrmryTravelDoc(apisSectionBean.listPrimaryTravelDocuments) && pageObjBooking.__checkScndryTravelDoc(apisSectionBean.listVisaTravelDocuments) && pageObjBooking.__checkKnwtRednDoc(apisSectionBean.listKnwtTravelDocuments) && pageObjBooking.__checkKnwtRednDoc(apisSectionBean.listRednTravelDocuments) && pageObjBooking.__checkDestResAddrDoc(apisSectionBean.listDestinationAddresses) && pageObjBooking.__checkDestResAddrDoc(apisSectionBean.listResidenceAddresses);
					if (isInfoComplete && pageObjBooking.tripplan.travellers[i].infant) {
						var apisSectionBean = pageObjBooking.tripplan.travellers[i].infant.apisSectionBean;
						isInfoComplete = pageObjBooking.__checkPrmryTravelDoc(apisSectionBean.listPrimaryTravelDocuments) && pageObjBooking.__checkScndryTravelDoc(apisSectionBean.listVisaTravelDocuments) && pageObjBooking.__checkKnwtRednDoc(apisSectionBean.listKnwtTravelDocuments) && pageObjBooking.__checkKnwtRednDoc(apisSectionBean.listRednTravelDocuments) && pageObjBooking.__checkDestResAddrDoc(apisSectionBean.listDestinationAddresses) && pageObjBooking.__checkDestResAddrDoc(apisSectionBean.listResidenceAddresses);
					}
					if (!isInfoComplete) {
						return true;
					}
				}
			}
			return false;
		},
		__checkPrmryTravelDoc: function(data) {
			for (j = 0; j < data.length; j++) {
				var identityDocument = data[j].identityDocument;
				if (data[j].structureIdAttributes.mandatory == 'Y') {
					return this.__checkData(identityDocument.middleNameAttributes.PSPTRequirement, identityDocument.middleName, 'MANDATORY') && this.__checkData(identityDocument.genderAttributes.PSPTRequirement, identityDocument.gender, 'MANDATORY') && this.__checkData(identityDocument.dateOfBirthAttributes.mandatory, identityDocument.dateOfBirth, 'Y') && this.__checkData(identityDocument.nationalityAttributes.PSPTRequirement, identityDocument.nationality, 'MANDATORY') && this.__checkData(identityDocument.documentTypeAttributes.PSPTRequirement, identityDocument.documentType, 'MANDATORY') && this.__checkData(identityDocument.documentNumberAttributes.mandatory, identityDocument.documentNumber, 'Y') && this.__checkData(identityDocument.issuingCountryAttributes.mandatory, identityDocument.issuingCountry, 'Y') && this.__checkData(identityDocument.expiryDateAttributes.mandatory, identityDocument.expiryDate, 'Y');
				}
			}
			return true;
		},
		__checkScndryTravelDoc: function(data) {
			for (var docs in data) {
				var identityDocument = data[docs].identityDocument;
				if (data[docs].structureIdAttributes.mandatory == 'Y') {
					return this.__checkData(identityDocument.documentNumberAttributes.mandatory, identityDocument.documentNumber, 'Y') && this.__checkData(identityDocument.placeOfIssuingAttributes.mandatory, identityDocument.placeOfIssuing, 'Y') && this.__checkData(identityDocument.issueDateAttributes.mandatory, identityDocument.issueDate, 'Y') && this.__checkData(identityDocument.placeOfBirthAttributes.mandatory, identityDocument.placeOfBirth, 'Y') && this.__checkData(identityDocument.applicableCountryAttributes.mandatory, identityDocument.applicableCountry, 'Y');
				}
			}
			return true;
		},
		__checkKnwtRednDoc: function(data) {
			for (var docs in data) {
				var identityDocument = data[docs].identityDocument;
				if (data[docs].structureIdAttributes.mandatory == 'Y') {
					return this.__checkData(identityDocument.documentNumberAttributes.mandatory, identityDocument.documentNumber, 'Y') && this.__checkData(identityDocument.applicableCountryAttributes.mandatory, identityDocument.applicableCountry, 'Y');
				}
			}
			return true;
		},
		__checkDestResAddrDoc: function(data) {
			for (var docs in data) {
				var addressBean = data[docs].addressBean;
				var identityDocument = data[docs].identityDocument;
				if (data[docs].structureIdAttributes.mandatory == 'Y') {
					return this.__checkData(addressBean.firstLineAttributes.mandatory, addressBean.firstLineAttributes, 'Y') && this.__checkData(addressBean.cityAttributes.mandatory, addressBean.city, 'Y') && this.__checkData(addressBean.stateAttributes.mandatory, addressBean.state, 'Y') && this.__checkData(addressBean.zipCodeAttributes.mandatory, addressBean.zipCode, 'Y') && this.__checkData(addressBean.countryAttributes.mandatory, addressBean.country, 'Y');
				}
			}
			return true;
		},
		__checkData: function(firstCheck, secondCheck, check) {
			if (firstCheck == check) {
				if (secondCheck == null) {
					return false;
				}
				return true;
			}
			return true;
		},

		/**
		 * Copies the data that is common to BookingDetails and FlightDetails to FlightDetails section
		 */
		shareFlightDetailsData: function() {
			//PTR : PTR 08138939 [Medium]: MeRCI R15 SP1 : IA : Service Code PNR retrieval land on Blank page||PTR 08238135
			if (pageObjBooking.storage != true) {
				pageObjBooking.flightData = this.moduleCtrl.getModuleData().MFlightDetails;
			};
			//var flightData = this.moduleCtrl.getModuleData().MFlightDetails;
			var jsonRec = this.getRecLocLname();
			pageObjBooking.flightData.config.merciServiceCatalog = this.config.merciServiceCatalog;
			pageObjBooking.flightData.config.allowPaxTypes = this.config.allowPaxTypes;
			pageObjBooking.flightData.labels.tx_pltg_pattern_TravellerNameWithTitle = this.labels.tx_pltg_pattern_TravellerNameWithTitle;
			pageObjBooking.flightData.labels.tx_pltg_pattern_TravellerName = this.labels.tx_pltg_pattern_TravellerName;
			pageObjBooking.flightData.labels.paxTypes = this.labels.paxTypes;
			pageObjBooking.flightData.request.DIRECT_RETRIEVE_LASTNAME = jsonRec.lastName;
			pageObjBooking.flightData.request.REC_LOC = jsonRec.recLoc;

			pageObjBooking.flightData.request.DISPLAY_OTHER_PAX = this.tripplan.pnr.displayOtherPax;
			pageObjBooking.flightData.request.LAST_NAMES = this.tripplan.pnr.lastNames;

			pageObjBooking.flightData.reply.serviceCategories = this.reply.serviceCategories;
			pageObjBooking.flightData.reply.pageTicket = this.reply.pageTicket;
			pageObjBooking.flightData.reply.tripplan.travellers = this.tripplan.travellers;

			if (this.utils.isRequestFromApps() == true) {
				if (pageObjBooking.mTrip != "mTrips") {
					pageObjBooking.retrieveData = new Object();
					pageObjBooking.retrieveData.MBookingDetails = pageObjBooking.jsonMTrip.MBookingDetails;
					pageObjBooking.retrieveData.MFlightDetails = pageObjBooking.flightData;
					pageObjBooking.retrieveData.MHotelDetails = pageObjBooking.jsonMTrip.MHotelDetails;
					pageObjBooking.retrieveData.MCarDetails = pageObjBooking.jsonMTrip.MCarDetails;
					pageObjBooking.retrieveData.MPassengerDetails = pageObjBooking.MPassengerDetails;

					var recLoc = pageObjBooking.retrieveData.MBookingDetails.reply.tripplan.pnr.REC_LOC;
					var key = recLoc + "_" + merciAppData.DB_TRIPDETAIL;
					pageObjBooking.utils.getStoredItemFromDevice(key, function(result) {
						if (typeof result === 'string') {
							if (result != '') {
								result = JSON.parse(result);
							}
						}
						if (result == null || result == "" || pageObjBooking.utils.isEmptyObject(result)) {
							pageObjBooking.utils.storeLocalInDevice(key, pageObjBooking.retrieveData, "overwrite", "json");
							if (pageObjBooking.jsonMTrip.MGetTrip != undefined || pageObjBooking.mTrip != null) {
								if (pageObjBooking.jsonMTrip.MGetTrip != undefined && pageObjBooking.jsonMTrip.MGetTrip.reply.errors != null) {
									pageObjBooking.jsonMTrip.MGetTrip.reply.errors = {};
								}
								pageObjBooking.utils.storeLocalInDevice(merciAppData.DB_GETTRIP, pageObjBooking.jsonMTrip.MGetTrip, "overwrite", "json");
							}
						}
					});
				}
			}
		},

		/**
		 * Event handler when the users clicks on "Passenger info' button
		 */
		showPaxDetails: function(evt) {
			var jsonRec = this.getRecLocLname();
			var params = {
				DIRECT_RETRIEVE: "true",
				ACTION: 'MODIFY',
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				finalValidationList: this.request.finalValidationList,
				displayAlert: this.request.displayAlert,
				DIRECT_RETRIEVE_LASTNAME: jsonRec.lastName,
				REC_LOC: jsonRec.recLoc,
				PAGE_TICKET: this.reply.pageTicket,
				ISAPISMISSING: this.apisMissing,
				IS_USER_LOGGED_IN: this.request.IS_USER_LOGGED_IN
			};

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14] != ''  || pageObjBooking.utils.isRequestFromApps() ) {
				this.utils.sendNavigateRequest(params, 'MGetTravellerDetail.action', this);
			} else {
				this.utils.sendNavigateRequest(params, 'MTravellerDetails.action', this);
			}
		},

		/**
		 * Event handler when the users clicks on "Services' button
		 */
		showServicesDetails: function(evt) {
			/* if(document.getElementById("servicesTab") != null && document.getElementById("servicesTab").getAttribute("class") == "navigation active") {
				return;
			} else {
				document.getElementById("paxTabletTab").setAttribute("class", "navigation");
				document.getElementById("servicesTab").setAttribute("class", "navigation active");
			} */

			var jsonRec = this.getRecLocLname();
			if (this.sadad != true) {
				if (!this.utils.isEmptyObject(this.getServicesBookmarkForRecLoc(jsonRec.recLoc))) {
					var bookmark = this.getServicesBookmarkForRecLoc(jsonRec.recLoc);
					var basket = JSON.stringify(bookmark.basket);
					var recordLoc = bookmark.REC_LOC;
					var lastName = bookmark.DIRECT_RETRIEVE_LASTNAME;
					var params = {
						BASKET_OF_SERVICES: basket,
						REC_LOC: recordLoc,
						DIRECT_RETRIEVE_LASTNAME: lastName,
						DIRECT_RETRIEVE: true,
						ACTION: "MODIFY",
						FROM_PAX: true
					};
					this.utils.sendNavigateRequest(params, 'MBookmarkServiceRetrieve.action', this);
				} else {
					var params = {
						DIRECT_RETRIEVE: 'true',
						ACTION: 'MODIFY',
						finalValidationList: this.request.finalValidationList,
						displayAlert: this.request.displayAlert,
						DIRECT_RETRIEVE_LASTNAME: jsonRec.lastName,
						REC_LOC: jsonRec.recLoc,
						PAGE_TICKET: this.reply.pageTicket
					};

					this.utils.sendNavigateRequest(params, 'MGetServiceCatalogFromCONF.action', this);
				}


			}
		},
		getRecLocLname: function() {
			var json = {
				recLoc: "",
				lastName: ""
			};
			if (!this.utils.isEmptyObject(this.request.REC_LOC)) {
				json.recLoc = this.request.REC_LOC;
			} else {
				json.recLoc = this.reply.tripplan.pnr.REC_LOC;
			}
			if (!this.utils.isEmptyObject(this.request.DIRECT_RETRIEVE_LASTNAME)) {
				json.lastName = this.request.DIRECT_RETRIEVE_LASTNAME;
			} else {
				json.lastName = this.reply.tripplan.primaryTraveller.identityInformation.lastName;
			}
			return json;
		},

		/**
		 * Assembles the name elements for display
		 * @param paxType: PTC
		 * @param paxIdy: passenger identity info object
		 */
		formatName: function(paxType, paxIdy) {
			return this.utils.formatName(paxType,
				paxIdy.titleName, paxIdy.firstName, paxIdy.lastName,
				this.utils.booleanValue(this.config.allowPaxTypes), this.labels);
		},

		__initUIMessages: function() {
			this.__initRebookingMessages();
			this.__initNewContactMessage();
			this.__initMilesInsufficientMessages();
		},

		__initRebookingMessages: function() {
			var allowATC = true;

			var isFopPaypalError = this.utils.booleanValue(this.reply.bookingPanel.isFopPaypalError);
			var isFopAlipayError = this.utils.booleanValue(this.reply.bookingPanel.isFopAlipayError);
			var isFopCashMilesError = this.utils.booleanValue(this.reply.bookingPanel.isFopCashMilesError);

			if (this.utils.booleanValue(this.config.rebookingEnabled) && this.utils.booleanValue(this.config.rebookMsgEnabled)) {

				if (!this.utils.booleanValue(this.reply.bookingPanel.isTripInPast) && !this.utils.booleanValue(this.reply.bookingPanel.isRebooking)) {


					if (isFopPaypalError)
						this.__addMsg("info", this.labels.tx_merci_atc_dsbl_paypal_msg);
					else if (isFopCashMilesError)
						this.__addMsg("info", this.labels.tx_merci_atc_dsbl_cashmiles_msg);
					else if (isFopAlipayError)
						this.__addMsg("info", this.labels.tx_merci_atc_dsbl_alipay_msg);
					else
						this.__addMsg("info", this.labels.tx_merci_fare_rules_change_flight_error);
					allowATC = false;
				}

				if (this.utils.booleanValue(this.reply.bookingPanel.isRebooking) && this.utils.booleanValue(this.reply.bookingPanel.hasInfant) && !this.utils.booleanValue(this.config.infantRebookingEnabled)) {
					this.__addMsg("info", this.labels.tx_merci_atc_dsbl_infant_msg);
					allowATC = false;
				}
			}
			if (allowATC && this.utils.booleanValue(this.config.atcWaiverEnabled) && this.utils.booleanValue(this.reply.bookingPanel.displayWaiverMessage) && this.utils.booleanValue(this.config.displayWaiverMessage)) {
				this.__addMsg("info", this.labels.tx_merci_text_waiver_message);
			}
		},

		__initNewContactMessage: function() {
			if (this.utils.booleanValue(this.config.newContactDisplay) && !this.utils.booleanValue(this.reply.isSeatError) && !this.utils.isEmptyObject(this.request.updateInfoSuccess)) {
				var message = this.labels.uiErrors[this.request.updateInfoSuccess];
				if (message != null) {
					var info = this.utils.convertErrorFromBean(this.labels.uiErrors[this.request.updateInfoSuccess])
					this.__addMsg("info", info.TEXT);
				}
			}
		},

		__initMilesInsufficientMessages: function() {
			if (this.model.reply.pnrStatusCode == 'P' || this.model.reply.pnrStatusCode == 'HL') {
				if (this.utils.booleanValue(this.reply.bookingPanel.isAwardPNR) &&
					this.utils.booleanValue(this.config.siteEnableWaitlistPNR)) {
					var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
					var miles = 0;
					var kf_miles = this.getMiles();
					if (!this.utils.isEmptyObject(kf_miles) && !this.utils.isEmptyObject(this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE) && this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE.length > 0) {
						miles = parseInt(kf_miles) - parseInt(this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE[0].MILES_COST);
					}
					if (miles <= 0) {
						var miles_value = (-1) * miles;
						var mesg = this.labels.tx_merci_awards_insufficient_miles1 + "" + this.labels.tx_merci_awards_insufficient_miles2 + " " + miles_value + " " + this.labels.tx_merci_awards_insufficient_miles3 + " " + this.labels.tx_merci_awards_go_online;
						this.__addMsg("info", mesg);
					}
				}
			}
		},

		__addMsg: function(type, msg) {
			// create JSON and append to errors
			var message = {
				'TEXT': msg
			};
			// if errors is empty
			if (type == "info") {
				this.infoMsgs.push(message);
			} else {
				if (this.data.errors == null) {
					this.data.errors = new Array();
				}
				this.data.errors.push(message);
			}
		},

		/** Function to toggle the add trip to calendar button */
		toggleCalBtn: function(ATArgs, args) {
			if (document.getElementById("appCallId").style.display == 'none') {
				document.getElementById("appCallId").style.display = 'block';
			} else {
				document.getElementById("appCallId").style.display = 'none';
			}
			this.utils.toggleClass(document.getElementById("confCal"), "datepicker");
			this.utils.toggleClass(document.getElementById("appCalTog"), "active");
		},

		/** Function to control adding and viewing trip to calendar */
		confAppcallback: function(ATArgs, args) {
			/* Code to view trip in calendar (appcallback+"://?flow=searchpage/calendar_day="+eve) */
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (this.isTripAddedToCal && !(base[14] != null && base[14] != '')) {
				var itineraries = this.flightData.reply.tripplan.air.itineraries;

				var fltNum = "";
				var beginLoc = "";
				var beginDate = "";
				var endLoc = "";
				var endDate = "";

				if (itineraries != null) {
					var bItinerary = itineraries[0];

					fltNum = (bItinerary.segments[0].airline != null ? bItinerary.segments[0].airline.code : "") + bItinerary.segments[0].flightNumber;

					beginLoc = bItinerary.beginLocation.cityName;
					beginDate = this.getDateInyyyyMMddhhmm(bItinerary.beginDate);

					endLoc = bItinerary.endLocation.cityName;
					endDate = this.getDateInyyyyMMddhhmm(bItinerary.endDate);
				}

				var callbckStr = fltNum + "&" + beginLoc + "&" + beginDate + "&" + endLoc + "&" + endDate;

				this.utils.appCallBack(this.model.config.appCallback, "://?flow=searchpage/calendar_day=" + callbckStr);
			} else {
				/* Code to add trip to calendar (appcallback+"://?flow=searchpage/add_to_calendar="+pnr) */
				if (args.pnrLoc != '') {
					this.utils.appCallBack(this.model.config.appCallback, "://?flow=searchpage/add_to_calendar=" + args.pnrLoc);
					document.getElementById("confCal").innerHtml = this.model.labels.tx_merciapps_view_trip_in_calendar;

					this.isTripAddedToCal = true;
				}
			}
		},

		getDateInyyyyMMddhhmm: function(dValue) {
			if (dValue != null && dValue != "") {
				//var dateValue = new Date(dValue);
				var dateValue =  new Date(dValue).format('yyyymmdd-HHMM').toString();
				return dateValue;
//				var yr = dateValue.getFullYear();
//				var mth = dateValue.getMonth();
//				var dte = dateValue.getDate();
//				var hrs = dateValue.getHours();
//				var mins = dateValue.getMinutes();
//
//				return "" + yr + (mth.length == 1 ? "0" + mth : mth) + (dte.length == 1 ? "0" + dte : dte) + "-" + (hrs.length == 1 ? "0" + hrs : hrs) + (mins.length == 1 ? "0" + mins : mins);
			}

			return "";
		},

		/* Function to set hidden input tag - ret_pnr_data of MAria_index.html for Apps */
		fetchAppsTripData: function() {
			var jsonRec = this.getRecLocLname();
			var tripStr = "";
			tripStr += jsonRec.recLoc;
			tripStr += "|";
			tripStr += jsonRec.lastName;
			tripStr += "|";

			var itineraries = this.flightData.reply.tripplan.air.itineraries;

			var bItinerary = itineraries[0];


			tripStr += bItinerary.beginLocation.cityName;
			tripStr += "|";
			tripStr += bItinerary.beginLocation.locationCode;
			tripStr += "|";

			if (itineraries.length > 1) {
				var eItinerary = itineraries[itineraries.length - 1];
				if (eItinerary.endLocation.locationCode == bItinerary.beginLocation.locationCode) {
					tripStr += eItinerary.beginLocation.cityName;
					tripStr += "|";
					tripStr += eItinerary.beginLocation.locationCode;
				} else {
					tripStr += eItinerary.endLocation.cityName;
					tripStr += "|";
					tripStr += eItinerary.endLocation.locationCode;
				}
			} else if (itineraries.length == 1) {
				tripStr += bItinerary.endLocation.cityName;
				tripStr += "|";
				tripStr += bItinerary.endLocation.locationCode;
			}

			tripStr += "|";
			tripStr += bItinerary.beginDate;

			if (itineraries.length > 1) {
				tripStr += "|";
				tripStr += eItinerary.beginDate;
			}

			return tripStr;
		},

		fetchAppsCalendarData: function() {
			var calendarJSON = this.getAddToCalendarJson();
			return encodeURIComponent(JSON.stringify(calendarJSON));
		},

		getTrip: function(evt) {
			this.infoMsgs = [];
			this.data.errors = [];
			var passengerName = document.getElementById("DIRECT_RETRIEVE_LASTNAME").value;
			if (passengerName == "") {
				this.__addMsg('err', this.labels.uiErrors[2130018].localizedMessage + " (" + this.labels.uiErrors[2130018].errorid + ")");
				aria.utils.Json.setValue(this.data, 'errorOccured', true);
			} else {
				passengerName = passengerName.replace("'", " ");
				document.getElementById("DIRECT_RETRIEVE_LASTNAME").value = passengerName;
				this.__otherPaxRetrieve(passengerName);
			}
		},

		__otherPaxRetrieve: function(passengerName) {
			var params = 'SERVICE_PRICING_MODE=INIT_PRICE' + '&ACTION=MODIFY' + '&DIRECT_RETRIEVE=true' + '&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED' + '&result=json&PAGE_TICKET=' + this.reply.pageTicket + '&REC_LOC=' + this.tripplan.pnr.REC_LOC + '&DIRECT_RETRIEVE_LASTNAME=' + passengerName;

			var request = {
				action: 'MPNRValidate.action',
				parameters: params,
				isCompleteURL: false,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onPnrValidateResponse,
					args: params,
					scope: this
				}
			};

			this.utils.showMskOverlay(true);
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		/**
		 * callback method to get Retrieve PNR response from server
		 * @param response JSONObject
		 * @param args arguments passed while initiating AJAX call
		 */
		__onPnrValidateResponse: function(response, args) {

			if (response != null && response.responseJSON != null) {
				var nextPage = response.responseJSON.homePageId;

				// setting data for next page
				var json = this.moduleCtrl.getModuleData();

				// update the new data
				if (response.responseJSON.data != null) {
					for (var key in response.responseJSON.data) {
						if (response.responseJSON.data.hasOwnProperty(key)) {
							json[key] = response.responseJSON.data[key];
						}
					}
				}

				// if error or success while retrieve
				if (nextPage == aria.utils.HashManager.getHashString()) {
					pageObjBooking.$dataReady();
					pageObjBooking.$refresh();
				} else if (response.responseJSON.data.MGetTrip != null) {

					// add errors to bean
					if (response.responseJSON.data.MGetTrip.reply.errors != null) {
						for (var i = 0; i < response.responseJSON.data.MGetTrip.reply.errors.length; i++) {
							this.__addMsg('err', response.responseJSON.data.MGetTrip.reply.errors[i].TEXT);
						}
					}

					// refresh error section
					aria.utils.Json.setValue(this.data, 'errorOccured', true);
				} else {
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}

				// remove overlay
				this.utils.hideMskOverlay();
			}
		},

		/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
		_getOpcDateSadad: function() {
			var opcDate = null;
			if (!this.utils.isEmptyObject(this.reply.bookingPanel.onHoldPnrBean) && !this.utils.isEmptyObject(this.reply.bookingPanel.onHoldPnrBean.pnrCancellationDate)) {
				var dateParams = this.reply.bookingPanel.onHoldPnrBean.pnrCancellationDate.jsDateParams.split(",");
				var opcDate = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				var opcDateSadadMilliseconds = opcDate.getTime() - 3600000; /*subtracting one hour according to SADAD guidelines*/
				opcDate = new Date(opcDateSadadMilliseconds);
			}
			return opcDate;
		},

		_getFormattedDateString: function(opcDate) {
			var pattern = this.labels.tx_merci_pattern_sadad_cancel_warning;
			var opcDayString = aria.utils.Date.format(opcDate, "EEEE d MMMM yyyy");
			var opcTimeString = aria.utils.Date.format(opcDate, "HH:mm");
			var finalWarningMessage = this.utils.formatString(pattern, opcDayString, opcTimeString);
			return finalWarningMessage;
		},

		__isInstallmentsEnabled: function() {
			return this.utils.booleanValue(this.config.siteInstallmentsEnabled) && this.utils.booleanValue(this.config.merciInstallmentsEnabled) && this.utils.booleanValue(this.reply.isInstallmentPlanSelected);
		},

		/* START : Cordova Plugin implementation */
		onTripListParameters: function() {

			if (this.reply.pageTicket != undefined || this.reply.pageTicket != null) {
				var tripPageTicket = this.reply.pageTicket;
			} else {
				var tripPageTicket = "";
			};

			var tripLabels = {
				"tx_merci_text_mytrip": this.model.labels.tx_merci_text_mytrip,
				"tx_pltg_text_EvoucherTrip": this.model.labels.tx_pltg_text_EvoucherTrip,
				"tx_merci_text_is_trip_listed": this.model.labels.tx_merci_text_is_trip_listed,
				"tx_merci_text_is_retrieve": this.model.labels.tx_merci_text_is_retrieve,
				"tx_merci_text_booking_refnumber": this.model.labels.tx_merci_text_booking_refnumber,
				"tx_pltg_pattern_RecordLocator": this.model.labels.tx_pltg_pattern_RecordLocator,
				"tx_merci_text_home_home": this.model.labels.tx_merci_text_home_home
			};

			var tripConfig = {
				"siteGAEnableTrans": this.config.siteGAEnableTrans,
				"siteGAErrDomain": this.config.siteGAErrDomain,
				"siteGAEnable": this.config.siteGAEnable,
				"siteOfficeId": this.config.siteOfficeId,
				"siteGAErrEnabled": this.config.siteGAErrEnabled,
				"siteGAErrAccount": this.config.siteGAErrAccount
			};

			var segmentDetails = [];
			for (var itineraryIndex in this.tripplan.pnr.itineraries){
				for (var i in this.tripplan.pnr.itineraries[itineraryIndex].segments) {
					segmentDetails.push({
						"departureCityCode": this.tripplan.pnr.itineraries[itineraryIndex].segments[i].beginLocation.cityCode,
						"arrivalCityCode": this.tripplan.pnr.itineraries[itineraryIndex].segments[i].endLocation.cityCode,
						"depDate": this.tripplan.pnr.itineraries[itineraryIndex].segments[i].beginDate,
						"arrDate": this.tripplan.pnr.itineraries[itineraryIndex].segments[i].endDate
					});
				}
			}

			var jSondata = {
				"lastName": this.moduleCtrl.getModuleData().MBookingDetails.request.DIRECT_RETRIEVE_LASTNAME,
				"ECityName": this.tripplan.pnr.itineraries[0].endLocation.cityCode,
				"BCityName": this.tripplan.pnr.itineraries[0].beginLocation.cityName,
				"pastTrip": this.tripplan.pnr.itineraries[0].boolFlownStatus,
				"ECityCode": this.tripplan.pnr.itineraries[0].endLocation.cityCode,
				"evoucher": false,
				"BDate": this.tripplan.pnr.itineraries[0].beginDateBean.date,
				"BCityCode": this.tripplan.pnr.itineraries[0].beginLocation.cityCode,
				"recLoc": this.tripplan.pnr.REC_LOC.toUpperCase(),
				"segmentDetails": segmentDetails,
				"bookingInfoFlag": true
			};
			
			/*Past Trip Deletion Code*/
			var currSvDate = new Date(jsonResponse.data.framework.date.date);
			var tripArDate = new Date(jSondata.segmentDetails[jSondata.segmentDetails.length-1].arrDate);
			var EnablePastDeletion = false;
			if(jsonResponse.data.framework.settings.siteDeletePastTrip != undefined){
				EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastTrip;
			}
			/*Past Trip Deletion Code*/
			if(((tripArDate-currSvDate)>0)||!EnablePastDeletion){
			var that = this;
			var keyFound = false;
			this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
				var jsonTripList = {};
				if (result && result != "") {
					if (typeof result === 'string') {
						var jsonTripList = JSON.parse(result);
					} else {
						var jsonTripList = (result);
					}
				
					if (!that.utils.isEmptyObject(jsonTripList)) {
					
						var tripListData = jsonTripList["detailArray"];
						for (var key in tripListData) {
							if ((that.tripplan.pnr.REC_LOC).toUpperCase() == (key).toUpperCase()) {
								keyFound = true;
							
							}
						}
						if (keyFound == false) {
							tripListData[that.tripplan.pnr.REC_LOC.toUpperCase()] = jSondata;
							
							that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
						}
					} else {
						
						if ((that.utils.isEmptyObject(jsonTripList)) || (jsonTripList == null)) {
							
							var tripListData = {};
							tripListData[that.tripplan.pnr.REC_LOC.toUpperCase()] = jSondata;
							jsonTripList["labels"] = tripLabels;
							jsonTripList["config"] = tripConfig;
							jsonTripList["pageTicket"] = tripPageTicket;
							jsonTripList["detailArray"] = tripListData;
							keyFound = false;
							
							that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
						}
					}
				} else {
					var jsonTripList = {};
					if ((that.utils.isEmptyObject(result)) || (result == null)) {
						var jsonTripList = {};
						var tripListData = {};
						tripListData[that.tripplan.pnr.REC_LOC.toUpperCase()] = jSondata;
						jsonTripList["labels"] = tripLabels;
						jsonTripList["config"] = tripConfig;
						jsonTripList["pageTicket"] = tripPageTicket;
						jsonTripList["detailArray"] = tripListData;
				
						that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
					}
				};
				if (keyFound == false) {
					pageObjBooking.$json.setValue(jsonResponse.ui, "cntTrip", jsonResponse.ui.cntTrip + 1);
				}
			});
			}

		},

		takePhoto: function(ATArgs, args) {

			this.utils.startCamera(this.tripplan.pnr.REC_LOC);
		},

		showTripPhotos: function(ATArgs, args) {
			var conf = this;
			var pnr = this.tripplan.pnr.REC_LOC;

			this.utils.getStoredItemFromDevice(pnr + merciAppData.STORE_IMG_KEY, function(result) {
				var jsonTripPhoto = conf.moduleCtrl.getModuleData();
				jsonTripPhoto.tripphotos = result;
				conf.moduleCtrl.navigate(null, 'merci-book-MCarousal');
			});

		},

		/* To share the Trip data*/
		shareTrip: function(ATArgs, args) {
			this.__clearShareNotification();
			var client = "MobileWeb";
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (base[14] != null && base[14] != '') {
				var clientName = base[14].toLowerCase();
				if (clientName == 'android') {
					client = "MobileAppAndroid";
				} else if (clientName == 'iphone') {
					client = "MobileAppiPhone";
				}
			}
			if (client == "MobileWeb" && this.utils.isRequestFromApps() != true) {
				$(".msk").show();
				$('#share-buttons-group button').removeClass("active");
				$(this).addClass("active");
				$(".panel.share-slider").attr("aria-expanded", "true");
				var title = $(this).attr("data-title")
					/*$(".panel.share-slider h1").html("Share <strong>"+args.id+"</strong>");
				var type = $(this).attr("data-type")*/
				$(".share-content").hide();
				var current = this;
				switch (args.id) {
					case 'FACEBOOK':
						$(".msk").hide();
						$(".panel.share-slider").hide();
						$(".share-mail").hide();
						$(".share-sms").hide();
						/*https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.0*/
						window.open('https://www.facebook.com/dialog/feed?app_id=' + this.config.siteFaceBookAPIKey + '&redirect_uri=http%3A%2F%2Fwww.facebook.com&display=popup&link=' + encodeURIComponent(this.confPageShareContentLink) + '&name=' + encodeURIComponent(this.confPageShareContentTitle) + '&description=' + encodeURIComponent(this.confPageShareContentDesc) + '&from_login=1');

						break;
					case 'GOOGLEPLUS':
						$(".share-gp").show();
						$(".panel.share-slider").hide();
						$(".share-mail").hide();
						$(".share-sms").hide();
						$(".panel.share-slider h1").html("Share <strong> ON " + args.id + "</strong>");


						break;
					case 'LINKEDIN':

						$(".msk").hide();
						$(".panel.share-slider").hide();
						$(".share-mail").hide();
						$(".share-sms").hide();
						window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + current.confPageShareContentLink + '&title=' + current.confPageShareContentTitle + '&summary=' + current.confPageShareContentDesc + '&source=LinkedIn');
						break;
					case 'TWITTER':

						$(".msk").hide();
						$(".panel.share-slider").hide();
						$(".share-mail").hide();
						$(".share-sms").hide();
						var shareContent = this.confPageShareContentDesc;
						if (shareContent.length > 140) {
							shareContent = shareContent.substring(0, 136);
							shareContent = shareContent + '...';
						}

						window.open('http://twitter.com/share?text=' + shareContent + '&url=', 'scrollbars=no,menubar=no,height=450,width=650,resizable=yes,toolbar=no,location=no,status=no');
						break;
					case 'EMAIL':
						$(".panel.share-slider").show();
						$(".share-mail").show();
						$(".panel.share-slider h1").html("" + this.labels.tx_merci_text_sm_share + " <strong> BY " + this.labels.tx_merci_text_sm_by_email + "</strong>");
						document.getElementById("emailta").value = this.confPageShareContentDesc;

						break;
					case 'SMS':
						$(".panel.share-slider").show();
						$(".share-sms").show();
						$(".panel.share-slider h1").html("" + this.labels.tx_merci_text_sm_share + "<strong> BY " + this.labels.tx_merci_text_sm_by_sms + "</strong>");
						document.getElementById("smsta").value = this.confPageShareContentDesc;

						break;
					default:

				}



			} else {
				this.utils.sendShareData(args.id, this.getShareData());
			}


		},
		/* Trip Overview Calendar Plugin methods*/

		viewInCalendarJson: function() {
			var viewCalendarJSON = {
				isAddedEvents: "",
				calendarEvents: []
			};
			if (this.tripplan.pnr.itineraries && this.tripplan.pnr.itineraries.length > 0) {

				viewCalendarJSON.isAddedEvents = "true";

				var itineraries = this.tripplan.pnr.itineraries;
				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop
					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];
					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
						// segment loop
						var segment = itinerary.segments[segmentIndex];
						var startDate = new Date(segment.beginDateGMT);
						if (segment.segmentFlown == true) {
							continue;
						} else {
							viewCalendarJSON.calendarEvents.push({
								"index": itineraryIndex + segmentIndex,
								"flightNumber": segment.airline.code + " " + segment.flightNumber,
								"origin": segment.beginLocation.cityName,
								"startTime": new Date(segment.beginDateGMT).getTime(),
								"destination": segment.endLocation.cityName,
								"endTime": new Date(segment.endDateGMT).getTime()
							});
							//break;
						}

					}

				}

			}
			return viewCalendarJSON;
		},

		isTripFlown: function() {
			var isFlown = true;

			if (this.tripplan.pnr.itineraries && this.tripplan.pnr.itineraries.length > 0) {

				var itineraries = this.tripplan.pnr.itineraries;
				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];
					if (!itinerary.boolFlownStatus) {
						isFlown = false;
						break;
					}
				}
			}
			return isFlown;

		},

		getAddToCalendarJson: function() {
			var calendarJSON = {
				eventsKey: "",
				calendarEvents: []
			};
			if (this.tripplan.pnr.itineraries && this.tripplan.pnr.itineraries.length > 0) {

				calendarJSON.eventsKey = this.request.REC_LOC;

				var itineraries = this.tripplan.pnr.itineraries;				
				var customUri = this.getCustomURI();				
				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];
					if (!itinerary.boolFlownStatus) {
						for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
							// segment loop

							var segment = itinerary.segments[segmentIndex];
							var startDate = new Date(segment.beginDateGMT);
							var endDate = new Date(segment.endDateGMT);
							var title = segment.airline.code + " " + segment.flightNumber + "\n" + segment.beginLocation.locationName + " - " + segment.endLocation.locationName;
							var description = "Departure Terminal : " + (segment.beginTerminal ? segment.beginTerminal : "") + "\n" + "Arrival Terminal : " + (segment.endTerminal ? segment.endTerminal : "") 				+ "\n" + "stops :" + segment.nbrOfStops + "\n" /*+"Layover time : "++"\n"*/ 
											  + customUri + "://pnr=" + this.tripplan.pnr.REC_LOC;
							calendarJSON.calendarEvents.push({
								index: itineraryIndex + segmentIndex,
								title: title,
								description: description,
								eventLocation: segment.beginLocation.cityName,
								startTime: startDate.getTime(),
								endTime: endDate.getTime()
							});
						}
					}

				}

			}
			return calendarJSON;
		},
		
		getCustomURI: function(){
			var customURI = "merci.mo";
			if(this.utils.isRequestFromApps() == true){
				if (typeof device != 'undefined') {
					var devicePlatform = device.platform;
				} else {
					var devicePlatform = null;
				}
				
				if (devicePlatform == "iOS" && this.config.iPhoneHost != "") {
					customURI = this.config.iPhoneHost;
				}else if (devicePlatform == "Android" && this.config.androidHost != ""){
					customURI = this.config.androidHost;
				}	
			}
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (base[14] != null && base[14] != '') {
				var clientName = base[14].toLowerCase();
				if (clientName == 'android' && this.config.androidHost != "") {
					customURI = this.config.androidHost;
				} else if (clientName == 'iphone' && this.config.iPhoneHost != "") {
					customURI = this.config.iPhoneHost;
				}
			}	
			return customURI;
		},
		// Method to return valid date to show in calendar
		getCalendarTripDate: function() {

			var date = "";
			if (this.tripplan.pnr.itineraries && this.tripplan.pnr.itineraries.length > 0) {
				var itineraries = this.tripplan.pnr.itineraries;
				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];

					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
						// segment loop

						var segment = itinerary.segments[segmentIndex];

						if (segment.segmentFlown == true) {
							continue;
						} else {
							date = segment.beginDate;
							break;
						}
					}
					if (date != "") {
						break;
					}
				}
			}
			return date;
		},

		addTripToCalendar: function(ATArgs, args) {
			if (pageObjBooking.utils.booleanValue(pageObjBooking.utils.getStoredItem(pageObjBooking.request.REC_LOC + "_CAL")) == false) {
				var addCalendarJSON = this.getAddToCalendarJson();
				if (addCalendarJSON != null) {
					pageObjBooking.utils.storeLocal(pageObjBooking.request.REC_LOC + "_CAL", true, "overwrite", "json");
					document.getElementById('calenderView').setAttribute('class', 'icon-viewcalendar');
					this.utils.addEventsToCalendarDispOverlay(addCalendarJSON, pageObjBooking);
				};
			} else {
				pageObjBooking.viewTripInCalendar();
			}
		},

		viewTripInCalendar: function(ATArgs, args) {

			var viewCalendarJSON = this.viewInCalendarJson();
			if (viewCalendarJSON != null) {
				this.utils.viewEventsInCalendar(viewCalendarJSON);
			};
		},

		getShareData: function() {
			var origin = "";
			var destination = "";
			var flight = "";
			var departureDateTime = "";
			var departureAirport = "";
			var arrivalDateTime = "";
			var arrivalAirport = "";
			var shareData = "";
			if (this.tripplan.pnr.itineraries && this.tripplan.pnr.itineraries.length > 0) {
				var itineraries = this.tripplan.pnr.itineraries;


				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];

					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
						var segment = itinerary.segments[segmentIndex];

						// segment loop
						var completeString = this.labels.tx_merci_text_sm_sampleData; //'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME .'
						origin = (segment.beginLocation.cityName != null ? segment.beginLocation.cityName : "");
						destination = (segment.endLocation.cityName != null ? segment.endLocation.cityName : "");
						departureDateTime = (segment.beginDate != null ? segment.beginDate : "");
						var shareDataString = new this.buffer(completeString);
						completeString = shareDataString.formatString([origin, destination, departureDateTime]);
						completeString = completeString.replace("GMT", '');

						shareData = shareData + "" + completeString;
					}
				}
			}
			return shareData;
		},
		refreshPageinfo: function() {
			this.jsonMTrip = this.moduleCtrl.getModuleData();
			this.jsonMTrip.flowFromTrip = null;
			var params = {
				ACTION: "MODIFY",
				DIRECT_RETRIEVE: "true",
				TYPE: "retrieve",
				NEW_RETRIEVE: "Y",
				result: "json",
				FROM_PNR_RETRIEVE: "true",
				REC_LOC: this.request.REC_LOC,
				DIRECT_RETRIEVE_LASTNAME: this.request.DIRECT_RETRIEVE_LASTNAME

			};
			var action = 'MPNRValidate.action';
			this.utils.sendNavigateRequest(params, action, pageObjBooking);
		},

		showTabPaxDetails: function(paxName) {
			if (document.getElementById("paxTabletTab").getAttribute("class") == "navigation active") {
				return;
			} else {
				document.getElementById("servicesTab").setAttribute("class", "navigation");
				document.getElementById("paxTabletTab").setAttribute("class", "navigation active");
			}

			document.getElementById("tabletServicesTab").style.display = 'none';
			document.getElementById("passengerTabletTab").style.display = 'block';
			document.getElementById("tabletPaxTab").style.display = 'block';
		},

		showPaxEdit: function(ATargs, args) {
			this.utils.showMskOverlay(true);
			this.selectedPaxId = args.paxDetails.paxNumber;
			this.passengerDetails.Loaded = false;
			var jsonRec = this.getRecLocLname();

			var params = "DIRECT_RETRIEVE=true&ACTION=MODIFY&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED&displayAlert=" + this.request.displayAlert + "&DIRECT_RETRIEVE_LASTNAME=" + jsonRec.lastName + "&REC_LOC=" + jsonRec.recLoc + "&PAGE_TICKET=" + this.reply.pageTicket + "&ISAPISMISSING=" + this.apisMissing + "&result=json";

			var request = {
				action: "MTravellerDetails.action",
				parameters: params,
				isCompleteURL: false,
				expectedResponseType: 'json',
				cb: {
					fn: this.loadPaxDetails,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		loadPaxDetails: function(response) {

			this.moduleCtrl.setValueforStorage(response.responseJSON.data.MPassengerDetails, 'MPassengerDetails');
			this.togglePassengerDetailsDisplay();
			this.$refresh({
				section: 'paxEdit'
			});
			this.$json.setValue(this.passengerDetails, 'Loaded', true);

			this.utils.hideMskOverlay();
		},

		togglePassengerDetailsDisplay: function() {
			if (document.getElementById("paxListContainer") && document.getElementById("paxListContainer").style.display == 'none') {
				document.getElementById("paxListContainer").style.display = 'block';
				document.getElementById("paxEditContainer").style.display = 'none';

			} else {
				document.getElementById("paxListContainer").style.display = 'none';
				document.getElementById("paxEditContainer").style.display = 'block';
			}
		},

		showServiceDetailsTab: function(paxName) {
			if (document.getElementById("servicesTab").getAttribute("class") == "navigation active") {
				return;
			} else {
				document.getElementById("paxTabletTab").setAttribute("class", "navigation");
				document.getElementById("servicesTab").setAttribute("class", "navigation active");
			}

			document.getElementById("passengerTabletTab").style.display = 'none';
			document.getElementById("tabletServicesTab").style.display = 'block';

			this.moduleCtrl.navigateToCatalog();
		},

		payLaterPymntAction: function() {
			var jsonRec = this.getRecLocLname();
			var isAwardFlow = false;
			if (this.utils.booleanValue(this.config.siteEnableWaitlistPNR) && this.utils.booleanValue(this.reply.bookingPanel.isAwardPNR)) {
				isAwardFlow = true;
			}
			var parameters = {
				REC_LOC: jsonRec.recLoc,
				DIRECT_RETRIEVE_LASTNAME: jsonRec.lastName,
				ACTION: "BOOK",
				PAGE_TICKET: this.reply.pageTicket,
				REGISTER_START_OVER: "false",
				IS_PAY_ON_HOLD: "IS_PAY_ON_HOLD",
				IS_DOB_MANDATORY: "false",
				AWARDS_FLOW: isAwardFlow

			};
			this.utils.sendNavigateRequest(parameters, 'MOnHoldModifyDispatcher.action', this);
		},
		cancelPymntAction: function() {
			var jsonRec = this.getRecLocLname();
			var parameters = {
				CANCEL_ON_HOLD: 'TRUE',
				REC_LOC: jsonRec.recLoc
			};
			this.utils.sendNavigateRequest(parameters, 'MOnHoldCancelPNR.action', this);
			var cancelId = document.getElementById("onHoldCancel");
			if (cancelId != null) {
				cancelId.style.display = 'none';
			}
		},
		_getDateTime: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParams != null) {
				var dateParams = dateBean.jsDateParams.split(',');
				var dtTime = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				return dtTime;
			}
			return null;
		},
		toggleCancelPopup: function() {
			var cancelId = document.getElementById("onHoldCancel");
			if (cancelId != null) {
				if (cancelId.style.display == 'none') {
					window.scrollTo(0, 0);
					modules.view.merci.common.utils.MCommonScript.showMskOverlay(false);
					cancelId.style.display = 'block';
				} else {
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay(false);
					cancelId.style.display = 'none';
				}
			}
		},

		showSrvcsEdit: function() {
			this.$json.setValue(this.srvcDetails, 'loaded', false);

			var jsonRec = this.getRecLocLname();
			if (this.sadad != true) {
				var params = "DIRECT_RETRIEVE=true&ACTION=MODIFY&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED&displayAlert=" + this.request.displayAlert + "&DIRECT_RETRIEVE_LASTNAME=" + jsonRec.lastName + "&REC_LOC=" + jsonRec.recLoc + "&PAGE_TICKET=" + this.reply.pageTicket + "&result=json";

				var request = {
					action: "MGetServiceCatalogFromCONF.action",
					parameters: params,
					isCompleteURL: false,
					expectedResponseType: 'json',
					loading: true,
					cb: {
						fn: this.loadSrvcesDetails,
						scope: this
					}
				};

				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}
		},

		loadSrvcesDetails: function(response) {
			this.moduleCtrl.setValueforStorage(response.responseJSON.data.MServicesCatalog, 'MServicesCatalog');
			this.toggleSrvcsEditDisplay();

			this.$refresh({
				section: 'srvcsEdit'
			});

			this.$json.setValue(this.srvcDetails, 'loaded', true);
		},

		toggleSrvcsEditDisplay: function() {
			if (document.getElementById("srvcEditContainer")) {
				document.getElementById("srvcEditContainer").style.display = 'block';
			}
		},
		googlePlusInit: function() {

		},
		cancelShare: function(ATArgs, args) {
			$(".panel.share-slider").hide();
			$(".msk").hide();
			$("#share-buttons-group1").removeClass("showShare");
			$('.share-content footer button:not(.secondary)').trigger('click');

		},
		cancelEmailShare: function() {
			$(".panel.share-slider").hide();
			$(".msk").hide();
		},
		sendEmailShare: function() {
			$(".msk").show();
			$(".msk").css('z-index', '100000000');
			var toFieldEL = document.getElementById('travellerToEmail').value;
			var fromFieldEL = document.getElementById('travellerFromEmail').value;
			var emailBody = document.getElementById('emailta').value;
			var subject = this.confPageShareContentTitle;
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if(filter.test(toFieldEL) && filter.test(fromFieldEL)){
				var params = 'FROM=' + encodeURIComponent(fromFieldEL) + '&TO=' + encodeURIComponent(toFieldEL) + '&SUBJECT=' + encodeURIComponent(subject) + '&BODY=' + encodeURIComponent(emailBody) + '&result=json';
				var request = {
					action: 'MMailWrapperAction.action',
					method: 'POST',
					parameters: params,
					isCompleteURL: false,
					expectedResponseType: 'json',
					cb: {
						fn: this.__sendEmailCallback,
						args: params,
						scope: this
					}
				};

				//this.utils.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}else{
				var div = document.createElement('div');
				div.className = 'msg warning';
				var content = '<ul><li class = "ext-came">' + this.emailData.errorMessage + '</li></ul>';
				div.innerHTML = content;
				document.getElementById('shareNot').appendChild(div);
				$(".msk").css('z-index', '1');
			}
		},

		__addErrors: function(errors) {

			if (errors != null) {
				for (var i = 0; i < errors.length; i++) {
					this.__addError(errors[i], (i == errors.length - 1));
				}
			}
		},

		__addError: function(error, doRefresh) {

			if (error != null) {

				// if null then initialize
				if (this.data.errors == null) {
					this.data.errors = [];
				}

				this.data.errors.push(error);
				if (doRefresh) {
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},

		__clearErrors: function() {
			this.data.errors = [];
			aria.utils.Json.setValue(this.data, 'error_msg', true);
		},

		__clearShareNotification: function() {
			if (document.getElementById('shareNot') != undefined || document.getElementById('shareNot') != null) {
				document.getElementById('shareNot').innerHTML = '';
			}

		},


		/**
		 * Callback when receiving the response of the Send request
		 * If the next page is MmailError, forwards to MMail.action; otherwise regular behaviour
		 */
		__sendEmailCallback: function(response,args) {
			this.__clearShareNotification();
			var json = response.responseJSON;
			if (json) {
				var pageId = json.homePageId;
				if (pageId === 'merci-MmailError') {
					var div = document.createElement('div');
					div.className = 'msg warning';
					var content = '<ul><li class = "ext-came">' + this.emailData.errorMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('shareNot').appendChild(div);


					$(".msk").css('z-index', '1');
				} else {
					var div = document.createElement('div');
					div.className = 'msg info';
					var content = '<ul><li class = "ext-came">' + this.emailData.successMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('sharedMsg').appendChild(div);

					$(".panel.share-slider").hide();
					$(".msk").hide();
					$(".msk").css('z-index', '1');
				}
			}
		},
		cancelSMSShare: function() {
			$(".panel.share-slider").hide();
			$(".msk").hide();
		},
		sendSMSShare: function() {
			$(".msk").show();
			$(".msk").css('z-index', '100000000');
			var travellerAreaCode = document.getElementById('travellerAreaCode').value;
			var travellerPhoneNo = document.getElementById('travellerPhoneNo').value;
			var smsta = document.getElementById('smsta').value;
			var subject = this.confPageShareContentTitle;

			var params = 'AREACODE=' + encodeURIComponent(travellerAreaCode) + '&PHONENUMBER=' + encodeURIComponent(travellerPhoneNo) + '&SUBJECT=' + encodeURIComponent(subject) + '&MESSAGE=' + encodeURIComponent(smsta) + '&result=json';
			var request = {
				action: 'MMailWrapperAction.action',
				method: 'POST',
				parameters: params,
				isCompleteURL: false,
				expectedResponseType: 'json',
				cb: {
					fn: this.__sendSMSCallback,
					args: params,
					scope: this
				}
			};

			//this.utils.showMskOverlay(true);
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);


		},
		__sendSMSCallback: function(response) {
			this.__clearShareNotification();
			var json = response.responseJSON;
			if (json) {
				var pageId = json.homePageId;
				if (pageId === 'merci-book-MError_A') {
					var div = document.createElement('div');
					div.className = 'msg warning';
					var content = '<ul><li class = "ext-came">' + this.smsData.errorMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('shareNot').appendChild(div);
					$(".msk").css('z-index', '1');
				} else {

					var div = document.createElement('div');
					div.className = 'msg info';
					var content = '<ul><li class = "ext-came">' + this.smsData.successMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('shareNot').appendChild(div);

					$(".panel.share-slider").hide();
					$(".msk").hide();
					$(".msk").css('z-index', '1');
				}
			}
		},

		getServicesBookmarkData: function() {
			pageObjBooking.utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {
				var deleteData = false;
				if (result && result != "") {
					if (typeof result === 'string') {
						pageObjBooking.jsonObj = JSON.parse(result);
					}
					if (!pageObjBooking.utils.isEmptyObject(pageObjBooking.jsonObj)) {
						var todaysDate = new Date();
						if (!pageObjBooking.utils.isEmptyObject(pageObjBooking.jsonObj.SERVICESCATALOG)) {
							for (var key in pageObjBooking.jsonObj.SERVICESCATALOG) {
								if (todaysDate > pageObjBooking.jsonObj.SERVICESCATALOG[key].lastSegmentFlownDate) {
									delete pageObjBooking.jsonObj.SERVICESCATALOG[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}
						if (deleteData = true) {
							pageObjBooking.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
							pageObjBooking.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjBooking.jsonObj, "overwrite", "json");
						};
					};
				}
			});
			if (!this.utils.isEmptyObject(pageObjBooking.jsonObj) && !this.utils.isEmptyObject(pageObjBooking.jsonObj.SERVICESCATALOG)) {
				return pageObjBooking.jsonObj.SERVICESCATALOG;
			} else
				return [];
		},

		getServicesBookmarkForRecLoc: function(recLoc) {
			var bookmarkedServices = this.getServicesBookmarkData();
			var bookmarkedRecLoc = {};
			for (var i = 0; i < bookmarkedServices.length; i++) {
				if (bookmarkedServices[i].REC_LOC.toLowerCase() == recLoc.toLowerCase()) {
					bookmarkedRecLoc = bookmarkedServices[i];
				}
			}
			return bookmarkedRecLoc;
		},
		isServicesCatalogEnbld: function() {
			var enblCatalog = false;
			if (this.utils.booleanValue(this.config.merciServiceCatalog) && !this.utils.isEmptyObject(this.reply.serviceCategories)) {
				enblCatalog = true;
			}
			if (this.config.siteAllowPayLater == 'TRUE' && !this.reply.pnrStatusCode == 'P') {
				enblCatalog = false;
			}
			return enblCatalog;
		},

		isHomePage: function(flowType) {
			flowType = flowType.split('-');
			if (flowType[1] != undefined && flowType[1] == 'R') {
				return true;
			}
			return false;
		},
		getMiles: function(){
			if(!this.utils.isEmptyObject(this.request.prefAirFreqMiles_1)){
				return parseInt(this.request.prefAirFreqMiles_1);
			}
		},
		toggleCalendarAlert: function(scope,args) {
			if(args=="added" || (args && args.id && args.id=="added")){
				var overlayDiv = document.getElementById(this.$getId('addTripToCalendarAlertOverlay'));
				pageObjBooking.utils.toggleClass(overlayDiv, 'on');
			}
		},
		getAddTripLabel:function(){
			var label=pageObjBooking.labels.tx_merciapps_trip_added_to_calendar;
			if(label==null || label==""){
				if(customerAppData && customerAppData.TRIP_ADDED){
					label=customerAppData.TRIP_ADDED;
				}
				else{
					label="";
				}
			}
			return label;
		},
		getOkLabel:function(){
			var label=pageObjBooking.labels.tx_merciapps_ok;
			if(label==null || label==""){
				if(customerAppData && customerAppData.OK_LABEL){
					label=customerAppData.OK_LABEL;
				}
				else{
					label="";
				}
			}
			return label;
		},
		getButtons: function(){
			var buttonNames = [];
			if (this.utils.booleanValue(this.config.enblHomePageAlign)){
				for(var button in this.globalList.customButtons){
					if(this.isHomePage(this.globalList.customButtons[button][3])){
						var macroName = this.globalList.customButtons[button][3].split("-");
						buttonNames.push(macroName[0]+'|'+macroName[1]+'|'+macroName[2]);
		}
				}
			}else{
				buttonNames = ['EMAIL', 'REBOOK', 'CHECKIN_SEG', 'MEAL', 'CONTACTUS', 'TRIPPHOTOS' , 'REPEATTRIP', 'CAR', 'HOTEL'];
			}
			return buttonNames;	         
	    }
	}
});