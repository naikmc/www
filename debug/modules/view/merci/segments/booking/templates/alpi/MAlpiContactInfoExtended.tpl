{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtended',
	$dependencies: [
		'modules.view.merci.segments.booking.scripts.MBookingMethods'
	],
	$hasScript : true,
	$macrolibs: {
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	}
}}

	{macro main()}
		{var currentField = ""/}
		{var emailFromBean = ""/}
		{var phoneFromBean = ""/}
		{var mobileFromBean = ""/}
		{var prefPhoneNumber=null/}
		{var prefilled = "n" /}
		{var isMandatory = "n" /}
		{var businessFromBean = ""/}
		{var prefPhoneFromScope = null /}
		{var strCallingCountryCode = null /}
		{var bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods/}

		{if this.data.rqstParams.CONTACT_POINT_PHONE_TYPE != null }
			{var CONTACT_POINT_PHONE_TYPE = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE /}
		{/if}

		{if !this._merciFunc.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE) && this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE.indexOf("undefined") == -1 }
			{var CONTACT_POINT_PHONE_COUNTRY_CODE = this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE /}
		{elseif this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE_1 != null && this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE_1.indexOf("undefined") == -1 /}
			{var CONTACT_POINT_PHONE_COUNTRY_CODE = this.data.rqstParams.CONTACT_POINT_PHONE_COUNTRY_CODE_1 /}
		{/if}

		{if this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation != null }
			{var contactPoints = null/}
			{if this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation != null}
				{set contactPoints = this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints/}
			{/if}
		{/if}

		<header class="pi_alpicinfo">
			<h1>
				${this.data.labels.tx_merci_text_booking_contactinformation}
				{if this.data.isRebooking != "true"}
					<button type="button" class="toggle" id="newContactInfo" aria-expanded="true" data-aria-controls="section33" {on click {fn: 'toggle', scope: bookUtil, args : {ID1 : 'newContactInfo'}} /}><span>Toggle</span></button>
				{/if}
			</h1>
		</header>

		<section id="section_newContactInfo">
			<p class="requiredText padLeft">
				<span class="mandatory">* </span>
				<small>${this.data.labels.tx_merci_text_booking_alpi_indicates}</small>
			</p>

			{if this.data.earlyLogin == null}
				<input type="hidden" id="validateHmePhne" name="validateHmePhne" value="false" />
				<input type="hidden" id="validateMblePhne" name="validateMblePhne" value="false" />
				<input type="hidden" id="validateBusinessPhne" name="validateBusinessPhne" value="false" />
			{/if}

			{set currentField = "CONTACT_POINT_HOME_PHONE" /}
			{set currentFieldAccessor = "SITE_"+currentField /}
			{set profileField = this.data.rqstParams.profileFieldsAccessor[currentFieldAccessor] /}

			{if profileField.enabled}
				<div id="CONTACT_POINT_HOME_PHONE_Container">
					<input type="hidden" id="${currentField}" name="${currentField}"  value="" />
				</div>
				{set prefPhoneNumber = "H" /}
			{/if}

			{set currentField = "CONTACT_POINT_MOBILE_1" /}
			{set currentFieldAccessor = "SITE_"+currentField /}
			{set profileField = this.data.rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
			{if profileField.enabled}
				{set prefPhoneNumber = "M" /}
				<div id="CONTACT_POINT_MOBILE_1_Container">
					<input type="hidden" id="${currentField}" name="${currentField}"  value="" />
				</div>
			{/if}

			{set currentField = "CONTACT_POINT_BUSINESS_PHONE" /}
			{set currentFieldAccessor = "SITE_"+currentField /}
			{set profileField = this.data.rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
			{if profileField.enabled}
				<div id="CONTACT_POINT_BUSINESS_PHONE_Container">
					<input type="hidden" id="${currentField}" name="${currentField}"  value="" />
				</div>
				{set prefPhoneNumber = "O" /}
			{/if}

			<div class="row">
				<div class="field-3">
					<div class="padding-right">
						<p  class="pi_alpiprefnum">
							<label>${this.data.labels.tx_merci_text_booking_alpi_preferred_no}<span class="mandatory"> *</span></label>
							{set homePhoneFromScope = "" /}

							{if (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['M1']) && contactPoints['M1'].description != "")}
								{set prefPhoneFromScope = contactPoints['M1'].description /}
								{set prefPhoneNumber = "M" /}
								{set prefilled = "y" /}
							{/if}
							{if !this._merciFunc.isEmptyObject(this.data.rqstParams.userInputValues['CONTACT_POINT_MOBILE_1'])}
								{set prefPhoneFromScope = this.data.rqstParams.userInputValues['CONTACT_POINT_MOBILE_1'] /}
								{set prefPhoneNumber = "M" /}
								{set prefilled = "y" /}
							{/if}

							{if (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['H1']) && contactPoints['H1'].description != "")}
								{set prefPhoneFromScope = contactPoints['H1'].description /}
								{set prefPhoneNumber = "H" /}
								{set prefilled = "y" /}
							{/if}
							{if (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(this.data.rqstParams.userInputValues['CONTACT_POINT_HOME_PHONE']))}
								{set prefPhoneFromScope = this.data.rqstParams.userInputValues['CONTACT_POINT_HOME_PHONE'] /}
								{set prefPhoneNumber = "H" /}
								{set prefilled = "y" /}
							{/if}

							{if (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['B1']) && contactPoints['B1'].description != "")}
								{set prefPhoneFromScope = contactPoints['B1'].description /}
								{set prefPhoneNumber = "O" /}
								{set prefilled = "y" /}
							{/if}
							{if !this._merciFunc.isEmptyObject(this.data.rqstParams.userInputValues['CONTACT_POINT_BUSINESS_PHONE'])}
								{set prefPhoneFromScope = this.data.rqstParams.userInputValues['CONTACT_POINT_BUSINESS_PHONE'] /}
								{set prefPhoneNumber = "O" /}
								{set prefilled = "y" /}
							{/if}

							{if !this._merciFunc.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_TYPE)}
								{set prefPhoneNumber = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE /}
							{/if}

							{if prefPhoneFromScope == null }
								{if !this._merciFunc.isEmptyObject(this.data.rqstParams.requestBean.CONTACT_POINT_MOBILE_1) }
									{set prefPhoneFromScope = this.data.rqstParams.requestBean.CONTACT_POINT_MOBILE_1 /}
									{set prefPhoneNumber = "M" /}
								{/if}
							{elseif this.data.rqstParams.CONTACT_POINT_PHONE_TYPE == 'H1' /}
								{set prefPhoneNumber = "H" /}
							{elseif this.data.rqstParams.CONTACT_POINT_PHONE_TYPE == 'O1' /}
								{set prefPhoneNumber = "H" /}
							{/if}

							{if prefPhoneFromScope == null }
								{if !this._merciFunc.isEmptyObject(this.data.rqstParams.requestBean.CONTACT_POINT_HOME_PHONE) }
									{set prefPhoneFromScope = this.data.rqstParams.requestBean.CONTACT_POINT_HOME_PHONE /}
									{set prefPhoneNumber = "H" /}
								{/if}
								{if !this._merciFunc.isEmptyObject(this.data.rqstParams.requestBean.CONTACT_POINT_MOBILE_1) }
									{set prefPhoneFromScope = this.data.rqstParams.requestBean.CONTACT_POINT_MOBILE_1 /}
									{set prefPhoneNumber = "M" /}
								{/if}
								{if !this._merciFunc.isEmptyObject(this.data.rqstParams.requestBean.CONTACT_POINT_BUSINESS_PHONE) }
									{set prefPhoneFromScope = this.data.rqstParams.requestBean.CONTACT_POINT_BUSINESS_PHONE /}
									{set prefPhoneNumber = "O" /}
								{/if}
							{/if}

							{if prefPhoneFromScope == null }
								{if this.data.rqstParams.profileFieldsAccessor.SITE_CONTACT_POINT_HOME_PHONE.mandatory}
									{set prefPhoneNumber = "H" /}
									{set isMandatory = "y" /}
								{/if}
								{if this.data.rqstParams.profileFieldsAccessor.SITE_CONTACT_POINT_MOBILE_1.mandatory}
									{set prefPhoneNumber = "M" /}
									{set isMandatory = "y" /}
								{/if}
								{if this.data.rqstParams.profileFieldsAccessor.SITE_CONTACT_POINT_BUSINESS_PHONE.mandatory}
									{set prefPhoneNumber = "O" /}
									{set isMandatory = "y" /}
								{/if}
							{/if}

							{if preferredNumbersArray.length > 1}
								<select class="inputField" id='PREFERRED_PHONE_NO' name='PREFERRED_PHONE_NO' {on change {fn: 'setSelectedNumber', scope: this}/}>
									{if prefilled =='n' && isMandatory == "n" }
										{set prefPhoneNumber = preferredNumbersArray[0][0] /}
									{/if}
									{foreach numberItem in preferredNumbersArray}
										{set phoneType = numberItem[0] /}
										<option value="${numberItem[0]}" {if prefPhoneNumber == phoneType} selected {/if} {if (this.data.directLogin=="YES" && this.data.flowFrom === "profilePage")} disabled {/if}>
											${numberItem[1]}
										</option>
									{/foreach}
								</select>
							{elseif preferredNumbersArray.length == 1/}
								<input type="text" id="PREFERRED_PHONE_NO1" value="${preferredNumbersArray[0][1]}" readonly="readonly"/>
								<input type="hidden" name="PREFERRED_PHONE_NO" id="PREFERRED_PHONE_NO" value="${preferredNumbersArray[0][0]}"/>
							{/if}
						</p>
					</div>
				</div>
				<div class="field-3 country-main">

					{set currentFieldHome = "CONTACT_POINT_HOME_PHONE" /}
					{if this.data.earlyLogin == null}
						<input type="hidden"  name="validationListForCONTACT_POINT_HOME_PHONE" id="validationListForCONTACT_POINT_HOME_PHONE" value=""/>
					{/if}

					{set currentFieldMobile = "CONTACT_POINT_MOBILE_1" /}
					{if this.data.earlyLogin == null}
						<input type="hidden" name="validationListForCONTACT_POINT_MOBILE_1" id="validationListForCONTACT_POINT_MOBILE_1" value=""/>
					{/if}
					{set currentFieldOff = "CONTACT_POINT_BUSINESS_PHONE" /}

					{if this.data.earlyLogin == null}
						<input type="hidden" name="validationListForCONTACT_POINT_BUSINESS_PHONE" id="validationListForCONTACT_POINT_BUSINESS_PHONE" value=""/>
					{/if}

					{set currentFieldCountry = "COUNTRY" /}
					{if this.data.earlyLogin == null}
						<input type="hidden" name="validationListForCOUNTRY" id="validationListForCOUNTRY" value=""/>
					{/if}

					{if prefPhoneFromScope!= null}
						{if prefPhoneFromScope.indexOf('\(') == 0}
							{set varStartIndexOf = prefPhoneFromScope.indexOf('(') /}
							{set varEndIndexOf = prefPhoneFromScope.indexOf(')') /}
							{set varLength = prefPhoneFromScope.length /}
							{if varStartIndexOf >= 0 && varEndIndexOf >= 0}
								{set strCallingCountryCode = prefPhoneFromScope.substring(varStartIndexOf,varEndIndexOf+1) /}
								{set prefPhoneFromScope = prefPhoneFromScope.substring(varEndIndexOf+1,varLength) /}
							{/if}
						{/if}
					{/if}

					//written to prevent code break
					{set varStartIndexOfHyphen = null /}
					{if prefPhoneFromScope != null}
						{set varStartIndexOfHyphen = prefPhoneFromScope.indexOf('-') /}
					{/if}

					{if varStartIndexOfHyphen != null}
						{if prefPhoneFromScope != null}
							{set varLength = prefPhoneFromScope.length /}
						{/if}
						{if (varStartIndexOfHyphen >= 0) && (varLength >= 0) }
							{var strCallingCountryCode = "+"+prefPhoneFromScope.substring(0,varStartIndexOfHyphen) /}
							{set prefPhoneFromScope = prefPhoneFromScope.substring(varStartIndexOfHyphen+1,varLength) /}
							//<%-- Area Code --%>
							{set areaCodeHyphen = prefPhoneFromScope.indexOf('-') /}
							{if areaCodeHyphen >0 && prefPhoneFromScope.indexOf('-') != 0 }
								{set varLength = prefPhoneFromScope.length /}
								{set varStartIndexOfArea = 0 /}
								{set varEndIndexOfArea = prefPhoneFromScope.indexOf('-') /}
								{var areaCodeFromScope = prefPhoneFromScope.substring(varStartIndexOfArea,varEndIndexOfArea) /}
								{set prefPhoneFromScope = prefPhoneFromScope.substring(varEndIndexOfArea+1,varLength) /}
							{/if}
							//<%-- In case area Code is null --%>
							{if prefPhoneFromScope.indexOf('-') == 0}
								{set phoneLength = prefPhoneFromScope /}
								{set prefPhoneFromScope = prefPhoneFromScope.substring(1,phoneLength) /}
							{/if}
						{/if}
					{/if}

					{set varStartIndexOfSlash = null /}
					{if prefPhoneFromScope != null}
						{set varStartIndexOfSlash = prefPhoneFromScope.indexOf('/') /}
					{/if}

					{if varStartIndexOfSlash != null}
						{if prefPhoneFromScope != null}
							{set varLength = prefPhoneFromScope.length /}
						{/if}
						{if (varStartIndexOfSlash >= 0) && (varLength >= 0) }
							{var strCallingCountryCode = "+"+prefPhoneFromScope.substring(0,varStartIndexOfHyphen) /}
							{set prefPhoneFromScope = prefPhoneFromScope.substring(varStartIndexOfHyphen+1,varLength) /}

							{set prefPhoneFromScope = prefPhoneFromScope.replace("/","-") /}
							//<%-- Area Code --%>
							{set areaCodeHyphen = prefPhoneFromScope.indexOf('-') /}
							{if areaCodeHyphen >0 && prefPhoneFromScope.indexOf('-') != 0 }
								{set varLength = prefPhoneFromScope.length /}
								{set varStartIndexOfArea = 0 /}
								{set varEndIndexOfArea = prefPhoneFromScope.indexOf('-') /}
								{var areaCodeFromScope = prefPhoneFromScope.substring(varStartIndexOfArea,varEndIndexOfArea) /}
								{set prefPhoneFromScope = prefPhoneFromScope.substring(varEndIndexOfArea+1,varLength) /}
							{/if}
							//<%-- In case area Code is null --%>
							{if prefPhoneFromScope.indexOf('-') == 0}
								{set phoneLength = prefPhoneFromScope /}
								{set prefPhoneFromScope = prefPhoneFromScope.substring(1,phoneLength) /}
							{/if}
						{/if}
					{/if}

					{if this.data.rqstParams.userInputValues['COUNTRY'] != null}
						{var strCallingCountryCode = this.data.rqstParams.userInputValues['COUNTRY'] /}
					{/if}

					{if (strCallingCountryCode == null) && (!this._merciFunc.isEmptyObject(CONTACT_POINT_PHONE_COUNTRY_CODE))}
						{var strCallingCountryCode = "+"+CONTACT_POINT_PHONE_COUNTRY_CODE /}
					{/if}

					//<%-- Fix for PTR:05602147 ends here --%>
					{if (strCallingCountryCode == null) && (this.data.rqstParams.requestBean.COUNTRY != null) }
						{var strCallingCountryCode = this.data.rqstParams.requestBean.COUNTRY /}
					{/if}
					{if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage" && CONTACT_POINT_PHONE_COUNTRY_CODE != null && CONTACT_POINT_PHONE_COUNTRY_CODE.indexOf("undefined") == -1 )}
						{var strCallingCountryCode = "+"+CONTACT_POINT_PHONE_COUNTRY_CODE /}
					{/if}

					<div class="countryMain padding-right">
						<span class="country">
							<label>${this.data.labels.tx_merci_text_booking_alpi_country}<span class="mandatory"> *</span></label>
								{if strCallingCountryCode != null && strCallingCountryCode == '+' }
									{set strCallingCountryCode = "" /}
								{/if}
						</span>
						{if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")}
							<p class = "smartDropDwn">
								<input type="text" id="COUNTRY" size="5" class="" name="COUNTRY" value="${strCallingCountryCode}" required="required" readonly = "readonly" />
							</p>
						{else /}
							{var cb=null /}
							{var keyupFn=null /}
							{set keyupFn = {fn:"clrSelected" ,args:{name : "COUNTRY", id: "COUNTRY"}, scope: this} /}

							{call autocomplete.createAutoComplete({
								name: "COUNTRY",
								id: "COUNTRY",
								autocorrect:"off",
								autocapitalize:"none",
								autocomplete:"off",
								placeholder: '',
								type: 'text',
								class: 'mandatory',
								selectCode: true,
								value: strCallingCountryCode,
								source: this.getCountryList(),
								onblur: {fn:"toggleMandatoryBorder" ,args : {id: "COUNTRY" ,mandatory: true}, scope: this }
							})/}
						{/if}
						//<%-- Order is empty check and number, alphacheck and number, numeric check and no, alphanum check and no, email check and no --%>
						{if this.data.rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY != null }
							{var profile_AIR_CC_ADDRESS_COUNTRY = this.data.rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY /}
						{/if}
					</div>
				</div>
				{if this.utils.booleanValue(this.data.siteParameters.siteEnableAreaCode)}
					<div class="field-2 area-main clearNone">
						<div class="areaMain">
							//<%-- Area Code --%>
							//<%-- Only phone number will be displayed and no need to display area code.
							//     Hence Commenting the Area code as part of PTR: 05602147 --%>
							//<%-- Removing commented code as we need to display area code.
							//     Part of PTR: 05813220 --%>
							<label>${this.data.labels.tx_merci_text_booking_alpi_area_code}</label>
							{if areaCodeFromScope == '' || areaCodeFromScope == null }
								{set areaCodeFromScope = "" /}
							{/if}
							{if areaCodeFromScope == '' && !this._merciFunc.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE) && this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE.indexOf("undefined") == -1 }
								{set areaCodeFromScope = this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE /}
							{elseif areaCodeFromScope == '' && this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE_1 != null && this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE_1.indexOf("undefined") == -1 /}
								{set areaCodeFromScope = this.data.rqstParams.CONTACT_POINT_PHONE_AREA_CODE_1 /}
							{/if}
							 <p class="smartDropDwn">
								<input id="AREA_CODE" size="5" type="tel" value="${areaCodeFromScope}" {on blur {fn:'hideCrossIcon', args: {id: "AREA_CODE"}}/} {on blur {fn:'prefillSMSNumber'}/} {if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")} readonly = "readonly" {/if} {on keyup {fn:"clrSelected" ,args : {name : "AREA_CODE",id:"AREA_CODE"}} /}   />
								<span class="delete hidden" {on click {fn: 'clearField', args: {id: "AREA_CODE"}}/} id="delAREA_CODE"><span class="x xrtl">x</span></span>
							</p>
						</div>
					</div>
				{/if}
				<div class="phone-main{if this.utils.booleanValue(this.data.siteParameters.siteEnableAreaCode)} field-4 clearNone{else/} field-6{/if}">
					<div class="padding-left phoneMain{if !this.utils.booleanValue(this.data.siteParameters.siteEnableAreaCode)} no-area{/if}">
						//<%--  Phone Number  --%>
						{if !this._merciFunc.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER)}
							{if (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['H1']))}
								{set phoneFromBean = contactPoints['H1'].description /}
							{elseif (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['H2'])) /}
								{set phoneFromBean = contactPoints['H2'].description /}
							{elseif (!this._merciFunc.isEmptyObject(contactPoints) && !this._merciFunc.isEmptyObject(contactPoints['H3'])) /}
								{set phoneFromBean = contactPoints['H3'].description /}
							{else /}
								{set homeFromBean = "" /}
							{/if}
						{/if}
						{if this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER_1 != null && this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER_1.indexOf("undefined") == -1}
							{set prefPhoneFromScope = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER_1 /}
						{elseif !this._merciFunc.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER) && this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER.indexOf("undefined") == -1 /}
							{set prefPhoneFromScope = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER /}
						{/if}
						<label>${this.data.labels.tx_merci_text_booking_alpi_phone_number}<span class="mandatory"> *</span></label>
						<p class="smartDropDwn">
							{if this.data.earlyLogin == "YES"}
								<input class="mandatory" type="tel" name="CONTACT_POINT_MOBILE_1" id="PHONE_NUMBER" value="${prefPhoneFromScope}" {on blur {fn:"toggleMandatoryBorder" ,args :{id: "PHONE_NUMBER", mandatory: true}} /} {on keyup {fn:"clrSelected" ,args :{name : "PHONE_NUMBER",id:"PHONE_NUMBER"}} /} />
								<span class="delete hidden " {on click {fn: 'clearField', args: {id: "PHONE_NUMBER", mandatory: true}}/} id="delPHONE_NUMBER"><span class="x xrtl">x</span></span>
							{elseif this.data.directLogin == "YES" && this.data.flowFrom === "profilePage" /}
								<input class="mandatory" type="tel" id="PHONE_NUMBER" name = "CONTACT_POINT_PHONE_NUMBER_1" value="${prefPhoneFromScope}" readonly = "readonly" {on keyup {fn:"clrSelected" ,args : {name : "PHONE_NUMBER",id:"PHONE_NUMBER"}} /} />
								<span class="delete hidden" {on click {fn: 'clearField', args: {id: "PHONE_NUMBER"}}/} id="delPHONE_NUMBER"><span class="x xrtl">x</span></span>
							{else /}
								<input class="mandatory" type="tel" id="PHONE_NUMBER" name = "CONTACT_POINT_PHONE_NUMBER_1" value="${prefPhoneFromScope}" {on blur {fn:"toggleMandatoryBorder" ,args :{id: "PHONE_NUMBER", mandatory: true}} /} {on keyup {fn:"clrSelected" ,args : {name : "PHONE_NUMBER",id:"PHONE_NUMBER"}} /} />
								<span class="delete hidden " {on click {fn: 'clearField', args: {id: "PHONE_NUMBER", mandatory: true}}/} id="delPHONE_NUMBER"><span class="x xrtl">x</span></span>
							{/if}
						</p>
					</div>
				</div>
			</div>

			<div class="row">
				//SMS Number Validation
				{set currentField = "NOTIF_VALUE_1_1" /}
				{set currentFieldAccessor = "SITE_NOTIF_VALUE_1" /}
				{set currentFieldAccessorType = "NOTIF_TYPE_1_1" /}
				{set profileField = this.data.rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="field-6">
						<div class="pi_alpismsno">
							<label class="stmpLiWrapper">${this.data.labels.tx_merci_text_booking_SMSNotificationNumber}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate sms notification number or not
								{if !profileField.mandatory} <input type="hidden" name="validateSmsMblePhne" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateSmsMblePhne" value="true" /> {/if}
								//END: decide whether we  have to valdiate sms notification number or not
							</label>
							{var smsMobilePhoneFromScope = "" /}
							{if !this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList) && !this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].value) && (this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].type== 'M')}
								{set smsMobilePhoneFromScope = this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].value /}
							{/if}
							<input class="" type="hidden" name="${currentFieldAccessorType}"  value="M" />
							<input type="tel" name="${currentField}" id="${currentField}" value="${smsMobilePhoneFromScope}" class="{if profileField.mandatory}valreqd mandatory{/if}" {if profileField.mandatory}{on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{/if}/>
						</div>
					</div>
				{/if}

				<div class="{if profileField.enabled}field-6{else/}field-12{/if}">
					//EMAIL 1
					{set currentField = "CONTACT_POINT_EMAIL_1" /}
					{set currentFieldAccessor = "SITE_"+currentField /}
					{set profileField = this.data.rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
					{var validationListFor = "validationListFor"+currentField /}
					{if (!this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller) && this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints != null && !this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E1']) ) }
							{set emailFromBean = this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E1'].description /}
							{if this.data.rqstParams.userInputValues[currentField] != null}
								{set emailFromBean = this.data.rqstParams.userInputValues[currentField]/}
							{/if}
					{elseif (!this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller) && this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints != null && this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E2'] != null) /}
							{set emailFromBean = this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E2'].description /}
							{if this.data.rqstParams.userInputValues[currentField] != null}
								{set emailFromBean = this.data.rqstParams.userInputValues[currentField]/}
							{/if}
					{elseif (!this._merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller) && this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints != null && this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E3'] != null) /}
							{set emailFromBean = this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints['E3'].description /}
							{if this.data.rqstParams.userInputValues[currentField] != null}
								{set emailFromBean = this.data.rqstParams.userInputValues[currentField]/}
							{/if}
					{elseif (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") && this.data.rqstParams.CONTACT_POINT_EMAIL_1_1.indexOf("undefined") == -1 /}
						{set emailFromBean = this.data.rqstParams.CONTACT_POINT_EMAIL_1_1 /}
					{elseif (this.data.earlyLogin == "YES") && this.data.rqstParams.CONTACT_POINT_EMAIL_1_1.indexOf("undefined") == -1 /}
						{set emailFromBean = this.data.rqstParams.CONTACT_POINT_EMAIL_1_1 /}
					{else /}
						{set emailFromBean = "" /}
						{if this.data.rqstParams.userInputValues[currentField] != null}
							{set emailFromBean = this.data.rqstParams.userInputValues[currentField]/}
						{/if}
					{/if}

					<p class="mail">
						<label>
							${this.data.labels.tx_merci_text_booking_email}
							{if profileField.mandatory || (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage")} <span class="mandatory">*</span> {/if}
							//<%--  START: decide whether we  have to valdiate email or not --%>
							{if this.data.earlyLogin == null}
								{if !profileField.mandatory} <input type="hidden" name="validateEmail" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateEmail" value="true" /> {/if}
								//<%-- Fix to have email validation on servicing flow. PTR: 05595857  --%>
								<input type="hidden" name="${validationListFor}" value="true,1045,false,0,false,0,false,0,true,2130113,false,0"/>
								//<%-- END: decide whether we  have to valdiate email or not --%>
							{/if}
						</label>
						<p class="smartDropDwn">
							{if this.data.earlyLogin == "YES" }
								<input class="{if profileField.mandatory}mandatory{/if}" type="email" id="${currentField}" name="CONTACT_POINT_EMAIL_1" value="${emailFromBean}" {on blur {fn:"toggleMandatoryBorder" ,args :{id: currentField, mandatory: profileField.mandatory}} /} {on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /} />
								<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
							{elseif this.data.directLogin == "YES" && this.data.flowFrom === "profilePage"/}
								<input class="" type="email" id="${currentField}" name="CONTACT_POINT_EMAIL_1" readonly = "readonly" value="${emailFromBean}" {on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /} />
								<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField}}/} id="del${currentField}"><span class="x">x</span></span>
							{else /}
								<input class="{if profileField.mandatory}valreqd mandatory{/if}" type="email" id="${currentField}" name="${currentField}" value="${emailFromBean}" {if profileField.mandatory}{on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{/if}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /} />
								<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
							{/if}
						</p>
					</p>
				</div>
			</div>
		</section>

		{var countryFromScope = "" /}
		/* PTR 05851592 When strCallingCountryCode gets value of type: "Singapore(+65)" from request scope, we have to make its value to "+65" hence this is handled.*/
		{if strCallingCountryCode != null}
			{var FirstIndexOfBraceRequest = strCallingCountryCode.indexOf("(") /}
			{if FirstIndexOfBraceRequest != -1}
				{var lengthScope = strCallingCountryCode.length /}
				{set strCallingCountryCode = strCallingCountryCode.substring(FirstIndexOfBraceRequest+1,lengthScope) /}
				{var SecondIndexOfBraceRequest = strCallingCountryCode.indexOf(")") /}
				{if SecondIndexOfBraceRequest != -1}
					{set strCallingCountryCode = strCallingCountryCode.substring(0,SecondIndexOfBraceRequest) /}
				{/if}
			{/if}
			/*End: PTR 05851592*/
			{if strCallingCountryCode != null}
				{set strCallingCountryCode = "+"+strCallingCountryCode /}
			{/if}
		{/if}
	{/macro}


{/Template}