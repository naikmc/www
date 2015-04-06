{Template {
  $classpath:'modules.view.merci.segments.booking.templates.dealsoffers.MDealsMap',
  $hasScript : true
}}
{var printUI = false /}
{macro main()}
	{section {
		id: 'MDealsMapPage',
		macro: 'loadContent'
	}/}
{/macro}

{macro loadContent()}
	{if printUI == true}
		{var label = this.moduleCtrl.getModuleData().booking.MListOffers_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam/}
		{var gblLists = this.moduleCtrl.getModuleData().booking.MListOffers_A.globalList/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam/}	
		/* {var defaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry')/}
		{var client = this.moduleCtrl.getValuefromStorage('client')/} */

		<section id="dealMap" class="deals">
			<nav class="tabs">
				<ul>
					<li id="t1" {on click "onListDisplayClick"/}><a href="javascript:void(0)" class="navigation listView">${label.ListView}</a></li>
					<li id="t2"><a  href="javascript:void(0)" class="navigation active mapView dealsMap">${label.MapView}</a></li>
				</ul>		
			</nav>

			<div class="mapBody">
				<div id="map">
				</div>
			</div>
			<div class="popup" id="htmlContainer" style="display: none;">
				<div id="htmlPopup" style="height: 500px; overflow: hidden;">
					<ul class="dealDetails">
						{foreach currentOperational in rqstParams.listofferbean.offers}
							{var offerId = currentOperational.offerId/}
							<li class=${currentOperational.destinationLocationCode} style="display:none;">
								<a class="noUnderline" offerId=${offerId}>
									<div class="bluePatch" {on click {fn: 'showClickSingleOffer', args: currentOperational.destinationLocationCode}/}>
										<span>${currentOperational.originLocationCode}</span> - <span>${currentOperational.destinationLocationCode}</span> <span class="deals-price">${currentOperational.currency} ${currentOperational.price}</span> <span class="arrow"></span>
									</div>
								</a>
							</li>
						{/foreach}
					</ul>
				</div>
				<button type="button" class="close" {on click {fn: 'onCloseClick'}/}><span>Close</span></button>
			</div>
		</section>
	{/if}
{/macro}
{/Template}