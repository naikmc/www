{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.M3DS',
	$dependencies: ['modules.view.merci.common.utils.URLManager'],
	$hasScript: true
}}
	
	{macro main()}
	
		{var rqstParams = this.moduleCtrl.getModuleData().booking.M3DS_A.requestParam/}
		
		{var actionInput = 'BOOK'/}
		{var uiAction = 'MMBookTripPlan'/}
			
		{if rqstParams.templateName == 'mpurc'}
			{set uiAction = 'ModifyBookTripPlan'/}
			{if rqstParams.jspFrom != null && rqstParams.jspFrom == 'mfsr'}
				{set actionInput = 'MODIFY'/}
			{/if}
		{elseif rqstParams.fareBreakdown != null && rqstParams.fareBreakdown.rebookingStatus == true/}
			{set actionInput = 'REBOOK'/}
			{set uiAction = 'MMBookTripPlan'/}
		{elseif rqstParams.flowType != null && rqstParams.flowType.voucherRedemptionFlow == true/}
			{set uiAction = 'MMBookTripPlan'/}
		{elseif rqstParams.templateName == 'mins'/}
			{set uiAction = 'BookTripPlan'/}
			{set actionInput = 'ADD_INSURANCE'/}
		{/if}
			
		{var commonPath = modules.view.merci.common.utils.URLManager.getFullURL(uiAction, {defaultParams: true})+ "&ACTION=" + actionInput/}
		
		{var strConfirmationUrl = commonPath + "&STATUS=OK"/}
		{var strCancellationUrl = commonPath + "&STATUS=KO"/}
		{var strKeepAliveSessionUrl = modules.view.merci.common.utils.URLManager.getFullURL("KeepAliveSessionAction.action", null) + "&ACTION=" + actionInput/}
		{var vbyv_term_url = modules.view.merci.common.utils.URLManager.getFullURL("MDisplayViewVBV.action", null) + "&JSP_NAME_KEY=SITE_JSP_VBV_FRAME_BREAK&ACTION=" + actionInput/}
		
		<form name="VBYV_FORM" action="${rqstParams.reply.acsURL}" method="POST">
			<input type="hidden" name="MD" value="${rqstParams.reply.merchantData}">
			<input type="hidden" name="PaReq" value="${rqstParams.reply.base64Pareq}">
			<input type="hidden" name="TermUrl" value="${vbyv_term_url}">
			<input type="hidden" name="CONFIRMATION_URL" value="${strConfirmationUrl}"/>
			<input type="hidden" name="CANCELLATION_URL" value="${strCancellationUrl}"/>
			<input type="hidden" name="KEEPALIVESESSION_URL" value="${strKeepAliveSessionUrl}"/>
			<input type="hidden" name="PLTG_FROMPAGE" value="${rqstParams.templateName}" />
		</form>
		
		<div class="dark loading"></div>
	{/macro}
{/Template}