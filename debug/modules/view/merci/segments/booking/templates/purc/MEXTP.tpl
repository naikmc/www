{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MEXTP',
	$hasScript: true
}}

	{macro main()}
		{var siteParams = this.moduleCtrl.getModuleData().booking.EXTP_A.siteParam/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.EXTP_A.requestParam/}

		{var pspURLAccess = rqstParams.externalPaymentBean.pspUrl/}

		{if extrnlPayment.utils.isRequestFromApps()}

			<div class="extPaymentIframe">
				<iframe frameborder="0" style="${this._getIFrameStyle()}"
						name="myframe" id="myframe" {on load { fn : this.frameLoad, scope :this}/}>
				</iframe>
			</div>

		{/if}

		{var method= "POST"/}
		{if siteParams.siteFormMethod != null}
			{set method= siteParams.siteFormMethod/}
		{/if}

		{var keepAliveURL = rqstParams.externalPaymentBean.keepAliveUrl/}
		{var confirmationURL = rqstParams.externalPaymentBean.confirmationUrl + '&PAGE_TICKET=' + rqstParams.pageTicket/}
		{var cancellationURL = rqstParams.externalPaymentBean.cancellationUrl + '&PAGE_TICKET=' + rqstParams.pageTicket/}

		<form name="externalPayment" action="${pspURLAccess}" method="${method}">
			<input type="hidden" name="ACTION" value="PAYMENT"/>
			<input type="hidden" name="ENC_TYPE" value="${rqstParams.externalPaymentBean.encodeType}"/>
			<input type="hidden" name="ENC" value="${rqstParams.externalPaymentBean.encoding}"/>
			<input type="hidden" name="ENC_TIME" value="${rqstParams.externalPaymentBean.encodeTime}"/>
			<input type="hidden" name="ENC_CC" value="${rqstParams.externalPaymentBean.encodeCC}"/>
			<input type="hidden" name="CHECKSUM" value="${rqstParams.externalPaymentBean.encodeChecksum}"/>
			<input type="hidden" name="CHECKSUM_CHARSET" value="${rqstParams.externalPaymentBean.encodeChecksumCharset}"/>
			<input type="hidden" name="CONFIRMATION_URL" value="${confirmationURL}"/>
			<input type="hidden" name="CANCELLATION_URL" value="${cancellationURL}"/>
			<input type="hidden" name="KEEPALIVE_URL" value="${keepAliveURL}"/>
			<input type="hidden" name="KEEPALIVE_FREQUENCY" value="${rqstParams.externalPaymentBean.keepAliveFrequency}"/>
			<input type="hidden" name="PROCESS_AUTH" value="${rqstParams.externalPaymentBean.processAuth}"/>
			<input type="hidden" name="PAYMENT_TYPE" value="${rqstParams.externalPaymentBean.paymentType}"/>
			<input type="hidden" name="PAYMENT_REFERENCE" value="${rqstParams.externalPaymentBean.paymentReference}"/>
			<input type="hidden" name="AMOUNT" value="${rqstParams.externalPaymentBean.paymentAmount}"/>
			<input type="hidden" name="CURRENCY" value="${rqstParams.externalPaymentBean.paymentCurrency}"/>
			<input type="hidden" name="VIRTUAL_CC" value="${rqstParams.externalPaymentBean.paymentVirtualCc}"/>
			<input type="hidden" name="RL" value="${rqstParams.externalPaymentBean.recordLocator}"/>
			<input type="hidden" name="BANKID" value="${rqstParams.externalPaymentBean.bankId}"/>
			<input type="hidden" name="MERCHANT_ID" value="${rqstParams.externalPaymentBean.merchantId}"/>
			<input type="hidden" name="COUNTRY_OF_DEPARTURE" value="${rqstParams.externalPaymentBean.countryOfDeparture}"/>
			<input type="hidden" name="SESSION_ID" value="${rqstParams.externalPaymentBean.sessionId}"/>
			<input type="hidden" name="SITE" value='${rqstParams.param.siteCode}' />
			<input type="hidden" name="LANGUAGE" value='${rqstParams.param.languageCode}' />
			<input type="hidden" name="USER_TITLE" value="${rqstParams.externalPaymentBean.userTitle}"/>
			<input type="hidden" name="USER_LAST_NAME" value="${rqstParams.externalPaymentBean.userLastName}"/>
			<input type="hidden" name="USER_FIRST_NAME" value="${rqstParams.externalPaymentBean.userFirstName}"/>
			<input type="hidden" name="USER_MOBILE_PHONE" value="${rqstParams.externalPaymentBean.userMobilePhone}"/>
			<input type="hidden" name="USER_HOME_PHONE" value="${rqstParams.externalPaymentBean.userHomePhone}"/>
			<input type="hidden" name="USER_BUSINESS_PHONE" value="${rqstParams.externalPaymentBean.userBusinessPhone}"/>
			<input type="hidden" name="USER_EMAIL" value="${rqstParams.externalPaymentBean.userEMail}"/>
			<input type="hidden" name="ON_HOLD_ELIGIBLE" value="${rqstParams.externalPaymentBean.onHoldEligible}"/>
			<input type="hidden" name="ON_HOLD_MAX_DATE" value="${rqstParams.externalPaymentBean.onHoldMaxDate}"/>
			<input type="hidden" name="DEFERRED_PAYMENT_ELIGIBLE" value="${rqstParams.externalPaymentBean.deferredPaymentEligible}"/>
			<input type="hidden" name="AMOUNT_AIR" value="${rqstParams.externalPaymentBean.paymentAmountAir}"/>
			
			{if rqstParams.externalPaymentBean.insuranceIds != null || rqstParams.externalPaymentBean.insuranceIds != ""}
				{foreach insuranceId in rqstParams.externalPaymentBean.insuranceIds}
					<input type="hidden" value="${insuranceId}" name="${insuranceId_index}"/>
				{/foreach}
			{/if}
			{if rqstParams.externalPaymentBean.insuranceAmounts != null && rqstParams.externalPaymentBean.insuranceAmounts != ""}
				{foreach insuranceAmount in rqstParams.externalPaymentBean.insuranceAmounts}
					<input type="hidden" value="${insuranceAmount}" name="${insuranceAmount_index}"/>
				{/foreach}
			{/if}
			{if rqstParams.externalPaymentBean.itineraryInfos != null && rqstParams.externalPaymentBean.itineraryInfos != ""}
				{foreach itineraryInfo in rqstParams.externalPaymentBean.itineraryInfos}
					<input type="hidden" value="${itineraryInfo}" name="${itineraryInfo_index}"/>
				{/foreach}
			{/if}
			{if siteParams.siteMerciDataTransfer!=null && siteParams.siteMerciDataTransfer.toLowerCase()=='true'
				&& siteParams.siteDataTransfer != null
				&& siteParams.siteDataTransfer.toLowerCase() == 'true'
				&& siteParams.siteAllowDataTransExt != null
				&& siteParams.siteAllowDataTransExt.toLowerCase() == 'true'}
				{for key in rqstParams.datatransfer}
				  {if rqstParams.datatransfer.hasOwnProperty(key) == true}
				    <input type="hidden" value="${rqstParams.datatransfer[key]}" name="${key}"/>
				  {/if}
				{/for}
			{/if}
		</form>

		<div id="extPaymentMsk" class="dark loading"></div>
	{/macro}

{/Template}