{Template {
		$classpath: 'modules.view.merci.common.templates.MPageHeaderPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: false
}}

	{macro main()}
		{section {
			id: 'headerPanel',
			macro : {
				name: 'printHeaderPanel'
			}
		}/}
	{/macro}

	{macro printHeaderPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
  	 {var head = this.moduleCtrl.getModuleData().panelParams.HEADER_PANEL/}
  	 {if head != "" && head != undefined && head.CONTENT != undefined}
  	 {var headC = head.CONTENT/}
      <div id="headerPanel" class="templateHeader">
       {if head.TYPE == "URL"}
         <object class="templateHeaderObj" type="text/html" data="${headC}"></object>
       {else/}
         ${headC}
       {/if}
      </div>
     {/if}
   {/if}
	{/macro}
{/Template}