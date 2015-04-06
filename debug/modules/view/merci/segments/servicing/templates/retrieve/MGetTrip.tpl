{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MGetTrip",
  $hasScript: true,
  $macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib',tablet: 'modules.view.merci.common.utils.MerciTabletLib'}
}}

  {macro main()}
	<section>
		<form id="MGetTripForm" {on submit {fn: this.getTrip, scope: this} /}>
   			{section {
		        type: 'div',
		        id: 'messages',
		        macro: {name: 'showMessages', scope: this},
		        bindRefreshTo: [{inside: this.data, to: 'messages'}]
			}/}
	{if (this.config.siteAllowPayLater == 'TRUE' && this.request.cancelOnHold == 'TRUE')}
		<div class="msg validation" id="onHoldCancelStatus" stlye="display:none">
			<ul>
				<li>${this.labels.tx_pltg_text_YourReservationHasBeenCancelled}</li>
			</ul>
		</div>
	{/if}
    <article class="panel" id="getTrip">
            <header>
				<h1>${this.labels.tx_merciapps_label_title_retreive_trip}</h1>
            </header>
	  	<article>
 		<section>
            {call nameFieldSection() /}
            {call refTypeSection() /}
            {call refFieldSection() /}
            /* CR 7107950 */
            {if this.utils.booleanValue(this.request.IS_USER_LOGGED_IN) == true }
              <input type= "hidden" value = "${this.utils.booleanValue(this.request.IS_USER_LOGGED_IN)}" name="IS_USER_LOGGED_IN" />
            {/if}
          </section>
          <footer class="remember">
            {call rememberNameSection() /}
          </footer>
        </article>
        {call hiddenInputs() /}
    </article>
        <footer class="buttons">
          <button formaction="" class="validation">
            ${this.labels.tx_merci_text_get_trip}
          </button>
        </footer>
      </form>
	</section>
  {/macro}

  {macro showMessages()}
	{call message.showAllMessages(this.data.messages)/}
  {/macro}

  {macro nameFieldSection()}
    {section {
      type: 'p',
      id: 'nameField',
      attributes: {
        classList: ['name']
      },
      macro: {name: 'displayNameFieldSection', scope: this},
      bindRefreshTo: [
        {inside: this.data.inputErrors, to: 'DIRECT_RETRIEVE_LASTNAME'}
      ]
    }/}
  {/macro}

  {macro displayNameFieldSection()}
      <label for="DIRECT_RETRIEVE_LASTNAME">
          ${this.labels.tx_merci_text_home_lastname}
          (${this.labels.tx_merci_text_familyname})
          {call inlineError("DIRECT_RETRIEVE_LASTNAME") /}
        </label>
        <input value="{if !this.utils.isEmptyObject(this.data.defaultLastName)}${this.data.defaultLastName}{/if}" name="DIRECT_RETRIEVE_LASTNAME" id="DIRECT_RETRIEVE_LASTNAME"
               type="text" placeholder="${this.labels.tx_merci_text_home_lastname}" />

  {/macro}

  {macro refTypeSection()}
    <p class="with">
      <label for="REC_LOC_TYPE">With</label>
      <select name="REC_LOC_TYPE" id="REC_LOC_TYPE" {on change {fn: this.changeRefType, scope: this} /}>
        <option value="BOOKINGREF">${this.labels.tx_merci_text_home_booking_ref}</option>
        <option value="TICKET">${this.labels.tx_merci_text_ticket_number}</option>
      </select>
    </p>
  {/macro}

  {macro refFieldSection()}
    {section {
      type: 'p',
      id: 'refField',
      attributes: {
        classList: ['reference']
      },
      macro: {name:'displayRefField', scope: this},
      bindRefreshTo: [
        {inside: this.data, to: 'reclocInputSize'},
        {inside: this.data.inputErrors, to: 'recLocator'}
      ]
    }/}
  {/macro}

  {macro displayRefField()}
      <label for="recLocator">
        Reference
        {call inlineError("recLocator") /}
      </label>
      <input name="${this.data.inputName}" id="recLocator" type="text" maxlength="${this.data.reclocInputSize}"/>
  {/macro}

  {macro rememberNameSection()}
    {section {
      type: 'p',
      id: 'rememberField',
      macro: {name:'displayRememberName', scope: this},
      bindRefreshTo: [{inside: this.data, to: 'showOnlyRefInput'}]
    }/}
  {/macro}

  {macro displayRememberName()}
     {if !this.data.showOnlyRefInput}
        <input name="chkRemeberLastName" id="chkBox" type="checkbox" />
        <label for="chkBox">${this.labels.tx_merci_text_remember_my_last_name}</label>
      {/if}
  {/macro}

  {macro inlineError(fieldId)}
    {if this.data.inputErrors[fieldId]}
      <span class="errorInline"></span>
    {/if}
  {/macro}

  {macro hiddenInputs()}
    <input type="hidden" name="result" value="json" />
    <input type="hidden" name="SITE" value="${this.request.site}" />
    <input type="hidden" name="LANGUAGE" value="${this.request.language}" />
    {if this.request.sessionId}
      <input type="hidden" name="SESSION_ID" value="${this.request.sessionId}" />
    {/if}
    {if this.reply.pageTicket}
      <input type="hidden" name="PAGE_TICKET" value="${this.reply.pageTicket}" />
    {/if}
    <input type="hidden" name="DIRECT_RETRIEVE" value="true" />
    <input type="hidden" name="ACTION" value="MODIFY" />
    <input type="hidden" name="TYPE" value="retrieve" />
    <input type="hidden" name="NEW_RETRIEVE" value="Y" />
    /* List of parameters necessary for e-ticket retrieval. As part of PTR: 05578331 */
    <input type="hidden" id="TICKET_CODE" name="TICKET_CODE" value=""/>
    <input type="hidden" id="AIRLINE_CODE" name="AIRLINE_CODE" value=""/>
    <input type="hidden" id="AIRLINE_CODE_0" name="AIRLINE_CODE_0" value=""/>
    <input type="hidden" id="ACCOUNT_NUMBER_0" name="ACCOUNT_NUMBER_0" value=""/>
    <input type="hidden" id="BOOL_CONFIRMATION" name="BOOL_CONFIRMATION" value="true"/>
    <input type="hidden" id="rtOpt" name="rtOpt" value="ET"/>
  {/macro}

{/Template}