{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.myfavourite.MFavourite',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

	{macro main()}

			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}

			{if !merciFunc.isEmptyObject(pageObjFav.jsonObj)}
				//{var jsonObj = (aria.utils.Json.getValue(this.data, 'jsonObj'))/}
				{var jsonFare=(pageObjFav.jsonObj['RVNWFARESTATUS']||null)/}
				{var jsonTrip=(pageObjFav.jsonObj['RVNWFAREINFO']||null)/}
				{var jsonDeal=(pageObjFav.jsonObj['DEALSTATUS']||null)/}
				{var jsonflight=(pageObjFav.jsonObj['FLIGHTSTATUS']||null)/}
				{var jsonDealMfare=(pageObjFav.jsonObj['DEALFARESTATUS']||null)/}
				{var dealFareTrip=(pageObjFav.jsonObj['DEALFAREINFO']||null)/}
				{var bookMarkParams=(pageObjFav.jsonObj['BookMarkParameters']||null)/}

			{/if}
			{if merciFunc.booleanValue(this.siteParams.siteEnableShareBookmark)}
				{section {
					id: "shareItin",
					type: "div",
					bindRefreshTo: [
						{ to:"shareDataFlag", inside:this.data }
					],
					macro: {
						name: "displayShareTrip",
						scope: this,
					}
				}/}
			{/if}

	    <section>
			<form name="favouriteForm" id="favouriteForm">
				{if !merciFunc.isEmptyObject(pageObjFav.siteParams) && pageObjFav.__merciFunc.booleanValue(pageObjFav.siteParams["siteAllowFavorite"])}
					{if pageObjFav.siteParams.allowBookmarkFlight == "TRUE" }
						<article class="panel list">
							<header>
							  <h1>
							  {var flightCount=0 /}
							  {if !merciFunc.isEmptyObject(jsonflight)}
								  {for key in jsonflight}
										{set flightCount= flightCount+1/}
								  {/for}
							  {/if}

								${pageObjFav.labels.tx_merciapps_flights_to_watch}&nbsp;(${flightCount})
								<button type="button" role="button" id="flightButton" class="toggle" aria-expanded="{if flightCount > 5}false{else/}true{/if}" data-aria-controls="section_flightButton" {on click {fn:"toggle", args:{sectionId:'section_flightButton', buttonId: 'flightButton'} } /}><span>Toggle</span></button>

							 </h1>
							</header>
							<section class="bookmarkList" id="section_flightButton" data-aria-hidden="false" style="{if flightCount > 5}display:none{/if}">
							  <ul role="listbox" class="bookMarkClass">
								  {if !merciFunc.isEmptyObject(jsonflight)}
									{set counter= 1/}
									{for key in jsonflight}
									  {if jsonflight.hasOwnProperty(key)}
										{var flighttrip= jsonflight[key]/}
										   <li role="option" {on click {fn:onFlightStatusClick, args:{"flightN":flighttrip.flightNum,"beginDate":flighttrip.beginDate,"beginYr":flighttrip.beginyr,"keyData":key, "id":"delFlightButton_"+counter}}/}  {on longpress {fn :onLongPressBookMark,args:{"id":"delFlightButton_"+counter}}/}>
												<ul class="bookmarkItem">
													<li class="leftColumn">
														<span>${flighttrip.flightNum}</span>
													</li>
													<li class="midColumn">
															<span class="city">${flighttrip.bcityName}</span>
															<span class="city">${flighttrip.ecityName}</span>
													</li>
													
													<li class="rightColumn" >			 
															<span><time class="" datetime="DD MMM HH:MM">${flighttrip.beginDate}<span class="dash">-</span>${flighttrip.beginTime}</time></span>	
													</li>
												</ul>
												<button id="delFlightButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onFlightDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>

												{set counter= counter+1/}
											</li>
									  {/if}
									{/for}
								  {else/}
										<span>${pageObjFav.labels.tx_merciapps_no_flight}</span>
								  {/if}
							  </ul>
							</section>
						</article>
					{/if}
					
					
					{if pageObjFav.siteParams["allowbookMarkRvnw"]=="TRUE"}
						<article class="panel list">
							<header>
							   <h1>
							   {var fareCount=0 /}
						  {if !merciFunc.isEmptyObject(jsonFare)}
							  {for key in jsonFare}
									{set fareCount= fareCount+1/}
							  {/for}
						  {/if}

								${pageObjFav.labels.tx_merciapps_book_a_flight}&nbsp;(${fareCount})
								<button type="button" role="button" id="rvnueButton" class="toggle" aria-expanded="{if fareCount > 5}false{else/}true{/if}" aria-controls="section_rvnueButton" {on click {fn:"toggle", args:{sectionId:'section_rvnueButton', buttonId: 'rvnueButton'} } /}><span>Toggle</span></button>
							  </h1>
							</header>
							<section class="bookmarkList" id="section_rvnueButton" data-aria-hidden="false" style="{if fareCount > 5}display:none{/if}">
							  <ul role="listbox" id="panel-daof">
								{if !merciFunc.isEmptyObject(jsonFare)}
									{set counter= 1/}
									{for key in jsonFare}
										{if jsonFare.hasOwnProperty(key)}
											{var rvnwTrip= jsonFare[key]/}
											{var rvnwInfoTrip= jsonTrip[key]/}
											<li role="option" {on longpress {fn :onLongPressBookMark,args:{"id":"delFareButton_"+counter}}/} {on click {fn:onRenevnueFlowClick, args:{"rvnwInfoTrip":rvnwInfoTrip, "currDT":rvnwTrip.currDT, "id":"delFareButton_"+counter,"flow":"Revenue"}}/} >
												<ul class="bookmarkItem">
													{if merciFunc.booleanValue(this.siteParams.siteEnableShareBookmark)}
														<li class="shareIcon">
															<span class="icon-share" {on click {fn:shareTrip, args:{"rvnwInfoTrip":rvnwInfoTrip, "currDT":rvnwTrip.currDT, "id":"delFareButton_"+counter,"flow":"Revenue","type":"revenue","destination":rvnwTrip.E_LOCATION_NAME}}/}></span>
														</li>
													{/if}
													<span>
													<li class="leftColumn">
														{var currencyFormat = this.siteParams.siteCurrencyFormat /}
														{var digits = currencyFormat.length - currencyFormat.indexOf(".") - 1 /}
														{var price = rvnwTrip.PRICE/}
														{set price = parseFloat(price) /}
														{set price = price.toFixed(digits) /}
														<span class="price">${rvnwTrip.CURRENCY}</span>
														<span class="price">${price}</span>
													</li>
													<li class="midColumn">
															<span class="city">${rvnwTrip.B_LOCATION_NAME}</span>
															<span class="city">${rvnwTrip.E_LOCATION_NAME}</span>
														
													</li>
													<li class="rightColumn">
															<span><time class="" datetime="DD MMM HH:MM">${rvnwTrip.B_DATE_1}</time></span>
															{if rvnwTrip.TRIP_TYPE !="O" && rvnwTrip.B_DATE_2 !=undefined}
																<span><time class="" datetime="DD MMM HH:MM">${rvnwTrip.B_DATE_2}</time></span>
															{/if}	
													</li>
													</span>
												</ul>
												<button id="delFareButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onFareDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
												{set counter= counter+1/}
											</li>
										{/if}
									{/for}
								{else/}
									<span>${pageObjFav.labels.tx_merciapps_no_book_flight}</span>
								{/if}
							  </ul>
							</section>
						</article>
					{/if}

					{set x=false /}
					//{if pageObjFav.siteParams["allowbookMarkAward"]=="TRUE"}
					{if x==true}
						<article class="panel list">
							<header>
							   <h1>
								//${labels.tx_merci_text_home_home}&nbsp;
								//${labels.tx_merci_text_home_home}
								<button type="button" role="button" id="milesButton" class="toggle" aria-expanded="{if flightCount > 5}false{else/}true{/if}" aria-controls="section22" {on click {fn:"toggle", args:{sectionId:'book-miles2', buttonId: 'milesButton'} } /}><span>Toggle</span></button>
							  </h1>
							</header>
							<section id="section_milesButton" aria-hidden="false" style="{if flightCount > 5}display:none{/if}">
							  <ul role="listbox">
						//		{foreach langCreditCardItem in globalList.slLanguageCreditCard}
									<li role="option" >
										<span class="price miles"><em>Miles</em> 30,000</span>

										<p class="route">
											<span class="city">Singapore</span>
											<span class="city">Hong Kong</span>
										</p>

										<p class="period">
										  <time class="departure date" datetime="2012-10-22T07:35">22 Oct  07:35</time>
										  <time class="departure date" datetime="2012-10-30T08:05">30 Oct 08:05</time>
										</p>
									</li>

						//		{/foreach}
							  </ul>
							</section>
						</article>
					{/if}

					{if pageObjFav.__merciFunc.booleanValue(pageObjFav.siteParams["allowbookMarkDeal"])}
						<article class="panel list">
							<header>
								<h1>
									{var dealCount=0 /}
									{if !merciFunc.isEmptyObject(jsonDeal)}
										{for key in jsonDeal}
											{set dealCount= dealCount+1/}
										{/for}
									{/if}
									{if !merciFunc.isEmptyObject(jsonDealMfare)}
										{for key in jsonDealMfare}
											{set dealCount= dealCount+1/}
										{/for}

									{/if}

									${pageObjFav.labels.tx_merci_text_do_fare_deals}&nbsp;(${dealCount})
									<button type="button" role="button" id="dealButton" class="toggle" aria-expanded="{if dealCount > 5}false{else/}true{/if}" data-aria-controls="section_flightButton" {on click {fn:"toggle", args:{sectionId:'section_dealButton', buttonId: 'dealButton'} } /}><span>Toggle</span></button>

								</h1>
							</header>
							<section class="bookmarkList" id="section_dealButton" data-aria-hidden="false" style="{if dealCount > 5}display:none{/if}">
								{set counter= 1/}
								<ul role="listbox">
									{if (!merciFunc.isEmptyObject(jsonDeal))|| (!merciFunc.isEmptyObject(jsonDealMfare))}
										{if (!merciFunc.isEmptyObject(jsonDeal))}
											{for key in jsonDeal}
												{if jsonDeal.hasOwnProperty(key)}
													{var dealsTrip= jsonDeal[key]/}
													<li role="option" {on longpress {fn :onLongPressBookMark,args:{"id":"delDealButton_"+counter}}/} >
														//<span role="option" class="price"> ${jsonDeal[key].currency}&nbsp${jsonDeal[key].cost}</span>
														<ul class="bookmarkItem">
															{if merciFunc.booleanValue(this.siteParams.siteEnableShareBookmark)}
																<li class="shareIcon">
																	<span class="icon-share" {on click {fn:shareTrip, args:{"ID":jsonDeal[key].offerID,"countrySite":jsonDeal[key].COUNTRY_SITE,"id":"delDealButton_"+counter,"flow":"Deals","type":"deals","destination":jsonDeal[key].destination}}/}></span>
																</li>
															{/if}
															<span {on click {fn:onDealsOfferClick, args:{"ID":jsonDeal[key].offerID,"countrySite":jsonDeal[key].COUNTRY_SITE,"id":"delDealButton_"+counter,"flow":"Deals"}}/}>
															<li class="imageIcon leftColumn">
																<span>${jsonDeal[key].currency}</span>
																<span>${jsonDeal[key].cost}</span>
															</li>
															<li class="midColumn">
																	<span class="city">${jsonDeal[key].origin}</span>
																	<span class="city">${jsonDeal[key].destination}</span>
															
															</li>
															
															<li class="rightColumn" >
																<span><time datetime="DD MMM HH:MM">${jsonDeal[key].startDate}</time></span>
																<span><time datetime="DD MMM HH:MM">${jsonDeal[key].endDate}</time></span>
															</li>
															</span>
														</ul>
														<button id="delDealButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onDealDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
														{set counter= counter+1/}
													</li>
												{/if}
											{/for}
										{/if}
										{if (!merciFunc.isEmptyObject(jsonDealMfare))}
											{for key in jsonDealMfare}
												{if jsonDealMfare.hasOwnProperty(key)}
													{var dealTrip= jsonDealMfare[key]/}
													{var dealInfoTrip= dealFareTrip[key]/}
													<li role="option" {on longpress {fn :onLongPressBookMark,args:{"id":"delDealButton_"+counter}}/} >
														<ul class="bookmarkItem">
															{if merciFunc.booleanValue(this.siteParams.siteEnableShareBookmark)}
																<li class="shareIcon">
																	<span class="icon-share" {on click {fn:shareTrip, args:{"dealInfoTrip":dealInfoTrip, "currDT":dealTrip.currDT, "id":"delDealButton_"+counter,"type":"revenue","destination":jsonDealMfare[key].E_LOCATION_NAME}}/}></span>
																</li>
															{/if}
															<span {on click {fn:onRenevnueFlowClick, args:{"dealInfoTrip":dealInfoTrip, "currDT":dealTrip.currDT, "id":"delDealButton_"+counter}}/}>
															<li class="leftColumn">
																<span>${jsonDealMfare[key].CURRENCY}</span>
																<span>${jsonDealMfare[key].PRICE}</span>
															</li>
															<li class="midColumn">
																	<span class="city">${jsonDealMfare[key].B_LOCATION_NAME}</span>
																	<span class="city">${jsonDealMfare[key].E_LOCATION_NAME}</span>
															</li>
															
															<li class="rightColumn" >
																<span><time datetime="DD MMM HH:MM">${jsonDealMfare[key].B_DATE_1}</time></span>
																<span><time datetime="DD MMM HH:MM">${jsonDealMfare[key].E_DATE_1}</time></span>
															</li>
															</span>
														</ul>
														<button id="delDealButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onDealDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>

														{set counter= counter+1/}
													</li>
												{/if}
											{/for}
										{/if}
									{else/}
											<span>${pageObjFav.labels.tx_merciapps_no_deal}</span>
									{/if}
								</ul>
							</section>
						</article>
					{/if}
					{if pageObjFav.__merciFunc.booleanValue(pageObjFav.siteParams["siteAllowBookmarkServices"])}
						{call displayBookmarkedServices() /}
					{/if}
					<input type="hidden" name="result" id="result" value="json"/>
				{/if}
			</form>
		</section>
		<p class="requiredText padLeft"><span class="mandatory">* </span><small>${pageObjFav.labels.tx_merciapps_msg_delete}</small></p>
	{/macro}
	
	{macro displayBookmarkedServices()}
		{var servicesBookmarkData = (pageObjFav.jsonObj['SERVICESCATALOG']||[]) /}
		<article class="panel list">
			<header>
				<h1>${pageObjFav.labels.tx_merci_BookServices} (${servicesBookmarkData.length})
					<button type="button" id="servicesButton" role="button" class="toggle" aria-expanded="{if servicesBookmarkData.length > 5}false{else/}true{/if}" {on click {fn:"toggle", args:{sectionId:'section_servicesButton', buttonId: 'servicesButton'} } /}><span>Toggle</span></button>
				</h1>
			</header>
			<section class="bookmarkList" id="section_servicesButton" aria-hidden="false" style="{if servicesBookmarkData.length > 5}display:none{/if}">
				<ul role="listbox" id="panel-daof">
					{if !pageObjFav.__merciFunc.isEmptyObject(servicesBookmarkData)}
						{set counter= 1 /}
						{foreach bookmark in servicesBookmarkData}
							{var basket = bookmark.basket /}
							{var selection = basket.selection /}
							{var totalPrice = selection.totalPrice /}
							{var currency = totalPrice.currency /}
							{var itineraryData = bookmark.itineraryData /}
							{var beginLocation = itineraryData.beginLocation /}
							{var beginDate = itineraryData.beginDate /}
							{var endLocations = itineraryData.endLocations /}
							{var endDates = itineraryData.endDates /}
							{var servicesData = bookmark.servicesData /}
							<li role="option" {on click {fn: this.retrieveBookmark, scope: this, args:{bookmark : bookmark}} /}>
								<ul class="bookmarkItem">
									<li class="leftColumn">
										<span class="price">${currency.code}</span>
										<span class="price">${totalPrice.balancedAmount}</span>
									</li>
									<li class="midColumn">
										<span class="city">${beginLocation}</span>
										{foreach endLocation in endLocations}
											<span class="city">${endLocation}</span>
										{/foreach}
									</li>
									<li class="rightColumn">
										<span><time class="" datetime="DD MMM HH:MM">${beginDate}</time></span>
										{foreach endDate in endDates}
											<span><time class="" datetime="DD MMM HH:MM">${endDate}</time></span>
										{/foreach}
									</li>
									<p class="services">
										{foreach service in servicesData}
											{if service.quantity != 0}
												${service.label}(${service.quantity}), 
											{/if}
										{/foreach}
									</p>
								</ul>	
								<button id="delBookmarkIcon_${counter}" role="checkbox" onclick="return false;" {on click {fn:'delServicesBookmark',args:{recordLocator :bookmark.REC_LOC}}/} class="favdelete delClass"</button>		
							</li>
							
							
							{set counter= counter+1/}
						{/foreach}
					
					{else/}		
						<span>${pageObjFav.labels.tx_merci_no_services_bookmark_available}</span>
					{/if}
				</ul>
			</section>
		</article>
	{/macro}

	{macro displayShareTrip()}
		{if !this.__merciFunc.isEmptyObject(this.shareData.shareResponse)}
			{@html:Template {
				classpath: "modules.view.merci.common.templates.MShareItinerary",
				data: {
					'labels': this.labels,
					'rqstParams': this.rqstParams,
					'siteParams': this.siteParams,
					'shareData': this.shareData,
					'destination': this.data.destination
				}
			}/}
		{/if}
	{/macro}
{/Template}
