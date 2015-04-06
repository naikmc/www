{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MBookNominee',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript']
}}

	{macro main()}
		{var rqstParams = this.data.requestParam/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		
		{if rqstParams != null && (rqstParams.enableDirectLogin == 'YES' || rqstParams.directLogin == 'YES')}
		
			{var numberOfProfiles = rqstParams.request.NUMBER_OF_PROFILES/}
			{if numberOfProfiles == null}
				{set numberOfProfiles = rqstParams.noOfProfiles/}
			{/if}
			
			<input type="hidden" name="DIRECT_LOGIN" value="YES"/>
			<input type="hidden" name="NUMBER_OF_PROFILES" value="${numberOfProfiles}"/>
			<input type="hidden" name="USER_ID" value="{if rqstParams.request.USER_ID != null}${rqstParams.request.USER_ID}{elseif !merciFunc.isEmptyObject(rqstParams.userId)/}${rqstParams.userId}{/if}"/>
			<input type="hidden" name="PASSWORD_1" value="{if rqstParams.request.PASSWORD_1 != null}${rqstParams.request.PASSWORD_1}{elseif !merciFunc.isEmptyObject(rqstParams.password1)/}${rqstParams.password1}{/if}" />
			<input type="hidden" name="PASSWORD_2" value="{if rqstParams.request.PASSWORD_2 != null}${rqstParams.request.PASSWORD_2}{elseif !merciFunc.isEmptyObject(rqstParams.password2)/}${rqstParams.password2}{/if}" />
			<input type="hidden" name="PAYMENT_TYPE" value="{if rqstParams.request.PAYMENT_TYPE != null}${rqstParams.request.PAYMENT_TYPE}{elseif !merciFunc.isEmptyObject(rqstParams.paymentType)/}${rqstParams.paymentType}{/if}" />

			{var contactPointPhone = ''/}
			{if rqstParams.request.CONTACT_POINT_HOME_PHONE != null}
				{set contactPointPhone = rqstParams.request.CONTACT_POINT_HOME_PHONE/}
			{elseif !merciFunc.isEmptyObject(rqstParams.contactPointHomePhone)/}
				{set contactPointPhone = rqstParams.contactPointHomePhone/}
			{elseif rqstParams.request.CONTACT_POINT_PHONE_NUMBER != null/}
				{set contactPointPhone = rqstParams.request.CONTACT_POINT_PHONE_NUMBER/}
			{/if}
			<input type="hidden" name="CONTACT_POINT_HOME_PHONE" value="${contactPointPhone}" />
			
			{var TRAVELLER_TYPE_COUNT = 1/}
			{var TITLE_COUNT = 1/}
			{var FIRST_NAME_COUNT = 1/}
			{var LAST_NAME_COUNT = 1/}
			{var GENDER_COUNT = 1/}
			{var TD_ROLE_COUNT = 1/}
			{var TYPE_COUNT = 1/}
			{var ITEM_ID_COUNT = 1/}
			{var PREF_AIR_FREQ_NUMBER_COUNT = 1/}
			{var PASSPORT_NUMBER_COUNT = 1/}
			{var EXPIRY_DATE_COUNT = 1/}
			{var PASSPORT_COUNTRY_CODE_COUNT = 1/}
			{var LIST_ADDRESS_INFORMATION_COUNT = 1/}
			{var DATE_OF_BIRTH_COUNT = 1/}
			{var CONTACT_POINT_EMAIL_COUNT = 1/}
			{var PREF_AIR_FREQ_AIRLINE_COUNT = 1/}
			
			{var modValue = (rqstParams.nomineeDetails.length/numberOfProfiles)/}
			{foreach listItems in rqstParams.nomineeDetails}
				{var id = ''/}
				{var mod = parseInt(listItems_index) % modValue/}
				{if mod == 0}
					{set id = "TRAVELLER_TYPE_" + TRAVELLER_TYPE_COUNT++/}
				{elseif mod == 1/}
					{set id = "TITLE_" + TITLE_COUNT++/}
				{elseif mod == 2/}
					{set id = "FIRST_NAME_" + FIRST_NAME_COUNT++/}
				{elseif mod == 3/}
					{set id = "LAST_NAME_" + LAST_NAME_COUNT++/}
				{elseif mod == 4/}
					{set id = "GENDER_" + GENDER_COUNT++/}
					{if listItems == null || listItems.trim() == ''}
						{set listItems = 'D'/}
					{/if}
				{elseif mod == 5/}
					{set id = "TD_ROLE_" + TD_ROLE_COUNT++/}
				{elseif mod == 6/}
					{set id = "TYPE_" + TYPE_COUNT++/}
				{elseif mod == 7/}
					{set id = "ITEM_ID_" + ITEM_ID_COUNT++/}
				{elseif mod == 8/}
					{set id = "PREF_AIR_FREQ_NUMBER_" + PREF_AIR_FREQ_NUMBER_COUNT++ + "_1"/}
				{elseif mod == 9/}
					{set id = "PASSPORT_NUMBER_" + PASSPORT_NUMBER_COUNT++ + "_1"/}
				{elseif mod == 10/}
					{set id = "EXPIRY_DATE_" + EXPIRY_DATE_COUNT++/}
				{elseif mod == 11/}
					{set id = "PASSPORT_COUNTRY_CODE_" + PASSPORT_COUNTRY_CODE_COUNT++ + "_1"/}
				{elseif mod == 12/}
					{set id = "LIST_ADDRESS_INFORMATION_" + LIST_ADDRESS_INFORMATION_COUNT++/}
				{elseif mod == 13/}
					{set id = "DATE_OF_BIRTH_" + DATE_OF_BIRTH_COUNT++/}
				{elseif mod == 14/}
					{set id = "CONTACT_POINT_EMAIL_" + CONTACT_POINT_EMAIL_COUNT++ + "_1"/}
				{elseif mod == 15/}
					{set id = "PREF_AIR_FREQ_AIRLINE_" + PREF_AIR_FREQ_AIRLINE_COUNT++ + "_1"/}
				{/if}
				
				{call createInputHidden(id, listItems)/}
			{/foreach}
			{if rqstParams.request.PREF_AIR_FREQ_MILES_1_1 != undefined}
				<input type="hidden" name="PREF_AIR_FREQ_MILES_1_1" value="${rqstParams.request.PREF_AIR_FREQ_MILES_1_1}" />
			{/if}
			{if rqstParams.request.PREF_AIR_FREQ_LEVEL_1_1 != undefined}
				<input type="hidden" name="PREF_AIR_FREQ_LEVEL_1_1" value="${rqstParams.request.PREF_AIR_FREQ_LEVEL_1_1}" />
			{/if}
			{if rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1 != undefined}
				<input type="hidden" name="PREF_AIR_FREQ_OWNER_TITLE_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_TITLE_1_1}" />
			{/if}
			{if rqstParams.request.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1 != undefined}
				<input type="hidden" name="PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1}" />
			{/if}
			{if rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1 != undefined}
				<input type="hidden" name="PREF_AIR_FREQ_OWNER_LASTNAME_1_1" value="${rqstParams.request.PREF_AIR_FREQ_OWNER_LASTNAME_1_1}" />
			{/if}
		{/if}
	{/macro}
	
	{macro createInputHidden(inputId, inputValue)}
		{if inputValue != null && inputValue.trim() != ''}
			<input type="hidden" name="${inputId}" value="${inputValue}"/>
		{/if}		
	{/macro}
{/Template}