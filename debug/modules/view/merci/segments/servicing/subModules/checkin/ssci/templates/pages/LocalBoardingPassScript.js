Aria.tplScriptDefinition({
   $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.LocalBoardingPassScript',

   $dependencies: [
      'modules.view.merci.common.utils.MCommonScript',
      'modules.view.merci.common.utils.StringBufferImpl'
   ],

   $constructor: function() {
      this.utils = modules.view.merci.common.utils.MCommonScript;
      this.buffer = modules.view.merci.common.utils.StringBufferImpl;
      this.KarmaSendEmailShare = {};
      this.KarmaSendEmailCallBack = {};
      this.KarmaSendSMSShare = {};

   },

   $prototype: {
      $dataReady: function() {
         try {
            this.$logInfo('LocalBoardingPassScript: Entering dataReady function ');
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();

            var json = this.moduleCtrl.getModuleData();

            if ((!this.utils.isEmptyObject(json.boardingPasses)) && (json.boardingPasses != null)) {
               this.boardingPasses = json.boardingPasses;
            }

            if ((!this.utils.isEmptyObject(json.bpParams)) && (json.bpParams != null)) {
               this.parameters = json.bpParams;
            }

            if ((!this.utils.isEmptyObject(json.bpLabels)) && (json.bpLabels != null)) {
               this.label = json.bpLabels;
            }

            if (this.parameters.SITE_MC_ENBL_MBP_SHARE.toLowerCase() == "true") {

               var headerButton = {};
               var arr = [];
               var arrShare = [];
               this.confPageShareContentTitle = this.label.tx_merci_text_sm_title;
               this.confPageShareContentDesc = this.getShareData();
               headerButton.scope = this;

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
                     headerButton: headerButton
                  });
               }

            }

         } catch (_ex) {
            this.$logError('LocalBoardingPassScript: an error has occured in dataReady function');
         }
      },


      $displayReady: function() {
         try {
            this.$logInfo('LocalBoardingPassScript: Entering displayReady function ');
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



         } catch (exception) {
            this.$logError('LocalBoardingPassScript::An error occured in displayReady function', exception);
         }
      },

      $viewReady: function() {
         this.$logInfo('LocalBoardingPassScript::Entering viewReady function');
         try {

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
            /*BEGIN : JavaScript Injection(CR08063892)*/
            if (typeof genericScript == 'function') {
    			genericScript({
    				tpl:"LocalBoardingPass",
    				data:this.data
    			});
            }
            /*END : JavaScript Injection(CR08063892)*/

         } catch (exception) {
            this.$logError('LocalBoardingPassScript::An error occured in viewReady function', exception);
         }

      },

      shareTrip: function(ATArgs, args) {
         this.$logInfo('LocalBoardingPassScript::Entering shareTrip function');
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
            this.$logError('LocalBoardingPassScript::An error occured in shareTrip function', exception);
         }
      },

      cancelShare: function(ATArgs, args) {
         this.$logInfo('LocalBoardingPassScript::Entering cancelShare function');
         try {
            $(".msk").hide();
            $("#share-buttons-group1").removeClass("showShare");
         } catch (exception) {
            this.$logError('LocalBoardingPassScript::An error occured in cancelShare function', exception);
         }

      },

      getShareData: function() {
         this.$logInfo('LocalBoardingPassScript::Entering getShareData function');
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

            var originCity = this.boardingPasses[Object.keys(this.boardingPasses)[0]].departureCity;
            var destinationCity = this.boardingPasses[Object.keys(this.boardingPasses)[0]].arrivalCity;
            var departureTime = this.boardingPasses[Object.keys(this.boardingPasses)[0]].depDate;

            var completeString = this.label.tx_merci_text_sm_sampleData; //'I will travel from ORIGIN to DESTINATION on the DEPATUREDATETIME .'
            origin = (originCity != null ? originCity : "");
            origin = " " + origin;
            destination = (destinationCity != null ? destinationCity : "");
            // flight = (segment.airline.code != null ? segment.airline.code : "") + " " + (segment.flightNumber != null ? segment.flightNumber : "");
            departureDateTime = (departureTime != null ? departureTime : "");

            var shareDataString = new this.buffer(completeString);
            completeString = shareDataString.formatString([origin, destination, departureDateTime]);
            completeString = completeString.replace("GMT", '');

            shareData = completeString;


            console.log("getShareData" + shareData);
            return shareData;

         } catch (exception) {
            this.$logError('LocalBoardingPassScript::An error occured in getShareData function', exception);
         }
      },

      sendShareData: function(shareID, shareData) {},

      __clearShareNotification: function() {
         this.$logInfo('LocalBoardingPassScript::Entering __clearShareNotification function');
         try {
            jQuery(document).scrollTop("0");
            if(document.getElementById('localBoardingWarnMsg')!= undefined || document.getElementById('localBoardingWarnMsg')!= null){
               document.getElementById('localBoardingWarnMsg').innerHTML = '';
               document.getElementById('localBoardingWarnMsg').className = '';
            }
            if(document.getElementById('shareNotEmail')!= undefined || document.getElementById('shareNotEmail')!= null){
               document.getElementById('shareNotEmail').innerHTML = '';
               document.getElementById('shareNotEmail').className = '';
            }
            if(document.getElementById('shareNotSMS')!= undefined || document.getElementById('shareNotSMS')!= null){
               document.getElementById('shareNotSMS').innerHTML = '';
               document.getElementById('shareNotSMS').className = '';
            }
         } catch (exception) {
            this.$logError('LocalBoardingPassScript::An error occured in __clearShareNotification function', exception);
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
          //var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          var allToELValid = false;
          for(var toELIndex in toFieldEL.split(",")){
             if(this.validateEmail(toFieldEL.split(",")[toELIndex])){
                allToELValid = true;
             }else{
                allToELValid = false;
                break;
             }
          }
          if(fromFieldEL.trim() != "" && toFieldEL.trim() != ""){
          if(allToELValid && this.validateEmail(fromFieldEL)){
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


         //For TDD
         this.KarmaSendEmailShare["requestFormed"] = request;
          this.__clearShareNotification();
          modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
          }else{

             

             document.getElementById('shareNotEmail').innerHTML =  '<ul><li class = "ext-came">' + this.label.emailNotValid + '</li></ul>';
             document.getElementById('shareNotEmail').className = 'msg warning';

             $(".msk").hide();
             $(".msk").css('z-index', '1');
            //For TDD
             this.KarmaSendEmailShare["requestFormed"] = null;
          }
          }else{
              document.getElementById('shareNotEmail').innerHTML =  '<ul><li class = "ext-came">' + jQuery.substitute(this.label.fieldEmpty,this.label.Email) + '</li></ul>';
              document.getElementById('shareNotEmail').className = 'msg warning';
              $(".msk").hide();
          }
       },
         cancelEmailShare: function() {
            console.log('cancelEmailShare');
            $('#SharingPopup').css('display', 'none');
            jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
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
               
               document.getElementById('localBoardingWarnMsg').innerHTML =  '<ul><li class = "ext-came">' + this.label.tx_ssci_email_error + '</li></ul>';
               document.getElementById('localBoardingWarnMsg').className = 'msg warning';

               $('#SharingPopup').css('display', 'none');
             
             //For TDD
             this.KarmaSendEmailCallBack["message"] = "Error recieved in pageID from backend";

             } else {

               jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone"); //Removing Background Plain Ovelay


               jQuery('body').scrollTop("0");

               document.getElementById('localBoardingWarnMsg').innerHTML =  '<ul><li class = "ext-came">' + this.label.emailValid + '</li></ul>';
               document.getElementById('localBoardingWarnMsg').className = 'msg info';

               $('#SharingPopup').css('display', 'none');


           //For TDD
            this.KarmaSendEmailCallBack["message"] = "No error recieved in pageID from backend";

               $(".msk").hide();

             }
          }
       },
        cancelSMSShare: function() {
           console.log('cancelSMSShare');
           $('#SharingPopup').css('display', 'none');

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
	           if (this.validatePhoneNumber(phoneNum) && travellerAreaCode.length == 4 && phoneNum.length > 4 && smsta != null && smsta !=undefined) {
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

                document.getElementById('shareNotSMS').innerHTML =  '<ul><li class = "ext-came">' + this.label.smsNotValid + '</li></ul>';
                document.getElementById('shareNotSMS').className = 'msg warning';
               jQuery('body').scrollTop("0");
                
               //For TDD
               this.KarmaSendSMSShare["message"] = "Invalid area code or phoneno";
	           }
           }else{
              document.getElementById('shareNotSMS').innerHTML =  '<ul><li class = "ext-came">' + jQuery.substitute(this.label.fieldEmpty,this.label.Sms) + '</li></ul>';
              document.getElementById('shareNotSMS').className = 'msg warning';
              jQuery('body').scrollTop("0");
              //For TDD
               this.KarmaSendSMSShare["message"] = "Invalid area code or phoneno";
           }
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
         openSSCIDialog: function(which) {
             this.$logInfo('AcceptanceConfirmationScript::Entering openSSCIDialog function');
             try {
                jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock"); /*Will Be Shown When Code Integrated in Int of this CR */
                which.css('display', 'block');
             } catch (exception) {
                this.$logError('AcceptanceConfirmationScript::An error occured in openSSCIDialog function', exception);
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
                  for (var i in this.label.countryList) {
                    if (this.label.countryList[i].code == number.substring(0, 4)) {
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
            onBackClick: function() {
                this.$logInfo('ModuleCtrl::Entering onBackClick function');
                try {
                  window.history.back();
                } catch (exception) {
                  this.$logError('ModuleCtrl::An error occured in onBackClick function', exception);
                }

            },
            addToPass : function(event,args){
            	this.$logInfo('ModuleCtrl::Entering addToPass function');
                try {
                  var productId = args.productID;
                  var adultProdId = args.adultProdId;

                  var productList =[];
                  var selectedMBPs =[]

                  if(adultProdId.trim() == ""){
                	  productList.push(productId);
                  }else{
                	  productList.push(adultProdId);
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
                  this.$logError('ModuleCtrl::An error occured in addToPass function', exception);
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
                  jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
                } catch (exception) {
                  this.$logError('ModuleCtrl::An error occured in deliverDocument function', exception);
                }

              },

              __deliverDocument: function(res, input) {
                  this.$logInfo('ModuleCtrl::Entering __deliverDocument function')
                  try {
                	  var dataId = "MSSCIAcceptanceConfirmation_A";
                  if (res.responseJSON.data.checkIn[dataId] != null && res.responseJSON.data.checkIn[dataId].requestParam != null && res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails != null && input.bpType == "passbook") {
                      modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
                      window.location = 'data:application/vnd.apple.pkpass;base64,' + res.responseJSON.data.checkIn[dataId].requestParam.BPResponseDetails;
                      return null;
            }
              } catch (exception) {
                  this.$logError('ModuleCtrl::An error occured in __deliverDocument function', exception);
                }
              },

              submitJsonRequest: function(actionName, actionInput, callback) {
                  this.$logInfo('ModuleCtrl::Entering submitJsonRequest function');
                  try {

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

   }
})