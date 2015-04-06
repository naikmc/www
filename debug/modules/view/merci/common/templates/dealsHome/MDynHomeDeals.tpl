{Template {
  $classpath: "modules.view.merci.common.templates.dealsHome.MDynHomeDeals",
  $macrolibs: {common: 'modules.view.merci.common.utils.MerciCommonLib'},
  $hasScript: true
}}

	{macro main()}
		{section {
			id: "dealsContent",
			macro: 'printDealsHome'
		}/}	
	{/macro}
	
	{macro printDealsHome()}
		{if this.dealsSectionReady}
			{var label = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam/}
			
			<div id="selectDep" class="pop">
				<h1>Select your preferred airport depature</h1>
				<input id="selectAirport" list="departure-list" placeholder="Singapore">
				{var listParentOfferBean = rqstParams.listofferbean/}
				{if listParentOfferBean.countryList == undefined}
					{set listParentOfferBean.countryList = new Array()/}
				{/if}
				<datalist id="departure-list">						
					{if (listParentOfferBean.countryList.length != "0")}
						{var getExpiringMilesInfo = 0 /}
						<option value="select">${label.SelCountry}</option>
						{foreach country in listParentOfferBean.countryList}
							<option value="${country.code}"
								{if this._isSelectedCountry({
									'country': country, 
									'listParentOfferBean':listParentOfferBean
								})}
									selected = selected
								{/if}
							>${country.name}</option>

						{/foreach}
					{/if}						
				</datalist>
			</div>	
			<div id="deals" class="swipeholder">
				<h1>Deals and offers from <a href="#" class="select" id="prefDep">Singapore</a></h1>
				<div class="carrousel-header">
					<div {id 'deals_dynaScroller' /} class="carrousel-content Dynamic">
						<ol id="deals_olScroll">				
							{foreach offer in rqstParams.listofferbean.offers}					
								<li class="on first wMin newyork" style="background: url(css/locations/newyork.jpg);" id="deals_liScroll_${offer_index}">
									<p>${listParentOfferBean.dealDetailsMap[offer.offerId].startDate} - ${listParentOfferBean.dealDetailsMap[offer.offerId].endDate}</p>
									<button class="bookmark"></button>
									<hgroup>
										<h2>${listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName}</h2>
										<h3>
											<span class="price-new">
												<abbr>${offer.currency}</abbr> 									
												<span>${offer.price}</span>
											</span>
										</h3>
									</hgroup>
									/*<p>25% off (10 seats remaining)</p>
									<section class="conditions">
										<h4>Conditions</h4>
										<dl class="table">
											<dt>Minimum-passengers</dt>
											<dd>1 Adult</dd>
											<dt>Cabin-class</dt>
											<dd>Economy</dd>
											<dt>Minimum-stay</dt>
											<dd>5 days</dd>
											<dt>Maximum-stay</dt>
											<dd>1 month</dd>
											<dt>Advanced-purchase</dt>
											<dd>5 days</dd>
											<dt>Travel-completion-date</dt>
											<dd>none</dd>
											<dt>Outbound-travel-period</dt>
											<dd>1 Jan 2015 to 31 Mar 2015</dd>
											<dt>Special-conditions</dt>
											<dd>Exclusive to American Express cardholders</dd>
											<dt>Other-conditions</dt>
											<dd>Prices are inclusive of airfares and all taxes and surcharges. Prices could differ slightly due to currency</dd>
										</dl>
									</section>*/
									<div class="actions">
										<button class="share">Share</button>
										<button class="continue">Book</button>
										<button class="open">More details</button>
									</div>
								</li>								
							{/foreach}
						</ol>		
					</div>
					${this.setScroll('deals',rqstParams.listofferbean.offers.length)}
					{call common.createDynaCrumbs('deals',rqstParams.listofferbean.offers.length)/}
				</div>
			</div>				
			<nav><ol class="progress"><li class="on">New York</li><li>Hong Kong</li><li>San Francisco</li></ol></nav>
		{/if}	
	{/macro}

{/Template}