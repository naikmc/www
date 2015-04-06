Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.search.MCustomSearchScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		pageObj = this;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		var dateParam, addPax;

		this.includeCustomScript(this.moduleCtrl.getModuleData().booking.Mindex_A.config.customSearchScriptPath);
	},

	$prototype: {

		__createAutocompleteSource: function(listItem, locations, itemVal, webStore, appStore) {
			var autoCompleteSource = [];
			if (siteParam.allowSmartDropDown == 'FALSE') {
				for (var i = 0; i < listItem.length; i++) {
					for (var j = 0; j < locations.length; j++) {
						if (listItem[i][0] == locations[j].locationCode) {
							if ((webStore || appStore) && null != itemVal && $.inArray(listItem[i][0], itemVal) != -1) {
								autoCompleteSource.unshift(listItem[i][1]);
							} else {
								autoCompleteSource.push(listItem[i][1]);
							}
						}
					}
				}
			} else {
				for (var key in listItem.routes['out']) {
					autoCompleteSource.push(listItem.labels[key]);
				}
			}

			return autoCompleteSource;
		},

		__createAwardAutoComplete: function(data, retainSrch, localJson, webStore, appStore) {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var items = new Array();

			/* create array for autocomplete */
			$.each(data, function(key, val) {
				$.each(val, function(code, names) {
					if ((webStore || appStore) && null != localJson && $.inArray(names[0], localJson) != -1) {
						items.unshift(names[1]);
					} else {
						items.push(names[1]);
					}
				}); /* end of $.each on data */
			}); /* end of $.each on val */

			return items;
		},

		__createAutoCompleteInput: function() {
			var sourceListBegin = "";
			var sourceListEnd = "";
			var keyPadDismiss = document.getElementById('keyPadDismiss');
			/* var globalList = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.globalList;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var DepJson = "";

			if (localStorage != null) {
				DepJson = localStorage.getItem('DepJson');
			}

			if (DepJson != null) {
				DepJson = JSON.parse(DepJson);
			}

			var storeWebSrchValue = false;
			var storeAppSrchValue = false;
			if (siteParam.siteRetainSearch == "TRUE" && (null == bp[14] || bp[14] == "")) {
				storeWebSrchValue = true;
			} else if (siteParam.siteRetainSearch == "TRUE" && (null != bp[14] && bp[14] != "") && requestParam.retainAppCriteria == "TRUE") {
				storeAppSrchValue = true;
			}

			if (storeAppSrchValue) {
				var depAppJson = $('#app_json_data').val();
				if (depAppJson != undefined && "" != depAppJson) {
					var temp = JSON.parse(depAppJson);
					if (null != temp && null != temp.DepJson && "undefined" != temp.DepJson) {
						DepJson = temp.DepJson;
						var test = DepJson.split(",");
						DepJson = test;
					}
				}
			}

			var autoCompleteMinLength = 1;
			if (siteParam.siteAutoCompleteMinLength != null) {
				try {
					autoCompleteMinLength = parseInt(siteParam.siteAutoCompleteMinLength);
				} catch (err) {
					autoCompleteMinLength = 1;
				}
			}

			if (siteParam.airportListA == 'TRUE' && siteParam.airportListD == 'TRUE') {
				if (siteParam.allowSmartDropDown == 'FALSE') {
					sourceListBegin = this.__createAutocompleteSource(globalList.airportList, requestParam.beginLocations, DepJson, storeWebSrchValue, storeAppSrchValue);
					sourceListEnd = this.__createAutocompleteSource(globalList.airportList, requestParam.endLocations, null, false, false);
					$("#E_LOCATION_1").autocomplete({
						source: sourceListEnd,
						minLength: autoCompleteMinLength
					});
				} else {
					sourceListBegin = this.__createAutocompleteSource(this.getSmarDropDownJson());
				}

				$("#B_LOCATION_1").autocomplete({
					source: sourceListBegin,
					minLength: autoCompleteMinLength,
					select: function(event, ui) {
						if (siteParam.allowSmartDropDown == 'TRUE') {
							var selectedAirportName = ui.item.value.split("(");
							var selectedAirportCode = selectedAirportName[1].split(")");
							if (selectedAirportCode[0].length != 3) {
								selectedAirportCode[0] = selectedAirportCode[0].substring(selectedAirportCode[0].length - 3, selectedAirportCode[0].length);
							}

							var destSmartList = pageObj.smartSelect(selectedAirportCode[0]);
							$("#E_LOCATION_1").autocomplete({
								source: destSmartList,
								minLength: autoCompleteMinLength
							});
						}

						if (storeAppSrchValue || storeWebSrchValue) {
							var name = ui.item.value.split("(");
							var code = name[1].split(")");
							if (code[0].length != 3) {
								code[0] = code[0].substring(code[0].length - 3, code[0].length);
							}

							if (storeAppSrchValue) {
								window.location = siteParam.siteAppCallback + "://?flow=searchpage/fromAirport=" + code[0];
							} else if (storeWebSrchValue) {
								var entry = window.localStorage.getItem("From:" + code[0]);
								if (entry != null) {
									pageObj.setSearchCriteria(entry);
								}
							}
						}

						if (keyPadDismiss != null) {
							keyPadDismiss.focus();
						}
					},

					open: function() {
						$(".ui-autocomplete").css('z-index', 999);
						$(".ui-autocomplete").css("width", $(this).outerWidth());
					},
					close: function() {
						$(".ui-autocomplete").css('zIndex', 0);
					}
				}).focus(function() {
					$(this).autocomplete("search");
				}).data("autocomplete")._renderItem = function(ul, item) {
					var listItem = $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
					var reccCode = pageObj.__fetchCode(item.value);
					if (null != DepJson && $.inArray(reccCode, DepJson) != -1 && (storeWebSrchValue || storeAppSrchValue)) {
						listItem.addClass("nameSelected fave");
					}

					return listItem;
				};
			} else {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var autoCompleteURL = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + bp[4] + "/Override.action?UI_EMBEDDED_TRANSACTION=MLocationLookupSearchPopUpAuto&SITE=" + bp[11] + "&LANGUAGE=" + bp[12] + "&SO_SITE_MC_GOTO_UIREV_FLOW=FALSE";
				$("input#B_LOCATION_1").autocomplete({
					source: function(request, response) {
						$.ajax({
							type: "POST",
							url: autoCompleteURL,
							dataType: "text/plain",
							data: {
								MATCH: $("#B_LOCATION_1").val()
							},

							success: function(data, textStatus, jqXHR) {
								console.log("success");
							},

							error: function(data, textStatus, jqXHR) {
								if (data != null) {
									var tdata = data.responseText.split(",");
									for (var i = 0; i < tdata.length - 1; i++) {
										var x = tdata[i].split("(");
										var tempdata = x[1].split(")");
										if ($("#B_LOCATION_1").val().toLowerCase() == tempdata[0].toLowerCase()) {
											var k = tdata[i];
											tdata.unshift(k);
											tdata.splice(i + 1, 1);
										}
									}

									response(tdata);
								}

								console.log("Error thrown..!!");
							}
						});
					},

					minLength: autoCompleteMinLength,
					select: function(event, ui) {
						var bLocation = document.getElementById('B_LOCATION_1');
						bLocation.applyFilter = true;

						if (storeAppSrchValue || storeWebSrchValue) {
							var name = ui.item.value.split("(");
							var code = name[1].split(")");
							if (code[0].length != 3) {
								code[0] = code[0].substring(code[0].length - 3, code[0].length);
							}

							if (storeWebSrchValue) {
								var entry = window.localStorage.getItem("From:" + code[0]);
								if (entry != null) {
									pageObj.setSearchCriteria(entry);
								}
							}
						}

						if (keyPadDismiss != null) {
							keyPadDismiss.focus();
						}
					}
				}).data("autocomplete")._renderItem = function(ul, item) {
					var listItem = $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
					var reccCode = pageObj.__fetchCode(item.value);
					if (null != DepJson && $.inArray(reccCode, DepJson) != -1 && (storeWebSrchValue || storeAppSrchValue)) {
						listItem.addClass("nameSelected fave");
					}

					return listItem;
				};

				$("input#E_LOCATION_1").autocomplete({
					source: function(request, response) {
						$.ajax({
							type: "POST",
							url: autoCompleteURL,
							dataType: "text/plain",
							data: {
								MATCH: $("#E_LOCATION_1").val()
							},

							success: function(data, textStatus, jqXHR) {
								console.log("success");
							},

							error: function(data, textStatus, jqXHR) {
								if (data != null) {
									var tdata = data.responseText.split(",");
									for (var i = 0; i < tdata.length - 1; i++) {
										var x = tdata[i].split("(");
										var tempdata = x[1].split(")");
										if ($("#E_LOCATION_1").val().toLowerCase() == tempdata[0].toLowerCase()) {
											var k = tdata[i];
											tdata.unshift(k);
											tdata.splice(i + 1, 1);
										}
									}

									response(tdata);
								}
							}
						});
					},

					minLength: autoCompleteMinLength,
					select: function(event, ui) {
						var eLocation = document.getElementById('E_LOCATION_1');
						eLocation.applyFilter = true;
						if (keyPadDismiss != null) {
							keyPadDismiss.focus();
						}
					}
				});
			}

			/* if awards flow is enabled */
			if (siteParam.allowMCAwards == 'TRUE' && ((requestParam.enableDirectLogin == 'YES' && requestParam.flow == 'DEALS_AND_OFFER_FLOW') || siteParam.allowGuestAward == 'TRUE')) {
				/* create URL to fetch airport list */
				var value = siteParam.siteMCAwrdSite.split('-');
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var autoCompleteURL = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + value[0] + "/GlobalList.action?SITE=" + value[1] + "&LANGUAGE=" + bp[12] + "&RES=SL_SITE_LANGUAGE_AIRPORT_DESCRIPTION";

				/* get JSONArray as airport list */
				$.getJSON(autoCompleteURL, function(data) {
					var awrdBeginList = pageObj.__createAwardAutoComplete(data, siteParam.siteRetainSearch, DepJson, storeWebSrchValue, storeAppSrchValue);
					var awrdEndList = pageObj.__createAwardAutoComplete(data, siteParam.siteRetainSearch, null, false, false);
					$("input#A_LOCATION_1").autocomplete({
						minLength: autoCompleteMinLength,
						source: awrdBeginList,
						select: function(event, ui) {
							var aLocation = document.getElementById('A_LOCATION_1');
							var cLocation = document.getElementById('C_LOCATION_1');
							if (aLocation != null && cLocation != null) {
								cLocation.value = "";
								aLocation.applyFilter = true;
							}

							if (storeAppSrchValue || storeWebSrchValue) {
								var name = ui.item.value.split("(");
								var code = name[1].split(")");
								if (code[0].length != 3) {
									code[0] = code[0].substring(code[0].length - 3, code[0].length);
								}

								if (storeAppSrchValue) {
									window.location = siteParam.siteAppCallback + "://?flow=searchpage/fromAirport=" + code[0];
								} else if (storeWebSrchValue) {
									var entry = window.localStorage.getItem("From:" + code[0]);
									if (entry != null) {
										pageObj.setSearchCriteria(entry);
									}
								}
							}

							if (keyPadDismiss != null) {
								keyPadDismiss.focus();
							}
						},

						open: function() {
							$(".ui-autocomplete").css('z-index', 999);
							$(".ui-autocomplete").css("width", $(this).outerWidth());
						},

						close: function() {
							$(".ui-autocomplete").css('zIndex', 0);
						}
					}).data("autocomplete")._renderItem = function(ul, item) {
						var listItem = $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
						var reccCode = pageObj.__fetchCode(item.value);
						if (null != DepJson && $.inArray(reccCode, DepJson) != -1 && (storeAppSrchValue || storeWebSrchValue)) {
							listItem.addClass("nameSelected fave");
						}

						return listItem;
					};

					$("input#C_LOCATION_1").autocomplete({
						minLength: autoCompleteMinLength,
						source: awrdEndList,
						select: function(event, ui) {
							var aLocation = document.getElementById('A_LOCATION_1');
							var cLocation = document.getElementById('C_LOCATION_1');
							if (aLocation != null && cLocation != null) {
								cLocation.applyFilter = true;
							}

							if (keyPadDismiss != null) {
								keyPadDismiss.focus();
							}
						},

						open: function() {
							$(".ui-autocomplete").css('z-index', 999);
							$(".ui-autocomplete").css("width", $(this).outerWidth());
						},

						close: function() {
							$(".ui-autocomplete").css('zIndex', 0);
						}
					});
				}); /* end of $.getJSON */
			}
		},

		__prepopulateBLocation: function() {
			/* select B_LOCATION_1 input box for value manipulation */
			var bLocation = document.getElementById('B_LOCATION_1');
			if (bLocation != null) {
				/* get data from storage */
				var countrySiteEl = document.getElementById('country_site');
				var bLocationData = this.__merciFunc.getStoredItem('B_LOCATION_1');
				var countrySiteData = this.__merciFunc.getStoredItem('Country_Site');

				/* if in storage */
				if (bLocationData != null && bLocationData != '' && countrySiteEl.value == countrySiteData) {
					bLocation.value = bLocationData;
				} else {
					var json = this.getSmarDropDownJson();
					if (json.labels[siteParam.siteDefaultAirport] != null) {
						bLocation.value = json.labels[siteParam.siteDefaultAirport];
					}
				}
			}
		},

		openHTML: function(args, data) {
			/* calling common method to open HTML page popup */
			this.moduleCtrl.openHTML(args, data);
		},

		closePopup: function(args, data) {
			/* calling common method to close popup */
			this.moduleCtrl.closePopup();
		},

		_disableAwards: function(args, data) {
			var onOffSwitch = document.getElementById('myonoffswitch');
			if (onOffSwitch != null) {
				/* reset switch */
				onOffSwitch.checked = false;

				/* reset infant field */
				var infantField = document.getElementById('FIELD_INFANTS_NUMBER');
				if (infantField != null) {
					/* set in local storage */
					var infantFldValue = '';
					if (this.__merciFunc.supports_local_storage()) {
						infantFldValue = localStorage.getItem('INFANTS');
					}

					infantField.value = infantFldValue;
					infantField.removeAttribute('disabled');
				}

				var bLocation = document.getElementById('B_LOCATION_1');
				var eLocation = document.getElementById('E_LOCATION_1');
				var aLocation = document.getElementById('A_LOCATION_1');
				var cLocation = document.getElementById('C_LOCATION_1');
				var delALocation = document.getElementById('delA_LOCATION_1');
				var delCLocation = document.getElementById('delC_LOCATION_1');
				var awrdFlowHidden = document.getElementById('AWARDS_FLOW');

				if (aLocation != null && bLocation != null) {
					aLocation.className = ' hidden';
					bLocation.value = aLocation.value;
					aLocation.value = '';
					bLocation.className = bLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}

				/* cross icons */
				if (delALocation != null) {
					delALocation.className += ' hidden';
					this.showCross(null, {
						id: 'B_LOCATION_1'
					});
				}

				if (cLocation != null && eLocation != null) {
					cLocation.className = ' hidden';
					eLocation.value = cLocation.value;
					cLocation.value = '';
					eLocation.className = eLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}

				/* cross icons */
				if (delCLocation != null) {
					delCLocation.className += ' hidden';
					this.showCross(null, {
						id: 'E_LOCATION_1'
					});
				}
			}

			if (awrdFlowHidden != null) {
				awrdFlowHidden.value = "FALSE";
			}
		},

		closeAwardsPopup: function(event, args) {
			this._disableAwards();

			/* hide popup */
			this.moduleCtrl.hideMskOverlay();
			var popupEl = document.getElementById('dialog-login');
			if (popupEl != null) {
				popupEl.style.display = 'none';
			}
		},

		_enableAwards: function() {
			/* reset infant field */
			var infantField = document.getElementById('FIELD_INFANTS_NUMBER');
			if (infantField != null) {
				/* set in local storage */
				if (this.__merciFunc.supports_local_storage()) {
					localStorage.setItem('INFANTS', infantField.value);
				}

				infantField.value = 0;
				infantField.setAttribute('disabled', 'disabled');
			}

			var bLocation = document.getElementById('B_LOCATION_1');
			var eLocation = document.getElementById('E_LOCATION_1');
			var aLocation = document.getElementById('A_LOCATION_1');
			var cLocation = document.getElementById('C_LOCATION_1');
			var delBLocation = document.getElementById('delB_LOCATION_1');
			var delELocation = document.getElementById('delE_LOCATION_1');
			var awrdFlowHidden = document.getElementById('AWARDS_FLOW');

			/* input field */
			if (aLocation != null && bLocation != null) {
				bLocation.className = ' hidden';
				aLocation.value = bLocation.value;
				bLocation.value = '';
				aLocation.className = aLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			/* cross icons */
			if (delBLocation != null) {
				delBLocation.className += ' hidden';
				this.showCross(null, {
					id: 'A_LOCATION_1'
				});
			}

			/* input fields */
			if (cLocation != null && eLocation != null) {
				eLocation.className = ' hidden';
				cLocation.value = eLocation.value;
				eLocation.value = '';
				cLocation.className = cLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			/* cross icons */
			if (delELocation != null) {
				delELocation.className += ' hidden';
				this.showCross(null, {
					id: 'C_LOCATION_1'
				});
			}

			if (awrdFlowHidden != null) {
				awrdFlowHidden.value = "TRUE";
			}
		},

		openAwardsConfPopup: function(args, data) {
			var onOffSwitch = document.getElementById('myonoffswitch');

			if (onOffSwitch != null) {
				if (onOffSwitch.checked == true) {
					/* set awards flow */
					this._enableAwards();
				} else {
					/* i.e. no is selected on UI */
					this.closeAwardsPopup(args, data);
				}

				if (requestParam.request.client == null || requestParam.request.client == '') {
					/* if button is selected as 'YES' and user is not logged in */
					if (onOffSwitch.checked == true && requestParam.enableDirectLogin != 'YES') {
						/* show overlay */
						this.moduleCtrl.showMskOverlay();

						/* display popup */
						var popupEl = document.getElementById('dialog-login');
						if (popupEl != null) {
							popupEl.style.display = 'block';
						}
					}
				} else {
					window.location = siteParam.siteAppCallback + "://?flow=searchpage/redeemmile=" + onOffSwitch.checked;
				}
			}
		},

		$dataReady: function() {
			/* if search page data is not available */
			/* if (this.moduleCtrl.getModuleData().booking == null || this.moduleCtrl.getModuleData().booking.MCSMSRCH_A == null) {
				var flow = this.moduleCtrl.getValuefromStorage('FLOW');
				var country_site = this.moduleCtrl.getValuefromStorage('COUNTRY_SITE');
				var params = 'result=json&COUNTRY_SITE=' + country_site;
				var actionName = 'MSearch.action';
				var defParams = true;

				if (flow == 'APICKER-FLOW') {
					var airport = getValuefromStorage('SLCTD_AIRPORT')
					var element = this.moduleCtrl.getValuefromStorage('element');
					params = 'result=json&' + element + '=' + airport;
					actionName = 'MGlobalDispatcher.action'
				}

				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					expectedResponseType: 'json',
					defaultParams: defParams,
					cb: {
						fn: this.__onBookFlightCallback,
						args: params,
						scope: this
					}
				};

				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else{ */
			/* set errors */
			this.data.errors = requestParam.reply.listMsg;
			this.printUI = true;


			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			/* var siteParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */

			/* google analytics */
			this.__ga.trackPage({
				domain: siteParam.siteGADomain,
				account: siteParam.siteGAAccount,
				gaEnabled: siteParam.siteGAEnable,
				page: ((this._isDealsFlow()) ? 'Fare Deals Search' : '1-AirSearch') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParam.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: ((this._isDealsFlow()) ? 'Fare Deals Search' : '1-AirSearch') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParam.siteOfficeID + '&wt_sitecode=' + base[11]
			});

			/* for access by other templates */
			this.moduleCtrl.bookingTemplate = this;
		},

		$displayReady: function() {
			/* setting autocomplete if UI is ready to be printed. This will be set only after callback received with data */
			if (this.printUI == true) {
				var base = modules.view.merci.common.utils.URLManager.getBaseParams();
				/* var labels = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.labels;
				var siteParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam;
				var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam; */
				dateParam = siteParam.showNewDatePicker;
				addPax = siteParam.allowAddPax;

				/* create autocomplete text box */
				if (requestParam.flow != 'DEALS_AND_OFFER_FLOW') {
					this.__createAutoCompleteInput();
				}

				/* if not from add pax page */
				if (!this.data.isAddPaxNav) {
					/* prepopulate B_LOCATION */
					this.__prepopulateBLocation();

					/* if already logged in */
					if (!this.__merciFunc.isEmptyObject(requestParam.enableDirectLogin) && requestParam.enableDirectLogin.toUpperCase() == 'YES') {
						var onOffSwitch = document.getElementById('myonoffswitch');
						if (onOffSwitch != null) {
							/* reset switch */
							onOffSwitch.checked = true;
							this.openAwardsConfPopup(null, null);
						}
					}
				}

				if (requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
					var cabinValue = '';
					var cabin = document.getElementById("CABIN_CLASS");
					var dealsCabinClass = requestParam.selectedOfferBean.cabinClass;

					if (dealsCabinClass == 'Y' || dealsCabinClass == 'E' || dealsCabinClass == 'N' || dealsCabinClass == 'R') {
						cabinValue = 'Y'
					} else if (dealsCabinClass == 'J' || dealsCabinClass == 'B') {
						cabinValue = 'J'
					} else if (dealsCabinClass == 'P' || dealsCabinClass == 'F') {
						cabinValue = 'P'
					}

					for (i = 0; i < cabin.length; i++) {
						if (cabin.options[i].value == cabinValue) {
							cabin.options[i].selected = true;
						}
					}

					cabin.setAttribute("disabled", "disabled");

					var m_Cabin = document.createElement('input');
					m_Cabin.type = 'hidden';
					m_Cabin.name = 'CABIN_CLASS';
					m_Cabin.value = dealsCabinClass;
					document.searchForm.appendChild(m_Cabin);
				} else {
					this.updateDepartureDate();
				}

				this.initPage();

				/* display cross if text in input box */
				this.showCross(null, {
					id: 'B_LOCATION_1'
				});
				this.showCross(null, {
					id: 'E_LOCATION_1'
				});

				/* reset */
				if (this.data.isAddPaxNav) {
					this.data.isAddPaxNav = false;
				}

				/* PTR - 07577835  start */
				if (this.__merciFunc.booleanValue(siteParam.siteCustomJS) && jsonResponse.custJSLoaded != true) {
					var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
					var custJSFile = bp[0] + "://" + bp[1] + bp[10] + "/" + bp[4] + "/" + bp[5] + "/static/css/MCUSTOMSRCHARIA_script.js";
					var custJS;
					custJS = document.createElement("script");

					/* set attribute */
					custJS.setAttribute("type", "text/javascript");
					custJS.setAttribute("src", custJSFile);

					/* add to head */
					document.getElementsByTagName("head")[0].appendChild(custJS);
					jsonResponse.custJSLoaded = true;
				}
				/* PTR - 07577835  end */
			}

			/* change class for body element */
			var bodies = document.getElementsByTagName('body');
			for (var i = 0; i < bodies.length; i++) {
				bodies[i].className = 'booking sear';
			}

			$('.ui-datepicker-trigger').click(function() {
				$('.search').hide();
				$('#ui-datepicker-div').show();
				$('.banner').addClass('hideThis');
			})

			$.datepicker._gotoTodayOriginal = $.datepicker._gotoToday;
			$.datepicker._gotoToday = function() {
				$(".ui-datepicker-current").click(function() {
					$('.search').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				});
			};
		},

		$viewReady: function() {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14] != "") {
				this.__merciFunc.appCallBack(siteParam.siteAppCallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MCustomSearch",
						data:this.data
					});
			}
		},

		initPage: function() {
			var showNewDtPicker = siteParam.showNewDatePicker;
			this.initDate();
			if (showNewDtPicker == 'TRUE') {
				var a = $('.ui-datepicker-trigger')[0];
				$(a).attr("id", "depdate");
				var defaultDay1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
				var defaultMonth1 = $.datepicker.formatDate('M', $("#datePickF").datepicker('getDate'));
				var defaultYear1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
				var defaultmonthinNo1 = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
				$("#depdate").html("<time>" + defaultMonth1 + " " + defaultDay1 + " , " + defaultYear1 + "</time>");
				$("#depdate").attr("monindex", defaultmonthinNo1 + defaultYear1);
				$("#depdate").attr("day1", defaultDay1)
				var b = $('.ui-datepicker-trigger')[1];
				$(b).attr("id", "retdate");
				var defaultDay2 = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
				var defaultMonth2 = $.datepicker.formatDate('M', $("#datePickT").datepicker('getDate'));
				var defaultYear2 = $.datepicker.formatDate('yy', $("#datePickT").datepicker('getDate'));
				var defaultmonthinNo2 = $.datepicker.formatDate('mm', $("#datePickT").datepicker('getDate'));
				$("#retdate").html("<time>" + defaultMonth2 + " " + defaultDay2 + " , " + defaultYear2 + "</time>");
				$("#retdate").attr("monindex", defaultmonthinNo2 + defaultYear2);
				$("#retdate").attr("day2", defaultDay2);
			}
		},

		initDate: function() {
			var showNewDtPicker = siteParam.showNewDatePicker;
			var depOffsetDate = siteParam.departureUIOffsetDate;
			var retOffsetDate = siteParam.returnDayRange;
			var siteEnableCalMonth = siteParam.siteEnableCalMonth;
			var siteAppCallback = siteParam.siteAppCallback;
			/* var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam; */

			var buttonImgOnly = false;
			if (showNewDtPicker != 'TRUE') {
				buttonImgOnly = true;
			}

			var minimDateForCal = 0;
			var maximDateForCal = "+364D";
			var defaultDepCal = +0;
			var defaultRetCal = +364;

			/* if (this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
				var strtDate = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam.selectedOfferBean.travelStart.split(" ");
				//var dealStrt = new Date(strtDate[0]);
				var dealStrtSplit = strtDate[0].split("-");
				var dealStrt = new Date(dealStrtSplit[0] + "/" + dealStrtSplit[1] + "/" + dealStrtSplit[2]);
				var currentDate = new Date();
				var endDate = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam.selectedOfferBean.travelEnd.split(" ");
				var dealEndSplit = endDate[0].split("-");
				//var dealEnd = new Date(endDate[0]);
				if(dealStrt > currentDate) {
					minimumDate = dealStrtSplit[0] + "/" + dealStrtSplit[1] + "/" + dealStrtSplit[2];
					minimDateForCal = dealStrtSplit[0] + "-" + dealStrtSplit[1] + "-" + dealStrtSplit[2];
				} else{
					minimumDate = currentDate.getFullYear() + "/" + currentDate.getMonth() + "/" + currentDate.getDate();
					minimDateForCal = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
				}

				maximDate = dealEndSplit[0] + "/" + dealEndSplit[1] + "/" + dealEndSplit[2];
				maximDateForCal = dealEndSplit[0] + "-" + dealEndSplit[1] + "-" + dealEndSplit[2];
			} */

			$('#datePickF').datepicker({
				showOn: "button",
				buttonImage: modules.view.merci.common.utils.MCommonScript.getImgLinkURL("calTrans.png"),
				buttonImageOnly: buttonImgOnly,
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: minimDateForCal,
				maxDate: maximDateForCal,
				defaultDate: defaultDepCal,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				beforeShow: function() {
					if (siteEnableCalMonth != null && siteEnableCalMonth.toLowerCase() == 'true' && requestParam.request.client != null && requestParam.request.client != '') {
						var value = '';
						var dayEL = document.getElementById('day1');
						var monthEL = document.getElementById('month1');
						if (dayEL != null && monthEL != null) {
							/* monthEL = parseInt(monthEL.value) + 1; */
							value = monthEL.value + dayEL.value;

							window.location = siteAppCallback + "://?flow=searchpage/calendar_month=" + value + "&Month1";
							setTimeout(function() {
								$('#datePickF').datepicker('hide');
							}, 0);
						}
					}
				},

				onSelect: function() {
					var day1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
					if (showNewDtPicker != 'TRUE') {
						if (parseInt(day1) < 10) {
							day1 = day1.substring(1, 2);
						}

						var month1 = $.datepicker.formatDate('yymm', $("#datePickF").datepicker('getDate'));
						$("#day1 option[value=" + day1 + "]").attr('selected', 'selected');
						$("#month1>option[value=" + (month1 - 1) + "]").attr('selected', 'selected');
						pageObj.updateDepartureDate();
						var returnDate = $("#datePickF").datepicker('getDate');
						var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
						$("#datePickT").datepicker('setDate', offSetDate);
					} else {
						var month1 = $.datepicker.formatDate('M', $("#datePickF").datepicker('getDate'));
						var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
						var monthinNo = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
						var yearMonth = $.datepicker.formatDate('yymm', $("#datePickF").datepicker('getDate'));
						$("#depdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
						var returnDate = $("#datePickF").datepicker('getDate');
						var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
						$("#datePickT").datepicker('setDate', offSetDate);
						var monthRet = $.datepicker.formatDate('M', $("#datePickT").datepicker('getDate'));
						var yearRet = $.datepicker.formatDate('yy', $("#datePickT").datepicker('getDate'));
						$("#retdate").html("<time>" + monthRet + " " + offSetDate.getDate() + " , " + yearRet + "</time>");
						var depdayId = document.getElementById("day1");
						var depmonthId = document.getElementById("month1");
						depdayId.value = day1;
						depmonthId.value = yearMonth - 1;
						var retdayId = document.getElementById("day2");
						var retmonthId = document.getElementById("month2");
						retdayId.value = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
						retmonthId.value = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate')) - 1;
					}

					$('.search').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				},

				onClose: function() {
					$('.search').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				}
			});

			$('#datePickT').datepicker({
				showOn: "button",
				buttonImage: modules.view.merci.common.utils.MCommonScript.getImgLinkURL("calTrans.png"),
				buttonImageOnly: buttonImgOnly,
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: minimDateForCal,
				maxDate: maximDateForCal,
				defaultDate: defaultRetCal,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				beforeShow: function() {
					if (siteEnableCalMonth != null && siteEnableCalMonth.toLowerCase() == 'true' && requestParam.request.client != null && requestParam.request.client != '') {
						var value = '';
						var dayEL = document.getElementById('day2');
						var monthEL = document.getElementById('month2');
						if (dayEL != null && monthEL != null) {
							/* monthEL = parseInt(monthEL.value) + 1; */
							value = monthEL.value + dayEL.value;

							window.location = siteAppCallback + "://?flow=searchpage/calendar_month=" + value + "&Month2";
							setTimeout(function() {
								$('#datePickT').datepicker('hide');
							}, 0);
						}
					}
				},

				onSelect: function() {
					var day2 = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
					if (showNewDtPicker != 'TRUE') {
						if (parseInt(day2) < 10) {
							day2 = day2.substring(1, 2);
						}
						var month2 = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate'));
						$("#day2 option[value=" + day2 + "]").attr('selected', 'selected');
						$("#month2>option[value=" + (month2 - 1) + "]").attr('selected', 'selected');
					} else {
						var month2 = $.datepicker.formatDate('M', $("#datePickT").datepicker('getDate'));
						var year2 = $.datepicker.formatDate('yy', $("#datePickT").datepicker('getDate'));
						var monthinNo = $.datepicker.formatDate('mm', $("#datePickT").datepicker('getDate'));
						var yearMonth = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate'));
						$("#retdate").html("<time>" + month2 + " " + day2 + " , " + year2 + "</time>");
						$("#retdate").attr("monindex", monthinNo + year2);
						$("#retdate").attr("day2", day2);
						var dayId = document.getElementById("day2");
						var monthId = document.getElementById("month2");
						dayId.value = day2;
						monthId.value = yearMonth - 1;
					}

					$('.search').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				},

				onClose: function() {
					$('.search').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				}
			});

			var retDt = null;
			var storedDay1 = null;
			var storedDay2 = null;
			var storedMonth1 = null;
			var storedMonth2 = null;

			if (!this.data.isAddPaxNav) {
				storedDay1 = this.__merciFunc.getStoredItem('day1');
				storedDay2 = this.__merciFunc.getStoredItem('day2');
				storedMonth1 = this.__merciFunc.getStoredItem('month1');
				storedMonth2 = this.__merciFunc.getStoredItem('month2');
			} else {
				storedDay1 = this.data.Day1;
				storedDay2 = this.data.Day2;
				storedMonth1 = this.data.Month1;
				storedMonth2 = this.data.Month2;
			}

			if ($("#retdate").val() == null && $("#depdate").val() == null) {
				if (storedDay1 != null && storedMonth1 != null) {
					var offSetDate = new Date((parseInt(storedMonth1.substring(4, 6)) + 1) + "/" + storedDay1 + "/" + storedMonth1.substring(0, 4));
				} else {
					var todayDate = new Date();
					var offSetDate = new Date(todayDate.setDate(todayDate.getDate() + parseInt(depOffsetDate)));
				}

				$("#datePickF").datepicker('setDate', offSetDate);

				if (storedDay2 != null && storedMonth2 != null) {
					var retDt = new Date((parseInt(storedMonth2.substring(4, 6)) + 1) + "/" + storedDay2 + "/" + storedMonth2.substring(0, 4));
				} else {
					var retDt = new Date(offSetDate.setDate(offSetDate.getDate() + parseInt(retOffsetDate)));
				}

				$("#datePickT").datepicker('setDate', retDt);
			}

			if (requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
				var dealEnd = null;
				var dealStrt = null;
				var strtDate = requestParam.selectedOfferBean.travelStart.split(" ");
				var endDate = requestParam.selectedOfferBean.travelEnd.split(" ");

				if (storedDay1 != null && storedMonth1 != null) {
					dealStrt = new Date((parseInt(storedMonth1.substring(4, 6)) + 1) + "/" + storedDay1 + "/" + storedMonth1.substring(0, 4));;
				} else {
					dealStrt = new Date(strtDate[0]);
				}

				if (storedDay2 != null && storedMonth2 != null) {
					dealEnd = new Date((parseInt(storedMonth2.substring(4, 6)) + 1) + "/" + storedDay2 + "/" + storedMonth2.substring(0, 4));
				} else {
					dealEnd = new Date(endDate[0]);
				}

				if (dealStrt > new Date()) {
					$("#datePickF").datepicker('setDate', dealStrt);
				} else {
					$("#datePickF").datepicker('setDate', new Date());
				}

				$("#datePickT").datepicker('setDate', dealEnd);
			}

			if (showNewDtPicker == 'TRUE') {
				var depdayId = document.getElementById("day1");
				var depmonthId = document.getElementById("month1");
				depdayId.value = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));;
				depmonthId.value = $.datepicker.formatDate('yymm', $("#datePickF").datepicker('getDate')) - 1;
				var retdayId = document.getElementById("day2");
				var retmonthId = document.getElementById("month2");
				retdayId.value = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
				retmonthId.value = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate')) - 1;
			}
		},

		smartSelect: function(selectedDest) {
			var destExpandedList = new Array();
			var smartContent = this.getSmarDropDownJson();
			var selctSmartDest = selectedDest.toUpperCase();
			var destinations = smartContent.routes['out'][selctSmartDest];

			if (destinations != null) {
				for (var i = 0; i < destinations.length; i++) {
					destExpandedList[i] = smartContent.labels[destinations[i]];
				}

				return destExpandedList;
			} else {
				return [];
			}
		},

		setSearchCriteria: function(entry) {
			var setDt1 = new Date();
			var setDt2 = new Date();
			var today = new Date();

			entry = JSON.parse(entry);
			document.getElementById('E_LOCATION_1').value = entry.to;
			if ((document.getElementById('C_LOCATION_1') != null)) {
				document.getElementById('C_LOCATION_1').value = entry.to;
			}

			$("#CABIN_CLASS option[value='" + entry.cabin + "']").attr('selected', true);
			if (document.getElementById('DATE_RANGE_VALUE_1') != null) {
				document.getElementById('DATE_RANGE_VALUE_1').checked = (entry.flexi == true) ? true : false;
			}

			if (addPax == 'TRUE') {
				pageObj.setPaxDetails(entry);
				if (entry.chd != '' && entry.chd != '0') $('#paxTypeChild').removeClass('hidden');
				else $('#paxTypeChild').addClass('hidden');
				if (entry.inf != '' && entry.inf != '0') $('#paxTypeInfant').removeClass('hidden');
				else $('#paxTypeInfant').addClass('hidden');
				if (entry.stu != '' && entry.stu != '0') $('#paxTypeStudent').removeClass('hidden');
				else $('#paxTypeStudent').addClass('hidden');
				if (entry.ycd != '' && entry.ycd != '0') $('#paxTypeSenior').removeClass('hidden');
				else $('#paxTypeSenior').addClass('hidden');
				if (entry.yth != '' && entry.yth != '0') $('#paxTypeYouth').removeClass('hidden');
				else $('#paxTypeYouth').addClass('hidden');
				if (entry.mil != '' && entry.mil != '0') $('#paxTypeMilitary').removeClass('hidden');
				else $('#paxTypeMilitary').addClass('hidden');
			} else {
				pageObj.setPaxDetails(entry);
			}

			document.getElementById(entry.trip_type).checked = true;
			pageObj.toggleReturnJourney();
			setDt1.setFullYear(entry.dep_date.substring(0, 4), entry.dep_date.substring(4, 6), entry.dep_date.substring(6, entry.dep_date.length));
			setDt2.setFullYear(entry.ret_date.substring(0, 4), entry.ret_date.substring(4, 6), entry.ret_date.substring(6, entry.ret_date.length));

			if (dateParam != "TRUE") {
				pageObj.setDatesOld(setDt1, 'day1', 'month1', entry.dep_date, today);
				pageObj.setDatesOld(setDt2, 'day2', 'month2', entry.ret_date, today);
			} else {
				pageObj.setDatesNew(setDt1, 'day1', 'month1', 'datePickF', today, 'depdate');
				pageObj.setDatesNew(setDt2, 'day2', 'month2', 'datePickT', today, 'retdate');
			}
		},

		setPaxDetails: function(entry) {
			$("#FIELD_ADT_NUMBER option[value='" + entry.adt + "']").attr('selected', true);
			$("#FIELD_CHD_NUMBER option[value='" + entry.chd + "']").attr('selected', true);
			$("#FIELD_INFANTS_NUMBER option[value='" + entry.inf + "']").attr('selected', true);
			$("#FIELD_STU_NUMBER option[value='" + entry.stu + "']").attr('selected', true);
			$("#FIELD_YCD_NUMBER option[value='" + entry.ycd + "']").attr('selected', true);
			$("#FIELD_YTH_NUMBER option[value='" + entry.yth + "']").attr('selected', true);
			$("#FIELD_MIL_NUMBER option[value='" + entry.mil + "']").attr('selected', true);
		},

		setDatesOld: function(setDt, day, month, dt, today) {
			if (setDt > today) {
				$("#" + day + " option[value='" + dt.substring(6, dt.length) + "']").attr('selected', true);
				$("#" + month + " option[value='" + dt.substring(0, 6) + "']").attr('selected', true);
			} else {
				$("#" + day + " option[value='" + today.getDate() + "']").attr('selected', true);
				var m1 = today.getMonth();
				if (m1 < 10) {
					m1 = "0" + m1;
				}
				$("#" + month + " option[value='" + today.getFullYear() + "" + m1 + "']").attr('selected', true);
			}
		},

		setDatesNew: function(setDt, day, month, picker, today, route) {
			var depdayId = document.getElementById(day);
			var depmonthId = document.getElementById(month);
			if (setDt > today) {
				$("#" + picker).datepicker('setDate', setDt);
			} else {
				$("#" + picker).datepicker('setDate', new Date());
			}

			depdayId.value = $.datepicker.formatDate('dd', $("#" + picker).datepicker('getDate'));;
			depmonthId.value = $.datepicker.formatDate('yymm', $("#" + picker).datepicker('getDate')) - 1;
			var month1 = $.datepicker.formatDate('M', $("#" + picker).datepicker('getDate'));
			var year1 = $.datepicker.formatDate('yy', $("#" + picker).datepicker('getDate'));
			$("#" + route).html("<time>" + month1 + " " + depdayId.value + " , " + year1 + "</time>");
		},

		/* touchHandler: function(event) {
	var currentRightPaddingString=window.getComputedStyle(document.getElementsByClassName("onoffswitch-switch")[0]).getPropertyValue('right');
	var currentRightPadding=parseInt(currentRightPaddingString.substring(0,currentRightPaddingString.indexOf('px')));
	if(event.type=="swipemove" && !(currentRightPadding<0) )
	{

						var offset=event.detail.startX-event.detail.currentX;
						var LeftMarigin;
						if(offset<24 && offset>0)
								{
								LeftMarigin=-(offset*2.5)+"%";
								document.getElementsByClassName('onoffswitch-inner')[0].style.marginLeft=LeftMarigin;
								document.getElementsByClassName('onoffswitch-switch')[0].style.right=offset+7;
								}

					  else if(offset<0 && offset>-25)
								{

								var newRightPadding=currentRightPadding+offset-7;
								if(!(newRightPadding<0))
									{
									var currentLeftMargin=window.getComputedStyle(document.getElementsByClassName("onoffswitch-inner")[0]).getPropertyValue('margin-left');
									var newLeftMargin=parseInt(currentLeftMargin.substring(0,currentLeftMargin.indexOf('px')))-(offset*2.5);
									LeftMarigin=newLeftMargin+"%";
									document.getElementsByClassName('onoffswitch-inner')[0].style.marginLeft=LeftMarigin;
									document.getElementsByClassName('onoffswitch-switch')[0].style.right=newRightPadding;
									}
								}

						else if(offset>21)
								{
								LeftMarigin=-(100)+"%";
								document.getElementsByClassName('onoffswitch-inner')[0].style.marginLeft=LeftMarigin;
								document.getElementsByClassName('onoffswitch-switch')[0].style.right=46;
								document.getElementById("myonoffswitch").checked=false;

								}

						else if(offset<-25)
								{
								document.getElementsByClassName('onoffswitch-inner')[0].style.marginLeft=0;
								document.getElementsByClassName('onoffswitch-switch')[0].style.right=0;
								document.getElementById("myonoffswitch").checked=true;
								this.openAwardsConfPopup();
								}
	}

	else if(!(currentRightPadding<0) )
	{
					if(event.clientX<154)
							{
							var percnt=-(100)+"%";
							$("div.onoffswitch-inner").css({"margin-left":percnt});
							$('div.onoffswitch-switch').css("right",46);
							document.getElementById("myonoffswitch").checked=false;
							}

						else if(event.clientX>154)
							{
							$("div.onoffswitch-inner").css({"margin-left":0});
							$('div.onoffswitch-switch').css("right",0);
							document.getElementById("myonoffswitch").checked=true;

							}

	}


	},*/

		onAirportSelector: function(a, input) {
			var inputfield = input.ID;
			this.moduleCtrl.setValueforStorage(inputfield, 'inputfield');
			this.moduleCtrl.navigate(null, 'merci-book-MAIRPS_A');
		},

		onFareCondClick: function() {
			var oId = this.__merciFunc.getStoredItem('OID');
			var cSite = this.__merciFunc.getStoredItem('countrySite');
			var params = 'result=json&offer_id=' + oId + '&COUNTRY_SITE=' + cSite;
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
				/* getting next page id */
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					/* setting data for next page */
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;
					/* navigate to next page */
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		onDateSelection: function(event, args) {
			this.updateDepartureDate();
			this.onDayMonthChange(event, args);
		},

		updateDepartureDate: function() {
			var day1 = document.getElementById('day1');
			var month1 = document.getElementById('month1');
			var day2 = document.getElementById('day2');
			var month2 = document.getElementById('month2');

			if (day1 != null && month1 != null && day2 != null && month2 != null) {
				var depUIOffset = siteParam.returnDayRange;
				if (depUIOffset != null) {
					try {
						depUIOffset = parseInt(depUIOffset);
					} catch (err) {
						depUIOffset = 0;
					}
				} else {
					depUIOffset = 0;
				}

				var year = month1.value.substring(0, 4);
				var month = month1.value.substring(4, 6);

				var dt = new Date(year, month, day1.value, 0, 0, 0, 0);
				dt.setDate(dt.getDate() + depUIOffset);

				day2.value = dt.getDate();
				var monthValue = dt.getMonth();
				if (monthValue < 10) {
					month2.value = dt.getFullYear() + "0" + monthValue;
				} else {
					month2.value = dt.getFullYear() + "" + monthValue;
				}
			}
		},

		toggleReturnJourney: function() {
			var radio = document.getElementById("oneWay");
			var retJourney = document.getElementById('retJourney');
			if (radio.checked) {
				retJourney.style.display = 'none';
			} else {
				retJourney.style.display = 'block';
			}
		},

		onSearchClick: function(ATarg, args) {
			/* reset error */
			this.data.errors = new Array();

			var bLocation = document.getElementById('B_LOCATION_1');
			var eLocation = document.getElementById('E_LOCATION_1');

			/* var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */

			var onOffSwitch = document.getElementById('myonoffswitch');
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			/* copy values */
			this.__swapValues();
			/* local storage */
			this.storeSearchPageValues();

			var isSubmit = true;
			if (requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
				isSubmit = this.__validateDealParams();
			}

			isSubmit = this.__validateBounds(bLocation, eLocation);
			isSubmit = this.__validateMinLength(bLocation, eLocation);
			if (requestParam.flow != 'DEALS_AND_OFFER_FLOW') {
				isSubmit = this.__validateDepArrList(bLocation, eLocation, bp[14], requestParam, siteParam);
			}

			isSubmit = this.__validateTotalPax(siteParam.numOfTrav);
			isSubmit = this.validateAdtInfant();
			if (onOffSwitch != null && onOffSwitch.checked == true && siteParam.allowMCAwards == 'TRUE' && ((requestParam.enableDirectLogin == 'YES' && requestParam.flow == 'DEALS_AND_OFFER_FLOW') || siteParam.allowGuestAward == 'TRUE')) {
				isSubmit = this.__validateAwrdNomiees(requestParam.adtNominee, requestParam.chdNominee);
			}

			if (isSubmit) {
				this.__validateSearchParams();

				var request = {
					formObj: document.getElementById('searchForm'),
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__onAvailabilityCallBack,
						scope: this
					}
				}

				if (siteParam.allowMCAwards == 'TRUE' && ((requestParam.enableDirectLogin == 'YES' && requestParam.flow == 'DEALS_AND_OFFER_FLOW') || siteParam.allowGuestAward == 'TRUE')) {
					var value = ['-', '-'];
					if (onOffSwitch != null && onOffSwitch.checked == true && siteParam.siteMCAwrdSite != null && siteParam.siteMCAwrdSite != '') {
						value = siteParam.siteMCAwrdSite.split('-');
					} else {
						if (siteParam.siteMCRevenueSite != null && siteParam.siteMCRevenueSite != '') {
							value = siteParam.siteMCRevenueSite.split('-');
						}
					}

					/* set request data */
					request.isCompleteURL = true;
					request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + value[0] + "/" + args.action + ";jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + value[1] + "&LANGUAGE=" + bp[12];

					/* COUNTRY_SITE */
					if (bp[13] != null && bp[13] != '') {
						request.action += "&COUNTRY_SITE=" + bp[13];
					}

					/* CLIENT */
					if (bp[14] != null && bp[14] != '') {
						request.action += "&client=" + bp[14];
					}
				} else {
					/* if awards is not enabled */
					request.action = args.action;
				}

				/* start an Ajax request */
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			} else {
				window.scrollTo(0, 0);
				aria.utils.Json.setValue(this.data, 'error_msg', true);
			}
		},

		__onAvailabilityCallBack: function(response, inputParams) {
			/* getting next page id */
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

			/* if booking data is available */
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null && dataId != 'MCSMSRCH_A') {
				/* will be null in case page already navigated */
				if (this.moduleCtrl != null) {
					/* setting data for next page */
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;

					/* navigate to next page */
					this.moduleCtrl.navigate(null, nextPage);
				}
			} else {
				/* displaying error on UI if any from BE */
				if (!this.__merciFunc.isEmptyObject(response.responseJSON.data.booking.Mindex_A.requestParam.reply.listMsg)) {
					/* scroll to top */
					window.scrollTo(0, 0);

					/* set errors and refresh */
					this.data.errors = response.responseJSON.data.booking.Mindex_A.requestParam.reply.listMsg;
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},

		__resetInput: function(inputId) {
			var result = "";
			if (document.getElementById(inputId) != null) {
				if (document.getElementById(inputId).value.indexOf('(') != -1 && document.getElementById(inputId).value.indexOf(')') != -1) {
					var b = document.getElementById(inputId).value.split("(");
					var c = b[1];
					var d = c.split(")");
					if (d[0].length != 3) {
						result = d[0].substring(d[0].length - 3, d[0].length);
					} else {
						result = d[0];
					}
				} else if (document.getElementById(inputId).value.length == 3) {
					result = document.getElementById(inputId).value;
				}
			}

			result = result.toUpperCase();
			return result;
		},

		__fetchCode: function(inputVal) {
			var result = "";
			if (inputVal.indexOf('(') != -1 && inputVal.indexOf(')') != -1) {
				var b = inputVal.split("(");
				var c = b[1];
				var d = c.split(")");
				if (d[0].length != 3) {
					result = d[0].substring(d[0].length - 3, d[0].length);
				} else {
					result = d[0];
				}
			}

			return result;
		},

		/**
		 * for awards flow we have A_LOCATION_1 and C_LOCATION_1 acting as OnWard and Return,
		 * this function will copy value from A_LOCATION_1 to B_LOCATION_1 and from
		 * C_LOCATION_1 to E_LOCATION_1 so that proper request can be created
		 */
		__swapValues: function() {
			var bLocation = document.getElementById('B_LOCATION_1');
			var aLocation = document.getElementById('A_LOCATION_1');
			var eLocation = document.getElementById('E_LOCATION_1');
			var cLocation = document.getElementById('C_LOCATION_1');

			if (bLocation != null) {
				bLocation.value = this.__resetInput('B_LOCATION_1');
				if (bLocation.value == '' && aLocation != null) {
					bLocation.value = this.__resetInput('A_LOCATION_1');
					aLocation.value = bLocation.value;
				}
			}

			if (eLocation != null) {
				eLocation.value = this.__resetInput('E_LOCATION_1');
				if (eLocation.value == '' && cLocation != null) {
					eLocation.value = this.__resetInput('C_LOCATION_1');
					cLocation.value = eLocation.value;
				}
			}
		},

		__validateSearchParams: function() {
			if (document.getElementById('COMMERCIAL_FARE_FAMILY_1')) {
				var cabinValue = $('#COMMERCIAL_FARE_FAMILY_1 option:selected').text();
			} else {
				var cabinValue = $('#CABIN_CLASS option:selected').text();
			}

			document.getElementById("CABIN_CLASS_SELECTED").value = cabinValue;

			var tripTypeValue = "";
			if (document.getElementById("roundTrip") != null) {
				var radio = document.getElementById("roundTrip");
				if (radio.checked) {
					tripTypeValue = 'R';
				}
			}

			if (document.getElementById("oneWay") != null) {
				var radio = document.getElementById("oneWay");
				if (radio.checked) {
					tripTypeValue = 'O';
				}
			}

			var tripTypeEL = document.getElementById('TRIP_TYPE');
			if (tripTypeEL == null) {
				tripTypeEL = document.createElement('input');
				tripTypeEL.type = 'hidden';
				tripTypeEL.id = 'TRIP_TYPE';
				tripTypeEL.name = 'TRIP_TYPE';
				tripTypeEL.value = tripTypeValue;
				document.searchForm.appendChild(tripTypeEL);
			} else {
				tripTypeEL.value = tripTypeValue;
			}

			var srchToAvailEL = document.getElementById('SEARCHTOAVAIL_PAGE');
			if (document.getElementById('DATE_RANGE_VALUE_1') != null && document.getElementById('DATE_RANGE_VALUE_1').checked == true) {
				document.getElementById('DATE_RANGE_VALUE_1').value = siteParam.dateRangeChkboxValue;
				document.getElementById('DATE_RANGE_VALUE_SUB').value = document.getElementById('DATE_RANGE_VALUE_1').value;
				document.getElementById('DATE_RANGE_VALUE_2').value = document.getElementById('DATE_RANGE_VALUE_1').value;

				if (srchToAvailEL != null) {
					srchToAvailEL.value = false;
				}
			} else {
				if (srchToAvailEL != null) {
					srchToAvailEL.value = true;
				}
			}

			var addPax = siteParam.allowAddPax;
			if (addPax == 'TRUE') {
				if (document.getElementById("paxTypeAdult").className.indexOf('hidden') != -1) {
					document.getElementById("FIELD_ADT_NUMBER").removeAttribute("name");
				}
			}
		},

		__validateBounds: function(bLocation, eLocation) {
			bLocationVal = this.__resetInput('B_LOCATION_1');
			eLocationVal = this.__resetInput('E_LOCATION_1');
			var validateString = 'true';
			if (bLocation != null) {
				bLocationVal.replace(' ', '');
				validateString = this.__isString(bLocationVal)
				if (bLocationVal == '' || validateString == 'false') {
					this.__addErrorMessage(errorStrings[2130258].localizedMessage);
				}
			}

			if (eLocation != null) {
				eLocationVal.replace(' ', '');
				validateString = this.__isString(eLocationVal)
				if (eLocationVal == '' || validateString == 'false') {
					this.__addErrorMessage(errorStrings[2130259].localizedMessage);
				}
			}

			if (this.data.errors.length != 0) {
				return false;
			}

			return true;
		},

		__isString: function(textObj) {
			var txtVal = textObj;
			var len = txtVal.length;
			var result = "true";
			for (var i = 0; i < len; i++) {
				if ((txtVal.charAt(i) < 'A' || txtVal.charAt(i) > 'Z') && (txtVal.charAt(i) < 'a' || txtVal.charAt(i) > 'z')) {
					result = "false";
				}
			}

			return result;
		},

		__validateMinLength: function(bLocation, eLocation) {
			bLocationVal = this.__resetInput('B_LOCATION_1');
			eLocationVal = this.__resetInput('E_LOCATION_1');
			if (bLocation != null) {
				bLocationVal.replace(' ', '');
				if (bLocationVal.length > 0 && bLocationVal.length < 3) {
					this.__addErrorMessage(errorStrings[2130186].localizedMessage);
				}
			}

			if (eLocation != null) {
				eLocationVal.replace(' ', '');
				if (eLocationVal.length > 0 && eLocationVal.length < 3) {
					this.__addErrorMessage(errorStrings[2130188].localizedMessage);
				}
			}

			/* if no error return true */
			return this.data.errors.length == 0;
		},

		__validateDepArrList: function(bLocation, eLocation, client, rqstParams, siteParameters) {
			var storeWebSrchValue = false;
			var storeAppSrchValue = false;
			if (siteParameters.siteRetainSearch == "TRUE" && (null == client || client == "")) {
				storeWebSrchValue = true;
			} else if (siteParameters.siteRetainSearch == "TRUE" && null != client && client != "" && rqstParams.retainAppCriteria == "TRUE") {
				storeAppSrchValue = true;
			}

			if (storeWebSrchValue || storeAppSrchValue) {
				bLocationVal = this.__resetInput('B_LOCATION_1');
				eLocationVal = this.__resetInput('E_LOCATION_1');
				if (storeWebSrchValue) {
					this.__store_airline_codes(bLocationVal, "DepJson");
				}

				var frmAppCall = this.__store_search_criteria(bLocationVal, eLocation.value, storeWebSrchValue, storeAppSrchValue);
				if (storeAppSrchValue) {
					this.__merciFunc.appCallBack(siteParam.siteAppCallback, "://?flow=searchpage/remember=From:" + bLocationVal + "=" + frmAppCall);
				}
			}

			return true;
		},

		__store_airline_codes: function(loc, itemVal) {
			var arr = [],
				match = false;
			if (localStorage.getItem(itemVal) != null) {
				arr = JSON.parse(localStorage.getItem(itemVal));
			}

			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == loc) {
					match = true;
					break;
				}
			}

			if (!match) {
				arr.push(loc);
			}
			localStorage.setItem(itemVal, JSON.stringify(arr));
		},

		__store_search_criteria: function(loc, eLoc, web, app) {
			var dep = document.getElementById('month1').value + "" + document.getElementById('day1').value;
			var ret = document.getElementById('month2').value + "" + document.getElementById('day2').value;

			if (document.getElementsByName('trip-type')[0].checked) {
				var trip = document.getElementsByName('trip-type')[0].id
			} else {
				var trip = document.getElementsByName('trip-type')[1].id
			}

			var fromEntry = {
				to: eLoc,
				dep_date: dep,
				ret_date: ret,
				trip_type: trip,
				flexi: (document.getElementById('DATE_RANGE_VALUE_1') != null ? document.getElementById('DATE_RANGE_VALUE_1').checked : ""),
				cabin: (document.getElementById('CABIN_CLASS') != null ? document.getElementById('CABIN_CLASS').value : ""),
				adt: (document.getElementById('FIELD_ADT_NUMBER') != null ? document.getElementById('FIELD_ADT_NUMBER').value : ""),
				chd: (document.getElementById('FIELD_CHD_NUMBER') != null ? document.getElementById('FIELD_CHD_NUMBER').value : ""),
				inf: (document.getElementById('FIELD_INFANTS_NUMBER') != null ? document.getElementById('FIELD_INFANTS_NUMBER').value : ""),
				stu: (document.getElementById('FIELD_STU_NUMBER') != null ? document.getElementById('FIELD_STU_NUMBER').value : ""),
				ycd: (document.getElementById('FIELD_YCD_NUMBER') != null ? document.getElementById('FIELD_YCD_NUMBER').value : ""),
				yth: (document.getElementById('FIELD_YTH_NUMBER') != null ? document.getElementById('FIELD_YTH_NUMBER').value : ""),
				mil: (document.getElementById('FIELD_MIL_NUMBER') != null ? document.getElementById('FIELD_MIL_NUMBER').value : "")
			};

			if (app) {
				return JSON.stringify(fromEntry);
			} else {
				window.localStorage.setItem("From:" + loc, JSON.stringify(fromEntry));
				return true;
			}
		},

		__validateDealParams: function() {
			/* get JSON reference */
			/* var labels = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.labels;
			var siteParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam;
			var errorStrings = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.errorStrings; */

			/* create a date object */
			var currDt = requestParam.listofferbean.currentDate;
			var currDtLen = requestParam.listofferbean.currentDate.length;
			var today = new Date(currDt.substring(currDtLen - 4, currDtLen), this._convertMonthToInt(currDt.substring(2, currDtLen - 4)), currDt.substring(0, 2), 0, 0, 0);

			var showNewDtPicker = siteParam.showNewDatePicker;
			var m_bLoc = document.createElement('input');
			m_bLoc.type = 'hidden';
			m_bLoc.name = 'B_LOCATION_1';
			m_bLoc.value = requestParam.selectedOfferBean.origin.code;
			document.searchForm.appendChild(m_bLoc);

			var m_eLoc = document.createElement('input');
			m_eLoc.type = 'hidden';
			m_eLoc.name = 'E_LOCATION_1';
			m_eLoc.value = requestParam.selectedOfferBean.destination.code;
			document.searchForm.appendChild(m_eLoc);

			var t_type = document.createElement('input');
			t_type.type = 'hidden';
			t_type.name = 'TRIP_TYPE';
			t_type.value = requestParam.selectedOfferBean.tripTypes[0];
			document.searchForm.appendChild(t_type);

			var depDt = document.getElementById("day1");
			var depMonYr = document.getElementById("month1");
			if (showNewDtPicker == 'TRUE') {
				var depSelDay = depDt.getAttribute('value');
				var depSelMonYr = depMonYr.getAttribute('value');
				var depSelDt = new Date(depSelMonYr.substring(0, 4), depSelMonYr.substring(4, 6), depSelDay, 0, 0, 0);
			} else {
				var depSelDay = depDt.options[depDt.selectedIndex].text;
				var depSelMonYr = (depMonYr.options[depMonYr.selectedIndex].text).split(' ');
				var depSelDt = new Date(depSelMonYr[1], this._convertMonthToInt(depSelMonYr[0]), depSelDay, 0, 0, 0);
			}

			var retDt = document.getElementById("day2");
			var retMonYr = document.getElementById("month2");
			if (showNewDtPicker == 'TRUE') {
				var retSelDay = retDt.getAttribute('value');
				var retSelMonYr = retMonYr.getAttribute('value');
				var retSelDt = new Date(retSelMonYr.substring(0, 4), retSelMonYr.substring(4, 6), retSelDay, 0, 0, 0);
			} else {
				var retSelDay = retDt.options[retDt.selectedIndex].text;
				var retSelMonYr = (retMonYr.options[retMonYr.selectedIndex].text).split(' ');
				var retSelDt = new Date(retSelMonYr[1], this._convertMonthToInt(retSelMonYr[0]), retSelDay, 0, 0, 0);
			}

			var blackOutErr = false;
			var depInvalidDates = requestParam.invalidDatesDeals.DEPARTURE_INVALID_DATES;
			for (i = 0; i < depInvalidDates.length; i++) {
				/* create date object */
				var dtParams = depInvalidDates[i].replace(/'/g, '').split('/');
				var date = new Date(dtParams[0], dtParams[1], dtParams[2], 0, 0, 0);

				if (date.getTime() == depSelDt.getTime()) {
					blackOutErr = true;
					this.__addErrorMessage(errorStrings[204].localizedMessage + " (" + errorStrings[204].errorid + ")");
					break;
				}
			}

			var advancedPurchase = requestParam.selectedOfferBean.advancedPurchase;
			var timeDiff = (depSelDt.getTime() - today.getTime()) / (1000 * 3600 * 24);

			if (timeDiff < advancedPurchase) {
				this.__addErrorMessage(labels.tx_merci_text_adv_purchase + " " + advancedPurchase + " " + labels.tx_merci_text_days + " " + errorStrings[210].localizedMessage + " (" + errorStrings[210].errorid + ")");
			}

			if (requestParam.selectedOfferBean.tripTypes[0] == 'R') {
				var minStay = requestParam.selectedOfferBean.minimumStay;
				var minStayUnit = requestParam.selectedOfferBean.minimumStayUnit;
				var maxStay = requestParam.selectedOfferBean.maximumStay;
				var maxStayUnit = requestParam.selectedOfferBean.maximumStayUnit;

				if (!blackOutErr) {
					var retInvalidDates = requestParam.invalidDatesDeals.RETURN_INVALID_DAYS;
					for (i = 0; i < retInvalidDates.length; i++) {
						/* create date object */
						var dtParams = retInvalidDates[i].replace(/'/g, '').split('/');
						var date = new Date(dtParams[0], dtParams[1], dtParams[2], 0, 0, 0);

						if (date.getTime() == retSelDt.getTime()) {
							blackOutErr = true;
							this.__addErrorMessage(errorStrings[204].localizedMessage + " (" + errorStrings[204].errorid + ")");
							break;
						}
					}
				}

				if (!this.__merciFunc.isEmptyObject(minStay) && minStay != "") {
					var minStayTxt = labels.tx_merci_text_days;
					if (!this.__merciFunc.isEmptyObject(minStayUnit) != null && minStayUnit != "") {
						var minStayTime = minStay;
						if (minStayUnit == 'W') {
							minStay = minStay * 7;
							minStayTxt = labels.tx_merci_text_weeks;
						}

						if (minStayUnit == 'M') {
							minStay = minStay * 30;
							minStayTxt = labels.tx_merci_text_months;
						}

						if (((retSelDt.getTime() - depSelDt.getTime()) / (1000 * 3600 * 24)) < minStay) {
							this.__addErrorMessage(labels.tx_merci_text_min_stay_err + " " + minStayTime + " " + minStayTxt + " " + errorStrings[211].localizedMessage + " (" + errorStrings[211].errorid + ")");
						}
					}
				}

				if (!this.__merciFunc.isEmptyObject(maxStay) && maxStay != "") {
					if (!this.__merciFunc.isEmptyObject(maxStayUnit) != null && maxStayUnit != "") {
						var maxStayTxt = labels.tx_merci_text_days;
						var maxStayTime = maxStay;
						if (maxStayUnit == 'W') {
							maxStay = maxStay * 7;
							maxStayTxt = labels.tx_merci_text_weeks;
						}

						if (maxStayUnit == 'M') {
							maxStay = maxStay * 30;
							maxStayTxt = labels.tx_merci_text_months;
						}

						if (((retSelDt.getTime() - depSelDt.getTime()) / (1000 * 3600 * 24)) > maxStay) {
							this.__addErrorMessage(labels.tx_merci_text_max_stay_err + " " + maxStayTime + " " + maxStayTxt + " " + errorStrings[211].localizedMessage + " (" + errorStrings[211].errorid + ")");
						}
					}
				}
			}

			/* if no error return true */
			return this.data.errors.length == 0;
		},

		_convertMonthToInt: function(monthName) {
			switch (monthName.toLowerCase()) {
				case 'jan':
				case 'january':
					return 0;
				case 'feb':
				case 'february':
					return 1;
				case 'mar':
				case 'march':
					return 2;
				case 'apr':
				case 'april':
					return 3;
				case 'may':
					return 4;
				case 'jun':
				case 'june':
					return 5;
				case 'jul':
				case 'july':
					return 6;
				case 'aug':
				case 'august':
					return 7;
				case 'sep':
				case 'september':
					return 8;
				case 'oct':
				case 'october':
					return 9;
				case 'nov':
				case 'november':
					return 10;
				case 'dec':
				case 'december':
					return 11;
			}
		},

		__addErrorMessage: function(message) {
			/* if errors is empty */
			if (this.data.errors == null) {
				this.data.errors = new Array();
			}

			/* create JSON and append to errors */
			var error = {
				'TEXT': message
			};
			this.data.errors.push(error);
		},

		__validateTotalPax: function(varMaxNumOfTrav) {
			var totalNumOfPax;
			var allowStudent = siteParam.allowStudent;
			var allowSenior = siteParam.allowSenior;
			var allowYouth = siteParam.allowYouth;
			var allowMilitary = siteParam.allowMilitary;

			/* Get count of adults and child. */
			var varIntComboADT = this.convertPaxNoToInt('FIELD_ADT_NUMBER', 'Adult');
			var varIntComboCHD = this.convertPaxNoToInt('FIELD_CHD_NUMBER', 'Child');

			/* CR:6264064-------------------------- */
			if (allowStudent == "TRUE") {
				var varIntComboSTU = this.convertPaxNoToInt('FIELD_STU_NUMBER', 'Student');
			} else {
				var varIntComboSTU = 0;
			}

			if (allowSenior == "TRUE") {
				var varIntComboYCD = this.convertPaxNoToInt('FIELD_YCD_NUMBER', 'Senior');
			} else {
				var varIntComboYCD = 0;
			}

			if (allowYouth == "TRUE") {
				var varIntComboYTH = this.convertPaxNoToInt('FIELD_YTH_NUMBER', 'Youth');
			} else {
				var varIntComboYTH = 0;
			}
			if (allowMilitary == "TRUE") {
				var varIntComboMIL = this.convertPaxNoToInt('FIELD_MIL_NUMBER', 'Military');
			} else {
				var varIntComboMIL = 0;
			}

			/* Total number of pax = Adult + Children. Fix as part of ptr: 04471133 */
			var totalNumOfPax = varIntComboADT + varIntComboCHD + varIntComboSTU + varIntComboYCD + varIntComboYTH + varIntComboMIL;
			/* -----------------------------------CR6264064------------------ */
			if (totalNumOfPax > varMaxNumOfTrav) {
				this.__addErrorMessage(labels.tx_merci_text_booking_max_allow_pax + " " + varMaxNumOfTrav);
			}

			if (this.data.errors.length != 0) {
				return false;
			}

			return true;
		},

		validateAdtInfant: function() {
			var allowStudent = siteParam.allowStudent;
			var allowSenior = siteParam.allowSenior;
			var allowYouth = siteParam.allowYouth;
			var allowMilitary = siteParam.allowMilitary;
			/* Get count of adults and infants. */
			var varIntComboADT = this.convertPaxNoToInt('FIELD_ADT_NUMBER', 'Adult');
			var varIntComboINF = this.convertPaxNoToInt('FIELD_INFANTS_NUMBER', 'Infant');

			if (allowStudent) {
				var varIntComboSTU = this.convertPaxNoToInt('FIELD_STU_NUMBER', 'Student');
			} else {
				var varIntComboSTU = 0;
			}

			if (allowSenior) {
				var varIntComboYCD = this.convertPaxNoToInt('FIELD_YCD_NUMBER', 'Senior');
			} else {
				var varIntComboYCD = 0;
			}

			if (allowYouth) {
				var varIntComboYTH = this.convertPaxNoToInt('FIELD_YTH_NUMBER', 'Youth');
			} else {
				var varIntComboYTH = 0;
			}

			if (allowMilitary) {
				var varIntComboMIL = this.convertPaxNoToInt('FIELD_MIL_NUMBER', 'Military');
			} else {
				var varIntComboMIL = 0;
			}

			var totalComboTrl = varIntComboADT + varIntComboSTU + varIntComboYCD + varIntComboYTH + varIntComboMIL;
			if (varIntComboINF > totalComboTrl) {
				this.__addErrorMessage(errorStrings[5121].localizedMessage);
			}

			return this.data.errors.length == 0;
		},

		__validateAwrdNomiees: function(adtNominee, chdNominee) {
			var chdNumber = 0;
			var adtNumber = 0;
			var fieldChdNoEL = document.getElementById('FIELD_CHD_NUMBER');
			var fieldAdtNoEL = document.getElementById('FIELD_ADT_NUMBER');
			/* var siteParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */

			/* if adult selected */
			if (fieldAdtNoEL != null) {
				try {
					adtNumber = parseInt(fieldAdtNoEL.value);
				} catch (e) {
					adtNumber = 0;
				}
			}

			/* if child selected */
			if (fieldChdNoEL != null) {
				try {
					if (siteParam.allowAddPax != null && siteParam.allowAddPax.toLowerCase() == 'true') {
						var paxTypeChildEL = document.getElementById('paxTypeChild');
						if (paxTypeChildEL != null && paxTypeChildEL.className.indexOf('hidden') == -1) {
							chdNumber = parseInt(fieldChdNoEL.value);
						}
					} else {
						chdNumber = parseInt(fieldChdNoEL.value);
					}
				} catch (e) {
					chdNumber = 0;
				}
			}

			/* if number of selected adult or child is more than nominee */
			if (adtNominee < adtNumber || chdNominee < chdNumber) {
				this.__addErrorMessage(labels.tx_merci_nominee_error);
			}

			/* return true if no error */
			return this.data.errors.length == 0;
		},

		convertPaxNoToInt: function(fieldName, paxType) {
			var paxField = document.getElementById(fieldName);
			if (paxField != null && paxField.selectedIndex >= 0) {
				paxNum = paxField.options[paxField.selectedIndex].value;
				if (document.getElementById('paxType' + paxType) != null && document.getElementById('paxType' + paxType).className.indexOf('hidden') != -1) {
					paxNum = "0";
				}
			} else {
				paxNum = "0";
			}

			paxNum = parseInt(paxNum, 10);
			return paxNum;
		},

		/**
		 * set local storage parameters
		 */
		storeSearchPageValues: function() {
			/* var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */

			if (document.getElementById("B_LOCATION_1") != null) {
				this.__merciFunc.storeLocal("B_LOCATION_1", document.getElementById("B_LOCATION_1").value, "overwrite", "text");
			}

			if (document.getElementById("E_LOCATION_1") != null) {
				this.__merciFunc.storeLocal("E_LOCATION_1", document.getElementById("E_LOCATION_1").value, "overwrite", "text");
			}

			if (document.getElementById("day1") != null) {
				if (document.getElementById("day1").value == null) {
					this.__merciFunc.storeLocal("day1", document.getElementById("day1").value, "overwrite", "text");
				} else {
					this.__merciFunc.storeLocal("day1", document.getElementById("day1").value, "overwrite", "text");
				}
			}

			if (document.getElementById("month1") != null) {
				this.__merciFunc.storeLocal("month1", document.getElementById("month1").value, "overwrite", "text");
			}

			if (document.getElementById("day2") != null) {
				if (document.getElementById("day2").value == null) {
					this.__merciFunc.storeLocal("day2", document.getElementById("day2").value, "overwrite", "text");
				} else {
					this.__merciFunc.storeLocal("day2", document.getElementById("day2").value, "overwrite", "text");
				}
			}

			if (document.getElementById("month2") != null) {
				this.__merciFunc.storeLocal("month2", document.getElementById("month2").value, "overwrite", "text");
			}

			if (document.getElementById("FIELD_ADT_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_ADT_NUMBER", document.getElementById("FIELD_ADT_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (document.getElementById("FIELD_CHD_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_CHD_NUMBER", document.getElementById("FIELD_CHD_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParam.allowInfant != null && siteParam.allowInfant.toLowerCase() == "true" && document.getElementById("FIELD_INFANTS_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_INFANTS_NUMBER", document.getElementById("FIELD_INFANTS_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParam.allowStudent != null && siteParam.allowStudent.toLowerCase() == "true" && document.getElementById("FIELD_STU_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_STU_NUMBER", document.getElementById("FIELD_STU_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParam.allowSenior != null && siteParam.allowSenior.toLowerCase() == "true" && document.getElementById("FIELD_YCD_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_YCD_NUMBER", document.getElementById("FIELD_YCD_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParam.allowYouth != null && siteParam.allowYouth.toLowerCase() == "true" && document.getElementById("FIELD_YTH_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_YTH_NUMBER", document.getElementById("FIELD_YTH_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParam.allowMilitary != null && siteParam.allowMilitary.toLowerCase() == "true" && document.getElementById("FIELD_MIL_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_MIL_NUMBER", document.getElementById("FIELD_MIL_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (document.getElementById("oneWay") != null) {
				this.__merciFunc.storeLocal("oneWay", document.getElementById("oneWay").checked, "overwrite", "text");
			}

			if (document.getElementById("roundTrip") != null) {
				this.__merciFunc.storeLocal("roundTrip", document.getElementById("roundTrip").checked, "overwrite", "text");
			}

			if (document.getElementById("CABIN_CLASS") != null) {
				this.__merciFunc.storeLocal("CABIN_CLASS", document.getElementById("CABIN_CLASS").selectedIndex, "overwrite", "text");
			}

			if (document.getElementById("COMMERCIAL_FARE_FAMILY_1") != null) {
				this.__merciFunc.storeLocal("COMMERCIAL_FARE_FAMILY_1", document.getElementById("COMMERCIAL_FARE_FAMILY_1").value, "overwrite", "text");
			}

			if (document.getElementById("DATE_RANGE_VALUE_1") != null) {
				this.__merciFunc.storeLocal("DATE_RANGE_VALUE_1", document.getElementById("DATE_RANGE_VALUE_1").checked, "overwrite", "text");
			}

			if (document.getElementById("DATE_RANGE_VALUE_2") != null) {
				this.__merciFunc.storeLocal("DATE_RANGE_VALUE_2", document.getElementById("DATE_RANGE_VALUE_2").value, "overwrite", "text");
			}

			if (document.getElementById("country_site") != null) {
				this.__merciFunc.storeLocal("Country_Site", document.getElementById("country_site").value, "overwrite", "text");
			}

			/* CR-6264064------------------------- */
			if (siteParam.allowStudent == "TRUE") {
				if (document.getElementById("FIELD_STU_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_STU_NUMBER", document.getElementById("FIELD_STU_NUMBER").selectedIndex, "overwrite", "text");
				}
			}

			if (siteParam.allowSenior == "TRUE") {
				if (document.getElementById("FIELD_YCD_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_YCD_NUMBER", document.getElementById("FIELD_YCD_NUMBER").selectedIndex, "overwrite", "text");
				}
			}

			if (siteParam.allowYouth == "TRUE") {
				if (document.getElementById("FIELD_YTH_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_YTH_NUMBER", document.getElementById("FIELD_YTH_NUMBER").selectedIndex, "overwrite", "text");
				}
			}

			if (siteParam.allowMilitary == "TRUE") {
				if (document.getElementById("FIELD_MIL_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_MIL_NUMBER", document.getElementById("FIELD_MIL_NUMBER").selectedIndex, "overwrite", "text");
				}
			}
			/* CR-6264064------------------------- */

			var allowAddPax = siteParam.allowAddPax;
			if (allowAddPax == "TRUE") {
				this.checkTravellers();
			}
		},

		checkTravellers: function() {
			if (document.getElementById('paxTypeAdult') != null) {
				if (document.getElementById('paxTypeAdult').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkAdult', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkAdult', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeChild') != null) {
				if (document.getElementById('paxTypeChild').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkChild', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkChild', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeInfant') != null) {
				if (document.getElementById('paxTypeInfant').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkInfant', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkInfant', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeStudent') != null) {
				if (document.getElementById('paxTypeStudent').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkStudent', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkStudent', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeSenior') != null) {
				if (document.getElementById('paxTypeSenior').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkSenior', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkSenior', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeYouth') != null) {
				if (document.getElementById('paxTypeYouth').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkYouth', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkYouth', true, "overwrite", "text");
			}

			if (document.getElementById('paxTypeMilitary') != null) {
				if (document.getElementById('paxTypeMilitary').className.indexOf('hidden') != -1)
					this.__merciFunc.storeLocal('chkMilitary', false, "overwrite", "text");
				else
					this.__merciFunc.storeLocal('chkMilitary', true, "overwrite", "text");
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

		showCross: function(event, args) {
			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				if (inputEL.value == '' || inputEL.className.indexOf('hidden') != -1) {
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

		onDayMonthChange: function(at, args) {
			var monId = document.getElementById(args.monthdd)
			var dayId = document.getElementById(args.daydd)
			var monthIndex = monId.options[monId.selectedIndex].value;
			$('#' + args.datePick).datepicker("setDate", new Date(monthIndex.substring(0, 4), monthIndex.substring(4, 6), dayId.options[dayId.selectedIndex].value));
		},

		getSmarDropDownJson: function() {
			/* var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam; */
			var json = {};
			try {
				json = JSON.parse(eval("'" + requestParam.smartDropDownContent + "'"));
			} catch (ex) {
				json = JSON.parse(requestParam.smartDropDownContent);
			}

			return json;
		},

		_getDateRangeDefaultValue: function() {
			/* var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */
			var dateRangeStoredValue = this.__merciFunc.getStoredItem('DATE_RANGE_VALUE_1');
			if (dateRangeStoredValue == null) {
				return siteParam.dateRangeChkboxValue;
			} else {
				return dateRangeStoredValue;
			}
		},

		_isDaySelected: function(dayLabel, currDay, value) {
			var dayStored = this.__merciFunc.getStoredItem(dayLabel);
			if (dayStored == null) {
				return currDay == value;
			}

			return dayStored == value;
		},

		_isMonthYearSelected: function(monthLabel, currYear, value) {
			var monthStored = this.__merciFunc.getStoredItem(monthLabel);
			if (monthStored == null) {
				return currYear == value;
			}

			return monthStored == value;
		},

		_getTravellerSelected: function(trvlLabel) {
			var trvlStored = this.__merciFunc.getStoredItem(trvlLabel);
			if (trvlStored != null) {
				trvlStored = parseInt(trvlStored);
				if (trvlLabel == 'FIELD_ADT_NUMBER') {
					trvlStored += 1;
				}

				return trvlStored;
			} else {
				return 0;
			}
		},

		_radioSelectionValue: function(radioId) {
			if (this.__merciFunc.getStoredItem(radioId) != null) {
				var radioStored = this.__merciFunc.getStoredItem(radioId);
				if (radioStored == 'true') {
					return 'checked="checked"';
				}
			} else {
				if (radioId == 'roundTrip') {
					return 'checked="checked"';
				}
			}

			return '';
		},

		_isDealsFlow: function() {
			/* var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */
			return siteParam.isDWMenabled != null && siteParam.isDWMenabled.toUpperCase() == 'TRUE' && (requestParam.flow == 'DEALS_AND_OFFER_FLOW' || requestParam.request.FLOW_TYPE == 'DEALS_AND_OFFER_FLOW');
		},

		/** Method called by Native Calendar of Device to set the date on the search page*/
		_selectedDates: function(month, day, dayInt, monthInt) {
			dayInt = ("0" + (dayInt).toString()).slice(-2);
			/* console.log("=====================\nmonth = " + month);
			console.log("Day = " + day);
			console.log("dayInt = " + dayInt);
			console.log("monthInt = " + monthInt + " \n==========="); */

			var showNewDtPicker = siteParam.showNewDatePicker;
			var retOffsetDate = siteParam.returnDayRange;
			var yearFromParam = monthInt.substring(0, 4);
			var monthFromParam = monthInt.substring(4, 7);
			var monthNumber = parseInt(monthFromParam) + 1;

			if (month == 'Month1') {
				$("#datePickF").datepicker('setDate', new Date(yearFromParam, monthFromParam, dayInt));

				document.getElementById("month1").value = monthInt;
				document.getElementById("day1").value = dayInt;

				var day1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
				if (showNewDtPicker != 'TRUE') {
					var month1 = $.datepicker.formatDate('yymm', $("#datePickF").datepicker('getDate'));
					$("#day1 option[value=" + day1 + "]").attr('selected', 'selected');
					$("#month1>option[value=" + (month1 - 1) + "]").attr('selected', 'selected');
					pageObj.updateDepartureDate();
					var returnDate = $("#datePickF").datepicker('getDate');
					var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
					$("#datePickT").datepicker('setDate', offSetDate);
				} else {
					var month1 = $.datepicker.formatDate('M', $("#datePickF").datepicker('getDate'));
					var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
					var monthinNo = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
					var yearMonth = $.datepicker.formatDate('yymm', $("#datePickF").datepicker('getDate'));
					$("#depdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
					var returnDate = $("#datePickF").datepicker('getDate');
					var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
					$("#datePickT").datepicker('setDate', offSetDate);
					var monthRet = $.datepicker.formatDate('M', $("#datePickT").datepicker('getDate'));
					var yearRet = $.datepicker.formatDate('yy', $("#datePickT").datepicker('getDate'));
					$("#retdate").html("<time>" + monthRet + " " + offSetDate.getDate() + " , " + yearRet + "</time>");
					var depdayId = document.getElementById("day1");
					var depmonthId = document.getElementById("month1");
					depdayId.value = day1;
					depmonthId.value = yearMonth - 1;
					var retdayId = document.getElementById("day2");
					var retmonthId = document.getElementById("month2");
					retdayId.value = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
					retmonthId.value = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate')) - 1;
				}
			} else {
				$("#datePickT").datepicker('setDate', new Date(yearFromParam, monthFromParam, dayInt));

				document.getElementById("month2").value = monthInt;
				document.getElementById("day2").value = dayInt;

				var day2 = $.datepicker.formatDate('dd', $("#datePickT").datepicker('getDate'));
				if (showNewDtPicker != 'TRUE') {
					var month2 = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate'));
					$("#day2 option[value=" + day2 + "]").attr('selected', 'selected');
					$("#month2>option[value=" + (month2 - 1) + "]").attr('selected', 'selected');
				} else {
					var month2 = $.datepicker.formatDate('M', $("#datePickT").datepicker('getDate'));
					var year2 = $.datepicker.formatDate('yy', $("#datePickT").datepicker('getDate'));
					var monthinNo = $.datepicker.formatDate('mm', $("#datePickT").datepicker('getDate'));
					var yearMonth = $.datepicker.formatDate('yymm', $("#datePickT").datepicker('getDate'));
					$("#retdate").html("<time>" + month2 + " " + day2 + " , " + year2 + "</time>");
					$("#retdate").attr("monindex", monthinNo + year2);
					$("#retdate").attr("day2", day2);
					var dayId = document.getElementById("day2");
					var monthId = document.getElementById("month2");
					dayId.value = day2;
					monthId.value = yearMonth - 1;
				}
			}

			$('.search').show();
			$('.banner').show();
			$('#ui-datepicker-div').hide();
		},

		/** Method called to form FareDealData tag on page to be read by apps during fare-deals flow */
		fetchAppFareDealData: function() {
			var dealDataStr = "";

			if (requestParam.selectedOfferBean != null && requestParam.selectedOfferBean != "") {
				var selectedDealBean = requestParam.selectedOfferBean;
				var listDealBean = requestParam.listofferbean;

				var mthNmList = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
				var startDt = new Date(selectedDealBean.travelStart.split(" ")[0]);
				var endDt = new Date(selectedDealBean.travelEnd.split(" ")[0]);

				dealDataStr += "price=" + selectedDealBean.currency + " " + selectedDealBean.price;
				dealDataStr += "&origin=" + listDealBean.originCityName;
				dealDataStr += "&destination=" + listDealBean.destinationCityName;
				dealDataStr += "&startDate=" + startDt.getDate() + mthNmList[startDt.getMonth()] + startDt.getFullYear();
				dealDataStr += "&endDate=" + endDt.getDate() + mthNmList[endDt.getMonth()] + endDt.getFullYear();
				dealDataStr += "&offerID=" + selectedDealBean.offerId;
				dealDataStr += "&COUNTRY_SITE=" + requestParam.request.COUNTRY_SITE;
			}

			return dealDataStr;
		},

		/* PTR - 07577835  start*/
		custompaxselect: function(evt, typeofPax) {
			/* var siteParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam; */
			if (this.__merciFunc.booleanValue(siteParam.siteCustomJS)) {
				addPax = siteParam.allowAddPax;
				paxselect({
					"type": typeofPax,
					"allowAddPax": addPax
				});
			}
		},
		/* PTR - 07577835  end*/

		/** Method to include custom search script coming from the airline directly */
		includeCustomScript: function(path) {
			/* aria.utils.ScriptLoader.load(["http://www.bookonline.saudiairlines.com/pl/SaudiAirlines/cui-sv_wls113.0_240_111213/js/srch.js"]); */
			var custJS = document.createElement("script");

			/* set attribute */
			custJS.setAttribute("type", "text/javascript");
			custJS.setAttribute("src", path);

			/* add to head */
			document.getElementsByTagName("head")[0].appendChild(custJS);
			jsonResponse.custJSLoaded = true;
		}
	}
});