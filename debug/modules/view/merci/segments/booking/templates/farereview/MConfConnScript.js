Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MConfConnScript',
	$dependencies: [
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		pageObj = this;
		pageObjBkMK = this;
		pageObjBkMK.printUI = false;
		this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
	},

	$prototype: {

		$dataReady: function() {
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (this.data.rqstParams.reply && this.data.rqstParams.reply.tripPlanBean != undefined){
				this.data.rqstParams.tripPlanBean = this.data.rqstParams.reply.tripPlanBean;
			}
			if(this.data.rqstParams.reply && this.data.rqstParams.reply.serviceCategories != undefined){
				this.data.rqstParams.serviceCategories = this.data.rqstParams.reply.serviceCategories;
			}
			if (this.data.siteParams != undefined && this.data.siteParams.siteAllowFavorite != undefined && this._merciFunc.booleanValue(this.data.siteParams.siteAllowFavorite) == true) {
				if ((this.data.siteParams.siteAllowbookMarkRvnue != undefined && this._merciFunc.booleanValue(this.data.siteParams.siteAllowbookMarkRvnue) == true) || (this.data.siteParams.siteAllowbookMarkDeal != undefined && this._merciFunc.booleanValue(this.data.siteParams.siteAllowbookMarkDeal) == true)) {
					this.bookmarkBtn = true;
					aria.utils.Json.setValue(pageObj.data, 'jsonObj', "");
					this.getBookmarkData();
				} else {
					this.bookmarkBtn = false;
					pageObjBkMK.printUI = true;
				}
			} else {
				this.bookmarkBtn = false;
				pageObjBkMK.printUI = true;
			}
		},

		$displayReady: function() {
			if (pageObjBkMK.printUI == true) {

				var myVar = 0;
				pageObjBkMK.jsonkey = document.getElementById('trip_URL').value;

				if (this.data.rqstParams.param.FLOW_TYPE == undefined || this.data.rqstParams.param.FLOW_TYPE == "") {
					if (!this._merciFunc.isEmptyObject(pageObjBkMK.jsonFare)) {
						for (key in pageObjBkMK.jsonFare) {
							if (pageObjBkMK.jsonkey == key) {
								myVar = 1;
							}
						}
					}
				} else {
					if (this.data.rqstParams.param.FLOW_TYPE == "DEALS_AND_OFFER_FLOW" || (typeof(pageObjFare) !="undefined" && pageObjFare.FLOW_TYPE == "DEALS_AND_OFFER_FLOW")) {
						if (!this._merciFunc.isEmptyObject(pageObjBkMK.jsonDealMfare)) {
							for (key in pageObjBkMK.jsonDealMfare) {
								if (pageObjBkMK.jsonkey == key) {
									myVar = 1;
								}
							}
						}
					}
				}

				pageObjBkMK.myVar = myVar;
			}
			if(!this._merciFunc.booleanValue(this.data.siteParams.enableNewPopup) && this._merciFunc.booleanValue(this.data.siteParams.enblFFUriPopup) && this.data.siteParams.siteFpUICondType == 'URI'){
				var itin = this.data.rqstParams.listItineraryBean.itineraries;
				for(var j=0; j< itin.length; j++){
					var seg = itin[j].segments;
					for (var i=0; i<seg.length; i++){
						var url = seg[i].fareFamily.condition.url;
						$("#htmlPopup_"+(j+1)+"_"+(i+1)).html('<object data='+url+'/>');
					}
				}
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MConfConn",
						data:this.data
					});
			}
		},


		openHTML: function(args, data) {

			var enableNewPopup = false;
			if(this._merciFunc.booleanValue(this.data.siteParams.enableNewPopup)){
				enableNewPopup =  true ;
			}
			if (this._isConfPage() && data.segId != undefined) {

				if(enableNewPopup==true){
					var popup = this.moduleCtrl.getJsonData({
						"key": "popup"
					});

					aria.utils.Json.setValue(popup, 'data', {
						data: data
					});

					aria.utils.Json.setValue(popup, 'settings', {
						    	macro : "fareFamilyPopup"
					});		

					modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);		
					this.moduleCtrl.navigate(null, 'Popup');
				}
				else{
					document.getElementById('htmlPopup').innerHTML = data.segId;
					document.getElementById('htmlContainer').style.display = 'block';
					window.scrollTo(0, 0);
					this._merciFunc.showMskOverlay(false);
				}		

			} else {

				data.enableNewPopup = enableNewPopup ;
				data.moduleCtrl = this.moduleCtrl ;
				this._merciFunc.openHTML(data);
			}
		},

		toggleExpand: function(args, data) {
			// calling common method
			modules.view.merci.common.utils.MCommonScript.toggleExpand(args, data);
		},

		_getDateDiff: function(firstSegment, secondSegment) {

			var endDateTime = 0;
			var beginDateTime = 0;

			if (firstSegment != null) {
				var dtArr = firstSegment.endDateBean.jsDateParameters.split(',');
				var dt = new Date(dtArr[0], dtArr[1], dtArr[2], dtArr[3], dtArr[4], dtArr[5]);
				if (dt != null) {
					endDateTime = dt.getTime();
				}
			}

			if (secondSegment != null) {
				var dtArr = secondSegment.beginDateBean.jsDateParameters.split(',');
				var dt = new Date(dtArr[0], dtArr[1], dtArr[2], dtArr[3], dtArr[4], dtArr[5]);
				if (dt != null) {
					beginDateTime = dt.getTime();
				}
			}

			// return the difference
			return beginDateTime - endDateTime;
		},

		_getDateDisplayString: function(dt) {
			if (dt != null) {
				var totalMinutes = parseInt(dt.getTime() / (1000 * 60));
				var minutes = totalMinutes % 60;

				return ((totalMinutes - minutes) / 60) + ' ' + this.data.labels.tx_merci_text_pnr_hour + ' ' + minutes + ' ' + this.data.labels.tx_merci_text_pnr_minutes;
			}

			return '';
		},

		_getHeaderLabel: function(itinerary_index) {
			var headerLabel = this.data.labels.tx_merci_text_booking_dep_long;
			if (this.data.rqstParams.listItineraryBean.itineraries.length == 2 && itinerary_index == 1) {
				headerLabel = this.data.labels.tx_merci_text_booking_ret_long;
			}

			return headerLabel;
		},

		_getDate: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParameters != null) {
				var dateParams = dateBean.jsDateParameters.split(',');
				return new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
			}

			return null;
		},

		_getDateInYMD: function(dt) {
			if (dt != null && dt != '') {
				var dateParams = new Date(dt);
				//console.log(dateParams);
				var month = dateParams.getMonth() + 1;
				var date = dateParams.getDate();
				var hrs = dateParams.getHours();
				var mins = dateParams.getMinutes();

				return '' + dateParams.getFullYear() + (month < 10 ? '0' : '') + month + (date < 10 ? '0' : '') + date + "0000";
			}

			return null;
		},

		_getflightNum: function(flightnum) {
			if(flightnum!=null){
				if(flightnum.length==2){
					flightnum = "0"+flightnum;
				}else if(flightnum.length==1){
					flightnum = "00"+flightnum;
				}
			}
			return flightnum;
		},

		_isConfPage: function() {
			return !this._merciFunc.isEmptyObject(this.data.fromPage) && this.data.fromPage == "CONF";
		},

		_isPurcPage: function() {
			return !this._merciFunc.isEmptyObject(this.data.fromPage) && this.data.fromPage == "PURC_TRIP_OVERVIEW";
		},

		getBaggageNotDisplayed: function(segment) {
			var baggageNotDisplayed = !this._merciFunc.booleanValue(this.data.siteParams.siteDisplayBaggageInfo) || this._merciFunc.isEmptyObject(segment.travellerTypesInfos);
			return baggageNotDisplayed;

		},

		getBagAllowanceString: function(argSt, value) {
			var comparator = '{0}';
			argSt = argSt.replace(comparator, value);
			return argSt;
		},

		__getFractionDigits: function() {
			var fractionDigits = 0;
			if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			return fractionDigits;
		},

		_getFmDate: function(dateBean) {

			var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			if (dateBean != null && dateBean.jsDateParameters != null) {
				var monthN = dateBean.month;
				var monthStr = month[monthN];
				var day = dateBean.day;
				//var hhmm = dateBean.hourMinute;
				//var time = hhmm.substring(0, 2) + ":" + hhmm.substring(2, 4);

				var time = dateBean.jsDateParameters.split(',');
				if(time[3]=="0"){
					time[3]="00";
				}
				if(time[4]=="0"){
					time[4]="00";
				}
				var hhmm = time[3]+":"+time[4];

				var comdt = day + " " + monthStr + " " + hhmm;
				return comdt;
			}
		},

		onMyFavoriteClick: function() {

			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			var that = this;
			//that._merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {

				jsonObj = {};
				if (result != null && result != "" && result !=null) {
					if (typeof result === 'string') {
						var jsonObj = JSON.parse(result);
					}else{
						var	jsonObj = (result);
					}
				}else{
					var jsonObj={};
				}

				if (pageObjBkMK.FLOW_TYPE == undefined || pageObjBkMK.FLOW_TYPE == "") {

					var jsonKey = pageObjBkMK.jsonkey;

					if (!that._merciFunc.isEmptyObject(jsonObj)) {
						for (var key in jsonObj) {
							if ('RVNWFAREINFO' == key) {
								var slctFareInfo = jsonObj[key];
							}
							if ('RVNWFARESTATUS' == key) {
								var slctFareStatus = jsonObj[key];
							}
						}
					}


					var test = false;
					if (!that._merciFunc.isEmptyObject(slctFareStatus)) {
						for (var key in slctFareStatus) {
							if (jsonKey == key) {
								delete slctFareStatus[key];
								jsonObj['RVNWFARESTATUS'] = slctFareStatus;
								that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
								test = true;
								break;
							}
						}
					}

					if (!that._merciFunc.isEmptyObject(slctFareInfo)) {
						for (var key in slctFareInfo) {
							if (jsonKey == key) {
								delete slctFareInfo[key];
								jsonObj['RVNWFAREINFO'] = slctFareInfo;
								that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
								test = true;
								break;
							}
						}
					}

					if (test == false) {
						if (slctFareStatus == null) {
							slctFareStatus = {};
						}
						if (jsonObj == null) {
							jsonObj = {};
						}
						slctFareStatus[jsonKey] = (pageObjBkMK.jsondataAward_dep);
						slctFareStatus = pageObjBkMK._sortData(slctFareStatus);
						jsonObj["RVNWFARESTATUS"] = slctFareStatus;
						that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");

						for (var key in pageObjBkMK.jsontrip_URL) {
							if (pageObjBkMK.jsontrip_URL.hasOwnProperty(key)) {
								pageObjBkMK.tripURL += '&' + key + '=' + pageObjBkMK.jsontrip_URL[key];
							}
						}
						pageObjBkMK.tripURL += pageObjBkMK.travellerURL;



						if (slctFareInfo == null) {
							slctFareInfo = {};

						}
						slctFareInfo[jsonKey] = (pageObjBkMK.tripURL);
						jsonObj["RVNWFAREINFO"] = slctFareInfo;
						that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
						var setData=this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE,jsonObj);
					}
				} else {
					if (pageObjBkMK.FLOW_TYPE == "DEALS_AND_OFFER_FLOW" || (typeof(pageObjFare) !="undefined" && pageObjFare.FLOW_TYPE == "DEALS_AND_OFFER_FLOW")) {
						var jsonKey = pageObjBkMK.jsonkey;

						if (!that._merciFunc.isEmptyObject(jsonObj)) {
							for (var key in jsonObj) {
								if ('DEALFAREINFO' == key) {
									//var slctFareInfo=JSON.parse(jsonObj[key]);
									var slctDealInfo = jsonObj[key];
								}
								if ('DEALFARESTATUS' == key) {
									//var slctFareStatus=JSON.parse(jsonObj[key]);
									var slctDealStatus = jsonObj[key];
								}
							}
						}


						var test = false;
						if (!that._merciFunc.isEmptyObject(slctDealStatus)) {
							for (var key in slctDealStatus) {
								if (jsonKey == key) {
									delete slctDealStatus[key];
									jsonObj['DEALFARESTATUS'] = slctDealStatus;
									that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
									test = true;
									break;
								}
							}
						}

						if (!that._merciFunc.isEmptyObject(slctDealInfo)) {
							for (var key in slctDealInfo) {
								if (jsonKey == key) {
									delete slctDealInfo[key];
									jsonObj['DEALFAREINFO'] = slctDealInfo;
									that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
									test = true;
									break;
								}
							}
						}

						if (test == false) {
							if (slctDealStatus == null) {
								slctDealStatus = {};


							}
							if (jsonObj == null) {

								jsonObj = {};

							}
							slctDealStatus[jsonKey] = (pageObjBkMK.jsondataAward_dep);
							jsonObj["DEALFARESTATUS"] = slctDealStatus;
							that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");

							for (var key in pageObjBkMK.jsontrip_URL) {
								if (pageObjBkMK.jsontrip_URL.hasOwnProperty(key)) {
									pageObjBkMK.tripURL += '&' + key + '=' + pageObjBkMK.jsontrip_URL[key];
								}
							}
							pageObjBkMK.tripURL += pageObjBkMK.travellerURL;



							if (slctDealInfo == null) {
								slctDealInfo = {};

							}
							slctDealInfo[jsonKey] = (pageObjBkMK.tripURL);
							jsonObj["DEALFAREINFO"] = slctDealInfo;
							that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
							var setData=this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE,jsonObj);
						}
					}
				};

				if (test == false) {
					pageObj.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark + 1);
					document.getElementById('favButton').setAttribute("aria-checked", true);
					pageObjBkMK.toggleBookmarkAlert(this,"added");
				} else {
					pageObj.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark - 1);
					document.getElementById('favButton').setAttribute("aria-checked", false);
					pageObjBkMK.toggleBookmarkAlert(this,"deleted");
				}
			//});
		},
		onBookMarkParameters: function(jsondataAward_dep, tripURL, jsontrip_URL, travellerURL, FLOW_TYPE) {
			pageObjBkMK.jsondataAward_dep = jsondataAward_dep;
			pageObjBkMK.travellerURL = travellerURL;
			pageObjBkMK.jsontrip_URL = jsontrip_URL;
			pageObjBkMK.tripURL = tripURL;
			pageObjBkMK.FLOW_TYPE = FLOW_TYPE;

		},

		getBookmarkData: function() {

			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			//pageObj._merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {

				if (result !="" && result !=null && !pageObj._merciFunc.isEmptyObject(result)) {
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};
					pageObjBkMK.fareReviewData = {};
					pageObjBkMK.fareReviewData = jsonObj;
					pageObjBkMK.jsonFare = pageObjBkMK.fareReviewData['RVNWFARESTATUS'];
					pageObjBkMK.jsonTrip = pageObjBkMK.fareReviewData['RVNWFAREINFO'];
					pageObjBkMK.jsonDealMfare = pageObjBkMK.fareReviewData['DEALFARESTATUS'];
					pageObjBkMK.dealFareTrip = pageObjBkMK.fareReviewData['DEALFAREINFO'];
				}else{
					pageObjBkMK.jsonFare = {};
					pageObjBkMK.jsonTrip = {};
					pageObjBkMK.jsonDealMfare = {};
					pageObjBkMK.dealFareTrip = {};

				}
				pageObjBkMK.printUI = true;

			//});

		},

		/**
		 * based on itinerary decide what css class should be applied to article
		 * @param itineraryCount current Itinerary index
		 * @param itinerariesLength total number of itinerary
		 */
		_getArticleCSS: function(itineraryCount, itinerariesLength) {
			var cssClass = 'panel';
			if (itineraryCount % 2 == 0) {
				if (!this._isConfPage()) {
					if (!this._isPurcPage()) {
						cssClass += ' arrival-section';
					} else {
						cssClass += ' inBound';
					}
				} else {
					cssClass += ' inBound arrival arrival-section';
				}
			} else {
				if (itinerariesLength == 1) {
					cssClass += ' departure-section';
					if (!this._isPurcPage()) {
						cssClass += ' departure-section-full';
					} else {
						cssClass += ' outBound';
					}
				} else {
					if (!this._isConfPage()) {
						if (!this._isPurcPage()) {
							cssClass += ' departure-section';
						} else {
							cssClass += ' outBound';
						}
					} else {
						cssClass += ' outBound departure departure-section lastChild';
					}
				}
			}
			if(!this._merciFunc.isEmptyObject(this.data.rqstParams) && !this._merciFunc.isEmptyObject(this.data.rqstParams.reply) && !this._merciFunc.isEmptyObject(this.data.rqstParams.reply.tripType) && (this.data.rqstParams.reply.tripType.toUpperCase() == "C" || this.data.rqstParams.reply.tripType.toUpperCase() == "M"))
			{
				cssClass = 'panel departure-section-full';
			}

			return cssClass;
		},

		_getDateTime: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParameters != null) {
				var dateParams = dateBean.jsDateParameters.split(',');
				var dtTime = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				return dtTime.getTime();
			}

			return null;
		},

		_getCurrentTime: function() {
			var currDt = new Date();
			currDt = currDt.getTime();
			return currDt;
		},

		_sortData: function(jsonDataFmt) {
			sortArr = [];
			sortJson = {};
			if (!pageObjBkMK._merciFunc.isEmptyObject(jsonDataFmt)) {
				for (var key in jsonDataFmt) {
					sortArr.push(parseInt(jsonDataFmt[key].beginDtObj));
				};
				sortArr.sort(function(a, b) {
					return a - b
				});

				for (i = 0; i <= sortArr.length; i++) {
					for (var key in jsonDataFmt) {
						if (sortArr[i] == parseInt(jsonDataFmt[key].beginDtObj)) {
							sortJson[key] = jsonDataFmt[key];
						}
					}
				};
				return sortJson;
			} else {
				return null;
			};
		},

		onFareFamilyLinkClick: function (wrapper,data) {

			if(!pageObjBkMK._merciFunc.isRequestFromApps()){
				window.open(data.url,'_blank');
				//window.location = data.url;
			}else{
				if(typeof navigator.app != "undefined"){
					// Supported by PhoneGap - Android
					navigator.app.loadUrl(data.url, {openExternal: true});
				}else{
					// Using inappbrowser PhoneGap plugin. Workaround for iOS
					window.open(data.url,'_system');
				}
			}
		},

		toggleBookmarkAlert: function(scope,args) {
			if(args=="added" || args.id=="added"){
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay'));
				pageObjBkMK._merciFunc.toggleClass(overlayDiv, 'on');
			}else{
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay1'));
				pageObjBkMK._merciFunc.toggleClass(overlayDiv, 'on');
			}
		},
		createPaxArray: function(){
			var paxArray = [];
			if (this.data.rqstParams.listTravellerBean != null && this.data.rqstParams.listTravellerBean.travellersAsMap != null){
				for (current in this.data.rqstParams.listTravellerBean.travellersAsMap){
					var currentPax = this.data.rqstParams.listTravellerBean.travellersAsMap[current];
					paxArray.push(this._getTravellerName(currentPax));
				}
			}
			return paxArray;
		},
		_getTravellerName: function(traveller) {
			var paxTypeString = this._getPaxTypeString(traveller.paxType.code);
			if (traveller.identityInformation.titleName != null && traveller.identityInformation.titleName != '') {
				//return new this._strBuffer(this.data.labels.tx_pltg_pattern_TravellerNameWithTitle).formatString([traveller.identityInformation.titleName,traveller.identityInformation.firstName,traveller.identityInformation.lastName]);
				return traveller.identityInformation.titleName + " " + traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			} else {
				return traveller.identityInformation.firstName + " " + traveller.identityInformation.lastName + paxTypeString;
			}
		},
		_getPaxTypeString: function(code) {
			var paxTypeString = "";
			if (this._merciFunc.booleanValue(this.data.siteParams.siteAllowPax)) {
				if (code == 'ADT') {
					/*paxTypeString = this.data.labels.tx_merci_text_booking_alpi_adult;*/
					return paxTypeString;
				} else if (code == 'CHD') {
					paxTypeString = this.data.labels.tx_merci_text_booking_child;
				} else if (code == 'INF') {
					paxTypeString = this.data.labels.tx_merci_text_booking_alpi_infant;
				} else if (code == 'YCD') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_snr;
				} else if (code == 'STU') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_stdnt;
				} else if (code == 'YTH') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_yth;
				} else if (code == 'MIL') {
					paxTypeString = this.data.labels.tx_mc_text_addPax_mlty;
				}
				if (paxTypeString != "") {
					paxTypeString = " (" + paxTypeString + ")";
				}
			}
			return paxTypeString;
		},
		createPaxEticketMap:function(){
			var paxEticketMap = {};
			for (ticket in this.data.rqstParams.listTicketInformationBean.listAirTicketInformation){
				var currentTicket = this.data.rqstParams.listTicketInformationBean.listAirTicketInformation[ticket];
				for (traveller in currentTicket.listTraveller.travellers){
					var currentTraveller = currentTicket.listTraveller.travellers[traveller];
					paxEticketMap[currentTicket.faFh.documentNumber] = this._getTravellerNameFromTicket(currentTicket, currentTraveller);
				}
			}
			return paxEticketMap;
		},
		_getTravellerNameFromTicket: function(ticket, traveller) {
			var travellerName = '';
			/*var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;*/
			var labels = this.data.labels;
			var siteParameters = this.data.siteParams;
			if (traveller != null && ticket != null) {
				// create default traveller name to be displayed
				travellerName = traveller.identityInformation.titleName + ' ' + traveller.identityInformation.firstName + ' ' + traveller.identityInformation.lastName;
				// infant check
				if (ticket.faFh != null) {
					if (ticket.faFh.passengerType == 'INF') {
						// i.e. ticket contains only an Infant Passenger
						return new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
					} else if (ticket.faFh.infantIncluded) {
						if (siteParameters.siteDispInfantName != null && siteParameters.siteDispInfantName.toLowerCase() == 'true') {
							var infantName = new this._strBuffer(labels.tx_pltg_pattern_InfantFirstLastName).formatString([traveller.infant.firstName, traveller.infant.lastName]);
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithoutInfantName).formatString([travellerName, infantName]);
						} else {
							return new this._strBuffer(labels.tx_pltg_pattern_TravellerNameWithInfantName).formatString([travellerName]);
						}
					}
				}
			}
			return travellerName;
		},
		findIOSVersion: function(evt) {
			//this.$logInfo('AcceptanceConfirmationScript::Entering findIOSVersion function');
			try {
			    if (/iP(hone|od|ad)/.test(navigator.platform)) {
			       // supports iOS 2.0 and later: <http://bit.ly/TJjs1V> (http://bit.ly/TJjs1V%3E)
			       var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			       return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
			    }
			} catch (exception) {
			    this.$logError(
			       'AcceptanceConfirmationScript::An error occured in findIOSVersion function',
			       exception);
			}
		},
		_getTripURL: function() {
			var itineraries = [];
			if (!this._merciFunc.isEmptyObject(this.data.rqstParams.listItineraryBean.itineraries)) {
				itineraries = this.data.rqstParams.listItineraryBean.itineraries;
			}
			var tripURL = '';
			for (var i = 1; itineraries != null && i <= itineraries.length; i++) {
				var itinerary = itineraries[i-1];
				if (itinerary != null) {
					if (itinerary.segments.length > 0) {
						var segmentZero = itinerary.segments[0];
						var segmentLast = itinerary.segments[itinerary.segments.length - 1];
						// for more than one itinerary
						if (tripURL != null && tripURL != '') {
							tripURL += '&';
						}
						tripURL += 'B_LOCATION_' + i + '=' + segmentZero.beginLocation.locationCode
								+ '&E_LOCATION_' + i + '=' + segmentLast.endLocation.locationCode 
								+ '&B_DATE_' + i + '=' + this._getDateInYMD(segmentZero.beginDate) 
								+ '&E_DATE_' + i + '=' + this._getDateInYMD(segmentLast.endDate)
								+ '&E_TICKETING_' + i + '=true';
					}
					for (var j = 1; j <= itinerary.segments.length; j++) {
						var segment = itinerary.segments[j-1];
						tripURL += '&FLIGHT_NUMBER_' + i +'_' + j + '=' + this._getflightNum(segment.flightNumber)  
								+ '&AIRLINE_' + i +'_' + j + '=' + segment.airline.code 
								+ '&RBD_' + i +'_' + j + '=' + segment.cabins[0].RBD
						if (j > 1) {
							tripURL += '&VIA_LOCATION_' + i + '_' + j  + '=' + segment.beginLocation.locationCode;
						}
					}
				}
			}
			return tripURL;
		},
		isCommonRetrieveFlow: function(){
			var commonRetrieveFlow = false;
			var isCommonPageEnabled = false;
			var retrieveFlow = false;
			if(this.data.siteParams.siteCommonPageEnabled){
				isCommonPageEnabled =this._merciFunc.booleanValue(this.data.siteParams.siteCommonPageEnabled);
			}
			if(this.data.rqstParams.DIRECT_RETRIEVE){
				retrieveFlow=this._merciFunc.booleanValue(this.data.rqstParams.DIRECT_RETRIEVE);
			}
			var commonRetrieveFlow = retrieveFlow && isCommonPageEnabled;
			return commonRetrieveFlow;
		}
	}
});