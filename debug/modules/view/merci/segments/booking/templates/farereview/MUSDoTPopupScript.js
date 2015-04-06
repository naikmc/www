Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MUSDoTPopupScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl'
	],
	$constructor: function() {

	},

	$prototype: {

		$dataReady: function() {
			this._utils = modules.view.merci.common.utils.MCommonScript;
			this._buffer = modules.view.merci.common.utils.StringBufferImpl;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MUSDoTPopup",
						data:this.data
					});
			}
		},

		_getPolicyOrdinalNumber: function(policyId) {

			for (var i = 0; i < this.data.globalList.siteLangNumber.length; i++) {
				var currentNumber = this.data.globalList.siteLangNumber[i];
				if (currentNumber[0] == policyId) {
					return currentNumber[1];
				}
			}

			return policyId;
		},

		_getFormattedPriceDisplayed: function(detailsInfo) {

			var formattedPriceDisplayed = '';
			if (detailsInfo.priceList.length > 0) {

				// get price main currency
				var priceMainCurrency = detailsInfo.priceList[0];

				// format price
				var formattedPrice = priceMainCurrency.totalAmount.toFixed(this.data.fractionDigits);
				formattedPriceDisplayed = (new this._buffer(this.data.labels.tx_pltg_pattern_PriceWithCurrencyCode)).formatString(formattedPrice, priceMainCurrency.currency.code);

				if (detailsInfo.priceList.length > 1) {
					// get price currency
					var priceSecCurrency = detailsInfo.priceList[0];
					formattedPrice = priceSecCurrency.totalAmount.toFixed(this.data.fractionDigits);

					formattedPriceDisplayed += ' (' + (new this._buffer(this.data.labels.tx_pltg_pattern_PriceWithCurrencyCode)).formatString(formattedPrice, priceSecCurrency.currency.code) + ')';
				}
			}

			return formattedPriceDisplayed;
		},

		_getAirlineName: function(airlineCode) {

			if (!this._utils.isEmptyObject(this.data.rqstParams.airlineDescriptionList)) {
				return this.data.rqstParams.airlineDescriptionList[airlineCode];
			}

			return '';
		},

		_getDisclaimer: function(airlineCode, currentPolicyType) {

			var disclaimer = '';
			for (var i = 0; i < this.data.globalList.siteServiceDisclaimer.length; i++) {
				var serviceDisclaimer = this.data.globalList.siteServiceDisclaimer[i];
				if (serviceDisclaimer.length > 2 && serviceDisclaimer[1] == airlineCode && serviceDisclaimer[2] == currentPolicyType) {
					return serviceDisclaimer[0];
				}
			}

			for (var i = 0; i < this.data.globalList.siteServiceDisclaimer.length; i++) {
				var serviceDisclaimer = this.data.globalList.siteServiceDisclaimer[i];
				if (serviceDisclaimer.length > 2 && serviceDisclaimer[1] == '00' && serviceDisclaimer[2] == currentPolicyType) {
					return serviceDisclaimer[0];
				}
			}

			return '';
		},



		closePopup: function(args, data) {
			this._utils.closePopup();
		},

		toggleExpand: function(args, data) {
			this._utils.toggleExpand(args, data);
		}
	}
});