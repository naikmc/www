Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MTripListScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
	},

	$statics: {
		RECLOC_MAXSIZE: 6,
		TICKET_MAXSIZE: 13
	},

	$prototype: {

		$dataReady: function() {
			try {
				this.$logInfo('MTripListScript: Entering dataReady function ');
				this.utils.loadSwipeElements();

				if (this.utils.isRequestFromApps() == true) {
					var json = this.moduleCtrl.getModuleData();
					if (json.navigation == true || (json.result != null || json.result != undefined)) {

						/*Begin : Removing Old Trip From the List*/
						var EnablePastDeletion = false;
						if(jsonResponse.data.framework.settings.siteDeletePastTrip != undefined){
							EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastTrip;
						}
						if(EnablePastDeletion){
							var saveChanges = false;

							if(!this.utils.isEmptyObject(json.result.detailArray)){
								var currSvDate = new Date(jsonResponse.data.framework.date.date);
								for(var pnrDetailsIndex in json.result.detailArray){
									var pnrDetails = json.result.detailArray[pnrDetailsIndex];
									if(!this.utils.isEmptyObject(pnrDetails.segmentDetails) && (pnrDetails.segmentDetails.length > 0)
											&& !this.utils.isEmptyObject(pnrDetails.segmentDetails[pnrDetails.segmentDetails.length-1])){
										var segmentDetails = pnrDetails.segmentDetails[pnrDetails.segmentDetails.length-1];
										if(segmentDetails.arrDate != null && segmentDetails.arrDate != ""){
											var tripArDate = new Date(segmentDetails.arrDate);
											if((tripArDate-currSvDate) < 0){
												saveChanges = true;
												delete json.result.detailArray[pnrDetailsIndex];

											}
										}
									}
								}
							}
							if(saveChanges){
								this.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, json.result, "overwrite", "json");
								var count = 0;
								if (!this.utils.isEmptyObject(json.result)) {
									count += Object.keys(json.result.detailArray).length;
								};
								if(jsonResponse.ui !=undefined && jsonResponse.ui !=null){
									jsonResponse.ui.cntTrip=count;
								}
							}
						}
						/*End : Removing Old Trip From the List*/





						this.jsonObj = json.result;
						if ((!this.utils.isEmptyObject(this.jsonObj)) && (this.jsonObj != null)) {
							this.pnrList = this.jsonObj.detailArray;
							this.labels = this.jsonObj.labels;
							this.request = this.jsonObj.pageTicket;
							this.reply = "";
							this.storage = true;
							this.config = this.jsonObj.config;
						}

					} else {
						this.storage = false;
						this.model = this.moduleCtrl.getModuleData().MTripList;
						this.config = this.model.config;
						this.labels = this.model.labels;
						this.request = this.model.request;
						this.reply = this.model.reply;
						this.list = this.moduleCtrl.getModuleData().list;
						this.pnrList = this.list.tripList.detailArray;
					}
				} else {
					this.model = this.moduleCtrl.getModuleData().MTripList;
					this.config = this.model.config;
					this.labels = this.model.labels;
					this.request = this.model.request;
					this.reply = this.model.reply;
					this.list = this.moduleCtrl.getModuleData().list;
					this.pnrList = this.list.tripList.detailArray;
					this.storage = false;
				};

				this.data.messages = this.utils.readBEErrors(this.reply.errors);


				//To sort the trips based on departure date
				var pNRsToSort = [];
				for (var pnr in this.pnrList) {
					pNRsToSort.push(pnr);
				}
				var _this = this;
				pNRsToSort.sort(function(a, b) {
					var dateA = new Date(_this.pnrList[a].BDate);
					var dateB = new Date(_this.pnrList[b].BDate);
					return dateA - dateB //sort by date ascending
				})

				this.sortedPNRs = pNRsToSort;

			} catch (_ex) {
				this.$logError('MTripListScript: an error has occured in dataReady function');
			}

		},

		$displayReady: function() {
			try {
				this.$logInfo('MTripListScript: Entering displayReady function ');

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
				this.$logError('MTripListScript::An error occured in displayReady function',
					exception);
			}
		},

		$viewReady: function() {
			this.$logInfo('MTripListScript::Entering Viewready function');

			$('body').attr('id', 'getTripList');
			document.body.className = 'pnr-retrieve list';
			this.moduleCtrl.setHeaderInfo({
				title: this.labels.tx_merci_text_home_home,
				bannerHtmlL: this.reply.bannerHtml,
				homePageURL: this.config.homeURL,
				showButton: true,
				companyName: this.config.sitePLCompanyName
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MTripList",
						data:this.data
					});
			}
		},

		getWeekDayUTC: function(date) {
			try {
				this.$logInfo('MTripListScript: Entering getWeekDayUTC function');
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
				this.$logError(
					'MTripListScript: An error occured in getWeekDayUTC function',
					exception);
			}

		},

		getMonthUTC: function(date) {
			try {
				this.$logInfo('MTripListScript: Entering getMonth function');
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
					'MTripListScript : An error occured in getMonth function',
					exception);
			}

		},


		onTripClick: function(event, args) {
			//To Check if the remove icon is enabled
			var pnr = args.recLoc;
			var removeButton = "remove_" + pnr;
			if (!($('#' + removeButton).hasClass("displayNone"))) {
				return null;
			}

			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
			if (args.bookingInfoFlag == false) {
				var recLoc = args.recLoc;
				var lastName = args.lastName;
				var cprInput = args.cprInput;

				/**Begin : To Keep Track Of the current PNR and Refresh The Flow Variables in case URL is not Refreshed*/
				if (jsonResponse != undefined && jsonResponse.checkInModuleCtrl != undefined) {
					jsonResponse.checkInModuleCtrl.intializingFlowVariables(cprInput);
				}
				jsonResponse.selectedCprInput = cprInput;
				/**END : To Keep Track Of the current PNR and Refresh The Flow Variables in case URL is not Refreshed*/

				var params = 'REC_LOC=' + recLoc;

				if (!jQuery.isUndefined(cprInput.lastName)) {
					params = params + '&LAST_NAME=' + cprInput.lastName;
				}
				if (!jQuery.isUndefined(cprInput.boardpoint)) {
					params = params + '&B_POINT=' + cprInput.boardpoint;
				}
				if (!jQuery.isUndefined(cprInput.departureDate)) {
					params = params + '&D_DATE=' + cprInput.departureDate;
				}
				if (!jQuery.isUndefined(cprInput.eticketNumber)) {
					params = params + '&ETKT_NUMB=' + cprInput.eticketNumber;
				}

				params = params + '&result=json';

				var actionName = 'RetrieveCPR.action';

				var request = {
					parameters: params,
					action: actionName,
					method: 'GET',
					loading: true,
					expectedResponseType: 'json',
					defaultParams: true,
					cb: {
						fn: this.__onTripClickCallback,
						args: params,
						scope: this
					}
				}
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else /*if (args.bookingInfoFlag == true)*/{
				var params = {
					REC_LOC: args.recLoc,
					DIRECT_RETRIEVE_LASTNAME: args.lastName,
					SERVICE_PRICING_MODE: "INIT_PRICE",
					ACTION: "MODIFY",
					DIRECT_RETRIEVE: "true",
					JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
					AIRLINE_CODE_0: this.request.AIRLINE_CODE_0,
					ACCOUNT_NUMBER_0: this.request.ACCOUNT_NUMBER_0,
					page: "ATC 0-My Trip"
				};
				if (!this.utils.isEmptyObject(this.reply.pageTicket)) {
					params.PAGE_TICKET = this.reply.pageTicket;
				}
				if (this.storage != true) {
					this.utils.sendNavigateRequest(params, 'MPNRValidate.action', this);
				} else {
					var jsonMTrip = this.moduleCtrl.getModuleData();
					jsonMTrip.flowFromTrip = "mTrips";
					jsonMTrip.recLocNo = args.recLoc;
					jsonMTrip.last_Name = args.lastName;
					jsonMTrip.pnr_Loc = args.recLoc + "_" + merciAppData.DB_TRIPDETAIL;
					this.moduleCtrl.navigate(params, 'merci-Mflights_A');
				}
			}
		},

		__onTripClickCallback: function(response, args) {
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null) {
				// will be null in case page already navigated
				if (this.moduleCtrl != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.checkIn == null) {
						json.checkIn = {};
					}
					json.checkIn[dataId] = response.responseJSON.data.checkIn[dataId];
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		onRetrieveClick: function(evt) {
			if (this.utils.isRequestFromApps() == true && (this.jsonObj != null || this.jsonObj != undefined)) {
				var that = this;

				this.utils.getStoredItemFromDevice(merciAppData.DB_GETTRIP, function(result) {
					var jsonMTrip = that.moduleCtrl.getModuleData();
					if (result && result != "") {
						jsonMTrip.TripData = result;
						jsonMTrip.navigation = true;
						that.moduleCtrl.navigate(null, 'merci-MPNRTRIPS_A');
					} else {
						jsonMTrip.navigation = false;
						that.utils.sendNavigateRequest(null, 'MGetMyTrips.action', that);
					}
				});
			} else {
				/* PTR 07993036: If in tablet, load tpl for trip retrieval pop-up */
				this.utils.sendNavigateRequest(null, 'MGetMyTrips.action', this);
			}
		},

		onLongPressTrip: function(event, args) {
			event.preventDefault();
			var trip_longpressed = args.pnr;
			var buttonid = "remove_" + trip_longpressed;
			$('#' + buttonid).removeClass("displayNone");
		},

		onRemoveClick: function(event, args) {
			event.preventDefault();
			var tripToRemove = args.pnr;
			var _this = this;

			jQuery(document).scrollTop("0");

			jQuery(".popupBGmask").removeClass("displayNone").addClass("displayBlock");
			jQuery("#cancelConf").removeClass("displayNone").addClass("displayBlock");

			jQuery("#cancelConf #cancelButton").click(function() {
				tripToRemove = null;
				jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
				jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");
			});

			jQuery("#cancelConf #okButton").click(function() {
				jQuery(".popupBGmask").removeClass("displayBlock").addClass("displayNone");
				jQuery('#cancelConf').removeClass("displayBlock").addClass("displayNone");

				if (!_this.utils.isEmptyObject(_this.pnrList)) {

					for (var key in _this.pnrList) {
						if (tripToRemove == key) {
							delete _this.pnrList[tripToRemove];
							_this.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, _this.jsonObj, "overwrite", "json");

							if (jsonResponse.ui.cntTrip > 0) {
								_this.$json.setValue(jsonResponse.ui, "cntTrip", jsonResponse.ui.cntTrip - 1);
							}

							if (jsonResponse.ui.cntTrip == 0) {
								_this.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', _this);
							} else {
								var pNRsToSort = [];
								for (var pnr in _this.pnrList) {
									pNRsToSort.push(pnr);
								}

								pNRsToSort.sort(function(a, b) {
									var dateA = new Date(_this.pnrList[a].BDate);
									var dateB = new Date(_this.pnrList[b].BDate);
									return dateA - dateB //sort by date ascending
								})

								_this.sortedPNRs = pNRsToSort;

								_this.$refresh();
							}
						}
					}
				}

			});

		},

		/**
		 * Event handler when the user clicks on one of the displayed trips.
		 * Launches the retrieve of the selected trip.
		 */
		onPNRClick: function(evt, args) {
			var el = document.getElementById(args.id);
			if (el != null && el.className.indexOf('favdelete') != -1) {
				var params = {
					REC_LOC: args.trip.recLoc,
					DIRECT_RETRIEVE_LASTNAME: args.trip.lastName,
					SERVICE_PRICING_MODE: "INIT_PRICE",
					ACTION: "MODIFY",
					DIRECT_RETRIEVE: "true",
					JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
					AIRLINE_CODE_0: this.request.AIRLINE_CODE_0,
					ACCOUNT_NUMBER_0: this.request.ACCOUNT_NUMBER_0,
					page: "ATC 0-My Trip"
				};
				if (!this.utils.isEmptyObject(this.reply.pageTicket)) {
					params.PAGE_TICKET = this.reply.pageTicket;
				}
				if (this.storage != true) {
					this.utils.sendNavigateRequest(params, 'MPNRValidate.action', this);
				} else {
					//jsonResponse.flowFromTrip="mTrips";
					//jsonResponse.pnr_Loc=trip.recLoc;
					var jsonMTrip = this.moduleCtrl.getModuleData();
					jsonMTrip.flowFromTrip = "mTrips";
					jsonMTrip.recLocNo = args.trip.recLoc;
					jsonMTrip.last_Name = args.trip.lastName;
					jsonMTrip.pnr_Loc = args.trip.recLoc + "_" + merciAppData.DB_TRIPDETAIL;
					this.moduleCtrl.navigate(params, 'merci-Mflights_A');
				}
			} else {
				if (el != null) {
					el.className += ' favdelete';
				}
			}
		},

		/* In tablet, load tpl for trip retrieval pop-up */
		loadGetTrip: function(response, args) {
			this.moduleCtrl.setValueforStorage(response.responseJSON.data.MGetTrip, 'MGetTrip');

			this.tDetailsTpl = true;
			this.$refresh({
				section: 'getTrip'
			});

			this.utils.hideMskOverlay();
			this.utils.showMskOverlay(false);
			if (document.getElementById("tripList")) {
				document.getElementById("tripList").style.display = "none";
			}

			$(".panel.addTrip.selected").addClass("show");
		},

		onDelTripListData: function(event, args) {
			event.preventDefault();
			if (!this.utils.isEmptyObject(this.pnrList)) {

				for (var key in this.pnrList) {
					if (args.keyData == key) {
						delete this.pnrList[args.keyData];
						this.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, this.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntTrip > 0) {
							this.$json.setValue(jsonResponse.ui, "cntTrip", jsonResponse.ui.cntTrip - 1);
						}

						this.$refresh();
					}
				}
			}

		}



	}
});