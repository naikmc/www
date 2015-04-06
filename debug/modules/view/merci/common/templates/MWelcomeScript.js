Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MWelcomeScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {

			// if welcome page data is not available
			this.siteParameters = this.moduleCtrl.getModuleData().booking.MWELC_A.siteParam;

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
				this.moduleCtrl.setHeaderInfo({
					title: labels.tx_merci_text_booking_home_title,
					bannerHtmlL: rqstParams.bannerHtml,
					homePageURL: null,
					showButton: false,
					currencyConverter: {
						name: '',
						code: '',
						pgTkt: '',
						labels: {
							tx_merci_currency_converter: '',
							tx_merci_org_currency: '',
							tx_merci_sel_currency: '',
							tx_merci_booking_avail_filter_apply: '',
							tx_merci_cancel: ''
						},
						showButton: false
					}
				});
			}
		},

		__OnWelcomeActionCallback: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {

				var json = this.moduleCtrl.getModuleData();
				json.booking = response.responseJSON.data.booking;
				// displaying welcome page
				this.showUI = true;
				this.$refresh({
					section: 'welcomePage'
				});
			}
		},

		OnContinueButtonClick: function(event, args) {

			// reset error
			this.data.errors = new Array();

			if (document.getElementById("country") != null) {
				var e = document.getElementById("country");
				selectedCountry = e.options[e.selectedIndex].value;
				selCountry = selectedCountry.split(",");
				country = selCountry[0];
			} else {
				selCountry = this.__merciFunc.getCookie("merci.countryCode");
				country = this.__merciFunc.getCookie("merci.country");
				selectedCountry = selCountry + "," + selCountry;
			}

			var i = document.getElementById("language");
			selectedLang = i.options[i.selectedIndex].value;

			// params to be send with action call
			var paramsLogin = null;
			if ((this.siteParameters.enableProfile != undefined && this.siteParameters.enableProfile.toLowerCase() == "true") || (this.siteParameters.enableLoyalty != undefined && this.siteParameters.enableLoyalty.toLowerCase() == "true")) {
				var rqstParams = this.moduleCtrl.getModuleData().booking.MWELC_A.requestParam.request;
				paramsLogin = '&TITLE_1=' + rqstParams.TITLE_1
					+ '&IS_USER_LOGGED_IN=' + rqstParams.IS_DIRECT_LOGGED_IN
					+ '&ENABLE_DIRECT_LOGIN=' + rqstParams.ENABLE_DIRECT_LOGIN
					+ '&USER_ID=' + rqstParams.USER_ID
					+ '&FIRST_NAME_1=' + rqstParams.FIRST_NAME_1
					+ '&LAST_NAME_1=' + rqstParams.LAST_NAME_1
					+ '&CONTACT_POINT_EMAIL_1_1=' + rqstParams.CONTACT_POINT_EMAIL_1_1
					+ '&CONTACT_POINT_PHONE_NUMBER=' + rqstParams.CONTACT_POINT_PHONE_NUMBER
					+ '&PASSWORD_1=' + rqstParams.PASSWORD_1
					+ '&PASSWORD_2=' + rqstParams.PASSWORD_2
					+ '&CONTACT_POINT_PHONE_TYPE=' + rqstParams.CONTACT_POINT_PHONE_TYPE
					+ '&DATE_OF_BIRTH_1=' + rqstParams.DATE_OF_BIRTH_1
					+ '&TRAVELLER_TYPE_1=' + rqstParams.TRAVELLER_TYPE_1
					+ '&PAYMENT_TYPE=' + rqstParams.PAYMENT_TYPE
					+ '&PREF_AIR_FREQ_NUMBER_1_1=' + rqstParams.PREF_AIR_FREQ_NUMBER_1_1
					+ '&PREF_AIR_FREQ_AIRLINE_1_1=' + rqstParams.PREF_AIR_FREQ_AIRLINE_1_1
					+ '&ITEM_ID_1=' + rqstParams.ITEM_ID_1
					+ '&TYPE_1=' + rqstParams.TYPE_1
					+ '&GENDER_1=' + rqstParams.GENDER_1
					+ '&PASSPORT_NUMBER_1_1=' + rqstParams.PASSPORT_NUMBER_1_1
					+ '&NUMBER_OF_PROFILES=' + rqstParams.NUMBER_OF_PROFILES
					+ '&LIST_ADDRESS_INFORMATION_REGION=' + rqstParams.LIST_ADDRESS_INFORMATION_REGION
					+ '&LIST_ADDRESS_INFORMATION_CITY=' + rqstParams.LIST_ADDRESS_INFORMATION_CITY
					+ '&LIST_ADDRESS_INFORMATION_STATE=' + rqstParams.LIST_ADDRESS_INFORMATION_STATE
					+ '&LIST_ADDRESS_INFORMATION_POSTAL_CODE=' + rqstParams.LIST_ADDRESS_INFORMATION_POSTAL_CODE
					+ '&LIST_ADDRESS_INFORMATION_COUNTRY=' + rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY
					+ '&LIST_ADDRESS_INFORMATION_LINE_1=' + rqstParams.LIST_ADDRESS_INFORMATION_LINE_1
					+ '&LIST_ADDRESS_INFORMATION_LINE_2=' + rqstParams.LIST_ADDRESS_INFORMATION_LINE_2
					+ '&PASSPORT_EXP_DATE_1_1=' + rqstParams.PASSPORT_EXP_DATE_1_1
					+ '&CONTACT_POINT_PHONE_COUNTRY_CODE=' + rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE
					+ '&CONTACT_POINT_PHONE_AREA_CODE=' + rqstParams.CONTACT_POINT_PHONE_AREA_CODE
					+ '&PREF_AIR_FREQ_MILES_1_1=' + rqstParams.PREF_AIR_FREQ_MILES_1_1
					+ '&PREF_AIR_FREQ_LEVEL_1_1=' + rqstParams.PREF_AIR_FREQ_LEVEL_1_1
					+ '&PREF_AIR_FREQ_OWNER_TITLE_1_1=' + rqstParams.PREF_AIR_FREQ_OWNER_TITLE_1_1
					+ '&PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1=' + rqstParams.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1
					+ '&PREF_AIR_FREQ_OWNER_LASTNAME_1_1=' + rqstParams.PREF_AIR_FREQ_OWNER_LASTNAME_1_1
					+ '&PASSPORT_COUNTRY_CODE_1_1=' + rqstParams.PASSPORT_COUNTRY_CODE_1_1;
			}

			this.__merciFunc.changeLanguage(args,{
				'selectedCountry': selectedCountry,
				'selectedLang': selectedLang,
				'moduleCtrl': this.moduleCtrl,
				'paramsLogin': paramsLogin
			});
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