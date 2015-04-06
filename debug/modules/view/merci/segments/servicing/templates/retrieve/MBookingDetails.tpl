{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MBookingDetails",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
  {if pageObjBooking.printUI==true}
  	{var bp = modules.view.merci.common.utils.URLManager.getBaseParams()/}
	{var bookingDetails = pageObjBooking.model /}
	 <div id="apisText" class="apisText displayNone">${this.labels.tx_merci_text_complete_details_overlay}
	  <nav class="buttons">
		<ul>
		  <li><a href="javascript:void(0)" class="navigation {if (this.sadad != 'undefined') && (this.sadad==true)}disabled{/if}" id="alpiLightBox" {on tap {fn: this.showPaxDetails, scope: this} /}> ${this.tripplan.pnr.REC_LOC} </a></li>
		</ul>
	  </nav>
	</div>
	<article class="panel share-slider" aria-expanded="false"  style="display: none;">
			  <header>
				<h1>Share <strong>on Facebook</strong></h1>
			  </header>
			  <div class="share-content share-fb share-gp share-li share-tr" style="display: block;">
				<textarea style="width:100%;height:100px;" placeholder="Add a comment"></textarea>
				<section>
				  <h2>MyAirline.com</h2>
				  <figure id="airlineFig" > <img > </figure>
				  <div>
					<p>I will travel from <strong>Singapore</strong> to <strong>Honk Kong </strong> on <strong>Sunday 23 September 2012</strong> </p>
				  </div>
				</section>
				Share with:
				<input type="text" placeholder="+ add contact">
				<footer>
				  <button>Cancel</button>
				  <button class="secondary">Share</button>
				</footer>
			  </div>
			  <div class="share-content share-mail" style="display: none;">
			  <!-- <form {id "MailForm" /}> -->
			  	<div id='shareNot'>  </div>
				<div>
				  <label>${this.labels.tx_merci_text_mailA_from}:</label>
				  <input name="FROM"  id="travellerFromEmail" type="text" placeholder=${this.labels.tx_merci_text_sm_mail_from_placeholder} >
				</div>
				<div>
				  <label>${this.labels.tx_merci_text_mailA_to} :</label>
				  <input name="TO" id="travellerToEmail" type="text" placeholder=${this.labels.tx_merci_text_sm_mail_to_placeholder}>
				  <small>${this.labels.tx_merci_text_sm_mail_to_info}</small>
				</div>
				<textarea name="SUBJECT" id="subjectInput" cols="" rows="" class="subject" style="display:none;"
                readonly
                ></textarea>
				<textarea name="BODY" style="width:100%;height:100px;" id="emailta"></textarea>
				<footer>
				  <button {on tap {fn:'cancelEmailShare', args: {}}/}>${this.labels.tx_merci_text_mail_btncancel}</button>
				  <button class="secondary" {on tap {fn:'sendEmailShare', args: {}}/}>${this.labels.tx_merci_text_mail_btnsend}</button>
				</footer>
				<!-- </form> -->
			  </div>
			  <div class="share-content share-sms" style="display: none;">
				<div>
				  <label><strong>${this.labels.tx_merci_text_mailA_to} :</strong></label>
				  <div class="list phone">
					<ul class="input">
					  <li>
						<label for="travellerAreaCode">${this.labels.tx_merci_text_booking_alpi_area_code}</label>
						<input id="travellerAreaCode" type="text" >
					  </li>
					  <li>
						<label for="travellerPhoneNo">${this.labels.tx_merci_text_booking_alpi_phone_number}</label>
						<input id="travellerPhoneNo" type="text"  placeholder=${this.labels.tx_merci_text_booking_alpi_phone_number}>
					  </li>
					</ul>
				  </div>
				</div>
				<textarea style="width:100%;height:100px;" id="smsta"></textarea>
				<footer>
				  <button {on tap {fn:'cancelSMSShare', args: {}}/}>${this.labels.tx_merci_text_mail_btncancel}</button>
				  <button class="secondary" {on tap {fn:'sendSMSShare', args: {}}/}>${this.labels.tx_merci_text_mail_btnsend}</button>
				</footer>
			  </div>
			</article>
    <section class="tabletContainer">
      <form>



			{if !this.utils.isEmptyObject(this.infoMsgs)}
				{if (this.labels["uiErrors"]["2130023"]["localizedMessage"].toLowerCase() === this.infoMsgs[0].TEXT.toLowerCase())
						|| (this.labels["uiErrors"]["21300045"]["localizedMessage"].toLowerCase() === this.infoMsgs[0].TEXT.toLowerCase())
						|| (this.labels["uiErrors"]["2130034"]["localizedMessage"].toLowerCase() === this.infoMsgs[0].TEXT.toLowerCase()) }
	    			{call message.showMessage({list: this.infoMsgs, title: labels.tx_merci_warning_text})/}
				{else/}
					{call message.showInfo({list: this.infoMsgs, title: labels.tx_merci_warning_text})/}
				{/if}

			{/if}
				{var ccInfo = this.reply.ccInfo/}
				{if (typeof ccInfo == "object") && (Object.keys(ccInfo).length > 0)}
					{var isPCCRequested = ccInfo.IS_PCC_REQUESTED/}
					{if typeof isPCCRequested == 'undefined'}
						{set isPCCRequested = true/}
					{/if}

					{if (this.config.showPresentCCStatus == 'TRUE')}
						{if isPCCRequested !== false}
		      				<div class="msg info"><ul><li class = "ext-came">${labels.tx_merci_text_purc_cc_reminder}</li></ul></div>
		      			{/if}

					{elseif (this.config.showCCWarnMsg == 'TRUE') /}
						<div class="msg info"><ul><li>${labels.tx_merci_text_purc_cc_reminder}</li></ul></div>
					{/if}
				{/if}

					{if ((this.config.siteAllowPayLater == 'TRUE' || this.config.siteTimeToThinkEnbl == 'TRUE')&& this.reply.pnrStatusCode == 'P')}
						{var plLabel = labels.tx_merci_text_paylater_pay_info/}
								{var payLaterConfInformation = new this.buffer(plLabel)/}
								{var dtTime = this._getDateTime(this.reply.payLaterBean.onHoldLimitDate)/}
								{var dateStr = aria.utils.Date.format(dtTime, "EEEE d MMMM yyyy")/}
								{var dateTime = aria.utils.Date.format(dtTime, "HH:mm")/}
								{var payLaterInfoArray = new Array()/}
								// passing param and printing string
								${payLaterInfoArray.push(dateStr)|eat}
								${payLaterInfoArray.push(dateTime)|eat}
								${payLaterInfoArray.push(this.reply.payLaterBean.pendingTimeLimit)|eat}
						<div class="msg info" id="" stlye="">
							<ul>
								<li>${payLaterConfInformation.formatString(payLaterInfoArray)}</li>
							</ul>
						</div>
					{/if}


				{call includeError(labels) /}
				<div id='sharedMsg'>  </div>

			<div class="tabletleftPanel">
        {call tabsList() /}
	{if (bookingDetails.reply.pnrStatusCode == 'P')}
		{call summarySectionPL() /}
	{else /}
        {call summarySection() /}
	{/if}

        ${this.shareFlightDetailsData()|eat}
        {@html:Template {
          classpath: "modules.view.merci.segments.servicing.templates.retrieve.MFlightDetails",
          block: true
        }/}

        {if this.utils.booleanValue(this.config.displayCar)}
          {@html:Template {
            classpath: "modules.view.merci.segments.servicing.templates.retrieve.MCarDetails",
            block: true
          }/}
        {/if}

        {if this.utils.booleanValue(this.config.displayHotel)}
          {@html:Template {
            classpath: "modules.view.merci.segments.servicing.templates.retrieve.MHotelDetails",
            block: true
          }/}
        {/if}

	   {if this.utils.booleanValue(this.config.insuranceInServiceFlow)}
        {@html:Template {
          classpath: "modules.view.merci.segments.servicing.templates.retrieve.MInsurance",
		  data:{'lastName': pageObjBooking.model.request.DIRECT_RETRIEVE_LASTNAME},
          block: true
        }/}
         {/if}

          {if this.__isInstallmentsEnabled()}
	        {@html:Template {
	          classpath: "modules.view.merci.segments.booking.templates.conf.MInstallmentDetail",
			  data: {
									'labels': this.labels,
									'rqstParams': this.reply,
									'siteParams': this.config
					},
	          block: true
	        }/}
         {/if}

        {var buttonNames = this.getButtons()/}

       	{if !(this.reply.pnrStatusCode == 'P')}
        {@html:Template {
          classpath: "modules.view.merci.common.templates.MNavButtons",
          args: ['buttons', buttonNames],
					data: {
						labels: this.labels,
						config: this.config,
						itineraries: this.tripplan.pnr.itineraries,
						rebooking: {
							rebookingAllowed: this.reply.bookingPanel.isRebooking,
							hasInfant: this.reply.bookingPanel.hasInfant,
							lastName: this.request.DIRECT_RETRIEVE_LASTNAME,
							isAwardPNR:this.reply.bookingPanel.isAwardPNR,
							TRIP_TYPE : this.request.tripType
						},
						emailTrip: this.emailTrip,
						common: {
							pageTicket: this.reply.pageTicket,
							recordLocator: this.request.REC_LOC,
							sadadPaymentInd: this.sadad,
							lastName: this.request.DIRECT_RETRIEVE_LASTNAME
						},
						dateParams: this.request.currentDate.params
					},
          block: true
        }/}
        {/if}
			</div>

				<input id="ret_pnr_data" type="hidden" value="${this.fetchAppsTripData()}">
				<input id="add_to_calendar_data" type="hidden" value="${this.fetchAppsCalendarData()}"/>

		{var miles = 0/}
		{var kf_miles = this.getMiles()/}
		{if !this.utils.isEmptyObject(kf_miles) && !this.utils.isEmptyObject(this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE) && this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE.length > 0}
            {set miles = parseInt(kf_miles) - parseInt(this.model.reply.tripplan.tripPlanAir.LIST_TRIP_PRICE[0].MILES_COST)/}
        {/if}

		//{var test = false/}
		{var enable_paynow = this.request.pay_now/}
		{var tripPlanItinerary = this.reply.tripplan.tripPlanAir.LIST_ITINERARY || [] /}

		{var hasWaitlistFlight = false/}
		{foreach itinerary in this.tripplan.pnr.itineraries}
			{foreach segment in itinerary.segments}
				{if segment.isWaitList }
					{set hasWaitlistFlight = true/}
				{/if}
			{/foreach}
		{/foreach}

		{var pendingOnWaitlist = false/}
		{if hasWaitlistFlight && bookingDetails.reply.pnrStatusCode == 'Q'}
			{set pendingOnWaitlist = true/}
		{/if}

		{if (bookingDetails.reply.waitListNotPaid)}
			{if this.utils.booleanValue(this.reply.bookingPanel.isAwardPNR) &&
				this.utils.booleanValue(this.config.siteEnableWaitlistPNR &&
				this.utils.booleanValue(this.reply.bookingPanel.isOfflinePNR) == false) ||
				((this.utils.booleanValue(this.reply.bookingPanel.isOfflinePNR) == true) &&
				this.utils.booleanValue(this.config.siteOfflineWaitlistPNR)) && bookingDetails.reply.payNow && !pendingOnWaitlist}
				{if miles > 0}
					<footer class="buttons">
						<button class="validation payLtrCancel" type="button" {on tap {fn:'toggleCancelPopup'}/}>${labels.tx_merci_cancel}</button>
						<button class="validation" type="button" {on tap {fn:'payLaterPymntAction'}/}>Pay</button>
					</footer>
				{/if}
			{/if}
		{/if}

		{if ((bookingDetails.reply.pnrStatusCode == 'P') && (!this.utils.booleanValue(this.sadad)) && !hasWaitlistFlight &&  (bookingDetails.reply.payNow || (this.config.siteTimeToThinkEnbl == 'TRUE' && !this.utils.isEmptyObject(this.tripplan.travellers[0].additionalInfo) && !this.utils.isEmptyObject(this.tripplan.travellers[0].additionalInfo.additionalInfoMap.TIME)) ))}
				<footer class="buttons">
					{if (this.config.siteTimeToThinkEnbl != 'TRUE')}
						<button class="validation payLtrCancel" type="button" {on tap {fn:'toggleCancelPopup'}/}>${labels.tx_merci_cancel}</button>
					{/if}
					<button class="validation" type="button" {on tap {fn:'payLaterPymntAction'}/}>Pay</button>
				</footer>
		{/if}

      </form>
	  <div class="dialog native" id="onHoldCancel" style="display:none">
		<div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
			<p>${labels.tx_pltg_text_DeleteAllFlightsAndCancelReservation}</p>
			<div class="padFour">
				<footer class="buttons">
					<button class="validation active" {on tap {fn: 'cancelPymntAction'}/}>${labels.tx_merci_proceed}</button>
					<button class="cancel" type="reset" {on tap {fn: 'toggleCancelPopup'}/}>${labels.tx_merci_cancel}</button>
				</footer>
			</div>
	  </div>
    </section>
    {/if}
    {var tripAddedLabel=this.getAddTripLabel() /}
    {var okLabel=this.getOkLabel() /}
    <div class="mask" {id 'addTripToCalendarAlertOverlay' /}>
		<div class="dialogue">
			<h3 class="dialogueContent">${tripAddedLabel}</h3>
			<button type="button" {on tap {fn:"toggleCalendarAlert", args:{id:'added'}} /}>${okLabel}</button>
		</div>
	</div>

  {/macro}

  {macro tabsList()}
    <nav class="tabs" id="mobileTabs">
      <ul>
        <li><a href="javascript:void(0)" class="navigation active">${this.labels.tx_merci_text_trip}</a></li>
    		{if this.isServicesCatalogEnbld()}
    			<li><a href="javascript:void(0)" class="navigation" {on tap {fn: this.showServicesDetails, scope: this} /}>${this.labels.tx_merci_services_tab}</a></li>
    		{/if}
        <li><a href="javascript:void(0)" class="navigation" {on tap {fn: this.showPaxDetails, scope: this} /}>
          ${this.labels.tx_merci_text_passenger_info}
        </a></li>
      </ul>
    </nav>
  {/macro}

  {macro tabletTabsList()}
    <nav class="tabs baselineText" id="tabletTabs">
      <ul>
		{if this.utils.booleanValue(this.config.merciServiceCatalog) && !this.utils.isEmptyObject(this.reply.serviceCategories)}
			<li><a id="servicesTab" href="javascript:void(0)" class="navigation active" {on tap {fn: this.showServiceDetailsTab, scope: this} /}>${this.labels.tx_merci_services_tab}</a></li>
		<li><a id="paxTabletTab" href="javascript:void(0)" class="navigation" {on tap {fn: this.showTabPaxDetails, scope: this} /}>
			${this.labels.tx_merci_text_passenger_info}
		</a></li>
		{/if}
      </ul>
    </nav>
  {/macro}

  {macro summarySectionPL()}
	<article class="panel onholdpnr">
		<header>
			<h1>${this.labels.tx_merci_text_booking_conf_bookingonhold}</h1>
		</header>
	<section>
		<span class="label">${this.labels.tx_merci_text_booking_refnumber}</span>
		<span class="data"><strong>${this.tripplan.pnr.REC_LOC}</strong></span>
	</section>
	</article>
  {/macro}
  {macro summarySection()}
	{var bookingDetails = pageObjBooking.model /}
    <header class="booking">
      <p>
		{var bParmas = modules.view.merci.common.utils.URLManager.getBaseParams()/}
		{var isAppRequest = this.utils.isRequestFromApps()/}
		{if ((bParmas[14] != null && bParmas[14] != '' && this.request.ENABLE_DEVICECAL != null && this.request.ENABLE_DEVICECAL.toLowerCase() == "true"))}
			<li class='row-options'><div id="appCalTog" class='slide-options'><button type="button" class='toggle' {on tap {fn:toggleCalBtn,args:{buttonId:"calButton"}}/}><span style='displayNone'>Toggle</span></button>
			<div class='datepicker'><span id="appCallId" style="display:none;" {on tap {fn:confAppcallback, args:{pnrLoc:this.tripplan.pnr.REC_LOC}}/}><a id="confCal" href='javascript:void(0)' class='datepicker'>${this.labels.tx_merci_awards_addtoCal}</a></span></div></div>
			</li>
		{/if}
		{var retrieveOtherPaxFlag = "N" /}
		{if (this.utils.booleanValue(this.config.pnrNameFilter))}
			{if (!this.utils.isEmptyObject(this.tripplan.pnr.displayOtherPax) && this.tripplan.pnr.displayOtherPax == 'Y')}
				{var lnames = ""/}
				{if (!this.utils.isEmptyObject(this.tripplan.pnr.lastNames))}
					{set lnames = this.tripplan.pnr.lastNames.split("###") /}
				{/if}
				{if (lnames != "" && this.tripplan.travellers.length > 1 && this.tripplan.travellers.length != lnames.length)}
					{set retrieveOtherPaxFlag = "Y" /}
					<article class="panel">
						<header>
							<h1>${this.labels.tx_merci_text_retrieve_other_passengers}</h1>
						</header>
						<section>
							<p atdelegate="d7" id="w8_nameField" class="name">
								<label for="DIRECT_RETRIEVE_LASTNAME">
									${this.labels.tx_merci_text_home_lastname} (${this.labels.tx_merci_text_familyname})
								</label>
								<input type="text" placeholder="Last name" id="DIRECT_RETRIEVE_LASTNAME" name="DIRECT_RETRIEVE_LASTNAME" value="">
							</p>
						</section>
						<footer class="buttons">
							<span>${this.labels.tx_merci_text_there_are_other_passengers}</span>
							<button type="button" class="validation" {on tap {fn: this.getTrip} /}>${this.labels.tx_merci_text_retrieve}</button>
						</footer>
					</article>
				{/if}
			{/if}
		{/if}

		{var recLoc = ""/}
		{var numRecLoc = ""/}
		{var airlineConfNumbers = ""/}
		{var airlineName = ""/}

		{if !this.utils.isEmptyObject(this.reply.airlineRec)}
			{foreach currentAirlineRec in this.reply.airlineRec}
				{if (currentAirlineRec.AIRLINE_REC_LOC != 'NOSYNC' && currentAirlineRec.AIRLINE_REC_LOC != 'WEBFARE')}
					{if (this.config.siteOtherAirlinesName == 'TRUE')}
						{set airlineName = currentAirlineRec.AIRLINE.NAME/}
					{/if}
					{set airlineConfNumbers = airlineConfNumbers + airlineName + currentAirlineRec.AIRLINE_REC_LOC/}
				{/if}
			{/foreach}
		{/if}

		{if this.utils.isEmptyObject(recLoc)}
			{set recLoc = this.reply.tripplan.pnr.REC_LOC /}
		{/if}

		{if bookingDetails.reply.pnrStatusCode == 'P'}
			<article class="panel">
			<header>
			<h1>BOOKING CONFIRMED</h1><header>
			<section>
			<span class="label">${this.labels.tx_merci_text_booking_refnumber}</span>
			<span class="data">${this.tripplan.pnr.REC_LOC}</span>
			</section>
			</article>
		{else/}
			{if (this.config.siteGdsRec == 'SHOW')}
			<span class="label">${this.labels.tx_merci_text_booking_refnumber}</span>
			<span class="data">${recLoc}</span>
			{/if}
			{if (this.config.siteOtherAirlinesRec == 'HIGHLIGHT' || this.config.siteOtherAirlinesRec == 'SHOW')}
			<p class="numeric-number"><span class="label"> ${this.labels.tx_merci_text_booking_conf_airlinenumber}:</span> <span class="data"><strong>${airlineConfNumbers}</strong></span></p>
			{/if}

		{/if}
      </p>
      {foreach pax inArray this.tripplan.travellers}
        {var idy = pax.identityInformation /}
		{if (retrieveOtherPaxFlag == 'Y')}
			{var showNames = 'N'/}
			{if (!this.utils.isEmptyObject(this.tripplan.pnr.lastNames))}
				{var allLastNamesArr = this.tripplan.pnr.lastNames.split("###")/}
				{if (allLastNamesArr.length == 1)}
					{if (this.tripplan.pnr.lastNames.toUpperCase() != idy.lastName.toUpperCase())}
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


        <p class="pax {if (showNames == 'Y')}displayNone{/if}">${this.formatName(pax.paxType.code, idy)}</p>

        {if pax.infant}
          {var infIdy = pax.infant /}
          <p class="pax {if (showNames == 'Y')}displayNone{/if}">${this.formatName(infIdy.paxType, infIdy)}</p>
        {/if}
      {/foreach}
    </header>
  {/macro}


	{macro includeError(labels)}
		{section {
			id: 'errors',
			macro : {
				name : "includeErrorMacro",
				args : labels,
				scope : this
			},
			bindRefreshTo : [{
        inside : this.data,
				to : "errorOccured",
				recursive : true
			}],
		}/}
	{/macro}
	{macro includeErrorMacro(labels)}
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


	{macro paxTabletTab()}
	<div id="paxListContainer">
		{var retrieveOtherPaxFlag = "N" /}
		{if (this.utils.booleanValue(this.config.pnrNameFilter))}
			{if (!this.utils.isEmptyObject(this.tripplan.pnr.displayOtherPax) && this.tripplan.pnr.displayOtherPax == 'Y')}
				{var lnames = ""/}
				{if (!this.utils.isEmptyObject(this.tripplan.pnr.lastNames))}
					{set lnames = this.tripplan.pnr.lastNames.split("###") /}
				{/if}
				{if (lnames != "" && this.tripplan.travellers.length > 1 && this.tripplan.travellers.length != lnames.length)}
					{set retrieveOtherPaxFlag = "Y" /}
				{/if}
			{/if}
		{/if}

		<article class="panel" id="tabletPaxTab"{if this.utils.booleanValue(this.config.merciServiceCatalog) && !this.utils.isEmptyObject(this.reply.serviceCategories)} style="display:none;"{/if}>

		<section>
			<ul class="services-pax zebra" id="tabletServicesTab" style="display:block;">
			{foreach pax inArray this.tripplan.travellers}
				{var idy = pax.identityInformation /}
				{if (retrieveOtherPaxFlag == "Y")}
					{var showNames = 'N'/}
					{if (!this.utils.isEmptyObject(this.tripplan.pnr.lastNames))}
						{var allLastNamesArr = this.tripplan.pnr.lastNames.split("###")/}
						{if (allLastNamesArr.length == 1)}
							{if (this.tripplan.pnr.lastNames.toUpperCase() != idy.lastName.toUpperCase())}
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

				<li {if (showNames == 'Y')}class="displayNone"{/if}>
					<h4>${this.formatName(pax.paxType.code, idy)}</h4>
					/*<dl>
						<dt>FF Number</dt>
						<dd>xyz</dd>
					</dl>*/
					<button class="secondary edit" type="button" {on tap {fn:showPaxEdit, args:{paxDetails:pax}}/}><span>Edit</span></button>
					/* <a class="secondary edit" href='javascript:void(0)' {on tap {fn:showPaxEdit, args:{paxDetails:pax}}/}><span>Edit</span></a> */
				</li>
				{if pax.infant}
					{var infIdy = pax.infant /}
					<li class="pax infant">
						<h4>${this.formatName(infIdy.paxType, infIdy)}</h4>
					</li>
				{/if}
			{/foreach}
		</ul>
	</section>

    </article>
	</div>
	<div id="paxEditContainer" style="display:none;">
	{section {
		id: 'paxEdit',
		macro: {
			name : "paxEditloadContent",
			scope: this
		},
		bindRefreshTo : [{
			to : "Loaded",
			inside : this.passengerDetails
		}]
	}/}
	<div>

	{/macro}

	{macro paxEditloadContent()}

		{@html:Template {
          classpath: "modules.view.merci.segments.servicing.templates.retrieve.MPassengerDetails",
          block: true,
		  data: {
			selectedPaxId:this.selectedPaxId
		  }
        }/}

	{/macro}
{/Template}