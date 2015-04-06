Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.utils.home.MDynamicHomeTripBoxScript',	
	$dependencies: [
	    'aria.utils.Type',
		'aria.utils.Date',
		'aria.utils.Number',
	    'aria.utils.Callback',
	    'aria.utils.HashManager',
	    'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript'
	],
	
	$constructor: function() {		
		pageObjHome = this;	
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
		this.noOfAdults = 0;
		this.noOfChildren = 0;
		this.noOfInfants = 0;
		this.cabinClass = "";	
		this.boardingPass = {};	
		this.productId = "";
		this.weather = {};
		this.weatherDisplayed = false;
	},

	$prototype: {		
		
		viewTrips: function(evt, args){
			aria.utils.HashManager.setHash("merci-MDynHomePopup_A");
			$("#dynaPage_outer_wrapper").css("top","0px"); 
			$("#triplist").addClass("expanded");
			args._this.moduleCtrl.setHeaderInfo({				
				showButton: true,
				title: args._this.labels.tx_merciapps_my_trips
			});
			$("#bannerLogo").hide();
			$(".sb-toggle").hide();						
			$("header.banner").removeClass("banner");
			$("button.back").addClass("dynamicB");
		},
		addTripToTripBox: function(evt, args){
			this.weatherDisplayed = false;
			aria.utils.HashManager.setHash("merci-MDynamicHome_A");			
			$("#dynaPage_outer_wrapper").css("top","45px");  
			$("#triplist").removeClass("expanded");
			$("#bannerLogo").show();
			$(".sb-toggle").show();
			$("header").addClass("banner");			
			$("button.back.dynamicB").removeClass("dynamicB");
			args._this.moduleCtrl.setHeaderInfo({
				showButton: false
			});			
			args._this.scrollCount = 0;
			this.$json.setValue(args._this.data, "pnrToDisplay", args._this.data.pnrList[args._this.sortedPNRs[args.totalListCounter]]);						
			
		},
		isCheckinEnabled: function(_this,pnrToDisplay) {
			if (!this.__merciFunc.booleanValue(_this.config.siteAllowCheckin)) {
				return false;
		}
			if (pnrToDisplay) {
				// current date
				var dateParams = _this.data.dateParams;
				var currentDate = new Date(dateParams.year, dateParams.month, dateParams.day, dateParams.hour, dateParams.minute, dateParams.second);
				// convert current date to seconds
				var time = currentDate.getTime() / 1000;
				// iterate on itineraries
				for (var i = 0; i < pnrToDisplay.segmentDetails.length; i++) {
					var segment = pnrToDisplay.segmentDetails[i];
					if (segment != null) {					
						var jsDt = segment.depDateParams.split(',');
						var segmentTime = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]).getTime() / 1000;
						// get difference in hours
						var timeToDeparture = (segmentTime - time) / 3600;
						// added for PTR 07626025
						if (timeToDeparture < 0) {
							return false;
						}
						var timeFrame = 0;
						if (!this.__merciFunc.isEmptyObject(_this.config.siteCknTimeFrame) && _this.config.siteCknTimeFrame != "") {
							timeFrame = parseInt(_this.config.siteCknTimeFrame);
						}
						if (timeToDeparture <= timeFrame) {
							return true;
						}						
					}
				}
			}
			return false;
		},
		getTripListString: function(_this,pnrToDisplay){
			if(this.__merciFunc.booleanValue(this.isBoardingPassGenerated(_this,pnrToDisplay))){
				return _this.labels.tx_merciapps_label_boarding_pass;
			}
			else if(this.__merciFunc.booleanValue(this.isCheckinEnabled(_this,pnrToDisplay))){
				return _this.labels.tx_merci_flight_open;
			}
			else if(this.__merciFunc.booleanValue(pnrToDisplay.isPNRPayLaterEligible)){
				return _this.labels.tx_merci_services_topay;
			}
			else if(this.__merciFunc.booleanValue(pnrToDisplay.isPNRWaitListed)){
				return _this.labels.tx_merci_text_booking +" "+ _this.labels.tx_merci_text_WaitlistedStatus;
			}
			else{
				return _this.labels.tx_merci_text_booking_bookingconfirmed;
			}
		},
		isBoardingPassGenerated: function(_this,pnrToDisplay){
			var boardingPassesFromStorage = {};
			this.__merciFunc.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
				if (result != null && result != '') {
					var jsonObj = {};						
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};					
					boardingPassesFromStorage = jsonObj;
				}
			});
			
			if(boardingPassesFromStorage){
				var boardingPassArray = boardingPassesFromStorage.boardingPassArray;
				for (var id in boardingPassArray){
					if(boardingPassArray[id].recordLocator == pnrToDisplay.recLoc){
						this.boardingPass = boardingPassArray[id];
						this.productId = id;
						return true;
					}
				}
			}
			return false;
		},
		incrementScrollCount: function(_this){
			_this.scrollCount+=1;
		},
		formatDate: function(dateParams, pattern) {
			var jsDt = dateParams.split(',');
			var date = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]);
			var formattedDate = this.__merciFunc.formatDate(date, pattern);
			return formattedDate;
		},
		setPNRInfo: function(_this, pnrToDisplay){
			for (var i = 0; i < pnrToDisplay.segmentDetails.length; i++) {
				var segment = pnrToDisplay.segmentDetails[i];
				if (segment != null) {					
					if(!this.__merciFunc.booleanValue(segment.hasFlown)){
						this.noOfAdults = segment.adults;
						this.noOfChildren = segment.children;
						this.noOfInfants = segment.infants;
						this.cabinClass = segment.cabinClass;
					}								
				}
			}
		},
		getUpcomingSegment: function(_this, pnrToDisplay){
			var upcomingSegment = null;
			if(pnrToDisplay && pnrToDisplay.segmentDetails){
				for(var i=0; i<pnrToDisplay.segmentDetails.length; i++){
					if(!this.__merciFunc.booleanValue(this.isSegmentFlown(_this,pnrToDisplay.segmentDetails[i]))){
						upcomingSegment = pnrToDisplay.segmentDetails[i];
						break;
					}
				}
			}
			return upcomingSegment;			
		},
		isSegmentFlown: function(_this,segment){
			var isSegmentFlown = false;
			if(segment){
				var dateParams = _this.data.dateParams;
				var currentDate = new Date(dateParams.year, dateParams.month, dateParams.day, dateParams.hour, dateParams.minute, dateParams.second);
				// convert current date to seconds
				var time = currentDate.getTime() / 1000;
				var jsDt = segment.depDateParams.split(',');
				var segmentTime = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]).getTime() / 1000;
				// get difference in hours
				var timeToDeparture = (segmentTime - time) / 3600;
				// added for PTR 07626025
				if (timeToDeparture < 0) {
					segmentFlown = true;
				}								
			}
			return isSegmentFlown;
		},		
		onCheckinClick: function(event, args) {
			pageObjHome=args._this
			var actionName = "";			
			if (this.__merciFunc.booleanValue(args._this.config.merciCheckInEnabled)) {
				/*
				 * for taking action sitecode from MCI URL
				 * site code is required to take because it change from booking to checkin in cases.
				 * */
				var checkInURL = args._this.config.checkInURL;
				//console.log("checkinURL === "+checkInURL);
				var tempcheckInURL = checkInURL.split("/");
				actionName = tempcheckInURL[tempcheckInURL.length - 1].split("?")[0];
				var siteCode = checkInURL.substr(checkInURL.search(/site=[a-zA-Z0-9]{1,}&/i) + 5, 8);
				var actualSiteCode = jsonResponse.data.framework.baseParams[11];
				jsonResponse.data.framework.baseParams[11] = siteCode;
				//console.log("actionName === "+actionName);
				//console.log("siteCode === "+siteCode);
				params = 'REC_LOC=' + args.pnrToDisplay.recLoc.toUpperCase() + '&LAST_NAME=' + args.pnrToDisplay.lastName + '&result=json';
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
				this.__merciFunc.showMskOverlay(true);
				// create URL for checkin
				var checkInURL = new this.buffer(args._this.config.checkInURL);
				var base = modules.view.merci.common.utils.URLManager.getBaseParams();
				// add extra parameters
				checkInURL.append("&LANGUAGE=" + base[12]);
				if (base[14] != null && base[14] != '') {
					checkInURL.append("&client=" + base[14]);
				}
				// navigate to external page
				document.location.href = checkInURL.formatString([args.pnrToDisplay.recLoc.toUpperCase(), args.pnrToDisplay.lastName]);
			}
		},
		__onCheckinClickCallback: function(response, args) {
			//console.log("response === "+JSON.stringify(response));
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null && dataId != 'Mflights_A') {
				// will be null in case page already navigated
				if (pageObjHome.moduleCtrl != null) {
					// setting data for next page
					var json = pageObjHome.moduleCtrl.getModuleData();
					if (json.checkIn == null) {
						json.checkIn = {};
					}
					json.checkIn[dataId] = response.responseJSON.data.checkIn[dataId];
					// navigate to next page
					pageObjHome.moduleCtrl.navigate(null, nextPage);
				}
			}
			if (aria.utils.HashManager.getHashString() == 'merci-MStaticPage_A') {
						pageObjHome.utils.hideMskOverlay();
			} 
		},
		payLaterPymntAction: function(event, args) {			
			var isAwardFlow = false;
			if (this.__merciFunc.booleanValue(args._this.config.siteEnableWaitlistPNR) && this.__merciFunc.booleanValue(args.pnrToDisplay.isAwardPNR)) {
				isAwardFlow = true;
			}
			var parameters = {
				REC_LOC: args.pnrToDisplay.recLoc.toUpperCase(),
				DIRECT_RETRIEVE_LASTNAME: args.pnrToDisplay.lastName,
				DIRECT_RETRIEVE: true,
				ACTION: "MODIFY",				
				REGISTER_START_OVER: "false",
				IS_PAY_ON_HOLD: "IS_PAY_ON_HOLD",
				PAY_LATER: "PAY_LATER",
				IS_DOB_MANDATORY: "false",
				AWARDS_FLOW: isAwardFlow
			};
			this.__merciFunc.sendNavigateRequest(parameters, 'MOnHoldModifyDispatcherRetrieve.action', args._this);
		},
		viewBooking: function(event, args) {			
			var isAwardFlow = false;
			if (this.__merciFunc.booleanValue(args._this.config.siteEnableWaitlistPNR) && this.__merciFunc.booleanValue(args.pnrToDisplay.isAwardPNR)) {
				isAwardFlow = true;
			}
			var parameters = {
				REC_LOC: args.pnrToDisplay.recLoc.toUpperCase(),
				DIRECT_RETRIEVE_LASTNAME: args.pnrToDisplay.lastName,
				DIRECT_RETRIEVE: true,
				ACTION: "MODIFY",				
				REGISTER_START_OVER: "false",				
				IS_DOB_MANDATORY: "false",
				AWARDS_FLOW: isAwardFlow
			};
			this.__merciFunc.sendNavigateRequest(parameters, 'MPNRRetrieve.action', args._this);
		},
		findIOSVersion: function(evt) {
			//this.$logInfo('AcceptanceConfirmationScript::Entering findIOSVersion function');
			try {
			    if (/iP(hone|od|ad)/.test(navigator.platform)) {
			       // supports iOS 2.0 and later: <http://bit.ly/TJjs1V> (http://bit.ly/TJjs1V%3E)
			       var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			       return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
			    }
			} catch (exception) {
			    this.$logError(
			       'AcceptanceConfirmationScript::An error occured in findIOSVersion function',
			       exception);
			}
		},
		onPassBookButtonClick: function(evt, args){
			this.__merciFunc.showMskOverlay(true);
			evt.preventDefault();
			var _this = args._this;
			var selectedMBPs = [];
			try {
				jQuery(document).scrollTop("0");
				var productList = [];
				//productList.push(productID);
				productList.push(this.productId);
				selectedMBPs.push({
				  "productList": productList
				});
				/* Begin Sending Backend Request */
				var input = {
				  "bpRequests": selectedMBPs,
				  "bpType": "passbook",
				  "fromPage": "TripOverview"
				}
				var query = 'result=json&data=' + JSON.stringify(input);
				var callback = {
		          scope: this,
		          fn: this.onPassBookButtonClickCallback,
		          args: input
		        }
				var request = {
		          parameters: query,
		          action: "IBoardingPass.action",
		          loading: true,
		          expectedResponseType: 'json',
		          defaultParams: true,
		          cb: callback,
		          appendSession: true
		        };
		        modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);				
				/* End Sending Backend Request */
			} catch (exception) {
				this.$logError('MDynamicHomeTripBoxScript::An error occured in onPassBookButtonClick function', exception);
			}
		},
		onPassBookButtonClickCallback: function(response, args){
			if (response.responseJSON != null && response.responseJSON.data != null){
				var nextPage = response.responseJSON.homePageId;
          		var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				this.__merciFunc.hideMskOverlay();	            
	            window.location = 'data:application/vnd.apple.pkpass;base64,' + response.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails;
	            return null;
			}			
		},
		_chkDateReq: function(cxt,trip){
			var reply = false;
			var upcomingSegment = this.getUpcomingSegment(cxt,trip);
			var depDt = new Date(upcomingSegment.depDate);
			var curDt = new Date();
			var dateR = parseInt(cxt.config.siteWeatherDateRange) || 5;
			if ((depDt - curDt) > 0 && (depDt - curDt) <= (dateR * 86400000)){
				reply = true;
			}
			return reply;
		},		
		__getWeather:function(cxt,trip){
			var upcomingSegment = this.getUpcomingSegment(cxt,trip);			
			var params = 'result=json&CITY_CODE='+upcomingSegment.arrivalLocationCode;
			var actionName = 'MGetWeather.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.__callbackWeather,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);			

		},
		__callbackWeather:function(response){
			try {
				response = response.responseJSON.adc_database;
				if(response.forecast){				
					this.weather.city_name =response.local.city;
					this.weather.forecast = response.forecast.day;
					this.showweather = true;
					this.$json.setValue(this.weather, "showweather", !this.weather.showweather);
				}
				else this.showweather = false;
			} catch (exception) {
				this.$logError('MDynamicHomeTripBoxScript::An error occured in __callbackWeather function', exception);
			}
		}
	}
});
