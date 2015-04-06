{Template {
  $classpath: 'modules.view.merci.segments.booking.templates.farereview.MFare',
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  },
  $hasScript: true
}}

  {macro main()}

    {var labels = this.moduleCtrl.getModuleData().booking.MFARE_A.labels/}
    {var siteParams = this.moduleCtrl.getModuleData().booking.MFARE_A.siteParam/}
    {var globalList = this.moduleCtrl.getModuleData().booking.MFARE_A.globalList/}
    {var rqstParams = this.moduleCtrl.getModuleData().booking.MFARE_A.requestParam/}

    // getting rebooking status
    {var bRebooking = false/}
    {if !this.__merciFunc.isEmptyObject(rqstParams.fareBreakdown) && !this.__merciFunc.isEmptyObject(rqstParams.fareBreakdown.rebookingStatus)}
      {set bRebooking = rqstParams.fareBreakdown.rebookingStatus /}
    {/if}

    {var isAwardsFlow = siteParams.siteAllowAwards != null && siteParams.siteAllowAwards.toLowerCase() == 'true' && !this.__merciFunc.isEmptyObject(rqstParams.awardsFlow)/}
    {var isNewSearch = siteParams.siteNewSearch/}
    {var searchURL = siteParams.siteSearchURL/}

    <div class="booking summ{if bRebooking} atc{/if}">
      <section>

				{var formAction = 'MAddElementsTravellerInformation.action'/}
				{if bRebooking == true}
					{set formAction = 'MRebookingAddElements.action'/}
				{/if}
				{if rqstParams.param.IS_SPEED_BOOK == 'TRUE'}
					{set formAction = 'MSBFlowDispatcher.action'/}
				{/if}
        <form {on submit {fn:'submitFareForm',args:{action:formAction}}/} id = 'fareForm'>

          {call common.showBreadcrumbs(3)/}
          {if !this.__merciFunc.isEmptyObject(rqstParams.DWM_HEADER_CONTENT)}
                  {@html:Template {
                      classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                      data: {
                        placeholder: rqstParams.DWM_HEADER_CONTENT,
                        placeholderType: "dwmHeader"
                      }
                  }/}
          {/if}

          ${this._setErrorMessage()}

          // include error tpl
          {call includeError(labels)/}

          {if !this.__merciFunc.isEmptyObject(rqstParams) && !this.__merciFunc.isEmptyObject(rqstParams.dwmContent)}
              {call displayCEMBanner(rqstParams.dwmContent)/}
          {/if}
	    {if (siteParams.siteAllowPayLater == 'TRUE' && rqstParams.payLaterBean !=undefined && rqstParams.payLaterBean.onHoldEligible)}
              {var messages = new Array()/}
			  {var dtTime = this._getDateTime(rqstParams.payLaterBean.onHoldLimitDate)/}
			  {var dateStr = aria.utils.Date.format(dtTime, "EEEE d MMMM yyyy")/}
			  {var dateTime = aria.utils.Date.format(dtTime, "HH:mm")/}
			  {var payLaterInfoArray = new Array()/}
			  // passing param and printing string
			  ${payLaterInfoArray.push(dateStr)|eat}
			  ${payLaterInfoArray.push(dateTime)|eat}
			  ${payLaterInfoArray.push(rqstParams.payLaterBean.pendingTimeLimit)|eat}
			  {var plLabel1 = labels.tx_merci_text_paylater_fare_page/}
			  {var payLaterInformation = new this.__strBuffer(plLabel1)/}
			  {set plLabel1 = payLaterInformation.formatString(payLaterInfoArray)/}
               ${messages.push({TEXT:plLabel1})|eat}
                  {call message.showInfo({list: messages, title: labels.tx_merci_warning_text})/}
           {/if}

          {if (siteParams.siteOBFees == 'TRUE' && siteParams.siteCCFees == 'TRUE')}
              {var messages = new Array()/}
                ${messages.push({TEXT:labels.tx_merci_additionalCCFee})}
                  {call message.showInfo({list: messages, title: labels.tx_merci_warning_text})/}
           {/if}

          {if !this.__merciFunc.isEmptyObject(rqstParams.listItineraryBean) && !this.__merciFunc.isEmptyObject(rqstParams.listItineraryBean.itineraries)}

             {if (siteParams.siteOBFees == 'TRUE' && siteParams.siteCCFees == 'TRUE')}
                    {var messages = new Array()/}
                      ${messages.push({TEXT:labels.tx_merci_additionalCCFee})|eat}
                        {call message.showInfo({list: messages, title: labels.tx_merci_warning_text})/}
                  {/if}

            {if siteParams.siteFpProposeUpsell != null && siteParams.siteFpProposeUpsell.toLowerCase() == 'true' && !this.__merciFunc.isEmptyObject(rqstParams.param.upSellSubmitted) && rqstParams.param.upSellSubmitted == true}
              {call message.showInfo({list: [{TEXT: labels.tx_pltg_text_UpsellUpgradeSuccess}], title: labels.tx_merci_warning_text})/}
            {/if}

             {if this._isRebookingFlow()}
              {@html:Template {
                classpath: "modules.view.merci.segments.servicing.templates.rebook.MPreviousItinerary",
                block: true,
                data: {
                'labels': labels,
                'rqstParams': rqstParams,
                'config': siteParams,
                'globalList': globalList,
                'fromPage':'fare',
                 'currCode':this.currCode,
                 'exchRate':this.exchRate
              }
              }/}
             {/if}


            {@html:Template {
              classpath: "modules.view.merci.segments.booking.templates.farereview.MConfConn",
              data: {
                'labels': labels,
                'rqstParams': rqstParams,
                'siteParams': siteParams,
                'globalList': globalList
              }
            }/}

			{@html:Template {
			  classpath: "modules.view.merci.segments.booking.templates.farereview.MPriceBreakdown",
			  data: {
				'labels': labels,
				'rqstParams': rqstParams,
				'siteParams': siteParams,
				'fromPage':'fare',
				'currCode':this.currCode,
				'exchRate':this.exchRate
			  }
			}/}

            {var miles = 0/}
            {if !this.__merciFunc.isEmptyObject(rqstParams.prefAirFreqMiles) && !this.__merciFunc.isEmptyObject(rqstParams.fareBreakdown.tripPrices) && rqstParams.fareBreakdown.tripPrices.length > 0}
              {set miles = parseInt(rqstParams.prefAirFreqMiles) - parseInt(rqstParams.fareBreakdown.tripPrices[0].milesCost)/}
            {/if}

            {if !this.__merciFunc.isEmptyObject(rqstParams.DWM_FOOTER_CONTENT)}
                  {@html:Template {
                      classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                      data: {
                        placeholder: rqstParams.DWM_FOOTER_CONTENT,
                        placeholderType: "dwmFooter"
                      }
                  }/}
          {/if}

            {if isAwardsFlow == true && miles < 0}
              <div class="msg info">
                <ul>
                  <li>
                    ${labels.tx_merci_awards_insufficient_miles1} <strong>${labels.tx_merci_awards_insufficient_miles2} ${(-1)* miles} ${labels.tx_merci_awards_insufficient_miles3}</strong> ${labels.tx_merci_awards_go_online}
                  </li>
                </ul>
              </div>
              <nav class="buttons">
                <ul>
                  {if siteParams.siteAllowRedeemSearch != null && siteParams.siteAllowRedeemSearch.toLowerCase() == 'true'}
                    <li><a class="navigation" href="javascript:void(0);" {on click {fn: 'callAwardsApi', args: {redemption: true}}/}>${labels.tx_merci_awards_another_redemption}</a></li>
                  {/if}
                  {if siteParams.siteAllowCmclSearch != null && siteParams.siteAllowCmclSearch.toLowerCase() == 'true'}
                    <li><a class="navigation" href="javascript:void(0);"  {on click {fn: 'callAwardsApi', args: {redemption: false}}/}>${labels.tx_merci_awards_search}</a></li>
                  {/if}
                </ul>
              </nav>
            {else/}
              <footer class="buttons footer">
                {if this._checkError()}
                  <button type="button"  class="validation disabled">${labels.tx_merci_text_booking_continue}</button>
                {else/}
	                {if isNewSearch == 'TRUE'}
	                    <button class="validation newsearch" type="button" {on click {fn:'restartBooking',args:searchURL}/}>${labels.tx_merci_text_booking_new_search}</button>
	                {/if}
	                {if this.__merciFunc.booleanValue(siteParams.siteMandatoryLogin)== false}
	                  {if this.__merciFunc.booleanValue(siteParams.enableProfile) == true && this.__merciFunc.booleanValue(siteParams.siteLateLogin)}
	                    <button class="validation" type="button" id="logInContinue" {on click {fn : 'logInProfile'} /}>${labels.tx_merci_dl_loginContinue}</button>
	                  {/if}
	                  <button class="validation">${labels.tx_merci_text_booking_continue}</button>
	                {else/}
	                  {if this.__merciFunc.booleanValue(rqstParams.reply.IS_USER_LOGGED_IN) == true }
	                    <button class="validation">${labels.tx_merci_text_booking_continue}</button>
	                 {else/}
	                    <button class="validation" type="button" id="logInContinue" {on click {fn : 'logInProfile'} /}>${labels.tx_merci_dl_loginContinue}</button>
	                  {/if}
	                 {/if}
	              {/if}
                <button class="validation back" type="button" {on click {fn:'goBack', scope: this.moduleCtrl}/}>${labels.tx_merci_text_back}</button>
              </footer>
            {/if}

            // HIDDEN VARIABLES FOR FORM SUBMISSION [START] */
            <input type="hidden" name="result" value="json" />
            <input type="hidden" name="CABIN" value="${rqstParams.reply.cabin}" />
            <input type="hidden" name="FROM_PAX" value="FALSE" />
            <input type="hidden" name="IS_SPEED_BOOK" value="${rqstParams.param.IS_SPEED_BOOK}" />
            {if rqstParams.param.IS_SPEED_BOOK == "TRUE"}
            <input type="hidden" name="HIDEALPI" value="TRUE" />
            <input type="hidden" name="IS_SPEED_BOOK1" value="TRUE" />
            {/if}
            <input type="hidden" name="IS_WEBFARES" value="" />
            <input type="hidden" name="PAGE_TICKET" value="${rqstParams.reply.pageTicket}" />
            <input type="hidden" name="TYPE" value="AIR_TRIP_FARE" />
            <input type="hidden" name="RESTRICTION" value="${rqstParams.reply.restriction}" />
            <input type="hidden" name="COMMERCIAL_FARE_FAMILY_1" value="${rqstParams.commercialFareFamily}" />
            {if rqstParams.param.upsellOutLow != null}<input type="hidden" name="upsellOutLow" value="${rqstParams.param.upsellOutLow}" />{/if}
            {if rqstParams.param.upsellInLow != null}<input type="hidden" name="upsellInLow" value="${rqstParams.param.upsellInLow}" />{/if}
            {if rqstParams.param.FLOW_TYPE != null && rqstParams.param.IS_SPEED_BOOK != "TRUE"}<input type="hidden" name="FLOW_TYPE" value="${rqstParams.param.FLOW_TYPE}" />{/if}


            {if rqstParams.param.TRIP_TYPE != null}<input type="hidden"  name="TRIP_TYPE"  value="${rqstParams.param.TRIP_TYPE}"/>{/if}
            {if rqstParams.param.PRICING_TYPE != null}<input type="hidden"  name="PRICING_TYPE"  value="${rqstParams.param.PRICING_TYPE}"/>{/if}
            // HIDDEN VARIABLES FOR FORM SUBMISSION [ END ] */
          {/if}
        </form>

        {if (siteParams.siteAllowRedeemSearch != null && siteParams.siteAllowRedeemSearch.toLowerCase() == 'true') || (siteParams.siteAllowCmclSearch != null && siteParams.siteAllowCmclSearch.toLowerCase() == 'true')}
          <form {id "redemptionSearch"/} method="POST">
            {foreach redeem in rqstParams.param}
              {if redeem_index != 'result'}
                <input type="hidden" name="${redeem_index}" value="${redeem}"/>
              {/if}
            {/foreach}
            <input type="hidden" name="ENABLE_DIRECT_LOGIN" value="YES"/>
            <input type="hidden" name="KF_REDEEM" value="false"/>
            <input type="hidden" name="IS_BOOKMARK_FLOW" value="false" {id "IS_BOOKMARK_FLOW"/}/>
          </form>
        {/if}
      </section>
    </div>
  {/macro}

  {macro includeError(labels)}
    {section {
      id: 'errors',
      macro: {name: 'includeErrorDetails', args:[labels], scope: this},
      bindRefreshTo : [{
        inside : this.data,
        to : "errorOccured",
        recursive : true
      }],
    }/}
  {/macro}

  {macro includeErrorDetails(labels)}
    {if this.data.errors != null && this.data.errors.length > 0}
      {var errorTitle = ''/}
      /*{if labels != null && labels.tx_merci_text_error_message != null}
        {set errorTitle = labels.tx_merci_text_error_message/}
      {/if}*/
      {call message.showError({list: this.data.errors, title: errorTitle})/}

      // resetting binding flag
      ${this.data.errorOccured = false|eat}
    {/if}
  {/macro}

  {macro displayCEMBanner(dwmContent)}
    {var dwmPageContent = dwmContent.value || {} /}
    {if !this.__merciFunc.isEmptyObject(dwmPageContent)}
		<div {id 'cem_wrapper'/}>
			${dwmPageContent}
		</div>
    {/if}
  {/macro}

{/Template}