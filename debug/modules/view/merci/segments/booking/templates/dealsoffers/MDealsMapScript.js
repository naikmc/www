Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.dealsoffers.MDealsMapScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.MerciGoogleMaps'
	],
	$constructor: function() {
		pageObjDeal = this;
		track = 0;
		this.map = null;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.mapUtil = modules.view.merci.common.utils.MerciGoogleMaps;
		this.listofferbean = null;
	},

	$destructor: function() {
		pageObjDeal = null;
	},

	$prototype: {

		__onFlightStatusCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {

				/*displaying Flight Status Request page*/
				this.printUI = true;
				this.$refresh({
					section: 'MDealsMapPage'
				});
			}
		},

		$dataReady: function() {
			/*if Flight Info Request page data is not available*/
			/* this.utils = modules.view.merci.common.utils.MCommonScript; */
			if (this.moduleCtrl.getModuleData() == null || this.moduleCtrl.getModuleData().booking.MListOffers_A == null) {
				var params = 'result=json';
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
				this.printUI = true;
			}
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
			
			// google analytics
			this.__ga.trackPage({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				page: 'Fare Deals Map?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: 'Fare Deals Map?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
		},

		$displayReady: function() {
			/* setting autocomplete if UI is ready to be printed
			this will be set only after callback received with data*/
			if (this.printUI == true) {

				// set details for header
				if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {

					var labels = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels;
					var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
					var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam;
					if (this.utils.booleanValue(siteParams.enableLoyalty) == true && this.utils.booleanValue(rqstParams.IS_USER_LOGGED_IN) == true) {
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

				this.initMap();
			}

			// Ajax call for DealsMapViewCounter

				var params = 'result=json';
				var request = {
					parameters: params,
					action: 'DealsMapViewCounter.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: function(){},
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);			

		},		

		$viewReady: function() {

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			if (bp[14] != null && bp[14].toLowerCase() == 'iphone') {
				/*HARD CODING CALLBACK URL TYPE to "sqmobile". Need to remove once data is present in JSON. this.utils.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback,"://?flow=booking/pageload="+aria.utils.HashManager.getHashString());*/
				this.utils.appCallBack("sqmobile", "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MDealsMap",
						data:{}
					});
			}

		},

		initMap: function() {
			var callback = new aria.utils.Callback({
				fn: this.mapCallback,
				scope: this
			});
			var defaultLocation = {
				name: null,
				lat: 1.3000,
				lngt: 103.8000
			};
			this.mapUtil.initialize(defaultLocation, callback);
		},

		mapCallback: function(map) {
			this.map = map;
			this.listofferbean = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.listofferbean;
			for (var currentOperation in this.listofferbean.dealDetailsMap) {
				//console.log(listofferbean.dealDetailsMap[currentOperation]);
				var cityName = this.listofferbean.dealDetailsMap[currentOperation].destinationCityName;
				var cityCode = this.listofferbean.dealDetailsMap[currentOperation].destinationCityCode;
				var callback = new aria.utils.Callback({
					fn: this.markMap,
					scope: this,
					args: {
						placeName: cityName,
						placeCode: cityCode
					}
				});
				this.mapUtil.geoCode(this.listofferbean.dealDetailsMap[currentOperation].destinationCityName, callback);
			}


			$('.cross2').click(function() {
				$(".dealDetails>li").each(function() {
					$(this).hide();
				});
				$("#dealContents").hide();
				hideOverlay();

			});
		},

		markMap: function(latlngt, place) {
			var marker = this.mapUtil.addMarker(latlngt);
			this.createMarker(place, latlngt, marker);
		},

		createMarker: function(place, latlngt, marker) {
			var placeCode = place.placeCode;
			var placeName = place.placeName;
			var boxText = document.createElement("div");
			boxText.className = "boxText";
			boxText.setAttribute("id", placeCode);
			boxText.style.cssText = "text-decoration: none !important; width: 200%; border: 1px solid black; margin-top: 8px; background: #EDBD10; padding: 5px; border-radius:5px;";

			var numItems = $('.' + placeCode).length;

			if (numItems != null && numItems == 1) {
				if ($("." + placeCode).find('a') != null && $("." + placeCode).find('a').find('div') != null && $("." + placeCode).find('a').find('div') != "") {
					var source = "";
					var destination = "";
					var currency = "";
					var price = "";
					var placeData = $("." + placeCode).find('a').find('div').text().trim().split(" ");
					//console.log(placeData);
					/* placeData = "SIN - LHR SGD 880.0"*/
					if (placeData) {
						if (placeData[0] != null) {
							var source = placeData[0];
						}
						if (placeData[2] != null) {
							var destination = placeData[2];
						}
						if (placeData[3] != null) {
							var currency = placeData[3];
						}
						if (placeData[4] != null) {
							var price = placeData[4];
						}
					}
					/*Convert origin code to city name*/
					if (source != null && source != "") {
						for (var currentOperation in this.listofferbean.dealDetailsMap) {
							if (this.listofferbean.dealDetailsMap[currentOperation].originCityCode == source) {
								source = this.listofferbean.dealDetailsMap[currentOperation].originCityName;
							}
						}
					}
					boxText.innerHTML = "<p onclick=''>" + source + " - " + placeName + "\n" + currency + " " + price + "</p>";
					boxText.style.textAlign = "center";
				} else {
					boxText.innerHTML = placeName;
				}
			} else {
				boxText.innerHTML = placeName + " - " + numItems + " " + "fare deals";
				boxText.style.textAlign = "center";
			}

			var myOptions = {
				content: boxText,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(10, -70),
				zIndex: 0,
				boxClass: 'boxText',
				boxStyle: {
					background: "",
					opacity: 1
				},
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: true
			};
			var infobox = this.mapUtil.addInfobox(marker, myOptions);
			/*var infowindow = new google.maps.InfoWindow({
				content: boxText
			});*/
			var callback = new aria.utils.Callback({
				fn: function(e) {
					infobox.open(this.map, marker);
					if (numItems != null && numItems == 1) {
						this.showClickSingleOffer(null, placeCode);
					} else {
						this.showClick(placeCode);
					}
				},
				scope: this
			});
			this.mapUtil.attachMarkerListener(marker, callback);
			var that = this;
			$(document).off('click touchstart',".boxText");
			$(document).on('click touchstart',".boxText", function(e) {
				if (e.currentTarget.id != null && e.currentTarget.id != '') {
					var numItems = $('.' + e.currentTarget.id).length;
					if (numItems != null && numItems == 1) {
						that.showClickSingleOffer(null, e.currentTarget.id);
					} else {
						that.showClick(e.currentTarget.id);
					}
				}
			});

		},

		showClick: function(placeCode) {
			this.utils.showMskOverlay(false);
			$("#htmlContainer").show();
			$("." + placeCode).show();
		},

		/**
		 * function called when deal list is closed
		 * @param event
		 * @param args
		 */
		onCloseClick: function(event, args) {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam;
			for (var i = 0; i < rqstParams.listofferbean.offers.length; i++) {
				$("." + rqstParams.listofferbean.offers[i].destinationLocationCode).hide();
			}

			$("#htmlContainer").hide();
			this.utils.hideMskOverlay();
		},

		showClickSingleOffer: function(event, placeCode) {
			if ($("." + placeCode).find('a') != null) {
				this.onMapOfferClick($("." + placeCode).find('a').attr('offerId'));
			}
		},

		onMapOfferClick: function(a) {

			// show overlay
			this.onCloseClick(null, null);
			this.utils.showMskOverlay(true);

			var offerId = parseInt(a);
			var country = this.utils.getStoredItem('countrySite');

			this.utils.storeLocal("OID", offerId, "overwrite", "text");
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var client = '';
			if (bp[14] != null && bp[14] != '') {
				client = '&client=' + bp[14];
			}

			params = 'SITE=' + bp[11] + '&LANGUAGE=' + bp[12] + '&offer_id=' + offerId + '&result=json&COUNTRY_SITE=' + country + client;
			actionName = 'selectedOffersApi.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				defaultParams: false,
				cb: {
					fn: this.__onMapOfferClickCallback,
					args: params,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},
		__onMapOfferClickCallback: function(response, inputParams) {
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

		onListDisplayClick: function() {
			this.moduleCtrl.navigate(null, 'merci-book-MListOffers_A');
		},

		/*The flow navigates to the Home page through this function*/
		goBack: function() {
			var homePageURL = this.moduleCtrl.getInitData().MFlightInfo_Request_A.siteParam.homeURL;
			if (homePageURL == null || homePageURL == '') {
				this.moduleCtrl.goBack();
			} else {
				document.location.href = homePageURL;
			}
		}

	}
});