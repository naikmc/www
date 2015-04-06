 {Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.templates.MFlightInfoRequest',
	$hasScript: true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib',
		tablet: 'modules.view.merci.common.utils.MerciTabletLib'
	}
}}
	
	{var printUI = false/}
	{macro main()}
		{section {
			id: 'FlightInfoRequestPage',
			macro: 'loadContent'
		}/}
	{/macro}

	{macro loadContent()}
		{if printUI == true}
			{var labels = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.labels/}
			{var globalList = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.globalList/}
			{var requestParam = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.requestParam/}
			{var siteParam = this.moduleCtrl.getModuleData().servicing.MFlightInfo_Request_A.siteParam/}

			
			<section id="flightStatus">
				
				{if siteParam.enableRoute != null 
					&& siteParam.enableRoute != '' 
					&& siteParam.enableRoute =='TRUE'}
					<nav class="tabs">
						<ul>
							<li><a href="javascript:void(0)" class="navigation active">${labels.tx_merciapps_flight_number}</a></li>
							<li><a href="javascript:void(0)" {on click {fn:"onRouteDisplayClick"}/} class="navigation">${labels.tx_merciapps_route}</a></li>
						</ul>		
					</nav>
				{/if}

				<form {on submit {fn:'onFlightFormSubmit'}/}>
					{call includeError(labels)/}
					<article class="panel">
						<header>
							<h1>${labels.tx_merci_text_flight_status}</h1>
						</header>
						<section class="flightstatus">
							<p>
								<label for="flightNo">${labels.tx_merci_text_fifo_flightno}</label>
								{if siteParam.flifoAirline == null || siteParam.flifoAirline == ''}									
									<input id="fcode_num" type="text" maxlength="6" {on keyup {fn:'showCross', args: {id:"fcode_num"}}/}>
									<span class="delete flightDelete hidden" {on click {fn: 'clearField', args: {id:"fcode_num"}}/} id="delfcode_num"><span class="x">x</span></span>
								{else/}
									<ul class="inlineInput">
										<li id="f_code">${siteParam.flifoAirline}</li>
										<li><input id="fcode_num" type="text" maxlength="6" {on keyup {fn:'showCross', args: {id:"fcode_num"}}/}>
										<span class="delete flightDelete code hidden" {on click {fn: 'clearField', args: {id:"fcode_num"}}/} id="delfcode_num"><span class="x">x</span></span></li>
									</ul> 
								{/if}
							</p>
							<div class="list date">
								<label>${labels.tx_merci_text_fifo_date}</label>
								{if siteParam.showNewDatePicker == 'TRUE'}
									<input type="hidden" class="" id="datePickFlightF"/>
									<input type="hidden" class="dd" id="dd" />
									<input type="hidden" class="MMM" id="MMM" />
									<input type="hidden" class="YYYY" id="YYYY" />
								{else/}
									<ul class="input">
										<li class="selectDate">
											<select  name="dd" id="dd"></select>
										</li>
										<li class="selectMonth">
											<select  name="MMM" id="MMM" {on change {fn:"onDateChange",args:({monthdd:"MMM",daydd:"dd",yeardd:"YYYY",datePick:"datePickFlightF"}) } /}></select>
										</li>
										<li class="selectYear">
											<select  name="YYYY" id="YYYY" {on change {fn:"onDateChange",args:({monthdd:"MMM",daydd:"dd",yeardd:"YYYY",datePick:"datePickFlightF"}) } /}></select>
										</li>
									</ul>
									<a class="oldDatePicker" href="javascript:void(0)"><input type="hidden" id="datePickFlightF"/></a>
								{/if}
							</div>
						</section>
					</article>
					<footer class="buttons">
						{if !this._utils.isRequestFromApps() }
							<button type="button" class="validation cancel" {on click {fn:goBack}/}>${labels.tx_merci_text_callus_btnback}</button>
						{/if}	
						<button class="validation">${labels.tx_merci_text_fifo_btngetfifo}</button>
					</footer>	
				</form>	
			</section>
		{/if}
	{/macro}

	{macro includeError(labels)}
		{section {
			id: 'errors',
			bindRefreshTo : [{
        inside : this.data,
        to : 'error_msg'
			}],
			macro : {
				name: 'printErrors',
				args: [labels]
			}
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
		// resetting binding flag
		${aria.utils.Json.setValue(this.data, 'error_msg', false)|eat}
	{/macro}
{/Template}