{Template {
		$classpath: 'modules.view.merci.common.templates.MPageRightPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: true
}}

	{macro main()}
		{section {
			id: 'rightPanel',
			macro : {
				name: 'printRightPanel'
			}
		}/}
	{/macro}

	{macro printRightPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
    {var right = this.moduleCtrl.getModuleData().panelParams.RIGHT_PANEL/}
    {if right != "" && right!= undefined && right.CONTENT != undefined}
     {var rightC = right.CONTENT/}
     {if right.TYPE == "URL"}
         <object class="templateBodyRightObj" type="text/html" data="${rightC}" style="height:50em;"></object>
     {elseif right.TYPE == "HTML"/}
         ${rightC}
       {/if}
     {/if}
   {/if}
	{/macro}
{/Template}