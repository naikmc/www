{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MServicesCatalog",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
    <section>
      <form>

      {if !this.utils.isEmptyObject(this.request.DWM_HEADER_CONTENT)}
            {@html:Template {
                classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                data: {
                  placeholder: this.request.DWM_HEADER_CONTENT,
                  placeholderType: "dwmHeader"
                }
            }/}
      {/if}

		<div id="servicesSelectContainer">
  		  {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}

        {if this.isServicingFlow()}
    		  {call tabsList() /}
        {/if}

        <article class = "panel selectpax is-scrollable">
    		  <header>
    		    {@html:Template {
              classpath: "modules.view.merci.common.templates.MPaxSelector",
      		    data: {
        				passengers : this.tripplan.paxInfo.travellers,
        				selectCallBack : {fn: this.paxScrollCallBack, scope: this},
        				selectedPaxIndex : this.selection.paxId
        			},
              block: true
            }/}
    		  </header>

      		{section {
      			macro: {name : "displayServicesCatalog",
      				args : [paxServicesCatalog],
      				scope: this
      			},
      			bindRefreshTo : [{
      			to: "paxId",
      			inside: this.selection
      			}]
      		}/}
  	    </article>

        {if !this.utils.isEmptyObject(this.request.DWM_FOOTER_CONTENT)}
              {@html:Template {
                  classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                  data: {
                    placeholder: this.request.DWM_FOOTER_CONTENT,
                    placeholderType: "dwmFooter"
                  }
              }/}
        {/if}

        <article class="panel basket animate">
  		    {call servicesBasket() /}
  		  </article>
		  </div>
      </form>
    </section>
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
    <section id="outFlight01">
  	<div class="services-catalog">
  		<div class="draggable-parent" id="wrapperServices" style="overflow:hidden">
  			<ul class="services-checked draggable animateList" id="catalogScroller" >
  				{var paxes = this.tripplan.paxInfo.travellers /}
  				{foreach service in paxServicesCatalog[this.selection.paxId]}
  					{var dataInfoService = this.__getRequestedServiceInfoAmt(this.selection.paxId, service.serviceCode, "SERVICE_INFO") /}
  					{var amount = this.__getRequestedServiceInfoAmt(this.selection.paxId, service.serviceCode, "PIECES") /}
  					<li {if !this.isEligibleForChangeModif(service.serviceCode)}class="disabled"{/if}>
						{var paymentDetails = this.getPaymentData(this.selection.paxId, service.serviceCode) /}
						{var listClass = this.getListClass(paymentDetails) /}
  						<p class="amount ${listClass}">
  							<span>${amount}</span>
  						</p>
  						<a class="moreServices" href="javascript:void(0)"
  							{if this.isEligibleForChangeModif(service.serviceCode)}
  								{on click {fn: this.selectService, scope: this, args: [service.serviceCode]} /}
  							{/if}>
  							{var className = this.__getClassName(service.serviceCode) /}
  							<span class="${className}"></span>
  							{var label = this.getLabel(service.serviceCode) /}
  							<p class="label ${className}_label">${label}</p>
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
  						</a>
  						<p class="moreInfo">
  							${dataInfoService}
  						</p>
  					</li>
  				{/foreach}
  			</ul>
  		</div>
  	</div>
    </section>
	
	<div class="mask" {id 'bookmarksAlertOverlay' /}>
		<div class="dialogue">
			<h3 id="dialogueContent">${this.labels.tx_merci_services_bookmarked}</h3>
			<p id="dialogueContent2">${this.labels.tx_merci_available_favourite}</p>
			<button type="button" {on click {fn: toggleBookmarkAlert, scope: this} /}>${this.labels.tx_merciapps_ok}</button>
		</div>
	</div>
  {/macro}

	{macro servicesBasket()}
  		<div class="drawer">
  			<div class="drawer-handle" {on click {fn: 'openCloseDrawer', scope: this}/}>
  				<i aria-hidden="true" class="icon icon-cart"></i>
  				{var items = this.getTotalItems()/}
  				<small> ${items} ${this.labels.tx_merci_services_items}</small>
  				<i aria-hidden="true" class="icon icon-menu"></i>
  				</div>
  			<div class="drawer-contents">
  				<h1>${this.labels.tx_merci_services_yourservices}</h1>
  				{foreach service in this.servicesData}
  					{var label = this.getLabel(service.serviceCode) /}
  					{var quantity = service.quantity /}
  					{var amountToPay = service.toPay /}
  					{if quantity !== 0}
  						<h2>${label}</h2>
  						<dl>
  							<dt>${quantity} ${label}</dt>
  							<dd>
  								<a href="#" class="remove">
  									<i class="icon-remove" {on click {fn: this.cancelServices, scope: this, args: service.serviceCode} /}></i>
  								</a>
							  </dd>
  							<dd>${this.utils.printCurrency(amountToPay,2)}</dd>
  						</dl>
  					{/if}
  				{/foreach}
  				<dl class="total">
  					<dt>${this.labels.tx_merci_nwsm_tot_service}</dt>
  					<dd>${this.currencyBean.code}</dd>
  					{var totalAllServices = this.getAllServTotal() /}
  					<dd>${this.utils.printCurrency(totalAllServices,2)}</dd>
  				</dl>
  			</div>
  		</div>
  		<section>
        <p class="main-price">{if totalAllServices}${this.currencyBean.code} ${this.utils.printCurrency(totalAllServices, 2)}{/if}</p>
        {if items > 0 || !this.isServicingFlow() || this.inputTagsAvailable()} /* PTR 7691552 block proceed when no service */
          <button type="submit" role="button" aria-controls="promo1" aria-expanded="false" formaction="javascript:void(0)" {on click {fn: this.proceed, scope: this} /}>
    				{if this.getAllServTotal() !== 0 }
  					  ${this.labels.tx_merci_services_paynow}
  				  {else/}
  					  ${this.labels.tx_merci_proceed}
  				  {/if}
    			</button>
  			{/if}
      </section>
    {/macro}
{/Template}