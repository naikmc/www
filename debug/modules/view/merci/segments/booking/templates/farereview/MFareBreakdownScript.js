Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareBreakdownScript',
	$dependencies: [
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.ServiceSelection',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		this._ga = modules.view.merci.common.utils.MerciGA;
	},

	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
			if (this.utils.booleanValue(this.data.siteParams.servicesCatalog) && this.data.fromPage == "CONF" || this.data.rqstParams.fromPage == "CONF") {
				this._selection = new modules.view.merci.common.utils.ServiceSelection(this.data.rqstParams.servicesSelection);
				var servicesFlow = "Services - Booking Flow";
				if (this.data.rqstParams.param.action == "MODIFY") {
					servicesFlow = "Services - Servicing Flow";
				}
				for (var serviceCategory in this.data.globalList.serviceCategories) {
					var categoryCode = this.data.globalList.serviceCategories[serviceCategory].code;
					var services = this._selection.getServices(categoryCode, null, null, null, null);
					if (services.length > 0) {
						/* Seats don't have NUMBER property, so we take the number of seat services */
						var nbServices = this._selection.getTotalProperty(services, 'NUMBER') || services.length
						var servPrice = this._selection.totalPrice.currency.code + " - " + this._selection.getTotalPrice(services).toFixed(2);
						this._ga.trackEvent({
							domain: this.data.siteParams.siteGADomain,
							account: this.data.siteParams.siteGAAccount,
							gaEnabled: this.data.siteParams.siteGAEnable,
							category: servicesFlow,
							action: categoryCode,
							label: servPrice,
							value: nbServices,
							requireTrackPage: true,
							noninteraction: ''
						});
					}
				}
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFareBreakdown",
						data:this.data
					});
			}
		},

		$displayReady: function() {
			if(!this.utils.isEmptyObject(this.data.insData) && this.utils.booleanValue(this.data.siteParams.siteInsuranceEnabled)==true){
				if(this.utils.isEmptyObject(this.data.insData.amount)){
					this.data.insData.amount=0;
				}
				var fractionDigits = 0;
				if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
					fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
				}
				var elFareBrkdwnTotal = document.getElementById('fareBrkTotalPrice');
				var totalAmount = parseFloat(this.data.insData.amount);
				var totalPriceAvailable = false;

				if (elFareBrkdwnTotal != null) {

					var elFareAmt = document.getElementById('calcFinalAmnt');
					if (elFareAmt != null) {
						totalAmount += parseFloat(elFareAmt.value);
						totalPriceAvailable=true;
					}else if(this.data.totalPrice>0) {
						totalAmount += parseFloat(this.data.totalPrice);
						totalPriceAvailable=true;
					}

					if(totalPriceAvailable){
						elFareBrkdwnTotal.innerHTML = this.utils.printCurrency(totalAmount, fractionDigits);
					}					
				}
			}			
		},

		openHTML: function(args, data) {
			// common method to open HTML popup
			this.moduleCtrl.openHTML(args, data);
		},

		closePopup: function(args, data) {
			// close the popup
			this.moduleCtrl.closePopup();
		},

		getTotalPrice: function(args, data) {

			// calculate total amount
			var totalAmount = 0;

			var tripPrices = this.__getTripPrice();
			if (!this.utils.isEmptyObject(tripPrices[0].totalAmount)) {
				totalAmount = tripPrices[0].totalAmount;
			}

			if (this.data.rqstParams.fareBreakdown.rebookingStatus == true) {
				if (!this.utils.isEmptyObject(tripPrices[0].priceWithTax)) {
					totalAmount = tripPrices[0].priceWithTax;
				} else {
					totalAmount = 0;
				}
			} else if (this.data.rqstParams.servicesByPaxAndLoc && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice != '' && !this.utils.isEmptyObject(this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice)) {
				totalAmount = totalAmount + this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice;
			}

			return totalAmount;
		},

		__getTripPrice: function() {
			if (this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0) {
				return this.data.rqstParams.fareBreakdown.tripPrices;
			}

			return [{}];
		},

		__getCurrencies: function() {
			if (this.data.rqstParams.fareBreakdown.currencies != null && this.data.rqstParams.fareBreakdown.currencies.length > 0) {
				return this.data.rqstParams.fareBreakdown.currencies;
			}

			return [{}];
		},

		hasAncillaryServices: function() {
			var hasChargeableSeats = this.data.rqstParams.servicesByPaxAndLoc != null && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice > 0;
			var hasServicesFromCatalog = this.utils.booleanValue(this.data.siteParams.servicesCatalog) && this.data.rqstParams.servicesSelection && this.data.rqstParams.servicesSelection.selectedServices && this.data.rqstParams.servicesSelection.selectedServices.length > 0;
			return hasChargeableSeats || hasServicesFromCatalog;
		},
		__getServicesPrice: function() {
			if (this.data.rqstParams.servicesSelection && this.data.rqstParams.servicesSelection.totalPrice != null && this.data.rqstParams.servicesSelection.totalPrice.totalAmount != null) {
				return this.data.rqstParams.servicesSelection.totalPrice.totalAmount;
			}

			return 0;
		}
	}
});