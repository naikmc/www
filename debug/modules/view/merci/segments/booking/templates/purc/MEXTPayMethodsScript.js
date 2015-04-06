Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MEXTPayMethodsScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {

	},
	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this.urlManager = modules.view.merci.common.utils.URLManager;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MEXTPayMethods",
						data:this.data
					});
			}
		},

		hideControls: function() {

			// hiding article from UI
			if (this.data.rqstParams.param.SPEEDBOOK == "TRUE" && this.data.siteParams.siteEnableSpeedBook == "TRUE"){
				var paymentInfo = document.getElementById('paymentInfo');
				if (paymentInfo != null && paymentInfo.className.indexOf('hidden') == -1) {
					paymentInfo.className += " hidden";
				}
			}else{
				var ccControls = document.getElementById('cccontrols');
				if (ccControls != null && ccControls.className.indexOf('hidden') == -1) {
					ccControls.className += " hidden";
				}
			}
		},

		showControls: function() {

			// showing article on UI
			if (this.data.rqstParams.param.SPEEDBOOK == "TRUE" && this.data.siteParams.siteEnableSpeedBook == "TRUE"){
				var paymentInfo = document.getElementById('paymentInfo');
				 if (paymentInfo != null && paymentInfo.className.indexOf('hidden') != -1) {
					 paymentInfo.className = paymentInfo.className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
				 }
			}else{
				 var ccControls = document.getElementById('cccontrols');
				 if (ccControls != null && ccControls.className.indexOf('hidden') != -1) {
					ccControls.className = ccControls.className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
				 }
			}
		},

		_getExtPaymentParams: function() {

			var params = {
				actionInput: 'BOOK',
				uiAction: 'MMBookTripPlan.action'
			}

			if (this.data.rqstParams.templateName == 'mpurc') {
				params.uiAction = 'ModifyBookTripPlan.action';
				if (this.data.rqstParams.jspFrom != null && this.data.rqstParams.jspFrom == 'mfsr') {
					params.actionInput = 'MODIFY';
				}
			} else if (this.data.rqstParams.fareBreakdown.rebookingStatus == true) {
				params.actionInput = 'REBOOK';
				params.uiAction = 'MMBookTripPlan.action';
			} else if (this.data.rqstParams.flowType.voucherRedemptionFlow == true) {
				params.uiAction = 'MMBookTripPlan.action';
			} else if (this.data.rqstParams.templateName == 'mins') {
				params.uiAction = 'BookTripPlan.action';
				params.actionInput = 'ADD_INSURANCE';
			}

			return params;
		},

		_getExtPaymentURLs: function() {

			// get params
			var params = this._getExtPaymentParams();

			// create a common action for confirmation or cancellation
			var commonPath = this.urlManager.getFullURL(params.uiAction, {
				defaultParam: true
			}) + "&ACTION=" + params.actionInput + "&OFFICE_ID=" + this.data.siteParams.siteOfficeId + "&IS_USER_LOGGED_IN=" + this.data.rqstParams.reply.IS_USER_LOGGED_IN;

			// office id added to keep alive URL for PTR 07550299
			var keepAliveURL = this.urlManager.getFullURL("KeepAliveSessionAction.action", null) + "&ACTION=" + params.actionInput + "&OFFICE_ID=" + this.data.siteParams.siteOfficeId + "&IS_USER_LOGGED_IN=" + this.data.rqstParams.reply.IS_USER_LOGGED_IN;

			var urls = {
				confirmationUrl: commonPath + "&STATUS=OK",
				cancellationUrl: commonPath + "&STATUS=KO",
				keepAliveSessionUrl: keepAliveURL
			}

			return urls;
		}
	}
});