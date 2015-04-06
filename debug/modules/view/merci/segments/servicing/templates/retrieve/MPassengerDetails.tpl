{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MPassengerDetails",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
    <section>
      <form {id "MAPForm" /} name="MAPForm">
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}
		{call includeError(labels)/}
		<div id="apisComplete" class="{if this.request.isApisMissing != 'TRUE'}displayNone{/if}">
			{call message.showError({list: [{TEXT:labels.tx_merci_text_complete_details}], title: labels.tx_merci_text_error})/}
		</div>
        <nav class="tabs baselineText">
          <ul>
            <li><a href="javascript:void(0)" class="navigation" {on tap {fn: this.showTripDetails, scope: this} /}>
              ${this.labels.tx_merci_text_trip}
            </a></li>
			{if this.utils.booleanValue(this.config.merciServiceCatalog) && !(this.utils.isEmptyObject(this.reply.serviceCategories))}
				<li><a href="javascript:void(0)" class="navigation" {on tap {fn: this.showServicesDetails, scope: this} /}>${this.labels.tx_merci_services_tab}</a></li>
			{/if}
            <li><a href="javascript:void(0)" class="navigation active">${this.labels.tx_merci_text_passenger_info}</a></li>
          </ul>
        </nav>

		{if this.utils.booleanValue(this.config.siteDisplApis)}
			{foreach pax inArray this.tripplan.listTravellerBean.travellers}
				{if pax.identityInformation.apisSectionBean && !this.utils.isEmptyObject(pax.identityInformation.apisSectionBean)}
					{call apisInfoSection(pax, pax_ct) /}
				{/if}	
			{/foreach}
		{/if}			
		{var retrieveOtherPaxFlag = "N" /}
		{var lnames = ""/}
		{if (!this.utils.isEmptyObject(this.tripplan.lastNames))}
			{set lnames = this.tripplan.lastNames.split("###") /}
		{/if}
		{if (lnames != "" && this.tripplan.listTravellerBean.travellers.length > 1 && this.tripplan.listTravellerBean.travellers.length != lnames.length)}
			{set retrieveOtherPaxFlag = "Y" /}
		{/if}	
        {foreach pax inArray this.tripplan.listTravellerBean.travellers}
			{var idy = pax.identityInformation /}
			{if (retrieveOtherPaxFlag == 'Y')}
				{var showNames = 'N'/}
				{if (!this.utils.isEmptyObject(this.tripplan.lastNames))}
					{var allLastNamesArr = this.tripplan.lastNames.split("###")/}
					{if (allLastNamesArr.length == 1)}
						{if (this.tripplan.lastNames.toUpperCase() != idy.lastName.toUpperCase())}
							{set showNames = 'Y'/}
						{/if}
					{else/}
						{var statusVal = 'TRUE'/}
						{foreach lnam in allLastNamesArr}
							{if (lnam.toUpperCase() == idy.lastName.toUpperCase() && statusVal == "TRUE")}
								{set statusVal = 'FALSE'/}
							{/if}
						{/foreach}
						{if (statusVal == 'FALSE')}
							{set showNames = 'N'/}
						{else/}
							{set showNames = 'Y'/}
						{/if}
					{/if}
				{/if}
			{/if}		
			{call paxSection(pax, pax_ct, retrieveOtherPaxFlag, showNames) /}
        {/foreach}

        {call contactSection() /}
		<div id="MAPFormHiddenInput">
        {call hiddenInputs() /}
		</div>
	</form>
		 
        <footer class="buttons footer">
		
			<button class="validation cancel" {on tap {fn: this.onCancel, scope: this} /} formaction="javascript:void(0)">
				${this.labels.tx_merci_text_travdetl_cancel}
			</button>
			<button class="validation" {on tap {fn: this.onSave, scope: this} /} formaction="javascript:void(0)">
				${this.labels.tx_merci_text_travdetl_save}
			</button>
         
        </footer>
     
    </section>
  {/macro}
  {macro apisInfoSection(pax, pax_ct)}
	<nav class="buttons">
		<ul>
			<li>
				{var travellerButtonName = pax.identityInformation.titleName+" "+pax.identityInformation.firstName+" "+pax.identityInformation.lastName /}
				{var paxName = pax.identityInformation.titleName+" "+pax.identityInformation.firstName+" "+pax.identityInformation.lastName/}
				<a href="javascript:void(0);" class="navigation" {on tap {fn: this.onAPISSave,args:{paxNum:pax_ct, paxName:travellerButtonName}, scope: this} /}> <span class="{if this.request.isApisMissing == 'TRUE'}apisError{/if}"> ${pax.identityInformation.titleName}&nbsp;${pax.identityInformation.firstName}&nbsp;${pax.identityInformation.lastName}</span> </a>				
			</li>
		</ul>
	</nav>
  {/macro}

  {macro paxSection(pax, pax_ct, retrieveOtherPaxFlag, showNames)}	
	<article class="panel pax {if (retrieveOtherPaxFlag == "Y" && showNames == "Y")}hidden{/if}">
      <header>
        <h1>
          ${this.formatName(pax.identityInformation)}
          <button id="paxToggle_${pax_ct}" aria-controls="pax${pax_ct} p${pax_ct}" aria-expanded="true"
              {on tap {fn:toggle , scope: this, args: {sectionId: 'pax' + pax_ct, buttonId:'paxToggle_' + pax_ct}}/}
              class="toggle" role="button" type="button">
            <span>Toggle</span>
          </button>
        </h1>
      </header>

      <section id="pax${pax_ct}" aria-hidden="false">
				<p {id "p"+pax_ct /} aria-hidden="false"><span class="mandatory">*</span> <small>indicate mandatory fields</small></p>
        <p class="type">
          <span class="label">${this.labels.tx_merci_text_type}:</span>
          <span class="data">${this.labels.paxTypes[pax.paxType.code]}</span>
        </p>
        <p class="title">
          <span class="label">${this.labels.tx_merci_text_travdetl_title}:</span>
          <span class="data">${pax.identityInformation.titleName}</span>
        </p>
        <p class="first-name">
          <span class="label">${this.labels.tx_merci_text_travdetl_first_name}:</span>
          <span class="data">${pax.identityInformation.firstName}</span>
        </p>
        <p class="last-name">
          <span class="label">${this.labels.tx_merci_text_travdetl_familyname}:</span>
          <span class="data">${pax.identityInformation.lastName}</span>
        </p>

		{var subData = this.getDataForFQTV() /}
			{@html:Template {
				  id:"alpiFqtv"+pax_ct,
				  classpath: "modules.view.merci.segments.booking.templates.alpi.fqtv.MAlpiFQTV",
				  data: {
					labels : this.labels,
					siteParameters : this.config,
					gblLists : this.config,
					rqstParams : subData,
					traveller:pax
				}
			} /}
      </section>
    </article>
  {/macro}

  {macro contactSection()}
    <article class="panel contact">
      {if this.utils.booleanValue(this.config.showNewContactDisplay)}
        {var subData = this.getDataForContactInfoExtended() /}
        {@html:Template {
          id:"contactInfoAlpiTemplate",
          classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtended",
          data: {
            labels : this.labels,
            siteParameters : this.config,
            gblLists : this.config,
            rqstParams : subData,
            htmlBean: subData.htmlBean, 
			isServicing: true
          }
        } /}
      {else/}
        {var subData = this.getDataForContactInfo() /}
        {@html:Template {
          id:"contactInfoAlpiTemplate",
          classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfo",
          data: {
            labels : this.labels,
            siteParameters : this.config,
            gblLists : this.config,
            rqstParams : subData
          }
        } /}
      {/if}
    </article>
  {/macro}

  {macro hiddenInputs()}
    {var primPax = this.tripplan.listTravellerBean.primaryTraveller /}
    {var paxIdy = primPax.identityInformation /}
    <input type="hidden" name="result" value="json" />
    <input type="hidden" name="SKIP_INSURANCE_CALL" value="FALSE" />
    <input type="hidden" name="ACTION" value="MODIFY"/>
    <input type="hidden" name="TRAVELLER_INFORMATION_MODIFICATION" value="true"/>
    <input type="hidden" name="FROM_PAX" value="true"/>
    <input type="hidden" name="REGISTER_START_OVER" value="false"/>
    <input type="hidden" name="noOfTravellersM" value="${this.tripplan.listTravellerBean.travellers.length}"/>
    <input type="hidden" name="REC_LOC" value="${this.request.REC_LOC}"/>
    <input type="hidden" name="SERVICE_PRICING_MODE" value="INIT_PRICE"/>
    <input type="hidden" name="TYPE" value="retrieve" />
    <input type="hidden" name="page" value="Ser Traveller Info" />
    <input type="hidden" name="DIRECT_RETRIEVE" value="true"  />
    <input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" value="${this.request.DIRECT_RETRIEVE_LASTNAME}"/>
    <input type="hidden" name="LNAME" value= "${paxIdy.lastName}"/>
    <input type="hidden" name="paxNumber" value="${primPax.paxNumber}"/>
    <input type="hidden" name="titleName" value="${paxIdy.titleName}"/>
    <input type="hidden" name="titleCode" value="${paxIdy.titleCode}"/>
    {if paxIdy.dateOfBirth}
      <input type="hidden" name="dobDay" value="${paxIdy.dateOfBirth.day}"/>
      <input type="hidden" name="dobMonth" value="${paxIdy.dateOfBirth.month}"/>
      <input type="hidden" name="dobYear" value="${paxIdy.dateOfBirth.year}"/>
    {/if}
    <input type="hidden" name="firstName" value="${paxIdy.firstName}"/>
    <input type="hidden" name="lastName" value="${paxIdy.lastName}"/>
    <input type="hidden" name="paxType" value="${primPax.paxType.code}"/>
    <input type="hidden" name="updateInfoSuccess_1" value="21300052"/>
    <input type="hidden" name="PAGE_TICKET" value="${this.reply.pageTicket}" />
    <input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED"/>
	<input type="hidden" name="ISAPISMISSING" value="${this.request.isApisMissing}"/>	
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