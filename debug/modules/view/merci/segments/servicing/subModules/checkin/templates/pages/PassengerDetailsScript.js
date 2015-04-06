Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.PassengerDetailsScript',

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
        this.label = pageData.MPassengerDetails_A.labels;
        this.parameters = pageData.MPassengerDetails_A.parameters;
        this.siteParams = pageData.MPassengerDetails_A.siteParam;
        this.rqstParams = pageData.MPassengerDetails_A.requestParam;
        this.uiErrors = pageData.MPassengerDetails_A.errorStrings;

        this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, true);

        var airlineDl = pageData.MPassengerDetails_A.airlineDl;
        var site_mci_op_airline = this.parameters.SITE_MCI_OP_AIRLINE;
        var site_mci_grp_of_airlines = this.parameters.SITE_MCI_GRP_OF_AIRLINES;
        this.moduleCtrl.setOperatingAirlinesList(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines);

        this.configuredAirlinesList = this.moduleCtrl.getOperatingAirlinesList();

      } catch (_ex) {
        this.$logError('AcceptanceConfirmationScript: an error has occured in dataReady function');
      }
    },
    previousPax: function(evt) {
		if(jQuery("#leftArrow").text() != "0")
		{
			this.myscroll.scrollToPage('prev', 0);
		}
	},

	nextPax: function(evt) {
		if(jQuery("#rightArrow").text() != "0")
		{
			this.myscroll.scrollToPage('next', 0);
		}
	},

    $viewReady: function() {

      this.$logInfo('PassengerDetailsScript::Entering Viewready function');

      /**For increase document height incase when keyboard apper to give extra scroller*****************/
      jQuery(document).on("focus",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select", function() {
        jQuery(".sectionDefaultstyle").css("margin-bottom", "200px")
      });
      jQuery(document).on("blur",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select", function() {
        jQuery(".sectionDefaultstyle").css("margin-bottom", "0")
      });


      var __this = this;
      //For properly display header select pax of nationality screen
      //jQuery("body").css("overflow-y", "hidden");
	  this.paxDisplay = jQuery("#title"+ __this.moduleCtrl.getSelectedEditpax()).attr("data-li-position");
	  this.myscroll=this.moduleCtrl.iScrollImpl('paxscroller',__this,"mycarousel","title",this.iScrollCallBack);
	  this.myscroll.scrollToPage((parseInt(this.paxDisplay)-1), 0);

      var countryListCodeJson = this.moduleCtrl.getTelephoneNumberList();
      var countryListJson = "";
      for (var i in countryListCodeJson) {
        countryListJson += "{\"label\":\"" + (i + "(+" + countryListCodeJson[i].callingCode + ")") + "\",\"value\":\"" + countryListCodeJson[i].callingCode + "\"},";
      }
      countryListJson = countryListJson.substr(0, countryListJson.length - 1)
      countryListJson = JSON.parse("[" + countryListJson + "]");
      $("input[autocomplete-enabled='true']").autocomplete({
        highlight: function(value, term) {
          return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        },
        source: countryListJson,
        minLength: 1 // specifies the minimum number of characters a user. has to type before the Autocomplete activates.
      });

      //},400);

      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Passenger details");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=PassengerDetails";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
          page: 'Passenger details',
          GTMPage: 'Passenger details'
        });
      }

      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(this.parameters.SITE_MCI_GA_ENABLE)
       {
        ga('send', 'pageview', {'page': 'Passenger details','title': 'Your Passenger details'});
    }*/



    },
    iScrollCallBack:function(currentPageIdx,sizeOfPax){

    	var paxDisplay=this.paxDisplay;
    	var idx = currentPageIdx;
		jQuery("#initiateandEditErrors").disposeTemplate();
        var totalCustomers = jQuery(".PaxSelectionScreen").length;

        //document.getElementById("title" + this.currPageX).style.marginLeft="-"+(this.currPageX*2)+"px";

        if (idx == totalCustomers) {
            jQuery("#rightArrow").html(totalCustomers - parseInt(idx));
          } else {
            jQuery("#rightArrow").html(parseInt(idx) + 1);
          }
          if (idx == 1) {
            jQuery("#leftArrow").html("0");
          } else {
            jQuery("#leftArrow").html(parseInt(idx) - 1);
          }

        jQuery(".PaxSelectionScreen").css("display", "none");
        jQuery(".PaxSelectionScreen").eq(idx - 1).css("display", "block");

        /*
         * for disabling previous next pax
         * */
        if(jQuery("#leftArrow").text() == "0")
		{
        	jQuery("#leftArrow").addClass("carouselArrowDisabled");
		}else
		{
			jQuery("#leftArrow").removeClass("carouselArrowDisabled");
		}
        if(jQuery("#rightArrow").text() == "0")
		{
        	jQuery("#rightArrow").addClass("carouselArrowDisabled rightArrowDisabled");
		}else
		{
			jQuery("#rightArrow").removeClass("carouselArrowDisabled rightArrowDisabled");
		}

    },
    __getPage: function() {
      try {
        this.$logInfo('PassengerDetailsScript::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
          'PassengerDetailsScript::An error occured in __getPage function',
          exception);
      }
    },
    fqtvEditCPR: function(evt) {
      try {
        this.$logInfo('PassengerDetailsScript::Entering fqtvEditCPR function');
        var _this = this;
        jQuery("#initiateandEditErrors").disposeTemplate();

        // _this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        var errors = [];

        var totalProd = parseInt(jQuery("#mycarousel").attr("data-prod_tc"));
        //alert("totalProd : "+totalProd);
        var selectedCust = jQuery(".PaxSelectionScreen").eq("0").attr("data-selected-cust");
        //alert("selectedCust : "+selectedCust);

        /*jQuery('#splashScreen').hide();
              jQuery('#overlayCKIN').hide();
              return false;*/
        selectedCust = selectedCust.substr(0, selectedCust.length - 1);
        selectedCust = selectedCust.split(",");
        var cpr = _this.moduleCtrl.getCPR();
        var eligibleCustList = "";
        var tempSelectedCPR = "";
        var selectedCPR = "";
        var editsReqArray = "";
        var tempEmailandPhoneDetails = {
          "phoneNumber": "",
          "email": "",
          "custNumber": "",
          "uniqueCustomerIdBean": ""
        };
        var tempEmailorPhoneflag = false;
        var emailandphoneNumberDetails = [];
        var fqtvflag = false;
        var tempFqtvDetails = {
          "fqtvNo": ""
        };
        var fqtvDetails = [];
        var decideErrShowPage = -1;

        for (var i = 0; i < selectedCust.length; i++) {
          /*For loading FQTV section*/
          if (jQuery("#fqtvinput" + selectedCust[i]).length != 0) {
            tempFqtvDetails.fqtvNo = jQuery("#fqtvinput" + selectedCust[i]).val();
            if (jQuery("#fqtvinput" + selectedCust[i]).val() == "") {

            } else if (jQuery("#fqtvinput" + selectedCust[i]).val() != "" && jQuery("#fqtvType" + selectedCust[i]).val() == "0") {
              fqtvflag = true;
              fqtvDetails.push(tempFqtvDetails);
              decideErrShowPage = (decideErrShowPage == -1) ? i : decideErrShowPage;
              errors.push({
                "localizedMessage": this.uiErrors[213002124].localizedMessage,
                "code": this.uiErrors[213002124].errorid
              });
            } else {
              fqtvflag = true;
              fqtvDetails.push(tempFqtvDetails);
              eligibleCustList += selectedCust[i] + ",";
            }

          }

          //For forming email & phone number
          /*if(jQuery("#phoneNumber"+selectedCust[i]).val() != "")
              {
                if(_this.moduleCtrl.validatePhoneNumber(jQuery("#phoneNumber"+selectedCust[i]).val()) == false)
                {
                  errors.push({"localizedMessage":this.uiErrors[25000049].localizedMessage});
                }else
                {
                  tempEmailandPhoneDetails.phoneNumber=jQuery("#phoneNumber"+selectedCust[i]).val();
                    tempEmailorPhoneflag=true;
                }
              }*/

          if (jQuery("#phoneNumber" + selectedCust[i]).length != 0) {
            var tempAreaCodeDetails = jQuery("#areaCode" + selectedCust[i]).val();
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
              jQuery("#areaCode" + selectedCust[i]).val(tempAreaCodeDetails)
            }
            var AreaCodeAndPhoneNumber = jQuery("#areaCode" + selectedCust[i]).val() + jQuery("#phoneNumber" + selectedCust[i]).val();
            if (jQuery("#areaCode" + selectedCust[i]).val().length == 4 && AreaCodeAndPhoneNumber.length > 4 && _this.moduleCtrl.validatePhoneNumber(AreaCodeAndPhoneNumber)) {
              tempEmailandPhoneDetails.phoneNumber = AreaCodeAndPhoneNumber;
              tempEmailorPhoneflag = true;
            } else if (AreaCodeAndPhoneNumber != "") {
              decideErrShowPage = (decideErrShowPage == -1) ? i : decideErrShowPage;
              errors.push({
                "localizedMessage": this.uiErrors[25000049].localizedMessage,
                "code": this.uiErrors[25000049].errorid
              });
            }

          }

          if (jQuery("#emailDetails" + selectedCust[i]).length != 0) {
            if (_this.moduleCtrl.validateEmail(jQuery("#emailDetails" + selectedCust[i]).val())) {
              tempEmailandPhoneDetails.email = jQuery("#emailDetails" + selectedCust[i]).val();
              tempEmailorPhoneflag = true;
            } else if (jQuery("#emailDetails" + selectedCust[i]).val() != "") {
              decideErrShowPage = (decideErrShowPage == -1) ? i : decideErrShowPage;
              errors.push({
                "localizedMessage": this.uiErrors[25000048].localizedMessage,
                "code": this.uiErrors[25000048].errorid
              });
            }
          }

          tempEmailandPhoneDetails.custNumber = selectedCust[i];
          tempEmailandPhoneDetails.uniqueCustomerIdBean = cpr.customerLevel[selectedCust[i]].uniqueCustomerIdBean;
          if (tempEmailorPhoneflag == true) {
            emailandphoneNumberDetails.push(tempEmailandPhoneDetails);
          }
          tempEmailorPhoneflag = false;
          tempEmailandPhoneDetails = {
            "phoneNumber": "",
            "email": "",
            "custNumber": "",
            "uniqueCustomerIdBean": ""
          };
        }
        eligibleCustList = eligibleCustList.substr(0, eligibleCustList.length - 1);


        if (eligibleCustList == "" && emailandphoneNumberDetails.length == 0 && fqtvDetails.length == 0) {
          decideErrShowPage = (decideErrShowPage == -1) ? -1 : decideErrShowPage;
          errors.push({
            "localizedMessage": this.uiErrors[25000055].localizedMessage,
            "code": this.uiErrors[25000055].errorid
          });
          //errors.push({"localizedMessage":"Phonenumber or Email or FFnumber are mandatory"});

        }

        /********************Check wether FQTV VALID OR NOT************************/
        for (var j = 0; j < eligibleCustList.split(",").length; j++) {
          var strFQTVNumber = jQuery("#fqtvinput" + eligibleCustList.split(",")[j]).val();
          var regex = /[^\w\s]/gi;

          if (regex.test(strFQTVNumber) == true) {
            decideErrShowPage = (decideErrShowPage == -1) ? parseInt(eligibleCustList.split(",")[j]) : decideErrShowPage;
            errors.push({
              "localizedMessage": this.uiErrors[2130400].localizedMessage,
              "code": this.uiErrors[2130400].errorid
            });
          }

        }

        if (errors != null && errors.length > 0) {

          if (decideErrShowPage != -1) {
            //jQuery('#mycarousel').jcarousel('scroll', decideErrShowPage + 1, false);
            this.myscroll.scrollToPage((parseInt(decideErrShowPage)), 0);
          }
          setTimeout(function(){
          _this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
          },500);
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#splashScreen').hide();

          return null;
        }

        if (eligibleCustList != "") {
          tempSelectedCPR = eligibleCustList.split(",").length > 1 ? "[" + eligibleCustList + "]" : eligibleCustList;

          for (var i = 0; i < totalProd; i++) {
            selectedCPR += "{\"product\":\"" + i + "\",\"customer\":" + tempSelectedCPR + "}" + ",";

            for (var j = 0; j < eligibleCustList.split(",").length; j++) {
              editsReqArray += "{\"airline\" : \"" + jQuery("#fqtvinput" + eligibleCustList.split(",")[j]).parent().prev().find("select").val() + "\",\"fqtvNumber\" : \"" + jQuery("#fqtvinput" + eligibleCustList.split(",")[j]).val() + "\",\"product\":\"" + i + "\",\"customer\":\"" + eligibleCustList.split(",")[j] + "\"}" + ",";
            }
          }
          selectedCPR = selectedCPR.substr(0, selectedCPR.length - 1);
          selectedCPR = "[" + selectedCPR + "]";

          editsReqArray = editsReqArray.substr(0, editsReqArray.length - 1);
          editsReqArray = "[" + editsReqArray + "]";

          var editFqtvInput = "{\"indicator\" : \"DFF\",\"selectedCPR\" : " + selectedCPR + ",\"editsReqArray\" : " + editsReqArray + "}";
          editFqtvInput = JSON.parse(editFqtvInput);

          //we call the controller to retrive

          _this.moduleCtrl.setPassengerDetails(emailandphoneNumberDetails);
          _this.moduleCtrl.editFqtv(editFqtvInput);

        } else {
          _this.moduleCtrl.setPassengerDetails(emailandphoneNumberDetails);
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#splashScreen').hide();
          if ((cpr.adultCount + cpr.childCount) == 1) {
            this.moduleCtrl.navigate(null, "merci-checkin-MCPRRetrieveSinglePax_A");
          } else {
            this.moduleCtrl.navigate(null, "merci-checkin-MSelectFlights_A");
          }
        }


        /*console.log(JSON.stringify(editFqtvInput));
              console.log(JSON.stringify(emailandphoneNumberDetails));*/
      } catch (exception) {
        this.$logError(
          'PassengerDetailsScript::An error occured in fqtvEditCPR function',
          exception);
      }
    },

    onBackClick: function() {
      this.moduleCtrl.onBackClick();
    }

  }
});