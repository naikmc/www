Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MConfFlightsItineraryScript',
	$dependencies: [
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.seatsEligibleSegments = [];
	},

	$prototype: {

		$dataReady: function() {
			this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
			if (this.data.rqstParams.reply && this.data.rqstParams.reply.tripPlanBean != undefined){
				this.data.rqstParams.tripPlanBean = this.data.rqstParams.reply.tripPlanBean;
			}
			if(this.data.rqstParams.reply && this.data.rqstParams.reply.serviceCategories != undefined){
				this.data.rqstParams.serviceCategories = this.data.rqstParams.reply.serviceCategories;
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MConfFlightsItinerary",
						data:this.data
					});
			}
		},


		_getTravellerName: function(traveller) {
			var paxTypeString = this._getPaxTypeString(traveller.paxType.code);
			if (traveller.identityInformation.titleName != null && traveller.identityInformation.titleName != '') {
				//return new this._strBuffer(this.data.labels.tx_pltg_pattern_TravellerNameWithTitle).formatString([traveller.identityInformation.titleName,traveller.identityInformation.firstName,traveller.identityInformation.lastName]);
				return traveller.identityInformation.titleName + " " + traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			} else {
				return traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			}
		},

		_getPaxTypeString: function(code) {
			var paxTypeString = "";
			if (this._merciFunc.booleanValue(this.data.siteParams.siteAllowPax)) {
				if (code == 'ADT') {
					/*paxTypeString = this.data.labels.tx_merci_text_booking_alpi_adult;*/
					return paxTypeString;
				} else if (code == 'CHD') {
					paxTypeString = this.data.labels.tx_merci_text_booking_child;
				} else if (code == 'INF') {
					paxTypeString = this.data.labels.tx_merci_text_booking_alpi_infant;
				} else if (code == 'YCD') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_snr;
				} else if (code == 'STU') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_stdnt;
				} else if (code == 'YTH') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_yth;
				} else if (code == 'MIL') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_mlty;
				}
				if (paxTypeString != "") {
					paxTypeString = " (" + paxTypeString + ")";
				}
			}
			return paxTypeString;
		},

		getSeatAssignment: function(paxNo, segmentId) {

			var seatAssignment = '';
			var seatAssignementsMap = null;
			if (this.data.rqstParams.listseatassignmentbean != null) {
				seatAssignementsMap = this.data.rqstParams.listseatassignmentbean.seatAssignementsMap;
			}

			if (!this._merciFunc.isEmptyObject(seatAssignementsMap)) {
				if (!this._merciFunc.isEmptyObject(seatAssignementsMap[segmentId])) {
					var newSeatAssignmentMap = seatAssignementsMap[segmentId];
					if (!this._merciFunc.isEmptyObject(newSeatAssignmentMap[paxNo])) {
						seatAssignment = newSeatAssignmentMap[paxNo].seatAssignement;
					}
				}
			} else {
				var seatId = 'seatId_' + paxNo + segmentId;
				if (!this._merciFunc.isEmptyObject(this.moduleCtrl.getModuleData()[seatId])) {
					seatAssignment = this.moduleCtrl.getModuleData()[seatId];
				}
			}
			return seatAssignment;
		},

		getSeatCharacsList: function(charsString) {
			var newCharStr = charsString.substring(1, charsString.length - 1);
			var charArray = newCharStr.split(",");
			var seatCharactersticsList = this.moduleCtrl.getModuleData().booking.MCONF_A.globalList.seatCharactersticsList;
			var resultCharStr = "";
			for (var c in charArray) {
				var seatCharacsCode = charArray[c].trim();
				for (ch in seatCharactersticsList) {
					var seatCHAR = seatCharactersticsList[ch];
					if (seatCharacsCode != " " && seatCHAR[0] == seatCharacsCode) {
						if (c == charArray.length - 1) {
							resultCharStr = resultCharStr.concat(seatCHAR[1]);
						} else {
							resultCharStr = resultCharStr.concat(seatCHAR[1], ", ");
						}
					}
				}
			}

			return resultCharStr;
		},
		/**
		 * Returns the string to display for this service on confirmation page
		 * The display format depends on the service category
		 */
		formatServiceDisplay: function(selection, service) {
			var serviceData = "";
			switch (service.category) {
				case 'SIT':
					serviceData = selection.getPropertyValue(service, 'SEAT_ASSIGNMENT');
					break;
				case 'BAG':
				case 'MEA':
				case 'SPE':
				case 'PET':
				case 'SPO':
				case 'OTH':
					serviceData = selection.getPropertyValue(service, 'NUMBER') + " " + service.name;
					break;
				default:
					serviceData = service.name?(selection.getPropertyValue(service, 'NUMBER') + " " + service.name):"";
			}

			return serviceData;
		},

		_getSeatInformation: function(rootSegment, travMapIndex) {

			var data = {
				printAllowed: false,
				seatNumber: null,
				charsString: '',
				seatServicePaxNum: '',
				paxNumber: ''
			};

			// do necessay null check before iterating over data
			if (rootSegment != null && travMapIndex >= 0 && this.data.rqstParams.allServicesByPax != null) {

				// counter
				var i = 1;

				// start iteration
				for (var key in this.data.rqstParams.allServicesByPax) {
					if (this.data.rqstParams.allServicesByPax.hasOwnProperty(key)) {
						var serviceByPaxRecord = this.data.rqstParams.allServicesByPax[key];
						for (var j = 0; this.data.rqstParams.listItineraryBean != null && j < this.data.rqstParams.listItineraryBean.itineraries.length; j++) {

							// create reference to itinerary
							var itinerary = this.data.rqstParams.listItineraryBean.itineraries[j];

							// compare if index matches
							if (j == this.data.itineraryIndex) {
								for (var k = 0; k < itinerary.segments.length; k++) {

									// get segment
									var segment = itinerary.segments[k];

									// compare if index matched
									if (parseInt(this.data.segmentIndex,10) == k && travMapIndex == i) {
										for (var p = 0; p < rootSegment.travellerPreferences.travellers.length; p++) {

											// get passenger reference
											var passenger = rootSegment.travellerPreferences.travellers[p];
											var serviceByItin = serviceByPaxRecord.allServicesByItinerary[itinerary.itemId];

											if (serviceByItin != null) {
												// get seat number
												data.seatNumber = serviceByItin[segment.id];

												if (data.seatNumber != null) {
													if (parseInt(i, 10) == passenger.paxNumber) {
														data.seatServicePaxNum = data.seatNumber.parameterMap['SELECTED_'].parameterValue;
														if (data.seatNumber.hasPriceInfo == true && data.seatServicePaxNum != '' && data.seatServicePaxNum == this.getSeatAssignment(passenger.paxNumber, rootSegment.id)) {

															// set data
															data.printAllowed = true;
															data.paxNumber = passenger.paxNumber;
															data.charsString = this.getSeatCharacsList(data.seatNumber.seatCharacsList);
														}
														else if(data.seatNumber.hasPriceInfo==false && data.seatServicePaxNum != ''){
															data.printAllowed = true;
														}
													}
												}
											}
										} // end of loop on travellers
									}
								} // end of loop on segments
							}
						} // end of loop on itineraries
					} // end of loop on service by pax

					// increment counter
					i = i + 1;
				}
			} // null check ends on passend parameters

			return data;
		},

		_createConfButtonJSON: function(rootSegment, seatServicePaxNum, lastName, hasInfant, isOperatedBySameAirline, passbookParams) {
			if (this.data.rqstParams.tripPlanBean != null && this.data.rqstParams.listseatassignmentbean != null && isOperatedBySameAirline==true){
			var data = {
				'fromPage': 'conf',
				'bound': this.data.itinerary,
				'segment': rootSegment,
				'labels': {
					'tx_merci_nwsm_warn_msg1': this.data.labels.tx_merci_nwsm_warn_msg1,
					'tx_merci_text_changeseat': this.data.labels.tx_merci_text_changeseat,
					'tx_merci_text_mybook_selmeal': this.data.labels.tx_merci_text_mybook_selmeal,
					'tx_merci_text_mealsel_mealpref': this.data.labels.tx_merci_text_mealsel_mealpref,
					'tx_merci_text_addbag_addbaggage': this.data.labels.tx_merci_text_addbag_addbaggage,
					'tx_merci_text_seatsel_btnselseats': this.data.labels.tx_merci_text_seatsel_btnselseats,
						'tx_merci_text_add_infant_meal': this.data.labels.tx_merci_text_add_infant_meal,
						'tx_merci_text_booking_conf_departure': this.data.labels.tx_merci_text_booking_conf_departure,
			    		'tx_merci_ts_tripdetailspage_Arrival': this.data.labels.tx_merci_ts_tripdetailspage_Arrival,
			    		'tx_merci_text_flight': this.data.labels.tx_merci_text_flight,
			    		'tx_merci_text_pax': this.data.labels.tx_merci_text_pax,
			   			'tx_merci_ts_confirmationpage_AirlinePNR': this.data.labels.tx_merci_ts_confirmationpage_AirlinePNR,
			   			'tx_merci_text_mybooking_eticket': this.data.labels.tx_merci_text_mybooking_eticket,
			   			'tx_merci_ts_paymentpage_Name': this.data.labels.tx_merci_ts_paymentpage_Name,
			   			'tx_merci_pattern_DateMonth': this.data.labels.tx_merci_pattern_DateMonth,
			   			'tx_merci_checkin_confirmation_psbk': this.data.labels.tx_merci_checkin_confirmation_psbk
				},
				'config': {
					'allowMCSeatMap': this.data.siteParams.siteAllowMCSeatMap,
					'allowSeatMapModif': this.data.siteParams.siteAllowSeatMapModif,
					'checkinTimeFrame': this.data.siteParams.siteCknTimeFrame,
					'allowCheckin': this.data.siteParams.siteAllowCheckin,
					'pnrNameFilter': this.data.siteParams.sitePnrNameFilter,
					'allowXBAG': this.data.siteParams.siteServXBag,
					'allowPNRModif': this.data.siteParams.siteAllowPnrModif,
					'allowPNRServ': this.data.siteParams.siteAllowPnrServ,
					'allowPNRTIModif': this.data.siteParams.siteAllowPnrTiModif,
					'allowSpecialMeal': this.data.siteParams.allowSpecialMeal,
					'merciServiceCatalog': this.data.siteParams.servicesCatalog,
						'infantMealAllowed': this.data.siteParams.infantMealAllowed,
						'siteEnablePassbook':this.data.siteParams.siteEnablePassbook
				},
				'tripplan': {
					'misc': this.data.rqstParams.tripPlanBean.misc,
					'pnr': {
						'isTicketed': this.data.rqstParams.tripPlanBean.isETicket
					},
					'air': {
						'seats': this.data.rqstParams.listseatassignmentbean.seatAssignementsMap,
						'services': {
							'byPax': this.data.rqstParams.tripPlanBean.air.services.byPax
						}
					}
				},
				'request': {
					'isScheduleChange': null,
					'isScheduleReject': null,
					'seatNos': seatServicePaxNum,
					'REC_LOC': this.data.rqstParams.tripPlanBean.REC_LOC,
					'DIRECT_RETRIEVE_LASTNAME': lastName,
					'PAYMENT_TYPE': this.data.rqstParams.param.paymentType,
					'isSADADEnabled': this.data.siteParams.siteSadadPayment,
					'isOnHoldPNR': this.data.rqstParams.reply.pnrStatusCode,
						'hasInfant': hasInfant,
						'tripPlanBean': this.data.rqstParams.tripPlanBean,
						'listseatassignmentbean': this.data.rqstParams.listseatassignmentbean,
						'isOperatedBySameAirline': isOperatedBySameAirline,
						'passbookParams':passbookParams
				},
				'reply': {
					'PAGE_TICKET': this.data.rqstParams.reply.pageTicket
					},
					'seatsEligibleSegments' : this.seatsEligibleSegments
				}
			}else{
				var data = {
					'fromPage': 'conf',
					'bound': this.data.itinerary,
					'segment': rootSegment,
					'labels': {
						'tx_merci_nwsm_warn_msg1': this.data.labels.tx_merci_nwsm_warn_msg1,
						'tx_merci_text_changeseat': this.data.labels.tx_merci_text_changeseat,
						'tx_merci_text_mybook_selmeal': this.data.labels.tx_merci_text_mybook_selmeal,
						'tx_merci_text_mealsel_mealpref': this.data.labels.tx_merci_text_mealsel_mealpref,
						'tx_merci_text_addbag_addbaggage': this.data.labels.tx_merci_text_addbag_addbaggage,
						'tx_merci_text_seatsel_btnselseats': this.data.labels.tx_merci_text_seatsel_btnselseats,
						'tx_merci_text_add_infant_meal': this.data.labels.tx_merci_text_add_infant_meal
					},
					'config': {
						'allowMCSeatMap': this.data.siteParams.siteAllowMCSeatMap,
						'allowSeatMapModif': this.data.siteParams.siteAllowSeatMapModif,
						'checkinTimeFrame': this.data.siteParams.siteCknTimeFrame,
						'allowCheckin': this.data.siteParams.siteAllowCheckin,
						'pnrNameFilter': this.data.siteParams.sitePnrNameFilter,
						'allowXBAG': this.data.siteParams.siteServXBag,
						'allowPNRModif': this.data.siteParams.siteAllowPnrModif,
						'allowPNRServ': this.data.siteParams.siteAllowPnrServ,
						'allowPNRTIModif': this.data.siteParams.siteAllowPnrTiModif,
						'allowSpecialMeal': this.data.siteParams.allowSpecialMeal,
						'merciServiceCatalog': this.data.siteParams.servicesCatalog,
						'infantMealAllowed': this.data.siteParams.infantMealAllowed,
						'siteEnablePassbook':this.data.siteParams.siteEnablePassbook
					},
					'tripplan': {
						'misc': this.data.rqstParams.tripPlanBean.misc,
						'pnr': {
							'isTicketed': this.data.rqstParams.tripPlanBean.isETicket
						}
					},
					'request': {
						'isScheduleChange': null,
						'isScheduleReject': null,
						'seatNos': seatServicePaxNum,
						'REC_LOC': this.data.rqstParams.tripPlanBean.REC_LOC,
						'DIRECT_RETRIEVE_LASTNAME': lastName,
						'PAYMENT_TYPE': this.data.rqstParams.param.paymentType,
						'isSADADEnabled': this.data.siteParams.siteSadadPayment,
						'isOnHoldPNR': this.data.rqstParams.reply.pnrStatusCode,
						'hasInfant': hasInfant,
						'tripPlanBean': this.data.rqstParams.tripPlanBean,
						'listseatassignmentbean': this.data.rqstParams.listseatassignmentbean,
						'isOperatedBySameAirline': isOperatedBySameAirline,
						'passbookParams':passbookParams
					},
					'reply': {
						'PAGE_TICKET': this.data.rqstParams.reply.pageTicket
					},
					'seatsEligibleSegments' : this.seatsEligibleSegments
				}
			}			
			return data;
		}
	}
});