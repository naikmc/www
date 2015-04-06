{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.setting.MSetting',	
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},	
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

	{var showUI=false/}
	
	{macro main()}
		{if pageObjSetting.printUI == true}
			{section {
				id: 'SettingPage',
				macro: 'loadContent'
			}/}
		{/if}
	{/macro}

	{macro loadContent()}

		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{var varLanguage=this.moduleCtrl.getParam("LANGUAGE")/}
		{var countryFromCookie = merciFunc.getCookie('merci.country')/}
		{var languageFromCookie = merciFunc.getCookie('merci.language')/}
		
		{if pageObj.json.jsonData!=null && pageObj.json.jsonData!=undefined }
			{var countryFromCookie = pageObj.json.jsonData.country/}
			{if countryFromCookie ==null}
				{var countryFromCookie = this.countryCode/} 
			{/if}
			{var languageFromCookie = pageObj.json.jsonData.language/}
			{var lNameD=pageObj.json.jsonData.lName/}
			{var kFName=pageObj.json.jsonData.kfNum/}
			{var calendarValue=pageObj.json.jsonData.Calendar/}
			{var awardValue=pageObj.json.jsonData.award/}
		{else/}
			{if countryFromCookie==null || countryFromCookie==undefined }
				{if this.countryCode !=null}
					{var countryFromCookie = this.countryCode/} 
				{else/}
					{var countryFromCookie = ""/}
				{/if}
			{/if}
			{if languageFromCookie==null || languageFromCookie==undefined }
				{var languageFromCookie = ""/}
			{/if}
			
			{var lNameD=""/}
			{var kFName=""/}
		{/if}
		
		{if (lNameD==null || lNameD=="")&& this.lastName!=null && this.lastName!= undefined}
			{set lNameD=this.lastName/}
		{/if}
			
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{call includeError(pageObj.json.labels)/}
		<section class="appSection">
		<div class="settings">

			<article class="panel">
				<header><h1>${pageObj.json.labels.tx_merci_ts_home_UserProfile}</h1></header>
			<section>
					<label for="lastname" >${pageObj.json.labels.tx_merciapps_lbl_str_pref_last_name}
					<p class="smartDropDwn">
					<input name="" id="lastName" value="${lNameD}" type="text" placeholder="${pageObj.json.labels.tx_merciapps_lbl_str_pref_last_name}"  {on change {fn:'onChangeData', args:{"key":"lName","id":"lastName"}}/} {on keyup {fn:'showCross', args: {id:"lastName"}}/} />
					<span class="delete hidden" {on click {fn: 'clearField', args: {id:"lastName"}}/} id="dellastName"><span class="x">x</span></span>
					</p>
					</label>
					
					<label for="miles" >${pageObj.json.labels.tx_merciapps_lbl_frequent_flyer}
					<p class="smartDropDwn">	
					<input name="" id="kFNum" value="${kFName}" type="text" placeholder="${pageObj.json.labels.tx_merciapps_lbl_frequent_flyer}" {on change {fn:'onChangeData', args:{"key":"kfNum","id":"kFNum"}}/} {on keyup {fn:'showCross', args: {id:"kFNum"}}/} >
					<span class="delete hidden" {on click {fn: 'clearField', args: {id:"kFNum"}}/} id="delkFNum"><span class="x">x</span></span>
					</p>
					</label>
				</section>

				<header><h1>${pageObj.json.labels.tx_merciapps_lbl_str_display_settings}</h1></header>                         
				<section>
					<label for="language" >${pageObj.json.labels.tx_merci_text_booking_home_language}</label>
					<select id="language" name="language" {on change {fn:'onChangeData', args:{"key":"language","id":"language"}}/}>
						{if (languageFromCookie == null || languageFromCookie == "")}
							{foreach langName in pageObj.json.gblLists.langNameList}

								{if (varLanguage==langName[1])}

								  <option value="${langName[1]}">${langName[0]}</option>
								 {/if}

							{/foreach}

							{foreach langForSite in pageObj.json.gblLists.langList}
								{foreach langName in pageObj.json.gblLists.langNameList}
									{if (langName[1]!=varLanguage)}
										{if (langName[1] == langForSite)}
															<option value="${langForSite}" {if (langForSite == languageFromCookie || (langForSite == this.languageCode))}selected="selected"{/if}>${langName[0]}</option>
										{/if}
									{/if}
								{/foreach}
							{/foreach}
						{else/}
							{foreach langForSite in pageObj.json.gblLists.langList}
								{foreach langName in pageObj.json.gblLists.langNameList}												
									{if (langName[1] == langForSite)}
										<option value="${langForSite}" {if (langForSite == languageFromCookie || (langForSite == this.languageCode))}selected="selected"{/if}>${langName[0]}</option>
									{/if}												
								{/foreach}
							{/foreach}
						{/if}	
					</select>
					
					
					<label for="country" >${pageObj.json.labels.tx_merci_text_cont_country}</label>
					<select id="country" name="country"  {on change {fn:'onChangeData', args:{"key":"country","id":"country"}}/}>
						{foreach country in pageObj.json.gblLists.countryList}
							<option value="${country}" {if (country[0] == countryFromCookie)}selected="selected"{/if}>${country[1]}</option>
						{/foreach}
					</select>
				</section>
				
				{if pageObj.appVersion !=undefined}
					<section>
						
						<dt><span class="customSettingsLabel">${pageObj.json.labels.tx_merciapps_version}</span></dt>
						<dd><span class="customSettingsLabel">${pageObj.appVersion}</span></dd>
						
					</section>
				{/if}

				{if pageObj.json.siteParams.calendarDisplay == 'TRUE' }
					<section>
						<label for="calendar" class="inline customSettingsLabel">${pageObj.json.labels.tx_merciapps_calendar}</label>
						<div class="onoffswitch">
							<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="onoffswitch" {on click {fn:'onChangeData', args:{"key":"Calendar","id":"onoffswitch"}}/}>
							<label class="onoffswitch-label" for="onoffswitch">
								<div class="onoffswitch-inner">
									<div class="onoffswitch-active">${pageObj.json.labels.tx_merci_awards_yes}</div>
									<div class="onoffswitch-inactive">${pageObj.json.labels.tx_merci_awards_no}</div>
								</div>
								<div class="onoffswitch-switch"></div>
							</label>
						</div>
						<p class="requiredText padLeft"><span class="mandatory">* </span><small>${pageObj.json.labels.tx_merciapps_calender_details}</small></p>
					</section>
				{/if}

				{if this.__merciFunc.isRequestFromApps()}
					<section>
						<label for="calendar" class="inline customSettingsLabel">${pageObj.json.labels.tx_merciapps_upgrade}</label>
						<div class="onoffswitch settings">
							<input type="checkbox" name="onoffswitch1" class="onoffswitch-checkbox" id="onoffswitch1" {on click {fn:'onChangeData', args:{"key":"award","id":"onoffswitch1"}}/}>
							<label class="onoffswitch-label" for="onoffswitch1">
								<div class="onoffswitch-inner">
									<div class="onoffswitch-active">${pageObj.json.labels.tx_merci_awards_yes}</div>
									<div class="onoffswitch-inactive">${pageObj.json.labels.tx_merci_awards_no}</div>
								</div>
								<div class="onoffswitch-switch"></div>
							</label>
						</div>	
						<p class="requiredText padLeft"><span class="mandatory">* </span><small>${pageObj.json.labels.tx_merciapps_upgrade_details}</small></p>
					</section>
				{/if}

				{if pageObj.json.siteParams.siteRememberSearch == 'TRUE' }
					<section>
						<label for="calendar" class="inline customSettingsLabel">${pageObj.json.labels.tx_merciapps_remember_search}</label>
						<div class="onoffswitch settings">
							<input type="checkbox" name="onoffswitch2" class="onoffswitch-checkbox" id="onoffswitch2" {on click {fn:'onChangeData', args:{"key":"rememberSearch","id":"onoffswitch2"}}/}>
							<label class="onoffswitch-label" for="onoffswitch2">
								<div class="onoffswitch-inner">
									<div class="onoffswitch-active">${pageObj.json.labels.tx_merci_awards_yes}</div>
									<div class="onoffswitch-inactive">${pageObj.json.labels.tx_merci_awards_no}</div>
								</div>
								<div class="onoffswitch-switch"></div>
							</label>
						</div>	
						<p class="requiredText padLeft"><span class="mandatory">* </span><small>${pageObj.json.labels.tx_merciapps_remember_search_details}</small></p>
					</section>	
				{/if}
				{if pageObj.json.siteParams.isGeoLocationSearchEnabled == 'TRUE' }
					<section>
						<label for="calendar" class="inline customSettingsLabel">${pageObj.json.labels.tx_merci_geo_location}</label>
						<div class="onoffswitch settings">
							<input type="checkbox" name="onoffswitchGeo" class="onoffswitch-checkbox" id="onoffswitchGeo" {on click {fn:'onChangeData', args:{"key":"geoLoc","id":"onoffswitchGeo"}}/}>
							<label class="onoffswitch-label" for="onoffswitchGeo">
								<div class="onoffswitch-inner">
									<div class="onoffswitch-active">${pageObj.json.labels.tx_merci_awards_yes}</div>
									<div class="onoffswitch-inactive">${pageObj.json.labels.tx_merci_awards_no}</div>
								</div>
								<div class="onoffswitch-switch"></div>
							</label>
						</div>	
					</section>	
				{/if}
				{if (this.__merciFunc.isRequestFromApps() && pageObjSetting.__merciFunc.booleanValue(pageObj.json.siteParams.isChangeBackgroundEnabled))}
					<section>
						<button class="ChangeBackInitiate" {on click {fn:'onChangeBackground'}/}><a href="javascript:void(0)" class="">${pageObj.json.labels.tx_merci_change_bkgrd}</a></button>
					</section>
				{/if}				
			</article>
		</div>
		</section>
	    {var isMobileApp = this.__merciFunc.isRequestFromApps() /}
      	{if isMobileApp == true}
      		{var forceUpgradeMessage =  merciAppData.FORCE_UPGRADE_MSG /}
      		{var upgradeButtonText =  merciAppData.UPGRADE_BUTTON_TEXT /}
     		{var ignoreButtonText =  merciAppData.IGNORE_BUTTON_TEXT /}
      		<div class="mask" id ='appUpgradeOverlay'>
        		<div class="dialogue">
          			<h3 class="dialogueContent">${pageObj.json.labels.tx_merciapps_upgrade}</h3>
          			<p id="dialogueContent">${pageObj.json.labels.tx_merciapps_upgrade_prompt}</p>
          			<button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'upgrade'}} /}>${upgradeButtonText}</button>
          			/* Commenting as change required to implement later <button type="button" class="bookCenter" {on click {fn:"handleAutoUpgrade", args:{id:'later'}} /}>Later</button>*/
          			<button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'ignore'}} /}>${ignoreButtonText}</button>
       			</div>
      		</div>
     		<div class="mask" id='forceUpgradeOverlay'>
        		<div class="dialogue">
          			<h3 class="dialogueContent">${pageObj.json.labels.tx_merciapps_upgrade}</h3>
          			<p id="dialogueContent">${forceUpgradeMessage}</p>
          			<button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'force'}} /}>${upgradeButtonText}</button>
        		</div>
     		 </div>
    	{/if}

	    <div class="mask" id='saveDataOverlay'>
			<div class="dialogue">
				<h3 class="dialogueContent">${pageObj.json.labels.tx_merci_text_info_saved}</h3>
				<button type="button" {on click {fn:"formValidation"}/}>${pageObj.json.labels.tx_merciapps_ok}</button>
			</div>
		</div>
		
		<footer class="buttons footer"><button type="button" class="validation customSaveButton" {on click {fn:"formSubmit"} /}>${pageObj.json.labels.tx_merciapps_lbl_save}</button></footer>
	{/macro}
	
	{macro includeError(labels)}			
		{section {
			id: 'errors',
			bindRefreshTo : [{
        inside : this.data,
        to : 'error_msg'
			}],
			macro : {
				name: 'printErrors',
				args: [labels]
			}
		}/}
	{/macro}
	
	{macro printErrors(labels)}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
{/if}
			
		// resetting binding flag
		${aria.utils.Json.setValue(this.data, 'error_msg', false)|eat}
{/macro}
{/Template}