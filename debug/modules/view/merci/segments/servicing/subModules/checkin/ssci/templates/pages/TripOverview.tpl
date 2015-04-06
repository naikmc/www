{Template {
  $classpath : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.TripOverview',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
    autocomplete : 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
  },
  $wlibs : {
    'touch' : 'aria.touch.widgets.TouchWidgetLib'
  },
  $dependencies: ['aria.popups.Popup'],
  $hasScript : true
}}

  {macro main()}
  {var label = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.labels/}
  {var labelExitrow = label.EmergencyExitPrompt /}
  {var cpr = this.moduleCtrl.getModuleData().checkIn.MSSCITripOverview_A.requestParam.CPRIdentification /}
  {var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
  {var journey = selectedCPR.journey /}
  {var notRetrievedLastNameList = null /}
  {if cpr[journey].retrPannelReq}
		{set notRetrievedLastNameList = this.moduleCtrl.findNotRetrievedLastNameList(cpr[journey]) /}
		{set temp = this.moduleCtrl.setNotRetrievedLastNames(notRetrievedLastNameList) /}
  {/if}

  {var success = moduleCtrl.getSuccess() /}
  {var errorss = moduleCtrl.getErrors() /}



<div class='sectionDefaultstyle sectionDefaultstyleSsci'>
<section>
	/*Displaying SSCI Warnings */
	<div id="pageWiseCommonWarnings"></div>
	<div id="pageCommonError"></div>
	<div id="tripOverviewErr"></div>
	<div id="pageErrors"></div>
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
	<div class="message info">
	  <p>${this.label.modifyCheckinWontallowdesclimer}</p>
    </div>
	<form>
		<header>
  			 <h3>${label.RefText}: <strong>${cpr[journey].bookingInformations[cpr[journey].paxList[0]].recordLocator}</strong></h3>
   	    </header>
        <article class="panel">
	  	 	 <header>
	    	    <h1>${cpr[journey][cpr[journey].firstflightid].departureAirport.airportLocation.cityName} - ${cpr[journey][cpr[journey].lastflightid].arrivalAirport.airportLocation.cityName}
	    	    {var flightSectionList = ""/}
	    	    {foreach flightNo in cpr[journey].flightList}
					{set flightSectionList = flightSectionList + " section"+flightNo/}
	    	    {/foreach}
	     	    <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="section4${flightSectionList}"><span>Toggle</span></button>
	     	    </h1>
	     	 </header>
	         <section id="section4" data-aria-hidden="false">



					<div class="trip large-display">
						/* Timings for the journey */
						{var firstflight = cpr[journey].firstflightid /}
						{var lastflight = cpr[journey].lastflightid /}
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
			           //  <li class="duration"><span class="label">Duration:</span> <span class="data">3 hr 45 min</span></li>
			            {var flightSectionList = ""/}
			    	    {var firstFlightNo = cpr[journey].flightList[0]/}
			    	    {var depCityCode = cpr[journey][firstFlightNo].departureAirport.locationCode /}
						{var arrCityCode = cpr[journey][firstFlightNo].arrivalAirport.locationCode /}

			          </ul>
			          /*
			          	For send boarding passes and cancel checkin tabs -- 1
			          */
			          <!--For Boarding Passes -->

				{var boolSPBP = false /}
				{var boolMBP = false /}
				{var boolSMS = false /}
				{var boolPassBook = false /}
				{var boolBP = false /}

				<!-- Logic Section For Boarding Passes -->
				//SPBP
				{if parameters.SITE_SSCI_ENBL_EML_BP && parameters.SITE_SSCI_ENBL_EML_BP.search(/true/i) != -1 && parameters.SITE_SSCI_SPBP_BDY_FMT_CD && parameters.SITE_SSCI_SPBP_BDY_FMT_CD.trim() != ""}
					{set boolSPBP = true/}
				{/if}

				//MBP and SMS
				{var allowMBP = true/}
			  	{var allowSMS = true/}
			    {if cpr[journey].paxList.length != 1}
					{if parameters.SITE_SSCI_ALW_MBP_MULTPAX && parameters.SITE_SSCI_ALW_MBP_MULTPAX.search(/false/i) != -1}
						{set allowMBP = false/}
			  		{/if}
					{if parameters.SITE_SSCI_ALW_SMS_MULTPAX && parameters.SITE_SSCI_ALW_SMS_MULTPAX.search(/false/i) != -1}
						{set allowSMS = false/}
			  		{/if}
			    {/if}
			    {if parameters.SITE_SSCI_ENBL_SMS_BP && parameters.SITE_SSCI_ENBL_SMS_BP.search(/true/i) != -1 && allowSMS && parameters.SITE_SSCI_SMS_BDY_FMT_CD && parameters.SITE_SSCI_SMS_BDY_FMT_CD.trim() != ""}
			    	{set boolSMS = true/}
			    {/if}
			    {if allowMBP && parameters.SITE_SSCI_MBP_BDY_FRMT_CD && parameters.SITE_SSCI_MBP_BDY_FRMT_CD.trim() != ""}
			    	{set boolMBP = true/}
			    {/if}

				//PASSBOOK
				{var ver = this.findIOSVersion()/}
				{var versionTrue = false /}
			    {if typeof ver !== "undefined" && ver[0]>=6}
			  		{set versionTrue = true/}
				{/if}
				{if aria.core.Browser != null && aria.core.Browser.isIOS != null && versionTrue && parameters.SITE_SSCI_PSSBK_FRMT_CD && parameters.SITE_SSCI_PSSBK_FRMT_CD.trim() != ""}
					// {if cpr[journey].paxList.length == 1 && cpr[journey].flightList.length == 1}
						{set boolPassBook = true /}
					//{/if}
				{/if}

				{if boolSPBP || boolMBP || boolSMS || boolPassBook}
					{set boolBP = true /}
				{/if}

					  <ul class="btnInPanel">

					  	//<li><a {on click { fn:"showBPContentSlider" }/} href="javascript:void(0)" id="boardingPnl" class="secondary sendBpContiner">Send Boarding pass</a><div class="arrowIcon"></div></li>
					  	{if this.parameters.SITE_SSCI_SND_BP_OPT_TOVR.search(/true/i) != -1 && boolBP}
			          	<li {on click {fn : "onSendBPButtonClick"} /}><a href="javascript:void(0)" id="boardingPnl" class="secondary sendBpContiner">${label.SendBoardingpass}</a><div class="arrowIcon"></div></li>

			          		<li class="boardingPassCont" style="display:none">
							  <section>
							    <article class="shoppingDeals">
							      <ul class="sliderBtns">

						        	/*SPBP Button Start*/
						        	{if boolSPBP}
					        	  		//<li class="secondary email disable-select"><a href="javascript:void(0)" {on click {fn : "onEmailButtonClick"} /} ><span class="icon-envelope"></span>${label.Email}</a></li>
					        	  		<li class="secondary email mcitripoverpg" {on click {fn : "onEmailButtonClick"} /}><span class="icon-envelope"></span>${label.Email}</li>
					        	  	{/if}
									/*SPBP Button End */
									/*SMS Button Begin*/
									{if boolSMS}
								  		//<li class="secondary sms disable-select"><a href="javascript:void(0)" {on click "onSMSButtonClick" /}><span class="icon-mobile"></span></span>${label.Sms}</a></li>
								  		<li class="secondary sms mcitripoverpg" {on click {fn : "onSMSButtonClick"} /}><span class="icon-mobile"></span>${label.Sms}</li>
								  	{/if}
									/*SMS Button End*/
									/*PassBook Button Start */
									{if boolPassBook}
							            //<li class="secondary add-passbook disable-select" ><a href="javascript:void(0)" {on click {fn : "onPassBookButtonClick"} /} ><span class="icon-ticket"></span></span>${label.Passbook}</a></li>
							            <li class="secondary add-passbook mcitripoverpg" {on click {fn : "onPassBookButtonClick"} /}><span class="icon-ticket"></span>${label.Passbook}</li>
							        {/if}
									/*PassBook Button End */
									/*MBP Button Start */
									{if boolMBP}
					              		//<li class="secondary app disable-select"><a href="javascript:void(0)" {on click {fn : "onMBPButtonClick"} /} ><span class="boardingPass"></span>${label.Boarding}</a></li>
					              		<li class="secondary app mcitripoverpg" {on click {fn : "onMBPButtonClick"} /}><span class="boardingPass"></span></span>${label.Boarding}</li>
					              	{/if}
						            /*MBP Button End*/

							      </ul>
							    </article>
							  </section>
							</li>
						{/if}

			          	{if this.parameters.SITE_SSCI_CNCL_CHKIN_TOVR.search(/true/i) != -1}
                      		<li><a {on click { fn:"gotoSelectPAX", args: {"flow" : "cancelCheckin"}} /} href="javascript:void(0)" class="secondary cancelCheckin">${label.cancelChkn}</a></li>
                      	{/if}
					  </ul>
			        </div>




		{@touch:Popup {
            absolutePosition: {
                left: 0,
                bottom: 0
            },
            closeOnMouseClick : true,
			closeOnMouseScroll : false,
            contentMacro: {
            	name:"getPopupContent",
            	args:[boolSPBP, boolSMS, boolPassBook, boolMBP]
            	},
            animateOut: "slide up",
            animateIn: "slide up",
            modal: true,
            bind:{
                "visible": { inside: this.inData, to: 'bottomup' }
            }
        }/}

       		</section>
			//Here Flight is Flight No
			{foreach flight in cpr[journey].flightList}
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
	            <section  class="segment" id="section${flight}" data-aria-hidden="false">

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
	                	<span>${label.PaxServiceLabel}</span>
	        			<button type="button" role="button" class="toggle" data-aria-expanded="false" data-aria-controls="services0${flight}" ><span>Toggle</span></button>
	                </h2>
	        	   </header>

	                <div id="services0${flight}" data-aria-hidden="false" style="display: none;">

//	                	<p class="services-checked-label">Select services to view or modify:</p>
//
//	                    <ul class="services-checked">
//	                    	<li class="seats">
//	                        <p class="amount"><span>1</span></p>
//	                        <a href="SEAT_CHARGABLE.html"><span><img src="../../img/baseline/services/seats.jpg"></span><p class="label">Seats</p><p class="price">Incl. in price</p></a></li>
//	                    </ul>

	                    <ul class="services-pax">

	                    {foreach pax in cpr[journey].paxList}
	                    	{var customer = cpr[journey][pax]/}
	                    		{if cpr[journey].customerDetailsBeans[customer.ID].custRetrieved}
			                    	{if customer.passengerTypeCode != "INF"}
			                    		{var paxStandBy = false /}
			                    		{var paxCheckedin = false /}
			                    		{var checkedinPax = 0 /}
			                    		{var totalLegInSegment = cpr[journey][flight].leg.length /}
										{var infantPrimeId = "" /}
										{var infant = "" /}


										/* Start :: To Check if passenge is checked in or in standby mode */
										{foreach leg in cpr[journey][flight].leg}
											{var legID = leg.ID/}
											{if cpr[journey].status.legPassenger[pax+legID+"CAC"]}
												{if cpr[journey].status.legPassenger[pax+legID+"CAC"].status[0].code == '1' && cpr[journey].status.legPassenger[pax+legID+"CAC"].status[0].listCode == "CAC"}
													{set paxCheckedin = true /}
		            						        {set checkedinPax = checkedinPax+1 /}
		            						        {var productID = this.moduleCtrl.findProductidFrmflightid(cpr[journey],pax,flight) /}
													{var temp= this.moduleCtrl.addCheckedInProductID(productID) /}
												{/if}
											{/if}
											{if cpr[journey].status.legPassenger[pax+legID+"CST"]}
												{if cpr[journey].status.legPassenger[pax+legID+"CST"].status[0].code == '1' && cpr[journey].status.legPassenger[pax+legID+"CST"].status[0].listCode == "CST"}
													{set paxStandBy = true /}
		            						        {set checkedinPax = checkedinPax+1 /}
		            						        {var productID = this.moduleCtrl.findProductidFrmflightid(cpr[journey],pax,flight) /}
													{var temp= this.moduleCtrl.addCheckedInProductID(productID) /}
												{/if}
											{/if}
										{/foreach}
										/* End :: To Check if passenge is checked in or in standby mode */

										  /* Start :: To check if all passenger has checkedin or not */
								          {if checkedinPax != totalLegInSegment}
								            {set paxCheckedin = false/}
								          {else/}
								            {set paxCheckedin = true/}
								          {/if}
								          /* End :: To check if all passenger has checkedin or not */

										{if customer.accompaniedByInfant == true }
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
										{/if}
										/* End :: To check if infant is associated to pax or not */


					                    	<li {if customer.passengerTypeCode == "ADT"}{elseif customer.passengerTypeCode == "CHD"/}class="child"{/if}>
					                    		{if customer.personNames[0].namePrefixs[0]}
					                        		<h4>${jQuery.substitute(label.PaxName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenNames[0], customer.personNames[0].surname])}</h4>
					                        	{else/}
					                        		<h4>${jQuery.substitute(label.PaxName, ["",customer.personNames[0].givenNames[0], customer.personNames[0].surname])}</h4>
					                        	{/if}
					                        	<dl>
			                            			{if paxStandBy}<dt><strong class="tag stand-by">${label.StandBy}</strong></dt>{elseif paxCheckedin /}<dt><strong class="tag checked-in">${label.CheckedIn}</strong></dt>{/if}
			                           		    </dl>
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

					                            <dl>
					                            	<dt>${label.FFNumber}:</dt> <dd>{if number != ""}{if carrier}${carrier}-{/if} ${number}{else/}-{/if}</dd>
					                            </dl>
					                             <dl>
					                             	{var passengerFlightCode = pax+flight /}
					                             	{var passengerLegCode = pax+cpr[journey][flight].leg[0].ID /}
					                             	<dt>${label.Cabin}:&nbsp;</dt><dd>${moduleCtrl.getCabinClassByName(cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass)}<abbr>(${cpr[journey].cabinInformation.legPassenger[passengerLegCode].bookingClass})</abbr> </dd>
					                             	{var passengerLegCodeSeat = passengerLegCode + "SST"/}
					                            	<dt>${label.Seat}: </dt> <dd> {if cpr[journey].seat[passengerLegCodeSeat].status.code == "U"}-{elseif cpr[journey].seat[passengerLegCodeSeat].status.code == "A" /}${cpr[journey].seat[passengerLegCodeSeat].row}${cpr[journey].seat[passengerLegCodeSeat].column}{/if}</dd>
					                            </dl>
					                        </li>
											{if customer.accompaniedByInfant == true }
											<li class="infant">
					                            {if infant.personNames[0].namePrefixs[0] && customer.personNames[0].namePrefixs[0]}
					                        		<h4>${jQuery.substitute(label.PaxName, [infant.personNames[0].namePrefixs[0],infant.personNames[0].givenNames[0],infant.personNames[0].surname])}</h4>
					                        		<dl>
			                            				{if paxStandBy}<dt><strong class="tag stand-by">${label.StandBy}</strong></dt>{elseif paxCheckedin /}<dt><strong class="tag checked-in">${label.CheckedIn}</strong></dt>{/if}
			                           		        </dl>
						                        	<dl>
						                             	<dt>${label.TravellingWith} </dt> <dd>${jQuery.substitute(label.PaxName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenName,customer.personNames[0].surname])}</dd>
						                            </dl>
					                        	{else/}
					                        		<h4>${jQuery.substitute(label.PaxName, ["",infant.personNames[0].givenNames[0],infant.personNames[0].surname])}</h4>
						                        	<dl>
				                            			{if paxStandBy}<dt><strong class="tag stand-by">${label.StandBy}</strong></dt>{elseif paxCheckedin /}<dt><strong class="tag checked-in">${label.CheckedIn}</strong></dt>{/if}
				                           		    </dl>
						                        	<dl>
						                             	<dt>${label.TravellingWith} </dt> <dd>${jQuery.substitute(label.PaxName, ["",customer.personNames[0].givenNames[0],customer.personNames[0].surname])}</dd>
						                            </dl>
					                        	{/if}
											 </li>
											{/if}
									{/if}
							{/if}
						{/foreach}


	                    </ul>

	                </div>

					  /*
			          	For send pax checked in, edit pax details -- 2
			          */
			        {if (parseInt(flight_index)+1) == cpr[journey].flightList.length}
						<div class="buttonsInPanel">{if cpr[journey].onePaxCheckedIn}
			    				{if this.parameters.SITE_SSCI_EDT_REG_CHKD && this.parameters.SITE_SSCI_EDT_REG_CHKD.search(/true/i) != -1}
			    					<button type="button" {on click { fn:"gotoSelectPAX", args: {"flow" : "modifyCheckin"}}/} class="validation modifyCheckin">${label.overvModifyAlreadyCheckin}</button>
			    				{/if}
						    {/if}
		{if (this.parameters.SITE_SSCI_EDT_FQTV_CHKD) && (this.parameters.SITE_SSCI_EDT_FQTV_CHKD =="TRUE" || this.parameters.SITE_SSCI_EDT_FQTV_CHKD =="true")}

		      <button type="button" {on click { fn:"loadEditPaxDetailsScreen", args : {selectedPax:cpr[journey].paxList[0],index:0}}/} class="validation">${label.modifyPaxDetails}</button>

		{/if}</div>
					{/if}

        		</section>

			{/foreach}
    	</article>
    	<footer class="buttons">
	    	<button type="button" {on tap { fn:"onBackClick"}/} class="validation cancel" >${label.Modify}</button>
	    	{if !cpr[journey].allCheckedIn}
			      <button type="button" {on tap { fn:"gotoSelectPAX", args: {"flow" : "checkin"}}/} class="validation">${label.Checkin}</button>
			      <br /><br /><br /><br /><br />
		{/if}
    	{if cpr[journey].onePaxCheckedIn}
		    <button type="button" {on tap { fn:"gotoSelectPAX", args: {"flow" : "manageCheckin"}}/} class="validation">${label.MngChkn}</button>
	    {/if}
		    </footer>
	</form>
</section>
	/*Passenger Selection PopUp Starting */
		{section {
			id : "popupSection",
			macro : "popup"
		} /}
	/*Passenger Selection PopUp Ending */

	/*BoardingPass PopUp Starting */
		{section {
			id : "popupSectionBP",
			macro : "popupBP"
		} /}
	/*BoardingPass PopUp Ending */
	/*Exit row seat*/
	<div class="dialog native displayNone" id="exitRowConf">
      <p>${labelExitrow.Message}</p>

	  <div class="paxDetails">

	  </div>

      <ul class="padTop padBottom padleftFlightAlign">
	    <li class="displayInline padTop">
	      <input id="answeryes" type="radio" value="Y" name="answer">
	      <label class="padLeft" for="answeryes">${labelExitrow.Yes}</label>
	    </li>
	    <li class="displayInline padLeft">
	      <input id="answerno" type="radio" value="N" name="answer" checked>
	      <label class="padLeft" for="answerno">${labelExitrow.No}</label>
	    </li>
      </ul>

      <footer class="buttons">
        <button class="validation active" {on click { fn:"emergencyExitSeatAlllocation", scope:this.moduleCtrl}/} type="button">${labelExitrow.Confirm}</button>
        /*<button class="cancel" {on click { fn:"closeExitrowpopup", scope:this.moduleCtrl}/} type="reset">${labelExitrow.Cancel}</button>*/
      </footer>
    </div>
    /*End exit row seat*/
	<div class="popupBGmask" class="displayNone">&nbsp;</div>
	<div class="dialog native" id="cancelConf" class="displayNone">
		<div class="glosyEffect"><span class="firstBlock"></span><span class="secondBlock"></span><span class="thirdBlock"></span></div>
		<p>${label.cancelAllFlightConfirmation}</p>
		<footer class="buttons">
		<button id="okButton" class="validation active" type="submit">${label.Ok}</button>
		<button id="cancelButton" class="cancel" type="reset">${label.Abort}</button>
		</footer>
	</div>
</div>

{/macro}
   {macro popup()}
   		{if this.popUpSelected != ""}
		  {var cpr = this.moduleCtrl.getCPR() /}
		  {var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
		  {var journey = cpr[selectedCPR.journey]/}
		  <div class="popup input-panel" id="CommonPopup" style="display: none;">
				<article class="panel email">
				    <header>
				      <hgroup>
				        <h1>${label.cancelChkn}</h1>
				      </hgroup>
				    </header>

				    <section>
				     /* to display any email validation errors */
				    <div id="initiateandEditCommonErrors">
				    </div>
				      <label>${label.cancelChkn}:</label>
				      <ul class="services-pax selectable">
				        /*Start of Email Input Boxes */
				      	{foreach customerInfo in selectedCPR.custtoflight}
				      			{var customer = journey[customerInfo.customer] /}
				      			{if customer.passengerTypeCode != "INF"}
				      				/*Begin Checking Boarding Pass Printed or not for adult(for infant same as adult) and child */
		            		        /* NOTE : Here We are not setting value for infant as,we take the infants value from its adult */
		            		        /*NOTE : Setting l_cprBpPrinted true in case printed in any one of the selected flights for the customer*/
				            		{var l_cprBpPrinted = false /}
				            		{foreach flightId in customerInfo.product}
					            		{if this.parameters.SITE_SSCI_DSBL_CSL_BP_GEN && this.parameters.SITE_SSCI_DSBL_CSL_BP_GEN.search(/false/i) == -1 && !l_cprBpPrinted}
					            			{var PassengerFlightConstraint = customer.ID+flightId/}
					            			{set l_cprBpPrinted = journey.productDetailsBeans[PassengerFlightConstraint].boardingPassPrinted/}
					            		{/if}
				            		{/foreach}
				            		/*End Checking Boarding Pass Printed or not for adult(for infant same as adult) and child */
							        <li {if customer.passengerTypeCode == "CHD"}class="child"{/if} >
							          <input type="checkbox" id="pax${customer.ID}" name="pax11" value="${customer.ID}" class="customerSelectCheckBox"{if l_cprBpPrinted} disabled {else/}checked =""{/if}>
							          <label for="pax${customer.ID}">
							          <h4>{if customer.personNames[0].namePrefixs[0]}${customer.personNames[0].namePrefixs[0]}{/if} {if customer.personNames[0].givenNames[0]}${customer.personNames[0].givenNames[0]}{/if} {if customer.personNames[0].surname}${customer.personNames[0].surname}{/if}</h4>
							          {if customer.accompaniedByInfant}
							        	  <span class="infant">
							        	  <h4>
						          			{var infantId = this.moduleCtrl.findInfantIDForCust(selectedCPR.product[0],customer.ID)/}
						          			{var infant = journey[infantId]/}
						          			{if infant.personNames[0].namePrefixs[0]}${infant.personNames[0].namePrefixs[0]}{/if} {if infant.personNames[0].givenNames[0]}${infant.personNames[0].givenNames[0]}{/if} {if infant.personNames[0].surname}${infant.personNames[0].surname}{/if}
						          		  </h4>
						          		  </span>
							          {/if}
							          </label>
							        </li>
						        {/if}
				        {/foreach}
				      </ul>
				    </section>
				    <footer class="buttons">
				  		<button type="submit" {on click {fn : "onCancelCheckinClick"}/} id = "cancelCheckinAfterPassengerSel" class="validation">${label.cancelChkn}</button>
	    			    <button type="submit" class="validation cancel" formaction="javascript:void(0);">${label.Cancel}</button>
				    </footer>
				</article>
		</div>
	 {/if}
   {/macro}
   {macro getPopupContent(boolSPBP,boolSMS,boolPassBook,boolMBP)}
	  {if this.inData.popupContent != null}

	        {if this.inData.popupContent == "menubottom"}

	        	/*<ul>
	        		<li><a {on tap "onOverlClose" /} href="javascipt:void(0)">Email</a></li>
	        		<li><a {on tap "onOverlClose" /} href="javascipt:void(0)">SMS</a></li>
	        		<li><a {on tap "onOverlClose" /} href="javascipt:void(0)">Boarding</a></li>
	        		<li><a {on tap "onOverlClose" /} href="javascipt:void(0)">Passbook</a></li>
	        	</ul>*/
	        	<ul>
			        	/*SPBP Button Start*/
			        	  {if boolSPBP}
		        	  		<li><a class="secondary email" {on tap "onOverlClose" /} {on click {fn : "onEmailButtonClick"} /} ><span data-aria-hidden="true" class="icon icon-email" style="display: none;"></span>${label.Email}</a></li>
		        	  		//<li {on click {fn : "onEmailButtonClick"} /}><span class="icon icon-email"></span>${label.Email}</li>
		        	  {/if}
						/*SPBP Button End */
						/*SMS Button Begin*/
						  {if boolSMS}
					  		<li><a class="secondary sms" {on tap "onOverlClose" /} {on click "onSMSButtonClick" /}><span data-aria-hidden="true" class="icon icon-sms" style="display: none;"></span>${label.Sms}</a></li>
					  {/if}
						/*SMS Button End*/
						/*PassBook Button Start */
						  {if boolPassBook}
				              	<li><a class="secondary add-passbook" {on tap "onOverlClose" /} {on click {fn : "onPassBookButtonClick"} /}><span data-aria-hidden="true" class="icon icon-passbook" style="display: none;"></span>${label.Passbook}</a></li>
				            {/if}
						/*PassBook Button End */
						/*MBP Button Start */
						  {if boolMBP}
		              		<li><a class="secondary app" {on tap "onOverlClose" /} {on click {fn : "onMBPButtonClick"} /} ><span data-aria-hidden="true" class="icon icon-qrcode" style="display: none;"></span>${label.Boarding}</a></li>
		              {/if}
			            /*MBP Button End*/
	        	</ul>

	        {/if}
	  {/if}
   {/macro}
{macro popupBP()}
		  {var cpr = this.moduleCtrl.getCPR() /}
		  {var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
		  {var journey = cpr[selectedCPR.journey]/}
		  {if this.popUpSelected != ""}
		  <div /* {if this.popUpSelected == "passbook"}class="dialog native"{else/} */ class="popup input-panel" /*{/if} */ id="CommonPopupBP" style="display: none;">
/* 		  {if this.popUpSelected == "passbook"}
				<p>${label.passbkMsg}</p>
		        <footer class="buttons">
		          <button class="validation active" type="button" {on tap {fn : "onPassbookClick"}/}>${label.yes}</button>
		          <button class="cancel" type="reset">${label.ntNow}</button>
		        </footer>
		  {else/} */
				<article class="panel email">
				    <header>
				      <hgroup>
				        <h1>{if this.popUpSelected == "passbook"}${label.Passbook}{elseif this.popUpSelected == "Email"/}${label.EmailBoardingPass}{elseif this.popUpSelected == "SMS"/}${label.SMSBoardingPass}{elseif this.popUpSelected == "MBP"/}${label.IssueBoardingPass}{/if}</h1>
				      </hgroup>
				    </header>

				    <section>
				     /* to display any email validation errors */
				    <div id="initiateandEditCommonErrorsForAllBP">
				    </div>
				      <label>{if this.popUpSelected == "Email"}${label.SendBoardingpass}:{elseif this.popUpSelected == "SMS"/}${label.Sendsmsto}{elseif this.popUpSelected == "MBP"/}${label.IssueMsg}:{/if}</label>

				        {if this.popUpSelected == "passbook"}
				        <ul class="btnInPanel arrowToAllHeader">
				        	{foreach flighttocust1 in selectedCPR.flighttocust}
				        		<li {on click {fn : "onPassbookFlightButtonClick", args: {"flightID" : flighttocust1.product}}/} > <a href="javascript:void(0)" id="PassbookPnl" class="secondary sendBpContiner">${journey[flighttocust1.product].departureAirport.airportLocation.cityName} - ${journey[flighttocust1.product].arrivalAirport.airportLocation.cityName}</a><div name="passbookArrow" class="arrowIcon arrowIcon${flighttocust1.product}"></div></li>
				        		<li name="pkFlightButtons" class="PassbookCont${flighttocust1.product}" style="display:none">
								<section>
					   			 <article class="shoppingDeals">
						    	  <ul class="sliderBtns passbooksliderBtns">
					        		{foreach custIndex in flighttocust1.customer}
					        			{var customer = journey[custIndex]/}
					        			{var productID = this.moduleCtrl.findProductidFrmflightid(journey,custIndex,flighttocust1.product)/}
					        			//{if customer.passengerTypeCode != "INF"}
									        <li id="pkProduct${productID}"
									        {if this.data.passBookGenerated[productID] == "1"}
									        	class="secondary pkCreated"
								        	{else/}
								        		class="secondary"
									        {/if}
									        {on click {fn : "onPassbookClick",args : {"productID" : productID}} /} >
									          <span id=passbookImage></span>{if customer.personNames[0].namePrefixs[0]}${customer.personNames[0].namePrefixs[0]}{/if} {if customer.personNames[0].givenNames[0]}${customer.personNames[0].givenNames[0]}{/if} {if customer.personNames[0].surname}${customer.personNames[0].surname}{/if}

	          						          /*{if customer.accompaniedByInfant}
									        	  <span class="infant">
								          			{var infantId = this.moduleCtrl.findInfantIDForCust(selectedCPR.product[0],customer.ID)/}
								          			{var infant = journey[infantId]/}
								          			{if infant.personNames[0].namePrefixs[0]}${infant.personNames[0].namePrefixs[0]}{/if} {if infant.personNames[0].givenNames[0]}${infant.personNames[0].givenNames[0]}{/if} {if infant.personNames[0].surname}${infant.personNames[0].surname}{/if}
								          		  </span>
									          {/if}*/
									          /* </label>*/
									        </li>
					        			//{/if}

					        		{/foreach}
						     	   </ul>
							     </article>
						  		</section>
				        		</li>
				        	{/foreach}
			        	</ul>
				        {else/}
				      <ul class="services-pax selectable">
				        /*Start of Email Input Boxes */
				      	{foreach customerIndex in this.filteredCustomerList}

							{var customerNo = customerIndex_index/}
				      		{var customer = journey[customerIndex_index]/}

				      		{if customer.passengerTypeCode != "INF" }

					      		{var mbpAllowed_flag = true/}
								{var spbpAllowed_flag =true/}

					      		{foreach item in this.filteredSelectedFlightList}
						      		{var flightNo = item/}
						      		{var key = customerNo + flightNo/}
						      		{var checkedIn_flag = false/}

						      		/* To check if the pax is checked in */
						      		{foreach flighttocust in selectedCPR.flighttocust}
						      			{if flighttocust.product==flightNo}
						      			{foreach l_cust in flighttocust.customer}
							      			{if l_cust==customerNo}
							      				{set checkedIn_flag = true/}
							      			{/if}
						      			{/foreach}
						      			{/if}
						      		{/foreach}

						      		{if checkedIn_flag && journey.productDetailsBeans[key].MBPAllowed == false}
						      			{set mbpAllowed_flag = false /}
						      		{/if}

						      		{if checkedIn_flag && journey.productDetailsBeans[key].homePrintedBPAllowed == false}
						      			{set spbpAllowed_flag = false /}
						      		{/if}

					      		{/foreach}


						        <li {if customer.passengerTypeCode == "CHD"}class="child"{/if} >
						          <input type="checkbox" id="pax${customer.ID}" name="pax11" value="${customer.ID}" class="customerSelectCheckBox"
						          {if this.popUpSelected == "Email" && spbpAllowed_flag==false}
						          disabled="disabled"
						          {elseif (this.popUpSelected == "SMS" || this.popUpSelected == "MBP") && mbpAllowed_flag==false /}
						          disabled="disabled"
						          {else/} checked ="" {/if}>
						          <label for="pax${customer.ID}">

						          <h4>{if customer.personNames[0].namePrefixs[0]}${customer.personNames[0].namePrefixs[0]}{/if} {if customer.personNames[0].givenNames[0]}${customer.personNames[0].givenNames[0]}{/if} {if customer.personNames[0].surname}${customer.personNames[0].surname}{/if}</h4>

						          {if this.popUpSelected == "Email" && spbpAllowed_flag==false}
						          	<div class="bpInhibitedMsg">(${label.bpInhibited})</div>
						          {elseif (this.popUpSelected == "SMS" || this.popUpSelected == "MBP") && mbpAllowed_flag==false /}
						          	<div class="bpInhibitedMsg">(${label.bpInhibited})</div>
						          {/if}

						          {if customer.accompaniedByInfant}
						        	  <span class="infant">
						        	  <h4>
					          			{var infantId = this.moduleCtrl.findInfantIDForCust(selectedCPR.product[0],customer.ID)/}
					          			{var infant = journey[infantId]/}
					          			{if infant.personNames[0].namePrefixs[0]}${infant.personNames[0].namePrefixs[0]}{/if} {if infant.personNames[0].givenNames[0]}${infant.personNames[0].givenNames[0]}{/if} {if infant.personNames[0].surname}${infant.personNames[0].surname}{/if}
					          		  </h4>
					          		  </span>
						          {/if}

						          </label>

							      {var phoneNumber =""/}
						          {var areaCode=""/}
						          {var Email="" /}
				            	  {var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(customerNo,"Phone") /}
				          	 	  {if phoneandEmail != ""}
					                {set Email=phoneandEmail.split("~")[1] /}
					                {set phoneNumber=phoneandEmail.split("~")[0].substring(4) /}
		               			    {set areaCode = phoneandEmail.split("~")[0].substring(0,4) /}
				          		  {/if}
						          /*Begin Section After This Is Different for the Email and sms Popup */
						          {if this.popUpSelected == "Email" && spbpAllowed_flag==true}
					          		 <ul class="input-elements" id="ul1" data-aria-expanded="true">
							            <li>
										    {section {
            									id: "emailSection"+customer.ID,
            									macro: {name: "emailSection", scope : this, args : [customer.ID,Email]},
            									bindRefreshTo: [{to:"autocompleteEmailList", inside:this.emailautocomlete}]
											}/}
							            </li>
							         </ul>
						          {elseif this.popUpSelected == "SMS" && mbpAllowed_flag==true/}
						          		<ul class="input-group contact" id="ul1" data-aria-expanded="true">
								            <li class="width_36">
								              //<input id="areaCode${customerNo}" type="text" value="${areaCode}" placeholder="0033">
								              {call autocomplete.createAutoComplete({
													name: "areaCode"+customerNo,
													id: "areaCode"+customerNo,
													type: 'text',
													autocorrect:"off",
													autocapitalize:"none",
													autocomplete:"off",
													placeholder:"0033",
													value: areaCode,
													source: this.data.formattedPhoneList,
													maxlength:4,
													selectCode : true

											  })/}
								            </li>
								            <li class="width_64">
								              <input id="phoneNumber${customerNo}" maxlength="12" type="tel" value="${phoneNumber}" placeholder="${label.PmobNum}">
								            </li>
								        </ul>
								  {elseif this.popUpSelected == "MBP"/}

						          {/if}

						          /*Begin Section After This Is Different for the Email and sms Popup */

						        </li>
				        	{/if}
				        {/foreach}
				        /*End of Email Input Boxes */
				      </ul>
				        {/if}


				      <!--      <ul class="input-elements">
				        <li>
				          <label for="eMailPax01">Additional e-mail address(es): <small>(sepparate multiple addresses with comma ',')</small></label>
				          <input type="email" id="eMailPax01" name="eMailPax01" />
				        </li>
				      </ul>-->
				    </section>
				    <footer class="buttons">
				      {if this.popUpSelected == "Email"}
				      		<button type="submit" {on tap {fn : "onEmailClick"}/} id="sendBoardingPassButton" class="validation">${label.SendBoardingpass}</button>
				      {elseif this.popUpSelected == "SMS"/}
				      		<button type="submit" {on tap {fn : "onSMSClick"}/} id="sendBoardingPassButton" class="validation">${label.SendBoardingpass}</button>
				      {elseif this.popUpSelected == "MBP"/}
				      		<button type="submit" {on tap {fn : "onMBPClick"}/} id="sendBoardingPassButton" class="validation">${label.GetBoardingPass}</button>
				      {/if}
				      <button type="submit" class="validation cancel" formaction="javascript:void(0);">${label.Cancel}</button>
				    </footer>
				</article>
		 /*   {/if} */
		</div>
		{/if}
{/macro}

{macro emailSection(custID,email)}

{if document.querySelector("#"+"eMailPax"+custID) != undefined && document.querySelector("#"+"eMailPax"+custID).value != undefined}
{set email=document.querySelector("#"+"eMailPax"+custID).value /}
{/if}

{call autocomplete.createAutoComplete({
		name: "eMailPax"+custID,
		id: "eMailPax"+custID,
		type: 'email',
		autocorrect:"off",
		autocapitalize:"none",
		autocomplete:"off",
		value: email,
		source: this.emailautocomlete.autocompleteEmailList,
		maxlength:70,
		reqclearFieldImg:false,
		onclick:"acceptanceConfirmationcurrentlyFocussed=this.id",
		threshold:0,
		popupShow:true
  })/}
{/macro}
{/Template}