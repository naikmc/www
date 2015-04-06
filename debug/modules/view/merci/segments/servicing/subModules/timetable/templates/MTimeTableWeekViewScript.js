Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableWeekViewScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
	$constructor: function() {
		pageObj = this;
		this.weekData = {};
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		var ttparent = {};
		var siteParams;
	},

	$prototype: {

		$dataReady: function() {

			this.$json.setValue(this.weekData, "segmentId", "0");
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam;
			ttParent = this.moduleCtrl.getModuleData().timeTableParent;
			
		 	// google analytics
			this.__ga.trackPage({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				page: 'TimeTable Week?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: 'TimeTable Week?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			
		},

		$displayReady: function() {

			var dates = document.getElementById("dates");
			if (dates != null) {
				dates.value = ttParent.ttData.segmentSelected;
			}
			this.$json.setValue(this.weekData, "segmentId", ttParent.ttData.segmentSelected);
			if (siteParams.linkCustomEnable == "TRUE") {
				this.checkDate(ttParent.ttData.segmentSelected);
			}

			var dates = document.getElementById("dates");
			if (dates != null) {
				var optionSelected = dates.options[dates.selectedIndex].value;
				this.changeHeader(optionSelected);
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MTimeTableWeekView",
						data:this.data
					});
			}
        },

		daysInMonth: function(month, year) {
			return new Date(year, month, 0).getDate();

		},

		getTravelDifference: function(beginDateBean, endDateBean) {
			var bDate = new Date(beginDateBean.year, beginDateBean.month, beginDateBean.day);
			var eDate = new Date(endDateBean.year, endDateBean.month, endDateBean.day);
			var one_day = 86400000; /* 1000*60*60*24 */
			return Math.round((eDate.getTime() - bDate.getTime()) / (one_day));

		},

		updateFlightValues: function() {

			var dates = document.getElementById("dates");
			var optionSelected = dates.options[dates.selectedIndex].value;
			this.$json.setValue(ttParent.ttData, "segmentSelected", optionSelected);
			this.$json.setValue(this.weekData, "segmentId", optionSelected);
			this.changeHeader(optionSelected);

			// var orgDestBean=this.data.rqstParams.originDestinationBean;
			// if(optionSelected != null && optionSelected == "1"){
			// 	$("h1.TTSrcDestHeader").html(orgDestBean.endLocation.cityName+"("+orgDestBean.endLocation.cityCode+") - "+orgDestBean.beginLocation.cityName+"("+orgDestBean.beginLocation.cityCode+")");
			// }
			// else {
			// 	$("h1.TTSrcDestHeader").html(orgDestBean.beginLocation.cityName+"("+orgDestBean.beginLocation.cityCode+") - "+orgDestBean.endLocation.cityName+"("+orgDestBean.endLocation.cityCode+")");
			// }


		},
		nextWeekLink: function() {


			this.__merciFunc.showMskOverlay(true);
			var padZero = '';
			var padDZero = '';
			var EpadZero = '';
			var EpadDZero = '';
			var odBean = this.data.rqstParams.originDestinationBean;
			var dmIn = this.data.rqstParams.dmIn;
			var OnDay = new Date(odBean.beginDateBean.year, odBean.beginDateBean.month, odBean.beginDateBean.day);
			if (!this.__merciFunc.isEmptyObject(odBean.endDateBean))
				var RetDay = new Date(odBean.endDateBean.year, odBean.endDateBean.month, odBean.endDateBean.day);
			else
				var RetDay = new Date();

			OnDay.setDate(OnDay.getDate() + 7);
			RetDay.setDate(RetDay.getDate() + 7);
			if (OnDay.getMonth() < 9) {
				padZero = '0';
			}
			if (OnDay.getDate() < 10) {
				padDZero = '0';
			}
			if (RetDay.getMonth() < 9) {
				EpadZero = '0';
			}
			if (RetDay.getDate() < 10) {
				EpadDZero = '0';
			}



			var bDate = String(OnDay.getFullYear()) + padZero + String(OnDay.getMonth() + 1) + padDZero + String(OnDay.getDate()) + '0000';
			var bMonth = String(OnDay.getFullYear()) + padZero + OnDay.getMonth();
			var bDay = padDZero + String(OnDay.getDate());
			var eDate = "";
			var eMonth = "";
			var eDay = "";

			if (dmIn.tripType == "R") {
				eDate = String(RetDay.getFullYear()) + EpadZero + String(RetDay.getMonth() + 1) + EpadDZero + String(RetDay.getDate()) + '0000';
				eMonth = String(RetDay.getFullYear()) + EpadZero + RetDay.getMonth();
				eDay = EpadDZero + String(RetDay.getDate());
			}

			var arrangeBy = "";
			if (dmIn.arrangeBy != undefined)
				arrangeBy = dmIn.arrangeBy;
			var listFlightPreference0 = "";
			if (dmIn.listFlightPreference0 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference0))
				listFlightPreference0 = dmIn.listFlightPreference0;
			var listFlightPreference1 = "";
			if (dmIn.listFlightPreference1 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference1))
				listFlightPreference1 = dmIn.listFlightPreference1;
			var listFlightPreference2 = "";
			if (dmIn.listFlightPreference2 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference2))
				listFlightPreference2 = dmIn.listFlightPreference2;
			var pltgFrompage = "";
			if (dmIn.pltgFrompage != undefined)
				pltgFrompage = dmIn.pltgFrompage;


			var params = "B_LOCATION=" + odBean.beginLocation.locationCode + "&E_LOCATION=" + odBean.endLocation.locationCode + "&B_DATE=" + bDate + "&E_DATE=" + eDate + "&B_Month=" + bMonth + "&E_Month=" + eMonth + "&ARRANGE_BY=" + arrangeBy + "&TRIP_TYPE=" + dmIn.tripType + "&B_ANY_TIME=" + dmIn.bAnyTime + "&E_ANY_TIME=" + dmIn.eAnyTime + "&B_Day=" + bDay + "&E_Day=" + eDay + "&PLTG_FROMPAGE=" + pltgFrompage + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference0 + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference1 + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference2 + "&FROM_WEEK_NAV=TRUE" + "&result=json" + "&page=TimeTable Day/Week";

			var request = {
				action: 'MTimeTableWeekNav.action',
				method: 'POST',
				parameters: params,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onTimeTableWeekNavCallBack,
					scope: this
				}
			}

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);


		},

		__onTimeTableWeekNavCallBack: function(response) {

			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

			// if data is available
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.servicing != null && dataId != 'MTT_BSR_A') {

				// setting data
				var json = this.moduleCtrl.getModuleData();
				json.servicing[dataId] = response.responseJSON.data.servicing[dataId];
				json.header = response.responseJSON.data.header;


				this.data.rqstParams = response.responseJSON.data.servicing[dataId].requestParam;
				this.data.labels = response.responseJSON.data.servicing[dataId].labels;
				this.data.siteParams = response.responseJSON.data.servicing[dataId].siteParam;
				this.data.globalList = response.responseJSON.data.servicing[dataId].globalList;

				if (this.__merciFunc.isEmptyObject(this.data.rqstParams.lstTimeTableBean)) {
					ttParent.data.errors = this.data.rqstParams.errors;
					this.$json.setValue(ttParent.data, 'errorOccured', !ttParent.data.errorOccured);

				}

				this.$json.setValue(ttParent.ttData, "segmentSelected", "0");
				this.$json.setValue(this.weekData, "segmentId", "0");
				this.$refresh();

			}


		},

		prevWeekLink: function() {

			this.__merciFunc.showMskOverlay(true);
			var padZero = '';
			var padDZero = '';
			var EpadZero = '';
			var EpadDZero = '';
			var odBean = this.data.rqstParams.originDestinationBean;
			var dmIn = this.data.rqstParams.dmIn;
			var OnDay = new Date(odBean.beginDateBean.year, odBean.beginDateBean.month, odBean.beginDateBean.day);
			if (!this.__merciFunc.isEmptyObject(odBean.endDateBean))
				var RetDay = new Date(odBean.endDateBean.year, odBean.endDateBean.month, odBean.endDateBean.day);
			else
				var RetDay = new Date();

			OnDay.setDate(OnDay.getDate() - 7);
			RetDay.setDate(RetDay.getDate() - 7);
			if (OnDay.getMonth() < 9) {
				padZero = '0';
			}
			if (OnDay.getDate() < 10) {
				padDZero = '0';
			}
			if (RetDay.getMonth() < 9) {
				EpadZero = '0';
			}
			if (RetDay.getDate() < 10) {
				EpadDZero = '0';
			}



			var bDate = String(OnDay.getFullYear()) + padZero + String(OnDay.getMonth() + 1) + padDZero + String(OnDay.getDate()) + '0000';
			var bMonth = String(OnDay.getFullYear()) + padZero + OnDay.getMonth();
			var bDay = padDZero + String(OnDay.getDate());
			var eDate = "";
			var eMonth = "";
			var eDay = "";

			if (dmIn.tripType == "R") {
				eDate = String(RetDay.getFullYear()) + EpadZero + String(RetDay.getMonth() + 1) + EpadDZero + String(RetDay.getDate()) + '0000';
				eMonth = String(RetDay.getFullYear()) + EpadZero + RetDay.getMonth();
				eDay = EpadDZero + String(RetDay.getDate());
			}

			var arrangeBy = "";
			if (dmIn.arrangeBy != undefined)
				arrangeBy = dmIn.arrangeBy;
			var listFlightPreference0 = "";
			if (dmIn.listFlightPreference0 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference0))
				listFlightPreference0 = dmIn.listFlightPreference0;
			var listFlightPreference1 = "";
			if (dmIn.listFlightPreference1 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference1))
				listFlightPreference1 = dmIn.listFlightPreference1;
			var listFlightPreference2 = "";
			if (dmIn.listFlightPreference2 != undefined && !this.__merciFunc.isEmptyObject(dmIn.listFlightPreference2))
				listFlightPreference2 = dmIn.listFlightPreference2;
			var pltgFrompage = "";
			if (dmIn.pltgFrompage != undefined)
				pltgFrompage = dmIn.pltgFrompage;


			var params = "B_LOCATION=" + odBean.beginLocation.locationCode + "&E_LOCATION=" + odBean.endLocation.locationCode + "&B_DATE=" + bDate + "&E_DATE=" + eDate + "&B_Month=" + bMonth + "&E_Month=" + eMonth + "&ARRANGE_BY=" + arrangeBy + "&TRIP_TYPE=" + dmIn.tripType + "&B_ANY_TIME=" + dmIn.bAnyTime + "&E_ANY_TIME=" + dmIn.eAnyTime + "&B_Day=" + bDay + "&E_Day=" + eDay + "&PLTG_FROMPAGE=" + pltgFrompage + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference0 + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference1 + "&LIST_FLIGHT_PREFERENCE=" + listFlightPreference2 + "&FROM_WEEK_NAV=TRUE" + "&result=json" + "&page=TimeTable Day/Week";

			var request = {
				action: 'MTimeTableWeekNav.action',
				method: 'POST',
				parameters: params,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onTimeTableWeekNavCallBack,
					scope: this
				}
			}

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

		},

		getFormattedDate: function(date) {
			return this.__merciFunc.formatDate(date, 'EEE dd MMM yyyy');
		},

		getOperatedByString: function(airlineName) {

			var patternString = this.data.labels.tx_pltg_pattern_OperatedBy;
			patternString = patternString.replace("{0}", airlineName);
			return patternString;

		},

		checkDate: function(optionSelected) {
			var odBean = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam.originDestinationBean;
			if (optionSelected == "0") {
				var segmentDate = new Date(odBean.beginDate);
			} else if (optionSelected == "1") {
				var segmentDate = new Date(odBean.endDate);
			}
			var currentDate = new Date();
			var one_day = 86400000; /* 1000*60*60*24 */
			var diff = Math.round((segmentDate.getTime() - currentDate.getTime()) / (one_day));
			if (diff > 2) {
				ttParent.__addMsg("info", this.moduleCtrl.getModuleData().servicing.MTTBRE_A.labels.tx_merci_tt_customflightdurationerror);
				aria.utils.Json.setValue(ttParent.data, 'showWarning', !ttParent.data.showWarning);
			} else {
				ttParent.__removeWarning(this.moduleCtrl.getModuleData().servicing.MTTBRE_A.labels.tx_merci_tt_customflightdurationerror);
				aria.utils.Json.setValue(ttParent.data, 'showWarning', !ttParent.data.showWarning);

			}


		},
		changeHeader: function(optionSelected) {
			var odBean = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam.originDestinationBean;
			var header = document.querySelector(".TTSrcDestHeader");
			header.textContent = "";
			if (optionSelected == "0") {
				var txt = odBean.beginLocation.cityName + " (" + odBean.beginLocation.cityCode + ") - " + odBean.endLocation.cityName + " (" + odBean.endLocation.cityCode + ")";
				header.textContent = txt;
			} else if (optionSelected == "1") {
				var txt = odBean.endLocation.cityName + " (" + odBean.endLocation.cityCode + ") - " + odBean.beginLocation.cityName + " (" + odBean.beginLocation.cityCode + ")";
				header.textContent = txt;
			}
		}

	}
});