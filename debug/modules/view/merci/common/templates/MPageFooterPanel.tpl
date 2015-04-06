{Template {
		$classpath: 'modules.view.merci.common.templates.MPageFooterPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: false
}}

	{macro main()}
		{section {
			id: 'footerPanel',
			macro : {
				name: 'printFooterPanel'
			}
		}/}
	{/macro}

	{macro printFooterPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
    {var foot = this.moduleCtrl.getModuleData().panelParams.FOOTER_PANEL/}
    {if foot != "" && foot!= undefined && foot.CONTENT!= undefined}
     {var footC = foot.CONTENT/}
      {if foot.TYPE == "URL"}
      <div id="footerPanel" class="templateFooter">
         <object class="templateFooterObj" type="text/html" data="${footC}"></object>
      </div>
      {else/}
         ${footC}
       {/if}
      {/if}
    {/if}
	{/macro}
{/Template}