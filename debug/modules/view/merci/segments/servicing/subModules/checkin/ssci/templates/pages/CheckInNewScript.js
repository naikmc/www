Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CheckInNewScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.mainMacroArgs={};
 	this.KarmaOnCprRet={};
    this.KarmaPnrType={};
  },

  $prototype: {

    $dataReady: function() {
      this.$logInfo('CheckInNewScript::Entering dataReady function');
      try {
        var pageData = this.moduleCtrl.getModuleData().checkIn;
        this.errorStrings = pageData.MSSCICheckinIndex_A.errorStrings;
        if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
          pageData = jsonResponse.data.checkIn;
        }
        this.label = pageData.MSSCICheckinIndex_A.labels;
        this.parameters = pageData.MSSCICheckinIndex_A.parameters;
        this.siteParams = pageData.MSSCICheckinIndex_A.siteParam;
        this.rqstParams = pageData.MSSCICheckinIndex_A.requestParam;
        this.errorStrings = pageData.MSSCICheckinIndex_A.errorStrings;

        this.moduleCtrl.setHeaderInfo({
          title: this.label.Title,
          bannerHtmlL: this.rqstParams.bannerHtml,
          homePageURL: this.siteParams.homeURL,
          showButton: false
        });

        var airlineDl = pageData.MSSCICheckinIndex_A.airlineDl;
        var site_mci_op_airline = this.parameters.SITE_SSCI_OP_AIR_LINE;
        var site_mci_grp_of_airlines = this.parameters.SITE_SSCI_GRP_AIR_LINE;
        this.moduleCtrl.setOperatingAirlinesList(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines);
        var configuredAirlines = this.moduleCtrl.getOperatingAirlinesList();
        this.moduleCtrl.setGADetails(pageData.MSSCICheckinIndex_A.parameters);
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in dataReady function', exception);
      }
    },

    $viewReady: function() {
      this.$logInfo('CheckInNewScript::Entering viewReady function');
      try {
        var __mdlCtrl = this.moduleCtrl;
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

        var errors = [];
        if (this.moduleCtrl.getIsSessionExpired()) {
            __mdlCtrl.setIsSessionExpired(false);
          errors.push({
            "localizedMessage": this.errorStrings[3001].localizedMessage,
            "code": this.errorStrings[3001].errorid
          });
        }

        /*
         * For direct landing show error messages
         * ex: from apps, try to direct land
         * */
        var res = {};
        res.responseJSON = jsonResponse;
        if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
          var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
          if (CPRIdentification && CPRIdentification.mciUserError != null) {
            errors.push({
              "localizedMessage": CPRIdentification.mciUserError.errorDesc
            });

              CPRIdentification.mciUserError = null;

          }
          /*else if (res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.SessionExpired == "SESSION_EXPIRED") {
            errors.push({
              "localizedMessage": res.responseJSON.data.checkIn.MSSCICheckinIndex_A.errorStrings[3001].localizedMessage,
              "code": res.responseJSON.data.checkIn.MSSCICheckinIndex_A.errorStrings[3001].errorid
            });
            setTimeout(function() {
            res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.SessionExpired="";
            }, 400);
          }*/

        }
        /*
         * End for direct landing show error messages
         * */


        if (errors.length > 0) {
          this.moduleCtrl.displayErrors(errors, "pageErrors", "error");

        }

        /*implementation team feedback - remove dropdown of identification
         * incase only one identification*/
        if (jQuery("#IdentificationType option").length == 1) {
          jQuery("#IdentificationType").attr("disabled", "disabled");

        }
        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
			genericScript({
				tpl:"CheckInNew",
				data:this.data
			});
        }
        /*END : JavaScript Injection(CR08063892)*/

      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in viewReady function', exception);
      }
    },

    $displayReady: function() {
      this.$logInfo('CheckInNewScript::Entering displayReady function');
      try {
        var success = [];
        if (this.data.CancelStatus == "SUCCESS") {
          success.push({
            "localizedMessage": this.label.CancelSuccessful
          });
        }
        this.data.CancelStatus = null;
        if (success.length > 0) {
          this.moduleCtrl.displayErrors(success, "pageErrors", "success");
        }

        var deviceDetails = navigator.userAgent;
        if (deviceDetails.indexOf("4.") != -1 && deviceDetails.substring(deviceDetails.indexOf("4."), deviceDetails.indexOf("4.") + 3) >= 4.1) {
          $('select, p select, p.cabin select').addClass("selctboxs2");
        }

        if(jQuery.isUndefined(this.mainMacroArgs) || jQuery.isUndefined(this.mainMacroArgs.flow))
        {
        this.moduleCtrl.setSelectedCPRFromTripOverview(null);
        }

      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in displayReady function', exception);
      }
    },

    pnrType: function() {
      try {
        this.$logInfo('CheckInNewScript::Entering pnrType function');
        var _this = this;
        var selectedPnrType = document.getElementById("IdentificationType").options[document.getElementById("IdentificationType").selectedIndex].value;
        _this.moduleCtrl.setPnrType(selectedPnrType);
        this.$refresh();
        if (selectedPnrType == "frequentFlyerNumber") {
          $("#ffSelected").show();
        } else if (selectedPnrType == "eticketNumber") {
          $("#ffSelected").hide();
        } else {
          $("#ffSelected").hide();
        }
      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in pnrType function', exception);
        //For TDD
        this.KarmaPnrType["message"] = "An error occured in pnrType function";
      }
    },
    // Function called to retreive the CPR
    onCprRet: function(evt) {
      try {
        this.$logInfo('CheckInNewScript::Entering onCprRet function');
        // We prevent default behaviour
        evt.preventDefault();
        jQuery("#pageErrors").disposeTemplate();
        jQuery('input').blur();

        //turn the background off
        jQuery('#offlineMsg', this.__getPage()).hide();
        jQuery('#offlineMsg', this.__getPage()).html("");
        //this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        /**BEGIN : Defining Variables*/

        var form = jQuery("#checkin-CheckInNew"); // we get the form
        var errors = [];
        var cprInput = jQuery("form").serializeObject();

        /*implementation team feedback - remove dropdown of identification
         * incase only one identification*/
        if (this.parameters.SITE_SSCI_CHECKN_IDCFORMS != "" && cprInput.IdentificationType == undefined && this.parameters.SITE_SSCI_CHECKN_IDCFORMS.trim().split(",").length == 1) {
          if (this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("REC_LOC") != -1) {
            cprInput.IdentificationType = "bookingNumber";
          } else if (this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("FF_NUM") != -1) {
            cprInput.IdentificationType = "frequentFlyerNumber";
          } else if (this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("E_TKT") != -1) {
            cprInput.IdentificationType = "eticketNumber";
          }

        }

        /*Trimming the Input values*/
        if (cprInput.recLoc) {
          //          recLoc = cprInput.recLoc.trim();
          //          recLoc = recLoc.toUpperCase();
          cprInput.recLoc = cprInput.recLoc.trim().toUpperCase();
        }
        if (cprInput.ffNumber) {
          cprInput.ffNumber = cprInput.ffNumber.trim();
        }
        if (cprInput.eticketNumber) {
          cprInput.eticketNumber = cprInput.eticketNumber.trim();
        }
        if(cprInput.departureDate) {
        	cprInput.departureDate = cprInput.departureDate.trim();
        }
        if (cprInput.lastName) {
          cprInput.lastName = cprInput.lastName.trim();
        }

        /**END : Defining Variables*/

        form.check(errors, false, this.errorStrings);

        /**
         * BEGIN : In Case Of Baording Point ,Checking Whether Name is in the list and Displaying Error If Not
         *
         */
        if (cprInput.boardpoint) {
          if (this.data.validateBoardingList[cprInput.boardpoint] != undefined) {
            cprInput.boardpoint = this.data.validateBoardingList[cprInput.boardpoint];

          } else if (this.data.validateBoardingList[cprInput.boardpoint.toUpperCase()] != undefined) {
            cprInput.boardpoint = this.data.validateBoardingList[cprInput.boardpoint.toUpperCase()];
          } else {
            errors.push({
              "localizedMessage": this.errorStrings[213002238].localizedMessage,
              "code": this.errorStrings[213002238].errorid
            });
            this.KarmaOnCprRet["message"] = "boarding point invalid";
          }
        }

        /**
         * END : In Case Of Baording Point ,Checking Whether Name is in the list and Displaying Error If Not
         *
         */
        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.moduleCtrl.displayErrors(errors, "pageErrors", "error");
          return null;
        }

        if (cprInput.lastName) {
          this.moduleCtrl.setLastName(cprInput.lastName); // cprInput.recLoc = recLoc;
        } else {
          this.moduleCtrl.setLastName("");
        }
        this.moduleCtrl.cprInputSQ = cprInput; //we call the controller to retrive
        this.data.cprInput = cprInput;

        /*copy arguments from main macro*/
        if(!jQuery.isUndefined(this.mainMacroArgs) && this.mainMacroArgs.flow == "AddPassenger")
        {
        	for(var i in this.mainMacroArgs)
        	{
        		cprInput[i]=this.mainMacroArgs[i];
        	}
        }

        this.moduleCtrl.cprRetreive(cprInput);
      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in onCprRet function', exception);
      }
    },

    // Function called if the names are already existing in the native phone addressbook, using lookup
    namePicker: function(evt) {
      this.$logInfo('CheckInNewScript::Entering namePicker function');
      try {
        jQuery("input[id='lastName']").keyup(function() {
          var text = jQuery(this).val();
          var url = "namePicker://search?target=lastName&value=" + text;
          jQuery('a.nameLookUp').attr('href', url);
        });
      } catch (exception) {
        this.$logError('CheckInNewScript::An error occured in namePicker function', exception);
      }
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
        MC.appCtrl.logError('CheckInScript::An error occured in __displayMessage function', exception);
      }

    },

    __getPage: function() {
      try {
        this.$logInfo('CheckInScript::Entering __getPage function');
        return jQuery('#checkin-home');
      } catch (exception) {
        this.$logError('CheckInScript::An error occured in __getPage function', exception);
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
        this.$logError('CheckInScript::An error occured in onModuleEvent function', exception);
      }
    }
  }
});