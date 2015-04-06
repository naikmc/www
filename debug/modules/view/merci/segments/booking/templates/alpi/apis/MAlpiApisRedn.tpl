{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisRedn',
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
		{if (apisSectionBean != null && apisSectionBean.hasSecondaryTravelDocumentsInDataMap != null && apisSectionBean.listRednTravelDocuments != null)}
			{set countryName = ""/}
			{set countryCode = ""/}
			{foreach doc in apisSectionBean.listRednTravelDocuments}				
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
					{set id = "REDN_"+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
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
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}" />
					{/if}
					{var valueFromScope = rqstParams.requestBean[idDocuDocTypeField]/}
					{if (isDocEnabled == 'true')}
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}"  {if (!merciFunc.isEmptyObject(valueFromScope))} value="${valueFromScope}"{/if} />
					{/if}
					{set docTag = idDocuDocTypeField/}					 
					<h1 class="contentH1">${labels.tx_pltg_text_redressNumber}</h1>					
					<!-- DOCUMENT NUMBER START -->
					{var isDocNumMandatory=false /}
					<p class="pi_pddocnum">
						{if (identityDocument.documentNumberAttributes.enabled == "Y")}
							<label class="pi_pddocnum">${labels.tx_pltg_text_documentNumber}
							{if (identityDocument.documentNumberAttributes.mandatory  == 'Y')}
								{set isDocNumMandatory="mandatory" /}
								{if (this.data.isAdultPsngr == 'Y')}
									{set spanTagNames = "SPAN_REDN_ID_DOC_NO_"+traveller.paxNumber/}
									{set validationTag = "REDN_DOCNO_"+traveller.paxNumber/}
								{else/}
									{set spanTagNames = "SPAN_INFNT_REDN_ID_DOC_NO_"+traveller.paxNumber/}
									{set validationTag = "INFNT_REDN_DOCNO_"+traveller.paxNumber/}
								{/if}							
									{call mandateInfo(this.data.isAdultPsngr,'REDN_ID_DOC_NO','REDN_DOCNO',identityDocument.documentNumberAttributes.mandatory,mandatorySec,identityDocument.documentNumber,idDocuDocNumberField,traveller.paxNumber) /}			
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuDocNumberField/}
							<input class="inputField widthFull" type="text" 
									  id="${idDocuDocNumberField}" name="${idDocuDocNumberField}" value="{if (!merciFunc.isEmptyObject(identityDocument.documentNumber))}${identityDocument.documentNumber}{/if}" {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "redn", docTypeUsed : "R", isDocEnabled :  isDocEnabled,  id:idDocuDocNumberField} }/}/>
						{/if}
					</p>
					<!-- DOCUMENT NUMBER END -->
					
					<!-- APPLICABLE COUNTRY START -->
					{var isCountryMandatory=false /}
					<p class="pi_pddocacs">
						{if (identityDocument.applicableCountryAttributes.enabled == "Y")}
							<label class="pi_pddocacs">${labels.tx_pltg_text_applicableCountry}
							{if (identityDocument.applicableCountryAttributes.mandatory  == 'Y')}
								{set isCountryMandatory="mandatory" /}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_REDN_APLCBLECNTRY_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_REDN_APLCBLECNTRY_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="REDN_APCLBECNTRY_${traveller.paxNumber}"
										name="REDN_APCLBECNTRY_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "REDN_APCLBECNTRY_"+traveller.paxNumber/}
										<input type="hidden"
										   id="REDN_APCLBECNTRY_${traveller.paxNumber}" 
										   name="REDN_APCLBECNTRY_${traveller.paxNumber}" value="${validationValueFromScope}" />
									{/if}
									{set validationTag = validationTag+","+"REDN_APCLBECNTRY_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_REDN_INFANT_APLCBLECNTRY_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_REDN_INFANT_APLCBLECNTRY_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFNT_REDN_APCLBECNTRY_${traveller.paxNumber}"
										name="INFNT_REDN_APCLBECNTRY_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFNT_REDN_APCLBECNTRY_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFNT_REDN_APCLBECNTRY_${traveller.paxNumber}" 
										   name="INFNT_REDN_APCLBECNTRY_${traveller.paxNumber}" value="${validationValueFromScope}" />
									{/if}
									{set validationTag = validationTag+","+"INFNT_REDN_APCLBECNTRY_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuApplicableCountryField/}
							{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
							{var alphabetStrArr = alphabetStr.split(";")/}
							<select  name='${idDocuApplicableCountryField}' id='${idDocuApplicableCountryField}' {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "redn", docTypeUsed : "R", isDocEnabled :  isDocEnabled, id:idDocuApplicableCountryField} }/}>
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
					<input id="redn_field_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="fieldNames"  value="${fieldNames}" />
					<input id="redn_span_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="spanTagNames" value="${spanTagNames}" />
					<input id="redn_docTag_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="docTag" value="${docTag}" />
					<input id="redn_validation_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="validationTag" value="${validationTag}" />
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