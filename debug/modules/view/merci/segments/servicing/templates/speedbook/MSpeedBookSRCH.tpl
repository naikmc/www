{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.speedbook.MSpeedBookSRCH",
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}
{macro main()}
	{call common.showBreadcrumbs(1)/}
	<div class="msg warning messageB error" id="convErrDiv" style="display: none;">
        <ul><li id="errMsg"></li></ul>
  </div>
	<section class="tabletPanel">
		<form id="speedBookSearch" {on submit {fn : 'onSpeedBookSRCH' } /}>

			<article class="panel">
	            <header>
	              <h1>${this.data.labels.tx_merci_text_booking_passenger}</h1>
	            </header>
	            <section id="section3" data-aria-hidden="false">
	            	{foreach traveller inArray this.travellersInfo}
	              		<p><span><strong>${traveller.identityInformation.titleName} ${traveller.fullName}</strong></span></p>
	              		{var type = "TRAVELLER_TYPE_"+traveller_ct /}
	              		{var hasInfant = "HAS_INFANT_"+traveller_ct /}
	              		{var isPrimaryTraveller = "IS_PRIMARY_TRAVELLER_"+traveller_ct /}
	              		<input type="hidden" name="${type}" value="${traveller.paxType.code}" />
	              		<input type="hidden" name="${hasInfant}" value="${traveller.withInfant}" />
	              		<input type="hidden" name="${isPrimaryTraveller}" value="${traveller.primaryTraveller}" />
	              	{/foreach}
	            </section>
	        </article>

	      	<div class="label">${this.data.labels.tx_merci_selectNewDates}</div>
	     	<div id="tabletContainerATC" class="tabletContainer">
		        <div role="group">
		        	{foreach itinerary inArray this.itineraries}
		              	<article  class="panel trip firstChild " role="treeitem" aria-selected="true">
			                <header>
			                  <h1>
			                    <label for="check1">${itinerary.beginLocation.cityName} - ${itinerary.endLocation.cityName}</label>
			                  </h1>
			                </header>
			                {foreach segment inArray itinerary.segments}
			                	<section class="trip">
			                      	<p class="flight-number"> <strong> ${segment.airline.code}${segment.flightNumber} </strong>
					                    <span>
					                      	{if segment.nbrOfStops === 0}
				            					${this.data.labels.tx_merci_text_direct}
				        					{elseif segment.nbrOfStops === 1/}
				           						${segment.nbrOfStops} ${this.data.labels.tx_merci_text_pnr_stop}
				          					{else/}
				           						${segment.nbrOfStops} ${this.data.labels.tx_merci_text_pnr_stops}
				          					{/if}
				          				</span>
			          				</p>
			                     	<p> </p>
			                      	<p class="departure">
				                      	{var beginDate = segment.beginDate /}
				                      	{var beginTime = beginDate.slice(11,16) /}
				                      	{var begDate = this._getDate(beginDate) /}
				                      	{var endDate = segment.endDate /}
				                      	{var endTime = endDate.slice(11,16) /}
				                        <time class="hour">${beginTime}</time>
				                        <span class="city">${segment.beginLocation.cityName}</span> <span class="dash">,</span> <span class="airport">${segment.beginLocation.locationName}</span> <abbr class="city">(${segment.beginLocation.locationCode})</abbr>
			                    	</p>
			                      	<p class="arrival">
				                        <time class="hour">${endTime}</time>
				                        <span class="city">${segment.endLocation.cityName}</span> <span class="dash">,</span> <span class="airport">${segment.endLocation.locationName}</span> <abbr class="city">(${segment.endLocation.locationCode})</abbr> </p>
			                     	<p class="date">
			                        <time class="date" datetime="${begDate|dateformat: 'yyyy-MM-dd'}">${begDate|dateformat: 'EEE dd MMM yyyy'}</time>
			                     	</p>
			                     	{var rbd = "RBD_"+itinerary_ct+"_"+segment_ct /}
			                     	{var airlineName = "AIRLINE_"+itinerary_ct+"_"+segment_ct /}
			                     	{var flightNumber = "FLIGHT_NUMBER_"+itinerary_ct+"_"+segment_ct /}
			                     	<input type="hidden" name="${rbd}" value="${segment.cabins[0].RBD}" />
			                     	<input type="hidden" name="${airlineName}" value="${segment.airline.code}" />
			                     	<input type="hidden" name="${flightNumber}" value="${segment.flightNumber}" />
			                    </section>
			                {/foreach}
			                <footer>
			                  	<div class="list date">
			                  		{var ID = "datePickFlightF_"+itinerary_index /}
			                  		{var date = "dd_"+itinerary_index /}
			                  		{var month = "MMM_"+itinerary_index /}
			                  		{var year = "YYYY_"+itinerary_index /}
			                    	<label for="day1">${this.data.labels.tx_merci_searchForNewFlights}</label>
			                    	<input type="hidden" class="" id="${ID}"/>
									<input type="hidden" class="dd" id="${date}"/>
									<input type="hidden" class="MMM" id="${month}" />
									<input type="hidden" class="YYYY" id="${year}" />
								</div>
			                </footer>
			                {var beginLocation = "B_LOCATION_"+itinerary_ct /}
	                     	{var endLocation = "E_LOCATION_"+itinerary_ct /}
	                     	{var beginDate = "B_DATE_"+itinerary_ct /}
	                     	{var endDate = "E_DATE_"+itinerary_ct /}
	                     	<input type="hidden" name="${beginLocation}" value="${itinerary.beginLocation.cityCode}" />
	                     	<input type="hidden" name="${endLocation}" value="${itinerary.endLocation.cityCode}" />
		           		</article>
		        	{/foreach}
		        </div>
	                <input type="hidden" name="result" value="json" />
	                <input type="hidden" name="TRIP_TYPE" value="${this.data.rqstParams.air.TRIP_TYPE}" />
	               	<input type="hidden" name="B_DATE_1" value=""/>
	                <input type="hidden" name="E_DATE_1" value=""/>
	                {if this.itineraries[1] != undefined}
		                <input type="hidden" name="B_DATE_2" value=""/>
		                <input type="hidden" name="E_DATE_2" value=""/>
		            {/if}
	                <input type="hidden" name="CABIN_CLASS" value="${this.data.rqstParams.air.itineraries[0].cabins[0].code}" />
	               	<input type="hidden" name="IS_SPEED_BOOK" value="${this.data.rqstParams.air.IS_SPEED_BOOK}" />
	               	<input type="hidden" name="SKIP_ALPI" value="TRUE" />




	            <footer class="buttons">
              		<button type="submit" class="validation" id="Continue"> ${this.data.labels.tx_merci_text_booking_continue} </button>
            	</footer>
	        </div>
        </form>
	</section>
{/macro}
{/Template}