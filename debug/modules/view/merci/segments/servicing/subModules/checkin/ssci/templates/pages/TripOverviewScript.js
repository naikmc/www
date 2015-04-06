Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.TripOverviewScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.KarmaGoToSelectPAX = {};
    this.KarmaConstructSelectedCPRForCheckedINPax = {};
    this.KarmaOnCancelCheckinClick = {};
    this.KarmaOnEmailClick = {};
    this.KarmaOnSMSClick = {};
    this.KarmaOnMBPClick = {};
    this.KarmaOnPassbookClick = {};
    this.KarmaShowExitRow = {};
    this.KarmaCheckIfBPEnabledParameters = {};
  },

  $prototype: {

    $dataReady: function() {
      this.$logInfo('TripOverviewScript::Entering dataReady function');
      try {
      var selectedCPR = this.moduleCtrl.getSelectedCPR();
      this.requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.requestParam;
      this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);
      var data = this.moduleCtrl.getCPR();
      if (selectedCPR.journey == null || selectedCPR.journey == "" || data[selectedCPR.journey] == null) {

        var journeyNo = null;
        for (journeyNo in data) {
          break;
        }
        if (journeyNo != null && data[journeyNo] != null) {
          this.moduleCtrl.updateJourneySelectedCPR(journeyNo);
        }
      }
      this.parameters = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.parameters;
      this.label = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.labels;
      this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.errorStrings;
      this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.siteParam;
      this.moduleCtrl.setFrequentFlyerList(this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.freqFlyerRestList);
      this.moduleCtrl.setOperatingAirline(this.parameters.SITE_SSCI_OP_AIR_LINE);

      this.data.siteParameters = this.parameters;
      this.data.pageErrors=this.errorStrings;
	  this.data.pageLabels = this.label;

      this.moduleCtrl.setHeaderInfo({
          title: this.label.Title,
          bannerHtmlL: this.requestParam.bannerHtml,
          homePageURL: this.siteParams.homeURL,
          showButton: true
        });

      this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);

      this.moduleCtrl.setGADetails(this.parameters);

      if (!this.data.svTime) {

        this.data.svTime = this.requestParam.CPRIdentification.serverDateFormat;

      }
      if (!this.data.telephoneNumberList) {
        this.moduleCtrl.setTelephoneNumberList(this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.telephoneNumList);
      }
      /*Initializing token for displaying PopUp*/
      this.popUpSelected = "";
      /**
		 * For update IDC with new fqtv, as we resetting setCPR for latest IDC response we are calling this
		 * function here
		 **/
		this.moduleCtrl.updateFQTVDeatilsInCPR();

 /*Calling for country re construction*/
	  this.moduleCtrl.countryList();

	  this.inData = {};
      this.inData.bottomup = false;
      this.inData.popupContent = null;

	  acceptanceConfirmationcurrentlyFocussed = "";
      this.emailautocomlete = {
        autocompleteEmailList: []
      };
	  if(this.data.directCalling){
		this.data.directCalling = false;
		this.moduleCtrl.storeTripForDirectCall(this.requestParam.CPRInput);
      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in dataReady function', exception);
      }
    },

    $viewReady: function() {
      this.$logInfo('TripOverviewScript::Entering viewReady function');
      try {

        /*For auto show already entered email -- FOR COPY ALREADY ENTERED EMAIL TO OTHER EMAIL BOXES*/
        var _this = this;
        var _thismoduleCtrl = _this.moduleCtrl;
        /*
         * Execute every time when blur event called
         * */
        jQuery(document).on("blur",".sectionDefaultstyleSsci input[type='text'],.sectionDefaultstyleSsci input[type='email']", function() {

          window.setTimeout(function() {
            /*
             * for autocomplete data update
             * */
            _this.emailPopuUp(_this, _thismoduleCtrl);

          }, 150);


        });
        /*End For auto show already entered email*/

          /* GOOGLE ANALYTICS */
      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Trip overview");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=TripOverview";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
	          page: 'Trip overview',
	          GTMPage: 'Trip overview'
        });
      }
	      /* GOOGLE ANALYTICS */
	      /*BEGIN : JavaScript Injection(CR08063892)*/
	      if (typeof genericScript == 'function') {
				genericScript({
					tpl:"TripOverview",
					data:this.data
				});
	      }
	      /*END : JavaScript Injection(CR08063892)*/
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in viewReady function', exception);
      }
    },

    $displayReady: function() {

      this.$logInfo('TripOverviewScript::Entering displayReady function');
      try {
	  /*To Display Warning Messages*/
        this.moduleCtrl.getWarningsForThePage("TOVR", this);

      _this = this;

        var success = [];
        if (this.data.CancelStatus == "SUCCESS") {
          success.push({
            "localizedMessage": this.label.CancelSuccessful
          });
        }
        this.data.CancelStatus = null;
        if (success.length > 0) {
          this.moduleCtrl.displayErrors(success, "cprErrorsSelectFlight", "success");
        }

      setTimeout(function() {

        if (_this.popUpSelected == "Email" && jQuery("#" + acceptanceConfirmationcurrentlyFocussed).length == 1) {
          jQuery("#" + acceptanceConfirmationcurrentlyFocussed).focus();
          acceptanceConfirmationcurrentlyFocussed = "";
        }

      }, 200);
	  /*
		 * Begin: JQuery Function For Hiding Poppup on clicking
		 * cancel and send Boarding Pass
		 */
	  $(document).on("click",'.sectionDefaultstyle .popup.input-panel .buttons .validation', function() {
			if (this.className == "validation cancel") {
				$(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
				jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); /*Will Be Hidden When Code Integreated in Int of this CR */
			}
		});

	  /*
		 * END: JQuery Function For Hiding Poppup on clicking
		 * cancel and send Boarding Pass
		 */
	  /*Function to diable the cancel checkin button if not passenger selected*/
	  $("#CommonPopup").find(".customerSelectCheckBox").change(function() {
			if ($("#CommonPopup").find(".customerSelectCheckBox:checked").length == 0) {
				jQuery("#cancelCheckinAfterPassengerSel").addClass("disabled");
				jQuery("#cancelCheckinAfterPassengerSel").attr("disabled", "disabled");
			} else {
				jQuery("#cancelCheckinAfterPassengerSel").removeClass("disabled");
				jQuery("#cancelCheckinAfterPassengerSel").removeAttr("disabled");
			}
		});
      /*End Function to diable the cancel checkin button if not passenger selected*/

      $("#CommonPopupBP").find(".customerSelectCheckBox").change(function() {
        if ($("#CommonPopupBP").find(".customerSelectCheckBox:checked").length == 0) {
          jQuery("#sendBoardingPassButton").addClass("disabled");
        } else {
          jQuery("#sendBoardingPassButton").removeClass("disabled");
        }
        if ($(this).is(':checked')) {
          $(this).nextAll("ul").slideDown();
        } else {
          $(this).nextAll("ul").slideUp();
        }
      });

	  //For Setting the Page from Which PassengerDetails Screen Can Be Called.
	  this.moduleCtrl.setPassengerDetailsFlow("TOVR");
	  this.moduleCtrl.setSuccess("");
	  this.moduleCtrl.setErrors("");

	  /*
       * for construct selected cpr for checkin pax
       * */
      this.constructSelectedCPRForCheckedINPax();
      this.moduleCtrl.setSelectedCPRFromTripOverview(aria.utils.Json.copy(this.moduleCtrl.getSelectedCPR()));


	  this.data.custToFlightRemovedList = {};
	  	/**
	  	 *When allow cancel check-in after boarding pass printed : False
	  	 *
	  	 *in above case BP issued for at least one product then user wont be allowed to update his regulatory details.
	  	 */
	  	this.reconstructSelectedCPRBasedONBPGeneration();

	  	/*
	  	 * for showing desclimer in trip over view page on atlease one pax inhibited due to cancel checkin afer BP printed false
	  	 * */
        var temp = (this.parameters.SITE_SSCI_EDT_REG_CHKD && this.parameters.SITE_SSCI_EDT_REG_CHKD.search(/true/i) != -1) || (this.parameters.SITE_SSCI_JNY_LVL_FLT_SEL && this.parameters.SITE_SSCI_JNY_LVL_FLT_SEL.search(/true/i) != -1);

        if (!jQuery.isUndefined(this.data.custToFlightRemovedList) && temp) {
	  		$(".message.info").removeClass("displayNone").addClass("displayBlock");

        } else {
			$(".message.info").removeClass("displayBlock").addClass("displayNone");
		}

	  	/*
	  	 * as soon as all pax inhibited due to boarding pass generated, we are restrict user to
	  	 * modify checkin
	  	 * */
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        if (selectedCPR.custtoflight.length == 0 && selectedCPR.flighttocust.length == 0) {
	  		$(".modifyCheckin").addClass("disabled").removeAttr("atdelegate");
          $(".modifyCheckin").attr("disabled", "");
	  		$(".cancelCheckin").addClass("disabled").removeAttr("atdelegate");
          $(".cancelCheckin").attr("disabled", "");
        } else {
          if (this.data.regulatoryAlteredSelCpr.disableModifyTravlerInfo && this.data.regulatoryAlteredSelCpr.disableModifyTravlerInfo == true) {
	  			$(".modifyCheckin").addClass("disabled").removeAttr("atdelegate");
	            $(".modifyCheckin").attr("disabled", "");
          } else {
	  		$(".modifyCheckin").removeClass("disabled");
          $(".modifyCheckin").removeAttr("disabled", "");
	  		}

	  		$(".cancelCheckin").removeClass("disabled");
          $(".cancelCheckin").removeAttr("disabled", "");
	  	}


      /*
       * Begin JQuery Function For Hiding Poppup on clicking
       * cancel and send Boarding Pass
       */
      $(document).on("click",'.sectionDefaultstyle .popup.input-panel .buttons .validation', function() {
        if (this.className == "validation cancel") {
          $(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
          jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); /*Will Be Hidden When Code Integreated in Int of this CR */
        }
        //         else{
        //           if(_this.sendDisabled == false){
        //             $(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
        //             jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); /*Will Be Hidden When Code Integreated in Int of this CR */
        //           }
        //         }
      });

      /*For Passbook PopUp */
      $(document).on("click",".sectionDefaultstyle .dialog button.cancel, .dialog button.validation", function() {
        if (this.className == ("validation active") && this.parentNode.parentNode.id == ("CommonPopup")) {
          $(".dialog").hide();
          modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
          jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
        } else if (this.className == ("cancel") && (this.parentNode.parentNode.id == ("CommonPopup") || this.parentNode.parentNode.id == ("CommonPopupBP"))) {
          $(".dialog").hide();
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
        }
      });

      //To check if BP is allowed to send or not
      this.checkIfBPisEnabled();

      /*Code From Diabling if User Cannot Proceed Further in current Session*/
		if (this.moduleCtrl.getIsSelectFlightPageError() == true) {
			$(".modifyCheckin").addClass("disabled").removeAttr("atdelegate");
            $(".modifyCheckin").attr("disabled", "");

			this.moduleCtrl.displayErrors(jsonResponse.mciErrors, "tripOverviewErr", "error");
		}

      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in displayReady function', exception);
      }
    },

    /*
     * args.flow == modifyCheckin -- in this flow user landed to regulatory page with only checked in pax where he can change regulatory details
     *
     * and checkin again
     * */
    gotoSelectPAX: function(e, args) {
      this.$logInfo('TripOverviewScript::Entering gotoSelectPAX function');
      try {
      var flow = args.flow;
      /*Based on the Flow displaying Overlay*/
        if (flow == "checkin" || flow == "manageCheckin") {
    	  modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
      }
      e.preventDefault();
      var _this = this;
      // _this.moduleCtrl.setIsFlowAppCancel(false);  //Not Now After APP Integeration
      jQuery('button.validation.disabled').click(function() {
        return null;
      });
      var json = this.moduleCtrl.getCPR();
      //          /* Creating country name with 3 digit code map */
      //      var countryList=json.countryList[1];
      //      countryListCodeMap={} ;
      //      countryListCodeMap.codetocountry = {} ;
      //      for(var x in json.countryList){
      //        var countryList = json.countryList[x] ;
      //        for(var i in countryList)
      //        {
      //          for(var j in countryList[i])
      //          {
      //            var countryName = countryList[i][j][1] ;
      //            var countryCode = countryList[i][j][0] ;
      //            countryListCodeMap[countryName.toUpperCase()] = countryCode ;
      //            countryListCodeMap.codetocountry[countryCode] = countryName.toUpperCase() ;
      //          }
      //        }
      //      }
      //      /* Set the map in module controller */
      //      _this.moduleCtrl.setCountryNameCodeMap(countryListCodeMap) ;
      if (flow == "checkin") {
        this.moduleCtrl.setFlowType(flow);
        this.moduleCtrl.tripOvrwCheckIn();
      } else {
        var _this = this;
        var cpr = _this.moduleCtrl.getCPR();
        var selectedCPR = _this.moduleCtrl.getSelectedCPR();
        var journeyNo = selectedCPR.journey;

        _this.moduleCtrl.setFlowType(flow);
          if (flow == "modifyCheckin") {

        	  this.data.custToFlightRemovedList = {};
      	  	/**
      	  	 *When allow cancel check-in after boarding pass printed : False
      	  	 *
      	  	 *in above case BP issued for at least one product then user wont be allowed to update his regulatory details.
      	  	 */
      	  	this.reconstructSelectedCPRBasedONBPGeneration();


			var errors = [];
			var removedData = this.data.custToFlightRemovedList;
			for (var flightDetail in removedData) {
	            var custList = [];
	            var flightList = "";
	            for (var custDetai in removedData[flightDetail]) {
	              var temp = "";
	              if (!jQuery.isUndefined(cpr[journeyNo][custDetai].personNames) && !jQuery.isUndefined(cpr[journeyNo][custDetai].personNames[0].givenNames)) {
	                temp += cpr[journeyNo][custDetai].personNames[0].givenNames[0] + " ";
	              }

	              if (!jQuery.isUndefined(cpr[journeyNo][custDetai].personNames) && !jQuery.isUndefined(cpr[journeyNo][custDetai].personNames[0].surname)) {
	                temp += cpr[journeyNo][custDetai].personNames[0].surname;
	              }
	              custList.push(temp);
	            }

	            if (custList.length > 1) {
	              temp = custList.splice(custList.length - 1, 1);
	              custList = custList.join(", ") + " " + this.label.and + " " + temp;

	            }
	            flightList = cpr[journeyNo][flightDetail].operatingAirline.companyName.companyIDAttributes.code + cpr[journeyNo][flightDetail].operatingAirline.flightNumber;

	            errors.push({
	              "localizedMessage": jQuery.substitute(this.label.paxInhibitionRegupd, [custList])
	            });
              //For TDD
              this.KarmaGoToSelectPAX["CustList"] = custList;
              this.KarmaGoToSelectPAX["flightList"] = flightList;
	            break;
	          }

			this.moduleCtrl.setErrors(errors);
			this.moduleCtrl.checkRegulatory();


          } else if (flow == "cancelCheckin") {
        	jQuery(document).scrollTop("0");
			jQuery("#initiateandEditCommonErrors").disposeTemplate();
			jQuery("#CommonPopup").html("");
			/*
             * for construct selected cpr for checkin pax
             * */
            _this.constructSelectedCPRForCheckedINPax();
			_this.popUpSelected = "cancelCheckin";

			_this.$refresh({
				section: "popupSection"
			});
			_this.openSSCIDialog($('#CommonPopup'));
          } else {
        	/*
             * for construct selected cpr for checkin pax
             * */
            this.constructSelectedCPRForCheckedINPax();

        	_this.moduleCtrl.manageCheckin();
        }

      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in gotoSelectPAX function', exception);
      }
    },
    constructSelectedCPRForCheckedINPax: function() {
      this.$logInfo('TripOverviewScript::Entering constructSelectedCPRForCheckedINPax function');
      try {

        //Array Required to form selectedCPR
        var custReqArray = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR();
        var journeyNo = custReqArray.journey;
        var custArray = cpr[journeyNo].paxList;
        var flightArray = cpr[journeyNo].flightList;

        custReqArray.flighttocust = [];
        custReqArray.customer = [];
        custReqArray.product = [];
        var temp_cust = [];
        for (var k in flightArray) {
          for (var l in custArray) {
            var chkdin = false;
            var infantID;
            var legArray = cpr[journeyNo][flightArray[k]].leg;
            for (var m in legArray) {
              if ((cpr[journeyNo].status.legPassenger[custArray[l] + legArray[m].ID + "CAC"] && cpr[journeyNo].status.legPassenger[custArray[l] + legArray[m].ID + "CAC"].status[0].code == "1") || (cpr[journeyNo].status.legPassenger[custArray[l] + legArray[m].ID + "CST"] && cpr[journeyNo].status.legPassenger[custArray[l] + legArray[m].ID + "CST"].status[0].code == "1")) {
                chkdin = true;

                /*
                 * check if infant associated to pax
                 * */
                infantID = undefined;
                if (cpr[journeyNo][custArray[l]].accompaniedByInfant != null && cpr[journeyNo][custArray[l]].accompaniedByInfant == true) {
                	infantID = this.moduleCtrl.findInfantIDForCust(flightArray[k], custArray[l]);
                }

              }
            }
            if (chkdin) {
              temp_cust.push(custArray[l]);
              if (infantID != undefined) {
            	  temp_cust.push(infantID);
              }
            }
          }
          if (temp_cust.length > 0) {
            custReqArray.flighttocust.push({
              product: flightArray[k],
              customer: temp_cust
            });
            custReqArray.product.push(flightArray[k]);
            temp_cust = [];
          }
        }
        custReqArray.custtoflight = [];
        var temp_flight = [];
        for (var k in custArray) {
          for (var l in flightArray) {
            var chkdin = false;
            var infantID;
            var legArray = cpr[journeyNo][flightArray[l]].leg;
            for (var m in legArray) {
              if ((cpr[journeyNo].status.legPassenger[custArray[k] + legArray[m].ID + "CAC"] && cpr[journeyNo].status.legPassenger[custArray[k] + legArray[m].ID + "CAC"].status[0].code == "1") || (cpr[journeyNo].status.legPassenger[custArray[k] + legArray[m].ID + "CST"] && cpr[journeyNo].status.legPassenger[custArray[k] + legArray[m].ID + "CST"].status[0].code == "1")) {
                chkdin = true;

                /*
                 * check if infant associated to pax
                 * */
                infantID = undefined;
                if (cpr[journeyNo][custArray[k]].accompaniedByInfant != null && cpr[journeyNo][custArray[k]].accompaniedByInfant == true) {
                	infantID = this.moduleCtrl.findInfantIDForCust(flightArray[l], custArray[k]);
                }
              }
            }
            if (chkdin) {
              temp_flight.push(flightArray[l]);
            }
          }
          if (temp_flight.length > 0) {
            custReqArray.custtoflight.push({
              customer: custArray[k],
              product: temp_flight
            });

            if (infantID != undefined) {
            	custReqArray.custtoflight.push({
                    customer: infantID,
                    product: aria.utils.Json.copy(temp_flight)
                  });
            	custReqArray.customer.push(infantID);
            }

            custReqArray.customer.push(custArray[k]);

            temp_flight = [];
          }
        }
        //For TDD
        this.KarmaConstructSelectedCPRForCheckedINPax["custReqArray"] = custReqArray;
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in constructSelectedCPRForCheckedINPax function', exception);
      }
    },

    reconstructSelectedCPRBasedONBPGeneration: function() {
      this.$logInfo('TripOverviewScript::Entering reconstructSelectedCPRBasedONBPGeneration function');
      try {
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR();
        var journeyNo = selectedCPR.journey;
        var infantID = [];

        /*
         * 1. This comes into picture as we are cancel checkin pax details after regulatory update based on regulatory status
         * 2. SSCI_DSBL_CSL_BP_GEN  - false means we r allowing cancel checkin even after BP generation so no prob with point 1
        	 *
         * 3. if it true then once BP printed we r not able to cancel checkin so we r inhibiting those pax below
         * */
        if ((this.parameters.SITE_SSCI_DSBL_CSL_BP_GEN && (this.parameters.SITE_SSCI_DSBL_CSL_BP_GEN.search(/true/i) != -1))) {
          for (var custToFlight = 0; custToFlight < selectedCPR.custtoflight.length; custToFlight++) {
        			var oricustToFlight = custToFlight;
                    custToFlight = selectedCPR.custtoflight[custToFlight];

            var flag = false;
            for (var flightNum = 0; flightNum < custToFlight.product.length; flightNum++) {
                        var oriflightNum = flightNum;
                        flightNum = custToFlight.product[flightNum];

              if (cpr[journeyNo]["productDetailsBeans"][custToFlight.customer + flightNum]["boardingPassPrinted"] == true) {
                flag = true;

                    	/*
                         * check if infant associated to pax
                         * */
                if (cpr[journeyNo][custToFlight.customer].accompaniedByInfant != null && cpr[journeyNo][custToFlight.customer].accompaniedByInfant == true) {
                        	infantID.push(this.moduleCtrl.findInfantIDForCust(flightNum, custToFlight.customer));
                        }

                        	break;
                        }
              flightNum = oriflightNum;
                    }

            if (flag) {
                	/*Filling to show error messages*/
              for (var tempFlightLst = 0; tempFlightLst < custToFlight.product.length; tempFlightLst++) {
                		if (jQuery.isUndefined(this.data.custToFlightRemovedList[custToFlight.product[tempFlightLst]])) {
                			this.data.custToFlightRemovedList[custToFlight.product[tempFlightLst]] = {};
                          }
                		this.data.custToFlightRemovedList[custToFlight.product[tempFlightLst]][custToFlight.customer] = {};

                		/*
                		 * updating infant faliled details also here
                		 * */
                		/*
                         * check if infant associated to pax
                         * */
                if (cpr[journeyNo][custToFlight.customer].accompaniedByInfant != null && cpr[journeyNo][custToFlight.customer].accompaniedByInfant == true) {
                        	this.data.custToFlightRemovedList[custToFlight.product[tempFlightLst]][this.moduleCtrl.findInfantIDForCust(custToFlight.product[tempFlightLst], custToFlight.customer)] = {};
                        }

                	}



                    	selectedCPR.custtoflight.splice(oricustToFlight, 1);
                        oricustToFlight--;

                    }
                    custToFlight = oricustToFlight;
        		}

        	/*
    		 * if incase infant id found has to remove that also
        	 * */
          if (infantID.length > 0 && selectedCPR.custtoflight.length > 0 && selectedCPR.flighttocust.length > 0) {
            for (var custToFlight = 0; custToFlight < selectedCPR.custtoflight.length; custToFlight++) {
              if (infantID.indexOf(selectedCPR.custtoflight[custToFlight].customer) != -1) {

	        			selectedCPR.custtoflight.splice(custToFlight, 1);
	        			custToFlight--;
	                }
        		}
      }

          this.moduleCtrl.reconstructSelectedCPR(selectedCPR, "flighttocust");

      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in reconstructSelectedCPRBasedONBPGeneration function', exception);
      }
    },

    onBackClick: function() {
      this.$logInfo('TripOverviewScript::Entering onBackClick function');
      try {
      this.moduleCtrl.onBackClick();
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onBackClick function', exception);
      }
    },

    loadEditPaxDetailsScreen: function(evt, args) {
      this.$logInfo('TripOverviewScript::Entering loadEditPaxDetailsScreen function');
      try {
		var cpr = this.moduleCtrl.getCPR();
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var journeyNo = selectedCPR.journey;
		var custArray = cpr[journeyNo].paxList;
		//Initializing again with empty Array
        selectedCPR.customer = [];
		for (var k in custArray) {
			selectedCPR.customer.push(custArray[k]);
		}
		this.moduleCtrl.setSelectedCPR(selectedCPR);

		this.moduleCtrl.setSelectedEditpax(args);
		this.moduleCtrl.passengerDetailsLoad();
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in loadEditPaxDetailsScreen function', exception);
      }
    },

    openSSCIDialog: function(which) {
      this.$logInfo('TripOverviewScript::Entering openSSCIDialog function');
      try {
        jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); /*Will Be Shown When Code Integrated in Int of this CR */
        which.css('display', 'block');
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in openSSCIDialog function', exception);
      }
    },

    onCancelCheckinClick: function() {
      this.$logInfo('TripOverviewScript::Entering onCancelCheckinClick function');
      try {
        var _this = this;
        /*BEGIN : Code For Checking That After Cancel Any Minor or child is not Left*/
        _this.constructSelectedCPRForCheckedINPax();
        var cpr = _this.moduleCtrl.getCPR();
        var selectedCPR = _this.moduleCtrl.getSelectedCPR();
        var journey = cpr[selectedCPR.journey];

        for (var flightIndex in selectedCPR.flighttocust) {
          var errors = [];
          var flightInfo = selectedCPR.flighttocust[flightIndex];
          var flightID = flightInfo.product;

			var custumerSelectedforCancel = [];
			var customersOnFlight = null;
			var customersRemainingForCancel = [];

          for (var customerIndex in flightInfo.customer) {
            var custID = flightInfo.customer[customerIndex];
            if ($('#pax' + custID).is(':checked')) {
					custumerSelectedforCancel.push(custID);
				}
			}

//			for (var l_flight in selectedCPR.flighttocust) {
//				if (selectedCPR.flighttocust[l_flight].product == flightID) {
//					customersOnFlight = selectedCPR.flighttocust[l_flight].customer;
//				}
//			}
			customersOnFlight = flightInfo.customer;

			for (var l_custs in customersOnFlight) {
				if (custumerSelectedforCancel.indexOf(customersOnFlight[l_custs]) == -1) {
					customersRemainingForCancel.push(customersOnFlight[l_custs]);
				}
			}

			/*Begin : Child Alone Cannot be left alone Checked-in*/
			_this.currDate = _this.moduleCtrl.getsvTime("yyyy-mm-dd");

			var minorAgeLmtParam = parseInt(_this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(_this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;
			//var minorCheckToBePerformed = this.parameters.SITE_SSCI_RESTRICT_MINOR;
			var minorCheckToBePerformed = "true";

			var childCount = 0;
			var validAdultCount = 0;
			var minorCount = 0;
			var SSRCount = 0;

			for (var custID_no in customersRemainingForCancel) {
				var custID = customersRemainingForCancel[custID_no];
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
								years = this.moduleCtrl.getAgeOfCustomerInYears(selDOB);
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

			/**Checking checkedIn Pax In the Segment*/
			if ((childCount > 0 || minorCount > 0 || SSRCount > 0) && validAdultCount <= 0) {
				var childOrMinorNotAloneflag = false;

				if (!childOrMinorNotAloneflag) {
					if ((childCount > 0) || (minorCount > 0) || (SSRCount > 0)) {
						errors.push({
							"localizedMessage": _this.errorStrings[25000130].localizedMessage,
							"code": _this.errorStrings[25000130].errorid
						});
                this.KarmaOnCancelCheckinClick["message"] = "Child, Minor or SSRInvalid Cant Be Left Alone Unchecked In";
					}
				}
			}


			if (errors != null && errors.length > 0) {
				_this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
				//modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				return null;
			}
		}
		/*End : Checkin Child Alone Cannot Checkin Condition*/

		/*BEGIN : Code For Checking That After Cancel Any Minor or child is not Left*/

		/*Displaying the pop for Confimation of cancellation */
		$('.sectionDefaultstyle .popup.input-panel').css('display', 'none');
		jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
		jQuery("#cancelConf").removeClass("displayNone").addClass("displayBlock");
		/*Displaying the pop for Confimation of cancellation */

		/*On clicking Abort on Cancel Confirmaiton Dialog Box*/
		jQuery("#cancelConf #cancelButton").click(function() {
			jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
			jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");
		});
		/*On clicking Ok on Cancel Confirmaiton Dialog Box*/
		jQuery("#cancelConf #okButton").click(function() {
			jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
			jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");
			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);


			var cpr = _this.moduleCtrl.getCPR();
			var selectedCPR = _this.moduleCtrl.getSelectedCPR();
			var journey = cpr[selectedCPR.journey];
			var cancelRequest = [];

          for (var flightIndex in selectedCPR.flighttocust) {
				var flightInfo = selectedCPR.flighttocust[flightIndex];
				var flightID = flightInfo.product;
            for (var customerIndex in flightInfo.customer) {
					var custID = flightInfo.customer[customerIndex];
              if (journey[custID].passengerTypeCode != "INF" && ($('#pax' + custID).is(':checked'))) {
						var l_prodID = _this.moduleCtrl.findProductidFrmflightid(journey, custID, flightID);
						var boardPoint = journey[flightID].departureAirport.locationCode;
						var offPoint = journey[flightID].arrivalAirport.locationCode;
						var carrier = journey[flightID].operatingAirline.companyName.companyIDAttributes.code;
						var flightNumber = journey[flightID].operatingAirline.flightNumber;
						var paxType = journey[custID].passengerTypeCode;
						if (paxType == "ADT") {
							paxType = "A";
						} else if (paxType == "CHD") {
							paxType = "C"
						}
						var paxGender = journey.customerDetailsBeans[custID].gender;
						if (paxGender == "Male") {
							paxGender = "M";
						} else {
							paxGender = "F";
						}
						var givenName = journey[custID].personNames[0].givenNames[0];
						var surname = journey[custID].personNames[0].surname;
						var paxTitle = null;
						if (journey[custID].personNames[0].nameTitles.length > 0) {
							paxTitle = journey[custID].personNames[0].nameTitles[0];
						}
						var depTime = new Date(journey[flightID].timings["SDT"].time);
						var l_depYear = depTime.getUTCFullYear();
						var l_depMonth = depTime.getUTCMonth();
						var l_depDate = depTime.getUTCDate();

						if ((parseInt(l_depMonth) + 1) < 10) {
							l_depMonth = "0" + (parseInt(l_depMonth) + 1);
						}

						if (parseInt(l_depDate) < 10) {
							l_depDate = "0" + l_depDate;
						}

						var depDate = l_depYear + l_depMonth + l_depDate;
						if (paxTitle != null) {
							cancelRequest.push({
								"prodID": l_prodID,
								"custID": custID,
								"boardPoint": boardPoint,
								"offPoint": offPoint,
								"carrier": carrier,
								"flightNumber": flightNumber,
								"paxType": paxType,
								"paxGender": paxGender,
								"depDate": depDate,
								"paxGivename": givenName,
								"paxSurname": surname,
								"paxTitle": paxTitle
							});
						} else {
							cancelRequest.push({
								"prodID": l_prodID,
								"custID": custID,
								"boardPoint": boardPoint,
								"offPoint": offPoint,
								"carrier": carrier,
								"flightNumber": flightNumber,
								"paxType": paxType,
								"paxGender": paxGender,
								"depDate": depDate,
								"paxGivename": givenName,
								"paxSurname": surname
							});
						}
					}
				}
			}
			var cancelAcceptanceInput = {};
			cancelAcceptanceInput.cancelRequest = cancelRequest;
			_this.moduleCtrl.setCallingPage("MSSCITripOverview_A");
			_this.moduleCtrl.cancelAcceptance(cancelAcceptanceInput);

          //For TDD
          _this.KarmaOnCancelCheckinClick["cancelAcceptanceInput"] = cancelAcceptanceInput;
		});

      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onCancelCheckinClick function', exception);
      }
	},

    findIOSVersion: function(evt) {
      this.$logInfo('TripOverviewScript::Entering findIOSVersion function');
      try {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
          // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
          var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
          return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in findIOSVersion function', exception);
      }

    },

    onEmailButtonClick: function(evt, args) {
      this.$logInfo('TripOverviewScript::Entering onEmailButtonClick function');
      try {
      var _this = this;
      if ($('ul.getPassbook .email.disabled').length == 0) {

        /*
         * As exit popup should show on click of any of mbp spbp buttons the flow changed like
         *
         * if PNR need to collect exit details then show exit popup first and then
         *
         * show MBP or SPBp popup
         *
         *other wise show mbp or spbp directly
         *
         * */
        this.showExitRow(

          function() {

            /* Begin Processing Of Data Before Landing The Pop Up */
            _this.constructSelectedCPRForCheckedINPax();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            _this.popUpSelected = "Email";
            _this.filteredCustomerList = {};
            _this.filteredSelectedFlightList = [];
            /*
             * List Containing
             * only passengers
             * which are
             * accepted on the
             * selected flights
             */

            for (var flight in selectedCPR.flighttocust) {
              _this.filteredSelectedFlightList.push(selectedCPR.flighttocust[flight].product);
              }
            for (var customer in selectedCPR.custtoflight) {
                _this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
            }



            /* End Processing Of Data Before Lading The Pop Up */

            jQuery(document).scrollTop("0");
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            jQuery("#CommonPopupBP").html("");

            _this.$refresh({
              section: "popupSectionBP"
            });
            _this.openSSCIDialog($('#CommonPopupBP'));

            /*
             * initially when page load, to form auto complete initial content
             * */
            _this.emailPopuUp(_this, _this.moduleCtrl);



            return "email0";
          }

        );

      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onEmailButtonClick function', exception);
      }
    },

    openSSCIDialog: function(which) {
      this.$logInfo('TripOverviewScript::Entering openSSCIDialog function');
      try {
        jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); /*Will Be Shown When Code Integrated in Int of this CR */
        which.css('display', 'block');
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in openSSCIDialog function', exception);
      }
    },

    onEmailClick: function(evt, args) {
      if ($(".customerSelectCheckBox:checked").length != 0) {
        this.$logInfo('TripOverviewScript::Entering onEmailClick function');
        evt.preventDefault();
        jQuery("#initiateandEditCommonErrors").disposeTemplate();
        var _this = this;
        var CPRdata = _this.moduleCtrl.getCPR();
        _this.constructSelectedCPRForCheckedINPax();
        var selectedCPR = _this.moduleCtrl.getSelectedCPR();
        var journey = selectedCPR.journey;
        var selectedEmails = [];
        var errorStrings = null;
        var checkinData = _this.moduleCtrl.getModuleData();
        if (typeof checkinData != "undefined") {
          errorStrings = checkinData.checkIn.MSSCITripOverview_A.errorStrings;
        }

        try {
          jQuery(document).scrollTop("0");
          var errors = [];
          var email = [];
          var selectFlightList = [];
          var selectCustList = [];
          var validEmailIds = 0;


          selectFlightList = _this.filteredSelectedFlightList;


          $("#CommonPopupBP").find('input[name=pax11]:checked').each(function() {
            selectCustList.push($(this).val());
          });
          if (!selectCustList.length >= 1) {
            errors.push({
              "localizedMessage": errorStrings[25000048].localizedMessage,
              "code": errorStrings[25000048].errorid
            });
          }

          for (var custIndex in selectCustList) {
            var selectedCustID = selectCustList[custIndex];
            var selector = "#eMailPax" + selectedCustID;
            var emailId = jQuery(selector).val();
            if (emailId != null && typeof emailId !== "undefined" && emailId.trim() != "") {
              if (_this.moduleCtrl.validateEmail(emailId)) {
                validEmailIds += 1;
                email.push({
                  "customerID": selectedCustID,
                  "emailId": emailId
                });
                var productList = [];
                for (var flightIDIndex in selectFlightList) {
                  var selectflightID = selectFlightList[flightIDIndex];
                  var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);
                  /*
                   * for Checking whether this product is
                   * being accepted or not
                   */
                  for (item1 in selectedCPR.flighttocust) {
                    var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                    if (acceptedFlightNo == selectflightID) {
                      for (item2 in selectedCPR.flighttocust[item1].customer) {
                        var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                        if (acceptedCustomerNo == selectedCustID) {
                          productList.push({
                            "prodID": productID,
                            "url": ""
                          });
                        }
                      }
                    }

                  }
                }

                //formation of url
                var productIDs_inUrl = [];
                var head_inUrl = [];
                for (var i = 0; i < productList.length; i++) {

                  var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(CPRdata[journey], productList[i].prodID);
                  var paxID = paxIDandFlightID.split("~")[0];
                  var flightID = paxIDandFlightID.split("~")[1];
                  var paxName = CPRdata[journey][paxID].personNames[0].givenNames[0] + " " + CPRdata[journey][paxID].personNames[0].surname;
                  var flight = CPRdata[journey][flightID].operatingAirline.companyName.companyIDAttributes.code + CPRdata[journey][flightID].operatingAirline.flightNumber;
                  var headName = paxName + " - " + flight;

                  productIDs_inUrl.push(productList[i].prodID);
                  head_inUrl.push(headName);

                  /*In case if adult is associated with an infant*/
                  if (CPRdata[journey][paxID].accompaniedByInfant == true) {
                    var infantID = this.moduleCtrl.findInfantIDForCust(flightID, paxID);
                    var infantName = CPRdata[journey][infantID].personNames[0].givenNames[0] + " " + CPRdata[journey][infantID].personNames[0].surname;
                    var infHeadName = infantName + " - " + flight;
                    var infProdID = this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], infantID, flightID);
                    productIDs_inUrl.push(infProdID);
                    head_inUrl.push(infHeadName);
                  }


                }

                var mainUrl;
                var actionUrl;
                mainUrlWithID = modules.view.merci.common.utils.URLManager.getFullURL('SSCIBoardingPassFlow.action', null);
                url_spilt = mainUrlWithID.split('?');

                url_1 = url_spilt[0].split(";jsession")[0];

                UrlWithoutJsessionID = url_1 + "?" + url_spilt[1];



                mainUrl = UrlWithoutJsessionID.split('#');
                if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
                  actionUrl = mainUrl[0].replace("CPRRetrieve", "SSCIBoardingPassFlow");
                } else {
                  actionUrl = mainUrl[0].replace("gettripFlow", "SSCIBoardingPassFlow");
                }
                var languages = UrlWithoutJsessionID.split("LANGUAGE=");
                var lang = languages[1].split("&")[0];
                var sites = mainUrl[0].split("SITE=");
                var site = sites[1].split("&")[0];

                actionUrl = actionUrl + "&pID=" + productIDs_inUrl + "&hName=" + head_inUrl + "&CHANNEL=MOBILE";
                escape_url = escape(actionUrl);

                var haveLinkInMAIL = true;
                for (var i = 0; i < productList.length; i++) {
                  if (!this.moduleCtrl.isMBPallowedForProduct(productList[i].prodID, this.parameters)) {
                    haveLinkInMAIL = false;
                    break;
                  }
                }

                if(haveLinkInMAIL){
                for (var i = 0; i < productList.length; i++) {
                  productList[i].url = escape_url;
                }
                }

                selectedEmails.push({
                  "custID": selectedCustID,
                  "productList": productList,
                  "email": emailId
                });
              } else {
                validEmailIds -= 1;
              }
            }else{
              validEmailIds = selectCustList.length;
              errors.push({
                "localizedMessage": jQuery.substitute(errorStrings[21400059].localizedMessage,this.label.Email),
                "code": errorStrings[21400059].errorid
              });
              break;
            }
          }

          /* Begin Error Displaying Section */
          if (validEmailIds != selectCustList.length) {
            errors.push({
              "localizedMessage": errorStrings[25000048].localizedMessage,
              "code": errorStrings[25000048].errorid
            });
          }
          if (errors != null && errors.length > 0) {
            _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrorsForAllBP", "error");
            evt.stopPropagation();
            //For TDD
            _this.KarmaOnEmailClick["message"] = "Please enter a valid email address";
            return;
          }
          /* End Error Displaying Section */

          /* Begin Sending Backend Request */
          var input = {
            "bpRequests": selectedEmails,
            "bpType": "Email",
            "fromPage": "TripOverview"
          };
          $('#CommonPopupBP').css('display', 'none');
          _this.moduleCtrl.deliverDocument(input);
          /* End Sending Backend Request */

        } catch (exception) {
          this.$logError('TripOverviewScript::An error occured in onEmailClick function', exception);
        }
      } else {
        evt.stopPropagation();
        //For TDD
        this.KarmaOnEmailClick["message"] = "No PAX selected";
        return;
      }

    },
    onSMSButtonClick: function(evt, args) {
      this.$logInfo('TripOverviewScript::Entering onSMSButtonClick function');
      try {
      var _this = this;
      if ($('ul.getPassbook .sms.disabled').length == 0) {

        /*
         * As exit popup should show on click of any of mbp spbp buttons the flow changed like
         *
         * if PNR need to collect exit details then show exit popup first and then
         *
         * show MBP or SPBp popup
         *
         *other wise show mbp or spbp directly
         *
         * */
        this.showExitRow(

          function() {

            /* Begin Processing Of Data Before Lading The Pop Up */
            _this.constructSelectedCPRForCheckedINPax();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            _this.popUpSelected = "SMS";
            _this.filteredCustomerList = {};
            _this.filteredSelectedFlightList = [];
            /*
             * List Containing
             * only passengers
             * which are
             * accepted on the
             * selected flights
             */



            for (var flight in selectedCPR.flighttocust) {

              _this.filteredSelectedFlightList.push(selectedCPR.flighttocust[flight].product);
              }
            for (var customer in selectedCPR.custtoflight) {
                _this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
            }



            /* End Processing Of Data Before Lading The Pop Up */

            jQuery(document).scrollTop("0");
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            jQuery("#CommonPopupBP").html("");

            _this.$refresh({
              section: "popupSectionBP"
            });
            _this.openSSCIDialog($('#CommonPopupBP'));

            return "sms0";

          }

        );

        }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onSMSButtonClick function', exception);
      }
    },

    onSMSClick: function(evt, args) {
      if ($(".customerSelectCheckBox:checked").length != 0) {
        this.$logInfo('TripOverviewScript::Entering onSMSClick function');
        evt.preventDefault();
        try {
    	  jQuery("#initiateandEditCommonErrors").disposeTemplate();
          this.constructSelectedCPRForCheckedINPax();
          var selectedCPR = this.moduleCtrl.getSelectedCPR();
          var cpr = this.moduleCtrl.getCPR();
          var journey = cpr[selectedCPR.journey];
          var bpRequests = [];
          var selectFlightList = [];
          var selectCustList = [];
          var errorStrings = null;
          var errors = [];
          var validSMSs = 0;
          var errorStrings = null;
          var checkinData = this.moduleCtrl.getModuleData();
          if (typeof checkinData != "undefined") {
            errorStrings = checkinData.checkIn.MSSCITripOverview_A.errorStrings;
          }

          /*Begin For getting the selected Flight and Passenger IDs*/
          for (var flight in selectedCPR.flighttocust) {
            selectFlightList.push(selectedCPR.flighttocust[flight].product);
          }
          $("#CommonPopupBP").find('input[name=pax11]:checked').each(function() {
            selectCustList.push($(this).val());
          });
          if (!selectCustList.length >= 1) {
            errors.push({
              "localizedMessage": errorStrings[25000049].localizedMessage,
              "code": errorStrings[25000049].errorid
            });
          }
          /*End For getting the selected Flight and Passenger IDs*/

          for (var custIndex in selectCustList) {

            /*Initiating the request to be formed*/
            var l_smsRequest = {};

            var selectedCustID = selectCustList[custIndex];
            var custNo = selectCustList[custIndex];

            var phoneNumSel = "#phoneNumber" + custNo;
            var areaCodeSel = "#areaCode" + custNo;

            /*********Replace when user enter code not selected from autocomplete***************/
            var tempAreaCodeDetails = jQuery(areaCodeSel).val().trim();
            if (tempAreaCodeDetails.length != 0 && tempAreaCodeDetails.length <= 4) {

              if (tempAreaCodeDetails.length == 1) {
                tempAreaCodeDetails = "000" + tempAreaCodeDetails;
              } else if (tempAreaCodeDetails.length == 2) {
                if (tempAreaCodeDetails.charAt(0) == "+") {
                  tempAreaCodeDetails = "000" + tempAreaCodeDetails.charAt(1);
                } else {
                  tempAreaCodeDetails = "00" + tempAreaCodeDetails;
                }
              } else if (tempAreaCodeDetails.length == 3) {
                if (tempAreaCodeDetails.charAt(0) == "+") {
                  tempAreaCodeDetails = "00" + tempAreaCodeDetails.charAt(1) + tempAreaCodeDetails.charAt(2);
                } else {
                  tempAreaCodeDetails = "0" + tempAreaCodeDetails;
                }
              } else {
                if (tempAreaCodeDetails.charAt(0) == "+") {
                  tempAreaCodeDetails = "0" + tempAreaCodeDetails.charAt(1) + tempAreaCodeDetails.charAt(2) + tempAreaCodeDetails.charAt(3);
                }
              }
              jQuery(areaCodeSel).val(tempAreaCodeDetails)
            }



            var phoneNum = jQuery(areaCodeSel).val() + jQuery(phoneNumSel).val();
            if(phoneNum != null && typeof phoneNum !== "undefined" && phoneNum.trim() != ""){
              if ( this.moduleCtrl.validatePhoneNumber(phoneNum) && jQuery(areaCodeSel).val().length == 4 && phoneNum.length > 4) {
              var productList = [];
              for (var flightIDIndex in selectFlightList) {
                var selectflightID = selectFlightList[flightIDIndex];
                var productID = this.moduleCtrl.findProductidFrmflightid(journey, selectedCustID, selectflightID);
                /*
                 * for Checking whether this product is
                 * being accepted or not
                 */
                for (item1 in selectedCPR.flighttocust) {
                  var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                  if (acceptedFlightNo == selectflightID) {
                    for (item2 in selectedCPR.flighttocust[item1].customer) {
                      var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                      if (acceptedCustomerNo == selectedCustID) {
                        productList.push({
                          "prodID": productID,
                          "url": ""
                        });
                      }
                    }
                  }
                }
              }

              //Formation of the action url for MBP

              var productIDs_inUrl = [];
              var head_inUrl = [];
              for (var i = 0; i < productList.length; i++) {

                var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(journey, productList[i].prodID);
                var paxID = paxIDandFlightID.split("~")[0];
                var flightID = paxIDandFlightID.split("~")[1];
                var paxName = journey[paxID].personNames[0].givenNames[0] + " " + journey[paxID].personNames[0].surname;
                var flight = journey[flightID].operatingAirline.companyName.companyIDAttributes.code + journey[flightID].operatingAirline.flightNumber;
                var headName = paxName + " - " + flight;

                productIDs_inUrl.push(productList[i].prodID);
                head_inUrl.push(headName);

                /*In case if adult is associated with an infant*/
                if (journey[paxID].accompaniedByInfant == true) {
                  var infantID = this.moduleCtrl.findInfantIDForCust(flightID, paxID);
                  var infantName = journey[infantID].personNames[0].givenNames[0] + " " + journey[infantID].personNames[0].surname;
                  var infHeadName = infantName + " - " + flight;
                  var infProdID = this.moduleCtrl.findProductidFrmflightid(journey, infantID, flightID);
                  productIDs_inUrl.push(infProdID);
                  head_inUrl.push(infHeadName);
                }


              }

              var mainUrl;
              var actionUrl;
              mainUrlWithID = modules.view.merci.common.utils.URLManager.getFullURL('SSCIBoardingPassFlow.action', null);
              url_spilt = mainUrlWithID.split('?');

              url_1 = url_spilt[0].split(";jsession")[0];

              UrlWithoutJsessionID = url_1 + "?" + url_spilt[1];



              mainUrl = UrlWithoutJsessionID.split('#');
              if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
                actionUrl = mainUrl[0].replace("CPRRetrieve", "SSCIBoardingPassFlow");
              } else {
                actionUrl = mainUrl[0].replace("gettripFlow", "SSCIBoardingPassFlow");
              }
              var languages = UrlWithoutJsessionID.split("LANGUAGE=");
              var lang = languages[1].split("&")[0];
              var sites = mainUrl[0].split("SITE=");
              var site = sites[1].split("&")[0];

              actionUrl = actionUrl + "&pID=" + productIDs_inUrl + "&hName=" + head_inUrl  + "&CHANNEL=MOBILE";
              escape_url = escape(actionUrl);


              for (var i = 0; i < productList.length; i++) {
                productList[i].url = escape_url;
              }


              var fullNum = "+" + phoneNum;
              validSMSs += 1;
              bpRequests.push({
                "custID": selectedCustID,
                "productList": productList,
                "phoneNum": fullNum
              });
            } else {
              validSMSs -= 1;
              }
            }else{
              validSMSs = selectCustList.length;
              errors.push({
                "localizedMessage": jQuery.substitute(errorStrings[21400059].localizedMessage,this.label.Sms),
                "code": errorStrings[21400059].errorid
              });
              break;
            }
          }

          /* Begin Error Displaying Section */
          if (validSMSs != (selectCustList.length)) {
            errors.push({
              "localizedMessage": errorStrings[25000049].localizedMessage,
              "code": errorStrings[25000049].errorid
            });
            //For TDD
            this.KarmaOnSMSClick["message"] = "Phone no or areacode not valid";
          }
          if (errors != null && errors.length > 0) {
            this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrorsForAllBP", "error");
            evt.stopPropagation();
            //For TDD
            this.KarmaOnSMSClick["message"] = "Passenger not selected";
            return;
          }
          /* End Error Displaying Section */

          /* Begin Sending Backend Request */
          var input = {
            "bpRequests": bpRequests,
            "bpType": "SMS",
            "fromPage": "TripOverview"
          };
          //For TDD
          this.KarmaOnSMSClick["bpRequests"] = bpRequests;
          $('#CommonPopupBP').css('display', 'none');
          this.moduleCtrl.deliverDocument(input);

          /* End Sending Backend Request */
        } catch (exception) {
          this.$logError('TripOverviewScript::An error occured in onSMSClick function', exception);
        }
      } else {
        evt.stopPropagation();
        return;
      }
    },

    /*Begin : On Clicking Of MBP Button*/
    onMBPButtonClick: function(evt, args) {
      this.$logInfo('TripOverviewScript::Entering onMBPButtonClick function');
      try {
      var _this = this;

      if ($('ul.getPassbook .app.disabled').length == 0) {
        /*
         * As exit popup should show on click of any of mbp spbp buttons the flow changed like
         *
         * if PNR need to collect exit details then show exit popup first and then
         *
         * show MBP or SPBp popup
         *
         *other wise show mbp or spbp directly
         *
         * */
        this.showExitRow(

          function() {
            _this.constructSelectedCPRForCheckedINPax();
            /* Begin Processing Of Data Before Lading The Pop Up */
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            var CPRdata = _this.moduleCtrl.getCPR();
            var journey = selectedCPR.journey;
            /*In case of 1 passenger 1 segment direct landing to boarding pass*/
            if (selectedCPR.customer.length == 1 && selectedCPR.product.length == 1) {
              var selectedCustID = selectedCPR.customer[0];
              var selectflightID = selectedCPR.product[0];

              var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);

              var bpRequests = [];
              var productList = [];

              productList.push(productID);

              bpRequests.push({
                "productList": productList
              });

              var input = {
                "bpRequests": bpRequests,
                "bpType": "MBP",
                "fromPage": "TripOverview"
              };
              _this.moduleCtrl.deliverDocument(input);
              return "mbp0";
            }

            _this.popUpSelected = "MBP";
            _this.filteredCustomerList = {};
            _this.filteredSelectedFlightList = [];
            /*
             * List Containing
             * only passengers
             * which are
             * accepted on the
             * selected flights
             */
            for (var flight in selectedCPR.flighttocust) {

              _this.filteredSelectedFlightList.push(selectedCPR.flighttocust[flight].product);
//              for (var customer in selectedCPR.flighttocust[flight].customer) {
//                _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//              }
              }
            for (var customer in selectedCPR.custtoflight) {
                _this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
            }

            /* End Processing Of Data Before Lading The Pop Up */

            jQuery(document).scrollTop("0");
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            jQuery("#CommonPopupBP").html("");

            _this.$refresh({
              section: "popupSectionBP"
            });
            _this.openSSCIDialog($('#CommonPopupBP'));


            return "mbp0";

          }

        );

      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onMBPButtonClick function', exception);
      }
    },
    /*End : On Clicking Of MBP Button*/

    /*Begin : On Clicking Get MBP */
    onMBPClick: function(evt, args) {
      if ($(".customerSelectCheckBox:checked").length != 0) {
        this.$logInfo('TripOverviewScript::Entering onMBPClick function');
        evt.preventDefault();
        var _this = this;
        var bpRequests = [];
        var CPRdata = _this.moduleCtrl.getCPR();
        _this.constructSelectedCPRForCheckedINPax();
        var selectedCPR = _this.moduleCtrl.getSelectedCPR();
        var journey = selectedCPR.journey;
        var errorStrings = null;
        var checkinData = _this.moduleCtrl.getModuleData();
        if (typeof checkinData != "undefined") {
          errorStrings = checkinData.checkIn.MSSCITripOverview_A.errorStrings;
        }

        try {
          jQuery(document).scrollTop("0");
          var errors = [];
          var selectFlightList = [];
          var selectCustList = [];

          selectFlightList = _this.filteredSelectedFlightList;

          $("#CommonPopupBP").find('input[name=pax11]:checked').each(function() {
            selectCustList.push($(this).val());
          });
          if (!selectCustList.length >= 1) {
            errors.push({
              "localizedMessage": errorStrings[25000048].localizedMessage,
              "code": errorStrings[25000048].errorid
            });
          }
          var productList = [];
          for (var custIndex in selectCustList) {
            var selectedCustID = selectCustList[custIndex];

            for (var flightIDIndex in selectFlightList) {
              var selectflightID = selectFlightList[flightIDIndex];
              var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);
              /*
               * for Checking whether this product is
               * being accepted or not
               */
              for (item1 in selectedCPR.flighttocust) {
                var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                if (acceptedFlightNo == selectflightID) {
                  for (item2 in selectedCPR.flighttocust[item1].customer) {
                    var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                    if (acceptedCustomerNo == selectedCustID) {
                      productList.push(productID);
                    }
                  }
                }
              }
            }

          }

          bpRequests.push({
            "productList": productList
          });
          if (errors != null && errors.length > 0) {
            _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrorsForAllBP", "error");
            evt.stopPropagation();
            //ForTDD 
            _this.KarmaOnMBPClick["message"] = "Please select a passenger";
            return;
          }
          /* End Error Displaying Section */

          /* Begin Sending Backend Request */
          var input = {
            "bpRequests": bpRequests,
            "bpType": "MBP",
            "fromPage": "TripOverview"
          };
          //For TDD
          _this.KarmaOnMBPClick["bpRequests"] = bpRequests;
          $('#CommonPopupBP').css('display', 'none');
          _this.moduleCtrl.deliverDocument(input);
          /* End Sending Backend Request */

        } catch (exception) {
          this.$logError('TripOverviewScript::An error occured in onMBPClick function', exception);
        }
      } else {
        evt.stopPropagation();
        return;
      }

    },
    /*End : On Clicking Get MBP */

    /*Begin : On Passbook Button Click*/
    onPassBookButtonClick: function(evt, args) {
      this.$logInfo('TripOverviewScript::Entering onPassBookButtonClick function');
      try {
      var _this = this;
      if ($('ul.getPassbook .add-passbook.disabled').length == 0) {
        /*
         * As exit popup should show on click of any of mbp spbp buttons the flow changed like
         *
         * if PNR need to collect exit details then show exit popup first and then
         *
         * show MBP or SPBp popup
         *
         *other wise show mbp or spbp directly
         *
         * */
        this.showExitRow(

          function() {


            /* Begin Processing Of Data Before Lading The Pop Up */

        	var selectedCPR = _this.moduleCtrl.getSelectedCPR();
        	if((selectedCPR.flighttocust.length == 1)&&selectedCPR.flighttocust[0].customer.length == 1){
        		var cpr = _this.moduleCtrl.getCPR();
        		var journey = cpr[selectedCPR.journey];
        		var productID = _this.moduleCtrl.findProductidFrmflightid(journey,selectedCPR.flighttocust[0].customer[0],selectedCPR.flighttocust[0].product);
        		_this.onPassbookClick("",{"productID" :productID });
        	}else{
            _this.popUpSelected = "passbook";

            jQuery(document).scrollTop("0");
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            jQuery("#CommonPopupBP").html("");

            _this.$refresh({
              section: "popupSectionBP"
            });
            _this.openSSCIDialog($('#CommonPopupBP'));


            return "passbook0";
          }
          }

        );

      }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onPassBookButtonClick function', exception);
      }
    },
    /*End : On Passbook Button Click*/

//    /*Begin : On Clicking Get Passbook */
//    onPassbookClick: function(evt, args) {
//      this.$logInfo('TripOverviewScript::Entering onPassbookClick function');
//      evt.preventDefault();
//      var _this = this;
//      var CPRdata = _this.moduleCtrl.getCPR();
//      _this.constructSelectedCPRForCheckedINPax();
//      var selectedCPR = _this.moduleCtrl.getSelectedCPR();
//      var journey = selectedCPR.journey;
//      var selectedMBPs = [];
//      var errorStrings = null;
//      var checkinData = _this.moduleCtrl.getModuleData();
//      if (typeof checkinData != "undefined") {
//        errorStrings = checkinData.checkIn.MSSCITripOverview_A.errorStrings;
//      }
//
//      try {
//        jQuery(document).scrollTop("0");
//        var errors = [];
//        var selectFlightList = [];
//
//        var productList = [];
//        for (item1 in selectedCPR.flighttocust) {
//          var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
//          for (item2 in selectedCPR.flighttocust[item1].customer) {
//            var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
//            if (CPRdata[journey][acceptedCustomerNo].passengerTypeCode != "INF") {
//              var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], acceptedCustomerNo, acceptedFlightNo);
//              productList.push(productID);
//            }
//          }
//        }
//
//
//        selectedMBPs.push({
//          "productList": productList
//        });
//
//        if (errors != null && errors.length > 0) {
//          _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
//          evt.stopPropagation();
//          return;
//        }
//        /* End Error Displaying Section */
//
//        /* Begin Sending Backend Request */
//        var input = {
//          "bpRequests": selectedMBPs,
//          "bpType": "passbook",
//          "fromPage": "TripOverview"
//        };
//        //for TDD
//        _this.KarmaOnPassbookClick["bpRequests"] = selectedMBPs;
//        $('#CommonPopupBP').css('display', 'none');
//        _this.moduleCtrl.deliverDocument(input);
//        /* End Sending Backend Request */
//
//      } catch (exception) {
//        this.$logError('TripOverviewScript::An error occured in onPassbookClick function', exception);
//      }
//    },

    /*
     *
     * decide wether to show exit row or not
     *
     * */
    showExitRow: function(mbpSpbpCallBacks) {
      this.$logInfo('TripOverviewScript::Entering showExitRow function');
      try {
      /*For Showing exit row popup*/
      if (!jQuery.isUndefined(this.requestParam) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean) && this.moduleCtrl.getFlowType() != "manageCheckin" && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply.warnings) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply.warnings.warnings)) {
        var temp = this.requestParam.AcceptedResponseBean.generalReply.warnings.warnings;
        if (!jQuery.isUndefined(temp.warnings) && temp.warnings.length > 0) {
          for (var i in temp.warnings) {
            if (temp.warnings[i].errorWarning.code == 6005 || temp.warnings[i].errorWarning.code == 3009) {
              /*Once error found remove from base response so that it wont come on again while browser back and other unwanted scenarios*/
              temp.warnings.splice(i, 1);

              this.moduleCtrl.displayExitPopup(mbpSpbpCallBacks);
                //For TDD
                this.KarmaShowExitRow["message"] = "Once error found remove from base response so that it wont come on again while browser back and other unwanted scenarios";
              return;
            }
          }
        }
      } else {
        this.moduleCtrl.displayExitPopup(mbpSpbpCallBacks);
          //For TDD
          this.KarmaShowExitRow["message"] = "No error found";
        return;
      }
      mbpSpbpCallBacks();
      /*End for showing exit row popup*/
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in showExitRow function', exception);
      }
    },

    emailPopuUp: function(_this, _thismoduleCtrl) {
      this.$logInfo('TripOverviewScript::Entering emailPopuUp function');
      try {
      /*
       * validating on blur wether data proper or not
       * */
      var temp = [];
        jQuery(".sectionDefaultstyleSsci input[type='text'],input[type='email']").each(function() {
        if (_thismoduleCtrl.validateEmail(jQuery(this).val())) {
          temp[jQuery(this).val()] = "";
        }
      });


      /*
       * setting actual auto compelte data accordngly
       * */
      _this.emailautocomlete.autocompleteEmailList = [];
      var emailStrucTemp = [];
      for (var i in temp) {
        emailStrucTemp.push({
          "code": i,
          "label": i
        });
      }
      /*
       * email section bind with this data so as soon as list updated section refresh
       * happens to show updated data to auto complete
       * */
      aria.utils.Json.setValue(_this.emailautocomlete, "autocompleteEmailList", emailStrucTemp);

      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in emailPopuUp function', exception);
      }
    },

          /*Code For Deselecting or Selection the OnEmailClickButton and
       * OnMBPClickButoon Based on Site Parameter for Origin and Destination Disable or Abled*/
      checkIfBPisEnabled: function() {
      this.$logInfo('TripOverviewScript::Entering checkIfBPisEnabled function');
      try {
         var CPRdata = this.moduleCtrl.getCPR();

         _this.constructSelectedCPRForCheckedINPax();
         var noOfFlight = this.moduleCtrl.getSelectedCPR().flighttocust.length;
         var selectedCPR = this.moduleCtrl.getSelectedCPR();
         var journey = CPRdata[selectedCPR.journey];
         var disableMBP = false;
         var disableSPBP = false;
        var disableSMS = false;
         //if ($(".flightSelCheckBox:checked").length != 0) {
            for (var i = 0; i < noOfFlight; i++) {

               //if ($('#seg0' + i).is(':checked')) {
                  //var selectedFlightId = $('#seg0' + i).val();
                  var selectedFlightId = selectedCPR.flighttocust[i].product;
                  var originLocation = journey[selectedFlightId].departureAirport.locationCode;
                  var destinLocation = journey[selectedFlightId].arrivalAirport.locationCode;
                  if ((this.parameters.SITE_SSCI_MBP_ALOD_ORG.trim() != "") && (this.parameters.SITE_SSCI_MBP_ALOD_ORG.search(originLocation) == -1) || this.parameters.SITE_SSCI_MBP_DBL_DST_LST.search(destinLocation) != -1) {
                     disableMBP = true;
            disableSMS = true;
                  }
                  if (this.parameters.SITE_SSCI_SPBP_DSBL_ORG.search(originLocation) != -1 || this.parameters.SITE_SSCI_SPBP_DSBL_DEST.search(destinLocation) != -1) {
                     disableSPBP = true;
                  }

                  var em_flag = true;
                  var mbp_flag = true;
          var sms_flag = true;
                  var cvvCheckRequired = false;
                  for (var flight in selectedCPR.flighttocust) {
                     var flightID = selectedCPR.flighttocust[flight].product;
                     if (flightID == selectedFlightId) {
                        for (var cust in selectedCPR.flighttocust[flight].customer) {
                           var custID = selectedCPR.flighttocust[flight].customer[cust];
                           var key = custID + selectedFlightId;
                           if (journey.productDetailsBeans[key].MBPAllowed == true) {
                              mbp_flag = false;
                           }
                if (journey.productDetailsBeans[key].MBPAllowed == true) {
                  sms_flag = false;
                }
                           if (journey.productDetailsBeans[key].homePrintedBPAllowed == true) {
                              em_flag = false;
                           }
                           if (journey.productDetailsBeans[key].cvvCheckRequired == true) {
                              cvvCheckRequired = true;
                           }
                        }
                     }
                  }
                  if (mbp_flag == true) {
                     disableMBP = true;
                  }
                  if (em_flag == true) {
                     disableSPBP = true;
                  }
          if (sms_flag == true) {
            disableSMS = true;
          }
                  if (cvvCheckRequired) {
                     disableMBP = true;
            disableSMS = true;
                     jQuery("#adcError").removeClass("displayNone").addClass("displayBlock");
                  } else {
                     jQuery("#adcError").removeClass("displayBlock").addClass("displayNone");
                  }


               //}
            }


            if (disableMBP) {
               jQuery(".secondary.app").addClass("disabled");
               jQuery(".secondary.app").removeAttr('atdelegate');
               jQuery(".secondary.add-passbook").addClass("disabled");
               jQuery(".secondary.add-passbook").removeAttr('atdelegate');
          //For TDD
          this.KarmaCheckIfBPEnabledParameters["disableMBP"] = true;
            } else {
               jQuery(".secondary.app").removeClass("disabled");
          jQuery(".secondary.add-passbook").removeClass("disabled");
          //For TDD
          this.KarmaCheckIfBPEnabledParameters["disableMBP"] = false;
        }
        if (disableSMS) {
          jQuery(".secondary.sms").addClass("disabled");
          jQuery(".secondary.sms").removeAttr('atdelegate');
          //for tdd
          this.KarmaCheckIfBPEnabledParameters["disableSMS"] = true;
        } else {
               jQuery(".secondary.sms").removeClass("disabled");
          //for tdd
          this.KarmaCheckIfBPEnabledParameters["disableSMS"] = false;
            }
            if (disableSPBP) {
               jQuery(".secondary.email").addClass("disabled");
               jQuery(".secondary.email").removeAttr('atdelegate');
          //for tdd
          this.KarmaCheckIfBPEnabledParameters["disableSPBP"] = true;
            } else {
               jQuery(".secondary.email").removeClass("disabled");
          //For TDD
          this.KarmaCheckIfBPEnabledParameters["disableSPBP"] = false;
            }
         //}
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in checkIfBPisEnabled function', exception);
      }
      },
    /*End : On Clicking Get Passbook */
	/**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      this.$logInfo('TripOverviewScript::Entering onModuleEvent function');
      try {

        switch (evt.name) {
          case "page.callDisplayFieldsOnLoad":

            break;
          case "page.refresh":
        	this.$dataReady();
            this.$refresh();
            break;
        }
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onModuleEvent function', exception);
      }
    },

    showBPContentSlider: function() {
      this.$logInfo('TripOverviewScript::Entering showBPContentSlider function');
      try {
    	this.$json.setValue(this.inData, "popupContent", "menubottom");
        this.$json.setValue(this.inData, "bottomup", true);
        this.checkIfBPisEnabled();
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in showBPContentSlider function', exception);
      }
    },

    onOverlClose: function() {
      this.$logInfo('TripOverviewScript::Entering onOverlClose function');
      try {

    	this.$json.setValue(this.inData, "popupContent", null);
        this.$json.setValue(this.inData, "bottomup", false);
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onOverlClose function', exception);
      }
    },

    onSendBPButtonClick: function(event) {
      this.$logInfo('TripOverviewScript::Entering onSendBPButtonClick function');
      try {

        $(".boardingPassCont").slideToggle("slow");
        $(".boardingPassCont").css({
          "display": "block"
        });
        $(".arrowIcon").toggleClass("up");
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onSendBPButtonClick function', exception);
      }
    },
    onPassbookFlightButtonClick: function(event,args) {
      this.$logInfo('TripOverviewScript::Entering onPassbookFlightButtonClick function');
      try {
        $("[name='pkFlightButtons']").not(".PassbookCont"+args.flightID).each(function(){
          if($(this).css('display') == 'block'){
            $(this).slideToggle("slow");
          }
         // $(this).css({"display": "none"});
        });
        $("[name='passbookArrow']").not(".arrowIcon"+args.flightID).each(function(){
            if($(this).hasClass("up")){
            	$(this).toggleClass("up");
            }
          });

        $(".PassbookCont"+args.flightID).slideToggle("slow");
        $(".PassbookCont"+args.flightID).css({
          "display": "block"
        });
        $(".arrowIcon"+args.flightID).toggleClass("up");
      } catch (exception) {
        this.$logError('TripOverviewScript::An error occured in onPassbookFlightButtonClick function', exception);
      }
    },
    onPassbookClick: function(event,args){
    	this.moduleCtrl.addToPassBook(args.productID);
    	jQuery("#pkProduct"+args.productID).addClass("pkCreated");
    	this.data.passBookGenerated[args.productID] = "1";
    	jQuery(".msk").addClass("passbookZIndexInc");
    }

  }
});