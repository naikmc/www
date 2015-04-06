{Template{
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MSelectInsurance',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
	$hasScript: true
}}

	{macro main()}
        {var labels = this.moduleCtrl.getModuleData().MSelectInsurance.labels/}
		{var siteParams = this.moduleCtrl.getModuleData().MSelectInsurance.siteParam/}
		{var globalList = this.moduleCtrl.getModuleData().MSelectInsurance.globalList/}
		{var rqstParams = this.moduleCtrl.getModuleData().MSelectInsurance.requestParam/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
	
    <section class="tabletContainer">
  		<form {id "MInsuranceForm" /}>
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}
          {@html:Template {
						classpath: "modules.view.merci.segments.booking.templates.purc.MPurcIns",
						data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'siteParams': siteParams,
								'globalList': globalList,
								'isFromServicingFlow':true
						     }
					}/}
	
               <footer class="buttons">
					<button formaction="javascript:void(0)" id="insConfirmButton" class="validation" {on click {fn:goToPurchasePage,scope: this} /}>${labels.tx_merci_insurance_confirm}</button>
					<button formaction="javascript:void(0)" class="validation cancel" {on click {fn: 'backToTrip',scope:this}/}>${labels.tx_merci_text_booking_cancel}</button>
				</footer>
	    <input type="hidden" name="DIRECT_RETRIEVE" id="DIRECT_RETRIEVE"  value="TRUE"/>	
		<input type="hidden" name="result" value="json"/>
		<input type="hidden" name="PAGE_TICKET" value="${rqstParams.reply.pageTicket}"/>
		<input type="hidden" name="TYPE" value="INSURANCE"/>
		
		</form>
		</section>
	{/macro}

{/Template}