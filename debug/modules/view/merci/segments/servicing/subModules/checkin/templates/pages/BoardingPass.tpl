{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.BoardingPass',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript : true
}}
  {macro main()}
	{var pageData = moduleCtrl.getModuleData().checkIn /}
    {var label = pageData.MBoardingPass_A.labels /}
	{var pattern = pageData.MBoardingPass_A.pattern /}
    {var boardingPassDet = moduleCtrl.getBoardingPassResp() /}
    {var bpGeneratedResp = boardingPassDet.bpGeneratedList /}
    {var boardingPassRespDtls = moduleCtrl.getBoardingPassRespDtls() /}
    {var cpr = moduleCtrl.getCPR() /}
    {var acceptedcpr = null /}
    {if moduleCtrl.getAcceptedCPR()!= null}
    {set acceptedcpr = moduleCtrl.getAcceptedCPR() /}
    {/if}
    {var selectedcpr = "" /}
	{if moduleCtrl.getBoardingInput() != null}
    	{set selectedcpr = moduleCtrl.getBoardingInput().selectedCPR /}
      {else/}
      {set selectedcpr = [] /}
    {/if}

    {if cpr != null}
    {var productView = cpr.customerLevel[0].productLevelBean/}
    {/if}
    {var seat = label.NotAdded /}
    {var custFullName = null /}
    {var custArrTime = null /}
    {var appResponseDetail = "" /}
    {var appResponseDetailEncodedHTML = "" /}
    {var customerArrDate = null/}
    {var custDepDate = null /}
    {var boardTime = null /}
    {var flightNumHome = ""/}
    {var departureAirportHome = ""/}
    {var arrivalAirportHome = ""/}
    {var departureTimeHome = ""/}
    {var arrivalTimeHome = ""/}
    {var departureDateHome = ""/}
    {var article = ""/}
    {var idName = null/}

<div class='sectionDefaultstyle'>
  {if pageData.MBoardingPass_A.isSMS != null && typeof pageData.MBoardingPass_A.isSMS !== "undefined" && pageData.MBoardingPass_A.isSMS}
 		<article class="carrousel-full" >
    <h1 data-flightinfo="route" data-location="#"></h1>
    {var headName ="" /}
    {var totalListTracker=-1 /}
    <ul id="listboxa">
    {foreach doc in boardingPassRespDtls.formattedDocumentList}
      {set totalListTracker+=1 /}
      {set headName =  "Boarding Passes" /}
      {if  arrayBP = doc.encodedData.split("</article>") }{/if}
      {foreach item in arrayBP}
        {if item = item + "</article>"}{/if}
        
        {if item_index!=(arrayBP.length-1)}
        <li class="boardingindex">
          <article class="carrousel-full-item" data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">
          ${item|escapeForHTML:false}
          </article>
        </li>
        {/if}
      {/foreach}
    {/foreach}
    </ul>
        <footer>
          <ul id = "Indicator_details">
          </ul>
        </footer>
    </article>
  {else/}
    {if productView != null}
      <section>

    <article class="carrousel-full" >
    <h1 data-flightinfo="route" data-location="#"></h1>
    {var headName ="" /}
    {var totalListTracker=-1 /}
    <ul id="listboxa">
    {foreach doc in boardingPassRespDtls.formattedDocumentList}
      {set totalListTracker+=1 /}
      {set headName =  "Boarding Passes" /}
      {if  arrayBP = doc.encodedData.split("</article>") }{/if}
      {foreach item in arrayBP}
        {if item = item + "</article>"}{/if}
        
        {if item_index!=(arrayBP.length-1)}
        <li class="boardingindex">
          <article class="carrousel-full-item" data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">
          ${item|escapeForHTML:false}
          </article>
        </li>
        {/if}
      {/foreach}
    {/foreach}
    </ul>
        <footer>
          <ul id = "Indicator_details">
          </ul>
        </footer>
    </article>

      //{foreach doc in boardingPassRespDtls.formattedDocumentList}
        // ${doc.encodedData|escapeForHTML:false}
      //{/foreach}

        //${boardingPassRespDtls.formattedDocumentList[1].encodedData|escapeForHTML:false}/* Everytime data will come in this */
        {set appResponseDetailEncodedHTML = boardingPassRespDtls.formattedDocumentList[0].binaryHTMLData /}
            {foreach selection in  selectedcpr}
              {foreach customer inArray selection.customer}
                <article style="display:none" class="test">
                  <section>
                    {var paxCheckedinForBP = false /}
                    {var eTicketforBP = false /}
                      {if  acceptedcpr != null}
                          {foreach acceptedcust in acceptedcpr.customerAndProductsBean}
                            {if acceptedcust.customerIdentifierPrimeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
                              {foreach leg in acceptedcust.acceptanceJourneies[selection_index].legAcceptances}
                                {foreach legIndicator in leg.statuses}
                                  {if legIndicator.indicator == "CAC"}
                                    {if legIndicator.action == "1"}
                                      {set paxCheckedin = true /}
                                      {if !jQuery.isUndefined(acceptedcust.acceptanceJourneies[selection_index].legAcceptances[0]) && !jQuery.isUndefined(acceptedcust.acceptanceJourneies[selection_index].legAcceptances[0].seatNumber)}
                                      {set seat = acceptedcust.acceptanceJourneies[selection_index].legAcceptances[0].seatNumber.seatDetailsSeatNumber /}
                                      {else /}
                                        {set seat = label.NotAdded /}
                                      {/if}

                                      {set custFullName = cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName+" "+cpr.customerLevel[customer].customerDetailsSurname /}
                                      {set custArrTime = cpr.customerLevel[customer].productLevelBean[selection.product].arrDateinGMT /}
                                      {set customerArrDate = cpr.customerLevel[customer].productLevelBean[selection.product].arrDateInGMTDate /}
                                      {set custDepDate = cpr.customerLevel[customer].productLevelBean[selection.product].depDateInGMTDate /}

                                    {set custArrTime="00:00" /}
                                    {set custDepDate = "00:00" /}
                                    {if cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].legTimeBean != null}
                                    {foreach boardingTime inArray cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].legTimeBean}
                                      {if boardingTime.businessSemantic == "BDT"}

                                      {/if}
                                      {if boardingTime.businessSemantic == "STA"}
                                        {var temp_arrtime=boardingTime.hour /}
                                        {var temp_arrmin=boardingTime.minutes /}
                                        {if temp_arrtime<10}
                                        {set temp_arrtime="0"+temp_arrtime /}
                                        {/if}
                                        {if temp_arrmin<10}
                                        {set temp_arrmin="0"+temp_arrmin /}
                                        {/if}
                                        {set custArrTime=temp_arrtime+":"+temp_arrmin /}

                                      {/if}
                                      {if boardingTime.businessSemantic == "STD"}
                                        {var temp_arrtime=boardingTime.hour /}
                                        {var temp_arrmin=boardingTime.minutes /}
                                        {if temp_arrtime<10}
                                        {set temp_arrtime="0"+temp_arrtime /}
                                        {/if}
                                        {if temp_arrmin<10}
                                        {set temp_arrmin="0"+temp_arrmin /}
                                        {/if}
                                        {set custDepDate = temp_arrtime+":"+temp_arrmin /}
                                      {/if}
                                    {/foreach}
                                   {/if}

									  /*Forming required details*/
									  {set customerArrDate = customerArrDate.split(" ")[2]+""+customerArrDate.split(" ")[1]+""+customerArrDate.split(" ")[5].substring(2) /}
									  {set customerArrDate = customerArrDate.toUpperCase() /}


                                      {if selection_index == selectedcpr.length -1}
                                          {set appResponseDetail = appResponseDetail + boardingPassRespDtls.formattedDocumentList[selection_index].encodedData+"|NAME"+custFullName+"|SN"+seat+"|ART"+custArrTime+"|ARD"+customerArrDate+"|DPT"+custDepDate /}
                                      {else/}
                                          {set appResponseDetail = appResponseDetail + boardingPassRespDtls.formattedDocumentList[selection_index].encodedData+"|NAME"+custFullName+"|SN"+seat+"|ART"+custArrTime+"|ARD"+customerArrDate+"|DPT"+custDepDate+"&" /}
                                      {/if}
                                    {/if}
                                  {/if}
                                {/foreach}
                              {/foreach}
                            {/if}
                          {/foreach}
                         {else/}
                          {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
                              {foreach legIndicator in leg.legLevelIndicatorBean}
                                {if legIndicator.indicator == "CAC"}
                                  {if legIndicator.action == "1"}
                                    {set paxCheckedin = true /}
                                    {if !jQuery.isUndefined(cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0]) && !jQuery.isUndefined(cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean)}
                                    {set seat = cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean.seatDetailsSeatNumber /}
                                    {else /}
                                      {set seat = label.NotAdded /}
                                    {/if}
                                    {set custFullName = cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName+ " " +cpr.customerLevel[customer].customerDetailsSurname /}
                                    {set custArrTime = cpr.customerLevel[customer].productLevelBean[selection.product].arrDateinGMT /}
                                    {set customerArrDate = cpr.customerLevel[customer].productLevelBean[selection.product].arrDateInGMTDate /}
                                    {set custDepDate = cpr.customerLevel[customer].productLevelBean[selection.product].depDateInGMTDate /}

                                    {set custArrTime="00:00" /}
                                    {set custDepDate = "00:00" /}
                                    {if cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].legTimeBean != null}
                                    {foreach boardingTime inArray cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].legTimeBean}
                                      {if boardingTime.businessSemantic == "BDT"}

                                      {/if}
                                      {if boardingTime.businessSemantic == "STA"}
                                        {var temp_arrtime=boardingTime.hour /}
                                        {var temp_arrmin=boardingTime.minutes /}
                                        {if temp_arrtime<10}
                                        {set temp_arrtime="0"+temp_arrtime /}
                                        {/if}
                                        {if temp_arrmin<10}
                                        {set temp_arrmin="0"+temp_arrmin /}
                                        {/if}
                                        {set custArrTime=temp_arrtime+":"+temp_arrmin /}

                                      {/if}
                                      {if boardingTime.businessSemantic == "STD"}
                                        {var temp_arrtime=boardingTime.hour /}
                                        {var temp_arrmin=boardingTime.minutes /}
                                        {if temp_arrtime<10}
                                        {set temp_arrtime="0"+temp_arrtime /}
                                        {/if}
                                        {if temp_arrmin<10}
                                        {set temp_arrmin="0"+temp_arrmin /}
                                        {/if}
                                        {set custDepDate = temp_arrtime+":"+temp_arrmin /}
                                      {/if}
                                    {/foreach}
                                   {/if}

									/*Forming required details*/
									  {set customerArrDate = customerArrDate.split(" ")[2]+""+customerArrDate.split(" ")[1]+""+customerArrDate.split(" ")[5].substring(2).toUpperCase() /}
									  {set customerArrDate = customerArrDate.toUpperCase() /}

                                    {if moduleCtrl.getEmbeded()}
                                      {if selection_index == selectedcpr.length -1}
                                          {set appResponseDetail = appResponseDetail + boardingPassRespDtls.formattedDocumentList[selection_index].encodedData+"|NAME"+custFullName+"|SN"+seat+"|ART"+custArrTime+"|ARD"+customerArrDate+"|DPT"+custDepDate /}
                                      {else/}
                                          {set appResponseDetail = appResponseDetail + boardingPassRespDtls.formattedDocumentList[selection_index].encodedData+"|NAME"+custFullName+"|SN"+seat+"|ART"+custArrTime+"|ARD"+customerArrDate+"|DPT"+custDepDate+"&" /}
                                      {/if}
                                    {/if}
                                  {/if}
                                {/if}
                              {/foreach}
                          {/foreach}
                         {/if}
                          {if cpr.customerLevel[customer].productLevelBean[selection.product].candidateETicketsBean != null}
                            {set eTicketforBP = true /}
                          {/if}
                  {if paxCheckedin}
                    {if cpr.customerLevel[customer].productLevelBean[selection.product].ssrEligible}
                     {if cpr.customerLevel[customer].productLevelBean[selection.product].bpEligible}
                     {var bording_time=0 /}
                     {var STD_time=0 /}
                     {var arrival_time = 0/}
                     {var arrivalTime = 0/}
                     {if cpr.customerLevel[customer].productLevelBean[0].legLevelBean[0].legTimeBean != null}
                      {foreach boardingTime inArray cpr.customerLevel[customer].productLevelBean[0].legLevelBean[0].legTimeBean}
                        {if boardingTime.businessSemantic == "BDT"}
                          {set bording_time=boardingTime.json /}
                          {set boardTime = eval(boardingTime.json) /}
                        {/if}
                        {if boardingTime.businessSemantic == "STA"}
                          {set arrival_time=boardingTime.json /}
                          {set arrivalTime = eval(boardingTime.json) /}
                        {/if}
                        {if boardingTime.businessSemantic == "STD"}
                          {set STD_time=eval(boardingTime.json) /}
                        {/if}
                      {/foreach}
                     {/if}
                     {set bording_time=bording_time+"~"+STD_time /}



                    //FOR GATE NUMBER
                    {var gateNumber=label.GateDefaultText /}
                    {if cpr.customerLevel[customer_index].productLevelBean[0].departureGate != null}
                          {set gateNumber=cpr.customerLevel[customer].productLevelBean[0].departureGate.facilityDetails.identifier /}
                    {/if}

                      {set bpcnt = 0/}
                     {foreach productIden in cpr.customerLevel[customer_index].productLevelBean[selection.product].productIdentifiersBean}
                            {if productIden.referenceQualifier == "DID" }
                              {set pid = productIden.primeId /}
                            {/if}
                      {/foreach}
                    {foreach pidvalue in boardingPassDet.pid}
                     {if pid == pidvalue}
                      <div style="display:none"  class="cabin economy">
                       <img src="data:image/png;base64,${boardingPassDet.boardingPassBase64[bpcnt]}" alt="${label.Title} alt="QR Boarding Pass">
                       <p class="flight-number"><strong>${productView[selection.product].operatingFlightDetailsMarketingCarrier}${productView[selection.product].operatingFlightDetailsFlightNumber}</strong></p>
                       <p class="data">${cpr.customerLevel[customer].productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]}</p>
                       <p class="seat">${seat}</p>
                      </div>
                         {set bpcnt = bpcnt + 1/}
                     {/if}
                    {/foreach}

                    <div  style="display:none"  class="trip">
                        <p class="name"><span class="label">Name:</span> <span class="data">${custFullName}</span></p>
                        <p class="tier"><!--<span class="label"></span> <span class="data clientElement">Solitaire PPS</span> <span class="data baselineText">MyFly Privilege</span>--></p>
                        <p class="location"> <span class="city">${productView[selection.product].operatingFlightDetailsBoardPointInfo.city}</span> <abbr class="city">(${productView[selection.product].operatingFlightDetailsBoardPoint})</abbr><span class="dash"> -</span> <span class="city">${productView[selection.product].operatingFlightDetailsOffPointInfo.city}</span> <abbr class="city">(${productView[selection.product].operatingFlightDetailsOffPoint})</abbr> </p>
                        <p class="board-time">
                          <span class="label">${label.Boarding}</span>
                          <time datetime="${boardTime|dateformat:"HH:mm"}" class="date">${boardTime|dateformat:"dd-MMM-yyyy"}</time>
                          <time class="hour" datetime="${boardTime|dateformat:"HH:mm"}">${boardTime|dateformat:"HH:mm"}</time>
                        </p>
                        <p class="depart-time">
                          <span class="label">${label.Departure}</span>
                          <time datetime="${STD_time|dateformat:"HH:mm"}" class="date">${STD_time|dateformat:"dd-MMM-yyyy"}</time>
                          <time class="hour" datetime="${STD_time|dateformat:"HH:mm"}">${STD_time|dateformat:"HH:mm"}</time>
                        </p>
                        <p class="gate"> <span class="label">${label.Gatenumber}${gateNumber}</span> </p>
                        {if gateNumber.length < 4}
                        <p class="terminal"><span class="label">${label.Terminal}</span> <span class="data">${gateNumber}</span></p>
                        {/if}
                   </div>
                    <div style="display:none" class="padall alignCen" data-offlinestore="PNR_${cpr.customerLevel[0].recordLocatorBean.controlNumber}_${selection.product}_${customer}_${productView[selection.product].operatingFlightDetailsMarketingCarrier}${productView[selection.product].operatingFlightDetailsFlightNumber}_${productView[selection.product].operatingFlightDetailsBoardPointInfo.city}_${productView[selection.product].operatingFlightDetailsOffPointInfo.city}_{call common.dateMacro(productView[selection.product].legLevelBean,productView[selection.product].operatingFlightDetailsBoardPoint,productView[selection.product].operatingFlightDetailsOffPoint,pattern) /} {call common.timeMacro(productView[selection.product].legLevelBean,productView[selection.product].operatingFlightDetailsBoardPoint,productView[selection.product].operatingFlightDetailsOffPoint,pattern) /}_${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}_${productView[selection.product].arrDateinGMT}_${cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId}_${bording_time}_${gateNumber}">
                         <img src="data:image/png;base64,${boardingPassDet.boardingPassBase64[customer_index]}" alt="${label.Title}" width="280px" height="280px" />
                      </div>

                        <div style="display:none"  class="slide displayNone homeScreenDisplay" id="${bpGeneratedResp[selection.product]}-home">/*start of home to for homepage display of boarding pass */
                            <ul class="padall posR colorWhite">
                              <li>${label.BoardingPassFor} ${productView[selection.product].operatingFlightDetailsMarketingCarrier}${productView[selection.product].operatingFlightDetailsFlightNumber}</li>
                              <li class="textextraBig1">${productView[selection.product].operatingFlightDetailsBoardPointInfo.airport} - ${productView[selection.product].operatingFlightDetailsOffPointInfo.airport}</li>
                              <li class="textBig">${STD_time|dateformat:"dd-MMM-yyyy"} ${STD_time|dateformat:"HH:mm"} - ${arrivalTime|dateformat:"HH:mm"}</li>
                               <span id="departureDate" style="display: none" >${STD_time|dateformat:"dd-MMM-yyyy"}</span>
                              <li class="textBig">${custFullName}</li>
                              <li><a href="#" onclick="displayBPHome('${bpGeneratedResp[selection.product]}')">
                                     <div class="boardingIcon">${label.BrdgPass}</div>
                                  </a>
                             </li>
                            </ul>
                    </div>/* end of home */
                      /*start of small */
                          <div  class="displayNone" id="${bpGeneratedResp[selection.product]}-small">
                            <div class="shadow bradius">
                              <p class="posR boundsTitle">${productView[selection.product].operatingFlightDetailsBoardPointInfo.city} - ${productView[selection.product].operatingFlightDetailsOffPointInfo.city} <span class="cross crosswhite" id="calendarClose" onclick="removePNR('${bpGeneratedResp[selection.product]}')">&nbsp;</span></p>
                              <div class="panelWrapper1 boundRecap">
                                <div class="panelWrapperInner">
                                  <div class="padall">
                                    <ul class="width70 posR">
                                     <li> <span class="strong">${productView[selection.product].operatingFlightDetailsMarketingCarrier}${productView[selection.product].operatingFlightDetailsFlightNumber}</span></li>
                                      <li class="cityPair strong">${productView[selection.product].operatingFlightDetailsBoardPointInfo.airport} - ${productView[selection.product].operatingFlightDetailsOffPointInfo.airport}</li>
                                      <li class="strong">${STD_time|dateformat:"dd-MMM-yyyy"} ${STD_time|dateformat:"HH:mm"} - ${arrivalTime|dateformat:"HH:mm"}</li>
                                      <li class="strong">${custFullName}</li>
                                      <a id="${bpGeneratedResp[selection.product]}-link" class="textUnderline" onclick="displayBoardingPass('${bpGeneratedResp[selection.product]}')" href="#">
                                        <li class="boardingCookie">${label.BoardingPass}</li>
                                      </a>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                          </div>
                        </div>
                       /*end of small */
                    {/if}
                  {/if}
                 {/if}



          </section>
       </article>
                 {/foreach}
            {/foreach}

                /*
                *moduleCtrl.getEmbeded() -- For differentiating app or wed setting in mcheckin.html
                *operatingSystem For differentiating android or iphone
                */
                 {if moduleCtrl.getEmbeded()}
                        <input type="hidden" id="bpResponse" name="bpResponse" value='${appResponseDetail}' />
                        <input type="hidden" id="bpResponseInHTML" name="bpResponseInHTML" value=${appResponseDetailEncodedHTML} />
                 {/if}

      </section>
    {/if}
    {/if}
   </div><!-- end of first div -->
  {/macro}

  /* macro for arrival time display */
  {macro arrDate(legLevelList,arrival)}
  {if legLevelList !=null && legLevelList.length>0}
    {foreach leg inArray legLevelList}
      {if leg.legRoutingDestination == arrival}
        {foreach legTime inArray leg.legTimeBean}
          {if legTime.businessSemantic == "STA"}
            {var arrivalDate = eval(legTime.json) /}
            ${arrivalDate|dateformat:"dd MM yyyy hh mm"}
          {/if}
        {/foreach}
      {/if}
    {/foreach}
  {/if}
  {/macro}
{/Template}
