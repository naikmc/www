{Template{
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MMealSelect',
	$hasScript: true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib',
		common: 'modules.view.merci.common.utils.MerciCommonLib'
	}
}}

	{macro main()}
    <section>
  		<form {id "MAPForm" /}>
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}

				{foreach itinerary inArray this.requestParam.listItineraryBean.itineraries}
					{foreach segment inArray itinerary.segments}
            {call segmentSection(segment, itinerary.itemId,itinerary_ct) /}
					{/foreach}
				{/foreach}
		{call hiddenInputs() /}
  		</form>
  			<footer class="buttons">
          <button type="submit" formaction="javascript: void(0)" class="validation cancel"
              {on click {fn: this.onCancel, scope: this} /}>
            ${this.labels.tx_merci_text_mealsel_cancel}
          </button>
          <button type="submit" formaction="javascript: void(0)" class="validation"
              {on click {fn: this.onSave, scope: this} /}>
            ${this.labels.tx_merci_text_mealsel_save}
          </button>
        </footer>


		</section>
	{/macro}

	{macro segmentSection(segment, itiId,boundCt)}
    <article class="panel trip{if this.utils.booleanValue(segment.segmentFlown)} flown{/if} marginLeftZero">
      <header>
        <h1>
          ${segment.beginLocation.cityName} - ${segment.endLocation.cityName}
        </h1>
      </header>

      <section>
        {call routeSection(segment) /}
        {call detailsSection(segment) /}
        {call mealsSections(segment, itiId) /}
      </section>

    </article>
	{/macro}

  {macro routeSection(segment)}
    <div class="trip">
      {var begDate = new Date(segment.beginDate) /}
      <time class="date" datetime="${begDate|dateformat: 'yyyy-MM-dd'}">
        ${this.formatDate(segment.beginDate, this.labels.tx_merci_pattern_DayDateFullMonthYear, true)}
      </time>
      {call common.flightNumber(segment, false, null, this.labels, this.siteParam, this) /}
      {call common.locationDetails("departure", segment.beginDateBean, segment.beginLocation, segment.beginTerminal, this.labels) /}
      {call common.locationDetails("arrival", segment.endDateBean, segment.endLocation, segment.endTerminal, this.labels,segment.nbDaysBetweenDepAndArrDates) /}
    </div>
  {/macro}

  {macro detailsSection(segment,boundCt)}
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
		{if this.siteParam.cabinClasses != null && this.siteParam.cabinClasses.length > 1}
			{foreach cabinClass in this.siteParam.cabinClasses}
				{if cabinClass[0] == 'Y'}
					{set storedFareFamily = cabinClass[1]/}
				{/if}
			{/foreach}
		{/if}
		{if this.siteParam.siteFpUICondType != null}
			{if this.siteParam.siteFpUICondType.toLowerCase() == 'html'}
				{if this.siteParam.siteHideCabinClass.toLowerCase()=='false'}
					{if segment.cabins[0].code == 'R' && this.siteParam.displayCustFarefamily.toLowerCase()=='true'}
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
					{if this.siteParam.siteShowRestrictedFare != null && this.siteParam.siteShowRestrictedFare.toLowerCase() == 'true'}
						// URL to fetch fareFamily information
						{var serviceLevelURL = new modules.view.merci.common.utils.StringBufferImpl(modules.view.merci.common.utils.URLManager.getFullURL('MServiceAvailAction.action', null))/}
						${serviceLevelURL.append('&isUpSell=true&fareFamilyCode=' + segment.fareFamily.code)|eat}
						${serviceLevelURL.append('&OVERRIDE_FINAL_LOCATION=FALSE')|eat}
						{if this.request.pricingType != null}${serviceLevelURL.append('&PRICING_TYPE=' + this.request.pricingType)|eat}{/if}
						{if this.request.tripType != null}${serviceLevelURL.append('&TRIP_TYPE=' + this.request.tripType)|eat}{/if}
						<a href="javascript:void(0)" {on click {fn: 'openHTML',args: {link: serviceLevelURL.toString(), segId: segment.fareFamily.condition.shortDescription}}/}>
					{/if}
						${segment.fareFamily.name}
					{if this.siteParam.siteShowRestrictedFare != null && this.siteParam.siteShowRestrictedFare.toLowerCase() == 'true'}
						</a>
            {/if}
					{if this.siteParam.siteRBDDisplayReview != null && this.siteParam.siteRBDDisplayReview.toLowerCase() == 'true' && segment.cabins != null && segment.cabins.length > 0 && segment.cabins[0].RBD != null && segment.cabins[0].RBD != ''}
						&nbsp;<abbr>(${segment.cabins[0].RBD})</abbr>
					{/if}
				{/if}
			{elseif this.siteParam.siteFpUICondType.toLowerCase() == 'uri'/}
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
				{if this.siteParam.enblFFUriPopup == 'TRUE'}
					{call createHTMLDom(boundCt,segment_ct)/}
					<a href="javascript:void(0)" {on click {fn: 'openURLHTML', scope: moduleCtrl, args: {ffNo: segment_ct, itinNo:boundCt}}/}>${fareFamilyName}</a>
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
  {macro mealsSections(segment, itiId)}
    {var isSegEligible = this.isSegmentEligible(segment) /}
		{if isSegEligible}
			<p><strong>${this.labels.tx_merci_text_select_meals_for}</strong></p>

			{foreach pax inArray this.requestParam.listTravellerBean.travellers}
				<div class="meal-selection">
				{if !this.utils.booleanValue(this.requestParam.isInfantMeal)}
						{var identity = pax.identityInformation /}
						<p>
							${this.utils.formatName(pax.paxType.code,
								identity.titleName, identity.firstName, identity.lastName,
								false, this.labels
							)}
							<span class="note">${this.labels.tx_merci_text_book_before}</span>
						</p>
						<div>
							{if !this.utils.booleanValue(this.siteParam.siteBilateralMeal)}
								{if this.isMealUnavailable(segment)}
									${this.labels.tx_pltg_text_calendar_meal} ${this.labels.tx_pltg_text_Unavailable}

								{elseif this.utils.booleanValue(this.siteParam.siteAllowSpecialMeal) /}
									{var paxId = pax.paxNumber /}
									{var segId = segment.id /}
									<input type="hidden" name="hidIndexes_${paxId}_${segId}" value="${paxId}_${itiId}_${segId}">

									{if this.hasAncillaryMealService()}
										{call ancillaryMealSelector(segment, itiId, paxId, isSegEligible) /}

									{else/}
										{var paxPref = this.getAirPreference(segment, paxId) /}
										{var dispMealsList = this.displayMealsList() /}
										<input type="hidden" name="PreSelectedMeal_${paxId}_${itiId}_${segId}" {if !this.utils.isEmptyObject(paxPref)} value="${paxPref.mealCode}" {/if}/>

										{var options = null /}
										{if segment.serviceMeals && dispMealsList}
											{set options = this._optionsFromServiceMeals(segment.serviceMeals, paxPref) /}
										{elseif !dispMealsList /}
											{set options = this._optionsFromGlobalList(paxPref) /}
										{/if}

										{if options}
											{call mealSelector(paxId, segId, options, isSegEligible) /}
										{/if}
									{/if}
								{/if}
							{/if}
						</div>
					{elseif pax.withInfant/}
						<p>${pax.infant.fullName}</p>
						<div>
							{var paxId = pax.paxNumber /}
							{var segId = segment.id /}
							{set options = this.buildInfantMealList() /}
							{call infMealSelector(paxId, segId, options, isSegEligible) /}
						</div>
					{/if}
				</div>
			{/foreach}
		{else/}
			<p>${this.labels.tx_merci_meal_disabled}</p>
		{/if}
  {/macro}

  {macro ancillaryMealSelector(segment, itiId, paxId, isSegEligible)}
    {var segId = segment.id /}
    {var hasChargeableMeal = false /}
    {var mealGroup = this.getSelectedMeal(paxId, itiId, segId) /}
    {if (mealGroup !=null && mealGroup!='undefined') }
      {foreach meal in mealGroup.singleServiceMap}
        {var config = this.isActivated(meal, segment.airline.code) /}
        {if config && meal.status === this.INITIAL}
          {if this.utils.booleanValue(config[6])}
            {set hasChargeableMeal = true /}
            <p>
              ${this.labels.tx_merci_text_mealsel_SelectedChargeableMeal}
              ${this.mealLabels[meal.serviceCode]}
              {if mealGroup.price}
                ${mealGroup.price.priceWithTax} ${mealGroup.price.currency.code}
              {/if}
            </p>
          {else/}
            <input type="hidden" name="PreSelectedMeal_${paxId}_${itiId}_${segId}" value="${meal.serviceCode}"/>
          {/if}
        {/if}
      {/foreach}
    {/if}

    {if !hasChargeableMeal}
      <label for="meals${segId}_${paxId}">
        {if segment.mealNames}
          {var sep = this.utils.getFormatFromEtvPattern(this.labels.tx_pltg_pattern_MealNames) /}
          ${segment.mealNames.join(sep)} ${this.labels.tx_merci_text_mealsel_provided},
        {/if}
        ${this.labels.tx_merci_text_mealsel_dinner}
      </label>
      {var options = this._optionsFromGroup(mealGroup, segment.airline.code) /}
      {call mealSelector(paxId, segId, options, isSegEligible) /}
    {/if}
  {/macro}

  {macro mealSelector(paxId, segId, options, enabled)}
    <select id="meals${segId}_${paxId}" name="MERCI_PREF_AIR_MEAL_${paxId}_${segId}" class="mealList"
        {if !enabled}disabled="disabled"{/if}>

      <option value="STRD">${this.labels.tx_pltg_text_NoSpecialMeal}</option>
      {foreach option inArray options}
		{if option.label}
			<option value="${option.value}" {if option.selected}selected="selected"{/if}>${option.label}</option>
		{/if}
      {/foreach}

    </select>
  {/macro}

  {macro hiddenInputs()}
    {var lastName = this.requestParam.listTravellerBean.primaryTraveller.identityInformation.lastName /}
    <input type="hidden" name="REC_LOC" value="${this.requestParam.recLoc}"/>
    <input type="hidden" name="ACTION" value="MODIFY"/>
    <input type="hidden" name="PAGE_TICKET" value="${this.requestParam.reply.PAGE_TICKET}"/>
    <input type="hidden" name="DIRECT_RETRIEVE" value="true"  />
    <input type="hidden" name="SERVICE_PRICING_MODE" value="INIT_PRICE"/>
    <input type="hidden" name="updateInfoSuccess" value="2130034"/>
    <input type="hidden" name="REJECT_ACKNOWLEDGEMENT" value="TRUE"/>
    <input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" value="${lastName}"/>
    <input type="hidden" name="COMMIT_SERVICES" value="TRUE"/>
    <input type="hidden" name="page" value="Ser Meal" />
    <input type="hidden" name="result" value="json" />
  {/macro}

  {macro infMealSelector(paxId, segId, options, enabled)}
  	{var currentMealSelection=this.getInfantMealSelection(segId, paxId) /}
    <select id="meals${segId}_${paxId}" class="mealList" {on change {fn:"createMealName", args:{paxId:paxId, segId:segId}} /}
        {if !enabled}disabled="disabled"{/if}>
        <option value=""> ${this.labels.tx_merci_text_pnr_select_meal}</option> 
      {foreach option inArray options}
		{if option.label}
			<option value="${option.value}" {if option.value==currentMealSelection}selected="selected"{/if}>${option.label}</option>
		{/if}
      {/foreach}
    </select>
    <input type="hidden" id="mealElement${segId}_${paxId}"/>
  {/macro}
{/Template}