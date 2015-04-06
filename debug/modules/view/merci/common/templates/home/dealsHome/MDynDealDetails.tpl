{Template {
  $classpath: "modules.view.merci.common.templates.home.dealsHome.MDynDealDetails",
  $macrolibs: {common: 'modules.view.merci.common.utils.MerciCommonLib'},
  $hasScript: true
}}

	{var showFareCond = false/}
	{macro main()}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam/}
		{var labels = this.moduleCtrl.getModuleData().booking.MFACS_A.labels/}
		<div class="dealDetails">
			<nav>
				<ul>
					<li>
						<button type="button" class="back dynamicB" id="backbtn" {on click {fn: "goBack", scope: this} /}><span >Back</span></button>
					</li>
				</ul>
			</nav>			
			{var myVar = 0/}
			{if this.bookmarkedOfferList != null && this.bookmarkedOfferList.length > 0}
				{for var i = 0;i< this.bookmarkedOfferList.length;i++}
					{if this.bookmarkedOfferList[i] == rqstParams.selectedOfferBean.offerId}
						{set myVar = 1/}
					{/if}
				{/for}	
			{/if}	
			<button class="bookmark dynDealBookmark {if (myVar == 1)}bookmarked{/if}" role="checkbox" onclick="return false;" {on click {fn:"onDealBookmark",args : {offerId : rqstParams.selectedOfferBean.offerId, offerData:rqstParams.selectedOfferBean} } /}></button>
			<hgroup><h2>${rqstParams.dest_city_name}</h2><h3><span class="price-new"><abbr>${rqstParams.selectedOfferBean.currency} </abbr><span>${rqstParams.selectedOfferBean.price}</span><span></span></span></h3></hgroup>
			
			{section {
				id: "dealsFareCondSection",
				macro: {name: 'dealsFareCondSection'}
			}/}	
		</div>
		<div class="mask" {id 'bookmarksAlertOverlay' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${labels.tx_merciapps_item_added}</h3>
				<p id="dialogueContent2">${labels.tx_merci_available_favourite}</p>
				<button type="button" {on click {fn:"toggleBookmarkAlert", args:{id:'added'}} /}>${labels.tx_merciapps_ok}</button>
			</div>
		</div>
		<div class="mask" {id 'bookmarksAlertOverlay1' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${labels.tx_merciapps_item_deleted}</h3>
				<button type="button" {on click {fn:"toggleBookmarkAlert", args:{id:'deleted'}} /}>${labels.tx_merciapps_ok}</button>
			</div>
		</div>
	{/macro}	
	{macro dealsFareCondSection()}
		{if (showFareCond)}
			{var labels = this.moduleCtrl.getModuleData().booking.MFACS_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MFACS_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MFACS_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam/}
			{var paxFlag = 0/}
				
				<dl class="DynamicHomedeals">
					<dt>${labels.tx_merci_deals_minimum_passenger}</dt>
					<dd>
						<li>
						{if this.isPaxExist('ADT')}
							{set paxFlag = 1/}
							{var adultVal = rqstParams.selectedOfferBean.paxRestrictions.ADT.min/}
							{if (adultVal != -1)}
								${adultVal}&nbsp;${labels.tx_merci_text_booking_review_pb_adults},
							{/if}
						{/if}
						{if this.isPaxExist('CHD')}
							{set paxFlag = 1/}
							{var childVal = rqstParams.selectedOfferBean.paxRestrictions.CHD.min/}
							{if (childVal != -1)}
								&nbsp;${childVal}&nbsp;{if childVal == 1}${labels.tx_merci_text_booking_child}{else/}${labels.tx_merci_text_booking_review_pb_children}{/if}
							{/if}
						{/if}
						{if this.isPaxExist('INF')}
							{set paxFlag = 1/}
							{var infVal = rqstParams.selectedOfferBean.paxRestrictions.INF.min/}
							{if (infVal != -1)}
								,&nbsp;${infVal}&nbsp;{if infVal == 1}${labels.tx_merci_text_booking_alpi_infant}{else/}${labels.tx_merci_text_booking_review_pb_infants}{/if}
							{/if}
						{/if}
						{if this.isPaxExist('YCD')}
							{set paxFlag = 1/}
							{var ycdVal = rqstParams.selectedOfferBean.paxRestrictions.YCD.min/}
							{if (ycdVal != -1)}
								,&nbsp;${ycdVal}&nbsp;{if ycdVal == 1}${labels.tx_mc_text_addPax_snr}{else/}${labels.tx_mc_text_addPax_snrs}{/if}
							{/if}
						{/if}
						{if this.isPaxExist('STU')}
							{set paxFlag = 1/}
							{var stuVal = rqstParams.selectedOfferBean.paxRestrictions.STU.min/}
							{if (stuVal != -1)}
								,&nbsp;${stuVal}&nbsp;{if stuVal == 1}${labels.tx_mc_text_addPax_stdnt}{else/}${labels.tx_mc_text_addPax_stdnts}{/if}
							{/if}
						{/if}
						{if this.isPaxExist('YTH')}
							{set paxFlag = 1/}
							{var ythVal = rqstParams.selectedOfferBean.paxRestrictions.YTH.min/}
							{if (ythVal != -1)}
								,&nbsp;${ythVal}&nbsp;{if ythVal == 1}${labels.tx_mc_text_addPax_yth}{else/}${labels.tx_mc_text_addPax_yths}{/if}
							{/if}
						{/if}
						{if this.isPaxExist('MIL')}
							{set paxFlag = 1/}
							{var milVal = rqstParams.selectedOfferBean.paxRestrictions.MIL.min/}
							{if (milVal != -1)}
								,&nbsp;${milVal}&nbsp;{if milVal == 1}${labels.tx_mc_text_addPax_mlty}{else/}${labels.tx_mc_text_addPax_militaries}{/if}
							{/if}
						{/if}
						{if (paxFlag == 0)}
							2&nbsp;${labels.tx_merci_text_pax}
						{/if}
						</li>
					</dd>
					<dt>${labels.tx_merci_deals_cabin_class}</dt>
					{var cabinClass = rqstParams.selectedOfferBean.cabinClass/}
					<dd>
						{if (cabinClass == "")}
							<li>${labels.tx_merci_text_none}</li>
						{elseif (cabinClass == "Y" || cabinClass == "E" || cabinClass == "N" || cabinClass == "R") /}
							<li>${labels.tx_merci_ts_search_Economy}</li>
						{elseif (cabinClass == "J" || cabinClass == "B") /}
							<li>${labels.tx_merci_ts_search_Business}</li>
						{elseif (cabinClass == "P" || cabinClass == "F") /}
							<li>${labels.tx_merci_ts_search_First}</li>
						{/if}
					</dd>
					<dt>${labels.tx_merci_text_minstay}</dt>
					{var minStay = rqstParams.selectedOfferBean.minimumStay/}
					{var minStayUnit = rqstParams.selectedOfferBean.minimumStayUnit/}
					<dd>
						{if (minStay == "" || minStay == 0)}
							<li>${labels.tx_merci_text_none}</li>
						{else/}
							<li>${rqstParams.selectedOfferBean.minimumStay}&nbsp;
							{if (minStayUnit == "D") }
								${labels.tx_merci_text_days}
							{elseif (minStayUnit == "W" ) /}
								${labels.tx_merci_text_weeks}
							{else/}
								${labels.tx_merci_text_months}
							{/if}
							</li>
						{/if}
					</dd>
					<dt>${labels.tx_merci_text_maxstay}</dt>
					{var maxStay = rqstParams.selectedOfferBean.maximumStay/}
					{var maxStayUnit = rqstParams.selectedOfferBean.maximumStayUnit/}
					<dd>
						{if (maxStay == "" || maxStay == 0)}
							<li>${labels.tx_merci_text_none}</li>
						{else/}
							<li>${rqstParams.selectedOfferBean.maximumStay}&nbsp;
							{if (maxStayUnit == "D") }
								${labels.tx_merci_text_days}
							{elseif (maxStayUnit == "W" ) /}
								${labels.tx_merci_text_weeks}
							{else/}
								${labels.tx_merci_text_months}
							{/if}
							</li>
						{/if}
					</dd>
					<dt>${labels.tx_merci_deals_advance_purchase}</dt>
					{var adPurc = rqstParams.selectedOfferBean.advancedPurchase/}
					<dd>
						{if (adPurc == "" || adPurc == 0)}
							<li>${labels.tx_merci_text_none}</li>
						{else/}
							<li>${rqstParams.selectedOfferBean.advancedPurchase}&nbsp;${labels.tx_merci_text_days}</li>
						{/if}
					</dd>
					<dt>${labels.tx_dls_travel_completion_date}</dt>
					{var endDt = this.moduleCtrl.getValuefromStorage("TRAVEL_END_DATE")/}
					<dd>
						<li>${endDt}</li>
					</dd>
					<dt>${labels.tx_merci_deals_outbound_travel_period}</dt>
					<dd><li id="travelPeriod"></li></dd>
					<dt>${labels.tx_merci_deals_special_conditions}</dt>
					<dd><li>${rqstParams.dbean.specialCondition}</li></dd>
					<dt>${labels.tx_merci_deals_other_conditions}</dt>
					<dd><li>${rqstParams.dbean.otherCondition}</li></dd>
				</dl>
				<div class="actions">					
					<button class="continue" {on click {fn:"onOfferClick",args : {ID : rqstParams.selectedOfferBean.offerId} }/}>Book</button>					
				</div>
		{/if}
	{/macro}

{/Template}