{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableDayView',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

{var return1 = false/}
{var flightTpl = false/}
{macro main()}

	<section>
		<header>
			{var odBean=this.data.rqstParams.originDestinationBean /}
			{var tripType=this.data.rqstParams.dmIn.tripType/}
				<h1 id="tHeader" class="TTSrcDestHeader"> ${odBean.beginLocation.cityName}(${odBean.beginLocation.cityCode}) - ${odBean.endLocation.cityName} (${odBean.endLocation.cityCode})</h1>
				
				<p class="trip">
					{var date1 = getFormattedDate(new Date(odBean.beginDateBean.year, odBean.beginDateBean.month, odBean.beginDateBean.day))/}
					{if tripType == "O"}
						<div>
							<label class="singleFlightLabel" id="singleFlightLabel"> ${date1} ${odBean.beginLocation.cityCode} - ${odBean.endLocation.cityCode}</label>
						</div>
					{else/}
						<select id="dates" {on change {fn:updateFlightValues, scope:this}/}>
							<option value="0"> ${date1} ${odBean.beginLocation.cityCode} - ${odBean.endLocation.cityCode}</option>
							{var date2 = getFormattedDate(new Date(odBean.endDateBean.year, odBean.endDateBean.month, odBean.endDateBean.day))/}
							<option value="1">${date2} ${odBean.endLocation.cityCode} - ${odBean.beginLocation.cityCode} </option>
							
						</select>
					{/if}	
				</p>
				
				 <div>
					<label class="selectFlightLabel">${this.data.labels.tx_merci_text_tt_select_flight}</label>
				</div>
			</header>
			
			
			 {section {
				id: "dayContent",
				type:"section",
				macro: {name: 'displayDayDetails', scope: this},
				bindRefreshTo: [{to:"segmentId", inside:this.dayData}],
			  }/}
	</section>
{/macro}

	{macro displayDayDetails()}

		{var return1=false/}
		{var orgDate2 = "Default"/}
			
			{var currentTTBean=this.data.rqstParams.lstTimetableBean[this.dayData.segmentId] /}
			
			{if orgDate2 != currentTTBean.endDate}
				{if orgDate2!="Default"}
					{set return1=true/}
				{/if}
			{/if}
			{set orgDate2=currentTTBean.endDate/}
			
			<ul role="listbox">	
			{var nod=""/}
			// PTR 07621002
			{var dayDiff=""/}
					{foreach currentFlight in currentTTBean.listFlight}
					{set dayDiff=""/}
						{foreach currentSegment in currentFlight.lstSegments}
								{set nod=1/}
								{foreach currentOperational in currentFlight.operational}
									{if (currentOperational==true && nod==4) || (currentSegment_index==2 && nod==4 && currentOperational==true)}
										
										{var bDate=new Date(currentSegment.beginDate)/}
										{var eDate=new Date(currentSegment.endDate)/}
											{if parseInt(currentSegment_index,10)==0}
												<li role="option" >
											{/if}
											<span {on click {fn:"onFlightStatusClick", args:{segment:currentSegment, index:currentSegment_index, prevDayDiff:dayDiff}} /}>
													<p class="schedule" style="margin-top:1em;">
														
														<time class="departure">${currentSegment.beginDateBean.formatTimeAsHHMM.substring(0,2)}:${currentSegment.beginDateBean.formatTimeAsHHMM.substring(2)}</time> 					
														<span class="dash">-</span> 
														<time class="arrival">${currentSegment.endDateBean.formatTimeAsHHMM.substring(0,2)}:${currentSegment.endDateBean.formatTimeAsHHMM.substring(2)}</time>
														{set dayDiff=getTravelDifference(currentSegment.beginDateBean,currentSegment.endDateBean) /}
														{if (dayDiff>0)}
															<small>(+ ${dayDiff} )</small>
														{/if}
													
													</p>						
													
													<p class="route">
														<span class="fl-nr">${currentSegment.airline.code}${currentSegment.flightNumber}</span> 
														<abbr class="city">${currentSegment.beginLocation.locationCode}</abbr>
														<span class="dash">-</span>						
														<abbr class="city">${currentSegment.endLocation.locationCode}</abbr> 
													</p>
											</span>
													{if parseInt(currentSegment_index,10)!=currentFlight.lstSegments.length-1}
														<br><br>
													{/if}
												{if parseInt(currentSegment_index,10)==currentFlight.lstSegments.length-1}
												</li>
												{/if}
									{/if}
									{set nod=nod+1/}
							{/foreach}
							
						{/foreach}
					{/foreach}
			</ul>					
	{/macro}
	
{/Template}