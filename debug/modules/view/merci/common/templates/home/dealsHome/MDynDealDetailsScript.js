Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.home.dealsHome.MDynDealDetailsScript",
	$dependencies: ["modules.view.merci.common.utils.URLManager", "modules.view.merci.common.utils.MCommonScript", "modules.view.merci.common.utils.MerciGA","aria.utils.HashManager"],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;			
		pageDeals = this;
		var pageHeader = document.getElementById("top") ;
		pageHeader.style.display = "none" ; 
		aria.utils.HashManager.addCallback({
			fn: 'onHashChangeOverride',
			scope: this
		});
	},

	$prototype: {

		$dataReady: function(args, cb) {
			
			this.showFareCond = true;
			this.__merciFunc.getStoredItemFromDevice("DB_MYFAVOURITE", function(result) {
				
				if (typeof result === 'string') {
					result = JSON.parse(result);
				}
				var arr = pageDeals.bookmarkedOfferList;
				if(arr == undefined){
					arr = new Array();
				}				
				if(result.DEALSTATUS != null){					
					for(var key in result.DEALSTATUS){
						if(result.DEALSTATUS.hasOwnProperty(key)){
							arr.push(key);					
						}						
					}
				}
				pageDeals.bookmarkedOfferList = arr;			
			});
			var travelEndDate = this.getTravelEndDate();
			this.moduleCtrl.setValueforStorage(travelEndDate, 'TRAVEL_END_DATE');
			if (document.getElementById("travelPeriod").innerHTML == "") {
				document.getElementById("travelPeriod").innerHTML = rqstParams.dbean.facsPageContent;
			}
		},

		$displayReady: function() {			
			
			$("div#layout").css({'margin-top' : '0'});
		},
		$viewReady: function() {
			
				
		},
		isPaxExist: function(paxType) {
			if (this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam.selectedOfferBean.paxRestrictions[paxType] != null) {
				return true;
			} else {
				return false
			}
		},
		onDealBookmark: function(a, b) {$("#selectDep").hasClass("expanded")
			a.stopPropagation();			
			if($(".bookmark.dynDealBookmark").hasClass("bookmarked")){
				$(".bookmark.dynDealBookmark").removeClass("bookmarked");
				if (pageDeals.bookmarkedOfferList && pageDeals.bookmarkedOfferList != undefined) {
					var index = pageDeals.bookmarkedOfferList.indexOf(b.offerId);
					if (index > -1) {
						pageDeals.bookmarkedOfferList.splice(index, 1);
					}					
				}				
			}else{
				$(".bookmark.dynDealBookmark").addClass("bookmarked");						
				if (pageDeals.bookmarkedOfferList == undefined) {
					pageDeals.bookmarkedOfferList = new Array();				
				}					
				pageDeals.bookmarkedOfferList.push(b.offerId);				
			}	
			this.__merciFunc.storeLocalInDevice("BOOKMARKED_OFFERS", pageDeals.bookmarkedOfferList, "overwrite", "json");		
			var siteParams =  this.moduleCtrl.getModuleData().booking.MFACS_A.siteParam;
			var rqstParams =  this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam;
			var offerID = b.offerId;
		
			
			
			var cost = rqstParams.selectedOfferBean.currency + rqstParams.selectedOfferBean.price;
			var origin = rqstParams.orig_city_name;
			var currency = rqstParams.selectedOfferBean.currency;
			origin = encodeURI(origin);
			var destination = rqstParams.dest_city_name;
			destination = encodeURI(destination);
			var startDate = rqstParams.startDate;
			//startDate = startDate.substring(0,startDate.length-3)
			var endDate =  rqstParams.endDate;
			var endDTObj = new Date(endDate.substring(7, 11), pageDeals.__getMonthAsInt(endDate.substring(3, 6)), endDate.substring(0, 2), 0, 0, 0, 0).getTime();
			var countrySite = rqstParams.countrySite;
			var bookMarkString = "://?flow=bookmark/price=" + cost + "&origin=" + origin + "&destination=" + destination + "&startDate=" + startDate + "&endDate=" + endDate + "&offerID=" + offerID + "&COUNTRY_SITE=" + countrySite;
			if (this.bookmarkBtn == false) {
				this.__merciFunc.appCallBack(siteParams.appCallBack, bookMarkString);
			} else {
				var origin1 = rqstParams.orig_city_name;
				var destination1 = rqstParams.dest_city_name;
				origin1 = origin1.trim();
				destination1 = destination1.trim();
				var that = this;

				var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
				//that.__merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {

				if (typeof result === 'string') {
					jsonObj = JSON.parse(result);
				}else{
					jsonObj = (result);
				}
				
				/*  Delete Aria:parent if exists (If Aria:parent is present in any level of json then delete it)*/

				for (var key in jsonObj) {
					if (key =="aria:parent" ) {
						delete jsonObj[key];
					}
					for (var key1 in jsonObj[key]) {
						if (key1 =="aria:parent" ) {
							delete jsonObj[key][key1];
						}
						for (var key2 in jsonObj[key][key1]) {
							if (key2 =="aria:parent" ) {
								delete jsonObj[key][key1][key2];
							}
							for (var key3 in jsonObj[key][key1][key2]) {
								if (key3 =="aria:parent" ) {
									delete jsonObj[key][key1][key2][key3];
								}
							}
						}
					}
				}

				if (!that.__merciFunc.isEmptyObject(jsonObj)) {
					for (var key in jsonObj) {
						if ('DEALSTATUS' == key) {
							//var slctFareInfo=JSON.parse(jsonObj[key]);
							var slctDealInfo = jsonObj[key];
						}
					}
				}
				var jsonkey = offerID;
				var test = false;
				if (!that.__merciFunc.isEmptyObject(slctDealInfo)) {
					for (var key in slctDealInfo) {
						if (jsonkey == key) {
							delete slctDealInfo[key];
							jsonObj['DEALSTATUS'] = slctDealInfo;
							that.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
							test = true;
							break;
						}
					}
				}

				if (test == false) {
					if (slctDealInfo == null) {
						slctDealInfo = {};


					}
					if (jsonObj == null) {

						jsonObj = {};

					}

					var dealInfo = {
						"currency": currency,
						"cost": b.offerData.price,
						"origin": origin1,
						"destination": destination1,
						"startDate": startDate,
						"endDate": endDate,
						"offerID": offerID,
						"COUNTRY_SITE": countrySite,
						"endTime": endDTObj
					};
					slctDealInfo[jsonkey] = (dealInfo);
					jsonObj["DEALSTATUS"] = slctDealInfo;
					that.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
					var setData=this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE,jsonObj);
						
				}
				if (test == false) {
					pageDeals.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark + 1);
					pageDeals.toggleBookmarkAlert(this,"added");
					
				} else {
					pageDeals.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark - 1);
					pageDeals.toggleBookmarkAlert(this,"deleted");
				};
				//});

			}
		},
		
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
		toggleBookmarkAlert: function(scope,args) {
			if(args=="added" || args.id=="added"){
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay'));
				this.__merciFunc.toggleClass(overlayDiv, 'on');
			}else{
				var overlayDiv = document.getElementById(this.$getId('bookmarksAlertOverlay1'));
				this.__merciFunc.toggleClass(overlayDiv, 'on');
			}
		},
		onOfferClick: function(a, b) {
			var offerId = b.ID;
			var rqstParams =  this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam;
			var country = rqstParams.countrySite;			
			this.__merciFunc.storeLocal("OID", offerId, "overwrite", "text");			
			this.__merciFunc.storeLocal("countrySite", country, "overwrite", "text");
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();			
			var client = '';
			if (bp[14] != null && bp[14] != '') {
				client = '&client=' + bp[14];
			}
			var showDeviceCal = '';
			if (bp[15] != null && bp[15] != '') {
				showDeviceCal = '&ENABLE_DEVICECAL=' + bp[15];
			}
			params = 'SITE=' + bp[11] + '&LANGUAGE=' + bp[12] + '&offer_id=' + offerId + '&result=json&COUNTRY_SITE=' + country ;
			actionName = 'selectedOffersApi.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'GET',
				loading: true,
				expectedResponseType: 'json',
				defaultParams: false,
				cb: {
					fn: this.__onOfferClickCallback,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},
		__onOfferClickCallback: function(response, inputParams) {
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
		goBack: function(){
			var pageHeader = document.getElementById("top") ;
			pageHeader.style.display = "block" ;
			this.moduleCtrl.goBack();
		},
		getTravelEndDate: function() {
			var endDate = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam.selectedOfferBean.travelEnd;
			var endSplit = endDate.split(" ");
			var es = endSplit[0].replace(/-/g, '/');
			var endDT = new Date(es);
			var endDispDate = endDT.toString();
			var formatDate = endDispDate.split(" ");
			return formatDate[0] + " " + formatDate[2] + " " + formatDate[1] + " " + formatDate[3];
		},
		onHashChangeOverride: function(){
			if(aria.utils.HashManager.getHashString() != 'merci-MDynDealDetails_A'){
				var pageHeader = document.getElementById("top") ;
				pageHeader.style.display = "block" ;
			}
		}
		
	}	
});