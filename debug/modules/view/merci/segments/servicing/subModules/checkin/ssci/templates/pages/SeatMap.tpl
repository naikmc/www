{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.SeatMap',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}

	{var label = this.label /}
	{var labelExitrow = this.label.EmergencyExitPrompt /}
	{var parameters = this.parameters/}
    {var cpr = moduleCtrl.getCPR()[this.data.selectedCPR.journey] /}
    {var selectedcpr = moduleCtrl.getSelectedCPR() /}
    {var selectedProdForSeatMap = this.data.seatMapProdIndex /}
    {var flightSel=selectedcpr.flighttocust[selectedProdForSeatMap] /}
    {var count = 0/}
    {var wingrowCount = 0/}
    {var bassinetClassHolder="bassinet" /}
    {var flightRouteIndexlower=[] /}
    {var flightRouteIndexupper=[] /}
  {var totalPaxForHeaderCount=0 /}

  {var configuredAirlines = moduleCtrl.getOperatingAirlinesList()/}

<div id="seatMapCoreErrors" class="showCoreErrorMessage displayNone">
<footer class="buttons">
<button type="button" class="validation cancel" {on tap "onBackClick"/}>${label.backButton}</button>
</footer>
</div>

    <div class='sectionDefaultstyle sectionDefaultstyleSsci'>


    <section id="seatMapMainSection">
    /*Displaying SSCI Warnings */
    <div id="pageWiseCommonWarnings"></div>
    <div id="seatErrors"></div>
    <form {on submit "onSaveSeat"/}>



      <article class="panel seatmap is-scrollable">

	   {var totalPaxCount=0 /}
	   <div class = 'carrousel-header' id="wrap">

       <a id="leftArrow"  {on click {fn: 'previousPax', scope: this}/}>
0
  		</a>
  		<div id='paxscroller' class="carrousel-content">
              <ol id="mycarousel">

			 {foreach selPaxDtls in flightSel.customer}
              {var customer = cpr[selPaxDtls] /}

			  /*
			  * will consider boarding pass printed and SITE_SSCI_DSBL_CST_BP_GEN to decide weather to load
			  * seat for particlur pax or not
			  */
	          {if customer.passengerTypeCode != "INF" && ((this.decideShowSeatToPax||(cpr["productDetailsBeans"][selPaxDtls+flightSel.product]["boardingPassPrinted"] == false)))}

				{set totalPaxCount+=1 /}
				{var seat = moduleCtrl.getSeatForPax(cpr , flightSel.product , selPaxDtls) /}
				/*IATCI*/
			            {if cpr.productDetailsBeans[selPaxDtls+flightSel.product]["IATCI_Flight"] && this.data.seatMapLoadingFrom != "ac" /* && seat != "Not Added" */ }
			              {if jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[flightSel.product])}
                          	{if this.data.dcsSeatIATCIforProduct[flightSel.product] = {} }{/if}
                          	{if jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtls])}
			                   {if this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtls] = seat}{/if}
			                {/if}
                          {elseif  jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtls])/}
                             {if this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtls] = seat}{/if}
			              {/if}
			            {/if}
			  /*IATCI*/




				/*Forming the this.custAssociateInfant*/
				{if setCustAssociateInfant(selPaxDtls,seat,customer.accompaniedByInfant,totalPaxCount,flightSel.product)}{/if}

                <li data-passenger-id="${selPaxDtls}">
                <span class="pax">${totalPaxCount}</span>

                /*Header name details*/
				{var namePrefix = "" /}
				{if customer && customer.personNames.length > 0 && customer.personNames[0].namePrefixs.length > 0}
					{set namePrefix = customer.personNames[0].namePrefixs[0] /}
				{/if}

				{var givenName = "" /}
				{if customer && customer.personNames.length > 0 && customer.personNames[0].givenNames[0].length > 0}
					{set givenName = customer.personNames[0].givenNames[0] /}
				{/if}

				{var surName = "" /}
				{if customer && customer.personNames.length > 0 && customer.personNames[0].surname}
					{set surName = customer.personNames[0].surname /}
				{/if}


                <span data-accompaniedbyinfant="${customer.accompaniedByInfant}" class="paxName">${jQuery.substitute(label.PassengerName, [namePrefix, givenName, surName])} {if customer.passengerTypeCode == "CHD"}<small>(${label.child})</small>{/if}</span>
                <span class="seatNum">{if seat != "Not Added"}${seat}{else/}${label.NotAdded}{/if}</span>
                </li>
              {/if}
            {/foreach}

           </ol>
           </div>
<a id="rightArrow" {on click {fn: 'nextPax', scope: this}/}>
${totalPaxCount}
  		</a>
       </div>

//Seat map start
{set totalPaxCount=-1 /}
{foreach selPaxDtls in flightSel.customer}
{var customer = cpr[selPaxDtls] /}

	/*
     * will consider boarding pass printed and SITE_SSCI_DSBL_CST_BP_GEN to decide weather to load
	 * seat for particlur pax or not
	 */
	{if customer.passengerTypeCode != "INF" && ((this.decideShowSeatToPax||(cpr["productDetailsBeans"][selPaxDtls+flightSel.product]["boardingPassPrinted"] == false)))}
	{set totalPaxCount=totalPaxCount+1 /}
	<span class="{if totalPaxCount != 0}displayNone {/if}PaxSelectionScreen {if cpr["productDetailsBeans"][selPaxDtls+flightSel.product]["seatChangeAllowed"] == false }PaxCannotSelectSeat{/if}">
    /* For Seatmap to show product level details*/
    {var tempSeatMapInfo = cpr["customerDetailsBeans"][selPaxDtls].seatmap /}

    {var seatMapProdDetails=cpr[flightSel.product] /}

    <div class="m-sliding-banner" style="height: 58px;">

                <div class="seatmapProductDetails">

                    <ul>

                        <li>
                        {var depCityName =seatMapProdDetails.departureAirport.airportLocation.cityName.toLowerCase() /}
                        {var depCityCode =seatMapProdDetails.departureAirport.locationCode.toLowerCase() /}
                        {var arrCityName =seatMapProdDetails.arrivalAirport.airportLocation.cityName.toLowerCase() /}
                        {var arrCityCode =seatMapProdDetails.arrivalAirport.locationCode.toLowerCase() /}
                          <span data-flightinfo="route">${depCityName} <abbr>(${depCityCode})</abbr> - ${arrCityName} <abbr>(${arrCityCode})</abbr></span>
                          <span data-flightinfo="flight">${seatMapProdDetails.operatingAirline.companyName.companyIDAttributes.companyShortName} ${seatMapProdDetails.operatingAirline.companyName.companyIDAttributes.code}${seatMapProdDetails.operatingAirline.flightNumber}</span>
                          <span data-flightinfo="plane">${label.Aircraft} {if tempSeatMapInfo[0].equipmentInformation && tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc} {/if}{if tempSeatMapInfo[0].equipmentInformation}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeCode}{/if}</span>
                        </li>

                  </ul>
                 </div>

    </div>

  /* This section displays the seat map according to the request */

              {var seatMap = cpr["customerDetailsBeans"][selPaxDtls].seatmap /}

              /*************Changed compartmentDetailsCabinClassLocation to M(Lower deck) if all U(Upperdeck) are come so that it render fine*****************/
              {var belowLPOutput =0 /}
              {var mainCompartmentBestIndex=0 /}
              {var tempmainCounterTracker=0 /}
              {var upperCompartmentBestIndex=0 /}
              {var tempupperCounterTracker=0 /}
              {foreach compartmentLoop inArray seatMap[0].compartments}
                {if compartmentLoop.compartmentDetailsCabinClassLocation == "M"}
                  {set belowLPOutput =1 /}
                  {var tempCounter=0 /}
                  {foreach mainItem inArray compartmentLoop.columnDetails}

					/*
					 checking wether it is alphabet or not
					*/
					{if isNaN(parseInt(mainItem.seatColumn)) == true}
						{set tempCounter+=1 /}
					{/if}

				  {/foreach}

				  {if tempmainCounterTracker < tempCounter}
						{set mainCompartmentBestIndex=compartmentLoop_index /}
						{set tempmainCounterTracker=tempCounter /}
				  {/if}

				{else /}

				  {var tempCounter=0 /}
                  {foreach mainItem inArray compartmentLoop.columnDetails}

					/*
					 checking wether it is alphabet or not
					*/
					{if isNaN(parseInt(mainItem.seatColumn)) == true}
						{set tempCounter+=1 /}
					{/if}

				  {/foreach}

				  {if tempupperCounterTracker < tempCounter}
						{set upperCompartmentBestIndex=compartmentLoop_index /}
						{set tempupperCounterTracker=tempCounter /}
				  {/if}

                {/if}
              {/foreach}

              {if belowLPOutput == 0}
                {foreach compartmentLoop inArray seatMap[0].compartments}
                  {if seatMap[0].compartments[compartmentLoop_index].compartmentDetailsCabinClassLocation="M" }{/if}
                {/foreach}
              {/if}
              /*
              	ideally there are only two decks upper and main(lower)
              	in compartment bean - U - upper deck
              	any other is Lower
              	in some cases we have seen indicator M - main(lower) coming twice same can happen for upper also

				in same case where M coming twice column formation looks like below
				for M- A B C D E F G H I J
				    M- A B   D E F G H I

				    for this type of scenarios both in upper and lower deck decided to take which is having majority alphabets means the bigger and replace with
				    all other so that column header looks fine

              */
              {var indexFromWhereConstructColumnHeader=this.getindexFromWhereConstructColumnHeader(seatMap[0].compartments, mainCompartmentBestIndex, upperCompartmentBestIndex) /}


             /**********************END******************************/

        {var seatRowRange = 0 /}
              {var newSeatRowRange = 0 /}
              {var seatMapInfo = seatMap /}
              {var seatMapCompartments = seatMapInfo[0].compartments /}

         /* It displays rows and colums of seats and also exit rows and toilets */
              {foreach rows inArray seatMapInfo[0].rows}
                {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                  {set wingrowCount = wingrowCount+1/}
                {/if}
              {/foreach}

        <div class="scrollable-content" style="overflow: hidden;">

            <div class="scrollableareaBottomspace">

            <div class="seatmap">

          <div class="deck">/*role="tabpanel" aria-hidden="false" aria-labeledby="btnLowerDeck"*/
               <!-- <div class="msk" style="display: none;"></div>-->
          {foreach compartment inArray seatMapCompartments}
           {if compartment.compartmentDetailsCabinClassLocation == "U"}
        <h2 name="lowerdeckheader">
        //{var handlerName = MC.appCtrl.registerHandler(this.onViewUpperDeck, this)/}
        ${label.Lowerdeck} <button {on click "onViewUpperDeck" /} aria-expanded="true" aria-hidden="false" role="tab" class="secondary" type="button"><span>${label.showUpperDeck}</span></button>
        </h2>
        <h2 name="upperdeckheader" class="displayNone">
        //{var handlerName = MC.appCtrl.registerHandler(this.onViewLowerDeck, this)/}
          ${label.UpperDeck} <button {on click "onViewLowerDeck" /} aria-expanded="true" aria-hidden="false" role="tab" class="secondary" type="button"><span>${label.showLowerDeck}</span></button>
        </h2>

       {/if}
         {/foreach}

          <table>

      {foreach compartment inArray  seatMapCompartments}
             {var compartmentRows = getIntValue(compartment.compartmentDetailsSeatRowNumbers[0]) /}
             {set newseatRowRange =  seatRowRange + compartmentRows/}
             {if compartment.compartmentDetailsCabinClassLocation != "U" }
        <tbody name="lowerdeck">
                 <tr>
         <td></td>
         {foreach columnDetail inArray  compartment.columnDetails}

          {if columnDetail.seatColumn == columnDetail_index}
          {if flightRouteIndexlower.push(columnDetail_index)}{/if}
          <td class="aisle"><span class="seatNotAvailable"></span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
          {else/}
          <td>${columnDetail.seatColumn}</td>
          {/if}

         {/foreach}
         </tr>
                </tbody>
       {/if}
             {if compartment.compartmentDetailsCabinClassLocation == "U"}
        <tbody name="upperdeck" class="displayNone">
               <tr>
         <td></td>
         {foreach columnDetail inArray  compartment.columnDetails}

          {if columnDetail.seatColumn == columnDetail_index}
          {if flightRouteIndexupper.push(columnDetail_index)}{/if}
          <td class="aisle"><span class="seatNotAvailable"></span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
          {else/}
          <td>${columnDetail.seatColumn}</td>
        {/if}
         {/foreach}
         </tr>
               </tbody>
             {/if}

       {var seatnotoccupied = true /}
       /* Based on the seat characteristics the rows are displayed */
                <tbody {if compartment.compartmentDetailsCabinClassLocation == "U"}name="upperdeck" class="displayNone" {else/} name="lowerdeck" {/if}>
                {foreach rows inArray seatMapInfo[0].rows}
                  {if rows_index >= seatRowRange && rows_index <  newseatRowRange }
                    <tr>
                        {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.length == 1 && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                          {if count == 0}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {elseif count == wingrowCount-1/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {else/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>
                          {/if}
                        {elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.indexOf("E") != -1 /}
                          <td class="exitrowleft"></td>
                        {elseif rows.rowDetailsSeatRowNumber != "0" /}
                          <td>${rows.rowDetailsSeatRowNumber}</td>
                        {else/}
                          <td></td>
                        {/if}

                        {foreach seatOccupationDetails inArray rows.seatOccupationDetails}

                          {var seatDisable = false /}
                          {var seatColumnInt = getIntValue(seatOccupationDetails.seatColumn,16) /}


                            {foreach seatmaps inArray seatMap}

                              /*
                                BEGIN : IATCI SEAT MAP HANDLING
								              */


                              {if cpr.productDetailsBeans[selPaxDtls+flightSel.product]["IATCI_Flight"] && this.data.seatMapLoadingFrom != "ac"}
									            {var currentRow = seatmaps.rows[rows_index].rowDetailsSeatRowNumber/}
									            {var currentColoumn = compartment.columnDetails[seatOccupationDetails_index].seatColumn /* seatmaps.compartments[compartment_index].columnDetails[seatOccupationDetails.seatColumn].seatColumn*/ /}
	                                {foreach selPaxDtlsIndexValue in this.data.dcsSeatIATCIforProduct[flightSel.product]}
		                                	//IATCI
										              	  {var savedSeat = moduleCtrl.getSeatForPax(cpr , flightSel.product , selPaxDtlsIndexValue_index) /}
											                //IATCI
  		                                {if !jQuery.isUndefined(this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtlsIndexValue_index]) && (this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtlsIndexValue_index] != savedSeat)}
  			                                	{if this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtlsIndexValue_index] != "Not Added"}
  			                                		{var dcsSeat = this.data.dcsSeatIATCIforProduct[flightSel.product][selPaxDtlsIndexValue_index] /}
  			                                		{var dcsSeatRow = dcsSeat.substring(0,dcsSeat.length-1) /}
  			                                		{var dcsSeatColoumn = dcsSeat.substring(dcsSeat.length-1) /}
  			                                		{if  currentRow == dcsSeatRow && currentColoumn == dcsSeatColoumn}
  				                                		{if seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation = "F" }{/if}
  				                                	{/if}
  			                                	{/if}


  				                                {if savedSeat != "Not Added" }
  				                                	{var savedSeatRow = savedSeat.substring(0,seat.length-1) /}
  				                                	{var savedSeatColoumn = savedSeat.substring(seat.length-1) /}

  				                                	{if currentRow == savedSeatRow && currentColoumn == savedSeatColoumn}
  				                                		{if seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation = "O" }{/if}
  				                                	{/if}
  										                    {/if}
									                     {/if}
		                              {/foreach}
	                            {/if}



						                	/*
                                END : IATCI SEAT MAP HANDLING
                              */
                              {var tempSeatoccupationDetailsSeat =seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation /}
                              {if (seatnotoccupied && tempSeatoccupationDetailsSeat && tempSeatoccupationDetailsSeat != "F") || this.custAssociateInfant[selPaxDtls].initseat == (rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn) }
                                {set seatnotoccupied = false /}

                              {/if}
                            {/foreach}
						  //BASE CONDITION FOR SEATOCCUPATION
                          {if seatOccupationDetails_index == 0 || seatOccupationDetails_index == rows.seatOccupationDetails.length-1}
                            //exit row
                            {if rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics[0] == "E"}
                              {if seatOccupationDetails_index == 0}
                                /*<td class="exitrowleft"></td>*/
                              {elseif seatOccupationDetails_index == rows.seatOccupationDetails.length-1/}
                                /*<td class="exitrowright"></td>*/
                              {/if}
                              {/if}
                              //For No seat -- display empty
                            {if seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>/*<td class="aisle">&nbsp;</td>*/
                            //For display path in between seats
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                              <td class="aisle"><span class="seatNotAvailable"></span></td>
                            {elseif seatOccupationDetails.seatOccupation == "F" && seatnotoccupied == true /}
                                {set bassinetClassHolder="seatAvailable" /}
                                {if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
                                  {if parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="bassinetFilled" /}
                                  {else /}
                                    {if this.custAssociateInfant[selPaxDtls].accompaniedByInfant}
                                    	{set bassinetClassHolder="bassinet" /}
                                    {else /}
                                    	{set bassinetClassHolder="bassinetFilled" /}
                                    {/if}

                                  {/if}
                                {elseif this.isExitSeat(seatOccupationDetails.seatCharacteristics)/}
								  {if parameters.SITE_SSCI_EXIT_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="seatNotAvailable" /}
                                  {/if}
                                {elseif this.isChargebleSeat(seatOccupationDetails.seatCharacteristics) /}
								  {if parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="seatNotAvailable" /}
                                  {/if}
                                {/if}


                                {if seatDisable}
//{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
                 /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				 <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" {if bassinetClassHolder =="seatNotAvailable"}class="occupied"{/if}>
                                  <span type="button" class="${bassinetClassHolder}"></span>
                 </td>
                                {else/}
                 //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} //)/}
                /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				<td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-selectseatinpax="${selPaxDtls}" {if bassinetClassHolder == "seatAvailable" || bassinetClassHolder == "bassinet"}class="canselect${totalPaxCount}"{/if} name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" data-seatinfo-price="FREE">
                    {if bassinetClassHolder == "bassinetFilled"}
                    	<span class="${bassinetClassHolder}"></span>
                    {else /}
                    	<input type="button"  class="${bassinetClassHolder}" />
                        <span></span>
                    {/if}

                 </td>
                                {/if}

                            {elseif !seatnotoccupied/}
				              {set seatnotoccupied = true /}

							   /*
									goes inside if seat occupied is the selected seat by customer
							   */
				               {if this.custAssociateInfant[selPaxDtls].initseat == (rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn)}
				                {if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{if this.custAssociateInfant[selPaxDtls].accompaniedByInfant}
                                    	{set bassinetClassHolder="bassinet" /}
                                    {else /}
                                    	{set bassinetClassHolder="bassinetFilled" /}
                                    {/if}

               						{if parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/false/i) != -1}
                                  	  {set bassinetClassHolder="bassinetFilled" /}
                                    {/if}

               				 	{else /}
									{set bassinetClassHolder="seatAvailable" /}


									{if this.isExitSeat(seatOccupationDetails.seatCharacteristics) && parameters.SITE_SSCI_EXIT_SEAT_SEL.search(/false/i) != -1}
                                    	{set bassinetClassHolder="seatNotAvailable" /}
                                  	{/if}
                                  	{if this.isChargebleSeat(seatOccupationDetails.seatCharacteristics) && parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1}
                                    	{set bassinetClassHolder="seatNotAvailable" /}
                                  	{/if}
               				 	{/if}
				                <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-selectseatinpax="${selPaxDtls}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="is-current {if bassinetClassHolder == "bassinetFilled" || bassinetClassHolder == "seatNotAvailable"}cantBeSelectedHereAfter{/if} canselect${totalPaxCount}">
				                  {if bassinetClassHolder != "bassinetFilled" && bassinetClassHolder != "seatNotAvailable"}
				                  	<input type="button"  class="${bassinetClassHolder} displayNone" />
				                  	<span>${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {else /}
				                  	<span class="${bassinetClassHolder}_cantSelectSeat">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {/if}

				                </td>
				               {else /}
				               	{if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{set bassinetClassHolder="bassinetFilled" /}
               				 	{else /}
									{set bassinetClassHolder="seatNotAvailable" /}
               				 	{/if}
				               	<td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" {if bassinetClassHolder =="seatNotAvailable"}class="occupied"{/if}>
				                   <span type="button" class="${bassinetClassHolder}"></span>
				                </td>
				               {/if}



                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}
                              <td class="toilet"></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>
                              {else /}
								<td class="aisle"><span class="seatNotAvailable"></span></td>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>
                             {else/}
								<td class="aisle"><span class="seatNotAvailable"></span></td>
                              {/if}
                             {else/}
                             	{if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                             		<td class="aisle"><span class="seatNotAvailable"></span></td>
                             	{elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                              		<td class="aisle"><span class="seatNotAvailable"></span></td>
                              	{else /}
                              		<td><input type="submit" class="noSeat" value=""></td>
                                {/if}
                            {/if}
                          {else/}
                            {if seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>/*<td class="aisle">&nbsp;</td>*/
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                              <td class="aisle"><span class="seatNotAvailable"></span></td>
                            {elseif seatOccupationDetails.seatOccupation == "F" && seatnotoccupied == true /}
                                {set bassinetClassHolder="seatAvailable" /}
                                {if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
                                  {if parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="bassinetFilled" /}
                                  {else /}
                                    {if this.custAssociateInfant[selPaxDtls].accompaniedByInfant}
                                    	{set bassinetClassHolder="bassinet" /}
                                    {else /}
                                    	{set bassinetClassHolder="bassinetFilled" /}
                                    {/if}

                                  {/if}
                                {elseif this.isExitSeat(seatOccupationDetails.seatCharacteristics)/}
								  {if parameters.SITE_SSCI_EXIT_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="seatNotAvailable" /}
                                  {/if}
                                {elseif this.isChargebleSeat(seatOccupationDetails.seatCharacteristics) /}
								  {if parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1}
                                    {set seatDisable = true /}
                                    {set bassinetClassHolder="seatNotAvailable" /}
                                  {/if}
                                {/if}

                                {if seatDisable}
                                //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber //: //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} )/}
				/*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				<td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" {if bassinetClassHolder =="seatNotAvailable"}class="occupied"{/if}>
                                  <span type="button" class="${bassinetClassHolder}"></span>
                 </td>
                                {else/}
                //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} //)/}
				/*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				<td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-selectseatinpax="${selPaxDtls}" {if bassinetClassHolder == "seatAvailable" || bassinetClassHolder == "bassinet"}class="canselect${totalPaxCount}"{/if} name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" data-seatinfo-price="FREE">
                    {if bassinetClassHolder == "bassinetFilled"}
                    	<span class="${bassinetClassHolder}"></span>
                    {else /}
                    	<input type="button"  class="${bassinetClassHolder}" />
                        <span></span>
                    {/if}

                 </td>
                                {/if}
                              </td>
                            {elseif !seatnotoccupied/}
              				 {set seatnotoccupied = true /}
                              {if this.custAssociateInfant[selPaxDtls].initseat == (rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn)}
				                {if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{if this.custAssociateInfant[selPaxDtls].accompaniedByInfant}
                                    	{set bassinetClassHolder="bassinet" /}
                                    {else /}
                                    	{set bassinetClassHolder="bassinetFilled" /}
                                    {/if}

               						{if parameters.SITE_SSCI_BASNET_SEAT_SEL.search(/false/i) != -1}
                                  	  {set bassinetClassHolder="bassinetFilled" /}
                                  	{/if}
               				 	{else /}
									{set bassinetClassHolder="seatAvailable" /}

									{if this.isExitSeat(seatOccupationDetails.seatCharacteristics) && parameters.SITE_SSCI_EXIT_SEAT_SEL.search(/false/i) != -1}
                                    	{set bassinetClassHolder="seatNotAvailable" /}
                                  	{/if}
                                  	{if this.isChargebleSeat(seatOccupationDetails.seatCharacteristics) && parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1}
                                    	{set bassinetClassHolder="seatNotAvailable" /}
                                  	{/if}
                                  	/*{if parameters.SITE_SSCI_CHRG_SEAT_SEL.search(/false/i) != -1}
                                    	{set bassinetClassHolder="seatNotAvailable" /}
                                  	{/if}
               		*/		 	{/if}
				                <td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-selectseatinpax="${selPaxDtls}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="is-current {if bassinetClassHolder == "bassinetFilled" || bassinetClassHolder == "seatNotAvailable"}cantBeSelectedHereAfter{/if} canselect${totalPaxCount}">
				                  {if bassinetClassHolder != "bassinetFilled" && bassinetClassHolder != "seatNotAvailable"}
				                  	<input type="button"  class="${bassinetClassHolder} displayNone" />
				                  	<span>${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {else /}
				                  	<span class="${bassinetClassHolder}_cantSelectSeat">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {/if}

				                </td>
				               {else /}
				               	{if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{set bassinetClassHolder="bassinetFilled" /}
               				 	{else /}
									{set bassinetClassHolder="seatNotAvailable" /}
               				 	{/if}
				               	<td data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" {if bassinetClassHolder =="seatNotAvailable"}class="occupied"{/if}>
				                   <span type="button" class="${bassinetClassHolder}"></span>
				                </td>
				               {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}
                              <td class="toilet"></td>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>
                              {else /}
								<td class="aisle"><span class="seatNotAvailable"></span></td>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <td><input type="submit" class="noSeat" value=""></td>
                              {else /}
								<td class="aisle"><span class="seatNotAvailable"></span></td>
                              {/if}
                              {else/}
                              {if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                             		<td class="aisle"><span class="seatNotAvailable"></span></td>
                             	{elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                              		<td class="aisle"><span class="seatNotAvailable"></span></td>
                              	{else /}
                              		<td><input type="submit" class="noSeat" value=""></td>
                                {/if}
                            {/if}
                          {/if}
                        {/foreach}

                        {if rows.rowDetailsSeatRowNumber != "0" && rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.length == 1 && rows.rowCharacteristicDetails.rowCharacteristics[0] == "K"}
                          {if count == 0}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {elseif count == wingrowCount-1/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {else/}
                            <td>${rows.rowDetailsSeatRowNumber}</td>{set count = count+1/}
                          {/if}
                        {elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.indexOf("E") != -1 /}
                          <td class="exitrowright"></td>
                        {elseif rows.rowDetailsSeatRowNumber != "0" /}
                          <td>${rows.rowDetailsSeatRowNumber}</td>
                        {else /}
                          <td></td>
                        {/if}

                    </tr>
                  {/if}
                {/foreach}
              </tbody>

       {set seatRowRange = newseatRowRange/}

                {if compartment.compartmentDetailsCabinClassLocation != "U" }
                <tbody name="lowerdeck">
                 <tr>
                      <td></td>
                      {foreach columnDetail inArray compartment.columnDetails}
                        {if columnDetail.seatColumn == columnDetail_index}
		          {if flightRouteIndexlower.push(columnDetail_index)}{/if}
                          <td class="aisle"><span class="seatNotAvailable"></span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
                        {else/}
                          <td>${columnDetail.seatColumn}</td>
                        {/if}
                      {/foreach}
                    </tr>
                  </tbody>
                {/if}
             {if compartment.compartmentDetailsCabinClassLocation == "U"}
                <tbody name="upperdeck" class="displayNone" >
               <tr>
                      <td></td>
                      {foreach columnDetail inArray compartment.columnDetails}
                        {if columnDetail.seatColumn == columnDetail_index}
	          {if flightRouteIndexupper.push(columnDetail_index)}{/if}
	          <td class="aisle"><span class="seatNotAvailable"></span></td>/*<td><input type="submit" class="noSeat" value=""></td>*/
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

{/if}

      {/foreach}

      </article>

<footer class="buttons">
              <button id="seatProceedButton" class="validation" type="submit">${label.proceed}</button>
          <!--<button type="submit" formaction="SEAT_CHARGABLE_MESSAGE2.html" class="validation">SAVE</button>-->
          //{var handlerName = MC.appCtrl.registerHandler(this.onBackClick, this)/}
          <button {on click "onBackClick"/} class="validation cancel" type="button">${label.Back}</button>
         // {var handlerName = MC.appCtrl.registerHandler(this.revertSeat, this)/}
         /* <button {on click "revertSeat"/} class="validation cancel" type="button">${label.revert}</button>*/

        </footer>




      </form>

    </section>

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
    </div>

  {/macro}
{/Template}