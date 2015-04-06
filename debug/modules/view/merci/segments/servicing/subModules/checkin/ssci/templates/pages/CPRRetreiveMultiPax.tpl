{Template {
	$classpath : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CPRRetreiveMultiPax",
	$macrolibs : {
		common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
	},
	$hasScript : true
}}
{macro main()}

	//Page level variables
	{var label = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.labels /}
	{var parameters = this.moduleCtrl.getModuleData().checkIn.MSSCICPRRetrieveMultiPax_A.parameters/}
	{var data = this.moduleCtrl.getCPR() /}
	{var selectedCPR = this.moduleCtrl.getSelectedCPR() /}
	{var journeyNo = selectedCPR.journey /}
	{var checkinFlightCnt = 0 /}

	/* To Check if the data is null or not */
	{if data != null}
			{var journey = data[journeyNo]/}

			/* Begin : For Retreive Pannel */
		 	{if journey.retrPannelReq}
				{set notRetrievedLastNameList = moduleCtrl.findNotRetrievedLastNameList(journey) /}
				{set temp = moduleCtrl.setNotRetrievedLastNames(notRetrievedLastNameList) /}
			{/if}
				/* END : For Retreive Pannel */

			<div class='sectionDefaultstyle sectionDefaultstyleSsci' id="multipaxAddpassengerBlock">
			<section>
			  /*Displaying SSCI Warnings */
			  <div id="pageWiseCommonWarnings"></div>
			  /* This div is used to display errors related to cpr */
			  <div id="cprErrors"></div>
			  /* This div is used to display errors related to nationality edits occured on nationality page, as it is the fall back page */
			  <div id="nationalityErrors"></div>
			  /* This div is used to display errors related to regulatory edits occured on regulatory page, as it is the fall back page */
			  <div id="RegulatoryErrors"></div>
			  <form id="CPRRetrieveMultipax" {on submit "retrieveOtherPassengersInTrip"/}>
			    <nav class="breadcrumbs">
			      <ul>
			        <li class="active"><span>1</span></li>
			        <li><span>2</span></li>
			        <li><span>3</span></li>
			        <li><span>4</span></li>
			      </ul>
			    </nav>
			    /* BEGIN : Retreive Panel
			     */
				{if journey.retrPannelReq}
			     <div class="message info">
			     	<p>${label.Morepaxintrip}</p>
			     </div>
			     <article class="panel">
			     	<header>
			     		<h1>${label.Retpax}</h1>
			     	</header>
			     	<section>
			     		<ul class="input-elements">
			     			<li class="nationality">
				     			<label for="lastNameToRetrieve">${label.LastnameFamily}</label>
				     			<input id="otherLastNameField" type="text">
			     			</li>
			     		</ul>
			     		<div class="actions">
						  <button id="lastNameToRetrieveButton" class="validation" type="button" role="button" {on click { fn:"retrieveOtherPassengersInTrip", args: {}}/}>${label.RetrieveLbl}</button>
						</div>
					  </section>
			     	</section>
			     </article>
			     {/if}
			     /*
			     * END : Retreive Pannel
			     */
			    <article class="panel list">
			      <header>
			        <h1>${label.PassengersToCheckin}</h1>
			      </header>
			      <section>
						<ul class = "checkin-list is-selectable" data-info = "pax-list">
			             /* Display the information of passengers along with the checkbox with an option to select the pasengers for checkin*/

					    {foreach customerNo in journey.paxList} /* Start :: Loop into all Passengers */
							{var customer = journey[customerNo]/}
								{if journey.customerDetailsBeans[customerNo].custRetrieved}
								/*
								 * NOTE All Infant will have CustRetrieved as True Because
								 * We are Exempting them from this check since there Value depends on their adult
								 */
									{if customer.passengerTypeCode != "INF"}
										/*Customer Variable For Infant */
										{var isInfantToPax = false /}
										{var infantToPax = "" /}
										{var infantPrimeId = "" /}
										{var infantToSamePax = true /}
										{var infantLinkedInFlights = 0 /}
										/*Customer Variable For No Of Checkedin Pax */
										{var paxCheckedin = false /}
										{set checkinFlightCnt = 0 /}
										/*Customer Variable For Restrictions */
										{var paxSBY = false /}
										{var paxPT = true /} /* For Ticket Not Associated */
										{var infantPaxPT = true /} /*for Ticket Association of Infant,Default(Value = true)in case customer Doesnot has infant associated */
										{var invalidFlights= 0/}

										{foreach flightNo in journey.flightList}  /* Start :: Loop into all Flights */
											{var flight = journey[flightNo] /}
											{set paxCheckedin = false /}
						          			{var checkedInLeg = 0 /} //In MCI R15 it is checkedinPax
											{var totalLegInSegment = flight.leg.length /}


											/* Start :: To check if all flights are valid for passenger */
											{if journey.productDetailsBeans[customerNo+flightNo].validPaxForFlight == false }
											{set invalidFlights = invalidFlights + 1 /}
											{/if}
											/* End :: To check if all flights are valid for passenger */


											{foreach leg in flight.leg}
												/* Start :: To Check if passenger is checked in or in standby mode */
												{if journey.status.legPassenger[customerNo+leg.ID+"CAC"] != null}
													{if journey.status.legPassenger[customerNo+leg.ID+"CAC"].status[0].code == '1'}
																{set paxCheckedin = true /}
																{set checkedInLeg = checkedInLeg+1 /}
												    {/if}
												{/if}
												{if journey.status.legPassenger[customerNo+leg.ID+"CST"] != null}
													{if journey.status.legPassenger[customerNo+leg.ID+"CST"].status[0].code == '1'}
																{set paxCheckedin = true /}
																{set checkedInLeg = checkedInLeg+1 /}
												    {/if}
												{/if}
												/* End :: To Check if passenger is checked in or in standby mode */
											{/foreach}

											/* Start :: To check if all legs has checkedin or not */
											{if checkedInLeg != totalLegInSegment}
												   {set paxCheckedin = false/}
						       			    {else/}
						           				   {set paxCheckedin = true/}
						           				   {set checkinFlightCnt = checkinFlightCnt+1 /}
											{/if}
											/* End :: To check if all legs has checkedin or not */


											/*Start :: To Check if Pax is allowed to checkin due to infant issue */
											{if journey.service != null}

												{foreach service in journey.service}

													{if service_index.indexOf('INFT') != '-1' && service_index.indexOf(flightNo) != '-1'}

														{var productID = service.referenceIDProductProductID/}
														{if journey.associatedProducts != null && journey.associatedProducts[productID].referenceIDProductPassengerID == customerNo}
															{set infantLinkedInFlights = infantLinkedInFlights+1 /}
															{if flightNo == journey.firstflightid }
																{set isInfantToPax = true /}
																{set infantToSamePax = true/}
																{set infantPrimeId = service.referenceIDProductPassengerID/}
																{set infantToPax = customerNo/}
															{/if}
														{/if}

													{/if}

												{/foreach}

											{/if}
											/*End  :: To Check if Pax is allowed to checkindue to infant issue  */




										{/foreach}
										/*End :: Flight Iteration Loop */

										/*Start :: Valid Ticket Associated or not */
										/*
										 * paxPT is for diabling the checkBox If this customer(in case of infant both adult and infant) doesnot have valid ticket on any one flight
										 */


										{if journey.customerDetailsBeans[customerNo].paxEligible}
											{set paxPT = true /}
										{else/}
											{set paxPT = false /}
										{/if}

										/*End :: Valid Ticket Associated or not */

										/*Start :: If passengers are same in both flights of journey then allow  */
										{if customer.accompaniedByInfant !=null && customer.accompaniedByInfant == true}
											{if infantLinkedInFlights != journey.flightList.length}
												{set infantToSamePax = false/}
											{/if}
											{if infantToSamePax}
													{set paxCheckedin = false /}
													{if !journey.customerDetailsBeans[infantPrimeId].paxEligible}
														{set infantPaxPT = false /}
													{/if}
											{else/}
													{set paxCheckedin = true /}
											{/if}
										{/if}
										/*End :: If passengers are same then allow */


										/* Start :: To check if all flights has checkedin or not */
										{if checkinFlightCnt < (journey.flightList.length - invalidFlights) }
											{set paxCheckedin = false /}
										{else/}
											{set paxCheckedin = true /}
										{/if}
										/* End :: To check if all flights has checkedin or not */




										{if !paxCheckedin}

								    		<li {if customer.passengerTypeCode == "CHD"}class="child"{/if} >

						            			<input type="checkbox" class="custSelCheckBox" id="cust_${customerNo}" name="${customerNo}" value="${customerNo}"
						            			{on click { fn:"paxSelection",args: {cust : customerNo}}/}
												/* Check for the SSR NOT Allowed Check */
												{if journey.customerDetailsBeans[customerNo].custRestrictedSSR}
													disabled="disabled"
												{/if}
					//	            			{if journey.eligibility != null}
					//	            				{var passengerID = customer.ID/}
					//	            				{var primeFlightID = journey.flightList[0]/}
					//	            				{if journey.eligibility[passengerID+primeFlightID+"A"]}
					//	            					{foreach reason in journey.eligibility[passengerID+primeFlightID+"A"].reasons}
					//	            						{if (reason.code == '82' && reason.listCode == "ELR") || (reason.code == '80' && reason.listCode == "ELR")}
					//	            							disabled="disabled"
					//	            						{/if}
					//	            					{/foreach}
					//
					//	            				{/if}
					//
					//	            			{/if}
												/*
												 *Incase of Adult with infant ,it which check infant value also Otherwise Its  infantPaxPT default value will be true
												 */
						            			{if ((paxPT != null && !paxPT)||(!infantPaxPT))}
						            				disabled="disabled"
						            			{elseif !journey.customerDetailsBeans[customerNo].bookingStatusEligibleInAnyFlight/}
						            			    disabled="disabled"
						            			{elseif !journey.customerDetailsBeans[customerNo].acceptanceAllowed/}
					            					disabled="disabled"
						            			{/if}



						            			/>

						                		<label for="cust_${customerNo}">
						                			{if customer.passengerTypeCode == "CHD"}
						                				<strong>${jQuery.substitute(label.ChildPassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong>
						                			{else/}
						                				<strong>${jQuery.substitute(label.PassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong>
						                			{/if}
						                	    </label>

												/* Check for the SSR NOT Allowed Check */
												{if journey.customerDetailsBeans[customerNo].custRestrictedSSR}
													<span class="checkindenained">${label.PaxSSRCantChkInAlone}</span>
												{/if}
					//	            			{if journey.eligibility != null}
					//	            				{var passengerID = customer.ID/}
					//	            				{var primeFlightID = journey.flightList[0]/}
					//	            				{if journey.eligibility[passengerID+primeFlightID+"A"]}
					//	            					{foreach reason in journey.eligibility[passengerID+primeFlightID+"A"].reasons}
					//	            						{if (reason.code == '82' && reason.listCode == "ELR") || (reason.code == '80' && reason.listCode == "ELR")}
					//	            							<span class="checkindenained">${label.PaxSSRCantChkInAlone}</span>
					//	            						{/if}
					//	            					{/foreach}
					//
					//	            				{/if}
					//
					//	            			{/if}
						            			{if !paxPT}
					            			        <span class="checkindenained">${label.TicketNotAssociated}</span>
					            			    {elseif !journey.customerDetailsBeans[customerNo].bookingStatusEligibleInAnyFlight/}
				            			    	 	<span class="checkindenained">${label.waitlisted}</span>
					            			    {elseif !journey.customerDetailsBeans[customerNo].acceptanceAllowed/}
					            			    	{if journey.customerDetailsBeans[customerNo].infantProblemInhibition}
					            			    		<span class="checkindenained">${label.InfantNotAssociated}</span>
					            			    	{elseif journey.customerDetailsBeans[customerNo].serviceRequiredInhibition/}
					            			    		<span class="checkindenained">${label.ServiceRequired}</span>
					            			    	{elseif journey.customerDetailsBeans[customerNo].unpaidServiceInhibition/}
					            			    		<span class="checkindenained">${label.UnpaidService}</span>
					            			    	{elseif journey.customerDetailsBeans[customerNo].alreadyBoardedInhibition/}
					            			    		<span class="checkindenained">${label.AlreadyBoarded}</span>
					            			    	{elseif journey.customerDetailsBeans[customerNo].docCheckRequiredInhibitionn/}
					            			    		<span class="checkindenained">${label.DocumentCheckRequired}</span>
					            			    	{else/}
					            			    		<span class="checkindenained">${label.CheckInInhibited}</span>
					            			    	{/if}
					            			    {/if}
						                	    {if isInfantToPax}
												    {call common.infantMacro(journey , infantToPax , paxCheckedin , infantPrimeId , label, infantPaxPT) /}
												{/if}
								            </li>
									     {else/}
									   			{if customer.passengerTypeCode == "ADT"}
									   				<li>
										                <input disabled="disabled" type="checkbox" class="custSelCheckBox" id="cust_${customerNo}" name="${customerNo}" value="${customerNo}" {on click { fn:"paxSelection", args: {cust : customerNo}}/} />
										                <label for="cust_${customerNo}"><strong>${jQuery.substitute(label.PassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong></label>

										                {if paxPT}
							                                  {if paxSBY}
							                                    <span class="greenHighlightIcon">${label.StandBy}</span>
							                                  {elseif paxCheckedin /}
							                                    <span class="greenHighlightIcon">${label.CheckedIn}</span>
							                                  {/if}
						                                {elseif !(infantToSamePax) /}
							                                  	/*Currently No Label for infant link issue Hence Infant Association Problem is shown*/
							                                  	<span class="greenHighlightIcon">${label.InfantNotAssociated}</span>
														{/if}

						                                {if isInfantToPax}
								                              {call common.infantMacro(journey , infantToPax , paxCheckedin , infantPrimeId ,label ,infantPaxPT) /}
										                {/if}

					          					    </li>
									        	{/if}
									        	{if customer.passengerTypeCode == "CHD"}
									        		<li>
													    <input disabled="disabled" type="checkbox" class="custSelCheckBox" id="cust_${customerNo}" name="${customerNo}" value="${customerNo}" {on click { fn:"paxSelection", args: {cust : customerNo}}/} />
														<label for="cust_${customerNo}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.personNames[0].givenNames[0], customer.personNames[0].surname])|escapeForHTML:false}</strong></label>

														/**
														 * Since infant or adult with infant cant checkin in without other hence not checKhing infantPaxPT here
														 */
					           			   		        {if paxPT}
					             		                     {if paxSBY}
					            		              	         <span class="greenHighlightIcon">${label.StandBy}</span>
					              			           	     {elseif paxCheckedin /}
					              				                 <span class="greenHighlightIcon">${label.CheckedIn}</span>
					              		 	                 {/if}
					              		 	            {elseif !(infantToSamePax) /}
							                                  	/*Currently No Label for infant link issue Hence Ticket Problem is shown*/
							                                  	<span class="greenHighlightIcon">${label.InfantNotAssociated}</span>
														{/if}

					           			           	 	 {if isInfantToPax}
					      		   		            		   {call common.infantMacro(journey , infantToPax , paxCheckedin , infantPrimeId ,label ,infantPaxPT) /}
					       		 	                 	 {/if}


									        		</li>
									        	{/if}
									     {/if}
							        {/if}
							{/if}
					   {/foreach}



						</ul>
			      </section>
			    </article>

			    /* START : Add PAssenger
			    <button type="button" {on click "toggleAddPaxPanel"/} id="AddPAx">Add Passenger</button>
			    <div id="addPassengerPanel" class="displayNone">
			    PNR: <input type="text" name="pnr" id="add_pnr"><br>
			    LastName: <input type="text" name="lastname" id="add_last_name" value="test"><br>
			    <button type="button" {on click "onAddPaxClick"/} id="AddPAx">Retreive</button>
			    </div>*/
			
			    /* END : Add PAssenger */
			    <footer class="buttons">
			      {if parameters.SITE_SSCI_ENBL_ADD_PAX && parameters.SITE_SSCI_ENBL_ADD_PAX.search(/true/gi)!= -1}<button type="button" class="validation cancel" id="addPassengerbutton" {on click { fn:"loadRequiredPage", args: {path:"modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CheckInNew",id:"multipaxAddpassengerBlock",input:{flow:"AddPassenger","selectedJourneyID":journeyNo}}, scope:this.moduleCtrl}/}>${label.addPassenger}</button><br><br><br><br><br>{/if}
			      <button type="button" {on click "onContinue"/} class="validation disabled" disabled = "disabled" id="multiPaxSelContinue">${label.Continue}</button>
			      <button type="button" class="validation cancel" id="multiPaxSelCancel" {on click "onBackClick"/}>${label.Cancel}</button>
			    </footer>
			  </form>
			</section>
			</div>
	{/if}
	{/macro}
{/Template}