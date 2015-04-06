{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MConfConn',
	$dependencies: [
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'aria.utils.Date'
	],
	$macrolibs: {		
		commonConfRetrieve: 'modules.view.merci.common.utils.MerciConfRetrieve'
	},
	$hasScript: true
}}

{var jsondataAward_dep = {}/}
{var jsontrip_URL = {}/}
{var jsondataAward_ret = {}/}

		

	{macro main()}
		{if pageObjBkMK.printUI==true}
		{var merciFunct = modules.view.merci.common.utils.MCommonScript/}
		/*
		{if this.bookmarkBtn == true}
			{if !merciFunct.isEmptyObject(aria.utils.Json.getValue(this.data, 'jsonObj')) && aria.utils.Json.getValue(this.data, 'jsonObj')!=""}
				{var jsonObj = (aria.utils.Json.getValue(this.data, 'jsonObj'))/}
				{if !merciFunct.isEmptyObject(jsonObj)}
					{var jsonFare=(jsonObj['RVNWFARESTATUS']||null)/}
					{var jsonTrip=(jsonObj['RVNWFAREINFO']||null)/}
					{var jsonDealMfare=(jsonObj['DEALFARESTATUS']||null)/}
					{var dealFareTrip=(jsonObj['DEALFAREINFO']||null)/}
					{var bookMarkParams=(jsonObj['BookMarkParameters']||null)/}
				{else/}
					{var jsonFare=null/}
					{var jsonTrip=null/}
					{var jsonDealMfare=null/}
					{var dealFareTrip=null/}
					{var bookMarkParams=null/}
				{/if}
			{/if}
		{/if}
		*/
		// execute only if data is provided
		{if this.data.rqstParams != null && this.data.globalList != null && this.data.labels != null && this.data.siteParams != null}

			// getting rebooking status
			{var bRebooking = false/}
			{if !this._merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.rebookingStatus)}
				{set bRebooking = this.data.rqstParams.fareBreakdown.rebookingStatus/}
			{/if}

			{if bRebooking == true && this.data.siteParams.siteAtcOrigItin != null && this.data.siteParams.siteAtcOrigItin.toLowerCase() == 'true'}
				// TODO include rebooking old itinerary JSP
			{elseif !this._isConfPage()/}
				<header class="summ">
					<h1>${this.data.labels.tx_merci_text_booking_fare_summary}</h1>
				</header>
			{/if}

			{var isLayOver = 0/}
			{var itineraries = []/}
			{if !this._merciFunc.isEmptyObject(this.data.rqstParams.listItineraryBean.itineraries)}
				{set itineraries = this.data.rqstParams.listItineraryBean.itineraries/}
			{/if}

			// data for apps
			{var tripURL = this._getTripURL()/}
			{var datAwdRetDate = null/}
			{var onwardDate = null/}
			{var beginDate = null/}
			{var bgDate = null/}
			{var bgDateObjGMT = null/}
			{var endDate = null/}
			{var endSegmentDate = null/}
			{var beginCityName = ''/}
			{var beginLocationCode = ''/}
			{var endLocationCode = ''/}
			{var endCityName = ''/}
			{var endLocCd = ''/}
			{var endLocationN = ''/}
			{var itineraryCount = 1/}
			{var bgDateObj=null/}
			{var displayDate=null/}
			{var flightNum=null/}
			{var airlineCode=null/}
			{var txtFlightDetail=null/}
			{var arrTime=null/}
			{var depTime=null/}
			{var flight_duration=null/}
			{var flight_duration_R = null/}
			
			{foreach itinerary in itineraries}
				{var flown = false /}
				{var flightCancelled = false /}
				{var lastFlown = "" /}
				{var isCancelledSegTop = "" /}
				{var segmentOneWaitlisted = "" /}
				{if this.isCommonRetrieveFlow()}
				{foreach opertatedValue inArray itinerary.segments}
					{var lastFlown = opertatedValue.segmentFlown /}
					{var statusCode = opertatedValue.afterSellRbdStatus.code /}
					{if statusCode == 'UN' || statusCode == 'UC' || statusCode == 'NO' || statusCode == 'HX'}
						{set isCancelledSegTop = "Y" /}
					{/if}
					{if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(opertatedValue.afterSellRbdStatus))}
						{if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(opertatedValue.afterSellRbdStatus.messageKey) && opertatedValue.afterSellRbdStatus.messageKey == 'tx_pltg_text_WaitlistedStatus')}
							{set segmentOneWaitlisted = "Y" /}
						{/if}
					{/if}
				{/foreach}
					{set flown = lastFlown != "" && lastFlown/}
					{set flightCancelled = isCancelledSegTop != "" && isCancelledSegTop == 'Y'/}
				{/if}				
				{var articleClass = this._getArticleCSS(itineraryCount, itineraries.length)/}
				{if (modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.isCommonRetrPage))}
					{set articleClass = "panel trip"/}
				{/if}		
				<article class="${articleClass}{if flightCancelled} cancelled{/if}{if flown || flightCancelled} flown{/if}">
					{set itineraryCount = itineraryCount+1 /}
					<header>
						<h1>
							{if this._isConfPage()}
								{if itinerary.segments != null && itinerary.segments.length > 0}
									${itinerary.segments[0].beginLocation.cityName} - ${itinerary.segments[itinerary.segments.length - 1].endLocation.cityName}
								{/if}
								<button id="btnItn${itinerary_index}" type="button" role="button" class="toggle" aria-expanded="${!flown && !flightCancelled}" {on click {fn:"toggleExpand", scope:this, args:{sectionId:"itn" + itinerary_index, buttonId:"btnItn" + itinerary_index}}/}>
									<span>Toggle</span>
								</button>
							{elseif this.data.rqstParams.reply.tripType.toUpperCase() == "C" || this.data.rqstParams.reply.tripType.toUpperCase() == "M"/}
								${this.data.labels.tx_merci_text_flight} ${parseInt(itinerary_index)+1}
							
							{else/}
								${this._getHeaderLabel(parseInt(itinerary_index))}
							{/if}
						</h1>
					</header>

					{var storedFareFamily = null/}
					{if this.data.globalList.cabinClasses != null && this.data.globalList.cabinClasses.length > 1}
						{foreach cabinClass in this.data.globalList.cabinClasses}
							{if cabinClass[0] == 'Y'}
								{set storedFareFamily = cabinClass[1]/}
							{/if}
						{/foreach}
					{/if}

					{if this._isConfPage()}
						<section id="itn${itinerary_index}" aria-hidden="{if flown || flightCancelled}true{else/}false{/if}">
					{/if}
					{foreach segment in itinerary.segments}
						{if segment != null}
							{if (isCancelledSegTop == 'Y')}
								<header>
									<h2 class="alert">${this.data.labels.tx_cancelled_status}</h2>
								</header>
							{/if}
							{if (segmentOneWaitlisted == 'Y')}
								<header>
									<h2 class="alert">${this.data.labels[segment.afterSellRbdStatus.messageKey]}</h2>
								</header>
							{/if}
							{call commonConfRetrieve.schdChangeSection(segment,itinerary,this)/}
							{if itinerary_index == 0}
								{if segment_index == 0}
									{set beginDate = segment.beginDate/}
									{set onwardDate = segment.beginDate/}
									{set beginLocationCode = segment.beginLocation.locationCode/}
									{set beginCityName = segment.beginLocation.cityName/}
									{if this.bookmarkBtn == true}
										{set bgDate = this._getFmDate(segment.beginDateBean)/}
										{set bgDateObjGMT = this._getDateTime(segment.beginDateGMTBean)/}
										{set endDate = this._getFmDate(segment.endDateBean)/}	
										{set bDate=segment.beginDateBean.formatDateTimeAsYYYYMMddHHMM /}
										{set bgDateObj = this._getDateTime(segment.beginDateBean)/}
										{set eDate=segment.endDateBean.formatDateTimeAsYYYYMMddHHMM /}
										{set beginLocationName = segment.beginLocation.cityName/}
										{set endLocCd = segment.endLocation.locationCode/}
										{set endLocationN = segment.endLocation.cityName/}
										{set keyOway = bDate +segment.flightNumber /}
										{set flightNum = segment.flightNumber /}
									{set airlineCode = segment.airline.code /}
									{set txtFlightDetail = this.data.labels.tx_merci_text_booking_avail_direct /}
									
									{var segEndDate = this._getDate(segment.endDateBean)/}
									{set segEndDate = new Date(segEndDate.getTime())/}

									{var segBeginDate = this._getDate(segment.beginDateBean)/}
									{set segBeginDate = new Date(segBeginDate.getTime())/}
									{set displayDate = this._merciFunc.formatDate(segBeginDate,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)/}
									
									{var arrHour = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arrTime =   arrHour + ":" + arrMin/}
									{var depTime =   depHour + ":" + depMin/}
									
									{set arrTime = arrTime /}
									{set depTime = depTime /}
										
									
									{var arr_time_Bskt =   arrHour + ":" + arrMin/}
									{set arr_time_Bskt = arr_time_Bskt /}
									{var dep_time_Bskt =   depHour + ":" + depMin/}
									{set dep_time_Bskt = dep_time_Bskt /}
									
									{set flight_duration = this._getDateDisplayString(new Date(parseInt(segment.flightTime))) /}	
									{/if}
								{elseif segment_index == 1/}
									{if this.bookmarkBtn == true}
										{set endLocCd = segment.endLocation.locationCode/}
										{set endLocationN = segment.endLocation.cityName/}
									{/if}
									{set flight_duration = this._getDateDisplayString(new Date(parseInt(segment.flightTime))) /}
									
									{var arrHour = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arr_time_Bskt =   arrHour + ":" + arrMin/}
									{set arr_time_Bskt = arr_time_Bskt /}
								{else/}
									{if this.bookmarkBtn == true}
										{set endLocCd = segment.endLocation.locationCode/}
										{set endLocationN = segment.endLocation.cityName/}
									{/if}
									{set flight_duration = this._getDateDisplayString(new Date(parseInt(segment.flightTime))) /}
									
									{var arrHour = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arr_time_Bskt =   arrHour + ":" + arrMin/}
									{set arr_time_Bskt = arr_time_Bskt /}
								{/if}

							{/if}

							{if itinerary_index == (itineraries.length - 1)}
								{if segment_index == (itinerary.segments.length - 1)}
									{if itinerary_index == 0}
										{set endLocationCode = segment.endLocation.locationCode/}
										{set endCityName = segment.endLocation.cityName/}
									
									{set flight_duration_R = this._getDateDisplayString(new Date(parseInt(segment.flightTime))) /}
									{var arrHour_R_bskt = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin_R_Bskt = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour_R_Bskt = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin_R_Bskt = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arrTime_R_Bskt =   arrHour_R_bskt + ":" + arrMin_R_Bskt/}
									{set arrTime_R_Bskt = arrTime_R_Bskt /}
									{var depTime_R_Bskt =   depHour_R_Bskt + ":" + depMin_R_Bskt/}
									{set depTime_R_Bskt = depTime_R_Bskt /}
									
									{else/}
										
									{set flight_duration_R = this._getDateDisplayString(new Date(parseInt(segment.flightTime))) /}
									{var arrHour_R_bskt = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin_R_Bskt = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour_R_Bskt = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin_R_Bskt = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arrTime_R_Bskt =   arrHour_R_bskt + ":" + arrMin_R_Bskt/}
									{set arrTime_R_Bskt = arrTime_R_Bskt /}

									{/if}
								{/if}
								{var abc= itinerary.segments.length -1/}
								{if itinerary_index != 0 && segment_index == 0}
									{set datAwdRetDate = segment.beginDate/}
									{set endSegmentDate= this._getFmDate(segment.beginDateBean)/}
									{set endLocationCode = segment.beginLocation.locationCode/}
									{set endCityName = segment.beginLocation.cityName/}
									{set returnDate = segment.beginDateBean.formatDateTimeAsYYYYMMddHHMM /}
									{set keyTway=returnDate +segment.flightNumber /}
									
									{var segEndDate_R = this._getDate(segment.endDateBean)/}
									{set segEndDate_R = new Date(segEndDate_R.getTime())/}
									
									{set beginDate = segment.beginDate/}
									{set beginLocationCode_R = segment.beginLocation.locationCode/}
									{set beginCityName_R = segment.beginLocation.cityName/}
									{if this.bookmarkBtn == true}
										{set bgDate_R = this._getFmDate(segment.beginDateBean)/}
										{set endDate_R = this._getFmDate(segment.endDateBean)/}	
										{set bDate_R=segment.beginDateBean.formatDateTimeAsYYYYMMddHHMM /}
										{set bgDateObj_R = this._getDateTime(segment.beginDateBean)/}
										{set eDate_R=segment.endDateBean.formatDateTimeAsYYYYMMddHHMM /}
										{set beginLocationName_R = segment.beginLocation.cityName/}
										{set endLocCd_R = segment.endLocation.locationCode/}
										{set endLocationN_R = segment.endLocation.cityName/}
									{/if}
									
									{var segBeginDate_R = this._getDate(segment.beginDateBean)/}
									{set segBeginDate_R = new Date(segBeginDate_R.getTime())/}
									{set displayDate_R = this._merciFunc.formatDate(segBeginDate_R,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)/}
									{set flightNum_R = segment.flightNumber /}
									{set airlineCode_R = segment.airline.code /}
									{set txtFlightDetail_R = this.data.labels.tx_merci_text_booking_avail_direct /}
									
									{var arrHour_R = segment.endDateBean.hourMinute.substr(0,2) /}
									{var arrMin_R = segment.endDateBean.hourMinute.substr(2,4) /}
									{var depHour_R = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin_R = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var arrTime_R =   arrHour_R + ":" + arrMin_R/}
									{var depTime_R =   depHour_R + ":" + depMin_R/}
									
									{set arrTime_R = arrTime_R /}
									{set depTime_R = depTime_R /}

									{var depHour_R_Bskt = segment.beginDateBean.hourMinute.substr(0,2) /}
									{var depMin_R_Bskt = segment.beginDateBean.hourMinute.substr(2,4) /}
									{var depTime_R_Bskt =   depHour_R_Bskt + ":" + depMin_R_Bskt/}
									{set depTime_R_Bskt = depTime_R_Bskt /}
								

								{elseif itinerary_index != 0 && itinerary.segments[abc]/}
									{set endLocCd_R = itinerary.segments[abc].endLocation.locationCode/}
									{set endLocationN_R = itinerary.segments[abc].endLocation.cityName/}
								{/if}

							{/if}

							<section id="segmentId${segment.id}" {if this._isConfPage()}class="marginLeftZero"{/if}>
								<div class="trip">

									{var segEndDate = this._getDate(segment.endDateBean)/}
									{set segEndDate = new Date(segEndDate.getTime())/}

									{var segBeginDate = this._getDate(segment.beginDateBean)/}
									{set segBeginDate = new Date(segBeginDate.getTime())/}

									{if segBeginDate != null}
										<time datetime="${this._merciFunc.formatDate(segBeginDate,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)}" class="date">${this._merciFunc.formatDate(segBeginDate,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)}</time>
									{/if}

									<p class="flight-number">
										{if this.data.siteParams.siteDisplayAirline != null && this.data.siteParams.siteDisplayAirline.toLowerCase() == 'true'}
											<strong>{if segment.airline != null}${segment.airline.code}{/if}${segment.flightNumber}</strong>&nbsp;
										{/if}
										{if segment.nbrOfStops == '0'}
											<span>${this.data.labels.tx_merci_text_booking_avail_direct}</span>
										{else/}
											${segment.nbrOfStops} ${this.data.labels.tx_merci_text_pnr_stop}
										{/if}
									</p>

									{if segment.beginLocation != null}
										<p class="location departure">
											<time datetime="${segBeginDate|timeformat: this.data.siteParams.siteFullTimeFmt}" class="hour">${segBeginDate|timeformat: this.data.siteParams.siteFullTimeFmt}</time> <span class="city">${segment.beginLocation.cityName}</span>
											<span class="dash">,</span>   <span class="airport">${segment.beginLocation.locationName}</span>
											<span class="terminal">
												{if segment.beginTerminal != null || segment.beginTerminal != ''}
													${this.data.labels.tx_merci_text_terminal} ${segment.beginTerminal}
												{/if}
											</span>
											<abbr class="city">
												{if segment.beginLocation.locationCode != null || segment.beginLocation.locationCode != ''}
													(${segment.beginLocation.locationCode})
												{/if}
											</abbr>
										</p>
									{/if}

                  {if segment.nbrOfStops > '0' && this.data.siteParams.siteDetailStopOver == "DETAILED"}
                   <p class="location stopOver">
                      <strong>${this.data.labels.tx_pltg_text_TechnicalStop}</strong>
                      {foreach details in segment.listTechnicalStops}
                         {var detBeginDate = new Date((details.arrivalDate).replace("GMT", ""))/}
                         {var detEndDate = new Date((details.departureDate).replace("GMT", ""))/}
                       <time datetime="${detBeginDate|timeformat: this.data.siteParams.siteFullTimeFmt}" class="hour">${detBeginDate|timeformat: this.data.siteParams.siteFullTimeFmt}</time>
                        <span class="dash">-</span>
                       <time datetime="${detEndDate|timeformat: this.data.siteParams.siteFullTimeFmt}" class="hour">${detEndDate|timeformat: this.data.siteParams.siteFullTimeFmt}</time>
                       <span class="city">
                        ${details.airportLocationBean.locationName}
                       </span>
                       <span class="dash">,</span><span class="airport">${details.airportLocationBean.locationName}</span>
                       <abbr class="city"> (${details.airportLocationBean.locationCode}) </abbr>
                      {/foreach}
                   </p>
                  {/if}

									{if segment.endLocation != null}
										<p class="location arrival">
											{if segEndDate != null}
												<time datetime="${segEndDate|timeFormat: this.data.siteParams.siteFullTimeFmt}" class="hour">${segEndDate|timeFormat: this.data.siteParams.siteFullTimeFmt}
												{var num=segment.nbDaysBetweenDepAndArrDates /}
												{if num >0}
													<small>(+ ${segment.nbDaysBetweenDepAndArrDates})</small>
												{/if}

												</time> <span class="city">${segment.endLocation.cityName}</span>												
											{/if}
											<span class="dash">,</span>   <span class="airport">${segment.endLocation.locationName}</span>
											<span class="terminal">
												{if segment.endTerminal != null || segment.endTerminal != ''}
													${this.data.labels.tx_merci_text_terminal} ${segment.endTerminal}
												{/if}
											</span>
											<abbr class="city">
												{if segment.endLocation.locationCode != null || segment.endLocation.locationCode != ''}
													(${segment.endLocation.locationCode})
												{/if}
											</abbr>
										</p>
									{/if}
								</div>
								<div class="details">
									<ul>
										{if segment.nbrOfStops == '0' && itinerary.segments.length == 1}
											<li class="duration">
												<span class="label">${this.data.labels.tx_merci_text_booking_fare_duration}:</span>  <span class="data">${this._getDateDisplayString(new Date(parseInt(segment.flightTime)))}</span>
											</li>
										{/if}
										{if this.data.siteParams.siteDisplayOperatedBy != null && this.data.siteParams.siteDisplayOperatedBy.toLowerCase() == 'true' && segment.opAirline != null && segment.opAirline.name != null && segment.opAirline.name != ''}
											<li class="aircraft">
												<span class="label">${this.data.labels.tx_merci_text_booking_operatedbycolon}</span>  <span class="data">${segment.opAirline.name}</span>
											</li>
										{else/}
											{if this.data.siteParams.siteOpInfoAllFlights != null && this.data.siteParams.siteOpInfoAllFlights.toLowerCase() == 'true' && segment.airline != null && segment.airline.name != null && segment.airline.name != '' && this.data.siteParams.sitePrefferedCarrier.indexOf(segment.airline.code) == -1}
												<li class="aircraft">
													<span class="label">${this.data.labels.tx_merci_text_booking_operatedbycolon}:</span>  <span class="data">${segment.airline.name}</span>
												</li>
											{/if}
										{/if}
										{if this.data.siteParams.siteDisplayAircraft != null && this.data.siteParams.siteDisplayAircraft.toLowerCase() == 'true' && !segment.isTrn}
											<li class="aircraft">
												<span class="label">${this.data.labels.tx_merci_text_booking_conf_aircraft}:</span>  <span class="data">${segment.equipmentName}</span>
											</li>
										{/if}

										{var fareFamilyLabel = this.data.labels.tx_merci_text_booking_fare_fare_family/}
										{if this.data.siteParams.siteAllowAwards != null && this.data.siteParams.siteAllowAwards.toLowerCase() == 'true' && !this._merciFunc.isEmptyObject(this.data.rqstParams.awardsFlow) && this.data.rqstParams.awardsFlow != ''}
											{set fareFamilyLabel = this.data.labels.tx_merci_award_type/}
										{/if}
										{if this.data.siteParams.sitePricing !== 'TRUE'}
										<li class="fare-family">
											<span class="label">${fareFamilyLabel}</span>
											<span class="data">
												{if this.data.siteParams.siteFpUICondType != null}
													{if this.data.siteParams.siteFpUICondType.toLowerCase() == 'html'}
														{if this.data.siteParams.siteHideCabinClass.toLowerCase() == 'false'}
														{if segment.cabins[0].code == 'R'}
															${storedFareFamily}
														{else/}
															{var separator = this.data.labels.tx_pltg_pattern_CabinNames/}
															{set separator = separator.substring(separator.indexOf(',') + 1)/}
															{set separator = separator.substring(separator.indexOf(',') + 1)/}
															{set separator = separator.substring(1, separator.length - 2)/}

															{var cabinNamesFormatted = ''/}
															{foreach cabin in segment.cabins}
																{set cabinNamesFormatted += cabin.name/}
																{if cabin_index != segment.cabins.length}
																	{set cabinNamesFormatted += separator/}
																{/if}
															{/foreach}

															${cabinNamesFormatted}
															{/if}
														{/if}
														{if segment.fareFamily != null && segment.fareFamily != ''}
															{if this.data.siteParams.siteFpUICondType.toLowerCase() == 'html'}
																{var serviceLevelURL = new modules.view.merci.common.utils.StringBufferImpl(modules.view.merci.common.utils.URLManager.getFullURL('MServiceAvailAction.action', null))/}
																${serviceLevelURL.append('&isUpSell=true&fareFamilyCode=' + segment.fareFamily.code)|eat}
																${serviceLevelURL.append('&OVERRIDE_FINAL_LOCATION=FALSE')|eat}
																{if this.data.rqstParams.param.PRICING_TYPE != null}${serviceLevelURL.append('&PRICING_TYPE=' + this.data.rqstParams.param.PRICING_TYPE)|eat}{/if}
																{if this.data.rqstParams.param.TRIP_TYPE != null}${serviceLevelURL.append('&TRIP_TYPE=' + this.data.rqstParams.param.TRIP_TYPE)|eat}{/if}

																{var segIdValue = ''/}
																{if segment.fareFamily.condition != null}
																	{if segment.fareFamily.condition.shortDescription != null}
																		{set segIdValue = segment.fareFamily.condition.shortDescription/}
																	{/if}
																	{if segment.fareFamily.condition.fullDescription != null}
																		{set segIdValue = segIdValue + segment.fareFamily.condition.fullDescription/}
																	{/if}
																{/if}

																<a href="javascript:void(0)" {on click {fn: 'openHTML',args: {link: serviceLevelURL.toString(), segId: segIdValue}}/}>
															{/if}
																${segment.fareFamily.name}
															{if this.data.siteParams.siteFpUICondType.toLowerCase() == 'html'}
																</a>
															{/if}
															{if this.data.siteParams.siteRBDDisplayReview != null && this.data.siteParams.siteRBDDisplayReview.toLowerCase() == 'true' && segment.cabins != null && segment.cabins.length > 0 && segment.cabins[0].RBD != null && segment.cabins[0].RBD != ''}
																&nbsp;<abbr>(${segment.cabins[0].RBD})</abbr>
															{/if}
														{/if}
													{elseif this.data.siteParams.siteFpUICondType.toLowerCase() == 'uri'/}
														{var conditionURL = ''/}
														{var fareFamilyCode = ''/}
														{var fareFamilyName = ''/}
														{if segment.fareFamily != null}
															{if segment.fareFamily.condition != null && segment.fareFamily.condition.url != null}
																{set conditionURL = segment.fareFamily.condition.url/}
															{/if}

															{if segment.fareFamily.code != null}
																{set fareFamilyCode = segment.fareFamily.code/}
															{/if}

															{if segment.fareFamily.name != null}
																{set fareFamilyName = segment.fareFamily.name/}
															{/if}
														{/if}
														{if this.data.siteParams.enblFFUriPopup == 'TRUE'}
															{call createHTMLDom(itinerary_ct,segment_ct)/}
															{var FFURL= "" /}
															{if segment.fareFamily && segment.fareFamily.condition && segment.fareFamily.condition.url}
																{set FFURL= segment.fareFamily.condition.url /}
															{/if}
															<a href="javascript:void(0)" {on click {fn: 'openURLHTML', scope: moduleCtrl, args: {ffNo: segment_ct, itinNo:itinerary_ct,moduleCtrl:moduleCtrl, isNewPopUpEnabled: this._merciFunc.booleanValue(this.data.siteParams.enableNewPopup), URL : FFURL}}/}>${fareFamilyName}</a>
														{else/}
														<a  href="javascript:void(0)" id="fareFamilyAvailOpen" {on click {fn: 'onFareFamilyLinkClick', args:{"url":conditionURL}}/} fareFamilyCode="${fareFamilyCode}">${fareFamilyName}</a>
													{/if}
												{/if}
												{/if}
											</span>
										</li>
										{/if}
										{if (this.data.siteParams.siteDisplayMealInfoOnFare != null && this.data.siteParams.siteDisplayMealInfoOnFare == 'TRUE')}
											{var mealName = ""/}
											{var mealCt = 0/}
											{if segment.mealNames != null}
											{foreach meal in segment.mealNames}
												{if mealCt != 0}
													{set mealName = mealName + ", " + meal/}
													{set mealCt = 1/}
												{else/}
													{set mealName = meal/}
												{/if}
											{/foreach}
											{/if}
											<li class="meal">
												<span class="label">${this.data.labels.tx_merci_text_fifo_meal}:</span>
												<span class="data">{if (meal != "")}${meal}{else/}${this.data.labels.tx_merci_text_info_not_available}{/if}</span>
											</li>
										{/if}
										{if this._isConfPage()}
											{var baggageNotDisplayed=getBaggageNotDisplayed(segment)/}
											{if !baggageNotDisplayed}
												{var travellerTypesInfos=segment.travellerTypesInfos/}
												{var firstBaggageAllowance=travellerTypesInfos[0].baggageAllowance/}
												{var bagAllowanceString=""/}
												<li>
													<span class="label">${this.data.labels.tx_pltg_text_Baggage} </span>
													<span class="data">
														{if !this._merciFunc.isEmptyObject(firstBaggageAllowance) && firstBaggageAllowance.code!='PC'}
															{if firstBaggageAllowance.inKilos}
																{set bagAllowanceString=getBagAllowanceString(this.data.labels.tx_pltg_pattern_valueAndKilogramsPerTraveller, firstBaggageAllowance.value)/}
															{elseif firstBaggageAllowance.inPieces/}
																{set bagAllowanceString=getBagAllowanceString(this.data.labels.tx_pltg_pattern_valueAndPiecesPerTraveller, firstBaggageAllowance.value)/}
															{/if}

														{else/}
															{set bagAllowanceString=this.data.labels.tx_pltg_text_InformationNotAvailable/}
														{/if}
															${bagAllowanceString}
													</span>
												</li>
											{/if}
										{/if}
										<li class="baggage">
											{if this.data.siteParams.siteEnableServicePolicy != null && this.data.siteParams.siteDispUSDot != null && this.data.siteParams.siteDispUSDot.toLowerCase() == 'true'
												&& (!this._merciFunc.isEmptyObject(this.data.rqstParams.airlineCodesMap) || !this._merciFunc.isEmptyObject(this.data.rqstParams.airlineCodesCarryOn))}
												<span class="dotLink">
													{var showUSDotSegmentWise=this._merciFunc.booleanValue(this.data.siteParams.siteDispUSDotBySeg) /}
													{var lastSeg = false/}
													{if parseInt(segment_index) == (itinerary.segments.length - 1)}
														{set lastSeg = true/}
													{/if}

													{var endLocItn = ''/}
													{if parseInt(segment_index) == itinerary.segments.length - 1}
														{set endLocItn = itinerary.segments[itinerary.segments.length - 1].endLocation.locationCode/}
													{/if}
													/*Adding below IF condition for PTR 07345579*/
													{if showUSDotSegmentWise==true || (showUSDotSegmentWise==false && lastSeg==true)}
													{@html:Template {
														classpath: "modules.view.merci.segments.booking.templates.farereview.MUSDoTPopup",
														data: {
															labels: this.data.labels,
															globalList: this.data.globalList,
															rqstParams: {
																lastSeg: lastSeg,
																segmentIndex: segment_index,
																storedItinerary : itinerary_index,
																baggagePageReferrer: 'Fare',
																showBaggageDisclaimer: true,
																beginLocItn: itinerary.segments[0].beginLocation.locationCode,
																beginLoc: segment.beginLocation.locationCode,
																endLocItn: endLocItn,
																endLoc: segment.endLocation.locationCode,
																fractionDigits: this.__getFractionDigits(),
																airlineCodesMap: this.data.rqstParams.airlineCodesMap,
																airlineCodesCarryOn: this.data.rqstParams.airlineCodesCarryOn,
																airlineDescriptionList: this.data.rqstParams.airlineDescriptionList
															}
														}
													} /}
													{/if}
												</span>
											{elseif this.data.siteParams.siteMerciShowBagAllow != null && this.data.siteParams.siteMerciShowBagAllow.toLowerCase() == 'true'/}
												<span class="label">${this.data.labels.tx_merci_text_booking_fare_baggage_allowance}:</span>
												<span class="data">
													{var baggageLink = modules.view.merci.common.utils.MCommonScript.getStaticLinkURL('BAGGAGE_{0}_' + this.data.rqstParams.merciDeviceBean.profile + '.html','html')/}
													<a href="javascript:void(0);" class="balinks" {on click {fn: 'openHTML',args: {link: baggageLink}}/}>${this.data.labels.tx_merci_text_booking_fare_more_details}</a></span>
												</span>
											{/if}
										</li>
										{if !this._merciFunc.isEmptyObject(itinerary.duration) && itinerary.nbrOfStops >=1 && parseInt(segment_index) == (itinerary.segments.length - 1)}
											<li class="duration">
												<span class="label">${this.data.labels.tx_merci_text_total_travel_time}:</span>  <span class="data">${this._getDateDisplayString(new Date(parseInt(itinerary.duration)))}</span>
											</li>
										{/if}
									</ul>
								</div>
								{var passbookParams = {}/}

								{if this._isConfPage()}
									{if this._merciFunc.booleanValue(this.data.siteParams.siteEnablePassbook)}
										{var isIOS = aria.core.Browser.isIOS /}										
										{var ver = this.findIOSVersion()/}
										{var versionTrue = false /}
										{var safariTrue = false /}
										{var appTrue = false/}
										{if aria.core.Browser.name.toLowerCase().indexOf("safari")!= -1}
											{set appTrue = true/}
										{/if}
										{if typeof ver !== "undefined" && ver[0]>=6}
											{set versionTrue = true/}
										{/if} 
										{if aria.core.Browser.browserType.toLowerCase().indexOf("safari")!= -1}
											{set safariTrue = true/}
										{/if}
										{var osVersion = aria.core.Browser.osVersion /}
										{if this._merciFunc.booleanValue(isIOS) && versionTrue && (safariTrue || appTrue)}											
											{var airlineCode = segment.airline.code/}
											{var flightNumber = segment.flightNumber/}
											{var depCity = segment.beginLocation.cityName/}
											{var depCityCode = segment.beginLocation.cityCode/}
											{var arrCity = segment.endLocation.cityName/}
											{var arrCityCode = segment.endLocation.cityCode/}
											{var headerDate =""/}
											{var depDate = ""/}	
											{var segmentBeginDate = this._getDate(segment.beginDateBean)/}
											{set segmentBeginDate = new Date(segmentBeginDate.getTime())/}
											{if segmentBeginDate != null}
												{set depDate = this._merciFunc.formatDate(segmentBeginDate,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)/}
												{set headerDate = this._merciFunc.formatDate(segmentBeginDate,this.data.labels.tx_merci_pattern_DateMonth)/}
											{/if}
											{var depTime =""/}
											{set depTime = segment.beginDateBean.formatTimeAsHHMM/}										
											{var arrDate = ""/}
											{var segmentEndDate = this._getDate(segment.endDateBean)/}
											{set segmentEndDate = new Date(segmentEndDate.getTime())/}
											{if segmentEndDate != null}
												{set arrDate = this._merciFunc.formatDate(segmentEndDate,this.data.labels.tx_merci_pattern_DayDateFullMonthYear)/}
											{/if}
											{var arrTime =""/}
											{set arrTime = segment.endDateBean.formatTimeAsHHMM/}
											{var daysInterval=segment.nbDaysBetweenDepAndArrDates /}
											{if daysInterval >0}
												{set arrTime = arrTime + "(*" +daysInterval+ ")"/}
											{/if}
											{var tripDuration = this._getDateDisplayString(new Date(parseInt(segment.flightTime)))/}
											{var passengers =this.createPaxArray()/}											
											{var eTicketMap = this.createPaxEticketMap()/}
											{var REC_LOC = this.data.rqstParams.tripPlanBean.REC_LOC/}
											{var flight_string = this.data.labels.tx_merci_text_flight/}
											{var departure_string = this.data.labels.tx_merci_text_booking_conf_departure/}
											{var arrival_string = this.data.labels.tx_merci_ts_tripdetailspage_Arrival/}
											{var pnr_string = this.data.labels.tx_merci_ts_confirmationpage_AirlinePNR/}
											{var passengers_string = this.data.labels.tx_merci_text_pax/}
											{var name_string = this.data.labels.tx_merci_ts_paymentpage_Name/}
											{var eticket_string = this.data.labels.tx_merci_text_mybooking_eticket/}
											{set passbookParams = {airlineCode:airlineCode,flightNumber:flightNumber,depCity:depCity,depCityCode:depCityCode,arrCity:arrCity,arrCityCode:arrCityCode,depDate:depDate,headerDate:headerDate,arrDate:arrDate,depTime:depTime,arrTime:arrTime,tripDuration:tripDuration,passengers:passengers,eTicketMap:eTicketMap,REC_LOC:REC_LOC,flight_string:flight_string,departure_string:departure_string,arrival_string:arrival_string,pnr_string:pnr_string,passengers_string:passengers_string,name_string:name_string,eticket_string:eticket_string} /}
										{/if}
									{/if}
								{/if}
								<!-- All Passengers Display START -->
								{if this._isConfPage() || this._isPurcPage()}
									{@html:Template {
										classpath: "modules.view.merci.segments.booking.templates.conf.MConfFlightsItinerary",
										data: {
											'labels': this.data.labels,
											'rqstParams': this.data.rqstParams,
											'siteParams': this.data.siteParams,
											'globalList': this.data.gblLists,
											'segment':segment,
											'segmentIndex':segment_index,
											'itinerary':itinerary,
											'itineraryIndex':itinerary_index,
											'passbookParams':passbookParams,
											'isCommonRetrPage' : this.data.isCommonRetrPage
										}
									}/}
								{/if}
								<!-- All Passengers Display END -->

								// HIDDEN VARIABLES FOR FORM SUBMISSION [START] */
								<input type="hidden" name="B_LOCATION_${itinerary_index}" id="B_LOCATION_0" value = "${segment.beginLocation.locationName}"/>
								<input type="hidden" name="E_LOCATION_${itinerary_index}" id="E_LOCATION_0" value = "${segment.endLocation.locationName}"/>
								<input type="hidden" name="B_DATE_${itinerary_index}" id="B_DATE_0" value = "${segment.beginDate}"/>
								<input type="hidden" name="E_DATE_${itinerary_index}" id="E_DATE_0" value = "${segment.endDate}"/>
								// HIDDEN VARIABLES FOR FORM SUBMISSION [ END ] */

							</section>

							{if parseInt(segment_index) != (itinerary.segments.length - 1)}
								<p class="transit">
									<strong>${this.data.labels.tx_merci_text_layover_time}:</strong> ${this._getDateDisplayString(new Date(this._getDateDiff(segment, itinerary.segments[parseInt(segment_index) + 1])))}
								</p>
							{/if}

						{/if}
					{/foreach}
					{if this._isConfPage()}
						</section>
					{/if}
				</article>
			{/foreach}

			{var numberOfChild = 0/}
			{var numberOfAdult = 0/}
			{var numberOfYouth = 0/}
			{var numberOfInfant = 0/}
			{var numberOfSenior = 0/}
			{var numberOfStudent = 0/}
			{var numberOfMilitary = 0/}
			{foreach pnr in this.data.rqstParams.fareBreakdown.pnrs}
				{foreach travellertype in pnr.travellerTypesInfos}
					{if travellertype.travellerType.code == 'ADT'}
						{set numberOfAdult = travellertype.number/}
					{elseif travellertype.travellerType.code == 'CHD'/}
						{set numberOfChild = travellertype.number/}
					{elseif travellertype.travellerType.code == 'INF'/}
						{set numberOfInfant = travellertype.number/}
					{elseif travellertype.travellerType.code == 'YCD'/}
						{set numberOfSenior = travellertype.number/}
					{elseif travellertype.travellerType.code == 'YTH'/}
						{set numberOfYouth = travellertype.number/}
					{elseif travellertype.travellerType.code == 'STU'/}
						{set numberOfStudent = travellertype.number/}
					{elseif travellertype.travellerType.code == 'MIL'/}
						{set numberOfMilitary = travellertype.number/}
					{/if}

					{if !this._merciFunc.isEmptyObject(this.data.rqstParams.offerBean)}
						<input type="hidden" id="cx1" value="${this.data.rqstParams.offerBean.price}"/>
						<input type="hidden" id="cx3" value="${this.data.rqstParams.offerBean.currency}"/>
					{/if}

					{if !this._merciFunc.isEmptyObject(this.data.rqstParams.dealBean)}
						<input type="hidden" id="cx2" value="${this.data.rqstParams.dealBean.currency}"/>
						<input type="hidden" id="cx4" value="${this.data.rqstParams.dealBean.currency}"/>
					{/if}
				{/foreach}
			{/foreach}

			{var cabinClass = this.data.rqstParams.cabinClass/}
			{if this._merciFunc.isEmptyObject(cabinClass)}
				{set cabinClass = this.data.rqstParams.param.CABIN_CLASS/}
			{/if}

			{var milesCost = 0/}
			{if this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices[0] != undefined}
				{set milesCost = this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost /} 
			{else/}
				{set milesCost = 0/}
			{/if}
			<input type="hidden" id="dataAward_dep" value="B_LOCATION_1=${beginLocationCode}&E_LOCATION_1=${endLocationCode}&B_LOCATION_NAME=${beginCityName}&E_LOCATION_NAME=${endCityName}&TRIP_TYPE=${this.data.rqstParams.param.TRIP_TYPE}&CABIN_CLASS=${cabinClass}&B_DATE_1=${onwardDate}&MILES=${milesCost}&ADULT=${numberOfAdult}&CHILD=${numberOfChild}&INFANT=${numberOfInfant}&SENIOR=${numberOfSenior}&YOUTH=${numberOfYouth}&MILITARY=${numberOfMilitary}&STUDENT=${numberOfStudent}&IS_BOOKMARK=TRUE&${this.data.rqstParams.oldURL}"/>
			{if datAwdRetDate != null && datAwdRetDate != ''}
				<input type="hidden" id="dataAward_ret" value="E_DATE_1=${datAwdRetDate}"/>
			{/if}
			<input type="hidden" id="trip_URL" value="${tripURL}&ADULT=${numberOfAdult}&CHILD=${numberOfChild}&INFANT=${numberOfInfant}&No_OF_SENIOR=${numberOfSenior}&No_OF_YOUTH=${numberOfYouth}&No_OF_MILITARY=${numberOfMilitary}&No_OF_STUDENT=${numberOfStudent}${this.data.rqstParams.travellerURL}&backPricingType=FP&onoffswitch=on&TRIP_TYPE=${this.data.rqstParams.param.TRIP_TYPE}&CABIN_CLASS=${cabinClass}&PAYMENT_TYPE=CC&IS_BOOKMARK_FLOW=TRUE"/>
			
			{if this.bookmarkBtn ==true}
			    
				{set jsondataAward_dep.B_LOCATION_1 =beginLocationCode/}
				{set jsondataAward_dep.E_LOCATION_1 =endLocCd/}
				{set jsondataAward_dep.B_LOCATION_NAME =beginCityName/}
				{set jsondataAward_dep.E_LOCATION_NAME =endCityName/}
				{set jsondataAward_dep.TRIP_TYPE =this.data.rqstParams.param.TRIP_TYPE/}
				{if cabinClass==undefined || cabinClass=="undefined"}
					{set jsondataAward_dep.CABIN_CLASS ="" /}
				{else/}
					{set jsondataAward_dep.CABIN_CLASS =cabinClass/}
				{/if}
				{set jsondataAward_dep.B_DATE_1 =bgDate/}
				{set jsondataAward_dep.E_DATE_1 =endDate/}
				{set jsondataAward_dep.MILES =this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost/}
				{set jsondataAward_dep.ADULT =numberOfAdult/}
				{set jsondataAward_dep.CHILD =numberOfChild/}
				{set jsondataAward_dep.INFANT =numberOfInfant/}
				{set jsondataAward_dep.IS_BOOKMARK =this.data.rqstParams.oldURL/}
				{set jsondataAward_dep.PRICE =this.data.rqstParams.fareBreakdown.tripPrices[0].totalAmount/}
				{set jsondataAward_dep.CURRENCY =this.data.rqstParams.fareBreakdown.tripPrices[0].currency.code/}
				{set jsondataAward_dep.beginDtObj =bgDateObj/}
				{set jsondataAward_dep.beginDtObjGMT =bgDateObjGMT/}
				{set jsondataAward_dep.currDT =this._getCurrentTime()/}
				{set jsondataAward_dep.DISPLAY_DATE =displayDate/}
				{set jsondataAward_dep.FLIGHT_NUMBER =flightNum/}
				{set jsondataAward_dep.AIRLINE_CODE =airlineCode/}
				{set jsondataAward_dep.FLIGHT_DETAIL =txtFlightDetail/}
				{set jsondataAward_dep.ARRIVAL_TIME =arrTime/}
				{set jsondataAward_dep.DEPARTURE_TIME =depTime/}
				{set jsondataAward_dep.DURATION =flight_duration/}
				{set jsondataAward_dep.ARRIVAL_TIME_BSKT =arr_time_Bskt/}
				{set jsondataAward_dep.DEPARTURE_TIME_BSKT =dep_time_Bskt/}
				
				{if this.data.rqstParams.param.TRIP_TYPE == 'R'}
				
					{set jsondataAward_dep.B_LOCATION_2 =beginLocationCode_R/}
					{set jsondataAward_dep.E_LOCATION_2 =endLocCd_R/}
					{set jsondataAward_dep.B_LOCATION_NAME_2 =beginLocationName_R/}
					{set jsondataAward_dep.E_LOCATION_NAME_2 =endLocationN_R/}
					{if cabinClass==undefined || cabinClass=="undefined"}
						{set jsondataAward_dep.CABIN_CLASS_2 ="" /}
					{else/}
						{set jsondataAward_dep.CABIN_CLASS_2 =cabinClass/}
					{/if}
					
					{set jsondataAward_dep.B_DATE_2 =bgDate_R/}
					{set jsondataAward_dep.E_DATE_2 =endDate_R/}
					{set jsondataAward_dep.MILES_2 =this.data.rqstParams.fareBreakdown.tripPrices[0].milesCost/}
					{set jsondataAward_dep.PRICE_2 =this.data.rqstParams.fareBreakdown.tripPrices[0].totalAmount/}
					{set jsondataAward_dep.CURRENCY_2 =this.data.rqstParams.fareBreakdown.tripPrices[0].currency.code/}
					{set jsondataAward_dep.beginDtObj_2 =bgDateObj_R/}
					{set jsondataAward_dep.DISPLAY_DATE_2 =displayDate_R/}
					{set jsondataAward_dep.FLIGHT_NUMBER_2 =flightNum_R/}
					{set jsondataAward_dep.AIRLINE_CODE_2 =airlineCode_R/}
					{set jsondataAward_dep.FLIGHT_DETAIL_2 =txtFlightDetail_R/}
					{set jsondataAward_dep.ARRIVAL_TIME_2 =arrTime_R/}
					{set jsondataAward_dep.DEPARTURE_TIME_2 =depTime_R/}
					{set jsondataAward_dep.DURATION_2 =flight_duration_R/}
					{set jsondataAward_dep.ARRIVAL_TIME_2_BSKT =arrTime_R_Bskt/}
					{set jsondataAward_dep.DEPARTURE_TIME_2_BSKT =depTime_R_Bskt/}
						
				{/if}
				
				{if endSegmentDate != null && endSegmentDate != ''}
					{set jsondataAward_dep.B_DATE_2 =endSegmentDate/}
				{/if}			
				{set jsontrip_URL.ADULT =numberOfAdult/}
				{set jsontrip_URL.CHILD =numberOfChild/}
				{set jsontrip_URL.INFANT =numberOfInfant/}
				{set jsontrip_URL.No_OF_SENIOR =numberOfSenior/}
				{set jsontrip_URL.No_OF_YOUTH =numberOfYouth/}
				{set jsontrip_URL.No_OF_MILITARY =numberOfMilitary/}
				{set jsontrip_URL.No_OF_STUDENT =numberOfStudent/}
				{set jsontrip_URL.backPricingType ="FP"/}
				{set jsontrip_URL.onoffswitch ="on"/}
				{set jsontrip_URL.TRIP_TYPE =this.data.rqstParams.param.TRIP_TYPE/}
				{if cabinClass==undefined || cabinClass=="undefined"}
					{set jsontrip_URL.CABIN_CLASS =""/}
				{else/}
					{set jsontrip_URL.CABIN_CLASS =cabinClass/}
				{/if} 
				{set jsontrip_URL.PAYMENT_TYPE ="CC"/}
				{set jsontrip_URL.IS_BOOKMARK_FLOW ="TRUE"/}
				
				/*
				{if this.data.rqstParams.param.TRIP_TYPE == 'O'}
					{set jsonkey=this.data.rqstParams.param.TRIP_TYPE +keyOway + cabinClass /}
				{elseif this.data.rqstParams.param.TRIP_TYPE == 'R' /}
					{set jsonkey=this.data.rqstParams.param.TRIP_TYPE+keyOway+cabinClass+keyTway /}
				{/if}

				{set myVar = 0/}
				
				{if this.data.rqstParams.param.FLOW_TYPE ==undefined || this.data.rqstParams.param.FLOW_TYPE == ""}
					{if !merciFunct.isEmptyObject(jsonFare)}
						{for key in jsonFare}
							{if jsonkey ==key}
								{set myVar = 1/}
							{/if}
						{/for}		 
					{/if}				  
				{else/}
					{if !merciFunct.isEmptyObject(jsonDealMfare)}
						{for key in jsonDealMfare}
							{if jsonkey ==key}
								{set myVar = 1/}
							{/if}
						{/for}		 
					{/if}	
				{/if}
				*/
				${onBookMarkParameters(jsondataAward_dep,tripURL,jsontrip_URL,this.data.rqstParams.travellerURL,this.data.rqstParams.param.FLOW_TYPE)}
				
			{/if}
		
		
		{/if}
		{/if}

		<div class="mask" {id 'bookmarksAlertOverlay' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${this.data.labels.tx_merciapps_item_added}</h3>
				<p id="dialogueContent2">${this.data.labels.tx_merci_available_favourite}</p>
				<button type="button" class="bookCenter" {on click {fn:"toggleBookmarkAlert", args:{id:'added'}} /}>${this.data.labels.tx_merciapps_ok}</button>
			</div>
		</div>
		
		<div class="mask" {id 'bookmarksAlertOverlay1' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${this.data.labels.tx_merciapps_item_deleted}</h3>
				<button type="button" class="bookCenter" {on click {fn:"toggleBookmarkAlert", args:{id:'deleted'}} /}>${this.data.labels.tx_merciapps_ok}</button>
			</div>
		</div>
	{/macro}
	{macro createHTMLDom(itin,seg)}
		<div class="popup" id="htmlContainer_${itin}_${seg}" style="display: none;">
			<div id="htmlPopup_${itin}_${seg}">
			</div>
			<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
		</div>
	{/macro}
{/Template}