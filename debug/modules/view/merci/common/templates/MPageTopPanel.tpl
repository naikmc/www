{Template {
		$classpath: 'modules.view.merci.common.templates.MPageTopPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: false
}}

	{macro main()}
		{section {
			id: 'topPanel',
			macro : {
				name: 'printTopPanel'
			}
		}/}
	{/macro}

	{macro printTopPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
    {var top = this.moduleCtrl.getModuleData().panelParams.TOP_PANEL/}
    {if top != "" && top != undefined && top.CONTENT!= undefined}
     {var topC = top.CONTENT/}
     <div id="topPanel" class="headerBodyCenter">
      {if top.TYPE == "URL"}
         <object class="headerBodyCenterObj" type="text/html" data="${topC}"></object>
      {else/}
         ${topC}
       {/if}
      </div>
    {/if}
   {/if}
	{/macro}
{/Template}