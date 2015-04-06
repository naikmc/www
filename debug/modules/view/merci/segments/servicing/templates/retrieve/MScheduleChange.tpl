{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MScheduleChange",
  $dependencies: ['modules.view.merci.common.utils.MCommonScript'],
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
	<section>
		{var labels = this.moduleCtrl.getModuleData().MScheduleChange.labels/}
		{var siteParams = this.moduleCtrl.getModuleData().MScheduleChange.siteParam/}
		{var rqstParams = this.moduleCtrl.getModuleData().MScheduleChange.requestParam/}
		{var reply = this.moduleCtrl.getModuleData().MScheduleChange.reply/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{var isXBAGInPNR = "FALSE"/}
		{if !merciFunc.isEmptyObject(reply.serviceSelection.LIST_SERVICE)}
		{foreach services in reply.serviceSelection.LIST_SERVICE}
		   {if !merciFunc.isEmptyObject(services.SERVICE_KEY.TYPE)&& (services.SERVICE_KEY.TYPE=='XBAG')}
				{set isXBAGInPNR = "TRUE"/}
			{/if}
		{/foreach}
		{/if}
		<form {id "MAPForm" /}>
		{var pnrFlightChange = ''/}
		{var isItineraryNotAck = "FALSE"/}
		{var isStatusTK = "FALSE"/}
		  <div id="page_wrapper">
			 <div class="banner">
			  <ul><li class="titlePage logo">${labels.tx_merci_text_schedule_label}</li></ul>
			 </div>

			 {foreach current in reply.tripplan.travellers.travellersAsMap}
			   {if (current_index == 1)}
				   {var varFirstName = current.identityInformation.firstName/}
				   {var varLastName  = current.identityInformation.lastName/}
			  {/if}
			{/foreach}

		 <div class="content">
		  <div class="panelWrapper1 reschedule">
		  <div class="panelWrapperInner">

			 {call includeError()/}


		  <div class="panelContent">
		  <article class="panel trip">
			  <p>${labels.tx_merci_text_dear}&nbsp;<strong>${varFirstName}&nbsp;${varLastName}</strong><br>
				${labels.tx_merci_text_schedule_info_1}</p>
			</article>

		  {foreach itinerary inArray reply.tripplan.itinerary.itineraries }
		   {foreach segment in itinerary.segments}
		   {var statusCode  = segment.afterSellRbdStatus.code/}
		   {if (statusCode == 'UN') || (statusCode == 'UC') || (statusCode == 'NO')}
			 {set isItineraryNotAck  = "TRUE"/}
		   {/if}
		   {if (statusCode == 'TK')}
			 {set isStatusTK = "TRUE"/}
		   {/if}
		   {/foreach}
		  {/foreach}

		  {var numberOfItinerary = reply.tripplan.itinerary.nbrOfItineraries/}
		  {if numberOfItinerary == 2}
		  {foreach itinerary inArray  reply.tripplan.itinerary.itineraries}
			{if itinerary_index ==0}
			  {var itr1Flown       = itinerary.boolFlownStatus/}
			  {var start_city_ITR1 = itinerary.beginLocation.cityName/}
			  {var end_city_ITR1   = itinerary.endLocation.cityName/}
			{/if}
			{if itinerary_index ==1}
			  {var itr2Flown       = itinerary.boolFlownStatus/}
			  {var start_city_ITR2 = itinerary.beginLocation.cityName/}
			  {var end_city_ITR2   = itinerary.endLocation.cityName/}
			{/if}
		  {/foreach}
		  {/if}
	  {foreach itinerary inArray reply.tripplan.itinerary.itineraries}
		 <article class="panel trip">
			{var numberOfStops = itinerary.nbrOfStops/}
			{if numberOfStops > 0}
			 {foreach segment in itinerary.segments}
			  {set statusCode  = segment.afterSellRbdStatus.code/}
			  {if (statusCode == 'HK') || (statusCode == 'HX')}
				{set checkStatus  = "change"/}
			  {/if}
			 {/foreach}
			{/if}

			{var stopsIterator = itinerary.stopsIterator/}

			{if numberOfItinerary == 2}
			 {if (start_city_ITR1 == end_city_ITR2) || (end_city_ITR1 == start_city_ITR2 )}
			 {if (itinerary_index+1) == 1}
			 <header>
			  <h1>${labels.tx_merci_text_mybook_tabdeparture}<button aria-controls="section222 section113 p222" aria-expanded="true" class="toggle" role="button" type="button">
			  <span>Toggle</span></button></h1>
			</header>
			  {var dapartTab = true/}
			{/if}
			{if (itinerary_index+1) == 2}
			<header>
			<h1>${labels.tx_merci_text_mybook_tabreturn}<button aria-controls="section222 section113 p222" aria-expanded="true" class="toggle" role="button" type="button">
								<span>Toggle</span></button>
							</h1>
			  </header>
			{var retTab = true/}
			{var dapartTab = false/}
			{/if}
		   {/if}
			{if !((start_city_ITR1 == end_city_ITR2) || (end_city_ITR1 == start_city_ITR2 ))}
			  <h2>${labels.tx_merci_text_flight}${itinerary_index+1}:</h2>
			 {/if}
		   {/if}
		   {if numberOfItinerary >2}
			 <h2 class = "boundsTitle" >${labels.tx_merci_text_flight}${itinerary_index+1}:</h2>
			  {var flightTab  = true/}
			  {var dapartTab  = false/}
			  {var retTab  = false/}
			  {var date = ""/}
			  {var hours = ""/}
			  {var minutes = ""/}
			  {var arr = ""/}
		  {/if}
		  {var redDisplay  = 'no'/}
		  {var start_city_SEG1  = itinerary.beginLocation.cityName/}
		  {var end_city_SEG1  = itinerary.endLocation.cityName/}

		  {foreach segment in itinerary.segments}
			{var statusCode  = segment.afterSellRbdStatus.code/}
			{if ((statusCode == 'TK') || (statusCode == 'TL') || (statusCode == 'TN')) && (!itinerary.boolFlownStatus)}
			 <section id="section222" aria-expanded="true">
			  <div class="trip">
			{else/}
			<ul>
			  {if statusCode == 'HX'}
			   <li><span class="redText">${labels.tx_merci_text_flight_cancelled}</span></li>
			   {var cancelledSec = true/}
			  {/if}
			 </ul>
			  {if (dapartTab == 'true') || (flightTab == 'true') || (cancelledSec == 'true')}
				<section id="section222" aria-expanded="true">
				 <div class="trip">
			  {/if}
			  {if retTab == 'true'}
				<section id="section222" aria-expanded="true">
				 <div class="trip">
			  {/if}
			{/if}
		 {if !merciFunc.isEmptyObject(segment.afterSellRbdStatus)&& ((statusCode == 'TK') || (statusCode == 'TL') || (statusCode == 'TN')) && (!itinerary.boolFlownStatus)}
		  {set numberOfStops  = itinerary.nbrOfStops/}
		  {set stopsCheck  = 'false'/}
			 {var segBegDate = segment.beginDate/}
			 {set arr = segBegDate.split(" ")/}
			 <time datetime="2012-03-31" class="date">${arr[0]} ${arr[2]} ${arr[1]} ${arr[5]}</time>
			 <p class="flight-number"><strong>${segment.airline.code}${segment.flightNumber}</strong></p>
		 {if numberOfStops > 0}
			<input type="hidden" name="hiddenNoOfStopsAck_${itinerary_index+1}_${segment_index+1}" value="notAcknowledged"/>
			{set stopsCheck  = true/}
		  {else/}
			<input type="hidden" name="hiddenAck_${itinerary_index+1}" value="notAcknowledged"/>
		  {/if}
		  {if (stopsCheck == 'true') && ((statusCode == 'TK') || (statusCode == 'TL') || (statusCode == 'TN'))}
		   {set redDisplay  = "yes"/}
		  {else/}
		   {set redDisplay  = "no"/}
		  {/if}
		  <li class="messageErrorSchedule">${labels.tx_merci_text_schedule_to}:&nbsp;</li>
			<p class="departure">
			  {var SegBeginDate = segment.beginDate/}
			  {set arr = SegBeginDate.split(" ")/}
			  {set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
			  {set hours = date.getHours()/}
			  {if hours < 10}
				{set hours = '0' + hours/}
			  {/if}
			  {set minutes = date.getMinutes()/}
			  {if minutes < 10}
				{set minutes = '0' + minutes/}
			  {/if}
			  <time datetime="2012-03-31" class="departure hour">${hours}:${minutes}</time>
			  <span class="city">${segment.beginLocation.cityName}</span>
			  <span class="dash">,</span>
			  <span class="airport">${segment.beginLocation.locationName}</span>
			  <span class="terminal">${labels.tx_merci_text_terminal} ${segment.beginTerminal}</span>
		   </p>
			<p class="arrival">
			  {var SegEndDate = segment.endDate/}
			  {set arr = SegEndDate.split(" ")/}
			  {set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
			  {set hours = date.getHours()/}
			  {if hours < 10}
				{set hours = '0' + hours/}
			  {/if}
			  {set minutes = date.getMinutes()/}
			  {if minutes < 10}
				{set minutes = '0' + minutes/}
			  {/if}
			  <time datetime="2012-03-31" class="departure hour">${hours}:${minutes}</time>
			  <span class="city">${segment.endLocation.cityName}</span>
			  <span class="dash">,</span>
			  <span class="airport">${segment.endLocation.locationName}</span>
			  <span class="terminal">${labels.tx_merci_text_terminal} ${segment.endTerminal}</span>
		   </p>

		  {if (redDisplay == 'no' ) || ((checkStatus == 'change') && (redDisplay == 'yes' ))}
		  </div>
		 </section>
		  {/if}

		 {if stopsIterator.notLastElement}
		  <ul>
		   <li class="transit"><strong>${labels.tx_merci_text_mybook_stopover}</strong>
		   {var stop = stopsIterator.next/}
		   ${stop.timeBetweenFlights}
		   {if siteDisplayChangeOfAirport}
			 {if stop.changeOfAirportRequired}
			  ${stop.location.locationName} ${stop.nextLocation.locationName}
			 {else/}
			  ${changeOfPlaneInfo} ${timeBetweenFlights}
			 {/if}
		{else/}
			  ${timeBetweenFlights}
		{/if}
		   <span class="textHighlight">${labels.tx_merci_text_mybook_changeofplane}</span></li>
		   </div>
		 </section>
		 {/if}
		{/if}


	   {if !merciFunc.isEmptyObject(segment.afterSellRbdStatus) && (statusCode == 'HK') || (statusCode == 'UN') || (statusCode == 'HX') || (itinerary.boolFlownStatus) || (statusCode == 'UC') || (statusCode == 'NO')}
		   <section id="section222" aria-expanded="true">
			   <div class="trip">
			 {var segBegDate = segment.beginDate/}
			 {set arr = segBegDate.split(" ")/}

			 <time datetime="2012-03-31" class="date">${arr[0]} ${arr[2]} ${arr[1]} ${arr[5]}</time>
			 <p class="flight-number"><strong>${segment.airline.code}${segment.flightNumber}</strong></p>
			{if numberOfStops > 0}
			  <input type="hidden" name="hiddenNoOfStopsAck_${itinerary_index+1}_${segment_index+1}" value="alreadyAcknowledged"/>
			{else/}
			  <input type="hidden" name="hiddenAck_${itinerary_index+1}" value="alreadyAcknowledged"/>
			{/if}
			<p class="departure">
			  {var SegBeginDate = segment.beginDate/}
			  {set arr = SegBeginDate.split(" ")/}
			  {set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
			  {set hours = date.getHours()/}
			  {if hours < 10}
				{set hours = '0' + hours/}
			  {/if}
			  {set minutes = date.getMinutes()/}
			  {if minutes < 10}
				{set minutes = '0' + minutes/}
			  {/if}
			  <time datetime="2012-03-31" class="departure hour">${hours}:${minutes}</time>
			  <span class="city">${segment.beginLocation.cityName}</span>
			  <span class="dash">,</span>
			  <span class="airport">${segment.beginLocation.locationName}</span>
			  <span class="terminal">${labels.tx_merci_text_terminal} ${segment.beginTerminal}</span>
		   </p>
			<p class="arrival">
			  {var SegEndDate = segment.endDate/}
			  {set arr = SegEndDate.split(" ")/}
			  {set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
			  {set hours = date.getHours()/}
			  {if hours < 10}
				{set hours = '0' + hours/}
			  {/if}
			  {set minutes = date.getMinutes()/}
			  {if minutes < 10}
				{set minutes = '0' + minutes/}
			  {/if}
			  <time datetime="2012-03-31" class="departure hour">${hours}:${minutes}</time>
			  <span class="city">${segment.endLocation.cityName}</span>
			  <span class="dash">,</span>
			  <span class="airport">${segment.endLocation.locationName}</span>
			  <span class="terminal">${labels.tx_merci_text_terminal} ${segment.endTerminal}</span>
		   </p>
		  {if stopsIterator.notLastElement}
		  <ul>
		   <li class="transit"><strong>${labels.tx_merci_text_mybook_stopover}</strong>
		   {var stop = stopsIterator.next/}
		   ${stop.timeBetweenFlights}
		   {if siteDisplayChangeOfAirport}
			 {if stop.changeOfAirportRequired}
			  ${stop.location.locationName} ${stop.nextLocation.locationName}
			 {else/}
			  ${changeOfPlaneInfo} ${timeBetweenFlights}
			 {/if}
		{else/}
			  ${timeBetweenFlights}
		{/if}
		   <span class="textHighlight">${labels.tx_merci_text_mybook_changeofplane}</span></li>
		   </ul>
		  {/if}
	   {/if}

		   {if  segment_index == 0}
			{set start_city_ITR1  = segment.beginLocation.cityName/}
			{set end_city_ITR1  = segment.endLocation.cityName/}
		   {/if}
		   {if segment_index == 1}
				{set start_city_ITR2  = segment.beginLocation.cityName/}
				{set end_city_ITR2  = segment.endLocation.cityName/}
		   {/if}
		   {if ((start_city_ITR1 == end_city_ITR2) || (end_city_ITR1 == start_city_ITR2 ))}
			{set isConnected  = "CONNECTED"/}
		   {/if}
		   {if statusCode == 'TK'}
			{set statusTest  = "TK"/}
		   {/if}

		 {/foreach}

		{if redDisplay == 'yes'}</ul>{/if}

		{if ((siteParams.siteAllowPnrAck == 'TRUE') || (siteParams.siteAllowPnrAck == 'YES')) && (siteParams.siteAllowPartialAck == 'TRUE')}
		 {if (statusCode =='TK') ||((statusCode == 'TK')&& (isItineraryNotAck == 'TRUE') )}
		 <div class="actions">
						<label><input name="scheduleChange_${itinerary_index+1}" type="radio" scope="request" checked="checked" value="accept"> ${labels.tx_label_schldchange_accept} ${labels.tx_label_schldchange}</label>
						<label><input name="scheduleChange_${itinerary_index+1}" type="radio" scope="request" value="reject"> ${labels.tx_label_schldchange_thnkabt}</label>
		  </div>
		 {/if}
		{/if}


		{set statusTest  = ""/}
		{if statusCode == 'HX'}
		 {set pnrFlightChange  = "TRUE"/}
		{/if}
		 </article>
	  {/foreach}

		<div>
			{var info = labels.tx_label_schldchange_dnotaccept+" "+labels.tx_label_schldchange_dnotaccept2+ " "+labels.tx_label_schldchange_call_helpdesk/}
			{call message.showInfo({list: [{TEXT:info}], title: labels.tx_merci_warning_text})/}
			{if pnrFlightChange == 'TRUE'}
				{if  this.utils.booleanValue(siteParams.dispBagMsgForFlgtChnge) && this.utils.booleanValue(siteParams.isBagEnabled) && isXBAGInPNR == 'TRUE'}
					<p>${labels.uiErrors[2130060].localizedMessage}</p>
				{/if}
			{else/}
				{if this.utils.booleanValue(siteParams.dispBagMsgForTimeChnge) && this.utils.booleanValue(siteParams.isBagEnabled) && isXBAGInPNR == 'TRUE'}
					<p id="bagDiscl">${labels.uiErrors[2130059].localizedMessage}</p>
				{/if}
			{/if}
	   </div>

	   {if ((siteParams.siteAllowPnrAck == 'TRUE') || (siteParams.siteAllowPnrAck == 'YES')) && (siteParams.siteAllowPartialAck == 'FALSE') && ((isItineraryNotAck == 'FALSE') || (isStatusTK == 'TRUE'))}

		  <div class="actions tabletMargin">
			<label><input name="scheduleChange_1" type="radio" scope="request" checked="checked" value="accept"> ${labels.tx_label_schldchange_accept} ${labels.tx_label_schldchange}</label>
			<label><input name="scheduleChange_1" type="radio" scope="request" value="reject"> ${labels.tx_label_schldchange_thnkabt}</label>
		  </div>

	   {/if}
	   {if (isItineraryNotAck == 'FALSE') || (isStatusTK == 'TRUE')}
		   <footer class="buttons">
			  <button type="submit" formaction="javascript:void(0)" class="validation"
				  {on click {fn: this.onSave, scope: this} /}>
			   ${labels.tx_label_schldchange_submit}
			  </button>
			</footer>
	   {/if}
	   <div class="clear"></div>
		  </div>
		 </div>
		</div>
	   </div>
	  </div>
		{call hiddenInputs(reply) /}
		<input type="hidden" name="agree" value="${labels.tx_label_schldchange_submit}" />
		</form>
	 </section>
   {/macro}



   {macro hiddenInputs(reply)}
    <input type="hidden" name="result" value="json"/>
    {var primPax = reply.tripplan.travellers.primaryTraveller /}
    {var paxIdy = primPax.identityInformation /}
    <input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" value= "${paxIdy.lastName}"/>
    <input type="hidden" name="REC_LOC" value="${reply.tripplan.pnr.REC_LOC}"/>
    <input type="hidden" name="TRANSACTION_ID" value="BookTripPlan"/>
    <input type="hidden" name="DIRECT_RETRIEVE" value="true"  />
    <input type="hidden" name="ACTION" value="MODIFY"/>
    <input type="hidden" name="SERVICE_PRICING_MODE" value="INIT_PRICE"/>
    <input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED"/>
    <input type="hidden" name="PAGE_TICKET" value="${reply.pageTicket}" />
   {/macro}
  {macro includeError(labels)}
    {section {
      id: 'errors',
      macro: {name: 'displayError', scope: this},
      bindRefreshTo : [{
        inside : this.data,
        to : "errorOccured",
        recursive : true
      }],
    }/}
  {/macro}

  {macro displayError()}
      {if this.data.errors != null && this.data.errors.length > 0}
        {var errorTitle = ''/}
        {call message.showError({list: this.data.errors, title: errorTitle})/}

        // resetting binding flag
        ${this.data.errorOccured = false|eat}
      {/if}
  {/macro}

{/Template}