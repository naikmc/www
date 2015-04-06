{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiPaxDetails',
	$extends: 'modules.view.merci.segments.booking.templates.alpi.MAlpi',
	$hasScript: true,
	$wlibs : {
    		'cust': 'modules.view.merci.common.widgets.CustomWidgetLib'
    	},
	$macrolibs: {
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	}
}}

	{macro main()}

		{var APIS_CHECK_VIEW = ""/}
		{var traveller = this.data.traveller/}
		{var traveller_index = this.data.travellerIndex/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}

		{if (this.data.siteParameters.showNominee == 'TRUE') && this.data.rqstParams.loginProfilesBean.travellersList != null && this.data.rqstParams.loginProfilesBean.travellersList.length > 1}
			<p class="alpi_paxnom">
				<label for="nominee1">${this.data.labels.tx_merci_text_nominee}</label>
				<select id="NOMINEE_${traveller.paxNumber}" {on change {fn:"modifyNominee" ,args : {paxNo : traveller.paxNumber, paxIndex : traveller_index, paxType : traveller.paxType.code}} /}>
						<option value="SEL" selected="selected">${this.data.labels.tx_merci_text_booking_pleaseselect}</option>
					{foreach nominee in this.data.rqstParams.loginProfilesBean.travellersList}
				<option value="${nominee.id}">
					{if (nominee.firstName) != 'DummyValue'}
						${nominee.firstName}&nbsp;
					{/if}
					{if (nominee.lastName) != 'DummyValue'}
						${nominee.lastName}
					{/if}
				</option>
					{/foreach}
					{if (this.data.siteParameters.siteIsAllowAddPax == 'TRUE')}
						<option value="0">
							${new this.buffer(this.data.labels.tx_pltg_pattern_EnterNewTraveller).formatString([traveller.paxType.code])}
						</option>
					{/if}
				</select>
			</p>
		{/if}

		{if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")}
			<h2 class="alpi_booktype"><span class="label">${this.data.labels.tx_merci_text_booking_type}:&nbsp;</span> <span class="data paxCase">${this.data.rqstParams.TRAVELLER_TYPE_1}</span></h2>
			<input type="hidden" name='TRAVELLER_TYPE_${this.data.rqstParams.USER_ID_1}' value='${this.data.rqstParams.TRAVELLER_TYPE_1}' />
		{elseif (this.data.earlyLogin == "YES")/}
			<h2 class="alpi_booktype"><span class="label">${this.data.labels.tx_merci_text_booking_type}:&nbsp;</span> <span class="data paxCase">${this.data.rqstParams.TRAVELLER_TYPE_1}</span></h2>
			<input type="hidden" name='TRAVELLER_TYPE_1' value='${this.data.rqstParams.TRAVELLER_TYPE_1}' />
		{else /}
			<h2 class="alpi_booktype"><span class="label">${this.data.labels.tx_merci_text_booking_type}:&nbsp;</span> <span class="data paxCase">${this.data.labels[traveller.paxType.messageKey]}</span></h2>
			<input type="hidden" name='TRAVELLER_TYPE_${traveller.paxNumber}' value='${traveller.paxType.code}' />
		{/if}

		<!-- TITLE START-->
		{var titleFieldAccessor = "SITE_TITLE_1"/}
		{var titleProfileField = this.data.rqstParams.profileFieldsAccessor[titleFieldAccessor]/}
		{if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") || (this.data.earlyLogin =="YES")}
			{var titleField = "TITLE_"+this.data.rqstParams.USER_ID_1 /}
		{else/}
			{var titleField = "TITLE_"+traveller.paxNumber/}
		{/if}

		<div class="row">
			
			<input type="hidden" id="MANDATORY_${titleField}" name="MANDATORY_${titleField}" value="{if (!this.utils.isEmptyObject(titleProfileField) && titleProfileField.mandatory)}TRUE{else/}FALSE{/if}" />
			{if this._isTitleEnabled({
				'titleProfileField': titleProfileField
			})}
				<div class="field-2">
					<div class="padding-right">
						{var titleFromScope = this._getTitleFromScope({
							'titleField': titleField
						})/}

						<p class="title alpi_dpltg">
							<label  for="select2">${this.data.labels.tx_pltg_text_Title}&nbsp;{if (!this.utils.isEmptyObject(titleProfileField) && titleProfileField.mandatory)}<span class="mandatory"> *</span>{/if}</label>
						</p>
			        			<p class="smartDropDwn">
							{if (this.data.siteParameters.showPredTextForTitle != 'TRUE' && this.data.earlyLogin == null && !(this.data.directLogin == "YES" && this.data.flowFrom == "profilePage"))}
								{var langTitles = this.data.siteParameters.langTitlesAllowed/}
								{set langTitles = langTitles.split(",")/}
								<select id="${titleField}" name="${titleField}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true')}disabled="disabled" {/if} {if (!this.utils.isEmptyObject(titleProfileField) && titleProfileField.mandatory)} class="mandatory" {on change {fn : "toggleMandatoryBorder", args:{id:titleField}}/}{/if}>
									<option value="" {if this.utils.isEmptyObject(titleFromScope)}selected="selected" {/if}>${this.data.labels.tx_merci_text_booking_pleaseselect}</option>
									{for var i=0; i< langTitles.length ; i++}
										<option dir="ltr" value="${langTitles[i]}" {if (langTitles[i].toUpperCase() == titleFromScope.toUpperCase() || this.data.rqstParams.titlesMap[langTitles[i]].code.toUpperCase() == titleFromScope.toUpperCase())} selected="selected" {/if}>${this.data.rqstParams.titlesMap[langTitles[i]].label}</option>
									{/for}
								</select>
							{elseif (this.data.earlyLogin == "YES") /}
								{var langTitles = this.data.siteParameters.langTitlesAllowed/}
								{set langTitles = langTitles.split(",")/}
								<select  id="${titleField}" name="TITLE_1" {if this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}disabled="disabled" {/if}>
									<option value="" selected="selected">${this.data.labels.tx_merci_text_booking_pleaseselect}</option>
									{for var i=0; i< langTitles.length ; i++}
										<option value="${langTitles[i]}"  name="TITLE_1" {if (langTitles[i] == titleFromScope)} selected="selected" {/if}>${langTitles[i]}</option>
									{/for}
								</select>
							{else /}
								{if ((this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") || this.data.siteParameters.allowAwards == 'TRUE' && this.data.rqstParams.awardsFlow == true) || this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}
									<input type="text" readonly="readonly" id="${titleField}" name="${titleField}" value="${titleFromScope}" class="inputField widthFull" />
								{else /}
									{var cb=null /}
									{var keyupFn=null /}
										{set keyupFn = {fn:"clrSelected" ,args:{name : titleField, id: titleField}, scope: this} /}
								{var classTitle = "inputField widthFull"/}
								{var titleMandatory = false /}
								{if (!this.utils.isEmptyObject(titleProfileField) && titleProfileField.mandatory)}
									{set classTitle = "inputField widthFull mandatory"/}
									{set titleMandatory = true /}
								{/if}
								{call autocomplete.createAutoComplete({
									name: titleField,
									id: titleField,
									value: titleFromScope,
									autocorrect:"off",
									autocapitalize:"none",
									autocomplete:"off",
									type: 'text',
									class: classTitle,
									source: this.getTitleSource(),
									onblur: {fn:"toggleMandatoryBorder" ,args : {id: titleField,mandatory: titleMandatory}, scope: this }
								})/}
								{/if}
							{/if}
						</p>
					</div>
				</div>
			{/if}
			<!-- TITLE END-->
			
			<div class="{if this._isTitleEnabled({'titleProfileField': titleProfileField})}field-3{else/}field-5{/if}">
				<!-- FIRST NAME START -->
				<div class="alpi_box_fname">
					{var response = this._getFirstNameFromScope({
						'traveller': traveller
					})/}

					{var fnameSet = response.fnameSet/}
					{var fnameField = response.fnameField /}
					{var fnameFromScope = response.fnameFromScope/}
					
					<p class="name  alpi_pltgfn">
						<label for="input1">${this.data.labels.tx_pltg_text_FirstName}<span class="mandatory"> * </span>{if (this.data.siteParameters.showMandatoryFirstName == 'TRUE')}<span class="textSmaller">${this.data.labels.tx_merci_text_booking_fname_warn}</span>{/if}</label>
					</p>
					{if (this.data.siteParameters.allowAwards == 'TRUE' && this.data.rqstParams.awardsFlow == true) }
						<input type="hidden" name="${fnameSet}" id="${fnameSet}" value="0" />
						 <input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_firstname}" readonly="readonly" id="${fnameField}" name="${fnameField}" value="${fnameFromScope}" class="inputField widthFull" />
					{elseif this.data.siteParameters.showNominee == 'TRUE' && fnameFromScope!="" && !(this.data.flowFrom === "profilePage") /}
						<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_firstname}" id="${fnameField}" name="${fnameField}" value="${fnameFromScope}" class="inputField widthFull"  rel="firstName_${this.data.rqstParams.USER_ID_1}" />
					{elseif this.data.directLogin == "YES" && this.data.flowFrom === "profilePage"   ||  this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"/}
						<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_firstname}" readonly="readonly" id="${fnameField}" name="${fnameField}" value="${fnameFromScope}" class="inputField widthFull"  rel="firstName_${this.data.rqstParams.USER_ID_1}" />
					{elseif this.data.earlyLogin == "YES"/}
						<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_firstname}" id="${fnameField}" name="FIRST_NAME_1" value="${fnameFromScope}" {if !this.utils.booleanValue(this.data.siteParameters.showMandatoryFirstName)}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if}  rel="firstName_${this.data.rqstParams.USER_ID_1}" />
					{else/}
						{var cb=null /}
						{var keyupFn=null /}
						{var relField = "firstName_"+traveller_index /}
							{set keyupFn = {fn:"clrSelected" ,args:{name : fnameField, id: fnameField}, scope: this} /}

						{if (this.data.rqstParams.fareBreakdown.rebookingStatus.value == 'true')}
							<input type="text" autocomplete="off" autocorrect="off" id="${fnameField}"  name="${fnameField}" value="${fnameFromScope}" {if !this.utils.booleanValue(this.data.siteParameters.showMandatoryFirstName)}class="inputField widthFull mandatory"{else/}class="inputField widthFull"{/if} rel="firstName_${traveller_index}" disabled="disabled"
								{on blur {fn:"pspt_firstName" ,args : {firstName : fnameField, travellerIndex: traveller_index,  travellerNo: traveller.paxNumber }} /}
							/>
						{else/}
							{var classFirstName = "inputField widthFull"/}
							{if !this.utils.booleanValue(this.data.siteParameters.showMandatoryFirstName)}
								{set classFirstName="inputField widthFull mandatory"/}
							{/if}
							{call autocomplete.createAutoComplete({
								name: fnameField,
								id: fnameField,
								rel: relField,
								autocorrect:"off",
								autocapitalize:"none",
								autocomplete:"off",
								selectFn: {fn:"selectFromARIA" , scope: this},
								type: 'text',
								value: fnameFromScope,
								class: classFirstName,
								source: this.getFirstNameList(),
								onblur: {fn:"pspt_firstName" ,args : {firstName : fnameField, travellerIndex: traveller_index,  travellerNo: traveller.paxNumber}, scope: this }
							})/}
						{/if}
						{if ( !merciFunc.isEmptyObject(apisSectionBean) && this.data.fNameIDENReq != 'DISABLED')}
							{var fNameIdenField= "IDENTITY_DOCUMENT_FIRST_NAME_"+traveller.paxNumber+"_"+this.data.id/}
							<input type="hidden" id="${fNameIdenField}" name="${fNameIdenField}" value="" />
						{/if}
					{/if}
					<input type="hidden" name="${fnameSet}" id="${fnameSet}" value="0" />
				</div>
				<!-- FIRST NAME END -->
			</div>

			{var middleNameData = this._getMiddleNameInfo({
				'apisSectionBean': apisSectionBean,
				'traveller': traveller
			})/}
			{if middleNameData.enabledMiddleName == true}
				<!-- MIDDLE NAME APIS START FIX for PTR 07856144-->
				<div class="field-3">
					<div class="alpi_box_mname padding-left">
						<p class="alpi_detmn">
							<label>${this.data.labels.tx_pltg_text_MiddleName}
								{call mandateInfo(middleNameData.mandatoryMiddleName,middleNameData.sendMandatoryInfo,'Y','PSPT_MDLENAME','',middleNameData.identityDocument.middleNameAttributes.PSPTRequirement, middleNameData.mandatorySec, middleNameData.identityDocument.middleName,middleNameData.idDocuMNameField,traveller.paxNumber) /}
							</label>
							<input class="inputField widthFull" type="text"  name="${middleNameData.idDocuMNameField}"  value="
							{if !merciFunc.isEmptyObject(middleNameData.identityDocument.middleName)}${middleNameData.identityDocument.middleName}{/if}
							{if merciFunc.isEmptyObject(middleNameData.identityDocument.middleName) && this.data.isAdultPsngr == 'Y'}${traveller.identityInformation.middleName}{/if}" />
						</p>
					</div>
				</div>
				<!-- MIDDLE NAME APIS END FIX for PTR 07856144-->
			{/if}

			<div class="{if middleNameData.enabledMiddleName == true}field-4{else/}field-7{/if}">
				<!-- LAST NAME START -->
				<div class="alpi_box_lname padding-left">
					{var lastNameData = this._getLastNameFromScope({
						'traveller': traveller
					})/}

					{var lnameSet = lastNameData.lnameSet/}
					{var lnameField = lastNameData.lnameField/}
					{var lnameFromScope = lastNameData.lnameFromScope/}

					<p class="name  alpi_detln">
						<label for="input1">${this.data.labels.tx_pltg_text_LastName}<span class="mandatory"> *</span></label>
					</p>
					<p class="smartDropDwn">
						{if (this.data.siteParameters.allowAwards == 'TRUE' && this.data.rqstParams.awardsFlow == true)}
							<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_lastname}" readonly="readonly" id="${lnameField}" name="${lnameField}" value="${lnameFromScope}" class="inputField widthFull" />
							<input type="hidden" name="${lnameSet}" id="${lnameSet}" value="0" />
							<span class="delete hidden" {on click {fn: 'clearField', args: {id: lnameField, mandatory: true}}/} id="del${lnameField}"><span class="x xrtl">x</span></span>
						{elseif (this.data.directLogin == "YES" && !(this.data.flowFrom === "profilePage") && this.data.siteParameters.showNominee == 'TRUE' && lnameFromScope!="")  /}
							<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_lastname}" id="${lnameField}" name="${lnameField}" value="${lnameFromScope}" class="inputField widthFull"  rel="lastName_${this.data.rqstParams.USER_ID_1}" />
						{elseif (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")  || this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE" /}
							<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_lastname}" readonly="readonly" id="${lnameField}" name="${lnameField}" value="${lnameFromScope}" class="inputField widthFull"  rel="lastName_${this.data.rqstParams.USER_ID_1}" />
						{elseif this.data.earlyLogin == "YES"/}
							<input type="text" placeholder="${this.data.labels.tx_merci_text_booking_alpi_lastname}" id="${lnameField}" name="LAST_NAME_1" value="${lnameFromScope}" class="inputField widthFull"  rel="lastName_${this.data.rqstParams.USER_ID_1}" />
						{else /}
							<input type="text" id="${lnameField}"  name="${lnameField}" value="${lnameFromScope}" class="inputField widthFull mandatory" {if (this.data.rqstParams.fareBreakdown.rebookingStatus.value == 'true')}disabled="disabled" {/if} rel="lastName_${traveller_index}" {on blur {fn:"pspt_lastName" ,args : {lastName : lnameField, travellerIndex: traveller_index,  travellerNo: traveller.paxNumber }} /}  {on keyup {fn:"clrSelected" ,args : {name : lnameField,id:lnameField}} /}/>
							<span class="delete hidden" {on click {fn: 'clearField', args: {id: lnameField, mandatory: true}}/} id="del${lnameField}"><span class="x xrtl">x</span></span>
							{if ( !merciFunc.isEmptyObject(apisSectionBean) && this.data.lNameIDENReq != 'DISABLED')}
								{var lNameIdenField= "IDENTITY_DOCUMENT_LAST_NAME_"+traveller.paxNumber+"_"+this.data.id/}
								<input type="hidden" id="${lNameIdenField}" name="${lNameIdenField}" value="" />
							{/if}
						{/if}
					</p>
				</div>
				<!-- LAST NAME END-->
			</div>
		</div>

		<!-- GENDER START -->
		{if ( !merciFunc.isEmptyObject(apisSectionBean) && this.data.genderIDENReq != 'DISABLED')}
			{var genderFromScope = ""/}
			{var genderField = "IDENTITY_DOCUMENT_GENDER_"+traveller.paxNumber+"_"+this.data.id/}
			{if (this.data.ApisPSPT == 'FALSE')}
				{set APIS_CHECK_VIEW = APIS_CHECK_VIEW+"IDEN"/}
				<input type="hidden" name="${this.data.sectionId}" id="${this.data.sectionId}" value="${this.data.id}" />
			{/if}
			
			{if (traveller.identityInformation.gender != null)}
				{set genderFromScope = traveller.identityInformation.gender/}
			{/if}
			
			<p class="alpi_dgender">
				<label for="gender">${this.data.labels.tx_pltg_text_Gender}<span class="mandatory"> *</span></label>
				<select  id="${genderField}" name='${genderField}' class="mandatory" {if this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE"}disabled="disabled" {/if} {on change {fn:"fillPsptValues" ,args : {field : "gender", paxno : traveller.paxNumber, id : genderField, mandatory: true}} /}>
					<option value="">${this.data.labels.tx_pltg_text_TravelDocumentGenderDefaultSelect}</option>
					<option value="M" {if (genderFromScope == 'M')}selected="selected"{/if}>${this.data.labels.tx_pltg_text_Male}</option>
					<option value="F" {if (genderFromScope == 'F')}selected="selected"{/if}>${this.data.labels.tx_pltg_text_Female}</option>
				</select>
			</p>
		{elseif (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") /}
			{var genderFromScope = ""/}
			{var genderField = "IDENTITY_DOCUMENT_GENDER_"+this.data.rqstParams.USER_ID/}
			{if !merciFunc.isEmptyObject(this.data.rqstParams.genderInfo) }
				{set genderFromScope = this.data.rqstParams.genderInfo/}
			{else /}
				{set genderFromScope = this.data.rqstParams.GENDER_1/}
			{/if}
			<p class="alpi_dgender">
				<label for="gender">${this.data.labels.tx_pltg_text_Gender}<span class="mandatory"> *</span></label>
				<select  id="${genderField}" name='${genderField}' >
					<option value="" disabled >${this.data.labels.tx_pltg_text_TravelDocumentGenderDefaultSelect}</option>
					<option value="M" {if (genderFromScope == 'M' || genderFromScope == 'm')}selected="selected"{/if} disabled>${this.data.labels.tx_pltg_text_Male}</option>
					<option value="F" {if (genderFromScope == 'F') || genderFromScope == 'fs'}selected="selected"{/if} disabled>${this.data.labels.tx_pltg_text_Female}</option>
				</select>
			</p>
		{/if}
		<!-- GENDER END -->

		<!-- DOB START -->
		{var dobDay = ""/}
		{var dobMonth = ""/}
		{var dobYear = ""/}
		{var isDateEligible = false/}

		{if this.utils.booleanValue(this.data.rqstParams.isSQSARegulnEnabled) && this.utils.booleanValue(this.data.siteParameters.SAPolicy) && this.utils.booleanValue(this.data.siteParameters.SAPolicyDOB) }

			{var flightTimeFromBean = []/}
			{var flightTimeFromParam = ""/}

			{var dateOne = ""/}
			{var dateTwo = ""/}
			{if (!this.utils.isEmptyObject(this.data.siteParameters.siteSQ_SA_Policy_FlightTime))}
				{set flightTimeFromParam = this.data.siteParameters.siteSQ_SA_Policy_FlightTime/}
				{set dateTwo = this.getDateFromflightTimeFromParam(flightTimeFromParam)/}
			{/if}
			{if (!this.utils.isEmptyObject(this.data.rqstParams.listItineraryBean.itinerariesAsMap))}
				{set flightTimeFromBean = this.data.rqstParams.listItineraryBean.itinerariesAsMap[0].beginDate/}
				{set dateOne = new Date(flightTimeFromBean).getTime()/}
			{/if}
		
			{if dateOne != "" && dateTwo != "" && dateOne > dateTwo }
				{set isDateEligible = true/}
			{/if}
					
		{/if}
		
		<!-- NATIONALITY CALCULATION -->
		{var enableNationalityField = 'FALSE' /}
		{var isNationalityFieldMandatory = 'FALSE' /}
		{if (!this.utils.isEmptyObject(traveller.identityInformation.nationalityAttributes) && traveller.identityInformation.nationalityAttributes.enabled == 'Y')}
			{set enableNationalityField = 'TRUE' /}
			{if (traveller.identityInformation.nationalityAttributes.mandatory == 'Y')}
				{set isNationalityFieldMandatory = 'TRUE' /}
			{/if}
		{/if}
		{if (this.data.siteParameters.siteHidePaxNationality == 'TRUE' && !merciFunc.isEmptyObject(apisSectionBean))}
			{set enableNationalityField = 'FALSE' /}
		{/if}

		<div class="row">
			{var isDobEnabled = false/}
			{if ((this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")) }
				{set isDobEnabled = true/}
				<div class="{if this._isNationalityEnabled() && enableNationalityField == 'TRUE'}field-6{else/}field-12{/if}">
					<div class="list dob padding-right">
						<label for="dob">${this.data.labels.tx_merci_text_travdetl_dob}&nbsp;{if (this.data.rqstParams.DATE_OF_BIRTH)}<span class="mandatory"> *</span>{/if}</label>
						{if (this.data.rqstParams.DATE_OF_BIRTH_1 != null )}
							{set dobDay = this.data.rqstParams.DATE_OF_BIRTH_1.substring(6,8)/}
							{set dobMonth = this.data.rqstParams.DATE_OF_BIRTH_1.substring(4,6)/}
							{set dobYear = this.data.rqstParams.DATE_OF_BIRTH_1.substring(0,4)/}
							<ul class="input">
								<li  class="alpi_ddobd">
									<select  id="paxDobDay_${this.data.rqstParams.USER_ID_1}" name="paxDobDay_${this.data.rqstParams.USER_ID_1}" disabled >
										{for var j=1; j<= 31 ; j++}
											<option value="${j}" {if (dobDay == j)}selected="selected"{/if}>${j}</option>
										{/for}
									</select>
								</li>
								<li class="alpi_ddobm">
									<select  id="paxDobMonth_${this.data.rqstParams.USER_ID_1}" name="paxDobMonth_${this.data.rqstParams.USER_ID_1}" disabled >
										{foreach month in this.data.gblLists.slShortMonthList}
											<option value="${month_ct}" {if ((dobMonth) == month_ct)}selected="selected" {/if}>${this.data.gblLists.slShortMonthList[month_index][1]}</option>
										{/foreach}
									</select>
								</li>
								{var presentDate = new Date()/}
								{set presentYear = presentDate.getFullYear()/}
								<li class="alpi_ddoby">
									<select  id="paxDobYear_${this.data.rqstParams.USER_ID_1}" name="paxDobYear_${this.data.rqstParams.USER_ID_1}" disabled>
										{for var j=0; j<= 112 ; j++}
											<option value="${presentYear - j}" {if (dobYear == (presentYear - j))}selected="selected"{/if}>${presentYear-j}</option>
										{/for}
									</select>
								</li>
							</ul>
							<!-- Do not add any code here -->
							{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
								{@cust:SpinWheel {
									id : "SpinWheel_"+this.data.rqstParams.USER_ID_1,
									controlInputs : {"d": "paxDobDay_"+this.data.rqstParams.USER_ID_1,"m":"paxDobMonth_"+this.data.rqstParams.USER_ID_1,"y":"paxDobYear_"+this.data.rqstParams.USER_ID_1,"monthArr":this.data.gblLists.slShortMonthList}
								}/}
							{/if}

						{else /}
							{var dateObj = new Date(this.data.rqstParams.DATE_OF_BIRTH.time) /}
							{set dobDay = dateObj.getDate() /}
							{set dobMonth = dateObj.getMonth() /}
							{set dobYear = dateObj.getFullYear() /}
							<ul class="input">
								<li class="alpi_ddobd">
									<select  id="DATE_OF_BIRTH_DAY_1" name="DATE_OF_BIRTH_DAY"  /}>
										{for var j=1; j<= 31 ; j++}
											<option value="${j}"  {if (dobDay == j)}selected="selected" disabled {/if}>${j}</option>
										{/for}
									</select>
								</li>
								<li class="alpi_ddobm">
									<select  id="DATE_OF_BIRTH_MONTH_1" name="DATE_OF_BIRTH_MONTH" /}  >
										{foreach month in this.data.gblLists.slShortMonthList}
											<option value="${month_index}"  {if (dobMonth == month_index)}selected="selected" disabled {/if}>${this.data.gblLists.slShortMonthList[month_index][1]}</option>
										{/foreach}
									</select>
								</li>
								{var presentDate = new Date()/}
								{set presentYear = presentDate.getFullYear()/}
								<li class="alpi_ddoby">
									<select  id="DATE_OF_BIRTH_YEAR_1" name="DATE_OF_BIRTH_YEAR" /}>
										{for var j=0; j<= 112 ; j++}
											<option value="${presentYear - j}"  {if (dobYear == (presentYear - j))}selected="selected"{/if}>${presentYear-j}</option>
										{/for}
									</select>
								</li>
							</ul>
							<!-- Do not add any code here -->
							{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
								{@cust:SpinWheel {
									id : "SpinWheel_1",
									controlInputs : {"d": "DATE_OF_BIRTH_DAY_1","m":"DATE_OF_BIRTH_MONTH_1","y":"DATE_OF_BIRTH_YEAR_1","monthArr":this.data.gblLists.slShortMonthList}
								}/}
							{/if}
						{/if}
					</div>
				</div>
			{elseif this.data.earlyLogin == "YES" /}
				{set isDobEnabled = true/}
				<div class="{if this._isNationalityEnabled() && enableNationalityField == 'TRUE'}field-6{else/}field-12{/if}">
					<div class="list dob padding-right">
						<label for="dob">${this.data.labels.tx_merci_text_travdetl_dob}&nbsp;{if (this.data.rqstParams.DATE_OF_BIRTH_1)}<span class="mandatory"> *</span>{/if}</label>
						{var dateObj = new Date(JSON.parse(this.data.rqstParams.DATE_OF_BIRTH_1).time) /}

						{set dobDay = dateObj.getDate() /}
						{set dobMonth = dateObj.getMonth() /}
						{set dobYear = dateObj.getFullYear() /}
						<ul class="input">
							<li class="alpi_ddobd">
								<select  id="DATE_OF_BIRTH_DAY_1" name="DATE_OF_BIRTH_DAY_1"  {on change {fn : "onChangeDOB"  } /}>
									{for var j=1; j<= 31 ; j++}
										<option value="${j}"  {if (dobDay == j)}selected="selected"{/if}>${j}</option>
									{/for}
								</select>
							</li>
							<li class="alpi_ddobm">
								<select  id="DATE_OF_BIRTH_MONTH_1" name="DATE_OF_BIRTH_MONTH_1" {on change {fn : "onChangeDOB"  } /}  >
									{foreach month in this.data.gblLists.slShortMonthList}
										<option value="${month_index}"  {if (dobMonth == month_index)}selected="selected" {/if}>${this.data.gblLists.slShortMonthList[month_index][1]}</option>
									{/foreach}
								</select>
							</li>
							{var presentDate = new Date()/}
							{set presentYear = presentDate.getFullYear()/}
							<li  class="alpi_ddoby">
								<select  id="DATE_OF_BIRTH_YEAR_1" name="DATE_OF_BIRTH_YEAR_1" {on change {fn : "onChangeDOB"  }/}>
									{for var j=0; j<= 112 ; j++}
										<option value="${presentYear - j}"  {if (dobYear == (presentYear - j))}selected="selected"{/if}>${presentYear-j}</option>
									{/for}
								</select>
							</li>
						</ul>
						<!-- Do not add any code here -->
						{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
							{@cust:SpinWheel {
								id : "SpinWheel_1",
										controlInputs : {"d": "DATE_OF_BIRTH_DAY_1","m":"DATE_OF_BIRTH_MONTH_1","y":"DATE_OF_BIRTH_YEAR_1","monthArr":this.data.gblLists.slShortMonthList}
							}/}
						{/if}
					</div>
				</div>
			{elseif this.data.earlyLogin == null && !merciFunc.isEmptyObject(traveller) &&(this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[traveller.paxType.code][0]) || (merciFunc.booleanValue(this.data.ApisIdent) && this.apisDobEnabled()) || this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE" || isDateEligible/}
				{var isApisDobEnabled = this.apisDobEnabled() /}
				{set isDobEnabled = true /}
				<div class="{if this._isNationalityEnabled() && enableNationalityField == 'TRUE'}field-6{else/}field-12{/if}">
					<div class="list dob padding-right {if isApisDobEnabled} displayNone {/if}">
						<label for="dob">${this.data.labels.tx_merci_text_travdetl_dob}&nbsp;{if (this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[traveller.paxType.code][0])}<span class="mandatory"> *</span>{/if}</label>
						{if (this.data.rqstParams.loginProfilesBean.travellersList != null && this.data.rqstParams.loginProfilesBean.travellersList[0] != null && this.data.rqstParams.loginProfilesBean.travellersList[0].dateOfBirth != null && traveller.paxNumber == 1)}
							{set dobDay = this.data.rqstParams.loginProfilesBean.travellersList[0].dayOfBirth/}
							{set dobMonth = this.data.rqstParams.loginProfilesBean.travellersList[0].monthOfBirth/}
							{set dobYear = this.data.rqstParams.loginProfilesBean.travellersList[0].yearOfBirth/}
						{elseif (traveller.identityInformation.dateOfBirth != null) /}
							{set dobDay = traveller.identityInformation.dateOfBirth.strDay/}
							{set dobMonth = traveller.identityInformation.dateOfBirth.strMonth/}
							{set dobYear = traveller.identityInformation.dateOfBirth.year/}
						{/if}

						{if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true')}
							{set dobDay = traveller.identityInformation.dateOfBirth.strDay/}
							{set dobMonth = traveller.identityInformation.dateOfBirth.strMonth/}
							{set dobYear = traveller.identityInformation.dateOfBirth.year/}
						{/if}
						{var dtFormat = this.data.siteParameters.siteInputDateFormat/}
						{set dtFormatArr = dtFormat.split(",")/}
						<ul class="input">
							{for var i=0; i< dtFormatArr.length ; i++}
								{if (dtFormatArr[i] == 'D')}
									<li  class="alpi_ddobd">
										<select  id="paxDobDay_${traveller.paxNumber}" name="paxDobDay_${traveller.paxNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true' ||  this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE")}disabled="disabled" {/if} {on blur {fn:"setDay",args : {paxType : "P", TravllerIndex : traveller.paxNumber} }/} {on change {fn:"checkAge"} /}>
										{for var j=1; j<= 31 ; j++}
											<option value="${j}" {if (dobDay == j)}selected="selected"{/if}>${j}</option>
										{/for}
										</select>
									</li>
								{/if}
								{if (dtFormatArr[i] == 'M')}
									<li class="alpi_ddobm">
										<select  id="paxDobMonth_${traveller.paxNumber}" name="paxDobMonth_${traveller.paxNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true' ||  this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE")}disabled="disabled" {/if} {on blur {fn:"setMonth",args : {paxType : "P",TravllerIndex : traveller.paxNumber} }/} {on change {fn:"__updateDays",args : {paxType : "P", TravllerIndex : traveller.paxNumber} } /}>
										{foreach month in this.data.gblLists.slShortMonthList}
											<option value="${month_index}" {if ((dobMonth-1) == month_index)}selected="selected"{/if}>${month[1]}</option>
										{/foreach}
										</select>
									</li>
								{/if}
								{if (dtFormatArr[i] == 'Y')}
									{var presentDate = new Date()/}
									{set presentYear = presentDate.getFullYear()/}
									<li class="alpi_ddoby">
										<select  id="paxDobYear_${traveller.paxNumber}" name="paxDobYear_${traveller.paxNumber}" {if (this.data.rqstParams.fareBreakdown.rebookingStatus == 'true' ||  this.data.rqstParams.requestBean.IS_SPEED_BOOK == "TRUE")}disabled="disabled" {/if} {on blur {fn:"setYear",args : {paxType : "P",TravllerIndex : traveller.paxNumber} }/} {on change {fn:"__updateDays",args : {paxType : "P", TravllerIndex : traveller.paxNumber} } /}>
										{for var j=0; j<= 112 ; j++}
											<option value="${presentYear - j}" {if (dobYear == (presentYear - j))}selected="selected"{/if}>${presentYear - j}</option>
										{/for}
										</select>
									</li>
								{/if}

							{/for}
						</ul>
						<!-- Do not insert any code here -->
						{if this.utils.booleanValue(this.data.siteParameters.newDOBPicker)}
							{@cust:SpinWheel {
								id : "SpinWheel_"+traveller.paxNumber,
								controlInputs : {"d": "paxDobDay_"+traveller.paxNumber,"m":"paxDobMonth_"+traveller.paxNumber,"y":"paxDobYear_"+traveller.paxNumber,"monthArr":this.data.gblLists.slShortMonthList}
							}/}
						{/if}
						{if ( !merciFunc.isEmptyObject(apisSectionBean) && this.data.dobIDENReq != 'DISABLED')}
							{var dobField = "IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+traveller.paxNumber+"_"+this.data.id/}
							<input type="hidden" id="${dobField}" name="${dobField}" />
						{/if}
					</div>
				</div>
			{/if}
			<!-- DOB END -->
			
			<!-- NATIONALITY START -->
			{if this._isNationalityEnabled()}
				<div class="{if isDobEnabled}field-6{else/}field-12{/if}">
					{if (enableNationalityField == 'TRUE')}
						{var nationalityFromScope = ""/}
						{var nationalityField = "NATIONALITY_"+traveller.paxNumber/}
						{if this.data.paxNationalityCode != null}
							{set nationalityFromScope = this.data.paxNationalityCode/}
						{/if}

						<p class="alpi_dnat">
							<label for="nationality">${this.data.labels.tx_pltg_text_nationalityCountryCode}
								{if (isNationalityFieldMandatory == 'true')}
									<span class="mandatory">*</span>
									<input type="hidden" name="VALIDATE_NATIONALITY" value="TRUE" />
								{/if}
							</label>
							
							{var alphabetStr = this.data.labels.tx_pltg_pattern_AlphabetLetters/}
							{var alphabetStrArr = alphabetStr.split(";")/}
							
							<select  name='${nationalityField}' id='${nationalityField}' {if (isNationalityFieldMandatory == 'true')} class="mandatory" {/if} {on change {fn:"fillPsptValues" ,args : {field : "nationality", paxno : traveller.paxNumber, id : nationalityField, mandatory: isNationalityFieldMandatory}} /}>
								<option value="">${this.data.labels.tx_merci_text_booking_select}</option>
								{if (!this.utils.isEmptyObject(this.data.rqstParams.countryFilteredMap))}
									{foreach alpha in alphabetStrArr}
										{var firstLetterMap = this.data.rqstParams.countryFilteredMap[alpha]/}
										{if (firstLetterMap)}
											{foreach country in firstLetterMap}
												{if (country[0] != "ZZ")}
													<option value="${country[0]}">${country[1]}</option>
												{/if}
											{/foreach}
										{/if}
									{/foreach}
								{else/}
									{foreach country in this.data.gblLists.countryList}
										{if (country[0] != "ZZ")}
											<option value="${country[0]}">${country[1]}</option>
										{/if}
									{/foreach}
								{/if}
							</select>
						</p>
					{/if}			
					<!-- NATIONALITY END -->
				</div>
			{/if}
		</div>
			
		{if this.data.earlyLogin == null || (this.data.directLogin != "YES" && this.data.flowFrom === "profilePage")}
			<!-- FREQUENT FLIER SECTION START-->
			{@html:Template {
				id:"myEigthTemplate",
				classpath: "modules.view.merci.segments.booking.templates.alpi.fqtv.MAlpiFQTV",
				data: {
					labels : this.data.labels,
					siteParameters : this.data.siteParameters,
					gblLists : this.data.gblLists,
					rqstParams : this.data.rqstParams,
					traveller : traveller
				}
			} /}
			<!-- FREQUENT FLIER SECTION END-->
		{/if}

		<input type="hidden" name="APIS_CHECK_VIEW" id="APIS_CHECK_VIEW" value="${APIS_CHECK_VIEW}"/>
		<input type="hidden" name="DATE_OF_BIRTH_1" id="DATE_OF_BIRTH_1" />
	{/macro}

	{macro mandateInfo(mandatory,sendMandatoryInfo,isAdultPsngr,tag,isGdsUsed,PSPTRequirement,mandatorySec,attrib,field,paxNum)}
		{if (this.data.servicingAPIS == 'Y')}
			{if (PSPTRequirement == 'MANDATORY' && mandatorySec == 'Y')}
				{if (attrib != null)}
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