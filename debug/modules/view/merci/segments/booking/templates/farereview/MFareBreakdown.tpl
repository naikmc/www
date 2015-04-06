{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareBreakdown',
	$hasScript: true
}}

	{macro main()}

		// if data is provided than only execute the macro code
		{if data.siteParams != null && data.labels != null && data.rqstParams != null}

			{var currencies = this.__getCurrencies()/}
      {var currConv =  false/}
        {if this.data.siteParams.siteEnableConversion.toLowerCase() == 'true' && this.data.currCode!=""  && this.data.exchRate!=""}
            {set currConv = true /}
        {/if}
			{var fractionDigits = 0/}
			{if this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1}
				{set fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length/}
			{/if}

			{var bRebooking = false/}
			{if !this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.rebookingStatus)}
				{set bRebooking = this.data.rqstParams.fareBreakdown.rebookingStatus /}
			{/if}

			{var isAwardsFlow = this.data.siteParams.siteAllowAwards != null && this.data.siteParams.siteAllowAwards.toLowerCase() == 'true' && !this.utils.isEmptyObject(this.data.rqstParams.awardsFlow)/}

			{var currencyCode = currencies[0].code/}
			{if currConv}
          {set currencyCode = this.data.currCode/}
       {/if}
			{if isAwardsFlow == true}
				{set currencyCode = this.data.labels.tx_merci_miles/}
			{/if}

			{if this.data.rqstParams.caRegulnEnabled != null && this.data.rqstParams.caRegulnEnabled == true}
				{if !(this.data.isFromServicingFlow=="TRUE")}
					<article class="panel price">
						<header>
						  <hgroup>
							<h1>
							  {if isAwardsFlow == true}
								${this.data.labels.tx_merci_awards_cost_details}
							  {else/}
								${this.data.labels.tx_merci_text_booking_fare_prcdtl_price_dtl}
							  {/if}
							</h1>
						  </hgroup>
						</header>
						{if this.data.rqstParams.fromPage == 'SERVICE'}
							{call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
							<dl>
								{@html:Template {
								  classpath: "modules.view.merci.segments.booking.templates.farereview.MFareBreakdownSeat",
								  data: {
									labels: this.data.labels,
									rqstParams: this.data.rqstParams,
									siteParams: this.data.siteParams,
									globalList: this.data.globalList
								  }
								}/}
							</dl>
						{else/}
							{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
								{foreach travellerType in pnr.travellerTypesInfos}
									{var subtotalPerPax = 0/}
									{var subtotalTaxPerPax = 0/}
									{var traveller1 = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
									{var traveller = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
									<h2 class="paxHeader">${travellerType.number} ${traveller1} ${this.data.labels.tx_merci_text_pax}</h2>
									{call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode)/}
									<dl>
										<dt>
											${this.data.labels.tx_merci_text_total_base_fare}
										</dt>
										<dd >
											{if isAwardsFlow == true}
												${travellerType.travellerPrices[0].milesCost}
											{else/}
											  {if travellerType.fareCalculation.listSurcharges != null}
												  {foreach surcharge in travellerType.fareCalculation.listSurcharges}
													  {if travellerType.fareCalculation.currency == 'NUC'}
														  {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(surcharge.amount * travellerType.fareCalculation.rateOfExchange)/}
													  {else/}
														 {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(surcharge.amount)/}
													  {/if}
												  {/foreach}
											  {/if}
												{var fareWithoutTax = travellerType.travellerPrices[0].priceWithoutTax/}
												{if travellerType.number > 1}
													{set fareWithoutTax = fareWithoutTax * travellerType.number/}
												{/if}
												{set fareWithoutTax = fareWithoutTax - subtotalTaxPerPax/}
												{set subtotalPerPax = subtotalPerPax + fareWithoutTax/}
												${this.utils.printCurrency(fareWithoutTax, fractionDigits)}
											{/if}
										</dd>
              {var airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_ADT/}
                  {if travellerType.travellerType.code == 'CHD'}
                    {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_CHD/}
                  {elseif travellerType.travellerType.code == 'INF'/}
                    {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_INF/}
                  {else/}
                    {if this.data.siteParams.siteAllowPax != null && this.data.siteParams.siteAllowPax.toLowerCase() == 'true'}
                      {if travellerType.travellerType.code == 'YCD'}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YCD/}
                      {elseif travellerType.travellerType.code == 'YTH'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YTH/}
                      {elseif travellerType.travellerType.code == 'STU'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_STU/}
                      {elseif travellerType.travellerType.code == 'MIL'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_MIL/}
                      {/if}
                    {/if}
                     {/if}
                    {if airTravTaxList != null}
                    {foreach tax in airTravTaxList}
                      <dt>
                        {if tax.code != null && tax.code != ''}
                        (${tax.code})
                        {/if}
                        {if tax.description != null && tax.description != ''}
                          ${tax.description}
                        {else/}
                          ${this.data.labels.tx_merci_book_tax_description_unavailable}
                        {/if}
                      </dt>
                      <dd>
                       {if travellerType.number > 1}
                        ${this.utils.printCurrency(tax.value * travellerType.number, fractionDigits)}
                         {set subtotalPerPax = Number(subtotalPerPax) + Number(tax.value * travellerType.number)/}
                       {else/}
                        ${this.utils.printCurrency(tax.value, fractionDigits)}
                         {set subtotalPerPax = Number(subtotalPerPax) + Number(tax.value)/}
                         {/if}
                      </dd>
                    {/foreach}
                  {/if}
                  {var surchargePerPaxType = 0/}
				  {if this.data.siteParams.siteShowSurchargesReview != null && this.data.siteParams.siteShowSurchargesReview.toLowerCase() == 'true' && travellerType.fareCalculation.hasSurcharges == true}
					  {foreach surcharge in travellerType.fareCalculation.listSurcharges}
						<dt>
						  {if surcharge.code != null && surcharge.code != ''}
							(${surcharge.code})
						  {/if}
						  {if surcharge.code != null}
							{if surcharge.code == 'Q'}
							  ${this.data.labels.tx_pltg_text_QsurchargeDescription}
							{elseif surcharge.code == 'S'/}
							  ${this.data.labels.tx_pltg_text_SsurchargeDescription}
							{else/}
							  {var noSurchangeDescription = new this._strBuffer(this.data.labels.tx_pltg_pattern_NoSurchargeDescription)/}
							  {var surchargeCodeArray = new Array()/}
							  // passing param and printing string
							  ${surchargeCodeArray.push(surcharge.code)|eat}
							  ${noSurchangeDescription.formatString(surchargeCodeArray)}
							{/if}
						  {else/}
							{var noSurchangeDescription = new this._strBuffer(this.data.labels.tx_pltg_pattern_NoSurchargeDescription)/}
							{var surchargeCodeArray = new Array()/}
							// passing param and printing string
							${surchargeCodeArray.push(surcharge.code)|eat}
							${noSurchangeDescription.formatString(surchargeCodeArray)}
						  {/if}
						</dt>
						<dd>
						  {if travellerType.fareCalculation.currency == 'NUC'}
							${this.utils.printCurrency((surcharge.amount * travellerType.fareCalculation.rateOfExchange), fractionDigits)}
							  {set surchargePerPaxType = Number(surchargePerPaxType) + Number(surcharge.amount * travellerType.fareCalculation.rateOfExchange)/}
						  {else/}
							${this.utils.printCurrency(surcharge.amount, fractionDigits)}
							 {set surchargePerPaxType = Number(surchargePerPaxType) + Number(surcharge.amount)/}
						  {/if}
						</dd>
					  {/foreach}
				 {/if}
                  </dl>
                   {if this.hasAncillaryServices()}
                  {call breakdownHeader(this.data.labels.tx_merci_nwsm_services, currencyCode)/}
                  {@html:Template {
                    classpath: "modules.view.merci.segments.booking.templates.farereview.MFareBreakdownSeat",
                    data: {
                      labels: this.data.labels,
                      rqstParams: this.data.rqstParams,
                      siteParams: this.data.siteParams,
                      globalList: this.data.globalList
                  }
                }/}
                {/if}
                {set subtotalPerPax = Number(subtotalPerPax) + Number(surchargePerPaxType)/}
                <dl>
                     <dt class="headerRow">
                         <strong>${this.data.labels.tx_merci_subtotal_for_text} ${travellerType.number} ${traveller1}</strong></dt>
                         <dd class="headerRow"><strong>${this.utils.printCurrency(subtotalPerPax, fractionDigits)}</strong></dd>
                  </dl>
                 {call breakdownHeader(this.data.labels.tx_merci_govt_taxes_header, currencyCode)/}
                 <dl>
                 {var subtotalTaxPerPax = 0/}
                  {var govtTaxList = this.data.rqstParams.govtTax.govtTaxList_ADT/}
                  {if travellerType.travellerType.code == 'CHD'}
                    {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_CHD/}
                  {elseif travellerType.travellerType.code == 'INF'/}
                    {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_INF/}
                  {else/}
                    {if this.data.siteParams.siteAllowPax != null && this.data.siteParams.siteAllowPax.toLowerCase() == 'true'}
                      {if travellerType.travellerType.code == 'YCD'}
                        {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_YCD/}
                      {elseif travellerType.travellerType.code == 'YTH'/}
                        {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_YTH/}
                      {elseif travellerType.travellerType.code == 'STU'/}
                        {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_STU/}
                      {elseif travellerType.travellerType.code == 'MIL'/}
                        {set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_MIL/}
                      {/if}
                    {/if}
                  {/if}
                   {if this.data.siteParams.siteTaxSplit != null && this.data.siteParams.siteTaxSplit.toLowerCase() == 'true'}
                   <dt class="headerRow">${this.data.labels.tx_pltg_text_header_other_fees}</dt>
                  <dd class="headerRow"></dd>
                  {/if}
                  {if govtTaxList != null}
                    {foreach tax in govtTaxList}
						  {if tax.taxStatus != null}
                      <dt>
                        {if tax.code != null && tax.code != ''}
                         (${tax.code})
                        {/if}
                        {if tax.description != null && tax.description != ''}
                          ${tax.description}
                        {else/}
                          ${this.data.labels.tx_merci_book_tax_description_unavailable}
                        {/if}
                      </dt>
                      <dd>
                        {if travellerType.number > 1}
                        ${this.utils.printCurrency(tax.value * travellerType.number, fractionDigits)}
                         {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(tax.value * travellerType.number)/}
                       {else/}
                        ${this.utils.printCurrency(tax.value, fractionDigits)}
                         {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(tax.value)/}
                         {/if}
                      </dd>
						  {/if}
                    {/foreach}
                   {/if}
                    <dt><strong>${this.data.labels.tx_merci_subtotal_for_text} ${travellerType.number} ${traveller1}</strong></dt>
                         <dd><strong>${this.utils.printCurrency(subtotalTaxPerPax, fractionDigits)} </strong></dd>
                     </dl>
				<footer class="total">
				  <dl>
				  <dt class="footerRow"><strong>${this.data.labels.tx_merci_text_booking_fare_prcdtl_total_for} ${travellerType.number} ${traveller1}</strong></dt>
					<dd>
					  <strong>
						{if isAwardsFlow == true}
						  ${this.utils.printCurrency(travellerType.travellerPrices[0].priceWithTax, fractionDigits)}
						{else/}
						  ${this.utils.printCurrency(subtotalTaxPerPax+subtotalPerPax, fractionDigits)}
						{/if}
					  </strong>
					</dd>
					</dl>
				</footer>
            {/foreach}
          {/foreach}
          {var pnrChargesAvailable = false/}
              {var pnrCharges = 0/}
          {if this.utils.booleanValue(this.data.siteParams.siteInsuranceEnabled)}
              <h2 class="paxHeader">${this.data.labels.tx_merci_text_all_passengers}</h2>
              {call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
               {set pnrChargesAvailable = true/}
            {section {
              type: 'div',
              macro: {name: 'insBreakdown', args: [currencyCode, currConv], scope: this},
              bindRefreshTo: [{inside: this.data.insData, to: 'amount'}]
            }/}
            {if this.data.insData.amount != null && !isNaN(this.data.insData.amount)}
              {set pnrCharges = Number(pnrCharges) + Number(this.data.insData.amount)/}
            {/if}
          {/if}
          {if this.data.siteParams.siteShowServiceFee != null && this.data.siteParams.siteShowServiceFee.toLowerCase() == '1'}
          {if pnrChargesAvailable !=true}
           <h2 class="paxHeader">${this.data.labels.tx_merci_text_all_passengers}</h2>
          {call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
            {set pnrChargesAvailable = true/}
            {/if}
			  {var totalServiceFee = 0/}
			  {foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
				{if pnr != null}
					{foreach travellerType in pnr.travellerTypesInfos}
						{if travellerType != null}
							// calculating total service fee, this will be used when we display service fee in footer
							{if travellerType.travellerTypePrices != null && travellerType.travellerTypePrices.length > 0}
								{set totalServiceFee += travellerType.travellerTypePrices[0].serviceFee/}
							{/if}
						{/if}
					{/foreach}
				{/if}
			  {/foreach}
          <dl>
              <dt >
                ${this.data.labels.tx_merci_text_service_fee}
              </dt>
              <dd >
					${this.utils.printCurrency(totalServiceFee, fractionDigits)}
              </dd>
           </dl>
          {/if}
          {var styleCondition = !this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions) && this.data.rqstParams.fareBreakdown.listPromotions[0].promoCodeType == 'ZO' && bRebooking == false && this.data.rqstParams.pageFrom == 'CONF'/}
          {var emptyPromotionTotalAmount = this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions) || this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount) || this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount == ''/}
          {var promoDisplayCondition = emptyPromotionTotalAmount == true || styleCondition == true/}
           {if promoDisplayCondition != true && pnrChargesAvailable !=true}
           <h2 class="paxHeader">${this.data.labels.tx_merci_text_all_passengers}</h2>
              {call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
                {set pnrChargesAvailable = true/}
            {/if}
          <dl class="{if promoDisplayCondition == true}hidden{/if}" id='dlPromo'>
            {var formatTotalPrice = ''/}
            {if this.data.rqstParams.fareBreakdown.listPromotions != null && this.data.rqstParams.fareBreakdown.listPromotions[0] != null && this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount != null}
              {var formattedPrice = this.utils.printCurrency(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount, fractionDigits)/}
             {if !isNaN(formattedPrice)}
              {set pnrCharges = Number(pnrCharges) + Number(formattedPrice)/}
              {/if}
            {/if}
            <dt > ${this.data.labels.tx_sb_text_PromoManagePromotionTab}</dt>
            <dd id='fareBrkdwnPromoPrice'>${formattedPrice}</dd>
          </dl>
            // for displaying OBFEES [START]
          {var obFees = this.data.rqstParams.fareBreakdown.obFees/}
          {var obfee = 0 /}
          {if obFees != null && obFees.displayOBFeesDetail != null && obFees.displayOBFeesDetail == true && this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
            {if pnrChargesAvailable !=true}
             <h2 class="paxHeader">${this.data.labels.tx_merci_text_all_passengers}</h2>
              {call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
                {set pnrChargesAvailable = true/}
            {/if}
            {foreach obFee in obFees.allObFees}
              {var feeName = obFee.name /}
              {if feeName == null || feeName == ''}
                {set feeName = obFee.code /}
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
              <dl>
               <dt>${feeName}</dt>
               <dd>
                  {if obFees.hasAppliedObFees != null && obFees.hasAppliedObFees == true}
                    {set obfee = obFees.totalAppliedObFee.fees[0].value.toFixed(fractionDigits)/}
                    ${obfee}
                     {if !isNaN(obfee)}
                     {set pnrCharges = Number(pnrCharges) + Number(obfee)/}
                     {/if}
                  {else/}
                   {set obfee = obFees.totalAppliedAndRequestedObFee.unsignedFormattedAmount[0] /}
                    ${obfee}
                     {if !isNaN(obfee)}
                     {set pnrCharges = Number(pnrCharges) + Number(obfee)/}
                     {/if}
                  {/if}
               </dd>
              </dl>
            {/foreach}
            {/if}
            {if this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
            <dl id="CREDIT_CARD_FEE" class="hidden">
                <dt></dt>
                <dd></dd>
             </dl>
          <dl id="CC-FEE-DISP" class="hidden">
             <dt id="ccField">${this.data.labels.tx_merci_creditCardFee}</dt>
             <dd id="ccFee"></dd>
          </dl>
          {/if}
		  // for displaying OBFEES [END]
          {if bRebooking == true}
          {var rebookFee = 0/}
                {if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee != null}
                  {set rebookFee = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee/}
                  {if !isNaN(rebookFee)}
                  {if pnrChargesAvailable !=true}
             <h2 class="paxHeader">${this.data.labels.tx_merci_text_all_passengers}</h2>
              {call breakdownHeader(this.data.labels.tx_merci_air_trans_charges_header, currencyCode) /}
              {set pnrChargesAvailable = true/}
              <dl>
                 <dt>
                         ${this.data.labels.tx_merci_atc_rbk_rebook_fee}</strong></dt>
                         <dd>${this.utils.printCurrency(rebookFee, fractionDigits)}</dd>
                         </dl>
                         {set pnrCharges = Number(pnrCharges) + Number(rebookFee)/}
            {/if}
                     {/if}
                {/if}
               {/if}

                {if pnrCharges > 0 }
                 <dl>
					<dt><strong>${this.data.labels.tx_merci_subtotal_all_passeneger}</strong></dt>
                         <dd><strong>${this.utils.printCurrency(pnrCharges, fractionDigits)} </strong></dd>
                         </dl>
                         {/if}
        {if modules.view.merci.common.utils.URLManager.getBaseParams()[12]=="IS"}                    
		  {var totalPrice = this.getTotalPrice() || this.data.finalAmount /}		  
        {else/}
          {var totalPrice = this.data.finalAmount || this.getTotalPrice() /}
        {/if}
		  {set totalPrice = totalPrice.toString().replace(/\,/g,'')/}
                  {set totalPrice = parseFloat(totalPrice)/}
          	  {set totalPrice = parseFloat(totalPrice)+parseFloat(this.__getServicesPrice())/}
                  {if this.utils.booleanValue(this.data.siteParams.servicesCatalog) && this.data.rqstParams.param.FROM_PAGE=="SERVICES" && this.data.rqstParams.param.ACTION == 'MODIFY'}
                    {set servicePriceTotal = this.data.rqstParams.servicesSelection.totalPrice/}
                    {if servicePriceTotal && !isNaN(servicePriceTotal.balancedAmount)}
                      {set totalPrice = servicePriceTotal.balancedAmount/}
                    {/if}}
                  {/if}
                  {set totalPrice = this.utils.printCurrency(totalPrice, fractionDigits) /}

          <footer class="total {if isAwardsFlow == true}miles{/if}">
	  //=====================================================================================================================

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

									{if rebookingBalance == null && oldTax != null && priceWithTax != null}
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
									{if rebookingBalance == null && oldPrice != null && priceWithTax != null}
										{set rebookingBalance = oldPrice - priceWithTax/}
									{/if}
								{/if}
								// calculating rebooking fees
								{var rebookingFee = 0/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee != null}
									{set rebookingFee = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee/}
									{set rebookingBalance += rebookingFee/}
								{/if}
							{/if}




	//============================================================================================================================





	  {if bRebooking == true}
		<dl>
			<dt>
				<strong>
					${this.data.labels.tx_merci_atc_rbk_fare_new_trip}
				</strong>
			</dt>
			<dd>
				<strong>
					
				</strong>
				{if isAwardsFlow == true}
					<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
                {/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].subTotal, fractionDigits)}</strong>
                </span>										
			</dd>
		</dl>
		<dl>
			<dt>
				<strong>
					${this.data.labels.tx_merci_atc_rbk_fare_prev_paid}
				</strong>
			</dt>
			<dd>
				{if isAwardsFlow == true}
					
					<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${oldPrice}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
                {/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].oldPrice, fractionDigits)}</strong>
                </span>
			</dd>
		</dl>
	     {/if}
            <dl>
              <dt>
                <strong>
			{if isAwardsFlow == true}
				{if rebookingMilesBalance != null && rebookingMilesBalance < 0 }
					${this.data.labels.tx_merci_atc_rbk_tot_refund}
				{else/}
					${this.data.labels.tx_merci_text_booking_fare_total_passengers}
				{/if}
			{else/}
				{if rebookingBalance != null && rebookingBalance < 0 }
					${this.data.labels.tx_merci_atc_rbk_tot_refund}
				{else/}
					 ${this.data.labels.tx_merci_text_booking_fare_total_passengers}
				{/if}

			{/if}
			{if styleCondition == true && isAwardsFlow != true}*{/if}
		</strong>
              </dt>
              <dd>
	      {if bRebooking == true}
		{if isAwardsFlow == true}
			<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${rebookingMilesBalance}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
		{/if}
		{/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
				{if bRebooking == true}
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(rebookingBalance, fractionDigits)}</strong>
				{else/}
					<strong id="fareBrkTotalPrice">${totalPrice}</strong>
				{/if}
		</span>
		
              </dd>
              
			  {if (this.data.payLaterElig != null && this.data.payLaterElig.timeToThinkEnbl == 'TRUE')}
				<div id="TTTPriceBrkDown" class="displayNone">
					  <dt>
						<strong>
							{if this.data.fromPage == 'CONF'}${this.data.labels.tx_merci_total_paid}{else/}${this.data.labels.tx_merci_services_paynow}{/if}
						</strong>
					  </dt>
					  <dd>
						<span class="unit">
							{if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
						</span>
						{var TTTPrice = this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.totalAmount/}
						{if currConv}
							{set TTTPrice = this.utils.printCurrency(TTTPrice * this.data.exchRate, fractionDigits) /}
						{else/}
							{set TTTPrice = this.utils.printCurrency(TTTPrice, fractionDigits) /}
						{/if}
						<span class="data">
						  <strong id="fareBrkTotalPrice">${TTTPrice}</strong>
						</span>
					  </dd>
				</div>
			 {/if}
              <dt {if styleCondition == false}class="hidden"{/if}>${this.data.labels.tx_pltg_text_PromotionIncluded}</dt><dd {if styleCondition == false}class="hidden"{/if}></dd>
            </dl>
          </footer>
        {/if}
      </article>
        {else /}
      <article class="panel price">
        <header>
          <hgroup>
            <h1>
              {if isAwardsFlow == true}
                ${this.data.labels.tx_merci_awards_cost_details}
              {else/}
                ${this.data.labels.tx_merci_text_booking_fare_prcdtl_price_dtl}
              {/if}
            </h1>
          </hgroup>
        </header>
        {if modules.view.merci.common.utils.URLManager.getBaseParams()[12]=="IS"}                    
			{var totalPrice = this.getTotalPrice() || this.data.finalAmount /}
        {else/}
			{var totalPrice = this.data.finalAmount || this.getTotalPrice() /}          
        {/if}		
		{set totalPrice = totalPrice.toString().replace(/\,/g,'')/}
        {set totalPrice = parseFloat(totalPrice)/}
        <footer class="total">
          <dl>
            <dt>
              <strong>
				{if totalPrice < 0 }
					${this.data.labels.tx_merci_atc_rbk_tot_refund}
				{else/}
					${this.data.labels.tx_merci_text_booking_fare_total_passengers}
				{/if}
				{if styleCondition == true && isAwardsFlow != true}*{/if}

			 </strong>
            </dt>
            <dd>
              <span class="unit">${currencyCode}</span>
              <span class="data">
              <strong id="fareBrkTotalPrice">${this.data.finalAmount}</strong>
              </span>
            </dd>
          </dl>
        </footer>
      {/if}
      //changed for CAD end here
       {else/}
      {if !(this.data.isFromServicingFlow=="TRUE")}
			<article class="panel price">
				<header>
					<hgroup>
						<h1>
							{if isAwardsFlow == true}
								${this.data.labels.tx_merci_awards_cost_details}
							{else/}
								${this.data.labels.tx_merci_text_booking_fare_prcdtl_price_dtl}
							{/if}
						</h1>
					</hgroup>
				</header>

				{if this.data.rqstParams.fromPage == 'SERVICE'}
				  {call breakdownHeader(this.data.labels.tx_merci_nwsm_services, currencyCode) /}
					<dl>
						{@html:Template {
							classpath: "modules.view.merci.segments.booking.templates.farereview.MFareBreakdownSeat",
							data: {
								labels: this.data.labels,
								rqstParams: this.data.rqstParams,
								siteParams: this.data.siteParams,
								globalList: this.data.globalList
							}
						}/}
					</dl>
				{else/}

					{if this.utils.booleanValue(this.data.siteParams.siteInsuranceEnabled)}
					  {section {
					    type: 'div',
					    macro: {name: 'insBreakdown', args: [currencyCode, currConv], scope: this},
					    bindRefreshTo: [{inside: this.data.insData, to: 'amount'}]
					  }/}
					{/if}

					{call breakdownHeader(this.data.labels.tx_merci_text_booking_fare_totalfare, currencyCode) /}

					{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
						{foreach travellerType in pnr.travellerTypesInfos}
							{var traveller1 = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
							{var traveller = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
              {var subtotalPerPax = 0/}
              {var subtotalTaxPerPax = 0/}
                <dl>
                <dt><strong>${traveller1} ${this.data.labels.tx_merci_text_booking_apis_passenger_label}</strong></dt><dd></dd>
                  
                    <dt>
                      ${this.data.labels.tx_merci_text_total_base_fare}
                    </dt>
                    <dd >
                      {if isAwardsFlow == true}
                        ${travellerType.travellerPrices[0].milesCost}
                      {else/}
                        {if travellerType.fareCalculation.listSurcharges != null}
                          {foreach surcharge in travellerType.fareCalculation.listSurcharges}
                            {if travellerType.fareCalculation.currency == 'NUC'}
                              {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(surcharge.amount * travellerType.fareCalculation.rateOfExchange)/}
                            {else/}
                             {set subtotalTaxPerPax = Number(subtotalTaxPerPax) + Number(surcharge.amount)/}
                            {/if}
                          {/foreach}
                        {/if}
                        {var fareWithoutTax = travellerType.travellerPrices[0].priceWithoutTax/}
                        {if travellerType.number > 1}
                          {set fareWithoutTax = fareWithoutTax * travellerType.number/}
                        {/if}
                        {set fareWithoutTax = fareWithoutTax - subtotalTaxPerPax/}
                        {set subtotalPerPax = subtotalPerPax + fareWithoutTax/}
                        ${this.utils.printCurrency(fareWithoutTax, fractionDigits)}
                      {/if}
                    </dd>
                    {var airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_ADT/}
                  {if travellerType.travellerType.code == 'CHD'}
                    {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_CHD/}
                  {elseif travellerType.travellerType.code == 'INF'/}
                    {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_INF/}
                  {else/}
                    {if this.data.siteParams.siteAllowPax != null && this.data.siteParams.siteAllowPax.toLowerCase() == 'true'}
                      {if travellerType.travellerType.code == 'YCD'}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YCD/}
                      {elseif travellerType.travellerType.code == 'YTH'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YTH/}
                      {elseif travellerType.travellerType.code == 'STU'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_STU/}
                      {elseif travellerType.travellerType.code == 'MIL'/}
                        {set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_MIL/}
                      {/if}
                    {/if}
                     {/if}
                    {if airTravTaxList != null}
                    {foreach tax in airTravTaxList}
                      <dt>
                        {if tax.code != null && tax.code != ''}
                        (${tax.code})
                        {/if}
                        {if tax.description != null && tax.description != ''}
                          ${tax.description}
                        {else/}
                          ${this.data.labels.tx_merci_book_tax_description_unavailable}
                        {/if}
                      </dt>
                      <dd>
                       {if travellerType.number > 1}
                        ${this.utils.printCurrency(tax.value * travellerType.number, fractionDigits)}
                         {set subtotalPerPax = Number(subtotalPerPax) + Number(tax.value * travellerType.number)/}
                       {else/}
                        ${this.utils.printCurrency(tax.value, fractionDigits)}
                         {set subtotalPerPax = Number(subtotalPerPax) + Number(tax.value)/}
                         {/if}
                      </dd>
                    {/foreach}
                  {/if}

              {var surchargePerPaxType = 0/}
              {if this.data.siteParams.siteShowSurchargesReview != null && this.data.siteParams.siteShowSurchargesReview.toLowerCase() == 'true' && travellerType.fareCalculation.hasSurcharges == true}
                          {foreach surcharge in travellerType.fareCalculation.listSurcharges}
                          <dt>
                            {if surcharge.code != null && surcharge.code != ''}
                            (${surcharge.code})
                            {/if}
                            {if surcharge.code != null}
                              {if surcharge.code == 'Q'}
                                ${this.data.labels.tx_pltg_text_QsurchargeDescription}
                              {elseif surcharge.code == 'S'/}
                                ${this.data.labels.tx_pltg_text_SsurchargeDescription}
                              {else/}
                                {var noSurchangeDescription = new this._strBuffer(this.data.labels.tx_pltg_pattern_NoSurchargeDescription)/}
                                {var surchargeCodeArray = new Array()/}
                                // passing param and printing string
                                ${surchargeCodeArray.push(surcharge.code)|eat}
                                ${noSurchangeDescription.formatString(surchargeCodeArray)}
                              {/if}
                            {else/}
                              {var noSurchangeDescription = new this._strBuffer(this.data.labels.tx_pltg_pattern_NoSurchargeDescription)/}
                              {var surchargeCodeArray = new Array()/}
                              // passing param and printing string
                              ${surchargeCodeArray.push(surcharge.code)|eat}
                              ${noSurchangeDescription.formatString(surchargeCodeArray)}
                            {/if}
                          </dt>
                          <dd>
                            {if travellerType.fareCalculation.currency == 'NUC'}
                            ${this.utils.printCurrency((surcharge.amount * travellerType.fareCalculation.rateOfExchange), fractionDigits)}
                              {set surchargePerPaxType = Number(surchargePerPaxType) + Number(surcharge.amount * travellerType.fareCalculation.rateOfExchange)/}
                            {else/}
                            ${this.utils.printCurrency(surcharge.amount, fractionDigits)}
                             {set surchargePerPaxType = Number(surchargePerPaxType) + Number(surcharge.amount)/}
                            {/if}
                          </dd>
                          {/foreach}
                       {/if}
                        </dl>

                         {set subtotalPerPax = Number(subtotalPerPax) + Number(surchargePerPaxType)/}
                           <dl>
                     <dt class="footerRow">
                         <strong>${this.data.labels.tx_merci_text_booking_fare_prcdtl_total_for} ${travellerType.number} ${traveller1}</strong></dt>
                         <dd class="footerRow"><strong>
                         {if currConv}
                            ${this.utils.printCurrency(subtotalPerPax*this.data.exchRate, fractionDigits)}
                          {else/}
                          ${this.utils.printCurrency(subtotalPerPax, fractionDigits)}
                          {/if}
                         </strong></dd>
                  </dl>


						
								
								{if travellerType.number > 1}
									<dt class="footerRow">
										<strong>${this.data.labels.tx_merci_text_booking_fare_cross_symbol} ${travellerType.number} ${traveller}</strong>
									</dt>
									<dd class="footerRow">
										{if isAwardsFlow == true}
											${travellerType.travellerPrices[0].milesCost * travellerType.number}
										{else/}
										{if currConv}
                      ${this.utils.printCurrency((travellerType.travellerPrices[0].priceWithoutTax * travellerType.number  *this.data.exchRate), fractionDigits)}
                    {else/}
											${this.utils.printCurrency((travellerType.travellerPrices[0].priceWithoutTax * travellerType.number), fractionDigits)}
                    {/if}
										{/if}
									</dd>
								{/if}
							</dl>

						{/foreach}
					{/foreach}

					{call breakdownHeader(this.data.labels.tx_merci_text_booking_fare_surch, currencyCode) /}
					{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
						{foreach travellerType in pnr.travellerTypesInfos}
							{var traveller1 = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
							{var traveller = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
							<dl>
								<dt><strong>${traveller1} ${this.data.labels.tx_merci_text_booking_apis_passenger_label}</strong></dt><dd></dd>
								{if !(this.data.siteParams.siteTaxSplit != null && this.data.siteParams.siteTaxSplit.toLowerCase() == 'true')}
									{if travellerType.travellerPrices != null && travellerType.travellerPrices.length > 0 && travellerType.travellerPrices[0].taxesList != null}
										{foreach taxList in travellerType.travellerPrices[0].taxesList}
											{foreach tax in taxList}
												<dt>
													{if tax.code != null && tax.code != ''}
														(${tax.code})
													{/if}
													{if tax.description != null && tax.description != ''}
														${tax.description}
													{else/}
														${this.data.labels.tx_merci_book_tax_description_unavailable}
													{/if}
												</dt>
												<dd>
												 {if currConv}
                          ${this.utils.printCurrency(tax.value*this.data.exchRate, fractionDigits)}
                         {else/}
                           ${this.utils.printCurrency(tax.value, fractionDigits)}
                         {/if}
												</dd>
											{/foreach}
										{/foreach}
									{/if}
								{else/}
									{var airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_ADT/}
									{if travellerType.travellerType.code == 'CHD'}
										{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_CHD/}
									{elseif travellerType.travellerType.code == 'INF'/}
										{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_INF/}
									{else/}
										{if this.data.siteParams.siteAllowPax != null && this.data.siteParams.siteAllowPax.toLowerCase() == 'true'}
											{if travellerType.travellerType.code == 'YCD'}
												{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YCD/}
											{elseif travellerType.travellerType.code == 'YTH'/}
												{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_YTH/}
											{elseif travellerType.travellerType.code == 'STU'/}
												{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_STU/}
											{elseif travellerType.travellerType.code == 'MIL'/}
												{set airTravTaxList = this.data.rqstParams.airLineTax.airlineTaxList_MIL/}
											{/if}
										{/if}
									{/if}



									<dt class="headerRow">${this.data.labels.tx_pltg_text_header_airline_fees}</dt>

									<dd class="headerRow"></dd>
									{if airTravTaxList != null}
										{foreach tax in airTravTaxList}
											<dt>
												{if tax.code != null && tax.code != ''}
												(${tax.code})
												{/if}
												{if tax.description != null && tax.description != ''}
													${tax.description}
												{else/}
													${this.data.labels.tx_merci_book_tax_description_unavailable}
												{/if}
											</dt>
											<dd>
											   {if currConv}
                          ${this.utils.printCurrency(tax.value*this.data.exchRate, fractionDigits)}
                         {else/}
                           ${this.utils.printCurrency(tax.value, fractionDigits)}
                         {/if}
											</dd>
										{/foreach}
									{/if}

									{var govtTaxList = this.data.rqstParams.govtTax.govtTaxList_ADT/}
									{if travellerType.travellerType.code == 'CHD'}
										{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_CHD/}
									{elseif travellerType.travellerType.code == 'INF'/}
										{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_INF/}
									{else/}
										{if this.data.siteParams.siteAllowPax != null && this.data.siteParams.siteAllowPax.toLowerCase() == 'true'}
											{if travellerType.travellerType.code == 'YCD'}
												{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_YCD/}
											{elseif travellerType.travellerType.code == 'YTH'/}
												{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_YTH/}
											{elseif travellerType.travellerType.code == 'STU'/}
												{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_STU/}
											{elseif travellerType.travellerType.code == 'MIL'/}
												{set govtTaxList = this.data.rqstParams.govtTax.govtTaxList_MIL/}
											{/if}
										{/if}
									{/if}

									<dt class="headerRow">${this.data.labels.tx_pltg_text_header_other_fees}</dt>
									<dd class="headerRow"></dd>
									{if govtTaxList != null}
										{foreach tax in govtTaxList}
											<dt>
												{if tax.code != null && tax.code != ''}
												 (${tax.code})
												{/if}
												{if tax.description != null && tax.description != ''}
													${tax.description}
												{else/}
													${this.data.labels.tx_merci_book_tax_description_unavailable}
												{/if}
											</dt>
											<dd>
											 {if currConv}
                        ${this.utils.printCurrency(tax.value*this.data.exchRate, fractionDigits)}
                       {else/}
                         ${this.utils.printCurrency(tax.value, fractionDigits)}
                       {/if}
											</dd>
										{/foreach}
									{/if}
								{/if}

								<dt class="footerRow"><strong>${this.data.labels.tx_merci_text_booking_fare_prcdtl_total_for} 1 ${traveller1}</strong></dt>
								<dd>
									<strong>
										{if isAwardsFlow == true}
									    {if currConv}
                       ${this.utils.printCurrency(travellerType.travellerPrices[0].priceWithTax * this.data.exchRate, fractionDigits)}
                     {else/}
                       ${this.utils.printCurrency(travellerType.travellerPrices[0].priceWithTax, fractionDigits)}
                     {/if}
										{else/}
										 {if currConv}
                       ${this.utils.printCurrency(travellerType.travellerPrices[0].tax * this.data.exchRate, fractionDigits)}
										{else/}
											${this.utils.printCurrency(travellerType.travellerPrices[0].tax, fractionDigits)}
                     {/if}
										{/if}
									</strong>
								</dd>

								{if travellerType.number > 1}
									<dt><strong>${this.data.labels.tx_merci_text_booking_fare_cross_symbol} ${travellerType.number} ${traveller}</strong></dt>
									<dd>
										<strong>
											{if isAwardsFlow == true}
											 {if currConv}
                         ${this.utils.printCurrency(travellerType.travellerPrices[0].priceWithTax * travellerType.number * this.data.exchRate, fractionDigits)}
                       {else/}
                         ${this.utils.printCurrency(travellerType.travellerPrices[0].priceWithTax* travellerType.number, fractionDigits)}
                       {/if}
											{else/}
											  {if currConv}
                         ${this.utils.printCurrency((travellerType.travellerPrices[0].tax * travellerType.number * this.data.exchRate), fractionDigits)}
											{else/}
												${this.utils.printCurrency((travellerType.travellerPrices[0].tax * travellerType.number), fractionDigits)}
                       {/if}
											{/if}
										</strong>
									</dd>
								{/if}
								</dl>
						{/foreach}

						{if this.hasAncillaryServices()}
							{call breakdownHeader(this.data.labels.tx_merci_nwsm_services, currencyCode) /}
  							{@html:Template {
  									classpath: "modules.view.merci.segments.booking.templates.farereview.MFareBreakdownSeat",
  									data: {
										labels: this.data.labels,
										rqstParams: this.data.rqstParams,
										siteParams: this.data.siteParams,
										globalList: this.data.globalList
									}
								}/}
								{/if}

					{/foreach}



					{if this.data.siteParams.siteShowServiceFee != null && this.data.siteParams.siteShowServiceFee.toLowerCase() == '1'}
					  {var serviceFeeLabel = isAwardsFlow == true ? this.data.labels.tx_merci_awards_airport : this.data.labels.tx_merci_text_booking_service_fee /}
					  {call breakdownHeader(serviceFeeLabel, currencyCode) /}
						<dl>
							{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
								{foreach travellerType in pnr.travellerTypesInfos}
									{var traveller = this.utils.getTravellerType(travellerType, this.data.labels, this.data.siteParams.siteAllowPax)/}
									<header>
										<hgroup>
											<h3>${traveller} ${this.data.labels.tx_merci_text_booking_apis_passenger_label}</h3>
										</hgroup>
									</header>
									<dt class="footerRow">
										<strong>${this.data.labels.tx_merci_text_booking_fare_prcdtl_total_for} 1 ${traveller}</strong>
									</dt>
									<dd class="footerRow">
							     {if currConv}
                     ${this.utils.printCurrency(travellerType.travellerPrices[0].serviceFee * this.data.exchRate, fractionDigits)}
                   {else/}
                    ${this.utils.printCurrency(travellerType.travellerPrices[0].serviceFee, fractionDigits)}
                   {/if}
									</dd>
									{if travellerType.number > 1}
										<dt class="footerRow">
											<strong>${this.data.labels.tx_merci_text_booking_fare_cross_symbol} ${travellerType.number} ${traveller}</strong>
										</dt>
										<dd class="footerRow">
										 {if currConv}
                      ${this.utils.printCurrency(travellerType.travellerTypePrices[0].serviceFee * this.data.exchRate, fractionDigits)}
                     {else/}
											${this.utils.printCurrency(travellerType.travellerTypePrices[0].serviceFee, fractionDigits)}
                     {/if}
										</dd>
									{/if}
								{/foreach}
							{/foreach}
						</dl>
					{/if}
					{var styleCondition = !this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions) && this.data.rqstParams.fareBreakdown.listPromotions[0].promoCodeType == 'ZO' && bRebooking == false && this.data.rqstParams.pageFrom == 'CONF'/}
					{var emptyPromotionTotalAmount = this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions) || this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount) || this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount == ''/}
					{var promoDisplayCondition = emptyPromotionTotalAmount == true || styleCondition == true/}
					<header class="{if promoDisplayCondition == true}hidden{/if}" id='hdrPromo'>
						<hgroup>
							<h2>
								<span class="label">
									${this.data.labels.tx_sb_text_PromoManagePromotionTab}
								</span>
								<span class="data">
									{if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
								</span>
							</h2>
						</hgroup>
					</header>
					<dl class="{if promoDisplayCondition == true}hidden{/if}" id='dlPromo'>
						{var formatTotalPrice = ''/}
						{if this.data.rqstParams.fareBreakdown.listPromotions != null && this.data.rqstParams.fareBreakdown.listPromotions[0] != null && this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount != null}
							{var formattedPrice = this.utils.printCurrency(this.data.rqstParams.fareBreakdown.listPromotions[0].totalAmount, fractionDigits)/}
						{/if}
						<dt></dt>
						<dd id='fareBrkdwnPromoPrice'>${formattedPrice}</dd>
					</dl>
            // for displaying OBFEES [START]
          {var obFees = this.data.rqstParams.fareBreakdown.obFees/}
          {var obfee = 0 /}
          {if obFees != null && obFees.displayOBFeesDetail != null && obFees.displayOBFeesDetail == true && this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
            {foreach obFee in obFees.allObFees}
              {var feeName = obFee.name /}
              {if feeName == null || feeName == ''}
                {set feeName = obFee.code /}
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

              {call breakdownHeader(feeName, currencyCode) /}
              <dl>
               <dt><strong>${this.data.labels.tx_merci_text_booking_fare_total_passengers}</strong></dt>
               <dd>
                <strong>
                  {if obFees.hasAppliedObFees != null && obFees.hasAppliedObFees == true}
                    {set obfee = obFees.totalAppliedObFee.fees[0].value.toFixed(fractionDigits)/}
                    ${obfee}
                  {else/}
                   {set obfee = obFees.totalAppliedAndRequestedObFee.unsignedFormattedAmount[0] /}
                    ${obfee}
                  {/if}
                 </strong>
               </dd>
              </dl>

            {/foreach}

            {/if}
            {if this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
   <header id="CREDIT_CARD_FEE" class="hidden">
            <hgroup>
              <h2>
                <span class="label">
                  ${this.data.labels.tx_merci_creditCardFee}
                </span>&nbsp;
                <span class="data">
                {if currConv}${this.data.currCode}{else/}${this.data.rqstParams.fareBreakdown.currencies[0].code}{/if}

                </span>
              </h2>
            </hgroup>
          </header>
           <dl id="CC-FEE-DISP" class="hidden">
             <dt><strong id="ccField">${this.data.labels.tx_merci_text_booking_fare_total_passengers}</strong></dt>
             <dd><strong id="ccFee"> </strong></dd>
           </dl>

          {/if}
         // for displaying OBFEES [END]
         /*Fix for PTR 08447661 [Serious]: ELAL - Markup fee is visible in Price breakdown - START*/
         {if this.data.siteParams.siteShowMarkup != null && this.utils.booleanValue(this.data.siteParams.siteShowMarkup) == true}
              {var markupFee = 0 /}
              {if this.data.rqstParams.fareBreakdown.tripPrices[0].markup && this.data.rqstParams.fareBreakdown.tripPrices[0].markup.amount==true && this.data.rqstParams.fareBreakdown.tripPrices[0].markup.value}
                {set markupFee = this.data.rqstParams.fareBreakdown.tripPrices[0].markup.value /}
              {/if}
              {call breakdownHeader(this.data.labels.tx_pltg_text_AdditionalCharges.toUpperCase(), currencyCode) /}
              <dl>
                  <dt class="footerRow">
                    <strong>${this.data.labels.tx_pltg_text_AdditionalCharges}</strong>
                  </dt>
                  <dd class="footerRow">
                     {if currConv}
                      ${this.utils.printCurrency(markupFee * this.data.exchRate, fractionDigits)}
                     {else/}
                      ${this.utils.printCurrency(markupFee, fractionDigits)}
                     {/if}
                  </dd>
              </dl>
         {/if}
          /*Fix for PTR 08447661 [Serious]: ELAL - Markup fee is visible in Price breakdown - END*/

		  {var totalPrice = this.data.finalAmount || this.getTotalPrice() /}
		  {set totalPrice = totalPrice.toString().replace(/\,/g,'')/}
                  {set totalPrice = parseFloat(totalPrice)/}
		  {set totalPrice = parseFloat(totalPrice)+parseFloat(this.__getServicesPrice())/}
                  {if this.utils.booleanValue(this.data.siteParams.servicesCatalog) && this.data.rqstParams.param.FROM_PAGE=="SERVICES" && this.data.rqstParams.param.ACTION == 'MODIFY'}
                    {set servicePriceTotal = this.data.rqstParams.servicesSelection.totalPrice/}
                    {if servicePriceTotal && !isNaN(servicePriceTotal.balancedAmount)}
                      {if (this.data.rqstParams.reply.pnrStatusCode == 'P')}
						{set totalPrice = totalPrice/}
					  {else/}
                      {set totalPrice = servicePriceTotal.balancedAmount/}
					  {/if}	
                    {/if}
                  {/if}
                 {if currConv}
                  {set totalPrice = this.utils.printCurrency(totalPrice * this.data.exchRate, fractionDigits) /}
                 {else/}
                  {set totalPrice = this.utils.printCurrency(totalPrice, fractionDigits) /}
                 {/if}


					<footer class="total {if isAwardsFlow == true}miles{/if}">
					//=====================================================================================================================

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

									{if rebookingBalance == null && oldTax != null && priceWithTax != null}
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
									{if rebookingBalance == null && oldPrice != null && priceWithTax != null}
										{set rebookingBalance = oldPrice - priceWithTax/}
									{/if}
								{/if}
								// calculating rebooking fees
								{var rebookingFee = 0/}
								{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0 && this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee != null}
									{set rebookingFee = this.data.rqstParams.fareBreakdown.tripPrices[0].rebookingFee/}
									{set rebookingBalance += rebookingFee/}
								{/if}
							{/if}




	//============================================================================================================================





{if bRebooking == true}
		<dl>
			<dt>
				<strong>
					${this.data.labels.tx_merci_atc_rbk_fare_new_trip}
				</strong>
			</dt>
			<dd>
				<strong>
					
				</strong>
				{if isAwardsFlow == true}
					<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
                {/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].subTotal, fractionDigits)}</strong>
                </span>										
			</dd>
		</dl>
		<dl>
			<dt>
				<strong>
					${this.data.labels.tx_merci_atc_rbk_fare_prev_paid}
				</strong>
			</dt>
			<dd>
				{if isAwardsFlow == true}					
					<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${oldPrice}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
                {/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[0].oldPrice, fractionDigits)}</strong>
                </span>
			</dd>
		</dl>
	     {/if}
            <dl>
              <dt>
                <strong>
			{if isAwardsFlow == true}
				{if rebookingMilesBalance != null && rebookingMilesBalance < 0 }
					${this.data.labels.tx_merci_atc_rbk_tot_refund}
				{else/}
					${this.data.labels.tx_merci_text_booking_fare_total_passengers}
				{/if}
			{else/}
				{if rebookingBalance != null && rebookingBalance < 0 }
					${this.data.labels.tx_merci_atc_rbk_tot_refund}
				{else/}
					 ${this.data.labels.tx_merci_text_booking_fare_total_passengers}
				{/if}

			{/if}
			{if styleCondition == true && isAwardsFlow != true}*{/if}
		</strong>
              </dt>
              <dd>
	      {if bRebooking == true}
		{if isAwardsFlow == true}
			<span class="unit">${this.data.labels.tx_merci_miles}</span>
					<span class="data">
						<strong id="fareBrkTotalPrice">${rebookingMilesBalance}</strong>
					</span>
					<span class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</span>
		{/if}
		{/if}
                <span class="unit">
                {if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
                </span>
                <span class="data">
				{if bRebooking == true}
					<strong id="fareBrkTotalPrice">${this.utils.printCurrency(rebookingBalance, fractionDigits)}</strong>
				{else/}
					<strong id="fareBrkTotalPrice">${totalPrice}</strong>
				{/if}
                </span>
		
              </dd>
          {if this.data.siteParams.siteAllowAPC != null && this.data.siteParams.siteAllowAPC.toLowerCase() == 'true' && this.data.rqstParams.fareBreakdown.currencies != null && this.data.rqstParams.fareBreakdown.currencies.length > 1}
          {var totalPriceinConvertedCurrency = this.data.rqstParams.fareBreakdown.tripPrices[1].totalAmount/}           
            <dt style="visibility:hidden">dummydata</dt>
            <dd>
              <span class="unit">${this.data.rqstParams.fareBreakdown.currencies[1].code}</span>
              <span class="data">
                <strong id="fareBrkTotalPrice"> ${this.utils.printCurrency(totalPriceinConvertedCurrency, fractionDigits)}</strong>
              </span>
            </dd>
          {/if}

							{if (this.data.payLaterElig != null && this.data.payLaterElig.timeToThinkEnbl == 'TRUE')}
								<div id="TTTPriceBrkDown" class="displayNone">
									  <dt>
										<strong>
											{if this.data.fromPage == 'CONF'}${this.data.labels.tx_merci_total_paid}{else/}${this.data.labels.tx_merci_services_paynow}{/if}
										</strong>
									  </dt>
									  <dd>
										<span class="unit">
											{if currConv}${this.data.currCode}{else/}${currencies[0].code}{/if}
										</span>
										{var TTTPrice = this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.totalAmount/}
										{if currConv}
											{set TTTPrice = this.utils.printCurrency(TTTPrice * this.data.exchRate, fractionDigits) /}
										{else/}
											{set TTTPrice = this.utils.printCurrency(TTTPrice, fractionDigits) /}
										{/if}
										<span class="data">
										  <strong id="fareBrkTotalPrice">${TTTPrice}</strong>
										</span>
									  </dd>
								</div>
							 {/if}
							<dt {if styleCondition == false}class="hidden"{/if}>${this.data.labels.tx_pltg_text_PromotionIncluded}</dt><dd {if styleCondition == false}class="hidden"{/if}></dd>
						</dl>

					</footer>
				{/if}
			</article>
			{else /}

			<article class="panel price">
				<header>
					<hgroup>
						<h1>
							{if isAwardsFlow == true}
								${this.data.labels.tx_merci_awards_cost_details}
							{else/}
								${this.data.labels.tx_merci_text_booking_fare_prcdtl_price_dtl}
							{/if}
						</h1>
					</hgroup>
				</header>

				<footer class="total">
					<dl>
					  <dt>
							<strong>

							{if parseFloat(this.data.finalAmount.toString().replace(/\,/g,'')) < 0 }
								${this.data.labels.tx_merci_atc_rbk_tot_refund}
							{else/}
								${this.data.labels.tx_merci_text_booking_fare_total_passengers}
							{/if}
							{if styleCondition == true && isAwardsFlow != true}*{/if}

							</strong>
						</dt>

						<dd>
							<span class="unit">${currencyCode}</span>
							<span class="data">
              <strong id="fareBrkTotalPrice">
               {if currConv}
                ${this.data.finalAmount * this.data.exchRate}
               {else/}
                ${this.data.finalAmount}
               {/if}
              </strong>
							</span>
						</dd>
            {if this.data.siteParams.siteAllowAPC != null && this.data.siteParams.siteAllowAPC.toLowerCase() == 'true' && this.data.rqstParams.fareBreakdown.currencies != null && this.data.rqstParams.fareBreakdown.currencies.length > 1}
            {var totalPriceinConvertedCurrency = this.data.rqstParams.fareBreakdown.tripPrices[1].totalAmount/}           
              <dt style="visibility: hidden">dummyData</dt>
              <dd>
                <span class="unit">${this.data.rqstParams.fareBreakdown.currencies[1].code}</span>
                <span class="data">
                  <strong id="fareBrkTotalPrice"> ${this.utils.printCurrency(totalPriceinConvertedCurrency, fractionDigits)}</strong>
                </span>
              </dd>
            {/if}
					</dl>
				</footer>

			{/if}
      {/if}
			<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
		{/if}
	{/macro}

	{macro breakdownHeader(label, currencyCode)}
    <header>
      <hgroup>
        <h2>
          <span class="label">${label}</span>
          <span class="data">${currencyCode}</span>
        </h2>
      </hgroup>
    </header>
	{/macro}

	{macro insBreakdown(currencyCode, currConv)}
	  {if !this.utils.isEmptyObject(this.data.insData) && !this.utils.isEmptyObject(this.data.insData.amount)}
      {call breakdownHeader(this.data.labels.tx_merci_text_booking_conf_insurance, currencyCode) /}
      <dl>
        <dt>${this.data.labels.tx_merci_text_booking_purc_insurance_text_two} ${this.data.labels.tx_merci_text_booking_conf_insurance}</dt><dd></dd>
        <dt>${this.data.labels.tx_merci_text_booking_ins_total}</dt>
        <dd>
         {if currConv}
            ${this.data.insData.amount * this.data.exchRate}
          {else/}
            ${this.data.insData.amount}
         {/if}
        </dd>
      </dl>
		{/if}
	{/macro}
{/Template}