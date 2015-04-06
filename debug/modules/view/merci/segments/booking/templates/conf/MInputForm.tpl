{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MInputForm',
	$hasScript: true
}}

{macro main()}
	{var dataTransferBean=this.data.rqstParams.dataTransferBean /}
	{var parameters = new modules.view.merci.common.utils.StringBufferImpl() /}
	<form id="datatransferForm" method="POST" action="${this.data.siteParams.siteDataTransferLink}" target="dtIframe" name="datatransferForm" >
	{foreach key in dataTransferBean}
		<input type="hidden" id="${key_index}" name="${key_index}" value="${key}" />
	{/foreach}
	</form>
	
	<iframe name="dtIframe" class="displayNone" seamless> </iframe>

{/macro}

{/Template}