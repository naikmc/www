Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.BoardingPassScript',

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
        this.$logInfo('BoardingPassScript: Entering dataReady function ');
        var pageData = this.moduleCtrl.getModuleData().checkIn;

        if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
          pageData = jsonResponse.data.checkIn;
        }

        this.label = pageData.MBoardingPass_A.labels;
        this.parameters = pageData.MBoardingPass_A.parameters;
        this.siteParams = pageData.MBoardingPass_A.siteParam;
        this.rqstParams = pageData.MBoardingPass_A.requestParam;
        this.errorStrings = pageData.MBoardingPass_A.errorStrings;
        this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, true);
      } catch (_ex) {
        this.$logError('BoardingPassScript: an error has occured in dataReady function');
      }
    },


    $displayReady: function() {
      try {
        /*Script for swipe*/
        itemCounter = 0;
        is_clickedOn_list = -1;
        itemWidth = undefined;

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

        /*Script for swipe*/
        var boardingPassInput = this.moduleCtrl.getBoardingInput();
        var boardingPassResponse = this.moduleCtrl.getBoardingPassRespDtls();
        var boardingPassHTMLResponse = boardingPassResponse.formattedDocumentList[0].encodedHTMLData;
        var htmlArray = $(boardingPassHTMLResponse).filter(".panel.boardpass");
        var cpr = this.moduleCtrl.getCPR();
        var productLevel = cpr.customerLevel[0].productLevelBean;
        var dataToAppend = "";
        for (var u = 0; u < boardingPassInput.selectedCPR.length; u++) {
          var product = productLevel[boardingPassInput.selectedCPR[u].product];

          var dateTime = "";
          if (product.legLevelBean[0].legTimeBean != null && product.legLevelBean[0].legTimeBean.length > 0) {
            for (var td_inx in product.legLevelBean[0].legTimeBean) {
              if (product.legLevelBean[0].legTimeBean[td_inx].businessSemantic == "STD") {
                var temp_date = product.legLevelBean[0].legTimeBean[td_inx];
                var temp_hour = temp_date.hour < 10 ? "0" + temp_date.hour : temp_date.hour;
                var tep_min = temp_date.minutes < 10 ? "0" + temp_date.minutes : temp_date.minutes;
                dateTime = product.arrDateInGMTDate.split(" ")[2] + product.arrDateInGMTDate.split(" ")[1] + product.arrDateInGMTDate.split(" ")[5].substring(2) + temp_hour + tep_min;
                break;
              }
            }

          }

          var id = cpr.customerLevel[0].recordLocatorBean.controlNumber + product.operatingFlightDetailsBoardPoint + product.operatingFlightDetailsOffPoint + dateTime + product.operatingFlightDetailsMarketingCarrier + product.operatingFlightDetailsFlightNumber;
          id = id.toUpperCase();
          dataToAppend = dataToAppend + id + "^<article class=\"panel boardpass\">";
          /*boardingPassInput.selectedCPR[u].product replaced with u below in order to avoid index issue when select only second segment*/
          dataToAppend = dataToAppend + $(htmlArray[u]).html();
          dataToAppend = dataToAppend + "</article>";
          if (u != (boardingPassInput.selectedCPR.length - 1)) {
            dataToAppend = dataToAppend + "|";
          }
        }
        dataToAppend = dataToAppend.replace(/\n/g, " ");
        dataToAppend = dataToAppend.replace(/"/gm, '/"');
        $("#bpResponseInHTML").val(dataToAppend);
        this.$logInfo('BoardingPassScript::Entering displayReady function');
        // We initialize UI elements
        var boardingPassForm = jQuery(this.__getPage());
        // Retrieving the stored boarding pass from local storage
        var storageKey = $("div[data-offlinestore]").map(function() {
          return $(this).attr("data-offlinestore");
        });

        // Storing the boarding pass offline in local storage
        for (var i = 0; i < storageKey.length; i++) {
          var selector = "div[data-offlinestore = \"" + storageKey[i] + "\"]";
          var offlineData = $(selector).html();
          localStorage.setItem(storageKey[i], offlineData);
        }
        var _this = this;
        var boardingPassRespDtls = _this.moduleCtrl.getBoardingPassRespDtls();
        var encodedData = boardingPassRespDtls.formattedDocumentList[0].encodedData;
        var boardingPassDet = _this.moduleCtrl.getBoardingPassResp();
        var bpGeneratedResp = boardingPassDet.bpGeneratedList;

        var articlesList = jQuery(encodedData).filter('article.panel.boardpass');
        for (var i = 0; i < bpGeneratedResp.length; i++) {
          var id = bpGeneratedResp[i] + "-large";
          var article = articlesList[i];
          var $newDiv1 = document.createElement('div');
          jQuery($newDiv1).css("display", "none");
          jQuery($newDiv1).attr("id", id);
          jQuery($newDiv1).html(article);
          jQuery('.sectionDefaultstyle').append($newDiv1);
          _this.storeBoardingPass(bpGeneratedResp[i]);
        }
      } catch (exception) {
        this.$logError(
          'BoardingPassScript::An error occured in displayReady function',
          exception);
      }
    },
    $viewReady: function() {

      this.$logInfo('BoardingPassScript::Entering Viewready function');

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

      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(this.parameters.SITE_MCI_GA_ENABLE)
     {
      //ga('send', 'pageview', {'page': 'Boarding Pass','title': 'Your Boarding Pass'});
    }*/



    },

    // Function called when boarding pass icon is clicked
    onBoardingPassClick: function(evt, args) {
      try {
        this.$logInfo('BoardingPassScript::Entering onBoardingPassClick function');
        jQuery(document).scrollTop("0");
        //this.showOverlay(false);
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        var boardingPassForm = jQuery(this.__getPage());
        var selectedPax = this.moduleCtrl.getSelectedPax();
        // Creating a div for showing the offline boarding pass related to the checkedin passenger.
        var tempHTML = "<div class=\"panelWrapperInner\"><div class=\"panelContent\"><h1 class=\"posR\"><span id=\"calendarClose\" class=\"cross\">&nbsp;</span></h1>";
        var count = 0;
        // Loop to collect all the segments information and display boarding pass
        for (var i = 0; i < selectedPax.length; i++) {
          var offlinekey = '';
          var key = jQuery('div#' + args.customer + "_" + selectedPax[i].product + ' div').attr("data-offlinestore");
          if (key != undefined) {
            var selector = "div[data-offlinestore = \"" + key + "\"]";
            offlinekey = key.split("_");

            var boardingTime = "";
            var Boardingtimecheck = offlinekey[11].split("~");

            if (Boardingtimecheck[0] == "0") {
              /*Taking departure time*/
              /* var temp1="new Date("+Boardingtimecheck[1].split(" ")[0].replace(/\./g,",")+","+Boardingtimecheck[1].split(" ")[3].replace(/:/g,",")+")";
                       //Creating date object
                       boardingTime=eval(temp1);
                       //Redusing one month i.e in json cominh it as 1-12 but in date it takes like 0-11
                       boardingTime.setMonth(boardingTime.getMonth()-1);*/
              /*redusing by one hour*/
              boardingTime = eval(Boardingtimecheck[1]);
              boardingTime.setHours(boardingTime.getHours() - 1);
              /*Taking  hours and minutes*/
              boardingTime = boardingTime.getHours() + ":" + (boardingTime.getMinutes() < 10 ? '0' : '') + boardingTime.getMinutes();
            } else {
              boardingTime = eval(Boardingtimecheck[0]);
              boardingTime = boardingTime.getHours() + ":" + (boardingTime.getMinutes() < 10 ? '0' : '') + boardingTime.getMinutes();
            }

            if (count == 0) {
              tempHTML = tempHTML + jQuery(selector).html();
              tempHTML = tempHTML + "<div class=\"slide\"><ul class=\"padall posR \"><li>" + this.moduleRes.res.BoardingPass.label.BoardingPassFor + "&nbsp;";
              count++;
            }
            tempHTML = tempHTML + offlinekey[4] + "</li><li class=\"textextraBig1\">" + offlinekey[5] + "-" + offlinekey[6] + "</li><li class=\"textBig\">" + offlinekey[7] + "</li><li>" + this.moduleRes.res.BoardingPass.label.Gatenumber + "&nbsp;" + offlinekey[12] + "</li><li>" + this.moduleRes.res.BoardingPass.label.Boardingtime + "&nbsp;" + boardingTime + "</li>";
            if (i == selectedPax.length - 1) {
              tempHTML = tempHTML + "<li class=\"textBig\">" + offlinekey[8] + "</li>";
            }
          }
        }
        tempHTML = tempHTML + "</ul></div></div></div>";
        jQuery("#bpPH", boardingPassForm).html(tempHTML);
        jQuery('#bpPH', boardingPassForm).show();

        // On div close click, hide the boarding pass div
        jQuery("#bpPH span").click(function() {
          modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
          jQuery('#overlayCKIN').hide();
          jQuery('#bpPH', boardingPassForm).hide();
          jQuery('#bpPH', boardingPassForm).html("");
        });
      } catch (exception) {
        this.$logError(
          'BoardingPassScript::An error occured in onBoardingPassClick function',
          exception);
      }
    },

    // Function called when home button is clicked
    onChknHome: function(evt) {
      try {
        this.$logInfo('BoardingPassScript::Entering onChknHome function');
        var _this = this;
        jQuery(document).scrollTop("0");
        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
        var fn = function() {
          //we call the controller to land on sendsms page
          _this.moduleCtrl.loadHome();
        }
        jQuery(jQuery.currentTarget(evt)).tap(fn);
      } catch (exception) {
        this.$logError(
          'BoardingPassScript::An error occured in onChknHome function',
          exception);
      }
    },

    __getPage: function() {
      try {
        this.$logInfo('BoardingPassScript::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
          'BoardingPassScript::An error occured in __getPage function',
          exception);
      }
    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('BoardingPassScript::Entering onModuleEvent function');
        switch (evt.name) {
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": this.errorStrings[21400069].localizedMessage,
              "code": this.errorStrings[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "boardingPassErrors", "error");
            break;
        }
      } catch (exception) {
        this.$logError(
          'BoardingPassScript::An error occured in onModuleEvent function',
          exception);
      }
    },


    storeBoardingPass: function(id) {
      this.$logInfo('BoardingPassScript::Entering storeBoardingPass function');
      var largeId = '#' + id + '-large';
      var largeDiv = $("[id='" + largeId.substring(1) + "']").html();
      var smallId = '#' + id + '-small';
      var smallDiv = $("[id='" + smallId.substring(1) + "']").html();
      var homeId = '#' + id + '-home';
      var homeDiv = $("[id='" + homeId.substring(1) + "']").html();

      if (this.supportsLocalStorage()) {
        localStorage.setItem(largeId, largeDiv);
        localStorage.setItem(smallId, smallDiv);
        localStorage.setItem(homeId, homeDiv);
        var storedBoardingPasses = localStorage.getItem('storedBoardingPasses');
        if (storedBoardingPasses != null) {
          if (this.checkIfBPAlreadyExists(id)) {
            var BPArray = new Array();
            BPArray = storedBoardingPasses.split('|||BP|||');
            BPArray.push(id);
            var storeString = BPArray.join('|||BP|||');
            localStorage.setItem('storedBoardingPasses', storeString);
          } else {}
        } else {
          var BPArray = new Array();
          BPArray[0] = id;
          var storeString = BPArray.join('|||BP|||');
          localStorage.setItem('storedBoardingPasses', storeString);
        }
        this.storeDate(id);
      }
    },

    checkIfBPAlreadyExists: function(id) {
      this.$logInfo('BoardingPassScript::Entering checkIfBPAlreadyExists function');
      var storedBoardingPasses = localStorage.getItem('storedBoardingPasses');
      var BPArray = new Array();
      BPArray = storedBoardingPasses.split('|||BP|||');
      if (BPArray.indexOf(id) == -1) {
        return true;
      } else {
        return false;
      }
    },

    storeDate: function(id) {
      this.$logInfo('BoardingPassScript::Entering storeDate function');
      var dateStr = $("#departureDate").text();
      localStorage.setItem(id + '_date', dateStr);
    },

    supportsLocalStorage: function() {
      this.$logInfo('BoardingPassScript::Entering supportsLocalStorage function');
      var a = false;
      if ("localStorage" in window) {
        try {
          window.localStorage.setItem("_tmptest", "tmpval");
          a = true;
          window.localStorage.removeItem("_tmptest")
        } catch (b) {}
      }
      if (a) {
        try {
          if (window.localStorage) {
            _storage_service = window.localStorage;
            _backend = "localStorage"
          }
        } catch (d) {}
      } else {
        if ("globalStorage" in window) {
          try {
            if (window.globalStorage) {
              _storage_service = window.globalStorage[window.location.hostname];
              _backend = "globalStorage"
            }
          } catch (c) {}
        }
      }
      return a;
    }

  }
})