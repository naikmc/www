Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.NationalityNewScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA',
    'modules.view.merci.common.utils.MCommonScript'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype: {

    $viewReady: function() {

      MC.appCtrl.logInfo('Nationality::Entering Viewready function');

      /* To load edit CPR from Acceptance overview */
      //sessionStorage.editCPRFromOverview=0;
      this.moduleCtrl.setEditCPRFromOverview(0);

      var __this = this;
      //For properly display header select pax of nationality screen

      /*****For remove curosal effect for one pax********/
      var sizeOfPax = jQuery('[data-layout="checkin/Nationality"] #mycarousel').find("li").length;
      if (sizeOfPax > 1) {
        sizeOfPax = "<div></div>";
      } else {
        sizeOfPax = null;

      }

      jQuery("body").css("overflow-y", "hidden");

      //setTimeout(function(){
      jQuery('[data-layout="checkin/Nationality"] #mycarousel').jcarousel({
        scroll: 1,
        buttonNextHTML: sizeOfPax,
        buttonPrevHTML: sizeOfPax,
        visible: 1,
        itemVisibleInCallback: {
          onAfterAnimation: function(carousel, item, idx, state) {

            var totalCustomers = jQuery(".nationality").length;

            jQuery("#rightArrow").html(totalCustomers - parseInt(idx));
            jQuery("#leftArrow").html(-1 + parseInt(idx));

            jQuery(".nationality").css("display", "none");
            jQuery(".nationality").eq(idx - 1).css("display", "block");

            jQuery("body").css("overflow-y", "");

          }
        }
      });

      //},400);
      /*****For remove curosal pax div margin and pax********/
      if (sizeOfPax == null) {
        jQuery('[data-layout="checkin/Nationality"] #wrap').children("div").css("margin", "0");
        jQuery('[data-layout="checkin/Nationality"] #wrap').children("div").next().remove();
        jQuery('[data-layout="checkin/Nationality"] #wrap').children("div").next().remove();
      }


      var countryList = this.moduleCtrl.getCPR().countryList[1];
      var countryListJson = "";

      for (var i in countryList) {
        for (var j in countryList[i]) {
          countryListJson += "{\"label\":\"" + countryList[i][j][1] + "\",\"value\":\"" + countryList[i][j][0] + "\"},";
        }
      }

      countryListJson = countryListJson.substr(0, countryListJson.length - 1)
      countryListJson = JSON.parse("[" + countryListJson + "]");

      jQuery("input[type='text']").autocomplete({

        highlight: function(value, term) {

          return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        },
        source: countryListJson,

        minLength: 1 // specifies the minimum number of characters a user
        // has to type before the Autocomplete activates.


      });


      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(JSONData.parameters.SITE_MCI_GA_ENABLE)
       {
        ga('send', 'pageview', {'page': 'Nationality','title': 'Your Nationality'});
    }*/


      var GADetails = this.moduleCtrl.getGADetails();
      
      this.__ga.trackPage({
        domain: GADetails.siteGADomain,
        account: GADetails.siteGAAccount,
        gaEnabled: GADetails.siteGAEnable,
        page: 'Nationality',
        GTMPage: 'Nationality'
      });

    },

    $displayReady: function() {
      MC.appCtrl.logInfo('Nationality::Entering displayready function');
      this.NationalityData = {
        "SelectedNationality": ""
      };



    },

    // Function used to save the natioanlity
    onSaveClick: function(evt) {
      try {
        MC.appCtrl.logInfo('Nationality::Entering onSaveClick function')
        evt.preventDefault();
        //this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        var form = jQuery("form", this.__getPage());
        jQuery("#natErrors").disposeTemplate();
        jQuery('input').blur();
        var errors = [];
        form.check(errors, true);

        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#splashScreen').hide();
          this.moduleCtrl.displayErrors(errors, "natErrors", "error");
          return null;
        }
        var nationalityInput = form.serializeObject();
        //alert(JSON.stringify(nationalityInput));
        for (var i in nationalityInput) {
          if (nationalityInput[i] == "") {
            errors.push({
              "localizedMessage": JSONData.uiErrors[25000053].localizedMessage
            });
            break;
          }

        }

        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#splashScreen').hide();
          this.moduleCtrl.displayErrors(errors, "natErrors", "error");
          return null;
        }

        var editsReqArray = [];
        var selected = this.moduleCtrl.getSelectedPax();
        var cpr = this.moduleCtrl.getCPR();
        // chk whether the nationality edit is required or not and push into input array
        for (var k = 0; k < selected.length; k++) {
          var prod = selected[k].product;
          if (k == 0) {
            var firstProd = selected[k].product;
          }
          var customerArray = selected[k].customer;
          for (var l = 0; l < customerArray.length; l++) {
            if (k != 0) {
              var id = 'nationality_code_' + customerArray[l] + '_' + prod;
              var sId = 'nationality_code_' + customerArray[l] + '_' + firstProd;
              if (!jQuery.isUndefined(nationalityInput[sId])) {
                nationalityInput[id] = nationalityInput[sId];
              } else {
                nationalityInput[id] = cpr.customerLevel[customerArray[l]].productLevelBean[prod].nationalityBean[0].nationalityNationalityCode;
                nationalityInput[sId] = cpr.customerLevel[customerArray[l]].productLevelBean[prod].nationalityBean[0].nationalityNationalityCode;
              }
            }
            var natReq = false;
            var indicators = cpr.customerLevel[customerArray[l]].productLevelBean[prod].productLevelIndicatorsBean;
            for (var j = 0; j < indicators.length; j++) {
              if (indicators[j].attribute == "NRA") {
                natReq = true;
              }
            }
            if (cpr.customerLevel[customerArray[l]].productLevelBean[prod].regulatoryDocumentDetailsBean == null && natReq) {
              customer = customerArray[l];
              editsReqArray.push({
                "product": prod,
                "customer": customer
              });
            }
          }
        }
        //input json
        var nationalityEditInput = {
          "selectedCPR": this.moduleCtrl.getSelectedPax(),
          "nationalityInput": nationalityInput,
          "indicator": "NAT",
          "editsReqArray": editsReqArray
        }

        this.moduleCtrl.setCountryCode('');
        //we call the controller to retrive
        this.moduleCtrl.nationalityEdit(nationalityEditInput);
      } catch (exception) {
        MC.appCtrl.logError(
          'Nationality::An error occured in onSaveClick function',
          exception);
      }
    },

    __getPage: function() {
      try {
        MC.appCtrl.logInfo('Nationality::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        MC.appCtrl.logError(
          'Nationality::An error occured in __getPage function',
          exception);
      }
    },

    // Function called when search icon is clicked.
    onCountryLinkClick: function(evt, args) {
      try {
        MC.appCtrl.logInfo('Nationality::Entering onCountryLinkClick function');
        var _this = this;
        //input json for country list prompt
        var countryInput = {
            "code": args.code,
            "sec": args.sec,
            "cust": args.cust,
            "prod": args.prod,
            "refid": args.refid
          }
          //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        _this.moduleCtrl.countryListPrompt(countryInput, "serviceoverlayCKIN");
        jQuery('#serviceoverlayCKIN').css('margin-top', '0px');
        jQuery('#serviceoverlayCKIN').show();
        jQuery('#splashScreen').hide();
      } catch (exception) {
        MC.appCtrl.logError(
          'Nationality::An error occured in onCountryLinkClick function',
          exception);
      }
    },

    onInputFocus: function(evt, args) {
      try {
        MC.appCtrl.logInfo('Nationality::Entering onInputFocus function');
        jQuery('#' + args.id).blur();
      } catch (exception) {
        MC.appCtrl.logError(
          'Nationality::An error occured in onInputFocus function',
          exception);
      }
    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        MC.appCtrl.logInfo('Nationality::Entering onModuleEvent function');
        switch (evt.name) {
          // this section gets refreshed when country is updated
          case "country.updated":
            jQuery('#serviceoverlayCKIN').hide();
            jQuery("#serviceoverlayCKIN").disposeTemplate();
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            if (evt.sec == "nat") {
              jQuery('#serviceoverlayCKIN').hide();
              jQuery("#serviceoverlayCKIN").disposeTemplate();
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#overlayCKIN').hide();
              this.$refresh({
                filterSection: "nationality_" + evt.cust + "_" + evt.prod
              })
            }
            break;
          case "country.close":
            jQuery('#serviceoverlayCKIN').hide();
            jQuery("#serviceoverlayCKIN").disposeTemplate();
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            break;
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": JSONData.uiErrors[21400069].localizedMessage
            });
            this.moduleCtrl.displayErrors(errors, "natErrors", "error");
            break;
        }
      } catch (exception) {
        MC.appCtrl.logError(
          'Nationality::An error occured in onModuleEvent function',
          exception);
      }
    }
  }
});