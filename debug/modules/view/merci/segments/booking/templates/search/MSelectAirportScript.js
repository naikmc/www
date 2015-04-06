Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.search.MSelectAirportScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		pageObj = this;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		__onAirportSelectCB: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				var nextPage = response.responseJSON.homePageId;
				var jsonData = this.moduleCtrl.getModuleData();
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (dataId == 'MError_A') {
					jsonData.booking[dataId] = response.responseJSON.data.booking[dataId];
					this.moduleCtrl.navigate(null, nextPage);
				} else {
					this.moduleCtrl.airportData = response.responseJSON.data.booking;

					// displaying search page
					this.showAirport = true;
					this.moduleCtrl.setHeaderInfo({
						title: this.moduleCtrl.airportData.MAIRPS_A.labels.tx_merci_text_booking_mutiple_title,
						bannerHtmlL: this.moduleCtrl.airportData.MAIRPS_A.requestParam.bannerHtml,
						homePageURL: null,
						showButton: true,
						companyName: null
					});

					this.$refresh({
						section: 'airportContent'
					});
				}
			}
		},

		$dataReady: function() {

			_this = this;
			this.data.errors = [];

			// if search page data is not available
			if (this.moduleCtrl.airportData == null) {
				var inputfield = this.moduleCtrl.getValuefromStorage('inputfield');
				var params = 'result=json&BCKTOHOME=BCKTOHOME&DIRECT_RETRIEVE=true&JSP_NAME_KEY=SITE_JSP_STAE_RETRIEVED&inputfield=' + inputfield;
				var actionName = 'MAirportPicker.action';
				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onAirportSelectCB,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				this.showAirport = true;
				var airports = [];
				var content = "";
				var aa = {
					"airName": []
				};
				var slctdAirportList = this.moduleCtrl.getValuefromStorage('airportsForFavorite');
				if (slctdAirportList != null && slctdAirportList.length > 0) {

					for (var i = 0; i < slctdAirportList.length; i++) {
						aa.airName.push(slctdAirportList[i]);
					}
					this.moduleCtrl.favoriteairports = aa;
				}
			}
			if (document.getElementById("backButton") != null) {
				document.getElementById("backButton").style.display = 'none';
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSelectAirport",
						data:this.data
					});
			}
		},

		onFindAirport: function() {
			this.data.errors = [];
			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
			var inputfield = this.moduleCtrl.getValuefromStorage('inputfield');
			var match = document.getElementById("MATCH").value;
			this.__merciFunc.storeLocal("matchItem", match, "overwrite", "text");
			var params = "result=json&RESULT_FILTER=3&inputfield=" + inputfield + "&MATCH=" + match;
			var actionName = 'MLocationLookupSearchPopUp.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.__onShowAirportListCB,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		onSelectAirport: function(a, b) {
			var inputfield = this.moduleCtrl.getValuefromStorage('inputfield');
			var slctdAirport = b.airName;
			if (inputfield == 'B_LOCATION_1_SRCH') {
				this.__merciFunc.storeLocal("B_LOCATION_1_SRCH", slctdAirport, "overwrite", "text");
			} else {
				this.__merciFunc.storeLocal("E_LOCATION_1_SRCH", slctdAirport, "overwrite", "text");
			}
			var slctdAirportList = this.moduleCtrl.getValuefromStorage('airportsForFavorite');
			if (slctdAirportList != null && slctdAirportList instanceof Array && slctdAirportList.indexOf(slctdAirport) == -1) {
				slctdAirportList.push(slctdAirport);
			} else {
				var list = [];
				list.push(slctdAirport);
				slctdAirportList = list;
			}

			// reset airport list
			this.moduleCtrl.airportLists = "";


			this.moduleCtrl.setValueforStorage(slctdAirportList, 'airportsForFavorite');
			this.moduleCtrl.setValueforStorage('APICKER-FLOW', 'FLOW');
			this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');

		},

		onFavoriteClick: function(a) {
			var aa = {
				"airName": ""
			};
			aa.airName = a;
			this.onSelectAirport("", aa);

		},

		__onShowAirportListCB: function(response, inputParams) {
			modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				var nextPage = response.responseJSON.homePageId;
				var jsonData = this.moduleCtrl.getModuleData();
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (dataId == 'MError_A') {
					jsonData.booking[dataId] = response.responseJSON.data.booking[dataId];
					this.moduleCtrl.navigate(null, nextPage);
				} else if (response.responseJSON.data.booking.MAIRPR_A != null && !modules.view.merci.common.utils.MCommonScript.isEmptyObject(response.responseJSON.data.booking.MAIRPR_A.requestParam.reply.listMsg)) {
					this.data.errors = response.responseJSON.data.booking.MAIRPR_A.requestParam.reply.listMsg;
				} else {
					this.moduleCtrl.airportLists = response.responseJSON.data.booking;
					this.showAirportList = true;
					document.getElementById("backButton").style.display = 'block';
					//document.getElementById(this.$getId('airportContentList')).style.display = 'block';
					this.$refresh({
						section: 'airportContentList'
					});
				}
			}
			aria.utils.Json.setValue(this.data, 'error_msg', true);
		},

		onBackClick: function() {
			if (this.moduleCtrl.airportLists != null && this.moduleCtrl.airportLists != "") {
				this.moduleCtrl.airportLists = "";
				this.$refresh({
					section: 'airportContentList'
				});
			} else {
				this.moduleCtrl.goBack(null, null);
			}
		},

		$afterRefresh: function() {

		}


	}
});