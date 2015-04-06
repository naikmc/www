{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.NewSeatMap',
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
    {var bassinetClassHolder="bassinet" /}
  {var totalPaxForHeaderCount=0 /}
  {var flightRouteIndexlower=[] /}
    {var flightRouteIndexupper=[] /}
    {var headerselPaxDtls="" /}
      {var compartmentColumnDetails={"lower":[],"upper":[],"prevLower":[],"prevUpper":[]} /}

  {var configuredAirlines = moduleCtrl.getOperatingAirlinesList()/}

<div id="seatMapCoreErrors" class="showCoreErrorMessage displayNone">
<footer class="buttons">
<button type="button" class="validation cancel" {on tap "onBackClick"/}>${label.backButton}</button>
</footer>
</div>

    <div class='sectionDefaultstyle sectionDefaultstyleSsci sectionDefaultstyleSsciNewSeatmap'>


    <section id="seatMapMainSection">
    /*Displaying SSCI Warnings */
    <div id="pageWiseCommonWarnings"></div>
    <div id="seatErrors"></div>
    <form {on submit "onSaveSeat"/}>

      <div class="sm-mciBasediv">

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
				{set headerselPaxDtls=selPaxDtls /}
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

/*New seatmap header*/
{var tempSeatMapInfo = cpr["customerDetailsBeans"][headerselPaxDtls].seatmap /}
{var seatMapProdDetails=cpr[flightSel.product] /}
{var depCityName =seatMapProdDetails.departureAirport.airportLocation.cityName.toLowerCase() /}
{var depCityCode =seatMapProdDetails.departureAirport.locationCode.toLowerCase() /}
{var arrCityName =seatMapProdDetails.arrivalAirport.airportLocation.cityName.toLowerCase() /}
{var arrCityCode =seatMapProdDetails.arrivalAirport.locationCode.toLowerCase() /}

<header class="stmpHeader clearfixForFloats">
<hgroup class="current">
	<h1>${depCityName} (${depCityCode.toUpperCase()}) ${label.to} <wbr>${arrCityName} (${arrCityCode.toUpperCase()})</h1>
	<h2>${seatMapProdDetails.operatingAirline.companyName.companyIDAttributes.code}${seatMapProdDetails.operatingAirline.flightNumber}: ${label.operatedby} ${seatMapProdDetails.operatingAirline.companyName.companyIDAttributes.companyShortName}
	</h2>
	<h3>${label.Aircraft} {if tempSeatMapInfo[0].equipmentInformation && tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeDesc} {/if}{if tempSeatMapInfo[0].equipmentInformation}${tempSeatMapInfo[0].equipmentInformation.iataAircraftTypeCode}{/if}</h3>
	</hgroup>
	{if parameters.SITE_MC_SM_FILTER && parameters.SITE_MC_SM_FILTER.search(/true/i) != -1}
		<nav {on tap {fn:"showHideFilters",args:{"flag":"1"}} /} class="genericSeatIcon seatmapFilterIcon icon-filter-sign"><a href="javascript:void(0);"></a></nav>

		/*filters*/
		<aside id="filters" class="seatFilter">
			<header>
			<h1>${label.tx_ssci_seat_gen_so}
			<button type="button" data-control="reset">${label.tx_ssci_seat_gen_ra}</button>
			</h1>
			</header>
			<section id="filters-legend">
			<p id="seatsCount">${label.tx_ssci_seat_char_seat_avail}: <span data-info="seats-available"></span></p>
			<p id="optionsSelected">${label.tx_ssci_seat_char_opt_sel}: <span data-info="options-selected">0</span></p>
			<ul class="list-view" id="seatOptions">
			</ul>
			</section>
			<footer class="seatFilter-footer"><span {on tap {fn:"showHideFilters",args:{"flag":"0"}} /} class="close"></span></footer>
		</aside>
	{/if}
	<nav {on tap {fn:"showHideLegends",args:{"flag":"1"}} /} class="genericSeatIcon seatmapHelpIcon icon-question-sign"><a href="javascript:void(0);"></a></nav>

	/*Legends*/
	<aside id="help" class="seatLegend">
	<header>
	<h1>${label.tx_ssci_seat_type_lg}</h1>
	</header>
	<section id="seat-legend">
	<ul></ul>
	</section>
	<footer class="seatLegend-footer"><span {on tap {fn:"showHideLegends",args:{"flag":"0"}} /} class="close"></span></footer>
	</aside>

</header>
/*End new seatmap header*/

//Seat map start
{set totalPaxCount=-1 /}
<div id="mcistmp_wrapper">
	<ol id="mcistmp_scroller">

{foreach selPaxDtls in flightSel.customer} //-- pax loop start
{set compartmentColumnDetails={"lower":[],"upper":[],"prevLower":[],"prevUpper":[]} /}
{var customer = cpr[selPaxDtls] /}

	/*
     * will consider boarding pass printed and SITE_SSCI_DSBL_CST_BP_GEN to decide weather to load
	 * seat for particlur pax or not
	 */
	{if customer.passengerTypeCode != "INF" && ((this.decideShowSeatToPax||(cpr["productDetailsBeans"][selPaxDtls+flightSel.product]["boardingPassPrinted"] == false)))}
	{set totalPaxCount=totalPaxCount+1 /}
	<li>
	<span class="sm-flex {if totalPaxCount != 0}displayNone {/if}PaxSelectionScreen {if cpr["productDetailsBeans"][selPaxDtls+flightSel.product]["seatChangeAllowed"] == false }PaxCannotSelectSeat{/if}">

  /* This section displays the seat map according to the request */

              {var seatMap = cpr["customerDetailsBeans"][selPaxDtls].seatmap /}

              /*************Changed compartmentDetailsCabinClassLocation to M(Lower deck) if all U(Upperdeck) are come so that it render fine*****************/
              {var belowLPOutput =0 /}
              {foreach compartmentLoop inArray seatMap[0].compartments}
                {if compartmentLoop.compartmentDetailsCabinClassLocation == "M"}
                  {set belowLPOutput =1 /}
                {/if}
              {/foreach}

              {if belowLPOutput == 0}
                {foreach compartmentLoop inArray seatMap[0].compartments}
                  {if seatMap[0].compartments[compartmentLoop_index].compartmentDetailsCabinClassLocation="M" }{/if}
                {/foreach}
              {/if}


             /**********************END******************************/

        {var seatRowRange = 0 /}
              {var newSeatRowRange = 0 /}
              {var seatMapInfo = seatMap /}
              {var seatMapCompartments = seatMapInfo[0].compartments /}

               <!-- <div class="msk" style="display: none;"></div>-->
          {foreach compartment inArray seatMapCompartments}
           {if compartment.compartmentDetailsCabinClassLocation == "U"}
	        <p class="sm-decksLink">
				<a href="javascript:void(0);" name="lowerdeckheader" class="active" {on click "onViewLowerDeck" /}>${label.Lowerdeck}</a>&nbsp;|&nbsp;
				<a href="javascript:void(0);" name="upperdeckheader" {on click "onViewUpperDeck" /}>${label.UpperDeck}</a>
			</p>

       	   {/if}
         {/foreach}

      {foreach compartment inArray  seatMapCompartments} //--Comp start
             {var compartmentRows = getIntValue(compartment.compartmentDetailsSeatRowNumbers[0]) /}
             {set newseatRowRange =  seatRowRange + compartmentRows/}

		{if compartment.compartmentDetailsCabinClassLocation != "U" }
			 {foreach columnDetail inArray  compartment.columnDetails}
				  {if columnDetail.seatColumn == columnDetail_index}
						{if flightRouteIndexlower.push(columnDetail_index)}{/if}
				  {/if}
				  {if compartmentColumnDetails.lower.push(columnDetail.seatColumn)}{/if}
			 {/foreach}

			/*
			 For showing column details only to required compartments(i.e to deck) -- LOWER DECK
			 */
			 {if compartmentColumnDetails.lower.toString() != compartmentColumnDetails.prevLower.toString()}
				<div name="lowerdeck">
					<div class="sm-row">
						{foreach seatColumn inArray compartmentColumnDetails.lower}
							{if seatColumn == seatColumn_index}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
							{else/}
								<div><div>${seatColumn}</div></div>
							{/if}
						{/foreach}
					</div>
				</div>
		     {/if}
		{/if}

		{if compartment.compartmentDetailsCabinClassLocation == "U"}
			 {foreach columnDetail inArray  compartment.columnDetails}
				  {if columnDetail.seatColumn == columnDetail_index}
						{if flightRouteIndexupper.push(columnDetail_index)}{/if}
				  {/if}
				  {if compartmentColumnDetails.upper.push(columnDetail.seatColumn)}{/if}
			 {/foreach}

			 /*
			 For showing column details only to required compartments(i.e to deck)
			 */
			 {if compartmentColumnDetails.upper.toString() != compartmentColumnDetails.prevUpper.toString()}
			 	<div name="upperdeck" class="displayNone">
					<div class="sm-row">
						{foreach seatColumn inArray compartmentColumnDetails.upper}
							{if seatColumn == seatColumn_index}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
							{else/}
								<div><div>${seatColumn}</div></div>
							{/if}
						{/foreach}
					</div>
				</div>
		     {/if}

		{/if}

       {var seatnotoccupied = true /}
       /* Based on the seat characteristics the rows are displayed */
                <div {if compartment.compartmentDetailsCabinClassLocation == "U"}name="upperdeck" class="displayNone" {else/} name="lowerdeck" {/if}>
                {foreach rows inArray seatMapInfo[0].rows} //-- Row start
                  {var ExitRowExist=false /}
                  {if rows_index >= seatRowRange && rows_index <  newseatRowRange }
                    <div data-row="{if rows.rowDetailsSeatRowNumber != "0"}${rows.rowDetailsSeatRowNumber}{/if}" class="sm-row{if rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.indexOf("E") != -1} sm-exit-left sm-exit-right{set ExitRowExist=true /}{elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.indexOf("EL") != -1 /} sm-exit-left{set ExitRowExist=true /}{elseif rows.rowCharacteristicDetails && rows.rowCharacteristicDetails.rowCharacteristics.indexOf("ER") != -1 /} sm-exit-right{set ExitRowExist=true /}{/if}">
                        {foreach seatOccupationDetails inArray rows.seatOccupationDetails} //-- occupation start

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

	                          /*Making currently saved seat on land to seatmap F, which come in response as occupied to make sure on browser back and forth show as free seat to select*/
                              {foreach seatCustIDDetails in this.custAssociateInfant}
                              	{if seatCustIDDetails.initseat == (rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn)}{if seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation="F"}{/if}{/if}
							  {/foreach}

                              {var tempSeatoccupationDetailsSeat =seatmaps.rows[rows_index].seatOccupationDetails[seatOccupationDetails_index].seatOccupation /}
                              {if (seatnotoccupied && tempSeatoccupationDetailsSeat && tempSeatoccupationDetailsSeat != "F") || this.custAssociateInfant[selPaxDtls].initseat == (rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn) }
                                {set seatnotoccupied = false /}
                              {/if}
                            {/foreach}
							{if this.forSegregateSeatCharectersticsforLegend(seatOccupationDetails.seatCharacteristics, compartment.columnDetails[seatOccupationDetails_index].seatColumn, seatOccupationDetails.seatColumn, seatOccupationDetails.seatOccupation, seatnotoccupied, ExitRowExist)}{/if}
						  //BASE CONDITION FOR SEATOCCUPATION //-- start Catg0
                          {if seatOccupationDetails_index == 0 || seatOccupationDetails_index == rows.seatOccupationDetails.length-1}

                              //For No seat -- display empty //-- Start Catg1
                            {if seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <div><div class="sm-aisle"></div></div>
                            //For display path in between seats //-- Catg1
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                             <div class="sm-aislePath"><div class="sm-aisle"></div></div>
                            {elseif seatOccupationDetails.seatOccupation == "F" && seatnotoccupied == true /} //-- Catg1
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

                 /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				 <div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat{if bassinetClassHolder =="seatNotAvailable" || bassinetClassHolder == "bassinetFilled"} occupied{/if}">
                                  <span type="button" class="${bassinetClassHolder}"></span>
                 </div></div>
                                {else/}

                /*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				<div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-selectseatinpax="${selPaxDtls}" class="sm-seat {if bassinetClassHolder == "seatAvailable" || bassinetClassHolder == "bassinet"} canselect${totalPaxCount}{else /}occupied{/if}" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" data-seatinfo-price="FREE">
                    {if bassinetClassHolder == "bassinetFilled"}
                    	<span class="${bassinetClassHolder}"></span>
                    {else /}
                    	//<input type="button"  class="${bassinetClassHolder}" />
                        <span class="${bassinetClassHolder}"></span>
                    {/if}

                 </div></div>
                                {/if}

                            {elseif !seatnotoccupied/} //--Catg1
				              {set seatnotoccupied = true /}

							   /*
									goes inside if seat occupied is the selected seat by customer
									-- Start catg2
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
				                <div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-selectseatinpax="${selPaxDtls}" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat is-current {if bassinetClassHolder == "bassinetFilled" || bassinetClassHolder == "seatNotAvailable"}cantBeSelectedHereAfter{/if} canselect${totalPaxCount}">
				                  {if bassinetClassHolder != "bassinetFilled" && bassinetClassHolder != "seatNotAvailable"}
				                  	//<input type="button"  class="${bassinetClassHolder} displayNone" />
				                  	<span class="${bassinetClassHolder}">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {else /}
				                  	<span class="${bassinetClassHolder}_cantSelectSeat">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {/if}

				                </div></div>
				               {else /}//-- catg2
				               	{if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{set bassinetClassHolder="bassinetFilled" /}
               				 	{else /}
									{set bassinetClassHolder="seatNotAvailable" /}
               				 	{/if}
				               	<div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat{if bassinetClassHolder =="seatNotAvailable" || bassinetClassHolder == "bassinetFilled"} occupied{/if}">
				                   <span type="button" class="${bassinetClassHolder}"></span>
				                </div></div>
				               {/if}//-- End catg2



                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}//-- Catg1
                              <div><div class="seat-toilet"></div></div>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-galley"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "CL" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-closet"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "ST" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-stairs"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "SO" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-storage"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "D" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-exit"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="sm-aisle"></div></div>
                              {else/}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                             {else/}//-- Catg1
                             	{if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                             		<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                             	{elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                              		<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              	{else /}
                              		<div><div class="sm-aisle"></div></div>
                                {/if}
                            {/if} //-- end Catg1
                          {else/} //-- Catg0
                            {if seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <div><div class="sm-aisle"></div></div>
                            {elseif seatOccupationDetails.seatCharacteristics == "8" && compartment.columnDetails[seatOccupationDetails_index].seatColumn ==  seatOccupationDetails.seatColumn /}
                              <div class="sm-aislePath"><div class="sm-aisle"></div></div>
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
				<div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat{if bassinetClassHolder =="seatNotAvailable" || bassinetClassHolder == "bassinetFilled"} occupied{/if}">
                                  <span type="button" class="${bassinetClassHolder}"></span>
                 </div></div>
                                {else/}
                //{var handlerName_forselected = MC.appCtrl.registerHandler(this.selectSeat, this , {seatNumber : //"0"+rows.rowDetailsSeatRowNumber+compartment.columnDetails[seatColumnInt].seatColumn} //)/}
				/*PTR 08020485 [Medium]: SQ mob-UAT-R15-MCI - There are no bassinet icon the seat map*/
				<div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-selectseatinpax="${selPaxDtls}" class="sm-seat {if bassinetClassHolder == "seatAvailable" || bassinetClassHolder == "bassinet"} canselect${totalPaxCount}{else /}occupied{/if}" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" data-seatinfo-price="FREE">
                    {if bassinetClassHolder == "bassinetFilled"}
                    	<span class="${bassinetClassHolder}"></span>
                    {else /}
                    	//<input type="button"  class="${bassinetClassHolder}" />
                        <span class="${bassinetClassHolder}"></span>
                    {/if}

                 </div></div>
                                {/if}

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
                               {/if}
				               <div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-selectseatinpax="${selPaxDtls}" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat is-current {if bassinetClassHolder == "bassinetFilled" || bassinetClassHolder == "seatNotAvailable"}cantBeSelectedHereAfter{/if} canselect${totalPaxCount}">
				                  {if bassinetClassHolder != "bassinetFilled" && bassinetClassHolder != "seatNotAvailable"}
				                  	//<input type="button"  class="${bassinetClassHolder} displayNone" />
				                  	<span class="${bassinetClassHolder}">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {else /}
				                  	<span class="${bassinetClassHolder}_cantSelectSeat">${this.custAssociateInfant[selPaxDtls].NumToDispOnSelSeat}</span>
				                  {/if}

				                </div></div>
				               {else /}
				               	{if this.isBasinetSeat(seatOccupationDetails.seatCharacteristics)}
               						{set bassinetClassHolder="bassinetFilled" /}
               				 	{else /}
									{set bassinetClassHolder="seatNotAvailable" /}
               				 	{/if}
				               	<div><div data-input-seatcharctics="${seatOccupationDetails.seatCharacteristics}" data-seatinfo-price="FREE" data-column="${compartment.columnDetails[seatColumnInt].seatColumn}" name="${rows.rowDetailsSeatRowNumber}${compartment.columnDetails[seatColumnInt].seatColumn}" class="sm-seat{if bassinetClassHolder =="seatNotAvailable" || bassinetClassHolder == "bassinetFilled"} occupied{/if}">
				                   <span type="button" class="${bassinetClassHolder}"></span>
				                </div></div>
				               {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "LA" /}
                              <div><div class="seat-toilet"></div></div>
                            {elseif seatOccupationDetails.seatCharacteristics == "GN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <div><div class="sm-aisle"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "CL" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-closet"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "ST" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-stairs"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "SO" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-storage"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "D" /}//-- Catg1
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              	<div><div class="seat-exit"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                            {elseif seatOccupationDetails.seatCharacteristics == "KN" /}
                              {if compartment.columnDetails[seatOccupationDetails_index].seatColumn !=  seatOccupationDetails.seatColumn}
                              <div><div class="sm-aisle"></div></div>
                              {else /}
								<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              {/if}
                              {else/}
                              	{if flightRouteIndexlower.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation != "U"}
                             		<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                             	{elseif flightRouteIndexupper.indexOf(seatOccupationDetails_index)!=-1 && compartment.compartmentDetailsCabinClassLocation == "U" /}
                              		<div class="sm-aislePath"><div class="sm-aisle"></div></div>
                              	{else /}
                              		<div><div class="sm-aisle"></div></div>
                                {/if}
                            {/if}
                          {/if}//-- End Catg0
                        {/foreach} //-- occupation end

                    </div>
                  {/if}
                {/foreach} //-- Row End
              </div>

       	{set seatRowRange = newseatRowRange/}

		{set compartmentColumnDetails.prevLower=compartmentColumnDetails.lower /}
		{set compartmentColumnDetails.prevUpper=compartmentColumnDetails.upper /}
		{set compartmentColumnDetails.lower=[] /}
		{set compartmentColumnDetails.upper=[] /}

		{set flightRouteIndexlower=[] /}
		{set flightRouteIndexupper=[] /}

       {/foreach} //--Comp End

</span>
</li>
{/if}

      {/foreach} //-- pax loop end
</ol>
</div>
      </article>

<nav>
<footer id="stmpFooterId" class="stmpFooter">
<button type="button" {on click "previousPax" /} href="javascript: void(0);">${label.tx_merciapps_label_str_previous}</button>
<button id="seatProceedButton" type="submit">${label.proceed}</button>
<button type="button" {on click "nextPax" /} href="javascript: void(0);">${label.tx_merci_text_tt_next}</button>
</footer>
</nav>



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