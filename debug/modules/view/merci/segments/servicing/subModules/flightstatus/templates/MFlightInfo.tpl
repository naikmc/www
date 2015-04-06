{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MFlightInfo',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript','aria.utils.Date'],
	$hasScript: true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib'
	}
}}
	{var printUI = false/}
	{var errorOccured = false /}
	{var jSon = {}/}
	{var jSondata = {}/}
	{macro main()}
		{if this.flow_type =="MyFav1"}
			//<div id='paxscroller' style="width:100%">
			<div id ="wrapper" class="wrapper">
				<div class="scroller">
					<ul class="thelist">
						<li>
							{var jsonflight = JSON.parse(this._utils.getStoredItem('FLIGHTSTATUS'))/}
							{if !this._utils.isEmptyObject(jsonflight)}
								{var i=0 /}
								{for key in jsonflight}
									{var jsonFlt=jsonflight[key]/}

										{section {
											id: 'FlightInfoPage'+i,
											macro: {name: 'loadContent',args: [jsonFlt]},
										}/}
									{set i=i+1 /}
								{/for}
							{/if}
						</li>
					</ul>
				</div>
			</div>

		{else/}
			{var jsonFlt=[]/}
			{section {
				id: 'FlightInfoPage',
				macro: {name: 'loadContent',args: [jsonFlt]},
			}/}
		{/if}
	{/macro}

	{macro loadContent()}
		{if printUI == true}


				{var listPlanned = pageFlightInfo.data.rqstParams.listPlanned/}
				{var segment = pageFlightInfo.data.rqstParams.flightInfoBean.segment/}
				{var beginLocCode=listPlanned[0].LOCATION.LOCATION_CODE /}
				{var endLocCode= listPlanned[listPlanned.length-1].LOCATION.LOCATION_CODE /}
				{var merciFunct = modules.view.merci.common.utils.MCommonScript/}

		<title>${pageFlightInfo.data.labels.tx_merci_text_flight_status}</title>

			<section id="flightInfo">
				<form class="tabletContainer">
					{call includeError()/}
					{call includeInfo()/}					
					{if !this._utils.isEmptyObject(segment.beginLocation)}
						<header>
							<h1>${pageFlightInfo.data.labels.tx_merci_text_flight_status}</h1>
						</header>
					{/if}

					<article class="panel">
						<header>
							{var flightNum=""/}
							{if !this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.params.flightNumber)}
								{set flightNum = pageFlightInfo.data.rqstParams.params.flightNumber.toUpperCase()/}
							{else/}
								{set flightNum= segment.airline.code+segment.flightNumber/}
							{/if}
							{set jSon.flightNum =flightNum/}

							<h1>
								${flightNum}
								{if pageFlightInfo.data.siteParam.siteDisplayOperatedBy=="TRUE"}
									{if !this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.flightInfoBean.codeShareName)}
										 <em class="op">${pageFlightInfo.data.labels.tx_merci_text_booking_operatedbycolon}&nbsp;${pageFlightInfo.data.rqstParams.flightInfoBean.codeShareName}</em>
									{/if}
								{/if}
							</h1>
							<h2 id="flightStatusHeading">
								<span class="location">${listPlanned[0].LOCATION.CITY_NAME}&nbsp;<abbr>(${beginLocCode})</abbr></span>
								{set jSon.bcityName =listPlanned[0].LOCATION.CITY_NAME/}
								{set jSon.bCityCode =beginLocCode/}
								<span class="location">${listPlanned[listPlanned.length-1].LOCATION.CITY_NAME}&nbsp;<abbr>(${endLocCode})</abbr></span>
								{set jSon.ecityName =listPlanned[listPlanned.length-1].LOCATION.CITY_NAME/}
								{set jSon.eCityCode =endLocCode/}
							</h2>
						</header>
						<section>
							<div class="details">
								<dl>
									<dt>${pageFlightInfo.data.labels.tx_merci_text_fifo_no_of_stops}:</dt>
									<dd>${listPlanned.length-2}</dd>
									{set jSon.noOfStop =listPlanned.length-2/}
								</dl>
                <dl>
									<dt>${pageFlightInfo.data.labels.tx_merci_text_fifo_aircraft}:</dt>
									<dd>
										{set jSon.Aircraft = pageFlightInfo.data.aircraftList[listPlanned[0].EQUIPMENT.CODE]/}
										${jSon.Aircraft}
									</dd>
								</dl>
                <dl>
									<dt>${pageFlightInfo.data.labels.tx_merci_text_total_travel_time}:</dt>
									{var time=msToTime(pageFlightInfo.data.rqstParams.totalTime)/}
									<dd>${time}</dd>
									{set jSon.journeyTime =time/}
								</dl>
                <dl>
									<dt>${pageFlightInfo.data.labels.tx_merci_text_fifo_meal}:</dt>
									<dd>
									{foreach list in listPlanned}
										{var meal = list.LIST_MEAL /}
										{if !this._utils.isEmptyObject(meal)}
											{foreach mealItem in meal}
												{if (list_index == 0)}
													${mealItem.DESCRIPTION}{if (mealItem_ct != meal.length)}{/if}
													{set jSon.mealDesc =mealItem.DESCRIPTION/}
												{/if}
											{/foreach}
										{/if}
									{/foreach}
									</dd>

								</dl>
							</div>

							{if (pageFlightInfo.data.siteParam.opinfo_disp!="custom")&&(pageFlightInfo.data.siteParam.opinfo_disp!="CHANGED_MODE")}
								<div class="details">
									<dl>
										{var beginDate = new Date(segment.beginDateBean.year, segment.beginDateBean.month, segment.beginDateBean.day,segment.beginDateBean.hour,segment.beginDateBean.minute,0,0)/}

										<dt>${pageFlightInfo.data.labels.tx_merci_text_booking_dep_long}:</dt>
										<dd>${this._utils.formatDate(beginDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)}</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_scheduled}:</dt>
										<dd>${this._utils.formatDate(beginDate, 'HH:mm')}</dd>
										{set jSon.beginDate =this._utils.formatDate(beginDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)/}
										{set jSon.beginDtFormat =segment.beginDateBean.jsDateParameters/}
										{set jSon.beginTime =this._utils.formatDate(beginDate, 'HH:mm')/}
									</dl>
									<dl>
										{var endDate = new Date(segment.endDateBean.year, segment.endDateBean.month, segment.endDateBean.day,segment.endDateBean.hour,segment.endDateBean.minute,0,0)/}

										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_arrival}:</dt>
										<dd>${this._utils.formatDate(endDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)}</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_scheduled}:</dt>
										<dd>${this._utils.formatDate(endDate, 'HH:mm')}</dd>
										{set jSon.endDate =this._utils.formatDate(endDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)/}
										{set jSon.endDtFormat =segment.endDateBean.jsDateParameters/}
										{set jSon.endTime =this._utils.formatDate(endDate, 'HH:mm')/}
									</dl>
								</details>
							{/if}

							{if pageFlightInfo.data.siteParam.siteFSShow=="TRUE"}
								{set jSon.siteFSShow ="true"/}
							/*
							{if ((segment.cancel!=null && segment.cancel=="TRUE") || (!this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.enhanceFlightInfoBean) && pageFlightInfo.data.rqstParams.enhanceFlightInfoBean.isCancelled == 'TRUE'))}
								${pageFlightInfo.data.labels.tx_merci_text_flight_canceled}
								{set jSondata.label =pageFlightInfo.data.labels.tx_merci_text_flight_canceled/}
							{/if} */
							/*  ======================== Operational panel [START]====================== */
							/* ======================== Start of param value standard===================== */


							{if (pageFlightInfo.data.siteParam.opinfo_disp=="Standard")||(pageFlightInfo.data.siteParam.opinfo_disp=="")||(pageFlightInfo.data.siteParam.opinfo_disp=="EXISTING_MODE")}
								{if !this._utils.isEmptyObject(pageFlightInfo.data.rqstParams.flightInfoBean.operationalEvents)}
								<div class="details">

									<h2>${pageFlightInfo.data.labels.tx_merci_text_operational_information}</h2>
									{var operationalEvents=pageFlightInfo.data.rqstParams.flightInfoBean.operationalEvents/}
									{var temp=""/}
									<dl>
										{foreach operationalEvent in operationalEvents}
											{if temp != operationalEvent.location.locationName}
												<div>
													<strong>
														{set currentLocation=operationalEvent.location/}
														${currentLocation.cityName}&nbsp;
														${currentLocation.locationName}
														{set jSondata.cityName =currentLocation.cityName/}
														{set jSondata.locationName =currentLocation.locationName/}
													</strong>
												</div>
											{/if}
											{if operationalEvent.time !=null}
												<dt>${operationalEvent.infoLowerCaseCapitalized}</dt>
												{set jSondata.optDate =operationalEvent.infoLowerCaseCapitalized/}
												{var time = operationalEvent.time/}
												{set time = time.split(" ")/}
												{set time = time[3].split(":")/}
												{set time = time[0]+":"+time[1]/}
												<dd> ${time} </dd>
												{set jSondata.time =time/}
											{/if}

											{set temp=currentLocation.locationName/}
										{/foreach}
									</dl>
								</div>
							{/if}
						{/if}

							/*<%-- ======================== End of param value standard===================== --%>*/

							{if pageFlightInfo.data.siteParam.opinfo_disp == "custom" || pageFlightInfo.data.siteParam.opinfo_disp == "CHANGED_MODE"}

								// get operational data
								{var response = this.__getOperationalInfo()/}

								<div class="details">
									<dl>
										// get departure date object
										{var bDate = this.__getDateObject(listPlanned[0].B_DATE)/}

										<dt>${pageFlightInfo.data.labels.tx_merci_text_booking_dep_long}:</dt>
										<dd>
											{if bDate != null}
												${this._utils.formatDate(bDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)}
												{set jSondata.b_plannBDate =this._utils.formatDate(bDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_scheduled}:</dt>
										<dd>
											{if bDate != null}
												${this._utils.formatDate(bDate, 'HH:mm')}
												{set jSondata.b_plannBTime =this._utils.formatDate(bDate, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_estimated}:</dt>
										<dd>
											{if response.ETD != null}
												${this._utils.formatDate(response.ETD, 'HH:mm')}
												set jSondata.B_ETD =this._utils.formatDate(response.ETD, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_actual}:</dt>
										<dd>
											{if response.ATD != null}
												${this._utils.formatDate(response.ATD, 'HH:mm')}
												set jSondata.b_ATD =this._utils.formatDate(response.ATD, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_terminal}:</dt>
										<dd>
											{if listPlanned[0].DEPARTURE_TERMINAL != null}
												${listPlanned[0].DEPARTURE_TERMINAL}
												{set jSondata.b_DEPARTURE_TERMINAL =listPlanned[0].DEPARTURE_TERMINAL/}
											{elseif listPlanned[0].ARRIVAL_TERMINAL !=null/}
												{set jSondata.b_ARRIVAL_TERMINAL =listPlanned[0].ARRIVAL_TERMINAL/}
												${listPlanned[0].ARRIVAL_TERMINAL}
											{else/}
												-
											{/if}
										</dd>
									</dl>
									<dl>
										// get departure date object
										{var eDate = this.__getDateObject(listPlanned[listPlanned.length-1].E_DATE)/}

										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_arrival}:</dt>
										<dd>
											{if eDate != null}
												${this._utils.formatDate(eDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)}
												{set jSondata.e_plannBDate =this._utils.formatDate(eDate, pageFlightInfo.data.labels.tx_merci_pattern_FullDateFormat)/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_scheduled}:</dt>
										<dd>
											{if eDate != null}
												${this._utils.formatDate(eDate, 'HH:mm')}
												{set jSondata.e_plannBTime =this._utils.formatDate(eDate, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_estimated}:</dt>
										<dd>
											{if response.ETA != null}
												${this._utils.formatDate(response.ETA, 'HH:mm')}
												{set jSondata.e_ETA =this._utils.formatDate(eDate, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_fifoop_actual}:</dt>
										<dd>
											{if response.ATA != null}
												${this._utils.formatDate(response.ATA, 'HH:mm')}
												{set jSondata.e_ATA =this._utils.formatDate(response.ATA, 'HH:mm')/}
											{else/}
												-
											{/if}
										</dd>
										<dt>${pageFlightInfo.data.labels.tx_merci_text_terminal}:</dt>
										<dd>
											{if listPlanned[listPlanned.length-1].DEPARTURE_TERMINAL != null}
												${listPlanned[listPlanned.length-1].DEPARTURE_TERMINAL}
												{set jSondata.e_DEPARTURE_TERMINAL =listPlanned[listPlanned.length-1].DEPARTURE_TERMINAL/}
											{elseif listPlanned[listPlanned.length-1].ARRIVAL_TERMINAL !=null/}
												${listPlanned[listPlanned.length-1].ARRIVAL_TERMINAL}
												{set jSondata.e_ARRIVAL_TERMINAL =listPlanned[listPlanned.length-1].ARRIVAL_TERMINAL/}
											{else/}
												-
											{/if}
										</dd>
									</dl>
								</div>
								/* ======================== Operational panel [END]====================== */
							{/if}
						{/if}
					</section>
				</article>
				{if !this._utils.isRequestFromApps()}
					<footer class="buttons">
						<button type="button" id="backBtn" class="validation cancel" {on click "backToHome" /}>
								${pageFlightInfo.data.labels.tx_merci_text_back}
						</button>
						{if pageFlightInfo.data.siteParam.allowFlightUpdate != undefined && pageFlightInfo._utils.booleanValue(pageFlightInfo.data.siteParam.allowFlightUpdate) == false}
							<button type="button" class="validation" {on click "refreshPageinfo" /}>
								${pageFlightInfo.data.labels.tx_merci_text_fifo_fiforefresh}
							</button>
						{/if}		
					</footer>
				{/if}


				</form>
				{if this.bookmarkBtn==true}
					{set jsonKey=segment.beginDateBean.formatDateTimeAsYYYYMMddHHMM+jSon.bCityCode+jSon.eCityCode+jSon.flightNum/}
					${onBookMarkParameters(jSon,jSondata,jsonKey)}
				{/if}
			</section>
		{else/}
			<article>
				<section>
					{call includeError()/}
				</section>
			</article>
		{/if}

		<div class="mask" {id 'bookmarksAlertOverlay' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${pageFlightInfo.data.labels.tx_merciapps_item_added}</h3>
				<button type="button" class="popupButton" {on click {fn:"toggleBookmarkAlert", args:{id:'added'}} /}>${pageFlightInfo.data.labels.tx_merciapps_ok}</button>
			</div>
		</div>
		
		<div class="mask" {id 'bookmarksAlertOverlay1' /}>
			<div class="dialogue">
				<h3 class="dialogueContent">${pageFlightInfo.data.labels.tx_merciapps_item_deleted}</h3>
				<button type="button" class="popupButton"  {on click {fn:"toggleBookmarkAlert", args:{id:'deleted'}} /}>${pageFlightInfo.data.labels.tx_merciapps_ok}</button>
			</div>
		</div>
	{/macro}

	{macro includeError()}
		{section {
			id: 'errors',
			bindRefreshTo : [{
				inside : pageFlightInfo.data,
				to : 'error_msg'
			}],
			macro : {
				name: 'printErrors'
			}
		}/}
	{/macro}
	{macro includeInfo()}
		{section {
			id: 'infos',
			bindRefreshTo : [{
				inside : pageFlightInfo.data,
				to : 'info_msg'
			}],
			macro : {
				name: 'printInfo'
			}
		}/}
	{/macro}

	{macro printErrors()}
		{if pageFlightInfo.data.errors != null && pageFlightInfo.data.errors.length > 0}
			{var errorTitle = ''/}
			{if pageFlightInfo.data.labels != null && pageFlightInfo.data.labels.tx_merci_text_error_message != null}
				{set errorTitle = pageFlightInfo.data.labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: pageFlightInfo.data.errors, title: errorTitle})/}
		{/if}
		// resetting binding flag
		${aria.utils.Json.setValue(pageFlightInfo.data, 'error_msg', false)|eat}
	{/macro}
	{macro printInfo()}
		{if pageFlightInfo.data.infos != null && pageFlightInfo.data.infos.length > 0}
			{var infoTitle = ''/}
			{if pageFlightInfo.data.labels != null && pageFlightInfo.data.labels.tx_merci_warning_text != null}
				{set infoTitle = pageFlightInfo.data.labels.tx_merci_warning_text/}
			{/if}
			{call message.showInfo({list: pageFlightInfo.data.infos, title: infoTitle})/}
		{/if}
		// resetting binding flag
		${aria.utils.Json.setValue(pageFlightInfo.data, 'info_msg', false)|eat}
	{/macro}
{/Template}