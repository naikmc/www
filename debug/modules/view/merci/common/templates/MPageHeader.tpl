{Template {
		$classpath: 'modules.view.merci.common.templates.MPageHeader',
		$hasScript: true,
		$macrolibs: {
			autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
		}
}}

	{macro main()}
		
		${this.headerData = {}|eat}
		{if jsonResponse.data != null 
			&& jsonResponse.data.header != null}
			${this.headerData = jsonResponse.data.header|eat}
		{/if}
			
		{section {
			id: 'header',
			type: 'div',
			macro : {
				name: 'printHeader'
			}
		}/}

		{if this.headerData != null && this.headerData.loyaltyInfoBanner != null}
			{section {
				id: 'bannerLoyaltyInfo',
				type: 'div',
				macro : {
					name: 'bannerLoyalty',
					args : [this.headerData.loyaltyInfoBanner]
				}
			}/}
		{/if}
	{/macro}

	{macro printHeader()}
		{var client = this.urlManager.getBaseParams()[14]/}
		{if (client == null || client == '') && this.headerData != null}
			<div class="top{if this._isSmartBannerLoaded()} top-app-banner{/if}">
				<header class="banner">
					{if this.isSideNavBarEnabled()}
						<div class="sb-toggle sb-toggle-${application.navbarAlignment()}">
							<div class="navicon-line"></div>
							<div class="navicon-line"></div>
							<div class="navicon-line"></div>
						</div>
					{/if}
					<h1 {on tap {fn:'goHome', scope:this, args: {homeURL: this.headerData.homePageURL}}/} id="bannerLogo">
						<span>${this.headerData.title}</span>
					</h1>
					{if !this.utils.isEmptyObject(this.headerData.selectedServices) && this.headerData.selectedServices.count>0}
						{call createServicesBasket(this.headerData.selectedServices)/}
					{/if}
					{if this.headerData.showButton == true}
						<nav>
							<ul>
								<li>
									{if this.utils.isRequestFromApps() && !this.utils.isEmptyObject(this.headerData.manualBackURL)}
										<button type="button" class="back" id="backbtn" {on click {fn:'goManualBack', scope:this, args: {manualBackURL: this.headerData.manualBackURL}}/}><span>Back</span></button>
									{else/}
										<button type="button" class="back" id="backbtn" {on click {fn:'goBack', scope: this.moduleCtrl}/}><span>{if this.headerData.backBtnLabel} ${this.headerData.backBtnLabel}{else/} Back{/if}</span></button>
									{/if}
								</li>
							</ul>
						</nav>
					{/if}

					{if this.headerData.showSearch == true}
						<nav class="otherFeaturesSearch hidden">
							 <ul>
								<li class="Lense" {on click {fn: 'onSearchClick', scope: this}/}>Search</li>
							</ul>
						</nav>
					{/if}

					{call createToolButton()/}
				</header>

				{var bannerHtml = headerData.bannerHtml/}
				{if bannerHtml!=null && bannerHtml.length>0}
					<div>${bannerHtml|escapeForHTML:false}</div>
				{/if}
			</div>

			{if this.headerData != null 
				&& this.headerData.currencyConverter != null 
				&& this.headerData.currencyConverter.showButton && this.headerData.currencyConverter.newPopupEnabled!=true}
				{call currencyConverter()/}
			{/if}
		{/if}
	{/macro}

	{macro createServicesBasket(items)}
		<nav class="otherFeatures">
	      <ul>
	        <li class="CemShoping" id="CemShopingLi" {on tap {fn: items.scope.toggleCemShopping, scope: items.scope} /}><span id="CemShoping">${items.count}</span></li>
	      </ul>
	    </nav>
	{/macro}
	

	{macro createToolButton()}
		{if this.headerData.headerButton != null
			&& this.headerData.headerButton.button != null
			&& !this.utils.isEmptyObject(this.headerData.headerButton.button)}
			{var shareButton = false /}
					<button type="button" class="tools{if this.isSideNavBarEnabled() && application.navbarAlignment() == 'right'} tools-extra-right{/if}" role="button" aria-controls="tools-buttons-group"><i class="icon-cog"></i> <span>Tools</span></button>
					<div id="tools-buttons-group" class="tools-box{if this.isSideNavBarEnabled() && application.navbarAlignment() == 'right'} tools-box-extra-right{/if}" aria-expanded="false" style="display:none;">
						<ul>


					{if this.headerData.headerButton.button != null}

						{for var i = 0; i < this.headerData.headerButton.button.length; i++}

							{if this.headerData.headerButton.button[i]=="login"}

									<li>
										<button type="button" class="login" data-type="log" {on click {fn:'userButton', scope: this}/}>
											<i class="{if headerData.headerButton.loggedIn ==false}icon-loginkey{else/}icon-logoutkey{/if}"></i>
											<span>login</span>
										</button>
									</li>

							{elseif this.headerData.headerButton.button[i] == "shareButton"/}
									<li>
										<button type="button" class="share"  aria-controls="share-buttons-group1">
											<i class="icon-socialmedia"></i>
											<span>Share</span>
										</button>
									</li>
								{set shareButton = true/}
							{elseif this.headerData.headerButton.button[i]=="takePhotoButton"/}
									<li>
									<button type="button" class="camera" data-type="log" {on click {fn:'takePhoto', scope: this.headerData.headerButton.scope}/}>
											<i class="icon-takePhoto"></i>
											<span>trip</span>
										</button>
									</li>
							{elseif this.headerData.headerButton.button[i]=="tripPhotoButton"/}
									<li>
									<button type="button" class="viewPhoto" data-type="log" {on click {fn:'showTripPhotos', scope: this.headerData.headerButton.scope}/}>
											<i class="icon-tripPhotos"></i>
											<span>trip</span>
										</button>
									</li>
							{elseif this.headerData.headerButton.button[i]=="calendarButton"/}
									<li>
									<button type="button" class="addCalender" data-type="log" {on click {fn:'addTripToCalendar', scope: this.headerData.headerButton.scope}/}>
											<i id="calenderView" class="{if headerData.headerButton.showCalendar == false}icon-addcalendar{else/}icon-viewcalendar{/if}"></i>
											<span>calendar</span>
										</button>
									</li>
							{elseif this.headerData.headerButton.button[i]=="rfrshButton"/}
									<li>
									<button type="button" class="refreshHeader" data-type="log" {on click {fn:'refreshPageinfo', scope: this.headerData.headerButton.scope}/}>
											<i class="icon-refresh"></i>
											<span>refresh</span>
										</button>
									</li>
							{elseif this.headerData.headerButton.button[i] == "CART" /}
								{section {
									id: 'cartIcon',
									type:'li',
									macro : {
										name: 'shoppingCart'
									},
									bindRefreshTo : [{
										to : "cntBookMark",
										inside : this.headerBadge,
										recursive : true
									}]
								}/}
							{elseif this.headerData.headerButton.button !=undefined && this.headerData.headerButton.button[i]=="bkmkButton"/}
								<li>
									<button type="button" id="favButton" role="checkbox" class="bookmarkHeader" aria-checked="{if this.headerData.headerButton.myVar == '0' || ((typeof(pageObjBkMK) !="undefined") && (pageObjBkMK.myVar =='0')) ||((typeof(pageFlightInfo) !="undefined") && (pageFlightInfo.myVar =='0')) }false{else/}true{/if}"  {on click {fn:'onMyFavoriteClick', args:{headerData:this.headerData}, scope: this}/}>
										<i></i>
										<span>Bookmark</span>
									</button>
								</li>
							{/if}
						{/for}
					{/if}
					{if this.headerData.currencyConverter != null && this.headerData.currencyConverter.showButton}
								<li>
									<button type="button" data-type="cc" {on click {fn:'openConverter', scope: this}/}>
										<i class="icon-currency-converter"></i>
										<span>Currency</span>
									</button>
								</li>
							{/if}

							<li>
								<button type="button" id="closeToolId" class="closeTool" role="button" aria-controls="tools-buttons-group"><i class="icon-close"></i></button>
							</li>
				
				</ul>
				</div>			 
				{if shareButton !=undefined && shareButton==true}
					<div id="share-buttons-group1" class="tools-box share hideShare">
							{var isMobileApp = this.utils.isRequestFromApps() /}
							{if isMobileApp == true}
								{if this.headerData.headerButton.shreButton != null}
									{for var i = 0; i < this.headerData.headerButton.shreButton.length; i++}
										<li>
											<button type="button" class="socialData" id=${this.headerData.headerButton.shreButton[i][0]}  data-title=${this.headerData.headerButton.shreButton[i][0]}  data-type=${this.headerData.headerButton.shreButton[i][1]}	{on click {fn:'shareTrip', args: {id:headerData.headerButton.shreButton[i][0]}, scope: this.headerData.headerButton.scope}/}>
												<i class=${this.headerData.headerButton.shreButton[i][2]}></i>
											</button>
										</li>
									{/for}
								{/if}
							{else/}
								{if this.headerData.headerButton.shreButton != null}
									{for var i = 0; i < this.headerData.headerButton.shreButton.length; i++}
										<li>
											{if headerData.headerButton.shreButton[i][0] == 'GOOGLEPLUS'}
												{var googlePlusData = headerData.headerButton.shareData /}
												{if googlePlusData !=  null}
													<button
														class="g-interactivepost"
														data-contenturl='${googlePlusData.link}'
														data-callback="googlePlusInit"
														data-clientid='${googlePlusData.apiKey}'
														data-cookiepolicy="single_host_origin"
													 	data-prefilltext= '${googlePlusData.description}'
														data-calltoactionlabel="OPEN"
													 	data-calltoactionurl='${googlePlusData.link}'
													 	type="button"
													 	id=${headerData.headerButton.shreButton[i][0]}
													 	data-title=${headerData.headerButton.shreButton[i][0]}
														data-type=${headerData.headerButton.shreButton[i][1]}>
														<i class=${headerData.headerButton.shreButton[i][2]}></i>
													</button>
												{/if}
											{else/}
													<button
														type="button"
														id=${headerData.headerButton.shreButton[i][0]}
													data-title=${headerData.headerButton.shreButton[i][0]}
													data-type=${headerData.headerButton.shreButton[i][1]}
													{on click {fn:'shareTrip', args: {id:headerData.headerButton.shreButton[i][0]}, scope: headerData.headerButton.scope}/}>
													<i class=${headerData.headerButton.shreButton[i][2]}></i>
												</button>
											{/if}
										</li>
										{if i == headerData.headerButton.shreButton.length-1}
											<li>
												<button type="button" role="button"  id="closeShare" 	{on click {fn:'cancelShare', args: {id:"close"}, scope: headerData.headerButton.scope}/}><i class="icon-share-close"></i></button>
											</li>
										{/if}
									{/for}
								{/if}
								{if headerData.headerButton.shreButton != null
									&& i == headerData.headerButton.shreButton.length-1}
									<li>
										<button
											type="button"
											role="button"
											id="closeShare"
											{on click {fn:'cancelShare', args: {id:"close"}, scope: headerData.headerButton.scope}/}>
											<i class="icon-share-close"></i>
										</button>
									</li>
								{/if}
							{/if}
					</div>
				{/if}
		 {/if}
	{/macro}

	{macro bannerLoyalty(loyaltyInfo) }
			{set loyaltyInfo = jsonResponse.data.loyaltyBannerData/}
      		{if !this.utils.isEmptyObject(loyaltyInfo)}
	            <article class = "panel userInformation" >
				<ul id="bannerPanel" {on tap {fn:'change', scope: this }/}>
	                     <li>{if (loyaltyInfo.PREF_AIR_FREQ_OWNER_TITLE_1_1)} ${loyaltyInfo.PREF_AIR_FREQ_OWNER_TITLE_1_1} {/if}
                     		{if (loyaltyInfo.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1)} ${loyaltyInfo.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1} {/if}
	                     		{if (loyaltyInfo.PREF_AIR_FREQ_OWNER_LASTNAME_1_1)} ${loyaltyInfo.PREF_AIR_FREQ_OWNER_LASTNAME_1_1} {/if} </li>
					{if (loyaltyInfo.PREF_AIR_FREQ_MILES_1_1)}
						<li>
							${loyaltyInfo.tx_merci_li_youHave} ${loyaltyInfo.PREF_AIR_FREQ_MILES_1_1} ${loyaltyInfo.tx_merci_li_miles}
						</li>
					{/if}
	                     			<li>
	                     				{if (loyaltyInfo.PREF_AIR_FREQ_AIRLINE_1_1)} ${loyaltyInfo.PREF_AIR_FREQ_AIRLINE_1_1} {/if}
						{if (loyaltyInfo.PREF_AIR_FREQ_NUMBER_1_1)} ${loyaltyInfo.PREF_AIR_FREQ_NUMBER_1_1} {/if}
					</li>
	                     <li> {if (loyaltyInfo.PREF_AIR_FREQ_LEVEL_1_1)} ${loyaltyInfo.tx_merci_li_tier} ${loyaltyInfo.PREF_AIR_FREQ_LEVEL_1_1} {/if}</li>
             		   </ul>
				<div class="animationText" id="strip" {on tap {fn:'change', scope: this }/}>
             		        <span id = "spanStrip"></span>
                	</div>
           		</article>
     		{/if}
	{/macro}

	{macro currencyConverter()}
		<article {id "currCvtr"/} class="panel currencyConverter"> 
			{var currData = this.headerData.currencyConverter/}

			<header>
				<h1>${currData.labels.tx_merci_currency_converter}</h1>
			</header>
			<div class="msg warning messageB error" id="convErrDiv" style="display: none;">
				<ul><li id="errMsg"></li></ul>
			</div>
			<section class="formConverter">
				<span class="originalCurrency"><span class="title">${currData.labels.tx_merci_org_currency}</span>${currData.name} (${currData.code})</span>
				<div class="onoffswitch cConverter">
					<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
					<label class="onoffswitch-label" for="myonoffswitch">
						<div class="onoffswitch-inner">
							<div id="orgCurrency" class="onoffswitch-active">&nbsp;{if currData.currentPage.currCode!=""}${currData.currentPage.currCode}{elseif localStorage.getItem('convCurrency') != null/}${localStorage.getItem('convCurrency')}{else/}${currData.code}{/if}</div><div id="currCurrency" class="onoffswitch-inactive">&nbsp;${currData.code}</div>
						</div>
						<div class="onoffswitch-switch"></div>
					</label>
				</div>
				<div class="location">
					{var defValue = ''/}
					{if localStorage.getItem('orgCurrency') != null
							&& localStorage.getItem('convCurrency') != null
							&& localStorage.getItem('orgCurrency') != localStorage.getItem('convCurrency')}
						{set defValue = localStorage.getItem('convCurrency')/}
					{/if}
					{call autocomplete.createAutoComplete({
						name: 'newCurrency',
						id: 'newCurrency',
						type: 'text',
						labelText: currData.labels.tx_merci_sel_currency,
						value: defValue,
						source: this.getCurrencyConversionSource(currData)
					})/}
				</div>
			</section>

			<footer class="buttons">
				<button type="submit" {on click {fn: 'applyCurrency', args: {currData: currData}}/} class="validation">${currData.labels.tx_merci_booking_avail_filter_apply}</button>
				<button type="submit" class="validation cancel">${currData.labels.tx_merci_cancel}</button>
			</footer>
		</article>
	{/macro}

	{macro shoppingCart()}
				<button type="button" id="cart" role="button" aria-checked="{if this.headerData.headerButton.myVar == 	'0'}false{else/}true{/if}"
					onclick="return false;" {on click {fn:'shoppingCart', scope: this}/}>
					<i class="icon-shopping-cart"><span class="shoppingCartNumber">
					{var shoppingBasketCount = this.getShoppingCartBookmarkCount() /}
					${shoppingBasketCount}
					</span></i>
				</button>
	{/macro}

{/Template}