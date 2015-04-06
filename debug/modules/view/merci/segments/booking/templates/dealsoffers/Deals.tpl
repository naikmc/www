{Template {
  $classpath:'modules.view.merci.segments.booking.templates.dealsoffers.Deals',
  $macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib', tablet: 'modules.view.merci.common.utils.MerciTabletLib'},
  $hasScript : true
}}

	{macro main()}
		{section {
			id: "docontent",
			macro: 'printDeals'
		}/}
	{/macro}

	{macro printDeals()}

			{if this.sectionReady}
				{var label = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels/}
				{var siteParameters = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam/}
				{var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam/}
				{var client = this.moduleCtrl.getValuefromStorage('client')/}
				{if rqstParams.listofferbean.offers == undefined}
					{set rqstParams.listofferbean.offers = new Array()/}
				{/if}

					{var className = "deals"/}
					<section class="${className}">
					{call includeError(label)/}
					{if (siteParameters.mapViewParam == 'TRUE')}
						<nav class="tabs">
							<ul>
								<li id="t1"><a href="javascript:void(0)" class="navigation active listView">${label.ListView}</a></li>
							<li id="t2"><a href="javascript:void(0)" {on click "onMapDisplayClick"/} class="navigation mapView dealsMap">${label.MapView}</a></li>
							</ul>
						</nav>
					{/if}
					<form>
						<article class="panel list dealspanel">
							<header class="tabPanel">
								{var listParentOfferBean =rqstParams.listofferbean/}
								{if listParentOfferBean.countryList == undefined}
									{set listParentOfferBean.countryList = new Array()/}
								{/if}
								<p class="country">
									<label>${label.SelCountry}</label>
									<select id="countryBox" {on change "onChangeCountry" /}>
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
									</select>
								</p>
							{var isFilter = moduleCtrl.getValuefromStorage('filterCriteria')/}
							{var showFilterOptions = "TRUE" /}
							{if (isFilter == false)}
								{var listOffers =rqstParams.listofferbean/}
							{else/}
								{var listOffers =this.getFilteredListOffers()/}
							{/if}
							{if (siteParameters.siteDealZeroFilter=="TRUE")&&(listOffers.offers.length=="0")}
								{set showFilterOptions="FALSE"/}
							{/if}
							{if (showFilterOptions=="TRUE")}
							<p class="filter-results toggle">${label.FilterOptions}:<button type="button" id="filterButton" role="button" class="toggle" aria-expanded="true" data-aria-controls="section1" {on click {fn:"toggleFilter", args:{sectionId:'tabs', buttonId: 'filterButton'} } /}><span>Toggle</span></button>
								</p>
							<div class="tabs dealstabs" id="tabs">
									<ul role="tablist">
										{if (siteParameters.priceFilterParam == 'TRUE')}
										<li id="priceLi" class="filterButtons" role="tab" aria-expanded="false"  aria-hidden="true" {on click {fn:"onSelectFilter",args : {ID : "priceLi"} } /}>${label.Price}</li>
										{/if}
										{if (siteParameters.destFilterParam == 'TRUE')}
											<li id="destinationLi" class="filterButtons" role="tab" aria-expanded="false"  aria-hidden="true" {on click {fn:"onSelectFilter",args : {ID : "destinationLi"} } /}>${label.FromTo}</li>
										{/if}
										{if (siteParameters.travelPeriodFilterParam == 'TRUE')}
											<li id="travelPeriodLi" class="filterButtons" role="tab" aria-expanded="false"  aria-hidden="true" {on click {fn:"onSelectFilter",args : {ID : "travelPeriodLi"} } /}>${label.TravelPeriod}</li>
										{/if}
									</ul>
									<!--Slider-->
									<div id="priceRange" role="tabpanel" data-aria-labeledby="tab_1" data-aria-hidden="true" class="noDisplay">
										<div class="layout"> </div>
										<div class="layout-slider">
											<input id="SliderSingle" type="slider" name="price" value="25" />
											<span class="layout-slider" style="width: 100%"><span style="display: inline-block; width: 100%; padding: 0 5px;"> </span></span>
										</div>
									</div>
									<!--Slider ends-->
									<!-- From To Filter Start -->
									<div id="destination" role="tabpanel" data-aria-labeledby="tab_2" data-aria-hidden="true" class="noDisplay">
										<ul class="inputForm offers">
											<p class="country">
												<label for="select10"> ${label.From} </label>
											<select id="sourceFilter" name="Country" autocorrect="off" autocomplete="off" {on change {fn:"onSrcChange",args:("sourceChange") } /}>
													<option value="ALL">${label.Anywhere}</option>
													{if (listParentOfferBean.originCityList != undefined && listParentOfferBean.originCityList.length != "0")}
														{foreach country in listParentOfferBean.originCityList}
															 <option value="${country}">${country_index}</option>
														{/foreach}
													{/if}
												</select>
											</p>
											{if (siteParameters.toFilterParam == 'TRUE')}
												<p class="region">
													<label for="select1"> ${label.To} </label>
													<select id="destFilter"  {on change {fn:"onDestChange",args:("destinationChange") } /}>
														<option value="ALL">${label.Anywhere}</option>
														{if (listParentOfferBean.destinationCityList!=undefined && listParentOfferBean.destinationCityList.length != "0")}
															{if (siteParameters.enblGroupingParam == 'TRUE')}
																{foreach region in listParentOfferBean.regionCountryMap}
																	 <option value="${region_index}">${region_index}</option>
																	 {foreach country in region}
																		<option value="${country_index}">--${country_index}</option>
																		{foreach city in country}
																			<option value="${city_index}" style="padding-left:10px;">---${city_index}</option>
																			/*{foreach airport in city}
																				<option style="padding-left:15px;" value="${airport_index}">${airport}</option>
																			{/foreach}*/
																		{/foreach}
																	 {/foreach}
																{/foreach}
															{else/}
																{foreach country in listParentOfferBean.destinationCityList}
																	 <option value="${country}">${country_index}</option>
																{/foreach}
															{/if}
														{/if}
													</select>
												</p>
											{/if}
										</ul>
									</div>
									<!-- From To Filter end -->
									<!-- Travel Date Filter start -->
									<div id="travelPeriod" role="tabpanel" data-aria-labeledby="tab_3" data-aria-hidden="true" class="noDisplay">
										{call createDropDown(label.TravelBetween,siteParameters.showNewDatePicker,'datePickDNOF','DayF','MonthF')/}
										{call createDropDown(label.And,siteParameters.showNewDatePicker,'datePickDNOT','DayT','MonthT')/}
									</div>
									<!-- Travel Date Filter end -->
									<div id="panel4" role="tabpanel-filter" data-aria-labeledby="tab_4" data-aria-hidden="false">
										<p id="route" class="period noDisplay"><span class="label"> ${label.TravelPeriod}:&nbsp; </span>  <span id="travelPrd" class="departure date"></span> <button type="button" class="delete" {on click "removetravelFilter" /}></button></p>
										<p id="route" class="routeSrc route noDisplay"><span class="label">${label.From}: &nbsp; </span><span id="srcCity" class="city" aptCode=""></span><button type="button" class="delete"  {on click "removeSrcFilter" /}></button></p>
										<p id="route" class="routeDest route noDisplay"><span class="label">${label.To}: &nbsp; </span><span id="destCity" class="city" aptCode=""></span> 	<button type="button" class="delete"  {on click "removeDestFilter" /}></button></p>
										<p id="route" class="price2 price noDisplay">
											<span class="label"><span class="label">${label.PriceUpto}&nbsp;</span>
												{if (moduleCtrl.getValuefromStorage('FILTER_CURRENCY') == undefined)}
												{else/}
													${moduleCtrl.getValuefromStorage('FILTER_CURRENCY')}
												{/if}
											</span>
											<span id="sliderPrice"></span><button type="button" class="delete" {on click "removePriceFilter" /}></button>
										</p>
									</div><!-- panel4-->
									<!-- filterOption-->
								</div>
								{/if}
							</header>
						{var orientationMode =moduleCtrl.getValuefromStorage('orientation')/}
							{section {
								id: "do2content",
							macro: {name: 'dealContent', args: [client,label,siteParameters,rqstParams,listParentOfferBean,orientationMode]}
						}/}
						</article>
						{section {
							id: "carouselContent",
							macro: {name: 'landScapeView', args: [client,label,siteParameters,rqstParams,listParentOfferBean,orientationMode]}
						}/}
				</form>
			</section>
		{/if}

		<div class="mask" {id 'bookmarksAlertOverlay' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${label.tx_merciapps_item_added}</h3>
				<p id="dialogueContent2">${label.tx_merci_available_favourite}</p>
				<button type="button" {on click {fn:"toggleBookmarkAlert", args:{id:'added'}} /}>${label.tx_merciapps_ok}</button>
			</div>
		</div>
		
		<div class="mask" {id 'bookmarksAlertOverlay1' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${label.tx_merciapps_item_deleted}</h3>
				<button type="button" {on click {fn:"toggleBookmarkAlert", args:{id:'deleted'}} /}>${label.tx_merciapps_ok}</button>
			</div>
		</div>

	{/macro}
	{macro dealContent(client,label,siteParameters,rqstParams,listParentOfferBean,orientationMode)}
							<!--Table-->
							{if !this.__merciFunc.isEmptyObject(pageDeals.dealsData)}
								{var jsonDeal=(pageDeals.dealsData['DEALSTATUS']||null)/}
							{else/}
								{var jsonDeal=null/}
							{/if}
				
							{var isFilter = moduleCtrl.getValuefromStorage('filterCriteria')/}

							{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE')) && (siteParameters.allowBookmarksParam == 'TRUE') && (moduleCtrl.getValuefromStorage('offerListBookMarked') != undefined))}
								{var bookmarkedOfferList =moduleCtrl.getValuefromStorage('offerListBookMarked')/}
							{/if}
							{set myVar = 0/}
							{if (isFilter == false)}
								{var listOffers =rqstParams.listofferbean/}
								{var offerlist = "listOffers" /}
							{else/}
								{var listOffers =this.getFilteredListOffers()/}
								{var offerlist = "filteredlistofferbean" /}
							{/if}
							<div id ="portrait" {if (orientationMode != "portrait")} class="displayNone" {/if}>
								<section>
									{if (listOffers.offers.length != "0")}
										<h3>${listOffers.offers.length} ${label.OfferchkRestr}</h3>
									{else/}
										<h3>${listOffers.offers.length} ${label.DealsOffers}</h3>
									{/if}
									{if (listOffers.offers.length != "0")}
										<ul role="listbox" id="offerIDN">
											{foreach offer in listOffers.offers}
												{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE'))&& (siteParameters.allowBookmarksParam == 'TRUE') && (moduleCtrl.getValuefromStorage('offerListBookMarked') != undefined && bookmarkedOfferList != ""))}
													{for var i = 0;i< bookmarkedOfferList.length;i++}
														{if bookmarkedOfferList[i] == offer.offerId}
															{set myVar = 1/}
														{/if}
													{/for}
												{/if}
												{if !this.__merciFunc.isEmptyObject(jsonDeal)}
													{for key in jsonDeal}
														{if key ==offer.offerId}
															{set myVar = 1/}
														{/if}
													{/for}		 
												{/if}
												
												<li role="option" offerid="${offer.offerId}" {on click {fn:"onOfferClick",args : {ID : offer.offerId} }/}>
												{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE'))&& (siteParameters.allowBookmarksParam == 'TRUE'))}
												<button role="checkbox" onclick="return false;" {on click {fn:"onDealBookmark",args : {offerId : offer.offerId, offerData:offer} } /} class="bookmark" aria-checked="{if myVar == '0'}false{else/}true{/if}" offerid="${offer.offerId}"><span>Bookmark</span></button>
												{/if}
										<span class="dealsListCell price"><span id="currency_${offer.offerId}">${offer.currency}</span><span id="cost_${offer.offerId}" value="${offer.currency}${offer.price}" style="display:block;">${offer.price}</span></span>
												{if (listParentOfferBean.dealDetailsMap[offer.offerId] != null)}
													<p class="route">
																<span class="city" id="origin_${offer.offerId}" value="${listParentOfferBean.dealDetailsMap[offer.offerId].originCityName}">${listParentOfferBean.dealDetailsMap[offer.offerId].originCityName} &nbsp;</span>
																<span class="dash">-</span>
																<span class="city" id="destination_${offer.offerId}" value="${listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName}">${listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName} &nbsp;</span>
													</p>
													<p class="period">
																<time class="departure date" datetime="2012-03-01" id="startDate_${offer.offerId}">${listParentOfferBean.dealDetailsMap[offer.offerId].startDate}</time>
																<span>to</span>
																<time class="arrival date" datetime="2012-03-31" id="endDate_${offer.offerId}">${listParentOfferBean.dealDetailsMap[offer.offerId].endDate}</time>
													</p>
												{/if}
												{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE'))&& (siteParameters.allowBookmarksParam == 'TRUE'))}
													{set myVar = 0/}
												{/if}
											{/foreach}
										</ul>
									{else /}
										<ul class="padAll10">
											<li><span>${label.Nodeals}</span></li>
										</ul>
									{/if}
									<ul class="displayNone"><li {on click "chgOrientationL"/}>Change Mode to Landscape </li></ul>
								</section>
							</div>
	{/macro}
	{macro landScapeView(client,label,siteParameters,rqstParams,listParentOfferBean,orientationMode)}
							<!-- Carousel view starts here -->
							{if (siteParameters.landscapeParam == 'TRUE')}
								{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE')) && (siteParameters.allowBookmarksParam == 'TRUE') && (moduleCtrl.getValuefromStorage('offerListBookMarked') != undefined))}
									{var bookmarkedOfferList =moduleCtrl.getValuefromStorage('offerListBookMarked')/}
								{/if}
								{if !this.__merciFunc.isEmptyObject(pageDeals.dealsData)}
									{var jsonDeal=(pageDeals.dealsData['DEALSTATUS']||null)/}
								{else/}
									{var jsonDeal=null/}
								{/if}
								<div id ="landscape" {if (orientationMode != "landscape")} class="displayNone" {/if}>
									<div id="page_wrapper" class="padNil">
										<!-- banner -->
										{var listParentOfferBean =rqstParams.listofferbean/}
										<div class="content customContent dealsLandscape">
											<div id="wrapperDeals">
												<div id="scrollerDeals">
													{var isFilter =moduleCtrl.getValuefromStorage('filterCriteria')/}
													{if (isFilter == false)}
														{var listOffers =rqstParams.listofferbean/}
														{var offerlist = "listOffers" /}
													{else/}
														{var listOffers =this.getFilteredListOffers()/}
														{var offerlist = "filteredlistofferbean" /}
													{/if}
													{set minimumStayUnit = ""/}
													{set maximumStayUnit = ""/}
													<ul role="listbox" id="listbox">
														{foreach offer in listOffers.offers}
															{if ((client == true || siteParameters.siteMyFavorite == 'TRUE') && (siteParameters.allowBookmarksParam == 'TRUE') && (moduleCtrl.getValuefromStorage('offerListBookMarked') != undefined && bookmarkedOfferList != ""))}
																{for var i = 0;i< bookmarkedOfferList.length;i++}
																	{if bookmarkedOfferList[i] == offer.offerId}
																		{set myVar = 1/}
																	{/if}
																{/for}
															{/if}
															{if !this.__merciFunc.isEmptyObject(jsonDeal)}
																{for key in jsonDeal}
																	{if key ==offer.offerId}
																		{set myVar = 1/}
																	{/if}
																{/for}		 
															{/if}
															{var _this = this /}
														<li role="option" {if (offer_index == 0)}class="active"{/if}> <span class="price posR">
														{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE'))&& (siteParameters.allowBookmarksParam == 'TRUE'))}
														<button onclick="return false;" {on click {fn:"onDealBookmark",args : {offerId : offer.offerId,offerData:offer} } /} 
														class="bookmark" aria-checked="{if myVar == '0'}false{else/}true{/if}" offerid="${offer.offerId}"></button>
														{/if} ${offer.currency} ${offer.price}</span>
																<p>
																	<span class="city">${listParentOfferBean.dealDetailsMap[offer.offerId].originCityName}</span> <span class="dash">-</span> <span class="city">${listParentOfferBean.dealDetailsMap[offer.offerId].destinationCityName}</span>
																</p>
																<p class="schedule">
																  <time class="departure date" datetime="2012-03-01">${listParentOfferBean.dealDetailsMap[offer.offerId].startDate}</time>
																  <span>to</span>
																  <time class="arrival date" datetime="2012-03-31">${listParentOfferBean.dealDetailsMap[offer.offerId].endDate}</time>
																</p>
															<div id="img_${offer.offerId}" {on tap {fn:"showDetailOffer",args : {imgOffer : "img_"+offer.offerId, detailDiv : "imgdet_"+offer.offerId, thisScope : _this} } /} >&nbsp;</div>
																<div class="details displayNone" id="imgdet_${offer.offerId}" {on click {fn:"showOfferPic",args : {imgOffer : "img_"+offer.offerId, detailDiv : "imgdet_"+offer.offerId} } /}>
																	<ul>
																		<div>${label.OfferExpDate} ${listParentOfferBean.dealDetailsMap[offer.offerId].endDate}</div>
																		{if offer.minimumStayUnit == 'D'}
																			{set minimumStayUnit = "days"/}
																		{elseif offer.minimumStayUnit == 'W'/}
																			{set minimumStayUnit = "weeks"/}
																		{else/}
																			{set minimumStayUnit = "months"/}
																		{/if}
																		{if offer.maximumStayUnit == 'D'}
																			{set maximumStayUnit = "days"/}
																		{elseif offer.maximumStayUnit == 'W'/}
																			{set maximumStayUnit = "weeks"/}
																		{else/}
																			{set maximumStayUnit = "months"/}
																		{/if}
																		<div>${label.MinMaxStay} {if offer.minimumStay == 0}${label.None}{else/}${offer.minimumStay} ${minimumStayUnit}{/if}/{if offer.maximumStay == 0}${label.None}{else/}${offer.maximumStay} ${maximumStayUnit}{/if}</div>
																	</ul>
																<a href="javascript:void(0)" {on click {fn:"onOfferClick",args : {ID : offer.offerId} }/} class="secondary book">${label.Book}</a>
																</div>
															</li>
															{if ((client == true || (siteParameters.siteMyFavorite == 'TRUE'))&& (siteParameters.allowBookmarksParam == 'TRUE'))}
																{set myVar = 0/}
															{/if}
														{/foreach}
													</ul>
												</div>
											</div>
											<ul class="displayNone"><li {on click "chgOrientationP"/}>Change Mode  to Portrait</li></ul>
										</div>
									</div>
								</div>
							{/if}
							<!-- Carousel view ends here -->
	{/macro}
	{macro createDropDown(label,showNewDatePicker,datePick,day,month)}
		<div class="list date">
			<label for="day1">${label}</label>
			{if (showNewDatePicker == 'TRUE')}
				<input type="hidden" class="" id="${datePick}"/>
			{else/}
				<ul class="input">
					<li class="">
						<select id='${day}' name="${day}" {on change {fn:"onDayChange",args:({monthdd:month,daydd:day,datePick:datePick}) } /}>
							{for var i = 1; i <= 31; i++}
								{if (i<10)}
									{set j = '0'+i/}
								{else/}
									{set j = i/}
								{/if}
								<option value="${j}">${i}</option>
							{/for}
						</select>
					</li>
					<li class="">
						<select name="${month}" id='${month}' {on change {fn:"onMonthChange",args:({monthdd:month,daydd:day,datePick:datePick}) } /}>
						/* Populated through js */
						</select>
					</li>
				</ul>
				<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" id="${datePick}"/></a>
			{/if}
		</div>
	{/macro}
	{macro includeError(labels)}
		{section {
			id: 'errors',
			bindRefreshTo : [{
        inside : this.data,
        to : 'error_msg'
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
		{/if}
		// resetting binding flag
		${aria.utils.Json.setValue(this.data, 'error_msg', false)|eat}
	{/macro}
{/Template}