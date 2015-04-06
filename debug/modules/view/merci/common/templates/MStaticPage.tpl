{Template {
  $classpath:'modules.view.merci.common.templates.MStaticPage',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},	
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
    $hasScript : true
}}

	{var showUI=false/}

	{macro main()}
		{section {
			id: 'welcomePage',
			macro: 'loadContent'
		}/}
	{/macro}

	{macro loadContent()}
		
			<div id="customPageId">

			</div>
			
	{/macro}
	{macro includeError(labels)}			
		
	{/macro}	
	{macro printErrors(labels)}
		
	{/macro}
{/Template}