{Template {
    $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.AcceptanceConfirmation',
    $macrolibs : {
      common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
      autocomplete : 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
    },
    $hasScript : true
  }}
    {macro main()}
    {var cpr = this.moduleCtrl.getCPR() /}
	{var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
	{var journey = cpr[selectedCPR.journey]/}
	{var flightList = selectedCPR.product/}
	{var passengerList = selectedCPR.customer/}
	{var label = this.label/}
	{var parameters = this.parameters/}
	{var labelExitrow = this.label.EmergencyExitPrompt /}
	{var flow = this.moduleCtrl.getFlowType() /}
	{var success = moduleCtrl.getSuccess() /}
	{var warnings = moduleCtrl.getWarnings() /}
	{var errors = moduleCtrl.getErrors() /}



<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionconfirmationspecific'>

<section>
/*Displaying SSCI Warnings */
<div id="pageWiseCommonWarnings"></div>
<div id="acceptConfErrs">
<div id="pageErrors"></div>
{if errors != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : errors,
              "type" : "error" }
          }/}
    	{/if}
</div>
<div id="acceptConfMsgs">
        {if success != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : success,
              "type" : "success" }
          }/}
    	{/if}
  </div>
  <div id="acceptConfWarning">
  {if warnings != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : warnings,
              "type" : "warning" }
          }/}
        {/if}
  </div>
  <form>

    <!-- Breadcrumbs -->

    <nav class="breadcrumbs">
      <ul>
        <li><span>1</span></li>
        <li><span>2</span></li>
        <li><span>3</span></li>
        <li class="active"><span>4</span></li>
      </ul>
    </nav>


			<div class="popup input-panel" style="display: none;" id="SharingPopup">
				<article class="panel email">
			  <header>
						<hgroup>
				<h1> <strong></strong></h1>
						</hgroup>
			  </header>

						<section id = "shareEmail" style="display: none;">
							<div id="shareNotEmail"></div>

				  <label>${label.tx_merci_text_mailA_from}:</label>
							<ul class="services-pax selectable">
								<ul class="input-elements" id="ul1" data-aria-expanded="true">
				  <input name="FROM"  id="travellerFromEmail" type="text" placeholder=${label.tx_merci_text_sm_mail_from_placeholder} >
								</ul>
							</ul>
				  <label>${label.tx_merci_text_mailA_to} :</label>
							<ul class="services-pax selectable">
								<ul class="input-elements" id="ul1" data-aria-expanded="true">
				  <input name="TO" id="travellerToEmail" type="text" placeholder=${label.tx_merci_text_sm_mail_to_placeholder}>
								</ul>
							</ul>
				  <small>${label.tx_merci_text_sm_mail_to_info}</small>
							<li></li><li></li>
							<textarea name="SUBJECT" id="subjectInput" cols="" rows="" class="subject" style="display:none;"readonly></textarea>
				<textarea name="BODY" style="width:100%;height:100px;" id="emailta"></textarea>
						</section>
						<footer id = "shareEmailButton"class="buttons">
							<!-- <button type="button" class="validation cancel" {on click {fn:'cancelEmailShare', args: {}}/} >${label.tx_merci_text_mail_btncancel}</button> -->
							<button type="button" class="validation cancel"> ${label.tx_merci_text_mail_btncancel}</button>
					  		<button type="button" class="validation" {on click {fn:'sendEmailShare', args: {}}/}>${label.tx_merci_text_mail_btnsend}</button>
				</footer>

						<section id = "shareSMS" style="display: none;">

							<div id="shareNotSMS"></div>
							<label>${label.tx_merci_text_mailA_to} :</label>
							<ul class="services-pax selectable">
								<ul class="input-group contact" id="ul1" data-aria-expanded="true">
									<li class="width_36">
										//<input id="travellerAreaCode" type="text" >
										{call autocomplete.createAutoComplete({
													name: "travellerAreaCode",
													id: "travellerAreaCode",
													type: 'text',
													autocorrect:"off",
													autocapitalize:"none",
													autocomplete:"off",
													placeholder:"0033",
													source: this.data.formattedPhoneList,
													maxlength:4,
													selectCode : true

											  })/}
					  </li>
									<li class="width_64">
						<input id="travellerPhoneNo" type="text"  placeholder=${label.tx_merci_text_booking_alpi_phone_number}>
					  </li>
					</ul>
							</ul>
							<li></li><li></li>
				<textarea style="width:100%;height:100px;" id="smsta"></textarea>
						</section>
						<footer id = "shareSMSButton" class="buttons">
							 <!-- <button type="button" class="validation cancel" {on click {fn:'cancelEmailShare', args: {}}/} >${label.tx_merci_text_mail_btncancel}</button> -->
							<button type="button" class="validation cancel"> ${label.tx_merci_text_mail_btncancel}</button>
					  		<button type="button" class="validation" {on click {fn:'sendSMSShare', args: {}}/}>${label.tx_merci_text_mail_btnsend}</button>
				</footer>
				</article>
			  </div>


    <!-- Message -->
    <div id='sharedMsg'></div>
    <div id="conf-sms" class="message validation hidden">
      <p>${label.MobileMsg}<span id="numbers"></span></p>
    </div>
    <div id="conf-email" class="message validation hidden">
      <p><strong>${label.EmailMsg}<span id="emails"></span></strong></p>
    </div>


	<!--Main Display Section -->
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
    {if journey.paxList.length != 1}
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
		//{if journey.paxList.length == 1 && journey.flightList.length == 1}
			{set boolPassBook = true /}
		//{/if}
	{/if}

	{if boolSPBP || boolMBP || boolSMS || boolPassBook}
		{set boolBP = true /}
	{/if}

	<!--If All SPBP,SMS,Boarding Pass and MBP not Allowed We wont Display whole Article hence Logic is been shifted to above  this line-->
	{if boolBP}
    <article class="panel list flightsOpen">
      <header>
        <h1 class="checkin-ready">${label.GetBoardingPass}</h1>
      </header>
      <section id="section1">
        <div class="trip">
          <li class="is-checked">
	          <input type="checkbox" id="flight01" name="flight01" value="SQ06" checked="checked">
	          /*For Select All Option */
	          <label for="flights01" class= "is-checked cityPairs">
	          	 ${label.IssueMsg} ${label.allFlights} ${label.inTrip}
	          </label>
	      </li>
          /*Removed for select all option */
          /* <p class="route"> ${label.IssueMsg} ${label.allFlights} ${label.inTrip}</p> */
        </div>
        <ul class="checkin-list" data-info="flights-ready-list-ssci">
          <li class="is-checked">
            <header>
            	<h2 class="subheader"> <span>${jQuery.substitute(label.PanelTitle, [this.moduleCtrl.toTitleCase(journey[journey.firstflightid].departureAirport.airportLocation.cityName), this.moduleCtrl.toTitleCase(journey[journey.lastflightid].arrivalAirport.airportLocation.cityName)])}</span> <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="passInfo01"><span>Toggle</span></button></h2>
            </header>

            <div class="" id="passInfo01">
              {foreach item in selectedCPR.flighttocust}
              	{var flightNo = item.product/}
              	<ul data-info="flights-ready-list-ssci" id="trip0${(parseInt(item_index) + parseInt(1))}" class="">
                <li class="is-checked">
                  /*Added checkbox */
			      <input class = "flightSelCheckBox" type="checkbox" id="seg0${(parseInt(item_index) + parseInt(1))}" name="product" value="${flightNo}" checked="">

                  {var departureDate = new Date(journey[flightNo].timings.SDT.time)/}
                  {var dep_hrs = departureDate.getUTCHours()/}
				  {if parseInt(dep_hrs)<10}
				  {set dep_hrs="0"+dep_hrs /}
	              {/if}
				  {var dep_mins = departureDate.getUTCMinutes()/}
				  {if parseInt(dep_mins)<10}
				  {set dep_mins="0"+dep_mins /}
				  {/if}

				  {var arrivalDate = new Date(journey[flightNo].timings.SAT.time)/}
				  {var arr_hrs = arrivalDate.getUTCHours()/}
				  {if parseInt(arr_hrs)<10}
				  {set arr_hrs="0"+arr_hrs /}
				  {/if}
				  {var arr_mins = arrivalDate.getUTCMinutes()/}
				  {if parseInt(arr_mins)<10}
				  {set arr_mins="0"+arr_mins /}
				  {/if}


                  {var index = parseInt(item_index)+1/}
                  /* Instead of H3 we have to use label for checkbox */
                  /* <h3> ${index}.${moduleCtrl.getWeekDayUTC(departureDate).substr(0,3)}, ${departureDate.getUTCDate()} ${moduleCtrl.getMonthUTC(departureDate)} ${departureDate.getUTCFullYear()} - ${journey[flightNo].operatingAirline.companyName.companyIDAttributes.code} ${journey[flightNo].operatingAirline.flightNumber} </h3> */
                  <label for ="flight0${flightNo}"> ${index}.${moduleCtrl.getWeekDayUTC(departureDate).substr(0,3)}, ${departureDate.getUTCDate()} ${moduleCtrl.getMonthUTC(departureDate)} ${departureDate.getUTCFullYear()} - ${journey[flightNo].operatingAirline.companyName.companyIDAttributes.code} ${journey[flightNo].operatingAirline.flightNumber} </label>
                  {if parameters.SITE_SSCI_OP_AIR_LINE!=journey[flightNo].operatingAirline.companyName.companyIDAttributes.code}
                  <p>${label.operatedBy} : ${journey[flightNo].operatingAirline.companyName.companyIDAttributes.companyShortName}</p>
                  {/if}
                  <p><span class="strong">${dep_hrs}:${dep_mins}</span> ${this.moduleCtrl.toTitleCase(journey[flightNo].departureAirport.airportLocation.cityName)}, ${this.moduleCtrl.toTitleCase(journey[flightNo].departureAirport.airportLocation.countryName)}</p>
                  <p><span class="strong">${arr_hrs}:${arr_mins}</span> ${this.moduleCtrl.toTitleCase(journey[flightNo].arrivalAirport.airportLocation.cityName)}, ${this.moduleCtrl.toTitleCase(journey[flightNo].arrivalAirport.airportLocation.countryName)} </p>
                </li>
              </ul>
              {/foreach}
            </div>
          </li>
        </ul>

		{if parameters.SITE_SSCI_DSBL_CSL_BP_GEN =="TRUE" || parameters.SITE_SSCI_DSBL_CST_BP_GEN =="TRUE"}
        <div class="message info">
			{if parameters.SITE_SSCI_DSBL_CSL_BP_GEN =="TRUE" && parameters.SITE_SSCI_DSBL_CST_BP_GEN =="TRUE"}
            	<p>${label.bpMsg}</p>
            {elseif parameters.SITE_SSCI_DSBL_CSL_BP_GEN =="TRUE" && parameters.SITE_SSCI_DSBL_CST_BP_GEN =="FALSE"/}
				<p>${label.bpMsgCancelCheckin}</p>
            {elseif parameters.SITE_SSCI_DSBL_CSL_BP_GEN =="FALSE" && parameters.SITE_SSCI_DSBL_CST_BP_GEN =="TRUE"/}
				<p>${label.bpMsgSeatModification}</p>
            {/if}
        </div>
        {/if}

        <div class="message info" id="adcError" class"displayNone">
           <p>${label.adcMsg}</p>
        </div>

        <div class="message info" id="proceedToCounter" class"displayNone">
           <p>${label.BpConfMsg}.</p>
        </div>

        <div class="buttons">

        <ul class="getPassbook">
	        	/*SPBP Button Start*/
	        	  {if boolSPBP}
        	  		<li><a class="secondary email" {on tap {fn : "onEmailButtonClick"}/} ><span data-aria-hidden="true" class="icon icon-email" style="display: none;"></span>${label.Email}</a></li>
        	  {/if}
				/*SPBP Button End */
				/*SMS Button Begin*/
				  {if boolSMS}
			  		<li><a class="secondary sms" {on tap {fn : "onSMSButtonClick"}/}><span data-aria-hidden="true" class="icon icon-sms" style="display: none;"></span>${label.Sms}</a></li>
			  {/if}
				/*SMS Button End*/
				/*PassBook Button Start */
				  {if boolPassBook}
		              	<li><a class="secondary add-passbook" {on tap {fn : "onPassBookButtonClick"}/}><span data-aria-hidden="true" class="icon icon-passbook" style="display: none;"></span>${label.Passbook}</a></li>
		            {/if}
				/*PassBook Button End */
				/*MBP Button Start */
				  {if boolMBP}
              		<li><a class="secondary app" {on tap {fn : "onMBPButtonClick"}/}><span data-aria-hidden="true" class="icon icon-qrcode" style="display: none;"></span>${label.Boarding}</a></li>
              {/if}
	            /*MBP Button End*/
            </ul>
        </div>

      </section>

    </article>
	{/if}


	{foreach item in selectedCPR.flighttocust}
            {var flightNo = item.product/}
			{var depCityCode = journey[flightNo].departureAirport.locationCode /}
			{var arrCityCode = journey[flightNo].arrivalAirport.locationCode /}
		    <article class="panel">
		      <header>
		        <h1>${jQuery.substitute(label.PanelTitle, [journey[flightNo].departureAirport.airportLocation.cityName, journey[flightNo].arrivalAirport.airportLocation.cityName])}
		          <button type="button" role="button" class="toggle" {if !boolBP}data-aria-expanded="true" {else/} data-aria-expanded="false"{/if} data-aria-controls="section4${flightNo} section4_1${flightNo} section6_1${flightNo}"><span>Toggle</span></button>
		        </h1>
		      </header>
		      <section id="section4${flightNo}"   {if !boolBP} data-aria-hidden="false" style="display: block;"{else/}data-aria-hidden="true" style="display: none;"{/if}>
		      	{var depJson = new Date(journey[flightNo].timings.SDT.time)/}
		      	{var dep_hrs = depJson.getUTCHours()/}
				{if parseInt(dep_hrs)<10}
				{set dep_hrs="0"+dep_hrs /}
				{/if}
				{var dep_mins = depJson.getUTCMinutes()/}
				{if parseInt(dep_mins)<10}
				{set dep_mins="0"+dep_mins /}
				{/if}
				{var f_weekday = moduleCtrl.getWeekDayUTC(depJson).substr(0,3) /}
				{var f_month= moduleCtrl.getMonthUTC(depJson)/}


				{var arrJson = new Date(journey[flightNo].timings.SAT.time)/}
				{var arr_hrs = arrJson.getUTCHours()/}
				{if parseInt(arr_hrs)<10}
				{set arr_hrs="0"+arr_hrs /}
				{/if}
				{var arr_mins = arrJson.getUTCMinutes()/}
				{if parseInt(arr_mins)<10}
				{set arr_mins="0"+arr_mins /}
				{/if}
				{var l_weekday = moduleCtrl.getWeekDayUTC(arrJson).substr(0,3) /}
				{var l_month= moduleCtrl.getMonthUTC(arrJson)/}

		        {var index = parseInt(item_index)+1/}
		        <div class="trip large-display">
		          <p>
		            <time datetime="2013-03-25">${f_weekday}, ${depJson.getUTCDate()} ${f_month} ${depJson.getUTCFullYear()}</time>
		            <time datetime="07:35">${dep_hrs}:${dep_mins}</time>
		            <span>${this.moduleCtrl.toTitleCase(journey[flightNo].departureAirport.airportLocation.cityName)}</span> <span>${this.moduleCtrl.toTitleCase(journey[flightNo].departureAirport.airportLocation.airportName)}<abbr>(${journey[flightNo].departureAirport.locationCode})</abbr></span> <span><strong>${label.Terminal} ${journey[flightNo].departureAirport.terminal}</strong></span> </p>
		          <p>
		            <time datetime="2013-03-25">${l_weekday}, ${arrJson.getUTCDate()} ${l_month} ${arrJson.getUTCFullYear()}</time>
		            <time datetime="11:55">${arr_hrs}:${arr_mins}</time>
		            <span>${this.moduleCtrl.toTitleCase(journey[flightNo].arrivalAirport.airportLocation.cityName)}</span> <span>${this.moduleCtrl.toTitleCase(journey[flightNo].arrivalAirport.airportLocation.airportName)}<abbr>(${journey[flightNo].arrivalAirport.locationCode})</abbr></span> <span><strong>${label.Terminal} ${journey[flightNo].arrivalAirport.terminal}</strong></span> </p>
		        </div>
		        <div class="details">
		          <ul>
		            {if flightList.length == 1}
		            <li class="fare-family"><span class="label">${label.Flight}:</span> <span class="data"><strong>${journey[flightNo].operatingAirline.companyName.companyIDAttributes.code}${journey[flightNo].operatingAirline.flightNumber}</strong>{if journey[flightNo].leg.length == 1}(${label.Direct}){else /}(${label.InDirect}){/if}</span></li>
		            {/if}
		            {if parameters.SITE_SSCI_OP_AIR_LINE!=journey[flightNo].operatingAirline.companyName.companyIDAttributes.code}
		            <li class="fare-family"><span class="label">${label.operatedBy}:</span> <span class="data"><strong>${journey[flightNo].operatingAirline.companyName.companyIDAttributes.companyShortName}</strong></span></li>
		            {/if}
		            <!--<li class="duration"><span class="label">Duration:</span> <span class="data">3 hr 45 min</span></li>-->
		          </ul>

		          <!--<a class="secondary" href="javascript:void(0);">Cancel check-in for this flight</a>-->
		        </div>
		      </section>
		      <section id="section4_1${flightNo}" {if !boolBP}data-aria-hidden="false" style="display: block;"{else/}data-aria-hidden="true" style="display: none;"{/if} >
		        <header>
		          <h2 class="subheader"> <span>${label.PaxServices}</span>
		            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="services01${flightNo}"><span>Toggle</span></button>
		          </h2>
		        </header>
		        <div id="services01${flightNo}" data-aria-hidden="false">
					<div class="services-catalog">
						/*Begin Checking All Pax Boarding Pass Printed or not for adult(for infant same as adult) and child */
						{var allPaxBoardingPassSentOrChangeSeatInhibited = false/}
				//		{if (parameters.SITE_SSCI_DSBL_CST_BP_GEN && parameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/false/i) == -1)}
							{var boardingPassSentOrChangeSeatInhibited = 0/}
							{var totalPaxCount = 0 /}
							{foreach customerIndex in item.customer}
								{var customer = journey[customerIndex]/}
								{if customer.passengerTypeCode != "INF"}
									{set totalPaxCount = totalPaxCount+1 /}
									{var PassengerFlightConstraint = customerIndex+flightNo/}
									{if (journey.productDetailsBeans[PassengerFlightConstraint].boardingPassPrinted && (parameters.SITE_SSCI_DSBL_CST_BP_GEN && parameters.SITE_SSCI_DSBL_CST_BP_GEN.search(/false/i) == -1)) || !(journey.productDetailsBeans[PassengerFlightConstraint].seatChangeAllowed)}
										{set boardingPassSentOrChangeSeatInhibited = boardingPassSentOrChangeSeatInhibited + 1/}
									{/if}
								{/if}
							{/foreach}
							{if boardingPassSentOrChangeSeatInhibited == totalPaxCount}
								{var allPaxBoardingPassSentOrChangeSeatInhibited = true/}
							{/if}
				//		{/if}

						/*End Checking All Boarding Pass Printed or not for adult(for infant same as adult) and child */

			            <!--<p class="services-checked-label">Select services to view or modify:</p>-->
			            /*
			            Removing hole div as of now, if any button comes along with seatmap then has to remove only seatmap li
			            */
			            {var displaySeatMap = true /}
			            {if (parameters.SITE_SSCI_EN_SEAT_MNGE_CK.search(/false/i) != -1) && flow == 'manageCheckin' }
			            		{set displaySeatMap = false/}
			            {/if}

			            {if (parameters.SITE_SSCI_CHG_ST_AFTR_CON.search(/false/i) != -1) && flow != 'manageCheckin' }
			            		{set displaySeatMap = false/}
			            {/if}

						/* IATCI Seat Map Paramter */
			            {if displaySeatMap}
			            	{if journey.productDetailsBeans[flightNo].IATCI_Flight}
								{if parameters.SITE_SSCI_ALLW_IATCI_SEAT != null && parameters.SITE_SSCI_ALLW_IATCI_SEAT.search(/true/i) != -1}
									{var displaySeatMap = true/}
								{else/}
									{var displaySeatMap = false/}
								{/if}
							{/if}
			            {/if}
			            /* IATCI Seat Map Parameter */

			            /*If seat map is not disabled through the parameters*/
			            {if displaySeatMap}
							{if !allPaxBoardingPassSentOrChangeSeatInhibited }
					            <div class="draggable-parent">
						              <ul class="services-checked draggable ">
					                <li data-info-service="11a (Window)" class="conf-seat-icon {if allPaxBoardingPassSentOrChangeSeatInhibited}seatmaplinkDisabled{/if}">
					                  {if this.moduleCtrl.findAdltChildCountFromCustIDList(item.customer,flightNo,"ac") > 0}
					                  	<p class="amount"><span>${this.moduleCtrl.findAdltChildCountFromCustIDList(item.customer,flightNo,"ac")}</span></p>
					                  {/if}
					                  <a {if !allPaxBoardingPassSentOrChangeSeatInhibited} {on click { fn:"onSeatClick", args: {prodIndex : item_index,from:"ac"},scope:this.moduleCtrl}/} {/if} class="secondary expanded {if allPaxBoardingPassSentOrChangeSeatInhibited}disabled{/if}" href="javascript:void(0)"> <span><div class="seatBKGInSeatMap"></div></span>
					                  <p class="label">{if !allPaxBoardingPassSentOrChangeSeatInhibited} ${label.Seat} {else/} ${label.SeatChangeNotAvailable} {/if}</p>
					                  </a>
						            </li>
					              </ul>
					            </div>
				            {else/}
				            	/*If seat map is allowed through the parameters but inhibited due to some reason*/
	  							<div class="message info"><p>${label.SeatChangeNotAvailable}</p></div>
				 			{/if}
						{/if}

			            <div class="services-promo">
			              /*   <p><span><i data-aria-hidden="true" class="icon icon-tick" style="display: none;"></i></span><span class="custom">11a (Window), 11b, 11c (Aisle)</span></p>   */
			        </div>
			        </div>
		          <ul class="services-pax selectable flight${flightNo}" id="service_flight${flightNo}">
		            {foreach customerNo in item.customer}
		            	{var customer = journey[customerNo]/}
		            	{var passengerFlightCode = customerNo+flightNo /}
		            	{var passengerLegCode = customerNo+journey[flightNo].leg[0].ID /}
		            	{if customer.passengerTypeCode != "INF"}

		            		/*Begin Checking Boarding Pass Printed or not for adult(for infant same as adult) and child */

		            		        /* NOTE : Here We are not setting value for infant as,we take the infants value from its adult */

		            		{var l_cprBpPrinted = false /}
		            		{if parameters.SITE_SSCI_DSBL_CSL_BP_GEN && parameters.SITE_SSCI_DSBL_CSL_BP_GEN.search(/false/i) == -1}
		            			{var PassengerFlightConstraint = customerNo+flightNo/}
		            			{set l_cprBpPrinted = journey.productDetailsBeans[PassengerFlightConstraint].boardingPassPrinted/}
		            		{/if}
		            		/*End Checking Boarding Pass Printed or not for adult(for infant same as adult) and child */


							/*Begin checking if the pax is checked in or not in the next segment */
							{var nextSegCheckedIn = false /}
							{if item_index<selectedCPR.flighttocust.length-1}
								{var nextSegment = selectedCPR.flighttocust[(parseInt(item_index)+1)] /}
								{var l_legID =cpr[selectedCPR.journey][nextSegment.product].leg[0].ID /}

								{if cpr[selectedCPR.journey].status.legPassenger[customerNo+l_legID+"CAC"] != null}
									{if cpr[selectedCPR.journey].status.legPassenger[customerNo+l_legID+"CAC"].status[0].code == '1'}
										{set nextSegCheckedIn =true/}
									{/if}
								{/if}
								{if cpr[selectedCPR.journey].status.legPassenger[customerNo+l_legID+"CST"] != null}
									{if cpr[selectedCPR.journey].status.legPassenger[customerNo+l_legID+"CST"].status[0].code == '1'}
										{set nextSegCheckedIn =true/}
									{/if}
								{/if}

							{/if}
							/*End checking if the pax is checked in or not in the next segment */

		            		{var infantPrimeId = "" /}
						 	{var infant = "" /}

						 	{if customer.accompaniedByInfant == true }
								/* Start :: To check if infant is associated to pax or not */
								{if journey.service != null}
										{foreach service in journey.service}
											{if service_index.indexOf('INFT') != '-1' && service_index.indexOf(flightNo) != '-1'}
												{var productID = service.referenceIDProductProductID/}
												{if journey.associatedProducts != null && journey.associatedProducts[productID].referenceIDProductPassengerID == customer.ID}
														{set infantPrimeId = service.referenceIDProductPassengerID/}
														{var infant = journey[infantPrimeId] /}
												{/if}
											{/if}
										{/foreach}
								{/if}
							{/if}
							/* End :: To check if infant is associated to pax or not */
							<li {if customer.passengerTypeCode == "CHD"}class = "child"{/if}>
							<input {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id = "paxflight${customerNo}_${flightNo}" name = "pax${customerNo}" value="${customerNo}" {if l_cprBpPrinted || nextSegCheckedIn} disabled {/if}>
								<label for="pax${customerNo}">
				              		<h4>{if customer.personNames[0].namePrefixs[0]}
				              				${jQuery.substitute(label.PassengerName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
				              			{else/}
				              				${jQuery.substitute(label.PassengerName, ["",customer.personNames[0].givenNames[0], customer.personNames[0].surname])}
				              			{/if}
				              		</h4>
				              		<dl>
				              		{var carrier="" /}
						            {var number="" /}
									{if moduleCtrl.getPaxDetailsForPrefill(customerNo) != null}
										{var fqtv= moduleCtrl.getPaxDetailsForPrefill(customerNo) /}
										{set carrier=fqtv.split("~")[0] /}
						                {set number=fqtv.split("~")[1] /}
									{else/}
						            {if customer.frequentFlyer.length>0}
						                {set carrier=customer.frequentFlyer[0].customerLoyalty.programID /}
						                {set number=customer.frequentFlyer[0].customerLoyalty.membershipID /}
						            {/if}
						            {/if}
				                	<dt>${label.FFNumber}: </dt>
				                	<dd>{if number != ""}{if carrier}${carrier}-{/if} ${number}{else/}-{/if}</dd>
				              		</dl>
				              		<dl>
				                	<dt>${label.Cabin}:&nbsp;</dt>
				                	<dd>${moduleCtrl.getCabinClassByName(journey.cabinInformation.legPassenger[passengerLegCode].bookingClass)}<abbr>(${journey.cabinInformation.legPassenger[passengerLegCode].bookingClass})</abbr> </dd>
				                	<dt>${label.Seat}: </dt>
				                	{var passengerLegCodeSeat = passengerLegCode + "SST"/}
				                	<dd id="${passengerLegCodeSeat}">{if journey.seat[passengerLegCodeSeat].status.code == "U"}-{elseif journey.seat[passengerLegCodeSeat].status.code == "A" /}${journey.seat[passengerLegCodeSeat].row}${journey.seat[passengerLegCodeSeat].column}{/if}</dd>
				              		</dl>

			              		</label>
		               		</li>
							{if customer.accompaniedByInfant == true }
								<li class="infant">
//								<input {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id = "pax${infantPrimeId}" name = "pax${infantPrimeId}" value="${infantPrimeId}">
								<label for="pax${infantPrimeId}">
		                            {if infant.personNames[0].namePrefixs[0] && customer.personNames[0].namePrefixs[0]}
		                        		<h4>${jQuery.substitute(label.PassengerName, [infant.personNames[0].namePrefixs[0],infant.personNames[0].givenNames[0],infant.personNames[0].surname])}</h4>
			                        	<dl>
			                             	<dt>${label.TravellingWith} </dt>
			                             	<dd>${jQuery.substitute(label.PassengerName, [customer.personNames[0].namePrefixs[0],customer.personNames[0].givenNames[0],customer.personNames[0].surname])}</dd>
			                            </dl>
		                        	{else/}
		                        		<h4>${jQuery.substitute(label.PassengerName, ["",infant.personNames[0].givenNames[0],infant.personNames[0].surname])}</h4>
			                        	<dl>
			                             	<dt>${label.TravellingWith} </dt>
			                             	<dd>${jQuery.substitute(label.PassengerName, ["",customer.personNames[0].givenNames[0],customer.personNames[0].surname])}</dd>
			                            </dl>
		                        	{/if}
		                        	</label>
								 </li>
							{/if}
		            	{/if}

		            {/foreach}
		          </ul>
		          {if flow == "manageCheckin"}
		          	<a class = "secondary main disabled cancelChkn" {on click {fn : "onCancelCheckIn" , args : {flight : item.product}}/} href="javascript:void(0);">${label.cancelChkn}</a>
		          {/if}
		        </div>
		      </section>
		    </article>
	{/foreach}
    <footer class="buttons">
      <button type="button" {on click {fn : "onHomeClick"}/} class="validation" data-seatinfo="chargeable-seats">${label.exitCheckin}</button>
    </footer>
  </form>
</section>
/*End Of The Main Section */

/*Email PopUp Starting */
{section {
	id : "popupSection",
	macro : "popup"
} /}
/*Email PopUp Ending */

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
	<p>${this.label.cancelChknConfirmation}</p>
	<footer class="buttons">
	<button id="okButton" class="validation active" type="submit">${this.label.Ok}</button>
	<button id="cancelButton" class="cancel" type="reset">${this.label.Abort}</button>
	</footer>
</div>


</div>

</div>
{/macro}
{macro popup()}
		  {var cpr = this.moduleCtrl.getCPR() /}
		  {var selectedCPR = this.moduleCtrl.getSelectedCPR()/}
		  {var journey = cpr[selectedCPR.journey]/}
		  {if this.popUpSelected != ""}
		  <div /*{if this.popUpSelected == "passbook"}class="dialog native"{else/} */class="popup input-panel"/*{/if}*/ id="CommonPopup" style="display: none;">
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
				        <h1>{if this.popUpSelected == "passbook"}${label.Passbook}{elseif this.popUpSelected == "Email"/}${label.EmailBoardingPass}{elseif this.popUpSelected == "ConfEmail"/}${label.checkInConfirmation}{elseif this.popUpSelected == "SMS"/}${label.SMSBoardingPass}{elseif this.popUpSelected == "MBP"/}${label.IssueBoardingPass}{/if}</h1>
				      </hgroup>
				    </header>

				    <section>
				     /* to display any email validation errors */
				    <div id="initiateandEditCommonErrors">
				    </div>
				      <label>{if this.popUpSelected == "Email"}${label.SendBoardingpass}:{elseif this.popUpSelected == "ConfEmail"/}${label.confEmailMsg}{elseif this.popUpSelected == "SMS"/}${label.Sendsmsto}{elseif this.popUpSelected == "MBP"/}${label.IssueMsg}:{/if}</label>
				        {if this.popUpSelected == "passbook"}
				        <ul class="btnInPanel arrowToAllHeader">
				        	{foreach flightID in this.filteredSelectedFlightList}
				        		<li {on click {fn : "onPassbookFlightButtonClick", args: {"flightID" : flightID}}/} > <a href="javascript:void(0)" id="PassbookPnl" class="secondary sendBpContiner">${journey[flightID].departureAirport.airportLocation.cityName} - ${journey[flightID].arrivalAirport.airportLocation.cityName}</a><div name="passbookArrow" class="arrowIcon arrowIcon${flightID}"></div></li>
				        		<li name="pkFlightButtons" class="PassbookCont${flightID}" style="display:none">
								<section>
					   			 <article class="shoppingDeals">
						    	  <ul class="sliderBtns passbooksliderBtns">
						    	  	{var flighttocust1 = ""/}
						    	  	{foreach flighttocustTemp in selectedCPR.flighttocust}
						    	  		{if flighttocustTemp.product == flightID}
						    	  			{set flighttocust1 = flighttocustTemp/}
						    	  		{/if}
						    	  	{/foreach}
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
									          {if customer.personNames[0].namePrefixs[0]}${customer.personNames[0].namePrefixs[0]}{/if} {if customer.personNames[0].givenNames[0]}${customer.personNames[0].givenNames[0]}{/if} {if customer.personNames[0].surname}${customer.personNames[0].surname}{/if}

	          						          /*{if customer.accompaniedByInfant}
									        	  <span class="infant">
								          			{var infantId = this.moduleCtrl.findInfantIDForCust(selectedCPR.product[0],customer.ID)/}
								          			{var infant = journey[infantId]/}
								          			{if infant.personNames[0].namePrefixs[0]}${infant.personNames[0].namePrefixs[0]}{/if} {if infant.personNames[0].givenNames[0]}${infant.personNames[0].givenNames[0]}{/if} {if infant.personNames[0].surname}${infant.personNames[0].surname}{/if}
								          		  </span>
									          {/if}*/
									         /*</label>*/
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

						          {if this.popUpSelected != "ConfEmail"}
						          <input type="checkbox" id="pax${customer.ID}" name="pax11" value="${customer.ID}" class="customerSelectCheckBox"
						          {if this.popUpSelected == "Email" && spbpAllowed_flag==false}
						          disabled="disabled"
						          {elseif (this.popUpSelected == "SMS" || this.popUpSelected == "MBP") && mbpAllowed_flag==false /}
						          disabled="disabled"
						          {else/} checked ="" {/if}>
						          {/if}

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
						          {if (this.popUpSelected == "Email" && spbpAllowed_flag==true) || this.popUpSelected == "ConfEmail"}
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
				      {elseif this.popUpSelected == "ConfEmail"/}
				      		<button type="submit" {on tap {fn : "onConfEmailSendClick"}/} id="sendBoardingPassButton" class="validation">${label.tx_merci_text_mail_btnsend}</button>
				      {elseif this.popUpSelected == "SMS"/}
				      		<button type="submit" {on tap {fn : "onSMSClick"}/} id="sendBoardingPassButton" class="validation">${label.SendBoardingpass}</button>
				      {elseif this.popUpSelected == "MBP"/}
				      		<button type="submit" {on tap {fn : "onMBPClick"}/} id="sendBoardingPassButton" class="validation">${label.GetBoardingPass}</button>
				      {/if}
				      <button type="submit" class="validation cancel" {if this.popUpSelected == 'ConfEmail'}data-conf-pop="confEmailPopCancel"{/if} formaction="javascript:void(0);">{if this.popUpSelected == "ConfEmail"}${label.NoThanks}{else/}${label.Cancel}{/if}</button>
				    </footer>
				</article>
		  /*{/if}*/
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