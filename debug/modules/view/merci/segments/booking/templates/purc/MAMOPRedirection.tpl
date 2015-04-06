{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MAMOPRedirection',
	$hasScript: true
}}

	{macro main()}		
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MAMOPRedirect_A.requestParam/}
		{var amopRedirectionBean = rqstParams.amopRedirectionBean/}	
		{var params = rqstParams.amopRedirectionBean/}		

		<form name="aliPayPayment" action="${rqstParams.amopRedirectionBean.url}" method="${amopRedirectionBean.method}">
			{foreach parameter in amopRedirectionBean.parameters}
				<input type="hidden" name="${parameter_index}" value="${parameter}"/>
			{/foreach}			
		</form>
	{/macro}

{/Template}