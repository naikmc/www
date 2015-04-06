/**
 * Cmtng module controller
 */
Aria.classDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.controller.CheckinModuleCtrl',
  $extends: 'modules.view.merci.common.controller.MerciCtrl',
  $implements: ["modules.view.merci.segments.servicing.subModules.checkin.ssci.controller.ICheckinModuleCtrl"],
  $dependencies: [
    'aria.core.environment.Environment',
    'aria.utils.HashManager',
    'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.AppCtrl',
    'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.ReConstructCPR',
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

    $publicInterfaceName: "modules.view.merci.segments.servicing.subModules.checkin.ssci.controller.ICheckinModuleCtrl",

    // -------------------------------------- Initialization methods --------------------------
    init: function(args, initReadyCb) {
      try {
        var devMode = aria.core.environment.Environment.isDevMode();
        if (devMode) {
          aria.core.Log.setLoggingLevel("modules.view.merci.segments.servicing.subModules.checkin.ssci.*", aria.core.Log.LEVEL_INFO);
        }
        this.$logInfo('ModuleCtrl::Entering init function');

        this.appCtrl = new modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.AppCtrl(this._data.devMode);
        this.ReConstructCPR = new modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.ReConstructCPR();
        this.appCtrl.init(this);
        /*
         * For loading new UI scripts
         * */
        this.appCtrl.loadNewUIScriptFunctions();

        hideBoardinglistheaderRtarro = "";

        var urlManager = modules.view.merci.common.utils.URLManager;
        aria.utils.HashManager.addCallback({
          fn: '__onHashChange',
          scope: this
        });
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

          GADetails: {
            siteGADomain: "",
            siteGAAccount: "",
            siteGAEnable: ""
          },

          devMode: devMode,
          sessionId: null,
          refresh: true,
          language: urlManager.__getLanguageCode(),
          site: urlManager.__getSiteCode(),
          date: urlManager.getStringParam().date,
          homeUrl: null,
          operatingAirlineList: null,
          operatingAirline: null,
          frequentFlyerList : null,
          lastName: null,
          Success: null,
          isSessionExpired: false,
          selectedCPR: {
            journey: "",
            product: [],
            customer: []
          },
          cprInput : {},
          selectedCustFlightInformations : {},
          dcsSeatIATCIforProduct: {},
          IATCIinput: {},
          IATCISeatSaveFailure: false,
          selectedEditPax: null,
          passengerDetails: {},
          embeded: jsonResponse.data.framework.baseParams.join("").indexOf("&client=") == -1 ? false : true,
          pnrType: "",
          flowType: null,
          callingPage: "",
          directCalling : false,
          CPRIdentification: null,
          telephoneNumberList: null,
          regCheckCounter: 0,
          regPageLandingPaxIndex: null,
          formattedCuntryList: null,
          landingPageDetail: null,
          passBookGenerated : {},
          twoDigitThreeDigitAllCntryList: {},
          convertToTwoDigitForSendtoBackend: {},
          availableStatesUSAAutoComplete: [{
            "code": "Armed Forces Americas",
            "label": "Armed Forces Americas"
          }, {
            "code": "Armed Forces Europe",
            "label": "Armed Forces Europe"
          }, {
            "code": "Armed Forces Pacific",
            "label": "Armed Forces Pacific"
          }, {
            "code": "Alabama",
            "label": "Alabama"
          }, {
            "code": "Alaska",
            "label": "Alaska"
          }, {
            "code": "Arizona",
            "label": "Arizona"
          }, {
            "code": "Arkansas",
            "label": "Arkansas"
          }, {
            "code": "Arkansas",
            "label": "Arkansas"
          }, {
            "code": "California",
            "label": "California"
          }, {
            "code": "Colorado",
            "label": "Colorado"
          }, {
            "code": "Connecticut",
            "label": "Connecticut"
          }, {
            "code": "Delaware",
            "label": "Delaware"
          }, {
            "code": "District of Columbia",
            "label": "District of Columbia"
          }, {
            "code": "Florida",
            "label": "Florida"
          }, {
            "code": "Georgia",
            "label": "Georgia"
          }, {
            "code": "Hawaii",
            "label": "Hawaii"
          }, {
            "code": "Idaho",
            "label": "Idaho"
          }, {
            "code": "Illinois",
            "label": "Illinois"
          }, {
            "code": "Indiana",
            "label": "Indiana"
          }, {
            "code": "Iowa",
            "label": "Iowa"
          }, {
            "code": "Kansas",
            "label": "Kansas"
          }, {
            "code": "Kentucky",
            "label": "Kentucky"
          }, {
            "code": "Louisiana",
            "label": "Louisiana"
          }, {
            "code": "Maine",
            "label": "Maine"
          }, {
            "code": "Maryland",
            "label": "Maryland"
          }, {
            "code": "Massachusetts",
            "label": "Massachusetts"
          }, {
            "code": "Michigan",
            "label": "Michigan"
          }, {
            "code": "Minnesota",
            "label": "Minnesota"
          }, {
            "code": "Mississippi",
            "label": "Mississippi"
          }, {
            "code": "Missouri",
            "label": "Missouri"
          }, {
            "code": "Montana",
            "label": "Montana"
          }, {
            "code": "Nebraska",
            "label": "Nebraska"
          }, {
            "code": "Nevada",
            "label": "Nevada"
          }, {
            "code": "New Hampshire",
            "label": "New Hampshire"
          }, {
            "code": "New Jersey",
            "label": "New Jersey"
          }, {
            "code": "New Mexico",
            "label": "New Mexico"
          }, {
            "code": "New York",
            "label": "New York"
          }, {
            "code": "North Carolina",
            "label": "North Carolina"
          }, {
            "code": "North Dakota",
            "label": "North Dakota"
          }, {
            "code": "Ohio",
            "label": "Ohio"
          }, {
            "code": "Oklahoma",
            "label": "Oklahoma"
          }, {
            "code": "Oregon",
            "label": "Oregon"
          }, {
            "code": "Pennsylvania",
            "label": "Pennsylvania"
          }, {
            "code": "Rhode Island",
            "label": "Rhode Island"
          }, {
            "code": "South Carolina",
            "label": "South Carolina"
          }, {
            "code": "South Dakota",
            "label": "South Dakota"
          }, {
            "code": "Tennessee",
            "label": "Tennessee"
          }, {
            "code": "Texas",
            "label": "Texas"
          }, {
            "code": "Utah",
            "label": "Utah"
          }, {
            "code": "Vermont",
            "label": "Vermont"
          }, {
            "code": "Virginia",
            "label": "Virginia"
          }, {
            "code": "Washington",
            "label": "Washington"
          }, {
            "code": "West Virginia",
            "label": "West Virginia"
          }, {
            "code": "Wisconsin",
            "label": "Wisconsin"
          }, {
            "code": "Wyoming",
            "label": "Wyoming"
          }],
          usaStatesCodeToStateNameMap: {
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
            "WYOMING": "WY",
            "AA": "ARMED FORCES AMERICAS",
            "AE": "ARMED FORCES EUROPE",
            "AP": "ARMED FORCES PACIFIC",
            "AL": "ALABAMA",
            "AK": "ALASKA",
            "AZ": "ARIZONA",
            "AR": "ARKANSAS",
            "CA": "CALIFORNIA",
            "CO": "COLORADO",
            "CT": "CONNECTICUT",
            "DE": "DELAWARE",
            "DC": "DISTRICT OF COLUMBIA",
            "FL": "FLORIDA",
            "GA": "GEORGIA",
            "HI": "HAWAII",
            "ID": "IDAHO",
            "IL": "ILLINOIS",
            "IN": "INDIANA",
            "IA": "IOWA",
            "KS": "KANSAS",
            "KY": "KENTUCKY",
            "LA": "LOUISIANA",
            "ME": "MAINE",
            "MD": "MARYLAND",
            "MA": "MASSACHUSETTS",
            "MI": "MICHIGAN",
            "MN": "MINNESOTA",
            "MS": "MISSISSIPPI",
            "MO": "MISSOURI",
            "MT": "MONTANA",
            "NE": "NEBRASKA",
            "NV": "NEVADA",
            "NH": "NEW HAMPSHIRE",
            "NJ": "NEW JERSEY",
            "NM": "NEW MEXICO",
            "NY": "NEW YORK",
            "NC": "NORTH CAROLINA",
            "ND": "NORTH DAKOTA",
            "OH": "OHIO",
            "OK": "OKLAHOMA",
            "OR": "OREGON",
            "PA": "PENNSYLVANIA",
            "RI": "RHODE ISLAND",
            "SC": "SOUTH CAROLINA",
            "SD": "SOUTH DAKOTA",
            "TN": "TENNESSEE",
            "TX": "TEXAS",
            "UT": "UTAH",
            "VT": "VERMONT",
            "VA": "VIRGINIA",
            "WA": "WASHINGTON",
            "WV": "WEST VIRGINIA",
            "WI": "WISCONSIN",
            "WY": "WYOMING"
          },
          regulatoryInPageErrors: null,
          formattedPhoneList: [],
          otherDocumentTypeList: {},
          Warnings: null,
          Errors: null,
          isSelectFlightPageError: false,
          seatMapProdIndex: null,
          uiErrors: null,
          seatMapPaxToLandOnTo: null,
          custToFlightRemovedList: {},
          inNatEditScreen: false,
          checkedInProductIDs: [],
          isLocalStorageSupported: this.isLocalStorageSupported(),
          seatMapLoadingFrom: null,
          selectedFlightforMBP: null,
          flightWiseDocs: null,
          appCheckFailed: false, //Used in ProcessAcceptance to show Error in case of AAP Failure
          isAcceptanceConfirmation: false,
          forRestrictBackClickIncludeBrowserBack: false,
          successfulFQTVDetails: [],
          siteParameters: null,
          notRetrievedLastNameList: null, //Used in CPRRetreiveMultiPax Page For Last Name Not Yet Retreived
          productIDtoShowRegDetilBaseOnProd: null,
          boardingPointDetails: [], //Get Trip Page : Source List For Boarding Cities
          validateBoardingList: {}, //Get Trip Page : Validating Boarding Cities
          mbpSpbpCallBacks: null,
          passengerDetailsFlow: null,
          pageLabels: null,
          CancelStatus: null,
          /*For holding fields to show visa, psp, oth*/
          documentFileds: {},
          regDestDetailsAutocomplete: {street:{},city:{},state:{},country:{},postal:{}},
          regHomeDetailsAutocomplete: {street:{},city:{},state:{},country:{},postal:{}},
          exitrowFlow:"",
          regulatoryAlteredSelCpr:{},
          pageErrors:null,
          selectedCPRFromTripOverview:null
        };


        var _this = this;
        $.ajax({
          url: jsonResponse.data.framework.baseParams[0] + "://" + jsonResponse.data.framework.baseParams[1],
          cache: false,
          type: "POST",
          data: 'data',
          crossDomain: "true",
          processData: false,
          async: false,
          complete: function(res, status) {
            _this._data.svTime = res.getResponseHeader('Date');
            if (_this._data.svTime == null) {
              _this._data.svTime = JSONData.svTime;
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
        this.__header = {
          "dummy": null
        };

        /**BEGIN :To Access and Initialize Variable from My Trip Page of Apps
         */
        jsonResponse.checkInModuleCtrl = this;
        if (jsonResponse.selectedCprInput != undefined) {
          this.intializingFlowVariables(jsonResponse.selectedCprInput);
        }
        /**END :To Access and Initialize Variable from My Trip Page of Apps
         */
        /**BEGIN :To Know whether directLanding has taken place then Call Storing Local Trips Function from Data Ready of Landing Pages
         */
        if(jsonResponse.homePageId != "merci-checkin-MSSCICheckinIndex_A"){
        	this._data.directCalling = true;
        	this.intializingFlowVariables();
        }
        /**END :To Know whether directLanding has taken place then Call Storing Local Trips Function from Data Ready of Landing Pages
         */
        /**
         * BEGIN : Code For Adding Boarding Points List to the Auto Complete Code
         * */
        this.ConstructBoardingPointDetails();
        /**
         * END : Code For Adding Boarding Points List to the Auto Complete Code
         * */

        this.$callback(initReadyCb);
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in init function',
          exception);
      }
    },

    ConstructBoardingPointDetails: function() {
      /**
       * BEGIN : Code For Adding Boarding Points List to the Auto Complete Code
       * */
      if (null != jsonResponse.data.checkIn && null != jsonResponse.data.checkIn.MSSCICheckinIndex_A && null != jsonResponse.data.checkIn.MSSCICheckinIndex_A.airportList != null) {
        var listItem = jsonResponse.data.checkIn.MSSCICheckinIndex_A.airportList;
        for (var i = 0; i < listItem.length; i++) {
          var json = {
            label: listItem[i][1],
            code: listItem[i][0]
          };
          this._data.boardingPointDetails.push(json);
          this._data.validateBoardingList[listItem[i][0]] = listItem[i][0];
          this._data.validateBoardingList[listItem[i][1]] = listItem[i][0];

        }
      }

      /**
       * END : Code For Adding Boarding Points List to the Auto Complete Code
       * */
    },


    __initData: function() {
      // if data default available
      if (jsonResponse != null && jsonResponse.data != null && jsonResponse.data.checkIn != null) {

        this.data = jsonResponse.data;
      }

      // setting default
      this.__header = {
        "dummy": null
      };
    },

    ReConstructOriginalCPR: function(data) {
      return this.ReConstructCPR.modifiedResponse(data);
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
        this.$logError('ModuleCtrl::An error occured in getLayout function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getLastLayout function', exception);
      }
    },

    getGADetails: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getGADetails function');
        return this._data.GADetails;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getGADetails function', exception);
      }
    },

    setGADetails: function(parameters) {
      try {
        this.$logInfo('ModuleCtrl::Entering setGADetails function');
        this._data.GADetails.siteGADomain = parameters.SITE_G_ANALYTICS_DOMAIN;
        this._data.GADetails.siteGAAccount = parameters.SITE_G_ANALYTICS_ACCOUNT;
        this._data.GADetails.siteGAEnable = parameters.SITE_ENABLE_G_ANALYTICS;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setGADetails function', exception);
      }
    },
    /*
     * flag == undefined sent svtime as it is
     * date - - send js date object
     * format -- send in specific format dd-mm-yyyy or yyyy-mm-dd
     * */
    getsvTime: function(flag) {
      try {
        this.$logInfo('ModuleCtrl::Entering getsvTime function');
        if (flag == undefined) {
          return this._data.svTime;
        } else {
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
          var svtime = this._data.svTime;
          var svtm = svtime.split(' ');
          var mnt = 0;

          for (var ii = 0; ii < month.length; ii++) {
            if (month[ii] == svtm[2]) {
              mnt = ii;
            }
          }
          var dCurr = new Date(svtm[3], mnt, svtm[1]);
          if (flag == "date") {
            return dCurr;
          } else {
            mnt++;
            mnt = mnt < 10 ? "0" + mnt : mnt;
            if (flag == "yyyy-mm-dd") {
              return svtm[3] + "-" + mnt + "-" + svtm[1];
            }
            if (flag == "dd-mm-yyyy") {
              return svtm[1] + "-" + mnt + "-" + svtm[3];
            }

          }

        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getsvTime function', exception);
      }
    },

    isLocalStorageSupported: function() {
      var testKey = 'test',
        storage = window.localStorage;
      try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
      } catch (error) {
        return false;
      }
    },

    loadHome: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadHome function');
        // we will call the load function to load the page
        this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in loadHome function', exception);
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
        this.$logError('ModuleCtrl::An error occured in setIsSessionExpired function', exception);
      }
    },

    getIsSessionExpired: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsSessionExpired function');
        return this._data.isSessionExpired;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getIsSessionExpired function', exception);
      }
    },

    setOperatingAirlinesList: function(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines) {
      try {
        this.$logInfo('ModuleCtrl::Entering setOperatingAirlinesList function');
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
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setOperatingAirlinesList function', exception);
      }
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
        this.$logError('ModuleCtrl::An error occured in getOperatingAirlinesList function', exception);
      }
    },

    setLastName: function(name) {
      try {
        this.$logInfo('ModuleCtrl::Entering setLastName function');
        this._data.lastName = name;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setLastName function', exception);
      }
    },

    getLastName: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getLastName function');
        return this._data.lastName;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getLastName function', exception);
      }
    },

    /*
     * setTelephoneNumberList -- from global list
     * */
    setTelephoneNumberList: function(countryCallingCodes) {
      try {
        this.$logInfo('ModuleCtrl::Entering setTelephoneNumberList function');
        var callingCntryObj = {};
        this._data.formattedPhoneList=[];
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
          this._data.formattedPhoneList.push({
            code: valueObj.callingCode,
            label: countryCallingCodes[i][1] + "(+" + valueObj.callingCode + ")"
          });
        }
        this._data.telephoneNumberList = callingCntryObj;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setTelephoneNumberList function', exception);
      }
    },

    getTelephoneNumberList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getTelephoneNumberList function');
        return this._data.telephoneNumberList;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getTelephoneNumberList function', exception);
      }
    },

    /*Begin Get Passenger ID and Flight ID(Seperated with ~)Based on the product Id in a given Journey*/
    findPaxFlightIdFrmProductId: function(journey, productId) {
      try {
        this.$logInfo('ModuleCtrl::Entering findPaxFlightIdFrmProductId function');
        var returnValue = "";
        for (var eligibilityIndex in journey.eligibility) {
          var eligibility = journey.eligibility[eligibilityIndex];
          if (eligibility.referenceIDProductProductID == productId) {
            returnValue = eligibility.referenceIDProductPassengerID + "~" + eligibility.referenceIDProductFlightID;
            return returnValue;
          }
        }
        /*every pax must contine prod id, so if list comes empty upto here it is infant, for infant prod id
         * not there in Eligibilities so taking from associatedProducts*/
        if (!jQuery.isUndefined(journey.service)) {
          for (var serviceIndex in journey.service) {
            var service = journey.service[serviceIndex];
            if (service.referenceIDProductProductID == productId) {
              returnValue = service.referenceIDProductPassengerID + "~" + service.referenceIDProductFlightID;
              return returnValue;
            }
          }
        }

        return returnValue;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findPaxFlightIdFrmProductId function', exception);
      }
    },
    /*End Get Passenger ID and Flight ID Based on the product Id in a given Journey*/

    /*Get product id based on pax id , flight id from eligibility of particular joureny*/
    findProductidFrmflightid: function(journey, paxId, flightId) {
      this.$logInfo('ModuleCtrl::Entering findProductidFrmflightid function');
      try {
        this.$logInfo('ModuleCtrl::Entering findProductID function');

        if (journey.eligibility[paxId + flightId + "A"] && journey.eligibility[paxId + flightId + "A"].referenceIDProductProductID) {
          return journey.eligibility[paxId + flightId + "A"].referenceIDProductProductID;
        }

        /*every pax must contain prod id, so if list comes empty upto here it is infant, for infant prod id
         * not there in service so taking from associatedProducts*/
        if (!jQuery.isUndefined(journey.service)) {
          if (journey.service[paxId + flightId + "INFT"] && journey.service[paxId + flightId + "INFT"].referenceIDProductProductID) {
            return journey.service[paxId + flightId + "INFT"].referenceIDProductProductID;
          }
        }
        /*End*/

        return "";
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findProductID function', exception);
      }
    },


    /*Get product id based on pax id , flight List from eligibility of particular joureny*/
    findProductidFrmflightList: function(journey, paxId, flightList) {
      this.$logInfo('ModuleCtrl::Entering findProductidFrmflightList function');
      try {
        this.$logInfo('ModuleCtrl::Entering findProductID function');

        var list = "";
        for (var flist in flightList) {
          var flightId = flightList[flist];
          if (journey.eligibility[paxId + flightId + "A"] && journey.eligibility[paxId + flightId + "A"].referenceIDProductProductID) {
            list = list + journey.eligibility[paxId + flightId + "A"].referenceIDProductProductID + ",";
          }
        }

        /*every pax must contain prod id, so if list comes empty upto here it is infant, for infant prod id
         * not there in service so taking from service*/
        if (list == "" && !jQuery.isUndefined(journey.service)) {
          for (var flist in flightList) {
            var flightId = flightList[flist];
            if (journey.service[paxId + flightId + "INFT"] && journey.service[paxId + flightId + "INFT"].referenceIDProductProductID) {
              list = list + journey.service[paxId + flightId + "INFT"].referenceIDProductProductID + ",";
            }
          }

        }
        /*End*/

        if (list.lastIndexOf(",") != -1) {
          list = list.substring(0, list.lastIndexOf(","));
        }

        return list;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findProductID function', exception);
      }
    },

    /**
     * cprRetreive
     * This method is used to retrive a cpr.
     */
    cprRetreive: function(cprInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering cprRetreive function');
        this.setLastName(cprInput.lastName);
        jQuery("#pageErrors").disposeTemplate();
        this.$logInfo('ModuleCtrl::Entering cprRetreive function');
        this.submitJsonRequest("ICPRIdentificationNew", cprInput, {
          scope: this,
          fn: this.__cprRetreiveCallback,
          args: cprInput
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in cprRetreive function', exception);
      }
    },

    /**Intializing Variables Required In the Flow From Fresh for the current PNR*/
    intializingFlowVariables: function(cprData) {
      try {
        this.$logInfo('ModuleCtrl::Entering intializingFlowVariables function');
        /* Start Code For Refreshing the Selected CPR*/
        this._data.selectedCPR.journey = "";
        this._data.selectedCPR.customer = [];
        this._data.selectedCPR.product = [];
        this._data.selectedCustFlightInformations = {};
        this._data.successfulFQTVDetails = [];
        this._data.appCheckFailed = false;
        this._data.checkedInProductIDs = []; //For Resetting List of checkedin Products Which are set in Trip Overview Page...
        this.setIsSelectFlightPageError(false);

        //IATCI
        this._data.dcsSeatIATCIforProduct = {};
        this._data.IATCIinput = {};
        this._data.IATCISeatSaveFailure = false;
        //IATCI

        /* End Of Code For Refreshing the Selected CPR*/
        if (cprData != undefined && cprData.recLoc != undefined) {
          this._data.cprInput = cprData;
          if (cprData.lastName != undefined && cprData.lastName.trim() != "") {
            this.setLastName(cprData.lastName);
          } else {
            this.setLastName("");
          }
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in intializingFlowVariables function', exception);
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
        /* Start Code For Refreshing the Selected CPR*/
        this.intializingFlowVariables();

        var errors = [];
        var json = {};
        this._data.firstTimeLoad = 0;
        var warnings = [];
        var success = [];

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {
          /*In Case of Valid Response*/

          /* getting next page id */
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);


          if (dataId == 'MSSCICheckinIndex_A') {
            /*In Case Its An Error And Its Lands on cprRetreive Page */
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                if (CPRIdentification.mciUserError.errorCode == "213001065") {
                  var errDesc = CPRIdentification.mciUserError.errorDesc;
                  var opAirline = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.parameters.SITE_SSCI_OP_AIR_LINE;
                  var modifiedErrorDesc = errDesc.replace("%[operating airline]", opAirline);
                  errors.push({
                    "localizedMessage": modifiedErrorDesc
                  });
                } else {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
                }
                /*
                 * Resetting information as in checkin new tpl we are using same bean again
                 * */
                var tempRes = {};
                tempRes.responseJSON = jsonResponse;
                if (tempRes.responseJSON.data.checkIn && tempRes.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam && tempRes.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
                  var tempCPRIdentification = tempRes.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
                  tempCPRIdentification.mciUserError = null;
                }
                /*
                 * End Resetting information as in checkin new tpl we are using same bean again
                 * */
              } else if (res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.SessionExpired == "SESSION_EXPIRED") {
                this._data.isSessionExpired = false;
                errors.push({
                  "localizedMessage": res.responseJSON.data.checkIn.MSSCICheckinIndex_A.errorStrings[3001].localizedMessage,
                  "code": res.responseJSON.data.checkIn.MSSCICheckinIndex_A.errorStrings[3001].errorid
                });
              }

              if(res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CancelStatus == "SUCCESS"){
                this._data.CancelStatus="SUCCESS";
              }

              if (errors.length > 0) {
                this.displayErrors(errors, "pageErrors", "error");
                return null;
              }

              if (this._data.callingPage != dataId) {
                this.appCtrl.load(nextPage);
              }

            }
          } else {
            /*In Case of Loading Any Page*/
            this.storeDataLocally("lstName", this.getLastName());

            if (dataId == 'MSSCITripOverview_A') {
                if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCITripOverview_A
                  && res.responseJSON.data.checkIn.MSSCITripOverview_A.requestParam
                  && res.responseJSON.data.checkIn.MSSCITripOverview_A.requestParam.CancelStatus == "SUCCESS") {
                  this._data.CancelStatus="SUCCESS";
                }
                /*
                 * For filtering pax whose regulatory details empty
                 *
                 * */
                this._data.regulatoryAlteredSelCpr.disableModifyTravlerInfo=false;
                /*
                 * End for filtering pax whose regulatory details empty
                 *
                 * */
            }

            /*Begin Storing of Trip in local Storage*/

            if (cprInput.IdentificationType != "frequentFlyerNumber") {
              var tripDetailsJSON = this.formJSONtoStoreLocally(res, dataId, cprInput);
              this.storeTripInLocalStorage(tripDetailsJSON, this.recLoc);
            }
            /*End Storing of Trip in local Storage*/

            var json = this.getModuleData();
            this._data.firstTimeLoad = 0;
            this._data.bannerInfo = res.responseJSON.data.checkIn[dataId].requestParam.ProfileBean;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
            this.setCPR(res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification);

            if (cprInput.IdentificationType == "frequentFlyerNumber") {

              var cpr = this.getCPR();

              var pnrDetails = {};

              for (var journey in cpr) {
                var pax1 = cpr[journey].paxList[0];
                var recLoc = cpr[journey].bookingInformations[pax1].recordLocator;

                for (var item in cpr[journey].flightList) {
                  var flightID = cpr[journey].flightList[item];
                  var flightDetails = {
                    "departureCityCode": cpr[journey][flightID].departureAirport.locationCode,
                    "arrivalCityCode": cpr[journey][flightID].arrivalAirport.locationCode,
                    "departureCityName": cpr[journey][flightID].departureAirport.airportLocation.cityName,
                    "arrivalCityName": cpr[journey][flightID].arrivalAirport.airportLocation.cityName,
                    "departureTime": cpr[journey].productDetailsBeans[flightID].departureTime,
                    "arrivalTime": cpr[journey].productDetailsBeans[flightID].arrivalTime
                  }

                  if (jQuery.isUndefined(pnrDetails[recLoc])) {
                    pnrDetails[recLoc] = {};
                    pnrDetails[recLoc][flightID] = flightDetails;
                    pnrDetails[recLoc].flightList = [];
                    pnrDetails[recLoc].flightList.push(flightID);

                  } else {
                    pnrDetails[recLoc][flightID] = flightDetails;
                    pnrDetails[recLoc].flightList.push(flightID);
                  }

                }

              }

              var pnrJSONtoBeStored = {};

              for (var pnr in pnrDetails) {

                var flightListtoSort = pnrDetails[pnr].flightList;

                flightListtoSort.sort(function(a, b) {
                  var dateA = new Date(pnrDetails[pnr][a].departureTime);
                  var dateB = new Date(pnrDetails[pnr][b].departureTime);
                  return dateA - dateB //sort by date ascending
                })

                pnrDetails[pnr].flightList = flightListtoSort;

                var tripDetailsJSON = this.formJSONtoStoreLocallyForFF(pnr, pnrDetails[pnr]);
                pnrJSONtoBeStored[pnr] = tripDetailsJSON;
              }

              this.storeMultipleTripsInLocalStorage(pnrJSONtoBeStored);

            }

            if (cprInput.flow == "AddPassenger") {
              this._data.selectedCPR.journey = cprInput.selectedJourneyID;
              this.raiseEvent({
                "name": "page.refresh"
              });
              if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICPRRetrieveMultiPax_A &&
                res.responseJSON.data.checkIn.MSSCICPRRetrieveMultiPax_A.requestParam &&
                res.responseJSON.data.checkIn.MSSCICPRRetrieveMultiPax_A.requestParam.AddPassengerStatus) {
                var labels = res.responseJSON.data.checkIn.MSSCICPRRetrieveMultiPax_A.labels;
                var AddPaxStatus = res.responseJSON.data.checkIn.MSSCICPRRetrieveMultiPax_A.requestParam.AddPassengerStatus;

                if (AddPaxStatus != "SUCCESS") {
                  var errors = [];
                  if (AddPaxStatus == "JOURNEY_MISMATCH") {
                    errors.push({
                      "localizedMessage": labels.addPaxErrorFlightsNotSame
                    });
                  } else if (AddPaxStatus == "FAILURE") {
                    errors.push({
                      "localizedMessage": labels.addPaxErrorNoBookingRetrieved
                    });
                  }
                  this.displayErrors(errors, "cprErrors", "error");
                }

              } else {
                /*Failure Msg*/
                var errors =[];
                errors.push({
                "localizedMessage": this.errorStrings[21400069].localizedMessage
                });
                this.displayErrors(errors, "cprErrors", "error");
              }
            }

            if (this._data.callingPage != dataId) {
              this.appCtrl.load(nextPage);
            } else {
              this.raiseEvent({
                "name": "page.refresh"
              });
            }
            this._data.callingPage = "";
          }


          // navigate to next page
          //this.moduleCtrl.navigate(null, nextPage);
          /* For regulatory should remove

          var res=this.getModuleData().checkIn.MSSCITripList_A.requestParam.CPRIdentification;
          for(var i in res)
          {
              var list="";
              for(var plist in res[i].paxList)
              {
                list=this.findProductidFrmflightList(res[i],res[i].paxList[plist]);
              }

              break;
          }
          var input={"prodID":list};
          this.submitJsonRequest("ICheckRegulatorySSCI" , input , {scope:this, fn:this.__checkRegulatoryCallback});
          return false;
          /* End */
        } else {
          /*In Case Response Comes As Failure Without Any Specified Error*/
          errors.push({
            "localizedMessage": this.errorStrings[21400069].localizedMessage,
            "code": this.errorStrings[21400069].errorid
          });
          this.displayErrors(errors, "pageErrors", "error");
          return null;
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __cprRetreiveCallback function', exception);
      }
    },



    formJSONtoStoreLocallyForFF: function(pnr, pnrDetails) {
      try {
        this.$logInfo('ModuleCtrl::Entering formJSONtoStoreLocallyForFF function');
      var segmentDetails = [];

      var BCityCode = pnrDetails[pnrDetails.flightList[0]].departureCityCode;
      var ECityCode = pnrDetails[pnrDetails.flightList[pnrDetails.flightList.length - 1]].arrivalCityCode;
      if (BCityCode == ECityCode) {
        ECityCode = pnrDetails[pnrDetails.flightList[pnrDetails.flightList.length - 2]].arrivalCityCode;
      }

      var BCityName = pnrDetails[pnrDetails.flightList[0]].departureCityName;
      var ECityName = pnrDetails[pnrDetails.flightList[pnrDetails.flightList.length - 1]].arrivalCityName;
      if (BCityName == ECityName) {
        ECityName = pnrDetails[pnrDetails.flightList[pnrDetails.flightList.length - 2]].arrivalCityName;
      }

      var cprInput = {
        "IdentificationType": "bookingNumber",
        "recLoc": pnr,
        "lastName": this.getLastName()
      }

      for (var flight in pnrDetails.flightList) {

        var flightID = pnrDetails.flightList[flight];

        segmentDetails.push({
          "departureCityCode": pnrDetails[flightID].departureCityCode,
          "arrivalCityCode": pnrDetails[flightID].arrivalCityCode,
          "depDate": pnrDetails[flightID].departureTime,
          "arrDate": pnrDetails[flightID].arrivalTime
        });

      }

      var jSondata = {
        "lastName": this.getLastName(),
        "ECityName": ECityName,
        "BCityName": BCityName,
        "pastTrip": "false",
        "ECityCode": ECityCode,
        "evoucher": false,
        "BDate": segmentDetails[0].depDate,
        "BCityCode": BCityCode,
        "recLoc": pnr,
        "segmentDetails": segmentDetails,
        "bookingInfoFlag": false,
        "cprInput": cprInput
      };

      return jSondata;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in formJSONtoStoreLocallyForFF function', exception);
      }
    },



    formJSONtoStoreLocally: function(res, dataId, cprInput) {
      try {
        this.$logInfo('ModuleCtrl::Entering formJSONtoStoreLocally function');
      var segmentDetails = [];
      var idcResponse = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification.functionalContent;
      var prodDetailBeans = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification.productDetailsBeans;

      this.recLoc = idcResponse.bookingInformations[0].recordLocator;
      var BCityCode = idcResponse.flights[0].departureAirport.locationCode;
      var ECityCode = idcResponse.flights[idcResponse.flights.length - 1].arrivalAirport.locationCode;
      if (BCityCode == ECityCode) {
        ECityCode = idcResponse.flights[idcResponse.flights.length - 2].arrivalAirport.locationCode
      }
      var BCityName = "";
      var ECityName = "";

      for (var item in idcResponse.airportLocations) {
        if (idcResponse.airportLocations[item].airportCodeID == BCityCode) {
          BCityName = idcResponse.airportLocations[item].cityName;
        }
        if (idcResponse.airportLocations[item].airportCodeID == ECityCode) {
          ECityName = idcResponse.airportLocations[item].cityName;
        }

      }

      for (var i = 0; i < idcResponse.flights.length; i++) {
        var curr_flightID = idcResponse.flights[i].ID;
        var d_date = null;
        var a_date = null;
        for (var prodBean in prodDetailBeans) {
          if (prodDetailBeans[prodBean].flightId == curr_flightID) {
            d_date = prodDetailBeans[prodBean].departureTime;
            a_date = prodDetailBeans[prodBean].arrivalTime;
            break;
          }
        }

        segmentDetails.push({
          "departureCityCode": idcResponse.flights[i].departureAirport.locationCode,
          "arrivalCityCode": idcResponse.flights[i].arrivalAirport.locationCode,
          "depDate": d_date,
          "arrDate": a_date
        });
      }

      var jSondata = {
        "lastName": this.getLastName(),
        "ECityName": ECityName,
        "BCityName": BCityName,
        "pastTrip": "false",
        "ECityCode": ECityCode,
        "evoucher": false,
        "BDate": segmentDetails[0].depDate,
        "BCityCode": BCityCode,
        "recLoc": this.recLoc,
        "segmentDetails": segmentDetails,
        "bookingInfoFlag": false,
        "cprInput": cprInput
      };

      return jSondata;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in formJSONtoStoreLocally function', exception);
      }
    },


    storeMultipleTripsInLocalStorage: function(pnrJSONtoBeStored) {
      try {
        this.$logInfo('ModuleCtrl::Entering storeMultipleTripsInLocalStorage function');
      /* var tripPageTicket = "";*/
      var tripLabels = {
        "confirmDeleteTripMsg": "Are You Sure You Want To delete this trip?",
        "tripNotHere": "Your trip is not here?",
        "yes": "Yes",
        "no": "No"
      };

      /*var tripConfig = {
        "siteGAEnableTrans": "this.config.siteGAEnableTrans",
        "siteGAErrDomain": "this.config.siteGAErrDomain",
        "siteGAEnable": "this.config.siteGAEnable",
        "siteOfficeId": "this.config.siteOfficeId",
        "siteGAErrEnabled": "this.config.siteGAErrEnabled",
        "siteGAErrAccount": "this.config.siteGAErrAccount"
      };*/

      //var jSondata = tripDetailsJSON;
		/*Begin : Removing Old Trips From the List*/
      var EnablePastDeletion = false;
		if(jsonResponse.data.framework.settings.siteDeletePastTrip != undefined){
			EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastTrip;
		}
      if(EnablePastDeletion){
		for(var pnrIndex in pnrJSONtoBeStored){
		      var pnr = pnrJSONtoBeStored[pnrIndex];
		      if(!this.utils.isEmptyObject(pnr.segmentDetails) && (pnr.segmentDetails.length > 0)
		    		  && !this.utils.isEmptyObject(pnr.segmentDetails[pnr.segmentDetails.length-1])){
		    	  var segmentDetails = pnr.segmentDetails[pnr.segmentDetails.length-1];
		    	  if(segmentDetails.arrDate != null && segmentDetails.arrDate != ""){
		    		  var currSvDate = new Date(jsonResponse.data.framework.date.date);
		    		  var tripArDate = new Date(segmentDetails.arrDate);
		    		  if((tripArDate-currSvDate) < 0){
		    			  delete pnrJSONtoBeStored[pnrIndex];
		    		  }
		    	  }
		      }
		}
      }
		/*End : Removing Old Trips From the List*/

	    if(Object.keys(pnrJSONtoBeStored).length > 0){
      var that = this;
      var keyFound = false;
      this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
        var jsonTripList = {};

        if (result && result != "") {

          if (typeof result === 'string') {
            var jsonTripList = JSON.parse(result);
          } else {
            var jsonTripList = (result);
          }

          if (!that.utils.isEmptyObject(jsonTripList)) {

            var tripListData = jsonTripList["detailArray"];

            for (var pnr in pnrJSONtoBeStored) {
              tripListData[pnr] = pnrJSONtoBeStored[pnr];
            }

            that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
            jsonResponse.ui.cntTrip = Object.keys(tripListData).length;

          } else if ((that.utils.isEmptyObject(jsonTripList)) || (jsonTripList == null)) {

            var tripListData = {};
            for (var pnr in pnrJSONtoBeStored) {
              tripListData[pnr] = pnrJSONtoBeStored[pnr];
            }
            jsonTripList["labels"] = tripLabels;
            // jsonTripList["config"] = tripConfig;
            // jsonTripList["pageTicket"] = tripPageTicket;
            jsonTripList["detailArray"] = tripListData;
            keyFound = false;

            that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
            jsonResponse.ui.cntTrip = Object.keys(tripListData).length;
          }

        } else {
          var jsonTripList = {};
          if ((that.utils.isEmptyObject(result)) || (result == null)) {
            var jsonTripList = {};
            var tripListData = {};
            for (var pnr in pnrJSONtoBeStored) {
              tripListData[pnr] = pnrJSONtoBeStored[pnr];
            }
            jsonTripList["labels"] = tripLabels;
            // jsonTripList["config"] = tripConfig;
            // jsonTripList["pageTicket"] = tripPageTicket;
            jsonTripList["detailArray"] = tripListData;

            that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
            jsonResponse.ui.cntTrip = Object.keys(tripListData).length;
          }
        };


      });
	    }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeMultipleTripsInLocalStorage function', exception);
      }

    },

    storeTripInLocalStorage: function(tripDetailsJSON, recLoc) {
      try {
        this.$logInfo('ModuleCtrl::Entering storeTripInLocalStorage function');
      /* var tripPageTicket = "";*/
      var tripLabels = {
        "confirmDeleteTripMsg": "Are You Sure You Want To delete this trip?",
        "tripNotHere": "Your trip is not here?",
        "yes": "Yes",
        "no": "No"
      };

      /*var tripConfig = {
        "siteGAEnableTrans": "this.config.siteGAEnableTrans",
        "siteGAErrDomain": "this.config.siteGAErrDomain",
        "siteGAEnable": "this.config.siteGAEnable",
        "siteOfficeId": "this.config.siteOfficeId",
        "siteGAErrEnabled": "this.config.siteGAErrEnabled",
        "siteGAErrAccount": "this.config.siteGAErrAccount"
      };*/

      var jSondata = tripDetailsJSON;

      /*Begin : Removing Old Trip From the List*/
      var EnablePastDeletion = false;
      if(jsonResponse.data.framework.settings.siteDeletePastTrip != undefined){
    	  EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastTrip;
      }
      var pastTrip = false;
      if(EnablePastDeletion){
	      if(!this.utils.isEmptyObject(jSondata.segmentDetails) && (jSondata.segmentDetails.length > 0)
	    		  && !this.utils.isEmptyObject(jSondata.segmentDetails[jSondata.segmentDetails.length-1])){
	    	  var segmentDetails = jSondata.segmentDetails[jSondata.segmentDetails.length-1];
	    	  if(segmentDetails.arrDate != null && segmentDetails.arrDate != ""){
	    		  var currSvDate = new Date(jsonResponse.data.framework.date.date);
	    		  var tripArDate = new Date(segmentDetails.arrDate);
	    		  if((tripArDate-currSvDate) < 0){
	    			  pastTrip = true;
	    		  }
	    	  }
	      }
      }
      /*End : Removing Old Trip From the List*/

      if(!pastTrip){
      var that = this;
      var keyFound = false;
      this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
        var jsonTripList = {};
        if (result && result != "") {
          if (typeof result === 'string') {
            var jsonTripList = JSON.parse(result);
          } else {
            var jsonTripList = (result);
          }

          if (!that.utils.isEmptyObject(jsonTripList)) {

            var tripListData = jsonTripList["detailArray"];
            for (var key in tripListData) {
              if (recLoc == key) {
                keyFound = true;

              }
            }
            if (keyFound == false) {
              tripListData[recLoc] = jSondata;

              that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
            }
          } else {

            if ((that.utils.isEmptyObject(jsonTripList)) || (jsonTripList == null)) {

              var tripListData = {};
              tripListData[recLoc] = jSondata;
              jsonTripList["labels"] = tripLabels;
              // jsonTripList["config"] = tripConfig;
              // jsonTripList["pageTicket"] = tripPageTicket;
              jsonTripList["detailArray"] = tripListData;
              keyFound = false;

              that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
            }
          }
        } else {
          var jsonTripList = {};
          if ((that.utils.isEmptyObject(result)) || (result == null)) {
            var jsonTripList = {};
            var tripListData = {};
            tripListData[recLoc] = jSondata;
            jsonTripList["labels"] = tripLabels;
            // jsonTripList["config"] = tripConfig;
            // jsonTripList["pageTicket"] = tripPageTicket;
            jsonTripList["detailArray"] = tripListData;

            that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, jsonTripList, "overwrite", "json");
          }
        };

        if (keyFound == false) {
          if (jsonResponse.ui.cntTrip > 0) {
            jsonResponse.ui.cntTrip = jsonResponse.ui.cntTrip + 1;
          } else {
            jsonResponse.ui.cntTrip = 1;
          }
        }

      });
      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeTripInLocalStorage function', exception);
      }

    },

    /*
     * WORKS ONLY IF LOCAL STORAGE SUPPORTED EX: LOCAL STORAGE WONT WORK IN CASE OF MOBILE BROWSER OPEN IN PRIVATE BROWSING MODE
     *
     * key, value both avilable - store
     *
     *  only key - retrieve  Note : RETURN NULL IF NOT ABLE TO RETRIEVE ANYTHING
     *
     *  remove is not undefined remove value
     * */
    storeDataLocally: function(key, value, remove) {
      try {
        this.$logInfo('ModuleCtrl::Entering storeDataLocally function');
        if (this._data.isLocalStorageSupported) {
          if (!jQuery.isUndefined(key) && !jQuery.isUndefined(value)) {
            localStorage.setItem(key, value)
            return true;
          }
          if (!jQuery.isUndefined(remove)) {
            localStorage.removeItem(key);
            return true;
          }

        }

        return localStorage.getItem(key);
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeDataLocally function', exception);
      }
    },
    copySuggestionsToRequirementDatas : function(datas){

    	 try {
    	        this.$logInfo('ModuleCtrl::Entering copySuggestionsToRequirementDatas function');
    	        if(jQuery.isUndefined(datas.choices))
    	        {
    	        	return false;
    	        }else if(jQuery.isUndefined(datas.requirementDatas))
    	        {
    	        	datas.requirementDatas=[];
    	        }
    	        for(var i=0;i<datas.choices.length;i++)
    	        {
    	        	if(jQuery.isUndefined(datas.choices[i].suggestions))
    	        	{
    	        		continue;
    	        	}
    	        	datas.requirementDatas=datas.requirementDatas.concat(datas.choices[i].suggestions);
    	        }

	      } catch (exception) {
	        this.$logError('ModuleCtrl::An error occured in copySuggestionsToRequirementDatas function', exception);
	      }
    },
    /*
     * Called from 2 places, 1) regular flow i.e from selectflight
     * 2) trip overview flow, where when click of modify traveller info button
     *
     * in 2nd flow this._data.flowType is set to "modifyCheckin"
     * */
    checkRegulatory: function() {
      this.$logInfo('ModuleCtrl::Entering checkRegulatory function');
      try {
        var selectedCPR = this.getSelectedCPR();
        var res = this.getCPR();
        this._data.regPageLandingPaxIndex = null;
        this._data.regulatoryInPageErrors = null;
        this._data.productIDtoShowRegDetilBaseOnProd = null;
        this._data.documentFileds = {};
        this._data.regDestDetailsAutocomplete= {street:{},city:{},state:{},country:{},postal:{}};
        this._data.regHomeDetailsAutocomplete= {street:{},city:{},state:{},country:{},postal:{}};
        /*For edit nationality*/
        this._data.inNatEditScreen = false;
        /*End edit nationality*/

        /*
         * For filtering pax whose regulatory details empty
         *	i.e only when call from trip overflow, in order to filter non eligible pax from checked list
         *i.e selectedCPR holds checked in list
         *from this eliminate those r invalid we use this._data.regulatoryAlteredSelCpr
         * */
        this._data.regulatoryAlteredSelCpr={};
	  	this._data.regulatoryAlteredSelCpr.journey=selectedCPR.journey;
	  	this._data.regulatoryAlteredSelCpr.product=selectedCPR.custtoflight[0]["product"];
	  	this._data.regulatoryAlteredSelCpr.customer=[];
	  	this._data.regulatoryAlteredSelCpr.flighttocust=[];
	  	this._data.regulatoryAlteredSelCpr.custtoflight=[];
	  	this._data.regulatoryAlteredSelCpr.disableModifyTravlerInfo=false;
	  	 /*
         * End for filtering pax whose regulatory details empty
         *
         * */

        var list = "";
        var suggestion_prodID="";

        /*Giving req for first time for first pax in list*/
        this._data.regCheckCounter = 0;
        list = this.findProductidFrmflightList(res[selectedCPR.journey], selectedCPR.custtoflight[this._data.regCheckCounter].customer, selectedCPR.custtoflight[this._data.regCheckCounter].product);

        /*
         * getting prod id also from checked in segments of pax, so that same can be pre filled
         * */
        var tempselectedCPR=this._data.selectedCPRFromTripOverview;
        if(!jQuery.isUndefined(tempselectedCPR) && !jQuery.isUndefined(tempselectedCPR.custtoflight) && this._data.flowType != "modifyCheckin")
        {
        	for(var i in tempselectedCPR.custtoflight)
            {
        		if(selectedCPR.custtoflight[this._data.regCheckCounter].customer == tempselectedCPR.custtoflight[i].customer)
        		{
        			suggestion_prodID=this.findProductidFrmflightList(res[tempselectedCPR.journey], tempselectedCPR.custtoflight[i].customer, tempselectedCPR.custtoflight[i].product);
        		}
            }
        }

        var input = {
          "prodID": list,
          "paxID": selectedCPR.custtoflight[this._data.regCheckCounter].customer,
          "check_reg": true
        };

        if(suggestion_prodID != "")
        {
        	input["suggestion_prodID"]=suggestion_prodID;
        }

        this.submitJsonRequest("ICheckRegulatorySSCI", input, {
          scope: this,
          fn: this.__checkRegulatoryCallback,
          args: input
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in checkRegulatory function', exception);
      }

    },

    __checkRegulatoryCallback: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __checkRegulatoryCallback function');
      try {
        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var errors = [];
        var json = {};
        var warnings = [];
        var flag21400069=1;

        /*
         * If res itself empty, stop user in select flight page itself
         * */
        if(jQuery.isUndefined(res))
        {
        	this.displayErrors([{"localizedMessage":this._data.pageErrors["503003"].localizedMessage}], "pageCommonError", "error");
        	return null;
        }

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }

              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;

            }
          }

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*
           * For handling regulatory errors
           * */
          var CheckRegulatoryBean = res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean;
          if(!jQuery.isUndefined(CheckRegulatoryBean) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply))
          {
        	if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.failure))
        	{
        		CheckRegulatoryBean.generalReply=CheckRegulatoryBean.generalReply.failure;
        		if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors.errors) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors.errors.errors))
        		{
        			CheckRegulatoryBean.generalReply.warnings={};
            		CheckRegulatoryBean.generalReply.warnings.warnings={};
            		CheckRegulatoryBean.generalReply.warnings.warnings.warnings=CheckRegulatoryBean.generalReply.errors.errors.errors;
        		}

        	}else if(flag21400069 == 1)
        	{
        		errors.push({
	                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage
	                });
        		flag21400069=0;
        	}
          }
         if(!jQuery.isUndefined(CheckRegulatoryBean) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings))
          {

        	 for(var warningArrays in CheckRegulatoryBean.generalReply.warnings.warnings.warnings)
          	{
          		if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning))
          		{
          			if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code))
              		{
          				var custmerIDfrmProdID="";
          				if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.recordID))
          				{
          					custmerIDfrmProdID=this.findPaxFlightIdFrmProductId(cprRes[selectedCPR.journey],CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.recordID).split("~")[0];
          				}

          				if(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code == "1003")
          				{
          					/*
                  			 * custmerIDfrmProdID coming in errorbean same as current customer i.e custId
                  			 * */
                  			if(custmerIDfrmProdID != "" && cprRes[selectedCPR.journey][custmerIDfrmProdID].passengerTypeCode == "INF")
                  			{
                  				errors.push({
                    		          "localizedMessage": this._data.pageLabels.validDobInfant
                  				});
                  			}

          				}else if(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code == "4009")
          				{
          					errors.push({
          		                "localizedMessage": this._data.pageErrors["213002227"].localizedMessage
          		              });
          				}else if(flag21400069 == 1)
          				{
              errors.push({
          		                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage
              });
              flag21400069=0;
          				}

              		}

          		}
          	  }
            }else if(flag21400069 == 1 && jQuery.isUndefined(CheckRegulatoryBean))
            {
            	errors.push({
	                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage
	                });
            	flag21400069=0;
            }

         if(flag21400069 == 1 && jQuery.isUndefined(CheckRegulatoryBean.functionalContent))
            {
            	errors.push({
	                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage
	                });
            }
          if(errors.length > 0)
          {
        	  if(jQuery.isUndefined(CheckRegulatoryBean) || jQuery.isUndefined(CheckRegulatoryBean.functionalContent))
        	  {
        		  /*If incase it is select flight page
        		   * else if trip overview page
        		   * */
        		  jsonResponse.mciErrors=errors;
        		  if(jQuery("#selectFlightContinue").length > 0)
        		  {
              this.displayErrors(errors, "initiateandEditErrors", "error");

              jQuery("#section1 input[type='checkbox']").prop("checked",false);
              jQuery("#section1 input[type='checkbox']").attr("disabled", "disabled");
              jQuery("#selectFlightContinue").attr("disabled", "disabled");
              jQuery("#selectFlightContinue").addClass('disabled');
        		  }else if( $(".modifyCheckin").length > 0)
        		  {
        			  this.displayErrors(errors, "acceptConfWarning", "error");

        			$(".modifyCheckin").addClass("disabled").removeAttr("atdelegate");
      	            $(".modifyCheckin").attr("disabled", "");
            }

        		  return null;
        	  }else
        	  {
        		  this.setErrors(errors);
          }

          }
          /*
           * End for handling regulatory errors
           * */

          /*Taking response to customerDetailsBeans of reconstructed CPR*/
          var cprRes = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails = res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.functionalContent;
          if(res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.generalReply)
          {
        	  cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.generalReply=res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.generalReply;
          }

          /*
           * For copy suggestions into data to fill when regulatory page load
           * 2pax 2seg, first pac checked-in  in first seg and try to land on to same pax diff seg from To page
           * */
          this.copySuggestionsToRequirementDatas(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails);

          /*
           *if PAX holds only gender and which is disabled based on SSCI_ALOW_GNDER_EDIT, or if
           *nationality there without edit nat - SSCI_ENABLE_NAT_EDIT then also reg wont be shown
           * */
          var filterPaxBasedonNatGender=true;

          /*
           * For forming autocomplete request for destination fields
           * */
          if (cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length > 0) {
            var usaCodeTostate = this._data.usaStatesCodeToStateNameMap;

            for (var selectedOne in cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas) {
              selectedOne = cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas[selectedOne];
              var tempDetils={"street":"","city":"","state":"","postal":"","country":""};
              /*
               * For filtering pax whose regulatory details empty
               *
               * */
              var keyHolder=Object.keys(selectedOne);
              if(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length == 1 && keyHolder.length == 2 && selectedOne.hasOwnProperty("origins") && selectedOne.personalDetailsGender && this._data.siteParameters.SITE_SSCI_ALOW_GNDER_EDIT && this._data.siteParameters.SITE_SSCI_ALOW_GNDER_EDIT.search(/false/ig) != -1)
              {
            	  filterPaxBasedonNatGender=false;
              }
              if(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length == 1 && keyHolder.length == 2 && selectedOne.hasOwnProperty("origins") && selectedOne.personalDetailsNationality && this._data.siteParameters.SITE_SSCI_ENABLE_NAT_EDIT && this._data.siteParameters.SITE_SSCI_ENABLE_NAT_EDIT.search(/false/ig) != -1)
              {
            	  filterPaxBasedonNatGender=false;
              }
              if(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length == 1 && keyHolder.length == 3 && selectedOne.hasOwnProperty("origins") && selectedOne.personalDetailsNationality && this._data.siteParameters.SITE_SSCI_ENABLE_NAT_EDIT && this._data.siteParameters.SITE_SSCI_ENABLE_NAT_EDIT.search(/false/ig) != -1 && selectedOne.personalDetailsGender && this._data.siteParameters.SITE_SSCI_ALOW_GNDER_EDIT && this._data.siteParameters.SITE_SSCI_ALOW_GNDER_EDIT.search(/false/ig) != -1)
              {
            	  filterPaxBasedonNatGender=false;
              }
              /*
               * End for filtering pax whose regulatory details empty
               *
               * */

              /*Destination details*/
              if (selectedOne.destinationAddress && selectedOne.destinationAddress.postalCode) {
                if (selectedOne.destinationAddress.addressLines && selectedOne.destinationAddress.addressLines.length > 0) {
                  tempDetils.street=selectedOne.destinationAddress.addressLines[0];
                }

                if (selectedOne.destinationAddress.cityName) {
                  tempDetils.city=selectedOne.destinationAddress.cityName;
                }

                if (selectedOne.destinationAddress.stateProv) {
                  if (selectedOne.destinationAddress.stateProv.string && selectedOne.destinationAddress.stateProv.string != "") {

                    var destState = selectedOne.destinationAddress.stateProv.string;
                  }
                  if (selectedOne.destinationAddress.stateProv.stateCode && selectedOne.destinationAddress.stateProv.stateCode != "") {
                    var destState = usaCodeTostate[selectedOne.destinationAddress.stateProv.stateCode];
                    if (destState == undefined) {
                      destState = selectedOne.destinationAddress.stateProv.stateCode;

                    }

                  }
                }
                tempDetils.state=destState;

                if (selectedOne.destinationAddress.postalCode) {
                  tempDetils.postal=selectedOne.destinationAddress.postalCode;
                }

                if (selectedOne.destinationAddress.countryName && selectedOne.destinationAddress.countryName.code) {
                  tempDetils.country=this.gettwoDigitThreeDigitAllCntryList()[selectedOne.destinationAddress.countryName.code];
                }

                this.getAutocompleteStructureFromJsonStructure(tempDetils,"Dest");
              }

              /*home details*/
              if (selectedOne.homeAddress && selectedOne.homeAddress.postalCode) {
                if (selectedOne.homeAddress.addressLines && selectedOne.homeAddress.addressLines.length > 0) {
                  tempDetils.street=selectedOne.homeAddress.addressLines[0];
                }

                if (selectedOne.homeAddress.cityName) {
                  tempDetils.city=selectedOne.homeAddress.cityName;
                }

                if (selectedOne.homeAddress.stateProv) {
                  if (selectedOne.homeAddress.stateProv.string && selectedOne.homeAddress.stateProv.string != "") {

                    var destState = selectedOne.homeAddress.stateProv.string;
                  }
                  if (selectedOne.homeAddress.stateProv.stateCode && selectedOne.homeAddress.stateProv.stateCode != "") {
                    var destState = usaCodeTostate[selectedOne.homeAddress.stateProv.stateCode];
                    if (destState == undefined) {
                      destState = selectedOne.homeAddress.stateProv.stateCode;

              }

                  }
                }
                tempDetils.state=destState;

                if (selectedOne.homeAddress.postalCode) {
                  tempDetils.postal=selectedOne.homeAddress.postalCode;
                }

                if (selectedOne.homeAddress.countryName && selectedOne.homeAddress.countryName.code) {
                  tempDetils.country=this.gettwoDigitThreeDigitAllCntryList()[selectedOne.homeAddress.countryName.code];
                }

                this.getAutocompleteStructureFromJsonStructure(tempDetils,"Home");
              }

            }
          }
    	  /*
           * End for forming autocomplete request for destination fields
           * */


          /*
           * For filtering pax whose regulatory details empty
           *
           * */
          if(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails && ((!jQuery.isUndefined(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.choices) && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.choices.length > 0) || (!jQuery.isUndefined(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas) && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length > 0 && filterPaxBasedonNatGender)))
          {
        	  this._data.regulatoryAlteredSelCpr.custtoflight.push({customer:input.paxID,product:selectedCPR.custtoflight[this._data.regCheckCounter]["product"]});
        	  this._data.regulatoryAlteredSelCpr.customer.push(input.paxID);

          }
          /*
           * End For filtering pax whose regulatory details empty
           *
           * */

          if (cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.choices.length > 0 && this._data.regPageLandingPaxIndex == null) {
        	  /*
               * For filtering pax whose regulatory details empty
               *For getting proper index i.e regulatoryAlteredSelCpr index insted os selected CPR index
               * */
        	  this._data.regPageLandingPaxIndex = this.getCustomerIndex(input.paxID,"regulatoryAlteredSelCpr");
        	  /*
               * End for filtering pax whose regulatory details empty
               *
               * */
          }

          /*send req for all pax one by one as all pax cant send at once, load page based on all pax respponse*/
          this._data.regCheckCounter++;
          var list = "";
          var suggestion_prodID="";
          if (this._data.regCheckCounter < selectedCPR.custtoflight.length) {
            list = this.findProductidFrmflightList(cprRes[selectedCPR.journey], selectedCPR.custtoflight[this._data.regCheckCounter].customer, selectedCPR.custtoflight[this._data.regCheckCounter].product);

            /*
             * getting prod id also from checked in segments of pax, so that same can be pre filled
             * */
            var tempselectedCPR=this._data.selectedCPRFromTripOverview;
            if(!jQuery.isUndefined(tempselectedCPR) && !jQuery.isUndefined(tempselectedCPR.custtoflight) && this._data.flowType != "modifyCheckin")
            {
            	for(var tempselectedCPRi in tempselectedCPR.custtoflight)
                {
            		if(selectedCPR.custtoflight[this._data.regCheckCounter].customer == tempselectedCPR.custtoflight[tempselectedCPRi].customer)
            		{
            			suggestion_prodID=this.findProductidFrmflightList(cprRes[tempselectedCPR.journey], tempselectedCPR.custtoflight[tempselectedCPRi].customer, tempselectedCPR.custtoflight[tempselectedCPRi].product);
            		}
                }
            }

            var input = {
              "prodID": list,
              "paxID": selectedCPR.custtoflight[this._data.regCheckCounter].customer,
              "check_reg": true
            };

            if(suggestion_prodID != "")
            {
            	input["suggestion_prodID"]=suggestion_prodID;
            }

            this.submitJsonRequest("ICheckRegulatorySSCI", input, {
              scope: this,
              fn: this.__checkRegulatoryCallback,
              args: input
            });

          } else {

            /*
            * For filtering pax whose regulatory details empty
            *
            * */
        	  for(var productIndex in this._data.regulatoryAlteredSelCpr.product)
        	  {
        		  this._data.regulatoryAlteredSelCpr.flighttocust.push({product:this._data.regulatoryAlteredSelCpr.product[productIndex],customer:this._data.regulatoryAlteredSelCpr.customer});
        	  }

           /*
            * End For filtering pax whose regulatory details empty
            *
            * */

            /*
             * this._data.flowType is modifyCheckin means request is from trip overview page
             * in this case it always land on to first pax in regulatory page
             *
             * this step included as now we r providing "modifyCheckin" button in trip overview page
             * */
            if (this._data.flowType == "modifyCheckin") {
              this._data.regPageLandingPaxIndex = 0;

            }

            /*
             * to force user to land on to regulatory even incase parameter is true
             * */
            if (this._data.regPageLandingPaxIndex == null && (this._data.siteParameters.SITE_SSCI_REG_PG_ALWAYS != undefined && this._data.siteParameters.SITE_SSCI_REG_PG_ALWAYS.search(/true/i) != -1)) {
              this._data.regPageLandingPaxIndex = 0;
            }

            if(this._data.regulatoryAlteredSelCpr.customer.length == 0)
            {
            	this._data.regPageLandingPaxIndex=null;
            	if(this._data.flowType == "modifyCheckin")
            	{
            		_this.moduleCtrl.displayErrors([{"localizedMessage": this._data.pageLabels.regEditFailMsg}], "acceptConfWarning", "error");
            		$(".modifyCheckin").addClass("disabled").removeAttr("atdelegate");
                    $(".modifyCheckin").attr("disabled", "");
                    this._data.regulatoryAlteredSelCpr.disableModifyTravlerInfo=true;
            		return null;
            	}
            }

            if (this._data.regPageLandingPaxIndex == null) {
              /*Load Acceptance overview page*/

              /*BEGIN : Code to send only Non IATCI Flight for Preallocation*/
              var nonIATCIflightToCust = [];
              for (var flightInfo in selectedCPR.flighttocust) {
                var temp_cust = [];
                for (var custInfo in selectedCPR.flighttocust[flightInfo].customer) {
                  var contraint = selectedCPR.flighttocust[flightInfo].customer[custInfo] + selectedCPR.flighttocust[flightInfo].product;
                  if (!cprRes[selectedCPR.journey]["productDetailsBeans"][contraint]["IATCI_Flight"] && (cprRes[selectedCPR.journey][selectedCPR.flighttocust[flightInfo].customer[custInfo]].passengerTypeCode != "INF")) {
                    temp_cust.push(selectedCPR.flighttocust[flightInfo].customer[custInfo]);
                  }
                }
                if (temp_cust.length > 0) {
                  nonIATCIflightToCust.push({
                    product: selectedCPR.flighttocust[flightInfo].product,
                    customer: temp_cust
                  });
                }
              }
              /*END : Code to send only Non IATCI Flight for Preallocation*/

              if ((res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.parameters.SITE_SSCI_EN_SEAT_PRE_ALC.search(/true/i) != -1) && (nonIATCIflightToCust.length > 0)) {
                /*Giving req for first time for first pax in list*/

                var input = [{
                  "flighttocust": nonIATCIflightToCust,
                  "service": "pre_allocate"
                }];
                this.submitJsonRequest("IPreAllocateSeat", input, {
                  scope: this,
                  fn: this.__acceptanceOverviewCallback
                });

              } else {
                this.submitJsonRequest("IAcceptanceSummary", "", {
                  scope: this,
                  fn: this.__acceptanceOverviewCallback
                });
              }
            } else {
              /*Load regulatory page*/
              this.appCtrl.load(nextPage);
            }
          }
          }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __checkRegulatoryCallback function', exception);
      }

    },

    editRegulatory: function(input) {
      this.$logInfo('ModuleCtrl::Entering editRegulatory function');
      try {
        var selectedCPR = this._data.regulatoryAlteredSelCpr;
        var res = this.getCPR();
        var list = "";
        var suggestion_prodID="";

        /*Giving req for first time for first pax in list*/
        list = this.findProductidFrmflightList(res[selectedCPR.journey], selectedCPR.custtoflight[this._data.regPageLandingPaxIndex].customer, selectedCPR.custtoflight[this._data.regPageLandingPaxIndex].product);

        /*
         * getting prod id also from checked in segments of pax, so that same can be pre filled
         * */
        var tempselectedCPR=this._data.selectedCPRFromTripOverview;
        if(!jQuery.isUndefined(tempselectedCPR) && !jQuery.isUndefined(tempselectedCPR.custtoflight) && this._data.flowType != "modifyCheckin")
        {
        	for(var i in tempselectedCPR.custtoflight)
            {
        		if(selectedCPR.custtoflight[this._data.regPageLandingPaxIndex].customer == tempselectedCPR.custtoflight[i].customer)
        		{
        			suggestion_prodID=this.findProductidFrmflightList(res[tempselectedCPR.journey], tempselectedCPR.custtoflight[i].customer, tempselectedCPR.custtoflight[i].product);
        		}
            }
        }

        input.prodID = list;
        if(suggestion_prodID != "")
        {
        	input.suggestion_prodID= suggestion_prodID;
        }
        input.paxID = selectedCPR.custtoflight[this._data.regPageLandingPaxIndex].customer;
        var flagResGet = 0;
        for (var checkNode in input.editInput) {
          flagResGet++;
          if (flagResGet > 1) {
            break;
          }
        }
        var flowDecider = flagResGet == 1 && input.editInput.nationality != undefined ? "check_nat" : "check_reg_data";
        /*For edit nationality*/
        if (input["editInput"]["nat_upd_data"]) {
          flowDecider = "nat_upd_data";
          delete input["editInput"]["nat_upd_data"];
        }
        /*End of edit nationality*/
        input[flowDecider] = true;

        this.submitJsonRequest("ICheckRegulatorySSCI", input, {
          scope: this,
          fn: this.__editRegulatoryCallback,
          args: input
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in editRegulatory function', exception);
      }

    },
    __editRegulatoryCallback: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __editRegulatoryCallback function');
      try {
        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var errors = [];
        var json = {};
        var warnings = [];
        var cprRes = this.getCPR();
        var selectedCPR = this._data.regulatoryAlteredSelCpr;

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }
              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;
            }
          }


          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*
           * For handling regulatory errors
           * */
          var CheckRegulatoryBean = res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean;
          if(!jQuery.isUndefined(CheckRegulatoryBean) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply))
          {
        	if(CheckRegulatoryBean.generalReply.failure)
        	{
        		CheckRegulatoryBean.generalReply=CheckRegulatoryBean.generalReply.failure;
        		if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors.errors) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.errors.errors.errors))
        		{
        			CheckRegulatoryBean.generalReply.warnings={};
            		CheckRegulatoryBean.generalReply.warnings.warnings={};
            		CheckRegulatoryBean.generalReply.warnings.warnings.warnings=CheckRegulatoryBean.generalReply.errors.errors.errors;
        		}

        	}
          }
         if(!jQuery.isUndefined(CheckRegulatoryBean) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings) && !jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings))
          {

        	 for(var warningArrays in CheckRegulatoryBean.generalReply.warnings.warnings.warnings)
          	{
          		if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning))
          		{
          			if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code))
              		{
          				var custmerIDfrmProdID="";
          				if(!jQuery.isUndefined(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.recordID))
          				{
          					custmerIDfrmProdID=this.findPaxFlightIdFrmProductId(cprRes[selectedCPR.journey],CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.recordID).split("~")[0];
          				}

          				if(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code == "1003")
          				{
          					/*
                  			 * custmerIDfrmProdID coming in errorbean same as current customer i.e custId
                  			 * */
                  			if(custmerIDfrmProdID != "" && cprRes[selectedCPR.journey][custmerIDfrmProdID].passengerTypeCode == "INF")
                  			{
                  				errors.push({
                    		          "localizedMessage": this._data.pageLabels.validDobInfant
                  				});
                  			}

          				}else if(CheckRegulatoryBean.generalReply.warnings.warnings.warnings[warningArrays].errorWarning.code == "4009")
          				{
          					errors.push({
          		                "localizedMessage": this._data.pageErrors["213002227"].localizedMessage
          		              });
          				}else
          				{
          					 errors.push({
          		                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage,
          		                  "code": "21400069"
          		                });
          				}

              		}

          		}
          	  }
            }else if(jQuery.isUndefined(CheckRegulatoryBean))
            {
        	  errors.push({
                  "localizedMessage": res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.errorStrings["21400069"].localizedMessage,
                  "code": "21400069"
                });
            }
          if(errors.length > 0)
          {
        	  if(jQuery.isUndefined(CheckRegulatoryBean) || jQuery.isUndefined(CheckRegulatoryBean.functionalContent))
        	  {
              this.displayErrors(errors, "regulatoryErrors", "error");
        		  return null;
        	  }else
        	  {
        		  this.setErrors(errors);
          }

          }
          /*
           * End for handling regulatory errors
           * */

          /*Taking response to customerDetailsBeans of reconstructed CPR*/
          cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails = res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.functionalContent;
          if(res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.generalReply)
          {
        	  cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.generalReply=res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.requestParam.CheckRegulatoryBean.generalReply;
          }

          /*
           * For copy suggestions into data to fill when regulatory page load
           * 2pax 2seg, first pac checked-in  in first seg and try to land on to same pax diff seg from To page
           * */
          this.copySuggestionsToRequirementDatas(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails);

          /*
           * For forming autocomplete request for destination fields
           * */
          if (cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas && cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas.length > 0) {
            var usaCodeTostate = this._data.usaStatesCodeToStateNameMap;

            for (var selectedOne in cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas) {
              selectedOne = cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.requirementDatas[selectedOne];
              var tempDetils={"street":"","city":"","state":"","postal":"","country":""};

              /*Destination details*/
              if (selectedOne.destinationAddress && selectedOne.destinationAddress.postalCode) {
                if (selectedOne.destinationAddress.addressLines && selectedOne.destinationAddress.addressLines.length > 0) {
                  tempDetils.street=selectedOne.destinationAddress.addressLines[0];
                }

                if (selectedOne.destinationAddress.cityName) {
                  tempDetils.city=selectedOne.destinationAddress.cityName;
                }

                if (selectedOne.destinationAddress.stateProv) {
                  if (selectedOne.destinationAddress.stateProv.string && selectedOne.destinationAddress.stateProv.string != "") {

                    var destState = selectedOne.destinationAddress.stateProv.string;
                  }
                  if (selectedOne.destinationAddress.stateProv.stateCode && selectedOne.destinationAddress.stateProv.stateCode != "") {
                    var destState = usaCodeTostate[selectedOne.destinationAddress.stateProv.stateCode];
                    if (destState == undefined) {
                      destState = selectedOne.destinationAddress.stateProv.stateCode;

                    }

                  }
                }
                tempDetils.state=destState;

                if (selectedOne.destinationAddress.postalCode) {
                  tempDetils.postal=selectedOne.destinationAddress.postalCode;
                }

                if (selectedOne.destinationAddress.countryName && selectedOne.destinationAddress.countryName.code) {
                  tempDetils.country=this.gettwoDigitThreeDigitAllCntryList()[selectedOne.destinationAddress.countryName.code];
                }

                this.getAutocompleteStructureFromJsonStructure(tempDetils,"Dest");
              }

              /*home details*/
              if (selectedOne.homeAddress && selectedOne.homeAddress.postalCode) {
                if (selectedOne.homeAddress.addressLines && selectedOne.homeAddress.addressLines.length > 0) {
                  tempDetils.street=selectedOne.homeAddress.addressLines[0];
                }

                if (selectedOne.homeAddress.cityName) {
                  tempDetils.city=selectedOne.homeAddress.cityName;
                }

                if (selectedOne.homeAddress.stateProv) {
                  if (selectedOne.homeAddress.stateProv.string && selectedOne.homeAddress.stateProv.string != "") {

                    var destState = selectedOne.homeAddress.stateProv.string;
                  }
                  if (selectedOne.homeAddress.stateProv.stateCode && selectedOne.homeAddress.stateProv.stateCode != "") {
                    var destState = usaCodeTostate[selectedOne.homeAddress.stateProv.stateCode];
                    if (destState == undefined) {
                      destState = selectedOne.homeAddress.stateProv.stateCode;

                    }

                  }
                }
                tempDetils.state=destState;

                if (selectedOne.homeAddress.postalCode) {
                  tempDetils.postal=selectedOne.homeAddress.postalCode;
                }

                if (selectedOne.homeAddress.countryName && selectedOne.homeAddress.countryName.code) {
                  tempDetils.country=this.gettwoDigitThreeDigitAllCntryList()[selectedOne.homeAddress.countryName.code];
                }

                this.getAutocompleteStructureFromJsonStructure(tempDetils,"Home");
              }
            }
          }
    	  /*
           * End for forming autocomplete request for destination fields
           * */

          /*For setting gender if gender details are not there
           * in customerDetailsBeans, gender node not come which means gender is not there for particular customer.
           * */
          if (jQuery.isUndefined(cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].gender) && !jQuery.isUndefined(input.check_reg_data)) {
            var regBean = cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails;
            var regChoics = regBean.choices;
            var genderFlag = true;
            outer: for (var i = 0; i < regChoics.length; i++) {
              //For finding Gender from choice, if it not part of choice which means it is filed
              if (regChoics[i].type != null && regChoics[i].type != undefined && (regChoics[i].type == "PersonalDetails" || regChoics[i].type == "CountryOfResidence")) {
                if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 0) {
                  for (var j in regChoics[i].choices) {
                    if (regChoics[i].choices[j].fields != null && regChoics[i].choices[j].fields != undefined && regChoics[i].choices[j].fields.length > 0) {
                      for (var k in regChoics[i].choices[j].fields) {
                        //Gender
                        if (regChoics[i].choices[j].fields[k] == 5) {
                          genderFlag = false;
                          break outer;
                        }

                      }
                    }
                  }
                }
              }
            }

            if (genderFlag) {
              cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].gender = input.editInput.gender;
            }
          }
          if (input.editInput.gender != undefined) {
              cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].gender = input.editInput.gender;
            }

          /*Displaying Error in case required some more info of same pax and showing error on that case*/
          this._data.regulatoryInPageErrors = this._data.regPageLandingPaxIndex;

          if (cprRes[selectedCPR.journey].customerDetailsBeans[input.paxID].regulatoryDetails.choices.length == 0) {
            this._data.regPageLandingPaxIndex++;
          }

          /*Displaying Error in case required some more info of same pax and showing error on that case*/
          if (this._data.regulatoryInPageErrors == this._data.regPageLandingPaxIndex && jQuery.isUndefined(input["check_nat"])) {
            this._data.regulatoryInPageErrors = true;
          } else {
            this._data.regulatoryInPageErrors = null;
            this.setErrors("");
          }

          /*For edit nationality*/
          this._data.inNatEditScreen = false;
          /*End edit nationality*/

          if (this._data.regPageLandingPaxIndex >= selectedCPR.custtoflight.length) {

            /*
             * this._data.flowType is modifyCheckin means request is from trip overview page
             *
             * this step included as now we r providing "modifyCheckin" button in trip overview page
             *
             * in this case from regulatory page it should call acceptance skiping all other pages in between
             * it should check regulatory indicator
             * */
            if (this._data.flowType != "modifyCheckin") {



              /*BEGIN : Code to send only Non IATCI Flight for Preallocation*/
              var nonIATCIflightToCust = [];
              /*
               * loading with actual selected CPR as selectedcpr holds filter selectedcpr which are eligible for regulatory
               * */
              selectedCPR=this._data.regulatoryAlteredSelCpr.selectedCPR;
              for (var flightInfo in selectedCPR.flighttocust) {
                var temp_cust = [];
                for (var custInfo in selectedCPR.flighttocust[flightInfo].customer) {
                  var contraint = selectedCPR.flighttocust[flightInfo].customer[custInfo] + selectedCPR.flighttocust[flightInfo].product;
                  if (!cprRes[selectedCPR.journey]["productDetailsBeans"][contraint]["IATCI_Flight"] && (cprRes[selectedCPR.journey][selectedCPR.flighttocust[flightInfo].customer[custInfo]].passengerTypeCode != "INF")) {
                    temp_cust.push(selectedCPR.flighttocust[flightInfo].customer[custInfo]);
                  }
                }
                if (temp_cust.length > 0) {
                  nonIATCIflightToCust.push({
                    product: selectedCPR.flighttocust[flightInfo].product,
                    customer: temp_cust
                  });
                }
              }
              /*END : Code to send only Non IATCI Flight for Preallocation*/

              if ((res.responseJSON.data.checkIn.MSSCIRequiredDetails_A.parameters.SITE_SSCI_EN_SEAT_PRE_ALC.search(/true/i) != -1) && (nonIATCIflightToCust.length > 0)) {
                /*Giving req for first time for first pax in list*/
                var input = [{
                  "flighttocust": nonIATCIflightToCust,
                  "service": "pre_allocate"
                }];
                this.submitJsonRequest("IPreAllocateSeat", input, {
                  scope: this,
                  fn: this.__acceptanceOverviewCallback
                });

              } else {
                this.submitJsonRequest("IAcceptanceSummary", "", {
                  scope: this,
                  fn: this.__acceptanceOverviewCallback
                });
              }
            } else {
              this._data.flowType = null;

              this._data.regulatoryAlteredSelCpr.continueAsSelCPR=true;
              this.forModifyCheckinFlowCheckin();
            }

          } else {

            this.raiseEvent({
              "name": "page.refresh"
            });
          }
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __editRegulatoryCallback function', exception);
      }

    },

    loadRegulatory: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadRegulatory function');
        var dummyInput = "";
        this.submitJsonRequest("SSCILandOnToRegulatory", dummyInput, {
          scope: this,
          fn: this.__loadRegulatoryCallback
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in loadRegulatory function', exception);
      }
    },

    __loadRegulatoryCallback: function(res, dummyInput) {
      this.$logInfo('ModuleCtrl::Entering __loadRegulatoryCallback function')
      try {
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          this.appCtrl.load(nextPage);
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __loadRegulatoryCallback function', exception);
      }
    },
    /*
     * args.from - ao - acceptnace overveiw
     *        ac - acceptnace confirmation
     *
     * */
    onSeatClick: function(evt, args) {
      this.$logInfo('ModuleCtrl::Entering onSeatClick function')
      try {
      var selectedCPR = this.getSelectedCPR();
      var input = {};
      var cpr = this.getCPR();

      /*
       * For find out infant
       * */
      this._data.seatMapProdIndex = args.prodIndex;
      var length = selectedCPR.flighttocust[args.prodIndex].customer.length;
      for (var i = 0; i < length; i++) {
        if (cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].passengerTypeCode != "INF") {
          break;
        }
      }

      //Prod id
      input.prodID = this.findProductidFrmflightid(cpr[selectedCPR.journey], selectedCPR.flighttocust[args.prodIndex].customer[i], selectedCPR.flighttocust[args.prodIndex].product);
      //input.prodIDs=this.findProductidFrmflightid(cpr[selectedCPR.journey],selectedCPR.flighttocust[args.prodIndex].customer[i],selectedCPR.flighttocust[args.prodIndex].product);
      //First name
      input.firstName = "";
      if (cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].givenNames && cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].givenNames.length > 0) {
        input.firstName = cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].givenNames[0];
      }
      //last name
      input.lastName = "";
      if (cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].surname && cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].surname != "") {
        input.lastName = cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].customer[i]].personNames[0].surname;
      }
      //Arrival To
      input.arrivalTo = cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].product].arrivalAirport.locationCode;
      //departure from
      input.departureFrom = cpr[selectedCPR.journey][selectedCPR.flighttocust[args.prodIndex].product].departureAirport.locationCode;
      //Initial cust index
      input.custIndex = i;
      input.paxID = selectedCPR.flighttocust[args.prodIndex].customer[i];
      input.prodIndex = args.prodIndex;

      /*From which page seatmap loaded*/
      this._data.seatMapLoadingFrom = args.from;

      this.getSeatMap(input);
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in onSeatClick function', exception);
      }
    },

    getSeatMap: function(input) {
      this.$logInfo('ModuleCtrl::Entering getSeatMap function');
      try {
        this.submitJsonRequest("GetSeatMap", input, {
          scope: this,
          fn: this.__getSeatMapCallback,
          args: input
        });

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSeatMap function', exception);
      }

    },

    __getSeatMapCallback: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __getSeatMapCallback function')
      try {
        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var errors = [];
        var json = {};
        var warnings = [];

        /*
         * If res itself empty, stop user in same page
         * */
        if(jQuery.isUndefined(res))
        {
        	if(!jQuery.isUndefined(this._data.pageErrors)&&!jQuery.isUndefined(this._data.pageErrors["503003"]))
        	{
        		jQuery(".sectionDefaultstyleSsci>section #pageCommonErrorSeat").remove();
        	jQuery(".sectionDefaultstyleSsci>section").prepend("<div id=\"pageCommonErrorSeat\"></div>");
        	this.displayErrors([{"localizedMessage":this._data.pageErrors["503003"].localizedMessage}], "pageCommonErrorSeat", "error");
        	}
        	return null;
        }

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }

              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;

            }
          }
          if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null
        		  && res.responseJSON.data.checkIn[dataId].requestParam.SeatMapBean != null
        		  && res.responseJSON.data.checkIn[dataId].requestParam.SeatMapBean.seatmapInformations != null
        		  && res.responseJSON.data.checkIn[dataId].requestParam.SeatMapBean.seatmapInformations.length > 0) {

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*
           * For taking response and reconstructing
           * */
          var cpr = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          cpr[selectedCPR.journey].customerDetailsBeans[input.paxID].seatmap = res.responseJSON.data.checkIn.MSSCISeatMap_A.requestParam.SeatMapBean.seatmapInformations;

          /*send req for all pax one by one as all pax cant send at once, load page based on all pax respponse*/
          /*
           * For find out infant
           * */
          var length = selectedCPR.flighttocust[input.prodIndex].customer.length;
          input.custIndex++;

          for (var i = input.custIndex; i < length; i++) {
            if (cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].passengerTypeCode != "INF") {
              break;
            }
          }

          if (i < length) {
            //Prod id
            input.prodID = this.findProductidFrmflightid(cpr[selectedCPR.journey], selectedCPR.flighttocust[input.prodIndex].customer[i], selectedCPR.flighttocust[input.prodIndex].product);
            //input.prodIDs=this.findProductidFrmflightid(cpr[selectedCPR.journey],selectedCPR.flighttocust[input.prodIndex].customer[i],selectedCPR.flighttocust[input.prodIndex].product);
            //First name
            input.firstName = "";
            if (cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].givenNames && cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].givenNames.length > 0) {
              input.firstName = cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].givenNames[0];
            }
            //last name
            input.lastName = "";
            if (cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].surname && cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].surname != "") {
              input.lastName = cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].customer[i]].personNames[0].surname;
            }
            //Arrival To
            input.arrivalTo = cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].product].arrivalAirport.locationCode;
            //departure from
            input.departureFrom = cpr[selectedCPR.journey][selectedCPR.flighttocust[input.prodIndex].product].departureAirport.locationCode;
            //Pax ID
            input.custIndex = i;
            input.paxID = selectedCPR.flighttocust[input.prodIndex].customer[i];

            this.submitJsonRequest("GetSeatMap", input, {
              scope: this,
              fn: this.__getSeatMapCallback,
              args: input
            });

          } else {
            /*Load seatmap*/
        	if(res.responseJSON.data.checkIn[dataId].parameters.SITE_MC_ENBL_NEW_SEATMAP != undefined && res.responseJSON.data.checkIn[dataId].parameters.SITE_MC_ENBL_NEW_SEATMAP.search(/true/i) != -1)
        	{
        		nextPage="merci-checkin-MSSCINewSeatMap_A";
        	}
            this.appCtrl.load(nextPage);
            modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
          }
          }else{
        	  	if (this._data.seatMapLoadingFrom != null && this._data.seatMapLoadingFrom == "ao"){
                	this.displayErrors([{"localizedMessage":  res.responseJSON.data.checkIn[dataId].errorStrings[25000058].localizedMessage}], "tripSummCoreErrors", "error");
                }else {
                	this.displayErrors([{"localizedMessage":  res.responseJSON.data.checkIn[dataId].errorStrings[25000058].localizedMessage}], "acceptConfErrs", "error");
                }

          }
          }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __getSeatMapCallback function', exception);
      }
    },

    /*
     * journey - whole journeny details(has to send the bean it self in order to access like journey[flightid])
     * flightid - flight id
     * custid - cust id
     * seatCharecterstic - if defined then return seat along with seat charecterstics like seatnumber~charectersstics
     * */
    getSeatForPax: function(journey, flightid, custid, seatCharecterstic) {
      this.$logInfo('ModuleCtrl::Entering getSeatForPax function');
      try {
        var key = custid + journey[flightid].leg[0].ID + "SST";

        if (!jQuery.isUndefined(journey.seat) && !jQuery.isUndefined(journey.seat[key]) && !jQuery.isUndefined(journey.seat[key].row) && !jQuery.isUndefined(journey.seat[key].column)) {
          var seat = journey.seat[key].row + journey.seat[key].column;
          if (!jQuery.isUndefined(seatCharecterstic) && !jQuery.isUndefined(journey.seat[key].seatCharacteristic)) {
            seat = seat + "~" + journey.seat[key].seatCharacteristic;
          }
          return seat;
        } else {
          return "Not Added";
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSeatForPax function', exception);
      }

    },

    saveseat: function(input) {
      this.$logInfo('ModuleCtrl::Entering saveseat function');
      try {
        this.submitJsonRequest("IPreAllocateSeat", input, {
          scope: this,
          fn: this.__saveseatcallback,
          args: input
        });

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in saveseat function', exception);
      }

    },

    __saveseatcallback: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __saveseatcallback function');
      try {

        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var flow = input[0].flow;
        var errors = [];
        var json = {};
        var warnings = [];
        var success = [];

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }

              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;

            }
          }

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*For Including the Preallocated Seat Response To The IDC Bean*/
          var cprRes = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          var noOfpassenger = 0;  //For GA
          var uniqueProductList = {};  //For GA

          if (json.checkIn[dataId] && !jQuery.isUndefined(json.checkIn[dataId].requestParam.UpdateDetailsSeatStatus)) {
            var seatUpdate = json.checkIn[dataId].requestParam.UpdateDetailsSeatStatus;
            if (seatUpdate && !jQuery.isUndefined(seatUpdate.functionalContent) && !jQuery.isUndefined(seatUpdate.functionalContent.seats)) {
              for (var seatNo in seatUpdate.functionalContent.seats) {
                var referenceIDLegPassengerLegID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerLegID;
                var referenceIDLegPassengerPassengerID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerPassengerID;

                /*GA Code*/
                var referenceIDFlightID = referenceIDLegPassengerLegID.substring(0,referenceIDLegPassengerLegID.lastIndexOf("-"));
                var referenceIDProductID = referenceIDLegPassengerPassengerID + referenceIDFlightID;
                if(jQuery.isUndefined(uniqueProductList[referenceIDProductID])){
                 	 uniqueProductList[referenceIDProductID] = "";
                 	 noOfpassenger++;
                }
                /*GA Code*/

                var constraint = referenceIDLegPassengerPassengerID + referenceIDLegPassengerLegID + "SST";
                if (cprRes[selectedCPR.journey].seat[constraint]) {
                  cprRes[selectedCPR.journey].seat[constraint] = seatUpdate.functionalContent.seats[seatNo];
                }
              }
              this.setCPR(cprRes);
            }

          }




          /**Google Analytics**/
          if ((this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled())) {
              /**Google Tag Manager (GTM)**/
              var customData = {};
              if(this.utils.isGTMEnabled()){
                  if (json.checkIn[dataId] && !jQuery.isUndefined(json.checkIn[dataId].requestParam.UpdateDetailsSeatStatus)) {
                      var seatUpdate = json.checkIn[dataId].requestParam.UpdateDetailsSeatStatus;
                      customData = this.returnGTMCustomData("Seat selection",seatUpdate,"");
              }
              }
              /**Google Tag Manager (GTM)**/

        	  var loginOrguestUser = "";
              var headerData = this.getHeaderInfo()
              if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
                loginOrguestUser = "KFMember";
              } else {
                loginOrguestUser = "GuestLogin";
              }

              if (this.getEmbeded() && aria.core.Browser.isIOS) {

                jQuery("[name='ga_track_event']").val("Category=SSCIAppiPhoneSeatSelection&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(noOfpassenger));

                //ga('send', 'event', 'MCIAppiPhoneCheckin', loginOrguestUser, 'iPhone',paxLenght);
                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIAppiPhoneSeatSelection',
                  action: loginOrguestUser,
                  label: 'iPhone',
                  requireTrackPage: true,
                  value: parseInt(noOfpassenger),
                  data: customData
                });

              } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                // ga('send', 'event', 'MCIAppAndroidCheckin', loginOrguestUser, 'Android',paxLenght);

                jQuery("[name='ga_track_event']").val("Category=SSCIAppAndroidSeatSelection&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(noOfpassenger));

                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIAppAndroidSeatSelection',
                  action: loginOrguestUser,
                  label: 'Android',
                  requireTrackPage: true,
                  value: parseInt(noOfpassenger),
                  data: customData
                });

              } else {

                //ga('send', 'event', 'MCIWebCheckin', loginOrguestUser, 'Mobile Web',paxLenght);

                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIWebSeatSelection',
                  action: loginOrguestUser,
                  label: 'Mobile Web',
                  requireTrackPage: true,
                  value: parseInt(noOfpassenger),
                  data: customData
                });

              }

            }
          /* GOOGLE ANALYTICS */
          /*
           * Exit row check,
           * if exit row check required then show popup and then
           * execute call back other wise execute callback directly
           * */
          if(flow == "tripsummary")
          {
        	  this._data.exitrowFlow="summary";
          }else
          {
        	  this._data.exitrowFlow="confirmation";
          }
          var _this = this;
          this.callExitpopupBasedonWarning(

            function() {
              /*IATCI*/
              if (flow == "IATCISeatSave") {
                var nextPageToLoad = input[0].nextPage;
                if (dataId == "MSSCISeatMap_A") {
                  _this._data.IATCISeatSaveFailure = true;
                }

                _this.appCtrl.load(nextPageToLoad);
              } /*IATCI*/
              else {
              /*
               * Showing error message if again land on to satmap
               * */
              errors.push(_this._data.uiErrors[25000065]);
	              setTimeout(function(){
	            	  if(jQuery("#seatErrors").length > 0)
	            	  {
              _this.displayErrors(errors, "seatErrors", "error");
	            	  }

	              },100);

              /*For showing success message*/
              success.push(_this._data.uiErrors[25000067]); //JSONData.uiErrors[21300051].localizedMessage
              _this.setSuccess(success);
              /*End for showing success message*/
              /*Load seatmap*/
          	  if(res.responseJSON.data.checkIn[dataId].parameters && res.responseJSON.data.checkIn[dataId].parameters.SITE_MC_ENBL_NEW_SEATMAP != undefined && res.responseJSON.data.checkIn[dataId].parameters.SITE_MC_ENBL_NEW_SEATMAP.search(/true/i) != -1)
          	  {
          		nextPage="merci-checkin-MSSCINewSeatMap_A";
          	  }

              _this.appCtrl.load(nextPage);


              }

            }, json.checkIn[dataId].requestParam, "UpdateDetailsSeatStatus"

          );

        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __saveseatcallback function', exception);
      }
    },
    /*
     * input to the function be callback and response and base node
     * */
    callExitpopupBasedonWarning: function(callback, res, baseResNode) {
      this.$logInfo('ModuleCtrl::Entering callExitpopupBasedonWarning function');
      try {
      /*For Showing exit row popup*/
      if (!jQuery.isUndefined(res) && !jQuery.isUndefined(res[baseResNode]) && !jQuery.isUndefined(res[baseResNode].generalReply) && !jQuery.isUndefined(res[baseResNode].generalReply.warnings) && !jQuery.isUndefined(res[baseResNode].generalReply.warnings.warnings)) {
        var temp = res[baseResNode].generalReply.warnings.warnings;
        if (!jQuery.isUndefined(temp.warnings) && temp.warnings.length > 0) {
          for (var i in temp.warnings) {
            if (temp.warnings[i].errorWarning.code == 6005 || temp.warnings[i].errorWarning.code == 3009) {
              /*Once error found remove from base response so that it wont come on again while browser back and other unwanted scenarios*/
              temp.warnings.splice(i, 1);

              this.displayExitPopup(callback);
              return;
            }
          }
        }
      }
      callback();
      /*End for showing exit row popup*/
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in callExitpopupBasedonWarning function', exception);
      }
    },
    displayExitPopup: function(callback) {
      this.$logInfo('ModuleCtrl::Entering displayExitPopup function');
      try {
      this._data.mbpSpbpCallBacks = callback;
      var cpr = this.getCPR();
      var selectedCPR = this.getSelectedCPR();
      var flighttocust = selectedCPR.flighttocust;
      var exitrowInput = [];
      var showDetailsInPopup = "";
      var liDetails = "";

      for (var i in flighttocust) {
        var paxNames = [];
        var flightID = flighttocust[i].product;
        for (var j in flighttocust[i].customer) {

          var custID = flighttocust[i].customer[j];
          var seatDet = this.getSeatForPax(cpr[selectedCPR.journey], flightID, custID, "req_charecterestics").split("~");
          var prodID = this.findProductidFrmflightid(cpr[selectedCPR.journey], custID, flightID)
          if (seatDet[0] != "Not Added") {
            if (seatDet.length == 2 && jQuery.inArray("E", seatDet[1].split(" ")) != -1 && cpr[selectedCPR.journey]["status"]["prodStatus"][custID + flightID + "EXU"] != undefined && cpr[selectedCPR.journey]["status"]["prodStatus"][custID + flightID + "EXU"]["referenceIDProductProductID"] == prodID) {
              if (cpr[selectedCPR.journey][custID].passengerTypeCode != "INF") {
                /*Forming exit row input*/
                var date = new Date(cpr[selectedCPR.journey][flightID].timings.SDT.time);
                var depDate = date.getUTCFullYear() + "";
                depDate = depDate.charAt("2") + depDate.charAt("3");
                depDate += (date.getUTCMonth() + 1) < 10 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1);
                depDate += date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();

                var depLoc = cpr[selectedCPR.journey][flightID].departureAirport.locationCode;
                var arrLoc = cpr[selectedCPR.journey][flightID].arrivalAirport.locationCode;

                exitrowInput.push({

                  "primeId": prodID,
                  "marketingCompany": cpr[selectedCPR.journey][flightID].operatingAirline.companyName.companyIDAttributes.code,
                  "flightNumber": cpr[selectedCPR.journey][flightID].operatingAirline.flightNumber,
                  "boardPointDetails": depLoc,
                  "offpointDetails": arrLoc,
                  "departureDate": depDate,
                  "referenceQualifier": "DID",
                  "custID": custID,
                  "flightID": flightID

                });
                /*End Forming exit row input*/

                /*For forming exit popup flight and pax details*/
                if (liDetails == "") {
                  liDetails += "<li class='flightDetails'>" + depLoc + " - " + arrLoc + "</li>";
                }

                var _class = cpr[selectedCPR.journey][custID].passengerTypeCode == "ADT" ? "adult" : "child";
                var name = cpr[selectedCPR.journey][custID].personNames[0].givenNames[0] + " " + cpr[selectedCPR.journey][custID].personNames[0].surname;
                liDetails += "<li class='" + _class + "'>" + name + "</li>";

                /*For infant*/
                if (!jQuery.isUndefined(cpr[selectedCPR.journey][custID].accompaniedByInfant) && (cpr[selectedCPR.journey][custID].accompaniedByInfant == true)) {
                  custID = this.findInfantIDForCust(flightID, custID);
                  var name = "";
                  if (!jQuery.isUndefined(cpr[selectedCPR.journey][custID].personNames[0].givenNames) && !jQuery.isUndefined(cpr[selectedCPR.journey][custID].personNames[0].givenNames[0])) {
                    name = cpr[selectedCPR.journey][custID].personNames[0].givenNames[0] + " ";
                  }
                  if (!jQuery.isUndefined(cpr[selectedCPR.journey][custID].personNames[0].surname)) {
                    name += cpr[selectedCPR.journey][custID].personNames[0].surname;
                  }

                  liDetails += "<li class='infant'>" + name + "</li>";

                }
                /*End for forming exit popup flight and pax details*/

              }

            }
          }
        }

        if (liDetails != "") {
          showDetailsInPopup += "<ul>" + liDetails + "</ul>"
          liDetails = "";
        }

      }

      /*
       * This return false if exit row no need to display
       * return true otherwise
       * */
      if (exitrowInput.length == 0) {
        if (this._data.mbpSpbpCallBacks != undefined) {
          this._data.mbpSpbpCallBacks();
        }
        this._data.mbpSpbpCallBacks = null;
        return false;
      } else {
        jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
        jQuery("#exitRowConf").removeClass("displayNone").addClass("displayBlock");
        jQuery("#exitRowConf .paxDetails").attr("data-exitrowInput", JSON.stringify(exitrowInput));
        jQuery("#exitRowConf .paxDetails").html(showDetailsInPopup);
        jQuery(document).scrollTop("0");

        return true;
      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in displayExitPopup function', exception);
      }

    },
    closeExitrowpopup: function() {
      this.$logInfo('ModuleCtrl::Entering closeExitrowpopup function');
      try {
      jQuery("#exitRowConf").removeClass("displayBlock").addClass("displayNone");
      jQuery("#exitRowConf .paxDetails").attr("data-exitrowInput", "");
      jQuery("#exitRowConf .paxDetails").html("");
      jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in closeExitrowpopup function', exception);
      }
    },
    /**
     * Emergency Exit seat Allocation
     * This method is used to Allocate Emergency Exit Seat which is selected from seat map.
     */
    emergencyExitSeatAlllocation: function() {
      this.$logInfo('ModuleCtrl::Entering emergencyExitSeatAlllocation function');
      try {
        /*
         * Emergency popup suitablity answer
         * */
        var emergencyExitInput = JSON.parse(jQuery("#exitRowConf .paxDetails").attr("data-exitrowInput"));
        emergencyExitInput[0]["STATUS_INDICATOR"] = jQuery("#exitRowConf [name='answer']:checked").val();

        /*
         *if call from summary then call back function return summary
         *else it is from tripoverview page, page return 0 at last of string
         *else confirmation page
         *(return\s){1}"[a-zA-Z]*(0";)$ this reg match return "mbp0";  i.e all string that start with return " and end with 0"; -- rep tripoverviewpage
         * */
        var flow = "";
        if (this._data.mbpSpbpCallBacks != undefined && this._data.exitrowFlow == "summary") {
          flow = "tripsummary";
        }else if(this._data.mbpSpbpCallBacks != undefined && this._data.mbpSpbpCallBacks.toString().search(/(return\s){1}"[a-zA-Z]*(0";)$/gi) != -1)
        {
        	flow = "tripoverview";
        }else{
          flow = "acceptanceconfirmation";
        }
        console.log("emer ser flow:  "+flow);
        emergencyExitInput[0]["FLOW"] = flow;

        this.submitJsonRequest("ISSCIEmergencyExitPrompt", emergencyExitInput, {
          scope: this,
          fn: "__emergencyExitSeatAlllocationCallback",
          args: emergencyExitInput
        });
        this.closeExitrowpopup();
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in emergencyExitSeatAlllocation function', exception);
      }
    },

    /**
     * __emergencyExitSeatAlllocationCallback
     * This method is the callback method for the emergencyExitSeatAlllocation seat action.
     */

    __emergencyExitSeatAlllocationCallback: function(res, emergencyExitInput) {
      this.$logInfo('ModuleCtrl::Entering emergencyExitSeatAlllocation function');
      try {
        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var errors = [];
        var json = {};
        var warnings = [];
        var showWarningMessageOnSeatChange = false;

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }

              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;

            }
          }

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*
           * Exit row service return changed seat incase user select no in exit popup
           *
           * there can also other scenarios where it can happen
           *
           * so if exit row seat has new seat allocated then update IDC accordingly
           *
           * */
          var error = json.checkIn[dataId].errorStrings;
          var cprRes = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          var journey = cprRes[selectedCPR.journey];
          if (json.checkIn[dataId] && !jQuery.isUndefined(json.checkIn[dataId].requestParam.ExitPromptString)) {
            var temp = json.checkIn[dataId].requestParam.ExitPromptString.segmentInfos;
            if (!jQuery.isUndefined(temp)) {
              for (var segInfos in temp) {
                for (var item in temp[segInfos].seatResponseInfos) {
                  item = temp[segInfos].seatResponseInfos[item];
                  for (var itemArrayVal in item.passengerInfos) {
                    /*
                     * Getting key to update new seat in IDC
                     * */
                    var paxIDandFlightID = this.findPaxFlightIdFrmProductId(journey, item.passengerInfos[itemArrayVal].seatIdentifiers.idSections[0].primeId);
                    var customerID = paxIDandFlightID.split("~")[0];
                    var flightID = paxIDandFlightID.split("~")[1];
                    var legIdfromFlight = this.getLegIdBasedByFlightId(flightID);
                    var constraint = customerID + legIdfromFlight[0] + "SST";

                    /*
                     * Getting column and row to set
                     * */
                    var seatColumn = "",
                      seatRow = "",
                      seatCharecstic = "";
                    var seatNumberArray = item.allocatedSeatNumbers.seatDetails[itemArrayVal].seatNumber.split("");
                    for (var val in seatNumberArray) {
                      val = seatNumberArray[val];
                      if (seatColumn == "" && (val != "0" || seatRow != "") && isNaN(parseInt(val)) == false) {
                        seatRow += val;
                      } else if (isNaN(parseInt(val)) == true) {
                        seatColumn += val;
                      }
                    }

                    /*
                     * Seat charecterstics
                     * should be in form "A E B"
                     * */
                    seatCharecstic = item.allocatedSeatNumbers.seatDetails[itemArrayVal].seatCharacteristics;
                    if (typeof seatCharecstic != "string") {
                      seatCharecstic = item.allocatedSeatNumbers.seatDetails[itemArrayVal].seatCharacteristics.join(" ");
                    }

                    /*
                     * setting values accordingly
                     * */
                    if (cprRes[selectedCPR.journey].seat[constraint]) {

                      if (seatColumn.trim() != "" && seatRow.trim() != "") {

                        /*if seats got changed then only seat changed info has to show to user*/
                        if (cprRes[selectedCPR.journey].seat[constraint].column != seatColumn || cprRes[selectedCPR.journey].seat[constraint].row != seatRow) {
                          showWarningMessageOnSeatChange = true;
                        }

                        cprRes[selectedCPR.journey].seat[constraint].column = seatColumn;
                        cprRes[selectedCPR.journey].seat[constraint].row = seatRow;
                        cprRes[selectedCPR.journey].seat[constraint].seatCharacteristic = seatCharecstic;
                      }

                    }

                  }


                }

              }

            }

          /*
           * For change status in CPR accordingly as soon as exit row is success
           * Remember this we can also do in above loop itself  but prob is that
           * we may not get seat allocated from exit row response in some case and
           * inorder to overcome it we are doing seperatly
           * */
          var listToSeatEligibilityfunc = {};
          for (var item in emergencyExitInput) {
            item = emergencyExitInput[item];
            cprRes[selectedCPR.journey]["status"]["prodStatus"][item.custID + item.flightID + "EX" + emergencyExitInput[0]["STATUS_INDICATOR"]] = cprRes[selectedCPR.journey]["status"]["prodStatus"][item.custID + item.flightID + "EXU"];
            delete cprRes[selectedCPR.journey]["status"]["prodStatus"][item.custID + item.flightID + "EXU"];

            /*Updating confirmation page seats, if new seat allocated from exitrow it will reflect here*/
            var legIdfromFlight = this.getLegIdBasedByFlightId(item.flightID);
            var constraint = item.custID + legIdfromFlight[0] + "SST";
            jQuery("#" + constraint).text(cprRes[selectedCPR.journey].seat[constraint].row + cprRes[selectedCPR.journey].seat[constraint].column);

            listToSeatEligibilityfunc[item.flightID] == undefined ? listToSeatEligibilityfunc[item.flightID] = [item.custID] : listToSeatEligibilityfunc[item.flightID].push(item.custID);
          }


          }
          /*
           * happens when exit service throw errror and it is MBp, SPBP flow of overview and confirmation
           * */
          else if(this._data.exitrowFlow != "summary" && this._data.exitrowFlow != "confirmation")
          {
        	  this.displayErrors([error["503003"]], "acceptConfWarning", "error");
        	  this._data.mbpSpbpCallBacks = null;
        	  this._data.exitrowFlow="";
        	  return null;
          }


          /*For display mbp or spbp popups
           *
           * if callling from seat map then return summary
           *
           * from variable : mbp -- click on boarding button
           * sms -- click on sms button
           * email -- click on email button
           * passbook -- click on passbook button
           *
           * */
          if (this._data.mbpSpbpCallBacks != undefined) {
            var from = this._data.mbpSpbpCallBacks();
          }
          this._data.mbpSpbpCallBacks = null;

          /*
           * For showing warning of seat change
           *
           */
          //showWarningMessageOnSeatChange=true;
          if (showWarningMessageOnSeatChange) {
            /*
             * Decide which warning message to show depends on seat change option avilable or not
             * */
            var seatChangeOption = false;
            var parameters = json.checkIn[dataId].parameters;

            /*
             * checking wether change seat option avilable for particular seat or not
             * based on parameter in summary and confirmation based on flag
             * */
            if ( this._data.exitrowFlow == "summary" && parameters.SITE_SSCI_ENBL_CHANG_SEAT && parameters.SITE_SSCI_ENBL_CHANG_SEAT.search(/true/i) != -1) {
              seatChangeOption = true;
              console.log("wrng disp:  summ");
            } else if ((this._data.exitrowFlow == "confirmation" || (from != undefined && from.search(/(return\s){1}"[a-zA-Z]*(0";)$/gi) == -1)) && parameters.SITE_SSCI_CHG_ST_AFTR_CON && parameters.SITE_SSCI_CHG_ST_AFTR_CON.search(/true/i) != -1) {
              /*
               * in confirmation along with parameter it is nessary wether boarding pass generated or not
               * seat map disable based on this
               * for exit row pax, if seat map not avilable then message should change
               * */
              for (var listItem in listToSeatEligibilityfunc) {
                seatChangeOption = this.findAdltChildCountFromCustIDList(listToSeatEligibilityfunc[listItem], listItem, "ac") == 0 ? false : true;

              }
              console.log("wrng disp:  conf");
            }

            var warning = [];
            var label = json.checkIn[dataId].labels;
            if (seatChangeOption == false || from == "mbp") {
              warning.push({
                "localizedMessage": label.Exitrowgenericmsg
              });
            } else {
              warning.push({
                "localizedMessage": label.Exitrowgenericseatmsg
              });
            }
            this.setWarnings(warning);


            /*
             * for reset successmsg of save seat in case emergency warning has to display
             * */
            if(warning.length > 0)
            {
            	 this.setSuccess("");
            	 jQuery("#acceptConfMsgs").disposeTemplate();
            	 jQuery("#tripSummErrors").disposeTemplate();
            }

            /*For display message only incase div avilable*/
            if (jQuery("#acceptConfWarning").length > 0) {
              this.displayErrors(warning, "acceptConfWarning", "warning");
            }

            var _this=this;
            setTimeout(function() {

            	_this.setWarnings("");

             }, 400);

          }

          this._data.exitrowFlow="";
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __emergencyExitSeatAlllocationCallback function', exception);
      }
    },

    processAcceptance: function(input) {
      this.$logInfo('ModuleCtrl::Entering processAcceptance function');
      try {

        this.submitJsonRequest("ProcessAcceptance", input, {
          scope: this,
          fn: this.__processAcceptance,
          args: input
        });

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in processAcceptance function', exception);
      }

    },

    __processAcceptance: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __processAcceptance function')
      try {
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {
          this._data.confMailSent = false;
          var l_seatPreSelected = false;
          var reallyAccepted = false;//Required For Sending In SQ GTM Code At Last of this function but value set in be
          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          var errorStrings = res.responseJSON.data.checkIn[dataId].errorStrings;

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          var errors = [];
          var noneCheckedInFlag = false;
          this._data.paxOffloadedDueToStandby = false;

          if (res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedPassengers != null) {

            var acceptedPassengers = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedPassengers;
            var selectedCPR = this._data.selectedCPR;

            var temp_flight = [];
            var temp_cust = [];

            for (var i in acceptedPassengers) {
              reallyAccepted = true;
              var flight = acceptedPassengers[i].flightID;
              var cust = acceptedPassengers[i].passengerID;
              var present_flag = false;
              for (var i = 0; i < temp_flight.length; i++) {
                if (temp_flight[i] == flight) {
                  present_flag = true;
                }
              }

              if (!present_flag) {
                temp_flight.push(flight);
              }
            }
            for(var selectdCPROrder in selectedCPR.custtoflight){
            	var orderedCustomerId = selectedCPR.custtoflight[selectdCPROrder].customer;
            for (var i in acceptedPassengers) {
              var flight = acceptedPassengers[i].flightID;
              var cust = acceptedPassengers[i].passengerID;
                    if(orderedCustomerId == cust){
//                    	var present_flag = false;
//                        for (var i = 0; i < temp_cust.length; i++) {
//                          if (temp_cust[i] == cust) {
//                            present_flag = true;
//                          }
//                        }
//
//                        if (!present_flag) {
//                          temp_cust.push(cust);
//                        }
                        if(temp_cust.indexOf(cust) == -1){
                        	temp_cust.push(cust);
                }
              }
              }
            }


            /* To modify the flighttocust in SelectedCPR*/
            var temp_flighttocust = [];
            for (var j in temp_flight) {
              var custs = [];
              var flightNo = temp_flight[j];
              for (var x in acceptedPassengers) {
                if (acceptedPassengers[x].flightID == flightNo) {
                  custs.push(acceptedPassengers[x].passengerID)
                }
              }
              temp_flighttocust.push({
                product: flightNo,
                customer: custs
              });
            }

            /* To modify the flighttocust in SelectedCPR*/
            var temp_custtoflight = [];
            for (var j in temp_cust) {
              var flights = [];
              var custNo = temp_cust[j];
              for (var x in acceptedPassengers) {
                if (acceptedPassengers[x].passengerID == custNo) {
                  flights.push(acceptedPassengers[x].flightID)
                }
              }
              temp_custtoflight.push({
                product: flights,
                customer: custNo
              });
            }

            this._data.selectedCPR.flighttocust = temp_flighttocust;
            this._data.selectedCPR.custtoflight = temp_custtoflight;

            /**Begin Allocating Seat Acording to Acceptance Response*/
            /*For Including the Preallocated Seat Response To The IDC Bean*/
            if (null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean && null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent && null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent.seats && res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent.seats.length > 0) {
              var cprRes = this.getCPR();
              var selectedCPR = this.getSelectedCPR();

              var seatUpdate = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean;
              if (seatUpdate && seatUpdate.functionalContent && seatUpdate.functionalContent.seats) {
                for (var seatNo in seatUpdate.functionalContent.seats) {
                  var referenceIDLegPassengerLegID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerLegID;
                  var referenceIDLegPassengerPassengerID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerPassengerID;
                  var constraint = referenceIDLegPassengerPassengerID + referenceIDLegPassengerLegID + "SST";
                  if (cprRes[selectedCPR.journey].seat[constraint]) {
                	//If Seat Was pre selected by the customer in any of the Product Of the journey then we will set l_seatPreSelected value true
                	if(!jQuery.isUndefined(cprRes[selectedCPR.journey].seat[constraint].status)&&!jQuery.isUndefined(cprRes[selectedCPR.journey].seat[constraint].status.code)
                			&& cprRes[selectedCPR.journey].seat[constraint].status.code == "A"){
                		l_seatPreSelected = true;
                	}
                    cprRes[selectedCPR.journey].seat[constraint] = seatUpdate.functionalContent.seats[seatNo];

                  }
                }
                this.setCPR(cprRes);
              }
            }

            /**End Allocating Seat Acording to Acceptance Response*/

            /**Begin Updating Eligibilities Acording to Acceptance Response*/
            if (null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean && null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent && null != res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent.seats && res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean.functionalContent.seats.length > 0) {
              var cprRes = this.getCPR();
              var selectedCPR = this.getSelectedCPR();

              var eligibilityUpdate = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.AcceptedResponseBean;
              if (eligibilityUpdate && eligibilityUpdate.functionalContent && eligibilityUpdate.functionalContent.eligibilities) {
                for (var eligibilityNo in eligibilityUpdate.functionalContent.eligibilities) {
                  var referenceIDProductFlightID = eligibilityUpdate.functionalContent.eligibilities[eligibilityNo].referenceIDProductFlightID;
                  var referenceIDProductPassengerID = eligibilityUpdate.functionalContent.eligibilities[eligibilityNo].referenceIDProductPassengerID;
                  var type = eligibilityUpdate.functionalContent.eligibilities[eligibilityNo].type.code;
                  var constraint = referenceIDProductPassengerID + referenceIDProductFlightID + type;
                  if (cprRes[selectedCPR.journey].eligibility[constraint]) {
                    cprRes[selectedCPR.journey].eligibility[constraint] = eligibilityUpdate.functionalContent.eligibilities[eligibilityNo];
                  }
                }
                this.setCPR(cprRes);
              }
            }
            /**End Updating Eligibilities Acording to Acceptance Response*/

          }
          /** Begin Offloading of Pax **/
          var cpr = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          var journey = cpr[selectedCPR.journey];
          if (res.responseJSON.data.checkIn[dataId] != null &&
            res.responseJSON.data.checkIn[dataId].requestParam != null &&
            res.responseJSON.data.checkIn[dataId].requestParam.AcceptedResponseBean != null &&
            res.responseJSON.data.checkIn[dataId].requestParam.AcceptedResponseBean.functionalContent != null) {

            var acceptedResData = res.responseJSON.data.checkIn[dataId].requestParam.AcceptedResponseBean.functionalContent;
            var params = res.responseJSON.data.checkIn[dataId].parameters;
            var indicatorsToOffload = params.SITE_SSCI_OFFLD_REG_INDI;

            var cancelRequest = [];

            for (var i in acceptedResData.status) {
              var formCode = acceptedResData.status[i].status[0].listCode + "=" + acceptedResData.status[i].status[0].code;

              var custID = null;
              var flightID = null;
              if (indicatorsToOffload.search(new RegExp(formCode, "i")) != -1) {
                if (formCode == "CST=1") {
                  this._data.paxOffloadedDueToStandby = true;
                }

                if (acceptedResData.status[i].referenceIDLegPassengerLegID != null && acceptedResData.status[i].referenceIDLegPassengerPassengerID != null) {
                  var l_legID = acceptedResData.status[i].referenceIDLegPassengerLegID;

                  custID = acceptedResData.status[i].referenceIDLegPassengerPassengerID;
                  flightID = l_legID.substring(0, l_legID.length - 7);
                } else if (acceptedResData.status[i].referenceIDProductFlightID != null && acceptedResData.status[i].referenceIDProductPassengerID != null) {
                  flightID = acceptedResData.status[i].referenceIDProductFlightID;
                  custID = acceptedResData.status[i].referenceIDProductPassengerID;
                }

                var l_prodID = this.findProductidFrmflightid(journey, custID, flightID);
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

                /*Removing from the flight-to-cust and cust-to-flight*/

                this.removeCustToFlightFromSelectedCPR(flightID, custID);
                this.removeFlightToCustFromSelectedCPR(flightID, custID);
              }
            }
            if (cancelRequest.length > 0) {
              var cancelAcceptanceInput = {};
              cancelAcceptanceInput.cancelRequest = cancelRequest;
              this.cancelAcceptance(cancelAcceptanceInput);
            }

            if (this.getSelectedCPR().flighttocust.length == 0) {
              noneCheckedInFlag = true;
            }
          }
          /** End Offloading of Pax **/

          /* If none of the passengers are accepted*/
          if ((res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.AcceptedPassengers != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.AcceptedPassengers == "NONE") || noneCheckedInFlag) {

            /*
             * Incase flow is modify checkin and none got checked in, means there is some problem with
             * pax tried to checkin and, we are cancel checkin all pax as all pax checkin failed
             * */
            if (input.custCanceledlistFromMdfCheckinFlw) {
              /*Constructing input for cancel acceptance*/
              var cancelAcceptanceInput = {};
              cancelAcceptanceInput.cancelRequest = [];
              var tempProdid = input["prodIDs"].split(",");
              for (var i in tempProdid) {
                var custFlidght = this.findPaxFlightIdFrmProductId(journey, tempProdid[i]);
                var custDetai = custFlidght.split("~")[0];
                var flightDetail = custFlidght.split("~")[1];
                var temp = "";
                if (!jQuery.isUndefined(journey[custDetai].personNames) && !jQuery.isUndefined(journey[custDetai].personNames[0].givenNames)) {
                  temp += journey[custDetai].personNames[0].givenNames[0] + " ";
                }
                if (!jQuery.isUndefined(journey[custDetai].personNames) && !jQuery.isUndefined(journey[custDetai].personNames[0].surname)) {
                  temp += journey[custDetai].personNames[0].surname;
                }
                if (input.custCanceledlistFromMdfCheckinFlw.indexOf(temp) == "-1") {
                  input.custCanceledlistFromMdfCheckinFlw.push(temp);
                }
                this.constructCancelCheckInput(cancelAcceptanceInput, custDetai, flightDetail);
              }

              this.cancelAcceptance(cancelAcceptanceInput);

              jQuery(".sectionDefaultstyle").hide();
              jQuery("#regulatoryCoreErrors").next().removeClass("displayNone").addClass("displayBlock");
              this.displayErrors([{
                "localizedMessage": jQuery.substitute(this._data.pageLabels.cancelRegupd, [input.custCanceledlistFromMdfCheckinFlw.join(", ")])
              }], "regulatoryCoreErrors", "error");
              this._data.forRestrictBackClickIncludeBrowserBack = true;
              /*
               * Resetting custtoflight, flighttocust as all are going to cancel checkin
               * */
              selectedCPR.flighttocust.length = 0;
              selectedCPR.custtoflight.length = 0;
              /*End*/

              return false;
            }

            /*In Order to convert Continue Button to work as Exit checkin button in Trip Summary Page*/
            this._data.appCheckFailed = true;

            this.raiseEvent({
              "name": "page.refresh"
            })
            document.getElementById("tripSummMain").style.display = "block";
            document.getElementById("security_questions").style.display = "none";

            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

            if (this._data.paxOffloadedDueToStandby) {
              errors.push({
                "localizedMessage": errorStrings[25000128].localizedMessage
              });
            } else {
              errors.push({
                "localizedMessage": errorStrings[25000129].localizedMessage
              });
            }
            this.displayErrors(errors, "tripSummErrors", "error");
            return null;
          }

          if (res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.SecurityQuestions != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.SecurityQuestions.length > 0) {

            this.raiseEvent({
              "name": "page.refresh"
            });
            document.getElementById("tripSummMain").style.display = "none";
            document.getElementById("security_questions").style.display = "block";
          }

          if (res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.ProcessAcceptanceStatus != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.ProcessAcceptanceStatus == "SEQ_FAILURE") {

            this.raiseEvent({
              "name": "page.refresh"
            })
            document.getElementById("tripSummMain").style.display = "block";
            document.getElementById("security_questions").style.display = "none";

            errors.push({
              "localizedMessage": errorStrings[25000129].localizedMessage
            });
            this.displayErrors(errors, "tripSummErrors", "error");
          }

          if (res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.CPRIdentificationBean != null &&
            res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.CPRIdentificationBean.productDetailsBeans.length > 0) {

            var prodBeans = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.CPRIdentificationBean.productDetailsBeans;
            var temp_prodDetailsBean = {};

            for (var i in prodBeans) {
              temp_prodDetailsBean[prodBeans[i].passengerId + prodBeans[i].flightId] = prodBeans[i];
              temp_prodDetailsBean[prodBeans[i].flightId] = prodBeans[i];
            }
            this._data.CPRIdentification[this._data.selectedCPR.journey].productDetailsBeans = temp_prodDetailsBean;

          }

          /* GOOGLE ANALYTICS */

          var acceptedProductsCount = 0;
          /* Getting Updated Selected CPR to Count The No of Product actually getting accepted */
          var selectedCPR = this.getSelectedCPR();
          for(var flightIndex in selectedCPR.flighttocust){
        	  acceptedProductsCount = acceptedProductsCount + selectedCPR.flighttocust[flightIndex].customer.length;
        		  }
          if ((this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled()) && acceptedProductsCount != 0 && reallyAccepted) {

              /** GA Data*/


              /** GTM Data*/
        	  var customData = {};
        	  if(this.utils.isGTMEnabled()){
        		  customData = this.returnGTMCustomData("Check-in Confirmation",selectedCPR,l_seatPreSelected);
        	  }


              var loginOrguestUser = "";
              var headerData = this.getHeaderInfo()
              if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
                loginOrguestUser = "KFMember";
              } else {
                loginOrguestUser = "GuestLogin";
              }

              if (this.getEmbeded() && aria.core.Browser.isIOS) {

                jQuery("[name='ga_track_event']").val("Category=SSCIAppiPhoneCheckin&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(acceptedProductsCount));

                //ga('send', 'event', 'MCIAppiPhoneCheckin', loginOrguestUser, 'iPhone',paxLenght);
                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIAppiPhoneCheckin',
                  action: loginOrguestUser,
                  label: 'iPhone',
                  requireTrackPage: true,
                  value: parseInt(acceptedProductsCount),
                  data: customData
                });

              } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                // ga('send', 'event', 'MCIAppAndroidCheckin', loginOrguestUser, 'Android',paxLenght);

                jQuery("[name='ga_track_event']").val("Category=SSCIAppAndroidCheckin&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(acceptedProductsCount));

                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIAppAndroidCheckin',
                  action: loginOrguestUser,
                  label: 'Android',
                  requireTrackPage: true,
                  value: parseInt(acceptedProductsCount),
                  data: customData
                });

              } else {

                //ga('send', 'event', 'MCIWebCheckin', loginOrguestUser, 'Mobile Web',paxLenght);

                var GADetails = this._data.GADetails;
                this.__ga.trackEvent({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  category: 'SSCIWebCheckin',
                  action: loginOrguestUser,
                  label: 'Mobile Web',
                  requireTrackPage: true,
                  value: parseInt(acceptedProductsCount),
                  data: customData
                });

              }

            }
          /* GOOGLE ANALYTICS */

          /*IATCI*/
          var input = [];
          for (var flightIndex in this._data.IATCIinput) {
            for (var paxIndex in this._data.IATCIinput[flightIndex]) {
              input.push(this._data.IATCIinput[flightIndex][paxIndex]);
            }
          }
          if (input.length > 0) {
            this._data.dcsSeatIATCIforProduct = {};
            input[0].nextPage = nextPage;
            this.saveseat(input);
            this._data.IATCIinput = {};
            /*IATCI*/
          } else {
            this.appCtrl.load(nextPage);
          }
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __processAcceptance function', exception);
      }
    },

    __acceptanceOverviewCallback: function(res) {
      this.$logInfo('ModuleCtrl::Entering __acceptanceOverviewCallback function');
      try {
        /*General page load details*/
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

        var errors = [];
        var json = {};
        var warnings = [];
        var success = [];

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
              if (CPRIdentification && CPRIdentification.mciUserError != null) {
                errors.push({
                  "localizedMessage": CPRIdentification.mciUserError.errorDesc
                });
              }
              this._data.isSessionExpired = true;
              this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
              return;
            }
          }
          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          /*End General page load details*/

          /*For Including the Preallocated Seat Response To The IDC Bean*/
          var cprRes = this.getCPR();
          var selectedCPR = this.getSelectedCPR();
          if (res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.parameters.SITE_SSCI_EN_SEAT_PRE_ALC.search(/true/i) != -1) {
            var seatUpdate = res.responseJSON.data.checkIn.MSSCIAcceptanceOverview_A.requestParam.UpdateDetailsSeatStatus;
            if (seatUpdate && seatUpdate.functionalContent && seatUpdate.functionalContent.seats) {
              for (var seatNo in seatUpdate.functionalContent.seats) {
                var referenceIDLegPassengerLegID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerLegID;
                var referenceIDLegPassengerPassengerID = seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerPassengerID;
                var constraint = referenceIDLegPassengerPassengerID + referenceIDLegPassengerLegID + "SST";
                if (cprRes[selectedCPR.journey].seat[constraint]) {
                  cprRes[selectedCPR.journey].seat[constraint] = seatUpdate.functionalContent.seats[seatNo];
                }
              }
              this.setCPR(cprRes);
            }
          }

          this.appCtrl.load(nextPage);
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __acceptanceOverviewCallback function', exception);
      }
    },

    validateEmail: function(test) {
      try {
        this.$logInfo('ModuleCtrl::Entering validateEmail function');
        var x = test.indexOf('@');
        var y = test.lastIndexOf('.');

        var regEx = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
        if (!(regEx.test(test))) {
          return false;
        } else {
          return true;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in validateEmail function', exception);
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
        this.$logError('ModuleCtrl::An error occured in validatePhoneNumber function', exception);
      }
    },

    displayErrors: function(errors, errorDiv, type) {
      try {
        this.$logInfo('ModuleCtrl::Entering displayErrors function');
        Aria.loadTemplate({
          "classpath": "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
          moduleCtrl: this,
          "div": errorDiv,
          "data": {
            "messages": errors,
            "type": type
          }
        });
        jQuery('body').scrollTop("0");
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in displayErrors function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getMonth function', exception);
      }

    },

    getMonthUTC: function(date) {
      try {
        this.$logInfo('ModuleCtrl::Entering getMonth function');
        var myProp = "";
        if (date.getUTCMonth() == 0) {
          myProp = "Jan"
        };
        if (date.getUTCMonth() == 1) {
          myProp = "Feb"
        };
        if (date.getUTCMonth() == 2) {
          myProp = "Mar"
        };
        if (date.getUTCMonth() == 3) {
          myProp = "Apr"
        };
        if (date.getUTCMonth() == 4) {
          myProp = "May"
        };
        if (date.getUTCMonth() == 5) {
          myProp = "Jun"
        };
        if (date.getUTCMonth() == 6) {
          myProp = "Jul"
        };
        if (date.getUTCMonth() == 7) {
          myProp = "Aug"
        };
        if (date.getUTCMonth() == 8) {
          myProp = "Sep"
        };
        if (date.getUTCMonth() == 9) {
          myProp = "Oct"
        };
        if (date.getUTCMonth() == 10) {
          myProp = "Nov"
        };
        if (date.getUTCMonth() == 11) {
          myProp = "Dec"
        };

        return myProp;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getMonth function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getWeekDay function', exception);
      }

    },

    getWeekDayUTC: function(date) {
      try {
        this.$logInfo('ModuleCtrl::Entering getWeekDayUTC function');
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[date.getUTCDay()];
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getWeekDayUTC function', exception);
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
        this.$logError('ModuleCtrl::An error occured in refreshLocalStorage function', exception);
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
          this.storeDataLocally(newKey, "");
          this.storeDataLocally(newKey, "<img src=\"data:image/png;base64," + res.data.model.BoardingPass.boardingPassBase64[0] + "\"alt=\"${label.Title}\" width=\"280px\" height=\"280px\" />");
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
        this.$logError('ModuleCtrl::An error occured in __refreshLocalStorageCallback function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getEmbeded function', exception);
      }
    },

    getPnrType: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getPnrType function');
        //alert("pnrtype selected::::::" + this._data.pnrType);
        return this._data.pnrType;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getPnrType function', exception);
      }
    },

    setPnrType: function(selectedPnrType) {
      try {
        this.$logInfo('ModuleCtrl::Entering setPnrType function');
        this._data.pnrType = selectedPnrType;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setPnrType function', exception);
      }
    },

    submitJsonRequest: function(actionName, actionInput, callback) {
      this.$logInfo('ModuleCtrl::Entering submitJsonRequest function');
      try {
        /*
        var mainUrl;
        var actionUrl;
        mainUrl = location.href;
        mainUrl = mainUrl.split('#');
        if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
          actionUrl = mainUrl[0].replace("CPRRetrieve", actionName);
        } else if (mainUrl[0].indexOf("MWelcome") != -1) {
          actionUrl = mainUrl[0].replace("MWelcome", actionName);
        } else {
          actionUrl = mainUrl[0].replace("gettripFlow", actionName);
        }

        /*
         * taking session id from jsonresponse(it will get updated, everytime triggered request from front end,
         * and as soon as session expires the triggered request return to retrieve page
         * along with that gives new session id) to get into new session as soon as session expires happens
         * flow: from retrieval of PNR, during SSCI flow any where session expires happen
         * it load retrive page and show session expires err message, usually happens if kept app ideal for more than 10m
         * previously: var sessionId = this.getSessionId(); -- was having prob like not updeting with new session id as soon as current session expires
         *
         * Some info: web.xml set session time out in Milli seconds, in MCi it is 600ms
         * servlet isAlive() method tells session expires.
         *
        if (jsonResponse != undefined && jsonResponse.data != undefined && jsonResponse.data.framework != undefined && !jQuery.isUndefined(jsonResponse.data.framework.sessionId)) {
          var sessionId = jsonResponse.data.framework.sessionId;
        } else {
          var sessionId = null;
        }

        if (sessionId && sessionId != null) {
          var action = ".action;jsessionid=" + sessionId;
          actionUrl = actionUrl.replace(".action", action);
        }
        //actionUrl = actionUrl + "&result=json";
        //this._data.genErrorJson = null;
        //actionUrl=actionName+".action";
        var _this = this;
        var query = 'result=json&data=' + JSON.stringify(actionInput);
        var request = modules.view.merci.common.utils.MCommonScript.navigateRequest(query, actionUrl, callback);
        request.isCompleteURL = true;
        modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);*/

        var query = 'result=json&data=' + JSON.stringify(actionInput);
        var request = {
          parameters: query,
          action: actionName + ".action",
          loading: true,
          expectedResponseType: 'json',
          defaultParams: true,
          cb: callback,
          appendSession: true
        }

        modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in submitJsonRequest function', exception);
      }
    },


    callBack: function(res, callBack) {
      try {
        this.$logInfo('ModuleCtrl::Entering callBack function');
        eval("this." + callBack.fn + "(" + res.responseText + "," + callBack.args + ")");
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in callBack function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getCountryCallingCodes function', exception);
      }
    },

    getModuleData: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getModuleData function');
      if (this.data == null) {
        // init
        this.__initData();
      }
      if (jsonResponse.data.framework.sessionId || jsonResponse.data.framework.sessionId == null) {
        this.setSessionId(jsonResponse.data.framework.sessionId);
      }
      var temp = this.data.checkIn;
      if (temp.MSSCITripList_A != null && temp.MSSCITripList_A.requestParam != null && temp.MSSCITripList_A.requestParam.CPRIdentification != null && temp.MSSCITripList_A.requestParam.CPRIdentification.functionalContent != null && temp.MSSCITripList_A.requestParam.CPRIdentification.functionalContent.journeies != null && temp.MSSCITripList_A.requestParam.CPRIdentification.functionalContent.journeies.length > 0) {
        //jsonResponse.data.checkIn.MSSCITripList_A.requestParam.CPRIdentification=this.ReConstructOriginalCPR(jsonResponse.data.checkIn.MSSCITripList_A.requestParam.CPRIdentification);
        this.data.checkIn.MSSCITripList_A.requestParam.CPRIdentification = this.ReConstructOriginalCPR(jsonResponse.data.checkIn.MSSCITripList_A.requestParam.CPRIdentification);
        this._data.landingPageDetail = "MSSCITripList_A";
        this._data.isAcceptanceConfirmation = false;
        this._data.forRestrictBackClickIncludeBrowserBack = false;
      } else if (temp.MSSCISelectFlights_A != null && temp.MSSCISelectFlights_A.requestParam != null && temp.MSSCISelectFlights_A.requestParam.CPRIdentification != null && temp.MSSCISelectFlights_A.requestParam.CPRIdentification.functionalContent != null && temp.MSSCISelectFlights_A.requestParam.CPRIdentification.functionalContent.journeies != null && temp.MSSCISelectFlights_A.requestParam.CPRIdentification.functionalContent.journeies.length > 0) {
        this.data.checkIn.MSSCISelectFlights_A.requestParam.CPRIdentification = this.ReConstructOriginalCPR(jsonResponse.data.checkIn.MSSCISelectFlights_A.requestParam.CPRIdentification);
        this._data.landingPageDetail = "MSSCISelectFlights_A";
        this._data.isAcceptanceConfirmation = false;
        this._data.forRestrictBackClickIncludeBrowserBack = false;
      } else if (temp.MSSCICPRRetrieveMultiPax_A != null && temp.MSSCICPRRetrieveMultiPax_A.requestParam != null && temp.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification != null && temp.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification.functionalContent != null && temp.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification.functionalContent.journeies != null && temp.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification.functionalContent.journeies.length > 0) {
        this.data.checkIn.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification = this.ReConstructOriginalCPR(jsonResponse.data.checkIn.MSSCICPRRetrieveMultiPax_A.requestParam.CPRIdentification);
        this._data.landingPageDetail = "MSSCICPRRetrieveMultiPax_A";
        this._data.isAcceptanceConfirmation = false;
        this._data.forRestrictBackClickIncludeBrowserBack = false;
      } else if (temp.MSSCITripOverview_A != null && temp.MSSCITripOverview_A.requestParam != null && temp.MSSCITripOverview_A.requestParam.CPRIdentification != null && temp.MSSCITripOverview_A.requestParam.CPRIdentification.functionalContent != null && temp.MSSCITripOverview_A.requestParam.CPRIdentification.functionalContent.journeies != null && temp.MSSCITripOverview_A.requestParam.CPRIdentification.functionalContent.journeies.length > 0) {
        this.data.checkIn.MSSCITripOverview_A.requestParam.CPRIdentification = this.ReConstructOriginalCPR(jsonResponse.data.checkIn.MSSCITripOverview_A.requestParam.CPRIdentification);
        this._data.landingPageDetail = "MSSCITripOverview_A";
        this._data.isAcceptanceConfirmation = false;
        this._data.forRestrictBackClickIncludeBrowserBack = false;
      }

      return this.data;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getModuleData function', exception);
      }
    },

    getLandingPageDetail: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getLandingPageDetail function');
        return this._data.landingPageDetail;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getLandingPageDetail function', exception);
      }
    },

    __onHashChange: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering __onHashChange function');
      var hashPage = aria.utils.HashManager.getHashString();
      $('#ui-datepicker-div').hide();
      modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

      /*
       * For mobile where to show always top of page
	   * PTR 09148324
       * */
      window.scrollTo(0,0);

      /* Once land on to confirmation page in reguler flow, stoping user on click back
       * OR
       * Once modify checkin flow, cancel checkin happens for all pax, stop user to click back
       *  */
      if ((this._data.isAcceptanceConfirmation && hashPage == "merci-checkin-MSSCIAcceptanceOverview_A") || (this._data.forRestrictBackClickIncludeBrowserBack && hashPage == "merci-checkin-MSSCITripOverview_A")) {
        /*This will remove the local history so that user can't go back*/
        window.location.replace(window.location.href.split("#")[0] + "#merci-checkin-MSSCICheckinIndex_A");

      }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __onHashChange function', exception);
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
        this.$logError('ModuleCtrl::An error occured in setCPR function', exception);
      }
    },

    /**
     * getCPR
     * This method get the current CPR.
     */
    getCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCPR function');
        if (!jQuery.isUndefined(this._data.CPRIdentification)) {
          return this._data.CPRIdentification;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getCPR function', exception);
      }
    },

    /**
     * Converts a site parameter string value into a boolean
     */
    booleanValue: function(value) {
      try {
        this.$logInfo('ModuleCtrl::Entering booleanValue function');
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

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in booleanValue function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getSuccess function', exception);
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
        this.$logError('ModuleCtrl::An error occured in setSuccess function', exception);
      }
    },

    getListOfCheckedItems: function(inputClass, attributeName) {
      try {
        this.$logInfo('ModuleCtrl::Entering getListOfCheckedItems function');
        var sList = [];
        var data = this.getCPR();
        var inputElements = document.getElementsByTagName('input');
        for (var i = 0; i < inputElements.length; i++) {
          if (inputElements[i].className == inputClass && inputElements[i].checked) {
            sList.push(inputElements[i].getAttribute(attributeName));
          }
        }
        /*if(sList.length == 0)
      sList.push("SQ-2-20140320");*/
        if (inputClass == "flightSelCheckBox") {
          this._data.selectedCPR.product = sList;

          /*Constructing flights to cust structure(taking only non checked in flights and customer)*/
          var temp = this._data.selectedCPR;
          temp.flighttocust = [];
          var temp_cust = [];
          for (var i in temp.product) {
            for (var j in temp.customer) {
              if (data[temp.journey][temp.customer[j]].passengerTypeCode != "INF") {
                if (data[temp.journey][temp.customer[j]].accompaniedByInfant != null && data[temp.journey][temp.customer[j]].accompaniedByInfant == true) {
                  var infantID = this.findInfantIDForCust(temp.product[i], temp.customer[j]);
                  /*
                   * Only If Both Adult and associated infant are not checkedin And Have valid Ticket
                   * */
                  if (!data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].paxTicketEligible && data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].acceptanceAllowed) {
                    if (!data[temp.journey].productDetailsBeans[infantID + temp.product[i]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[infantID + temp.product[i]].paxTicketEligible) {
                      temp_cust.push(temp.customer[j]);
                      temp_cust.push(infantID);
                    }

                  }
                } else {
                  if (!data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].paxTicketEligible && data[temp.journey].productDetailsBeans[temp.customer[j] + temp.product[i]].acceptanceAllowed) {
                    temp_cust.push(temp.customer[j]);
                  }
                }
              }
            }
            if (temp_cust.length > 0) {
              temp.flighttocust.push({
                product: temp.product[i],
                customer: temp_cust
              });
            }
            temp_cust = [];
          }

          /*Constructing cust to flights structure(taking only non checked in cust and flights)*/
          var temp = this._data.selectedCPR;
          temp.custtoflight = [];
          var temp_flight = [];
          for (var i in temp.customer) {
            for (var j in temp.product) {
              if (data[temp.journey][temp.customer[i]].passengerTypeCode != "INF") {
                if (data[temp.journey][temp.customer[i]].accompaniedByInfant != null && data[temp.journey][temp.customer[i]].accompaniedByInfant == true) {
                  var infantID = this.findInfantIDForCust(temp.product[j], temp.customer[i]);
                  /*
                   * Only If Both Adult and associated infant are not checkedin And Have valid Ticket and adult Customer Eligibility Acceptance is allowed
                   * */
                  if (!data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxTicketEligible && data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].acceptanceAllowed) {
                    if (!data[temp.journey].productDetailsBeans[infantID + temp.product[j]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[infantID + temp.product[j]].paxTicketEligible) {
                      temp_flight.push(temp.product[j]);
                    }
                  }

                } else {
                  if (!data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxTicketEligible && data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].acceptanceAllowed) {
                    temp_flight.push(temp.product[j]);
                  }
                }
              } else {
                var adultID = this.findInfantIDForCust(temp.product[j], temp.customer[i]);
                /*
                 * Only If Both Adult and associated infant are not checkedin And Have valid Ticket and adult Customer Eligibility Acceptance is allowed
                 * */
                if (!data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[temp.customer[i] + temp.product[j]].paxTicketEligible) {
                  if (!data[temp.journey].productDetailsBeans[adultID + temp.product[j]].paxCheckedInStatusInCurrProd && data[temp.journey].productDetailsBeans[adultID + temp.product[j]].paxTicketEligible && data[temp.journey].productDetailsBeans[adultID + temp.product[j]].acceptanceAllowed) {
                    temp_flight.push(temp.product[j]);
                  }
                }


              }
            }
            if (temp_flight.length > 0) {
              temp.custtoflight.push({
                customer: temp.customer[i],
                product: temp_flight
              });
            }
            temp_flight = [];
          }

        } else if (inputClass == "custSelCheckBox") {
          this._data.selectedCPR.customer = sList;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getListOfCheckedItems function',
          exception);
      }

    },

    getSelectedCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedCPR function');
        if (!jQuery.isUndefined(this._data.selectedCPR)) {
          return this._data.selectedCPR;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSelectedCPR function', exception);
      }
    },
    /*Function Called In Manage Checkin Flow Of trip Overview Page*/
    setSelectedCPR: function(selectedCPR) {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedCPR function');
        if (selectedCPR) {
          this._data.selectedCPR = selectedCPR;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSelectedCPR function', exception);
      }
    },
    getSelectedCPRFromTripOverview: function() {
        try {
          this.$logInfo('ModuleCtrl::Entering getSelectedCPRFromTripOverview function');
          if (!jQuery.isUndefined(this._data.selectedCPRFromTripOverview)) {
            return this._data.selectedCPRFromTripOverview;
          } else {
            return null;
          }
        } catch (exception) {
          this.$logError('ModuleCtrl::An error occured in getSelectedCPRFromTripOverview function', exception);
        }
      },
      /*Function Called In Manage Checkin Flow Of trip Overview Page*/
      setSelectedCPRFromTripOverview: function(selectedCPRFromTripOverview) {
        try {
          this.$logInfo('ModuleCtrl::Entering setSelectedCPRFromTripOverview function');
            this._data.selectedCPRFromTripOverview = selectedCPRFromTripOverview;
        } catch (exception) {
          this.$logError('ModuleCtrl::An error occured in setSelectedCPRFromTripOverview function', exception);
        }
      },
    /**
     * journeySelection
     * This method is the called From Trip List page on clicking on a trip button.
     */
    journeySelection: function(selJrny) {
      try {
        this.$logInfo('ModuleCtrl::Entering journeySelection function');
        this.submitJsonRequest("JourneySelectionAction", selJrny, {
          scope: this,
          fn: this.__journeySelectionCallback,
          args: selJrny
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in journeySelection function', exception);
      }
    },
    /**
     * __journeySelectionCallback
     * This method is the callback method for the journeySelection action.
     */
    __journeySelectionCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __journeySelectionCallback function');
        /* Start Code For Refreshing the Selected CPR*/
        this._data.selectedCPR.customer = [];
        this._data.selectedCPR.product = [];
        this._data.appCheckFailed = false;
        this._data.selectedCustFlightInformations = {};
        //IATCI
        this._data.dcsSeatIATCIforProduct = {};
        this._data.IATCIinput = {};
        this._data.IATCISeatSaveFailure = false;
        //IATCI
        /* End Of Code For Refreshing the Selected CPR*/
        /* Start Code For Resetting the FlightSelection Page Error*/
        this.setIsSelectFlightPageError(false);
        /* End Of Code For Resetting the FlightSelection Page Error*/
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              if (res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.SessionExpired == "SESSION_EXPIRED") {
                this._data.isSessionExpired = true;
              }
            }

          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.CPRIdentification = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);

          }
          this.appCtrl.load(nextPage);
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __journeySelectionCallback function', exception);
      }
    },

    /**
     * tripOvrwCheckIn
     * This method is the called From Trip overview page on clicking checkin button.
     */
    tripOvrwCheckIn: function(args) {
      try {
        this.$logInfo('ModuleCtrl::Entering tripOvrwCheckIn function');
        this.submitJsonRequest("TripOvrwCheckInAction", "", {
          scope: this,
          fn: this.__tripOvrwCheckInCallback
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in tripOvrwCheckIn function', exception);
      }
    },

    /**
     * __tripOvrwCheckInCallback
     * This method is the callback method for the paxflightSelection action.
     */
    __tripOvrwCheckInCallback: function(res) {
      try {
        this.$logInfo('ModuleCtrl::Entering __tripOvrwCheckInCallback function');
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (dataId == 'MSSCICheckinIndex_A') {
            if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
              if (res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.SessionExpired == "SESSION_EXPIRED") {
                this._data.isSessionExpired = true;
              }
            }
          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.CPRIdentification = res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification;
            json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

            // navigate to next page
            //this.moduleCtrl.navigate(null, nextPage);

          }
          this.appCtrl.load(nextPage);
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __paxflightSelectionCallback function', exception);
      }
    },
    /** passengerDetailsLoad
     * To load edit passenger details
     */

    passengerDetailsLoad: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering passengerDetailsLoad function');
        this.submitJsonRequest("IPassengerDetailsUpdate", "", {
          scope: this,
          fn: this.__passengerDetailsCallback
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in passengerDetailsLoad function', exception);
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
        if (dataId == "MSSCICheckinIndex_A" || dataId == "MSSCICheckinIndex") //In case of a session timeout
        {
          this._data.isSessionExpired = true;
          this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
        } else {
          this._data.bannerInfo = res.responseJSON.data.checkIn.MSSCIPassengerDetails_A.requestParam.ProfileBean;
          this._data.setErrorStrings = res.responseJSON.data.checkIn.MSSCIPassengerDetails_A.errorStrings;
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];
          this.appCtrl.load(nextPage);
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __passengerDetailsCallback function', exception);
      }
    },

    /**
     * updateFQTV
     * This method is used to update the FQTV details.
     */
    updateFQTV: function(editFqtvInput, flow) {
      try {
        this.$logInfo('ModuleCtrl::Entering updateFQTV function');
        jQuery("#initiateandEditErrors").disposeTemplate();
        editFqtvInput[0].service = "fqtv_update";
        editFqtvInput[0].flow = flow;
        this.submitJsonRequest("IUpdateFQTV", editFqtvInput, {
          scope: this,
          fn: this.__updateFQTVCallback,
          args: editFqtvInput
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in updateFQTV function', exception);
      }
    },

    /**
     * __updateFQTVCallback
     * This method is the callback method for the updateFQTV action.
     */

    __updateFQTVCallback: function(res, editFqtvInput) {
      this.$logInfo('ModuleCtrl::Entering __updateFQTVCallback function');
      try {
      modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
      jQuery('#overlayCKIN').hide();
      jQuery('#splashScreen').hide();
      var tempeditFqtvInput = editFqtvInput;
      //Added For Seesion Expired
      if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

        // getting next page id
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          if (this.getCPR() != null) {
            res.responseJSON.data.checkIn[dataId].requestParam.CPRIdentification = this.getCPR();
        }

        if (dataId == 'MSSCICheckinIndex_A') {
          if (res.responseJSON.data.checkIn && res.responseJSON.data.checkIn.MSSCICheckinIndex_A && res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam) {
            var CPRIdentification = res.responseJSON.data.checkIn.MSSCICheckinIndex_A.requestParam.CPRIdentification;
            if (CPRIdentification && CPRIdentification.mciUserError != null) {
              errors.push({
                "localizedMessage": CPRIdentification.mciUserError.errorDesc
              });
            }

            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
            return;

          }
        }
      }
      //End //Added For Seesion Expired Code
      var errors = [];

      if (dataId == 'MSSCIPassengerDetails_A') {

        //For showing error
        var uiErrors = jsonResponse.data.checkIn[dataId].errorStrings;
        errors.push({
          "localizedMessage": uiErrors[2130400].localizedMessage
        });
        this.displayErrors(errors, "initiateandEditErrors", "error");

      } else {
        /*For updating CPR identification with updated FQTV*/
        var successCust = "";
        var failureCust = "";
        var cpr = this.getCPR();
        var selectedCPR = this.getSelectedCPR();
        var journey = cpr[selectedCPR.journey];
        this._data.successfulFQTVDetails = res.responseJSON.data.checkIn[dataId].requestParam.UpdateDetailsStatus;


        /*For Checking Whether FQTV got Updated or not*/
        for (var index in tempeditFqtvInput) {
          var fqtvReq = tempeditFqtvInput[index];
          for (var index2 in this._data.successfulFQTVDetails) {
            var fqtvRes = this._data.successfulFQTVDetails[index2];
            if (fqtvReq.custID == fqtvRes.custID) {
              var regExpression = new RegExp("^" + fqtvReq.fqtvNumber + "$", "i");
              if ((regExpression.test(fqtvRes.fqtvNumber)) && (fqtvReq.fqtvProgId == fqtvRes.fqtvProgId)) {
                if (successCust == "") {
                  successCust = journey[fqtvReq.custID].personNames[0].givenNames[0] + " " + journey[fqtvReq.custID].personNames[0].surname;
                } else {
                  successCust = successCust + "," + journey[fqtvReq.custID].personNames[0].givenNames[0] + " " + journey[fqtvReq.custID].personNames[0].surname;
                }
              } else {
                if (failureCust == "") {
                  failureCust = journey[fqtvReq.custID].personNames[0].givenNames[0] + " " + journey[fqtvReq.custID].personNames[0].surname;
                } else {
                  failureCust = failureCust + "," + journey[fqtvReq.custID].personNames[0].givenNames[0] + " " + journey[fqtvReq.custID].personNames[0].surname;
                }
              }
            }
          }
        }
        //For showing success
        var success = [];
        var uiErrors = jsonResponse.data.checkIn[this._data.landingPageDetail].errorStrings;
        if (successCust != "") {
          success.push({
            "localizedMessage": "<b>" + successCust + " : </b>" + uiErrors[21300051].localizedMessage
          });
          this.setSuccess(success);
        }
        if (failureCust != "") {
          errors.push({
            "localizedMessage": "<b>" + failureCust + " : </b>" + uiErrors[21400073].localizedMessage
          });
          this.setErrors(errors);
        }
        this.appCtrl.load(nextPage);

      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __updateFQTVCallback function', exception);
      }

    },

    dangerousGoods_load: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering dangerousGoods_load function');
        var dummyInput = "";
        this.submitJsonRequest("SSCIDangerousGoods", dummyInput, {
          scope: this,
          fn: this.__dangerousGoodsCallback
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in dangerousGoods_load function', exception);
      }
    },

    __dangerousGoodsCallback: function(res, dummyInput) {
      this.$logInfo('ModuleCtrl::Entering __dangerousGoodsCallback function')
      try {
        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {
          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          this.appCtrl.load(nextPage);
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __dangerousGoodsCallback function', exception);
      }
    },

    /**
     * setPassengerDetails
     * This method store the current passenger email and phone details.
     */
    setPassengerDetails: function(item) {
      try {
        this.$logInfo('ModuleCtrl::Entering setPassengerDetails function');
        this._data.passengerDetails = item;
        for (var i in this._data.passengerDetails) {
          if (this._data.passengerDetails[i].phoneNumber) {
            this._data.passengerDetails[i]["areaCode"] = item[i].phoneNumber.substring(0, 4);
            this._data.passengerDetails[i]["phoneNumberOnly"] = item[i].phoneNumber.substring(4, item[i].phoneNumber.length);
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
        this.$logError('ModuleCtrl::An error occured in getPassengerDetails function', exception);
      }
    },


    /**
     * manageCheckin
     * This method is used to display the confirmation.
     */
    manageCheckin: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering manageCheckin function');
        this.submitJsonRequest("SSCIManageCheckin", "", {
          scope: this,
          fn: this.__manageCheckinCallback
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in manageCheckin function', exception);
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
          if (dataId == "MSSCICheckinIndex_A" || dataId == "MSSCICheckinIndex") //In case of a session timeout
          {
            this._data.isSessionExpired = true;
            this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
          } else {
            // setting data for next page
            var json = this.getModuleData();
            this._data.bannerInfo = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.requestParam.ProfileBean;
            this._data.setErrorStrings = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
            this._data.errorStrings = res.responseJSON.data.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
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

    getEmailList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getEmailList function');
      var paxDetails = this._data.passengerDetails;
      var emailList = [];
      if (paxDetails != null) {
        for (i = 0; i < paxDetails.length; i++) {
          if (paxDetails[i].email != "")
            emailList.push(paxDetails[i].email);
        }
      }
      return emailList;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getEmailList function', exception);
      }
    },

    /**
     * setSelectedEditpax
     * This method store the current passenger details.
     */
    setSelectedEditpax: function(item) {

      try {
        this.$logInfo('ModuleCtrl::Entering setSelectedEditpax function');

        this._data.selectedEditpax = item;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setSelectedEditpax function', exception);
      }
    },

    /**
     * getSelectedEditpax
     * This method get the current passenger details.
     * flag == inx == return index else cust id
     */
    getSelectedEditpax: function(flag) {
      try {
        this.$logInfo('ModuleCtrl::Entering getSelectedEditpax function');
        if (!jQuery.isUndefined(this._data.selectedEditpax)) {
          if (flag == "inx") {
            return this._data.selectedEditpax.index;
          } else {
            return this._data.selectedEditpax.selectedPax;
          }

        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSelectedEditpax function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getWarnings function', exception);
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
        this.$logError('ModuleCtrl::An error occured in setWarnings function', exception);
      }
    },
    /**
     * getErrors
     * This method get the Errors if any.
     */
    getErrors: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getErrors function');
        if (!jQuery.isUndefined(this._data.Errors)) {
          return this._data.Errors;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getErrors function', exception);
      }
    },

    /**
     * setErrors
     * This method set the Errors if any.
     */
    setErrors: function(error) {
      try {
        this.$logInfo('ModuleCtrl::Entering setErrors function');
        if (error == "") {
          this._data.Errors = null;
        } else {
          this._data.Errors = error;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setErrors function', exception);
      }
    },
    /**
     * getFrequentTravelerNumber
     * This method get the FQTV for the customer.
     *
     * IF Phone FLAG IS THERE THEN CALLING TO PREFILL PHONE, email(check passenger details page for reference how getting phone , email by giving phone flag) OTHERVISE CALLING TO PREFILL FQTV
     * customerID -- CUSTOMER ID
     *
     */
    getPaxDetailsForPrefill: function(customerID, Phone) {
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
          //First preference for Email and phonenumber
          if (this._data.passengerDetails[customerID]) {
            this.storeContactDetailsinLocal(customerID, this._data.passengerDetails[customerID].phoneNumber, this._data.passengerDetails[customerID].email);
            return this._data.passengerDetails[customerID].phoneNumber + "~" + this._data.passengerDetails[customerID].email;
          }

          /*Second preference for details is profile bean*/
          if (!jQuery.isUndefined(this._data.bannerInfo)) {
            var banner = this._data.bannerInfo;

            /*Header name details*/
            var customer = this._data.CPRIdentification[this._data.selectedCPR.journey][customerID];

            var givenName = "";
            if (customer && customer.personNames.length > 0 && customer.personNames[0].givenNames[0].length > 0) {
              givenName = customer.personNames[0].givenNames[0];
            }

            var surName = "";
            if (customer && customer.personNames.length > 0 && customer.personNames[0].surname) {
              surName = customer.personNames[0].surname;
            }


            if (banner.firstName == givenName && banner.lastName == surName) {
              var phoneNumber = "";
              var emailAddr = "";
              if (banner.areaCode && banner.phoneNumber && banner.areaCode != "" && banner.phoneNumber != "") {
                phoneNumber = banner.areaCode + banner.phoneNumber;
              }
              emailAddr = (banner.emailAddress && banner.emailAddress != "") ? banner.emailAddress : "";
              this.storeContactDetailsinLocal(customerID, phoneNumber, emailAddr);
              return phoneNumber + "~" + emailAddr;
            }
          }

          /*Third preference is actual details i.e from cpr identification */
          if (!jQuery.isUndefined(this._data.CPRIdentification)) {
            var contactDetailList = this._data.CPRIdentification[this._data.selectedCPR.journey].customerDetailsBeans[customerID].contactDetails;
            var phoneNumber = "";
            var emailAddr = "";
            if (null != contactDetailList && 0 < contactDetailList.length) {
              for (var contactIndex in contactDetailList) {
                var contactDetail = contactDetailList[contactIndex];
                if (contactDetail.type.search(/PHONE/i) != '-1') {
                  phoneNumber = (contactDetail.value && contactDetail.value != "") ? contactDetail.value : "";
                  phoneNumber = phoneNumber.replace("+", "00");
                } else if (contactDetail.type.search(/EMAIL/i) != '-1') {
                  emailAddr = (contactDetail.value && contactDetail.value != "") ? contactDetail.value : "";
                }
              }

            }

            if (phoneNumber != '' && emailAddr != '') {
              this.storeContactDetailsinLocal(customerID, phoneNumber, emailAddr);
              return phoneNumber + "~" + emailAddr;
            } else {
              /*Start Fourth preference is From The Local Storage */
              var l_contactDetail = "~";
              var l_phoneNumber = "";
              var l_emailAddr = "";
              var returnValue = "~";
              if (this.getContactDetailsinLocal(customerID) != "~") {
                l_contactDetail = this.getContactDetailsinLocal(customerID);
                var l_phoneNumber = l_contactDetail.split("~")[0];
                var l_emailAddr = l_contactDetail.split("~")[1];
              }
              if (phoneNumber == "" && emailAddr != "") {
                returnValue = l_phoneNumber + "~" + emailAddr;
              } else if (phoneNumber != "" && emailAddr == "") {
                returnValue = phoneNumber + "~" + l_emailAddr;
              } else if (phoneNumber == "" && emailAddr == "") {
                returnValue = l_phoneNumber + "~" + l_emailAddr;
              }
              if (returnValue != "~") {
                this.storeContactDetailsinLocal(customerID, returnValue.split("~")[0], returnValue.split("~")[1]);
                return returnValue;
              }
              /*End Fourth preference is From The Local Storage */
            }
          }
          return "";
        }

        //First Preference for prefill ffnumber
        if (!jQuery.isUndefined(this._data.CPRIdentification)) {
          var temp = this._data.CPRIdentification[this._data.selectedCPR.journey][customerID];
          //Check customerlevel for customer details -- more priority

          if (temp != null && temp.frequentFlyer && temp.frequentFlyer.length > 0 && !jQuery.isUndefined(this._data.operatingAirline) && !jQuery.isUndefined(this._data.frequentFlyerList)) {
            var l_frequentFlyerList = this._data.frequentFlyerList.join(",");
            var l_operatingAirline = this._data.operatingAirline;
            var l_airlineCodeReturnValue = null;
            var l_airlineCodeFound = false;
            var l_airlineCodeReturnValueII = null;
            var l_airlineCodeFoundII = false;
            var l_airlineCodeFoundIIOperatingAirline = false;
        	for(var l_frequentFlyerIndex in temp.frequentFlyer){
                if (!jQuery.isUndefined(temp.frequentFlyer[l_frequentFlyerIndex].customerLoyalty) && !jQuery.isUndefined(temp.frequentFlyer[l_frequentFlyerIndex].customerLoyalty.programID) && !jQuery.isUndefined(temp.frequentFlyer[l_frequentFlyerIndex].customerLoyalty.membershipID)) {
                    var FQTV = temp.frequentFlyer[l_frequentFlyerIndex].customerLoyalty;
                	for(var l_airlineNameCodeIndex in l_frequentFlyerList.split(",")){
                		var l_airlineNameCode = l_frequentFlyerList.split(",")[l_airlineNameCodeIndex];
                        if(l_airlineNameCode!= ""){
                          var airlineCode = l_airlineNameCode.split(":")[0];
                          var airlineName = l_airlineNameCode.split(":")[1];
                          /*First Condition FF should Matching in the CofiguredFFList In Order to display on Passenger Details Drop Down*/
                          if(FQTV.programID.toUpperCase().search(airlineCode.toUpperCase()) != '-1'){
                        	  /*First Most Preferance to FF Number refrenced to Product since its more updated than the refrence with only passenfer ID*/
                        	  if(!jQuery.isUndefined(temp.frequentFlyer[l_frequentFlyerIndex].referenceIDProductPassengerID)){
	                        	  /*Second Most Preferance to FF Matching with Operating Airline*/
	                              if(FQTV.programID.toUpperCase().search(l_operatingAirline.toUpperCase()) != '-1'){
	                              	//temp.frequentFlyer[0].customerLoyalty = FQTV; //Updating zeroth element with most Prefered Value
	                            	l_airlineCodeFound = true;
	                              	return FQTV.programID + "~" + FQTV.membershipID;
	                              }else if(l_airlineCodeReturnValue == null){ //Not To Update Again the Value of l_airlineCodeReturnValue
	                            	  l_airlineCodeFound = true;
		                        	  l_airlineCodeReturnValue = FQTV;
	                              }
                        	  }else if(!l_airlineCodeFoundIIOperatingAirline){
                        		  /*Second Most Preferance to FF Matching with Operating Airline*/
	                              if(FQTV.programID.toUpperCase().search(l_operatingAirline.toUpperCase()) != '-1'){
	                              	//temp.frequentFlyer[0].customerLoyalty = FQTV; //Updating zeroth element with most Prefered Value
	                            	l_airlineCodeFoundIIOperatingAirline = true;
	                            	l_airlineCodeFoundII = true;
	                            	l_airlineCodeReturnValueII = FQTV;
	                              }else if(l_airlineCodeReturnValueII == null){
	                                l_airlineCodeFoundII = true;
		                            l_airlineCodeReturnValueII = FQTV;
	                              }
                        	  }
                          }
                        }
            }

          }
        }
        	if(l_airlineCodeFound){
        		//temp.frequentFlyer[0].customerLoyalty = l_airlineCodeReturnValue//Updating zeroth element with most Prefered Value
        		return l_airlineCodeReturnValue.programID + "~" + l_airlineCodeReturnValue.membershipID;
        	}else if(l_airlineCodeFoundII){
        		return l_airlineCodeReturnValueII.programID + "~" + l_airlineCodeReturnValueII.membershipID;
        	}
          }
        }

        /*Third Preference for prefill ffnumber
                    if(!jQuery.isUndefined(this._data.bannerInfo))
                    {
                     var temp=this._data.bannerInfo;

                     if(temp != null && temp.ffNumber && temp.firstName == this._data.CPRIdentification.customerLevel[customer].otherPaxDetailsBean[0].givenName && temp.lastName == this._data.CPRIdentification.customerLevel[customer].customerDetailsSurname)
                     {
                       return "SQ~"+temp.ffNumber;
                     }
                    }*/

        return "";
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getPaxDetailsForPrefill function',
          exception);
      }
    },

    storeContactDetailsinLocal: function(customerID, phoneNumber, emailAddr) {
      this.$logInfo('ModuleCtrl::Entering storeContactDetailsinLocal function');
      try {
        var customerName = this._data.CPRIdentification[this._data.selectedCPR.journey][customerID].personNames[0].givenNames[0] +
          this._data.CPRIdentification[this._data.selectedCPR.journey][customerID].personNames[0].surname;
        var keyFound = false;
        var that = this;
        this.utils.getStoredItemFromDevice(merciAppData.DB_CONTACTDETAILS, function(result) {
          var jsonContactDetails = {};
          if (result && result != "") {
            if (typeof result === 'string') {
              var jsonContactDetails = JSON.parse(result);
            } else {
              var jsonContactDetails = (result);
            }
            if (!that.utils.isEmptyObject(jsonContactDetails)) {
              var contactDetailsData = jsonContactDetails["passengerDetailsArray"];
              contactDetailsData[customerName] = {};
              contactDetailsData[customerName]["PHONE"] = btoa(phoneNumber);
              contactDetailsData[customerName]["EMAIL"] = btoa(emailAddr);
              jsonContactDetails["passengerDetailsArray"] = contactDetailsData;
              that.utils.storeLocalInDevice(merciAppData.DB_CONTACTDETAILS, jsonContactDetails, "overwrite", "json");
            } else if ((this.utils.isEmptyObject(jsonContactDetails)) || (jsonContactDetails == null)) {
              var contactDetailsData = {};
              contactDetailsData[customerName] = {};
              contactDetailsData[customerName]["PHONE"] = btoa(phoneNumber);
              contactDetailsData[customerName]["EMAIL"] = btoa(emailAddr);
              jsonContactDetails["passengerDetailsArray"] = contactDetailsData;
              keyFound = false;
              that.utils.storeLocalInDevice(merciAppData.DB_CONTACTDETAILS, jsonContactDetails, "overwrite", "json");

            }
          } else {
            if ((that.utils.isEmptyObject(result)) || (result == null)) {
              var contactDetailsData = {};
              contactDetailsData[customerName] = {};
              contactDetailsData[customerName]["PHONE"] = btoa(phoneNumber);
              contactDetailsData[customerName]["EMAIL"] = btoa(emailAddr);
              jsonContactDetails["passengerDetailsArray"] = contactDetailsData;
              keyFound = false;
              that.utils.storeLocalInDevice(merciAppData.DB_CONTACTDETAILS, jsonContactDetails, "overwrite", "json");
            }

          }
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeContactDetailsinLocal function', exception);
      }
    },

    getContactDetailsinLocal: function(customerID) {
      this.$logInfo('ModuleCtrl::Entering getContactDetailsinLocal function');
      try {
        var returnValue = "~";
        var phoneValue = "";
        var emailValue = "";
        var customerName = this._data.CPRIdentification[this._data.selectedCPR.journey][customerID].personNames[0].givenNames[0] +
          this._data.CPRIdentification[this._data.selectedCPR.journey][customerID].personNames[0].surname;
        var keyFound = false;
        var that = this;
        this.utils.getStoredItemFromDevice(merciAppData.DB_CONTACTDETAILS, function(result) {
          var jsonContactDetails = {};
          if (result && result != "") {
            if (typeof result === 'string') {
              var jsonContactDetails = JSON.parse(result);
            } else {
              var jsonContactDetails = (result);
            }
            if (!that.utils.isEmptyObject(jsonContactDetails)) {
              var contactDetailsData = jsonContactDetails["passengerDetailsArray"];
              for (var key in contactDetailsData) {
                if (customerName == key) {
                  keyFound = true;
                  if (contactDetailsData[customerName].PHONE) {
                    phoneValue = atob(contactDetailsData[customerName].PHONE);
                  }
                  if (contactDetailsData[customerName].EMAIL) {
                    emailValue = atob(contactDetailsData[customerName].EMAIL);
                  }
                  returnValue = phoneValue + "~" + emailValue;
                }
              }
            }
          }
        });
        return returnValue;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeContactDetailsinLocal function', exception);
      }
    },

    updateFlightSelectedCPR: function(value) {
      this.$logInfo('ModuleCtrl::Entering updateFlightSelectedCPR function');
      try {
      this._data.selectedCPR.product = value;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in updateFlightSelectedCPR function', exception);
      }
    },

    updateJourneySelectedCPR: function(value) {
      this.$logInfo('ModuleCtrl::Entering updateJourneySelectedCPR function');
      try {
      this._data.selectedCPR.journey = value;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in updateJourneySelectedCPR function', exception);
      }
    },

    updatePaxSelectedCPR: function(value) {
      this.$logInfo('ModuleCtrl::Entering updatePaxSelectedCPR function');
      try {
      this._data.selectedCPR.customer = value;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in updatePaxSelectedCPR function', exception);
      }
    },

    loadHomeForTripList: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering loadHomeForTripList function');
        this.appCtrl.load("merci-checkin-MSSCICheckinIndex_A");
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in loadHomeForTripList function', exception);
      }
    },

    toTitleCase: function(str) {
      this.$logInfo('ModuleCtrl::Entering toTitleCase function');
      try {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in toTitleCase function', exception);
      }
    },

    /*Calling from select flight as it is compulsory page which controller comes in flow, have to call same function from trip overview page also for confirmation page.
     * For country list for Auto completes and two digit country list for valid country verification
     * */
    countryList: function() {
      this.$logInfo('ModuleCtrl::Entering countryList function');
      try {
        var countryListJson = "";
        var countryList = jsonResponse.data.checkIn[this._data.landingPageDetail].twoDigitCountryCode;
        for (var i in countryList) {
          countryListJson += "{\"label\":\"" + countryList[i][1] + "\",\"code\":\"" + countryList[i][1] + "\"},";
          this._data.twoDigitThreeDigitAllCntryList[countryList[i][1].toUpperCase()] = countryList[i][1].toUpperCase();
          this._data.twoDigitThreeDigitAllCntryList[countryList[i][0].toUpperCase()] = countryList[i][1].toUpperCase();
          this._data.convertToTwoDigitForSendtoBackend[countryList[i][1].toUpperCase()] = countryList[i][0].toUpperCase();
        }
        countryListJson = countryListJson.substr(0, countryListJson.length - 1)
        countryListJson = JSON.parse("[" + countryListJson + "]");

        /*For formatting threedigit country codes*/
        this.threeDigitCntryList();

        /*For forming airline list*/
        this.setTelephoneNumberList(jsonResponse.data.checkIn[this._data.landingPageDetail].telephoneNumList);

        this._data.formattedCuntryList = countryListJson;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in countryList function', exception);
      }
    },

    getFormattedCuntryList: function() {
      this.$logInfo('ModuleCtrl::Entering getformattedCuntryList function');
      try {

        return this._data.formattedCuntryList;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getformattedCuntryList function', exception);
      }
    },

    /* For form three digit country list for valid country verification*/
    threeDigitCntryList: function() {
      this.$logInfo('ModuleCtrl::Entering threeDigitCntryList function');
      try {
        var countryList = jsonResponse.data.checkIn[this._data.landingPageDetail].threeDigitCountryCode;
        for (var i in countryList) {

          if (this._data.twoDigitThreeDigitAllCntryList[countryList[i][0].toUpperCase()] != null && this._data.twoDigitThreeDigitAllCntryList[countryList[i][0].toUpperCase()] != undefined) {
            this._data.twoDigitThreeDigitAllCntryList[countryList[i][6].toUpperCase()] = this._data.twoDigitThreeDigitAllCntryList[countryList[i][0]].toUpperCase();
          }
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in threeDigitCntryList function', exception);
      }

    },

    gettwoDigitThreeDigitAllCntryList: function() {
      this.$logInfo('ModuleCtrl::Entering gettwoDigitThreeDigitAllCntryList function');
      try {
        return this._data.twoDigitThreeDigitAllCntryList;
      } catch (e) {
        this.$logError('ModuleCtrl::An error occured in gettwoDigitThreeDigitAllCntryList function', exception);
      }

    },

    onBackClick: function() {
      this.$logInfo('ModuleCtrl::Entering onBackClick function');
      try {
        window.history.back();
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in onBackClick function', exception);
      }

    },

    getSessionId: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getSessionId function');
        return this._data.sessionId;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getSessionId function', exception);
      }
    },

    setSessionId: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setSessionId function');
        this._data.sessionId = val;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setSessionId function', exception);
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
        this.$logError('ModuleCtrl::An error occured in setFlowType function', exception);
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
        this.$logError('ModuleCtrl::An error occured in getFlowType function', exception);
      }
    },

    /**
     * setCallingPage
     * This method set the flow type.
     */
    setCallingPage: function(callingPage) {
      try {
        this.$logInfo('ModuleCtrl::Entering setCallingPage function');
        this._data.callingPage = callingPage;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setCallingPage function', exception);
      }
    },
    /**
     * getCallingPage
     * This method get the CallingPage.
     */
    getCallingPage: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCallingPage function');
        if (!jQuery.isUndefined(this._data.callingPage)) {
          return this._data.callingPage;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getCallingPage function', exception);
      }
    },

    /*
     * setIsSelectFlightPageError -- true if selectFlight page has Some Error
     * */
    setIsSelectFlightPageError: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsSessionExpired function');
        this._data.isSelectFlightPageError = val;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setIsSessionExpired function', exception);
      }
    },

    getIsSelectFlightPageError: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsSessionExpired function');
        return this._data.isSelectFlightPageError;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getIsSessionExpired function', exception);
      }
    },

    /*
     * flag - not undefined then take selectedCPR from that
     * */
    getCustomerIndex: function(custId,flag) {
      this.$logInfo('ModuleCtrl::Entering getCustomerIndex function');
      try {
    	  if(flag == undefined)
    	  {
    		  var tmp=this._data.selectedCPR;
    	  }else
    	  {
    		  var tmp=this._data[flag];
    	  }
        if (jQuery.isUndefined(tmp.custtoflight)) {
          return null;
        }
        var length = tmp.custtoflight.length;
        for (var i = 0; i < length; i++) {
          if (tmp.custtoflight[i].customer == custId) {
            return i;
          }
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getCustomerIndex function', exception);
      }
    },

    /*Return leg ids based on flight id, result will be in array*/
    getLegIdBasedByFlightId: function(flightID) {
      this.$logInfo('ModuleCtrl::Entering getLegIdBasedByFlightId function');
      try {
        var result = [];
        var cpr = this.getCPR();
        var selectedCPR = this.getSelectedCPR();

        for (var item in cpr[selectedCPR.journey][flightID].leg) {
          item = cpr[selectedCPR.journey][flightID].leg[item];
          if (item.flightID == flightID) {
            result.push(item.ID);
          }
        }

        if (result.length == 0) {
          throw e;
        }
        return result;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getLegIdBasedByFlightId function', exception);
      }
    },

    removeCustToFlightFromSelectedCPR: function(flight, cust, flag) {
      this.$logInfo('ModuleCtrl::Entering removeCustToFlightFromSelectedCPR function');
      try {
      var selectedCPR = this._data.selectedCPR;
      var cpr = this.getCPR()[selectedCPR.journey];
      /*Check if cust is infant*/
      if (cpr[cust].passengerTypeCode == "INF" && jQuery.isUndefined(flag)) {
        return false;
      }

      for (var custToFlight in selectedCPR.custtoflight) {
        var oricustToFlight = custToFlight;
        custToFlight = selectedCPR.custtoflight[custToFlight];

        if (custToFlight.customer == cust) {
          for (var flightNum in custToFlight.product) {
            var oriflightNum = flightNum;
            flightNum = custToFlight.product[flightNum];

            if (flightNum == flight) {
              //delete custToFlight.product[oriflightNum];
              custToFlight.product.splice(oriflightNum, 1);
            }
          }

          if (custToFlight.product.length == 0) {
            //delete selectedCPR.custtoflight[oricustToFlight];
            selectedCPR.custtoflight.splice(oricustToFlight, 1);
          }
        }
      }

      /*For remove infant details also if adult have associated infant*/
      if (!jQuery.isUndefined(cpr[cust].accompaniedByInfant) && (cpr[cust].accompaniedByInfant == true)) {
        var inftcust = this.findInfantIDForCust(flight, cust);
        this.removeCustToFlightFromSelectedCPR(flight, inftcust, "");
      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in removeCustToFlightFromSelectedCPR function', exception);
      }

    },

    removeFlightToCustFromSelectedCPR: function(flight, cust, flag) {
      this.$logInfo('ModuleCtrl::Entering removeFlightToCustFromSelectedCPR function');
      try {
      var selectedCPR = this._data.selectedCPR;
      var cpr = this.getCPR()[selectedCPR.journey];
      /*Check if cust is infant*/
      if (cpr[cust].passengerTypeCode == "INF" && jQuery.isUndefined(flag)) {
        return false;
      }

      for (var flightToCust in selectedCPR.flighttocust) {
        var oriflightToCust = flightToCust;
        flightToCust = selectedCPR.flighttocust[flightToCust];

        if (flightToCust.product == flight) {
          for (var custNum in flightToCust.customer) {
            var oriCustNum = custNum;
            custNum = flightToCust.customer[custNum];

            if (custNum == cust) {
              //delete flightToCust.customer[oriCustNum];
              flightToCust.customer.splice(oriCustNum, 1);
            }
          }

          if (flightToCust.customer.length == 0) {
            //delete selectedCPR.flighttocust[oriflightToCust];
            selectedCPR.flighttocust.splice(oriflightToCust, 1);
          }
        }
      }

      /*For remove infant details also if adult have associated infant*/
      if (!jQuery.isUndefined(cpr[cust].accompaniedByInfant) && (cpr[cust].accompaniedByInfant == true)) {
        var inftcust = this.findInfantIDForCust(flight, cust);
        this.removeFlightToCustFromSelectedCPR(flight, inftcust, "");
      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in removeFlightToCustFromSelectedCPR function', exception);
      }

    },
    /*
     * Has to call only when adult accompinied by infant node is true
     *
     * flight -- flight id, cust -- cust id
     * will return infant passingerID
     * And On Giving Infant ID  It returns Adult ID
     * */
    findInfantIDForCust: function(flight, cust) {
      try {
        this.$logInfo('ModuleCtrl::Entering findInfantIDForCust function');
        var selectedCPR = this._data.selectedCPR;
        var cpr = this.getCPR()[selectedCPR.journey];

        if (!jQuery.isUndefined(cpr.service)) {
          /*
           * In case of When Cust ID is of Adult the return its infant
           * */
          if (cpr[cust].passengerTypeCode != "INF") {
            for (var serviceIndex in cpr.service) {
              var service = cpr.service[serviceIndex];
              if (!jQuery.isUndefined(service.services)) {
                if (service.services[0].SSRCode.search(/INFT/i) != -1 && service.referenceIDProductFlightID.search(flight) != -1) {
                  var productID = service.referenceIDProductProductID;
                  if (!jQuery.isUndefined(cpr.associatedProducts) && cpr.associatedProducts[productID].referenceIDProductPassengerID == cust) {
                    return service.referenceIDProductPassengerID;

                  }
                }
              }

            }

          } else {
            /*
             * In case of When Cust ID is of infant the return its adult
             * */
            for (var serviceIndex in cpr.service) {
              var service = cpr.service[serviceIndex];
              if (!jQuery.isUndefined(service.services)) {
                if (service.services[0].SSRCode.search(/INFT/i) != -1 && service.referenceIDProductFlightID.search(flight) != -1 && service.referenceIDProductPassengerID.search(cust) != -1) {
                  var productID = service.referenceIDProductProductID;
                  if (!jQuery.isUndefined(cpr.associatedProducts)) {
                    return cpr.associatedProducts[productID].referenceIDProductPassengerID;
                  }
                }
              }
            }
          }

        }

      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in findInfantIDForCust function',
          exception);
      }

    },

    /**
     * getCheckedInProductIDs
     * This method get the Product IDs of the checked in products.
     */
    getCheckedInProductIDs: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getCheckedInProductIDs function');
        if (!jQuery.isUndefined(this._data.checkedInProductIDs)) {
          return this._data.checkedInProductIDs;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in getCheckedInProductIDs function',
          exception);
      }
    },

    /**
     * addCheckedInProductID
     * This method add the Product ID in the checked in products.
     */
    addCheckedInProductID: function(prodID) {
      try {
        this.$logInfo('ModuleCtrl::Entering addCheckedInProductID function');
        var temp = this._data.checkedInProductIDs;
        if (temp.indexOf(prodID) == -1) {
          temp.push(prodID);
        }
        this._data.checkedInProductIDs = temp;
      } catch (exception) {
        this.$logError(
          'ModuleCtrl::An error occured in addCheckedInProductID function',
          exception);
      }
    },
    /*function to return no of pax eligible for to show seat
     * 1. for infant no seatmap avilable so if 1pax +1inft then count return will be 1
     * 2. if boarding pass generated, should not show seatmap for cust so remove it from list
     * custList - cust list to which count calculated
     * flag -- ao -- acceptance overview, ac -- confirmation page
     * */
    findAdltChildCountFromCustIDList: function(custList, flightId, flag) {
      try {
        this.$logInfo('ModuleCtrl::Entering findAdltChildCountFromCustIDList function');

        /*
         * decide to consider parameter if any based on page
         * */
        if (flag == "ac") {
          flag = false;
          if (this._data.siteParameters.SITE_SSCI_DSBL_CST_BP_GEN && (this._data.siteParameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/false/i) != -1)) {

            flag = true;

          }
        } else {
          flag = true;
        }

        var selectedCPR = this._data.selectedCPR;
        var cpr = this.getCPR()[selectedCPR.journey];
        var count = 0;
        var tempFlag = false;
        for (var i in custList) {
          tempFlag = (flag || (cpr["productDetailsBeans"][custList[i] + flightId]["boardingPassPrinted"] == false));
          if (!jQuery.isUndefined(cpr[custList[i]].passengerTypeCode) && cpr[custList[i]].passengerTypeCode.search(/adt|chd/i) != -1 && tempFlag) {
            count++;
          }
        }
        return count;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findAdltChildCountFromCustIDList function', exception);
      }
    },

    deliverDocument: function(input) {
      this.$logInfo('ModuleCtrl::Entering deliverDocument function');
      try {
        this.submitJsonRequest("IBoardingPass", input, {
          scope: this,
          fn: this.__deliverDocument,
          args: input
        });
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in deliverDocument function', exception);
      }

    },

    __deliverDocument: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __deliverDocument function')
      try {

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {

          // getting next page id
          var nextPage = res.responseJSON.homePageId;
          var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
          var errorStrings = res.responseJSON.data.checkIn[dataId].errorStrings;
          var success = [];
          var errors = [];
          var successProducts = [];
          var selectedCPR = this.getSelectedCPR();

          var json = this.getModuleData();
          json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

          /*
           * Begin To disable cancel checkin on sending boarding passes
           * */
          if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.successProducts != null) {

            successProducts = res.responseJSON.data.checkIn[dataId].requestParam.successProducts;

            if (successProducts.length == 0) {
              errors.push({
                "localizedMessage": errorStrings[25000087].localizedMessage,
                "code": errorStrings[25000087].errorid
              });

              if (input.fromPage == "TripOverview") {
                this.displayErrors(errors, "cprErrorsSelectFlight", "error");
              } else {
                this.displayErrors(errors, "acceptConfMsgs", "error");
              }
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              return null;
            }

            /*To uncheck all the checkboxes for cancel checkin*/
            for (var flight in selectedCPR.flighttocust) {
              var flightID = selectedCPR.flighttocust[flight].product;
              for (var cust in selectedCPR.flighttocust[flight].customer) {
                var custID = selectedCPR.flighttocust[flight].customer[cust];
                jQuery('#paxflight' + custID + '_' + flightID).prop("checked", false);
              }
            }
            jQuery('.cancelChkn').addClass("disabled");

            var cpr = this.getCPR();
            if (jsonResponse.data.checkIn.MSSCITripOverview_A != null) {
            	jsonResponse.data.checkIn.MSSCITripOverview_A.requestParam.CPRIdentification=cpr;
            }
            for (var index in successProducts) {
              var productId = successProducts[index];
              var journey = cpr[selectedCPR.journey];
              var paxIDandFlightID = this.findPaxFlightIdFrmProductId(journey, productId);
              var customerID = paxIDandFlightID.split("~")[0];
              var flightID = paxIDandFlightID.split("~")[1];
              if (!cpr[selectedCPR.journey].productDetailsBeans[customerID + flightID].boardingPassPrinted) {
                cpr[selectedCPR.journey].productDetailsBeans[customerID + flightID].boardingPassPrinted = true;
                if (jsonResponse.data.checkIn.MSSCITripOverview_A != null) {
                  jsonResponse.data.checkIn.MSSCITripOverview_A.requestParam.CPRIdentification[selectedCPR.journey].productDetailsBeans[customerID + flightID].boardingPassPrinted = true;
                }

                if (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CST_BP_GEN && (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/true/i) != -1)) {
                    var numValidSeatmapcust = parseInt(jQuery("#services01" + flightID + " .draggable .conf-seat-icon p.amount span").text());
                    jQuery("#services01" + flightID + " .draggable .conf-seat-icon p.amount span").text(numValidSeatmapcust - 1);
                }

                if (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CSL_BP_GEN && (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CSL_BP_GEN.search(/true/i) != -1)) {
                  if (jQuery('#paxflight' + customerID + '_' + flightID) != undefined) {
                    jQuery('#paxflight' + customerID + '_' + flightID).attr("disabled", "");
                  }
                }
              }
            }
            this.setCPR(cpr); /*Setting the CPR Again after setting the Product Detail Bean with "BPPrinted" value*/
            if (jsonResponse.data.checkIn.MSSCITripOverview_A != null) {
            	this.setCPR(jsonResponse.data.checkIn.MSSCITripOverview_A.requestParam.CPRIdentification);
            }
            /*
             *Begin To disable Seat Map Button if all pax have printed BP based on the parameter
             * */
            if (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CST_BP_GEN && (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/true/i) != -1)) {
              if (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_CHG_ST_AFTR_CON && (res.responseJSON.data.checkIn[dataId].parameters.SITE_SSCI_CHG_ST_AFTR_CON.search(/true/i) != -1)) {
                for (var flightIndex in selectedCPR.flighttocust) {
                  if (jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon") != undefined) {
                    if (parseInt(jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon p.amount span").text())<1) {
                      jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon a").removeAttr('atdelegate');
                      jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon a").addClass("disabled");
                      jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon p.amount").remove();
                      jQuery("#services01" + selectedCPR.flighttocust[flightIndex].product + " .draggable .conf-seat-icon").addClass("seatmaplinkDisabled");
                    }
                  }
                }
              }
            }

            /*
             *END To disable Seat Map Button if all pax have printed BP based on the parameter
             * */
          }
          /*
           * End To disable cancel checkin on sending boarding passes
           * */

          if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.successRecipients != null && res.responseJSON.data.checkIn[dataId].requestParam.successRecipients.length > 0) {

            var successRecipients = res.responseJSON.data.checkIn[dataId].requestParam.successRecipients;
            var label = res.responseJSON.data.checkIn[dataId].labels;

            var u_successRecipients = successRecipients.filter(function(elem, pos) {
                return successRecipients.indexOf(elem) == pos;
              })
            this.raiseEvent({
              "name": "page.refresh"
            });
            if (input.bpType == "SMS") {
            	/* GOOGLE ANALYTICS */
                if ((this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled()) && (successProducts.length > 0)) {
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

                      window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppiPhoneSMS&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(successProducts.length);

                      this.__ga.trackEvent({
                        domain: GADetails.siteGADomain,
                        account: GADetails.siteGAAccount,
                        gaEnabled: GADetails.siteGAEnable,
                        category: 'SSCIAppiPhoneSMS',
                        action: loginOrguestUser,
                        label: 'iPhone',
                        requireTrackPage: true,
                        value: parseInt(successProducts.length)
                      });
                    } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                      //ga('send', 'event', 'MCIAppAndroidMBP', loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                      window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppAndroidSMS&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(successProducts.length);

                      this.__ga.trackEvent({
                        domain: GADetails.siteGADomain,
                        account: GADetails.siteGAAccount,
                        gaEnabled: GADetails.siteGAEnable,
                        category: 'SSCIAppAndroidSMS',
                        action: loginOrguestUser,
                        label: 'Android',
                        requireTrackPage: true,
                        value: parseInt(successProducts.length)
                      });
                    } else {

                      //ga('send', 'event', 'MCIWebMBP', loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                      this.__ga.trackEvent({
                        domain: GADetails.siteGADomain,
                        account: GADetails.siteGAAccount,
                        gaEnabled: GADetails.siteGAEnable,
                        category: 'SSCIWebSMS',
                        action: loginOrguestUser,
                        label: 'Mobile Web',
                        requireTrackPage: true,
                        value: parseInt(successProducts.length)
                      });
                    }
                  }
            	/* GOOGLE ANALYTICS */
              success.push({
                "localizedMessage": label.MobileMsg + u_successRecipients
              });
            } else if (input.bpType == "Email") {
            	/*GOOGLE ANALYTICS*/
            	var cpr = this.getCPR();
            	var journey = cpr[selectedCPR.journey];
            	var l_flighttocust = [];
                for (var index in successProducts) {
		            var productId = successProducts[index];
		            var paxIDandFlightID = this.findPaxFlightIdFrmProductId(journey, productId);
		            var customerID = paxIDandFlightID.split("~")[0];
		            var flightID = paxIDandFlightID.split("~")[1];
		            var flightExist = false;
		            for(var flightIndex in l_flighttocust){
		            	if(l_flighttocust[flightIndex].product == flightID){
		            		flightExist = true;
		            		var custExist = false;
		            		for(var custIndex in l_flighttocust[flightIndex].customer){
		            			if(l_flighttocust[flightIndex].customer[custIndex] == customerID){
		            				custExist = true;
		            			}
		            		}
		            		if(!custExist){
		            			l_flighttocust[flightIndex].customer.push(customerID);
		            		}
		            	}
		            }
		            if(!flightExist){
		            	var tempObj = {"customer" : [customerID],"product" : flightID}
		            	l_flighttocust.push(tempObj);
		            }
                }

                for(var flightIndex in l_flighttocust){
                	var flight = l_flighttocust[flightIndex].product;
                	var Boardingpoint = journey[flight].departureAirport.airportLocation.airportCodeID;
                	var FlightNumber = journey[flight].operatingAirline.flightNumber;


	                if (this._data.GADetails.siteGAEnable && (successProducts.length > 0)) {
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
	                      window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppiPhoneSPBPAirportCode - " + Boardingpoint + "&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(l_flighttocust[flightIndex].customer.length) + "^" + "Category=MCIAppiPhoneSPBPFlightNo - " + FlightNumber + "&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(l_flighttocust[flightIndex].customer.length);

	                      this.__ga.trackEvent({
	                        domain: GADetails.siteGADomain,
	                        account: GADetails.siteGAAccount,
	                        gaEnabled: GADetails.siteGAEnable,
	                        category: 'SSCIAppiPhoneSPBPAirportCode - ' + Boardingpoint,
	                        action: loginOrguestUser,
	                        label: 'iPhone',
	                        requireTrackPage: true,
	                        value: parseInt(l_flighttocust[flightIndex].customer.length)
	                      });
	                      this.__ga.trackEvent({
	                        domain: GADetails.siteGADomain,
	                        account: GADetails.siteGAAccount,
	                        gaEnabled: GADetails.siteGAEnable,
	                        category: 'SSCIAppiPhoneSPBPFlightNo - ' + FlightNumber,
	                        action: loginOrguestUser,
	                        label: 'iPhone',
	                        requireTrackPage: true,
	                        value: parseInt(l_flighttocust[flightIndex].customer.length)
	                      });
	                    } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

	                      //ga('send', 'event', 'MCIAppAndroidSPBPAirportCode - '+Boardingpoint, loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
	                      //ga('send', 'event', 'MCIAppAndroidSPBPFlightNo - '+FlightNumber, loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
	                      window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppAndroidSPBPAirportCode - " + Boardingpoint + "&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit) + "^" + "Category=SSCIAppAndroidSPBPFlightNo - " + FlightNumber + "&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);

	                      this.__ga.trackEvent({
	                        domain: GADetails.siteGADomain,
	                        account: GADetails.siteGAAccount,
	                        gaEnabled: GADetails.siteGAEnable,
	                        category: 'SSCIAppAndroidSPBPAirportCode - ' + Boardingpoint,
	                        action: loginOrguestUser,
	                        label: 'Android',
	                        requireTrackPage: true,
	                        value: parseInt(l_flighttocust[flightIndex].customer.length)
	                      });
	                      this.__ga.trackEvent({
	                        domain: GADetails.siteGADomain,
	                        account: GADetails.siteGAAccount,
	                        gaEnabled: GADetails.siteGAEnable,
	                        category: 'SSCIAppAndroidSPBPFlightNo - ' + FlightNumber,
	                        action: loginOrguestUser,
	                        label: 'Android',
	                        requireTrackPage: true,
	                        value: parseInt(l_flighttocust[flightIndex].customer.length)
	                      });
	                    } else {
	                        //ga('send', 'event', 'MCIWebSPBPAirportCode - '+Boardingpoint, loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
	                        // ga('send', 'event', 'MCIWebSPBPFlightNo - '+FlightNumber, loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
	                        this.__ga.trackEvent({
	                          domain: GADetails.siteGADomain,
	                          account: GADetails.siteGAAccount,
	                          gaEnabled: GADetails.siteGAEnable,
	                          category: 'SSCIWebSPBPAirportCode - ' + Boardingpoint,
	                          action: loginOrguestUser,
	                          label: 'Mobile Web',
	                          requireTrackPage: true,
	                          value: parseInt(l_flighttocust[flightIndex].customer.length)
	                        });
	                        this.__ga.trackEvent({
	                        domain: GADetails.siteGADomain,
	                        account: GADetails.siteGAAccount,
	                        gaEnabled: GADetails.siteGAEnable,
	                        category: 'SSCIWebSPBPFlightNo - ' + FlightNumber,
	                        action: loginOrguestUser,
	                        label: 'Mobile Web',
	                        requireTrackPage: true,
	                        value: parseInt(l_flighttocust[flightIndex].customer.length)
	                      });
	                    }
	                  }
                }// For Loop

            	/*GOOGLE ANALYTICS*/

              success.push({
                "localizedMessage": label.EmailMsg + u_successRecipients
              });
            }

            if (input.fromPage == "TripOverview") {
                this.displayErrors(success, "cprErrorsSelectFlight", "success");
              } else {
                this.displayErrors(success, "acceptConfMsgs", "success");
              }

          } else if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails != null && input.bpType == "passbook") {
        	/* GOOGLE ANALYTICS */
              if (this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled()) {
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
                    jQuery("[name='ga_track_event']").val("Category=SSCIAppiPhonePassbook&Action=" + loginOrguestUser + "&Label=iPhone&value=1");
                    var GADetails = this._data.GADetails;
                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'SSCIAppiPhonePassbook',
                      action: loginOrguestUser,
                      label: 'iPhone',
                      requireTrackPage: true,
                      value: 1
                    });
                  } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                    //ga('send', 'event', 'MCIAppAndroidMBP', loginOrguestUser, 'Android',1);
                    //window.location = "sqmobile"+"://?flow=MCI/eventtrigger=Category=MCIAppAndroidMBP&Action="+loginOrguestUser+"&Label=Android&value=1";
                    jQuery("[name='ga_track_event']").val("Category=SSCIAppAndroidPassbook&Action=" + loginOrguestUser + "&Label=Android&value=1");
                    var GADetails = this._data.GADetails;
                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'SSCIAppAndroidPassbook',
                      action: loginOrguestUser,
                      label: 'Android',
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
                      category: 'SSCIWebPassbook',
                      action: loginOrguestUser,
                      label: 'Mobile Web',
                      requireTrackPage: true,
                      value: 1
                    });
                  }

                }
        	/* GOOGLE ANALYTICS */
            jQuery(".msk").removeClass("passbookZIndexInc");
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();



//            jQuery('#overlayCKIN').hide();
//            jQuery('#splashScreen').hide();
            window.location = 'data:application/vnd.apple.pkpass;base64,' + res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails;
            return null;
          } else if (input.bpType == "MBP") {
            if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails != null) {
              var l_deliveredDocs = res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails.deliveredDocuments;
              var deliveredDocs = [];
              this._data.NotAllBoardingPassIssued = false;

              for (var mbpIndex in l_deliveredDocs) {
                if (l_deliveredDocs[mbpIndex].boardingPass == true) {
                  deliveredDocs.push(l_deliveredDocs[mbpIndex]);
                }
              }

              if (deliveredDocs.length == 0) {
                errors.push({
                  "localizedMessage": errorStrings[25000087].localizedMessage,
                  "code": errorStrings[25000087].errorid
                });

                this.displayErrors(errors, "acceptConfMsgs", "error");
                if (input.fromPage == "TripOverview") {
                this.displayErrors(errors, "cprErrorsSelectFlight", "error");
              } else {
                this.displayErrors(errors, "acceptConfMsgs", "error");
              }
                modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
                return null;
              }


              /* GOOGLE ANALYTICS */
          	/* GOOGLE ANALYTICS */
              if ((this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled()) && (deliveredDocs.length > 0)) {
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

                    window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppiPhoneMBP&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(deliveredDocs.length);

                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'SSCIAppiPhoneMBP',
                      action: loginOrguestUser,
                      label: 'iPhone',
                      requireTrackPage: true,
                      value: parseInt(deliveredDocs.length)
                    });
                  } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

                    //ga('send', 'event', 'MCIAppAndroidMBP', loginOrguestUser, //'Android',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                    window.location = "sqmobile" + "://?flow=MCI/eventtrigger=Category=SSCIAppAndroidMBP&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(deliveredDocs.length);

                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'SSCIAppAndroidMBP',
                      action: loginOrguestUser,
                      label: 'Android',
                      requireTrackPage: true,
                      value: parseInt(deliveredDocs.length)
                    });
                  } else {

                    //ga('send', 'event', 'MCIWebMBP', loginOrguestUser, 'Mobile //Web',deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit);
                    this.__ga.trackEvent({
                      domain: GADetails.siteGADomain,
                      account: GADetails.siteGAAccount,
                      gaEnabled: GADetails.siteGAEnable,
                      category: 'SSCIWebMBP',
                      action: loginOrguestUser,
                      label: 'Mobile Web',
                      requireTrackPage: true,
                      value: parseInt(deliveredDocs.length)
                    });
                  }
                }
          	/* GOOGLE ANALYTICS */
              /* GOOGLE ANALYTICS */

              if (deliveredDocs.length != l_deliveredDocs.length) {
                this._data.NotAllBoardingPassIssued = true;
              }


              var cpr = this.getCPR();
              var selectedCPR = this.getSelectedCPR();
              var journey = selectedCPR.journey;

              var flightsOfMBP=[];

              for(deliveredDocIndex in deliveredDocs){
            	  var prodID = deliveredDocs[deliveredDocIndex].products[0];
                var paxIDandFlightID = this.findPaxFlightIdFrmProductId(cpr[journey], prodID);
                var flightID = paxIDandFlightID.split("~")[1];
                  if(flightsOfMBP.indexOf(flightID) == '-1'){
                	  flightsOfMBP.push(flightID);
                  }
              }

              if(flightsOfMBP.length == 1){
            	  this.setSelectedFlightforMBP(flightsOfMBP[0]);
            	  var flightID = flightsOfMBP[0];
                var flightWiseDocs = [];
                flightWiseDocs[flightID] = [];
                  flightWiseDocs[flightID] = deliveredDocs;
                this.setFlightWiseDocs(flightWiseDocs);
              }

//              if (deliveredDocs.length == 1) {
//                var deliveredDocument = deliveredDocs[0];
//                var prodID = deliveredDocument.products[0];
//
//
//                var paxIDandFlightID = this.findPaxFlightIdFrmProductId(cpr[journey], prodID);
//                var flightID = paxIDandFlightID.split("~")[1];
//                var flightWiseDocs = [];
//                flightWiseDocs[flightID] = [];
//                flightWiseDocs[flightID].push(deliveredDocument);
//                this.setSelectedFlightforMBP(flightID);
//                this.setFlightWiseDocs(flightWiseDocs);
//              }

              /*For Storing it in local storage*/

              var params = res.responseJSON.data.checkIn[dataId].parameters;
              var label = res.responseJSON.data.checkIn[dataId].labels;
              var errors = res.responseJSON.data.checkIn[dataId].errorStrings;

              var jsonBPList = {};

              for (var i in deliveredDocs) {
                var prodID = deliveredDocs[i].products[0];
                var paxIDandFlightID = this.findPaxFlightIdFrmProductId(cpr[journey], prodID);
                var flightID = paxIDandFlightID.split("~")[1];
                var paxID = paxIDandFlightID.split("~")[0];
                var infantsAdultProdId = "";
                if(cpr[journey][paxID].passengerTypeCode=="INF"){
                    var infAdultCustID = this.findInfantIDForCust(flightID, paxID);
                    var infantsAdultProdId = this.findProductidFrmflightid(cpr[journey], infAdultCustID, flightID);
                }
                var paxName = cpr[journey][paxID].personNames[0].givenNames[0] + " " + cpr[journey][paxID].personNames[0].surname;
                var depDate = cpr[journey][flightID].timings.SDT.time;
                var arrDate = cpr[journey][flightID].timings.SAT.time;
                var departureCity = cpr[journey][flightID].departureAirport.airportLocation.cityName;
                var arrivalCity = cpr[journey][flightID].arrivalAirport.airportLocation.cityName;
                var recLocator = "";
                for(var key in cpr[journey].bookingInformations){
                    if(paxID == key){
                        recLocator = cpr[journey].bookingInformations[key].recordLocator;
                    }
                }
                var passengerLegCode = paxID + cpr[journey][flightID].leg[0].ID + "SST";
                if (cpr[journey].seat[passengerLegCode] && cpr[journey].seat[passengerLegCode].status.code == "A"){
                    var seat = cpr[journey].seat[passengerLegCode].row + cpr[journey].seat[passengerLegCode].column;
                }else{
                    var seat = "-";
                }
                var jSondata = {
                  "infantsAdultProdId": infantsAdultProdId,
                  "formattedDocument": deliveredDocs[i].formattedDocument,
                  "flightID": flightID,
                  "customerID": paxID,
                  "customerName": paxName,
                  "depDate": depDate,
                  "arrDate": arrDate,
                  "departureCity": departureCity,
                  "arrivalCity": arrivalCity,
                  "recordLocator": recLocator,
                  "seat": seat
                };

                var currSvDate = new Date(jsonResponse.data.framework.date.date);
                var tripArDate = new Date(arrDate);
                var EnablePastDeletion = false;
				if(jsonResponse.data.framework.settings.siteDeletePastBP != undefined){
					EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastBP;
				}

                if(((tripArDate-currSvDate) >0)||!EnablePastDeletion){
                jsonBPList[prodID] = jSondata;
                }

              }

              this.storeBoardingPassesinLocaL(jsonBPList, params, label,errors);

              /*End of Storing it in local storage*/

            }
          }

          this.appCtrl.load(nextPage);
        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __deliverDocument function', exception);
      }
    },

    storeBoardingPassesinLocaL: function(jsonBPList, params, label,errors) {
      try {
        this.$logInfo('ModuleCtrl::Entering storeBoardingPassesinLocaL function');

        var bpParameters = params;

        var bpLabels = {
          "tx_merci_text_sm_share": label.tx_merci_text_sm_share,
    	  "tx_merci_text_sm_by_email": label.tx_merci_text_sm_by_email,
		  "tx_merci_text_sm_by_sms": label.tx_merci_text_sm_by_sms,
		  "tx_merci_text_sm_sampleData": label.tx_merci_text_sm_sampleData,
		  "tx_pltg_text_confirmationEmailHasBeenSent": label.tx_pltg_text_confirmationEmailHasBeenSent,
		  "tx_merci_text_mailA_from": label.tx_merci_text_mailA_from,
		  "tx_merci_text_sm_mail_from_placeholder": label.tx_merci_text_sm_mail_from_placeholder,
		  "tx_merci_text_mailA_to": label.tx_merci_text_mailA_to,
		  "tx_merci_text_sm_mail_to_placeholder": label.tx_merci_text_sm_mail_to_placeholder,
		  "tx_merci_text_sm_mail_to_info": label.tx_merci_text_sm_mail_to_info,
		  "tx_merci_text_mail_btncancel": label.tx_merci_text_mail_btncancel,
		  "tx_merci_text_mail_btnsend": label.tx_merci_text_mail_btnsend,
		  "tx_merci_text_booking_alpi_phone_number": label.tx_merci_text_booking_alpi_phone_number,
          "tx_merci_text_sm_sampleData": label.tx_merci_text_sm_sampleData,
          "tx_merci_text_sm_title":label.tx_merci_text_sm_title,
          "confirmDeleteBPmsg": "Are You Sure You Want To delete selected boarding pass(es)?",
          "Cancel" : label.Cancel,
          "yes": "Yes",
          "no": "No",
          "emailNotValid": errors[25000048].localizedMessage,
    	  "emailValid": label.tx_pltg_text_confirmationEmailHasBeenSent,
    	  "smsNotValid": errors[25000049].localizedMessage,
		  "countryList": this._data.formattedPhoneList,
          "Email": label.Email,
          "Sms": label.Sms,
          "fieldEmpty":errors[21400059].localizedMessage,
          "tx_ssci_email_error":label.tx_ssci_email_error,
          "addToPassbook": label.addToPassbook
        };

        var that = this;
        this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
          var jsonBoardingPassList = {};
          if (result && result != "") {
            if (typeof result === 'string') {
              var jsonBoardingPassList = JSON.parse(result);
            } else {
              var jsonBoardingPassList = (result);
            }

            if (!that.utils.isEmptyObject(jsonBoardingPassList)) {

              var bpListData = jsonBoardingPassList["boardingPassArray"];
              for (var key in jsonBPList) {
                bpListData[key] = jsonBPList[key];
              }
              jsonBoardingPassList["boardingPassArray"] = bpListData;

              that.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, jsonBoardingPassList, "overwrite", "json");
              jsonResponse.ui.cntBoardingPass = Object.keys(bpListData).length;

            } else {

              if ((that.utils.isEmptyObject(jsonBoardingPassList)) || (jsonBoardingPassList == null)) {

                var bpListData = {};
                for (var key in jsonBPList) {
                  bpListData[key] = jsonBPList[key];
                }
                jsonBoardingPassList["boardingPassArray"] = bpListData;
                jsonBoardingPassList["config"] = bpParameters;

                that.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, jsonBoardingPassList, "overwrite", "json");
                jsonResponse.ui.cntBoardingPass = Object.keys(bpListData).length;
              }
            }
          } else {
            var jsonBoardingPassList = {};
            if ((that.utils.isEmptyObject(result)) || (result == null)) {
              var jsonBoardingPassList = {};
              var bpListData = {};
              for (var key in jsonBPList) {
                bpListData[key] = jsonBPList[key];
              }
              jsonBoardingPassList["boardingPassArray"] = bpListData;
              jsonBoardingPassList["config"] = bpParameters;
              jsonBoardingPassList["bpLabels"] = bpLabels;

              that.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, jsonBoardingPassList, "overwrite", "json");
              jsonResponse.ui.cntBoardingPass = Object.keys(bpListData).length;
            }
          };

        });

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in storeBoardingPassesinLocaL function', exception);
      }
    },

    setSelectedFlightforMBP: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setIsSelectFlightPageError function');
        this._data.selectedFlightforMBP = val;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setIsSelectFlightPageError function', exception);
      }
    },

    getSelectedFlightforMBP: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getIsSessionExpired function');
        return this._data.selectedFlightforMBP;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getIsSessionExpired function', exception);
      }
    },

    setFlightWiseDocs: function(val) {
      try {
        this.$logInfo('ModuleCtrl::Entering setFlightWiseDocs function');
        this._data.flightWiseDocs = val;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setFlightWiseDocs function', exception);
      }
    },


    getFlightWiseDocs: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFlightWiseDocs function');
        return this._data.flightWiseDocs;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getFlightWiseDocs function', exception);
      }
    },
    /*
     * For storing boarding pass locally
     * */
    boardingPassLocalStorage: function(deliveredDocuments) {
      try {
        this.$logInfo('ModuleCtrl::Entering boardingPassLocalStorage function');

        var prodList = [];
        /*
         * Looping through boarding pass list
         * */
        for (var list in deliveredDocuments) {
          list = deliveredDocuments[list];
          var product = list.products[0];
          /*
           * Setting local storage things
           * */
          this.storeDataLocally(product + "-large", String.fromCharCode.apply(null, list.formattedDocument.base64Binary));
          this.storeDataLocally(product + "-small", jQuery("#" + product + "-small").html());
          this.storeDataLocally(product + "-home", jQuery("#" + product + "-home").html());
          this.storeDataLocally(product + "_date", jQuery("#" + product + "-home #" + product + "_departureDate").text());
          this.storeDataLocally(product + "_dateFormatted", jQuery("#" + product + "-home #" + product + "_departureDate").attr("data-requiredStructure"));
          /*
           * Setting productid list to loop through and access local storage while display offline boarding pass
           *
           * Note: All local storage keys depends on product id
           * */
          var tempAlreadyStored = this.storeDataLocally("storedBoardingPasses");
          if (tempAlreadyStored != undefined && tempAlreadyStored != "") {
            tempAlreadyStored = tempAlreadyStored.split("|||BP|||");
          } else {
            tempAlreadyStored = [];
          }
          if (tempAlreadyStored.indexOf(product) == -1) {
            prodList.push(product);
          }


        }
        var temp = "";
        if (prodList.join("|||BP|||") != "" && tempAlreadyStored.join("|||BP|||") != "") {
          temp = "|||BP|||";
        }
        prodList = prodList.join("|||BP|||") + temp + tempAlreadyStored.join("|||BP|||");
        this.storeDataLocally("storedBoardingPasses", prodList);

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in boardingPassLocalStorage function', exception);
      }
    },

    /**
     * For update IDC with new fqtv
     **/
    updateFQTVDeatilsInCPR: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering updateFQTVDeatilsInCPR function');
      var editFqtvInput = this._data.successfulFQTVDetails;

      for (var i in editFqtvInput) {

        /*verifying Any one success*/
        if (!jQuery.isUndefined(editFqtvInput[i].status) && editFqtvInput[i].status == "failure") {
          continue;
        }

        var temp = this._data.CPRIdentification[this._data.selectedCPR.journey][editFqtvInput[i].custID];

        ///*For adding nodes if json is empty*/
        //if (jQuery.isUndefined(temp.frequentFlyer)) {

        /**Have To Create New node which contains only Updated Value...*/
          temp.frequentFlyer = [];
        //}
        //if (temp.frequentFlyer.length == 0) {
          temp.frequentFlyer.push({
            customerLoyalty: {},
            referenceIDProductPassengerID : ""
          });
        //}

        /*For prefilling data*/
        /*FQTV Program*/
        temp.frequentFlyer[0].customerLoyalty.programID = editFqtvInput[i].fqtvProgId;
        /*FQTV Number*/
        temp.frequentFlyer[0].customerLoyalty.membershipID = editFqtvInput[i].fqtvNumber;

        temp.frequentFlyer[0].referenceIDProductPassengerID = editFqtvInput[i].custID;

      }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in updateFQTVDeatilsInCPR function', exception);
      }

    },

    /**CPRRetreiveMultiPax Page : Called For Setting Last Names of Childs and Adults Not Retreived Yet*/
    setNotRetrievedLastNames: function(notRetrievedLastNameList) {
      try {
        this.$logInfo('ModuleCtrl::Entering setNotRetrievedLastNames function');
        this.data.notRetrievedLastNameList = notRetrievedLastNameList;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setNotRetrievedLastNames function', exception);
      }
    },

    /**CPRRetreiveMultiPax Page : Called For Getting Last Names of Childs and Adults Not Retreived Yet*/
    getNotRetrievedLastNames: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getNotRetrievedLastNames function');
        if (!jQuery.isUndefined(this.data.notRetrievedLastNameList)) {
          return this.data.notRetrievedLastNameList;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getNotRetrievedLastNames function', exception);
      }
    },

    /**CPRRetreiveMultiPax Page : Called For finding Last Names of Childs and Adults Not Retreived Yet*/
    findNotRetrievedLastNameList: function(journey) {
      try {
        this.$logInfo('ModuleCtrl::Entering findNotRetrievedLastNameList function');
      var notRetrievedList = [];
      for (var i = 0; i < journey.paxList.length; i++) {
        if (!journey.customerDetailsBeans[journey.paxList[i]].custRetrieved) { //Will be false only in case of adult and child becasue custRetrieved value of infant is always true
          if (notRetrievedList.indexOf(journey[journey.paxList[i]].personNames[0].surname) == -1) {
            notRetrievedList.push(journey[journey.paxList[i]].personNames[0].surname);
          }
        }
      }
      return notRetrievedList;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findNotRetrievedLastNameList function', exception);
      }
    },

    cancelAcceptance: function(input) {
      this.$logInfo('ModuleCtrl::Entering cancelAcceptance function');
      try {
        this.submitJsonRequest("ISSCICancelChckin", input, {
          scope: this,
          fn: this.__cancelAcceptance,
          args: input
        });

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in cancelAcceptance function', exception);
      }

    },

    __cancelAcceptance: function(res, input) {
      this.$logInfo('ModuleCtrl::Entering __cancelAcceptance function')
      try {
        var nextPage = res.responseJSON.homePageId;
        var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
        var errorStrings = res.responseJSON.data.checkIn[dataId].errorStrings;
        var errors = [];

        if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null && res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.CancelAcceptanceRes != null) {

          if (res.responseJSON.data.checkIn[dataId].requestParam.CancelAcceptanceRes.errors.length > 0 || dataId == "MSSCITripOverview_A") {
            /* Display Some Error Msg*/
              /*In Case Response Comes As Failure Without Any Specified Error*/
              errors.push({
                "localizedMessage": this._data.pageLabels.unsuccessfulCancelCheckin
              });
              this.displayErrors(errors, "pageErrors", "error");
              modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
              return null;

          }else if ((this.getFlowType() == "manageCheckin") || this.getFlowType() == "cancelCheckin") {
        /**BEGIN :  Getting CancelledCPR similar to SelectedCPR**/
        var cpr = this.getCPR();
        var journey = cpr[this.getSelectedCPR().journey];
        var canceledCPR = {};
        var temp_cust = {};
        var temp_flight = {};
        var cancelProducts = {};
        for(cancelAccIndex in input.cancelRequest){
	        var productID = input.cancelRequest[cancelAccIndex].prodID;
	        var paxflightId = this.findPaxFlightIdFrmProductId(cpr[this._data.selectedCPR.journey],productID);
	        var paxID = paxflightId.split('~')[0];
	        var flightID = paxflightId.split('~')[1];
	        cancelProducts[paxflightId] = "";
	        temp_cust[paxID] = "";
	        temp_flight[flightID] = "";
        }
//            customData['noOfPax'] = Object.keys(paxList).length;
//            customData['noOfSegments'] = Object.keys(flightList).length;

        /* To modify the flighttocust in canceledCPR*/
        var temp_flighttocust = [];
        for (var j in temp_flight) {
          var custs = [];
          var flightNo = j;
          for (var x in cancelProducts) {
            if (x.split('~')[1] == flightNo) {
              custs.push(x.split('~')[0]);
              if(!jQuery.isUndefined(journey[x.split('~')[0]].accompaniedByInfant) && journey[x.split('~')[0]].accompaniedByInfant){
              	custs.push(this.findInfantIDForCust(flightNo,(x.split('~')[0])));
              }
            }
          }
          temp_flighttocust.push({
            product: flightNo,
            customer: custs
          });
        }

        /* To modify the flighttocust in canceledCPR*/
        var temp_custtoflight = [];
        for (var j in temp_cust) {
          var flights = [];
          var custNo = j;
          for (var x in cancelProducts) {
            if (x.split('~')[0] == custNo) {
              flights.push(x.split('~')[1])
            }
          }
          temp_custtoflight.push({
            product: flights,
            customer: custNo
          });

          if(!jQuery.isUndefined(journey[custNo].accompaniedByInfant) && journey[custNo].accompaniedByInfant){
          	temp_custtoflight.push({
                product: flights,
                customer: this.findInfantIDForCust(flights[0],custNo)
          	});
          }
        }
        canceledCPR.flighttocust = temp_flighttocust;
        canceledCPR.custtoflight = temp_custtoflight;
        /**END : Getting CancelledCPR similar to SelectedCPR**/



        //FOR EVENT
        /* GOOGLE ANALYTICS */
        if (this._data.GADetails.siteGAEnable || this.utils.isGTMEnabled()) {

          /**Google Tag Manager (GTM)*/
          var customData = {};
          if(this.utils.isGTMEnabled()){
    	     customData = this.returnGTMCustomData("Check-in Cancellation",canceledCPR,"");
          }
            /**Google Tag Manager (GTM)*/

          var loginOrguestUser = "";
          var headerData = this.getHeaderInfo();
          if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
            loginOrguestUser = "KFMember";
          } else {
            loginOrguestUser = "GuestLogin";
          }
          var GADetails = this._data.GADetails;
          if (this.getEmbeded() && aria.core.Browser.isIOS) {

            //ga('send', 'event', 'MCIAppiPhoneCancelCheckin', loginOrguestUser, 'iPhone',input.cancelRequest.length);
            jQuery("[name='ga_track_event']").val("Category=SSCIAppiPhoneCancelCheckin&Action=" + loginOrguestUser + "&Label=iPhone&value=" + parseInt(input.cancelRequest.length));
            this.__ga.trackEvent({
              domain: GADetails.siteGADomain,
              account: GADetails.siteGAAccount,
              gaEnabled: GADetails.siteGAEnable,
              category: 'SSCIAppiPhoneCancelCheckin',
              action: loginOrguestUser,
              label: 'iPhone',
              requireTrackPage: true,
              value: parseInt(input.cancelRequest.length),
              data : customData
            });
          } else if (this.getEmbeded() && aria.core.Browser.isAndroid) {

            jQuery("[name='ga_track_event']").val("Category=SSCIAppAndroidCancelCheckin&Action=" + loginOrguestUser + "&Label=Android&value=" + parseInt(input.cancelRequest.length));
            //ga('send', 'event', 'MCIAppAndroidCancelCheckin', loginOrguestUser, 'Android',input.cancelRequest.length);
            this.__ga.trackEvent({
              domain: GADetails.siteGADomain,
              account: GADetails.siteGAAccount,
              gaEnabled: GADetails.siteGAEnable,
              category: 'SSCIAppAndroidCancelCheckin',
              action: loginOrguestUser,
              label: 'Android',
              requireTrackPage: true,
              value: parseInt(input.cancelRequest.length),
              data : customData
            });
          } else {
               //ga('send', 'event', 'MCIWebCancelCheckin', loginOrguestUser, 'Mobile Web',input.cancelRequest.length);
              this.__ga.trackEvent({
                domain: GADetails.siteGADomain,
                account: GADetails.siteGAAccount,
                gaEnabled: GADetails.siteGAEnable,
                category: 'SSCIWebCancelCheckin',
                action: loginOrguestUser,
                label: 'Mobile Web',
                requireTrackPage: true,
                value: parseInt(input.cancelRequest.length),
                data : customData
              });
          }

        }
        /* GOOGLE ANALYTICS */

          this.setFlowType("");
          var cprInput = this._data.cprInput;
          cprInput.flow = "cancelFlow";
          this.cprRetreive(cprInput);
        } else {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        }

        }else{
            /*In Case Response Comes As Failure Without Any Specified Error*/
            errors.push({
              "localizedMessage": this._data.pageLabels.unsuccessfulCancelCheckin
            });
            this.displayErrors(errors, "pageErrors", "error");
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            return null;
        }


        /* if (res.responseJSON != null && res.responseJSON.data != null && res.responseJSON.data.checkIn != null) {
           // getting next page id
               var nextPage = res.responseJSON.homePageId;
               var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

                var json = this.getModuleData();
                json.checkIn[dataId] = res.responseJSON.data.checkIn[dataId];

                this.appCtrl.load(nextPage);
             } */
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in __cancelAcceptance function', exception);
      }
    },

    sendConfirmationMail: function(input) {
      this.$logInfo('ModuleCtrl::Entering sendConfirmationMail function');
      try {
        this.submitJsonRequest("SSCIConfirmationMailSend", input);

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in sendConfirmationMail function', exception);
      }

    },

    getWarningsForThePage: function(page, _this, passengerID, flightID) {
      this.$logInfo('ModuleCtrl::Entering getWarningsForThePage function');
      try {
        var warnings = [];
        var codeCustomerList = {};
        var cpr = this.getCPR();
        var selectedCPR = this.getSelectedCPR();
        var parameter = "SITE_SSCI_WARNG_DISP_" + page;
        var pageWarnigsList = _this.parameters[parameter];
        var displayWarnings = _this.parameters.SITE_SSCI_DSPLY_WRNGS;
        if (!jQuery.isUndefined(pageWarnigsList) && !(pageWarnigsList.trim() == "") && !jQuery.isUndefined(displayWarnings) && (displayWarnings.search(/true/i) != -1)) {
          var warningList = {};
          var warningLabelList = {
            100: "0",
            101: "1",
            102: "2",
            103: "3",
            104: "4",
            105: "5",
            106: "6",
            107: "7",
            108: "8",
            109: "9",
            110: "10",
            111: "11",
            112: "12",
            113: "13",
            114: "14"
          };
          if (page == "JSEL") {
            for (var journeyNo in cpr) {
              var journey = cpr[journeyNo];
              for (var eligibilityIndex in journey.eligibility) {
                var eligibility = journey.eligibility[eligibilityIndex];
                var eligibilityType = eligibility.type.code;
                if ((eligibilityType == "ABOP") || (eligibilityType == "HPBOP") || (eligibilityType == "MBOP") || (eligibilityType == "SMS")) {
                  eligibilityType = "B";
                }
                if (pageWarnigsList.indexOf(eligibilityType) != -1) {
                  for (var reasonsIndex in eligibility.reasons) {
                    var reasons = eligibility.reasons[reasonsIndex];
                    if (reasons.listCode == "ELM" && reasons.owner == "SSCI") {
                      var code = reasons.code;
                      //	                    if (pageWarnigsList.indexOf(code) != -1) {
                      if (warningList[code] != "true" && !jQuery.isUndefined(warningLabelList[code])) {
                        var label = "warningMessage" + warningLabelList[code];
                        if (!jQuery.isUndefined(label) && !(label == "")) {
                          warnings.push({
                            "localizedMessage": _this.label[label]
                          });
                        }
                      }
                      warningList[code] = "true";
                      break;
                      //	                    }
                    }
                  }
                }
              }
              break; /*Every Journey Has Eligibiities for all products so only one is required for all journeys.*/
            }
          } else if (page == "PSEL" || page == "TOVR") {
            var journey = cpr[selectedCPR.journey];
            for (var custIndex in journey.paxList) {
              var customerId = journey.paxList[custIndex];
              for (var flightIndex in journey.flightList) {
                var flightId = journey.flightList[flightIndex];
                var constraint = customerId + flightId;
                for (var eligibilityIndex in journey.eligibility) {
                  if (eligibilityIndex.indexOf(constraint) != '-1') {
                    var eligibility = journey.eligibility[eligibilityIndex];
                    var eligibilityType = eligibility.type.code;
                    if ((eligibilityType == "ABOP") || (eligibilityType == "HPBOP") || (eligibilityType == "MBOP") || (eligibilityType == "SMS")) {
                      eligibilityType = "B";
                    }
                    if (pageWarnigsList.indexOf(eligibilityType) != -1) {
                      for (var reasonsIndex in eligibility.reasons) {
                        var reasons = eligibility.reasons[reasonsIndex];
                        if (reasons.listCode == "ELM" && reasons.owner == "SSCI") {
                          var code = reasons.code;
                          //                        if (pageWarnigsList.indexOf(code) != -1) {
                          var customerCode = code + customerId;
                          if (warningList[customerCode] != "true") {
                            if (jQuery.isUndefined(codeCustomerList[code])) {
                              codeCustomerList[code] = journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            } else {
                              codeCustomerList[code] = codeCustomerList[code] + "," + journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            }
                          }
                          warningList[customerCode] = "true";
                          break;
                          //                        }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else if (page == "FSEL") {
            var journey = cpr[selectedCPR.journey];
            for (var custIndex in selectedCPR.customer) {
              var customerId = selectedCPR.customer[custIndex];
              for (var flightIndex in journey.flightList) {
                var flightId = journey.flightList[flightIndex];
                var constraint = customerId + flightId;
                for (var eligibilityIndex in journey.eligibility) {
                  if (eligibilityIndex.indexOf(constraint) != '-1') {
                    var eligibility = journey.eligibility[eligibilityIndex];
                    var eligibilityType = eligibility.type.code;
                    if ((eligibilityType == "ABOP") || (eligibilityType == "HPBOP") || (eligibilityType == "MBOP") || (eligibilityType == "SMS")) {
                      eligibilityType = "B";
                    }
                    if (pageWarnigsList.indexOf(eligibilityType) != -1) {
                      for (var reasonsIndex in eligibility.reasons) {
                        var reasons = eligibility.reasons[reasonsIndex];
                        if (reasons.listCode == "ELM" && reasons.owner == "SSCI") {
                          var code = reasons.code;
                          // if (pageWarnigsList.indexOf(code) != -1) {
                          var customerCode = code + customerId;
                          if (warningList[customerCode] != "true") {
                            if (jQuery.isUndefined(codeCustomerList[code])) {
                              codeCustomerList[code] = journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            } else {
                              codeCustomerList[code] = codeCustomerList[code] + "," + journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            }
                          }
                          warningList[customerCode] = "true";
                          break;
                          //  }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else if ((page == "SSEL") && (null != passengerID) && (null != flightID)) {
            var journey = cpr[selectedCPR.journey];
            var customerId = passengerID;
            var flightId = flightID;
            var constraint = customerId + flightId;
            for (var eligibilityIndex in journey.eligibility) {
              if (eligibilityIndex.indexOf(constraint) != '-1') {
                var eligibility = journey.eligibility[eligibilityIndex];
                var eligibilityType = eligibility.type.code;
                if ((eligibilityType == "ABOP") || (eligibilityType == "HPBOP") || (eligibilityType == "MBOP") || (eligibilityType == "SMS")) {
                  eligibilityType = "B";
                }
                if (pageWarnigsList.indexOf(eligibilityType) != -1) {
                  for (var reasonsIndex in eligibility.reasons) {
                    var reasons = eligibility.reasons[reasonsIndex];
                    if (reasons.listCode == "ELM" && reasons.owner == "SSCI") {
                      var code = reasons.code;
                      //if (pageWarnigsList.indexOf(code) != -1) {
                      var customerCode = code + customerId;
                      if (warningList[customerCode] != "true") {
                        if (jQuery.isUndefined(codeCustomerList[code])) {
                          codeCustomerList[code] = journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                        } else {
                          codeCustomerList[code] = codeCustomerList[code] + "," + journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                        }
                      }
                      warningList[customerCode] = "true";
                      break;
                      // }
                    }
                  }
                }
              }
            }
          } else if (selectedCPR.custtoflight != null) {
            var journey = cpr[selectedCPR.journey];
            for (var custIndex in selectedCPR.custtoflight) {
              var customerId = selectedCPR.custtoflight[custIndex].customer;
              for (var flightIndex in selectedCPR.custtoflight[custIndex].product) {
                var flightId = selectedCPR.custtoflight[custIndex].product[flightIndex];
                var constraint = customerId + flightId;
                for (var eligibilityIndex in journey.eligibility) {
                  if (eligibilityIndex.indexOf(constraint) != '-1') {
                    var eligibility = journey.eligibility[eligibilityIndex];
                    var eligibilityType = eligibility.type.code;
                    if ((eligibilityType == "ABOP") || (eligibilityType == "HPBOP") || (eligibilityType == "MBOP") || (eligibilityType == "SMS")) {
                      eligibilityType = "B";
                    }
                    if (pageWarnigsList.indexOf(eligibilityType) != -1) {
                      for (var reasonsIndex in eligibility.reasons) {
                        var reasons = eligibility.reasons[reasonsIndex];
                        if (reasons.listCode == "ELM" && reasons.owner == "SSCI") {
                          var code = reasons.code;
                          // if (pageWarnigsList.indexOf(code) != -1) {
                          var customerCode = code + customerId;
                          if (warningList[customerCode] != "true") {
                            if (jQuery.isUndefined(codeCustomerList[code])) {
                              codeCustomerList[code] = journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            } else {
                              codeCustomerList[code] = codeCustomerList[code] + "," + journey[customerId].personNames[0].givenNames[0] + " " + journey[customerId].personNames[0].surname;
                            }
                          }
                          warningList[customerCode] = "true";
                          break;
                          // }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          /*BEGIN : Filling Warning Json with The Passengers Names Having that Warning Label*/
          for (var code in codeCustomerList) {
            if (!jQuery.isUndefined(warningLabelList[code])) {
              var label = "warningMessage" + warningLabelList[code];
              if (!jQuery.isUndefined(label) && !(label == "")) {
                warnings.push({
                  "localizedMessage": "<b>" + codeCustomerList[code] + "</b>" + " : " + _this.label[label]
                });
              }

            }
          }
          /*END : Filling Warning Json with The Passengers Names Having that Warning Label*/
        }

        if (warnings.length > 0) {
          _this.moduleCtrl.displayErrors(warnings, "pageWiseCommonWarnings", "warning");
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getWarningsForThePage function', exception);
      }

    },
    /**
     * setPassengerDetailsFlow
     * This method set the flow type.
     */
    setPassengerDetailsFlow: function(flow) {
      try {
        this.$logInfo('ModuleCtrl::Entering setFlowType function');
        this._data.passengerDetailsFlow = flow;
        return null;
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in setFlowType function', exception);
      }
    },
    /**
     * getPassengerDetailsFlow
     * This method get the FlowType.
     */
    getPassengerDetailsFlow: function() {
      try {
        this.$logInfo('ModuleCtrl::Entering getFlowType function');
        if (!jQuery.isUndefined(this._data.passengerDetailsFlow)) {
          return this._data.passengerDetailsFlow;
        } else {
          return null;
        }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getFlowType function', exception);
      }
    },
    /*
     * we do cancel checkin or checkin to pax, based on
     *
     * 2) When Journey selection : True
     * Regulatory update is success for all the products : Passenger will be landed on to the Confirmation page.
     * Regulatory update is failed for all the products    : All the products will be off-loaded and landed to TripSummary page with error message.
     * Regulatory update is failed for partial products    : All the products will be off-loaded and landed to TripSummary page with error message.
     * 3) When Journey selection : false
     * Regulatory update is success for all the products : Passenger will be landed on to the Confirmation page.
     * Regulatory update is failed for all the products    : All the products will be off-loaded and landed to TripSummary page with error message.
     * Regulatory update is failed for partial products    : passenger will be off-loaded into same product along with sequential products will also be off-loaded.
     *
     * */
    forModifyCheckinFlowCheckin: function() {
      this.$logInfo('ModuleCtrl::Entering forModifyCheckinFlowCheckin function');
      var cpr = this.getCPR();
      var selectedCPR = this.getSelectedCPR();
      var journey = cpr[selectedCPR.journey];
      try {
        /*
         * for cancel checkin pax
         * */
        this.cancelCheckinPAXbasedonRegResp(cpr, selectedCPR);
        /*For constructing error message*/
        var removedData = this._data.custToFlightRemovedList;
        errorID = "acceptConfErrs";
        var errors = [];
        /*Constructing input for cancel acceptance*/
        var cancelAcceptanceInput = {};
        cancelAcceptanceInput.cancelRequest = [];

        if (!jQuery.isUndefined(removedData)) {
          /*For hide hole page incase nothing to show*/
          if (jQuery.isUndefined(selectedCPR.flighttocust) && jQuery.isUndefined(selectedCPR.custtoflight)) {
            jQuery(".sectionDefaultstyle").hide();
            errorID = "regulatoryCoreErrors";
          }

          var uniqueCustList = [];
          for (var flightDetail in removedData) {
            var custList = [];
            var flightList = "";
            for (var custDetai in removedData[flightDetail]) {
              var temp = "";
              if (!jQuery.isUndefined(journey[custDetai].personNames) && !jQuery.isUndefined(journey[custDetai].personNames[0].givenNames)) {
                temp += journey[custDetai].personNames[0].givenNames[0] + " ";
              }

              if (!jQuery.isUndefined(journey[custDetai].personNames) && !jQuery.isUndefined(journey[custDetai].personNames[0].surname)) {
                temp += journey[custDetai].personNames[0].surname;
              }
              custList.push(temp);
              if (uniqueCustList.indexOf(temp) == "-1") {
                uniqueCustList.push(temp);
              }

              this.constructCancelCheckInput(cancelAcceptanceInput, custDetai, flightDetail);

            }

            if (custList.length > 1) {
              temp = custList.splice(custList.length - 1, 1);
              custList = custList.join(", ") + " " + this._data.pageLabels.and + " " + temp;
            }

            flightList = journey[flightDetail].operatingAirline.companyName.companyIDAttributes.code + journey[flightDetail].operatingAirline.flightNumber;

            /*
                 * for display cust and flight
                 * errors.push({
                  "localizedMessage": jQuery.substitute(this._data.pageLabels.paxinhibiterrormsg, [custList, flightList])
                });*/

          }
          errors.push({
            "localizedMessage": jQuery.substitute(this._data.pageLabels.cancelRegupd, [uniqueCustList.join(", ")])
          });

          if (cancelAcceptanceInput.cancelRequest.length > 0) {
            this.setErrors(errors);
            this.cancelAcceptance(cancelAcceptanceInput);

            if (errorID == "regulatoryCoreErrors") {
              jQuery("#regulatoryCoreErrors").next().removeClass("displayNone").addClass("displayBlock");
              this.displayErrors(errors, errorID, "error");
              this._data.forRestrictBackClickIncludeBrowserBack = true;
              return false;
            }
          }

        }
        /*End*/

        /*
         * For checkin pax
         * */
        var list = "",
          input = {};
        /* Getting the list of product IDs */
        for (var i = 0; i < selectedCPR.custtoflight.length; i++) {
          list = list + this.findProductidFrmflightList(cpr[selectedCPR.journey], selectedCPR.custtoflight[i].customer, selectedCPR.custtoflight[i].product);
          if (i != (selectedCPR.custtoflight.length - 1)) {
            list = list + ",";
          }
        }

        input.prodIDs = list;
        input.toBeCheckedinProds = list;
        input.custCanceledlistFromMdfCheckinFlw = (uniqueCustList == undefined ? [] : uniqueCustList);
        this.processAcceptance(input);

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in forModifyCheckinFlowCheckin function', exception);
      }
    },

    cancelCheckinPAXbasedonRegResp: function(cpr, selectedCPR) {
      this.$logInfo('ModuleCtrl::Entering cancelCheckinPAXbasedonRegResp function');
      try {
      var param = this._data.siteParameters.SITE_SSCI_INHBT_REG_INDI;
      this._data.custToFlightRemovedList = {};
      var infantID = [];

      if (jQuery.trim(param) != "") {
        /*For get check regulatory response*/
        for (var custToFlight = 0; custToFlight < selectedCPR.custtoflight.length; custToFlight++) {
          var oricustToFlight = custToFlight;
          custToFlight = selectedCPR.custtoflight[custToFlight];
          var item = cpr[selectedCPR.journey].customerDetailsBeans[custToFlight.customer];

          /*for getting status*/
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

                /*
                 *if it is true then pax bean inhibited has to remvoe from all flighttocust and custtoflight.
                 * */
                var flag = false;
                if (this._data.siteParameters.SITE_SSCI_JNY_LVL_FLT_SEL && this._data.siteParameters.SITE_SSCI_JNY_LVL_FLT_SEL.search(/true/i) != "-1") {
                  flag = true;
                }
                /*removing cust to flight from selected CPR*/
                if (custToFlight.customer == cust) {

                  /*
                   * check if infant associated to pax
                   * */
                  if (cpr[selectedCPR.journey][cust].accompaniedByInfant != null && cpr[selectedCPR.journey][cust].accompaniedByInfant == true) {
                    infantID.push(this.findInfantIDForCust(flight, cust) + "~" + flight);
                  }

                  /*
                   * This check required,
                   * If incase infant regulatory inhibited, to remove correponding adult
                   * */
                  if (cpr[selectedCPR.journey][cust].passengerTypeCode == "INF") {
                    infantID.push(this.findInfantIDForCust(flight, cust) + "~" + flight);
                  }


                  if (flag == true && custToFlight.product.indexOf(flight) != -1) {
                    /*
                     * For construct cust to flight remove list
                     * */
                    for (var tempRemoveLIstConst in custToFlight.product) {
                      /*Filling to show error messages*/
                      if (jQuery.isUndefined(this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]])) {
                        this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]] = {};
                      }
                      this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]][cust] = {};
                    }
                    custToFlight.product = [];
                  } else {
                    var temp = false;
                    for (var flightNum = 0; flightNum < custToFlight.product.length; flightNum++) {
                      var oriflightNum = flightNum;
                      flightNum = custToFlight.product[flightNum];

                      if ((flightNum == flight) || temp) {
                        temp = true;

                        /*Filling to show error messages*/
                        if (jQuery.isUndefined(this._data.custToFlightRemovedList[flightNum])) {
                          this._data.custToFlightRemovedList[flightNum] = {};
                        }
                        this._data.custToFlightRemovedList[flightNum][cust] = {};

                        //delete custToFlight.product[oriflightNum];
                        custToFlight.product.splice(oriflightNum, 1);
                        oriflightNum--;
                      }
                      flightNum = oriflightNum;

                    }
                  }

                  if (custToFlight.product.length == 0) {
                    //delete selectedCPR.custtoflight[oricustToFlight];
                    selectedCPR.custtoflight.splice(oricustToFlight, 1);
                    oricustToFlight--;
                  }

                }

                break;
              }

            }
          }
          /*End for getting status*/

          custToFlight = oricustToFlight;

        }
      }

      /*remove infant */
      if (infantID.length > 0) {
        this.removeCustInProdBasedOnCustFlight(infantID, selectedCPR);
      }

      this.reconstructSelectedCPR(selectedCPR, "flighttocust");
      this.findAdultInReminingPAX(cpr, selectedCPR);
      this.reconstructSelectedCPR(selectedCPR, "custtoflight");

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in cancelCheckinPAXbasedonRegResp function', exception);
      }

    },
    /* idToRemove -- always array, id to remove in cludes cust~flight
     *
     *
     * */
    removeCustInProdBasedOnCustFlight: function(idToRemove, selectedCPR) {
      this.$logInfo('ModuleCtrl::Entering removeCustInProdBasedOnCustFlight function');
      try {

      /*flag -- based on SITE_SSCI_JNY_LVL_FLT_SEL -- true remove cust in all pax else remove cust in particular segment on words
       * */
      var cpr = this.getCPR();
      var flag = false;
      var flagCheckValidCust = false;
      if (this._data.siteParameters.SITE_SSCI_JNY_LVL_FLT_SEL && this._data.siteParameters.SITE_SSCI_JNY_LVL_FLT_SEL.search(/true/i) != "-1") {
        flag = true;
      }


      for (var custToFlight = 0; custToFlight < selectedCPR.custtoflight.length; custToFlight++) {
        var oricustToFlight = custToFlight;
        flagCheckValidCust = false;
        custToFlight = selectedCPR.custtoflight[custToFlight];

        for (var i = 0; i < idToRemove.length; i++) {
          if (custToFlight.customer == idToRemove[i].split("~")[0]) {
            flagCheckValidCust = true;
            break;
          }
        }

        if (flagCheckValidCust == true) {
          if (flag == true && custToFlight.product.indexOf(idToRemove[i].split("~")[1]) != -1) {
            /*
             * For construct cust to flight remove list
             * */
            for (var tempRemoveLIstConst in custToFlight.product) {
              /*Filling to show error messages*/
              if (jQuery.isUndefined(this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]])) {
                this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]] = {};
              }
              this._data.custToFlightRemovedList[custToFlight.product[tempRemoveLIstConst]][custToFlight.customer] = {};
            }
            custToFlight.product = [];
          } else {
            var temp = false;
            for (var flightNum = 0; flightNum < custToFlight.product.length; flightNum++) {
              var oriflightNum = flightNum;
              flightNum = custToFlight.product[flightNum];

              if ((flightNum == idToRemove[i].split("~")[1]) || temp) {
                temp = true;

                /*Filling to show error messages*/
                if (jQuery.isUndefined(this._data.custToFlightRemovedList[flightNum])) {
                  this._data.custToFlightRemovedList[flightNum] = {};
                }
                this._data.custToFlightRemovedList[flightNum][custToFlight.customer] = {};

                //delete custToFlight.product[oriflightNum];
                custToFlight.product.splice(oriflightNum, 1);
                oriflightNum--;
              }
              flightNum = oriflightNum;

            }
          }
          if (custToFlight.product.length == 0) {
            //delete selectedCPR.custtoflight[oricustToFlight];
            selectedCPR.custtoflight.splice(oricustToFlight, 1);
            oricustToFlight--;
          }
        }

        custToFlight = oricustToFlight;
      }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in removeCustInProdBasedOnCustFlight function', exception);
      }
    },
    /*
     * reconstructSelectedCPR flag flighttocust to construct flight to cust
     * custtoflight to construct cust to flight
     * */
    reconstructSelectedCPR: function(selectedCPR, flag) {
      this.$logInfo('ModuleCtrl::Entering reconstructSelectedCPR function');
      try {
      selectedCPR[flag] = [];
      var tempFlightToCust = {};
      /*if(flag == "flighttocust")
    	{

        	for(var item in selectedCPR["custtoflight"])
        	{
        		item=selectedCPR["custtoflight"][item];
        		for(var product in item.product)
        		{
        			if(tempFlightToCust[product] == undefined)
        			{
        				tempFlightToCust[product]=[];
        				tempFlightToCust[product].push(item.customer);
        			}else if(tempFlightToCust[product].indexOf(item.customer) == "-1")
        			{
        				tempFlightToCust[product].push(item.customer);
        			}

        		}

        	}

        	for(var item in tempFlightToCust)
        	{
        		selectedCPR[flag].push({"product":item,"customer":tempFlightToCust[item]});
        	}


    	}else if(flag == "custtoflight")
    	{

        	for(var item in selectedCPR["flighttocust"])
        	{
        		item=selectedCPR["flighttocust"][item];
        		for(var customer in item.customer)
        		{
        			if(tempFlightToCust[customer] == undefined)
        			{
        				tempFlightToCust[customer]=[];
        				tempFlightToCust[customer].push(item.product);
        			}else if(tempFlightToCust[customer].indexOf(item.product) == "-1")
        			{
        				tempFlightToCust[customer].push(item.product);
        			}

        		}

        	}

        	for(var item in tempFlightToCust)
        	{
        		selectedCPR[flag].push({"customer":item,"product":tempFlightToCust[item]});
        	}

    	}*/

      var tempFlag = (flag == "flighttocust") ? "custtoflight" : "flighttocust";
      var itemVal = (tempFlag == "flighttocust") ? "customer" : "product";
      var itemValRev = (itemVal == "customer") ? "product" : "customer";
      for (var item in selectedCPR[tempFlag]) {
        item = selectedCPR[tempFlag][item];
        for (var product in item[itemVal]) {
          product = item[itemVal][product];
          if (tempFlightToCust[product] == undefined) {
            tempFlightToCust[product] = [];
            tempFlightToCust[product].push(item[itemValRev]);
          } else if (tempFlightToCust[product].indexOf(item[itemValRev]) == "-1") {
            tempFlightToCust[product].push(item[itemValRev]);
          }

        }

      }

      selectedCPR[itemVal] = [];
      var otherList = [];
      for (var item in tempFlightToCust) {
        if (tempFlightToCust[item].length > 0) {
          var temp = {};
          temp[itemVal] = item;
          temp[itemValRev] = tempFlightToCust[item];
          selectedCPR[flag].push(temp);

          selectedCPR[itemVal].push(item);

          for (var i in tempFlightToCust[item]) {
            if (otherList.indexOf(tempFlightToCust[item][i]) == -1) {
              otherList.push(tempFlightToCust[item][i]);
            }
          }
        }

      }
      selectedCPR[itemValRev] = otherList;

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in reconstructSelectedCPR function', exception);
      }
    },

    findAdultInReminingPAX: function(res, selectedCPR) {
      this.$logInfo('ModuleCtrl::Entering findAdultInReminingPAX function');
      try {
      var journeyID = selectedCPR.journey;
      var journey = res[journeyID];
      var minorAgeLmtParam = parseInt(this._data.siteParameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(this._data.siteParameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;

      var minorCheckToBePerformed = "true";

      /*Begin : Checkin Child Alone Cannot Checkin Condition*/
      for (var i = 0; i < selectedCPR.flighttocust.length; i++) {
        var childCount = 0;
        var validAdultCount = 0;
        var minorCount = 0;

        var flightID = selectedCPR.flighttocust[i].product;

        for (var j in selectedCPR.flighttocust[i].customer) {
          var custID = selectedCPR.flighttocust[i].customer[j];
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
                if (this._data.siteParameters.SITE_SSCI_SR_CANT_CI_ALON.toUpperCase().search(service.services[0].SSRCode) != "-1") {
                  ssrValidAdult = false;
                }
              }
            }

            if (ssrValidAdult) {
              if ((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1)) {
                /*BEGIN : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
                if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
                  for (var ii in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
                    if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[ii].personalDetailsBirthDate)) {
                      selDOB = new Date(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[ii].personalDetailsBirthDate);
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

        /**Checking checkedIn Pax In the Segment
         *
         * this comes to picture as BP generated pax willbe there which is not part of selected CPR or
         * cancel checkin
         * */
        if ((childCount > 0 || minorCount > 0) && validAdultCount == 0) {

          var childOrMinorNotAloneflag = false;

          for (var custIDIndex in journey.paxList) {
            var selDOB = "";
            var years = 0;
            var custID = journey.paxList[custIDIndex];
            var cust = journey[custID];
            var constraint = custID + flightID;

            /*
             * checking jurney is valid and make sure flight id and cust id not there in cancel checkin list
             * */

            if (!jQuery.isUndefined(journey.productDetailsBeans[constraint]) && selectedCPR.flighttocust[i].customer.indexOf(custID) == -1 && (this._data.custToFlightRemovedList[flightID] == undefined || this._data.custToFlightRemovedList[flightID][custID] == undefined)) {
              if (journey.productDetailsBeans[constraint].paxCheckedInStatusInCurrProd && cust.passengerTypeCode == "ADT") {
                if (((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1))) {
                  /*BEGIN : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
                  if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
                    for (var ii in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
                      if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[ii].personalDetailsBirthDate)) {
                        selDOB = new Date(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[ii].personalDetailsBirthDate);
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

                /**Checking SSR Validity**/
                var constraint = custID + flightID;
                var ssrValidAdult = true;
                for (var serviceNo in journey.service) {
                  var service = journey.service[serviceNo];
                  if (serviceNo.indexOf(constraint) != '-1') {
                    if (this._data.siteParameters.SITE_SSCI_SR_CANT_CI_ALON.toUpperCase().search(service.services[0].SSRCode) != "-1") {
                      ssrValidAdult = false;
                    }
                  }
                }

                /** Incase He Is Validated Not Minor */
                if ((years >= minorAgeLmtParam && ssrValidAdult) || (ssrValidAdult && selDOB == "")) {
                  childOrMinorNotAloneflag = true;
                  break;
                }
                /*END : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/

              }
            }
          }
          if (!childOrMinorNotAloneflag) {
            for (var j in selectedCPR.flighttocust[i].customer) {
              var custID = selectedCPR.flighttocust[i].customer[j];

              /*Filling to show error messages*/
              if (jQuery.isUndefined(this._data.custToFlightRemovedList[flightID])) {
                this._data.custToFlightRemovedList[flightID] = {};
              }
              this._data.custToFlightRemovedList[flightID][custID] = {};
              selectedCPR.flighttocust.splice(i, 1);
              i--;
              }
            }

        }
        /*End : Checkin Child Alone Cannot Checkin Condition*/

      }
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in findAdultInReminingPAX function', exception);
      }
    },

    getAgeOfCustomerInYears: function(selDOB) {
      this.$logInfo('ModuleCtrl::Entering getAgeOfCustomerInYears function');
      try {
      var years = 0;
      var dCurr = new Date(this.getsvTime("yyyy-mm-dd"));
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
        this.$logError('ModuleCtrl::An error occured in getAgeOfCustomerInYears function', exception);
      }
    },

    /*
     * cancelAcceptanceInput -- variable where cancel checkin details should get updated
     * custDetai  -- cust id
     * flightDetail -- flight id
     * */
    constructCancelCheckInput: function(cancelAcceptanceInput, custDetai, flightDetail) {
      this.$logInfo('ModuleCtrl::Entering constructCancelCheckInput function');
      try {
      var cpr = this.getCPR();
      var selectedCPR = this.getSelectedCPR();
      var journey = cpr[selectedCPR.journey];

      /*Constructing input for cancel acceptance*/
      var custID = custDetai;
      var flightID = flightDetail;
      var l_prodID = this.findProductidFrmflightid(journey, custID, flightID);
      var boardPoint = journey[flightID].departureAirport.locationCode;
      var offPoint = journey[flightID].arrivalAirport.locationCode;
      var carrier = journey[flightID].operatingAirline.companyName.companyIDAttributes.code;
      var flightNumber = journey[flightID].operatingAirline.flightNumber;
      var paxType = journey[custID].passengerTypeCode;

      if (paxType != "INF") {
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
        cancelAcceptanceInput.cancelRequest.push({
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
        if (paxTitle == null) {
          delete cancelAcceptanceInput.cancelRequest[cancelAcceptanceInput.cancelRequest.length - 1].paxTitle;
        }
      }
        /*End Constructing input for cancel acceptance*/
      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in constructCancelCheckInput function', exception);
      }
    },

    /*
     * list :
     * "[["6X","Amadeus Six"],["LH","Lufthansa"]]"
     * */
    getFrequentFlyerList: function() {
      this.$logInfo('ModuleCtrl::Entering getFrequentFlyerList function');
      try {
    	  if(!jQuery.isUndefined(this._data.frequentFlyerList) && this._data.frequentFlyerList != null){
    		  return this._data.frequentFlyerList;
    	  }else{
    		  return null;
    	  }
        var temp = [];
        for (var i = 0; i < list.length; i++) {
          temp.push(list[i][0] + ":" + list[i][1]);
        }
        return temp;
      } catch (e) {
        this.$logError('ModuleCtrl::An error occured in getFrequentFlyerList function', e);
      }
    },

    setFrequentFlyerList: function(list) {
    	this.$logInfo('ModuleCtrl::Entering setFrequentFlyerList function');
    	try {
    		if(!jQuery.isUndefined(list)){
    			var temp = [];
                for (var i = 0; i < list.length; i++) {
                  temp.push(list[i][0] + ":" + list[i][1]);
                }
                this._data.frequentFlyerList = temp;
    		}
    	} catch (e) {
    		this.$logError('ModuleCtrl::An error occured in setFrequentFlyerList function', e)
    	}

    },

    /*
     * input - pline json with fields "street,city,state,postal,country"
     * output - [{label:label,code:value}]
     * flag - Dest for destination, Home For Home
     * */
    getAutocompleteStructureFromJsonStructure: function(input,flag) {
      this.$logInfo('ModuleCtrl::Entering getAutocompleteStructureFromJsonStructure function');
      try {

    	/*For forming details, used to prefill in regulatory*/
        for(var i in input)
        {
        	if(input[i] != "")
        	{
        		this._data["reg"+flag+"DetailsAutocomplete"][i][input[i]]=input;
        	}

        	/*For auto complete streeet*/
        	this._data["reg"+flag+"DetailsAutocomplete"]["autocomplete"+flag+i+"Result"]=[];
        	for(var j in this._data["reg"+flag+"DetailsAutocomplete"][i])
        	{
        		this._data["reg"+flag+"DetailsAutocomplete"]["autocomplete"+flag+i+"Result"].push({label:j,code:j});
        	}

        }

      } catch (exception) {
        this.$logError('ModuleCtrl::An error occured in getAutocompleteStructureFromJsonStructure function', exception);
      }
    },

    getCabinClassByName: function(classN) {
      try {
        this.$logInfo('ModuleCtrl::Entering getCabinClassByName function');

        if (jsonResponse.data.checkIn[this._data.landingPageDetail].cabinClassList != undefined) {
          for (var i in jsonResponse.data.checkIn[this._data.landingPageDetail].cabinClassList) {
            if (jsonResponse.data.checkIn[this._data.landingPageDetail].cabinClassList[i][0] == classN) {
              return jsonResponse.data.checkIn[this._data.landingPageDetail].cabinClassList[i][1];
            }

          }
        }

        return "";

      } catch (e) {
        this.$logError('ModuleCtrl::An error occured in getCabinClassByName function', e);
      }
    },

    getOperatingAirline: function() {
        try {
          this.$logInfo('ModuleCtrl::Entering getOperatingAirline function');
          if (!jQuery.isUndefined(this._data.operatingAirline)) {
            return this._data.operatingAirline;
          } else {
            return null;
    }
        } catch (exception) {
          this.$logError('ModuleCtrl::An error occured in getOperatingAirline function', exception);
        }
      },

      setOperatingAirline: function(p_OperatingAirline) {
        try {
          this.$logInfo('ModuleCtrl::Entering setOperatingAirline function');
          if (p_OperatingAirline != null) {
            this._data.operatingAirline = p_OperatingAirline;
          } else {
            return null;
          }
        } catch (exception) {
          this.$logError('ModuleCtrl::An error occured in setOperatingAirline function', exception);
        }
      },

      /**dataLayer = [{
		'flightSegment': 'SIN-SYD',
		'cabinClass': 'economy',
		'kfTier': 'Krisflyer'
		'nationality': 'SG',
	 	'gender': 'M',
		'age': 30,
		Days  ':30',As discussed we will use the days prior to departure.
		'seatPreSelected': 'Y',
		'thruCheckIn': 'N',
		'event': 'Check-in Cancellation'
	    }];

	    l_event - This Decides the Flow
          ---Values of l_event can be
          1.Check-in Confirmation
          2.Seat selection
          3.Check-in Cancellation


	    custFlightDetails - Its structure should be similar to SelectedCPR and Madatorly have custoflight and flighttocust
	    l_seatPreSelected - Is Required only if Flow(l_event) is Checkin
       **/
      returnGTMCustomData : function(l_event,custFlightDetails,l_seatPreSelected){
    	  try{
    		  this.$logInfo('ModuleCtrl::Entering returnGTMCustomData function');
    		  var customData = {};
       		  var cpr = this.getCPR();
    	      var journey = cpr[this.getSelectedCPR().journey];
    	      var cprInfomations = this._data.selectedCustFlightInformations;
    	      if(jQuery.isUndefined(cprInfomations)){
    	    	  cprInfomations = {};
    	      }

    		  if(l_event == "Seat selection"){
    			  var seatUpdate = custFlightDetails;
	    		  var uniqueProductList = {};
	    		  var uniqueFlightList = {};
	              if (seatUpdate && !jQuery.isUndefined(seatUpdate.functionalContent) && !jQuery.isUndefined(seatUpdate.functionalContent.seats)) {
	                  for (var seatNo in seatUpdate.functionalContent.seats) {
	                	if(!jQuery.isUndefined(seatUpdate.functionalContent.seats[seatNo]) && !jQuery.isUndefined(seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerLegID)
	                			&& !jQuery.isUndefined(seatUpdate.functionalContent.seats[seatNo].referenceIDLegPassengerPassengerID)){
	                		var seatInfo = seatUpdate.functionalContent.seats[seatNo];
		                    var referenceIDLegPassengerLegID = seatInfo.referenceIDLegPassengerLegID;
		                    var referenceIDLegPassengerPassengerID = seatInfo.referenceIDLegPassengerPassengerID;
		                    var referenceIDFlightID = referenceIDLegPassengerLegID.substring(0,referenceIDLegPassengerLegID.lastIndexOf("-"));
		                    var referenceIDProductID = referenceIDLegPassengerPassengerID + referenceIDFlightID;
		                    if(jQuery.isUndefined(uniqueProductList[referenceIDProductID])){
		                    	 uniqueProductList[referenceIDProductID] = "";
		                    	 var flightID = referenceIDFlightID;
		                   	  	 var flight = journey[flightID];
		                   	  	 if(jQuery.isUndefined(cprInfomations[referenceIDProductID])){
		                   	  		 cprInfomations[referenceIDProductID] = {};
		                   	  	 }
		                   	  	 if(jQuery.isUndefined(uniqueFlightList[flightID])){
		                   	  		 uniqueFlightList[flightID] = "";
			                   	  	 if(jQuery.isUndefined(cprInfomations[flightID])){
			                   	  		 cprInfomations[flightID] = {};
			                   	  	 }
			                    	 /**flightSegment*/
			                    	 var flightHopPoint = "";
			                    	 var flightHopPoint = flight.departureAirport.locationCode+"-"+flight.arrivalAirport.locationCode;
			   	            	  	 customData['flightSegment'] = (customData['flightSegment'] == undefined) ? (flightHopPoint) : (customData['flightSegment'] + "|" + flightHopPoint);
			   	            	  	 cprInfomations[flightID]['flightSegment'] = flightHopPoint;

				   	            	  /**Cabin Class*/
				   	            	  var cabinClass = "";
				   	            	  if(!jQuery.isUndefined(journey.cabinInformation) &&
				   	            			  (!jQuery.isUndefined(journey.cabinInformation.product))
				   	            			  &&(!jQuery.isUndefined(journey.cabinInformation.product[referenceIDProductID]))){
				   	            		  var bookingInfo = journey.cabinInformation.product[referenceIDProductID];
			   	            			  cabinClass = this.getCabinClassByName(bookingInfo.bookingClass);
			   	            			  if(cabinClass == ""){
			   	            				cabinClass = bookingInfo.bookingClass;
			   	            			  }
				   	            	  }
				   	              	  if(cabinClass != ""){
				   	              		  customData['cabinClass'] = (customData['cabinClass'] == undefined) ? (cabinClass) : (customData['cabinClass'] + "|" + cabinClass);
				   	              		  cprInfomations[flightID]['cabinClass'] = cabinClass;
				   	              	  }

					              	  /**Time Prior To Checkin**/
					              	  var date1 = new Date(flight.timings.SDT.time);
					              	  var date2 = new Date(this.getsvTime());
					              	  var hours = Math.floor((date1-date2)/ 36e5);
					              	  var days = Math.floor(hours/24);
					              	  customData['timePriorToDepartureInHrs'] = (customData['timePriorToDepartureInHrs'] == undefined)?(hours):(customData['timePriorToDepartureInHrs'] + "," +hours) ;
					              	  customData['timePriorToDepartureInDays'] = (customData['timePriorToDepartureInDays'] == undefined)?(days):(customData['timePriorToDepartureInDays'] + "," +days) ;
					              	  cprInfomations[flightID]['timePriorToDepartureInHrs'] = hours;
		                   	  	 }
			   	              	  /**Seat Type**/
			   	              	  var seatType = "";
			   	              	  if(!jQuery.isUndefined(seatInfo.seatCharacteristic)){
			   	              		seatType = seatInfo.seatCharacteristic;
			   	              	  }
			   	              	  customData['seatType'] = (customData['seatType'] == undefined) ? (seatType) : (customData['seatType'] + "|" + seatType);
			   	              	  cprInfomations[referenceIDProductID]['seatType'] = seatType;

		            			  /**Seat Number**/
				                  var seat = seatInfo.row + seatInfo.column;
				                  customData['seatNumber'] = (customData['seatNumber'] == undefined) ? (seat) : (customData['seatNumber'] + "|" + seat);
				                  cprInfomations[referenceIDProductID]['seatNumber'] = seat;

				                  /**NumberOfPax***/
				                  customData['numberOfPax'] = (customData['numberOfPax'] == undefined) ? 1 : (customData['numberOfPax'] + 1);
		                    }
	                	}
	                  }
	                }
    		  }else if((l_event == "Check-in Confirmation")||(l_event == "Check-in Cancellation") ){

    			  var selectedCPR = custFlightDetails;

    		  var acceptedProductsCount = 0;

    		  /**Flight Loop**/
              for(var flightIndex in selectedCPR.flighttocust){
            	  var flightInfo = selectedCPR.flighttocust[flightIndex];
            	  var flightID = flightInfo.product;
            	  var flight = journey[flightID];
        	      if(jQuery.isUndefined(cprInfomations[flightID])){
        	    	  cprInfomations[flightID] = {};
        	      }

	            	  /**flightSegment*/
	            	  var flightHopPoint = "";
	            	  var flightHopPoint = flight.departureAirport.locationCode+"-"+flight.arrivalAirport.locationCode;
	            	  customData['flightSegment'] = (customData['flightSegment'] == undefined) ? (flightHopPoint) : (customData['flightSegment'] + "|" + flightHopPoint);
	            	  cprInfomations[flightID]['flightSegment'] = flightHopPoint;

	            	  /**Cabin Class*/
	            	  var cabinClass = ""
	            	  for(var bookingInfoIndex in journey.cabinInformation.product){
	            		  var bookingInfo = journey.cabinInformation.product[bookingInfoIndex];
	            		  if(bookingInfoIndex.indexOf(flightID) != '-1'){
	            			  cabinClass = this.getCabinClassByName(bookingInfo.bookingClass);
	            			  if(cabinClass == ""){
	   	            				cabinClass = bookingInfo.bookingClass;
   	            			  }
	            			  break;
	            		  }
	            	  }
	              	  if(cabinClass != ""){
	              		  customData['cabinClass'] = (customData['cabinClass'] == undefined) ? (cabinClass) : (customData['cabinClass'] + "|" + cabinClass);
	              		  cprInfomations[flightID]['cabinClass'] = cabinClass;
	              	  }


	              	  /**Time Prior To Checkin**/
	              	  var date1 = new Date(flight.timings.SDT.time);
	              	  var date2 = new Date(this.getsvTime());
	              	  var hours = Math.floor((date1-date2)/ 36e5);
	              	  var days = Math.floor(hours/24);
	              	  customData['timePriorToDepartureInHrs'] = (customData['timePriorToDepartureInHrs'] == undefined)?(hours):(customData['timePriorToDepartureInHrs'] + "," +hours) ;
	              	  customData['timePriorToDepartureInDays'] = (customData['timePriorToDepartureInDays'] == undefined)?(days):(customData['timePriorToDepartureInDays'] + "," +days) ;
	              	  cprInfomations[flightID]['timePriorToDepartureInHrs'] = hours;

              	  /**No Of Products**/
            	  for(var customerIndex in selectedCPR.flighttocust[flightIndex].customer){
            		  var customerID = selectedCPR.flighttocust[flightIndex].customer[customerIndex];
            		  var cust = journey[customerID];
	            		  if(!jQuery.isUndefined(journey[customerID])){
            			  acceptedProductsCount++;
            		  }
            	  }
              }
              /**Customer Looping**/
              for(var customerIndex in selectedCPR.custtoflight){
            	  var customerID = selectedCPR.custtoflight[customerIndex].customer;
            	  var customer = journey[customerID];
        	      if(jQuery.isUndefined(cprInfomations[customerID])){
        	    	  cprInfomations[customerID] = {};
        	      }
            	  /**Nationality**/

	            	  var custNationality = "";
	    	          if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas.length))) {
	    	              for (var reqDataIndex in journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas) {
	    	                if (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality)) {
	    	                  custNationality = journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality;
	    	                  break;
	    	                }
	    	              }
	    	           }
	    	          if(custNationality == "" && !jQuery.isUndefined(customer.citizenShipCountryCode) && customer.citizenShipCountryCode != ""){
	    	        	  custNationality = customer.citizenShipCountryCode;
	    	          }
	    	          if(custNationality != ""){
	    	        	  customData['nationality'] = (customData['nationality'] == undefined) ? (custNationality) : (customData['nationality'] + "|" + custNationality);
	    	        	  cprInfomations[customerID]['nationality'] = custNationality;
	    	          }

    	          /**Gender***/
	    	          var custGender = "";
	    	          if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID]))
	    	        		  &&(!jQuery.isUndefined(journey.customerDetailsBeans[customerID].gender)) && (journey.customerDetailsBeans[customerID].gender.trim() != "")) {
	    	        	  custGender = journey.customerDetailsBeans[customerID].gender.trim();
	    	        	  if(custGender.search(/Male/i) != '-1'){
	    	        		  custGender = "M";
	    	        	  }else if(custGender.search(/Female/i) != '-1'){
	    	        		  custGender = "F";
      }
	    	          }
	    	          if(custGender != ""){
	    	        	  customData['gender'] = (customData['gender'] == undefined) ? (custGender) : (customData['gender'] + "|" + custGender);
	    	        	  cprInfomations[customerID]['gender'] = custGender;
	    	          }

    	          /**Age**/
	    	          var selDOB = "";
	    	          var years = -1;

	    	          //DOB
	    	          if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas.length))) {
	    	        	  for (var reqDataIndex in journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas) {
	    	        		  if (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate)) {
	                            selDOB = new Date(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate);
	                            break;
	    	        		  }
	    	        	  }
	    	          }
	    	          /**If Not Found in Regulatory Details Beans then find in IDC*/
	    	          if (selDOB == "") {
	    	        	  if (!jQuery.isUndefined(customer.birthDate)) {
	            		  	selDOB = new Date(customer.birthDate);
	    	        	  }
	    	          }
	    	          /**Finally Checkin DOB Validity*/
	    	          if (selDOB != "") {
	    	        	  years = this.getAgeOfCustomerInYears(selDOB);
	    	          }
	    	          if(years != -1){
	    	        	  customData['age'] =  (customData['age'] == undefined)?(years):(customData['age'] + "," +years);
	    	        	  cprInfomations[customerID]['age'] = years;
	    	          }
    	          }
              if(l_event == "Check-in Confirmation"){
            	  customData['seatPreSelected'] = l_seatPreSelected;
              }
	        	  /***Through Checkin**/
	              customData['throughCheckIn'] = "Y";


	              /**Kris Flyer**/
	              var loginOrguestUser = "";
	              var headerData = this.getHeaderInfo()
	              if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData) && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(headerData.bannerHtml)) {
	            	  loginOrguestUser = "KFMember";
	              } else {
	            	  loginOrguestUser = "GuestLogin";
	              }
	              customData['kfTier'] = loginOrguestUser;
    	  	  }//Check - in and Cancel Check-in Block

              customData['event'] = l_event;
    	      this._data.selectedCustFlightInformations = cprInfomations;
    	      //console.log(this._data.selectedCustFlightInformations);

        	  return customData;
    	  } catch (exception) {
    		 this.$logError('ModuleCtrl::An error occured in returnGTMCustomData function',exception);
    	  }
      },


      /*Forming General Usable Data
      {
        "6X-514-20141222":{
                    "flightSegment":"HEL-LHR",
                    "cabinClass":"Economy",
                    "timePriorToDepartureInHrs":-663,
                    "departureCity":HELSINKI,
                    "arrivalCity":"LONDON",
                    "departureTime":"",
                    "arrivalTime":""
        },
        "2416260E0000C51B":{
                    "nationality":"IN",
                    "gender":"M",
                    "age":89}
      }

      */
      formingSelectedCustFlightInfo : function(){
        this.$logInfo('ModuleCtrl::Entering formingSelectedCustFlightInfo function');
        try{
            var cprInfomations = this._data.selectedCustFlightInformations;
            if(jQuery.isUndefined(cprInfomations)){
              cprInfomations = {};
            }
            var cpr = this.getCPR();
            var journey = cpr[this.getSelectedCPR().journey];
            var selectedCPR = this.getSelectedCPR();
                    /**Flight Loop**/
              for(var flightIndex in selectedCPR.flighttocust){
                var flightInfo = selectedCPR.flighttocust[flightIndex];
                var flightID = flightInfo.product;
                var flight = journey[flightID];
                if(jQuery.isUndefined(cprInfomations[flightID])){
                  cprInfomations[flightID] = {};
                }

                /**Origin(3 Letter Code) ,Destination(3 Letter Code),Arrival Time and Departure Time**/
                if(!jQuery.isUndefined(journey[flightID].departureAirport) && !jQuery.isUndefined(journey[flightID].arrivalAirport)
                  && !jQuery.isUndefined(journey[flightID].timings.SDT) && !jQuery.isUndefined(journey[flightID].timings.SAT)){
                  cprInfomations[flightID]['departureCity'] = journey[flightID].departureAirport.airportLocation.cityName;
                  cprInfomations[flightID]['arrivalCity'] = journey[flightID].arrivalAirport.airportLocation.cityName;
                  cprInfomations[flightID]['departureTime'] = journey[flightID].timings.SDT.time;
                  cprInfomations[flightID]['arrivalTime'] = journey[flightID].timings.SAT.time;
                }

                /**flightSegment*/
                var flightHopPoint = "";
                var flightHopPoint = flight.departureAirport.locationCode+"-"+flight.arrivalAirport.locationCode;
                cprInfomations[flightID]['flightSegment'] = flightHopPoint;

                /**Cabin Class*/
                var cabinClass = "";
                for(var bookingInfoIndex in journey.cabinInformation.product){
                  var bookingInfo = journey.cabinInformation.product[bookingInfoIndex];
                  if(bookingInfoIndex.indexOf(flightID) != '-1'){
                    cabinClass = this.getCabinClassByName(bookingInfo.bookingClass);
                    if(cabinClass == ""){
                        cabinClass = bookingInfo.bookingClass;
                      }
                    break;
                  }
                }
                if(cabinClass != ""){
                  cprInfomations[flightID]['cabinClass'] = cabinClass;
                }


                /**Time Prior To Checkin**/
                var date1 = new Date(flight.timings.SDT.time);
                var date2 = new Date(this.getsvTime());
                var hours = Math.floor((date1-date2)/ 36e5);
                var days = Math.floor(hours/24);
                cprInfomations[flightID]['timePriorToDepartureInHrs'] = hours;

              }
              /**Customer Looping**/
              for(var customerIndex in selectedCPR.custtoflight){
                var customerID = selectedCPR.custtoflight[customerIndex].customer;
                var customer = journey[customerID];
                if(jQuery.isUndefined(cprInfomations[customerID])){
                  cprInfomations[customerID] = {};
                }
                /**Nationality**/
                var custNationality = "";
                if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas.length))) {
                    for (var reqDataIndex in journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas) {
                      if (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality)) {
                        custNationality = journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsNationality;
                        break;
                      }
                    }
                 }
                if(custNationality == "" && !jQuery.isUndefined(customer.citizenShipCountryCode) && customer.citizenShipCountryCode != ""){
                  custNationality = customer.citizenShipCountryCode;
                }
                if(custNationality != ""){
                  cprInfomations[customerID]['nationality'] = custNationality;
                }

                /**Gender***/
                var custGender = "";
                if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID]))
                    &&(!jQuery.isUndefined(journey.customerDetailsBeans[customerID].gender)) && (journey.customerDetailsBeans[customerID].gender.trim() != "")) {
                  custGender = journey.customerDetailsBeans[customerID].gender.trim();
                  if(custGender.search(/Male/i) != '-1'){
                    custGender = "M";
                  }else if(custGender.search(/Female/i) != '-1'){
                    custGender = "F";
                  }
                }
                if(custGender != ""){
                  cprInfomations[customerID]['gender'] = custGender;
                }

                /**Age**/
                var selDOB = "";
                var years = -1;

                //DOB
                if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas.length))) {
                  for (var reqDataIndex in journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas) {
                    if (!jQuery.isUndefined(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate)) {
                            selDOB = new Date(journey.customerDetailsBeans[customerID].regulatoryDetails.requirementDatas[reqDataIndex].personalDetailsBirthDate);
                            break;
                    }
                  }
                }
                /**If Not Found in Regulatory Details Beans then find in IDC*/
                if (selDOB == "") {
                  if (!jQuery.isUndefined(customer.birthDate)) {
                    selDOB = new Date(customer.birthDate);
                  }
                }
                /**Finally Checkin DOB Validity*/
                if (selDOB != "") {
                  years = this.getAgeOfCustomerInYears(selDOB);
                }
                if(years != -1){
                  cprInfomations[customerID]['age'] = years;
                }
              }
              this._data.selectedCustFlightInformations = cprInfomations;
        } catch(exception) {
          this.$logError('ModuleCtrl::An error occured in formingSelectedCustFlightInfo function', exception);
        }
       },

      /*
       * id - id of div where template should load
       * path - path of tpl to load
       * input - input if any to tpl
       * */
      loadRequiredPage: function(event,args) {
			this.$logInfo('ModuleCtrl::Entering showRetrievePage function');
			try {
				Aria.loadTemplate({
			          classpath: args.path,
			          moduleCtrl: this,
			          div: args.id,
			          args:[args.input]
			        });
			} catch (exception) {
				this.$logError('ModuleCtrl::An error occured in showRetrievePage function', exception);
			}
      },
      /**
       * iScrollBaseid - wrapper id
       * currentPageReference - tpl page reference where it is calling frm
       * baseOl - base <ol> id
       * callback - call back to call onscrollend, undefined in no call
       * flag - null for carrousal, can send some thing to add to iscroll object in case of any other purpose and flag.flow tell which context it is calling from
       * Ex: for seat map scroller sending for over ride some of actions
       */
      iScrollImpl : function(iScrollBaseid,currentPageReference,baseOl,callback,flag){
      	this.$logInfo('ModuleCtrl::Entering iScrollImpl function');
      	try{
      		var sizeOfPax = jQuery('#'+baseOl+">li").length;
        	  var scrollerWidth = 100 * sizeOfPax;
        	  var liWidth = jQuery("#"+iScrollBaseid).width()-3;
            document.getElementById(baseOl).style.width = scrollerWidth.toString() + "%";
        	  for (var pax=0;pax<sizeOfPax;pax++) {
        		if(flag != undefined && flag.flow == "seatmap")
        		{
        			jQuery("#"+iScrollBaseid+" ol>li").eq(pax).css("width",(100/sizeOfPax) + "%");
        		}else
        		{
        			//jQuery("#"+iScrollBaseid+" ol>li").eq(pax).css("width",liWidth.toString() + "px");
        			jQuery("#"+iScrollBaseid+" ol>li").eq(pax).css("width",(100/sizeOfPax) + "%");
      }
            }

        	flag=(flag == undefined)?{}:flag;
        	var object={
      		snap: "li",
      		hScrollbar: false,
      		vScrollbar: false,
      		vScroll: false,
          		hScroll:true,
      		checkDOMChanges: true,
      		momentum: false,
      		snapSpeed: 400,
      		snapThreshold:100,
      		onScrollEnd: function() {

          			/*Animating header*/
          			if(flag != undefined && flag.flow == "seatmap")
          			{
          				/*if(this.y != 0)
      			{
          		    		jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").addClass("animate");
          		    		jQuery("aside.seatFilter#filters").removeClass("animate");
          		    		jQuery("aside.seatLegend#help").removeClass("animate");
          		    	}else
      				{
          		    		jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").removeClass("animate");
          		    	}*/
          		    	jQuery("#stmpFooterId.stmpFooter").removeClass("animate");

      				}

          			/*
          			 * For stop processing further incase iscroll not made to complete i.e not moved from one page to other
          			 * */
          			if(this.previousPaxInx == this.currPageX)
          			{
          				return null;
      			}
          			this.previousPaxInx=this.currPageX;

          			if(callback != undefined && flag.flow == undefined)
          			{
          				callback.call(currentPageReference,this.currPageX+1,sizeOfPax);
          				if(currentPageReference.seatmapScroller != undefined && flag.pingpong == 0)
          				{
          					currentPageReference.seatmapScroller.scrollToPage(this.currPageX, 0);
          					flag.pingpong=1;
      		}

          			}else if(flag != undefined && flag.flow == "seatmap" && flag.pingpong == 0)
          			{
          				currentPageReference.myscroll.scrollToPage(this.currPageX, 0);
          				flag.pingpong=1;

                }

      		},
			onScrollMove:function(){

          			if(flag != undefined && flag.flow == "seatmap")
          			{
          				jQuery("#stmpFooterId.stmpFooter").addClass("animate");
          			}
          		},
          		onScrollStart:function(){
          			flag.pingpong=0;
          		},
          		onBeforeScrollEnd:function(){

          		},
          		onBeforeScrollStart: function ( e ) {
          	        /*if ( this.absDistX > (this.absDistY + 5 ) && object.eventPassthrough && object.eventPassthrough == true ) {
          	            // user is scrolling the x axis, so prevent the browsers' native scrolling
          	            e.preventDefault();
          	        }*/
          	    }
          	   }

        	/*For replace flag property with existing*/
        	if(Object.setPrototypeOf != undefined)
        	{
        		Object.setPrototypeOf(flag,object);
        	}else
        	{
        		flag.__proto__=object;
        	}


            var myscroll = new iScroll(iScrollBaseid, flag);

            /*****For remove curosal pax div margin and pax********/
            if (sizeOfPax == 1) {
              if(flag.flow == undefined)
              {
            	  jQuery('#leftArrow').remove();
                  jQuery('#rightArrow').remove();
                  jQuery('#'+baseOl+">li").addClass("carrousalSingalePax");
              }

              /*For remove seatmap prev next button*/
              if(flag.flow == "seatmap")
              {
            	  jQuery("#stmpFooterId").children().eq(0).remove();
            	  jQuery("#stmpFooterId").children().eq(1).remove();
              }
            }

            return myscroll;
        }catch (exception) {
            this.$logError(
                    'ModuleCtrl::An error occured in iScrollImpl function',
                    exception);
                }

      },
      storeTripForDirectCall : function(cprInput){
          this.$logInfo('CheckinModuleCtrl::Entering storeTripForDirectCall function');
          try {
          var cpr = this.getCPR();

          //Getting Last Name
          if(!jQuery.isUndefined(cprInput)){
        	  if(!jQuery.isUndefined(cprInput.identificationMethod)){
        		  if(!jQuery.isUndefined(cprInput.identificationMethod.recordLocator)){
        	  this._data.cprInput.IdentificationType = "bookingNumber";
            		  this._data.cprInput.recLoc = cprInput.identificationMethod.recordLocator;
            	  }
            	  if(!jQuery.isUndefined(cprInput.identificationMethod.ETicket)){
            		  this._data.cprInput.IdentificationType = "eticketNumber";
            		  this._data.cprInput.eticketNumber = cprInput.identificationMethod.ETicket;
            	  }
            	  if(!jQuery.isUndefined(cprInput.identificationMethod.FQTV) && !jQuery.isUndefined(cprInput.identificationMethod.FQTV.membershipID) && !jQuery.isUndefined(cprInput.identificationMethod.FQTV.programID)){
            		  this._data.cprInput.IdentificationType = "frequentFlyerNumber";
            		  this._data.cprInput.ffNumber = cprInput.identificationMethod.FQTV.membershipID;
            		  this._data.cprInput.carrier = cprInput.identificationMethod.FQTV.programID;
            	  }
        	  }
        	  if(!jQuery.isUndefined(cprInput.identificationAdditionalElement)){
        		  if(!jQuery.isUndefined(cprInput.identificationAdditionalElement.name)){
            		  this._data.cprInput.lastName = cprInput.identificationAdditionalElement.name;
            		  this.setLastName(this._data.cprInput.lastName);
            		  this.storeDataLocally("lstName", this.getLastName());
            	  }
            	  if(!jQuery.isUndefined(cprInput.identificationAdditionalElement.boardpoint)){
            		  this._data.cprInput.boardpoint = cprInput.identificationAdditionalElement.boardpoint;
            	  }
            	  if(!jQuery.isUndefined(cprInput.identificationAdditionalElement.departureDate)){
            		  this._data.cprInput.departureDate = cprInput.identificationAdditionalElement.departureDate;
            	  }
        	  }
          }




          var pnrDetails = {};

          for (var journey in cpr) {
            var pax1 = cpr[journey].paxList[0];
            var recLoc = cpr[journey].bookingInformations[pax1].recordLocator;

            for (var item in cpr[journey].flightList) {
              var flightID = cpr[journey].flightList[item];
              var flightDetails = {
                "departureCityCode": cpr[journey][flightID].departureAirport.locationCode,
                "arrivalCityCode": cpr[journey][flightID].arrivalAirport.locationCode,
                "departureCityName": cpr[journey][flightID].departureAirport.airportLocation.cityName,
                "arrivalCityName": cpr[journey][flightID].arrivalAirport.airportLocation.cityName,
                "departureTime": cpr[journey].productDetailsBeans[flightID].departureTime,
                "arrivalTime": cpr[journey].productDetailsBeans[flightID].arrivalTime
              }

              if (jQuery.isUndefined(pnrDetails[recLoc])) {
                pnrDetails[recLoc] = {};
                pnrDetails[recLoc][flightID] = flightDetails;
                pnrDetails[recLoc].flightList = [];
                pnrDetails[recLoc].flightList.push(flightID);

              } else {
                pnrDetails[recLoc][flightID] = flightDetails;
                pnrDetails[recLoc].flightList.push(flightID);
              }

            }

          }

          var pnrJSONtoBeStored = {};

          for (var pnr in pnrDetails) {

            var flightListtoSort = pnrDetails[pnr].flightList;

            flightListtoSort.sort(function(a, b) {
              var dateA = new Date(pnrDetails[pnr][a].departureTime);
              var dateB = new Date(pnrDetails[pnr][b].departureTime);
              return dateA - dateB //sort by date ascending
            })

            pnrDetails[pnr].flightList = flightListtoSort;

            var tripDetailsJSON = this.formJSONtoStoreLocallyForFF(pnr, pnrDetails[pnr]);
            pnrJSONtoBeStored[pnr] = tripDetailsJSON;
          }

          this.storeMultipleTripsInLocalStorage(pnrJSONtoBeStored);
          } catch (exception) {
              this.$logError('CheckinModuleCtrl::An error occured in storeTripForDirectCall function', exception);
          }

      },
      addToPassBook: function(productId) {
          this.$logInfo('CheckinModuleCtrl::Entering addToPassBook function');
          try {

        	 modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        	 jQuery(".msk").addClass("passbookZIndexInc");
             var cpr = this.getCPR();
             var selectedCPR = this.getSelectedCPR();
             var journey = selectedCPR.journey;
             var paxIDandFlightID = this.findPaxFlightIdFrmProductId(cpr[journey], productId);

             var customerID = paxIDandFlightID.split("~")[0];
             var flightID = paxIDandFlightID.split("~")[1];

             var productList =[];
             var selectedMBPs =[]

             if(cpr[journey][customerID].passengerTypeCode=="INF"){
                var infAdultCustID = this.findInfantIDForCust(flightID, customerID);
                var infAdultProdID = this.findProductidFrmflightid(cpr[journey], infAdultCustID, flightID);
                productList.push(infAdultProdID);
             }else{
                productList.push(productId);
             }
             selectedMBPs.push({
                "productList": productList
             });

             var input = {
                "bpRequests": selectedMBPs,
                "bpType": "passbook",
                "fromPage": "BoardingPass",
                "passBookFor" : productId
             };

             this.deliverDocument(input);
             return input;
          } catch (exception) {
             this.$logError('CheckinModuleCtrl::An error occured in addToPassBook function', exception);
          }
      },

    isMBPallowedForProduct: function(prodID, parameters) {
      this.$logInfo('CheckinModuleCtrl::Entering isMBPallowedForProduct function');
      try {
        var isMBPallowedForProd = false;
        var disableMBP = false;

        var CPRdata = this.getCPR();
        var selectedCPR = this.getSelectedCPR();
        var journey = CPRdata[selectedCPR.journey];

        var paxIDandFlightID = this.findPaxFlightIdFrmProductId(journey, prodID);
        var paxID = paxIDandFlightID.split("~")[0];
        var flightID = paxIDandFlightID.split("~")[1];

        var originLocation = journey[flightID].departureAirport.locationCode;
        var destinLocation = journey[flightID].arrivalAirport.locationCode;
        if ((parameters.SITE_SSCI_MBP_ALOD_ORG.trim() != "") && (parameters.SITE_SSCI_MBP_ALOD_ORG.search(originLocation) == -1) || parameters.SITE_SSCI_MBP_DBL_DST_LST.search(destinLocation) != -1) {
          disableMBP = true;
        }

        if (!disableMBP && journey.productDetailsBeans[paxID + flightID].MBPAllowed == true) {
          isMBPallowedForProd = true;
        }

        return isMBPallowedForProd;

      } catch (exception) {
        this.$logError('CheckinModuleCtrl::An error occured in isMBPallowedForProduct function', exception);
      }
      }
  }
});