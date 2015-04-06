{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MConf',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
	$dependencies: [
		'modules.view.merci.common.utils.StringBufferImpl'
	],
	$hasScript: true
}}
	{macro main()}

		{section {
			type: 'div',
			id: 'confContent',
			macro: 'printConfContent'
		}/}
	{/macro}

	{macro printConfContent()}
		{if (this.moduleCtrl.getModuleData().booking.MCONF_A != null)}
			{var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MCONF_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam/}
			{var errors = this.moduleCtrl.getModuleData().booking.MCONF_A.errors/}

			{var headerData = this.moduleCtrl.getHeaderInfo()/}
    			{var isBack = headerData.homePageURL == null || headerData.homePageURL == ''/}
			{var paramClientReq = ''/}
			{var paramEnableDeviceCalReq = ''/}
			{if !this._merciFunc.isEmptyObject(rqstParams.param.paramClient)}
				{set paramClientReq = rqstParams.param.paramClient/}
			{/if}

			{if !this._merciFunc.isEmptyObject(rqstParams.param.paramEnableDeviceCal)}
				{set paramEnableDeviceCalReq = rqstParams.param.paramEnableDeviceCal/}
			{/if}

			<article class="panel share-slider" aria-expanded="false"  style="display: none;">
			  <header>
				<h1> <strong></strong></h1>
			  </header>
			  <div class="share-content share-mail" style="display: none;">
			  <!-- <form {id "MailForm" /}> -->
			  	<div id='shareNot'>  </div>
				<div>
				  <label>${labels.tx_merci_text_mailA_from}:</label>
				  <input name="FROM"  id="travellerFromEmail" type="text" placeholder=${labels.tx_merci_text_sm_mail_from_placeholder} >
				</div>
				<div>
				  <label>${labels.tx_merci_text_mailA_to} :</label>
				  <input name="TO" id="travellerToEmail" type="text" placeholder=${labels.tx_merci_text_sm_mail_to_placeholder}>
				  <small>${labels.tx_merci_text_sm_mail_to_info}</small>
				</div>
				<textarea name="SUBJECT" id="subjectInput" cols="" rows="" class="subject" style="display:none;"
                readonly
                ></textarea>
				<textarea name="BODY" style="width:100%;height:100px;" id="emailta"></textarea>
				<footer>
				  <button {on click {fn:'cancelEmailShare', args: {}}/}>${labels.tx_merci_text_mail_btncancel}</button>
				  <button class="secondary" {on click {fn:'sendEmailShare', args: {}}/}>${labels.tx_merci_text_mail_btnsend}</button>
				</footer>
				<!-- </form> -->
			  </div>
			  <div class="share-content share-sms" style="display: none;">
				<div>
				  <label><strong>${labels.tx_merci_text_mailA_to} :</strong></label>
				  <div class="list phone">
					<ul class="input">
					  <li>
						<label for="travellerAreaCode">${labels.tx_merci_text_booking_alpi_area_code}</label>
						<input id="travellerAreaCode" type="text" >
					  </li>
					  <li>
						<label for="travellerPhoneNo">${labels.tx_merci_text_booking_alpi_phone_number}</label>
						<input id="travellerPhoneNo" type="text"  placeholder=${labels.tx_merci_text_booking_alpi_phone_number}>
					  </li>
					</ul>
				  </div>
				</div>
				<textarea style="width:100%;height:100px;" id="smsta"></textarea>
				<footer>
				  <button {on click {fn:'cancelSMSShare', args: {}}/}>${labels.tx_merci_text_mail_btncancel}</button>
				  <button class="secondary" {on click {fn:'sendSMSShare', args: {}}/}>${labels.tx_merci_text_mail_btnsend}</button>
				</footer>
			  </div>
			</article>


			<section>
				<form>

					<!--getting the last name of the last passenger in the list traveller bean  -->
					{var lName = ""/}
					{foreach travelMap in rqstParams.listTravellerBean.travellersAsMap}
						{set lName = travelMap.identityInformation.lastName/}
					{/foreach}
					{if !this._merciFunc.isEmptyObject(rqstParams.param.paramClient)}
					<!--parameter added for tracking for retrieval-->
					<input type="hidden" id="BookedPNRData" value="${rqstParams.tripPlanBean.REC_LOC}|${lName}"/>
					<input type="hidden" id="ret_pnr_data" value="${this.fetchAppsTripData()}">
					<input type="hidden" id="bookmark_data" value="${this.fetchBookmarkData()}">
					<input type="hidden" id="add_to_calendar_data" value="${this.fetchAppsCalendarData()}"/>
					{/if}
					// include error tpl
					{call includeError(labels)/}
					<div id='sharedMsg'>  </div>

					{var MILES_CONF = rqstParams.fareBreakdown.tripPrices[0].milesCost/}
					{if !this._merciFunc.isEmptyObject(rqstParams.param.REBOOK_MILES_DIFFERENCE)}
						{set MILES_CONF = rqstParams.param.REBOOK_MILES_DIFFERENCE/}
					{/if}
					{if (this._isTicketed() == false)}
						{set MILES_CONF = 0/}
					{/if}
					
					{if (siteParameters.allowAwards == 'TRUE' && !this._merciFunc.isEmptyObject(rqstParams.awardsFlow) == true)}
					<input type="hidden" id="kf_user_miles" value="${MILES_CONF}" />
						<div class="msg info">
							{if MILES_CONF <0}
								<ul>${-1*MILES_CONF}&nbsp;miles have been refunded to your Frequent Flyer account&nbsp;${labels.tx_merci_awards_deducted_booking}</ul>
							{else/}
							<ul>${MILES_CONF}&nbsp;${labels.tx_merci_awards_deducted}&nbsp;${labels.tx_merci_awards_deducted_booking}</ul>
							{/if}
						</div>
					{else/}
					<input type="hidden" id="kf_user_miles" value="" />
					{/if}


					{var ccInfo = rqstParams.reply.ccInfo/}
					{if (typeof ccInfo == "object") && (Object.keys(ccInfo).length > 0)}
						{var isPCCRequested = ccInfo.IS_PCC_REQUESTED/}
						{if typeof isPCCRequested == 'undefined'}
							{set isPCCRequested = true/}
						{/if}

						{if (siteParameters.showPresentCCStatus == 'TRUE')}
							{if isPCCRequested !== false}
								<div class="msg info">
			      					<ul><li>${labels.tx_merci_text_purc_cc_reminder}</li></ul>
			      				</div>
			      			{/if}

						{elseif (siteParameters.showCCWarnMsg == 'TRUE') /}
							<div class="msg info">
								<ul>
									<li>${labels.tx_merci_text_purc_cc_reminder}</li>
								</ul>
							</div>
					        {if (rqstParams.fareBreakdown.rebookingStatus == 'true') }
				            	<ul><li>${labels.tx_merci_atc_ancillary_msg}</li></ul>
				            {/if}
						{elseif (this.isMopSadad()==true) /}
							{var opcDate=getOpcDateSadad() /}
							<div class="msg info">
								<ul>
									<li id="sadadWarningMessage">${this.getFormattedDateString(opcDate)}</li>
									<li>${labels.tx_merci_text_sadad_aaas_message}</li>
								</ul>
							</div>
	          			{/if}
	          		{/if}
					{var payLaterElig = this.__getPayLaterEligibility()/}
					{if (rqstParams.reply.pnrStatusCode == 'P' && rqstParams.payLaterBean !=undefined && (rqstParams.payLaterBean.onHoldEligible || (payLaterElig.timeToThinkEnbl == 'TRUE' && !this._merciFunc.isEmptyObject(rqstParams.TIME_TO_THINK_PANEL_KEY))))}
						{var plLabel = labels.tx_merci_text_paylater_pay_info/}
						<div class="msg info">
							<ul>
								<li>
									{var payLaterConfInformation = new this._strBuffer(plLabel)/}
									{if (payLaterElig.ispayLaterEnbl == 'TRUE')}
										{var dtTime = this._getDateTime(rqstParams.payLaterBean.onHoldLimitDate)/}
									{/if}
									{if (payLaterElig.timeToThinkEnbl == 'TRUE')}
										{var dtTime = this._getDateTime(rqstParams.TIME_TO_THINK_PANEL_KEY.endDate)/}
									{/if}									
									{var dateStr = aria.utils.Date.format(dtTime, "EEEE d MMMM yyyy")/}
									{var dateTime = aria.utils.Date.format(dtTime, "HH:mm")/}
									{var payLaterInfoArray = new Array()/}
									// passing param and printing string
									${payLaterInfoArray.push(dateStr)|eat}
									${payLaterInfoArray.push(dateTime)|eat}
									{if (payLaterElig.ispayLaterEnbl == 'TRUE')}
										${payLaterInfoArray.push(rqstParams.payLaterBean.pendingTimeLimit)|eat}
									{/if}
									{if (payLaterElig.timeToThinkEnbl == 'TRUE')}
										${payLaterInfoArray.push(rqstParams.payLaterBean.timeToThinkLimit)|eat}							
									{/if}									
									${payLaterConfInformation.formatString(payLaterInfoArray)}
								</li>
							</ul>
						</div>
	          		{/if}

					{var numRecLoc = ""/}
					{var airlineName = ""/}
					{var airlineConfNumbers = ""/}
					{var recLoc = rqstParams.tripPlanBean.REC_LOC/}				

					{if rqstParams.reply.airlineRec != null}
						{foreach currentAirlineRec in rqstParams.reply.airlineRec}
							{if (currentAirlineRec.AIRLINE_REC_LOC != 'NOSYNC' && currentAirlineRec.AIRLINE_REC_LOC != 'WEBFARE' && ( siteParameters.siteAirlineRecordRest.indexOf(currentAirlineRec.AIRLINE.CODE) != -1))}
								{if (siteParameters.siteOtherAirlinesName == 'TRUE')}
									{set airlineName = currentAirlineRec.AIRLINE.NAME/}
								{/if}
								{set airlineConfNumbers = airlineConfNumbers + airlineName + currentAirlineRec.AIRLINE_REC_LOC/}
							{/if}
						{/foreach}
					{/if}

					{if !this._merciFunc.isEmptyObject(rqstParams.reply.numRecLoc)}
						{set numRecLoc = rqstParams.reply.numRecLoc /}
					{/if}
					<article class="panel pnr-box">
						<header>
							{if (rqstParams.reply.pnrStatusCode == 'P')}
								<h1>${labels.tx_merci_text_booking_conf_bookingonhold}</h1>
							{else /}
								<h1>${labels.tx_merci_text_booking_conf_bookingconfirmed}</h1>
							{/if}
						</header>
						<section id="section3" data-aria-hidden="false">
						{if (paramClientReq != "" && paramEnableDeviceCalReq != "" && paramEnableDeviceCalReq.toLowerCase()=="true")}
								{var checkCal="" /}
								{if (this.isRebookingFlow()==true)} {set checkCal=labels.tx_merciapps_view_trip_in_calendar /} {else/} {set checkCal=labels.tx_merci_awards_addTrip /} {/if}
								<li class='row-options'><div id="appCalTog" class='slide-options'><button type='button' class='toggle' {on click {fn:toggleCalBtn,args:{buttonId:"calButton"}}/}><span style='displayNone'>Toggle</span></button>
								<div class='datepicker'><span id="appCallId" style="display:none;" {on click {fn:confAppcallback, args:{pnrLoc:recLoc}}/}><a id="confCal" href='javascript:void(0)' class='datepicker'>${checkCal}</a></span></div></div></li>
							{/if}
							{if (this.isMopSadad()==true)}<p class="booking-number"><span class="data"><strong> ${labels.tx_merci_text_booking_hold}</strong></span></p> {/if}
							{if (siteParameters.siteGdsRec == 'SHOW')}
							<p class="booking-number"><span class="label"> ${labels.tx_merci_text_booking_conf_bookingnumber}:</span> <span class="data"><strong>${recLoc}</strong></span></p>
							{/if}
							{var bookingNumRecLocNumbers = new modules.view.merci.common.utils.StringBufferImpl(labels.tx_pltg_pattern_NumericRecordLocator)/}
							{if (siteParameters.siteGdsRec == 'SHOW' && siteParameters.siteNumRecLocDiplay == 'TRUE' && numRecLoc != "")}
								{if this.isMopSadad()==true}
									<p class="booking-number"><span class="label">  ${labels.tx_merci_text_sadad_ref}:</span><span class="data"><strong>${numRecLoc}</strong></span></p>
									<p class="booking-number"><span class="label">  ${labels.tx_merci_text_sadad_billing}: </span><span class="data"><strong>022</strong></span></p>
								{else/}
								<p class="numeric-number"><span class="data"><strong>${bookingNumRecLocNumbers.formatString([numRecLoc])}</strong></span></p>
								{/if}
							{/if}
							{if (siteParameters.siteOtherAirlinesRec == 'HIGHLIGHT' || siteParameters.siteOtherAirlinesRec == 'SHOW')}
								<p class="numeric-number"><span class="label"> ${labels.tx_merci_text_booking_conf_airlinenumber}:</span> <span class="data"><strong>${airlineConfNumbers}</strong></span></p>
							{/if}
							<p class="eticket"><span class="label">	{if this.isMopSadad()==true}${labels.tx_text_merci_booking_reference_sent}{else/}${labels.tx_merci_awards_etkt}{/if}</span> <span class="data"><strong>${this._getEticketEmail()}</strong></span></p>
						</section>
					</article>

					<!-- E-TICKET START -->
					{var airTktInfo = rqstParams.listTicketInformationBean.listAirTicketInformation/}
					{if siteParameters.siteViewETKT == 'TRUE' && airTktInfo != null}
						{var oldTicket = 'false'/}
						{foreach ticket in rqstParams.listTicketInformationBean.listAirTicketInformation}
							{set travellers = ticket.listTraveller.travellers/}
							{foreach pax in travellers}
								{set tStatus = ticket.faFh.ticketUsed/}
								{if (tStatus == 'true' && siteParameters.siteDisplayNewTkt == 'TRUE')}
									{set oldTicket = 'true'/}
								{/if}
							{/foreach}
						{/foreach}
					{/if}
					{if airTktInfo != null && airTktInfo.length > 0}
						<article class="panel eticket-box">
							<header>
								<h1>${labels.tx_merci_text_mybooking_eticket}
									<button id="button0" type="button" role="button" class="toggle" aria-expanded="true" id="eTicketSection" {on click {fn:"toggleExpand", scope:this, args:{sectionId:"eTicketSection", buttonId:"button0"}}/}>
										<span>Toggle</span>
									</button>
								</h1>
							</header>
							<section id="eTicketSection">
								<ul role="listbox">
									{foreach ticket in rqstParams.listTicketInformationBean.listAirTicketInformation}
										{var ticketStatus = ticket.faFh.ticketUsed/}
										{var ticketType = ticket.faFh.ticketIndicator/}
										{set eTicketTxt = labels.tx_merci_awrd_tktNo/}
										{if (ticketStatus == 'false' && ticketType == 'ET' && (siteParameters.siteDisplayNewTkt != null && siteParameters.siteDisplayNewTkt.toLowerCase() == 'true') && oldTicket == 'true')}
											{set eTicketTxt = labels.tx_merci_new_eticket_label/}
										{/if}
										{if (ticketStatus == 'true' && siteParameters.siteDisplayNewTkt == 'TRUE')}
											{set eTicketTxt = labels.tx_merci_old_eticket_label/}
										{/if}
										{foreach traveller in ticket.listTraveller.travellers}
											<li>
												<p><div class="label" style="display: inline-block;">${eTicketTxt}:</div> <span class="data"><strong>${ticket.faFh.documentNumber}</strong></span></p>
												<p>
													<span class="label">${labels.tx_merci_ts_paymentpage_Name}:</span>
													<span class="data">
														<strong>${this._getTravellerName(ticket, traveller)}</strong>
													</span>
												</p>
											</li>
										{/foreach}
									{/foreach}
								</ul>
							</section>
						</article>
					{/if}
					<!-- E-TICKET END -->
					{@html:Template {
						classpath: "modules.view.merci.segments.booking.templates.farereview.MConfConn",
						cssClass: 'conf-segment',
						data: {
							'labels': labels,
							'rqstParams': rqstParams,
							'siteParams': siteParameters,
							'globalList': gblLists,
							'fromPage':'CONF'
						}
					}/}
					{if  !this._merciFunc.isEmptyObject(rqstParams.insPanelKey) || (!aria.utils.Object.isEmpty(rqstParams.insPanelKey) && rqstParams.insPanelKey!=null)}
						{if rqstParams.insPanelKey.bookedInsuranceProductList != null}
							{call insurancePanel(labels, rqstParams)/}
						{/if}
					{/if}
					
					{@html:Template {
						classpath: "modules.view.merci.segments.booking.templates.farereview.MPriceBreakdown",
						cssClass: 'conf-price-breakdown',
						data: {
							'labels': labels,
							'rqstParams': rqstParams,
							'siteParams': siteParameters,
							'globalList': gblLists,
							'fromPage': 'CONF',
							'recLoc': recLoc,
							'currCode':this.currCode,
							'exchRate':this.exchRate,
							'payLaterElig': payLaterElig			  
						}
					}/}

					{if this._isInstallmentsEnabled()}
						{@html:Template {
							classpath: "modules.view.merci.segments.booking.templates.conf.MInstallmentDetail",
							data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'siteParams': siteParameters
							}
						}/}
					{/if}
				</form>
				{if siteParameters.siteDataTransferEnabled=="TRUE"}
						{@html:Template {
							classpath: "modules.view.merci.segments.booking.templates.conf.MInputForm",
							data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'siteParams': siteParameters
							}
						}/}
					{/if}
				// contact us link
				{if (siteParameters.displayCallCentre=="TRUE")}
				<div class="msg info tablet">
					<ul>
						<li>${labels.tx_merci_text_booking_conf_callus1} <a href="javascript:void(0)" {on click {fn: 'onContactUsClick', scope: this}/}>${labels.tx_merci_text_booking_conf_callus2}</a></li>
					</ul>
				</div>
				{/if}
				// include nav button tpl to show meal and checkin buttons
			<div class="trip">
				{@html:Template {
          classpath: "modules.view.merci.common.templates.MNavButtons",
          args: [
            'buttons',
            [
							'CHECKIN_SEG',
							'MEAL',
							'CAR',
							'HOTEL'
            ]
          ],
					data: {
						config: {
							checkInURL: siteParameters.siteCheckInURL,
							allowPNRServ: siteParameters.siteAllowPnrServ,
							siteAllowCheckin: siteParameters.siteAllowCheckin,
							allowSpecialMeal: siteParameters.allowSpecialMeal,
							siteCknTimeFrame: siteParameters.siteCknTimeFrame,
							merciCheckInEnabled: siteParameters.siteCheckInEnabled,
							merciSsciCheckInEnabled: siteParameters.merciSsciCheckInEnabled,
							displayAgodaLink:siteParameters.displayAgodaLink,
							merciServiceCatalog: siteParameters.servicesCatalog,
							displaySQCarLink:siteParameters.displaySQCarLink,
							sqCarUrl:siteParameters.sqCarUrl,
							bookHotelUrl:siteParameters.bookHotelUrl
						},
						labels: {
							tx_merci_text_air_check_in: labels.tx_merci_text_air_check_in,
							tx_merci_text_mybook_selmeal: labels.tx_merci_text_mybook_selmeal,
							tx_merci_text_mealsel_mealpref: labels.tx_merci_text_mealsel_mealpref,
							tx_merci_text_book_hotel:labels.tx_merci_text_book_hotel,
							tx_merci_text_book_car:labels.tx_merci_text_book_car
						},
						itineraries: rqstParams.listItineraryBean.itineraries,
						common: {
							pageTicket: rqstParams.reply.pageTicket,
							recordLocator: rqstParams.tripPlanBean.REC_LOC,
							fromPage: 'CONF',
							paymentType:rqstParams.param.paymentType
						},
						rebooking: {
							lastName: lName
						},
						dateParams: rqstParams.currentDate.params,
						'fromPage': 'CONF'
					},
          block: true
				}/}
			</div>
			</section>
		{/if}
		{var tripAddedLabel=this.getAddTripLabel() /}
    	{var okLabel=this.getOkLabel() /}
		<div class="mask" {id 'addTripToCalendarAlertOverlay' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${tripAddedLabel}</h3>
				<button type="button" {on click {fn:"toggleCalendarAlert", args:{id:'added'}} /}>${okLabel}</button>
			</div>
		</div>
	{/macro}
	{macro insurancePanel(labels, rqstParams)}
		{var insProductName = "" /}
		{var insProduct = rqstParams.insPanelKey.bookedInsuranceProductList /}

		{if insProduct != null}
			{foreach product in insProduct}
				{set insProductName = product.insuranceProduct.productName /}
			{/foreach}
		{/if}

		<article class="panel">
			<header>
				<h1>
					${labels.tx_merci_text_booking_ins_title}
					<button id="Insbtn" type="button" role="button" class="toggle" aria-expanded="true" {on click {fn:"toggleExpand", scope:this, args:{sectionId:"insuranceSection", buttonId:"Insbtn"}}/}>
						<span class="">Toggle</span>
					</button>
				</h1>
			</header>
			<section id="insuranceSection">
				<div><strong>${insProductName}</strong></div>
				<p>${labels.tx_merci_text_booking_ins_trvl_entire_txt}</p>
				<p>${labels.tx_merci_text_booking_ins_total_price}<span class="price">${rqstParams.insPanelKey.formattedTotalAmount}</span></p>
			</section>
		</article>
	{/macro}

	{macro includeError(labels)}
		{section {
			id: 'errors',
			bindRefreshTo : [{
        inside : this.data,
        to : "errorOccured",
        recursive : true
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
		${aria.utils.Json.setValue(this.data, 'errorOccured', false)|eat}
	{/macro}
{/Template}