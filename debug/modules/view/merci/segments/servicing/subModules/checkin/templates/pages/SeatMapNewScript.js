Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.SeatMapNewScript',

  $dependencies: [

                  'modules.view.merci.common.utils.MerciGA',
                  'modules.view.merci.common.utils.MCommonScript'
                 ],

  $constructor: function() {
		  this.paxIndex = 0;
		  this.storeseatMap = [];
		  this.storeInitialSeat = [];
		  this.storePreviousPax=undefined;
		  this.loaded = false;
    this.totalcustomerForCpr = 0;
    this.allowSelectBasinetSeat = false;

		  this.__ga = modules.view.merci.common.utils.MerciGA;
      this.utils = modules.view.merci.common.utils.MCommonScript;

  },

  $prototype: {
    $dataReady: function() {
      this.$logInfo('SeatMapNewScript::Entering dataReady function');
      this.pageData = this.moduleCtrl.getModuleData();
      this.requestParam = this.pageData.checkIn.MSeatMapNew_A.requestParam;
      this.label = this.pageData.checkIn.MSeatMapNew_A.labels;
      this.siteParams = this.pageData.checkIn.MSeatMapNew_A.siteParam;
	  this.parameters = this.pageData.checkIn.MSeatMapNew_A.parameters;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.requestParam.bannerHtml, this.siteParams.homeURL, true);
      this.errorStrings = this.pageData.checkIn.MSeatMapNew_A.errorStrings;
      this.uiErrors = this.errorStrings;
        this.segmentBookingStatErr = false;
        this.errorMsg = '';
        this.isCurrentPrime = true;

        var airlineDl = this.pageData.checkIn.MSeatMapNew_A.airlineDl;
		var site_mci_op_airline = this.parameters.SITE_MCI_OP_AIRLINE;
		var site_mci_grp_of_airlines = this.parameters.SITE_MCI_GRP_OF_AIRLINES;
		this.moduleCtrl.setOperatingAirlinesList(airlineDl, site_mci_op_airline, site_mci_grp_of_airlines);

		var configuredAirlines = this.moduleCtrl.getOperatingAirlinesList();

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

		  this.$logInfo('SeatMap::Entering Viewready function');

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
          GTMPage: 'Select seat'
          });
		    
		  }

		  /*GOOGLE ANALYTICS
         * */

        //FOR PAGE
		/*if(this.parameters.SITE_MCI_GA_ENABLE)
	     {
			//ga('send', 'pageview', {'page': 'Select seat','title': 'Your Select seat'});
		}*/



		  //For banner radio buttons to hidden
		  jQuery("input[class='seatmapNumberPax']").addClass("displayNone");

      var __this = this;

      //jQuery("body").css("overflow-y", "hidden");
	  this.paxDisplay = 0;
	  this.myscroll=this.moduleCtrl.iScrollImpl('paxscroller',__this,"mycarousel","paxSeat",this.iScrollCallBack);
	  this.myscroll.scrollToPage(this.paxDisplay, 0);


    },
    iScrollCallBack:function(currentPageIdx,sizeOfPax){

		var idx = currentPageIdx;
		var totalCustomers = jQuery(".seatmapPaxDetails").length;
		var __this = this;

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
            if (__this.legendAllowedPax.indexOf(parseInt(jQuery(".seatmapPaxDetails").eq(idx - 1).attr("data-selectedCPR-custIndex"))) != "-1") {

              __this.allowSelectBasinetSeat = true;
            } else {
              __this.allowSelectBasinetSeat = false;
            }
            __this.totalcustomerForCpr = jQuery("#rightArrow").attr("data-totalPax");
		    				//var totalCustomers = parseInt(jQuery("li#paxSeat0").attr("tc"));
		    				var totalCustomers = parseInt(jQuery("#rightArrow").attr("data-tcForHeader"));

            jQuery(".seatmapPaxDetails").eq(idx - 1).find("input[type='radio']").prop("checked", true);

            if (__this.storePreviousPax == undefined) {
              __this.replaceDefaultSelectedSeat(idx - 1, "someThing");
            } else {
              __this.replaceDefaultSelectedSeat(idx - 1);
            }

            __this.storePreviousPax = idx - 1;

            __this.refreshSeatmap({
              id: idx
            });




		    				/* For bassinet not to select if pax not associated with infant*/
            jQuery("td[data-input-seatcharctics]").each(function() {

              if (jQuery(this).attr("data-input-seatcharctics").search(/,b,/gi) != -1 && !jQuery(this).hasClass("occupied") && !jQuery(this).hasClass("selected") && !jQuery(this).hasClass("is-current") && !(jQuery(this).children().length == 1) && !jQuery(this).children("span").hasClass("alreadyOccupied")) {
                if (!__this.allowSelectBasinetSeat) {
		    		      				jQuery(this).children("input").addClass("displayNone");
		    		      				jQuery(this).children("span").addClass("bassinetFilled");
                } else {
				    					jQuery(this).children("input").removeClass("displayNone");
			    		      			jQuery(this).children("span").removeClass("bassinetFilled");
				    				}
		    		      		 }

		    		      	 });
          /*SEATMAP*/



    },

    $displayReady: function() {

    	 this.$logInfo('SeatMap::Entering $displayReady function');

        /* make seat class to seatselected instead of seatNotAvailable if the seat number of customer and seat number of seat map matches */
        var totalCustomers =   jQuery("#rightArrow").attr("data-totalPax");
        totalCustomers = this.getIntValue(totalCustomers);
      var jj = 0;

      for (var i = 0; i < totalCustomers; i++, jj++) {

        if (jQuery('#seatNb_' + i) == null || jQuery('#seatNb_' + i) == undefined || jQuery('#seatNb_' + i).length == 0) {
        	jj--;
        	continue;
        }

        var seat = jQuery('#seatNb_' + i).html();

        while (seat.substr(0, 1) == '0' && seat.length > 1) {
          seat = seat.substr(1, 9999);
          }

        jQuery('#0' + seat).parent().addClass("selected"); //seatselected
        if (jQuery('#0' + seat).parent().hasClass("occupied")) {
          jQuery('#0' + seat).removeClass("occupied");

          jQuery('#0' + seat).parent().attr("data-pax-position", jj + 1);
          jQuery('#0' + seat).html(jj + 1);
        }else
        {
        	jQuery('#0' + seat).parent().attr("data-pax-position", jj + 1);
        	jQuery('#0' + seat).parent().addClass("occupied");
            jQuery('#0' + seat).parent().html("<span id=\"0"+seat+"\" type=\"button\" class=\"seatNotAvailable\">"+(jj + 1)+"</span>");
          }
          /* this variable stores the inital seat allocated for the pax */
        this.storeInitialSeat[i] = {
          "custIndex": i,
          "seatNumber": '0' + seat
        };
        }

        var psngrArray = $('input[type=radio]');
        var index = 0;
      index = this.paxIndex + 1;
      var psngrValue = $('#' + psngrArray[this.paxIndex].id).val();

    	var seatArray = $("[id*='seatNb']");
      var seatValue = $('#' + seatArray[this.paxIndex].id).html();


    	  /* This for loop used to loop on storeseatMap variable which store the seat map selected for each customer  */
    	//alert(this.storeseatMap);
      for (var k = 0; this.storeseatMap && k < this.storeseatMap.length; k++) {
        if (this.storeseatMap[k]) {
          if (this.storeInitialSeat[k].seatNumber != "Not Added") {
            jQuery('#' + this.storeInitialSeat[k].seatNumber).removeClass("seatselected");
    	      }
          if (!jQuery('#' + this.storeInitialSeat[k].seatNumber).hasClass("galley")) {
            jQuery('#' + this.storeInitialSeat[k].seatNumber).val(" ");
          }

          jQuery('#seatNb_' + this.storeseatMap[k].custIndex).html(this.storeseatMap[k].seatNumber);

          if (jQuery('#' + this.storeseatMap[k].seatNumber).hasClass("seatNotAvailable")) {
            jQuery('#' + this.storeseatMap[k].seatNumber).removeClass("seatNotAvailable");
          }

          jQuery('#seatNb_' + this.storeseatMap[k].custIndex).addClass("seatNo");
          jQuery('#' + this.storeseatMap[k].seatNumber).addClass("seatselected");
          jQuery('#' + this.storeseatMap[k].seatNumber).val(this.getIntValue(this.storeseatMap[k].custIndex) + 1);
        }

      }
      if (jQuery('#upperDeckRows .selected').length > 0) {
        var seatnb = [];
        jQuery('#upperDeckRows .selected').each(function() {
  				seatnb.push(jQuery(this).find("span").attr('id'))
  				    });

        for (var j = 0; j < seatnb.length; j++) {
          if (seatnb[j] == seatValue) {
  						this.onViewUpperDeck();
  				}
    			}
  		}

    	/*For making occupied bassinet seat to un-occupied, PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
      var bsinettdNumbers = [];
      var lineNumber = 0;
      var totalNumberTDS = 0;
      var bassinetRowHasToAddBefore = "";

      jQuery("td[data-input-seatcharctics]").each(function() {

      		 /*PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/
        if (jQuery(this).attr("data-input-seatcharctics").search(/,b,/gi) != -1) {
      			/*push bassinet seatdetails to array, only bassinet seat shown to these TDS*/
      			bsinettdNumbers.push(jQuery(this).index());
          lineNumber = jQuery(this).parent().children().eq(0).text();
          bassinetRowHasToAddBefore = jQuery(this);

      			/*Find out total td count, condition to execute only when variable is 0 -- changed because from lower to upper deck td count diff
      			 * because seat amp diff from deck to deck
      			if(!totalNumberTDS)
      			{*/
          totalNumberTDS = jQuery(this).parent().children().length;
      			/*}*/
      		 }
      		 /*If line number where bassinet found to new one changed means bassinet row has to included*/
        var tr_td_Html = "";
        if (lineNumber != jQuery(this).parent().children().eq(0).text() && bsinettdNumbers.length > 0) {
          for (var i = 0; i < totalNumberTDS; i++) {
            if (bsinettdNumbers.indexOf(i) != -1) {
              tr_td_Html += "<td class=\"bassinetReference\"></td>";
            } else {
              if (bassinetRowHasToAddBefore.parent().children().eq(i).hasClass("aisle")) {
                tr_td_Html += "<td class=\"aisle\"><span class=\"seatNotAvailable\">a</span></td>";
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
      		/*END PTR 08303390 [Medium]: SQ mob-UAT-R15:MCI - The Bassinet seat icon is not showing correctly in the seatmap*/

        if (jQuery(this).attr("data-input-seatcharctics").search(/,b,/gi) != -1 && jQuery(this).hasClass("occupied") && !jQuery(this).hasClass("selected") && jQuery(this).children().length == 1 && jQuery(this).children("span").hasClass("seatNotAvailable")) {
      			 jQuery(this).removeClass("occupied");
      			 jQuery(this).children("span").removeClass("seatNotAvailable").addClass("bassinetFilled alreadyOccupied");
      		 }

      	 });

    	// chk whether useragent is iphone or ipod, to fix the position of window
      if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
  	      var a = function() {
    				var b = $(window).scrollTop();
          var d = $("#scroller-anchor").offset({
            scroll: false
          }).top;
          var c = $("#scroller");
          if (b > d) {
            c.css({
              position: "fixed",
              top: "-9px"
            })
            c.css({
              position: "fixed",
              left: "-1px"
            })
          } else {
            if (b <= d) {
              c.css({
                position: "relative",
                top: ""
              })
              c.css({
                position: "fixed",
                left: "-1px"
              })
            }
          }
        };
        $(window).scroll(a);
        a()
        }

        /*var myScrollSeatmap = null;
		var myScrollSeatmap = new iScroll('iScrollWrapper',{

			onBeforeScrollStart: function (e) {
				var target = e.target;
				while (target.nodeType != 1)
				target = target.parentNode;

				if (target.tagName != 'INPUT')
					e.preventDefault();
			},
			hScrollbar:false
		});
		document.getElementById("scroller1").addEventListener('touchmove', function(e){ e.preventDefault(); });*/

  	  this.loaded = true;


    },

    replaceDefaultSelectedSeat: function(currentID, firstTimeCall) {
    	 this.$logInfo('SeatMap::Entering replaceDefaultSelectedSeat function');
      var custIndex = parseInt(jQuery(".seatmapPaxDetails").eq(currentID).find("input[type='radio']").attr("id"));
      var seat = jQuery('#seatNb_' + custIndex).html();
		/*if(jQuery('#'+seat).parent().hasClass("occupied") && jQuery('#seat').parent().hasClass("selected"))
		{*/

      while (seat.substr(0, 1) == '0' && seat.length > 1) {
        seat = seat.substr(1, 9999);
        }
      seat = "0" + seat;

      jQuery('#' + seat).parent().attr("data-seatinfo-price", "FREE");
      jQuery('#' + seat).parent().removeClass("occupied selected");
      jQuery('#' + seat).parent().addClass("is-current");

      var seatCharecterestics = jQuery('#' + seat).parent().attr("data-input-seatcharctics");
      var onClickFunc = jQuery('#' + seat).parent().attr("data-seatmapsel_onclick");
      /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
      jQuery('#' + seat).parent().append("<input " + onClickFunc + " name=\"" + seatCharecterestics + "\" id=\"" + seat + "\" type=\"button\" class=\"seatAvailable displayNone\" >");
      var displayIndex = jQuery("#seatMapMainSection input:checked").parent().index();
			//jQuery('#'+seat).parent().append("<span>"+jQuery('#'+seat).parent().attr("data-pax-position")+"</span>");
      jQuery('#' + seat).parent().append("<span>" + (parseInt(displayIndex) + 1) + "</span>");
      jQuery('#' + seat).remove();
		/*}*/

		/*if(this.storePreviousPax != (idx-1))
		{*/
      if (firstTimeCall == undefined) {
        custIndex = parseInt(jQuery(".seatmapPaxDetails").eq(this.storePreviousPax).find("input[type='radio']").attr("id"));
        seat = jQuery('#seatNb_' + custIndex).html();

        while (seat.substr(0, 1) == '0' && seat.length > 1) {
          seat = seat.substr(1, 9999);
        }
        seat = "0" + seat;

        jQuery('#' + seat).parent().addClass("occupied selected");
        jQuery('#' + seat).parent().removeClass("is-current");
        jQuery('#' + seat).parent().removeAttr("data-seatinfo-price");
				//var tempHtml="<span id=\""+seat+"\" type=\"button\" class=\"seatNotAvailable\">"+jQuery('#'+seat).parent().attr("data-pax-position")+"</span>";
        displayIndex = jQuery(".seatmapPaxDetails").eq(this.storePreviousPax).index();
        var tempHtml = "<span id=\"" + seat + "\" type=\"button\" class=\"seatNotAvailable\">" + (parseInt(displayIndex) + 1) + "</span>";
        jQuery('#' + seat).html("");
        jQuery('#' + seat).parent().html(tempHtml);
			}


		/*}*/
    },

    iScrollLoad: function() {
    	/*if(jQuery(".scrollable-content").children().length == 2)
    	{
    		jQuery(".scrollable-content").children(":last-child").remove();
    	}

    	myScrollSeatmap=null;
		myScrollSeatmap = new iScroll('iScrollWrapper', {
		    //useTransform: true,
	        onBeforeScrollStart: function (e) {

	        	var target = e.target;
	            while (target.nodeType != 1)
	            {
	            	target = target.parentNode;
	            }
	            if (target.tagName != 'INPUT')
	            {
	            	e.preventDefault();
	            }
	        }
	    });//wrapper

		setTimeout(function(){
			myScrollSeatmap.refresh();
		},100);*/

    },

    __getPage: function() {
      try {
        this.$logInfo('SeatMap ::Entering __getPage function');
        return jQuery('#' + this.data.pageID);
      } catch (exception) {
         this.$logError(
             'SeatMap::An error occured in __getPage function',
             exception);
         }
       },

       // Function to chk whether it is exit row seat
    isExitSeat: function(charArray) {
			 this.$logInfo('SeatMap::Entering isExitSeat function');
      var test = jQuery.inArray("E", charArray)
      if (test == -1) {
				return false;
      } else {
				return true;
			}
		},

        // Function to chk whether it is basinet seat
    isBasinetSeat: function(charArray) {
			 this.$logInfo('SeatMap::Entering isBasinetSeat function');
      var test = jQuery.inArray("B", charArray)
      if (test == -1) {
				return false;
      } else {
				return true;
			}
		},

    // Function used to switch the slider in and out
    onPsngrSlide: function(evt) {
  		 this.$logInfo('SeatMap::Entering onPsngrSlide function');
  		var label = this.moduleRes.res.SeatMap.label;
      if (jQuery('#innerDiv').hasClass('slideInner')) {
  			jQuery('#innerDiv').removeClass('slideInner');
  			jQuery('#innerDiv').addClass('slideOuter');
        jQuery('#close').html("(" + label.Close + ")");
      } else {
  			jQuery('#innerDiv').removeClass('slideOuter');
  			jQuery('#innerDiv').addClass('slideInner');
        jQuery('#close').html("(" + label.Change + ")");
  		}
  	},

    refreshSeatmap: function(args) {
  		 this.$logInfo('SeatMap::Entering refreshSeatmap function');
      var seatValue = jQuery("#mycarousel li").eq(args.id - 1).find("span").eq(2).html();
  		//alert(seatValue);


      if (jQuery('#upperDeckRows .is-current').length > 0) {
  	    		var seatnb = [];
        jQuery('#upperDeckRows .is-current').each(function() {
          seatnb.push(jQuery(this).find("input").attr('id'))
        });

        for (var j = 0; j < seatnb.length; j++) {
          if (seatnb[j] == seatValue) {
            this.onViewUpperDeck();

          }
        }
      }

      if (jQuery('#lowerDeckRows .is-current').length > 0) {
        var seatnb = [];
        jQuery('#lowerDeckRows .is-current').each(function() {
          seatnb.push(jQuery(this).find("input").attr('id'))
        });

        for (var j = 0; j < seatnb.length; j++) {
          if (seatnb[j] == seatValue) {
	  	  						this.onViewLowerDeck();

	  	  				}
  	    			}
  	  		}



  	},

	// Function used to select the passenger in slide and assigning the selected seat
    onPsngrClick: function(evt, args) {
    	 this.$logInfo('SeatMap::Entering onPsngrClick function');
    	this.paxIndex = args.id;


      var _this = this;
      var id = jQuery('#' + args.id);
      var index = 0;
      index = this.paxIndex + 1;
      var seatId = "seatNb_" + args.id;
      var custSeatId = jQuery('#' + seatId);
      var seat = custSeatId.html();
      $(id).prop('checked', true);
      jQuery('#outerSpan').html(index + ". " + id.val());
      //_this.onPsngrSlide(_this);
      /*refresh the template section on each pax selection  and retrieve the corresponding seat map*/
    	_this.$refresh("SeatMapSection");
    	jQuery('#custSeat').html(seat);

    },

    revertSeat: function(evt) {
    	 this.$logInfo('SeatMap::Entering revertSeat function');
    	jQuery(".is-current").find("input").removeClass("displayNone");
    	jQuery(".is-current").find("span").html("");
    	jQuery(".is-current").removeClass("is-current");
    	//this.$load("checkin/SeatMap");

      jQuery(".occupied.selected").each(function() {

        var tempSeat = jQuery(this).find("span").attr("id");
    		jQuery(this).html("");
    		/*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
        jQuery(this).append("<input " + jQuery(this).attr("data-seatmapsel_onclick") + " name=\"" + jQuery(this).attr("data-input-seatcharctics") + "\" id=\"" + tempSeat + "\" type=\"button\" class=\"seatAvailable\" >");
    		jQuery(this).append("<span></span>");
        jQuery(this).attr("data-seatinfo-price", "FREE");
    	});
    	jQuery(".occupied.selected").removeClass("occupied selected");

    	var currentPosiotion =  jQuery("#seatMapMainSection input:checked").parent().index();
      for (var i = 0; i < this.storeInitialSeat.length; i++) {
        if (this.storeInitialSeat[i]) {
    			//var seat = jQuery('#seatNb_'+i).html();
    			var seat = this.storeInitialSeat[i].seatNumber;

          while (seat.substr(0, 1) == '0' && seat.length > 1) {
            seat = seat.substr(1, 9999);
    		    }
          seat = "0" + seat;

          jQuery('#' + seat).parent().removeClass("is-current");
          jQuery('#' + seat).parent().addClass("occupied selected");
          jQuery('#' + seat).parent().removeAttr("data-seatinfo-price");
          var tempHtml = "<span id=\"" + seat + "\" type=\"button\" class=\"seatNotAvailable\">" + jQuery('#' + seat).parent().attr("data-pax-position") + "</span>";
          jQuery('#' + seat).parent().html("").html(tempHtml);

          jQuery('#seatNb_' + i).html(seat);
          this.storeseatMap[i] = {
            "custIndex": i,
            "seatNumber": seat
          };

        }

      }

      this.replaceDefaultSelectedSeat(currentPosiotion, "someThing");
      this.refreshSeatmap({
        id: currentPosiotion + 1
      });
      this.storePreviousPax = currentPosiotion;

    },

	// function used to select the seat when clicked on it
    selectSeat: function(evt, args) {
      this.$logInfo('SeatMap::Entering selectSeat function'); //alert(JSON.stringify(args));

	  /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
      if (jQuery('#' + args.seatNumber).parent().hasClass("selected") || jQuery('#' + args.seatNumber).hasClass("seatNotAvailable") || jQuery('#' + args.seatNumber).parent().hasClass("bassinetFilled") || (this.allowSelectBasinetSeat == false && jQuery('#' + args.seatNumber).parent().attr("data-input-seatcharctics").split(",").indexOf("B") != "-1")) {
        return false;
      }

      var custIndex =  jQuery("#seatMapMainSection input:checked").attr("id");
      var displayIndex = jQuery("#seatMapMainSection input:checked").parent().index();
      if (!custIndex) {
        custIndex = 0;
      }
      var seatNbCustIndex = this.getIntValue(jQuery('#' + args.seatNumber).val());
      if (!this.getIntValue(custIndex) + 1 == seatNbCustIndex) {
        return false;
      }

      var oldSeat = jQuery('#seatNb_' + custIndex).html();
      while (oldSeat.substr(0, 1) == '0' && oldSeat.length > 1) {
        oldSeat = oldSeat.substr(1, 9999);
      }
      if (!jQuery('#seatNb_' + custIndex).hasClass("seatNo")) {
        //jQuery('#seatNb_'+custIndex).addClass("seatNo")
      }
      jQuery('#seatNb_' + custIndex).html(args.seatNumber);

      //jQuery('#custSeat').html(args.seatNumber);
      if (oldSeat != "Not Added") {
        jQuery('#0' + oldSeat).parent().removeClass("is-current");
        jQuery('#0' + oldSeat).removeClass("displayNone");
        if (jQuery('#0' + oldSeat).attr("name").split(",").indexOf("B") != -1) {
        	/*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
			//jQuery('#0'+oldSeat).removeClass("seatAvailable").addClass("bassinetSeat");
          jQuery('#0' + oldSeat).removeClass("seatAvailable").addClass("bassinet");
        }
      }
      jQuery('#' + args.seatNumber).parent().addClass("is-current");
      if (!jQuery('#0' + oldSeat).hasClass("galley")) {
        jQuery('#0' + oldSeat).next().html("");
      }
      jQuery('#' + args.seatNumber).next().html(this.getIntValue(displayIndex) + 1);
      jQuery('#' + args.seatNumber).addClass("displayNone");
      /* store the seat value of each pax in the global variable */
      this.storeseatMap[custIndex] = {
        "custIndex": custIndex,
        "seatNumber": args.seatNumber
      };
   },

    // Function used to save the selected seats for passengers
    onSaveSeat: function(evt, args) {
      this.$logInfo('SeatMap::Entering onSaveSeat function');
      evt.preventDefault();

      /* This is a temp array created for storage of allocated seats */
	  var allocatedSeats = this.moduleCtrl.getAllocatedSeats();
	  /* Allocated seat Json */
	  var allocatedJson = this.moduleCtrl.getAllocatedSeat();
	  var seatLoaded = this.moduleCtrl.getSeatNotLoaded();
      if (seatLoaded) {
        if (!jQuery.isUndefined(allocatedJson)) {

          for (var i = 0; i < allocatedJson.segmentInfos.length; i++) {
            var temp = allocatedJson.segmentInfos[i].seatResponseInfos[0];
            for (var j = 0; j < temp.passengerInfos.length; j++) {
                if (temp.ssrDataDetails[j] && temp.ssrDataDetails[j].seatNumber)
                allocatedSeats.push({
                  "primeId": temp.passengerInfos[j].IDSections[0].ID,
                  "Seat": temp.ssrDataDetails[j].seatNumber
                });
            }
          }
        }
	  	this.moduleCtrl.setSeatNotLoaded(false);
	  }

      if (jQuery.isUndefined(allocatedSeats)) {
        allocatedSeats = [];
	  }

      /*turn the background off */
      jQuery(document).scrollTop("0");
			//this.showOverlay(true);
      modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);

      var totalCustomers = this.totalcustomerForCpr;
      if (!totalCustomers) {
        totalCustomers = 1;
      }
      totalCustomers = this.getIntValue(totalCustomers);
      var ct = 0;
      var errors = [];
      var seatselection =  [];

      for (var i = 0; i < totalCustomers; i++) {

        if (jQuery('#seatNb_' + i) == null || jQuery('#seatNb_' + i) == undefined || jQuery('#seatNb_' + i).length == 0) {

          continue;
        }
        if (jQuery('#seatNb_' + i).html() && jQuery('#seatNb_' + i).html() != "Not Added") {
          var prodIndicator = jQuery('#seatNb_' + i).attr("name");
          var selectedSeat = jQuery('#seatNb_' + i).html();
          var seatChars = jQuery('#' + selectedSeat).attr("name");
          var substr = prodIndicator.split('_');
          var refQualifier = substr[1];
          var primeId = substr[2];
		  var saved = true;

          for (var j = 0; j < allocatedSeats.length; j++) {
            if (allocatedSeats[j].primeId == primeId) {
			allocatedSeats[j].Seat = selectedSeat;
			saved = false;
			}
		  }
          if (saved) {
            allocatedSeats.push({
              "primeId": primeId,
              "Seat": selectedSeat
            });
          }

          seatselection.push({
            "primeId": primeId,
            "refQualifier": refQualifier,
            "customer": i,
            "Seat": selectedSeat,
            "SeatCharacteristics": seatChars
          });
        } else if (jQuery('#seatNb_' + i).html() && jQuery('#seatNb_' + i).html() == "Not Added") {
          errors[0] = {
            "localizedMessage": this.uiErrors[25000012].localizedMessage,
            "code": this.uiErrors[25000012].errorid
          };
          //errors.push({"code":"", "localizedMessage":"Please Select seat for all the customer."});
        }
      }
      // function called to allocated seats
	  this.moduleCtrl.setAllocatedSeats(allocatedSeats);

      if (errors != null && errors.length > 0) {
    	  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
    	  jQuery('#splashScreen').hide();
        jQuery('#overlayCKIN').hide();
        this.moduleCtrl.displayErrors(errors, "seatErrors", "error");
        return null;
      }
      var selectedProdForSeatMap = this.moduleCtrl.getSelectedProductForSeatMap();
      // input json
      var allocateseatInput = {
        "selectedCPR": this.moduleCtrl.getSelectedPax(),
        "seatMapProdIndex": selectedProdForSeatMap.seatMapProdIndex,
        "seatselection": seatselection,
        "allocatedSeatJSON": this.moduleCtrl.getAllocatedSeat(),
        "seat": selectedProdForSeatMap.seat
      }

      /*we call the controller to retrive */
      if (allocateseatInput.seatselection != null && allocateseatInput.seatselection.length > 0) {
        this.moduleCtrl.allocateSeat(allocateseatInput);
      } else {
    	  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
    	  jQuery('#splashScreen').hide();
          jQuery('#overlayCKIN').hide();
    	  return false;
      }
    },

	// function used to get int value
    getIntValue: function(stringValue, radix) {
    	this.$logInfo('SeatMap::Entering getIntValue function');
    	var ValInInteger = 0;
      if (arguments.length == 1) {
        ValInInteger = parseInt(stringValue);
      } else {
        ValInInteger = parseInt(stringValue, radix);
      }
      return ValInInteger;
    },

	// function used to view upper deck
    onViewUpperDeck: function(evt, args) {
		try {
			this.$logInfo('SeatMap::Entering onViewUpperDeck function');

			jQuery('#lowerDeckTitle').show();
			jQuery('#upperDeckTitle').hide();
			jQuery('#upperDeckHeader').show();
			jQuery('#upperDeckFooter').show();
			jQuery('[id="upperDeckRows"]').show();
			jQuery('#lowerDeckHeader').hide();
			jQuery('#lowerDeckFooter').hide();
			jQuery('[id="lowerDeckRows"]').hide();
			this.iScrollLoad();
      } catch (exception) {
			    this.$logError(
					'SeatMap::An error occured in onViewUpperDeck function',
					exception);
		}
	},

	// function used to view lower deck
    onViewLowerDeck: function(evt, args) {
			try {
				this.$logInfo('SeatMap::Entering onViewLowerDeck function');

				jQuery('#lowerDeckTitle').hide();
				jQuery('#upperDeckTitle').show();

				jQuery('#upperDeckHeader').hide();
				jQuery('#upperDeckFooter').hide();
				jQuery('[id="upperDeckRows"]').hide();
				jQuery('#lowerDeckHeader').show();
				jQuery('#lowerDeckFooter').show();
				jQuery('[id="lowerDeckRows"]').show();

				this.iScrollLoad();
      } catch (exception) {
				this.$logError(
						'SeatMap::An error occured in onViewLowerDeck function',
						exception);
			}
		},

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('SeatMap::Entering onModuleEvent function');
        switch (evt.name) {
          case "server.error":
        	  modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        	  jQuery('#overlayCKIN').hide();
            jQuery('#splashScreen').hide();
            var errors = [];
            errors.push({
              "localizedMessage": this.uiErrors[21400069].localizedMessage,
              "code": this.uiErrors[21400069].errorid
            });
            this.moduleCtrl.displayErrors(errors, "seatErrors", "error");
            break;
            }
      } catch (exception) {
            this.$logError(
                 'SeatMap::An error occured in onModuleEvent function',
                  exception);
       }
     },

    onBackClick: function() {
       this.moduleCtrl.onBackClick();
       }
   }
});