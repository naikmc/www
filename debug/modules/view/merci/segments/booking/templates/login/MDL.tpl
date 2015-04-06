{Template {
	$classpath : "modules.view.merci.segments.booking.templates.login.MDL",
	$hasScript : true,
	$macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
	}
}}

	{macro main()}
		{if (this.moduleCtrl.getModuleData().login.MDL_A != null)}
			{var labels = this.moduleCtrl.getModuleData().login.MDL_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().login.MDL_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().login.MDL_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().login.MDL_A.requestParam/}
			{var errors = this.moduleCtrl.getModuleData().login.MDL_A.errorStrings/}
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		{/if}
		<div class="loginMask">
			<article class="panel login">
				<header>
					<h1>${labels.tx_merci_dl_login}</h1>
				</header>
				{call includeError(labels) /}
				<section class="loginContent">
					<form  {on submit {fn:'submitLForm'}/} id='loginForm'>
						<input type="hidden" name="result" value="json"/>
						{if !merciFunc.isEmptyObject(rqstParams.FROM_PAX)}
							<input type="hidden" name="FROM_PAX" value="${rqstParams.FROM_PAX}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.IS_WEBFARES)}
						<input type="hidden" name="IS_WEBFARES" value="${rqstParams.IS_WEBFARES}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.PLTG_FROMPAGE)}
						<input type="hidden" name="PLTG_FROMPAGE" value="${rqstParams.PLTG_FROMPAGE}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.TYPE)}
						<input type="hidden" name="TYPE" value="${rqstParams.TYPE}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.CABIN)}
						<input type="hidden" name="CABIN" value="${rqstParams.CABIN}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.RESTRICTION)}
						<input type="hidden" name="RESTRICTION" value="${rqstParams.RESTRICTION}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.COMMERCIAL_FARE_FAMILY_1)}
						<input type="hidden" name="COMMERCIAL_FARE_FAMILY_1" value="${rqstParams.COMMERCIAL_FARE_FAMILY_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.upsellOutLow)}
						<input type="hidden" name="upsellOutLow" value="${rqstParams.upsellOutLow}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.upsellInLow)}
						<input type="hidden" name="upsellInLow" value="${rqstParams.upsellInLow}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.FLOW_TYPE)}
						<input type="hidden" name="FLOW_TYPE" value="${rqstParams.FLOW_TYPE}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.TRIP_TYPE)}
						<input type="hidden" name="TRIP_TYPE" value="${rqstParams.TRIP_TYPE}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.COMMERCIAL_FARE_FAMILY_1)}
						<input type="hidden" name="COMMERCIAL_FARE_FAMILY_1" value="${rqstParams.COMMERCIAL_FARE_FAMILY_1}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.PRICING_TYPE)}
						<input type="hidden" name="PRICING_TYPE" value="${rqstParams.PRICING_TYPE}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.ENABLE_LATE_LOGIN)}
						<input type="hidden" name="ENABLE_LATE_LOGIN" value="${rqstParams.ENABLE_LATE_LOGIN}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.KF_REDEEM)}
						<input type="hidden" name="KF_REDEEM" value="${rqstParams.KF_REDEEM}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.IS_BOOKMARK_FLOW)}
						<input type="hidden" name="IS_BOOKMARK_FLOW" value="${rqstParams.IS_BOOKMARK_FLOW}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.B_LOCATION_0)}
						<input type="hidden" name="B_LOCATION_0" value="${rqstParams.B_LOCATION_0}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.E_LOCATION_0)}
						<input type="hidden" name="E_LOCATION_0" value="${rqstParams.E_LOCATION_0}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.B_DATE_0)}
						<input type="hidden" name="B_DATE_0" value="${rqstParams.B_DATE_0}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.E_DATE_0)}
						<input type="hidden" name="E_DATE_0" value="${rqstParams.E_DATE_0}"/>
						{/if}
						{if rqstParams.OBFEEVAL != null }
						<input type="hidden" name="OBFEEVAL" value="${rqstParams.OBFEEVAL}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.PAGE_TICKET)}
						<input type="hidden" name="PAGE_TICKET" value="${rqstParams.PAGE_TICKET}"/>
						{/if}
						{if !merciFunc.isEmptyObject(rqstParams.ENABLE_EARLY_LOGIN)}
						<input type="hidden" name="ENABLE_EARLY_LOGIN" value="${rqstParams.ENABLE_EARLY_LOGIN}"/>
						{/if}
						<span id="loginCredentials">
							<p>
								<label for="USER_ID">${labels.tx_merci_dl_id}</label>
								<input id="USER_ID" type="text" name="USER_ID"/>
							</p>
							<p>
								<label for="PASSWORD">${labels.tx_merci_dl_password}</label>
								<input id="PASSWORD" type="text" name="PASSWORD" class="inputField widthClearFull securitymask"/>
							</p>
						</span>
						<footer class="buttons" id= "loginCredentialsFooter" >
							<button type="submit" class="validation" id="firstValidate">${labels.tx_merci_dl_login}</button>
							<button type="button" class="validation cancel leftAligned" id="sendEmailButton" {on tap {fn : 'sendEmail'}/}>${labels.tx_merci_dl_sendByEmail}</button>
						</footer>
					</form>	
					<form {on submit {fn:'sendMail'} /} id="mailPassword" >
						<input type="hidden" name="FLOW" value="ResetPassword" />
						{if !this.__merciFunc.isEmptyObject(rqstParams.pageTicket) && rqstParams.pageTicket != ''}
							<input type="hidden" name="PAGE_TICKET" id="pageTicket" value="${rqstParams.PAGE_TICKET}" />
						{/if}
						<input type="hidden" name="USER_ID" id="userId" value="${rqstParams.userId}"/>
						<input type="hidden" name="result" value="json"/>
						<input type="hidden" name="SITE" id ="site" value = "" />
						<input type="hidden" name="LANGUAGE" id = "language" value = "" /> 
						<span id="enterEmailID">
							<p>
								<label for="input1">${labels.tx_merci_dl_email}</label>
								<input id="input1" type="text" name="CONTACT_POINT_EMAIL_1_1" placeholder="Enter your email address"/>
							</p>
							<footer class="buttons" id="sendPassword" >
								<button type="submit" class="validation" name='login-sendmail'>${labels.tx_merci_dl_send}</button>
							</footer>
						</span>
					</form>						
				</section>
			</article>
		</div>
	{/macro}
	
	{macro includeError(labels)}
		{section {
			id: 'errors',
			bindRefreshTo : [{
				inside : this.data,
				to : "errorOccured",
				recursive : true
			}],
			macro : {
				name: 'printErrors',
				args: [labels]
			}
		}/}
	{/macro}
	
	{macro printErrors(labels)} 
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
			/* resetting binding flag */
			${this.data.errorOccured = false|eat}
		{/if}
	{/macro}
{/Template}	