{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MNewServicesCatalog",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
    <section>
      <form>
  		  <div id="CemService">
    		  {section {
            type: 'div',
            id: 'messages',
            macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
            bindRefreshTo: [{inside: this.data, to: 'messages'}]
          }/}

          {if !this.utils.isEmptyObject(this.request.DWM_HEADER_CONTENT)}
                {@html:Template {
                    classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                    data: {
                      placeholder: this.request.DWM_HEADER_CONTENT,
                      placeholderType: "dwmHeader"
                    }
                }/}
          {/if}


          {if this.isServicingFlow()}
      		  {call tabsList() /}
          {/if}

          {if !this.utils.isEmptyObject(this.dwmContent)}
            {call createCEMBanner() /}
          {/if}
          
          {var items = this.getTotalItems()/}
          {if items > 0}
            {call servicesBasket(items) /}
          {/if}

      		{section {
              type: 'div',
              cssClass : 'CemServ',
      			  macro: {name : "displayServicesCatalog",
      				args : [paxServicesCatalog],
      				scope: this
      			}
      		}/}

          {if !this.utils.isEmptyObject(this.request.DWM_FOOTER_CONTENT)}
                {@html:Template {
                    classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                    data: {
                      placeholder: this.request.DWM_FOOTER_CONTENT,
                      placeholderType: "dwmFooter"
                    }
                }/}
          {/if}

          {call createFooter() /}

  		  </div>
      </form>
    </section>
  {/macro}

  {macro createCEMBanner()}
    {var dwmPageContent = this.dwmContent.value || {} /}
    {if !this.utils.isEmptyObject(dwmPageContent)}
		<div {id 'cem_wrapper'/}>
			${dwmPageContent}
		</div>
    {/if}
  {/macro}

  {macro tabsList()}
	  <nav class="tabs baselineText">
		  <ul>
        <li><a href="javascript:void(0)" class="navigation" {on click {fn: this.showTripDetails, scope: this} /}>
				  ${this.labels.tx_merci_text_trip}
			  </a></li>
        <li><a href="#" class="active navigation">${this.labels.tx_merci_services_tab}</a></li>
        <li><a href="javascript:void(0)" class="navigation" {on click {fn: this.showPaxDetails, scope: this} /}>
				  ${this.labels.tx_merci_text_passenger_info}
			  </a></li>
      </ul>
    </nav>
  {/macro}

  {macro displayServicesCatalog(paxServicesCatalog)}
		{foreach service in paxServicesCatalog}
      {var liClass = "CemServBlock" /}
      {if (service_index % 3 == 1)}
        {set liClass = "leftCem" /}
      {/if}
      {if (service_index % 3 == 2)}
        {set liClass = "rightCem" /}
      {/if}
			{var dataInfoService = this.__getRequestedServiceInfoAmt(service.serviceCode, "SERVICE_INFO") /}
			{var amount = this.__getRequestedServiceInfoAmt(service.serviceCode, "PIECES") /}
			<li {if this.isEligibleForChangeModif(service.serviceCode)}
            {on click {fn: this.selectService, scope: this, args: [service.serviceCode]} /}
          {/if} class="${liClass} {if !this.isEligibleForChangeModif(service.serviceCode)}disabled {/if}">
			  {var paymentDetails = this.getPaymentData(service.serviceCode) /}
			  {var listClass = this.getListClass(paymentDetails) /}
				<p class="amount ${listClass}">
					<span>${amount}</span>
				</p>
				{var className = this.__getClassName(service.serviceCode) /}
				<span class="${className}"></span>
				{var label = this.getLabel(service.serviceCode) /}
        <span class="descr">${label}</span>
				<p class="price ${listClass}">
				{if (!this.utils.isEmptyObject(paymentDetails.toPay))}
					${this.labels.tx_merci_services_topay} ${this.utils.printCurrency(paymentDetails.toPay,2)} ${this.currencyBean.code}
				{elseif !this.utils.isEmptyObject(paymentDetails.paid) /}
					${this.labels.tx_merci_services_paid} ${this.utils.printCurrency(paymentDetails.paid,2)} ${this.currencyBean.code}
				{elseif !this.isPresentInCatalog(service.serviceCode) /}
					${this.utils.formatString(this.labels.tx_merci_services_notavailable,this.__getClassName(service.serviceCode))}
				{else /}
					{if (!this.utils.isEmptyObject(paymentDetails.minPrice))}
						${this.labels.tx_merci_services_from} ${this.utils.printCurrency(paymentDetails.minPrice,2)} ${this.currencyBean.code}
					{else/}
						${this.labels.tx_merci_services_free}
					{/if}
				{/if}
				</p>
				<p class="moreInfo">
					${dataInfoService}
				</p>
			</li>
		{/foreach}
  		
  	<div class="mask" {id 'bookmarksAlertOverlay' /}>
  		<div class="dialogue">
  			<h3 id="dialogueContent">${this.labels.tx_merci_services_bookmarked}</h3>
  			<p id="dialogueContent2">${this.labels.tx_merci_available_favourite}</p>
  			<button type="button" {on click {fn: toggleBookmarkAlert, scope: this} /}>${this.labels.tx_merciapps_ok}</button>
  		</div>
  	</div>
  {/macro}

	{macro servicesBasket(items)}
    <div class="CemShopingClose" id="CemShopingCart">
      <h1>${this.labels.tx_merci_services_yourservices}</h1>
      <i class="icon-remove" {on tap {fn: toggleCemShopping, scope: this} /}></i>
      </button>
      {foreach service in this.servicesData}
        {var label = this.getLabel(service.serviceCode) /}
        {var quantity = service.quantity /}
        {var amountToPay = service.toPay /}
        {if quantity !== 0}
          <h2>${label}</h2>
          <dl>
            <dt>${quantity} ${label}</dt>
            <dd>${this.utils.printCurrency(amountToPay,2)}</dd>
            <dd>${this.currencyBean.code}</dd>
            <dd>
              <a href="#" class="remove">
                <i class="icon-trash" {on tap {fn: this.cancelServices, scope: this, args: service.serviceCode} /}></i>
              </a>
            </dd>
          </dl>
        {/if}
      {/foreach}
      <dl class="total">
        <dt>${this.labels.tx_merci_nwsm_tot_service}</dt>
        {var totalAllServices = this.getAllServTotal() /}
        <dd>${this.utils.printCurrency(totalAllServices,2)}</dd>
        <dd>${this.currencyBean.code}</dd>
      </dl>
    </div>
  {/macro}

  {macro createFooter()}
    <footer class="buttons CeM">
      {var items = this.getTotalItems()/}
      {if items > 0 || !this.isServicingFlow() || this.inputTagsAvailable()} /* PTR 7691552 block proceed when no service */
        <button type="submit" class="validation" role="button" aria-controls="promo1" aria-expanded="false" formaction="javascript:void(0)" {on click {fn: this.proceed, scope: this} /}>
          {if this.getAllServTotal() !== 0 }
            ${this.labels.tx_merci_services_paynow}
          {else/}
            ${this.labels.tx_merci_proceed}
          {/if}
        </button>
      {/if}
    </footer>
  {/macro}
{/Template}