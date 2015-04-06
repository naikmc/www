{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.AcceptanceOverView',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}


  {var label = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.labels /}
  {var parameters = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.parameters/}
  {var cpr = this.moduleCtrl.getCPR() /}
  {var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
  {var journey = selectedCPR.journey /}
  {var success = moduleCtrl.getSuccess() /}
  {var warnings = moduleCtrl.getWarnings() /}

	{var firstflight = selectedCPR.product[0] /}
	{var lastflight = selectedCPR.product[selectedCPR.product.length-1] /}
<div id="tripSummCoreErrors" class="showCoreErrorMessage"></div>
<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionDefaultstyleSsciSummarySpecific'>
<div id="tripSummErrors"></div>
/* This div is used to display warnings if any occurs */
      <div id="AcceptanceOverviewWarnings">
        {if warnings != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : warnings,
              "type" : "warning" }
          }/}
        {/if}
        {if success != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : success,
              "type" : "success" }
          }/}
      {/if}
      </div>
<section>
	/*Displaying SSCI Warnings */
<div id="pageWiseCommonWarnings"></div>
  <nav class="breadcrumbs">
      <ul>
        <li><span>1</span></li>
        <li><span>2</span></li>
        <li class="active"><span>3</span></li>
        <li><span>4</span></li>
      </ul>
  </nav>

	<div id="tripSummMain">
  <article class="panel">
      <header>
        <h1>${jQuery.substitute(label.PanelTitle, [cpr[journey][firstflight].departureAirport.airportLocation.cityName, cpr[journey][lastflight].arrivalAirport.airportLocation.cityName])}</h1>
      </header>

      <section id="section4" data-aria-hidden="false">
		  <div class="trip large-display">
				/* Timings for the journey */

				{var journeyDepartureDate =new Date(cpr[journey][firstflight].timings.SDT.time) /}
				{var dep_hrs = journeyDepartureDate.getUTCHours()/}
				{if parseInt(dep_hrs)<10}
				{set dep_hrs="0"+dep_hrs /}
				{/if}
				{var dep_mins = journeyDepartureDate.getUTCMinutes()/}
				{if parseInt(dep_mins)<10}
				{set dep_mins="0"+dep_mins /}
				{/if}
				{var f_weekday = moduleCtrl.getWeekDayUTC(journeyDepartureDate).substr(0,3) /}
				{var f_month= moduleCtrl.getMonthUTC(journeyDepartureDate)/}
				{var journeyArrivalDate =new Date(cpr[journey][lastflight].timings.SAT.time) /}
				{var arr_hrs = journeyArrivalDate.getUTCHours()/}
				{if parseInt(arr_hrs)<10}
				{set arr_hrs="0"+arr_hrs /}
				{/if}
				{var arr_mins = journeyArrivalDate.getUTCMinutes()/}
				{if parseInt(arr_mins)<10}
				{set arr_mins="0"+arr_mins /}
				{/if}
				{var l_weekday = moduleCtrl.getWeekDayUTC(journeyArrivalDate).substr(0,3) /}
				{var l_month= moduleCtrl.getMonthUTC(journeyArrivalDate)/}

	          <p>
	          	<time datetime="2013-03-25">${f_weekday}, ${journeyDepartureDate.getUTCDate()} ${f_month} ${journeyDepartureDate.getUTCFullYear()}</time>
	            <time datetime="07:35">${dep_hrs}:${dep_mins}</time>

	            <span>${this.moduleCtrl.toTitleCase(cpr[journey][firstflight].departureAirport.airportLocation.cityName)}</span>
	            <span>${this.moduleCtrl.toTitleCase(cpr[journey][firstflight].departureAirport.airportLocation.airportName)} <abbr>(${cpr[journey][firstflight].departureAirport.locationCode})</abbr></span>
	            <span><strong>${label.Terminal} ${cpr[journey][firstflight].departureAirport.terminal}</strong></span>
	         </p>

	          <p>

	            <time datetime="2013-03-25">${l_weekday}, ${journeyArrivalDate.getUTCDate()} ${l_month} ${journeyArrivalDate.getUTCFullYear()}</time>
	            <time datetime="11:55">${arr_hrs}:${arr_mins}</time>

	            <span>${this.moduleCtrl.toTitleCase(cpr[journey][lastflight].arrivalAirport.airportLocation.cityName)}</span>
	            <span>${this.moduleCtrl.toTitleCase(cpr[journey][lastflight].arrivalAirport.airportLocation.airportName)}<abbr>(${cpr[journey][lastflight].arrivalAirport.locationCode})</abbr></span>
	            <span><strong>${label.Terminal} ${cpr[journey][firstflight].arrivalAirport.terminal}</strong></span>
	           </p>

	      </div>
	      <div class="details">
	          <ul>
	          	{if cpr[journey].flightList.length ==1}
	          	<li class="fare-family"><span class="label">${label.Flight}:</span> <span class="data"><strong>${cpr[journey][firstflight].operatingAirline.companyName.companyIDAttributes.code}${cpr[journey][firstflight].operatingAirline.flightNumber}</strong>{if cpr[journey][firstflight].leg.length == 1}(${label.Direct}){else /}(${label.InDirect}){/if}</span></li>
	          	{/if}
	            //<li class="duration"><span class="label">Duration:</span> <span class="data">3 hr 45 min</span></li>
	            {var firstFlightNo = cpr[journey].flightList[0]/}

	    	    {var depCityCode = cpr[journey][firstFlightNo].departureAirport.locationCode /}
				{var arrCityCode = cpr[journey][firstFlightNo].arrivalAirport.locationCode /}

	          </ul>
	      </div>
      </section>

		{foreach item in selectedCPR.flighttocust}
			{var flight = item.product/}

			{var date =new Date(cpr[journey][flight].timings.SDT.time) /}
			{var dep_hrs = date.getUTCHours()/}
					{if parseInt(dep_hrs)<10}
					{set dep_hrs="0"+dep_hrs /}
					{/if}
					{var dep_mins = date.getUTCMinutes()/}
					{if parseInt(dep_mins)<10}
					{set dep_mins="0"+dep_mins /}
					{/if}
			{var arrivalDate =new Date(cpr[journey][flight].timings.SAT.time) /}
			{var arr_hrs = arrivalDate.getUTCHours()/}
					{if parseInt(arr_hrs)<10}
					{set arr_hrs="0"+arr_hrs /}
					{/if}
					{var arr_mins = arrivalDate.getUTCMinutes()/}
					{if parseInt(arr_mins)<10}
					{set arr_mins="0"+arr_mins /}
					{/if}
			{var weekday = moduleCtrl.getWeekDayUTC(date).substr(0,3) /}
			{var depCityCode = cpr[journey][flight].departureAirport.locationCode /}
			{var arrCityCode = cpr[journey][flight].arrivalAirport.locationCode /}
		    <section  class="segment" id="section4_${item_index}" data-aria-hidden="false">

		         <div>
		            <h2 > <span>${weekday}, ${date.getUTCDate()} ${moduleCtrl.getMonthUTC(date)} ${date.getUTCFullYear()} - ${cpr[journey][flight].operatingAirline.companyName.companyIDAttributes.code}${cpr[journey][flight].operatingAirline.flightNumber}</span> </h2>
		            {if parameters.SITE_SSCI_OP_AIR_LINE!=cpr[journey][flight].operatingAirline.companyName.companyIDAttributes.code}
		            <p>${label.operatedBy} : ${cpr[journey][flight].operatingAirline.companyName.companyIDAttributes.companyShortName}</p>
		            {/if}
		          <div class="trip">
		            <p class="departure">
		              <time datetime="07:35" class="hour">${dep_hrs}:${dep_mins}</time>
		              <span class="city">${this.moduleCtrl.toTitleCase(cpr[journey][flight].departureAirport.airportLocation.cityName)}</span> <span class="dash">, </span> <span class="airport">${this.moduleCtrl.toTitleCase(cpr[journey][flight].departureAirport.airportLocation.airportName)} </span> <abbr class="city">(${depCityCode})</abbr> </p>
		            <p class="arrival">
		              <time datetime="11:20" class="hour">${arr_hrs}:${arr_mins}</time>
		              <span class="city">${this.moduleCtrl.toTitleCase(cpr[journey][flight].arrivalAirport.airportLocation.cityName)} </span> <span class="dash">,</span> <span class="airport">${this.moduleCtrl.toTitleCase(cpr[journey][flight].arrivalAirport.airportLocation.airportName)} </span> <abbr class="city">(${arrCityCode})</abbr> </p>
		          </div>
		        </div>

		        <header>
		    	<h2 class="subheader">
		        	<span>${label.PaxAndServices}</span>
					<button type="button" role="button" class="toggle" data-aria-expanded="false" data-aria-controls="services0${flight}" ><span>${label.Toggle}</span></button>
		        </h2>
			   </header>

		        <div id="services0${flight}" data-aria-hidden="true" style="display: none;">
		        	/*<p class="services-checked-label">${label.SelServices}</p>
		            <ul class="services-checked">
		            	<li class="seats">
		                <p class="amount"><span>1</span></p>
		                <a {on click { fn:"onSeatClick", args: {prodIndex : item_index},scop:this.moduleCtrl}/} class="secondary expanded" href="javascript:void(0)"> <span><div class="seatBKGInSeatMap"></div></span>
		            </ul>*/

					/*Begin Checking All Pax Boarding Pass Printed or not for adult(for infant same as adult) and child */
					{var allPaxChangeSeatInhibited = false/}
					{var IATCIflightSeatMapInhibited = false /}
					{var changeSeatInhibited = 0/}
					{var totalPaxCount = 0 /}
					{foreach customerIndex in item.customer}
						{var customer = cpr[journey][customerIndex]/}
						{if customer.passengerTypeCode != "INF"}
							{set totalPaxCount = totalPaxCount+1 /}
							{var PassengerFlightConstraint = customerIndex+flight/}
							{if !(cpr[journey].productDetailsBeans[PassengerFlightConstraint].seatChangeAllowed)}
								{set changeSeatInhibited = changeSeatInhibited + 1/}
							{/if}
						{/if}
					{/foreach}
					{if changeSeatInhibited == totalPaxCount}
						{var allPaxChangeSeatInhibited = true/}
					{/if}

					//Since default behavior is to Not Show seat map for IATCI flight
					{if cpr[journey].productDetailsBeans[flight].IATCI_Flight}
						{if parameters.SITE_SSCI_ALLW_IATCI_SEAT != null && parameters.SITE_SSCI_ALLW_IATCI_SEAT.search(/true/i) != -1}
							{var IATCIflightSeatMapInhibited = false/}
						{else/}
							{var IATCIflightSeatMapInhibited = true/}
						{/if}
					{/if}
					//Since default behavior is to Not Show seat map for IATCI flight

					{if parameters.SITE_SSCI_ENBL_CHANG_SEAT && parameters.SITE_SSCI_ENBL_CHANG_SEAT.search(/true/i) != -1 && !allPaxChangeSeatInhibited && !IATCIflightSeatMapInhibited}
			            <div class="services-catalog">
				            <!--<p class="services-checked-label">Select services to view or modify:</p>-->
				            <div class="draggable-parent">
				              <ul class="services-checked draggable">
				                <li data-info-service="11a (Window)">
				                  <p class="amount"><span>${this.moduleCtrl.findAdltChildCountFromCustIDList(item.customer,flight,"ao")}</span></p>
				                  <a {if !allPaxChangeSeatInhibited} {on click { fn:"onSeatClick", args: {prodIndex : item_index,from:"ao"},scope:this.moduleCtrl}/} {/if}  class="secondary expanded {if allPaxChangeSeatInhibited}disabled{/if}" href="javascript:void(0)"> <span><div class="seatBKGInSeatMap"></div></span>
				                  <p class="label">{if !allPaxChangeSeatInhibited}${label.Seat}{else/}${label.SeatChangeNotAvailable}{/if}</p>
				                  </a>
				                </li>
				              </ul>
				            </div>
				       </div>
				  {else/}
	  					<div class="message info"><p>${label.SeatChangeNotAvailable}</p></div>
				  {/if}

		            <ul class="services-pax">
		            	{foreach pax in item.customer}
							{var customer = cpr[journey][pax]/}
							{var infantPrimeId = "" /}

							{var passengerFlightCode = pax+flight /}
							{var passengerLegCode = pax+cpr[journey][flight].leg[0].ID /}

							/*Start :: Forming SSR String For the Product */
							{var SSRString = "-"/}
							{if (null != cpr[journey].service)}
								{foreach service in cpr[journey].service}
									{if service_index.indexOf(passengerFlightCode) != '-1'}
										{if (null != service.services)&&(null != service.services[0])}
										 	{if (null != parameters.SITE_SSCI_DISPLAY_SSR) && (parameters.SITE_SSCI_DISPLAY_SSR.indexOf(service.services[0].SSRCode) != '-1')}
												{if SSRString == "-"}
													{set SSRString = service.services[0].SSRCode /}
												{else/}
													{set SSRString = SSRString+","+ service.services[0].SSRCode /}
												{/if}
											{/if}
										{/if}
									{/if}
								{/foreach}
							{/if}
							/*End :: Forming SSR String For the Product */

							/* Start :: To check if infant is associated to pax or not */
							{if cpr[journey].service != null}
									{foreach service in cpr[journey].service}
										{if service_index.indexOf('INFT') != '-1' && service_index.indexOf(flight) != '-1'}
											{var productID = service.referenceIDProductProductID/}
											{if cpr[journey].associatedProducts != null && cpr[journey].associatedProducts[productID].referenceIDProductPassengerID == customer.ID}
													{set infantPrimeId = service.referenceIDProductPassengerID/}
													{var infant = cpr[journey][infantPrimeId] /}
											{/if}
										{/if}
									{/foreach}
							{/if}
							/* End :: To check if infant is associated to pax or not */

							{if customer.passengerTypeCode == "ADT"}
			            	<li>
			                	{if customer.personNames[0].namePrefixs[0]}
	                        		<h4>${jQuery.substitute(label.PaxName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(customer.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customer.ID,currentindex : customer.index,flightID:flight}}/}><span>${label.Edit}</span></button>
	                        			{/if}
	                        		</h4>

	                        	{else/}
	                        		<h4>${jQuery.substitute(label.PaxName, ["",customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(customer.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customer.ID,currentindex : customer.index,flightID:flight}}/}><span>${label.Edit}</span></button>
	                        			{/if}
	                        		</h4>
	                        	{/if}

	                        	{var carrier="" /}
					            {var number="" /}
								{if moduleCtrl.getPaxDetailsForPrefill(pax) != null}
									{var fqtv= moduleCtrl.getPaxDetailsForPrefill(pax) /}
									{set carrier=fqtv.split("~")[0] /}
					                {set number=fqtv.split("~")[1] /}
								{else/}
					            {if customer.frequentFlyer.length>0}
					                {set carrier=customer.frequentFlyer[0].customerLoyalty.programID /}
					                {set number=customer.frequentFlyer[0].customerLoyalty.membershipID /}
					            {/if}
					            {/if}
					            {if SSRString != "-"}
						            <dl>
						            	<dt>${label.SSRs}:&nbsp;</dt><dd>${SSRString}</dd>
						            </dl>
					            {/if}
			                    <dl>
			                    	<dt>${label.FFNumber}: </dt> <dd>{if number && number != ""}{if carrier}${carrier}-{/if} ${number}{else/}-{/if}</dd>
			                    </dl>
			                     <dl>
			                     	<dt>${label.Cabin}:&nbsp;</dt><dd>${moduleCtrl.getCabinClassByName(cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass)}<abbr>(${cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass})</abbr> </dd>
			                     	{var passengerLegCodeSeat = passengerLegCode + "SST"/}
			                    	<dt>${label.Seat}: </dt> <dd> {if cpr[journey].seat[passengerLegCodeSeat].status.code == "U"}-{elseif cpr[journey].seat[passengerLegCodeSeat].status.code == "A" /}${cpr[journey].seat[passengerLegCodeSeat].row}${cpr[journey].seat[passengerLegCodeSeat].column}{/if}</dd>
			                    </dl>
			                </li>
							{if customer.accompaniedByInfant == true }
							<li class="infant">
				                {if infant.personNames[0].namePrefixs[0] && customer.personNames[0].namePrefixs[0]}
	                        		<h4>${jQuery.substitute(label.PaxNameInfant, [infant.personNames[0].namePrefixs[0],infant.personNames[0].givenNames[0],infant.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(infant.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : infant.ID,currentindex : infant.index,flightID:flight}}/}><span>${label.Edit}</span></button>
	                        			{/if}
	                        		</h4>
		                        	<dl>
		                             	<dt>${label.TravellingWith} </dt> <dd>${jQuery.substitute(label.PaxName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenName,customer.personNames[0].surname])}</dd>
		                            </dl>
	                        	{else/}
	                        		<h4>${jQuery.substitute(label.PaxNameInfant, ["",infant.personNames[0].givenNames[0],infant.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(infant.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : infant.ID,currentindex : infant.index,flightID:flight}}/}><span>${label.Edit}</span></button>
	                        			{/if}
	                        		</h4>
		                        	<dl>
		                             	<dt>${label.TravellingWith} </dt> <dd>${jQuery.substitute(label.PaxName, ["",customer.personNames[0].givenNames[0],customer.personNames[0].surname])}</dd>
		                            </dl>
	                        	{/if}
							 </li>
							{/if}
							{/if}
			                {if customer.passengerTypeCode == "CHD" }
			                <li class="child">
			                	{if customer.personNames[0].namePrefixs[0]}
	                        		<h4>${jQuery.substitute(label.PaxNameInfant, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(customer.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customer.ID,currentindex : customer.index,flightID:flight}}/}><span>${label.Edit}
	                        			{/if}
	                        		</h4>
	                        	{else/}
	                        		<h4>${jQuery.substitute(label.PaxNameInfant, ["",customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
	                        			/*
	                        			For not to show regulatory edit incase there is no regulatory data to show
	                        			*/
	                        			{if this.data.regulatoryAlteredSelCpr.customer.indexOf(customer.ID) != -1}
	                        			<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customer.ID,currentindex : customer.index,flightID:flight}}/}><span>${label.Edit}
	                        			{/if}
	                        		</h4>
	                        	{/if}

			                     	{var carrier="" /}
						            {var number="" /}
									{if moduleCtrl.getPaxDetailsForPrefill(pax) != null}
										{var fqtv= moduleCtrl.getPaxDetailsForPrefill(pax) /}
										{set carrier=fqtv.split("~")[0] /}
						                {set number=fqtv.split("~")[1] /}
									{else/}
						            {if customer.frequentFlyer.length>0}
						                {set carrier=customer.frequentFlyer[0].customerLoyalty.programID /}
						                {set number=customer.frequentFlyer[0].customerLoyalty.membershipID /}
						            {/if}
						            {/if}
						            {if SSRString != "-"}
						            <dl>
						            	<dt>${label.SSRs}:&nbsp;</dt><dd>${SSRString}</dd>
						            </dl>
					            	{/if}
				                    <dl>
				                    	<dt>${label.FFNumber}: </dt> <dd>{if number && number != ""}{if carrier}${carrier}-{/if} ${number}{else/}-{/if}</dd>
				                    </dl>
			                     	<dl>
			                     	<dt>${label.Cabin}:&nbsp;</dt><dd>${moduleCtrl.getCabinClassByName(cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass)}<abbr>(${cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass})</abbr> </dd>
			                     	{var passengerLegCodeSeat = passengerLegCode + "SST"/}
			                    	<dt>${label.Seat}: </dt> <dd> {if cpr[journey].seat[passengerLegCodeSeat].status.code == "U"}-{elseif cpr[journey].seat[passengerLegCodeSeat].status.code == "A" /}${cpr[journey].seat[passengerLegCodeSeat].row}${cpr[journey].seat[passengerLegCodeSeat].column}{/if}</dd>
			                    </dl>
			                </li>
							{/if}
						{/foreach}
		            </ul>
		        </div>
	        </section>
		{/foreach}
   </article>


	// CR6084550 : adding US federal law notice : start*/
//	{if (parameters.SITE_SSCI_USPHMSA_LOCATON == "TSUM" && isUSRoute())}
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
//	              <input type="checkbox" class="onoffswitch-checkbox" id="myUSPHMSAonoffswitch" {on click { fn:"dgrGoodsAndUSCheck", args: {}}/}>
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

	{if parameters.SITE_SSCI_DG_PG_LOCATION == "TSUM"}
    <article class="panel list">
      <header>
        <h1>${label.DgrGoods}</h1>
      </header>
      <section>
        <ul class="checkin-list" data-info="dangerous-goods">
          <li>
            <!--<input type="checkbox" id="flight02" name="flight02" value="SQ063" />-->
            <p class="onoffswitch-general-label">
            	{if parameters.SITE_SSCI_DGRS_CONTENT && (parameters.SITE_SSCI_DGRS_CONTENT.search(/USPMHSA/i) != -1)}
            		{var usRegulationLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('US_FEDERAL_LAW_DGRS_{0}_A'+ '.html','html')/}
            		<a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: usRegulationLink}}/}>${label.dgrsLabel}</a>
            	{else/}
            		{var dangerousGoodsLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('DGRS_LAW_{0}_A'+ '.html','html')/}
            		 <a href="javascript:void(0);" {on click {fn: 'openHTML',args: {link: dangerousGoodsLink}}/}>${label.dgrsLabel}</a>
            	{/if}
            	//${label.DangerousGoodsMsg}   <a {on click "loadDRGScreen" /} style="text-decoration:underline" href="javascript:void(0)" >${label.DangerousGoodsLbl}</a>
            </p>
            <div class="onoffswitch">
              <input type="checkbox" class="onoffswitch-checkbox" id="myonoffswitch" {on click { fn:"dgrGoodsAndUSCheck", args: {}}/}>
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

    </div>

    <div id="security_questions">
    <div class="message info">
	  <p>Please answer security question.</p>
    </div>

    <article class="panel list">
      <header>
        <h1>Security questions</h1>
      </header>

		{var secQuesFlag =false/}
		{var secQuesFailedFlag =false/}
		{var noneCheckedInFlag =false/}
		{var securityQues = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.SecurityQuestions/}
		{var processAcceptanceStatus = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.ProcessAcceptanceStatus /}
		{var acceptedPax = this.moduleCtrl.getModuleData().checkIn.MSSCIAcceptanceOverview_A.requestParam.AcceptedPassengers/}

      	{if acceptedPax!=null && acceptedPax=="NONE" }
			{set noneCheckedInFlag =true/}
		{/if}


      	{if processAcceptanceStatus!=null && processAcceptanceStatus=="SEQ_FAILURE" }
			{set secQuesFailedFlag =true/}
		{/if}


		{if securityQues!=null && securityQues.length>0 }
			{set secQuesFlag =true/}
		{/if}
      <section>
        <ul class="security-list" data-info="dangerous-goods">
          {foreach item in securityQues}
          	{var quesID = item/}
          	{var ques = "Question_"+quesID/}
          <li>
            <label>${label[ques]}</label>
            <span>
            <input id="Yes_${quesID}" name="radio${quesID}" type="radio" value="Yes" required>
            <label>Yes</label>
            <input id="No_${quesID}" name="radio${quesID}" type="radio" value="No">
            <label>No</label>
            </span> </li>
          {/foreach}
        </ul>
      </section>
    </article>
	</div>
    <footer class="buttons">

      <button type="submit" {if !secQuesFailedFlag && !noneCheckedInFlag && (parameters.SITE_SSCI_DG_PG_LOCATION == "TSUM" /* || (parameters.SITE_SSCI_USPHMSA_LOCATON == "TSUM" && isUSRoute()) */) && !secQuesFlag && !this.data.appCheckFailed}class="validation disabled" disabled="disabled"{else/} class="validation" {/if}  {on tap "onContinue"/} id="tripSummaryContinue">{if secQuesFailedFlag || noneCheckedInFlag || this.data.appCheckFailed}${label.exitCheckin}{else/}${label.Continue}{/if}</button>
      {if !secQuesFailedFlag && !noneCheckedInFlag}
      {if !this.data.appCheckFailed}<button type="button" class="validation cancel" {on tap "onBackClick"/}>${label.cancel}</button>{/if}
      {/if}
    </footer>
  </form>
</section>

 </div>
   {/macro}
{/Template}