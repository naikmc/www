Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.home.dealsHome.MDynHomeDealsScript",
	$dependencies: ["modules.view.merci.common.utils.URLManager", "modules.view.merci.common.utils.MCommonScript", "modules.view.merci.common.utils.MerciGA","aria.utils.HashManager"],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;	
	},

	$prototype: {

		$dataReady: function(args, cb) {		
			this.dealsSectionReady = true;
		},

		$viewReady: function() {
			if( this.data.siteParameters.siteAllowHomeDeals == "TRUE" 
				&& this.data.rqstParams.listofferbean != null 
				&& this.data.rqstParams.listofferbean.offers != null 
				&& this.data.rqstParams.listofferbean.offers.length > 0){
				var dealsData = {};
				dealsData.scrollId = this.$getId('deals_dynaScroller');
				dealsData.id = 'deals_dynaScroller';
				dealsData.olScroll = 'deals_olScroll';
				dealsData.liScroll = 'deals_liScroll_';
				dealsData.length = this.data.rqstParams.listofferbean.offers.length;
				this.__merciFunc.setScroll(dealsData);
			 }		
		
		},
		__onDealsCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				modules.view.merci.common.utils.MCommonScript.hideMskOverlay(false);
				var json = this.moduleCtrl.getModuleData();
				json.booking.MListOffers_A = response.responseJSON.data.booking.MListOffers_A;
				//this.__setInitialData(json.booking);
				this.dealsSectionReady = true;
				this.$refresh({
					section: 'dealsContent'
				});
			}
		},
		getParam: function(name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return decodeURIComponent(name[1]);
		


		},
		
		onChangeCountry: function(){
			$("#selectDep").addClass("expanded");
			//this.moduleCtrl.navigate(null, "merci-MDynHomePopup_A");
			aria.utils.HashManager.setHash("merci-MDynHomePopup_A");
			this.moduleCtrl.setHeaderInfo({				
				showButton: true,
				title: ""
			});
			$("#bannerLogo").hide();
			$(".sb-toggle").hide();
			$("header.banner").removeClass("banner");
			$("button.back").addClass("dynamicB");
			
		},
		onMoreDetails: function(args, ATargs){
			var oId = ATargs.ID;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();			
			var params = 'result=json&offer_id=' + oId + '&COUNTRY_SITE=' + bp[13] + "&dest_city_name=" + ATargs.destCityName + "&orig_city_name=" + ATargs.origCityName + "&startDate=" + ATargs.startDate + "&endDate=" + ATargs.endDate;
			var actionName = 'MFareCond.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.__onFareCondCB,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);		
		},
		__onFareCondCB: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null && nextPage == "merci-MFACS_A") {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;					
					this.moduleCtrl.navigate(null, "merci-MDynDealDetails_A");
				}
			}
		},
		onDealBookmark: function(a, b) {
			a.stopPropagation();
			var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
			var offerID = b.offerId;
			var bookmarks = document.getElementsByClassName('bookmark');
			for (i = 0; i < bookmarks.length; i++) {
				if (bookmarks[i].getAttribute('offerid') == offerID) {
					if (bookmarks[i].getAttribute('aria-checked') == 'false') {
						bookmarks[i].setAttribute('aria-checked', 'true');
						var offerArray = this.moduleCtrl.getValuefromStorage('offerListBookMarked');
						if (offerArray && offerArray != undefined) {
							offerArray.push(offerID);
							this.moduleCtrl.setValueforStorage(offerArray, 'offerListBookMarked');
						}
					} else {
						bookmarks[i].setAttribute('aria-checked', 'false');
						var offerArray = this.moduleCtrl.getValuefromStorage('offerListBookMarked');
						if (offerArray && offerArray != undefined) {
							var index = offerArray.indexOf(offerID);
							if (index > -1) {
								offerArray.splice(index, 1);
							}
							this.moduleCtrl.setValueforStorage(offerArray, 'offerListBookMarked');
						}
					}
				}
			}
			var cost = document.getElementById("cost_" + offerID).getAttribute("value");
			var origin = document.getElementById("origin_" + offerID).getAttribute("value");
			var currency = document.getElementById("currency_" + offerID).innerText;
			origin = encodeURI(origin);
			var destination = document.getElementById("destination_" + offerID).getAttribute("value");
			destination = encodeURI(destination);
			var startDate = document.getElementById("startDate_" + offerID).innerHTML;
			//startDate = startDate.substring(0,startDate.length-3)
			var endDate = document.getElementById("endDate_" + offerID).innerHTML;
			var endDTObj = new Date(endDate.substring(7, 11), pageDeals.__getMonthAsInt(endDate.substring(3, 6)), endDate.substring(0, 2), 0, 0, 0, 0).getTime();
			var countrySite = document.getElementById("countryBox").value;
			var bookMarkString = "://?flow=bookmark/price=" + cost + "&origin=" + origin + "&destination=" + destination + "&startDate=" + startDate + "&endDate=" + endDate + "&offerID=" + offerID + "&COUNTRY_SITE=" + countrySite;
			if (this.bookmarkBtn == false) {
				this.__merciFunc.appCallBack(siteParams.appCallBack, bookMarkString);
			} else {
				var origin1 = document.getElementById("origin_" + offerID).innerText;
				var destination1 = document.getElementById("destination_" + offerID).innerText;
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
		isPaxExist: function(paxType) {
			if (this.fareCond.requestParam.selectedOfferBean.paxRestrictions[paxType] != null) {
				return true;
			} else {
				return false
			}
		}
	}	
});