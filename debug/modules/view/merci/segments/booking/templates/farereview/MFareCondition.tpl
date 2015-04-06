{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareCondition',
	$dependencies: ['modules.view.merci.common.utils.StringBufferImpl','modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}
	
	{var recLoc = ''/}
	{var pnrTravellerTypesTitle = ''/}
	{var pltgAction = 'MFareConditions.action'/}

	{macro main()}
		
		// execute macro only if data is provided
		{if this.data.labels != null && this.data.rqstParams != null}
			
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
			
			{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.pnrs) && this.data.rqstParams.fareBreakdown.pnrs[0].recLocator != null && this.data.rqstParams.fareBreakdown.pnrs[0].recLocator != ''}
				{set pltgAction = 'MFareNotes.action'/}
			{/if}

			{if merciFunc.isEmptyObject(this.data.rqstParams.isWebFares) || (typeof this.data.rqstParams.isWebFares == "string" && this.data.rqstParams.isWebFares.toLowerCase() == 'false')} 
				{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}

					{if pnr.recLocator != null && pnr.recLocator != ''}
						{set recLoc = pnr.recLocator/}
					{/if}

					{foreach travellerTypeInfo in pnr.travellerTypesInfos}
					  {var key = 'tx_pltg_text_' + travellerTypeInfo.travellerType.code + 'NameAllLowerCasePlural'/}
						{var travellerTypeName = this.data.labels[key]/}

						{var travellerTypeNoName = new modules.view.merci.common.utils.StringBufferImpl()/}
						{var travellerTypeDetails = new Array()/}

						// creating array of parameters for formatting string
						${travellerTypeDetails.push(travellerTypeInfo.number)|eat}
						${travellerTypeDetails.push(travellerTypeName)|eat}
						${travellerTypeNoName.append(this.data.labels.tx_pltg_pattern_travellerTypeNumberOfAndName)|eat}

						{var travellerTypeNumberOfAndName = travellerTypeNoName.formatString(travellerTypeDetails)/}
						{var travellerTypeSeparator = this.data.labels.tx_pltg_text_travellerTypesSeparator/}

						{if travellerTypeInfo_index > 0}
							{set pnrTravellerTypesTitle = pnrTravellerTypesTitle + travellerTypeSeparator/}
						{/if}

						{set pnrTravellerTypesTitle = pnrTravellerTypesTitle + travellerTypeNumberOfAndName/}
					{/foreach}
				{/foreach}
			{/if}

			<article class="panel facs">
				<header>
					<h1>${this.data.labels.tx_merci_text_booking_fare_fare_conditions}</h1>
				</header>
				<div class="accordion" role="tablist" id="accordian1" data-aria-multiselectable="true">
					{var purcURL = '&CATEGORY_1=AL&&CATEGORY_2='/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel1" aria-expanded="false" id="tab1" {on click {fn: 'fetchData', args: {params: purcURL, sectionId: '1'}}/}>${this.data.labels.tx_merci_text_booking_fare_conditions}</h2>
					<section role="tabpanel" data-aria-labeledby="tab1" id="panel1" aria-hidden="true" class="hidden"></section>
					
					{var penalURL = '&CATEGORY_1=PE&&CATEGORY_2=SU'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel2" aria-expanded="false" id="tab2" {on click {fn: 'fetchData', args: {params: penalURL, sectionId: '2'}}/}>${this.data.labels.tx_pltg_text_PenatliesAndSurchargesLink}</h2>
					<section role="tabpane2" data-aria-labeledby="tab2" id="panel2" aria-hidden="true" class="hidden"></section>
					
					{var addPurcURL = '&CATEGORY_1=AP&&CATEGORY_2=TE'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel3" aria-expanded="false" id="tab3" {on click {fn: 'fetchData', args: {params: addPurcURL, sectionId: '3'}}/}>${this.data.labels.tx_pltg_text_AdditionalPurchaseRestrictionsLink}</h2>
					<section role="tabpane3" data-aria-labeledby="tab3" id="panel3" aria-hidden="true" class="hidden"></section>
					
					{var volChangeURL = '&CATEGORY_1=VC&&CATEGORY_2='/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel4" aria-expanded="false" id="tab4" {on click {fn: 'fetchData', args: {params: volChangeURL, sectionId: '4'}}/}>${this.data.labels.tx_pltg_text_VoluntaryChangesLink}</h2>
					<section role="tabpane4" data-aria-labeledby="tab4" id="panel4" aria-hidden="true" class="hidden"></section>
					
					{var stopURL = '&CATEGORY_1=SO&&CATEGORY_2=TF'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel5" aria-expanded="false" id="tab5" {on click {fn: 'fetchData', args: {params: stopURL, sectionId: '5'}}/}>${this.data.labels.tx_pltg_text_StopoversAndTransfersLink}</h2>
					<section role="tabpane5" data-aria-labeledby="tab5" id="panel5" aria-hidden="true" class="hidden"></section>
					
					{var maxMinURL = '&CATEGORY_1=MN&&CATEGORY_2=MX'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel6" aria-expanded="false" id="tab6" {on click {fn: 'fetchData', args: {params: maxMinURL, sectionId: '6'}}/}>${this.data.labels.tx_pltg_text_MinimumAndMaximumLink}</h2>
					<section role="tabpane6" data-aria-labeledby="tab6" id="panel6" aria-hidden="true" class="hidden"></section>
					
					{var eligFlightURL = '&CATEGORY_1=EL&&CATEGORY_2=FL'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel7" aria-expanded="false" id="tab7" {on click {fn: 'fetchData', args: {params: eligFlightURL, sectionId: '7'}}/}>${this.data.labels.tx_pltg_text_EligibilityAndFlightApplicationLink}</h2>
					<section role="tabpane7" data-aria-labeledby="tab7" id="panel7" aria-hidden="true" class="hidden"></section>
					
					{var blackSeasonURL = '&CATEGORY_1=BO&&CATEGORY_2=SE'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel8" aria-expanded="false" id="tab8" {on click {fn: 'fetchData', args: {params: blackSeasonURL, sectionId: '8'}}/}>${this.data.labels.tx_pltg_text_BlackoutAndSeasonalityLink}</h2>
					<section role="tabpane8" data-aria-labeledby="tab8" id="panel8" aria-hidden="true" class="hidden"></section>
					
					{var dateTimeURL = '&CATEGORY_1=DA&&CATEGORY_2=SR'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel9" aria-expanded="false" id="tab9" {on click {fn: 'fetchData', args: {params: dateTimeURL, sectionId: '9'}}/}>${this.data.labels.tx_pltg_text_DayTtimeAndSalesRestrictionsLink}</h2>
					<section role="tabpane9" data-aria-labeledby="tab9" id="panel9" aria-hidden="true" class="hidden"></section>
					
					{var travMiscURL = '&CATEGORY_1=TR&&CATEGORY_2=MD'/}
					<h2 tabindex="0" role="tab" data-aria-controls="panel10" aria-expanded="false" id="tab10" {on click {fn: 'fetchData', args: {params: travMiscURL, sectionId: '10'}}/}>${this.data.labels.tx_pltg_text_TravelRestrictionsAndMiscellaneousLink}</h2>
					<section role="tabpanel0" data-aria-labeledby="tab10" id="panel10" aria-hidden="true" class="hidden"></section>
				</div>
			</article>
			<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
		{/if}
	{/macro}
{/Template}