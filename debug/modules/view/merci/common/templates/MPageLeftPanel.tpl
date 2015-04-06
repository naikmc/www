{Template {
		$classpath: 'modules.view.merci.common.templates.MPageLeftPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: true
}}

	{macro main()}
		{section {
			id: 'leftPanel',
			macro : {
				name: 'printLeftPanel'
			}
		}/}
	{/macro}

	{macro printLeftPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
    {var left = this.moduleCtrl.getModuleData().panelParams.LEFT_PANEL/}
    {if left != "" && left!= undefined && left.CONTENT!= undefined}
    {var leftC = left.CONTENT/}
    {if left.TYPE == "URL"}
         <object class="templateBodyLeftObj" type="text/html" data="${leftC}" style="height:50em;"></object>
    {else/}
         ${leftC}
     {/if}
    {/if}
  {/if}
	{/macro}
{/Template}