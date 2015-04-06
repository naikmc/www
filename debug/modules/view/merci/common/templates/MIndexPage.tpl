{Template {
  $classpath: "modules.view.merci.common.templates.MIndexPage",
  $hasScript: true
}}

  {macro main()}
  	<section>
	    {if (!this.data.fromMenu)}
        {if this.data.labels.tx_merci_text_booking_home_welcome != 'undefined' && this.data.labels.tx_merci_text_booking_home_welcome != ""}
		      <div class="welcomeNote" id="welcomeNote"></div>
        {/if}
        
        /*For showing local stored bording passes in screen*/
			  <div id="slideshow" class="displayNone">
	      	<div id="slidesContainer">
	      	</div>
	      </div>
	      <div class="displayNone" id="showOriginalBP">
	       <span class="CancelHomeBp" onclick="modules.view.merci.common.utils.MCommonScript.closeDsisplayBPHome()"></span>
	      </div>
	   
	    
	      {if this.utils.isRequestFromApps()==true && this.utils.booleanValue(this.data.config.siteEnbTeaser) !=false}
      	    <div class="teaser"><img src=${this.data.config.siteTeaser}></div>
        {else/}
          {if this.utils.isRequestFromApps()==true}
              <div class="teaser">teaser</div>
          {/if}
        {/if}
 {/if}
      /* The below foreach fetches the buttons list from TP_SiteLanguageCustomLinks sorted in 'Prioirity' order */

      {if !this.data.fromMenu && this.data.request.requestParam && !this.utils.isEmptyObject(this.data.request.requestParam.DWM_SPLASH_CONTENT)}
          <div id="DWMSplashScreen" class="DWMSplashScreen">
            {@html:Template {
                classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                data: {
                  placeholder: this.data.request.requestParam.DWM_SPLASH_CONTENT,
                  placeholderType: "dwmContent"
                }
            }/} 
          </div>
      {/if}

      {var buttonNames = this.getButtons({buttons: this.data.globalList.customButtons})/}
      {@html:Template {
        classpath: "modules.view.merci.common.templates.MNavButtons",

        args: [
                      'navigation',
			     buttonNames
                        ],
                        attributes: {
                            classList: ['home-page']
                        },
				data: {
					labels: this.data.labels,
					config: this.data.config,
					lastName: this.lastName,
					request: this.data.request,
					pageDesc:"fromIndexPage",
					globalList: this.data.globalList,
					fareDeals: {
						countrySite: this.data.request.fareDeals
					},
					isUserLoggedIn : this.IS_USER_LOGGED_IN,
          isFromMenu: this.data.fromMenu
				},
        block: true
      }/}
      {if !this.data.fromMenu 
          && this.data.config.siteCopyYear != 'undefined' 
          && this.data.config.siteCopyYear != ""}
	  		<div class="copyRightYear" id="copyRightYear"></div>
      {/if}
		</section>

    {var isMobileApp = this.utils.isRequestFromApps() /}
    {if !this.data.fromMenu  && isMobileApp == true}
      {var forceUpgradeMessage =  merciAppData.FORCE_UPGRADE_MSG /}
      {var upgradeButtonText =  merciAppData.UPGRADE_BUTTON_TEXT /}
      {var ignoreButtonText =  merciAppData.IGNORE_BUTTON_TEXT /}
      {var remindMeLaterButtonText = merciAppData.REMINDMELATER_BUTTON_TEXT /}
      <div class="mask" id ='appUpgradeOverlay'>
        <div class="dialogue">
          <h3 class="dialogueContent">${this.data.labels.tx_merciapps_upgrade}</h3>
          <p id="dialogueContent">${this.data.labels.tx_merciapps_upgrade_prompt}</p>
          <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'upgrade'}} /}>${upgradeButtonText}</button>
          <button type="button" class="upgradeButton" class="bookCenter" {on click {fn:"handleAutoUpgrade", args:{id:'later'}} /}>${remindMeLaterButtonText}</button>
          <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'ignore'}} /}>${ignoreButtonText}</button>
        </div>
      </div>
      <div class="mask" id='forceUpgradeOverlay'>
        <div class="dialogue">
          <h3 class="dialogueContent">${this.data.labels.tx_merciapps_upgrade}</h3>
          <p id="dialogueContent">${forceUpgradeMessage}</p>
          <button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'force'}} /}>${upgradeButtonText}</button>
        </div>
      </div>
    {/if}
	{/macro}

{/Template}