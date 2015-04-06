Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MPageFooterScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],
	$constructor: function() {
		pageObjFooter = this;
	},

	$prototype: {

		$dataReady: function() {
			// set reference
			pageObjFooter.footerData = pageObjFooter.moduleCtrl.setFooterInfo();
			pageObjFooter.utils = modules.view.merci.common.utils.MCommonScript;
			pageObjFooter.urlManager = modules.view.merci.common.utils.URLManager;
			pageObjFooter.footerBadge = jsonResponse.ui;
		},

		$viewReady: function() {

			if ((pageObjFooter.utils.isRequestFromApps() == true) && (pageObjFooter.footerData != undefined) && (pageObjFooter.footerData.setAllowFooter != undefined) && (pageObjFooter.utils.booleanValue(pageObjFooter.footerData.setAllowFooter) == true)) {
				var listContainer = document.getElementById("appline2");
				pageObjFooter.button = document.getElementsByClassName("footerButton");
				var childCount = listContainer.getElementsByTagName('li').length;
				if (pageObjFooter.button.length > 0) {
					switch (childCount) {
						case 1:
							pageObjFooter.setClass(1, "widthA");
							break;
						case 2:
							pageObjFooter.setClass(2, "widthB");
							break;
						case 3:
							pageObjFooter.setClass(3, "widthC");
							break;
						case 4:
							pageObjFooter.setClass(4, "widthD");
							break;
						case 5:
							pageObjFooter.setClass(5, "widthE");
							break;
					};
				}

				if (jsonResponse.ui.tabValue != null) {
					document.getElementById(jsonResponse.ui.tabValue).setAttribute('class', 'hoverClass' + jsonResponse.ui.tabValue);
				}
			}
		},

		setClass: function(length, className) {
			for (var i = length - 1; i >= 0; i--) {
				pageObjFooter.button[i].setAttribute("class", className);
				if (i < 0) {
					break;
				}
			}
		},

		onHomeClick: function() {
			pageObjFooter.removeClass();
			jsonResponse.ui.tabValue = "tabHome";
			var hashPage = aria.utils.HashManager.getHashString();
			pageObjFooter.utils.showMskOverlay(true);
			var ignoreMesg = this.getMesg(hashPage);
			if (hashPage == "merci-Mindex_A" || hashPage == "merci-MDynamicHome_A" || hashPage == "merci-MCustomHome_A") {
				ignoreMesg = false;
			}
			if (ignoreMesg) {
				pageObjFooter.utils.getStoredItemFromDevice(merciAppData.DB_HOME, function(result) {
					if (result != null && result != '') {
						if (typeof result === 'string') {
							result = JSON.parse(result);
						}
						if (!pageObjFooter.utils.isEmptyObject(result)) {
							jsonResponse.ui.fromStorage = true;
							if(result.data.booking.Mindex_A.siteParam.isCustomHomeEnabled == 'TRUE'){
								pageObjFooter.moduleCtrl.navigate(null, 'merci-MCustomHome_A');
							}
							if(result.data.booking.Mindex_A.siteParam.isDynamicHomeEnabled == 'TRUE'){
								pageObjFooter.moduleCtrl.navigate(null, 'merci-MDynamicHome_A');
							}else{
								pageObjFooter.moduleCtrl.navigate(null, 'merci-Mindex_A');
							}
						} else {
							jsonResponse.ui.fromStorage = false;
							pageObjFooter.utils.sendNavigateRequest(null, 'MWelcome.action', pageObjFooter);
						}
					} else {
						jsonResponse.ui.fromStorage = false;
						pageObjFooter.utils.sendNavigateRequest(null, 'MWelcome.action', pageObjFooter);
					}
				});
			} else {
				pageObjFooter.utils.hideMskOverlay(true);
			}
		},

		onMyTripClick: function() {
			pageObjFooter.removeClass();
			jsonResponse.ui.tabValue = "tabMyTrip";
			var hashPage = aria.utils.HashManager.getHashString();
			pageObjFooter.utils.showMskOverlay(true);
			var ignoreMesg = this.getMesg(hashPage);
			if (hashPage == "merci-MPNRTRIPS_A" && jsonResponse.ui.cntTrip < 1) {
				ignoreMesg = false;
			}
			if (hashPage == "merci-MTRIPS_A") {
				ignoreMesg = false;
			}
			if (ignoreMesg) {
				if (pageObjFooter.footerData != undefined && pageObjFooter.utils.booleanValue(pageObjFooter.footerData.allowCustomRetrieve)) {
					var url = pageObjFooter.data.config.customRetrieveURL;
					document.location.href = url;
				} else {
					if (pageObjFooter.utils.isRequestFromApps() == true) {
						pageObjFooter.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
							if (result != null && result != '') {
								if (typeof result === 'string') {
									result = JSON.parse(result);
								}
								if (!pageObjFooter.utils.isEmptyObject(result)) {
									var json = pageObjFooter.moduleCtrl.getModuleData();
									json.result = result;
									if (!pageObjFooter.utils.isEmptyObject(json.result.detailArray)) {
										/* Navigation will be changed by site parameter*/
										json.navigation = true;
										pageObjFooter.moduleCtrl.navigate(null, 'merci-MTRIPS_A');
									} else {
										pageObjFooter.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', pageObjFooter);
									}
								} else {
									pageObjFooter.getTripData();
								}
							} else {
								pageObjFooter.getTripData();
							}
						});
					} else {
						pageObjFooter.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', pageObjFooter);
					};
				}
			} else {
				pageObjFooter.utils.hideMskOverlay(true);
			}
		},

		getTripData: function() {
			pageObjFooter.utils.getStoredItemFromDevice(merciAppData.DB_GETTRIP, function(getTripObj) {
				if (getTripObj != null && getTripObj != '') {
					if (typeof getTripObj === 'string') {
						getTripObj = JSON.parse(getTripObj);
					}
					if (!pageObjFooter.utils.isEmptyObject(getTripObj)) {
						pageObjFooter.moduleCtrl.navigate(null, 'merci-MPNRTRIPS_A');
					} else {
						pageObjFooter.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', pageObjFooter);
					}
				} else {
					pageObjFooter.utils.sendNavigateRequest(null, 'MMyTripChkCookie.action', pageObjFooter);
				}
			});
		},

		onMyFavClick: function() {
			pageObjFooter.removeClass();
			jsonResponse.ui.tabValue = "tabFavourite";
			pageObjFooter.removeClass();
			jsonResponse.ui.tabValue = "tabFavourite";
			var hashPage = aria.utils.HashManager.getHashString();
			pageObjFooter.utils.showMskOverlay(true);
			var ignoreMesg = this.getMesg(hashPage);
			if (hashPage == "merci-MFAVOURITE_A") {
				ignoreMesg = false;
			}
			if (ignoreMesg) {
				pageObjFooter.utils.showMskOverlay(true);
				pageObjFooter.moduleCtrl.navigate(null, 'merci-MFAVOURITE_A');
			} else {
				pageObjFooter.utils.hideMskOverlay(true);
			}
		},

		onBoardingpassClick: function() {
			pageObjFooter.removeClass();
			var hashPage = aria.utils.HashManager.getHashString();
			pageObjFooter.utils.showMskOverlay(true);
			var ignoreMesg = this.getMesg(hashPage);

			if (hashPage == "merci-checkin-MSSCICheckinIndex_A" && (jsonResponse.ui.cntBoardingPass == undefined || jsonResponse.ui.cntBoardingPass < 1)) {
				ignoreMesg = false;
			}
			if (hashPage == "merci-checkin-MSSCILocalBoardingPassList_A") {
				ignoreMesg = false;
			}
			if (ignoreMesg) {
				pageObjFooter.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
					if (result != null && result != '') {
						if (typeof result === 'string') {
							result = JSON.parse(result);
						}
						if (!pageObjFooter.utils.isEmptyObject(result)) {
							var json = pageObjFooter.moduleCtrl.getModuleData();
							json.result = result;
							if (!pageObjFooter.utils.isEmptyObject(json.result.boardingPassArray)) {
								/* Navigation will be changed by site parameter*/
								json.navigation = true;
								pageObjFooter.moduleCtrl.navigate(null, 'merci-checkin-MSSCILocalBoardingPassList_A');
							} else {
								pageObjFooter.utils.sendNavigateRequest(null, 'gettripFlow.action', pageObjFooter);
							}
						} else {
							pageObjFooter.utils.sendNavigateRequest(null, 'gettripFlow.action', pageObjFooter);
						}
					} else {
						pageObjFooter.utils.sendNavigateRequest(null, 'gettripFlow.action', pageObjFooter);
					}
				});
			} else {
				pageObjFooter.utils.hideMskOverlay(true);
			}
		},

		onMoreClick: function() {
			pageObjFooter.removeClass();
			jsonResponse.ui.tabValue = "tabSetting";
			var hashPage = aria.utils.HashManager.getHashString();
			pageObjFooter.utils.showMskOverlay(true);
			var ignoreMesg = this.getMesg(hashPage);
			if (hashPage == ("merci-MMore_A" || "merci-MSetting_A")) {
				ignoreMesg = false;
			}

			if (ignoreMesg) {
				pageObjFooter.utils.showMskOverlay(true);
				pageObjFooter.moduleCtrl.navigate(null, 'merci-MMore_A');
			} else {
				pageObjFooter.utils.hideMskOverlay(true);
			}
		},

		getMesg: function(hashPage) {

			var hashArray = ["merci-book-MSRCH_A", "merci-book-MCAL_A", "merci-book-MCAL_ITN_A", "merci-book-MCAL_OWC_A", "merci-book-MCALOWC_Matrix_A", "merci-book-MINAOWC_A", "merci-book-MINSD_A", "merci-book-MITIA_A", "merci-book-MINA_A", "merci-book-MOUTA_A", "merci-book-MOUTAOWC_A", "merci-book-MOUTSD_A", "merci-book-MFARE_A", "merci-book-MALPI_A", "merci-book-MPURC_A", "merci-book-MPayPal_A", "merci-MseatMapv2_A", "merci-MEnhancedSeatMap"];
			for (i = 0; i <= hashArray.length; i++) {
				if (hashPage == hashArray[i]) {
					if (confirm(pageObjFooter.footerData.cancelMesg)) {
						return true;
					} else {
						return false;
					}
				}
			}
			return true;
		},

		removeClass: function() {
			if (document.getElementsByClassName('hoverClass' + jsonResponse.ui.tabValue)[0] != null) {
				var id = document.getElementsByClassName('hoverClass' + jsonResponse.ui.tabValue)[0].id;
			}
			if (id == 'tabHome') {
				document.getElementById('tabHome').setAttribute('class', 'tab-home');
			} else if (id == 'tabBoarding') {
				document.getElementById('tabBoarding').setAttribute('class', 'tab-boarding');
			} else if (id == 'tabMyTrip') {
				document.getElementById('tabMyTrip').setAttribute('class', 'tab-my-trips');
			} else if (id == 'tabFavourite') {
				document.getElementById('tabFavourite').setAttribute('class', 'tab-my-favourites');
			} else if (id == 'tabSetting') {
				document.getElementById('tabSetting').setAttribute('class', 'tab-more');
			}
		}
	}
});