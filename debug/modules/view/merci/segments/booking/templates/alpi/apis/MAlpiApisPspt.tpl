{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPspt',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true,
	$wlibs : {
	    'cust': 'modules.view.merci.common.widgets.CustomWidgetLib'
	  }
}}

	{macro main()}
		{var labels = this.data.labels/}
		{var siteParameters = this.data.siteParameters/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{set apisSectionBean = this.data.apisSectionBean/}
		{set traveller = this.data.traveller/}

		//added as a part of the fix for the PTR 07856144
		{set middleNameDisplayed = false /}

		<input type="hidden" name="TRAVELLER_NUMBER" value="${rqstParams.listTravellerBean.travellerBean.length}" />
		{if (apisSectionBean != null && apisSectionBean.hasPrimaryTravelDocumentsInDataMap != null && apisSectionBean.listPrimaryTravelDocuments != null)}
			{foreach doc in apisSectionBean.listPrimaryTravelDocuments}
				{set identityDocument = doc.identityDocument/}
				{set apisEntryBean = doc/}
				{set ApisPSPT = 'FALSE'/}
				{if (apisEntryBean.index <= 5 && apisEntryBean.structureIdAttributes.enabled == "Y")}
					{if (apisEntryBean.structureIdAttributes.PSPTRequirement == 'OPTIONAL' || apisEntryBean.structureIdAttributes.PSPTRequirement == 'MANDATORY')}
						{set ApisPSPT = 'TRUE'/}
					{/if}
					{if (!(ApisPSPT == 'FALSE' && apisSectionBean.hasIdenOrNatn))}
						{if (rqstParams.apisDocType == 'SL_IDENTITY_DOCUMENT_SABRE')}
							{set idDocList = gblLists.docListSabre/}
						{else/}
							{set idDocList = gblLists.docList/}
						{/if}
						{set enabledMiddleName = identityDocument.middleNameAttributes.enabled/}
						{set enabledGender = identityDocument.genderAttributes.enabled/}
						{set enabledDoB = identityDocument.dateOfBirthAttributes.enabled/}
						{set enabledNationality = identityDocument.nationalityAttributes.enabled/}
						{set enabledDocType = identityDocument.documentTypeAttributes.enabled/}
						{set enabledDocNum = identityDocument.documentNumberAttributes.enabled/}
						{set enabledIssCountry = identityDocument.issuingCountryAttributes.enabled/}
						{set enabledExpDate = identityDocument.expiryDateAttributes.enabled/}

						{set mandatorySec = apisEntryBean.structureIdAttributes.mandatory/}
						{set mandatoryMiddleName = identityDocument.middleNameAttributes.mandatory/}
						{set mandatoryGender = identityDocument.genderAttributes.mandatory/}
						{set mandatoryDoB = identityDocument.dateOfBirthAttributes.mandatory/}
						{set mandatoryNationality = identityDocument.nationalityAttributes.mandatory/}
						{set mandatoryDocType = identityDocument.documentTypeAttributes.mandatory/}
						{set mandatoryDocNum = identityDocument.documentNumberAttributes.mandatory/}
						{set mandatoryIssCountry = identityDocument.issuingCountryAttributes.mandatory/}
						{set mandatoryExpDate = identityDocument.expiryDateAttributes.mandatory/}

						<h1 class="contentH1">${labels.tx_pltg_text_travelDocuments}</h1>
						{if (rqstParams.flowType.code == 'STANDARD_FLOW')}
							{set flowSuffix = 'BK'/}
						{else/}
							{set flowSuffix = 'RT'/}
						{/if}
						{set apisIndex = apisEntryBean.index/}
						{set id = "PSPT_"+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
						<input type="hidden" name="apisIndId" id="apisIndId" value="${apisEntryBean.index}" />
						{if (this.data.isAdultPsngr == 'Y')}
							{set sectionId = "APIS_PR_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
							{set idDocuFNameField = "IDENTITY_DOCUMENT_FIRST_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuLNameField = "IDENTITY_DOCUMENT_LAST_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuMNameField = "IDENTITY_DOCUMENT_MIDDLE_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuGenderField = "IDENTITY_DOCUMENT_GENDER_"+traveller.paxNumber+"_"+id/}
							{set idDocuDOBField = "IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+traveller.paxNumber+"_"+id/}
							{set idDocuNationalityField = "IDENTITY_DOCUMENT_NATIONALITY_"+traveller.paxNumber+"_"+id/}
							{set idDocuDocTypeField = "IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+id/}
							{set idDocuDocNumberField = "IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+id/}
							{set idDocuIssCountryField = "IDENTITY_DOCUMENT_ISSUING_COUNTRY_"+traveller.paxNumber+"_"+id/}
							{set idDocuExpDateField = "IDENTITY_DOCUMENT_EXPIRY_DATE_"+traveller.paxNumber+"_"+id/}
							{set idenNationality = "IDENTITY_DOCUMENT_NATIONALITY_"+traveller.paxNumber+"_"+apisIndex/}
							{set idenDocType = "IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+apisIndex/}
						  {set idenDocNumber = "IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+apisIndex/}
						  {set idenExpDate = "IDENTITY_DOCUMENT_EXPIRY_DATE_"+traveller.paxNumber+"_"+apisIndex/}
							<input type="hidden" name="${sectionId}"  value="${id}"  />
						{else/}
							{set sectionId = "INFANT_APIS_PR_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
							{set idDocuFNameField = "INFANT_IDENTITY_DOCUMENT_FIRST_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuLNameField = "INFANT_IDENTITY_DOCUMENT_LAST_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuMNameField = "INFANT_IDENTITY_DOCUMENT_MIDDLE_NAME_"+traveller.paxNumber+"_"+id/}
							{set idDocuGenderField = "INFANT_IDENTITY_DOCUMENT_GENDER_"+traveller.paxNumber+"_"+id/}
							{set idDocuDOBField = "INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+traveller.paxNumber+"_"+id/}
							{set idDocuNationalityField = "INFANT_IDENTITY_DOCUMENT_NATIONALITY_"+traveller.paxNumber+"_"+id/}
							{set idDocuDocTypeField = "INFANT_IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+id/}
							{set idDocuDocNumberField = "INFANT_IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+id/}
							{set idDocuIssCountryField = "INFANT_IDENTITY_DOCUMENT_ISSUING_COUNTRY_"+traveller.paxNumber+"_"+id/}
							{set idDocuExpDateField = "INFANT_IDENTITY_DOCUMENT_EXPIRY_DATE_"+traveller.paxNumber+"_"+id/}
							{set idenNationality = "IDENTITY_DOCUMENT_NATIONALITY_"+traveller.paxNumber+"_"+apisIndex/}
              {set idenDocType = "IDENTITY_DOCUMENT_TYPE_"+traveller.paxNumber+"_"+apisIndex/}
              {set idenDocNumber = "IDENTITY_DOCUMENT_NUMBER_"+traveller.paxNumber+"_"+apisIndex/}
              {set idenExpDate = "IDENTITY_DOCUMENT_EXPIRY_DATE_"+traveller.paxNumber+"_"+apisIndex/}
							<input type="hidden" name="${sectionId}"  value="${id}"  />
						{/if}
						{var classValue= "" /}
						{var paxIdentity= "" /}
						{if (this.data.servicingAPIS == 'Y')}
							{if (this.data.paxClicked == traveller.paxNumber)}
								{set classValue= "" /}
							{elseif (mandatorySec == 'Y' && this.data.paxClicked != traveller.paxNumber)/}
								{set classValue= "" /}
							{else/}
								{set classValue= "displayNone" /}
							{/if}
							<input id="${idDocuFNameField}"  type="hidden" name="${idDocuFNameField}" value="${this.data.traveller.identityInformation.firstName}" />
							{var apisLastName = this.data.traveller.identityInformation.apisLastName/}
							{if (apisLastName == null)}
								{set apisLastName = this.data.traveller.identityInformation.lastName/}
							{/if}
							<input id="${idDocuLNameField}"  type="hidden" name="${idDocuLNameField}" value="${apisLastName}" />
							<input type="hidden" name="hidDispPaxNumber" id="hidDispPaxNumber" value="${traveller.paxNumber}" />
							<input type="hidden" name="flowtype" id="flowtype" value="service" />
							<input type="hidden" name="numberOfTravellers" id="numberOfTravellers" value="${rqstParams.listTravellerBean.travellerBean.length}" />
							{if (this.data.isAdultPsngr == 'Y')}
								{set paxIdentity = traveller.identityInformation /}
							{else/}
								{set paxIdentity = traveller.infant /}
							{/if}
						{else/}
							<input id="${idDocuFNameField}"  type="hidden" name="${idDocuFNameField}" value="" />
							<input id="${idDocuLNameField}"  type="hidden" name="${idDocuLNameField}" value="" />
						{/if}
						<div class="${classValue}">
						<!-- MIDDLE NAME START -->
						{set middleNameDisplayed = this.getMiddleNameDisplayed() /}
						{if (enabledMiddleName == "Y" && identityDocument.category == "PSPT" && !middleNameDisplayed)}
							<p class="pi_pdmn">
								<label class="pi_pdmn">${labels.tx_pltg_text_MiddleName}
									{call mandateInfo(mandatoryMiddleName,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_MDLENAME','',identityDocument.middleNameAttributes.PSPTRequirement,mandatorySec,identityDocument.middleName,idDocuMNameField,traveller.paxNumber) /}
								</label>
									<input {if this.utils.booleanValue(mandatoryMiddleName)} class="inputField widthFull mandatory" {on blur {fn: 'toggleMandatoryBorder', args: {id:idDocuMNameField}}/}{else/}class="inputField widthFull"{/if} type="text"  name="${idDocuMNameField}" id="${idDocuMNameField}" value="
									{if !merciFunc.isEmptyObject(identityDocument.middleName)}${identityDocument.middleName}{/if} {if merciFunc.isEmptyObject(identityDocument.middleName) && this.data.isAdultPsngr == 'Y'}${traveller.identityInformation.middleName}{/if}" />
									{if this.utils.booleanValue(mandatoryMiddleName)} <input type="hidden" id="idDocuMNameField" value="${idDocuMNameField}" /> {/if}
							</p>
						{/if}
						<!-- MIDDLE NAME END -->

						<!-- GENDER START -->
						{if (enabledGender == "Y")}
							<p class="pi_pdgen">
								<label class="pi_pdgen">${labels.tx_pltg_text_Gender}
									{call mandateInfo(mandatoryGender,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_GNDR','',identityDocument.genderAttributes.PSPTRequirement,mandatorySec,identityDocument.gender,idDocuGenderField,traveller.paxNumber) /}
								</label>
								{var gender = "" /}
								{if !merciFunc.isEmptyObject(identityDocument.gender)}
									{set gender = (identityDocument.gender) /}
								{elseif !merciFunc.isEmptyObject(traveller.identityInformation.gender) /}
									{set gender = (traveller.identityInformation.gender) /}
								{/if}
								{var idGender = "" /}
								{if (this.data.isAdultPsngr == 'Y')}
									{set idGender = 'psptgender'+traveller.paxNumber /}
								{else/}
									{set idGender = 'infandpsptgender'+traveller.paxNumber/}
								{/if}
								<select  name='${idDocuGenderField}' id='${idGender}'{if this.utils.booleanValue(mandatoryGender)} class="mandatory" {on change {fn: 'toggleMandatoryBorder', args: {id:idGender}}/}{/if}>
									<option value="">${labels.tx_pltg_text_TravelDocumentGenderDefaultSelect}</option>
										<option value="M" {if !merciFunc.isEmptyObject(gender) && gender == 'M'}selected="selected"{/if}>${labels.tx_pltg_text_Male}</option>
										<option value="F" {if !merciFunc.isEmptyObject(gender) && gender == 'F'}selected="selected"{/if}>${labels.tx_pltg_text_Female}</option>
								</select>
								{if this.utils.booleanValue(mandatoryGender)} <input type="hidden" id="idGender" value="${idGender}" /> {/if}
							</p>
						{/if}
						<!-- GENDER END -->
						<!-- DATE OF BIRTH START -->
						{if (this.data.servicingAPIS == 'Y')}
							{var dobDate = "" /}
							{var formattedDateOfBirth = "" /}
							{if (paxIdentity.dateOfBirth != null)}
								{var formattedDateOfBirth = paxIdentity.dateOfBirth.formatDateAsYYYYMMdd+"0000" /}
							{/if}
							{if (formattedDateOfBirth != "")}
								{if (!merciFunc.isEmptyObject(identityDocument.dateOfBirth) && !merciFunc.isEmptyObject(identityDocument.dateOfBirth.newDate))}
									{set dobDate = identityDocument.dateOfBirth /}
								{/if}
							{else/}
								{set dobDate = paxIdentity.dateOfBirth /}
							{/if}
						{/if}
						{if (enabledDoB == "Y")}
							<p class="pi_pddob">
								<label class="pi_pddob">
									${labels.tx_pltg_text_DateOfBirth}
									{var dobDate = identityDocument.dateOfBirth/}
									{if (merciFunc.isEmptyObject(dobDate) && traveller.identityInformation.dateOfBirth != null)}
										{var dobDate = traveller.identityInformation.dateOfBirth /}
									{/if}
									{if (dobDate != null)}
										{set attrib = dobDate.year /}
									{/if}
									{call mandateInfo(mandatoryDoB,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_DOB','',mandatoryDoB,mandatorySec,attrib,idDocuDOBField,traveller.paxNumber) /}
								</label>

								<input type="hidden" id='${idDocuDOBField}' name="${idDocuDOBField}" value="" />
								{var dtFormat = siteParameters.siteInputDateFormat/}
								{set dtFormatArr = dtFormat.split(",")/}
								<div class="list">
									<ul class="input">
										{for var i=0; i< dtFormatArr.length ; i++}
											{if (dtFormatArr[i] == 'D')}
												<li class="pi_pddobd">
													{var selectedDay = ''/}
													<select  id="Day_${idDocuDOBField}" name="Day_${idDocuDOBField}" {on blur {fn:"setDayField",args : {date: "Day_"+idDocuDOBField,month : "Month_"+idDocuDOBField,year : "Year_"+idDocuDOBField,fieldToSetValueIn :  idDocuDOBField} }/}>
														{for var j=1; j<= 31 ; j++}
																{if selectedDay == ''}
																	{set selectedDay = j/}
																{/if}
																<option value="${j}"
																	{if dobDate != null && dobDate.day == j}
																		selected="selected"
																		{set selectedDay = j/}
																	{/if}>
																	${j}
																</option>
														{/for}
													</select>

													{if this.data.infant != null
														|| !this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[this.data.traveller.paxType.code][0]}
														<input
															type="hidden"
															name="{if this.data.infant == null}paxDobDay_{else/}infantDobDay_{/if}${this.data.traveller.paxNumber}"
															value = "${selectedDay}"/>
													{/if}
												</li>
											{/if}
											{if (dtFormatArr[i] == 'M')}
												<li class="pi_pddobm">
													{var selectedMonth = ''/}
													<select  id="Month_${idDocuDOBField}" name="Month_${idDocuDOBField}" {on blur {fn:"setMonthField",args : {date: "Day_"+idDocuDOBField,month : "Month_"+idDocuDOBField,year : "Year_"+idDocuDOBField,fieldToSetValueIn :  idDocuDOBField} }/}>
														{foreach month in gblLists.slShortMonthList}
																<option value="${month_index}"
																	{if selectedMonth == ''}
																		{set selectedMonth = month_index/}
																	{/if}
																	{if dobDate != null && dobDate.month == month_index}
																		selected="selected"
																		{set selectedMonth = month_index/}
																	{/if}>
																	${month[1]}
																</option>
														{/foreach}
													</select>

													{if this.data.infant != null
														|| !this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[this.data.traveller.paxType.code][0]}
														<input
															type="hidden"
															name="{if this.data.infant == null}paxDobMonth_{else/}infantDobMonth_{/if}${this.data.traveller.paxNumber}"
															value = "${selectedMonth}"/>
													{/if}
												</li>
											{/if}
											{if (dtFormatArr[i] == 'Y')}
												{var presentDate = new Date()/}
												{set presentYear = presentDate.getFullYear()/}
												<li class="pi_pddoby">
													{var selectedYear = '' /}
													{if (!merciFunc.isEmptyObject(dobDate) && !merciFunc.isEmptyObject(dobDate.year)) }
														{var selectedYear = dobDate.year /}
													{/if}
													<select  id="Year_${idDocuDOBField}" name="Year_${idDocuDOBField}" {on blur {fn:"setYearField",args : {date: "Day_"+idDocuDOBField,month : "Month_"+idDocuDOBField,year : "Year_"+idDocuDOBField,fieldToSetValueIn :  idDocuDOBField} }/}>
														{for var j=0; j<= 112 ; j++}
																{if selectedYear == ''}
																	{set selectedYear = presentYear - j/}
																{/if}
																<option value="${presentYear - j}"
																	{if (!merciFunc.isEmptyObject(identityDocument.dateOfBirth) && !merciFunc.isEmptyObject(identityDocument.dateOfBirth.year) && identityDocument.dateOfBirth.year == presentYear - j) || (selectedYear == presentYear - j)}
																		selected="selected"
																		{set selectedYear = presentYear - j/}
																	{/if}>
																	${presentYear - j}
																</option>
														{/for}
													</select>

													{if this.data.infant != null
														|| !this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[this.data.traveller.paxType.code][0]}
														<input
															type="hidden"
															name="{if this.data.infant == null}paxDobYear_{else/}infantDobYear_{/if}${this.data.traveller.paxNumber}"
															value = "${selectedYear}"/>
													{/if}
												</li>
											{/if}
										{/for}
									</ul>
									{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
										{@cust:SpinWheel {
											id : "SpinWheelApis_"+idDocuDOBField,
											controlInputs : {"d": "Day_"+idDocuDOBField,"m":"Month_"+idDocuDOBField,"y":"Year_"+idDocuDOBField}
										}/}
									{/if}
								</div>
							</p>
						{/if}
						<!-- DATE OF BIRTH END -->
						<!-- NATIONALITY START -->
						{if (enabledNationality == "Y")}
							<p class="pi_pdnat">
								<label class="pi_pdnat">${labels.tx_pltg_text_nationalityCountryCode}
									{call mandateInfo(mandatoryNationality,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_NATIONALITYCNTRYCDE','',identityDocument.nationalityAttributes.PSPTRequirement,mandatorySec,identityDocument.nationality,idDocuNationalityField,traveller.paxNumber) /}
								</label>
								{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
								{var alphabetStrArr = alphabetStr.split(";")/}
								<select  name='${idDocuNationalityField}' id='${idDocuNationalityField}' {on change {fn:"fillNationalityValues" ,args : {org: siteParameters.siteHidePaxNationality, paxno : this.data.traveller.paxNumber, id:idDocuNationalityField, docCheck: this.data.isAdultPsngr}} /}>
									<option value="">${labels.tx_merci_text_booking_select}</option>
									{if (!merciFunc.isEmptyObject(rqstParams.countryFilteredMap))}
									{foreach alpha in alphabetStrArr}
										{var firstLetterMap = rqstParams.countryFilteredMap[alpha]/}
										{if (firstLetterMap)}
										{foreach country in firstLetterMap}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.nationality) && identityDocument.nationality == country[0]) || (!merciFunc.isEmptyObject(rqstParams[idenNationality]) && rqstParams[idenNationality] == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
										{/if}
									{/foreach}
									{else/}
										{foreach country in gblLists.countryList}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.nationality) && identityDocument.nationality == country[0])|| (!merciFunc.isEmptyObject(rqstParams[idenNationality]) && rqstParams[idenNationality] == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
									{/if}
								</select>
								 {if this.utils.booleanValue(mandatoryNationality)} <input type="hidden" id="idDocuNationalityField" value="${idDocuNationalityField}" /> {/if}
							</p>
						{/if}
						<!-- NATIONALITY END -->
						<!-- DOCUMENT TYPE START -->
						{if (enabledDocType == "Y")}
							<p class="pi_pddocty">
								<label class="pi_pddocty">${labels.tx_pltg_text_documentType}
									{call mandateInfo(mandatoryDocType,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_DCTTYPE',siteParameters.isGdsUsed,identityDocument.documentTypeAttributes.PSPTRequirement,mandatorySec,identityDocument.documentType,idDocuDocTypeField,traveller.paxNumber) /}
								</label>
								<select  name='${idDocuDocTypeField}' id='${idDocuDocTypeField}' {if this.utils.booleanValue(mandatoryDocType)} class="mandatory" {on change {fn: 'toggleMandatoryBorder', args: {id:idDocuDocTypeField}}/}{/if}>
									<option value="">${labels.tx_pltg_text_PleaseSelect}</option>
									{foreach document in idDocList}
											<option value="${document[0]}" {if (!merciFunc.isEmptyObject(identityDocument.documentType) && identityDocument.documentType == document[0]) || (!merciFunc.isEmptyObject(rqstParams[idenDocType]) && rqstParams[idenDocType] == document[0])}selected="selected"{/if}>${document[2]}</option>
									{/foreach}
								</select>
								 {if this.utils.booleanValue(mandatoryDocType)} <input type="hidden" id="idDocuDocTypeField" value="${idDocuDocTypeField}" /> {/if}
							</p>
						{/if}
						<!-- DOCUMENT TYPE END -->
						<!-- DOCUMENT NUMBER START -->
						{if (enabledDocNum == "Y")}
							<p class="pi_pddocno">
								<label class="pi_pddocno">${labels.tx_pltg_text_documentNumber}
									{call mandateInfo(mandatoryDocNum,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_DOCNUMBER',siteParameters.isGdsUsed,identityDocument.documentNumberAttributes.PSPTRequirement,mandatorySec,identityDocument.documentNumber,idDocuDocNumberField,traveller.paxNumber) /}
								</label>
									<input {if this.utils.booleanValue(mandatoryDocNum)} class="inputField widthFull mandatory" {on blur {fn: 'toggleMandatoryBorder', args: {id:idDocuDocNumberField}}/}{else/} class="inputField widthFull" {/if} type="text" name='${idDocuDocNumberField}' id='${idDocuDocNumberField}' value="{if (!merciFunc.isEmptyObject(identityDocument.documentNumber))}${identityDocument.documentNumber}{elseif (!merciFunc.isEmptyObject(rqstParams[idenDocNumber]))/} ${rqstParams[idenDocNumber]}{/if}" />
									 {if this.utils.booleanValue(mandatoryDocNum)} <input type="hidden" id="idDocuDocNumberField" value="${idDocuDocNumberField}" /> {/if}
							</p>
						{/if}
						<!-- DOCUMENT NUMBER END -->
						<!-- ISSUING COUNTRY START -->
						{if (enabledIssCountry == "Y")}
							<p class="pi_pddocic">
								<label class="pi_pddocic">${labels.tx_pltg_text_IssuingCountryCode}
									{call mandateInfo(mandatoryIssCountry,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_ISNGCOUNTRY',siteParameters.isGdsUsed,identityDocument.issuingCountryAttributes.PSPTRequirement,mandatorySec,identityDocument.issuingCountry,idDocuIssCountryField,traveller.paxNumber) /}
								</label>
								{var alphabetStr = labels.tx_pltg_pattern_AlphabetLetters/}
								{var alphabetStrArr = alphabetStr.split(";")/}
								<select  name='${idDocuIssCountryField}' id='${idDocuIssCountryField}' {if this.utils.booleanValue(mandatoryIssCountry)} class="mandatory" {on change {fn: 'toggleMandatoryBorder', args: {id:idDocuIssCountryField}}/}{/if}>
									<option value="">${labels.tx_merci_text_booking_select}</option>
									{if (!merciFunc.isEmptyObject(rqstParams.countryFilteredMap))}
									{foreach alpha in alphabetStrArr}
										{var firstLetterMap = rqstParams.countryFilteredMap[alpha]/}
										{if (firstLetterMap)}
										{foreach country in firstLetterMap}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.issuingCountry) && identityDocument.issuingCountry == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
										{/if}
									{/foreach}
									{else/}
										{foreach country in gblLists.countryList}
											{if (country[0] != "ZZ")}
												<option value="${country[0]}" {if (!merciFunc.isEmptyObject(identityDocument.issuingCountry) && identityDocument.issuingCountry == country[0])}selected="selected"{/if}>${country[1]}</option>
											{/if}
										{/foreach}
									{/if}
								</select>
								 {if this.utils.booleanValue(mandatoryIssCountry)} <input type="hidden" id="idDocuIssCountryField" value="${idDocuIssCountryField}" /> {/if}
							</p>
						{/if}
						<!-- ISSUING COUNTRY END -->
						<!-- EXPIRING DATE START -->
							{if (this.data.servicingAPIS == 'Y')}
								{var expiryDate = "" /}
								{if (!merciFunc.isEmptyObject(identityDocument.dateOfBirth) && !merciFunc.isEmptyObject(identityDocument.dateOfBirth.newDate))}
									{set expiryDate = identityDocument.expiryDate /}
								{/if}
							{/if}
						{if (enabledExpDate == "Y")}
							<p class="pi_pddocds">
								<label class="pi_pddocds">${labels.tx_pltg_text_ExpirationDate}
									{var attrib = identityDocument.expiryDate/}
									{if (attrib != null)}
										{set attrib = attrib.year /}
									{/if}
									{call mandateInfo(mandatoryExpDate,this.data.sendMandatoryInfo,this.data.isAdultPsngr,'PSPT_DOCEXPRYDATE',siteParameters.isGdsUsed,mandatoryExpDate,mandatorySec,attrib,idDocuExpDateField,traveller.paxNumber) /}
								</label>
								<input type="hidden" id='${idDocuExpDateField}' name="${idDocuExpDateField}" value="" />
								{var dtFormat = siteParameters.siteInputDateFormat/}
								{set dtFormatArr = dtFormat.split(",")/}
								{var idenDate = rqstParams[idenExpDate]/}
                {if !merciFunc.isEmptyObject(idenDate)}
                  {var idenDay = idenDate.slice(6, 8)/}
                  {var idenMonth = idenDate.slice(4, 6)/}
                  {var idenYear = idenDate.slice(0, 4)/}
                {/if}
								<div class="list">
									<ul class="input">
										{for var i=0; i< dtFormatArr.length ; i++}
											{if (dtFormatArr[i] == 'D')}
												<li class="pi_pddocdsd">
													<select  id="Day_${idDocuExpDateField}" name="Day_${idDocuExpDateField}" {on blur {fn:"pspt_frameDOB",args : {date: "Day_"+idDocuExpDateField,month : "Month_"+idDocuExpDateField,year : "Year_"+idDocuExpDateField,fieldToSetValueIn :  idDocuExpDateField} }/}>
													{for var j=1; j<= 31 ; j++}
															<option value="${j}" {if (expiryDate != null && expiryDate.day == j) || (idenDay!=undefined && parseInt(idenDay)== j)}selected="selected"{/if}>${j}</option>
													{/for}
													</select>
												</li>
											{/if}
											{if (dtFormatArr[i] == 'M')}
												<li class="pi_pddocdsm">
													<select  id="Month_${idDocuExpDateField}" name="Month_${idDocuExpDateField}" {on blur {fn:"pspt_frameDOB",args : {date: "Day_"+idDocuExpDateField,month : "Month_"+idDocuExpDateField,year : "Year_"+idDocuExpDateField,fieldToSetValueIn :  idDocuExpDateField} }/}>
													{foreach month in gblLists.slShortMonthList}
															<option value="${month_index}" {if (expiryDate != null && expiryDate.month == month_index) || (idenMonth!=undefined && parseInt(idenMonth)== month_index)}selected="selected"{/if}>${month[1]}</option>
													{/foreach}
													</select>
												</li>
											{/if}
											{if (dtFormatArr[i] == 'Y')}
												{var presentDate = new Date()/}
												{set presentYear = presentDate.getFullYear()/}
												<li class="pi_pddocdsy">
													<select  id="Year_${idDocuExpDateField}" name="Year_${idDocuExpDateField}" {on blur {fn:"pspt_frameDOB",args : {date: "Day_"+idDocuExpDateField,month : "Month_"+idDocuExpDateField,year : "Year_"+idDocuExpDateField,fieldToSetValueIn :  idDocuExpDateField} }/}>
													{for var j=presentYear; j<= presentYear+100 ; j++}
															<option value="${j}" {if (!merciFunc.isEmptyObject(attrib) && attrib == j) || (idenYear!=undefined && parseInt(idenYear)== j)}selected="selected"{/if}>${j}</option>
													{/for}
													</select>
												</li>
											{/if}
										{/for}
									</ul>
								</div>
							</p>
						{/if}
						<!-- EXPIRING DATE END -->
						</div>
					{/if}
				{/if}
			{/foreach}
		{/if}
	{/macro}
	{macro mandateInfo(mandatory,sendMandatoryInfo,isAdultPsngr,tag,isGdsUsed,PSPTRequirement,mandatorySec,attrib,field,paxNum)}
		{if (this.data.servicingAPIS == 'Y')}
			{if (PSPTRequirement == 'MANDATORY' && mandatorySec == 'Y')}
				{if (attrib != null)  && (typeof(attrib) == 'undefined')}
					<span class="mandatory">*</span>
				{/if}
				{if (paxNum == 1)}
					<input type="hidden" name="hidden${field}" value="TRUE" />
				{/if}
			{/if}
			{if (PSPTRequirement == 'MANDATORY' && mandatorySec != 'Y')}
				<span class="mandatory">*</span>
			{/if}
		{else/}
			{if (mandatory == 'Y' || (isGdsUsed != "" && isGdsUsed == 'XX'))}
				<input type="hidden" name="APIS_REQ" value="TRUE" />
				<span class="mandatory">*</span>
				{if (sendMandatoryInfo == 'TRUE')}
					{if (isAdultPsngr == 'Y')}
						<input type="hidden" name="${tag}" value="TRUE" />
					{else/}
						<input type="hidden" name="INFANT_${tag}" value="TRUE" />
					{/if}
				{/if}
			{/if}
		{/if}
	{/macro}
{/Template}