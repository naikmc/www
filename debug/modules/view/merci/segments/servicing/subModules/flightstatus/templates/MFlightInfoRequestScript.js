Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MFlightInfoRequestScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MerciGA', 'modules.view.merci.common.utils.MCommonScript'],
	$constructor: function() {
		this._ga = modules.view.merci.common.utils.MerciGA;
		this._ajax = modules.view.merci.common.utils.URLManager;
		this._utils = modules.view.merci.common.utils.MCommonScript;
	},
	$prototype: {

		__onFlightStatusCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null) {

				var json = this.moduleCtrl.getModuleData();
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

				if (dataId == 'MFlightInfo_Request_A' && response.responseJSON.data.servicing != null) {

					// null check
					if (json.servicing == null) {
						json.servicing = {};
					}

					json.servicing.MFlightInfo_Request_A = response.responseJSON.data.servicing.MFlightInfo_Request_A;

					/* show page */
					this.__setErrors();
					this.printUI = true;
					this.$refresh({
						section: 'FlightInfoRequestPage'
					});
				} else {
					// error occured while fetching data from server
					for (var data in response.responseJSON.data) {
						if (response.responseJSON.data.hasOwnProperty(data)) {
							for (var key in response.responseJSON.data[data]) {
								if (response.responseJSON.data[data].hasOwnProperty(key)) {
									// set data
									json[data][key] = response.responseJSON.data[data][key];
								}
							}
						}
					}

					// navigate to other page
					this.moduleCtrl.navigate(null, nextPage);

				}
			}
		},
		
		onDateChange : function(evt, args) {
            var dayIndex = $('#' + args.daydd + ' option:selected').val();
            var monthIndex = this._utils.getMonthInNo($('#' + args.monthdd + ' option:selected').val());
            var yearIndex = $('#'+args.yeardd + ' option:selected').val();
            $('#' + args.datePick).datepicker("setDate", new Date(yearIndex, monthIndex, dayIndex));
			
		},				

		$dataReady: function() {
			this.data.errors = [];
			/*if Flight Info Request page data is not available*/
			if (this.moduleCtrl.getModuleData() == null || this.moduleCtrl.getModuleData().servicing == null) {
				var params = 'result=json&fromIndex=true&page=Home';

				var request = {
					action: "MFIFOInput.action",
					parameters: params,
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onFlightStatusCallback,
						scope: this,
						args: params
					}
				};

				this._ajax.makeServerRequest(request, false);
			} else {
				//this.__setErrors();
				this.data.errors = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam.errors;
				this.printUI = true;

				var base = this._ajax.getBaseParams();
				this.siteParams = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam;

				// google analytics
				this._ga.trackPage({
					domain: this.siteParams.siteGADomain,
					account: this.siteParams.siteGAAccount,
					gaEnabled: this.siteParams.siteGAEnable,
					page: 'Flight Status Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
					GTMPage: 'Flight Status Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
				});

			}
		},

		__setErrors: function() {
			var arr = [];
			var rqst = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A;

			for (var key in rqst.requestParam.errorMap) {
				if (rqst.requestParam.errorMap.hasOwnProperty(key) && rqst.requestParam.errorMap[key] != null) {
					var error = rqst.uiErrors[rqst.requestParam.errorMap[key]];
					this.__addErrorMessage(error.localizedMessage + " (" + error.errorid + ")");
				}
			}

			// for session timeout and other BE errors
			if (!this._utils.isEmptyObject(rqst.requestParam.errors)) {
				this.data.errors = rqst.requestParam.errors;
			}

			// show errors
			window.scrollTo(0, 0);
			aria.utils.Json.setValue(this.data, 'error_msg', true);
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

		$displayReady: function() {
			/* setting autocomplete if UI is ready to be printed
			 this will be set only after callback received with data*/
			$('body').addClass("flight-status sear");
			$('.ui-datepicker-trigger').click(function() {
				$('#flightStatus').hide();
				$('.banner').hide();
				$('#ui-datepicker-div').show();
			})

		},

		$viewReady: function() {
			$('body').attr('id', 'flightDet');
			var header = this.moduleCtrl.getModuleData().headerInfo;

			if (this._utils.booleanValue(this.siteParams.enableLoyalty) == true && this._utils.booleanValue(this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.labels.loyaltyLabels,
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
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: true,
				companyName: this.siteParams.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			this.resetDate();

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFlightInfoRequest",
						data:this.data
					});
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
			var daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
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
			var showNewDtPicker = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam.showNewDatePicker;
			var buttonImgOnly = false;
			var buttonImagePath = "";
			var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
			if (showNewDtPicker != 'TRUE') {
				buttonImagePath = $("#calImgPath").val();
				buttonImgOnly = true;
			}
			$('#datePickFlightF').datepicker({
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
					var day1 = $.datepicker.formatDate('dd', $("#datePickFlightF").datepicker('getDate'));
					var month1 = $.datepicker.formatDate('M', $("#datePickFlightF").datepicker('getDate'));
					var year1 = $.datepicker.formatDate('yy', $("#datePickFlightF").datepicker('getDate'));
					var monthinNo = $.datepicker.formatDate('mm', $("#datePickFlightF").datepicker('getDate'));

					var changedDate = new Date(year1, parseInt(monthinNo) - 1, day1);
					$('#datePickFlightF').datepicker('setDate', changedDate);

					$("#depFlightdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
					if (showNewDtPicker != 'TRUE') {
						if (parseInt(day1) < 10) {
							day1 = day1.substring(1, 2);
						}
					}
					$("#depFlightdate").attr("day1", day1);
					$("#dd").val(day1);
					$("#MMM").val(monthNames[parseInt(monthinNo) - 1]);
					$("#YYYY").val(year1);
					$('#flightStatus').show();
					$('.banner').show();
					$('#ui-datepicker-div').hide();
				},
				onClose: function() {
					$('#flightStatus').show();
					$('.banner').show();
					$('#ui-datepicker-div').hide();
				}
			});

			if ($("#dd").attr("value", day) == "" || $("#dd").attr("value") === undefined) {
				var todayDate = new Date();
				var month = monthNames[todayDate.getMonth()];
				var day = todayDate.getDate();
				var year = todayDate.getFullYear();
				$("#dd").val(day);
				$("#MMM").val(month);
				$("#YYYY").val(year);
				$("#datePickFlightF").datepicker('setDate', todayDate);
			}

		},

		resetDate: function() {
			this.createDatePicker();
			var showNewDtPicker = false;
			if (this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A != undefined) {
				showNewDtPicker = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam.showNewDatePicker;
			}
			if (showNewDtPicker == 'TRUE') {
				var a = $('.ui-datepicker-trigger')[0];

				$(a).attr("id", "depFlightdate");
				var defaultDay1 = $.datepicker.formatDate('dd', $("#datePickFlightF").datepicker('getDate'));
				var defaultMonth1 = $.datepicker.formatDate('MM', $("#datePickFlightF").datepicker('getDate'));
				var defaultYear1 = $.datepicker.formatDate('yy', $("#datePickFlightF").datepicker('getDate'));
				$("#depFlightdate").html("<time>" + defaultMonth1 + " " + defaultDay1 + " , " + defaultYear1 + "</time>");
				$("#depFlightdate").attr("day1", defaultDay1);
			} else {
				dayDropDown = document.getElementById("dd");
				monthDropDown = document.getElementById("MMM");
				yearDropDown = document.getElementById("YYYY");
				this.prefillDate();

			}
		},

		/*The flow navigates to the Home page through this function*/
		goBack: function() {
			var homePageURL = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam.homeURL;
			if (homePageURL == null || homePageURL == '') {
				this.moduleCtrl.goBack();
			} else {
				document.location.href = homePageURL;
			}
		},

		/*This function naviagates to the Flight Info page using the data collected from this page */
		onFlightStatusClick: function() {
			this._utils.scrollUp();
			this.data.errors = [];
			var date = document.getElementById("dd").value;
			var month = document.getElementById("MMM").value;
			var year = document.getElementById("YYYY").value;
			var flifoAirline = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam.flifoAirline;
			var IS_USER_LOGGED_IN = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam.IS_USER_LOGGED_IN;
			var flightNumber = null;
			if (flifoAirline != undefined) {
				flightNumber = document.getElementById("f_code").innerHTML + "" + document.getElementById("fcode_num").value;
			} else {
				flightNumber = document.getElementById("fcode_num").value;
			}

			if (!isNaN(document.getElementById("fcode_num").value)) {
				var params = 'result=json&fromIndex=true&dd=' + date + "&MMM=" + month + "&YYYY=" + year + "&fn=" + flightNumber + '&IS_USER_LOGGED_IN=' + IS_USER_LOGGED_IN;
				if (this.siteParams.siteAllowFavorite == 'TRUE') {
					jsonResponse.ui.Flow_Type = null;
					jsonResponse.ui.keyData == null;
				};
				var request = {
					parameters: params,
					action: 'MFIFOReq.action',
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__onFlightStatusCallack,
						args: params,
						scope: this
					}
				};

				this._ajax.makeServerRequest(request, false);
			} else {
				// UI error
				this.__showGenericError(this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.uiErrors[2130022]);
			}
		},

		__onFlightStatusCallack: function(response, args) {
			this._utils.hideMskOverlay();

			if (this.moduleCtrl != null && response.responseJSON != null && response.responseJSON.data != null) {

				// getting next page id
				var nextPage = response.responseJSON.homePageId;

				// get module ctrl data
				var json = this.moduleCtrl.getModuleData();

				for (var data in response.responseJSON.data) {
					if (response.responseJSON.data.hasOwnProperty(data)) {
						for (var key in response.responseJSON.data[data]) {
							if (response.responseJSON.data[data].hasOwnProperty(key)) {
								json[data][key] = response.responseJSON.data[data][key];
							}
						}
					}
				}

				// navigate to next page
				if (nextPage != 'merci-MflightInfo_Request_A') {
					var rqstParams = this.moduleCtrl.getModuleData().servicing.MFlightInfo_A.requestParam;
					if (this._utils.isEmptyObject(rqstParams.flightInfoBean.segment.beginLocation)) {
						// hide overlay
						this.__showGenericError(this.moduleCtrl.getModuleData().servicing.MFlightInfo_A.errorStrings[10307]);
						modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
					} else {
						this.moduleCtrl.navigate(null, nextPage);
					}
				} else {
					// refresh page
					this.__setErrors();
					aria.utils.Json.setValue(this.data, 'error_msg', true);

					// hide overlay
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				}
			}
		},

		/*Merci R12 SP1 CR6386880: Flight status - No action on clicking keyboard's Go button.
		This function is used when device go button is trying to trigger a form submit*/
		onFlightFormSubmit: function(evt, args) {
			evt.preventDefault(true);
			this.onFlightStatusClick();
		},

		onRouteDisplayClick: function(evt, arg) {
			if (document.getElementById("countryBox") != null) {
				var country = document.getElementById("countryBox").value;
			}
			this._utils.showMskOverlay(true);
			this.moduleCtrl.navigate(null, 'merci-MRoute_Request_A');

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

		__showGenericError: function(error) {
			if (error != null) {
				// display in UI
				this.__addErrorMessage(error.localizedMessage + " (" + error.errorid + ")");
				aria.utils.Json.setValue(this.data, 'error_msg', true);
			}
		}
	}
});