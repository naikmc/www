Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableDayViewScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
	$constructor: function() {
		pageObj = this;
		this.dayData = {};
		this.dayData.segmentId = 0;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		var ttparent = {};
		var siteParams;

	},

	$prototype: {

		$dataReady: function() {
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam;
			ttParent = this.moduleCtrl.getModuleData().timeTableParent;

			// google analytics
			this.__ga.trackPage({
				domain: siteParams.siteGADomain,
				account: siteParams.siteGAAccount,
				gaEnabled: siteParams.siteGAEnable,
				page: 'TimeTable Day?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: 'TimeTable Day?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MTimeTableDayView",
						data:this.data
					});
			}
        },

		$displayReady: function() {

			var dates = document.getElementById("dates");
			if (dates != null) {
				dates.value = ttParent.ttData.segmentSelected;
			}
			this.$json.setValue(this.dayData, "segmentId", ttParent.ttData.segmentSelected);
			if (siteParams.linkCustomEnable == "TRUE") {
				this.checkDate(ttParent.ttData.segmentSelected);
			}

			var dates = document.getElementById("dates");
			if (dates != null) {
				var optionSelected = dates.options[dates.selectedIndex].value;
				this.changeHeader(optionSelected);
			}
			if(!this.__merciFunc.isEmptyObject(this.data.rqstParams)){
				this.data.rqstParams.segmentSelected= ttParent.ttData.segmentSelected;
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
			this.$json.setValue(this.dayData, "segmentId", optionSelected);
			if (siteParams.linkCustomEnable == "TRUE") {
				this.checkDate(ttParent.ttData.segmentSelected);
			}
			this.changeHeader(optionSelected);
		},

		__onTTCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.servicing.MFlightInfo_A != null) {
				var json = this.moduleCtrl.getModuleData();
				json.servicing.MFlightInfo_A = response.responseJSON.data.servicing.MFlightInfo_A;

				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (dataId == 'MError_A') {
					this.moduleCtrl.navigate(null, nextPage);
				} else {

					this.$json.setValue(this.data, 'flightTpl', !this.data.flightTpl);
					var element = document.getElementById(this.$getId('flightContent'));
					if (element != null) {
						element.className += ' show';
					}

					// hide overlay
					this.__merciFunc.hideMskOverlay();
				}
			}
		},

		/**
		 * creates a date object from DateBean JSON object
		 * @param bean JSON Object
		 */
		_getDate: function(bean) {
			if (bean != null) {
				return new Date(bean.year, bean.month, bean.day, bean.hour, bean.minute, 0);
			}

			return new Date();
		},

		onFlightStatusClick: function(evt, args) {

			var currentSegment = args.segment;
			var index = args.index;

			// PTR 07621002
			var prevDayDiff = args.prevDayDiff;
			var e = document.getElementById("dates");
			if (e != null) {
				var dateSel = e.options[e.selectedIndex].text;
				var dateSelArr = dateSel.split(" ");
				var comp = dateSelArr[1];
			} else {
				e = document.getElementById("singleFlightLabel");
				dateSel = e.innerHTML;
				var dateSelArr = dateSel.split(" ");
				var comp = dateSelArr[2];
			}
			var odBean = this.data.rqstParams.originDestinationBean;

			if (comp == this.data.rqstParams.dmIn.B_DATE.substring(6, 8)) {
				var segmentBeginDate = this._getDate(odBean.beginDateBean);
			} else {
				var segmentBeginDate = this._getDate(odBean.endDateBean);
			}

			// PTR 07621002 
			var dateToSend = segmentBeginDate;
			dateToSend.setDate(prevDayDiff + dateToSend.getDate());
			var dayToSend = dateToSend.getDate();
			dayToSend = dayToSend > 9 ? "" + dayToSend : "0" + dayToSend;
			var monthToSend = dateToSend.getMonth() + 1;
			monthToSend = monthToSend > 9 ? "" + monthToSend : "0" + monthToSend;
			var yearToSend = dateToSend.getFullYear();

			var currentDate = new Date();
			var one_day = 86400000; /* 1000*60*60*24 */
			var diff = Math.round((segmentBeginDate.getTime() - currentDate.getTime()) / (one_day));

			if (siteParams.linkCustomEnable == "TRUE") {

				if (diff <= 2) {
					var linkCustomUrl = "";
					if (siteParams.linkCustomUrl_1 != "")
						linkCustomUrl = siteParams.linkCustomUrl_1;

					var customFFLink = linkCustomUrl + "&CARRIER_CODE=" + currentSegment.airline.code + "&FLIGHT_NUMBER=" + currentSegment.flightNumber + "&EVENT_TYPE=0" + "&CITY_CODE=" + currentSegment.beginLocation.locationCode;
					if (dateSelArr[1] == this.data.rqstParams.dmIn.day1) {
						customFFLink += "&EVENT_DATE=" + yearToSend + "-" + monthToSend + "-" + dayToSend + "T00:00:00.000";
					} else {
						customFFLink += "&EVENT_DATE=" + yearToSend + "-" + monthToSend + "-" + dayToSend + "T00:00:00.000";
					}
					if (this.__merciFunc.supports_local_storage()) {
						localStorage.setItem("currentHashString", "merci-MTTBRE_A");
						localStorage.setItem("customParams", this.moduleCtrl.getModuleData().customParams);
						localStorage.setItem("actionName", "MTimeTable.action")
					}

					location.href = customFFLink;
				}
			} else {
				var linkParams = "fn=" + currentSegment.airline.code + currentSegment.flightNumber + "&dd=" + dayToSend + "&MMM=" + monthToSend + "&YYYY=" + yearToSend + "&b_loc=" + currentSegment.beginLocation.locationCode + "&e_loc=" + currentSegment.endLocation.locationCode + "&fn_seg_1=" + currentSegment.airline.code + currentSegment.flightNumber + "&dd_seg_1=" + dayToSend + "&MMM_seg_1=" + monthToSend + "&YYYY_seg_1=" + yearToSend + "&b_loc_seg_1=" + currentSegment.beginLocation.locationCode + "&e_loc_seg_1=" + currentSegment.endLocation.locationCode;

				var seg_linkparams = "&fn_seg_" + index + "=" + currentSegment.airline.code + currentSegment.flightNumber + "&dd_seg_" + index + "=" + dayToSend + "&MMM_seg_" + index + "=" + monthToSend + "&YYYY_seg_" + index + "=" + yearToSend + "&b_loc_seg_" + index + "=" + currentSegment.beginLocation.locationCode + "&e_loc_seg_" + index + "=" + currentSegment.endLocation.locationCode;

				var extraParams = "&n=" + index + "&p=1" + "&next=" + index + "&prev=1&result=json";

				var params = linkParams + seg_linkparams + extraParams;

				if (siteParams.siteAllowFavorite == 'TRUE') {
					jsonResponse.ui.Flow_Type = null;
					jsonResponse.ui.keyData = null;
				}
				this.__merciFunc.sendNavigateRequest(params, 'MTTFIFOReq.action', this);
			}


		},

		getFormattedDate: function(date) {
			return this.__merciFunc.formatDate(date, 'EEE dd MMM yyyy');
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