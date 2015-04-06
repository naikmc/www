{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true	
}}

	{macro main()}			
		{var labels = this.data.labels/}
		{var siteParameters = this.data.siteParameters/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		
		{var fieldNames = ""/}
		{var spanTagNames = ""/}
		{var docTag = ""/}
		{var validationTag = ""/}
		{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
		{var alphabetStrArr = alphabetStr.split(";")/}

		{set apisSectionBean = this.data.apisSectionBean/}
		{set traveller = this.data.traveller/}
		{if (apisSectionBean != null && apisSectionBean.hasSecondaryTravelDocumentsInDataMap != null && apisSectionBean.listVisaTravelDocuments != null)}
			{set countryName = ""/}
			{set countryCode = ""/}
			{set visaNo = 0/}
			{set isHiddenDoc = "false"/}
			{foreach doc in apisSectionBean.listVisaTravelDocuments}				
				{set apisEntryBean = doc/}				
				{if (apisEntryBean.structureIdAttributes.enabled == "Y" && (apisEntryBean.target.type == 'GLOBAL' || apisEntryBean.target.type == 'ELEMENT'))}
					{set identityDocument = doc.identityDocument/}
					{set visaNo = visaNo+1/}
					{set index =  apisSectionBean.lastSecondaryDocsIndex/}
					{set apisIndex =  apisEntryBean.index/}					
					{if (rqstParams.flowType.code == 'STANDARD_FLOW')}
						{set flowSuffix = 'BK'/}
					{else/}
						{set flowSuffix = 'RT'/}
					{/if}										
					{set mandatorySec = apisEntryBean.structureIdAttributes.mandatory/}	
					{set id = "VISA_"+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
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
						{set idDocuIssuePlaceField = "IDENTITY_DOCUMENT_PLACE_OF_ISSUING_"+traveller.paxNumber+"_"+id/}
						{set idDocuIssueDateField = "IDENTITY_DOCUMENT_ISSUE_DATE_"+traveller.paxNumber+"_"+id/}
						{set idDocuPlaceOfBirthField = "IDENTITY_DOCUMENT_PLACE_OF_BIRTH_"+traveller.paxNumber+"_"+id/}
						{set idDocuApplicableCountryField = "IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_"+traveller.paxNumber+"_"+id/}
					{else/}
						{set sectionId = "INFANT_APIS_SEC_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
						{set idDocuDocTypeField = "INFANT_IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+id/}
						{set idDocuDocNumberField = "INFANT_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+id/}
						{set idDocuIssuePlaceField = "INFANT_IDENTITY_DOCUMENT_PLACE_OF_ISSUING_"+traveller.paxNumber+"_"+id/}
						{set idDocuIssueDateField = "INFANT_IDENTITY_DOCUMENT_ISSUE_DATE_"+traveller.paxNumber+"_"+id/}
						{set idDocuPlaceOfBirthField = "INFANT_IDENTITY_DOCUMENT_PLACE_OF_BIRTH_"+traveller.paxNumber+"_"+id/}
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
					<input type="hidden" id="isVisaMandatoryField" data-name="${sectionId}"  data-value="${id}"  />
					{if (isDocEnabled == 'false')}
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}"  value="V"  />
					{/if}
					{var valueFromScope = rqstParams.requestBean[idDocuDocTypeField]/}
					{if (isDocEnabled == 'true')}
						<input type="hidden" name="${idDocuDocTypeField}" id="${idDocuDocTypeField}"  {if (!merciFunc.isEmptyObject(valueFromScope))} value="${valueFromScope}" {else/} value="" {/if} />
					{/if}
					{set docTag = idDocuDocTypeField/}					
					<h1 class="contentH1">${labels.tx_pltg_text_Visa}</h1>					
					<!-- DOCUMENT NUMBER START -->
					<p class="pi_pddocnum">
						{if (identityDocument.documentNumberAttributes.enabled == "Y")}
							<label class="pi_pddocnum">${labels.tx_pltg_text_visaNumber}
							{if (identityDocument.documentNumberAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_VISA_IDENTITY_DOCUMENT_NUMBER_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = "SPAN_VISA_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="VISA_DOCNO_${traveller.paxNumber}"
										name="VISA_DOCNO_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "VISA_DOCNO_"+traveller.paxNumber/}
										<input type="hidden"
										   id="VISA_DOCNO_${traveller.paxNumber}" 
										   name="VISA_DOCNO_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = "VISA_DOCNO_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_VISA_INFANT_IDENTITY_DOCUMENT_NUMBER_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = "SPAN_VISA_INFANT_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFANT_VISA_DOCNO_${traveller.paxNumber}"
										name="INFANT_VISA_DOCNO_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFANT_VISA_DOCNO_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFANT_VISA_DOCNO_${traveller.paxNumber}" 
										   name="INFANT_VISA_DOCNO_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = "INFANT_VISA_DOCNO_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuDocNumberField/}
							<input class="inputField widthFull" type="text" 
									  id="${idDocuDocNumberField}" name="${idDocuDocNumberField}" value="{if (!merciFunc.isEmptyObject(identityDocument.documentNumber))}${identityDocument.documentNumber}{/if}" {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "visa", docTypeUsed : "V", isDocEnabled :  isDocEnabled} }/}/>
						{/if}
					</p>
					<!-- DOCUMENT NUMBER END -->
					
					<!-- PLACE OF ISSUE START -->
					<p class="pi_pddocpi">
						{if (identityDocument.placeOfIssuingAttributes.enabled == "Y")}
							<label class="pi_pddocpi">${labels.tx_pltg_text_placeOfIssue}
							{if (identityDocument.placeOfIssuingAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_VISA_IDENTITY_DOCUMENT_PLACE_OF_ISSUING_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_IDENTITY_DOCUMENT_PLACE_OF_ISSUING_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}"
										name="VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "VISA_DOC_PLCE_OF_ISSUE_"+traveller.paxNumber/}
										<input type="hidden"
										   id="VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" 
										   name="VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"VISA_DOC_PLCE_OF_ISSUE_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_INFANT_VISA_IDENTITY_DOCUMENT_PLACE_OF_ISSUING_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_INFANT_VISA_IDENTITY_DOCUMENT_PLACE_OF_ISSUING_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFNT_VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}"
										name="INFNT_VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFNT_VISA_DOC_PLCE_OF_ISSUE_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFNT_VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" 
										   name="INFNT_VISA_DOC_PLCE_OF_ISSUE_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"INFNT_VISA_DOC_PLCE_OF_ISSUE_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuIssuePlaceField/}
							<select  name='${idDocuIssuePlaceField}' id='${idDocuIssuePlaceField}' {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "visa", docTypeUsed : "V", isDocEnabled :  isDocEnabled, id:idDocuIssuePlaceField, mandatory:dispMandatory} }/}>
								<option value="">${labels.tx_merci_text_booking_select}</option>
									{if (!merciFunc.isEmptyObject(rqstParams.countryFilteredMap))}
									{foreach alpha in alphabetStrArr}
										{var firstLetterMap = rqstParams.countryFilteredMap[alpha]/}										
										{if (firstLetterMap)}
										{foreach country in firstLetterMap}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.placeOfIssuing) && identityDocument.placeOfIssuing == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
										{/if}
									{/foreach}	
									{else/}
										{foreach country in gblLists.countryList}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.placeOfIssuing) && identityDocument.placeOfIssuing == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
									{/if}
							</select>
						{/if}
					</p>
					<!-- PLACE OF ISSUE END -->
					
					<!-- DOCUMENT ISSUE DATE START -->
						{if (this.data.servicingAPIS == 'Y')}
							{var issuingDate = "" /}
							{var issueYear = "" /}	
							{if (!merciFunc.isEmptyObject(identityDocument.issueDate) && !merciFunc.isEmptyObject(identityDocument.issueDate.newDate))}
								{set issuingDate = identityDocument.issueDate /}
							{/if}
							{if issuingDate != null}
								{set issueYear = identityDocument.issueDate.year /}
							{/if}	
						{/if}
					<p class="pi_pddocds">
						{if (identityDocument.issueDateAttributes.enabled == "Y")}
							<label class="pi_pddocds">${labels.tx_pltg_text_dateOfIssue}
							{if (identityDocument.issueDateAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_VISA_IDENTITY_DOCUMENT_ISSUE_DATE_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_IDENTITY_DOCUMENT_ISSUE_DATE_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="VISA_DOC_ISSUE_DATE_${traveller.paxNumber}"
										name="VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "VISA_DOC_ISSUE_DATE_"+traveller.paxNumber/}
										<input type="hidden"
										   id="VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" 
										   name="VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"VISA_DOC_ISSUE_DATE_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_INFANT_VISA_IDENTITY_DOCUMENT_ISSUE_DATE_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_INFANT_VISA_IDENTITY_DOCUMENT_ISSUE_DATE_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFNT_VISA_DOC_ISSUE_DATE_${traveller.paxNumber}"
										name="INFNT_VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFNT_VISA_DOC_ISSUE_DATE_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFNT_VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" 
										   name="INFNT_VISA_DOC_ISSUE_DATE_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"INFNT_VISA_DOC_ISSUE_DATE_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+",Year_"+idDocuIssueDateField/}
							{var dtFormat = siteParameters.siteInputDateFormat/}
							{set dtFormatArr = dtFormat.split(",")/}
							<div class="list">
								<ul class="input">
									{for var i=0; i< dtFormatArr.length ; i++}
										{if (dtFormatArr[i] == 'D')}
											<li class="pi_pddocdsd">
												<select  
													id="Day_${idDocuIssueDateField}" 
													name="Day_${idDocuIssueDateField}" 
													{on blur {
														fn: "pspt_frameDOB",
														args: {
															date: "Day_"+idDocuIssueDateField,
															month: "Month_"+idDocuIssueDateField,
															year: "Year_"+idDocuIssueDateField,
															fieldToSetValueIn: idDocuIssueDateField
														},
														scope: this.bookUtil
													}/}>
												{for var j=1; j<= 31 ; j++}
													<option value="${j}"  {if issuingDate != null && issuingDate.day == j}selected="selected"{/if}>${j}</option>
												{/for}
												</select>
											</li>	
										{/if}
										{if (dtFormatArr[i] == 'M')}
											<li class="pi_pddocdsm">
												<select 
													id="Month_${idDocuIssueDateField}" 
													name="Month_${idDocuIssueDateField}" 
													{on blur {
														fn: "pspt_frameDOB",
														args : {
															date: "Day_"+idDocuIssueDateField,
															month: "Month_"+idDocuIssueDateField,
															year: "Year_"+idDocuIssueDateField,
															fieldToSetValueIn:  idDocuIssueDateField
														},
														scope: this.bookUtil
													}/}>
												{foreach month in gblLists.slShortMonthList}
													<option value="${month_ct}" {if issuingDate != null && issuingDate.month == month_index}selected="selected"{/if}>${month[1]}</option>
												{/foreach}
												</select>
											</li>	
										{/if}
										{if (dtFormatArr[i] == 'Y')}
											<li class="pi_pddocdsy">
												<select 
													class='inputFieldYear' 
													id='Year_${idDocuIssueDateField}' 
													name='Year_${idDocuIssueDateField}'
													{on blur {
														fn: "onInputFieldYearBlur",
														args : {
															psptFrameDob: {
																date: "Day_"+idDocuIssueDateField,
																month : "Month_"+idDocuIssueDateField,
																year : "Year_"+idDocuIssueDateField,
																fieldToSetValueIn:  idDocuIssueDateField
															},
															docEnabledCheck: {
																paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, 
																docTypeKey : "visa", 
																docTypeUsed : "V", 
																isDocEnabled :  isDocEnabled
															}
														}
													}/}>
													{var presentDate = new Date()/}
													{set presentYear = presentDate.getFullYear()/}
													{var selectedYear = ''/}
													<option value="">${labels.tx_merci_text_booking_select}</option>
													{for var j=0; j<= 112 ; j++}
														{if selectedYear == ''}
															{set selectedYear = presentYear - j/}
														{/if}
														<option value="${presentYear - j}"  
															{if (!merciFunc.isEmptyObject(identityDocument.issueDate) && issueYear != null && issueYear == presentYear - j)}
																selected="selected"
																{set selectedYear = presentYear - j/}
															{/if}>
															${presentYear - j}
														</option>
													{/for}
												</select>
											</li>
										{/if}																					
									{/for}												  
								</ul>
								<input type="hidden" id="${idDocuIssueDateField}" name="${idDocuIssueDateField}" value=""/>
							</div>
						{/if}
					</p>
					<!-- DOCUMENT ISSUE DATE END -->
					
					<!-- DOCUMENT PLACE OF BIRTH START -->
					<p class="pi_pddocpb">
						{if (identityDocument.placeOfBirthAttributes.enabled == "Y")}
							<label class="pi_pddocpb">${labels.tx_pltg_text_visa_country}
							{if (identityDocument.placeOfBirthAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_VISA_IDENTITY_DOCUMENT_PLACE_OF_BIRTH_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_IDENTITY_DOCUMENT_PLACE_OF_BIRTH_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="VISA_DOC_PLACE_DOB_${traveller.paxNumber}"
										name="VISA_DOC_PLACE_DOB_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "VISA_DOC_PLACE_DOB_"+traveller.paxNumber/}
										<input type="hidden"
										   id="VISA_DOC_PLACE_DOB_${traveller.paxNumber}" 
										   name="VISA_DOC_PLACE_DOB_${traveller.paxNumber}" value="${validationValueFromScope}" />
									{/if}
									{set validationTag = validationTag+","+"VISA_DOC_PLACE_DOB_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_VISA_INFANT_IDENTITY_DOCUMENT_PLACE_OF_BIRTH_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_INFANT_IDENTITY_DOCUMENT_PLACE_OF_BIRTH_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFNT_VISA_DOC_PLACE_DOB_${traveller.paxNumber}"
										name="INFNT_VISA_DOC_PLACE_DOB_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFNT_VISA_DOC_PLACE_DOB_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFNT_VISA_DOC_PLACE_DOB_${traveller.paxNumber}" 
										   name="INFNT_VISA_DOC_PLACE_DOB_${traveller.paxNumber}" value="${validationValueFromScope}" />
									{/if}
									{set validationTag = validationTag+","+"INFNT_VISA_DOC_PLACE_DOB_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuPlaceOfBirthField/}
								<input class="inputField widthFull" type="text"  id="${idDocuPlaceOfBirthField}" name='${idDocuPlaceOfBirthField}' value="{if (!merciFunc.isEmptyObject(identityDocument.placeOfBirth))}${identityDocument.placeOfBirth}{/if}"/>
						{/if}
					</p>
					<!-- DOCUMENT PLACE OF BIRTH END -->
					
					<!-- APPLICABLE COUNTRY START -->
					<p class="pi_pddocac">
						{if (identityDocument.applicableCountryAttributes.enabled == "Y")}
							<label class="pi_pddocac">${labels.tx_pltg_text_applicableCountry}
							{if (identityDocument.applicableCountryAttributes.mandatory  == 'Y')}
								{if (this.data.isAdultPsngr == 'Y')}
									<span id="SPAN_VISA_IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}"
										name="VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "VISA_APPLCBLE_COUNTRY_"+traveller.paxNumber/}
										<input type="hidden"
										   id="VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" 
										   name="VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"VISA_APPLCBLE_COUNTRY_"+traveller.paxNumber/}
								{else/}
									<span id="SPAN_VISA_INFANT_IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_${traveller.paxNumber}"  class="${dispMandatory}" >*</span>
									{set spanTagNames = spanTagNames+","+"SPAN_VISA_INFANT_IDENTITY_DOCUMENT_APPLICABLE_COUNTRY_"+traveller.paxNumber/}
									{if (isDocEnabled == 'false')}
										<input type="hidden" id="INFNT_VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}"
										name="INFNT_VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" value="TRUE" />
									{else/}
										{set validationValueFromScope = "INFNT_VISA_APPLCBLE_COUNTRY_"+traveller.paxNumber/}
										<input type="hidden"
										   id="INFNT_VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" 
										   name="INFNT_VISA_APPLCBLE_COUNTRY_${traveller.paxNumber}" value="" />
									{/if}
									{set validationTag = validationTag+","+"INFNT_VISA_APPLCBLE_COUNTRY_"+traveller.paxNumber/}
								{/if}							
							{/if}
							</label>
							{set fieldNames = fieldNames+","+idDocuApplicableCountryField/}
							<select  name='${idDocuApplicableCountryField}' id='${idDocuApplicableCountryField}' {on blur {fn:"docEnabledCheck",args : {paxIdPaxType: traveller.paxNumber+"_"+this.data.isAdultPsngr, docTypeKey : "visa", docTypeUsed : "V", isDocEnabled :  isDocEnabled, id:idDocuApplicableCountryField, mandatory:dispMandatory} }/}>
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
					<input id="visa_field_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="fieldNames"  value="${fieldNames}" />
					<input id="visa_span_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="spanTagNames" value="${spanTagNames}" />
					<input id="visa_docTag_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="docTag" value="${docTag}" />
					<input id="visa_validation_${traveller.paxNumber}_${this.data.isAdultPsngr}" type="hidden" name="validationTag" value="${validationTag}" />
					</div>
				{/if}
			{/foreach}
		{/if}		
	{/macro}
{/Template}