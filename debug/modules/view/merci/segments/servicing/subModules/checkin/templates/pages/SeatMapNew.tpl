{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.SeatMapNew',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript : true
}}
  {var legendAllowedPax=[] /}
  {macro main()}

	{var label = moduleCtrl.getModuleData().checkIn.MSeatMapNew_A.labels /}
	{var parameters = moduleCtrl.getModuleData().checkIn.MSeatMapNew_A.parameters/}
    {var cpr = moduleCtrl.getCPR() /}
    /*
    	Use full even if user press back
    */
    {if this.moduleCtrl.getAcceptedValueForSeat() && this.moduleCtrl.getAcceptedValueForSeat().length > 0}
          {if this.moduleCtrl.setSelectedPax(this.moduleCtrl.getAcceptedValueForSeat())}{/if}
    {elseif this.moduleCtrl.getAcceptedCprValidApp() && this.moduleCtrl.getAcceptedCprValidApp().length > 0 /}
          {if this.moduleCtrl.setSelectedPax(this.moduleCtrl.getAcceptedCprValidApp())}{/if}
    {/if}
    /*End of this*/
    {var selectedcpr = moduleCtrl.getSelectedPax() /}
    {var selectedProdForSeatMap = moduleCtrl.getSelectedProductForSeatMap() /}
    {var productView = cpr.customerLevel[0].productLevelBean/}
    {var count = 0/}
    {var wingrowCount = 0/}
    {var bassinetClassHolder="bassinet" /}
    {var flightRouteIndexlower=[] /}
    {var flightRouteIndexupper=[] /}
  {var totalPaxForHeaderCount=0 /}

  {var configuredAirlines = moduleCtrl.getOperatingAirlinesList()/}

    <div class='sectionDefaultstyle'>


    <section id="seatMapMainSection">
    <div id="seatErrors"></div>
    <form {on submit "onSaveSeat"/}>



      <article class="panel seatmap is-scrollable">
    {if productView != null}

          <!--<h1>Test</h1>-->

                <div class = 'carrousel-header' id="wrap">
<a id="leftArrow"  {on click {fn: 'previousPax', scope: this}/}>
0
  		</a>
  		<div id='paxscroller' class="carrousel-content">
              <ol id="mycarousel">

          {foreach selection in  selectedcpr}
           {if selection.product == selectedProdForSeatMap.seatMapProdIndex}
             {var totalCustomers = selection.customer.length/}
             {var oneCustomer = false /}
             {if totalCustomers <= 2}
             {if totalCustomers == 1}
               {set oneCustomer = true /}
             {else/}
               {foreach customer inArray selection.customer}
               {if cpr.customerLevel[customer].customerDetailsType == "IN"}
                {set oneCustomer = true /}
                //{set totalCustomers -= 1/}
               {/if}
               {/foreach}
             {/if}
             {else /}
             {foreach customer inArray selection.customer}
               {if cpr.customerLevel[customer].customerDetailsType == "IN"}
                //{set totalCustomers -= 1/}
               {/if}
               {/foreach}
             {/if}
           {foreach customer inArray selection.customer}
             {if cpr.customerLevel[customer].customerDetailsType != "IN"}
             {set totalPaxForHeaderCount+=1 /}
             {var custId = "" /}
             /*  If any infant is associated to pax, set the needed values */
             {foreach productIdentifier in cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean}
               {if productIdentifier.referenceQualifier == "JID"}
                 {set isInfantToPax = true /}
                 {set infantToPax = customer_index /}
                 {set infantPrimeId = productIdentifier.primeId /}
                 {if legendAllowedPax.push(customer)}{/if}
               {elseif productIdentifier.referenceQualifier == "DID" /}
                 {set custId = productIdentifier.primeId /}
               {/if}
             {/foreach}
             /* If any seat is present, then display it or else display not added*/
             {var seat = moduleCtrl.getSeat(customer , selection.product , custId) /}
             //{var handlerName = MC.appCtrl.registerHandler(this.onPsngrClick, this, {id : customer_index, custId : customer})/}
             <li tc="${totalCustomers}" data-selectedCPR-custIndex="${customer}" class="seatmapPaxDetails" id="paxSeat${customer_index}">
                <span class="pax">${totalPaxForHeaderCount}</span>

               {if !oneCustomer}
                <input type="radio" name="${totalCustomers}" id="${customer_index}" value="${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}" {if customer_index == paxIndex}checked{/if} class="seatmapNumberPax" />
               {else/}
                <input type="radio" name="${totalCustomers}" id="${customer_index}" value="${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}" {if customer_index == paxIndex}checked{/if} class="seatmapNumberPax" />
               {/if}

               <span class="paxName">
               {if cpr.customerLevel[customer].otherPaxDetailsBean[0].title}
               ${jQuery.substitute(label.PassengerName, [cpr.customerLevel[customer].otherPaxDetailsBean[0].title+".",cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName, cpr.customerLevel[customer].customerDetailsSurname])}
               {else /}
               ${jQuery.substitute(label.PassengerName, ["",cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName, cpr.customerLevel[customer].customerDetailsSurname])}
               {/if}
               </span>
               <span class="seatNum" id="seatNb_${customer_index}" name="prod_${cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].referenceQualifier}_${cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId}" data-paxinfo="seatnr">{if seat != "Not Added"}${seat}{else/}${label.NotAdded}{/if}</span>
             </li>
            {else/}
            {/if}
           {/foreach}
          {/if}
        {/foreach}

                </ol>
</div>
<a data-tcForHeader="${totalPaxForHeaderCount}" data-totalPax="${totalCustomers}" id="rightArrow" {on click {fn: 'nextPax', scope: this}/}>
${totalPaxForHeaderCount}
  		</a>
                  </div>


    {/if}

    /* For Seatmap to show product level details*/
    {var tempSeatMap = moduleCtrl.getSeatMapResponse() /}
    {var tempSeatMapInf = [] /}
    {var tempPaxIndex=0 /}
    {if loaded == false}
      {foreach tempSeatMapIndex inArray tempSeatMap}
        {if tempSeatMapIndex.customerIndex == selection.customer[0]}
          {set tempPaxIndex = tempSeatMapIndex_index /}
        {/if}
      {/foreach}
    {/if}
    {set tempSeatMapInf = tempSeatMap[tempPaxIndex].seatMapResp /}
    {var tempSeatMapInfo = tempSeatMapInf.seatmapInformations /}

    {var seatMapProdDetails=cpr.customerLevel[0].productLevelBean[selectedProdForSeatMap.seatMapProdIndex] /}
    {var Airlinelist=configuredAirlines /}
    {var airlineNameCode="" /}
    {var airlineName="" /}
    {foreach airlineNameCode in Airlinelist.split(",")}
              {if airlineNameCode.split(":")[0]== seatMapProdDetails.operatingFlightDetailsMarketingCarrier}
              {set airlineName=airlineNameCode.split(":")[1] /}
              {/if}
     {/foreach}
    <div class="m-sliding-banner" style="height: 58px;">

                <div class="seatmapProductDetails">

                    <ul>

                        <li>
                          <span data-flightinfo="route">${seatMapProdDetails.operatingFlightDetailsBoardPointInfo.city} <abbr>(${seatMapProdDetails.operatingFlightDetailsBoardPoint})</abbr> - ${seatMapProdDetails.operatingFlightDetailsOffPointInfo.city} <abbr>(${seatMapProdDetails.operatingFlightDetailsOffPoint})</abbr></span>
                          <span data-flightinfo="flight">${airlineName} ${seatMapProdDetails.operatingFlightDetailsMarketingCarrier}${seatMapProdDetails.operatingFlightDetailsFlightNumber}</span>
                          <span data-flightinfo="plane">${label.Aircraft} {if tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc} {/if}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeCode}</span>
                        </li>

                  </ul>
                 </div>

    </div>

  /* This section displays the seat map according to the request */
            <span id="SeatMapSection">
  
    

              {var seatMap = moduleCtrl.getSeatMapResponse() /}
              {var seatMapInf = [] /}
                {if loaded == false}
                  {foreach seatMapIndex inArray seatMap}
                    {if seatMapIndex.customerIndex == selection.customer[0]}
                      {set paxIndex = seatMapIndex_index /}
                    {/if}
                  {/foreach}
                {/if}
                {set seatMapInf = seatMap[paxIndex].seatMapResp /}

              /*************Changed compartmentDetailsCabinClassLocation to M(Lower deck) if all U(Upperdeck) are come so that it render fine*****************/
              {var belowLPOutput =0 /}
              {foreach compartmentLoop inArray seatMapInf.seatmapInformations[0].compartments}
                {if compartmentLoop.compartmentDetailsCabinClassLocation == "M"}
                  {set belowLPOutput =1 /}
                {/if}
              {/foreach}

              {if belowLPOutput == 0}
                {foreach compartmentLoop inArray seatMapInf.seatmapInformations[0].compartments}
                  {if seatMapInf.seatmapInformations[0].compartments[compartmentLoop_index].compartmentDetailsCabinClassLocation="M" }{/if}
                {/foreach}
              {/if}
             /**********************END******************************/

        {var seatRowRange = 0 /}
              {var newSeatRowRange = 0 /}
              {var seatMapInfo = seatMapInf.seatmapInformations /}
              {var seatMapCompartments = seatMapInfo[0].compartments /}

         /* It displays rows and colums of seats and also exit rows and toilets */
              {foreach rows inArray seatMapInfo[0].rows}
                {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                  {set wingrowCount = wingrowCount+1/}
                {/if}
              {/foreach}

        <div id="iScrollWrapper" class="scrollable-content" style="overflow: hidden;">

            <div id="scroller1" class="scrollableareaBottomspace">

            <div class="seatmap">

          <div id="seatmapMainDivOfMap" class="deck">/*role="tabpanel" aria-hidden="false" aria-labeledby="btnLowerDeck"*/
               <!-- <div class="msk" style="display: none;"></div>-->
          {foreach compartment inArray  seatMapCompartments}
           {if compartment.compartmentDetailsCabinClassLocation == "U"}
        <h2 id="upperDeckTitle">
        //{var handlerName = MC.appCtrl.registerHandler(this.onViewUpperDeck, this)/}
        ${label.Lowerdeck} <button {on click "onViewUpperDeck" /} aria-expanded="true" aria-hidden="false" role="tab" id="btnUpperDeck" class="secondary" type="button"><span>${label.showUpperDeck}</span></button>
        </h2>
        <h2 id="lowerDeckTitle" style="display:none">
        //{var handlerName = MC.appCtrl.registerHandler(this.onViewLowerDeck, this)/}
          ${label.UpperDeck} <button {on click "onViewLowerDeck" /} aria-expanded="true" aria-hidden="false" role="tab" id="btnLowerDeck" class="secondary" type="button"><span>${label.showLowerDeck}</span></button>
        </h2>
       {else /}
      /*{if compartment_index == 0}
      <h2>
        Lower deck
      </h2>
      {/if}*/
       {/if}
         {/foreach}

          <table>

      {foreach compartment inArray  seatMapCompartments}
             {var compartmentRows = getIntValue(compartment.compartmentDetailsSeatRowNumbers[0]) /}
             {set newseatRowRange =  seatRowRange + compartmentRows/}
             {if compartment_index == 0 }
        <tbody id="lowerDeckHeader">
                 <tr>
         <td></td>
         {foreach columnDetail inArray  compartment.columnDetails}
          {if compartment_index == 0}
          {if columnDetail.seatColumn == columnDetail_index}
          {if flightRouteIndexlower.push(columnDetail_index)}{/if}
          <td class="aisle"><span class="seatNotAvailable">a</span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
          {else/}
          <td>${columnDetail.seatColumn}</td>
          {/if}
          {/if}
         {/foreach}
         </tr>
                </tbody>
       {/if}
             {if compartment_index > 0 && compartment.compartmentDetailsCabinClassLocation == "U"}
        <tbody id="upperDeckHeader" style="display:none">
               <tr>
         <td></td>
         {foreach columnDetail inArray  compartment.columnDetails}
        {if compartment_index > 0}
          {if columnDetail.seatColumn == columnDetail_index}
          {if flightRouteIndexupper.push(columnDetail_index)}{/if}
          <td class="aisle"><span class="seatNotAvailable">a</span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
          {else/}
          <td>${columnDetail.seatColumn}</td>
          {/if}
        {/if}
         {/foreach}
         </tr>
               </tbody>
             {/if}

       {var seatnotoccupied = true /}
       /* Based on the seat characteristics the rows are displayed */
                <tbody {if compartment.compartmentDetailsCabinClassLocation == "U"}id="upperDeckRows" style="display:none" {else/} id="lowerDeckRows" {/if}>
                {foreach rows inArray seatMapInfo[0].rows}
                  {if rows_index >= seatRowRange && rows_index <  newseatRowRange }
                    <tr>
                        {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                          {if count == 0}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {elseif count == wingrowCount-1/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {else/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {/if}
                        {elseif rows.rowDetailsSeatRowNumber != "0" /}
                          <td>${rows.rowDetailsSeatRowNumber}</td>
                        {elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "E" /}
                          <td></td>
                        {else/}
                          <td></td>
                        {/if}

                        {foreach seatOccupationDetails inArray rows.seatOccupationDetails}

                          {var seatDisable = false /}
                          {var seatColumnInt = getIntValue(seatOccupationDetails.seatColumn,16) /}


                            {foreach seatmaps inArray seatMapInf.seatmapInformations}
                              {var tempSeatoccupationDetailsSeat =seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation /}
                              /* || tempSeatoccupationDetailsSeat == "R" || tempSeatoccupationDetailsSeat == "H" || tempSeatoccupationDetailsSeat == "W"*/
                              {if seatnotoccupied && tempSeatoccupationDetailsSeat && tempSeatoccupationDetailsSeat != "F" }
                                {set seatnotoccupied = false /}

                              {/if}
                            {/foreach}
              //BASE CONDITION FOR SEATOCCUPATION
                          {if seatOccupationDetails_index == 0 || seatOccupationDetails_index == rows.seatOccupationDetails.length-1}
                            //exit row
                            {if rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "E"}
                              {if seatOccupationDetails_index == 0}
                                <td class="exitrowleft"></td>
                              {elseif seatOccupationDetails_index == rows.seatOccupationDetails.length-1/}
                                <td class="exitrowright"></td>
                              {/if}
                              //For No seat -- display empty
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn/}
                              <td><input type="submit" class="noSeat" value=""></td>/*<td class="aisle">&nbsp;</td>*/
                            //For display path in between seats
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                              <td class="aisle"><span class="seatNotAvailable">a</span></td>
                            {elseif seatOccupationDetails.seatOccupation == "F" && seatnotoccupied == true /}
                                {set bassinetClassHolder="seatAvailable" /}
                                {if this.isExitSeat(seatOccupationDetails.seatCharacteristics)}
                                  {if !parameters.SITE_MCI_EXIT_ROW}
                                    {set seatDisable = true /}
                                  {/if}
                                {elseif this.isBasinetSeat(seatOccupationDetails.seatCharacteristics) /}
                                  {if !parameters.SITE_MCI_BASINET_SEAT}
                                    {set seatDisable = true /}
                                  {else /}
                                    {set bassinetClassHolder="bassinet" /}
                                  {/if}
                                {/if}


                                {if seatDisable}
//{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
                 /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
         <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" class="occupied" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                  <span id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                    type="button"  class="seatNotAvailable"></span>
                 </td>
                                {else/}
                 //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} //)/}
                /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/ 
        <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                  <input name="${seatOccupationDetails.seatCharacteristics}"
                                      id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                      type="button"  class="${bassinetClassHolder}"
                                      //{var handlerName = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
                                      {on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}
                                  />
                                  <span></span>
                 </td>
                                {/if}

                            {elseif !seatnotoccupied/}
              {set seatnotoccupied = true /}
                              //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
                              /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
                <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" class="occupied" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                <span id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                  type="button"  class="seatNotAvailable"></span>
                              </td>
                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}
                              <td class="toilet"></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}
                              <td><input type="submit" class="noSeat" value=""></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}
                              <td><input type="submit" class="noSeat" value=""></td>
                             {else/}
                              {if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                                <td class="aisle"><span class="seatNotAvailable">a</span></td>
                              {elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                                  <td class="aisle"><span class="seatNotAvailable">a</span></td>
                                {else /}
                                  <td><input type="submit" class="noSeat" value=""></td>
                                {/if}
                            {/if}
                          {else/}
                            {if seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>/*<td class="aisle">&nbsp;</td>*/
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                              <td class="aisle"><span class="seatNotAvailable">a</span></td>
                            {elseif seatOccupationDetails.seatOccupation == "F" && seatnotoccupied == true /}
                                {set bassinetClassHolder="seatAvailable" /}
                                {if this.isExitSeat(seatOccupationDetails.seatCharacteristics)}
                                  {if !parameters.SITE_MCI_EXIT_ROW}
                                    {set seatDisable = true /}
                                  {/if}
                                {elseif this.isBasinetSeat(seatOccupationDetails.seatCharacteristics) /}
                                  {if !parameters.SITE_MCI_BASINET_SEAT}
                                    {set seatDisable = true /}
                                  {else /}
                                  {set bassinetClassHolder="bassinet" /}
                                  {/if}
                                {/if}

                                {if seatDisable}
                                //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber //: //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
        /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/                
        <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" class="occupied" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                  <span id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                    type="button"  class="seatNotAvailable"></span>
                </td>
                                {else/}
                //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} //)/}
        /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/                
        <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                  <input name="${seatOccupationDetails.seatCharacteristics}"
                                      id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                      type="button"  class="${bassinetClassHolder}"
                                      {on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}
                                    />
                                    <span></span>
                </td>
                                {/if}
                              </td>
                            {elseif !seatnotoccupied/}
              {set seatnotoccupied = true /}
                              //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
                /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/                              
                <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" class="occupied" data-seatmapsel_onclick={on click { fn:"selectSeat", args: {seatNumber : "0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn}}/}>
                                <span id="0${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}"
                                  type="button"  class="seatNotAvailable"></span>
                              </td>
                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}
                              <td class="toilet"></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}
                              <td><input type="submit" class="noSeat" value=""></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}
                              <td><input type="submit" class="noSeat" value=""></td>
                              {else/}
                              {if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                                <td class="aisle"><span class="seatNotAvailable">a</span></td>
                              {elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                                  <td class="aisle"><span class="seatNotAvailable">a</span></td>
                                {else /}
                                  <td><input type="submit" class="noSeat" value=""></td>
                                {/if}
                            {/if}
                          {/if}
                        {/foreach}

                        {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                          {if count == 0}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {elseif count == wingrowCount-1/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {else/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {/if}
                        {elseif rows.rowDetailsSeatRowNumber != "0" /}
                          <td>${rows.rowDetailsSeatRowNumber}</td>
                        {elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "E" /}
                          <td></td>
                        {else /}
                          <td></td>
                        {/if}

                    </tr>
                  {/if}
                {/foreach}
              </tbody>

       {set seatRowRange = newseatRowRange/}

                {if seatMapCompartments[compartment_index+1] && seatMapCompartments[compartment_index+1].compartmentDetailsCabinClassLocation == "U"}
                <tbody id="lowerDeckFooter">
                    <tr class="seatAlp">
                      <td></td>
                      {foreach columnDetail inArray compartment.columnDetails}
                        {if columnDetail.seatColumn == columnDetail_index}
                          <td class="aisle"><span class="seatNotAvailable">a</span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
                        {else/}
                          <td>${columnDetail.seatColumn}</td>
                        {/if}
                      {/foreach}
                    </tr>
                  </tbody>
                {/if}
                {if compartment && compartment.compartmentDetailsCabinClassLocation == "U"}
                <tbody id="upperDeckFooter" style="display:none" >
                    <tr class="seatAlp">
                      <td></td>
                      {foreach columnDetail inArray compartment.columnDetails}
                        {if columnDetail.seatColumn == columnDetail_index}
                          /*<td><input type="submit" class="noSeat" value=""></td>*/<td class="aisle"><span class="seatNotAvailable">a</span></td>
                        {else/}
                          <td>${columnDetail.seatColumn}</td>
                        {/if}
                      {/foreach}
                    </tr>
                  </tbody>
                {/if}
                {if compartment_index == seatMapCompartments.length-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                  <tbody id="lowerDeckFooter">
                    <tr class="seatAlp">
                      <td></td>
                      {foreach columnDetail inArray  compartment.columnDetails}
                        {if columnDetail.seatColumn == columnDetail_index}
                          /*<td><input type="submit" class="noSeat" value=""></td>*/<td class="aisle"><span class="seatNotAvailable">a</span></td>
                        {else/}
                          <td>${columnDetail.seatColumn}</td>
                        {/if}
                      {/foreach}
                    </tr>
                  </tbody>
                {/if}

       {/foreach}

          </table>
        </div>

          <!-- seat map legend -->

        </div>





            </div>


    </div>
    </span>

      </article>

<footer class="buttons">
              <button class="validation" type="submit">${label.proceed}</button>
          <!--<button type="submit" formaction="SEAT_CHARGABLE_MESSAGE2.html" class="validation">SAVE</button>-->
          //{var handlerName = MC.appCtrl.registerHandler(this.onBackClick, this)/}
          <button {on click "onBackClick"/} class="validation cancel" type="button">${label.Back}</button>
         // {var handlerName = MC.appCtrl.registerHandler(this.revertSeat, this)/}
          <button {on click "revertSeat"/} class="validation cancel" type="button">${label.revert}</button>

        </footer>




      </form>

    </section>
<div class="popupBGmask forMCIDialogbox" style="display: none;">&nbsp;</div>
    </div>

  {/macro}

{/Template}