/**
 * @class samples.templates.domevents.templates.pages.TemplateScript
 */
Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CPRRetreiveMultiPaxScript',

	$dependencies: [

		'modules.view.merci.common.utils.MerciGA'
	],

	$constructor: function() {

		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.KarmaDataReady = {};
		this.KarmaOnContinue = {};
		this.KarmaRetrieveOtherPassengersInTrip = {};
	},

	$prototype: {
		$dataReady: function() {
			this.$logInfo('MSSCIRetrieveMultiPaxScript::Entering dataReady function');
			var selectedCPR = this.moduleCtrl.getSelectedCPR();
			if (this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A) {
				this.requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.requestParam;
				this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);
				this.label = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.labels;
				this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.siteParam;
				this.parameters = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.parameters;
				this.moduleCtrl.setGADetails(this.parameters);
				this.moduleCtrl.setFrequentFlyerList(this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.freqFlyerRestList);
				this.moduleCtrl.setOperatingAirline(this.parameters.SITE_SSCI_OP_AIR_LINE);

				this.moduleCtrl.setHeaderInfo({
					title: this.label.Title,
					bannerHtmlL: this.requestParam.bannerHtml,
					homePageURL: this.siteParams.homeURL,
					showButton: true
				});

				this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.errorStrings;
				this.data.siteParameters = this.parameters;
				this.data.pageErrors = this.errorStrings;
				this.data.pageLabels = this.label;

			}
			var data = this.moduleCtrl.getCPR();
			var journeyNo = null;
			//In case of Direct Landing From CPR retreive to passenger Selection Page
			if (selectedCPR.journey == null || selectedCPR.journey == "" || data[selectedCPR.journey] == null) {
				for (journeyNo in data) {
					break;
				}
				if (journeyNo != null && data[journeyNo] != null) {
					this.KarmaDataReady["T13"] = "Single Jounery Updating Selected CPR"; //For TDD
					this.moduleCtrl.updateJourneySelectedCPR(journeyNo);
				}
			}

			this.KarmaDataReady["T12"] = "No need to update Selected CPR"; // For TDD
			if (!this.data.svTime) {

				this.data.svTime = this.requestParam.CPRIdentification.serverDateFormat;

			}
			this.currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd");
			if (this.data.directCalling) {
				this.data.directCalling = false;
				this.moduleCtrl.storeTripForDirectCall(this.requestParam.CPRInput);
			}

		},

		$displayReady: function() {
			this.$logInfo('MSSCIRetrieveMultiPaxScript::Entering displayReady function');
			try {
				/*To Display Warning Messages*/
				this.moduleCtrl.getWarningsForThePage("PSEL", this);
			} catch (exception) {
				this.$logError('MSSCIRetrieveMultiPaxScript::An error occured in displayReady function', exception);
			}
		},

		$viewReady: function() {
			this.$logInfo('MSSCIRetrieveMultiPaxScript::Entering viewReady function');
			try {
				/*GOOGLE ANALYTICS*/

				var customData = {};
				//if site parameter is enabled
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var cpr = this.moduleCtrl.getCPR();
				var journey = cpr[selectedCPR.journey];


				if (true) {
					customData['noOfPax'] = journey.paxList.length;
					customData['noOfSegments'] = journey.flightList.length;
					customData['pageTitle'] = "Select Pax";
				}
				if (this.moduleCtrl.getEmbeded()) {
					jQuery("[name='ga_track_pageview']").val("Select passengers");
					window.location = "sqmobile" + "://?flow=MCI/pageloaded=CPRRetreiveMultiPax";

				} else {
					var GADetails = this.moduleCtrl.getGADetails();



					this.__ga.trackPage({
						domain: GADetails.siteGADomain,
						account: GADetails.siteGAAccount,
						gaEnabled: GADetails.siteGAEnable,
						page: 'Select passengers',
						GTMPage: 'Select passengers',
						data: customData
					});
				}
				/*GOOGLE ANALYTICS*/
				/*BEGIN : JavaScript Injection(CR08063892)*/
				if (typeof genericScript == 'function') {
					genericScript({
						tpl: "CPRRetreiveMultiPax",
						data: this.data
					});
				}
				/*END : JavaScript Injection(CR08063892)*/

			} catch (exception) {
				this.$logError('MSSCIRetrieveMultiPaxScript::An error occured in viewReady function', exception);
			}
		},


		// This function is used to autoselect the passengers for checkin in the products eligible
		paxSelection: function(evt, args) {
			this.$logInfo('MSSCIRetrieveMultiPaxScript::Entering paxSelection function');
			try {
				this.$logInfo('MSSCIRetrieveMultiPax::Entering paxSelection function');
				var _this = this;
				var srcId = "cust_" + args.cust;
				buttonRef = jQuery('#multiPaxSelContinue');
				checkBoxPax = $('ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
				this.selectInfant(args.cust);
				checkIfenableNavigation(buttonRef);
			} catch (exception) {
				this.$logError('MSSCIRetrieveMultiPaxScript::An error occured in paxSelection function', exception);
			}
		},


		// This function is used to select the infant asociated with the selected passenger
		selectInfant: function(selectedPassenger) {
			try {
				this.$logInfo('MSSCIRetrieveMultiPaxScript::Entering selectInfant function');

				var form = jQuery("#CPRRetrieveMultipax");
				var passengerId = "cust_" + selectedPassenger;
				var infantId = "inf_" + selectedPassenger;
				if (jQuery('input[id=' + passengerId + ']', form).is(':checked')) {
					jQuery('input[id=' + infantId + ']', form).prop('checked', true);
				} else {
					jQuery('input[id=' + infantId + ']', form).prop('checked', false);
				}
			} catch (exception) {
				this.$logError('MSSCIRetrieveMultiPaxScript::An error occured in selectInfant function', exception);
			}
		},


		/**
		 * isPaxCheckedIn : Checking whether pax checked or not for a product level.
		 */
		isPaxCheckedIn: function(flight_index, primeId) {

			var chkdin = false;
			try {
				this.$logInfo('MSSCIRetreiveMultiPaxScript::Entering isPaxCheckedIn function');
				var cpr = this.moduleCtrl.getCPR();
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var journeyNo = selectedCPR.journey;
				var journey = cpr[journeyNo];
				for (var customerNo in journey.paxList) {
					if (journey.paxList[customerNo] == primeId) {
						var customer = journey[journey.paxList[customerNo]];

						var legArray = journey[flight_index].leg;
						for (var legNo in legArray) {
							var leg = legArray[legNo];
							var constraint1 = journey.paxList[customerNo] + leg.ID + "CAC";
							var constraint2 = journey.paxList[customerNo] + leg.ID + "CST";
							var indicators = journey.status.legPassenger;
							if ((indicators[constraint1] != null && indicators[constraint1].status[0].code == '1') || (indicators[constraint2] != null && indicators[constraint2].status[0].code == '1')) {
								chkdin = true;
							}
						}
					}
				}
			} catch (exception) {
				this.$logError('MSSCIRetreiveMultiPaxScript::An error occured in isPaxCheckedIn function', exception);
			}
			return chkdin;
		},


		onContinue: function(evt) {
			try {
				this.$logInfo('MSSCIRetreiveMultiPaxScript::Entering onContinue function');
				// We prevent the form to be submitted
				evt.preventDefault();
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

				//Variables to be used
				var cpr = this.moduleCtrl.getCPR();
				var form = jQuery("#CPRRetrieveMultipax");
				var cprInput = form.serializeObject();
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var journeyNo = selectedCPR.journey;
				var journey = cpr[journeyNo];
				var isEmpty = true;
				var errors = [];
				var selection = [];
				var paxSel = [];

				var minorAgeLmtParam = parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;
				var minorCheckToBePerformed = this.parameters.SITE_SSCI_RESTRICT_MINOR;
				//var minorCheckToBePerformed = "true";
				/*Begin : Checkin Child Alone Cannot Checkin Condition*/
				var childCount = 0;
				var validAdultCount = 0;
				var minorCount = 0;
				var SSRCount = 0;

				for (var custID in cprInput) {
					var cust = journey[custID];
					if (!jQuery.isUndefined(cust)) {

						if (journey[custID].passengerTypeCode == "ADT") {
							var selDOB = "";
							var years = 0;
							/**Checking SSR Validity**/
							var primeFlightID = journey.firstflightid;
							var constraint = custID + primeFlightID;
							var ssrValidAdult = true;
							for (var serviceNo in journey.service) {
								var service = journey.service[serviceNo];
								if (serviceNo.indexOf(constraint) != '-1') {
									if (this.parameters.SITE_SSCI_SR_CANT_CI_ALON.toUpperCase().search(service.services[0].SSRCode) != "-1") {
										ssrValidAdult = false;
									}
								}
							}

							if (ssrValidAdult) {
								if (((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1))) {
									/*BEGIN : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
									if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
										for (var reqDataIndex in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
											if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate)) {
												selDOB = new Date(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate);
												break;
											}
										}
									}
									/**If Not Found in Regulatory Details Beans then find in IDC*/
									if (selDOB == "") {
										if (!jQuery.isUndefined(cust.birthDate)) {
											selDOB = new Date(cust.birthDate);
										}
									}
									/**Finally Checkin DOB Validity*/
									if (selDOB != "") {
										years = this.getAgeOfCustomerInYears(selDOB);
									}
								}
								/** Incase He Is Validated Not Minor */
								if ((years >= minorAgeLmtParam) || (selDOB == "")) {
									validAdultCount += 1;
								} else {
									minorCount += 1;
								}
								/*END : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
							} else {
								SSRCount += 1;
							}
						} else if (journey[custID].passengerTypeCode == "CHD") {
							childCount++;
						}

					}
				}

				/**Checking checkedIn Pax In the Segment*/
				if ((childCount > 0 || minorCount > 0 || SSRCount > 0) && validAdultCount <= 0) {
					var childOrMinorNotAloneflag = false;

					for (var custIDIndex in journey.paxList) {
						var selDOB = "";
						var years = 0;
						var custID = journey.paxList[custIDIndex];
						var cust = journey[custID];
						if (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) {
							if (journey.customerDetailsBeans[custID].paxCheckedInLeg && cust.passengerTypeCode == "ADT") {
								if (((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1))) {
									/*BEGIN : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
									if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
										for (var i in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
											if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[i].personalDetailsBirthDate)) {
												selDOB = new Date(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[i].personalDetailsBirthDate);
												break;
											}
										}
									}
									/**If Not Found in Regulatory Details Beans then find in IDC*/
									if (selDOB == "") {
										if (!jQuery.isUndefined(cust.birthDate)) {
											selDOB = new Date(cust.birthDate);
										}
									}
									/**Finally Checkin DOB Validity*/
									if (selDOB != "") {
										years = this.getAgeOfCustomerInYears(selDOB);
									}
								}
								/** Incase He Is Validated Not Minor */
								if ((years >= minorAgeLmtParam) || (selDOB == "")) {
									childOrMinorNotAloneflag = true;
									break;
								}
								/*END : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/

							}
						}
					}
					if (!childOrMinorNotAloneflag) {
						if ((childCount > 0) || (minorCount > 0)) {
							errors.push({
								"localizedMessage": this.errorStrings[25000037].localizedMessage,
								"code": this.errorStrings[25000037].errorid
							});
							this.KarmaOnContinue["T1"] = 'Child/Minor passenger(s) cannot be checked-in alone'; // For TDD
							this.KarmaOnContinue["T17"] = 'Minor passenger(s) cannot be checked-in alone'; // For TDD
						}
						if (SSRCount > 0) {
							errors.push({
								"localizedMessage": jQuery.substitute(this.label.PaxSSRCantChkInAlone, this.parameters.SITE_SSCI_SR_CANT_CI_ALON)
							});
							this.KarmaOnContinue["T16"] = 'Passenger with WCHR SSR restricted to check-in alone'; // For TDD
						}
						
					}
				}

				/*End : Checkin Child Alone Cannot Checkin Condition*/

				// For TDD 



				if (errors != null && errors.length > 0) {
					this.moduleCtrl.displayErrors(errors, "cprErrors", "error");
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
					return null;
				}
				this.KarmaOnContinue["T2"] = "No error thrown";
				this.moduleCtrl.getListOfCheckedItems("custSelCheckBox", "name");
				this.moduleCtrl.navigate(null, "merci-checkin-MSSCISelectFlights_A");

			} catch (exception) {
				this.$logError('MSSCIRetreiveMultiPaxScript::An error occured in onContinue function', exception);
			}
		},

		/* Retrieve the passengers with the entered last last. Update the cpr and refresh the tpl.*/
		retrieveOtherPassengersInTrip: function(evt) {
			try {
				this.$logInfo('CPRRetreiveMultiPaxScript::Entering retrieveOtherPassengersInTrip function');
				evt.preventDefault();
				var otherLastNamesInTrip = this.moduleCtrl.getNotRetrievedLastNames();
				var enteredLastName = jQuery("#otherLastNameField").val().toUpperCase();
				var cprRetLastName = this.moduleCtrl.getLastName();
				if (otherLastNamesInTrip != null && otherLastNamesInTrip.indexOf(enteredLastName) == -1) {
					if (enteredLastName != cprRetLastName.toUpperCase()) {
						var errors = [];
						jQuery("#cprErrors").disposeTemplate();
						errors.push({
							"localizedMessage": this.errorStrings[21400076].localizedMessage,
							"code": this.errorStrings[21400076].errorid
						});
						this.KarmaRetrieveOtherPassengersInTrip["T10"] = 'Please enter a valid Last Name.'; // For TDD
						this.moduleCtrl.displayErrors(errors, "cprErrors", "error");
					}
					return false;
				}
				this.updateJSONForCurrentLastName(enteredLastName);
				this.updateRetrPannelReq();
				this.$refresh();
				this.KarmaRetrieveOtherPassengersInTrip["T9"] = 'Other lastnames retrieved successfully'; // For TDD
			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in retrieveOtherPassengersInTrip function', exception);
			}
		},

		/* Update the retrieved details in the CPR json for the entered last name*/
		updateJSONForCurrentLastName: function(enteredLastName) {
			try {
				this.$logInfo('CPRRetreiveMultiPaxScript::Entering updateJSONForCurrentLastName function');
				var currCPR = this.moduleCtrl.getCPR();
				var currJourneyNo = this.moduleCtrl.getSelectedCPR().journey;
				var currJourney = currCPR[currJourneyNo];
				for (var i = 0; i < currJourney.paxList.length; i++) {
					var currCustomer = currJourney[currJourney.paxList[i]];
					if (currCustomer.passengerTypeCode != "INF") {
						if (currCustomer.personNames[0].surname == enteredLastName) {
							currJourney.customerDetailsBeans[currJourney.paxList[i]].custRetrieved = true;
						}
					}
				}
				this.moduleCtrl.setCPR(currCPR);
			} catch (e) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in updateJSONForCurrentLastName function', exception);
			}
		},

		/* Update the Retrieve panel show/hide information based on the passengers available in the current CPR. */
		updateRetrPannelReq: function() {
			this.$logInfo('CPRRetreiveMultiPaxScript::Entering updateRetrPannelReq function');
			try {

				var retrrievePanelRequired = false;
				var currCPR = this.moduleCtrl.getCPR();
				var currJourneyNo = this.moduleCtrl.getSelectedCPR().journey;
				var currJourney = currCPR[currJourneyNo];
				for (var i = 0; i < currJourney.paxList.length; i++) {
					var currCustomer = currJourney[currJourney.paxList[i]];
					if (currCustomer.passengerTypeCode != "INF") {
						if (!currJourney.customerDetailsBeans[currJourney.paxList[i]].custRetrieved) {
							retrrievePanelRequired = true;
							break;
						}
					}
				}
				if (retrrievePanelRequired) {
					currJourney.retrPannelReq = true;
				} else {
					currJourney.retrPannelReq = false;
				}
				this.moduleCtrl.setCPR(currCPR);

			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in updateRetrPannelReq function', exception);
			}

		},

		getAgeOfCustomerInYears: function(selDOB) {
			this.$logInfo('CPRRetreiveMultiPaxScript::Entering getAgeOfCustomerInYears function');
			try {
				var years = 0;
				var dCurr = new Date(this.currDate);
				if (selDOB.getFullYear() < dCurr.getFullYear()) {
					if (selDOB.getMonth() <= dCurr.getMonth()) {
						if (selDOB.getMonth() == dCurr.getMonth()) {
							if (selDOB.getDate() <= dCurr.getDate()) {
								years = dCurr.getFullYear() - selDOB.getFullYear();
							} else {
								years = dCurr.getFullYear() - selDOB.getFullYear() - 1;
							}
						} else {
							years = dCurr.getFullYear() - selDOB.getFullYear();
						}
					} else {
						years = dCurr.getFullYear() - selDOB.getFullYear() - 1;
					}
				} else {
					years = (dCurr.getTime() - selDOB.getTime()) / (1000 * 3600 * 24 * 365);
				}
				return years;
			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in getAgeOfCustomerInYears function', exception);
			}

		},

		onBackClick: function() {
			this.$logInfo('CPRRetreiveMultiPaxScript::Entering onBackClick function');
			try {
				this.moduleCtrl.onBackClick();
			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in onBackClick function', exception);
			}
		},

		/* onModuleEvent : Module event handler called when a module
		 * event is raised.
		 */
		onModuleEvent: function(evt) {
			try {
				this.$logInfo('AcceptanceConfirmationScript::Entering onModuleEvent function');
				// var errorStrings = this.moduleCtrl.getErrorStrings();

				var _this = this;
				switch (evt.name) {
					case "page.refresh":
						_this.$dataReady();
						_this.$refresh();
						break;
				}

			} catch (exception) {
				this.$logError('AcceptanceConfirmationScript::An error occured in onModuleEvent function', exception);
			}
		}

		/*loadRequiredPage: function() {
			this.$logInfo('CPRRetreiveMultiPaxScript::Entering showRetrievePage function');
			try {
				Aria.loadTemplate({
			          classpath: "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CheckInNew",
			          moduleCtrl: this.moduleCtrl,
			          div: "multipaxAddpassengerBlock",
			          args:[{flow:"AddPassenger",selectedJourneyID:this.moduleCtrl.getSelectedCPR().journey},{}]
				});

			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in showRetrievePage function', exception);
			}
			}

		onAddPaxClick: function() {
			this.$logInfo('CPRRetreiveMultiPaxScript::Entering onAddPaxClick function');
			try {
				var lastName = $("#add_last_name").val();
				var CPR_toAdd = $("#add_pnr").val();
				var cprInput_add = {};
				cprInput_add.IdentificationType = "bookingNumber";
				cprInput_add.lastName = lastName.trim();
				cprInput_add.recLoc = CPR_toAdd.trim();
				cprInput_add.flow = "AddPassenger";
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				cprInput_add.selectedJourneyID = selectedCPR.journey;
				this.moduleCtrl.cprRetreive(cprInput_add);

			} catch (exception) {
				this.$logError('CPRRetreiveMultiPaxScript::An error occured in onAddPaxClick function', exception);
			}
		}*/


	}
});