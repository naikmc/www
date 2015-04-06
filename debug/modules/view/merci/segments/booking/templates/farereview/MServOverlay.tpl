{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MServOverlay',
}}

	{macro main()}
		{if this.data.rqstParams != null && this.data.labels != null}
			{foreach itinerary in this.data.rqstParams.listItineraryBean.itineraries}
				<div class= "popup displayNone" id = "servicelevels_${itinerary_index}">
					{if itinerary.fareFamily != null && itinerary.fareFamily.name != null && itinerary.fareFamily.name != ''}
						<article class="panel">
							<header>
								<hgroup>
									<h1>${this.data.labels.tx_merci_text_booking_conf_servicelevel}</h1>
									<h2>
										<span class="label">${itinerary.fareFamily.name}</span>
										<span class="data">${itinerary.fareFamily.code}</span>
									</h2>
								</hgroup>
							</header>
							<dl>
								<dt>${itinerary.fareFamily.condition.shortDescription}</dt>
								<dt>${itinerary.fareFamily.condition.fullDescription}</dt>
							</dl>
						</article>
					{/if}
					<button type="button" class="close" {on click {fn:'closePopup', scope:modules.view.merci.common.utils.MCommonScript}/}><span>Close</span></button>
				</div>
			{/foreach}
		{/if}
	{/macro}
	
{/Template}