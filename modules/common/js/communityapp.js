var currAppVersion = 0;
var isCommunityApp = true;
if (typeof customerAppData != 'undefined' && customerAppData.isWebEnvironment) {
	isCommunityApp = false;
}

var isTabletEnabled = typeof merciAppData != 'undefined'
					&& merciAppData['settings'] != null
					&& merciAppData['settings']['isTabletEnabled'];

var communityapp = (function() {
	var _initApp = function() {
		if (typeof merciAppData != 'undefined' && merciAppData['homeUrl'] != null) {
			langCode = localStorage.getItem("LanguageCode");

			if (typeof customerAppData != 'undefined') {

				if (typeof(customerAppData) != 'undefined' && typeof(customerAppData.languageCode) != 'undefined') {
					lang = customerAppData.languageCode;
				} else {
					lang = 'GB';
				}

				if (langCode != null && langCode != "" && langCode != undefined) {
					lang = langCode;
				}

				homeUrl = customerAppData['homeUrl'];
				homeUrl = homeUrl + "&LANGUAGE=" + lang;
			} else {
				homeUrl = merciAppData['homeUrl'];
			}

			if (typeof customerAppData != 'undefined' && customerAppData.isWebEnvironment) {
				_actionPara(homeUrl, "", "");
			} else {
				document.addEventListener("deviceready", _resetRemindMeLater, false);
				document.addEventListener("deviceready", function() {
					if (aria.core.Browser.isAndroid) {
						setTimeout(function() {
							InitWear()
						}, 7000);
					}
					//setTimeout(function(){GetWearData()}, 12000);
					_actionPara(homeUrl, "", "");

				}, false);
			}
		}
	};

	/**
	 * Method called from native code to inject URLs to this page
	 * @param myUrl
	 * @param siteParams
	 * @param pDataStr
	 * @param jsonApp
	 */
	var _actionPara = function(myUrl, siteParams, pDataStr, jsonApp) {
		/* Hidden Input tag having value of the json data (Native) */
		if (jsonApp != null && jsonApp != {}) {
			document.getElementById('app_json_data').value = jsonApp;
			var appJsonData = JSON.parse(jsonApp);
		}

		myUrl = myUrl + "&" + siteParams;
		$(document).ready(function() {
			_actionSetting(myUrl, pDataStr);
		});
	};

	/**
	 * Method to make the ajax call to fetch json
	 * @param myUrl
	 * @param pDataStr
	 */
	var _actionSetting = function(myUrl, pDataStr) {
		$.ajax({
			url: myUrl + "&result=json",
			type: "POST",
			data: pDataStr,
			processData: false,
			dataType: "json",
			crossDomain: "true",
			success: function(data) {
				document.getElementById('json_resp').value = window.btoa(encodeURIComponent(JSON.stringify(data)));
				_loadApplication({
					'data': data,
					'fromStorage': false
				});
			},
			error: function(a, b, c) {
				if (typeof storage != "undefined") {
					communityapp.getStoredItemFromDevice(merciAppData.DB_HOME, function(result) {
						if (result != null && result != '') {
							if (typeof result === 'string') {
								result = JSON.parse(result);
							}

							if (result !=null && result !='') {
								_loadApplication({
									'data': result,
									'fromStorage': true
								});
							} else {
								navigator.notification.alert(merciAppData.NETWORK_ERROR);
							}
						} else {
							navigator.notification.alert(merciAppData.NETWORK_ERROR);
						}
					});
				} else {
					navigator.notification.alert(merciAppData.NETWORK_ERROR);
				}
			}
		})
	};

	/**
	 * javascript function called when application need to be loaded
	 * @param args JSON object containing data
	 */
	var _loadApplication = function(args) {

		// i.e. invalid data
		if (args == null
			|| args.data == null
			|| args.data.data == null
			|| args.data.data.framework == null) {
			return;
		}

		// override values from custom_variable.js
		if (typeof customerAppData != 'undefined'
			&& customerAppData.configuration != null) {
			for (var key in customerAppData.configuration) {
				if (customerAppData.configuration.hasOwnProperty(key)) {
					args.data.data.framework.settings[key] = customerAppData.configuration[key];
				}
			}
		}

		application.initMeRCI({
			isWebFlow: false,
			json: args.data
		});

		application.onPageEngineInitialized = function(params) {

			// indicator for local storage
			jsonResponse.ui.fromStorage = args.fromStorage;

			if (typeof customerAppData != "undefined" && !customerAppData.isWebEnvironment) {
				communityapp.getAppVersion(function(result) {
					if (result && result != "" && result != undefined) {
						currAppVersion = result;
					}
				});
			}

			communityapp.getCountryCode(function(result) {
				if (jsonResponse.data.framework != null && jsonResponse.data.framework.baseParams != null) {
					countryCode = jsonResponse.data.framework.baseParams[13];
				} else if (jsonResponse.data.custom_framework != null && jsonResponse.data.custom_framework.baseParams != null) {
					countryCode = jsonResponse.data.custom_framework.baseParams[13];
				}

				if (countryCode == null || countryCode == "") {
					if (result != null && result != "") {
						jsonResponse.data.framework.baseParams[13] = result;
					}
				}
			});

			setTimeout(function() {
				$("#overlay").hide();
			}, 500);

			if (typeof customerAppData != "undefined" && typeof customerAppData.isCustomSplashScreen != "undefined" && customerAppData.isCustomSplashScreen) {
				document.getElementById("splash").style.display = "none";
			}
		}
	};

	/**
	 * Method called to set flags for RemindMeLater functionality
	 */
	var _resetRemindMeLater = function() {
		localStorage.setItem("RemindMeLater", "FALSE");
	};

	return {

		/**
		 * checks if the current request is coming from community app
		 * @return boolean
		 */
		isRequestFromApps: function() {
			return typeof isCommunityApp != 'undefined' && isCommunityApp;
		},

		/**
		 * This method should not be used direcltly from other files.<br/>
		 * Please use getStoredItemFromDevice
		 * @param key
		 * @param fn callback function
		 **/
		getItemFromDeviceStorage: function(key, fn) {

			var result = "";
			that = this;
			
			// do what you want if setItem is called on localStorage
			// replace dbName, dbVersion and dbTable from values that are customer specific

			// Open the DB Table
			storage.openDBtable(
				function(successMessage) {
					// Get the item
					storage.getData(
						function(successMessage) {
							if (typeof successMessage === 'string') {
								successMessage = JSON.parse(successMessage);
							}
							result = successMessage.data;

							if (result.length == 0) {
								result = application.getItemFromWebStorage(key);
							}

							if (fn) {
								fn(result);
							} else {
								return result;
							}
						},
						function(errorMessage) {
							return result;
						}, key
					);
				},
				function(errorMessage) {
					// nothing for now
				},
				merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
			);
		},

		/**
		 * Phonegap Storage Plugin interface method should be accessed from other files<br/>
		 * Use this method to get stored data from Browser for Web and Device Local Storage for Apps
		 * @param name Name of DB
		 * @param fn callback function
		 */
		getStoredItemFromDevice: function(name, fn) {
			var storedResult = "";
			if (application.supports_local_storage()) {

				this.getItemFromDeviceStorage(name, function(result) {
					storedResult = result;
					if (fn) {
						fn(storedResult);
					} else {
						return result;
					}
				});

			} else {
				if (fn) {
					fn(application.getCookie(name));
				} else {
					return application.getCookie(name);
				}
			}
		},

		/**
		 * returns the application version from the app's manifest or plist
		 * @param fn callback function
		 * @return string
		 */
		getAppVersion: function(fn) {
			var result = "0.0";
			if (settings) {
				settings.getAppVersion(function(successMessage) {
					if (typeof successMessage === 'string') {
						successMessage = JSON.parse(successMessage);
					}
					result = successMessage.data;
					if (result.length == 0) {
						result = "0.0";
					}
					if (fn) {
						fn(result);
					} else {
						return result;
					}
				}, function(errorMessage) {
					return result;
				});
			} else {
				return result;
			}
		},

		/**
		 * returns the country code from the device settings
		 * @param fn callback function
		 * @return string
		 */
		getCountryCode: function(fn) {
			var result = "GB";
			if (typeof settings != "undefined") {
				settings.getCountryCode(function(successMessage) {
					if (typeof successMessage === 'string') {
						successMessage = JSON.parse(successMessage);
					}
					result = successMessage.data;
					if (result.length == 0) {
						result = "GB";
					}
					if (fn) {
						fn(result);
					} else {
						return result;
					}
				}, function(errorMessage) {
					return result;
				});
			} else {
				return result;
			}

		},
		initApp: function() {
			_initApp();
		}
	};
})();

/* Android Wear JSON Creation plugin intialization*/
function InitWear() {
	var wearSuccess = function(message) {
		console.log('InitWear success ' + message);
	};
	var wearFailure = function(message) {
		console.log('InitWear failure ' + message);
	};
	WearPlugin.initWear(wearSuccess, wearFailure);
}

/* Function to send Data(Trip List and Trip Detail JSON) to Wear */
function GetWearData() {
	WearData.SendData();
}