{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.more.MMore',	
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},	
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}
	

	{var showUI=false/}
	{macro main()}
		{if pageObjMore.printUI == true}
			{section {
				id: 'MorePage',
				macro: 'loadContent'
			}/}
		{/if}
	{/macro}
	
	{macro loadContent()}
		<section>
			<nav class="navigation">
				<ul>
					{var x=false /}
					{if x==false}
						<li><a href="javascript:void(0)" {on click {fn: 'onSettingClick', scope: this}/} class="navigation">
								${pageObjMore.json.labels.tx_merciapps_settings}
							</a>
						</li>
					{/if}
		
					{if x==false}
						<li><a href="javascript:void(0)" {on click {fn: 'onTermCondClick', scope: this}/} class="navigation disabled">
								//${this.data.labels.tx_merci_text_mybook_selmeal}
								${pageObjMore.json.labels.tx_merci_ts_termsofuse_TermsAndConditions}
							</a>
						</li>
					{/if}
			
					{if x==false}
						<li><a href="javascript:void(0)" {on click {fn: 'onFAQClick', scope: this}/} class="navigation disabled">
								${pageObjMore.json.labels.tx_merciapps_lbl_str_faq}
							</a>
						</li>
					{/if}
			
					{if x==false}
						<li><a href="javascript:void(0)" {on click {fn: 'onPrivacyPolicyClick', scope: this}/} class="navigation disabled">
								${pageObjMore.json.labels.tx_merciapps_lbl_str_privacy_policy}
							</a>
						</li>
					{/if}
				</ul>
			</nav>
		<section>
	{/macro}
	
{/Template}