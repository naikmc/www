{Template{
  $classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiFareRecap',
  $hasScript: true
}}

  {macro main()}

      <article class="panel price {if (this.data.siteParameters.allowAwards == 'TRUE' && this.data.rqstParams.awardsFlow)}static{/if}">
        <section class="fr_sec">
         {var obVal = this.data.rqstParams.param.obfeeVal/}
         {if this.utils.isEmptyObject(obVal) || obVal == ''}
			{set obVal = 0/}
         {/if}
          {set price = parseFloat(this.data.rqstParams.fareBreakdown.tripPrices[0].totalAmount)/}
          {set price = this.utils.printCurrency(price, this.getFractionDigits())/}

        {if (this.data.siteParameters.allowAwards == 'TRUE' && !this.utils.isEmptyObject(this.data.rqstParams.awardsFlow) && this.data.rqstParams.awardsFlow)}
          <table width="100%" border="0" class="fr_tbl_awardsflo">
            <tr>
              <td class="label">${this.data.labels.tx_merci_text_booking_fare_total_passengers}</td>
              <td class="value">${this.data.labels.tx_merci_miles} <span>${this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost}</span></td>
              <td class="conjunction">${this.data.labels.tx_merci_text_booking_purc_and}</td>
              <td class="value">
              {if this.data.siteParameters.siteEnableConversion.toLowerCase() == 'true' && this.data.currCode!=""  && this.data.exchRate!=""}
                ${this.data.currCode}<span>${this.utils.printCurrency(Number(price.replace(",",""))* this.data.exchRate, this.getFractionDigits())}</span>
               {else/}
                ${this.data.rqstParams.fareBreakdown.currencies[0].code}<span>${price}</span>
               {/if}
              </td>
            </tr>
          </table>
        {else/}
          <h1 class="fr_totprice"><span class="label">${this.data.labels.tx_merci_text_booking_recap_totalprice}</span> <span class="data price total">
          {if this.data.siteParameters.siteEnableConversion.toLowerCase() == 'true' && this.data.currCode!=""  && this.data.exchRate!=""}
            {set price = this.utils.printCurrency(Number(price.replace(",",""))* this.data.exchRate, this.getFractionDigits())/}
            ${this.data.currCode} ${price}
           {else/}
            ${this.data.rqstParams.fareBreakdown.currencies[0].code} ${price}
           {/if}</span> </h1>
        {/if}
        </section>
        // overlay
        <footer>
          <a href="javascript:void(0)" {on click {fn:'openPriceDetails'}/}>

        {if (this.data.siteParameters.allowAwards == 'TRUE' && !this.utils.isEmptyObject(this.data.rqstParams.awardsFlow) && this.data.rqstParams.awardsFlow)}
          ${this.data.labels.tx_merci_awards_view_cost}
        {else/}
          ${this.data.labels.tx_merci_text_booking_fare_view_price_details}
        {/if}
          </a>
        </footer>
        <div class="popup cost" id="pricePopup" style="display: none;">
          {@html:Template {
            classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareBreakdown',
            data: {
              'labels': this.data.labels,
              'siteParams': this.data.siteParameters,
              'rqstParams': this.data.rqstParams,
              'fromPage':'alpi',
              currCode:this.data.currCode,
              exchRate:this.data.exchRate
            }
          }/}
        </div>
      </article>
  {/macro}
{/Template}