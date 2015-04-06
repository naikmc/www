{Template {
		$classpath: 'modules.view.merci.common.templates.MPageBottomPanel',
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: false
}}

	{macro main()}
		{section {
			id: 'bottomPanel',
			macro : {
				name: 'printBottomPanel'
			}
		}/}
	{/macro}

	{macro printBottomPanel()}
	{if this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams!=undefined}
    {var bottom = this.moduleCtrl.getModuleData().panelParams.BOTTOM_PANEL/}
    {if bottom != "" && bottom!=undefined && bottom.CONTENT!=undefined}
    {var bottomC = bottom.CONTENT/}
     <div id="bottomPanel" class="footerBodyCenter">
      {if bottom.TYPE == "URL"}
         <object class="templateBodyBottomObj" type="text/html" data="${bottomC}"></object>
       {else/}
         ${bottomC}
       {/if}
      </div>
    {/if}
  {/if}
	{/macro}
{/Template}