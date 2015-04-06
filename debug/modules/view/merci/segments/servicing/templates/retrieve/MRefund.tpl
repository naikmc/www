{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MRefund",
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
	},
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$hasScript: true
}}

  {macro main()}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		<section id="rebookSearch" class="tabletContainer">
			<form {id "Form" /}>  			
				
				{call includeError(labels)/}
    			{section {
      				type: 'div',
      				id: 'messages',
      				macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
      				bindRefreshTo: [{inside: this.data, to: 'messages'}]
    			}/}

				<div class="msg info">
					<ul>
						<li>${this.labels.tx_merci_text_rfnd_reviewrefund}</li>
					<ul>
				</div>
        {if Object.keys(this.refundDetails).length>0}
				<div class="ticketInfoPanel">
                <article class="panel trip marginLeftZero arrival">
                  <header class="toggleOpen" {on click {fn: this.toggleOpen, scope: this}/}>
                    <h1>{if Object.keys(this.locDetails).length>0}${this.locDetails.startLoc} - ${this.locDetails.endLoc}{/if}
                      <div class="plusMinusIcon"></div>
                    </h1>
                  </header>
                  <section class="ticketInfoDet">
                    <ul>
                      <li>
                        <ul>
                           <li>${this.labels.tx_merci_text_rfnd_paid} <span>${this.refundDetails.CURRENCY.CODE} ${this.refundDetails.AMOUNT_WITHOUT_TAX_PAID}</span> </li>
                         </ul>
                     		 <div class="ticketInfoDetails" style="display: none;">
                       			 <ul>
                                <li>${this.labels.tx_merci_text_rfnd_refund}<span>${this.refundDetails.CURRENCY.CODE} ${this.refundDetails.totalRefund}</span></li>
                          			 <li>${this.labels.tx_merci_text_rfnd_taxsurcharge}<span>${this.refundDetails.CURRENCY.CODE} ${this.refundDetails.TAX}</span></li>
                       			 </ul>
                     		 </div>                     	 
                      </li>                      
                     <li>
                      {if this.refundDetails.PENALTY}
                         <div class="ticketInfoDetails" style="display: none;">
                             <ul>                                
                                 <li>${this.labels.tx_merci_text_rfnd_penality}<span>- ${this.refundDetails.CURRENCY.CODE} ${this.refundDetails.PENALTY.AMOUNT}</span></li>
                             </ul>
                         </div>
                      {/if}
                       <ul>

                           <li><strong>${this.labels.tx_merci_text_rfnd_refundable} </strong><span><strong>${this.refundDetails.CURRENCY.CODE} ${this.refundDetails.totalRefund}</strong></span> </li>
                         </ul>
                      </li>
                    
                    </ul>
                  </section>
                </article>
                 <footer class="buttons">
                  <button type="button" class="validation" {on click {fn: '_refundPopUp', scope: this}/}>${this.labels.tx_merci_text_rfnd_refund}</button>
                  <button type="button" class="validation back" {on tap {fn:'goBack', scope: this.moduleCtrl}/}>${this.labels.tx_merci_text_rfnd_back}</button>
                </footer>
              </div>	
              {/if}						
				
  			</form>    		
		</section>
    {call refundForm()/}   
    {call refundConfirmPopUp()/}
	{/macro}
  {macro refundForm()}
  <div id="refundPopupId" class="dialog native refundPopup" style="display: none;">
  <div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
    <form id="refundForm">
      <p>${this.labels.tx_merci_text_rfnd_cancelInfo}</p>
      <p>${this.labels.tx_merci_text_rfnd_cancelEmail}</p>
      <input type="email" required id="CONTACT_POINT_EMAIL_1" name="CONTACT_POINT_EMAIL_1" value="" />
      <input type="hidden" id="REC_LOC" name="REC_LOC" value=${this.rqstParam.fareBreakdown.pnrs[0].recLocator} />
      {call hiddenInputs()/}
      <div class="padFour">
        <footer class="buttons">
        <button type="button" class="validation active" {on click {fn: '_onRefundClick'}/}>${this.labels.tx_merci_text_rfnd_confirmrefund}</button>
        <button class="cancel" type="button" {on click {fn: '_onRefundCancel'}/}>${this.labels.tx_merci_text_rfnd_notyet}</button>
        </footer>
      </div>

    </form>

  </div>
  {/macro}

  {macro refundConfirmPopUp()}
  <div id="refundConfId" class="dialog native refundConfPopup" style="display: none;">
    <div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
    <form id="refundConfirmForm">
      <p>${this.labels.tx_merci_text_rfnd_rfndconfirmed}</p>
      <p><strong>${this.labels.tx_merci_text_rfnd_emailsent}</strong> </p>
      <p id="confirmationEmail"><strong><span></span></strong></p>
      <footer class="buttons">
      <input type="hidden" name="result" value="json" />
      <button class="validation" type="button" {on click {fn: '_loadTripsPage'}/}>${this.labels.tx_merci_text_booking_continue}</button>
      </footer>
    </form>
  </div>
  {/macro}
	{macro hiddenInputs()}		
	    <input type="hidden" name="result" value="json" />	    
	    <input type="hidden" name="MAIL_TYPE" value="HTML"/>
	    <input type="hidden" id="REFUND_CONFIRMATION" name="REFUND_CONFIRMATION" value="true"/>            
	{/macro}
	
	{macro includeError(labels)}
		{section {
			id: 'errors',
      macro: {name: 'includeErrorDetails', args:[labels], scope: this},
			bindRefreshTo : [{
        inside : this.data,
        to : "errorOccured",
        recursive : true
			}]
		}/}
	{/macro}

  {macro includeErrorDetails(labels)}
      {if this.data.errors != null && this.data.errors.length > 0}
        {var errorTitle = ''/}
        {if labels != null && labels.tx_merci_text_error_message != null}
          {set errorTitle = labels.tx_merci_text_error_message/}
        {/if}
        {call message.showError({list: this.data.errors, title: errorTitle})/}
        // resetting binding flag
        ${this.data.errorOccured = false|eat}
      {/if}
  {/macro}
{/Template}