Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.AcceptanceConfirmationScript',
  $dependencies: [
                  'aria.utils.Date',
                  'modules.view.merci.common.utils.MerciGA',
                  'modules.view.merci.common.utils.MCommonScript'
                 ],

  $constructor: function() {

	  this.__ga = modules.view.merci.common.utils.MerciGA;
    this.utils = modules.view.merci.common.utils.MCommonScript;
    this.mbpEligibilityProdList=[];
    this.listGeneratedBasedonProdSelected={};
    this.prodSelected=[];
  },
  $destructor:function(){
	  jQuery(document).off("click","input[name='product']:not(:disabled)");
	  jQuery(document).off("click","input[name='product']:not(:disabled)");
  },

  $prototype: {

    $dataReady: function() {
      try {
      this.$logInfo('AcceptanceConfirmationScript: Entering dataReady function ');
      var pageData = this.moduleCtrl.getModuleData().checkIn;
	  this.moduleCtrl.setIsAcceptanceConfirmation(true);

      if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
          pageData = jsonResponse.data.checkIn;
      }
        this.label = pageData.MAcceptanceConfirmation_A.labels;
        this.label.InfantPassengerName=this.label.InfantPassengerName.replace(/\\/g,"");
        this.parameters = pageData.MAcceptanceConfirmation_A.parameters;
    this.siteParams = pageData.MAcceptanceConfirmation_A.siteParam;
      this.rqstParams = pageData.MAcceptanceConfirmation_A.requestParam;
      this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MAcceptanceConfirmation_A.errorStrings;
      /*
	  *  In case of ADC check performed from backend(happens for first time when regulatory info filled through TE or any other way and in mci it skip regulatory page)
	  * that tiem to get latest edit cpr bean to perform ADC and CCV checks
	  */
	  this.data.EditCPR = pageData.MAcceptanceConfirmation_A.requestParam.EditcprBean;

      this.data.errorStrings = this.errorStrings;


      this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, false);

      var acceptedPax = this.moduleCtrl.getAcceptedCPR();
        var flightList = [];
	  var acceptedPaxNames = new Array([]);

        if (acceptedPax != null) {
          var flightList = [];
    	  var acceptedPaxNames = new Array([]);
          for (var i = 0; i < acceptedPax.customerAndProductsBean.length; i++) {
    	  var pax = acceptedPax.customerAndProductsBean[i];
    	 // var paxName = pax.otherPaxDetails.givenName +" "+ pax.customerDetailsSurname;
    	  //acceptedPaxNames.push(paxName);
            for (var j = 0; j < pax.acceptanceJourneies.length; j++) {
              var jrnye = pax.acceptanceJourneies[j].operatingFlightDetailsMarketingCarrier + pax.acceptanceJourneies[j].operatingFlightDetailsFlightNumber + "-" + pax.acceptanceJourneies[j].operatingFlightDetailsDepartureDate;
    	  		var arrFlag = false;
    	  		for (var ii = 0; ii < flightList.length; ii++) {
    	  	        if (flightList[ii] === jrnye) {
    	  	        	arrFlag = true;
    	  	        }
    	  	    }
              if (!arrFlag && pax.acceptanceJourneies[j].validApp == true) {
    	  		flightList.push(jrnye);
    	  		}
    	  	}
      	}

          for (var x = 0; x < flightList.length; x++) {
            acceptedPaxNames[x] = new Array();
      }

          for (var i = 0; i < acceptedPax.customerAndProductsBean.length; i++) {
    	  var pax = acceptedPax.customerAndProductsBean[i];
            var paxName = pax.otherPaxDetails.givenName + " " + pax.customerDetailsSurname;
            for (var j = 0; j < pax.acceptanceJourneies.length; j++) {
              var jrnye = pax.acceptanceJourneies[j].operatingFlightDetailsMarketingCarrier + pax.acceptanceJourneies[j].operatingFlightDetailsFlightNumber + "-" + pax.acceptanceJourneies[j].operatingFlightDetailsDepartureDate;
              for (var x = 0; x < flightList.length; x++) {
                acceptedPaxNames.push();
                if (jrnye === flightList[x]) {
                  if (pax.acceptanceJourneies[j].validApp == true) {
                    if (acceptedPaxNames[x].length > 0) {
                      acceptedPaxNames[x].push(" " + paxName);
                    } else {
    	  						acceptedPaxNames[x].push(paxName);
    	  					}

    	  				}
    	  			}
    	  		}

    	  }

      	}
          var message = "";

          for (var i = 0; i < flightList.length; i++) {
            message = message + jQuery.substitute(this.label.NowCheckedIn, [acceptedPaxNames[i], flightList[i].split("-")[0]]) + "<br/>";
		}

      }



        if (this.moduleCtrl.getFlowType() != "manageCheckin") {

          if (!this.moduleCtrl.getSuccess()) {
            for (var i = 0; i < flightList.length; i++) {
              this.moduleCtrl.setSuccess([{
                "localizedMessage": message
              }]);
            }
          }


        }


      } catch (_ex) {
      this.$logError('AcceptanceConfirmationScript: an error has occured in dataReady function');
    }
  },


    $viewReady: function() {
      try {
    this.$logInfo('AcceptanceConfirmationScript::Entering Viewready function');

    /*For disable base check box if no product there to select*/
        if ($('input[name=product]:disabled').length == $('input[name=product]').length) {
    	$('#flightsAll').prop('checked',false);
    	$('#flightsAll').attr("disabled","disabled");

    	/*
    	 * As soon as no flight to select disable all MBP, SPBP
    	 * */
    	jQuery(".secondary.email").addClass("disabled");
    	jQuery(".secondary.sms").addClass("disabled");
    	jQuery(".secondary.app").addClass("disabled");
    	jQuery(".secondary.add-passbook").addClass("disabled");
    }

    //removing back in confirmation screen
    jQuery('.banner button').addClass("displayNone");

    //removing back in confirmation screen
    jQuery('.banner button').addClass("displayNone");

    var allChecked = false;

       	window._currentAcceptanceconfirmationObject=this;

        var acceptedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCPR();
        var cpr = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
        var editCprVal = _currentAcceptanceconfirmationObject.moduleCtrl.getEditCPR();
        var cprVals = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();

          var chosenFlight = [];
          $('input[name=product]:not(:disabled)').each(function() {
            chosenFlight.push($(this).val());
          });

          var filteredChosenList = [];

          chosenFlight = chosenFlight.sort();
          for (var val = 0; val < chosenFlight.length; val++) {
            if (chosenFlight[val + 1] != chosenFlight[val]) {
              filteredChosenList.push(chosenFlight[val]);
            }
          }
        /*
    	 * docCheckRequired, ADC
    	 * */
        _currentAcceptanceconfirmationObject.prodSelected=filteredChosenList;
        _currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected=_currentAcceptanceconfirmationObject.formInputTOMBPSPBP(filteredChosenList, _currentAcceptanceconfirmationObject.mbpEligibilityProdList);

        var test = jQuery('form').serializeArray();
        jQuery.each(test, function(i, field) {
          if (field.name == "all" && field.value == "all") {
            allChecked = true;
          }
        });

        if (allChecked) {
          var listOfValues = [];
          var checkFlagForEmpty = false;

          if (filteredChosenList.length == 0) {
            checkFlagForEmpty = true;
          }



          var cprValues = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
          var productView = cprValues.customerLevel[0].productLevelBean;
          var selectedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
          for (var i = 0; i < filteredChosenList.length; i++) {
            var productStatus = {};
            var product = productView[filteredChosenList[i].product];
            productStatus["product"] = filteredChosenList[i];
            productStatus["bpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].bpEligible;
            //productStatus["ssrEligibility"] = cprValues.customerLevel[0].productLevelBean[chosenFlight[i]].bpEligible;
            productStatus["spBpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].spBpEnabled;
            listOfValues.push(productStatus);
          }

          _currentAcceptanceconfirmationObject.updateButtons(listOfValues, checkFlagForEmpty);
}



        jQuery(document).on("click","#flightsAll:not(:disabled)",function() {
          var acceptedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCPR();
          var cpr = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
          var editCprVal = _currentAcceptanceconfirmationObject.moduleCtrl.getEditCPR();
          var cprVals = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();

      var checkboxes = $('input[name=product]:not(:disabled)');


          if (jQuery(this).is(":checked")) {
        var isClicked = true;
            checkboxes.prop('checked', true)
          } else {
        checkboxes.prop('checked',false);
         var isClicked = false;
         allChecked = false;
      }

      var test = jQuery('form').serializeArray();
          jQuery.each(test, function(i, field) {
            if (field.name == "all" && field.value == "all") {
          allChecked = true;
        }
      });
       var chosenFlight = [];
       var listOfValues = [];
       var checkFlagForEmpty = false;

          $('input[name=product]:not(:disabled)').each(function() {
           chosenFlight.push($(this).val());
         });

       var filteredChosenList = [];

       chosenFlight = chosenFlight.sort();
          for (var val = 0; val < chosenFlight.length; val++) {
            if (chosenFlight[val + 1] != chosenFlight[val]) {
           filteredChosenList.push(chosenFlight[val]);
         }
       }


          if (filteredChosenList.length == 0 || !isClicked) {
         checkFlagForEmpty = true;
       }


          var cprValues = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
       var productView = cprValues.customerLevel[0].productLevelBean;
          var selectedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
          for (var i = 0; i < filteredChosenList.length; i++) {
         var productStatus = {};
         var product = productView[filteredChosenList[i].product];
         productStatus["product"] = filteredChosenList[i];
         productStatus["bpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].bpEligible;
         //productStatus["ssrEligibility"] = cprValues.customerLevel[0].productLevelBean[chosenFlight[i]].bpEligible;
         productStatus["spBpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].spBpEnabled;
         listOfValues.push(productStatus);
       }
          /*
      	 * docCheckRequired, ADC
      	 * */
          _currentAcceptanceconfirmationObject.prodSelected=filteredChosenList;
          _currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected=_currentAcceptanceconfirmationObject.formInputTOMBPSPBP(filteredChosenList, _currentAcceptanceconfirmationObject.mbpEligibilityProdList);

          _currentAcceptanceconfirmationObject.updateButtons(listOfValues, checkFlagForEmpty);
    });


        jQuery(document).on("click","input[name='product']:not(:disabled)",function() {
          var acceptedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCPR();
          var cpr = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
          var editCprVal = _currentAcceptanceconfirmationObject.moduleCtrl.getEditCPR();
          var cprVals = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();

      var number = jQuery("input[name='product']:not(:disabled)");
       var chosenFlight = [];
      jQuery(".secondary.email").removeClass("disabled");
      var listOfValues = [];
      var checkFlagForEmpty = false;
      jQuery("input[name='product']:not(:disabled)").each(function() {
            if (jQuery(this).is(":checked")) {
            chosenFlight.push($(this).val());
          }
        });



      var filteredChosenList = [];

      chosenFlight = chosenFlight.sort();
          for (var val = 0; val < chosenFlight.length; val++) {
            if (chosenFlight[val + 1] != chosenFlight[val]) {
          filteredChosenList.push(chosenFlight[val]);
        }
      }

          if (filteredChosenList.length != number.length) {
        jQuery("#flightsAll:not(:disabled)").prop("checked",false);
          } else {
            jQuery("#flightsAll:not(:disabled)").prop("checked", true);
          }

          if (filteredChosenList.length == 0) {
            checkFlagForEmpty = true;
          }


          var cprValues = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
          var productView = cprValues.customerLevel[0].productLevelBean;
          var selectedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();
          for (var i = 0; i < filteredChosenList.length; i++) {
            var productStatus = {};
            var product = productView[filteredChosenList[i].product];
            productStatus["product"] = filteredChosenList[i];
            productStatus["bpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].bpEligible;
            //productStatus["ssrEligibility"] = cprValues.customerLevel[0].productLevelBean[chosenFlight[i]].bpEligible;
            productStatus["spBpEligibility"] = cprValues.customerLevel[0].productLevelBean[filteredChosenList[i]].spBpEnabled;
            listOfValues.push(productStatus);
          }

          /*
        	 * docCheckRequired, ADC
        	 * */
            _currentAcceptanceconfirmationObject.prodSelected=filteredChosenList;
            _currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected=_currentAcceptanceconfirmationObject.formInputTOMBPSPBP(filteredChosenList, _currentAcceptanceconfirmationObject.mbpEligibilityProdList);

          _currentAcceptanceconfirmationObject.updateButtons(listOfValues, checkFlagForEmpty);

    });


    this.moduleCtrl.setWarnings("");
	this.moduleCtrl.setSuccess("");


	/*
	 * For GTM implementation
	 * */
	if (this.moduleCtrl.getFlowType() != "manageCheckin") {


		var sqData=this.moduleCtrl.forFormingGTMsqData(this.data.validGTMProdIDs,this.data.acceptedCprValidApp);
	}

	/*
	 * End for GTM implementation
	 * */

        if (this.moduleCtrl.getEmbeded()) {
		jQuery("[name='ga_track_pageview']").val("Confirmation");
          window.location = "sqmobile" + "://?flow=MCI/pageloaded=initiateAcceptance";
        } else {

          var GADetails = this.moduleCtrl.getGADetails();
		     
			
          this.__ga.trackPage({
            domain: GADetails.siteGADomain,
            account: GADetails.siteGAAccount,
            gaEnabled: GADetails.siteGAEnable,
            sqData:!jQuery.isUndefined(sqData)?sqData:"NA",
            page: 'Confirmation',
            GTMPage: 'Confirmation'
          });
	  }

    /*GOOGLE ANALYTICS
       * */
        this.data.validGTMProdIDs={};
        //FOR PAGE
     /* if(JSONData.parameters.SITE_MCI_GA_ENABLE)
       {
      ga('send', 'pageview', {'page': 'Confirmation','title': 'Your Confirmation'});
      }*/

	    var countryListCodeJson = this.moduleCtrl.getTelephoneNumberList();
        this.countryListJson = "";
        for (var i in countryListCodeJson) {
        	this.countryListJson += "{\"label\":\"" + (i + "(+" + countryListCodeJson[i].callingCode + ")") + "\",\"value\":\"" + countryListCodeJson[i].callingCode + "\"},";
        }
        this.countryListJson = this.countryListJson.substr(0, this.countryListJson.length - 1)
        this.countryListJson = JSON.parse("[" + this.countryListJson + "]");

        callAutocompleteInConfirmation=function(){

		$("input[autocomplete-enabled='true']").autocomplete({
			 highlight: function(value, term) {
				 return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
			 },
                source: _currentAcceptanceconfirmationObject.countryListJson,
			 minLength: 1 		// specifies the minimum number of characters a user. has to type before the Autocomplete activates.
		});

        }


      } catch (exception) {
    this.$logError(
        'AcceptanceConfirmationScript::An error occured in viewready function',
        exception);
  }


  },

    $displayReady: function() {
      try {
	  this.$logInfo('AcceptanceConfirmationScript::Entering displayReady function');

        window._currentAcceptanceconfirmationObject=this;

          counterPaxSelected = 0;

        if (navigator.userAgent.search(/Android 2./ig) != -1) {
      		/* $('.breadcrumbs').addClass("breadcrumbsForS2");*/

      	}

        $(".customerSelectCheckBox").change(function() {
               if ($(".customerSelectCheckBox:visible:checked").length == 0) {
                  jQuery("#sendBoardingPassButton").addClass("disabled");
               } else {
                  jQuery("#sendBoardingPassButton").removeClass("disabled");
               }

            });

      } catch (exception) {
      this.$logError(
          'AcceptanceConfirmationScript::An error occured in displayReady function',
          exception);
    }


     },

    updateButtons: function(listOfValues, flag) {

      try {
    	   this.$logInfo('AcceptanceConfirmationScript::Entering updateButtons function');
        if (!flag) {
          if (listOfValues.length > 0) {
             var emailStatus = true;
             var smsStatus = true;
             var boardingStatus = true;

            for (var i = 0; i < listOfValues.length; i++) {
              emailStatus = emailStatus && listOfValues[i]["spBpEligibility"];
              smsStatus = smsStatus && listOfValues[i]["bpEligibility"];
             }
            if (!emailStatus) {
             jQuery(".secondary.email").addClass("disabled");
            } else {
              jQuery(".secondary.email").removeClass("disabled");
            }

            if (!smsStatus || this.listGeneratedBasedonProdSelected.doccheckFailforAll) {
              jQuery(".secondary.sms").addClass("disabled");
              jQuery(".secondary.app").addClass("disabled");
              jQuery(".secondary.add-passbook").addClass("disabled");
            } else {
               jQuery(".secondary.sms").removeClass("disabled");
               jQuery(".secondary.app").removeClass("disabled");
               jQuery(".secondary.add-passbook").removeClass("disabled");
             }
         }
        } else {
           jQuery(".secondary.email").addClass("disabled");
           jQuery(".secondary.sms").addClass("disabled");
           jQuery(".secondary.app").addClass("disabled");
           jQuery(".secondary.add-passbook").addClass("disabled");
         }

        /*
         * For handling popups based on docChecRequired
         * */
        var docCheckReqForAllpaxInSelProd={};
        jQuery("[data-passengeruid]").removeAttr("data-atleastOneProdHaveIt");
        jQuery("[data-passengeruid]").removeAttr("disabled");
        for(var i1 in _currentAcceptanceconfirmationObject.prodSelected)
        {
        	jQuery("#mbpPopup .input-elements [data-passengeruid]").each(function(){

        		/*
        		 * For find product count for each pax
        		 *
        		 * ex: 1pax can be in first seg alone, one pax can be in all segments
        		 * */
        		if(_currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected[_currentAcceptanceconfirmationObject.prodSelected[i1]][jQuery(this).attr("data-passengeruid")] != undefined)
        		{
        			if(docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")] == undefined)
        			{
        				docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")]={"prodCount":0};
        			}else if(docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].prodCount == undefined)
        			{
        				docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].prodCount=0;
        			}
        			docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].prodCount+=1;
        		}

    			/*
    			 * For show hide pax in popup based on eligibility
    			 * */
        		if(_currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected[_currentAcceptanceconfirmationObject.prodSelected[i1]][jQuery(this).attr("data-passengeruid")] == undefined && jQuery(this).attr("data-atleastOneProdHaveIt") == undefined)
        		{
        			jQuery("[data-passengeruid='"+jQuery(this).attr("data-passengeruid")+"']").parent().addClass("displayNone");

        		}else
        		{
        			if(_currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected[_currentAcceptanceconfirmationObject.prodSelected[i1]][jQuery(this).attr("data-passengeruid")] == true)
        			{
        				if(docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")] == undefined)
            			{
            				docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")]={"paxCount":0};
            			}else if(docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].paxCount == undefined)
            			{
            				docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].paxCount=0;
            			}
            			docCheckReqForAllpaxInSelProd[jQuery(this).attr("data-passengeruid")].paxCount+=1;

        			}

        			jQuery("[data-passengeruid='"+jQuery(this).attr("data-passengeruid")+"']").attr("data-atleastOneProdHaveIt","");
        			jQuery("[data-passengeruid='"+jQuery(this).attr("data-passengeruid")+"']").parent().removeClass("displayNone");
        		}

        	});

        }
        /*
         * For disabling input box if doccheckreq true for all seg for particular pax
         * */
        for(var docSelPrd in docCheckReqForAllpaxInSelProd)
        {
        	if(docCheckReqForAllpaxInSelProd[docSelPrd].prodCount == docCheckReqForAllpaxInSelProd[docSelPrd].paxCount)
        	{
        		jQuery("#mbpPopup [data-passengeruid='"+docSelPrd+"']").removeAttr("checked");
        		jQuery("#smsPopup [data-passengeruid='"+docSelPrd+"'],#mbpPopup [data-passengeruid='"+docSelPrd+"']").attr("disabled","disabled");
        	}
        }

        var emailBtn = document.getElementsByClassName('secondary email')[0];
        var smsBtn = document.getElementsByClassName('secondary sms')[0];
        var appBtn = document.getElementsByClassName('secondary app')[0];
        var passbkBtn = document.getElementsByClassName('secondary add-passbook')[0];

        var emailEnabled = false;
        var smsEnabled = false;
        var appEnabled = false;
        var passbkEnabled = false;

        if (emailBtn != undefined) {
          if (!emailBtn.classList.contains("disabled")) {
            emailEnabled = true;
          }
        }
        if (smsBtn != undefined) {
          if (!smsBtn.classList.contains("disabled")) {
            smsEnabled = true;
          }
        }
        if (appBtn != undefined) {
          if (!appBtn.classList.contains("disabled")) {
            appEnabled = true;
    		   }
    	   }
//    	   if(!jQuery.isUndefined(passbkBtn)){
//    		   if(!passbkBtn.classList.contains("disabled")){
//    			   passbkEnabled =true;
//    		   }
//    	   }

        if (!emailEnabled && !smsEnabled && !appEnabled) {
          jQuery(".message.info").eq(0).html("<p>" + this.label.BpConfMsg + "</p>");
        } else {
          jQuery(".message.info").eq(0).html("<p>" + this.label.bpMsg + "</p>");
    	}



//    	   if(document.getElementsByClassName('secondary email')[0].classList.contains("disabled") && document.getElementsByClassName('secondary sms')[0].classList.contains("disabled") && document.getElementsByClassName('secondary app')[0].classList.contains("disabled") && document.getElementsByClassName('secondary add-passbook')[0].classList.contains("disabled")) {
//    		   jQuery(".message.info").eq(0).html("<p>Please proceed to counter and collect your boarding pass.</p>");
//         	}
      } catch (exception) {
         this.$logError(
             'AcceptanceConfirmationScript::An error occured in updateButtons function',
             exception);
       }

     },

    __getPage: function() {
      try {
        this.$logInfo('AcceptanceConfirmationScript::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
            'AcceptanceConfirmationScript::An error occured in __getPage function',
            exception);
      }
    },
    /*
     * flag - "mbp" for input to mbp
     * else flag -  email, sms
     *
     *	prodSelected - prod ids list, custSelected for MBp jst pax id and fro spbp paxid~email, for phone paxid~json
     *
     *l_selectedCprNew - actual json to send to backend
     *
     *
     * if l_selectedCprNew == null && flag ==null - call for finddoccheck
     *
     * */
    formInputTOMBPSPBP:function(prodSelected,custSelected,l_selectedCprNew,flag){

    	if(l_selectedCprNew==null && flag==null)
		{
    		jQuery("#adcError").css('display', 'none');
		}

    	var tempSelection={};
    	var getCpr = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
    	var mbpeligibleList={};
        var doccheckFailforAll={"totalCount":0,"counter":0};
    	if(!(_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp() && _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp().length > 0))
        {
        	var selectedcpr = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax()
        }else
        {
        	var selectedcpr = _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp()
        }

    	/*For construct bean*/
    	for(var p in prodSelected)
		{
			for(var c in custSelected)
    		{
				var custPrimeAndVal=custSelected[c].split("~");
				/*
				 * For taking proper cust index
				 * */
				outer:for(var j1 in getCpr.customerLevel)
   			 	{
   					var customer1=getCpr.customerLevel[j1];

   					if(custPrimeAndVal[0] == customer1.uniqueCustomerIdBean.primeId)
   					{
   						break outer;
   					}
          }

				/*
				 * For checkin wether pax is in valid selected apx list
				 * */
				for(var selCpr in selectedcpr)
				{
					if(selectedcpr[selCpr].product == prodSelected[p])
					{
						if(selectedcpr[selCpr].customer.toString().search(j1) != -1)
						{
							/*For docCheckRequired(ADC), cvvCheckRequired   scenario*/
							if(l_selectedCprNew==null && flag==null)
							{
								if(mbpeligibleList[selectedcpr[selCpr].product] == undefined)
	        					{
	        						mbpeligibleList[selectedcpr[selCpr].product]={};
	        					}
	        					mbpeligibleList[selectedcpr[selCpr].product][custPrimeAndVal[0]]=getCpr.customerLevel[j1].productLevelBean[selectedcpr[selCpr].product].docCheckRequired
	        														||getCpr.customerLevel[j1].productLevelBean[selectedcpr[selCpr].product].cvvCheckRequired;

	        					/*For showing adc or CCV fail*/
	        					if(mbpeligibleList[selectedcpr[selCpr].product][custPrimeAndVal[0]])
	        					{
	        						jQuery("#adcError").css('display', 'block');
	        					}

	        					/*For check infant ADC*/
	        					var infantIndexInCPR=_currentAcceptanceconfirmationObject.moduleCtrl.getInfantOrPaxIndex(j1);
	        					if(infantIndexInCPR != -1)
	        					{
	        						mbpeligibleList[selectedcpr[selCpr].product][getCpr.customerLevel[infantIndexInCPR].uniqueCustomerIdBean.primeId]=getCpr.customerLevel[infantIndexInCPR].productLevelBean[selectedcpr[selCpr].product].docCheckRequired
									||getCpr.customerLevel[infantIndexInCPR].productLevelBean[selectedcpr[selCpr].product].cvvCheckRequired;

	        						/*For showing adc or CCV fail*/
		        					if(mbpeligibleList[selectedcpr[selCpr].product][getCpr.customerLevel[infantIndexInCPR].uniqueCustomerIdBean.primeId])
		        					{
		        						jQuery("#adcError").css('display', 'block');
		        					}
	        					}

	        					doccheckFailforAll.totalCount+=1;
	        					(getCpr.customerLevel[j1].productLevelBean[selectedcpr[selCpr].product].docCheckRequired||getCpr.customerLevel[j1].productLevelBean[selectedcpr[selCpr].product].cvvCheckRequired) == true?doccheckFailforAll.counter+=1:"";
							}else
							{
								/*
								 * if  docCheckRequired true or cvvCheckRequired true then continue as he is not valid to send bp, sms
								 * */
								if(_currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected[selectedcpr[selCpr].product][custPrimeAndVal[0]] && flag != "email")
								{
									continue;
								}

							if(tempSelection[selectedcpr[selCpr].product] == undefined)
							{
								tempSelection[selectedcpr[selCpr].product]={};
        }

							tempSelection[selectedcpr[selCpr].product][j1]={"data":custPrimeAndVal[1]};

								/*For check infant ADC*/
	        					var infantIndexInCPR=_currentAcceptanceconfirmationObject.moduleCtrl.getInfantOrPaxIndex(j1);

							/*checking for infant associated to pax*/
							var checkInfant = "infantId" + getCpr.customerLevel[j1].uniqueCustomerIdBean.primeId+"_prod_"+selectedcpr[selCpr].product;
							var infants=jQuery("h4[for^='" + checkInfant + "']");
							if(infants.length == 1)
							{
									if(flag == "email")
									{
								tempSelection[selectedcpr[selCpr].product][infants.parent().attr("id").split("_")[2]]={"data":custPrimeAndVal[1]};
        }
									else if(!(_currentAcceptanceconfirmationObject.listGeneratedBasedonProdSelected[selectedcpr[selCpr].product][getCpr.customerLevel[infantIndexInCPR].uniqueCustomerIdBean.primeId]))
									{
										tempSelection[selectedcpr[selCpr].product][infants.parent().attr("id").split("_")[2]]={"data":custPrimeAndVal[1]};
									}

								}							}

          }
						break;
        }
          }
          }

		}

    	if(l_selectedCprNew==null && flag==null)
    	{
    		mbpeligibleList.doccheckFailforAll=false;
            if(doccheckFailforAll.totalCount == doccheckFailforAll.counter)
            {
            	mbpeligibleList.doccheckFailforAll=true;
            }

            return mbpeligibleList;
    	}

    	if(flag == "mbp")
    	{
    		/*change bean as required*/
    		for(var item in tempSelection)
    		{
    			var temp={"product":item,"customer":[]};
    			for(var custItm in tempSelection[item])
    			{
    				temp.customer.push((custItm).toString());
    			}
    			l_selectedCprNew.push(temp);
    		}

    	}else
    	{
    		/*change bean as required*/
    		var temp={};
    		for(var item in tempSelection)
    		{
    			for(var custItm in tempSelection[item])
    			{
    				if(temp[(custItm).toString()] == undefined)
    				{
    					temp[(custItm).toString()]={};
    				}
    				temp[(custItm).toString()][item.toString()]={"data":tempSelection[item][custItm].data};
            }
          }
    		/*
    		 * For forming actual contetn
    		 * */
    		for(var item in temp)
    		{
    			var temp1={"customer":item,"product":[]};
    			for(var custItm in temp[item])
    			{
    				temp1.product.push((custItm).toString());

    				if(flag == "email")
        			{
        				temp1.emailDelivery={"emailAddress":temp[item][custItm].data};
        			}else if(flag == "sms")
        			{
        				var data=JSON.parse(temp[item][custItm].data);
        				temp1.mobileDelivery={"phoneNum":data.phoneNum};
        				temp1.Site=data.Site;temp1.lastName=data.lastName;
        				temp1.BPUrl=data.BPUrl;temp1.Lang=data.Lang;temp1.recLoc=data.recLoc;
        			}

                  }
    			l_selectedCprNew.push(temp1);
              }

          }
    },
    // Function called to print boarding pass on click of continue
    onContinue: function(evt, iphoneFlag) {
      try {
        this.$logInfo('AcceptanceConfirmationScript::Entering onContinue function');
        if(!iphoneFlag.iphone){
          if(jQuery('#sendBoardingPassButton').hasClass('disabled')){
            return false;
          }
        }

        var _this = this;
        var l_selectedCprNew=[];
        var prodSelected=[];
        var custSelected=[];
        var getCpr = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
        if(!(_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp() && _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp().length > 0))
        {
        	var selectedcpr = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax()
        }else
        {
        	var selectedcpr = _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp()
        }

        if (jQuery('.secondary.app').hasClass('disabled')) {
          return false;
            }else{
          jQuery(document).scrollTop("0");
            }

        /*For prod loop*/
        $('input[name=product]:not(:disabled)').each(function(inx,item){

        	if(item.checked == true)
        	{
        		prodSelected.push($(this).val());
            }

    	});
        /*For customer loop through*/
        $('input[name=customerSel]:not(:disabled)').each(function(inx,item){

        	if(item.checked == true && !($(this).parent().hasClass("displayNone")))
        	{
        		custSelected.push(jQuery(this).attr("data-passengerUID"));
        	}

        });
        _currentAcceptanceconfirmationObject.formInputTOMBPSPBP(prodSelected,custSelected,l_selectedCprNew,"mbp");


          /** this is in case of boarding pass */
          var flag = iphoneFlag.iphone;
        if (!flag) {
          if (jQuery('.secondary.app').hasClass('disabled')) {
                return false;
              }

          $("#mbpPopup").css('display', 'none');
          $('.popupBGmask.forMCIDialogbox').css('display', 'none');
                //_this.showOverlay(true);
              modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

              // we get the form
              var boardingPassInput = {
            "selectedCPR": l_selectedCprNew,
            "isPassbook": "false"
              }

              //we call the controller to retrive
          _currentAcceptanceconfirmationObject.moduleCtrl.printBoardingPass(boardingPassInput);
        } else {
          //_this.showOverlay(true);
          modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
          var boardingPassInput = {
            "selectedCPR": _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax(),
            "isPassbook": "true"
          }
          _currentAcceptanceconfirmationObject.moduleCtrl.printBoardingPass(boardingPassInput);
        }
      } catch (exception) {
          this.$logError(
             'AcceptanceConfirmationScript::An error occured in onContinue function',
              exception);
       }
     },


    onEmailClick: function(evt, args) {
    	 this.$logInfo('AcceptanceConfirmationScript::Entering onEmailClick function');
     try {
    	 evt.preventDefault();
    	 jQuery('#emailPopup input[type="text"],#emailPopup input[type="email"],#emailPopup input[type="tel"]').blur();
        var checkinData = _currentAcceptanceconfirmationObject.moduleCtrl.getModuleData();
	 var errorStrings  = null;
        if (typeof checkinData.checkIn.MAcceptanceConfirmation_A !== "undefined") {
          errorStrings = checkinData.checkIn.MAcceptanceConfirmation_A.errorStrings;
        }
         var _this = this;
         var l_selectedCprNew=[];
         var prodSelected=[];
         var custSelected=[];
         var validEmailIds = 0;
         var invalidEmail=false;
         var regPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (jQuery(".secondary.email").hasClass("disabled")) {
          return false;
        }
         jQuery(document).scrollTop("0");

         /*For prod loop*/
         $('input[name=product]:not(:disabled)').each(function(inx,item){

         	if(item.checked == true)
         	{
         		prodSelected.push($(this).val());
           }

          });
         /*For customer loop through*/
         $('#emailPopup input[type=email]').each(function(inx,item){
        	 var emailId = jQuery(this).val();
              if (regPattern.test(emailId)) {
        		 custSelected.push(jQuery(this).attr("data-passengerUID")+"~"+emailId);

        		 validEmailIds++;
                 }else if(emailId != "")
                 {
                	 invalidEmail=true;
                 }

                    });

         if (validEmailIds == 0 || invalidEmail) {
        	 _currentAcceptanceconfirmationObject.moduleCtrl.displayErrors([{"localizedMessage": errorStrings[25000048].localizedMessage}], "initiateandEditEmailErrors", "error");
            evt.stopPropagation();
            return;
          }

         $("#emailPopup").css('display', 'none');
         $('.popupBGmask.forMCIDialogbox').css('display', 'none');
         _currentAcceptanceconfirmationObject.formInputTOMBPSPBP(prodSelected,custSelected,l_selectedCprNew,"email");

        var deliverDocInput = {
        		 "SelectedBP": l_selectedCprNew
        }

        _currentAcceptanceconfirmationObject.moduleCtrl.deliverDocument(deliverDocInput);
         /*_this.showDeliveryMessage(_this);*/
      } catch (exception) {
         this.$logError(
            'AcceptanceConfirmationScript::An error occured in onEmailClick function',
             exception);
      }


   },

    onSeatMapClick: function(evt, args) {
        try {
          this.$logInfo('AcceptanceConfirmationScript::Entering onSeatMapClick function');
          var _this = this;
              jQuery("#initiateandEditErrors").disposeTemplate();
  			jQuery(document).scrollTop("0");
                //_this.showOverlay(true);
  			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

                var errors = [];
                var cust = [];
                var repeat = false;
        var cpr = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();

                /***********Change selectedcpr according to acceptance conformation pax details*********/
        if (_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedValueForSeat() && _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedValueForSeat().length > 0) {
          _currentAcceptanceconfirmationObject.moduleCtrl.setSelectedPax(_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedValueForSeat());
        } else if (_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp() && _currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp().length > 0) {
          _currentAcceptanceconfirmationObject.moduleCtrl.setSelectedPax(_currentAcceptanceconfirmationObject.moduleCtrl.getAcceptedCprValidApp());
        }

        var selectedPax = _currentAcceptanceconfirmationObject.moduleCtrl.getSelectedPax();

                /*For Bringing pax with infant to the first in position so seatmap form based on this*/
        if (selectedPax && selectedPax.length > 0) {

          for (var selectedPaxprod = 0; selectedPaxprod < selectedPax.length; selectedPaxprod++) {
            var positionWherereplace = 0;
            for (var selIndex = 0; selIndex < selectedPax[selectedPaxprod].customer.length; selIndex++) {
              if (cpr.customerLevel[selectedPax[selectedPaxprod].customer[selIndex]].customerDetailsType == "IN") {
                break;
              }
            }
            if (selIndex < selectedPax[selectedPaxprod].customer.length) {
                   	  var infprimeID;
              infprimeID = cpr.customerLevel[selectedPax[selectedPaxprod].customer[selIndex]].productLevelBean[0].productIdentifiersBean[0].primeId;
            }

            if (infprimeID != undefined) {
              /*for (var jjj in cpr.customerLevel) {
                if (cpr.customerLevel[jjj].customerDetailsType != "IN")
                {
                  for (var kkk in cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean) {
                    if (cpr.customerLevel[jjj].productLevelBean[0].productIdentifiersBean[kkk].primeId == infprimeID) {
                      infprimeID = parseInt(jjj);

                    }
                  }

                }


              }*/
              /*Once the required infant id found cross check with selected cpr to get actual customer index*/
              for (var selIndex = 0; selIndex < selectedPax[selectedPaxprod].customer.length; selIndex++) {
                  if (cpr.customerLevel[selectedPax[selectedPaxprod].customer[selIndex]].customerDetailsType != "IN") {
                	  for (var kkk in cpr.customerLevel[selectedPax[selectedPaxprod].customer[selIndex]].productLevelBean[selectedPaxprod].productIdentifiersBean) {
                          if (cpr.customerLevel[selectedPax[selectedPaxprod].customer[selIndex]].productLevelBean[selectedPaxprod].productIdentifiersBean[kkk].primeId == infprimeID) {


                          	infprimeID = parseInt(selIndex);

              }
                        }
                  }
                }

              for (; cpr.customerLevel[selectedPax[selectedPaxprod].customer[positionWherereplace]].customerDetailsType == "IN"; positionWherereplace++) {

              }
              var valuetoreplace = selectedPax[selectedPaxprod].customer.splice(infprimeID, 1);
              selectedPax[selectedPaxprod].customer.splice(positionWherereplace, 0, valuetoreplace[0]);


            }

          }

        }

        _currentAcceptanceconfirmationObject.moduleCtrl.setSeatMapResponseEmpty();
        if (selectedPax && selectedPax.length > 0) {
          var i = 0;
    		       // for(var i=0; selectedPax[0].customer && i<selectedPax[0].customer.length; i++){
    		       	  var selectedCPRList = [];

          for (; cpr.customerLevel[selectedPax[0].customer[i]].customerDetailsType == "IN"; i++) {

    		       	  }

    		       	var infantPrimeId;
          for (var jjj in cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean) {
            if (cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean[jjj].referenceQualifier == "JID") {
              infantPrimeId = cpr.customerLevel[selectedPax[0].customer[i]].productLevelBean[0].productIdentifiersBean[jjj].primeId;

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

    		       	  cust[0] = selectedPax[0].customer[i];
          if (infantPrimeId != undefined) {

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
          _currentAcceptanceconfirmationObject.moduleCtrl.setSelectedProductForSeatMap(seatMapInput);
          //we call the controller to retrive
          _currentAcceptanceconfirmationObject.moduleCtrl.changeSeat(seatMapInput);
    		          //repeat = true;
    		        //}
                 }


      } catch (exception) {
          this.$logError(
              'AcceptanceConfirmationScript::An error occured in onSeatMapClick function',
              exception);
          }
    },

    // Function called to dispatch to home page
    onChknHome: function(evt) {
      try {
        this.$logInfo('AcceptanceConfirmationScript::Entering onChknHome function');
        var _this = this;
    jQuery(document).scrollTop("0");
          //_this.showOverlay(true);
    modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
          //we call the controller to land on sendsms page
        _currentAcceptanceconfirmationObject.moduleCtrl.loadHome();
      } catch (exception) {
        this.$logError(
            'AcceptanceConfirmationScript::An error occured in onChknHome function',
            exception);
        }
      },

   // Function called to cancel the checkin, if customer is already accepted
    onCancelCheckIn: function(evt, args) {

    	 this.$logInfo('AcceptanceConfirmationScript::Entering onCancelCheckIn function');

      try {
        var selector = "#customers" + args.product;
          var selectedCustomer = [];
          var finalList = [];
        $(selector).find('input[type=checkbox]:checked').each(function() {
            selectedCustomer.push($(this).attr('id'));
          });
        if (selectedCustomer.length != 0) {

          var _this = this;

            jQuery(document).scrollTop("0");
            evt.preventDefault();
            jQuery("#initiateandEditErrors").disposeTemplate();
        jQuery(document).scrollTop("0");
           // _this.showOverlay(true);
           // modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
          var cpr = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
  		      var custArray = cpr.customerLevel;
      		  var prodArray = cpr.customerLevel[0].productLevelBean;
      		  var custReqArray = [];
          for (var k = 0; k < prodArray.length; k++) {
            if (k == args.product) {
		    		      var customer = [];
              if (selectedCustomer >= 0) {
		    		    	  customer.push(selectedCustomer);
              } else {
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
		    		     }
              for (var a = 0; a < customer.length; a++) {
                for (var b = 0; b < selectedCustomer.length; b++) {
                  if (customer[a] == selectedCustomer[b]) {
                    finalList.push(selectedCustomer[b])
		    		       }
		    		     }
              }


             /*Commented as it is used to find infant index
              * but for cancel chekin input infant index not required
              * */
             /* var eqVal = 0;
              for (var z = 0; z < finalList.length; z++) {
                   var checkInfant = "infantId" + cpr.customerLevel[finalList[z]].uniqueCustomerIdBean.primeId;
                   var forAttr = "h4[for^='" + checkInfant + "']";
                   var infants = jQuery(forAttr);
                if (infants.length > 0) {
                  var selectorForInfant = "li:eq(" + eqVal + ")[id^='cust_index']"
                     var infantIndex = jQuery(selectorForInfant).attr("id").split("_")[2];
                  if (jQuery(selectorForInfant).attr("id").split("_")[4] == args.product) {
                       finalList.push(infantIndex);
                       eqVal++;
                     }
                   }

              }*/

              if (finalList.length > 0) {
                if (finalList.length == 1) {
                  custReqArray.push({
                    "product": k,
                    "customer": finalList[0]
                  });
                } else {
                  custReqArray.push({
                    "product": k,
                    "customer": finalList
                  });
		              }
		    		      }
      			}
            }

      		  /* in case we are landing from boarding passes icon in the app */
          var lastNameForCancelCheckin = _currentAcceptanceconfirmationObject.moduleCtrl.getLastName();
          if (_currentAcceptanceconfirmationObject.moduleCtrl.getLastName() == null) {
      			lastNameForCancelCheckin = cpr.customerLevel[0].customerDetailsSurname;
      		  }

        	  var cancelCheckInInput = {
            "selectedCPR": custReqArray,
            "recLoc": cpr.customerLevel[0].recordLocatorBean.controlNumber,
            "lastName": lastNameForCancelCheckin
       	          }
          var adltExistInRemainingPax = false;
          var checkedinPaxCount = 0;
          for (var z = 0; z < cpr.customerLevel.length; z++) {
            if (_currentAcceptanceconfirmationObject.isPaxCheckedIn(args.product, cpr.customerLevel[z].uniqueCustomerIdBean.primeId)) {
              if (cpr.customerLevel[z].customerDetailsType == "A" && !_currentAcceptanceconfirmationObject.isPaxSSR_Restricted_ChknAlone(args.product, cpr.customerLevel[z].uniqueCustomerIdBean.primeId)) {
                if (cpr.customerLevel[z].customerDetailsTypeBasedOnDOB == "A") {
                  if (cancelCheckInInput.selectedCPR[0].customer.indexOf(z + "") == -1) {
                    adltExistInRemainingPax = true;
                    break;
                  }
                }
              }

              if (cpr.customerLevel[z].customerDetailsType.search(/in/i) == -1) {
              checkedinPaxCount++;
				  }

            }
          }
          /* cancel all checkin case should always be allowed */
          if (!adltExistInRemainingPax && checkedinPaxCount == cancelCheckInInput.selectedCPR[0].customer.length) {
            adltExistInRemainingPax = true;
			  }
          if (!adltExistInRemainingPax) {
        		  var errors = [];
            errors.push({
              "localizedMessage": _currentAcceptanceconfirmationObject.errorStrings[25000130].localizedMessage,
              "code": _currentAcceptanceconfirmationObject.errorStrings[25000130].errorid
            });
			
            closeDialog($('#chargSeatSelConf'));
				  //});
				  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				  jQuery('#overlayCKIN').hide();
    		      jQuery('#splashScreen').hide();
            _currentAcceptanceconfirmationObject.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
            return;
        	  }

              // pop up for confirmation of cancel checkin

        	    var tempHTML = "<div class=\"glosyEffect\">";
              tempHTML += "<span class=\"firstBlock\"></span><span class=\"secondBlock\"></span><span class=\"thirdBlock\"></span></div>";
          tempHTML += "<p>" + this.label.chknConfirmation + "</p>";
              tempHTML += "<footer class=\"buttons\">";
          tempHTML += "<button id=\"okButton\" class=\"validation active\" type=\"submit\" formaction=\"FLEX_PURC_SEATS.html\">" + this.label.Ok + "</button>";
          tempHTML += "<button id=\"cancelButton\" class=\"cancel\" type=\"reset\">" + this.label.Abort + "</button>";

             function openDialog(which) {
            	 jQuery(".forMCIDialogbox").removeClass("loading");
            	 which.css('display', 'block');
               $('.popupBGmask.forMCIDialogbox').css('display', 'block');
                }

				function closeDialog(which) {
				   which.css('display', 'none');
				   $('.popupBGmask.forMCIDialogbox').css('display', 'none');
                }

          jQuery("#chargSeatSelConf").html(tempHTML);
          jQuery('#chargSeatSelConf').show();
          openDialog($('#chargSeatSelConf'));

          jQuery(document).off("click","#chargSeatSelConf #cancelButton");
          jQuery(document).on("click","#chargSeatSelConf #cancelButton",function() {
            $('.popupBGmask.forMCIDialogbox').css('display', 'none');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#chargSeatSelConf').hide();
            jQuery('#chargSeatSelConf').html("");
          });

          jQuery(document).off("click","#chargSeatSelConf #okButton");
          jQuery(document).on("click","#chargSeatSelConf #okButton",function() {
            jQuery('#chargSeatSelConf').hide();
            jQuery('#chargSeatSelConf').html("");
            // _this.showOverlay(true);
            modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
            $('.popupBGmask.forMCIDialogbox').css('display', 'block');
            _currentAcceptanceconfirmationObject.moduleCtrl.cancelAcceptance(cancelCheckInInput);
                });
          }
            /*_this.moduleCtrl.cancelAcceptance(cancelCheckInInput);*/
      } catch (exception) {
          this.$logError(
              'AcceptanceConfirmationScript::An error occured in onCancelCheckIn function',
              exception);
        }
      },

    // Function called when SMS boarding pass is clicked
    onSMSClick: function(evt, args) {
   	 this.$logInfo('AcceptanceConfirmationScript::Entering onSMSClick function');
   	try {
         jQuery(document).scrollTop("0");
   	evt.preventDefault();
   	jQuery('#smsPopup input[type="text"],#smsPopup input[type="tel"],#smsPopup input[type="email"]').blur();

        var cprForRecLoc = _currentAcceptanceconfirmationObject.moduleCtrl.getCPR();
         var validPhoneNums = 0;
         var invalidPhone=false;
         var _this = this;
         var l_selectedCprNew=[];
         var prodSelected=[];
         var custSelected=[];
         var recloc = cprForRecLoc.customerLevel[0].recordLocatorBean.controlNumber;
        var lastName = _currentAcceptanceconfirmationObject.moduleCtrl.getLastName();
        var checkinData = _currentAcceptanceconfirmationObject.moduleCtrl.getModuleData();
	 var errorStrings  = null;
        if (typeof checkinData.checkIn.MAcceptanceConfirmation_A !== "undefined") {
				errorStrings = checkinData.checkIn.MAcceptanceConfirmation_A.errorStrings;
	   }

         var mainUrl;
 		var actionUrl;
        if (document.getElementById('MyMERCICheckInURL') && document.getElementById('MyMERCICheckInURL').value != null && document.getElementById('MyMERCICheckInURL').value != "") {
			mainUrl = document.getElementById('MyMERCICheckInURL').value;
          var urlDetailedBean = _currentAcceptanceconfirmationObject.moduleCtrl.getUrlVars(mainUrl);
			mainUrl = mainUrl.split('#');
          if (mainUrl[0].indexOf("checkinFlow") != -1) {
            actionUrl = mainUrl[0].replace("checkinFlow", "BoardingPassFlow");
			}
			 var lang = urlDetailedBean.LANGUAGE;
	         var site = urlDetailedBean.SITE;
        } else if (document.getElementById('MyCPRRetrievalURL') && document.getElementById('MyCPRRetrievalURL').value != null && document.getElementById('MyCPRRetrievalURL').value != "") {
			mainUrl = document.getElementById('MyCPRRetrievalURL').value;
          var urlDetailedBean = _currentAcceptanceconfirmationObject.moduleCtrl.getUrlVars(mainUrl);
			mainUrl = mainUrl.split('#');
			//FOR APP
          if (mainUrl[0].indexOf("CPRIdentification") != -1) {
            actionUrl = mainUrl[0].replace("CPRIdentification", "BoardingPassFlow");
			}
			//FOR WEB
          if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
            actionUrl = mainUrl[0].replace("CPRRetrieve", "BoardingPassFlow");
			}
			var lang = urlDetailedBean.LANGUAGE;
	         var site = urlDetailedBean.SITE;
        } else {
		mainUrl = location.href;
		mainUrl = mainUrl.split('#');
          if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
            actionUrl = mainUrl[0].replace("CPRRetrieve", "BoardingPassFlow");
          } else {
            actionUrl = mainUrl[0].replace("checkinFlow", "BoardingPassFlow");
 		}
 		 var languages = location.href.split("LANGUAGE=");
        var lang = languages[1].split("&")[0];
        var sites =  mainUrl[0].split("SITE=");
        var site = sites[1].split("&")[0];

		}

        if (actionUrl.indexOf("&result=json") != -1) {
          actionUrl = actionUrl.replace("&result=json", '&');
			  }
         /*For remove client=* because it create prob while loading bitly URL*/
        actionUrl = actionUrl.replace(/&client=android&/gi, "&");
        actionUrl = actionUrl.replace(/&client=iphone&/gi, "&");
        actionUrl = actionUrl.replace(/&/gi, '%26');

        if (jQuery(".secondary.sms").hasClass("disabled")) {
           return false;
         }
         jQuery(document).scrollTop("0");


         /*For prod loop*/
         $('input[name=product]:not(:disabled)').each(function(inx,item){

         	if(item.checked == true)
         	{
         		prodSelected.push($(this).val());
          }

          });
         /*For customer loop through*/
         $('#smsPopup ul.input-group.contact').each(function(inx,item){
        	 if($(this).find("input").parent().hasClass("displayNone"))
        	 {
        		 return true;
        	 }

        	 var areaCodeSel = $(this).find("input").eq(0).val();

               /*********Replace when user enter code not selected from autocomplete***************/
             var tempAreaCodeDetails = areaCodeSel;
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
               $(this).find("input").eq(0).val(tempAreaCodeDetails)
            }

             var phoneNum = $(this).find("input").eq(0).val() + $(this).find("input").eq(1).val();
             if (_currentAcceptanceconfirmationObject.moduleCtrl.validatePhoneNumber(phoneNum) && $(this).find("input").eq(0).val().length == 4 && phoneNum.length > 4) {

            	 custSelected.push($(this).find("input").eq(0).attr("data-passengerUID")+"~"+JSON.stringify({"phoneNum":phoneNum,"Site":site,
            		 "lastName":lastName,"BPUrl":actionUrl,"Lang":lang,"recLoc":recloc}));

            	 validPhoneNums++;
             }else if(phoneNum != "")
             {
            	 invalidPhone=true;
             }

            });

         if (validPhoneNums == 0 || invalidPhone) {
        	 _currentAcceptanceconfirmationObject.moduleCtrl.displayErrors([{"localizedMessage": errorStrings[25000049].localizedMessage}], "initiateandEditSMSErrors", "error");
            evt.stopPropagation();
            return null;
          }

         $("#smsPopup").css('display', 'none');
         $('.popupBGmask.forMCIDialogbox').css('display', 'none');

         _currentAcceptanceconfirmationObject.formInputTOMBPSPBP(prodSelected,custSelected,l_selectedCprNew,"sms");

        var deliverDocInput = {
          "SelectedBP": l_selectedCprNew
        }

        _currentAcceptanceconfirmationObject.moduleCtrl.deliverDocument(deliverDocInput);
      } catch (exception) {
              this.$logError(
                 'AcceptanceConfirmationScript::An error occured in onSMSClick function',
                  exception);
           }
        },

    onMBPClick: function() {
      try {
          this.$logInfo('AcceptanceConfirmationScript::Entering onMBPClick function');

          if(jQuery(".secondary.app").hasClass('disabled')){
            return false;
          }
          jQuery(document).scrollTop("0");
          jQuery("#initiateandEditSMSErrors").disposeTemplate();
          openDialog($('#mbpPopup'));
          $('input[name=customerSel]:not(:disabled):visible').prop("checked",true);
          if ($(".customerSelectCheckBox:visible:checked").length == 0) {
              jQuery("#sendBoardingPassButton").addClass("disabled");
           } else {
              jQuery("#sendBoardingPassButton").removeClass("disabled");
           }

        } catch (exception) {
          this.$logError('AcceptanceConfirmationScript::An error occured in onMBPClick function', exception);
        }

    },


    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('AcceptanceConfirmationScript::Entering onModuleEvent function');
          //var errorStrings = this.moduleCtrl.getErrorStrings();

        var _this = this;
        switch (evt.name) {
          case "server.error":
        	  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        	  jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": _currentAcceptanceconfirmationObject.errorStrings[21400069].localizedMessage,
              "code": _currentAcceptanceconfirmationObject.errorStrings[21400069].errorid
            });
            _currentAcceptanceconfirmationObject.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
            break;

          case "page.refresh":

            _currentAcceptanceconfirmationObject.$refresh({
              filterSection: "cancelCheckinCheck"
           })

            /*_currentAcceptanceconfirmationObject.$refresh({
              filterSection: "seatDetails"
           })

            _currentAcceptanceconfirmationObject.$refresh({
              filterSection: "paxDetails"
            })*/

            _currentAcceptanceconfirmationObject.$refresh({
                filterSection: "seatDetailsOfFlightsection"
              });

              _currentAcceptanceconfirmationObject.$refresh({
                filterSection: "paxDetails"
              });

               _currentAcceptanceconfirmationObject.$viewReady();

            break;

         /* case "mbpRefresh" :

            _this.$refresh({
              filterSection: "mbpSection",
           })

           break;
*/

            }
/*
      case "mbpRefresh" :

        _this.$refresh({
          filterSection: "mbpSection",
       })

        break;
        }*/

      } catch (exception) {
           this.$logError(
              'AcceptanceConfirmationScript::An error occured in onModuleEvent function',
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

    /**
     * isPaxSSR_Restricted_ChknAlone : Checking for SSR associated with PAX is in the list of Checkin restricted alone.
     */
    isPaxSSR_Restricted_ChknAlone: function(product_index, primeId) {
    	var restricted = false;
    	try {
    		this.$logInfo('AcceptanceConfirmationScript::Entering isPaxSSR_Restricted_ChknAlone function');
        var cpr = this.moduleCtrl.getCPR();
        for (var l = 0; l < cpr.customerLevel.length; l++) {
          if (cpr.customerLevel[l].uniqueCustomerIdBean.primeId == primeId) {
    				var servicesBeanArr = cpr.customerLevel[l].productLevelBean[product_index].servicesBean;
            if (servicesBeanArr) {
              for (var m = 0; m < servicesBeanArr.length; m++) {
    						var splServiceInfo = servicesBeanArr[m].specialRequirementsInfoBean;
                if (this.parameters.SITE_MCI_SSR_CANT_CI_ALON.indexOf(splServiceInfo.ssrCode) != -1) {
                  restricted = true;
    						}
    					}
    				}
    			}
    		}
      } catch (exception) {
    		this.$logError(
    				'AcceptanceConfirmationScript::An error occured in isPaxSSR_Restricted_ChknAlone function',
    				exception);
    	}
      return restricted;
    },

    formatDate: function(depDate, format) {
    	this.$logInfo('AcceptanceConfirmationScript::Entering formatDate function');
      try {
       return aria.utils.Date.format(depDate, format);
      } catch (exception) {
       this.$logError(
           'AcceptanceConfirmationScript::An error occured in formatDate function',
           exception);
     }
    },

    onPassBookClick: function(evt) {
      jQuery(document).scrollTop("0");
    },

    findIOSVersion: function(evt) {
      this.$logInfo('AcceptanceConfirmationScript::Entering findIOSVersion function');
      try {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
          // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
          var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
          return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
          }
      } catch (exception) {
        this.$logError(
            'AcceptanceConfirmationScript::An error occured in findIOSVersion function',
            exception);
      }
    },

    /**
     * onHomeClick :
     * Event handler triggered when the user click/touch the
     * home element
     */
    onHomeClick: function(evt) {
      try {
	         this.$logInfo('HeaderScript::Entering $dataReady function');
        if (this.moduleCtrl.getEmbeded()) {
          window.location = "sqmobile" + "://?flow=MCI/exitCheckIn";
        } else {
	   	  	//jQuery("#convertCodeToSimbol").html(this.parameters.LANG_MCI_HOMEPAGE_URL);
	        //window.location = jQuery("#convertCodeToSimbol").text();
          var homeUrl = this.parameters.LANG_MCI_HOMEPAGE_URL;
	   	  	window.location = homeUrl;
	   	  	}
      } catch (exception) {
         this.$logError(
            'HeaderScript::An error occured in $dataReady function',
            exception);
         }
       },
    is24HourcheckForUSARoute: function(product) {
    	   try {
  	         	this.$logInfo('HeaderScript::Entering is24HourcheckForUSARoute function');

  	         	var isBPorOPCountryUSA=false;
  	         	if (product.operatingFlightDetailsOffPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsOffPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsBoardPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsBoardPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1) {
  	         		isBPorOPCountryUSA=true;
  	            }
        if (product.operatingFlightDetailsBoardPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsBoardPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsBoardPointInfo.country.search(/^(usa|us|United States Of America){1}$/i) != -1 || product.operatingFlightDetailsBoardPointInfo.countryCode.search(/^(usa|us|United States Of America){1}$/i) != -1) {
  	         		isBPorOPCountryUSA=true;
       }

  	         	var IsTrue="none";
        if (isBPorOPCountryUSA) {
  	         		/*hours check*/
          out: for (var i in product.legLevelBean) {
            for (var j in product.legLevelBean[i].legTimeBean) {
              if (product.legLevelBean[i].legRoutingOrigin == product.operatingFlightDetailsBoardPoint && product.legLevelBean[i].legTimeBean[j].businessSemantic.search(/STD/i) != -1) {
  	  	         				var stdDate=product.legLevelBean[i].legTimeBean[j];
  	  	         				break out;
  	  	         			}
  	  	  	         	}
  	  	         	}

            if (this.moduleCtrl.getDaysAndYearFromCurrentDate({
              "month": stdDate.month,
              "year": stdDate.year,
              "day": stdDate.day
            }, stdDate).split("-")[2] <= 24) {
  	         			IsTrue=true;
          } else {
  	         			IsTrue=false;
  	         		}
  	         	}

  	         	return IsTrue;

    	   } catch (exception) {
    		   this.$logError(
              'HeaderScript::An error occured in is24HourcheckForUSARoute function',
              exception);
           }
       }

/*    showDeliveryMessage : function(_this){
      var deliverDoc = _this.moduleCtrl.getDeliverDocument();
      if(deliverDoc.responseDetails.numberOfPassesSentNumberOfUnit>0){
        $('.popup.input-panel .buttons .validation1').parent('footer').parent('article').parent('.input-panel').css('display', 'none');
        $('.msk.forMCIDialogbox').css('display', 'none');
        var panel = jQuery('.popup.input-panel .buttons .validation1:not(".cancel")').parent('footer').parent('article');
        if (panel.hasClass('sms')) {
          var buttonToDisable = jQuery('.getPassbook a.secondary.sms');
          jQuery('#conf-sms').removeClass('hidden');
        } else if (panel.hasClass('email')) {
          var buttonToDisable = $('.getPassbook a.secondary.email');
          jQuery('#conf-email').removeClass('hidden');
        }
      }
    }*/
   }
});