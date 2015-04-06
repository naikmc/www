{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiItineraryRecap',
	$dependencies: [
	  'modules.view.merci.common.utils.MCommonScript',
	   'modules.view.merci.segments.booking.scripts.MBookingMethods'
	]
}}

	{macro main()}
		{var labels = this.data.labels/}
		{var rqstParams = this.data.rqstParams/}
		{var utils = modules.view.merci.common.utils.MCommonScript/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}

			<article class="panel itnr_article">
				<header>
					<h1>${labels.tx_merci_text_booking_apis_selected_itinerary}
					  <button type="button" class="toggle" aria-expanded="true" data-aria-controls="section1" id ="itinerary" {on click {fn:'toggle', scope: modules.view.merci.segments.booking.scripts.MBookingMethods, args : {ID1 : 'itinerary'}} /}><span>Toggle</span></button>
					</h1>
				</header>
				<section class="trip" id="section_itinerary" data-aria-hidden="false">
					{var date = ""/}
					{var hours = ""/}
					{var minutes = ""/}
					{var arr = ""/}
					{var dateParams = ""/}
					{var dtObj = ""/}

					{foreach itinerary in rqstParams.listItineraryBean.itineraries}
						<div class={if !merciFunc.isEmptyObject(rqstParams.requestBean.TRIP_TYPE) && (rqstParams.requestBean.TRIP_TYPE.indexOf("C") != -1 || rqstParams.requestBean.TRIP_TYPE.indexOf("M") != -1) } "departure"{elseif (itinerary_index == 0)/}"departure" {elseif (itinerary_index == 1)/} "return" {/if}>
						{if !merciFunc.isEmptyObject(rqstParams.requestBean.TRIP_TYPE) && (rqstParams.requestBean.TRIP_TYPE.indexOf("C") != -1 || rqstParams.requestBean.TRIP_TYPE.indexOf("M") != -1) }
							<h2>${labels.tx_merciapps_flight} ${parseInt(itinerary_index)+1}</h2>
						{elseif (itinerary_index == 0)/}
							<h2>${labels.tx_merci_text_booking_departureflight}</h2>
						{elseif (itinerary_index == 1)/}
							<h2>${labels.tx_merci_text_booking_returnflight}</h2>
						{/if}
						{foreach segment in itinerary.segments}
							  <p class="flight-number"><strong>${segment.airline.code}${segment.flightNumber}</strong></p>
							  <p class="location"> <span class="city">${segment.beginLocation.cityName}</span> <abbr>(${segment.beginLocation.locationCode})</abbr> <span class="dash">-</span> <span class="city">${segment.endLocation.cityName}</span> <abbr>(${segment.endLocation.locationCode})</abbr> </p>
							  <p class="schedule">
								{set dateParams = segment.beginDateBean.jsDateParameters.split(',')/}
								{set dtObj = new Date(dateParams[0],dateParams[1],dateParams[2],dateParams[3],dateParams[4],dateParams[5])/}
								<time datetime="2012-03-31" class="date">${utils.formatDate(dtObj,labels.tx_merci_pattern_DayDateFullMonthYear)}</time>
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
									&nbsp;+${segment.nbDaysBetweenDepAndArrDates}${labels.tx_day_s}
								{/if}
							  </p>
						{/foreach}
						</div>
					{/foreach}
				</section>
			</article>
	{/macro}
{/Template}