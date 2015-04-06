{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.TripListPageNew',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}
	{var data =this.moduleCtrl.getCPR() /}
	{var selectedCPR = this.moduleCtrl.getSelectedCPR() /}
	{var journey = selectedCPR.journey /}




<div class='sectionDefaultstyle sectionDefaultstyleSsci'>
<section>
	/*Displaying SSCI Warnings */
   <div id="pageWiseCommonWarnings"></div>
  <form>


  <!--<div class="message info"><p>Flight(s) in waitlist for booking DEF456 is/are now confirmed. You can pay to validated your reservation</p></div>-->

    <article class="carrousel-full">

        <h1 data-flightinfo="route" data-location="BKDL1.html">

            <a href="BKDL1.html">more info</a>
        </h1>
		{var totalListTracker=-1 /}
    	<ul id="listboxa">
			{var opTrip = ""/}
			{set totalListTracker+=1 /}
			{foreach sortedTripNo in this.sortedJourney}
				{var trip = data[sortedTripNo]/}

				{if trip.flightList.length == 1}
					<li class="one-way">
					{set opTrip = trip[trip.flightList[0]].departureAirport.airportLocation.cityName+" - "+trip[trip.flightList[0]].arrivalAirport.airportLocation.cityName/}
				{elseif trip.flightList.length == 2/}
					<li>
					{foreach flightNo in trip.flightList}
						{set flight = trip[flightNo] /}
						{if flightNo_index == 0}
							{set opTrip = flight.departureAirport.airportLocation.cityName+" - " /}
						{/if}
						{if parseInt(flightNo_index)+1 == trip.flightList.length}
							{set opTrip += flight.arrivalAirport.airportLocation.cityName /}

						{/if}
					{/foreach}
				{else /}
					<li class="multicity">
					{foreach flightNo in trip.flightList}
						{set flight = trip[flightNo] /}
						{if flightNo_index == 0}
							{set opTrip = flight.departureAirport.airportLocation.cityName+" - " /}
						{/if}
						{if parseInt(flightNo_index)+1 == trip.flightList.length}
							{set opTrip += flight.arrivalAirport.airportLocation.cityName /}
						{/if}
					{/foreach}
				{/if}
				<article id="${trip.journeyID}" data-airp-list-tracker="${totalListTracker}"
//				{if handlerName != ""}
					{on tap { fn:"setselectedPnrDetails", args: {trip:trip.journeyID,id:trip.journeyID}}/}
					{on dblclick { fn:"setselectedPnrDetails", args: {trip:trip.journeyID,id:trip.journeyID}}/}
//				{else /}
//					data-airp-list-onclick="" data-airp-list-forheader_onclick=""
//				{/if}
					data-airp-points="${opTrip}" class="carrousel-full-item">

				{if trip.flightList.length== 1}
					{var date = new Date(trip[trip.flightList[0]].timings.SDT.time)/}

					{var statusText="" /}
             	 	{var statusBasedClass="" /}
             	 	{var flightNo=trip.flightList[0] /}

						{if !trip.productDetailsBeans[flightNo].primeFlightEligible}
							{set statusText=label.CheckInInhibited /}
             	 			{var statusBasedClass="" /}
             	 		{elseif trip.productDetailsBeans[flightNo].flown /}
             	 			{set statusText=label.FlightExpired /}
             	 			{var statusBasedClass="" /}
             	 		/*{elseif trip.status.flight[flightNo+"GN"].status[0].code == "SO" /}
							{set statusText=label.Cancelled /}
							{set statusBasedClass="is-cancelled" /}*/
						{elseif trip.productDetailsBeans[flightNo].checkInOpensInTime && trip.productDetailsBeans[flightNo].checkInOpensInTime > 0 /}
							{var CheckinOpensin=parseInt(trip.productDetailsBeans[flightNo].checkInOpensInTime) /}

	                        {if CheckinOpensin == 1}
	                           {set statusText=CheckinOpensin+" "+label.Hr /}
	                        {elseif CheckinOpensin < 24 /}
	                           {set statusText=CheckinOpensin+" "+label.Hrs /}
	                        {else /}
	                           {set CheckinOpensin=Math.round(CheckinOpensin/24) /}
	                           {if CheckinOpensin == 1}
	                              {set statusText=CheckinOpensin+" "+label.Day /}
	                           {else /}
	                             {set statusText=CheckinOpensin+" "+label.Days /}
	                           {/if}
	                        {/if}
	                        {set statusText=label.OpensIn+" "+statusText /}
						{elseif !trip.productDetailsBeans[flightNo].checkInOpen || !trip.productDetailsBeans[flightNo].flightOpen /}
							{set statusText=label.FlightNotOpen /}
             	 		{else /}
             	 			{set statusText=label.Checkintext /}
             	 			{set statusBasedClass="is-checkin-open eligibleToGoNextPage" /}
             	 		{/if}

					<section class="outboundFlightImg ${statusBasedClass}">
                	<h3>${statusText}</h3>
               			<time datetime="2013-02-22">
               	    		<span data-flightinfo="day-number">{if date.getUTCDate()< 10}0${date.getUTCDate()}{else /}${date.getUTCDate()}{/if}</span>
                   	   		<span>
                   				<span data-flightinfo="day-name">${moduleCtrl.getWeekDayUTC(date).substr(0,3)}</span>
                   				<span data-flightinfo="month">${moduleCtrl.getMonthUTC(date)}</span>
                   				<span data-flightinfo="year">${date.getFullYear()}</span>
                  			</span>
                   		</time>
           		  </section>
             	{else /}
             	 	{foreach flightNo in trip.flightList}
             	 		{set flight = trip[flightNo] /}
             	 		{set primeFlightId = trip.flightList[0] /}
             	 		{var date = new Date(trip[flightNo].timings.SDT.time)/}
             	 		{var statusText="" /}
             	 		{var statusBasedClass="" /}

						/* Checkin whether prime segment of journey is Operating Airline or not */
						{if (!trip.productDetailsBeans[flightNo].primeFlightEligible) && (!trip.productDetailsBeans[primeFlightId].primeFlightEligible)}
							{set statusText=label.CheckInInhibited /}
             	 			{var statusBasedClass="" /}
             	 		{elseif trip.productDetailsBeans[flightNo].flown /}
             	 			{set statusText=label.FlightExpired /}
             	 			{var statusBasedClass="" /}
             	 		/*{elseif trip.status.flight[flightNo+"GN"].status[0].code == "SO" /}
							{set statusText=label.Cancelled /}
							{set statusBasedClass="is-cancelled" /}*/
						{elseif trip.productDetailsBeans[flightNo].checkInOpensInTime && trip.productDetailsBeans[flightNo].checkInOpensInTime > 0 /}
							{var CheckinOpensin=parseInt(trip.productDetailsBeans[flightNo].checkInOpensInTime) /}

	                        {if CheckinOpensin == 1}
	                           {set statusText=CheckinOpensin+" "+label.Hr /}
	                        {elseif CheckinOpensin < 24 /}
	                           {set statusText=CheckinOpensin+" "+label.Hrs /}
	                        {else /}
	                           {set CheckinOpensin=Math.round(CheckinOpensin/24) /}
	                           {if CheckinOpensin == 1}
	                              {set statusText=CheckinOpensin+" "+label.Day /}
	                           {else /}
	                             {set statusText=CheckinOpensin+" "+label.Days /}
	                           {/if}
	                        {/if}
	                        {set statusText=label.OpensIn+" "+statusText /}
						{elseif !trip.productDetailsBeans[flightNo].checkInOpen || !trip.productDetailsBeans[flightNo].flightOpen /}
							{set statusText=label.FlightNotOpen /}
             	 		{else /}
             	 			{set statusText=label.Checkintext /}
             	 			{set statusBasedClass="is-checkin-open eligibleToGoNextPage" /}
             	 		{/if}

             	 		<section class="outboundFlightImg ${statusBasedClass}">
             	 		<h3>${statusText}</h3>
             	 		{if parseInt(trip.flightList.length) > 2}
             	 		<p class="segments"><abbr>${flight.departureAirport.locationCode}</abbr> - <abbr>${flight.arrivalAirport.locationCode}</abbr></p>
             	 		{/if}
             	 		<time datetime="2013-02-22">
               	    		<span data-flightinfo="day-number">{if date.getUTCDate()< 10}0${date.getUTCDate()}{else /}${date.getUTCDate()}{/if}</span>
                   	   		<span>
                   				<span data-flightinfo="day-name">${moduleCtrl.getWeekDayUTC(date).substr(0,3)}</span>
                   				<span data-flightinfo="month">${moduleCtrl.getMonthUTC(date)}</span>
                   				<span data-flightinfo="year">${date.getUTCFullYear()}</span>
                  			</span>
                   		</time>
             		  </section>
             	 	{/foreach}
				{/if}
				</article>
				</li>
			{/foreach}
		</ul>


        <footer>
        	<ul id = "Indicator_details">

            </ul>

        </footer>


    </article>

    <aside>
	<nav class="buttons">
      <ul>
      <li><a class="navigation" href="javascript:void(0)" {on click { fn:"gotoCheckinHomePage", args: {"flow" : "manageCheckin"}}/}>${label.tx_merci_checkin_triplst_tripnothere}?</a></li>

      </ul>
    </nav>
	</aside>



  </form>
</section>

</div>


   {/macro}
{/Template}