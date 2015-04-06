{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableQuery',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib',
		tablet: 'modules.view.merci.common.utils.MerciTabletLib',
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	}
}}
	{var printUI = false/}
	{macro main()}
		{section {
			id: 'timeTablePage',
			macro: 'loadContent'
		}/}
	{/macro}
	{macro loadContent()}
		{if printUI == true}		
			{var labels = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.requestParam/}
	
		
			<section id="timeTable">

				<form id="timeTableForm">
				
				
					{call includeError(labels) /}
					<article class="panel sear">
						<header>
							<h1>${labels.tx_merci_text_tt_timetable}</h1>
						</header>
						<section>		
				
							{call createInput(siteParameters, 'B_LOCATION_1', 'A_LOCATION_1', labels.tx_merci_text_tt_from_src,true) /}
							{section {
								id : 'createDestinationFeild',
								macro : {
									name : 'createDestinationSearchFeild',
									id : 'createDestinationSearchFeild'
								}
							}/}

			                			<nav class="tabs">
								<ul class="input-radio baselineText">
									<li class="input-radio-item">
										<input name="trip-type" id="TTroundTrip" type="radio" ${this._radioSelectionValue('TTroundTrip')} {on click {fn:toggleReturnJourney}/}/>
										<label for="TTroundTrip">${labels.tx_merci_text_tt_round_trip}</label>
									</li>
									<li class="input-radio-item">
										<input name="trip-type" id="TTOneWay" type="radio" ${this._radioSelectionValue('TTOneWay')} {on click {fn:toggleReturnJourney}/}/>
										<label for="TTOneWay">${labels.tx_merci_text_tt_one_way}</label>	
									</li>
								</ul>
			
							</nav>


				{var monthList=gblLists.shortMonthList/}
				<div class="list date">
					{call createDateDropDown(labels.tx_merci_text_tt_depart_date,siteParameters.showNewDatePicker,'datePickTimeTableF','Date','Month','Year','O', monthList)/}
					{call createDateDropDown(labels.tx_merci_text_tt_arrival_date,siteParameters.showNewDatePicker,'datePickTimeTableT','date_e','month_e','year_e','R', monthList)/}
				</div>

			</section>
		</article>


		<footer class="buttons">
			<button  class="validation" {on click {fn:onGetTimeTableClick,scope:this}/}>${labels.tx_merci_text_tt_get_tt_btn}</button>
		</footer>

		//Hidden Attributes
			<input type="hidden" name="B_ANY_TIME" value="TRUE"/>
			<input type="hidden" name="B_DATE" id="B_DATE" value=""/>
			<input type="hidden" name="Month1" id="Month1" value=""/>
			<input type="hidden" name="Day1" id="Day1" value=""/>
			<input type="hidden" name="B_Day" id="B_Day" value=""/>

			<input type="hidden" name="E_ANY_TIME" value="TRUE"/>
			<input type="hidden" name="E_DATE" id="E_DATE" value=""/>
			<input type="hidden" name="Month2" id="Month2" value=""/>
			<input type="hidden" name="Day2" id="Day2" value=""/>
			<input type="hidden" name="E_Day" id="E_Day" value=""/>

			<input id="B_LOCATION" type="hidden" name="B_LOCATION" value=""/>
			<input id="E_LOCATION" type="hidden" name="E_LOCATION" value=""/>
			<input id="TRIP_TYPE" type="hidden" name="TRIP_TYPE" value=""/>
			<input type="hidden" name="result" value="json" />
		//Hidden Attributes
	</form>
</section>

	<a href="javascript:void(0)" id="keyPadDismiss"></a>
		{/if}
	{/macro}
	
	{macro createDestinationSearchFeild()}
		{var labels = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.siteParam/}
		{call createInput(siteParameters, 'E_LOCATION_1', 'C_LOCATION_1', labels.tx_merci_text_tt_to_dest,false) /}
	{/macro}
	
	{macro createInput(siteParameters, inputID, inputIDSec, labelText,isFirstInput)}
		{var gblLists = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.globalList /}
			{var selectFn=null /}
			{if isFirstInput}
				{set selectFn = {fn:"selectFromARIA" , scope: this} /}	
			{/if}
			<div class="location">
				{var inputIDTT= inputID +"_TT"/}
				{call autocomplete.createAutoComplete({
					name: inputIDTT,
					id: inputIDTT,
					type: 'text',
					labelText: labelText,
					autocorrect:"off",
					autocapitalize:"none",
					autocomplete:"off",
					selectFn: selectFn,
					source: this.createAutocompleteSourceAria(gblLists.airportDescription,isFirstInput),
					isMandatory: true
				})/}
			
			</div>
	{/macro}

	{macro createDateDropDown(label,showNewDatePicker,datePick,day,month,year,tripType, monthList)}
			
				<div {if tripType == 'R'}id ="retTTJourney" {if this._radioSelectionValue('TTOneWay') == 'checked="checked"'} class="list date displayNone"  {else/} class="list date" {/if}{/if}>
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