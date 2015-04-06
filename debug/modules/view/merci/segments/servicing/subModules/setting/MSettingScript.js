Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.setting.MSettingScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function() {
		pageObj = this;
        pageObjSetting = this;
		var jSon = {};
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this._ajax = modules.view.merci.common.utils.URLManager;
		pageObjSetting.printUI = false;
	},
	$prototype: {

		$dataReady: function() {

			pageObjSetting.data.errors = null;
			this.lastName = jsonResponse.lastName;
			this.countryCode = modules.view.merci.common.utils.URLManager.__getCountrySite();
			this.languageCode = modules.view.merci.common.utils.URLManager.__getLanguageCode();
			pageObj.json = {};
			this.__merciFunc.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					pageObj.json.labels = result.labels;
					pageObj.json.gblLists = result.gblLists;
					pageObj.json.rqstParams = result.rqstParams;
					pageObj.json.siteParams = result.siteParams;
					pageObj.json.jsonData = result.jsonData;
				}
				if(pageObj.__merciFunc.isRequestFromApps()==true){
					pageObj.getAppVersion();
				}else{
					pageObjSetting.printUI = true;
					pageObj.$refresh();
				}
			});
		},


		$displayReady: function() {
			if (pageObjSetting.printUI == true) {
				if (pageObj.json != null && pageObj.json != undefined) {
					if (pageObj.json.jsonData != undefined || pageObj.json.jsonData != null) {
						if (pageObj.json.jsonData.Calendar != null || pageObj.json.jsonData.Calendar != undefined) {
							var calendarValue = pageObj.json.jsonData.Calendar;
						} else {
							var calendarValue = true;
						};
						if (pageObj.json.jsonData.award != null || pageObj.json.jsonData.award != undefined) {
							var awardValue = pageObj.json.jsonData.award;
						} else {
							var awardValue = false;
						};
						if (pageObj.json.jsonData.rememberSearch != null || pageObj.json.jsonData.rememberSearch != undefined) {
							var remSrchValue = pageObj.json.jsonData.rememberSearch;
						} else {
							var remSrchValue = true;
						};
						if (pageObj.json.jsonData.geoLoc != null || pageObj.json.jsonData.geoLoc != undefined) {
							var geoLoc = pageObj.json.jsonData.geoLoc;
						} else {
							var geoLoc = false;
						};
					} else {
						var calendarValue = true;
						var awardValue = false;
						var remSrchValue = true;
						var geoLoc = false ;
					}

					var ignoreUpgradeAlert = this.__merciFunc.booleanValue(pageObj.__merciFunc.getStoredItem("ignoreUpgradeAlert"));

					if (pageObj.json.siteParams.calendarDisplay == 'TRUE') {
						var onOffSwitch = document.getElementById('onoffswitch');
						if (calendarValue) {
							onOffSwitch.checked = true;
							jsonResponse.ui.CALENDAR_DISPLAY = true;
						} else {
							onOffSwitch.checked = false;
							jsonResponse.ui.CALENDAR_DISPLAY = false;
						};
					};

					if (pageObj.__merciFunc.isRequestFromApps()) {
						var onOffSwitch1 = document.getElementById('onoffswitch1');

						if (ignoreUpgradeAlert) {
							onOffSwitch1.checked = false;
						} else {
							onOffSwitch1.checked = true;
						};
					};

					if (pageObj.json.siteParams.siteRememberSearch == 'TRUE') {
						var onOffSwitch2 = document.getElementById('onoffswitch2');
						if (remSrchValue) {
							onOffSwitch2.checked = true;
							jsonResponse.ui.REMEMBER_SRCH_CRITERIA = true;
						} else {
							onOffSwitch2.checked = false;
							jsonResponse.ui.REMEMBER_SRCH_CRITERIA = false;
						};
					};

					if (pageObj.json.siteParams.siteRememberSearch == 'TRUE') {
						var onOffSwitchGeo = document.getElementById('onoffswitchGeo');
						if(onOffSwitchGeo != null){
						if (geoLoc) {
							onoffswitchGeo.checked = true;
							jsonResponse.ui.geoLoc = true;
						} else {
							onOffSwitchGeo.checked = false;
							jsonResponse.ui.geoLoc = false;
						}
					  }
					};

					/*
					if (awardValue) {
						// reset switch
						onOffSwitch1.checked = true;
					} else {
						onOffSwitch1.checked = false;
					};*/
				}

			var rqstParams = pageObj.json.rqstParams;
			var labels = pageObj.json.labels;
			if (this.__merciFunc.booleanValue(pageObj.json.siteParams.enableLoyalty) == true && pageObj.json.rqstParams.IS_USER_LOGGED_IN == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: pageObj.json.labels.loyaltyLabels,
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
				title: pageObj.json.labels.tx_merciapps_settings,
				bannerHtmlL: pageObj.json.rqstParams.bannerHtml,
				homePageURL: pageObj.json.rqstParams.homeURL,
				showButton: true,
				companyName: pageObj.json.siteParams.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			};
		},

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSetting",
						data:this.data
					});
			}
		},

		onChangeData: function(args, jsonArr) {

			var id = jsonArr.id;
			var valueData = document.getElementById(id).value;

            if(id=='lastName'){
                jsonResponse.lastName=valueData;
            }

            if(id=='kFNum'){
               	jsonResponse.ui.FQTVNum=valueData;
            }

			if (id == "country") {
				countryValue = valueData.split(",")[1];
				valueData = valueData.split(",")[0];
				document.cookie = "merci.countryCode=" + valueData;
				document.cookie = "merci.country=" + countryValue;
				document.cookie = "COUNTRY_SITE=" + valueData;
				if (jsonResponse.data != undefined && jsonResponse.data.framework != undefined && jsonResponse.data.framework.baseParams != undefined) {
					jsonResponse.data.framework.baseParams[13] = valueData;
				};

			}
			if (id == "onoffswitch") {
				var onOffSwitch = document.getElementById('onoffswitch');
				if (onOffSwitch != null) {
					if (onOffSwitch.checked == true) {
						valueData = true;
						jsonResponse.ui.CALENDAR_DISPLAY = true;
					} else {
						jsonResponse.ui.CALENDAR_DISPLAY = false;
						valueData = false;
					}
				}
			}
			if (id == "onoffswitch1") {
				var onOffSwitch = document.getElementById('onoffswitch1');
				if (onOffSwitch != null) {
					if (onOffSwitch.checked == true) {
						valueData = false;
					} else {
						valueData = true;

					}
				}
			}

			if (id == "onoffswitch2") {
				var onOffSwitch = document.getElementById('onoffswitch2');
				if (onOffSwitch != null) {
					if (onOffSwitch.checked == true) {
						valueData = true;
						jsonResponse.ui.REMEMBER_SRCH_CRITERIA = true;
					} else {
						jsonResponse.ui.REMEMBER_SRCH_CRITERIA = false;
						valueData = false;
					}
				}
			}

			if (id == "onoffswitchGeo") {
				var onOffSwitch = document.getElementById('onoffswitchGeo');
				if (onOffSwitch != null) {
					if (onOffSwitch.checked == true) {
						valueData = true;
						jsonResponse.ui.geoLoc = true;
					} else {
						jsonResponse.ui.geoLoc = false;
						valueData = false;
					}
				}
			}

			if (pageObj.json.jsonData == null) {
				pageObj.json.jsonData = {};
				pageObj.json.jsonData[jsonArr.key] = valueData;
			} else {
				pageObj.json.jsonData[jsonArr.key] = valueData;
			}

			/*Call checkForAppUpgrade when Upgrade switch state is changed
			 *
			 * Params:
			 * Confirm box string, IOS Store Link, Google Play Store Link, iOS App Version, Android App Version, isIgnore status */
			this.__merciFunc.storeLocalInDevice(merciAppData.DB_SETTINGS, pageObj.json, "overwrite", "json");
			if (id == "onoffswitch1" && this.__merciFunc.isRequestFromApps()) {

				/*pageObj.json.labels = result.labels;
					pageObj.json.gblLists = result.gblLists;
					pageObj.json.rqstParams = result.rqstParams;
					pageObj.json.siteParams = result.siteParams;*/
				var force_upgrade_msg = merciAppData.FORCE_UPGRADE_MSG;

				this.checkForAppUpgrade(pageObj.json.labels.tx_merciapps_upgrade_prompt,
										pageObj.json.siteParams.siteIOSStoreLink,
										pageObj.json.siteParams.siteAndroidStoreLink,
										pageObj.json.siteParams.siteiOSVersion,
										pageObj.json.siteParams.siteAndroidVersion,
                                        valueData,
                                        pageObj.json.siteParams.forceUpgradeiPhone,
                                        pageObj.json.siteParams.forceUpgradeAndroid,
                                        force_upgrade_msg /* Commenting due to unavailability of string this.data.labels.tx_merciapps_force_upgrade . Using string from merciAppData . Do note that tpl requires change*/);
				var ignoreUpgradeAlert = this.__merciFunc.booleanValue(pageObj.__merciFunc.getStoredItem("ignoreUpgradeAlert"));
				if(ignoreUpgradeAlert){
					var onOffSwitch1 = document.getElementById('onoffswitch1');

					if (ignoreUpgradeAlert) {
						onOffSwitch1.checked = false;
					} else {
						onOffSwitch1.checked = true;
					};
				}
			}

			if (id == "language") {
				// reset error
				if (this.data != null) {
					this.data.errors = new Array();
				}

				jsonResponse.ui.dataUpdate = true;

				if (document.getElementById("country") != null) {
					var selectedCountry = document.getElementById("country").value;
					countryData = selectedCountry.split(",")[0];
					country = countryData;
				} else {
					selCountry = this.__merciFunc.getCookie("merci.countryCode");
					country = this.__merciFunc.getCookie("merci.country");
					selectedCountry = selCountry + "," + selCountry;
				}

				var selectedLang = document.getElementById("language").value;
				this.__merciFunc.setItemInWebStorage("LanguageCode",selectedLang);

				this.__merciFunc.changeLanguage(args, {
					'selectedCountry': selectedCountry,
					'selectedLang': selectedLang,
					'moduleCtrl': this.moduleCtrl
				});
			}
		},

		getAppVersion: function() {
			/*
			modules.view.merci.common.utils.MCommonScript.getAppVersion(function (result){
                console.log("getAppVersion settings :: "+result);
            });
			  */
			this.__merciFunc.getAppVersion(function(result) {
				if (result && result != "") {
					pageObj.appVersion = result;
				}
				pageObj.printUI = true;
				pageObj.$refresh();
			});
		},

		/*Check for app upgrade begins*/
        checkForAppUpgrade: function(str_upgradeMessage, param_AppStoreLink, param_GooglePlayLink, param_iOSVersion, param_AndroidVersion, isIgnored, param_forceUpgradeiPhone, param_forceUpgradeAndroid, str_forceUpgradeMessage) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
			}

			var utils = this.__merciFunc;
                         console.log("isIgnored:"+isIgnored);
                         console.log("Force upgrade Android:"+param_forceUpgradeAndroid+" iOS:"+param_forceUpgradeiPhone);
                         console.log("Version Android:"+param_AndroidVersion+" iOS:"+param_iOSVersion);
			if (!isIgnored) {
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
								pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
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
								pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
								console.log("App Upgrade alert not required");
							}
						} else {
							pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
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
								pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
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
								pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
								console.log("Force app upgrade not required.");
							}

						}
					});
				} else {
					console.log("App upgrade prompt ignored.");
					pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
				}
			}
		},
        toggleForceUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById('forceUpgradeOverlay');
			pageObjSetting.__merciFunc.toggleClass(overlayDiv, 'on');
		},

		toggleAutoUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById("appUpgradeOverlay");
			pageObjSetting.__merciFunc.toggleClass(overlayDiv, 'on');
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
					pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && pageObj.json.siteParams.siteIOSStoreLink && pageObj.json.siteParams.siteIOSStoreLink.length > 0) {
						window.location.assign(pageObj.json.siteParams.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						pageObjSetting.toggleAutoUpgradeAlert("show");
					} else if (devicePlatform == 'Android' && pageObj.json.siteParams.siteAndroidStoreLink && pageObj.json.siteParams.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(pageObj.json.siteParams.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						pageObjSetting.toggleAutoUpgradeAlert("show");
					} else {
						pageObjSetting.toggleAutoUpgradeAlert("show");
					}

					break;

				case 'force':
					isIgnored = false;
					pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && pageObj.json.siteParams.siteIOSStoreLink && pageObj.json.siteParams.siteIOSStoreLink.length > 0) {
						window.location.assign(pageObj.json.siteParams.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjSetting.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP 	*/
					} else if (devicePlatform == 'Android' && pageObj.json.siteParams.siteAndroidStoreLink && pageObj.json.siteParams.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(pageObj.json.siteParams.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjSetting.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP 	*/
					} else {
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjSetting.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP 	*/
					}

					break;


				case 'ignore':
					isIgnored = true;
					pageObjSetting.toggleAutoUpgradeAlert("show");
					pageObjSetting.__merciFunc.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					break;


				case 'later':
					pageObjSetting.toggleAutoUpgradeAlert("show");
					break;

				default:
					break;
			}
		},
        /*Check for app upgrade ends*/
        formSubmit: function() {

			if (pageObjSetting.json.jsonData == null) {
				pageObjSetting.json.jsonData = {};

			}

			var lastNameData = document.getElementById('lastName').value;
            if(lastNameData !="" && lastNameData !=null){
               	jsonResponse.lastName=lastNameData;
				pageObjSetting.json.jsonData['lastName'] = lastNameData;
			};

			var kfNumberData = document.getElementById('kFNum').value;
			if(kfNumberData !="" && kfNumberData !=null){
				pageObjSetting.json.jsonData['kFNum'] = kfNumberData;
			};

			var countryData = document.getElementById('country').value;
			if(countryData !="" && countryData !=null){
				countryValue = countryData.split(",")[1];
				countryData = countryData.split(",")[0];
				document.cookie = "merci.countryCode=" + countryData;
				document.cookie = "merci.country=" + countryValue;
				document.cookie = "COUNTRY_SITE=" + countryData;
				if (jsonResponse.data != undefined && jsonResponse.data.framework != undefined && jsonResponse.data.framework.baseParams != undefined) {
					jsonResponse.data.framework.baseParams[13] = countryData;
				};
				pageObjSetting.json.jsonData['country'] = countryData;
			}

			var onOffSwitch = document.getElementById('onoffswitch');
			if (onOffSwitch != null) {
				if (onOffSwitch.checked == true) {
					calendarData = true;
					jsonResponse.ui.CALENDAR_DISPLAY = true;
				} else {
					jsonResponse.ui.CALENDAR_DISPLAY = false;
					calendarData = false;
				}
				pageObjSetting.json.jsonData['Calendar'] = calendarData;
			}

			var onoffswitch2 = document.getElementById('onoffswitch2');
			if (onoffswitch2 != null) {
				if (onoffswitch2.checked == true) {
					rememberSrchData = true;
					jsonResponse.ui.REMEMBER_SRCH_CRITERIA = true;
				} else {
					jsonResponse.ui.REMEMBER_SRCH_CRITERIA = false;
					rememberSrchData = false;
				}
				pageObjSetting.json.jsonData['rememberSearch'] = rememberSrchData;
			}

			pageObjSetting.__merciFunc.storeLocalInDevice(merciAppData.DB_SETTINGS, pageObj.json, "overwrite", "json");
			pageObjSetting.formValidation("show");


		},

		formValidation: function(args) {
			var overlayDiv = document.getElementById("saveDataOverlay");
			pageObjSetting.__merciFunc.toggleClass(overlayDiv, 'on');
		},

		clearField: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				inputEL.value = '';
				delEL.className += ' hidden';
			}
		},

		showCross: function(event, args) {
			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);
			if (inputEL != null && delEL != null) {
				if (inputEL.value == '') {
					delEL.className += ' hidden';
				} else if (delEL.className.indexOf('hidden') != -1) {
					delEL.className = delEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}
		},
		onChangeBackground: function(){
			this.__merciFunc.showMskOverlay(true);
			this.moduleCtrl.navigate(null, 'merci-MBGPic_A');
		}
	}
});
