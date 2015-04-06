{Template {
		$classpath: 'modules.view.merci.common.templates.MErrorPage',
		$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
		$hasScript: true
}}
	
	{macro main()}
		<article>
			<section>
				{section {
					id: 'errors',
					macro : {
						name: 'printErrors'
					}
				}/}
			</section>
		</article>
	{/macro}
	
	{macro printErrors()}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if this._getLabels().tx_merci_text_error_message != null}
				{set errorTitle = this._getLabels().tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
		{/if}
	{/macro}
	
{/Template}