Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MFlightDetailsScript",
	$dependencies: [
		'aria.utils.Date',
		'aria.utils.Json',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],

	$statics: {
		MEAL_CODE: 'MEA',
		SEAT_CODE: 'RQST',
		SEAT_ASSIGN_INPUT: 'PREF_AIR_SEAT_ASSIGMENT',
		STRD_MEAL: 'STRD'
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
		pageObj = this;
		pageObjFlight = this;
		this.seatsEligibleSegments = [];
	},

	$prototype: {

		$dataReady: function() {
			if (this.utils.isRequestFromApps() == true) {

				pageObjFlight.jsonMTrip = this.moduleCtrl.getModuleData();
				pageObjFlight.mTrip = pageObjFlight.jsonMTrip.flowFromTrip;
				pageObjFlight.key = pageObjFlight.jsonMTrip.pnr_Loc;

				if (pageObjFlight.mTrip != "mTrips") {
					pageObj.model = pageObjFlight.moduleCtrl.getModuleData().MFlightDetails;
					pageObj.bookingDetails = pageObjFlight.moduleCtrl.getModuleData().MBookingDetails;
					pageObj.storage = false;
				} else {
					pageObjFlight.model = pageObjBooking.flightData;
					pageObjFlight.bookingDetails = pageObjBooking.model;
					pageObjFlight.storage = true;
				}
			} else {
				pageObj.model = this.moduleCtrl.getModuleData().MFlightDetails;
				pageObj.bookingDetails = this.moduleCtrl.getModuleData().MBookingDetails;
				pageObj.storage = false;
			};
			//var model = this.moduleCtrl.getModuleData().MFlightDetails;
			//var bookingDetails = this.moduleCtrl.getModuleData().MBookingDetails;
			this.config = pageObj.model.config;
			this.labels = pageObj.model.labels;
			this.request = pageObj.model.request;
			this.reply = pageObj.model.reply;
			this.tripplan = pageObj.model.reply.tripplan;
			this.isEnabledServicesCatalog = (this.utils.booleanValue(this.config.merciServiceCatalog) && !(this.utils.isEmptyObject(this.reply.serviceCategories)));
			this.bookTripPlan = pageObj.bookingDetails.reply.tripplan;
			this.pageTicket = pageObj.bookingDetails.reply.pageTicket;
			this.__googleAnalalytics();
			/*Added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
			if (this.config.sadadpayment == 'TRUE') {
				if (pageObj.bookingDetails.reply.bookingPanel.onHoldPnrBean.sadadPaymentMade == false && pageObj.bookingDetails.reply.bookingPanel.onHoldPnrBean.sadadPaymentInd == true) {
					this.sadad = true;
				} else {
					this.sadad = false;
				}
			} else {
				this.sadad = false;
			}
			/*Added as part of CR 5533028- SADAD Implementation for MeRCI- END*/
		},
		$displayReady: function() {			
			if(this.config.siteFpUICondType.toLowerCase() == 'uri' && this.utils.booleanValue(this.config.enblFFUriPopup)){
				var itin = this.tripplan.air.itineraries;
				for(var j=0; j< itin.length; j++){
					var seg = itin[j].segments;
					for (var i=0; i<seg.length; i++){
						var url = '';
						var ff = seg[i].fareFamily;
						if(ff != undefined){
							var ffcond = ff.condition;
							if(ffcond != undefined){
								url = ffcond.url;
							}
						}
						$("#htmlPopup_"+(j+1)+"_"+(i+1)).html('<object data='+url+'/>'); 
					}						
				}			
			}
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

		/* google analytics */
		__googleAnalalytics: function() {
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();

			var sqData ={};
			if(!this.utils.isEmptyObject(this.config.isSQFlow)){
				var flightNumber = [] ;
				var seatNumber = [] ;

				
				var day1 = this.moduleCtrl.getModuleData().MFlightDetails.reply.tripplan.air.itineraries[0].beginDateBean.day.toString();
				var month1 = this.moduleCtrl.getModuleData().MFlightDetails.reply.tripplan.air.itineraries[0].beginDateBean.month + 1 ;
				var year1 = this.moduleCtrl.getModuleData().MFlightDetails.reply.tripplan.air.itineraries[0].beginDateBean.year.toString();
				var depDate = (day1 < 10 ? ('0' + day1) : day1) + "-" + (month1 < 10 ? ('0' + month1) : month1) + "-" + year1;
				var arrDate = "NA";
				
				var day2 = "NA";
				var month2  = "NA";
				var year2 = "NA";

				
				var dateOfJourney = new Date(year1, month1, day1);
				var d1 = new Date();
				var day = d1.getDate();
				var month = d1.getMonth() + 1;
				var year = d1.getFullYear();
				var curdate = day + "/" + month + "/" + year;
				var currentDate = year + (month < 10 ? ('0' + month) : month) + (day < 10 ? ('0' + day) : day);
				var curDate = new Date(year, month, day);		
				var diffDate = dateOfJourney.getTime() - curDate.getTime();
				var noOfDays = diffDate/(24 * 60 * 60 * 1000);
				sqData['numOfDaystoDeparture'] = noOfDays.toString();
				

				for(var i=0; i<this.reply.tripplan.air.itineraries.length; i++){
					for(var j=0; j<this.reply.tripplan.air.itineraries[i].segments.length; j++){
						flightNumber.push(this.reply.tripplan.air.itineraries[i].segments[j].airline.code + this.reply.tripplan.air.itineraries[i].segments[j].flightNumber);
					}
				}
				
				flightNumber = flightNumber.join();
				
				var flightSegment1 = [];
				for(var i=0; i<this.reply.tripplan.air.itineraries.length; i++){
					for(var j=0; j<this.reply.tripplan.air.itineraries[i].segments.length; j++){
					if(j>0){
						flightSegment1 = flightSegment1 + "|" ;
						
					}
					b_location = this.reply.tripplan.air.itineraries[i].segments[j].beginLocation.locationCode;
					e_location = this.reply.tripplan.air.itineraries[i].segments[j].endLocation.locationCode;
					flightSegment1 = flightSegment1 + b_location + "-" + e_location ;
				}
				if(this.reply.tripplan.air.itineraries.length - 1 > i){			
					flightSegment1 = flightSegment1 + "|" ;
				}
			}
				
				for(var key in this.reply.tripplan.air.seats){
					if(this.reply.tripplan.air.seats.hasOwnProperty(key)){
						for(var keys in this.reply.tripplan.air.seats[key]){
							if(this.reply.tripplan.air.seats[key].hasOwnProperty(keys)){
								seatNumber.push(this.reply.tripplan.air.seats[key][keys].seatAssignement);
							}
						}
					}
				}
			

if(this.request.SEAT_SELECTED_PARAM == "TRUE"){
					sqData['event'] = 'SeatSelectionConfirmation' ;
					sqData['seatNumber'] = seatNumber ;
					sqData['seatType']= 'Free|Normal Seat';
					sqData['flightSegment']= flightSegment1;
				}else{
					sqData['pageTitle'] = 'SQ Mobile - Retrieve' ;
				}
				var numberOfPax = this.reply.tripplan.travellers.length;
				seatNumber = seatNumber.join();
				sqData['seatNumber'] = seatNumber ;
				sqData['cabin'] = this.reply.tripplan.air.itineraries[0].cabins[0].name ;
				sqData['numberOfPax'] = numberOfPax.toString() ;
				sqData['flightNumber'] = flightNumber ;
			
			}



			this.__ga.trackPage({
				domain: this.config.siteGADomain,
				account: this.config.siteGAAccount,
				gaEnabled: this.config.siteGAEnable,
				page: 'Ser Flight Details?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11],
				sqData: sqData,
				GTMPage: 'Ser Flight Details?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			
		},

		$viewReady: function() {
			// this.moduleCtrl.setHeaderCurrInfo(false);
			localStorage.removeItem('orgCurrency');
			localStorage.removeItem('convCurrency');
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFlightDetails",
						data:{}
					});
			}
		},

		getSectionIds: function(bound) {
			var ids = [];
			for (var s = 0; s < bound.segments.length; s++) {
				ids[s * 2] = 'segment' + bound.segments[s].id;
				if (s !== bound.segments.length - 1) {
					ids[s * 2 + 1] = 'connect' + bound.segments[s].id + bound.segments[s + 1].id;
				}
			}
			return ids;
		},

		/**
		 *Returns the service selected by the passenger in the specified section and bound
		 **/
		getSelectedService: function(segId, boundId, paxNumber, categoryCode) {
			var serviceData = [];
			var selectedServices = this.tripplan.air.services.selection.selectedServices || [];
			for (var selServ = 0; selServ < selectedServices.length; selServ++) {
				var service = selectedServices[selServ];
				if (service.category == categoryCode ||  service.code ==categoryCode) {
					var passengerId = paxNumber;
					var serviceElementId = 0;
					if(selectedServices[selServ].associationMode == 'SEG'){
						serviceElementId = segId;
					}else if (selectedServices[selServ].associationMode == 'ELE'){
						serviceElementId = boundId;
					}
					var currentElementId = this.__getCurrElemId(segId, boundId, service);
					var passengers = service.passengerIds;
					if ((passengers.indexOf(passengerId) >= 0) && (serviceElementId == currentElementId)) {
						if ((service.category && service.category != "") || (service.code ==categoryCode)) {
						switch (service.category) {
							case 'SIT':
								serviceData = this.__getService(service, "SEAT_ASSIGNMENT", "", true);
								break;
							default:
								serviceData.push(this.__getService(service, "NUMBER", service.name, true));
								break;
							}
						}
					}
				}
			}
			return serviceData;
		},


		/**
		 * returns the service and the no of units depending upon the parameters passed
		 * selectionMode - this determines the mode of service selection (weight or number in case of bags, seat selection or assosiation in case of seats
		 * service name - this determines the name of the service selected ( returns "seats" in case of seats, hence set to " ")
		 * value required - true/false value which determines whether the value/ unit of the selected service is to be displayed
		 **/
		__getService: function(service, selectionMode, serviceName, valueRequired) {
			var serviceProperties = service.listProperties;
			var serviceData = "";
			if (valueRequired) {
				for (var i = 0; i < serviceProperties.length; i++) {
					if ((serviceProperties[i].code !== null) && (serviceProperties[i].code === selectionMode)) {
						var inputParameters = serviceProperties[i].inputParams;
						for (var j = 0; j < inputParameters.length; j++) {
							if ((inputParameters[j].code === "VALUE") && (inputParameters[j].value !== null)) {
								serviceData = inputParameters[j].value + " " + serviceName;
							}
						}
					}
				}
			} else {
				serviceData = serviceName;
			}
			return serviceData;
		},

		/**
		 * returns the segmentid or the bound id to which the service is associated,
		 * depending on whether a service is selected segment-wise or bound-wise
		 **/
		__getCurrElemId: function(segId, boundId, service) {
			var currentElementId = 0;
			var elements = service.elementIds;
			if (service.selectionAssociationMode == 'SEG') {
				if (service.associationMode == 'SEG') {
					if (elements.indexOf(segId) >= 0) {
						currentElementId = segId;
					}
				} else {
					if (this.__isServiceinBound(service, boundId)) {
						currentElementId = boundId;
					}
				}
			} else {
				if (service.associationMode == 'ELE') {
					if (elements.indexOf(boundId) >= 0) {
						currentElementId = boundId;
					}
				} else {
					if (this.__isServiceinBound(service, boundId)) {
						currentElementId = segId;
					}
				}
			}
			return currentElementId;
		},


		__isServiceinBound: function(service, boundId) {
			var bound = parseInt(boundId);
			var isServiceInBound = false;
			var segments = this.__getSegments(this.tripplan.air.itineraries[bound - 1]);
			for (var seg = 0; seg < segments.length; seg++) {
				if (service.elementIds.indexOf(segments[seg]) >= 0)
					isServiceInBound = true;
			}
			return isServiceInBound;
		},

		/**
		 * returns the array of all the segments in the specified bound
		 **/
		__getSegments: function(bound) {
			var segments = [];
			for (var s = 0; s < bound.segments.length; s++) {
				segments[s] = bound.segments[s].id;
			}
			return segments;
		},

		/**
		 * Determines the number of the seat selected by the given passenger on the given segment.
		 * Returns null if not seat is selected.
		 */
		getSeatSelection: function(segId, itiId, paxId) {
			var seat = null;
			if (!this.utils.isEmptyObject(this.tripplan.air.services.byPax)) {
				seat = this.__getSelectedSeat(segId, itiId, paxId);
			} 
			/*Condition changed for PTR 08699215- This takes care of the additional case when the first if condition returns null */
			if (seat ==null && this.tripplan.air.seats) {
				var seats = this.tripplan.air.seats;
				if (seats[segId] && seats[segId][paxId]) {
					seat = seats[segId][paxId].seatAssignement;
				}
			}
			return seat;
		},

		/**
		 * Returns the formatted list of meals available on the given segment.
		 */
		getAvailableMeals: function(segment, pattern) {
			var meals = '';
			if (segment.mealNames) {
				var sep = this.utils.getFormatFromEtvPattern(pattern);
				meals = segment.mealNames.join(sep);
			}
			return meals;
		},

		/**
		 * Determines the name of the meal selected by the given passenger on the given segment.
		 * Returns '--' if no meal is selected.
		 */
		getMealSelection: function(segment, paxNumber) {
			var meal = '--';
			var isMealSelected = 'FALSE';

			if (this.utils.booleanValue(this.config.bilateralMeal)) {
				if(this.utils.booleanValue(this.config.infantMealAllowed) && this.reply.bookingPanel.hasInfant==true){
					var selectedServices=this.reply.tripplan.air.services.selection.selectedServices || [];
					for(var s=0;s<selectedServices.length;s++){
						var service=selectedServices[s];
						if(service.subcategory=="MEA"){
							if(service.elementIds.indexOf(segment.id)>=0 && service.passengerIds.indexOf(paxNumber)>=0){
									meal=service.name;
									isMealSelected = 'TRUE';
							}
						}
					}
				}
			} else {
				var prefs = segment.travellerPreferences.travellers;
				for (var p = 0; p < prefs.length; p++) {
					if (prefs[p].paxNumber === paxNumber && prefs[p].preference != null && prefs[p].preference.mealName) {
						meal = prefs[p].preference.mealName;
						if (prefs[p].preference.mealCode != this.STRD_MEAL) {
							isMealSelected = 'TRUE';
						}

						break;
					}
				}
			}
			if(!this.utils.booleanValue(isMealSelected) && !this.utils.isEmptyObject(this.reply.tripplan.air.services.selection.selectedServices)){
				var selectedServices=this.reply.tripplan.air.services.selection.selectedServices || [];
					for(var s=0;s<selectedServices.length;s++){
						var service=selectedServices[s];
						if(service.subcategory=="MEA"){
							if(service.elementIds.indexOf(segment.id)>=0 && service.passengerIds.indexOf(paxNumber)>=0){
									meal=service.name;
									isMealSelected = 'TRUE';
							}
						}
					}
			}
			this.moduleCtrl.getModuleData().isMealSelected = isMealSelected;

			return meal;
		},

		__getSelectedSeat: function(segId, itiId, paxId) {
			var seat = null;
			var selectedSeat = this.__getSelectedService(segId, itiId, paxId, this.SEAT_CODE);
			if (selectedSeat && selectedSeat.inputParameters) {
				var seatAssign = selectedSeat.inputParameters[this.SEAT_ASSIGN_INPUT];
				if (seatAssign.value) {
					seat = seatAssign.value;
				}
			}
			return seat;
		},

		__getSelectedService: function(segId, itiId, paxId, serviceCode) {
			var paxServices = this.tripplan.air.services.byPax[paxId];
			if (paxServices) {
				if (paxServices[itiId] && paxServices[itiId][segId]) {
					var segServices = paxServices[itiId][segId];
					for (var s = 0; s < segServices.length; s++) {
						if (segServices[s].serviceCode === serviceCode) {
							return segServices[s];
						}
					}
				}
			}
			return null;
		},

		/**
		 * Assembles the name elements for display
		 */
		formatName: function(paxType, paxIdy) {
			return this.utils.formatName(paxType,
				paxIdy.titleName, paxIdy.firstName, paxIdy.lastName,
				this.utils.booleanValue(this.config.allowPaxTypes), this.labels);
		},
		/**
		 * Returns the class name according to the pax type
		 */
		getPaxType: function(paxType) {
			if (paxType == 'CHD') {
				return 'child'
			}
			return "";
		},

		formatDate: function(dateBean, pattern, utcTime) {
			var format = this.utils.getFormatFromEtvPattern(pattern);
			var jsDate = this._getDateFromBean(dateBean);
			return aria.utils.Date.format(jsDate, format, utcTime);
		},

		formatTime: function(dateBean) {
			var h = (dateBean.hour < 10 ? '0' + dateBean.hour : dateBean.hour);
			var m = (dateBean.minute < 10 ? '0' + dateBean.minute : dateBean.minute);
			return h + ':' + m;
		},

		/**
		 * Computes and formats the connection time between the two given segments.
		 */
		formatStopDuration: function(seg1, seg2, pattern) {
			var d1 = new Date(seg1.endDate);
			var d2 = new Date(seg2.beginDate);
			var duration = d2 - d1;
			return this.utils.formatDuration(duration, pattern, true);
		},

		isServiceForSegment: function(segId, boundId) {
			var isServicePresent = false;
			for (var i = 0; i < this.tripplan.travellers.length; i++) {
				var passengers = this.tripplan.travellers;
				var paxId = passengers[i].paxNumber;
				if (this.isServicePresentForPassenger(paxId, segId, boundId)) {
					isServicePresent = true;
				}
			}
			return isServicePresent;
		},

		isServicePresentForPassenger: function(paxId, segId, boundId) {
			var isServicePresent = false;
			var selectedServices ;
			for (var i = 0; i < this.reply.serviceCategories.length; i++) {
				selectedServices = this.getSelectedService(segId, boundId, paxId, this.reply.serviceCategories[i].code);
				if (!this.utils.isEmptyObject(selectedServices) && selectedServices.length>0) {
					isServicePresent = true;
				}
			}
			return isServicePresent;
		},

		onFlightStatusClick: function(ATArgs, args) {
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			if (args.segment.beginDateBean != null && args.segment.beginDateBean.jsDateParameters != null) {

				// get javascript date parameters
				var dateParams = args.segment.beginDateBean.jsDateParameters.split(',');

				var date = dateParams[2];
				var month = monthNames[dateParams[1]];
				var year = dateParams[0];

				var params = 'result=json&fromIndex=true&dd=' + date + "&MMM=" + month + "&YYYY=" + year + "&pnr=" + this.bookTripPlan.pnr.REC_LOC + "&fd=" + args.segment.beginDate + "&fn=" + args.flightNo + "&lastName=" + this.bookTripPlan.primaryTraveller.identityInformation.lastName + "&pagefrom=itinenary&PAGE_TICKET=" + this.pageTicket;
				modules.view.merci.common.utils.MCommonScript.sendNavigateRequest(params, 'MFIFOReq.action', this);
			}
		},

		getMealEligibility: function(segment, itiId) {
			var elig = {
				showLink: false
			};
			if (this.utils.booleanValue(this.config.allowPNRServ) && this.utils.booleanValue(this.config.allowSpecialMeal)) {
				elig.showLink = true;
				if (this.__hasMealSelection(segment.id, itiId)) {
					elig.linkLabel = this.labels.tx_merci_text_mealsel_mealpref;
				} else {
					elig.linkLabel = this.labels.tx_merci_text_mybook_selmeal;
				}
			}

			return elig;
		},

		__hasMealSelection: function(segId, itiId) {
			var servicesByPax = this.tripplan.air.services.byPax;
			for (var paxId in servicesByPax) {
				if (this.__getSelectedService(segId, itiId, paxId, this.MEAL_CODE)) {
					return true;
				}
			}

			return false;
		},

		_getDateDisplayString: function(dt) {
			if (dt != null) {
				var totalMinutes = parseInt(dt.getTime() / (1000 * 60));
				var minutes = totalMinutes % 60;

				return ((totalMinutes - minutes) / 60) + ' ' + this.labels.tx_merci_text_pnr_hour + ' ' + minutes + ' ' + this.labels.tx_merci_text_pnr_minutes;
			}

			return '';
		},

		openHTML: function(args, data) {
			document.getElementById('htmlPopup').innerHTML = data.segId;
			document.getElementById('htmlContainer').style.display = 'block';
			window.scrollTo(0, 0);
			this.utils.showMskOverlay(false);
		},

		/**
		 * creates the data required to show ServiceURL Link
		 * @param segement JSON with segment information
		 * @return JSON
		 */
		_getServiceURLData: function(segment) {
			// URL to fetch fareFamily information
			var serviceLevelURL = new modules.view.merci.common.utils.StringBufferImpl(modules.view.merci.common.utils.URLManager.getFullURL('MServiceAvailAction.action', null));
			serviceLevelURL.append('&isUpSell=true&fareFamilyCode=' + segment.fareFamily.code);
			serviceLevelURL.append('&OVERRIDE_FINAL_LOCATION=FALSE');

			if (this.request.pricingType != null) {
				serviceLevelURL.append('&PRICING_TYPE=' + this.request.pricingType);
			}

			if (this.request.tripType != null) {
				serviceLevelURL.append('&TRIP_TYPE=' + this.request.tripType);
			}

			var description = '';
			if (segment != null && segment.fareFamily != null && segment.fareFamily.condition != null) {
				if (segment.fareFamily.condition.fullDescription != null) {
				description = segment.fareFamily.condition.fullDescription;
				}
				if (segment.fareFamily.condition.shortDescription != null) {
				description = description + segment.fareFamily.condition.shortDescription;
				}
			}

			return {
				serviceURL: serviceLevelURL.toString(),
				shortDescription: description
			}
		},
		createPaxArray: function(){
			var paxArray = [];
			if (this.tripplan.travellers != null){				
				for (current in this.tripplan.travellers){
					var currentPax = this.tripplan.travellers[current];
					paxArray.push(this._getTravellerName(currentPax));
				}																
			}
			return paxArray;											
		},		
		_getTravellerName: function(traveller) {
			var paxTypeString = this._getPaxTypeString(traveller.paxType.code);
			if (traveller.identityInformation.titleName != null && traveller.identityInformation.titleName != '') {
				//return new this._strBuffer(this.labels.tx_pltg_pattern_TravellerNameWithTitle).formatString([traveller.identityInformation.titleName,traveller.identityInformation.firstName,traveller.identityInformation.lastName]);
				return traveller.identityInformation.titleName + " " + traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			} else {
				return traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			}
		},
		_getPaxTypeString: function(code) {
			var paxTypeString = "";
			if (this.utils.booleanValue(this.config.siteAllowPax)) {
				if (code == 'ADT') {
					/*paxTypeString = this.labels.tx_merci_text_booking_alpi_adult;*/
					return paxTypeString;
				} else if (code == 'CHD') {
					paxTypeString = this.labels.tx_merci_text_booking_child;
				} else if (code == 'INF') {
					paxTypeString = this.labels.tx_merci_text_booking_alpi_infant;
				} else if (code == 'YCD') {
					paxTypeString = this.labels.tx_mc_text_addPax_snr;
				} else if (code == 'STU') {
					paxTypeString = this.labels.tx_mc_text_addPax_stdnt;
				} else if (code == 'YTH') {
					paxTypeString = this.labels.tx_mc_text_addPax_yth;
				} else if (code == 'MIL') {
					paxTypeString = this.labels.tx_mc_text_addPax_mlty;
				}
				if (paxTypeString != "") {
					paxTypeString = " (" + paxTypeString + ")";
				}
			}
			return paxTypeString;
		},
		
		createPaxEticketMap:function(){
			var paxEticketMap = {};
			for (ticket in this.request.travelletTicketMapBean){
				var currentTicket = this.request.travelletTicketMapBean[ticket];				
				paxEticketMap[ticket] = this._getTravellerNameFromTicketFafh(currentTicket.fafhInfo, currentTicket.travellerBean);
			}
			return paxEticketMap;
		},
		_getTravellerNameFromTicket: function(ticket, traveller) {
			var travellerName = '';
			var labels = this.labels;
			var siteParameters = this.config;
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
		_getTravellerNameFromTicketFafh: function(faFh, traveller) {
			var travellerName = '';
			var labels = this.labels;
			var siteParameters = this.config;
			if (traveller != null && faFh != null) {
				// create default traveller name to be displayed
				travellerName = traveller.identityInformation.titleName + ' ' + traveller.identityInformation.firstName + ' ' + traveller.identityInformation.lastName;
				// infant check
					if (faFh.passengerType == 'INF') {
						// i.e. ticket contains only an Infant Passenger
						return new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
					} else if (faFh.infantIncluded) {
						if (siteParameters.siteDispInfantName != null && siteParameters.siteDispInfantName.toLowerCase() == 'true') {
							var infantName = new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithoutInfantName).formatString([travellerName, infantName]);
						} else {
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithInfantName).formatString([travellerName]);
						}
					}
			}
			return travellerName;
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
		}
	}
});