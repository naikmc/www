{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MEXTPayMethods',
	$hasScript: true
}}
	{macro main()}
		{var labels = this.data.labels/}
		{var rqstParams = this.data.rqstParams/}
		{var siteParams = this.data.siteParams/}		
		
		{if this.data.showExtPayment}
			{if (this.data.multipleMop == true && this.data.TTTCompatibleArr.length == 0) || (this.data.multipleMop == true && this.data.TTTCompatibleArr.length > 0 && this.data.TTTCompatibleArr.indexOf("EXT") != -1)}
				<p>
					<input type="radio" name="PAYMENT_TYPE" value="EXT" id="EXT" {if rqstParams.merciMop != null && rqstParams.merciMop == 'EXT'}checked="checked"{/if} {on click {fn:'hideControls'}/}>
					<label for="EXT">${labels.tx_merci_text_booking_extpay_txt_external_payment}</label>
				</p>
			{else/}
				<input type="hidden" name="PAYMENT_TYPE" value="EXT" />
			{/if}
		{/if}
		
		{if (this.data.showDeferredPayment && this.data.TTTCompatibleArr.length == 0) || (this.data.showDeferredPayment && this.data.TTTCompatibleArr.length > 0 && this.data.TTTCompatibleArr.indexOf("DFRR") != -1)}
			<p>
				<input type="radio" name="PAYMENT_TYPE" value="DFRR" id="DFRR" {if rqstParams.merciMop != null && rqstParams.merciMop == 'DFRR'}checked="checked"{/if} {on click {fn:'hideControls'}/}>
				<label for="DFRR">${labels.tx_merci_text_booking_extpay_txt_deferred_payment}</label>
			
				// TODO More Info for deferred
			</p>
		{/if}
		
		{if (this.data.showCCPayment && this.data.TTTCompatibleArr.length == 0) || (this.data.showCCPayment && this.data.TTTCompatibleArr.length > 0 && this.data.TTTCompatibleArr.indexOf("CC") != -1)}
			<p>
				<input name="PAYMENT_TYPE" type="radio" value="CC" id="cc" {on click {fn:'showControls'}/} {if !this.utils.isEmptyObject(rqstParams.merciMop) && rqstParams.merciMop == 'CC'}checked="checked"{/if}/>
				<label for="cc">${labels.tx_merci_text_booking_extpay_label_cc_payment}</label>
			</p>
		{/if}
		
		// get External Payment URLS
		{var urls = this._getExtPaymentURLs()/}

		<input type="hidden" name="CONFIRMATION_URL" value="${urls.confirmationUrl}"/>
		<input type="hidden" name="CANCELLATION_URL" value="${urls.cancellationUrl}"/>
		<input type="hidden" name="KEEPALIVESESSION_URL" value="${urls.keepAliveSessionUrl}"/>
		<input type="hidden" name="PLTG_FROMPAGE" value="{if !this.utils.isEmptyObject(rqstParams.templateName)}${rqstParams.templateName}{/if}" />
		{if this.utils.booleanValue(this.data.multipleMop) && siteParams.siteMerciDataTransfer!=null && siteParams.siteMerciDataTransfer.toLowerCase()=='true' 
			&& siteParams.siteDataTransfer != null
			&& siteParams.siteDataTransfer.toLowerCase() == 'true'
			&& siteParams.siteAllowDataTransExt != null
			&& siteParams.siteAllowDataTransExt.toLowerCase() == 'true'}
			{for key in rqstParams.datatransfer}
			  {if rqstParams.datatransfer.hasOwnProperty(key) == true && rqstParams.datatransfer[key] != "PAYMENTTYPE"}
			    <input type="hidden" value="${rqstParams.datatransfer[key]}" name="${key}"/>
			  {/if}	  
			{/for}
			<input type="hidden" name="PAYMENTTYPE" id="PAYMENTTYPE" value=""/>
		{/if}
	{/macro}
{/Template}