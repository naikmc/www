{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisDestAddr'	
}}

	{macro main()}			
		{var labels = this.data.labels/}
		{var siteParameters = this.data.siteParameters/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		
		{var fieldNames = ""/}
		{var spanTagNames = ""/}
		{var docTag = ""/}
		{var validationTag = ""/}


		{set apisSectionBean = this.data.apisSectionBean/}
		{set traveller = this.data.traveller/}
		{if (apisSectionBean != null && apisSectionBean.hasDestinationAddressesInDataMap != null && apisSectionBean.listDestinationAddresses != null)}
			{foreach listDestinationAddress in apisSectionBean.listDestinationAddresses}				
				{set apisEntryBean = listDestinationAddress /}
				{set DOCA_AddressBean = listDestinationAddress.addressBean/}
				{set residence = ""/}	
				{if (apisEntryBean.target.type == 'GLOBAL')}
					{if (apisEntryBean.structureIdAttributes.enabled == "Y")}
						<!-- Include DOCA_Section.jsp-->
						<div class="lineSeparatorPassenger"></div>
					{/if}
				{elseif (apisEntryBean.target.type == 'ELEMENT')/}
					{if (apisEntryBean.target.value != 'UNKNOWN')}
						{foreach itinerary in rqstParams.listItineraryBean.itineraries}
							{if (itinerary.itemId == apisEntryBean.target.value)}
								{set itinerarySel = itinerary/}
							{/if}						
						{/foreach}						
						{set beginLoc = itinerarySel.beginLocation.countryName/}
						{set endLoc = itinerarySel.endLocation.countryName/}
						
						{if (apisEntryBean.structureIdAttributes.enabled == "Y")}
							<!--Include apis_address_fields.jsp -->
							{@html:Template {										
								classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisAddrFields",
								data: {
									labels : labels,
									siteParameters : siteParameters,
									gblLists : gblLists,
									rqstParams : rqstParams,
									isAdultPsngr : this.data.isAdultPsngr,
									apisSectionBean : apisSectionBean,
									apisEntryBean: apisEntryBean,
									residence : residence,
									traveller : traveller,
									beginLoc : beginLoc,
									endLoc : endLoc,
									addressBean : DOCA_AddressBean	
								}
							} /}
							<div class="lineSeparatorPassenger"></div>
						{/if}	
					{else/}
						{set beginLoc = ""/}
						{set endLoc = ""/}
						<!--Include apis_address_fields.jsp -->
						{@html:Template {										
							classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisAddrFields",
							data: {
								labels : labels,
								siteParameters : siteParameters,
								gblLists : gblLists,
								rqstParams : rqstParams,
								isAdultPsngr : this.data.isAdultPsngr,
								apisSectionBean : apisSectionBean,
								apisEntryBean: apisEntryBean,
								residence : residence,
								traveller : traveller,
								beginLoc : beginLoc,
								endLoc : endLoc,
								addressBean : DOCA_AddressBean	
							}
						} /}
						<div class="lineSeparatorPassenger"></div>
					{/if}
				{/if}
			{/foreach}
		{/if}		
	{/macro}
{/Template}