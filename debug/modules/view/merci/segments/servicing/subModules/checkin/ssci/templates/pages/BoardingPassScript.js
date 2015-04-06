Aria.tplScriptDefinition({
   $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.BoardingPassScript',

   $dependencies: [
      'modules.view.merci.common.utils.MerciGA',
      'modules.view.merci.common.utils.MCommonScript',
      'modules.view.merci.common.utils.StringBufferImpl'
   ],

   $constructor: function() {
	  this.__ga = modules.view.merci.common.utils.MerciGA;
      this.utils = modules.view.merci.common.utils.MCommonScript;
      this.buffer = modules.view.merci.common.utils.StringBufferImpl;
      this.KarmaDisplayReady = {};
      this.KarmaSendEmailShare = {};
      this.KarmaSendEmailCallBack = {};
      this.KarmaSendSMSShare = {};
   },

   $prototype: {
      $dataReady: function() {
         try {
            this.$logInfo('BoardingPassScript: Entering dataReady function ');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            this.emailautocomlete = {
               autocompleteEmailList: []
            };

            var pageId = "MSSCIBoardingPassesList_A";
            if (!jQuery.isUndefined(jsonResponse.data.checkIn.MSSCIBoardingPass_A)) {
               pageId = "MSSCIBoardingPass_A";
            }
            var BoardingPassesListRespDtls = jsonResponse.data.checkIn[pageId].requestParam.BPResponseDetails;
            this.requestParam = jsonResponse.data.checkIn[pageId].requestParam;
            this.label = jsonResponse.data.checkIn[pageId].labels;
            this.siteParams = jsonResponse.data.checkIn[pageId].siteParam;
            this.parameters = jsonResponse.data.checkIn[pageId].parameters;
            this.errorStrings = jsonResponse.data.checkIn[pageId].errorStrings;
            /*for Change title incase comes from bp list page*/
            var title = this.label.Title;
            if (!jQuery.isUndefined(jsonResponse.data.checkIn["MSSCIBoardingPassesList_A"])) {
               title = this.label.BpTitle;
            }

            this.moduleCtrl.setHeaderInfo({
               title: this.label.Title,
               bannerHtmlL: this.requestParam.bannerHtml,
               homePageURL: this.siteParams.homeURL,
               showButton: true
            });

            /*Display of Share Button*/
            if (this.parameters.SITE_MC_ENBL_MBP_SHARE.toLowerCase() == "true") {

               this.confPageShareContentTitle = this.label.tx_merci_text_sm_title;
               this.confPageShareContentCaption = this.label.tx_merci_text_sm_caption;
               this.confPageShareImageURL = this.label.tx_merci_text_sm_airlines_image_url;
			   /* For Forming Useful Information Data.. */
               this.moduleCtrl.formingSelectedCustFlightInfo();
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
                     showButton: true,
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
                     showButton: true,
                     headerButton: headerButton,
                     googlePlusData: {
                        title: _this.confPageShareContentTitle,
                        caption: _this.confPageShareContentCaption,
                        link: _this.confPageShareContentLink,
                        description: _this.confPageShareContentDesc,
                        apiKey: googleAPIKey
                     }
                  });


                  /*$('#share-buttons-group li:not(.btn-close) button').click(function() {
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

            }




         } catch (_ex) {
            this.$logError('BoardingPassScript: an error has occured in dataReady function');
         }
      },


      $displayReady: function() {
         try {
            this.$logInfo('BoardingPassScript: Entering displayReady function ');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

            jQuery("#listboxa article").each(function(i, data) {

               if (jQuery(data).attr("atdelegate")) {
                  jQuery(data).attr("data-airp-list-onclick", jQuery(data).attr("atdelegate"));
                  jQuery(data).attr("data-airp-list-forheader_onclick", jQuery(data).attr("ondblclick"));

                  jQuery(data).removeAttr("atdelegate");
                  jQuery(data).removeAttr("ondblclick");
               }

            });


            if (aria.core.Browser.isIOS) {
               //eventItem="ontouchstart";
               eventItem = "atdelegate";

            } else {
               //eventItem="onclick";
               eventItem = "atdelegate";
            }
            /*
             * For hiding boarding pass header right arrow img
             * */
            hideBoardinglistheaderRtarro = true;

            var cpr = this.moduleCtrl.getCPR();
            /*For local storage*/
            /*
             * if condition to make sure in case of bitly not to store MBp
             * Why not store in case of bitly MBp is we wont be having cpr identification
             * and which requried to form local storage
             *
             * */
            if (cpr != null) {
               var boardingPassRespDtls = this.requestParam.BPResponseDetails;
               var deliveredDocuments = boardingPassRespDtls.deliveredDocuments;
               this.moduleCtrl.boardingPassLocalStorage(deliveredDocuments);
            }
            /*End For local storage*/

            if (this.data.NotAllBoardingPassIssued == true) {
               var errors = [];
               errors.push({
                  "localizedMessage": errorStrings[25000080].localizedMessage,
                  "code": errorStrings[25000080].errorid
               });

               this.moduleCtrl.displayErrors(errors, "boardingErrorMsgs", "error");
               //For TDD 
               this.KarmaDisplayReady["message"] = "Not all boarding passes can be issued";
            }
            this.data.NotAllBoardingPassIssued == false;


         } catch (exception) {
            this.$logError('BoardingPassScript::An error occured in displayReady function',
               exception);
         }
      },

      $viewReady: function() {
         this.$logInfo('BoardingPassScript::Entering viewReady function');
         try {
            var _thisClasses = this.moduleCtrl;
            jQuery("#listboxa:first-child").addClass("is-selected");
            var len = document.querySelectorAll("#listboxa>li").length;
            var width = len % 2 == 0 ? len * 350 : (len * 350) + 350;

            jQuery("#listboxa").css("width", width + "px");

            for (var i = 0; i < len; i++) {
               if (i == 0)
                  jQuery("#Indicator_details").append("<li class=\"is-selected\"></li>");
               else
                  jQuery("#Indicator_details").append("<li></li>");
            }

            setTimeout(function() {
               is_clickedOn_list = -1;
               positionCarrousel($('.carrousel-full'));
               lightSelectedUp();
               changeTitle();
               _thisClasses.setWarnings("");
            }, 400);

            jQuery(".carrousel-full").swipe({
               swipeLeft: function(event, direction, distance, duration, fingerCount) {
                  if (is_clickedOn_list == itemCounter) {
                     is_clickedOn_list = -1;
                     /*commented because causing prob swiping
                      * return;
                      */
                  }


                  var carrouselToMove = $(this).children('ul');
                  var totalSec = $(this).children('ul').children().length;

                  var middlePoint = $(document).width() / 2;

                  /*
                   * Condition to check if it is last trip and move left
                   */
                  if (itemCounter < (totalSec - 1)) {
                     moveCarrousel_left(carrouselToMove);
                  } else {
                     /*
                      * For provide not moving effect
                      */
                     carrouselToMove.animate({
                        left: '-=15px'
                     }, 300);
                     carrouselToMove.animate({
                        left: '+=15px'
                     }, 300);
                  }

               },

               swipeRight: function(event, direction, distance, duration, fingerCount) {
                  if (is_clickedOn_list == itemCounter) {
                     is_clickedOn_list = -1;
                     /*commented because causing prob swiping
                      * return;
                      */
                  }


                  var carrouselToMove = $(this).children('ul');
                  var totalSec = $(this).children('ul').children().length;

                  var middlePoint = $(document).width() / 2;

                  /*
                   * Condition to check if it is first trip and move right
                   * */
                  if (itemCounter > 0) {
                     moveCarrousel_right(carrouselToMove);
                  } else {
                     /*
                      * For provide not moving effect
                      * */
                     carrouselToMove.animate({
                        left: '+=15px'
                     }, 300);
                     carrouselToMove.animate({
                        left: '-=15px'
                     }, 300);

                  }


               }

            });

            /*GOOGLE ANALYTICS */
              if (this.moduleCtrl.getEmbeded()) {
                jQuery("[name='ga_track_pageview']").val("Boarding Pass");
                window.location = "sqmobile" + "://?flow=MCI/pageloaded=BoardingPass";

              } else {
                var GADetails = this.moduleCtrl.getGADetails();



                this.__ga.trackPage({
                  domain: GADetails.siteGADomain,
                  account: GADetails.siteGAAccount,
                  gaEnabled: GADetails.siteGAEnable,
                  page: 'Boarding Pass',
                  GTMPage: 'Boarding Pass'
                });
              }
              /*GOOGLE ANALYTICS */
              /*BEGIN : JavaScript Injection(CR08063892)*/
              if (typeof genericScript == 'function') {
      			genericScript({
      				tpl:"BoardingPass",
      				data:this.data
      			});
              }
              /*END : JavaScript Injection(CR08063892)*/

         } catch (exception) {
            this.$logError('BoardingPassScript::An error occured in viewReady function', exception);
         }

      },

      shareTrip: function(ATArgs, args) {
         this.$logInfo('BoardingPassScript::Entering shareTrip function');
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
                     break;
                  case 'GOOGLEPLUS':
                     $(".share-gp").show();
                     $(".panel.share-slider h1").html("Share <strong> ON " + args.id + "</strong>");
                     break;
                  case 'LINKEDIN':

                	 jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay

                     window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + current.confPageShareContentLink + '&title=' + current.confPageShareContentTitle + '&summary=' + current.confPageShareContentDesc + '&source=LinkedIn');
                     break;

                  case 'TWITTER':

                	 jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay

                     var shareContent = this.confPageShareContentDesc;
                     if (shareContent.length > 140) {
                        shareContent = shareContent.substring(0, 136);
                        shareContent = shareContent + '...';
                     }

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
            this.$logError('BoardingPassScript::An error occured in shareTrip function', exception);
         }

      },

      cancelShare: function(ATArgs, args) {
         this.$logInfo('BoardingPassScript::Entering cancelShare function');
         try {

            $(".msk").hide();
            $("#share-buttons-group1").removeClass("showShare");

         } catch (exception) {
            this.$logError('BoardingPassScript::An error occured in cancelShare function', exception);
         }
      },

      getShareData: function() {
         this.$logInfo('BoardingPassScript::Entering getShareData function');
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

            var flightID = this.moduleCtrl.getSelectedFlightforMBP();

            var originCity = custFlightData[flightID].departureCity;
            var destinationCity = custFlightData[flightID].arrivalCity;
            var departureTime = custFlightData[flightID].departureTime;


            var completeString = this.label.tx_merci_text_sm_sampleData; //'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME .'
            origin = (originCity != null ? originCity : "");
            origin = " " + origin;
            destination = (destinationCity != null ? destinationCity : "");

            departureDateTime = (departureTime != null ? departureTime : "");

            var shareDataString = new this.buffer(completeString);
            completeString = shareDataString.formatString([origin, destination, departureDateTime]);
            completeString = completeString.replace("GMT", '');


            shareData = completeString;


            console.log("getShareData" + shareData);
            return shareData;

         } catch (exception) {
            this.$logError('BoardingPassScript::An error occured in getShareData function', exception);
         }
      },

      // sendShareData: function(shareID, shareData) {},

      __clearShareNotification: function() {
         this.$logInfo('BoardingPassScript::Entering __clearShareNotification function');
         try {
            jQuery(document).scrollTop("0");
            jQuery("#boardingWarnMsg").disposeTemplate();
            jQuery("#shareNotEmail").disposeTemplate();
            jQuery("#shareNotSMS").disposeTemplate();
         } catch (exception) {
            this.$logError('BoardingPassScript::An error occured in __clearShareNotification function', exception);
         }
      },
      cancelEmailShare: function() {
          console.log('cancelEmailShare');
          jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay
         // $(".msk").hide();
       },

       sendEmailShare: function() {
          console.log('sendEmailShare');
          var errors = [];
          $(".msk").show();
          $(".msk").css('z-index','1000000');
          var toFieldEL = document.getElementById('travellerToEmail').value;
          var fromFieldEL = document.getElementById('travellerFromEmail').value;
          var emailBody = document.getElementById('emailta').value;
          var subject = this.confPageShareContentTitle;
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
               //For TDD
               this.KarmaSendEmailShare["requestFormed"] = request;
          }else{



             errors.push({
                     "localizedMessage": this.errorStrings[25000048].localizedMessage,
                     "code": this.errorStrings[25000048].errorid
             });
             this.moduleCtrl.displayErrors(errors, "shareNotEmail", "error");
             $(".msk").hide();
             $(".msk").css('z-index', '1');
               //For TDD
               this.KarmaSendEmailShare["requestFormed"] = null;
            }
          }else{
              errors.push({
                  "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage,this.label.Email),
                  "code": this.errorStrings[21400059].errorid
               });
              this.moduleCtrl.displayErrors(errors, "shareNotEmail", "error");
              $(".msk").hide();
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
               this.moduleCtrl.displayErrors(errors, "boardingWarnMsg", "error");
               $('#SharingPopup').css('display', 'none');
               //For TDD
               this.KarmaSendEmailCallBack["message"] = "Error recieved in pageID from backend";
             } else {

               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay


 					jQuery('body').scrollTop("0");
               var errors = [];
               errors.push({
                  "localizedMessage": this.label.tx_pltg_text_confirmationEmailHasBeenSent
               });
               this.moduleCtrl.displayErrors(errors, "boardingWarnMsg", "warning");
               $('#SharingPopup').css('display', 'none');

               //For TDD
               this.KarmaSendEmailCallBack["message"] = "No error recieved in pageID from backend";

               $(".msk").hide();

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
           var smsta = document.getElementById('smsta').value;
           var ua = navigator.userAgent.toLowerCase();
           var subject = this.confPageShareContentTitle;
           var ver = this.findIOSVersion();
           var optionalPlus;
           var errors = [];

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
           }else{

                   errors.push({
                     "localizedMessage": this.errorStrings[25000049].localizedMessage,
                     "code": this.errorStrings[25000049].errorid
                   });
                   this.moduleCtrl.displayErrors(errors, "shareNotSMS", "error");


                 jQuery('body').scrollTop("0");
               //For TDD
               this.KarmaSendSMSShare["message"] = "Invalid area code or phoneno";
           }
           }else{
               errors.push({
                   "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage,this.label.Sms),
                   "code": this.errorStrings[21400059].errorid
               });
               this.moduleCtrl.displayErrors(errors, "shareNotSMS", "error");
            //For TDD
            this.KarmaSendSMSShare["message"] = "Invalid area code or phoneno";
      	   }
        },
        findIOSVersion: function(evt) {
            this.$logInfo('BoardingPassScript::Entering findIOSVersion function');
            try {
               if (/iP(hone|od|ad)/.test(navigator.platform)) {
                  // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                  var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                  return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
               }
         } catch (exception) {
        	 this.$logError('BoardingPassScript::An error occured in findIOSVersion function',exception);
            }
         },
         addToPass: function(evt,args) {
             this.$logInfo('BoardingPassScript::Entering addToPass function');
             try {
             	jQuery("#pkProduct"+args.productID).addClass("pkCreated");
            	this.data.passBookGenerated[args.productID] = "1";
                this.moduleCtrl.addToPassBook(args.productID);
          } catch (exception) {
                this.$logError('BoardingPassScript::An error occured in addToPass function',exception);
            }
         },
         onBackClick:function(){
        	 this.$logInfo('BoardingPassScript::Entering onBackClick function');
        	 try{
        		 this.moduleCtrl.onBackClick();
        	 }catch (exception){
        		 this.$logError('BoardingPassScript::An error occured in onBackClick function', exception);
            }
         },
         openSSCIDialog: function(which) {
             this.$logInfo('BoardingPassScript::Entering openSSCIDialog function');
             try {
                jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); /*Will Be Shown When Code Integrated in Int of this CR */
                which.css('display', 'block');
             } catch (exception) {
                this.$logError('BoardingPassScript::An error occured in openSSCIDialog function', exception);
         }
      }
   }
});