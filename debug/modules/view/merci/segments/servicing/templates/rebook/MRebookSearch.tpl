{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.rebook.MRebookSearch",
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
		<section id="rebookSearch">
			<form {id "searchForm" /}>
    			{call common.showBreadcrumbs(1)/}
				{call includeError(labels)/}
    			{section {
      				type: 'div',
      				id: 'messages',
      				macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
      				bindRefreshTo: [{inside: this.data, to: 'messages'}]
    			}/}

				<div class="msg info">
					<ul>
						<li>${this.labels.tx_merci_mc_atc_flight_to_change}</li>
					<ul>
				</div>
				{if (this.utils.booleanValue(this.reply.fareDrivenFlow) && (this.utils.booleanValue(this.reply.scheduleDrivenFlow) && this.utils.booleanValue(this.config.scheduleFlow) && this.utils.booleanValue(this.config.scheduleATC)))}
				<div class="panel atcsort list type">
					<ul class="input radioButtons">
						<li>
						<input name="SEARCH_PAGE" id="radioFD" type="radio" value="FP" checked="checked" {on click {fn: this.setFlowType, scope: this, args:"price"}/}>
						<label for="radioFD">${this.labels.tx_merci_text_rebooking_label_price}</label>
						</li>
						<li>
						<input name="SEARCH_PAGE" id="radioSD" type="radio" value="SD" {on click {fn: this.setFlowType, scope: this, args:"schedule"}/}>
						<label for="radioSD">${this.labels.tx_merci_text_rebooking_label_schedule}</label>
						</li>
					</ul>
				</div>
				{/if}

				<div id="tabletContainerATC" class="tabletContainer">
    				<div role="group">
			        	{foreach itinerary inArray this.tripplan.air.itineraries}
							{call boundSection(itinerary, this.data.bounds[itinerary_index], parseInt(itinerary_index)) /}
			       		{/foreach}
    				</div>
					{call flexibleDatesSection() /}
    				{call hiddenInputs() /}
				</div>
				{if (this.utils.booleanValue(this.config.scheduleFlow) && this.utils.booleanValue(this.config.scheduleATC))}
				<p class="cabin atc" style="display:none">
						{var gblLists = this.gblLists/}
						{var cabinClassStored = this.__merciFunc.getStoredItem('CABIN_CLASS')/}
						{var selectedFareType = this.config.defaultCabinClass /}
						{var selectedFareTypeName = "" /}
						{var fareFamilies = this.reply.searchRecapBean.fareTypeFamilies/}
						{if !this.__merciFunc.isEmptyObject(fareFamilies)}
							{set selectedFareType = fareFamilies[0].code /}
						{/if}
						{if !this.__merciFunc.isEmptyObject(this.reply.searchRecapBean.cabin)}
							{set selectedFareTypeName = this.reply.searchRecapBean.cabin /}
						{/if}
						<label for="CABIN_CLASS">${labels.tx_merci_text_rebooking_fare_type}</label>
						<select id="CABIN_CLASS" name="CABIN" {on change {fn: this.setCabin, scope: this}/}>
							{foreach cabinClass in gblLists.allowdCabinList}
								<option value="${cabinClass[0]}"
									{if (selectedFareTypeName == cabinClass[1] || (selectedFareTypeName == "" && selectedFareType == cabinClass[0]))}selected{/if}>${cabinClass[1]}
								</option>
							{/foreach}
						</select>
					</p>
					{/if}
  			</form>
    		<footer class="buttons">
      			<button class="validation{if !this.continueEnabled()} disabled{/if}" {id "rebookButton" /}
             		formaction="" {on click {fn: this.onContinue, scope: this} /}>
        			${this.labels.tx_merci_text_booking_continue}
      			</button>
    		</footer>
		</section>
	{/macro}

	{macro boundSection(bound, boundData, index)}
		{var tripType = this.moduleCtrl.getModuleData().servicing.MRebookSRCH_A.reply.search.tripType/}
		<article {id boundData.articleId /} class="panel trip{if index != null && index == 0} firstChild{/if} {if tripType== 'O'}onewaypanel{/if}" role="treeitem" aria-selected="${boundData.selected}">
      		{section {
        		type: 'header',
        		id: 'head' + boundData.articleId,
        		bindRefreshTo: [{inside: boundData, to: 'selected'}],
       			macro: {name: 'boundHeader', scope: this, args: [bound, boundData]}
     		}/}

      		{foreach segment inArray bound.segments}
        		{call segmentSection(bound, segment) /}
      		{/foreach}

      		{section {
        		type: 'footer',
        		id: 'footer' + boundData.articleId,
        		bindRefreshTo: [{inside: boundData, to: 'selected'}],
        		macro: {name: 'boundFooter', scope: this, args: [bound, boundData]}
      		}/}
    	</article>
	{/macro}

  {macro boundHeader(bound, boundData)}
    <h1>
      {var cabin = bound.segments[0].cabins[0] /}
      <input type="hidden" name="BOUND_TO_MODIFY_${bound.itemId}" value="${String(boundData.selected).toUpperCase()}"/>
      <input type="hidden" name="B_LOCATION_${bound.itemId}" value="${bound.beginLocation.locationCode}"/>
      <input type="hidden" name="E_LOCATION_${bound.itemId}" value="${bound.endLocation.locationCode}"/>
      <input type="hidden" name="CABIN_CLASS_RBD" value="${cabin.RBD}"/>
      <input type="hidden" name="CABIN_CLASS" value="${cabin.RBD}"/>
	  {var searchPage = this.moduleCtrl.getModuleData().servicing.MRebookSRCH_A.reply.search.searchPage/}
	  {var isAwardATCEnabled = this.config.allowAwardATC/}
	  {if (searchPage == "SD" && isAwardATCEnabled)}
	    	<input type="hidden" id="CABIN" name="CABIN" value="${cabin.code}"/>
	  {/if}

      {if boundData.changeAllowed}
        <input id="check${bound.itemId}" type="checkbox" name="PLTG_CHANGE_ELEMENT_${bound.itemId}" value="true"
          {if boundData.selected}checked="checked"{/if}
          {on click {fn: this.toggleBound, scope: this, args: boundData} /}>
      {else/}
        <input type="checkbox" value="" disabled="disabled" />
        <input type="hidden" name="Day${bound.itemId}"   value="${bound.beginDateBean.day}"/>
        <input type="hidden" name="Month${bound.itemId}" value="${bound.beginDateBean.formatDateAsYYYYMM - 1}"/>
        <input type="hidden" name="Hour${bound.itemId}"  value="${bound.beginDateBean.formatTimeAsHHMM}"/>
      {/if}
      <label for="check${bound.itemId}">${bound.beginLocation.cityName} - ${bound.endLocation.cityName}</label>

      {var flown = this.utils.booleanValue(bound.boolFlownStatus)/}
      {if flown && boundData.changeAllowed}
        <span>${this.labels.tx_pltg_text_FlightAlreadyFlown}</span>
       <span>${this.labels.tx_pltg_text_NoShowCanStillChange}</span>
      {/if}
    </h1>
  {/macro}

	{macro segmentSection(bound, segment)}
	    <section class="trip">
	    	{call common.flightNumber(segment, true, bound, this.labels, null, this) /}
	   		{call common.locationDetails("departure", segment.beginDateBean, segment.beginLocation) /}
	    	{call common.locationDetails("arrival", segment.endDateBean, segment.endLocation) /}
	     	<p class="date">
	   			{var begDate = new Date(segment.beginDate) /}
	    		<time class="date" datetime="${begDate|dateformat: 'yyyy-MM-dd'}">${begDate|dateformat: 'EEE dd MMM yyyy'}</time>
	    	</p>
	    </section>
	{/macro}

	{macro boundFooter(bound, boundData)}
		<div class="list date">
			<label for="day1">${this.labels.tx_merci_mc_atc_flight_select_date}</label>
			{call inputDatePicker(bound.itemId, bound.beginDateBean, boundData.selected) /}
		</div>
	{/macro}

	{macro inputDatePicker(boundId, beginDateBean, enabled)}

		{var isFlownSegment = this._isFlownSegment(beginDateBean)/}
	    <ul class="input">
	      	<li>
		        <label for="day1">Day</label>
		        {var selDay = beginDateBean.day /}
		        {if isFlownSegment}
		        	{set selDay = this._getCurrentDate().getDate() /}
		        	{if selDay < 10}
		        		{set selDay = '0' + selDay/}
		        	{/if}
		        {/if}
		        <select name="Day${boundId}"  id="Day${boundId}" {if !enabled}disabled="disabled"{/if}>
		          	{for var j=1; j<32; j++}
		            	{var jStr = j<10 ? '0'+j : j /}
		            	<option value="${jStr}" {if j === selDay}selected="selected"{/if}>${jStr}</option>
		        	{/for}
		        </select>
		        {var dayLabel = "Day"+boundId /}
	      	</li>
	      	<li>
		        <label for="month1">Month/year</label>
		        {var monthYears = this.getMonthYears() /}
		        {var selMonth = String(Number(beginDateBean.formatDateAsYYYYMM)-1) /}
		        {if isFlownSegment}
		        	{var month = this._getCurrentDate().getMonth()/}
		        	{if month < 10}
		        		{set month = '0' + month/}
		        	{/if}
		        	{set selMonth = this._getCurrentDate().getFullYear() + '' + month/}
		        {/if}
		        {var monthLabel = "Month"+boundId /}
		        <select name="Month${boundId}" id="Month${boundId}" {if !enabled}disabled="disabled"{/if} {on change {fn:onDateSelection, scope:this, args:{monthdd:monthLabel,daydd:dayLabel}}/}>
		        	{foreach my inArray monthYears}
		           		<option value="${my.value}" {if my.value === selMonth}selected="selected"{/if}>${my.fmtMonth} ${my.fmtYear}</option>
		       		{/foreach}
		        </select>
			</li>
	    </ul>
	{/macro}

	{macro flexibleDatesSection()}
	    {var isFlexEnabled = this.utils.booleanValue(this.config.enableFlexDates) /}
		{var flexRange = parseInt(this.config.flexRange,10) /}
		{var scheduleDriven = this.utils.booleanValue(this.config.scheduleDrivenEnable) /}
	    {if this.utils.booleanValue(this.reply.fareDrivenFlow) &&  isFlexEnabled && flexRange > 0}
			<footer class="panel flexible">
		        <section>
					{section {
			            type: 'p',
			            id: 'flexSection',
			            attributes: {
			              classList: ['flexible']
			            },
			            bindRefreshTo: [{inside: this.data.flexDates, to: 'checked'}],
			            macro: {name: 'flexInputs', scope: this, args: [flexRange]}
		          	}/}
		        </section>
			</footer>
	    {/if}
	{/macro}

	{macro flexInputs(flexRange)}
	    <input name="DATE_RANGE_VALUE_2" type="hidden" value="${this.data.flexDates.range}"/>
	    <input name="DATE_RANGE_VALUE_1" id="flexible1" type="checkbox" value="${flexRange}" {if this.data.flexDates.checked}checked="checked"{/if} {on click {fn: this.toggleFlex, scope: this} /}/>
	    <label for="flexible1">${this.labels.tx_merci_text_booking_srch_flexibledate} (+/- ${flexRange} ${this.labels.tx_merci_text_booking_srch_flexibledays})</label>
	{/macro}

	{macro hiddenInputs()}
		{var search = this.reply.search /}
		{var paxInfo = this.tripplan.paxInfo /}
	    <input type="hidden" name="result" value="json" />
		<input type="hidden" name="INITIAL_OFFICE" value="${this.reply.initialOfficeId}"/>
		<input type="hidden" name="INITIAL_CURRENCY" value="${this.reply.initialCurrency}"/>
	    <input type="hidden" name="page" value="ATC 1c-Flight Change"/>
	    <input type="hidden" name="PAGE_TICKET" value="${this.reply.pageTicket}"/>
	    <input type="hidden" name="SEARCH_PAGE" value="${search.searchPage}" />
	    <input type="hidden" name="FLOW_TYPE" value="${search.flowType}" />
	    <input type="hidden" name="TRIP_TYPE" value="${search.tripType}"/>
	    <input type="hidden" name="MODIFIED_BOUND" {id "MODIFIED_BOUND" /} value=""/>
	    <input type="hidden" name="REFRESH" value="0"/>
	    <input type="hidden" name="IS_KEEP_FARE" value="${this.config.keepFare}"/>
	    <input type="hidden" name="FIELD_ADT_NUMBER" value="${paxInfo.nbAdults}"/>
	    <input type="hidden" name="FIELD_CHD_NUMBER" value="${paxInfo.nbChildren}"/>
	    <input type="hidden" name="FIELD_INFANTS_NUMBER" value="${paxInfo.nbInfants}"/>
	    {if this.request.ENABLE_DEVICECAL}
			<input type="hidden" name="ENABLE_DEVICECAL" value="${this.request.ENABLE_DEVICECAL}"/>
		{/if}
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