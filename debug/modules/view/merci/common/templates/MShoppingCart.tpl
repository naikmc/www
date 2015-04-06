{Template {
	$classpath: 'modules.view.merci.common.templates.MShoppingCart',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}
	{var fareCount=0 /}
	{macro main()}

		{section {
				id: "shoppingCart",
				type: "div",
				bindRefreshTo: [
					{ to:"displayCart", inside:jsonResponse.ui }
				],
				macro: {
					name: "displayTrip"
				}
		}/}
		{if this.__merciFunc.booleanValue(this.data.siteParams.siteEnableShareBookmark)}			
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

	{/macro}

	{macro displayTrip()}

			{if this.jsonObj !=null && this.jsonObj['RVNWFARESTATUS'] != null }
				{var jsonVal=(this.jsonObj['RVNWFARESTATUS'])/}
			{/if}
			{if this.jsonObj !=null && this.jsonObj['RVNWFAREINFO'] != null }
				{var jsonTrip=(this.jsonObj['RVNWFAREINFO']||null)/}
                	{/if}

			{for key in jsonVal}
				{set fareCount= fareCount+1/}
			{/for}

			<!--shopping cart panel-->
				<div class="shoppingCartContainer" id="shoppingCartContainer" style="display:none">
					<header class="blueBanner">

						{section {
							id: "tripCnt",
							type: "span",
							bindRefreshTo: [
								{ to:"cntBookMark", inside:jsonResponse.ui }
							],
							macro: {
								name: "tripCount"
							}
						}/}

						<button class="sliderClose" type="button" {on click {fn:'closeSlider', scope: this}/}><span class="icon-remove"></span></button>
					</header>

					<section>
						{var i= 1/}
						{var defTripDet= ""/}
						{var tripUrl= ""/}
						{var keyId= ""/}
						{if fareCount != 0}
							<article class="shoppingDeals tabletMargin" id="shoppingDeals">


							{for key in jsonVal}
								{var tripDetails= jsonVal[key]/}
								{set tripUrl= jsonTrip[key]/}
								{set defTripDet= tripDetails/}
								{set keyId= key/}
								<article class="panel"  id="${key}">
									<header>
										<h1>Trip ${i}</h1>
										{if this.__merciFunc.booleanValue(this.data.siteParams.siteEnableShareBookmark)}
											<li class="shareIcon">
												<span class="icon-share" {on tap {fn:'shareTrip', scope:this, args: {id: key, curr:defTripDet.CURRENCY, price:defTripDet.PRICE, url: tripUrl,tripDetails: tripDetails, defTripDetails: defTripDet, destination: tripDetails.E_LOCATION_NAME }}/}> </span>
											</li>
										{/if}
										<span class="fareDelete" id="fareDelete"
										{on tap {fn:'deleteTrip', scope:this, args: {id: key}}/} >Delete<span class="icon-trash"></span> </span>
									</header>
									<span {on tap {fn:'setCheckOut', scope:this, args: {id: key, curr:defTripDet.CURRENCY, price:(defTripDet.PRICE).toFixed(2), url: tripUrl }}/}>
									<section id="segmentId1">
										<div class="trip">
											<time class="date" datetime="Wed 30 April 2014">${tripDetails.DISPLAY_DATE}</time>
											<p class="flight-number">
												<strong>${tripDetails.AIRLINE_CODE} ${tripDetails.FLIGHT_NUMBER} </strong>&nbsp; <span>${tripDetails.FLIGHT_DETAIL}</span>
											</p>
											<p class="location departure">
												<p class="route">
													<span class="city">${tripDetails.B_LOCATION_NAME} 	<abbr>(${tripDetails.B_LOCATION_1})</abbr></span> <span class="dash">-</span> <span class="city">${tripDetails.E_LOCATION_NAME}<abbr>(${tripDetails.E_LOCATION_1})</abbr></span>
												</p>
												<p class="schedule">
													<time class="departure hour" datetime="07:35">${tripDetails.DEPARTURE_TIME_BSKT}</time>
													<span class="dash">-</span>
													<time class="arrival hour" datetime="11:20">${tripDetails.ARRIVAL_TIME_BSKT}</time>
													<span class="duration"> (${tripDetails.DURATION})</span>
												</p>
											</p>
										</div>
									</section>

									{if tripDetails.TRIP_TYPE == "R" }
										<section id="segmentId2">
											<div class="trip">
												<time class="date" datetime="Wed 30 April 2014">${tripDetails.DISPLAY_DATE_2}</time>
												<p class="flight-number">
													<strong>${tripDetails.AIRLINE_CODE_2} ${tripDetails.FLIGHT_NUMBER_2} </strong>&nbsp; <span>${tripDetails.FLIGHT_DETAIL_2}</span>
												</p>
												<p class="location departure">
													<p class="route">
														<span class="city">${tripDetails.B_LOCATION_NAME_2} <abbr>(${tripDetails.B_LOCATION_2})</abbr></span> <span class="dash">-</span> <span class="city">${tripDetails.E_LOCATION_NAME_2}<abbr>(${tripDetails.E_LOCATION_2})</abbr></span>
													</p>
													<p class="schedule">
														<time class="departure hour" datetime="07:35">${tripDetails.DEPARTURE_TIME_2_BSKT}</time>
														<span class="dash">-</span>
														<time class="arrival hour" datetime="11:20">${tripDetails.ARRIVAL_TIME_2_BSKT}</time>
														<span class="duration"> (${tripDetails.DURATION_2})</span>
													</p>
												</p>
											</div>
										</section>
									{/if}
								</span>
								</article>

								{set i= i+1/}
							{/for}
						{/if}
								<div class="checkoutPanel">

									{section {
										id: "chkOut",
										type: "div",
										bindRefreshTo: [
											{ to:"chkOutbtn", inside:jsonResponse.ui }
										],
										macro: {
											name: "displayChkOut",
											scope: this,
											args: [defTripDet,keyId,tripUrl]
										}
									}/}


								</div>
							</article>

				  </section>
				</div>

			<div class="mskBlue" style="display:none" >&nbsp;</div>

			<!--End of shopping cart panel-->

	{/macro}

	{macro tripCount()}
		{var cartNumber = 0 /}

		<div class="cartCount" id="cartCount">
			{var shoppingBasketCount = this.getShoppingCartBookmarkCount() /}
			<span>
				${shoppingBasketCount}
			</span>
		 <span class="icon-cart"></span>
		</div>

	{/macro}

	{macro displayChkOut(defTripDet,keyId,tripUrl)}
		{var shoppingBasketCount = this.getShoppingCartBookmarkCount() /}
		<p>
			<span class="checkOutTotal tabletMargin">${this.data.labels.tx_merci_text_booking_ins_total}:</span>
				<span class="checkOutPrice">
						<span id="currency">{if shoppingBasketCount == 1 }${defTripDet.CURRENCY}{/if}</span>
						<span id="price">{if shoppingBasketCount == 1 }${(defTripDet.PRICE).toFixed(2)}{/if}</span>
					</span>
		</p>
				<button type="button" class="validation {if shoppingBasketCount != 1 }disabled{/if}" id="checkout" rel="{if shoppingBasketCount == 1 }${tripUrl}{/if}" relId="{if shoppingBasketCount == 1 }${keyId}{/if}" {on tap {fn:'enableCheckOut', scope:this}/}>${this.data.labels.tx_merci_checkout}</button>
	{/macro}

	{macro displayShareTrip()}
		{if !this.__merciFunc.isEmptyObject(this.shareData.shareResponse)}
			{@html:Template {
				classpath: "modules.view.merci.common.templates.MShareItinerary",
				data: {
					'labels': this.data.labels,
					'rqstParams': this.data.rqstParams,
					'siteParams': this.data.siteParams,
					'shareData': this.shareData,
					'destination': this.data.destination
				}
			}/}
		{/if}
	{/macro}

{/Template}