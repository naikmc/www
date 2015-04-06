{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPayPal',
	$hasScript: true
}}

	{macro main()}		
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MPayPal_A.requestParam/}
		{var pspURLAccess = rqstParams.paypal.payPalURL/}
		{var method= "POST"/}	

		<form name="payPalPayment" action="${pspURLAccess}" method="${method}">

		</form>
	{/macro}

{/Template}