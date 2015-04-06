{Template {
	$classpath: 'modules.view.merci.common.templates.MDWMPlaceholder',
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib'
	},
	$hasScript: true
}}

	{var utils = modules.view.merci.common.utils.MCommonScript /}

	{macro main()}
		{if !this.utils.isEmptyObject(this.data.placeholder)}
			<div id="${this.data.placeholderType}" class="${this.data.placeholderType}">
	       		${this.data.placeholder}
	      	</div>
		{/if}		
	{/macro}

{/Template}