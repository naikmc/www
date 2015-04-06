{Template {
  $classpath:'modules.view.merci.common.templates.MWelcome',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},	
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
  $extends: 'modules.view.merci.common.templates.MIndexPage',
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

		{if showUI==true}
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
			{var labels = this.moduleCtrl.getModuleData().booking.MWELC_A.labels/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MWELC_A.globalList/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MWELC_A.siteParam/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MWELC_A.requestParam/}
			
			<section>
				<form>
					{call includeError(labels)/}
					<article class="panel login">
						<header>
							<h1>Local preferences</h1>
						</header>

						<section>
						{var varLanguage=this.moduleCtrl.getParam("LANGUAGE")/}
						{var countryFromCookie = merciFunc.getCookie('merci.country')/}
						{var languageFromCookie = merciFunc.getCookie('merci.language')/}
						    <p class="user">
								<label for="country">${labels.tx_merci_text_booking_home_countryliving}</label>
								<select id="country" name="country">
												<option {if (countryFromCookie == null || countryFromCookie == "")}selected="selected"{/if} value="select" >${labels.tx_merci_text_booking_select}</option>
									{foreach country in gblLists.countryList}
													<option value="${country}" {if (country[0] == countryFromCookie || (country[0] == rqstParams.request.clientCountry))}selected="selected"{/if}>${country[1]}</option>
									{/foreach}
								</select>
						 </p>
						<p class="pin">
						<label for="language">${labels.tx_merci_text_booking_home_language}</label>
						<select id="language" name="language">
									{if ((countryFromCookie == null || countryFromCookie == "") && (languageFromCookie == null || languageFromCookie == ""))}
						{foreach langName in gblLists.langNameList}

							{if (varLanguage==langName[1])}

							  <option value="${langName[1]}">${langName[0]}</option>
							 {/if}

						{/foreach}


						{foreach langForSite in gblLists.langList}
							{foreach langName in gblLists.langNameList}
								{if (langName[1]!=varLanguage)}
									{if (langName[1] == langForSite)}
														<option value="${langForSite}" {if (langForSite == languageFromCookie || (langForSite == rqstParams.request.clientLanguage))}selected="selected"{/if}>${langName[0]}</option>
													{/if}
												{/if}
											{/foreach}
										{/foreach}
									{else/}
										{foreach langForSite in gblLists.langList}
											{foreach langName in gblLists.langNameList}												
												{if (langName[1] == langForSite)}
													<option value="${langForSite}" {if (langForSite == languageFromCookie || (langForSite == rqstParams.request.clientLanguage))}selected="selected"{/if}>${langName[0]}</option>
												{/if}												
											{/foreach}
										{/foreach}
									{/if}	

								</select>
							</p>


						</section>

					</article>

					<footer class="buttons">
						<button type="submit" onclick="javascript:return false" class="validation" {on click {fn:"OnContinueButtonClick"} /}>{if ((countryFromCookie == null || countryFromCookie == "") && (languageFromCookie == null || languageFromCookie == ""))}${labels.tx_merci_text_booking_continue}{else/}${labels.tx_merci_text_chgelang_save}{/if}</button>
					</footer>



				</form>
			</section>
		{/if}
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