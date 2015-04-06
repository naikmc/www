{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MConfFlightsItinerary',
	$dependencies: [
	  'modules.view.merci.common.utils.ServiceSelection'
	],
	$hasScript: true
}}

	{macro main()}
		{section {
			id: "confFlightsContent",
			type: "div",
			macro: 'createItn'
		}/}
	{/macro}

	{macro createItn()}
		<div class="services">
			{foreach segment2 in this.data.itinerary.segments}
				{if segment2_index <= this.data.itinerary.nbrOfStops && this.data.segmentIndex == segment2_index}
					{var hasInfant = false/}

					// variables declaration
					{var lastName = ''/}
					{var seatServicePaxNum = ''/}
					
					{if this.data.rqstParams.listTravellerBean != null 
						&& this.data.rqstParams.listTravellerBean.travellersAsMap != null}
						{if this.data.isCommonRetrPage}
							{var retrieveOtherPaxFlag = "N" /}
							{var lnames = ""/}
							{if (!this._merciFunc.isEmptyObject(this.data.rqstParams.reply.tripPlanBean.pnr.lastNames))}
								{set lnames = this.data.rqstParams.reply.tripPlanBean.pnr.lastNames.split("###") /}
							{/if}
							{if (lnames != "" && this.data.rqstParams.listTravellerBean.travellers.length > 1 && this.data.rqstParams.listTravellerBean.travellers.length != lnames.length)}
								{set retrieveOtherPaxFlag = "Y" /}
							{/if}
						{/if}
						{foreach current in this.data.rqstParams.listTravellerBean.travellersAsMap}
							{var showNames = 'N'/}
							{if this.data.isCommonRetrPage}
								{var idy = current.identityInformation /}
								{if (retrieveOtherPaxFlag == 'Y')}
									{if (!this._merciFunc.isEmptyObject(this.data.rqstParams.reply.tripPlanBean.pnr.lastNames))}
										{var allLastNamesArr = this.data.rqstParams.reply.tripPlanBean.pnr.lastNames.split("###")/}
										{if (allLastNamesArr.length == 1)}
											{if (this.data.rqstParams.reply.tripPlanBean.pnr.lastNames.toUpperCase() != idy.lastName.toUpperCase())}
												{set showNames = 'Y'/}
											{/if}
										{else/}
											{var statusVal = 'TRUE'/}
											{foreach lnam in allLastNamesArr}
												{if (lnam.toUpperCase() == idy.lastName.toUpperCase() && statusVal == "TRUE")}
													{set statusVal = 'FALSE'/}
												{/if}
											{/foreach}
											{if (statusVal == 'FALSE')}
												{set showNames = 'N'/}
											{else/}
												{set showNames = 'Y'/}
											{/if}
										{/if}
									{/if}
								{/if}
							{/if}								
							<div class="pax{if current.paxType.code=="INF"} infant{elseif (current.paxType.code=="CHD")/} child{else/} ADT{/if} {if (showNames == 'Y')}hidden{/if}">
								<h3>${this._getTravellerName(current)}</h3>
								// set last name of user
								{if (lastName == null || lastName == '') && current.identityInformation != null}
									{set lastName = current.identityInformation.lastName/}
								{/if}
								{if this._merciFunc.booleanValue(this.data.siteParams.servicesCatalog) && !this._merciFunc.isEmptyObject(this.data.rqstParams.tripPlanBean)}
									{call displayAllServices(segment2.id, Number(current_index)) /}
								{else/}
								{var seatData = this._getSeatInformation(segment2, current_index)/}
								{if !this._merciFunc.isEmptyObject(this.data.rqstParams.allServicesByPax) && seatData.printAllowed}
									{set seatServicePaxNum = seatData.seatServicePaxNum/}
									<input type="hidden" id="PREF_AIR_SEAT_ASSIGMENT_${seatData.paxNumber}_${segment2.id}" name="PREF_AIR_SEAT_ASSIGMENT_${seatData.paxNumber}_${segment2.id}" value="${seatData.seatServicePaxNum}"/>
																					<ul>
																						<li class="seat">
											<span class="label">${this.data.labels.tx_merci_text_seat}:</span> <span class="data">${seatData.seatServicePaxNum}
											{if seatData.charsString != ''}
											<small>(${charsString})</small>
											{/if}
											{if seatData.seatNumber.hasPriceInfo}
											<strong> - ${seatData.seatNumber.price.currency.code} ${seatData.seatNumber.price.priceWithTax}</strong>
											{/if}
											</span>
																						</li>
																					</ul>
								{else/}
									{set seatServicePaxNum = this.getSeatAssignment(current_index, segment2.id)/}
										{if seatServicePaxNum!=""}
											<input type="hidden" id="PREF_AIR_SEAT_ASSIGMENT_${current_index}_${segment2.id}" name="PREF_AIR_SEAT_ASSIGMENT_${current_index}_${segment2.id}" value="${seatServicePaxNum}"/>
											<ul>
												<li class="seat"><span class="label">${this.data.labels.tx_merci_text_seat}:</span> <span class="data">${seatServicePaxNum}</span></li>
											</ul>
										{/if}
								{/if}

							{/if} /* if catalogue */
							{if current.infant != null}
								<div class="pax infant">
									<h3>${current.infant.firstName} ${current.infant.lastName}${this._getPaxTypeString('INF')}</h3>
								</div>
								{if !hasInfant}{set hasInfant = true /}{/if}
							{/if}
							</div>
						{/foreach}
					{/if}
					{var isOperatedBySameAirline = true /}
					{if this._merciFunc.booleanValue(this.data.siteParams.siteHideSeatCodeShare) && !this._merciFunc.isEmptyObject(segment2.opAirline) && segment2.opAirline.code!=segment2.airline.code }
					  	{set isOperatedBySameAirline=false /}
					{/if}
					{var showPassbookButton = !this._merciFunc.isEmptyObject(this.data.passbookParams) && this._merciFunc.booleanValue(this.data.siteParams.siteEnablePassbook) /}
					{if (this.data.rqstParams.tripPlanBean != null && this.data.rqstParams.listseatassignmentbean != null
								 && isOperatedBySameAirline==true) || showPassbookButton}
						<div>
							{@html:Template {
								classpath: "modules.view.merci.segments.booking.templates.conf.MConfButtons",
								data: this._createConfButtonJSON(segment2, seatServicePaxNum, lastName, hasInfant, isOperatedBySameAirline, this.data.passbookParams)
							}/}
						</div>
						{set hasInfant = false /}
					{/if}
				{/if}
			{/foreach}
		</div>
	{/macro}
	
	{macro displayAllServices(segmentId, paxNumber)}
		<ul>
		  {var jsonSelection = this.data.rqstParams.tripPlanBean.air.services.selection /}
		  {var selection = new modules.view.merci.common.utils.ServiceSelection(jsonSelection, this.data.rqstParams.listItineraryBean.itineraries) /}

		  {foreach category inArray this.data.rqstParams.serviceCategories}
			{if category.code=='SPE'|| category.code=='GIFT' || category.code=='BUST' || category.code=='WIFI'}
				{var services = selection.getServices(category.code, paxNumber, null, null) /}
			{else/}
			{var services = selection.getServices(category.code, paxNumber, null, segmentId) /}
			{/if}			
			{if services.length}
			  <li>
			    ${category.name} -
			    {foreach service inArray services}
			      {separator}, {/separator}
			      ${this.formatServiceDisplay(selection, service)}
			    {/foreach}
			  </li>
			{/if}
		  {/foreach}
		</ul>
	{/macro}
{/Template}