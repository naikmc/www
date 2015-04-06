{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisAddrFields',
	$hasScript: true	
}}

	{macro main()}			
		{var labels = this.data.labels/}
		{var siteParameters = this.data.siteParameters/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var apisEntryBean = this.data.apisEntryBean/}
		{set apisIndex =  apisEntryBean.index/}
		{set residence = this.data.residence/}
		{if (apisEntryBean.structureIdAttributes.mandatory == "N")}
			{set dispMandatory = "displayNone"/}		
		{/if}
		{set dispReadOnly = ""/}
		{if (apisEntryBean.target.value == "UNKNOWN" && residence == "")}
			{set dispReadOnly = "disabled"/}		
		{/if}
		
		{var fieldNames = ""/}
		{var spanTagNames = ""/}		
		{var validationTag = ""/}
		{var secId = ""/}
		{set apisSectionBean = this.data.apisSectionBean/}
		{set traveller = this.data.traveller/}
		
		{set isDocEnabled = "false"/}
		{set dispMandatory = "mandatory"/}
		{if (apisEntryBean.structureIdAttributes.mandatory == "N")}
			{set isDocEnabled = "true"/}
			{set dispMandatory = "displayNone"/}
		{/if}
		{if (rqstParams.flowType.code == 'STANDARD_FLOW')}
			{set flowSuffix = 'BK'/}
		{else/}
			{set flowSuffix = 'RT'/}
		{/if}										
		{set mandatorySec = apisEntryBean.structureIdAttributes.mandatory/}	
		{set id = residence+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
		
		{if (residence == 'RES_')}			
			{if (this.data.isAdultPsngr == 'Y')}
				{set sectionId = "APIS_RES_ADDR_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
			{else/}
				{set sectionId = "INFANT_APIS_RES_ADDR_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
			{/if}
		{else/}
			{if (this.data.isAdultPsngr == 'Y')}
				{set sectionId = "APIS_DEST_ADDR_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}				
			{else/}
				{set sectionId = "INFANT_APIS_DEST_ADDR_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}				
			{/if}
		{/if}
			
		{if (this.data.isAdultPsngr == 'Y')}			
			{set apisAddrTypeField = "APIS_ADDRESS_TYPE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrFirstLineField = "APIS_ADDRESS_FIRSTLINE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrCityField = "APIS_ADDRESS_CITY_"+traveller.paxNumber+"_"+id/}
			{set apisAddrStateField = "APIS_ADDRESS_STATE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrZipCodeField = "APIS_ADDRESS_ZIPCODE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrCountryField = "APIS_ADDRESS_COUNTRY_"+traveller.paxNumber+"_"+id/}
			{set secId = "APIS_"+id/}
		{else/}			
			{set apisAddrTypeField = "INFANT_APIS_ADDRESS_TYPE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrFirstLineField = "INFANT_APIS_ADDRESS_FIRSTLINE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrCityField = "INFANT_APIS_ADDRESS_CITY_"+traveller.paxNumber+"_"+id/}
			{set apisAddrStateField = "INFANT_APIS_ADDRESS_STATE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrZipCodeField = "INFANT_APIS_ADDRESS_ZIPCODE_"+traveller.paxNumber+"_"+id/}
			{set apisAddrCountryField = "INFANT_APIS_ADDRESS_COUNTRY_"+traveller.paxNumber+"_"+id/}
			{set secId = "INFANT_APIS_"+id/}
		{/if}			 
		<input type="hidden" name="${sectionId}"  value="${secId}" />		
		{var classValue= "" /}
		{if (this.data.servicingAPIS == 'Y')}
			{if (this.data.paxClicked == traveller.paxNumber)}
				{set classValue= "" /}
			{elseif (mandatorySec == 'Y' && this.data.paxClicked != traveller.paxNumber)/}
				{set classValue= "" /}
			{else/}
				{set classValue= "displayNone" /}
			{/if}
			<input type="hidden" name="hidDispPaxNumber" id="hidDispPaxNumber" value="${traveller.paxNumber}" />
			<input type="hidden" name="flowtype" id="flowtype" value="service" />
			<input type="hidden" name="numberOfTravellers" id="numberOfTravellers" value="${rqstParams.listTravellerBean.travellerBean.length}" />	
		{/if}
		<div class="${classValue}">	
		{if (residence == '')}
			{if ((this.data.endLoc == "" || this.data.endLoc == null))}
				<h1 class="contentH1">${labels.tx_pltg_text_AdressAtDestination}</h1>
			{elseif ((this.data.endLoc != "" || this.data.endLoc != null))/}
				<h1 class="contentH1">${labels.tx_merci_text_AdressAtDestination}&nbsp;${this.data.endLoc}</h1>
			{/if}	
		{elseif (residence == 'RES_')/}
			<h1 class="contentH1">${labels.tx_pltg_text_AdressAtResidence}</h1>
		{/if}			
		{set address = this.data.addressBean/}
		<!-- ADDRESS FIRST LINE START -->
		<p class="pi_addrst">
			{if (address.firstLineAttributes.enabled == "Y")}
				<label  class="pi_addrst">${labels.tx_pltg_text_streetAddress}
				{if (address.firstLineAttributes.mandatory  == 'Y')}
					{if (residence == '')}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_DST_ADR_FRST_LNE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_ADR_FRST_LNE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}"
								name="DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "DST_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" 
								   name="DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "DST_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_DST_INFNT_ADR_FRST_LNE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_INFNT_ADR_FRST_LNE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}"
								name="INFNT_DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_DST_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" 
								   name="INFNT_DST_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_DST_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{elseif (residence == 'RES_')/}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_RES_ADR_FRST_LNE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_ADR_FRST_LNE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}"
								name="RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "RES_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" 
								   name="RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "RES_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_RES_INFNT_ADR_FRST_LNE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_INFNT_ADR_FRST_LNE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}"
								name="INFNT_RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_RES_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" 
								   name="INFNT_RES_ADRS_FRST_LINE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_RES_ADRS_FRST_LINE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{/if}	
				{/if}
				</label>
				{set fieldNames = fieldNames+","+apisAddrFirstLineField/}
				<input {if dispMandatory=='mandatory'}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if} type="text" 
					  id="${apisAddrFirstLineField}" name="${apisAddrFirstLineField}" value="{if (!this.utils.isEmptyObject(this.data.addressBean.firstLine))}${this.data.addressBean.firstLine}{/if}" {on blur {fn:"docAddressEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+id+"_"+this.data.isAdultPsngr, docTypeKey : residence, isDocEnabled :  isDocEnabled, id:apisAddrFirstLineField, mandatory:dispMandatory} }/}/>
			{/if}
		</p>
		<!-- ADDRESS FIRST LINE END -->
		<!-- ADDRESS CITY START -->
		<p class="pi_addrcity">
			{if (address.cityAttributes.enabled == "Y")}
				<label class="pi_addrcity">${labels.tx_pltg_text_City}
				{if (address.cityAttributes.mandatory  == 'Y')}
					{if (residence == '')}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_DST_ADR_CTY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_ADR_CTY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="DST_ADRS_CITY_${traveller.paxNumber}_${id}"
								name="DST_ADRS_CITY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "DST_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="DST_ADRS_CITY_${traveller.paxNumber}_${id}" 
								   name="DST_ADRS_CITY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "DST_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_DST_INFNT_ADR_CTY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_INFNT_ADR_CTY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_DST_ADRS_CITY_${traveller.paxNumber}_${id}"
								name="INFNT_DST_ADRS_CITY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_DST_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_DST_ADRS_CITY_${traveller.paxNumber}_${id}" 
								   name="INFNT_DST_ADRS_CITY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_DST_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
						{/if}
					{elseif (residence == 'RES_')/}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_RES_ADR_CTY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_ADR_CTY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="RES_ADRS_CITY_${traveller.paxNumber}_${id}"
								name="RES_ADRS_CITY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "RES_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="RES_ADRS_CITY_${traveller.paxNumber}_${id}" 
								   name="RES_ADRS_CITY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "RES_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_RES_INFNT_ADR_CTY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_INFNT_ADR_CTY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_RES_ADRS_CITY_${traveller.paxNumber}_${id}"
								name="INFNT_RES_ADRS_CITY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_RES_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_RES_ADRS_CITY_${traveller.paxNumber}_${id}" 
								   name="INFNT_RES_ADRS_CITY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_RES_ADRS_CITY_"+traveller.paxNumber+"_"+id/}
						{/if}
					{/if}	
				{/if}
				</label>
				{set fieldNames = fieldNames+","+apisAddrCityField/}
				<input {if dispMandatory=='mandatory'}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if} type="text" 
					  id="${apisAddrCityField}" name="${apisAddrCityField}" value="{if (!this.utils.isEmptyObject(this.data.addressBean.city))}${this.data.addressBean.city}{/if}" {on blur {fn:"docAddressEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+id+"_"+this.data.isAdultPsngr, docTypeKey : residence, isDocEnabled :  isDocEnabled, id:apisAddrCityField, mandatory:dispMandatory} }/}/>
			{/if}
		</p>
		<!-- ADDRESS CITY END -->
		
		<!-- ADDRESS STATE START -->
		<p class="pi_addrsat">
			{if (address.stateAttributes.enabled == "Y")}
				<label class="pi_addrsat">${labels.tx_pltg_text_State}
				{if (address.stateAttributes.mandatory  == 'Y')}
					{if (residence == '')}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_DST_ADR_STATE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_ADR_STATE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="DST_ADRS_STATE_${traveller.paxNumber}_${id}"
								name="DST_ADRS_STATE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "DST_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="DST_ADRS_STATE_${traveller.paxNumber}_${id}" 
								   name="DST_ADRS_STATE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "DST_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_DST_INFNT_ADR_STATE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_INFNT_ADR_STATE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_DST_ADRS_STATE_${traveller.paxNumber}_${id}"
								name="INFNT_DST_ADRS_STATE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_DST_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_DST_ADRS_STATE_${traveller.paxNumber}_${id}" 
								   name="INFNT_DST_ADRS_STATE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_DST_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{elseif (residence == 'RES_')/}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_RES_ADR_STATE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_ADR_STATE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="RES_ADRS_STATE_${traveller.paxNumber}_${id}"
								name="RES_ADRS_STATE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "RES_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="RES_ADRS_STATE_${traveller.paxNumber}_${id}" 
								   name="RES_ADRS_STATE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "RES_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_RES_INFNT_ADR_STATE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_INFNT_ADR_STATE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_RES_ADRS_STATE_${traveller.paxNumber}_${id}"
								name="INFNT_RES_ADRS_STATE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_RES_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_RES_ADRS_STATE_${traveller.paxNumber}_${id}" 
								   name="INFNT_RES_ADRS_STATE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_RES_ADRS_STATE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{/if}	
				{/if}
				</label>
				{set fieldNames = fieldNames+","+apisAddrStateField/}
				<input {if dispMandatory=='mandatory'}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if} type="text" 
					  id="${apisAddrStateField}" name="${apisAddrStateField}" value="{if (!this.utils.isEmptyObject(this.data.addressBean.state))}${this.data.addressBean.state}{/if}" {on blur {fn:"docAddressEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+id+"_"+this.data.isAdultPsngr, docTypeKey : residence, isDocEnabled :  isDocEnabled, id:apisAddrStateField, mandatory:dispMandatory} }/}/>
			{/if}
		</p>
		<!-- ADDRESS STATE END -->

		<!-- ADDRESS ZIP CODE START -->
		<p class="pi_addrzp">
			{if (address.zipCodeAttributes.enabled == "Y")}
				<label class="pi_addrzp">${labels.tx_pltg_text_zipCode}
				{if (address.zipCodeAttributes.mandatory  == 'Y')}
					{if (residence == '')}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_DST_ADR_ZIPCODE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_ADR_ZIPCODE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}"
								name="DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "DST_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" 
								   name="DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "DST_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_DST_INFNT_ADR_ZIPCODE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_INFNT_ADR_ZIPCODE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}"
								name="INFNT_DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_DST_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" 
								   name="INFNT_DST_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_DST_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{elseif (residence == 'RES_')/}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_RES_ADR_ZIPCODE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_ADR_ZIPCODE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}"
								name="RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "RES_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" 
								   name="RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "RES_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_RES_INFNT_ADR_ZIPCODE_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_INFNT_ADR_ZIPCODE_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}"
								name="INFNT_RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_RES_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" 
								   name="INFNT_RES_ADRS_ZIP_CODE_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_RES_ADRS_ZIP_CODE_"+traveller.paxNumber+"_"+id/}
						{/if}
					{/if}	
				{/if}
				</label>
				{set fieldNames = fieldNames+","+apisAddrZipCodeField/}
				<input {if dispMandatory=='mandatory'}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if} type="text" 
					  id="${apisAddrZipCodeField}" name="${apisAddrZipCodeField}" value="{if (!this.utils.isEmptyObject(this.data.addressBean.zipCode))}${this.data.addressBean.zipCode}{/if}" {on blur {fn:"docAddressEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+id+"_"+this.data.isAdultPsngr, docTypeKey : residence, isDocEnabled :  isDocEnabled, id:apisAddrZipCodeField, mandatory:dispMandatory} }/}/>
			{/if}
		</p>
		<!-- ADDRESS ZIP CODE END -->
		
		<!-- ADDRESS COUNTRY START -->
		<p class="pi_addrcnt">
			{if (address.countryAttributes.enabled == "Y")}
				<label class="pi_addrcnt">${labels.tx_pltg_text_Country}
				{if (address.countryAttributes.mandatory  == 'Y')}
					{if (residence == '')}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_DST_ADR_CNTRY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_ADR_CNTRY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="DST_ADRS_CNTRY_${traveller.paxNumber}_${id}"
								name="DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "DST_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" 
								   name="DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "DST_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_DST_INFNT_ADR_CNTRY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_DST_INFNT_ADR_CNTRY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_DST_ADRS_CNTRY_${traveller.paxNumber}_${id}"
								name="INFNT_DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_DST_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" 
								   name="INFNT_DST_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_DST_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
						{/if}
					{elseif (residence == 'RES_')/}
						{if (this.data.isAdultPsngr == 'Y')}
							<span id="SPAN_RES_ADR_CNTRY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_ADR_CNTRY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="RES_ADRS_CNTRY_${traveller.paxNumber}_${id}"
								name="RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "RES_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" 
								   name="RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "RES_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
						{else/}
							<span id="SPAN_RES_INFNT_ADR_CNTRY_${traveller.paxNumber}_${id}"  class="${dispMandatory}" >*</span>
							{set spanTagNames = "SPAN_RES_INFNT_ADR_CNTRY_"+traveller.paxNumber+"_"+id/}
							{if (isDocEnabled == 'false')}
								<input type="hidden" id="INFNT_RES_ADRS_CNTRY_${traveller.paxNumber}_${id}"
								name="INFNT_RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="TRUE" />
							{else/}
								{set validationValueFromScope = "INFNT_RES_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
								<input type="hidden"
								   id="INFNT_RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" 
								   name="INFNT_RES_ADRS_CNTRY_${traveller.paxNumber}_${id}" value="${validationValueFromScope}" />
							{/if}
							{set validationTag = "INFNT_RES_ADRS_CNTRY_"+traveller.paxNumber+"_"+id/}
						{/if}
					{/if}	
				{/if}
				</label>
				{set fieldNames = fieldNames+","+apisAddrCountryField/}
				{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
				{var alphabetStrArr = alphabetStr.split(";")/}
				<select  {if dispMandatory=='mandatory'}class="mandatory"{/if} name='${apisAddrCountryField}' id='${apisAddrCountryField}' {on blur {fn:"docAddressEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+id+"_"+this.data.isAdultPsngr, docTypeKey : residence, isDocEnabled :  isDocEnabled, id:apisAddrCountryField, mandatory:dispMandatory} }/}>
					<option value="">${labels.tx_merci_text_booking_select}</option>
					{if (!this.utils.isEmptyObject(rqstParams.countryFilteredMap))}
							{foreach alpha in alphabetStrArr}
								{var firstLetterMap = rqstParams.countryFilteredMap[alpha]/}										
								{if (firstLetterMap)}
								{foreach country in firstLetterMap}
									{if (country[0] != "ZZ")}
										<option value="${country[0]}" {if (!this.utils.isEmptyObject(this.data.addressBean.country) && this.data.addressBean.country == country[0])} selected = "selected"{/if}>${country[1]}</option>
									{/if}
								{/foreach}
								{/if}
							{/foreach}	
						{else/}
							{foreach country in gblLists.countryList}
								{if (country[0] != "ZZ")}
									<option value="${country[0]}" {if (!this.utils.isEmptyObject(this.data.addressBean.country) && this.data.addressBean.country == country[0])} selected = "selected"{/if}>${country[1]}</option>
								{/if}
							{/foreach}
						{/if}
				</select>					
			{/if}
		</p>
		<!-- ADDRESS COUNTRY END -->			
		
		<input id="${residence}field_${traveller.paxNumber}_${id}_${this.data.isAdultPsngr}" type="hidden" name="fieldNames"  value="${fieldNames}" />
		<input id="${residence}span_${traveller.paxNumber}_${id}_${this.data.isAdultPsngr}" type="hidden" name="spanTagNames" value="${spanTagNames}" />
		<input id="${residence}validation_${traveller.paxNumber}_${id}_${this.data.isAdultPsngr}" type="hidden" name="validationTag" value="${validationTag}" />
		</div>
	{/macro}
{/Template}