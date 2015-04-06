{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableWeekView',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}



{macro main()}

		<section>
		<header>
			{var odBean=this.data.rqstParams.originDestinationBean /}
			{var tripType=this.data.rqstParams.dmIn.tripType/}
				<h1 class="TTSrcDestHeader"> ${odBean.beginLocation.cityName}(${odBean.beginLocation.cityCode}) - ${odBean.endLocation.cityName} (${odBean.endLocation.cityCode})</h1>
				
				<p class="trip">
				{var date1 = getFormattedDate(new Date(odBean.beginDateBean.year, odBean.beginDateBean.month, odBean.beginDateBean.day ))/}
				{if tripType=="O"}
					<div>
						<label class="singleFlightLabel">${date1} ${odBean.beginLocation.cityCode} - ${odBean.endLocation.cityCode}</label>
					</div>
				{else/}
					<select id="dates" {on change {fn:updateFlightValues, scope:this}/}>
						<option value="0"> ${date1} ${odBean.beginLocation.cityCode} - ${odBean.endLocation.cityCode}</option>
						{var date2 = getFormattedDate(new Date(odBean.endDateBean.year, odBean.endDateBean.month, odBean.endDateBean.day ))/}
						<option value="1">${date2} ${odBean.endLocation.cityCode} - ${odBean.beginLocation.cityCode} </option>	
					</select>
				{/if}
				</p>
				
				<nav class="pagination">
				<ul>
					<li><a href="javascript:void(0)" {on click {fn:"prevWeekLink"}/}>${this.data.labels.tx_merci_text_tt_prev}</a></li>
					<li><a href="javascript:void(0)" {on click {fn:"nextWeekLink"}/}>${this.data.labels.tx_merci_text_tt_next}</a></li>
				</ul>
			</nav>
			</header>
			
			{var return1=""/}
			
			
			
			
			
			 {section {
				id: "weekContent",
				type:"section",
				macro: {name: 'displayWeekDetails', args:[odBean], scope: this},
				bindRefreshTo: [{to:"segmentId", inside:this.weekData}],
			  }/}
		</section>			  
	
	{/macro}

	{macro displayWeekDetails(odBean)}
		
		{var orgDate2="Default"/}
		{if !this.__merciFunc.isEmptyObject(this.data.rqstParams.lstTimetableBean)}
			
		 	{var currentTTBean=this.data.rqstParams.lstTimetableBean[this.weekData.segmentId] /}
			{set orgDate2=currentTTBean.endDate/}

			<table class="grid smallTable" role="listbox">
			<colgroup>
				
				{for var i=1; i<=9; i++}
					{if i==6}
						<col class="selected"/>
					{else/}
						<col/>
					{/if}
				{/for}
			</colgroup>
           <thead>
			   <tr class="header">   
				  <th class="large"></th>				   
				  <th class="large">
				  	${currentTTBean.dayDate[0].substring(4,7)}
				  	{if currentTTBean.dayDate[0].substring(4,7)!=currentTTBean.dayDate[6].substring(4,7) }
				  		/ ${currentTTBean.dayDate[6].substring(4,7)} 
				  	{/if}
				  </th>
				  
				  {foreach currentDayDate in currentTTBean.dayDate}
					{var weekD=currentDayDate.substring(0,1)/}
					{var bDayOfMonth=currentDayDate.substring(8,10)/}
					{if currentDayDate!=currentTTBean.endDate.date}
						 <th class="daysColumn"><span>${weekD}</span> <span>${bDayOfMonth}</span></th>
					{/if}
				  {/foreach}
				  
				</tr>
			</thead>
			
			<tbody>
					{foreach currentFlight in currentTTBean.listFlight}
					{foreach currentSegment in currentFlight.lstSegments}
					{if parseInt(currentFlight_index) % 2==0}
						<tr role="option" class="odd">
					{else/}
						<tr role="option" class="even">
					{/if}
					<td class="trip"><div>${currentSegment.airline.code}${currentSegment.flightNumber}</div> <abbr>${currentSegment.beginLocation.locationCode}</abbr>
					<span class="dash">-</span>
					<abbr>${currentSegment.endLocation.locationCode}</abbr></td>
					<td class="time">
						<time>${currentSegment.beginDateBean.hourMinute.substring(0,2)}:${currentSegment.beginDateBean.hourMinute.substring(2)}</time> 
						<span class="dash">-</span> 
						<time>${currentSegment.endDateBean.hourMinute.substring(0,2)}:${currentSegment.endDateBean.hourMinute.substring(2)}</time>
						{var dayDiff=getTravelDifference(currentSegment.beginDateBean,currentSegment.endDateBean) /}
						{if (dayDiff>0)}
							(+ ${dayDiff} )
						{/if}
							{if this.data.siteParams.siteDisplayOperatedBy=="TRUE"}
								{if currentSegment.opAirline!=null}
									<em class="op">${getOperatedByString(currentSegment.opAirline.name)}</em>	
								{/if}
							{/if}
								
					</td>
					
					
					
					{if currentSegment_index==0}
						{foreach currentOperational in currentFlight.operational}
							{if currentOperational==true}
								 <td class="available"><span class="availability">available</span></td>
							{elseif currentOperational==false/}
								 <td class="unavailable"><span class="availability">unavailable</span></td>
							{/if}
						 {/foreach}
					{else/}
						{foreach currentOperational in currentFlight.operational}
							 <td class="NOCross"></td>
						{/foreach}
					{/if}
							
				</tr>
				
				{/foreach}
				{/foreach}
		  </tbody>
		{/if}
		  
		</table>
	{/macro}			

{/Template}