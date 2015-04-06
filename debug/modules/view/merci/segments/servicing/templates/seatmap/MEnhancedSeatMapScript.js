Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.templates.seatmap.MEnhancedSeatMapScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.preSelectedSeats = {};
		this.initialPointY = 0;
		aria.utils.Event.addListener(Aria.$window, "scroll", {
			fn: this.scrollee,
			scope: this
		}, true);
	},

	$destructor: function() {
		// removes listener
		aria.utils.Event.addListener(Aria.$window, "scroll");
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
		FREE_SEAT:"F",
		OCCUPIED_SEAT:"O",
		BLOCKED_SEAT:"Z",
		AISLE_SEAT:"A",
		CHARGEABLE_SEAT:"CH",
		NO_SEAT_PRESENT:"8",
		/* Seat Characteristic Constants : Dictionary codes : END*/

		/*Facilities Constants : Dictionary codes  : START */
		EXIT_DOOR: "D",
		LAVATORY: "LA",
		CLOSET: "CL",
		EMERGENCY_EXIT: "EX",
		GALLEY: "G",
		STAIRS: "ST",
		STORAGE: "SO",
		/* Facilities Position on aircraft */
		LEFT: "L",
		RIGHT: "R",
		CENTER: "C",
		LEFT_CENTER: "RC",
		RIGHT_CENTER: "LC",
		FRONT: "F",
		REAR: "R",
		/* Facilities Constants : Dictionary codes : END  */

		AVAILABLE: "AVAILABLE",
		MISSING_SEAT: "MISSING",
		isWingsToShow: false,
		//wingStarted : false

		UPPER_DECK: "UPPER",
		seatSegment: 0
    },

	$prototype: {

		$dataReady: function() {
			this.__initData();
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var pageObj = this;
			/* google analytics */
			this.__ga.trackPage({
			  domain: pageObj.siteParams.siteGADomain,
			  account: pageObj.siteParams.siteGAAccount,
			  gaEnabled: pageObj.siteParams.siteGAEnable,
				page: ((pageObj.requestParam.request.IS_SEAT_SERVICING == "FALSE") ? '5b-Seat Map' : 'Ser 2b-Seat Map') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
							'&wt_language=' + base[12] + '&wt_officeid=' + pageObj.siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: ((pageObj.requestParam.request.IS_SEAT_SERVICING == "FALSE") ? '5b-Seat Map' : 'Ser 2b-Seat Map') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
							'&wt_language=' + base[12] + '&wt_officeid=' + pageObj.siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
		},

		$displayReady: function() {
			this.__displayErrors();
		},

		$viewReady: function() {
			var that = this;
			var showButton = false;
			if(this.utils.booleanValue(this.requestParam.request.IS_SEAT_SERVICING) || this.utils.booleanValue(this.requestParam.request.isReterieve)){
				showButton = true;
			}

			this.moduleCtrl.setHeaderInfo({
				title: this.labels.tx_merci_text_seatsel_seatmap,
				bannerHtmlL: this.requestParam.bannerHtml,
				homePageURL: this.siteParams.homeURL,
				showButton: showButton,
				companyName: this.siteParams.sitePLCompanyName
			});
			setTimeout(function() {
				that.adjustSegmentsWidth();
				that.myscroll = new iScroll('stmp_wrapper', {
					zoom: true,
					scrollX: true,
					hScrollbar: false,
					scrollY: true,
					mouseWheel: true,
					wheelAction: 'zoom',
					snap: true,
			        momentum: false,
					onScrollEnd: function() {
						var segIndex = this.currPageX;
						that.scrollToSegment(segIndex);
						that.scrollee();
					},
					onScrollMove: function() {
						that.scrollee();
					}
				});
				that.myscroll.scrollToPage((that.getSegmentIndex(that.data.currentSegment.segmentId)), 0,1500);
				if((that.myscroll.y != null) && (typeof that.myscroll.y != 'undefined'))
				{
					that.initialPointY = that.myscroll.y;
				}
			}, 10);
			this.initAllSegmentsSeatMaps();
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MEnhancedSeatMap",
						data:this.data
					});
			}
		},

		initAllSegmentsSeatMaps: function() {
			var currentSegment = this.data.currentSegment;
			var segment = this.requestParam.allSegments[this.seatSegment];
			isSeatMapAvailableForSegment = false;
			for(var j=0;j<this.data.allSeatMaps.length;j++)
			{
				if(!this.utils.isEmptyObject(segment) && (segment.segmentId == this.data.allSeatMaps[j].segmentId))
				{
					isSeatMapAvailableForSegment = true;
					if(this.seatSegment<this.requestParam.allSegments.length)
					{
						this.seatSegment++;
					}
				}
			}
			if(!isSeatMapAvailableForSegment && !this.utils.isEmptyObject(segment))
			{
				currentSegment = segment;
				this.getSeatMapForSegment(currentSegment,false,this.__initAllSegmentsCallback);
			}
			else
			{
				if(this.seatSegment<this.requestParam.allSegments.length)
				{
					this.initAllSegmentsSeatMaps();
				}
			}
		},

		__initAllSegmentsCallback: function(response){
			var that = this;
			var returnedResponse = {};
			var seatMapData = {};
			if(!that.utils.isEmptyObject(response) && !that.utils.isEmptyObject(response.responseJSON) && !that.utils.isEmptyObject(response.responseJSON.data) && !that.utils.isEmptyObject(response.responseJSON.data.servicing))
			{
				returnedResponse = returnedResponse = response.responseJSON.data.servicing.MEnhancedSeatMap || {};
				seatMapData = {"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"seatMapPanel":returnedResponse.requestParam.seatmappanelbean,"columnsList":returnedResponse.requestParam.columnsList || []};
				var listTravellers = returnedResponse.requestParam.seatmappanelbean.listTravellers || {};
				if(that.utils.booleanValue(returnedResponse.requestParam.seatmappanelbean.displayTravellerInfo))
				{
					that.data.allTravellersMap.push({"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"travellers":returnedResponse.requestParam.seatmappanelbean.listTravellers.travellers});
				}
				that.data.allSeatMaps.push(seatMapData);
				this.initPreselectedSeats();
				this.seatSegment++;
			}
			that.initAllSegmentsSeatMaps();
		},

		__initData: function() {
			/*Added at the time of R14SP1 CR 6414833:*** Fix It *** For better accessibility */
			var model = this.moduleCtrl.getModuleData().servicing.MEnhancedSeatMap;
			this.data = {};
			this.siteParams = model.siteParam;
			this.globalList = model.globalList;
			this.labels = model.labels;
			this.requestParam = model.requestParam;
			this.errorStrings = model.errors || [];
			this.data.selectedSeat = "";

			this.data.allSeatMaps = new Array();
			this.data.allSeatMaps.push({"segmentId":this.requestParam.request.SEGMENT_ID,"seatMapPanel":this.requestParam.seatmappanelbean,"columnsList":this.requestParam.columnsList});
			this.data.currentSegment = {};
			this.data.allTravellersMap = new Array();
			var travellers = [];
			if(!this.utils.isEmptyObject(this.requestParam.seatmappanelbean.listTravellers))
			{
				travellers = this.requestParam.seatmappanelbean.listTravellers.travellers;
			}
			this.data.allTravellersMap.push({"segmentId":this.requestParam.request.SEGMENT_ID,"travellers": travellers});
			this.changeCurrentSegment(null,{"segmentId":this.requestParam.request.SEGMENT_ID});
			this.setCurrentSeatMap(this.data.currentSegment);
			this.setCurrentTravellersMap(this.data.currentSegment.segmentId);

			this.data.decks = [];
			for(var i=0; i<this.requestParam.allSegments.length; i++)
			{
				this.data.decks[i] = "MAIN";
			}

			/*In case of coming from the bookmarks page, then the pre-selected seats should be highlighted */
			this.initSeatsData();
			this.initPreselectedSeats();

			this.clearSelectedSeat();

			this.data.selectedFilters = [];

		},

		scrollee: function(event, args) {
			var page = $("[id$=_seatHeader]") ;
			if(!this.utils.isEmptyObject(page)){
				if(page.length>0){
					page=page[0];

					var footer = document.getElementById('stmpFooterId');

					footer.className = footer.className.replace(/(?:^|\s)animate(?!\S)/g, '');
					footer.className += ' animate';

					window.setTimeout(function() {
						footer.className = footer.className.replace(/(?:^|\s)animate(?!\S)/g, '');
					}, 2000);

					if((page != null) && (typeof page != 'undefined'))
					{
						page.className = page.className.replace(/(?:^|\s)animate(?!\S)/g, '');
						page.className += ' animate';

						if ((this.myscroll != null) && (typeof this.myscroll != 'undefined') && (this.myscroll.y != null) && (typeof this.myscroll.y != 'undefined') && (this.myscroll.y == this.initialPointY)){
							page.className = page.className.replace(/(?:^|\s)animate(?!\S)/g, '');
						}
					}
				}					
			}			
		},

		/**
		* Initializes the already selected seats for the particular segments
		**/
		initSeatsData: function() {
			var basket = this.moduleCtrl.getBasket() || {};
			if (!this.utils.isEmptyObject(basket)) {
				var seatsCategory = basket.perCategory['SIT'] || {};
				if (!this.utils.isEmptyObject(seatsCategory)) {
					var seatsTags = seatsCategory.inputTags;
					for (seatTag in seatsTags) {
						for(var i=0; i<this.data.allTravellersMap.length; i++)
						{
							var currentSegment = this.data.allTravellersMap[i].segmentId || {};
							if (currentSegment == seatTag.charAt(seatTag.length - 1)) {
								var seatNum = seatsTags[seatTag];
								var travellerId = seatTag.substring(seatTag.length - 3, seatTag.length - 2);
								args = {
										"seatNum": seatNum,
										"segmentId": currentSegment,
										"travellerId": travellerId,
										"action" : "modify",
										"updateCurrentTravellerMap" : false
									};
								this.modifySeat(null,args);
							}
						}
					}
				}
			}
		},

		initPreselectedSeats: function() {
			var seatsAssingmentBean = this.requestParam.listSeatAssignementBean || {};
			var seatAssignmentMap = seatsAssingmentBean.seatAssignementsMap || {};
			for(seatAssignment in seatAssignmentMap)
			{
				var seatsData = seatAssignmentMap[seatAssignment];
				var currentSegment = seatAssignment;
				for(paxSeatData in seatsData)
				{
					var paxData = seatsData[paxSeatData];
					var travellerId = paxSeatData;
					var seatNum = paxData.seatAssignement || {};
					if(!this.utils.isEmptyObject(seatNum))
					{
						var key = 'PreSelectedSeat_'+travellerId+'_'+this.__getItineraryIndex(currentSegment)+"_"+currentSegment;
						this.preSelectedSeats[key] = seatNum;
						args = {
							"seatNum": seatNum,
							"segmentId": currentSegment,
							"travellerId": travellerId,
							"action" : "modify",
							"updateCurrentTravellerMap" : false
						};
						this.modifySeat(null,args);
					}
				}
			}
		},

		__getItineraryIndex: function(currentSegment) {
			var itineraryIndex = 0;
			for(var i=0; i<this.requestParam.allSegments.length; i++)
			{
				var segment = this.requestParam.allSegments[i];
				if(segment.segmentId == currentSegment)
				{
					itineraryIndex = segment.itineraryIndex;
				}
			}
			return itineraryIndex
		},

		/*
			Function that changes the current seat map in display
			Called in 3 different cases :
				1. when user swipes to next seat map
				2. when user clicks on any segment in header
				3. when user clicks on next flight button
		*/
		changeCurrentSegment: function(event,args) {
			var segmentId = args.segmentId || null;
			var indicator = args.indicator || null;
			if(this.data.currentSegment.segmentId == segmentId){
				var scroll = this.utils.booleanValue(args.scroll) || false;
				if(scroll)
				{
					this.myscroll.scrollToPage((this.getSegmentIndex(this.data.currentSegment.segmentId)), 0,1500);
				}
			} else {
				for(var i=0;i<this.requestParam.allSegments.length;i++)
				{
					if(this.utils.isEmptyObject(indicator) && !this.utils.isEmptyObject(segmentId))
					{
						if(this.requestParam.allSegments[i].segmentId == segmentId)
						{
							aria.templates.RefreshManager.stop();
							aria.utils.Json.setValue(this.data, 'currentSegment', this.requestParam.allSegments[i]);
							this.setCurrentSeatMap(this.requestParam.allSegments[i]);
							this.setCurrentTravellersMap(this.data.currentSegment.segmentId);
							var scroll = this.utils.booleanValue(args.scroll) || false;
							if(scroll)
							{
								this.myscroll.scrollToPage((this.getSegmentIndex(this.data.currentSegment.segmentId)), 0,1500);
							}
							aria.templates.RefreshManager.resume();
						}
					}
					else if(!this.utils.isEmptyObject(indicator) && this.utils.isEmptyObject(segmentId))
					{
						if(this.requestParam.allSegments[i].segmentId == this.data.currentSegment.segmentId)
						{
							switch(indicator)
							{
								case 'next': aria.templates.RefreshManager.stop();
											 aria.utils.Json.setValue(this.data, 'currentSegment', this.requestParam.allSegments[i+1]);
											 this.setCurrentSeatMap(this.requestParam.allSegments[i+1]);
											 this.setCurrentTravellersMap(this.data.currentSegment.segmentId);
											 this.myscroll.scrollToPage((this.getSegmentIndex(this.data.currentSegment.segmentId)), 0,1500);
											 aria.templates.RefreshManager.resume();
											 return;
								case 'previous': aria.templates.RefreshManager.stop();
												 aria.utils.Json.setValue(this.data, 'currentSegment', this.requestParam.allSegments[i-1]);
												 this.setCurrentSeatMap(this.requestParam.allSegments[i-1]);
												 this.setCurrentTravellersMap(this.data.currentSegment.segmentId);
												 this.myscroll.scrollToPage((this.getSegmentIndex(this.data.currentSegment.segmentId)), 0,1500);
												 aria.templates.RefreshManager.resume();
												 return;
								default: return;
							}
						}
					}
					else {
						return;
					}
				}
			}
			/* to reset the selected seat variable */
			this.clearSelectedSeat(null,{refresh:true});
		},

		/*
			Sets the this.currentSeatMap variable.
			If the seat map for current Segment is not available, calls the function to make server request
		*/
		setCurrentSeatMap: function(segment) {
			var isSeatmapAvailable = false;
			this.data.selectedFilters = [];
			this.clearSelectedSeat();
			for(var i=0; i<this.data.allSeatMaps.length; i++)
			{
				if(this.data.allSeatMaps[i].segmentId == segment.segmentId)
				{
					aria.utils.Json.setValue(this.data, 'currentSeatMap', this.data.allSeatMaps[i]);
					isSeatmapAvailable = true;
					this.setCurrentTravellersMap(this.data.currentSegment.segmentId);
				}
			}
			if(!isSeatmapAvailable)
			{
				this.getSeatMapForSegment(segment,true,this.__setCurrentSeatCallback);
			}
		},

		__setCurrentSeatCallback: function(response){
			this.utils.hideMskOverlay();
			var returnedResponse = {};
			var seatMapData = {};
			if(!this.utils.isEmptyObject(response) && !this.utils.isEmptyObject(response.responseJSON) && !this.utils.isEmptyObject(response.responseJSON.data) && !this.utils.isEmptyObject(response.responseJSON.data.servicing))
			{
				returnedResponse = response.responseJSON.data.servicing.MEnhancedSeatMap;
				seatMapData = {"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"seatMapPanel":returnedResponse.requestParam.seatmappanelbean,"columnsList":returnedResponse.requestParam.columnsList};
				var listTravellers = returnedResponse.requestParam.seatmappanelbean.listTravellers || {};
				if(this.utils.booleanValue(returnedResponse.requestParam.seatmappanelbean.displayTravellerInfo) && !this.utils.isEmptyObject(returnedResponse.requestParam.seatmappanelbean.listTravellers))
				{
					this.data.allTravellersMap.push({"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"travellers":returnedResponse.requestParam.seatmappanelbean.listTravellers.travellers});
				}
				this.data.allSeatMaps.push(seatMapData);
				this.initPreselectedSeats();
				aria.utils.Json.setValue(this.data, 'currentSeatMap', seatMapData);
				this.setCurrentTravellersMap(this.data.currentSegment.segmentId);
			}
			aria.utils.Json.setValue(this.data, 'currentSeatMap', seatMapData);
			this.utils.hideMskOverlay();
		},

		/*
			This function makes an ajax call to the server to fetch the data of the next seat map.
			takes arguments segment and a callback function.
			segment contains the segment bean for which the seat map needs to be fetched
			If the fn variable is empty, default callback method called, else the callback declared is called
		*/
		getSeatMapForSegment: function(segment,showLoadingIcon,fn) {
			var seatmap = {};
			var params = {};
			var showLoadingIcon = showLoadingIcon || false;

			params = this.constructParams(segment);
			if(this.requestParam.IS_SEAT_SERVICING == 'FALSE' || this.utils.booleanValue(this.siteParams.merciServiceCatalog))
			{
				var filteredParams = ['SITE', 'LANGUAGE', 'PAGE_TICKET', 'BOOKING_CLASS', 'B_AIRPORT_CODE', 'E_AIRPORT_CODE',
					'B_DATE', 'B_TIME', 'E_TIME', 'EQUIPMENT_TYPE', 'DECK', 'AIRLINE_CODE','FLIGHT', 'SEGMENT_ID',
					'itinerary_index', 'HAS_OTHER_SEGMENTS','IS_SEAT_SERVICING', 'FROM_PAX', 'PROFILE_ID',
					'SERVICE_PRICING_MODE', 'updateInfoSuccess', 'REGISTER_START_OVER', 'PAGE_TICKET',
					'DIRECT_RETRIEVE_LASTNAME', 'JSP_NAME_KEY', 'TRAV_LIST_SIZE','LIST_TRAVELLER_INFORMATION',
					'TRAVELLER_INFORMATION', 'TRAVELLER_NUMBER'];
				for(key in this.requestParam.request)
				{
					if (this.requestParam.request.hasOwnProperty(key) && (filteredParams.indexOf(key) < 0) && (key != 'SEATS_INFORMATIONS'))
					{
						params[key] = this.requestParam.request[key];
					}
				}
			}
			var paramsString = "";
			for(param in params)
			{
				paramsString = paramsString + param + "=" + params[param] + "&";
			}

			if(fn)
			{
				var cbFunction = fn;
			}
			else
			{
				var cbFunction = this.asyncCallback
			}
			var request = {
				action: 'MSeatMap.action',
				method: 'POST',
				loading: showLoadingIcon,
				expectedResponseType: 'json',
				cb: {
					fn: cbFunction,
					scope: this
				},
				parameters:paramsString,
				updateJsonResponse:false
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		constructParams: function(segment,action) {
			var action = action || 'SELECT';
			var params = {};
			params['upsellOutLow'] = this.requestParam.request.upsellOutLow || "";
			params['upsellInLow'] = this.requestParam.request.upsellInLow || "";
			params['TRIP_TYPE'] = this.requestParam.request.TRIP_TYPE || "";
			params['PAGE_TICKET'] = this.requestParam.request.PAGE_TICKET || "";
			var numberOfTraveller = "";
			var lastName = "";
			if(!this.utils.isEmptyObject(this.requestParam.seatmappanelbean.listTravellers))
			{
				numberOfTraveller = this.requestParam.seatmappanelbean.listTravellers.numberOfTraveller || "";
				lastName = this.requestParam.seatmappanelbean.listTravellers.primaryTraveller.identityInformation.lastName || "";
			}
			if(this.utils.isEmptyObject(lastName) && !this.utils.isEmptyObject(this.requestParam.request.DIRECT_RETRIEVE_LASTNAME))
			{
				lastName = this.requestParam.request.DIRECT_RETRIEVE_LASTNAME;
			}
			params['TRAV_LIST_SIZE'] = numberOfTraveller || "";
			params['DIRECT_RETRIEVE_LASTNAME'] = lastName || "";
			params['REGISTER_START_OVER'] = "false";
			params['updateInfoSuccess'] = "21300045";
			params['PROFILE_ID'] = this.requestParam.merciDeviceBean.DEVICE_TYPE || "";
			params['FROM_PAX'] = "TRUE";
			params['result'] = "json";
			params['continue'] = "TRUE";
			params['OUTPUT_TYPE'] = "2";
			params['SERVICE_PRICING_MODE'] = "UPDATE_PRICE";
			params['IS_SEAT_SERVICING'] = this.requestParam.request.IS_SEAT_SERVICING || "";
			params['SITE'] = this.requestParam.request.SITE;
			params['LANGUAGE'] = this.requestParam.request.LANGUAGE;
			params['SEGMENT_ID'] = segment.segmentId;
			if(action == 'SELECT')
			{
				params['BOOKING_CLASS'] = segment.cabins[0].RBD;
				params['B_AIRPORT_CODE'] = segment.beginLocation.locationCode;
				params['E_AIRPORT_CODE'] = segment.endLocation.locationCode;
				params['B_DATE'] = segment.beginDateBean.yearMonthDay;
				params['B_TIME'] = segment.beginDateBean.formatTimeAsHHMM;
				params['EQUIPMENT_TYPE'] = segment.equipmentCode;
				params['E_TIME'] = segment.endDateBean.formatTimeAsHHMM;
				params['DECK'] = "L";
				params['AIRLINE_CODE'] = segment.defaultAirline.code;
				params['FLIGHT'] = segment.flightNumber;
				params['SEGMENT_ID'] = segment.segmentId;
				params['itinerary_index'] = segment.itineraryIndex;
			}
			if(this.utils.booleanValue(this.requestParam.request.IS_SEAT_SERVICING) || this.utils.booleanValue(this.requestParam.request.isReterieve))
			{
				params['REC_LOC'] = this.requestParam.request.REC_LOC;
				params['ACTION'] = 'MODIFY';
			}
			params['FLOW_TYPE'] = this.requestParam.request.FLOW_TYPE || "";
			return params;
		},

		/*
			default callback method of the getSeatMapForSegment method
		*/
		asyncCallback: function(response) {
			this.utils.hideMskOverlay();
			var returnedResponse = {};
			var seatMapData = {};
			if(!this.utils.isEmptyObject(response) && !this.utils.isEmptyObject(response.responseJSON) && !this.utils.isEmptyObject(response.responseJSON.data) && !this.utils.isEmptyObject(response.responseJSON.data.servicing))
			{
				returnedResponse = returnedResponse = response.responseJSON.data.servicing.MEnhancedSeatMap || {};
				seatMapData = {"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"seatMapPanel":returnedResponse.requestParam.seatmappanelbean,"columnsList":returnedResponse.requestParam.columnsList};
				var listTravellers = returnedResponse.requestParam.seatmappanelbean.listTravellers || {};
				if(this.utils.booleanValue(returnedResponse.requestParam.seatmappanelbean.displayTravellerInfo))
				{
					this.data.allTravellersMap.push({"segmentId":returnedResponse.requestParam.request.SEGMENT_ID,"travellers":returnedResponse.requestParam.seatmappanelbean.listTravellers.travellers});
				}
				this.data.allSeatMaps.push(seatMapData);
				this.initPreselectedSeats();
			}

		},

		/*
			this function returns an array of strings in the order in which facilities sould be displayed on the UI
		*/
		constructFacilitiesMap:function(row,aircraftFacilities,columnsList,facilityPosition) {
			var facilitiesMap = [];
			var facilities = row.facilities;
			var position = ((facilityPosition == 'rear') ? this.REAR : this.FRONT);

			for(var columnId=0;columnId<columnsList.length;columnId++)
			{
				facilitiesMap.push("-");
			}
			facilitiesMapIdLeft=[];
			facilitiesMapIdRight=[];
			facilitiesMapIdCenter=[];
			var length = columnsList.length-1;
			var leftIndex = 0;
			var rightIndex = columnsList.length-1;
			while(columnsList[leftIndex] != "")
			{
				facilitiesMapIdLeft.push(leftIndex);
				leftIndex++;
			}
			while(columnsList[rightIndex] != "")
			{
				facilitiesMapIdRight.push(rightIndex);
				rightIndex--
			}
			if(rightIndex != leftIndex)
			{
				for(var k=leftIndex; k<=rightIndex; k++)
				{
					if(columnsList[k] != "")
					{
						facilitiesMapIdCenter.push(k);
					}
				}
			}
			for(var facilityId=0; facilityId<facilities.length; facilityId++)
			{
				if(facilities[facilityId].location == position)
				{
					if(facilities[facilityId].position == this.LEFT)
					{
						for(leftId = 0; leftId<facilitiesMapIdLeft.length ; leftId++)
						{
							if(facilitiesMap[facilitiesMapIdLeft[leftId]] == "-")
							{
								facilitiesMap[facilitiesMapIdLeft[leftId]] = facilities[facilityId].type+"_"+facilities[facilityId].position;
								break;
							}
						}
					}
					if(facilities[facilityId].position == this.RIGHT)
					{
						for(rightId = 0; rightId<facilitiesMapIdRight.length ; rightId++)
						{
							if(facilitiesMap[facilitiesMapIdRight[rightId]] == "-")
							{
								facilitiesMap[facilitiesMapIdRight[rightId]] = facilities[facilityId].type+"_"+facilities[facilityId].position;
								break;
							}
						}
					}
					if(facilities[facilityId].position == this.CENTER)
					{
						for(centerId = 0; centerId<facilitiesMapIdCenter.length ; centerId++)
						{
							if(facilitiesMap[facilitiesMapIdCenter[centerId]] == "-")
							{
								facilitiesMap[facilitiesMapIdCenter[centerId]] = facilities[facilityId].type+"_"+facilities[facilityId].position;
								break;
							}
						}
					}
				}
			}
			return facilitiesMap;
		},

		setCurrentTravellersMap: function(segmentId) {
			this.data.currentTravellersMap = {};
			for(var i=0; i<this.data.allTravellersMap.length; i++)
			{
				if(this.data.allTravellersMap[i].segmentId == segmentId)
				{
					this.data.currentTravellersMap = this.data.allTravellersMap[i];
				}
			}
		},

		/*
			This function returns the class name for the div which contains the facility element
			eg. if lavatory is to be displayed, "sm-toilet" is returned
		*/
		getFacilitiesClassName:function(facilityType) {
			var facilityTypes = facilityType.split("_");
			var className = "sm-aisle";
			if(facilityTypes[0] == this.LAVATORY)
			{
				className="seat-toilet";
			}
			else if(facilityTypes[0] == this.EXIT_DOOR)
			{
				if(facilityTypes[1] == this.LEFT)
				{
					className="sm-exit-left";
				}
				else if(facilityTypes[1] == this.RIGHT)
				{
					className="sm-exit-right";
				}
			}
			else if(facilityTypes[0] == this.GALLEY)
			{
				className="seat-galley";
			}
			else if(facilityTypes[0] == this.STAIRS)
			{
				className="seat-stairs";
			}
			else if(facilityTypes[0] == this.CLOSET)
			{
				className="seat-closet";
			}
			else if(facilityTypes[0] == this.STORAGE)
			{
				className="seat-storage";
			}
			return className;
		},

		/*
			Function to determine if facility is present in the front
		*/
		isFacilityInFront: function(facilities) {
			var isFacilityInFront = false;
			for(var facilityId=0; facilityId<facilities.length; facilityId++)
			{
				var facility = facilities[facilityId];
				if(facility.location == this.FRONT)
				{
					isFacilityInFront = true;
				}
			}
			return isFacilityInFront;
		},



		/*
			Function that returns the index at which the particular segment is present in the allSegments data
		*/
		getSegmentIndex: function(segmentId) {
			var segmentIndex = 0;
			for(var segment=0; segment<this.requestParam.allSegments.length; segment++)
			{
				if(this.requestParam.allSegments[segment].segmentId == segmentId)
				{
					segmentIndex = segment;
				}
			}
			return segmentIndex;
		},

		/*
			Function which updates the header and the footer depending on to which seat map the user has scrolled
		*/
		scrollToSegment: function(segmentIndex) {
			if(this.getSegmentIndex(this.data.currentSegment.segmentId) != segmentIndex)
			{
				var allSegments = this.requestParam.allSegments;
				var currentSegment = allSegments[segmentIndex].segmentId;
				this.changeCurrentSegment(null,{"segmentId":currentSegment});
			}
		},

		isSeatEligibleSegment: function(segmentId){
			var seatsEligibleSegmentsArray = JSON.parse(this.requestParam.seatsEligibleSegments || "[]");
			var isSeatEligibleSegment = false;
			for(var i=0; i<seatsEligibleSegmentsArray.length; i++)
			{
				if(seatsEligibleSegmentsArray[i] == segmentId)
				{
					isSeatEligibleSegment = true;
				}
			}
			return isSeatEligibleSegment;
		},

		getColumsList: function(segmentId) {
			var columnsList = [];
			for(var i=0; i<this.data.allSeatMaps.length; i++)
			{
				if(this.data.allSeatMaps[i].segmentId == segmentId)
				{
					columnsList = this.data.allSeatMaps[i].columnsList || [];
				}
			}
			return columnsList;
		},

		getSeatMapForParticularSegment: function(segmentId) {
			var seatMapData = {};
			for(var i=0;i<this.data.allSeatMaps.length;i++)
			{
				if(this.data.allSeatMaps[i].segmentId == segmentId)
				{
					seatMapData = this.data.allSeatMaps[i];
				}
			}
			return seatMapData;
		},

		getDecksData: function(seatMap,deck) {
			var deck = deck || "MAIN";
			var decksData = {};
			decksData.rows = [];
			decksData.location = {};
			var seatMapPanel = seatMap.seatMapPanel || {};
			var legList = seatMapPanel.legList || {};
			for(var legId in legList)
			{
				var legData = legList[legId] || {};
				var aircraftMap = legData.aircraftMap || {};
				var cabins = aircraftMap.cabins || [];
				for(var cabinId=0;cabinId<cabins.length;cabinId++)
				{
					var cabin = cabins[cabinId];
					if(cabin.location == deck)
					{
						decksData.location = cabin.location;
						for(var rowId=0;rowId<cabin.rows.length;rowId++)
						{
							decksData.rows.push(cabin.rows[rowId]);
						}
					}
				}
			}
			return decksData;
		},

		isBassinetInRow: function(rowData) {
			var isBassinetInRow = false;
			var columns = rowData.columns;
			for(var columnId=0; columnId<columns.length; columnId++)
			{
				var column = columns[columnId];
				var element = column.element;
				var characteristics = element.characteristics || [];
				for(var characteristicId =0; characteristicId<characteristics.length; characteristicId++)
				{
					if(characteristics[characteristicId] == this.BASSINET_SEAT)
					{
						isBassinetInRow = true;
					}
				}
			}
			return isBassinetInRow;
		},

		getBassinetMap: function(rowData, columnsList) {
			var bassinetMap = [];
			var columns = rowData.columns;
			for(var bassinetIndex=0; bassinetIndex<columnsList.length; bassinetIndex++)
			{
				bassinetMap[bassinetIndex] = "-";
			}
			for(var columnId=0; columnId<columns.length; columnId++)
			{
				var column = columns[columnId];
				var element = column.element;
				var characteristics = element.characteristics || [];
				for(var characteristicId =0; characteristicId<characteristics.length; characteristicId++)
				{
					if(characteristics[characteristicId] == this.BASSINET_SEAT)
					{
						for(var bassinetIndex=0; bassinetIndex<columnsList.length; bassinetIndex++)
						{
							if(columnsList[bassinetIndex] == columns[columnId].index)
							{
								bassinetMap[bassinetIndex] = characteristics[characteristicId];
							}
						}
					}
				}
			}
			return bassinetMap;
		},

		isSeatOccupied: function(row, columnId) {
			var columns = row.columns;
			var isOccupied = true;
			for(var columnIndex=0; columnIndex<columns.length; columnIndex++)
			{
				if(columns[columnIndex].index == columnId)
				{
					var column = columns[columnIndex];
					var element = column.element;
					if((element.status == this.AVAILABLE) && (element.occupation == this.FREE_SEAT))
					{
						isOccupied = false;
					}
				}
			}
			return isOccupied;
		},

		isChargeableSeat: function(row, columnId) {
			var columns = row.columns;
			var isChargeable = false;
			for(var columnIndex=0; columnIndex<columns.length; columnIndex++)
			{
				if(columns[columnIndex].index == columnId)
				{
					var column = columns[columnIndex];
					var element = column.element;
					var characteristics = element.characteristics;
					for(var characteristicId=0; characteristicId<characteristics.length; characteristicId++)
					{
						if(characteristics[characteristicId] == this.CHARGEABLE_SEAT)
						{
							isChargeable = true;
						}
					}
				}
			}
			return isChargeable;
		},

		isFacilityInRear: function(facilities) {
			var isFacilityInRear = false;
			for(var facilityId=0; facilityId<facilities.length; facilityId++)
			{
				var facility = facilities[facilityId];
				if(facility.location == this.REAR)
				{
					isFacilityInRear = true;
				}
			}
			return isFacilityInRear;
		},

		isUpperDeckPresent: function(seatMap) {
			var isUpperDeckPresent = false;
			var seatMapPanel = seatMap.seatMapPanel || {};
			var legList = seatMapPanel.legList || {};
			for(var legId in legList)
			{
				var legData = legList[legId] || {};
				var aircraftMap = legData.aircraftMap || {};
				var cabins = aircraftMap.cabins || [];
				for(var cabinId=0;cabinId<cabins.length;cabinId++)
				{
					var cabin = cabins[cabinId];
					if(cabin.location == this.UPPER_DECK)
					{
						isUpperDeckPresent = true;
					}
				}
			}
			return isUpperDeckPresent;
		},

		selectSeat: function(event,args) {
			var selectedSeat = args.seatNum;
			var travellers = this.data.currentTravellersMap.travellers || [];
			for(var i=0; i<travellers.length; i++)
			{
				if(this.utils.isEmptyObject(travellers[i].selectedSeat) && (this.isSeatSelected(selectedSeat) == null))
				{
					travellers[i].selectedSeat = selectedSeat;
					this.data.currentTravellersMap.travellers[i] = travellers[i];
					break;
				}
			}
			for(var j=0; j<this.data.allTravellersMap.length; j++)
			{
				if(this.data.currentTravellersMap.segmentId == this.data.allTravellersMap[j].segmentId)
				{
					this.data.allTravellersMap[j] = this.data.currentTravellersMap;
				}
			}
			aria.utils.Json.setValue(this.data, 'selectedSeat', selectedSeat);
			this.$refresh({
			    section : 'seatList'
			});
			/*var currentSegmentIndex = this.getSegmentIndex(this.data.currentSegment.segmentId);
			var currentSeatMapLi = document.getElementById("seatMap_"+currentSegmentIndex);
			var currentSeatMapLiOffset = currentSeatMapLi.offsetWidth;
			var pageY = event.pageY || 0;
			var seatRowIndex = selectedSeat.substring(0,selectedSeat.length-1);
			this.myscroll.scrollToPage((this.getSegmentIndex(this.data.currentSegment.segmentId)),seatRowIndex,0);*/
		},

		isSeatSelected: function(seatNum) {
			var whichPax = null;
			var travellers = this.data.currentTravellersMap.travellers || [];
			for(var i=0; i<travellers.length; i++)
			{
				var traveller = travellers[i];
				if(traveller.selectedSeat == seatNum)
				{
					whichPax = traveller.paxNumber;
				}
			}
			return whichPax
		},

		setPointerPosition: function(seatNum) {
			var seatNumber = seatNum || "";
			if(!this.utils.isEmptyObject(seatNum) && !this.utils.isEmptyObject(this.data.currentSegment))
			{
				var seatColumnIndex = seatNumber.substr(seatNumber.length-1, 1);
				var columns = this.data.currentSeatMap.columnsList || [];
				var seatColumnPosition = 0;
				for(var i=0; i<columns.length; i++)
				{
					if(columns[i] == seatColumnIndex)
					{
						seatColumnPosition = i;
					}
				}
				var seatrow = document.getElementsByClassName("sm-row");
				var seatRowOffset = seatrow[0].offsetWidth;
				var currentSegmentIndex = this.getSegmentIndex(this.data.currentSegment.segmentId);
				var currentSeatMapLi = document.getElementById("seatMap_"+currentSegmentIndex);
				var currentSeatMapLiOffset = currentSeatMapLi.offsetWidth;
				var pointerPositionLeft = (((seatColumnPosition+1)/(columns.length+2))*seatRowOffset)+((currentSeatMapLiOffset-seatRowOffset)/2);//(pageX)/(currentSeatMapLi.offsetWidth)*100;
				var pointerPositionRight = (((columns.length+2-seatColumnPosition+1)/(columns.length+2))*seatRowOffset)+((currentSeatMapLiOffset-seatRowOffset)/2);
				var pointer = document.getElementById("pointer");
				if(!this.utils.isEmptyObject(pointer))
				{
					pointer.style.left = Math.floor( pointerPositionLeft )+"px";
					pointer.style.right = Math.floor( pointerPositionRight )+"px";
				}
			}

		},

		modifySeat: function(event, args) {
			var selectedSeat = args.seatNum;
			var segmentId = args.segmentId;
			var travellerId = args.travellerId;
			var updateCurrentTravellerMap = args.updateCurrentTravellerMap || false;
			for(var i=0; i<this.data.allTravellersMap.length; i++)
			{
				var travellerMap = this.data.allTravellersMap[i];
				if(travellerMap.segmentId == segmentId)
				{
					var travellers = travellerMap.travellers;
					for(var j=0; j<travellers.length; j++)
					{
						var traveller = travellers[j];
						if(traveller.paxNumber == travellerId)
						{
							if(args.action == 'change')
							{
								traveller.selectedSeat = selectedSeat;
							}
							else if (args.action == 'delete')
							{
								traveller.selectedSeat = "";
								this.clearSelectedSeat();
							}
							else
							{
								traveller.selectedSeat = selectedSeat;
							}
						}
						else
						{
							if(traveller.selectedSeat == selectedSeat && args.action != 'delete')
							{
								traveller.selectedSeat = "";
								this.$refresh({
								    section : 'seatList'
								});
							}
						}
						travellers[j] = traveller;
					}
					travellerMap.travellers = travellers;
					if(this.utils.booleanValue(updateCurrentTravellerMap))
					{
						var rowInt = args.rowInt || rowInt;
						this.data.currentTravellersMap = travellerMap;
						this.$refresh({
						    section : 'seatTeaser_'+segmentId+"_"+rowInt
						});
						this.$refresh({
						    section : 'seatList'
						});
					}
				}
				this.data.allTravellersMap[i] = travellerMap
			}

		},

		isSelectedSeatInRow: function(rowData,segmentId) {
			var selectedSeatRowIndex = this.data.selectedSeat.substring(0,this.data.selectedSeat.length-1);
			var rowIndex = rowData.index;
			if((selectedSeatRowIndex == rowIndex) && (this.data.currentSegment.segmentId == segmentId))
			{
				return true;
			}
			else
			{
				return false;
			}
		},

		clearSelectedSeat: function(event,args) {
			aria.utils.Json.setValue(this.data, 'selectedSeat', "");
			if(!this.utils.isEmptyObject(args) && this.utils.booleanValue(args.refresh))
			{
				this.$refresh({
				    section : 'seatList'
				});
			}
		},

		getSeatData: function(seatNum) {
			var seatRowIndex = seatNum.substring(0,seatNum.length-1);
			var seatColumnIndex = seatNum.substr(seatNum.length-1, 1);
			var seatmapPanel = this.data.currentSeatMap.seatMapPanel || {};
			var legList = seatmapPanel.legList || {};
			var seat = {};
			for(leg in legList)
			{
				var legData = legList[leg];
				var aircraftMap = legData.aircraftMap || {};
				var cabins = aircraftMap.cabins || [];
				for(var i=0; i<cabins.length; i++)
				{
					var cabin = cabins[i];
					var rows = cabin.rows;
					for(var j=0; j<rows.length;j++)
					{
						var row = rows[j];
						if(row.index == seatRowIndex)
						{
							var columns = row.columns;
							for(var k=0; k<columns.length; k++)
							{
								var column = columns[k];
								if(column.index == seatColumnIndex)
								{
									seat = column.element;
								}
							}
						}
					}
				}
			}
			var seatData = {"price":{},"description":"","characteristics":{}};
			seatData.price = this.getSeatPrice(seat);
			seatData.description = this.getSeatDescription(seat);
			seatData.characteristics = this.getSeatCharacteristics(seat);
			return seatData;
		},

		getSeatCharacteristics: function(seat) {
			var seatCharacteristics = seat.characteristics || [];
			return seatCharacteristics;
		},

		getSeatPrice: function(seat) {
			var price = {};
			price.value = 0;
			price.currency = {};
			var travellerPrices = seat.travellerPrices || {};
			for(travellerPrice in travellerPrices)
			{
				if(travellerPrice != 'aria:parent')
				{
					priceDetails = travellerPrices[travellerPrice];
					price.value = price.value + priceDetails[0].value;
					price.currency = priceDetails[0].currency;
				}
			}
			price.value = price.value/this.data.currentTravellersMap.travellers.length;
			return price;
		},

		getSeatDescription: function(seat) {
 			var description = "";
 			var seatMap = this.data.currentSeatMap || {};
 			var seatmapPanel = seatMap.seatMapPanel || {};
 			var dictionary = seatmapPanel.dictionary || {};
 			var charsList = dictionary.seatCharacs || {};
 			var seatCharacteristics = seat.characteristics || [];
 			for(var i=0; i<seatCharacteristics.length; i++)
 			{
 				if(i<seatCharacteristics.length-1)
 				{
 					description = description + charsList[seatCharacteristics[i]] + ",";
 				}
 				else
 				{
 					description = description + charsList[seatCharacteristics[i]];
 				}
 			}
 			return description;
		},

		getDisplaySpanClass: function(travellerIndex) {
			var travellersMap = this.data.currentTravellersMap;
			var travellerData = travellersMap.travellers[travellerIndex] || {};
			var travellerSeat = travellerData.selectedSeat || {};
			var currentSelectedSeat = this.data.selectedSeat;
			var spanClass = "";
			if(!this.utils.isEmptyObject(travellerSeat))
			{
				if(travellerSeat == currentSelectedSeat)
				{
					spanClass = "delete";
				}
				else
				{
					spanClass = "change";
				}
			}
			return spanClass;
		},

		changeCurrentDeck: function(event,args) {
			var deck = args.deck;
			var index = args.index;
			this.data.decks[index] = deck;
			this.$refresh({
			    section : 'seatList'
			});
		},

		getWhichDeck: function(index) {
			var whichDeck = this.data.decks[index] || "MAIN";
			return whichDeck;
		},

		__displayErrors: function() {

			var errors = this.requestParam.reply.listMsg;
			this.data.BEerrors = new Array();
			if (!this.utils.isEmptyObject(errors)) {
				for (var error in errors) {
					var errorNumber = errors[error].NUMBER;
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

		proceedToPayment: function(event, args) {
			if(this.utils.booleanValue(this.siteParams.merciServiceCatalog))
			{
				this.proceedToCatalog();
			}
			else
			{
				this.proceedToPurchasePage(this.requestParam.allSegments[this.requestParam.allSegments.length-1]);
			}
		},

		proceedToPurchasePage: function(segment) {
			var params = {};
			var ans = true;
			if(this.isChargeableSeatSelected())
			{
				ans = this.getConfirmation();
			}
			if(ans)
			{
				//params = this.constructParams(segment);
				var filteredParams = ['SITE', 'LANGUAGE', 'PAGE_TICKET', 'BOOKING_CLASS', 'B_AIRPORT_CODE', 'E_AIRPORT_CODE',
					'B_DATE', 'B_TIME', 'E_TIME', 'EQUIPMENT_TYPE', 'DECK', 'AIRLINE_CODE','FLIGHT', 'SEGMENT_ID',
					'itinerary_index', 'HAS_OTHER_SEGMENTS','IS_SEAT_SERVICING', 'FROM_PAX', 'PROFILE_ID',
					'SERVICE_PRICING_MODE', 'updateInfoSuccess', 'REGISTER_START_OVER', 'PAGE_TICKET',
					'DIRECT_RETRIEVE_LASTNAME', 'JSP_NAME_KEY', 'TRAV_LIST_SIZE','LIST_TRAVELLER_INFORMATION',
					'TRAVELLER_INFORMATION', 'TRAVELLER_NUMBER'];
				if(this.utils.booleanValue(this.requestParam.request.IS_SEAT_SERVICING) || this.utils.booleanValue(this.requestParam.request.isReterieve))
				{
					params = this.constructParams(segment,'MODIFY');
					for(var preSelectedSeat in this.preSelectedSeats)
					{
						params[preSelectedSeat] = this.preSelectedSeats[preSelectedSeat];
					}
					filteredParams.push('seatNos');
					filteredParams.push('seatsEligibleSegments');
					filteredParams.push('OFFICE_ID');
					filteredParams.push('isReterieve');
					filteredParams.push('REQUEST_INFO');
					filteredParams.push('DISPLAY_OTHER_PAX');
					filteredParams.push('LAST_NAMES');
					filteredParams.push('FARE_TYPE_CODE');
				}
				else
				{
					params = this.constructParams(segment);
				}
				for(key in this.requestParam.request)
				{
					if (this.requestParam.request.hasOwnProperty(key) && (filteredParams.indexOf(key) < 0) && (key != 'SEATS_INFORMATIONS'))
					{
						params[key] = this.requestParam.request[key];
					}
					if (key == 'HAS_OTHER_SEGMENTS')
					{
						params[key] = "FALSE";
					}
				}
				if(this.isChargeableSeatSelected())
				{
					params['isChargeableSeatInSegment'] = true;
				}
				else
				{
					params['isChargeableSeatInSegment'] = false;
				}
				var seatAssignments = this.__createInputParams();
				for(seat in seatAssignments)
				{
					params[seat] = seatAssignments[seat];
				}
				var paramsString = "";
				for(param in params)
				{
					paramsString = paramsString + param + "=" + params[param] + "&";
				}
				var actionName = this.getActionName();
				var request = {
					action: actionName,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__onProceedPayCallback,
						scope: this
					},
					parameters:paramsString
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}
		},

		__onProceedPayCallback: function(response, params) {
			// navigate to next tpl
			this.utils.navigateCallback(response, this.moduleCtrl, false);
		},

		getConfirmation: function() {
			var user_confirmation = confirm(this.labels.tx_merci_nwsm_warn_msg2);
			return user_confirmation;
		},

		isChargeableSeatSelected: function() {
			var allTravellersMap = this.data.allTravellersMap;
			var isChargeableSeatSelected = false;
			for(var i=0; i<this.data.allTravellersMap.length; i++)
			{
				var travellerMap = this.data.allTravellersMap[i];
				var travellers = travellerMap.travellers;
				for(var j=0; j<travellers.length; j++)
				{
					var traveller = travellers[j];
					var selectedSeat = traveller.selectedSeat || {};
					if(!this.utils.isEmptyObject(selectedSeat))
					{
						var seatData = this.getSeatData(selectedSeat);
						var seatCharacteristics = seatData.characteristics;
						for(var k=0; k<seatCharacteristics.length; k++)
						{
							if(seatCharacteristics[k] == this.CHARGEABLE_SEAT)
							{
								isChargeableSeatSelected = true;
							}
						}
					}
				}
			}
			return isChargeableSeatSelected;
		},

		getActionName: function() {
			var actionName = "MALPIAction.action";
			if(this.__isChargeableSeatEnabled())
			{
				actionName = "MRequestAdditionalInformationPurchaseMCFSR.action";
			}
			else
			{
				if(this.utils.booleanValue(this.requestParam.request.IS_SEAT_SERVICING) || this.utils.booleanValue(this.requestParam.request.isReterieve))
				{
					if(this.__isChargeableSeatEnabled())
					{
						actionName = "MRequestAdditionalInformationPurchaseMCFSR.action";
					}
					else
					{
						actionName = "MSeatMapChageReqParamAction.action";
					}
				}
			}
			return actionName;
		},

		__isChargeableSeatEnabled: function() {
			var siteParams = this.siteParams;
			return siteParams.siteChargeableSeat != null && siteParams.siteChargeableSeat.toLowerCase() == 'true' && siteParams.siteSpecServChargeable != null && siteParams.siteSpecServChargeable.toLowerCase() == 'true';
		},

		__createInputParams: function() {
			var inputParams = {};
			for(var i=0; i<this.data.allTravellersMap.length; i++)
			{
				var travellerMap = this.data.allTravellersMap[i];
				var segmentId = travellerMap.segmentId;
				var travellers = travellerMap.travellers || [];
				for(var j=0; j<travellers.length; j++)
				{
					var traveller = travellers[j];
					if(!this.utils.isEmptyObject(traveller.selectedSeat))
					{
						var inputParamKey = ("PREF_AIR_SEAT_ASSIGMENT_" + traveller.paxNumber + "_" + segmentId);
						var inputParamValue = traveller.selectedSeat;
						inputParams[inputParamKey] = inputParamValue;
					}
				}
			}
			return inputParams;
		},

		proceedToCatalog: function() {
			var ans = true;
			if(this.isChargeableSeatSelected())
			{
				ans = this.getConfirmation();
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
		},

		adjustSegmentsWidth: function() {
			var sgmts = this.requestParam.allSegments;
			var deck = this.getDecksData(this.data.currentSeatMap, this.data.decks[this.getSegmentIndex(this.data.currentSegment)]) || {};
			var rows = deck.rows || [];
			var scrollerHeightLength = 35;
			if(rows.length != 0)
			{
				scrollerHeightLength = rows.length;
			}
			for(var i=0; i<rows.length; i++)
			{
				if(!this.utils.isEmptyObject(rows[i].facilities))
				{
					if(this.isFacilityInRear(rows[i].facilities))
					{
						scrollerHeightLength++;
					}
					if(this.isFacilityInFront(rows[i].facilities))
					{
						scrollerHeightLength++;
					}
				}
				if(this.isBassinetInRow(rows[i]))
				{
					scrollerHeightLength++;
				}
			}
			var scrollerWidth = 100 * sgmts.length;
			var liWidth = Math.round(1000 / sgmts.length) / 10;
			var scrollerHeight = 1.85 * scrollerHeightLength;

			document.getElementById("stmp_scroller").style.width = scrollerWidth.toString() + "%";
			document.getElementById("stmp_scroller").style.height = scrollerHeight.toString() + "rem";

			for (var sgmtId=0; sgmtId<sgmts.length; sgmtId++) {
				document.getElementById("seatMap_" + sgmtId).style.width = liWidth.toString() + "%";
			}
		},

		getButtonLabel:function() {
			var label = this.labels.tx_merci_text_booking_seat_to_payment;
			if(this.utils.booleanValue(this.siteParams.merciServiceCatalog)){
				label = this.labels.tx_merci_text_seatsel_btnsave;
			}
			else{
			 	if(!this.isChargeableSeatSelected() && (this.requestParam.request.isReterieve || this.requestParam.IS_SEAT_SERVICING)){
			 		label = this.labels.tx_merci_text_seatsel_btnsave;
			 	}
			}
			return label;
		},

		getHelpList: function() {
			var helpList = [];
			var currentSeatMap = this.data.currentSeatMap;
			var seatMapPanel = currentSeatMap.seatMapPanel || {};
			var dictionary = seatMapPanel.dictionary || {};
			if(!this.utils.isEmptyObject(dictionary))
			{

				var facilities = dictionary.facilities || {};
				var occupations = dictionary.occupations || {};
				var characteristics = dictionary.seatCharacs || {};
				helpList.push({"code":"S","text":this.labels.tx_merci_text_seatsel_selected,"classname":"seat-selected"});
				for(var occupation in occupations)
				{
					var occupationCode = occupation;
					if(occupationCode == "O")
					{
						helpList.push({"code":"O","text":occupations[occupationCode],"classname":"seat-occupied"});
					}
					if(occupationCode == "F")
					{
						helpList.push({"code":"F","text":occupations[occupationCode],"classname":"seat-available"});
					}
				}
				for(var characteristic in characteristics)
				{
					var characteristicCode = characteristic;
					if(characteristicCode == "CH")
					{
						helpList.push({"code":"CH","text":characteristics[characteristicCode],"classname":"seat-chargeable"});
					}
					if(characteristicCode == "B")
					{
						helpList.push({"code":"B","text":this.labels.tx_merci_text_seatsel_bassinet,"classname":"seat-bassinet"});
					}
				}
				for(var facility in facilities)
				{
					var facilityCode = facility;
					switch(facilityCode)
					{
						case 'CL': helpList.push({"code":"CL","text":facilities[facilityCode],"classname":"seat-closet"});
									break;
						case 'G' : helpList.push({"code":"G","text":facilities[facilityCode],"classname":"seat-galley"});
									break;
						case 'LA' : helpList.push({"code":"LA","text":facilities[facilityCode],"classname":"seat-toilet"});
									break;
						case 'ST' : helpList.push({"code":"ST","text":facilities[facilityCode],"classname":"seat-stairs"});
									break;
						case 'D': helpList.push({"code":"D","text":facilities[facilityCode],"classname":"seat-exit"});
									break;
						case 'SO': helpList.push({"code":"SO","text":facilities[facilityCode],"classname":"seat-storage"});
									break;
					}
				}
			}
			return helpList;
		},

		toggleAnimateDisplay: function(event,args) {
			var element = args.element || 'help';
			this.utils.toggleClass(document.getElementById(element),'animate');
		},

		constructCharacteristicsMap: function(currentSeatMap) {
			var currentSeatMap = currentSeatMap || {};
			var restrictedSeats = ["1","8"];
			var seatMapPanel = currentSeatMap.seatMapPanel || {};
			var dictionary = seatMapPanel.dictionary || {};
			var characteristicsMap = [];
			if(!this.utils.isEmptyObject(dictionary))
			{
				var seatCharacteristics = dictionary.seatCharacs || {};
				for(var charac in seatCharacteristics)
				{
					if ((restrictedSeats.indexOf(charac)<0) && (charac != 'aria:parent') )
					{
						var seatsNum = this.getSeatsWithCharacteristic(new Array(charac));
						var characteristicDetails = {'characteristicId':charac,'characteristic':seatCharacteristics[charac],'seatsCount':seatsNum};
						characteristicsMap.push(characteristicDetails);
					}
				}
			}
			return characteristicsMap;
		},

		getSeatsWithCharacteristic: function(characteristicsList){
			var seatMap = this.data.currentSeatMap;
			var seatCount = 0;
			var segmentIndex = this.getSegmentIndex(seatMap.segmentId);
			var deck = this.data.decks[segmentIndex];
			var decksData = this.getDecksData(seatMap,deck) || [];
			var rows = decksData.rows || [];
			for(var i=0; i<rows.length; i++)
			{
				var row = rows[i];
				var columns = row.columns || [];
				for(var j=0; j<columns.length; j++)
				{
					var column = columns[j];
					var seat = column.element || {};
					var seatCharacteristics = this.getSeatCharacteristics(seat);
					for(var k=0; k<seatCharacteristics.length; k++)
					{
						if(characteristicsList.indexOf(seatCharacteristics[k]) >= 0 && ((seat.status == this.AVAILABLE) && (seat.occupation == this.FREE_SEAT)))
						{
							seatCount++;
						}
					}
				}
			}
			return seatCount;
		},

		selectCharacteristic: function(event,args) {
			var characteristic = args.characteristic || {};
			if(!this.utils.isEmptyObject(characteristic))
			{
				var isCharacteristicPresent = false;
				for(var i=0; i<this.data.selectedFilters.length; i++)
				{
					if(characteristic == this.data.selectedFilters[i])
					{
						isCharacteristicPresent = true;
						this.data.selectedFilters.splice(i,1);
					}
				}
				if(!this.utils.booleanValue(isCharacteristicPresent))
				{
					this.data.selectedFilters.push(characteristic);
				}
				this.utils.toggleClass(document.getElementById(characteristic+"_"+this.data.currentSegment.segmentId),'tick');
				var seatsCountPara = document.getElementById("seats-available_"+this.data.currentSegment.segmentId);
				var optionsSelectedPara = document.getElementById("options-selected_"+this.data.currentSegment.segmentId);
				if((seatsCountPara != null) && (typeof seatsCountPara != 'undefined'))
				{
					if(!this.utils.isEmptyObject(this.data.selectedFilters))
					{
						seatsCountPara.innerText = this.getSeatsWithCharacteristic(this.data.selectedFilters) || 0;
					}
					else
					{
						seatsCountPara.innerText = this.getTotalSeatsCount(this.constructCharacteristicsMap(this.data.currentSeatMap)) || 0;
					}
				}
				if((optionsSelectedPara != null) && (typeof optionsSelectedPara != 'undefined'))
				{
					optionsSelectedPara.innerText = this.data.selectedFilters.length;
				}
			}
			this.$refresh({
			    section : 'seatList'
			});
		},

		isMissingSeat: function(row, columnId) {
			var columns = row.columns;
			var isMissing = null;
			if(this.utils.isEmptyObject(columns))
			{
				isMissing = 'M';
			}
			for(var columnIndex=0; columnIndex<columns.length; columnIndex++)
			{
				if(columns[columnIndex].index == columnId)
				{
					var column = columns[columnIndex];
					var element = column.element;
					if(this.utils.isEmptyObject(element.status) || (element.status == this.MISSING_SEAT))
					{
						isMissing = 'M';
					}
					if(!this.utils.isEmptyObject(element.type))
					{
						isMissing = element.type;
					}
				}
			}
			return isMissing;
		},

		isSeatFiltered: function(seatNum) {
			var isSeatFiltered = false;
			if(!this.utils.isEmptyObject(this.data.selectedFilters))
			{
				var seatData = this.getSeatData(seatNum) || {};
				var characteristics = seatData.characteristics || [];
				for(var i=0; i<characteristics.length; i++)
				{
					if(this.data.selectedFilters.indexOf(characteristics[i]) >= 0)
					{
						isSeatFiltered = true;
					}
				}
			}
			return isSeatFiltered;
		},

		getTotalSeatsCount: function(availableCharacteristics) {
			var totalSeatCount = 0;
			var availableCharacteristics = availableCharacteristics || [];
			for(var i=0; i<availableCharacteristics.length; i++)
			{
				var characteristic = availableCharacteristics[i];
				totalSeatCount = totalSeatCount + characteristic.seatsCount;
			}
			return totalSeatCount;
		},

		$afterRefresh: function() {
			this.adjustSegmentsWidth();
			this.setPointerPosition(this.data.selectedSeat);
		}
	}
});