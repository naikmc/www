/**
 * @class samples.templates.domevents.templates.pages.TemplateScript
 */
Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.SelectFlightsScript',
	$dependencies: [

		'modules.view.merci.common.utils.MerciGA'
	],

	$constructor: function() {

		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.KarmaDisplayReady = {};
		this.KarmaCheckStopOver = {};
		this.KarmaOnContinueClick = {};
	},
	$prototype: {
		$dataReady: function() {
			this.$logInfo('SelectFlightsScript::Entering dataReady function');
			try {

				/*For Selected CPR */
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				/*In Case of InDirect Landing to Flight Selection Page From Passenger sElection page*/
				this.requestParam = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].requestParam;
				this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);
				if (this.moduleCtrl.getLandingPageDetail() == 'MSSCISelectFlights_A') {
					/*For CPR Modified Response*/
					var data = this.moduleCtrl.getCPR();


					if (selectedCPR.journey == "") {
						//Code For Setting Journey
						var journeyNo = null;
						for (journeyNo in data) {
							break;
						}
						if (journeyNo != null && data[journeyNo] != null) {
							this.moduleCtrl.updateJourneySelectedCPR(journeyNo);
						}
					}
					if (selectedCPR.customer == null || selectedCPR.customer == "" || selectedCPR.customer == []) {
						//Code For Setting modified json in case of Direct Landing on flight Selection From (cpr retreive or journey Selection Page)
						//Code for Setting Customer
						var selectedPax = [];
						//Code for Setting Adult and Infant
						for (var passenger in data[selectedCPR.journey].paxList) {
							var passengerId = data[selectedCPR.journey].paxList[passenger];
							selectedPax.push(passengerId);
						}
						this.moduleCtrl.updatePaxSelectedCPR(selectedPax);
					}
				}

				/*
				 * forcibly making it to true, as sequential checkin mandatetory for SSCI
				 * */
				this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].parameters.SITE_SSCI_SEQ_FLT_SEL = "true";

				this.requestParam = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].requestParam;
				this.label = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].SelectFlights.labels;
				this.siteParams = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].siteParam;
				this.parameters = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].parameters;
				this.moduleCtrl.setGADetails(this.parameters);
				this.moduleCtrl.setFrequentFlyerList(this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].freqFlyerRestList);
				this.moduleCtrl.setOperatingAirline(this.parameters.SITE_SSCI_OP_AIR_LINE);

				/**
				 * For update IDC with new fqtv, as we resetting setCPR for latest IDC response we are calling this
				 * function here
				 **/
				this.moduleCtrl.updateFQTVDeatilsInCPR();

				this.moduleCtrl.setHeaderInfo({
					title: this.label.Title,
					bannerHtmlL: this.requestParam.bannerHtml,
					homePageURL: this.siteParams.homeURL,
					showButton: true
				});

				this.errorStrings = this.moduleCtrl.getModuleData().checkIn[this.moduleCtrl.getLandingPageDetail()].errorStrings;
				this.currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd");
				this.data.siteParameters = this.parameters;
				this.data.pageErrors = this.errorStrings;
				this.data.pageLabels = this.label;


				/*Calling for country re construction*/
				this.moduleCtrl.countryList();
				if (this.data.directCalling) {
					this.data.directCalling = false;
					this.moduleCtrl.storeTripForDirectCall(this.requestParam.CPRInput);
				}
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in dataReady function', exception);
			}
		},

		$destructor: function() {

			//console.log("====================== DESTRUCTED ================");

			//this.moduleCtrl.setSelectedCPR(this.tempSelectedCPR);

		},

		$displayReady: function() {
			this.$logInfo('SelectFlightsScript::Entering displayReady function');
			try {
				this.moduleCtrl.getWarningsForThePage("FSEL", this);
				var CPRdata = this.moduleCtrl.getCPR();
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var journey = selectedCPR.journey;
				var noOfFlights = CPRdata[journey].flightList.length;
				var errors = [];


				/*Code From Diabling if User Cannot Proceed Further in current Session*/
				if (this.moduleCtrl.getIsSelectFlightPageError() == true) {
					jQuery("#section1 input[type='checkbox']").prop("checked", false);
					jQuery("#section1 input[type='checkbox']").attr("disabled", "disabled");
					jQuery("#selectFlightContinue").attr("disabled", "disabled");
					jQuery("#selectFlightContinue").addClass('disabled');

					this.moduleCtrl.displayErrors(jsonResponse.mciErrors, "initiateandEditErrors", "error");

					//For TDD
					this.KarmaDisplayReady[5] = "When User Cannot Proceed Further in current Session";
				}

				var buttonRef = jQuery('#selectFlightContinue');
				var checkBoxFlights = $('ul.checkin-list[data-info="flights-ready-list-ssci"] input[type="checkbox"]');
				var dgrGoodsOrUSFlag = false;
				if (this.parameters.SITE_SSCI_DG_PG_LOCATION == "FSEL" /*|| (this.parameters.SITE_SSCI_USPHMSA_LOCATON == "FSEL" && this.isUSRoute()) */ ) {
					dgrGoodsOrUSFlag = true;
				}
				var _this = this;
				$(document).on("change", 'ul.checkin-list[data-info="flights-ready-list-ssci"] input[type="checkbox"]', function() {

					_this.checkIfenableNav(buttonRef, checkBoxFlights, dgrGoodsOrUSFlag);
				});

				var allowSequentialCheckin = false;
				var allowJourneySelection = false;

				if (this.parameters.SITE_SSCI_SEQ_FLT_SEL.search(/true/i) != "-1") {
					allowSequentialCheckin = true;
				}
				if (this.parameters.SITE_SSCI_JNY_LVL_FLT_SEL.search(/true/i) != "-1") {
					allowJourneySelection = true;
				}

				/*For restricting user to select flight in case if all pax in that flight are already checked in*/
				jQuery(".flightSelCheckBox").each(function() {


					if (jQuery(this).nextUntil(".pax-sub-list").eq(jQuery(this).eq(0).nextUntil(".pax-sub-list").length - 1).find(".checkedin").length == jQuery(this).nextUntil(".pax-sub-list").eq(jQuery(this).eq(0).nextUntil(".pax-sub-list").length - 1).find("li.pax").length) {
						jQuery(this).prop("checked", false).attr("disabled", "disabled");
						jQuery(this).addClass("canNotChange");

						// ForTDD
						_this.KarmaDisplayReady[1] = "When all PAX for a flight are already checked in ";

					}

					if (allowJourneySelection && !$(this).hasClass("canNotChange")) {
						jQuery(this).prop("checked", true).attr("disabled", "disabled");

						// For TDD
						_this.KarmaDisplayReady[2] = "When JourneySelection is allowed and all flights are valid, all segments should be disabled";

					}

					/*
					 * For stop over suppresser
					 * */
					if (!allowJourneySelection && !$(this).hasClass("canNotChange") && $(this).is(":checked")) {
						_this.checkstopover(jQuery(this));

						// For TDD
						_this.KarmaDisplayReady[3] = " When JourneySelection is false allowed and the flight is selected , it should call stopOverSupressor";
					}
					/*
					 * End For stop over suppresser
					 * */
				});

				/*Journey check box*/
				$("#flight01").change(function() {

					if ($('#flight01').is(':checked')) {
						for (var i = 1; i <= noOfFlights; i++) {
							if (!$('#seg0' + i).hasClass("canNotChange")) {
								if (allowJourneySelection) {
									$('#seg0' + i).prop("checked", true);
									//for TDD
									_this.KarmaDisplayReady[6] = " When journey checkbox changed :checked and JourneySelection is not allowed";
								} else {
									$('#seg0' + i).removeAttr("disabled").prop("checked", true);
									//for TDD
									_this.KarmaDisplayReady[7] = " When journey checkbox changed :checked and JourneySelection is allowed";
								}

							}

						}

					} else {
						for (var i = 1; i <= noOfFlights; i++) {
							if (!$('#seg0' + i).hasClass("canNotChange")) {
								if (allowJourneySelection) {
									$('#seg0' + i).prop('checked', false);
									//For TDD
									_this.KarmaDisplayReady[8] = " :When journey checkbox changed :unchecked and JourneySelection is allowed ";
								} else {
									$('#seg0' + i).removeAttr("disabled").prop('checked', false);
									//For TDD
									_this.KarmaDisplayReady[9] = " When journey checkbox changed unchecked and JourneySelection is not allowed ";
								}
							}
						}

						/*For impose sequential check in*/
						var flag = false;
						if (!allowJourneySelection && allowSequentialCheckin) {
							for (var i = 1; i <= noOfFlights; i++) {
								if (!$('#seg0' + i).hasClass("canNotChange") && !flag) {
									flag = true;
								} else if (!$('#seg0' + i).hasClass("canNotChange") && flag) {
									jQuery('#seg0' + i).prop("checked", false).attr("disabled", "disabled");
									//for TDD
									_this.KarmaDisplayReady[10] = "When SequentialCheckin is allowed";
								}
							}
						}

					}

					jQuery(".flightSelCheckBox").each(function() {

						/*
						 * For stop over suppresser
						 * */
						if (!allowJourneySelection && !$(this).hasClass("canNotChange") && $(this).is(":checked")) {
							_this.checkstopover(jQuery(this));
						}
						/*
						 * End For stop over suppresser
						 * */
					});

				});

				/* Each flight check boxes */
				$(".flightSelCheckBox").change(function() {

					if (!allowJourneySelection) {
						if ($(".flightSelCheckBox:checked").length == ($(".flightSelCheckBox").length - $(".canNotChange").length)) {
							$("#flight01").prop("checked", true);
							//for TDD
							_this.KarmaDisplayReady[12] = "When segment checkbox change (checked) and  all valid segments selected  ";
						} else {
							$("#flight01").prop("checked", false);
							//for TDD
							_this.KarmaDisplayReady[11] = "When Segment checkbox change (checked) and  all valid segments are not selected";
						}

						if (allowSequentialCheckin) {
							if (jQuery(this).is(':checked')) {
								var flag = false;
								var flightSelCheckBox_this = this;
								jQuery("[id^='seg0']").each(function() {

									if ((parseInt(jQuery(this).attr("name")) > parseInt(jQuery(flightSelCheckBox_this).attr("name"))) && !jQuery(this).hasClass("canNotChange") && !flag) {
										flag = true;
										$(this).removeAttr("disabled").prop('checked', false);
										//For TDD
										_this.KarmaDisplayReady[13] = "When segment checkbox change (checked) and when SequentialCheckin is allowed ";
									} else if ((parseInt(jQuery(this).attr("name")) > parseInt(jQuery(flightSelCheckBox_this).attr("name"))) && !jQuery(this).hasClass("canNotChange")) {
										$(this).attr("disabled", "disabled").prop('checked', false);
										//For TDD
										_this.KarmaDisplayReady[14] = "When segment checkbox change (checked) and when SequentialCheckin is allowed ";
									}


								});
							} else {

								var flightSelCheckBox_this = this;
								jQuery("[id^='seg0']").each(function() {

									if ((parseInt(jQuery(this).attr("name")) > parseInt(jQuery(flightSelCheckBox_this).attr("name"))) && !jQuery(this).hasClass("canNotChange")) {

										$(this).attr("disabled", "disabled").prop('checked', false);

										//For TDD
										_this.KarmaDisplayReady[15] = "When segment checkbox change (unchecked) and when SequentialCheckin is allowed";
									}


								});
							}
						}

						/*
						 * For stop over suppresser
						 * */
						if (!$(this).hasClass("canNotChange")) {
							_this.checkstopover(jQuery(this));
						}
						/*
						 * End For stop over suppresser
						 * */
					}


				});

				if ($(".flightSelCheckBox:checked").length == 0) {
					$("#flight01").attr("disabled", "disabled").prop('checked', false);
					$("#selectFlightContinue").attr("disabled", "disabled").addClass('disabled');
					//For TDD
					this.KarmaDisplayReady[4] = "When no flight is selected , journey checkbox should be disabled";
				}

			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in displayReady function', exception);
			}
		},

		$viewReady: function() {
			this.$logInfo('SelectFlightsScript::Entering viewReady function');
			try {
				//For Setting the Page from Which PassengerDetails Screen Can Be Called.
				this.moduleCtrl.setPassengerDetailsFlow("FSEL");
				this.moduleCtrl.setSuccess("");
				this.moduleCtrl.setErrors("");

				/*GOOGLE ANALYTICS */
				if (this.moduleCtrl.getEmbeded()) {
					jQuery("[name='ga_track_pageview']").val("Select flight");
					window.location = "sqmobile" + "://?flow=MCI/pageloaded=selectFlights";

				} else {
					var GADetails = this.moduleCtrl.getGADetails();


					this.__ga.trackPage({
						domain: GADetails.siteGADomain,
						account: GADetails.siteGAAccount,
						gaEnabled: GADetails.siteGAEnable,
						page: 'Select flight',
						GTMPage: 'Select flight'
					});

				}
				/*GOOGLE ANALYTICS*/
				/*BEGIN : JavaScript Injection(CR08063892)*/
				if (typeof genericScript == 'function') {
					genericScript({
						tpl: "SelectFlights",
						data: this.data
					});
				}
				/*END : JavaScript Injection(CR08063892)*/
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in viewReady function', exception);
			}
		},
		/*
		 * For stop over suppresser
		 *
		 * PLEASE NOTE THAT WE ARE NOT DEPENDING ON is-checked class ANY WHERE EXCEPT IT IS APPLIED FROM TPL AND appCTRL.
		 * */
		checkstopover: function(BaseElement) {
			this.$logInfo('SelectFlightsScript::Entering checkstopover function');
			try {
				var temp = jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").attr("data-stopover");
				if (temp != undefined && typeof temp == "string" && temp.search(/true/gi) != -1) {
					if (BaseElement.is(":checked")) {
						if (!jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").is(":checked")) {
							jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").trigger("click");

						}
						jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").attr("disabled", "disabled");
						this.checkstopover(jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']"));

						//For TDD
						this.KarmaCheckStopOver["checkedCount"] ++;
					} else {
						/*jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").removeAttr("checked");
						jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").removeAttr("disabled");
						 */

						this.checkstopover(jQuery("#passInfo01").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']"));
						//For TDD
						this.KarmaCheckStopOver["uncheckedCount"] ++;
					}
				}
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in checkstopover function', exception);
			}

		},
		/*
		 * End For stop over suppresser
		 * */
		// Function is used to check whether flight checkin is eligible or not
		isFlightEligible: function(product) {
			this.$logInfo('SelectFlightsScript::Entering isFlightEligible function');
			try {
				// based on the marketingCarrier, chk is done
				if (!product.primeFlightEligible) {
					this.errorMsg = jQuery.substitute(this.label.OtherAirline, product.flightId.substring(0, 1));
					this.isCurrentPrime = false;
					return false;
				}

				if (!product.flightOpen) {
					this.errorMsg = this.label.FlightNotOpen;
					return false;
				}

				/* // based on the checkin opentime site parameter, chk is done
		if(!product.flightOpen && !product.open){
			this.errorMsg = jQuery.substitute(this.label.ChkOpn, this.parameters.SITE_MCI_ACPTNC_TIME);
			return false;
		}*/

				if (!product.flightEligible) {
					this.errorMsg = this.label.ResTkt;
					return false;
				}


				//		// based on the no of passengers checked in, chk is done
				//		if (!(this.isEligible(product_index))){
				//			this.errorMsg = this.label.ResTkt;
				//			return false;
				//		}

				// based on the booking status site parameter, chk is done
				//var segmentBookingStatErr = true;

				//		if (product.segmentBookingStatus){
				//			this.segmentBookingStatErr = false;
				//			/*if(segmentBookingStatErr){
				//				this.segmentBookingStatErr = true;
				//				return false;
				//			}*/
				//		}else
				//		{
				//			this.segmentBookingStatErr = true;
				//			return false;
				//		}

				return true;
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in isFlightEligible function', exception);
			}
		},

		loadEditPAXScreen: function(evt, args) {
			this.$logInfo('SelectFlightsScript::Entering loadEditPAXScreen function');
			try {
				this.moduleCtrl.setSelectedEditpax(args);
				this.moduleCtrl.passengerDetailsLoad();
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in loadEditPAXScreen function', exception);
			}
		},

		dgrGoodsOrUSCheck: function(evt) {
			this.$logInfo('SelectFlightsScript::Entering dgrGoodsOrUSCheck function');
			try {
				var buttonRef = jQuery('#selectFlightContinue');
				var checkBoxFlights = $('ul.checkin-list[data-info="flights-ready-list-ssci"] input[type="checkbox"]');
				var dgrGoodsOrUSFlag = true;
				this.checkIfenableNav(buttonRef, checkBoxFlights, dgrGoodsOrUSFlag);
				return false;
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in dgrGoodsOrUSCheck function', exception);
			}
		},

		checkIfenableNav: function(buttonRef, checkBoxFlights, dgrGoodsOrUSFlag) {
			this.$logInfo('SelectFlightsScript::Entering checkIfenableNav function');
			try {
				/*No Of Yes Nos Boxes Conditons Check*/
				var enableTheButton = true;
				//		    checkUSBoxDAG = $('ul.checkin-list[data-info="USPHMSA"] input[type="checkbox"]');
				//		    if(checkUSBoxDAG != undefined && checkUSBoxDAG.length>0){
				//		    	if(!jQuery(checkUSBoxDAG.selector).is(':checked')){
				//		    		  enableTheButton = false;
				//		    	}
				//		    }
				checkDGBoxDAG = $('ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
				if (checkDGBoxDAG != undefined && checkDGBoxDAG.length > 0) {
					if (!jQuery(checkDGBoxDAG.selector).is(':checked')) {
						enableTheButton = false;
					}
				}
				/*No Of Yes Nos Boxes Condition Check*/


				var buttonToEnable = buttonRef ? buttonRef : $('footer.buttons button').eq(0);

				if (checkBoxFlights.width() === null) {
					buttonToEnable.removeClass('disabled');
					buttonToEnable.removeAttr("disabled");
				} else {
					if (dgrGoodsOrUSFlag) {
						if (enableTheButton && checkBoxFlights.is(':checked')) {
							buttonToEnable.removeClass('disabled');
							buttonToEnable.removeAttr("disabled");
						} else {
							buttonToEnable.addClass('disabled');
							buttonToEnable.attr("disabled", "disabled");
						}
					} else {
						if (checkBoxFlights.is(':checked')) {
							buttonToEnable.removeClass('disabled');
							buttonToEnable.removeAttr("disabled");
						} else {
							buttonToEnable.addClass('disabled');
							buttonToEnable.attr("disabled", "disabled");
						}
					}
				}
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in checkIfenableNav function', exception);
			}
		},

		loadDRGScreen: function(evt, args) {
			this.$logInfo('SelectFlightsScript::Entering loadDRGScreen function');
			try {
				this.moduleCtrl.dangerousGoods_load();
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in loadDRGScreen function', exception);
			}
		},

		onContinueClick: function() {
			this.$logInfo('SelectFlightsScript::Entering onContinueClick function');
			try {
				this.moduleCtrl.getListOfCheckedItems("flightSelCheckBox", "data-flightid");

				var CPRdata = this.moduleCtrl.getCPR();
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var journeyID = selectedCPR.journey;
				var journey = CPRdata[journeyID];
				var errors = [];
				var minorAgeLmtParam = parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;
				var minorCheckToBePerformed = this.parameters.SITE_SSCI_RESTRICT_MINOR;
				/*Begin : Checkin Child Alone Cannot Checkin Condition*/

				for (var flightIndex in selectedCPR.flighttocust) {
					var childCount = 0;
					var validAdultCount = 0;
					var minorCount = 0;

					var flightID = selectedCPR.flighttocust[flightIndex].product;

					for (var customerIndex in selectedCPR.flighttocust[flightIndex].customer) {
						var custID = selectedCPR.flighttocust[flightIndex].customer[customerIndex];
						var cust = journey[custID];

						if (journey[custID].passengerTypeCode == "ADT") {
							var selDOB = "";
							var years = 0;

							/**Checking SSR Validity**/
							var constraint = custID + flightID;
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
									validAdultCount += 1;
								} else {
									minorCount += 1;
								}
								/*END : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
							} else {
								minorCount += 1;
							}
						} else if (journey[custID].passengerTypeCode == "CHD") {
							childCount++;
						}
					}

					/**Checking checkedIn Pax In the Segment*/
					if ((childCount > 0 || minorCount > 0) && validAdultCount == 0) {
						var childOrMinorNotAloneflag = false;

						for (var custIDIndex in journey.paxList) {
							var selDOB = "";
							var years = 0;
							var custID = journey.paxList[custIDIndex];
							var cust = journey[custID];
							var constraint = custID + flightID;
							if (!jQuery.isUndefined(journey.productDetailsBeans[constraint])) {
								if (journey.productDetailsBeans[constraint].paxCheckedInStatusInCurrProd && cust.passengerTypeCode == "ADT") {
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
							errors.push({
								"localizedMessage": this.errorStrings[25000037].localizedMessage
							});
							//For TDD
							this.KarmaOnContinueClick["message"] = "Not allowed without adult ";

						}
					}
				}
				/*End : Checkin Child Alone Cannot Checkin Condition*/


				/*
				 * For impose sequential checkin
				 * */
				this.validateSeqSelection(errors);

				if (errors.length > 0) {
					this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
					return null;
				}

				this.moduleCtrl.checkRegulatory();

				console.log(this.moduleCtrl.getSelectedCPR());
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in onContinueClick function', exception);
			}
		},

		validateSeqSelection: function(errors) {
			this.$logInfo('SelectFlightsScript::Entering validateSeqSelection function');
			try {
				/*
				 * This get latest restricted flight index
				 *
				 * for ex in a list of flights 5 flight 2 and 4 are restricted then it return 3 i.e the index of 4 th flight
				 *
				 * Note: which exclude flights checked in already
				 * */
				var latestRestCheckinIndex = jQuery(".checkindenained").eq(jQuery(".checkindenained").length - 1).parentsUntil("[id^='trip0']").eq(jQuery(".checkindenained").eq(jQuery(".checkindenained").length - 1).parentsUntil("[id^='trip0']").length - 1).parent().index();

				/*
				 * latst flight selected index
				 *
				 * ex for above scenario the result is 4
				 * */
				var latestCheckedcheckboxIndex = jQuery(".flightSelCheckBox:checked").parentsUntil("[id^='trip0']").eq(0).parent().index();

				/*
				 * condition to seq chckin fails
				 * */
				if (latestRestCheckinIndex != -1 && latestCheckedcheckboxIndex > latestRestCheckinIndex && this.parameters.SITE_SSCI_SEQ_FLT_SEL.search(/true/i) != "-1") {
					errors.push({
						"localizedMessage": this.label.DisCheckin
					});
				}
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in validateSeqSelection function', exception);
			}
		},

		onBackClick: function() {
			this.$logInfo('SelectFlightsScript::Entering onBackClick function');
			try {
				this.moduleCtrl.onBackClick();
			} catch (exception) {
				this.$logError('SelectFlightsScript::An error occured in onBackClick function', exception);
			}
		},

		getAgeOfCustomerInYears: function(selDOB) {
			this.$logInfo('SelectFlightsScript::Entering getAgeOfCustomerInYears function');
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
				this.$logError('SelectFlightsScript::An error occured in getAgeOfCustomerInYears function', exception);
			}
		},

		openHTML: function(args, data) {
				this.$logInfo('SelectFlightsScript::Entering openHTML function');
				try {
					// calling common method to open HTML page popup
					modules.view.merci.common.utils.MCommonScript.openHTML(data);
				} catch (exception) {
					this.$logError('SelectFlightsScript::An error occured in openHTML function', exception);
				}
			}
			//		isUSRoute : function(){
			//			var cpr = this.moduleCtrl.getCPR();
			//			var selectedCPR = this.moduleCtrl.getSelectedCPR();
			//			for(var flightNoIndex in cpr[selectedCPR.journey].flightList){
			//				var flightNo = cpr[selectedCPR.journey].flightList[flightNoIndex];
			//				var arrivalcountryCode = cpr[selectedCPR.journey][flightNo].arrivalAirport.airportLocation.countryCode;
			//				var departurecountryCode = cpr[selectedCPR.journey][flightNo].departureAirport.airportLocation.countryCode;
			//				if(arrivalcountryCode == "USA" || departurecountryCode == "USA"){
			//					return true;
			//				}
			//			}
			//			return false;
			//		}
	}
});