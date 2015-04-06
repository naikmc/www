Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MRouteRequestScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		pageObj = this;
		pageRouteObj = this;

	},

	$prototype: {

		__onFlightInfoCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.servicing != null && response.responseJSON.data.servicing.MFlightInfo_A != null) {
				var json = this.moduleCtrl.getModuleData();
				json.servicing = response.responseJSON.data.servicing;
				/*displaying Flight Status Request page*/
				this.printUI = true;
				this.$refresh({
					section: 'RoutePage'
				});
			}
		},

		$afterRefresh: function() {
            this.data.errors = new Array();
        },

		$dataReady: function() {
			this.printUI = true;
			pageRouteObj.siteParams = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam;
			pageRouteObj.globalList = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList;
			if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam.errors)) {
                this.data.errors = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam.errors;
                aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
            }
		},

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MRouteRequest",
						data:this.data
					});
			}
        },

		$displayReady: function() {
			var labels = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.labels;
			var requestParam = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam;
			if (this.__merciFunc.booleanValue(pageRouteObj.siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(requestParam.IS_USER_LOGGED_IN) == true) {
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
				title: labels.tx_merci_text_flight_status,
				bannerHtmlL: requestParam.bannerHtml,
				homePageURL: pageRouteObj.siteParams.homeURL,
				showButton: true,
				companyName: pageRouteObj.siteParams.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});

			$('body').removeClass('flight-status shtm sear');
			$('body').addClass('timetable fava');
			this.resetDate();
				$('body').addClass("flight-status sear");
			$('.ui-datepicker-trigger').click(function() {
				$('#flightStatus').hide();
				if(this.__merciFunc.isRequestFromApps==true){
					$('.banner').hide();
				}
				$('#ui-datepicker-div').show();
				})
		},

		goBack: function() {
			var homePageURL = pageRouteObj.siteParams.homeURL;
			if (homePageURL == null || homePageURL == '') {
				this.moduleCtrl.goBack();
			} else {
				document.location.href = homePageURL;
			}
		},
		/*This function is used to prefill the complete date field with today's date*/
		prefillDate: function() {
			var todayDate = new Date();
			var currDay = todayDate.getDate();
			var currMonthNum = todayDate.getMonth();
			var currYear = todayDate.getFullYear();
			this.prefillDateDays(currDay, currMonthNum, currYear);
			 this.prefillDateMonths(currMonthNum);
			this.prefillDateYear(currMonthNum, currYear);
		},

		/*This function is used to prefill the days column of the date field*/
		prefillDateDays: function(currentDay, currentMonth, currentYear) {
			var daysCount = new Date(currentYear, currentMonth+1, 0).getDate();
			for (var i = 1; i <= daysCount; i++) {
				var selectOption = document.createElement("option");
				selectOption.text = i;
				selectOption.value = i;
				if (currentDay == i)
					selectOption.selected = true;
				dayDropDown.add(selectOption, null)
			}
		},

		/*This field is used to prefill the month column of the date field*/
		prefillDateMonths: function(currentMonth) {
			var monthList = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList.monthList;
			for (var i = 0; i < 12; i++) {
				var selectOption = document.createElement("option");
				selectOption.text = monthList[i][0];
				selectOption.value = monthList[i][0].toUpperCase();
				if (currentMonth == i)
					selectOption.selected = true;
				monthDropDown.add(selectOption, null)
			}
		},

		/*This field is used to prefill the year column of the date field*/
		prefillDateYear: function(currentMonthNumber, currentYear) {
			var selectOption = document.createElement("option");
			selectOption.text = currentYear;
			selectOption.value = currentYear;
			yearDropDown.add(selectOption, null);
			if (currentMonthNumber != 0 && currentMonthNumber != 1) {
					var selectOption1 = document.createElement("option");
				selectOption1.text = currentYear + 1;
				selectOption1.value = currentYear + 1;
				yearDropDown.add(selectOption1, null);
				}
		},

		createDatePicker: function() {
			var _this = this;
			var showNewDtPicker = pageRouteObj.siteParams.showNewDatePicker;
			var buttonImgOnly = false;
			var buttonImagePath = "";
			if (showNewDtPicker != 'TRUE') {
				buttonImagePath = $("#calImgPath").val();
				buttonImgOnly = true;
			}
            $('#datePickF').datepicker({

                showOn: "button",
				buttonImage: buttonImagePath,
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

                    var day1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
                    if (showNewDtPicker != 'TRUE') {
                        var month1 = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
                        $("#Date option[value=" + day1 + "]").attr('selected', 'selected');
                        $("#Month option[value=" + month1 + "]").attr('selected', 'selected');
                        var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
                        $("#Year option[value=" + year1 + "]").attr('selected', 'selected');
                    } else {
                        var month1 = $.datepicker.formatDate('MM', $("#datePickF").datepicker('getDate'));
                        var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
                        var monthinNo = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
                        $("#depdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
                        $("#depdate").attr("monindex", monthinNo + year1);
                        $("#depdate").attr("day1", day1);
                        $("#depdate").attr("day1", day1);
                        $("#Day1").val(day1);
                        $("#B_Day").val(day1);
                        $("#Month1").val(year1 + monthinNo);

                        var buffer0 = "";
                        var mon_conv = monthinNo + 1;
                        if (monthinNo < 10)
                            buffer0 = "0";
                        var date_combined = year1.concat(monthinNo, day1, "0000");
                        $("#B_DATE").val(date_combined);

                        $("#Date").val(day1);
                        $("#Month").val(monthinNo);
                        $("#Year").val(year1);

                    }
				$('#flightStatus').show();
				$('.banner').show();
				$('#ui-datepicker-div').hide();
                },
				onClose: function() {
                    $('#flightStatus').show();
                    $('.banner').removeClass('hideThis');
					$('.banner').show();
                    $('#ui-datepicker-div').hide();
                }
            });

            if ($("#depdate").val() == null) {

                var storedDay1 = this.__merciFunc.getStoredItem('Date');
                var storedMonth1 = this.__merciFunc.getStoredItem('Month');
                var storedYear1 = this.__merciFunc.getStoredItem('Year');
                if (storedDay1 != null && storedMonth1 != null && storedYear1 != null) {
                    var offSetDate = new Date(storedMonth1 + "/" + storedDay1 + "/" + storedYear1);
                } else {
                    var offSetDate = new Date();

                }

                $("#datePickF").datepicker('setDate', offSetDate);
            }
        },


		resetDate: function() {
            this.createDatePicker();
            var showNewDtPicker = false;
            if (this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A != undefined) {
				showNewDtPicker = pageRouteObj.siteParams.showNewDatePicker;
            }
            if (showNewDtPicker == 'TRUE') {
                var a = $('.ui-datepicker-trigger')[0];
                $(a).attr("id", "depdate");
                var defaultDay1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
				var defaultMonth1 = $.datepicker.formatDate('MM', $("#datePickF").datepicker('getDate'));
				var defaultYear1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
                var defaultmonthinNo1 = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
                $("#depdate").html("<time>" + defaultMonth1 + " " + defaultDay1 + " , " + defaultYear1 + "</time>");
                $("#depdate").attr("monindex", defaultmonthinNo1 + defaultYear1);
                $("#depdate").attr("day1", defaultDay1)
                if (this.moduleCtrl.getValuefromStorage("defaultMonIndex1") == undefined || this.moduleCtrl.getValuefromStorage("defaultDay1" == undefined)) {
                    this.moduleCtrl.setValueforStorage(defaultmonthinNo1 + defaultYear1, "defaultMonIndex1");
                    this.moduleCtrl.setValueforStorage(defaultDay1, "defaultDay1");
                }

            } else {
                var day1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
                var month1 = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
                var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));

                $("#Date option[value=" + day1 + "]").attr('selected', 'selected');
                $("#Month option[value=" + month1 + "]").attr('selected', 'selected');
                $("#Year option[value=" + year1 + "]").attr('selected', 'selected');
            }
        },

		onFlightDisplayClick: function(evt, arg) {
			if (document.getElementById("countryBox") != null) {
				var country = document.getElementById("countryBox").value;
			}
			this.moduleCtrl.navigate(null, 'merci-MflightInfo_Request_A');

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

		__store_search_criteria: function(loc, eLoc) {
			var dep = document.getElementById('datePickF').value.substring(0, 4) + "" + document.getElementById('datePickF').value.substring(5, 7) + "" + document.getElementById('datePickF').value.substring(8, 10);
			var fromEntry = {
				to: eLoc,
				dep_date: dep
			};
			pageObj.__merciFunc.storeLocal("RouteFrom:" + loc, JSON.stringify(fromEntry), "overwrite", "text");
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

		onFlightFormSubmit: function(evt) {
			evt.preventDefault(true);
			this.__addParams();
				this.storeFormValues();
			//var isSubmit = this.validateDates();
			isSubmit = (this.validateCities());
			if (isSubmit == true) {
				var request = {
					formObj: document.getElementById('routeForm'),
					action: 'MTimeTable.action',
					method: 'POST',
					expectedResponseType: 'json',
					loading: true,
					cb: {
						fn: this.__onFlightFormCallBack,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			} else {
				this.$refresh({
					section: "errors"
				});

				this.data.errors = new Array();
			}
		},

		__onFlightFormCallBack : function(response){
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {
				if (dataId == 'MTTBRE_ERR_A') {
					var message = response.responseJSON.data.booking.MError_A.requestParam.listMsg[0].TEXT;
					this.addErrorMessage(message);
					this.$refresh({
					section: "errors"
					});
					this.__merciFunc.hideMskOverlay();
				}else{
					if (this.data.errors != null) {
						this.data.errors.pop();
					}
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		validateCities: function() {
            var bLoc = document.getElementById("B_LOCATION").value;
            var eLoc = document.getElementById("E_LOCATION").value;
            if (bLoc.length != 3 || eLoc.length != 3) {
                var message = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.uiErrors['2130404'].localizedMessage + ' (2130404)';
                this.addErrorMessage(message);
                return false;
            } else {
                return true;
            }
        },

		addErrorMessage: function(message) {

            /* if errors is empty*/
            if (this.data.errors == null) {
                this.data.errors = new Array();
            }

            /* create JSON and append to errors*/
            var error = {
                'TEXT': message
            };
            this.data.errors.push(error);

        },

		__addParams: function() {

			var bLocation = this.__resetInput("B_LOCATION_1");
			var eLocation = this.__resetInput("E_LOCATION_1");
			document.getElementById("B_LOCATION").value = bLocation;
			document.getElementById("E_LOCATION").value = eLocation;
			var tripTypeValue = 'O';
			document.getElementById("TRIP_TYPE").value = tripTypeValue;

			var showNewDtPicker = false;
			if (this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A != undefined) {
				showNewDtPicker = pageRouteObj.siteParams.showNewDatePicker;
			}
			if (showNewDtPicker != 'TRUE') {
				var monthvalue = document.getElementById("Month").value;
				var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
				var day1 = document.getElementById("Date").value;
				document.getElementById("Day1").value = day1;
				document.getElementById("B_Day").value = day1;
				document.getElementById("Month1").value = monthvalue;
				var year1 = document.getElementById("Year").value;
				var date_combined = year1.concat(monthvalue, day1, "0000");
				document.getElementById("B_DATE").value = date_combined;
			} else {
				var date = document.getElementById("Date").value;
				var month = document.getElementById("Month").value;
				var year = document.getElementById("Year").value;
			    var depdayId = document.getElementById("Day1");
				var day1 = $.datepicker.formatDate('dd', $("#datePickF").datepicker('getDate'));
				var depmonthinNo = $.datepicker.formatDate('mm', $("#datePickF").datepicker('getDate'));
				var year1 = $.datepicker.formatDate('yy', $("#datePickF").datepicker('getDate'));
				document.getElementById("Day1").value = day1;
				document.getElementById("B_Day").value = day1;
				document.getElementById("Month1").value = depmonthinNo;
				var date_combined = year1.concat(depmonthinNo, day1, "0000");
				document.getElementById("B_DATE").value = date_combined;

			}

			if (pageRouteObj.siteParams.siteRetainSearch == 'TRUE') {
				this.__store_airline_codes(bLocation, "RouteJson");
				this.__store_search_criteria(bLocation, eLocation);
			}

		},
		__store_airline_codes: function(loc, itemVal) {
			var arr = [],
				match = false;
			//if(localStorage.getItem(itemVal) != null){
			result = pageRouteObj.__merciFunc.getStoredItem(itemVal); //, function (response) {
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
				arr.push(loc);
			}
			pageObj.__merciFunc.storeLocal(itemVal, JSON.stringify(arr), "overwrite", "text");

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
			return result;
		},

		storeFormValues: function() {

			var arr = JSON.parse(this.__merciFunc.getStoredItem('FLIGHTCODE'));

			 if (document.getElementById("B_LOCATION_1") != null) {
				var B_loc = this.__resetInput("B_LOCATION_1");
			  }

			  if (document.getElementById("E_LOCATION_1") != null) {
				var E_loc = this.__resetInput("E_LOCATION_1");
			  }

			var match_BLOC = false,
				match_ELOC = false;
			if (arr == null) {
				var arr = [];
			}

			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == B_loc) {
					 match_BLOC = true;
					 break;
				   }
			  }

			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == E_loc) {
					 match_ELOC = true;
					 break;
				   }
			  }

			if (!match_BLOC) {
				arr.push(B_loc);
			}
			if (!match_ELOC) {
				arr.push(E_loc);
			}

			localStorage.setItem('FLIGHTCODE', JSON.stringify(arr));


		},
		createAutocompleteSourceAria: function(isFirstField, evt) {

			var autoCompleteSource = [];
            var keyPadDismiss = document.getElementById('keyPadDismiss');
            var rqstParams = pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam;
            var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
            var RouteJson = [];
            var respArr = [];

            if (localStorage != null) {
                RouteJson = pageRouteObj.__merciFunc.getStoredItem('RouteJson');
            }
            if (RouteJson != null) {
                respArr = JSON.parse(RouteJson);
            }

            var storeWebSrchValue = false;

			if ((pageRouteObj.siteParams.siteRetainSearch == "TRUE") && (null == bp[14] || bp[14] == "") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
				storeWebSrchValue = true;
            }
            var autoCompleteMinLength = 1;
            if (pageRouteObj.siteParams.siteAutoCompleteMinLength != null) {
                try {
                    autoCompleteMinLength = parseInt(pageRouteObj.siteParams.siteAutoCompleteMinLength);
                } catch (err) {
                    autoCompleteMinLength = 1;
                }
            }

			if (pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList != undefined && pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList.airportList != null) {

                var listItem = pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList.airportList;

                var locations = rqstParams.beginLocations;

				for (var i = 0; i < listItem.length; i++) {
                    var keyFound = false;


                            for (var k = 0; k < respArr.length; k++) {
                                if ((storeWebSrchValue) && null != respArr[k] && listItem[i][0] == respArr[k] && isFirstField == true) {
                                    keyFound = true;
                                    break;
							}
						}
                            var json = {
                                label: listItem[i][1],
                                code: listItem[i][1],
                                image: {
                                    show: keyFound,
                                    css: 'fave'
                                }
                            }
                            if (keyFound) {
                                autoCompleteSource.unshift(json);
                            } else {
                                autoCompleteSource.push(json);
                            }


                }

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

			return autoCompleteSource;
            //});
        },

		getSmarDropDownJson: function() {
			var rqstParams = pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam;
			var json = {};
			try {
				json = JSON.parse(eval("'" + rqstParams.smartDropDownContent + "'"));
			} catch (ex) {
				json = JSON.parse(rqstParams.smartDropDownContent);
			}

			return json;
		},

		selectFromARIA: function(evt, ui) {
            var globalList = pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList;
            var rqstParams = pageRouteObj.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam;
            var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
            var c = {};

            if (localStorage != null) {
                RouteJson = pageRouteObj.__merciFunc.getStoredItem('RouteJson');
            }
            if (RouteJson != null && RouteJson != "") {
				RouteJson = JSON.parse(RouteJson);
			}

			var storeWebSrchValue = false;

			if ((pageRouteObj.siteParams.siteRetainSearch == "TRUE") && (null == bp[14] || bp[14] == "") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
				storeWebSrchValue = true;
            }

			var autoCompleteMinLength = 1;
			if (pageRouteObj.siteParams.siteAutoCompleteMinLength != null) {
				try {
					autoCompleteMinLength = parseInt(pageRouteObj.siteParams.siteAutoCompleteMinLength);
				} catch (err) {
					autoCompleteMinLength = 1;
				}
			}

            if (storeWebSrchValue) {
                var name = ui.suggestion.code.split("(");

                var code = name[1].split(")");

				if (code[0].length != 3) {
					code[0] = code[0].substring(code[0].length - 3, code[0].length);
				}
				entry = pageRouteObj.__merciFunc.getStoredItem("RouteFrom:" + code[0]);
				if (entry != null) {
					pageRouteObj.setSearchCriteria(entry);
				}
            }
        },
		setSearchCriteria: function(entry) {
			var setDt1 = new Date();
			var today = new Date();

			entry = JSON.parse(entry);

			if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(entry)) {
			   document.getElementById('E_LOCATION_1').value = entry.to;
				setDt1.setFullYear(entry.dep_date.substring(0, 4), entry.dep_date.substring(4, 6) - 1, entry.dep_date.substring(6, entry.dep_date.length));

				if (pageRouteObj.siteParams.showNewDatePicker != "TRUE") {
					pageRouteObj.setDatesOld(setDt1, 'Date', 'Month', 'Year', entry.dep_date, today);
				} else {
					pageRouteObj.setDatesNew(setDt1, 'Date', 'Month', 'Year', 'datePickF', today, 'depdate');
				}
            }
		},

		setDatesNew: function(setDt, day, month, yr, picker, today, route) {
            var depdayId = document.getElementById(day);
            var depmonthId = document.getElementById(month);
            var depyear = document.getElementById(yr);
            if (setDt > today) {
                $("#" + picker).datepicker('setDate', setDt);
            } else {
                $("#" + picker).datepicker('setDate', new Date());
            }
            depdayId.value = $.datepicker.formatDate('dd', $("#" + picker).datepicker('getDate'));;
            depmonthId.value = $.datepicker.formatDate('mm', $("#" + picker).datepicker('getDate'));
            var month1 = $.datepicker.formatDate('M', $("#" + picker).datepicker('getDate'));
            var year1 = $.datepicker.formatDate('yy', $("#" + picker).datepicker('getDate'));
            $("#" + route).html("<time>" + month1 + " " + depdayId.value + " , " + year1 + "</time>");
			document.getElementById("datePickF").value = year1 + "-" + "04" + "-" + depdayId.value;
        },

		setDatesOld: function(setDt, day, month, yr, dt, today) {
            if (setDt > today) {
                $("#" + day + " option[value='" + dt.substring(6, dt.length) + "']").attr('selected', true);
                $("#" + month + " option[value='" + dt.substring(4, 6) + "']").attr('selected', true);
                $("#" + yr + " option[value='" + dt.substring(0, 4) + "']").attr('selected', true);
            } else {
                $("#" + day + " option[value='" + today.getDate() + "']").attr('selected', true);
                var m1 = today.getMonth() + 1;
                if (m1 < 10) {
                    m1 = "0" + m1;
                }
                $("#" + month + " option[value='" + m1 + "']").attr('selected', true);
                $("#" + yr + " option[value='" + today.getFullYear() + "']").attr('selected', true);
            }
        },

		_isDaySelected: function(dayLabel, currDay, value) {
            var dayStored = parseInt(this.__merciFunc.getStoredItem(dayLabel), 10);
            if (dayStored == null) {
                return currDay == value;
            }

            return dayStored == value;
        },

		onMonthChange: function(evt, dd) {
            var monthSel = $('#' + dd.monthdd + ' option:selected').val();
            var month = parseInt(monthSel, 10) - 1;
            var year = $('#' + dd.yeardd + ' option:selected').val();
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
                        $('#' + dd.daydd)
                            .append($("<option></option>")
                                .attr("value", buffer0 + k)
                                .text(buffer0 + k)
                        );
                        buffer0 = '';
                    }
                } else {
                    for (var k = dayDDOptions.length; k > noDaysArr[month]; k--) {
                        $('#' + dd.daydd + " option[value=" + k + "]").remove();
                    }
                }
            }
        },

        incrementYear: function(date) {
            date.setDate(date.getDate() + 365);
            return date.getFullYear();

        },        

		_isMonthSelected: function(monthLabel, currMonth, value) {
            var monthStored = parseInt(this.__merciFunc.getStoredItem(monthLabel), 10);
            if (monthLabel == null) {
                return currMonth == value;
            }

            return monthStored == value;
        },
		_isYearSelected: function(yearLabel, currYear, value) {
            var yearStored = parseInt(this.__merciFunc.getStoredItem(yearLabel), 10);
            if (yearLabel == null) {
                return currYear == value;
            }

            return yearStored == value;
        }

	}
});
