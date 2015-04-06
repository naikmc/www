Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.SeatMapScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.custAssociateInfant = {};
    this.originalSeatMock = [];
    this.currentSel = -1;

    this.KarmaDisplayReady={};
    this.KarmaShowBasinetSeatOnTopBassinetSeat={};
    this.KarmaIsExitSeat={};
    this.KarmaIsChargebleSeat={};
    this.KarmaIsBasinetSeat={};
    this.KarmaOccupySeatInOtherPax={};
    this.KarmaSelectseat={};
  },

  $prototype: {
    $dataReady: function() {
      this.$logInfo('SeatMapScript::Entering dataReady function');
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
        this.$logError('SeatMapScript::An error occured in dataReady function', exception);
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
      this.$logInfo('SeatMapScript::Entering viewReady function');
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
        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
			genericScript({
				tpl:"SeatMap",
				data:this.data
			});
        }
        /*END : JavaScript Injection(CR08063892)*/

      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in viewReady function', exception);
      }

    },

    $displayReady: function() {

      this.$logInfo('SeatMapScript::Entering displayReady function');
      try {

        /*
         * For showing bassinet seat according to PTR 08303390
         * */
        this.showBasinetSeatOnTopBassinetSeat();

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
                temp.replaceWith("<td data-input-seatcharctics=\"" + seat_charecteristics + "\" data-selectseatinpax=\"" + seat_paxID + "\" class=\"" + seat_class + "\" name=\"" + seat_name + "\" data-seatinfo-price=\"FREE\"><input type=\"button\" class=\"" + seat_span_class + "\"><span></span></td>");
                this.KarmaDisplayReady["T2"] = this.KarmaDisplayReady["T2"] + 1;
              }

            }

          }

        }

        /*For select seat*/
        jQuery(document).off("click","[class^='canselect']");
        __this.selectseat();

      //jQuery("body").css("overflow-y", "hidden");
      this.paxDisplay = 1;
        if (!jQuery.isUndefined(this.data.seatMapPaxToLandOnTo)) {
    	  this.paxDisplay = this.data.seatMapPaxToLandOnTo;
          this.data.seatMapPaxToLandOnTo = null;
        }
  	  this.myscroll=this.moduleCtrl.iScrollImpl('paxscroller',__this,"mycarousel",this.iScrollCallBack);
  	  this.myscroll.scrollToPage((parseInt(this.paxDisplay)-1), 0);

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
        this.$logError('SeatMapScript::An error occured in displayReady function', exception);
      }
    },
    iScrollCallBack:function(currentPageIdx,sizeOfPax){

    	if(this.moduleCtrl == undefined)
    	{
    		return null;
    	}

		var idx = currentPageIdx;
		var totalCustomers = jQuery('#mycarousel').find("li").length;
		var __this = this;
		var paxDisplay=this.paxDisplay;

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


        /*SEATMPA*/
        jQuery("#pageWiseCommonWarnings").disposeTemplate();
        jQuery("#seatErrors").disposeTemplate();

        /*For hide seat map of all pax and show only required one*/
        jQuery(".PaxSelectionScreen").addClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(idx - 1).removeClass("displayNone");

        __this.currentSel = idx - 1;

        //For automatic change deck based on seat selected
        if (jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text() != "Not Added") {
          __this.showDeckBasedOnSelectedSeat(jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text());
        }

        //Occupy seat in other pax if currently showing pax selected seat already
        __this.occupySeatInOtherPax(idx);


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



    },
    /*data - data where deck list has to update
     *
     * mainCompartmentBestIndex - index where other main deck column list has to replace
     * upperCompartmentBestIndex - index where other upper deck column list has to replace
     * */
    getindexFromWhereConstructColumnHeader: function(data, mainCompartmentBestIndex, upperCompartmentBestIndex) {
      this.$logInfo('SeatMapScript::Entering getindexFromWhereConstructColumnHeader function');
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
        this.$logError('SeatMapScript::An error occured in getindexFromWhereConstructColumnHeader function', exception);
      }

    },

    showBasinetSeatOnTopBassinetSeat: function() {
      this.$logInfo('SeatMapScript::Entering showBasinetSeatOnTopBassinetSeat function');
      try {
        var bsinettdNumbers = [];
        var lineNumber = 0;
        var totalNumberTDS = 0;
      var lowerDeckhighestTDCount=0;
      var higherDeckhighestTDCount=0;
        var bassinetRowHasToAddBefore = "";

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

        jQuery("td[data-input-seatcharctics]").each(function(index) {

    	  /*check sc1.bmp*/
    	  if(jQuery(this).parent().parent().attr("name") == "lowerdeck" && lowerDeckhighestTDCount < jQuery(this).parent().children().length)
    	  {
    		  lowerDeckhighestTDCount=jQuery(this).parent().children().length;
    	  }else if(higherDeckhighestTDCount < jQuery(this).parent().children().length)
    	  {
    		  higherDeckhighestTDCount=jQuery(this).parent().children().length;
    	  }

          /*If line number where bassinet found to new one changed means bassinet row has to included*/
          var tr_td_Html = "";
          if ((lineNumber != jQuery(this).parent().children().eq(0).text() || (jQuery("td[data-input-seatcharctics]").length == (index+1) && jQuery(this).nextAll("[data-input-seatcharctics]").length == 0)) && bsinettdNumbers.length > 0) {
            for (var i = 0; i < totalNumberTDS; i++) {
              if (bsinettdNumbers.indexOf(i) != -1) {
                tr_td_Html += "<td class=\"bassinetReference\"></td>";
                __this.KarmaShowBasinetSeatOnTopBassinetSeat["T3"] = __this.KarmaShowBasinetSeatOnTopBassinetSeat["T3"] + 1;
              } else {
                if (bassinetRowHasToAddBefore.parent().children().eq(i).hasClass("aisle")) {
                  tr_td_Html += "<td class=\"aisle\"><span class=\"seatNotAvailable\"></span></td>";
                } else {
                  tr_td_Html += "<td><input type=\"submit\" class=\"noSeat\" value=\"\"></td>";
                }

              }

            }

            tr_td_Html = "<tr>" + tr_td_Html + "</tr>";
            bassinetRowHasToAddBefore.parent().before(tr_td_Html);

            /*resetting variables*/
            bsinettdNumbers = [];
            lineNumber = 0;
            bassinetRowHasToAddBefore = "";
          }

          /*PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/
          if (jQuery.inArray("B", jQuery(this).attr("data-input-seatcharctics").split(",")) != -1) {
            /*push bassinet seatdetails to array, only bassinet seat shown to these TDS*/
            bsinettdNumbers.push(jQuery(this).index());
            lineNumber = jQuery(this).parent().children().eq(0).text();
            bassinetRowHasToAddBefore = jQuery(this);

            /*Find out total td count, condition to execute only when variable is 0*/
            totalNumberTDS = jQuery(this).parent().children().length;

          }
          /*END PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/

        });
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in showBasinetSeatOnTopBassinetSeat function', exception);
      }
    },

    setCustAssociateInfant: function(custID, seat, accompaniedByInfant, paxPosition, fligthid) {
      this.$logInfo('SeatMapScript::Entering setCustAssociateInfant function');
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
        this.$logError('SeatMapScript::An error occured in setCustAssociateInfant function', exception);
      }

    },

    // Function to chk whether it is exit row seat
    isExitSeat: function(charArray) {
      this.$logInfo('SeatMapScript::Entering isExitSeat function');
      try {
        var test = jQuery.inArray("E", charArray)
        if (test == -1) {
          this.KarmaIsExitSeat["T3"]=false;   //For TDD
          return false;
        } else {
          this.KarmaIsExitSeat["T3"]=true;  //For TDD
          return true;
        }
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in isExitSeat function', exception);
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
      this.$logInfo('SeatMapScript::Entering isChargebleSeat function');
      try {
        var test = jQuery.inArray("B", charArray)
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
        this.$logError('SeatMapScript::An error occured in isChargebleSeat function', exception);
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
      this.$logInfo('SeatMapScript::Entering occupySeatInOtherPax function');
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
            jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + item.selectedSeat + "']").replaceWith("<td name=\"" + item.selectedSeat + "\" data-seatinfo-price=\"FREE\" class=\"occupied selected\"><span class=\"seatNotAvailable\">" + item.NumToDispOnSelSeat + "</span></td>");
            //For TDD
          this.KarmaOccupySeatInOtherPax["T4"] = "Making seat un-selectable";
          }
        }
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in occupySeatInOtherPax function', exception);
      }

    },

    revertSeat: function(evt) {
      this.$logInfo('SeatMapScript::Entering revertSeat function');
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
        this.$logError('SeatMapScript::An error occured in revertSeat function', exception);
      }
    },

    selectseat: function(evt) {
      this.$logInfo('SeatMapScript::Entering selectseat function');
      try {
        /*For seatmap selection*/
        var __this = this;
        jQuery(document).on("click","[class^='canselect']", function() {
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
          if (jQuery(this).children().length == 2 && prev_seat != jQuery(this).attr('name') && (journey["productDetailsBeans"][paxSel + flightSel]["seatChangeAllowed"] == true)) {
            /*For  previous pax*/
            if (prev_seat != "Not Added") {
              if (jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").hasClass("cantBeSelectedHereAfter")) {
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").attr("class", "");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").text("");
                var spanClass = jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class", "");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").find("span").attr("class", spanClass.split("_")[0]);

                /*Apply occupied class to td if seat occpied seat to show*/
                if (spanClass.split("_")[0] == "seatNotAvailable") {
                  jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").attr("class", "occupied");
                }
              } else {
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").removeClass("is-current");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").children("input").removeClass("displayNone");
                jQuery(".PaxSelectionScreen").eq(__this.currentSel).find("[name='" + prev_seat + "']").children("span").text("");
              }

            }

            __this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].previousSeat = jQuery(this).attr('name');

            /*For setting current pax*/
            jQuery(this).addClass("is-current");
            jQuery(this).children("input").addClass("displayNone");
            jQuery(this).children("span").text(parseInt(__this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].paxIndx) + 1);
            __this.custAssociateInfant[jQuery(this).attr('data-selectseatinpax')].selectedSeat = jQuery(this).attr('name');
            //For TDD
            __this.KarmaSelectseat["T5"] = "New Seat seleccted successfully";
            /*Seat corousel for seleccted seat*/
            jQuery('#mycarousel').find("li").eq(__this.currentSel).children(".seatNum").text(jQuery(this).attr('name'));
          }

        });

      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in selectseat function', exception);
      }

    },

    showDeckBasedOnSelectedSeat: function(seat, index) {
      this.$logInfo('SeatMapScript::Entering showDeckBasedOnSelectedSeat function');
      try {
        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }
        var flag = jQuery(".PaxSelectionScreen").eq(index).find("[name='" + seat + "']").parentsUntil('tbody').parent().attr("name");
        if (flag == "lowerdeck") {
          this.onViewLowerDeck("", index);
        } else if (flag == "upperdeck") {
          this.onViewUpperDeck("", index);
        }

      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in showDeckBasedOnSelectedSeat function', exception);
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

      this.$logInfo('SeatMapScript::Entering onSaveSeat function');
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
        this.$logError('SeatMapScript::An error occured in onSaveSeat function', exception);
      }

    },

    // function used to get int value
    getIntValue: function(stringValue, radix) {
      this.$logInfo('SeatMapScript::Entering getIntValue function');
      try {
        var ValInInteger = 0;
        if (arguments.length == 1) {
          ValInInteger = parseInt(stringValue);
        } else {
          ValInInteger = parseInt(stringValue, radix);
        }
        return ValInInteger;
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in getIntValue function', exception);
      }
    },

    // function used to view upper deck
    onViewUpperDeck: function(evt, index) {
      try {
        this.$logInfo('SeatMapScript::Entering onViewUpperDeck function');

        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeck']").addClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeck']").removeClass("displayNone");

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeckheader']").addClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeckheader']").removeClass("displayNone");
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in onViewUpperDeck function', exception);
      }
    },

    // function used to view lower deck
    onViewLowerDeck: function(evt, index) {
      try {
        this.$logInfo('SeatMapScript::Entering onViewLowerDeck function');
        if (jQuery.isUndefined(index)) {
          index = this.currentSel;
        }

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeck']").removeClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeck']").addClass("displayNone");

        jQuery(".PaxSelectionScreen").eq(index).find("[name='lowerdeckheader']").removeClass("displayNone");
        jQuery(".PaxSelectionScreen").eq(index).find("[name='upperdeckheader']").addClass("displayNone");

      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in onViewLowerDeck function', exception);
      }
    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('SeatMapScript::Entering onModuleEvent function');
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
        this.$logError('SeatMapScript::An error occured in onModuleEvent function', exception);
      }
    },

    onBackClick: function() {
      this.$logInfo('SeatMapScript::Entering onBackClick function');
      try {
        this.moduleCtrl.onBackClick();
      } catch (exception) {
        this.$logError('SeatMapScript::An error occured in onBackClick function', exception);
      }
    }
  }
});