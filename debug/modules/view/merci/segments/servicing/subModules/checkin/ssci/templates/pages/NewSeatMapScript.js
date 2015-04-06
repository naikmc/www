Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.NewSeatMapScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.custAssociateInfant = {};
    this.originalSeatMock = [];
    this.currentSel = -1;
    this.seatCharDetails={};
    this.legendDetails={};
    this.headerHeight={};
    this.filterCloseClick=0;
    
    this.KarmaDisplayReady={};
    this.KarmaShowBasinetSeatOnTopBassinetSeat={};
    this.KarmaIsExitSeat={};
    this.KarmaIsChargebleSeat={};
    this.KarmaIsBasinetSeat={};
    this.KarmaOccupySeatInOtherPax={};
    this.KarmaSelectseat={};
    this.KarmaForSeatCharectersticsshow={};
    this.KarmaOnSaveSeat={};
    this.KarmaForSegregateSeatCharectersticsforFilter={};
    this.KarmaForSegregateSeatCharectersticsforLegend={};
  },
  $destructor:function(){
	  //jQuery("body").css("overflow","auto");
	  jQuery("#sb-site").css("min-height",jQuery("#sb-site").attr("data-removedMinHight"));
	  jQuery("#sb-site").css("height","100%");

	  jQuery("#filters [data-control='reset']").unbind("click");
      jQuery("#filters #seatOptions>li").unbind("click");

	  this.myscroll.destroy();
	  this.seatmapScroller.destroy();
  },
  $prototype: {
    $dataReady: function() {
      this.$logInfo('NewSeatMapScript::Entering dataReady function');
      try {
        this.pageData = this.moduleCtrl.getModuleData();
        this.requestParam = this.pageData.checkIn.MSSCISeatMap_A.requestParam;
        this.label = this.pageData.checkIn.MSSCISeatMap_A.labels;
        this.siteParams = this.pageData.checkIn.MSSCISeatMap_A.siteParam;
        this.parameters = this.pageData.checkIn.MSSCISeatMap_A.parameters;

        this.moduleCtrl.setHeaderInfo({
          title: this.label.Title,
          bannerHtmlL: this.requestParam.bannerHtml,
          homePageURL: this.siteParams.homeURL,
          showButton: true
        });

        this.errorStrings = this.pageData.checkIn.MSSCISeatMap_A.errorStrings;
        this.uiErrors = this.errorStrings;
        this.data.uiErrors = this.errorStrings;

        /*
         * decide to consider parameter if any based on page
         * */

        this.decideShowSeatToPax = true;
        if (this.data.seatMapLoadingFrom == "ac") {
          this.decideShowSeatToPax = false;
          if (this.data.siteParameters.SITE_SSCI_DSBL_CST_BP_GEN && (this.data.siteParameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/false/i) != -1)) {

            this.decideShowSeatToPax = true;

          }
        }

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in dataReady function', exception);
      }

    },
    previousPax: function(evt) {
    	this.$logInfo('NewSeatMapScript::Entering previousPax function');
        try {
	    	if(jQuery("#leftArrow").text() != "0")
			{
				this.myscroll.scrollToPage('prev', 0);
			}
        } catch (exception) {
            this.$logError('NewSeatMapScript::An error occured in previousPax function', exception);
        }
	},

	nextPax: function(evt) {
		this.$logInfo('NewSeatMapScript::Entering nextPax function');
        try {
			if(jQuery("#rightArrow").text() != "0")
			{
				this.myscroll.scrollToPage('next', 0);

			}
        } catch (exception) {
            this.$logError('NewSeatMapScript::An error occured in nextPax function', exception);
        }
	},
    $viewReady: function() {
      this.$logInfo('NewSeatMapScript::Entering viewReady function');
      try {
        this.moduleCtrl.setWarnings("");
        this.moduleCtrl.setSuccess("");

        /*GOOGLE ANALYTICS*/
        var customData = {};
//        if(false){
//          var selectedcpr = this.moduleCtrl.getSelectedCPR();
//          var journey = this.moduleCtrl.getCPR()[selectedcpr.journey];
//          var selectedProdForSeatMap = this.data.seatMapProdIndex;
//          var flightInfo =selectedcpr.flighttocust[selectedProdForSeatMap];
//          var flightID = flightInfo.product;
//
//          for(var customerIndex in flightInfo.customer){
//            var custID = flightInfo.customer[customerIndex];
//            var cust = journey[custID];
//            if(cust.passengerTypeCode != "INF"){
//            var passengerLegCodeSeat = custID + journey[flightID].leg[0].ID + "SST";
//            var seat = journey.seat[passengerLegCodeSeat].row + journey.seat[passengerLegCodeSeat].column;
//            customData['seatNumber'] = (customData['seatNumber'] == undefined) ? (seat) : (customData['seatNumber'] + "," + seat);
//            }
//          }
//
//          customData['flightNumber'] = journey[flightID].operatingAirline.companyName.companyIDAttributes.code + journey[flightID].operatingAirline.flightNumber;
//
//          customData['pageTitle'] = "Check-In Select Seat";
//
//        }

        /*New seatmap header hgroup height*/
        jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup").css("height",parseInt(jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h1").outerHeight(true)+jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h2").outerHeight(true)+jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h3").outerHeight(true)-12)+"px");
        jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup").css("height",parseInt(jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h1").outerHeight(true)+jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h2").outerHeight(true)+jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup>h3").outerHeight(true)-12)+"px");

        if (this.moduleCtrl.getEmbeded()) {
			  jQuery("[name='ga_track_pageview']").val("Select seat");
	      window.location = "sqmobile" + "://?flow=MCI/pageloaded=SeatMap";

	    } else {
	      var GADetails = this.moduleCtrl.getGADetails();


	      this.__ga.trackPage({
	        domain: GADetails.siteGADomain,
	        account: GADetails.siteGAAccount,
	        gaEnabled: GADetails.siteGAEnable,
	        page: 'Select seat',
            GTMPage: 'Select seat',
            data: customData
	        });

		}
        /*GOOGLE ANALYTICS*/

        /*Legend display*/
        jQuery("#seat-legend>ul").html("");
        for(var legendDetails in this.legendDetails)
        {
        	jQuery("#seat-legend>ul").append("<li class='"+this.legendDetails[legendDetails].className+"'>"+this.legendDetails[legendDetails].text+"</li>");
        }

        /*For set legend , filter bottom padding in case for smaller device, ex: iphone 4*/
        if(window.screen != undefined && window.screen.height < 500)
        {
        	jQuery(".sectionDefaultstyleSsci aside.seatFilter#filters").css("padding-bottom","9rem");
        	jQuery(".sectionDefaultstyleSsci aside.seatLegend#help").css("padding-bottom","9rem");
        }

        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
			genericScript({
				tpl:"NewSeatMap",
				data:this.data
			});
        }
        /*END : JavaScript Injection(CR08063892)*/

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in viewReady function', exception);
      }

    },

    $displayReady: function() {

      this.$logInfo('NewSeatMapScript::Entering displayReady function');
      try {
    	  var __this=this;
    	  /*window.onscroll = function (event) {

    		  if(window.pageYOffset > 0)
    		  {
    			  jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").addClass("animate");
		    		jQuery("aside.seatFilter#filters").removeClass("animate");
		    		jQuery("aside.seatLegend#help").removeClass("animate");
    		  }else
    		  {
    			  jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").removeClass("animate");
    		  }
    		  jQuery("#stmpFooterId.stmpFooter").removeClass("animate");
    	  }*/

    	  $(window).scroll(function() {

    		  jQuery("#stmpFooterId.stmpFooter").addClass("animate");

    		  if(window.pageYOffset > 0)
    		  {
    			  /*For fixing seatmap header if there is no page header ex: TX*/
    			  var headerBannerHight="50";
    			  if(jQuery("#top .banner").css("display") == "none")
    			  {
    				  headerBannerHight="0";
    			  }

    			  jQuery(".sectionDefaultstyleSsci .stmpHeader").css({"position":"fixed","top":""+headerBannerHight+"px","left":"5px"});
    			  jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").addClass("animate");
    			  //jQuery("aside.seatFilter#filters").removeClass("animate");
		    	  //jQuery("aside.seatLegend#help").removeClass("animate");
		    	  //jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").html("");

    			  jQuery("aside.seatLegend#help").css("top",__this.headerHeight.stmpHeaderAside+"px");
    			  jQuery("aside.seatFilter#filters").css("top",__this.headerHeight.stmpHeaderAside+"px");

    		  }else if(window.pageYOffset == 0)
    		  {
    			  jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").removeClass("animate");
    			  jQuery(".sectionDefaultstyleSsci .stmpHeader").css({"position":"relative","top":"0px","left":"0px"});

				  //jQuery(".sectionDefaultstyleSsci .stmpHeader hgroup").html(__this.headerHeight.stmpAsideHtml);

    			  jQuery("aside.seatLegend#help").css("top",__this.headerHeight.stmpHeader+"px");
    			  jQuery("aside.seatFilter#filters").css("top",__this.headerHeight.stmpHeader+"px");
    		  }

    		  clearTimeout($.data(this, 'scrollTimer'));
    		  $.data(this, 'scrollTimer', setTimeout(function() {

    		    	jQuery("#stmpFooterId.stmpFooter").removeClass("animate");
    		  }, 250));
    	  });

    	  //jQuery("body").css("overflow","hidden");
    	  jQuery("#sb-site").attr("data-removedMinHight",jQuery("#sb-site").css("min-height"));
    	  jQuery("#sb-site").css("min-height","initial");
    	  jQuery("#sb-site").css("height","auto");

    	  /*
         * For showing bassinet seat according to PTR 08303390
         * */
    	  this.showBasinetSeatOnTopBassinetSeat();


    	  /*for calculating wrapper height*/
    	  if(typeof window.orientation === 'undefined') {
    		  var test = window.matchMedia("(orientation: portrait)");
    		  test.addListener(function(m) {
    		    /*if(m.matches) {
    		      // Changed to portrait
    		      alert('portrait');
    		    }else {
    		      // Changed to landscape
    		      alert('landscape');
    		    }*/

    			// Announce the new orientation number
	    		  /*console.log(window.orientation);
	    		  console.log(window.screen.availWidth);
	    		  console.log(window.screen.availHeight);
	    		   */

	    		  /*For footer width*/
	    		  setTimeout(function(){
	    			  __this.myscroll.scrollToPage(__this.currentSel, 0);
	    			  __this.myscroll.refresh();
	    		  },700);
	    		  setTimeout(function(){
	    			  jQuery("#stmpFooterId").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>#mcistmp_wrapper").width()+"px");
		    		  jQuery(".stmpHeader").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>#mcistmp_wrapper").width()+"px");
	    		  },800);

	    		  /*For wrapper height*/
	    		  //jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)-100)+"px");
	    		  //jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)+30)+"px");


    		  });
    		} else {
    			window.addEventListener("orientationchange", function() {
    	    		  // Announce the new orientation number
    	    		  /*console.log(window.orientation);
    	    		  console.log(window.screen.availWidth);
    	    		  console.log(window.screen.availHeight);
    	    		   */

    	    		  /*For footer width*/
    	    		  setTimeout(function(){
    	    			  __this.myscroll.scrollToPage(__this.currentSel, 0);
    	    			  __this.myscroll.refresh();
    	    		  },700);
    	    		  setTimeout(function(){
    	    			  jQuery("#stmpFooterId").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>#mcistmp_wrapper").width()+"px");
        	    		  jQuery(".stmpHeader").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>#mcistmp_wrapper").width()+"px");
    	    		  },800);

    	    		  /*For wrapper height*/
    	    		  //jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)-100)+"px");
    	    		  //jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)+30)+"px");


    	    		}, false);
    		}

        /*
         * Creating global variable for live function as once bind event there is clouser issues in change seat
         * */
        forOverrideLocal = this;

        var sizeOfPax = jQuery('#mycarousel').find("li").length;
        var __this = this;

        /*
    	 * There are situation where seat map tpl inhibit all pax from seat map show, like if BP generated
    	 * such situations we need to show error message.
    	 * */
        if(sizeOfPax == 0)
        {
        	jQuery(".sectionDefaultstyle").hide();
        	jQuery("#seatMapCoreErrors").addClass("displayBlock").removeClass("displayNone");
        	var temp=jQuery("#seatMapCoreErrors").html();
        	this.moduleCtrl.displayErrors([{
                 "localizedMessage": this.label.seatmodificationNotPossible
               }], "seatMapCoreErrors", "error");
			jQuery("#seatMapCoreErrors").append(temp);
      this.KarmaDisplayReady["T1"] = "Seat Modification Not Possible";
			return null;
        }

        /*For making seat selectable for those which are not bassinet filled and occupied by seatmap*/
        for (var item in __this.custAssociateInfant) {
          item = __this.custAssociateInfant[item];

          for (var ij = 0; ij < sizeOfPax; ij++) {
            if (item.paxIndx != ij) {
              //jQuery(".PaxSelectionScreen").eq(ij).find("[name='"+item.selectedSeat+"']").children(".bassinetFilled").length == 0
              if (jQuery(".PaxSelectionScreen").eq(ij).find("[name='" + item.selectedSeat + "']").children(".bassinetFilled").length == 0 || (__this.parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/true/i) != -1 && jQuery('#mycarousel').find("li").eq(ij).find("span").eq(1).attr("data-accompaniedbyinfant").search(/true/i) != -1)) {
                var seat_span_class = "bassinet";
                if (jQuery(".PaxSelectionScreen").eq(ij).find("[name='" + item.selectedSeat + "']").children(".bassinetFilled").length == 0) {
                  var seat_span_class = "seatAvailable";
                }
                var temp = jQuery(".PaxSelectionScreen").eq(ij).find("[name='" + item.selectedSeat + "']");
                var seat_name = temp.attr("name");
                var seat_charecteristics = temp.attr("data-input-seatcharctics");
                var seat_class = "canselect" + ij;
                var seat_paxID = jQuery('#mycarousel').find("li").eq(ij).attr("data-passenger-id");
                var columnName=temp.attr("data-column");
                if(columnName == undefined)
                {
                	columnName="";
                }
                temp.replaceWith("<div data-column='"+columnName+"' data-input-seatcharctics=\"" + seat_charecteristics + "\" data-selectseatinpax=\"" + seat_paxID + "\" class=\"sm-seat " + seat_class + "\" name=\"" + seat_name + "\" data-seatinfo-price=\"FREE\"><span class=\"" + seat_span_class + "\"></span></div>");
				 this.KarmaDisplayReady["T2"] = this.KarmaDisplayReady["T2"] + 1;

              }

            }

          }

        }

        /*For select seat*/
        jQuery(document).off("click","[class*='canselect']");
        __this.selectseat();

      //jQuery("body").css("overflow-y", "hidden");
      this.paxDisplay = 1;
        if (!jQuery.isUndefined(this.data.seatMapPaxToLandOnTo)) {
    	  this.paxDisplay = this.data.seatMapPaxToLandOnTo;
          this.data.seatMapPaxToLandOnTo = null;
        }
  	  this.myscroll=this.moduleCtrl.iScrollImpl('paxscroller',__this,"mycarousel",this.iScrollCallBack);
  	  this.myscroll.scrollToPage((parseInt(this.paxDisplay)-1), 0);

  	  /*
  	   * for page call
  	   * */
  	  var seatMapScrollConf={
  			zoom: true,
  			hScroll: true,
  			vScroll: false,
			hScrollbar: false,
			vScrollbar: false,
			mouseWheel: true,
			wheelAction: 'zoom',
			snap:true,
			snapThreshold:100,
			flow:"seatmap",
			momentum: false,
			onZoom:function(){

			},
			onZoomStart:function(){


			},
			onZoomEnd:function(){

				/*if(jQuery("#mcistmp_scroller").css("transform").split(",")[3].trim() > 1)
				{
					this.options.snapThreshold=10;

				}else
				{
					this.options.snapThreshold=400;


				}*/
			}
  	  };

  	  setTimeout(function(){
  		__this.seatmapScroller=__this.moduleCtrl.iScrollImpl('mcistmp_wrapper',__this,"mcistmp_scroller",null,seatMapScrollConf);
  		//seatmapScroller=__this.seatmapScroller;
  		//document.querySelector("#mcistmp_wrapper").addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  	  },10);

  	    /*jQuery("body").css("overflow-y", "hidden");
        jQuery('#mycarousel').jcarousel({
          scroll: 1,
          start: parseInt(paxDisplay),
          buttonNextHTML: sizeOfPax,
          buttonPrevHTML: sizeOfPax,
          visible: 1,
          itemVisibleInCallback: {
            onAfterAnimation: function(carousel, item, idx, state) {

              jQuery("#pageWiseCommonWarnings").disposeTemplate();
              jQuery("#seatErrors").disposeTemplate();

              var totalCustomers = jQuery('#mycarousel').find("li").length;

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

              /*For hide seat map of all pax and show only required one
              jQuery(".PaxSelectionScreen").addClass("displayNone");
              jQuery(".PaxSelectionScreen").eq(idx - 1).removeClass("displayNone");

              jQuery("body").css("overflow-y", "");

              __this.currentSel = idx - 1;

              //For automatic change deck based on seat selected
              if (jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text() != "Not Added") {
                __this.showDeckBasedOnSelectedSeat(jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text());
              }

              //Occupy seat in other pax if currently showing pax selected seat already
              __this.occupySeatInOtherPax(idx);


              /*To Display Warning Messages If Warning is Given in Admin Rule For The Customer And Disabling the Proceed Button
              var selectedcpr = __this.moduleCtrl.getSelectedCPR();
              var cpr = __this.moduleCtrl.getCPR();
              var journey = cpr[selectedcpr.journey];
              var selectedProdForSeatMap = __this.data.seatMapProdIndex;
              var flightSel = selectedcpr.flighttocust[selectedProdForSeatMap];
              var passenger = jQuery('#mycarousel').find("li").eq(__this.currentSel).attr("data-passenger-id");
              var flight = flightSel.product;
              __this.moduleCtrl.getWarningsForThePage("SSEL", __this, passenger, flight);
              jQuery('#seatProceedButton').removeAttr("disabled");
              jQuery('#seatProceedButton').removeClass("disabled");
              if (journey["productDetailsBeans"][passenger + flight]["seatChangeAllowed"] == false) {
                jQuery('#seatProceedButton').attr("disabled", "disabled");
                jQuery('#seatProceedButton').addClass("disabled");
              }
              /*To Display Warning Messages If Warning is Given in Admin Rule For The Customer And Disabling the Proceed Button

            }
          }
        });*/


      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in displayReady function', exception);
      }
    },
    iScrollCallBack:function(currentPageIdx,sizeOfPax){

    	if(this.moduleCtrl == undefined)
    	{
    		return null;
    	}

    	jQuery("aside.seatFilter#filters").removeClass("animate");
  		jQuery("aside.seatLegend#help").removeClass("animate");
    	var idx = currentPageIdx;
		var totalCustomers = jQuery('#mycarousel').find("li").length;
		var __this = this;
		var paxDisplay=this.paxDisplay;

		/*For setting wrapper height, width*/
		setTimeout(function(){
			/*For giving time to set wrapper height and width*/
			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
		},100);
		setTimeout(
				function(){
					/*For wrapper and scroller height*/
					//jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)-100)+"px");
					//jQuery("#mcistmp_wrapper").css("height",(window.screen.availHeight-jQuery(".carrousel-header").outerHeight(true)-jQuery(".stmpHeader").outerHeight(true)-jQuery(".stmpFooterId").outerHeight(true)-jQuery("#top .top").outerHeight(true)+30)+"px");
					//jQuery("#mcistmp_scroller").css("height",(jQuery(".PaxSelectionScreen").eq(idx - 1).parent().outerHeight(true)+200)+"px");

					/*For footer width set*/
					jQuery("#stmpFooterId").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");
					jQuery(".stmpHeader").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");

					/*headerHeight for box*/
					if(window.pageYOffset == 0)
					{
						__this.headerHeight.stmpHeader=jQuery(".sectionDefaultstyleSsci .stmpHeader").outerHeight(true);
						__this.headerHeight.stmpAsideHtml=jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup").html();
						__this.headerHeight.stmpHeaderAside=(__this.headerHeight.stmpHeader-jQuery(".sectionDefaultstyleSsci .stmpHeader>hgroup").outerHeight(true))+7;

					}

					//console.log(__this.headerHeight.stmpHeader+"  "+__this.headerHeight.stmpAsideHtml+""+__this.headerHeight.stmpHeaderAside);

					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				},800
		);
		/*end*/

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

        /*
         * for disabling previous next pax
         * */
        if(jQuery("#leftArrow").text() == "0")
		{
        	jQuery("#leftArrow").addClass("carouselArrowDisabled");

        	/*
        	 * For carrousal footer text
        	 * */
        	jQuery("#stmpFooterId").children().eq(0).length>0?jQuery("#stmpFooterId").children().eq(0).addClass("displayNone").removeClass("displayBlock"):undefined;
		}else
		{
			jQuery("#leftArrow").removeClass("carouselArrowDisabled");

			/*
        	 * For carrousal footer text
        	 * */
			jQuery("#stmpFooterId").children().eq(0).length>0?jQuery("#stmpFooterId").children().eq(0).removeClass("displayNone").addClass("displayBlock"):undefined;
		}
        if(jQuery("#rightArrow").text() == "0")
		{
        	jQuery("#rightArrow").addClass("carouselArrowDisabled rightArrowDisabled");

        	/*
        	 * For carrousal footer text
        	 * */
        	jQuery("#stmpFooterId").children().eq(2).length>0?jQuery("#stmpFooterId").children().eq(2).addClass("displayNone").removeClass("displayBlock"):undefined;
		}else
		{
			jQuery("#rightArrow").removeClass("carouselArrowDisabled rightArrowDisabled");

			/*
        	 * For carrousal footer text
        	 * */
			jQuery("#stmpFooterId").children().eq(2).length>0?jQuery("#stmpFooterId").children().eq(2).removeClass("displayNone").addClass("displayBlock"):undefined;
		}


        /*SEATMPA*/
        jQuery("#pageWiseCommonWarnings").disposeTemplate();
        jQuery("#seatErrors").disposeTemplate();

        /*For hide seat map of all pax and show only required one*/
        jQuery(".PaxSelectionScreen").addClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(idx - 1).removeClass("displayNone");

        __this.currentSel = idx - 1;

        if(__this.parameters.SITE_MC_SM_FILTER != undefined && __this.parameters.SITE_MC_SM_FILTER.search(/true/i) != -1)
        {
        /*For updating filter Content*/
        jQuery("#filters #seatOptions").html("");
        jQuery("#filters #optionsSelected>span").text("0");
        jQuery("#filters #seatsCount>span").text("");
        jQuery("#filters [data-control='reset']").unbind("click");
        jQuery("#filters #seatOptions>li").unbind("click");
        __this.formFilterContentForPax(__this.currentSel);
        }

        //For automatic change deck based on seat selected
        if (jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text() != "Not Added") {
          __this.showDeckBasedOnSelectedSeat(jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text());
        }

        //Occupy seat in other pax if currently showing pax selected seat already
        __this.occupySeatInOtherPax(idx);

        /*
         * For showing seat details
         * */
    	if(jQuery(".PaxSelectionScreen").eq(idx - 1).find(".is-current").length > 0)
    	{
    		jQuery(".PaxSelectionScreen").eq(idx - 1).find(".seatSelection.mciSeatSelDescription").prev().removeClass("on");
    		jQuery(".PaxSelectionScreen").eq(idx - 1).find(".seatSelection.mciSeatSelDescription").prev().children().find("#pointer").removeClass("displayBlock").addClass("displayNone");
    		jQuery(".mciSeatSelDescription").remove();
            __this.forSeatCharectersticsshow(jQuery(".PaxSelectionScreen").eq(idx - 1).find(".is-current"),1);
            jQuery(".PaxSelectionScreen").eq(idx - 1).find(".is-current").parent().parent().addClass("on");
    	}

        /*To Display Warning Messages If Warning is Given in Admin Rule For The Customer And Disabling the Proceed Button*/
        var selectedcpr = __this.moduleCtrl.getSelectedCPR();
        var cpr = __this.moduleCtrl.getCPR();
        var journey = cpr[selectedcpr.journey];
        var selectedProdForSeatMap = __this.data.seatMapProdIndex;
        var flightSel = selectedcpr.flighttocust[selectedProdForSeatMap];
        var passenger = jQuery('#mycarousel').find("li").eq(__this.currentSel).attr("data-passenger-id");
        var flight = flightSel.product;
        __this.moduleCtrl.getWarningsForThePage("SSEL", __this, passenger, flight);
        jQuery('#seatProceedButton').removeAttr("disabled");
        jQuery('#seatProceedButton').removeClass("disabled");
        if (journey["productDetailsBeans"][passenger + flight]["seatChangeAllowed"] == false) {
          jQuery('#seatProceedButton').attr("disabled", "disabled");
          jQuery('#seatProceedButton').addClass("disabled");
        }
        /*To Display Warning Messages If Warning is Given in Admin Rule For The Customer And Disabling the Proceed Button*/

          /*SEATMAP*/

        __this.hilightSelectedFilterList(__this.currentSel,"firstTimeLoad");

    },
    /*For forming filter content*/
	formFilterContentForPax:function(currentInx)
    {
		this.$logInfo('NewSeatMapScript::Entering formFilterContentForPax function');
        try {
	    	/*For forming filter content*/
        	var __this=this;
	        var contentFilt="";
	        this.seatCharDetails[currentInx].totalCount=0;
	        var currentPaxReference=jQuery(".PaxSelectionScreen").eq(currentInx);
	        for(var filterCont in this.seatCharDetails[currentInx])
	        {
	        	if(filterCont != "totalCount")
	        	{
	        	var alreadyTick=(this.seatCharDetails[currentInx][filterCont].tick != undefined && this.seatCharDetails[currentInx][filterCont].tick) == true?" tick":"";
	        	contentFilt+="<li data-eachCharecsticCount='"+this.seatCharDetails[currentInx][filterCont].count+"' data-charecstic='"+filterCont+"' class='fltr"+alreadyTick+"'>"+
				"<a href='javascript:void(0);'>"+this.seatCharDetails[currentInx][filterCont].text+" <small>("+this.seatCharDetails[currentInx][filterCont].count+" "+this.label.tx_ssci_seat_char_avail+")</small></a>"+
				"</li>";
	        	this.seatCharDetails[currentInx].totalCount+=this.seatCharDetails[currentInx][filterCont].count;
	        	}

	        }
	        jQuery("#filters #seatsCount>span").text(this.seatCharDetails[currentInx].totalCount);
	        jQuery("#filters #seatOptions").html(contentFilt);
	        jQuery("#filters #seatOptions>li").bind("click",function(){
	        	if(jQuery(this).hasClass("tick"))
	        	{
	        		jQuery(this).removeClass("tick");
	        		__this.seatCharDetails[currentInx][jQuery(this).attr("data-charecstic")].tick=false;

	        		/*For proper match 3 steps*/
	        		/*step 1*/
	        		currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").removeClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").removeClass("filtered");
	        		/*step 2*/
	        		currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").removeClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").removeClass("filtered");
	        		/*step 3*/
	        		currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='canselect']").removeClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='selected']").removeClass("filtered");

	        		/*For S3 device border not getting removed on de select correponding filter*/
	        		var userAgents=window.navigator.userAgent;
	        		if(userAgents.substr(userAgents.search(/android/ig)).split(";")[0].split(" ")[1] <= "4.3.9")
	        		{

	        			jQuery("[data-row]").each(function(){

	        				$(this).html($(this).html());

	        			});
	        		}

	        		__this.hilightSelectedFilterList(currentInx);

	        		/*For changing total count*/
	        		jQuery("#filters #seatsCount>span").text(parseInt(jQuery("#filters #seatsCount>span").text())-parseInt(jQuery(this).attr("data-eachCharecsticCount")));
	        	}else
	        	{
	        		jQuery(this).addClass("tick");
	        		__this.seatCharDetails[currentInx][jQuery(this).attr("data-charecstic")].tick=true;
	        		/*For proper match 3 steps*/
	        		/*step 1*/
	        		currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").addClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").addClass("filtered");
	        		/*step 2*/
	        		currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").addClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").addClass("filtered");
	        		/*step 3*/
	        		currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='canselect']").addClass("filtered");
	        		currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='selected']").addClass("filtered");

	        		/*For changing total count*/
	        		if(jQuery("#filters #seatOptions>li.tick").length == 1)
	        		{
	        			jQuery("#filters #seatsCount>span").text("0");
	        		}
	        		jQuery("#filters #seatsCount>span").text(parseInt(jQuery("#filters #seatsCount>span").text())+parseInt(jQuery(this).attr("data-eachCharecsticCount")));

	        	}

	        	/*For change option count*/
	        	jQuery("#filters #optionsSelected>span").text(jQuery("#filters #seatOptions>li.tick").length);
	        	/*For changing total count*/
	    		if(jQuery("#filters #seatsCount>span").text() == "0")
	    		{
	    			jQuery("#filters #seatsCount>span").text(__this.seatCharDetails[currentInx].totalCount);
	    		}
	        });
	        jQuery("#filters [data-control='reset']").bind("click",function(){

	        	jQuery("#filters #seatOptions>li").removeClass("tick");

	        	for(var filterCont in __this.seatCharDetails[currentInx])
	            {
	        		if(filterCont != "totalCount")
	            	{
	        			__this.seatCharDetails[currentInx][filterCont].tick=false;

	        			/*For proper match 3 steps*/
	            		/*step 1*/
	        			currentPaxReference.find("[data-input-seatcharctics*=',"+filterCont.toUpperCase()+",'][class*='canselect']").removeClass("filtered");
	        			currentPaxReference.find("[data-input-seatcharctics*=',"+filterCont.toUpperCase()+",'][class*='selected']").removeClass("filtered");
	        			/*step 2*/
	        			currentPaxReference.find("[data-input-seatcharctics^='"+filterCont.toUpperCase()+",'][class*='canselect']").removeClass("filtered");
	        			currentPaxReference.find("[data-input-seatcharctics^='"+filterCont.toUpperCase()+",'][class*='selected']").removeClass("filtered");
	        			/*step 3*/
	        			currentPaxReference.find("[data-input-seatcharctics$=',"+filterCont.toUpperCase()+"'][class*='canselect']").removeClass("filtered");
	        			currentPaxReference.find("[data-input-seatcharctics$=',"+filterCont.toUpperCase()+"'][class*='selected']").removeClass("filtered");


	        			/*For S3 device border not getting removed on de select correponding filter*/
	        			var userAgents=window.navigator.userAgent;
	            		if(userAgents.substr(userAgents.search(/android/ig)).split(";")[0].split(" ")[1] <= "4.3.9")
	            		{
	            			jQuery("[data-row]").each(function(){

	            				$(this).html($(this).html());

	            			});
	            		}
	            	}
	            }

	        	/*For change option count*/
	        	jQuery("#filters #optionsSelected>span").text("0");
	        	/*For changing total count*/
	        	jQuery("#filters #seatsCount>span").text(__this.seatCharDetails[currentInx].totalCount);
	        });

        } catch (exception) {
            this.$logError('NewSeatMapScript::An error occured in formFilterContentForPax function', exception);
          }
    },
    /*
     * flag - firstTimeLoad selecting default selection of user when switching user
     * */
    hilightSelectedFilterList:function(currentInx,flag)
    {
    	 this.$logInfo('NewSeatMapScript::Entering hilightSelectedFilterList function');
         try {
		    	/*For hilighting if still selected some things*/
        	 var currentPaxReference=jQuery(".PaxSelectionScreen").eq(currentInx);
				jQuery("#filters #seatOptions>li.tick").each(function(i){

					/*For proper match 3 steps*/
		    		/*step 1*/
					currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").addClass("filtered");
					currentPaxReference.find("[data-input-seatcharctics*=',"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").addClass("filtered");
		    		/*step 2*/
					currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='canselect']").addClass("filtered");
					currentPaxReference.find("[data-input-seatcharctics^='"+jQuery(this).attr("data-charecstic").toUpperCase()+",'][class*='selected']").addClass("filtered");
		    		/*step 3*/
					currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='canselect']").addClass("filtered");
					currentPaxReference.find("[data-input-seatcharctics$=',"+jQuery(this).attr("data-charecstic").toUpperCase()+"'][class*='selected']").addClass("filtered");

					if(flag == "firstTimeLoad"){
						/*For changing total count*/
						if(i == 0)
						{
							jQuery("#filters #seatsCount>span").text("0");
						}
						jQuery("#filters #optionsSelected>span").text(jQuery("#filters #seatOptions>li.tick").length);
		        		jQuery("#filters #seatsCount>span").text(parseInt(jQuery("#filters #seatsCount>span").text())+parseInt(jQuery(this).attr("data-eachCharecsticCount")));
					}

				});
         } catch (exception) {
             this.$logError('NewSeatMapScript::An error occured in hilightSelectedFilterList function', exception);
           }

    },
    /*data - data where deck list has to update
     *
     * mainCompartmentBestIndex - index where other main deck column list has to replace
     * upperCompartmentBestIndex - index where other upper deck column list has to replace
     * */
    getindexFromWhereConstructColumnHeader: function(data, mainCompartmentBestIndex, upperCompartmentBestIndex) {
      this.$logInfo('NewSeatMapScript::Entering getindexFromWhereConstructColumnHeader function');
      try {

        for (var compartment in data) {
          compartment = data[compartment];
          /*
           * Upper deck
           *
          if(compartment.compartmentDetailsCabinClassLocation == "U")
          {

            compartment.columnDetails=data[upperCompartmentBestIndex].columnDetails;

          }else
          {
            compartment.columnDetails=data[mainCompartmentBestIndex].columnDetails;
          }*/
        }

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in getindexFromWhereConstructColumnHeader function', exception);
      }

    },

    showBasinetSeatOnTopBassinetSeat: function() {
      this.$logInfo('NewSeatMapScript::Entering showBasinetSeatOnTopBassinetSeat function');
      try {
        var bsinettdNumbers = [];
        var lineNumber = 0;
        var totalNumberTDS = 0;
      var lowerDeckhighestTDCount=0;
      var higherDeckhighestTDCount=0;
        var bassinetRowHasToAddBefore = "";
        var __this=this;
      /*For making exit row seat proper
      jQuery("tr").each(function() {

    	  	if(jQuery(this).find("td[class='exitrowright']").length != 0)
    	  	{
    	  		jQuery(this).children(":first-child").replaceWith(jQuery(this).find("td[class='exitrowright']")[0].outerHTML);
    	  		jQuery(this).find("td[class='exitrowright']").remove();
    	  	}
    	  	if(jQuery(this).find("td[class='exitrowleft']").length != 0)
    	  	{
    	  		jQuery(this).children(":first-child").replaceWith(jQuery(this).find("td[class='exitrowleft']")[0].outerHTML);
    	  		jQuery(this).find("td[class='exitrowleft']").remove();
    	  	}

      });
      /*End For making exit row seat proper*/

        jQuery("div[data-input-seatcharctics]").each(function(index) {
           var parentAccess=jQuery(this).parent().parent();
    	  /*check sc1.bmp*/
    	  if(parentAccess.parent().attr("name") == "lowerdeck" && lowerDeckhighestTDCount < parentAccess.children().length)
    	  {
    		  lowerDeckhighestTDCount=parentAccess.children().length;
    	  }else if(higherDeckhighestTDCount < parentAccess.children().length)
    	  {
    		  higherDeckhighestTDCount=parentAccess.children().length;
    	  }

          /*If line number where bassinet found to new one changed means bassinet row has to included*/
          var tr_td_Html = "";
          if ((lineNumber != parentAccess.attr('data-row') || (jQuery("div[data-input-seatcharctics]").length == (index+1) && jQuery(this).parent().nextAll("div").find("[data-input-seatcharctics]").length == 0)) && bsinettdNumbers.length > 0) {
            for (var i = 0; i < totalNumberTDS; i++) {
              if (bsinettdNumbers.indexOf(i) != -1) {
                tr_td_Html += "<div><div class='sm-bassinet'></div></div>";
	              __this.KarmaShowBasinetSeatOnTopBassinetSeat["T3"] = __this.KarmaShowBasinetSeatOnTopBassinetSeat["T3"] + 1;
              } else {
                  if (bassinetRowHasToAddBefore.parent().parent().children().eq(i).hasClass("sm-aislePath")) {
                	  tr_td_Html += "<div class='sm-aislePath'><div class='sm-aisle'></div></div>";
                    } else {
                    	tr_td_Html += "<div><div class='sm-aisle'></div></div>";
                    }

              }

            }

            tr_td_Html = "<div class='sm-row'>" + tr_td_Html + "</div>";
            bassinetRowHasToAddBefore.parent().parent().before(tr_td_Html);

            /*resetting variables*/
            bsinettdNumbers = [];
            lineNumber = 0;
            bassinetRowHasToAddBefore = "";
          }

          /*PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/
          if (jQuery.inArray("B", jQuery(this).attr("data-input-seatcharctics").split(",")) != -1) {
            /*push bassinet seatdetails to array, only bassinet seat shown to these TDS*/
            bsinettdNumbers.push(jQuery(this).parent().index());
            lineNumber = parentAccess.attr('data-row');
            bassinetRowHasToAddBefore = jQuery(this);

            /*Find out total td count, condition to execute only when variable is 0*/
            totalNumberTDS = parentAccess.children().length;

          }
          /*END PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/

          jQuery(this).after("<span class=\"displayNone\" id=\"pointer\"></span>");

          /*For forming filter charecterstics*/
          if(__this.parameters.SITE_MC_SM_FILTER != undefined && __this.parameters.SITE_MC_SM_FILTER.search(/true/i) != -1)
          {
        	  this.seatCharDetails={};
        	  __this.forSegregateSeatCharectersticsforFilter(jQuery(this));
          }

        });
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in showBasinetSeatOnTopBassinetSeat function', exception);
      }
    },

    setCustAssociateInfant: function(custID, seat, accompaniedByInfant, paxPosition, fligthid) {
      this.$logInfo('NewSeatMapScript::Entering setCustAssociateInfant function');
      try {
        this.custAssociateInfant[custID] = {
          "initseat": seat,
          "accompaniedByInfant": accompaniedByInfant,
          "selectedSeat": seat,
          "previousSeat": seat,
          "paxIndx": parseInt(paxPosition) - 1,
          "flightid": fligthid,
          "NumToDispOnSelSeat": paxPosition
        };
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in setCustAssociateInfant function', exception);
      }

    },

    // Function to chk whether it is exit row seat
    isExitSeat: function(charArray) {
      this.$logInfo('NewSeatMapScript::Entering isExitSeat function');
      try {
        var test = jQuery.inArray("E", charArray)
        if (test == -1) {
//For TDD
          this.KarmaIsExitSeat["T3"]=false;
          return false;
        } else {
//For TDD
          this.KarmaIsExitSeat["T3"]=true;
          return true;
        }
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in isExitSeat function', exception);
      }
    },

    // Function to chk whether it is isChargebleSeat seat
    isChargebleSeat: function(charArray) {
      this.$logInfo('SeatMap::Entering isChargebleSeat function');
      var test = jQuery.inArray("CH", charArray)
      if (test == -1) {
       //For TDD
        this.KarmaIsChargebleSeat["T3"]=false;
        return false;
      } else {
      //For TDD
        this.KarmaIsChargebleSeat["T3"]=true;
        return true;
      }
    },


    // Function to chk whether it is basinet seat
    isBasinetSeat: function(charArray) {
      this.$logInfo('NewSeatMapScript::Entering isChargebleSeat function');
      try {
        var test = jQuery.inArray("B", charArray);
        if (test == -1) {
         //For TDD
          this.KarmaIsBasinetSeat["T3"]=false;
          return false;
        } else {
        //For TDD
          this.KarmaIsBasinetSeat["T3"]=true;
          return true;
        }
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in isChargebleSeat function', exception);
      }
    },

    /*
     * in a scenario where there r 3 pax
     * as 3 diff seat map get generate,
     * 1pax 1A, 2pax 2A, 2pax 3A
     * if we are currently at 2pax in currosel then seat 2A is hilighted autoautomatically
     *
     * IN THIS CASE TO SHOW 1A and 3A in 2 pax seat map we are using this function
     * */
    occupySeatInOtherPax: function(idx) {
      this.$logInfo('NewSeatMapScript::Entering occupySeatInOtherPax function');
      try {
        var __this = this;
        /*
        __this.originalSeatMock holds seat which are got hilighted in next loop, and when move to new pax in currosel i.e in this case 1 or 3

        it makes in pax 2 seat map seat to initial stage

         */
        for (var item in __this.originalSeatMock) {
          var itemSrc = __this.originalSeatMock.indexOfPrevpaxViewed();
          item = __this.originalSeatMock[item];
          if (typeof item != "function") {
            jQuery(".PaxSelectionScreen").eq(parseInt(itemSrc) - 1).find("[name='" + item.split("~~~")[1] + "']").replaceWith(item.split("~~~")[0]);
          }

        }
        __this.originalSeatMock = [];

        /*this loop doing  SHOW 1A and 3A in 2 pax seat map*/
        for (var item in __this.custAssociateInfant) {
          item = __this.custAssociateInfant[item];

          if (item.NumToDispOnSelSeat != idx && item.selectedSeat != "Not Added") {

            //For preserve original seat constructed
            __this.originalSeatMock[item.NumToDispOnSelSeat] = jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']")[0].outerHTML + "~~~" + item.selectedSeat;
            __this.originalSeatMock.indexOfPrevpaxViewed = function() {
              return idx
            };

            //For making seat un-selectable
            var columnName=jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']").attr("data-column");
            var charecstic=jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']").attr("data-input-seatcharctics");
            var selectSeatInPax=jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']").attr("data-selectseatinpax");
            columnName == undefined?"":columnName;
            charecstic == undefined?"":charecstic;
            selectSeatInPax == undefined?"":selectSeatInPax;
            jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']").replaceWith("<div name=\"" + item.selectedSeat + "\" data-column=\""+columnName+"\" data-selectseatinpax=\""+selectSeatInPax+"\" data-input-seatcharctics=\""+charecstic+"\" data-seatinfo-price=\"FREE\" class=\"sm-seat occupied selected\"><span class=\"seatNotAvailable\">" + item.NumToDispOnSelSeat + "</span></div>");
            //For TDD
          this.KarmaOccupySeatInOtherPax["T4"] = "Making seat un-selectable";	
          }
        }
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in occupySeatInOtherPax function', exception);
      }

    },

    revertSeat: function(evt) {
      this.$logInfo('NewSeatMapScript::Entering revertSeat function');
      try {

        /*
         * Refreah page to revert seat,
         * for loop below is unreachable hence no prob, it is kept for alternate insted refresh but very tuff maintain
         * */
        this.data.seatMapPaxToLandOnTo = this.currentSel + 1;
        /*
         * For taking to top incase of refresh
         * */
        window.scrollTo(0,0);
        this.$refresh();
        return false;

        for (var item in this.custAssociateInfant) {
          item = this.custAssociateInfant[item];
          /*if(item.initseat != "Not Added")
        {*/
          /*For reverting current selection*/
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.selectedSeat + "']").removeClass("is-current");
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.selectedSeat + "']").children("input").removeClass("displayNone");
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.selectedSeat + "']").children("span").text("");

          /*For selecting initial one*/
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.initseat + "']").addClass("is-current");
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.initseat + "']").children("input").addClass("displayNone");
          jQuery(".PaxSelectionScreen").eq(item.paxIndx).find("[name='" + item.initseat + "']").children("span").text(parseInt(item.paxIndx) + 1);
          //}

          /*for set previous and selected one*/
          item.selectedSeat = item.initseat;
          item.previousSeat = item.initseat;

          /*Seat corousel for seleccted seat*/
          jQuery('#mycarousel').find("li").eq(item.paxIndx).children(".seatNum").text(item.initseat);

          /*for showing valid Deck*/
          if (item.initseat != "Not Added") {
            this.showDeckBasedOnSelectedSeat(item.initseat, item.paxIndx);
          }

        }

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in revertSeat function', exception);
      }
    },

    selectseat: function(evt) {
      this.$logInfo('NewSeatMapScript::Entering selectseat function');
      try {
        /*For seatmap selection*/
        var __this = this;
        jQuery(document).on("click","[class*='canselect']", function() {
          var __this = forOverrideLocal;


          /*Not Allowed Customers*/
          var selectedProdForSeatMap = __this.data.seatMapProdIndex;
          var selectedCPR = __this.moduleCtrl.getSelectedCPR();
          var flightSel = selectedCPR.flighttocust[selectedProdForSeatMap].product;
          var paxSel = jQuery(this).attr('data-selectseatinpax');
          var cpr = __this.moduleCtrl.getCPR();
          var journey = cpr[selectedCPR.journey];
          /*Not Allowed Customers*/

          var prev_seat = __this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].previousSeat;
          //jQuery(this).children().length == 2 &&
          if (prev_seat != jQuery(this).attr('name') && (journey["productDetailsBeans"][paxSel + flightSel]["seatChangeAllowed"] == true)) {
            /*For  previous pax*/
            if (prev_seat != "Not Added") {
              if (jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").hasClass("cantBeSelectedHereAfter")) {
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").attr("class", "");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").text("");
                var spanClass = jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class", "");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class", spanClass.split("_")[0]);

                /*Apply occupied class to td if seat occpied seat to show*/
                if (spanClass.split("_")[0] == "seatNotAvailable" || spanClass.split("_")[0] == "bassinetFilled") {
                  jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").attr("class", "sm-seat occupied");
                }
              } else {
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").removeClass("is-current");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").children("span").text("");
              }

              /**For removing column on top of seat**/
              jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").parent().parent().removeClass("on");
            }

            __this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].previousSeat = jQuery(this).attr('name');

            /*For setting current pax*/
            jQuery(this).addClass("is-current");

            //jQuery(this).children("input").addClass("displayNone");
            jQuery(this).children("span").text(parseInt(__this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].paxIndx) + 1);
            __this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].selectedSeat = jQuery(this).attr('name');
          //For TDD
            __this.KarmaSelectseat["T5"] = "New Seat seleccted successfully";
            /*Seat corousel for seleccted seat*/
            jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text(jQuery(this).attr('name'));

            /*
             * For showing seat details
             * */
            jQuery(".PaxSelectionScreen").eq(__this.currentSel).find(".seatSelection.mciSeatSelDescription").prev().removeClass("on");
    		jQuery(".PaxSelectionScreen").eq(__this.currentSel).find(".seatSelection.mciSeatSelDescription").prev().children().find("#pointer").removeClass("displayBlock").addClass("displayNone");
    		jQuery(".mciSeatSelDescription").remove();
    		/**For adding column on top of seat**/
            jQuery(this).parent().parent().addClass("on");
            __this.forSeatCharectersticsshow(jQuery(this));

          }

          if(prev_seat == jQuery(this).attr('name') && (journey["productDetailsBeans"][paxSel + flightSel]["seatChangeAllowed"] == true))
          {
        	  /*
               * For showing seat details
               * */
        	  jQuery(".PaxSelectionScreen").eq(__this.currentSel).find(".seatSelection.mciSeatSelDescription").prev().removeClass("on");
      		jQuery(".PaxSelectionScreen").eq(__this.currentSel).find(".seatSelection.mciSeatSelDescription").prev().children().find("#pointer").removeClass("displayBlock").addClass("displayNone");
      		jQuery(".mciSeatSelDescription").remove();
      		/**For adding column on top of seat**/
            jQuery(this).parent().parent().addClass("on");
              __this.forSeatCharectersticsshow(jQuery(this));
          }

        });

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in selectseat function', exception);
      }

    },
    forSeatCharectersticsshow:function(elemRef,__this){
    	this.$logInfo('NewSeatMapScript::Entering forSeatCharectersticsshow function');
    	var __this=this;
        try {

        	if(elemRef == undefined)
        	{
        		return false;
        	}

        	/*
	         * Display seat details
	         * */
	        var ref=elemRef.parent().parent();
	        var charDetails="";
	        var charArray=elemRef.attr("data-input-seatcharctics").split(",");
	        for(var charcLoop in charArray)
	        {
	        	var seatCharectFlag=__this.label["tx_ssci_seat_char_"+charArray[charcLoop].toLowerCase()] != undefined?
	        			"tx_ssci_seat_char_":__this.label["tx_ssci_seat_type_"+charArray[charcLoop].toLowerCase()] != undefined?"tx_ssci_seat_type_":undefined;
	        	if(__this.label[seatCharectFlag+charArray[charcLoop].toLowerCase()] != undefined)
	        	{
	        		charDetails+=__this.label[seatCharectFlag+charArray[charcLoop].toLowerCase()]+", ";
	        	}

	        }
	        charDetails=charDetails.substring(0,charDetails.length-2);

	        var html_source="<div class='seatSelection mciSeatSelDescription'>"+
	        "<div>"+
	        "<section class='seatTeaser'>"+
	        "<div class='close'></div>"+
	        "<div class='seatInfo before'>"+
	        "<span class='seatNo'>"+elemRef.attr('name')+"</span> - <span class='seatPrice'>"+this.label.free+"</span> - <span class='seatDescription'>"+charDetails+"</span>"+
	        "</div>"+
	        "</section>"+
	        "</div>"+
	        "</div>";

	        elemRef.next().removeClass("displayNone").addClass("displayBlock");
	        ref.after(html_source);
         //For TDD
          this.KarmaForSeatCharectersticsshow["T7"]="Seat characteristics shown successfully";
	        jQuery(".mciSeatSelDescription div.close").bind("click",function(){
	        	jQuery(this).parents(".seatSelection.mciSeatSelDescription").prev().removeClass("on");
	        	jQuery(this).parents(".seatSelection.mciSeatSelDescription").prev().children().find("#pointer").removeClass("displayBlock").addClass("displayNone");
	        	jQuery(".mciSeatSelDescription").remove();
	        });
        } catch (exception) {
            this.$logError('NewSeatMapScript::An error occured in forSeatCharectersticsshow function', exception);
        }
    },
    showDeckBasedOnSelectedSeat: function(seat, index) {
      this.$logInfo('NewSeatMapScript::Entering showDeckBasedOnSelectedSeat function');
      try {
        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }
        var flag = jQuery(".PaxSelectionScreen").eq(index).find("[name='" + seat + "']").parents('div[class*="sm-row"]').parent().attr("name");
        if (flag == "lowerdeck") {
          this.onViewLowerDeck("", index);
        } else if (flag == "upperdeck") {
          this.onViewUpperDeck("", index);
        }

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in showDeckBasedOnSelectedSeat function', exception);
      }

    },

    // Function used to save the selected seats for passengers
    onSaveSeat: function(evt) {

      evt.preventDefault();

      /*From which page seatmap loaded*/
      var flow = "tripsummary";
      if (this.data.seatMapLoadingFrom == "ac") {
        flow = "checkin-conf";
      }

      this.$logInfo('NewSeatMapScript::Entering onSaveSeat function');
      try {
        var errors = [];
        var input = [];
        var success = [];
        var selectedCPR = this.moduleCtrl.getSelectedCPR();
        var cpr = this.moduleCtrl.getCPR();
        var journey = cpr[selectedCPR.journey];
        /*IATCI*/
        //SeatMapProdIndex denotes the Fligth Id in SelecetedCPR
        this.data.IATCIinput[selectedCPR.flighttocust[this.data.seatMapProdIndex].product] = [];
        /*IATCI*/
        for (var item in this.custAssociateInfant) {
          var paxid = item;
          item = this.custAssociateInfant[item];
          var legids = this.moduleCtrl.getLegIdBasedByFlightId(item.flightid);

          //Only Allowed Passenger to Be Shown
          if (journey["productDetailsBeans"][paxid + item.flightid]["seatChangeAllowed"]) {
            if (item.selectedSeat == "Not Added") {
              errors.push({
                "localizedMessage": this.errorStrings[25000012].localizedMessage,
                "code": this.errorStrings[25000012].errorid
              });
              //jQuery('#mycarousel').jcarousel('scroll', item.NumToDispOnSelSeat, false);
              this.myscroll.scrollToPage((parseInt(item.NumToDispOnSelSeat)-1), 0);
              var __this=this;
              setTimeout(function(){
            	  __this.moduleCtrl.displayErrors(errors, "seatErrors", "error");
              },500);
              //For TDD
              this.KarmaOnSaveSeat["T6"] = "Please Select seat for all the customer.";
              return false;
            }

            /*IATCI Flight Check For Trip summary page request*/
            if (!jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[item.flightid]) && !jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[item.flightid][paxid])) {
              for (var i in legids) {

                if (this.data.dcsSeatIATCIforProduct[item.flightid][paxid] != item.selectedSeat) {
                  this.data.IATCIinput[item.flightid].push({
                    "legid": legids[i],
                    "paxid": paxid,
                    "seat": item.selectedSeat,
                    "service": "change_seat",
                    flow: "IATCISeatSave"
                  });
                }
                var referenceIDLegPassengerLegID = legids[i];
                var referenceIDLegPassengerPassengerID = paxid;
                var constraint = referenceIDLegPassengerPassengerID + referenceIDLegPassengerLegID + "SST";
                if (cpr[selectedCPR.journey].seat[constraint]) {
                  cpr[selectedCPR.journey].seat[constraint].row = item.selectedSeat.substring(0, (item.selectedSeat.length - 1));
                  cpr[selectedCPR.journey].seat[constraint].column = item.selectedSeat.substring(item.selectedSeat.length - 1);
                  cpr[selectedCPR.journey].seat[constraint].status.code = "A";
                  cpr[selectedCPR.journey].seat[constraint].status.listCode = "SST";
                  cpr[selectedCPR.journey].seat[constraint].status.owner = "SSCI";
                }
              }
              this.moduleCtrl.setCPR(cpr);
            } /*Normal Flow*/
            else if ((item.initseat != item.selectedSeat)) {
              for (var i in legids) {
                input.push({
                  "legid": legids[i],
                  "paxid": paxid,
                  "seat": item.selectedSeat,
                  "service": "change_seat",
                  flow: flow
                });
              }
            }
          }
        } /*Save Seat Function takes care If input.length == 0 (In case no NON IATCI Flights)*/
        if (input.length > 0) {
          this.moduleCtrl.saveseat(input);
         //For TDD
          this.KarmaOnSaveSeat["T5"]="Seat saved successfully";
        } else {
          success.push(this.data.uiErrors[25000067]); //JSONData.uiErrors[21300051].localizedMessage
          this.moduleCtrl.setSuccess(success);
          this.moduleCtrl.onBackClick();
          this.KarmaOnSaveSeat["T6"]="Please select a new seat";
        }

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in onSaveSeat function', exception);
      }

    },

    // function used to get int value
    getIntValue: function(stringValue, radix) {
      this.$logInfo('NewSeatMapScript::Entering getIntValue function');
      try {
        var ValInInteger = 0;
        if (arguments.length == 1) {
          ValInInteger = parseInt(stringValue);
        } else {
          ValInInteger = parseInt(stringValue, radix);
        }
        return ValInInteger;
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in getIntValue function', exception);
      }
    },

    // function used to view upper deck
    onViewUpperDeck: function(evt, index) {
      try {
        this.$logInfo('NewSeatMapScript::Entering onViewUpperDeck function');

        if(this.filterCloseClick == 1)
        {
        	this.filterCloseClick=0;
        	return false;
        }

        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeck']").addClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeck']").removeClass("displayNone");

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeckheader']").removeClass("active");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeckheader']").addClass("active");

        /* For setting scroller height */
        //jQuery("#mcistmp_scroller").css("height",(jQuery(".PaxSelectionScreen").eq(index).parent().outerHeight(true)+200)+"px");

        /*setting header footer width*/
        jQuery("#stmpFooterId").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");
		  jQuery(".stmpHeader").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in onViewUpperDeck function', exception);
      }
    },

    // function used to view lower deck
    onViewLowerDeck: function(evt, index) {
      try {
        this.$logInfo('NewSeatMapScript::Entering onViewLowerDeck function');
        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeck']").removeClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeck']").addClass("displayNone");

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeckheader']").addClass("active");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeckheader']").removeClass("active");

        /* For setting scroller height */
        //jQuery("#mcistmp_scroller").css("height",(jQuery(".PaxSelectionScreen").eq(index).parent().outerHeight(true)+200)+"px");

        /*setting header footer width*/
        jQuery("#stmpFooterId").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");
		  jQuery(".stmpHeader").css("width",jQuery("#seatMapMainSection>form>.sm-mciBasediv>nav").width()+"px");

      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in onViewLowerDeck function', exception);
      }
    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('NewSeatMapScript::Entering onModuleEvent function');
        switch (evt.name) {
          case "server.error":
            modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
            var errors = [];
            errors.push({
              "localizedMessage": this.uiErrors[21400069].localizedMessage,
              "code": this.uiErrors[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "seatErrors", "error");
            break;
        }
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in onModuleEvent function', exception);
      }
    },

    onBackClick: function() {
      this.$logInfo('NewSeatMapScript::Entering onBackClick function');
      try {
        this.moduleCtrl.onBackClick();
      } catch (exception) {
        this.$logError('NewSeatMapScript::An error occured in onBackClick function', exception);
      }
    },
    /*
     * seatRef - each seat reference
     * */
    forSegregateSeatCharectersticsforFilter:function(seatRef){
        this.$logInfo('NewSeatMapScript::Entering forSegregateSeatCharecterstics function');
        try {
        	var seatCharecterstics=seatRef.attr("data-input-seatcharctics");
        	var charArray=seatCharecterstics.split(",");

        	var paxIndex=seatRef.parents("span.PaxSelectionScreen").parent().index();
        	if(this.seatCharDetails[paxIndex] == undefined)
        	{
        		this.seatCharDetails[paxIndex]={};
        		this.seatCharDetails[paxIndex].totalCount=0;
        	}
            for(var charcLoop in charArray)
            {
            	var seatCharectFlag=this.label["tx_ssci_seat_char_"+charArray[charcLoop].toLowerCase()] != undefined?
	        			"tx_ssci_seat_char_":this.label["tx_ssci_seat_type_"+charArray[charcLoop].toLowerCase()] != undefined?"tx_ssci_seat_type_":undefined;

            	if(this.label[seatCharectFlag+charArray[charcLoop].toLowerCase()] != undefined && (seatRef.filter("[class*='canselect']").length != 0 || seatRef.filter("[class*='selected']").length != 0))
            	{
            		this.seatCharDetails[paxIndex][charArray[charcLoop].toLowerCase()]={"text":this.label[seatCharectFlag+charArray[charcLoop].toLowerCase()],
            		"count":(this.seatCharDetails[paxIndex][charArray[charcLoop].toLowerCase()] == undefined)?0:this.seatCharDetails[paxIndex][charArray[charcLoop].toLowerCase()].count
            		};

            		this.seatCharDetails[paxIndex][charArray[charcLoop].toLowerCase()].count+=1;
                //For TDD
                this.KarmaForSegregateSeatCharectersticsforFilter["T8"] = "Segregating Seat Characteristics Successfull";
            	}
            }
        } catch (exception) {
          this.$logError('NewSeatMapScript::An error occured in forSegregateSeatCharecterstics function', exception);
        }
    },
    /**
     * seatCharecterstics - actual seat Charecterstics it be array [B] -- bassinet
     * comprtmntseatColumn - compartment seat index- in row a b c 3 d e f 7 g h - row names
     * seatColumn - row seat rep usually like a b c 3 d e f 7 g h - row names
     * seatOccupationStatus - F- free, O- occupied
     * seatOccupiedFlag - seat occupied or not
     *
     * Note: all taken from tpl
     */
    forSegregateSeatCharectersticsforLegend:function(seatCharecterstics, comprtmntseatColumn, seatColumn, seatOccupationStatus, seatNotOccupiedFlag, ExitRowExist){
        this.$logInfo('NewSeatMapScript::Entering forSegregateSeatCharectersticsforLegend function');
        try {
        	var seatDisable=false;
        	if(ExitRowExist)
        	{
        		this.legendDetails["exitdoor"]={"text":this.label["tx_ssci_seat_char_d"],"className":"seat-exit"};
            //For TDD
            this.KarmaForSegregateSeatCharectersticsforLegend["T9"] = "Exit Row segregated with legends successfully";
        	}
        	if(seatOccupationStatus == "F" && seatNotOccupiedFlag == true)
        	{

        		if(this.isBasinetSeat(seatCharecterstics))
        		{
        			if(this.parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/false/i) != -1)
        			{
        				seatDisable = true;
        			}
        			this.legendDetails["b"]={"text":this.label["tx_ssci_seat_char_basi"],"className":"seat-bassinet"};
              //For TDD
              this.KarmaForSegregateSeatCharectersticsforLegend["T10"] = "Bassinet Seat segregated with legends successfully";
        		}
        		if(this.isExitSeat(seatCharecterstics))
        		{
        			 if(this.parameters.SITE_SSCI_EXIT_SEAT_SEL.search(/false/i) != -1)
        			 {
        				 seatDisable = true;
        			 }

        		}
        		if(this.isChargebleSeat(seatCharecterstics))
        		{
        			if(this.parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1)
        			{
        				seatDisable = true;
        			}
        			//For now as there is no chargeble seat for MCI, we r not showing it in legend at all
        		}

        		if(seatDisable)
        		{
        			//occupied
        			this.legendDetails["occupied"]={"text":this.label["tx_ssci_seat_char_o"],"className":"seat-occupied"};
              //For TDD
               this.KarmaForSegregateSeatCharectersticsforLegend["T12"]="Exit Seat segregated with legends successfully";
              this.KarmaForSegregateSeatCharectersticsforLegend["T11"]="Chargeble Seat segregated with legends successfully";

        		}else
        		{
        			//free
        			this.legendDetails["free"]={"text":this.label["tx_ssci_seat_char_f"],"className":"seat-available"};
        			this.legendDetails["selected"]={"text":this.label["tx_ssci_seat_char_sel"],"className":"seat-selected"};
              //For TDD
              this.KarmaForSegregateSeatCharectersticsforLegend["T13"]="Free and selected segregated with legends successfully";
        		}

        	}
        	else if(!seatNotOccupiedFlag)
        	{
        		//occupied
    			this.legendDetails["occupied"]={"text":this.label["tx_ssci_seat_char_o"],"className":"seat-occupied"};
          //For TDD
          this.KarmaForSegregateSeatCharectersticsforLegend["T14"] = "Occupied Seat segregated with legends successfully";
        	}
        	else
        	{
        		switch(seatCharecterstics.toString())
        		{
        		case "LA":this.legendDetails["LA"]={"text":this.label["tx_ssci_seat_char_la"],"className":"seat-toilet"};break;
        		case "GN":this.legendDetails["GN"]={"text":this.label["tx_ssci_seat_char_gn"],"className":"seat-galley"};break;
        		case "CL":this.legendDetails["CL"]={"text":this.label["tx_ssci_seat_char_cl"],"className":"seat-closet"};break;
        		case "ST":this.legendDetails["ST"]={"text":this.label["tx_ssci_seat_type_st"],"className":"seat-stairs"};break;
        		case "SO":this.legendDetails["SO"]={"text":this.label["tx_ssci_seat_char_so"],"className":"seat-storage"};break;
        		case "D":this.legendDetails["D"]={"text":this.label["tx_ssci_seat_char_d"],"className":"seat-exit"};break;
        		}
            //For TDD
            this.KarmaForSegregateSeatCharectersticsforLegend["T15"] = "Segregated with legends successfully";
        	}


        } catch (exception) {
          this.$logError('NewSeatMapScript::An error occured in forSegregateSeatCharectersticsforLegend function', exception);
        }
    },
    /*
     * args.flag - 1 - toggle,
     * - 0 - hide
     * */
    showHideLegends:function(event,args){

    	jQuery("aside.seatFilter#filters").removeClass("animate");

    	if(args.flag == 0)
    	{
    		jQuery("aside.seatLegend#help").removeClass("animate");

    	}else
    	{
    		if(jQuery("aside.seatLegend#help").hasClass("animate"))
    		{
    			jQuery("aside.seatLegend#help").removeClass("animate");
    		}else
    		{
    			jQuery("aside.seatLegend#help").css("top",jQuery(".sectionDefaultstyleSsci .stmpHeader").height()+"px");
        		jQuery("aside.seatLegend#help").addClass("animate");
    		}

    	}

    },
    /*
     * args.flag - 1 - toggle,
     * - 0 - hide
     * */
    showHideFilters:function(event,args){

    	jQuery("aside.seatLegend#help").removeClass("animate");

    	if(args.flag == 0)
    	{
    		jQuery("aside.seatFilter#filters").removeClass("animate");
    		var __this=this;
    		this.filterCloseClick=1;
    		setTimeout(function(){
    			__this.filterCloseClick=0;
    		},800);
    	}else
    	{
    		if(jQuery("aside.seatFilter#filters").hasClass("animate"))
    		{
    			jQuery("aside.seatFilter#filters").removeClass("animate");
    		}else
    		{
    			jQuery("aside.seatFilter#filters").css("top",jQuery(".sectionDefaultstyleSsci .stmpHeader").height()+"px");
        		jQuery("aside.seatFilter#filters").addClass("animate");
    		}

    	}

    }
  }
});