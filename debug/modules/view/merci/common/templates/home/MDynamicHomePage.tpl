{Template {
  $classpath: "modules.view.merci.common.templates.home.MDynamicHomePage",
  $macrolibs: {
  	common: 'modules.view.merci.common.utils.MerciCommonLib',
  	dynamicTripBox: 'modules.view.merci.common.utils.home.MDynamicHomeTripBox'
  },
  $hasScript: true
}}

	{macro main()}

		{if !this.utils.isEmptyObject(this.requestParam.requestParam.DWM_SPLASH_CONTENT)}
          <div id="DWMSplashScreen" class="DWMSplashScreen">
            {@html:Template {
                classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
                data: {
                  placeholder: this.requestParam.requestParam.DWM_SPLASH_CONTENT,
                  placeholderType: "dwmContent"
                }
            }/} 
          </div>
	    {/if}
		{call navButtons()/}
		{section {
			id: "tripsSection",
			type: 'div',
		    	macro : {name: "tripsSection", scope: this},
			bindRefreshTo : [{
				to : "pnrList",
				inside : this.data
			},{
				to : "pnrToDisplay",
				inside : this.data
			}]
	      	}/}

		{if this.utils.booleanValue(this.config.allowFavorite) && !this.utils.isEmptyObject(this.jsonObj) && (!this.utils.isEmptyObject(jsonResponse.ui.cntBookMark) && jsonResponse.ui.cntBookMark>0)}
			{call favouritesSection() /}
		{/if}
		{if this.config.siteEnableRecentsearch == "TRUE" && this.config.siteSearchCount > 0 }
			{var searchCount = this._getSearchCount()/}
			{if searchCount > 0}
				{call recentSearches()/}
			{/if}
		{/if}
		{if this.utils.booleanValue(this.config.siteAllowHomeDeals)}
			{section {
				id: "dealsSection",
				type: 'div',
				macro: {name: 'dealsSection'}
			}/}
		{/if}
		{call customUISection()/}

		{var isMobileApp = this.utils.isRequestFromApps() /}
	    {if !this.data.fromMenu  && isMobileApp == true}
	      {var forceUpgradeMessage =  merciAppData.FORCE_UPGRADE_MSG /}
	      {var upgradeButtonText =  merciAppData.UPGRADE_BUTTON_TEXT /}
	      {var ignoreButtonText =  merciAppData.IGNORE_BUTTON_TEXT /}
	      {var remindMeLaterButtonText = merciAppData.REMINDMELATER_BUTTON_TEXT /}
	      <div class="mask" id ='appUpgradeOverlay'>
	        <div class="dialogue">
	          <h3 class="dialogueContent">${this.labels.tx_merciapps_upgrade}</h3>
	          <p id="dialogueContent">${this.labels.tx_merciapps_upgrade_prompt}</p>
	          <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'upgrade'}} /}>${upgradeButtonText}</button>
	          <button type="button" class="upgradeButton" class="bookCenter" {on click {fn:"handleAutoUpgrade", args:{id:'later'}} /}>${remindMeLaterButtonText}</button>
	          <button type="button" class="upgradeButton" {on click {fn:"handleAutoUpgrade", args:{id:'ignore'}} /}>${ignoreButtonText}</button>
	        </div>
	      </div>
	      <div class="mask" id='forceUpgradeOverlay'>
	        <div class="dialogue">
	          <h3 class="dialogueContent">${this.labels.tx_merciapps_upgrade}</h3>
	          <p id="dialogueContent">${forceUpgradeMessage}</p>
	          <button type="button" {on click {fn:"handleAutoUpgrade", args:{id:'force'}} /}>${upgradeButtonText}</button>
	        </div>
	      </div>
	    {/if}
	{/macro}

	{macro navButtons()}
		{var buttonNames = this.getButtons({buttons: this.globalList.customButtons})/}
		{@html:Template {
			classpath: "modules.view.merci.common.templates.MNavButtons",
			args: ['navigation', buttonNames],
			attributes: {
				classList: ['home-page']
			},
			data: {
				labels: this.labels,
				config: this.config,
				lastName: this.lastName,
				request: this.requestParam,
				pageDesc:"fromIndexPage",
				globalList: this.globalList,
				fareDeals: {
					countrySite: this.requestParam.fareDeals
				},
				isUserLoggedIn : this.IS_USER_LOGGED_IN,
				isFromMenu: false,
				isDynamicHome: true
			},
			block: true
		}/}
	{/macro}

	{macro tripsSection()}
		{if this.sortedPNRs != null && this.sortedPNRs.length>0}
			{call dynamicTripBox.tripBox(this) /}
		{/if}
	{/macro}

	{macro recentSearches()}
		{var searchList = this._getSearchList() /}
		<div id="searches" class="swipeholder">
			<h1>${this.labels.tx_merci_recent_srch}</h1>
			<div class="carrousel-header">
				<div {id 'search_dynaScroller' /} class="carrousel-content Dynamic">
					<ol id="search_olScroll">
						{for var i=0; i<searchList.len; i++}
							{var entry = JSON.parse(localStorage.getItem('From:'+searchList.arr[i])) /}
							{if !this.utils.isEmptyObject(entry.fromFull)}
                    						<li id="search_liScroll_${i}">
									<hgroup>
										<h2>${entry.fromFull} ${this.labels.tx_merci_text_booking_advs_to} ${entry.toFull}</h2>
									</hgroup>
									{var depDates = this.getFormattedDate(entry.dep_date)/}
									{var retDates = this.getFormattedDate(entry.ret_date)/}
									<p>${depDates.jsonDate} {if entry.trip_type=='roundTrip'}- ${retDates.jsonDate} {/if}</p>
									<p>
										${entry.classFull} -
										{if entry.adt > 0 }${this.labels.tx_merci_text_booking_adult} ${entry.adt}{/if}
										{if entry.chd > 0 }, ${this.labels.tx_merci_text_booking_child} ${entry.chd}{/if}
										{if entry.inf > 0 }, ${this.labels.tx_merci_text_booking_infant} ${entry.inf}{/if}
										{if entry.stu > 0 }, ${this.labels.tx_mc_text_addPax_stdnt} ${entry.stu}{/if}
										{if entry.ycd > 0 }, ${this.labels.tx_mc_text_addPax_snr} ${entry.ycd}{/if}
										{if entry.yth > 0 }, ${this.labels.tx_mc_text_addPax_yth} ${entry.yth}{/if}
										{if entry.mil > 0 }, ${this.labels.tx_mc_text_addPax_mlty} ${entry.mil}{/if}
									</p>
									<div class="actions">
										<button class="newsearch" {on click {fn:searchFlight,args:{B_LOCATION_1_SRCH:searchList.arr[i],E_LOCATION_1_SRCH:entry.to,day1:depDates.day,
											day2:retDates.day,month1:depDates.month,month2:retDates.month,CABIN_CLASS:entry.classIndex,FIELD_ADT_NUMBER:parseInt(entry.adt)-1,
											FIELD_CHD_NUMBER:entry.chd,FIELD_INFANTS_NUMBER:entry.inf, trip_type:entry.trip_type,flexi:entry.flexi}}/}>${this.labels.tx_merci_search_flight}</button>
									</div>
								</li>
							{/if}
						{/for}
					</ol>
				   </div>
				</div>
			{call common.createDynaCrumbs('search',searchList.len)/}
		</div>
	 {/macro}

	{macro dealsSection()}
		{var listParentOfferBean = this.requestParam.listofferbean/}
		{if listParentOfferBean.countryList != null}
			<div id="selectDep" class="pop">
				<h1>Select your preferred airport depature</h1>
				<input id="selectAirport" list="departure-list" placeholder="">
				<datalist id="departure-list">
					{if (listParentOfferBean.countryList.length != "0")}
						{var getExpiringMilesInfo = 0 /}
						<option value="select">${this.labels.SelCountry}</option>
						{foreach country in listParentOfferBean.countryList}
							<option value="${country.code}"
								{if this._isSelectedCountry({
									'country': country,
									'listParentOfferBean':listParentOfferBean
								})}
									selected = selected
									${this.requestParam.selectedCountry = country.name|eat}
								{/if}
							>${country.name}</option>
						{/foreach}
					{/if}
				</datalist>
			</div>
			{@html:Template {
				classpath: "modules.view.merci.common.templates.home.dealsHome.MDynHomeDeals",
				data: {
					labels : this.labels,
					siteParameters : this.config,
					gblLists : this.globalList,
					rqstParams : this.requestParam
				}
			} /}
		{/if}
	{/macro}

	{macro customUISection()}
		{if this.config.siteEnableCustom.toLowerCase() == 'true'}
			{if this.config.siteCustomType !== null
				&& this.config.siteCustomType.toLowerCase() === 'iframe'
				&& this.config.siteCustomURL !== null}
				<div {id 'iframe_wrapper'/} class="custom-wrapper">
					<object data="${this.config.siteCustomURL}" class="iframe-wrapper"></object>
				</div>
			{else/}
				<div {id 'custom_wrapper'/} class="custom-wrapper">
					${this.requestParam.customContent}
				</div>
			{/if}
		{/if}
	{/macro}

	{macro favouritesSection()}
		{if this.utils.booleanValue(this.FavSiteParams.siteEnableShareBookmark)}
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
		{var jsonFare=(this.jsonObj['RVNWFARESTATUS']||null)/}
		{var jsonTrip=(this.jsonObj['RVNWFAREINFO']||null)/}
		{var jsonDeal=(this.jsonObj['DEALSTATUS']||null)/}
		{var jsonflight=(this.jsonObj['FLIGHTSTATUS']||null)/}
		{var jsonDealMfare=(this.jsonObj['DEALFARESTATUS']||null)/}
		{var dealFareTrip=(this.jsonObj['DEALFAREINFO']||null)/}
		{var bookMarkParams=(this.jsonObj['BookMarkParameters']||null)/}
		{var servicesBookmarkData = (this.jsonObj['SERVICESCATALOG']||[]) /}
		{var adt = this.labels.tx_merci_text_booking_adult.toUpperCase() || "ADULT"/}
		{var chd = this.labels.tx_merci_text_booking_child.toUpperCase() || "CHILD"/}
		{var inf = this.labels.tx_merci_text_booking_infant.toUpperCase() || "INFANT"/}
		{var stu = this.labels.tx_mc_text_addPax_stdnt.toUpperCase() || "STUDENT"/}
		{var ycd = this.labels.tx_mc_text_addPax_snr.toUpperCase() || "SENIOR"/}
		{var yth = this.labels.tx_mc_text_addPax_yth.toUpperCase() || "YOUTH"/}
		{var mil = this.labels.tx_mc_text_addPax_mlty.toUpperCase() || "MILITARY"/}
		<div id="favourites" class="swipeholder" >
			<h1>${this.FavLabels.tx_merciapps_my_favorite}</h1>
				<div class="carrousel-header">
					<div {id 'favourites_dynaScroller' /} class="carrousel-content Dynamic">
						{set counter= 0/}
						<ol id="favourites_olScroll">
							{if this.FavSiteParams.allowBookmarkFlight == "TRUE" }
							  {if !this.utils.isEmptyObject(jsonflight)}
								{for key in jsonflight}
								  {if jsonflight.hasOwnProperty(key)}
									{var flighttrip= jsonflight[key]/}
								   <li role="option" id="favourites_liScroll_${counter}" {on longpress {fn :onLongPressBookMark,args:{"id":"delFlightButton_"+counter}}/}>
										<hgroup>
											<h2>${flighttrip.bcityName} ${this.labels.tx_merci_text_booking_advs_to} ${flighttrip.ecityName}</h2>
										</hgroup>
										<p>${flighttrip.flightNum}</p>
										<p>${flighttrip.beginDate} - ${flighttrip.beginTime} </p>
										<div class="actions">
											<button class="newsearch" {on click {fn:onFlightStatusClick, args:{"flightN":flighttrip.flightNum,"beginDate":flighttrip.beginDate,"beginYr":flighttrip.beginyr,"keyData":key, "id":"delFlightButton_"+counter}}/}>${this.labels.tx_merci_check_status}</button>
											<button id="delFlightButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onFlightDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
										</div>
										{set counter= counter+1/}
									</li>
								  {/if}
								{/for}
							  {/if}
							{/if}
							{if this.FavSiteParams["allowbookMarkRvnw"]=="TRUE"}
								{if !this.utils.isEmptyObject(jsonFare)}
									{for key in jsonFare}
										{if jsonFare.hasOwnProperty(key)}
											{var rvnwTrip= jsonFare[key]/}
											{var rvnwInfoTrip= jsonTrip[key]/}
											{var currencyFormat = this.FavSiteParams.siteCurrencyFormat /}
											{var digits = currencyFormat.length - currencyFormat.indexOf(".") - 1 /}
											{var price = rvnwTrip.PRICE/}
											{set price = parseFloat(price) /}
											{set price = price.toFixed(digits) /}
											{var depDates = this.getDateInFormat(rvnwTrip.beginDtObj)/}
											{var retDates = this.getDateInFormat(rvnwTrip.beginDtObj_2)/}
											<li role="option" id="favourites_liScroll_${counter}" {on longpress {fn :onLongPressBookMark,args:{"id":"delFareButton_"+counter}}/}>
												<hgroup>
													<h2>${rvnwTrip.B_LOCATION_NAME} ${this.labels.tx_merci_text_booking_advs_to} ${rvnwTrip.E_LOCATION_NAME}</h2>
												</hgroup>
												{if this.utils.booleanValue(this.FavSiteParams.siteEnableShareBookmark)}
													<p class="shareIcon">
														<span class="icon-share" {on click {fn:shareTrip, args:{"rvnwInfoTrip":rvnwInfoTrip, "currDT":rvnwTrip.currDT, "id":"delFareButton_"+counter,"flow":"Revenue","type":"revenue","destination":rvnwTrip.E_LOCATION_NAME}}/}></span>
													</p>
												{/if}
												<p>${depDates} {if rvnwTrip.TRIP_TYPE !="O" && !this.utils.isEmptyObject(retDates)} - ${retDates}{/if}</p>
												<p>
													{if !this.utils.isEmptyObject(rvnwTrip[adt]) && rvnwTrip[adt] > 0}${rvnwTrip[adt]} ${this.labels.tx_merci_text_booking_adult} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[chd]) && rvnwTrip[chd] > 0}${rvnwTrip[chd]} ${this.labels.tx_merci_text_booking_child} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[inf]) && rvnwTrip[inf] > 0}${rvnwTrip[inf]} ${this.labels.tx_merci_text_booking_infant} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[stu]) && rvnwTrip[stu] > 0}${rvnwTrip[stu]} ${this.labels.tx_mc_text_addPax_stdnt} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[ycd]) && rvnwTrip[ycd] > 0}${rvnwTrip[this.labels.tx_mc_text_addPax_snr]} ${ycd} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[yth]) && rvnwTrip[yth] > 0}${rvnwTrip[yth]} ${this.labels.tx_mc_text_addPax_yth} {/if}
													{if !this.utils.isEmptyObject(rvnwTrip[mil]) && rvnwTrip[mil] > 0}${rvnwTrip[mil]} ${this.labels.tx_mc_text_addPax_mlty} {/if}
													-
													${rvnwTrip.CURRENCY} ${price}
												</p>
												<div class="actions">
													<button class="newsearch" {on click {fn:onRenevnueFlowClick, args:{"rvnwInfoTrip":rvnwInfoTrip, "currDT":rvnwTrip.currDT, "id":"delFareButton_"+counter,"flow":"Revenue"}}/}>${this.labels.tx_merci_text_booking_continue}</button>
													<button id="delFareButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onFareDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
												</div>
												{set counter= counter+1/}
											</li>
										{/if}
									{/for}
								{/if}
							{/if}
							{if this.utils.booleanValue(this.FavSiteParams["allowbookMarkDeal"])}
								{if (!this.utils.isEmptyObject(jsonDeal))|| (!this.utils.isEmptyObject(jsonDealMfare))}
									{if (!this.utils.isEmptyObject(jsonDeal))}
										{for key in jsonDeal}
											{if jsonDeal.hasOwnProperty(key)}
												{var dealsTrip= jsonDeal[key]/}
												<li role="option" id="favourites_liScroll_${counter}" {on longpress {fn :onLongPressBookMark,args:{"id":"delDealButton_"+counter}}/}>
													<hgroup>
														<h2>${jsonDeal[key].origin} ${this.labels.tx_merci_text_booking_advs_to} ${jsonDeal[key].destination}</h2>
													</hgroup>
													{if this.utils.booleanValue(this.FavSiteParams.siteEnableShareBookmark)}
														<p class="shareIcon">
															<span class="icon-share" {on click {fn:shareTrip, args:{"ID":jsonDeal[key].offerID,"countrySite":jsonDeal[key].COUNTRY_SITE,"id":"delDealButton_"+counter,"flow":"Deals","type":"deals","destination":jsonDeal[key].destination}}/}></span>
														</p>
													{/if}
													<p>${jsonDeal[key].startDate} - ${jsonDeal[key].endDate} </p>
													<div class="actions">
														<button class="newsearch"  {on click {fn:onDealsOfferClick, args:{"ID":jsonDeal[key].offerID,"countrySite":jsonDeal[key].COUNTRY_SITE,"id":"delDealButton_"+counter,"flow":"Deals"}}/}>${this.labels.tx_merci_more_info}</button>
														<button id="delDealButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onDealDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
													</div>
													{set counter= counter+1/}
												</li>
											{/if}
										{/for}
									{/if}
									{if (!this.utils.isEmptyObject(jsonDealMfare))}
										{for key in jsonDealMfare}
											{if jsonDealMfare.hasOwnProperty(key)}
												{var dealTrip= jsonDealMfare[key]/}
												{var dealInfoTrip= dealFareTrip[key]/}
												{var currencyFormat = this.FavSiteParams.siteCurrencyFormat /}
												{var digits = currencyFormat.length - currencyFormat.indexOf(".") - 1 /}
												{var price = dealTrip.PRICE/}
												{set price = parseFloat(price) /}
												{set price = price.toFixed(digits) /}
												{var depDates = this.getDateInFormat(dealTrip.beginDtObj)/}
												{var retDates = this.getDateInFormat(dealTrip.beginDtObj_2)/}
												<li role="option" id="favourites_liScroll_${counter}" {on longpress {fn :onLongPressBookMark,args:{"id":"delDealButton_"+counter}}/}>
													<hgroup>
														<h2>${jsonDealMfare[key].B_LOCATION_NAME} ${this.labels.tx_merci_text_booking_advs_to} ${jsonDealMfare[key].E_LOCATION_NAME}</h2>
													</hgroup>
													{if this.utils.booleanValue(this.FavSiteParams.siteEnableShareBookmark)}
														<p class="shareIcon">
															<span class="icon-share" {on click {fn:shareTrip, args:{"dealInfoTrip":dealInfoTrip, "currDT":dealTrip.currDT, "id":"delDealButton_"+counter,"type":"revenue","destination":jsonDealMfare[key].E_LOCATION_NAME}}/}></span>
														</p>
													{/if}
													<p>${depDates} {if dealTrip.TRIP_TYPE !="O" && !this.utils.isEmptyObject(retDates)} - ${retDates}{/if}</p>
													<p>
														{if !this.utils.isEmptyObject(dealTrip[adt]) && dealTrip[adt] > 0}${dealTrip[adt]} ${this.labels.tx_merci_text_booking_adult} {/if}
														{if !this.utils.isEmptyObject(dealTrip[chd]) && dealTrip[chd] > 0}${dealTrip[chd]} ${this.labels.tx_merci_text_booking_child} {/if}
														{if !this.utils.isEmptyObject(dealTrip[inf]) && dealTrip[inf] > 0}${dealTrip[inf]} ${this.labels.tx_merci_text_booking_infant} {/if}
														{if !this.utils.isEmptyObject(dealTrip[stu]) && dealTrip[stu] > 0}${dealTrip[stu]} ${this.labels.tx_mc_text_addPax_stdnt} {/if}
														{if !this.utils.isEmptyObject(dealTrip[ycd]) && dealTrip[ycd] > 0}${dealTrip[this.labels.tx_mc_text_addPax_snr]} ${ycd} {/if}
														{if !this.utils.isEmptyObject(dealTrip[yth]) && dealTrip[yth] > 0}${dealTrip[yth]} ${this.labels.tx_mc_text_addPax_yth} {/if}
														{if !this.utils.isEmptyObject(dealTrip[mil]) && dealTrip[mil] > 0}${dealTrip[mil]} ${this.labels.tx_mc_text_addPax_mlty} {/if}
														-
														${dealTrip.CURRENCY} ${price}
													</p>
													<div class="actions">
														<button class="newsearch" {on click {fn:onRenevnueFlowClick, args:{"dealInfoTrip":dealInfoTrip, "currDT":dealTrip.currDT, "id":"delDealButton_"+counter}}/}>${this.labels.tx_merci_text_booking_continue}</button>
														<button id="delDealButton_${counter}" role="checkbox" onclick="return false;" {on click {fn:'onDealDelData',args:{"keyData":key}}/} class="favdelete delClass"</button>
													</div>
													{set counter= counter+1/}
												</li>
											{/if}
										{/for}
									{/if}
								{/if}
							{/if}
							{if this.utils.booleanValue(this.FavSiteParams["siteAllowBookmarkServices"])}
								{if !this.utils.isEmptyObject(servicesBookmarkData)}
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
										<li role="option" id="favourites_liScroll_${counter}" {on longpress {fn :onLongPressBookMark,args:{"id":"delBookmarkIcon_"+counter}}/}>
											<hgroup>
												<h2>${beginLocation} {foreach endLocation in endLocations} -
													${endLocation}
												{/foreach}</h2>
											</hgroup>
											<p>${beginDate} - {foreach endDate in endDates} ${endDate} {/foreach}</p>
											<p class="services">
												{foreach service in servicesData}
													{if service.quantity != 0}
														${service.label}(${service.quantity}),
													{/if}
												{/foreach}
											</p>
											<p>
												<span class="price">${currency.code}</span>
												<span class="price">${totalPrice.balancedAmount}</span>
											</p>
											<div class="actions">
												<button class="newsearch" {on click {fn: this.retrieveBookmark, scope: this, args:{bookmark : bookmark}} /}>${this.labels.tx_merci_text_booking_continue}</button>
												<button id="delBookmarkIcon_${counter}" role="checkbox" onclick="return false;" {on click {fn:'delServicesBookmark',args:{recordLocator :bookmark.REC_LOC}}/} class="favdelete delClass"</button>
											</div>
										</li>
										{set counter= counter+1/}
									{/foreach}
								{/if}
							{/if}
						</ol>
					</div>
				</div>
			${this.setFavouritesCounter(counter)|eat}
			{call common.createDynaCrumbs('favourites',counter)/}
		</div>
	{/macro}

	{macro displayShareTrip()}
		{if !this.utils.isEmptyObject(this.shareData.shareResponse)}
			{@html:Template {
				classpath: "modules.view.merci.common.templates.MShareItinerary",
				data: {
					'labels': this.FavLabels,
					'rqstParams': this.FavRqstParams,
					'siteParams': this.FavSiteParams,
					'shareData': this.shareData,
					'destination': this.data.destination
				}
			}/}
		{/if}
	{/macro}

{/Template}