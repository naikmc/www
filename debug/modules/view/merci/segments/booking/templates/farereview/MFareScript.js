Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.segments.booking.scripts.MBookingMethods',
		'modules.view.merci.common.utils.MDWMContentUtil'
	],
	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.dwmUtils = modules.view.merci.common.utils.MDWMContentUtil;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.__strBuffer = modules.view.merci.common.utils.StringBufferImpl;
		this.currCode = "";
		this.exchRate = "";
		pageObjFare = this;
	},

	$prototype: {
		logInProfile: function(event, args) {

			rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;
			var b_Location = document.getElementById("B_LOCATION_0").value;
			var e_Location = document.getElementById("E_LOCATION_0").value;
			var b_Date = document.getElementById("B_DATE_0").value;
			var e_Date = document.getElementById("E_DATE_0").value;
			var obfeeval = document.getElementById("OBFEEVAL").value;
			var link1 = 'http://localhost/plnext/dev/Override.action?SITE=BDSUMERC&debug=TRUE&COUNTRY_SITE=SG&LANGUAGE=GB&MT=A&UI_EMBEDDED_TRANSACTION=MAddElementsTravellerInformation&SO_SITE_MC_GOTO_UIREV_FLOW=TRUE';

			var params = 'result=json' + '&url=' + escape(link1) + '&CABIN=' + rqstParams.reply.cabin + '&FROM_PAX=FALSE' + '&IS_WEBFARES= ' + '&PAGE_TICKET=' + rqstParams.reply.pageTicket + '&TYPE=AIR_TRIP_FARE' + '&RESTRICTION=' + rqstParams.reply.restriction + '&COMMERCIAL_FARE_FAMILY_1=' + rqstParams.commercialFareFamily +
				'&upsellOutLow=' + rqstParams.param.upsellOutLow + '&upsellInLow=' + rqstParams.param.upsellInLow + '&FLOW_TYPE=' + rqstParams.param.FLOW_TYPE + '&TRIP_TYPE=' + rqstParams.param.TRIP_TYPE + '&PRICING_TYPE=' + rqstParams.param.PRICING_TYPE +
				'&ENABLE_LATE_LOGIN=YES&KF_REDEEM=false&IS_BOOKMARK_FLOW=false&B_LOCATION_0=' + b_Location + '&E_LOCATION_0=' + e_Location + '&B_DATE_0=' + b_Date + '&E_DATE_0=' + e_Date + '&OBFEEVAL=' + obfeeval;

			var request = {

				parameters: params,
				action: 'MDirectLoginAction.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				isSecured: true,
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
					this.__merciFunc.extendModuleData(json, response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}

			}
		},

		__onFareFormCallBack: function(response, params) {
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null && response.responseJSON.data.booking != null && dataId != 'MFARE_A') {
				json.booking[dataId] = response.responseJSON.data.booking[dataId];
				json.header = response.responseJSON.data.header;
				// navigate to next page
				this.moduleCtrl.navigate(null, nextPage);
			} else {
				var rqstParams = response.responseJSON.data.booking.MFARE_A.requestParam;
				if (rqstParams.reply.listMsg != null) {
					this.data.errors = rqstParams.reply.listMsg;
				}
			}
		},
		logOutProfile: function(event, args) {
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
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		$dataReady: function() {

			var labels = this.moduleCtrl.getModuleData().booking.MFARE_A.labels;
			this.data.labels = labels;
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam;
			var globalLists = this.moduleCtrl.getModuleData().booking.MFARE_A.globalList;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;

			if(!this.__merciFunc.isEmptyObject(jsonResponse.currencyCode)){
				this.currCode = jsonResponse.currencyCode;
				delete jsonResponse.currencyCode;
			}
			if(!this.__merciFunc.isEmptyObject(jsonResponse.exchangeRate)){
				this.exchRate = jsonResponse.exchangeRate;
				delete jsonResponse.exchangeRate;
			}

			if(rqstParams.param != undefined){
				if (rqstParams.param.BOOKMARK_ID != undefined) {
					if (jsonResponse.ui != undefined && !this.__merciFunc.isEmptyObject(jsonResponse.ui)) {
						jsonResponse.ui.BOOKMARK_ID = rqstParams.param.BOOKMARK_ID;
					} else {
						jsonResponse.ui = {};
						jsonResponse.ui.BOOKMARK_ID = null;
					}
				} else {
					jsonResponse.ui.BOOKMARK_ID = null;
				}
				if (rqstParams.param.FLOW_TYPE != undefined) {
					pageObjFare.FLOW_TYPE=rqstParams.param.FLOW_TYPE;
				} else {
					pageObjFare.FLOW_TYPE= null;
				}
			}

			// set errors
			if (rqstParams.reply.listMsg != null) {
				this.data.errors = rqstParams.reply.listMsg;
			}
			var sqData ={};
		


			if(!this.__merciFunc.isEmptyObject(siteParams.isSQFlow)){

				if(!this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)){
					sqData['typeOfSearch'] = 'ORB';
					sqData['price'] =  rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[0].travellerPrices[0].tax.toString() ;
				} 
				else if (!this.__merciFunc.isEmptyObject(rqstParams.isRebooking)){
					sqData['typeOfSearch'] = 'ATC';
					sqData['price'] = rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount.toString();
				}
				else{
					sqData['typeOfSearch'] = 'CIB';
					sqData['price'] = rqstParams.fareBreakdown.tripPrices[0].totalAmount.toString();
				}
				
				
				
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
				sqData['flightSegment'] = flightSegment1;
					
				if(rqstParams.param.TRIP_TYPE=='R'){	
						var arrDay = rqstParams.listItineraryBean.itineraries[1].endDateBean.day.toString();
						var arrivalMonth = rqstParams.listItineraryBean.itineraries[1].endDateBean.month+1;
						var arrMonth = arrivalMonth.toString();
						var arrYear = rqstParams.listItineraryBean.itineraries[1].endDateBean.year.toString();
					var returnFlightNumber = [];
					for(var j=0; j<rqstParams.listItineraryBean.itineraries[1].segments.length; j++){
					returnFlightNumber.push(rqstParams.listItineraryBean.itineraries[1].segments[j].airline.code + rqstParams.listItineraryBean.itineraries[1].segments[j].flightNumber);
					}
					returnFlightNumber = returnFlightNumber.join(); 
					var arrivalDate = arrDay + "-" + arrMonth + "-" + arrYear;
					sqData['typeOfTrip'] = "Return" ;
					sqData['returnDate'] = arrivalDate.toString();
					sqData['retDay'] = arrDay;
					sqData['retMonth'] = arrMonth;
					sqData['retYear'] =  arrYear;
					sqData['returnFlightNumber'] = returnFlightNumber;
				}else{
					sqData['retDay'] = "NA";
					sqData['retMonth'] = "NA";
					sqData['retYear'] =  "NA";
					sqData['returnDate'] = "NA";
					sqData['typeOfTrip'] = "One-Way" ;
					sqData['returnFlightNumber'] = "NA";
				}
				
						var depDay = rqstParams.listItineraryBean.itineraries[0].beginDateBean.day.toString();
						var departureMonth = rqstParams.listItineraryBean.itineraries[0].beginDateBean.month+1;
						var depMonth = departureMonth.toString();
						var depYear = rqstParams.listItineraryBean.itineraries[0].beginDateBean.year.toString();
				sqData['numOfAdults'] = "0";
				sqData['numOfChildren'] = "0";
				sqData['numOfInfants'] = "0" ;
				
				for (var i=0;i<rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos.length; i++){
					if (rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].travellerType.code == "ADT"){
							sqData['numOfAdults'] = rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].number.toString();
					}else if (rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].travellerType.code == "CHD"){
						sqData['numOfChildren']  = rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].number.toString();
					}else{
						sqData['numOfInfants'] = rqstParams.fareBreakdown.pnrs[0].travellerTypesInfos[i].number.toString();
					}
				
				}
				
				var departureFlightNumber = [];
					for(var j=0; j<rqstParams.listItineraryBean.itineraries[0].segments.length; j++){
					departureFlightNumber.push(rqstParams.listItineraryBean.itineraries[0].segments[j].airline.code + rqstParams.listItineraryBean.itineraries[0].segments[j].flightNumber);
					}
					departureFlightNumber = departureFlightNumber.join(); 
				
				var dateOfJourney = new Date(depYear, depMonth, depDay);
				var d1 = new Date();
				var day = d1.getDate();
				var month = d1.getMonth() + 1;
				var year = d1.getFullYear();
				var curdate = day + "/" + month + "/" + year;
				var curDate = new Date(year, month, day);	
				var diffDate = dateOfJourney.getTime() - curDate.getTime();
				var noOfDays = diffDate/(24 * 60 * 60 * 1000);
				var numOfDaystoDeparture = noOfDays.toString();		
				sqData['numOfDaystoDeparture'] = numOfDaystoDeparture.toString() ;	
				if(this.data.rqstParams.fpowPanelKey != undefined && this.data.rqstParams.fpowPanelKey.currency != undefined){
				sqData['currency'] = this.currCode ;	
				}
				sqData['pointOfSale'] = ((base[13] != null) ? base[13] : '') ;
				sqData['cabin'] = rqstParams.listItineraryBean.itineraries[0].segments[0].cabins[0].name ;
				
				sqData['event'] = 'ReviewFlight' ;
				sqData['RBD'] = rqstParams.listItineraryBean.itineraries[0].segments[0].cabins[0].RBD ;
				
				sqData['departureFlightNumber'] = departureFlightNumber;
				
				sqData['origin'] = rqstParams.listItineraryBean.itineraries[0].beginLocation.cityCode;
				sqData['destination'] = rqstParams.listItineraryBean.itineraries[0].endLocation.cityCode;
				sqData['depDay'] = depDay.toString();
				sqData['depMonth'] = depMonth.toString();
				sqData['depYear'] = depYear.toString();
				var departureDate = depDay + "-" + depMonth + "-" + depYear;
				sqData['departureDate'] = departureDate.toString();


			}

			



			// google analytics
			this.__ga.trackPage({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				sqData:sqData,
				page: ((this._isRebookingFlow()) ? 'ATC 4 Trip Summary' : '4-Trip Summary') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeId + '&wt_sitecode=' + base[11],
				GTMPage: ((this._isRebookingFlow()) ? 'ATC 4 Trip Summary' : '4-Trip Summary') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeId + '&wt_sitecode=' + base[11]
			});

			if (this.moduleCtrl.getModuleData().booking != null && !this.__merciFunc.isEmptyObject(this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam.reply.IS_USER_LOGGED_IN)) {
				this.IS_USER_LOGGED_IN = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam.reply.IS_USER_LOGGED_IN;
				this.IS_USER_LOGGED_IN = this.__merciFunc.booleanValue(this.IS_USER_LOGGED_IN);
			} else if (this.moduleCtrl.getModuleData().booking != null && !this.__merciFunc.isEmptyObject(this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam.reply.IS_USER_LOGGED_IN_Rebooking)) {
				this.IS_USER_LOGGED_IN = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam.reply.IS_USER_LOGGED_IN_Rebooking;
				//to convert into boolean value
				this.IS_USER_LOGGED_IN = this.__merciFunc.booleanValue(this.IS_USER_LOGGED_IN);
			};
		},

		$displayReady: function() {
			var globalList = this.moduleCtrl.getModuleData().booking.MFARE_A.globalList;
			var siteParams = this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam;
			var labels = this.moduleCtrl.getModuleData().booking.MFARE_A.labels;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;
			if (siteParams.siteEnableConversion == "TRUE") {
				$('.panel.currencyConverter .validation.cancel').click(function() {
					$(".panel.currencyConverter").removeClass("addHeight");
					$(".cConvertertools ").toggleClass("selected");
					$(".msk").hide();
				});
			};
			var headerButton = {};

			if (typeof pageObjBkMK == 'undefined') {
				pageObjBkMK = this;
			}

			headerButton.scope = pageObjBkMK;
			headerButton.scopeFare = pageObjFare;

			/* added to determine the from page in case of the bookmark functionality */
			var bookmarkPage = 'MFareScript';
			var arr = [];
			if (siteParams.siteAllowFavorite != undefined && this.__merciFunc.booleanValue(siteParams.siteAllowFavorite) == true) {
				if (rqstParams.param.FLOW_TYPE == "DEALS_AND_OFFER_FLOW") {
					if (siteParams.siteAllowbookMarkDeal != undefined && this.__merciFunc.booleanValue(siteParams.siteAllowbookMarkDeal) == true) {
						arr.push("bkmkButton");
						headerButton.myVar = pageObjBkMK.myVar;
					}
				} else {
					if (siteParams.siteAllowbookMarkRvnue != undefined && this.__merciFunc.booleanValue(siteParams.siteAllowbookMarkRvnue) == true) {
						arr.push("bkmkButton");
						headerButton.myVar = pageObjBkMK.myVar;
					}
				}
			};

			if (siteParams.siteEnableConversion != null && siteParams.siteEnableConversion.toUpperCase() == 'TRUE') {
				arr.push("currInfoButton");
			};

			if (siteParams.enableProfile != undefined && siteParams.enableProfile.toLowerCase() == "true") {
				arr.push("login");
				if (this.IS_USER_LOGGED_IN) {
					headerButton.loggedIn = true;
				} else {
					headerButton.loggedIn = false;
				};
			};
			headerButton.bookmarkPage = bookmarkPage;

			if (!(this._isRebookingFlow() || !(this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)) || rqstParams.param.FLOW_TYPE == "DEALS_AND_OFFER_FLOW")) {

				var siteParamShowCartVal = siteParams.siteShopBasket;
				var cart_array = siteParamShowCartVal.split(',');
				var showcart = false;
				for (var i = 0; i < cart_array.length; i++) {
					// Trim the excess whitespace.
					cart_array[i] = cart_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

					if (cart_array[i] == 'ALL' || cart_array[i] == 'FARE') {
						showcart = true;
						break;
					}
				}
				if (showcart == true) {
					arr.push("CART");
				}
			}

			headerButton.button = arr;
			if (this.__merciFunc.booleanValue(siteParams.enableLoyalty) == true && this.IS_USER_LOGGED_IN) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}

			var currName = '';
			var currCode = '';
			if (rqstParams.fareBreakdown != null) {
				currName = rqstParams.fareBreakdown.currencies[0].name;
				currCode = rqstParams.fareBreakdown.currencies[0].code;
			}

			// set details for header
			this.moduleCtrl.setHeaderInfo({
				title: labels.tx_merci_text_booking_review_title,
				bannerHtmlL: rqstParams.bannerHtml,
				homePageURL: siteParams.siteHomeURL,
				showButton: !(!modules.view.merci.common.utils.MCommonScript.isEmptyObject(rqstParams.isRebooking) && rqstParams.isRebooking),
				companyName: siteParams.sitePLCompanyName,
				currencyConverter: {
					name: currName,
					code: currCode,
					pgTkt: rqstParams.reply.pageTicket,
					labels: labels,
					currency: {
						list: globalList.currencyCode,
						disabled: siteParams.siteInhibitCurrency
					},
					currentPage: this,
					newPopupEnabled: this.__merciFunc.booleanValue(siteParams.enableNewPopup),
					showButton: this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE'
				},
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});
		},

		$viewReady: function() {

			var bodies = document.getElementsByTagName('body');
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;

			if (bodies != null) {
				for (var i = 0; i < bodies.length; i++) {
					if (this._isRebookingFlow()) {
						if (!this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)){
							bodies[i].id = 'reafare';
						}else{
							bodies[i].id = 'refare';
						}
					} else if (!this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)) {
						bodies[i].id = 'afare';
					} else {
						bodies[i].id = 'bfare';
					}
				}
			}

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam;

			if (bp[14] != null && (bp[14].toLowerCase() == 'iphone' || bp[14].toLowerCase() == 'android')) {
				this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam.siteAppCallback,
					"://?flow=booking/pageload=merci-book-MFARE_A");
			}

			if (this.data.errors.length > 0) {
				var panelEL = document.getElementById("panel1");
				if (panelEL != null) {
					panelEL.style.display = "none";
				}
			}

			if (siteParams.siteEnableConversion.toLowerCase() == "true" && (localStorage.getItem('orgCurrency') == null || localStorage.getItem('convCurrency') == null) && rqstParams.fareBreakdown != null && rqstParams.fareBreakdown.currencies != null && rqstParams.fareBreakdown.currencies.length > 0) {
				var curr = rqstParams.fareBreakdown.currencies[0].code;
				localStorage.setItem('orgCurrency', curr);
				localStorage.setItem('convCurrency', curr);
			}

			this.dwmUtils.processContainer({element:document.getElementById(this.$getId('cem_wrapper')), cb:this.selectServiceCEM});

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFare",
						data:this.data
					});
			}
		},

		closePopup: function() {
			// close the popup
			this.moduleCtrl.closePopup();
		},

		getTravellerType: function(travellerType, labels, siteAllowPax) {
			// calling common method to get pax type
			modules.view.merci.common.utils.MCommonScript.getTravellerType(travellerType, labels, siteAllowPax);
		},

		submitFareForm: function(args, data) {

			// preventing form submit
			args.preventDefault(true);

			var request = {
				formObj: document.getElementById('fareForm'),
				action: data.action,
				method: 'POST',
				loading: true,
				isSecured: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onFareFormCallBack,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
		},

		openHTML: function(args, data) {
			this.moduleCtrl.openHTML(args, data);
		},

		callAwardsApi: function(evt, args) {

			// get form object
			var frm = document.getElementById(this.$getId('redemptionSearch'));
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;

			if (frm != null) {
				frm.action = modules.view.merci.common.utils.URLManager.getFullURL('AwardsAPI.action', null);

				var bookMarkEl = document.getElementById(this.$getId('IS_BOOKMARK_FLOW'));
				if (bookMarkEl != null && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(rqstParams.param.IS_BOOKMARK_FLOW)) {
					bookMarkEl.value = rqstParams.param.IS_BOOKMARK_FLOW;
				}

				if (args.redemption) {
					var hdnEl = document.createElement('input');
					hdnEl.name = "CLEARTO";
					hdnEl.value = "TRUE";
					hdnEl.type = "hidden";

					frm.appendChild(hdnEl);
				}

				frm.submit();
			}
		},

		_isRebookingFlow: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;
			return (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(rqstParams.isRebooking) && rqstParams.isRebooking);
		},

		_getMsgJSON: function(errorMsg) {
			return {
				TEXT: errorMsg
			};
		},

		_getCabinClassName: function(cabinId, list) {
			var len = list.length;
			for (var i = 0; i < len; i++) {
				var el = list[i];
				if (el[0] == cabinId) {
					return el[1];
				}
			}
			return null;
		},

		_setErrorMessage: function() {

			// get JSON reference
			var labels = this.moduleCtrl.getModuleData().booking.MFARE_A.labels;
			var siteParams = this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam;
			var globalList = this.moduleCtrl.getModuleData().booking.MFARE_A.globalList;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam;

			if (rqstParams.listItineraryBean != null && rqstParams.listItineraryBean.isMixedCabin && siteParams.siteMixedCabin.toLowerCase() == 'true' && siteParams.siteEnableMktTool.toLowerCase() == 'true' && rqstParams.listItineraryBean.itineraries.length > 0) {

				var cabinClassName = this._getCabinClassName(rqstParams.cabinClass, globalList.cabinClasses);
				var inCity = rqstParams.listItineraryBean.itineraries[0].beginLocation.cityName + '(' + rqstParams.listItineraryBean.itineraries[0].beginLocation.cityCode + ')';
				var outCity = rqstParams.listItineraryBean.itineraries[0].endLocation.cityName + '(' + rqstParams.listItineraryBean.itineraries[0].endLocation.cityCode + ')';
				var listMsg0 = this._getMsgJSON((new this.__strBuffer(labels.tx_merci_cabin_change)).formatString([cabinClassName, inCity, outCity]));

				// if list is null then initialize the list
				if (this.__merciFunc.isEmptyObject(this.data.errors)) {
					this.data.errors = new Array();
				}

				// push message
				this.data.errors.push(listMsg0);

				// push cabin change message
				if (rqstParams.listItineraryBean.itineraries[1] != null) {
					this.data.errors.push(this._getMsgJSON((new this.__strBuffer(labels.tx_merci_cabin_change)).formatString([cabinClassName, outCity, inCity])));
				}
			}
		},

		restartBooking: function(e, args) {
			modules.view.merci.segments.booking.scripts.MBookingMethods.openUrl(args);
		},
		_getDateTime: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParams != null) {
				var dateParams = dateBean.jsDateParams.split(',');
				var dtTime = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				return dtTime;
			}
			return null;
		},
		noOfDays : function(date1,date2){
		    var datediff = date1.getTime() - date2.getTime();
			//store the getTime diff - or +
			return (datediff / (24 * 60 * 60 * 1000));	
		},
		_checkError: function(e, args) {
			if(!this.__merciFunc.isEmptyObject(this.data.errors) && this.data.errors.length > 0){
				for (var i = 0; i < this.data.errors.length; i++) {
					if(this.data.errors[0].NUMBER == "157009"){
						return true;
					}
				}
			}
			return false;
		}
	}
});