{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.SelectFlights',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript:true
}}
{macro main()}
	{if this.moduleCtrl.getModuleData().checkIn.MSSCISelectFlights_A}
		{var label = this.moduleCtrl.getModuleData().checkIn.MSSCISelectFlights_A.SelectFlights.labels /}
		{var parameters = this.moduleCtrl.getModuleData().checkIn.MSSCISelectFlights_A.parameters/}
	{elseif this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A/}
		{var label = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.SelectFlights.labels /}
		{var parameters = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.parameters/}
	{/if}

	{var data = this.moduleCtrl.getCPR() /}
	{var selectedCPR = this.moduleCtrl.getSelectedCPR() /}
	{var journey = selectedCPR.journey /}
	{var selectedPax = selectedCPR.customer /}
	{var totalPax = data[journey].paxList.length /}
	{var enableNextLeg = true/}


	{var success = moduleCtrl.getSuccess() /}
	{var errorss = moduleCtrl.getErrors() /}


<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionDefaultSsciSelectflight'>
<section>
/*Displaying SSCI Warnings */
<div id="pageWiseCommonWarnings"></div>
<div id="initiateandEditErrors"></div>
<div id="pageCommonError"></div>
<div id="cprErrorsSelectFlight">
{if success != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : success,
              "type" : "success" }
          }/}
{/if}
{if errorss != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : errorss,
              "type" : "error" }
          }/}
{/if}
</div>
<form>

  <nav class="breadcrumbs">
    <ul>
      <li class="active"><span>1</span></li>
      <li><span>2</span></li>
      <li><span>3</span></li>
      <li><span>4</span></li>
    </ul>
  </nav>
    <article class="panel list">
      <header>
        <h1>${label.PassengersToCheckin}</h1>
      </header>
      <section id="flightSelsectionForPax">
        <ul class="checkin-list" data-info="pax-list">
       {foreach selPaxDtls in selectedPax}
			{var customer = data[journey][selPaxDtls] /}

				{if customer.passengerTypeCode != "INF"}
					{var isInfantToPax = false /}
					{var infantToPax = "" /}
					{var infantPrimeId = "" /}

					{if data[journey].service != null}
						{foreach service in data[journey].service}
							{if service_index.indexOf('INFT') != '-1' }
								{var productID = service.referenceIDProductProductID/}
									{if data[journey].associatedProducts != null && data[journey].associatedProducts[productID].referenceIDProductPassengerID == customer.ID}
										{set isInfantToPax = true /}
										{set infantToSamePax = true/}
										{set infantPrimeId = service.referenceIDProductPassengerID/}
										{set infantToPax = customer.ID/}
									{/if}
							{/if}
						{/foreach}
					{/if}

					{var carrier="" /}
              		{var number="" /}

              		{var fqtv = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls) /}

		              {if fqtv != ""}
		                {set carrier=fqtv.split("~")[0] /}
		                {set number=fqtv.split("~")[1] /}
		              {/if}

		            {var phoneNumber="" /}
              		{var Email="" /}
              		{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls,"Phone") /}

              		{if phoneandEmail != ""}
                		{set phoneNumber=phoneandEmail.split("~")[0].substring(0,4)+"-"+phoneandEmail.split("~")[0].substring(4) /}
		                {set Email=phoneandEmail.split("~")[1] /}
              		{/if}


					{if customer.passengerTypeCode == "ADT"}
						<li>
							<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong></p>
							<button class="secondary edit" type="button" {on tap {fn: "loadEditPAXScreen" , args : {selectedPax:customer.ID,index:selPaxDtls_index}}/} ><span>${label.Edit}</span></button>
							{if isInfantToPax}
                        		{call common.infantMacro(data[journey] , infantToPax , paxCheckedin , infantPrimeId , label) /}
                        	{/if}

                        	{call common.PaxDetilsFlightPage(label,fqtv.replace("~","-"),Email,phoneNumber) /}
						</li>
					{/if}

					{if customer.passengerTypeCode == "CHD"}
						<li class="child">
							<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong></p>
							<button class="secondary edit" {on tap {fn: "loadEditPAXScreen" , args : {selectedPax:customer.ID,index:selPaxDtls_index}}/} type="button"><span>${label.Edit}</span></button>
							{call common.PaxDetilsFlightPage(label,fqtv.replace("~","-"),Email,phoneNumber) /}
						</li>


					{/if}
				{/if}
		{/foreach}
        </ul>
      </section>
    </article>

/* start: checking if any one product is open */
	{var anyOneSegOpenForCheckin = false /}
	{foreach flight inArray data[journey].flightList}
		{var product = data[journey].productDetailsBeans[flight] /}
		{if product.flightOpen && product.checkInOpen}
			{set anyOneSegOpenForCheckin = true /}
		{/if}
	{/foreach}
	/* end: checking if any one product is open */
	{var segmentOccuredInPending = false /}

	{if anyOneSegOpenForCheckin}
    <article class="panel list flightsOpen">
      <header>
        <h1 class="checkin-ready">${label.FlightsOpenCheckin}</h1>
      </header>
      <section id="section1">
        <ul class="checkin-list" data-info="flights-ready-list-ssci">
          <li class="is-checked">
            <input type="checkbox" id="flight01" name="flight01" value="SQ062" checked="checked">
            <label for="flight01" class="is-checked cityPairs"> ${moduleCtrl.toTitleCase(data[journey][data[journey].firstflightid].departureAirport.airportLocation.cityName)} - ${moduleCtrl.toTitleCase(data[journey][data[journey].lastflightid].arrivalAirport.airportLocation.cityName)}</label>
            <button type="button" role="button" class="toggle" data-aria-expanded="false" data-aria-controls="passInfo01"><span>Toggle</span></button>
            <div class="segements " style="display:none" id="passInfo01" > //<span>Mr. Soumya Jana, Please select the flights you want to check in :P</span>


			{foreach flight in data[journey].flightList}
			{var checkedinPax = 0 /}
			{var product = data[journey].productDetailsBeans[flight] /}
				/* Start :: Display if Segment has not flown */
				{if !product.flown}
					{var eligibility = this.isFlightEligible(product) /}

					{if product.checkInOpen && product.flightOpen  && !segmentOccuredInPending}

					{var date =new Date(data[journey][flight].timings.SDT.time) /}
					{var dep_hrs = date.getUTCHours()/}
					{if parseInt(dep_hrs)<10}
					{set dep_hrs="0"+dep_hrs /}
					{/if}
					{var dep_mins = date.getUTCMinutes()/}
					{if parseInt(dep_mins)<10}
					{set dep_mins="0"+dep_mins /}
					{/if}
					{var arrivalDate =new Date(data[journey][flight].timings.SAT.time) /}
					{var arr_hrs = arrivalDate.getUTCHours()/}
					{if parseInt(arr_hrs)<10}
					{set arr_hrs="0"+arr_hrs /}
					{/if}
					{var arr_mins = arrivalDate.getUTCMinutes()/}
					{if parseInt(arr_mins)<10}
					{set arr_mins="0"+arr_mins /}
					{/if}
					{var weekday = moduleCtrl.getWeekDayUTC(date).substr(0,3) /}



					/*
					 *
					 * Setting Variable For Restricting Flight in Which all selected passenger are restricted due to Ticket Problem
					 * NOTE : Incase Of Associated Infant If Any one does not has valid ticket in Product ,We have to disable
					 */
					{var allPaxRestrictedInCurrSegmentErr = false /}
					{var adultChildCount = 0/}
					{var paxCountRestrictedCheckin = 0/}
					{foreach selPaxDtls in selectedPax}
						{var customer = data[journey][selPaxDtls] /}
						{if customer.passengerTypeCode != "INF"}
							{set adultChildCount = adultChildCount+1/}
							{var productDetails = data[journey].productDetailsBeans /}
							{if customer.accompaniedByInfant !=null && customer.accompaniedByInfant == true}
								{var infantID = this.moduleCtrl.findInfantIDForCust(flight,customer.ID)/}
								{if !productDetails[customer.ID + flight].bookingStatusEligible || !productDetails[customer.ID + flight].acceptanceAllowed || !productDetails[customer.ID + flight].paxTicketEligible || !productDetails[infantID + flight].paxTicketEligible || productDetails[customer.ID + flight].paxCheckedInStatusInCurrProd || productDetails[infantID + flight].paxCheckedInStatusInCurrProd}
									{set paxCountRestrictedCheckin = paxCountRestrictedCheckin+1 /}
								{/if}
							{else/}
								{if !productDetails[customer.ID + flight].bookingStatusEligible || !productDetails[customer.ID + flight].acceptanceAllowed || !productDetails[customer.ID + flight].paxTicketEligible || productDetails[customer.ID + flight].paxCheckedInStatusInCurrProd}
									{set paxCountRestrictedCheckin = paxCountRestrictedCheckin+1 /}
								{/if}
							{/if}
						{/if}
					{/foreach}
					{if paxCountRestrictedCheckin == adultChildCount}
						{set allPaxRestrictedInCurrSegmentErr = true /}
					{/if}
					/*
					 *
					 * Setting Variable For Restricting Flight in Which all selected passenger are restricted due to Ticket Problem
					 *
					 */




		              <ul data-info="flights-ready-list-ssci" id="trip0${(parseInt(flight_index) + parseInt(1))}" class="">
		                <li class="is-checked">
		                  <input {if allPaxRestrictedInCurrSegmentErr}class="flightSelCheckBox canNotChange"{else/}checked="checked" class="flightSelCheckBox" data-stopover="${data[journey].productDetailsBeans[flight].stopOverSupressed}"{/if} type="checkbox" id="seg0${(parseInt(flight_index) + parseInt(1))}" name="${(parseInt(flight_index) + parseInt(1))}" data-flightId="${flight}"
						  {if allPaxRestrictedInCurrSegmentErr}
						  	disabled="disabled"
						  {/if}
		                  >
		                  <label for="seg0${(parseInt(flight_index) + parseInt(1))}" class="is-checked cityPairs">${(parseInt(flight_index) + parseInt(1))}.${weekday}, ${date.getUTCDate()} ${moduleCtrl.getMonthUTC(date)} ${date.getUTCFullYear()} - ${data[journey][flight].operatingAirline.companyName.companyIDAttributes.code}${data[journey][flight].operatingAirline.flightNumber}</label>
		                  {if parameters.SITE_SSCI_OP_AIR_LINE!=data[journey][flight].operatingAirline.companyName.companyIDAttributes.code}
		                  <p>${label.operatedBy} : ${data[journey][flight].operatingAirline.companyName.companyIDAttributes.companyShortName}</p>
		                  {/if}
		                  <p><span class="strong">${dep_hrs}:${dep_mins}</span> ${moduleCtrl.toTitleCase(data[journey][flight].departureAirport.airportLocation.airportName)}(${data[journey][flight].departureAirport.locationCode}), ${moduleCtrl.toTitleCase(data[journey][flight].departureAirport.airportLocation.cityName)}</p>
		                  <p><span class="strong">${arr_hrs}:${arr_mins}</span> ${moduleCtrl.toTitleCase(data[journey][flight].arrivalAirport.airportLocation.airportName)}(${data[journey][flight].arrivalAirport.locationCode}), ${moduleCtrl.toTitleCase(data[journey][flight].arrivalAirport.airportLocation.cityName)}</p>


		                	<!--<h4>Passengers selected for check-in:</h4>-->
						  <ul data-info="pax-sub-list">
						  {var checkedinPaxCnt = 0 /}
						  {var checkedinPax = 0 /}

							  {foreach selPaxDtls in selectedPax}
								{var customer = data[journey][selPaxDtls]  /}
								{var customer_index = selPaxDtls_index /}
								{var paxCheckedin = false /}
								{var paxSBY = false /}
								{var isInfantToPax = false /}
								{var infantToPax = "" /}
								{var infantPrimeId = "" /}
								{var paxPT = false /}
								{var infantPaxPT = true /}
								{var ssrEligible = true /}
								{var eTicket = false /}
								{var ssrBPEligible = true /}
								{var originEligibility = false /}

								//{foreach productPax in customer.productLevelBean} /* Start :: Product Iteration */

									{var totalLegInSegment = data[journey][flight].leg.length /}
									{var destEligibility = true /}
									{foreach legs in data[journey][flight].leg}
									{var legID = legs.ID /}
										/* Start :: To Check if passenge is checked in or in standby mode */
										//{foreach legIndicator in data[journey].status.legPassenger}
											{if data[journey].status.legPassenger[customer.ID+legID+"CAC"] != null}
												{if data[journey].status.legPassenger[customer.ID+legID+"CAC"].status[0].code == '1'}
													{set paxCheckedin = true /}
													{set checkedinPax = checkedinPax+1 /}
													//{set checkedinPaxCnt = checkedinPaxCnt+1 /}
											  	{/if}
												{/if}
											{if data[journey].status.legPassenger[customer.ID+legID+"CST"] != null}
							  				  	{if data[journey].status.legPassenger[customer.ID+legID+"CST"].status[0].code == '1'}
													{set paxSBY = true /}
													{set paxCheckedin = true /}
													{set checkedinPax = checkedinPax+1 /}
													//{set checkedinPaxCnt = checkedinPaxCnt+1 /}
											  	{/if}
											{/if}
										//{/foreach}
									{/foreach}

									/**
									 * Begin Ticket Issue Check On Product Basis
									 *
									 */


									{if data[journey].productDetailsBeans[customer.ID + flight].paxTicketEligible}
										{set paxPT = true /}
									{else/}
										{set paxPT = false /}
									{/if}

									/**
									 * END Ticket Issue Check On Product Basis
									 *
									 */


									/* Start :: To check if all passenger has checkedin or not */
									{if checkedinPax != totalPax*totalLegInSegment}
									  {set allPaxChecked = false/}
									{else/}
									  {set allPaxChecked = true/}
									{/if}
									/* End :: To check if all passenger has checkedin or not */
									/* Start :: To check if infant is associated to pax or not */
									{if data[journey].service != null}
										{foreach service in data[journey].service}
											{if service_index.indexOf('INFT') != '-1' && service_index.indexOf(flight) != '-1'}
												{var productID = service.referenceIDProductProductID/}
												{if data[journey].associatedProducts != null && data[journey].associatedProducts[productID].referenceIDProductPassengerID == customer.ID}
														{set isInfantToPax = true /}
														{set infantToSamePax = true/}
														{set infantPrimeId = service.referenceIDProductPassengerID/}
														{set infantToPax = customer.ID/}

														/**
														 * Infant Ticket
														 */
														{if data[journey].productDetailsBeans[infantPrimeId + flight].paxTicketEligible}
															{set infantPaxPT = true /}
														{else/}
															{set infantPaxPT = false /}
														{/if}
														/**
														 * Infant Ticket
														 */
												{/if}
											{/if}
										{/foreach}
									{/if}
								/* End :: To check if infant is associated to pax or not */
								//{/foreach} /* End :: Product Iteration */
								/* Start :: Display the Selection box if passenger is eligible to checkin */
								{if !paxCheckedin}
							  /* End :: To Check if passenge is checked in or in standby mode */
										{if customer.passengerTypeCode == "ADT"}
											{if data[journey].productDetailsBeans[customer.ID + flight].validPaxForFlight}
											<li class="pax">
												${jQuery.substitute(label.PassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}
												{if journey.service != null}
	            									{foreach service in journey.service}
	            										{if service_index.indexOf(customerNo) != '-1'}
	            										{var currSSRCode = service.services[0].SSRCode/}
	            											{if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
             							     					<span class="checkindenained">${label.SSRNotNotAllowed}</span>
              						    					{/if}
	            										{/if}
	            									{/foreach}
	            								{/if}
												{if !paxPT}
														<span class="checkindenained">${label.TicketNotAssociated}</span>
												{elseif !data[journey].productDetailsBeans[customer.ID + flight].bookingStatusEligible/}
														<span class="checkindenained">${label.waitlisted}</span>
												{elseif !data[journey].productDetailsBeans[customer.ID + flight].acceptanceAllowed/}
														{if data[journey].productDetailsBeans[customer.ID + flight].infantProblemInhibition}
						            			    		<span class="checkindenained">${label.InfantNotAssociated}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].serviceRequiredInhibition/}
						            			    		<span class="checkindenained">${label.ServiceRequired}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].unpaidServiceInhibition/}
						            			    		<span class="checkindenained">${label.UnpaidService}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].alreadyBoardedInhibition/}
						            			    		<span class="checkindenained">${label.AlreadyBoarded}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].docCheckRequiredInhibitionn/}
						            			    		<span class="checkindenained">${label.DocumentCheckRequired}</span>
						            			    	{else/}
						            			    		<span class="checkindenained">${label.CheckInInhibited}</span>
						            			    	{/if}
												{/if}
											</li>
											{if isInfantToPax}
											  //{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
											  <li class="pax infant">
												${jQuery.substitute(label.PassengerName, [data[journey][infantPrimeId].personNames[0].givenNames[0], data[journey][infantPrimeId].personNames[0].surname])|escapeForHTML:false}
												<i class="textSmaller">(Infant)</i>
												{if !infantPaxPT}
														<span class="checkindenained">${label.TicketNotAssociated}</span>
												{/if}
											  </li>
										    {/if}
										{/if}
										{/if}
										{if customer.passengerTypeCode == "CHD"}
											{if data[journey].productDetailsBeans[customer.ID + flight].validPaxForFlight}
											<li class="pax child">
												${jQuery.substitute(label.ChildPassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}
													{if journey.service != null}
	            									{foreach service in journey.service}
	            										{if service_index.indexOf(customerNo) != '-1'}
	            										{var currSSRCode = service.services[0].SSRCode/}
	            											{if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
             							     					<span class="checkindenained">${label.SSRNotNotAllowed}</span>
              						    					{/if}
	            										{/if}
	            									{/foreach}
	            								{/if}
												{if !paxPT}
														<span class="checkindenained">${label.TicketNotAssociated}</span>
												{elseif !data[journey].productDetailsBeans[customer.ID + flight].bookingStatusEligible/}
														<span class="checkindenained">${label.waitlisted}</span>
												{elseif !data[journey].productDetailsBeans[customer.ID + flight].acceptanceAllowed/}
														{if data[journey].productDetailsBeans[customer.ID + flight].infantProblemInhibition}
						            			    		<span class="checkindenained">${label.InfantNotAssociated}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].serviceRequiredInhibition/}
						            			    		<span class="checkindenained">${label.ServiceRequired}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].unpaidServiceInhibition/}
						            			    		<span class="checkindenained">${label.UnpaidService}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].alreadyBoardedInhibition/}
						            			    		<span class="checkindenained">${label.AlreadyBoarded}</span>
						            			    	{elseif data[journey].productDetailsBeans[customer.ID + flight].docCheckRequiredInhibitionn/}
						            			    		<span class="checkindenained">${label.DocumentCheckRequired}</span>
						            			    	{else/}
						            			    		<span class="checkindenained">${label.CheckInInhibited}</span>
						            			    	{/if}
												{/if}
											</li>
											{if isInfantToPax}
											  //{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
											  <li class="pax infant">
												${jQuery.substitute(label.PassengerName, [data[journey][infantPrimeId].personNames[0].givenNames[0], data[journey][infantPrimeId].personNames[0].surname])|escapeForHTML:false}
												<i class="textSmaller">(Infant)</i>
												{if !infantPaxPT}
														<span class="checkindenained">${label.TicketNotAssociated}</span>
												{/if}
											  </li>
										    {/if}
										{/if}
										{/if}
								{else/}
										{if customer.passengerTypeCode == "ADT"}
											{if data[journey].productDetailsBeans[customer.ID + flight].validPaxForFlight}
											<li class="pax">
												${jQuery.substitute(label.PassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}
												{if paxPT && ssrEligible}
												  {if paxSBY}
													<span class="greenHighlightIcon checkedin">${label.StandBy}</span>
												  {elseif paxCheckedin /}
													<span class="greenHighlightIcon checkedin">${label.CheckedIn}</span>
												  {/if}
												{elseif !ssrEligible/}
												  <span class="checkindenained">${label.TicketNotAssociated}</span>
												{elseif !paxPT/}
												  <span class="checkindenained">${label.TicketNotAssociated}</span>
												{/if}
											</li>
											{if isInfantToPax}
											  //{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
											  <li class="pax infant">
											  ${jQuery.substitute(label.InfantPassengerName, [data[journey][infantPrimeId].personNames[0].givenNames[0], data[journey][infantPrimeId].personNames[0].surname])|escapeForHTML:false}
//											  <i class="textSmaller">(Infant)</i>
											  <span class="greenHighlightIcon checkedin">${label.CheckedIn}</span>
											  </li>
										    {/if}
										{/if}
										{/if}
										{if customer.passengerTypeCode == "CHD"}
											{if data[journey].productDetailsBeans[customer.ID + flight].validPaxForFlight}
											<li class="pax child">
												${jQuery.substitute(label.ChildPassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}
												{if paxPT && ssrEligible}
												  {if paxSBY}
													<span class="greenHighlightIcon checkedin">${label.StandBy}</span>
												  {elseif paxCheckedin /}
													<span class="greenHighlightIcon checkedin">${label.CheckedIn}</span>
												  {/if}
												{elseif !ssrEligible/}
												  <span class="checkindenained">${label.TicketNotAssociated}</span>
												{elseif !paxPT/}
												  <span class="checkindenained">${label.TicketNotAssociated}</span>
												{/if}
											</li>
											{if isInfantToPax}
											  //{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
											  <li class="pax infant">
												${jQuery.substitute(label.InfantPassengerName, [data[journey][infantPrimeId].personNames[0].givenNames[0], data[journey][infantPrimeId].personNames[0].surname])|escapeForHTML:false}
//												<i class="textSmaller">(Infant)</i>
												<span class="greenHighlightIcon checkedin">${label.CheckedIn}</span>
											  </li>
										    {/if}
											 {/if}   
										{/if}
								{/if}
							{/foreach}

						</ul>
						{if !eligibility}
								<span class="checkindenained" style="padding-left: 35px;">${ErrMsg}</span>
						{else/}
							{if !enableNextLeg}
								<span class="checkindenained" style="padding-left: 35px;">${label.DisCheckin}</span>
							{/if}
						{/if}
		                </li>
		              </ul>


              		{else/}
						{set segmentOccuredInPending = true /}
              		{/if}
              {/if}
			{/foreach}

            </div>
          </li>
        </ul>
      </section>
    </article>
   	{/if}

   	/* Start Loop for segments */
	{var flightAvailInPendingCheckin = false /}
		{foreach flight inArray data[journey].flightList}
		{var product = data[journey].productDetailsBeans[flight] /}
			/* Start :: Display if Segment has not flown */
			{if !product.flown}
				{if !product.checkInOpen || !product.flightOpen}
					{set flightAvailInPendingCheckin = true /}
				{/if}
			{/if}
		{/foreach}


	{if flightAvailInPendingCheckin}
    <article class="panel list">
      <header>
        <h1>${label.FlightsPendingCheckin}
          <button type="button" role="button" class="toggle" data-aria-expanded="false" data-aria-controls="section5"><span>${label.Toggle}</span></button>
        </h1>
      </header>
      <section style="display:none" id="section5">
        <ul class="checkin-list" data-info="flights-pending-list">
            {var isUserError = false /}
			{var checkedinPaxCnt = 0 /}
			 {var showFurthurSegments = false /}
			/* Start Loop for segments */
			{foreach flight inArray data[journey].flightList}
			 {var product = data[journey].productDetailsBeans[flight] /}
				{var checkedinPax = 0 /}
				/* Start :: Display if Segment has not flown */
				{if !product.flown}
					{var eligibility = this.isFlightEligible(product) /}

					{if !product.checkInOpen || !product.flightOpen  || showFurthurSegments}
						{set showFurthurSegments = true /}

			         			{var date =new Date(data[journey][flight].timings.SDT.time) /}
			         			{var dep_hrs = date.getUTCHours()/}
								{if parseInt(dep_hrs)<10}
								{set dep_hrs="0"+dep_hrs /}
								{/if}
								{var dep_mins = date.getUTCMinutes()/}
								{if parseInt(dep_mins)<10}
								{set dep_mins="0"+dep_mins /}
								{/if}
								{var arrivalDate =new Date(data[journey][flight].timings.SAT.time) /}
								{var arr_hrs = arrivalDate.getUTCHours()/}
								{if parseInt(arr_hrs)<10}
								{set arr_hrs="0"+arr_hrs /}
								{/if}
								{var arr_mins = arrivalDate.getUTCMinutes()/}
								{if parseInt(arr_mins)<10}
								{set arr_mins="0"+arr_mins /}
								{/if}
								{var weekday = moduleCtrl.getWeekDayUTC(date).substr(0,3) /}
					  <li>
			            <p> <!--span class="fare-deals">Check-In opens in 23 hours</span>--> <span> <span>
			              <time datetime="2013-02-22">${weekday}, ${date.getUTCDate()} ${moduleCtrl.getMonthUTC(date)} ${date.getUTCFullYear()}</time>
			              - <span class="flight-number">${data[journey][flight].operatingAirline.companyName.companyIDAttributes.code}${data[journey][flight].operatingAirline.flightNumber}</span> </span> <span>
			              <time>${dep_hrs}:${dep_mins}</time>
			              <span class="airport">${moduleCtrl.toTitleCase(data[journey][flight].departureAirport.airportLocation.airportName)}<abbr>(${data[journey][flight].departureAirport.locationCode})</abbr></span>, <span class="city">${moduleCtrl.toTitleCase(data[journey][flight].departureAirport.airportLocation.cityName)}</span> </span> <span>
			              <time>${arr_hrs}:${arr_mins}</time>
			              <span class="airport">${moduleCtrl.toTitleCase(data[journey][flight].arrivalAirport.airportLocation.airportName)}<abbr>(${data[journey][flight].arrivalAirport.locationCode})</abbr></span>, <span class="city">${moduleCtrl.toTitleCase(data[journey][flight].arrivalAirport.airportLocation.cityName)}</span> </span> </span> </p>
			          </li>

					{/if}
			     {/if}
			 {/foreach}
			        </ul>
			      </section>
			    </article>

  	 {/if}

	// CR6084550 : adding US federal law notice : start*/
//	{if parameters.SITE_SSCI_USPHMSA_LOCATON == "FSEL" && this.isUSRoute()}
//		{var usRegulationLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('US_FEDERAL_LAW_{0}_A'+ '.html','html')/}
//		<article class="panel list">
//	      <header>
//	        <h1>${label.federalLawNotice}</h1>
//	      </header>
//	      <section>
//	        <ul class="checkin-list" data-info="USPHMSA">
//	          <li>
//	            <!--<input type="checkbox" id="flight02" name="flight02" value="SQ063" />-->
//	            <p class="onoffswitch-general-label">
//	            	I have understood the terms and conditions mentioned in <a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: usRegulationLink}}/}>${label.federalLawNotice}</a>
//	            </p>
//	            <div class="onoffswitch">
//	              <input type="checkbox" class="onoffswitch-checkbox" id="myUSPHMSAonoffswitch" {on click { fn:"dgrGoodsOrUSCheck", args: {}}/}>
//	              <label class="onoffswitch-label" for="myUSPHMSAonoffswitch">
//	              <div class="onoffswitch-inner">
//	                <div class="onoffswitch-active">${label.Yes}</div>
//	                <div class="onoffswitch-inactive">${label.No}</div>
//	              </div>
//	              <div class="onoffswitch-switch"></div>
//	              </label>
//	            </div>
//	          </li>
//	        </ul>
//	      </section>
//	    </article>
//	{/if}
	// CR6084550 : adding US federal law notice : end*/


	{if parameters.SITE_SSCI_DG_PG_LOCATION == "FSEL"}
    <article class="panel list">
      <header>
        <h1>${label.DgrGoods}</h1>
      </header>
      <section>
        <ul class="checkin-list" data-info="dangerous-goods">
          <li>
            <!--<input type="checkbox" id="flight02" name="flight02" value="SQ063" />-->
            <p class="onoffswitch-general-label">
            	{if (parameters.SITE_SSCI_DGRS_CONTENT && (parameters.SITE_SSCI_DGRS_CONTENT.search(/USPMHSA/i) != -1))}
            		{var usRegulationLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('US_FEDERAL_LAW_DGRS_{0}_A'+ '.html','html')/}
            		<a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: usRegulationLink}}/}>${label.dgrsLabel}</a>  /* <a {on click "loadDRGScreen" /} style="text-decoration:underline" href="javascript:void(0)" >${label.DangerousGoodsLbl}</a> */
            	{else/}
            		{var dangerousGoodsLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('DGRS_LAW_{0}_A'+ '.html','html')/}
            		<a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: dangerousGoodsLink}}/}>${label.dgrsLabel}</a>  /* <a {on click "loadDRGScreen" /} style="text-decoration:underline" href="javascript:void(0)" >${label.DangerousGoodsLbl}</a> */
            	{/if}
            </p>
            <div class="onoffswitch">
              <input type="checkbox" class="onoffswitch-checkbox" id="myonoffswitch" {on click { fn:"dgrGoodsOrUSCheck", args: {}}/}>
              <label class="onoffswitch-label" for="myonoffswitch">
              <div class="onoffswitch-inner">
                <div class="onoffswitch-active">${label.Yes}</div>
                <div class="onoffswitch-inactive">${label.No}</div>
              </div>
              <div class="onoffswitch-switch"></div>
              </label>
            </div>
          </li>
        </ul>
      </section>
    </article>
    {/if}
    <footer class="buttons">
      <button type="button" id="selectFlightContinue" {if (parameters.SITE_SSCI_DG_PG_LOCATION == "FSEL" /* || (parameters.SITE_SSCI_USPHMSA_LOCATON == "FSEL" && this.isUSRoute()) */)}class="validation disabled" disabled="disabled"{else/} class="validation" {/if} {on click "onContinueClick"/} >${label.Continue}</button>
      <button type="button" class="validation cancel" {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
  </form>
</section>
</div>
{/macro}
{/Template}
