Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.booking.templates.conf.MConfButtonsScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager'
	],

	$statics: {
		MEAL_CODE: 'MEA',
		SEAT_CODE: 'RQST',
		SEAT_ASSIGN_INPUT: 'PREF_AIR_SEAT_ASSIGMENT'
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		/**
		 * Determines whether the segment is eligible to seat map, and returns an object
		 * telling how to display the seat map link (display or not, disabled or not, link label)
		 */
		getSeatEligibility: function(segment, itiId) {

			var elig = {
				showLink: false,
				showWarning: false
			};
			if (this.utils.booleanValue(this.data.config.allowSeatMapModif) && !this.__isEligibleToCheckin(segment) && 
				(this.utils.booleanValue(this.data.config.allowMCSeatMap) || this.__isPnrTicketed()) && !this.__isOnHoldPNR()) {
				if(this.data.seatsEligibleSegments)
				{
					this.data.seatsEligibleSegments.push(segment.id);
				}
				if (this.__hasChargeableSeat(segment.id, itiId)) {
					/* Modification of chargeable seats is never allowed,
					 * but when seat modif is allowed by config, disabled link is displayed */
					elig.showLink = true;
					elig.disabled = true;
					elig.linkLabel = this.data.labels.tx_merci_text_changeseat;
					elig.showWarning = true;
				} else if (!this.__hasSeatSelection(segment)) {
					elig.showLink = true;
					elig.disabled = false;
					elig.linkLabel = this.data.labels.tx_merci_text_seatsel_btnselseats;
				} else if (this.utils.booleanValue(this.data.config.allowSeatMapModif)) {
					elig.showLink = true;
					elig.disabled = false;
					elig.linkLabel = this.data.labels.tx_merci_text_changeseat;
				}

			}

			if ((this.data.request.flow_Type != null) && (this.data.request.flow_Type == 'RETFLOW')) {
				if (this.data.request.sadadPaymentEnb == true) {
					elig.disabled = true;
				}
			} else {
				if (this.data.request.isSADADEnabled && this.data.request.PAYMENT_TYPE == "ASN") {
					elig.disabled = true;
				}
			}

			return elig;
		},

		__isEligibleToCheckin: function(segment) {
			var timeToDeparture = new Date(segment.beginDateGMT) - new Date();
			timeToDeparture = timeToDeparture / 360000;
			var timeFrame = 0;
			if (!this.utils.isEmptyObject(this.data.config.checkinTimeFrame) && this.data.config.checkinTimeFrame != "") {
				timeFrame = Number(this.data.config.checkinTimeFrame);
			}

			return this.utils.booleanValue(this.data.config.allowCheckin) && (timeToDeparture <= timeFrame);
		},

		__isPnrTicketed: function() {
			return this.utils.booleanValue(this.data.tripplan.pnr.isTicketed);
		},

		__hasChargeableSeat: function(segId, itiId) {
			var servicesByPax = this.data.tripplan.air.services.byPax;
			for (var paxId in servicesByPax) {
				var selectedSeat = this.__getSelectedService(segId, itiId, paxId, this.SEAT_CODE);
				if (selectedSeat && selectedSeat.hasPriceInfo) {
					return true;
				}
			}
			return false;
		},

		__getSelectedService: function(segId, itiId, paxId, serviceCode) {
			var paxServices = this.data.tripplan.air.services.byPax[paxId];
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

		__hasSeatSelection: function(segment) {
			var seat = null;
			if (segment != null) {
				var travellers = segment.travellerPreferences.travellers;
				if (travellers != null) {
					for (var i = 0; i < travellers.length; i++) {
						var seats = this.data.tripplan.air.seats;
						if (seats[segment.id] && seats[segment.id][travellers[i].paxNumber]) {
							seat = seats[segment.id][travellers[i].paxNumber].seatAssignement;
						}
						else {
							var seatId= 'seatId_'+travellers[i].paxNumber+segment.id;
							seat = this.moduleCtrl.getModuleData()[seatId];
						}
					}
				}
			}


			return !this.utils.isEmptyObject(seat);
		},

		_getPageTicket: function() {
			var pageTicket = '';
			if (!this.utils.isEmptyObject(this.data.reply.pageTicket) && !isNaN(this.data.reply.pageTicket)) {
				pageTicket = this.data.reply.pageTicket;
			}

			return pageTicket;
		},

		/**
		 * Event handler when the user clicks on 'Change seat' button
		 */
		selectSeat: function(evt, segment, itineraryIndex) {

			if (this.data.request.sadadPaymentEnb !== true) {
				//elig.disabled = true;
				if(!this.utils.isEmptyObject(this.data.seatsEligibleSegments))
				{
					var seatsEligibleSegments = JSON.stringify(this.data.seatsEligibleSegments) || "[]";
				}
				if (this.utils.booleanValue(this.data.config.merciServiceCatalog)) {
					this.__openServicesCatalog();
				} else {
					var params = {
						LAST_NAMES: this.data.request.LAST_NAMES,
						DISPLAY_OTHER_PAX: this.data.request.DISPLAY_OTHER_PAX,
						REC_LOC: this.data.request.REC_LOC,
						DIRECT_RETRIEVE_LASTNAME: this.data.request.DIRECT_RETRIEVE_LASTNAME,
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
						seatNos: this.data.request.seatNos,
						JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
						itinerary_index: itineraryIndex,
						PAGE_TICKET: this._getPageTicket(),
						OUTPUT_TYPE: "2",
						isReterieve: "TRUE",
						seatsEligibleSegments: seatsEligibleSegments
					};

					var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

					var action = 'MSeatMap.action';
					if (this.data.fromPage == 'conf') {
						action = 'MServicingSeatSelection.action';
					} else if ((null !== bp[14] && bp[14] !== "") || (this.utils.isRequestFromApps())){
						/* PTR 08425518 : Apps: Seatmap not working for stored PNR */
						action = 'MAPPRetrieve.action';
						params['DIRECT_RETRIEVE'] = 'TRUE';
						params['continue'] = 'Proceed+to+payment';
					}

					this.utils.sendNavigateRequest(params, action, this);
				}
			}
		},

		/**
		 * Opens the services catalogue page.
		 * When the catalogue of services is activated, the click on any service button brings to the catalogue page.
		 */
		__openServicesCatalog: function() {
			var params = {
				DIRECT_RETRIEVE: 'true',
				ACTION: 'MODIFY',
				DIRECT_RETRIEVE_LASTNAME: this.data.request.DIRECT_RETRIEVE_LASTNAME,
				REC_LOC: this.data.request.REC_LOC,
				PAGE_TICKET: this.data.reply.pageTicket
			};
			this.utils.sendNavigateRequest(params, 'MGetServiceCatalogFromCONF.action', this);
		},
		/**
		 * Determines whether the PNR is an on hold PNR or not		 
		 */
		__isOnHoldPNR: function(){
			return (this.data.request.isOnHoldPNR != null && this.data.request.isOnHoldPNR == 'P');
		},

		selectInfMeal: function() {
			var params = {
					ACTION: "MODIFY",
					BOOL_RETRIEVE: "true",
					FROM_PNR_RETRIEVE: "true",
					REC_LOC: this.data.request.REC_LOC,
					DIRECT_RETRIEVE_LASTNAME: this.data.request.DIRECT_RETRIEVE_LASTNAME,
					SERVICE_PRICING_MODE: "INIT_PRICE",
					PAGE_TICKET: this.data.reply.pageTicket,
					isInfantMeal: this.data.request.hasInfant,
					IS_USER_LOGGED_IN: this.IS_USER_LOGGED_IN
				};
				var action = 'MNewMealRetrieve.action';

				if (this.data.request.fromPage === 'CONF') {
					params.DIRECT_RETRIEVE = "true";
				}

				this.utils.sendNavigateRequest(params, action, this);
		},
		addToPassbook: function(evt, args){
			var isIOS = aria.core.Browser.isIOS;
			var osVersion = aria.core.Browser.osVersion;
			var params = "result=json&passStyle=boardingPass&passParameters="+JSON.stringify(args);
			var request = {
				parameters: params,
				action: 'MAddToPassbook.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.addToPassbookCallback,
					scope: this,
					args: null
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);			
		},
		addToPassbookCallback: function(response,args){
			document.getElementsByClassName("msk loading")[0].style.display = "none";
			if(response){
				var json = response.responseJSON;
				if (json) {
					var data = json.data;
					if(data){
						var passbookData = data.MAddToPassbook_A;
						if(passbookData){
							var passBase64String = passbookData.passBase64String;
							if(!this.utils.isEmptyObject(passBase64String)){
								window.location = 'data:application/vnd.apple.pkpass;base64,' + passBase64String; 
							}
						}
					}										
				}				
			}	
		},
		getIsMealSelected:function(){
			if(this.moduleCtrl.getModuleData().isMealSelected)
				return this.utils.booleanValue(this.moduleCtrl.getModuleData().isMealSelected);
			else
				return false;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MConfButtons",
						data:this.data
					});
			}
		}

	}
});