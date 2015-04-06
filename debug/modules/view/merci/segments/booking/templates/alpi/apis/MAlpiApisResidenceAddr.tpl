{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisResidenceAddr'	
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
		{if (apisSectionBean != null && apisSectionBean.hasResidenceAddressesInDataMap != null && apisSectionBean.listResidenceAddresses != null)}
			{foreach listResidenceAddress in apisSectionBean.listResidenceAddresses}				
				{set apisEntryBean = listResidenceAddress /}
				{set DOCA_AddressBean = listResidenceAddress.addressBean/}
				{set residence = "RES_"/}				
				{if (apisEntryBean.structureIdAttributes.enabled == "Y")}
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
									addressBean : DOCA_AddressBean	
								}
					} /}
					<div class="lineSeparatorPassenger"></div>					
				{/if}
			{/foreach}
		{/if}		
	{/macro}
{/Template}