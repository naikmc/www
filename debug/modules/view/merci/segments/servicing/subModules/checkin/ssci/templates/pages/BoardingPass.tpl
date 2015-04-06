{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.BoardingPass',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
    autocomplete : 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
  },
  $hasScript : true
}}
  {macro main()}
	{var cpr =this.moduleCtrl.getCPR() /}
 {var warnings = moduleCtrl.getWarnings() /}

<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionBoardingpassSpecific'>

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
<div id="boardingErrorMsgs"></div>
	<div id="boardingWarnMsg" class="bpMesgsmargin">
        {if warnings != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : warnings,
              "type" : "warning" }
          }/}
        {/if}
  </div>

	{if cpr==null}
	{var requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCIBoardingPass_A.requestParam /}
	{var bpResponse = requestParam.BPResponseDetails /}
	{var label =this.label/}



	<article class="carrousel-full" >
		<h1 data-flightinfo="route" data-location="#"></h1>
		{var headName ="" /}

		<ul id="listboxa">
		{foreach deliveredDocument in bpResponse.deliveredDocuments}
			{var prodID = deliveredDocument.products[0]/}
			{set headName =  requestParam.ProductsFromSMS[prodID] /}
			{if deliveredDocument.formattedDocument.content=="" || deliveredDocument.formattedDocument.content=="text/html"}
			{var encodedHTMLData= String.fromCharCode.apply(null, deliveredDocument.formattedDocument.base64Binary)/}
			{else/}
			{var encodedHTMLData = deliveredDocument.formattedDocument.content /}
			{/if}
			  <li class="boardingindex">
		      <article class="carrousel-full-item" data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">
		      ${encodedHTMLData|escapeForHTML:false}

			   	{var boolPassBook = false /}
		      	{var ver = this.findIOSVersion()/}
			  	{var versionTrue = false /}
				{if typeof ver !== "undefined" && ver[0]>=6}
				  {set versionTrue = true/}
				{/if}
			  	{if aria.core.Browser != null && aria.core.Browser.isIOS != null && versionTrue && parameters.SITE_SSCI_PSSBK_FRMT_CD && parameters.SITE_SSCI_PSSBK_FRMT_CD.trim() != ""}
					{set boolPassBook = true /}
			  	{/if}
			  	{if boolPassBook == true}
		      		//<button class="secondary" {on click {fn : "addToPass", args : {productID: prodID} } /}>${label.addToPassbook}</button>
					  <ul class="btnInPanel">
					  <ul class="sliderBtns passbooksliderBtns">
					        <li id="pkProduct${prodID}"
					        {if this.data.passBookGenerated[prodID] == "1"}
					        	class="secondary pkCreated"
				        	{else/}
				        		class="secondary"
					        {/if}>
					        <a {on click {fn : "addToPass",args : {productID: prodID}} /}>
					          <span id=passbookImage></span>${label.addToPassbook}
				            </a>
					        </li>
			     	   </ul>
			     	   </ul>
			  	{/if}
		      </article>
		      </li>
		{/foreach}
		</ul>
	    <footer>
	      <ul id = "Indicator_details">
	      </ul>
	    </footer>

	 </article>

	{else/}
<article class="carrousel-full" >
    /*Placed here because incase of bitly all this will be null*/
    {var selectedCPR = this.moduleCtrl.getSelectedCPR() /}
	{var journey = selectedCPR.journey /}
	{var selectedFlightforMBP =this.moduleCtrl.getSelectedFlightforMBP()/}
	{var flightWiseDocs =this.moduleCtrl.getFlightWiseDocs()/}
	{if flightWiseDocs == null}
	{set selectedFlightforMBP ="BoardingPasses" /}
	{if flightWiseDocs={} , flightWiseDocs.BoardingPasses = this.requestParam.BPResponseDetails.deliveredDocuments}{/if}
	{/if}
	{var BoardingPassesListRespDtls= this.requestParam.BPResponseDetails /}
	{var deliveredDocuments =BoardingPassesListRespDtls.deliveredDocuments /}

    <h1 data-flightinfo="route"></h1>
	{var headName ="" /}
	{var totalListTracker=-1 /}

    <ul id="listboxa">


      {foreach deliveredDocument in flightWiseDocs[selectedFlightforMBP]}
	      {if deliveredDocument.formattedDocument.content=="" || deliveredDocument.formattedDocument.content=="text/html"}
			{var encodedHTMLData= String.fromCharCode.apply(null, deliveredDocument.formattedDocument.base64Binary)/}
		  {else/}
			{var encodedHTMLData = deliveredDocument.formattedDocument.content /}
		  {/if}
	      {var encodedHTMLData= deliveredDocument.formattedDocument.content /}
	      {var prodID = deliveredDocument.products[0]/}
	      {var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(cpr[journey],prodID)/}
	      {var paxID =paxIDandFlightID.split("~")[0] /}
	      {var flightID =paxIDandFlightID.split("~")[1] /}
	      {var paxName= cpr[journey][paxID].personNames[0].givenNames[0]+" "+cpr[journey][paxID].personNames[0].surname/}
	      {var flight = cpr[journey][flightID].operatingAirline.companyName.companyIDAttributes.code + cpr[journey][flightID].operatingAirline.flightNumber/}
	      {set headName = paxName+" - "+flight /}
		  {set totalListTracker+=1 /}


	      <li class="boardingindex">
	      <article class="carrousel-full-item" data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">
	      ${encodedHTMLData|escapeForHTML:false}

	      {var boolPassBook = false /}
	      {var ver = this.findIOSVersion()/}
		  {var versionTrue = false /}
			{if typeof ver !== "undefined" && ver[0]>=6}
			  {set versionTrue = true/}
			{/if}
		  {if aria.core.Browser != null && aria.core.Browser.isIOS != null && versionTrue && parameters.SITE_SSCI_PSSBK_FRMT_CD && parameters.SITE_SSCI_PSSBK_FRMT_CD.trim() != ""}
			{set boolPassBook = true /}
		  {/if}
		  {if boolPassBook == true}
		  <ul class="btnInPanel">
		  <ul class="sliderBtns passbooksliderBtns">
		        <li id="pkProduct${prodID}"
		        {if this.data.passBookGenerated[prodID] == "1"}
		        	class="secondary pkCreated"
	        	{else/}
	        		class="secondary"
		        {/if}>
		        <a {on click {fn : "addToPass",args : {productID: prodID}} /} >
		          <span id=passbookImage></span>${label.addToPassbook}
		        </a>
		        </li>
     	   </ul>
     	   </ul>

	      //<button class="passbookButton" {on click {fn : "addToPass", args : {productID: prodID} } /}>${label.addToPassbook}</button>
		  {/if}
	      </article>
	      </li>

      {/foreach}

    </ul>
	//<article>

    <footer>
      <ul id = "Indicator_details">
      </ul>
    </footer>

 </article>

 /*Using for local storage*/
  {foreach deliveredDocument in deliveredDocuments}

       {var prodID = deliveredDocument.products[0]/}
       {var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(cpr[journey],prodID)/}
       {var paxID =paxIDandFlightID.split("~")[0] /}
       {var flightID =paxIDandFlightID.split("~")[1] /}
       {var paxName= cpr[journey][paxID].personNames[0].givenNames[0]+" "+cpr[journey][paxID].personNames[0].surname/}
       {var flight = cpr[journey][flightID].operatingAirline.companyName.companyIDAttributes.code + cpr[journey][flightID].operatingAirline.flightNumber/}
       {var flightNameCode = cpr[journey][flightID].operatingAirline.companyName.companyIDAttributes.code /}
       {var flightNumber = cpr[journey][flightID].operatingAirline.flightNumber/}
       {var boardPoint= cpr[journey][flightID].departureAirport.airportLocation.airportCodeID/}
       {var offPoint= cpr[journey][flightID].arrivalAirport.airportLocation.airportCodeID/}
	   {var boardCity= cpr[journey][flightID].departureAirport.airportLocation.cityName/}
       {var offCity= cpr[journey][flightID].arrivalAirport.airportLocation.cityName/}
       {var STD_time= new Date(cpr[journey][flightID].timings.SDT.time)/}
       {set STD_time= new Date(Date.UTC(STD_time.getFullYear(),STD_time.getMonth(),STD_time.getDate(),STD_time.getHours(),STD_time.getMinutes(),STD_time.getSeconds()))/}
       {var arrivalTime= new Date(cpr[journey][flightID].timings.SAT.time)/}
       {set arrivalTime= new Date(Date.UTC(arrivalTime.getFullYear(),arrivalTime.getMonth(),arrivalTime.getDate(),arrivalTime.getHours(),arrivalTime.getMinutes(),arrivalTime.getSeconds()))/}


	    /*image details
		<div style="display:none" class="padall alignCen" data-offlinestore="PNR_${cpr.customerLevel[0].recordLocatorBean.controlNumber}_${selection.product}_${customer}_${productView[selection.product].operatingFlightDetailsMarketingCarrier}${productView[selection.product].operatingFlightDetailsFlightNumber}_${productView[selection.product].operatingFlightDetailsBoardPointInfo.city}_${productView[selection.product].operatingFlightDetailsOffPointInfo.city}_{call common.dateMacro(productView[selection.product].legLevelBean,productView[selection.product].operatingFlightDetailsBoardPoint,productView[selection.product].operatingFlightDetailsOffPoint,pattern) /} {call common.timeMacro(productView[selection.product].legLevelBean,productView[selection.product].operatingFlightDetailsBoardPoint,productView[selection.product].operatingFlightDetailsOffPoint,pattern) /}_${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}_${productView[selection.product].arrDateinGMT}_${cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId}_${bording_time}_${gateNumber}">
	     	<img src="data:image/png;base64,${boardingPassDet.boardingPassBase64[customer_index]}" alt="${label.Title}" width="280px" height="280px" />
	    </div>
	    End image details*/

		/* home start */
	    <div style="display:none"  class="slide displayNone homeScreenDisplay" id="${prodID}-home">/*start of home to for homepage display of boarding pass */
		    <ul class="padall posR colorWhite">
		      <li>${label.BoardingPassFor} ${flightNameCode}${flightNumber}</li>
		      <li class="textextraBig1">${boardPoint} - ${offPoint}</li>
		      <li class="textBig">${STD_time|dateformat:"dd-MMM-yyyy"} ${STD_time|dateformat:"hh:mm"} - ${arrivalTime|dateformat:"hh:mm"}</li>
		       <span id="${prodID}_departureDate" data-requiredStructure="${STD_time|dateformat:"yyyy-MM-dd"}" style="display: none" >${STD_time|dateformat:"dd-MMM-yyyy"}</span>
		      <li class="textBig">${paxName}</li>
		      <li>
		      	<a href="javascript:void(0)" onclick="modules.view.merci.common.utils.MCommonScript.displayBPHome('${prodID}')">
		         <div class="boardingIcon">${label.BrdgPass}</div>
		      	</a>
		     </li>
		    </ul>
	    </div>
	    /* end of home */

	  	/*start of small */
	      <div  class="displayNone" id="${prodID}-small">
	        <div class="shadow bradius">
	          <p class="posR boundsTitle">${boardCity} - ${offCity} <span class="cross crosswhite" id="${prodID}_calendarClose" onclick="modules.view.merci.common.utils.MCommonScript.removePNR('${prodID}')">&nbsp;</span></p>
	          <div class="panelWrapper1 boundRecap">
	            <div class="panelWrapperInner">
	              <div class="padall">
	                <ul class="width70 posR">
	                 <li> <span class="strong">${flightNameCode}${flightNumber}</span></li>
	                  <li class="cityPair strong">${boardPoint} - ${offPoint}</li>
	                  <li class="strong">${STD_time|dateformat:"dd-MMM-yyyy"} ${STD_time|dateformat:"hh:mm"} - ${arrivalTime|dateformat:"hh:mm"}</li>
	                  <li class="strong">${paxName}</li>
	                  <a id="${prodID}-link" class="textUnderline" href="javascript:void(0)" onclick="modules.view.merci.common.utils.MCommonScript.displayBoardingPass('${prodID}')">
	                    <li class="boardingCookie">${label.BoardingPass}</li>
	                  </a>
	                </ul>
	              </div>
	            </div>
	          </div>
	      </div>
	    </div>
	   /*end of small */


  {/foreach}
  /*End Using for local storage*/

	{/if}
    <footer class="buttons">
      <button type="button" class="validation cancel" {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>

	<div class="popupBGmask" class="displayNone">&nbsp;</div>
</div>

  {/macro}
{/Template}
