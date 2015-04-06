{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MBookSearch',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib',
				 common: 'modules.view.merci.common.utils.MerciCommonLib',	
				 tablet: 'modules.view.merci.common.utils.MerciTabletLib',
				 autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'},
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

	{var printUI = false/}
	{var adjustArgs={dep:null,arr:null} /}

	{macro main()}
		{section {
			id: 'searchPage',
			macro: 'loadContent'
		}/}

	{section {
		id: 'fConditions',
		macro: {name: 'fareConditions'}
	}/}
	{/macro}

	{macro loadContent()}
		{if printUI == true}
			{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam/}
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}

			{var months = []/}
			{if !merciFunc.isEmptyObject(rqstParams.fullMonthList)}
				{set months = rqstParams.fullMonthList.split(",")/}
			{/if}

			{var monthsValue = []/}
			{if !merciFunc.isEmptyObject(rqstParams.fullMonthListValue)}
				{set monthsValue = rqstParams.fullMonthListValue.split(",")/}
			{/if}

				{var className = "search"/}
			<section class="${className} cust_sbook_srch">

					{call common.showBreadcrumbs(1)/}
					{if !merciFunc.isEmptyObject(rqstParams.DWM_HEADER_CONTENT)}
				          {@html:Template {
					            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
					            data: {
					            	placeholder: rqstParams.DWM_HEADER_CONTENT,
					            	placeholderType: "dwmHeader"
					            }
				          }/}
					{/if}

					{if siteParameters.enableLoyalty == "TRUE"}
						<div class="message info">
							{var bp = modules.view.merci.common.utils.URLManager.getBaseParams() /}
							<p>${labels.loyaltyLabels.tx_merci_li_youHave} ${bp[17]} ${labels.loyaltyLabels.tx_merci_li_miles}</p>
						</div>
					{/if}
				
				{var isDealsFlow = false/}
				<form  {id "searchForm" /} name="searchForm" {on submit {fn:onSearchClick,args : {action: "MAvailabilityFlowDispatcher.action",isDealsFlow: isDealsFlow}}/}>
					{if siteParameters.mktMsgDisp == "TRUE"}
						{call message.showInfo({list: [{TEXT:this.moduleCtrl.getModuleData().booking.MSRCH_A.errors[2131000].localizedMessage}], title: labels.tx_merci_warning_text})/}
					{/if}

					// error display
					{call includeError(labels)/}

					<!-- Hidden Elements for Availability START -->
					{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
						<input type = "hidden" name="page" value="Fare Deals Search"/>
						<input type = "hidden" name="dealInvalidDepDates" id="dealInvalidDepDates" value="${rqstParams.invalidDatesDeals.DEPARTURE_INVALID_DATES}"/>
						<input type = "hidden" name="dealInvalidRetDates" id="dealInvalidRetDates" value="${rqstParams.invalidDatesDeals.RETURN_INVALID_DAYS}"/>
						<input type="hidden" name="FLOW_TYPE" id="FLOW_TYPE" value="DEALS_AND_OFFER_FLOW"/>
						<input type="hidden" name="FareDealData" id="FareDealData" value="${this.fetchAppFareDealData()}"/>
					{/if}
					{if !merciFunc.isEmptyObject(rqstParams.request.ENABLE_DEVICECAL)}
						<input type="hidden" name="ENABLE_DEVICECAL" id="ENABLE_DEVICECAL" value="${rqstParams.request.ENABLE_DEVICECAL}"/>
					{/if}
					{if (siteParameters.allowMCAwards == 'TRUE' && siteParameters.allowBanner == 'TRUE')}
						{var phoneType = rqstParams.CONTACT_POINT_PHONE_TYPE/}
						{var paymentType = "CC"/}
						{if !merciFunc.isEmptyObject(rqstParams.request.PAYMENT_TYPE)}
							{set paymentType = rqstParams.request.PAYMENT_TYPE/}
						{/if}
						{if (phoneType == 'H')}
							 <input type="hidden" name="CONTACT_POINT_HOME_PHONE" value="${rqstParams.CONTACT_POINT_PHONE_NUMBER}"/>
						{/if}
						{if (phoneType == 'M')}
							 <input type="hidden" name="CONTACT_POINT_MOBILE" value="${rqstParams.CONTACT_POINT_PHONE_NUMBER}"/>
						{/if}
						{if (phoneType == 'B')}
							 <input type="hidden" name="CONTACT_POINT_BUSINESS" value="${rqstParams.CONTACT_POINT_PHONE_NUMBER}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_LEVEL_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_LEVEL_1_1" value="${rqstParams.request.PREF_AIR_FREQ_LEVEL_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_MILES_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_MILES_1_1" value="${rqstParams.request.PREF_AIR_FREQ_MILES_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_LASTNAME_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_TITLE_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1}"/>
						{/if}
					{/if}
					<input type="hidden" name="page" value="1-AirSearch"/>
					{if !merciFunc.isEmptyObject(rqstParams.request.client)}
						<input type="hidden" name="client" value="${rqstParams.request.client}"/>
					{/if}
					<input type="hidden" name="ALLOW_REDEM_BOOKING" id="FLOW_REDEEM" value="${siteParameters.allowRedeem}"/>
					<input type="hidden" name="OPERATION" value="SET"/>
					<input type="hidden" name="NEW_SITE" value="${rqstParams.request.SITE}"/>
					<input type="hidden" name="KEEP_OC" value="FALSE"/>
					<input type="hidden" value="${rqstParams.request.COUNTRY_SITE}" name="country_site" id="country_site"/>

					{@html:Template {
						classpath: 'modules.view.merci.segments.booking.templates.search.MBookNominee',
						data: {
							'requestParam': rqstParams
						}
					}/}
					<!-- Hidden Elements for Availability END -->

					{if this.isAwardsFlowAllowed()}
						<article class="miles">
							<label for="myonoffswitch" class="baselineText">${labels.tx_merci_awards_redeem_miles}</label>
							<div class="onoffswitch">
								<input type="hidden" name="AWARDS_FLOW" id="AWARDS_FLOW" value="FALSE"/>
								<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" {on click {fn: 'openAwardsConfPopup'}/}>
								<label class="onoffswitch-label" for="myonoffswitch">
									<div class="onoffswitch-inner">
										<div class="onoffswitch-active">${labels.tx_merci_awards_yes}</div>
										<div class="onoffswitch-inactive">${labels.tx_merci_awards_no}</div>
									</div>
									<div class="onoffswitch-switch"> </div>
								</label>
							</div>
						</article>
					{/if}

					{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
						<div id="offerContent"></div>
						<a class="navigation fare-cond" href="javascript:void(0);" {on click {fn:"onFareCondClick"} /}>${labels.tx_merci_text_booking_fare_fare_conditions}</a>
					{/if}


<!-- multicity changes -->
<article class="panel share-slider shareBitly mlcity" aria-expanded="true">
<div class="container">
{if rqstParams.flow != 'DEALS_AND_OFFER_FLOW'}
	<ul class="tabs">
	<!-- css class gets added from javascript method onJourneyTypeClick() -->
	<li class="tab-link mlcity" id="tab-2" style=" float: left; margin-left: 5px;{if siteParameters.siteAllowMulticity != 'TRUE'}width:45%;{/if}" {on click {fn:"onJourneyTypeClick",args:{'val':'R'}} /}>${labels.tx_merci_text_booking_srch_roundtrip}</li>
	<li class="tab-link mlcity" id="tab-1" {if siteParameters.siteAllowMulticity != 'TRUE'} style="width:45%;"{/if} {on click {fn:"onJourneyTypeClick",args:{'val':'O'}} /}>${labels.tx_merci_text_booking_srch_oneway}</li>
	{if siteParameters.siteAllowMulticity == 'TRUE'}
	<li class="tab-link mlcity" id="tab-3" style=" float: right; margin-right: 5px;" {on click {fn:"onJourneyTypeClick",args:{'val':'M'}} /}>${labels.tx_merci_multiCity}</li>
	{/if}
	</ul>
{/if}

<!-- multicity changes -->

		<article class="panel sear mlcity">		
			<section>
			<div id="tab-1Content" class="tab-content mlcity current">
				{if rqstParams.flow != 'DEALS_AND_OFFER_FLOW'}

							{section {
								id : 'createSearchFeilds',
								macro : {
									name : 'createInputFields',
									id : 'createInputFields'
								}
							}/}

					<!-- {if (siteParameters.allowRoundTrip == 'TRUE')}
						<div class="list type">
							<label for="lil">${labels.tx_merci_triptype}</label>
							<ul class="input radioButtons">
								<li>
									<input name="trip-type" id="roundTrip" type="radio" value="roundTrip" ${this._radioSelectionValue('roundTrip')} {on click {fn:toggleReturnJourney}/}/>
									<label for="roundTrip">${labels.tx_merci_text_booking_srch_roundtrip}</label>
								</li>
								<li>
									<input name="trip-type" id="oneWay" type="radio" value="oneWay" ${this._radioSelectionValue('oneWay')} {on click {fn:toggleReturnJourney}/}/>
									<label for="oneWay">${labels.tx_merci_text_booking_srch_oneway}</label>
								</li>
							</ul>
						</div>
					{/if} -->
					{if (siteParameters.allowRoundTrip == 'TRUE')}
					<input name="trip-type" id="tripType" type="hidden" value="${this._radioSelectionValue('tripType')}" />		
					{/if}						
				{/if}

							// departure date calendar
							{call createDatePicker(siteParameters, rqstParams, 'day1', 'Day1', labels.tx_merci_text_booking_cal_departue, 'month1', 'Month1', months, monthsValue,'datePickSearchF', false, null, null)/}

							{var retDay = ""/}
							{var retYear = ""/}
							{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
								{var retDate = rqstParams.selectedOfferBean.travelEnd.split(" ")/}
								{var retDateSplit = retDate[0].split('-')/}
								{var dealEnd = new Date(retDateSplit[0]+'/'+retDateSplit[1]+'/'+retDateSplit[2])/}
								{set retDay = dealEnd.getDate()/}
								{var dealEndMnth = dealEnd.getMonth().toString()/}
								{if (dealEnd.getMonth().toString().length == 1)}
									{set dealEndMnth = "0"+dealEndMnth/}
								{/if}
								{set retYear = dealEnd.getFullYear().toString()+dealEndMnth/}
							{/if}

				// arrival date calendar
				{call createDatePicker(siteParameters, rqstParams, 'day2', 'Day2', labels.tx_merci_text_booking_advs_return, 'month2', 'Month2', months, monthsValue, 'datePickSearchT', true, retDay, retYear)/}


				</div>

				<!-- Multicity -->
				{if siteParameters.siteAllowMulticity == 'TRUE'}
				{var cityPair = parseInt(siteParameters.multicityMaxCityPair) /}
					<div id="tab-3Content" class="tab-content mlcity">
						<div class="share-content share-sms" style="">
							<div>
								{for var z = 1; z <= cityPair; z++}
								<section class="mlcitySection" {if (z>2)}style="display:none"{/if}>
									<span id="w11_createSearchFeilds">
									<h2> ${labels.tx_merci_text_flight} ${z}</h2>
										{section {
											id : 'from_Feild_mlcity'+z,
											macro : {
												name : 'createMultiCityFromField',
												args : [z]
											}
										}/}

										{section {		
											id : 'to_Field_mlcity'+z,
											macro : {
												name : 'createMultiCityToField',
												args : [z]	
											}
										}/}
									</span>

									{call createDatePicker(siteParameters, rqstParams, 'day_mlcity'+z, 'Day_mlcity'+z, labels.tx_merci_text_booking_cal_departue, 'month_mlcity'+z, 'Month_mlcity'+z, months, monthsValue,'datePickSearch'+z, false, null, null)/}
									
									<div class="mladdatag">
										<a class="mlremFlight" id=${"mlremFlight"+z}>${labels.tx_merci_removeFlight}</a>
										<a class="mladdFlight" id=${"mladdFlight"+z}>${labels.tx_merci_addFlight}</a>
									</div> 
								</section>
								{/for}
							</div>
						</div>
					</div>
					{/if}
				<!-- Multicity -->

							<!-- CHECKBOX FOR DATE RANGE START -->
							<input type="hidden" name="ARRANGE_BY" value="N" />
							{if siteParameters.dateRangeChkbox != null &&  siteParameters.dateRangeChkbox.toLowerCase() == 'false' && (siteParameters.pricingType != null && siteParameters.pricingType.toLowerCase() == 'city')}
								<input type="hidden" id="SEARCHTOAVAIL_PAGE" name="SEARCHTOAVAIL_PAGE" value="true"/>
							{/if}
							{if (siteParameters.dateRangeChkbox == 'TRUE' && siteParameters.flexDispChk == 'TRUE' && siteParameters.sitePricing !== 'TRUE')}
								<p class="flexible">
									{var dateRangeValue = this._getDateRangeDefaultValue()/}
									<input id="DATE_RANGE_VALUE_1" name="DATE_RANGE_VALUE_FLEX" type="checkbox"
										// PTR - 07614496 Starts
										{if dateRangeValue != null && dateRangeValue == 'true' || siteParameters.defaultcheckDateRange.toLowerCase() == 'true'}
											checked = "checked"
										{/if}
										// PTR - 07614496 End
									/>
									<label for="DATE_RANGE_VALUE_1">${labels.tx_merci_text_booking_srch_flexibledate} (${labels.tx_merci_text_booking_srch_flexible_symbol} ${siteParameters.dateRangeChkboxValue} ${labels.tx_merci_text_booking_srch_flexibledays})</label>
								</p>

								{if siteParameters.defaultcheckDateRange != null && siteParameters.defaultcheckDateRange.toLowerCase() == 'true'}
									{if siteParameters.pricingType != null && siteParameters.pricingType.toLowerCase() == 'city'}
										<input type="hidden" id="SEARCHTOAVAIL_PAGE" name="SEARCHTOAVAIL_PAGE" value="false"/>
									{/if}
								{else/}
									{if siteParameters.pricingType != null && siteParameters.pricingType.toLowerCase() == 'city'}
										<input type="hidden" id="SEARCHTOAVAIL_PAGE" name="SEARCHTOAVAIL_PAGE" value="true"/>
									{/if}
								{/if}
								<input type="hidden" name="DATE_RANGE_VALUE_2" id="DATE_RANGE_VALUE_2"/>
								<input type="hidden" name="DATE_RANGE_VALUE_1" id="DATE_RANGE_VALUE_SUB"/>
							{/if}
							<!-- CHECKBOX FOR DATE RANGE END -->
							<!-- CABIN CALSS/ FARE FAMILY START -->

								{section {
									id : 'createCFFInput',
									macro : {
										name : 'createFareFamilyInput',
										id : 'createFareFamilyInput'
									}
								}/}

							<!-- CABIN CALSS/ FARE FAMILY END -->
							<!-- PAX TYPE START -->
							{foreach pax in gblLists.paxType}
								{if siteParameters.allowAddPax != null && siteParameters.allowAddPax.toUpperCase() == "FALSE"}
									{if (pax[0] == 'ADT' || pax[0] == 'CHD')}
										<input type="hidden" name="ALLOW_PRIMARY_${pax[0]}" id="ALLOW_PRIMARY_${pax[0]}" value="${pax[1]}"/>
									{/if}
								{else/}
									{if (pax[0] == 'ADT' || pax[0] == 'CHD' || pax[0] == 'YCD' || pax[0] == 'STU' || pax[0] == 'YTH' || pax[0] == 'MIL')}
										<input type="hidden" name="ALLOW_PRIMARY_${pax[0]}" id="ALLOW_PRIMARY_${pax[0]}" value="${pax[1]}"/>
									{/if}
								{/if}
							{/foreach}
							// if site parameter value is not defined then default to 6 [PTR 04471133]
							{if siteParameters.numOfTrav == null || siteParameters.numOfTrav == ''}
								siteParameters.numOfTrav = 6;
							{/if}

							<div class="list pax">
								{if siteParameters.allowAddPax != null && siteParameters.allowAddPax.toUpperCase() == "TRUE"}
									<p>${labels.tx_merci_text_booking_apis_passenger_label}</p>
									/* PTR 07939879: Additional pax Passengers drop down */
									{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.search.MAddPax"
									}/}
									/* {@embed:Placeholder {
										name: "paxType"
									}/} */
								{else/}
									<ul class="input">
										<li class="adult">
											<label for="FIELD_ADT_NUMBER">${labels.tx_merci_text_booking_advs_adults} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_adult_info}){/if}</small></label>

								<select id="FIELD_ADT_NUMBER" name="FIELD_ADT_NUMBER">
								<!-- CR 06774022 Mobile: D&O enhancements START-->
									{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.ADT) && rqstParams.selectedOfferBean.paxRestrictions.ADT.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max>-1}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.ADT.min; i <= rqstParams.selectedOfferBean.paxRestrictions.ADT.max; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.ADT) && rqstParams.selectedOfferBean.paxRestrictions.ADT.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max==-1 /}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.ADT.min; i <= siteParameters.numOfTrav; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.ADT) && rqstParams.selectedOfferBean.paxRestrictions.ADT.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max>0 /}
										{for var i = 1; i <= rqstParams.selectedOfferBean.paxRestrictions.ADT.max; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									{else/}
								<!-- CR 06774022 Mobile: D&O enhancements END-->
										{for var i = 1; i <= siteParameters.numOfTrav; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									 {/if}
								</select>
							</li>
							<li class="child">
								<label for="FIELD_CHD_NUMBER">${labels.tx_merci_text_booking_advs_children} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_child_info}){/if}</small></label>
									<select id="FIELD_CHD_NUMBER" name="FIELD_CHD_NUMBER" {on change {fn:'custompaxselect', args: "child"}/}>
								<!-- CR 06774022 Mobile: D&O enhancements START-->
									{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.CHD) && rqstParams.selectedOfferBean.paxRestrictions.CHD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max>-1}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.CHD.min; i <= rqstParams.selectedOfferBean.paxRestrictions.CHD.max; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.CHD) && rqstParams.selectedOfferBean.paxRestrictions.CHD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max==-1 /}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.CHD.min; i <= siteParameters.numOfTrav; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									  {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.CHD) && rqstParams.selectedOfferBean.paxRestrictions.CHD.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max>-1 /}
											{for var i = 0; i <= rqstParams.selectedOfferBean.paxRestrictions.CHD.max; i++}
												<option value="${i}" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
											{/for}
									  {else/}
								<!-- CR 06774022 Mobile: D&O enhancements END-->
									{for var i = 0; i <= siteParameters.numOfTrav; i++}
										<option value="${i}" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
									{/for}
									{/if}
								</select>
							</li>
							{if siteParameters.allowInfant != null && siteParameters.allowInfant.toLowerCase() == 'true'}
								<li class="infant">
									<label for="FIELD_INFANTS_NUMBER">${labels.tx_merci_text_booking_advs_infants} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_infant_info}){/if}</small></label>
									<select id="FIELD_INFANTS_NUMBER" name="FIELD_INFANTS_NUMBER" {on change {fn:'custompaxselect', args: "infant"}/}>
								<!-- CR 06774022 Mobile: D&O enhancements START-->
									{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.INF) && rqstParams.selectedOfferBean.paxRestrictions.INF.min > -1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max > -1}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.INF.min; i <= rqstParams.selectedOfferBean.paxRestrictions.INF.max; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.INF) && rqstParams.selectedOfferBean.paxRestrictions.INF.min > -1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max == -1 /}
										{for var i = rqstParams.selectedOfferBean.paxRestrictions.INF.min; i <= siteParameters.numOfTrav; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
										{/for}
									{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && !merciFunc.isEmptyObject(rqstParams.selectedOfferBean.paxRestrictions.INF) && rqstParams.selectedOfferBean.paxRestrictions.INF.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max>-1 /}
										 {for var i =0; i <= rqstParams.selectedOfferBean.paxRestrictions.INF.max; i++}
											<option value="${i}" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
										 {/for}
                                    {else/}
								<!-- CR 06774022 Mobile: D&O enhancements END-->
										{for var i = 0; i <= siteParameters.numOfTrav; i++}
												<option value="${i}" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
											{/for}
								   {/if}
									</select>
								</li>
							{/if}
						</ul>
					{/if}
					<!-- PAX TYPE END -->
					{if (siteParameters.dispUnmr == 'TRUE')}
      {var unmrLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('MUNMR_{0}_' + rqstParams.deviceBean.profile + '.html','html')/}
      <p><a href="javascript:void(0);" class="popup-age-rules" {on click {fn: 'openHTML',args: {link: unmrLink}}/}>${labels.tx_merci_text_booking_psg_under_18_years}</a></p>
    {/if}
					<!-- Hidden Elements for Availability START-->
					{var defCabin = rqstParams.dmOut.defaultCabin/}
					{if merciFunc.isEmptyObject(defCabin)}
						{set defCabin = 'E'/}
					{/if}
					<input type="hidden" name="Hours1" value="ANY" />
					<input type="hidden" name="Hours2" value="ANY" />
					<input type="hidden" name="MAX_PAX_VALUE" value="${siteParameters.numOfTrav}"/>
					<input type="hidden" name="MAX_PAX_TYPES_VALUE" value="${siteParameters.numOfTrav}"/>
					<input type="hidden" name="CABIN" value="${defCabin}"/>
					<input type="hidden" name="PLTG_FROMPAGE" value="ADVS"/>
					<input type="hidden" name="REFRESH" value="0" />
					{var pricingType = "FP"/}
					{if (siteParameters.sitePricing == 'TRUE')}
					 {set pricingType = "SD"/}
					{/if}
					<input type="hidden" name="SEVEN_DAY_SEARCH" value="${siteParameters.sevenSearchDay}"/>
					<input type="hidden" id="SEARCH_PAGE" name="SEARCH_PAGE" value="${pricingType}"/>
					<input type="hidden" id="backPricingType" name="backPricingType" value="${pricingType}"/>
					<input type="hidden" name="result" value="json" />
					<input type="hidden" name="radioflowType" value="price"/>
					<input type="hidden" name="CABIN_CLASS_SELECTED" id="CABIN_CLASS_SELECTED" value=""/>
					<input type="hidden" name="OFFICE_ID" id="OFFICE_ID" value="${siteParameters.siteOfficeID}"/>
					{if !merciFunc.isEmptyObject(rqstParams.dmOut.travellerTypeCode)}
						<input type="hidden" name="userLoggedTravellerType" value="${rqstParams.dmOut.travellerTypeCode}"/>
					{/if}
					<input type="hidden" id="bookmarkDBparam" name="bookmarkDBparam" value="BkmrkRvnu=${siteParameters.revnueSite}&BkmrkAwrd=${siteParameters.bookMarkSite}&BkmrkFrdl=${siteParameters.dealsBKMrk}"  />
					<!-- Hidden Elements for Availability END -->
				</div>
			</section>
		</article>
</article>


					{if !merciFunc.isEmptyObject(rqstParams.DWM_FOOTER_CONTENT)}
				          {@html:Template {
					            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
					            data: {
					            	placeholder: rqstParams.DWM_FOOTER_CONTENT,
					            	placeholderType: "dwmFooter"
					            }
				          }/}
					{/if}

					<footer class="buttons footer cust_fbook_srch">
						<button type="button" class="validation back" {on click {fn:'goBack', scope: this.moduleCtrl}/}>${labels.tx_merci_text_back}</button>
						<button type="submit" class="validation">${labels.tx_merci_text_booking_advs_search}</button>
					</footer>
				</form>
				

				{var countrySite = rqstParams.request.COUNTRY_SITE/}
				{if countrySite == null || countrySite == ''}
					{set countrySite = rqstParams.request.SELECTED_COUNTRY_APPS/}
				{/if}

				<div class="dialog native" id="dialog-login" style="display:none">
				<div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
					{if (rqstParams.request.client == null || rqstParams.request.client == '') && siteParameters.siteLoginRedirect != null}
						<form method="POST" action="${siteParameters.siteLoginRedirect}" {id "ffRedeemForm" /} {on submit {fn: 'onDirectLoginSubmit', scope: this, args: {
																	action: siteParameters.siteLoginRedirect
																}}/}>
					{/if}
					<p>${labels.tx_merci_awd_kfredirect}</p>
					<input type="hidden" value="${rqstParams.request.LANGUAGE}" name="LANGUAGE"/>
					<input type="hidden" value="${countrySite}" name="COUNTRY_SITE"/>
					<input type="hidden" value="SEARCH" name="FLOW_PAGE"/>
					{if this.__merciFunc.hasCustomPackage()}
						<input type="hidden" value="json" name="result"/>
					{/if}
					<div class="padFour">
  					<footer class="buttons">
  						<button class="validation active" type="submit">${labels.tx_merci_proceed}</button>
  						<button class="cancel" type="reset" {on click {fn: 'closeAwardsPopup'}/}>${labels.tx_merci_cancel}</button>
  					</footer>
  				</div>
					{if (rqstParams.request.client == null || rqstParams.request.client == '') && siteParameters.siteLoginRedirect != null}
						</form>
					{/if}
				</div>
				<a href="javascript:void(0)" id="keyPadDismiss"></a>
			</section>
		{/if}
	{/macro}


	{macro createMultiCityFromField(args)}
		<!-- multi city -->
		{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
		{call createInput(siteParameters, 'B_LOCATION_MULTI_'+args, 'A_LOCATION_MULTI_'+args, labels.tx_merci_text_booking_advs_from,this.__merciFunc.getStoredItem('B_LOCATION_MULTI_'+args+'_SRCH'),true, this.isAwardsFlowEnabled()) /}
	{/macro}
	{macro createMultiCityToField(args)}
		<!-- multi city -->
		{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
		{call createInput(siteParameters, 'E_LOCATION_MULTI_'+args, 'C_LOCATION_MULTI_'+args, labels.tx_merci_text_booking_advs_to,this.__merciFunc.getStoredItem('E_LOCATION_MULTI_'+args+'_SRCH'),true, this.isAwardsFlowEnabled()) /}
	{/macro}


	{macro createInputFields()}
		{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
		{call createInput(siteParameters, 'B_LOCATION_1', 'A_LOCATION_1', labels.tx_merci_text_booking_advs_from,this.__merciFunc.getStoredItem('B_LOCATION_1_SRCH'),true, this.isAwardsFlowEnabled()) /}
		{section {
			id : 'createDestinationFeild',
			macro : {
				name : 'createDestinationSearchFeild',
				id : 'createDestinationSearchFeild'
			}
		}/}

	{/macro}

	{macro createDestinationSearchFeild()}
		{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
		{call createInput(siteParameters, 'E_LOCATION_1', 'C_LOCATION_1',  labels.tx_merci_text_booking_advs_to, this.__merciFunc.getStoredItem('E_LOCATION_1_SRCH'),false, this.isAwardsFlowEnabled()) /}
	{/macro}

	{macro createInput(siteParameters, inputID, inputIDSec, labelText,inputValue,isFirstInput, isAwardsFlow)}
		{var allowSmrtDropDown = siteParameters.allowSmartDropDown == 'FALSE' && siteParameters.airportListA == 'TRUE' && siteParameters.airportListD == 'TRUE'/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam/}
		{var list = []/}
		{var selectFn=null /}
		{if !isAwardsFlow}
			{set list = this.createAutocompleteSourceAria(isFirstInput) /} // call for Normal Flow
			{if isFirstInput}
				{set selectFn = {fn:"selectFromARIA" , scope: this} /}
			{/if}
		{else/}
			{if !isFirstInput}
				{if this.data.awards!=null}
					{set list = this.data.awards.autocompleteListToField/}   // call awards function for To Field
				{/if}
			{else/}
				{if this.data.awards!=null}
					{set selectFn = {fn:"selectFromARIA" , scope: this} /}
					{set list = this.data.awards.autocompleteListFromField/} // call awards function for From Field
				{/if}
			{/if}
		{/if}

		<div class="location{if allowSmrtDropDown} airportPicker{/if}{if inputID == 'E_LOCATION_1'} destination{/if}">

			{call autocomplete.createAutoComplete({
				name: inputID,
				id: inputID  +"_SRCH",
				type: 'text',
				value: inputValue,
				labelText: labelText,
				source: list,
				autocorrect:"off",
				autocapitalize:"none",
				autocomplete:"off",
				isMandatory: false,
				isAwardsFlow: isAwardsFlow,
				selectFn: selectFn
			})/}

			{if allowSmrtDropDown}
				<button type="button" class="search" {on click {fn:"onAirportSelector",args : {ID : inputID  + "_SRCH"}}/}><span>search</span></button>
			{/if}
		</div>
	{/macro}

	{macro createDatePicker(siteParameters, rqstParams, dayLabel, dayName, dayString, monthLabel, monthName, months, monthsValue, datePickerId, isSecondDp, retDay, retYear)}
		{var depOffset = siteParameters.departureUIOffsetDate/}
		{var retOffset = siteParameters.returnDayRange/}
		{var currOffSetDateMnth = ""/}
		<div class="list date {if isSecondDp == true && rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.tripTypes[0] == 'O'}
		displayNone{/if}" {if isSecondDp == true}id ="retJourney" {if rqstParams.flow != 'DEALS_AND_OFFER_FLOW' && this._radioSelectionValue('oneWay') == 'checked="checked"'}style="display:none"{/if}{/if}>
			<label for="${dayLabel}">${dayString}</label>
			{if siteParameters.showNewDatePicker != "TRUE"}
				<ul class="input">
					<li>
						<label for="${dayLabel}">Day</label>
						{var currDay = ""/}
						{var currYear = ""/}
						{var currOffSetDateMnth = ""/}
						{var currMnth = ""/}
						<select id="${dayLabel}" name="${dayName}" {if isSecondDp == false}{on change {fn:onDateSelection, scope:this, args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{else/}{on change {fn:"onDayMonthChange",args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{/if}>
							{if retDay == null || retYear == null}
								{var currDate = new Date()/}
								{if rqstParams.flow != 'DEALS_AND_OFFER_FLOW'}
									{set currOffSetDate = new Date(currDate.setDate(currDate.getDate() + parseInt(depOffset)))/}
									{set currDay = currOffSetDate.getDate()/}
									{if (currOffSetDate.getMonth().toString().length == 1)}
										{set currOffSetDateMnth = "0"+currOffSetDate.getMonth().toString()/}
									{else/}
										{set currOffSetDateMnth = currOffSetDate.getMonth().toString()/}
									{/if}
									{set currYear = currOffSetDate.getFullYear().toString() + currOffSetDateMnth/}
								{/if}
								{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
									{var strtDate = rqstParams.selectedOfferBean.travelStart.split(" ")/}
									{var dealStrt = new Date(strtDate[0])/}
									{if (dealStrt > currDate)}
										{set currDay = dealStrt.getDate()/}
										{if (dealStrt.getMonth().toString().length == 1)}
											{set dealStrtMnth = "0"+dealStrt.getMonth().toString()/}
										{/if}
										{set currYear = dealStrt.getFullYear().toString()+dealStrtMnth/}
									{else/}
										{set currDay = currDate.getDate()/}
										{if (currDate.getMonth().toString().length == 1)}
											{set currMnth = "0"+currDate.getMonth().toString()/}
										{/if}
										{set currYear = currDate.getFullYear().toString()+currMnth/}
									{/if}
								{/if}
							{else/}
								{set currDay = retDay/}
								{set currYear = retYear/}
							{/if}

							{for var i = 1; i <= 31; i++}
								<option value="${i}" {if this._isDaySelected(dayLabel, currDay, i)}selected=selected{/if}>${i}</option>
							{/for}
						</select>
					</li>
					<li>
						<label for="${monthLabel}">Month/Year</label>
						<select id="${monthLabel}" name="${monthName}" {if isSecondDp == false}{on change {fn:onDateSelection, scope:this, args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{else/}{on change {fn:"onDayMonthChange",args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{/if}>
							{for var i = 0; i < months.length; i++}
									<option value="${monthsValue[i+1]}" {if this._isMonthYearSelected(monthLabel, currYear, monthsValue[i+1])} selected=selected{/if}>${months[i]}</option>
							{/for}
						</select>
						{if isSecondDp == false}
							{set adjustArgs.dep={monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId} /}
						{else/}
							{set adjustArgs.arr={monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId} /}
						{/if}
					</li>
				</ul>
				<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" class="datepicker" id="${datePickerId}"/></a>
			{else/}
				<input type="hidden" class="datepicker" id="${datePickerId}"/>
				<input type="hidden" class="" name="${monthName}" id="${monthLabel}"/>
				<input type="hidden" class="" name="${dayName}" id="${dayLabel}"/>
			{/if}
		</div>
	{/macro}

	{macro createFareFamilyInput(isAwardsFlow)}
			{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam/}
			{var isAwardsFlow = this.isAwardsFlowEnabled() /}
			{if !isAwardsFlow}
				{set listCabinClass = gblLists.cabinClasses /}
			{else/}
				{set listCabinClass = this.data.awards.awardCabinClasses /}
			{/if}
			{set srcRecap = rqstParams.searchRecapBean/}
			{var defaultCFF = ""/}
			{if srcRecap != null}
				{if (srcRecap[0] != null)}
					{set defaultCFF = srcRecap[0].code/}
				{/if}
				{if (srcRecap[0] == null && srcRecap[1] != null)}
					{set defaultCFF = srcRecap[1].code/}
				{/if}
				{if (srcRecap[0] == null && srcRecap[1] == null && srcRecap[2] != null)}
					{set defaultCFF = srcRecap[2].code/}
				{/if}
			{/if}
			<p class="cabin">
				{if (siteParameters.showCabinClass == 'TRUE')}
					{var cabinClassStored = this.__merciFunc.getStoredItem('CABIN_CLASS')/}
					<label for="CABIN_CLASS">${labels.tx_merci_text_booking_srch_cabinclass}</label>
					<select id="CABIN_CLASS" name="CABIN_CLASS">
						{foreach cabinClass in listCabinClass}
							<option value="${cabinClass[0]}"
								{if cabinClassStored != null}
									{if cabinClassStored == cabinClass_index}
										selected
									{/if}
								{else/}
									{if siteParameters.defaultCabinClass == cabinClass[0]}
										selected
									{/if}
								{/if}
							>
								${cabinClass[1]}
							</option>
						{/foreach}
					</select>
					{if (siteParameters.isDWMenabled == 'FALSE')}
						<input type ="hidden" name="COMMERCIAL_FARE_FAMILY_1" value="${defaultCFF}"/>
					{/if}
				{else/}
					{var noOfDD = rqstParams.cffBean.nbCFFsDropDown/}
					{var defAllwdCFF = rqstParams.cffBean.defaultAllowedCFF/}
					<label for="CABIN_CLASS">${labels.tx_merci_text_booking_advs_fareFamily}</label>
					{for var i = 1; i <= noOfDD; i++}
						{if (noOfDD > 1)}
							${i}
						{/if}
						<select name="COMMERCIAL_FARE_FAMILY_${i}" class="widthFull" id="COMMERCIAL_FARE_FAMILY_${i}" >
							{var cffStored = this.__merciFunc.getStoredItem('COMMERCIAL_FARE_FAMILY_' + i)/}
							{for var j = 0; j < defAllwdCFF.length ; j++}
								<option value="${defAllwdCFF[j][0]}"
									{if cffStored != null}
										{if cffStored == defAllwdCFF[j][0]}
											selected
										{/if}
									{else/}
										{if defaultCFF == defAllwdCFF[j][0]}
											selected
										{/if}
									{/if}
									>
									${defAllwdCFF[j][1]}
								</option>
							{/for}
						</select>
						<input type="hidden" name="backCOMMERCIAL_FARE_FAMILY_${i}" value=""/>
					{/for}
				{/if}
			</p>
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

	{macro fareConditions()}
		{if this.fConditionsTpl == true}
			{@html:Template {
				classpath: "modules.view.merci.segments.booking.templates.dealsoffers.MDealFareConditions",
			}/}
		{/if}
	{/macro}
{/Template}