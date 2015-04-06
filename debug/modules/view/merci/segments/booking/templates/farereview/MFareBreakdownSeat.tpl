{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareBreakdownSeat',
	$dependencies: [
	  'modules.view.merci.common.utils.MCommonScript',
	  'modules.view.merci.common.utils.ServiceSelection'
	]
}}

	{macro main()}
		{var utils = modules.view.merci.common.utils.MCommonScript /}

		// execute macro only if data is provided
		{if this.data.rqstParams != null && this.data.labels != null}

			// this macro will be executed for chargeable seats
			{var seatCurrency = null/}
			{if this.data.rqstParams.servicesByPaxAndLoc != null && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice && this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice > 0}
				{set seatCurrency = ''/}
			{/if}

			{if utils.booleanValue(this.data.siteParams.servicesCatalog)}
			  {var selection = new modules.view.merci.common.utils.ServiceSelection(this.data.rqstParams.servicesSelection) /}
			  <dl>
          {foreach category in this.data.globalList.serviceCategories}
            {var services = selection.getServices(category.code, null, null, null, null) /}
            {if services.length > 0}
              /* Seats don't have NUMBER property, so we take the number of seat services */
              {var nbServices = selection.getTotalProperty(services, 'NUMBER') || services.length /}
              <dt>${nbServices} ${category.name}</dt>
              <dd>${selection.getTotalPrice(services).toFixed(2)}</dd>
            {/if}
          {/foreach}
        </dl>
        <footer class="total">
          <dl>
            <dt><strong>${this.data.labels.tx_merci_nwsm_tot_service}</strong></dt>
            <dd><span class="unit">${selection.totalPrice.currency.code}</span><span class="data"><strong>${selection.totalPrice.totalAmount.toFixed(2)}</strong></span></dd>
          </dl>
        </footer>
			{elseif this.data.rqstParams.serviceByPaxAndLoc != null && this.data.rqstParams.serviceByPaxAndLoc.allServicesByPax != null /}
				<dl>
					{foreach serviceByPaxRecord in this.data.rqstParams.allServicesByPax}
						{var allServicesByItinerary = serviceByPaxRecord.allServicesByItinerary/}
						{foreach itinerary in this.data.rqstParams.listItineraryBean.itineraries}
							{var servicesByItinerary = allServicesByItinerary[itinerary.itemId]/}
							{if servicesByItinerary != null}
								{foreach segment in itinerary.segments}
									{var seatNumber = servicesByItinerary[segment.id]/}
										{if seatNumber != null && seatNumber.hasPriceInfo==true}
											<dt>1 ${this.data.labels.tx_merci_nwsm_chrg_st}<small>${seatNumber.parameterMap['SELECTED_'].parameterValue}</small></dt>
											<dd>${seatNumber.price.priceWithTax}</dd>
											{set seatCurrency = seatNumber.price.currency.code/}
										{/if}
								{/foreach}
							{/if}
						{/foreach}
					{/foreach}
					<dt><strong>${this.data.labels.tx_merci_nwsm_tot_service}</strong> </dt> <dd><strong>${this.data.rqstParams.servicesByPaxAndLoc.servicesTotalPrice}</strong></dd>
			  </dl>
			{/if}
		{/if}
	{/macro}

{/Template}