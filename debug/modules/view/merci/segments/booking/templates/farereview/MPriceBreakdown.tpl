{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MPriceBreakdown',
	$dependencies: [
	 'modules.view.merci.common.utils.StringBufferImpl',
	 'modules.view.merci.common.utils.MCommonScript',
	 'modules.view.merci.common.utils.ServiceSelection'
	],
	$hasScript: true
}}

	{var totalAmtNew = 0 /}
	{var bRebookingNew = false /}
	{var finalAmountNew = null /}
	{macro main()}

		// execute macro only if data is properly provided
		{if this.data.labels != null && this.data.siteParams != null && this.data.rqstParams != null}
		{var miniRuleEnabled =  this.data.siteParams.siteMiniRule.toLowerCase() == 'true' && this.data.siteParams.siteMCMiniRule.toLowerCase() == 'true'/}

			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{var fareButtonsEnabled = false /}
		{set fareButtonsEnabled = merciFunc.booleanValue(this.data.siteParams.enableFareButtons) /}
			{var fractionDigits = 0/}
			{if this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1}
				{set fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length/}
			{/if}

			{var bRebooking = false/}
			{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.rebookingStatus)}
				{set bRebooking = this.data.rqstParams.fareBreakdown.rebookingStatus /}
			{/if}
			{var currConv =  false/}
        {if this.data.siteParams.siteEnableConversion.toLowerCase() == 'true' && this.data.currCode!=""  && this.data.exchRate!=""
        && this.data.currCode!=undefined  && this.data.exchRate!=undefined}
            {set currConv = true /}
        {/if}
			{var totalServiceFee = 0/}
			{var totalTravellerTax = 0/}
			{var isAwardsFlow = this.data.siteParams.siteAllowAwards != null && this.data.siteParams.siteAllowAwards.toLowerCase() == 'true' && !merciFunc.isEmptyObject(this.data.rqstParams.awardsFlow)/}

			<!-- price breakdown -->
			<article id="pricePanel" class="panel breakdown price tablet">
				<header>
					<h1>
						{if isAwardsFlow == true}
							${this.data.labels.tx_merci_awards_cost_breakdown}
						{else/}
							${this.data.labels.tx_merci_text_booking_review_pricebreak}
						{/if}
					</h1>
					{if this.data.siteParams.siteShowRestrictedFare != null && this.data.siteParams.siteShowRestrictedFare.toLowerCase() == 'true' && !miniRuleEnabled && !fareButtonsEnabled}
						<a href="javascript:void(0);" class="popup-fare-cond" {on click {fn:'openFareCondition'}/}>${this.data.labels.tx_merci_text_booking_fare_fare_conditions}</a>
					{/if}
					{if this.data.rqstParams.externalPaymentBean != null && this.data.rqstParams.externalPaymentBean.finalPaymentReference != null}
						{var provideConfirmation = new modules.view.merci.common.utils.StringBufferImpl()/}
						{var providerConfirmationArray = new Array()/}

						// creating array of parameters for formatting string
						${providerConfirmationArray.push(this.data.rqstParams.externalPaymentBean.finalPaymentReference)|eat}
						${provideConfirmation.append(this.data.labels.tx_pltg_pattern_ProviderConfirmation)|eat}

						// printing the formatted string
						${provideConfirmation.formatString(providerConfirmationArray)|eat}
					{/if}
				</header>
				<section class="fare-breakdown-panel">
					<table>
						<thead>
							<tr>
								<th colspan="2">${this.data.labels.tx_merci_text_booking_fare_passengers}</th>
								<th>
									{if isAwardsFlow == true}
										${this.data.labels.tx_merci_awards_total_miles}
									{else/}
									   {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
                      ${this.data.labels.tx_merci_air_trans_charges}
									   {else/}
										${this.data.labels.tx_merci_text_booking_fare_total_fare}
										{/if}
									{/if}
								</th>
								<th class="dash"></th>
								{if isAwardsFlow}
                  <th colspan="2">${this.data.labels.tx_merci_text_booking_fare_taxes_and_surcharges}</th>
                {else/}
                {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
                      <th>${this.data.labels.tx_merci_govt_taxes}</th>
                     {else/}
                 <th>${this.data.labels.tx_merci_text_booking_fare_taxes_and_surcharges}</th>
                    {/if}
                 <th>
                  {if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.currencies) && this.data.rqstParams.fareBreakdown.currencies.length > 0}
                    {if currConv}
                       ${this.data.currCode}
                    {else/}
                       ${this.data.rqstParams.fareBreakdown.currencies[0].code}
                    {/if}
                  {else/}
                    &nbsp;
                  {/if}
                </th>
                 {/if}

							</tr>
						</thead>
						<tbody>
            {var totalAirlineTaxPerPnr = 0/}
							{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
								{if pnr != null}
									{foreach travellerType in pnr.travellerTypesInfos}
										<tr>
											{if travellerType != null}

												// calculating total service fee, this will be used when we display service fee in footer
												{if travellerType.travellerTypePrices != null && travellerType.travellerTypePrices.length > 0}
													{set totalServiceFee += travellerType.travellerTypePrices[0].serviceFee/}
													{set totalTravellerTax += travellerType.travellerTypePrices[0].tax/}
												{/if}

												{var traveller = modules.view.merci.common.utils.MCommonScript.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax, 'FALSE')/}
                              {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true) || (this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true && bRebooking != true)}
												<td>${travellerType.number} ${traveller}</td>
												<td class="dash">${this.data.labels.tx_merci_text_booking_fare_cross_symbol}</td>
                              {/if}
												<td>
													{if isAwardsFlow}

														{var milesCost = 0/}
														{if travellerType.travellerPrices.length > 0}
															{set milesCost = travellerType.travellerPrices[0].milesCost/}
														{/if}

														${milesCost}
														{if !bRebooking}
														<input type="hidden" name = "MILES" value = "${milesCost}"/>
														{/if}

													{else/}

														{var priceWithoutTax = 0/}
														{if travellerType.travellerPrices.length > 0}
															{set priceWithoutTax = travellerType.travellerPrices[0].priceWithoutTax/}
															//CR07523694:adding airline taxes to base fare
															{if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
															   {if  travellerType.travellerType.code == 'ADT' && this.data.rqstParams.airlineTaxADT != null && !isNaN(this.data.rqstParams.airlineTaxADT)}
                                     {set priceWithoutTax = Number(this.data.rqstParams.airlineTaxADT) + Number(priceWithoutTax) /}
															   {/if}
                                  {if  travellerType.travellerType.code == 'CHD' && this.data.rqstParams.airlineTaxCHD != null && !isNaN(this.data.rqstParams.airlineTaxCHD)}
                                   {set priceWithoutTax = Number(priceWithoutTax) + Number(this.data.rqstParams.airlineTaxCHD)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'INF' && this.data.rqstParams.airlineTaxINF != null && !isNaN(this.data.rqstParams.airlineTaxINF)}
                                   {set priceWithoutTax = Number(priceWithoutTax)  + Number(this.data.rqstParams.airlineTaxINF)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'STU' && this.data.rqstParams.airlineTaxSTU != null && !isNaN(this.data.rqstParams.airlineTaxSTU)}
                                   {set priceWithoutTax = Number(priceWithoutTax)  + Number(this.data.rqstParams.airlineTaxSTU)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'YCD' && this.data.rqstParams.airlineTaxYCD != null && !isNaN(this.data.rqstParams.airlineTaxYCD)}
                                   {set priceWithoutTax = Number(priceWithoutTax)  + Number(this.data.rqstParams.airlineTaxYCD)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'MIL' && this.data.rqstParams.airlineTaxMIL != null && !isNaN(this.data.rqstParams.airlineTaxMIL)}
                                   {set priceWithoutTax = Number(priceWithoutTax)  + Number(this.data.rqstParams.airlineTaxMIL)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'YTH' && this.data.rqstParams.airlineTaxYTH != null && !isNaN(this.data.rqstParams.airlineTaxYTH)}
                                   {set priceWithoutTax = Number(priceWithoutTax)  + Number(this.data.rqstParams.airlineTaxYTH)/}
                                 {/if}
                                 {if travellerType.number > 1 }
                                 {set totalAirlineTaxPerPnr = (priceWithoutTax * travellerType.number) + totalAirlineTaxPerPnr/}
                                 {else/}
                                 {set totalAirlineTaxPerPnr = totalAirlineTaxPerPnr + priceWithoutTax/}
                                 {/if}
                                {/if}
                                //CR07523694:end
														{/if}
                            {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true) || (this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true && bRebooking != true)}
  														{if currConv}
                                  ${merciFunc.printCurrency(priceWithoutTax*this.data.exchRate, fractionDigits)}
                              {else/}
														${merciFunc.printCurrency(priceWithoutTax, fractionDigits)}
													{/if}
                          {/if}
                          {/if}
												</td>
                        {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true) || (this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true && bRebooking != true)}
												<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
                              {/if}
												{if isAwardsFlow}
													<td colspan="2">

														{var priceWithTax = 0/}
														{if travellerType.travellerPrices.length > 0}
															{set priceWithTax = travellerType.travellerPrices[0].priceWithTax/}
														{/if}
                            {if currConv}
                                ${merciFunc.printCurrency(priceWithTax*this.data.exchRate, fractionDigits)}
                            {else/}
                              ${merciFunc.printCurrency(priceWithTax, fractionDigits)}
                            {/if}
													</td>
												{else/}
													<td>

														{var tax = 0/}
														{if travellerType.travellerPrices.length > 0}
															{set tax = travellerType.travellerPrices[0].tax/}
                              //CR07523694:adding airline taxes to base fare
                              {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
                                 {if  travellerType.travellerType.code == 'ADT' && this.data.rqstParams.airlineTaxADT != null && !isNaN(this.data.rqstParams.airlineTaxADT)}
                                   {set tax = Number(tax) - Number(this.data.rqstParams.airlineTaxADT)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'CHD' && this.data.rqstParams.airlineTaxCHD != null && !isNaN(this.data.rqstParams.airlineTaxCHD)}
                                   {set tax = Number(tax) - Number(this.data.rqstParams.airlineTaxCHD)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'INF' && this.data.rqstParams.airlineTaxINF != null && !isNaN(this.data.rqstParams.airlineTaxINF)}
                                   {set tax = Number(tax) -  Number(this.data.rqstParams.airlineTaxINF)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'STU' && this.data.rqstParams.airlineTaxSTU != null && !isNaN(this.data.rqstParams.airlineTaxSTU)}
                                   {set tax = Number(tax) -  Number(this.data.rqstParams.airlineTaxSTU)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'YCD' && this.data.rqstParams.airlineTaxYCD != null && !isNaN(this.data.rqstParams.airlineTaxYCD)}
                                   {set tax = Number(tax) -  Number(this.data.rqstParams.airlineTaxYCD)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'MIL' && this.data.rqstParams.airlineTaxMIL != null && !isNaN(this.data.rqstParams.airlineTaxMIL)}
                                   {set tax = Number(tax) -  Number(this.data.rqstParams.airlineTaxMIL)/}
                                 {/if}
                                 {if  travellerType.travellerType.code == 'YTH' && this.data.rqstParams.airlineTaxYTH != null && !isNaN(this.data.rqstParams.airlineTaxYTH)}
                                   {set tax = Number(tax) -  Number(this.data.rqstParams.airlineTaxYTH)/}
                                 {/if}
                                {/if}
                                //CR07523694:end
														{/if}
                          {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true) || (this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true && bRebooking != true)}
  														{if currConv}
                                  ${merciFunc.printCurrency(tax*this.data.exchRate, fractionDigits)}
                              {else/}
														${merciFunc.printCurrency(tax, fractionDigits)}
                              {/if}
                             {/if}
													</td>
                           {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true) || (this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true && bRebooking != true)}
													<td>

														{var amount = 0/}
														{if travellerType.travellerTypePrices != null && travellerType.travellerTypePrices.length > 0}
															{set amount = travellerType.travellerTypePrices[0].totalAmount - travellerType.travellerTypePrices[0].serviceFee/}
														{/if}
                              {if currConv}
                                  ${merciFunc.printCurrency(amount*this.data.exchRate, fractionDigits)}
                              {else/}
                                ${merciFunc.printCurrency(amount, fractionDigits)}
                              {/if}
													</td>
                             {/if}
												{/if}
											{/if}
										</tr>
									{/foreach}
								{/if}
							{/foreach}
              {var otherFees = 0/}
              {var otherfeeText = ''/}
							{if bRebooking == true}

								// calculating total price with tax
								{var priceWithTax = null/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].priceWithTax != null}
									{set priceWithTax = this.data.rqstParams.fareBreakdown.tripPrices[0].priceWithTax/}
								{/if}

								// calculating old price
								{if isAwardsFlow == true}
									{var oldPrice = null/}
									{if this.data.rqstParams.bookedTripFareList != null && this.data.rqstParams.bookedTripFareList.length > 0}
										{set oldPrice = this.data.rqstParams.bookedTripFareList[0].miles/}
										{if this.data.rqstParams.bookedTripFareList.length > 1}
											{set oldPrice += this.data.rqstParams.bookedTripFareList[1].miles/}
										{/if}
									{/if}
									{if oldPrice == null}
										{if this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR != null && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR.length > 0 && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE != null && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE.length > 0}
											{set oldPrice = this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE[0].MILES_COST/}
										{/if}
									{/if}
									{var oldTax = null/}
									{if this.data.rqstParams.bookedTripFareList != null && this.data.rqstParams.bookedTripFareList.length > 0}
										{set oldTax = this.data.rqstParams.bookedTripFareList[0].totalAmount/}
										{if this.data.rqstParams.bookedTripFareList.length > 1}
											{set oldTax += this.data.rqstParams.bookedTripFareList[1].totalAmount/}
										{/if}
									{/if}
									{if oldTax == null}
										{if this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR != null && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR.length > 0 && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE != null && this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE.length > 0}
											{set oldTax = this.data.rqstParams.tripPlanBean.tripPlanAir.BOOKED_TRIP.TRIP_FARE.LIST_PNR[0].LIST_PNR_PRICE[0].TOTAL_AMOUNT/}
										{/if}
									{/if}
								{else/}
								{var oldPrice = null/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].oldPrice != null}
									{set oldPrice = this.data.rqstParams.fareBreakdown.tripPrices[0].oldPrice/}
								{/if}
								{if oldPrice == null && this.data.rqstParams.bookedTripFareList != null && this.data.rqstParams.length > 0}
									{set oldPrice = this.data.rqstParams.bookedTripFareList[0].totalAmount/}
									{if this.data.rqstParams.length > 1}
										{set oldPrice += this.data.rqstParams.bookedTripFareList[1].totalAmount/}
									{/if}
								{/if}
								{/if}

								// calculating fare difference
								{if isAwardsFlow == true}
								{var rebookingBalance = null/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceAmount != null}
									{set rebookingBalance = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceAmount/}
								{/if}

									{if oldTax != null && priceWithTax != null}
										{set rebookingBalance = oldTax - priceWithTax/}
									{/if}
									{var rebookingMilesBalance = null/}
									{if this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost != null && oldPrice != null}
										{set rebookingMilesBalance = this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost - oldPrice/}
									{/if}
								{else/}
									{var rebookingBalance = null/}
									{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceAmount != null}
										{set rebookingBalance = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceAmount/}
									{/if}
								{if oldPrice != null && priceWithTax != null}
									{set rebookingBalance = priceWithTax - oldPrice/}
								{/if}
								{/if}
								// calculating rebooking fees
								{var rebookingFee = 0/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee != null}
									{set rebookingFee = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee/}
								{/if}

								<tr>
									<td colspan="2">${this.data.labels.tx_merci_atc_rbk_fare_new_trip}</td>
									{if isAwardsFlow == true}
										<td>${this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost}</td>
										<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
										<td colspan="2">
										    {if currConv}
											${merciFunc.printCurrency(priceWithTax*this.data.exchRate, fractionDigits)}
											{else/}
											${merciFunc.printCurrency(priceWithTax, fractionDigits)}
											{/if}
										</td>
									{else/}
                   {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
                   <td>     {if currConv}
                                ${merciFunc.printCurrency(totalAirlineTaxPerPnr*this.data.exchRate, fractionDigits)}
                            {else/}
                              ${merciFunc.printCurrency(totalAirlineTaxPerPnr, fractionDigits)}
                            {/if}
                   </td>
                  {else/}
									<td>
					          {if currConv}
                        ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].priceWithoutTax, fractionDigits)}
                    {/if}
                   </td>
                  {/if}
									<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
                  {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
                  <td>
                   {if currConv}
                        ${merciFunc.printCurrency((priceWithTax-totalAirlineTaxPerPnr)*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(priceWithTax-totalAirlineTaxPerPnr, fractionDigits)}
                    {/if}
                  </td>
                  {else/}
									<td>
									  {if currConv}
                      ${merciFunc.printCurrency(totalTravellerTax*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(totalTravellerTax, fractionDigits)}
                    {/if}
                   </td>
                  {/if}
									<td>
									  {if currConv}
                      ${merciFunc.printCurrency(priceWithTax*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(priceWithTax, fractionDigits)}
                    {/if}
									</td>
									{/if}
								</tr>
								<tr>
									{if isAwardsFlow == true}
										<td colspan="2">${this.data.labels.tx_merci_atc_rbk_fare_prev_paid}</td>
										<td>
										{if oldPrice!=null}
											${oldPrice}
										{/if}</td>
										<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
										<td colspan="2">
										{if oldTax!=null}
											{if currConv}
												${merciFunc.printCurrency(oldTax*this.data.exchRate, fractionDigits)}
											{else/}
												${merciFunc.printCurrency(oldTax, fractionDigits)}
											{/if}
										{/if}</td>
									{else/}
									<td colspan="5">${this.data.labels.tx_merci_atc_rbk_fare_prev_paid}</td>
                  <td>
                  {if oldPrice!=null}
                   {if currConv}
                      ${merciFunc.printCurrency(oldPrice*this.data.exchRate, fractionDigits)}
                    {else/}
                  ${merciFunc.printCurrency(oldPrice, fractionDigits)}
                    {/if}
                  {/if}</td>
									{/if}
								</tr>
								{if bRebooking==true}
									{var nonRefundableTaxes=0 /}
									{if this.data.rqstParams.bookedTripFareBreakdown && this.data.rqstParams.bookedTripFareBreakdown.tripPrices && this.data.rqstParams.bookedTripFareBreakdown.tripPrices[0].nonRefundableValue}
												{set nonRefundableTaxes=  this.data.rqstParams.bookedTripFareBreakdown.tripPrices[0].nonRefundableValue /}
												{if parseInt(nonRefundableTaxes,10) !=0}
													<tr>
													<td colspan="{if isAwardsFlow == true}2{else/}5{/if}">${this.data.labels.tx_pltg_text_NonRefundableTaxes}</td>
														{if isAwardsFlow == true}
														<td colspan="2">&nbsp;</td>
													{/if}
													<td {if isAwardsFlow == true}colspan="2"{/if}>
														 {if currConv}
										                      ${merciFunc.printCurrency(nonRefundableTaxes*this.data.exchRate, fractionDigits)}
										                    {else/}
										                      ${merciFunc.printCurrency(nonRefundableTaxes, fractionDigits)}
										                    {/if}
														</td>
													</tr>
												{/if}
									{/if}
								{/if}

								<tr>
									{if isAwardsFlow == true}
										<td colspan="2">${this.data.labels.tx_merci_atc_rbk_fare_diff}</td>
										<input type="hidden" name = "MILES_DIFFERENCE" value = "${rebookingMilesBalance}"/>
										{if bRebooking}
											<input type="hidden" name = "MILES" value = "${rebookingMilesBalance}"/>
										{/if}
										<td>${rebookingMilesBalance}</td>
										<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
										<td colspan="2">
											{if currConv}
												${merciFunc.printCurrency(rebookingBalance*this.data.exchRate, fractionDigits)}
											{else/}
												${merciFunc.printCurrency(rebookingBalance, fractionDigits)}
											{/if}
										</td>
									{else/}
									<td colspan="5">${this.data.labels.tx_merci_atc_rbk_fare_diff}</td>
									<td>
									 {if currConv}
                      ${merciFunc.printCurrency(rebookingBalance*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(rebookingBalance, fractionDigits)}
                    {/if}
									</td>
									{/if}
								</tr>
                 {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
								<tr>
									<td colspan="5">${this.data.labels.tx_merci_text_booking_fare_plus_symbol} ${this.data.labels.tx_merci_atc_rbk_rebook_fee}</td>
									<td>
									  {if currConv}
                      ${merciFunc.printCurrency(rebookingFee*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(rebookingFee, fractionDigits)}
                    {/if}
									</td>
								</tr>
                         {else/}
                           {set otherFees =  Number(otherFees) + Number(rebookingFee)/}
                         {set otherfeeText =  otherfeeText + ',' + this.data.labels.tx_merci_atc_rbk_rebook_fee/}
							{/if}

              {/if}

              {if merciFunc.booleanValue(this.data.siteParams.servicesCatalog)}
                {var selection = new modules.view.merci.common.utils.ServiceSelection(this.data.rqstParams.tripPlanBean.air.services.selection) /}

                {foreach category in this.data.rqstParams.serviceCategories}
                  {var services = selection.getServices(category.code, null, null, null, null) /}
                  {if services.length > 0}
                    <tr>
                      /* Seats don't have NUMBER property, so we take the number of seat services */
                      {var nbServices = selection.getTotalProperty(services, 'NUMBER') || services.length /}
                      <td colspan="5">${nbServices} ${category.name}</td>
                      <td>${merciFunc.printCurrency(selection.getTotalPrice(services), fractionDigits)}</td>
                    </tr>
                  {/if}
                {/foreach}

							{elseif this.data.rqstParams.servicesByPaxAndLoc != null && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice != null && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice > 0 /}
							  {var countOfChargSeats=getNumOfChargeableSeats(this.data.rqstParams.allServicesByPax, this.data.rqstParams.listItineraryBean.itineraries)/}
                {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
								  <tr>
									  <td colspan="5">${countOfChargSeats} ${this.data.labels.tx_merci_nwsm_chrg_sts}</td>
									<td>
									  {if currConv}
                      ${this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice*this.data.exchRate}
                    {else/}
                      ${this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice}
                    {/if}
                   </td>
								  </tr>
                {else/}
                  {set otherFees =  Number(otherFees) + Number(this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice)/}
                  {set otherfeeText =  otherfeeText + ',' + this.data.labels.tx_merci_nwsm_chrg_sts/}
                {/if}
							{/if}
							// for displaying OBFEES [START] */
              {if this.data.rqstParams.fareBreakdownLayoutBean.displayObFees == true && this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
								{var obFees = this.data.rqstParams.fareBreakdown.obFees/}
                {if obFees != null && obFees.displayOBFeesDetail != null && obFees.displayOBFeesDetail == true}
									{foreach obFee in obFees.allObFees}
										<tr>
											<td colspan = "5">
												 {var feeName = obFee.name /}
                          {if feeName == null || feeName == ''}
                            {set feeName =  obFee.code /}
                          {/if}
                          //check ob fee code and add label accordingly
                          {if obFee.code != null && obFee.code != '' }
                            {if  obFee.code.charAt(0) == 'T' || obFee.code.charAt(0)=='t'}
                              {set feeName =  this.data.labels.tx_merci_OBTktFee /}
                            {else/}
                                {if  obFee.code.charAt(0) == 'R' || obFee.code.charAt(0)=='r'}
                                  {set feeName =  this.data.labels.tx_merci_OBReservFee /}
                                {else/}
                                  {if  obFee.code.charAt(0) == 'F' || obFee.code.charAt(0)=='f'}
                                    {set feeName =  this.data.labels.tx_merci_creditCardFee /}
                                  {/if}
                                {/if}
                            {/if}
                          {/if}
                          {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
                         ${feeName}
                         {else/}
                         {set otherfeeText =  otherfeeText + ',' + feeName/}
                         {/if}
											</td>
											<td>
                      {var feeVal = 0 /}
                        {if obFees.hasAppliedObFees != null && obFees.hasAppliedObFees == true}
                           {set feeVal =  obFees.totalAppliedObFee.fees[0].value.toFixed(fractionDigits) /}
                            {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
                           ${feeVal}
                             {else/}
                              {set otherFees =  Number(otherFees) + Number(feeVal)/}
                             {/if}
                        {else/}
                           {set feeVal =  obFees.totalAppliedAndRequestedObFee.unsignedFormattedAmount[0] /}
                          {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
                           ${feeVal}
                             {else/}
                             {set otherFees =  Number(otherFees) + Number(feeVal)/}
                         {/if}
												{/if}
											</td>
										</tr>
									{/foreach}
								{/if}
							{/if}
              <input type="hidden" name = "OBFEEVAL" id = "OBFEEVAL"value = "${feeVal}"/>
							// for displaying OBFEES [ END ] */
              {if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
               {set otherFees =  otherFees + totalServiceFee/}
               {if totalServiceFee > 0}
                {set otherfeeText =  otherfeeText + ','+this.data.labels.tx_merci_text_service_fee+')'/}
                {else/}
                {set otherfeeText =  otherfeeText + ')'/}
                {/if}
                 {if otherFees > 0 }
                    {if otherfeeText != '' }
                    {set otherfeeText = '('+otherfeeText.substring(1)/}
		    {/if}
                <tr>
                      <td colspan="2">
                        ${this.data.labels.tx_merci_text_other_fee}
                       <span>${otherfeeText}</span>
                      </td>
                      <td>${merciFunc.printCurrency(otherFees, fractionDigits)}</td>
                      <td class="dash"> </td>
                      <td> </td>
                     <td>${merciFunc.printCurrency(otherFees, fractionDigits)}</td>
                    </tr>
                     {/if}
               {/if}

				{var insAmt = 0/}
				{if this.data.rqstParams.insurancePanelKey != null}
					{set insAmt = this.data.rqstParams.insurancePanelKey.totalAmount /}
				{/if}
							{if !merciFunc.isEmptyObject(insAmt) && insAmt > 0}
                  {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
									<tr>
										<th>${this.data.labels.tx_merci_text_booking_ins_others}</th>
									<th class="dash"> </th>
									<th>${this.data.labels.tx_merci_text_booking_price}</th>
                  <th class="dash"> </th>
									<th>${this.data.labels.tx_merci_text_booking_taxes}</th>
									<th> </th>
									</tr>
									<tr>
										<td>${this.data.labels.tx_merci_text_booking_ins_label}</td>
									<td class="dash"> </td>
									<td>
									 {if currConv}
									    ${merciFunc.printCurrency(insAmt*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(insAmt, fractionDigits)}
                    {/if}
									</td>
									<td class="dash">${this.data.labels.tx_merci_text_booking_fare_plus_symbol}</td>
									<td>0.00</td>
									<td>{if currConv}
                      ${merciFunc.printCurrency(insAmt*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(insAmt, fractionDigits)}
                    {/if}
                   </td>
								</tr>
                {else/}
                           {set otherFees =  Number(otherFees) + Number(insAmt)/}
                         {set otherfeeText =  otherfeeText + ',' + this.data.labels.tx_merci_text_booking_ins_label/}
							{/if}
              {/if}

							{if (merciFunc.isEmptyObject(insAmt) || insAmt < 0) && !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions)}
                {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
								<tr clas="{if this.data.rqstParams.fareBreakdown.listPromotions.length > 0 && this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount != null && this.data.rqstParams.fareBreakdown.listPromotions[0].promoCodeType == 'ZO' && bRebooking == true}displayNone{/if}">
									<td colspan="5">${this.data.labels.tx_sb_text_PromoManagePromotionTab}</td>
									<td>
									 {if currConv}
                      ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount, fractionDigits)}
                    {/if}
									</td>
								</tr>
                {else/}
                  {set otherFees =  Number(otherFees) + Number(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount)/}
                         {set otherfeeText =  otherfeeText + ',' + this.data.labels.tx_sb_text_PromoManagePromotionTab/}
							{/if}
              {/if}
						</tbody>
						{if isAwardsFlow == true && bRebooking == true}
							<tfoot>
								{if rebookingMilesBalance != null && rebookingMilesBalance < 0}
									<tr>
										<td colspan="4">${this.data.labels.tx_merci_atc_rbk_tot_refund}</td>
										<td class='alignleft'>${this.data.labels.tx_merci_miles}</td>
										<td>${rebookingMilesBalance*-1}</td>
									</tr>
									<tr>
										<td colspan="4">${this.data.labels.tx_merci_atc_rbk_tot_pay}</td>
										<td class='alignleft'>
										{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.currencies) && this.data.rqstParams.fareBreakdown.currencies.length > 0}
											{if currConv}
											   ${this.data.currCode}
											{else/}
											   ${this.data.rqstParams.fareBreakdown.currencies[0].code}
											{/if}
										{/if}
										</td>
										<td>
											{if currConv}
												  ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount*this.data.exchRate, fractionDigits)}
											{else/}
												  ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount, fractionDigits)}
											{/if}
										</td>
									</tr>
								{else/}
									{if rebookingMilesBalance != null}
										<tr>
											<td colspan="4">Total to redeem</td>
											<td class='alignleft'>${this.data.labels.tx_merci_miles}</td>
											<td>${rebookingMilesBalance}</td>
										</tr>
										<tr>
											<td colspan="4">${this.data.labels.tx_merci_atc_rbk_tot_pay}</td>
											<td class='alignleft'>
											{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.currencies) && this.data.rqstParams.fareBreakdown.currencies.length > 0}
												{if currConv}
												   ${this.data.currCode}
												{else/}
												   ${this.data.rqstParams.fareBreakdown.currencies[0].code}
												{/if}
											{/if}
											</td>
											<td>
												{if currConv}
													  ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount*this.data.exchRate, fractionDigits)}
												{else/}
													  ${merciFunc.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount, fractionDigits)}
												{/if}
											</td>
										</tr>
									{/if}
								{/if}
							</tfoot>
						{else/}
						<tfoot>
							{if this.data.siteParams.siteShowServiceFee != null && this.data.siteParams.siteShowServiceFee.toLowerCase() == '1'}
                {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
								<tr>
									<td colspan="{if isAwardsFlow == true}2{else/}5{/if}">${this.data.labels.tx_merci_text_booking_total_servicefee}</td>
									{if isAwardsFlow == true}
										<td colspan="2">&nbsp;</td>
									{/if}
									<td {if isAwardsFlow == true}colspan="2"{/if}>
									 {if currConv}
                      ${merciFunc.printCurrency(totalServiceFee*this.data.exchRate, fractionDigits)}
                    {else/}
                      ${merciFunc.printCurrency(totalServiceFee, fractionDigits)}
                    {/if}
									</td>
								<tr/>
								  {/if}
							{/if}
							/*PTR 08447661 [Serious]: ELAL - Markup fee is visible in Price breakdown - START*/
							{var markupFee=0 /}
							{if this.data.rqstParams.fareBreakdown.tripPrices[0].markup && this.data.rqstParams.fareBreakdown.tripPrices[0].markup.amount==true && this.data.rqstParams.fareBreakdown.tripPrices[0].markup.value!=null}
								{set markupFee= this.data.rqstParams.fareBreakdown.tripPrices[0].markup.value /}
							{/if}
							{if this.data.siteParams.siteShowMarkup != null && merciFunc.booleanValue(this.data.siteParams.siteShowMarkup) == true}
				                {if !(this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true)}
												<tr>
													<td colspan="{if isAwardsFlow == true}2{else/}5{/if}">${this.data.labels.tx_pltg_text_AdditionalCharges}</td>
													{if isAwardsFlow == true}
														<td colspan="2">&nbsp;</td>
													{/if}
													<td {if isAwardsFlow == true}colspan="2"{/if}>
													 {if currConv}
				                      ${merciFunc.printCurrency(markupFee*this.data.exchRate, fractionDigits)}
				                    {else/}
				                      ${merciFunc.printCurrency(markupFee, fractionDigits)}
				                    {/if}
									</td>
								<tr/>
								  {/if}
							{/if}
							/*PTR 08447661 [Serious]: ELAL - Markup fee is visible in Price breakdown - END*/
							<tr>
								<td colspan="{if isAwardsFlow == true}2{else/}5{/if}">
									{if (this.data.rqstParams.pageFrom != null && this.data.rqstParams.pageFrom == 'CONF') || bRebooking == false}
										${this.data.labels.tx_merci_text_booking_fare_total_passengers}
										{if (this.data.rqstParams.reply.pnrStatusCode == 'P' && merciFunc.booleanValue(this.data.siteParams.siteTimeToThinkEnbl) && !merciFunc.isEmptyObject(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY) && this.data.fromPage == 'CONF')}
											{var TTTLaterInformation = new this._strBuffer(this.data.labels.tx_merci_to_be_paid)/}
											{var TTTLaterInfoArray = new Array()/}
											${TTTLaterInfoArray.push(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.endDateFormatted)|eat}
											${TTTLaterInformation.formatString(TTTLaterInfoArray)}
										{/if}
									{else/}
										{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount < 0}
											${this.data.labels.tx_merci_atc_rbk_tot_refund}
										{else/}
											${this.data.labels.tx_merci_atc_rbk_tot_pay}
										{/if}
									{/if}
								</td>

								{var totalPrice = 0/}
								{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.tripPrices) && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].totalAmount != null}
									{set totalPrice = this.data.rqstParams.fareBreakdown.tripPrices[0].totalAmount/}
								{/if}
								//CR 07131094: RJ currency conversion at payment on Mobile - start
								{if this.data.siteParams.siteAllowAPC != null
									&& this.data.siteParams.siteAllowAPC.toLowerCase() == 'true'
									&& this.data.rqstParams.fareBreakdown.tripPrices != null
									&& this.data.rqstParams.fareBreakdown.tripPrices.length > 1}
									{var totalPriceinConvertedCurrency = this.data.rqstParams.fareBreakdown.tripPrices[1].totalAmount/}
								{/if}
								{var additionalPrice = 0/}
								{if !merciFunc.isEmptyObject(insAmt) && insAmt > 0}
									{set additionalPrice = insAmt /}
								{elseif !merciFunc.isEmptyObject(this.data.rqstParams.servicesByPaxAndLoc) && !merciFunc.isEmptyObject(this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice) && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice > 0/}
									{set additionalPrice = this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice/}
								{/if}

                				{var finalAmount = null /}
								{if isAwardsFlow == true}
									<td>${this.data.labels.tx_merci_miles}<br/>{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0}${this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost}{/if}</td>
									<td>${this.data.labels.tx_merci_text_booking_purc_and}</td>
									<td colspan="2">
										{if !merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.currencies) && this.data.rqstParams.fareBreakdown.currencies.length > 0}
											{if currConv}
                      							${this.data.currCode}
                    						{else/}
                      							${this.data.rqstParams.fareBreakdown.currencies[0].code}
                    						{/if}
										{/if}<br/>
										{if currConv}
                      						${merciFunc.printCurrency(totalPrice*this.data.exchRate, fractionDigits)}
                   						{else/}
											${merciFunc.printCurrency(totalPrice, fractionDigits)}
											{if this.data.siteParams.siteAllowAPC != null
												&& this.data.siteParams.siteAllowAPC.toLowerCase() == 'true'
												&& this.data.rqstParams.fareBreakdown.currencies != null
												&& this.data.rqstParams.fareBreakdown.currencies.length > 1}
												<p>${this.data.rqstParams.fareBreakdown.currencies[1].code}<br/> ${merciFunc.printCurrency(totalPriceinConvertedCurrency, fractionDigits)}<p/>
											{/if}
                    					{/if}
									</td>
								{else/}
									{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount < 0}
										{set finalAmount = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookBalanceTotalAmount * -1 /}
										{else/}
										{set finalAmount = totalPrice + additionalPrice /}
									{/if}

									//CR 07131094: RJ currency conversion at payment on Mobile - start
								    <td>
								    	{if currConv}
                      						<p>${this.data.currCode}&nbsp;${merciFunc.printCurrency((parseFloat(finalAmount)+parseFloat(this.__getServicesPrices())) * this.data.exchRate, fractionDigits)}</p>
                   						{else/}
                   							<p>${this.data.rqstParams.fareBreakdown.currencies[0].code}&nbsp;${merciFunc.printCurrency((parseFloat(finalAmount)+parseFloat(this.__getServicesPrices())), fractionDigits)}</p>
                   							{if this.data.siteParams.siteAllowAPC != null
												&& this.data.siteParams.siteAllowAPC.toLowerCase() == 'true'
												&& this.data.rqstParams.fareBreakdown.currencies != null
												&& this.data.rqstParams.fareBreakdown.currencies.length > 1}
										  		<p>
										  			${this.data.rqstParams.fareBreakdown.currencies[1].code} ${merciFunc.printCurrency(totalPriceinConvertedCurrency, fractionDigits)}
										  		<p/>
											{/if}
                   						{/if}
								 	</td>
								{/if}
							</tr>
							{if (this.data.rqstParams.reply.pnrStatusCode == 'P' && merciFunc.booleanValue(this.data.siteParams.siteTimeToThinkEnbl) && !merciFunc.isEmptyObject(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY) && this.data.fromPage == 'CONF')}
								{var formattedTTTPrice = merciFunc.printCurrency(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.totalAmount, fractionDigits)/}
								<tr>
									<td colspan="5">${this.data.labels.tx_merci_total_paid}</td>
									<td><p>${formattedTTTPrice} ${this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.currency}</p></td>
								</tr>
							{/if}
						</tfoot>
						{/if}
					</table>
				</section>
				<footer class="morePriceLinks fare-breakdown-panel">
					<p data-aria-hidden="false" id="p1">${this.data.labels.tx_merci_text_booking_FareTaxSurcharge}</p>
					{if !miniRuleEnabled}
						{if fareButtonsEnabled}
							{call showPriceDetailsButton()/}
							{if this.data.siteParams.siteShowRestrictedFare != null && this.data.siteParams.siteShowRestrictedFare.toLowerCase() == 'true'}
							<button type="button" {on tap {fn:'openFareRule',args: {pgTkt: this.data.rqstParams.reply.pageTicket, recLoc: this.data.recLoc, fromPage: this.data.fromPage}}/} class="fare-button">
			              		${this.data.labels.tx_merci_text_booking_fare_minirule}
			            	</button>
				            {/if}
						{else/}
					<a href="javascript:void(0);" class="view-price-details" {on tap {fn:'openPriceDetails'}/}>
						{if this.data.rqstParams.pageFrom == 'CONF'}
							{if this.data.siteParams.siteShowFBLinkReview != null && this.data.siteParams.siteShowFBLinkReview.toLowerCase() == 'true'}
								${this.data.labels.tx_merci_text_booking_fare_view_price_details}
							{/if}
						{else/}
							{if isAwardsFlow == true}
								${this.data.labels.tx_merci_awards_view_cost}
							{else/}
								${this.data.labels.tx_merci_text_booking_fare_view_price_details}
							{/if}
						{/if}
					</a>
						{/if}
					{else/}
            <p style="clear: both;text-align: center;width: 100%;" >

			          	{call showPriceDetailsButton(isAwardsFlow)/}
			          	{if this.data.siteParams.siteShowRestrictedFare != null && this.data.siteParams.siteShowRestrictedFare.toLowerCase() == 'true' && (miniRuleEnabled)}
								<button type="button" {on tap {fn:'openFareRule',args: {pgTkt: this.data.rqstParams.reply.pageTicket, recLoc: this.data.recLoc, fromPage: this.data.fromPage}}/}  class="fare-button">
              ${this.data.labels.tx_merci_text_booking_fare_minirule}
            </button>
          {/if}
          </p>
          {/if}
					{if this.data.siteParams.siteMerciShowBagAllow != null && this.data.siteParams.siteMerciShowBagAllow.toLowerCase() == 'true'}
						{var baggageLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('BAGGAGE_DETAILS_{0}_' + this.data.rqstParams.merciDeviceBean.profile + '.html','html')/}
						<a href="javascript:void(0);" class="bag-charge" {on tap {fn: 'openHTML',args: {link: baggageLink}}/}>${this.data.labels.tx_merci_text_additional_baggage_charge}</a>
					{/if}
				</footer>
			</article>

			<div class="popup facs" style="display: none;">
				{@html:Template {
					classpath: "modules.view.merci.segments.booking.templates.farereview.MFareCondition",
					data: {
						'labels': this.data.labels,
						'siteParams': this.data.siteParams,
						'rqstParams': this.data.rqstParams
					}
				}/}
			</div>

			<div class="popup cost" id="pricePopup" style="display: none;">
				{var totalAmt = 0/}
				{if this.data.rqstParams.insurancePanelKey != null}
					{set totalAmt = this.data.rqstParams.insurancePanelKey.totalAmount/}
				{/if}

				{set totalAmtNew = totalAmt /}
				{set bRebookingNew = bRebooking /}
				{set finalAmountNew = finalAmount /}
				{@html:Template {
					classpath: "modules.view.merci.segments.booking.templates.farereview.MFareBreakdown",
					data: {
						bRebooking: bRebooking,
						labels: this.data.labels,
						siteParams: this.data.siteParams,
						rqstParams: this.data.rqstParams,
						globalList: this.data.globalList,
						finalAmount: finalAmount,
						'currCode':this.data.currCode,
             					'exchRate':this.data.exchRate,
						fromPage: this.data.fromPage,
						insData: {
							amount: totalAmt
						},
						'payLaterElig': this.data.payLaterElig
					}
				}/}
			</div>
		{/if}
	{/macro}

	{macro showPriceDetailsButton(isAwardsFlow)}
		<button type="button" {on tap {fn:'openPriceDetails'}/} class="fare-button">
	        {if this.data.rqstParams.pageFrom == 'CONF'}
	          {if this.data.siteParams.siteShowFBLinkReview != null && this.data.siteParams.siteShowFBLinkReview.toLowerCase() == 'true'}
	            ${this.data.labels.tx_merci_text_booking_fare_view_price_details}
	          {/if}
	        {else/}
	          {if isAwardsFlow == true}
	            ${this.data.labels.tx_merci_awards_view_cost}
	          {else/}
	            ${this.data.labels.tx_merci_text_booking_fare_view_price_details}
	          {/if}
	        {/if}
      	</button>
	{/macro}
{/Template}