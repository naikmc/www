{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MFlightDetails",
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib'
  }
}}

  {macro main()}
    {if !this.utils.isEmptyObject(this.tripplan.air.itineraries)}
      {foreach itinerary inArray this.tripplan.air.itineraries}
        {call boundSection(itinerary, itinerary_index,itinerary_ct, this.tripplan.air.itineraries) /}
      {/foreach}
    {/if}
  {/macro}

  {macro boundSection(bound, boundIndex, boundCt, itineraries)}
	{var lastFlown = "" /}
	{var isCancelledSegTop = "" /}
	{var segmentOneWaitlisted = "" /}
	{foreach opertatedValue inArray bound.segments}
		{var lastFlown = opertatedValue.segmentFlown /}
		{var statusCode = opertatedValue.afterSellRbdStatus.code /}
		{if statusCode == 'UN' || statusCode == 'UC' || statusCode == 'NO' || statusCode == 'HX'}
			{set isCancelledSegTop = "Y" /}
		{/if}
		{if (!this.utils.isEmptyObject(opertatedValue.afterSellRbdStatus))}
			{if (!this.utils.isEmptyObject(opertatedValue.afterSellRbdStatus.messageKey) && opertatedValue.afterSellRbdStatus.messageKey == 'tx_pltg_text_WaitlistedStatus')}
				{set segmentOneWaitlisted = "Y" /}
			{/if}
		{/if}
	{/foreach}
		{var flown = lastFlown != "" && lastFlown/}
		{var flightCancelled = isCancelledSegTop != "" && isCancelledSegTop == 'Y'/}
		{var canceledIndicator = flightCancelled/}		
		{if (!this.utils.isEmptyObject(itineraries) && itineraries.length > 0 && !this.utils.isEmptyObject(itineraries[boundIndex+1]))}
			{if (itineraries[boundIndex+1].segments[0].status == 'TK' && itineraries[boundIndex+1].segments[0].beginLocation.locationCode == itineraries[boundIndex].segments[0].beginLocation.locationCode)}
				{var canceledIndicator = false/}
			{/if}
		{/if}
    <article class="panel trip marginLeftZero{if boundIndex == '0'} departure-section{else/} arrival-section{/if}{if flightCancelled} cancelled{/if}{if flown || flightCancelled} flown{/if}">
      {var sectionIds = this.getSectionIds(bound) /}
      <header>
        <h1>
          ${bound.beginLocation.cityName} - ${bound.endLocation.cityName}
          <button id="flightDetailsToggle_${bound.itemId}" class="toggle" type="button"
              aria-controls="${sectionIds.join(' ')}" aria-expanded="${!flown && !flightCancelled}"
              {on click {fn: this.utils.toggleSection, scope: this.utils, args:this} /}>
          </button>
        </h1>
      </header>

      {foreach segment inArray bound.segments}
        <section {id sectionIds[segment_index*2] /} aria-hidden="{if flown || flightCancelled}true{else/}false{/if}">
		  {if (canceledIndicator)}
			<header>
				<h2 class="alert">${labels.tx_cancelled_status}</h2>
			</header>
		  {/if}
		  {if (segmentOneWaitlisted == 'Y')}
			<header>
				<h2 class="alert">${labels[segment.afterSellRbdStatus.messageKey]}</h2>
			</header>
		  {/if}
		  {call schdChangeSection(segment,bound)/}
          {call routeSection(bound, segment, segment_ct === 1) /}
          {call detailsSection(segment,boundCt,segment_ct) /}
          {call servicesSection(segment, bound, isCancelledSegTop, lastFlown, segmentOneWaitlisted) /}

          {if segment_ct === bound.segments.length && (segment.nbrOfStops > 0 || bound.nbrOfStops)}
            <p class="total time">
              <strong class="label">${this.labels.tx_merci_text_total_travel_time}:</strong>
              <span class="duration">${this._getDateDisplayString(new Date(parseInt(bound.duration)))}</span>
            </p>
          {/if}
        </section>

        {if segment_ct !== bound.segments.length}
          <p class="transit" {id sectionIds[segment_index*2+1] /} aria-hidden="{if flown || flightCancelled}true{else/}false{/if}">
            <strong>${this.labels.tx_merci_text_layover_time}:</strong>
            ${segment.endLocation.locationName}.
            ${this.formatStopDuration(segment, bound.segments[segment_index+1], this.labels.tx_merci_pattern_Duration)}
            (${this.formatTime(segment.endDateBean)} - ${this.formatTime(bound.segments[segment_index+1].beginDateBean)})
            <em>change of plane</em>
          </p>
        {/if}
      {/foreach}

    </article>
  {/macro}
  {macro schdChangeSection(segment, bound)}
    {var segScheduleChange = "" /}
    {if (this.utils.booleanValue(this.config.siteflightChangeAck) && (this.utils.booleanValue(this.config.siteAllowPnrAck) || this.config.siteAllowPnrAck.toUpperCase() == 'YES') && !this.utils.isEmptyObject(segment.afterSellRbdStatus) && (segment.afterSellRbdStatus.code == 'TK' || segment.afterSellRbdStatus.code == 'TL' || segment.afterSellRbdStatus.code == 'TN') && (!this.utils.isEmptyObject(bound.boolCompletelyFlown) && !bound.boolCompletelyFlown))}
		{var strtDateBean = segment.beginDateBean /}
		{var sh = (strtDateBean.hour<10 ? '0'+strtDateBean.hour : strtDateBean.hour) /}
		{var sm = (strtDateBean.minute<10 ? '0'+strtDateBean.minute : strtDateBean.minute) /}
		{var strTime = sh + ':' + sm /}
		{var endDateBean = segment.endDateBean /}
		{var eh = (endDateBean.hour<10 ? '0'+endDateBean.hour : endDateBean.hour) /}
		{var em = (endDateBean.minute<10 ? '0'+endDateBean.minute : endDateBean.minute) /}
		{var endTime = eh + ':' + em /}
		<header><h2 class="schdChng">${this.labels.tx_merci_text_schedule_to} ${this.formatDate(segment.beginDateBean, this.labels.tx_merci_pattern_DayDateFullMonthYear, true)} ${strTime} - ${endTime}</h2></header>
    {/if}
  {/macro}

  {macro routeSection(bound, segment, isFirstSegment)}
    <div class="trip">

        {var begDate = this._getDateFromBean(segment.beginDateBean)/}
        <time class="date" datetime="${begDate|dateformat: 'yyyy-MM-dd'}">${begDate|dateformat: 'EEE dd MMM yyyy'}</time>
       	{var endDate = this._getDateFromBean(segment.endDateBean)/}

      {call common.flightNumber(segment, isFirstSegment, bound, this.labels, this.config, this) /}

	  {if segment.beginLocation != null}
			<p class="location departure">
				<time datetime="${begDate|timeformat: this.config.siteFullTimeFmt}" class="hour">${begDate|timeformat: this.config.siteFullTimeFmt}</time> <span class="city">${segment.beginLocation.cityName}</span>
				<span class="dash">,</span>   <span class="airport">${segment.beginLocation.locationName}</span>
				<span class="terminal">
					{if segment.beginTerminal != null || segment.beginTerminal != ''}
						${this.labels.tx_merci_text_terminal} ${segment.beginTerminal}
					{/if}
				</span>
				<abbr class="city">
					{if segment.beginLocation.locationCode != null || segment.beginLocation.locationCode != ''}
						(${segment.beginLocation.locationCode})
					{/if}
				</abbr>
			</p>
		{/if}

		{if segment.endLocation != null}
			<p class="location arrival">
				{if endDate != null}
					<time datetime="${endDate|timeFormat: this.config.siteFullTimeFmt}" class="hour">${endDate|timeFormat: this.config.siteFullTimeFmt}
					{var num=segment.nbDaysBetweenDepAndArrDates /}
					{if num >0}
						<small>(+ ${segment.nbDaysBetweenDepAndArrDates})</small>
					{/if}

					</time> <span class="city">${segment.endLocation.cityName}</span>
				{/if}
				<span class="dash">,</span>   <span class="airport">${segment.endLocation.locationName}</span>
				<span class="terminal">
					{if segment.endTerminal != null || segment.endTerminal != ''}
						${this.labels.tx_merci_text_terminal} ${segment.endTerminal}
					{/if}
				</span>
				<abbr class="city">
					{if segment.endLocation.locationCode != null || segment.endLocation.locationCode != ''}
						(${segment.endLocation.locationCode})
					{/if}
				</abbr>
			</p>
		{/if}
    </div>
  {/macro}

  {macro detailsSection(segment,boundCt,segmentCt)}
    <div class="details">
      <ul>
        <li class="duration">
          <span class="label">${this.labels.tx_merci_text_pnr_duration}</span>
          <span class="data">${this.utils.formatDuration(segment.flightTime, this.labels.tx_merci_pattern_Duration)}</span>
        </li>
        <li class="aircraft">
          <span class="label">${this.labels.tx_merci_text_fifo_aircraft}:</span>
          <span class="data">${segment.equipmentName}</span>
        </li>
        <li class="ff">
          <span class="label">${this.labels.tx_merci_text_farefamily}</span>
          <span class="data">
			{var storedFareFamily = null/}
			{if this.config.cabinClasses != null && this.config.cabinClasses.length > 1}
				{foreach cabinClass in this.config.cabinClasses}
					{if cabinClass[0] == 'Y'}
						{set storedFareFamily = cabinClass[1]/}
					{/if}
				{/foreach}
			{/if}

				{if this.config.siteFpUICondType != null}
					{if this.config.siteFpUICondType.toLowerCase() == 'html'}
						{if this.config.siteHideCabinClass.toLowerCase()=='false'}
							{if segment.cabins[0].code == 'R' && this.config.displayCustFarefamily.toLowerCase()=='true'}
							${storedFareFamily}
						{else/}
							{var sep = this.labels.tx_pltg_pattern_CabinNames /}
							{set sep = sep.substring(sep.indexOf(',') + 1) /}
							{set sep = sep.substring(sep.indexOf(',') + 1) /}
							{set sep = sep.substring(1, sep.length - 2) /}
							{var cabinNamesFormatted = ''/}
							{foreach cabin in segment.cabins}
								{set cabinNamesFormatted += cabin.name/}
									{if cabin_index != segment.cabins.length -1}
									{set cabinNamesFormatted += sep /}
								{/if}
							{/foreach}
							${cabinNamesFormatted}
						{/if}
						{/if}
						{if segment.fareFamily != null && segment.fareFamily != ''}
							&nbsp;
							{if this.config.siteShowRestrictedFare != null && this.config.siteShowRestrictedFare.toLowerCase() == 'true'}
								{var serviceData = this._getServiceURLData(segment)/}
								<a href="javascript:void(0)" {on click {fn: 'openHTML',args: {link: serviceData.serviceURL, segId: serviceData.shortDescription}}/}>
							{/if}
								${segment.fareFamily.name}
							{if this.config.siteShowRestrictedFare != null
								&& this.config.siteShowRestrictedFare.toLowerCase() == 'true'}
								</a>
							{/if}
							{if this.config.siteRBDDisplayReview != null
								&& this.config.siteRBDDisplayReview.toLowerCase() == 'true'
								&& segment.cabins != null
								&& segment.cabins.length > 0
								&& segment.cabins[0].RBD != null
								&& segment.cabins[0].RBD != ''}
								&nbsp;<abbr>(${segment.cabins[0].RBD})</abbr>
							{/if}
						{/if}
					{elseif this.config.siteFpUICondType.toLowerCase() == 'uri'/}
						{var conditionURL = ''/}
						{var fareFamilyCode = ''/}
						{var fareFamilyName = ''/}
						{if segment.fareFamily != null}
							{if segment.fareFamily.condition != null && segment.fareFamily.condition.url != null}
								{set conditionURL = segment.fareFamily.condition.url/}
							{/if}
							{if segment.fareFamily.code != null}
								{set fareFamilyCode = segment.fareFamily.code/}
							{/if}
							{if segment.fareFamily.name != null}
								{set fareFamilyName = segment.fareFamily.name/}
							{/if}
						{/if}
						{if this.config.enblFFUriPopup == 'TRUE'}
							{call createHTMLDom(boundCt,segmentCt)/}
							<a href="javascript:void(0)" {on click {fn: 'openURLHTML', scope: moduleCtrl, args: {ffNo: segmentCt, itinNo:boundCt}}/}>${fareFamilyName}</a>
						{else/}
						<a href="${conditionURL}" id="fareFamilyAvailOpen"  target="_blank" fareFamilyCode="${fareFamilyCode}">${fareFamilyName}</a>
						{/if}
					{/if}
				{/if}

          </span>
        </li>
      </ul>
    </div>
  {/macro}
  {macro createHTMLDom(itin,seg)}
	 <div class="popup" id="htmlContainer_${itin}_${seg}" style="display: none;">
		<div id="htmlPopup_${itin}_${seg}">
		</div>
		<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
    </div>
  {/macro}

  {macro servicesSection(segment, bound, isCancelledSegTop, lastFlown, segmentOneWaitlisted)}
    {var mealElig = this.getMealEligibility(segment, bound.itemId) /}
	/*Commented for PTR 08555100 as it was hiding paxInfo also. Condition included in the displayAllServices macro. */
	/*{if !this.isEnabledServicesCatalog || (this.isEnabledServicesCatalog && this.isServiceForSegment(segment.id,bound.itemId)) }*/
    <div class="services">
		{var retrieveOtherPaxFlag = "N" /}
		{var lnames = ""/}
		{if (!this.utils.isEmptyObject(this.tripplan.pnr.lastNames))}
			{set lnames = this.tripplan.pnr.lastNames.split("###") /}
		{/if}
		{if (lnames != "" && this.tripplan.travellers.length > 1 && this.tripplan.travellers.length != lnames.length)}
			{set retrieveOtherPaxFlag = "Y" /}
		{/if}
      {foreach pax inArray this.tripplan.travellers}
      		/*Commented for PTR 08555100 as it was hiding paxInfo also. Condition included in the displayAllServices macro. */
			/*{if !this.isEnabledServicesCatalog || (this.isEnabledServicesCatalog && this.isServicePresentForPassenger(pax.paxNumber, segment.id, bound.itemId)) }*/
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
				<div class="pax ${pax.paxType.code} {if (showNames == 'Y')}hidden{/if}">
          <h2>${this.formatName(pax.paxType.code, idy)}</h2>
          {if pax.infant}
            {var infIdy = pax.infant /}
            <div class="pax ${infIdy.paxType} {if (showNames == 'Y')}displayNone{/if}">
             <h2> ${this.formatName(infIdy.paxType, infIdy)}</h2>
            </div>
          {/if}
					{if this.isEnabledServicesCatalog}
						{call displayAllServices(segment, bound, pax) /}
					{else/}
						{call displaySeatAndMeal(segment, bound, pax) /}
					{/if}
				</div>

		{/foreach}
		//{if !this.isEnabledServicesCatalog}
			{call displayServiceLinks(segment, bound,  isCancelledSegTop, lastFlown, segmentOneWaitlisted) /}
		//{/if}
		</div>
  {/macro}

  {macro displayAllServices(segment, bound, pax)}
	  {if this.isServicePresentForPassenger(pax.paxNumber, segment.id, bound.itemId)}
	<ul>
		{foreach category inArray this.reply.serviceCategories}
			{var selectedService = this.getSelectedService(segment.id, bound.itemId, pax.paxNumber, category.code) /}
			{if selectedService.length>0}
				<li>	${category.name} - ${selectedService}	</li>
			{/if}
		{/foreach}
		{if this.utils.booleanValue(this.config.allowSpecialMeal) && this.utils.booleanValue(this.config.allowPNRServ) && this.utils.booleanValue(this.config.infantMealAllowed)}
	        <li class="meal">
	            <span class="label">${this.labels.tx_merci_text_mealsel_meal}: ${this.getMealSelection(segment, pax.paxNumber)}
	            </span>
	        </li>
		{/if}
	</ul>
		{/if}
  {/macro}

  {macro displaySeatAndMeal(segment, bound, pax)}
          <ul>
            <li class="seat">
              <span class="label">${this.labels.tx_merci_text_seat}</span>
              {var seat = this.getSeatSelection(segment.id, bound.itemId, pax.paxNumber) /}
              <span class="data">${seat ? seat : '--'}</span>
            </li>

		{if this.utils.booleanValue(this.config.allowSpecialMeal) && this.utils.booleanValue(this.config.allowPNRServ)}
            <li class="meal">
              <span class="label">${this.labels.tx_merci_text_mealsel_meal}: ${this.getMealSelection(segment, pax.paxNumber)}
              </span>
            </li>
		{/if}

    </ul>
  {/macro}

  {macro displayServiceLinks(segment,bound, isCancelledSegTop, lastFlown, segmentOneWaitlisted)}
  	{var passbookParams = {}/}
	{if this.utils.booleanValue(this.config.siteEnablePassbook)}
		{var isIOS = aria.core.Browser.isIOS /}
		{var ver = this.findIOSVersion()/}
		{var versionTrue = false /}
		{var safariTrue = false /}
		{var appTrue = false/}
		{if aria.core.Browser.name.toLowerCase().indexOf("safari")!= -1}
			{set appTrue = true/}
		{/if}
	    {if typeof ver !== "undefined" && ver[0]>=6}
	  		{set versionTrue = true/}
		{/if}
		{if aria.core.Browser.browserType.toLowerCase().indexOf("safari")!= -1}
			{set safariTrue = true/}
		{/if}
		{var osVersion = aria.core.Browser.osVersion /}
		{if this.utils.booleanValue(isIOS) && versionTrue && (safariTrue || appTrue)}
			{var airlineCode = segment.airline.code/}
			{var flightNumber = segment.flightNumber/}
			{var depCity = segment.beginLocation.cityName/}
			{var depCityCode = segment.beginLocation.cityCode/}
			{var arrCity = segment.endLocation.cityName/}
			{var arrCityCode = segment.endLocation.cityCode/}
			{var depDate = ""/}
			{var segmentBeginDate = this._getDateFromBean(segment.beginDateBean)/}
			{set segmentBeginDate = new Date(segmentBeginDate.getTime())/}
			{if segmentBeginDate != null}
				{set depDate = this.utils.formatDate(segmentBeginDate,this.labels.tx_merci_pattern_DayDateFullMonthYear)/}
			{/if}
			{var depTime =""/}
			{set depTime = segment.beginDateBean.formatTimeAsHHMM/}
			{var headerDate = ""/}
			{var arrDate = ""/}
			{var segmentEndDate = this._getDateFromBean(segment.endDateBean)/}
			{set segmentEndDate = new Date(segmentEndDate.getTime())/}
			{if segmentEndDate != null}
				{set arrDate = this.utils.formatDate(segmentEndDate,this.labels.tx_merci_pattern_DayDateFullMonthYear)/}
				{set headerDate = this.utils.formatDate(segmentBeginDate,this.labels.tx_merci_pattern_DateMonth)/}
			{/if}
			{var arrTime =""/}
			{set arrTime = segment.endDateBean.formatTimeAsHHMM/}
			{var daysInterval=segment.nbDaysBetweenDepAndArrDates /}
			{if daysInterval >0}
				{set arrTime = arrTime + "(*1)"/}
			{/if}
			{var tripDuration = this._getDateDisplayString(new Date(parseInt(segment.flightTime)))/}
			{var passengers =this.createPaxArray()/}
			{var eTicketMap = this.createPaxEticketMap()/}
			{var REC_LOC = this.request.REC_LOC/}
			{var flight_string = this.labels.tx_merci_text_flight/}
			{var departure_string = this.labels.tx_merci_text_booking_conf_departure/}
			{var arrival_string = this.labels.tx_merci_ts_tripdetailspage_Arrival/}
			{var pnr_string = this.labels.tx_merci_ts_confirmationpage_AirlinePNR/}
			{var passengers_string = this.labels.tx_merci_text_pax/}
			{var name_string = this.labels.tx_merci_ts_paymentpage_Name/}
			{var eticket_string = this.labels.tx_merci_text_mybooking_eticket/}
			{set passbookParams = {airlineCode:airlineCode,flightNumber:flightNumber,depCity:depCity,depCityCode:depCityCode,arrCity:arrCity,arrCityCode:arrCityCode,depDate:depDate,headerDate:headerDate,arrDate:arrDate,depTime:depTime,arrTime:arrTime,tripDuration:tripDuration,passengers:passengers,eTicketMap:eTicketMap,REC_LOC:REC_LOC,flight_string:flight_string,departure_string:departure_string,arrival_string:arrival_string,pnr_string:pnr_string,passengers_string:passengers_string,name_string:name_string,eticket_string:eticket_string} /}
		{/if}
	{/if}
	  {var segScheduleChange = "" /}
	  {var isOperatedBySameAirline = true /}
	  {if (this.utils.booleanValue(this.config.siteflightChangeAck) && (this.utils.booleanValue(this.config.siteAllowPnrAck) || this.config.siteAllowPnrAck.toUpperCase() == 'YES') && !this.utils.isEmptyObject(segment.afterSellRbdStatus) && (segment.afterSellRbdStatus.code == 'TK' || segment.afterSellRbdStatus.code == 'TL' || segment.afterSellRbdStatus.code == 'TN') && (!this.utils.isEmptyObject(bound.boolCompletelyFlown) && !bound.boolCompletelyFlown))}
		{set segScheduleChange = "Y" /}
	  {/if}
	  {if this.utils.booleanValue(this.config.siteHideSeatCodeShare) && !this.utils.isEmptyObject(segment.opAirline) && segment.opAirline.code!=segment.airline.code }
	  		{set isOperatedBySameAirline=false /}
	  {/if}
	  {if (lastFlown == "" && isCancelledSegTop != 'Y' && segmentOneWaitlisted != 'Y' && segScheduleChange != 'Y' && !(pageObj.bookingDetails.reply.pnrStatusCode == 'P') && isOperatedBySameAirline==true)}
			{@html:Template {
				classpath: "modules.view.merci.segments.booking.templates.conf.MConfButtons",
				data: {
					'bound': bound,
					'segment': segment,
					'labels': {
						'tx_merci_nwsm_warn_msg1': this.labels.tx_merci_nwsm_warn_msg1,
						'tx_merci_text_changeseat': this.labels.tx_merci_text_changeseat,
						'tx_merci_text_mybook_selmeal': this.labels.tx_merci_text_mybook_selmeal,
						'tx_merci_text_mealsel_mealpref': this.labels.tx_merci_text_mealsel_mealpref,
						'tx_merci_text_addbag_addbaggage': this.labels.tx_merci_text_addbag_addbaggage,
						'tx_merci_text_seatsel_btnselseats': this.labels.tx_merci_text_seatsel_btnselseats,
						'tx_merci_text_add_infant_meal': this.labels.tx_merci_text_add_infant_meal,
						'tx_merci_text_chng_infant_meal':this.labels.tx_merci_text_chng_infant_meal,
						'tx_merci_text_booking_conf_departure': this.labels.tx_merci_text_booking_conf_departure,
			    		'tx_merci_ts_tripdetailspage_Arrival': this.labels.tx_merci_ts_tripdetailspage_Arrival,
			    		'tx_merci_text_flight': this.labels.tx_merci_text_flight,
			    		'tx_merci_text_pax': this.labels.tx_merci_text_pax,
			   			'tx_merci_ts_confirmationpage_AirlinePNR': this.labels.tx_merci_ts_confirmationpage_AirlinePNR,
			   			'tx_merci_text_mybooking_eticket': this.labels.tx_merci_text_mybooking_eticket,
			   			'tx_merci_ts_paymentpage_Name': this.labels.tx_merci_ts_paymentpage_Name,
			   			'tx_merci_pattern_DateMonth': this.labels.tx_merci_pattern_DateMonth,
			   			'tx_merci_checkin_confirmation_psbk': this.labels.tx_merci_checkin_confirmation_psbk
					},
					'config': {
						'allowMCSeatMap': this.config.allowMCSeatMap,
						'allowSeatMapModif': this.config.allowSeatMapModif,
						'checkinTimeFrame': this.config.checkinTimeFrame,
						'allowCheckin': this.config.allowCheckin,
						'pnrNameFilter': this.config.pnrNameFilter,
						'allowXBAG': this.config.allowXBAG,
						'allowPNRModif': this.config.allowPNRModif,
						'allowPNRServ': this.config.allowPNRServ,
						'allowPNRTIModif': this.config.allowPNRTIModif,
						'allowSpecialMeal':this.config.allowSpecialMeal,
						'merciServiceCatalog':this.config.merciServiceCatalog,
						'infantMealAllowed':this.config.infantMealAllowed,
						'siteEnablePassbook': this.config.siteEnablePassbook
					},
					'tripplan': {
						'misc': this.tripplan.misc,
						'pnr': {
							'isTicketed': this.tripplan.pnr.isTicketed
						},
						'air': {
							'seats': this.tripplan.air.seats,
							'services': {
								'byPax': this.tripplan.air.services.byPax
							}
						}
					},
					'request': {
						'LAST_NAMES' : this.request.LAST_NAMES,
						'DISPLAY_OTHER_PAX' : this.request.DISPLAY_OTHER_PAX,
						'REC_LOC': this.request.REC_LOC,
						'seatNos': this.request.seatNos,
						'isScheduleChange': this.request.isScheduleChange,
						'isScheduleReject': this.request.isScheduleReject,
						'DIRECT_RETRIEVE_LASTNAME': this.request.DIRECT_RETRIEVE_LASTNAME,
						'sadadPaymentEnb': this.sadad,
						'flow_Type': 'RETFLOW',
						'hasInfant': this.reply.bookingPanel.hasInfant,
						'passbookParams': passbookParams
					},
					'reply':	{
						'PAGE_TICKET': this.reply.pageTicket
					},
					'seatsEligibleSegments' : this.seatsEligibleSegments
				}
			}/}
  {/if}{/macro}
{/Template}