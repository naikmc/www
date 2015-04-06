{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.email.MMailInfo",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
    <section class="email">
      <form {id "MailForm" /} {on submit {fn: this.onSend, scope: this}/}>
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}
				
				{call includeError()/}
				
        <article class="panel mail">
          <section>
            <p class="location">
              <label for="toInput">${this.labels.tx_merci_text_mailA_to}</label>
              <input name="TO" id="toInput" type="text" value="${this.utils.ifNotEmpty(this.request.TO, '')}">
            </p>
            <p class="location">
              <label for="fromInput">${this.labels.tx_merci_text_mailA_from}</label>
              <input name="FROM" id="fromInput" type="text" value="${this.utils.ifNotEmpty(this.request.FROM, this.getSenderEmail())}">
            </p>
            <p class="location">
              <label for="subjectInput">${this.labels.tx_merci_text_mail_subject}</label>
              <textarea name="SUBJECT" id="subjectInput" cols="" rows="" class="subject"
                {if this.utils.booleanValue(this.config.emailReadOnly)}readonly{/if}
                >${this.labels.tx_merci_text_mail_icon} ${this.formatSubject()}</textarea>
            </p>
            <p class="location">
              <label for="emailMessage">${this.labels.tx_merci_text_mail_msg}</label>
			  
							{var itineraries = this.tripplan.air.itineraries/}
							{if this.utils.booleanValue(this.config.emailReadOnly)}
								<div id="mailReadOnly">
									
									// fix for PTR 07410683 PART-1 OF 2 [START] */
									{var emailData = ''/}
									// fix for PTR 07410683 PART-1 OF 2 [ END ] */
									
									{for var i=0; i<itineraries.length; i++}
										<div class="mailItinerary">
										${this.__getItineraryPrefix(itineraries, i,s,"header")}:
										{for var s=0; s < itineraries[i].segments.length; s++}								
											{var formattedEmail = this.formatEmail(itineraries, i, itineraries[i].segments[s],s)/}
											${formattedEmail|escapeForHTML:false}											
											{if (this.utils.booleanValue(this.config.showFlightInfo) && !this.utils.booleanValue(this.config.hideFlightInfo))}
												${this.labels.tx_merci_text_mail_msgupdate}: <a href="javascript:void(0);" {on click {fn:"onFlightStatusClick",args: {itin:i, seg:s}, scope:this} /}>${this.__getItineraryPrefix(itineraries, i,s,"")}</a>
											{/if}
										{/for}	
										</div>
									{/for}									
									// fix for PTR 07410683 PART-2 OF 2 [START] */
									{if this.data.emailContent == null}
										<input type="hidden" name="BODY" value=""/>
									{else/}
										<input type="hidden" name="BODY" value="${this.data.emailContent.toString()}"/>
									{/if}
									// fix for PTR 07410683 PART-2 OF 2 [ END ] */
								</div>
							{else/}
								<textarea name="BODY" id="emailMessage" cols="" rows="" class="msgbody" >
									{for var i=0; i<itineraries.length; i++}
								{var itin = 'new'/}
								{for var s=0; s < itineraries[i].segments.length; s++}								
									{var xyz = this.formatEmail(itineraries, i,itineraries[i].segments[s],s,itin)/}
									{set itin = 'old'/}
									{/for}	
							{/for}	
							{if this.data.emailContent != null}								
								${this.data.emailContent.toString()}
							{/if}	
								</textarea>
							{/if}
						</p>
					</section>
				</article>
				{call hiddenInputs() /}
			</form>
      <footer class="buttons">
				<button onclick="javascript:void(0)" class="validation cancel"
					{on click {fn: this.onCancel, scope: this} /}>
					${this.labels.tx_merci_text_mail_btncancel}
				</button>
				<button onclick="javascript:void(0)" class="validation"
					{on click {fn: this.onSend, scope: this} /}>
					${this.labels.tx_merci_text_mail_btnsend}
				</button>
			</footer>
    </section>
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
	
  {macro hiddenInputs()}
    <input type="hidden" name="result" value="json"/>
    <input type="hidden" name="REGISTER_START_OVER" value="false"/>
    <input type="hidden" name="isScheduleReject" value="${this.request.isScheduleReject}"/>
    <input type="hidden" name="isScheduleChange" value="${this.request.isScheduleChange}"/>
    <input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED"/>
    <input type="hidden" name="REC_LOC" value="${this.tripplan.pnr.recLoc}"/>
    <input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" value="${this.tripplan.paxInfo.primary.lastName}"/>
    <input type="hidden" name="PAGE_TICKET" value="${this.reply.pageTicket}" />
    <input type="hidden" name="updateInfoSuccess" value="2130023"/>
    <input type="hidden" name="mailReadOnly" value="${this.config.emailReadOnly}" />
    <input type="hidden" name="page" value="Ser Email Friend" />
  {/macro}

{/Template}