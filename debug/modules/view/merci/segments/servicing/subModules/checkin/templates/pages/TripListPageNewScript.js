Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.TripListPageNewScript',

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
      this.$logInfo('Tripoverviewpage::Entering Viewready function');
      this.requestParam = this.moduleCtrl.getModuleData().checkIn.MTripList_A.requestParam;
      this.label = this.moduleCtrl.getModuleData().checkIn.MTripList_A.labels;
      this.siteParams = this.moduleCtrl.getModuleData().checkIn.MTripList_A.siteParam;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.requestParam.bannerHtml, this.siteParams.homeURL, true);
      this.data.bannerInfo=this.requestParam.ProfileBean;

      this.moduleCtrl.setGADetails(this.moduleCtrl.getModuleData().checkIn.MTripList_A.parameters);

    },

    $viewReady: function() {

      this.$logInfo('Triplistpage::Entering Viewready function');

      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Trip list");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=TripList";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
        
        
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
          page: 'Trip list',
          GTMPage: 'Trip list'
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



    },

    $displayReady: function() {

      this.$logInfo('Triplistpage::Entering displayready function');

      itemCounter = 0;
      is_clickedOn_list = -1;
      itemWidth = undefined;
      this.data.passengerDetails=null;

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
            }, 75);
            carrouselToMove.animate({
              left: '+=15px'
            }, 75);
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
            }, 75);
            carrouselToMove.animate({
              left: '-=15px'
            }, 75);

          }


        }
      });


    },

    setselectedPnrDetails: function(event, args) {


      try {
        /** FOR TOUCH to know target -- event.touches[0].target
         * pageX
         **/
        this.$logInfo('Triplistpage::Entering setselectedPnrDetails function');

        //this.moduleCtrl.setSelectedPNR(args.PNR);
        var _this = this;
        /*
         * For Removing PNR which is not selected
         **/
        // We prevent default behaviour
        event.preventDefault();

        //_this.showOverlay(true);
        modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

        //_this.moduleCtrl.reSetCPR();



        jQuery.each(args.custLevel, function(i, item) {
          //alert("1");
          if (item.recordLocatorBean.controlNumber == args.PNR) {
            _this.moduleCtrl.setCPR(item);
          }

        });
        var cprInput = {
          "lastName": args.lastName,
          "IdentificationType": "bookingNumber",
          "recLoc": args.PNR
        };
        _this.moduleCtrl.cprRetreive(cprInput);
        /*if(args.header){
    var cprInput = {"lastName":args.lastName,"IdentificationType":"bookingNumber","recLoc":args.PNR,"screen":args.header};
    _this.moduleCtrl.tripOverView(cprInput);
  }
  else {
    var cprInput = {"lastName":args.lastName,"IdentificationType":"bookingNumber","recLoc":args.PNR};
    _this.moduleCtrl.cprRetreive(cprInput);
  }*/


        //this.$logInfo(JSON.stringify(this.moduleCtrl.getCPR()));

        //this.$load("checkin/CPRRetreive");

      } catch (exception) {
        this.$logError(
          'AcceptanceOverViewScript::An error occured in onContinue function',
          exception);
      }


    },
    gotoCheckinHomePage: function(event, args) {
      this.$logInfo('Triplistpage::Entering gotoCheckinHomePage function');
      var flow = args.flow;
      this.moduleCtrl.setFlowType(flow);
      this.moduleCtrl.loadHomeForTripList();

    },
    getUTCdateFindDiff: function(item) {
      this.$logInfo('Triplistpage::Entering getUTCdateFindDiff function');
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


    },
    __getPage: function() {
      try {
        this.$logInfo('Triplistpage::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
        this.$logError(
          'Triplistpage::An error occured in __getPage function',
          exception);
      }
    }
  }

});