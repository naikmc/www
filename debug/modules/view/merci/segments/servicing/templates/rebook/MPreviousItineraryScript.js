Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.rebook.MPreviousItineraryScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {
			this.__initUIMessages();
		},

		$viewReady: function() {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14].toLowerCase() == 'iphone') {
				/*HARD CODING CALLBACK URL TYPE to "sqmobile". Need to remove once data is present in JSON. this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback,"://?flow=booking/pageload="+aria.utils.HashManager.getHashString());*/
				this.__merciFunc.appCallBack("sqmobile", "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPreviousItinerary",
						data:this.data
					});
			}
		},

		getSectionIds: function() {
			var ids = [];
			var itineraries = this.data.rqstParams.oldItinerary.itineraries;
			var c = 0;
			for (var i = 0; i < itineraries.length; i++) {
				var bound = itineraries[i];
				for (var s = 0; s < bound.segments.length; s++) {
					ids[c++] = 'segment' + bound.segments[s].id;
					if (s !== bound.segments.length - 1) {
						ids[c++] = 'connect' + bound.segments[s].id + bound.segments[s + 1].id;
					}
				}
			}

			return ids;
		},

		formatDate: function(strDate, pattern, utcTime) {
			var format = this.utils.getFormatFromEtvPattern(pattern);
			var jsDate = new Date(strDate);
			return aria.utils.Date.format(jsDate, format, utcTime);
		},

		formatTime: function(dateBean) {
			var h = (dateBean.hour < 10 ? '0' + dateBean.hour : dateBean.hour);
			var m = (dateBean.minute < 10 ? '0' + dateBean.minute : dateBean.minute);
			return h + ':' + m;
		},

		/**
		 * Computes and formats the connection time between the two given segments.
		 */
		formatStopDuration: function(seg1, seg2, pattern) {
			var d1 = new Date(seg1.endDate);
			var d2 = new Date(seg2.beginDate);
			var duration = d2 - d1;
			return this.utils.formatDuration(duration, pattern, true);
		},

		__initUIMessages: function() {
			this.data.messages = {};
			if (this.__showWaiver()) {
				this.data.messages.errors = {
					list: [this.utils.createError(this.data.labels.tx_merci_text_fare_conf_waiver_message)]
				};
			}
		},

		__showWaiver: function() {
			return this.utils.booleanValue(this.data.rqstParams.selectionHasWaiver) && this.utils.booleanValue(this.data.config.siteDisplayWaiverMsg) && this.utils.booleanValue(this.data.config.siteATCDisruptionEnabled);
		},

		_getOldTotalAmount: function() {

			var totalAmount = 0;

			// check if data available from JSON
			if (this.data.rqstParams.bookedTripFareList.length > 0 && this.data.rqstParams.bookedTripFareList[0].totalAmount != null) {
				totalAmount += this.data.rqstParams.bookedTripFareList[0].totalAmount;
			}

			if (this.data.rqstParams.bookedTripFareList.length > 1 && this.data.rqstParams.bookedTripFareList[1].totalAmount != null) {
				totalAmount = this.data.rqstParams.bookedTripFareList[1].totalAmount;
			}

			// print currency in locale specified format
			return this.utils.printCurrency(totalAmount, this.__getFractionDigits());
		},

		_getOldTotalMiles: function() {
			var totalMiles = 0;
			// check if data available from JSON
			if (this.data.rqstParams.bookedTripFareList.length > 0 && this.data.rqstParams.bookedTripFareList[0].miles != null) {
				totalMiles += this.data.rqstParams.bookedTripFareList[0].miles;
			}
			if (this.data.rqstParams.bookedTripFareList.length > 1 && this.data.rqstParams.bookedTripFareList[1].miles != null) {
				totalMiles = this.data.rqstParams.bookedTripFareList[1].miles;
			}
			// print currency in locale specified format
			return totalMiles;
		},
		__getFractionDigits: function() {
			var fractionDigits = 0;
			if (this.data.config.siteCurrencyFormat != null && this.data.config.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.config.siteCurrencyFormat.substring(this.data.config.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			return fractionDigits;
		},
		_getDate: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParameters != null) {
				var dateParams = dateBean.jsDateParameters.split(',');
				return new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
			}

			return null;
		}
	}
});