{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurc',
	$macrolibs: {
    		common: 'modules.view.merci.common.utils.MerciCommonLib',
    		message: 'modules.view.merci.common.utils.MerciMsgLib',
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary',
    		billingDetails: 'modules.view.merci.common.utils.MBillingDetails'
  	},
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.StringBufferImpl'
	],
	$hasScript: true
}}

	{var purcPageLoaded = false/}

	{macro main()}

		{var currDate = new Date()/}
		{var tripPrices = this.__getTripPrice()/}
		{var ccInfo = this._getCreditCardInfo()/}
		{var currencies = this.__getCurrencies()/}
		{var isAwardsFlow = this._isAwardsFlow()/}
		{var bRebooking = this._isRebookingFlow()/}
		{var fractionDigits = this._getFractionDigits()/}
    	{var isServicingFlow = this.isFromServicingFlow() /}

		<section>
			<form id='purcForm' {on submit {fn:'onPurcFormSubmit', args: {action: 'MPurchaseValidate.action'}}/}>
				// parameter to be passed on form submit [START] */
				<input type="hidden" name="FROM_PAGE" value = "{if !this.utils.isEmptyObject(this.data.rqstParams.fromPage)}${this.data.rqstParams.fromPage}{/if}"></input>

				{if bRebooking == true}
					<input type="hidden" name="page" value = "ATC 5-Purchase"></input>
					<input type="hidden" name="bRebooking" value = "${bRebooking}"></input>
					{if isAwardsFlow == true}
						<input type="hidden" name="REBOOK_MILES_DIFFERENCE" value = "${this.data.rqstParams.param.REBOOK_MILES_DIFFERENCE}"></input>
					{/if}
				{else/}
					{if this.data.rqstParams.fromPage != 'SERVICE'}
						<input type="hidden" name="page" value = "6-Purchase"></input>
					{else/}
						<input type="hidden" name="page" value = "Ser 1b-Purc Baggage"></input>
					{/if}
				{/if}
				// parameter to be passed on form submit [START] */
				{if this._getSiteBoolean('siteEnblREDFraudDet')}
					<input type="hidden" name="FINGER_PRINT_BD" id="FINGER_PRINT_BD">
				{/if}
      				<span id="speedId1">

				{call common.showBreadcrumbs(5)/}
				{if !this.utils.isEmptyObject(this.data.rqstParams.DWM_HEADER_CONTENT)}
			          {@html:Template {
				            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
				            data: {
				            	placeholder: this.data.rqstParams.DWM_HEADER_CONTENT,
				            	placeholderType: "dwmHeader"
				            }
			          }/}
				{/if}
				// show information related to back button press
				{if this._getSiteBoolean('siteDispBackWarning') && (this.utils.isEmptyObject(this.data.rqstParams.merciDeviceBean.client) || this.data.rqstParams.merciDeviceBean.client == '')}
					{var messages = new Array()/}
					${messages.push({TEXT:this.data.labels.tx_merci_text_booking_back_message})|eat}
					{if bRebooking == true && tripPrices[0].rebookBalanceTotalAmount < 0 && this._getSiteBoolean('siteRbkDispRefundMsg')}
						${messages.push({TEXT:this.data.labels.tx_merci_atc_rbk_ref_amt})|eat}
					{/if}

					// show warning message for back button
						{call message.showInfo({list: messages, title: this.data.labels.tx_merci_warning_text})/}
				{/if}
				// CR 07131094: RJ currency conversion at payment on Mobile - start
				{if this._getSiteBoolean('siteAllowAPC') && currencies[1]!= undefined}
					<div class="msg info">
					{var chargeCurrCode = new modules.view.merci.common.utils.StringBufferImpl(this.data.labels.tx_merci_pattern_chargetheUserCurrencyCode)/}
					{var chargeConvRate = new modules.view.merci.common.utils.StringBufferImpl(this.data.labels.tx_merci_pattern_chargetheUserConversionRate)/}
					<ul>
						<li>
							${chargeCurrCode.formatString([currencies[1].code])}<br>
							${chargeConvRate.formatString([this.data.rqstParams.fareBreakdown.targetCurrencyExchangeRate])} <br>
							${this.data.labels.tx_merci_text_chargetheUserContactAgency}
						</li>
					</ul>
					</div>
				{/if}
				 // CR 07131094: RJ currency conversion at payment on Mobile - End
				// include error tpl
				{call includeError()/}
				{call includeWarning()/}

				<div class="tabletleftPanel tabletMargin">

					{if !this._isRebookingFlow()}
				{@embed:Placeholder {
					name: "tripOverview"
				}/}
					{else/}
				// CR 5519515 ATC Re-Booking [START] */
					{if this._getSiteBoolean('siteAtcOrigItin')}
						{section {
              						id: "prevItinerary",
              						macro: {name: 'mPurcPrevItinerary', args: [this.currCode,this.exchRate]}
          			 			 }/}
					{/if}

						{call selectedNewItin()/}
				// CR 5519515 ATC Re-Booking [ END ] */
					{/if}
				</div>
       </span>

				<div class="tabletrightPanel{if !this._isRebookingFlow()} bookPanel tabletMargin{/if}">
     <span id="speedId2">

				{var insData = {amount: this.data.rqstParams.param.insAmt} /}
				{if !isServicingFlow && this._getSiteBoolean('siteInsuranceEnabled') && bRebooking == false}
					{@html:Template {
						classpath: "modules.view.merci.segments.booking.templates.purc.MPurcIns",
						data: {
							'labels': this.data.labels,
							'rqstParams': this.data.rqstParams,
							'siteParams': this.data.siteParams,
							'globalList': this.data.globalList,
							'isFromServicingFlow': isServicingFlow,
              'finalAmount': finalAmount,
              'insData': insData
						}
					}/}
				{/if}

				<article class="panel price {if isAwardsFlow == true}static{/if}">
					<section>
						{if this.__allowPromo()}

							// get begin and end date
							{var dates = this.__getPromoDates()/}

							<p {id "promo"/}>
								<label>${this.data.labels.tx_merci_text_book_promo_code}</label>
								<input class="promotion" {id "PROMOTION_CODE"/} type="text" placeholder="Promotion code" autocorrect="off" autocomplete="off">

								<button {on tap {fn: 'applyPromoCode', args: {url: 'MValidation.action', noOfPax: this.__getPaxCount(), totalAmount: this.__getTotalPrice(), maxError: this.data.siteParams.siteMaxErrorPromoCode, bDate: dates.beginDate, eDate: dates.endDate}}/}
									type="button" role="button" class="secondary promocode" aria-controls="promo1 promoh2" aria-expanded="false" {id "btnPromo"/}>
									${this.data.labels.tx_merci_text_book_promo_check}
								</button>
							</p>
							<p {id "promo1"/} class="hidden">${this.data.labels.tx_merci_text_book_promo_desc1} <strong {id "promoDiscount"/}>&nbsp;</strong> ${this.data.labels.tx_merci_text_book_promo_desc2}</p>
							<h1 {id "hTtlPrice"/} class="hidden"><span class="label">${this.data.labels.tx_merci_atc_total_price}</span> <span class="data price total" {id "promoTtlPrice"/}>&nbsp;</span></h1>
						{/if}

						{var insuranceAmount = 0/}
						{if !this.utils.isEmptyObject(this.data.rqstParams.requestBean.INS_AMT)}
							{set insuranceAmount = this.data.rqstParams.requestBean.INS_AMT/}
							<input type="hidden" name="COPY_MOP_FOR_INS" value="TRUE" />
						{/if}
						{if isServicingFlow}
							{var insuranceProduct = this.data.rqstParams.requestBean.insuranceProductdetails/}
							<input type="hidden" name="INS_AMT" id="INS_AMT" value="${insuranceAmount}" />
							<input type="hidden" name="insuranceProductdetails" value="${insuranceProduct}" id="insuranceProductdetails" />
						{/if}						
						{var finalAmount = this.getFinalAmount()/}
						<input type="hidden" name="FARE_AMT" value="${finalAmount}" id="FARE_AMT" />
						<input type="hidden" name="FARE_CODE" value="${currencies[0].code}" id="FARE_CODE"/>
						<input type="hidden" name="FRACTION_DIGITS" value="${fractionDigits}" />
						<input type="hidden" name="CLIENT_EXIST" value="true" id="CLIENT_EXIST"/>
						<input type="hidden" name="INSURANCE_SELECTED" value="{if !this.utils.isEmptyObject(this.data.rqstParams.requestBean.INS_AMT)}true{else/}false{/if}" id="INSURANCE_SELECTED"/>
						<input type="hidden" name="INSURANCE_AMOUNT" id="INSURANCE_AMOUNT" value="${insuranceAmount}" />

						// formatting number
						{set finalAmount = this.utils.printCurrency(finalAmount, fractionDigits)/}
						{if this._getSiteBoolean('siteAllowAPC')
							&& this.data.rqstParams.fareBreakdown.tripPrices != null
							&& this.data.rqstParams.fareBreakdown.tripPrices.length > 1}
							{set covertedCurrencyfinalAmount = this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[1].apcTotalAmount, fractionDigits) /}
						{/if}
						{var payLaterElig = this.__getPayLaterEligibility()/}
						{section {
              						id: "purcCostDisp",
							macro: {name: 'purcTotalCostDisp', args: [isAwardsFlow,tripPrices,currencies,finalAmount,this.currCode,this.exchRate,fractionDigits,bRebooking,payLaterElig]}
              					}/}
					</section>

					{if this._getSiteBoolean('siteShowFBLinkReview')}
						<footer>
							<a href="javascript:void(0)" class="{if isAwardsFlow == true}view-cost-details{else/}view-price-details{/if}" {on tap {fn:'openPriceDetails'}/}>
								{if isAwardsFlow == true}
									${this.data.labels.tx_merci_awards_view_cost}
								{else/}
									${this.data.labels.tx_merci_text_booking_fare_view_price_details}
								{/if}
							</a>
						</footer>
					{/if}
				</article>
						<span class="hidden">
							${this.bRebookingNew = bRebooking}
							${this.finalAmountNew = finalAmount}
							${this.insDataNew = insData}
							${this.payLaterEligNew = payLaterElig}
						</span>
        				<div class="popup cost" id="pricePopup" style="display: none;">
        					{section {
             						id: "purcBrkdwn",
						macro: {name: 'purcFareBrkdwn', args: [bRebooking,finalAmount,insData,this.currCode,this.exchRate,payLaterElig]}
					}/}
				</div>

				{if this._getSiteBoolean('siteShowItinRecapOnPurc') && bRebooking == false}
					<div>
						{@html:Template {
							classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiItineraryRecap",
							data: {
								labels : this.data.labels,
								rqstParams : this.data.rqstParams
							}
						} /}
					</div>
				{/if}

					{if this._isRebookingFlow()}
						{if this._getSiteBoolean('siteRbkDispContactInfo')}

							{if this._getSiteBoolean('siteNewContactInfo')}
								<article class="panel contact marginLeftZero marginRightZero">
									{@html:Template {
										classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtended",
										data: {
											'labels': this.data.labels,
											'rqstParams': this.data.rqstParams,
											'siteParameters': this.data.siteParams,
											'gblLists': {
												countryList: this.data.globalList.slLangCountryList,
												slCountryCallingCodes: this.data.globalList.slCountryCallingCodes
											},
											'htmlBean' : this.data.rqstParams.htmlBean,
											'isRebooking':'true'
										}
									}/}
									</article>
								{else/}
								<article class="panel contact marginLeftZero marginRightZero">
									{@html:Template {
										classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfo",
										data: {
											'labels': this.data.labels,
											'rqstParams': this.data.rqstParams,
											'siteParameters': this.data.siteParams,
											'gblLists': this.data.globalList,
											'isRebooking':'true'
										}
									}/}
								</article>
							{/if}
						{/if}
					{/if}

				//CR 07131094: RJ currency conversion at payment on Mobile - start
				{if this._getSiteBoolean('siteAllowAPC') && currencies[1] != null}
			 		<div class="popup CheckTermsLink" id="checkTermsPopUp" style="display: none;">
						<div id="htmlPopupPurc"> <h1 class="boundsTitle">${this.data.labels.tx_merci_text_chargeInConvertedCurrencyTermsLnk}</h1> </div>
						<div>
					 		<dl style="margin:0px;">
								<dt style="padding:1em;"> ${chargeCurrCode.formatString([currencies[1].code])}<br>
									${chargeConvRate.formatString([this.data.rqstParams.fareBreakdown.targetCurrencyExchangeRate])} <br>
									${this.data.labels.tx_merci_text_chargetheUserContactAgency}
								</dt>
							</dl>
							<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
						</div>
					</div>
				{/if}
				//CR 07131094: RJ currency conversion at payment on Mobile - end
				//============================ Pay Later/Time To Think Starts ============================
				//&& this.data.rqstParams.payLaterBean.onHoldEligible + this.data.siteParams.siteAllowPayLater == 'TRUE'
				{if (!isServicingFlow)}
					{var payLaterElig = this.__getPayLaterEligibility()/}
					{if (payLaterElig.ispayLaterEnbl == 'TRUE' || payLaterElig.timeToThinkEnbl == 'TRUE')}
					{section {
						id: "PLater",
						macro: {name: 'payLater', args:[payLaterElig.ispayLaterEnbl, payLaterElig.timeToThinkEnbl,fractionDigits]},
						bindRefreshTo : [{
							inside : this.moduleCtrl,
							to : "payLater",
							recursive : true
						}],
					}/}
					{/if}
				{/if}
				//============================ Pay Later/Time To Think ends ===============================

				<div id ="ccwarn">
				{if this._getSiteBoolean('siteShowTPartyMsg') && (bRebooking == false || tripPrices[0].rebookBalanceTotalAmount > 0)}
					{call message.showInfo({list: [{TEXT:this.data.labels.tx_merci_text_purc_cc_reminder}], title: this.data.labels.tx_merci_warning_text})/}
				{/if}
				</div>

				{if this._getSiteBoolean('siteUseEtktDoc') && !this._getSiteBoolean('siteUseCCAsDocument')}
					{@html:Template {
						classpath: "modules.view.merci.segments.booking.templates.purc.MODETicket",
						data: {
							'labels': this.data.labels,
							'gblLst': this.data.globalList,
							'rqstParams': this.data.rqstParams,
							'siteParams': this.data.siteParams
						}
					}/}
				{/if}

				{var hideArticle = false/}
				{var hideCC = false/}
				{if this.data.siteParams.siteCCPsp != null && this.data.siteParams.siteCCPsp.toLowerCase() == 'html'}
					{var showExtPayment = this.__showExtPaymentRadio()/}
					{var showDeferredPayment = this.__showDeferredRadio()/}
					{var showCCPayment = this.__showCCPaymentRadio()/}
					{var multipleMop = this.data.rqstParams.purchaseInformationConfig.multipleMop/}
					<article class="panel {if !showDeferredPayment && !showCCPayment && (!showExtPayment || !multipleMop)}hidden{/if}">
						{if showCCPayment}
							<header>
								<h1>${this.data.labels.tx_merci_text_booking_purc_card_type}</h1>
							</header>
						{/if}
						{section {
							id: "extPayMethods",
							macro: {name: 'extPayMethods', args:[showExtPayment, showDeferredPayment, showCCPayment, multipleMop]}
							}/}
						{if this.utils.isEmptyObject(this.data.rqstParams.validationErrorFields)}
							{set hideArticle = true/}
						{/if}
					</article>
				{/if}

			{if !this.utils.isEmptyObject(this.data.rqstParams.param.SPEEDBOOK) && this.data.rqstParams.param.SPEEDBOOK == "TRUE" && this.data.siteParams.siteEnableSpeedBook == "TRUE"}
        <article class="pax  panel" id="primaryTraveller">
          <header id="paxHeader">
									<h1>
										${this.data.labels.tx_merci_text_booking_alpi_passengersinformation}
              <button type="button" class="icon-edit" {on tap {fn: '_navigateToAlpi',args: {pgTkt: this.data.rqstParams.reply.pageTicket}}/}></button>
            </h1>
          </header>
          <section>
									<p>
										<strong>
											{if !this.utils.isEmptyObject(this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.titleName)}
                        ${this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.titleName}.
                       {/if} ${this.data.rqstParams.listTravellerBean.primaryTraveller.fullName}
               </strong>
            </p>
            <p>
              {if this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.mobilePhone!=""}
                 ${this.data.labels.tx_merci_text_booking_alpi_mobile}:<span>&nbsp;${this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.mobilePhone}</span>
               {elseif this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.homePhone!="" /}
                 ${this.data.labels.tx_merci_text_booking_homephone}:<span>&nbsp;${this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.homePhone}</span>
               {elseif this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.businessPhone!="" /}
                 ${this.data.labels.tx_merci_text_booking_apis_businessphone}:<span>&nbsp;${this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.businessPhone}</span>
              {/if}
            </p>
            <p>${this.data.labels.tx_merci_text_booking_email}:<span>&nbsp;${this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.email1}</span></p>
          </section>
         </article>
         <article id="paymentInfo" class="panel payment {if hideArticle == true}hidden{/if}">
          <header id="payHeader">
									<h1>
										${this.data.labels.tx_merci_text_booking_extpay_txt_payment_information}
             <button type="button" class="icon-edit"  {on tap {fn: '_dispPayment'}/}></button>
            </h1>
          </header>
          <section id="ccSection">
            <p><strong>${this.data.labels.CC}</strong></p>
            <ul class="paymentInfoSB">
              <li><span id="cardType"> </span>&nbsp;<span id="visa"> </span></li>
              <li>${this.data.labels.tx_merci_text_addbag_expiry} <span id="expDate"></span></li>
              <li>
                <label id="lblCCDigitAir2" for="CC_DIGIT_CODE_AIR_2" class="cvv">${this.data.labels.tx_merci_text_booking_purc_creditcardcvv}<span class="mandatory">*</span></label>
                <input id="CC_DIGIT_CODE_AIR_2" name="CC_DIGIT_CODE_AIR_2" type="tel" autocomplete="off" autocorrect="off" value="" size="5" maxlength="4" class="securitymask" {on blur {fn:'cloneCVV'}/}>
              </li>
            </ul>
            <p><strong>${this.data.labels.tx_merci_text_booking_purc_creditcardbill}:</strong></p>
            <p id="billingAdd"></p>
          </section>
         </article>
         {set hideCC = true/}
       {/if}
      </span>
					
      <span id="speedCCControls" class="{if hideCC == true}hidden{/if}">
				<article id="cccontrols" class="panel payment {if (bRebooking == true && tripPrices[0].rebookBalanceTotalAmount <= 0) || hideArticle == true}hidden{/if}">
					<header>
						<h1>${this.data.labels.tx_merci_text_booking_extpay_txt_payment_information} <button type="button" class="toggle" aria-expanded="true" id ="paymentSection" {on tap {fn:'toggle', scope: this, args : {ID1 : 'paymentSection'} }/}><span>Toggle</span></button></h1>
						{if !this.utils.isEmptyObject(this.data.siteParams.siteAllowMasterPass) && this.data.siteParams.siteAllowMasterPass.toLowerCase() == 'true'}
									<p><button id="mp1" class="masterpass" {on click {fn:onMasterPassClick,args : {action: "MasterPassDispatcher.action"}}/} type="button"><span>Buy with MasterPass</span></button></p>
						{/if}
					</header>

					<section id="section_paymentSection">
						<p><span class="mandatory">*</span> <small>${this.data.labels.tx_merci_text_booking_alpi_indicates}</small></p>
						/*Code added as a part of CR 5533028- SADAD Implemenatation for MeRCI- START */

						{if this._getSiteBoolean('siteEnableMiscFOP')}
							{var fopList = this.data.siteParams.siteListMiscFOP /}
							{var fopListArr = fopList.split(',')/}
								<p class="card">
									<label for="paymethod">${this.data.labels.tx_merci_text_select_mop}<span class="mandatory">*</span></label>
									<select id="paymethod" name="paymethod" {on change {fn: '_onPayTypeSelection', scope: this}/}>
									<option disabled selected>Please select</option>
									{foreach item in fopListArr}
										<option value="${item}" {if localStorage.getItem('selectedPayMethod') != null && localStorage.getItem('selectedPayMethod') == item}selected=selected{/if}>${this.data.labels[item]}</option>
									{/foreach}
									{if this._getSiteBoolean('enblAMOP') && this.data.amops}
										{foreach item in this.data.amops}
											<option value="AMOP_${item_index}" {if localStorage.getItem('selectedPayMethod') != null && localStorage.getItem('selectedPayMethod') == item}selected=selected{/if}>${item}</option>
										{/foreach}
									{/if}
								</select>
							</p>
						{/if}
								
						{section {
							id: 'paymentType',
									macro: {name: 'showPaymentTypeDetails', args:[ccInfo, currDate, tripPrices, currencies,bRebooking], scope: this},
							bindRefreshTo : [{
								inside : this.data,
								to : "isFop"
								}]
						}/}

					/*Code added as a part of CR 5533028- SADAD Implemenatation for MeRCI- END */

					{var check_cpf = false/}
					{if this._getSiteBoolean('siteEnableCollectCPF') && this._getSiteBoolean('sitePayUseTFOPCG')}
						{var check_cpf = true/}
						{@html:Template {
							classpath: 'modules.view.merci.segments.booking.templates.purc.MSocialSecurityCard',
							data: {
								'labels': this.data.labels,
								'siteParams': this.data.siteParams,
								'rqstParams': this.data.rqstParams,
								'globalList': this.data.globalList
							}
						}/}
					{/if}

						<input type="hidden" value="${check_cpf}" name="checkCPF"/>
						{if this.data.rqstParams.param.TRIP_TYPE != null}
							<input type="hidden" name="TRIP_TYPE" value="${this.data.rqstParams.param.TRIP_TYPE}" />
						{/if}
					</section>
				</article>
       </span>

       <span id="speedId3">
				<ul class="buttons">
					{if this._getSiteBoolean('siteShowPurchaseLinks')}
						<li><a class="navigation" href="javascript:void(0)" {on tap {fn:'openFareCondition',args: {pgTkt: this.data.rqstParams.reply.pageTicket, recLoc : this.data.rqstParams.recLoc}}/}>${this.data.labels.tx_merci_text_booking_fare_fare_conditions}</a></li>
						<div class="popup facs" style="display: none;">
							{@html:Template {
								classpath: "modules.view.merci.segments.booking.templates.farereview.MFareCondition",
								data: {
									'labels': this.data.labels,
									'siteParams': this.data.siteParams,
									'rqstParams': this.data.rqstParams
								}
							}/}
						</div>
					{/if}
					{if !this._getSiteBoolean('siteHideFareCondition')}
						{var bookingCondLink = modules.view.merci.common.utils.URLManager.getModuleName(false) + '/' + this.data.base[5] + '/static/html/client/BOOKINGCOND_' + this.data.base[12] + '_' + this.data.rqstParams.merciDeviceBean.profile + '.html'/}
						<li><a class="navigation" href="javascript:void(0);" {on tap {fn: 'openHTML',args: {link: bookingCondLink}}/}>${this.data.labels.tx_merci_text_purc_booking_conditions}</a></li>
					{/if}
				</ul>

						<footer>
				{var enablePurcSliders = this.utils.booleanValue(this.data.siteParams.siteEnablePurcSliders)/}
					<p>
						{if enablePurcSliders}
							<label class="switch">
	                      		<input class="switch-input" id="CheckPenaliesBox" name="CheckPenaliesBox" type="checkbox" {on click {fn: 'toggleConfirm'}/}>
	                      		<span class="switch-label" data-on="No" data-off="Yes"></span> <span class="switch-handle"></span>
	                      	</label>
	                    {else/}
						<input id="CheckPenaliesBox" name="CheckPenaliesBox" type="checkbox" {on click {fn: 'toggleConfirm'}/}>
						{/if}
						<label {if enablePurcSliders}for="CheckPenaliesBoxSlider"{else/}for="CheckPenaliesBox"{/if}>${this.data.labels.tx_merci_text_booking_purc_rules_text}
						{if (this.data.siteParams.dispPrivacy == 'TRUE')}
						  {var privacyLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('MPRIVACY_{0}_' +  this.data.rqstParams.merciDeviceBean.profile + '.html','html')/}
						  and the <a href="https://www.singaporeair.com/jsp/cms/en_UK/global_footer/privacy-policy.jsp" target="_blank">${this.data.labels.tx_merci_text_privacy}</a>
						{/if}
						</label>
					</p>
					//CR 07131094: RJ currency conversion at payment on Mobile - start
					  {if this._getSiteBoolean('siteAllowAPC')}
						<p>
							{if enablePurcSliders}
								<label class="switch">
		                      		<input class="switch-input" id="CheckTermsLink" name="CheckTermsLink" type="checkbox"  {on click {fn: 'toggleConfirm'}/}>
		                      		<span class="switch-label" data-on="No" data-off="Yes"></span> <span class="switch-handle"></span>
		                      	</label>
							{else/}
							<input id="CheckTermsLink" name="CheckTermsLink" type="checkbox"  {on click {fn: 'toggleConfirm'}/}>
							{/if}
							 <label {if enablePurcSliders}for="CheckTermsLinkSlider"{else/}for="CheckTermsLink"{/if}>${this.data.labels.tx_merci_text_chargeInConvertedCurrency}
							<a href="javascript:void(0);" {on click {fn: 'openTermsLink'}/}>${this.data.labels.tx_merci_text_chargeInConvertedCurrencyTermsLnk}</a></label>
						</p>
					   {/if}

					  //CR 07131094: RJ currency conversion at payment on Mobile - end
					{var sitePromptFee = 'N'/}
					{if this._getSiteBoolean('sitePromptFee')}
						{set sitePromptFee = 'Y'/}
						{if enablePurcSliders}
							<label class="switch">
	                      		<input class="switch-input" id="PromptFee" name="PromptFee" type="checkbox" {on click {fn: 'toggleConfirm'}/} >
	                      		<span class="switch-label" data-on="No" data-off="Yes"></span> <span class="switch-handle"></span>
	                      	</label>
						{else/}
						<input id="PromptFee" name="PromptFee" type="checkbox" {on click {fn: 'toggleConfirm'}/} >
						{/if}
						<label for="PromptFee">${this.data.labels.tx_merci_text_booking_purc_iacceptservice}</label>
					{/if}
					<input type="hidden" name="checkPromptFee" value="${sitePromptFee}" />

					 // CR6084550 : adding US federal law notice : start*/
					{if this.data.siteParams.siteDispUSRegulation != null && this.data.siteParams.siteDispUSRegulation.toLowerCase() == 'true'}
						{if this.data.rqstParams.listItineraryBean != null && this.data.rqstParams.listItineraryBean.itineraries != null}
									{if this.__isUSRoute(this.data.rqstParams.listItineraryBean.itineraries) || this.utils.booleanValue(this.data.siteParams.siteDispUSRegulationforAll)}
								{var usRegulationLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('US_FEDERAL_LAW_{0}_' + this.data.rqstParams.merciDeviceBean.profile + '.html','html')/}
                							<p>
                								{if enablePurcSliders}
													<label class="switch">
													<input class="switch-input" id="usRegulation" name="usRegulation" type="checkbox" {on click {fn: 'toggleConfirm'}/} >
							                      		<span class="switch-label" data-on="No" data-off="Yes"></span> <span class="switch-handle"></span>
							                      	</label>
												{else/}
												<input id="usRegulation" name="usRegulation" type="checkbox" {on click {fn: 'toggleConfirm'}/} >
												{/if}
												<a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: usRegulationLink}}/}>${this.data.labels.tx_merci_text_us_federal_law_notice}</a>
                							</p>
              						{/if}
           					 	{/if}
         					{/if}
        					// CR6084550 : adding US federal law notice : end*/
				</footer>

				{var confirmLabel = this.data.labels.tx_merci_text_booking_purc_confirm_purchase/}
				{if bRebooking == true}
					{set confirmLabel = this.data.labels.tx_merci_atc_new_trip/}
				{/if}

				{if !this.utils.isEmptyObject(this.data.rqstParams.DWM_FOOTER_CONTENT)}
			          {@html:Template {
				            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
				            data: {
				            	placeholder: this.data.rqstParams.DWM_FOOTER_CONTENT,
				            	placeholderType: "dwmFooter"
				            }
			          }/}
				{/if}

				<input type="hidden" name="continue" value="${confirmLabel}" />
						<footer class="buttons footer">
					<button type="submit"  class="validation disabled" id="btnConfirm">${confirmLabel}</button>
					<button type="button" class="validation cancel" {on tap {fn: 'showCancelBox'}/}>${this.data.labels.tx_merci_text_booking_cancel}</button>
				</footer>
			 </span>

			 <footer  id="speedId4" class="buttons hidden">
        <button type="button" class="validation" id="" {on tap {fn: '_revokeDispPayment',args: {save: 'true'}}/}>${this.data.labels.tx_merciapps_lbl_save}</button>
        <button type="button" class="validation cancel" {on tap {fn: '_revokeDispPayment',args: {save: 'false'}}/}>${this.data.labels.tx_merci_text_booking_cancel}</button>
       </footer>
				</div>

				{var actionVal = 'BOOK'/}
				{if !bRebooking}
				  {if this.isFromServicingFlow()}
				    {set actionVal = 'MODIFY'/}
				  {else/}
					  <input type="hidden" name="TYPE" value="booking" />
					{/if}
				{else/}
					{set actionVal = 'REBOOK'/}
					<input type="hidden" name="REBOOK_AMT" value="${tripPrices[0].rebookBalanceTotalAmount}"/>
				{/if}

				{var lastName = this.data.rqstParams.lastName/}
				{if !this.utils.isEmptyObject(this.data.rqstParams.lastNameOne)}
					{set lastName = this.data.rqstParams.lastNameOne/}
				{/if}

				// formatting month to 'MM'
				{var monthTwoDigit = currDate.getMonth() + 1/}
				{if monthTwoDigit < 10}
					{set monthTwoDigit = '0' + monthTwoDigit/}
				{/if}

				// formatting year to 'YY'
				{var twoDigitYear = '' + currDate.getFullYear()/}
				{set twoDigitYear = twoDigitYear.substring(twoDigitYear.length - 2)/}

				{if this._getSiteBoolean('siteSpecServChargeable')}
					<input type="hidden" name="DISPLAY_CARRY_OVER_STATUS" value="TRUE" />
				{/if}

				{if !this.utils.isEmptyObject(this.data.rqstParams.reply.recommendationId)}
					<input type="hidden" name="RECOMM_REF" value="${this.data.rqstParams.reply.recommendationId}" />
				{/if}

				{if this.data.rqstParams.fareBreakdown.pnrs[0] != null && this.data.rqstParams.fareBreakdown.pnrs[0].recLocator != null}
					<input type="hidden" name="PLTG_NEXT_ACTION" value="FareNotes.action" />
				{else/}
					<input type="hidden" name="PLTG_NEXT_ACTION" value="FareConditions.action" />
				{/if}

				{if this.utils.isEmptyObject(this.data.rqstParams.isWebFares) || this.data.rqstParams.isWebFares.toLowerCase() == false}
					{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}

						{if pnr.recLocator != null}
							<input type="hidden" name="PLTG_RECORD_LOCATORS" value="${pnr.recLocator}" />
						{/if}

						{var pnrTravellerTypesTitle = ''/}
						{foreach travellerTypeInfo in pnr.travellerTypesInfos}

							{var key = 'tx_pltg_text_' + travellerTypeInfo.travellerType.code + 'NameAllLowerCasePlural'/}
							{var travellerTypeName = this.data.labels[key]/}

							{var travellerTypeNoName = new modules.view.merci.common.utils.StringBufferImpl()/}
							{var travellerTypeDetails = new Array()/}

							// creating array of parameters for formatting string
							${travellerTypeDetails.push(travellerTypeInfo.number)|eat}
							${travellerTypeDetails.push(travellerTypeName)|eat}
							${travellerTypeNoName.append(this.data.labels.tx_pltg_pattern_travellerTypeNumberOfAndName)|eat}

							{var travellerTypeNumberOfAndName = travellerTypeNoName.formatString(travellerTypeDetails)/}
							{var travellerTypeSeparator = this.data.labels.tx_pltg_text_travellerTypesSeparator/}

							{if travellerTypeInfo_index > 0}
								{set pnrTravellerTypesTitle = pnrTravellerTypesTitle + travellerTypeSeparator/}
							{/if}

							{set pnrTravellerTypesTitle = pnrTravellerTypesTitle + travellerTypeNumberOfAndName/}
						{/foreach}
						<input type="hidden" name="PLTG_PNR_TRAVELLER_TYPES_TITLES" value="${pnrTravellerTypesTitle}" />
					{/foreach}
				{/if}

				// if promo enabled, add a hidden input tag
				{if this.__allowPromo()}
					<input name="PROMOTION_CODE" id="PROMOTION_CODE" type="hidden">
				{/if}

				<input type="hidden" name="RECORD_LOCATOR" value="${this.data.rqstParams.recLoc}" />
				<input type="hidden" name="ACTION" value="${actionVal}" />
				<input type="hidden" name="BOOKINGLASTNAME" value="{if !this.utils.isEmptyObject(lastName)}${lastName}{/if}" />
				<input type="hidden" name="todayMonth" value="${monthTwoDigit}" />
				<input type="hidden" name="todayYear" value="${twoDigitYear}" />
				<input type="hidden" name="DELIVERY_TYPE" value="ETCKT" />
				<input type="hidden" name="SESSION_ID" value="${this.data.rqstParams.requestBean.SESSION_ID}" />
				<input type="hidden" name="JSP_FROM" value="{if !this.utils.isEmptyObject(this.data.rqstParams.jspFrom)}${this.data.rqstParams.jspFrom}{/if}" />
				<input type="hidden" name="OFFICE_ID" value="${this.data.rqstParams.requestBean.OFFICE_ID}" />
				<input type="hidden" name="PAGE_TICKET" id="PAGE_TICKET" value="${this.data.rqstParams.reply.pageTicket}" />
				<input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED" />
				<input type="hidden" name="REGISTER_START_OVER" value="true" />
				{if this.data.rqstParams.param.upsellOutLow != null}<input type="hidden" name="upsellOutLow" value="${this.data.rqstParams.param.upsellOutLow}" />{/if}
				{if this.data.rqstParams.param.upsellInLow != null}<input type="hidden" name="upsellInLow" value="${this.data.rqstParams.param.upsellInLow}" />{/if}
				{if this.data.rqstParams.param.IS_PAY_ON_HOLD != null}<input type="hidden" name="IS_PAY_ON_HOLD" value="${this.data.rqstParams.param.IS_PAY_ON_HOLD}" />{/if}
				{var itemId = ''/}
				{if !this.utils.isEmptyObject(this.data.rqstParams.itemId)}
					{set itemId = this.data.rqstParams.itemId/}
				{/if}

				<input type="hidden" name="ITEM_ID" value="${itemId}" />
				<input type="hidden" name="PLTG_FROM_PURC" value="TRUE" />
				<input type="hidden" name="REC_LOC" value="${this.data.rqstParams.recLoc}" />
				<input type="hidden" name="ELEMENT_TYPE" id="ELEMENT_TYPE" value="" />
				<input type="hidden" name="DO_NOT_APPLY_BOOKING_FEE" id="DO_NOT_APPLY_BOOKING_FEE" value="false" />
				{var merchantURL = this.data.base[0] + '://' + this.data.base[1] + '/' + this.data.base[10] + '/' + this.data.base[4] + '/' + this.data.base[11]/}
				<input type="hidden" name="MERCHANT_URL" value="${merchantURL}" />
				<input type="hidden" name="PNR_ORDER" value="0" />
				<input type="hidden" name="CATEGORY_1" value="AL" />
				<input type="hidden" name="CATEGORY_2" value="" />
				<input type="hidden" name="FLOW_TYPE" value="${bRebooking}"/>
				<input type="hidden" name="MEMO_TYPE" value="EMAIL_MEMO"/>
				<input type="hidden" name="MEMO_EMAIL" value="${this.data.rqstParams.contactEmail}"/>

				// to get json response
				<input type="hidden" name="result" value="json"/>

				{var billingInfoCheckedValue = ''/}
				{if this.data.rqstParams.param.billingInfoChecked != null}
					{set billingInfoCheckedValue = this.data.rqstParams.param.billingInfoChecked/}
				{/if}
				<input id='billingInfoChecked' type="hidden" name='billingInfoChecked' value='${billingInfoCheckedValue}'/>


				{section {
					id: "cyberSource",
					macro: {name: 'printCyberSource'}
				}/}

				{var cancelBoxLabel = this.data.labels.tx_merci_text_booking_purc_confirm_cancel/}
				{if bRebooking == true}
					{set cancelBoxLabel = this.data.labels.tx_merci_atc_cancel_flow/}
				{/if}

				{if (this.utils.isRequestFromApps())}
				   <div class="mask" id="cancel-box" style="display:none">
						<div class="dialogue">
							<h3 class="dialogueContent">${cancelBoxLabel}</h3>
							<footer class="buttons buttonGroupCenter">
								<button type="button" class="" {on click {fn: 'gotoHome'}/}>${this.data.labels.tx_merci_awards_yes}</button>
								<button class="" type="button" {on click {fn: 'closeCancelPopup'}/}>${this.data.labels.tx_merci_awards_no}</button>
							</footer>
						</div>
					</div>
				{else /}
					<div class="dialog native" id="cancel-box" style="display:none">
						<p>${cancelBoxLabel}</p>
						<footer class="buttons">
							<button class="validation active" type="button" {on click {fn: 'gotoHome'}/}>${this.data.labels.tx_merci_awards_yes}</button>
							<button class="cancel" type="button" {on click {fn: 'closeCancelPopup'}/}>${this.data.labels.tx_merci_awards_no}</button>
						</footer>
					</div>
				{/if}
			</form>
			
      			//store credit card details:start
       			{if this.data.siteParams.siteStoreCCDetails != null && this.data.siteParams.siteStoreCCDetails.toLowerCase() == 'true'}
          				{if this.data.rqstParams.reply.IS_USER_LOGGED_IN}
            					<div class="dialog native" id="dialog-updatecard" style="display:none">
          						<div class="eMiddlepanel"> <span class="eLeftpanel"></span> <span class="eRightPanel"></span> </div>
          						<p id="updatecc-text"></p>
          						<footer class="buttons">
            							<button class="active validation" type="button" {on tap {fn: '_onbuttonClickCCUpdate',args: {cancel: 'false'}}/}>${this.data.labels.tx_merci_proceed}</button>
            							<button class="cancel" type="button" {on tap {fn: '_onbuttonClickCCUpdate',args: {cancel: 'true'}}/}>${this.data.labels.tx_merci_cancel}</button>
          						</footer>
          					</div>
          				{/if}
        			{/if}
        			//store credit card details:end
		</section>
		{set purcPageLoaded = true/}
	{/macro}
	{macro extPayMethods(showExtPayment, showDeferredPayment, showCCPayment, multipleMop)}
		<section>
			{@html:Template {
				classpath: "modules.view.merci.segments.booking.templates.purc.MEXTPayMethods",
				data: {
					'labels': this.data.labels,
					'rqstParams': this.data.rqstParams,
					'showExtPayment': showExtPayment,
					'showDeferredPayment': showDeferredPayment,
					'showCCPayment': showCCPayment,
					'multipleMop': multipleMop,
					'siteParams': this.data.siteParams,
					'TTTCompatibleArr': this.data.TTTCompatibleArr
				}
			}/}
		</section>
	{/macro}
	{macro payLater(ispayLaterEnbl, timeToThinkEnbl,fractionDigits)}
		{if this.moduleCtrl.payLater == null || this.moduleCtrl.payLater}
			<article id="plcontrols" class="panel payment">
				<header>
					<h1>{if (ispayLaterEnbl == 'TRUE')}${this.data.labels.tx_merci_text_booking_pay_later_caption}{/if}{if (timeToThinkEnbl == 'TRUE')}${this.data.labels.tx_pltg_text_needmoretime}{/if}</h1>
				</header>
				<article class="miles">
					<label>{if (ispayLaterEnbl == 'TRUE')}${this.data.labels.tx_merci_text_paylater_purc_page}{/if}{if (timeToThinkEnbl == 'TRUE')}${this.data.labels.tx_merci_think_trip_later}{/if}</label>
					<div class="payLtrBtn">
						<label class="baselineText payLtrLabel" style="width:60%;"><strong>{if (ispayLaterEnbl == 'TRUE')}${this.data.labels.tx_merci_text_booking_pay_later_question_mark}{/if}{if (timeToThinkEnbl == 'TRUE')}
						{var formattedTTTPrice = this.utils.printCurrency(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.totalAmount, fractionDigits)/}
						{var TTTLaterInformation = new this._strBuffer(this.data.labels.tx_merci_think_days)/}
						{var TTTLaterInfoArray = new Array()/}
						${TTTLaterInfoArray.push(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.days)|eat}
						${TTTLaterInformation.formatString(TTTLaterInfoArray)} (${formattedTTTPrice} ${this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.currency}){/if}</strong></label>
					<div class="onoffswitch">
						<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="plonoffswitch" {on click {fn: 'payLaterAction',args: {payLaterEnbl:ispayLaterEnbl, timeToThinkEnbl:timeToThinkEnbl,id:this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.id}}/}>
						<label class="onoffswitch-label" for="plonoffswitch">
							<div class="onoffswitch-inner">
								<div class="onoffswitch-active">${this.data.labels.tx_merci_awards_yes}</div>
								<div class="onoffswitch-inactive">${this.data.labels.tx_merci_awards_no}</div>
							</div>
							<div class="onoffswitch-switch"> </div>
						</label>
						</input>
						</div>
					</div>
					<label id="payLabel" style="display:none;">
						{var plLabel1 = this.data.labels.tx_merci_text_paylater_pay_info/}
						{var payLaterInformation = new this._strBuffer(plLabel1)/}
						{if (ispayLaterEnbl == 'TRUE')}
						{var dtTime = this._getDateTime(this.data.rqstParams.payLaterBean.onHoldLimitDate)/}
						{/if}
						{if (timeToThinkEnbl == 'TRUE')}
							{var dtTime = this._getDateTime(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.endDate)/}
						{/if}
						{var dateStr = aria.utils.Date.format(dtTime, "EEEE d MMMM yyyy")/}
						{var dateTime = aria.utils.Date.format(dtTime, "HH:mm")/}
						{var payLaterInfoArray = new Array()/}
						// passing param and printing string
						${payLaterInfoArray.push(dateStr)|eat}
						${payLaterInfoArray.push(dateTime)|eat}
						{if (ispayLaterEnbl == 'TRUE')}
						${payLaterInfoArray.push(this.data.rqstParams.payLaterBean.pendingTimeLimit)|eat}
						{/if}
						{if (timeToThinkEnbl == 'TRUE')}
							${payLaterInfoArray.push(this.data.rqstParams.payLaterBean.timeToThinkLimit)|eat}
						{/if}
						${payLaterInformation.formatString(payLaterInfoArray)}
					</label>
				</article>
			</article>
			${this.moduleCtrl.payLater = true|eat}
		{/if}
	{/macro}

	{macro showPaymentTypeDetails(ccInfo, currDate, tripPrices, currencies,bRebooking)}
		{if this.data.isFop == "SADAD"}
			{call sadadDetails() /}
		{elseif (this.data.isFop == "CC")/}
			{call creditCardDetails(ccInfo, currDate, tripPrices, currencies,bRebooking) /}
		{elseif (this.data.isFop == "PPAL")/}
			{call paypalFormParams() /}
		{elseif (this.data.isFop == "PLCC")/}
			{call PLCCFormParams() /}
		{elseif (this.data.isFop.indexOf("AMOP")>-1)/}
			{call AMOPForms() /}
		{/if}
	{/macro}

	{macro creditCardDetails(ccInfo, currDate, tripPrices, currencies,bRebooking )}

			<p class="name">
				{var ccValue = ''/}
				{var ccNumber = ''/}
				{var expMonth = 0/}
				{var expYr = ''/}
				{var ccType = ''/}

				{if !this.utils.isEmptyObject(this.data.rqstParams.airCCNameOnCard)}
					{set ccValue = this.data.rqstParams.airCCNameOnCard/}
				{/if}
				{if !this.utils.isEmptyObject(this.data.rqstParams.airCCNumber)}
					{set ccNumber = this.data.rqstParams.airCCNumber/}
				{/if}
				{if !this.utils.isEmptyObject(this.data.rqstParams.ccExpiryDateMonth)}
					{set expMonth = this.data.rqstParams.ccExpiryDateMonth/}
				{/if}
				{if !this.utils.isEmptyObject(this.data.rqstParams.ccExpiryDateYear)}
					{set expYr = this.data.rqstParams.ccExpiryDateYear/}
				{/if}
				{if !this.utils.isEmptyObject(this.data.rqstParams.airCCType)}
					{set ccType = this.data.rqstParams.airCCType/}
				{/if}

        <label for="AIR_CC_NAME_ON_CARD">${this.data.labels.tx_merci_text_booking_purc_creditcardholder} <span class="mandatory">*</span></label>
        <input id="AIR_CC_NAME_ON_CARD" autocomplete="off" name="AIR_CC_NAME_ON_CARD"
              type="text" placeholder="${this.data.labels.tx_merci_text_booking_purc_creditcardholder}"  {on change {fn: '_onValueChange', scope: this}/}/>
      </p>
		
      {if this._getSiteBoolean('siteEnableThirdPartyCheck')}
      {var third_partycheck_remark = this.data.labels.tx_merci_text_third_partycheck_remark/}
      <p>
		
          <input id="thirdPartyCheck" name="thirdPartyCheck" type="checkbox" {on click {fn: 'toggleTPCheck', args: {str:third_partycheck_remark }}/}>
          <label for="thirdPartyCheck">${this.data.labels.tx_merci_text_booking_purc_third_part_check}</label>

          <input type="hidden" name="FROM_PAGE" value="{if !this.utils.isEmptyObject(this.data.rqstParams.fromPage)}${this.data.rqstParams.fromPage} {/if}"></input>
          <div><TEXTAREA style="display:none;" id='input_SO_GL' rows='6' cols='80' name='SO_GL'/></TEXTAREA></div>
          <input type="hidden" name="UI_EMBEDDED_TRANSACTION" value = "MPurchaseValidate"></input>
      </p>
      {/if}

		<div class="row">
			<div class="field-4">
				<p class="card padding-right">
				<label for="select1">${this.data.labels.tx_merci_text_booking_purc_card_type} <span class="mandatory">*</span></label>
				<select id="AIR_CC_TYPE" name="AIR_CC_TYPE" {on change {fn: '_onCreditCardSelection', scope: this}/}>
					//store credit card details:start
    				//get list of credit cards stored and populate the dropdown
    				{if this.data.siteParams.siteStoreCCDetails != null && this.data.siteParams.siteStoreCCDetails.toLowerCase() == 'true'}
      					{if this.data.rqstParams.reply.IS_USER_LOGGED_IN && this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length > 0}
        						{var cardName = ''/}
        						{var listCreditCards = []/}
    							{if ccInfo != null && ccInfo.listCreditCards != null}
    								{set listCreditCards = ccInfo.listCreditCards/}
    							{/if}
        						{foreach cardInfo in this.data.rqstParams.listCCInformation}
         							{set cardName = this._formCardName(cardInfo.accountNumber,listCreditCards,cardInfo.companyCode)/}
          							<option id="${cardInfo.creditCardId}" value="${cardInfo.companyCode}">${cardName}</option>
        						{/foreach}
      					{/if}
    				{/if}
    				//store credit card details:end

    				{if ccInfo != null && ccInfo.listCreditCards != null}
						{foreach creditCard in ccInfo.listCreditCards}
							{foreach siteCreditCard in this.data.globalList.slSiteCreditCard}
								{if creditCard[0] == siteCreditCard[0]}
									<option value="${creditCard[0]}">${creditCard[1]}</option>
								{/if}
							{/foreach}
						{/foreach}
					{/if}
				</select>
			</p>
			</div>
			<div class="field-8">
			{if this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
				{var finalAmount = this.getFinalAmount() + this.__getServicesTotalAmount()/}
				<input type="hidden" name="calcFinalAmnt" value="${finalAmount}" id="calcFinalAmnt"/>
				<p class="card-number card_no">
					<label for="AIR_CC_NUMBER">${this.data.labels.tx_merci_text_booking_purc_creditcardnumber} <span class="mandatory">*</span></label>
					<input id="AIR_CC_NUMBER" autocomplete="off" name="AIR_CC_NUMBER" type="text" placeholder="" {on blur {fn:'retrieveCreditCardFee', args: {url: 'MOBFeesRepricing.action', amt: finalAmount, type: 'CC', reqId: 0}}/}/>
				</p>
			{else/}
					{var finalAmount = this.getFinalAmount() + this.__getServicesTotalAmount()/}
					<input type="hidden" name="calcFinalAmnt" value="${finalAmount}" id="calcFinalAmnt"/>				
				<p class="card-number">
					<label for="AIR_CC_NUMBER">${this.data.labels.tx_merci_text_booking_purc_creditcardnumber} <span class="mandatory">*</span></label>
					<input id="AIR_CC_NUMBER" autocomplete="off" name="AIR_CC_NUMBER" type="tel" {if this._isInstallmentsEnabled()} {on blur {fn:'getInstallmentPlan'}   /} {/if} />
				</p>
            			{/if}

			{if this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees.toLowerCase() == 'true'}
				<p id="CC-CARD-FEE" class="card-fee hidden">
					<label for="CARD_FEE" id="CARD-FEE-LABEL">${this.data.labels.tx_merci_noCardFee}</label>
              				<input type="text" readonly="" placeholder="" value="-" id="CARD_FEE" autocomplete="off">
            				</p>
            			{/if}
			</div>
		</div>
		<div class="row">
			<div class="list expiry field-12">
				<p class="card-cvv">
					<label for="CC_DIGIT_CODE_AIR_1" id="lblCCDigitAir1">
						<small>(${this.data.labels.tx_merci_text_booking_purc_creditcardcvv1})</small><br/>
						${this.data.labels.tx_merci_text_booking_purc_creditcardcvv2}
					</label>
				</p>
			</div>
		</div>
		<div class="row">
			<div class="list expiry field-12">
						<label for="select32" class="expiry">${this.data.labels.tx_merci_text_booking_purc_creditcardexpiry} <span class="mandatory">*</span></label>
			</div>
		</div>
		<div class="row">
			<div class="field-4 cc-expiry-month">
				<div class="padding-right">
						<label for="CCexpiryDateMonth">${this.data.labels.tx_merci_checkin_regdtls_month} <span class="mandatory">*</span></label>
						<select id="CCexpiryDateMonth" name="CCexpiryDateMonth" {on change {fn: '_onValueChange', scope: this}/}>
							{foreach monthName in this.data.globalList.slFullMonthList}
								<option value="${parseInt(monthName_index) + 1}">${monthName[1]}</option>
							{/foreach}
						</select>
				</div>
			</div>
			<div class="field-4 cc-expiry-year">
				<div class="padding-right">
						<label for="CCexpiryDateYear">${this.data.labels.tx_merci_checkin_regdtls_year} <span class="mandatory">*</span></label>
							<select id="CCexpiryDateYear" name="CCexpiryDateYear" {on change {fn: '_onValueChange', scope: this}/}>
								{var currYear = currDate.getFullYear()/}
								{for var i = currYear; i < currYear + 9; i++}
									{var yearTwoDigits = i.toString().substring(2,4) /}
									<option value="${yearTwoDigits}">${i} </option>
								{/for}
							</select>
				</div>
			</div>
			<div class="field-4 ccv-number">
						<label id="lblCCDigitAir2" for="CC_DIGIT_CODE_AIR_1" class="cvv">${this.data.labels.tx_merci_text_booking_purc_creditcardcvv}<span class="mandatory">*</span></label>
						<input id="CC_DIGIT_CODE_AIR_1" name="CC_DIGIT_CODE_AIR_1" type="tel" autocomplete="off" autocorrect="off" size="5" maxlength="4" class="securitymask"/>
						<input type="hidden" name="isCvvMandatory" value="" id="isCvvMandatory"/>
			</div>
		</div>

		
			/*CR 6529051- JJ Installments- START*/
			{if this._isInstallmentsEnabled()}
				{section {
					id: "allInstallments",
					macro: {name: 'installmentSection', args:[currencies[0].code, this.data.labels]}
				}/}
			{/if}

			/*CR 6529051- JJ Installments- END*/

			//store credit card details:start
			{if this.data.siteParams.siteStoreCCDetails != null && this.data.siteParams.siteStoreCCDetails.toLowerCase() == 'true'}
				{if this.data.rqstParams.reply.IS_USER_LOGGED_IN && !(this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length == 3)}
  					 <p class="copy-card" id="storeCC">
        					<input id="store_cc_details" type="checkbox">
        					<label for="store_cc_details">${this.data.labels.tx_merci_save_cc_to_profile}</label>
      				</p>
				{/if}
				{if this.data.rqstParams.reply.IS_USER_LOGGED_IN && (this.data.rqstParams.listCCInformation != null)}
             <p class="copy-card hidden" id="updateCC">
                  <input id="update_cc_details" type="checkbox" checked="checked">
                  <label for="update_cc_details">${this.data.labels.tx_merci_update_credit_card}</label>
              </p>
        {/if}
			
				 {if this.data.rqstParams.reply.IS_USER_LOGGED_IN && this.data.siteParams.deleteStoredCC != null && this.data.siteParams.deleteStoredCC.toLowerCase() == 'true'}
          <p class="hidden" id="deleteCC">
            <button style="height:2em"> <span class="icon-trash displayBlock" {on tap {fn:'removeCC', args:{action: 'MDeleteStoredCC.action'}}/} >&nbsp;</span></button>
            <label style="display:inline-block">${this.data.labels.tx_merci_delete_credit_card}</label>
          </p>
         {/if}
        {/if}
            			//store credit card details:end

			{if this._getSiteBoolean('siteThreedsUse') 
				&& this.data.rqstParams.purchaseInformationConfig.mopAirAvailabilityMap 
				&& this.data.rqstParams.purchaseInformationConfig.mopAirAvailabilityMap['CC'].isAvailable == true}
				<dl class="card-3ds">
					{if ccInfo.isMasterCardActivated == true}
						<dt>
							<figure>
								<img src="//${this.data.base[1]}${this.data.base[10]}/default/${this.data.base[9]}/static/merciAT/modules/common/img/mastercard.fw.png" {on tap {fn:'toggleCCInfo', args:{card: 'masterCard'}}/}/>
								<figcaption {id 'masterCard'/} class="" {on tap {fn:'toggleCCInfo', args:{card: 'masterCard'}}/}>${this.data.labels.tx_merci_text_booking_shopret_shopret_moredetails}</figcaption>
							</figure>
						</dt>
						<dd class="displayBlock hidden" {id 'datamasterCard'/}>
							<object style="overflow:hidden; width: 100%; height: 100%; overflow: auto; -webkit-overflow-scrolling:touch;" data="//www.mastercard.com/us/business/en/corporate/securecode/sc_popup.html?language=it"></object>
						</dd>
					{/if}
					{if ccInfo.isVisaActivated == true}
						<dt>
							<figure>
								<img src="//${this.data.base[1]}${this.data.base[10]}/default/${this.data.base[9]}/static/merciAT/modules/common/img/visa.fw.png" {on tap {fn:'toggleCCInfo', args:{card: 'visa'}}/}/>
								<figcaption {id 'visa'/} class="" {on tap {fn:'toggleCCInfo', args:{card: 'visa'}}/}>${this.data.labels.tx_merci_text_booking_shopret_shopret_moredetails}</figcaption>
							</figure>
						</dt>
						<dd class="displayBlock hidden" {id 'datavisa'/}>
							<object style="overflow:hidden; width: 100%; height: 100%; overflow: auto; -webkit-overflow-scrolling:touch;" data="//${this.data.base[1]}${this.data.base[10]}/default/${this.data.base[9]}/static/html/web/VBV/en_GB/service_popup.htm"></object>
						</dd>
					{/if}
				</dl>
			{/if}

		{if this.data.siteParams.siteCCPsp != null && this.data.siteParams.siteCCPsp.toLowerCase() != 'html'}
			{if tripPrices[0].rebookBalanceTotalAmount <= 0}
				<input type="hidden" name="PAYMENT_TYPE" value="NONE" />
			{else/}
				<input type="hidden" name="PAYMENT_TYPE" value="CC" />
			{/if}
		{else/}
			{if this._isOnlyExtCreditCard() == true}
				<input type="hidden" name="PAYMENT_TYPE" value="CC" />
			{/if}
		{/if}

		{if this._siteBillingRequired()&& this._anyAmtToPay() && (bRebooking == true || !(this.data.siteParams.enableBillingInAlpi== "TRUE") && !(bRebooking == true))}
			{call billingDetails.billingDetails(this.data.labels,this.data.siteParams,this.data.rqstParams,this.utils,this.data.globalList,'purc')/}
		{/if}
		
      <input type="hidden" name="AIR_CC_DIGIT_CODE_OPTION" value="V" />
      <input type="hidden" name="AIR_CC_ISSUE_NUMBER" value="" />
      <input type="hidden" name="AIR_CC_START_DATE" value="" />
      <input type="hidden" name="CC_ID" value="AIR_1" />
  {/macro}


	{macro sadadDetails()}
		{var opcDate = getOpcDateSadad() /}

		<section>
			<p id="sadadWarnText" class="sadad">${this.getFormattedDateString(opcDate)}</p>
		</section>

		{var asnPaymentBankBean= this.data.rqstParams.asnPaymentBankBean/}
		<input type="hidden" name="PAYMENT_TYPE" value="ASN" />

		{if !this.utils.isEmptyObject(asnPaymentBankBean)}
			<input type="hidden" name="AIR_ASN_BANK" value="${asnPaymentBankBean.bankCode}" />
			<input type="hidden" name="AIR_ASN_BANK_PROVIDER" value="${asnPaymentBankBean.bankProviderName}" />
		{/if}

		<input type="hidden" name="CALLING_PAGE" value="purc" />
		<input type="hidden" name="asnBank_AS" value="SD" />
		<input type="hidden" name="SERVICE_PRICING_MODE" value="" />
	{/macro}

	{macro printCyberSource()}
		//-- FOR CR FINGER_PRINT [06094626] START  --*/
		{if this._getSiteBoolean('siteEnableCyberSource')}
			{@html:Template {
				classpath: "modules.view.merci.segments.booking.templates.purc.MCyberSource",
				data: {
					'labels': this.data.labels,
					'rqstParams': this.data.rqstParams,
					'siteParams': this.data.siteParams
				}
			}/}
		{/if}
		//-- FOR CR FINGER_PRINT [06094626]  END   --*/
	{/macro}

	{macro AMOPForms()}
		{var urls = this._getExtPaymentURLs()/}
		{var code = this.data.isFop.split("_")/}
		<!-- AMOP params -->
			<input type="hidden" name="CONFIRMATION_URL" value="${urls.amopConfirmationUrl}" />
			<input type="hidden" name="CANCELLATION_URL" value="${urls.cancellationUrl}" />
			<input type="hidden" name="KEEPALIVESESSION_URL" value="${urls.keepAliveSessionUrl}" />
			<input type="hidden" name="PLTG_FROMPAGE" value="true" />
			<input type="hidden" name="TEMPLATE_NAME" value="true" />
			<input type="hidden" name="PAYMENT_TYPE" value="${this.data.isFop}" />

			<input type="hidden" id="PAYMENT_GROUP_1_LIST_PAYMENT_1_PAYMENT_TYPE_CODE" name="PAYMENT_GROUP_1_LIST_PAYMENT_1_PAYMENT_TYPE_CODE" value="${code[0]}" />
	         <input type="hidden" name="PAYMENT_GROUP_1_LIST_PAYMENT_1_AMOP_INFORMATION_CODE" id="PAYMENT_GROUP_1_LIST_PAYMENT_1_AMOP_INFORMATION_CODE" value="${code[1]}" />
	         <input type="hidden" name="PAYMENT_GROUP_1_STATUS" id="PAYMENT_GROUP_1_STATUS" value="REFERENCE" />
		<!-- AMOP params -->



	         <!-- <input type="hidden" name="insuranceProduct_1" value="0|0" /> -->


	{/macro}
	{macro paypalFormParams()}
		{var urls = this._getExtPaymentURLs()/}
		<!-- PAYPAL params -->
			<input type="hidden" name="CONFIRMATION_URL" value="${urls.confirmationUrl}" />
			<input type="hidden" name="CANCELLATION_URL" value="${urls.cancellationUrl}" />
			<input type="hidden" name="KEEPALIVESESSION_URL" value="${urls.cancellationUrl}" />
			<input type="hidden" name="PLTG_FROMPAGE" value="true" />
			<input type="hidden" name="TEMPLATE_NAME" value="true" />
			<input type="hidden" name="PAYMENT_TYPE" value="PPAL" />
		<!-- PAYPAL params -->
	{/macro}

	{macro PLCCFormParams()}
		<input type="hidden" name="PAYMENT_TYPE" value="PLCC" />
	{/macro}

	{macro installmentSection(currencyCode)}
		{if !this.utils.isEmptyObject(this.moduleCtrl.getModuleData().booking.MPURC_A.installmentData)}
			{var numOfInstOptions = this.moduleCtrl.getModuleData().booking.MPURC_A.installmentData.plans.length /}
			<div class="installments">
			 	<div class="installmentsControl"><span>${this.data.labels.tx_merci_txt_select_installment_number}</span>
				 	<span>
						<select id="PAYMENT_GROUP_1_LIST_PAYMENT_1_INSTALLMENT_PLAN_ID" name="PAYMENT_GROUP_1_LIST_PAYMENT_1_INSTALLMENT_PLAN_ID" {on change {fn:"onChangeInstallments"}/}>
					 		{for var i=0; i<numOfInstOptions; i++ }
					 			<option value="${i}" data-installments="${i}" {if i==0}selected="selected"{/if}>${i+1}</option>
					 		{/for}
						</select>
				 	</span>
				</div>
				{section {
					id: "installmentSection1",
					macro: {name: 'createInstallments', args:[currencyCode]},
					bindRefreshTo : [{
						inside : this.data,
						 to : "showInstallments"
					}]
				}/}
			</div>
			<input type="hidden" name="PAYMENT_GROUP_1_LIST_PAYMENT_1_FORM_OF_PAYMENT_ID" value="1" />
			<input type="hidden" name="PAYMENT_GROUP_1_TYPE" value="PAYMENT_GROUP" />
			<input type="hidden" name="PAYMENT_GROUP_1_STATUS" value="REFERENCE" />
			<input type="hidden" name="PAYMENT_GROUP_1_LIST_PAYMENT_1_PAYMENT_TYPE_CODE" value="CC" />
		{/if}
	{/macro}

	{macro createInstallments(currencyCode)}
		{var numOfInstallments= parseInt(this.utils.getStoredItem("NO_OF_INSTALLMENTS") , 10) /}
		{var installmentOptions=this.moduleCtrl.getModuleData().booking.MPURC_A.installmentData.plans /}
		<ul id="installmentPanel" class="installmentsPanel">
			{for var i=0; i<numOfInstallments; i++}
				  <li id="month${i+1}"><span>${this.data.labels.tx_merci_txt_str_installment} ${i+1}</span> <span class="value"> ${currencyCode} {if i==0}${installmentOptions[numOfInstallments-1].ISF}{else/}${installmentOptions[numOfInstallments-1].ISN} {/if}</span></li>
			{/for}
		</ul>
		{if installmentOptions[numOfInstallments-1] != undefined && !this.utils.isEmptyObject(installmentOptions[numOfInstallments-1].ISI)}
			<p id="includingFees" class="inclusiveText">${this.data.labels.tx_merci_txt_installment_fees} ${installmentOptions[numOfInstallments-1].ISI}</p>
		{/if}
	{/macro}

	{macro includeWarning()}
		{section {
			id: 'warnings',
			bindRefreshTo : [{
        				inside : this.data,
        				to : "showWarning",
        				recursive : true
			}],
			macro : {
				name: 'printWarnings'
			}
		}/}
	{/macro}

	{macro printWarnings()}
		{if this.data.warnings != null && this.data.warnings.length > 0}
			{var errorTitle = ''/}
			{if this.data.labels != null && this.data.labels.tx_merci_warning_text != null}
				{set errorTitle = this.data.labels.tx_merci_warning_text/}
			{/if}
			{call message.showInfo({list: this.data.warnings, title: errorTitle})/}
		{/if}
	{/macro}

	{macro includeError()}
		{section {
			id: 'errors',
			bindRefreshTo : [{
        				inside : this.data,
        				to : "errorOccured",
        				recursive : true
			}],
			macro : {
				name: 'printErrors'
			}
		}/}
	{/macro}

	{macro printErrors()}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if this.data.labels != null && this.data.labels.tx_merci_text_error_message != null}
				{set errorTitle = this.data.labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
		{/if}
	{/macro}

	{macro purcFareBrkdwn(bRebooking,finalAmount,insData,currCode,exchRate,payLaterElig)}
		{@html:Template {
            			classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareBreakdown',
           		 	data: {
              			bRebooking: bRebooking,
              			labels: this.data.labels,
              			siteParams: this.data.siteParams,
              			rqstParams: this.data.rqstParams,
              			globalList: this.data.globalList,
              			finalAmount: finalAmount,
              			insData: insData,
              			currCode:currCode,
              			exchRate:exchRate,
						payLaterElig: payLaterElig
            			}
          		}/}
  	{/macro}

  	{macro purcTotalCostDisp(isAwardsFlow,tripPrices,currencies,finalAmount,currCode,exchRate,fractionDigits,bRebooking,payLaterElig)}
  		{if isAwardsFlow == true}
        	{if this._isRebookingFlow() == true}
				<table width="100%" border="0">
					<tr>
						<td class="label">${this.data.labels.tx_merci_text_booking_fare_total_passengers}</td>
						<td class="value">${this.data.labels.tx_merci_miles} <span>${this.data.rqstParams.param.REBOOK_MILES_DIFFERENCE}</span></td>
						<td class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</td>
						<td class="value">
							{if this.data.siteParams.siteEnableConversion.toLowerCase() == 'true' && exchRate!=""  && currCode!=""}
								${currCode}<span>{if tripPrices[0].rebookBalanceTotalAmount != null}${this.utils.printCurrency(tripPrices[0].rebookBalanceTotalAmount* exchRate,fractionDigits)}{/if}</span>
							{else/}
								${currencies[0].code}<span>{if tripPrices[0].rebookBalanceTotalAmount != null}${this.utils.printCurrency(tripPrices[0].rebookBalanceTotalAmount,fractionDigits)}{/if}</span>
							{/if}
						</td>
					</tr>
				</table>
			{else/}
        			<table width="100%" border="0">
          				<tr>
            					<td class="label">${this.data.labels.tx_merci_text_booking_fare_total_passengers}</td>
            					<td class="value">${this.data.labels.tx_merci_miles} <span>${tripPrices[0].milesCost}</span></td>
            					<td class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</td>
            					<td class="value">
            						{if this.data.siteParams.siteEnableConversion.toLowerCase() == 'true' && exchRate!=""  && currCode!=""}
             							${currCode}<span>{if tripPrices[0].totalAmount != null}${this.utils.printCurrency(tripPrices[0].totalAmount* exchRate,fractionDigits)}{/if}</span>
            						{else/}
             							${currencies[0].code}<span>{if tripPrices[0].totalAmount != null}${this.utils.printCurrency(tripPrices[0].totalAmount,fractionDigits)}{/if}</span>
            						{/if}
            					</td>
          				</tr>
						<tr>
						    <td style="text-align:right" colspan="4">
								{if this._getSiteBoolean('siteAllowAPC') && currencies[1] != null}
									${currencies[1].code} <br/> ${covertedCurrencyfinalAmount}
								{/if}
							</td>
						</tr>
        			</table>
			{/if}
      		{else/}
        			<h1>
				<span class="label" {id "orgPriceLabel"/}>
					${this.getTotalPriceLabel()}
				</span>
				{var finalAmount = this.getFinalAmount()/}
				{if (this.data.rqstParams.param.FROM_PAGE === 'SERVICES' && this.data.rqstParams.param.ACTION == 'MODIFY')}
					{if (this.data.rqstParams.reply.pnrStatusCode == 'P')}
						{set finalAmount = finalAmount + this.__getServicesTotalAmount()/}						
					{else/}
					{set finalAmount = this.__getServicesTotalAmount()/}
					{/if}	
				{else/}
					{set finalAmount = finalAmount + this.__getServicesTotalAmount()/}
				{/if}
				{set finalAmount = this.utils.printCurrency(finalAmount, fractionDigits)/}
				<span class="data price total" id="dtPriceTotal">
        					<span>{if this.data.siteParams.siteEnableConversion.toLowerCase() == 'true' && currCode!=""  && exchRate!=""}
          						${currCode} ${this.utils.printCurrency(Number(finalAmount.replace(",","")) * exchRate, fractionDigits)}
         					{else/}
          						${currencies[0].code} ${finalAmount}
        					  {/if}
							</span>
							{if this._getSiteBoolean('siteAllowAPC') && currencies[1] != null}
									{if bRebooking == true}
										{var rebookBalAmt = this.utils.printCurrency(this.data.rqstParams.fareBreakdown.tripPrices[1].rebookBalanceAmount, fractionDigits) /}
										<p>${currencies[1].code} ${rebookBalAmt}</p>
									{else/}
										<p>${currencies[1].code} ${covertedCurrencyfinalAmount}</p>
									{/if}
        					{/if}
					</span>
			</h1>
			{if (payLaterElig.timeToThinkEnbl == 'TRUE')}
				{var formattedTTTPrice = this.utils.printCurrency(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.totalAmount, fractionDigits)/}
				{section {
					id: "TTTPrice",
					macro: {name: 'TTTPriceDetails',args:[formattedTTTPrice]}
				 }/}
			{/if}
		{/if}
  	{/macro}
	{macro TTTPriceDetails(formattedTTTPrice)}
		{if (this.data.showTTTPrice)}
			<h1>
				<span class="label" id="orgPriceLabel1">
					Pay now
				</span>
				<span class="data price total" id="dtPriceTotal1">
					<p>${this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.currency} ${formattedTTTPrice}</p>
        				</span>
			</h1>
     		{/if}
  	{/macro}

  	{macro mPurcPrevItinerary(currCode,exchRate)}
        		{@html:Template {
              		classpath: "modules.view.merci.segments.servicing.templates.rebook.MPreviousItinerary",
              		block: true,
              		data:{
                			'fromPage':'purc',
                			'labels': this.data.labels,
                			'rqstParams': this.data.rqstParams,
                			'config': this.data.siteParams,
                			'currCode':currCode,
                			'exchRate':exchRate
              		}
            		}/}
 	{/macro}

	{macro selectedNewItin()}
		<article class="panel">
			<header><h1>${this.data.labels.tx_merci_atc_rbk_new_itinerary}</h1></header>
			{if this.data.rqstParams.listItineraryBean.itineraries != null}
				{foreach itinerary in this.data.rqstParams.listItineraryBean.itineraries}
					<section class = "trip">
						<div class="{if itinerary_index == 0}departure{else/}return{/if}">
							{foreach segment in itinerary.segments}
								<div class="trip">
									{var dt = this._getDate(segment.beginDateBean)/}
									{var dtFormat = this.data.labels.tx_merci_pattern_DayDateFullMonthYear.substring(this.data.labels.tx_merci_pattern_DayDateFullMonthYear.lastIndexOf(',') + 1,this.data.labels.tx_merci_pattern_DayDateFullMonthYear.length -1)/}
									{set dtFormat = dtFormat.substring(dtFormat.indexOf(',') + 1)/}

									<time class="date" datetime="${this.utils.formatDate(dt,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)}">${this.utils.formatDate(dt,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)}</time>
									<p class="flight-number">
										<strong>${segment.airline.code}${segment.flightNumber}</strong>&nbsp;
										<span>
											{if segment.nbrOfStops == '0'}
												${this.data.labels.tx_merci_text_booking_avail_direct}
											{else/}
												${segment.nbrOfStops} ${this.data.labels.tx_merci_text_pnr_stop}
											{/if}
										</span>
									</p>
									<p class="departure">
										<time class="hour" datetime="${dt|timeformat: this.data.siteParams.siteFullTimeFmt}">
											${dt|timeformat: this.data.siteParams.siteFullTimeFmt}
										</time>
										<span class="city">${segment.beginLocation.cityName}</span>
										<span class="dash">,</span>
										<span class="airport">${segment.beginLocation.locationName}</span>
										<span class="terminal">
											{if segment.beginTerminal != null || segment.beginTerminal != ''}
												${this.data.labels.tx_merci_text_terminal} ${segment.beginTerminal}
											{/if}
										</span>
										<abbr class="city">
											{if segment.beginLocation.locationCode != null || segment.beginLocation.locationCode != ''}
												(${segment.beginLocation.locationCode})
											{/if}
										</abbr>
									</p>
									<p class="arrival">
										{set dt = this._getDate(segment.endDateBean)/}
										<time class="hour" datetime="${dt|timeformat: this.data.siteParams.siteFullTimeFmt}">
											${dt|timeformat: this.data.siteParams.siteFullTimeFmt}
											{if segment.nbDaysBetweenDepAndArrDates > 0}
												&nbsp;+${segment.nbDaysBetweenDepAndArrDates}${this.data.labels.tx_day_s}
											{/if}
										</time>
										<span class="city">${segment.endLocation.cityName}</span>
										<span class="dash">,</span>
										<span class="airport">${segment.endLocation.locationName}</span>
										<span class="terminal">
											{if segment.endTerminal != null || segment.endTerminal != ''}
												${this.data.labels.tx_merci_text_terminal} ${segment.endTerminal}
											{/if}
										</span>
										<abbr class="city">
											{if segment.endLocation.locationCode != null || segment.endLocation.locationCode != ''}
												(${segment.endLocation.locationCode})
											{/if}
										</abbr>
									</p>
								</div>
							{/foreach}
						</div>
					</section>
				{/foreach}
			{/if}
		</article>
 	{/macro}
{/Template}