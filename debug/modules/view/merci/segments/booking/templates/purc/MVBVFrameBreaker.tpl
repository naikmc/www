{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MVBVFrameBreaker',
	$hasScript: true
}}
	
	{macro main()}
	
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MVBVFrameBreaker_A.requestParam/}
		<form id="BREAK_FORM">
			<input type="hidden" name="result" value="json">
			<input type="hidden" name="MD" value="${rqstParams.request.md}">
			<input type="hidden" name="PaRes" value="${rqstParams.request.paRes}">
			<input type="hidden" name="ACTION" value="${rqstParams.request.ACTION}">
		</form>
		
		<div class="dark loading"></div>
	{/macro}
{/Template}