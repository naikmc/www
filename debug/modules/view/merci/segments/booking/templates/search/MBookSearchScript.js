Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.search.MBookSearchScript',
	$dependencies: [
		'aria.utils.Date',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl'
	],
	$constructor: function() {
		pageBookSearch = this;
		ariaAutoCompleteScope = this;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this._url = modules.view.merci.common.utils.URLManager;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;

		var dateParam, addPax;
		this._isCountryListAvailable = false;
		this._countryList = new Array();
	},
	$destructor: function() {
		// release memory
		pageBookSearch = null;
	},
	$prototype: {

		onAirportSelector: function(a, input) {
			var inputfield = input.ID;
			ariaAutoCompleteScope.moduleCtrl.setValueforStorage(inputfield, 'inputfield');
			ariaAutoCompleteScope.moduleCtrl.navigate(null, 'merci-book-MAIRPS_A');
		},

		$displayReady: function() {
			modules.view.merci.common.utils.MCommonScript.prefillFormData("formPrefillData");
			if(jsonResponse.popup!=null && this.__merciFunc.isEmptyObject(jsonResponse.popup.fromPopupData)){
				this.toggleReturnJourney();
			}
		},

		__onBookFlightCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				var json = this.moduleCtrl.getModuleData();
				if (json.booking == null) {
					json.booking = {};
				}
				json.booking.MSRCH_A = response.responseJSON.data.booking.MSRCH_A;
				json.header = response.responseJSON.data.header;
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (dataId == 'MError_A') {
					this.moduleCtrl.navigate(null, nextPage);
				} else {
					// displaying search page
					this.printUI = true;
					this.data.errors = response.responseJSON.data.booking.MSRCH_A.requestParam.reply.listMsg;

					this.$refresh({
						section: 'searchPage'
					});

					if (json.booking.MSRCH_A != undefined && json.booking.MSRCH_A.requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
						if (json.booking.MSRCH_A.requestParam.listofferbean.searchPageContent != " ") {
							document.getElementById("offerContent").innerHTML = "<aside class='panel'>" + json.booking.MSRCH_A.requestParam.listofferbean.searchPageContent + "</aside>";
						}
					}
				}
			}
		},

		createAutocompleteSourceAria: function(isFirstField, evt) {

			var autoCompleteSource = [];
			var keyPadDismiss = document.getElementById('keyPadDismiss');
			var siteParameters = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var rqstParams = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var bp = this._url.getBaseParams();
			var DepJson = [];
			var respArr = [];

			var autoCompleteMinLength = 1;
			if (siteParameters.siteAutoCompleteMinLength != null) {
				try {
					autoCompleteMinLength = parseInt(siteParameters.siteAutoCompleteMinLength);
				} catch (err) {
					autoCompleteMinLength = 1;
				}
			}

			if( (typeof customerAppData !="undefined") && (pageBookSearch.__merciFunc.isRequestFromApps()==true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length>0){
				if(isFirstField == true){
					autoCompleteSource = customerAppData.departureCityList;
				}else{
					if(customerAppData.destinationCityList.length>0){
						autoCompleteSource = customerAppData.destinationCityList;
					}else{
						autoCompleteSource = customerAppData.departureCityList;
					}
				}
			}else{

				if (localStorage != null) {
					DepJson = pageBookSearch.__merciFunc.getStoredItem('DepJson');
				}
				if (DepJson != null) {
					respArr = JSON.parse(DepJson);
				}

				var storeWebSrchValue = false;
				var storeAppSrchValue = false;
				var isGlobal = false;

				if ((siteParameters.siteRetainSearch == "TRUE") && (null == bp[14] || bp[14] == "") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == undefined)) {
					storeWebSrchValue = true;
				} else if (siteParameters.siteRetainSearch == "TRUE" && (null != bp[14] && bp[14] != "") && rqstParams.retainAppCriteria == "TRUE") {
					storeAppSrchValue = true;
				} else if (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == true) {
					storeWebSrchValue = true;
				}
				if (storeAppSrchValue) {
					var depAppJson = $('#app_json_data').val();
					if (depAppJson != undefined && "" != depAppJson) {
						var temp = JSON.parse(depAppJson);
						if (null != temp && null != temp.DepJson && "undefined" != temp.DepJson) {
							respArr = temp.DepJson;
							var test = respArr.split(",");
							respArr = test;
						}
					}
				}


				if (this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList.airportList != null) {

					if (!this.__merciFunc.isEmptyObject(rqstParams.beginLocations) && isFirstField == true) {

						var listItem = rqstParams.beginLocations;
					} else if (!this.__merciFunc.isEmptyObject(rqstParams.endLocations) && isFirstField == false) {

						var listItem = rqstParams.endLocations;
					} else {

						var listItem = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList.airportList;
						isGlobal = true;
					}

					if (isGlobal) {
						for (var i = 0; i < listItem.length; i++) {
							var keyFound = false;
							for (var k = 0; k < respArr.length; k++) {
								if ((storeWebSrchValue || storeAppSrchValue) && null != respArr[k] && listItem[i][0] == respArr[k] && isFirstField == true) {
									keyFound = true;
									break;
								}
							}

							if (this._isCountryListAvailable == false)
								this._countryList[listItem[i][1]] = listItem[i][0];

							var json = {
								label: listItem[i][1],
								code: listItem[i][0],
								image: {
									show: keyFound,
									css: 'fave'
								}
							};

							if (keyFound) {
								autoCompleteSource.unshift(json);
							} else {
								autoCompleteSource.push(json);
							}
						}

					} else {

						for (var i = 0; i < listItem.length; i++) {
							var keyFound = false;
							for (var k = 0; k < respArr.length; k++) {



								if ((storeWebSrchValue || storeAppSrchValue) && null != respArr[k] && listItem[i].locationCode == respArr[k] && isFirstField == true) {
									keyFound = true;
									break;
								}
							}

							var airportName = "";
							var airportCode = "";
							var fullList = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList.airportList;

								for (var airportLength = 0; airportLength < fullList.length; airportLength++) {
									if (fullList[airportLength][0] == listItem[i].locationCode) {
										airportName = fullList[airportLength][1];
										airportCode = fullList[airportLength][0];
										break;
									}
								}

							var json = {
								label: airportName,
								code: airportCode,
								image: {
									show: keyFound,
									css: 'fave'
								}
							};
							if (keyFound) {
								autoCompleteSource.unshift(json);
							} else {
								autoCompleteSource.push(json);
							}
						}

					}

					this._isCountryListAvailable = true;

				} else {

					var listItem = this.getSmarDropDownJson();
					for (var key in listItem.routes['out']) {
						if (listItem.labels[key] != null) {
							autoCompleteSource.push({
								label: key,
								code: listItem.labels[key]
							});
						}
					}
				}
			}
			return autoCompleteSource;
		},
		createAwardAutoCompleteAria: function() {

			var rqstParams = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var siteParameters = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var bp = this._url.getBaseParams();
			var pageObjSrch=this;
			var DepJson = [];
			var respArr = [];

			if (localStorage != null) {
				DepJson = pageBookSearch.__merciFunc.getStoredItem('DepJson');
			}
			if (DepJson != null && DepJson != "") {
				respArr = JSON.parse(DepJson);
			}

			var storeWebSrchValue = false;
			var storeAppSrchValue = false;
			if (siteParameters.siteRetainSearch == "TRUE" && (null == bp[14] || bp[14] == "")) {
				storeWebSrchValue = true;
			} else if (siteParameters.siteRetainSearch == "TRUE" && (null != bp[14] && bp[14] != "") && rqstParams.retainAppCriteria == "TRUE") {
				storeAppSrchValue = true;
			}
			if (storeAppSrchValue) {
				var depAppJson = $('#app_json_data').val();
				if (depAppJson != undefined && "" != depAppJson) {
					var temp = JSON.parse(depAppJson);
					if (null != temp && null != temp.respArr && "undefined" != temp.respArr) {
						respArr = temp.respArr;
						var test = respArr.split(",");
						respArr = test;
					}
				}
			}
			var autoCompleteMinLength = 1;
			if (siteParameters.siteAutoCompleteMinLength != null) {
				try {
					autoCompleteMinLength = parseInt(siteParameters.siteAutoCompleteMinLength);
				} catch (err) {
					autoCompleteMinLength = 1;
				}
			}
			var args = {
				respArr: respArr,
				storeWebSrchValue: storeWebSrchValue,
				storeAppSrchValue: storeAppSrchValue
			};
			if (siteParameters.allowMCAwards == 'TRUE' && siteParameters.allowGuestAward == 'TRUE' && rqstParams.flow != 'DEALS_AND_OFFER_FLOW') {
				var value = siteParameters.siteMCAwrdSite.split('-');
				var globalListURL = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + value[0] + "/MGetGlobalListsForAwards.action?SITE=" + value[1] + "&LANGUAGE=" + bp[12] + "&COUNTRY_SITE=" + bp[13] + "&result=json";

				$.getJSON(globalListURL, function(response) {
					var items = new Array();
					if (response.data && response.data.booking && response.data.booking.MAwardGlobalList_A && response.data.booking.MAwardGlobalList_A.globalList) {
						var globalLists = response.data.booking.MAwardGlobalList_A.globalList;
				var airportList = globalLists.airportNames;
				var airportCodeMap = {};
				for (var i = 0; i < airportList.length; i++) {
					var current = airportList[i];
					airportCodeMap[current[0]] = current[1];
				}
						if (pageObjSrch.data.awards == null) {
							pageObjSrch.data.awards = {};
				}
						pageObjSrch.data.awards.autocompleteListFromField = pageObjSrch.createList(globalLists.departureAirportList, args.respArr, args.storeWebSrchValue, args.storeAppSrchValue, airportCodeMap, true);
						pageObjSrch.data.awards.autocompleteListToField = pageObjSrch.createList(globalLists.arrivalAirportList, args.respArr, args.storeWebSrchValue, args.storeAppSrchValue, airportCodeMap, false);
						pageObjSrch.data.awards.awardCabinClasses= globalLists.awardCabinClasses;
					}
				});
			}
		},
		createList: function(resultArr, respArr, storeWebSrchValue, storeAppSrchValue, airportCodeMap, isFromField) {
					var items = new Array();

			for (var i = 0; i < resultArr.length; i++) {
				var current = resultArr[i];
							var keyFound = false;
							for (var k = 0; k < respArr.length; k++) {
					if ((storeWebSrchValue || storeAppSrchValue) && null != respArr[k] && current[0] == respArr[k]) {
									keyFound = true;
									break;
								}
							}

				if (airportCodeMap[current[0]]) {
					if(isFromField){
						var jsonField = {
							label: airportCodeMap[current[0]],
							code: current[0],
								image: {
									show: keyFound,
									css: 'fave'
								}
							}

							if (keyFound) {
							items.unshift(jsonField);

							} else {
							items.push(jsonField);

							}
					}else{
						var jsonField = {
							label: airportCodeMap[current[0]],
							code: current[0],
							image: null
						};
						items.push(jsonField);
					}
					}


			}
			return items;
		},

		createNewList: function(passList) {
			var newList = [];

			for (var i = 0; i < passList.length; i++) {
				var jsonToField = {};
				jsonToField.label = passList[i].label;
				jsonToField.code = passList[i].code;
				jsonToField.image = null;
				newList.push(jsonToField);
			}

			return newList;
		},

		selectFromARIA: function(evt, ui) {
			if( (typeof customerAppData !="undefined") && (pageBookSearch.__merciFunc.isRequestFromApps()==true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length>0 && (typeof createDestinationAirportList != "undefined")){
				var code = ui.suggestion.code;
				console.log('SOURCE selected:' + code);
				if (code.length == 3) {
					createDestinationAirportList(code);
				}
				this.$refresh({
					section: 'createDestinationFeild'
				});
			}else{
				var globalList = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.globalList;
				var rqstParams = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
				var siteParameters = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
				var bp = this._url.getBaseParams();
				var DepJson = {};

				if (localStorage != null) {
					DepJson = pageBookSearch.__merciFunc.getStoredItem('DepJson');
				}
				if (DepJson != null && DepJson != "") {
					DepJson = JSON.parse(DepJson);
				}

				var storeWebSrchValue = false;
				var storeAppSrchValue = false;
				if ((siteParameters.siteRetainSearch == "TRUE") && (null == bp[14] || bp[14] == "") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == undefined)) {
					storeWebSrchValue = true;
				} else if (siteParameters.siteRetainSearch == "TRUE" && (null != bp[14] && bp[14] != "") && rqstParams.retainAppCriteria == "TRUE") {
					storeAppSrchValue = true;
				} else if (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == true) {
					storeWebSrchValue = true;
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
				if (siteParameters.siteAutoCompleteMinLength != null) {
					try {
						autoCompleteMinLength = parseInt(siteParameters.siteAutoCompleteMinLength);
					} catch (err) {
						autoCompleteMinLength = 1;
					}
				}



				if (storeAppSrchValue || storeWebSrchValue) {
					var code = ui.suggestion.code;

					if (code.length == 3) {

						if (storeAppSrchValue) {
							window.location = siteParameters.siteAppCallback + "://?flow=searchpage/fromAirport=" + code;
						} else if (storeWebSrchValue) {
							entry = pageBookSearch.__merciFunc.getStoredItem("From:" + code);
							if (entry != null) {
								pageBookSearch.setSearchCriteria(entry);
							}
						}
					}
				}
			}
		},



		__prepopulateBLocation: function() {

			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;

			// select B_LOCATION_1 input box for value manipulation
			var bLocation = document.getElementById('B_LOCATION_1_SRCH');
			if (bLocation != null) {

				// get data from storage
				var countrySiteEl = document.getElementById('country_site');
				var bLocationData = this.__merciFunc.getStoredItem('B_LOCATION_1_SRCH');
				var countrySiteData = this.__merciFunc.getStoredItem('Country_Site');
					var json = this.getSmarDropDownJson();

					if (json.labels[siteParameters.siteDefaultAirport] != null) {
						bLocation.value = json.labels[siteParameters.siteDefaultAirport];
					}
				else if(this.__merciFunc.isRequestFromApps()==true && !this.__merciFunc.isEmptyObject(rqstParams.nearestAirport)) {
					if(!this.__merciFunc.isEmptyObject(jsonResponse) && !this.__merciFunc.isEmptyObject(jsonResponse.ui) && this.__merciFunc.booleanValue(jsonResponse.ui.geoLoc)==true){
						bLocation.value = rqstParams.nearestAirport ;
					}
				}
				else if(bLocationData != null && bLocationData != '' && countrySiteEl.value == countrySiteData) {
					bLocation.value = bLocationData;
				}
				if(rqstParams.request.FROM_INDEX!= undefined && rqstParams.request.FROM_INDEX == "true" && bLocationData != null && bLocationData != ''){
					bLocation.value = bLocationData;
				}
			}
		},

		openHTML: function(args, data) {
			// calling common method to open HTML page popup
			//this.moduleCtrl.openHTML(args, data);
			var enableNewPopup = false;
			if(this.__merciFunc.booleanValue(this.data.siteParams.enableNewPopup)){
				enableNewPopup =  true ;
			}
			data.moduleCtrl = this.moduleCtrl ;
			data.enableNewPopup = enableNewPopup ;
			this.__merciFunc.openHTML(data);
		},

		closePopup: function(args, data) {

			// calling common method to close popup
			this.moduleCtrl.closePopup();

		},

		_disableAwards: function(args, data) {
			var onOffSwitch = document.getElementById('myonoffswitch');
			if (onOffSwitch != null) {

				// reset switch
				onOffSwitch.checked = false;

				// reset infant field
				var infantField = document.getElementById('FIELD_INFANTS_NUMBER');
				if (infantField != null) {

					// set in local storage
					var infantFldValue = '';
					if (this.__merciFunc.supports_local_storage()) {
						infantFldValue = localStorage.getItem('INFANTS');
					}

					infantField.value = infantFldValue;
					infantField.removeAttribute('disabled');
				}

				var bLocation = document.getElementById('B_LOCATION_1_SRCH');
				var eLocation = document.getElementById('E_LOCATION_1_SRCH');
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

				if (cLocation != null && eLocation != null) {
					cLocation.className = ' hidden';
					eLocation.value = cLocation.value;
					cLocation.value = '';
					eLocation.className = eLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}

			if (awrdFlowHidden != null) {
				awrdFlowHidden.value = "FALSE";
			}
		},

		closeAwardsPopup: function(event, args) {

			this._disableAwards();

			// hide popup
			this.moduleCtrl.hideMskOverlay();
			var popupEl = document.getElementById('dialog-login');
			if (popupEl != null) {
				popupEl.style.display = 'none';
			}
			var messageInfo = document.getElementsByClassName('message info')[0];
		},

		_enableAwards: function() {

			// reset infant field
			var infantField = document.getElementById('FIELD_INFANTS_NUMBER');
			if (infantField != null) {

				// set in local storage
				if (this.__merciFunc.supports_local_storage()) {
					localStorage.setItem('INFANTS', infantField.value);
				}

				infantField.value = 0;
				infantField.setAttribute('disabled', 'disabled');
			}

			var bLocation = document.getElementById('B_LOCATION_1_SRCH');
			var eLocation = document.getElementById('E_LOCATION_1_SRCH');
			var aLocation = document.getElementById('A_LOCATION_1');
			var cLocation = document.getElementById('C_LOCATION_1');
			var delBLocation = document.getElementById('delB_LOCATION_1_SRCH');
			var delELocation = document.getElementById('delE_LOCATION_1_SRCH');
			var awrdFlowHidden = document.getElementById('AWARDS_FLOW');

			// input field
			if (aLocation != null && bLocation != null) {
				bLocation.className = ' hidden';
				aLocation.value = bLocation.value;
				bLocation.value = '';
				aLocation.className = aLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			// input fields
			if (cLocation != null && eLocation != null) {
				eLocation.className = ' hidden';
				cLocation.value = eLocation.value;
				eLocation.value = '';
				cLocation.className = cLocation.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			if (awrdFlowHidden != null) {
				awrdFlowHidden.value = "TRUE";
			}
		},

		isAwardsFlowEnabled: function() {
			var onOffSwitch = document.getElementById('myonoffswitch');
			if (onOffSwitch != null) {
				if (onOffSwitch.checked == true) {
					return true;
				}
			}
			return false;
		},

		/**
		 * event is triggered when user selects to redeem FF point
		 * @param event
		 * @param args
		 */
		onDirectLoginSubmit: function(event, args) {
			if (this.__merciFunc.hasCustomPackage()) {
				event.preventDefault();

				var request = {
					formObj: document.getElementById(this.$getId('ffRedeemForm')),
					action: args.action,
					isCompleteURL: true,
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this._onDirectLoginCallback,
						args: args,
						scope: this
					}
				};

				this._url.makeServerRequest(request, true);
			}
		},

		_onDirectLoginCallback: function(response, args) {
			// navigate to next page
			this.moduleCtrl.navigate(null, response.responseJSON.homePageId);
		},

		openAwardsConfPopup: function(args, data) {

			var onOffSwitch = document.getElementById('myonoffswitch');
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;

			if (onOffSwitch != null) {
				if (rqstParams.request.client != null || rqstParams.enableDirectLogin == 'YES') {
						if (typeof(swapBannerName) != 'undefined') {
							swapBannerName();
						}
					this.data['B_LOCATION_1'] = document.getElementById('B_LOCATION_1_SRCH').value;
					this.data['E_LOCATION_1'] = document.getElementById('E_LOCATION_1_SRCH').value;

					this.$refresh({
						section: 'createSearchFeilds'
					});
					this.$refresh({
						section: 'createCFFInput'
					});
				}
				if (onOffSwitch.checked == true) {

					if (document.getElementsByClassName('message info')[0]) {}
					// set awards flow
					this._enableAwards();
				} else {
					// i.e. no is selected on UI
					this.closeAwardsPopup(args, data);
				}

				if (rqstParams.request.client == null || rqstParams.request.client == '') {

					// if button is selected as 'YES' and user is not logged in
					if (onOffSwitch.checked == true && rqstParams.enableDirectLogin != 'YES') {

						// show overlay
						this.moduleCtrl.showMskOverlay();

						// display popup
						var popupEl = document.getElementById('dialog-login');
						if (popupEl != null) {
							popupEl.style.display = 'block';
						}
					}

				} else {
					window.location = siteParameters.siteAppCallback + "://?flow=searchpage/redeemmile=" + onOffSwitch.checked;
				}
			}
		},

		$dataReady: function() {

			// if search page data is not available
			if (this.moduleCtrl.getModuleData().booking == null || this.moduleCtrl.getModuleData().booking.MSRCH_A == null) {

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

				this._url.makeServerRequest(request, false);
			} else {
				// set errors
				this.data.errors = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.reply.listMsg;
				this.printUI = true;

				var base = this._url.getBaseParams();
				var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
				var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;

				var sqData ={};

			//if site parameter is enabled

			if(!this.__merciFunc.isEmptyObject(siteParams.isSQFlow) && !this.__merciFunc.isEmptyObject(rqstParams.selectedOfferBean)){
				var cabinClass= "Economy";
				if(rqstParams.selectedOfferBean.cabinClass =="J" || rqstParams.selectedOfferBean.cabinClass =="B"){
					cabinClass="Business";
				}else if (rqstParams.selectedOfferBean.cabinClass =="F"){
					cabinClass="First/Suite";
				}
				sqData['origin'] = rqstParams.selectedOfferBean.originLocationCode ;
				sqData['destination'] = rqstParams.selectedOfferBean.destinationLocationCode ;
				sqData['price'] = rqstParams.selectedOfferBean.price.toString()  ;
				sqData['currency'] = rqstParams.selectedOfferBean.currency ;
				sqData['cabin'] = cabinClass ;
				sqData['fareDealNumber'] = rqstParams.selectedOfferBean.offerId.toString() ;
				sqData['event'] = 'FareDeal' ;
			}

				// google analytics
				this.__ga.trackPage({
					domain: siteParams.siteGADomain,
					account: siteParams.siteGAAccount,
					gaEnabled: siteParams.siteGAEnable,
					sqData:sqData,
					page: ((this._isDealsFlow()) ? 'Fare Deals Search' : '1-AirSearch') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
					GTMPage: ((this._isDealsFlow()) ? 'Fare Deals Search' : '1-AirSearch') + '?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
				});

			}

			// for access by other templates
			this.moduleCtrl.bookingTemplate = this;
			this.createAwardAutoCompleteAria();

			// update class in body tag
				this.__merciFunc.updateBodyClass('booking sear');
		},

		/**
		 * this method checks the request parameter HIDE_BACK_BUTTON value
		 * if the value for this parameter is set to TRUE then back button is not shown in header
		 */
		_showHeaderButton: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			return this.__merciFunc.isEmptyObject(rqstParams.request) || rqstParams.request.HIDE_BACK_BUTTON != 'TRUE';
		},

		$viewReady: function() {
			this.toggleReturnJourney();

			// setting autocomplete if UI is ready to be printed
			// this will be set only after callback received with data
			if (document.getElementsByClassName('message info')[0] != null) {
				document.getElementsByClassName('message info')[0].style.display = "none";
			}
			if (this.printUI == true) {

				var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
				var base = this._url.getBaseParams();
				var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
				var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
				this.data.labels = labels;
				this.data.siteParams = siteParams;
				this.data.rqstParams = rqstParams;
				dateParam = siteParams.showNewDatePicker;
				addPax = siteParams.allowAddPax;
				if (this.__merciFunc.booleanValue(siteParams.enableLoyalty) == true && rqstParams.request.IS_USER_LOGGED_IN) {
					var bp = this._url.getBaseParams();
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

				// set details for header
					var headerButton = {};
						headerButton.scope = pageBookSearch;
						var arr = [];
					if (rqstParams.flow == 'DEALS_AND_OFFER_FLOW') {
						var arrShare = [];

						if (siteParams.siteAllowSocialMedia != undefined && siteParams.siteAllowSocialMedia.toLowerCase() == "true") {
							arr.push("shareButton");

							if (siteParams.siteAllowEmail != undefined && siteParams.siteAllowEmail.toLowerCase() == "true") {
								arrShare.push(["EMAIL", "mail", "icon-email"]);
							};

							if (siteParams.siteAllowSMS != undefined && siteParams.siteAllowSMS.toLowerCase() == "true") {
								arrShare.push(["SMS", "sms", "icon-sms"]);
							};

							if (siteParams.siteAllowFacebook != undefined && siteParams.siteAllowFacebook.toLowerCase() == "true") {
								arrShare.push(["FACEBOOK", "fb", "icon-facebook"]);
							};

							if (siteParams.siteAllowTwitter != undefined && siteParams.siteAllowTwitter.toLowerCase() == "true") {
								arrShare.push(["TWITTER", "tw", "icon-twitter"]);
							};

							if (siteParams.siteAllowLinkedIn != undefined && siteParams.siteAllowLinkedIn.toLowerCase() == "true") {
								arrShare.push(["LINKEDIN", "li", "icon-linkedin"]);
							};

							if (siteParams.siteAllowGooglePlus != undefined && siteParams.siteAllowGooglePlus.toLowerCase() == "true") {
								arrShare.push(["GOOGLEPLUS", "gp", "icon-google-plus"]);
							};
						};
						headerButton.shreButton = arrShare;


					} else {

						var siteParamShowCartVal = siteParams.siteShopBasket;
						var cart_array = siteParamShowCartVal.split(',');
						var showcart = false;
						for (var i = 0; i < cart_array.length; i++) {
							// Trim the excess whitespace.
							cart_array[i] = cart_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

							if (cart_array[i] == 'ALL' || cart_array[i] == 'SRCH') {
								showcart = true;
								break;
							}
						}
						if (showcart == true) {
							arr.push("CART");
						}
					}

						headerButton.button = arr;

					this.moduleCtrl.setHeaderInfo({
						title: labels.tx_merci_text_booking_advs_bookflight,
					bannerHtmlL: (rqstParams.isPopup != true)?rqstParams.bannerHtml:null,
					homePageURL: (rqstParams.isPopup != true)?siteParams.homeURL: null,
					showButton: (rqstParams.isPopup != true)?this._showHeaderButton(): true,
						companyName: siteParams.sitePLCompanyName,
					headerButton: (rqstParams.isPopup != true)?headerButton: null,
					loyaltyInfoBanner: (rqstParams.isPopup != true)?loyaltyInfoJson: null
					});


				localStorage.removeItem('orgCurrency');
				localStorage.removeItem('convCurrency');

				if (rqstParams.flow == 'DEALS_AND_OFFER_FLOW') {

					var cabinValue = '';
					var cabin = document.getElementById("CABIN_CLASS");
					var dealsCabinClass = rqstParams.selectedOfferBean.cabinClass;

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
					var formDom = document.getElementById(this.$getId("searchForm"));
					formDom.appendChild(m_Cabin);

				} else {
					this.updateDepartureDate();
				}

				this.initPage();

				// reset
				if (this.data.isAddPaxNav) {
					this.data.isAddPaxNav = false;
				}
				if (document.getElementById("offerContent") != null && document.getElementById("offerContent").innerHTML == "" && rqstParams.flow == 'DEALS_AND_OFFER_FLOW') {
					if (rqstParams.listofferbean.searchPageContent != " ") {
						document.getElementById("offerContent").innerHTML = "<aside class='panel'>" + rqstParams.listofferbean.searchPageContent + "</aside>";
					}
				}

				/* PTR - 07577835  start*/

				if (this.__merciFunc.booleanValue(siteParams.siteCustomJS) && jsonResponse.custJSLoaded != true) {


					var bp = this._url.getBaseParams();
					var custJSFile = bp[0] + "://" + bp[1] + bp[10] + "/" + bp[4] + "/" + bp[5] + "/static/css/MCUSTOMSRCHARIA_script.js";
					var custJS;
					custJS = document.createElement("script");

					// set attribute
					custJS.setAttribute("type", "text/javascript");
					custJS.setAttribute("src", custJSFile);


					// add to head
					document.getElementsByTagName("head")[0].appendChild(custJS);
					jsonResponse.custJSLoaded = true;


				}
				/* PTR - 07577835  start*/

				// PTR 07763888 start
				var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
				if (this.__merciFunc.booleanValue(siteParams.siteCustomJS) && jsonResponse.custJSLoaded == true) {
					if (typeof(callFunc) != 'undefined') {
						callFunc();
					}
				}
				// PTR 07763888 end

				var datePickID = ".search";
				$('.ui-datepicker-trigger').click(function() {
					$(datePickID).hide();
					$('#ui-datepicker-div').show();
					window.scrollTo(0, 0);
					if(pageBookSearch.__merciFunc.isRequestFromApps()==false){
						$('.banner').addClass('hideThis');
					}
				});

				$('body').attr('id', 'bsrch');
				var bp = this._url.getBaseParams();
				if (bp[14] != null && bp[14] != "") {
					this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
				}

				this.__prepopulateBLocation();
			}
			this.adjustDate(this.adjustArgs.dep);
			this.adjustDate(this.adjustArgs.arr);

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MBookSearch",
						data:this.data
					});
			}

			if($('#tab-3Content').length){this._mlcityAddRemlinks();}
			
		},
		_mlcityAddRemlinks : function(){
			var that = this;
			$('.mlremFlight').click(function(){
				//$(this).closest('section.mlcitySection').slideUp(200);
				//$('#mladdFlight'+(parseInt($(this).prop("id").slice(-1))-1)).show();
				that.__removeMultiCity(this.id.substring(this.id.length-1));
			});
			$('.mladdFlight').click(function(){
				$(this).hide();
				$(this).closest('section.mlcitySection').next('section.mlcitySection').slideDown(200);
			});

			var hide = [$('.mladdFlight')[0],$('.mlremFlight')[0],$('.mlremFlight')[1],$('.mladdFlight')[$('.mladdFlight').length-1]];
			$(hide).remove();
		},
		
		__removeMultiCity: function(city) {
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.showNewDatePicker;

			var flights = $('section.mlcitySection').filter(function() {
			    return $(this).css('display') == 'block';
			});
			var fromSectionId = ("B_LOCATION_MULTI_"+city+"_SRCH");
			var toSectionId = ("E_LOCATION_MULTI_"+city+"_SRCH");
			var fromSection = document.getElementById(fromSectionId);
			var toSection = document.getElementById(toSectionId);
			fromSection.value = "";
			toSection.value = "";
			city = parseInt(city);

			if(city>1){
				for(var i=city;i<=flights.length;i++){
						$("#B_LOCATION_MULTI_"+city+"_SRCH").val($("#B_LOCATION_MULTI_"+(city+1)+"_SRCH").val());
						$("#E_LOCATION_MULTI_"+city+"_SRCH").val($("#E_LOCATION_MULTI_"+(city+1)+"_SRCH").val());
						$("#datePickSearch"+city).datepicker('setDate', $("#datePickSearch"+(city+1)).datepicker('getDate'));
						
						if(showNewDtPicker == 'TRUE'){
							$("#datePickSearch"+city).next('.ui-datepicker-trigger').html($("#datePickSearch"+(city+1)).next('.ui-datepicker-trigger').html());
						}
						else {
							var selDate = $("#datePickSearch"+city).datepicker('getDate');
							var day = aria.utils.Date.format(selDate, 'dd');
							var month = aria.utils.Date.format(selDate, 'yyyyMM');
							
							$("#day_mlcity"+city).val(day);
							$("#month_mlcity"+city).val(month-1);

						}

					}
				$("#B_LOCATION_MULTI_"+flights.length+"_SRCH").val("");
				$("#E_LOCATION_MULTI_"+flights.length+"_SRCH").val("");
				$(flights[flights.length-1]).hide();

				flights = $('section.mlcitySection').filter(function() {
			    		return $(this).css('display') == 'block';
					});

				$("#mladdFlight"+[flights.length]).show();

			}
		},

		initPage: function() {
			var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.showNewDatePicker;
			this.initDate();
			if (showNewDtPicker == 'TRUE') {
				var strtDP = "#datePickSearchF";
				var endDP = "#datePickSearchT";
				var depDate = $(strtDP).datepicker('getDate');
				var arrDate = $(endDP).datepicker('getDate');
				var depSearchDate = "#depSearchdate";
				var retSearchDate = "#retSearchdate";

				// init departure date
				var a = $('.booking.sear .ui-datepicker-trigger')[0];
				depSearchDate = ".booking.sear #depSearchdate";
				retSearchDate = ".booking.sear #retSearchdate";

				$(a).attr("id", "depSearchdate");
				var defaultDay1 = aria.utils.Date.format(depDate, 'dd');
				var defaultYear1 = aria.utils.Date.format(depDate, 'yyyy');
				var defaultmonthinNo1 = aria.utils.Date.format(depDate, 'MM');
				$(depSearchDate).html("<time>" + this.__merciFunc.formatDate(depDate, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>");
				$(depSearchDate).attr("monindex", defaultmonthinNo1 + defaultYear1);
				$(depSearchDate).attr("day1", defaultDay1);

				// init arrival date
					var b = $('.ui-datepicker-trigger')[1];

				$(b).attr("id", "retSearchdate");
				var defaultDay2 = aria.utils.Date.format(arrDate, 'dd');
				var defaultYear2 = aria.utils.Date.format(arrDate, 'yyyy');
				var defaultmonthinNo2 = aria.utils.Date.format(arrDate, 'MM');
				$(retSearchDate).html("<time>" + this.__merciFunc.formatDate(arrDate, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>");
				$(retSearchDate).attr("monindex", defaultmonthinNo2 + defaultYear2);
				$(retSearchDate).attr("day2", defaultDay2);

				$(".datepicker").each(function(index, value) {
					var dayEL = $(this).next().next().next().val();
					var monthEL = $(this).next().next().val();
					var offSetDate = new Date((parseInt(monthEL.substring(4, 6)) + 1) + "/" + dayEL + "/" + monthEL.substring(0, 4));
					var mulDate = $(this).datepicker('setDate',offSetDate);
					var mulDate1 = $(this).datepicker('getDate');
					
					$(this).next('button').html("<time>" + pageBookSearch.__merciFunc.formatDate(mulDate1, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>");
					
				});

			}
		},

		initDate: function() {

			var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var retOffsetDate = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.returnDayRange;
			var siteAppCallback = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback;
			var showNewDtPicker = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.showNewDatePicker;
			var depOffsetDate = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.departureUIOffsetDate;
			var siteEnableCalMonth = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteEnableCalMonth;
			var strtDP = "#datePickSearchF";
			var endDP = "#datePickSearchT";
			var newDP = ".datepicker";
			var depSearchDate = "#depSearchdate";
			var retSearchDate = "#retSearchdate";
			var datePickID = ".search";
			if (this.__merciFunc.isRequestFromApps != true) {
				pageBookSearch.ENABLE_DEVICECAL = (document.getElementById("ENABLE_DEVICECAL") != null && document.getElementById("ENABLE_DEVICECAL").value === 'true'); //PTR 07766465
			};

			var buttonImgOnly = false;
			if (showNewDtPicker != 'TRUE') {
				buttonImgOnly = true;
			}

			var minimDateForCal = 0;
			var maximDateForCal = "+364D";
			var defaultDepCal = +0;
			var defaultRetCal = +364;			//Initialize all Date Pickers on the page

			// PTR 09331655 [Medium]: MeRCI R22 : PROD: TAB : SearchPage : Cal po-up retains old language | iPAD
			// localization fix
			var language = 'en';
			if (aria.core.environment.Environment.getLanguage() != null) {
				language = aria.core.environment.Environment.getLanguage();
				if (language.indexOf('_') !== -1) {
					language = language.substring(0, language.indexOf('_'));
				}
			}

			$(newDP).each(function(index, value) {
			    console.log('div' + index + ':' + $(this).attr('id')); 			

				$(this).datepicker({
				// beforeShowDay: unavailable,
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
					if (siteEnableCalMonth != null && siteEnableCalMonth.toLowerCase() == 'true' && rqstParams.request.client != null && rqstParams.request.client != '' && pageBookSearch.ENABLE_DEVICECAL) {
						var value = '';
							var dayEL = $(this).parent().prev('UL').find('select')[0];
							var monthEL = $(this).parent().prev('UL').find('select')[1];
							if (showNewDtPicker == 'TRUE') {
								var dayEL = $(this).next().next().next();
								var monthEL = $(this).next('input');
							}
						if (dayEL != null && monthEL != null) {
							// monthEL = parseInt(monthEL.value) + 1;
							value = monthEL.value + dayEL.value;

							window.location = siteAppCallback + "://?flow=searchpage/calendar_month=" + value + "&Month1";
							setTimeout(function() {
									$(this).datepicker('hide');
							}, 0);
						}
					}
				},
				onSelect: function() {

					// get date object
						var selDate = $(this).datepicker('getDate');
						var day = aria.utils.Date.format(selDate, 'dd');

						var dayEL = $(this).parent().prev('UL').find('select')[0];
						var monthEL = $(this).parent().prev('UL').find('select')[1];
						if (showNewDtPicker == 'TRUE') {
							var dayEL = $(this).next().next().next();
							var monthEL = $(this).next().next();
						}

						if (showNewDtPicker != 'TRUE') {
							if (parseInt(day) < 10) {
								day = day.substring(1, 2);
							}

							var month = aria.utils.Date.format(selDate, 'yyyyMM');
							
							$(dayEL).val(day);
							$(monthEL).val(month-1);
							
							if($(this).attr("id") == "datePickSearchF"){
								pageBookSearch.updateDepartureDate();
								var offSetDate = new Date(selDate.setDate(selDate.getDate() + parseInt(retOffsetDate)));
								$(endDP).datepicker('setDate', offSetDate);
							}

						//fix for PTR 09573854
						//var args = {"monthdd":"month1","daydd":"day1","datePick":"datePickSearchF"}

						//pageBookSearch.adjustDate(args);

					} else {

						// show selected date
						$(this).next().html("<time>" + pageBookSearch.__merciFunc.formatDate(selDate, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>");

						// display new return date
						if($(this).attr("id") == "datePickSearchF"){
							var returnDate = $(strtDP).datepicker('getDate');
							var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
							$(endDP).datepicker('setDate', offSetDate);
							$(retSearchDate).html("<time>" + pageBookSearch.__merciFunc.formatDate(offSetDate, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>");

							// update return date
							var retdayId = document.getElementById("day2");
							if (retdayId != null) {
								retdayId.value = aria.utils.Date.format(offSetDate, 'dd');
							}
							var retmonthId = document.getElementById("month2");
							if (retmonthId != null) {
								retmonthId.value = aria.utils.Date.format(offSetDate, 'yyyyMM') - 1;
							}
						}
						
							// update departure date
							var dayEL = $(this).next().next().next();
							var monthEL = $(this).next().next();

							var depdayId = dayEL;
							if (depdayId != null) {
								depdayId.val(day);
							}
							var depmonthId = monthEL;
							if (depmonthId != null) {
								depmonthId.val(aria.utils.Date.format(selDate, 'yyyyMM') - 1);
							}

					

						

						
					}

					$(datePickID).show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				},
				onClose: function() {
					$(datePickID).show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				}
			});
					var todayDate = new Date();
					var offSetDate = new Date(todayDate.setDate(todayDate.getDate() + parseInt(depOffsetDate)));
					$(this).datepicker('setDate', offSetDate);

				// PTR 09331655 [Medium]: MeRCI R22 : PROD: TAB : SearchPage : Cal po-up retains old language | iPAD
				// localization fix
				$(this).datepicker('option', $.datepicker.regional[ language || navigator.language || navigator.userLanguage || 'en' ]);
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

			if ($(retSearchDate).val() == null && $(depSearchDate).val() == null) {
				if (storedDay1 != null && storedMonth1 != null) {
					var offSetDate = new Date((parseInt(storedMonth1.substring(4, 6)) + 1) + "/" + storedDay1 + "/" + storedMonth1.substring(0, 4));
				} else {
					var todayDate = new Date();
					var offSetDate = new Date(todayDate.setDate(todayDate.getDate() + parseInt(depOffsetDate)));
				}

				$(strtDP).datepicker('setDate', offSetDate);

				if (storedDay2 != null && storedMonth2 != null) {
					var retDt = new Date((parseInt(storedMonth2.substring(4, 6)) + 1) + "/" + storedDay2 + "/" + storedMonth2.substring(0, 4));
				} else {
					var retDt = new Date(offSetDate.setDate(offSetDate.getDate() + parseInt(retOffsetDate)));
				}

				$(endDP).datepicker('setDate', retDt);
			}

			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.flow == 'DEALS_AND_OFFER_FLOW') {
				var selectedOffer = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.selectedOfferBean;
				var advPurc = "+" + selectedOffer.advancedPurchase + selectedOffer.advancedPurchaseUnits;
				var maxRetDate = "+" + selectedOffer.maximumStay + selectedOffer.maximumStayUnit;
				var strtDate = selectedOffer.travelStart.split(" ");
				var endDate = selectedOffer.travelEnd.split(" ");

				var dealStrt = new Date(strtDate[0]);
				var dealEnd = new Date(endDate[0]);

				if (dealStrt > new Date()) {
					/* Set min date for datePickers, if it is greater than the current date */
					$(strtDP).datepicker('option', 'minDate', dealStrt);
					$(endDP).datepicker('option', 'minDate', dealStrt);
				} else {
					/* Set default departure date taking advancedPurchase into consideration */
					$(strtDP).datepicker('option', 'defaultDate', advPurc);
					/* Set default return date taking advancedPurchase and maximumStay into consideration */
					$(endDP).datepicker('option', 'defaultDate', advPurc + maxRetDate);
				}

				/* Set maximum date for datePickers */
				$(strtDP).datepicker('option', 'maxDate', dealEnd);
				$(endDP).datepicker('option', 'maxDate', dealEnd);

				/* if departure date was stored */
				if (storedDay1 != null && storedMonth1 != null) {
					dealStrt = new Date((parseInt(storedMonth1.substring(4, 6)) + 1) + "/" + storedDay1 + "/" + storedMonth1.substring(0, 4));
				}

				if (dealStrt > new Date()) {
					$(strtDP).datepicker('setDate', dealStrt);
				} else {
					$(strtDP).datepicker('setDate', advPurc);
				}

				/* if return date was stored */
				if (storedDay2 != null && storedMonth2 != null) {
					dealEnd = new Date((parseInt(storedMonth2.substring(4, 6)) + 1) + "/" + storedDay2 + "/" + storedMonth2.substring(0, 4));
					$(endDP).datepicker('setDate', dealEnd);
				} else {
					/* Set default return date to maximum stay period */
					$(endDP).datepicker('setDate', advPurc + maxRetDate + "-1d");
				}
			}

			if (showNewDtPicker == 'TRUE') {
				var depdayId = document.getElementById("day1");
				var depmonthId = document.getElementById("month1");
				var retdayId = document.getElementById("day2");
				var retmonthId = document.getElementById("month2");

					depdayId.value = $.datepicker.formatDate('dd', $(strtDP).datepicker('getDate'));;
					depmonthId.value = $.datepicker.formatDate('yymm', $(strtDP).datepicker('getDate')) - 1;
					retdayId.value = $.datepicker.formatDate('dd', $(endDP).datepicker('getDate'));
					retmonthId.value = $.datepicker.formatDate('yymm', $(endDP).datepicker('getDate')) - 1;
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
			document.getElementById('E_LOCATION_1_SRCH').value = entry.to;
			if ((document.getElementById('C_LOCATION_1') != null)) {
				document.getElementById('C_LOCATION_1').value = entry.to;
			}

			/*added as part of PTR : 08153609*/

			if (document.getElementById('CABIN_CLASS') == null) {
				$("#COMMERCIAL_FARE_FAMILY_1 option[value='" + entry.cabin + "']").attr('selected', true);
			} else {
				$("#CABIN_CLASS option[value='" + entry.cabin + "']").attr('selected', true);
			}

			if (document.getElementById('DATE_RANGE_VALUE_1') != null) {
				document.getElementById('DATE_RANGE_VALUE_1').checked = (entry.flexi == true) ? true : false;
			}
			if (addPax == 'TRUE') {
				pageBookSearch.setPaxDetails(entry);
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
				pageBookSearch.setPaxDetails(entry);
			}
			//document.getElementById(entry.trip_type).checked = true
			pageBookSearch.toggleReturnJourney();
			setDt1.setFullYear(entry.dep_date.substring(0, 4), entry.dep_date.substring(4, 6), entry.dep_date.substring(6, entry.dep_date.length));
			setDt2.setFullYear(entry.ret_date.substring(0, 4), entry.ret_date.substring(4, 6), entry.ret_date.substring(6, entry.ret_date.length));
			if (dateParam != "TRUE") {
				pageBookSearch.setDatesOld(setDt1, 'day1', 'month1', entry.dep_date, today);
				pageBookSearch.setDatesOld(setDt2, 'day2', 'month2', entry.ret_date, today);
			} else {
				pageBookSearch.setDatesNew(setDt1, 'day1', 'month1', 'datePickSearchF', today, 'depSearchdate');
				pageBookSearch.setDatesNew(setDt2, 'day2', 'month2', 'datePickSearchT', today, 'retSearchdate');
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
			var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
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
			$("#" + route).html(("<time>" + this.__merciFunc.formatDate(setDt, labels.tx_merci_pattern_DayDateFullMonthYear) + "</time>"));
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
			this._url.makeServerRequest(request, false);
		},
		__onFareCondCB: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					// setting data for next page
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

				var depUIOffset = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.returnDayRange;
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
			if(document.getElementById("tripType")!=null){
				var radio = document.getElementById("tripType").value;
				
				$('.tab-link.mlcity').removeClass('active');	
				$('.tab-content.mlcity').removeClass('current');				
				
				if (radio == 'O') {
					retJourney.style.display = "none";
					$('#tab-1').addClass('active');
					$("#tab-1Content").addClass("current");
					$("#tab-3Content").removeClass("current");
					$('.flexible').show();
				} else if (radio == 'R'){
					// remove display style
					retJourney.style.display = "";
					$('#tab-2').addClass('active');	
					$("#tab-1Content").addClass("current");
					$("#tab-3Content").removeClass("current");
					$('.flexible').show();
				}
				else if (radio == 'M'){
					$('.flexible').hide();
					$('#tab-3').addClass('active');	
					$("#tab-3Content").addClass("current");
					$("#tab-1Content").removeClass("current");	
				}

			}			

			// PTR 07763888 start

			var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			if (this.__merciFunc.booleanValue(siteParams.siteCustomJS) && jsonResponse.custJSLoaded == true) {
				if (typeof(callFunc) != 'undefined') {
					callFunc();
				}
			}

			// PTR 07763888 end
		},
		onJourneyTypeClick: function(event,args){
			document.getElementById("tripType").value = args.val;				

			this.toggleReturnJourney();
		},

		/**
		 * decides whether awards flow is allowed
		 * @return true if enabled
		 */
		isAwardsFlowAllowed: function() {

			// set data reference
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;

			// calculate
			var isLoyaltyEnabled = siteParameters.enableLoyalty == "TRUE" && this.__merciFunc.booleanValue(rqstParams.request.IS_USER_LOGGED_IN);
			var isAwardsEnabled = siteParameters.allowMCAwards == 'TRUE' && (rqstParams.enableDirectLogin == 'YES' || siteParameters.allowGuestAward == 'TRUE');

			return isLoyaltyEnabled || (isAwardsEnabled && !this._isDealsFlow());
		},

		/**
		 * function called when search page is submitted
		 * @param event Event Information
		 * @param args JSON parameters
		 */
		onSearchClick: function(event, args) {

			// stop form submission
			event.preventDefault();
			var trip_type= $('#tripType').val();

			if(trip_type == 'M'){
				this._setMultiCityParams();
			}

			if (typeof customSearchClick != 'undefined') {
				customSearchClick(pageBookSearch, event, args);
			} else {
			// reset error
			this.data.errors = new Array();

			var bLocation = document.getElementById('B_LOCATION_1_SRCH');
			var eLocation = document.getElementById('E_LOCATION_1_SRCH');
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var onOffSwitch = document.getElementById('myonoffswitch');
			var bp = this._url.getBaseParams();
			// copy values
			if(trip_type == 'M'){
				for(var i=1;i<=6;i++){
					this.__swapValues(i);
				}
			}
			else {
				this.__swapValues(1);
			}
			
			// local storage
			this.storeSearchPageValues();

			var isSubmit = true;
			if (rqstParams.flow == 'DEALS_AND_OFFER_FLOW') {
				isSubmit = this.__validateDealParams();
			}

				isSubmit = this.__validateBounds(bLocation, eLocation);
			isSubmit = this.__validateMinLength(bLocation, eLocation);
			if (rqstParams.flow != 'DEALS_AND_OFFER_FLOW' && !args.isDealsFlow) {
				isSubmit = this.__validateDepArrList(bLocation, eLocation, bp[14], rqstParams, siteParameters);
			}
			isSubmit = this.__validateTotalPax(siteParameters.numOfTrav);
			isSubmit = this.validateAdtInfant();
			if (onOffSwitch != null && onOffSwitch.checked == true && siteParameters.allowMCAwards == 'TRUE' && ((rqstParams.enableDirectLogin == 'YES' && rqstParams.flow == 'DEALS_AND_OFFER_FLOW') || siteParameters.allowGuestAward == 'TRUE')) {
				isSubmit = this.__validateAwrdNomiees(rqstParams.adtNominee, rqstParams.chdNominee);
			}

			if (isSubmit) {
				this.__validateSearchParams(args);
				var formDom = document.getElementById(this.$getId("searchForm"));
				var request = {
					formObj: formDom,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__onAvailabilityCallBack,
						scope: this
					},
					loyaltyInfoPassed: true
				}

				if (this.isAwardsFlowAllowed()) {

					var value = ['-', '-'];
					if (onOffSwitch != null && onOffSwitch.checked == true && siteParameters.siteMCAwrdSite != null && siteParameters.siteMCAwrdSite != '') {
						value = siteParameters.siteMCAwrdSite.split('-');
					} else {
						if (siteParameters.siteMCRevenueSite != null && siteParameters.siteMCRevenueSite != '') {
							value = siteParameters.siteMCRevenueSite.split('-');
						}
					}

					// set request data
					request.isCompleteURL = true;
					request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + value[0] + "/" + args.action + ";jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + value[1] + "&LANGUAGE=" + bp[12];

					// COUNTRY_SITE
					if (bp[13] != null && bp[13] != '') {
						request.action += "&COUNTRY_SITE=" + bp[13];
					}

					// CLIENT
					if (bp[14] != null && bp[14] != '') {
						request.action += "&client=" + bp[14];
					}
					/*CR 1707950 ** */
					if (bp[16] != null && bp[16] != '') {
						request.action += "&PREF_AIR_FREQ_AIRLINE_1_1=" + bp[16];
					}
					if (bp[17] != null && bp[17] != '') {
						request.action += "&PREF_AIR_FREQ_MILES_1_1=" + bp[17];
					}
					if (bp[18] != null && bp[18] != '') {
						request.action += "&PREF_AIR_FREQ_LEVEL_1_1=" + bp[18];
					}
					if (bp[19] != null && bp[19] != '') {
						request.action += "&PREF_AIR_FREQ_OWNER_TITLE_1_1=" + bp[19];
					}
					if (bp[20] != null && bp[20] != '') {
						request.action += "&PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1=" + bp[20];
					}
					if (bp[21] != null && bp[21] != '') {
						request.action += "&PREF_AIR_FREQ_OWNER_LASTNAME_1_1=" + bp[21];
					}
					if (bp[22] != null && bp[22] != '') {
						request.action += "&PREF_AIR_FREQ_NUMBER_1_1=" + bp[22];
					}
					/*END CR 1707950 ** */



				} else {
					// if awards is not enabled
					request.action = args.action;
				}

				// start an Ajax request
				this._url.makeServerRequest(request, true);
			} else {
				window.scrollTo(0, 0);
				//log the errors
				if(!this.__merciFunc.isEmptyObject(this.data.errors)){
					for(var i=0; i<this.data.errors.length; i++){
						aria.core.Log.error('MBookSearchScript', "(onSearchClick): "+this.data.errors[i].TEXT ,[],'E');
					}
				}
				aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},

		__onAvailabilityCallBack: function(response, inputParams) {

			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

			// if booking data is available
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null && dataId != 'MSRCH_A') {

				// will be null in case page already navigated
				if (this.moduleCtrl != null) {

					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;

					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			} else {

				// displaying error on UI if any from BE
				if (!this.__merciFunc.isEmptyObject(response.responseJSON.data.booking.MSRCH_A.requestParam.reply.listMsg)) {

					// scroll to top
					window.scrollTo(0, 0);

					// set errors and refresh
					this.data.errors = response.responseJSON.data.booking.MSRCH_A.requestParam.reply.listMsg;
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},
		_setMultiCityParams : function(){
			var cityPair = parseInt(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.multicityMaxCityPair);

			for(var i=1;i<=cityPair;i++){

				//var d = $('#datePickSearch'+i).val().split('/');
				if(document.getElementById('datePickSearch'+i) != null)
				{
					var d = $.datepicker.formatDate('yymmdd', $('#datePickSearch'+i).datepicker('getDate'));
					d = /*d[2]+d[0]+d[1]*/d+'0000';
					if($("#B_DATE_"+i).length>0){
						$("#B_DATE_"+i).val(d);
					}
					else{
						$('<input type="hidden" id="B_DATE_'+i+'" name="B_DATE_'+i+'" value ="'+d+'" />').appendTo('form[name=searchForm]');
					}

					if($("#B_LOCATION_"+i+"_SRCH").length>0){
						$("#B_LOCATION_"+i+"_SRCH").val($("#B_LOCATION_MULTI_"+i+"_SRCH").val());
					}
					else{
						$('<input type="hidden" id="B_LOCATION_'+i+'_SRCH" name="B_LOCATION_'+i+'" value="'+$("#B_LOCATION_MULTI_"+i+"_SRCH").val()+'" />').appendTo('form[name=searchForm]');
					}

					if($("#E_LOCATION_"+i+"_SRCH").length>0){
						$("#E_LOCATION_"+i+"_SRCH").val($("#E_LOCATION_MULTI_"+i+"_SRCH").val());
					}
					else{
						$('<input type="hidden" id="E_LOCATION_'+i+'_SRCH" name="E_LOCATION_'+i+'" value="'+$("#E_LOCATION_MULTI_"+i+"_SRCH").val()+'" />').appendTo('form[name=searchForm]');
					}
				}
				
			}

		},
		__resetInput: function(inputId) {

			var result = "";
			if( (typeof customerAppData !="undefined") && (pageBookSearch.__merciFunc.isRequestFromApps()==true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length>0){
				result = document.getElementById(inputId).value;
			}else{
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
					} else if (this._isCountryListAvailable == true && document.getElementById(inputId).value!="") {
						result = this._countryList[document.getElementById(inputId).value];
					}
				}
				result = result.toUpperCase();
			}
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
		 * this function will copy value from A_LOCATION_1 to B_LOCATION_1_SRCH and from
		 * C_LOCATION_1 to E_LOCATION_1_SRCH so that proper request can be created
		 */
		__swapValues: function(i) {

			var bLocation = document.getElementById('B_LOCATION_'+i+'_SRCH');
			var aLocation = document.getElementById('A_LOCATION_'+i);
			var eLocation = document.getElementById('E_LOCATION_'+i+'_SRCH');
			var cLocation = document.getElementById('C_LOCATION_'+i);

			if (bLocation != null && bLocation.value != "") {
				bLocation.value = this.__resetInput('B_LOCATION_'+i+'_SRCH');
				if (bLocation.value == '' && aLocation != null && aLocation.value!= '') {
					bLocation.value = this.__resetInput('A_LOCATION_'+i);
					aLocation.value = bLocation.value;
				}
			}

			if (eLocation != null && eLocation.value != "") {
				eLocation.value = this.__resetInput('E_LOCATION_'+i+'_SRCH');
				if (eLocation.value == '' && cLocation != null && cLocation.value != '') {
					eLocation.value = this.__resetInput('C_LOCATION_'+i);
					cLocation.value = eLocation.value;
				}
			}
		},

		__validateSearchParams: function(args) {
			if (document.getElementById('COMMERCIAL_FARE_FAMILY_1')) {
				var cabinValue = $('#COMMERCIAL_FARE_FAMILY_1 option:selected').text();
			} else {
				var cabinValue = $('#CABIN_CLASS option:selected').text();
			}
			document.getElementById("CABIN_CLASS_SELECTED").value = cabinValue;

			var tripTypeValue = "";
			if (document.getElementById("tripType") != null) {
				tripTypeValue = $('#tripType').val();
			}
			

			var tripTypeEL = document.getElementById('SEARCH_TRIP_TYPE');
			if (tripTypeEL == null) {
				tripTypeEL = document.createElement('input');
				tripTypeEL.type = 'hidden';
				tripTypeEL.id = 'SEARCH_TRIP_TYPE';
				tripTypeEL.name = 'TRIP_TYPE';
				tripTypeEL.value = tripTypeValue;
				var formDom = document.getElementById(this.$getId("searchForm"));
				if(!formDom || typeof(formDom)!= "undefined"){
					formDom = document.searchForm;
				}
				formDom.appendChild(tripTypeEL);
			} else {
				tripTypeEL.value = tripTypeValue;
			}

			var srchToAvailEL = document.getElementById('SEARCHTOAVAIL_PAGE');
			if (document.getElementById('DATE_RANGE_VALUE_1') != null && document.getElementById('DATE_RANGE_VALUE_1').checked == true) {
				document.getElementById('DATE_RANGE_VALUE_1').value = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.dateRangeChkboxValue;
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

			var addPax = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowAddPax;
			if (addPax == 'TRUE') {
				if (document.getElementById("paxTypeAdult").className.indexOf('hidden') != -1) {
					document.getElementById("FIELD_ADT_NUMBER").removeAttribute("name");
				}
			}
		},

		__validateBounds: function(bLocation, eLocation) {
			bLocationVal = this.__resetInput('B_LOCATION_1_SRCH');
			eLocationVal = this.__resetInput('E_LOCATION_1_SRCH');
			var validateString = 'true';

			var validateFromList = true;
			var validateToList = true;

			if (bLocation != null) {
				bLocationVal.replace(' ', '');
				validateString = this.__isString(bLocationVal);

				if(this.isAwardsFlowEnabled() && !this.__merciFunc.isEmptyObject(this.data.awards)){
					validateFromList=false;
					for( var i in this.data.awards.autocompleteListFromField){
						if(bLocationVal==this.data.awards.autocompleteListFromField[i].code){
							validateFromList=true;
							break;
						}
					}
				}
				else if(!this.__merciFunc.isEmptyObject(this.data.rqstParams.beginLocations)){
					validateFromList=false;
					for( var i in this.data.rqstParams.beginLocations){
						if(bLocationVal==this.data.rqstParams.beginLocations[i].locationCode){
							validateFromList=true;
							break;
						}
					}
				}

				if (bLocationVal == '' || validateString == 'false' || !validateFromList) {
					this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[2130258].localizedMessage);
				}
			}

			if (eLocation != null) {
				eLocationVal.replace(' ', '');
				validateString = this.__isString(eLocationVal);

				if(this.isAwardsFlowEnabled() && !this.__merciFunc.isEmptyObject(this.data.awards)){
					validateToList=false;
					for( var i in this.data.awards.autocompleteListToField){
						if(eLocationVal==this.data.awards.autocompleteListToField[i].code){
							validateToList=true;
							break;
						}
					}
				}
				else if(!this.__merciFunc.isEmptyObject(this.data.rqstParams.endLocations)){
					validateToList=false;
					for( var i in this.data.rqstParams.endLocations){
						if(eLocationVal==this.data.rqstParams.endLocations[i].locationCode){
							validateToList=true;
							break;
						}
					}
				}

				if (eLocationVal == '' || validateString == 'false' || !validateToList) {
					this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[2130259].localizedMessage);
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
			bLocationVal = this.__resetInput('B_LOCATION_1_SRCH');
			eLocationVal = this.__resetInput('E_LOCATION_1_SRCH');
			if (bLocation != null) {
				bLocationVal.replace(' ', '');
				if (bLocationVal.length > 0 && bLocationVal.length < 3) {
					this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[2130186].localizedMessage);
				}
			}

			if (eLocation != null) {
				eLocationVal.replace(' ', '');
				if (eLocationVal.length > 0 && eLocationVal.length < 3) {
					this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[2130188].localizedMessage);
				}
			}

			// if no error return true
			return this.data.errors.length == 0;
		},
		__validateDepArrList: function(bLocation, eLocation, client, rqstParams, siteParameters) {
			var storeWebSrchValue = false;
			var storeAppSrchValue = false;

			if ((siteParameters.siteRetainSearch == "TRUE") && (null == client || client == "") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == undefined)) {
				storeWebSrchValue = true;
			} else if (siteParameters.siteRetainSearch == "TRUE" && null != client && client != "" && rqstParams.retainAppCriteria == "TRUE") {
				storeAppSrchValue = true;
			} else if (jsonResponse.ui.REMEMBER_SRCH_CRITERIA == true) {
				storeWebSrchValue = true;
			}

			if (storeWebSrchValue || storeAppSrchValue) {
				bLocationVal = this.__resetInput('B_LOCATION_1_SRCH');
				eLocationVal = this.__resetInput('E_LOCATION_1_SRCH');
				if (storeWebSrchValue) {
					this.__store_airline_codes(bLocationVal, "DepJson");
				}
				var frmAppCall = this.__store_search_criteria(bLocationVal, eLocation.value, storeWebSrchValue, storeAppSrchValue);
				if (storeAppSrchValue) {
					this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback, "://?flow=searchpage/remember=From:" + bLocationVal + "=" + frmAppCall);
					if ($('#app_json_data').val() != undefined && "" != $('#app_json_data').val()) {
						var rmbrsrchappjson = JSON.parse($('#app_json_data').val());
						if (rmbrsrchappjson != null) {
							var rmbrsrchdepjson = rmbrsrchappjson.DepJson;
							if (rmbrsrchdepjson != null) {
								if (rmbrsrchdepjson.indexOf(bLocationVal) == -1) {
									var cntryarray = rmbrsrchdepjson.split(",");
									cntryarray.push(bLocationVal);
									cntryarray = cntryarray + "";
									rmbrsrchappjson.DepJson = cntryarray;
									rmbrsrchappjson = JSON.stringify(rmbrsrchappjson);
									$('#app_json_data').val(rmbrsrchappjson);
								}
							}
						}
					}
				}
			}
			return true;
		},

		__store_airline_codes: function(loc, itemVal) {

			var arr = [],
				match = false;

			result = pageBookSearch.__merciFunc.getStoredItem(itemVal);
			if (result != null && result != "" && result != "{}") {
				arr = JSON.parse(result);
			}
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == loc) {
					match = true;
					break;
				}
			}

			if (!match) {
				arr.unshift(loc);
			}
			pageBookSearch.__merciFunc.storeLocal(itemVal, JSON.stringify(arr), "overwrite", "text");

		},

		__store_search_criteria: function(loc, eLoc, web, app) {

			var dep = document.getElementById('month1').value + "" + document.getElementById('day1').value;
			var ret = document.getElementById('month2').value + "" + document.getElementById('day2').value;
			var beginLoc = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.globalList.airportList;
			var trip = document.getElementById('tripType').value;
			var values = {}
			beginLoc.forEach(function(val){
			    values[val[0]] = val[1];
			})
			/*added as a part of PTR : 08153609*/

			if (document.getElementById('CABIN_CLASS') == null) {
				var cabin_val = document.getElementById('COMMERCIAL_FARE_FAMILY_1').value;
				var class_full = document.getElementById('COMMERCIAL_FARE_FAMILY_1').options[document.getElementById('COMMERCIAL_FARE_FAMILY_1').selectedIndex].text;
			    var cabinIndex = document.getElementById('COMMERCIAL_FARE_FAMILY_1').selectedIndex;
			} else {
				var cabin_val = document.getElementById('CABIN_CLASS').value;
				var class_full = document.getElementById('CABIN_CLASS').options[document.getElementById('CABIN_CLASS').selectedIndex].text;
				var cabinIndex = document.getElementById('CABIN_CLASS').selectedIndex;
			}

			var fromEntry = {
				to: eLoc,
				dep_date: dep,
				ret_date: ret,
				trip_type: trip,
				flexi: (document.getElementById('DATE_RANGE_VALUE_1') != null ? document.getElementById('DATE_RANGE_VALUE_1').checked : ""),
				cabin: cabin_val,
				adt: (document.getElementById('FIELD_ADT_NUMBER') != null ? document.getElementById('FIELD_ADT_NUMBER').value : ""),
				chd: (document.getElementById('FIELD_CHD_NUMBER') != null && !($('#paxTypeChild').hasClass('hidden'))? document.getElementById('FIELD_CHD_NUMBER').value : ""),
				inf: (document.getElementById('FIELD_INFANTS_NUMBER') != null && !($('#paxTypeInfant').hasClass('hidden')) ? document.getElementById('FIELD_INFANTS_NUMBER').value : ""),
				stu: (document.getElementById('FIELD_STU_NUMBER') != null ? document.getElementById('FIELD_STU_NUMBER').value : ""),
				ycd: (document.getElementById('FIELD_YCD_NUMBER') != null ? document.getElementById('FIELD_YCD_NUMBER').value : ""),
				yth: (document.getElementById('FIELD_YTH_NUMBER') != null ? document.getElementById('FIELD_YTH_NUMBER').value : ""),
				mil: (document.getElementById('FIELD_MIL_NUMBER') != null ? document.getElementById('FIELD_MIL_NUMBER').value : ""),
				fromFull: (values[loc] != undefined ? values[loc].split(',')[0] : ""),
				toFull: (values[eLoc] != undefined ? values[eLoc].split(',')[0] : ""),
				classFull: ((class_full != null || class_full != "") ? class_full : ""),
				classIndex: cabinIndex
			};
			if (app) {
				return JSON.stringify(fromEntry);
			} else {

				pageBookSearch.__merciFunc.storeLocal("From:" + loc, JSON.stringify(fromEntry), "overwrite", "text");
				return true;
			}
		},

		__validateDealParams: function() {

			// get JSON reference
			var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
			var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var errorStrings = this.moduleCtrl.getModuleData().booking.MSRCH_A.errors;

			// create a date object
			var currDt = rqstParams.listofferbean.currentDate;
			var currDtLen = rqstParams.listofferbean.currentDate.length;
			var today = new Date(currDt.substring(currDtLen - 4, currDtLen), this._convertMonthToInt(currDt.substring(2, currDtLen - 4)), currDt.substring(0, 2), 0, 0, 0);
			var formDom = document.getElementById(this.$getId("searchForm"));

			var showNewDtPicker = siteParams.showNewDatePicker;
			var m_bLoc = document.createElement('input');
			m_bLoc.type = 'hidden';
			m_bLoc.name = 'B_LOCATION_1';
			m_bLoc.value = rqstParams.selectedOfferBean.origin.code;
			formDom.appendChild(m_bLoc);

			var m_eLoc = document.createElement('input');
			m_eLoc.type = 'hidden';
			m_eLoc.name = 'E_LOCATION_1';
			m_eLoc.value = rqstParams.selectedOfferBean.destination.code;
			formDom.appendChild(m_eLoc);

			var t_type = document.createElement('input');
			t_type.type = 'hidden';
			t_type.name = 'TRIP_TYPE';
			t_type.value = rqstParams.selectedOfferBean.tripTypes[0];
			formDom.appendChild(t_type);

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
			var depInvalidDates = rqstParams.invalidDatesDeals.DEPARTURE_INVALID_DATES;
			for (i = 0; i < depInvalidDates.length; i++) {

				// create date object
				var dtParams = depInvalidDates[i].replace(/'/g, '').split('/');
				var date = new Date(dtParams[0], dtParams[1], dtParams[2], 0, 0, 0);

				if (date.getTime() == depSelDt.getTime()) {
					blackOutErr = true;
					this.__addErrorMessage(errorStrings[204].localizedMessage + " (" + errorStrings[204].errorid + ")");
					break;
				}
			}

			var advancedPurchase = rqstParams.selectedOfferBean.advancedPurchase;
			var timeDiff = (depSelDt.getTime() - today.getTime()) / (1000 * 3600 * 24);

			if (timeDiff < advancedPurchase) {
				this.__addErrorMessage(labels.tx_merci_text_adv_purchase + " " + advancedPurchase + " " + labels.tx_merci_text_days + " " + errorStrings[210].localizedMessage + " (" + errorStrings[210].errorid + ")");
			}

			if (rqstParams.selectedOfferBean.tripTypes[0] == 'R') {

				var minStay = rqstParams.selectedOfferBean.minimumStay;
				var minStayUnit = rqstParams.selectedOfferBean.minimumStayUnit;
				var maxStay = rqstParams.selectedOfferBean.maximumStay;
				var maxStayUnit = rqstParams.selectedOfferBean.maximumStayUnit;

				if (!blackOutErr) {

					var retInvalidDates = rqstParams.invalidDatesDeals.RETURN_INVALID_DAYS;
					for (i = 0; i < retInvalidDates.length; i++) {

						// create date object
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

			// if no error return true
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
			// if errors is empty
			if (this.data.errors == null) {
				this.data.errors = new Array();
			}
			// create JSON and append to errors
			var error = {
				'TEXT': message
			};
			this.data.errors.push(error);
		},

		__validateTotalPax: function(varMaxNumOfTrav) {
			var totalNumOfPax;
			var allowStudent = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowStudent;
			var allowSenior = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowSenior;
			var allowYouth = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowYouth;
			var allowMilitary = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowMilitary;


			//Get count of adults and child.
			var varIntComboADT = this.convertPaxNoToInt('FIELD_ADT_NUMBER', 'Adult');
			var varIntComboCHD = this.convertPaxNoToInt('FIELD_CHD_NUMBER', 'Child');
			// CR:6264064--------------------------
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
			//Total number of pax = Adult + Children. Fix as part of ptr: 04471133
			var totalNumOfPax = varIntComboADT + varIntComboCHD + varIntComboSTU + varIntComboYCD + varIntComboYTH + varIntComboMIL;
			//-----------------------------------CR6264064------------------
			if (totalNumOfPax > varMaxNumOfTrav) {
				this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.labels.tx_merci_text_booking_max_allow_pax + " " + varMaxNumOfTrav);
			}
			if (this.data.errors.length != 0) {
				return false;

			}
			return true;
		},

		validateAdtInfant: function() {
			var allowStudent = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowStudent;
			var allowSenior = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowSenior;
			var allowYouth = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowYouth;
			var allowMilitary = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowMilitary;
			//Get count of adults and infants.
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
				this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[5121].localizedMessage);
			}

			return this.data.errors.length == 0;
		},

		__validateAwrdNomiees: function(adtNominee, chdNominee) {

			var chdNumber = 0;
			var adtNumber = 0;
			var fieldChdNoEL = document.getElementById('FIELD_CHD_NUMBER');
			var fieldAdtNoEL = document.getElementById('FIELD_ADT_NUMBER');
			var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;

			// if adult selected
			if (fieldAdtNoEL != null) {
				try {
					adtNumber = parseInt(fieldAdtNoEL.value);
				} catch (e) {
					adtNumber = 0;
				}
			}

			// if child selected
			if (fieldChdNoEL != null) {
				try {
					if (siteParams.allowAddPax != null && siteParams.allowAddPax.toLowerCase() == 'true') {
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

			// if number of selected adult or child is more than nominee
			if (adtNominee < adtNumber || chdNominee < chdNumber) {
				this.__addErrorMessage(this.moduleCtrl.getModuleData().booking.MSRCH_A.labels.tx_merci_nominee_error);
			}

			// return true if no error
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

			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;

			if (document.getElementById("B_LOCATION_1_SRCH") != null) {
				this.__merciFunc.storeLocal("B_LOCATION_1_SRCH", document.getElementById("B_LOCATION_1_SRCH").value, "overwrite", "text");
			}

			if (document.getElementById("E_LOCATION_1_SRCH") != null) {
				this.__merciFunc.storeLocal("E_LOCATION_1_SRCH", document.getElementById("E_LOCATION_1_SRCH").value, "overwrite", "text");
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

			if (siteParameters.allowInfant != null && siteParameters.allowInfant.toLowerCase() == "true" && document.getElementById("FIELD_INFANTS_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_INFANTS_NUMBER", document.getElementById("FIELD_INFANTS_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParameters.allowStudent != null && siteParameters.allowStudent.toLowerCase() == "true" && document.getElementById("FIELD_STU_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_STU_NUMBER", document.getElementById("FIELD_STU_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParameters.allowSenior != null && siteParameters.allowSenior.toLowerCase() == "true" && document.getElementById("FIELD_YCD_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_YCD_NUMBER", document.getElementById("FIELD_YCD_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParameters.allowYouth != null && siteParameters.allowYouth.toLowerCase() == "true" && document.getElementById("FIELD_YTH_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_YTH_NUMBER", document.getElementById("FIELD_YTH_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (siteParameters.allowMilitary != null && siteParameters.allowMilitary.toLowerCase() == "true" && document.getElementById("FIELD_MIL_NUMBER") != null) {
				this.__merciFunc.storeLocal("FIELD_MIL_NUMBER", document.getElementById("FIELD_MIL_NUMBER").selectedIndex, "overwrite", "text");
			}

			if (document.getElementById("tripType") != null) {
				this.__merciFunc.storeLocal("tripType", document.getElementById("tripType").value, "overwrite", "text");
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

			//CR-6264064-------------------------
			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowStudent == "TRUE") {
				if (document.getElementById("FIELD_STU_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_STU_NUMBER", document.getElementById("FIELD_STU_NUMBER").selectedIndex, "overwrite", "text");
				}
			}
			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowSenior == "TRUE") {
				if (document.getElementById("FIELD_YCD_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_YCD_NUMBER", document.getElementById("FIELD_YCD_NUMBER").selectedIndex, "overwrite", "text");
				}
			}
			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowYouth == "TRUE") {
				if (document.getElementById("FIELD_YTH_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_YTH_NUMBER", document.getElementById("FIELD_YTH_NUMBER").selectedIndex, "overwrite", "text");
				}
			}
			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowMilitary == "TRUE") {
				if (document.getElementById("FIELD_MIL_NUMBER") != null) {
					this.__merciFunc.storeLocal("FIELD_MIL_NUMBER", document.getElementById("FIELD_MIL_NUMBER").selectedIndex, "overwrite", "text");
				}
			}
			//CR-6264064-------------------------

			var allowAddPax = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.allowAddPax;
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



		onInputFocus: function(event, args) {
			var delEL = document.getElementById('del' + args.id);
			if (delEL != null) {
				delEL.className += ' deletefocus';
			}
		},

		onDayMonthChange: function(at, args) {
			var monId = document.getElementById(args.monthdd)
			var dayId = document.getElementById(args.daydd)
			var monthIndex = monId.options[monId.selectedIndex].value;
			$('#' + args.datePick).datepicker("setDate", new Date(monthIndex.substring(0, 4), monthIndex.substring(4, 6), dayId.options[dayId.selectedIndex].value));
			this.adjustDate(args);
		},

		adjustDate: function(args) {
			if (args != null) {
				var myOption;
				var monId = document.getElementById(args.monthdd);
				var dayId = document.getElementById(args.daydd);
				var monthIndex = monId.options[monId.selectedIndex].value;
				var dayDate = new Date(monthIndex.substring(0, 4), parseInt(monthIndex.substring(4, 6)) + 1, 0);
				dayDate = dayDate.getDate();
				if (dayId.options[dayId.selectedIndex].value > dayDate) {
					dayId.value = dayDate;
				}
				if (dayId.length <= dayDate) {
					for (var ai = (1 + dayId.length); ai <= dayDate; ai++) {
						myOption = document.createElement("option");
						myOption.text = ai;
						myOption.value = ai;
						dayId.appendChild(myOption);
					}
				} else {
					for (var di = dayId.length - 1; di >= dayDate; di--) {
						dayId.remove(di);
					}
				}
			}
		},

		getSmarDropDownJson: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var json = {};
			try {
				json = JSON.parse(eval("'" + rqstParams.smartDropDownContent + "'"));
			} catch (ex) {
				json = JSON.parse(rqstParams.smartDropDownContent);
			}

			return json;
		},

		_getDateRangeDefaultValue: function() {
			var dateRangeStoredValue = this.__merciFunc.getStoredItem('DATE_RANGE_VALUE_1');
			return dateRangeStoredValue;
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
				if (radioStored) {
					return radioStored;
				}
			}
			return 'R';
		},

		_isDealsFlow: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			return siteParameters.isDWMenabled != null && siteParameters.isDWMenabled.toUpperCase() == 'TRUE' && (rqstParams.flow == 'DEALS_AND_OFFER_FLOW' || rqstParams.request.FLOW_TYPE == 'DEALS_AND_OFFER_FLOW');
		},

		/* Method called by Native Calendar of Device to set the date on the search page*/
		_selectedDates: function(month, day, dayInt, monthInt) {
			dayInt = ("0" + (dayInt).toString()).slice(-2);
			/*console.log("=====================\nmonth = " + month);
            console.log("Day = " + day);
            console.log("dayInt = " + dayInt);
            console.log("monthInt = " + monthInt + " \n===========");*/

			var showNewDtPicker = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.showNewDatePicker;
			var retOffsetDate = pageBookSearch.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.returnDayRange;
			var yearFromParam = monthInt.substring(0, 4);
			var monthFromParam = monthInt.substring(4, 7);
			var monthNumber = parseInt(monthFromParam) + 1;
			var strtDP = "#datePickSearchF";
			var endDP = "#datePickSearchT";
			var depSearchDate = "#depSearchdate";
			var retSearchDate = "#retSearchdate";
			var datePickID = ".search"

			if (month == 'Month1') {

				$(strtDP).datepicker('setDate', new Date(yearFromParam, monthFromParam, dayInt));

				document.getElementById("month1").value = monthInt;
				document.getElementById("day1").value = dayInt;


				var day1 = $.datepicker.formatDate('dd', $(strtDP).datepicker('getDate'));
				if (showNewDtPicker != 'TRUE') {
					var month1 = $.datepicker.formatDate('yymm', $(strtDP).datepicker('getDate'));
					$("#day1 option[value=" + day1 + "]").attr('selected', 'selected');
					$("#month1>option[value=" + (month1 - 1) + "]").attr('selected', 'selected');
					pageBookSearch.updateDepartureDate();
					var returnDate = $(strtDP).datepicker('getDate');
					var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
					$(endDP).datepicker('setDate', offSetDate);
				} else {
					var month1 = $.datepicker.formatDate('M', $(strtDP).datepicker('getDate'));
					var year1 = $.datepicker.formatDate('yy', $(strtDP).datepicker('getDate'));
					var monthinNo = $.datepicker.formatDate('mm', $(strtDP).datepicker('getDate'));
					var yearMonth = $.datepicker.formatDate('yymm', $(strtDP).datepicker('getDate'));
					$(depSearchdate).html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
					var returnDate = $(strtDP).datepicker('getDate');
					var offSetDate = new Date(returnDate.setDate(returnDate.getDate() + parseInt(retOffsetDate)));
					$(endDP).datepicker('setDate', offSetDate);
					var monthRet = $.datepicker.formatDate('M', $(endDP).datepicker('getDate'));
					var yearRet = $.datepicker.formatDate('yy', $(endDP).datepicker('getDate'));
					$(retSearchDate).html("<time>" + monthRet + " " + offSetDate.getDate() + " , " + yearRet + "</time>");
					var depdayId = document.getElementById("day1");
					var depmonthId = document.getElementById("month1");
					depdayId.value = day1;
					depmonthId.value = yearMonth - 1;
					var retdayId = document.getElementById("day2");
					var retmonthId = document.getElementById("month2");
					retdayId.value = $.datepicker.formatDate('dd', $(endDP).datepicker('getDate'));
					retmonthId.value = $.datepicker.formatDate('yymm', $(endDP).datepicker('getDate')) - 1;
				}


			} else {
				$(endDP).datepicker('setDate', new Date(yearFromParam, monthFromParam, dayInt));

				document.getElementById("month2").value = monthInt;
				document.getElementById("day2").value = dayInt;

				var day2 = $.datepicker.formatDate('dd', $(endDP).datepicker('getDate'));
				if (showNewDtPicker != 'TRUE') {
					var month2 = $.datepicker.formatDate('yymm', $(endDP).datepicker('getDate'));
					$("#day2 option[value=" + day2 + "]").attr('selected', 'selected');
					$("#month2>option[value=" + (month2 - 1) + "]").attr('selected', 'selected');
				} else {
					var month2 = $.datepicker.formatDate('M', $(endDP).datepicker('getDate'));
					var year2 = $.datepicker.formatDate('yy', $(endDP).datepicker('getDate'));
					var monthinNo = $.datepicker.formatDate('mm', $(endDP).datepicker('getDate'));
					var yearMonth = $.datepicker.formatDate('yymm', $(endDP).datepicker('getDate'));
					$(retSearchDate).html("<time>" + month2 + " " + day2 + " , " + year2 + "</time>");
					$(retSearchDate).attr("monindex", monthinNo + year2);
					$(retSearchDate).attr("day2", day2);
					var dayId = document.getElementById("day2");
					var monthId = document.getElementById("month2");
					dayId.value = day2;
					monthId.value = yearMonth - 1;
				}
			}
			$(datePickID).show();
			$('.banner').show();
			$('#ui-datepicker-div').hide();
		},

		/** Method called to form FareDealData tag on page to be read by apps during fare-deals flow */
		fetchAppFareDealData: function() {
			var dealDataStr = "";

			if (this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.selectedOfferBean != null && this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.selectedOfferBean != "") {
				var selectedDealBean = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.selectedOfferBean;
				var listDealBean = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.listofferbean;

				var mthNmList = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
				var arrStrtDate = selectedDealBean.travelStart.split(" ");
				var arrStrtDate1 = arrStrtDate[0].split("-");
				var startDt = new Date(arrStrtDate1[0],arrStrtDate1[1],arrStrtDate1[2]);
				var arrEndDate = selectedDealBean.travelEnd.split(" ");
				var arrEndDate1 = arrEndDate[0].split("-");
				var endDt = new Date(arrEndDate1[0],arrEndDate1[1],arrEndDate1[2]);

				dealDataStr += "price=" + selectedDealBean.currency + " " + selectedDealBean.price;
				dealDataStr += "&origin=" + listDealBean.originCityName;
				dealDataStr += "&destination=" + listDealBean.destinationCityName;
				dealDataStr += "&startDate=" + startDt.getDate() + " " + mthNmList[startDt.getMonth()] + " " + startDt.getFullYear();
				dealDataStr += "&endDate=" + endDt.getDate() + " " + mthNmList[endDt.getMonth()] + " " + endDt.getFullYear();
				dealDataStr += "&offerID=" + selectedDealBean.offerId;
				dealDataStr += "&COUNTRY_SITE=" + this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam.request.COUNTRY_SITE;
				dealDataStr += "&airline=" + this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.sitePLCompanyName;
			}

			return dealDataStr;
		},

		/* PTR - 07577835  start*/

		custompaxselect: function(evt, typeofPax) {
			var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			if (this.__merciFunc.booleanValue(siteParams.siteCustomJS)) {
				addPax = siteParams.allowAddPax;
				paxselect({
					"type": typeofPax,
					"allowAddPax": addPax
				});
			}
		},

		/* PTR - 07577835  end*/

		/* Method called when share button is pressed.
		 * To share the Trip data
		 * Param: Share ID - Type of Share
		 * shareContent: existing callback string implemented for app
		 * MCommonScript sendShareData method invoked
		 */
		shareTrip: function(at, args) {
			this.__merciFunc.sendShareData(args.id, this.getShareData(this.fetchAppFareDealData()));
		},

		getShareData: function(shareContent) {

			var arr_shareContent = shareContent.split("&");
			var json_shareContent = {};
			if (arr_shareContent != null && arr_shareContent.length >= 7) {
				for (i = 0; i < arr_shareContent.length; i++) {
					var local_shareContent = arr_shareContent[i].split("=");
					if (local_shareContent != null && local_shareContent.length >= 1) {
						var item = {};
						json_shareContent[local_shareContent[0]] = local_shareContent[1];
					}
				}
			};

			//str_shareMsg = "I got the deal from FRMCTY to TOCTY valid from FRMDATE to TODATE in AIRLINENAME";
			str_shareMsg = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels.tx_merciapps_share_content_faredeals;
			if (json_shareContent != []) {
				try {
					str_shareMsg = str_shareMsg.replace("FRMCTY", json_shareContent.origin);
					str_shareMsg = str_shareMsg.replace("TOCTY", json_shareContent.destination);
					str_shareMsg = str_shareMsg.replace("FRMDATE", json_shareContent.startDate);
					str_shareMsg = str_shareMsg.replace("TODATE", json_shareContent.endDate);
					str_shareMsg = str_shareMsg.replace("AIRLINENAME", json_shareContent.airline);
				} catch (err) {
					console.log("Error in share content." + err)
				} finally {
					return str_shareMsg;
				}
			}
		}
	}
});