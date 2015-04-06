Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.templates.seatmap.MSeatMapScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
	$constructor: function() {
		pageObj = this;
		//var myScroll2 = null;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.selectedSeatsByPax = {};
	},

	$statics: {
		isInfantInPnr: false,
		isFiltered: false,
		isBassinetAvailable: true,

		/* Seat Characteristic Constants : Dictionary codes : START  */
		AVAILABLE_SEAT: "A",
		PREFERRED_SEAT: "CH",
		BASSINET_SEAT: "B",
		ATD_WITH_INF_SEAT: "I",
		MISSED_SEAT: "M",
		NO_SEAT: "-",
		RESTRICTED_SEAT: "1",
		/* Seat Characteristic Constants : Dictionary codes : END*/

		/*Facilities Constants : Dictionary codes  : START */
		EXIT_DOOR: "D",
		LAVATORY: "LA",
		CLOSET: "CL",
		EMERGENCY_EXIT: "EX",
		GALLEY: "G",
		/* Facilities Position on aircraft */
		LEFT: "L",
		RIGHT: "R",
		CENTER: "C",
		LEFT_CENTER: "RC",
		RIGHT_CENTER: "LC",
		FRONT: "F",
		REAR: "R",
		/* Facilities Constants : Dictionary codes : END  */

		isWingsToShow: false,
		//wingStarted : false

		currentPax: 0
    },

	$prototype: {

		$dataReady: function() {

			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var model = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A;
			var siteParams = model.siteParam;
			var requestParams = model.requestParam;
			if(!this._merciFunc.isEmptyObject(requestParams.request.passengerId)){
				this.currentPax=Number(requestParams.request.passengerId - 1);
			}
			$('body').attr('id', 'bseat');
			if (requestParams.request.isReterieve == "TRUE") {
				$('body').attr('id', 'sseat');
			}
			this.data.errors = [];
			this.__initData();

			this.__displayErrors();

			/* Added to convert the json received from the catalog page in case the seat map page is called from the catalog page */
			if (!this._merciFunc.isEmptyObject(this.requestParam.request.seatsEligibleSegments)) {
				this.seatsEligibleSegments = JSON.parse(this.requestParam.request.seatsEligibleSegments);
			}

			/* google analytics */
			this.__ga.trackPage({
			  domain: siteParams.siteGADomain,
			  account: siteParams.siteGAAccount,
			  gaEnabled: siteParams.siteGAEnable,
				page: ((requestParams.request.IS_SEAT_SERVICING == "FALSE") ? '5b-Seat Map' : 'Ser 2b-Seat Map') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
							'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: ((requestParams.request.IS_SEAT_SERVICING == "FALSE") ? '5b-Seat Map' : 'Ser 2b-Seat Map') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
							'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSeatMap",
						data:this.data
					});
			}
		},

		__initData: function() {
			/*Added at the time of R14SP1 CR 6414833:*** Fix It *** For better accessibility */
			var model = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A;
			this.siteParams = model.siteParam;
			this.globalList = model.globalList;
			this.labels = model.labels;
			this.requestParam = model.requestParam;
			this.errorStrings = model.errorStrings || [];

			/*In case of coming from the bookmarks page, then the pre-selected seats should be highlighted */
			this.initSeatsDataFromBkmk();
		},

		/**
		* Initializes the already selected seats for the particular segments
		**/
		initSeatsDataFromBkmk: function() {
			var basket = this.moduleCtrl.getBasket() || {};
			if (!this._merciFunc.isEmptyObject(basket)) {
				var seatsCategory = basket.perCategory['SIT'] || {};
				if (!this._merciFunc.isEmptyObject(seatsCategory)) {
					var seatsTags = seatsCategory.inputTags;
					var currentSegment = this.requestParam.request.SEGMENT_ID || "";
					for (seatTag in seatsTags) {
						if (currentSegment == seatTag.charAt(seatTag.length - 1)) {
							var seatNum = seatsTags[seatTag];
							this.selectedSeatsByPax[seatNum] = seatTag.substring(seatTag.length - 3, seatTag.length - 2);
						}
					}
				}
			}

		},

		__displayErrors: function() {

			var errors = this.requestParam.reply.listMsg;
			this.data.BEerrors = new Array();
			if (!this._merciFunc.isEmptyObject(errors)) {
				for (var error in errors) {
					var errorNumber = errors[error].NUMBER;
					var errorList = [8600, 8601, 8602, 8603, 8500, 8501, 8502, 8503, 8700, 8701, 8702, 8703, 9120];
					if (errorList.indexOf(errorNumber) > -1) {
						var message = this.errorStrings['2130037'].localizedMessage + ' (2130037(E))';
						var msgJson = {
							'TEXT': message
						};
						this.data.BEerrors.push(msgJson);
					}
					if (errorNumber == 5002) {
						var message = this.errorStrings['5002'].localizedMessage + ' (5002(E))';
						var msgJson = {
							'TEXT': message
						};
						this.data.BEerrors.push(msgJson);
					}
				}
				aria.utils.Json.setValue(this.data, 'errorOccured', true);
			} else {
				aria.utils.Json.setValue(this.data, 'errorOccured', false);
			}
		},

		__setBassinetAvailableCheck: function() {
			var showBscntMsg = this.siteParams.showBscntMsg;
			var seatmapbean = this.requestParam.seatmapbean;
			var deckList = seatmapbean.deckList || [];
			var fromPage = this.requestParam.request.FROMPAGE;
			if (this._merciFunc.booleanValue(showBscntMsg)) {
				for (var i = 0; i < deckList.length; i++) {
					if (deckList[i].isBassinet === true) {
						this.isBassinetAvailable = true;
					} else {
						this.isBassinetAvailable = false;
					}
				}
			}
			if (fromPage != 'OIBOUND') {
				this.isBassinetAvailable = true;
			}
		},

		__getSiteAllowBassinet: function() {
			var siteAllowBassinet = this.siteParams.siteallowBassinet || false;
			var fromPage = this.requestParam.request.FROMPAGE;
			var listTravellerBean = this.requestParam.listtravellerbean || [];
			if (this._merciFunc.isEmptyObject(fromPage) || (fromPage != 'OIBOUND')) {
				for (var i = 0; i < listTravellerBean.length; i++) {
					var currentTraveller = listTravellerBean[i];
					var infantDetails = currentTraveller.infant;
					if (!this._merciFunc.isEmptyObject(infantDetails)) {
						this.isInfantInPnr = true;
					}
					if (this.isInfantInPnr == false) {
						siteAllowBassinet = true;
					}
				}
			}
			return siteAllowBassinet;
		},

		__showWings: function(deck) {
			var cabins = deck.cabins || [];
			for (var i = 0; i < cabins.length; i++) {
				var cabinMap = cabins[i].cabinMap;
				if (cabinMap.isWing == true) {
					this.isWingsToShow = true;
				}
			}
		},

		$displayReady: function() {

			//this.__initData();
			//this.data.errorOccured = false;
			this.__displayErrors();

			/* Called every time the template loads. Counts total number of seats and sets revert status */
			$('#available').html(this.moduleCtrl.getValuefromStorage('countAvailable')); /* Count total available seats */
			this.moduleCtrl.setValueforStorage(false, "activeRevert"); /* For displaying or not displaying the revert button */
			this.moduleCtrl.setValueforStorage(false, "isChargeableSeatInSegment");
			var travBean = this.requestParam.listtravellerbean;
			var noOfPax = travBean.travellers.length;
			var smSegment = this.requestParam.seatmappanelbean.segment;
			if (smSegment != null && smSegment.id != null) {
				this.moduleCtrl.setValueforStorage(smSegment.id, "currentSeg");
				/* To set the occupied seat details if we are coming from the servicing flow */
				if (this.selectedSeatsByPax != null) {
					var segmentId = smSegment.id;
					for (var i in this.selectedSeatsByPax) {
						this.moduleCtrl.setValueforStorage(i, "seatId_" + this.selectedSeatsByPax[i] + segmentId);
					}
				}
			}

			this.moduleCtrl.setHeaderInfo({
				title: this.labels.tx_merci_text_seatsel_seatmap,
				bannerHtmlL: this.requestParam.bannerHtml,
				homePageURL: this.siteParams.homeURL,
				showButton: false,
				companyName: this.siteParams.sitePLCompanyName
			});
		},

		/*
		** Returns the pre-selected seats count
		** or Last names of the pax depending on
		** the variable type 'STRING' or 'NUMBER'
		*/
		getSelectedSeatsData: function(variableName, variableType) {
			this.requestParam = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam;
			var listtravellerbean = this.requestParam.listtravellerbean;
			var listitinerarybean = this.requestParam.listitinerarybean;
			var seatmappanelbean = this.requestParam.seatmappanelbean;
			var listseatassignmentbean = this.requestParam.listseatassignmentbean;
			var variableName = variableName;
			var variableType = variableType;
			for (var i = 0; i < listtravellerbean.travellers.length; i++) {
				for (var j = 0; j < listitinerarybean.itineraries.length; j++) {
					var segments = listitinerarybean.itineraries[j].segments;
					for (var k = 0; k < segments.length; k++) {
						var segId = segments[k].id;
						for (var a = 0; a < seatmappanelbean.listTravellers.travellers.length; a++) {
							var passengerX = seatmappanelbean.listTravellers.travellers[a];
							var paxNo = passengerX.paxNumber;
							if (!this._merciFunc.isEmptyObject(listseatassignmentbean.seatAssignementsMap)) {
								if (!this._merciFunc.isEmptyObject(listseatassignmentbean.seatAssignementsMap[segId])) {
									var seatAssignmentMap = listseatassignmentbean.seatAssignementsMap[segId];
									if (!this._merciFunc.isEmptyObject(seatAssignmentMap[paxNo])) {
										var seatAssignment = seatAssignmentMap[paxNo].seatAssignement;
										if (i + 1 === paxNo) {
											if (seatAssignment !== null) {
												if (this.requestParam.seatmappanelbean.segment.id == segId) {
													var paxNameUpper = passengerX.identityInformation.lastName.toUpperCase();
													switch (variableType) {
													case 'STRING':
														variableName = variableName.concat(paxNameUpper, '=', paxNo, '###');
														break;
													case 'NUMBER':
														variableName = variableName + 1;
														break;
													default:
														break;
													}
													this.addSelectedSeats(paxNo, seatAssignment);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return variableName;
		},

	    /**
		 * Tells whether there are more segments eligible for seat map
		 */
		hasOtherSegments: function(segmentIndex, segmentId, totalNoOfSegment) {
			var hasOtherSegments = false;
			hasOtherSegments = this.seatsEligibleSegments.indexOf(segmentId) < this.seatsEligibleSegments.length-2;
			return hasOtherSegments;
		},

		getTotalSegmentsCount: function() {
			var itineraries = this.requestParam.listitinerarybean.itineraries;
			var totalSegmentCount = 0;
			for (var i = 0; i < itineraries.length; i++) {
				totalSegmentCount = totalSegmentCount + itineraries[i].segments.length;
			}
			return totalSegmentCount;
		},

		slideBanner: function(AriaCT, args) {
			/* 		Method to add sliding functionality to seat information panel. */

			var whichBanner = $(args.bannerName);
			var objectToMove = $("#movingBanner");
			var seatnumber = whichBanner.find('span[data-seatInfo="seatnr"]');

			whichBanner.find('span[data-seatInfo="seatnr"]').toggleClass("is-hidden");
			whichBanner.find('.m-sliding-content').children('ul').toggleClass("is-seat");
			whichBanner.find('.m-sliding-content').children('ul').children('li').toggleClass("is-seat");
			whichBanner.find('.m-sliding-content').toggleClass("is-seat");

			if (objectToMove.hasClass('is-seat')) {
				seatnumber.animate({
					width: '3.8em'
				}, 500, function() {});
				objectToMove.animate({
					left: '0%',
					right: '0%'
				}, 500, function() {});

			} else {

				seatnumber.animate({
					width: '0'
				}, 400, function() {});
				objectToMove.animate({
					left: '-86%',
					right: '-86%'
				}, 500, function() {});
			}

		},

		expand: function(AriaCT, args) {
			/* 	Method to expand the seat characterstics panel. */

			AriaCT = new aria.DomEvent(AriaCT);
			AriaCT.stopPropagation();
			AriaCT.$dispose();
			var id = ("#" + args.id);
			if ($(id).hasClass('expand-down')) {
				$(id).parent('li').find('ul[data-seatInfo="charact"]').animate({
					top: '-3.2em'
				}, 500, function() {});
				$(id).parent('li').find('span[data-seatInfo="price"]').animate({
					top: '-3.2em'
				}, 500, function() {});
				$(id).removeClass('expand-down');
				$(id).addClass('expand-up');
			} else if ($(id).hasClass('expand-up')) {
				$(id).parent('li').find('ul[data-seatInfo="charact"]').animate({
					top: '0'
				}, 500, function() {});
				$(id).parent('li').find('span[data-seatInfo="price"]').animate({
					top: '0'
				}, 500, function() {});
				$(id).removeClass('expand-up');
				$(id).addClass('expand-down');
			}


		},

		/* 	Drawer-START */
		closeOpenDrawer: function() {
			/* 	Method to open or close the seat options drawer */
			var initialDrawerHeight = this.moduleCtrl.getValuefromStorage('initialDrawerHeight');
			var initialListHeight = this.moduleCtrl.getValuefromStorage('initialListHeight');
			var initialBannerHeight = this.moduleCtrl.getValuefromStorage('initialBannerHeight');
			var currentListHeight = $('.m-drawer #wrapper2').height();
			var currentDrawerHeight = $('.m-drawer ul.list-view').height();

			/* 		close drawer */
			if (currentListHeight > 0) {
				$('.m-drawer #wrapper2').css('height', '0px');
				$('.m-drawer').css('height', '20px');
				$('.m-drawer').addClass('is-closed');
				$('.m-sliding-banner').css('height', initialBannerHeight + 'px');
				$('div.seatmap .msk').css('display', 'none');
				$('.m-sliding-content span[data-seatinfo="seatnr"]').css('display', 'block');
				$('body').scrollTop(0, 1);



				/* 		open drawer */
			} else {
				$('.m-drawer #wrapper2').css('height', initialListHeight + 'px');
				$('.m-drawer').css('height', initialDrawerHeight + 'px');
				$('.m-drawer').removeClass('is-closed');
				$('.m-sliding-banner').css('height', '0');
				$('div.seatmap .msk').css('display', 'block');
				$('.m-sliding-content span[data-seatinfo="seatnr"]').css('display', 'none');

			}
			

		},

		resetAll: function(AriaCT, args) {
			/* 	Method to clear the filter selection */
			$('#available').html(this.moduleCtrl.getValuefromStorage('countAvailable'));
			var allSeats = $('.deck td[data-type="seat"]');
			var id = args.id;
			var seatCharacs = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmappanelbean.cabin.seatCharacs;
			for (var c in seatCharacs) {
				if ($('#' + c).hasClass('type-selected'))
					$('#' + c).removeClass('type-selected');
			}
			$('.m-drawer header').find('dd[data-info="options-selected"]').text("0");
			var selectedSeats = $('.deck td.has-property1');
			selectedSeats.removeClass('has-property1');
			this.highlightOptions();

		},

		getFormattedString: function(argSt, values) {
			for (var i = 0; i < values.length; i++) {
				var comparator = '{' + i + '}';
				if (argSt.indexOf(comparator) != -1) {
					argSt = argSt.replace(comparator, values[i]);
				}
			}

			return argSt;
		},

		incrementAvailable: function(num) {
			/* 	 This method increments the total number of available seats and returns their count. */
			var avlbl = num + 1;
			this.moduleCtrl.setValueforStorage(avlbl, 'countAvailable');
			return avlbl;

		},

		decrementAvailable: function(num) {
			/* 	 This method decrements the total number of available seats and returns their count. */
			var avlbl = num - 1;
			this.moduleCtrl.setValueforStorage(avlbl, 'countAvailable');
			return avlbl;

		},

		highlightOptions: function() {
			/* 	Method to highlight the options label in the seat options drawer */
			var options = parseInt($('.m-drawer header').find('dd[data-info="options-selected"]').text(), 10);
			var optionsText = $('.m-drawer header').find('dd[data-info="options-selected"]');
			var optionsLabel = $('.m-drawer header').find('dd[data-info="options-selected"]').siblings('dt:contains("options")');

			if (options > 0) {
				optionsText.addClass('is-with-options');
				optionsLabel.addClass('is-with-options');
			} else {
				optionsText.removeClass('is-with-options');
				optionsLabel.removeClass('is-with-options');
			}

		},

		toggleDecks: function(AriaCT, args) {
			/* 	Method to toggle between upper and lower deck. */
			var hideDeck = $('#' + args.hideId);
			var showDeck = $('#' + args.showId);
			hideDeck.addClass('displayNone');
			showDeck.removeClass('displayNone');


		},

		selectSeatChars: function(aria, args) {
			/* 	This method selects a particular characterstic in the filter */
			var options = parseInt($('.m-drawer header').find('dd[data-info="options-selected"]').text(), 10);
			var id = "#" + args.id;
			if (!$(id).hasClass('type-selected')) {

				options += 1;
				$(id).addClass('type-selected')


			} else if ($(id).hasClass('type-selected')) {
				options -= 1;
				$(id).removeClass('type-selected');
			}

			$('.m-drawer header').find('dd[data-info="options-selected"]').text(options);
			var selectedCharObjs = document.getElementsByClassName("type-selected");
			this.filterSeats(selectedCharObjs);


			this.highlightOptions();

		},

		filterSeats: function(selectedCharObjs) {
			/* 	Method to filter the seats according to the options selected */
			var numOfAvailable = 0;
			var selectedSeats = $('.deck td.has-property1');
			selectedSeats.removeClass('has-property1');
			var selectedChars = new Array();
			var len = selectedCharObjs.length;
			if (len == 0) {
				$('#available').html(this.moduleCtrl.getValuefromStorage('countAvailable'));
				this.isFiltered = false;
				this.moduleCtrl.setValueforStorage("", 'selectedChars');
				var chosen = document.getElementsByClassName("is-chosen");
				if (chosen.length > 0) {
					for (var i = 0; i < chosen.length; i++)
						this._merciFunc.removeClass(chosen[i], "is-chosen");

				}
			} else {
				this.isFiltered = true;
				this.moduleCtrl.setValueforStorage(selectedCharObjs, 'selectedChars');
				for (var i = 0; i < len; i++) {
					var ch = selectedCharObjs[i].getAttribute("id");
					if (ch == "A")
						ch = "AL";
					else if (ch == "U")
						ch = "UM";
					selectedChars.push(ch);
				}

				var seatmapbean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmapbean;
				var decklist = seatmapbean.deckList;
				var allAvailable;
				for (var i = 0; i < decklist.length; i++) {

					var colsLen = decklist[i].colConfig.length;
					var cabins = decklist[i].cabins;
					var colConfig = decklist[i].colConfig;
					for (var cabinIndex = 0; cabinIndex < cabins.length; cabinIndex++) {
						var cabin = cabins[cabinIndex];
						var cabinMap = cabin.cabinMap;
						for (var row = 0; row < cabinMap.length; row++) {
							var rowData = cabinMap[row].rowData;
							var rowNo = cabinMap[row].rowIndex;
							for (var col = 0; col < colsLen; col++) {

								if (rowData[col].indexOf("A") > -1) {
									for (var j = 0; j < selectedChars.length; j++) {
										if (rowData[col].indexOf(selectedChars[j]) == -1) {
											allAvailable = false;
											break;
										}
										allAvailable = true;
									}

									if (allAvailable == true) {
										numOfAvailable++;
										var seatId = rowNo + colConfig[col];
										var id = "#" + seatId;
										$(id).addClass('has-property1');
										for (var j = 0; j < selectedChars.length; j++) {
											var selectedChar = document.getElementById("char" + selectedChars[j]);
											if (selectedChar != null) {
												this._merciFunc.addClass(selectedChar, "is-chosen");
											}
										}

									}
								}
							}
						}
					}
				}
				$('#available').html(numOfAvailable);
			}

		},

		getPaxList: function(currentPax) {
			var rqstParams = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam;
			var trvlrs = rqstParams.listtravellerbean.travellers;
			if (!this._merciFunc.isEmptyObject(rqstParams.displayOtherPax) && rqstParams.displayOtherPax == 'Y') {
				var lnames = "";
				var flag;
				if (!this._merciFunc.isEmptyObject(rqstParams.lastNames))
					lnames = rqstParams.lastNames.split("###");
				if (lnames != "" && trvlrs.length > 1 && trvlrs.length != lnames.length) {
					for (var i = 0; i < trvlrs.length; i++) {
						flag = false;
						for (var j = 0; j < lnames.length; j++) {
							if (trvlrs[i].identityInformation.lastName.toLowerCase() === lnames[j].toLowerCase()) {
								flag = true;
								break;
							}
						}
						if (flag == false) {
							trvlrs.splice(i, 1);
						}

					}
				}
			}
			return trvlrs;
		},

		paxCarrousel: function(currentPax) {
			/* 	Method to implement the pax carrousel panel */
			var labels = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels;
			var expand = $("#expandContent");
			if (expand.hasClass('expand-up')) {
				expand.parent('li').find('ul[data-seatInfo="charact"]').animate({
					top: '0'
				}, 500, function() {});
				expand.parent('li').find('span[data-seatInfo="price"]').animate({
					top: '0'
				}, 500, function() {});
				expand.removeClass('expand-up');
				expand.addClass('expand-down');
			}


			this.moduleCtrl.setValueforStorage(currentPax + 1, "currentPax");
			var currentPax = this.moduleCtrl.getValuefromStorage("currentPax");
			this.highlightSeat(currentPax);
			var currSeg = this.moduleCtrl.getValuefromStorage("currentSeg");
			var currentPaxSeat = this.moduleCtrl.getValuefromStorage("seatId_" + currentPax + currSeg);
			if (currentPaxSeat != null && currentPaxSeat != "") {
				this.changeSeatNumber(currentPaxSeat, currentPax);
				this.changeSeatPrice(currentPaxSeat, currentPax);
			} else {
				this.changeSeatNumber("", currentPax);
				$('#seatPrice').text(labels.tx_merci_services_no + " " + labels.tx_merci_text_seat_selected);
				$('#charList').text(labels.tx_merci_text_booking_pleaseselect + " " + labels.tx_merci_text_mybook_seat);

			}
		},

		highlightSeat: function(whichPax) {
			/* 	Method to highlight the seat selected by the current pax. */
			var currentlyDisplayed = $('.deck td.is-current');
			currentlyDisplayed.removeClass('is-current');
			currentlyDisplayed.addClass('selected');

			var paxSeat = $('.deck td.selected:contains(' + whichPax + ')');
			paxSeat.removeClass('selected');
			paxSeat.addClass('is-current');
		},

		displayNumbers: function() {
			/* 	Method to display the numbers on the left and right buttons of the pax-carrousel panel. */
			var buttonsText = $('.carrousel-header a span');
			var paxNumber = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean.travellers.length;

			var buttonLeft = $('.carrousel-header a').eq(0);
			var buttonRight = $('.carrousel-header a').eq(1);

			var buttonTextLeft = $('.carrousel-header a').eq(0).find('span');
			var buttonTextRight = $('.carrousel-header a').eq(1).find('span');

			var numberLeft = parseInt(buttonsText.eq(0).attr('data-paxnr'), 10);
			var numberRight = parseInt(buttonsText.eq(1).attr('data-paxnr'), 10);


			if (numberLeft > 0) {
				buttonTextLeft.text(numberLeft);
				if (buttonLeft.hasClass('is-disabled')) {
					buttonLeft.removeClass('is-disabled');
				}
			} else {
				buttonTextLeft.text("");
				buttonLeft.addClass('is-disabled');

			}

			if (numberRight <= paxNumber) {
				buttonTextRight.text(numberRight);
				if (buttonRight.hasClass('is-disabled')) {
					buttonRight.removeClass('is-disabled');
				}
			} else {
				buttonTextRight.text("");
				buttonRight.addClass('is-disabled');
			}
		},

		selectSeat: function(a, recData) {
			/* 	Method which is called when the user selects a particular seat. */
			var rqstParams = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam;
			var labels = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels;
			var expand = $("#expandContent");
			if (expand.hasClass('expand-up')) {
				expand.parent('li').find('ul[data-seatInfo="charact"]').animate({
					top: '0'
				}, 500, function() {});
				expand.parent('li').find('span[data-seatInfo="price"]').animate({
					top: '0'
				}, 500, function() {});
				expand.removeClass('expand-up');
				expand.addClass('expand-down');
			}

			var tempBanner = {
				bannerName: ".m-sliding-banner"
			};
			if (!$('.m-sliding-content').hasClass('is-seat')) {
				this.slideBanner(" ", tempBanner);
			}

			var activeRev = this.moduleCtrl.getValuefromStorage("activeRevert"); /* Logic for enabling the revert button */
			if (activeRev == false) {
				$("#revertBtn").removeClass("disabled");
				this.moduleCtrl.setValueforStorage(true, "activeRevert");

			}
			if (recData.isChargeable == true) {
				this.moduleCtrl.setValueforStorage(true, "isChargeableSeatInSegment");
				if (rqstParams.request.isReterieve == "TRUE") {
					$('#forwardButton').text(labels.tx_merci_text_booking_seat_to_payment);
				}
			} else if (recData.isChargeable == false) {
				this.moduleCtrl.setValueforStorage(false, "isChargeableSeatInSegment");
				if (rqstParams.request.isReterieve == "TRUE") {
					$('#forwardButton').text(labels.tx_merci_text_seatsel_btnsave);
				}
			}
			var paxNumber = this.moduleCtrl.getValuefromStorage('currentPax');
			var segNumber = this.moduleCtrl.getValuefromStorage('currentSeg');
			this.moduleCtrl.setValueforStorage(recData.seatId, "seatId_" + paxNumber + segNumber);
			this.changeSeatNumber(recData.seatId, paxNumber);
			this.changeSeatPrice(recData.seatId, paxNumber);
			var seatId = $("#" + recData.seatId);

			var currentlySelected = $('.deck td.is-current');
			currentlySelected.removeClass('is-current');
			currentlySelected.children('.paxSeatIndicator').remove();
			currentlySelected.find('input').removeClass('hidden');
			$(seatId).addClass('is-current');
			$(seatId).find('input').addClass('hidden');
			var paxNoSpan = document.createElement('span');
			paxNoSpan.setAttribute("class", "paxSeatIndicator");
			paxNoSpan.innerHTML = paxNumber;
			$(seatId).append(paxNoSpan);
			var othersSelected = $('#lowerDeck td.selected');
			if ($(seatId).hasClass('selected')) {
				$(seatId).removeClass('selected');
			} else {
				if (!othersSelected.hasClass('selected')) {
					othersSelected.addClass('selected');
				}
			}

		},

		getSeatId: function(str1, str2) {
			/* 	 Method to return the seat id of a particular seat */
			var id = str1 + str2;
			return id;
		},

		revertSeatSelection: function() {
			/* 	Method to revert the current seat selection of the passenger. */
			var current = $(".deck td.is-current");
			var labels = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels;
			current.removeClass("is-current");
			current.children('.paxSeatIndicator').remove();
			current.find('input').removeClass('hidden');

			var selected = $(".deck td.selected");
			selected.removeClass("selected");

			selected.children('.paxSeatIndicator').remove();
			selected.find('input').removeClass('hidden');

			var seg = this.moduleCtrl.getValuefromStorage("currentSeg");
			var travellers = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean.travellers;

			for (var t = 0; t < travellers.length; t++) {
				this.moduleCtrl.setValueforStorage("", "seatId_" + (t + 1) + seg);
				var seatNrEL = document.getElementById('seatnr' + travellers[t].paxNumber);
				if (seatNrEL != null) {
					seatNrEL.innerHTML = '';
				}
			}

			var seatnumEL = document.getElementById('noSeatIco');
			if (seatnumEL != null) {
				seatnumEL.innerHTML = '';
			}

			var seatPriceEL = document.getElementById('seatPrice');
			if (seatPriceEL != null) {
				seatPriceEL.innerHTML = '';
			}

			$("#charList").children("li").text("");
			this.moduleCtrl.setValueforStorage(false, "activeRevert");

			// disable the revert button
			var revertBtn = document.getElementById('revertBtn');
			if (revertBtn != null) {
				revertBtn.className += ' disabled';
			}
			$('#seatPrice').text(labels.tx_merci_services_no + " " + labels.tx_merci_text_seat_selected);
			$('#charList').text(labels.tx_merci_text_booking_pleaseselect + " " + labels.tx_merci_text_mybook_seat);
			if ($('.m-sliding-content').hasClass('is-seat')) {
				var tempBanner = {
						bannerName: ".m-sliding-banner"
					};
				this.slideBanner(" ", tempBanner);
			}
		},

		changeSeatNumber: function(whichSeat, whichPax) {
			/* 		Method to change the seat number in the seat information panel */
        	 $('#noSeatIco').html(whichSeat);
			 $('#seatnum').html(whichSeat);
			$('#seatnr' + whichPax).html(whichSeat);
			this.dispCharacteristics(whichSeat);

		},

		changeSeatPrice: function(whichSeat, whichPax) {
			/* 	Method to change the price of the seat in the seat information panel */
			var priceInfo = this.getPriceInfo(whichSeat);
			if (priceInfo != "") {
				var seatPrice = this.getPricePerPax(priceInfo, whichPax);
				var currency = this.getCurrencyPerPax(priceInfo, whichPax);
				if (seatPrice == null || seatPrice == "") {
					seatPrice = "0.0";
					currency = "";
				}
				$('#seatPrice').text(currency + " " + seatPrice);
				$('#seatPrice').addClass('cheargable');
			} else {
				$('#seatPrice').text(this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels.tx_pltg_text_Free);
				$('#seatPrice').removeClass('cheargable');
			}

		},

		getPriceInfo: function(seatId) {
			/* 	Method that returns the price information string for a chargeable seat. */
			var priceInfo = "";
			var totalPax = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean.travellers.length;
			var decklist = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmapbean.deckList;
			var colNo = seatId.charAt(seatId.length - 1);
			var rowNo = seatId.substring(0, (seatId.length - 1));
			var colIndex;
			var chars = new Array();
			for (var i = 0; i < decklist.length; i++) {
				var colConfig = decklist[i].colConfig;
				for (var col = 0; col < colConfig.length; col++) {
					if (colNo == colConfig[col])
						colIndex = col;
				}

				var cabins = decklist[i].cabins;
				for (var cabinIndex = 0; cabinIndex < cabins.length; cabinIndex++) {
					var cabin = cabins[cabinIndex];
					var cabinMap = cabin.cabinMap;
					for (var row = 0; row < cabinMap.length; row++) {
						if (cabinMap[row].rowIndex == rowNo) {
							chars = cabinMap[row].rowData[colIndex];
							if (chars.indexOf("CH") > -1) {
								for (var i = 0; i <= (totalPax * 3 - 1); i++) {
									priceInfo = priceInfo.concat(chars[i], ",");
								}
							}
						}
					}

				}

			}
			return priceInfo;

		},

		getPricePerPax: function(priceInfoObj, currentPax) {
			/* 		Method to extract the price for the current pax from the price information string */
			var temp = new Array();
			var crrntPax = parseInt(currentPax, 10);
			temp = priceInfoObj.split(",");
			var count = 3;
			var loopLimit = ((crrntPax * count) - 1);
			var price;
			for (p = 0; p < temp.length; p++) {
				if (crrntPax == temp[loopLimit]) {
					price = temp[loopLimit - 2];
					break;
				}
			}
			return price;
		},

		getCurrencyPerPax: function(priceInfoObj, currentPax) {
			/* 		Method to extract the currency for the current pax from the price information string */
			var temp = new Array();
			var crrntPax = parseInt(currentPax, 10);
			temp = priceInfoObj.split(",");
			var count = 3;
			var loopLimit = ((crrntPax * count) - 1);
			var currency;
			for (c = 0; c < temp.length - 1; c++) {
				if (crrntPax == temp[loopLimit]) {
					currency = temp[loopLimit - 1];
					break;
				}
			}
			return currency;
		},

		/**
		 * This method is called to load each subsequent flight segment. It updates the values of the hidden input parameters,
		 * before submitting the form and calling the seatmap action
		 */
		updateSegmentValues: function() {
			var itinBean = this.requestParam.listitinerarybean;
			var travBean = this.requestParam.listtravellerbean;
			var noOfPax = travBean.travellers.length;
			var form = document.getElementById("seatFormId");
			var itinIndex;
			var segmentId = parseInt(this.requestParam.request.SEGMENT_ID, 10);
			hasOtherSegments = this.requestParam.request.HAS_OTHER_SEGMENTS;
			if (hasOtherSegments == "TRUE") {
				var segment = this.__getNextSegment(segmentId);
				document.getElementById("BOOKING_CLASS").value = segment.cabins[0].RBD;
				document.getElementById("B_AIRPORT_CODE").value = segment.beginLocation.locationCode;
				document.getElementById("E_AIRPORT_CODE").value = segment.endLocation.locationCode;
				document.getElementById("B_DATE").value = segment.beginDateBean.yearMonthDay;
				document.getElementById("B_TIME").value = segment.beginDateBean.formatTimeAsHHMM;
				document.getElementById("EQUIPMENT_TYPE").value = segment.equipmentCode;
				document.getElementById("E_TIME").value = segment.endDateBean.formatTimeAsHHMM;
				document.getElementById("AIRLINE_CODE").value = segment.airline.code;
				document.getElementById("FLIGHT").value = segment.flightNumber;
				document.getElementById("SEGMENT_ID").value = segment.id;
				var itineraries = itinBean.itineraries;
				for (var i = 0; i < itineraries.length; i++) {
					var tempSegments = itineraries[i].segments;
					for (var s = 0; s < tempSegments.length; s++) {
						if (tempSegments[s].id == segment.id)
							itinIndex = parseInt(itineraries[i].itemId, 10) + 1;
					}
				}
				if (this._merciFunc.booleanValue(this.siteParams.merciServiceCatalog)) {
					itinIndex = this.__getItinerary(segmentId);
				}
				document.getElementById("itinerary_index").value = itinIndex;


			}
			if($('#PREF_AIR_FREQ_NUMBER_1_1').val()!=undefined){
				   document.getElementById("PREF_AIR_FREQ_NUMBER_1_1").value = $('#PREF_AIR_FREQ_NUMBER_1_1').val().split(",")[0];
				}
			if($('#PREF_AIR_FREQ_MILES_1_1').val()!=undefined){
				   document.getElementById("PREF_AIR_FREQ_MILES_1_1").value = $('#PREF_AIR_FREQ_MILES_1_1').val().split(",")[0];
				}
			if($('#PREF_AIR_FREQ_LEVEL_1_1').val()!=undefined){
				   document.getElementById("PREF_AIR_FREQ_LEVEL_1_1").value = $('#PREF_AIR_FREQ_LEVEL_1_1').val().split(",")[0];
				}
			document.getElementById("SERVICE_PRICING_MODE").value = "UPDATE_PRICE";
			document.getElementById("REGISTER_START_OVER").value = "false";
			document.getElementById("updateInfoSuccess").value = "21300045";
			document.getElementById("DIRECT_RETRIEVE_LASTNAME").value = this.requestParam.listtravellerbean.primaryTraveller.identityInformation.lastName;
			if (this._merciFunc.booleanValue(this.siteParams.merciServiceCatalog)) {
				document.getElementById("IS_SEAT_SERVICING").value = this.requestParam.request.IS_SEAT_SERVICING;
			}
			this.__appendParamsToForm(form, noOfPax, segmentId);
		},

		/*
		** Loop to add parameters for each passenger, and for each segment.
		*/
		__appendParamsToForm: function(form, noOfPax, segmentId) {
			for (var t = 1; t <= noOfPax; t++)  {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("name", "PREF_AIR_SEAT_ASSIGMENT_" + t + "_" + segmentId);
				input.setAttribute("id", "seat" + t);
				var str = "seatId_" + t + segmentId;
				if(!this._merciFunc.isEmptyObject(this.moduleCtrl.getValuefromStorage(str))){
					input.setAttribute("value", this.moduleCtrl.getValuefromStorage(str));	
				}
				else{
					input.setAttribute("value", "");
				}
				form.appendChild(input);
			}

			var input1 = document.createElement("input");
			input1.setAttribute("type", "hidden");
			input1.setAttribute("name", "isChargeableSeatInSegment");
			input1.setAttribute("id", "isChargeableSeatInSegment");
			input1.setAttribute("value", this.moduleCtrl.getValuefromStorage("isChargeableSeatInSegment"));
			form.appendChild(input1);

			/*To prevent the null pointer exception that arises when NoOfTravellrsM is null in the MALPIAction and to send the servicing parameter as true in case of servicing*/
			if (this._merciFunc.booleanValue(this.siteParams.merciServiceCatalog) && this._merciFunc.booleanValue(this.requestParam.IS_SEAT_SERVICING)) {
				var model = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A;
				this.requestParam = model.requestParam;

				var inputTravellers = document.createElement("input");
				inputTravellers.setAttribute("type", "hidden");
				inputTravellers.setAttribute("name", "noOfTravellersM");
				inputTravellers.setAttribute("id", "noOfTravellersM");
				inputTravellers.setAttribute("value", this.requestParam.listtravellerbean.travellers.length);
				form.appendChild(inputTravellers);
			}

		},

		/**
		 * Returns the next segment for which the seat is being selected
		 */
		__getNextSegment: function(segmentId) {
			var itinBean = this.requestParam.listitinerarybean;
			var numOfSegments = itinBean.nbrOfSegments;
			var nextSegmentId = segmentId + 1;
			var nextSegmentIndex = nextSegmentId - 1;
			var segment = itinBean.segments[nextSegmentIndex];
			var nextSegmentIdIndex = this.seatsEligibleSegments.indexOf(segmentId)+1;
			var nextSegmentId = this.seatsEligibleSegments[nextSegmentIdIndex];
			numOfSegments = this.seatsEligibleSegments.length;
			var segment;
			var segments = itinBean.segments;
			for(var i=0; i<segments.length; i++){
				if(segments[i].id === nextSegmentId){
					var segment = segments[i];
				}
			}
			return segment;
		},

		/**
		*	returns the next itinerary index
		**/
		__getItinerary: function(segmentId) {
			var itinBean = this.requestParam.listitinerarybean;
			var itineraries = itinBean.itineraries;
			itineraryId = 0;
			for (var i = 0; i < itineraries.length; i++) {
				var segments = itineraries[i].segments;
				if (!this._merciFunc.isEmptyObject(segments)) {
					for (var j = 0; j < segments.length; j++) {
						if (segments[j].id === segmentId) {
							itineraryId = itineraries[i].itemId;
						}
					}
				}
			}
			return itineraryId;
		},


		getCharacteristics: function(seatId) {
			/* 	This function returns all the characteristic codes of a particular seat. */
			var seatmapbean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmapbean;
			var decklist = seatmapbean.deckList;

			var colNo = seatId.charAt(seatId.length - 1);
			var rowNo = seatId.substring(0, (seatId.length - 1));
			var colIndex;
			var reqChars = new Array();
			for (var i = 0; i < decklist.length; i++) {
				var colConfig = decklist[i].colConfig;
				for (var col = 0; col < colConfig.length; col++) {
					if (colNo == colConfig[col])
						colIndex = col;
				}

				var cabins = decklist[i].cabins;
				for (var cabinIndex = 0; cabinIndex < cabins.length; cabinIndex++) {
					var cabin = cabins[cabinIndex];
					var cabinMap = cabin.cabinMap;
					for (var row = 0; row < cabinMap.length; row++) {
						if (cabinMap[row].rowIndex == rowNo) {
							reqChars = cabinMap[row].rowData[colIndex];
						}
					}

				}

			}
			return reqChars;
		},

		getNumberAccToChars: function(charac) {
			/* 		This method returns the number of seats available having a particular characteristic. */
			if (charac == "A")
				charac = "AL";
			else if (charac == "U")
				charac = "UM";
			var seatmapbean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmapbean;
			var decklist = seatmapbean.deckList;
			var num = 0;
			for (var i = 0; i < decklist.length; i++) {

				var colsLen = decklist[i].colConfig.length;
				var cabins = decklist[i].cabins;
				var colConfig = decklist[i].colConfig;
				for (var cabinIndex = 0; cabinIndex < cabins.length; cabinIndex++) {
					var cabin = cabins[cabinIndex];
					var cabinMap = cabin.cabinMap;
					for (var row = 0; row < cabinMap.length; row++) {
						var rowData = cabinMap[row].rowData;
						var rowNo = cabinMap[row].rowIndex;
						for (var col = 0; col < colsLen; col++) {
							if (rowData[col].indexOf("A") > -1) {
								if (rowData[col].indexOf(charac) > -1) {
									if ((charac == "B" || charac == "I") && this.isInfantInPnr == false) {
										num == 0;

									} else
										num++;

								}
							}
						}
					}
				}
			}

			return num;
		},

		dispCharacteristics: function(seatId) {
			/* 	Method that displays the characteristics of the selected seat. */
			var chars = this.getCharacteristics(seatId);
			var seatCharacs = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmappanelbean.cabin.seatCharacs;
			var numOfTrav = parseInt(this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean.travellers.length, 10);
			$("#charList").html("");
			var i = 0;
			var len = chars.length;
			if (chars.indexOf("CH") > -1 && (typeof chars[len - 1] != "string")) {
				i = (numOfTrav * 3);
				len = len - 1;
			}
			for (; i < len; i++) {
				for (var c in seatCharacs) {
					if ((chars[i] == 'AL' && c == 'A') || (chars[i] == 'UM' && c == 'U') || (chars[i] == c && c != 'A' && c != 'U')) {
						var listItem = document.createElement("li");
						listItem.setAttribute("id", "char" + c);
						if (i == chars.length - 2 || (i == chars.length - 3 && chars.indexOf("CH") > -1 && chars[len] != undefined))
							listItem.innerHTML = seatCharacs[c];
						else
							listItem.innerHTML = seatCharacs[c].concat(", ");

						if (this.isFiltered == true) {
							var selChars = this.moduleCtrl.getValuefromStorage("selectedChars");
							for (var ch in selChars) {
								if (seatCharacs[c] == ch)
									this._merciFunc.addClass(listItem, "is-chosen");
							}
						}

						document.getElementById("charList").appendChild(listItem);

					}
				}
			}

		},

		__isChargeableSeatEnabled: function() {
			var siteParams = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.siteParam;
			return siteParams.siteChargeableSeat != null && siteParams.siteChargeableSeat.toLowerCase() == 'true' && siteParams.siteSpecServChargeable != null && siteParams.siteSpecServChargeable.toLowerCase() == 'true';
		},

		__getSeatAction: function() {

			var actionName = 'MSeatMapChageReqParamAction.action';
			var param = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.request;
			var siteParameters = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.siteParam;

			if (this.__isChargeableSeatEnabled()) {
				actionName = 'MRequestAdditionalInformationPurchaseMCFSR.action';
			}
			if (this._merciFunc.booleanValue(siteParameters.merciServiceCatalog)) {
				//We know that HAS_OTHER_SEGMENTS==TRUE (checked in tpl), so we know that we are going to the next seat map
				actionName = "MModifyChargeableServicesSelectionBooking.action";
			} else {
				if (param.IS_SEAT_SERVICING != null && param.IS_SEAT_SERVICING.toLowerCase() == 'false') {
					actionName = 'MModifyChargeableServicesSelectionBooking.action';
					if (!this._merciFunc.booleanValue(param.HAS_OTHER_SEGMENTS)) {
							actionName = 'MRequestAdditionalInformationPurchaseMCFSR.action'; 
					}
				}
			}

			return actionName;
		},

		/**
		 * method to display the next segment seat map
		 * @param ATarg
		 * @param args
		 */
		callActn: function(ATarg, args) {
			this.data.errors = [];
			var ans = true;
			if (this.moduleCtrl.getValuefromStorage("isChargeableSeatInSegment") == true) {
				var ans = this.getConfirmation();
			}
			/* resets the seats selected object when loading the next seat map */
			this.selectedSeatsByPax = {};
			if (ans == true) {
				this.updateSegmentValues();
				var request = {
					formObj: document.getElementById('seatFormId'),
					action: this.__getSeatAction(),
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.asyncCallback,
						scope: this
					}
				};

				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
				}
		},

		asyncCallback: function(response) {

			// get reference to module ctrl data
			var json = this.moduleCtrl.getModuleData();
			this.data.errors = new Array();
			// if success response
			if (response.responseJSON.data != null) {

				var flow = 'servicing';
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

				// check if error response is returned
				if (response.responseJSON.data.booking != null) {
					flow = 'booking';
				}

				// set JSON data
				json[flow][dataId] = response.responseJSON.data[flow][dataId];

				// if seat map response
				if (flow == 'servicing' && dataId == 'MseatMapv2_A') {
					this.__initData();
					this.$refresh({
						section: "seatMapPage"
					});
				} else {
					// if error response
					this.moduleCtrl.navigate(null, nextPage);
				}
			}

		},

		getConfirmation: function() {
			var user_confirmation = confirm(this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels.tx_merci_nwsm_warn_msg2);
			return user_confirmation;

		},

		proceedServicing: function(ATarg, args) {
			this.data.errors = [];
			var form = document.getElementById("seatFormId");
			var travBean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean;
			var noOfPax = travBean.travellers.length;
			var segmentId = this.moduleCtrl.getValuefromStorage("currentSeg");

			// add previously selected seat
			this.addPreSelectedSeats(segmentId, noOfPax, form);

			for (var t = 1; t <= noOfPax; t++) /* Loop to add parameters for each passenger, and for each segment. */ {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("name", "PREF_AIR_SEAT_ASSIGMENT_" + t + "_" + segmentId);
				input.setAttribute("id", "seat" + t);
				var str = "seatId_" + t + segmentId;
				input.setAttribute("value", this.moduleCtrl.getValuefromStorage(str));
				form.appendChild(input);
			}

			var i = document.createElement("input");
			i.setAttribute("type", "hidden");
			i.setAttribute("name", "isChargeableSeatInSegment");
			i.setAttribute("id", "isChargeableSeatInSegment");
			i.setAttribute("value", this.moduleCtrl.getValuefromStorage("isChargeableSeatInSegment"));
			form.appendChild(i);

			var request = {
				formObj: document.getElementById('seatFormId'),
				action: this.__getSeatAction(),
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onProceedServCallback,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
		},

		__onProceedServCallback: function(response, params) {
			// navigate to next tpl
			this._merciFunc.navigateCallback(response, this.moduleCtrl, true);
		},

		__onProceedPayCallback: function(response, params) {
			// navigate to next tpl
			this._merciFunc.navigateCallback(response, this.moduleCtrl, true);
		},

		proceedToPay: function(Atarg, args) {
			/* 	Method to submit the form and load the payment page. */
			var ans = true;
			if (this.moduleCtrl.getValuefromStorage("isChargeableSeatInSegment") == true) {
				var ans = this.getConfirmation();
			}
			if (ans) {
				this.updateSegmentValues();
				var request = {
					formObj: document.getElementById('seatFormId'),
					action: this.__getSeatAction(),
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__onProceedPayCallback,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			}
		},

		getPnrCookie: function(lastName) {
			var pnrCookie = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.request.REC_LOC + lastName.toUpperCase();
			return pnrCookie;
		},

		addSelectedSeats: function(paxNo, seatNo) {
			this.selectedSeatsByPax[seatNo] = paxNo;
		},

		$afterRefresh: function() {
			/* For the initial state of the seat options drawer */
			this.moduleCtrl.setValueforStorage($('.m-drawer').height(), 'initialDrawerHeight');
			this.moduleCtrl.setValueforStorage($('.m-drawer #wrapper2').height(), 'initialListHeight');
			this.moduleCtrl.setValueforStorage($('.m-sliding-banner').height(), 'initialBannerHeight');
			$('.m-drawer').addClass('is-closed');
			$('.m-drawer #wrapper2').css('height', '0px');

			/* For setting the current deck */
			var deckList = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmapbean.deckList || [];
			if (deckList.length == 1) {
				if (deckList[0].deckLabel == "MAIN")
					this.moduleCtrl.setValueforStorage("lowerDeck", "currentDeck");
				else
					this.moduleCtrl.setValueforStorage("upperDeck", "currentDeck");
			} else {
				this.moduleCtrl.setValueforStorage("lowerDeck", "currentDeck");
			}

			if (this.selectedSeatsByPax != null && this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmappanelbean.segment != null) {

				var segmentId = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.seatmappanelbean.segment.id;
				for (var i in this.selectedSeatsByPax) {
					var seatNumEL = document.getElementById("seatnum");
					if (seatNumEL != null) {
						seatNumEL.innerHTML = i;
					}

					this.moduleCtrl.setValueforStorage(i, "seatId_" + this.selectedSeatsByPax[i] + segmentId);
					break;
				}
			}

		},

		backToRetrieve: function() {
			/* 	Method to go back to the retrieve page from the seatmap template. Only in the servicing flow.		 */
			this.moduleCtrl.goBack();

		},

		addPreSelectedSeats: function(segmentId, noOfPax, form) {


			var itinBean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listitinerarybean;
			var itinIndex;
			var itineraries = itinBean.itineraries;
			for (var i = 0; i < itineraries.length; i++) {
				var tempSegments = itineraries[i].segments;
				for (var s = 0; s < tempSegments.length; s++) {
					if (tempSegments[s].id == segmentId)
						itinIndex = parseInt(itineraries[i].itemId, 10);
				}
			}


			for (var t = 1; t <= noOfPax; t++) {
				var input = document.createElement("input");

				input.setAttribute("type", "hidden");
				input.setAttribute("name", "PreSelectedSeat_" + t + "_" + itinIndex + "_" + segmentId);
				input.setAttribute("id", "preSeat" + t);
				for (var key in this.selectedSeatsByPax) {
					if (this.selectedSeatsByPax[key] == t)
						input.setAttribute("value", key);
				}

				form.appendChild(input);
			}

		},

		__getKeysCount: function(object) {
			var count = 0;
			for (key in object) {
				if (object.hasOwnProperty(key)) {
					count++;
				}
			}

			return count;
		},
		__checkAllSeatsSelected: function() {
			var travBean = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.listtravellerbean;
			var noOfPax = travBean.travellers.length;
			var segmentId = parseInt(this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam.request.SEGMENT_ID, 10);
			var missingNo = 0;
			var isAllSelected = true;
			for (var t = 1; t <= noOfPax; t++) /* Loop to add parameters for each passenger, and for each segment. */ {
				var str = "seatId_" + t + segmentId;
				if (this.moduleCtrl.getValuefromStorage(str) == null || this.moduleCtrl.getValuefromStorage(str) == "" || this.moduleCtrl.getValuefromStorage(str) == undefined) {
					missingNo += 1;
					isAllSelected = false;
				}
			}
			if (!this._merciFunc.isEmptyObject(this.data.BEerrors)) {
				missingNo = 0;
				isAllSelected = true;
			}
			if (missingNo > 0) {
				this.__showSeatNotSelErr(missingNo);
			}
			return isAllSelected;
		},
		__showSeatNotSelErr: function(missingNo) {
			this.data.errors = [];
			var labels = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels;
			var message = "";
			if (missingNo > 1) {
				message = labels.tx_pltg_js_MissingNumberSeats.replace("{0}", missingNo)
			} else {
				message = labels.tx_pltg_js_MissingOneSeat;
			}
			var msgJson = {
				'TEXT': message
			};
			this.data.errors.push(msgJson);
			aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
			window.scrollTo(0, 0);


		},
		__createInputParams: function() {
			var travBean = this.requestParam.listtravellerbean;
			var noOfPax = travBean.travellers.length;
			var inputParams = {};
			var seatsEligibleSegments = this.seatsEligibleSegments;
			for (var i = 0; i < seatsEligibleSegments.length; i++) {
				segmentId = seatsEligibleSegments[i];
				for (var t = 1; t <= noOfPax; t++)  {
					var key = ("PREF_AIR_SEAT_ASSIGMENT_" + t + "_" + segmentId);
					var str = "seatId_" + t + segmentId;
					inputParams[key] = this.moduleCtrl.getValuefromStorage(str);
				}
			}

			return inputParams;
		},

		proceedToCatalog: function(Atarg, args) {
			var ans = true;
			if (this.moduleCtrl.getValuefromStorage("isChargeableSeatInSegment") == true) {
				var ans = this.getConfirmation();
			}
			if (ans) {
				var inputParams = this.__createInputParams();
				this.moduleCtrl.updateBasket('SIT', inputParams, {
					fn: this.__errorCallback,
					scope: this
				});
			}
		},

		__errorCallback: function(reply) {
   		     var messages = this._merciFunc.readBEErrors(reply.errors);
   		     this.$json.setValue(this.data, 'messages', messages);
		}

	}
});