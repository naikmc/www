{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.BoardingPassesList',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript : true
}}
  {macro main()}
 	{var BoardingPassesListRespDtls= this.requestParam.BPResponseDetails /}
	{var deliveredDocuments =BoardingPassesListRespDtls.deliveredDocuments /}
	{var cpr =this.moduleCtrl.getCPR() /}
	{var selectedCPR = this.moduleCtrl.getSelectedCPR() /}
	{var journey = selectedCPR.journey /}
	{var label = this.label /}
	 {var warnings = moduleCtrl.getWarnings() /}

<div class='sectionDefaultstyle sectionDefaultstyleSsci'>

<div id="boardingListErrorMsgs"></div>

<article class="carrousel-full" >

<div id="boardWarnMsg" class="bpMesgsmargin">
        {if warnings != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : warnings,
              "type" : "warning" }
          }/}
        {/if}
  </div>

    <h1 data-flightinfo="route" data-location="#"></h1>
	{var headName ="" /}
	{var totalListTracker=-1 /}

    <ul id="listboxa">



      {foreach flightWiseDoc in this.flightWiseDocs}

		{var flightID = flightWiseDoc_index /}
		{set headName = cpr[journey][flightID].departureAirport.airportLocation.cityName+" - "+cpr[journey][flightID].arrivalAirport.airportLocation.cityName /}
	  	{set totalListTracker+=1 /}
		{var len = flightWiseDoc.length /}

      <li class="boardingindex">
      <article class="carrousel-full-item"
      {on tap { fn:"displayBPforSelectedFlights", args: {flightID:flightID}}/}
      {on dblclick { fn:"displayBPforSelectedFlights", args: {flightID:flightID}}/}
      data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">

          <section class="boardingindex">
            <h3><strong>${len}</strong> Boarding pass</h3>
              <ul>
              	{foreach prd in flightWiseDoc}

              		{var prodID = prd.products[0]/}
              		{var paxIDandFlightID = this.moduleCtrl.findPaxFlightIdFrmProductId(cpr[journey],prodID)/}
				    {var paxID =paxIDandFlightID.split("~")[0] /}
					{var paxName= cpr[journey][paxID].personNames[0].givenNames[0]+" "+cpr[journey][paxID].personNames[0].surname/}

                	<li class = "boardingPax">${paxName}</li>

                {/foreach}
              </ul>

            {var date =new Date(cpr[journey][flightID].timings.SDT.time) /}
			{var weekday = moduleCtrl.getWeekDayUTC(date).substr(0,3) /}

            <div>
              <time datetime="2013-02-22">
                <span data-flightinfo="day-number">${date.getUTCDate()}</span>
                  <span>
                    <span data-flightinfo="day-name">${weekday}</span>
                    <span data-flightinfo="month">${moduleCtrl.getMonthUTC(date)}</span>
                    <span data-flightinfo="year">${date.getUTCFullYear()}</span>
                  </span>
              </time>
            </div>
          </section>

      </article>
      </li>

      {/foreach}

    </ul>


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
    <footer class="buttons">
      <button type="button" class="validation cancel" {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
</div>
  {/macro}
{/Template}
