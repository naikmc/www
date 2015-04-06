Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.M3DSScript',
	$prototype: {
		$displayReady: function() {
			// submit form 
			document.forms['VBYV_FORM'].submit();
		},
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"M3DS",
						data:{}
					});
			}
		}
	}
});