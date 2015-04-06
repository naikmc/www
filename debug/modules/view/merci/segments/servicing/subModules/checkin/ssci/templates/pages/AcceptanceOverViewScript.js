Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.AcceptanceOverViewScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {
    this.currDate = "";
    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.KarmaViewReady = {};
    this.KarmaExcludePaxByUpdatingSelectedCPR = {};
    this.KarmaOnContinueClick = {};
  },

  $prototype: {
    $dataReady: function() {
      try {
        this.$logInfo('AcceptanceOverViewScript: Entering dataReady function ');
        var pageData = this.moduleCtrl.getModuleData().checkIn;
        if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
          pageData = jsonResponse.data.checkIn;
        }
        this.label = pageData.MSSCIAcceptanceOverview_A.labels;
        this.parameters = pageData.MSSCIAcceptanceOverview_A.parameters;
        this.data.siteParameters = this.parameters;
        this.siteParams = pageData.MSSCIAcceptanceOverview_A.siteParam;
        this.rqstParams = pageData.MSSCIAcceptanceOverview_A.requestParam;
        this.errorStrings = pageData.MSSCIAcceptanceOverview_A.errorStrings;
        this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, true);

        this.tempSelectedCPR = {};
        this.tempSelectedCPR.selectedCPR = this.$json.copy(this.moduleCtrl.getSelectedCPR());

        this.moduleCtrl.setHeaderInfo({
          title: this.label.Title,
          bannerHtmlL: this.rqstParams.bannerHtml,
          homePageURL: this.siteParams.homeURL,
          showButton: true
        });

        /* Exclude segment and pax if found same status of SITE_SSCI_INHBT_REG_INDI */
        this.data.custToFlightRemovedList = {};
        this.excludePaxByUpdatingSelectedCPR();
        this.currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd");


      } catch (_ex) {
        this.$logError('AcceptanceOverViewScript: an error has occured in dataReady function');
      }
    },

    $destructor: function() {

      if (this.tempSelectedCPR.required == null || this.tempSelectedCPR.required == false) {
        this.moduleCtrl.setSelectedCPR(this.tempSelectedCPR.selectedCPR);
      }


    },

    $displayReady: function() {
      try {
        this.$logInfo('AcceptanceOverViewScript: Entering displayReady function ');
        /*To Display Warning Messages*/
        this.moduleCtrl.getWarningsForThePage("TSUM", this);

        this.data.regPageLandingPaxIndex = 0;

        var processAcceptanceStatus = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.ProcessAcceptanceStatus;
        var acceptedPax = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.AcceptedPassengers;
        this.noneGotCheckedin = false;
        if (acceptedPax != null && acceptedPax == "NONE") {
          this.noneGotCheckedin = true;
        }

        this.secQuesFailedFlag = false;
        if (processAcceptanceStatus != null && processAcceptanceStatus == "SEQ_FAILURE") {
          this.secQuesFailedFlag = true;
        }

      } catch (_ex) {
        this.$logError('AcceptanceOverViewScript: an error has occured in displayReady function');
      }
    },


    $viewReady: function() {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering viewReady function');

        document.getElementById("security_questions").style.display = "none";

        this.moduleCtrl.setWarnings("");
        this.moduleCtrl.setSuccess("");

        /*For showing error message*/
        var removedData = this.data.custToFlightRemovedList;
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR()[selectedCPR.journey];
        var errors = [];
        var errorID = "tripSummErrors";

        if (!jQuery.isUndefined(removedData)) {
          /*For hide hole page incase nothing to show*/
          if (jQuery.isUndefined(selectedCPR.flighttocust) && jQuery.isUndefined(selectedCPR.custtoflight)) {
            jQuery(".sectionDefaultstyle").hide();
            errorID = "tripSummCoreErrors";
          }

          for (var flightDetail in removedData) {
            var custList = [];
            var flightList = "";
            for (var custDetai in removedData[flightDetail]) {
              var temp = "";
              if (!jQuery.isUndefined(cpr[custDetai].personNames) && !jQuery.isUndefined(cpr[custDetai].personNames[0].givenNames)) {
                temp += cpr[custDetai].personNames[0].givenNames[0] + " ";
              }

              if (!jQuery.isUndefined(cpr[custDetai].personNames) && !jQuery.isUndefined(cpr[custDetai].personNames[0].surname)) {
                temp += cpr[custDetai].personNames[0].surname;
              }
              custList.push(temp);
            }

            if (custList.length > 1) {
              temp = custList.splice(custList.length - 1, 1);
              custList = custList.join(", ") + " " + this.label.and + " " + temp;

            }
            flightList = cpr[flightDetail].operatingAirline.companyName.companyIDAttributes.code + cpr[flightDetail].operatingAirline.flightNumber;

            //For TDD
            this.KarmaViewReady["custList"] = custList;
            this.KarmaViewReady["flightList"] = flightList;

            errors.push({
              "localizedMessage": jQuery.substitute(this.label.paxinhibiterrormsg, [custList, flightList])
            });

          }

          this.moduleCtrl.displayErrors(errors, errorID, "error");

        }
        /*End*/


        /*GOOGLE ANALYTICS
         * */
        var customData = {};
        //if site parameter is enabled
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR();
        var journey = cpr[selectedCPR.journey];


        if (true) {
          for (var customerIndex in selectedCPR.custtoflight) {
            var customerInfo = selectedCPR.custtoflight[customerIndex];
            var custID = customerInfo.customer;
            var cust = journey[custID];
            var selDOB = "";
            var years = -1;

            //DOB
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
              years = this.moduleCtrl.getAgeOfCustomerInYears(selDOB);
            }
            if (years != -1) {
              customData['age'] = (customData['age'] == undefined) ? (years) : (customData['age'] + "," + years);
            }

            //Cabin Class
            if (cust.passengerTypeCode != "INF") {
              var passengerFlightContraint = custID + journey.firstflightid;
              var bookingClass = journey.cabinInformation.product[passengerFlightContraint].bookingClass;
              customData['cabinClass'] = (customData['cabinClass'] == undefined) ? (bookingClass) : (customData['cabinClass'] + "," + bookingClass);
            }
            //Gender
            if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].gender)) && (journey.customerDetailsBeans[custID].gender != "")) {
              var gender = journey.customerDetailsBeans[custID].gender;
              customData['gender'] = (customData['gender'] == undefined) ? (gender) : (customData['gender'] + "," + gender);
            }

            //nationality
            if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
              for (var reqDataIndex in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
                if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality)) {
                  var nationality = journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality;
                  customData['nationality'] = (customData['nationality'] == undefined) ? (nationality) : (customData['nationality'] + "," + nationality);
                }
              }
            }


          }



          //FlightNumber
          for (var flightIndex in selectedCPR.flighttocust) {
            var flightInfo = selectedCPR.flighttocust[flightIndex];
            var flightID = flightInfo.product;
            var flightNo = journey[flightID].operatingAirline.companyName.companyIDAttributes.code + journey[flightID].operatingAirline.flightNumber;
            customData['flightNumber'] = (customData['flightNumber'] == undefined) ? (flightNo) : (customData['flightNumber'] + "," + flightNo);

            //Time Prior to Departure in Hrs
            var date1 = new Date(journey[flightID].timings.SDT.time);
            var date2 = new Date(this.moduleCtrl.getsvTime());
            var hours = Math.floor((date1 - date2) / 36e5);
            customData['timePriorToDepartureInHrs'] = (customData['timePriorToDepartureInHrs'] == undefined) ? (hours) : (customData['timePriorToDepartureInHrs'] + "," + hours);
          }
          customData['pageTitle'] = "Review Check-In";
        }

        //For TDD
        this.KarmaViewReady["mockCustomData"] = customData;

        if (this.moduleCtrl.getEmbeded()) {
          jQuery("[name='ga_track_pageview']").val("Trip summary");
          window.location = "sqmobile" + "://?flow=MCI/pageloaded=acceptanceOverview";

        } else {
          var GADetails = this.moduleCtrl.getGADetails();

          this.__ga.trackPage({
            domain: GADetails.siteGADomain,
            account: GADetails.siteGAAccount,
            gaEnabled: GADetails.siteGAEnable,
            page: 'Trip summary',
            GTMPage: 'Trip summary',
            data: customData
          });
        }

        /*GOOGLE ANALYTICS
         * */
        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
          genericScript({
            tpl: "AcceptanceOverview",
            data: this.data
          });
        }
        /*END : JavaScript Injection(CR08063892)*/
      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in viewReady function', exception);
      }
    },

    /*
     * Exclude segment and pax if found same status of SITE_SSCI_INHBT_REG_INDI
     * */
    excludePaxByUpdatingSelectedCPR: function() {
      this.$logInfo('AcceptanceOverViewScript::Entering excludePaxByUpdatingSelectedCPR function');
      try {

        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR();
        var param = this.parameters.SITE_SSCI_INHBT_REG_INDI;
        if (jQuery.trim(param) != "") {
          /*For get check regulatory response*/
          for (var item in cpr[selectedCPR.journey].customerDetailsBeans) {
            var item_org = item;
            item = cpr[selectedCPR.journey].customerDetailsBeans[item];

            /*for getting status*/
            if (item.regulatoryDetails != undefined) {
              for (var stas in item.regulatoryDetails.statusDetails) {
                stas = item.regulatoryDetails.statusDetails[stas];
                if (!jQuery.isUndefined(stas.status)) {

                  var formCode = stas.status[0].listCode + "=" + stas.status[0].code;

                  /*For check in site param and take apropiate action*/
                  if (param.search(new RegExp(formCode, "i")) != -1) {
                    console.log("formCode - " + formCode + ",  Parameter - " + param);

                    /*As we found flight and cust we r removing same from selected cpr as not taking farword*/
                    var cust = stas.referenceIDProductPassengerID;
                    var flight = stas.referenceIDProductFlightID;

                    /*Filling to show error messages*/
                    if (jQuery.isUndefined(this.data.custToFlightRemovedList[flight])) {
                      this.data.custToFlightRemovedList[flight] = {};
                    }
                    this.data.custToFlightRemovedList[flight][cust] = {};

                    /*Removing same from selected CPR*/
                    this.moduleCtrl.removeCustToFlightFromSelectedCPR(flight, cust);
                    this.moduleCtrl.removeFlightToCustFromSelectedCPR(flight, cust);
                    //For TDD
                    this.KarmaExcludePaxByUpdatingSelectedCPR["message"] = "passenger excluded from flight";
                    break;
                  }

                }
              }
            }

          }
        }

      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in excludePaxByUpdatingSelectedCPR function', exception);
        //For TDD
        this.KarmaExcludePaxByUpdatingSelectedCPR["message"] = "exception thrown";
      }

    },

    /*When User Clicks On The Link To Edit Regulatory Details Of The Person*/
    viewInfoCurCust: function(evt, args) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering viewInfoCurCust function');

        /*For edit nationality*/
        this.data.inNatEditScreen = false;
        /*End edit nationality*/

        /*For find out productid, productid requires in case of displya regulatory details based on product*/
        var cpr = this.moduleCtrl.getCPR();
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var journeyID = selectedCPR.journey;
        this.data.productIDtoShowRegDetilBaseOnProd = this.moduleCtrl.findProductidFrmflightid(cpr[journeyID], args.currentcust, args.flightID);

        this.data.regPageLandingPaxIndex = this.moduleCtrl.getCustomerIndex(args.currentcust, "regulatoryAlteredSelCpr");

        this.moduleCtrl.loadRegulatory();
      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in viewInfoCurCust function', exception);
      }
    },

    // Function called on initiate acceptance continue click for acceptance of checkin
    onContinue: function(evt) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering onContinue function');

        //For the scenario when security answers are answered incorrectly and the continue button is changed to exit check-in
        if (this.secQuesFailedFlag || this.data.appCheckFailed) {
          var homeUrl = this.siteParams.homeURL;
          window.location = homeUrl;
          return null;
        }

        // We prevent default behaviour
        evt.preventDefault();

        //turn the background off
        jQuery(document).scrollTop("0");
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        var securityQues = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.SecurityQuestions;
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var res = this.moduleCtrl.getCPR();
        var journeyID = selectedCPR.journey;
        var journey = res[journeyID];
        var list = "";
        var input = {};
        var errors = [];


        /*BEGIN : Code For Checking that According to Parameters Atleast One Valid Adult is Accopaning the Passengers*/
        /**
         * Here We Are Not Checking Whether One of The Selected Pax is Valid Adult or One ValidatedAdult is Checkin because Its Checked on Select Flight Page
         * Here We are Only checking that PNR has Atleast ONe Valid Adult In case User changed the DOB for Regulatory Page.
         * Valid Adult : Meaning Having SSR Like(WHCR) and having DOB more than Specified by airline for Adult.
         * **/
        /******** For checking atlease onepax checked in *******************/
        if (jQuery.isUndefined(securityQues)) {
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
                  if ((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1)) {
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
                        years = this.moduleCtrl.getAgeOfCustomerInYears(selDOB);
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

          if (errors != null && errors.length > 0) {
            this.moduleCtrl.displayErrors(errors, "tripSummErrors", "error");
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            return null;
          }
        }
        /*END :Code For Checking that According to Parameters Atleast One Valid Adult is Accopaning the Passengers*/

        /* Getting the list of product IDs */
        for (var f_index = 0; f_index < selectedCPR.flighttocust.length; f_index++) {
        	var flighttocust = selectedCPR.flighttocust[f_index];
        	for(var c_index = 0;c_index < flighttocust.customer.length;c_index++){
        		if(list == ""){
        			list = this.moduleCtrl.findProductidFrmflightid(res[selectedCPR.journey],flighttocust.customer[c_index],flighttocust.product);
        		}else{
        			list = list + "," + this.moduleCtrl.findProductidFrmflightid(res[selectedCPR.journey],flighttocust.customer[c_index],flighttocust.product);
        		}
//		          list = list + this.moduleCtrl.findProductidFrmflightList(res[selectedCPR.journey], selectedCPR.custtoflight[i].customer, selectedCPR.custtoflight[i].product);
//		          if (i != (selectedCPR.custtoflight.length - 1)) {
//		            list = list + ",";
//		          }
          }
        }
        var toBeCheckedinProds = list;
        var checkedinlist = "";
        var checkedInProds = this.moduleCtrl.getCheckedInProductIDs();
        if (checkedInProds != null) {
          for (var j = 0; j < checkedInProds.length; j++) {
            checkedinlist = checkedinlist + checkedInProds[j] + ",";
          }
          list = checkedinlist + list;
        }

        /*Getting the answers of the Security Questions*/
        if (securityQues.length > 0) {
          input.securityQues = [];
          for (var i = 0; i < securityQues.length; i++) {
            var quesID = securityQues[i];
            var ans = "";

            if (document.getElementById("Yes_" + quesID).checked) {
              ans = "Yes";
            } else if (document.getElementById("No_" + quesID).checked) {
              ans = "No";
            }

            if (ans == "") {
              /*If user has not answered any of the question*/
              errors.push({
                "localizedMessage": this.errorStrings[2016460].localizedMessage
              });
              this.moduleCtrl.displayErrors(errors, "tripSummErrors", "error");
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              //For TDD
              this.KarmaOnContinueClick["message"] = "Security Question unanswered";

              return null;
            }
            var ansParameter = "SSCI_SEQ_ANS_" + quesID;
            var corrAns = this.parameters[ansParameter];

            /*forming the input*/
            input.securityQues[i] = {};
            input.securityQues[i].id = quesID;
            if (ans.toUpperCase() === corrAns.toUpperCase()) {
              input.securityQues[i].ans = true;
            } else {
              input.securityQues[i].ans = false;
            }
          }


        }
        input.prodIDs = list;
        input.toBeCheckedinProds = toBeCheckedinProds;

        //For TDD
        this.KarmaOnContinueClick["prodIDs"] = list;

        /*
         * For making selected CPR to previous state when user clicks on back from trip summary page as
         *
         * trip summay page alter selected cpr based on regulatory indicators
         *
         * */
        this.tempSelectedCPR.required = true;

        this.moduleCtrl.processAcceptance(input);

      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in onContinue function', exception);
        //For TDD
        this.KarmaOnContinueClick["exception"] = "AcceptanceOverViewScript::An error occured in onContinue function";
      }
    },

    dgrGoodsAndUSCheck: function(evt) {
      this.$logInfo('AcceptanceOverViewScript::Entering dgrGoodsCheck function');
      try { /*No Of Yes Nos Boxes Conditons Check*/
        var enableTheButton = true;

        checkDGBoxDAG = $('ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
        if (checkDGBoxDAG != undefined && checkDGBoxDAG.length > 0) {
          if (!jQuery(checkDGBoxDAG.selector).is(':checked')) {
            enableTheButton = false;
          }
        }
        /*No Of Yes Nos Boxes Condition Check*/

        buttonRef = jQuery('#tripSummaryContinue');
        var noChange = (this.secQuesFailedFlag || this.noneGotCheckedin || this.data.appCheckFailed);
        this.checkIfenableNav(buttonRef, enableTheButton, noChange);
        return false;

      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in dgrGoodsCheck function', exception);
      }
    },

    checkIfenableNav: function(buttonRef, enableTheButton, noChange) {
      this.$logInfo('AcceptanceOverViewScript::Entering checkIfenableNav function');
      try {

        if (noChange) {
          return null;
        }
        var buttonToEnable = buttonRef ? buttonRef : $('footer.buttons button').eq(0);


        if (enableTheButton) {
          buttonToEnable.removeClass('disabled');
          buttonToEnable.removeAttr("disabled");
        } else {
          buttonToEnable.addClass('disabled');
          buttonToEnable.attr("disabled", "disabled");
        }

      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in checkIfenableNav function', exception);
      }
    },

    loadDRGScreen: function(evt, args) {
      this.$logInfo('AcceptanceOverViewScript::Entering loadDRGScreen function');
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering loadDRGScreen function');
        this.moduleCtrl.dangerousGoods_load();
      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in loadDRGScreen function', exception);
      }
    },

    onModuleEvent: function(evt) {
      try {
        this.$logInfo('AcceptanceOverviewScript::Entering onModuleEvent function');
        if (!jQuery.isUndefined(evt.refId)) {
          this.__data.refId = evt.refId;
        }
        switch (evt.name) {
          case "page.refresh":
            this.$refresh();
            break;
        }
      } catch (exception) {
        this.$logError('AcceptanceOverviewScript::An error occured in onModuleEvent function', exception);
      }
    },

    onBackClick: function() {
      this.$logInfo('AcceptanceOverViewScript::Entering onBackClick function');
      try {
        this.moduleCtrl.onBackClick();
      } catch (exception) {
        this.$logError('AcceptanceOverViewScript::An error occured in onBackClick function', exception);
      }
    },

    openHTML: function(args, data) {
        this.$logInfo('AcceptanceOverViewScript::Entering onBackClick function');
        try {
          // calling common method to open HTML page popup
          modules.view.merci.common.utils.MCommonScript.openHTML(data);
        } catch (exception) {
          this.$logError('AcceptanceOverViewScript::An error occured in onBackClick function', exception);
        }
      }
      //	isUSRoute : function(){
      //		var cpr = this.moduleCtrl.getCPR();
      //		var selectedCPR = this.moduleCtrl.getSelectedCPR();
      //		for(var flightNoIndex in cpr[selectedCPR.journey].flightList){
      //			var flightNo = cpr[selectedCPR.journey].flightList[flightNoIndex];
      //			var arrivalcountryCode = cpr[selectedCPR.journey][flightNo].arrivalAirport.airportLocation.countryCode;
      //			var departurecountryCode = cpr[selectedCPR.journey][flightNo].departureAirport.airportLocation.countryCode;
      //			if(arrivalcountryCode == "USA" || departurecountryCode == "USA"){
      //				return true;
      //			}
      //		}
      //		return false;
      //	}

  }
});