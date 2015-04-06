Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MFlightInfoScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		pageFlightInfo = this;
		pageFlightInfo.__ga = modules.view.merci.common.utils.MerciGA;
		pageFlightInfo._utils = modules.view.merci.common.utils.MCommonScript;
		pageFlightInfo.data = {};
		pageFlightInfo.myVar = 0;
	},

	$prototype: {

		/**
		 * process operational events to get info regading
		 * estimated time, actual time, gate information etc
		 */
		__getOperationalInfo: function() {

			var response = {};
			if (!this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.flightInfoBean.operationalEvents)) {
				for (var operationalEvent in pageFlightInfo.data.rqstParams.flightInfoBean.operationalEvents) {
					switch (operationalEvent.info.toUpperCase()) {
						case "ESTIMATED TIME OF DEPARTURE":
							response.ETD = this.__getDateObject(operationalEvent.time);
							break;
						case "ESTIMATED TIME OF ARRIVAL":
							response.ETA = this.__getDateObject(operationalEvent.time);
							break;
						case "LEFT THE GATE":
							response.LTGset = this.__getDateObject(operationalEvent.time);
							break;
						case "TOOK OFF":
							response.TOset = this.__getDateObject(operationalEvent.time);
							break;
						case "ARRIVED":
							response.ATA = this.__getDateObject(operationalEvent.time);
							break;
					}
				}

				if (response.LTGset != null && response.TOset != null) {
					response.ATD = response.LTGset;
				}
			}

			// with data
			return response;
		},

		/**
		 * change the string representation of month to Integer
		 * @param strMonth string representation of month like 'Dec', excpects only first three char of month
		 */
		__getMonthAsInt: function(strMonth) {
			switch (strMonth) {
				case 'Jan':
					return 0;
				case 'Feb':
					return 1;
				case 'Mar':
					return 2;
				case 'Apr':
					return 3;
				case 'May':
					return 4;
				case 'Jun':
					return 5;
				case 'Jul':
					return 6;
				case 'Aug':
					return 7;
				case 'Sep':
					return 8;
				case 'Oct':
					return 9;
				case 'Nov':
					return 10;
				case 'Dec':
					return 11;
				default:
					return 0;
			}
		},

		/**
		 * this method converts date string to date object
		 * @param strDate string representation of date e.g. Mon Dec 02 05:00:00 GMT 2013
		 */
		__getDateObject: function(strDate) {
			var dtArray = strDate.split(' ');
			if (dtArray.length == 6 && dtArray[3].indexOf(':') != -1) {
				var tmArray = dtArray[3].split(':');

				try {
					return new Date(parseInt(dtArray[5]), //year
						this.__getMonthAsInt(dtArray[1]), //month
						parseInt(dtArray[2]), // date
						parseInt(tmArray[0]), // hour
						parseInt(tmArray[1]), // minute
						parseInt(tmArray[2])); // second
				} catch (e) {
					console.error("Date object creation failed")
				}
			}

			return null;
		},

		$dataReady: function() {
			this.printUI = true;
			this.data.errors = [];
			this.data.infos = [];
			pageFlightInfo.data.base = modules.view.merci.common.utils.URLManager.getBaseParams();
			pageFlightInfo.flow_type = jsonResponse.ui.Flow_Type;
			pageFlightInfo.jsonKey = jsonResponse.ui.keyData;

			if (pageFlightInfo.flow_type == "MyFav") {
				pageFlightInfo.getBookmarkData("StoreConfig");
				if ((pageFlightInfo.flightData !== null) || (!pageFlightInfo._utils.isEmptyObject(pageFlightInfo.flightData))) {
					pageFlightInfo.data.labels = pageFlightInfo.flightData['LABELS'];
					pageFlightInfo.data.siteParam = pageFlightInfo.flightData['SITEPARAM'];
					pageFlightInfo.data.aircraftList = pageFlightInfo.flightData['aircraftList'];
					//pageFlightInfo.data.rqstParams=pageFlightInfo.flightData['RQSTPARAM'];
					pageFlightInfo.data.globalList = pageFlightInfo.flightData['GLOBALLIST'];
					pageFlightInfo.data.errors = pageFlightInfo.flightData['ERRORS'];
				}
				pageFlightInfo.bookmarkBtn = true;
				pageFlightInfo.getBookmarkData("StoreData");
			} else {
				pageFlightInfo.data.labels = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.labels;
				pageFlightInfo.data.siteParam = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.siteParam;
				pageFlightInfo.data.globalList = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.globalList;
				pageFlightInfo.data.rqstParams = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.requestParam;
				pageFlightInfo.data.aircraftList = pageFlightInfo.moduleCtrl.convertAircraftNameToJSON(pageFlightInfo.data.globalList.aircraftName);

				if (pageFlightInfo.data.siteParam.siteAllowFavorite == 'TRUE' && pageFlightInfo.data.siteParam.siteAllowBookmarkFlight == 'TRUE') {
					pageFlightInfo.bookmarkBtn = true;
					pageFlightInfo.getBookmarkData("StoreConfig");


					if ((pageFlightInfo.flightData == null) || (pageFlightInfo._utils.isEmptyObject(pageFlightInfo.flightData))) {
						flightData = {};
						flightData['LABELS'] = pageFlightInfo.data.labels;
						flightData['SITEPARAM'] = pageFlightInfo.data.siteParam;
						flightData['RQSTPARAM'] = pageFlightInfo.data.rqstParams;
						flightData['aircraftList'] = pageFlightInfo.data.aircraftList;
						flightData['GLOBALLIST'] = pageFlightInfo.data.globalList;
						this.moduleCtrl.setFlightInfoData(flightData);
						pageFlightInfo._utils.storeLocalInDevice(merciAppData.DB_FLIGHTINFO, flightData, "overwrite", "json");

					}

					var errors = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.errorStrings;
					if (pageFlightInfo._utils.isEmptyObject(pageFlightInfo.data.rqstParams.flightInfoBean.segment.beginLocation)) {
						pageFlightInfo.errorOccured = true;
						pageFlightInfo.printUI = false;
						var error = errors[10307];
						pageFlightInfo.__addErrorMessage(error.localizedMessage + " (" + error.errorid + ")");
						aria.utils.Json.setValue(pageFlightInfo.data, 'error_msg', true);
					}
				};
				
				// google analytics
				pageFlightInfo.__ga.trackPage({
					domain: pageFlightInfo.data.siteParam.siteGADomain,
					account: pageFlightInfo.data.siteParam.siteGAAccount,
					gaEnabled: pageFlightInfo.data.siteParam.siteGAEnable,
					page: 'Flight Status?wt_market=' + ((pageFlightInfo.data.base[13] != null) ? pageFlightInfo.data.base[13] : '') + '&wt_language=' + pageFlightInfo.data.base[12] + '&wt_officeid=' + pageFlightInfo.data.siteParam.siteOfficeId + '&wt_sitecode=' + pageFlightInfo.data.base[11],
					GTMPage: 'Flight Status?wt_market=' + ((pageFlightInfo.data.base[13] != null) ? pageFlightInfo.data.base[13] : '') + '&wt_language=' + pageFlightInfo.data.base[12] + '&wt_officeid=' + pageFlightInfo.data.siteParam.siteOfficeId + '&wt_sitecode=' + pageFlightInfo.data.base[11]
				});
			}
			if(((pageFlightInfo.data.rqstParams.flightInfoBean.segment.cancel!=null && pageFlightInfo.data.rqstParams.flightInfoBean.segment.cancel=="TRUE")) || (!this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.enhanceFlightInfoBean) && pageFlightInfo.data.rqstParams.enhanceFlightInfoBean.isCancelled == 'TRUE')){
				pageFlightInfo.errorOccured = true;											
				//pageFlightInfo.__addErrorMessage(pageFlightInfo.data.labels.tx_merci_text_flight_canceled);
				pageFlightInfo.__addErrorMessage(pageFlightInfo.data.labels.tx_merci_text_flight_canceled);
				aria.utils.Json.setValue(pageFlightInfo.data, 'error_msg', true);						
			}
			if(!this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.enhanceFlightInfoBean) && (pageFlightInfo.data.rqstParams.enhanceFlightInfoBean.isAlternate || pageFlightInfo.data.rqstParams.enhanceFlightInfoBean.isAlternateCancelled)){
				pageFlightInfo.errorOccured = true;											
				pageFlightInfo.__addInfoMessage(pageFlightInfo.data.labels.tx_merci_text_flight_notoper_alternate);
				aria.utils.Json.setValue(pageFlightInfo.data, 'info_msg', true);						
			}			
		},

		$viewReady: function() {
			//if(this.flow_type !="MyFav"){
			var header = pageFlightInfo.moduleCtrl.getModuleData().headerInfo;

			var headerButton = {};
			arr = [];
			headerButton.scope = pageFlightInfo;
			headerButton.myVar = pageFlightInfo.myVar;
			if (pageFlightInfo.data.siteParam.siteAllowFavorite == 'TRUE' && pageFlightInfo.data.siteParam.siteAllowBookmarkFlight == 'TRUE') {
				arr.push("bkmkButton");
			};
			if (pageFlightInfo.data.siteParam.allowFlightUpdate != undefined && pageFlightInfo._utils.booleanValue(pageFlightInfo.data.siteParam.allowFlightUpdate) == true) {
				arr.push("rfrshButton");
			};
			headerButton.button = arr;
			if (pageFlightInfo._utils.booleanValue(pageFlightInfo.data.siteParam.enableLoyalty) == true && pageFlightInfo._utils.booleanValue(pageFlightInfo.data.rqstParams.params.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: pageFlightInfo.data.labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}

			//this.moduleCtrl.setHeaderInfo(headerData);
			pageFlightInfo.moduleCtrl.setHeaderInfo({
				title: pageFlightInfo.data.labels.tx_merci_text_flight_status,
				bannerHtmlL: pageFlightInfo.data.rqstParams.params.bannerHtml,
				homePageURL: pageFlightInfo.data.siteParam.homeURL,
				showButton: true,
				companyName: pageFlightInfo.data.siteParam.sitePLCompanyName,
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFlightInfo",
						data:this.data
					});
			}
		},

		$displayReady: function() {
			if (pageFlightInfo.bookmarkBtn == false) {
				$('body').removeClass('flight-status shtm sear');
				$('body').addClass('timetable fava');
			};
		},
		
		convertAircraftNameToJSON: function(array) {
			var output = {};
			for (var i = 0; i < array.length; ++i) {
				output[array[i][0]] = array[i][1];
			}
			return output;
		},		

		msToTime: function(s) {
			if (pageFlightInfo.flow_type != "MyFav") {
				var labels = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.labels;
			} else {
				var labels = pageFlightInfo.data.labels;
			};
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;

			return hrs + ' ' + labels.tx_merci_text_pnr_hour + ' ' + mins + ' ' + labels.tx_merci_text_pnr_minutes;
		},

		backToHome: function() {
			pageFlightInfo.moduleCtrl.goBack();
		},

		refreshPageinfo: function() {
			if (pageFlightInfo.flow_type == "MyFav") {
				var params = pageFlightInfo.data.rqstParams.params;
			} else {
				var params = pageFlightInfo.moduleCtrl.getModuleData().servicing.MFlightInfo_A.requestParam.params;
			};
			this.data.errors = [];
			this.data.infos = [];
			var parameters = {
				fd: params.fd,
				fn: params.flightNumber,
				dd: params.dd,
				MMM: params.MMM,
				YYYY: params.YYYY,
				pagefrom: params.pagefrom,
				pnr: params.pnr,
				lastName: params.lastName,
				loading: true
			}

			var action = 'MFIFOReq.action';
			this._utils.sendNavigateRequest(parameters, action, this);
		},

		__addErrorMessage: function(message) {
			// if errors is empty
			if (this.data.errors == null) {
				this.data.errors = new Array();
			}
			// create JSON and append to errors
			var error = {
				'TEXT': message
			};
			pageFlightInfo.data.errors.push(error);
		},
		__addInfoMessage: function(message) {
			// if errors is empty
			if (this.data.infos == null) {
				this.data.infos = new Array();
			}
			// create JSON and append to errors
			var info = {
				'TEXT': message
			};
			pageFlightInfo.data.infos.push(info);
		},

		onMyFavoriteClick: function() {
			dateParamsBg = pageFlightInfo.data.rqstParams.flightInfoBean.segment.beginDateBean;
			dateParamsBegin = dateParamsBg.jsDateParameters;
			dateParamsEd = pageFlightInfo.data.rqstParams.flightInfoBean.segment.endDateBean;
			dateParamsEnd = dateParamsEd.jsDateParameters;


			beginDate = new Date(dateParamsBg.year, dateParamsBg.month, dateParamsBg.day, dateParamsBg.hour, dateParamsBg.minute, 0, 0);
			bgDate = pageFlightInfo._utils.formatDate(beginDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat);
			beginTime = pageFlightInfo._utils.formatDate(beginDate, 'HH:mm')

			endDate = new Date(dateParamsEd.year, dateParamsEd.month, dateParamsEd.day, dateParamsEd.hour, dateParamsEd.minute, 0, 0);
			edDate = pageFlightInfo._utils.formatDate(endDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat);
			endTime = pageFlightInfo._utils.formatDate(endDate, 'HH:mm')

			var flights = {
				status: []
			};

			var beginyr = dateParamsBegin.split(",");
			var endyr = dateParamsEnd.split(",");
			var siteFSShow = pageFlightInfo.jsonValue.siteFSShow;
			var beginDtObj = new Date(parseInt(beginyr[0]), parseInt(beginyr[1]), parseInt(beginyr[2]), parseInt(beginyr[3]), parseInt(beginyr[4]), parseInt(beginyr[5])).getTime();
			/*	var bDate = pageFlightInfo.jsonValue.beginDate;
			var dt=bDate.split(' ');
			var month = dt[1];
			var date = dt[0];
			var year = dt[2];

			*/
			var flightInfo = {
				"beginDate": bgDate,
				"endDate": edDate,
				"beginyr": beginyr[0],
				"endyr": endyr[0],
				"bcityName": pageFlightInfo.jsonValue.bcityName,
				"bcityCode": pageFlightInfo.jsonValue.bCityCode,
				"ecityName": pageFlightInfo.jsonValue.ecityName,
				"ecityCode": pageFlightInfo.jsonValue.eCityCode,
				"beginTime": beginTime,
				"endTime": endTime,
				"flightNum": pageFlightInfo.jsonValue.flightNum,
				"noOfStop": pageFlightInfo.jsonValue.noOfStop,
				"aircraft": pageFlightInfo.jsonValue.Aircraft,
				"journeyTime": pageFlightInfo.jsonValue.journeyTime,
				"mealDesc": pageFlightInfo.jsonValue.mealDesc,
				"beginDtObj": beginDtObj
			};

			var key1 = dateParamsBg.formatDateTimeAsYYYYMMddHHMM + pageFlightInfo.jsonValue.bCityCode + pageFlightInfo.jsonValue.eCityCode + pageFlightInfo.jsonValue.flightNum;
			var test = false;

			var result=this.moduleCtrl.getFavouriteData();
			//pageFlightInfo._utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {
				
				if (result && result != "" && result !=null) {
					if (typeof result === 'string') {
						var jsonObj = JSON.parse(result);
					}else{
						var jsonObj = (result);
					}
						//aria.utils.Json.setValue(flightData, 'flightData', "");
				}else{
					var jsonObj = {};
				}

				if (!pageFlightInfo._utils.isEmptyObject(jsonObj)) {
					for (var key in jsonObj) {
						if ('FLIGHTSTATUS' == key) {
							//var slctFareInfo=JSON.parse(jsonObj[key]);
							var slctFlightStatus = jsonObj[key];
						}
					}
				}

				if (!pageFlightInfo._utils.isEmptyObject(slctFlightStatus)) {
					for (var key in slctFlightStatus) {
						if (key1 == key) {
							delete slctFlightStatus[key];
							jsonObj["FLIGHTSTATUS"] = slctFlightStatus;
							pageFlightInfo._utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
							test = true;
							break;
						}
					}
				} else {
					slctFlightStatus = {};
				}
				if (test == false) {
					if ((pageFlightInfo._utils.isEmptyObject(jsonObj)) || (jsonObj == null)) {
						slctFlightStatus = {};
						jsonObj = {};
					}
					if ((pageFlightInfo._utils.isEmptyObject(slctFlightStatus)) || (slctFlightStatus == null)) {
						slctFlightStatus = {};
					}

					if (siteFSShow == 'true') {

						if (!pageFlightInfo._utils.isEmptyObject(pageFlightInfo.jsonData)) {
							for (var key in pageFlightInfo.jsonData) {
								flightInfo[key] = pageFlightInfo.jsonData[key];
							}
						}
					}
					flightInfo["RQSTPARAM"] = aria.utils.Json.copy(pageFlightInfo.data.rqstParams);
					slctFlightStatus[key1] = (flightInfo);
					slctFlightStatus = pageFlightInfo._sortData(slctFlightStatus);
					jsonObj["FLIGHTSTATUS"] = slctFlightStatus;
					pageFlightInfo._utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
					this.moduleCtrl.setFavouriteData(jsonObj);
				}
				if (test == false) {
					document.getElementById('favButton').setAttribute("aria-checked", true);
					pageFlightInfo.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark + 1);
					pageFlightInfo.toggleBookmarkAlert(this,"added");
				} else {
					document.getElementById('favButton').setAttribute("aria-checked", false);
					pageFlightInfo.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark - 1);
					pageFlightInfo.toggleBookmarkAlert(this,"deleted");
				}
			//});

		},
		onBookMarkParameters: function(jSon, jSondata, jsonKey) {
			pageFlightInfo.jsonValue = jSon;
			pageFlightInfo.jsonData = jSondata;
			pageFlightInfo.jsonKey = jsonKey;
			pageFlightInfo.getBookmarkData("storeData");

		},

		iscroller: function() {
			var jsonFltScr = JSON.parse(pageFlightInfo._utils.getStoredItem('FLIGHTSTATUS'));
			var myscroll = new iScroll('wrapper');
			/*, {
			snap: 'div',
			momentum: false,
			vScroll:true, hScroll:true,
			hScrollbar: false,
			onScrollEnd: function () {
			 }
		  });*/

		},
		getBookmarkData: function(args) {
			if (args == "StoreConfig") {
				
				var result=this.moduleCtrl.getFlightInfoData();
				//pageFlightInfo._utils.getStoredItemFromDevice(merciAppData.DB_FLIGHTINFO, function(result) {

					if (result && result != "") {
						if (typeof result === 'string') {
							pageFlightInfo.flightData = JSON.parse(result);
						}else{
							pageFlightInfo.flightData = (result);
						}
						//aria.utils.Json.setValue(flightData, 'flightData', "");
					} else {
						pageFlightInfo.flightData = {};
					}
				//});
			} else {
				var result=this.moduleCtrl.getFavouriteData();
				//pageFlightInfo._utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {
					if (result && result != "") {
						if (typeof result === 'string') {
							jsonObj = JSON.parse(result);
						}else{
							jsonObj = (result);
						}
						if (!pageFlightInfo._utils.isEmptyObject(jsonObj)) {
							for (var key in jsonObj) {
								if ('FLIGHTSTATUS' == key) {
									//var slctFareInfo=JSON.parse(jsonObj[key]);
									pageFlightInfo.jsonflight = jsonObj[key];
									for (var key in pageFlightInfo.jsonflight) {
										if (key == pageFlightInfo.jsonKey) {
											pageFlightInfo.jsonflights = pageFlightInfo.jsonflight[pageFlightInfo.jsonKey];
											pageFlightInfo.data.rqstParams = pageFlightInfo.jsonflights.RQSTPARAM;
											pageFlightInfo.myVar = 1;
										}
									}
								}
							}
						} else {
							pageFlightInfo.jsonflight = {};
						}
					}
				//});
			};
		},

		_sortData: function(jsonDataFmt) {
			sortArr = [];
			sortJson = {};
			if (!pageFlightInfo._utils.isEmptyObject(jsonDataFmt)) {
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

		toggleBookmarkAlert: function(scope,args) {
			if(args=="added" || args.id=="added"){
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay'));
				pageFlightInfo._utils.toggleClass(overlayDiv, 'on');
			}else{
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay1'));
				pageFlightInfo._utils.toggleClass(overlayDiv, 'on');
			}
		}
	}
});