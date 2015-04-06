{Template {
	$classpath: 'modules.view.merci.common.templates.MDisplayPopup',
	$macrolibs: {
		common: 'modules.view.merci.common.utils.MerciCommonLib', 
		displayPopupLib: 'modules.view.merci.common.utils.MDisplayPopupLib',
		message: 'modules.view.merci.common.utils.MerciMsgLib'
	},
	$hasScript: true
}}

	{macro main()}

		<article class="panel login tab">
			{if this.popup.data.showHeader!=true}
          		<button type="button" class="PoPuPclose" role="button" {on click {fn: 'closePopup'}/}></button>
          	{/if}
	     
			{if (this.popup.settings.macro=="htmlPopup")}
				{call displayPopupLib.displayHTMLPopup(this.popup.data)/}
			{elseif (this.popup.settings.macro=="displayURLHTMLPopup")/}
				{call displayPopupLib.displayURLHTMLPopup(this.popup.data)/}
			{elseif (this.popup.settings.macro=="priceBreakDown")/}
				{call displayPopupLib.displayPriceBreakDown(this.popup.data)/}
			{elseif (this.popup.settings.macro=="fareConditions")/}
				{call displayPopupLib.displayFareConditions(this.popup.data)/}
			{elseif (this.popup.settings.macro=="currencyConverter")/}
				{call displayPopupLib.displayCurrencyConverter({data: this.popup.data, 
																moduleCtrl: this.moduleCtrl})/}
			{elseif (this.popup.settings.macro=="currencyTerms")/}
				{call displayPopupLib.displayCurrencyTerms(this.popup.data)/}
			{elseif (this.popup.settings.macro=="fareFamilyPopup")/}
				{call displayPopupLib.displayFareFamilyPopup(this.popup.data)/}
			{/if}

			

 		</article>
	{/macro}

{/Template}