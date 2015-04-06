{Template {
    $classpath: 'modules.view.merci.common.templates.MPageFooter',
    $dependencies: ['modules.view.merci.common.utils.MCommonScript'],
    $hasScript: true
}}

	{macro main()}
		{if (pageObjFooter.utils.isRequestFromApps() == true) && (pageObjFooter.footerData !=undefined) && (pageObjFooter.footerData.setAllowFooter !=undefined) && (pageObjFooter.utils.booleanValue(pageObjFooter.footerData.setAllowFooter)==true)}
			{section {
			  id: 'footer',
			  macro : {
				name: 'printFooter'
			  }
			}/}
		{/if}
	{/macro}

	{macro printFooter()}
		{var footerData = pageObjFooter.moduleCtrl.setFooterInfo()/}

		{if pageObjFooter.utils.isRequestFromApps()}
			<footer class="tabbar">
				<nav>
					<ul id="appline2">
						{if footerData !=undefined }
							{if footerData.setBoardingPass !=undefined && footerData.setBoardingPass =="TRUE" }
								<li class="footerButton"><a id="tabBoarding" href="javascript:void(0);" {on click {fn: 'onBoardingpassClick', scope: pageObjFooter}/} class="tab-boarding">${footerData.setBoardingLabel}</a>
									{section {
										id: 'myBoardingPassIcon',
										macro : {
											name: 'boardingPassButton'
										},
										bindRefreshTo : [{
											to : "cntBoardingPass",
											inside : pageObjFooter.footerBadge,
											recursive : true
										}]
									}/}
								</li>
							{/if}

							{if footerData.setRetrieveTrips !=undefined && footerData.setRetrieveTrips =="TRUE" }
								<li class="footerButton"><a id="tabMyTrip" href="javascript:void(0);" {on click {fn: 'onMyTripClick', scope: pageObjFooter}/} class="tab-my-trips">${footerData.setMyTripLabel}</a>
									{section {
										id: 'myTripIcon',
										macro : {
											name: 'tripButton'
										},
										bindRefreshTo : [{
											to : "cntTrip",
											inside : pageObjFooter.footerBadge,
											recursive : true
										}]
									}/}	
								</li>							
							{/if}

							<li class="footerButton"><a id="tabHome" href="javascript:void(0);" {on click {fn: 'onHomeClick', scope: pageObjFooter}/} class="tab-home">${footerData.setHomeLabel}</a></li>

							{if footerData.setFavAllow !=undefined && footerData.setFavAllow =="TRUE" }
								<li class="footerButton"><a id="tabFavourite" href="javascript:void(0);" {on click {fn: 'onMyFavClick', scope: pageObjFooter}/} class="tab-my-favourites">${footerData.setFavLabel}</a>
									{section {
										id: 'myFavoriteIcon',
										macro : {
											name: 'favButton'
										},
										bindRefreshTo : [{
											to : "cntBookMark",
											inside : pageObjFooter.footerBadge,
											recursive : true
										}]
									}/}
								</li>
							{/if}

							{if footerData.setSettingAllow !=undefined && footerData.setSettingAllow =="TRUE" }
								<li class="footerButton"><a id="tabSetting" href="javascript:void(0);" {on click {fn: 'onMoreClick', scope: pageObjFooter}/} class="tab-more">${footerData.setMoreLabel}</a></li>
							{/if}
						{/if}
					</ul>
				</nav>
			</footer>
		{/if}
	{/macro}
	
	{macro favButton()}
		{if pageObjFooter.footerBadge.cntBookMark !=undefined && pageObjFooter.footerBadge.cntBookMark > 0}
			<button class="favBadge"><span>${pageObjFooter.footerBadge.cntBookMark}</span></button>
		{/if}
	{/macro}
	
	{macro tripButton()}
		{if pageObjFooter.footerBadge.cntTrip !=undefined && pageObjFooter.footerBadge.cntTrip > 0}
			<button class="tripBadge"><span>${pageObjFooter.footerBadge.cntTrip}</span></button>
		{/if}
	{/macro}

	{macro boardingPassButton()}
		{if pageObjFooter.footerBadge.cntTrip !=undefined && pageObjFooter.footerBadge.cntBoardingPass > 0}
			<button class="tripBadge"><span>${pageObjFooter.footerBadge.cntBoardingPass}</span></button>
		{/if}
	{/macro}
	
{/Template}