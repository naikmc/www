{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisKnwt',
	$extends: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript']	
}}

	{macro main()}			
		{var labels = this.data.labels/}
		{var siteParameters = this.data.siteParameters/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{var fieldNames = ""/}
		{var spanTagNames = ""/}
		{var validationTag = ""/}
		{var docTag = ""/}
		

		{set apisSectionBean = this.data.apisSectionBean/}
		{set traveller = this.data.traveller/}
		{if (apisSectionBean != null && apisSectionBean.hasSecondaryTravelDocumentsInDataMap != null && apisSectionBean.listKnwtTravelDocuments != null)}
			{set countryName = ""/}
			{set countryCode = ""/}			
			{foreach doc in apisSectionBean.listKnwtTravelDocuments}				
				{set apisEntryBean = doc/}				
				{if (apisEntryBean.structureIdAttributes.enabled == "Y" && (apisEntryBean.target.type == 'GLOBAL' || apisEntryBean.target.type == 'ELEMENT'))}
					{set identityDocument = doc.identityDocument/}
					{set apisIndex =  apisEntryBean.index/}
					{if (rqstParams.flowType.code == 'STANDARD_FLOW')}
						{set flowSuffix = 'BK'/}
					{else/}
						{set flowSuffix = 'RT'/}
					{/if}										
					{set mandatorySec = apisEntryBean.structureIdAttributes.mandatory/}	
					{set id = "KNWT_"+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
					{set isDocEnabled = "false"/}
					{set dispMandatory = "mandatory"/}
					{if (apisEntryBean.structureIdAttributes.mandatory == "N")}
						{set isDocEnabled = "true"/}
						{set dispMandatory = "displayNone"/}
					{/if}
					{if (this.data.isAdultPsngr == 'Y')}
						{set sectionId = "APIS_SEC_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
						{set idDocuDocTypeField = "IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+id/}
						{set idDocuDocNumberField = "IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+id/}						
						{set idDocuApplicableCountryField = "IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_"+traveller.paxNumber+"_"+id/}
					{else/}
						{set sectionId = "INFANT_APIS_SEC_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
						{set idDocuDocTypeField = "INFANT_IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+id/}
						{set idDocuDocNumberField = "INFANT_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+id/}
						{set idDocuApplicableCountryField = "INFANT_IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_"+traveller.paxNumber+"_"+id/}
					{/if}
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
					<input type="hidden" name="${sectionId}"  value="${id}"  />
					{if (isDocEnabled == 'false')}
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}"  value="V"  />
					{/if}
					{var valueFromScope = rqstParams.requestBean[idDocuDocTypeField]/}
					{if (isDocEnabled == 'true')}
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}"  value="${valueFromScope}"  />
					{/if}
					{set docTag = idDocuDocTypeField/}					 
					<h1 class="contentH1">${labels.tx_pltg_text_knownTravellerNumber}</h1>
					
					<!-- DOCUMENT NUMBER START -->
					<p class="pi_docnum">
						{if (identityDocument.documentNumberAttributes.enabled == "Y")}
							<label class="pi_docnum">${labels.tx_pltg_text_documentNumber}
							{if (identityDocument.documentNumberAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									{set spanTagNames = "SPAN_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber/}
									{set validationTag = "KNWT_DOCNO_"+traveller.paxNumber/}
								{else/}
									{set spanTagNames = "SPAN_INFANT_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber/}
									{set validationTag = "INFNT_KNWT_DOCNO_"+traveller.paxNumber/}
								{/if}							
									{call mandateInfo(this.data.isAdultPsngr,'IDENTITY_DOCUMENT_NUMBER','KNWT_DOCNO',identityDocument.documentNumberAttributes.mandatory,mandatorySec,identityDocument.documentNumber,idDocuDocNumberField,traveller.paxNumber) /}
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuDocNumberField/}
							<input class="inputField widthFull" type="text" 
									  id="${idDocuDocNumberField}" name="${idDocuDocNumberField}" value="{if (!merciFunc.isEmptyObject(identityDocument.documentNumber))}${identityDocument.documentNumber}{/if}" {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "knwt", docTypeUsed : "K", isDocEnabled :  isDocEnabled} }/}/>
						{/if}
					</p>
					<!-- DOCUMENT NUMBER END -->
					
					<!-- APPLICABLE COUNTRY START -->
					<p class="pi_docappl">
						{if (identityDocument.applicableCountryAttributes.enabled == "Y")}
							<label class="pi_docappl">${labels.tx_pltg_text_applicableCountry}
							{if (identityDocument.applicableCountryAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									{set spanTagNames = spanTagNames+","+"SPAN_KNWT_APLCBLECNTRY_"+traveller.paxNumber/}
									{set validationTag = validationTag+","+"KNWT_APLCBLECNTRY_"+traveller.paxNumber/}
								{else/}
									{set spanTagNames = spanTagNames+","+"SPAN_INFNT_KNWT_APLCBLECNTRY_"+traveller.paxNumber/}
									{set validationTag = validationTag+","+"INFNT_KNWT_APLCBLECNTRY_"+traveller.paxNumber/}
								{/if}							
									{call mandateInfo(this.data.isAdultPsngr,'KNWT_APLCBLECNTRY','KNWT_APLCBLECNTRY',identityDocument.applicableCountryAttributes.mandatory,mandatorySec,identityDocument.applicableCountry,idDocuApplicableCountryField,traveller.paxNumber) /}
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuApplicableCountryField/}
							{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
							{var alphabetStrArr = alphabetStr.split(";")/}
							<select  name='${idDocuApplicableCountryField}' id='${idDocuApplicableCountryField}' {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "knwt", docTypeUsed : "K", isDocEnabled :  isDocEnabled} }/}>
								<option value="">${labels.tx_merci_text_booking_select}</option>
									{if (!merciFunc.isEmptyObject(rqstParams.countryFilteredMap))}
									{foreach alpha in alphabetStrArr}
										{var firstLetterMap = rqstParams.countryFilteredMap[alpha]/}										
										{if (firstLetterMap)}
										{foreach country in firstLetterMap}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.applicableCountry) && identityDocument.applicableCountry == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
										{/if}
									{/foreach}	
									{else/}
										{foreach country in gblLists.countryList}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.applicableCountry) && identityDocument.applicableCountry == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
									{/if}
							</select>
						{/if}
					</p>
					<!-- APPLICABLE COUNTRY END -->
					
					<input id="knwt_field_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="fieldNames"  value="${fieldNames}" />
					<input id="knwt_span_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="spanTagNames" value="${spanTagNames}" />
					<input id="knwt_docTag_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="docTag" value="${docTag}" />
					<input id="knwt_validation_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="validationTag" value="${validationTag}" />
					</div>
				{/if}
			{/foreach}
		{/if}		
	{/macro}
	{macro mandateInfo(isAdultPsngr,tag,knwtTag,KNWTRequirement,mandatorySec,attrib,field,paxNum)}
		{if (this.data.servicingAPIS == 'Y')}
			{if (KNWTRequirement == 'Y' && mandatorySec == 'Y')}				
				{if (attrib != null)}				
					<span class="required">*</span>
				{/if}
				{if (paxNum == 1)}
					<input type="hidden" name="hidden${field}" value="TRUE" />
				{/if}				
			{/if}
			{if (KNWTRequirement == 'Y' && mandatorySec != 'Y')}
				<span class="required">*</span>
				<input type="hidden" name="hidden${field}" value="FALSE" />
			{/if}
		{else/}
			{if (isAdultPsngr == 'Y')}
				<span id="SPAN_${tag}_${paxNum}"  class="${dispMandatory}" >*</span>				
				{if (isDocEnabled == 'false')}
					<input type="hidden" id="${knwtTag}_${paxNum}"
					name="${knwtTag}_${paxNum}" value="TRUE" />
				{else/}
					{set validationValueFromScope = knwtTag+"_"+paxNum/}
					<input type="hidden"
					   id="${knwtTag}_${paxNum}" 
					   name="${knwtTag}_${paxNum}" value="${validationValueFromScope}" />
				{/if}				
			{else/}
				<span id="SPAN_INFANT_+tag+"_"+${paxNum}"  class="${dispMandatory}" >*</span>				
				{if (isDocEnabled == 'false')}
					<input type="hidden" id="INFNT_${knwtTag}_${paxNum}"
					name="INFNT_${knwtTag}_${paxNum}" value="TRUE" />
				{else/}
					{set validationValueFromScope = "INFNT_"+tag+paxNum/}
					<input type="hidden"
					   id="INFNT_${knwtTag}_${paxNum}" 
					   name="INFNT_${knwtTag}_${paxNum}" value="${validationValueFromScope}" />
				{/if}				
			{/if}
		{/if}
	{/macro}
{/Template}