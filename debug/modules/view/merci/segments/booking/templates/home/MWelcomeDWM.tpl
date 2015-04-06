{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.home.MWelcomeDWM',
	$hasScript: true
}}
	
	{macro main()}
		<div {id "merci_wrapper"/}>
			${this.data.requestParam.homepage_content}
		</div>
	{/macro}
{/Template}