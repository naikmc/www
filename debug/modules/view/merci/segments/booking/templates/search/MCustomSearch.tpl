{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MCustomSearch',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib',		
		common: 'modules.view.merci.common.utils.MerciCommonLib'	
	},
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

	{var printUI = false/}

	{macro main()}
		{section {
			id: 'customSearchPage',
			macro: 'loadContent'
		}/}
	{/macro}

	{macro loadContent()}
		{if printUI == true}
			/* {var labels = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MCSMSRCH_A.requestParam/} */
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}

			{var months = []/}
			{if !merciFunc.isEmptyObject(rqstParams.fullMonthList)}
				{set months = rqstParams.fullMonthList.split(",")/}
			{/if}

			{var monthsValue = []/}
			{if !merciFunc.isEmptyObject(rqstParams.fullMonthListValue)}
				{set monthsValue = rqstParams.fullMonthListValue.split(",")/}
			{/if}

			/* Header breadcrumbs */
			<section class="search cust_sbook_srch">
				<form id="searchForm" name="searchForm">
					
					{call common.showBreadcrumbs(1)/}

					/* Display warning for websites with US flights only */
					{if siteParameters.mktMsgDisp == "TRUE"}
					   {call message.showInfo({list: [{TEXT:errorStrings[2131000].localizedMessage}], title: labels.tx_merci_warning_text})/}
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
						{var paymentType = "CC"/}
						{if !merciFunc.isEmptyObject(rqstParams.request.PAYMENT_TYPE)}
							{set paymentType = rqstParams.request.PAYMENT_TYPE/}
						{/if}

						{var phoneType = rqstParams.CONTACT_POINT_PHONE_TYPE/}
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
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1" value="${rqstParams.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_LASTNAME_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1)}
							<input type="hidden" name="PREF_AIR_FREQ_OWNER_TITLE_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1}"/>
						{/if}
					{/if}

					{if !merciFunc.isEmptyObject(rqstParams.request.client)}
						<input type="hidden" name="client" value="${rqstParams.request.client}"/>
					{/if}

					<input type="hidden" name="page" value="1-AirSearch"/>
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

					<!-- KF Redemption OnOff switch START -->
					{if siteParameters.allowMCAwards == 'TRUE' && !this._isDealsFlow() && (rqstParams.enableDirectLogin == 'YES' || siteParameters.allowGuestAward == 'TRUE')}
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
					<!-- KF Redemption OnOff switch END -->

					{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
						<div id="offerContent"></div>
						<a class="navigation fare-cond" href="javascript:void(0);" {on click {fn:"onFareCondClick"} /}>${labels.tx_merci_text_booking_fare_fare_conditions}</a>
					{/if}

					<article class="panel sear">
						<section>
							<!-- Departure and Arrival location select START -->
							{if rqstParams.flow != 'DEALS_AND_OFFER_FLOW'}
								{call createInput(siteParameters, 'B_LOCATION_1', 'A_LOCATION_1', labels.tx_merci_text_booking_advs_from, this.__merciFunc.getStoredItem('B_LOCATION_1'))/}
								{call createInput(siteParameters, 'E_LOCATION_1', 'C_LOCATION_1', labels.tx_merci_text_booking_advs_to, this.__merciFunc.getStoredItem('E_LOCATION_1'))/}
								{if (siteParameters.allowRoundTrip == 'TRUE')}
									<div class="list type">
										<label for="lil">Trip Type</label>
										<ul class="input radioButtons">
											<li>
												<input name="trip-type" id="roundTrip" type="radio" ${this._radioSelectionValue('roundTrip')} {on click {fn:toggleReturnJourney}/}/>
												<label for="roundTrip">${labels.tx_merci_text_booking_srch_roundtrip}</label>
											</li>
											<li>
												<input name="trip-type" id="oneWay" type="radio" ${this._radioSelectionValue('oneWay')} {on click {fn:toggleReturnJourney}/}/>
												<label for="oneWay">${labels.tx_merci_text_booking_srch_oneway}</label>
											</li>
										</ul>
									</div>
								{/if}
							{/if}
							<!-- Departure and Arrival location select END -->

							/* Departure Date Calendar */
							{call createDatePicker(siteParameters, rqstParams, 'day1', 'Day1', labels.tx_merci_text_booking_cal_departue, 'month1', 'Month1', months, monthsValue,'datePickF', false, null, null)/}

							{var retDay = ""/}
							{var retYear = ""/}
							{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW'}
								{var retDate = rqstParams.selectedOfferBean.travelEnd.split(" ")/}
								{var retDateSplit = retDate[0].split('-')/}
								{var dealEnd = new Date(retDateSplit[0] + '/' + retDateSplit[1] + '/' + retDateSplit[2])/}
								{set retDay = dealEnd.getDate()/}
								{var dealEndMnth = dealEnd.getMonth().toString()/}
								{if (dealEnd.getMonth().toString().length == 1)}
									{set dealEndMnth = "0"+dealEndMnth/}
								{/if}
								{set retYear = dealEnd.getFullYear().toString() + dealEndMnth/}
							{/if}

							/* Arrival Date Calendar */
							{call createDatePicker(siteParameters, rqstParams, 'day2', 'Day2', labels.tx_merci_text_booking_advs_return, 'month2', 'Month2', months, monthsValue, 'datePickT', true, retDay, retYear)/}

							<!-- CHECKBOX FOR DATE RANGE START -->
							<input type="hidden" name="ARRANGE_BY" value="N" />
							{if siteParameters.dateRangeChkbox != null &&  siteParameters.dateRangeChkbox.toLowerCase() == 'false' && (siteParameters.pricingType != null && siteParameters.pricingType.toLowerCase() == 'city')}
								<input type="hidden" id="SEARCHTOAVAIL_PAGE" name="SEARCHTOAVAIL_PAGE" value="true"/>
							{/if}
							{if (siteParameters.dateRangeChkbox == 'TRUE' && siteParameters.flexDispChk == 'TRUE' )}
								<p class="flexible">
									{var dateRangeValue = this._getDateRangeDefaultValue()/}
									<input id="DATE_RANGE_VALUE_1" name="DATE_RANGE_VALUE_FLEX" type="checkbox" value="${dateRangeValue}"
										// PTR - 07614496 Starts
										{if dateRangeValue != null && siteParameters.defaultcheckDateRange.toLowerCase() == 'true'}
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
								<input type="hidden" name="DATE_RANGE_VALUE_2" id="DATE_RANGE_VALUE_2" value=""/>
								<input type="hidden" name="DATE_RANGE_VALUE_1" id="DATE_RANGE_VALUE_SUB" value="" />
							{/if}
							<!-- CHECKBOX FOR DATE RANGE END -->
							<!-- CABIN CALSS/ FARE FAMILY START -->
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
										{foreach cabinClass in gblLists.cabinClasses}
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
									<p>${labels.tx_merci_text_booking_apis_passenger_label}:</p>
									{@embed:Placeholder {
										name: "paxType"
									}/}
								{else/}
									<ul class="input">
										<li class="adult">
											<label for="FIELD_ADT_NUMBER">${labels.tx_merci_text_booking_advs_adults} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_adult_info}){/if}</small></label>
												<select id="FIELD_ADT_NUMBER" name="FIELD_ADT_NUMBER" {on change {fn:'custompaxselect', args: "adult"}/}>
												{for var i = 1; i <= siteParameters.numOfTrav; i++}
													<option value="${i}" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
												{/for}
											</select>
										</li>
										<li class="child">
											<label for="FIELD_CHD_NUMBER">${labels.tx_merci_text_booking_advs_children} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_child_info}){/if}</small></label>
												<select id="FIELD_CHD_NUMBER" name="FIELD_CHD_NUMBER" {on change {fn:'custompaxselect', args: "child"}/}>
												{for var i = 0; i <= siteParameters.numOfTrav; i++}
													<option value="${i}" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
												{/for}
											</select>
										</li>
										{if siteParameters.allowInfant != null && siteParameters.allowInfant.toLowerCase() == 'true'}
											<li class="infant">
												<label for="FIELD_INFANTS_NUMBER">${labels.tx_merci_text_booking_advs_infants} <small>{if siteParameters.showPaxTypeDesc != null && siteParameters.showPaxTypeDesc.toLowerCase() == 'true'}(${labels.tx_merci_text_booking_psg_infant_info}){/if}</small></label>
													<select id="FIELD_INFANTS_NUMBER" name="FIELD_INFANTS_NUMBER" {on change {fn:'custompaxselect', args: "infant"}/}>
														{for var i = 0; i <= siteParameters.numOfTrav; i++}
															<option value="${i}" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
												</select>
											</li>
										{/if}
									</ul>
								{/if}
								<!-- PAX TYPE END -->
								{if (siteParameters.dispUnmr == 'TRUE')}
                  {var unmrLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('MUNMR_{0}_' + rqstParams.deviceBean.profile + '.html','html')/}
                  <p class="cust_sbook_unmr"><a href="javascript:void(0);" class="popup-age-rules" {on click {fn: 'openHTML',args: {link: unmrLink}}/}>${labels.tx_merci_text_booking_psg_under_18_years}</a></p>
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
								<input type="hidden" name="SEVEN_DAY_SEARCH" value="${siteParameters.sevenSearchDay}"/>
								<input type="hidden" id="SEARCH_PAGE" name="SEARCH_PAGE" value="FP"/>
								<input type="hidden" id="backPricingType" name="backPricingType" value="FP"/>
								<input type="hidden" name="result" value="json" />
								<input type="hidden" name="radioflowType" value="price"/>
								<input type="hidden" name="CABIN_CLASS_SELECTED" id="CABIN_CLASS_SELECTED" value=""/>
								{if !merciFunc.isEmptyObject(rqstParams.dmOut.travellerTypeCode)}
									<input type="hidden" name="userLoggedTravellerType" value="${rqstParams.dmOut.travellerTypeCode}"/>
								{/if}
								<input type="hidden" id="bookmarkDBparam" name="bookmarkDBparam" value="BkmrkRvnu=${siteParameters.revnueSite}&BkmrkAwrd=${siteParameters.bookMarkSite}&BkmrkFrdl=${siteParameters.dealsBKMrk}"  />
								<!-- Hidden Elements for Availability END -->
							</div>
						</section>
					</article>
				</form>
				<footer class="buttons cust_fbook_srch">
					<button class="validation back" {on click {fn:'goBack', scope: this.moduleCtrl}/}>${labels.tx_merci_text_back}</button>
					<button type="submit" formaction="" class="validation" {on click {fn:onSearchClick,args : {action: "MAvailabilityFlowDispatcher.action"}}/}>${labels.tx_merci_text_booking_advs_search}</button>
				</footer>

				{var countrySite = rqstParams.request.COUNTRY_SITE/}
				{if countrySite == null || countrySite == ''}
					{set countrySite = rqstParams.request.SELECTED_COUNTRY_APPS/}
				{/if}

				<div class="dialog native" id="dialog-login" style="display:none">
				<div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
					{if (rqstParams.request.client == null || rqstParams.request.client == '') && siteParameters.siteLoginRedirect != null}
						<form action="${siteParameters.siteLoginRedirect}" method="POST">
					{/if}
					<p>${labels.tx_merci_awd_kfredirect}</p>
					<input type="hidden" value="${rqstParams.request.LANGUAGE}" name="LANGUAGE"/>
					<input type="hidden" value="${countrySite}" name="COUNTRY_SITE"/>
					<input type="hidden" value="SEARCH" name="FLOW_PAGE"/>
					<footer class="buttons">
						<button class="validation active" type="submit">${labels.tx_merci_proceed}</button>
						<button class="cancel" type="reset" {on click {fn: 'closeAwardsPopup'}/}>${labels.tx_merci_cancel}</button>
					</footer>
					{if (rqstParams.request.client == null || rqstParams.request.client == '') && siteParameters.siteLoginRedirect != null}
						</form>
					{/if}
				</div>
				<a href="javascript:void(0)" id="keyPadDismiss"></a>
			</section>
		{/if}
	{/macro}

	{macro createInput(siteParameters, inputID, inputIDSec, labelText, inputValue)}
		<p class="location">
			{var allowSmrtDropDown = siteParameters.allowSmartDropDown == 'FALSE' && siteParameters.airportListA == 'TRUE' && siteParameters.airportListD == 'TRUE'/}
			<label for="${inputID}">${labelText}</label>
			<p class="smartDropDwn {if allowSmrtDropDown != true}airportPicker{/if}">
				<input id="${inputID}" name="${inputID}" value="${inputValue}" type="text" autocomplete="off"  autocorrect="off" {on keyup {fn:'showCross', args: {id:inputID}}/}/><span class="delete hidden{if allowSmrtDropDown == false} rightTwo{/if}" {on click {fn: 'clearField', args: {id:inputID}}/} id="del${inputID}"><span class="x">x</span></span>
				{if allowSmrtDropDown == false}
					<button type="button" class="search" {on click {fn:"onAirportSelector",args : {ID : inputID} } /}><span>search</span></button>
				{/if}
			</p>
			{if allowSmrtDropDown == true}
				<p class="smartDropDwn">
					<input id="${inputIDSec}" class="hidden" name="${inputIDSec}" value="" type="text" autocomplete="off" autocorrect="off" {on keyup {fn:'showCross', args: {id:inputIDSec}}/} {on focus {fn:'onInputFocus', args: {id:inputIDSec}}/} {on blur {fn:'onInputBlur', args: {id:inputIDSec}}/}/><span class="delete hidden" {on click {fn: 'clearField', args: {id:inputIDSec}}/} id="del${inputIDSec}"><span class="x">x</span></span>
				</p>
			{/if}
		</p>
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
						<select id="${dayLabel}" name="${dayName}" {if isSecondDp == false}{on change {fn:onDateSelection, scope:this, args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{else/}{on change {fn:"onDayMonthChange",args:{monthdd:monthLabel,daydd:dayLabel,datePick:datePickerId}}/}{/if}>
							{if retDay == null || retYear == null}
								{var currDate = new Date()/}
								{if rqstParams.flow != 'DEALS_AND_OFFER_FLOW'}
									{set currOffSetDate = new Date(currDate.setDate(currDate.getDate() + parseInt(depOffset)))/}
									{set currDay = currOffSetDate.getDate()/}
									{if (currOffSetDate.getMonth().toString().length == 1)}
										{set currOffSetDateMnth = "0"+currOffSetDate.getMonth().toString()/}
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
					</li>
				</ul>
				<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" class="datepicker" id="${datePickerId}"/></a>
			{else/}
				<input type="hidden" class="" id="${datePickerId}"/>
				<input type="hidden" class="" name="${monthName}" id="${monthLabel}"/>
				<input type="hidden" class="" name="${dayName}" id="${dayLabel}"/>
			{/if}
		</div>
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