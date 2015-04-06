Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.MCommonScript',
	$singleton: true,
	$dependencies: [
		'aria.utils.Type',
		'aria.utils.Date',
		'aria.utils.Number',
		'aria.utils.Callback',
		'aria.utils.Device',
		'aria.utils.Json',
		'aria.utils.HashManager',
		'modules.view.merci.common.utils.StringBufferImpl'
	],

	$prototype: {

		/** START Phonegap plugin method calls for community application **/

		/**
		 * checks if the maerci at contains custom package too
		 * @return boolean
		 */
		hasCustomPackage: function() {
			return typeof merciAppData != 'undefined' && merciAppData['settings'] != null && merciAppData['settings']['hasCustomPackage'];
		},

		/**
		 * checks if the current request is coming from community app
		 * @return boolean
		 */
		isRequestFromApps: function() {
			if (typeof communityapp != 'undefined' && communityapp.isRequestFromApps()) {
				return communityapp.isRequestFromApps();
			}

			return false;
		},

		/**
		 * returns the country code from the device settings
		 * @return string
		 */
		getCountryCode: function(fn) {
			if (typeof communityapp != 'undefined' && typeof communityapp.getCountryCode == 'function') {
				communityapp.getCountryCode(fn);
			}

			return 'GB';
		},

		/**
		 * returns the locale code from the device settings
		 * @return string
		 */
		getLocale: function(fn) {

			var result = "en_GB";
			if (typeof settings != "undefined") {
				settings.getLocale(function(successMessage) {
					if (typeof successMessage === 'string') {
						successMessage = JSON.parse(successMessage);
					}
					result = successMessage.data;
					if (result.length == 0) {
						result = "en_GB";
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
		 * returns the application version from the app's manifest or plist
		 * @return string
		 */
		getAppVersion: function(fn) {
			if (typeof communityapp != 'undefined' && typeof communityapp.getAppVersion == 'function') {
				communityapp.getAppVersion(fn);
			}

			return '0.0';
		},

		/** Send sharing provider and data to be shared from merci mobile application **/
		sendShareData: function(shareId, shareData) {
			//console.log("shareId: " + shareId + " shareData: " + shareData);
			socialmediashare.shareSocialMediaData(function() {}, function() {}, shareId, shareData);
		},

		/** Start camera to take photo from merci mobile application and associate with trip**/
		startCamera: function(bookingReference) {
			var imgFormatType = "";
			if (merciAppData.STORE_IMG_DATA) {
				imgFormatType = Camera.DestinationType.DATA_URL;
			} else if (merciAppData.STORE_IMG_URI) {
				imgFormatType = Camera.DestinationType.FILE_URI;
			}

			navigator.camera.getPicture(onSuccess, onFail, {
				quality: 100,
				destinationType: imgFormatType,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 300,
				targetHeight: 300,
				saveToPhotoAlbum: true
			});

			function onSuccess(photodata) {

				storage.closeDB(function() {}, function() {}, merciAppData.DBNAME);

				storage.openDBtable(function() {
					storage.getData(function(photosJson) {

						if (typeof photosJson === 'string') {
							photosJson = JSON.parse(photosJson);
						}
						photosJson = photosJson.data;

						if (photosJson != "" && typeof photosJson === 'string') {
							photosJson = JSON.parse(photosJson);
						}
						var photosArray = [];
						if (photosJson != "" && photosJson.trip != null && photosJson.photos != null) {
							photosArray = photosJson.photos;
						} else {
							photosJson = {
								"trip": bookingReference,
								"photos": []
							};
						}
						var numofphoto = photosArray.length;
						photosArray.push({
							"index": numofphoto,
							"url": photodata
						});

						photosJson.trip = bookingReference;
						photosJson.photos = photosArray;
						storage.setData(function(photosaved) {
							storage.closeDB(function() {}, function() {}, merciAppData.DBNAME);
						}, function(photosavefailed) {
							//console.log("photosavefailed for " + bookingReference);
						}, bookingReference + merciAppData.STORE_IMG_KEY, photosJson);

					}, function(getphotofailed) {
						//console.log("getphotofailed for " + bookingReference);
					}, bookingReference + merciAppData.STORE_IMG_KEY);

				}, function() {}, merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE);

			}

			function onFail(startcamerafailed) {
				//console.log("startcamerafailed : " + startcamerafailed.status);
			}
		},

		/** Send json data in the required format to view events in calendar from merci mobile application **/
		viewEventsInCalendar: function(viewCalendarJSON) {
			//console.log("viewEventsInCalendar : " + viewCalendarJSON);
			calendar.viewEventsInCalendar(function(successMessage) {
					//console.log("viewEventsInCalendar success " + successMessage);
				},
				function(failureMessage) {
					//console.log("viewEventsInCalendar failure " + failureMessage);
				},
				JSON.stringify(viewCalendarJSON));
		},

		/** Send json data in the required format to add events in calendar from merci mobile application **/
		addEventsToCalendar: function(calendarJson) {
			calendarJson = JSON.stringify(calendarJson);
			//console.log("addEventsToCalendar : " + calendarJson);
			calendar.addToCalendar(function(successMessage) {
					alert("Events Added To Calendar");
					//console.log("addEventsToCalendar success "+ successMessage);
				},
				function(errorMessage) {
					//console.log("addEventsToCalendar failure "+ errorMessage);

				},
				calendarJson);

		},

		/** Send data in the required format to delete events in calendar from merci mobile application **/
		deleteEventsFromCalendar: function() {
			//console.log("deleteEventsFromCalendar : " + eventKey);
			calendar.deleteFromCalendar(function(successMessage) {
					console.log(successMessage);
				},
				function(errorMessage) {
					console.log(errorMessage);
				},
				eventKey);
		},

		/** Send key and value for the data to be stored in merci mobile application **/
		/** This method should not be used direcltly from other files. Please use storeLocalInDevice **/
		setItemInDeviceStorage: function(key, value) {
			var result = false;

			if (this.isRequestFromApps()) {
				//console.log("setItemInDeviceStorage key : "+key+" value : "+value);
				// do what you want if setItem is called on localStorage
				// replace dbName, dbVersion and dbTable from values that are customer specific

				// Open the DB Table
				storage.openDBtable(
					function(successMessage) {
						console.log("setItemInDeviceStorage openDBtable");

						// Save the item
						storage.setData(
							function(successMessage) {
								result = true;
								//console.log("setItemInDeviceStorage setData : " + JSON.stringify(successMessage));

							},
							function(errorMessage) {
								//console.log("setItemInDeviceStorage setData : " + JSON.stringify(errorMessage));
							}, key, value
						);
					},
					function(errorMessage) {
						//console.log("setItemInDeviceStorage openDBtable : " + JSON.stringify(errorMessage));
					},
					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				);

				//storage.closeDB(function() {}, function() {}, merciAppData.DBNAME);
			} else {

				this.setItemInWebStorage(key, value);
			}
			return result;
		},

		/** This method should not be used direcltly from other files. Please use storeLocal **/
		setItemInWebStorage: function(key, value) {
			//console.log("setItemInWebStorage key : "+key+" value : "+value);
			localStorage.setItem(key, value);
		},

		/** This method should not be used direcltly from other files. Please use getStoredItemFromDevice **/
		getItemFromDeviceStorage: function(key, fn) {
			if (this.isRequestFromApps() 
				&& typeof communityapp.getItemFromDeviceStorage == 'function') {
				return communityapp.getItemFromDeviceStorage(key, fn);
			} else {
				result = application.getItemFromWebStorage(key);
				if (fn) {
					fn(result);
				} else {
					return result;
				}
			}
		},

		/** This method is used to prefill page form **/
		prefillFormData: function(args) {

			if (jsonResponse.popup == null) {
				return;
			}

			var elements = jsonResponse.popup.fromPopupData;
			if (!this.isEmptyObject(elements)) {
				var domElement = null;
				for (var key in elements) {
					if (elements.hasOwnProperty(key)) {
						domElement = document.getElementsByName(key);
						if (domElement != null && domElement.length > 0) {
							for (var i = 0; i < domElement.length; i++) {
								elements[key] = elements[key].replace(/\+/g, '%20');
								if (domElement[i].type == "checkbox") {
									domElement[i].checked = true;
								} else if (domElement[i].type == "radio") {
									if (domElement[i].id == decodeURIComponent(elements[key]) || domElement[i].value == decodeURIComponent(elements[key]) ) {
										domElement[i].checked = true;
									}
								} else {
									domElement[i].value = decodeURIComponent(elements[key]);
								}
							}
							delete elements[key];
						}
					}
				}
			}
		},

		/** This method is used to store form data in localStorage**/
		storeFormData: function(args) {
			var formToPrefill = document.forms[0];
			formToPrefill = $(formToPrefill).serialize();
			formToPrefill = formToPrefill.replace(/\+/g, '%20');
			formToPrefill = decodeURIComponent(formToPrefill);
			var els = formToPrefill.split('&');
			var el = "";
			var objJson = {};
			for (var i = 0; i < els.length; i++) {
				el = els[i].split("=");
				objJson[el[0]] = el[1];
			}
			if (jsonResponse.popup == null) {
				jsonResponse.popup = {};
			}
			jsonResponse.popup.fromPopupData = objJson;
		},

		/** This method should not be used direcltly from other files. Please use getStoredItem **/
		getItemFromWebStorage: function(key) {
			return application.getItemFromWebStorage(key);
		},

		getAllKeysFromLocalStorage: function(fn) {
			var result = false;
			if (this.isRequestFromApps()) {
				//console.log("MeRCI Application Flow");
				storage.openDBtable(
					function(successMessage) {
						//console.log("Recieved Success callback for openDBtable from phonegap: " + JSON.stringify(successMessage));

						// Get the item

						storage.getAllDataKey(
							function(successMessage) {
								//console.log("Recieved Success callback for getAllDataKey from phonegap before : " + successMessage);
								if (typeof successMessage === 'string') {
									successMessage = JSON.parse(successMessage);
								}
								result = successMessage.data;
								//console.log("Recieved Success callback for getAllDataKey from phonegap after : " + result);
								if (fn) {
									fn(result);
								} else {
									return result;
								}

								/*storage.closeDB(
											function (successMessage) {
												console.log("Recieved Success callback for closeDB from phonegap: " + JSON.stringify(successMessage));
		                                                console.log("final: "+result);
		                                                alert("YEAH!"+result);
		                                                return result;
											},
											function (errorMessage) {
												console.log("Recieved Error callback for closeDB from phonegap: " + JSON.stringify(errorMessage));
		                                                console.log("final: "+result);
		                                                return result;
											},
											merciAppData.DBNAME
										);*/
							},

							function(errorMessage) {
								//console.log("Recieved Error callback for getData from phonegap: " + JSON.stringify(errorMessage));
								return result;
							}
						);
					},

					function(errorMessage) {
						//console.log("Recieved Error callback for openDBtable from phonegap: " + JSON.stringify(errorMessage));
					},

					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				)
			} else {
				//console.log("Web Flow");
				return Object.keys(localStorage);
			}
		},

		getAllDataFromLocalStorage: function(key, fn) {

			var result = false;
			if (this.isRequestFromApps()) {
				//console.log("MeRCI Application Flow");

				storage.openDBtable(
					function(successMessage) {
						//console.log("Recieved Success callback for openDBtable from phonegap: " + JSON.stringify(successMessage));

						// Get the item
						storage.getAllData(
							function(successMessage) {
								//	console.log("Recieved Success callback for getAllDataKey from phonegap before : " + successMessage);
								if (typeof successMessage === 'string') {
									successMessage = JSON.parse(successMessage);
								}
								result = successMessage.data;
								//console.log("Recieved Success callback for getAllDataKey from phonegap after : " + result);
								if (fn) {
									fn(result);
								} else {
									return result;
								}
								/*storage.closeDB(
											function (successMessage) {
												console.log("Recieved Success callback for closeDB from phonegap: " + JSON.stringify(successMessage));
		                                                console.log("final: "+result);
		                                                return result;
											},
											function (errorMessage) {
												console.log("Recieved Error callback for closeDB from phonegap: " + JSON.stringify(errorMessage));
		                                                console.log("final: "+result);
		                                                return result;
											},
											merciAppData.DBNAME
										);*/
							},
							function(errorMessage) {
								//console.log("Recieved Error callback for getData from phonegap: " + JSON.stringify(errorMessage));
								return result;
							}, key
						);
					},
					function(errorMessage) {
						//console.log("Recieved Error callback for openDBtable from phonegap: " + JSON.stringify(errorMessage));
					},
					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				)

			} else {
				//console.log("MeRCI Web Flow");
				return Object.keys(localStorage);
			}

		},

		removeItemFromLocalStorage: function(key) {

			var result = false;

			if (this.isRequestFromApps()) {
				//console.log("MeRCI Application Flow");

				// do what you want if setItem is called on localStorage
				// replace dbName, dbVersion and dbTable from values that are customer specific

				// Open the DB Table
				storage.openDBtable(
					function(successMessage) {
						//console.log("Recieved Success callback for openDBtable from phonegap: " + JSON.stringify(successMessage));

						// delete the item
						storage.deleteData(
							function(successMessage) {
								result = true;
								//console.log("Recieved Success callback for deleteData from phonegap: " + JSON.stringify(successMessage));

								// Close DB
								/*storage.closeDB(
									function(successMessage) {
										console.log("Recieved Success callback for closeDB from phonegap: " + JSON.stringify(successMessage));
									},
									function(errorMessage) {
										console.log("Recieved Error callback for closeDB from phonegap: " + JSON.stringify(errorMessage));
									},
									merciAppData.DBNAME
								);*/
							},
							function(errorMessage) {
								//console.log("Recieved Error callback for deleteData from phonegap: " + JSON.stringify(errorMessage));
							}, key
						);
					},
					function(errorMessage) {
						//console.log("Recieved Error callback for openDBtable from phonegap: " + JSON.stringify(errorMessage));
					},
					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				);

			} else {
				//console.log("MeRCI Web Flow");
			}
			return result;
		},

		getItemKeyFromLocalStorage: function(index) {

			var result;
			if (this.isRequestFromApps()) {

				// Open the DB Table
				storage.openDBtable(
					function(successMessage) {
						//console.log("Recieved Success callback for openDBtable from phonegap: " + JSON.stringify(successMessage));

						// getItemKeyFromLocalStorage
						storage.getAllData(
							function(successMessage) {
								//console.log("Recieved Success callback for getItemKeyFromLocalStorage from phonegap: " + JSON.stringify(successMessage));

								result = successMessage;

								// Close DB
								/*storage.closeDB(
									function(successMessage) {
										console.log("Recieved Success callback for closeDB from phonegap: " + JSON.stringify(successMessage));
									},
									function(errorMessage) {
										console.log("Recieved Error callback for closeDB from phonegap: " + JSON.stringify(errorMessage));
									}
								);*/

							},
							function(errorMessage) {
								//console.log("Recieved Error callback for getItemKeyFromLocalStorage from phonegap: " + JSON.stringify(errorMessage));
							}, key
						);
					},
					function(errorMessage) {
						//console.log("Recieved Error callback for openDBtable from phonegap: " + JSON.stringify(errorMessage));
					},
					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				);

			} else {
				//console.log("MeRCI Web Flow");
				result = window.localStorage.key(index);
			}
			return result;

		},


		removeAllItemsFromLocalStorage: function() {

			var result = false;
			if (this.isRequestFromApps()) {
				console.log("MeRCI Application Flow");

				// do what you want if setItem is called on localStorage
				// replace dbName, dbVersion and dbTable from values that are customer specific

				// Open the DB Table
				storage.openDBtable(
					function(successMessage) {
						//console.log("Recieved Success callback for openDBtable from phonegap: " + JSON.stringify(successMessage));

						// delete all data
						storage.deleteAllData(
							function(successMessage) {
								//console.log("Recieved Success callback for deleteAllData from phonegap: " + JSON.stringify(successMessage));

								// Close DB
								/*storage.closeDB(
									function(successMessage) {
										console.log("Recieved Success callback for closeDB from phonegap: " + JSON.stringify(successMessage));
									},
									function(errorMessage) {
										console.log("Recieved Error callback for closeDB from phonegap: " + JSON.stringify(errorMessage));
									},
									merciAppData.DBNAME
								);*/

							},
							function(errorMessage) {
								//console.log("Recieved Error callback for deleteAllData from phonegap: " + JSON.stringify(errorMessage));
							}
						);
					},
					function(errorMessage) {
						//console.log("Recieved Error callback for openDBtable from phonegap: " + JSON.stringify(errorMessage));
					},
					merciAppData.DBNAME, merciAppData.DBVERSION, merciAppData.DBTABLE
				);

			} else {
				//console.log("MeRCI Web Flow");
			}
			return result;
		},

		/** END Phonegap plugin method calls for community application **/

		hideMskOverlay: function() {

			// showing all the div with class as 'msk'
			var msks = document.getElementsByClassName('msk');
			for (var i = 0; i < msks.length; i++) {
				if (msks[i].nodeName == 'DIV') {
					msks[i].style.display = 'none';
					var delEl = document.getElementsByClassName("splash");
					for(var i=0;i<delEl.length;i++){
						delEl[i].parentNode.removeChild(delEl[i]);
					}
				}
			}
		},
		closePopup: function() {

			this.hideMskOverlay();
			var htmlPopup = document.getElementById('htmlPopup');
			if (htmlPopup != null) {
				htmlPopup.style['height'] = '';
			}

			// hiding all the element with class as 'popup'
			var popups = document.getElementsByClassName('popup');
			for (var i = 0; i < popups.length; i++) {
				popups[i].style.display = 'none';
			}
		},

		openHTML: function(data) {

			var request = {
				action: data.link,
				isCompleteURL: true,
				method: 'GET',
				cb: {
					fn: this.__onHtmlCallback,
					scope: this,
					args: data
				}
			};

			if (this.booleanValue(data.enableNewPopup) == true) {
				this.showMskOverlay(true);
			} else {
				this.showMskOverlay(false);
			}
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onHtmlCallback: function(response, args) {

			if (response != null) {

				var serverResponse = response.responseText;
				if (serverResponse != null && serverResponse.trim().indexOf('<head>') != -1) {
					// this means that session timeout page is getting loaded
					// if we add content to innerHTML then
					// we will be adding typeA.css of jsp too and this will cause UI issues
					serverResponse = serverResponse.substring(serverResponse.indexOf('<body>') + 6, serverResponse.indexOf('</body>'));
				}

				if (this.booleanValue(args.enableNewPopup) == true) {
					var popup = args.moduleCtrl.getJsonData({
						key: "popup"
					});

					aria.utils.Json.setValue(popup, 'settings', {
						macro: "htmlPopup"
					});

					aria.utils.Json.setValue(popup, 'data', {
						htmlResponse: serverResponse
					});
					this.storeFormData(null);
					this.navigate(null, 'Popup');

				} else {
					// setting data
					document.getElementById('htmlPopup').innerHTML = serverResponse;

					/* Converting all href's starting with http to custom format to enable Cordova app to open the hyperlink in native browser. */

					if (this.isRequestFromApps() == true) {

						for (i = 0; i < document.getElementsByTagName("a").length; i++) {
							var url = document.getElementsByTagName("a")[i].getAttribute("href");

							if (url != null && typeof url != 'undefined' && url.length > 4 && (url.substring(0, 4) == "http" || url.substring(0, 4) == "https") && url.indexOf("#") == -1) {
								document.getElementsByTagName("a")[i].removeAttribute('href');
								document.getElementsByTagName("a")[i].removeAttribute('target');
								document.getElementsByTagName("a")[i].setAttribute('href', "javaScript:void(0)");
								aria.utils.Event.addListener(document.getElementsByTagName("a")[i], "click", {
									fn: this.loadURLs,
									args: url
								}, true);
							}
						}
					}
					document.getElementById('htmlContainer').style.display = 'block';

					// scroll to top
					window.scrollTo(0, 0);
				}
			} else {
				this.hideMskOverlay();
			}
		},

		getTravellerType: function(travellerType, labels, siteAllowPax, override) {

			var code = travellerType.travellerType.code;
			var traveller = "";
			if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
				traveller = labels.tx_merci_text_booking_fare_adults;
			} else {
				traveller = labels.tx_merci_text_booking_alpi_adult;
			}
			if (code == 'CHD') {
				if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
					traveller = labels.tx_merci_text_booking_review_pb_children;
				} else {
					traveller = labels.tx_merci_text_booking_child;
				}
			} else if (code == 'INF') {
				if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
					traveller = labels.tx_merci_text_booking_review_pb_infants;
				} else {
					traveller = labels.tx_merci_text_booking_alpi_infant;
				}
			} else {
				if (siteAllowPax != null && siteAllowPax.toLowerCase() == 'true') {
					if (code == 'YCD') {
						if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
							traveller = labels.tx_mc_text_addPax_snrs;
						} else {
							traveller = labels.tx_mc_text_addPax_snr;
						}
					} else if (code == 'STU') {
						if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
							traveller = labels.tx_mc_text_addPax_stdnts;
						} else {
							traveller = labels.tx_mc_text_addPax_stdnt;
						}
					} else if (code == 'YTH') {
						if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
							traveller = labels.tx_mc_text_addPax_yths;
						} else {
							traveller = labels.tx_mc_text_addPax_yth;
						}
					} else if (code == 'MIL') {
						if (travellerType.number > 1 && (override == null || override == 'FALSE')) {
							traveller = labels.tx_mc_text_addPax_militaries;
						} else {
							traveller = labels.tx_mc_text_addPax_mlty;
						}
					}
				}
			}
			return traveller;
		},

		toggleExpand: function(event, data) {

			var secIdEL = document.getElementById(data.sectionId);
			var btnIdEL = document.getElementById(data.buttonId);

			if (btnIdEL != null && secIdEL != null) {

				// toggle hidden class
				if (secIdEL.className.indexOf('hidden') != -1) {
					secIdEL.className = secIdEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				} else {
					secIdEL.className += ' hidden';
				}

				var value = btnIdEL.getAttribute("aria-expanded");
				var val = 'true';
				if (value == 'true') {
					val = 'false';
				}

				btnIdEL.setAttribute("aria-expanded", val);
			}
		},

		showMskOverlay: function(showLoadingIcon) {

			// showing all the div with class as 'msk'
			var msks = document.getElementsByClassName('msk');
			if (msks != null && msks.length > 0) {
				for (var i = 0; i < msks.length; i++) {
					if (msks[i].nodeName == 'DIV') {
						msks[i].style.display = 'block';

						if (showLoadingIcon) {
							// show loading icon
							if (msks[i].className.indexOf('loading') == -1) {
								msks[i].className += ' loading';
							}
						} else if (msks[i].className.indexOf('loading') != -1) {
							// remove loading icon
							msks[i].className = msks[i].className.replace(/(?:^|\s)loading(?!\S)/g, '');
						}
					}
				}
			}
		},

		getStaticLinkURL: function(file, folder) {
			// URL base parameters
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			// TODO folder to be used to check in html folder for html files instead of css

			if (folder.toLowerCase() == 'html') {
				file = file.replace('{0}', bp[12]);
			}

			return bp[0] + "://" + bp[1] + ":" + bp[2] + bp[10] + "/" + bp[4] + "/" + bp[5] + "/static/" + folder.toLowerCase() + "/client/" + file;
		},

		/**
		 * @param obj Object to be tested
		 * @return Boolean true or false, true if object is empty
		 */
		isEmptyObject: function(obj) {

			var result = true;

			if (obj != null) {

				// if other than object
				if (!(obj instanceof Object) && obj.toString() != '[object Object]') {
					obj = "" + obj;
				}

				// iterate on object
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key) && key != 'aria:parent') {
						result = false;
					}
				}
			}

			return result;
		},

		/** Use this method to store data only in Browser or WebView Local Storage **/
		storeLocal: function(name, value, mode, datatype, limit) {

			var value = value;
			var mode = mode;
			var name = name;
			var flag = 0;
			var limit = parseInt(limit, 10);
			var that = this;
			/*checking whether browser supports Html5 local storage*/
			if (this.supports_local_storage()) {
				var result = this.getItemFromWebStorage(name);

				if (result == null || mode == "overwrite") {
					if (datatype == "json") {
						// When the data type is json, this require to stringify.
						that.setItemInWebStorage(name, JSON.stringify(aria.utils.Json.copy(value)));
					}
					if (datatype == "text") {
						// When the data type is text, this doesnt require to stringify again.
						that.setItemInWebStorage(name, value);
					}
					flag = 1;
				}
				/*if the mode is front or rear then this block is called*/
				else {
					if (flag == 0) {
						var t = result;
						var retrievedJSON = JSON.parse(t);
						/*This loop checks whether the value being passed to the function already exists in the list,if so it removes it .*/
						for (var len = 0; len < retrievedJSON.index.length; len++) {

							if (retrievedJSON.index[len].id == value.id) {
								retrievedJSON.index.splice(len, 1);
							}
						}
						/*the value is then added to front or rear*/
						if (mode == "front") {
							retrievedJSON.index.unshift(value);
							if (retrievedJSON.index.length > limit) {
								retrievedJSON.index.splice(limit, retrievedJSON.index.length - limit);
							}
						}
						if (mode == "rear") {
							retrievedJSON.index.push(value);
							if (retrievedJSON.index.length > limit) {
								retrievedJSON.index.splice(0, retrievedJSON.index.length - limit);
							}
						}

						that.setItemInWebStorage(name, JSON.stringify(retrievedJSON));
					}
				};
			}
			/*this block is called if Html 5 local storage is not supported.*/
			else {
				if (this.getCookie(name) == null || mode == "overwrite") {
					if (datatype == "json") {
						localStorage.setItem(name, JSON.stringify(value));
						this.createCookie(name, JSON.stringify(value), 365);
					}
					if (datatype == "text") {
						this.createCookie(name, value, 365);
					}

					flag = 1;
				} else {
					if (flag == 0) {
						var t = this.getCookie(name);
						var retrievedJSON = JSON.parse(t);
						for (var len = 0; len < retrievedJSON.index.length; len++) {

							if (retrievedJSON.index[len].id == value.id) {
								retrievedJSON.index.splice(len, 1);
							}
						}
						if (mode == "front") {
							retrievedJSON.index.unshift(value);
							if (retrievedJSON.index.length > limit) {
								retrievedJSON.index.splice(limit, retrievedJSON.index.length - limit);
							}
						}
						if (mode == "rear") {
							retrievedJSON.index.push(value);
							if (retrievedJSON.index.length > limit) {
								retrievedJSON.index.splice(0, retrievedJSON.index.length - limit);
							}
						}
						this.createCookie(name, JSON.stringify(retrievedJSON), 365);
					}
				}
			}
		},

		/** Phonegap Storage Plugin interface method should be accessed from other files **/
		/** Use this method to store data in Browser for Web and Device Local Storage for Apps**/
		storeLocalInDevice: function(name, value, mode, datatype, limit) {

			if (this.isRequestFromApps()) {
				var value = value;
				var mode = mode;
				var name = name;
				var flag = 0;
				var limit = parseInt(limit, 10);
				var that = this;

				/*checking whether browser supports Html5 local storage*/
				if (this.supports_local_storage()) {
					this.getItemFromDeviceStorage(name, function(result) {

						if (result == null || mode == "overwrite") {
							if (datatype == "json") {

								that.setItemInDeviceStorage(name, JSON.stringify(value));
							}
							if (datatype == "text") {

								// When the data type is text, this doesnt require to stringify again.
								that.setItemInDeviceStorage(name, value);
							}
							flag = 1;
						}
						/*if the mode is front or rear then this block is called*/
						else {
							if (flag == 0) {

								var t = result;
								var retrievedJSON = JSON.parse(t);
								/*This loop checks whether the value being passed to the function already exists in the list,if so it removes it .*/
								for (var len = 0; len < retrievedJSON.index.length; len++) {

									if (retrievedJSON.index[len].id == value.id) {
										retrievedJSON.index.splice(len, 1);
									}
								}
								/*the value is then added to front or rear*/
								if (mode == "front") {
									retrievedJSON.index.unshift(value);
									if (retrievedJSON.index.length > limit) {
										retrievedJSON.index.splice(limit, retrievedJSON.index.length - limit);
									}
								}
								if (mode == "rear") {
									retrievedJSON.index.push(value);
									if (retrievedJSON.index.length > limit) {
										retrievedJSON.index.splice(0, retrievedJSON.index.length - limit);
									}
								}

								that.setItemInDeviceStorage(name, JSON.stringify(retrievedJSON));
							}
						}
					});
				}
				/*this block is called if Html 5 local storage is not supported.*/
				else {
					if (this.getCookie(name) == null || mode == "overwrite") {
						if (datatype == "json") {
							localStorage.setItem(name, JSON.stringify(value));
							this.createCookie(name, JSON.stringify(value), 365);
						}
						if (datatype == "text") {
							this.createCookie(name, value, 365);
						}

						flag = 1;
					} else {
						if (flag == 0) {
							var t = this.getCookie(name);
							var retrievedJSON = JSON.parse(t);
							for (var len = 0; len < retrievedJSON.index.length; len++) {

								if (retrievedJSON.index[len].id == value.id) {
									retrievedJSON.index.splice(len, 1);
								}
							}
							if (mode == "front") {
								retrievedJSON.index.unshift(value);
								if (retrievedJSON.index.length > limit) {
									retrievedJSON.index.splice(limit, retrievedJSON.index.length - limit);
								}
							}
							if (mode == "rear") {
								retrievedJSON.index.push(value);
								if (retrievedJSON.index.length > limit) {
									retrievedJSON.index.splice(0, retrievedJSON.index.length - limit);
								}
							}
							this.createCookie(name, JSON.stringify(retrievedJSON), 365);
						}
					}
				}
			} else {
				this.storeLocal(name, value, mode, datatype, limit);
			}
		},

		/** Use this method to get stored data only from Browser or WebView Local Storage **/
		getStoredItem: function(name) {
			return application.getStoredItem(name);
		},

		/** Phonegap Storage Plugin interface method should be accessed from other files **/
		/** Use this method to get stored data from Browser for Web and Device Local Storage for Apps**/
		getStoredItemFromDevice: function(name, fn) {
			if (this.isRequestFromApps() 
				&& typeof communityapp.getStoredItemFromDevice == 'function') {
				return communityapp.getStoredItemFromDevice(name, fn);
			} else {
				/* check for value from web local storage  */
				storedResult = application.getStoredItem(name);
				if (fn) {
					fn(storedResult);
				} else {
					return storedResult;
				}
			}
		},

		supports_local_storage: function() {
			return application.supports_local_storage();
		},

		getCookie: function(c_name) {
			return application.getCookie();
		},

		createCookie: function(name, value, days) {
			var expires = '';
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = '; expires=' + date.toGMTString();
			}

			document.cookie = name + '=' + value + expires + '; path=/';
		},

		/**
		 * Returns value if it is not an empty object (as per above method), defaultValue otherwise
		 */
		ifNotEmpty: function(value, defaultValue) {
			if (this.isEmptyObject(value)) {
				return defaultValue;
			} else {
				return value;
			}
		},

		/**
		 * Generic event handler to attach to button to open/close sections.
		 * The function toggle the aria-expanded attribute of the event target,
		 * reads the aria-controls attribute and and toggle the aria-expanded and aria-hidden
		 * of the elements given by aria-controls value.
		 */
		toggleSection: function(evt, template) {
			var targetId = evt.target.getProperty('id');
			if (targetId) {
				var target = document.getElementById(targetId);
				this.toggleAttribute(target, 'aria-expanded');
				var sectionIds = target.getAttribute('aria-controls');
				if (sectionIds) {
					sectionIds = sectionIds.split(' ');
					for (var s = 0; s < sectionIds.length; s++) {
						var section = document.getElementById(sectionIds[s]) || document.getElementById(template.$getId(sectionIds[s]));
						if (section) {
							this.toggleAttribute(section, 'aria-expanded');
							this.toggleAttribute(section, 'aria-hidden');
						}
					}
				}
			}

		},

		/**
		 * Toggles the value of a boolean attribute of a DOM element
		 * (works for DOMElement and DOMElementWrapper objects).
		 */
		toggleAttribute: function(element, attribute) {
			var strValue = element.getAttribute(attribute);
			if (strValue) {
				var value = this.booleanValue(strValue);
				element.setAttribute(attribute, String(!value));
			}
		},

		/**
		 * Turns a key-value map into a query string, adding parameter result = json
		 */
		getQueryFromMap: function(paramMap, json) {
			if (typeof json === 'undefined') {
				json = true;
			}
			var paramString = new modules.view.merci.common.utils.StringBufferImpl();
			if (json) {
				paramString.append("result=json");
				var separator = "&";
			} else {
				var separator = "";
			}
			if (paramMap) {
				for (var paramName in paramMap) {
					if (paramMap.hasOwnProperty(paramName)) {
						paramString.append(separator);
						paramString.append(paramName);
						paramString.append("=");
						paramString.append(paramMap[paramName]);
						if (separator === "") {
							separator = "&";
						}
					}
				}

			}
			return paramString.toString();
		},

		/**
		 * Creates a common action call request with the given parameters or form, action and callback
		 */
		navigateRequest: function(dataSource, actionName, callback) {
			var request = {
				action: actionName,
				method: 'POST',
				expectedResponseType: 'json',
				cb: callback,
				loading: true
			};
			if (aria.utils.Type.isHTMLElement(dataSource)) {
				request.formObj = dataSource;
			} else {
				if (typeof dataSource == "string")
					request.parameters = dataSource;
				else if (typeof dataSource == "object")
					request.parameters = this.getQueryFromMap(dataSource);
			}
			return request;
		},

		/**
		 * Generic function to be used as a callback of an action call to navigate to another page.
		 * @return a boolean indicating if navigating to next page was possible
		 */
		navigateCallback: function(response, moduleCtrl, refreshCb) {
			var json = response.responseJSON;
			if (json && json.homePageId) {
				this.extendModuleData(moduleCtrl.getModuleData(), json.data);
				var currentPageId = aria.utils.HashManager.getHashString();
				if (currentPageId !== json.homePageId) {
					moduleCtrl.navigate(null, json.homePageId);
				} else if (refreshCb) {
					this.$callback(refreshCb);
				}
				return true;
			} else {
				return false;
			}
		},

		navigatePlainCallback: function(response, refreshCb) {
			var json = response.responseJSON;
			if (json && json.homePageId) {
				this.extendModuleData(jsonResponse.data, json.data);
				var currentPageId = aria.utils.HashManager.getHashString();
				if (currentPageId !== json.homePageId) {
					this.navigate(null, json.homePageId);
				}
				return true;
			} else {
				return false;
			}
		},

		/* page engine navigate */
		navigate: function(args, layout) {

			var boolReload = false;
			if (args != null) {
				boolReload = args.forceReload;
			}

			// navigate
			window.scrollTo(0, 0);
			application.navigate({
				pageId: layout,
				forceReload: boolReload
			});
		},

		/**
		 * Utility method to copy the data from back-end response to module controller data
		 * @param moduleData - module controller data
		 * @param jsonData - data to copy
		 */
		extendModuleData: function(moduleData, jsonData) {
			if (jsonData) {
				for (var dataField in jsonData) {
					if ((dataField === 'booking' || dataField === 'servicing') && moduleData[dataField]) {
						for (var subField in jsonData[dataField]) {
							moduleData[dataField][subField] = jsonData[dataField][subField];
						}
					} else {
						moduleData[dataField] = jsonData[dataField];
					}
				}
			}
		},

		/**
		 * General-use function to navigate to next page.
		 *  - Creates a navigate request from a form element or a map of parameters and an action name
		 *  - Creates an overlay over the body of the document
		 *  - Sends the created request
		 *  - Upon reception of the response, copy the json data into the module controller data of the given template
		 *  - Removes the overlay
		 *  - If the page id of the response is the same as the current page, refreshes the given template
		 *  - If not, navigates to the received page id.
		 *  @param dataSource the post data, either a map<name, value> of parameters or a form DOM element
		 *  @param action the name of the action to call (e.g. 'MWelcome.action')
		 *  @param template used to get the module controller and to be refreshed when page does not change
		 */
		sendNavigateRequest: function(dataSource, action, template, callback) {
			var request = this.navigateRequest(dataSource, action, {
				fn: this.__defaultCallback,
				scope: this,
				args: template
			});
			//modules.view.merci.common.utils.URLManager.makeServerRequest(request, aria.utils.Type.isHTMLElement(dataSource));
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, aria.utils.Type.isHTMLElement(dataSource), function(result) {
				// Error Callback received
				if (result && callback) {
					callback("ERROR - sendNavigateRequest");
				}
			});
		},

		__defaultCallback: function(response, template) {

			if (template == undefined || template.moduleCtrl == undefined) { // allows call from plain JS (non-AT)
				this.navigatePlainCallback(response, {
					fn: this.__refreshTemplate,
					scope: this,
					args: template
				});
			} else {
				this.navigateCallback(response, template.moduleCtrl, {
					fn: this.__refreshTemplate,
					scope: this,
					args: template
				});

			}
		},

		__refreshTemplate: function(nothing, template) {
			template.$dataReady();
			template.$refresh();
		},

		/**
		 * Creates a AT-compatible date format from a ETV-compatible one.
		 */
		getFormatFromEtvPattern: function(pattern) {

			var bracePos = pattern.lastIndexOf('}');

			// if '}' is not part of pattern abort the function
			// expected value for pattern in {abc, pqr, format}
			if (bracePos == -1) {
				return pattern;
			}

			var commaPos = pattern.indexOf(',', pattern.indexOf(',') + 1); //index of second comma

			// get format from string like {0,date, dd MMM}
			var format = pattern.substring(commaPos + 1, bracePos);
			return format;
		},

		formatDate: function(date, pattern) {
			var format = this.getFormatFromEtvPattern(pattern);
			var formattedDate = aria.utils.Date.format(date, format);

			// to handle trace = key [START] */
			if (pattern.indexOf('}') != -1 && (pattern.length - 1) > pattern.lastIndexOf('}')) {
				formattedDate += pattern.substring(pattern.lastIndexOf('}') + 1);
			}
			// to handle trace = key [ END ] */

			return formattedDate;
		},

		/**
		 * Replaces {\d} pattern with given arguments.
		 * For example:
		 *  formatString('{1}-{0}', 'str1', 'str2')
		 * will return:
		 *  'str2-str1'
		 */
		formatString: function(str) {
			var args = arguments;
			return str.replace(/{(\d+)}/g, function(match, number) {
				var n = Number(number) + 1;
				if (typeof args[n] != 'undefined') {

					// if number
					if (!isNaN(args[n]) && args[n] < 10 && args[n] > -10) {
						args[n] = '0' + args[n];
					}

					return args[n];
				}

				return match;
			});
		},

		/**
		 * Formats a duration in milliseconds using the given ETV pattern
		 */
		formatDuration: function(duration, pattern) {
			var durPattern = this.getFormatFromEtvPattern(pattern);
			var durFormat = durPattern.replace('%H', '{0}').replace('%M', '{1}');
			var jsDate = new Date(duration);

			// format date to get time in requested format
			var formattedTime = this.formatString(durFormat, jsDate.getUTCHours(), jsDate.getUTCMinutes());

			// to handle trace = key [START] */
			if ((pattern.length - 1) > pattern.lastIndexOf('}')) {
				formattedTime += pattern.substring(pattern.lastIndexOf('}') + 1);
			}
			// to handle trace = key [ END ] */

			return formattedTime;
		},

		/**
		 * Assembles the name elements for display
		 */
		formatName: function(paxType, title, firstName, lastName, showPaxType, labels) {
			var fmtName;
			if (title) {
				fmtName = this.formatString(labels.tx_pltg_pattern_TravellerNameWithTitle,
					title, firstName, lastName);
			} else {
				fmtName = this.formatString(labels.tx_pltg_pattern_TravellerName,
					firstName, lastName);
			}
			if ((showPaxType && labels.paxTypes.hasOwnProperty(paxType)) || paxType === 'CHD' || paxType === 'INF') {
				fmtName += ' (' + labels.paxTypes[paxType] + ')';
			}
			return fmtName;
		},

		/**
		 * Rounds a number to the given number of decimals
		 */
		roundNumber: function(num, dec) {
			var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
			return result;
		},

		/**
		 * Reads the LIST_MSG and creates an object readable by message macro lib
		 * @param beErrors the list of errors from LIST_MSG
		 * @param messages [optional] existing messages object to update. A new one is created if omitted.
		 * @return the created/updated object
		 */
		readBEErrors: function(beErrors, messages) {
			if (typeof messages === 'undefined') {
				messages = {};
			}
			if (!this.isEmptyObject(beErrors)) {
				for (var e = 0; e < beErrors.length; e++) {
					var msg = beErrors[e];
					if (msg.TYPE === 'F' || msg.TYPE === 'E') {
						if (!messages.errors) {
							messages.errors = {
								list: []
							};
						}
						messages.errors.list.push(msg);
					} else if (msg.TYPE === 'W') {
						if (!messages.warnings) {
							messages.warnings = {
								list: []
							};
						}
						messages.warnings.list.push(msg);
					} else if (msg.TYPE === 'I' || msg.TYPE === 'O') {
						if (!messages.infos) {
							messages.infos = {
								list: []
							};
						}
						messages.infos.list.push(msg);
					} else {
						if (!messages.errors) {
							messages.errors = {
								list: []
							};
						}
						messages.errors.list.push(msg);
					}
				}
			}
			return messages;
		},

		/**
		 * Converts an error bean to a LIST_MSG-like error
		 */
		convertErrorFromBean: function(err) {
			var error = {
				TYPE: err.severity,
				NUMBER: err.errorid,
				TEXT: err.localizedMessage
			};
			return error;
		},

		/**
		 * Creates an error object with the given error message
		 */
		createError: function(errMsg) {
			return {
				TYPE: 'E',
				TEXT: errMsg
			};
		},

		/**
		 * Converts a site parameter string value into a boolean
		 */
		booleanValue: function(value) {
			var b = false;
			if (value && typeof value === 'string') {
				var lvalue = value.toLowerCase();
				if (lvalue === 'true' || lvalue === 'yes' || lvalue === 'y') {
					b = true;
				}
			} else if (value && !this.isEmptyObject(value)) {
				b = true;
			}
			return b;
		},
		/**
		 * Generates callback for app param 1 : appprefix(sq:) param2: bookmark String
		 */
		appCallBack: function(appPrefix, bkMrkString) {
			window.location = appPrefix + bkMrkString;
		},

		resetPageInfo: function() {

			var rtlEL = document.getElementById('mRTL');
			var customRtlEL = document.getElementById('customMRTL');

			if (this.isRTLLanguage()) {
				if (rtlEL == null) {
					// add rtl css
					rtlEL = document.createElement("link");

					// set attribute
					rtlEL.setAttribute("id", "mRTL");
					rtlEL.setAttribute("type", "text/css");
					rtlEL.setAttribute("rel", "stylesheet");
					rtlEL.setAttribute("href", this.getRTLCssPath());

					// add to head
					document.getElementsByTagName("head")[0].appendChild(rtlEL);
				}

				if (customRtlEL == null) {

					// add rtl css
					customRtlEL = document.createElement("link");

					// set attribute
					customRtlEL.setAttribute("id", "customMRTL");
					customRtlEL.setAttribute("type", "text/css");
					customRtlEL.setAttribute("rel", "stylesheet");
					customRtlEL.setAttribute("href", this.getCustomRTLCssPath());

					// add to head
					document.getElementsByTagName("head")[0].appendChild(customRtlEL);
				}

				// MENU SWAP

				if (typeof showSideMenu != 'undefined' && showSideMenu.toLowerCase() != "false") {
					if (showSideMenu == 'LEFT') {
						showSideMenu = 'RIGHT';
						if ($('div#imDiv').length > 0) $('div#imDiv').removeClass("mcl").addClass("mcr");
					} else if (showSideMenu == 'RIGHT') {
						showSideMenu = 'LEFT';
						if ($('div#imDiv').length > 0) $('div#imDiv').removeClass("mcr").addClass("mcl");
					}
				}

			} else {
				// remove rtl css
				if (rtlEL != null) {
					document.getElementsByTagName("head")[0].removeChild(rtlEL);
					// reset menu if already swapped.
					if (typeof showSideMenu != 'undefined' && showSideMenu != false) {
						if (showSideMenu == 'LEFT') {
							showSideMenu = 'RIGHT';
							if ($('div#imDiv').length > 0) $('div#imDiv').removeClass("mcl").addClass("mcr");
						} else if (showSideMenu == 'RIGHT') {
							showSideMenu = 'LEFT';
							if ($('div#imDiv').length > 0) $('div#imDiv').removeClass("mcr").addClass("mcl");
						}
					}

				}

				// remove custom css
				if (customRtlEL != null) {
					document.getElementsByTagName("head")[0].removeChild(customRtlEL);
				}
				// changing the dir tag for the html when this is not rtl.
				document.getElementsByTagName("html")[0].setAttribute("dir", 'ltr');
			}

			var datePickerLang = document.getElementById('datePickeri18n');
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var currentLang = bp[12];

			if (currentLang != "GB") {
				if (datePickerLang == null) {
					// add jquery localisation file
					datePickerLang = document.createElement("script");

					// set attribute
					datePickerLang.setAttribute("id", "datePickeri18n");
					datePickerLang.setAttribute("type", "text/javascript");
					datePickerLang.setAttribute("src", this.getCustomJqueryPath(currentLang));

					// add to head
					document.getElementsByTagName("head")[0].appendChild(datePickerLang);

				}

			} else {
				if (datePickerLang != null) {
					document.getElementsByTagName("head")[0].removeChild(datePickerLang);
				}

			}

			// scroll to top
			window.scrollTo(0, 0);
		},

		getRTLCssPath: function() {
			// URL base parameters
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			return bp[0] + "://" + bp[1] + bp[10] + "/default/" + bp[9] + "/static/merciAT/modules/common/css/merci_rtl.css";
		},

		getCustomRTLCssPath: function() {
			// URL base parameters
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			return bp[0] + "://" + bp[1] + bp[10] + "/" + bp[4] + "/" + bp[5] + "/static/css/custom_merci_rtl.css";
		},

		isRTLLanguage: function() {
			var rtlLanguages = {
				HE: true,
				AR: true,
				SY: true,
				MV: true
			}
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			return rtlLanguages[bp[12]] != null;
		},

		getCustomJqueryPath: function(language) {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var jQueryPath = "";
			if (language == "BR")
				jQueryPath = "jquery.ui.datepicker-pt-BR.js";
			if (language == "CN")
				jQueryPath = "jquery.ui.datepicker-zh-CN.js";
			if (language == "DE")
				jQueryPath = "jquery.ui.datepicker-de.js";
			if (language == "ES")
				jQueryPath = "jquery.ui.datepicker-es.js";
			if (language == "FR")
				jQueryPath = "jquery.ui.datepicker-fr.js";
			if (language == "ID")
				jQueryPath = "jquery.ui.datepicker-id.js";
			if (language == "IS")
				jQueryPath = "jquery.ui.datepicker-is.js";
			if (language == "IT")
				jQueryPath = "jquery.ui.datepicker-it.js";
			if (language == "JP")
				jQueryPath = "jquery.ui.datepicker-ja.js";
			if (language == "NL")
				jQueryPath = "jquery.ui.datepicker-nl.js";
			if (language == "KO")
				jQueryPath = "jquery.ui.datepicker-ko.js";
			if (language == "RU")
				jQueryPath = "jquery.ui.datepicker-ru.js";
			if (language == "TH")
				jQueryPath = "jquery.ui.datepicker-th.js";
			if (language == "TR")
				jQueryPath = "jquery.ui.datepicker-tr.js";
			if (language == "TW")
				jQueryPath = "jquery.ui.datepicker-zh-TW.js";


			if (jQueryPath == "")
				jQueryPath = "jquery.ui.datepicker-en-GB.js";

			return bp[0] + "://" + bp[1] + bp[10] + "/default/" + bp[9] + "/static/merciAT/modules/common/js/" + jQueryPath;
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

		onInputFocus: function(event, args) {
			var delEL = document.getElementById('del' + args.id);
			if (delEL != null) {
				delEL.className += ' deletefocus';
			}
		},

		onInputBlur: function(event, args) {
			var delEL = document.getElementById('del' + args.id);
			if (delEL != null) {
				delEL.className = delEL.className.replace(/(?:^|\s)deletefocus(?!\S)/g, '');
			}
		},

		clearField: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				inputEL.value = '';
				delEL.className += ' hidden';
			}
		},

		/**
		 * use aria utility method to convert a number in currency format
		 * @param number float value represting amount
		 * @param fractionDigits number of digits to be shown after decimal
		 */
		printCurrency: function(number, fractionDigits) {

			var pattern = '#,###';
			if (fractionDigits > 0) {
				pattern += '.';
				for (var i = 0; i < fractionDigits; i++) {
					pattern += '0';
				}
			}
			if (typeof number == 'string') {
				number = parseFloat(number);
			}
			var number = number.toFixed(fractionDigits);
			return aria.utils.Number.formatCurrency(number, pattern, '');
		},

		/**
		 * this method is used to convert unicode to readable string
		 * @param value
		 */
		decodeSymbol: function(value) {

			// use regex to filter out pattern
			var r = /\\u([\d\w]{4})/gi;
			value = value.replace(r, function(match, grp) {
				return String.fromCharCode(parseInt(grp, 16));
			});

			// decode
			return unescape(value);
		},

		removeClass: function(element, className) {
			if (this.hasClass(element, className)) {
				var str = "(?:^|\\s)" + className + "(?!\\S)";
				var regEx = new RegExp(str, "g");
				element.className = element.className.replace(regEx, '');
			}
		},

		addClass: function(element, className) {
			if (element != null && element.className.indexOf(className) == -1) {
				element.className += " " + className;
			}
		},

		/**
		 * updates the class in body
		 * @param className name of class to be added
		 */
		updateBodyClass: function(className) {
			var bodies = document.getElementsByTagName('body');
			for (var i = 0; i < bodies.length; i++) {
				bodies[i].className = className;
			}
		},

		toggleClass: function(element, className) {
			if (this.hasClass(element, className)) {
				this.removeClass(element, className);
			} else {
				this.addClass(element, className);
			}
		},

		hasClass: function(element, className) {
			if (element == null) {
				return false;
			}

			var str = "(?:^|\\s)" + className + "(?!\\S)";
			var regEx = new RegExp(str, "g");
			return element.className.match(regEx);
		},

		getImgLinkURL: function(file) {
			// URL base parameters
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			return bp[0] + "://" + bp[1] + bp[10] + "/default/" + bp[9] + "/static/merciAT/modules/common/img/" + file;
		},

		createAutoCompleteCurrency: function(currList, showToolIcon, currArr) {
			var blockCurrency = null;
			if (currArr != undefined) {
				blockCurrency = currArr.split(",");
			}
			if (currList != undefined && currList != "" && showToolIcon != undefined && showToolIcon != false) {
				var items = [];
				$.each(currList, function(key, val) {
					if (!(blockCurrency != null && blockCurrency != "" && $.inArray(val[0], blockCurrency) != -1)) {
						items.push(val[1] + "(" + val[0] + ")");
					}
				});
				$("input#newCurrency").autocomplete({
					source: items,
					minLength: 1
				});
				if ((localStorage.getItem('orgCurrency') != null && localStorage.getItem('convCurrency') != null) && localStorage.getItem('orgCurrency') != localStorage.getItem('convCurrency')) {
					$('#currCurrency').text(localStorage.getItem('convCurrency'));
				}
			}
		},

		/* PTR PTR 07904749 [Medium]: AeRE V170 SP0 MERCI R15 PLL - date correction based on timezone change */
		getMonthInNo: function(mon) {
			mon = mon.toLowerCase();
			mon = mon.substring(0, 3);
			var no = ("janfebmaraprmayjunjulaugsepoctnovdec".indexOf(mon) / 3);
			return no;
		},

		isTabletDevice: function() {
			return aria.utils.Device.isTablet();
		},

		isGTMEnabled: function() {
			var isGoogleTagManagerEnabled = false;
			if (typeof isGTMEnabled != 'undefined' && isGTMEnabled) {
				isGoogleTagManagerEnabled = true;
			}
			return isGoogleTagManagerEnabled;
		},

		closeTabletPopup: function(id, cls) {
			/* PTR 08034718 */
			if (id == ".flightStatus.tablet" && $(cls).hasClass("selected")) {
				return;
			}

			if (id == ".panel.list.triplist.tablet" && document.querySelector(id) == null) {
				id = ".panel.addTrip.tablet.selected";
			}

			this.selectingTab(cls);

			$('span[id$="_tpls"]>span section.show').removeClass("show");
			$('.panel.list.triplist.tablet').removeClass("show");
			$('.panel.addTrip.tablet.selected').removeClass("show");
			$('span[id$="_searchPage"]> section.show').removeClass("show");
			this.toggleClass(document.querySelector(id), "show");
		},

		selectingTab: function(cls) {
			$('nav.navigation.tablet a').removeClass("selected");
			if (cls != undefined) {
				this.addClass(document.querySelector(cls), "selected");
			}
		},

		deleteServicesBookmark: function(recloc) {
			var that = this;
			var bookmarkedServices = [];
			var bookmarkJson = {};
			var result = jsonResponse.localStorage.DB_MYFAVOURITE || {};
			if (!that.isEmptyObject(result) && (result != 'undefined')) {
				bookmarkedServices = result['SERVICESCATALOG'] || [];
			}
			for (var i = 0; i < bookmarkedServices.length; i++) {
				if (bookmarkedServices[i].REC_LOC.toUpperCase() == recloc.toUpperCase()) {
					bookmarkedServices.splice(i, 1);
				}
			}
			bookmarkJson['SERVICESCATALOG'] = bookmarkedServices;
			this.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, bookmarkJson, 'overwrite', 'json');
		},
		/*
		 * Local storage allowed or not
		 * */
		isLocalStorageSupported: function() {
			var testKey = 'test',
				storage = window.localStorage;
			try {
				storage.setItem(testKey, '1');
				storage.removeItem(testKey);
				return true;
			} catch (error) {
				return false;
			}
		},
		displayBoardingPass: function(prodid) {

		},
		removePNR: function(prodid) {

		},
		/*
		 *For display original boarding pass in merci home page
		 * */
		displayBPHome: function(prodid) {
			jQuery("#showOriginalBP>span").after(localStorage[prodid + "-large"]);
			jQuery("#showOriginalBP").removeClass("displayNone").addClass("displayBlock");
			jQuery("#showOriginalBP").prev().removeClass("displayBlock").addClass("displayNone");
			jQuery("#showOriginalBP").next().removeClass("xWidget xPrintAdaptX xPrintAdaptY xBlock displayBlock").addClass("displayNone");
		},
		closeDsisplayBPHome: function() {
			jQuery("#showOriginalBP").html("<span class=\"CancelHomeBp\" onclick=\"modules.view.merci.common.utils.MCommonScript.closeDsisplayBPHome()\"></span>");
			jQuery("#showOriginalBP").removeClass("displayBlock").addClass("displayNone");
			jQuery("#showOriginalBP").prev().removeClass("displayNone").addClass("displayBlock");
			jQuery("#showOriginalBP").next().removeClass("displayNone").addClass("xWidget xPrintAdaptX xPrintAdaptY xBlock displayBlock");
		},
		getReplLabel: function(str) {
			return str.replace(/<\/strong>/g, "").replace(/<strong>/g, "");
		},

		//Utility Function to replace the character at a specific index in the string - Added as part of Ancillary Services CR 8240221
		setCharAt: function(str, index, character) {
			if (index > str.length - 1) return str;
			return str.substr(0, index) + character + str.substr(index + character.length);
		},

		checkForAppUpgrade: function(str_upgradeMessage, param_AppStoreLink, param_GooglePlayLink, param_iOSVersion, param_AndroidVersion, isIgnored, param_forceUpgradeiPhone, param_forceUpgradeAndroid, str_forceUpgradeMessage) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
			}
			// Depending on the device, a few examples are:
			//   - "Android"
			//   - "BlackBerry"
			//   - "iOS"
			//   - "WinCE"
			//   - "Tizen"

			var that = this;
			if (!isIgnored) {
				that.getAppVersion(function(result) {
					if (result && result.length > 0) {

						if (typeof(result) == "string") {
							appversion = parseFloat(result);
						} else {
							appversion = result;
						}


						if (devicePlatform == "iOS") {

							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - iOS:" + param_iOSVersion);
								if (typeof param_forceUpgradeiPhone != "undefined" && that.booleanValue(param_forceUpgradeiPhone)) {
									console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									isIgnored = false;
									that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
									alert(str_forceUpgradeMessage);
									window.location.assign(param_AppStoreLink);
								} else {

									if (confirm(str_upgradeMessage)) {
										// Save it!
										isIgnored = false;
										that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text")
										if (param_AppStoreLink && param_AppStoreLink.length > 0) {
											window.location.assign(param_AppStoreLink); //"itms://itunes.com/apps/appname"; //IOS_STORE_LINK
										}

									} else {
										isIgnored = true;
										// Do nothing!
										that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
									}

								}

							} else {
								console.log("App Upgrade alert not required");
							}

						} else if (devicePlatform == "Android") {

							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - Android:" + param_AndroidVersion);

								if (typeof param_forceUpgradeAndroid != "undefined" && that.booleanValue(param_forceUpgradeAndroid)) {
									console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									isIgnored = false;
									that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
									alert(str_forceUpgradeMessage);
									window.location.assign(param_GooglePlayLink);
								} else {
									if (confirm(str_upgradeMessage)) {
										// Save it!
										isIgnored = false;
										if (param_GooglePlayLink && param_GooglePlayLink.length > 0) {
											window.location.assign(param_GooglePlayLink); //"https://play.google.com/store/apps/details?id=com.amadeus.merci.client.ui" (https://play.google.com/store/apps/details?id=com.amadeus.merci.client.ui%27) ; // (https: //play.google.com/store/apps/details?id=com.amadeus.merci.client.ui%27) ; //ANDROID_STORE_LINK  ;
											that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
										}

									} else {
										// Do nothing!
										isIgnored = true;
										that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
									}
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
				if (devicePlatform == "iOS" && typeof param_forceUpgradeiPhone != "undefined" && that.booleanValue(param_forceUpgradeiPhone)) {
					that.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
								that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
								alert(str_forceUpgradeMessage);
								window.location.assign(param_AppStoreLink);
								that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else if (devicePlatform == "Android" && typeof param_forceUpgradeAndroid != "undefined" && that.booleanValue(param_forceUpgradeAndroid)) {
					that.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
								that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
								alert(str_forceUpgradeMessage);
								window.location.assign(param_GooglePlayLink);
								that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else {
					console.log("App upgrade prompt ignored.");
					that.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
				}
			}
		},

		/**
		 *	Function that returns the value of the GTM container used for GTM implementation
		 **/
		getGTMContainerValue: function() {
			var googleTagManagerContainer = "";
			if (typeof siteGTMContainerValue != 'undefined' && siteGTMContainerValue != null) {
				googleTagManagerContainer = siteGTMContainerValue;
			}
			return googleTagManagerContainer;
		},
		prepopulateHTML: function(fareFamily) {
			for (var i = 0; i < fareFamily.length; i++) {
				// $("#htmlPopup_"+(i+1)).html('<object data='+fareFamily[i].condition.url+'/>');
				if (fareFamily[i].condition && fareFamily[i].condition.url) {
					$("#htmlPopup_" + (i + 1)).html('<div id="scroller"><div class="dragger"></div><iframe src="' + fareFamily[i].condition.url + '" class="dynFrame"></iframe></div>');
				}
			}

		},
		openURLHTML: function(data) {
			if (data.isNewPopUpEnabled == true) {
				var popup = data.moduleCtrl.getJsonData({
					"key": "popup"
				});

				aria.utils.Json.setValue(popup, 'data', data);

				aria.utils.Json.setValue(popup, 'settings', {
					macro: "displayURLHTMLPopup"
				});

				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				this.storeFormData(null);
				data.moduleCtrl.navigate(null, 'Popup');
			} else {
				this.showMskOverlay(false);
				$("#htmlPopup").css("height", "500px");
				if (data.itinNo == null) {
					document.getElementById('htmlPopup').innerHTML = document.getElementById('htmlPopup_' + data.ffNo).innerHTML;
				} else {
					document.getElementById('htmlPopup').innerHTML = document.getElementById('htmlPopup_' + data.itinNo + '_' + data.ffNo).innerHTML;
				}
				document.getElementById('htmlContainer').style.display = 'block';
				this.myScroll = new iScroll('htmlPopup');
				window.scrollTo(0, 0);
			}
		},


		/** Method to add events in the calendar and then display the dialog overlay. Similar to addEventsToCalendar but takes the tpl reference as an additional argument **/
		addEventsToCalendarDispOverlay: function(calendarJson, pageObj) {
			calendarJson = JSON.stringify(calendarJson);
			//console.log("addEventsToCalendar : " + calendarJson);
			calendar.addToCalendar(function(successMessage) {
					pageObj.toggleCalendarAlert(pageObj, "added");
				},
				function(errorMessage) {
					//console.log("addEventsToCalendar failure "+ errorMessage);

				},
				calendarJson);

		},

		loadSwipeElements: function() {
			/* ////////////// Carrousel /////////// */

			mousePositionX = null;
			itemCounter = 0;
			is_clickedOn_list = -1;
			itemWidth = null;

			$(window).resize(function() {
				positionCarrousel($('.carrousel-full'));
				itemCounter = 0;
				lightSelectedUp();
				changeTitle();
			});

			$(document).on("mousemove", ".sectionDefaultstyle .carrousel-full", function(event) {
				mousePositionX = event.pageX;
			});

			positionCarrousel = function(which) {
				var containerWidth = which.width();
				itemWidth = which.children('ul').children('li').outerWidth(true) + 4; /*inline-block generates 4px invisible margin. To be checked in all browsers*/
				var position = (containerWidth / 2) - (itemWidth / 2);
				which.children('ul').css("left", position);
			}

			$(document).on("click", ".sectionDefaultstyle .carrousel-full li", function() {

				is_clickedOn_list = $(this).index();

			});

			$(document).on("click", ".sectionDefaultstyle .carrousel-full h1", function() {


				is_clickedOn_list = $('.carrousel-full-item.is-selected').parent('li').index();

			});

			moveCarrousel_left = function(which_ul) {
				(function() {
					itemCounter += 1;
					lightSelectedUp("left");
					changeTitle();
					which_ul.next('footer').find('li').eq(itemCounter - 1).removeClass('is-selected');
					which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
					which_ul.animate({
						left: '-=' + itemWidth + 'px'
					}, 250, function() {

					});
				}());

			}

			moveCarrousel_right = function(which_ul) {
				(function() {
					itemCounter -= 1;
					lightSelectedUp("right");
					changeTitle();
					which_ul.next('footer').find('li').eq(itemCounter + 1).removeClass('is-selected');
					which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
					which_ul.animate({
						left: '+=' + itemWidth + 'px'
					}, 250, function() {

					});
				}());

			}

			eventItem = "";
			lightSelectedUp = function(val) {

				$('.carrousel-full-item').attr(eventItem, "");

				if (val == undefined) {
					itemCounter = 0;
					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
				}

				$('.carrousel-full-item').removeClass('is-selected');
				$('.carrousel-full').children('ul').children('li').eq(itemCounter).find('.carrousel-full-item').addClass('is-selected');

				if (val == "left") {
					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
				} else if (val == "right") {
					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
				}

			}

			changeTitle = function() {

				var widthOfTitle;
				if ($('.carrousel-full-item.is-selected').parent('li').hasClass('multicity')) {
					widthOfTitle = '95%';
				} else if ($('.carrousel-full-item.is-selected').parent('li').hasClass('one-way')) {
					widthOfTitle = '50%';
				} else if ($('.carrousel-full-item.is-selected').parent('li').hasClass('boardingindex')) {
					widthOfTitle = '80%';
				} else {
					widthOfTitle = '60%';
				}

				var airportOrigin = $('.carrousel-full-item.is-selected').attr('data-airp-points');

				var titleComplete = airportOrigin;
				if (!hideBoardinglistheaderRtarro) {
					var titleComplete = airportOrigin + " " + "<a href='javascript:void(0)' class='more-info'></a>";
				}


				$('.carrousel-full').children('h1').attr(eventItem, jQuery("#listboxa .is-selected").attr("data-airp-list-onclick"));

				$('.carrousel-full').children('h1').animate({
					width: "30%",
					opacity: 0.25
				}, 400, function() {
					// Animation complete.
					$(this).html(titleComplete);
					$('.carrousel-full').children('h1').animate({
						width: widthOfTitle,
						opacity: 1
					}, 500, function() {
						// Animate;
					});
				});


			}

			/* ////////////// End Carrousel /////////// */
		},

		toggleMandatoryBorder: function(evt, args) {
			if (undefined != args.mandatory) {
				if (this.booleanValue(args.mandatory)) {
					var domElement = document.getElementById(args.id);
					if (domElement != null) {
						if (domElement.value == "" && domElement.className.indexOf("mandatory") == -1) {
							domElement.className = domElement.className.trim() + " mandatory";
						} else {
							if (domElement.className.indexOf("mandatory") != -1 && domElement.value != "") {
								var classy = domElement.className.replace(/\bmandatory\b/g, '');
								domElement.className = classy;
							}
						}
					}
				}
			} else {
				var domElement = document.getElementById(args.id);
				if (domElement != null) {
					if (domElement.value == "" && domElement.className.indexOf("mandatory") == -1) {
						domElement.className = domElement.className.trim() + " mandatory";
					} else {
						if (domElement.className.indexOf("mandatory") != -1 && domElement.value != "") {
							var classy = domElement.className.replace(/\bmandatory\b/g, '');
							domElement.className = classy;
						}
					}
				}
			}
		},

		prefillProfileInfo: function(globalList, rqstParams) {
			var chkBox = document.getElementById('cb-card-detail');
			if (chkBox != null) {
				if (chkBox.checked == true) {

					if (document.getElementById('AIR_CC_ADDRESS_FIRSTLINE') != null && !this.isEmptyObject(rqstParams.listAddressInformationLine1)) {
						document.getElementById('AIR_CC_ADDRESS_FIRSTLINE').value = rqstParams.listAddressInformationLine1;
					}
					if (document.getElementById('AIR_CC_ADDRESS_SECONDLINE') != null && !this.isEmptyObject(rqstParams.listAddressInformationLine2)) {
						document.getElementById('AIR_CC_ADDRESS_SECONDLINE').value = rqstParams.listAddressInformationLine2;
					}
					if (document.getElementById('AIR_CC_ADDRESS_CITY') != null && !this.isEmptyObject(rqstParams.listAddressInformationCity)) {
						document.getElementById('AIR_CC_ADDRESS_CITY').value = rqstParams.listAddressInformationCity;
					}
					if (document.getElementById('AIR_CC_ADDRESS_ZIPCODE') != null && !this.isEmptyObject(rqstParams.listAddressInformationPostalCode)) {
						document.getElementById('AIR_CC_ADDRESS_ZIPCODE').value = rqstParams.listAddressInformationPostalCode;
					}
					if (document.getElementById('AIR_CC_ADDRESS_STATE') != null && !this.isEmptyObject(rqstParams.listAddressInformationState)) {
						document.getElementById('AIR_CC_ADDRESS_STATE').value = rqstParams.listAddressInformationState;
					}

					// updating country
					for (var i = 0; i < globalList.slLangCountryList.length; i++) {
						var countryItem = globalList.slLangCountryList[i];
						if (countryItem[0] == rqstParams.listAddressInformationCountry) {
							if (document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT') != null) {
								document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT').value = countryItem[1];
							}
							if (document.getElementById('AIR_CC_ADDRESS_COUNTRY') != null) {
								document.getElementById('AIR_CC_ADDRESS_COUNTRY').value = countryItem[0];
							}

							break;
						}
					}

				} else {

					// setting all fields to empty
					if (document.getElementById('AIR_CC_ADDRESS_FIRSTLINE') != null) {
						if (!this.isEmptyObject(rqstParams.airCCAddressFirstLine)) {
							document.getElementById('AIR_CC_ADDRESS_FIRSTLINE').value = rqstParams.airCCAddressFirstLine;
						} else {
							document.getElementById('AIR_CC_ADDRESS_FIRSTLINE').value = '';
						}
					}
					if (document.getElementById('AIR_CC_ADDRESS_SECONDLINE') != null) {
						document.getElementById('AIR_CC_ADDRESS_SECONDLINE').value = '';
					}
					if (document.getElementById('AIR_CC_ADDRESS_CITY') != null) {
						if (!this.isEmptyObject(rqstParams.airCCAddressCity)) {
							document.getElementById('AIR_CC_ADDRESS_CITY').value = rqstParams.airCCAddressCity;
						} else {
							document.getElementById('AIR_CC_ADDRESS_CITY').value = '';
						}
					}
					if (document.getElementById('AIR_CC_ADDRESS_ZIPCODE') != null) {
						document.getElementById('AIR_CC_ADDRESS_ZIPCODE').value = '';
					}
					if (document.getElementById('AIR_CC_ADDRESS_STATE') != null) {
						document.getElementById('AIR_CC_ADDRESS_STATE').value = '';
					}
					if (document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT') != null) {
						document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT').value = '';
					}
					if (document.getElementById('AIR_CC_ADDRESS_COUNTRY') != null) {
						if (!this.isEmptyObject(rqstParams.airCCAddressCountry)) {
							for (var i = 0; i < globalList.slLangCountryList.length; i++) {
								var countryItem = globalList.slLangCountryList[i];
								if (countryItem[0] == rqstParams.airCCAddressCountry) {
									if (document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT') != null) {
										document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT').value = countryItem[1];
									}
									if (document.getElementById('AIR_CC_ADDRESS_COUNTRY') != null) {
										document.getElementById('AIR_CC_ADDRESS_COUNTRY').value = countryItem[0];
									}

									break;
								}
							}
						} else {
							document.getElementById('AIR_CC_ADDRESS_COUNTRY').value = '';
						}
					}
				}

				// setting value to hidden input tag
				if (document.getElementById('billingInfoChecked') != null) {
					document.getElementById('billingInfoChecked').value = (chkBox.checked + '').toUpperCase();
				}
			}
		},


		/*	START: PTR 09218617 [Medium]: MeRCI R21:CR8888159 Fare Range On Fare Review Page Coming on Same View CR 8888159	*/
		/**
		 * Method to loadURL in native browser. target-new attribute does not work for Cordova based applications.
		 * PARAM: external URL
		 */
		loadURLs: function(evt, url) {
			if (typeof navigator.app != "undefined") {
				// Supported by PhoneGap - Android
				navigator.app.loadUrl(url, {
					openExternal: true
				});
			} else {
				// Using inappbrowser PhoneGap plugin. Workaround for iOS
				window.open(url, '_system');
			}
		},


		setScroll: function(args) {
			var that = this;
			setTimeout(function() {
				if (args.length != 0) {
					var scrollerWidth = 100 * args.length;
					var liWidth = Math.round(1000 / args.length) / 10;
					document.getElementById(args.olScroll).style.width = scrollerWidth.toString() + "%";
					for (var panel = 0; panel < args.length; panel++) {
						document.getElementById(args.liScroll + panel).style.width = liWidth.toString() + "%";
					}
					var pageCtx = null;
					if(args.callingPageCtx != undefined){
						pageCtx = args.callingPageCtx;
					}
					that.myscroll = new iScroll(args.scrollId, {
						snap: true,
						hScrollbar: false,
						vScrollbar: false,
						vScroll: false,
						checkDOMChanges: true,
						momentum: false,
						onScrollEnd: function() {
							var setCrumb = {
								count: this.currPageX,
								id: args.id,
								pageCtx: pageCtx
							};
							that.$callback({
								fn: that.shiftCrumb,
								scope: that
							}, setCrumb);
						},
						onBeforeScrollStart: function(e) {

							this.point = e;
							if (e.touches != null && e.touches.length > 0) {
								this.point = e.touches[0];
							}

							this.pointStartX = this.point.pageX;
							this.pointStartY = this.point.pageY;
							null;
						},
						onBeforeScrollMove: function(e) {
							this.deltaX = Math.abs(this.point.pageX - this.pointStartX);
							this.deltaY = Math.abs(this.point.pageY - this.pointStartY);
							if (this.deltaX > this.deltaY) {
								e.preventDefault();
							} else {
								null;
							}
						}
					});
				}
			}, 10);
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
			if(setCrumb.pageCtx != null){
				setCrumb.pageCtx.selectedCrumb = setCrumb.count;
			}		
		},
		/* END: PTR 09218617 [Medium]: MeRCI R21:CR8888159 Fare Range On Fare Review Page Coming on Same View CR 8888159 */

		/* BEGIN: PTR 09259197 [Medium]: MeRCI R21  CR 8888159:  Retrieve PNR error --> need to scroll up to view error CR 8888159 */
		/* Scroll window to the top */
		scrollUp: function() {
			window.scroll(0, 0);
		},
		/*END: PTR 09259197 [Medium]: MeRCI R21  CR 8888159:  Retrieve PNR error --> need to scroll up to view error CR 8888159 */

		changeLanguage: function(event, args) {
			
			var selCountry = "";
			var country = "";
			var selectedCountry = args.selectedCountry;
			var selectedLang = args.selectedLang;

			var params = "SELECTLANGUAGE=" + selectedLang + "&COUNTRY=" + selectedCountry + "&LANGUAGE=" + selectedLang + "&COUNTRY_SITE=" + country + "&result=json";
			if (args.paramsLogin) {
				params = params + args.paramsLogin;
			}

			var request = {
				parameters: params,
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__OnMCLangCallback,
					args: args,
					scope: this
				}
			}

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			// set request data
			request.isCompleteURL = true;
			request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + bp[4] + "/MCLang.action;jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + bp[11];
			
			//*******************************************************************************************/
			// reset jsonResponse data for nav bar 
			// ugly way to access JSON data, should be fixed with a more modular way
			if (jsonResponse != null 
				&& jsonResponse.data != null 
				&& jsonResponse.data.booking != null 
				&& jsonResponse.data.booking.Mindex_A != null) {
				jsonResponse.data.booking.Mindex_A.globalList.customButtons = null;
			}
			//*******************************************************************************************/

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__OnMCLangCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.homePageId != 'merci-book-MWELC_A') {
				// if success

				var langEL = document.getElementById("language");
				var selectedLang = langEL.options[langEL.selectedIndex].value;

				// set locale for aria templates
				this.resetPageInfo();
				aria.core.environment.Environment.setLanguage(application.getLocale({language: selectedLang}), null);
				var decimal = ".";
				var grouping = ",";
				if (application.getLocale({language: selectedLang}) == 'is_IS') {
					decimal = ",";
					grouping = ".";
				}
				aria.core.AppEnvironment.setEnvironment({
					defaultWidgetLibs: {
						"aria": "aria.widgets.AriaLib",
						"embed": "aria.embed.EmbedLib",
						"html": "aria.html.HtmlLibrary"
					},
					"decimalFormatSymbols": {
						decimalSeparator: decimal,
						groupingSeparator: grouping,
						strictGrouping: false
					}
				});

				// refresh template to re-create side nav bar
				if (jsonResponse.ui == null) {
					jsonResponse.ui = {};
				}
				aria.utils.Json.setValue(jsonResponse.ui, 'navbarFlag', !jsonResponse.ui.navbarFlag);

				this.navigateCallback(response, inputParams.moduleCtrl);
			} else {

				var jsonForErrors = inputParams.moduleCtrl.getModuleData().booking.MWELC_A;
				for (var key in response.responseJSON.data.booking.MWELC_A.requestParam.reqAttrib) {
					this.__addErrorMessage(jsonForErrors.errors[key].localizedMessage + " (" + jsonForErrors.errors[key].errorid + ")");
				}

				// reset variable
				aria.utils.Json.setValue(this.data, 'error_msg', true);
			}
		}
	}
});