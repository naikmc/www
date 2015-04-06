Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.TripOverviewScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA',
    'modules.view.merci.common.utils.MCommonScript'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype: {

    $dataReady: function() {
      this.$logInfo('Tripoverviewpage::Entering Viewready function');
      this.requestParam = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.requestParam;
      this.parameters = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.parameters;
      this.label = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.labels;
      this.data.labelDetails=this.label.EmergencyExitPrompt.label;
      this.siteParams = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.siteParam;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.requestParam.bannerHtml, this.siteParams.homeURL, true);
      this.data.bannerInfo=this.requestParam.ProfileBean;

      /*
       * 09269140
       * */
      this.segmentBookingStatErr = false;
      this.errorMsg = '';
      this.isCurrentPrime = true;
      this.tempSelectedCPR=null;
      this.selectedPax="";

      this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);

      this.moduleCtrl.setGADetails(this.parameters);

      if (!this.data.svTime) {

        this.data.svTime = this.requestParam.CPRIdentification.serverDateFormat;

      }
      if (!this.data.telephoneNumberList) {
        this.moduleCtrl.setTelephoneNumberList(this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.telephoneNumList);
      }


      var json = this.moduleCtrl.getCPR();

      /*
       * For forming pax
       * */
      var custArray = json.customerLevel;
      var prodArray = json.customerLevel[0].productLevelBean;
      var custReqArray = [];
      for (var k = 0; k < prodArray.length; k++) {
        var customer = [];
        for (var l = 0; l < custArray.length; l++) {
            customer.push(l);
        }
        if (customer.length > 0) {
          custReqArray.push({
            "product": "" + k,
            "customer": customer.length == 1 ? "" + customer[0] : customer
          });
        }
      }
      this.tempSelectedCPR=custReqArray;
      this.selectedPax=custReqArray[0].customer;


      /*In case if country's list of china - Cn or twiwan is coming, as country list coming differently mapping it to original one */
      if (!json.countryList[0].base && this.moduleCtrl.getModuleData().framework.baseParams.join().indexOf("LANGUAGE=CN") != -1 || this.moduleCtrl.getModuleData().framework.baseParams.join().indexOf("LANGUAGE=TW") != -1) {
        this.data.CPRIdentificationoriginal = this.$json.copy(json);
        var newCtryList = [{
          "base": []
        }];
        for (var base in json.countryList) {
          for (var repair in json.countryList[base]) {
            json.countryList[base][repair] = json.countryList[base][repair].replace(/\s{2,}/g, ' ');
            var details = json.countryList[base][repair].split(" ");
            details = details.slice(0, details.length - 1);
            var temp = [];
            temp.push(json.countryList[base][repair].split(" ")[details.length]);
            temp.push(details.join(" "));

            newCtryList[0]["base"].push(temp);

          }
          json.countryList[base] = newCtryList[0];
          newCtryList = [{
            "base": []
          }];
        }


      }


    },

    $viewReady: function() {

      this.$logInfo('Tripoverviewpage::Entering Viewready function');

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
      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /* if(this.parameters && this.parameters.SITE_MCI_GA_ENABLE)
         {
       // ga('send', 'pageview', {'page': 'Trip overview','title': 'Your Trip overview'});
      }*/

      if(jQuery(".sectionDefaultstyle section>article[data-validpanel=\"false\"]").length == jQuery(".sectionDefaultstyle section>article[data-validpanel]").length)
      {
    	  jQuery("#tripOverFlowCheckin").attr("disabled","disabled");
    	  jQuery("#tripOverFlowCheckin").addClass("disabled");
      }

    },

    $displayReady: function() {

      this.$logInfo('Tripoverviewpage::Entering displayready function');
      this.moduleCtrl.setoriginalSelectedCPR(null);
      this.moduleCtrl.setAcceptedValueForSeat(null);
      this.moduleCtrl.setIsAcceptanceConfirmation(false);

      /*ga('send', 'pageview', {
              'page': 'Checkin page',
              'title': 'Checkin home page'
            });


          ga('send', 'event', 'Triplist page loaded successfully', 'iPhone',"HKG",867);
          //_trackEvent("Merci Checkin Event Track", "Triplist page loaded successfully", "Mobile Web");
  */


    },

    // Function is used to check whether flight checkin is eligible or not
    isFlightEligible: function(product, product_index) {
      this.$logInfo('Tripoverviewpage::Entering isFlightEligible function');

      var json = this.moduleCtrl.getCPR();

      if((json.adultCount + json.childCount) == 1)
      {
      // based on the marketingCarrier, chk is done
      if (!product.primeFlightEligible) {
        this.errorMsg = jQuery.substitute(this.label.OtherAirline, product.operatingFlightDetailsMarketingCarrier);
        this.isCurrentPrime = false;
        return false;
      }

          if (!product.flightOpen) {
            if (!this.isFlightAcceptanceStatusOpen(product)) {
              this.errorMsg = this.label.FlightNotOpen;
              return false;
            }
          }

      // based on the checkin opentime site parameter, chk is done
          if (!product.flightOpen && !product.open) {
        this.errorMsg = jQuery.substitute(this.label.ChkOpn, this.parameters.SITE_MCI_ACPTNC_TIME);
        return false;
      }

      if (!product.flightEligible) {
        this.errorMsg = this.label.ResTkt;
        return false;
      }

      // If any error occurs false is returned
          /*if(product.userErrorBean){
        for (var i = 0; i < product.userErrorBean.length; i++) {
          if (product.userErrorBean[i].errorCode != "100200") {
            this.errorMsg = product.userErrorBean[i].errorValue;
            return false;
          }
        }
            }*/

          // based on the no of passengers checked in, chk is done
          if (!(this.isEligible(product_index))) {
            this.errorMsg = this.label.ResTkt;
            return false;
      }

          // based on the booking status site parameter, chk is done
          //var segmentBookingStatErr = true;

          if (product.segmentBookingStatus) {
            this.segmentBookingStatErr = false;
            /*if(segmentBookingStatErr){
              this.segmentBookingStatErr = true;
              return false;
            }*/
          } else {
            this.segmentBookingStatErr = true;
            return false;
          }

          /*var cpr = this.moduleCtrl.getCPR();
          var allPaxCheckedInSegment = true;
          for (var i = 0; i < cpr.customerLevel.length; i++) {
            if (!cpr.customerLevel[i].productLevelBean[product_index].paxCheckedInStatusInCurrProd) {
              allPaxCheckedInSegment = false;
              break;
            }
          }

          if (allPaxCheckedInSegment) {
            return false;
          }*/

          return true;
      }else
      {
          // based on the marketingCarrier, chk is done
          if (!product.primeFlightEligible) {
            this.errorMsg = jQuery.substitute(this.label.OtherAirline, product.operatingFlightDetailsMarketingCarrier);
            this.isCurrentPrime = false;
            return false;
          }

          if (!product.flightOpen && product.open) {
            if (!this.isFlightAcceptanceStatusOpen(product)) {
              this.errorMsg = this.label.FlightNotOpen;
              return false;
            }
          }

          // based on the checkin opentime site parameter, chk is done
          if (!product.flightOpen && !product.open) {
            this.errorMsg = jQuery.substitute(this.label.ChkOpn, this.parameters.SITE_MCI_ACPTNC_TIME);
            return false;
          }

          if (!product.flightEligible) {
            this.errorMsg = this.label.ResTkt;
            return false;
          }

          // If any error occurs false is returned
          /*if(product.userErrorBean){
            for(var i=0; i<product.userErrorBean.length; i++){
              if(product.userErrorBean[i].errorCode != "100200"){
                this.errorMsg = product.userErrorBean[i].errorValue;
                return false;
              }
            }
          }*/

      // based on the no of passengers checked in, chk is done
      if (!(this.isEligible(product_index))) {
        this.errorMsg = this.label.ResTkt;
        return false;
      }

      // based on the booking status site parameter, chk is done
      //var segmentBookingStatErr = true;

      if (product.segmentBookingStatus) {
        this.segmentBookingStatErr = false;
        /*if(segmentBookingStatErr){
            this.segmentBookingStatErr = true;
            return false;
          }*/
      } else {
        this.segmentBookingStatErr = true;
        return false;
      }

      return true;

      }

    },
    // This function checks whether the passenger is eligible for checkin or not
    isEligible: function(product) {
      this.$logInfo('Tripoverviewpage::Entering isEligible function');
      var cpr = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.requestParam.CPRIdentification;
      if (cpr && cpr.customerLevel && cpr.customerLevel.length > 0) {
        var cust = cpr.customerLevel;
        var totalPax = cust.length;
        var nPax = 0;
        for (var i = 0; i < cust.length; i++) {
          if (cust[i].customerDetailsType != "IN") {
            if (!(this.isPaxEligible(cust[i], product))) {
              nPax = nPax + 1;
            }
          } else {
            totalPax = totalPax - 1;
          }
        }
        if (nPax == totalPax) {
          return false;
        } else {
          return true;
        }
      }
    },
    isPaxEligible: function(cust, product) {
      this.$logInfo('Tripoverviewpage::Entering isPaxEligible function');
      var prodIden = cust.productLevelBean[product].productIdentifiersBean;
      var infantPrimeId = "";
      var isInfanttoPax = false;
      // chk if any passenger is associated with infant
      for (var i = 0; i < prodIden.length; i++) {
        if (prodIden[i].referenceQualifier == "JID") {
          infantPrimeId = prodIden[i].primeId;
          isInfanttoPax = true;
        }
      }


      if (cust.customerDetailsType != "IN") {

        if (isInfanttoPax) {
          return this.isPaxInfEligible(infantPrimeId, product);
        } else {
          //return cust.isPaxEligible;
          return cust.paxEligible;
        }

      }
    },

    isPaxInfEligible: function(infantPrimeId, product) {
      this.$logInfo('Tripoverviewpage::Entering isPaxInfEligible function');
      var cpr = this.moduleCtrl.getCPR();
      for (var i = 0; i < cpr.customerLevel.length; i++) {
        if (cpr.customerLevel[i].customerDetailsType == "IN") {
          for (var j = 0; j < cpr.customerLevel[i].productLevelBean[product].productIdentifiersBean.length; j++) {
            if (cpr.customerLevel[i].productLevelBean[product].productIdentifiersBean[j].referenceQualifier == "DID") {
              if (cpr.customerLevel[i].productLevelBean[product].productIdentifiersBean[j].primeId == infantPrimeId) {
                return cpr.customerLevel[i].paxEligible;
              }
            }
          }
        }
      }
    },
    isFlightAcceptanceStatusOpen: function(productLevelBean) {
        var l_flightStatusesBeans = productLevelBean.flightStatusesBean;
        var l_gnStatus = false;
        var l_acStstus = false;
        var finalBool = false;

        if (l_flightStatusesBeans != null) {
          for (var i = 0; i < l_flightStatusesBeans.length; i++) {
            var currIndicator = l_flightStatusesBeans[i];
            if (currIndicator.indicator == "GN" && currIndicator.action == "OP") {
              l_gnStatus = true;
            } else if (currIndicator.indicator == "AC" && currIndicator.action == "OP") {
              l_acStstus = true;
            }
          }
          if (l_gnStatus && l_acStstus) {
            finalBool = true;
          }
        }
        return finalBool;
      },
    gotoSelectPAX: function(e, args) {
      this.$logInfo('Tripoverviewpage::Entering gotoSelectPAX function');
      modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
      e.preventDefault();
      var _this = this;
      _this.moduleCtrl.setIsFlowAppCancel(false);
      jQuery('button.validation.disabled').click(function() {
        return null;
      });
      var flow = args.flow;
      var json = this.moduleCtrl.getCPR();
      /* Creating country name with 3 digit code map */
      var countryList = json.countryList[1];
      countryListCodeMap = {};
      countryListCodeMap.codetocountry = {};
      for (var x in json.countryList) {
        var countryList = json.countryList[x];
        for (var i in countryList) {
          for (var j in countryList[i]) {
            var countryName = countryList[i][j][1];
            var countryCode = countryList[i][j][0];
            countryListCodeMap[countryName.toUpperCase()] = countryCode;
            countryListCodeMap.codetocountry[countryCode] = countryName.toUpperCase();
          }
        }
      }
      /* Set the map in module controller */
      _this.moduleCtrl.setCountryNameCodeMap(countryListCodeMap);
      if (flow == "checkin") {
        this.moduleCtrl.paxflightSelection();


      } else {

        var _this = this;
        //_this.showOverlay(true);
        //modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        var cpr = _this.moduleCtrl.getCPR();
        var custArray = cpr.customerLevel;
        var prodArray = cpr.customerLevel[0].productLevelBean;
        var custReqArray = [];
        for (var k = 0; k < prodArray.length; k++) {
          var customer = [];
          for (var l = 0; l < custArray.length; l++) {
            var chkdin = false;
            var legArray = cpr.customerLevel[l].productLevelBean[k].legLevelBean;
            for (var m = 0; m < legArray.length; m++) {
              var indicators = legArray[m].legLevelIndicatorBean;
              for (var j = 0; j < indicators.length; j++) {
                if (indicators[j].indicator == "CAC" || indicators[j].indicator == "CST") {
                  chkdin = true;
                }
              }
            }
            if (chkdin) {
              customer.push(l);
            }
          }
          if (customer.length > 0) {
            custReqArray.push({
              "product": "" + k,
              "customer": customer.length == 1 ? "" + customer[0] : customer
            });
          }
        }
        _this.moduleCtrl.setSelectedPax(custReqArray);
        _this.moduleCtrl.setFlowType(flow);
        _this.moduleCtrl.setAcceptedCPR();
        _this.moduleCtrl.acceptanceConfirmation_load();
      }

    },

    onBackClick: function() {
      if (this.moduleCtrl.getEmbeded() && !jsonResponse.data.checkIn.MCheckinIndex_A) {
        window.location = "sqmobile" + "://?message=";
      } else {
        this.moduleCtrl.onBackClick();
      }
    },
    /* Function is used to find out infant customer index from parent index */

    getInfantIndex: function(parentIndex, productIndex, infantPrimeId) {
      var cpr = this.moduleCtrl.getCPR();
      var productLevel = cpr.customerLevel[0].productLevelBean;
      var customerLevel = cpr.customerLevel;
      if (customerLevel != null && customerLevel.length > 0) {
        for (var i = 0; i < customerLevel.length; i++) {
          if (customerLevel[i].customerDetailsType == "IN") {
            for (var identifier in customerLevel[i].productLevelBean[productIndex].productIdentifiersBean) {
              var identifierObj = customerLevel[i].productLevelBean[productIndex].productIdentifiersBean[identifier];
              if (identifierObj.referenceQualifier == "DID") {
                if (identifierObj.primeId == infantPrimeId) {
                  return i;
                }
              }
            }
          }
        }
      }
      return null;
    }
  }

});