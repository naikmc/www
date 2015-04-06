{Template {
  $classpath: "modules.view.merci.common.templates.home.MCustomHomePage",
  $macrolibs: {
  	common: 'modules.view.merci.common.utils.MerciCommonLib'  	
  },
  $hasScript: true
}}

	{macro main()}
		{call customUISection()/}
	{/macro}
	
	{macro customUISection()}
		{if this.utils.booleanValue(this.config.isCustomHomeEnabled)}
			

			{if !this.utils.isEmptyObject(this.requestParam.customHomeContent)}
		          {@html:Template {
			            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
			            data: {
			            	placeholder: this.requestParam.customHomeContent,
			            	placeholderType: "custom_wrapper"
			            }
		          }/}
			{/if}
			{var isMobileApp = this.utils.isRequestFromApps() /}
			{if !this.data.fromMenu  && isMobileApp == true}
			  {var forceUpgradeMessage =  merciAppData.FORCE_UPGRADE_MSG /}
			  {var upgradeButtonText =  merciAppData.UPGRADE_BUTTON_TEXT /}
			  {var ignoreButtonText =  merciAppData.IGNORE_BUTTON_TEXT /}
			  {var remindMeLaterButtonText = merciAppData.REMINDMELATER_BUTTON_TEXT /}
			  <div class="mask" id ='appUpgradeOverlay'>
				<div class="dialogue">
				  <h3 class="dialogueContent">${this.labels.tx_merciapps_upgrade}</h3>
				  <p id="dialogueContent">${this.labels.tx_merciapps_upgrade_prompt}</p>
				  <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'upgrade'}} /}>${upgradeButtonText}</button>
				  <button type="button" class="upgradeButton" class="bookCenter" {on click {fn:"handleAutoUpgrade", args:{id:'later'}} /}>${remindMeLaterButtonText}</button>
				  <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'ignore'}} /}>${ignoreButtonText}</button>
				</div>
			  </div>
			  <div class="mask" id='forceUpgradeOverlay'>
				<div class="dialogue">
				  <h3 class="dialogueContent">${this.labels.tx_merciapps_upgrade}</h3>
				  <p id="dialogueContent">${forceUpgradeMessage}</p>
				  <button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'force'}} /}>${upgradeButtonText}</button>
				</div>
			  </div>
			{/if}

		{/if}
	{/macro}
{/Template}