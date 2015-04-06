Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.CheckInNewScript',

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
      var pageData = this.moduleCtrl.getModuleData().checkIn;

      /*
       * incase of direct landing where m checkin index wont be there
       * */
      if(pageData != undefined && pageData.MCheckinIndex_A == undefined)
      {
    	  if(pageData.MCPRRetrieveSinglePax_A != undefined && pageData.MCPRRetrieveSinglePax_A.MCheckinIndex_A != undefined)
    	  {
    		  pageData.MCheckinIndex_A=pageData.MCPRRetrieveSinglePax_A.MCheckinIndex_A;
    	  }else if(pageData.MCPRRetrieveMultiPax_A != undefined && pageData.MCPRRetrieveMultiPax_A.MCheckinIndex_A != undefined)
    	  {
    		  pageData.MCheckinIndex_A=pageData.MCPRRetrieveMultiPax_A.MCheckinIndex_A;
    	  }else if(pageData.MTripList_A != undefined && pageData.MTripList_A.MCheckinIndex_A != undefined)
    	  {
    		  pageData.MCheckinIndex_A=pageData.MTripList_A.MCheckinIndex_A;
    	  }else if(pageData.MTripOverview_A != undefined && pageData.MTripOverview_A.MCheckinIndex_A != undefined)
    	  {
    		  pageData.MCheckinIndex_A=pageData.MTripOverview_A.MCheckinIndex_A;
    	  }
      }

      this.errorStrings = pageData.MCheckinIndex_A.errorStrings;
      if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
        pageData = jsonResponse.data.checkIn;
      }
      this.label = pageData.MCheckinIndex_A.labels;
      this.parameters = pageData.MCheckinIndex_A.parameters;
      this.siteParams = pageData.MCheckinIndex_A.siteParam;
      this.rqstParams = pageData.MCheckinIndex_A.requestParam;
      this.errorStrings = pageData.MCheckinIndex_A.errorStrings;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, false);

      var airlineDl = pageData.MCheckinIndex_A.airlineDl;
      var site_mci_op_airline = this.parameters.SITE_MCI_OP_AIRLINE;
      var site_mci_grp_of_airlines = this.parameters.SITE_MCI_GRP_OF_AIRLINES;
      this.moduleCtrl.setOperatingAirlinesList(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines);

      var configuredAirlines = this.moduleCtrl.getOperatingAirlinesList();

      this.moduleCtrl.setGADetails(pageData.MCheckinIndex_A.parameters);

    },

    $viewReady: function() {
      this.$logInfo('CheckInScript::Entering viewReady function');

      /**For increase document height incase when keyboard apper to give extra scroller*****************/
      jQuery(document).on("focus",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select", function() {
        jQuery(".sectionDefaultstyle").css("margin-bottom", "200px")
      });
      jQuery(document).on("blur",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select", function() {
        jQuery(".sectionDefaultstyle").css("margin-bottom", "0")
      });


      if (this.moduleCtrl.getIsSessionExpired()) {
        this.moduleCtrl.setIsSessionExpired(false)
        var errors = [];
        errors.push({
          "localizedMessage": this.errorStrings[3001].localizedMessage,
          "code": this.errorStrings[3001].errorid
        });
        this.moduleCtrl.displayErrors(errors, "pageErrors", "error");
        return false;
      }

      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(this.parameters.SITE_MCI_GA_ENABLE)
       {
        ga('send', 'pageview', {'page': 'Get trip','title': 'Your Get trip'});
      }*/



      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Get trip");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=home";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
        
       
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
          page: 'Get trip',
          GTMPage: 'Get trip'
        });
		
      }

      /*For showing error messages incase of direct landing*/
      var errors = [];
      var warnings = [];
      var res = {};
      res.responseJSON = jsonResponse;
      if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MCheckinIndex_A && res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam) {
        var CPRIdentification = res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.CPRIdentification;
        if (CPRIdentification && CPRIdentification.MCIUserErrors != null && CPRIdentification.MCIUserErrors.mciUsrErrBean.length > 0) {
          var errorCnt = CPRIdentification.MCIUserErrors.mciUsrErrBean.length;
          for (var i = 0; i < errorCnt; i++) {
            if (CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorCategory == "E") {
              var ec = CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorCode
              errors.push({
                "localizedMessage": CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorDesc
              });
            } else if (CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorCategory == "W") {
              var wc = CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorCode
              warnings.push({
                "localizedMessage": CPRIdentification.MCIUserErrors.mciUsrErrBean[i].errorDesc
              });
            }

          }

        } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError && (jsonResponse.data.framework.baseParams.join("").indexOf("&LAST_NAME=") == -1 ? false : true)) {
          errors.push({
            "localizedMessage": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[21400069].localizedMessage,
            "code": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[21400069].code
          });
        } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired && (jsonResponse.data.framework.baseParams.join("").indexOf("&LAST_NAME=") == -1 ? false : true)) {
          errors.push({
            "localizedMessage": this.errorStrings[3001].localizedMessage,
            "code": this.errorStrings[3001].errorid
          });
        }
      }

      if (errors.length > 0) {
        this.moduleCtrl.displayErrors(errors, "pageErrors", "error");
        return null;
      }
      if (warnings.length > 0) {
        this.moduleCtrl.displayErrors(warnings, "pageErrors", "warning");
      }



    },

    $displayReady: function() {
      var deviceDetails = navigator.userAgent;
      if (deviceDetails.indexOf("4.") != -1 && deviceDetails.substring(deviceDetails.indexOf("4."), deviceDetails.indexOf("4.") + 3) >= 4.1) {
        $('select, p select, p.cabin select').addClass("selctboxs2");

      }


    },

    pnrType: function() {
      try {
        this.$logInfo('CheckInScript::Entering pnrType function');
        var _this = this;
        var selectedPnrType = document.getElementById("IdentificationType").options[document.getElementById("IdentificationType").selectedIndex].value;
        _this.moduleCtrl.setPnrType(selectedPnrType);
        this.$refresh();
        /*if (selectedPnrType == "frequentFlyerNumber") {
          $("#ffSelected").show();
        } else if (selectedPnrType == "eticketNumber") {
          $("#ffSelected").hide();
        } else {
          $("#ffSelected").hide();
        }*/
      } catch (exception) {
        this.$logError(
          'CheckInScript::An error occured in pnrType function',
          exception);
      }
    },
    // Function called to retreive the CPR
    onCprRet: function(evt) {
      try {
        this.$logInfo('CheckInScript::Entering onCprRet function');
        // We prevent default behaviour
        evt.preventDefault();
        jQuery("#pageErrors").disposeTemplate();
        jQuery('input').blur();

        // we get the form
        var form = jQuery("#checkin-CheckInNew");

        //turn the background off
        jQuery('#offlineMsg', this.__getPage()).hide();
        jQuery('#offlineMsg', this.__getPage()).html("");
        //this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        var errors = [];
        form.check(errors, false, this.errorStrings);
        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.moduleCtrl.displayErrors(errors, "pageErrors", "error");
          return null;
        }
        var cprInput = jQuery("form").serializeObject();
        var recLoc = "";
        if (cprInput.recLoc) {
          recLoc = cprInput.recLoc;
          recLoc = recLoc.toUpperCase();
          cprInput.recLoc = recLoc;
        }

        /*
         * As per SQ comments, airline selection field removed from
         * retrieve page so it is hard coded to requese to SQ
         * */
        if(this.moduleCtrl.getPnrType() == "frequentFlyerNumber")
        {
        	cprInput.carrier="SQ";
        }
        //console.log(JSON.stringify(cprInput));
        // cprInput.recLoc = recLoc;
        this.moduleCtrl.setLastName(cprInput.lastName);
        //we call the controller to retrive
        this.moduleCtrl.cprInputSQ = cprInput;
        this.moduleCtrl.cprRetreive(cprInput);
      } catch (exception) {
        this.$logError(
          'CheckInScript::An error occured in onCprRet function',
          exception);
      }
    },

    // Function called if the names are already existing in the native phone addressbook, using lookup
    namePicker: function(evt) {
      this.$logInfo('CheckInScript::Entering namePicker function');
      jQuery("input[id='lastName']").keyup(function() {
        var text = jQuery(this).val();
        var url = "namePicker://search?target=lastName&value=" + text;
        jQuery('a.nameLookUp').attr('href', url);
      });
    },

    // This function is used to display any message regarding ofline.
    __displayMessage: function() {
      try {
        MC.appCtrl.logInfo('CheckInScript::Entering __displayMessage function');
        var checkInForm = jQuery(this.__getPage());
        var tempHTML = "<div class=\"popUpWrapperaCKIN\"><div class=\"panelWrapperInner\"><div class=\"panelContent\"><h1 class=\"posR\"><span id=\"calendarClose\" class=\"cross\">&nbsp;</span></h1><div class=\"slide\">" + this.moduleRes.res.checkin.label.OfflineMsg + "</div></div></div></div>";

        jQuery("#offlineMsg", checkInForm).html(tempHTML);
        jQuery("#offlineMsg", checkInForm).css("position", "relative");
        jQuery("#offlineMsg", checkInForm).css("margin", "10px 0");
        jQuery('#offlineMsg', checkInForm).show();

        jQuery("#offlineMsg span").click(function() {
          jQuery('#offlineMsg', checkInForm).hide();
          jQuery('#offlineMsg', checkInForm).html("");
        });
      } catch (exception) {
        MC.appCtrl.logError(
          'CheckInScript::An error occured in __displayMessage function',
          exception);
      }

    },

    __getPage: function() {
      try {
        this.$logInfo('CheckInScript::Entering __getPage function');
        return jQuery('#checkin-home');
      } catch (exception) {
        this.$logError(
          'CheckInScript::An error occured in __getPage function',
          exception);
      }
    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('CheckInScript::Entering onModuleEvent function');
        switch (evt.name) {
          // Raising event if offline mode is active
          case "offline.mode":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            this.__displayMessage();
            break;
            // Raising event if any server errors are occured
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": errorStrings[21400069].localizedMessage,
              "code": errorStrings[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "pageErrors", "error");
            break;
            // Raising event if refresh is done
          case "localStorage.refresh.done":
            this.displayBoardingPass(evt.args);
            break;
          case "generror.error":
            // Raising event if session error occurs
          case "sessionid.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            var genErrors = this.moduleCtrl.getGenError();
            if (genErrors && genErrors != null) {
              errors.push({
                "localizedMessage": genErrors
              });
              this.moduleCtrl.displayErrors(errors, "pageErrors", "error")
            }
            break;
        }
      } catch (exception) {
        this.$logError(
          'CheckInScript::An error occured in onModuleEvent function',
          exception);
      }
    }
  }
});