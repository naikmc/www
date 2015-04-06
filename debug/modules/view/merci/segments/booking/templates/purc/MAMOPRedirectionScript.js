Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MAMOPRedirectionScript',
	$constructor: function() {

	},
	$prototype: {

		$displayReady: function() {
			// submit form
			document.forms['aliPayPayment'].submit();
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAMOPRedirection",
						data:{}
					});
			}
		}
	}
});