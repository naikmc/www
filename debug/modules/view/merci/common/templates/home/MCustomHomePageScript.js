Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.home.MCustomHomePageScript",
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.MDWMContentUtil',
		'aria.utils.HashManager'
	],
	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.urlMgr = modules.view.merci.common.utils.URLManager;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.dwm = modules.view.merci.common.utils.MDWMContentUtil;		
		pageObjCustom=this;		
	},

	$prototype: {

		$displayReady: function() {
		},

		$dataReady: function() {
			try {
				var _this = this;
				if (!jsonResponse.ui.fromStorage) {
				this.config = this.moduleCtrl.getModuleData().booking.Mindex_A.siteParam;
				this.labels = this.moduleCtrl.getModuleData().booking.Mindex_A.labels;
				this.requestParam = this.moduleCtrl.getModuleData().booking.Mindex_A.requestParam;
				this.globalList = this.moduleCtrl.getModuleData().booking.Mindex_A.globalList;
				this.model = this.moduleCtrl.getModuleData().booking.Mindex_A;
					this.indexDataCreation();
				} else {
					this.config = jsonResponse.data.booking.Mindex_A.siteParam;
					this.labels = jsonResponse.data.booking.Mindex_A.labels;
					this.requestParam = jsonResponse.data.booking.Mindex_A.requestParam;
					this.globalList = jsonResponse.data.booking.Mindex_A.globalList;
					this.model = this.moduleCtrl.getModuleData().booking.Mindex_A;
				}
				this.reply = this.model.reply;
				var base = this.urlMgr.getBaseParams();
				//SetFooterInfo Footer created
				if (!this.data.fromMenu) {
					if (this.utils.isRequestFromApps() == true && this.utils.booleanValue(this.config.setAllowFooter) == true) {
						this.setFooter();
						this.getTripCount();
					};	
					this.__ga.trackPage({
						domain: this.config.siteGADomain,
						account: this.config.siteGAAccount,
						gaEnabled: this.config.siteGAEnable,
						page: 'Home?wt_market=' + ((base[13] != null) ? base[13] : '') +
							'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11],
						GTMPage: 'Home?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11]
					});			
					if (this.utils.isRequestFromApps() || ((typeof customerAppData !="undefined") && customerAppData.isWebEnvironment && customerAppData.isTestEnvironment)) {
						var force_upgrade_msg = merciAppData.FORCE_UPGRADE_MSG;
						if(typeof customerAppData !="undefined" && customerAppData.isCustomAirportList){
						}
					}
				};		
			} catch (_ex) {
				this.$logError('MCustomHomePageScript: an error has occured in dataReady function');
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
			if (!this.data.fromMenu && this.utils.isRequestFromApps()) {
				var force_upgrade_msg = merciAppData.FORCE_UPGRADE_MSG;
				var ignoreUpgradeAlert = this.utils.booleanValue(this.utils.getStoredItem("ignoreUpgradeAlert"));
				this.checkForAppUpgrade(this.labels.tx_merciapps_upgrade_prompt, this.config.siteIOSStoreLink,
										this.config.siteAndroidStoreLink, this.config.siteiOSVersion, this.config.siteAndroidVersion, 
										ignoreUpgradeAlert, this.config.forceUpgradeiPhone, this.config.forceUpgradeAndroid, 
					force_upgrade_msg /* Commenting due to unavailability of string this.labels.tx_merciapps_force_upgrade . Using string from merciAppData . Do note that tpl requires change*/ );
			};
		},
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
									pageObjCustom.toggleForceUpgradeAlert("show");
								} else {
									console.log("iOS Auto App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									pageObjCustom.toggleAutoUpgradeAlert("show");
								}
							} else {
								console.log("App Upgrade alert not required");
							}
						} else if (devicePlatform == "Android") {
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - Android:" + param_AndroidVersion);
								if (typeof param_forceUpgradeAndroid != "undefined" && utils.booleanValue(param_forceUpgradeAndroid)) {
									console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjCustom.toggleForceUpgradeAlert("show");
								} else {
									console.log("Android Auto Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjCustom.toggleAutoUpgradeAlert("show");
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
								pageObjCustom.toggleForceUpgradeAlert("show");
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
								pageObjCustom.toggleForceUpgradeAlert("show");
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
		indexDataCreation: function() {
			if (this.utils.isRequestFromApps() == true) {
				jsonResponse.ui.fromStorage = true;
				var jsonResponseCopy = {}
				jsonResponseCopy.data = aria.utils.Json.copy(jsonResponse.data);
				jsonResponseCopy.homePageId = aria.utils.Json.copy(jsonResponse.homePageId);
				this.utils.storeLocalInDevice(merciAppData.DB_HOME, JSON.stringify(jsonResponseCopy), "overwrite", "text");
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
						/* pageObjCustom.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else if (devicePlatform == 'Android' && this.config.siteAndroidStoreLink && this.config.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(this.config.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjCustom.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else {
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjCustom.toggleForceUpgradeAlert("show"); */
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
			pageObjCustom = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
				if (result && result != "") {
					var jsonObj = {};
					var count = 0;
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};

					if (!pageObjCustom.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.detailArray).length;
					};
					pageObjCustom.$json.setValue(jsonResponse.ui, "cntTrip", count);
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

					if (!pageObjCustom.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.boardingPassArray).length;
					};
					pageObjCustom.$json.setValue(jsonResponse.ui, "cntBoardingPass", count);
				}				
			});
		}
	}
});