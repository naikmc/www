{Template{
  $classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfo',
  $dependencies: ['modules.view.merci.common.utils.MCommonScript'],
  $hasScript : true
}}

	{macro main()}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{var labels = this.data.labels/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var siteParameters = this.data.siteParameters/}

		{var currentField = ""/}
		{var homeFromBean = ""/}
		{var emailFromBean = ""/}
		{var mobileFromBean = ""/}
		{var businessFromBean = ""/}
		{var listTravellerBean = this.data.rqstParams.listTravellerBean/}

		<header class="pi_alpicontact">
			<h1>
				${labels.tx_merci_text_booking_contactinformation}
				{if this.data.isRebooking == 'FALSE'}
					<button type="button" class="toggle" aria-expanded="true" data-aria-controls="section33" id="oldContactInfo" {on click {fn:"toggleExpand",args : {sectionId:'section_oldContactInfo', buttonId: 'oldContactInfo'},scope: modules.view.merci.common.utils.MCommonScript } /}><span>Toggle</span></button>
				{/if}
			</h1>
		</header>

		<section id="section_oldContactInfo">
			<div class="row">
				<div class="field-12">
					<p class="requiredText padLeft"><span class="mandatory"> *</span>${labels.tx_merci_text_booking_alpi_indicates}</p>
				</div>
			</div>
			<div class="row">
				{var cssClassName = this._getPhoneNoCss()/}
			
				/* HOME PHONE */
				{if !merciFunc.isEmptyObject(listTravellerBean.primaryTraveller.identityInformation.contactPoints)}
					{if listTravellerBean.primaryTraveller.identityInformation.contactPoints['H1'] != null}
						{set homeFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['H1'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['H2'] != null /}
						{set homeFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['H2'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['H3'] != null /}
						{set homeFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['H3'].description /}
					{/if}
				{/if}
				
				{set currentField = "CONTACT_POINT_HOME_PHONE" /}
				{set currentFieldAccessor = "SITE_"+currentField /}
				{set profileField = rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="${cssClassName} margin-top">
						<div class="pi_alpihphone padding-right">
							<label class="pi_alpihphone">
								${labels.tx_merci_text_booking_homephone}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate home phone or not
								{if !profileField.mandatory} <input type="hidden" name="validateHmePhne" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateHmePhne" value="true" /> {/if}
								//END: decide whether we  have to valdiate home phone or not
							</label>
							<div class="smartDropDwn">
								<div id="CONTACT_POINT_HOME_PHONE_Container">
									<input type="tel" name="${currentField}" id="${currentField}"  value="${homeFromBean}" class="{if profileField.mandatory}valreqd mandatory{/if}" {on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /} />
									<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
								</div>
							</div>
						</div>
					</div>
				{/if}
				
				/* MOBILE PHONE */
				{if !merciFunc.isEmptyObject(listTravellerBean.primaryTraveller.identityInformation.contactPoints)}
					{if listTravellerBean.primaryTraveller.identityInformation.contactPoints['M1'] != null}
						{set mobileFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['M1'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['M2'] != null /}
						{set mobileFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['M2'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['M3'] != null /}
						{set mobileFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['M3'].description /}
					{/if}
				{/if}

				{set currentField = "CONTACT_POINT_MOBILE_1" /}
				{set currentFieldAccessor = "SITE_"+currentField /}
				{set profileField = rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="${cssClassName} margin-top">
						<div class="pi_alpimphone padding-right">
							<label class="pi_alpimphone">
								${labels.tx_merci_text_booking_mobilephone}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate mobile phone or not
								{if !profileField.mandatory} <input type="hidden" name="validateMblePhne" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateMblePhne" value="true" /> {/if}
								//END: decide whether we  have to valdiate mobile phone or not
							</label>
							<div class="smartDropDwn">
								<div id="CONTACT_POINT_MOBILE_1_Container">
									<input type="tel" name="${currentField}" id="${currentField}" value="${mobileFromBean}" class="{if profileField.mandatory}valreqd mandatory{/if}" {on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /}/>
									<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
								</div>
							</div>
						</div>
					</div>
				{/if}

				/* BUSINESS PHONE */
				{if !merciFunc.isEmptyObject(listTravellerBean.primaryTraveller.identityInformation.contactPoints)}
					{if listTravellerBean.primaryTraveller.identityInformation.contactPoints['B1'] != null}
						{set businessFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['B1'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['B2'] != null /}
						{set businessFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['B2'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['B3'] != null /}
						{set businessFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['B3'].description /}
					{/if}
				{/if}

				{set currentField = "CONTACT_POINT_BUSINESS_PHONE" /}
				{set currentFieldAccessor = "SITE_"+currentField /}
				{set profileField = rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="${cssClassName} margin-top">
						<div class="pi_alpibphone">
							<label class="pi_alpibphone">
								${labels.tx_merci_text_booking_apis_businessphone}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate business phone or not
								{if !profileField.mandatory} <input type="hidden" name="validateBusinessPhne" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateBusinessPhne" value="true" /> {/if}
								//END: decide whether we  have to valdiate business phone or not
							</label>
							<div class="smartDropDwn">
								<div id="CONTACT_POINT_BUSINESS_PHONE_Container">
									<input type="tel" name="${currentField}"  id="${currentField}" value="${businessFromBean}" class="{if profileField.mandatory}valreqd mandatory{/if}" {on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /}/>
									<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="row">
				
				{set cssClassName = this._getOtherContactCss()/}
			
				/* SMS NOTIFICATION NUMBER */
				{set currentField = "NOTIF_VALUE_1_1" /}
				{set currentFieldAccessor = "SITE_NOTIF_VALUE_1" /}
				{set currentFieldAccessorType = "NOTIF_TYPE_1_1" /}
				{set profileField = rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="${cssClassName} margin-top">
						<div class="pi_alpisms padding-right">
							<label class="pi_alpisms">
								${labels.tx_merci_text_booking_SMSNotificationNumber}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate sms notification number or not
								{if !profileField.mandatory} <input type="hidden" name="validateSmsMblePhne" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateSmsMblePhne" value="true" /> {/if}
								//END: decide whether we  have to valdiate sms notification number or not
							</label>
							<div class="smartDropDwn">
								<div id="NOTIF_VALUE_1_1_Container">
									{var smsMobilePhoneFromScope = "" /}
									{if !merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList) && !merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].value) && (this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].type== 'M')}
										{set smsMobilePhoneFromScope = this.data.rqstParams.listTravellerBean.primaryTraveller.notificationInformationList[0].value /}
									{/if}
		
									<input type="tel" name="${currentField}" id="${currentField}" value="${smsMobilePhoneFromScope}" class="{if profileField.mandatory}valreqd mandatory{/if}" {on blur {fn:"updateContactHeaderPanel" ,args : {id: currentField, mandatory: profileField.mandatory}} /}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /} />
									<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
								</div>
							</div>
						</div>
						<input class="" type="hidden" name="${currentFieldAccessorType}"  value="M" />
					</div>
				{/if}

				/* EMAIL 1 */
				{if !merciFunc.isEmptyObject(listTravellerBean.primaryTraveller.identityInformation.contactPoints)}
					{if listTravellerBean.primaryTraveller.identityInformation.contactPoints['E1'] != null}
						{set emailFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['E1'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['E2'] != null /}
						{set emailFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['E2'].description /}
					{elseif listTravellerBean.primaryTraveller.identityInformation.contactPoints['E3'] != null /}
						{set emailFromBean = listTravellerBean.primaryTraveller.identityInformation.contactPoints['E3'].description /}
					{/if}
				{/if}

				{set currentField = "CONTACT_POINT_EMAIL_1" /}
				{set currentFieldAccessor = "SITE_"+currentField /}
				{set profileField = rqstParams.profileFieldsAccessor[currentFieldAccessor] /}
				{if profileField.enabled}
					<div class="${cssClassName} margin-top">
						<div class="pi_alpiemail">
							<label>
								${labels.tx_merci_text_booking_email}
								{if profileField.mandatory} <span class="mandatory">*</span> {/if}

								//  START: decide whether we  have to valdiate email or not
								{if !profileField.mandatory} <input type="hidden" name="validateEmail" value="false" /> {/if}
								{if profileField.mandatory} <input type="hidden" name="validateEmail" value="true" /> {/if}
								//END: decide whether we  have to valdiate email or not
							</label>
							<div class="smartDropDwn">
								<div id="CONTACT_POINT_EMAIL_1_Container">
									<input type="email" name="${currentField}" id="${currentField}" value="${emailFromBean}" class="{if profileField.mandatory}valreqd mandatory{/if}" {on blur {fn:"updateContactHeaderPanel" ,args :{id: currentField, mandatory: profileField.mandatory}} /}{on keyup {fn:"clrSelected" ,args : {name : currentField ,id: currentField}} /}/>
									<span class="delete hidden" {on click {fn: 'clearField', args: {id: currentField, mandatory: profileField.mandatory}}/} id="del${currentField}"><span class="x">x</span></span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</section>
	{/macro}
{/Template}