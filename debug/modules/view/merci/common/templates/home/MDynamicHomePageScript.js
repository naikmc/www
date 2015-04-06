Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.home.MDynamicHomePageScript",
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.MDWMContentUtil',
		'aria.utils.HashManager'
	],
	$constructor: function() {
		this.ga = modules.view.merci.common.utils.MerciGA;
		this.urlMgr = modules.view.merci.common.utils.URLManager;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.dwm = modules.view.merci.common.utils.MDWMContentUtil;
		pageObjIndex = this;
		aria.utils.HashManager.addCallback({
			fn: 'onHashChangeOverride',
			scope: this
		});

		this.scrollCount = 0;
		this.favouritesCount = 0;

		var bodyEls = document.getElementsByTagName('body');
		if (bodyEls != null) {
			for (var i = 0; i < bodyEls.length; i++) {
				bodyEls[i].className += ' merci-dyna';
			}
		}
	},
	$destructor: function() {
		var bodyEls = document.getElementsByTagName('body');
		if (bodyEls != null) {
			for (var i = 0; i < bodyEls.length; i++) {
				bodyEls[i].className = bodyEls[i].className.replace(/(?:^|\s)merci-dyna(?!\S)/g, '');
			}
		}
	},
	$prototype: {

		$displayReady: function() {
			$("#selectAirport").attr("placeholder",$("#departure-list option:selected" ).text());
			/* Create iscroll for search section */
			if( this.config.siteEnableRecentsearch == "TRUE" && this.config.siteSearchCount > 0 && this._getSearchCount()>0 ){
				 var sendData = {};
					sendData.scrollId = this.$getId('search_dynaScroller');
					sendData.id = 'search_dynaScroller';
					sendData.olScroll = 'search_olScroll';
					sendData.liScroll = 'search_liScroll_';
					sendData.length = this.storeSearchLen;
				this.utils.setScroll(sendData);
			}
			if(this.sortedPNRs != null && this.sortedPNRs.length>0){
				var sendTripBoxData = {};
					sendTripBoxData.scrollId = this.$getId('tripBox_dynaScroller');
					sendTripBoxData.id = 'tripBox_dynaScroller';
					sendTripBoxData.olScroll = 'tripBox_olScroll';
					sendTripBoxData.liScroll = 'tripBox_liScroll_';
					sendTripBoxData.length = this.scrollCount;
				this.utils.setScroll(sendTripBoxData);
			}
			if(this.utils.booleanValue(this.config.allowFavorite) && this.favouritesCount > 0) {
				var favData = {};
					favData.scrollId = this.$getId('favourites_dynaScroller');
					favData.id = 'favourites_dynaScroller';
					favData.olScroll = 'favourites_olScroll';
					favData.liScroll = 'favourites_liScroll_';
					favData.length = this.favouritesCount;
				this.utils.setScroll(favData);
			}
			if (this.utils.isRequestFromApps()) {
				this.setBackground();
			}
		},

		$dataReady: function() {
			try {
				var _this = this;
				this.data.dateParams = jsonResponse.data.framework.date.params;
				this.$logInfo('MDynamicHomePageScript: Entering dataReady function ');

				this.config = this.moduleCtrl.getModuleData().booking.Mindex_A.siteParam;
				this.labels = this.moduleCtrl.getModuleData().booking.Mindex_A.labels;
				this.requestParam = this.moduleCtrl.getModuleData().booking.Mindex_A.requestParam;
				this.globalList = this.moduleCtrl.getModuleData().booking.Mindex_A.globalList;
				this.model = this.moduleCtrl.getModuleData().booking.Mindex_A;
				this.reply = this.model.reply;
				this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
					if (result != null && result != '') {
						var jsonObj = {};
						if (typeof result === 'string') {
							jsonObj = JSON.parse(result);
						} else {
							jsonObj = (result);
						};
						_this.data.pnrList = jsonObj.detailArray;
					}
				});
				//SetFooterInfo Footer created
				if (!this.data.fromMenu) {
					if (this.utils.isRequestFromApps() == true && this.utils.booleanValue(this.config.setAllowFooter) == true) {
						this.setFooter();
						this.getTripCount();
					};	
				};	
				//To sort the trips based on departure date
				this.removeFlownPNRs();
				var pNRsToSort = [];
				for (var pnr in this.data.pnrList) {
					pNRsToSort.push(pnr);
				}
				pNRsToSort.sort(function(a, b) {
					var dateA = new Date(_this.data.pnrList[a].BDate);
					var dateB = new Date(_this.data.pnrList[b].BDate);
					return dateA - dateB //sort by date ascending
				})
				this.sortedPNRs = pNRsToSort;
				if(this.data.pnrList){
				this.data.pnrToDisplay = this.data.pnrList[this.sortedPNRs[0]];
				}
				var defaultCountry = "";
				if (this.config.siteDefaultCountrySel == 'IP' && (this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == "")) {
				defaultCountry = this.requestParam.ipCountry;
				this.moduleCtrl.setValueforStorage(defaultCountry, 'defaultCountry');
				} else {
					defaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry');
				}
			} catch (_ex) {
				this.$logError('MDynamicHomePageScript: an error has occured in dataReady function');
			}

			if(this.utils.booleanValue(this.config.allowFavorite)) {
				this.__initFavData();
			}
		},

		$viewReady: function() {
			var headerButton = {};
			headerButton.scope = this;
			var arr = [];
			if (this.config.enableProfile != undefined && this.config.enableProfile.toLowerCase() == "true") {
				arr.push("login");
				if (this.IS_USER_LOGGED_IN) {
					headerButton.loggedIn = true;
				} else {
					headerButton.loggedIn = false;
				}
			}
			headerButton.button = arr;
			var base = this.urlMgr.getBaseParams();
			if (this.utils.booleanValue(this.config.enableLoyalty) && this.IS_USER_LOGGED_IN) {
				var loyaltyInfoJson = {
					loyaltyLabels: this.labels.loyaltyLabels,
					airline: base[16],
					miles: base[17],
					tier: base[18],
					title: base[19],
					firstName: base[20],
					lastName: base[21],
					programmeNo: base[22]
				};
			}

			// set header information
			this.moduleCtrl.setHeaderInfo({
				title: this.labels.tx_merci_text_home_home,
				bannerHtmlL: this.requestParam.bannerHtml,
				homePageURL: null,
				showButton: false,
				companyName: this.config.sitePLCompanyName,
				currencyConverter: {
					name: '',
					code: '',
					pgTkt: '',
					labels: {
						tx_merci_currency_converter: '',
						tx_merci_org_currency: '',
						tx_merci_sel_currency: '',
						tx_merci_booking_avail_filter_apply: '',
						tx_merci_cancel: ''
					},
					showButton: false
				},
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});

			// process html content
			var element = document.getElementById(this.$getId('custom_wrapper'));
			if (element != null) {
				this.dwm.processContainer({
					'element':  element
				});
			}

		},

		__initFavData: function () {
			this.getBookmarkData();
			this.shareData = {};
			this.shareData.shareResponse = {};
			this.data.shareDataFlag = false;
		},

		exitDWMSplashScreen: function() {
			var dwmDiv = document.getElementById("DWMSplashScreen");
			if(dwmDiv!=null){
				dwmDiv.remove();
			}			
		},

		getBookmarkData: function() {

			var getFavData=this.moduleCtrl.getFavouriteData();

			var dateObj = new Date();
			var deleteData = false;
			dateObj = dateObj.getTime();
			dateObj = dateObj - (0 * 86400);
			if (getFavData !=undefined && getFavData != "") {
				if (typeof getFavData === 'string') {
					this.jsonObj = JSON.parse(getFavData);
				}else{
					this.jsonObj = (getFavData);
				}

				if (!this.utils.isEmptyObject(this.jsonObj)) {
					this.FavLabels = this.jsonObj.labels;
					this.FavSiteParams = this.jsonObj.siteParams;
					this.FavRqstParams = this.jsonObj.rqstParams;

					if (!this.utils.isEmptyObject(this.jsonObj.DEALSTATUS)) {
						for (var key in this.jsonObj.DEALSTATUS) {
							if (dateObj > this.jsonObj.DEALSTATUS[key].endTime) {
								delete this.jsonObj.DEALSTATUS[key];
								deleteData = true;
								if (jsonResponse.ui.cntBookMark > 0) {
									jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
								}
							}

						}
					}

					if (!this.utils.isEmptyObject(this.jsonObj.RVNWFARESTATUS)) {
						for (var key in this.jsonObj.RVNWFARESTATUS) {
							if (dateObj > this.jsonObj.RVNWFARESTATUS[key].beginDtObj) {
								delete this.jsonObj.RVNWFARESTATUS[key];
								delete this.jsonObj.RVNWFAREINFO[key];
								deleteData = true;
								if (jsonResponse.ui.cntBookMark > 0) {
									jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
								}
							}

						}
					}

					if (!this.utils.isEmptyObject(this.jsonObj.DEALFARESTATUS)) {
						for (var key in this.jsonObj.DEALFARESTATUS) {
							if (dateObj > this.jsonObj.DEALFARESTATUS[key].beginDtObj) {
								delete this.jsonObj.DEALFARESTATUS[key];
								delete this.jsonObj.DEALFAREINFO[key];
								deleteData = true;
								if (jsonResponse.ui.cntBookMark > 0) {
									jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
								}
							}

						}
					}

				dateObj = dateObj - (2 * 86400);     /* Add site parameter if user want to delete according to constant time*/
					if (!this.utils.isEmptyObject(this.jsonObj.FLIGHTSTATUS)) {
						for (var key in this.jsonObj.FLIGHTSTATUS) {
							if (dateObj > this.jsonObj.FLIGHTSTATUS[key].beginDtObj) {
								delete this.jsonObj.FLIGHTSTATUS[key];
								deleteData = true;
								if (jsonResponse.ui.cntBookMark > 0) {
									jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
								}
							}

						}
					}

					var todaysDate = new Date();
					if (!this.utils.isEmptyObject(this.jsonObj.SERVICESCATALOG)) {
						for(var servicesBookmarkCount = 0; servicesBookmarkCount < this.jsonObj.SERVICESCATALOG.length; servicesBookmarkCount++){
							if(todaysDate > new Date (this.jsonObj.SERVICESCATALOG[servicesBookmarkCount].itineraryData.lastSegmentFlownDate)){
								this.jsonObj.SERVICESCATALOG.splice(servicesBookmarkCount,1);
								deleteData = true;
								if (jsonResponse.ui.cntBookMark > 0) {
									jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
								}
							}

						}
					}
					if (deleteData = true) {
						this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
					};
				};
			}
		},

		_getSearchCount: function() {
			var srchCount = 0;
			if (window.localStorage.getItem('DepJson') != null) {
				srchCount = JSON.parse(window.localStorage.getItem('DepJson')).length;
			}
			return srchCount;
		},

		_getSearchList: function() {

			var depJson = JSON.parse(localStorage.getItem('DepJson'));
			if (depJson != null) {
				var jsData = {};
				jsData.len = this.config.siteSearchCount;
				if (depJson.length <= jsData.len) {
					jsData.len = depJson.length
				}
				this.storeSearchLen = jsData.len;
				jsData.arr = depJson;

				return jsData;
			}
		},

		getFormattedDate: function(date) {
			var dd = {};
			if (date != "" && date != undefined && date != null) {
				dd.day = date.substring(6, 8);
				dd.month = date.substring(0, 6);
				var month = parseInt(date.substring(4, 6));
				var aa =  new Date(date.substring(0, 4),month,date.substring(6, 8));
				dd.jsonDate = this.utils.formatDate(aa, "EEE MMM dd yyyy");
			}
			return dd;
		},

		getDateInFormat: function(date, format) {
			var dateInFormat = "";
			var fmt = format || "EEE MMM dd yyyy";
			var dt = null;
			if(!this.utils.isEmptyObject(date))
			{
				dt =  new Date(date);
			} 
			if(dt != null)
			{
				dateInFormat = this.utils.formatDate(dt, fmt);
			} 
			return dateInFormat;
		},

		searchFlight: function(event, args) {
			this.utils.storeLocal("B_LOCATION_1_SRCH", args.B_LOCATION_1_SRCH, "overwrite", "text");
			this.utils.storeLocal("E_LOCATION_1_SRCH", args.E_LOCATION_1_SRCH, "overwrite", "text");
			this.utils.storeLocal("CABIN_CLASS", args.CABIN_CLASS, "overwrite", "text");
			this.utils.storeLocal("day1", args.day1, "overwrite", "text");
			this.utils.storeLocal("day2", args.day2, "overwrite", "text");
			this.utils.storeLocal("month1", args.month1, "overwrite", "text");
			this.utils.storeLocal("month2", args.month2, "overwrite", "text");
			this.utils.storeLocal("FIELD_ADT_NUMBER", args.FIELD_ADT_NUMBER, "overwrite", "text");
			this.utils.storeLocal("FIELD_CHD_NUMBER", args.FIELD_CHD_NUMBER, "overwrite", "text");
			this.utils.storeLocal("FIELD_INFANTS_NUMBER", args.FIELD_INFANTS_NUMBER, "overwrite", "text");
			if (args.trip_type == 'roundTrip') {
				this.utils.storeLocal("roundTrip", true, "overwrite", "text");
				this.utils.storeLocal("oneWay", false, "overwrite", "text");
			} else {
				this.utils.storeLocal("roundTrip", false, "overwrite", "text");
				this.utils.storeLocal("oneWay", true, "overwrite", "text");
			}
			this.utils.storeLocal("DATE_RANGE_VALUE_1", args.flexi, "overwrite", "text");
			this.utils.storeLocal("FIELD_INFANTS_NUMBER", args.FIELD_INFANTS_NUMBER, "overwrite", "text");
			var params = {
					FROM_INDEX: true
				};
			this.utils.sendNavigateRequest(params, 'MGlobalDispatcher.action', this);
		},

		onFlightStatusClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {
				var keyData = args.keyData;
				jsonResponse.ui.Flow_Type = "MyFav";
				jsonResponse.ui.keyData = keyData;
				this.utils.showMskOverlay(true);
				this.moduleCtrl.navigate(null, 'merci-MflightInfo_A');
			} else {
				$("#" + args.id).addClass('favdelete');
			}
		},

		onRenevnueFlowClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {

				if (args.flow == "Revenue") {
					args.rvnwInfoTrip += '&result=json';
					args.rvnwInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					jsonFare = args.rvnwInfoTrip.replace('\"', '');
				} else {
					args.dealInfoTrip += '&result=json';
					args.dealInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					args.dealInfoTrip += '&FLOW_TYPE=DEALS_AND_OFFER_FLOW';
					jsonFare = args.dealInfoTrip.replace('\"', '');
				};

				var request = {
					parameters: jsonFare,
					action: 'MAvailThenFare.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onRenevnueCallback,
						args: jsonFare,
						scope: this
					}
				};
				this.utils.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				$("#" + args.id).addClass('favdelete');
			}

		},

		__onRenevnueCallback: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.booking == undefined) {
						json.booking = {};
					} {
						json.booking[dataId] = response.responseJSON.data.booking[dataId];
						json.header = response.responseJSON.data.header;
						// navigate to next page
						this.moduleCtrl.navigate(null, nextPage);
					}
				}
			}
		},

		onDealsOfferClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {
				var offerId = args.ID;
				var country = args.countrySite;
				this.utils.storeLocal("OID", offerId, "overwrite", "text");

				this.utils.storeLocal("countrySite", country, "overwrite", "text");
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				params = 'SITE=' + bp[11] + '&LANGUAGE=' + bp[12] + '&offer_id=' + offerId + '&result=json&COUNTRY_SITE=' + country;
				actionName = 'OffersApi.action';
				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					defaultParams: false,
					cb: {
						fn: this.__onDealsOfferClickCallback,
						args: params,
						scope: this
					}
				};
				this.utils.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				$("#" + args.id).addClass('favdelete');
			}

		},

		__onDealsOfferClickCallback: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},
		formatDate: function(bDate, args) {
			var beginDate = bDate.split(",");
			var year = beginDate[0];
			var month = parseInt(beginDate[1]) + 1;
			var dt = beginDate[2];
			var hh = beginDate[3];
			var mm = beginDate[4];
			var ss = beginDate[5];
			if (args = "Date") {
				var date = year + month + dt;
				return (date);
			} else {
				var time = hh + mm + ss;
				return time;
			}

		},

		onFlightDelData: function(event, args) {
			event.preventDefault();
			if (!this.utils.isEmptyObject(this.jsonObj["FLIGHTSTATUS"])) {
				flightStatus = this.jsonObj["FLIGHTSTATUS"];
				for (var key in flightStatus) {
					if (args.keyData == key) {
						delete flightStatus[args.keyData];
						this.jsonObj['FLIGHTSTATUS'] = flightStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						this.$refresh();
					}
				}
			}

		},

		onDealDelData: function(event, args) {
			event.preventDefault();
			if (!this.utils.isEmptyObject(this.jsonObj["DEALFAREINFO"])) {
				dealStatus = this.jsonObj["DEALFAREINFO"];
				for (var key in dealStatus) {
					if (args.keyData == key) {
						delete dealStatus[args.keyData];
						this.jsonObj['DEALFAREINFO'] = dealStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
					}
				}
			};
			if (!this.utils.isEmptyObject(this.jsonObj["DEALFARESTATUS"])) {
				dealFareStatus = this.jsonObj["DEALFARESTATUS"];
				for (var key in dealFareStatus) {
					if (args.keyData == key) {
						delete dealFareStatus[args.keyData];
						this.jsonObj['DEALFARESTATUS'] = dealFareStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						this.$refresh();
					}
				}
			};
			if (!this.utils.isEmptyObject(this.jsonObj["DEALSTATUS"])) {
				dealStatus = this.jsonObj["DEALSTATUS"];
				for (var key in dealStatus) {
					if (args.keyData == key) {
						delete dealStatus[args.keyData];
						this.jsonObj['DEALSTATUS'] = dealStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						this.$refresh();
					}
				}
			}


		},
		onFareDelData: function(event, args) {
			event.preventDefault();
			if (!this.utils.isEmptyObject(this.jsonObj["RVNWFARESTATUS"])) {
				fareStatus = this.jsonObj["RVNWFARESTATUS"];
				for (var key in fareStatus) {
					if (args.keyData == key) {
						delete fareStatus[args.keyData];
						this.jsonObj['RVNWFARESTATUS'] = fareStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
					}
				}
			};
			if (!this.utils.isEmptyObject(this.jsonObj["RVNWFAREINFO"])) {
				fareStatus = this.jsonObj["RVNWFAREINFO"];
				for (var key in fareStatus) {
					if (args.keyData == key) {
						delete fareStatus[args.keyData];
						this.jsonObj['RVNWFAREINFO'] = fareStatus;
						this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, this.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						this.$refresh();
					}
				}
			}

		},
		delServicesBookmark: function(event, args) {
			event.preventDefault();
			this.utils.deleteServicesBookmark(args.recordLocator);
			this.getBookmarkData();
			if (jsonResponse.ui.cntBookMark > 0) {
				this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
			}
			this.$refresh();
		},
		retrieveBookmark: function(event, args) {
			var basket = JSON.stringify(args.bookmark.basket);
			var recordLoc = args.bookmark.REC_LOC;
			var lastName = args.bookmark.DIRECT_RETRIEVE_LASTNAME;
			var params = {
				BASKET_OF_SERVICES: basket,
				REC_LOC: recordLoc,
				DIRECT_RETRIEVE_LASTNAME: lastName,
				DIRECT_RETRIEVE: true,
				ACTION: "MODIFY",
				FROM_PAX: true
			};
			this.utils.sendNavigateRequest(params, 'MBookmarkServiceRetrieve.action', this);
		},

		shareTrip: function(event,args) {
			var baseURLAttributes = modules.view.merci.common.utils.URLManager.getBaseParams();
			var actionName = (args.type == "revenue" ? "MAvailThenFare.action" : "OffersApi.action");
			var dataToEncrypt = "";
			if (args.type == "revenue") {
				if (args.flow == "Revenue") {
					args.rvnwInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					dataToEncrypt = args.rvnwInfoTrip.replace('\"', '');
				} else {
					args.dealInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					args.dealInfoTrip += '&FLOW_TYPE=DEALS_AND_OFFER_FLOW';
					dataToEncrypt = args.dealInfoTrip.replace('\"', '');
				}
			}
			var newURL = baseURLAttributes[0]+"://"+baseURLAttributes[1]+baseURLAttributes[10]+"/"+baseURLAttributes[4]+"/"+actionName+"?"+baseURLAttributes[8];
			if(args.type != "revenue"){
				var offerId = args.ID;
				var country = args.countrySite;
				newURL = newURL+'&offer_id=' + offerId;
				if(newURL.indexOf('&COUNTRY_SITE=') == -1){
					newURL = newURL+'&COUNTRY_SITE=' + country;
				}
				else{
					var indx = 	newURL.indexOf('&COUNTRY_SITE=');
					if(newURL.indexOf('&COUNTRY_SITE=&') == -1){
						newURL = newURL.substr(0,indx) + '&COUNTRY_SITE='+country + newURL.substr((indx+16),newURL.length);
					}
					else{
						newURL = newURL.substr(0,indx) + '&COUNTRY_SITE='+country + newURL.substr((indx+14),newURL.length);
					}
				}
			}
			dataToEncrypt = dataToEncrypt.replace(/&/g,";");
			newURL = newURL.replace(/&/g,";");
			var params = "";
			params = "dataToEncrypt="+dataToEncrypt+"&newURL="+newURL+"&destination="+args.destination;
			var request = {
				parameters: params,
				action: 'MEncryptURL.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onShareTripCallback,
					scope: this,
					args: args
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		onLongPressBookMark: function(event, args) {
			//event.preventDefault(true);
			event.preventDefault();
			var test = false;
			if (event.duration > 1000) {
				$("#" + args.id).removeClass('favdelete');
				document.getElementById(args.id).style.zIndex = "999";
				document.getElementById(args.id).style.cssFloat = "initial";
			};
			return false;
		},

		__onShareTripCallback: function(response,args) {
			if(!this.utils.isEmptyObject(response) && !this.utils.isEmptyObject(response.responseJSON))
			{
				this.data.destination = args.destination;
				this.$json.setValue(this.shareData,'shareResponse', response.responseJSON);
				this.$json.setValue(this.data,'shareDataFlag', !this.data.shareDataFlag);
				this.utils.hideMskOverlay();
			}
		},

		setFavouritesCounter:function(counter) {
			this.favouritesCount = counter;
		},

		shiftCrumb: function(setCrumb) {
			var that = this;
			that.setCrumb = setCrumb;
			var crumbClass = 'nav#' + setCrumb.id + 'Crumb ol li';
			$(crumbClass).removeClass('on');
			$(crumbClass).each(function(index) {
				if (index == that.setCrumb.count) {
					$(this).addClass('on');
				}
			});

		},

		/**
		 * returns a list of buttons based on passed arguments
		 * @param args JSON object containing parameters
		 */
		getButtons: function(args) {

			if (args.subButtons == null) {
				args.subButtons = {};
			}

			for (var i = 0; i < args.buttons.length; i++) {
				if (args.buttons[i][6] != null && args.buttons[i][6] != '' && args.buttons[i][6] != '0') {
					if (!args.subButtons[args.buttons[i][6]]) {
						args.subButtons[args.buttons[i][6]] = [];
					}

					// add button
					var flowInfo = this.getFlowType(args.buttons[i][3]);
					args.subButtons[args.buttons[i][6]].push(flowInfo[0] + ',' + args.buttons[i][1] + ',' + args.buttons[i][2]);
				}
			}

			var buttonNames = [];
			if (this.utils.booleanValue(this.config.enblHomePageAlign) == true) {
				for (var i = 0; i < args.buttons.length; i++) {
					var flowInfo = this.getFlowType(args.buttons[i][3]);
					if (flowInfo[1] == 'H') {
						if (args.subButtons != null && args.subButtons[args.buttons[i][5]] != null) {
							buttonNames.push('PARENT_BUTTON|' + args.buttons[i][1] + '|' + JSON.stringify(args.subButtons[args.buttons[i][5]]));
						} else {
							buttonNames.push(flowInfo[0] + '|' + args.buttons[i][1] + '|' + args.buttons[i][2]);
						}
					}
				}
			} else {
				buttonNames = [
					'MY_PROFILE',
					'BOOKFLIGHT',
					'CHECKIN_HOME',
					'FAREDEALS',
					'RETRIEVE',
					'CONTACTUS',
					'FLIFO',
					'TIMETABLE',
					'FAVORITE',
					'CUSTOM',
					'TYPEB',
					'CHANGELANG',
					'DESKTOP',
					'SETTING'
				]
			}

			return buttonNames;
		},

		getFlowType: function(flowType) {

			var flowInfo = ['', ''];
			if (flowType == null || flowType.indexOf('-') == -1) {
				flowInfo[0] = flowType;
			} else {
				flowInfo = flowType.split('-');
			}

			return flowInfo;
		},

		_getSelectedCountry: function(args) {

		},

		_isSelectedCountry: function(args) {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var countrySite = bp[13];			
			var countryCodeMatched = countrySite == args.country.code;
			var defaultCountryMatched = this.moduleCtrl.getValuefromStorage('defaultCountry') == args.country.code;
			var noCountryCode = countrySite == null || countrySite == '';
			var ipMatched = args.listParentOfferBean.ipCountry != null && args.listParentOfferBean.ipCountry == args.country.code;
			var noDefaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == '';
			return defaultCountryMatched || (noDefaultCountry && (countryCodeMatched || (noCountryCode && ipMatched)));
		},
		getParam: function(name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return decodeURIComponent(name[1]);
		},
		onHashChangeOverride: function(){
			if($("#triplist").hasClass("expanded") && aria.utils.HashManager.getHashString() == 'merci-MDynamicHome_A'){
				$("#dynaPage_outer_wrapper").css("top","45px");
				$("#triplist").removeClass("expanded");
				$("#bannerLogo").show();
				$(".sb-toggle").show();
				$("header").addClass("banner");
				$("button.back.dynamicB").removeClass("dynamicB");
				this.moduleCtrl.setHeaderInfo({
					showButton: false
				});
			}
			if($("#selectDep").hasClass("expanded") && aria.utils.HashManager.getHashString() == 'merci-MDynamicHome_A'){
				$("#dynaPage_outer_wrapper").css("top","45px");
				$("#selectDep").removeClass("expanded");
				//$(".banner").show();
				this.moduleCtrl.setHeaderInfo({
					showButton: false
				});
				this.moduleCtrl.setValueforStorage($("#selectAirport").val(), 'defaultCountry');
				this.selectedCountryName = $("#departure-list option:selected" ).text();

				var selCountry = $("#selectAirport").val();
				var params = 'result=json&SELECTED_COUNTRY=' + selCountry + "&SELECTED_COUNTRY_NAME=" + $("#departure-list option:selected" ).text();
				var request = {
					parameters: params,
					action: 'MWelcome.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onDealsCallback,
						args:  {
							'selectedCountry': selCountry
						},
						scope: this
					}
				};
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}
			if($(".carrousel-content").hasClass("expanded") && aria.utils.HashManager.getHashString() == 'merci-MDynamicHome_A'){
				this.moduleCtrl.setHeaderInfo({
					showButton: false
				});
				$(".carrousel-content").removeClass("expanded");
			}
		},
		__onDealsCallback: function(response, args){
			//console.log(response);
			this.requestParam = this.moduleCtrl.getModuleData().booking.Mindex_A.requestParam;
			this.requestParam.selectedCountry = args.selectedCountry;
			this.$refresh({
				section: "dealsSection"
			});
		},

		removeFlownPNRs: function(){
			for (var pnr in this.data.pnrList) {
				if(this.utils.booleanValue(this.isPNRFlown(this.data.pnrList[pnr]))){
					delete this.data.pnrList[pnr];
				}
			}
		},

		isPNRFlown: function(pnr) {

			// current date
			var dateParams = this.data.dateParams;
			var currentDate = new Date(dateParams.year, dateParams.month, dateParams.day, dateParams.hour, dateParams.minute, dateParams.second);

			// convert current date to seconds
			var time = currentDate.getTime() / 1000;

			// iterate on itineraries
			var allSegmentsFlown = true;

			var segments = pnr.segmentDetails;
			if (segments != null) {
				// iterate on segments
				for (var segIndex = 0; segIndex < segments.length; segIndex++) {
					if (segments[segIndex].depDateParams != null) {
						var jsDt = segments[segIndex].depDateParams.split(',');
						var segmentTime = new Date(jsDt[0], jsDt[1], jsDt[2], jsDt[3], jsDt[4], jsDt[5]).getTime() / 1000;

						// get difference in hours
						var timeToDeparture = (segmentTime - time) / 3600;

						// added for PTR 07626025
						if (timeToDeparture >= 0) {
							allSegmentsFlown = false;
							break;
						}
					}
				}
			}
			return allSegmentsFlown;
		},

		setFooter: function() {
			this.footerJSON = {};
			this.footerJSON.setBoardingPass = this.config.merciCheckInEnabled;
			this.footerJSON.setAllowFooter = this.config.setAllowFooter;
			this.footerJSON.setFavAllow = this.config.allowFavorite;
			this.footerJSON.setRetrieveTrips = this.config.allowRetrieve;
			this.footerJSON.allowCustomRetrieve = this.config.allowCustomRetrieve;
			this.footerJSON.setSettingAllow = this.config.allowSetting;
			this.footerJSON.setBoardingLabel = this.labels.tx_merci_checkin_bptitle;
			this.footerJSON.setMyTripLabel = this.labels.tx_merci_text_mytrip;
			this.footerJSON.setMoreLabel = this.labels.tx_merciapps_more;
			this.footerJSON.setFavLabel = this.labels.tx_merciapps_my_favorite;
			this.footerJSON.setHomeLabel = this.labels.tx_merciapps_home;
			this.footerJSON.cancelMesg = this.labels.tx_merciapps_msg_booking_flow_exit;
			jsonResponse.data.footerJSON = this.footerJSON;
		},

		getTripCount: function() {
			
			dynamPage = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
				if (result && result != "") {
					var jsonObj = {};
					var count = 0;
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};

					if (!dynamPage.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.detailArray).length;
					};
					dynamPage.$json.setValue(jsonResponse.ui, "cntTrip", count);
				}


			});

			this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
				if (result && result != "") {
					var jsonObj = {};
					var count = 0;
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};

					if (!dynamPage.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.boardingPassArray).length;
					};
					dynamPage.$json.setValue(jsonResponse.ui, "cntBoardingPass", count);
				}

				
			});

		},		

		setBackground: function(){
			pageObjDyn = this;			
			this.utils.getStoredItemFromDevice(merciAppData.DB_BACKGROUND, function(resultImg) {
				if (resultImg != null && resultImg != '') {
					//var imgURL = "url(data:image/png;base64,"+resultImg+")";	
					var imgURL = "url("+resultImg+")";
					$("#sb-site").css("background-image", imgURL);								
				}
			});
		},

		//fix for PTR 09478183 [Medium]: MeRCI R22 CR 7502732 IA: Upgrade option doesnt get displayed when Dynamic home page enabled
		checkForAppUpgrade: function(str_upgradeMessage, param_AppStoreLink, param_GooglePlayLink, param_iOSVersion, param_AndroidVersion, isIgnored, param_forceUpgradeiPhone, param_forceUpgradeAndroid, str_forceUpgradeMessage) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
			}
			var utils = this.utils;
			if (!isIgnored && localStorage.getItem("RemindMeLater") != "TRUE") {
				utils.getAppVersion(function(result) {
					if (result && result.length > 0) {
						if (typeof(result) == "string") {
							appversion = parseFloat(result);
						} else {
							appversion = result;
						}
						if (devicePlatform == "iOS") {
							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - iOS:" + param_iOSVersion);
								if (typeof param_forceUpgradeiPhone != "undefined" && utils.booleanValue(param_forceUpgradeiPhone)) {
									console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									pageObjIndex.toggleForceUpgradeAlert("show");
								} else {
									console.log("iOS Auto App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									pageObjIndex.toggleAutoUpgradeAlert("show");
								}
							} else {
								console.log("App Upgrade alert not required");
							}
						} else if (devicePlatform == "Android") {
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - Android:" + param_AndroidVersion);
								if (typeof param_forceUpgradeAndroid != "undefined" && utils.booleanValue(param_forceUpgradeAndroid)) {
									console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjIndex.toggleForceUpgradeAlert("show");
								} else {
									console.log("Android Auto Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjIndex.toggleAutoUpgradeAlert("show");
								}
							} else {
								console.log("App Upgrade alert not required");
							}
						} else {
							console.log("Unable to identify platform");
						}
					}
				});
			} else {
				if (devicePlatform == "iOS" && typeof param_forceUpgradeiPhone != "undefined" && utils.booleanValue(param_forceUpgradeiPhone)) {
					utils.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
								pageObjIndex.toggleForceUpgradeAlert("show");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else if (devicePlatform == "Android" && typeof param_forceUpgradeAndroid != "undefined" && utils.booleanValue(param_forceUpgradeAndroid)) {
					utils.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
								pageObjIndex.toggleForceUpgradeAlert("show");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else {
					console.log("App upgrade prompt ignored.");
					utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
				}
			}
		},

		toggleForceUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById('forceUpgradeOverlay');
			this.utils.toggleClass(overlayDiv, 'on');
		},

		toggleAutoUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById("appUpgradeOverlay");
			this.utils.toggleClass(overlayDiv, 'on');
		},


		handleAutoUpgrade: function(scope, args) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
	  	    }

			switch (args.id) {
				case 'upgrade':
					isIgnored = false;
                    			localStorage.setItem("RemindMeLater", "FALSE");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && this.config.siteIOSStoreLink && this.config.siteIOSStoreLink.length > 0) {
						window.location.assign(this.config.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						this.toggleAutoUpgradeAlert("show");
					} else if (devicePlatform == 'Android' && this.config.siteAndroidStoreLink && this.config.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(this.config.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						this.toggleAutoUpgradeAlert("show");
					} else {
						this.toggleAutoUpgradeAlert("show");
					}
					break;
				case 'force':
					isIgnored = false;
                    			localStorage.setItem("RemindMeLater", "FALSE");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && this.config.siteIOSStoreLink && this.config.siteIOSStoreLink.length > 0) {
						window.location.assign(this.config.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else if (devicePlatform == 'Android' && this.config.siteAndroidStoreLink && this.config.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(this.config.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else {
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */						

					}
					break;
				case 'ignore':
					isIgnored = true;
					this.toggleAutoUpgradeAlert("show");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					break;
				case 'later':
                    			localStorage.setItem("RemindMeLater", "TRUE");
					this.toggleAutoUpgradeAlert("show");
					break;
				default:
					break;
			}
		}

	}
});