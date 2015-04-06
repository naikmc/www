{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcIns',
	$hasScript: true
}}

	{macro main()}

		{var labels = this.data.labels/}
		{var siteParams = this.data.siteParams/}
		{var rqstParams = this.data.rqstParams/}
		{var globalList = this.data.globalList/}

		{var fractionDigits = 0/}
		{if this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1}
			{set fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length/}
		{/if}

		{var productCode = ''/}
		{if rqstParams.param.SELECTED_INSURANCE_PRODUCT_CODE_1 != null}
			{set productCode = rqstParams.param.SELECTED_INSURANCE_PRODUCT_CODE_1/}
		{/if}

		// for copying the payment mode of AIR TI Insurance
		<input type="hidden" name="COPY_MOP_FOR_INS" value="TRUE" />

		<article class="panel insurance" id="insurance">
			<header>
				<h1>${labels.tx_merci_text_booking_ins_label} <button type="button" role="button" class="toggle" aria-expanded="true"  id ="inssection" {on click {fn:'toggle', scope: this, args : {ID1 : 'inssection'} }/}><span>Toggle</span></button></h1>
			</header>
			<section id="section_inssection">
				{if !this._isServicingFlow()}
					<p class="insurance" id="noInsurance">
					  <input id="radio0" name="insuranceProductdetails" type="radio" name="radio-insurance" {if productCode == null || productCode == ''}checked="checked"{/if} value="not_selected" {on click {fn: 'noInsurance'}/}>
					  <label for="radio0">${labels.tx_merci_text_booking_purc_dont_want_insurance}</label>
					</p>
				{/if}
	            {var ins = this.getCheapestInsurance(rqstParams.insurancePanelKey.insProductList) /}
				{if !this.utils.isEmptyObject(rqstParams.insurancePanelKey.insProductList)}
					{foreach insuranceProduct in rqstParams.insurancePanelKey.insProductList}
						{var insCondPopupURL = ''/}
						{if insuranceProduct.generalConditionURL != null && insuranceProduct.generalConditionURL != ''}
							{set insCondPopupURL = insuranceProduct.generalConditionURL/}
						{/if}
						{var altImgName = insuranceProduct.providerCode + '-' + insuranceProduct.productCode/}
						{var formatIns = this.utils.printCurrency(insuranceProduct.totalAmount, fractionDigits)/}
                     	 <p class="insurance insVal">
						{if this._isServicingFlow() && rqstParams.insurancePanelKey.insProductList.length==1}
							<input id="radio${insuranceProduct_ct}" name="insuranceProductdetails" value="${insuranceProduct.providerCode},${insuranceProduct.productCode},${insuranceProduct.formatedTotalAmount}" type="hidden" {if (productCode != null && productCode != '' && productCode == insuranceProduct.productCode) || (this._isServicingFlow() && insuranceProduct.productCode ==ins.productCode)}checked="checked"{/if} {on click {fn: 'insuranceSelected', args: {insAmt: formatIns}}/}>
						{else/}
						  <input id="radio${insuranceProduct_ct}" name="insuranceProductdetails" value="${insuranceProduct.providerCode},${insuranceProduct.productCode},${insuranceProduct.formatedTotalAmount}" type="radio" {if (productCode != null && productCode != '' && productCode == insuranceProduct.productCode) || (this._isServicingFlow() && insuranceProduct.productCode ==ins.productCode)}checked="checked"{/if} {on click {fn: 'insuranceSelected', args: {insAmt: formatIns}}/}>
						  
						{/if}
							<label for="radio${insuranceProduct_ct}">
								${labels.tx_merci_text_booking_purc_insurance_text_one}
								<span>${insuranceProduct.productName}</span>
								<em>
									${labels.tx_merci_text_booking_purc_insurance_text_three} {if !this.utils.isEmptyObject(insCondPopupURL) && insCondPopupURL != ''}<a href="${insCondPopupURL}" target="_blank">{/if}${labels.tx_merci_text_booking_purc_terms_and_conditions}{if !this.utils.isEmptyObject(insCondPopupURL) && insCondPopupURL != ''}</a>{/if} ${labels.tx_merci_text_booking_purc_and} ${labels.tx_merci_text_booking_purc_declaration} ${labels.tx_merci_text_booking_purc_insurance_text_four}&nbsp;
								</em>
							</label>
						</p>
						<p class="priceInsurance">${insuranceProduct.formatedTotalAmount}</p>
					{/foreach}
				{/if}
				
				{if !this.utils.isEmptyObject(rqstParams.insurancePanelKey.enableDocIdInsu) && rqstParams.insurancePanelKey.enableDocIdInsu}
					<div class="hidden" {id "insuranceDoc"/}>
						{@html:Template {
							classpath: "modules.view.merci.segments.booking.templates.purc.MPurcInsDoc",
							data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'globalList': globalList,
							}
						}/}
					</div>
				{/if}
			</section>
		</article>

		<input type="hidden" name="NUMBER_OF_TRVL" id="NUMBER_OF_TRVL"  value="${rqstParams.listTravellerBean.numberOfTraveller}"/>
		<input type="hidden" name="CONTACT_POINT_SOS_NAME" value="${rqstParams.param.FIRST_NAME_1}" />
		<input type="hidden" name="CONTACT_POINT_SOS_PHONE" value="${rqstParams.param.CONTACT_POINT_MOBILE_1}" />
		{if this._isServicingFlow()}
			<input type="hidden" name="INS_AMT" value="${ins.totalAmount.toFixed(fractionDigits)}" {id "INS_AMT"/}/> 
		{else/}
			<input type="hidden" name="INS_AMT" value="0.00" {id "INS_AMT"/}/>
		{/if}
	{/macro}

{/Template}