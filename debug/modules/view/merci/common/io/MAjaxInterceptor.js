Aria.classDefinition({
	$classpath: "modules.view.merci.common.io.MAjaxInterceptor",
	$extends: "aria.core.IOFilter",

	$constructor: function() {
		this.$IOFilter.constructor.call(this);
	},

	$prototype: {

		// intercepting json response
		onResponse: function(serverResponse) {

			// if response contains new framework data, then replace it with existing one
			// new response may contain new session id which should be updated otherwise URL will not be created properly
			if (serverResponse.res.responseJSON != null && serverResponse.res.responseJSON.data != null && serverResponse.res.responseJSON.data.framework != null) {
				jsonResponse.data.framework = serverResponse.res.responseJSON.data.framework;
			}
		}
	}
});