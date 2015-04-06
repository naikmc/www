{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MRouteRequest',
	$hasScript: true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib',
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	}
	
}}
	
	{var printUI = false/}
	{macro main()}
		{section {
			id: 'RoutePage',
			macro: 'loadContent'
		}/}
	{/macro}

	{macro loadContent()}
		{if printUI == true}
			{var labels = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.labels/}
			{var requestParam = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam/}
			{var siteParam = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam/}

			<nav class="tabs">
				<ul>	
					<li {on click "onFlightDisplayClick"/}><a href="javascript:void(0)" class="navigation">${labels.tx_merciapps_flight_number}</a></li>
					<li><a href="javascript:void(0)" class="navigation active">${labels.tx_merciapps_route}</a></li>
				</ul>		
			</nav>
			
			<form id="routeForm" {on submit {fn:'onFlightFormSubmit'}/}>
				<section id="flightStatus">
					{call includeError(labels)/}
					<article class="panel">
						<header>
							<h1>${labels.tx_merci_text_flight_status}</h1>
						</header>
						<section class="flightstatus">
				
								{call createInput(siteParam, 'B_LOCATION_1', labels.tx_merciapps_label_dept_airport,true)/}
		
								{call createInput(siteParam, 'E_LOCATION_1', labels.tx_merciapps_label_arrival_airport,false)/}
								
								{call createDateDropDown(labels.tx_merci_text_fifo_date,siteParam.showNewDatePicker,'datePickF','Date','Month','Year','O', pageRouteObj.globalList.shortMonthList)/}

						</section>
					</article>
					<footer class="buttons">
						<button class="validation">${labels.tx_merci_text_fifo_btngetfifo}</button>
					</footer>		
				</section>
				//Hidden Attributes
					<input type="hidden" name="B_ANY_TIME" value="TRUE"/>
					<input type="hidden" name="B_DATE" id="B_DATE" value=""/>
					<input type="hidden" name="Month1" id="Month1" value=""/>
					<input type="hidden" name="Day1" id="Day1" value=""/>
					<input type="hidden" name="Day1" id="Year1" value=""/>
					<input type="hidden" name="B_Day" id="B_Day" value=""/>

					<input id="B_LOCATION" type="hidden" name="B_LOCATION" value=""/>
					<input id="E_LOCATION" type="hidden" name="E_LOCATION" value=""/>
					<input id="TRIP_TYPE" type="hidden" name="TRIP_TYPE" value=""/>
					<input id="PAGE_TYPE" type="hidden" name="PAGE_TYPE" value="ROUTE"/>
					<input type="hidden" name="result" value="json" />
					<input type="hidden" name="IS_USER_LOGGED_IN" value = "${requestParam.IS_USER_LOGGED_IN}"> 
				//Hidden Attributes
		
			</form>
		{/if}
	{/macro}
	
	{macro createDateDropDown(label,showNewDatePicker,datePick,day,month,year,tripType, monthList)}
			
				<div class="list date">
					<label for="${day}">${label}<span class="required">*</span></label>
					{if (showNewDatePicker == 'TRUE')}
						<input type="hidden" class="" id="${datePick}"/>

						<input id="${day}" type="hidden" name="${day}" value=""/>
						<input id="${month}" type="hidden" name="${month}" value=""/>
						<input id="${year}" type="hidden" name="${year}" value=""/>

					{else/}
						<ul class="input">
							<li class="selectDate">
								<select id='${day}' name="${day}" {on change {fn:"onDayChange",args:({monthdd:month,daydd:day,yeardd:year,datePick:datePick}) } /}>
									{for var i = 1; i <= 31; i++}
										{if (i<10)}
											{set j = '0'+i/}
										{else/}
											{set j = i/}
										{/if}
										<option value="${j}" {if this._isDaySelected(day, "", i)} selected="selected" {/if}>${i}</option>
									{/for}
								</select>
							</li>
							<li class="selectMonth">
								<select name="${month}" id='${month}' {on change {fn:"onMonthChange",args:({monthdd:month,daydd:day,yeardd:year,datePick:datePick}) } /}>
									{var i=0/}
									{var buf0=""/}
									{foreach monthName in monthList}
										{if i+1<10}
											{set buf0="0"/}
										{/if}
										<option value="${buf0}${i+1}" {if this._isMonthSelected(month, "", i+1)} selected="selected" {/if}>${monthName[1]}</option>
										{set i=i+1/}
										{set buf0=""/}
									{/foreach}
								</select>
							</li>
							<li class="selectYear">
								<select name="${year}" id='${year}' {on change {fn:"onYearChange",args:({monthdd:month,daydd:day,yeardd:year,datePick:datePick}) } /}>
								{var d=new Date()/}
								{var y=d.getFullYear()/}
								<option value="${y}"  {if this._isYearSelected(year, "", y)} selected="selected" {/if}>${y}</option>
								{set y=incrementYear(d)/}
								<option value="${y}"  {if this._isYearSelected(year, "", y)} selected="selected" {/if}>${y}</option>
								</select>				  
							</li>
						</ul>
						<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" id="${datePick}"/></a>
					{/if}
				</div>
	{/macro}
	
	{macro createInput(siteParam, inputID, labelText,isFirstInput)}
			{var allowSmrtDropDown = siteParam.allowSmartDropDown == 'FALSE' && siteParam.airportListA == 'TRUE' && siteParam.airportListD == 'TRUE'/}
			{var rqstParams = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam/}
			{var list = []/}
			{var selectFn=null /}
				
				{set list = this.createAutocompleteSourceAria(isFirstInput) /} // call for Normal Flow
					{if isFirstInput}
						{set selectFn = {fn:"selectFromARIA" , scope: this} /}	
					{/if}					 
			
			<p class="location">
				
				{call autocomplete.createAutoComplete({
					name: inputID,
					id: inputID,
					type: 'text',
					labelText: labelText,
					source: list,
					isMandatory: false,
					selectFn: selectFn
				})/}
			</p>
	{/macro}
	
	{macro includeError(labels)}
		{section {
          type: 'div',
          id: 'errors',
          macro: {name: 'printErrors', args: [labels]},
          
        }/}
	{/macro}

	{macro printErrors(labels)}

		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
		{/if}
	{/macro}


{/Template}
