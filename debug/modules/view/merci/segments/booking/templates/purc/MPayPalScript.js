Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPayPalScript',
	$constructor: function() {

	},
	$prototype: {

		$displayReady: function() {
			// submit form
			document.forms['payPalPayment'].submit();
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPayPal",
						data:{}
					});
			}
		}
	}
});