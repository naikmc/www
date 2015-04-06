Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.dealsoffers.DealsScript',
	$dependencies: ['modules.view.merci.segments.booking.scripts.MBookingMethods', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.MerciGoogleMaps'
	],

	$constructor: function() {
		pageDeals = this;
		cc = 0;
		callBackForAppsCountryName = false;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		// merci common method
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;

		this.map = modules.view.merci.common.utils.MerciGoogleMaps;
		pageDeals.printUI = false;
	},
	$destructor: function() {
		// release memory
		pageDeals = null;
	},
	$prototype: {

		_isSelectedCountry: function(args) {

			var countryCodeMatched = this.getParam('COUNTRY_SITE') == args.country.code;
			var defaultCountryMatched = this.moduleCtrl.getValuefromStorage('defaultCountry') == args.country.code;
			var noCountryCode = this.getParam('COUNTRY_SITE') == null || this.getParam('COUNTRY_SITE') == '';
			var ipMatched = args.listParentOfferBean.ipCountry != null && args.listParentOfferBean.ipCountry == args.country.code;
			var noDefaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == '';

			return defaultCountryMatched || (noDefaultCountry && (countryCodeMatched || (noCountryCode && ipMatched)));
		},

		getParam: function(name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return decodeURIComponent(name[1]);
		},

		$dataReady: function(args, cb) {
			this.map.loadGoogleMaps();
			this.data.errors = new Array();
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			this.rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam;

			var cntrySite = "";
			var cntryCode = "";
			var defaultCountry = "";
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null && this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.siteDefaultCountrySel == 'IP' && (this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == "")) {
				defaultCountry = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.ipSelectedCountry;
				this.moduleCtrl.setValueforStorage(defaultCountry, 'defaultCountry');
			} else {
				defaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry');
			}
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {
				var retainAppCriteria = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.retainAppCriteria;
			} else {
				var retainAppCriteria = "";
			}
			if (defaultCountry == null || defaultCountry == "") {
				/* Condition for PTR 08032431: Deals displayed are not as per the country selected */
				defaultCountry = this.getParam('COUNTRY_SITE');

				if (defaultCountry == null || defaultCountry == "") {
					defaultCountry = base[13];
					this.moduleCtrl.setValueforStorage(defaultCountry, 'defaultCountry');
				}
			}
			var siteParam = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
			if ((siteParam.siteMyFavorite == "TRUE") && (siteParam.allowBookmarksParam == "TRUE")) {
				this.bookmarkBtn = true;
				 
				this.getBookmarkData();
			} else {
				this.bookmarkBtn = false;
				pageDeals.printUI = true;
			}
			this.moduleCtrl.setValueforStorage(false, 'filterCriteria');
			var orientation = this.doOnOrientationChange();
			this.moduleCtrl.setValueforStorage(orientation, 'orientation');
			if (this.moduleCtrl.getModuleData() == null || this.moduleCtrl.getModuleData().booking.MListOffers_A == null || (args != undefined && args.SELECTED_COUNTRY != null && args.SELECTED_COUNTRY != this.moduleCtrl.getValuefromStorage('defaultCountry'))) {
				if (args != undefined && args.SELECTED_COUNTRY != null) {
					this.moduleCtrl.setValueforStorage(args.SELECTED_COUNTRY, 'defaultCountry');
					defaultCountry = args.SELECTED_COUNTRY;
				}
				var params = 'result=json&SELECTED_COUNTRY=' + defaultCountry + '&REMEMBER_SRCH_CRITERIA=' + retainAppCriteria;
				var request = {
					parameters: params,
					action: 'DealsOffersApi.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onDealsCallback,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				this.__setInitialData(this.moduleCtrl.getModuleData().booking);
				this.sectionReady = true;
			}

			if (document.getElementById("offer_id_list") != null) {
				var list = document.getElementById("offer_id_list").value;
				var listOfOffers = list.split("-");
				this.moduleCtrl.setValueforStorage(listOfOffers, 'offerListBookMarked');
			}
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {
				var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
				
				// google analytics
				this.__ga.trackPage({
					domain: siteParams.siteGADomain,
					account: siteParams.siteGAAccount,
					gaEnabled: siteParams.siteGAEnable,
					page: 'Fare Deals?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
					GTMPage: 'Fare Deals?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
				});
			}
		},
		__onDealsCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				modules.view.merci.common.utils.MCommonScript.hideMskOverlay(false);
				var json = this.moduleCtrl.getModuleData();
				json.booking.MListOffers_A = response.responseJSON.data.booking.MListOffers_A;
				this.__setInitialData(json.booking);
				this.sectionReady = true;
				this.$refresh({
					section: 'docontent'
				});
			}
		},
		__setInitialData: function(data) {
			this.moduleCtrl.setValueforStorage(false, 'filterCriteria');
			var orientation = this.doOnOrientationChange();
			this.moduleCtrl.setValueforStorage(orientation, 'orientation');
			var bParmas = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bParmas[14] != null && bParmas[14] != '') {
				this.moduleCtrl.setValueforStorage(true, 'client');
			}

			var listOfferBean = data.MListOffers_A.requestParam.listofferbean;
			this.moduleCtrl.setValueforStorage(listOfferBean, 'filteredlistofferbean');
			this.data.filteredlistofferbean = listOfferBean;
			this.moduleCtrl.setValueforStorage(listOfferBean.currentDate, 'CURRENT_DATE');
			if (listOfferBean.offers != undefined && listOfferBean.offers[0] != undefined && listOfferBean.offers[0].currency != undefined) {
				this.moduleCtrl.setValueforStorage(listOfferBean.offers[0].currency, 'FILTER_CURRENCY');
			}
		},
		onOfferClick: function(a, b) {
			var offerId = b.ID;
			var country = document.getElementById("countryBox").value;
			//var oID = this.moduleCtrl.getValuefromStorage('SELECTED_OFFER_ID');
			this.__merciFunc.storeLocal("OID", offerId, "overwrite", "text");
			//var countrySite = this.moduleCtrl.getValuefromStorage('defaultCountry');
			//if(countrySite == null){
			//countrySite = this.moduleCtrl.getParam('COUNTRY_SITE');
			//}
			this.__merciFunc.storeLocal("countrySite", country, "overwrite", "text");
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam;
			var client = '';
			if (bp[14] != null && bp[14] != '') {
				client = '&client=' + bp[14];
			}

			var showDeviceCal = '';
			if (bp[15] != null && bp[15] != '') {
				showDeviceCal = '&ENABLE_DEVICECAL=' + bp[15];
			}

			params = 'SITE=' + bp[11] + '&LANGUAGE=' + bp[12] + '&offer_id=' + offerId + '&result=json&COUNTRY_SITE=' + country + '&REMEMBER_SRCH_CRITERIA=' + rqstParams.retainAppCriteria + client + showDeviceCal + '&IS_USER_LOGGED_IN=' + this.rqstParams.IS_USER_LOGGED_IN;
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
			//this.moduleCtrl.setValueforStorage(offerId,'SELECTED_OFFER_ID');
			//this.moduleCtrl.setValueforStorage('DEALS-FLOW','FLOW');
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
		$displayReady: function() {
			try {
				if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {

					var labels = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels;
					var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
					var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam;

					// set details for header
					if (this.__merciFunc.booleanValue(siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(rqstParams.IS_USER_LOGGED_IN) == true) {
						var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
						var loyaltyInfoJson = {
							loyaltyLabels: labels.loyaltyLabels,
							airline: bp[16],
							miles: bp[17],
							tier: bp[18],
							title: bp[19],
							firstName: bp[20],
							lastName: bp[21],
							programmeNo: bp[22]
						};
					}
					this.moduleCtrl.setHeaderInfo({
						title: labels.DealsandOffers,
						bannerHtmlL: rqstParams.bannerHtml,
						homePageURL: siteParams.homeURL,
						showButton: true,
						companyName: siteParams.sitePLCompanyName,
						loyaltyInfoBanner: loyaltyInfoJson
					});
				}

				$("body").removeClass();
				$("body").addClass("daof list favour");
				var listOfferBean = rqstParams.listofferbean;

				var offerList = listOfferBean;
				var maxPrice = 0;
				if (offerList != undefined && offerList.offers.length != 0) {
					for (var i = 0; i < offerList.offers.length; i++) {
						if (offerList.offers[i].price > maxPrice) {
							maxPrice = offerList.offers[i].price;
						}
					}
				}
				var minPrice = maxPrice;
				if (offerList != undefined && offerList.offers.length != 0) {
					for (var i = 0; i < offerList.offers.length; i++) {
						if (offerList.offers[i].price < minPrice) {
							minPrice = offerList.offers[i].price;
						}
					}
				}


				this.moduleCtrl.setValueforStorage(maxPrice, 'maxPriceLimit');
				this.moduleCtrl.setValueforStorage(minPrice, 'minPriceLimit');
				this.createSlider(minPrice, maxPrice);
				var filePath = $("#sliderJquery").val();
				if (filePath != null) {
					var fileref = document.createElement('script');
					fileref.setAttribute("type", "text/javascript");
					fileref.setAttribute("src", filePath);
					document.getElementsByTagName("head")[0].appendChild(fileref);
				}
				if (!this.moduleCtrl.getValuefromStorage('filterCriteria')) {
					$('#priceRange').hide();
					$('#destination').hide();
					$('#travelPeriod').hide();
				}

				this.resetDate()

				if (siteParams != undefined && siteParams.landscapeParam == 'TRUE') {
					var _this = this;
					window.onorientationchange = function() {
						switch (window.orientation) {
							case -90:
							case 90:

								_this.moduleCtrl.setValueforStorage('landscape', 'orientation');
								$("#landscape").show();
								$(".panel.list.dealspanel").hide();
								$("#ui-datepicker-div").hide();
								$(".tabs.dealstabs").hide();

								var myScroll;
								_this.onloaded(myScroll);
								var offerList = rqstParams.listofferbean;
								var filteredOfferList = _this.getFilteredListOffers();
								if (filteredOfferList != undefined) {
									for (i = 0; i < filteredOfferList.offers.length; i++) {
										$("#img_" + filteredOfferList.offers[i].offerId).html(offerList.dealDetailsMap[filteredOfferList.offers[i].offerId].offerContent);
									}
								} else {
									for (i = 0; i < offerList.offers.length; i++) {
										$("#img_" + offerList.offers[i].offerId).html(offerList.dealDetailsMap[offerList.offers[i].offerId].offerContent);
									}
								}
								if (document.getElementById('appline2') != null) {
									document.getElementById('appline2').style.display = "none";
								};
								break;
							default:

								_this.moduleCtrl.setValueforStorage('portrait', 'orientation');
								$("#portrait").show();
								$("#landscape").hide();
								$(".tabs.dealstabs").show();
								$(".panel.list.dealspanel").show();
								if (document.getElementById('appline2') != null) {
									document.getElementById('appline2').style.display = "block";
								};
								break;
						}
					};
				}
				/* Carousel view ends here */
				$('.ui-datepicker-trigger').click(function() {
					$('.deals').hide();
					$('#ui-datepicker-div').show();
					$('.banner').addClass('hideThis');
				})
				$.datepicker._gotoTodayOriginal = $.datepicker._gotoToday;
				$.datepicker._gotoToday = function() {
					$(".ui-datepicker-current").click(function() {
						$('.deals').show();
						$('.banner').removeClass('hideThis');;
						$('#ui-datepicker-div').hide();
					});
				};


			} catch (exception) {

			}

			// Ajax call for DealsListViewCounter

				var params = 'result=json';
				var request = {
					parameters: params,
					action: 'DealsListViewCounter.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.counterCallback,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},


		//Fix for PTR 09407121
		/**
		 * dummy function to handle callback
		 */
		counterCallback: function(response, inputParams) {
			// nothing required as of now
		},


		$viewReady: function() {
			$('body').attr('id', 'bdeal');
			cc = 1;

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			if (bp[14] != null && bp[14].toLowerCase() == 'iphone') {
				/*HARD CODING CALLBACK URL TYPE to "sqmobile". Need to remove once data is present in JSON. this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback,"://?flow=booking/pageload="+aria.utils.HashManager.getHashString());*/
				this.__merciFunc.appCallBack("sqmobile", "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"Deals",
						data:this.data
					});
			}
			
		},
		/* Carousel view starts here */
		doOnOrientationChange: function() {
			switch (window.orientation) {
				case -90:
				case 90:

					return "landscape";
					break;
				default:

					return "portrait";
					break;
			}
		},
		showDetailOffer: function(a, b) {
			if ($("#" + b.imgOffer).closest('li[role="option"]').attr('class') == "active") {
				$("#" + b.imgOffer).hide();
				$("#" + b.detailDiv).show();
			}
		},
		showOfferPic: function(a, b) {
			if ($("#" + b.imgOffer).closest('li[role="option"]').attr('class') == "active") {
				$("#" + b.imgOffer).show();
				$("#" + b.detailDiv).hide();
			}
		},
		removeStorageValue: function(a, b) {

			this.__merciFunc.storeLocal("SEARCH_MAP_CLICKED", '', "overwrite", "text");

			return 1;
		},
		clickBook: function(a, offerId) {
			var offerId = offerId.id;
			var country = document.getElementById("countryBox").value;
			this.__merciFunc.storeLocal("SEARCH_MAP_CLICKED", 'Y', "overwrite", "text");
			if (this.__merciFunc.getStoredItem("SELECTED_COUNTRY") == null || this.__merciFunc.getStoredItem("SELECTED_COUNTRY") == 'undefined') {
				this.__merciFunc.storeLocal("SELECTED_COUNTRY", country, "overwrite", "text");
				selectedCountry = country;
			} else {
				selectedCountry = this.__merciFunc.getStoredItem("SELECTED_COUNTRY");
			}
			this.moduleCtrl.setValueforStorage(selectedCountry, 'SELECTED_COUNTRY_APPS');
			this.moduleCtrl.setValueforStorage(offerId, 'SELECTED_OFFER_ID');
			this.moduleCtrl.setValueforStorage('DEALS-FLOW', 'FLOW');
			this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
		},
		chgOrientationL: function() {

			this.moduleCtrl.setValueforStorage('landscape', 'orientation');
			$("#landscape").show();
			$(".panel.list.dealspanel").hide();
			$(".tabs.dealstabs").hide();
			var myScroll;
			this.onloaded(myScroll);
			var offerList = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			var filteredOfferList = this.getFilteredListOffers();
			if (filteredOfferList != undefined) {
				for (i = 0; i < filteredOfferList.offers.length; i++) {
					$("#img_" + filteredOfferList.offers[i].offerId).html(offerList.dealDetailsMap[filteredOfferList.offers[i].offerId].offerContent);
				}
			} else {
				for (i = 0; i < offerList.offers.length; i++) {
					$("#img_" + offerList.offers[i].offerId).html(offerList.dealDetailsMap[offerList.offers[i].offerId].offerContent);
				}
			}

		},
		chgOrientationP: function() {
			this.moduleCtrl.setValueforStorage('portrait', 'orientation');
			$("#portrait").show();
			$("#landscape").hide();
			$(".panel.list.dealspanel").show();
			$(".tabs.dealstabs").show();

		},
		onloaded: function(myScroll) {
			myScroll = new iScroll('wrapperDeals', {
				snap: 'li',
				momentum: false,
				vScroll: true,
				hScroll: true,
				hScrollbar: false,
				onScrollEnd: function() {
					document.querySelector('#listbox > li.active').className = '';
					document.querySelector('#listbox > li:nth-child(' + (this.currPageX + 1) + ')').className = 'active';

				}
			});
		},
		/* Carousel view ends here */
		onSelectFilter: function(a, b) {
			if (b.ID == 'priceLi') {
				document.getElementById("priceRange").style.display = 'block';
				document.getElementById("destination").style.display = 'none';
				document.getElementById("travelPeriod").style.display = 'none';
				document.getElementById("destinationLi").setAttribute('aria-expanded', 'false');
				document.getElementById("travelPeriodLi").setAttribute('aria-expanded', 'false');
			} else if (b.ID == 'destinationLi') {
				document.getElementById("destination").style.display = 'block';
				document.getElementById("priceRange").style.display = 'none';
				document.getElementById("travelPeriod").style.display = 'none';
				document.getElementById("priceLi").setAttribute('aria-expanded', 'false');
				document.getElementById("travelPeriodLi").setAttribute('aria-expanded', 'false');
			} else {
				document.getElementById("travelPeriod").style.display = 'block';
				document.getElementById("priceRange").style.display = 'none';
				document.getElementById("destination").style.display = 'none';
				document.getElementById("priceLi").setAttribute('aria-expanded', 'false');
				document.getElementById("destinationLi").setAttribute('aria-expanded', 'false');
			}
			document.getElementById(b.ID).setAttribute('aria-expanded', 'true');
		},



		onChangeCountry: function() {
			this.__merciFunc.storeLocal("SELECTED_COUNTRY", $("#countryBox").val(), "overwrite", "text");
			var countryDeal = {
				"SELECTED_COUNTRY": $("#countryBox").val()
			};
			this.moduleCtrl.setValueforStorage($("#countryBox").val(), 'SELECTED_COUNTRY');
			this.__merciFunc.storeLocal("MISC_IDENTIFIER", 'SP', "overwrite", "text");
			this.__merciFunc.storeLocal("COUNTRY_CHANGE_INDEX", 'Y', "overwrite", "text");
			this.moduleCtrl.setValueforStorage(false, 'filterCriteria');
			callBackForAppsCountryName = true;
			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
			this.$dataReady(countryDeal);
		},
		createSlider: function(minPrice, maxPrice) {
			var self = this;
			var curr = "";
			if (this.moduleCtrl.getValuefromStorage('FILTER_CURRENCY') != undefined) {
				curr = this.moduleCtrl.getValuefromStorage('FILTER_CURRENCY');
			}
			$("#SliderSingle").val(maxPrice);
			$("#SliderSingle").slider({
				from: minPrice,
				to: maxPrice,
				step: 1,
				round: 1,
				dimension: '&nbsp;' + curr,
				skin: "round",
				callback: function(value) {
					self.onSliderFilter(value);
				}
			});
			var numberText = $(".jslider-label span:first").text();
			if (numberText.indexOf(curr) == -1) {
				$(".jslider-label span:first").text(numberText + " " + curr);
			}
		},
		onClickOffer: function(evt, offerId) {
			$("#offerId").val(offerId);
			document.searchForm.submit();
		},
		onSrcChange: function(a, itineraryChange) {
			var sourceCity = $("#sourceFilter").val();
			$("#srcCity").html($('#sourceFilter option:selected').text());
			$("#srcCity").attr("aptCode", sourceCity);
			$(".routeSrc").show();
			var index = 'fromSourceFilter';
			this.onSrcFilter(itineraryChange, '', index);
		},
		/*Changed as part of CR 6196532*/
		onDestChange: function(a, itineraryChange) {
			//aria.utils.DomOverlay.create(document.body);
			var destCity = $("#destFilter").val();
			var selDestCity = $('#destFilter option:selected').text();
			selDestCity = selDestCity.replace(/-/g, '');
			$("#destCity").html(selDestCity);
			$("#destCity").attr("aptCode", destCity);
			$(".routeDest").show();
			var criteria = {
				"FILTER_NAME": destCity
			};
			_this = this;
			//var airportListAction = document.getElementById("airportListAction").value;
			var params = "FILTER_NAME=" + destCity + "&result=json";
			var request = {
				parameters: params,
				action: 'GetAirportListAction.action',
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.actionCallResponseFunc,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

		},
		actionCallResponseFunc: function(response, inputParams) {
			//aria.utils.DomOverlay.detachFrom(document.body);
			//var res = JSON.parse(response.responseText)
			var airportList = response.responseJSON.data.model.airportList.airportList;
			this.moduleCtrl.setValueforStorage(airportList, 'AIRPORT_LIST');
			this.onSrcDestFilter('', '', airportList);
		},

		onSrcFilter: function(itineraryChange, airportList, index) {
			var filterofferList = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			var isPriceFilt = $(".price2").is(":hidden");
			if (!isPriceFilt) {
				var filtPrice = $("#sliderPrice").html();
			}
			var isTravelFilt = $(".period").is(":hidden");
			var isDestRouteFilt = $(".routeDest").is(":hidden");
			var filterofferListTemp = new Array();
			var filterofferListTemp2 = {
				"filteredlistofferbean": {
					"offers": {}
				}
			};
			var sourceCity = $("#sourceFilter").val();
			var airportList = this.moduleCtrl.getValuefromStorage('AIRPORT_LIST');
			if (airportList == undefined || airportList == '' || isDestRouteFilt) {
				airportList = [0];
			}
			for (count = 0; count < airportList.length; count++) {
				var destCity = airportList[count]; /*Changed as part of CR 6196532*/
				if (airportList[count] == '0') {
					destCity = 'ALL';
				}
				if (filterofferList.offers.length == 0) {
					return;
				} else {
					for (var i in filterofferList.offers) {
						if (!isNaN(parseInt(i))) {
							if (isPriceFilt && isTravelFilt) {
								var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
								if (isRoValid) {
									filterofferListTemp.push(filterofferList.offers[i]);
								}
							} else {
								/* Add both the Price and Travel filter */
								if (!isPriceFilt && !isTravelFilt) {
									if (filterofferList.offers[i].price <= filtPrice) {
										var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
											var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
											var rangeChk = this.checkTravelRange(stDate, endDate);
											if (rangeChk) {
												filterofferListTemp.push(filterofferList.offers[i]);
											}
										}
									}
								} else if (!isPriceFilt) {
									if (filterofferList.offers[i].price <= filtPrice) {
										var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								} else if (!isTravelFilt) {
									var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
									if (isRoValid) {
										var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
										var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
										var rangeChk = this.checkTravelRange(stDate, endDate);
										if (rangeChk) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								}
							}
						}
					}
					filterofferListTemp2.filteredlistofferbean.offers = filterofferListTemp;
				}
			}
			this.setFilteredListOffers(filterofferListTemp2);
			this.moduleCtrl.setValueforStorage(true, 'filterCriteria');
			this.$refresh({
				section: "do2content"
			});
			this.$refresh({
				section: "carouselContent"
			});
			callBackForAppsCountryName = false;
		},
		/*Changed as part of CR 6196532*/
		onSrcDestFilter: function(itineraryChange, airportList, index) {
			var filterofferList = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			var isPriceFilt = $(".price2").is(":hidden");
			if (!isPriceFilt) {
				var filtPrice = $("#sliderPrice").html();
			}
			var isTravelFilt = $(".period").is(":hidden");
			var filterofferListTemp = new Array();
			var filterofferListTemp2 = {
				"filteredlistofferbean": {
					"offers": {}
				}
			};
			var sourceCity = $("#sourceFilter").val();
			var airportList = this.moduleCtrl.getValuefromStorage('AIRPORT_LIST');
			if (index == 'fromRemoveDestFilter') {
				airportList = [0];
			}
			for (count = 0; count < airportList.length; count++) {
				var destCity = airportList[count]; /*Changed as part of CR 6196532*/
				if (index == 'fromRemoveDestFilter' || airportList == undefined) {
					destCity = 'ALL';
				}
				if (filterofferList.offers.length == 0) {
					return;
				} else {
					for (var i in filterofferList.offers) {
						if (!isNaN(parseInt(i))) {
							if (isPriceFilt && isTravelFilt) {
								var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
								if (isRoValid) {
									filterofferListTemp.push(filterofferList.offers[i]);
								}
							} else {
								/* Add both the Price and Travel filter */
								if (!isPriceFilt && !isTravelFilt) {
									if (filterofferList.offers[i].price <= filtPrice) {
										var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
											var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
											var rangeChk = this.checkTravelRange(stDate, endDate);
											if (rangeChk) {
												filterofferListTemp.push(filterofferList.offers[i]);
											}
										}
									}
								} else if (!isPriceFilt) {
									if (filterofferList.offers[i].price <= filtPrice) {
										var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								} else if (!isTravelFilt) {
									var isRoValid = this.isrouteValid(sourceCity, destCity, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
									if (isRoValid) {
										var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
										var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
										var rangeChk = this.checkTravelRange(stDate, endDate);
										if (rangeChk) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								}
							}
						}
					}
					filterofferListTemp2.filteredlistofferbean.offers = filterofferListTemp;
				}
			}
			this.setFilteredListOffers(filterofferListTemp2);
			this.moduleCtrl.setValueforStorage(true, 'filterCriteria');
			this.$refresh({
				section: "do2content"
			});
			this.$refresh({
				section: "carouselContent"
			});

			callBackForAppsCountryName = false;
		},
		removeSrcFilter: function() {
			$('#sourceFilter').val('ALL');

			$('.routeSrc').hide();
			this.onSrcFilter();
		},
		removeDestFilter: function() {
			$("#destFilter").val('ALL');
			$('.routeDest').hide();
			var index = 'fromRemoveDestFilter';
			this.onSrcDestFilter('', '', index);
		},
		onSliderFilter: function(filterPrice) {
			$("#sliderPrice").html(filterPrice);
			$(".price2").show();
			this.createFilterofferList(filterPrice);

		},
		createFilterofferList: function(sliderFilterPrice) {
			var filterofferList = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			var filterofferListTemp = new Array();
			var filterofferListTemp2 = {
				"filteredlistofferbean": {
					"offers": {}
				}
			};
			var isSrcRouteFilt = $(".routeSrc").is(":hidden");
			var isDestRouteFilt = $(".routeDest").is(":hidden");
			if (!isSrcRouteFilt) {
				var srcCityCode = $("#srcCity").attr("aptCode");
			}
			/*Changed as part of CR 6196532*/
			if (!isDestRouteFilt) {
				var srcCityCode = $("#sourceFilter").val();
			}
			/*Changed as part of CR 6196532*/
			var isTravelFilt = $(".period").is(":hidden");
			var airportList = this.moduleCtrl.getValuefromStorage('AIRPORT_LIST')
			if (airportList == undefined || airportList == '' || isDestRouteFilt) {
				airportList = [0];
			}
			for (count = 0; count < airportList.length; count++) {
				destCityCode = airportList[count];
				if (airportList[count] == '0') {
					destCityCode = 'ALL';
				}
				if (filterofferList.offers.length == 0) {
					return;
				} else {

					for (var i in filterofferList.offers) {
						if (!isNaN(parseInt(i))) {
							if (filterofferList.offers[i].price <= sliderFilterPrice) {
								if ((isSrcRouteFilt && isDestRouteFilt) && isTravelFilt) {
									filterofferListTemp.push(filterofferList.offers[i]);
								} else {
									if ((!isSrcRouteFilt || !isDestRouteFilt) && !isTravelFilt) { /* Add both the Route and Travel filter */
										var isRoValid = this.isrouteValid(srcCityCode, destCityCode, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
											var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
											var rangeChk = this.checkTravelRange(stDate, endDate);
											if (rangeChk) {
												filterofferListTemp.push(filterofferList.offers[i]);
											}
										}
									} else if (!isSrcRouteFilt || !isDestRouteFilt) {
										var isRoValid = this.isrouteValid(srcCityCode, destCityCode, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
										if (isRoValid) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									} else if (!isTravelFilt) {
										var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
										var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
										var rangeChk = this.checkTravelRange(stDate, endDate);
										if (rangeChk) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								}
							}
						}
					}
					filterofferListTemp2.filteredlistofferbean.offers = filterofferListTemp;

				}
			}
			this.setFilteredListOffers(filterofferListTemp2);
			this.moduleCtrl.setValueforStorage(true, 'filterCriteria');
			this.$refresh({
				section: "do2content"
			});
			this.$refresh({
				section: "carouselContent"
			});
			callBackForAppsCountryName = false;
		},
		removePriceFilter: function() {
			$('.price2').hide();
			var maxPrice = this.moduleCtrl.getValuefromStorage('maxPriceLimit');
			var minPrice = this.moduleCtrl.getValuefromStorage('minPriceLimit');
			this.createFilterofferList(maxPrice);
			if (minPrice == maxPrice) {
				$("#SliderSingle").slider("value", maxPrice + 1);
			} else {
				$("#SliderSingle").slider("value", maxPrice);
			}
			$(".jslider-label-to").hide();
		},
		onMapView: function() {
			if (JSONData.embeded == true) {
				var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
				var countrySite = $("#countryBox").val();
				var mapCallString = "://?flow=map/&COUNTRY_SITE=" + countrySite;
				this.__merciFunc.appCallBack(siteParams.appCallBack, mapCallString);
				/* window.location = "sqmobile://?flow=map/&COUNTRY_SITE="+countrySite;*/
			}
		},
		resetDate: function() {
			var showNewDtPicker = false;
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != undefined) {
				showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			}
			var currentD = this.moduleCtrl.getValuefromStorage('CURRENT_DATE');
			if (currentD == null && this.moduleCtrl.getModuleData().booking.MListOffers_A != undefined) {
				var currentD = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean.currentDate;
			}
			if (currentD != null) {
				var dateArray = currentD.split(" ");
				var formatDate = dateArray[1] + " " + dateArray[2] + "," + dateArray[5];
				var d = new Date(formatDate);
				if ($('#MonthF>option').length < 13) {
					this.populate_ddM_begin(d.getMonth(), d.getFullYear(), d.getDate());
					this.createDatePicker();
					var selM = $('#MonthT option:selected').attr("monIndex");
					if (selM != undefined) {
						$('#datePickDNOT').datepicker("setDate", new Date(selM.substring(2, 6), (selM.substring(0, 2) - 1), $('#DayT option:selected').val()));
					}
				}
				if (showNewDtPicker == 'TRUE') {
					var a = $('.ui-datepicker-trigger')[0];
					$(a).attr("id", "depDNOdate");
					var defaultDay1 = $.datepicker.formatDate('dd', $("#datePickDNOF").datepicker('getDate'));
					var defaultMonth1 = $.datepicker.formatDate('M', $("#datePickDNOF").datepicker('getDate'));
					var defaultYear1 = $.datepicker.formatDate('yy', $("#datePickDNOF").datepicker('getDate'));
					var defaultmonthinNo1 = $.datepicker.formatDate('mm', $("#datePickDNOF").datepicker('getDate'));
					$("#depDNOdate").html("<time>" + defaultMonth1 + " " + defaultDay1 + " , " + defaultYear1 + "</time>");
					$("#depDNOdate").attr("monindex", defaultmonthinNo1 + defaultYear1);
					$("#depDNOdate").attr("day1", defaultDay1)
					if (this.moduleCtrl.getValuefromStorage("defaultMonIndex1") == undefined || this.moduleCtrl.getValuefromStorage("defaultDay1" == undefined)) {
						this.moduleCtrl.setValueforStorage(defaultmonthinNo1 + defaultYear1, "defaultMonIndex1");
						this.moduleCtrl.setValueforStorage(defaultDay1, "defaultDay1");
					}
					
					var b = $('.ui-datepicker-trigger')[1];
					$(b).attr("id", "retDNOdate");
					var defaultDay2 = $.datepicker.formatDate('dd', $("#datePickDNOT").datepicker('getDate'));
					var defaultMonth2 = $.datepicker.formatDate('M', $("#datePickDNOT").datepicker('getDate'));
					var defaultYear2 = $.datepicker.formatDate('yy', $("#datePickDNOT").datepicker('getDate'));
					var defaultmonthinNo2 = $.datepicker.formatDate('mm', $("#datePickDNOT").datepicker('getDate'));
					$("#retDNOdate").html("<time>" + defaultMonth2 + " " + defaultDay2 + " , " + defaultYear2 + "</time>");
					$("#retDNOdate").attr("monindex", defaultmonthinNo2 + defaultYear2);
					$("#retDNOdate").attr("day2", defaultDay2);
					if (this.moduleCtrl.getValuefromStorage("defaultMonIndex2") == undefined || this.moduleCtrl.getValuefromStorage("defaultDay2") == undefined) {
						this.moduleCtrl.setValueforStorage(defaultmonthinNo2 + defaultYear2, "defaultMonIndex2");
						this.moduleCtrl.setValueforStorage(defaultDay2, "defaultDay2");
					}
				}

			}
		},
		populate_ddM_begin: function(month, year, date) {
			var monthsArr = new Array();
			var dateJSON = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels;
			monthsArr = [dateJSON.Jan, dateJSON.Feb, dateJSON.Mar, dateJSON.Apr, dateJSON.May, dateJSON.Jun, dateJSON.Jul, dateJSON.Aug, dateJSON.Sep, dateJSON.Oct, dateJSON.Nov, dateJSON.Dec];
			var monthYr = new Array();
			var monthIndex = new Array();
			var monthtemp;
			for (var i = 0; i <= 12; i++) {
				monthtemp = month + 1;
				if (monthtemp < 10) {
					monthtemp = "0" + monthtemp;
				} else if (monthtemp > 12) {
					monthtemp = monthtemp - 12;
					if (monthtemp.toString().length == 1) {
						monthtemp = "0" + monthtemp;
					}
				}
				if (month < 12) {
					monthYr[i] = monthsArr[month] + " " + year;
					monthIndex[i] = monthtemp + "" + year;
				} else {
					monthYr[i] = monthsArr[month - 12] + " " + (year * 1 + 1);
					monthIndex[i] = monthtemp + "" + (year * 1 + 1);
				}
				month++;
			}
			for (var k = 0; k <= monthYr.length - 1; k++) {
				if (k < 10) {
					var buffer0 = '0';
				} else {
					buffer0 = '';
				}
				$('#MonthF,#MonthT').append($("<option></option>").text(monthYr[k]).attr("value", buffer0 + k).attr("monIndex", monthIndex[k]));
				buffer0 = '';
			}
			if (date.toString().length == 1) {
				date = "0" + date;
			}
			$("#DayF").val(date).attr('selected', true);
			this.onMonthChange("a", {
				monthdd: "MonthF",
				daydd: "DayF"
			});
			this.onMonthChange("a", {
				monthdd: "MonthT",
				daydd: "DayT"
			});
			$('#DayT option:eq(' + (date - 1) + ')').attr("selected", "selected");
			$('#MonthT option:last-child').attr("selected", "selected");
			this.moduleCtrl.setValueforStorage(date, 'defaultDayF');
		},
		onMonthChange: function(evt, dd) {
			/* This function is called to remove the days according to month 31,30,28 */
			var monthSel = $('#' + dd.monthdd + ' option:selected');
			var year = monthSel.text().substring(monthSel.text().length - 4, monthSel.text().length);
			if (monthSel.attr("monIndex") != undefined) {
				var month = monthSel.attr("monIndex").substr(0, 2) * 1 - 1;
			}
			var noDaysArr = [31, !(year % 4 == 0) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var dayDDOptions = $('#' + dd.daydd + '>option');
			if (dayDDOptions.length != noDaysArr[month]) {
				if (dayDDOptions.length < noDaysArr[month]) {
					for (var k = dayDDOptions.length + 1; k <= noDaysArr[month]; k++) {
						if (k < 10) {
							var buffer0 = '0';
						} else {
							buffer0 = '';
						}
						$('#' + dd.daydd).append($("<option></option>").attr("value", buffer0 + k).text(buffer0 + k));
						buffer0 = '';
					}
				} else {
					for (var k = dayDDOptions.length; k > noDaysArr[month]; k--) {
						$('#' + dd.daydd + " option[value=" + k + "]").remove();
					}
				}
			}
			$('#' + dd.datePick).datepicker("setDate", new Date(year, month, $('#' + dd.daydd + ' option:selected').val()));
			if (evt != "a") {
				this.showtravelRange();
				this.travelFilter();
			}
		},
		createDatePicker: function() {
			var _this = this;
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			var buttonImgOnly = false;
			if (showNewDtPicker != 'TRUE') {
				buttonImgOnly = true;
			}
			$('#datePickDNOF').datepicker({
				// beforeShowDay: unavailable,
				showOn: "button",
				buttonImage: "",
				buttonImageOnly: buttonImgOnly,
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: 0,
				maxDate: "+364D",
				defaultDate: +0,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				onSelect: function() {
					var day1 = $.datepicker.formatDate('dd', $("#datePickDNOF").datepicker('getDate'));
					if (showNewDtPicker != 'TRUE') {
						var month1 = $.datepicker.formatDate('mmyy', $("#datePickDNOF").datepicker('getDate'));
						$("#DayF option[value=" + day1 + "]").attr('selected', 'selected');
						$("#MonthF>option[monindex=" + month1 + "]").attr('selected', 'selected');
					} else {
						var month1 = $.datepicker.formatDate('M', $("#datePickDNOF").datepicker('getDate'));
						var year1 = $.datepicker.formatDate('yy', $("#datePickDNOF").datepicker('getDate'));
						var monthinNo = $.datepicker.formatDate('mm', $("#datePickDNOF").datepicker('getDate'));
						$("#depDNOdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
						$("#depDNOdate").attr("monindex", monthinNo + year1);
						$("#depDNOdate").attr("day1", day1);
					}
					$('.deals').show();
					$('.banner').removeClass('hideThis');;
					$('#ui-datepicker-div').hide();
					_this.showtravelRange();
					_this.travelFilter();
				},
				onClose: function() {
					$('.deals').show();
					$('.banner').removeClass('hideThis');;
					$('#ui-datepicker-div').hide();
				}
			});
			$('#datePickDNOT').datepicker({
				// beforeShowDay: unavailable,
				showOn: "button",
				buttonImage: "",
				buttonImageOnly: buttonImgOnly,
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: 0,
				maxDate: "+364D",
				defaultDate: +364,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				onSelect: function() {
					var day2 = $.datepicker.formatDate('dd', $("#datePickDNOT").datepicker('getDate'));
					if (showNewDtPicker != 'TRUE') {
						var month2 = $.datepicker.formatDate('mmyy', $("#datePickDNOT").datepicker('getDate'));
						$("#DayT option[value=" + day2 + "]").attr('selected', 'selected');
						$("#MonthT>option[monindex=" + month2 + "]").attr('selected', 'selected');
					} else {
						var month2 = $.datepicker.formatDate('M', $("#datePickDNOT").datepicker('getDate'));
						var year2 = $.datepicker.formatDate('yy', $("#datePickDNOT").datepicker('getDate'));
						var monthinNo = $.datepicker.formatDate('mm', $("#datePickDNOT").datepicker('getDate'));
						$("#retDNOdate").html("<time>" + month2 + " " + day2 + " , " + year2 + "</time>");
						$("#retDNOdate").attr("monindex", monthinNo + year2);
						$("#retDNOdate").attr("day2", day2);
					}
					$('.deals').show();
					$('.banner').removeClass('hideThis');;
					$('#ui-datepicker-div').hide();
					_this.showtravelRange();
					_this.travelFilter();
				},
				onClose: function() {
					$('.deals').show();
					$('.banner').removeClass('hideThis');;
					$('#ui-datepicker-div').hide();
				}
			});
			if ($("#retDNOdate").val() == null && $("#depDNOdate").val() == null) {
				this.__setDPDates();
			}

			var namesF = $('#datePickDNOF').datepicker("option", "monthNames");
			var namesT = $('#datePickDNOT').datepicker("option", "monthNames");
			$("#datePickDNOF").datepicker("option", "monthNamesShort", namesF);
			$("#datePickDNOT").datepicker("option", "monthNamesShort", namesT);
		},
		__setDPDates: function() {
			var todayDate = new Date();
			var month = todayDate.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var day = todayDate.getDate();
			var year = todayDate.getFullYear();

			var yearAfterDate = new Date(month + "/" + (day - 1) + "/" + (year + 1))

			$("#datePickDNOF").datepicker('setDate', todayDate);
			$("#datePickDNOT").datepicker('setDate', yearAfterDate);
		},
		showdatepicker: function() {
			$('#datePickDNOT').datepicker("show");


		},
		onDayChange: function(evt, da) {
			var monthIndex = $('#' + da.monthdd + ' option:selected').attr("monIndex");
			$('#' + da.datePick).datepicker("setDate", new Date(monthIndex.substring(2, 6), (monthIndex.substring(0, 2) - 1), $('#' + da.daydd + ' option:selected').val()));
			this.showtravelRange();
			this.travelFilter();
		},
		travelFilter: function() {
			var filterofferList = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			var filterofferListTemp = new Array();
			var filterofferListTemp2 = {
				"filteredlistofferbean": {
					"offers": {}
				}
			};
			var isPriceFilt = $(".price2").is(":hidden");
			if (!isPriceFilt) {
				var filtPrice = $("#sliderPrice").html();
			}
			var isSrcRouteFilt = $(".routeSrc").is(":hidden");
			var isDestRouteFilt = $(".routeDest").is(":hidden"); /*Changed as part of CR 6196532*/
			if (!isSrcRouteFilt) {
				var srcCityCode = $("#srcCity").attr("aptCode");
			}
			if (!isDestRouteFilt) {
				var srcCityCode = $("#sourceFilter").val();
				//var destCityCode = $("#destCity").attr("aptCode");
			}
			var airportList = this.moduleCtrl.getValuefromStorage('AIRPORT_LIST')
			if (airportList == undefined || airportList == '' || isDestRouteFilt) {
				airportList = [0];
			}
			for (count = 0; count < airportList.length; count++) {
				destCityCode = airportList[count];
				if (airportList[count] == '0') {
					destCityCode = 'ALL';
				}
				if (filterofferList.offers.length == 0) {
					return;
				} else {
					for (var i in filterofferList.offers) {
						if (!isNaN(parseInt(i))) {
							var stDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].startDate;
							var endDate = filterofferList.dealDetailsMap[filterofferList.offers[i].offerId].endDate;
							if (isPriceFilt && (isSrcRouteFilt && isDestRouteFilt)) { /*Changed as part of CR 6196532*/

								var rangeChk = this.checkTravelRange(stDate, endDate);

								if (rangeChk) {
									filterofferListTemp.push(filterofferList.offers[i]);
								}
							} else {
								if (!isPriceFilt && (!isSrcRouteFilt || !isDestRouteFilt)) { /* Add both the Price and Route filter */ /*Changed as part of CR 6196532*/
									if (filtPrice != undefined) {
										if (filterofferList.offers[i].price <= filtPrice) {
											var isRoValid = this.isrouteValid(srcCityCode, destCityCode, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
											if (isRoValid) {


												var rangeChk = this.checkTravelRange(stDate, endDate);

												if (rangeChk) {
													filterofferListTemp.push(filterofferList.offers[i]);
												}
											}
										}
									}
								} else if (!isPriceFilt) {
									if (filtPrice != undefined) {
										if (filterofferList.offers[i].price <= filtPrice) {

											var rangeChk = this.checkTravelRange(stDate, endDate);

											if (rangeChk) {
												filterofferListTemp.push(filterofferList.offers[i]);
											}
										}
									}
								} else if (!isSrcRouteFilt || !isDestRouteFilt) { /*Changed as part of CR 6196532*/
									var isRoValid = this.isrouteValid(srcCityCode, destCityCode, filterofferList.offers[i]) /*Changed as part of CR 6196532*/
									if (isRoValid) {

										var rangeChk = this.checkTravelRange(stDate, endDate);

										if (rangeChk) {
											filterofferListTemp.push(filterofferList.offers[i]);
										}
									}
								}
							}
						}
					}
					filterofferListTemp2.filteredlistofferbean.offers = filterofferListTemp;
				}
			}
			this.setFilteredListOffers(filterofferListTemp2);
			this.moduleCtrl.setValueforStorage(true, 'filterCriteria');
			this.$refresh({
				section: "do2content"
			});
			this.$refresh({
				section: "carouselContent"
			});
			callBackForAppsCountryName = false;
			aria.utils.Json.setValue(this.data, 'error_msg', true);
		},
		checkTravelRange: function(stDate, endDate) {
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			if (showNewDtPicker == 'TRUE') {
				var monthDep = $('#depDNOdate').attr("monIndex");
				var monthRet = $('#retDNOdate').attr("monIndex");
				var dayF = $("#depDNOdate").attr("day1");
				var dayT = $("#retDNOdate").attr("day2");
			} else {
				var monthDep = $('#MonthF option:selected').attr("monIndex"); /* Dep DD YYYYMM values */
				var monthRet = $('#MonthT option:selected').attr("monIndex");
				var dayF = $("#DayF").val();
				var dayT = $("#DayT").val();
			}
			monthDep = monthDep.substring(2, 6) + "" + monthDep.substring(0, 2);
			monthRet = monthRet.substring(2, 6) + "" + monthRet.substring(0, 2); /* Ret DD YYYYMM values */
			var travelRCorrect = true;
			this.data.errors = new Array();
			if (monthRet - monthDep < 0) {
				travelRCorrect = false;
				this.showDepRetTypeError();
			} else if (monthRet - monthDep == 0) {
				if (dayT < dayF) {
					travelRCorrect = false;
					this.showDepRetTypeError();
				}
			}
			if (travelRCorrect) {
				var inRang = 0;
				var stDateTemp = stDate.substring(0, 2) + " " + stDate.substring(2, stDate.length - 4) + " " + stDate.substring(stDate.length - 4, stDate.length);
				var retDateTemp = endDate.substring(0, 2) + " " + endDate.substring(2, endDate.length - 4) + " " + endDate.substring(endDate.length - 4, endDate.length);
				var srcRange = this.getMonthYr(stDateTemp);
				var depRange = this.getMonthYr(retDateTemp);
				if ((monthRet - srcRange) >= 0) {
					if (monthRet - srcRange != 0) {
						inRang = 1;
					} else if ((monthRet - srcRange) == 0) {
						var dayEndStr = stDate.substring(0, 2);
						if (dayT >= dayEndStr) {
							inRang = 1;
						}
					}
				}
				if ((inRang == 1) && (depRange - monthDep) >= 0) {
					if (depRange - monthDep != 0) {
						return true;
					} else if ((depRange - monthDep) == 0) {
						var dayEndStr2 = endDate.substring(0, 2);
						if (dayEndStr2 >= dayF) {
							return true;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		},
		showtravelRange: function() {
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			var trvlP = "";
			if (showNewDtPicker == 'TRUE') {
				trvlP = $("#depDNOdate time").text() + " to " + $("#retDNOdate time").text()
			} else {
				trvlP = $("#DayF").val() + " " + $("#MonthF option:selected").html() + " to " + $("#DayT").val() + " " + $("#MonthT option:selected").html();
			}
			$("#travelPrd").html(trvlP);
			$(".period").show();
		},
		removetravelFilter: function() {

			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.showNewDatePicker;
			$(".period").hide();
			if (showNewDtPicker == 'TRUE') {
				$("#depDNOdate").attr("monindex", this.moduleCtrl.getValuefromStorage("defaultMonIndex1"));
				$("#depDNOdate").attr("day1", this.moduleCtrl.getValuefromStorage("defaultDay1"));
				$("#retDNOdate").attr("monindex", this.moduleCtrl.getValuefromStorage("defaultMonIndex2"));
				$("#retDNOdate").attr("day2", this.moduleCtrl.getValuefromStorage("defaultDay2"));
				this.__setDPDates();
			} else {
				var defaultDay = this.moduleCtrl.getValuefromStorage('defaultDayF');
				$('#DayF option:eq(' + (defaultDay - 1) + ')').attr("selected", "selected");
				$('#DayT option:eq(' + (defaultDay - 1) + ')').attr("selected", "selected");
				$('#MonthF option:first-child').attr("selected", "selected");
				$('#MonthT option:last-child').attr("selected", "selected");
				var selFM = $('#MonthF option:selected').attr("monIndex");
				var selTM = $('#MonthT option:selected').attr("monIndex");
				$('#datePickDNOF').datepicker("setDate", new Date(selFM.substring(2, 6), (selFM.substring(0, 2) - 1), (defaultDay - 1)));
				$('#datePickDNOT').datepicker("setDate", new Date(selTM.substring(2, 6), (selTM.substring(0, 2) - 1), (defaultDay - 1)));
			}
			this.travelFilter();
		},
		getMonthYr: function(para) {
			stDateFmt = new Date(para);
			stDateMon = stDateFmt.getMonth();
			stDateMon = (stDateMon + 1).toString();
			if (stDateMon.length == "1") {
				stDateMon = "0" + stDateMon;
			} else {
				stDateMon = stDateMon;
			}
			stDateYear = stDateFmt.getFullYear();
			stDateMY = stDateYear + stDateMon;
			return stDateMY;
		},
		showDepRetTypeError: function() {
			var error = {
				'TEXT': this.moduleCtrl.getModuleData().booking.MListOffers_A.labels.RetDateBefore
			};
			this.data.errors.push(error);
			//aria.utils.Json.setValue(this.data, 'error_msg', true);
		},
		isrouteValid: function(srcCityCodeP, destCityCodeP, offerJson) {
			if (srcCityCodeP == "ALL" && destCityCodeP == "ALL") { /*Changed as part of CR 6196532*/
				return true;
			} else if (srcCityCodeP != "ALL" && destCityCodeP == "ALL") { /*Changed as part of CR 6196532*/
				if (offerJson.originLocationCode == srcCityCodeP) {
					return true;
				}
			} else if (srcCityCodeP == "ALL" && destCityCodeP != "ALL") { /*Changed as part of CR 6196532*/
				if (offerJson.destinationLocationCode == destCityCodeP) {
					return true;
				}
			} else if (srcCityCodeP != "ALL" && destCityCodeP != "ALL") {
				if (offerJson.originLocationCode == srcCityCodeP && offerJson.destinationLocationCode == destCityCodeP) {
					return true;
				}
			} else { /*Changed as part of CR 6196532*/
				return false;
			}
		},
		$afterRefresh: function() {
			$("#overlay").hide();
			this.imagesPreLoader(this);
			if (this.moduleCtrl.getValuefromStorage('client') != null && this.moduleCtrl.getValuefromStorage('client') == true) {
				this.moduleCtrl.setValueforStorage($("#countryBox").val(), 'SELECTED_COUNTRY');
				if (callBackForAppsCountryName) {
					var country = this.moduleCtrl.getValuefromStorage('SELECTED_COUNTRY');
					var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
					var countryCallStr = "://?flow=faredeals/COUNTRY_SITE=" + country;
					this.__merciFunc.appCallBack(siteParams.appCallBack, countryCallStr);
					/* window.location = $("#appCallBack").val()+"://?flow=faredeals/COUNTRY_SITE="+country;*/
				}
			}
		},
		imagesPreLoader: function(_this) {
			// create object
			imageObj = new Image();
			// set image list
			images = new Array();
			if (_this.moduleCtrl.getModuleData().booking != undefined && _this.moduleCtrl.getModuleData().booking.MListOffers_A != undefined) {
				var offerList = _this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
				if (offerList != undefined) {
					for (i = 0; i < offerList.offers.length; i++) {
						//$("#img_"+offerList.offers[i].offerId).html("<img src='http://172.22.200.27/images/img_"+offerList.offers[i].offerId+".jpg'/>");
						//$("#img_"+offerList.offers[i].offerId).html(offerList.dealDetailsMap[offerList.offers[i].offerId].offerContent);
						var xx = offerList.dealDetailsMap[offerList.offers[i].offerId].offerContent;
						if (xx != undefined) {
							images[i] = $(xx).attr("src");
						} else {
							images[i] = "no-image";
						}
					}
				}
				// start preloading
				for (j = 0; j < offerList.offers.length; j++) {
					if (images[j] != 'no-image') {
						imageObj.src = images[j];
					}
				}
			}
		},
		onMapDisplayClick: function() {
			var country = document.getElementById("countryBox").value;
			this.__merciFunc.storeLocal("countrySite", country, "overwrite", "text");

			/* PTR 08043645: Map view refresh - START */
			var args = {};
			args = {
				IS_USER_LOGGED_IN: this.rqstParams.IS_USER_LOGGED_IN
			};
			/* PTR 08043645: Map view refresh - END */

			this.moduleCtrl.navigate(args, 'merci-book-MDealsMap_A');
		},
		setFilteredListOffers: function(datalist) {
			this.data.filteredlistofferbean = datalist;
		},
		getFilteredListOffers: function() {
			return this.data.filteredlistofferbean.filteredlistofferbean;
		},
		toggleFilter: function(wrapper, args) {
			modules.view.merci.common.utils.MCommonScript.toggleExpand(wrapper, args);
		},
		getBookmarkData: function() {

			var result=this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			//this.__merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {

				if (result && result != "") {
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					}else{
						jsonObj = (result);
					}
					pageDeals.dealsData=jsonObj;
				}
				pageDeals.printUI = true;
			//});

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
		}
	}
});