{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.rebook.MPreviousItinerary",
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro main()}
		{section {
			type: 'div',
			id: 'messages',
			macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
			bindRefreshTo: [{inside: this.data, to: 'messages'}]
		}/}

		<article class="panel itnr_article">
			{var sectionIds = this.getSectionIds() /}
			<header>
				<h1>
					${this.data.labels.tx_merci_atc_rbk_org_itinarary}
					<button id="prevItinToggle" type="button" class="toggle"
							aria-expanded="false" aria-controls="section_itinerary"
							{on click {fn: this.utils.toggleSection, scope: this.utils, args:{sectionId:"section_itinerary", buttonId:"prevItinToggle"}} /}>
						<span>Toggle</span>
					</button>
				</h1>
			</header>
			<section class="trip" id="section_itinerary" aria-hidden="true" aria-expanded="false">
				{var date = ""/}
				{var hours = ""/}
				{var minutes = ""/}
				{var arr = ""/}
				{var dateParams = ""/}
				{var dtObj = ""/}
				{foreach itinerary in this.data.rqstParams.oldItinerary.itineraries}
					<div class={if (itinerary_index == 0)}"departure" {elseif (itinerary_index == 1)/} "return" {/if}>
					{if (itinerary_index == 0)}
						<h2>${this.data.labels.tx_merci_text_booking_departureflight}</h2>
					{elseif (itinerary_index == 1)/}
						<h2>${this.data.labels.tx_merci_text_booking_returnflight}</h2>
					{/if}
					{foreach segment in itinerary.segments}
						  <p class="flight-number"><strong>${segment.airline.code}${segment.flightNumber}</strong></p>
						  <p class="location"> <span class="city">${segment.beginLocation.cityName}</span> <abbr>(${segment.beginLocation.locationCode})</abbr> <span class="dash">-</span> <span class="city">${segment.endLocation.cityName}</span> <abbr>(${segment.endLocation.locationCode})</abbr> </p>
						  <p class="schedule">
							{set dateParams = segment.beginDateBean.jsDateParameters.split(',')/}
							{set dtObj = new Date(dateParams[0],dateParams[1],dateParams[2],dateParams[3],dateParams[4],dateParams[5])/}
							<time datetime="2012-03-31" class="date">${utils.formatDate(dtObj,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)}</time>
							{var segBegDate = segment.beginDate/}
							{set arr = segBegDate.split(" ")/}
							{set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
							{var hours = date.getHours()/}
							{if hours < 10}
								{set hours = '0' + hours/}
							{/if}
							{var minutes = date.getMinutes()/}
							{if minutes < 10}
								{set minutes = '0' + minutes/}
							{/if}
							
							<time datetime="2012-03-31" class="departure hour">${hours}:${minutes}</time>
							<span class="dash">-</span>
							{var segendDate = segment.endDate/}
							{set arr = segendDate.split(" ")/}
							{set date = new Date(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[5])/}
							{set hours = date.getHours()/}
							{if hours < 10}
								{set hours = '0' + hours/}
							{/if}
							{set minutes = date.getMinutes()/}
							{if minutes < 10}
								{set minutes = '0' + minutes/}
							{/if}
							
							<time datetime="2012-03-31" class="arrival hour">${hours}:${minutes}</time>
							{if (segment.nbDaysBetweenDepAndArrDates > 0)}
								&nbsp;+${segment.nbDaysBetweenDepAndArrDates}${this.data.labels.tx_day_s}
							{/if}
						  </p>
					{/foreach}
					</div>
				{/foreach}
			</section>
		</article>
  {/macro}
{/Template}