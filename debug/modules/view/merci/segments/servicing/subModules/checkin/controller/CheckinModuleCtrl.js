/**
 * Cmtng module controller
 */
Aria.classDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.controller.CheckinModuleCtrl',
  $extends: 'modules.view.merci.common.controller.MerciCtrl',
  $implements: ["modules.view.merci.segments.servicing.subModules.checkin.controller.ICheckinModuleCtrl"],
  $dependencies: [
    'aria.core.environment.Environment',
    'aria.utils.HashManager',
    'modules.view.merci.segments.servicing.subModules.checkin.templates.AppCtrl',
    'modules.view.merci.common.utils.MCommonScript',
    'modules.view.merci.common.utils.URLManager',
    'aria.utils.Json',
    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {
    this.$ModuleCtrl.constructor.call(this);
    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype: {

    $publicInterfaceName: "modules.view.merci.segments.servicing.subModules.checkin.controller.ICheckinModuleCtrl",

    // -------------------------------------- Initialization methods --------------------------
    init: function(args, initReadyCb) {
      try {

        // set a callback on hash change
        aria.utils.HashManager.addCallback({
          fn: '__onHashChange',
          scope: this
        });

        var devMode = aria.core.environment.Environment.isDevMode();
        if (devMode) {
          aria.core.Log.setLoggingLevel("modules.view.merci.segments.servicing.subModules.checkin.*", aria.core.Log.LEVEL_INFO);
        }
        this.$logInfo('ModuleCtrl::Entering init function');

        this.appCtrl = new modules.view.merci.segments.servicing.subModules.checkin.templates.AppCtrl(this._data.devMode);
        this.appCtrl.init(this);

        var urlManager = modules.view.merci.common.utils.URLManager;

        var siteParams = {};
        var uierrors = {};
        if (jsonResponse && jsonResponse.data && jsonResponse.data.model) {
          var model = jsonResponse.data.model;
          siteParams = model.parameters;
          uierrors = model.uiErrors;
        }

        this._data = {
          layout: {
            current: null,
            history: [],
            transition: null
          },
          checkIn: null,
          /*CPRIdentification : null,*/
          Selection: null,
          InitiateAccept: null,
          Warnings: null,
          Success: null,
          EditCPR: null,
          NatEditCPR: null,
          NationalityWarnings: null,
          CheckReg: null,
          prodErrorList: null,
          PaxSelection: null,
          lastName: null,
          CountryCode: null,
          seatMapResponse: [],
          genErrorJson: null,
          flowType: null,
          deliverDocument: null,
          AllocatedSeats: [],
          deliverDocInput: {},
          seatNotLoaded: true,
          svTime: null,
          pnrType: "bookingNumber",
          othrDocType: null,
          tripListSelectedPnrholder: null,
          CPRIdentification: {

            countryList: null,
            customerLevel: [],
            monthsList: null

          },
          GADetails: {
            siteGADomain: "",
            siteGAAccount: "",
            siteGAEnable: ""
          },
          CPRTripList: [],
          FQTVOpAirline: null,
          IsFlowInCancelCheckin: 0,
          bannerInfo: null,
          selectedEditpax: null,
          editCPRFromOverview: 0,
          passengerDetails: null,
          cancelCheckInEnable: true,
          exitRowListWhenCheckin: null,
          exitRowListWhenCheckinProd: null,
          exitRowListWhenCheckinProdCunt: 0,
          exitRowListPopupShow: {
            grpPaxInfos: []
          },
          exitRowListPopupcount: 0,
          exitRowListAnswerForAll: null,
          filteredListMBP: [],
          operatingAirlineList: null,
          validAppFlag: true,
          isFlowAppCancel: false,
          isAnyValidAppPax: true,
          acceptedCprValidApp: [],
          blackListOverBooked: false,
          countryNameCodeMap: "",
          boardingPassInput: null,
          currentCustomer: null,
          validDeliverDocInput: {},
          originalSelectedCPR: null,
          boardingPassNtIssued: true,
          embeded: jsonResponse.data.framework.baseParams.join("").indexOf("&client=") == -1 ? false : true,
          effect: 'slide',
          devMode: devMode,
          sessionId: null,
          refresh: true,
          language: urlManager.__getLanguageCode(),
          uiErrors: uierrors,
          site: urlManager.__getSiteCode(),
          date: urlManager.getStringParam().date,
          parameters: siteParams,
          //cprResponseFlow : '${flow}',
          homeUrl: null,
          availableStatesUSAAutoComplete: ["Armed Forces Americas", "Armed Forces Europe", "Armed Forces Pacific", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
          usaStatesNameToCodeMap: {
            "ARMED FORCES AMERICAS": "AA",
            "ARMED FORCES EUROPE": "AE",
            "ARMED FORCES PACIFIC": "AP",
            "ALABAMA": "AL",
            "ALASKA": "AK",
            "ARIZONA": "AZ",
            "ARKANSAS": "AR",
            "CALIFORNIA": "CA",
            "COLORADO": "CO",
            "CONNECTICUT": "CT",
            "DELAWARE": "DE",
            "DISTRICT OF COLUMBIA": "DC",
            "FLORIDA": "FL",
            "GEORGIA": "GA",
            "HAWAII": "HI",
            "IDAHO": "ID",
            "ILLINOIS": "IL",
            "INDIANA": "IN",
            "IOWA": "IA",
            "KANSAS": "KS",
            "KENTUCKY": "KY",
            "LOUISIANA": "LA",
            "MAINE": "ME",
            "MARYLAND": "MD",
            "MASSACHUSETTS": "MA",
            "MICHIGAN": "MI",
            "MINNESOTA": "MN",
            "MISSISSIPPI": "MS",
            "MISSOURI": "MO",
            "MONTANA": "MT",
            "NEBRASKA": "NE",
            "NEVADA": "NV",
            "NEW HAMPSHIRE": "NH",
            "NEW JERSEY": "NJ",
            "NEW MEXICO": "NM",
            "NEW YORK": "NY",
            "NORTH CAROLINA": "NC",
            "NORTH DAKOTA": "ND",
            "OHIO": "OH",
            "OKLAHOMA": "OK",
            "OREGON": "OR",
            "PENNSYLVANIA": "PA",
            "RHODE ISLAND": "RI",
            "SOUTH CAROLINA": "SC",
            "SOUTH DAKOTA": "SD",
            "TENNESSEE": "TN",
            "TEXAS": "TX",
            "UTAH": "UT",
            "VERMONT": "VT",
            "VIRGINIA": "VA",
            "WASHINGTON": "WA",
            "WEST VIRGINIA": "WV",
            "WISCONSIN": "WI",
            "WYOMING": "WY"
          },
          errorStrings: null,
          firstTimeLoad: 0,
          telephoneNumberList: null,
          isAcceptanceConfirmation: false,
          isSessionExpired: false,
          notRetrievedLastNameList: null,
          nationalityEditInput: null,
          CPRIdentificationoriginal: null,
          URLFromBaseJson: jsonResponse.data.framework.baseParams.join(""),
          cancelChkinRepCallAry: [],
          cancelChkinRepCallAryindex: 0,
          isApisEligible: false,
          selectedPaxUniqID: [],
          showRedress_KnownTraveller_AllUSRoutes: true,
          regulatoryCurrentPaxIndex: -1,
          labelDetails:null,
          validGTMProdIDs:{},
          validGTMForCancelAcceptance:{}
        };
        var _this = this;
        $.ajax({
          url: '/',
          cache: false,
          type: "POST",
          data: 'data',
          crossDomain: "true",
          processData: false,
          complete: function(res, status) {
            if (!_this._data.svTime) {
              _this._data.svTime = res.getResponseHeader('Date');
            }
          }
        });

        if (jQuery.support.orientation) {
          var _this = this;
          jQuery(window).bind('orientationchange', function(evt) {
            var orientation = Math.abs(window.orientation);
            _this.raiseEvent({
              name: "orientation.change",
              orientation: orientation == 90 ? 'landscape' : 'portrait'
            });
          });
        }
        this.__header = {};

        /*TAKING URL TO HIDDEN VARIABLE TO USE IT ACROSS THE CHECKIN*/
        jQuery("body").append("<div id=\"serviceoverlayCKIN\"></div>");
        if (this._data.embeded) {
          jQuery("body").append("<input type=\"hidden\" id=\"MyMERCICheckInURL\" /><input type=\"hidden\" id=\"MyCPRRetrievalURL\" />");
          /* Commented because previously i.e in r16 they used this to decode
         NOW in r17 as the way encode response in Maria_index.html changed the decoding chnaged accordingly
         var myUrl=JSON.parse(window.decodeURIComponent(window.atob(document.getElementById('json_resp').value)));
         */
          /* if (!jQuery.isUndefined(LZString)) {

             * var myUrl = JSON.parse(decodeURIComponent(LZString.decompressFromBase64(document.getElementById('json_resp').value)));
             */
            var myUrl = jsonResponse.myUrl;
            if (myUrl.indexOf("checkinFlow") != -1) {
              document.getElementById('MyCPRRetrievalURL').value = "";
              document.getElementById('MyMERCICheckInURL').value = myUrl;
            }
            if (myUrl.indexOf("CPRIdentification") != -1) {
              document.getElementById('MyMERCICheckInURL').value = "";
              document.getElementById('MyCPRRetrievalURL').value = myUrl;
            }
          /*}*/
        }

        /* For tab to expand and collapse *************************************************************************** */

        /* click on tabs */
        $(document).on("click","*[role=tab]", function() {
          var parent = $(this).parents(".tabs, .accordion, article").first()
          parent.find("[role=tabpanel]").hide().attr("aria-hidden", "true");

          var selector = "*[aria-labeledby=" + $(this).attr('id') + "]";
          $(selector).show().attr("aria-hidden", "false");

          if ($(this).attr("aria-expanded") == "true") {
            $(this).parents("article").first().find("[role=tab]").attr("aria-expanded", "false").attr("aria-hidden", "true");
            reset($(this));
          } else {
            $(this).parents("article").first().find("[role=tab]").attr("aria-expanded", "false").attr("aria-hidden", "true");
            $(this).attr("aria-expanded", "true").attr("aria-hidden", "false");
          }
          /* reset tabs and tabpanel */
          function reset(elem) {
            var parent = $(elem).parents(".tabs, .accordion, article").first()
            parent.find("[role=tabpanel]").hide().attr("aria-hidden", "true");

            var selector = "*[aria-labelledby=" + $(elem).attr('id') + "]";

            parent.find("[role=tab]").attr("aria-expanded", "false").attr("aria-hidden", "true");

            if ($(elem).parents(".panel.list").get(0)) {
              parent.find("[role=tabpanel]").last().show().attr("aria-hidden", "false");
            }
          };

        });
        /* End For tab to expand and collapse *************************************************************************** */

        /*Loading new ui scripts dynamically*/
        if(this._data.embeded)
        {
        	jQuery("body").append("<script type='text/javascript' src='checkin/checkin_mci.js'></script>");
        }else
        {
        var urlManager = jsonResponse.data.framework.baseParams;
        var uri = urlManager[0] + "://" + urlManager[1] + urlManager[10] + "/default/" + urlManager[9] + "/static/merciAT/checkin/checkin_mci.js";
        jQuery("body").append("<script type='text/javascript' src='" + uri + "'></script>");
        /*End loading new ui scripts dynamically*/
        }


        this.$callback(initReadyCb);
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in init function',
          exception);
      }
    },

    __onHashChange: function() {

      var hashPage = aria.utils.HashManager.getHashString();
      $('#ui-datepicker-div').hide();
      if (hashPage == null || hashPage == '') {
        // if hashpage is null or empty
        // then it means that current was the entry action
        this.goBack();
      }


      /*
       * For mobile where to show always top of page
	   * PTR 09269140 [Medium]: MeRCI R21 MCI : When no segments are allowed to checkin, Checkin button is displayed in Trip Summary
       * */
      window.scrollTo(0,0);

    },

    __initData: function() {
      // if data default available
      if (jsonResponse != null && jsonResponse.data != null && jsonResponse.data.checkIn != null) {
        var nextPage = jsonResponse.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        if (dataId == "MBoardingPass_A") {
          this._data.BoardingPass = jsonResponse.data.checkIn[dataId].requestParam.BoardingPass;
          this._data.BPResponseDetails = jsonResponse.data.checkIn[dataId].requestParam.BPResponseDetails;
          this._data.InitiateAccept = jsonResponse.data.checkIn[dataId].requestParam.InitiateCustomerAcceptance;
          this._data.CPRIdentification = jsonResponse.data.checkIn[dataId].requestParam.CPRIdentification;
          jsonResponse.data.checkIn[dataId].isSMS = true;
        }


        /*  var nextPage = jsonResponse.homePageId;
                    var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
                if(jsonResponse.data != null && jsonResponse.data.checkIn != null && jsonResponse.data.checkIn[dataId] != null &&jsonResponse.data.checkIn[dataId].requestParam != null){
                for (var key in jsonResponse.data.checkIn[dataId].requestParam) {
                  var isJSON = false;
                  try{
                  JSON.parse(jsonResponse.data.checkIn[dataId].requestParam[key]);
                  isJSON = true;
                  }
                  catch(e){
                    isJSON = false;
                  }
                   if(isJSON){
                     jsonResponse.data.checkIn[dataId].requestParam[key] = JSON.parse(jsonResponse.data.checkIn[dataId].requestParam[key]);
                   }
                  }
                } */



        this.data = jsonResponse.data;
      }

      // setting default
      this.__header = {};
    },
    /*
     * Send empty to get date obj, other wise specific format
     * */
    getCurrentTime: function(flag) {
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
      var svtime = this.getsvTime();
      var svtm = svtime.split(' ');
      var mnt = 0;
      var timestamp = svtm[4].split(':')
      for (var ii = 0; ii < month.length; ii++) {
        if (month[ii] == svtm[2]) {
          mnt = ii;
        }
      }
      mnt += 1;
      if (!flag) {
        var dCurr = new Date(svtm[3], mnt, svtm[1]);
        return dCurr;
      } else {
        var mnt = mnt < 9 ? "0" + mnt : mnt;
        return svtm[3] + "-" + mnt + "-" + svtm[1];
      }


    },

    // ---------------------- Layout related methods ----------------------------
    /**
     * getLayout
     * This method get the Layout.
     */
    getLayout: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getLayout function');
        return this._data.layout;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getLayout function',
          exception);
      }
    },

    /**
     * getLastLayout
     * This method get the Last Layout.
     */
    getLastLayout: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getLastLayout function');
        var lastLayout = this._data.layout.history[this._data.layout.history.length - 2];
        return lastLayout;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getLastLayout function',
          exception);
      }
    },

    getGADetails: function() {


      try {
        this.$logInfo('ModuleCtrl::Entering getGADetails function');

        return this._data.GADetails;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getGADetails function',
          exception);
      }
    },
    setGADetails: function(parameters) {
      try {
        this.$logInfo('ModuleCtrl::Entering setGADetails function');
        this._data.GADetails.siteGADomain = parameters.SITE_MCI_GA_DOMAIN;
        this._data.GADetails.siteGAAccount = parameters.SITE_MCI_GA_ACCOUNT;
        this._data.GADetails.siteGAEnable = parameters.SITE_MCI_GA_ENABLE;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setGADetails function',
          exception);
      }
    },

    /**
     * setIsAcceptanceConfirmation
     * This method get the setIsAcceptanceConfirmation
     */
    setIsAcceptanceConfirmation: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsAcceptanceConfirmation function');
        this._data.isAcceptanceConfirmation = val;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setIsAcceptanceConfirmation function',
          exception);
      }
    },



    getPnrType: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getPnrType function');
        //alert("pnrtype selected::::::" + this._data.pnrType);
        return this._data.pnrType;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getPnrType function',
          exception);
      }
    },

    getAvailableStatesUSAAutoComplete: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAvailableStatesUSAAutoComplete function');
        return this._data.availableStatesUSAAutoComplete;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAvailableStatesUSAAutoComplete function',
          exception);
      }
    },

    getUsaStatesNameToCodeMap: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getUsaStatesNameToCodeMap function');
        for (key in this._data.usaStatesNameToCodeMap) {
          if (this._data.usaStatesNameToCodeMap.hasOwnProperty(key)) {
            this._data.usaStatesNameToCodeMap[this._data.usaStatesNameToCodeMap[key]] = key;
          }
        }
        return this._data.usaStatesNameToCodeMap;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getUsaStatesNameToCodeMap function',
          exception);
      }
    },

    setPnrType: function(selectedPnrType) {
      try {
        this.$logInfo('ModuleCtrl::Entering setPnrType function');
        this._data.pnrType = selectedPnrType;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setPnrType function',
          exception);
      }
    },

    onBackClick: function() {
      try {
        window.history.back();
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in onBackClick function');
      }

    },
    /*
     * IsFlowInCancelCheckin -- 1 in cancel checkin else not
     * */
    setIsFlowInCancelCheckin: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsFlowInCancelCheckin function');
        this._data.IsFlowInCancelCheckin = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setIsFlowInCancelCheckin function',
          exception);
      }
    },

    getIsFlowInCancelCheckin: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsFlowInCancelCheckin function');
        return this._data.IsFlowInCancelCheckin;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getIsFlowInCancelCheckin function',
          exception);
      }
    },


    /*
     * setFirstTimeLoad -- this is specifically for Required details page
     * */
    setFirstTimeLoad: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setFirstTimeLoad function');
        this._data.firstTimeLoad = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setFirstTimeLoad function',
          exception);
      }
    },
    /*
     * setTelephoneNumberList -- from global list
     * */
    setTelephoneNumberList: function(countryCallingCodes) {
      try {
        this.$logInfo('ModuleCtrl::Entering setTelephoneNumberList function');
        var callingCntryObj = {};
        for (var i = 0; i < countryCallingCodes.length; i++) {
          var valueObj = {};
          if (countryCallingCodes[i][2].length == 1) {
            valueObj.callingCode = "000" + countryCallingCodes[i][2];
          } else if (countryCallingCodes[i][2].length == 2) {
            valueObj.callingCode = "00" + countryCallingCodes[i][2];
          } else if (countryCallingCodes[i][2].length == 3) {
            valueObj.callingCode = "0" + countryCallingCodes[i][2];
          } else {
            valueObj.callingCode = countryCallingCodes[i][2];
          }
          valueObj.countryCode = countryCallingCodes[i][0];
          valueObj.countryName = countryCallingCodes[i][1];
          callingCntryObj[countryCallingCodes[i][1]] = valueObj;
        }
        this._data.telephoneNumberList = callingCntryObj;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setTelephoneNumberList function',
          exception);
      }
    },

    getTelephoneNumberList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getTelephoneNumberList function');
        return this._data.telephoneNumberList;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getTelephoneNumberList function',
          exception);
      }
    },

    /*
     * IsFlowInCancelCheckin -- true if cancel checkin is for APP
     * */
    setIsFlowAppCancel: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsFlowAppCancel function');
        this._data.isFlowAppCancel = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setIsFlowAppCancel function',
          exception);
      }
    },

    getIsFlowAppCancel: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsFlowAppCancel function');
        return this._data.isFlowAppCancel;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getIsFlowAppCancel function',
          exception);
      }
    },

    /*
     * setIsSessionExpired -- true if session has expired
     * */
    setIsSessionExpired: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsSessionExpired function');
        this._data.isSessionExpired = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setIsSessionExpired function',
          exception);
      }
    },

    getIsSessionExpired: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsSessionExpired function');
        return this._data.isSessionExpired;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getIsSessionExpired function',
          exception);
      }
    },


    /*
     * setBoardingPassNtIssued
     * */
    setBoardingPassNtIssued: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setBoardingPassNtIssued function');
        this._data.boardingPassNtIssued = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setBoardingPassNtIssued function',
          exception);
      }
    },

    getBoardingPassNtIssued: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getboardingPassNtIssued function');
        return this._data.boardingPassNtIssued;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getboardingPassNtIssued function',
          exception);
      }
    },

    /*
     * IsAnyValidAppPax -- true then atleast one pax is fit for the confirmation page.
     * */
    setIsAnyValidAppPax: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsAnyValidAppPax function');
        this._data.isAnyValidAppPax = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setIsAnyValidAppPax function',
          exception);
      }
    },

    getIsAnyValidAppPax: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsAnyValidAppPax function');
        return this._data.isAnyValidAppPax;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getIsAnyValidAppPax function',
          exception);
      }
    },

    /*
     * blackListOverBooked -- false-->in case even one pax is blackListed or even one flight is overbooked.
     * */
    setBlackListOverBooked: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setBlackListOverBooked function');
        this._data.blackListOverBooked = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setBlackListOverBooked function',
          exception);
      }
    },

    getBlackListOverBooked: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getBlackListOverBooked function');
        return this._data.blackListOverBooked;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getBlackListOverBooked function',
          exception);
      }
    },


    /*
     * acceptedCprValidApp -- has the acceptedCpr to make sure only the relevant seats are shown.
     * */
    setAcceptedCprValidApp: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setAcceptedCprValidApp function');
        this._data.acceptedCprValidApp = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setAcceptedCprValidApp function',
          exception);
      }
    },

    getAcceptedCprValidApp: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAcceptedCprValidApp function');
        return this._data.acceptedCprValidApp;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAcceptedCprValidApp function',
          exception);
      }
    },
    /*
     * acceptedValueForSeat -- having list of customers that don't have boarding passes printed .
     * */
    setAcceptedValueForSeat: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setAcceptedValueForSeat function');
        this._data.acceptedValueForSeat = val;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setAcceptedValueForSeat function',
          exception);
      }
    },

    getAcceptedValueForSeat: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAcceptedValueForSeat function');
        return this._data.acceptedValueForSeat;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAcceptedValueForSeat function',
          exception);
      }
    },
    setLastName: function(name) {
      try {
        this.$logInfo('ModuleCtrl::Entering setLastName function');
        this._data.lastName = name;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setLastName function',
          exception);
      }
    },

    getLastName: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getLastName function');
        return this._data.lastName;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getLastName function',
          exception);
      }
    },


    setDeliverDocumentInput: function(name) {
      try {
        this.$logInfo('ModuleCtrl::Entering setDeliverDocumentInput function');
        this._data.deliverDocInput = name;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setDeliverDocumentInput function',
          exception);
      }
    },

    getDeliverDocumentInput: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getDeliverDocumentInput function');
        return this._data.deliverDocInput;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getDeliverDocumentInput function',
          exception);
      }
    },



    setValidDeliverDocInput: function(name) {
      try {
        this.$logInfo('ModuleCtrl::Entering setValidDeliverDocInput function');
        this._data.validDeliverDocInput = name;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setDeliverDocumentInput function',
          exception);
      }
    },

    getValidDeliverDocInput: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getValidDeliverDocInput function');
        return this._data.validDeliverDocInput;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getValidDeliverDocInput function',
          exception);
      }
    },


    getsvTime: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getsvTime function');
        return this._data.svTime;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getsvTime function',
          exception);
      }
    },

    getCurrentCustomer: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCurrentCustomer function');
        return this._data.currentCustomer;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCurrentCustomer function',
          exception);
      }
    },

    setCurrentCustomer: function(currentCustomer) {
      try {
        this.$logInfo('ModuleCtrl::Entering setCurrentCustomer function');
        this._data.currentCustomer = currentCustomer;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setCurrentCustomer function', exception);
      }
    },

    /**
     * getEmbeded
     * This method get the embeded parameter.
     */
    getEmbeded: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getEmbeded function');
        return this._data.embeded;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getEmbeded function',
          exception);
      }
    },
    getSessionId: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSessionId function');
        return this._data.sessionId;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSessionId function',
          exception);
      }
    },
    setSessionId: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSessionId function');
        this._data.sessionId = val;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSessionId function',
          exception);
      }
    },
    /**
     * getCurrentLayout
     * This method get the current layout.
     */
    getCurrentLayout: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCurrentLayout function');
        return this._data.layout.current;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCurrentLayout function',
          exception);
      }
    },

    /**
     * raiseEvent
     * This method raises the event.
     */
    raiseEvent: function(evt) {
      try {
        this.$logInfo('ModuleCtrl::Entering raiseEvent function');
        this.$raiseEvent(evt);
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in raiseEvent function',
          exception);
      }
    },

    /**
     * getAllocatedSeat
     * This method get the allocated seat response.
     */
    getAllocatedSeat: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAllocatedSeat function');
        if (!jQuery.isUndefined(this._data.AllocateSeat)) {
          return this._data.AllocateSeat;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAllocatedSeat function',
          exception);
      }
    },

    /**
     * getExitRowPsngrs
     * This method get the get Exit Row Psngr response.
     */
    getExitRowPsngrs: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getExitRowPsngrs function');
        if (!jQuery.isUndefined(this._data.ExitRowPsngrs)) {
          return this._data.ExitRowPsngrs;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getExitRowPsngrs function',
          exception);
      }
    },

    /**
     * getEmergencyExitSeat
     * This method get the EmergencyExit seat response.
     */
    getEmergencyExitSeat: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getEmergencyExitSeat function');
        if (!jQuery.isUndefined(this._data.EmergencyExitSeat)) {
          return this._data.EmergencyExitSeat;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getEmergencyExitSeat function',
          exception);
      }
    },

    /**
     * reSetCPR
     * This method reSet the current CPR.
     */
    reSetCPR: function() {

      try {

        this.$logInfo('ModuleCtrl::Entering resetCPR function');
        this._data.CPRIdentification.customerLevel.length = 0;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in resetCPR function',
          exception);
      }
    },

    /**
     * setCPR
     * This method set the current CPR.
     */
    setCPR: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setCPR function');

        //this._data.CPRIdentification.customerLevel.push(item);
        this._data.CPRIdentification = item;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setCPR function',
          exception);
      }
    },

    setCountryNameCodeMap: function(nameCodeMap) {

      try {
        this.$logInfo('ModuleCtrl::Entering setCountryNameCodeMap function');
        this._data.countryNameCodeMap = nameCodeMap;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setCountryNameCodeMap function',
          exception);
      }
    },

    getCountryNameCodeMap: function() {

      try {
        this.$logInfo('ModuleCtrl::Entering getCountryNameCodeMap function');
        if (!jQuery.isUndefined(this._data.CPRIdentification.customerLevel[0])) {
          return this._data.countryNameCodeMap;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCountryNameCodeMap function',
          exception);
      }
    },


    /**
     * getCPR
     * This method get the current CPR.
     */
    getCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCPR function');
        if (!jQuery.isUndefined(this._data.CPRIdentification.customerLevel[0])) {
          return this._data.CPRIdentification;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCPR function',
          exception);
      }
    },

    /**
     * seteditCPRFromOverview
     * This method set the current CPR.
     */
    setEditCPRFromOverview: function(val) {

      try {
        this.$logInfo('ModuleCtrl::Entering seteditCPRFromOverview function');

        this._data.editCPRFromOverview = val;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in seteditCPRFromOverview function',
          exception);
      }
    },


    /**
     * getCPR
     * This method get the current CPR.
     */
    getEditCPRFromOverview: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getEditCPRFromOverview function');
        if (!jQuery.isUndefined(this._data.editCPRFromOverview)) {
          return this._data.editCPRFromOverview;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getEditCPRFromOverview function',
          exception);
      }
    },

    /**
     * setFilteredListMBP
     * This method set the set the customer list for MBP.
     */
    setFilteredListMBP: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setFilteredListMBP function');
        this._data.filteredListMBP = item;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setFilteredListMBP function',
          exception);
      }
    },


    /**
     * getFilteredListMBP
     * This method get the customer list for MBP.
     */
    getFilteredListMBP: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFilteredListMBP function');
        if (!jQuery.isUndefined(this._data.filteredListMBP)) {
          return this._data.filteredListMBP;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getFilteredListMBP function',
          exception);
      }
    },

    /**
     * setBoardingInput
     * This method set the set boardingPass Input
     */
    setBoardingInput: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setBoardingInput function');
        this._data.boardingPassInput = item;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setBoardingInput function',
          exception);
      }
    },


    /**
     * getBoardingInput
     * This method get the getBoardingInput
     */
    getBoardingInput: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getBoardingInput function');
        if (!jQuery.isUndefined(this._data.boardingPassInput)) {
          return this._data.boardingPassInput;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getBoardingInput function',
          exception);
      }
    },


    /**
     * setValidApp
     * This method is to set a flag if there are any offloaded pax due to APP failure.
     */
    setValidApp: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setValidApp function');
        this._data.validAppFlag = item;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setValidApp function',
          exception);
      }
    },


    /**
     * getValidApp
     * This method is to get a flag if there are any offloaded pax due to APP failure.
     */
    getValidApp: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getValidApp function');
        if (!jQuery.isUndefined(this._data.validAppFlag)) {
          return this._data.validAppFlag;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getValidApp function',
          exception);
      }
    },



    /**
     * setCPR
     * This method set the current CPR.
     */
    setExitRowListAnswerForAll: function(val) {

      try {
        this.$logInfo('ModuleCtrl::Entering setExitRowListAnswerForAll function');

        this._data.exitRowListAnswerForAll = val;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setExitRowListAnswerForAll function',
          exception);
      }
    },

    /**
     * resetExitRowListPopupShow
     * This method reset the current ExitRowListPopupShow.
     */
    resetExitRowListPopupShow: function() {

      try {
        this.$logInfo('ModuleCtrl::Entering resetExitRowListPopupShow function');

        this._data.exitRowListPopupShow = {
          grpPaxInfos: []
        };
        this._data.exitRowListPopupcount = 0;
        this._data.exitRowListAnswerForAll = null;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in resetExitRowListPopupShow function',
          exception);
      }
    },


    /**
     * getExitRowListPopupShow
     * This method get the current ExitRowListPopupShow.
     */
    getExitRowListPopupShow: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getExitRowListPopupShow function');

        return this._data.exitRowListPopupShow;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getExitRowListPopupShow function',
          exception);
      }
    },

    /**
     * setSelectedEditpax
     * This method store the current passenger details.
     */
    setSelectedEditpax: function(val) {

      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedEditpax function');

        this._data.selectedEditpax = val;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedEditpax function',
          exception);
      }
    },


    /**
     * getSelectedEditpax
     * This method get the current passenger details.
     */
    getSelectedEditpax: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedEditpax function');
        if (!jQuery.isUndefined(this._data.selectedEditpax)) {
          return this._data.selectedEditpax;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedEditpax function',
          exception);
      }
    },

    /**
     * setPassengerDetails
     * This method store the current passenger email and phone details.
     */
    setPassengerDetails: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setPassengerDetails function');
        if(jQuery.isUndefined(this._data.passengerDetails))
        {
        this._data.passengerDetails = item;
        }else
        {
        	for(var j = 0; j < item.length; j++)
            {
        		var flag=false;
            	for (var i = 0; i < this._data.passengerDetails.length; i++) {
    	          if(this._data.passengerDetails[i].uniqueCustomerIdBean.primeId == item[j].uniqueCustomerIdBean.primeId)
    	      	  {
    	      		  this._data.passengerDetails[i]=item[j];
    	      		  flag=true;
    	      		  break;
    	      	  }
    	        }
            	if(!flag)
            	{
            		this._data.passengerDetails.push(item[j])
            	}
            }

        }

        for (var i = 0; i < this._data.passengerDetails.length; i++) {

          if (this._data.passengerDetails[i].phoneNumber) {
            this._data.passengerDetails[i]["areaCode"] = this._data.passengerDetails[i].phoneNumber.substring(0, 4);
            this._data.passengerDetails[i]["phoneNumberOnly"] = this._data.passengerDetails[i].phoneNumber.substring(4, this._data.passengerDetails[i].phoneNumber.length);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setPassengerDetails function',
          exception);
      }
    },


    /**
     * getPassengerDetails
     * This method get the current passenger email and phone details.
     */
    getPassengerDetails: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getPassengerDetails function');
        if (!jQuery.isUndefined(this._data.passengerDetails)) {
          return this._data.passengerDetails;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getPassengerDetails function',
          exception);
      }
    },

    /**
     * getBannerInfo
     * This method get the Banner details.
     */
    getBannerInfo: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getBannerInfo function');
        if (!jQuery.isUndefined(this._data.bannerInfo)) {
          return this._data.bannerInfo;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getBannerInfo function',
          exception);
      }
    },

    /**
     * setBannerInfo
     * This method set the selected passenger only.
     */
    setBannerInfo: function(item) {
      try {
        this.$logInfo('ModuleCtrl::Entering setBannerInfo function');
        this._data.bannerInfo = item;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setBannerInfo function',
          exception);
      }
    },

    /**
     * getEditCPR
     * This method get the current Edit which is generated after edit CPR flow. Otherwise it returns null.
     */
    getEditCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getEditCPR function');
        if (!jQuery.isUndefined(this._data.EditCPR)) {
          return this._data.EditCPR;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getEditCPR function',
          exception);
      }
    },

    /**
     * getProductLevel Errors
     * This method get the current ProductLevel Errrors which is generated after edit CPR flow. Otherwise it returns null.
     */
    getProductLevelErrors: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getProductLevelErrors function');
        if (!jQuery.isUndefined(this._data.prodErrorList)) {
          return this._data.prodErrorList;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getProductLevelErrors function',
          exception);
      }
    },

    /*
     * For hold all triplist
     * */

    getAllCPRList: function() {


      try {
        this.$logInfo('ModuleCtrl::Entering getAllCPRList function');
        if (!jQuery.isUndefined(this._data.CPRTripList[0])) {
          return this._data.CPRTripList;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAllCPRList function',
          exception);
      }
    },
    setAllCPRList: function(item) {
      this._data.CPRTripList.push(item);
    },

    /**
     * getSelectedPNR
     * This method get Selected PNR.
     */
    setSelectedPNR: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedPNR function');

        this._data.tripListSelectedPnrholder = val;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedPNR function',
          exception);
      }
    },
    /**
     * getSelectedPNR
     * This method get Selected PNR.
     */
    getSelectedPNR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedPNR function');
        if (!jQuery.isUndefined(this._data.tripListSelectedPnrholder)) {

          return this._data.tripListSelectedPnrholder;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedPNR function',
          exception);
      }
    },
    getFullJSON: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFullJSON function');
        var cpr = this.getCPR();
        var fulljson = {
          "customerLevel": cpr.customerLevel,
          "encryptedCode": cpr.encryptedCode
        }
        return fulljson;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getFullJSON function',
          exception);
      }
    },
    getGenError: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getGenError function');
        return this._data.genErrorJson;

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getGenError function',
          exception);
      }
    },

    getSeatNotLoaded: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSeatNotLoaded function');
        if (!jQuery.isUndefined(this._data.seatNotLoaded)) {
          return this._data.seatNotLoaded;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSeatNotLoaded function',
          exception);
      }
    },

    setSeatNotLoaded: function(code) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSeatNotLoaded function');
        this._data.seatNotLoaded = code;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSeatNotLoaded function',
          exception);
      }
    },

    getCancelEnable: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCancelEnable function');
        if (!jQuery.isUndefined(this._data.cancelCheckInEnable)) {
          return this._data.cancelCheckInEnable;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCancelEnable function',
          exception);
      }
    },

    setCancelEnable: function(cancelCheckInEnable) {
      try {
        this.$logInfo('ModuleCtrl::Entering setCancelEnable function');
        this._data.cancelCheckInEnable = cancelCheckInEnable;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setCancelEnable function',
          exception);
      }
    },


    /**
     * getAcceptedCPR
     * This method get the accepted CPR.
     */
    getAcceptedCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAcceptedCPR function');
        if (!jQuery.isUndefined(this._data.InitiateAccept)) {
          return this._data.InitiateAccept;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAcceptedCPR function',
          exception);
      }
    },

    /**
     * setAcceptedCPR
     * This method set the accepted CPR to null.
     */
    setAcceptedCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering setAcceptedCPR function');
        this._data.InitiateAccept = null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setAcceptedCPR function',
          exception);
      }
    },

    /**
     * setFlowType
     * This method set the flow type.
     */
    setFlowType: function(flow) {
      try {
        this.$logInfo('ModuleCtrl::Entering setFlowType function');
        this._data.flowType = flow;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setFlowType function',
          exception);
      }
    },

    /**
     * setDeliverDocument
     * This method set the flow type.
     */
    setDeliverDocument: function(del) {
      try {
        this.$logInfo('ModuleCtrl::Entering setDeliverDocument function');
        this._data.deliverDocument = del;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setDeliverDocument function',
          exception);
      }
    },

    /**
     * getoriginalSelectedCPR
     * This method get original selected CPR.
     */
    getoriginalSelectedCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getoriginalSelectedCPR function');
        if (!jQuery.isUndefined(this._data.originalSelectedCPR)) {
          return this._data.originalSelectedCPR;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getoriginalSelectedCPR function',
          exception);
      }
    },

    /**
     * setoriginalSelectedCPR
     * This method store original selected CPR.
     */
    setoriginalSelectedCPR: function(item) {
      try {
        this.$logInfo('ModuleCtrl::Entering setoriginalSelectedCPR function');
        this._data.originalSelectedCPR = item;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setoriginalSelectedCPR function',
          exception);
      }
    },
    /**
     * setSelectedPax
     * This method set the selected passenger and products.
     */
    setSelectedPax: function(selection) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedPax function');
        this._data.Selection = selection;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedPax function',
          exception);
      }
    },

    /**
     * setSelectedPaxOnly
     * This method set the selected passenger only.
     */
    setSelectedPaxOnly: function(selection) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedPaxOnly function');
        this._data.PaxSelection = selection;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedPaxOnly function',
          exception);
      }
    },

    /**
     * getSelectedPaxOnly
     * This method get the current passenger selection.
     */
    getSelectedPaxOnly: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedPaxOnly function');
        if (!jQuery.isUndefined(this._data.PaxSelection)) {
          return this._data.PaxSelection;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedPaxOnly function',
          exception);
      }
    },

    /**
     * getOtherDocumentType
     * This method get the current passenger selection.
     */
    getOtherDocumentType: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getOtherDocumentType function');
        if (!jQuery.isUndefined(this._data.othrDocType)) {
          return this._data.othrDocType;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getOtherDocumentType function',
          exception);
      }
    },

    clearOtherDocumentType: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering clearOtherDocumentType function');
        this._data.othrDocType = null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in clearOtherDocumentType function',
          exception);
      }
    },


    /**
     * setSelectedPaxPrimeRef
     * This method set the seat selected passenger prime and refQualifer.
     */
    setSelectedPaxPrimeRef: function(preallocateInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedPaxPrimeRef function');
        this._data.seatSelection = preallocateInput;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedPaxPrimeRef function',
          exception);
      }
    },

    /**
     * setSelectedProductForSeatMap
     * This method set the selected product for seat map
     */
    setSelectedProductForSeatMap: function(selection) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedProductForSeatMap function');
        this._data.SelectionForSeatMap = selection;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSelectedProductForSeatMap function',
          exception);
      }
    },

    /**
     * getSelectedProductForSeatMap
     * This method get the current selection.
     */
    getSelectedProductForSeatMap: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedProductForSeatMap function');
        if (!jQuery.isUndefined(this._data.SelectionForSeatMap)) {
          return this._data.SelectionForSeatMap;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedProductForSeatMap function',
          exception);
      }
    },



    /**
     * getSelectedPax
     * This method get the current selection.
     */
    getSelectedPax: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedPax function');
        if (!jQuery.isUndefined(this._data.Selection)) {
          return this._data.Selection;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedPax function',
          exception);
      }
    },

    /**
     * getDeliverDocument
     * This method get the FlowType.
     */
    getDeliverDocument: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getDeliverDocument function');
        if (!jQuery.isUndefined(this._data.deliverDocument)) {
          return this._data.deliverDocument;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getDeliverDocument function',
          exception);
      }
    },


    /**
     * getFlowType
     * This method get the FlowType.
     */
    getFlowType: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFlowType function');
        if (!jQuery.isUndefined(this._data.flowType)) {
          return this._data.flowType;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getFlowType function',
          exception);
      }
    },
    /**
     * getSelectedPax
     * This method get the current selection.
     */
    getSelectedPaxPrimeRef: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedPaxPrimeRef function');
        if (!jQuery.isUndefined(this._data.seatSelection)) {
          return this._data.seatSelection;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSelectedPaxPrimeRef function',
          exception);
      }
    },

    /**
     * getWarnings
     * This method get the Warnings if any.
     */
    getWarnings: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getWarnings function');
        if (!jQuery.isUndefined(this._data.Warnings)) {
          return this._data.Warnings;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getWarnings function',
          exception);
      }
    },

    /**
     * setWarnings
     * This method set the Warnings if any.
     */
    setWarnings: function(warning) {
      try {
        this.$logInfo('ModuleCtrl::Entering setWarnings function');
        if (warning == "") {
          this._data.Warnings = null;
        } else {
          this._data.Warnings = warning;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setWarnings function',
          exception);
      }
    },

    /**
     * getSuccess
     * This method get the Success if any.
     */
    getSuccess: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSuccess function');
        if (!jQuery.isUndefined(this._data.Success)) {
          return this._data.Success;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSuccess function',
          exception);
      }
    },

    /**
     * setSuccess
     * This method set the Success if any.
     */
    setSuccess: function(success) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSuccess function');
        if (success == "") {
          this._data.Success = null;
        } else {
          this._data.Success = success;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSuccess function',
          exception);
      }
    },

    setCountryCode: function(code) {
      try {
        this.$logInfo('ModuleCtrl::Entering setCountryCode function');
        if (code == "") {
          this._data.CountryCode = null;
        } else {
          this._data.CountryCode = code;
        }
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setCountryCode function',
          exception);
      }
    },

    getCountryCode: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCountryCode function');
        return this._data.CountryCode;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCountryCode function',
          exception);
      }
    },

    getFQTVOpAirline: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFQTVOpAirline function');
        return this._data.FQTVOpAirline;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getFQTVOpAirline function',
          exception);
      }
    },
    getFFnumberPrefillPassSelct: function(customer, product) {
      if (!jQuery.isUndefined(this._data.CPRIdentification)) {
        var temp = this._data.CPRIdentification.customerLevel[customer];
        //Check customerlevel for customer details -- more priority

        if (temp.customerLevelFqtvInfoBean && temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList) {
          if (temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList[0].carrier) {
            var FQTV = temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList[0];
            return FQTV.number;
          }

        }

        //Check productlevel for FF details
        if (temp.productLevelBean[product].fqtvInfoBean) {
          var FQTV = temp.productLevelBean[product].fqtvInfoBean[0];
          return FQTV.frequentTravellerDetails[0].number;
        }
        return "";
      }
    },

    /**
     * getFrequentTravelerNumber
     * This method get the FQTV for the customer.
     *
     * IF Phone FLAG IS THERE THEN CALLING TO PREFILL PHONE OTHERVISE CALLING TO PREFILL FQTV
     * customer -- CUSTOMER DETAILS
     * product -- ALWAYS 0
     *
     * custID -- unique customer id
     *
     */
    getPaxDetailsForPrefill: function(customer, product, custID, Phone) {
      try {
        this.$logInfo('ModuleCtrl::Entering getPaxDetailsForPrefill function');

        /* this._data.bannerInfo.firstName = "VDDD";
          this._data.bannerInfo.lastName = "TEST";
          this._data.bannerInfo.emailAddress = "one@one.com";
          this._data.bannerInfo.areaCode = "0023";
          this._data.bannerInfo.phoneNumber = "87921";
          this._data.bannerInfo.ffNumber = "87921"; */

        //FOR PREFILLING PHONE AND EMAIL
        if (Phone) {

        	var phoneNumber = "";
            var emailAddr = "";

          //First preference for Email and phonenumber
          if (this._data.passengerDetails) {
            for (var i = 0; i < this._data.passengerDetails.length; i++) {
              var temp = this._data.passengerDetails[i];
              if (customer == temp.custNumber) {
                phoneNumber = temp.phoneNumber;
                emailAddr = temp.email;
              }
            }
          }

          //Second preference for details is profile bean
          if (!jQuery.isUndefined(this._data.bannerInfo)) {
            var banner = this._data.bannerInfo;

            /** Find out FF number **/
            var ffnumberDetls = this.getFFnumberPrefillPassSelct(customer, product);
            /** End FF number **/
            if (ffnumberDetls == banner.ffNumber) {
              if (banner.areaCode && banner.phoneNumber && banner.areaCode != "" && banner.phoneNumber != "" && phoneNumber == "") {
                phoneNumber = banner.areaCode + banner.phoneNumber;
              }
              emailAddr = (banner.emailAddress && banner.emailAddress != "" && emailAddr == "") ? banner.emailAddress : emailAddr;


            } else if (banner.firstName == this._data.CPRIdentification.customerLevel[customer].otherPaxDetailsBean[0].givenName && banner.lastName == this._data.CPRIdentification.customerLevel[customer].customerDetailsSurname) {

              if (banner.areaCode && banner.phoneNumber && banner.areaCode != "" && banner.phoneNumber != "" && phoneNumber == "") {
                phoneNumber = banner.areaCode + banner.phoneNumber;
              }
              emailAddr = (banner.emailAddress && banner.emailAddress != "" && emailAddr == "") ? banner.emailAddress : emailAddr;

            }
          }

          //Third preference is actual details i.e from cpr identification
          if (!jQuery.isUndefined(this._data.CPRIdentification)) {
            var temp = this._data.CPRIdentification.customerLevel[customer];

            if(temp.contactNumberType && temp.contactNumberType.search(/^EM$/i) != -1 && emailAddr == "")
            {
            	 emailAddr = (temp.contactNumber && temp.contactNumber != "") ? temp.contactNumber : emailAddr;
            }else if(temp.contactNumberType && temp.contactNumberType.search(/^EM$/i) == -1 && phoneNumber == "")
            {
            	if(temp.contactNumber.charAt(0) == "+")
            	{
            		phoneNumber = temp.contactNumber.substring(1);
            	}else
            	{
            		phoneNumber = temp.contactNumber;
            	}
            	var noOfzeros="";
            	for(var i=4-phoneNumber.length;i>0;i--){
            		noOfzeros+="0";
            	}
            	phoneNumber=noOfzeros+phoneNumber;

            }


          }

          return phoneNumber + "~" + emailAddr;
        }

        //First Preference for prefill ffnumber
        if (!jQuery.isUndefined(this._data.EditCPR)) {

          var temp = this._data.EditCPR.customerLevel;

          for (var i = 0; i < temp.length; i++) {
            if (custID == temp[i].uniqueCustomerIdBean.primeId) {
              if (temp[i].productLevelBean[product].fqtvInfoBean) {
                var FQTV = temp[i].productLevelBean[product].fqtvInfoBean[0];
                if (typeof FQTV !== "undefined" && FQTV.frequentTravellerDetails != null && FQTV.frequentTravellerDetails[0] != null) {
                  return FQTV.frequentTravellerDetails[0].carrier + "~" + FQTV.frequentTravellerDetails[0].number;
                }
              }

            }
          }

        }

        //Second Preference for prefill ffnumber
        if (!jQuery.isUndefined(this._data.CPRIdentification)) {
          var temp = this._data.CPRIdentification.customerLevel[customer];
          //Check customerlevel for customer details -- more priority

          if (temp != null && temp.customerLevelFqtvInfoBean && temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList) {
            if (temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList[0].carrier) {
              var FQTV = temp.customerLevelFqtvInfoBean[0].frequentTravellerDetailList[0];
              return FQTV.carrier + "~" + FQTV.number
            }

          }

          //Check productlevel for FF details
          if (temp && temp.productLevelBean[product].fqtvInfoBean) {
            var FQTV = temp.productLevelBean[product].fqtvInfoBean[0];
            if (typeof FQTV !== "undefined" && FQTV.frequentTravellerDetails != null && FQTV.frequentTravellerDetails[0] != null) {
              return FQTV.frequentTravellerDetails[0].carrier + "~" + FQTV.frequentTravellerDetails[0].number;
            }
          }

        }

        //Third Preference for prefill ffnumber
        if (!jQuery.isUndefined(this._data.bannerInfo)) {
          var temp = this._data.bannerInfo;

          if (temp != null && temp.ffNumber && temp.firstName == this._data.CPRIdentification.customerLevel[customer].otherPaxDetailsBean[0].givenName && temp.lastName == this._data.CPRIdentification.customerLevel[customer].customerDetailsSurname) {
            return "SQ~" + temp.ffNumber;
          }
        }

        return "";
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getPaxDetailsForPrefill function',
          exception);
      }
    },



    /**
     * getFrequentTravelerNumber
     * This method get the FQTV for the customer.
     */
    getFQTV: function(customer, product, custID) {
      try {
        this.$logInfo('ModuleCtrl::Entering getFQTV function');
        var op_airline_conunt = -1;
        var grp_airline_conunt = -1;
        var op_airline_data, grp_airline_data;
        var t1 = 0;
        if (!jQuery.isUndefined(this._data.EditCPR)) {
          for (var i = 0; i < this._data.EditCPR.customerLevel.length; i++) {
            var temp = this._data.EditCPR.customerLevel[i].productLevelBean[product];
            for (var j = 0; j < temp.productIdentifiersBean.length; j++) {
              if (temp.productIdentifiersBean[j].primeId == custID) {
                if (temp.fqtvInfoBean) {
                  var item = temp.fqtvInfoBean[0].frequentTravellerDetails;
                  for (fqtv in item) {
                    if (this._data.parameters.SITE_MCI_OP_AIRLINE) {
                      if ((t1 = this._data.parameters.SITE_MCI_OP_AIRLINE.toUpperCase().split(",").indexOf(item[fqtv].carrier.toString())) != "-1") {
                        if (op_airline_data == undefined || op_airline_data > t1) {
                          op_airline_data = t1;
                          op_airline_conunt = i;
                        }
                      }
                    }

                    if (this._data.parameters.SITE_MCI_GRP_OF_AIRLINES) {
                      if ((t1 = this._data.parameters.SITE_MCI_GRP_OF_AIRLINES.toUpperCase().split(",").indexOf(item[fqtv].carrier.toString())) != "-1") {
                        if (grp_airline_data == undefined || grp_airline_data > t1) {
                          grp_airline_data = t1;
                          grp_airline_conunt = i;
                        }

                      }

                    }

                  }

                  if (op_airline_conunt != "-1") {
                    this._data.FQTVOpAirline = item[op_airline_conunt].carrier;
                    return item[op_airline_conunt].number;
                  } else if (grp_airline_conunt != "-1") {
                    this._data.FQTVOpAirline = item[op_airline_conunt].carrier;
                    return item[op_airline_conunt].number;
                  } else
                    return "Not Added";

                } else
                  return "Not Added";
              }
            }
          }
        }
        if (!jQuery.isUndefined(this._data.CPRIdentification)) {
          for (var i = 0; i < this._data.CPRIdentification.customerLevel.length; i++) {
            var temp = this._data.CPRIdentification.customerLevel[i].productLevelBean[product];
            for (var j = 0; j < temp.productIdentifiersBean.length; j++) {
              if (temp.productIdentifiersBean[j].primeId == custID) {
                if (temp.fqtvInfoBean) {
                  var item = temp.fqtvInfoBean[0].frequentTravellerDetails;
                  for (fqtv in item) {
                    if (this._data.parameters.SITE_MCI_OP_AIRLINE) {
                      if ((t1 = this._data.parameters.SITE_MCI_OP_AIRLINE.toUpperCase().split(",").indexOf(item[fqtv].carrier.toString())) != "-1") {
                        if (op_airline_data == undefined || op_airline_data > t1) {
                          op_airline_data = t1;
                          op_airline_conunt = i;
                        }
                      }
                    }

                    if (this._data.parameters.SITE_MCI_GRP_OF_AIRLINES) {
                      if ((t1 = this._data.parameters.SITE_MCI_GRP_OF_AIRLINES.toUpperCase().split(",").indexOf(item[fqtv].carrier.toString())) != "-1") {
                        if (grp_airline_data == undefined || grp_airline_data > t1) {
                          grp_airline_data = t1;
                          grp_airline_conunt = i;
                        }

                      }

                    }

                  }

                  if (op_airline_conunt != "-1") {
                    this._data.FQTVOpAirline = item[op_airline_conunt].carrier;
                    return item[op_airline_conunt].number;
                  } else if (grp_airline_conunt != "-1") {
                    this._data.FQTVOpAirline = item[op_airline_conunt].carrier;
                    return item[op_airline_conunt].number;
                  } else
                    return "Not Added";

                } else
                  return "Not Added";
              }
            }
          }
        }

        return "Not Added";

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getFQTV function',
          exception);
      }
    },

    /**
     * getSeatNumber
     * This method get the FQTV for the customer.
     */
    getSeat: function(customer, product, custID) {
      try {
        this.$logInfo('ModuleCtrl::Entering getSeat function');
        /*if(!jQuery.isUndefined(this._data.AllocatedSeats)){
           var temp = this._data.AllocatedSeats;
           for(var j=0; j < temp.length; j++){
          if(temp[j].primeId == custID){
           return temp[j].Seat;
                }
              }
              }


        if(!jQuery.isUndefined(this._data.AllocateSeat)){

          for (var i=0 ; i < this._data.AllocateSeat.segmentInfos.length ; i++){
            var temp = this._data.AllocateSeat.segmentInfos[i].seatResponseInfos[0];
            for (var j=0 ; j < temp.passengerInfos.length ; j++) {
              if ( temp.passengerInfos[j].IDSections[0].ID == custID) {
                if (temp.ssrDataDetails[j] && temp.ssrDataDetails[j].seatNumber)
                  return temp.ssrDataDetails[j].seatNumber;
                else
                  return "Not Added";
              }
            }
          }
        }*/
        if (this._data.StoreSelectedSeats) {
          if (this._data.StoreSelectedSeats[custID]) {
            return this._data.StoreSelectedSeats[custID];
          }
        }
        if (!jQuery.isUndefined(this._data.CPRIdentification)) {
          for (var i = 0; i < this._data.CPRIdentification.customerLevel.length; i++) {
            var temp = this._data.CPRIdentification.customerLevel[i].productLevelBean[product];
            for (var j = 0; j < temp.productIdentifiersBean.length; j++) {
              if (temp.productIdentifiersBean[j].primeId == custID) {
                if (temp.legLevelBean[0].seatBean && temp.legLevelBean[0].seatBean.seatDetailsSeatNumber != null && temp.legLevelBean[0].seatBean.seatDetailsSeatNumber != "") {
                  return temp.legLevelBean[0].seatBean.seatDetailsSeatNumber;
                } else {
                  return "Not Added";
                }
              }
            }
          }
        }

        return "Not Added";

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSeat function',
          exception);
      }
    },

    /**
     * getEditCPR
     * This service retireves the checkRegulatory json.
     */
    getNatEditCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getNatEditCPR function');
        if (!jQuery.isUndefined(this._data.NatEditCPR)) {
          return this._data.NatEditCPR;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getNatEditCPR function',
          exception);
      }
    },

    /**
     * getCheckReg
     * This service retireves the checkRegulatory json.
     */
    getCheckReg: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCheckReg function');
        if (!jQuery.isUndefined(this._data.CheckReg)) {
          return this._data.CheckReg;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCheckReg function',
          exception);
      }
    },
    /**
     * getSeatMapResponse
     * This service retireves the seat map json.
     */
    getSeatMapResponse: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSeatMapResponse function');
        if (!jQuery.isUndefined(this._data.seatMapResponse)) {
          return this._data.seatMapResponse;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getSeatMapResponse function',
          exception);
      }
    },
    /**
     * getSeatMapResponse
     * This service retireves the seat map json.
     */
    setSeatMapResponseEmpty: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering setSeatMapResponseEmpty function');

        this._data.seatMapResponse = [];

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setSeatMapResponseEmpty function',
          exception);
      }
    },

    /**
     * getAllocatedSeats
     * This service retireves the Allocated seat map json.
     */
    getAllocatedSeats: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getAllocatedSeats function');
        if (!jQuery.isUndefined(this._data.AllocatedSeats)) {
          return this._data.AllocatedSeats;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getAllocatedSeats function',
          exception);
      }
    },

    /**
     * getSeatMapResponse
     * This service retireves the seat map json.
     */
    setAllocatedSeats: function(AllocatedSeat) {
      try {
        this.$logInfo('ModuleCtrl::Entering setAllocatedSeats function');

        if (AllocatedSeat == "") {
          this._data.AllocatedSeats = [];
        } else {
          this._data.AllocatedSeats = AllocatedSeat;
        }

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setAllocatedSeats function',
          exception);
      }
    },


    setCPRRespError: function(errors) {
      try {
        this.$logInfo('ModuleCtrl::Entering setCPRRespError function');
        this._data.CPRErrors = errors;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setCPRRespError function',
          exception);
      }

    },
    getCPRRespError: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCPRRespError function');
        return this._data.CPRErrors;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCPRRespError function',
          exception);
      }
    },
    /**
     * updateLayout
     * This service update the layout to be displayed based on the new one in parameter.
     */
    updateLayout: function(nextLayout, errors) {
      try {
        this.$logInfo('ModuleCtrl::Entering updateLayout function:::' + nextLayout);
        if (this._data.layout.current === null ||
          this._data.layout.current === "") {
          this._data.layout.transition = '';
          this._data.layout.current = nextLayout;
          Aria.loadTemplate({
            classpath: 'modules.checkin.templates.layouts.Body',
            moduleCtrl: this,
            div: "layout",
            args: [errors]
          });
          this._data.layout.history.push(nextLayout);
          jQuery('#splashScreen').hide();
        } else {
          if (this._data.layout.current != nextLayout) {
            var lastLayout = this._data.layout.history[this._data.layout.history.length - 2];
            if (lastLayout == nextLayout) {
              this._data.layout.transition = 'reverse';
              this._data.layout.history.pop();
            } else {
              this._data.layout.transition = '';
              this._data.layout.history.push(nextLayout);
            }
            this._data.layout.current = nextLayout;
          }
          this.raiseEvent({
            "name": "layout.body.updated"
          });
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in updateLayout function',
          exception);
      }
    },

    loadHome: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadHome function');
        // we will call the load function to load the page
        this.appCtrl.load("merci-checkin-MCheckinIndex_A");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in loadHome function',
          exception);
      }

    },

    loadHomeForTripList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadHomeForTripList function');
        // we will call the load function to load the page
        this.submitJsonRequest("checkinFlow", " ", {
          scope: this,
          fn: this.__checkinCallBack
        });
        //this.appCtrl.load("merci-checkin-MCheckinIndex_A");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in loadHomeForTripList function',
          exception);
      }
    },


    setOperatingAirlinesList: function(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines) {

      var airlinesOperating = site_mci_op_airline + "," + site_mci_grp_of_airlines;
      var configuredAirlinesDesc = "";


      for (var i = 0; i < airlineDl.length > 0; i++) {
        var airline = airlineDl[i];
        var airlineCode = airline[0];
        if (airlinesOperating.indexOf(airlineCode) != -1) {
          configuredAirlinesDesc += airlineCode + ":" + airline[1] + ",";
        }
      }

      this._data.operatingAirlineList = configuredAirlinesDesc.substring(0, configuredAirlinesDesc.length - 1);
    },

    getOperatingAirlinesList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getOperatingAirlinesList function');
        if (!jQuery.isUndefined(this._data.operatingAirlineList)) {
          return this._data.operatingAirlineList;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getOperatingAirlinesList function',
          exception);
      }
    },


    __checkinCallBack: function(res) {
      try {
        var json = this.getModuleData();
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];


        // navigate to next page
        //this.moduleCtrl.navigate(null, nextPage);
        this.appCtrl.load(nextPage);
      } catch (exception) {
        this.$logError("Errors");
      }

    },

    tripOverView: function(cprInput) {
      try {
        //jQuery("#pageErrors").disposeTemplate();
        this.setLastName(cprInput.lastName);
        this.$logInfo('ModuleCtrl::Entering tripOverView function');
        var _this = this;
        this.submitJsonRequest("ICPRIdentification", cprInput, {
          scope: this,
          fn: "__tripOverViewCallback",
          args: cprInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in tripOverView function',
          exception);
      }
    },

    setNotRetrievedLastNames: function(notRetrievedLastNameList) {
      try {
        this.data.notRetrievedLastNameList = notRetrievedLastNameList;
        return null;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setNotRetrievedLastNames function',
          exception);
      }
    },

    getNotRetrievedLastNames: function(notRetrievedLastNameList) {
      try {
        this.$logInfo('ModuleCtrl::Entering getCPR function');
        if (!jQuery.isUndefined(this.data.notRetrievedLastNameList)) {
          return this.data.notRetrievedLastNameList;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setNotRetrievedLastNames function',
          exception);
      }
    },

    __tripOverViewCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __tripOverViewCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var errors = [];
        var json = {};
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = res.data.model.CPRIdentification;
          this._data.CPRIdentification = json;
          this.$load("checkin/TripOverview");
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __tripOverViewCallback function',
          exception);
      }
    },

    /**
     * cprRetreive
     * This method is used to retrive a cpr.
     */
    cprRetreive: function(cprInput) {
      try {
        this.setLastName(cprInput.lastName);
        jQuery("#pageErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering cprRetreive function');
        this.submitJsonRequest("ICPRIdentification", cprInput, {
          scope: this,
          fn: this.__cprRetreiveCallback,
          args: cprInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in cprRetreive function',
          exception);
      }
    },

    /**
     * __cprRetreiveCallback
     * This method is the callback method for the cprRetreive action.
     */

    __cprRetreiveCallback: function(res, cprInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering __cprRetreiveCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var errors = [];
        var json = {};
        this._data.firstTimeLoad = 0;
        var warnings = [];
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else {
          this._data.EditCPR = null;
          this._data.NatEditCPR = null;
          if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

            // getting next page id
            var nextPage = res.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

            if (dataId == 'MCheckinIndex_A') {
              if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam && res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam) {
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

                } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError) {
                  if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError["3001"]) {
                    errors.push({
                      "localizedMessage": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[3001].localizedMessage,
                      "code": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[3001].code
                    });
                  } else {
                    errors.push({
                      "localizedMessage": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[21400069].localizedMessage,
                      "code": res.responseJSON.data.checkIn.MCheckinIndex_A.errorStrings[21400069].code
                    });
                  }

                } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired) {
                  errors.push({
                    "localizedMessage": genErrors
                  });
                }
              }

              if (errors.length > 0) {
                this.displayErrors(errors, "pageErrors", "error");
                return null;
              }
              if (warnings.length > 0) {
                this.displayErrors(warnings, "pageErrors", "warning");
              }

            } else {
              // setting data for next page

            	/*
                 * resetting checkin index error so that it wont be displayed again when go back
                 * */
                var tempRes = {};
                tempRes.responseJSON = jsonResponse;
                if (tempRes.responseJSON.data.checkIn && tempRes.responseJSON.data.checkIn.MCheckinIndex_A && tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam) {
                  var TempCPRIdentification = tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.CPRIdentification;
                  if (TempCPRIdentification && TempCPRIdentification.MCIUserErrors != null && TempCPRIdentification.MCIUserErrors.mciUsrErrBean.length > 0) {
                    TempCPRIdentification.MCIUserErrors.mciUsrErrBean.length=0;
                  }
                  if (tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError != null)
                  {
                  	tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError=undefined;
                  }
                  if (tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired != null)
                  {
                  	tempRes.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired=undefined;
                  }
                }


              localStorage.lstName = this.getLastName();

              if (cprInput.IdentificationType == "frequentFlyerNumber") {
                localStorage.ffNumber = cprInput.ffNumber;
              }

              var json = this.getModuleData();
              this._data.firstTimeLoad = 0;
              this.setTelephoneNumberList(res.responseJSON.data.checkIn[dataId].telephoneNumList);
              this._data.parameters = res.responseJSON.data.checkIn[dataId].parameters;
              this._data.CPRIdentification = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification;
              this._data.bannerInfo = res.responseJSON.data.checkIn[dataId].requestParam.ProfileBean;
              this.setCancelEnable(true); //To ensure that once the boarding pass is issues the cancel checkin options are not there.
              this.setIsAnyValidAppPax(true);
              this.setValidApp(true);
              this.setBoardingPassNtIssued(true);
              var toReset = [];
              this.setAcceptedCprValidApp(toReset); //reset the acceptedcpr whose app is valid
              this.setBlackListOverBooked(false); //reset to ensure that there is no blacklisted pax.
              this._data.isAcceptanceConfirmation = false;
              json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
              // navigate to next page
              //this.moduleCtrl.navigate(null, nextPage);
              this.appCtrl.load(nextPage);
            }
          }

          if (jsonResponse.data.framework.sessionId || jsonResponse.data.framework.sessionId == null) {
            this.setSessionId(jsonResponse.data.framework.sessionId);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __cprRetreiveCallback function',
          exception);
      }
    },

    validateEmail: function(test) {
      try {
        this.$logInfo('ModuleCtrl::Entering validateEmail function');
        var x = test.indexOf('@');
        var y = test.lastIndexOf('.');

        if (x == -1 || y == -1 || (x + 2) >= y) {
          return false;
        } else {
          return true;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in validateEmail function',
          exception);
      }
    },
    validatePhoneNumber: function(number) {
      try {
        this.$logInfo('ModuleCtrl::Entering validatePhoneNumber function');
        var regEx = new RegExp(/^([0-9])+$/);
        if (!(regEx.test(number))) {
          return false;
        } else {
          var flag = 0;
          for (var i in this._data.telephoneNumberList) {
            if (this._data.telephoneNumberList[i].callingCode == number.substring(0, 4)) {
              flag = 1;
              break;
            }
          }
          if (flag == 1) {
            return true;
          } else {
            return false;
          }

        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in validatePhoneNumber function',
          exception);
      }
    },

    /**
     * acceptanceOverview_load
     * This method is used to display the overview.
     */
    acceptanceOverview_load: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering acceptanceOverview_load function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        this.appCtrl.load("merci-checkin-MAcceptanceOverview_A");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in acceptanceOverview_load function',
          exception);
      }
    },

    /**
     * selectFlights_load
     * This method is used to display the select flight screen.
     */
    selectFlights_load: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering selectFlights_load function');
        //modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        this.appCtrl.load("merci-checkin-MSelectFlights_A");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in selectFlights_load function',
          exception);
      }
    },

    /** passengerDetailsLoad
     * To load edit passenger details
     */

    passengerDetailsLoad: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering passengerDetailsLoad function');
        this.submitJsonRequest("passengerDetails", "", {
          scope: this,
          fn: this.__passengerDetailsCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in passengerDetailsLoad function',
          exception);
      }
    },

    /**
     * Callback from passenger Details load call
     *
     */
    __passengerDetailsCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __passengerDetailsCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        var json = this.getModuleData();
        if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          this._data.bannerInfo = res.responseJSON.data.checkIn.MPassengerDetails_A.requestParam.ProfileBean;
          this._data.setErrorStrings = res.responseJSON.data.checkIn.MPassengerDetails_A.errorStrings;
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          this.appCtrl.load(nextPage);
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __passengerDetailsCallback function',
          exception);
      }
    },
    /**
     * acceptanceConfirmation_load
     * This method is used to display the edit cpr page.
     */

    loadEditCpr: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadEditCpr function');
        this.submitJsonRequest("LoadEditCPR", "", {
          scope: this,
          fn: this.__loadEditCprCallBack
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in loadEditCpr function',
          exception);
      }
    },

    __loadEditCprCallBack: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __loadEditCprCallBack function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var errors = [];
        var json = {};
        var warnings = [];
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else {
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
          {

            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MCheckinIndex_A");
          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.bannerInfo = res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.ProfileBean;
            this._data.setErrorStrings = res.responseJSON.data.checkIn.MRequiredDetails_A.errorStrings;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);
            this.appCtrl.load(nextPage);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __loadEditCprCallBack function',
          exception);
      }
    },

    /**
     * acceptanceConfirmation_load
     * This method is used to display the confirmation.
     */
    acceptanceConfirmation_load: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering acceptanceConfirmation_load function');
        this.submitJsonRequest("ManageCheckin", "", {
          scope: this,
          fn: this.__manageCheckinCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in acceptanceConfirmation_load function',
          exception);
      }
    },



    __manageCheckinCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __manageCheckinCallback function');
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        //modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var errors = [];
        var json = {};
        var warnings = [];
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else {
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
          {
            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MCheckinIndex_A");
          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.bannerInfo = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.requestParam.ProfileBean;
            this._data.setErrorStrings = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.errorStrings;
            this._data.errorStrings = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.errorStrings;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);
            this.appCtrl.load(nextPage);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __manageCheckinCallback function',
          exception);
      }
    },


    /**
     * acceptanceOverview_load
     * This method is used to display the overview.
     */

    editFqtv: function(editFqtvInput) {
      try {
        jQuery("#initiateandEditErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering editFqtv function');
        this.submitJsonRequest("IEditFqtv", editFqtvInput, {
          scope: this,
          fn: this.__fqtvEidtcprCallback,
          args: editFqtvInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in editFqtv function',
          exception);
      }
    },

    /**
     * __fqtvEidtcprCallback
     * This method is the callback method for the eidtFqtv action.
     */
    __fqtvEidtcprCallback: function(res, editFqtvInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering __fqtvEidtcprCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        var errors = [];
        var warnings = [];
        var success = [];
        var json = {};
        var cpr = this.getCPR();
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
          //errors.push({"localizedMessage":this._data.uiErrors[25000046].localizedMessage});
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {

          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          if (dataId == 'MPassengerDetails_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MPassengerDetails_A.requestParam && res.responseJSON.data.checkIn.MPassengerDetails_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MPassengerDetails_A.requestParam.EditcprBean;
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

              } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError) {
                errors.push({
                  "localizedMessage": genErrors
                });
              } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired) {
                errors.push({
                  "localizedMessage": genErrors
                });
              }
            }

            if (errors != null && errors.length > 0) {
              /*if(typeof editFqtvInput.selectedCPR[0].customer == "object")
                          {
                          var val_current=editFqtvInput.selectedCPR[0].customer[ii]+1;
                          }else
                          {
                            var val_current=editFqtvInput.selectedCPR[0].customer+1;
                          }
                          jQuery('#mycarousel').jcarousel('scroll', val_current, false);
*/

              this.displayErrors(errors, "initiateandEditErrors", "error");

              return null;
            }

          } else {
            //this._data.EditCPR = res.responseJSON.data.checkIn[dataId].requestParam.EditcprBean;
            var json = res.responseJSON.data.checkIn[dataId].requestParam.EditcprBean;
            // We load the json to the datamodel
            if (!this._data.EditCPR || json.customerLevel.length > 1) {
              this._data.EditCPR = json;
            } else {
              var flag = 0;
              for (var i in this._data.EditCPR.customerLevel) {
                if (json.customerLevel[0].uniqueCustomerIdBean.primeId != this._data.EditCPR.customerLevel[i].uniqueCustomerIdBean.primeId) {
                  flag++;
                } else {
                  this._data.EditCPR.customerLevel[i] = json.customerLevel[0];
                }
              }
              if (flag == this._data.EditCPR.customerLevel.length) {
                this._data.EditCPR.customerLevel.push(json.customerLevel[0]);
              }
            }

            // In case of error

            this._data.uiErrors = res.responseJSON.data.checkIn[dataId].errorStrings;

            // In case of Warnings
            if (warnings != null && warnings.length > 0) {
              if (this._data.Warnings != null) {
                this._data.Warnings = null;
              }
              this._data.Warnings = warnings;
            }

            //incase Of Success
            if (this._data.Success != null) {
              this._data.Success = null;
            }
            success.push(this._data.uiErrors[21300051]); //this._data.uiErrors[21300051].localizedMessage
            this.setSuccess(success);

            var selectedCust = jQuery(".PaxSelectionScreen").eq("0").attr("data-selected-cust");
            selectedCust = selectedCust.substr(0, selectedCust.length - 1);
          }
          this.appCtrl.load(nextPage);
        }



        //this.raiseEvent({"name":"fqtv.updated.loaded" , "args" : editFqtvInput});
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __fqtvEidtcprCallback function',
          exception);
      }
    },
    changeSeat: function(seatMapInput) {
      try {
        jQuery("#initiateandEditErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering seatMap function');
        this.submitJsonRequest("ISeatMap", seatMapInput, {
          scope: this,
          fn: this.__changeSeatCallback,
          args: seatMapInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __changeSeatCallback function',
          exception);
      }
    },

    __changeSeatCallback: function(res, seatMapInput) {

      try {
        this.$logInfo('ModuleCtrl::Entering __changeSeatCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();

        var errors = [];
        var warnings = [];
        var json = {};
        // getting next page id
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = res.responseJSON.data.checkIn.MSeatMapNew_A.requestParam.SeatMapBean;

          // We check for errors
          if (json.applicationErrors != null) {
            for (var i = 0; i < json.applicationErrors.length; i++) {
              var code = json.applicationErrors[i].errorOrWarningCodeDetailsErrorCode;
              var category = json.applicationErrors[i].errorOrWarningCodeDetailsErrorCategory;
              if (category == "EC") {
                for (var k = 0; k < json.applicationErrors[i].errorWarningDescription.freeTexts.length; k++) {
                  //errors.push({"localizedMessage":this._data.uiErrors[21400071].localizedMessage});
                  errors.push({
                    "localizedMessage": this._data.uiErrors[25000058].localizedMessage,
                    "code": this._data.uiErrors[25000058].errorid
                  });
                  //errors.push({"localizedMessage":json.applicationErrors[i].errorWarningDescription.freeTexts[k],"code":code});
                }

              }
              /*else if (category == "WEC") {
                      for (var k=0 ; k < json.applicationErrors[i].errorWarningDescription.freeTexts.length ; k++){
                        warnings.push({"localizedMessage":json.applicationErrors[i].errorWarningDescription.freeTexts[k],"code":code});
                      }
                  }*/
            }
          }
        }

        // In case of error
        if (errors != null && errors.length > 0) {
          this.displayErrors(errors, "initiateandEditErrors", "error");
          return null;
        }

        // In case of Warnings
        if (this._data.Warnings != null) {
          this._data.Warnings = null;
        }
        if (warnings != null && warnings.length > 0) {
          this._data.Warnings = warnings;
        }
        // We load the json to the datamodel
        var selPax = this.getSelectedPax();
        if (selPax && selPax.length > 0 && selPax[0].customer && selPax[0].customer.length > 0) {
          var index = selPax[0].customer[seatMapInput.i];
          this._data.seatMapResponse.push({
            "customerIndex": index,
            "seatMapResp": json
          });

        }

        // we will call the load function to load the page
        if (seatMapInput.firstOne == undefined || seatMapInput.firstOne == null) {
          seatMapInput.firstOne = seatMapInput.i;
        }
        if (seatMapInput.i == seatMapInput.firstOne) {
          var json = this.getModuleData();
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          this.appCtrl.load("merci-checkin-MSeatMapNew_A");
          jQuery('#splashScreen').show();
          jQuery('#overlayCKIN').show();
          setTimeout(function() {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#splashScreen').hide();
            jQuery('#overlayCKIN').hide();

          }, 5000);
        }
        /*if(seatMapInput.i == 0){
            this.$load("checkin/SeatMap");
            }*/
        var cpr = this.getCPR();
        seatMapInput.i = seatMapInput.i + 1;
        if (seatMapInput.i != selPax[0].customer.length) {
          for (; cpr.customerLevel[selPax[0].customer[seatMapInput.i]].customerDetailsType == "IN"; seatMapInput.i++) {

          }
          var infantPrimeId;
          for (var jjj in cpr.customerLevel[selPax[0].customer[seatMapInput.i]].productLevelBean[0].productIdentifiersBean) {
            if (cpr.customerLevel[selPax[0].customer[seatMapInput.i]].productLevelBean[0].productIdentifiersBean[jjj].referenceQualifier == "JID") {
              infantPrimeId = cpr.customerLevel[selPax[0].customer[seatMapInput.i]].productLevelBean[0].productIdentifiersBean[jjj].primeId;

            }
          }

          if (infantPrimeId != undefined) {
            for (var jjj in cpr.customerLevel) {
              for (var kkk in cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean) {
                if (cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean[kkk].primeId == infantPrimeId) {
                  infantPrimeId = parseInt(jjj);

                }
              }


            }

          }

          var cust = [];
          //if(seatMapInput.i > 0 && seatMapInput.i < selPax[0].customer.length) {
          if (seatMapInput.i < selPax[0].customer.length) {
            cust[0] = selPax[0].customer[seatMapInput.i];
            var selectedCPRList = [];
            if (infantPrimeId != undefined) {
              var custWithInfant = [cust[0], infantPrimeId];


            } else {
              var custWithInfant = [cust[0]];
            }
            selectedCPRList.push({
              "product": seatMapInput.selectedCPR[0].product,
              "customer": custWithInfant
            });
            seatMapInput.selectedCPR = selectedCPRList;
          }

          this.submitJsonRequest("ISeatMap", seatMapInput, {
            scope: this,
            fn: this.__changeSeatCallback,
            args: seatMapInput
          });
        } else {
          this.raiseEvent({
            "name": "seatMap.loaded"
          })
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __changeSeatCallback function',
          exception);
      }
    },


    /**
     * nationalityEdit
     * This method is used to edit nationality.
     */
    nationalityEdit: function(nationalityEditInput) {
      try {
        this._data.nationalityEditInput = nationalityEditInput;
        this.$logInfo('ModuleCtrl::Entering nationalityEdit function');
        this.submitJsonRequest("INationalityEdit", nationalityEditInput, {
          scope: this,
          fn: this.__INationalityEditCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in nationalityEdit function',
          exception);
      }
    },

    /**
     * __INationalityEditCallback
     * This method is the callback method for the nationalityEdit action.
     */
    __INationalityEditCallback: function(res, nationalityEditInput) {
      try {

        var errors = [];
        var warnings = [];
        var json = {};
        // getting next page id
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.EditcprBean;

          // We check for errors
          if (json.error != null) {
            for (var i = 0; i < json.error.length; i++) {
              var code = json.error[i].errorCodeErrorCode;
              var category = json.error[i].errorCodeErrorCategory;
              if (category == "EC") {
                for (var j = 0; j < json.error[i].errorTextBean.length; j++) {
                  for (var k = 0; k < json.error[i].errorTextBean[j].freeTexts.length; k++) {
                    /* In case of invalid country code entered we have show a proper error message. */
                    if (code == "18087") {
                      errors.push({
                        "localizedMessage": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings[25000118].localizedMessage,
                        "code": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings[25000118].errorid
                      });
                    } else {
                      errors.push({
                        "localizedMessage": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings[21400077].localizedMessage,
                        "code": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings[21400077].errorid
                      });
                    }
                    //errors.push({"localizedMessage":this._data.uiErrors[21400077].localizedMessage});
                    //errors.push({"localizedMessage":json.error[i].errorTextBean[j].freeTexts[k],"code":code});
                  }
                }
              }
              /*else if (category == "WEC") {
                for (var j=0 ; j < json.error[i].errorTextBean.length ; j++) {
                  for (var k=0 ; k < json.error[i].errorTextBean[j].freeTexts.length ; k++){
                    warnings.push({"localizedMessage":json.error[i].errorTextBean[j].freeTexts[k],"code":code});
                  }
                }
              }*/
            }
          }
        }
        // In case of error
        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.displayErrors(errors, "natErrors", "error");
          return null;
        }

        // In case of Warnings
        if (warnings != null && warnings.length > 0) {
          if (this._data.NationalityWarnings != null) {
            this._data.NationalityWarnings = null;
          }
          this._data.NationalityWarnings = warnings;
        }
        var nationalityEditInput = this._data.nationalityEditInput;
        jQuery("#" + nationalityEditInput.nationalityId).attr("readonly", "readonly");
        jQuery("#" + nationalityEditInput.nationalityId).next().attr("disabled", "disabled");
        jQuery("#" + nationalityEditInput.nationalityId).next().addClass("disabled");
        jQuery("#psp_Country_issue_" + nationalityEditInput.currentCust + "_" + nationalityEditInput.currentProduct).val(jQuery("#nationality_code_" + nationalityEditInput.currentCust + "_" + nationalityEditInput.currentProduct).val());
        // We load the json to the datamodel
        if (!this._data.NatEditCPR) {
          this._data.NatEditCPR = json;
        } else {
          var flag = 0;
          for (var i in this._data.NatEditCPR.customerLevel) {
            if (json.customerLevel[0].uniqueCustomerIdBean.primeId != this._data.NatEditCPR.customerLevel[i].uniqueCustomerIdBean.primeId) {
              flag++;
            }
          }
          if (flag == this._data.NatEditCPR.customerLevel.length) {
            this._data.NatEditCPR.customerLevel.push(json.customerLevel[0]);
          }
        }

        this.checkRegulatory();

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __INationalityEditCallback function',
          exception);
      }
    },

    /**
     * checkRegulatory
     * This method is used to check the regulatory requirements.
     */
    checkRegulatory: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering checkRegulatory function');
        //To Findout APIS(US) route or not
        this._data.isApisEligible = false;
        this._data.selectedPaxUniqID = [];
        this.findUSAinselectedcprForAPISinRegPage();
        var cpr = this.getFullJSON();
        var cpr_selcted = this.getCPR();
        var selCPR = this.getSelectedPax();

        /*For getting flight ids based on pax selected*/
        var selectpaxforprimeid = selCPR;
        for (var j = 0; j < selectpaxforprimeid[0]["customer"].length; j++) {
          for (var i = 0; i < selectpaxforprimeid.length; i++) {
            this._data.selectedPaxUniqID.push(cpr_selcted.customerLevel[selectpaxforprimeid[0]["customer"][j]].productLevelBean[selectpaxforprimeid[i]["product"]].productIdentifiersBean[0].primeId);
          }
        }

        var checkRegulatoryInput = {
          "selectedCPR": selCPR,
          "selectedProdList": this._data.selectedPaxUniqID
        }
        this.submitJsonRequest("ICheckRegulatory", checkRegulatoryInput, {
          scope: this,
          fn: this.__ICheckRegulatoryCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in checkRegulatory function',
          exception);
      }
    },

    /**
     * __ICheckRegulatoryCallback
     * This method is the callback method for the checkRegulatory action.
     */
    __ICheckRegulatoryCallback: function(res) {
      try {
        this._data.selectedPaxUniqID = [];
        var errors = [];
        var warnings = [];
        var json = {};

        /*
         * If res itself empty, stop user in select flight page itself
         * */
        if(jQuery.isUndefined(res))
        {
        	var tempLabel=jsonResponse.data.checkIn.MCPRRetrieveSinglePax_A?jsonResponse.data.checkIn.MCPRRetrieveSinglePax_A:jsonResponse.data.checkIn.MCPRRetrieveMultiPax_A;

        	modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#splashScreen').hide();
            jQuery('#overlayCKIN').hide();
            this.displayErrors([{"localizedMessage":tempLabel.errorStrings[503003].localizedMessage}], "nationalityErrors", "error");
            return null;
        }

        // getting next page id
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          // We check for errors
          if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null && res.responseJSON.data.checkIn.MAcceptanceOverview_A != null) {


            var json = this.getModuleData();
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // We load the json to the datamodel
            this._data.CheckReg = res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.CheckRegulatoryBean;

            /*
             * For updating doc check required flag which will be useful for enableing disabling MBP, SPBP
             *
             * indicator - docCheckRequired
             * */
            this.forUpdateGetCPRbasedOnRegRequest(res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.EditCprBean);

            /*
             *
             * For redress and known travel information
             *
             * */
            for (var i = 0; i < this._data.CheckReg.regulatoryDetails.length; i++) {
              var prodListLength = this._data.CheckReg.regulatoryDetails[i].productLevelList.length;
              var apiIndex = null;
              var aqqIndex = null;
              var APIAQQFlag = -1;

              /* for(var j=0;j<this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList.length;j++)
        {
          if(this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "API")
          {
            apiIndex=j;
          }
          if(this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "AQQ")
          {
            aqqIndex=j;
          }
        }*/

              for (var j = 0; j < prodListLength; j++) {
                APIAQQFlag = 1;
                /*
           * For setting reg indicator of first product to regulatory eligible if any one segment meet API - N or AQQ - N case.
           *
          this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[apiIndex].statusDetailsAction="N";
              this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[aqqIndex].statusDetailsAction="N";
              APIAQQFlag=1;

                   END     */

                /*
                 * FOR TAKING ALL PROD ERROR LIST TO FIRST PRODUCT
                 * */

                /*For redress and known travel information*/
                if (this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible) {
                  if (!this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList) {
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList = [];
                  }
                  this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList.push({
                    errorCodeErrorCategory: "EC",
                    errorCodeErrorCode: "19507"
                  });
                }
                /*End*/

                if (this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList) {

                  var errorBean = this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList;

                  //For removing if not EC
                  if (errorBean) {
                    for (var jerrbean = 0; jerrbean < errorBean.length; jerrbean++) {

                      /*For redress and known travel information*/
                      if (!this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible && errorBean[jerrbean].errorCodeErrorCode == "19507") {
                        errorBean[jerrbean].errorCodeErrorCategory = "EC";
                      }
                      /*End*/

                      if (errorBean[jerrbean].errorCodeErrorCategory != "EC") {
                        errorBean.splice(jerrbean, 1);
                        jerrbean--;

                      }
                    }
                  }
                  this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList = errorBean;


                }
                if (errorBean && j != 0 && APIAQQFlag == 1) {

                  if (!this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList) {
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList = [];
                  }
                  for (var errInd = 0; errInd < errorBean.length; errInd++) {
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList.push(errorBean[errInd]);
                  }

                }
                /*END*/

              }
            }
            /*         END       **/

            var preallocateseatInput = this.getSelectedPaxPrimeRef();
            /* if(preallocateseatInput.seatselection && preallocateseatInput.seatselection.length > 0) {
        this.preallocateSeat(preallocateseatInput);

        }else
        {*/
            this.appCtrl.load(nextPage);
            //}

          } else {
            if (res.error != null) {
              for (var i = 0; i < res.error.length; i++) {
                var code = res.error[i].errorCodeErrorCode;
                var category = res.error[i].errorCodeErrorCategory;
                if (category == "EC") {
                  for (var j = 0; j < res.error[i].errorTextBean.length; j++) {
                    for (var k = 0; k < res.error[i].errorTextBean[j].freeTexts.length; k++) {
                      errors.push({
                        "localizedMessage": json.error[i].errorTextBean[j].freeTexts[k],
                        "code": code
                      });
                    }
                  }
                } else if (category == "WEC") {
                  for (var j = 0; j < json.error[i].errorTextBean.length; j++) {
                    for (var k = 0; k < json.error[i].errorTextBean[j].freeTexts.length; k++) {
                      warnings.push({
                        "localizedMessage": json.error[i].errorTextBean[j].freeTexts[k],
                        "code": code
                      });
                    }
                  }
                }
              }
            }

            // In case of error
            if (errors != null && errors.length > 0) {
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.displayErrors(errors, "natErrors", "error");
              return null;
            }

            if (this._data.Warnings != null) {
              this._data.Warnings = null;
            }
            // In case of Warnings
            if (warnings != null && warnings.length > 0) {
              this._data.Warnings = warnings;
            }

            // We load the json to the datamodel
            this._data.CheckReg = res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.CheckRegulatoryBean;

            /*
             * TO HANDLE IF ERROR COMES AS PART OF SECOND SEGMENT
             * */
            for (var i = 0; i < this._data.CheckReg.regulatoryDetails.length; i++) {
              var prodListLength = this._data.CheckReg.regulatoryDetails[i].productLevelList.length;
              var apiIndex = null;
              var aqqIndex = null;
              var APIAQQFlag = -1;

              for (var j = 0; j < this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList.length; j++) {
                if (this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "API") {
                  apiIndex = j;
                }
                if (this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "AQQ") {
                  aqqIndex = j;
                }
              }

              for (var j = 0; j < prodListLength; j++) {
                APIAQQFlag = -1;
                /*For setting reg indicator of first product to regulatory eligible if any one segment meet API - N or AQQ - N case.
                 *
                 *
                 * */
                var regIndicators = this._data.CheckReg.regulatoryDetails[i].productLevelList[j].regIndicatorList;
                for (var regInd in regIndicators) {
                  var currRegIndicator = regIndicators[regInd];

                  if ((currRegIndicator.statusDetailsIndicator == "API" && currRegIndicator.statusDetailsAction == "N")) {


                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[apiIndex].statusDetailsAction = "N";
                    APIAQQFlag = 1;
                  }
                  if ((currRegIndicator.statusDetailsIndicator == "AQQ" && currRegIndicator.statusDetailsAction == "N")) {


                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[aqqIndex].statusDetailsAction = "N";
                    APIAQQFlag = 1;
                  }
                }
                /*     END     */

                /*
                 * FOR TAKING ALL PROD ERROR LIST TO FIRST PRODUCT
                 * */



                if (this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList) {

                  /*For redress and known travel information*/
                  if (this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible && !(this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList.length == 1) && !(this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList[0].errorCodeErrorCode == "14474")) {
                    if (!this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList) {
                      this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList = [];
                    }
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList.push({
                      errorCodeErrorCategory: "EC",
                      errorCodeErrorCode: "19507"
                    });

                    /*this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[apiIndex].statusDetailsAction="N";
                  this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[aqqIndex].statusDetailsAction="N";
                  APIAQQFlag=1;*/
                  }
                  /*End*/

                  var errorBean = this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList;

                  //For removing if not EC
                  if (errorBean) {
                    for (var jerrbean = 0; jerrbean < errorBean.length; jerrbean++) {

                      /*For redress and known travel information*/
                      if (!this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible && errorBean[jerrbean].errorCodeErrorCode == "19507") {
                        errorBean[jerrbean].errorCodeErrorCategory = "EC";

                        /*this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[apiIndex].statusDetailsAction="N";
                          this._data.CheckReg.regulatoryDetails[i].productLevelList[0].regIndicatorList[aqqIndex].statusDetailsAction="N";
                          APIAQQFlag=1;*/
                      }
                      /*End*/

                      if (errorBean[jerrbean].errorCodeErrorCategory != "EC") {
                        errorBean.splice(jerrbean, 1);
                        jerrbean--;

                      }
                    }
                  }
                  this._data.CheckReg.regulatoryDetails[i].productLevelList[j].errorList = errorBean;


                }
                if (errorBean && j != 0 && APIAQQFlag == 1) {

                  if (!this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList) {
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList = [];
                  }
                  for (var errInd = 0; errInd < errorBean.length; errInd++) {
                    this._data.CheckReg.regulatoryDetails[i].productLevelList[0].errorList.push(errorBean[errInd]);
                  }

                }
                /*END*/

              }
            }
            /*         END       **/
            var displayEditPage = false; // changed this value from false to true. To show regulatory screen always.
            for (var i = 0; i < this._data.CheckReg.regulatoryDetails.length; i++) {
              var prodListLength = this._data.CheckReg.regulatoryDetails[i].productLevelList.length;
              for (var j = 0; j < prodListLength; j++) {
                var regIndicators = this._data.CheckReg.regulatoryDetails[i].productLevelList[j].regIndicatorList;

                for (var regInd in regIndicators) {
                  var currRegIndicator = regIndicators[regInd];

                  if ((currRegIndicator.statusDetailsIndicator == "API" && currRegIndicator.statusDetailsAction == "N") || (currRegIndicator.statusDetailsIndicator == "AQQ" && currRegIndicator.statusDetailsAction == "N")) {
                    displayEditPage = true;

                  } else {
                    continue;
                  }
                }
                break;
              }
              if (displayEditPage)
                break;
            }

            var cprDetails = this.getCPR();
            /* If PNR booking has accepted dob's and expiries which are not accepted by MCI, then we have to direct user to required detail screen. */
            if (cprDetails.regChkRequired) {
              displayEditPage = true;
            }

            var nextPage = res.responseJSON.homePageId;
            if (nextPage = "merci-checkin-MRequiredDetails_A") {
              this._data.firstTimeLoad++;
            }
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
            var json = this.getModuleData();
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            if (displayEditPage) {
              if (displayEditPage && (this._data.firstTimeLoad == 1)) {
                modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
                jQuery('#splashScreen').hide();
                jQuery('#overlayCKIN').hide();
                this.appCtrl.load(nextPage);
              } else {
                this.raiseEvent({
                  "name": "page.callDisplayFieldsOnLoad"
                });
                return;
              }
            } else {
              var preallocateseatInput = this.getSelectedPaxPrimeRef();
              /* if(preallocateseatInput.seatselection && preallocateseatInput.seatselection.length > 0) {
        this.preallocateSeat(preallocateseatInput);
    return;
      }else {*/
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.appCtrl.load(nextPage);
              // }
            }
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __ICheckRegulatoryCallback function',
          exception);
      }
    },

    /**
     * regulatoryEdits
     * This method is used to initiate customer acceptance. For the customer in customer loop who is not the last.
     */
    regulatoryEdits: function(RegulatoryInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering regulatoryEdits function');
        this.submitJsonRequest("IRegulatoryEditsOverview", RegulatoryInput, {
          scope: this,
          fn: this.__regulatoryEditsCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in regulatoryEdits function',
          exception);
      }
    },
    /**
     * regulatoryEdits
     * This method is used to initiate customer acceptance. For all intermediate customers
     */

    regulatoryEditsNext: function(RegulatoryInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering regulatoryEdits function');
        this.submitJsonRequest("IRegulatoryEdits", RegulatoryInput, {
          scope: this,
          fn: this.__regulatoryEditsCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in regulatoryEdits function',
          exception);
      }
    },



    /**
     * __regulatoryEditsCallback
     * This method is the callback method for the login action.
     */

    __regulatoryEditsCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __regulatoryEditsCallback function');
        var errors = [];
        var warnings = [];
        var json = {};
        var cprInfo = this.getSelectedPax();
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

        if (dataId == "MCheckin_Error") {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          this.displayErrors([{
            "localizedMessage": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings["21400069"].localizedMessage,
            "code": jsonResponse.data.checkIn.MRequiredDetails_A.errorStrings["21400069"].errorid
          }], "regulatoryErrors", "error");
          return null;
        }

        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {

          if (dataId == "MRequiredDetails_A") {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam && res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam) {
              var EditcprBean = res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.EditcprBean;
              if (EditcprBean && EditcprBean.MCIUserErrors != null && EditcprBean.MCIUserErrors.mciUsrErrBean.length > 0) {
                var errorCnt = EditcprBean.MCIUserErrors.mciUsrErrBean.length;
                for (var i = 0; i < errorCnt; i++) {
                  if (EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorCategory == "E") {
                    var ec = EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorCode
                    errors.push({
                      "localizedMessage": EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorDesc
                    });
                  } else if (EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorCategory == "W") {
                    var wc = EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorCode
                    warnings.push({
                      "localizedMessage": EditcprBean.MCIUserErrors.mciUsrErrBean[i].errorDesc
                    });
                  }

                }

              } else if (EditcprBean.error && EditcprBean.error.length > 0) {

                for (var RegErrForPax in EditcprBean.error) {
                  if (EditcprBean.error[RegErrForPax].errorCodeErrorCategory == "EC") {
                    errors.push({
                      "localizedMessage": EditcprBean.error[RegErrForPax].errorTextBean[0].freeTexts[0]
                    });
                  }
                }

              } else if (res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.GenError) {
                errors.push({
                  "localizedMessage": genErrors
                });
              } else if (res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.SessionExpired) {
                errors.push({
                  "localizedMessage": genErrors
                });
              }
            }

            json = res.responseJSON.data.checkIn.MRequiredDetails_A.requestParam.EditcprBean;

            // In case of error
            if (errors != null && errors.length > 0) {
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.displayErrors(errors, "regulatoryErrors", "error");
              return null;
            }


            var errorList = new Array();
            for (var index = 0; index < json.customerLevel.length; index++) {

              /*For taking error list of only currently selected pax*/
              var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
              if (operatingCust != index && json.customerLevel.length > 1) {
                continue;
              }

              /*For redress and known travel information
      if(this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible)
      {
        if(!json.customerLevel[index].productLevelBean[0].errorBean)
            {
          json.customerLevel[index].productLevelBean[0].errorBean=[];
            }
        json.customerLevel[index].productLevelBean[0].errorBean.push({errorCodeErrorCategory:"EC",errorCodeErrorCode:"19507"});
      }
      /*End*/

              for (var ind = 0; ind < json.customerLevel[index].productLevelBean.length; ind++) {

                if (json.customerLevel[index].productLevelBean[ind].errorBean) {

                  var errorBean = json.customerLevel[index].productLevelBean[ind].errorBean;

                  for (var j = 0; j < errorBean.length; j++) {

                    /*For redress and known travel information
          if(!this._data.showRedress_KnownTraveller_AllUSRoutes && this._data.isApisEligible && errorBean[j].errorCodeErrorCode == "19507")
          {
            errorBean[j].errorCodeErrorCategory="EC";
          }
          /*End*/

                    //For removing if not EC
                    if (errorBean[j].errorCodeErrorCategory != "EC") {
                      errorBean.splice(j, 1);
                      j--;
                      continue;
                    }

                    var errorObj = errorBean[j];
                    errorList.push(errorObj);
                  }
                  json.customerLevel[index].productLevelBean[ind].errorBean = errorBean;
                }

              }
            }
            errorList = this.removeProductLevelErrorsNotConfigured(errorList);
            /* Set the product level errros in the module control for to check if the regulatory edit requires additional fields needs to entered mandatorily. */
            this._data.prodErrorList = errorList;
            //this._data.EditCPR = json;

            // We load the json to the datamodel
            if (!this._data.EditCPR || json.customerLevel.length > 1) {
              this._data.EditCPR = json;
            } else {
              var flag = 0;
              for (var i in this._data.EditCPR.customerLevel) {
                if (json.customerLevel[0].uniqueCustomerIdBean.primeId != this._data.EditCPR.customerLevel[i].uniqueCustomerIdBean.primeId) {
                  flag++;

                } else {
                  this._data.EditCPR.customerLevel[i] = json.customerLevel[0];
                }
              }
              if (flag == this._data.EditCPR.customerLevel.length) {
                this._data.EditCPR.customerLevel.push(json.customerLevel[0]);
              }
            }

            var json = this.getModuleData();
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
            if (errorList.length > 0) {
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");

              /*To make change in icheckreg status of API or AQQ if error are there in current page*/
              for (var j = 0; j < this._data.CheckReg.regulatoryDetails[operatingCust].productLevelList[0].regIndicatorList.length; j++) {
                if (this._data.CheckReg.regulatoryDetails[operatingCust].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "API") {
                  this._data.CheckReg.regulatoryDetails[operatingCust].productLevelList[0].regIndicatorList[j].statusDetailsAction = "N";
                }
                /*if(this._data.CheckReg.regulatoryDetails[operatingCust].productLevelList[0].regIndicatorList[j].statusDetailsIndicator == "AQQ")
        {
          aqqIndex=j;
        }*/
              }


              this.setCurrentCustomer(operatingCust);
              jQuery('#overlayCKIN').hide();
              jQuery('#splashScreen').hide();
              for (var i = 0; i < errorList.length; i++) {
                if (errorList[i].errorCodeErrorCode.indexOf("19388") != -1) {
                  this._data.othrDocType = "C";
                  //jQuery('div[_template="modules.checkin.templates.pages.RequiredDetails"').disposeTemplate();
                  //this.$load("checkin/EditCPR");
                  this.raiseEvent({
                    "name": "page.refresh"
                  });
                  return;
                }
              }
              this.setMoreDetailsRequiredToProceed(true);
              this.raiseEvent({
                "name": "page.refresh"
              });
              return;
              //this.$load("checkin/EditCPR");
            }

            if ($('[operating-customer]').is(":visible")) {
              var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
              operatingCust++;
              this._data.regulatoryCurrentPaxIndex = operatingCust;
              if (operatingCust > 0 && operatingCust < cprInfo[0].customer.length - 1) {
                // previous and next button need to be shown. continue hidden.
                //$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
                $("#previousButton").removeClass("disabled").removeAttr("disabled");
                $("#nextButton").removeClass("displayNone").addClass("displayBlock");
                $("#continueButton").removeClass("displayBlock").addClass("displayNone");
                $("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
              } else if (operatingCust == cprInfo[0].customer.length - 1) {
                // previous and continue button need to be shown. next hidden.
                //$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
                $("#previousButton").removeClass("disabled").removeAttr("disabled");
                $("#nextButton").removeClass("displayBlock").addClass("displayNone");
                $("#continueButton").removeClass("displayNone").addClass("displayBlock");
                $("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
              }
              /* Hiding other pax details and showing details of the pax whose info need to be entered next */
              jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
              jQuery("section[data-customer-index=\"" + operatingCust + "\"]").addClass("sectionTempClass");
              jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

              jQuery("section[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
              jQuery(".sectionTempClass").attr("data-customer-index", operatingCust);
              jQuery(".sectionTempClass").removeClass("sectionTempClass");

              jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
              jQuery("li[data-customer-index=\"" + operatingCust + "\"]").addClass("liTempClass");
              jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

              jQuery("li[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
              jQuery(".liTempClass").attr("data-customer-index", operatingCust);
              jQuery(".liTempClass").removeClass("liTempClass");


              jQuery("section[data-customer-index=\"" + operatingCust + "\"]").each(function(index) {
                if ($(this).children("ul").children("li").hasClass("displayBlock")) {

                } else {
                  $(this).removeClass("displayBlock").addClass("displayNone");
                }
              });

              var id = $("#Nationality" + operatingCust).find("input").attr("id");
              if (!jQuery("#" + id).is(":disabled")) {
                if (jQuery("#" + id).val() != "" && jQuery("#" + id).attr("readonly")) {
                  /*jQuery("#"+id).attr("disabled","disabled") ;
          jQuery("#"+id).next().addClass("disabled") ;
          jQuery("#"+id).next().attr("disabled","disabled") ;*/
                  jQuery("#" + id).attr("readonly", "readonly");
                  if (res.responseJSON.data.checkIn.MRequiredDetails_A.parameters.SITE_MCI_REG_NATEDIT_REQ.toUpperCase() == "TRUE") {
                    /*For nat edit button*/
                    jQuery("#" + id).next().removeAttr("disabled").removeAttr("atdelegate");
                    jQuery("#" + id).next().removeClass("disabled displayNone");
                    jQuery("#" + id).next().prop("type", "button");
                    jQuery("#" + id).next().text(jsonResponse.data.checkIn.MRequiredDetails_A.labels.Edit);
                    /*End For nat edit button*/
                  } else {
                    jQuery("#" + id).next().addClass("disabled");
                    jQuery("#" + id).next().attr("disabled", "disabled");
                  }

                  jQuery("[data-aria-controls='nationalityInfo" + operatingCust + "']").attr("data-aria-expanded", "false");
                  jQuery("#nationalityInfo" + operatingCust).slideUp("400");
                  $("#nextButton").removeClass("disabled");
                  $("#continueButton").removeClass("disabled");
                  $("#nextButton").removeAttr("disabled");
                  $("#continueButton").removeAttr("disabled");
                } else {
                  $("#nextButton").removeClass("disabled").addClass("disabled");
                  $("#continueButton").removeClass("disabled").addClass("disabled");
                  $("#nextButton").attr("disabled", "disabled");
                  $("#continueButton").attr("disabled", "disabled");
                }
              }
              jQuery("input[dataCountrySel='select-country']").each(function(idx) {
                if (this.value.length == 3 && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
                  this.value = countryListCodeMap.codetocountry[this.value.toUpperCase()];
                }
              });

              /*if(!(jQuery("#"+id).is(":disabled") || jQuery("#"+id).attr("readonly") || jQuery("#"+id).val() != "")){
        jQuery("section[data-customer-index='"+operatingCust+"']>ul>li").removeClass("displayBlock").addClass("displayNone");
        jQuery("section[data-customer-index='"+operatingCust+"']").removeClass("displayBlock").addClass("displayNone");
        jQuery("#Nationality"+operatingCust).removeClass("displayNone").addClass("displayBlock");
        jQuery("#Nationality"+operatingCust+">ul>li").removeClass("displayNone").addClass("displayBlock");
    }*/

              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#overlayCKIN').hide();
              jQuery('#splashScreen').hide();
              this.raiseEvent({
                "name": "page.callDisplayFieldsOnLoad"
              });
              return;
            }

            if (this._data.Warnings != null) {
              this._data.Warnings = null;
            }
            // In case of Warnings
            if (warnings != null && warnings.length > 0) {
              this._data.Warnings = warnings;
            }
          } else {
            this._data.EditCPR = res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.EditCprBean;
            // var json=res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.EditCprBean;
            // We load the json to the datamodel
            /*if(!this._data.EditCPR)
      {
        this._data.EditCPR = json;
      }else
      {
        var flag=0;
        for(var i in this._data.EditCPR.customerLevel)
          {
            if(json.customerLevel[0].uniqueCustomerIdBean.primeId != this._data.EditCPR.customerLevel[i].uniqueCustomerIdBean.primeId)
            {
              flag++;
            }else
            {
              this._data.EditCPR.customerLevel[i]=json.customerLevel[0];
            }
          }
        if(flag == this._data.EditCPR.customerLevel.length)
        {
          this._data.EditCPR.customerLevel.push(json.customerLevel[0]);
        }
      }*/

            /*
             * For updating doc check required flag which will be useful for enableing disabling MBP, SPBP
             *
             * indicator - docCheckRequired
             * */
            this.forUpdateGetCPRbasedOnRegRequest(this._data.EditCPR);

            var preallocateseatInput = this.getSelectedPaxPrimeRef();
            var json = this.getModuleData();
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
            /* if(preallocateseatInput.seatselection && preallocateseatInput.seatselection.length > 0) {
        this.preallocateSeat(preallocateseatInput);
        }
       else {*/
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var nextPage = res.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
            this.appCtrl.load(nextPage);
            //}
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __regulatoryEditsCallback function',
          exception);
      }
    },
    forUpdateGetCPRbasedOnRegRequest:function(regResponce){

    	 var editCPR = regResponce;
            var getCpr=this._data.CPRIdentification;
            for(var j in editCPR.customerLevel)
			{
				var customer=editCPR.customerLevel[j];
				for(var k in customer.productLevelBean)
				{
					var prod=customer.productLevelBean[k];

					/*prod id*/
					var prodID="";
					for(var p=0;p<prod.productIdentifiersBean.length;p++)
					{
						if(prod.productIdentifiersBean[p].referenceQualifier.search(/DID/gi) != -1)
						{
							prodID=prod.productIdentifiersBean[p].primeId;
						}
					}

					if(prodID != "")
					{
						/*For update detail, it first find product id and do it*/
						toOuter:for(var j1 in getCpr.customerLevel)
						 {
								var customer1=getCpr.customerLevel[j1];
								for(var k1 in customer1.productLevelBean)
								{
									var prod1=customer1.productLevelBean[k1];

									/*prod id*/
									var prodID1="";
									for(var p1=0;p1<prod1.productIdentifiersBean.length;p1++)
									{
										if(prod1.productIdentifiersBean[p1].referenceQualifier.search(/DID/gi) != -1)
										{
											prodID1=prod1.productIdentifiersBean[p1].primeId;

											/*For update detail */
											if(prodID1 == prodID){

												if(prod.docCheckRequired != undefined)
												{
												prod1.docCheckRequired=prod.docCheckRequired;
												}
												if(prod.cvvCheckRequired != undefined)
												{
													prod1.cvvCheckRequired=prod.cvvCheckRequired;
												}

												break toOuter;

											}
										}
									}

								}
						 }
					}

				}
			}

    },

    removeProductLevelErrorsNotConfigured: function(errorList) {
      try {
        this.$logInfo('ModuleCtrl::Entering removeProductLevelErrorsNotConfigured function');
        /*
   Anoop provided list -- var configuredListOfErrorIds = ["14475","14476","14732","14729","14733","14734","14736","14737","14771","14738","14799","14801","14800","14766","14767","14768","14769","14770","14740","14763","14764","14765","17331","14802","14804","14803","19388","14785"] ;
   */
        /*
         * Existing list
         */
        var configuredListOfErrorIds = ["14475", "14476", "14739", "14732", "14729", "14733", "14734", "14736", "14737", "14771", "14738", "14799", "14801", "14800", "14766", "14767", "14768", "14769", "14770", "14740", "14763", "14764", "14765", "17331", "14802", "14804", "14803", "19388", "19507"];
        for (var ind = 0; ind < errorList.length; ind++) {
          if (configuredListOfErrorIds.indexOf(errorList[ind].errorCodeErrorCode) == -1) {
            errorList.splice(ind, 1);
            ind--;
          }
        }
        return errorList;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in removeProductLevelErrorsNotConfigured function',
          exception);
      }
    },
    preallocateSeat: function(preallocateInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering preallocateSeat function');

        if (this._data.CPRIdentificationoriginal != null && this._data.CPRIdentificationoriginal != undefined) {
          var cpr = this._data.CPRIdentificationoriginal;
        } else {
          var cpr = this.getCPR();
        }

        var allocateseatInput = {
          "fullJson": cpr,
          "selectedCPR": this.getSelectedPax(),
          "seatselection": preallocateInput.seatselection,
          "seat": "Not Added",
          "flow": "preallocation"
        }
        this.submitJsonRequest("IAllocateSeat", allocateseatInput, {
          scope: this,
          fn: this.__allocateSeatCallback,
          args: allocateseatInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in preallocateSeat function',
          exception);
      }
    },
    /**
     * initiateAccept
     * This method is used to initiate customer acceptance.
     */
    initiateAccept: function(InitiateAcceptInput) {
      try {
        jQuery("#initiateandEditErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering initiateAccept function');
        this.submitJsonRequest("IInitiateAccept", InitiateAcceptInput, {
          scope: this,
          fn: this.__InitiateAcceptCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in initiateAccept function',
          exception);
      }
    },

    /**
     * __InitiateAcceptCallback
     * This method is the callback method for the initiateAccept action.
     */
    __InitiateAcceptCallback: function(res) {
      try {
        jQuery("#serviceoverlayCKIN").disposeTemplate();
        this._data.cancelChkinRepCallAry = [];
        this._data.cancelChkinRepCallAryindex = 0;
        this.setIsFlowAppCancel(false);
        var errors = [];
        var warnings = [];
        var isCACTrue = false;
        var json = {};
        var exitRowPassengers = [];
        var isAnyValid = false;
        var cprValues = this.getCPR();
        var validCustomerArray = [];
        var acceptedCprForSeat = [];
        var isCACTrue = false;
        this._data.validGTMProdIDs={};
        // getting next page id
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

            if (res.responseJSON.data.checkIn.MAcceptanceOverview_A != null && res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.InitiateCustomerAcceptance != null && res.responseJSON.data.checkIn.MAcceptanceOverview_A.requestParam.InitiateCustomerAcceptance.errorBean != null) {
              this.raiseEvent({
                "name": "page.refresh"
              });
              this._data.uiErrors = res.responseJSON.data.checkIn.MAcceptanceOverview_A.errorStrings;
              errors.push({
                "localizedMessage": this._data.uiErrors[213001075].localizedMessage,
                "code": this._data.uiErrors[213001075].errorid
              });
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.displayErrors(errors, "initiateandEditErrors", "error");
              return null;
            }
            var jsonCustProdLink = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.requestParam.InitiateCustomerAcceptance;
            this._data.uiErrors = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.errorStrings;
            this._data.parameters = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.parameters;

            var nextPage = res.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);



            /* added to handle a scenario of echeckin sequence failure and any other case where not a single pax could be checked in */
            for (var accCust = 0; accCust < jsonCustProdLink.customerAndProductsBean.length; accCust++) {
              for (var accJournies = 0; accJournies < jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies.length; accJournies++) {
                for (var lgAcceptances = 0; lgAcceptances < jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances.length; lgAcceptances++) {
                  for (var status = 0; status < jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses.length; status++) {
                    if (jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses[status].indicator == "CAC" && jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses[status].action == "1") {
                      isCACTrue = true;
                    }
                    if (jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses[status].indicator == "CST" && jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses[status].action == "1") {
                      isCACTrue = true;
                    }
                  }
                }
              }
            }

            if (jsonCustProdLink.blackListFailed != null) {
              if (jsonCustProdLink.blackListFailed == true) {
                this.setBlackListOverBooked(true);
                this.raiseEvent({
                  "name": "page.refresh"
                });
                errors.push({
                  "localizedMessage": this._data.uiErrors[25000129].localizedMessage,
                  "code": this._data.uiErrors[25000129].errorid
                });
              } else if (!isCACTrue) {
                this.setBlackListOverBooked(true);
                this.raiseEvent({
                  "name": "page.refresh"
                });
                errors.push({
                  "localizedMessage": this._data.uiErrors[213001075].localizedMessage,
                  "code": this._data.uiErrors[213001075].errorid
                });
              }
            } else if (!isCACTrue) {
              this.setBlackListOverBooked(true);
              this.raiseEvent({
                "name": "page.refresh"
              });
              errors.push({
                "localizedMessage": this._data.uiErrors[213001075].localizedMessage,
                "code": this._data.uiErrors[213001075].errorid
              });
            }


            if (errors != null && errors.length > 0 && !isCACTrue) {
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.displayErrors(errors, "initiateandEditErrors", "error");
              return null;
            }


            /*For seat change in Acceptance conf and for GTM*/
            if (!this._data.StoreSelectedSeats) {
                this._data.StoreSelectedSeats = {};
              }
              /* Added to allocate seat at the acceptance confirmation page */
              for (var accCust = 0; accCust < jsonCustProdLink.customerAndProductsBean.length; accCust++) {
                for (var accJournies = 0; accJournies < jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies.length; accJournies++) {

            	 /*Taking products for GTM*/
                if(jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].validApp)
                {
                	this._data.validGTMProdIDs[jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].productIdentifierPrimeId]={
                    		"boardPoint":jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].operatingFlightDetailsBoardPoint,
                    		"offPoint":jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].operatingFlightDetailsOffPoint,
                    		"flightCarrier": jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].operatingFlightDetailsMarketingCarrier,
                    		"flightNum": jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].operatingFlightDetailsFlightNumber,
                    		"gender":jsonCustProdLink.customerAndProductsBean[accCust].otherPaxDetails?jsonCustProdLink.customerAndProductsBean[accCust].otherPaxDetails.type:"",
                    		"type": jsonCustProdLink.customerAndProductsBean[accCust].customerDetailsType,
                    		"bookingclass":jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].bookingClass?jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].bookingClass.cabinDetailsBookingClass:""
                    };
                }

                for (var lgAcceptances = 0; lgAcceptances < jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances.length; lgAcceptances++) {
                    if (jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].seatNumber != null) {
                      this._data.StoreSelectedSeats[jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].productIdentifierPrimeId] = jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].seatNumber.seatDetailsSeatNumber;

                 	 /*Taking products for GTM*/
                      if(this._data.validGTMProdIDs[jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].productIdentifierPrimeId] != undefined)
                      {
                    	  this._data.validGTMProdIDs[jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].productIdentifierPrimeId].seat=jsonCustProdLink.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].seatNumber.seatDetailsSeatNumber;
                      }
                    }

                  }
                }
              }
              this.findMissingDetailsForGTM(this._data.validGTMProdIDs);
              /*End For seat change in Acceptance conf and for GTM*/

            // We check for errors
            // if (json.errorBean != null) {
            // for (var i=0 ; i < json.errorBean.length ; i++){
            // var code = json.errorBean[i].errorOrWarningCodeDetailsErrorCode;
            //var category = json.errorBean[i].errorOrWarningCodeDetailsErrorCategory;
            //  if(category == "EC") {
            //   errors.push({"localizedMessage":this._data.uiErrors[213001075].localizedMessage,"code":this._data.uiErrors[213001075].errorid});

            //          }
            //          }
            //      }
            // In case any of the pax has failed the APP check
            var actualSelectedPax = this.getSelectedPax();
            var cprValsForCustomerIndex = this.getCPR();
            var cancelCheckinsubsequentcall = false;
            if (jsonCustProdLink.customerAndProductsBean != null && jsonCustProdLink.customerAndProductsBean.length > 0) {
              for (var j = 0; j < jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies.length; j++) {
                var customerArray = [];
                var custReqArray = [];
                for (var i = 0; i < jsonCustProdLink.customerAndProductsBean.length; i++) {
                  if (jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].validApp == false) {

                    //For taking correct customer index
                    for (var co in actualSelectedPax[0].customer) {
                      if ((actualSelectedPax[0].customer.hasOwnProperty(co)) && jsonCustProdLink.customerAndProductsBean[i].customerIdentifierPrimeId == cprValsForCustomerIndex.customerLevel[actualSelectedPax[0].customer[co]].uniqueCustomerIdBean.primeId) {
                        customerArray.push(actualSelectedPax[0].customer[co]);
                      }
                    }

                  } else {
                    if (jsonCustProdLink.customerAndProductsBean[i].customerDetailsType != "IN") {

                      for (var p = 0; p < cprValsForCustomerIndex.customerLevel.length; p++) {
                        if (jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].validApp && jsonCustProdLink.customerAndProductsBean[i].customerIdentifierPrimeId == cprValsForCustomerIndex.customerLevel[p].uniqueCustomerIdBean.primeId) {
                          validCustomerArray.push(p);
                          isAnyValid = true;
                        }
                      }
                    } else {
                      var primeidForFindInfant = jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].productIdentifierPrimeId;
                      var primeIDIndex = -1;
                      for (var p = 0; p < cprValsForCustomerIndex.customerLevel.length; p++) {
                        if (jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].validApp && cprValsForCustomerIndex.customerLevel[p].customerDetailsType == "IN" && jsonCustProdLink.customerAndProductsBean[i].customerIdentifierPrimeId == cprValsForCustomerIndex.customerLevel[p].uniqueCustomerIdBean.primeId) {
                          for (var p_ix = 0; p_ix < cprValsForCustomerIndex.customerLevel[p].productLevelBean.length; p_ix++) {
                            if (primeIDIndex == -1 && cprValsForCustomerIndex.customerLevel[p].productLevelBean[p_ix].productIdentifiersBean[0].primeId == primeidForFindInfant) {
                              primeIDIndex = p_ix;
                              break;
                            }
                          }
                        }
                        if (primeIDIndex != -1) {
                          break;
                        }
                      }
                      validCustomerArray.push(this.getInfantIndex(primeIDIndex, jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].productIdentifierPrimeId));
                    }
                  }
                }

                //to prepare accepted CPR of all valid customers so that only valiacceptedCprForSeat
                if (validCustomerArray.length == 1) {
                  acceptedCprForSeat.push({
                    "product": "" + actualSelectedPax[j].product,
                    "customer": "" + validCustomerArray[0],
                    "acceptanceConResProdIndx":j
                  });
                } else if (validCustomerArray.length > 1) {
                  var uniqueArray = [];
                  validCustomerArray = validCustomerArray.sort();
                  for (var k = 0; k < validCustomerArray.length; k++) {
                    if (validCustomerArray[k] != validCustomerArray[k + 1]) {
                      uniqueArray.push(validCustomerArray[k]);
                    }
                  }
                  acceptedCprForSeat.push({
                    "product": "" + actualSelectedPax[j].product,
                    "customer": uniqueArray,
                    "acceptanceConResProdIndx":j
                  });
                }
                if (customerArray.length > 0) {

                  if (customerArray.length == 1) {
                    custReqArray.push({
                      "product": actualSelectedPax[j].product,
                      "customer": customerArray[0]
                    });
                  } else {
                    custReqArray.push({
                      "product": actualSelectedPax[j].product,
                      "customer": customerArray
                    });
                  }

                  var cancelCheckInInput = {
                    "selectedCPR": custReqArray,
                    "recLoc": cprValues.customerLevel[0].recordLocatorBean.controlNumber,
                    "lastName": this.getLastName(),
                    "fromInitiateAcceptance": true
                  }
                  this.setValidApp(false);
                  this.setIsFlowAppCancel(true);
                  var _this = this;
                  if (cancelCheckinsubsequentcall) {
                    _this._data.cancelChkinRepCallAry.push(cancelCheckInInput);
                  } else {

                    _this.cancelAcceptance(cancelCheckInInput);
                  }
                  cancelCheckinsubsequentcall = true;

                }
                validCustomerArray = [];
                customerArray = [];
              }
            }

            this.setAcceptedCprValidApp(acceptedCprForSeat);

            if (jsonCustProdLink.overBookedFlight != null) {
              if (jsonCustProdLink.overBookedFlight == true) {
                this.setBlackListOverBooked(true);


              }
            }

            if (isAnyValid == false) {
              this.setIsAnyValidAppPax(false);
              this.raiseEvent({
                "name": "page.refresh"
              });
              if (this.getBlackListOverBooked()) {
                errors.push({
                  "localizedMessage": this._data.uiErrors[25000128].localizedMessage,
                  "code": this._data.uiErrors[25000128].errorid
                });
              } else {
                errors.push({
                  "localizedMessage": this._data.uiErrors[25000125].localizedMessage,
                  "code": this._data.uiErrors[25000125].errorid
                });
              }
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              this.displayErrors(errors, "initiateandEditErrors", "error");
              return null;
            }


            if (jsonCustProdLink.customerAndProductsBean != null && jsonCustProdLink.customerAndProductsBean.length > 0) {

              /*
               * Forming product list first, for showing exitrow question popup
               * */
              var temp_formproduct = "";
              for (var j = 0; j < jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies.length; j++) {
                temp_formproduct += "\"" + j + "\":[],";
                this._data.exitRowListWhenCheckinProdCunt++;
              }
              temp_formproduct = temp_formproduct.substring(0, temp_formproduct.length - 1)
              this._data.exitRowListWhenCheckin = JSON.parse("{" + temp_formproduct + "}");

              for (var i = 0; i < jsonCustProdLink.customerAndProductsBean.length; i++) {
                for (var j = 0; jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies != null && j < jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies.length; j++) {

                  var exitrow_primeId = jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].productIdentifierPrimeId;
                  // var exitrow_qualifier = json.customerAndProductsBean[i].acceptanceJourneies[j].productIdentifierReferenceQualifier;
                  var exitrow_qualifier = "DID";


                  for (var k = 0; jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].errors != null && k < jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].errors.length; k++) {
                    category = jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].errors[k].errorOrWarningCodeDetailsErrorCategory;
                    var catogaryCode = jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].errors[k].errorOrWarningCodeDetailsErrorCode;
                    if (category == "EC") {
                      if (jsonCustProdLink.customerAndProductsBean[i].acceptanceJourneies[j].errors[k].errorOrWarningCodeDetailsErrorCode == "14165") {
                        errors.push({
                          "localizedMessage": this._data.uiErrors[25000017].localizedMessage,
                          "code": this._data.uiErrors[25000017].errorid
                        });
                      } else {
                        errors.push({
                          "localizedMessage": this._data.uiErrors[25000015].localizedMessage,
                          "code": this._data.uiErrors[25000015].errorid
                        });
                      }

                    } else if (category == "WEC" && catogaryCode == 17376) {
                      /*
                       * Forming customer list which go into product list formed above, for showing exitrow question popup
                       * */
                      this._data.exitRowListWhenCheckin[j].push({
                        "primeId": exitrow_primeId,
                        "referenceQualifier": exitrow_qualifier
                      });
                    }
                  }

                }
                for (var j = 0; jsonCustProdLink.customerAndProductsBean[i].errors != null && j < jsonCustProdLink.customerAndProductsBean[i].errors.length; j++) {
                  if (jsonCustProdLink.customerAndProductsBean[i].errors[j].errorOrWarningCodeDetailsErrorCategory == "EC") {
                    errors.push({
                      "localizedMessage": this._data.uiErrors[25000015].localizedMessage,
                      "code": this._data.uiErrors[25000015].errorid
                    });
                  }
                }
              }
            }
          }
          // In case of error
          if (errors != null && errors.length > 0 && !isCACTrue) {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#splashScreen').hide();
            jQuery('#overlayCKIN').hide();
            this.displayErrors(errors, "initiateandEditErrors", "error");
            return null;
          }
          // In case of Warnings
          if (this._data.Warnings != null) {
            this._data.Warnings = null;
          }
          if (warnings != null && warnings.length > 0) {
            this.data.Warnings = warnings;
          }
          if (isCACTrue) {
            this.filterSelectedCPRForNotAcceptedLegs(res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.requestParam.InitiateCustomerAcceptance);
          }

          // We load the json to the datamodel
          this._data.InitiateAccept = res.responseJSON.data.checkIn.MAcceptanceConfirmation_A.requestParam.InitiateCustomerAcceptance;
          /*if( json.promptListBean != null ) {
      jQuery('#splashScreen').hide();
      this.displayPromptList(json , "serviceoverlayCKIN");
      jQuery(document).scrollTop("0");
      jQuery('#serviceoverlayCKIN').show();
    } else {*/

          /*GOOGLE ANALYTICS
           * */
          //Event analytics

          if (jsonCustProdLink.customerAndProductsBean.length > 0) {
            var paxLenght = jsonCustProdLink.customerAndProductsBean.length;
            for (var i = 0; i < jsonCustProdLink.customerAndProductsBean.length; i++) {
              if (jsonCustProdLink.customerAndProductsBean[i].customerDetailsType == "IN") {
                paxLenght = paxLenght - 1;
              }
            }
            for (var j = 0; j < jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies.length; j++) {
              if (this._data.GADetails.siteGAEnable) {
                var loginOrguestUser = "";
                var headerData = this.getHeaderInfo()
                if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
                  loginOrguestUser = "KFMember";
                } else {
                  loginOrguestUser = "GuestLogin";
                }

                if (this.getEmbeded() && aria.core.Browser.isIOS) {

                  jQuery("[name='ga_track_event']").val("Category=MCIAppiPhoneCheckin&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(paxLenght));

                  //ga('send', 'event', 'MCIAppiPhoneCheckin', loginOrguestUser, 'iPhone',paxLenght);
                  var GADetails = this._data.GADetails;
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppiPhoneCheckin',
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppiPhoneCheckinAirportCode - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsBoardPoint,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });				  
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppiPhoneCheckinFlightNo - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsFlightNumber,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });
                } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                  // ga('send', 'event', 'MCIAppAndroidCheckin', loginOrguestUser, 'Android',paxLenght);

                  jQuery("[name='ga_track_event']").val("Category=MCIAppAndroidCheckin&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(paxLenght));

                  var GADetails = this._data.GADetails;
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppAndroidCheckin',
                    action: loginOrguestUser,
                    label: 'Android',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppAndroidCheckinAirportCode - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsBoardPoint,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });				  
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppAndroidCheckinFlightNo - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsFlightNumber,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });
                } else {

                  //ga('send', 'event', 'MCIWebCheckin', loginOrguestUser, 'Mobile Web',paxLenght);

                  var GADetails = this._data.GADetails;
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIWebCheckin',
                    action: loginOrguestUser,
                    label: 'Mobile Web',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIWebCheckinAirportCode - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsBoardPoint,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });				  
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIWebCheckinFlightNo - ' + jsonCustProdLink.customerAndProductsBean[0].acceptanceJourneies[0].operatingFlightDetailsFlightNumber,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(paxLenght)
                  });				  

                }

              }

            }


          }


          jQuery('#splashScreen').hide();

          this.setIsFlowInCancelCheckin(0);
          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          // navigate to next page
          //this.moduleCtrl.navigate(null, nextPage);
          this.appCtrl.load(nextPage);


          jQuery('#overlayCKIN').show();

          /*For display majarity product content in popup -- popup if multiple products exist shows only once with product having more customers*/
          var countMoreCustInProduct = 0;
          for (var iii in this._data.exitRowListWhenCheckin) {
            if (this._data.exitRowListWhenCheckin[iii].length > 0 && this._data.exitRowListWhenCheckin[iii].length > countMoreCustInProduct) {

              countMoreCustInProduct = iii;
            }
          }
          for (var iii in this._data.exitRowListWhenCheckin[countMoreCustInProduct]) {
            var grpPaxInfosLength = this._data.exitRowListPopupShow.grpPaxInfos.push({
              idSections: []
            });
            this._data.exitRowListPopupShow.grpPaxInfos[grpPaxInfosLength - 1].idSections.push(this._data.exitRowListWhenCheckin[countMoreCustInProduct][iii]);
          }

          /*
           * finding product having exirow customers to show popup, for showing exitrow question popup
           * */
          for (var iii in this._data.exitRowListWhenCheckin) {
            if (this._data.exitRowListWhenCheckin[iii].length > 0) {
              this._data.exitRowListWhenCheckinProd = iii;
              break;
            }

          }
          if (this._data.exitRowListWhenCheckinProd && this._data.exitRowListWhenCheckinProd >= 0) {
            this._data.ExitRowPsngrs = this._data.exitRowListWhenCheckin[this._data.exitRowListWhenCheckinProd];
            var seatMapInput = {

              "seatMapProdIndex": this._data.exitRowListWhenCheckinProd

            }
            this._data.SelectionForSeatMap = seatMapInput;
            var cpr = this.getFullJSON();
            var selCPR = this.getSelectedPax();

            var emergencyExitInput = {
              "exitRowPeassengers": this._data.ExitRowPsngrs,
              "selectedCPR": selCPR,
              "STATUS_INDICATOR": "Z",
              "seatMapProdIndex": this._data.exitRowListWhenCheckinProd
            }

            this.emergencyExitSeatAlllocation(emergencyExitInput)
          } else {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
          }

        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __InitiateAcceptCallback function',
          exception);
      }
    },

    /**
     * getBoarding Pass
     *
     */
    getBoardingPassResp: function() {
      try {
        this.$logInfo('MCheckinModuleCtrl::Entering getBoardingPassResp function');
        if (!jQuery.isUndefined(this._data.BoardingPass)) {
          return this._data.BoardingPass;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'MCmtngModuleCtrl::An error occured in getBoardingPassResp function',
          exception);
      }
    },


    /**
     *   filterSelectedCPRForNotAcceptedLegs: This function will filter selected CPR based on the CAC and CST.
     *      If customer is not accepted in some segments then, those segments are filtered from the selected CPR.
     */
    filterSelectedCPRForNotAcceptedLegs: function(json) {
      try {
        this.$logInfo('CheckinModuleCtrl::Entering filterSelectedCPRForNotAcceptedLegs function');
        var productsNotAcceptedList = [];
        /* find product identifier which are not accepted due to CAC and CST conditions */
        for (var accCust = 0; accCust < json.customerAndProductsBean.length; accCust++) {
          for (var accJournies = 0; accJournies < json.customerAndProductsBean[accCust].acceptanceJourneies.length; accJournies++) {
            var custAcceptedInCurrJourney = false;
            for (var lgAcceptances = 0; lgAcceptances < json.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances.length; lgAcceptances++) {
              for (var status = 0; status < json.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses.length; status++) {
                var currStatus = json.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].legAcceptances[lgAcceptances].statuses[status];
                if ((currStatus.indicator == "CAC" && currStatus.action == "1") || (currStatus.indicator == "CST" && currStatus.action == "1")) {
                  custAcceptedInCurrJourney = true;
                }
              }
            }
            if (!custAcceptedInCurrJourney) {
              productsNotAcceptedList.push(json.customerAndProductsBean[accCust].acceptanceJourneies[accJournies].productIdentifierPrimeId);
            }
          }
        }
        /* find the index of product in the CPR details */
        var cprDtls = this.getCPR();
        var productIndexNotAcceptedCPR = [];
        if (productsNotAcceptedList.length > 0) {
          var prodLvlList = cprDtls.customerLevel[0].productLevelBean;
          for (var n = 0; n < productsNotAcceptedList.length; n++) {
            var prodId = productsNotAcceptedList[n];
            for (var k = 0; k < prodLvlList.length; k++) {
              if (prodId == prodLvlList[k].productIdentifiersBean[0].primeId) {
                productIndexNotAcceptedCPR.push(k);
              }
            }
          }
        }
        /* filter the selected CPR for the product indexes which are captured from above logic */
        var currSelectedCPR = this.getSelectedPax();
        for (var j = 0; j < currSelectedCPR.length; j++) {
          for (var m = 0; m < productIndexNotAcceptedCPR.length; m++) {
            if (productIndexNotAcceptedCPR[m] == currSelectedCPR[j].product) {
              currSelectedCPR.splice(j, 1);
            }
          }
        }
        this.setSelectedPax(currSelectedCPR);
      } catch (exception) {
        this.$logError('CheckinModuleCtrl::An error occured in filterSelectedCPRForNotAcceptedLegs function', exception);
      }
    },

    /**
     * getBoarding Pass Response details
     *
     */
    getBoardingPassRespDtls: function() {
      try {
        this.$logInfo('MCheckinModuleCtrl::Entering getBoardingPassRespDtls function');
        if (!jQuery.isUndefined(this._data.BPResponseDetails)) {
          return this._data.BPResponseDetails;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'MCmtngModuleCtrl::An error occured in getBoardingPassRespDtls function',
          exception);
      }
    },
    /**
     * allocate seat
     * This method is used to Allocate Seat which is selected from seat map.
     */
    allocateSeat: function(allocateseatInput) {
      try {
        jQuery("#seatErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering allocateSeat function');
        this.submitJsonRequest("IAllocateSeat", allocateseatInput, {
          scope: this,
          fn: this.__allocateSeatCallback,
          args: allocateseatInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in allocateSeat function',
          exception);
      }
    },

    /**
     * __allocateSeatCallback
     * This method is the callback method for the allocate seat action.
     */

    __allocateSeatCallback: function(res, allocateseatInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering __allocateSeatCallback function');
        var errors = [];
        var warnings = [];
        var success = [];
        var json = {};
        var exitRowPassengers = [];
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
          //errors.push({"localizedMessage":this._data.uiErrors[25000065].localizedMessage});
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {

          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = (res.responseJSON.data.checkIn.AllocateSeatBean_A.requestParam.AllocateSeatBean);
          this._data.uiErrors = res.responseJSON.data.checkIn.AllocateSeatBean_A.errorStrings;
          // We check for errors
          if (json.applicationErrors != null) {
            for (var i = 0; i < json.applicationErrors.length; i++) {
              var code = json.applicationErrors[i].errorCodeErrorCode;
              var category = json.applicationErrors[i].errorCodeErrorCategory;
              if (category == "EC") {
                for (var j = 0; j < json.applicationErrors[i].errorTextBean.length; j++) {
                  if (json.applicationErrors[i].errorTextBean[j].freeTexts != null && json.applicationErrors[i].errorTextBean[j].freeTexts.length > 0) {
                    errors.push({
                      "localizedMessage": this._data.uiErrors[25000065].localizedMessage,
                      "code": this._data.uiErrors[25000065].errorid
                    });
                  }
                }
              }
            }
          }
        }
        var stopRepErrorCode = [];
        if (json.segmentInfos && json.segmentInfos.length > 0) {
          if (json.segmentInfos[0].seatResponseInfos[0].passengerInfos) {
            for (var j = 0; j < json.segmentInfos[0].seatResponseInfos[0].passengerInfos.length; j++) {
              if (json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors) {
                for (var k = 0; k < json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors.length; k++) {
                  if (json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors[k].errorCodeErrorCode == "17376") {
                    var primeId = json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].IDSections[0].ID;
                    var qualifier = json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].IDSections[0].IDQualifier;
                    exitRowPassengers.push({
                      "primeId": primeId,
                      "referenceQualifier": qualifier
                    });
                  } else if (json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors[k].errorCodeErrorCategory == "EC") {
                    if (stopRepErrorCode.indexOf(json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors[k].errorCodeErrorCode) != -1) {
                      continue;
                    }
                    errors.push({
                      "localizedMessage": this._data.uiErrors[25000065].localizedMessage,
                      "code": this._data.uiErrors[25000065].errorid
                    });
                    stopRepErrorCode.push(json.segmentInfos[0].seatResponseInfos[0].passengerInfos[j].applicationErrors[k].errorCodeErrorCode);
                  }
                }
              }
            }
          }
        }

        //Checkin for specific errors
        var loopTrack = 0;
        outOfLoop: if (json.segmentInfos && json.segmentInfos.length != 0 && loopTrack == 0) {
          for (var i = 0; i < json.segmentInfos.length; i++) {
            if (json.segmentInfos[i].seatResponseInfos && json.segmentInfos[i].seatResponseInfos.length != 0) {
              for (var j = 0; j < json.segmentInfos[i].seatResponseInfos.length; j++) {
                if (json.segmentInfos[i].seatResponseInfos[j].passengerInfos && json.segmentInfos[i].seatResponseInfos[j].passengerInfos.length != 0) {
                  for (var k = 0; k < json.segmentInfos[i].seatResponseInfos[j].passengerInfos.length; k++) {
                    var warningTemp = json.segmentInfos[i].seatResponseInfos[j].passengerInfos[k];
                    if (warningTemp.applicationErrors != null) {
                      for (var l = 0; l < warningTemp.applicationErrors.length; l++) {
                        var code = warningTemp.applicationErrors[l].errorCodeErrorCode;
                        var category = warningTemp.applicationErrors[i].errorCodeErrorCategory;

                        if (category == "WEC" && code == "17375") {
                          /*for (var j=0 ; j < json.applicationErrors[i].errorTextBean.length ; j++) {
                                 for (var k=0 ; k < json.applicationErrors[i].errorTextBean[j].freeTexts.length ; k++){
                                    warnings.push({"localizedMessage":json.applicationErrors[i].errorTextBean[j].freeTexts[k],"code":code});
                                  }
                                }*/

                          warnings.push({
                            "localizedMessage": this.res.AcceptanceOverview.label.exitrowWarning,
                            "code": code
                          });
                          loopTrack = 1;
                          break outOfLoop;

                        }

                      }
                    }
                  }
                }

              }

            }

          }

        }


        // In case of error
        if (allocateseatInput.flow != "preallocation" && errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.displayErrors(errors, "seatErrors", "error");
          return null;
        }

        // In case of Warnings
        if (this._data.Warnings != null) {
          // this._data.Warnings = null;
        }
        if (warnings != null && warnings.length > 0) {
          this._data.Warnings = warnings;
        }

        if (allocateseatInput.flow != "preallocation") {
          success.push(this._data.uiErrors[25000067]); //JSONData.uiErrors[21300051].localizedMessage
          this.setSuccess(success);

        }

        this.data.AllocateSeat = json;
        if (!this._data.StoreSelectedSeats) {
          this._data.StoreSelectedSeats = {};
        }

        /* Replacing Updated seat with CPR Identification */
        for (var i = 0; i < json.segmentInfos.length; i++) {
          var temp = json.segmentInfos[i].seatResponseInfos[0];
          for (var j = 0; j < temp.passengerInfos.length; j++) {

            if (temp.ssrDataDetails[j] && temp.ssrDataDetails[j].seatNumber) {
              this._data.StoreSelectedSeats[temp.passengerInfos[j].IDSections[0].ID] = temp.ssrDataDetails[j].seatNumber;
            } else {
              this._data.StoreSelectedSeats[temp.passengerInfos[j].IDSections[0].ID] = "Not Added";
            }
          }
        }


        if (allocateseatInput.flow != "preallocation" && exitRowPassengers != null && exitRowPassengers.length > 0) {
          this._data.ExitRowPsngrs = exitRowPassengers;
          var cpr = this.getFullJSON();
          var selCPR = this.getSelectedPax();
          var selectedProdForSeatMap = this.getSelectedProductForSeatMap();
          var emergencyExitInput = {
            "exitRowPeassengers": exitRowPassengers,
            "selectedCPR": selCPR,
            "STATUS_INDICATOR": "Z",
            "seatMapProdIndex": selectedProdForSeatMap.seatMapProdIndex
          }
          jQuery('#splashScreen').hide();
          this.emergencyExitSeatAlllocation(emergencyExitInput)

        } else {
          if (allocateseatInput.flow == "preallocation" && allocateseatInput.seat == "Not Added") {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            this.appCtrl.load("merci-checkin-MAcceptanceOverview_A");
            this.raiseEvent({
              "name": "seat.updated.loaded",
              "args": allocateseatInput
            });
          } else {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            window.history.back();
            this.raiseEvent({
              "name": "seat.updated.loaded",
              "args": allocateseatInput
            });
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __allocateSeatCallback function',
          exception);
      }
    },

    /**
     * Emergency Exit seat Allocation
     * This method is used to Allocate Emergency Exit Seat which is selected from seat map.
     */
    emergencyExitSeatAlllocation: function(emergencyExitInput) {
      try {
        jQuery("#seatErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering emergencyExitSeatAlllocation function');
        this.submitJsonRequest("IEmergencyExitPrompt", emergencyExitInput, {
          scope: this,
          fn: "__emergencyExitSeatAlllocationCallback",
          args: emergencyExitInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in emergencyExitSeatAlllocation function',
          exception);
      }
    },

    /**
     * __emergencyExitSeatAlllocationCallback
     * This method is the callback method for the emergencyExitSeatAlllocation seat action.
     */

    __emergencyExitSeatAlllocationCallback: function(res, emergencyExitInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering __emergencyExitSeatAlllocationCallback function');
        var errors = [];
        var warnings = [];
        var json = {};
        var exitRowPassengers = [];
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = res.responseJSON.data.checkIn.MEmergencyExit_A.requestParam.EmergencyExitPromptBean;
          this._data.uiErrors = res.responseJSON.data.checkIn.MEmergencyExit_A.errorStrings;

          // We check for errors
          if (json.applicationErrors != null) {
            for (var i = 0; i < json.applicationErrors.length; i++) {
              var code = json.applicationErrors[i].errorCodeErrorCode;
              var category = json.applicationErrors[i].errorCodeErrorCategory;
              if (category == "EC") {
                for (var j = 0; j < json.applicationErrors[i].errorTextBean.length; j++) {
                  for (var k = 0; k < json.applicationErrors[i].errorTextBean[j].freeTexts.length; k++) {
                    errors.push({
                      "localizedMessage": this._data.uiErrors[21400074].localizedMessage,
                      "code": this._data.uiErrors[21400074].errorid
                    });
                    //errors.push({"localizedMessage":json.applicationErrors[i].errorTextBean[j].freeTexts[k],"code":code});
                  }
                }
              }
              /*else if (category == "WEC") {
                for (var j=0 ; j < json.applicationErrors[i].errorTextBean.length ; j++) {
                      for (var k=0 ; k < json.applicationErrors[i].errorTextBean[j].freeTexts.length ; k++){
                        warnings.push({"localizedMessage":json.applicationErrors[i].errorTextBean[j].freeTexts[k],"code":code});
                      }
                    }
              }*/

            }
          }


        }



        // In case of error
        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.displayErrors(errors, "seatErrors", "error");
          return null;
        }

        // In case of Warnings
        if (this._data.Warnings != null) {
          this._data.Warnings = null;
        }
        if (warnings != null && warnings.length > 0) {
          this._data.Warnings = warnings;
        }

        // We load the json to the datamodel
        this._data.EmergencyExitSeat = json;

        //jQuery('#splashScreen').hide();
        if (json.grpPaxInfos && json.grpPaxInfos.length > 0) {
          /*
           * for showing exitrow question popup only once, when calling emergencyExitSeatAlllocation
           * from initiateacceptance and having multiple product having exitrow customers. it will send request internally for
           * all the products and all the customers but it will show popup only once with product having majarity customers
           * */
          if (this._data.exitRowListPopupcount == 0) {
            jQuery('#overlayCKIN').show();
            this.displayExitPromptList(json, "serviceoverlayCKIN");
            jQuery(document).scrollTop("0");
            jQuery('#serviceoverlayCKIN').show();

            this._data.exitRowListPopupcount = 1;

          } else {

            var selectedProdForSeatMap = this.getSelectedProductForSeatMap();
            var exitRowPassengers = this.getExitRowPsngrs();
            // input json
            var emergencyExitInput = {
              "exitRowPeassengers": exitRowPassengers,
              "selectedCPR": this.getSelectedPax(),
              "seatMapProdIndex": selectedProdForSeatMap.seatMapProdIndex,
              "STATUS_INDICATOR": this._data.exitRowListAnswerForAll
            }


            jQuery(document).scrollTop("0");
            jQuery('#serviceoverlayCKIN').html("");
            jQuery('#serviceoverlayCKIN').hide();
            $('.popupBGmask.forMCIDialogbox').css('display', 'none');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();

            //we call the controller to retrive
            this.emergencyExitSeatAlllocation(emergencyExitInput);

          }

        } else {

          /*
           * for detecting next product which having exit row customers
           * */
          if (this._data.exitRowListWhenCheckinProd && this._data.exitRowListWhenCheckinProd >= 0 && parseInt(this._data.exitRowListWhenCheckinProd) + 1 != this._data.exitRowListWhenCheckinProdCunt) {
            for (var iii = parseInt(this._data.exitRowListWhenCheckinProd) + 1; iii < this._data.exitRowListWhenCheckinProdCunt; iii++) {
              if (this._data.exitRowListWhenCheckin[iii].length > 0) {
                this._data.exitRowListWhenCheckinProd = iii;
                break;
              }
            }
          } else if (this._data.exitRowListWhenCheckinProd && this._data.exitRowListWhenCheckinProd >= 0) {
            this._data.exitRowListWhenCheckinProd = "Confirmation";
            this._data.exitRowListWhenCheckin = null;
            this._data.exitRowListWhenCheckinProdCunt = 0;
          }

          if (this._data.exitRowListWhenCheckinProd && this._data.exitRowListWhenCheckinProd >= 0 && this._data.exitRowListWhenCheckinProd != "Confirmation") {
            this._data.ExitRowPsngrs = this._data.exitRowListWhenCheckin[this._data.exitRowListWhenCheckinProd];
            var seatMapInput = {

              "seatMapProdIndex": this._data.exitRowListWhenCheckinProd

            }
            this._data.SelectionForSeatMap = seatMapInput;
            var cpr = this.getFullJSON();
            var selCPR = this.getSelectedPax();

            var emergencyExitInput = {
              "exitRowPeassengers": this._data.ExitRowPsngrs,
              "selectedCPR": selCPR,
              "STATUS_INDICATOR": "Z",
              "seatMapProdIndex": this._data.exitRowListWhenCheckinProd
            }
            jQuery('#splashScreen').hide();
            this.emergencyExitSeatAlllocation(emergencyExitInput);
            return null;
          } else if (this._data.exitRowListWhenCheckinProd && this._data.exitRowListWhenCheckinProd == "Confirmation") {
            this._data.exitRowListWhenCheckinProd = null;

            jQuery(document).scrollTop("0");
            jQuery('#serviceoverlayCKIN').html("");
            jQuery('#serviceoverlayCKIN').hide();
            $('.popupBGmask.forMCIDialogbox').css('display', 'none');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            return null;
          }

          var preallocateseatInput = this.getSelectedPaxPrimeRef();
          /*
           * this condition always false, as in trip over view seat selection option removed,
           * and preallocation also removed completely.
           * so flow is like 1. While checkin seat allocation happens.
           * seat can be changed only after checkin.
           * */
          if (preallocateseatInput && preallocateseatInput.seatselection && preallocateseatInput.seatselection.length > 0 && false) {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            this.appCtrl.load("merci-checkin-MAcceptanceOverview_A");
            this.raiseEvent({
              "name": "seat.updated.loaded",
              "args": emergencyExitInput
            });
          } else {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            $('.popupBGmask.forMCIDialogbox').css('display', 'none');
            window.history.back();
            this.raiseEvent({
              "name": "seat.updated.loaded",
              "args": emergencyExitInput
            });
          }

        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __emergencyExitSeatAlllocationCallback function',
          exception);
      }
    },

    /**
     * Print Boarding Pass
     * This method is used to Print Boarding Pass.
     */
    printBoardingPass: function(boardingPassInput) {
      try {
        this.setBoardingInput(boardingPassInput);
        jQuery("#boardingPassErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering printBoardingPass function');
        this.submitJsonRequest("IPrintBoardingPass", boardingPassInput, {
          scope: this,
          fn: this.__printBoardingPassCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in printBoardingPass function',
          exception);
      }
    },

    /**
     * __printBoardingPassCallback
     * This method is the callback method for the login action.
     */

    __printBoardingPassCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __printBoardingPassCallback function');
        var getPassbookFlag = this.getBoardingInput();
        var flag = getPassbookFlag.isPassbook;
        if (!flag) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#splashScreen').hide();
        }
        var errors = [];
        var json = {};
        var json = this.getModuleData();
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        }
        if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {

          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {

          // In case of error
          if (errors != null && errors.length > 0) {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#splashScreen').hide();
            jQuery('#overlayCKIN').hide();
            this.displayErrors(errors, "boardingPassErrors", "error");
            return null;
          }

          /*GOOGLE ANALYTICS
           * */

          //FOR EVENT
          if (this._data.GADetails.siteGAEnable) {
            var loginOrguestUser = "";
            var headerData = this.getHeaderInfo()
            if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
              loginOrguestUser = "KFMember";
            } else {
              loginOrguestUser = "GuestLogin";
            }

            if (this.getEmbeded() && aria.core.Browser.isIOS) {

              //ga('send', 'event', 'MCIAppiPhoneMBP', loginOrguestUser, 'iPhone',1);

              //window.location = "sqmobile"+"://?flow=MCI/eventtrigger=Category=MCIAppiPhoneMBP&Action="+loginOrguestUser+"&Label=iPhone&value=1";
              jQuery("[name='ga_track_event']").val("Category=MCIAppiPhoneMBP&Action=" + loginOrguestUser + "&Label=iPhone&value=1");
              var GADetails = this._data.GADetails;
              this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppiPhoneMBP',
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppiPhoneMBPAirportCode - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsBoardPoint,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppiPhoneMBPFlightNo - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsFlightNumber,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });
			  
            } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

              //ga('send', 'event', 'MCIAppAndroidMBP', loginOrguestUser, 'Android',1);
              //window.location = "sqmobile"+"://?flow=MCI/eventtrigger=Category=MCIAppAndroidMBP&Action="+loginOrguestUser+"&Label=Android&value=1";
              jQuery("[name='ga_track_event']").val("Category=MCIAppAndroidMBP&Action=" + loginOrguestUser + "&Label=Android&value=1");
              var GADetails = this._data.GADetails;
              this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppAndroidMBP',
                action: loginOrguestUser,
                label: 'Android',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppAndroidMBPAirportCode - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsBoardPoint,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIAppAndroidMBPFlightNo - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsFlightNumber,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });			  
			  
            } else {

              //ga('send', 'event', 'MCIWebMBP', loginOrguestUser, 'Mobile Web',1);
              var GADetails = this._data.GADetails;
              this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIWebMBP',
                action: loginOrguestUser,
                label: 'Mobile Web',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIWebMBPAirportCode - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsBoardPoint,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });
			  this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIWebMBPFlightNo - ' + this._data.CPRIdentification.customerLevel[0].productLevelBean[this._data.boardingPassInput.selectedCPR[0].product].operatingFlightDetailsFlightNumber,
                action: loginOrguestUser,
                label: 'iPhone',
                requireTrackPage: true,
                value: 1
              });			  
            }

          }

          // We load the json to the datamodel
          this._data.BoardingPass = res.responseJSON.data.checkIn.MBoardingPass_A.requestParam.BoardingPass;
          this._data.BPResponseDetails = res.responseJSON.data.checkIn.MBoardingPass_A.requestParam.BPResponseDetails;
          this.setBoardingPassNtIssued(false);
          this.setCancelEnable(false);
          this.raiseEvent({
            "name": "page.refresh"
          });
          if (flag == "true") {
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            window.location = 'data:application/vnd.apple.pkpass;base64,' + res.responseJSON.data.checkIn.MBoardingPass_A.requestParam.BPResponseDetails.formattedDocumentList[0].binaryData;
            return null;
          }
          var json = this.getModuleData();
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          // navigate to next page
          //this.moduleCtrl.navigate(null, nextPage);
          this.appCtrl.load(nextPage);
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __printBoardingPassCallback function',
          exception);
      }
    },

    /**
     * DeliverDocument
     * This method is used to Print Boarding Pass.
     */
    deliverDocument: function(deliverDocInput) {
      try {
        jQuery("#initiateandEditErrors").disposeTemplate();
        this.setDeliverDocumentInput(deliverDocInput);
        this.$logInfo('ModuleCtrl::Entering deliverDocument function');
        this.submitJsonRequest("IDeliverDocument", deliverDocInput, {
          scope: this,
          fn: this.__deliverDocumentCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in printBoardingPass function',
          exception);
      }
    },

    /**
     * __printBoardingPassCallback
     * This method is the callback method for the login action.
     */

    __deliverDocumentCallback: function(res) {
      try {

        json = res;
        this.$logInfo('ModuleCtrl::Entering __deliverDocumentCallback function');

        jQuery("#AcceptanceOverviewWarnings").html("");
        jQuery("#initiateandEditErrors").html("");

        var emailsList = [];
        var mobNumList = [];
        var errors = [];
        var cprValues = this.getCPR();
        var json = {};
        var label = this.getModuleData().checkIn.MAcceptanceConfirmation_A.labels;
        var success = [];
        //We handle the error
        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
          {
            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MCheckinIndex_A");
          }

          json = res.responseJSON.data.model.DeliverDocument;

          // We check for errors
          if (json.error != null) {
            for (var i = 0; i < json.error.length; i++) {
              var code = json.error[i].errorCodeErrorCode;
              for (var j = 0; j < json.error[i].errorTextBean.length; j++) {
                for (var k = 0; k < json.error[i].errorTextBean[j].freeTexts.length; k++) {
                  errors.push({
                    "localizedMessage": json.error[i].errorTextBean[j].freeTexts[k],
                    "code": code
                  });
                }
              }
            }
          }
        }

        // In case of error
        if (errors != null && errors.length > 0) {
          jQuery('#splashScreen').hide();

          jQuery('#overlayCKIN').hide();
          this.displayErrors(errors, "boardingPassErrors", "error");
          return null;
        }
        // We load the json to the datamodel
        this._data.deliverDocument = json;
        jQuery('#emails').text(" ");
        var deliverDoc = this._data.deliverDocument;
        //On Success it goes inside if
        if (deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit > 0) {
          jQuery("#initiateandEditErrors").disposeTemplate();
          this.setCancelEnable(false);
          var delDocumentInputFormation = this._data.deliverDocInput;
          var customerEList = [];
          for (var z = 0; z < delDocumentInputFormation["SelectedBP"].length; z++) {
            var inputObject = delDocumentInputFormation["SelectedBP"][z];
            if (typeof inputObject.product == "string") {
              customerEList.push({
                "customerIdentifier": cprValues.customerLevel[delDocumentInputFormation["SelectedBP"][z].customer].uniqueCustomerIdBean.primeId,
                "productIdentifier": cprValues.customerLevel[delDocumentInputFormation["SelectedBP"][z].customer].productLevelBean[delDocumentInputFormation["SelectedBP"][z].product].productIdentifiersBean[0].primeId
              });
            } else {
              for (var k = 0; k < inputObject.product.length; k++) {
                customerEList.push({
                  "customerIdentifier": cprValues.customerLevel[delDocumentInputFormation["SelectedBP"][z].customer].uniqueCustomerIdBean.primeId,
                  "productIdentifier": cprValues.customerLevel[delDocumentInputFormation["SelectedBP"][z].customer].productLevelBean[delDocumentInputFormation["SelectedBP"][z].product[k]].productIdentifiersBean[0].primeId
                });
              }
            }
          }

          /*For retaine same session boarding passes sent previously, useful as we have not show seatmap and cancel checkin for those*/
          var tempValidinput = this.getValidDeliverDocInput();
          if (tempValidinput.length != undefined && tempValidinput.length != 0) {
            customerEList = customerEList.concat(tempValidinput);
          }

          this.setValidDeliverDocInput(customerEList);
          $('.popup.input-panel .buttons .validation').parent('footer').parent('article').parent('.input-panel').css('display', 'none');

          var panel = jQuery('.popup.input-panel .buttons .validation:not(".cancel")').parent('footer').parent('article');
          var deliverDocuIn = this.getDeliverDocumentInput();
          var selectedBP1 = deliverDocuIn["SelectedBP"];

          /**
           * EMAIL - SPBP
           * SMS - MBP
           * BOARDING - MBP
           * GA code
           */
          if (selectedBP1[0].mobileDelivery) {

            //FOR EVENT
            if (this._data.GADetails.siteGAEnable) {
              var loginOrguestUser = "";
              var headerData = this.getHeaderInfo()
              if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
                loginOrguestUser = "KFMember";
              } else {
                loginOrguestUser = "GuestLogin";
              }
              var GADetails = this._data.GADetails;
              if (this.getEmbeded() && aria.core.Browser.isIOS) {

                //ga('send', 'event', 'MCIAppiPhoneMBP', loginOrguestUser, //'iPhone',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

                window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=MCIAppiPhoneMBP&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'MCIAppiPhoneMBP',
                  action: loginOrguestUser,
                  label: 'iPhone',
                  requireTrackPage: true,
                  value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                });
              } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                //ga('send', 'event', 'MCIAppAndroidMBP', loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=MCIAppAndroidMBP&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'MCIAppAndroidMBP',
                  action: loginOrguestUser,
                  label: 'Android',
                  requireTrackPage: true,
                  value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                });
              } else {

                //ga('send', 'event', 'MCIWebMBP', loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'MCIWebMBP',
                  action: loginOrguestUser,
                  label: 'Mobile Web',
                  requireTrackPage: true,
                  value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                });
              }
            }
          } else {
            for (var indx in selectedBP1[0].product) {
              var index = selectedBP1[0].product[indx];

              var Boardingpoint = this._data.CPRIdentification.customerLevel[0].productLevelBean[index].operatingFlightDetailsBoardPoint;
              var FlightNumber = this._data.CPRIdentification.customerLevel[0].productLevelBean[index].operatingFlightDetailsFlightNumber;

              //FOR EVENT
              if (this._data.GADetails.siteGAEnable) {
                var loginOrguestUser = "";
                var headerData = this.getHeaderInfo()
                if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
                  loginOrguestUser = "KFMember";
                } else {
                  loginOrguestUser = "GuestLogin";
                }
                var GADetails = this._data.GADetails;
                if (this.getEmbeded() && aria.core.Browser.isIOS) {

                  //ga('send', 'event', 'MCIAppiPhoneSPBPAirportCode - '+Boardingpoint, loginOrguestUser, //'iPhone',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                  //ga('send', 'event', 'MCIAppiPhoneSPBPFlightNo - '+FlightNumber, loginOrguestUser, //'iPhone',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                  window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=MCIAppiPhoneSPBPAirportCode - " + Boardingpoint + "&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit) + "^" + "Category=MCIAppiPhoneSPBPFlightNo - " + FlightNumber + "&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppiPhoneSPBPAirportCode - ' + Boardingpoint,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                  });
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppiPhoneSPBPFlightNo - ' + FlightNumber,
                    action: loginOrguestUser,
                    label: 'iPhone',
                    requireTrackPage: true,
                    value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                  });
                } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                  //ga('send', 'event', 'MCIAppAndroidSPBPAirportCode - '+Boardingpoint, loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                  //ga('send', 'event', 'MCIAppAndroidSPBPFlightNo - '+FlightNumber, loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                  window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=MCIAppAndroidSPBPAirportCode - " + Boardingpoint + "&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit) + "^" + "Category=MCIAppAndroidSPBPFlightNo - " + FlightNumber + "&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppAndroidSPBPAirportCode - ' + Boardingpoint,
                    action: loginOrguestUser,
                    label: 'Android',
                    requireTrackPage: true,
                    value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                  });
                  this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIAppAndroidSPBPFlightNo - ' + FlightNumber,
                    action: loginOrguestUser,
                    label: 'Android',
                    requireTrackPage: true,
                    value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                  });
                } else {
                    //ga('send', 'event', 'MCIWebSPBPAirportCode - '+Boardingpoint, loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                    // ga('send', 'event', 'MCIWebSPBPFlightNo - '+FlightNumber, loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'MCIWebSPBPAirportCode - ' + Boardingpoint,
                      action: loginOrguestUser,
                      label: 'Mobile Web',
                      requireTrackPage: true,
                      value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                    });
                    this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    category: 'MCIWebSPBPFlightNo - ' + FlightNumber,
                    action: loginOrguestUser,
                    label: 'Mobile Web',
                    requireTrackPage: true,
                    value: parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit)
                  });
                }
              }

            }

          }

          if (selectedBP1[0]["mobileDelivery"] != null && selectedBP1[0]["mobileDelivery"] != "undefined") {
            //jQuery('#conf-email').addClass('hidden');
            var buttonToDisable = jQuery('.getPassbook a.secondary.sms');
            //jQuery('#conf-sms').removeClass('hidden');
            var deliverDocuIn = this._data.deliverDocInput;
            var selectedBP1 = deliverDocuIn["SelectedBP"];
            var mobNumsList = "";

            for (var m = 0; m < selectedBP1.length; m++) {
              var mobileDeliveryIn = selectedBP1[m]["mobileDelivery"];
              mobNumsList += mobileDeliveryIn["phoneNum"];
              mobNumList.push(mobileDeliveryIn["phoneNum"]);
              if (m != selectedBP1.length - 1) {
                mobNumsList += ",";
              }
            }
            var finalMobNumList = [];
            mobNumList = mobNumList.sort();
            for (var k = 0; k < mobNumList.length; k++) {
              if (mobNumList[k] != mobNumList[k + 1]) {
                finalMobNumList.push(mobNumList[k]);
              }
            }
            jQuery('#numbers').text(finalMobNumList.join());
            this.raiseEvent({
              "name": "page.refresh"
            });
            success.push({
              "localizedMessage": label.MobileMsg + finalMobNumList.join(", ")
            });
            this.displayErrors(success, "initiateandEditErrors", "success");

          } else {
            //jQuery('#conf-sms').addClass('hidden');
            var buttonToDisable = $('.getPassbook a.secondary.email');
            // jQuery('#conf-email').removeClass('hidden');
            var deliverDocuIn = this._data.deliverDocInput;
            var selectedBP = deliverDocuIn["SelectedBP"];
            var emailAddressList = "";
            for (var z = 0; z < selectedBP.length; z++) {
              var emailDeliveryIn = selectedBP[z]["emailDelivery"];
              emailAddressList += emailDeliveryIn["emailAddress"];
              emailsList.push(emailDeliveryIn["emailAddress"]);
              if (z != selectedBP.length - 1) {
                emailAddressList += ",";
              }
            }
            var finalEmailsList = [];
            emailsList = emailsList.sort();
            for (var k = 0; k < emailsList.length; k++) {
              if (emailsList[k] != emailsList[k + 1]) {
                finalEmailsList.push(emailsList[k]);
              }
            }
            jQuery('#emails').text(finalEmailsList.join());
            this.raiseEvent({
              "name": "page.refresh"
            });
            success.push({
              "localizedMessage": label.EmailMsg + finalEmailsList.join(", ")
            });
            this.displayErrors(success, "initiateandEditErrors", "success");
          }
        } else {
          errors.push({
            "localizedMessage": this._data.errorStrings[213002114].localizedMessage,
            "code": this._data.errorStrings[213002114].errorid
          });
          this.raiseEvent({
            "name": "page.refresh"
          });
          this.displayErrors(errors, "initiateandEditErrors", "error");
        }

        $('.msk').css('display', 'none');

        // we will call the load function to load the page
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __deliverDocumentCallback function',
          exception);
      }
    },



    displayErrors: function(errors, errorDiv, type) {
      try {
        this.$logInfo('ModuleCtrl::Entering displayErrors function');
        Aria.loadTemplate({
          "classpath": "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
          moduleCtrl: this,
          "div": errorDiv,
          "data": {
            "messages": errors,
            "type": type
          }
        });
        jQuery('body').scrollTop("0");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in displayErrors function',
          exception);
      }
    },

    displayPromptList: function(prompt, promptDiv) {
      try {
        this.$logInfo('ModuleCtrl::Entering displayPromptList function');
        Aria.loadTemplate({
          "classpath": "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Prompt",
          moduleCtrl: this,
          "div": promptDiv,
          "data": prompt
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in displayPromptList function',
          exception);
      }
    },
    displayExitPromptList: function(exitprompt, exitpromptDiv) {
      try {
        this.$logInfo('ModuleCtrl::Entering displayExitPromptList function');
        Aria.loadTemplate({
          "classpath": "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.ExitRowPrompt",
          moduleCtrl: this,
          args:[{"moduleCtrlData": this._data}],
          "div": exitpromptDiv,
          "data": exitprompt
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in displayExitPromptList function',
          exception);
      }
    },

    nationalityPrompt: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering nationalityPrompt function');
        this.checkRegulatory();
        //this.$load("checkin/EditCPR");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in nationalityPrompt function',
          exception);
      }
    },

    countryListPrompt: function(countryPrompt, countryPromptDiv) {
      try {
        this.$logInfo('ModuleCtrl::Entering countryListPrompt function');
        Aria.loadTemplate({
          "classpath": "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.CountryListPrompt",
          moduleCtrl: this,
          "div": countryPromptDiv,
          "data": countryPrompt
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in countryListPrompt function',
          exception);
      }
    },

    initiateSMS: function() {
      // we will call the load function to load the page
      try {
        this.$logInfo('ModuleCtrl::Entering initiateSMS function');
        this.$load("checkin/SMS");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in initiateSMS function',
          exception);
      }
    },

    sendSMS: function(smsInput, idIdentifier) {
      try {
        this.$logInfo('ModuleCtrl::Entering sendSMS function');
        var BoardingPassFlow = "BoardingPassFlow";
        var actionUrl = this._data.staticsBaseUrl + "/plnext/dev/" + BoardingPassFlow + ".action?";
        var sms = {
          "lastName": smsInput.lastName,
          "tel": smsInput.phoneNo,
          "recLoc": smsInput.recLoc,
          "primeId": smsInput.PrimeId,
          "BPUrl": actionUrl,
          "Lang": "LANGUAGE=" + this._data.language,
          "Site": "SITE=" + this._data.site
        }
        this.submitJsonRequest("IInitiateSMS", sms, {
          scope: this,
          fn: "__sendSMSPassCallback",
          args: idIdentifier
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in sendSMS function',
          exception);
      }

    },

    /*
     *FOR getting month from date
     * */

    getMonth: function(date) {
      try {
        this.$logInfo('ModuleCtrl::Entering getMonth function');
        var myProp = "";
        if (date.getMonth() == 0) {
          myProp = "Jan"
        };
        if (date.getMonth() == 1) {
          myProp = "Feb"
        };
        if (date.getMonth() == 2) {
          myProp = "Mar"
        };
        if (date.getMonth() == 3) {
          myProp = "Apr"
        };
        if (date.getMonth() == 4) {
          myProp = "May"
        };
        if (date.getMonth() == 5) {
          myProp = "Jun"
        };
        if (date.getMonth() == 6) {
          myProp = "Jul"
        };
        if (date.getMonth() == 7) {
          myProp = "Aug"
        };
        if (date.getMonth() == 8) {
          myProp = "Sep"
        };
        if (date.getMonth() == 9) {
          myProp = "Oct"
        };
        if (date.getMonth() == 10) {
          myProp = "Nov"
        };
        if (date.getMonth() == 11) {
          myProp = "Dec"
        };

        return myProp;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getMonth function',
          exception);
      }

    },

    /*
     *FOR Get weekday from date
     * */

    getWeekDay: function(date) {
      try {
        this.$logInfo('ModuleCtrl::Entering getWeekDay function');
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[date.getDay()];
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getWeekDay function',
          exception);
      }

    },

    /**
     * __sendSMSCallback
     * This method is the callback method for the sms action.
     */

    __sendSMSPassCallback: function(res, idIdentifier) {
      try {
        this.$logInfo('ModuleCtrl::Entering __sendSMSPassCallback function');
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();

        var errors = [];
        var json = {};
        json = res.data.model.SMSStatus;
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

        if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          var smsData = {
            "sMessage": this.res.Sms.label.Success,
            "fMessage": this.res.Sms.label.Failure,
            "cust_index": idIdentifier.cust_index,
            "smsStatus": json.smsstatus
          };
          if (json.smsstatus == "SUCCESS") {
            this.raiseEvent({
              "name": "sms.updated.loaded",
              "args": smsData
            });
          }
          if (json.smsstatus == "SITE_JSP_GENERIC_ERROR") {
            this.raiseEvent({
              "name": "sms.updated.loaded",
              "args": smsData
            });
          } else {
            this.raiseEvent({
              "name": "sms.updated.loaded",
              "args": smsData
            });
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __sendSMSPassCallback function',
          exception);
      }
    },
    cancelAcceptance: function(cancelCheckInInput) {
      try {
        /*dispose template if in case cancel check in calling from confirmation screen, retain same error message with out dispose template
         *  if calling cancel checkin incase app check or stand by fail */
        if (this.getIsFlowAppCancel() == false) {
          jQuery("#initiateandEditErrors").disposeTemplate();
        }

        this.$logInfo('ModuleCtrl::Entering cancelAcceptance function');
        this.submitJsonRequest("IInitiateCancelAccept", cancelCheckInInput, {
          scope: this,
          fn: this.__cancelAcceptanceCallback,
          args: cancelCheckInInput
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in cancelAcceptance function',
          exception);
      }
    },
    __cancelAcceptanceCallback: function(res, cancelCheckInInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering __cancelAcceptanceCallback function');

        var errors = [];
        var json = {};
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        this._data.validGTMForCancelAcceptance={};

        if (res.error) {
          errors.push({
            "localizedMessage": res.errorData.messageBean.localizedMessage,
            "code": res.errorData.messageBean.code
          });
        } else if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MCheckinIndex_A");
        } else {
          json = res.responseJSON.data.checkIn.MInitiateCancelAcceptance_A.requestParam.InitiateCancelCustomerAcceptance;
          this._data.uiErrors = res.responseJSON.data.checkIn.MInitiateCancelAcceptance_A.errorStrings;
          // We check for errors
          if (json.errorBean != null) {
            for (var i = 0; i < json.errorBean.length; i++) {
              var code = json.errorBean[i].errorOrWarningCodeDetailsErrorCode;
              var category = json.errorBean[i].errorOrWarningCodeDetailsErrorCategory;
              if (category == "EC") {
                for (var k = 0; k < json.errorBean[i].errorWarningDescription.freeTexts.length; k++) {
                  errors.push({
                    "localizedMessage": this._data.uiErrors[25000016].localizedMessage,
                    "code": this._data.uiErrors[25000016].errorid
                  });
                }
              }
            }
          }
          if (json.customerAndProductsBean != null && json.customerAndProductsBean.length > 0) {
            for (var i = 0; i < json.customerAndProductsBean.length; i++) {
              for (var j = 0; json.customerAndProductsBean[i].acceptanceJourneies != null && j < json.customerAndProductsBean[i].acceptanceJourneies.length; j++) {
                for (var k = 0; json.customerAndProductsBean[i].acceptanceJourneies[j].errors != null && k < json.customerAndProductsBean[i].acceptanceJourneies[j].errors.length; k++) {
                  category = json.customerAndProductsBean[i].acceptanceJourneies[j].errors[k].errorOrWarningCodeDetailsErrorCategory
                  if (category == "EC") {
                    if (json.customerAndProductsBean[i].acceptanceJourneies[j].errors[k].errorOrWarningCodeDetailsErrorCode == "14189") {
                      errors.push({
                        "localizedMessage": this._data.uiErrors[25000018].localizedMessage,
                        "code": this._data.uiErrors[25000018].errorid
                      });
                    } else {
                      errors.push({
                        "localizedMessage": this._data.uiErrors[25000016].localizedMessage,
                        "code": this._data.uiErrors[25000016].errorid
                      });
                    }
                  }
                }
              }
            }
          }
        }

        if (errors != null && errors.length > 0) {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
          this.displayErrors(errors, "initiateandEditErrors", "error");
          return null;
        }


        /*
         * Google analytics
         * */

        //FOR EVENT
        if (this._data.GADetails.siteGAEnable) {
          var loginOrguestUser = "";
          var headerData = this.getHeaderInfo()
          if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
            loginOrguestUser = "KFMember";
          } else {
            loginOrguestUser = "GuestLogin";
          }
          var GADetails = this._data.GADetails;
          if (this.getEmbeded() && aria.core.Browser.isIOS) {

            //ga('send', 'event', 'MCIAppiPhoneCancelCheckin', loginOrguestUser, 'iPhone',cancelCheckInInput.selectedCPR[0].customer.length);
            jQuery("[name='ga_track_event']").val("Category=MCIAppiPhoneCancelCheckin&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(cancelCheckInInput.selectedCPR[0].customer.length));
            this.__ga.trackEvent({
              domain: GADetails.siteGADomain,
              account: GADetails.siteGAAccount,
              gaEnabled: GADetails.siteGAEnable,
              category: 'MCIAppiPhoneCancelCheckin',
              action: loginOrguestUser,
              label: 'iPhone',
              requireTrackPage: true,
              value: parseInt(cancelCheckInInput.selectedCPR[0].customer.length)
            });
          } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

            jQuery("[name='ga_track_event']").val("Category=MCIAppAndroidCancelCheckin&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(cancelCheckInInput.selectedCPR[0].customer.length));
            //ga('send', 'event', 'MCIAppAndroidCancelCheckin', loginOrguestUser, 'Android',cancelCheckInInput.selectedCPR[0].customer.length);
            this.__ga.trackEvent({
              domain: GADetails.siteGADomain,
              account: GADetails.siteGAAccount,
              gaEnabled: GADetails.siteGAEnable,
              category: 'MCIAppAndroidCancelCheckin',
              action: loginOrguestUser,
              label: 'Android',
              requireTrackPage: true,
              value: parseInt(cancelCheckInInput.selectedCPR[0].customer.length)
            });
          } else {
               //ga('send', 'event', 'MCIWebCancelCheckin', loginOrguestUser, 'Mobile Web',cancelCheckInInput.selectedCPR[0].customer.length);
              this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'MCIWebCancelCheckin',
                action: loginOrguestUser,
                label: 'Mobile Web',
                requireTrackPage: true,
                value: parseInt(cancelCheckInInput.selectedCPR[0].customer.length)
              });
          }

        }

        var cprVals=this.getCPR();
        for(var i=0;i<cancelCheckInInput.selectedCPR.length;i++)
        {
        	for(var j=0;j<cancelCheckInInput.selectedCPR[i].customer.length;j++)
        	{
        		/*prod id*/
				var prodID="";
				var prod=cprVals.customerLevel[cancelCheckInInput.selectedCPR[i].customer[j]].productLevelBean[cancelCheckInInput.selectedCPR[i].product];
				var cust=cprVals.customerLevel[cancelCheckInInput.selectedCPR[i].customer[j]];
				for(var p=0;p<prod.productIdentifiersBean.length;p++)
				{
					if(prod.productIdentifiersBean[p].referenceQualifier.search(/DID/gi) != -1)
					{
						prodID=prod.productIdentifiersBean[p].primeId;
					}
				}

				 var seat = this.getSeat(cancelCheckInInput.selectedCPR[i].customer[j] , cancelCheckInInput.selectedCPR[i].product , prodID);
                 if(seat == "Not Added")
                 {
                	 seat="";
                 }
				this._data.validGTMForCancelAcceptance[prodID]={

	        			"boardPoint":prod.operatingFlightDetailsBoardPoint,
	              		"offPoint":prod.operatingFlightDetailsOffPoint,
						"flightCarrier":prod.operatingFlightDetailsMarketingCarrier,
						"flightNum":prod.operatingFlightDetailsFlightNumber,
	              		"gender":cust.otherPaxDetailsBean != null?cust.otherPaxDetailsBean[0].gender:"",
	              		"type": cust.customerDetailsType,
	              		"bookingclass":prod.bookedCabinCodeBean.cabinDetailsBookingClass,
	              		"seat":	seat
	        	}

				/*For handling infant scenario*/
				var index=this.getInfantOrPaxIndex(cancelCheckInInput.selectedCPR[i].customer[j]);
				if(index != -1)
				{
					if(typeof cancelCheckInInput.selectedCPR[i].customer == "string")
					{
						cancelCheckInInput.selectedCPR[i].customer=[cancelCheckInInput.selectedCPR[i].customer];
					}
					if(cancelCheckInInput.selectedCPR[i].customer.toString().search(index) == -1)
					{
						cancelCheckInInput.selectedCPR[i].customer.push(index);
					}
				}


        	}

        }
        this.findMissingDetailsForGTM(this._data.validGTMForCancelAcceptance);

        if (!this.getEmbeded() && this.utils.isGTMEnabled()) {

        	var GADetails = this.getGADetails();

        	if(!jQuery.isUndefined(cancelCheckInInput.fromInitiateAcceptance) && cancelCheckInInput.fromInitiateAcceptance == true)
        	{
        		var sqData=this.forFormingGTMsqData(this._data.validGTMForCancelAcceptance,cancelCheckInInput.selectedCPR);
        		//console.log("confirm checkin: "+JSON.stringify(sqData));

        		this.__ga.trackEvent({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    sqData:!jQuery.isUndefined(sqData)?sqData:"NA",
                    GTMPage: 'Confirmation'
                  });
        	}

        	var sqData=this.forFormingGTMsqData(this._data.validGTMForCancelAcceptance,cancelCheckInInput.selectedCPR,'c');
        	//console.log("cancel checkin: "+JSON.stringify(sqData));

             this.__ga.trackEvent({
               domain: GADetails.siteGADomain,
               account: GADetails.siteGAAccount,
               gaEnabled: GADetails.siteGAEnable,
               sqData:!jQuery.isUndefined(sqData)?sqData:"NA",
               GTMPage: 'Cancellation'
             });
        }

        if (this.getIsFlowAppCancel() == false) {
          this.setIsFlowInCancelCheckin(1);
          var cprInput = {
            "recLoc": cancelCheckInInput.recLoc,
            "lastName": cancelCheckInInput.lastName
          }
          this.cprRetreive(cprInput);
        } else {
          if (this._data.cancelChkinRepCallAry.length > 0 && this._data.cancelChkinRepCallAry.length > this._data.cancelChkinRepCallAryindex) {
            this.cancelAcceptance(this._data.cancelChkinRepCallAry[this._data.cancelChkinRepCallAryindex]);
            this._data.cancelChkinRepCallAryindex++;
          }
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        }



      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __cancelAcceptanceCallback function',
          exception);
      }
    },

    refreshLocalStorage: function(refreshInput, keys) {
      try {
        this.$logInfo('ModuleCtrl::Entering refreshLocalStorage function');
        this.submitJsonRequest("BoardingPassFlow", refreshInput, {
          scope: this,
          fn: "__refreshLocalStorageCallback",
          args: keys
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in refreshLocalStorage function',
          exception);
      }
    },

    __refreshLocalStorageCallback: function(res, keys) {
      try {
        this.$logInfo('ModuleCtrl::Entering __refreshLocalStorageCallback function');
        var pidList = res.data.model.BoardingPass.pid;
        var keysList = [];
        var n = keys.search("_");
        if (n != -1) {
          keysList = keys.split('_');
        } else {
          keysList.push(keys);
        }
        var attrList = null;
        for (k = 0; k < keysList.length; k++) {

          var offlinekey = '';
          var key = localStorage.key(keysList[k]);
          var offlinekey = key.split('_');
          var departureDate = "";
          var arrivalDate = "";
          for (j = 0; j < pidList.length; j++) {
            var pid = pidList[j];
            if (offlinekey[10] == pid) {
              departureDate = eval(res.data.model.BoardingPass.departureDate[j]);
              arrivalDate = eval(res.data.model.BoardingPass.arrivalDate[j]);
              break;
            }
          }
          var fDepDate = aria.utils.Date.format(departureDate, this.res.FlightDetails.pattern.Date, false);
          var fDepTime = aria.utils.Date.format(departureDate, this.res.FlightDetails.pattern.Time, false);
          var fArrTime = aria.utils.Date.format(arrivalDate, this.res.FlightDetails.pattern.Time, false);
          var dateKey = fDepDate + " " + fDepTime + " - " + fArrTime;

          //PNR_5IF63Y_2_0_6X35_London_Singapore_02:30 PM - 11:30 AM_RAMESH RAMESH
          var newKey = offlinekey[0] + "_" + offlinekey[1] + "_" + offlinekey[2] + "_" + offlinekey[3] + "_" + offlinekey[4] + "_" + offlinekey[5] + "_" + offlinekey[6] + "_" + dateKey + "_" + offlinekey[8] + "_" + offlinekey[9] + "_" + offlinekey[10];
          localStorage.removeItem(key);
          localStorage.setItem(newKey, "");
          localStorage[newKey] = "<img src=\"data:image/png;base64," + res.data.model.BoardingPass.boardingPassBase64[0] + "\"alt=\"${label.Title}\" width=\"280px\" height=\"280px\" />";
          for (i = 0; i < localStorage.length; i++) {
            var storagekey = localStorage.key(i);
            if (storagekey == newKey) {
              if (attrList == null) {
                attrList = "" + i;
              } else {
                attrList = attrList + "_" + i;
              }
              break;
            }
          }
        }
        this.raiseEvent({
          "name": "localStorage.refresh.done",
          "args": attrList
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __refreshLocalStorageCallback function',
          exception);
      }
    },
    paxflightSelection: function(args) {
      try {
        this.submitJsonRequest("paxSegmentSelection", "", {
          scope: this,
          fn: this.__paxflightSelectionCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in paxSegmentSelection function',
          exception);
      }
    },
    __paxflightSelectionCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __paxflightSelectionCallback function');
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MCheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam && res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam) {
              if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.GenError) {
                errors.push({
                  "localizedMessage": genErrors
                });
              } else if (res.responseJSON.data.checkIn.MCheckinIndex_A.requestParam.SessionExpired) {
                errors.push({
                  "localizedMessage": genErrors
                });
              }
            }

            if (errors.length > 0) {
              this.displayErrors(errors, "pageErrors", "error");
              return null;
            }

          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.CPRIdentification = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);
            this.appCtrl.load(nextPage);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __paxflightSelectionCallback function',
          exception);
      }
    },

    submitJsonRequest: function(actionName, actionInput, callback) {
      try {
        this.$logInfo('ModuleCtrl::Entering submitJsonRequest function');
        var mainUrl;
        var actionUrl;
        mainUrl = location.href;
        mainUrl = mainUrl.split('#');
        if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
          actionUrl = mainUrl[0].replace("CPRRetrieve", actionName);
        } else {
          actionUrl = mainUrl[0].replace("checkinFlow", actionName);
        }

        var sessionId = this.getSessionId();
        if (sessionId && sessionId != null) {
          var action = ".action;jsessionid=" + sessionId;
          actionUrl = actionUrl.replace(".action", action);
        }
        //actionUrl = actionUrl + "&result=json";
        //this._data.genErrorJson = null;
        actionUrl = actionName + ".action";
        var _this = this;
        var query = 'result=json&data=' + JSON.stringify(actionInput);
        var request = modules.view.merci.common.utils.MCommonScript.navigateRequest(query, actionUrl, callback);
        request.isCompleteURL = false;
        modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in submitJsonRequest function',
          exception);
      }
    },


    callBack: function(res, callBack) {
      try {
        this.$logInfo('ModuleCtrl::Entering callBack function');
        eval("this." + callBack.fn + "(" + res.responseText + "," + callBack.args + ")");
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in callBack function',
          exception);
      }
    },

    getMoreDetailsRequiredToProceed: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getMoreDetailsRequiredToProceed function');
        if (!jQuery.isUndefined(this._data.moreDetails)) {
          return this._data.moreDetails;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getMoreDetailsRequiredToProceed function',
          exception);
      }
    },

    setMoreDetailsRequiredToProceed: function(bool) {

      try {
        this.$logInfo('ModuleCtrl::Entering setMoreDetailsRequiredToProceed function');
        this._data.moreDetails = bool;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in setMoreDetailsRequiredToProceed function',
          exception);
      }
    },

    getCountryCallingCodes: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCountryCallingCodes function');
        if (!jQuery.isUndefined(this._data.countryCallingCodes)) {
          return this._data.countryCallingCodes;
        } else if (!jQuery.isUndefined(JSONData.countryCallingCodes)) {
          return JSONData.countryCallingCodes;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCountryCallingCodes function',
          exception);
      }
    },

    checkFlightStatus: function(res, errors) {
      try {
        this.$logInfo('ModuleCtrl::Entering checkFlightStatus function');
        if (errors.length == 0) {
          if (res.data.model.CPRIdentification.customerLevel[0].productLevelBean) {
            var productLevelView = res.data.model.CPRIdentification.customerLevel[0].productLevelBean;
          }
          var primeFlightIndex = 0;
          var flag = true;
          for (var j = 0, len = productLevelView.length;
            (j < len) && (flag); j++) {
            if ((productLevelView[j].flightEligible == false) && (productLevelView[j].prime)) {
              return false;
            }
            if ((productLevelView[j].flightEligible == true) && (productLevelView[j].prime)) {
              flag = false;
            }

          }
        }
        return true;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in checkFlightStatus function',
          exception);
      }
    },

    checkSegmentEnabled: function(product) {
      this.$logInfo('ModuleCtrl::Entering checkSegmentEnabled function');
      if (product.flightEligible == false) {
        return false;
      }
      return true;
    },

    getModuleData: function() {

      if (this.data == null) {
        // init
        this.__initData();
      }
      return this.data;
    },

    /**
     * navigate from one template to other
     * @param args aria parameters
     * @param layout page id
     */
    navigate: function(args, layout) {
      if (this._data.isAcceptanceConfirmation && layout == "merci-checkin-MAcceptanceOverview_A") {
        application.navigate({
          pageId: 'merci-checkin-MCheckinIndex_A'
        });
      } else {
    	application.navigate({
          pageId: layout
        });
      }
    },

    dangerousGoods_load: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering dangerousGoods_load function');
        var dummyInput = "";
        this.submitJsonRequest("DangerousGoods", dummyInput, {
          scope: this,
          fn: this.__dangerousGoodsCallback
        });
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in dangerousGoods_load function',
          exception);
      }
    },

    __dangerousGoodsCallback: function(res, dummyInput) {
      this.$logInfo('ModuleCtrl::Entering __dangerousGoodsCallback function')
      try {
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          if (dataId == "MCheckinIndex_A" || dataId == "MCheckinIndex") //In case of a session timeout
          {
            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MCheckinIndex_A");
          } else {

            var json = this.getModuleData();
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);
            this.appCtrl.load(nextPage);
          }
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in __dangerousGoodsCallback function',
          exception);
      }
    },
    setHeaderInfo: function(title, bannerHtml, homePageURL, showButton) {
        this.__header.title = title;
        this.__header.bannerHtml = bannerHtml;
        this.__header.showButton = showButton;
        this.__header.homePageURL = homePageURL;

        // page title
        if (title != null) {
          document.title = 'MeRCI - ' + title;
        }

        /*In Case of app where as it is native banner inorder to diff between KF and guest login hardcoding some parameters*/
        if (this._data.embeded) {
          if (this._data.URLFromBaseJson.search(/&FF_LOGGEDIN=true/ig) != -1) {
            this.__header.bannerHtml = "AppKFLogin";
          } else {
            this.__header.bannerHtml = "";
          }

        }

        // set header data
		if (jsonResponse.data == null) {
			jsonResponse.data = {};
		}
		jsonResponse.data.header = this.__header;

		// refresh header template
        if (jsonResponse.pageHeader != null) {
          jsonResponse.pageHeader.$refresh();
        }
      },

    /**
     * Converts a site parameter string value into a boolean
     */
    booleanValue: function(value) {
      var b = false;
      if (value && typeof value === 'string') {
        var lvalue = value.toLowerCase();
        if (lvalue === 'true' || lvalue === 'yes' || lvalue === 'y') {
          b = true;
        }
      } else if (value && !this.isEmptyObject(value)) {
        b = true;
      }
      return b;
    },
    getUrlVars: function(val) {
      var vars = [],
        hash, temp;
      var hashes = val.slice(val.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        if (hash[1]) {
          temp = hash[1].split('#');
          vars[hash[0]] = temp[0];
        }
      }

      var myUrl = val;
      var myURLParams = vars;

      if (!this.cprInputSQ) {
        this.cprInputSQ = {};
      }

      if (myUrl.indexOf("REC_LOC") != -1) {
        this.cprInputSQ.rLoc = myURLParams["REC_LOC"]
      }
      if (myUrl.indexOf("LAST_NAME") != -1) {
        this.cprInputSQ.lastName = myURLParams["LAST_NAME"]
      }
      if (myUrl.indexOf("FF_NUM") != -1) {
        this.cprInputSQ.ffNbr = myURLParams["FF_NUM"]
      }
      if (myUrl.indexOf("CARRIER") != -1) {
        this.cprInputSQ.carrier = myURLParams["CARRIER"]
      }
      if (myUrl.indexOf("SITE") != -1) {
        this.cprInputSQ.SITE = myURLParams["SITE"]
      }
      if (myUrl.indexOf("LANGUAGE") != -1) {
        this.cprInputSQ.LANGUAGE = myURLParams["LANGUAGE"]
      }

      return this.cprInputSQ;
    },
    findNotRetrievedLastNameList: function(cpr) {
      this.$logInfo('ModuleCtrl::Entering isPaxInfEligible function');
      var notRetrievedList = [];
      for (var i = 0; i < cpr.customerLevel.length; i++) {
        if (!cpr.customerLevel[i].custRetrieved) {
          if (notRetrievedList.indexOf(cpr.customerLevel[i].customerDetailsSurname) == -1) {
            notRetrievedList.push(cpr.customerLevel[i].customerDetailsSurname);
          }
        }
      }
      return notRetrievedList;
    },
    findUSAinselectedcprForAPISinRegPage: function() {
      var spax = this.getSelectedPax();
      var cpr = this.getCPR();
      for (var i = 0; i < spax.length; i++) {
        if (cpr.customerLevel[0].productLevelBean[spax[i].product].operatingFlightDetailsOffPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || cpr.customerLevel[0].productLevelBean[spax[i].product].operatingFlightDetailsOffPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1 || cpr.customerLevel[0].productLevelBean[spax[i].product].operatingFlightDetailsBoardPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || cpr.customerLevel[0].productLevelBean[spax[i].product].operatingFlightDetailsBoardPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1) {
          this._data.isApisEligible = true;
        }


      }
    },
    getEmailList: function() {
      var paxDetails = this._data.passengerDetails;
      var emailList = [];
      if (paxDetails != null) {
        for (i = 0; i < paxDetails.length; i++) {
          if (paxDetails[i].email != "")
            emailList.push(paxDetails[i].email);
        }
      }
      return emailList;
    },
    /* Function is used to find out infant customer index from parent index */

    getInfantIndex: function(productIndex, infantPrimeId) {
      var cpr = this.getCPR();
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
    setFooterInfo: function() {
      // if data default available
      if (jsonResponse != null && jsonResponse.data != null) {
        this.response = jsonResponse.data.footerJSON;
        return this.response;
      }
    },
    /*
     * if u send cust index if it is infant it return corresponding cust index or in u send cust index and there in infant to it it will return infant index.
     * */
    getInfantOrPaxIndex: function(index){
      var cpr=this.getCPR();
      var DID=[];
      var JID=[];
      if(cpr.customerLevel[index].customerDetailsType == "IN")
      {
    	  /*Getting infant DID*/
    	  for(var i in cpr.customerLevel[index].productLevelBean)
    	  {
    		  for(var j in cpr.customerLevel[index].productLevelBean[i].productIdentifiersBean)
    		  {
    			  if(cpr.customerLevel[index].productLevelBean[i].productIdentifiersBean[j].referenceQualifier == "DID")
    			  {
    				  DID.push(cpr.customerLevel[index].productLevelBean[i].productIdentifiersBean[j].primeId);
    			  }

    		  }
    	  }

    	  /*Find cust ID*/
    	  for(var i in cpr.customerLevel)
    	  {
    		  if(cpr.customerLevel[i].customerDetailsType != "IN" && i != index)
    		  {
    			  for(var j in cpr.customerLevel[i].productLevelBean)
        		  {
    				  for(var k in cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean)
    				  {
    					  if(cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean[k].referenceQualifier == "JID" && DID.indexOf(cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean[k].primeId) != -1)
    					  {
    						  return i;
    					  }
    				  }
        		  }
    		  }
    	  }
      }else
      {

	    for(var j in cpr.customerLevel[index].productLevelBean)
		  {
			  for(var k in cpr.customerLevel[index].productLevelBean[j].productIdentifiersBean)
			  {
				  if(cpr.customerLevel[index].productLevelBean[j].productIdentifiersBean[k].referenceQualifier == "JID")
				  {
					  JID.push(cpr.customerLevel[index].productLevelBean[j].productIdentifiersBean[k].primeId);
				  }
			  }
		  }

	    /*
	     * if infant is there find infant ID
	     * */
	    if(JID.length > 0)
	    {
	    	for(var i in cpr.customerLevel)
	    	  {
	    		  if(cpr.customerLevel[i].customerDetailsType == "IN")
	    		  {
	    			  for(var j in cpr.customerLevel[i].productLevelBean)
	        		  {
	    				  for(var k in cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean)
	    				  {
	    					  if(cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean[k].referenceQualifier == "DID" && JID.indexOf(cpr.customerLevel[i].productLevelBean[j].productIdentifiersBean[k].primeId) != -1)
	    					  {
	    						  return i;
	    					  }
	    				  }
	        		  }
	    		  }
	    	  }
	    }
      }

      return "-1";

    },
    /*
     * forming age, nationality here
     * */
    findMissingDetailsForGTM : function(continer)
    {
    	this.$logInfo('ModuleCtrl::Entering findMissingDetailsForGTM function')
        try {
	    	var editCPR = this.getEditCPR();
	        var cpr = this.getCPR();

	        for(var i in continer)
	    	{
	    		this.getReqDetailsFrmBean(i,editCPR,false,continer);

	    		/*
	    		 * for CPR
	    		 * */
	    		this.getReqDetailsFrmBean(i,cpr,true,continer);

	    		/*calculate Age, Dep Days*/
	    		if(!jQuery.isUndefined(continer[i].DOBBean))
	    		{
	    			continer[i].age=this.getDaysAndYearFromCurrentDate({"month":continer[i].DOBBean.month,"year":continer[i].DOBBean.year,
	    				"day":continer[i].DOBBean.day},continer[i].DOBBean).split("-")[1];
	    		}else
	    		{
	    			continer[i].age="";
	    		}

	    		if(!jQuery.isUndefined(continer[i].depTimeBean))
	    		{
	    			var temp=this.getDaysAndYearFromCurrentDate({"month":continer[i].depTimeBean.month,"year":continer[i].depTimeBean.year,
	    				"day":continer[i].depTimeBean.day},continer[i].depTimeBean);
	    			continer[i].daysPriorToDep=temp.split("-")[0];
	    			continer[i].timePriorToDep=temp.split("-")[2];
	    		}else
	    		{
	    			continer[i].daysPriorToDep="";
	    			continer[i].timePriorToDep="";
	    		}

	    	}
        } catch (exception) {
            this.$logError(
              'ModuleCtrl::An error occured in findMissingDetailsForGTM function',
              exception);
          }
    },
    /*
     * flag - true, cpr bean
     * */
    getReqDetailsFrmBean : function(prdID,editCPR,flag,continer)
    {
    	this.$logInfo('ModuleCtrl::Entering getReqDetailsFrmBean function')
        try {
	    	if(editCPR != null)
			{
				for(var j in editCPR.customerLevel)
				{
					var customer=editCPR.customerLevel[j];
					for(var k in customer.productLevelBean)
					{
						var prod=customer.productLevelBean[k];

						/*prod id*/
						var prodID="";
						for(var p=0;p<prod.productIdentifiersBean.length;p++)
						{
							if(prod.productIdentifiersBean[p].referenceQualifier.search(/DID/gi) != -1)
							{
								prodID=prod.productIdentifiersBean[p].primeId;
							}
						}

						if(prdID == prodID)
						{
							continer[prdID].firstNameGenderTypeDetils=customer.otherPaxDetailsBean;
							continer[prdID].customerDetailsType=customer.customerDetailsType;
							continer[prdID].uniqueCustomerIdBean=customer.uniqueCustomerIdBean;
							continer[prdID].recordLocatorBean=customer.recordLocatorBean;
							continer[prdID].lastName=customer.customerDetailsSurname
							continer[prdID].DOBBean=customer.dateOfBirthBean != null && customer.dateOfBirthBean.json != null?customer.dateOfBirthBean:continer[prdID].DOBBean;

							/*nationality*/
							continer[prdID].nationality=prod.nationalityBean != null?prod.nationalityBean[0].nationalityNationalityCode:continer[prdID].nationality;
							if(continer[prdID].nationality == "" && prod.regulatoryDocumentDetailsBean && prod.regulatoryDocumentDetailsBean[0].documentIssuingCountries)
							{
								continer[prdID].nationality = prod.regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code;
							}

							/*
							 * CPR
							 * */
							if(flag)
							{

								/*
								 * Cabin Class
								 * */
								continer[prdID].bookingClassDesc=prod.bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0];

								/*
								 * Dep date
								 * */
								outerLoop: for(var g=0;g<prod.legLevelBean.length;g++)
								{
									if(prod.legLevelBean[g].legRoutingOrigin == prod.operatingFlightDetailsBoardPoint)
									{
										var flag=0;
										for(var legTime in prod.legLevelBean[g].legTimeBean)
								          {
								        	  if(prod.legLevelBean[g].legTimeBean[legTime].businessSemantic == "STD")
								        	  {
								        		  continer[prdID].depTimeBean=prod.legLevelBean[g].legTimeBean[legTime];
								        		  flag++;
								        	  }
								        	  if(prod.legLevelBean[g].legTimeBean[legTime].businessSemantic == "STA")
								        	  {
								        		  continer[prdID].arrTimeBean=prod.legLevelBean[g].legTimeBean[legTime];
								        		  flag++;
								        	  }
								        	  if(flag == 2)
								        	  {
								        		  break outerLoop;
								        	  }
								          }
									}


								}

							}

						}



					}
				}
			}
        } catch (exception) {
            this.$logError(
              'ModuleCtrl::An error occured in getReqDetailsFrmBean function',
              exception);
          }
    },
    /*
     * Return days - years - hours
     * */
    getDaysAndYearFromCurrentDate:function(args,wholeBean)
    {
    	this.$logInfo('ModuleCtrl::Entering getDaysAndYearFromCurrentDate function')
        try {
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

	        var dCurr = new Date();
	        var dSel = eval(wholeBean.json);
	    	var years = 0;
			//if (args.year < dCurr.getFullYear()) {
		        if (args.month - 1 <= dCurr.getMonth()) {
		          if (args.month - 1 == dCurr.getMonth()) {
		            if (args.day <= dCurr.getDate()) {
		              years = dCurr.getFullYear() - args.year;
		            } else {
		              years = dCurr.getFullYear() - args.year - 1;
		            }
		          } else {
		            years = dCurr.getFullYear() - args.year;
		          }
		        } else {
		          years = dCurr.getFullYear() - args.year - 1;
		        }
		      //}
		      var days = (dCurr.getTime() - dSel.getTime()) / (1000 * 3600 * 24);
		      var hours=Math.floor((dCurr.getTime() - dSel.getTime()) / 1000 / 60 / 60);
		      return Math.abs(Math.round(days))+"-"+Math.abs(Math.round(years))+"-"+Math.abs(Math.round(hours));
        } catch (exception) {
            this.$logError(
              'ModuleCtrl::An error occured in getDaysAndYearFromCurrentDate function',
              exception);
          }
    },
    /*
     * flag 'c' cancel checkin
     * */
    forFormingGTMsqData : function(continer,selecteCpr,flag){

    	this.$logInfo('ModuleCtrl::Entering forFormingGTMsqData function')
        try {
        	if(flag != undefined && flag.search(/C/gi) != -1)
			{
        		var sqData={nationality:"",Days:"",seatPreSelected:"",age:"",gender:"",cabin:"",flightSegment:"",flightNumber:""};
			}else
			{
				var sqData={nationality:"",timePriorToDeparture:"",seatPreSelected:"",age:"",gender:"",cabin:"",flightSegment:"",flightNumber:""};
			}

			var cprVals = this.getCPR();

			for(var itemProd=0;itemProd<selecteCpr.length;itemProd++)
			{
				for(var itemCus=0;itemCus<selecteCpr[itemProd].customer.length;itemCus++)
				{
					/*prod id*/
					var prodID="";
					var prod=cprVals.customerLevel[selecteCpr[itemProd].customer[itemCus]].productLevelBean[selecteCpr[itemProd].product];
					for(var p=0;p<prod.productIdentifiersBean.length;p++)
					{
						if(prod.productIdentifiersBean[p].referenceQualifier.search(/DID/gi) != -1)
						{
							prodID=prod.productIdentifiersBean[p].primeId;
						}
					}

					if(continer[prodID] != undefined)
					{
						/*Nationality - nationality
						 * */
						sqData.nationality+=continer[prodID].nationality+"|";

						/*
						 * seat Pre Selected - seatPreSelected
						 * */
						if(continer[prodID].customerDetailsType != undefined && continer[prodID].customerDetailsType != "IN")
						{
							if(continer[prodID].seat != undefined && continer[prodID].seat != "")
							{
									sqData.seatPreSelected+="Y|";
							}else
							{
								sqData.seatPreSelected+="N|";
							}
						}

						if(itemProd == 0)
						{
							/*
							 * age -  age
							 * */
							sqData.age+=continer[prodID].age+"|";

							/*
							 * gender - gender
							 * */
                             var genderDetail = '';
                             if(continer[prodID].gender == "M"){
                                genderDetail = "Male"
                             }else{
                                genderDetail = "Female"
                             }

							sqData.gender+=genderDetail+"|";
						}

						/*
						 * For only prod related things
						 * */
						if(itemCus == 0)
						{
							/*
							 * cabin calss - cabinClass
							 * */
							 if(continer[prodID].bookingClassDesc!=undefined)
							{
								sqData.cabin+=continer[prodID].bookingClassDesc+"|";
							}	
							/*
							 * flightNumber - flightNumber
							 * */
                            if(continer[prodID].flightCarrier!=undefined && continer[prodID].flightNum!=undefined){
							 sqData.flightNumber +=  continer[prodID].flightCarrier+continer[prodID].flightNum+"|";
						}
							/*
							 * flightSegment - flightSegment
							 * */
							sqData.flightSegment+=continer[prodID].boardPoint+"-"+continer[prodID].offPoint+"|";

							/*
							 * time prior to departure - timePriorToDeparture
							 * */
							if(flag != undefined && flag.search(/C/gi) != -1)
							{
								sqData.Days+=continer[prodID].daysPriorToDep+"|";
							}else
							{
								sqData.timePriorToDeparture+=continer[prodID].timePriorToDep+"|";
							}

						}

					}

				}
			}
			sqData.flightSegment=sqData.flightSegment.substr(0,sqData.flightSegment.length-1);
			sqData.cabin=sqData.cabin.substr(0,sqData.cabin.length-1);
			sqData.flightNumber=sqData.flightNumber.substr(0,sqData.flightNumber.length-1);
			sqData.gender=sqData.gender.substr(0,sqData.gender.length-1);
			sqData.age=sqData.age.substr(0,sqData.age.length-1);
			if(!jQuery.isUndefined(sqData.timePriorToDeparture))
			{
				sqData.timePriorToDeparture=sqData.timePriorToDeparture.substr(0,sqData.timePriorToDeparture.length-1);
			}
			if(!jQuery.isUndefined(sqData.Days))
			{
				sqData.Days=sqData.Days.substr(0,sqData.Days.length-1);
			}
			sqData.nationality=sqData.nationality.substr(0,sqData.nationality.length-1);
			sqData.seatPreSelected=sqData.seatPreSelected.substr(0,sqData.seatPreSelected.length-1);

			/*
			 *TCI check - thruCheckIn
			 * */
			sqData.thruCheckIn=cprVals.customerLevel[0].roundTrip ? 'Y':'N';

			/*
			 * kfTier - kfTier
			 * */
			sqData.kfTier="NA";
			if (!jQuery.isUndefined(this._data.bannerInfo)) {
				var strText=this._data.bannerInfo.bannerHTMLData.split("<p>");
				sqData.kfTier = strText[strText.indexOf(this._data.bannerInfo.ffNumber+"</p> ")+1].substr(0,strText[strText.indexOf(this._data.bannerInfo.ffNumber+"</p> ")+1].search("</p>"));
			}

			if(flag != undefined && flag.search(/C/gi) != -1)
			{
				/*
				 * event - event
				 * */
				sqData.event="Check-in Cancellation";

				return sqData;
			}else
			{
				/*
				 * event - event
				 * */
				sqData.event="Check-in Confirmation";

				return sqData;
			}

        } catch (exception) {
            this.$logError(
              'ModuleCtrl::An error occured in forFormingGTMsqData function',
              exception);
          }

    },
    iScrollImpl : function(iScrollBaseid,currentPageReference,baseOl,li,callback){
    	this.$logInfo('ModuleCtrl::Entering iScrollImpl function');
    	try{

      	var sizeOfPax = jQuery('#'+baseOl+">li").length;
      	  var scrollerWidth = 100 * sizeOfPax;
      	var liWidth = jQuery("#"+iScrollBaseid).width()-3;
          document.getElementById(baseOl).style.width = scrollerWidth.toString() + "%";
      	  for (var pax=0;pax<sizeOfPax;pax++) {
      		jQuery("#"+iScrollBaseid+" ol>li").eq(pax).css("width",(100/sizeOfPax) + "%");
      	  }
          var myscroll = new iScroll(iScrollBaseid, {
    		snap: true,
    		hScrollbar: false,
    		vScrollbar: false,
    		vScroll: false,
    		checkDOMChanges: true,
    		momentum: false,
    		onScrollEnd: function() {

    			/*For adjusting li positions
    			if(this.currPageX != 0)
    			{
    			 //document.getElementById(li + this.currPageX).style.marginLeft="-"+(this.currPageX*2)+"px";
    				//jQuery("#paxscroller ol>li").eq(this.currPageX).css("margin-left",("-"+(this.currPageX*0.7)+"px"));
    				var tVal=8*this.currPageX;
    				if(jQuery("#"+baseOl).length > 0)
    				{
    					jQuery("#"+baseOl).css({
                            transform: 'translate('+(parseInt(jQuery("#"+baseOl).css("transform").split(",")[4].trim())-tVal)+'px, 0px) scale(1) translateZ(0px)'
                        });
    				}

    			}*/

    			callback.call(currentPageReference,this.currPageX+1,sizeOfPax);
    			//jQuery("body").css("overflow-y", "");
    		}
    	   });

          /*****For remove curosal pax div margin and pax********/
          if (sizeOfPax == 1) {
            jQuery('#leftArrow').remove();
            jQuery('#rightArrow').remove();
            jQuery('#'+baseOl+">li").addClass("carrousalSingalePax");
          }

          return myscroll;
      }catch (exception) {
          this.$logError(
                  'ModuleCtrl::An error occured in iScrollImpl function',
                  exception);
              }


    	/*var sizeOfPax = jQuery('#'+baseOl).find("li").length;
    	var scrollerWidth = 100 * sizeOfPax;
    	document.getElementById(iScrollBaseid).style.width = scrollerWidth.toString() + "%";

    	var liWidth=100/sizeOfPax;
    	for (var pax=0;pax<sizeOfPax;pax++) {
    		document.getElementById(li + pax).style.width = liWidth.toString() + "%";
    	}

        var myscroll = new iScroll(iScrollBaseid, {
  		snap: 'li',
  		hScrollbar: false,
  		vScrollbar: false,
  		vScroll: false,
  		checkDOMChanges: true,
  		momentum: false,
  		snapSpacing: 0,
  		onScrollEnd: function() {
  			callback.call(currentPageReference,this.currPageX+1,sizeOfPax);
  			jQuery("body").css("overflow-y", "");
  		}
  	   });

        /*****For remove curosal pax div margin and pax****
        if (sizeOfPax == 1) {
          jQuery('#leftArrow').remove();
          jQuery('#rightArrow').remove();
        }

        return myscroll;*/

    },
    arr_Dep_Date_TakingFrm_STDandSTA: function(cust,prod){
    	var temp={};

    	outerLoop:for(var g=0;g<prod.legLevelBean.length;g++)
		{
			if(prod.legLevelBean[g].legRoutingOrigin == prod.operatingFlightDetailsBoardPoint)
			{
				var flag=0;
				for(var legTime in prod.legLevelBean[g].legTimeBean)
		          {
		        	  if(prod.legLevelBean[g].legTimeBean[legTime].businessSemantic == "STD")
		        	  {
		        		  temp.depTimeBean=prod.legLevelBean[g].legTimeBean[legTime];
		        		  flag++;
		        	  }
		        	  if(prod.legLevelBean[g].legTimeBean[legTime].businessSemantic == "STA")
					  {
		        		  temp.arrTimeBean=prod.legLevelBean[g].legTimeBean[legTime];
		        		  flag++;
		        	  }
		        	  if(flag == 2)
					  {
		        		  break outerLoop;
		        	  }

				  }
			 }


    	 }

		var dateStr=eval(temp.depTimeBean.json).toString().split(" ");
		temp.depDateInGMTDate=dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[4]+" GMT "+dateStr[3];
		dateStr=eval(temp.arrTimeBean.json).toString().split(" ");
		temp.arrDateInGMTDate=dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[4]+" GMT "+dateStr[3];

		return temp;

    }
  }
});