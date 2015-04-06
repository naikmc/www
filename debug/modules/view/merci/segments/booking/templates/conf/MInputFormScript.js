Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MInputFormScript',

	$constructor: function() {

	},

	$prototype: {

		$dataReady: function() {
		},

		$displayReady: function() {
			/**
			 * Submitting the data transfer form with the iFrame as target is the only way to make this work.
			 * If jquery ajax is used, it gives a "No Access-Control-Allow-Origin header is present on the requested resource" error.
			 * If jquery ajax with expectedResponseType: jsonp is used, the request sent is a GET request and gets rejected by the server.
			 * Since we do not need to process the server response and since we do not have access to the server side code, it seems OK to use the form submit method.
			 * It might cause some regression on the community app, but I guess we will have to look for an alternative.
			 * You can also refer this link for more info: http://stackoverflow.com/questions/298745/how-do-i-send-a-cross-domain-post-request-via-javascript
			 */

			 document.datatransferForm.submit();
			/*var request = {
					formObj: document.getElementById('datatransferForm'),
					action: this.data.siteParams.siteDataTransferLink,
					method: 'POST',
					loading: true,
					isCompleteURL:true,
					expectedResponseType: 'jsonp'
				}
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);*/
		}
	}
});