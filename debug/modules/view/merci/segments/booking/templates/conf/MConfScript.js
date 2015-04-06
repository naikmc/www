Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MConfScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.currCode = "";
		this.exchRate = "";
		this.GACurrCode = "";
		this.GAExchRate = "";
		this.pnrType = "";
		pageObjConf = this;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
		this.emailData = {
			successMessage: 'Email has been sent.',
			errorMessage: 'Error has  occured while sending email.'
		};
		this.smsData = {
			successMessage: 'SMS has been sent.',
			errorMessage: 'Error has  occured while sending sms.'
		};
		this.__clearShareNotification();
		this.seatsEligibleSegments = [];
	},

	$prototype: {

		__onAirportSelectCB: function(response, inputParams) {

		},

		$dataReady: function() {

			// common variables
			this.isTripAddedToCal = false;
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
			this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;

			// if errors available from BE then set those errors to be displayed on UI
			var bookingData = this.moduleCtrl.getModuleData().booking;
			if (bookingData != null && bookingData.MCONF_A != null) {
				this.data.errors = bookingData.MCONF_A.requestParam.reply.errors;
			}

			var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var nbPaxVal = this._getSize(rqstParams.listTravellerBean.travellersAsMap);
			rqstParams.servicesSelection = rqstParams.tripPlanBean.air.services.selection; //For the fare breakdown
			// for IR 09476930
			this.makeAcknowledgement({
				url: rqstParams.ack_url
			});

			this.config = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			this.confPageShareContentTitle = labels.tx_merci_text_sm_title;
			this.confPageShareContentCaption = labels.tx_merci_text_sm_caption;
			this.confPageShareImageURL = labels.tx_merci_text_sm_airlines_image_url;
			this.confPageShareContentDesc = this.getShareData();
			this.confPageShareContentLink = labels.tx_merci_text_sm_airlines_link;

			var headerButton = {};
			var arr = [];
			var arrShare = [];
			headerButton.scope = pageObjConf;
			var current = this;
			var loyaltyInfoJson = null;
	            if (pageObjConf.__merciFunc.booleanValue(siteParams.enableLoyalty) && rqstParams.IS_USER_LOGGED_IN) {
	                loyaltyInfoJson = {
	                    loyaltyLabels: labels.loyaltyLabels,
	                    airline: base[16],
	                    miles: base[17],
	                    tier: base[18],
	                    title: base[19],
	                    firstName: base[20],
	                    lastName: base[21],
	                    programmeNo: base[22]
	                };
	            }
			if (this.__merciFunc.isRequestFromApps() == true) {
				this.onTripListParameters(labels, siteParams, rqstParams);

				if(this.config.siteAllowCalendar.toLowerCase()=="true"){
					if(jsonResponse.ui.CALENDAR_DISPLAY ==undefined || pageObjConf.__merciFunc.booleanValue(jsonResponse.ui.CALENDAR_DISPLAY)==true){
						arr.push("calendarButton");
						var calendarIcon = pageObjConf.__merciFunc.booleanValue(pageObjConf.__merciFunc.getStoredItem(rqstParams.tripPlanBean.REC_LOC + "_CAL"));
						headerButton.showCalendar = calendarIcon;
					}
				};

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
				};

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
				this.moduleCtrl.setHeaderInfo({
					title: labels.tx_merci_text_booking_conf_title,
					bannerHtmlL: rqstParams.bannerHtml,
					homePageURL: siteParams.siteHomeURL,
					loyaltyInfoBanner: loyaltyInfoJson,
					showButton: false,
					companyName: siteParams.sitePLCompanyName,
					headerButton: headerButton
				});
			} else {

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
				};

				if (this.config.siteAllowTwitter.toLowerCase() == "true") {
					arrShare.push(["TWITTER", "tw", "icon-twitter"]);
				};

				if (this.config.siteAllowEmail.toLowerCase() == "true") {
					arrShare.push(["EMAIL", "mail", "icon-email"]);
				};

				if (this.config.siteAllowSMS.toLowerCase() == "true") {
					arrShare.push(["SMS", "sms", "icon-sms"]);
				};
				var googleAPIKey = this.config.siteGooglePlusAPIKey;
				var baseparams = modules.view.merci.common.utils.URLManager.getBaseParams();
				if (window.location.protocol == 'http:') {
					googleAPIKey = this.config.siteGooglePlusSecretKey;
				}
				headerButton.shreButton = arrShare;
				headerButton.shareData = {
					title: current.confPageShareContentTitle,
					caption: current.confPageShareContentCaption,
					link: current.confPageShareContentLink,
					description: current.confPageShareContentDesc,
					apiKey: googleAPIKey
				};
				headerButton.button = arr;
				// set details for header
				this.moduleCtrl.setHeaderInfo({
					title: labels.tx_merci_text_booking_conf_title,
					bannerHtmlL: rqstParams.bannerHtml,
					homePageURL: siteParams.siteHomeURL,
					showButton: false,
					companyName: siteParams.sitePLCompanyName,
					headerButton: headerButton,
					loyaltyInfoBanner: loyaltyInfoJson,
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



			//this.moduleCtrl.setHeaderCurrInfo(false);

			/*
			Segment ---- rqstParams.listItineraryBean.segments[0].airline.code + rqstParams.listItineraryBean.segments[0].flightNumber
			Cabin class -------------- rqstParams.listItineraryBean.itineraries[0].cabins[0].name
			Number of pax - rqstParams.listTravellerBean.numberOfAdults, rqstParams.listTravellerBean.numberOfChildren, rqstParams.listTravellerBean.numberOfInfant
			Seat number 

			var sqData ={};

			//if site parameter is enabled

			if(!this._merciFunc.isEmptyObject(siteParams.isSQFlow)){
			}
			*/

			

			// google analytics
			this.__ga.trackPage({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				page: ((rqstParams.fareBreakdown.rebookingStatus == true) ? 'ATC 6-Reservation' : '7-Reservation') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			var loginType = "GuestLogin";
			var pnrType = "Booking PNR";


			if (this.__merciFunc.booleanValue(rqstParams.loginProfilesBean)) {
				loginType = "UserLogin";
			}

			if (rqstParams.fareBreakdown.rebookingStatus == true) {
				pnrType = "Re-booking PNR";
			} else if (rqstParams.param.FLOW_TYPE == "DEALS_AND_OFFER_FLOW") {
				pnrType = "DealsAndOffers PNR";
			} else if (this.__merciFunc.booleanValue(rqstParams.awardsFlow)) {
				pnrType = "AwardBooking PNR";
				loginType = "UserLogin";
			} else if (this._getSize(rqstParams.fareBreakdown.listPromotions) > 0 && rqstParams.fareBreakdown.listPromotions[0].totalAmount != "" && rqstParams.param.FLOW_TYPE == "DEALS_AND_OFFER_FLOW") {
				pnrType = "DealsAndOffers Promocode PNR";
			} else if (this._getSize(rqstParams.fareBreakdown.listPromotions) > 0 && rqstParams.fareBreakdown.listPromotions[0].totalAmount != "") {
				pnrType = "Promocode PNR";
			} else if (rqstParams.param.paymentType == 'PLCC') {
				pnrType = "Pay Later On Hold PNR";
			} else if (rqstParams.param.IS_PAY_ON_HOLD != null && rqstParams.param.IS_PAY_ON_HOLD == 'IS_PAY_ON_HOLD') {
				pnrType = "Pay Later Confirmed PNR";
			}
			this.pnrType = pnrType;
			var client = "MobileWeb";
			if (base[14] != null && base[14] != '') {
				var clientName = base[14].toLowerCase();
				if (clientName == 'android') {
					client = "MobileAppAndroid";
				} else if (clientName == 'iphone') {
					client = "MobileAppiPhone";
				}
			}

			this.__ga.trackEvent({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				category: pnrType,
				action: loginType,
				label: client,
				value: nbPaxVal,
				requireTrackPage: true,
				noninteraction: ''
			});
			if (this._merciFunc.booleanValue(siteParams.enableGACurrencyConversion)) {
				var params = 'CURRENCY_TO=' + siteParams.gaCurrencyConversionCode + '&CURRENCY_FROM=' + rqstParams.fareBreakdown.currencies[0].code + '&result=json&PLTG_RECOMMENDATION_INDEX=';
				var actionName = 'MFareCurrencyConversion.action';
				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onGACurrencyCB,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				this.__gaTransaction(siteParams, rqstParams, base, pnrType);
			}

			/* Delete the bookmark for the PNR once the confirmation page is reached after payment.
				Since the bookmark is not allowed for booking, the only way to delete the bookmark is
				once the user reaches confirmation after payment
			*/
			this.__merciFunc.deleteServicesBookmark(rqstParams.tripPlanBean.REC_LOC);
			pageBookConf = this;
			if (pageObjConf.__merciFunc.isRequestFromApps() == true) {
				this._setTripOverviewJSON();
			}

		},
		googlePlusInit: function() {},
		/* To share the Trip data*/
		shareTrip: function(ATArgs, args) {
			this.__clearShareNotification();
			var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
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
			if (client == "MobileWeb" && this.__merciFunc.isRequestFromApps() != true) {
				console.log("args :" + args.id);
				$(".msk").show();
				$('#share-buttons-group button').removeClass("active");
				$(this).addClass("active");
				$(".panel.share-slider").attr("aria-expanded", "true");
				var title = $(this).attr("data-title")
					/*$(".panel.share-slider h1").html("Share <strong>"+args.id+"</strong>");
				var type = $(this).attr("data-type")*/
				$(".share-content").hide();

				/*this.confPageShareContentTitle = 'PNR Title';
				this.confPageShareContentCaption = 'PNR Caption ';
				this.confPageShareImageURL = 'http://fbrell.com/f8.jpg';
				this.confPageSahreContentDesc = this.getShareData();
				this.confPageShareContentLink = 'http://www.singapore.com';*/
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
						//	console.log("this.confPageSahreContentDesc : "+this.confPageSahreContentDesc);
						window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + current.confPageShareContentLink + '&title=' + encodeURI(current.confPageShareContentTitle) + '&summary=' + encodeURI(current.confPageShareContentDesc) + '&source=LinkedIn');
						break;

					case 'TWITTER':
						$(".msk").hide();
						$(".panel.share-slider").hide();
						$(".share-mail").hide();
						$(".share-sms").hide();

						/* $(".share-tr").show();
				  $(".panel.share-slider h1").html("Share <strong> ON "+args.id+"</strong>");*/

						var shareContent = this.confPageShareContentDesc;

						window.open('http://twitter.com/share?text=' + encodeURI(shareContent) + '&url=', 'scrollbars=no,menubar=no,height=450,width=650,resizable=yes,toolbar=no,location=no,status=no');
						break;
					case 'EMAIL':
						$(".panel.share-slider").show();
						$(".share-mail").show();
						$(".panel.share-slider h1").html("" + labels.tx_merci_text_sm_share + " <strong> BY " + labels.tx_merci_text_sm_by_email + "</strong>");
						document.getElementById("emailta").value = this.confPageShareContentDesc;

						break;
					case 'SMS':
						$(".panel.share-slider").show();
						$(".share-sms").show();
						$(".panel.share-slider h1").html("" + labels.tx_merci_text_sm_share + "<strong> BY " + labels.tx_merci_text_sm_by_sms + "</strong>");
						document.getElementById("smsta").value = this.confPageShareContentDesc;

						break;
					default:

				}
			} else {
				this.__merciFunc.sendShareData(args.id, this.getShareData());
			}


		},
		cancelShare: function(ATArgs, args) {
			$(".panel.share-slider").hide();
			$(".msk").hide();
			$("#share-buttons-group1").removeClass("showShare");
			$('.share-content footer button:not(.secondary)').trigger('click');

		},
		getShareData: function() {
			//return shareData = 'SahreDAta';
			var origin = "";
			var destination = "";
			var flight = "";
			var departureDateTime = "";
			var departureAirport = "";
			var arrivalDateTime = "";
			var arrivalAirport = "";
			var shareData = "";
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var tripPlanItineraries = rqstParams.listItineraryBean.itineraries;
			console.log("tripPlanItineraries :" + tripPlanItineraries);
			var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			if (tripPlanItineraries && tripPlanItineraries.length > 0) {
				var itineraries = tripPlanItineraries;


				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];

					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {


						var segment = itinerary.segments[segmentIndex];

						// segment loop
						// var completeString = 'I am travelling from ORIGIN to DESTINATION on FLIGHT, departing on DEPATUREDATETIME from DEPARTUREAIRPORT and arriving on ARRIVALDATETIME at ARRIVALAIRPORT.';
						var completeString = labels.tx_merci_text_sm_sampleData; //'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME .'
						origin = (segment.beginLocation.cityName != null ? segment.beginLocation.cityName : "");
						destination = (segment.endLocation.cityName != null ? segment.endLocation.cityName : "");
						// flight = (segment.airline.code != null ? segment.airline.code : "") + " " + (segment.flightNumber != null ? segment.flightNumber : "");
						departureDateTime = (segment.beginDate != null ? segment.beginDate : "");
						// departureAirport = (segment.beginLocation.locationName != null ? segment.beginLocation.locationName : "") + (segment.beginTerminal != null ? (" Terminal " + segment.beginTerminal) : "");
						// arrivalDateTime = segment.endDate;
						// arrivalAirport = (segment.endLocation.locationName != null ? segment.endLocation.locationName : "") + (segment.endTerminal != null ? (" Terminal " + segment.endTerminal) : "");
						var shareDataString = new this.buffer(completeString);
						completeString = shareDataString.formatString([origin, destination, departureDateTime]);
						completeString = completeString.replace("GMT", '');
						//completeString = completeString.replace("ORIGIN", origin).replace("DESTINATION", destination).replace("FLIGHT", flight).replace("DEPATUREDATETIME", departureDateTime).replace("DEPARTUREAIRPORT", departureAirport).replace("ARRIVALDATETIME", arrivalDateTime).replace("ARRIVALAIRPORT", arrivalAirport).replace("GMT", '');

						shareData = shareData + " " + completeString;
					}
				}
			}
			console.log("getShareData" + shareData);
			return shareData;
		},
		sendShareData: function(shareID, shareData) {},
		cancelShareData: function(shareID) {},
		__gaTransaction: function(siteParams, rqstParams, base, pnrType) {
			var nbPaxVal = this._getSize(rqstParams.listTravellerBean.travellersAsMap);
			var unitPriceVal = null;
			var dDate = this.$modifier("dateformat", [new Date(rqstParams.listItineraryBean.itineraries[0].segments[0].beginDate), "yyyy-MM-dd"]);
			var OBFareFamily = "";
			if (rqstParams.listItineraryBean.itineraries[0].fareFamily != undefined) {
				OBFareFamily = rqstParams.listItineraryBean.itineraries[0].fareFamily.name;
			}
			var upsellOutboundString = "";
			if (rqstParams.listItineraryBean.itineraries[0].fareFamily != undefined) {
				upsellOutboundString = ((rqstParams.param.upsellOutLow == rqstParams.listItineraryBean.itineraries[0].fareFamily.code) ? "OUP NONE" : (rqstParams.param.upsellOutLow + "-" + rqstParams.listItineraryBean.itineraries[0].fareFamily.code));
			}
			var rDate = "";
			var IBFareFamily = "";
			var upsellInboundString = "";
			if (rqstParams.listItineraryBean.tripType == 'R') {
				rDate = this.$modifier("dateformat", [new Date(rqstParams.listItineraryBean.itineraries[1].segments[0].beginDate), "yyyy-MM-dd"]);
				if (rqstParams.listItineraryBean.itineraries[1].fareFamily != undefined) {
					IBFareFamily = rqstParams.listItineraryBean.itineraries[1].fareFamily.name;
					upsellInboundString = ((rqstParams.param.upsellOutLow == rqstParams.listItineraryBean.itineraries[1].fareFamily.code) ? "OUP NONE" : (rqstParams.param.upsellOutLow + "-" + rqstParams.listItineraryBean.itineraries[1].fareFamily.code));
				}
			}
			var priceTTCVal = rqstParams.fareBreakdown.tripPrices[0].totalAmount;
			var priceTTCValWithoutTax = rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax;
			if (this.GAExchRate != "" && this.GACurrCode != "") {
				priceTTCVal = priceTTCVal * this.GAExchRate;
				priceTTCValWithoutTax = priceTTCValWithoutTax * this.GAExchRate;
			}

			var taxVal = rqstParams.fareBreakdown.tripPrices[0].totalAmount - rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax;
			if(this.isRebookingFlow()){
				if(rqstParams.fareBreakdown.tripPrices[0].priceWithTax){
				 	taxVal = rqstParams.fareBreakdown.tripPrices[0].priceWithTax - rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax;
				}
			}
			if (this.GAExchRate != "" && this.GACurrCode != "") {
				taxVal = taxVal * this.GAExchRate;
			}
			var unitPrice = 0;
			if (nbPaxVal != 0) {
				unitPriceVal = priceTTCValWithoutTax / nbPaxVal;
			}
			var currencyCodeVal = rqstParams.fareBreakdown.currencies[0].code;
			if (this.GAExchRate != "" && this.GACurrCode != "") {
				currencyCodeVal = this.GACurrCode;
			}
			var source = "site";
			if ((base[14] != null)) {
				source = "client";
			}
			var transStringVal = "wt_ctry=" + ((base[13] != null) ? base[13] : '') + "&wt_lang=" + base[12] + "&wt_mkt=" + ((base[13] != null) ? base[13] : '') + "&wt_off=" + siteParams.siteOfficeID + "&wt_stcode=" + base[11] + "&wt_pnrNbr=" + rqstParams.tripPlanBean.REC_LOC + "&wt_ddate=" + dDate + "&wt_rdate=" + rDate + "&wt_source=" + source + "&wt_transType=mobile";
			var itemString1Val = "wt_oFF=" + OBFareFamily + "&wt_IFF=" + IBFareFamily + "&wt_itemtype=mobile";
			var itemString2Val = "wt_cpair=" + rqstParams.listItineraryBean.itineraries[0].beginLocation.locationCode + "-" + rqstParams.listItineraryBean.itineraries[0].endLocation.locationCode + "&wt_triptype=" + rqstParams.listItineraryBean.tripType;
			var itemString3Val = "wt_upsellob=" + upsellOutboundString + "&wt_upsellret=" + upsellInboundString;
			var isSQFlow = false;
			var milesCost = "NA" ;
			var sqData ={};
			var transactionProducts = [];
			var flightNumber = [];		
			var page = null;
			var pageid = null;
			var category = null;
			var seatNumber = '';
			var flightSegment1 = '';			
			var conversionRate = null;
			//if site parameter is enabled
			if (!this._merciFunc.isEmptyObject(siteParams.isSQFlow)){
				isSQFlow = true;
			}			

			if(isSQFlow==true){
				for(var i=0; i< rqstParams.listItineraryBean.segments.length; i++){
					flightNumber.push(rqstParams.listItineraryBean.segments[i].airline.code + rqstParams.listItineraryBean.segments[i].flightNumber);
				}
				flightNumber = flightNumber.join();
				sqData['flightNumber']=flightNumber;				

				if (pnrType == "AwardBooking PNR"){
					milesCost = rqstParams.fareBreakdown.tripPrices[0].milesCost;
				}
				sqData['transactionMiles']=milesCost.toString();				

          		
          		
				var cabinClass = rqstParams.listItineraryBean.itineraries[0].cabins[0].name;

				sqData['cabin']= cabinClass;				
				sqData['pointOfSale'] = ((base[13] != null) ? base[13] : '') ;
				sqData['numOfAdults'] = rqstParams.listTravellerBean.numberOfAdults.toString();
				sqData['numOfChildren'] = rqstParams.listTravellerBean.numberOfChildren.toString();
				sqData['numOfInfants'] = rqstParams.listTravellerBean.numberOfInfant.toString();
				sqData['currency'] = rqstParams.fareBreakdown.currencies[0].code;
				sqData['pnr'] = rqstParams.tripPlanBean.REC_LOC;
				sqData['origin'] = rqstParams.listItineraryBean.itineraries[0].beginLocation.cityCode;
				sqData['destination'] = rqstParams.listItineraryBean.itineraries[0].endLocation.cityCode;
				sqData['totalPrice'] = rqstParams.fareBreakdown.tripPrices[0].priceWithTax.toString();
				sqData['transactionTotal']= rqstParams.fareBreakdown.tripPrices[0].priceWithTax.toString();
				sqData['totalFare'] = rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax.toString();
				sqData['orderId'] = rqstParams.fareBreakdown.pnrs[0].id.toString();
				sqData['transactionAffiliation']="MOB";
				
				var day1 = rqstParams.listItineraryBean.itineraries[0].beginDateBean.day.toString();
				var month1 = rqstParams.listItineraryBean.itineraries[0].beginDateBean.month.toString();
				var year1 = rqstParams.listItineraryBean.itineraries[0].beginDateBean.year.toString();
				var depDate = (day1 < 10 ? ('0' + day1) : day1) + "-" + (month1 < 10 ? ('0' + month1) : month1) + "-" + year1;
				var dateOfJourney = new Date(year1, month1, day1);
				var d1 = new Date();
				var day = d1.getDate();
				var month = d1.getMonth() + 1;
				var year = d1.getFullYear();
				var curdate = day + "/" + month + "/" + year;
				var currentDate = year + (month < 10 ? ('0' + month) : month) + (day < 10 ? ('0' + day) : day);
				var curDate = new Date(year, month, day);


				var flightSegment1 = [];
						for(var i=0; i<rqstParams.listItineraryBean.itineraries.length; i++){
							for(var j=0; j<rqstParams.listItineraryBean.itineraries[i].segments.length; j++){
								if(j>0){
									flightSegment1 = flightSegment1 + "|" ;
								}
								b_location = rqstParams.listItineraryBean.itineraries[i].segments[j].beginLocation.locationCode;
								e_location = rqstParams.listItineraryBean.itineraries[i].segments[j].endLocation.locationCode;
								flightSegment1 = flightSegment1 + b_location + "-" + e_location ;
							}
							if(rqstParams.listItineraryBean.itineraries.length - 1 > i){			
								flightSegment1 = flightSegment1 + "|" ;
							}
						}
				

				sqData['transactionId']= currentDate + "|" + rqstParams.fareBreakdown.pnrs[0].id + "|" + rqstParams.tripPlanBean.REC_LOC ;
				sqData['departureDate'] = depDate;
				if(rqstParams.listItineraryBean.tripType == "O"){
					sqData['typeOfTrip'] = "One-Way";
					sqData['returnDate'] = "NA";
				}
				else{
					sqData['typeOfTrip'] = "Return";
					var day2 = rqstParams.listItineraryBean.itineraries[1].beginDateBean.day.toString();
					var month2 = rqstParams.listItineraryBean.itineraries[1].beginDateBean.month.toString();
					var year2 = rqstParams.listItineraryBean.itineraries[1].beginDateBean.year.toString();
            		arrDate = (day2 < 10 ? ('0' + day2) : day2) + "-" + (month2 < 10 ? ('0' + month2) : month2) + "-" + year2;
					sqData['returnDate'] = arrDate;
				}

				if(!this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)){
					sqData['typeOfSearch'] = 'ORB';
				}
				else if (rqstParams.flowType.rebookFlow){
					sqData['typeOfSearch'] = 'ATC';
					sqData['totalPrice'] = rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount.toString();
					sqData['transactionTotal']= rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount.toString();
				}
				else{
					sqData['typeOfSearch'] = 'CIB';
				}

				var surcharges = 0;
				if(rqstParams.airLineTax.airlineTaxList_ADT != '') {
					var surchargeAdt = rqstParams.airLineTax.airlineTaxList_ADT[0].value;
					surcharges = surcharges + surchargeAdt;
				}	
				if(rqstParams.airLineTax.airlineTaxList_CHD != '') {
					var surchargeChd = rqstParams.airLineTax.airlineTaxList_CHD[0].value; 
					surcharges = surcharges + surchargeChd;
				}
				if(rqstParams.airLineTax.airlineTaxList_INF != '') {
					var surchargeInf = rqstParams.airLineTax.airlineTaxList_INF[0].value;
					surcharges = surcharges + surchargeInf;
				}
				sqData['surcharges']= surcharges.toString();
				sqData['transactionShipping']= surcharges.toString();
				sqData['flightSegment']= flightSegment1;
				sqData['tax'] = taxVal.toFixed(2);
				sqData['transactionTax']=  taxVal.toFixed(2);

				var quantity = 1;
				var code = "";
				var transactionPrice = 0;
				if (rqstParams.fareBreakdown.pnrs!=undefined){
					for(var i=0; i < rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos.length; i++){
						quantity = rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].number;
						code =  rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].travellerType.code
						transactionPrice = rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].travellerTypePrices[0].priceWithoutTax;
						transactionProducts[i]={};
						transactionProducts[i]["sku"] = i+1;
						transactionProducts[i]["name"] =  code + "|" + rqstParams.listItineraryBean.itineraries[0].cabins[0].name;
						transactionProducts[i]["category"] = "ET" + "|" +flightSegment1;
						transactionProducts[i]["price"] = transactionPrice.toString();
						transactionProducts[i]["quantity"] = quantity.toString();
					}
				}

				if (!this._merciFunc.isEmptyObject(rqstParams.fareBreakdown.rebookingStatus) && rqstParams.fareBreakdown.rebookingStatus) {
					if (rqstParams.fareBreakdown.tripPrices!=undefined){
						transactionProducts[i]={};
						transactionProducts[i]["sku"] = i+1;
						transactionProducts[i]["name"] =  "Rebooking Fee";
						transactionProducts[i]["category"] = "REB" + "|" +flightSegment1;
						transactionProducts[i]["price"] = rqstParams.fareBreakdown.tripPrices[0].rebookingFee.toString();
						transactionProducts[i]["quantity"] = quantity.toString();
					}
				}
				sqData["transactionProducts"] = transactionProducts;

				if(this.__merciFunc.isGTMEnabled()){
					 page = ((rqstParams.fareBreakdown.rebookingStatus == true)?'ATC 6-Reservation':'7-Reservation') + '?wt_market='+ ((base[13] != null)?base[13]:'') + '&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11];
					 pageid = ((rqstParams.fareBreakdown.rebookingStatus == true)?'ATC 6-Reservation':'7-Reservation');
					 category = pnrType;
					 if (this.GAExchRate != "" && this.GACurrCode != "") {
						conversionRate = this.GAExchRate;
					}
				}
			}
			
				this.__ga.trackTransaction({
					domain: siteParams.siteGADomain,
					account: siteParams.siteGAAccount,
					gaTransEnabled: siteParams.siteGAEnableTrans,
					gaEnabled: siteParams.siteGAEnable,
					officeId: siteParams.siteOfficeID,
					priceTTC: priceTTCVal.toFixed(2),
					tax: taxVal.toFixed(2),
					fee: '',
					city: '',
					state: '',
					country: '',
					transString: transStringVal,
					itemString1: itemString1Val,
					itemString2: itemString2Val,
					itemString3: itemString3Val,
					unitPrice: unitPriceVal.toFixed(2),
					nbPax: nbPaxVal,
					currencyCode: currencyCodeVal,
					page: page,
					pageid: pageid,
					category: category,
					milesCost : milesCost,
					sqData:sqData,
					flightNumber:flightNumber,
					conversionRate: conversionRate
				});
		},
		__onGACurrencyCB: function(response, args) {
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var resData = response.responseJSON;
			if (resData.currencyCode != null && resData.exchangeRate != null && resData.errorMessage != "") {
				this.GACurrCode = resData.currencyCode;
				this.GAExchRate = resData.exchangeRate;
				this.__gaTransaction(siteParams, rqstParams, base, this.pnrType);
			}
		},

		__createAutoCompleteInput: function(paxId, sourceList) {
			$("input#TITLE_" + paxId).autocomplete({
				source: sourceList,
				minLength: 2
			});
		},

		$displayReady: function() {
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			if (!this.isEmptyObject(jsonResponse.ui)) {
				if (jsonResponse.ui.BOOKMARK_ID != null) {
					pageObjConf.__deleteFavouriteItem();
				}
			}

			var bodiesEL = document.getElementsByTagName('body');
			if (bodiesEL != null && bodiesEL.length > 0) {
				bodiesEL[0].className = 'booking conf';
			}

			var spansEL = document.getElementsByTagName('span');
			if (spansEL != null) {
				for (var i = 0; i < spansEL.length; i++) {
					spansEL[i].className = spansEL[i].className.replace(/(?:^|\s)xWidget(?!\S)/g, '');
				}
			}

			// email and phonenumber
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			this.travellerEmail = '';
			this.travellerNo = '';
			var temail;
			if (rqstParams.listTravellerBean.travellers[0].identityInformation.contactPoints.E1) {
				temail = rqstParams.listTravellerBean.travellers[0].identityInformation.contactPoints.E1.description;
			} else {
				temail = '';
			}
			var tMobileNo;
			if (rqstParams.listTravellerBean.travellers[0].identityInformation.contactPoints.H1) {
				tMobileNo = rqstParams.listTravellerBean.travellers[0].identityInformation.contactPoints.H1.description;
			} else {
				tMobileNo = '';
			}
			//var tMobileAreaCode = rqstParams.listTravellerBean.travellers[0].identityInformation.contactPoints.M1.code;
			$('#travellerFromEmail').val(temail);
			//$('#travellerAreaCode').val(tMobileAreaCode);
			$('#travellerPhoneNo').val(tMobileNo);
			//alert('temail:  '+temail);
			//			var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			//			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			//			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			//
			// set details for header
			//			this.moduleCtrl.setHeaderInfo(labels.tx_merci_text_booking_conf_title, rqstParams.bannerHtml, siteParams.siteHomeURL, true);
			if (rqstParams.reply.pnrStatusCode == 'P' && this._merciFunc.booleanValue(siteParams.siteTimeToThinkEnbl) && !this.isEmptyObject(rqstParams.TIME_TO_THINK_PANEL_KEY)){
				document.getElementById("TTTPriceBrkDown").style.display = 'block';			
			}
		},
		cancelEmailShare: function() {
			console.log('cancelEmailShare');
			$(".panel.share-slider").hide();
			$(".msk").hide();
		},
		sendEmailShare: function() {
			console.log('sendEmailShare');

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

			/*var errors = [];
					if (toFieldEL == null || !filter.test(toFieldEL.value)) {
						errors.push({TEXT:this.errorStrings['2130282'].localizedMessage + " (" + this.errorStrings['2130282'].errorid + ")"});
					}

					if (fromFieldEL == null || !filter.test(fromFieldEL.value)) {
						errors.push({TEXT:this.errorStrings['25000048'].localizedMessage + " (" + this.errorStrings['25000048'].errorid + ")"});
					}

					this.__clearErrors();
					if (errors.length == 0) {




						var formElmt = document.getElementById(this.$getId('MailForm'));
						var request = this.__merciFunc.navigateRequest(formElmt, 'MMailWrapperAction.action', {fn: this.__sendEmailCallback, scope: this});
						modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);


					} else {
						this.__addErrors(errors);
					}*/

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
		__clearShareNotification:function(){
			if(document.getElementById('shareNot')!= undefined || document.getElementById('shareNot')!= null){
				document.getElementById('shareNot').innerHTML = '';
			}
		},
		/**
		 * Callback when receiving the response of the Send request
		 * If the next page is MmailError, forwards to MMail.action; otherwise regular behaviour
		 */
		__sendEmailCallback: function(response) {
			this.__clearShareNotification();
			//document.getElementsByClassName("msk loading")[0].style.display = "none";
			var json = response.responseJSON;
			if (json) {
				var pageId = json.homePageId;
				if (pageId === 'merci-MmailError') {
					//this.__addError({TEXT:this.errorStrings['2130024'].localizedMessage + " (" + this.errorStrings['2130024'].errorid + ")"}, true);
					$(".msk").css('z-index', '1');
					var div = document.createElement('div');
					div.className = 'msg warning';
					var content = '<ul><li class = "ext-came">' + this.emailData.errorMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('shareNot').appendChild(div);

				} else {

					var div = document.createElement('div');
					div.className = 'msg info';
					var content = '<ul><li class = "ext-came">' + this.emailData.successMessage + '</li></ul>';
					div.innerHTML = content;
					document.getElementById('sharedMsg').appendChild(div);

					$(".panel.share-slider").hide();
					$(".msk").hide();
					$(".msk").css('z-index', '1');
					// this.utils.navigateCallback(response, this.moduleCtrl);
					// aria.utils.DomOverlay.detachFrom(document.body);
				}
			}
		},
		cancelSMSShare: function() {
			console.log('cancelSMSShare');
			$(".panel.share-slider").hide();
			$(".msk").hide();
		},
		sendSMSShare: function() {
			console.log('sendSMSShare');
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
			//document.getElementsByClassName("msk loading")[0].style.display = "none";
			var json = response.responseJSON;
			if (json) {
				var pageId = json.homePageId;
				if (pageId === 'merci-book-MError_A') {
					// this.__addError({TEXT:this.errorStrings['2130024'].localizedMessage + " (" + this.errorStrings['2130024'].errorid + ")"}, true);
					$(".msk").css('z-index', '1');
				} else {
					$(".panel.share-slider").hide();
					$(".msk").hide();
					$(".msk").css('z-index', '1');
					// this.utils.navigateCallback(response, this.moduleCtrl);
					// aria.utils.DomOverlay.detachFrom(document.body);
				}
			}
		},
		$viewReady: function() {
			$('body').attr('id', 'bconf');
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			if (rqstParams.fareBreakdown.rebookingStatus == true) {
				if (this._merciFunc.booleanValue(rqstParams.awardsFlow)){
					$('body').attr('id', 'reaconf');
				}else{
					$('body').attr('id', 'reconf');
				}
			}else if (this._merciFunc.booleanValue(rqstParams.awardsFlow)) {
				$('body').attr('id', 'aconf');
			}
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if ((bp[14] != null && (bp[14].toLowerCase() == 'iphone' || bp[14].toLowerCase() == 'android')) && (pageObjConf.__merciFunc.isRequestFromApps() != true)) {
				this._setTripOverviewJSON();
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MConf",
						data:this.data
					});
			}

		},

		isEmptyObject: function(obj) {
			return this._merciFunc.isEmptyObject(obj);
		},


		toggleExpand: function(wrapper, args) {
			// calling common method
			this._merciFunc.toggleExpand(wrapper, args);
		},

		_getTravellerName: function(ticket, traveller) {

			var travellerName = '';
			var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;

			if (traveller != null && ticket != null) {

				// create default traveller name to be displayed
				travellerName = traveller.identityInformation.titleName + ' ' + traveller.identityInformation.firstName + ' ' + traveller.identityInformation.lastName;

				// infant check
				if (ticket.faFh != null) {
					if (ticket.faFh.passengerType == 'INF') {
						// i.e. ticket contains only an Infant Passenger
						return new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
					} else if (ticket.faFh.infantIncluded) {
						if (siteParameters.siteDispInfantName != null && siteParameters.siteDispInfantName.toLowerCase() == 'true') {
							var infantName = new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithoutInfantName).formatString([travellerName, infantName]);
						} else {
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithInfantName).formatString([travellerName]);
						}
					}
				}
			}

			return travellerName;
		},

		_isTicketed: function() {

			var isTicketed = true;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;

			if (!this.isEmptyObject(rqstParams.reply.airFromDMOUT)) {
				for (var i = 0; i < rqstParams.reply.airFromDMOUT.length; i++) {
					var current = rqstParams.reply.airFromDMOUT[i];
					if (current.LIST_PNR != null && current.LIST_PNR != "") {
						for (var j = 0; j < current.LIST_PNR.length; j++) {
							var pnr = current.LIST_PNR[j];
							if (pnr.LIST_TRAVELLER_TYPE != null && pnr.LIST_TRAVELLER_TYPE != "") {
								for (var k = 0; k < pnr.LIST_TRAVELLER_TYPE.length; k++) {
									var travellerType = pnr.LIST_TRAVELLER_TYPE[k];
									if (travellerType.LIST_TRAVELLER != null && travellerType.LIST_TRAVELLER != "") {
										for (var l = 0; l < travellerType.LIST_TRAVELLER.length; l++) {
											var traveller = travellerType.LIST_TRAVELLER[l];
											if (traveller.ORIGINAL_TICKET != null && traveller.ORIGINAL_TICKET != "" && traveller.ORIGINAL_TICKET.PNR_DATA != null && traveller.ORIGINAL_TICKET.PNR_DATA != "" && traveller.ORIGINAL_TICKET.PNR_DATA.PASSENGERS != null && traveller.ORIGINAL_TICKET.PNR_DATA.PASSENGERS != "") {
												for (var m = 0; m < traveller.ORIGINAL_TICKET.PNR_DATA.PASSENGERS.length; m++) {
													var passenger = traveller.ORIGINAL_TICKET.PNR_DATA.PASSENGERS[m];
													if (passenger.IS_TICKETED == "" || passenger.IS_TICKETED == 'false') {
														isTicketed = false;
													}
												}
											} else if (current.IS_AIR_TICKETED != null && current.IS_AIR_TICKETED != "") {
												isTicketed = current.IS_AIR_TICKETED;
											} else {
												isTicketed = false;
											}
										}
									} else {
										isTicketed = false;
									}
								}
							} else {
								isTicketed = false;
							}
						}
					} else {
						isTicketed = false;
					}
				}
			} else {
				if (!this.isEmptyObject(rqstParams.tripPlanBean.isETicket)) {
					isTicketed = rqstParams.tripPlanBean.isETicket;
				} else {
					isTicketed = false;
				}
			}

			return isTicketed;
		},

		/** Function to toggle the add trip to calendar button */
		toggleCalBtn: function(ATArgs, args) {
			if (document.getElementById("appCallId").style.display == 'none') {
				document.getElementById("appCallId").style.display = 'block';
			} else {
				document.getElementById("appCallId").style.display = 'none';
			}
			this._merciFunc.toggleClass(document.getElementById("confCal"), "datepicker");
			this._merciFunc.toggleClass(document.getElementById("appCalTog"), "active");
		},

		/** Function to control adding and viewing trip to calendar */
		confAppcallback: function(ATArgs, args) {
			if (args.pnrLoc != '') {
				this._merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam.appcallback, "://?flow=searchpage/add_to_calendar=" + args.pnrLoc);
				document.getElementById("confCal").innerHtml = this.moduleCtrl.getModuleData().booking.MCONF_A.labels.tx_merciapps_view_trip_in_calendar;

				this.isTripAddedToCal = true;
			}
		},

		getDateInyyyyMMddhhmm: function(dValue) {
			if (dValue != null && dValue != "") {
				var dateValue = new Date(dValue);
				var yr = dateValue.getFullYear();
				var mth = dateValue.getMonth();
				var dte = dateValue.getDate();
				var hrs = dateValue.getHours();
				var mins = dateValue.getMinutes();

				return "" + yr + (mth.length == 1 ? "0" + mth : mth) + (dte.length == 1 ? "0" + dte : dte) + "-" + (hrs.length == 1 ? "0" + hrs : hrs) + (mins.length == 1 ? "0" + mins : mins);
			}

			return "";
		},

		_getEticketEmail: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;

			if (rqstParams.listTravellerBean.primaryTraveller != null && rqstParams.listTravellerBean.primaryTraveller.identityInformation != null) {
				return rqstParams.listTravellerBean.primaryTraveller.identityInformation.email1;
			}

			return '';
		},

		/* Function to set tripOverViewJSON into hidden input tag - json_resp of MAria_index.html for Apps*/
		_setTripOverviewJSON: function() {

			var parameters = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var recLoc = parameters.tripPlanBean.REC_LOC;
			var lastName = parameters.listTravellerBean.primaryTraveller.identityInformation.lastName;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var client = "";
			var enableDeviceCal = "";
			if (bp[14] != null && bp[14] != '') {
				var client = bp[14].toLowerCase();
			}
			if (bp[15] != null && bp[15] != '') {
				enableDeviceCal = bp[15].toLowerCase();
			}
			var params = "REC_LOC_TYPE=BOOKINGREF" + "&REC_LOC=" + recLoc + "&DIRECT_RETRIEVE_LASTNAME=" + lastName + "&DIRECT_RETRIEVE=true" + "&ACTION=MODIFY" + "&TYPE=retrieve" + "&NEW_RETRIEVE=Y" + "&client=" + client + "&ENABLE_DEVICECAL=" + enableDeviceCal + "&SITE=" + parameters.param.paramSite + "&LANGUAGE=" + parameters.param.language + "&result=json";

			var request = {
				parameters: params,
				action: "MPNRValidate.action",
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onSetTripOverviewJSONCallback,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		/* Callback function to set tripOverViewJSON into hidden input tag - json_resp of MAria_index.html for Apps */
		__onSetTripOverviewJSONCallback: function(response, params) {
			if (response != null && response.responseJSON != null) {
				if (pageObjConf.__merciFunc.isRequestFromApps() == true) {
					var recLoc = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.tripPlanBean.REC_LOC;
					pageObjConf.retrieveData = new Object();
					pageObjConf.retrieveData.MBookingDetails = response.responseJSON.data.MBookingDetails;
					pageObjConf.retrieveData.MFlightDetails = response.responseJSON.data.MFlightDetails;
					pageObjConf.retrieveData.MHotelDetails = response.responseJSON.data.MHotelDetails;
					pageObjConf.retrieveData.MCarDetails = response.responseJSON.data.MCarDetails;
					pageObjConf.retrieveData.MPassengerDetails = response.responseJSON.data.MPassengerDetails;
					pageObjConf.retrieveData.MInsuranceDetails = response.responseJSON.data.MInsuranceDetails;

					var key = recLoc + "_" + merciAppData.DB_TRIPDETAIL;
					pageObjConf.__merciFunc.getStoredItemFromDevice(key, function(result) {

						if (result == null || result == "" || pageObjConf.__merciFunc.isEmptyObject(result)) {
							pageObjConf.__merciFunc.storeLocalInDevice(key, pageObjConf.retrieveData, "overwrite", "json");
						}
					});
				} else {
					/*PTR 08490510 [Medium]: MeRCI R17 : Unable to retrieve PNR- AFter booking from My trips tab*/
					/*document.getElementById("json_resp").value = window.btoa(encodeURIComponent(JSON.stringify(response.responseJSON)));*/
					if (LZString) {
						var compressed = LZString.compressToBase64(encodeURIComponent(JSON.stringify(response.responseJSON)));
						document.getElementById("json_resp").value = compressed;
					}
					/*END: PTR 08490510 [Medium]: MeRCI R17 : Unable to retrieve PNR- AFter booking from My trips tab*/
				}
			}
			if (pageObjConf.__merciFunc.isRequestFromApps() == false) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				if (bp[14] != null && bp[14] != '') {
					this._merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam.appcallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
				}
			}
		},

		fetchBookmarkData: function() {
			var bookmarkStr = "";
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			if (rqstParams.BOOKMARK_ID != "" && JSON.stringify(rqstParams.BOOKMARK_ID) != '{}') {
				bookmarkStr = "kfmiles=" + JSON.stringify(rqstParams.milesConf) + "&isBookingDone=True&BOOKMARK_ID=" + rqstParams.BOOKMARK_ID;
			}
			return bookmarkStr;
		},

		/* Function to set hidden input tag - ret_pnr_data of MAria_index.html for Apps */
		fetchAppsTripData: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var primTravLastName = rqstParams.listTravellerBean.primaryTraveller.identityInformation.lastName;

			var tripStr = "";
			tripStr += rqstParams.tripPlanBean.REC_LOC;
			tripStr += "|";
			tripStr += primTravLastName;
			tripStr += "|";

			var itineraries = rqstParams.listItineraryBean.itineraries;
			var beginLoc = "";
			var beginLocCode = "";
			var beginDate = "";
			var endLoc = "";
			var endLocCode = "";
			var endDate = "";

			if (itineraries != null) {
				for (i = 0; i < itineraries.length; i++) {
					var bItinerary = itineraries[i];
					if (i == 0) {
						beginLoc = bItinerary.beginLocation.cityName;
						beginLocCode = bItinerary.beginLocation.locationCode;
						beginDate = bItinerary.beginDate;
					}

					endLoc = bItinerary.endLocation.cityName;
					endLocCode = bItinerary.endLocation.locationCode;

					if (i > 0) {
						endDate = bItinerary.endDate;

						endLoc = bItinerary.beginLocation.cityName;
						endLocCode = bItinerary.beginLocation.locationCode;
					}
				}

				tripStr = tripStr + beginLoc + "|" + beginLocCode + "|" + endLoc + "|" + endLocCode + "|" + beginDate;

				if (endDate != null && endDate != "") {
					tripStr += "|" + endDate;
				}
			}

			return tripStr;
		},

		fetchAppsCalendarData: function() {
			var calendarJSON = this.getAddToCalendarJson();
			return encodeURIComponent(JSON.stringify(calendarJSON));
		},

		onContactUsClick: function(event, args) {
			// navigate to contact us page
			var params = 'result=json&REC_LOC=&BCKTOHOME=BCKTOHOME&DIRECT_RETRIEVE=true&JSP_NAME_KEY=SITE_JSP_STATE_RETRIEVED';
			this._merciFunc.sendNavigateRequest(params, 'MContact.action', this);
		},
		_getSize: function(obj) {
			var size = 0,
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},

		/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- START*/

		isMopSadad: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			if (siteParams.siteSadadPayment == "TRUE" && rqstParams.param.paymentType == "ASN")
				return true;
			else
				return false;
		},
		getOpcDateSadad: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var onHoldBean = rqstParams.onHoldBean;
			var opcDate = null;
			if (!this.__merciFunc.isEmptyObject(onHoldBean)) {
				var dateParams = onHoldBean.pnrCancellationDate.jsDateParams.split(",");
				var opcDate = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				var opcDateSadadMilliseconds = opcDate.getTime() - 3600000; /*subtracting one hour according to SADAD guidelines*/
				opcDate = new Date(opcDateSadadMilliseconds);
			}
			return opcDate;
		},
		getFormattedDateString: function(opcDate) {
			var pattern = this.moduleCtrl.getModuleData().booking.MCONF_A.labels.tx_merci_pattern_sadad_cancel_warning;
			var opcDayString = aria.utils.Date.format(opcDate, "EEEE d MMMM yyyy");
			var opcTimeString = aria.utils.Date.format(opcDate, "HH:mm");
			var finalWarningMessage = this.__merciFunc.formatString(pattern, opcDayString, opcTimeString);
			var opcDayStringIndex = finalWarningMessage.indexOf(opcDayString);
			var opcTimeStringIndex = finalWarningMessage.indexOf(opcTimeString);
			var formattedWarningMessage = finalWarningMessage.substr(0, opcDayStringIndex) + '<b>' + opcDayString + '</b>' + finalWarningMessage.substr(opcDayStringIndex + opcDayString.length, opcTimeString.length) + '<b>' + opcTimeString + '</b>' + finalWarningMessage.substr(opcTimeStringIndex + opcTimeString.length);
			return formattedWarningMessage;
		},
		_isInstallmentsEnabled: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			return this._merciFunc.booleanValue(siteParams.siteInstallmentsEnabled) && this._merciFunc.booleanValue(siteParams.merciInstallmentsEnabled) && this._merciFunc.booleanValue(rqstParams.isInstallmentPlanSelected);
		},

		/* Methods for PhoneGap calendar plugin */
		viewInCalendarJson: function(ATArgs, args) {
			var itineraries = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.listItineraryBean.itineraries;
			var viewCalendarJSON = {
				isAddedEvents: "",
				calendarEvents: []
			};
			if (itineraries && itineraries.length > 0) {

				viewCalendarJSON.isAddedEvents = "true";

				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop
					// If itinerary is not flown, add to calendar
					var itinerary = itineraries[itineraryIndex];
					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
						// segment loop
						var segment = itinerary.segments[segmentIndex];
						var startDate = new Date(segment.beginDate);
						if (segment.segmentFlown == true) {
							continue;
						} else {
							viewCalendarJSON.calendarEvents.push({
								"index": itineraryIndex + segmentIndex,
								"flightNumber": segment.airline.code + " " + segment.flightNumber,
								"origin": segment.beginLocation.cityName,
								"startTime": new Date(segment.beginDate).getTime(),
								"destination": segment.endLocation.cityName,
								"endTime": new Date(segment.endDate).getTime()
							});
							//break;
						}

					}

				}

			}
			console.log("viewCalendarJSON day view :: " + viewCalendarJSON);
			return viewCalendarJSON;
		},

		getAddToCalendarJson: function() {

			var itineraries = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.listItineraryBean.itineraries;
			var calendarJSON = {
				eventsKey: "",
				calendarEvents: []
			};
			if (itineraries && itineraries.length > 0) {

				calendarJSON.eventsKey = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.tripPlanBean.REC_LOC;
				var customUri = this.getCustomURI();
				//var itineraries = this.moduleCtrl.getModuleData().MBookingDetails.reply.tripplan.pnr.itineraries;
				for (var itineraryIndex = 0; itineraryIndex < itineraries.length; itineraryIndex++) {
					// itinerary loop

					var itinerary = itineraries[itineraryIndex];

					for (var segmentIndex = 0; segmentIndex < itinerary.segments.length; segmentIndex++) {
						// segment loop

						var segment = itinerary.segments[segmentIndex];
						var startDate = new Date(segment.beginDateGMT);
						var endDate = new Date(segment.endDateGMT);
						calendarJSON.calendarEvents.push({
							"index": itineraryIndex + segmentIndex,
							"title": segment.airline.code + " " + segment.flightNumber + "\n" + segment.beginLocation.locationName + " - " + segment.endLocation.locationName,
							"description": "Departure Terminal : " + segment.beginTerminal + "\n" + "Arrival Terminal : " + segment.endTerminal + "\n" 
											+ "stops :" + segment.nbrOfStops + "\n" /*+"Layover time : "++"\n"*/ 
											+ customUri + "://pnr=" + this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.tripPlanBean.REC_LOC,
							"eventLocation": segment.beginLocation.cityName,
							"startTime": startDate.getTime(),
							"endTime": endDate.getTime()
						});
					}

				}

			}
			return calendarJSON;
		},
		
		getCustomURI: function(){
			var customURI = "merci.mo";
			if(this.__merciFunc.isRequestFromApps() == true){
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

			var itineraries = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam.listItineraryBean.itineraries;
			var date = "";
			if (itineraries && itineraries.length > 0) {
				var itineraries = this.moduleCtrl.getModuleData().MBookingDetails.reply.tripplan.pnr.itineraries;
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
			var parameters = pageObjConf.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var recLoc = parameters.tripPlanBean.REC_LOC;

			if (pageObjConf._merciFunc.booleanValue(pageObjConf._merciFunc.getStoredItem(recLoc + "_CAL")) == false) {
				var calEventsJSON = this.getAddToCalendarJson();
				if (calEventsJSON != null) {
					pageObjConf._merciFunc.storeLocal(recLoc + "_CAL", true, "overwrite", "json");
					document.getElementById('calenderView').setAttribute('class', 'icon-viewcalendar');
					pageObjConf._merciFunc.addEventsToCalendarDispOverlay(calEventsJSON, pageObjConf);
				}
			} else {
				pageObjConf.viewTripInCalendar();
			}

		},

		viewTripInCalendar: function(ATArgs, args) {
			var viewCalendarJSON = this.viewInCalendarJson();
			if (viewCalendarJSON != null) {
				this._merciFunc.viewEventsInCalendar(viewCalendarJSON);
			};

		},

		/* END: Methods for PhoneGap calendar plugin */
		onTripListParameters: function(labels, siteParams, rqstParams) {

			if (rqstParams.reply.pageTicket != undefined || rqstParams.reply.pageTicket != null) {
				var tripPageTicket = rqstParams.reply.pageTicket;
			} else {
				var tripPageTicket = "";
			};

			var tripLabels = {
				"tx_merci_text_mytrip": labels.tx_merci_text_mytrip,
				"tx_pltg_text_EvoucherTrip": labels.tx_pltg_text_EvoucherTrip,
				"tx_merci_text_is_trip_listed": labels.tx_merci_text_is_trip_listed,
				"tx_merci_text_is_retrieve": labels.tx_merci_text_is_retrieve,
				"tx_merci_text_booking_refnumber": labels.tx_merci_text_booking_refnumber,
				"tx_pltg_pattern_RecordLocator": labels.tx_pltg_pattern_RecordLocator
			};

			var tripConfig = {
				"siteGAEnableTrans": siteParams.siteGAEnableTrans,
				"siteGAErrDomain": siteParams.siteGAErrDomain,
				"siteGAEnable": siteParams.siteGAEnable,
				"siteOfficeId": siteParams.siteOfficeId,
				"siteGAErrEnabled": siteParams.siteGAErrEnabled,
				"siteGAErrAccount": siteParams.siteGAErrAccount
			};

			var segmentDetails = [];
			for (var itineraryIndex in rqstParams.listItineraryBean.itineraries){
				for (var i in rqstParams.listItineraryBean.itineraries[itineraryIndex].segments) {
					segmentDetails.push({
						"departureCityCode": rqstParams.listItineraryBean.itineraries[itineraryIndex].segments[i].beginLocation.cityCode,
						"arrivalCityCode": rqstParams.listItineraryBean.itineraries[itineraryIndex].segments[i].endLocation.cityCode,
						"depDate": rqstParams.listItineraryBean.itineraries[itineraryIndex].segments[i].beginDate,
						"arrDate": rqstParams.listItineraryBean.itineraries[itineraryIndex].segments[i].endDate
					});
				}
			}
			var jSondata = {
				"lastName": rqstParams.listTravellerBean.primaryTraveller.identityInformation.lastName,
				"ECityName": rqstParams.listItineraryBean.itineraries[0].endLocation.cityCode,
				"BCityName": rqstParams.listItineraryBean.itineraries[0].beginLocation.cityName,
				"pastTrip": rqstParams.listItineraryBean.itineraries[0].boolFlownStatus,
				"ECityCode": rqstParams.listItineraryBean.itineraries[0].endLocation.cityCode,
				"evoucher": false,
				"BDate": rqstParams.listItineraryBean.itineraries[0].beginDateBean.date,
				"BCityCode": rqstParams.listItineraryBean.itineraries[0].beginLocation.cityCode,
				"recLoc": rqstParams.tripPlanBean.REC_LOC.toUpperCase(),
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
			var dataFound=false;
			var jsonTripList = {};

			that.__merciFunc.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
				if (result != null && result != "") {

					if (typeof result === 'string') {
						jsonTripList = JSON.parse(result);
					} else {
						jsonTripList = (result);
					}

					if (!that.__merciFunc.isEmptyObject(jsonTripList)) {

						var tripListData = jsonTripList["detailArray"];
						for (var key in tripListData) {
							if ((rqstParams.tripPlanBean.REC_LOC).toUpperCase() != (key).toUpperCase()) {
								tripListData[rqstParams.tripPlanBean.REC_LOC.toUpperCase()] = jSondata;
								that.__merciFunc.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
							}else{
								dataFound=true;
							}
						}
					}else if ((that.__merciFunc.isEmptyObject(jsonTripList)) || (jsonTripList == null)) {
						var tripListData = {};
						tripListData[rqstParams.tripPlanBean.REC_LOC.toUpperCase()] = jSondata;
						jsonTripList["labels"] = tripLabels;
						jsonTripList["config"] = tripConfig;
						jsonTripList["pageTicket"] = tripPageTicket;
						jsonTripList["detailArray"] = tripListData;
						dataFound=false;
						that.__merciFunc.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
					}
				} else {

					if ((that.__merciFunc.isEmptyObject(result))|| (result == null)) {

						var tripListData = {};
						tripListData[rqstParams.tripPlanBean.REC_LOC.toUpperCase()] = jSondata;
						jsonTripList["labels"] = tripLabels;
						jsonTripList["config"] = tripConfig;
						jsonTripList["pageTicket"] = tripPageTicket;
						jsonTripList["detailArray"] = tripListData;
						dataFound=false;
						that.__merciFunc.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
					}
				}
				if(dataFound==false){
					that.$json.setValue(jsonResponse.ui, "cntTrip", jsonResponse.ui.cntTrip + 1);
				}
			});

			}
		},

		isRebookingFlow: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			return !this.isEmptyObject(rqstParams.fareBreakdown.rebookingStatus) && rqstParams.fareBreakdown.rebookingStatus;
		},
		_getDateTime: function(dateBean) {
			if (dateBean != null && (dateBean.jsDateParams != null || dateBean.jsDateParameters != null)) {
				if(dateBean.jsDateParams != null){
				var dateParams = dateBean.jsDateParams.split(',');
				}else if(dateBean.jsDateParameters != null){
					var dateParams = dateBean.jsDateParameters.split(',');
				}
				var dtTime = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				return dtTime;
			}
			return null;
		},

		__deleteFavouriteItem: function() {

			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			//pageObjConf._merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {

				if (result && result != "") {
					if (typeof result === 'string') {
						pageObjConf.jsonObj = JSON.parse(result);
					} else {
						pageObjConf.jsonObj = result;
					}
					var deleteData = false;
					if (!pageObjConf._merciFunc.isEmptyObject(pageObjConf.jsonObj)) {

						if (!pageObjConf._merciFunc.isEmptyObject(pageObjConf.jsonObj.RVNWFARESTATUS)) {
							for (var key in pageObjConf.jsonObj.RVNWFARESTATUS) {
								if (jsonResponse.ui.BOOKMARK_ID == pageObjConf.jsonObj.RVNWFARESTATUS[key].currDT) {
									delete pageObjConf.jsonObj.RVNWFARESTATUS[key];
									delete pageObjConf.jsonObj.RVNWFAREINFO[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

						if (!pageObjConf._merciFunc.isEmptyObject(pageObjConf.jsonObj.DEALFARESTATUS)) {
							for (var key in pageObjConf.jsonObj.DEALFARESTATUS) {
								if (jsonResponse.ui.BOOKMARK_ID > pageObjConf.jsonObj.DEALFARESTATUS[key].currDT) {
									delete pageObjConf.jsonObj.DEALFARESTATUS[key];
									delete pageObjConf.jsonObj.DEALFAREINFO[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

						if (deleteData = true) {
							pageObjConf.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
							var setData=this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE,pageObjConf.jsonObj);
							pageObjConf._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjConf.jsonObj, "overwrite", "json");
						};
					};

				}

			//});
		},
		toggleCalendarAlert: function(scope,args) {
			if(args=="added" || (args && args.id && args.id=="added")){
				var overlayDiv = document.getElementById(this.$getId('addTripToCalendarAlertOverlay'));
				pageObjConf._merciFunc.toggleClass(overlayDiv, 'on');
			}
		},

		getAddTripLabel:function(){
			var label= this.moduleCtrl.getModuleData().booking.MCONF_A.labels.tx_merciapps_trip_added_to_calendar;
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
			var label= this.moduleCtrl.getModuleData().booking.MCONF_A.labels.tx_merciapps_ok;
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
		
		__getPayLaterEligibility: function(){
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
			var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			var payLaterEligibility = {
										"ispayLaterEnbl" : "FALSE",
										"timeToThinkEnbl" : "FALSE"
									}
			if (this._merciFunc.booleanValue(siteParams.siteAllowPayLater) && rqstParams.payLaterBean.onHoldEligible){
				payLaterEligibility.ispayLaterEnbl = "TRUE";
			}
			if (payLaterEligibility.ispayLaterEnbl == 'FALSE' && this._merciFunc.booleanValue(siteParams.siteTimeToThinkEnbl) && !this._merciFunc.isEmptyObject(rqstParams.TIME_TO_THINK_PANEL_KEY)){
				payLaterEligibility.timeToThinkEnbl = "TRUE";
			}
			return payLaterEligibility;
		},
		
		/**
		 * function used generate acknowledgement URL<br/>
		 * this function replaces http or https with existing protocol
		 * @param args
		 *			- url: acknowledgement url
		 */
		makeAcknowledgement: function(args) {
			if (args == null || args.url == null) {
				return;
			}
			
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (args.url.substring(0,5) == 'http:') {
				args.url = args.url.replace('http://', base[0] + '://');
			} else if (args.url.substring(0,5) == 'https') {
				args.url = args.url.replace('https://', base[0] + '://');
			} else {
				args.url = base[0] + '://' + args.url;
			}
			
			var ackImage = new Image();
			ackImage.src = args.url;
		}		
	}
});