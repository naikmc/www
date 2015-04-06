Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.AcceptanceOverViewScript',

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
      try {
        this.$logInfo('AcceptanceOverViewScript: Entering dataReady function ');
        var pageData = this.moduleCtrl.getModuleData().checkIn;

        if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
          pageData = jsonResponse.data.checkIn;
        }
        this.label = pageData.MAcceptanceOverview_A.labels;
        this.data.labelDetails=this.label.EmergencyExitPrompt.label;
        this.parameters = pageData.MAcceptanceOverview_A.parameters;
        this.siteParams = pageData.MAcceptanceOverview_A.siteParam;
        this.rqstParams = pageData.MAcceptanceOverview_A.requestParam;
        this.errorStrings = pageData.MAcceptanceOverview_A.errorStrings;
        this.uiErrors = this.errorStrings;

        this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, true);

      } catch (_ex) {
        this.$logError('AcceptanceConfirmationScript: an error has occured in dataReady function');
      }
    },


    $viewReady: function() {
      // We initialize UI elements
      // this.onFQTVClick();
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering Viewready function');

        /* To load edit CPR from Acceptance overview */
        //sessionStorage.editCPRFromOverview=1;
        this.moduleCtrl.setEditCPRFromOverview(1);

        jQuery(document).scrollTop("0");
        jQuery('#serviceoverlayCKIN').html("");
        jQuery('#serviceoverlayCKIN').hide();
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();

        this.moduleCtrl.resetExitRowListPopupShow();

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
            GTMPage: 'Trip summary'
          });

        }

        /*GOOGLE ANALYTICS
         * */

        //FOR PAGE
        /*if(this.parameters.SITE_MCI_GA_ENABLE)
     {
        ga('send', 'pageview', {'page': 'Trip summary','title': 'Your Trip summary'});
    }*/



        this.moduleCtrl.setWarnings("");
        this.moduleCtrl.setSuccess("");


        /*
         * For loading DGRS screen
         * */
        document.getElementById("loadDRGScreen").addEventListener("click",function(){
        	this.loadDRGScreen();
        	}.bind(this)
        );


      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in Viewready function',
          exception);
      }
    },

    $displayReady: function() {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering displayReady function');
        if (navigator.userAgent.search(/Android 2./ig) != -1) {
          /*  $('.breadcrumbs').addClass("breadcrumbsForS2"); */

        }

      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in displayReady function',
          exception);
      }


    },

    __getPage: function() {
      try {
        this.$logInfo('AcceptanceOverview::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
          'AcceptanceOverviewScript::An error occured in __getPage function',
          exception);
      }
    },

    showRegulatoryPage: function() {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering showRegulatoryPage function');
        this.$load("checkin/EditCPR");
        //this.moduleCtrl.checkRegulatory();
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in showRegulatoryPage function',
          exception);
      }
    },

    // Function called when fqtv section is clicked, it expands and collapses based on the clicks
    onFQTVClick: function(evt) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering onFQTVClick function');
        var _this = this;
        jQuery("a.toggleIconCustomCKIN").click(function(evt) {
          // We prevent the form to be submitted
          evt.preventDefault();
          var item = jQuery(this).attr("item");
          jQuery("a.toggleIconCustomCKIN").each(function() {
            if (item != jQuery(this).attr("item")) {
              jQuery(this).removeClass('toggleIconOffCustomCKIN');
              jQuery(this).parents(".toggleOuterCustom").find(".lHeightCKIN").removeClass('lHeightCKINtranslate');
            }
          });

          jQuery(this).parents(".toggleOuterCustom").find(".lHeightCKIN").toggleClass('lHeightCKINtranslate');
          return false;
        });

        jQuery('a.toggleIconCustomCKIN').click(function() {
          jQuery(this).toggleClass('toggleIconOffCustomCKIN');
          var item = jQuery(this).attr("item");
          _this.$refresh({
            filterSection: item
          })
          jQuery(this).parents(".toggleOuterCustom").find(".lHeightCKIN").find("input").toggleClass("displayNone");
        });
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in onFQTVClick function',
          exception);
      }
    },

    viewInfoCurCust: function(evt, args) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering viewInfoCurCust function');
        this.moduleCtrl.setCurrentCustomer(args.currentcust);
        this.moduleCtrl.loadEditCpr();
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in viewInfoCurCust function',
          exception);
      }
    },

    // Function called on initiate acceptance continue click for acceptance of checkin
    onContinue: function(evt) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering onContinue function');
        $('button.validation.disabled').click(function() {
          return null;
        });

        /*Checking for at least one adult in PNR to checkin*/
        var cpr = this.moduleCtrl.getCPR();
        var editCPR = this.moduleCtrl.getEditCPR();
        var adultCount = 0;

        /******** For checking atlease onepax checked in *******************/
        for (var cl = 0; cl < cpr.customerLevel.length; cl++) {
          for (var pl = 0; pl < cpr.customerLevel[cl].productLevelBean.length; pl++) {

            if (cpr.customerLevel[cl].customerDetailsType == "A") {
              if (this.parameters.SITE_MCI_OP_AIRLINE.toUpperCase().search("SQ") != "-1" && cpr.customerLevel[cl].productLevelBean[pl].servicesBean) {
                var item = cpr.customerLevel[cl].productLevelBean[pl].servicesBean;
                var count = 0;
                for (service in item) {

                  if (this.parameters.SITE_MCI_SSR_CANT_CI_ALON.toUpperCase().search(item[service].specialRequirementsInfoBean.ssrCode) != "-1") {
                    count = 1;
                  }
                }
                if (this.isPaxCheckedIn(pl, cpr.customerLevel[cl].uniqueCustomerIdBean.primeId) && count == 0) {
                  adultCount += 1;
                }

              } else {

                if (this.isPaxCheckedIn(pl, cpr.customerLevel[cl].uniqueCustomerIdBean.primeId)) {
                  adultCount += 1;
                }

              }


            }


          }
        }

        var selectpaxforprimeid = this.moduleCtrl.getSelectedPax();
        for (var customer = 0; customer < selectpaxforprimeid[0]["customer"].length; customer++) {

          /*Update DOB to latest*/
          if (editCPR != null) {
            for (var custo in editCPR.customerLevel) {
              if (editCPR.customerLevel[custo].uniqueCustomerIdBean.primeId == cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].uniqueCustomerIdBean.primeId) {
                if (editCPR.customerLevel[custo].dateOfBirthBean) {
                  if (!cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].dateOfBirthBean) {
                    cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].dateOfBirthBean = {};
                  }

                } else {
                  continue;
                }
                cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].dateOfBirthBean = editCPR.customerLevel[custo].dateOfBirthBean;
              }

            }

          }

          if (cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].customerDetailsType == "A") {

            if (cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].dateOfBirthBean) {
              var item = cpr.customerLevel[selectpaxforprimeid[0]["customer"][customer]].dateOfBirthBean;

              var month = new Array();
              month[0] = "Jan";
              month[1] = "Feb";
              month[2] = "Mar";
              month[3] = "Apr";
              month[4] = "May";
              month[5] = "Jun";
              month[6] = "Jul";
              month[7] = "Aug";
              month[8] = "Sep";
              month[9] = "Oct";
              month[10] = "Nov";
              month[11] = "Dec";
              var svtime = this.moduleCtrl.getsvTime();
              var svtm = svtime.split(' ');
              var mnt = 0;
              var timestamp = svtm[4].split(':')
              for (var ii = 0; ii < month.length; ii++) {
                if (month[ii] == svtm[2]) {
                  mnt = ii;
                }
              }
              var dCurr = new Date(svtm[3], mnt, svtm[1]);

              var DOB = new Date(item.year, parseInt(item.month) - 1, item.day);
              var years = 0;
              if (item.year < dCurr.getFullYear()) {
                if (parseInt(item.month) - 1 <= dCurr.getMonth()) {
                  if (parseInt(item.month) - 1 == dCurr.getMonth()) {
                    if (item.day <= dCurr.getDate()) {
                      years = dCurr.getFullYear() - item.year;
                    } else {
                      years = dCurr.getFullYear() - item.year - 1;
                    }
                  } else {
                    years = dCurr.getFullYear() - item.year;
                  }
                } else {
                  years = dCurr.getFullYear() - item.year - 1;
                }
              } else {
                years = 0;
              }

              if (years >= 17) {
                adultCount = adultCount + 1;
              }

            } else {
              adultCount = adultCount + 1;
            }
          }

        }
        var errors = [];

        if (adultCount == 0) {
          errors.push({
            "localizedMessage": this.uiErrors[25000037].localizedMessage,
            "code": this.uiErrors[25000037].errorid
          });
        }

        var _this = this;

        var flow = "checkIn"
          // We prevent default behaviour
        evt.preventDefault();


        //turn the background off
        jQuery(document).scrollTop("0");
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        // we get the form
        var promptAnswersHc = [{
          "action": "BSQ",
          "answer": "N"
        }];
        var emailsList = this.moduleCtrl.getEmailList();
        var initiateAcceptInput = {
            "selectedCPR": _this.moduleCtrl.getSelectedPax(),
            "promptAnswers": promptAnswersHc,
            "emailList": emailsList
          }
          /* Inhibit the pax if Customer Screening status is failed,filtering the selected pax information */
          //initiateAcceptInput.selectedCPR = _this.checkCSSAndFilterSelectedPAX(_this,initiateAcceptInput) ;
          /* Inhibit the pax if Star ADC is failed, filtering the selected pax information. */
          //initiateAcceptInput.selectedCPR = _this.checkADCAndFilterSelectedPAX(_this,initiateAcceptInput) ;
        _this.moduleCtrl.setFlowType(flow);
        //we call the controller to retrive
        if (initiateAcceptInput.selectedCPR.length == 0) {
          errors.push({
            "localizedMessage": this.uiErrors[213001075].localizedMessage,
            "code": this.uiErrors[213001075].errorid
          });
        }
        if (errors != null && errors.length > 0) {
          _this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          jQuery('input').blur();
          return null;
        }
        _this.moduleCtrl.initiateAccept(initiateAcceptInput);

      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in onContinue function',
          exception);
      }
    },

    /**
     * isPaxCheckedIn : Checking whether pax checked or not for a product level.
     */
    isPaxCheckedIn: function(product_index, primeId) {

      var chkdin = false;
      try {
        this.$logInfo('AcceptanceConfirmationScript::Entering isPaxCheckedIn function');
        var cpr = this.moduleCtrl.getCPR();
        for (var l = 0; l < cpr.customerLevel.length; l++) {
          if (cpr.customerLevel[l].uniqueCustomerIdBean.primeId == primeId) {
            var legArray = cpr.customerLevel[l].productLevelBean[product_index].legLevelBean;
            for (var m = 0; m < legArray.length; m++) {
              var indicators = legArray[m].legLevelIndicatorBean;
              for (var j = 0; j < indicators.length; j++) {
                if (indicators[j].indicator == "CAC" || indicators[j].indicator == "CST") {
                  chkdin = true;
                }
              }
            }
          }
        }
      } catch (exception) {
        this.$logError(
          'AcceptanceConfirmationScript::An error occured in isPaxCheckedIn function',
          exception);
      }
      return chkdin;
    },

    // Function called when fqtv number is saved
    fqtvEditCPR: function(evt, args) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering fqtvEditCPR function');
        var _this = this;
        jQuery("#initiateandEditErrors").disposeTemplate();
        jQuery('input').blur();
        jQuery(document).scrollTop("0");
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        // we get the form
        var fname = "PROD_NUMBER_" + args.product + "_" + args.customer;
        var aname = "airline_" + args.product + "_" + args.customer;
        var editForm = jQuery(_this.__getPage());
        var errors = [];

        // validate the form for errors if any
        editForm.check(errors, true);

        if (errors != null && errors.length > 0) {
          _this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          jQuery('input').blur();
          return null;
        }
        var fqtvNumber = jQuery("input[name=" + fname + "]", editForm).val();
        var airlineCode = jQuery("select[name=" + aname + "]", editForm).val();

        // chk whether fqtv number is validated against the format using site parameter
        if (this.parameters.SITE_MCI_VALIDATE_FQTV != "") {
          if (this.moduleCtrl.booleanValue(this.parameters.SITE_MCI_VALIDATE_FQTV)) {
            var fqtvTemp = fqtvNumber.slice(0, 2);
            var fqtvUpdt = fqtvNumber.slice(2);
            if (fqtvTemp.toUpperCase() == airlineCode) {
              fqtvNumber = fqtvUpdt;
            }
          }
        }

        var editFqtvInput = {
            "indicator": "DFF",
            "selectedCPR": _this.moduleCtrl.getSelectedPax(),
            "airline": airlineCode,
            "fqtvNumber": fqtvNumber,
            "product": args.product,
            "customer": args.customer
          }
          //we call the controller to retrive
        _this.moduleCtrl.editFqtv(editFqtvInput);

      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in fqtvEditCPR function',
          exception);
      }
    },

    // Function called when change seat is clicked
    onSeatMapClick: function(evt, args) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering onSeatMapClick function');
        var _this = this;
        jQuery("#initiateandEditErrors").disposeTemplate();
        jQuery(document).scrollTop("0");
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        var errors = [];
        var cust = [];
        var repeat = false;

        /***********Change selectedcpr according to acceptance conformation pax details*********/
        if (_this.moduleCtrl.getAcceptedValueForSeat() && _this.moduleCtrl.getAcceptedValueForSeat().length > 0) {
          _this.moduleCtrl.setSelectedPax(_this.moduleCtrl.getAcceptedValueForSeat());
        } else if (_this.moduleCtrl.getAcceptedCprValidApp() && _this.moduleCtrl.getAcceptedCprValidApp().length > 0) {
          _this.moduleCtrl.setSelectedPax(_this.moduleCtrl.getAcceptedCprValidApp());
        }

        var selectedPax = _this.moduleCtrl.getSelectedPax();
        _this.moduleCtrl.setSeatMapResponseEmpty();
        if (selectedPax && selectedPax.length > 0) {
          var i = 0;
          // for(var i=0; selectedPax[0].customer && i<selectedPax[0].customer.length; i++){
          var selectedCPRList = [];
          var cpr = _this.moduleCtrl.getCPR();
          for (; cpr.customerLevel[selectedPax[0].customer[i]].customerDetailsType == "IN"; i++) {

          }

          var infantPrimeId;
          for (var jjj in cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean) {
            if (cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean[jjj].referenceQualifier == "JID") {
              infantPrimeId = cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean[jjj].primeId;

            }
          }

          if (infantPrimeId >= 0) {
            for (var jjj in cpr.customerLevel) {
              for (var kkk in cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean) {
                if (cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean[kkk].primeId == infantPrimeId) {
                  infantPrimeId = parseInt(jjj);

                }
              }


            }

          }

          cust[0] = selectedPax[0].customer[i];
          if (infantPrimeId >= 0) {

            var custWithInfant = [cust[0], infantPrimeId];
          } else {
            var custWithInfant = [cust[0]];
          }
          prod = selectedPax[0].product;
          selectedCPRList.push({
            "product": prod,
            "customer": custWithInfant
          });
          var seatMapInput = {
            "selectedCPR": selectedCPRList,
            "seatMapProdIndex": args.product,
            "seat": args.seat,
            "repeat": repeat,
            "i": i
          }
          _this.moduleCtrl.setSelectedProductForSeatMap(seatMapInput);
          //we call the controller to retrive
          _this.moduleCtrl.changeSeat(seatMapInput);
          //repeat = true;
          //}
        }
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in onSeatMapClick function',
          exception);
      }
    },

    //Function called when any event is raised
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering onModuleEvent function');
        switch (evt.name) {
          //event raised in case of fqtv number update
          case "fqtv.updated.loaded":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#splashScreen').hide();
            jQuery('#overlayCKIN').hide();
            jQuery("a.toggleIconCustomCKIN").removeClass('toggleIconOffCustomCKIN');
            jQuery("a.toggleIconCustomCKIN").parents(".toggleOuterCustom").find(".lHeightCKIN").removeClass('lHeightCKINtranslate');
            this.$refresh({
              filterSection: "Section_" + evt.args.customer + "_" + evt.args.product
            })
            break;
            //event raised in case of seat number update
          case "seat.updated.loaded":
            for (var i = 0; i < evt.args.seatselection.length; i++) {
              this.$refresh({
                filterSection: "Section_" + evt.args.seatselection[i].customer + "_" + evt.args.seatMapProdIndex + "_seat"
              })
            }
            break;

          case "page.refresh":
            this.$refresh({
              filterSection: "continueButtonSec"
            })
            break;
            //event raised in case of server error
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": this.uiErrors[21400069].localizedMessage,
              "code": this.uiErrors[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
            break;
        }
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in onModuleEvent function',
          exception);
      }
    },

    /* function to check the customer screening status and filter out the selected CPR details. */
    checkCSSAndFilterSelectedPAX: function(_this, initiateAcceptInput) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering checkCSSAndFilterSelectedPAX function');
        if (_this.moduleCtrl.getCPR() != null) {
          var cprData = _this.moduleCtrl.getCPR();
          for (var i = 0; i < cprData.customerLevel.length; i++) {
            if (!cprData.customerLevel[i].cssEligibility) {
              for (var selCpr = 0; selCpr < initiateAcceptInput.selectedCPR.length; selCpr++) {
                if (initiateAcceptInput.selectedCPR[selCpr].customer == i) {
                  initiateAcceptInput.selectedCPR.splice(i, 1);
                }
              }
            }
          }
        }
        return initiateAcceptInput.selectedCPR;
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in checkCSSAndFilterSelectedPAX function',
          exception);
      }
    },

    /* function to check the Auto Doc and filter out the selected CPR details. */
    checkADCAndFilterSelectedPAX: function(_this, initiateAcceptInput) {
      try {
        this.$logInfo('AcceptanceOverViewScript::Entering checkADCAndFilterSelectedPAX function');
        if (_this.moduleCtrl.getEditCPR() != null) {
          var editCprData = _this.moduleCtrl.getEditCPR();
          for (var i = 0; i < editCprData.customerLevel.length; i++) {
            if (!editCprData.customerLevel[i].cssEligibility) {
              for (var selCpr = 0; selCpr < initiateAcceptInput.selectedCPR.length; selCpr++) {
                if (initiateAcceptInput.selectedCPR[selCpr].customer == i) {
                  initiateAcceptInput.selectedCPR.splice(i, 1);
                }
              }
            }
          }
        } else if (_this.moduleCtrl.getCPR() != null) {
          var cprData = _this.moduleCtrl.getCPR();
          for (var i = 0; i < cprData.customerLevel.length; i++) {
            if (!cprData.customerLevel[i].cssEligibility) {
              for (var selCpr = 0; selCpr < initiateAcceptInput.selectedCPR.length; selCpr++) {
                if (initiateAcceptInput.selectedCPR[selCpr].customer == i) {
                  initiateAcceptInput.selectedCPR.splice(i, 1);
                }
              }
            }
          }
        }
        return initiateAcceptInput.selectedCPR;
      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in checkADCAndFilterSelectedPAX function',
          exception);
      }
    },

    dgrGoodsCheck: function(evt) {
      this.$logInfo('CPRIdentificationSinglePaxScript::Entering dgrGoodsCheck function');
      checkBoxDAG = $('ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');
      buttonRef = jQuery('#tripSummaryContinue');
      var anyPaxActive = this.moduleCtrl.getIsAnyValidAppPax() && !(this.moduleCtrl.getBlackListOverBooked());
      checkIfenableNavigationDgrGoods(buttonRef, checkBoxDAG, anyPaxActive);
      return false;
    },

    loadDRGScreen: function(evt, args) {
      this.$logInfo('CPRIdentificationSinglePaxScript::Entering loadDRGScreen function');
      this.moduleCtrl.dangerousGoods_load();
    },

    onBackClick: function() {
      this.moduleCtrl.onBackClick();
    }
  }
});