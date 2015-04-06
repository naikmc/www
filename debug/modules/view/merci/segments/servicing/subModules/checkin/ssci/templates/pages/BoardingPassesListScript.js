Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.BoardingPassesListScript',

	$dependencies: [
	    'modules.view.merci.common.utils.MerciGA'
	],

	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.KarmaDisplayReady={};
	},

	$prototype: {
		$dataReady: function() {
			try {
				this.$logInfo('BoardingPassesListScript: Entering dataReady function ');

				var BoardingPassesListRespDtls = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.requestParam.BPResponseDetails;
				this.requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.requestParam;
				this.label = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.labels;
				this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.siteParam;
				this.parameters = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.parameters;
				this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPassesList_A.errorStrings;

				this.moduleCtrl.setHeaderInfo({
					title: this.label.Title,
					bannerHtmlL: this.requestParam.bannerHtml,
					homePageURL: this.siteParams.homeURL,
					showButton: true
				});

				var cpr = this.moduleCtrl.getCPR();
				var selectedCPR = this.moduleCtrl.getSelectedCPR();
				var journey = selectedCPR.journey;

				var deliveredDocuments = this.requestParam.BPResponseDetails.deliveredDocuments;

				this.flightWiseDocs = {};

				for (var i = 0; i < deliveredDocuments.length; i++) {
					var prodID = deliveredDocuments[i].products[0];
					var PaxIDandflightID = this.moduleCtrl.findPaxFlightIdFrmProductId(cpr[journey], prodID);
					var flightID = PaxIDandflightID.split("~")[1];
					if (jQuery.isUndefined(this.flightWiseDocs[flightID])) {
						this.flightWiseDocs[flightID] = [];
						this.flightWiseDocs[flightID].push(deliveredDocuments[i]);
					} else {
						this.flightWiseDocs[flightID].push(deliveredDocuments[i]);
					}

				}

				this.moduleCtrl.setFlightWiseDocs(this.flightWiseDocs);

			} catch (_ex) {
				this.$logError('BoardingPassesListScript: an error has occured in dataReady function');
			}
		},


		$displayReady: function() {
			try {
				this.$logInfo('BoardingPassesListScript: Entering displayReady function ');

				if (this.data.NotAllBoardingPassIssued == true) {
					var errors = [];
					errors.push({
						"localizedMessage": errorStrings[25000080].localizedMessage,
						"code": errorStrings[25000080].errorid
					});

					this.moduleCtrl.displayErrors(errors, "boardingListErrorMsgs", "error");
                    
                    //For TDD
					this.KarmaDisplayReady["message"] = "All Boarding Passes Cant Be Issued";
				}
				this.data.NotAllBoardingPassIssued == false;

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

				/*For local storage*/
				var boardingPassRespDtls = this.requestParam.BPResponseDetails;
				var deliveredDocuments = boardingPassRespDtls.deliveredDocuments;
				this.moduleCtrl.boardingPassLocalStorage(deliveredDocuments);
				/*End For local storage*/

			} catch (exception) {
				this.$logError('BoardingPassesListScript::An error occured in displayReady function',
					exception);
			}
		},

		$viewReady: function() {

			this.$logInfo('BoardingPassesListScript::Entering viewReady function');
			try {
				var _thisClasses = this.moduleCtrl;
				jQuery("#listboxa:first-child").addClass("is-selected");
				var len = document.querySelectorAll("#listboxa>li").length;
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
					_thisClasses.setWarnings("");
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


	            /*GOOGLE ANALYTICS */
	              if (this.moduleCtrl.getEmbeded()) {
	                jQuery("[name='ga_track_pageview']").val("Boarding Pass List");
	                window.location = "sqmobile" + "://?flow=MCI/pageloaded=BoardingPassList";

	              } else {
	                var GADetails = this.moduleCtrl.getGADetails();



	                this.__ga.trackPage({
	                  domain: GADetails.siteGADomain,
	                  account: GADetails.siteGAAccount,
	                  gaEnabled: GADetails.siteGAEnable,
	                  page: 'Boarding Pass List',
	                  GTMPage: 'Boarding Pass List'
	                });
	              }
	              /*GOOGLE ANALYTICS */
	              /*BEGIN : JavaScript Injection(CR08063892)*/
	              if (typeof genericScript == 'function') {
	      			genericScript({
	      				tpl:"BoardingPasssesList",
	      				data:this.data
	      			});
	              }
	              /*END : JavaScript Injection(CR08063892)*/

			} catch (exception) {
				this.$logError('BoardingPassesListScript::An error occured in viewReady function', exception);
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

		displayBPforSelectedFlights: function(event, args) {
			this.$logInfo('BoardingPassesListScript::Entering displayBPforSelectedFlights function');
			try {
				var selectedFlight = args.flightID;
				this.moduleCtrl.setSelectedFlightforMBP(selectedFlight);
				this.moduleCtrl.navigate(null, "merci-checkin-MSSCIBoardingPass_A");
			} catch (exception) {
				this.$logError('BoardingPassesListScript::An error occured in displayBPforSelectedFlights function', exception);
			}
		}

	}
});