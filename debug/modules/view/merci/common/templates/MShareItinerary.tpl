{Template {
	$classpath: 'modules.view.merci.common.templates.MShareItinerary',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib'
	},
	$hasScript: true
}}
	
	{macro main()}

		{section {
			id: "shareItin",
			type: "div",
			bindRefreshTo: [
				{ to:"shareResponse", inside:data.shareData }
			],
			macro: {
				name: "displayShareTrip",
				scope: this,
			}
		}/}

	{/macro}


	{macro displayShareTrip()}
		{if !this.__merciFunc.isEmptyObject(this.data.shareData.shareResponse)}
			<section class="shareItin-email" id="shareItin-email" style="display: none;">
			  <header class="blueBanner"> <span class="containerLabel">${this.data.labels.tx_merci_my_booking_share}</span>
			    <button class="sliderClose" {on tap {fn:'cancelShare', scope:this}/}><span class="icon-remove"></span></button>
			  </header>
			  <article>
			  	{call includeError()/}
			  	{call successMessage()/}			  	
			    <article class="panel share-slider shareBitly" aria-expanded="true" style="">
			      <div class="container">
			        <ul class="tabs">
			          <li class="tab-link current" id="tab-1" {on tap {fn:'toggleDisplay', scope:this}/}>${this.data.labels.tx_merci_email_share}</li>
			          <li class="tab-link" id="tab-2" {on tap {fn:'toggleDisplay', scope:this}/}>${this.data.labels.tx_merci_SMS_share}</li>
			        </ul>
			        <div id="tab-1Content" class="tab-content current">
			          <div class="share-content share-mail" style=""> 
			            <div>
			            	{var subjectPlaceholder = this.data.labels.tx_merciapps_book_a_flight_to +" "+this.data.destination /}
			              <label>${this.data.labels.tx_merci_text_mail_subject}:</label>
			              <input name="TITLE" id="emailTitle" type="text" placeholder="${subjectPlaceholder}"></input>
			            </div>
			            <div>
			              <label>${this.data.labels.tx_merci_text_mailA_from}:</label>
			              <input name="FROM" id="travellerFromEmail" type="text" value="" placeholder="${this.data.labels.tx_merci_text_mailA_from_placeholder}">
			            </div>
			            <div>
			              <label>${this.data.labels.tx_merci_text_mailA_to}:</label>
			              <input name="TO" id="travellerToEmail" type="text" value="" placeholder="${this.data.labels.tx_merci_text_mailA_to_placeholder}">
			              <small>${this.data.labels.tx_merci_mail_id_seperation}</small> </div>
			            <textarea name="BODY" style="width:100%;height:100px;" id="emailta" readonly="true">
			            	${this.data.labels.tx_merciapps_book_a_flight_to} ${this.data.destination} - ${this.data.shareData.shareResponse.ShortURL} 
			            </textarea>
			            <footer>
			              <button id="cancelMail" type="button" {on tap {fn:'cancelShare', scope:this}/}>${this.data.labels.tx_merci_text_mail_btncancel}</button>
			              <button class="secondary" id="sendMail" type="button" {on tap {fn:'sendEmail', scope:this}/}>${this.data.labels.tx_merci_text_mail_btnsend}</button>
			            </footer>
			          </div>
			        </div>
			        <div id="tab-2Content" class="tab-content">
			          <div class="share-content share-sms" style="">
			            <div>
			              <label><strong>${this.data.labels.tx_merci_text_mailA_to}:</strong></label>
			              <div class="list phone">
			                <ul class="input">
			                  <li>
			                    <label for="travellerAreaCode">Area Code</label>
			                    <input id="travellerAreaCode" type="text">
			                  </li>
			                  <li>
			                    <label for="travellerPhoneNo">Phone Number</label>
			                    <input id="travellerPhoneNo" type="text" number="">
			                  </li>
			                </ul>
			              </div>
			            </div>
			            
			            <textarea style="width:100%;height:100px;" id="smsta" readonly="true">
			            	${this.data.labels.tx_merciapps_book_a_flight_to} ${this.data.destination} - ${this.data.shareData.shareResponse.ShortURL}
			            </textarea>
			            <footer>
			              <button id="cancelSms" type="button" {on tap {fn:'cancelShare', scope:this}/}>${this.data.labels.tx_merci_text_mail_btncancel}</button>
			              <button class="secondary" id="sendSms" type="button" {on tap {fn:'sendSMS', scope:this}/}>${this.data.labels.tx_merci_text_mail_btnsend}</button>
			            </footer>
			          </div>
			        </div>
			      </div>
			    </article>
			  </article>
			</section>
		{/if}
	{/macro}

	{macro includeError()}
		{section {
			id: 'errors',
			bindRefreshTo : [{
		        inside : this.data,
		        to : 'error_msg'
			}],
			macro : {
				name: 'printErrors'
			}
		}/}
	{/macro}
	{macro successMessage()}
		{section {
			id: 'successMsg',
			bindRefreshTo : [{
		        inside : this.data,
		        to : 'success_msg'
			}],
			macro : {
				name: 'printSuccessMsg'
			}
		}/}
	{/macro}	
	{macro printErrors()}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if this.labels != null && this.labels.tx_merci_text_error_message != null}
				{set errorTitle = this.labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
		{/if}
		// resetting binding flag
		${aria.utils.Json.setValue(this.data, 'error_msg', false)|eat}
	{/macro}
	{macro printSuccessMsg()}
		{if this.data.success_msg}
			<div class="msg validation">
				<ul>
					<li>${this.data.labels.errors[2130023].localizedMessage}</li>
				</ul>
			</div>
		{/if}
		// resetting binding flag
		${aria.utils.Json.setValue(this.data, 'success_msg', false)|eat}
	{/macro}
{/Template}