{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MSelectAirport',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
	$hasScript: true
}}

	{var showAirport = false/}
	{var showAirportList = false/}
	{var showFavAirportList = false/}
	{macro main()}
		{section {
					id: "airportContent",
			macro: 'printAirports'


		}/}
	{/macro}
	{macro printAirports()}
		<section>
		{if showAirport == true}
			{section {
				id: "airportContentList",
				macro: 'airportList'
			}/}

		{var labels = this.moduleCtrl.airportData.MAIRPS_A.labels/}
		{var siteParameters = this.moduleCtrl.airportData.MAIRPS_A.siteParam/}
		{var gblLists = this.moduleCtrl.airportData.MAIRPS_A.globalList/}
		{if showAirportList == false}
		<section class="cust_ssel_airp">
			<form>
							{call includeError(labels)/}
					<article class="panel login">
							<header>
								<h1>${labels.tx_merci_text_booking_airportfinder_findairport}</h1>
							</header>
						<section>
									  {var match = this.__merciFunc.getStoredItem("matchItem")/}
							  <p class="user">
								<label for="input1">${labels.tx_merci_text_booking_airportfinder_searchairport}</label>
										<input id="MATCH" name="MATCH" class="inputField widthApproxFull" type="text" autocorrect="off" value="${match}" onfocus="searchFieldOnFocus('MATCH','iconspan1');" onblur="searchFieldOnBlur('MATCH','iconspan1');"/>
							  </p>
						</section>
					</article>
			<footer class="buttons">
								<button type="button" class="validation back" id="backButton" {on click {fn:"onBackClick" } /}>${labels.tx_merci_text_back}</button>
								<button type="button" class="validation" {on click {fn:"onFindAirport" } /}>${labels.tx_merci_text_booking_find}</button>
			</footer>
			</form>

		</section>
			{var favAirporLists = this.moduleCtrl.favoriteairports/}
			{if (favAirporLists != null)}
				<header>
							<h1 class="title">${labels.tx_merci_text_booking_airportfinder_favouriteairport}</h1>
				</header>

				<ul class="choose">
				{foreach airport in favAirporLists.airName}
					<li role="option" id="airport_${airport_index}" {on click {fn:"onSelectAirport",args : {airName : airport} } /}>
						<a href="javascript:void(0);">${airport}</a></span>
					</li>
				{/foreach}
				</ul>
			{/if}

		{/if}
		{/if}
	</section>
	{/macro}
	{macro airportList()}
		{if showAirportList == true}
			{var airporLists = this.moduleCtrl.airportLists.MAIRPR_A.requestParam.listOfAirports/}
			{var labels = this.moduleCtrl.airportLists.MAIRPR_A.labels/}
			<h1 class="title">${labels.tx_merci_text_booking_selectyourairport}</h1>
			<ul class="choose">
			{foreach airport in airporLists}
				<li role="option" id="airport_${airport_index}" {on click {fn:"onSelectAirport",args : {airName : airport[0]+" ("+airport[1]+") "+airport[2]+" "+airport[3]} } /}>
					<a href="javascript:void(0);">${airport[0]} (${airport[1]})${airport[2]} - (${airport[3]})</a>
				</li>

			{/foreach}
			</ul>
		{/if}
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