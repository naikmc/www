Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiFareRecapScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {

	},

	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
		},

		openPriceDetails: function() {

			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParameters.enableNewPopup)){

				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				aria.utils.Json.setValue(popup, 'data', {
				  'labels': this.data.labels,
	              'siteParams': this.data.siteParameters,
	              'rqstParams': this.data.rqstParams,
	              'fromPage':'alpi',
	              currCode:this.data.currCode,
	              exchRate:this.data.exchRate
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "priceBreakDown"
				});

				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				modules.view.merci.common.utils.MCommonScript.storeFormData("formPrefillData");
				this.moduleCtrl.navigate(null, 'Popup');

			}else{
				this.moduleCtrl.showMskOverlay();

				// showing all the popup with class as 'popup'
				var popups = document.getElementsByClassName('popup');
				for (var i = 0; i < popups.length; i++) {
					if (popups[i].id == 'pricePopup') {
						popups[i].style.display = 'block';
					}
				}

				// scroll to top
				window.scrollTo(0, 0);
			}
		},

		$viewReady: function(){
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiFareRecap",
						data:this.data
					});
			}
		},

		getFractionDigits: function() {
			var fractionDigits = 0;
			if (this.data.siteParameters.siteCurrencyFormat != null && this.data.siteParameters.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParameters.siteCurrencyFormat.substring(this.data.siteParameters.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			return fractionDigits;
		}
	}
});