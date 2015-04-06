Aria.tplScriptDefinition({
   $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.AcceptanceConfirmationScript',
   $dependencies: ['aria.utils.Date', 'modules.view.merci.common.utils.MerciGA', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.StringBufferImpl'],
   $constructor: function() {
      this.__ga = modules.view.merci.common.utils.MerciGA;
      this.utils = modules.view.merci.common.utils.MCommonScript;
      this.buffer = modules.view.merci.common.utils.StringBufferImpl;
      this.KarmaDataReady = {};
      this.KarmaDisplayReady = {
         "T3": []
      };
      this.KarmaShowExitRow = {};
      this.KarmaEmailPopuUp = {};
      this.KarmaOnFlightSelectionChange = {
         "T5": {},
         "T6": {},
         "T7": {},
         "T8": {},
         "T9": {},
         "T10": {}
      };
      this.KarmaOnEmailClick = {};
      this.KarmaOnSMSClick = {};
      this.KarmaOnMBPClick = {};
      this.KarmaOnPassbookClick = {};
      this.KarmaOnCancelCheckIn = {};
      this.KarmaOpenDialogforConfirmationMail = {};
      this.KarmaOnConfEmailSendClick = {};
      this.KarmaSendConfirmationMail = {};
      this.KarmaGetShareData = {};
   },
   $prototype: {
      $dataReady: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript: Entering dataReady function ');
            acceptanceConfirmationcurrentlyFocussed = "";
            this.emailautocomlete = {
               autocompleteEmailList: []
            };
            var pageData = this.moduleCtrl.getModuleData().checkIn;
            if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
               pageData = jsonResponse.data.checkIn;
            }
            this.label = pageData.MSSCIAcceptanceConfirmation_A.labels;
            this.parameters = pageData.MSSCIAcceptanceConfirmation_A.parameters;
            this.data.siteParameters = this.parameters;
            this.requestParam = pageData.MSSCIAcceptanceConfirmation_A.requestParam;
            this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
            this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceConfirmation_A.siteParam;
            this.moduleCtrl.setHeaderInfo({
               title: this.label.Title,
               bannerHtmlL: this.requestParam.bannerHtml,
               homePageURL: this.siteParams.homeURL,
               showButton: false
            });
            /* For Forming Useful Information Data.. */
            this.moduleCtrl.formingSelectedCustFlightInfo();

            /*Display of Share Button*/

            if (this.parameters.SITE_MC_ENBL_CHKIN_SHARE.toLowerCase() == "true") {

               this.confPageShareContentTitle = this.label.tx_merci_text_sm_title;
               this.confPageShareContentCaption = this.label.tx_merci_text_sm_caption;
               this.confPageShareImageURL = this.label.tx_merci_text_sm_airlines_image_url;
               this.confPageShareContentDesc = this.getShareData();
               this.confPageShareContentLink = this.label.tx_merci_text_sm_airlines_link;

               var headerButton = {};
               var arr = [];
               var arrShare = [];
               headerButton.scope = this;
               var _this = this;

               if (this.utils.isRequestFromApps() == true) {

                  if (this.parameters.siteAllowSocialMedia.toLowerCase() == "true") {
                     arr.push("shareButton");
                  }

                  if (this.parameters.siteAllowFacebook.toLowerCase() == "true") {
                     arrShare.push(["FACEBOOK", "fb", "icon-facebook"]);
                  };

                  if (this.parameters.siteAllowGooglePlus.toLowerCase() == "true") {
                     arrShare.push(["GOOGLEPLUS", "gp", "icon-google-plus"]);
                  };

                  if (this.parameters.siteAllowLinkedIn.toLowerCase() == "true") {
                     arrShare.push(["LINKEDIN", "li", "icon-linkedin"]);
                  };

                  if (this.parameters.siteAllowTwitter.toLowerCase() == "true") {
                     arrShare.push(["TWITTER", "tw", "icon-twitter"]);
                  };

                  if (this.parameters.siteAllowEmail.toLowerCase() == "true") {
                     arrShare.push(["EMAIL", "mail", "icon-email"]);
                  };

                  if (this.parameters.siteAllowSMS.toLowerCase() == "true") {
                     arrShare.push(["SMS", "sms", "icon-sms"]);
                  };
                  headerButton.shreButton = arrShare;
                  headerButton.button = arr;
                  this.moduleCtrl.setHeaderInfo({
                     title: this.label.Title,
                     bannerHtmlL: this.requestParam.bannerHtml,
                     homePageURL: this.siteParams.homeURL,
                     showButton: false,
                     headerButton: headerButton
                  });
               } else {

                  if (this.parameters.siteAllowSocialMedia.toLowerCase() == "true") {
                     arr.push("shareButton");
                  }

                  if (this.parameters.siteAllowFacebook.toLowerCase() == "true") {
                     arrShare.push(["FACEBOOK", "fb", "icon-facebook"]);
                  };

                  if (this.parameters.siteAllowGooglePlus.toLowerCase() == "true") {
                     arrShare.push(["GOOGLEPLUS", "gp", "icon-google-plus"]);
                  };

                  if (this.parameters.siteAllowLinkedIn.toLowerCase() == "true") {
                     arrShare.push(["LINKEDIN", "li", "icon-linkedin"]);
                  };

                  if (this.parameters.siteAllowTwitter.toLowerCase() == "true") {
                     arrShare.push(["TWITTER", "tw", "icon-twitter"]);
                  };

                  if (this.parameters.siteAllowEmail.toLowerCase() == "true") {
                     arrShare.push(["EMAIL", "mail", "icon-email"]);
                  };

                  if (this.parameters.siteAllowSMS.toLowerCase() == "true") {
                     arrShare.push(["SMS", "sms", "icon-sms"]);
                  };
                  var googleAPIKey = this.parameters.siteGooglePlusAPIKey;
                  var baseparams = modules.view.merci.common.utils.URLManager.getBaseParams();
                  if (window.location.protocol == 'http:') {
                     googleAPIKey = this.parameters.siteGooglePlusSecretKey;
                  }
                  headerButton.shreButton = arrShare;
                  headerButton.shareData = {
                     title: _this.confPageShareContentTitle,
                     caption: _this.confPageShareContentCaption,
                     link: _this.confPageShareContentLink,
                     description: _this.confPageShareContentDesc,
                     apiKey: googleAPIKey
                  };
                  headerButton.button = arr;
                  // set details for header
                  this.moduleCtrl.setHeaderInfo({
                     title: this.label.Title,
                     bannerHtmlL: this.requestParam.bannerHtml,
                     homePageURL: this.siteParams.homeURL,
                     showButton: false,
                     headerButton: headerButton,
                     googlePlusData: {
                        title: _this.confPageShareContentTitle,
                        caption: _this.confPageShareContentCaption,
                        link: _this.confPageShareContentLink,
                        description: _this.confPageShareContentDesc,
                        apiKey: googleAPIKey
                     }
                  });


                 /* $('#share-buttons-group li:not(.btn-close) button').click(function() {
                     $(".msk").show();
                     $('#share-buttons-group button').removeClass("active");
                     $(this).addClass("active");
                     $(".panel.share-slider").attr("aria-expanded", "true");
                     var title = $(this).attr("data-title")
                     $(".panel.share-slider h1").html("Share <strong>" + title + "</strong>");
                     var type = $(this).attr("data-type")
                     $(".share-content").hide();
                     $(".share-content.share-" + type).show();
                  });

                  $('.share-content footer button:not(.secondary)').click(function() {
                     $(".msk").hide();
                     $("div.panel.share-slider").hide();
                     $('#share-buttons-group li:not(.btn-close) button').removeClass("active");
                     $(".panel.share-slider").attr("aria-expanded", "false");

                  });

                  $('.share-content footer button.secondary').click(function() {
                     $(".msk").hide();
                     $("div.panel.share-slider").hide();
                     $('#share-buttons-group li:not(.btn-close) button').removeClass("active");
                     $(".panel.share-slider").attr("aria-expanded", "false");

                  });*/

               };
               this.KarmaDataReady["T1"] = "Display of Share Button"; //For TDD
            }



            var cpr = this.moduleCtrl.getCPR();
            var selectedCPR = this.moduleCtrl.getSelectedCPR();
            var flighttocust = selectedCPR.flighttocust;
            /*
             * Page Scope Variable Used for Dynamically Deciding which popup got Selected
             * */
            this.popUpSelected = "";
            this.filteredCustomerList = {};
            this.filteredSelectedFlightList = [];
            if (this.moduleCtrl.getFlowType() != "manageCheckin") {
               var message = "";
               var acceptedPax = [];
               for (var i in flighttocust) {
                  var paxNames = [];
                  for (var j in flighttocust[i].customer) {
                     var custID = flighttocust[i].customer[j];
                     var name = cpr[selectedCPR.journey][custID].personNames[0].givenNames[0] + " " + cpr[selectedCPR.journey][custID].personNames[0].surname;
                     if (paxNames.length > 0) {
                        paxNames.push(" " + name);
                     } else {
                        paxNames.push(name);
                     }
                  }
                  var flightID = flighttocust[i].product;
                  var flight = cpr[selectedCPR.journey][flightID].operatingAirline.companyName.companyIDAttributes.code + "-" + cpr[selectedCPR.journey][flightID].operatingAirline.flightNumber;
                  acceptedPax.push({
                     pax: paxNames,
                     flightID: flight
                  });
               }
               var message = "";
               for (var i = 0; i < acceptedPax.length; i++) {
                  message = message + jQuery.substitute(this.label.NowCheckedIn, [acceptedPax[i].pax, acceptedPax[i].flightID]) + "<br/>";
               }

               /*For confirmation you are now checked in message*/
               this.data.isAcceptanceConfirmation = (typeof this.data.isAcceptanceConfirmation != "number" && this.data.isAcceptanceConfirmation == false ? 0 : this.data.isAcceptanceConfirmation);
               if (typeof this.data.isAcceptanceConfirmation == "number") {
                  this.data.isAcceptanceConfirmation++;
                  this.moduleCtrl.setSuccess([{
                     "localizedMessage": message
                  }]);



                  if (this.parameters.SITE_SSCI_SND_CONF_EMAIL.toLowerCase() == "true" && this.data.confMailSent !=true) {
                  this.sendConfirmationMail();
                     this.data.confMailSent = true;
               }
                  this.KarmaDataReady["T2"] = "Confirmation you are now checked in message"; //For TDD
               }

            }
         } catch (_ex) {
            this.$logError('AcceptanceConfirmationScript: an error has occured in dataReady function');
         }
      },

      $destructor: function() {

         if (this.data.isAcceptanceConfirmation == 2) {
            /*
             * This parameter once land on to confirmation page prevent user to go back
             * to previous pages and to display u r now checked in message again and again
             * */
            this.data.isAcceptanceConfirmation = true;
         }

      },

      $viewReady: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering Viewready function');

            /*For auto show already entered email -- FOR COPY ALREADY ENTERED EMAIL TO OTHER EMAIL BOXES*/
            var _this = this;
            var _thismoduleCtrl = _this.moduleCtrl;
            /*
             * Execute every time when blur event called
             * */
            $(document).on("blur",".sectionconfirmationspecific input[type='text'],.sectionconfirmationspecific input[type='email']", function() {

               window.setTimeout(function() {

                  /*
                   * for autocomplete data update
                   * */
                  _this.emailPopuUp(_this, _thismoduleCtrl);

               }, 150);


            });
            /*End For auto show already entered email*/

            setTimeout(function() {

               _thismoduleCtrl.setErrors("");
               _thismoduleCtrl.setWarnings("");
               _thismoduleCtrl.setSuccess("");

               if (_thismoduleCtrl.getFlowType() != "manageCheckin" && _this.parameters.SITE_SSCI_SND_CONF_EMAIL.toLowerCase() == "true" && _this.data.confPopUpOnceOpened!=true) {
                  _this.openDialogforConfirmationMail();
                  _this.data.confPopUpOnceOpened=true;
               }

            }, 400);



            /*GOOGLE ANALYTICS
             * */
            var customData = {};
            var cpr = this.moduleCtrl.getCPR();
            var selectedCPR = this.moduleCtrl.getSelectedCPR();
            var journey = cpr[selectedCPR.journey];
            if (true) {
               if (this.moduleCtrl.getFlowType() != "manageCheckin") {
                  var checkInPaxCount = 0;
                  for (var custIndex in selectedCPR.custtoflight) {
                     var custInfo = selectedCPR.custtoflight[custIndex];
                     var custId = custInfo.customer;
                     var cust = journey[custId];

                     for (var flightIndex in custInfo.product) {
                        checkInPaxCount++;
                        if(cust.passengerTypeCode != "INF"){
                        var flightID = custInfo.product[flightIndex];
                        var passengerLegCodeSeat = custId + journey[flightID].leg[0].ID + "SST";
                        var seat = journey.seat[passengerLegCodeSeat].row + journey.seat[passengerLegCodeSeat].column;
                        customData['seatNumber'] = (customData['seatNumber'] == undefined) ? (seat) : (customData['seatNumber'] + "," + seat);
                     }
                  }
                  }
                  customData['checkInPAXCount'] = checkInPaxCount;
                  customData['pageTitle'] = "Check-In Confirmation";
               }
            }


            if (this.moduleCtrl.getEmbeded()) {
        	   	jQuery("[name='ga_track_pageview']").val("Confirmation");
                window.location = "sqmobile" + "://?flow=MCI/pageloaded=initiateAcceptance";
            } else {

                  var GADetails = this.moduleCtrl.getGADetails();


                  this.__ga.trackPage({
                    domain: GADetails.siteGADomain,
                    account: GADetails.siteGAAccount,
                    gaEnabled: GADetails.siteGAEnable,
                    page: 'Confirmation',
                  GTMPage: 'Confirmation',
                  data: customData
                  });
        	}

            /*GOOGLE ANALYTICS
               * */
            /*BEGIN : JavaScript Injection(CR08063892)*/
            if (typeof genericScript == 'function') {
    			genericScript({
    				tpl:"AcceptanceConfirmation",
    				data:this.data
    			});
            }
            /*END : JavaScript Injection(CR08063892)*/
         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in viewready function', exception);
         }
      },

      $displayReady: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering displayReady function');

            /*To Display Warning Messages*/
            this.moduleCtrl.getWarningsForThePage("CONF", this);



            /* Variable Declration */
            var _this = this;
            var _thismoduleCtrl = _this.moduleCtrl;
            var CPRdata = _this.moduleCtrl.getCPR();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            var journey = selectedCPR.journey;
            var noOfFlight = _this.moduleCtrl.getSelectedCPR().flighttocust.length;


            /*IATcI*/
            if (this.data.IATCISeatSaveFailure == true) {
               this.data.IATCISeatSaveFailure = false;
               /*Because Page Loading twice*/

               setTimeout(function() {
               var warning = [];
	               var label = _this.label;
               warning.push({
                  "localizedMessage": label.Exitrowgenericseatmsg
               });
	               _thismoduleCtrl.setWarnings(warning);

               /*For display message only incase div avilable*/
               if (jQuery("#acceptConfWarning").length > 0) {
	            	   _thismoduleCtrl.displayErrors(warning, "acceptConfWarning", "warning");
               }
               }, 300);
            }
            /*IATcI*/

            setTimeout(function() {

               if ((_this.popUpSelected == "Email" || _this.popUpSelected == "ConfEmail") && jQuery("#" + acceptanceConfirmationcurrentlyFocussed).length == 1) {
                  jQuery("#" + acceptanceConfirmationcurrentlyFocussed).focus();
                  acceptanceConfirmationcurrentlyFocussed = "";
               }

            }, 200);


            /** Refer to Function Inplementaion Comment For More Information*/
            _this.onFlightSelectionChange();

            /* Variable Declration */
            /*For Selecting All flight Button on selecting individual flights*/
            $("#flight01").change(function() {
               var noOfFlight = _this.moduleCtrl.getSelectedCPR().flighttocust.length;
               if ($('#flight01').is(':checked')) {
                  for (var i = 1; i <= noOfFlight; i++) {
                     $('#seg0' + i).prop("checked", true);
                  }
                  _this.KarmaDisplayReady["T3"] = []; //For TDD
                  _this.KarmaDisplayReady["T3"].push("On selecting individual flights,Selecting All segments"); //For TDD
               } else {
                  for (var i = 1; i <= noOfFlight; i++) {
                     $('#seg0' + i).prop('checked',false);
                  }
               }
               if ($(".flightSelCheckBox:checked").length == 0) {
                  jQuery(".secondary.email").addClass("disabled");
                  jQuery(".secondary.sms").addClass("disabled");
                  jQuery(".secondary.app").addClass("disabled");
                  jQuery(".secondary.add-passbook").addClass("disabled");
               } else {
                  jQuery(".secondary.email").removeClass("disabled");
                  jQuery(".secondary.sms").removeClass("disabled");
                  jQuery(".secondary.app").removeClass("disabled");
                  jQuery(".secondary.add-passbook").removeClass("disabled");
               }
               _this.KarmaDisplayReady["T3"].push("If any flight is checked then email sms app add-passbook"); //For TDD
               _this.onFlightSelectionChange();
            });

            $(".flightSelCheckBox").change(function() {
               if ($(".flightSelCheckBox:checked").length == 0) {
                  jQuery(".secondary.email").addClass("disabled");
                  jQuery(".secondary.sms").addClass("disabled");
                  jQuery(".secondary.app").addClass("disabled");
                  jQuery(".secondary.add-passbook").addClass("disabled");
               } else {
                  jQuery(".secondary.email").removeClass("disabled");
                  jQuery(".secondary.sms").removeClass("disabled");
                  jQuery(".secondary.app").removeClass("disabled");
                  jQuery(".secondary.add-passbook").removeClass("disabled");
               }
               if ($(".flightSelCheckBox:checked").length == ($(".flightSelCheckBox").length)) {
                  $("#flight01").prop("checked", true);
                  _this.KarmaDisplayReady["T3"].push("All flights checked in"); //For TDD
               } else {
                  $("#flight01").prop("checked",false);
               }
               _this.onFlightSelectionChange();

            });
            $(".customerSelectCheckBox").change(function() {
               if ($(".customerSelectCheckBox:checked").length == 0) {
                  jQuery("#sendBoardingPassButton").addClass("disabled");
               } else {
                  jQuery("#sendBoardingPassButton").removeClass("disabled");
               }
               if ($(this).is(':checked')) {
                  $(this).nextAll("ul").slideDown();
               } else {
                  $(this).nextAll("ul").slideUp();
               }
            });


            /*
             * Begin JQuery Function For Hiding Poppup on clicking
             * cancel and send Boarding Pass
             */
            $(document).on("click",'.sectionDefaultstyle .popup.input-panel .buttons .validation', function() {
               if (this.className == "validation cancel") {
                  $(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
                  jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); /*Will Be Hidden When Code Integreated in Int of this CR */
               }
               //					else{
               //						if(_this.sendDisabled == false){
               //							$(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
               //							jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); /*Will Be Hidden When Code Integreated in Int of this CR */
               //						}
               //					}
            });

            /*For Passbook PopUp */
            $(document).on("click",".sectionDefaultstyle .dialog button.cancel, .dialog button.validation", function() {
               if (this.className == ("validation active") && this.parentNode.parentNode.id == ("CommonPopup")) {
                  $(".dialog").hide();
                  modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
                  jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
               } else if (this.className == ("cancel") && this.parentNode.parentNode.id == ("CommonPopup")) {
                  $(".dialog").hide();
                  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
                  jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
               }
            });

            /*
             * End JQuery Function For Hiding Poppup on clicking
             * cancel and send Boarding Pass
             */

            /*Start jQuery function for disabling cancel checkin button if no passenger is selected*/
            $(document).on("change",".sectionDefaultstyle ul.services-pax.selectable input[type=checkbox]", function() {
               var buttonToChange = $(this).parentsUntil('section').find('a.secondary.main');
               if ($(this).is(':checked')) {
                  buttonToChange.removeClass('disabled');
                  var checkBoxes = $(this).parentsUntil('section').find("ul.services-pax.selectable input[type=checkbox]");
                  if (!checkBoxes.is(':checked')) {
                     buttonToChange.addClass('disabled');
                  }
               } else {
                  var checkBoxes = $(this).parentsUntil('section').find("ul.services-pax.selectable input[type=checkbox]");
                  if (!checkBoxes.is(':checked')) {
                     buttonToChange.addClass('disabled');
                  }
               }
            });
            /*End jQuery function for disabling cancel checkin button if no passenger is selected*/

            var paxNotCheckedIn = false;
            if (!jQuery.isUndefined(this.requestParam.NotAcceptedPax)) {
               paxNotCheckedIn = true;
            }

            var errors = [];

            if (paxNotCheckedIn && this.data.paxOffloadedDueToStandby!=true) {
               errors.push({
                  "localizedMessage": this.errorStrings[25000129].localizedMessage
               });
               this.moduleCtrl.displayErrors(errors, "acceptConfErrs", "error");
            }

            if (this.data.paxOffloadedDueToStandby) {
               errors.push({
                  "localizedMessage": this.errorStrings[25000128].localizedMessage
               });
               this.moduleCtrl.displayErrors(errors, "acceptConfErrs", "error");
            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in displayReady function', exception);
         }

      },

      /*
       *
       * decide wether to show exit row or not
       *
       * */
      showExitRow: function(mbpSpbpCallBacks) {
         this.$logInfo('AcceptanceConfirmationScript::Entering showExitRow function');
         try {

            /*For Showing exit row popup*/
            if (!jQuery.isUndefined(this.requestParam) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean) && this.moduleCtrl.getFlowType() != "manageCheckin" && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply.warnings) && !jQuery.isUndefined(this.requestParam.AcceptedResponseBean.generalReply.warnings.warnings)) {
               var temp = this.requestParam.AcceptedResponseBean.generalReply.warnings.warnings;

            	   /*
            	    * Incase if exit service failed then showing popup again irrespective of warning
            	    * */
               if (temp.showExitPopupShown == true && jQuery.isUndefined(this.requestParam.ExitPromptString)) {
            		   this.moduleCtrl.displayExitPopup(mbpSpbpCallBacks);
                  this.KarmaShowExitRow["T4"] = "Incase if exit service failed then showing popup again irrespective of warning"; //For TDD
                       return;
            	   }


               if (!jQuery.isUndefined(temp.warnings) && temp.warnings.length > 0) {
                  for (var i in temp.warnings) {
                     if (temp.warnings[i].errorWarning.code == 6005 || temp.warnings[i].errorWarning.code == 3009) {
                        /*Once error found remove from base response so that it wont come on again while browser back and other unwanted scenarios*/
                        temp.warnings.splice(i, 1);
                        temp.showExitPopupShown=true;

                        this.moduleCtrl.displayExitPopup(mbpSpbpCallBacks);
                        this.KarmaShowExitRow["T4"] = "Once error found remove from base response so that it wont come on again while browser back and other unwanted scenarios"; //For TDD
                        return;
                     }
                  }
               }
            } else {
               this.moduleCtrl.displayExitPopup(mbpSpbpCallBacks);
               return;
            }
            mbpSpbpCallBacks();
            /*End for showing exit row popup*/

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in showExitRow function', exception);
         }

      },

      emailPopuUp: function(_this, _thismoduleCtrl) {
         this.$logInfo('AcceptanceConfirmationScript::Entering emailPopuUp function');
         try {
            /*
             * validating on blur wether data proper or not
             * */
            var temp = [];
            jQuery(".sectionconfirmationspecific input[type='text'],input[type='email']").each(function() {
               if (_thismoduleCtrl.validateEmail(jQuery(this).val())) {
                  temp[jQuery(this).val()] = "";
               }
            });


            /*
             * setting actual auto compelte data accordngly
             * */
            _this.emailautocomlete.autocompleteEmailList = [];
            var emailStrucTemp = [];
            for (var i in temp) {
               emailStrucTemp.push({
                  "code": i,
                  "label": i
               });
            }
            /*
             * email section bind with this data so as soon as list updated section refresh
             * happens to show updated data to auto complete
             * */
            aria.utils.Json.setValue(_this.emailautocomlete, "autocompleteEmailList", emailStrucTemp);
            // Test Code
            this.KarmaEmailPopuUp["T5"] = emailStrucTemp;

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in emailPopuUp function', exception);
         }

      },

      /*Code For Deselecting or Selection the OnEmailClickButton and
       * OnMBPClickButoon Based on Site Parameter for Origin and Destination Disable or Abled*/
      onFlightSelectionChange: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onFlightSelectionChange function');
         try {
            var noOfFlight = this.moduleCtrl.getSelectedCPR().flighttocust.length;
            var CPRdata = this.moduleCtrl.getCPR();
            var selectedCPR = this.moduleCtrl.getSelectedCPR();
            var journey = CPRdata[selectedCPR.journey];
            var disableMBP = false;
            var disableSPBP = false;
            var disableSMS = false;
            if ($(".flightSelCheckBox:checked").length != 0) {
               for (var i = 1; i <= noOfFlight; i++) {
                  if ($('#seg0' + i).is(':checked')) {
                     var selectedFlightId = $('#seg0' + i).val();
                     var originLocation = journey[selectedFlightId].departureAirport.locationCode;
                     var destinLocation = journey[selectedFlightId].arrivalAirport.locationCode;
                     if ((this.parameters.SITE_SSCI_MBP_ALOD_ORG.trim() != "") && (this.parameters.SITE_SSCI_MBP_ALOD_ORG.search(originLocation) == -1) || this.parameters.SITE_SSCI_MBP_DBL_DST_LST.search(destinLocation) != -1) {
                        disableMBP = true;
                        disableSMS = true;
                     }
                     if (this.parameters.SITE_SSCI_SPBP_DSBL_ORG.search(originLocation) != -1 || this.parameters.SITE_SSCI_SPBP_DSBL_DEST.search(destinLocation) != -1) {
                        disableSPBP = true;
                       
                     }

                     var em_flag = true;
                     var mbp_flag = true;
                     var sms_flag =true;
                     var cvvCheckRequired = false;
                     for (var flight in selectedCPR.flighttocust) {
                        var flightID = selectedCPR.flighttocust[flight].product;
                        if (flightID == selectedFlightId) {
                           for (var cust in selectedCPR.flighttocust[flight].customer) {
                              var custID = selectedCPR.flighttocust[flight].customer[cust];
                              var key = custID + selectedFlightId;
                              if (journey.productDetailsBeans[key].MBPAllowed == true) {
                                 mbp_flag = false;
                              }
                              if (journey.productDetailsBeans[key].MBPAllowed == true) {
                                 sms_flag = false;
                              }
                              if (journey.productDetailsBeans[key].homePrintedBPAllowed == true) {
                                 em_flag = false;
                              }
                              if (journey.productDetailsBeans[key].cvvCheckRequired == true) {
                                 cvvCheckRequired = true;
                              }
                           }
                        }
                     }
                     if (mbp_flag == true) {
                        disableMBP = true;
                       
                     }
                     if (em_flag == true) {
                        disableSPBP = true;
                     }
                     if (sms_flag == true) {
                        disableSMS = true;
                     }
                     if (cvvCheckRequired) {
                        disableMBP = true;
                        disableSMS = true;
                        jQuery("#adcError").removeClass("displayNone").addClass("displayBlock");
                     } else {
                        jQuery("#adcError").removeClass("displayBlock").addClass("displayNone");
                     }


                  }
               }

               if (disableMBP) {
                  jQuery(".secondary.app").addClass("disabled");
                  jQuery(".secondary.add-passbook").addClass("disabled");
                  this.KarmaOnFlightSelectionChange["T5"]="MBP disabled"; //For TDD
                  
               } else {
                  jQuery(".secondary.app").removeClass("disabled");
                  jQuery(".secondary.add-passbook").removeClass("disabled");
                  this.KarmaOnFlightSelectionChange["T5"]="MBP Not disabled";  //For TDD
               }

               if (disableSMS) {
                  jQuery(".secondary.sms").addClass("disabled");
                  this.KarmaOnFlightSelectionChange["T7"]="SMS Disabled";
               } else {
                  jQuery(".secondary.sms").removeClass("disabled");
                  this.KarmaOnFlightSelectionChange["T7"]="SMS Not Disabled";
               }
               if (disableSPBP) {
                  jQuery(".secondary.email").addClass("disabled");
                  this.KarmaOnFlightSelectionChange["T6"]="SPBP disabled";	//For TDD
               } else {
                  jQuery(".secondary.email").removeClass("disabled");
                  this.KarmaOnFlightSelectionChange["T6"]="SPBP Not disabled"; //For TDD
               }


               if (disableMBP == true && disableSMS == true && disableSPBP == true) {
                  jQuery("#proceedToCounter").removeClass("displayNone").addClass("displayBlock");
               } else {
                  jQuery("#proceedToCounter").removeClass("displayBlock").addClass("displayNone");
            }

            } else {
               jQuery("#proceedToCounter").removeClass("displayNone").addClass("displayBlock");
            }



         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onFlightSelectionChange function', exception);
         }
      },

      onEmailButtonClick: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onEmailButtonClick function');
         try {
            var _this = this;
            if ($('ul.getPassbook .email.disabled').length == 0) {

               /*
                * As exit popup should show on click of any of mbp spbp buttons the flow changed like
                *
                * if PNR need to collect exit details then show exit popup first and then
                *
                * show MBP or SPBp popup
                *
                *other wise show mbp or spbp directly
                *
                * */
               this.showExitRow(

                  function() {

                     /* Begin Processing Of Data Before Landing The Pop Up */
                     var selectedCPR = _this.moduleCtrl.getSelectedCPR();
                     _this.popUpSelected = "Email";
                     _this.filteredCustomerList = {};
                     _this.filteredSelectedFlightList = [];
                     /*
                      * List Containing
                      * only passengers
                      * which are
                      * accepted on the
                      * selected flights
                      */
                     var boxes = $('.flightSelCheckBox:checked');
                     $(boxes).each(function() {
                        for (var flight in selectedCPR.flighttocust) {
                           if (selectedCPR.flighttocust[flight].product == $(this).val()) {

                              _this.filteredSelectedFlightList.push($(this).val());

//                              for (var customer in selectedCPR.flighttocust[flight].customer) {
//                                 _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//                              }

                           }
                        }
                     });
                     for (var customer in selectedCPR.custtoflight){
                     	for(var flight in selectedCPR.custtoflight[customer].product){
                     		if(_this.filteredSelectedFlightList.indexOf(selectedCPR.custtoflight[customer].product[flight]) != -1){
                     			_this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
                     			break;
                     		}
                     	}
                     }

                     /* End Processing Of Data Before Lading The Pop Up */

                     jQuery(document).scrollTop("0");
                     jQuery("#initiateandEditCommonErrors").disposeTemplate();
                     jQuery("#CommonPopup").html("");

                     _this.$refresh({
                        section: "popupSection"
                     });
                     _this.openSSCIDialog($('#CommonPopup'));

                     /*
                      * initially when page load, to form auto complete initial content
                      * */
                     _this.emailPopuUp(_this, _this.moduleCtrl);



                     return "email";
                  }

               );

            }
         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onEmailButtonClick function', exception);
         }
      },

      openSSCIDialog: function(which) {
         this.$logInfo('AcceptanceConfirmationScript::Entering openSSCIDialog function');
         try {
            jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); /*Will Be Shown When Code Integrated in Int of this CR */
            which.css('display', 'block');
         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in openSSCIDialog function', exception);
         }
      },

      onEmailClick: function(evt, args) {
         if ($(".customerSelectCheckBox:checked").length != 0) {
            this.$logInfo('AcceptanceConfirmationScript::Entering onEmailClick function');
            evt.preventDefault();
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            var _this = this;
            var CPRdata = _this.moduleCtrl.getCPR();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            var journey = selectedCPR.journey;
            var selectedEmails = [];
            var errorStrings = null;
            var checkinData = _this.moduleCtrl.getModuleData();
            if (typeof checkinData != "undefined") {
               errorStrings = checkinData.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
            }

            try {
               jQuery(document).scrollTop("0");
               var errors = [];
               var email = [];
               var selectFlightList = [];
               var selectCustList = [];
               var validEmailIds = 0;
               $('input[name=product]:checked').each(function() {
                  selectFlightList.push($(this).val());
               });
               $('input[name=pax11]:checked').each(function() {
                  selectCustList.push($(this).val());
               });
               if (!selectCustList.length >= 1) {
                  errors.push({
                     "localizedMessage": errorStrings[25000048].localizedMessage,
                     "code": errorStrings[25000048].errorid
                  });
               }

               for (var custIndex in selectCustList) {
                  var selectedCustID = selectCustList[custIndex];
                  var selector = "#eMailPax" + selectedCustID;
                  var emailId = jQuery(selector).val();
                  if (emailId != null && typeof emailId !== "undefined" && emailId.trim() != "") {
                     if (_this.moduleCtrl.validateEmail(emailId)) {
                        validEmailIds += 1;
                        email.push({
                           "customerID": selectedCustID,
                           "emailId": emailId
                        });
                        var productList = [];
                        for (var flightIDIndex in selectFlightList) {
                           var selectflightID = selectFlightList[flightIDIndex];
                           var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);
                           /*
                            * for Checking whether this product is
                            * being accepted or not
                            */
                           for (item1 in selectedCPR.flighttocust) {
                              var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                              if (acceptedFlightNo == selectflightID) {
                                 for (item2 in selectedCPR.flighttocust[item1].customer) {
                                    var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                                    if (acceptedCustomerNo == selectedCustID) {
                                       productList.push({
                                          "prodID": productID,
                                          "url": ""
                                       });
                                    }
                                 }
                              }

                           }
                        }

                        //formation of url
                        var productIDs_inUrl = [];
                        var head_inUrl = [];
                        for (var i = 0; i < productList.length; i++) {

                           var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(CPRdata[journey], productList[i].prodID);
                           var paxID = paxIDandFlightID.split("~")[0];
                           var flightID = paxIDandFlightID.split("~")[1];
                           var paxName = CPRdata[journey][paxID].personNames[0].givenNames[0] + " " + CPRdata[journey][paxID].personNames[0].surname;
                           var flight = CPRdata[journey][flightID].operatingAirline.companyName.companyIDAttributes.code + CPRdata[journey][flightID].operatingAirline.flightNumber;
                           var headName = paxName + " - " + flight;

                           productIDs_inUrl.push(productList[i].prodID);
                           head_inUrl.push(headName);

                           /*In case if adult is associated with an infant*/
                           if (CPRdata[journey][paxID].accompaniedByInfant == true) {
                              var infantID = this.moduleCtrl.findInfantIDForCust(flightID, paxID);
                              var infantName = CPRdata[journey][infantID].personNames[0].givenNames[0] + " " + CPRdata[journey][infantID].personNames[0].surname;
                              var infHeadName = infantName + " - " + flight;
                              var infProdID = this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], infantID, flightID);
                              productIDs_inUrl.push(infProdID);
                              head_inUrl.push(infHeadName);
                           }


                        }

                        var mainUrl;
                        var actionUrl;
                        mainUrlWithID = modules.view.merci.common.utils.URLManager.getFullURL('SSCIBoardingPassFlow.action', null);
                        url_spilt = mainUrlWithID.split('?');

                        url_1 = url_spilt[0].split(";jsession")[0];

                        UrlWithoutJsessionID = url_1 + "?" + url_spilt[1];



                        mainUrl = UrlWithoutJsessionID.split('#');
                        if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
                           actionUrl = mainUrl[0].replace("CPRRetrieve", "SSCIBoardingPassFlow");
                        } else {
                           actionUrl = mainUrl[0].replace("gettripFlow", "SSCIBoardingPassFlow");
                        }
                        var languages = UrlWithoutJsessionID.split("LANGUAGE=");
                        var lang = languages[1].split("&")[0];
                        var sites = mainUrl[0].split("SITE=");
                        var site = sites[1].split("&")[0];

                        actionUrl = actionUrl + "&pID=" + productIDs_inUrl + "&hName=" + head_inUrl + "&CHANNEL=MOBILE";
                        escape_url = escape(actionUrl);


                        var haveLinkInMAIL = true;
                        for (var i = 0; i < productList.length; i++) {
                           if (!this.moduleCtrl.isMBPallowedForProduct(productList[i].prodID, this.parameters)) {
                              haveLinkInMAIL = false;
                              break;
                           }
                        }

                        if (haveLinkInMAIL) {
                        for (var i = 0; i < productList.length; i++) {
                           productList[i].url = escape_url;
                        }
                        }

                        selectedEmails.push({
                           "custID": selectedCustID,
                           "productList": productList,
                           "email": emailId
                        });
                     } else {
                        validEmailIds -= 1;
                     }
                  }else{
                     validEmailIds = selectCustList.length;
                     errors.push({
                        "localizedMessage": jQuery.substitute(errorStrings[21400059].localizedMessage,this.label.Email),
                        "code": errorStrings[21400059].errorid
                     });
                     break;
                  }
               }

               /* Begin Error Displaying Section */
               if (validEmailIds != selectCustList.length) {
                  errors.push({
                     "localizedMessage": errorStrings[25000048].localizedMessage,
                     "code": errorStrings[25000048].errorid
                  });
               }
               if (errors != null && errors.length > 0) {
                  _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
                  evt.stopPropagation();
                  return;
               }
               /* End Error Displaying Section */

               /* Begin Sending Backend Request */
               var input = {
                  "bpRequests": selectedEmails,
                  "bpType": "Email",
                  "fromPage": "AcceptanceConfirmation"
               };
               $('#CommonPopup').css('display', 'none');
               _this.moduleCtrl.deliverDocument(input);
               this.KarmaOnEmailClick["T16"] = selectedEmails; //For TDD
               /* End Sending Backend Request */

            } catch (exception) {
               this.$logError('AcceptanceConfirmationScript::An error occured in onEmailClick function', exception);
            }
         } else {
            evt.stopPropagation();
            return;
         }

      },

      onSMSButtonClick: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onSMSButtonClick function');
         try {
            var _this = this;
            if ($('ul.getPassbook .sms.disabled').length == 0) {

               /*
                * As exit popup should show on click of any of mbp spbp buttons the flow changed like
                *
                * if PNR need to collect exit details then show exit popup first and then
                *
                * show MBP or SPBp popup
                *
                *other wise show mbp or spbp directly
                *
                * */
               this.showExitRow(

                  function() {

                     /* Begin Processing Of Data Before Lading The Pop Up */
                     var selectedCPR = _this.moduleCtrl.getSelectedCPR();
                     _this.popUpSelected = "SMS";
                     _this.filteredCustomerList = {};
                     _this.filteredSelectedFlightList = [];
                     /*
                      * List Containing
                      * only passengers
                      * which are
                      * accepted on the
                      * selected flights
                      */

                     var boxes = $('.flightSelCheckBox:checked');
                     $(boxes).each(function() {
                        for (var flight in selectedCPR.flighttocust) {
                           if (selectedCPR.flighttocust[flight].product == $(this).val()) {

                              _this.filteredSelectedFlightList.push($(this).val());

//                              for (var customer in selectedCPR.flighttocust[flight].customer) {
//                                 _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//                              }

                           }
                        }

                     });
                     for (var customer in selectedCPR.custtoflight){
                      	for(var flight in selectedCPR.custtoflight[customer].product){
                      		if(_this.filteredSelectedFlightList.indexOf(selectedCPR.custtoflight[customer].product[flight]) != -1){
                      			_this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
                      			break;
                      		}
                      	}
                      }

                     /* End Processing Of Data Before Lading The Pop Up */

                     jQuery(document).scrollTop("0");
                     jQuery("#initiateandEditCommonErrors").disposeTemplate();
                     jQuery("#CommonPopup").html("");

                     _this.$refresh({
                        section: "popupSection"
                     });
                     _this.openSSCIDialog($('#CommonPopup'));

                     return "sms";
                  }
               );

            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onSMSButtonClick function', exception);
         }
      },

      onSMSClick: function(evt, args) {
         if ($(".customerSelectCheckBox:checked").length != 0) {
            this.$logInfo('AcceptanceConfirmationScript::Entering onSMSClick function');
            evt.preventDefault();
            try {
               jQuery("#initiateandEditCommonErrors").disposeTemplate();
               var selectedCPR = this.moduleCtrl.getSelectedCPR();
               var cpr = this.moduleCtrl.getCPR();
               var journey = cpr[selectedCPR.journey];
               var bpRequests = [];
               var selectFlightList = [];
               var selectCustList = [];
               var errorStrings = null;
               var errors = [];
               var validSMSs = 0;
               var errorStrings = null;
               var checkinData = this.moduleCtrl.getModuleData();
               if (typeof checkinData != "undefined") {
                  errorStrings = checkinData.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
               }

               /*Begin For getting the selected Flight and Passenger IDs*/
               $('input[name=product]:checked').each(function() {
                  selectFlightList.push($(this).val());
               });
               $('input[name=pax11]:checked').each(function() {
                  selectCustList.push($(this).val());
               });
               if (!selectCustList.length >= 1) {
                  errors.push({
                     "localizedMessage": errorStrings[25000049].localizedMessage,
                     "code": errorStrings[25000049].errorid
                  });

               }
               /*End For getting the selected Flight and Passenger IDs*/

               for (var custIndex in selectCustList) {

                  /*Initiating the request to be formed*/
                  var l_smsRequest = {};

                  var selectedCustID = selectCustList[custIndex];
                  var custNo = selectCustList[custIndex];

                  var phoneNumSel = "#phoneNumber" + custNo;
                  var areaCodeSel = "#areaCode" + custNo;

                  /*********Replace when user enter code not selected from autocomplete***************/
                  var tempAreaCodeDetails = jQuery(areaCodeSel).val().trim();
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
                     jQuery(areaCodeSel).val(tempAreaCodeDetails)
                     this.KarmaOnSMSClick["areaCode"] = tempAreaCodeDetails;

                  }



                  var phoneNum = jQuery(areaCodeSel).val() + jQuery(phoneNumSel).val();
                  if(phoneNum != null && typeof phoneNum !== "undefined" && phoneNum.trim() != ""){
                     if (this.moduleCtrl.validatePhoneNumber(phoneNum) && jQuery(areaCodeSel).val().length == 4 && phoneNum.length > 4) {
                     var productList = [];
                     for (var flightIDIndex in selectFlightList) {
                        var selectflightID = selectFlightList[flightIDIndex];
                        var productID = this.moduleCtrl.findProductidFrmflightid(journey, selectedCustID, selectflightID);
                        /*
                         * for Checking whether this product is
                         * being accepted or not
                         */
                        for (item1 in selectedCPR.flighttocust) {
                           var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                           if (acceptedFlightNo == selectflightID) {
                              for (item2 in selectedCPR.flighttocust[item1].customer) {
                                 var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                                 if (acceptedCustomerNo == selectedCustID) {
                                    productList.push({
                                       "prodID": productID,
                                       "url": ""
                                    });
                                 }
                              }
                           }
                        }
                     }

                     //Formation of the action url for MBP

                     var productIDs_inUrl = [];
                     var head_inUrl = [];
                     for (var i = 0; i < productList.length; i++) {

                        var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(journey, productList[i].prodID);
                        var paxID = paxIDandFlightID.split("~")[0];
                        var flightID = paxIDandFlightID.split("~")[1];
                        var paxName = journey[paxID].personNames[0].givenNames[0] + " " + journey[paxID].personNames[0].surname;
                        var flight = journey[flightID].operatingAirline.companyName.companyIDAttributes.code + journey[flightID].operatingAirline.flightNumber;
                        var headName = paxName + " - " + flight;

                        productIDs_inUrl.push(productList[i].prodID);
                        head_inUrl.push(headName);

                        /*In case if adult is associated with an infant*/
                        if(journey[paxID].accompaniedByInfant==true){
                           var infantID = this.moduleCtrl.findInfantIDForCust(flightID,paxID);
                           var infantName = journey[infantID].personNames[0].givenNames[0] + " " + journey[infantID].personNames[0].surname;
                           var infHeadName = infantName + " - " + flight;
                           var infProdID = this.moduleCtrl.findProductidFrmflightid(journey, infantID, flightID);
                           productIDs_inUrl.push(infProdID);
                           head_inUrl.push(infHeadName);
                        }

                     }

                     var mainUrl;
                     var actionUrl;
                     mainUrlWithID = modules.view.merci.common.utils.URLManager.getFullURL('SSCIBoardingPassFlow.action', null);
                     url_spilt = mainUrlWithID.split('?');

                     url_1 = url_spilt[0].split(";jsession")[0];

                     UrlWithoutJsessionID = url_1 + "?" + url_spilt[1];



                     mainUrl = UrlWithoutJsessionID.split('#');
                     if (mainUrl[0].indexOf("CPRRetrieve") != -1) {
                        actionUrl = mainUrl[0].replace("CPRRetrieve", "SSCIBoardingPassFlow");
                     } else {
                        actionUrl = mainUrl[0].replace("gettripFlow", "SSCIBoardingPassFlow");
                     }
                     var languages = UrlWithoutJsessionID.split("LANGUAGE=");
                     var lang = languages[1].split("&")[0];
                     var sites = mainUrl[0].split("SITE=");
                     var site = sites[1].split("&")[0];

                     actionUrl = actionUrl + "&pID=" + productIDs_inUrl + "&hName=" + head_inUrl + "&CHANNEL=MOBILE";
                     escape_url = escape(actionUrl);


                     for (var i = 0; i < productList.length; i++) {
                        productList[i].url = escape_url;
                     }


                     var fullNum = "+" + phoneNum;
                     validSMSs += 1;
                     bpRequests.push({
                        "custID": selectedCustID,
                        "productList": productList,
                        "phoneNum": fullNum
                     });
                  } else {
                     validSMSs -= 1;
                  }
                  }else{
                     validSMSs = selectCustList.length;
                     errors.push({
                        "localizedMessage": jQuery.substitute(errorStrings[21400059].localizedMessage,this.label.Sms),
                        "code": errorStrings[21400059].errorid
                     });
                     break;
                  }
               }

               /* Begin Error Displaying Section */
               if (validSMSs != (selectCustList.length)) {
                  errors.push({
                     "localizedMessage": errorStrings[25000049].localizedMessage,
                     "code": errorStrings[25000049].errorid
                  });
               }
               if (errors != null && errors.length > 0) {
                  this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
                  evt.stopPropagation();
                  return;
               }
               /* End Error Displaying Section */

               /* Begin Sending Backend Request */
               var input = {
                  "bpRequests": bpRequests,
                  "bpType": "SMS",
                  "fromPage": "AcceptanceConfirmation"
               };
               $('#CommonPopup').css('display', 'none');
               this.moduleCtrl.deliverDocument(input);
               this.KarmaOnSMSClick["T17"] = bpRequests; //For TDD
               /* End Sending Backend Request */
            } catch (exception) {
               this.$logError(
                  'AcceptanceConfirmationScript::An error occured in onSMSClick function',
                  exception);
            }
         } else {
            evt.stopPropagation();
            return;
         }
      },

      /*Begin : On Clicking Of MBP Button*/
      onMBPButtonClick: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onMBPButtonClick function');
         try {
            var _this = this;

            if ($('ul.getPassbook .app.disabled').length == 0) {
               /*
                * As exit popup should show on click of any of mbp spbp buttons the flow changed like
                *
                * if PNR need to collect exit details then show exit popup first and then
                *
                * show MBP or SPBp popup
                *
                *other wise show mbp or spbp directly
                *
                * */
               this.showExitRow(

                  function() {

                     /* Begin Processing Of Data Before Lading The Pop Up */
                     var selectedCPR = _this.moduleCtrl.getSelectedCPR();
                     var CPRdata = _this.moduleCtrl.getCPR();
                     var journey = selectedCPR.journey;
                     /*In case of 1 passenger 1 segment direct landing to boarding pass*/
                     if (selectedCPR.custtoflight.length == 1 && selectedCPR.custtoflight[0].product.length == 1) {
                        var selectedCustID = selectedCPR.custtoflight[0].customer;
                        var selectflightID = selectedCPR.custtoflight[0].product[0];
                        var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);

                        var bpRequests = [];
                        var productList = [];

                        productList.push(productID);

                        bpRequests.push({
                           "productList": productList
                        });

                        var input = {
                           "bpRequests": bpRequests,
                           "bpType": "MBP",
                           "fromPage": "AcceptanceConfirmation"
                        };
                        _this.moduleCtrl.deliverDocument(input);
                        return "mbp";
                     }

                     _this.popUpSelected = "MBP";
                     _this.filteredCustomerList = {};
                     _this.filteredSelectedFlightList = [];
                     /*
                      * List Containing
                      * only passengers
                      * which are
                      * accepted on the
                      * selected flights
                      */
                     var boxes = $('.flightSelCheckBox:checked');
                     $(boxes).each(function() {
                        for (var flight in selectedCPR.flighttocust) {
                           if (selectedCPR.flighttocust[flight].product == $(this).val()) {

                              _this.filteredSelectedFlightList.push($(this).val());

//                              for (var customer in selectedCPR.flighttocust[flight].customer) {
//                                 _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//                              }

                           }
                        }

                     });
                     for (var customer in selectedCPR.custtoflight){
                      	for(var flight in selectedCPR.custtoflight[customer].product){
                      		if(_this.filteredSelectedFlightList.indexOf(selectedCPR.custtoflight[customer].product[flight]) != -1){
                      			_this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
                      			break;
                      		}
                      	}
                      }

                     /* End Processing Of Data Before Lading The Pop Up */

                     jQuery(document).scrollTop("0");
                     jQuery("#initiateandEditCommonErrors").disposeTemplate();
                     jQuery("#CommonPopup").html("");

                     _this.$refresh({
                        section: "popupSection"
                     });
                     _this.openSSCIDialog($('#CommonPopup'));

                     return "mbp";

                  }
               );
            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onMBPButtonClick function', exception);
         }
      },
      /*End : On Clicking Of MBP Button*/

      /*Begin : On Clicking Get MBP */
      onMBPClick: function(evt, args) {
         if ($(".customerSelectCheckBox:checked").length != 0) {
            this.$logInfo('AcceptanceConfirmationScript::Entering onMBPClick function');
            try {

               evt.preventDefault();
               var _this = this;
               var bpRequests = [];
               var CPRdata = _this.moduleCtrl.getCPR();
               var selectedCPR = _this.moduleCtrl.getSelectedCPR();
               var journey = selectedCPR.journey;
               var errorStrings = null;
               var checkinData = _this.moduleCtrl.getModuleData();
               if (typeof checkinData != "undefined") {
                  errorStrings = checkinData.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
               }

               jQuery(document).scrollTop("0");
               var errors = [];
               var selectFlightList = [];
               var selectCustList = [];
               $('input[name=product]:checked').each(function() {
                  selectFlightList.push($(this).val());
               });
               $('input[name=pax11]:checked').each(function() {
                  selectCustList.push($(this).val());
               });
               if (!selectCustList.length >= 1) {
                  errors.push({
                     "localizedMessage": errorStrings[25000048].localizedMessage,
                     "code": errorStrings[25000048].errorid
                  });
               }
               var productList = [];
               for (var custIndex in selectCustList) {
                  var selectedCustID = selectCustList[custIndex];

                  for (var flightIDIndex in selectFlightList) {
                     var selectflightID = selectFlightList[flightIDIndex];
                     var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);
                     /*
                      * for Checking whether this product is
                      * being accepted or not
                      */
                     for (item1 in selectedCPR.flighttocust) {
                        var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                        if (acceptedFlightNo == selectflightID) {
                           for (item2 in selectedCPR.flighttocust[item1].customer) {
                              var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                              if (acceptedCustomerNo == selectedCustID) {
                                 productList.push(productID);
                              }
                           }
                        }
                     }
                  }

               }

               bpRequests.push({
                  "productList": productList
               });
               if (errors != null && errors.length > 0) {
                  _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
                  evt.stopPropagation();
                  return;
               }
               /* End Error Displaying Section */

               /* Begin Sending Backend Request */
               var input = {
                  "bpRequests": bpRequests,
                  "bpType": "MBP",
                  "fromPage": "AcceptanceConfirmation"
               };
               $('#CommonPopup').css('display', 'none');
               _this.moduleCtrl.deliverDocument(input);
               this.KarmaOnMBPClick["T12"] = bpRequests; //For TDD
               /* End Sending Backend Request */

            } catch (exception) {
               this.$logError('AcceptanceConfirmationScript::An error occured in onMBPClick function', exception);
            }
         } else {
            evt.stopPropagation();
            return;
         }

      },
      /*End : On Clicking Get MBP */

      /*Begin : On Passbook Button Click*/
      onPassBookButtonClick: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onPassBookButtonClick function');
         try {
            var _this = this;
            if ($('ul.getPassbook .add-passbook.disabled').length == 0) {
               /*
                * As exit popup should show on click of any of mbp spbp buttons the flow changed like
                *
                * if PNR need to collect exit details then show exit popup first and then
                *
                * show MBP or SPBp popup
                *
                *other wise show mbp or spbp directly
                *
                * */
               this.showExitRow(

                  function() {
                      /* Begin Processing Of Data Before Lading The Pop Up */
                      var selectedCPR = _this.moduleCtrl.getSelectedCPR();
                      var cpr = _this.moduleCtrl.getCPR();
              		  var journey = cpr[selectedCPR.journey];
                      _this.filteredCustomerList = {};
                      _this.filteredSelectedFlightList = [];
                      /*
                       * List Containing
                       * only passengers
                       * which are
                       * accepted on the
                       * selected flights
                       */
                      //We Require only the Flight Selected in case of passbook for Confirmation page
                      var boxes = $('.flightSelCheckBox:checked');
                      $(boxes).each(function() {
                         for (var flight in selectedCPR.flighttocust) {
                            if (selectedCPR.flighttocust[flight].product == $(this).val()) {

                               _this.filteredSelectedFlightList.push($(this).val());

//                               for (var customer in selectedCPR.flighttocust[flight].customer) {
//                                  _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//                               }

                            }
                         }

                      });


                     var singleProductID = "";
                     if(_this.filteredSelectedFlightList.length == 1){
                    	for(var flight in selectedCPR.flighttocust){
                    		if((selectedCPR.flighttocust[flight].product == _this.filteredSelectedFlightList[0])
                    				&& (selectedCPR.flighttocust[flight].customer.length == 1)){
                    			singleProductID = _this.moduleCtrl.findProductidFrmflightid(journey,selectedCPR.flighttocust[flight].customer[0],selectedCPR.flighttocust[flight].product);
               				}
                    	}
                     }
                     if( singleProductID != ""){
                    	 _this.onPassbookClick("",{"productID" :singleProductID });
                     }
                     else{
                     /* Begin Processing Of Data Before Lading The Pop Up */
                     _this.popUpSelected = "passbook";

                     jQuery(document).scrollTop("0");
                     jQuery("#initiateandEditCommonErrors").disposeTemplate();
                     jQuery("#CommonPopup").html("");

                     _this.$refresh({
                        section: "popupSection"
                     });
                     _this.openSSCIDialog($('#CommonPopup'));

                     return "passbook";
                  }

                  }

               );

            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onPassBookButtonClick function', exception);
         }
      },
      /*End : On Passbook Button Click*/

      /*Begin : On Clicking Get Passbook */
//      onPassbookClick: function(evt, args) {
//         this.$logInfo('AcceptanceConfirmationScript::Entering onPassbookClick function');
//         evt.preventDefault();
//         try {
//            var _this = this;
//            var CPRdata = _this.moduleCtrl.getCPR();
//            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
//            var journey = selectedCPR.journey;
//            var selectedMBPs = [];
//            var errorStrings = null;
//            var checkinData = _this.moduleCtrl.getModuleData();
//            if (typeof checkinData != "undefined") {
//               errorStrings = checkinData.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
//            }
//
//            jQuery(document).scrollTop("0");
//            var errors = [];
//            var selectFlightList = [];
//            $('input[name=product]:checked').each(function() {
//               selectFlightList.push($(this).val());
//            });
//            if (!selectFlightList.length >= 1) {
//               errors.push({
//                  "localizedMessage": errorStrings[25000048].localizedMessage,
//                  "code": errorStrings[25000048].errorid
//               });
//            }
//            var productList = [];
//            for (item1 in selectedCPR.flighttocust) {
//               var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
//               for (item2 in selectedCPR.flighttocust[item1].customer) {
//                  var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
//                  if (CPRdata[journey][acceptedCustomerNo].passengerTypeCode != "INF") {
//                     var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], acceptedCustomerNo, acceptedFlightNo);
//                     productList.push(productID);
//                  }
//               }
//            }
//
//
//            selectedMBPs.push({
//               "productList": productList
//            });
//
//            if (errors != null && errors.length > 0) {
//               _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
//               evt.stopPropagation();
//               this.KarmaOnPassbookClick["T11"] = 'Please enter a valid email address.'; //For TDD
//               return;
//            }
//            /* End Error Displaying Section */
//
//            /* Begin Sending Backend Request */
//            var input = {
//               "bpRequests": selectedMBPs,
//               "bpType": "passbook",
//               "fromPage": "AcceptanceConfirmation"
//            };
//            $('#CommonPopup').css('display', 'none');
//            _this.moduleCtrl.deliverDocument(input);
//            /* End Sending Backend Request */
//
//         } catch (exception) {
//            this.$logError('AcceptanceConfirmationScript::An error occured in onPassbookClick function', exception);
//         }
//      },
      /*End : On Clicking Get Passbook */


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


      // Function called to dispatch to home page
      onChknHome: function(evt) {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering onChknHome function');
            var _this = this;
            jQuery(document).scrollTop("0");
            // _this.showOverlay(true);
            modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
            // we call the controller to land on sendsms page
            _this.moduleCtrl.loadHome();
         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onChknHome function', exception);
         }
      },

      /**
       * onModuleEvent : Module event handler called when a module
       * event is raised.
       */
      onModuleEvent: function(evt) {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering onModuleEvent function');
            // var errorStrings = this.moduleCtrl.getErrorStrings();

            var _this = this;
            switch (evt.name) {
               case "server.error":
                  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
                  jQuery('#overlayCKIN').hide();
                  jQuery('#splashScreen').hide();
                  var errors = [];
                  errors.push({
                     "localizedMessage": _this.errorStrings[21400069].localizedMessage,
                     "code": _this.errorStrings[21400069].errorid
                  });
                  _this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
                  break;
               case "page.refresh":

                  _this.$refresh();
                  break;
            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onModuleEvent function', exception);
         }
      },

      onCancelCheckIn: function(evt, args) {
         this.$logInfo('AcceptanceConfirmationScript::Entering onCancelCheckIn function');
         try {

            var flightID = args.flight;
            var _this = this;

            if ($("#service_flight" + flightID).find('input[type=checkbox]:checked').length == 0) {
               return null;
            }

            jQuery(document).scrollTop("0");
            evt.preventDefault();
            jQuery("#initiateandEditErrors").disposeTemplate();
            jQuery("#acceptConfErrs").disposeTemplate();

            var errors = [];

            var custumerSelectedforCancel = [];
            var customersOnFlight = null;
            var customersRemainingForCancel = [];

            var cpr = _this.moduleCtrl.getCPR();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            var journey = cpr[selectedCPR.journey];

            var selector = "#service_flight" + flightID;

            $(selector).find('input[type=checkbox]:checked').each(function() {
               var custID = $(this).val();
               custumerSelectedforCancel.push(custID);
            });

            for (var l_flight in selectedCPR.flighttocust) {
               if (selectedCPR.flighttocust[l_flight].product == flightID) {
                  customersOnFlight = selectedCPR.flighttocust[l_flight].customer;
               }
            }

            for (var l_custs in customersOnFlight) {
               if (custumerSelectedforCancel.indexOf(customersOnFlight[l_custs]) == -1) {
                  customersRemainingForCancel.push(customersOnFlight[l_custs]);
               }
            }


            /*Begin : Child Alone Cannot be left alone Checked-in*/
            this.currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd");

            var minorAgeLmtParam = parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;
            //var minorCheckToBePerformed = this.parameters.SITE_SSCI_RESTRICT_MINOR;
            var minorCheckToBePerformed = "true";

            var childCount = 0;
            var validAdultCount = 0;
            var minorCount = 0;
            var SSRCount = 0;

            for (var custID_no in customersRemainingForCancel) {
               var custID = customersRemainingForCancel[custID_no];
               var cust = journey[custID];

               if (journey[custID].passengerTypeCode == "ADT") {
                  var selDOB = "";
                  var years = 0;
                  /**Checking SSR Validity**/
                  var primeFlightID = journey.firstflightid;
                  var constraint = custID + primeFlightID;
                  var ssrValidAdult = true;
                  for (var serviceNo in journey.service) {
                     var service = journey.service[serviceNo];
                     if (serviceNo.indexOf(constraint) != '-1') {
                        if (this.parameters.SITE_SSCI_SR_CANT_CI_ALON.toUpperCase().search(service.services[0].SSRCode) != "-1") {
                           ssrValidAdult = false;
                        }
                     }
                  }

                  if (ssrValidAdult) {
                     if (((minorCheckToBePerformed != "") && (minorCheckToBePerformed.search(/true/i) != -1))) {
                        /*BEGIN : Getting Adults Most Updated DOB First From Regulatory Bean And If not There then From IDC Else With No DOB*/
                        if ((!jQuery.isUndefined(journey.customerDetailsBeans)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID])) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails)) && (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas)) && (0 < (journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas.length))) {
                           for (var i in journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas) {
                              if (!jQuery.isUndefined(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[i].personalDetailsBirthDate)) {
                                 selDOB = new Date(journey.customerDetailsBeans[custID].regulatoryDetails.requirementDatas[i].personalDetailsBirthDate);
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
                     SSRCount += 1;
                  }
               } else if (journey[custID].passengerTypeCode == "CHD") {
                  childCount++;
               }
            }

            /**Checking checkedIn Pax In the Segment*/
            if ((childCount > 0 || minorCount > 0 || SSRCount > 0) && validAdultCount <= 0) {
               var childOrMinorNotAloneflag = false;

               if (!childOrMinorNotAloneflag) {
                  if ((childCount > 0) || (minorCount > 0) || (SSRCount > 0)) {
                     errors.push({
                        "localizedMessage": this.errorStrings[25000130].localizedMessage,
                        "code": this.errorStrings[25000130].errorid
                     });
                     this.KarmaOnCancelCheckIn["T13"] = "Minor(s) left alone for cancellation, please cancel his/her check-in before your cancellation."; //For TDD
                     this.KarmaOnCancelCheckIn["T15"] = "WCHR pax left alone for cancellation, please cancel his/her check-in before your cancellation."; //For TDD
                     this.KarmaOnCancelCheckIn["T16"] = "CHD left alone for cancellation, please cancel his/her check-in before your cancellation."; //For TDD
                  }
               }
            }


            if (errors != null && errors.length > 0) {
               this.moduleCtrl.displayErrors(errors, "acceptConfErrs", "error");
               modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
               return null;
            }

            /*End : Checkin Child Alone Cannot Checkin Condition*/



            jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
            jQuery("#cancelConf").removeClass("displayNone").addClass("displayBlock");

            jQuery("#cancelConf #cancelButton").click(function() {
               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
               jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");
               _this.KarmaOnCancelCheckIn["T14"] = "Cancel button disabled"; //For TDD
            });

            jQuery("#cancelConf #okButton").click(function() {
               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
               jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");

               var cpr = _this.moduleCtrl.getCPR();
               var selectedCPR = _this.moduleCtrl.getSelectedCPR();
               var journey = cpr[selectedCPR.journey];

               var cancelRequest = [];

               var selector = "#service_flight" + flightID;

               $(selector).find('input[type=checkbox]:checked').each(function() {
                  var custID = $(this).val();
                  var l_prodID = _this.moduleCtrl.findProductidFrmflightid(journey, custID, flightID);
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
               });
               var cancelAcceptanceInput = {};
               cancelAcceptanceInput.cancelRequest = cancelRequest;
               _this.KarmaOnCancelCheckIn["T14"] = cancelRequest; //For TDD
               _this.moduleCtrl.cancelAcceptance(cancelAcceptanceInput);
            });


         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onCancelCheckIn function', exception);
         }
      },

      getAgeOfCustomerInYears: function(selDOB) {
         this.$logInfo('AcceptanceConfirmationScript::Entering getAgeOfCustomerInYears function');
         try {
            var years = 0;
            var dCurr = new Date(this.currDate);
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
            this.$logError('AcceptanceConfirmationScript::An error occured in getAgeOfCustomerInYears function', exception);
         }
      },


      onHomeClick: function(evt) {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering onHomeClick function');
            if (this.moduleCtrl.getEmbeded()) {
               window.location = "sqmobile" + "://?flow=MCI/exitCheckIn";
            } else {
               window.location = this.siteParams.homeURL;
            }
         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onHomeClick function', exception);
         }
      },

      openDialogforConfirmationMail: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering openDialogforConfirmationMail function');

            if (this.moduleCtrl == undefined) {
               return null;
            }

            var cpr = this.moduleCtrl.getCPR();
            var selectedCPR = this.moduleCtrl.getSelectedCPR();
            var journey = selectedCPR.journey;
            this.popUpSelected = "ConfEmail";
            this.filteredCustomerList = {};
            this.filteredSelectedFlightList = [];
            var _this = this;

            var boxes = $('.flightSelCheckBox:checked');
            $(boxes).each(function() {
               for (var flight in selectedCPR.flighttocust) {
                  if (selectedCPR.flighttocust[flight].product == $(this).val()) {

                     _this.filteredSelectedFlightList.push($(this).val());

//                     for (var customer in selectedCPR.flighttocust[flight].customer) {
//                        var custID = selectedCPR.flighttocust[flight].customer[customer];
//                        if (cpr[journey][custID].passengerTypeCode!="INF") {
//
//                        var phoneandEmail = _this.moduleCtrl.getPaxDetailsForPrefill(selectedCPR.flighttocust[flight].customer[customer], "Phone");
//                        var email = null;
//                        if (phoneandEmail != "") {
//                           email = phoneandEmail.split("~")[1];
//                           if (email == "") {
//                              email = null;
//                           }
//                        }
//                        if (email == null) {
//                           _this.filteredCustomerList[selectedCPR.flighttocust[flight].customer[customer]] = "";
//                        }
//                     }
//                     }

                  }
               }

            });

            for (var customer in selectedCPR.custtoflight){
              	for(var flight in selectedCPR.custtoflight[customer].product){
              		if(_this.filteredSelectedFlightList.indexOf(selectedCPR.custtoflight[customer].product[flight]) != -1){
              			var custID = selectedCPR.custtoflight[customer].customer;

                        if (cpr[journey][custID].passengerTypeCode!="INF") {

                            var phoneandEmail = _this.moduleCtrl.getPaxDetailsForPrefill(selectedCPR.custtoflight[customer].customer, "Phone");
                        var email = null;
                        if (phoneandEmail != "") {
                           email = phoneandEmail.split("~")[1];
                           if (email == "") {
                              email = null;
                           }
                        }
                        if (email == null) {
                               _this.filteredCustomerList[selectedCPR.custtoflight[customer].customer] = "";
                               break;
                        }
                     }
                     }
                  }
               }

            if (Object.keys(this.filteredCustomerList).length > 0) {
               jQuery(document).scrollTop("0");
               jQuery("#initiateandEditCommonErrors").disposeTemplate();
               jQuery("#CommonPopup").html("");

               this.$refresh({
                  section: "popupSection"
               });
               this.openSSCIDialog($('#CommonPopup'));
               this.KarmaOpenDialogforConfirmationMail["T18"] = "Dialog opened for Confirmation"; //For TDD
            }

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in openDialogforConfirmationMail function', exception);
         }
      },

      onConfEmailSendClick: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering onConfEmailSendClick function');
            jQuery("#initiateandEditCommonErrors").disposeTemplate();
            var _this = this;
            var CPRdata = _this.moduleCtrl.getCPR();
            var selectedCPR = _this.moduleCtrl.getSelectedCPR();
            var journey = selectedCPR.journey;
            var selectedEmails = [];
            var errorStrings = null;
            var checkinData = _this.moduleCtrl.getModuleData();
            if (typeof checkinData != "undefined") {
               errorStrings = checkinData.checkIn.MSSCIAcceptanceConfirmation_A.errorStrings;
            }
            jQuery(document).scrollTop("0");
            var errors = [];
            var email = [];
            var selectFlightList = [];
            var selectCustList = [];
            var validEmailIds = 0;
            $('input[name=product]:checked').each(function() {
               selectFlightList.push($(this).val());
            });

            selectCustList = Object.keys(this.filteredCustomerList);

            if (!selectCustList.length >= 1) {
               errors.push({
                  "localizedMessage": errorStrings[25000048].localizedMessage,
                  "code": errorStrings[25000048].errorid
               });
               this.KarmaOnConfEmailSendClick["T20"]="Please select at least one customer";
            }

            for (var custIndex in selectCustList) {
               var selectedCustID = selectCustList[custIndex];
               var selector = "#eMailPax" + selectedCustID;
               var emailId = jQuery(selector).val();
               if (emailId != null && typeof emailId !== "undefined" && emailId.trim() != "") {
                  if (_this.moduleCtrl.validateEmail(emailId)) {
                     validEmailIds += 1;
                     email.push({
                        "customerID": selectedCustID,
                        "emailId": emailId
                     });
                     var productList = [];
                     for (var flightIDIndex in selectFlightList) {
                        var selectflightID = selectFlightList[flightIDIndex];
                        var productID = _this.moduleCtrl.findProductidFrmflightid(CPRdata[journey], selectedCustID, selectflightID);
                        /*
                         * for Checking whether this product is
                         * being accepted or not
                         */
                        for (item1 in selectedCPR.flighttocust) {
                           var acceptedFlightNo = selectedCPR.flighttocust[item1].product;
                           if (acceptedFlightNo == selectflightID) {
                              for (item2 in selectedCPR.flighttocust[item1].customer) {
                                 var acceptedCustomerNo = selectedCPR.flighttocust[item1].customer[item2];
                                 if (acceptedCustomerNo == selectedCustID) {
                                    productList.push(productID);
                                 }
                              }
                           }

                        }
                     }
                     selectedEmails.push({
                        "custID": selectedCustID,
                        "productList": productList,
                        "email": emailId
                     });
                  } else {
                     validEmailIds -= 1;
                  }
               }else{
                   validEmailIds = selectCustList.length;
                   errors.push({
                      "localizedMessage": jQuery.substitute(errorStrings[21400059].localizedMessage,this.label.Email),
                      "code": errorStrings[21400059].errorid
                   });
                   this.KarmaOnConfEmailSendClick["T22"] = "Please provide Email for all customers";
                   break;
               }
            }

            /* Begin Error Displaying Section */
            if (validEmailIds != selectCustList.length) {
               errors.push({
                  "localizedMessage": errorStrings[25000048].localizedMessage,
                  "code": errorStrings[25000048].errorid
               });
               this.KarmaOnConfEmailSendClick["T21"] = "Please provide valid email for all customers";
            }
            if (errors != null && errors.length > 0) {
               _this.moduleCtrl.displayErrors(errors, "initiateandEditCommonErrors", "error");
               //evt.stopPropagation();
               return;
            }
            /* End Error Displaying Section */

            if (selectedEmails.length > 0) {
               for(var conf_emails in selectedEmails){
                  var custNumber=selectedEmails[conf_emails].custID;
                  var custEmail=selectedEmails[conf_emails].email;
                  if(this.data.passengerDetails[custNumber]!=undefined){
                     this.data.passengerDetails[custNumber].email=custEmail;
                  }else{
                     this.data.passengerDetails[custNumber]={};
                     this.data.passengerDetails[custNumber].email=custEmail;
                     this.data.passengerDetails[custNumber].phoneNumber="";
                  }
               }
               var input = {};
               input.confMailRequests = selectedEmails;
                this.KarmaOnConfEmailSendClick["T19"] = selectedEmails; //For TDD
               this.moduleCtrl.sendConfirmationMail(input);
            }

            $('#CommonPopup').css('display', 'none');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
           
            jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");

         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in onConfEmailSendClick function', exception);
         }
      },

      sendConfirmationMail: function() {
         try {
            this.$logInfo('AcceptanceConfirmationScript::Entering sendConfirmationMail function');

            var cpr = this.moduleCtrl.getCPR();
            var selectedCPR = this.moduleCtrl.getSelectedCPR();
            var journey = cpr[selectedCPR.journey];
            var confMailRequests = [];

            for (var i in selectedCPR.custtoflight) {
               var productList = [];
               var custID = selectedCPR.custtoflight[i].customer;
               var phoneandEmail = this.moduleCtrl.getPaxDetailsForPrefill(custID, "Phone");
               var email = null;
               if (phoneandEmail != "") {
                  email = phoneandEmail.split("~")[1];
                  if (email == "") {
                     email = null;
                  }
               }

               if (email != null) {

                  for (var j in selectedCPR.custtoflight[i].product) {
                     var flightID = selectedCPR.custtoflight[i].product[j];
                     var prodID = this.moduleCtrl.findProductidFrmflightid(journey, custID, flightID);
                     productList.push(prodID);
                  }

                  confMailRequests.push({
                     "email": email,
                     "productList": productList
                  })
               }

            }
            this.KarmaSendConfirmationMail["T20"] = confMailRequests; //For TDD
            if (confMailRequests.length > 0) {
               var input = {};
               input.confMailRequests = confMailRequests;
               this.moduleCtrl.sendConfirmationMail(input);
            }


         } catch (exception) {
            this.$logError('AcceptanceConfirmationScript::An error occured in sendConfirmationMail function', exception);
         }


      },


      shareTrip: function(ATArgs, args) {
	      this.$logInfo('AcceptanceConfirmationScript::Entering shareTrip function');
         try {
         this.__clearShareNotification();
         //var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
         var client = "MobileWeb";
         var base = modules.view.merci.common.utils.URLManager.getBaseParams();
         
         if (base[14] != null && base[14] != '') {
            var clientName = base[14].toLowerCase();
            if (clientName == 'android') {
               client = "MobileAppAndroid";
            } else if (clientName == 'iphone') {
               client = "MobileAppiPhone";
            }
         }

         if (client == "MobileWeb" && this.utils.isRequestFromApps() != true) {
            console.log("args :" + args.id);
               jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); //To Show Plain Overlays
            var title = $(this).attr("data-title")

            var current = this;

            switch (args.id) {
               case 'FACEBOOK':
                     jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay
                  window.open('https://www.facebook.com/dialog/feed?app_id=' + this.parameters.siteFaceBookAPIKey + '&redirect_uri=http%3A%2F%2Fwww.facebook.com&display=popup&link=' + encodeURIComponent(this.confPageShareContentLink) + '&name=' + encodeURIComponent(this.confPageShareContentTitle) + '&description=' + encodeURIComponent(this.confPageShareContentDesc) + '&from_login=1');
                  this.KarmaShareTrip["message"]='https://www.facebook.com/dialog/feed?app_id=' + this.parameters.siteFaceBookAPIKey + '&redirect_uri=http%3A%2F%2Fwww.facebook.com&display=popup&link=' + encodeURIComponent(this.confPageShareContentLink) + '&name=' + encodeURIComponent(this.confPageShareContentTitle) + '&description=' + encodeURIComponent(this.confPageShareContentDesc) + '&from_login=1';
                  break;
               case 'GOOGLEPLUS':
                  $(".share-gp").show();
                  $(".panel.share-slider h1").html("Share <strong> ON " + args.id + "</strong>");
                  this.KarmaShareTrip["message"]="Trip shared on GOOGLEPLUS";
                  break;
               case 'LINKEDIN':

                   jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay

                  window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + current.confPageShareContentLink + '&title=' + current.confPageShareContentTitle + '&summary=' + current.confPageShareContentDesc + '&source=LinkedIn');
                  this.KarmaShareTrip["url"] = 'http://www.linkedin.com/shareArticle?mini=true&url=' + current.confPageShareContentLink + '&title=' + current.confPageShareContentTitle + '&summary=' + current.confPageShareContentDesc + '&source=LinkedIn';
                  break;

               case 'TWITTER':

                   jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay

                  var shareContent = this.confPageShareContentDesc;
                  if (shareContent.length > 140) {
                     shareContent = shareContent.substring(0, 136);
                     shareContent = shareContent + '...';
                  }
                  this.KarmaShareTrip["url"] = 'http://twitter.com/share?text=' + shareContent + '&url=,'+ 'scrollbars=no,menubar=no,height=450,width=650,resizable=yes,toolbar=no,location=no,status=no';
                  window.open('http://twitter.com/share?text=' + shareContent + '&url=,'+ 'scrollbars=no,menubar=no,height=450,width=650,resizable=yes,toolbar=no,location=no,status=no');
                  break;
               case 'EMAIL':
                     current.openSSCIDialog($('#SharingPopup'));
                     $('#shareEmail').css('display', 'block');
                     $('#shareEmailButton').css('display', 'block');
                     $('#shareSMS').css('display', 'none');
                     $('#shareSMSButton').css('display', 'none');

                     $(".popup.input-panel h1").html("" + this.label.tx_merci_text_sm_share +" "+ this.label.tx_merci_text_sm_by_email);
                 	 document.getElementById("emailta").value = this.confPageShareContentDesc;
                  break;
               case 'SMS':
                     current.openSSCIDialog($('#SharingPopup'));
                     $('#shareSMS').css('display', 'block');
                     $('#shareSMSButton').css('display', 'block');
                     $('#shareEmail').css('display', 'none');
                     $('#shareEmailButton').css('display', 'none');

                     $(".popup.input-panel h1").html("" + this.label.tx_merci_text_sm_share +" "+this.label.tx_merci_text_sm_by_sms);
                  document.getElementById("smsta").value = this.confPageShareContentDesc;

                  break;
               default:

            }
         } else {
            this.utils.sendShareData(args.id, this.getShareData());
         }

         } catch (exception) {
	            this.$logError('AcceptanceConfirmationScript::An error occured in shareTrip function', exception);
	      }

      },
      cancelShare: function(ATArgs, args) {
          this.$logInfo('AcceptanceConfirmationScript::Entering cancelShare function');
         try {

         $(".msk").hide();
         $("#share-buttons-group1").removeClass("showShare");

         }catch (exception) {
              this.$logError('AcceptanceConfirmationScript::An error occured in cancelShare function', exception);
         }
      },
      getShareData: function() {
         //return shareData = 'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME';
          this.$logInfo('AcceptanceConfirmationScript::Entering getShareData function');
         try {
            //return shareData = 'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME';
         var origin = "";
         var destination = "";
         var flight = "";
         var departureDateTime = "";
         var departureAirport = "";
         var arrivalDateTime = "";
         var arrivalAirport = "";
         var shareData = "";

            var custFlightData = this.data.selectedCustFlightInformations;

         var selectedCPR = this.moduleCtrl.getSelectedCPR();

         for (var flightindex in selectedCPR.flighttocust) {

            var flightID = selectedCPR.flighttocust[flightindex].product;

               var originCity = custFlightData[flightID].departureCity;
               var destinationCity = custFlightData[flightID].arrivalCity;
               var departureTime = custFlightData[flightID].departureTime;

            // segment loop
            // var completeString = 'I am travelling from ORIGIN to DESTINATION on FLIGHT, departing on DEPATUREDATETIME from DEPARTUREAIRPORT and arriving on ARRIVALDATETIME at ARRIVALAIRPORT.';
            var completeString = this.label.tx_merci_text_sm_sampleData; //'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME .'
            origin = (originCity != null ? originCity : "");
            origin = " " + origin;
            destination = (destinationCity != null ? destinationCity : "");
            // flight = (segment.airline.code != null ? segment.airline.code : "") + " " + (segment.flightNumber != null ? segment.flightNumber : "");
            departureDateTime = (departureTime != null ? departureTime : "");
            // departureAirport = (segment.beginLocation.locationName != null ? segment.beginLocation.locationName : "") + (segment.beginTerminal != null ? (" Terminal " + segment.beginTerminal) : "");
            // arrivalDateTime = segment.endDate;
            // arrivalAirport = (segment.endLocation.locationName != null ? segment.endLocation.locationName : "") + (segment.endTerminal != null ? (" Terminal " + segment.endTerminal) : "");
            var shareDataString = new this.buffer(completeString);
            completeString = shareDataString.formatString([origin, destination, departureDateTime]);
            completeString = completeString.replace("GMT", '');
            //completeString = completeString.replace("ORIGIN", origin).replace("DESTINATION", destination).replace("FLIGHT", flight).replace("DEPATUREDATETIME", departureDateTime).replace("DEPARTUREAIRPORT", departureAirport).replace("ARRIVALDATETIME", arrivalDateTime).replace("ARRIVALAIRPORT", arrivalAirport).replace("GMT", '');

            shareData = shareData + completeString +" ";
         }
            this.KarmaGetShareData["T21"] = shareData; //For TDD
         console.log("getShareData" + shareData);
         return shareData;

         } catch (exception) {
              this.$logError('AcceptanceConfirmationScript::An error occured in getShareData function', exception);
          }
      },

      sendShareData: function(shareID, shareData) {},

      __clearShareNotification: function() {
          this.$logInfo('AcceptanceConfirmationScript::Entering __clearShareNotification function');
         try {
            jQuery(document).scrollTop("0");
            jQuery("#sharedMsg").disposeTemplate();
            jQuery("#shareNotEmail").disposeTemplate();
            jQuery("#shareNotSMS").disposeTemplate();
         }catch (exception) {
              this.$logError('AcceptanceConfirmationScript::An error occured in __clearShareNotification function', exception);
         }
      },

      cancelEmailShare: function() {
         console.log('cancelEmailShare');
         jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay
        // $(".msk").hide();
      },
      sendEmailShare: function() {
         console.log('sendEmailShare');

          $(".msk").show();
          $(".msk").css('z-index','1000000');
         var toFieldEL = document.getElementById('travellerToEmail').value;
         var fromFieldEL = document.getElementById('travellerFromEmail').value;
         var emailBody = document.getElementById('emailta').value;
         var subject = this.confPageShareContentTitle;
         var errors = [];
          //var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          var allToELValid = false;
          for(var toELIndex in toFieldEL.split(",")){
             if(this.moduleCtrl.validateEmail(toFieldEL.split(",")[toELIndex])){
                allToELValid = true;
             }else{
                allToELValid = false;
                break;
             }
          }
          if(fromFieldEL.trim() != "" && toFieldEL.trim() != ""){
          if(allToELValid && this.moduleCtrl.validateEmail(fromFieldEL)){
             var params = 'FROM=' + encodeURIComponent(fromFieldEL) + '&TO=' + encodeURIComponent(toFieldEL) + '&SUBJECT=' + encodeURIComponent(subject) + '&BODY=' + encodeURIComponent(emailBody) + '&result=json&MT=A';
         var request = {
            action: 'MMailWrapperAction.action',
            method: 'POST',
            parameters: params,
            isCompleteURL: false,
            expectedResponseType: 'json',
            cb: {
               fn: this.__sendEmailCallback,
               args: params,
               scope: this
            }
         };

          this.__clearShareNotification();
         	modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
         	this.KarmaSendEmailShare["request"] = request;
          }else{
             errors.push({
                     "localizedMessage": this.errorStrings[25000048].localizedMessage,
                     "code": this.errorStrings[25000048].errorid
             });
             this.moduleCtrl.displayErrors(errors, "shareNotEmail", "error");
             $(".msk").hide();
             $(".msk").css('z-index', '1');
             this.KarmaSendEmailShare["message"] = "Please enter a valid email address.";
          }
      	  }else{
                 errors.push({
                     "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage,this.label.Email),
                     "code": this.errorStrings[21400059].errorid
                  });
                 this.moduleCtrl.displayErrors(errors, "shareNotEmail", "error");
             $(".msk").hide();
             this.KarmaSendEmailShare["message"] = "Email field is mandatory";
      	  }
      },

      __sendEmailCallback: function(response) {
         this.__clearShareNotification();
         var json = response.responseJSON;
         if (json) {
            var pageId = json.homePageId;
            if (pageId === 'merci-MmailError') {
                $(".msk").hide();
                $(".msk").css('z-index', '1');;
            jQuery('body').scrollTop("0");
               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
               var errors = [];
               errors.push({
                  "localizedMessage": this.label.tx_ssci_email_error
               });
               this.moduleCtrl.displayErrors(errors, "sharedMsg", "error");
               $('#SharingPopup').css('display', 'none');
               this.KarmaSendEmailCallback["message"]="Error has occured while sending email.";
             } else {

               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay


               jQuery('body').scrollTop("0");
               var errors = [];
               errors.push({
                  "localizedMessage": this.label.tx_pltg_text_confirmationEmailHasBeenSent
               });
               this.moduleCtrl.displayErrors(errors, "sharedMsg", "warning");
               $('#SharingPopup').css('display', 'none');
               
               $(".msk").hide();
               this.KarmaSendEmailCallback["message"]="E-mail has been sent";
            }
         }
      },


      cancelSMSShare: function() {
         console.log('cancelSMSShare');
         $(".panel.share-slider").hide();

           jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay
      },

      sendSMSShare: function() {
         console.log('sendSMSShare');

         var travellerAreaCode = document.getElementById('travellerAreaCode').value;
         var travellerPhoneNo = document.getElementById('travellerPhoneNo').value;
         var errors = [];
         var smsta = document.getElementById('smsta').value;
           var ua = navigator.userAgent.toLowerCase();
         var subject = this.confPageShareContentTitle;
           var ver = this.findIOSVersion();
           var optionalPlus;

           if(travellerAreaCode.indexOf("+") == -1)
              optionalPlus = "+";
           else
              optionalPlus = "";
           var url;


                    /*********Replace when user enter code not selected from autocomplete***************/
           if (travellerAreaCode.length != 0 && travellerAreaCode.length <= 4) {

              if (travellerAreaCode.length == 1) {
                 travellerAreaCode = "000" + travellerAreaCode;
              } else if (travellerAreaCode.length == 2) {
                 if (travellerAreaCode.charAt(0) == "+") {
                    travellerAreaCode = "000" + travellerAreaCode.charAt(1);
                 } else {
                    travellerAreaCode = "00" + travellerAreaCode;
                 }
              } else if (travellerAreaCode.length == 3) {
                 if (travellerAreaCode.charAt(0) == "+") {
                    travellerAreaCode = "00" + travellerAreaCode.charAt(1) + travellerAreaCode.charAt(2);
                 } else {
                    travellerAreaCode = "0" + travellerAreaCode;
                 }
              } else {
                 if (travellerAreaCode.charAt(0) == "+") {
                    travellerAreaCode = "0" + travellerAreaCode.charAt(1) + travellerAreaCode.charAt(2) + travellerAreaCode.charAt(3);
                 }
              }
              document.getElementById('travellerAreaCode').value = travellerAreaCode;
              this.KarmaSendSMSShare["Areacode"] = travellerAreaCode;
            }



           var phoneNum = travellerAreaCode + travellerPhoneNo;
           if(phoneNum != null && typeof phoneNum !== "undefined" && phoneNum.trim() != ""){
	           if (this.moduleCtrl.validatePhoneNumber(phoneNum) && travellerAreaCode.length == 4 && phoneNum.length > 4 && smsta != null && smsta !=undefined) {

              if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) {
                if( ver < 8)
                 url = "sms://" + phoneNum + ";body=" + encodeURIComponent(smsta);
                else
                 url = "sms:" + phoneNum + "&body=" + encodeURIComponent(smsta);
              } else {
                url = "sms:" + phoneNum + "?body=" + encodeURIComponent(smsta);
              }
              jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay
              this.__clearShareNotification();
              $('#SharingPopup').css('display', 'none');
              window.location.href = url;
              this.KarmaSendSMSShare["message"] = url;
            } else {

                   errors.push({
                     "localizedMessage": this.errorStrings[25000049].localizedMessage,
                     "code": this.errorStrings[25000049].errorid
                   });
                   this.moduleCtrl.displayErrors(errors, "shareNotSMS", "error");


                 jQuery('body').scrollTop("0");
         }
      	   }else{
               errors.push({
                   "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage,this.label.Sms),
                   "code": this.errorStrings[21400059].errorid
               });
               this.moduleCtrl.displayErrors(errors, "shareNotSMS", "error");
               this.KarmaSendSMSShare["message"]="SMS field is mandatory.";
      	   }
      },
      onPassbookFlightButtonClick: function(event,args) {
          this.$logInfo('TripOverviewScript::Entering onPassbookFlightButtonClick function');
          try {
            $("[name='pkFlightButtons']").not(".PassbookCont"+args.flightID).each(function(){
              if($(this).css('display') == 'block'){
                $(this).slideToggle("slow");
              }

             // $(this).css({"display": "none"});
            });
            $("[name='passbookArrow']").not(".arrowIcon"+args.flightID).each(function(){
                if($(this).hasClass("up")){
                	$(this).toggleClass("up");
                }
            });

            $(".PassbookCont"+args.flightID).slideToggle("slow");
            $(".PassbookCont"+args.flightID).css({
              "display": "block"
            });
            $(".arrowIcon"+args.flightID).toggleClass("up");
          } catch (exception) {
            this.$logError('TripOverviewScript::An error occured in onPassbookFlightButtonClick function', exception);
          }
        },
        onPassbookClick: function(event,args){
        	this.moduleCtrl.addToPassBook(args.productID);
        	jQuery("#pkProduct"+args.productID).addClass("pkCreated");
        	this.data.passBookGenerated[args.productID] = "1";
        	jQuery(".msk").addClass("passbookZIndexInc");
      }
   }
});