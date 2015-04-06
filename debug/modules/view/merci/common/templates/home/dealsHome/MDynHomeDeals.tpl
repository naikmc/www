{Template {
  $classpath: "modules.view.merci.common.templates.home.dealsHome.MDynHomeDeals",
  $macrolibs: {common: 'modules.view.merci.common.utils.MerciCommonLib'},
  $hasScript: true
}}

	{var showFareCond = false/}
	{macro main()}
		{section {
			id: "dealsContent",
			type: 'div',
			macro: 'printDealsHome'
		}/}
	{/macro}

	{macro printDealsHome()}
		{if this.dealsSectionReady}
			{var label = this.data.labels/}
			{var siteParameters = this.data.siteParameters/}
			{var rqstParams = this.data.rqstParams/}
			{var listParentOfferBean = rqstParams.listofferbean/}
			<div id="deals" class="swipeholder">
				<h1>
					{if this.data.rqstParams.selectedCountry != null 
						&& this.data.rqstParams.selectedCountry !== ''}
						Deals and offers from 
						<a href="javascript:void(0);" class="select" id="prefDep" {on click {fn: 'onChangeCountry'}/}>${this.data.rqstParams.selectedCountry}</a>
					{else/}
						For Deals: 
						<a href="javascript:void(0);" class="select" id="prefDep" {on click {fn: 'onChangeCountry'}/}>Select Country</a>
					{/if}
				</h1>
				{if (listParentOfferBean.offers != undefined && listParentOfferBean.offers.length >0)}
				<div class="carrousel-header">
					<div {id 'deals_dynaScroller' /} class="carrousel-content Dynamic">
						<ol id="deals_olScroll">
							{foreach offer in rqstParams.listofferbean.offers}
								<li class="on first wMin newyork" style="background: url(css/locations/newyork.jpg);" id="deals_liScroll_${offer_index}">
									
									<hgroup>
										<h2>${listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName}</h2>
										<h3>
											<span class="price-new">
												<abbr>${offer.currency}</abbr>
												<span>${offer.price}</span>
											</span>
										</h3>
									</hgroup>
									
									<div class="actions">
										<button class="share">Share</button>
										<button class="continue">Book</button>
										<button class="open" {on click {fn:"onMoreDetails",args : {ID : offer.offerId, destCityName: listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName, origCityName: listParentOfferBean.dealDetailsMap[offer.offerId].originCityName, startDate: listParentOfferBean.dealDetailsMap[offer.offerId].startDate, endDate: listParentOfferBean.dealDetailsMap[offer.offerId].endDate } }/}>More details</button>
									</div>
								</li>
							{/foreach}
						</ol>
					</div>
				  </div>
				{else/}
					<li><span>${label.tx_merci_text_do_no_deals}</span></li>	
				{/if}

				{var size = 0/}
				{if rqstParams.listofferbean != null && rqstParams.listofferbean.offers != null}
					{set size = rqstParams.listofferbean.offers.length/}
				{/if}
				{call common.createDynaCrumbs('deals', size)/}
			</div>
			
		{/if}
	{/macro}

{/Template}