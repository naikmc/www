Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.TripListPageNewScript',

  $dependencies: [

   'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.KarmaSetselectedPnrDetails = {};
  },

  $prototype: {

    $dataReady: function() {
      this.$logInfo('TripListPageNewScript::Entering dataReady function');
      try {

        this.requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.requestParam;
        this.label = this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.labels;
        this.parameters = this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.parameters;
        this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.siteParam;
        this.moduleCtrl.setFrequentFlyerList(this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.freqFlyerRestList);
        this.moduleCtrl.setOperatingAirline(this.parameters.SITE_SSCI_OP_AIR_LINE);

        this.moduleCtrl.setHeaderInfo({
          title: this.label.Title,
          bannerHtmlL: this.requestParam.bannerHtml,
          homePageURL: this.siteParams.homeURL,
          showButton: true
        });

        this.moduleCtrl.setCPR(this.requestParam.CPRIdentification);
        this.moduleCtrl.setGADetails(this.moduleCtrl.getModuleData().checkIn.MSSCITripList_A.parameters);
        this.sortedJourney = [];

        /**
         * BEGIN : Code For Sorting Journey On the basis of the Departure Time of the first flight of the journey
         *
         * distinctFactor is used to differentiate two journey having Same First Flight Departure Time
         * */
        var cpr = this.moduleCtrl.getCPR();
        var depDateAndJourney = {};
        var depDateTime = [];

        var distinctFactor = 0;
        for (var journeyNo in cpr) {
          var d1 = new Date(cpr[journeyNo][cpr[journeyNo].firstflightid].timings.SDT.time);
          depDateAndJourney[d1.getTime() + distinctFactor] = journeyNo;
          depDateTime.push(d1.getTime() + distinctFactor);
          distinctFactor++;
        }
        depDateTime.sort(function(a, b) {
          return a - b;
        });
        for (var index in depDateTime) {
          this.sortedJourney.push(depDateAndJourney[depDateTime[index]]);
        }
        /**
         * END : Code For Sorting Journey On the basis of the Departure Time of the first flight of the journey
         * */
    	if(this.data.directCalling){
    		this.data.directCalling = false;
    		this.moduleCtrl.storeTripForDirectCall(this.requestParam.CPRInput);
    	}
      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in dataReady function', exception);
      }
    },

    $viewReady: function() {

      this.$logInfo('TripListPageNewScript::Entering viewReady function');
      try {

        jQuery("#listboxa:first-child").addClass("is-selected");
        var len = document.getElementById("listboxa").getElementsByTagName("li").length;
        var width = len % 2 == 0 ? len * 196 : (len * 196) + 196;

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
              return;
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
              return;
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


        if (this.moduleCtrl.getEmbeded()) {
          jQuery("[name='ga_track_pageview']").val("Journey Selection");
          window.location = "sqmobile" + "://?flow=MCI/pageloaded=TripList";
        } else {
        	var GADetails = this.moduleCtrl.getGADetails();
            this.__ga.trackPage({
              domain: GADetails.siteGADomain,
              account: GADetails.siteGAAccount,
              gaEnabled: GADetails.siteGAEnable,
              page: 'Journey Selection',
              GTMPage: 'Journey Selection'
            });
        }

        /*GOOGLE ANALYTICS
         * */

        //FOR PAGE
        /*  if(JSONData.parameters.SITE_MCI_GA_ENABLE)
       {
        ga('send', 'pageview', {'page': 'Trip list','title': 'Your Trip list'});
    }
*/


        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
			genericScript({
				tpl:"TripListPageNew",
				data:this.data
			});
        }
        /*END : JavaScript Injection(CR08063892)*/
      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in viewReady function', exception);
      }
    },

    $displayReady: function() {

      this.$logInfo('TripListPageNewScript::Entering displayReady function');
      try {

        /*To Display Warning Messages*/
        this.moduleCtrl.getWarningsForThePage("JSEL", this);

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
        hideBoardinglistheaderRtarro = false;

      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in displayReady function', exception);
      }
    },

    setselectedPnrDetails: function(event, args) {
      this.$logInfo('TripListPageNewScript::Entering setselectedPnrDetails function');
      try {
        this.KarmaSetselectedPnrDetails = "Not eligible to got to next page"; //For TDD
        if (jQuery(jQuery("#" + args.id).children()[0]).attr("class").search(/eligibleToGoNextPage/ig) == -1) {
          return false;
        }
        this.KarmaSetselectedPnrDetails = "Eligible to got to next page"; //For TDD
        this.moduleCtrl.updateJourneySelectedCPR(args.trip);
        var selJrny = {};
        selJrny.SELECTED_JRNY = args.trip;
        selJrny.LAST_NAME = localStorage.lstName;
        this.moduleCtrl.journeySelection(selJrny);
        //this.moduleCtrl.navigate(null, "merci-checkin-MSSCICPRRetrieveMultiPax_A");

      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in setselectedPnrDetails function', exception);
      }

    },

    gotoCheckinHomePage: function(event, args) {
      this.$logInfo('TripListPageNewScript::Entering gotoCheckinHomePage function');
      try {
        this.moduleCtrl.loadHomeForTripList();
      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in gotoCheckinHomePage function', exception);
      }
    },

    getUTCdateFindDiff: function(item) {
      this.$logInfo('TripListPageNewScript::Entering getUTCdateFindDiff function');
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
        var result = "";
        var svtime = this.moduleCtrl.getsvTime();
        if (svtime == null) {
          svtime = JSONData.svTime;
        }
        if (svtime != null && svtime != '') {
          var svtm = svtime.split(' ');
          var mnt = 0;
          var timestamp = svtm[4].split(':')
          for (var i = 0; i < month.length; i++) {
            if (month[i] == svtm[2]) {
              mnt = i;
            }
          }
          var dCurr = Date.UTC(svtm[3], mnt, svtm[1], timestamp[0], timestamp[1]);
          var minutes = parseInt(item.month) - 1;

          var DeparDate = Date.UTC(item.year, parseInt(item.month) - 1, item.day, item.hour, item.minutes);
          var difference = DeparDate - dCurr;
          var hoursDifference = Math.floor(difference / 1000 / 60 / 60);

          var timeLimit = JSONData.parameters.SITE_MCI_ACPTNC_TIME.split("-");

          /*
           * timeLimit[0]  -- MIN HOURS FOR CHECKIN
           *
           * timeLimit[1]  -- MAX HOURS FOR CHECKIN
           * */
          //return hoursDifference;


          if (timeLimit.length == 2) {
            if (hoursDifference < timeLimit[0]) {
              result = "flown";
            } else if (hoursDifference > timeLimit[1]) {
              hoursDifference = hoursDifference.round() - timeLimit[1];
              if (hoursDifference <= 1)
                result = hoursDifference + " HOUR";
              else if (hoursDifference <= 24)
                result = hoursDifference + " HOURS";
              else {
                if ((hoursDifference / 24).round() == 1) {
                  result = (hoursDifference / 24).round() + " DAY";
                } else
                  result = (hoursDifference / 24).round() + " DAYS";
              }

            }
          } else {
            result = true;
          }
        }


        return result;
        /*if(timeLimit.length == 2 && timeLimit[0] <= hoursDifference && timeLimit[1] >= hoursDifference)
        {
          return true;
        }else if(timeLimit.length != 2)
        {
          return true;
        }else
        {
          return false;
        }*/
      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in getUTCdateFindDiff function', exception);
      }

    },
    __getPage: function() {
      this.$logInfo('TripListPageNewScript::Entering __getPage function');
      try {
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError('TripListPageNewScript::An error occured in __getPage function', exception);
      }
    }
  }

});