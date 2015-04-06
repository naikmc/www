Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MTabletWelcomeScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {
			this.data.errors = new Array();
			//if welcome page data is not available
			if (this.moduleCtrl.getModuleData() == null || this.moduleCtrl.getModuleData().booking == null || this.moduleCtrl.getModuleData().booking.MWELC_A == null) {
				var params = 'result=json';
				var request = {
					parameters: params,
					action: 'MLangInput.action',
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__OnWelcomeActionCallback,
						args: params,
						scope: this
					}
				};

				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

			} else {
				this.showUI = true;
			}
		},

		$displayReady: function() {

			if (this.showUI == true) {

				var labels = this.moduleCtrl.getModuleData().booking.MWELC_A.labels;
				var rqstParams = this.moduleCtrl.getModuleData().booking.MWELC_A.requestParam;

				// set details for header
				//this.moduleCtrl.setHeaderInfo(labels.tx_merci_text_booking_home_title, rqstParams.bannerHtml, null, false);
			}
		},

		__OnWelcomeActionCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {

				var json = this.moduleCtrl.getModuleData();
				json.booking.MWELC_A = response.responseJSON.data.booking.MWELC_A;
				// displaying welcome page
				this.showUI = true;
				this.$refresh({
					section: 'welcomePageTablet'
				});
				document.querySelector('.msk.loading').style.display = "none";

			}
		},

		OnContinueButtonClick: function() {
			// reset error
			this.data.errors = new Array();
			var selCountry = "";
			var country = "";
			if (document.getElementById("country") != null) {
				var e = document.getElementById("country");
				var selectedCountry = e.options[e.selectedIndex].value;
				selCountry = selectedCountry.split(",");
				country = selCountry[0];
			} else {
				selCountry = this.__merciFunc.getCookie("merci.countryCode");
				country = this.__merciFunc.getCookie("merci.country");
				selectedCountry = selCountry + "," + selCountry;
			}
			var i = document.getElementById("language");
			var selectedLang = i.options[i.selectedIndex].value;
			if (this.__merciFunc.isEmptyObject(country)) {
				country = this.__merciFunc.getCookie("merci.country");
			}
			this.moduleCtrl.setValueforStorage(country, 'defaultCountry');
			// params to be send with action call
			var params = "SELECTLANGUAGE=" + selectedLang + "&COUNTRY=" + selectedCountry + "&LANGUAGE=" + selectedLang + "&COUNTRY_SITE=" + country + "&result=json";

			var request = {
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__OnMCLangCallback,
					args: params,
					scope: this
				}
			}

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			// set request data
			request.isCompleteURL = true;
			request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + bp[4] + "/MCLang.action;jsessionid=" + jsonResponse.data.framework.sessionId + "?SITE=" + bp[11] + "&" + params;
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__OnMCLangCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.homePageId != 'merci-book-MWELC_A') {
				// if success

				var langEL = document.getElementById("language");
				var selectedLang = langEL.options[langEL.selectedIndex].value;

				// set locale for aria templates
				modules.view.merci.common.utils.MCommonScript.resetPageInfo();
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
				this.__merciFunc.navigateCallback(response, this.moduleCtrl);
			} else {

				var jsonForErrors = this.moduleCtrl.getModuleData().booking.MWELC_A;
				for (var key in response.responseJSON.data.booking.MWELC_A.requestParam.reqAttrib) {
					this.__addErrorMessage(jsonForErrors.errorStrings[key].localizedMessage + " (" + jsonForErrors.errorStrings[key].errorid + ")");
				}

				// reset variable
				aria.utils.Json.setValue(this.data, 'error_msg', true);
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
		}
	}
});