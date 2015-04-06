{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MSocialSecurityCard',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true,
	$wlibs : {
    		'cust': 'modules.view.merci.common.widgets.CustomWidgetLib'
    	}
}}
	
	{var selectedDay = 0/}
	{var selectedYear = 0/}
	{var selectedMonth = 0/}

	{macro main()}
		{var labels = this.data.labels/}
		{var siteParams = this.data.siteParams/}
		{var rqstParams = this.data.rqstParams/}
		{var globalList = this.data.globalList/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		
		<footer class="ssn">
			<h2>${labels.tx_pltg_text_SocialSecurityCardInfo}</h2>
			<p>
				<label for="AIR_CC_FULL_HOLDER_NAME">${labels.tx_pltg_text_SocialSecurityCardCardholder} <span class="mandatory">*</span></label>
				<input id="AIR_CC_FULL_HOLDER_NAME" type="text" name="AIR_CC_FULL_HOLDER_NAME">
			</p>
			<p>
				<label for="AIR_CC_CUSTOMER_NUMBER">${labels.tx_pltg_text_SocialSecurityCardNumber} <span class="mandatory">*</span></label>
				<input id="AIR_CC_CUSTOMER_NUMBER" type="tel" name="AIR_CC_CUSTOMER_NUMBER">
			</p>
			{var listTravellerBean=this.data.rqstParams.listTravellerBean /}
			{var dateOfBirth=null /}
				{if listTravellerBean && listTravellerBean.primaryTraveller && listTravellerBean.primaryTraveller.identityInformation && listTravellerBean.primaryTraveller.identityInformation.dateOfBirth}
					{set dateOfBirth=listTravellerBean.primaryTraveller.identityInformation.dateOfBirth /}
				{/if}
			<div class="list expiry">
				<label for="AIR_CC_DATE_OF_BIRTH">${labels.tx_pltg_text_SocialSecurityCardDoB} <span class="mandatory">*</span></label>
				<ul class="input" id="dob">
					{var inputDates = siteParams.siteLangDateFormat.split(',')/}
					{foreach inputDate in inputDates}
						{if inputDate == 'D'}
							<li>
								<select id="sscDobDay" name="sscDobDay">
									{for var i = 1; i <= 31; i++}
										<option value="${i}" {if dateOfBirth && dateOfBirth.day==i}selected="selected"{/if}>${i}</option>
									{/for}
								</select>
							</li>
						{elseif inputDate == 'M'/}
							<li>
								<select id="sscDobMonth" name="sscDobMonth">
									{foreach monthItem in globalList.slShortMonthList}
										<option value="${parseInt(monthItem_index) + 1}" {if dateOfBirth && dateOfBirth.month==monthItem_index} selected="selected" {/if}>${monthItem[1]}</option>
									{/foreach}
								</select>
							</li>
						{elseif inputDate == 'Y'/}
							<li>
								<select id="sscDobYear" name="sscDobYear">
									{var year = (new Date()).getFullYear()/}
									{for var i = 0; i < 112; i++}
										{var printYear = year - i/}
										<option value="${printYear}" {if dateOfBirth && dateOfBirth.year==printYear} selected="selected" {/if}>${printYear}</option>
									{/for}
								</select>
						{/if}
					{/foreach}
      			</ul>
      			{if merciFunc.booleanValue(siteParams.newDOBPicker)}
      			{@cust:SpinWheel {
					id : "SpinWheel",
					monthInd : "1",															        
			        controlInputs : {"d": "sscDobDay","m":"sscDobMonth","y":"sscDobYear","monthArr":this.data.gblLists.slShortMonthList}
			      }/}
			    {/if}
			    {if !merciFunc.booleanValue(siteParams.newDOBPicker)}
			    	<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" class="datepicker" id="btnDatePicker"/></a>
			    {/if}

      			
			</div>
		</footer>
	{/macro}
{/Template}