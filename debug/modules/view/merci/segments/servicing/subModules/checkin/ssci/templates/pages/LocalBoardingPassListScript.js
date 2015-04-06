Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.LocalBoardingPassListScript',

	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.KarmaOnRemoveClick={};
	},

	$prototype: {
		$dataReady: function() {
			try {
				this.$logInfo('LocalBoardingPassListScript: Entering dataReady function ');

				this.utils.loadSwipeElements();

				var json = this.moduleCtrl.getModuleData();
				if (json.navigation == true) {
					if (json.result != null || json.result != undefined) {


						/*Begin : Removing Old Boarding Passes From the List*/
						var EnablePastDeletion = false;
						if(jsonResponse.data.framework.settings.siteDeletePastBP != undefined){
							EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastBP;
						}
						if(EnablePastDeletion){
							var saveChanges = false;
							if(!this.utils.isEmptyObject(json.result.boardingPassArray)){
								var currSvDate = new Date(jsonResponse.data.framework.date.date);
								for(var boardingPassIndex in json.result.boardingPassArray){
									var boardingPassDetails = json.result.boardingPassArray[boardingPassIndex];
									if(boardingPassDetails.arrDate != null && boardingPassDetails.arrDate != ""){
										var tripArDate = new Date(boardingPassDetails.arrDate);
										if((tripArDate-currSvDate) < 0){
											saveChanges = true;
											delete json.result.boardingPassArray[boardingPassIndex];
											//jsonResponse.ui.cntTrip = jsonResponse.ui.cntTrip - 1;
										}
									}
								}
							}
							if(saveChanges){
								this.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, json.result, "overwrite", "json");
							}



							var count = 0;
							if (!this.utils.isEmptyObject(json.result)) {
								count += Object.keys(json.result.boardingPassArray).length;
							};
							if(jsonResponse.ui !=undefined && jsonResponse.ui !=null){
								jsonResponse.ui.cntBoardingPass=count;
							}
						}
						/*End : Removing Old Boarding Passed From the List*/


						this.jsonObj = json.result;
						if ((!this.utils.isEmptyObject(this.jsonObj)) && (this.jsonObj != null)) {
							this.mbpList = this.jsonObj.boardingPassArray;
							this.params = this.jsonObj.config;
							this.label = this.jsonObj.bpLabels;
							this.storage = true;
						}
					}
				}

				this.flightWiseDocs = {};

				for (var prodID in this.mbpList) {
					var flightID = this.mbpList[prodID].flightID;

					if (jQuery.isUndefined(this.flightWiseDocs[flightID])) {
						this.flightWiseDocs[flightID] = {};
						this.flightWiseDocs[flightID][prodID] = this.mbpList[prodID];
					} else {
						this.flightWiseDocs[flightID][prodID] = this.mbpList[prodID];
					}
				}

				//To sort the flights based on the departure dates

				var flightList = [];

				for (var flight in this.flightWiseDocs) {
					flightList.push(flight);
				}

				var _this = this;
				flightList.sort(function(a, b) {
					var dateA = new Date(_this.flightWiseDocs[a][Object.keys(_this.flightWiseDocs[a])[0]].depDate);
					var dateB = new Date(_this.flightWiseDocs[b][Object.keys(_this.flightWiseDocs[b])[0]].depDate);
					return dateA - dateB //sort by date ascending
				})

				this.sortedFlightList = flightList;

			} catch (_ex) {
				this.$logError('LocalBoardingPassListScript: an error has occured in dataReady function');
			}
		},


		$displayReady: function() {
			try {
				this.$logInfo('LocalBoardingPassListScript: Entering displayReady function ');

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
				}, 400);

				jQuery(".carrousel-full").swipe({
					swipeLeft: function(event, direction, distance, duration, fingerCount) {

						jQuery(".removeTripButton").each(function() {
							$(this).addClass("displayNone");
						});


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

						jQuery(".removeTripButton").each(function() {
							$(this).addClass("displayNone");
						});

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


			} catch (exception) {
				this.$logError('LocalBoardingPassListScript::An error occured in displayReady function',
					exception);
			}
		},

		$viewReady: function() {
			this.$logInfo('LocalBoardingPassListScript::Entering Viewready function');
			try {
	            /*BEGIN : JavaScript Injection(CR08063892)*/
	            if (typeof genericScript == 'function') {
	    			genericScript({
	    				tpl:"LocalBoardingPassList",
	    				data:this.data
	    			});
	            }
	            /*END : JavaScript Injection(CR08063892)*/
			} catch (exception) {
				this.$logError('LocalBoardingPassListScript::An error occured in Viewready function', exception);
			}
		},



		displayBPforSelectedFlights: function(event, args) {
			this.$logInfo('LocalBoardingPassListScript::Entering displayBPforSelectedFlights function');
			try {
				//To Check if the remove icon is enabled
				var flight = args.flight;
				var removeButton = "remove_" + flight;
				if (!($('#' + removeButton).hasClass("displayNone"))) {
					return null;
				}

				var docs = args.docs;
				var jsonBP = this.moduleCtrl.getModuleData();
				jsonBP.boardingPasses = docs;
				jsonBP.bpParams = this.params;
				jsonBP.bpLabels = this.label;
				this.moduleCtrl.navigate(null, "merci-checkin-MSSCILocalBoardingPass_A");
			} catch (exception) {
				this.$logError('LocalBoardingPassListScript::An error occured in displayBPforSelectedFlights function', exception);
			}
		},

		getWeekDayUTC: function(date) {
			try {
				this.$logInfo('Entering getWeekDayUTC function');
				var weekday = new Array(7);
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";

				return weekday[date.getUTCDay()];
			} catch (exception) {
				this.$logError('An error occured in getWeekDayUTC function', exception);
			}

		},

		getMonthUTC: function(date) {
			try {
				this.$logInfo('Entering getMonth function');
				var myProp = "";
				if (date.getUTCMonth() == 0) {
					myProp = "Jan"
				};
				if (date.getUTCMonth() == 1) {
					myProp = "Feb"
				};
				if (date.getUTCMonth() == 2) {
					myProp = "Mar"
				};
				if (date.getUTCMonth() == 3) {
					myProp = "Apr"
				};
				if (date.getUTCMonth() == 4) {
					myProp = "May"
				};
				if (date.getUTCMonth() == 5) {
					myProp = "Jun"
				};
				if (date.getUTCMonth() == 6) {
					myProp = "Jul"
				};
				if (date.getUTCMonth() == 7) {
					myProp = "Aug"
				};
				if (date.getUTCMonth() == 8) {
					myProp = "Sep"
				};
				if (date.getUTCMonth() == 9) {
					myProp = "Oct"
				};
				if (date.getUTCMonth() == 10) {
					myProp = "Nov"
				};
				if (date.getUTCMonth() == 11) {
					myProp = "Dec"
				};

				return myProp;
			} catch (exception) {
				this.$logError(
					'An error occured in getMonth function',
					exception);
			}

		},

		onLongPressFlight: function(event, args) {
			this.$logInfo('LocalBoardingPassListScript::Entering onLongPressFlight function');
			try {

				event.preventDefault();
				var trip_longpressed = args.flight;
				var buttonid = "remove_" + trip_longpressed;
				$('#' + buttonid).removeClass("displayNone");
			} catch (exception) {
				this.$logError('LocalBoardingPassListScript::An error occured in onLongPressFlight function', exception);
			}
		},

		onRemoveClick: function(event, args) {
			this.$logInfo('LocalBoardingPassListScript::Entering onRemoveClick function');
			try {
				event.preventDefault();
				var prodIDstoRemove = Object.keys(args.mbps);
				var _this = this;

				jQuery(document).scrollTop("0");

				jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
				jQuery("#cancelConf").removeClass("displayNone").addClass("displayBlock");

				jQuery("#cancelConf #cancelButton").click(function() {
					prodIDstoRemove = null;
					jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
					jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");
					_this.KarmaOnRemoveClick["T1"] = "Cancelled";	// For TDD
				});

				jQuery("#cancelConf #okButton").click(function() {
					jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
					jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");

					if (!_this.utils.isEmptyObject(_this.mbpList)) {

						for (var key in _this.mbpList) {
							if (prodIDstoRemove.indexOf(key) != -1) {
								delete _this.mbpList[key];
								_this.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, _this.jsonObj, "overwrite", "json");
								_this.KarmaOnRemoveClick["T1"] = "Boarding Pass removed successfully";  // For TDD
								if (jsonResponse.ui.cntBoardingPass > 0) {
									_this.$json.setValue(jsonResponse.ui, "cntBoardingPass", jsonResponse.ui.cntBoardingPass - 1);
								}

							}
						}
					}

					if (jsonResponse.ui.cntBoardingPass == 0) {
						_this.utils.sendNavigateRequest(null, 'gettripFlow.action', _this);
					} else {
						_this.flightWiseDocs = {};
						for (var prodID in _this.mbpList) {
							var flightID = _this.mbpList[prodID].flightID;
							if (jQuery.isUndefined(_this.flightWiseDocs[flightID])) {
								_this.flightWiseDocs[flightID] = {};
								_this.flightWiseDocs[flightID][prodID] = _this.mbpList[prodID];
							} else {
								_this.flightWiseDocs[flightID][prodID] = _this.mbpList[prodID];
							}
						}
						var flightList = [];
						for (var flight in _this.flightWiseDocs) {
							flightList.push(flight);
						}
						flightList.sort(function(a, b) {
							var dateA = new Date(_this.flightWiseDocs[a][Object.keys(_this.flightWiseDocs[a])[0]].depDate);
							var dateB = new Date(_this.flightWiseDocs[b][Object.keys(_this.flightWiseDocs[b])[0]].depDate);
							return dateA - dateB //sort by date ascending
						})
						_this.sortedFlightList = flightList;
						_this.$refresh();
					}
				});

			} catch (exception) {
				this.$logError('LocalBoardingPassListScript::An error occured in onRemoveClick function', exception);
			}

		},
        onBackClick: function() {
            this.$logInfo('ModuleCtrl::Entering onBackClick function');
            try {
              window.history.back();
            } catch (exception) {
              this.$logError('ModuleCtrl::An error occured in onBackClick function', exception);
            }

		}


	}
})