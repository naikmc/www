/**
 * @class samples.templates.domevents.templates.pages.TemplateScript
 */
Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.SelectFlightsScript',
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
      this.$logInfo('SelectFlightsScript::Entering $dataReady function');
      this.requestParam = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.requestParam;
      this.label = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.SelectFlights.labels;
      this.siteParams = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.siteParam;
      this.parameters = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.parameters;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.requestParam.bannerHtml, this.siteParams.homeURL, true);
      this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.errorStrings;
      this.segmentBookingStatErr = false;
      this.errorMsg = '';
      this.isCurrentPrime = true;

      this.moduleCtrl.setGADetails(this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.parameters);

    },

    $displayReady: function() {
      this.$logInfo('SelectFlightsScript::Entering $displayReady function');
      var _this = this;
      _this.moduleCtrl.setCountryCode(null);
      _this.moduleCtrl.setoriginalSelectedCPR(null);
      //_this.displayRoutes();
      //_this.routeSelection();
      _this.updateSelectionData();
      var toReset = [];
      _this.moduleCtrl.setAcceptedCprValidApp(toReset);
      this.data.firstTimeLoad = 0;

      if (navigator.userAgent.search(/Android 2./ig) != -1) {
        /* $('.breadcrumbs').addClass("breadcrumbsForS2"); */

      }

      /*For stop over suppresser*/
      var _this = this;
      jQuery("#section4 input[type='checkbox']:checked").each(function() {
        _this.checkstopover(jQuery(this));
      });
      /*End For stop over suppresser*/

    },

    $viewReady: function() {
      //this.prePopulateSelection();
      this.$logInfo('SelectFlightsScript::Entering $viewReady function');

      var checkBoxFlight = $('div ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
      var buttonRef = jQuery('#SlctFlgtsCont');
      checkIfenableNavigation(buttonRef);

      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Select flight");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=selectFlights";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
        
        
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
          page: 'Select flight'
        });
        
      }

      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(this.parameters.SITE_MCI_GA_ENABLE)
       {
      //ga('send', 'pageview', {'page': 'Select flight','title': 'Your Select flight'});
    }*/



      this.moduleCtrl.setWarnings("");
      this.moduleCtrl.setSuccess("");

    },

    // Function is used to check whether flight checkin is eligible or not
    isFlightEligible: function(product, product_index) {
      this.$logInfo('SelectFlightsScript::Entering isFlightEligible function');
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
    loadEditPAXScreen: function(evt, args) {
      this.$logInfo('SelectFlightsScript::Entering loadEditPAXScreen function');
      this.moduleCtrl.setSelectedEditpax(args.selectedPax);

      this.moduleCtrl.passengerDetailsLoad();
    },

    //    loadDRGScreen : function(evt,args){
    //      this.$logInfo('SelectFlightsScript::Entering loadDRGScreen function');
    //      this.moduleCtrl.dangerousGoods_load();
    //    },

    // Function is used to update the check box details for customer and flight.
    updateSelectionData: function() {
      this.$logInfo('SelectFlightsScript::Entering updateSelectionData function');
      checkBoxPax = $('div[data-layout="NoNeedToCheckPax"] ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
      checkBoxFlight = $('div ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
      checkBoxDAG = $('div ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
    },


    // Function is used to check the checkin open time based on the site parameter SITE_MCI_ACPTNC_TIME
    isCheckinOpen: function(leg, departure) {
      this.$logInfo('SelectFlightsScript::Entering isCheckinOpen function');
      var departureDate = '';
      if (leg != null && leg.length > 0) {
        for (var i = 0; i < leg.length; i++) {
          if (leg[i].legRoutingOrigin == departure) {
            var legTimes = leg[i].legTimeBean;
            for (var j = 0; j < legTimes.length; j++) {
              if (legTimes[j].businessSemantic == "STD") {
                departureDate = eval(legTimes[j].json);
              }
            }
          }
        }
      }
      if (departureDate != '') {
        var currentDate = new Date();
        var difference = departureDate.getTime() - currentDate.getTime();
        var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        if (this.parameters.SITE_MCI_ACPTNC_TIME != "" || this.parameters.SITE_MCI_ACPTNC_TIME != null) {
          if (parseInt(this.parameters.SITE_MCI_ACPTNC_TIME) > 0) {
            if (hoursDifference <= parseInt(this.parameters.SITE_MCI_ACPTNC_TIME) && hoursDifference > 2) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    },

    // Function is used to build the journeys and passengers eligible for checkin
    buildJourney: function() {
      this.$logInfo('SelectFlightsScript::Entering buildJourney function');
      var cpr = this.moduleCtrl.getCPR();
      var productLevel = cpr.customerLevel[0].productLevelBean;
      var customerLevel = cpr.customerLevel;
      var totalCustomer = cpr.customerLevel.length;
      var totalLeg = 0;
      var journey = [];
      var continuation = false;
      var journeyPax = 0;
      var journeyPaxCk = 0;
      for (var i = 0; i < productLevel.length; i++) {
        if (this.isFlightEligible(productLevel[i], i)) {
          var ckPax = [];
          var allPax = false;
          var onward = null;
          var checkedinPax = 0;
          var pib = productLevel[i].productIdentifiersBean;
          for (var j = 0; j < pib.length; j++) {
            if (pib[j].referenceQualifier == "OID") {
              var onward = pib[j].primeId;
            }
          }
          for (var a = 0; a < customerLevel.length; a++) {
            var legLevel = cpr.customerLevel[a].productLevelBean[i].legLevelBean;
            totalLeg = cpr.customerLevel[a].productLevelBean[i].legLevelBean.length;
            for (var b = 0; b < legLevel.length; b++) {
              var legStatus = legLevel[b].legLevelIndicatorBean;
              for (var c = 0; c < legStatus.length; c++) {
                if (legStatus[c].indicator == "CAC" || legStatus[c].indicator == "CST") {
                  if (legStatus[c].action == "1") {
                    checkedinPax = checkedinPax + 1;
                    ckPax.push(a);
                  }
                }
              }
            }
          }
          journeyPax = journeyPax + (totalCustomer * totalLeg);
          journeyPaxCk = journeyPaxCk + checkedinPax;
          if (checkedinPax == totalCustomer * totalLeg) {
            allPax = true;
          }
          // Pushing the journeys and passengers eligible into journey map
          if (onward != null || continuation) {
            journey.push({
              "product": i,
              "ckPax": ckPax,
              "allPax": allPax
            });
            continuation = true;
            if (onward != null) {
              continue;
            } else {
              if (journeyPax == journeyPaxCk) {
                journey = [];
                continue;
              } else {
                break;
              }
            }
          } else {
            journey.push({
              "product": i,
              "ckPax": ckPax
            });
            if (journeyPax == journeyPaxCk) {
              journey = [];
              continue;
            } else {
              break;
            }
          }
        }
      }
      return journey;
    },

    /** This function is used to display the products and based on their eligibility,
     *  they are enabled or disabled
     */
    displayRoutes: function() {
      this.$logInfo('SelectFlightsScript::Entering displayRoutes function');
      var _this = this;
      var cpr = this.moduleCtrl.getCPR();
      var productLevel = cpr.customerLevel[0].productLevelBean;
      var journey = this.buildJourney();
      var html = '';
      var all = '';
      var ts = 0;
      if (journey.length > 0) {
        for (var i = 0; i < journey.length; i++) {
          if (i < journey.length - 1) {
            all = all + journey[i].product + "_";
          } else if (i == journey.length - 1) {
            all = all + journey[i].product;
          }
        }
        for (var i = 0; i < journey.length; i++) {
          var segment = journey[i];
          var prod = segment.product;
          var ckPax = segment.ckPax;
          var allPax = segment.allPax;
          if (allPax) {
            ts = ts + 1;
            continue;
          }
          // based on the eligibility the passengers are selected to checkin
          if (ckPax.length == 0) {
            if (journey.length == 1) {
              html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
            } else {
              if (journey.length - ts == 1) {
                html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
              } else {
                html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + all + "\"></li>&nbsp;<li class=\"displayInline strong\">All</li>&nbsp;&nbsp;&nbsp;<li class=\"displayInline\"><input type=\"radio\" class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
              }
            }
            break;
          } else {
            for (var a = 0; a < ckPax.length; a++) {
              jQuery('#custSelection input[id=cust_' + ckPax[a] + ']').attr('disabled', 'disabled');
              jQuery('#custSelection input[id=cust_' + ckPax[a] + ']').prop('checked',false);
              for (var b = 0; b < journey.length; b++) {
                if (prod != journey[b].product) {
                  var id = "prod" + journey[b].product + "-pax" + ckPax[a];
                  if (jQuery('input[id=' + id + ']').length > 0) {
                    jQuery('input[id=' + id + ']').prop('checked',false);
                    if (!jQuery.isUndefined(jQuery('input[id=' + id + ']').attr('infant'))) {
                      _this.selectInfant(journey[b].product, ckPax[a]);
                    }
                  }
                }
              }
            }
            if (journey.length == 1) {
              html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
            } else {
              if (journey.length - ts == 1) {
                html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
              } else {
                html = html + "<ul class=\"padTop padBottom padleftFlightAlign\"><li class=\"displayInline\"><input type=\"radio\" checked class=\"checkbig\" name=\"route\" value=\"" + all + "\"></li>&nbsp;<li class=\"displayInline strong\">All</li>&nbsp;&nbsp;&nbsp;<li class=\"displayInline\"><input type=\"radio\" class=\"checkbig\" name=\"route\" value=\"" + prod + "\"></li>&nbsp;<li class=\"displayInline strong\">" + productLevel[prod].operatingFlightDetailsBoardPoint + "-" + productLevel[prod].operatingFlightDetailsOffPoint + "</li></ul>";
              }
            }
            break;
          }
        }
        if (html != '') {
          jQuery('#routeSelection div div').html(html);
        } else {
          jQuery('#custSelection').hide();
          jQuery('#routeSelection').hide();
        }
      } else {
        jQuery('#custSelection').hide();
        jQuery('#routeSelection').hide();
      }
    },

    // This function is used to autoselect the passengers for checkin in the products eligible
    flightSelection: function(evt, args) {
      this.$logInfo('SelectFlightsScript::Entering flightSelection function');
      var _this = this;
      var srcId = "cust_" + args.cust;
      buttonRef = jQuery('#SlctFlgtsCont');
      checkBoxPax = $('div[data-layout="NoNeedToCheckPax"] ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
      checkBoxFlight = $('div ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
      checkBoxDAG = $('ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
      //this.checkSeqSelection() ;

      /*For stop over suppresser*/
      this.checkstopover(jQuery(currentElementRef));
      /*End For stop over suppresser*/

      checkIfenableNavigation(buttonRef);

    },

    checkstopover: function(BaseElement) {

      if (jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").attr("data-stopover") == "false") {
        if (BaseElement.is(":checked")) {
          if (!jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").is(":checked")) {
            jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").trigger("click");
            jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").parent().addClass("is-checked");
          }
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").attr("disabled", "disabled");
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").attr("data-remvoedisabled", "");
          this.checkstopover(jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']"));
        } else {
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").prop("checked",false);
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").removeAttr("disabled");
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").removeAttr("data-remvoedisabled");
          jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']").parent().removeClass("is-checked");
          this.checkstopover(jQuery("#section4").find("[name='" + (parseInt(BaseElement.attr("name")) + 1) + "']"));
        }
      }

    },

    //    dgrGoodsCheck : function(evt){
    //      this.$logInfo('SelectFlightsScript::Entering dgrGoodsCheck function');
    //      checkBoxPax = $('div[data-layout="NoNeedToCheckPax"] ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
    //      checkBoxFlight = $('div ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
    //      checkBoxDAG = $('ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
    //      buttonRef = jQuery('#SlctFlgtsCont') ;
    //      checkIfenableNavigation(buttonRef) ;
    //      return false;
    //    },

    validateSeqSelection: function(errors) {
      this.$logInfo('CPRIdentificationSinglePaxScript::Entering validateSeqSelection function');
      var _this = this;

      for(var i=0;i<checkBoxFlight.length;i++)
      {
    	  if (!jQuery(checkBoxFlight[i]).is(':checked') && jQuery(checkBoxFlight[i]).attr('data-allPaxCheckedInSegment') == "false")
    	  {
    		  if (jQuery(checkBoxFlight[i+1]).length > 0 && jQuery(checkBoxFlight[i+1]).is(':checked')) {
                  errors.push({
                    "localizedMessage": _this.label.DisCheckin
                  });
                }
    	  }
      }

      /*checkBoxFlight.each(function(itr) {
        var nextSegment = null;
        if (!jQuery(this).is(':checked') && !jQuery(this).is(':disabled')) {
          nextSegment = checkBoxFlight.eq(itr + 1);
          if ($(nextSegment).length != 0) {
            if ($(nextSegment).is(':checked')) {
              errors.push({
                "localizedMessage": _this.label.DisCheckin
              });
            }
          }
        }
      });*/
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
    },


    checkSeqSelection: function() {
      this.$logInfo('SelectFlightsScript::Entering checkSeqSelection function');
      var prevSegChkBox = null;
      checkBoxFlight.each(function(index, item) {
        if (jQuery(this).is(':checked') || jQuery(this).is(':disabled')) {

        } else {
          if (prevSegChkBox == null) {
            jQuery(this).prop('checked', true);
            jQuery(this).parent().addClass("is-checked");
          } else {
            if (prevSegChkBox.is(':checked')) {
              jQuery(prevSegChkBox).prop('checked',false);
            }
          }
        }
        prevSegChkBox = this;
      });
    },

    // Function is used to select or deselect the products based on their eligibility
    routeSelection: function() {
      this.$logInfo('SelectFlightsScript::Entering routeSelection function');
      var _this = this;
      jQuery(document).on('click','input[type=radio]', function() {
        var prod = jQuery(this).val();
        if (prod.indexOf('_') > -1) {
          prodId = prod.split('_');
        } else {
          prodId = prod;
        }
        jQuery('input[id^=cust]').each(function() {
          if (jQuery(this).is(':checked')) {
            var custId = jQuery(this).attr('id');
            var cust = custId.split('_');
            if (typeof prodId == "string") {
              jQuery('input[id*=-pax' + cust[1] + ']').each(function() {
                if (jQuery(this).attr('name') != prodId) {
                  jQuery(this).prop('checked',false);
                  if (!jQuery.isUndefined(jQuery(this).attr('infant'))) {
                    _this.selectInfant(prodId, cust[1]);
                  }
                }
              });
            } else {
              for (var i = 0; i < prodId.length; i++) {
                destId = "prod" + prodId[i] + "-pax" + cust[1];
                jQuery('input[id=' + destId + ']').prop('checked', true);
                if (!jQuery.isUndefined(jQuery(this).attr('infant'))) {
                  _this.selectInfant(prodId[i], cust[1]);
                }
              }
            }
          }
        });
      });
    },


    __getPage: function() {
      try {
        this.$logInfo('SelectFlightsScript::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in __getPage function',
          exception);
      }
    },

    // This function prevents all the default actions
    doNothing: function(evt) {
      this.$logInfo('SelectFlightsScript::Entering doNothing function');
      evt.preventDefault();
      return;
    },

    // This function is used to select the infant asociated with the selected passenger
    selectInfant: function(product, infant) {
      try {
        this.$logInfo('SelectFlightsScript::Entering selectInfant function');

        var form = jQuery("form", this.__getPage());
        var sourceId = "prod" + product + "-pax" + infant;
        var destId = "pax" + infant + "-prod" + product;
        if (jQuery('input[id=' + sourceId + ']', form).is(':checked')) {
          jQuery('input[id=' + destId + ']', form).prop('checked', true);
        } else {
          jQuery('input[id=' + destId + ']', form).prop('checked',false);
        }
      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in selectInfant function',
          exception);
      }
    },

    // This function checks whether the passenger is eligible for checkin or not
    isEligible: function(product) {
      this.$logInfo('SelectFlightsScript::Entering isEligible function');
      var cpr = this.moduleCtrl.getCPR();
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
    },


    // This function is called onclick of continue and submits request
    onContinue: function(evt) {
      try {
        this.$logInfo('SelectFlightsScript::Entering onContinue function');
        // We prevent the form to be submitted
        evt.preventDefault();
        // We show the reset password form
        jQuery("#cprErrorsSelectFlight").disposeTemplate();
        var cpr = this.moduleCtrl.getCPR();
        var form = jQuery("#MSelectFlights_A");
        /*For stop over suppressor*/
        jQuery("#section4").find("[data-remvoedisabled]").removeAttr("disabled");
        var cprInput = form.serializeObject();
        jQuery("#section4").find("[data-remvoedisabled]").attr("disabled", "disabled");
        /*End For stop over suppressor*/

        var isEmpty = true;
        var errors = [];
        var selection = [];
        var childCount = 0;
        var adultCount = 0;
        // push the selected products and passengers into selection map
        var customerSel = this.moduleCtrl.getSelectedPax();
        /*var customerSelArray = new Array() ;
    for(var cust in customerSel){
      customerSelArray.push(customerSel[cust].customer) ;
    }*/
        for (var key in cprInput) {
          isEmpty = false;
          var sortedCPRInput = cprInput[key];
          if (cprInput[key].length > 1) {
            cprInput[key] = eval(cprInput[key]);
            sortedCPRInput = cprInput[key].sort();
          }
          selection.push({
            "product": key,
            "customer": sortedCPRInput
          });
        }

        this.validateSeqSelection(errors);
        // display if there are any errors
        if (errors != null && errors.length > 0) {
          this.moduleCtrl.displayErrors(errors, "cprErrorsSelectFlight", "error");
          return null;
        }

        if (isEmpty) {
          errors.push({
            "localizedMessage": this.uiErrors[21400067].localizedMessage,
            "code": this.uiErrors[21400067].errorid
          });
          this.moduleCtrl.displayErrors(errors, "cprErrorsSelectFlight", "error");
        } else {
          this.moduleCtrl.setSelectedPax(selection);
          var count = 0;
          var natReq = false;
          var seatselection = [];
          for (var k in cprInput) {
            var cust = cprInput[k];
            for (var i = 0; i < cust.length; i++) {

              // chk if there are any regulatory documents for passengers
              if (!cpr.customerLevel[cust[i]].productLevelBean[k].regulatoryDocumentDetailsBean) {
                count = count + 1;
              }

              var indicators = cpr.customerLevel[cust[i]].productLevelBean[k].productLevelIndicatorsBean;
              var primeId = cpr.customerLevel[cust[i]].productLevelBean[k].productIdentifiersBean[0].primeId;
              var referenceQualifier = cpr.customerLevel[cust[i]].productLevelBean[k].productIdentifiersBean[0].referenceQualifier;

              // push seat for selected passenger to saetselection map if any
              if (!cpr.customerLevel[cust[i]].productLevelBean[k].legLevelBean[0].seatBean) {
                if (cpr.customerLevel[cust[i]].customerDetailsType != "IN") {
                  seatselection.push({
                    "primeId": primeId,
                    "refQualifier": referenceQualifier,
                    "seat": "Not Added"
                  });
                }

              }

              // chk whether nationality is required or not
              for (var j = 0; j < indicators.length; j++) {
                if (indicators[j].attribute == "NRA") {
                  natReq = true;
                }
              }
            }
          }
          // If there are no seats allocated, then preallocate
          var preallocateInput = {
            "seatselection": seatselection
          }
          this.moduleCtrl.setSelectedPaxPrimeRef(preallocateInput);
          // If natioanlity is required, thn show nationalityPrompt
          if (natReq) {
            if (count > 0) {
              //this.showOverlay(true);
              modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
              this.moduleCtrl.nationalityPrompt();
            } else {
              //this.showOverlay(true);
              modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
              this.moduleCtrl.checkRegulatory();
            }
          } // If natioanlity is not required, thn show acceptance overview
          else {
            //this.showOverlay(true);
            modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
            /*if(seatselection && seatselection.length > 0) {
              this.moduleCtrl.preallocateSeat(preallocateInput);
            }else{*/
            this.moduleCtrl.acceptanceOverview_load();
            //}
          }
        }
      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in onContinue function',
          exception);
      }
    },

    // This function is called on clickof managecheckin, to show the boarding passes or to cancel the checkin
    onBpLinkClick: function(evt, args) {
      try {
        this.$logInfo('SelectFlightsScript::Entering onBpLinkClick function');
        var _this = this;
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        var flow = args.flow;
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
                if (indicators[j].indicator == "CAC" && indicators[j].action == "1") {
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
              "product": k,
              "customer": customer
            });
          }
        }
        _this.moduleCtrl.setSelectedPax(custReqArray);
        _this.moduleCtrl.setFlowType(flow);
        _this.moduleCtrl.setAcceptedCPR();
        _this.moduleCtrl.acceptanceConfirmation_load();

      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in onBpLinkClick function',
          exception);
      }
    },
    /**
     * checkSegmentEnable : Check if a particular segment is eligible to be displayed.(Rules Implementation)
     */
    checkSegmentEnable: function(productView) {
      try {
        this.$logInfo('SelectFlightsScript::Entering checkSegmentEnable function');
        return this.moduleCtrl.checkSegmentEnabled(productView);
      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in checkSegmentEnable function',
          exception);
      }

    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('SelectFlightsScript::Entering onModuleEvent function');
        switch (evt.name) {
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": this.uiErrors[21400069].localizedMessage,
              "code": this.uiErrors[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "cprErrorsSelectFlight", "error");
            break;
        }
      } catch (exception) {
        this.$logError(
          'SelectFlightsScript::An error occured in onModuleEvent function',
          exception);
      }
    },
    isPaxEligible: function(cust, product) {
      this.$logInfo('SelectFlightsScript::Entering isPaxEligible function');
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
      this.$logInfo('SelectFlightsScript::Entering isPaxInfEligible function');
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

    onBackClick: function() {
      this.moduleCtrl.onBackClick();
    }
  }
});