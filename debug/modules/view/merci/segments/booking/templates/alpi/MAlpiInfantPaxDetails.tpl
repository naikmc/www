{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiInfantPaxDetails',
	$hasScript: true,
	$macrolibs: {
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	},
	$wlibs : {
		'cust': 'modules.view.merci.common.widgets.CustomWidgetLib'
	}
}}

	{macro main()}

		<div class="row alpi_obox_names">
			<div class="field-6">
				<!-- INFANT FIRST NAME START -->
				<div class="alpi_box_fname padding-right">
					{var fNameIdenField= "INFANT_IDENTITY_DOCUMENT_FIRST_NAME_"+traveller.paxNumber+"_"+this.data.id/}
					{var infFNameField = "INFANT_FIRST_NAME_"+ this.data.infant.infantNumber/}
					{var infnameSet = "SET_INFANT_FIRST_NAME_"+ this.data.infant.infantNumber/}
					<p class="name ialpi_fname">
						<label for="firstName2">${this.data.labels.tx_pltg_text_FirstName}<span class="mandatory">*</span></label>
					</p>

					{if this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}
						<input id="${infFNameField}" type="text" autocorrect="off" readonly="readonly" id='${infFNameField}' name='${infFNameField}' value="${this.data.infant.firstName}"/>
					{else /}
						{var cb=null /}
						{var keyupFn=null /}
						{set keyupFn = {fn:"clrSelected" ,args:{name : infFNameField, id: infFNameField}, scope: ariaAutoCompleteInfantScope} /}

						{call autocomplete.createAutoComplete({
							name: infFNameField,
							id: infFNameField,
							cb:cb,
							type: 'text',
							class: 'mandatory',
							keyupFn: keyupFn,
							selectFn: {fn:"selectFromARIA" ,args : {name : infFNameField}, scope: ariaAutoCompleteInfantScope},
							source: this.getInfNameList(),
							isFirstInput: false,
							onblur:{fn:"pspt_InfantFirstName" ,args : {firstName : infFNameField, mandatory: true}, scope: ariaAutoCompleteInfantScope}
						})/}
					{/if}

					<input type="hidden" name="${infnameSet}" id="${infnameSet}" value="0" />
					{if ( !this.utils.isEmptyObject(apisSectionBean) && this.data.fNameIDENReq != 'DISABLED')}
						<input type="hidden" id="${fNameIdenField}" name="${fNameIdenField}" value="" />
					{/if}
				</div>
				<!-- INFANT FIRST NAME END -->
			</div>
			
			<!-- INFANT LAST NAME START -->
			<div class="field-6">
				<div class="alpi_box_lname">
					{var lNameIdenField= "INFANT_IDENTITY_DOCUMENT_LAST_NAME_"+traveller.paxNumber+"_"+this.data.id/}
					{var infLNameField = "INFANT_LAST_NAME_"+ this.data.infant.infantNumber/}

					<p  class="name ialpi_lname">
						<label for="lastName2">${this.data.labels.tx_pltg_text_LastName}<span class="mandatory">*</span></label>
					</p>
					{if this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}
						<input id="${infLNameField}" type="text" autocorrect="off" readonly="readonly" id='${infLNameField}' name='${infLNameField}' value="${this.data.infant.lastName}"/>
					{else /}
						<p class="smartDropDwn">
							<input class="mandatory" id="${infLNameField}" type="text" autocorrect="off" name='${infLNameField}'  value="" {on blur {fn:"pspt_InfantLastName" ,args : {lastName : infLNameField, mandatory: true}} /}  {on keyup {fn:"clrSelected" ,args : {name : infLNameField, id: infLNameField}} /}/>
							<span class="delete hidden" {on click {fn: 'clearField', args: {id:infLNameField, mandatory: true}}/} id="del${infLNameField}"><span class="x">x</span></span>
						</p>
						{if ( !this.utils.isEmptyObject(apisSectionBean) && this.data.lNameIDENReq != 'DISABLED')}
							<input type="hidden" id="${lNameIdenField}" name="${lNameIdenField}" value="" />
						{/if}
					{/if}
				</div>
			</div>
			<!-- INFANT LAST NAME END -->
		</div>
		
		<!-- INFANT GENDER START -->
		{if (!this.utils.isEmptyObject(apisSectionBean) && this.data.genderIDENReq != 'DISABLED')}
			{var genderFromScope = ""/}
			{var genderField = "INFANT_IDENTITY_DOCUMENT_GENDER_"+this.data.traveller.paxNumber+"_"+this.data.id/}
			{if this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}
				{set genderFromScope = this.data.infant.identityDocumentList[0].gender/}
			{/if}
			{if (this.data.ApisPSPT == 'FALSE')}
				{set sectionId = "INFANT_APIS_PR_TDOC_"+this.data.infant.infantNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
				<input type="hidden" name="${sectionId}" id="${sectionId}" value="${this.data.id}" />
			{/if}
			<p class="ialpi_gender">
				<label for="gender">${this.data.labels.tx_pltg_text_Gender}<span class="mandatory">*</span></label>
				<select  class="mandatory" id="${genderField}" name='${genderField}' {on change {fn:"fillPsptValues" , scope: this, args: {field : "infant_gender", paxno : this.data.traveller.paxNumber, id : genderField, mandatory: true}} /}>
					<option value="">${this.data.labels.tx_pltg_text_TravelDocumentGenderDefaultSelect}</option>
					<option value="M" {if (genderFromScope == 'M')}selected="selected"{/if}>${this.data.labels.tx_pltg_text_Male}</option>
					<option value="F" {if (genderFromScope == 'F')}selected="selected"{/if}>${this.data.labels.tx_pltg_text_Female}</option>
				</select>
			</p>
		{/if}
		<!-- INFANT GENDER END -->

		{var enableNationalityField = 'FALSE' /}
		{var isNationalityFieldMandatory = 'FALSE' /}
		{if (!this.utils.isEmptyObject(this.data.traveller.identityInformation.nationalityAttributes) && this.data.traveller.identityInformation.nationalityAttributes.enabled == 'Y')}
			{set enableNationalityField = 'TRUE' /}
			{if (this.data.traveller.identityInformation.nationalityAttributes.mandatory == 'Y')}
				{set isNationalityFieldMandatory = 'TRUE' /}
			{/if}
		{/if}
		{if (this.data.siteParameters.siteHidePaxNationality == 'TRUE' && apisSectionBean!=null)}
			{set enableNationalityField = 'FALSE' /}
		{/if}
		
		{var isDobEnabled = false/}
		<div class="row">
			<!-- INFANT DOB START -->
			{if this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType['INF'][0] || (this.data.ApisIdent && this.apisDobEnabled())}
				<div class="{if enableNationalityField !== 'TRUE'}field-12{else/}field-6{/if}">
					{set isDobEnabled = true/}
					<div class="list dob">
						<label for="dob">${this.data.labels.tx_merci_text_travdetl_dob}&nbsp;{if this.utils.booleanValue(this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType['INF'][1])}<span class="mandatory">*</span>{/if}</label>
						{var dtFormat = this.data.siteParameters.siteInputDateFormat/}
						{set dtFormatArr = dtFormat.split(",")/}
						<ul class="input">
							{for var i=0; i< dtFormatArr.length ; i++}
								{if (dtFormatArr[i] == 'D')}
									<li class="ialpi_dobd">
										<select id="infantDobDay_${this.data.infant.infantNumber}" name="infantDobDay_${this.data.infant.infantNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true')}disabled="disabled" {/if} {on blur {fn:"setDay", scope: this, args : {paxType : "I",TravllerIndex : this.data.traveller.paxNumber} } /} {on change {fn:"checkAge"} /}>
											{for var j=1; j<= 31 ; j++}
												<option value="${j}">${j}</option>
											{/for}
										</select>
									</li>
								{/if}
								{if (dtFormatArr[i] == 'M')}
									<li  class="ialpi_dobm">
										<select  id="infantDobMonth_${this.data.infant.infantNumber}" name="infantDobMonth_${this.data.infant.infantNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true')}disabled="disabled" {/if} {on blur {fn:"setMonth", scope: this, args : {paxType : "I",TravllerIndex : this.data.traveller.paxNumber} }/} {on change {fn:"__updateDays", scope: this, args : {paxType : "I", TravllerIndex : this.data.infant.infantNumber} } /}>
											{foreach month in this.data.gblLists.slShortMonthList}
												<option value="${month_index}">${month[1]}</option>
											{/foreach}
										</select>
									</li>
								{/if}
								{if (dtFormatArr[i] == 'Y')}
									{var presentDate = new Date()/}
									{set presentYear = presentDate.getFullYear()/}
									<li class="ialpi_doby">
										<select  id="infantDobYear_${this.data.infant.infantNumber}" name="infantDobYear_${this.data.infant.infantNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true')}disabled="disabled" {/if} {on blur {fn:"setYear", scope: this, args : {paxType : "I",TravllerIndex : this.data.traveller.paxNumber} }/} {on change {fn:"__updateDays", scope: this, args : {paxType : "I", TravllerIndex : this.data.infant.infantNumber} } /}>
											{for var j=0; j<= 112 ; j++}
												<option value="${presentYear - j}">${presentYear - j}</option>
											{/for}
										</select>
									</li>
								{/if}
							{/for}
						</ul>	<!-- Do not add code here -->											
						{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
							{@cust:SpinWheel {
								id : "SpinWheelInfant"+this.data.infant.infantNumber,                                     
								controlInputs : {"d": "infantDobDay_"+this.data.infant.infantNumber,"m":"infantDobMonth_"+this.data.infant.infantNumber,"y":"infantDobYear_"+this.data.infant.infantNumber,"monthArr":this.data.gblLists.slShortMonthList}
							}/}
						{/if}
						{if (!this.utils.isEmptyObject(apisSectionBean) && this.data.dobIDENReq != 'DISABLED')}
							{var dobField = "INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+traveller.paxNumber+"_"+this.data.id/}
							<input type="hidden" id="${dobField}" name="${dobField}" />
						{/if}
					</div>
				</div>
			{/if}
			<!-- INFANT DOB END -->
		
			<!-- NATIONALITY START -->
			{if (enableNationalityField == 'TRUE')}
				<div class="{if isDobEnabled}field-6{else/}field-12{/if}">
					{var nationalityFromScope = ""/}
					{var nationalityField = "INFANT_NATIONALITY_"+this.data.traveller.paxNumber/}
					{if (this.data.paxNationalityCode != null)}
						{set nationalityFromScope = this.data.paxNationalityCode/}
					{/if}
					<p class="ialpi_nat">
						<label for="nationality">${this.data.labels.tx_pltg_text_nationalityCountryCode}
							{if (isNationalityFieldMandatory == 'true')}
								<span class="mandatory">*</span>
								<input type="hidden" name="VALIDATE_NATIONALITY" value="TRUE" />
							{/if}
						</label>
						{var alphabetStr = this.data.labels.tx_pltg_pattern_AlphabetLetters/}
						{var alphabetStrArr = alphabetStr.split(";")/}
						<select  name='${nationalityField}' id='${nationalityField}' {if (isNationalityFieldMandatory == 'true')} class="mandatory" {/if} {on change {fn:"fillPsptValues", scope: this, args : {field : "infant_nationality", paxno : this.data.traveller.paxNumber, id : nationalityField, mandatory: isNationalityFieldMandatory}} /}>
							<option value="">${this.data.labels.tx_merci_text_booking_select}</option>
							{foreach alpha in alphabetStrArr}
								{var firstLetterMap = this.data.rqstParams.countryFilteredMap[alpha]/}
								{foreach country in firstLetterMap}
									<option value="${country[0]}">${country[1]}</option>
								{/foreach}
							{/foreach}
						</select>
					</p>
				</div>
			{/if}
			<!-- NATIONALITY END -->
		</div>
	{/macro}
{/Template}