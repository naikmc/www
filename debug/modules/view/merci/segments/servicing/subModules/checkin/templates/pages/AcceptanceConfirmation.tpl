{Template {
    $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.AcceptanceConfirmation',
    $macrolibs : {
      common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
    },
    $hasScript : true
  }}
  {var noBpIssuesErr = true/}
  {var noBagStatusErr = true/}
  {var paxCheckedin = false /}
  {var inputForSeat = []/}
  {var cancelCheckInStatus = true /}
    {macro main()}

      /*
       * Related to load specific pax in seatmap
       * */
      {if !this.moduleCtrl.getoriginalSelectedCPR()}

        {if this.moduleCtrl.setoriginalSelectedCPR(moduleCtrl.getSelectedPax())}{/if}

      {/if}
      {if this.moduleCtrl.setSelectedPax(this.moduleCtrl.getoriginalSelectedCPR())}{/if}

      {var pageData = this.moduleCtrl.getModuleData().checkIn/}
      {var errorStrings = this.moduleCtrl.getModuleData().checkIn.MAcceptanceConfirmation_A.errorStrings /}
      {var label = this.moduleCtrl.getModuleData().checkIn.MAcceptanceConfirmation_A.labels/}
      {set label.Services=label.Services.toLowerCase() /}
      {var parameters = this.moduleCtrl.getModuleData().checkIn.MAcceptanceConfirmation_A.parameters/}
      {var tripPattern = this.moduleCtrl.getModuleData().checkIn.MAcceptanceConfirmation_A.TripPattern/}
      {var bannerInfo = pageData.MAcceptanceConfirmation_A.bannerHtml /}

      {var cpr = this.moduleCtrl.getCPR() /}
      {var passengerDetailsForPrefil = this.moduleCtrl.getPassengerDetails() /}
      {var flow = this.moduleCtrl.getFlowType() /}
      {var acceptedcpr = null /}
      {if this.moduleCtrl.getAcceptedCPR()!= null}
      {set acceptedcpr = this.moduleCtrl.getAcceptedCPR() /}
    {var indicatorView=cpr.customerLevel[0].productLevelBean[0].legLevelBean/}
      {/if}
      {if !(this.moduleCtrl.getAcceptedCprValidApp() && this.moduleCtrl.getAcceptedCprValidApp().length > 0)}
      {var selectedcpr = this.moduleCtrl.getSelectedPax() /}
      {else /}
      {var selectedcpr = this.moduleCtrl.getAcceptedCprValidApp() /}
      {/if}
      {var productView = cpr.customerLevel[0].productLevelBean/}
      {var seat = label.NotAdded /}
      {var warnings = this.moduleCtrl.getWarnings() /}
    {var success = moduleCtrl.getSuccess() /}

    {var appFlag = this.moduleCtrl.getValidApp()/}

	/*
	Resetting all tpl globla veriables
	help in tpl refresh
	*/
 	{set noBpIssuesErr = true/}
    {set noBagStatusErr = true/}
    {set paxCheckedin = false /}
    {set inputForSeat = []/}
    {set cancelCheckInStatus = true /}


  <div class='sectionDefaultstyle sectionAcceptanceConfirmationClass'>

  <section> /** start of the new section 1 **/

   {if productView != null} /** start of the top level if loop  (a)**/
            /* This div is used to display errors if any occurs */
       <div id="initiateandEditErrors"></div>
       /* This div is used to display warnings if any occurs */
        <div id="AcceptanceOverviewWarnings">
          {if warnings != null}
            {@html:Template {
              "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
              data : {
                "messages" : warnings,
                "type" : "warning" }
          }/}
        {/if}
        {if success != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
            data : {
              "messages" : success,
              "type" : "success" }
          }/}
    {/if}
        {if appFlag == false}

        {if this.moduleCtrl.getBlackListOverBooked()}
        	{var apperrorID=25000128 /}
        {else /}
        	{var apperrorID=25000126 /}
        {/if}
            {@html:Template {
              "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
              data : {
                "messages" : [{"localizedMessage":errorStrings[apperrorID].localizedMessage,"code":"25000126"}],
                "type" : "error" }
            }/}
          {/if}
        </div>
    <form> /** start of form 1 -1 **/


    {var issueBp = false /}
    {var eTicket = false /}
    {var ssrEligible = false /}
    /* setting values for all issue BP and eticket */
                {foreach selection in  selectedcpr}
                  {foreach customer inArray selection.customer}
                    {if cpr.customerLevel[customer].customerDetailsType != "IN"}
                            {if  acceptedcpr != null}
                                  {foreach acceptedcust in acceptedcpr.customerAndProductsBean}
                                    {if acceptedcust.customerIdentifierPrimeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
                                      {foreach leg in acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances}
                                        {foreach legIndicator in leg.statuses}
                                          {if legIndicator.indicator == "CAC"}
                                            {if legIndicator.action == "1"}
                                              /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                              {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].validApp == true}
                                              {set issueBp = true /}
	                                              {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0] && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber!=""}
	                                              	{set seat = acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber /}
	                                              {else /}
	                                              	{set seat = label.NotAdded /}
	                                              {/if}
                                              {/if}
                                            {/if}
                                          {/if}
                                          {if legIndicator.indicator == "CST"}
                                            {if legIndicator.action == "1"}
                                              {set paxCST = true /}
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
                                            /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                            {set issueBp = true /}
                                            {if cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean}
                                              {set seat = cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean.seatDetailsSeatNumber /}
                                            {else /}
                                              {set seat = label.NotAdded /}
                                            {/if}
                                          {/if}
                                        {/if}
                                        {if legIndicator.indicator == "CST"}
                                          {if legIndicator.action == "1"}
                                            {set paxCST = true /}
                                          {/if}
                                        {/if}
                                      {/foreach}
                                   {/foreach}
                            {/if}
                            /* If customer has e-ticket eligibility, set eTicket to true */
                                    {if cpr.customerLevel[customer].productLevelBean[selection.product].candidateETicketsBean != null}
                                      {set eTicket = true /}
                                    {/if}
                                /* Check if customer is eligible for ssr */
                                    {if cpr.customerLevel[customer].productLevelBean[selection.product].ssrEligible}
                                      {set ssrEligible = true /}
                                    {/if}
                          {/if}
                         {/foreach}
                        {/foreach}


        /* end of setting values */
        <nav class="breadcrumbs">
            <ul>
              <li><span>1</span></li>
              <li><span>2</span></li>
              <li><span>3</span></li>
              <li class="active"><span>4</span><span class="bread"></span></li>
            </ul>
          </nav>

        <div id="conf-sms" class="message validation hidden">
          <p>${label.MobileMsg} <span id="numbers"></span></p>
        </div>

        <div id="conf-email" class="message validation hidden">
          <p><strong>${label.EmailMsg}<span id="emails"></span></strong></p>
        </div>


       /* {if flow != 'manageCheckin'}
       <div id="conf-checkedin" class="message validation">
        <p>${label.youAreNowIn}</p>
        </div>
        {/if}*/


    /* for the email and options for the email etc */


    <article class="panel">
        <header>
          <h1>${label.GetBoardingPass}
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="section6" data-aria-hidden="false"><span>Toggle</span></button>
          </h1>
        </header>
        <section id="section6">
              <!--<div class="message info">
                <p class="baselineText">Passenger Sam Cheung is not elligible for boarding pass. You will receive this boarding pass at the check-in counter in the airport.</p>
              </div>-->
                <ul class="input-elements">
                      <li>
                          <!--<h2>Select flights for boarding pass:</h2>-->
                          <ul class="checkin-list is-selectable">
                            <li class="is-selected">
                              <input type="checkbox" id="flightsAll" name="all" value="all" checked="">
                              <label for="flightsAll">${label.IssueMsg} <strong>${label.allFlights}&nbsp;</strong>${label.inTrip}
                                {foreach selection in  selectedcpr}
                                   {var product = productView[selection.product]/}
                                   ${product.operatingFlightDetailsBoardPoint} -  ${product.operatingFlightDetailsOffPoint}
                                   {if selection_index != (selectedcpr.length-1)}
                                   ,
                                   {/if}
                                {/foreach}
                            </li>
                          </ul>
                          <section class="subsection">
                                  <header>
                                    <h2 class="subheader"> <span>${label.SelectSpec}</span>
                                      <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="flights03, flights04" data-aria-hidden="true"><span>Toggle</span></button>
                                    </h2>
                                  </header>
                                  {var checkinSegmentDetData = "" /}
                                  {var depJson = ""/}
                                  {var arrJson = ""/}
                                  {var departureDate = "" /}
                                  {var departureTime = "" /}
                                  {var arrivalDate = "" /}
                                  {var arrivalTime = "" /}
                                 <div id="flights03" aria-hidden="true" style="display: block;">
                                         <ul class="checkin-list is-selectable" id="flights02">
                                            {foreach selection in  selectedcpr}
                                                   {var product = productView[selection.product]/}
                                                    <!--<h3>${product.operatingFlightDetailsBoardPoint} -  ${product.operatingFlightDetailsOffPoint}</h3>-->
                                                    <li class="is-selected">
                                                    /*
                                                    	removing is24USA check for now,
                                                    	uncomment below comment anytime to enable it
                                                    */
                                                    //{var is24HourcheckForUSARouteFlag=this.is24HourcheckForUSARoute(product) /}
                                                    {var is24HourcheckForUSARouteFlag=undefined /}
                                                    /*
                                                    	remove {var is24HourcheckForUSARouteFlag=undefined /} when u uncomment first line
                                                    */
                                                      <input type="checkbox" id="flightSel0${selection.product}" {if is24HourcheckForUSARouteFlag == false}disabled="disabled"{else /}checked=""{/if}  name="product" value="${selection.product}">
                                                      <label for="flightSel0${selection.product}">
                                                      /*
                                                      removed for new SQ feedback
                                                      ${product.operatingFlightDetailsMarketingCarrier}${product.operatingFlightDetailsFlightNumber} <strong>${product.operatingFlightDetailsBoardPoint} -  ${product.operatingFlightDetailsOffPoint}</strong>
                                                      */
                                                      /*Added for new SQ feedback*/
                                                      <p class="strong">
						                               <time datetime="2013-03-25">{call
						                                            common.dateTimeMacro(
						                                              product.legLevelBean,
						                                              product.operatingFlightDetailsBoardPoint,
						                                              "",
						                                              "STD",
						                                              tripPattern.Date
						                                            )
						                                          /}
						                                           - <span> ${product.operatingFlightDetailsMarketingCarrier} ${product.operatingFlightDetailsFlightNumber}</span>
						                               </time>
						                               </p>
						                               <p>
						                               <time>{call
						                                      common.dateTimeMacro(
						                                        product.legLevelBean,
						                                        product.operatingFlightDetailsBoardPoint,
						                                        "",
						                                        "STD",
						                                        tripPattern.Time
						                                      )
						                                    /}
						                               </time>
						                               <span>${product.operatingFlightDetailsBoardPointInfo.city}</span> <span>,</span> <span>${product.operatingFlightDetailsBoardPointInfo.airport}</span> <span>-</span> <span class="strong"> {call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsBoardPoint, label, "noterm") /}</span>
						                              </p>
						                              <p><time>{call
						                                      common.dateTimeMacro(
						                                        product.legLevelBean,
						                                        "",
						                                        product.operatingFlightDetailsOffPoint,
						                                        "STA",
						                                        tripPattern.Time
						                                      )
						                                    /}
						                                 </time>
						                                 <span>${product.operatingFlightDetailsOffPointInfo.city}</span><span>,</span>  <span>${product.operatingFlightDetailsOffPointInfo.airport}</span> <span>-</span><span class="strong"> {call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsOffPoint, label, "noterm") /}</span>
						                              </p>
						                              <p>${label.Cabin}: <span class="strong">${product.bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} (${product.bookedCabinCodeBean.cabinDetailsBookingClass})</span></p>
											  		  {section {
											            id: "paxCheckedinDetailsOfFlight",
											            macro: {name: 'paxCheckedinDetailsOfFlight', args:[selection_index, selectedcpr, selection, label, tripPattern, cpr, acceptedcpr, flow], scope: this}
											          }/}
													/*End Added for new SQ feedback*/
                                                      </label>
                                                      {section {
											            id: "seatDetailsOfFlightsection",
											            "cssClass" : "seatBtn",
											            macro: {name: 'showSeatDetails', args:[product, selection, cpr, acceptedcpr, selection_index, label], scope: this}
											          }/}
                                                    </li>
                                                    {foreach leg inArray product.legLevelBean}
                                                       {foreach legTime inArray leg.legTimeBean}
                                                          {if leg.legRoutingOrigin == (product.operatingFlightDetailsBoardPoint) && legTime.businessSemantic == "STD"}
                                                            {set depJson = eval(legTime.json) /}
                                                            {set departureDate = this.formatDate(depJson,"EEE dd MMM")/}
                                                          {set departureTime = this.formatDate(depJson,"HH:mm")/}
                                                          {/if}
                                                          {if leg.legRoutingDestination == (product.operatingFlightDetailsOffPoint) && legTime.businessSemantic == "STA"}
                                                            {set arrJson = eval(legTime.json) /}
                                                            {set arrivalDate = this.formatDate(arrJson,"EEE dd MMM")/}
                                                          {set arrivalTime = this.formatDate(arrJson,"HH:mm") /}
                                                          {/if}
                                                       {/foreach}
                                                    {/foreach}
                                               {if selection_index != selectedcpr.length-1}
                                                 {set checkinSegmentDetData = checkinSegmentDetData + product.operatingFlightDetailsBoardPointInfo.city + "|" + product.operatingFlightDetailsOffPointInfo.city + "|" + product.operatingFlightDetailsMarketingCarrier + product.operatingFlightDetailsFlightNumber + "|" + departureDate + " " + departureTime + "|" + product.operatingFlightDetailsBoardPointInfo.airport   + "|" + arrivalDate + " " + arrivalTime + "|" + product.operatingFlightDetailsOffPointInfo.airport + "&" /} /* product.departureDate|dateformat:=.Time|capitalize */
                                               {else/}
                                               {set checkinSegmentDetData = checkinSegmentDetData + product.operatingFlightDetailsBoardPointInfo.city + "|" + product.operatingFlightDetailsOffPointInfo.city + "|" + product.operatingFlightDetailsMarketingCarrier + product.operatingFlightDetailsFlightNumber + "|" + departureDate + " " + departureTime + "|" + product.operatingFlightDetailsBoardPointInfo.airport   + "|" + arrivalDate + " " + arrivalTime + "|" + product.operatingFlightDetailsOffPointInfo.airport /} /* product.departureDate|dateformat:=.Time|capitalize */
                                               {/if}
                                            {/foreach}
                                        </ul>
                                        /*{if this.moduleCtrl.getEmbeded() && operatingSystem != null &&  operatingSystem.android !=null && operatingSystem.android == "Android"}{/if}*/
                                          <input type="hidden" id="checkinSegmentData" value="${checkinSegmentDetData}" />



                                        /* {if this.moduleCtrl.getEmbeded() && operatingSystem != null &&  operatingSystem.iphone !=null && operatingSystem.iphone.indexOf("iPhone") != -1}
                                            {set window.location = "sqmobile"+"://?flow=MCI/checkinSegmentData=" + checkinSegmentDetData /}
                                         {/if} */
                                </div>
                          </section>
                     </li>
                     <li>
                       <div class="message info">
                            <p>${label.bpMsg}</p><!--tx_merci_checkin_conf_bpissuewarning -->
                        </div>

                         <div class="message info" id="adcError" style="display:none">
                            <p>${label.adcMsg}</p>
                         </div>

                        <h2>${label.RecieveVia}</h2>
                        <ul class="getPassbook">
                            <li><a class="secondary email" href="javascript:void(0)"><span aria-hidden="true" class="icon icon-email"></span>${label.Email}</a></li>
                          {if parameters.SITE_MCI_ENBL_BRDNPAS_1PA}

                            /* Chk to display Issue boarding pass button */
                            {if issueBp}

                                     <li><a class="secondary sms" href="javascript:void(0)"><span aria-hidden="true" class="icon icon-sms"></span>${label.Sms}</a></li>
                            {/if}

                            {/if}
                   {var ver = this.findIOSVersion()/}
                   {var versionTrue = false/}
                   {if typeof ver!=="undefined" && ver[0]>=6}
                      {set versionTrue = true/}
                   {/if}
                   /*
                   	removed passbook option from MCI, AS SQ GOING AHED WITH MTT
                   */
                   {if aria.core.Browser != null && aria.core.Browser.isIOS !=null && versionTrue && false}
                     {if productView.length == 1 && cpr.customerLevel.length==1 && false}
                      <li><a class="secondary add-passbook" href="javascript:void(0)"><span aria-hidden="true" class="icon icon-passbook"></span>${label.Passbook}</a></li>
                     {/if}
                    {/if}
                   {if parameters.SITE_MCI_ENBL_BRDNPAS_1PA}

                      /* Chk to display Issue boarding pass button */
                      {if issueBp}
                              <li><a class="secondary app" href="javascript:void(0)" {on click { fn:"onMBPClick" }/}"><span aria-hidden="true" class="icon icon-bp"></span>${label.Boarding}</a></li>
                      {/if}
                      {/if}
                     </ul>
                    </li>
                </ul>
        </section>
    </article>

      /* end of options and all that */


  /* start of showing all the flight information */

              /*{var product = "" /}*/
              {section {
                id: "cancelCheckinCheck",
                macro: {name: 'cancelCheckinCheckDetails', args:[selectedcpr, productView, label, tripPattern, cpr, acceptedcpr, flow], scope: this}
              }/}


      /** End of displaying all the products info **/
        <footer class="buttons">
            <button  /*{var handlerName = MC.appCtrl.registerHandler(this.onChknHome,this)/}
                                                              ${uiResponseEvent}="${handlerName}(event);" */ {on click {fn : "onHomeClick"}/} type="button"  class="validation">${label.exitCheckin}</button>
        </footer>
    </form> /** start of form 1 -1 **/
   {/if} /** end of the top level if loop  (a)**/
  </section> /** end of the new section 1 **/

    <div class="dialog native" id="dialog-passbook">
        <p>${label.passbkMsg}</p>
        <footer class="buttons">
          <button class="validation active" type="button" /*{var handlerName = MC.appCtrl.registerHandler(this.onContinue, this,{iphone : true})/} ${uiResponseEvent}="${handlerName}(event); */{on click {fn : "onContinue",args : {iphone : true}}/}>${label.yes}</button>
          <button class="cancel" type="reset">${label.ntNow}</button>
        </footer>
    </div>
    <div class="popup input-panel" id="emailPopup" style="display: none;">

        <article class="panel email">
          <header>
            <hgroup>
              <h1>${label.EmailBoardingPass}</h1>
            </hgroup>
          </header>
		   <div id="initiateandEditEmailErrors"></div> /* to display any email validation errors */
       /* This div is used to display warnings if any occurs */
        <div id="initiateandEditEmailWarnings">
          {if warnings != null}
            {@html:Template {
              "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
              data : {
                "messages" : warnings,
                "type" : "warning" }
            }/}
          {/if}
        </div>
          {var customerList = []/}
          {var filteredList = []/}
          {var prefilledFalse = []/}
          {var prefillStatusTrue = []/}
          {var prefillDetails = {"customerVal":"","emailId":""}/}

         /* {if acceptedcpr != null}
          {foreach cust in acceptedcpr.customerAndProductsBean}
            {if passengerDetailsForPrefill != null}
                {if passengerDetail.custNumber == cust_index && passengerDetail.email!=""}
                  {set prefillDetails.customerVal = cust_index/}
                  {set prefillDetails.emailId = passengerDetail.email}
            {/if}
          {/foreach}


          {/if} */


          <section>
               <ul class="input-elements">
           {if acceptedcpr != null}

            {var flags = []/}


            {foreach cust in acceptedcpr.customerAndProductsBean}
             {var validAppJourney = true /}
             /*{foreach journey in cust.acceptanceJourneies}
                {set validAppJourney = validAppJourney && journey.validApp /}
              {/foreach}*/
            {if validAppJourney == true}
            {var alreadySet = false /}
             {if passengerDetailsForPrefil}
                {foreach passengerDetail in passengerDetailsForPrefil}
                  {if passengerDetail.uniqueCustomerIdBean.primeId == cust.customerIdentifierPrimeId && passengerDetail.email!=""}
                    {var flag = {"custIndex":"","status":"","emailId":""}/}
                    {set flag.custIndex = cust_index /}
                    {set flag.status = "present" /}
                    {set flag.emailId = passengerDetail.email /}
                    {if flags.push(flag)}
                    {/if}
                    {set alreadySet = true/}
                   {/if}
                 {/foreach}
             {/if}
                 {if !alreadySet}
                      {var flag = {"custIndex":"","status":""}/}
                        {set flag.custIndex = cust_index /}
                        {set flag.status = "absent" /}
                      {if flags.push(flag)}
                      {/if}
                 {/if}
               {/if}
            {/foreach}

          /* start of email input boxes */
            {foreach cust in acceptedcpr.customerAndProductsBean}
              {var validAppJourney = true /}
              /*{foreach journey in cust.acceptanceJourneies}
                {set validAppJourney = validAppJourney && journey.validApp /}
               {/foreach}*/
                   {if validAppJourney == true}
                    <li>
                      {if cust.customerDetailsType != "IN"}
						  {if this.mbpEligibilityProdList.push(cust.customerIdentifierPrimeId)}{/if}
                          <label for="eMailPax${cust_index}">{if cust.otherPaxDetails}{if cust.otherPaxDetails.title}${cust.otherPaxDetails.title} {/if}${cust.otherPaxDetails.givenName} {/if}{if cust.customerDetailsSurname}${cust.customerDetailsSurname}{/if}</label>
                            {if flags.length>0}
                              {if flags[cust_index] && flags[cust_index].email != ""}
                            <input type="email" data-passengerUID="${cust.customerIdentifierPrimeId}" maxlength=70 label = "${label.PmobNum}"  id="eMailPax${cust_index}" name="${cust_index}" value=${flags[cust_index].emailId}>
                              {else/}
                            <input type="email" maxlength=70 data-passengerUID="${cust.customerIdentifierPrimeId}" label = "${label.PmobNum}"  id="eMailPax${cust_index}" name="${cust_index}" value="">
                              {/if}
                            {else/}
                             <input type="email" maxlength=70 data-passengerUID="${cust.customerIdentifierPrimeId}" label = "${label.PmobNum}"  id="eMailPax${cust_index}" name="${cust_index}" value="">
                            {/if}
                        {/if}
                     </li>
                    {/if}
             {/foreach}
          {else/}
            {var productList = []/}
            {var product_index = null/}
            {var custIndex = null /}
            {var paxCheckedInEmail = false/}
            {foreach selection in  selectedcpr}
              {foreach customer inArray selection.customer}
                {if cpr.customerLevel[customer].customerDetailsType != "IN"}
                                      {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
                                        {foreach legIndicator in leg.legLevelIndicatorBean}
                                          {if legIndicator.indicator == "CAC"}
                                            {if legIndicator.action == "1"}
                                              /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                              {set paxCheckedInEmail = true /}
                                            {/if}
                                          {/if}
                                        {/foreach}
                                     {/foreach}
                        {if paxCheckedInEmail == true}
                          {set custIndex = customer/}
                          {if customerList.push(custIndex)}
                          {/if}
                        {/if}
                 {/if}
                {/foreach}
              {/foreach}
              {set customerList = customerList.sort()/}
                  {foreach person inArray customerList}
                        {if customerList[person_index+1] != customerList[person_index]}
                            {if filteredList.push(customerList[person_index])}
                            {/if}
                        {/if}
                   {/foreach}

                  {var flags = []/}

                   {foreach val in filteredList}
                    {var alreadySet = false /}
                   {if passengerDetailsForPrefil}
                    {foreach passengerDetail in passengerDetailsForPrefil}
                      {if passengerDetail.custNumber == val && passengerDetail.email!=""}
                        {var flag = {"custIndex":"","status":"","emailId":""}/}
                        {set flag.custIndex = val /}
                        {set flag.status = "present" /}
                        {set flag.emailId = passengerDetail.email /}
                        {if flags.push(flag)}
                        {/if}
                        {set alreadySet = true/}
                       {/if}
                     {/foreach}
                   {/if}
                        {if !alreadySet}
                          {var flag = {"custIndex":"","status":""}/}
                            {set flag.custIndex = val /}
                            {set flag.status = "absent" /}
                          {if flags.push(flag)}
                          {/if}
                        {/if}
                   {/foreach}

                   {foreach val in filteredList}
                      <li>
                      {if this.mbpEligibilityProdList.push(cpr.customerLevel[val].uniqueCustomerIdBean.primeId)}{/if}
                      <label for="eMailPax${val}">{if cpr.customerLevel[val].otherPaxDetailsBean && cpr.customerLevel[val].otherPaxDetailsBean.length != 0}{if cpr.customerLevel[val].otherPaxDetailsBean[0].title}${cpr.customerLevel[val].otherPaxDetailsBean[0].title} {/if}${cpr.customerLevel[val].otherPaxDetailsBean[0].givenName} {/if}{if cpr.customerLevel[val].customerDetailsSurname}${cpr.customerLevel[val].customerDetailsSurname}{/if}</label>/*E-mail address(es): <small>(sepparate multiple addresses with comma ',')</small>*/
                         {if flags.length>0}
                            {if flags[val_index] && flags[val_index].email != ""}
                            <input type="email" maxlength=70 data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" label = "${label.PmobNum}"  id="eMailPax${val}" name="${val}" value=${flags[val_index].emailId}>
                            {else/}
                            <input type="email" maxlength=70 data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" label = "${label.PmobNum}"  id="eMailPax${val}" name="${val}" value="">
                            {/if}
                         {else/}
                           <input type="email" maxlength=70 data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" label = "${label.PmobNum}"  id="eMailPax${val}" name="${val}" value="">
                         {/if}
                     </li>
                   {/foreach}
            {/if}<!-- end of if for email -->
           </ul>
           </section>
           <footer class="buttons">
              <button type="submit" {on click {fn : "onEmailClick" , args : {customers : filteredList}}/} class="validation">${label.SendBoardingpass}</button>
              <button type="submit" class="validation cancel" formaction="javascript:void(0);">${label.Cancel}</button>
          </footer>
        </article>
    </div>
        <div class="popup input-panel" id="mbpPopup" style="display: none;">

        <article class="panel email">
          <header>
            <hgroup>
              <h1>${label.IssueBoardingPass}</h1>
            </hgroup>
          </header>

          {var customerList = []/}
          {var filteredList = []/}

          <section>
               <ul class="input-elements">
           {if acceptedcpr != null}

          /* start of passenger input boxes */
            {foreach cust in acceptedcpr.customerAndProductsBean}
              {var validAppJourney = true /}
              /*{foreach journey in cust.acceptanceJourneies}
                {set validAppJourney = validAppJourney && journey.validApp /}
               {/foreach}*/
                   {if validAppJourney == true}
                    <li class= "checkin-list">
                      {if cust.customerDetailsType != "IN"}
                           <input type="checkbox" data-passengerUID="${cust.customerIdentifierPrimeId}" class="customerSelectCheckBox" id="custSel${cust_index}" checked="checked" name="customerSel" value="${cust_index}">
                          <label for="custSel${cust_index}">{if cust.otherPaxDetails}{if cust.otherPaxDetails.title}${cust.otherPaxDetails.title} {/if}${cust.otherPaxDetails.givenName} {/if}{if cust.customerDetailsSurname}${cust.customerDetailsSurname}{/if}</label>
                           
                        {/if}
                     </li>
                    {/if}
             {/foreach}
          {else/}
            {var productList = []/}
            {var product_index = null/}
            {var custIndex = null /}
            {var paxCheckedInEmail = false/}
            {foreach selection in  selectedcpr}
              {foreach customer inArray selection.customer}
                {if cpr.customerLevel[customer].customerDetailsType != "IN"}
                                      {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
                                        {foreach legIndicator in leg.legLevelIndicatorBean}
                                          {if legIndicator.indicator == "CAC"}
                                            {if legIndicator.action == "1"}
                                              /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                              {set paxCheckedInEmail = true /}
                                            {/if}
                                          {/if}
                                        {/foreach}
                                     {/foreach}
                        {if paxCheckedInEmail == true}
                          {set custIndex = customer/}
                          {if customerList.push(custIndex)}
                          {/if}
                        {/if}
                 {/if}
                {/foreach}
              {/foreach}
              {set customerList = customerList.sort()/}
                  {foreach person inArray customerList}
                        {if customerList[person_index+1] != customerList[person_index]}
                            {if filteredList.push(customerList[person_index])}
                            {/if}
                        {/if}
                   {/foreach}

                   {foreach val in filteredList}
                      <li class= "checkin-list">
                      <input type="checkbox" class="customerSelectCheckBox" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" id="custSel${val}" checked="checked"  name="customerSel" value="${val}">
                      <label for="custSel${val}">{if cpr.customerLevel[val].otherPaxDetailsBean && cpr.customerLevel[val].otherPaxDetailsBean.length != 0}{if cpr.customerLevel[val].otherPaxDetailsBean[0].title}${cpr.customerLevel[val].otherPaxDetailsBean[0].title} {/if}${cpr.customerLevel[val].otherPaxDetailsBean[0].givenName} {/if}{if cpr.customerLevel[val].customerDetailsSurname}${cpr.customerLevel[val].customerDetailsSurname}{/if}</label>
                     </li>
                   {/foreach}
            {/if}<!-- end of if for email -->
           </ul>
           </section>
           <footer class="buttons">
              <button type="button" id="sendBoardingPassButton" {on click {fn : "onContinue" , args : {iPhone : false}}/} class="validation">${label.GetBoardingPass}</button>
              <button type="button" class="validation cancel" formaction="javascript:void(0);">${label.Cancel}</button>
          </footer>
        </article>
    </div>
    <div class="popup input-panel" id="smsPopup">
        <article class="panel sms">
          <header>
            <hgroup>
              <h1>${label.SMSBoardingPass}</h1>
            </hgroup>
          </header>
		  <div id="initiateandEditSMSErrors"></div> /* to display any email validation errors */
       /* This div is used to display warnings if any occurs */
        <div id="initiateandEditEmailWarnings">
          {if warnings != null}
            {@html:Template {
              "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Messages",
              data : {
                "messages" : warnings,
                "type" : "warning" }
            }/}
          {/if}
        </div>
        {var customerList = []/}
          <section>
          <label>${label.Sendsmsto}</label>
           //<ul class="input-elements">
           {if acceptedcpr != null}
            {var flags = []/}

            {foreach cust in acceptedcpr.customerAndProductsBean}
              {var validAppJourney = true /}
              /*{foreach journey in cust.acceptanceJourneies}
                {set validAppJourney = validAppJourney && journey.validApp /}
               {/foreach}*/
             {if validAppJourney == true}
            {var alreadySet = false /}
             {if passengerDetailsForPrefil}
              {foreach passengerDetail in passengerDetailsForPrefil}
                {if passengerDetail.custNumber == cust_index && passengerDetail.areaCode!="" && passengerDetail.phoneNumberOnly!=""}
                  {var flag = {"custIndex":"","status":"","areaCode":"","mobNum":""}/}
                  {set flag.custIndex = cust_index /}
                  {set flag.status = "present" /}
                  {set flag.areaCode = passengerDetail.areaCode /}
                  {set flag.mobNum = passengerDetail.phoneNumberOnly /}
                  {if flags.push(flag)}
                  {/if}
                  {set alreadySet = true/}
                 {/if}
               {/foreach}
             {/if}
                  {if !alreadySet}
                    {var flag = {"custIndex":"","status":""}/}
                      {set flag.custIndex = cust_index /}
                      {set flag.status = "absent" /}
                    {if flags.push(flag)}
                    {/if}
                  {/if}
                {/if}
            {/foreach}

          {var Priorityareacode="" /}
          {var Priorityphonenumber="" /}
          {foreach cust in acceptedcpr.customerAndProductsBean}
           {var validAppJourney = true /}
            /*{foreach journey in cust.acceptanceJourneies}
              {set validAppJourney = validAppJourney && journey.validApp /}
            {/foreach}*/
           {if validAppJourney == true}

            {set Priorityareacode="" /}
            {set Priorityphonenumber="" /}
            {var actualCustomerIndx = -1 /}
              /**** FOR TAKING PHONE NUMBER ON PRIORITY***********/
              {foreach co in selectedcpr[0].customer}
                {if cust.customerIdentifierPrimeId == cpr.customerLevel[co].uniqueCustomerIdBean.primeId}
                  {set actualCustomerIndx = co /}
                {/if}
              {/foreach}
              //From CPR
              {if actualCustomerIndx != -1 && cpr.customerLevel[actualCustomerIndx].contactNumber && cpr.customerLevel[actualCustomerIndx].contactNumber != ""}
                 {set Priorityphonenumber=cpr.customerLevel[co].contactNumber.substring(3) /}
                 {set Priorityareacode="00"+cpr.customerLevel[co].contactNumber.substring(1,3) /}
              {/if}

              //From banner
              {if bannerInfo}
                {if actualCustomerIndx != -1 && bannerInfo.firstName == cpr.customerLevel[actualCustomerIndx].otherPaxDetailsBean[0].givenName && bannerInfo.lastName == cpr.customerLevel[actualCustomerIndx].customerDetailsSurname}
                  {if bannerInfo.areaCode && bannerInfo.phoneNumber && bannerInfo.areaCode != "" && bannerInfo.phoneNumber != ""}
                   {set Priorityphonenumber=bannerInfo.phoneNumber /}
                   {set Priorityareacode=bannerInfo.areaCode /}
                  {/if}
                {/if}
              {/if}

              //From passenger details
              {if flags.length>0}
                 {if flags[cust_index] && flags[cust_index].areaCode != undefined && flags[cust_index].areaCode != ""}
                    {set Priorityareacode=flags[cust_index].areaCode /}
                 {/if}
                 {if flags[cust_index] && flags[cust_index].mobNum!=undefined && flags[cust_index].mobNum != ""}
                    {set Priorityphonenumber=flags[cust_index].mobNum /}
                 {/if}
              {/if}
              /**** End FOR TAKING PHONE NUMBER ON PRIORITY***********/
              {if cust.customerDetailsType != "IN"}
             /*<ul class="services-pax selectable">
                <li><h4> ${cust.otherPaxDetails.givenName} </h4></li>
                </ul>*/
                <ul class="input-group contact">
                <li class="width_25">
                  <label for="areaCode${cust_index}">{if cust.otherPaxDetails}{if cust.otherPaxDetails.title}${cust.otherPaxDetails.title} {/if}${cust.otherPaxDetails.givenName} {/if}{if cust.customerDetailsSurname}${cust.customerDetailsSurname}{/if}</label>

                      {if Priorityareacode != ""}
                        <input id="areaCode${cust_index}" data-passengerUID="${cust.customerIdentifierPrimeId}" maxlength="4" type="text" placeholder="0033" value="${Priorityareacode}"  autocomplete-enabled='true'>
                      {else/}
                            <input id="areaCode${cust_index}" data-passengerUID="${cust.customerIdentifierPrimeId}" maxlength="4" type="text" placeholder="0033" value="" autocomplete-enabled='true'>
                      {/if}

                </li>
                <li class="width_75">

                    {if Priorityphonenumber != ""}
                      <input id="phoneNumber${cust_index}" data-passengerUID="${cust.customerIdentifierPrimeId}" maxlength="14" type="tel" placeholder="${label.PhoneNumber}" value="${Priorityphonenumber}">
                    {else/}
                           <input id="phoneNumber${cust_index}" data-passengerUID="${cust.customerIdentifierPrimeId}" maxlength="14" type="tel" placeholder="${label.PhoneNumber}" value="">
                    {/if}

                </li>
                </ul>
            {/if}
            {/if}
           {/foreach}
          {else/}
          {var productList = []/}
          {var product_index = null/}
          {var custIndex = null /}
          {var paxCheckedInEmail = false/}
          {var filteredList = []/}
          {foreach selection in  selectedcpr}
            {foreach customer inArray selection.customer}
              {if cpr.customerLevel[customer].customerDetailsType != "IN"}
                                    {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
                                      {foreach legIndicator in leg.legLevelIndicatorBean}
                                        {if legIndicator.indicator == "CAC"}
                                          {if legIndicator.action == "1"}
                                            /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                            {set paxCheckedInEmail = true /}
                                          {/if}
                                        {/if}
                                      {/foreach}
                                   {/foreach}
                      {if paxCheckedInEmail == true}
                        {set custIndex = customer/}
                        {if customerList.push(custIndex)}
                        {/if}
                      {/if}
               {/if}
              {/foreach}
            {/foreach}
             {set customerList = customerList.sort()/}
          {foreach person inArray customerList}
                {if customerList[person_index+1] != customerList[person_index]}
                    {if filteredList.push(customerList[person_index])}
                    {/if}
                {/if}
           {/foreach}

               {if this.moduleCtrl.setFilteredListMBP(filteredList)}
               {/if}

                  {var flags = []/}
                   {foreach val in filteredList}
                    {var alreadySet = false /}

                    {if passengerDetailsForPrefil == null}
                     {foreach pax in cpr.customerLevel}
                     		{var contactNumber =pax.contactNumber /}
                     		{if contactNumber!=null}
			                {var phoneNumber =contactNumber.substring(3) /}
			                {var l_areaCode = "00"+contactNumber.substring(1,3) /}

			            {if pax_index == val }
                        	{var flag = {"custIndex":"","status":"","areaCode":"","mobNum":""}/}
                        {set flag.custIndex = val /}
                        {set flag.status = "present" /}
                        {set flag.areaCode = l_areaCode /}
                        {set flag.mobNum = phoneNumber/}
                        {if flags.push(flag)}
                        {/if}
                        {set alreadySet = true/}
                       {/if}
                       {/if}
                      {/foreach}
                    {/if}

                   {if passengerDetailsForPrefil}
                    {foreach passengerDetail in passengerDetailsForPrefil}
                      {if passengerDetail.custNumber == val && passengerDetail.areaCode!="" && passengerDetail.phoneNumberOnly}
                        {var flag = {"custIndex":"","status":"","areaCode":"","mobNum":""}/}
                        {set flag.custIndex = val /}
                        {set flag.status = "present" /}
                        {set flag.areaCode = passengerDetail.areaCode /}
                        {set flag.mobNum = passengerDetail.phoneNumberOnly/}
                        {if flags.push(flag)}
                        {/if}
                        {set alreadySet = true/}
                       {/if}
                     {/foreach}
                   {/if}
                        {if !alreadySet}
                          {var flag = {"custIndex":"","status":""}/}
                            {set flag.custIndex = val /}
                            {set flag.status = "absent" /}
                          {if flags.push(flag)}
                          {/if}
                        {/if}
                   {/foreach}

                {foreach val in filteredList}
              /*<ul class="services-pax selectable">
              <li>
                <h4> ${cpr.customerLevel[val].otherPaxDetailsBean[0].givenName} </h4></li>
              </ul>*/
                  <ul class="input-group contact">
                  <li class="width_25">
                  <label for="areaCode${val}">{if cpr.customerLevel[val].otherPaxDetailsBean && cpr.customerLevel[val].otherPaxDetailsBean.length != 0}{if cpr.customerLevel[val].otherPaxDetailsBean[0].title}${cpr.customerLevel[val].otherPaxDetailsBean[0].title} {/if}${cpr.customerLevel[val].otherPaxDetailsBean[0].givenName} {/if}{if cpr.customerLevel[val].customerDetailsSurname}${cpr.customerLevel[val].customerDetailsSurname}{/if}</label>
                    {if flags.length>0}
                       {if flags[val_index] && flags[val_index].areaCode != ""}

                         <input type="text"  maxlength="4" id="areaCode${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="0033" value="${flags[val_index].areaCode}" autocomplete-enabled='true'>
                       {else/}
                          <input type="text"  maxlength="4" id="areaCode${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="0033" value="" autocomplete-enabled='true'>
                       {/if}
                    {else/}
                          <input type="text" maxlength="4" id="areaCode${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="0033" value="" autocomplete-enabled='true'>
                    {/if}
                  </li>
                  <li class="width_75">
                      {if flags.length>0}
                         {if flags[val_index] && flags[val_index].mobNum != ""}
                         <input type="tel"  maxlength="14" id="phoneNumber${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="${label.PhoneNumber}" value=${flags[val_index].mobNum}>
                         {else/}
                          <input type="tel" maxlength="14"  id="phoneNumber${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="${label.PhoneNumber}" value="">
                         {/if}
                      {else/}
                          <input type="tel" maxlength="14"  id="phoneNumber${val}" data-passengerUID="${cpr.customerLevel[val].uniqueCustomerIdBean.primeId}" placeholder="${label.PhoneNumber}" value="">
                      {/if}
                  </li>
               </ul>
             {/foreach}
            {/if}<!-- end of if for email -->


           //</ul>
          </section>
          <footer class="buttons">
            <button type="submit"  {on click {fn : "onSMSClick" , args : {customers : filteredList}}/} class="validation">${label.SendBoardingpass}</button>
            <button type="submit" class="validation cancel" formaction="javascript:void(0);">${label.Cancel}</button>
          </footer>
       </article>
    </div>

    <div class="dialog native" id="chargSeatSelConf" style="display: none;"></div>
    <div class="popupBGmask forMCIDialogbox" style="display: none;">&nbsp;</div>
    </div>
   {/macro}

{macro paxCheckedinDetailsOfFlight(selection_index, selectedcpr, selection, label, tripPattern, cpr, acceptedcpr, flow)}

{var custId = "" /}

		  {foreach customer inArray selection.customer}<!-- 1 foreach -->
		  {if cpr.customerLevel[customer].customerDetailsType != "IN"}
			<div {if cpr.customerLevel[customer].customerDetailsType == "A"}class="pax"{else/}class="pax child"{/if}>
				{var custId = "" /}
				{var isInfantToPax = false /}
				{var infantToPax = "" /}
				{var infantPrimeId = "" /}
				{var paxCST = false /}
				{var paxCheckedinflag=false /}
				{foreach productIdentifier in cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean} <!-- 2 for each -->
                  /* If a customer is associated with an infant, set all the values needed */
                  {if productIdentifier.referenceQualifier == "JID"}
                    {set isInfantToPax = true /}
                    {set infantToPax = cpr.customerLevel[customer].uniqueCustomerIdBean.primeId /}
                    {set infantPrimeId = productIdentifier.primeId /}
                  {elseif productIdentifier.referenceQualifier == "DID" /}
                    {set custId = productIdentifier.primeId /}
                  {/if}
				{/foreach}<!-- -2 -->
				{if  acceptedcpr != null}
                        {foreach acceptedcust in acceptedcpr.customerAndProductsBean}
                          {if acceptedcust.customerIdentifierPrimeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
                            {foreach leg in acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances}
                              {foreach legIndicator in leg.statuses}
                                {if legIndicator.indicator == "CAC"}
                                  {if legIndicator.action == "1"}
                                    /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                    {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].validApp == true}
                                     {set paxCheckedinflag = true /}
                                    {/if}


                                    {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0] && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber!=""}
                                      {set seat = acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber /}
                                    {else /}
                                      {set seat = label.NotAdded /}
                                    {/if}
                                  {/if}
                                {/if}
                                {if legIndicator.indicator == "CST"}
                                  {if legIndicator.action == "1"}
                                  {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].validApp==true}
                                    {set paxCST = true /}
                                   {set paxCheckedinflag = true /}
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
                                  /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                  {set paxCheckedinflag = true /}


                                {if cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean}
                                  {set seat = cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean.seatDetailsSeatNumber /}
                                {else /}
                                {set seat = label.NotAdded /}
                                {/if}
                                {/if}
                              {/if}
                              {if legIndicator.indicator == "CST"}
                                {if legIndicator.action == "1"}
                                  {set paxCST = true /}
                                    {set paxCheckedinflag = true /}
                                {/if}
                              {/if}
                            {/foreach}
                         {/foreach}
                    {/if}<!-- end of if -->

                      {var index = customer /}
                      {var customer = cpr.customerLevel[customer] /}
                       {if paxCheckedinflag}

                             {if customer.customerDetailsType == "A"}

                               <h3>
                                    {if customer.otherPaxDetailsBean[0].title}
                                        ${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].title,customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}
                                    {else /}
                                      ${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}
                                    {/if}
									</h3>
                                    /*{if customer.productLevelBean[selection.product].fqtvInfoBean && customer.productLevelBean[selection.product].fqtvInfoBean[0].frequentTravellerDetails}
                                      <ul>
									  <li class="seat">
                                      <span class="label">${label.FFNumber}:</span>
                                      <span class="data"> ${customer.productLevelBean[selection.product].fqtvInfoBean[0].frequentTravellerDetails[0].number}
									  </span>
									  </li>
                                      </ul>
                                    {/if}*/
                               {else /}
                               <h3>${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])} <i class="textSmaller">(${label.child})</i></h3>
                               {/if}
                                     <ul>
									 <li class="seat">
                                       <span class="label">${label.Seat}: </span>
                                       <span class="data">
                                      {set seat = this.moduleCtrl.getSeat(customer_index , selection.product , custId) /}
                                      {if seat == "Not Added"}
                                        ${label.NotAdded}
                                      {else /}
                                        ${seat}
                                      {/if}
                                      </span>
                                        </li>
                                    </ul>

                                 {if isInfantToPax}
                                     {call common.infantMacroForConfpaxCheckedinDetailsOfFlight(cpr.customerLevel , infantToPax , selection.product , paxCheckedinflag , infantPrimeId , paxCheckedinflag , label , true , true) /}
                                 {/if}
                                {/if}
							   </div>
								{/if}
							   {/foreach}


{/macro}
   {macro cancelCheckinCheckDetails(selectedcpr, productView, label, tripPattern, cpr, acceptedcpr, flow)}
      {foreach selection in  selectedcpr}
         {var custListForCancellation =[] /}
         {var product = productView[selection.product] /}
                 <article class="panel">
                   <header>
                        <h1>${jQuery.substitute(label.PanelTitle, [product.operatingFlightDetailsBoardPointInfo.city, product.operatingFlightDetailsOffPointInfo.city])}
                        /*TPsection${selection.product}, TPsection${selection.product}_${selection.product+1},
                        removed from data-aria-controls part of sq feedback
                        */
                        <button data-aria-hidden="false" data-aria-controls="TPsection${selection.product}_${selection.product+2}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button></h1>
                   </header>
                   /*Commented part of sq feedback
                   id="TPsection${selection.product}"
                   */
                       <section aria-hidden="false" style="display:none;"><!-- START OF SECTION INSIDE ARTICLE -->
                         <div class="trip large-display">
                           <p>
                               <time datetime="2013-03-25">{call
                                            common.dateTimeMacro(
                                              product.legLevelBean,
                                              product.operatingFlightDetailsBoardPoint,
                                              "",
                                              "STD",
                                              tripPattern.Date
                                            )
                                          /}
                               </time>
                               <time datetime="07:35">{call
                                      common.dateTimeMacro(
                                        product.legLevelBean,
                                        product.operatingFlightDetailsBoardPoint,
                                        "",
                                        "STD",
                                        tripPattern.Time
                                      )
                                    /}
                               </time>
                               <span>${product.operatingFlightDetailsBoardPointInfo.city}</span> <span>${product.operatingFlightDetailsBoardPointInfo.city}, ${product.operatingFlightDetailsBoardPointInfo.airport} <abbr>(${product.operatingFlightDetailsBoardPoint})</abbr></span> <span style="display:block"><strong>{call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsBoardPoint, label) /}</strong></span>
                           </p>
                           <p>
                                <time datetime="2013-03-25">{call
                                      common.dateTimeMacro(
                                        product.legLevelBean,
                                        "",
                                        product.operatingFlightDetailsOffPoint,
                                        "STA",
                                        tripPattern.Date
                                      )
                                    /}
                                </time>
                                <time datetime="11:55">{call
                                      common.dateTimeMacro(
                                        product.legLevelBean,
                                        "",
                                        product.operatingFlightDetailsOffPoint,
                                        "STA",
                                        tripPattern.Time
                                      )
                                    /}
                                 </time>
                                 <span>${product.operatingFlightDetailsOffPointInfo.city}</span> <span>${product.operatingFlightDetailsOffPointInfo.city}, ${product.operatingFlightDetailsOffPointInfo.airport} <abbr>(${product.operatingFlightDetailsOffPoint})</abbr></span> <span style="display:block"><strong>{call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsOffPoint, label) /}</strong></span>
                            </p>
                          </div>
                          <div class="details">
                                  <ul>
                                    <li class="fare-family"><span class="label">${label.Flight}:</span> <span class="data"><strong>${product.operatingFlightDetailsMarketingCarrier}${product.operatingFlightDetailsFlightNumber}</strong> {if product.legLevelBean.length == 1}(${label.Direct}){else /}(${label.InDirect}){/if}</span></li>
                                    /*<li class="duration"><span class="label">${label.Duration}:</span> <span class="data">{call
                                          common.dateDiff(
                                            product.legLevelBean[0].legTimeBean[0].json,
                                            product.legLevelBean[0].legTimeBean[2].json,
                                            label.DateDiff
                                          )
                                        /}</span></li>*/
                                  </ul>
                          </div>
                       </section><!--END OF SECTION WITHIN ARTICLE -->

								/*Commented part of sq feedback*/
                                /*<section id="TPsection${selection.product}_${selection.product+1}" aria-hidden="false" style="display:block"> <!-- start of section for subheader services -->
                                    <header>
                                        <h2 class="subheader">
                                              <span>${label.Services}</span>
                                              <button data-aria-hidden="false" data-aria-controls="TSservices${selection.product}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
                                        </h2>
                                    </header>
                                    <div aria-hidden="false" id="TSservices${selection.product}">
                                      <!--<p class="services-checked-label">Select services to view or modify:</p>-->
                                            {section {
                                              id: "seatDetails",
                                              macro: {name: 'showSeatDetails', args: [product, selection, cpr, acceptedcpr, selection_index, label], scope: this} 
                                            }/}
                                   </div>
                               </section> <!-- end of section for subheader services-->
							*/
            {if selection_index == selectedcpr.length-1}
               {var enablecheckin = true/}
            {/if}

     <section id="TPsection${selection.product}_${selection.product+2}" aria-hidden="false" style="display:block;">
         <header>
            <h2 class="subheader"> <span>${label.Passengers}</span>
                  <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="customers${selection.product}" data-aria-hidden="false"><span>Toggle</span></button>
            </h2>
         </header>
         <div id="customers${selection.product}" aria-hidden="false">
        
        {section {
          id: "paxDetails",
          macro: {name: 'showPaxDetails', args: [selection_index, selectedcpr, selection, cpr, acceptedcpr, custListForCancellation, label, flow], scope: this}
        }/}
                           <!-- end of ul on line 324 services02 -->
                                       /* {foreach customer inArray selection.customer}
                                       {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
                                           {set cancelCheckInStatus = true/}
                                             {foreach legIndicator in leg.legLevelIndicatorBean}
                                              {if legIndicator.indicator == "PPT"}
                                                {if legIndicator.action == "1"}
                                                  {set cancelCheckInStatus = false/}
                                                {/if}
                                              {/if}
                                             {/foreach}
                                           {/foreach}*/
                                         /*  {if cpr.customerLevel[customer].productLevelBean[selection.product].baggageInfoBean}
                                             {foreach infoBean in cpr.customerLevel[customer].productLevelBean[selection.product].baggageInfoBean}
                                              {foreach baggIten in infoBean.baggageItineraries}
                                                {if baggIten.activationStatusBean}
                                                  {if baggIten.activationStatusBean.indicator == "BAS"}
                                                      {if baggIten.activationStatusBean.action == "BFA"}
                                                        {set cancelCheckInStatus = false/}
                                                        {set noBagStatusErr = true /}
                                                      {/if}
                                                   {/if}
                                               {/if}
                                              {/foreach}
                                             {/foreach}
                                           {/if}
                                        {/foreach}*/

                                         {if selection_index == selectedcpr.length-1}
                                            {var enablecheckin = true/}
                                         {/if}
                                          {if cancelCheckInStatus == true}
                                            {if flow == "manageCheckin" && selection.customer && selection.customer.length > 0}
                                              {if paxCheckedin}
                                               /*{if cpr.customerLevel[customer].productLevelBean[selection.product].flightEligible}*/

                                                  <a class="secondary main disabled cancelChkn" href="javascript:void(0);"
                                                    /*{if enablecheckin} */ // {var handlerName = MC.appCtrl.registerHandler(this.onCancelCheckIn, this, {product : selection.product})/}
                                                     /* ${uiResponseEvent}="${handlerName}(event);" */ {on click {fn : "onCancelCheckIn" , args : {product : selection.product}}/} /*{/if}*/>
                                                      ${label.cancelChkn}
                                                  </a>
                                               /*{elseif !cpr.customerLevel[customer].productLevelBean[selection.product].flightEligible/}
                                                  There is a problem with your checkin. Contact Airport authorities!
                                               {/if}*/
                                              {/if}
                                            {/if}
                                           {/if}
                                      </div><!-- end of services02 div block 379 -->
                              </section><!-- end of section on line 303 -->
                    </article><!-- end of article starting on line 194 -->
    {/foreach}<!-- end of foreach on 136 -->
    {if flow == "manageCheckin" && noBagStatusErr == false}
        <div class="message info">
          <p>${label.bpBagErr}</p><!-- tx_merci_checkin_conf_bpissued -->
        </div>
      {/if}
        {if flow == "manageCheckin" && noBpIssuesErr == false}
        <div class="message info">
            <p>${label.bpIssuedErr}</p><!-- 'tx_merci_checkin_conf_bpissued -->
         </div>
       {/if}
        {var isBoardingPassNtIssed = this.moduleCtrl.getBoardingPassNtIssued()/}
        {if flow == "manageCheckin" && isBoardingPassNtIssed == false && noBpIssuesErr}
          <div class="message info">
            <p>${label.bpIssuedErr}</p><!-- 'tx_merci_checkin_conf_bpissued -->
          </div>
       {/if}


   {/macro}


   {macro showSeatDetails(product, selection, cpr, acceptedcpr, selection_index, label)}

      {var cancelCheckInEnableForSeat = true /}
      {var validPaxForSeat = []/}
      {var updatedSelectedCpr = []/}
      {var deliverDocumentInput = this.moduleCtrl.getValidDeliverDocInput()/}
      {var boardingPassIssued = this.moduleCtrl.getBoardingPassNtIssued()/}
      /*Commented part of sq feedback*/
        /*<ul class="services-checked">*/
            {if product.bookingStatusDetailsBean && product.bookingStatusDetailsBean.statusCodes[0] == "HK"}
                  {var customerID="" /}
                  {var seatDetails="" /}
                      {foreach customerInd inArray selection.customer}
                          {var seatChangeEligibility = true /}
                          {var paxCheckedinForSeat = false /}

                           {if acceptedcpr!=null}
                            {foreach acceptedcust in acceptedcpr.customerAndProductsBean}
                               {if acceptedcust.customerIdentifierPrimeId == cpr.customerLevel[customerInd].uniqueCustomerIdBean.primeId}
                                  {foreach leg in acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances}
                                    {foreach legIndicator in leg.statuses}
                                      {if legIndicator.indicator == "CAC"}
                                        {if legIndicator.action == "1"}
                                           {set paxCheckedinForSeat = true /}
                                         {/if}
                                      {/if}
                                     {/foreach}
                                    {/foreach}
                                  {/if}
                             {/foreach}

                              {if acceptedcpr.customerAndProductsBean[customerInd_index].acceptanceJourneies[selection.acceptanceConResProdIndx].validApp != true}
                                {set seatChangeEligibility = false /}
                            {/if}

							{else /}

                            {foreach leg in cpr.customerLevel[customerInd].productLevelBean[selection.product].legLevelBean}
                                  {foreach legIndicator in leg.legLevelIndicatorBean}
                                    {if legIndicator.indicator == "CAC"}
                                      {if legIndicator.action == "1"}
                                        /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                        {set paxCheckedinForSeat = true /}
                                      {/if}
                                        /*  {set seat = cpr.customerLevel[customerInd].productLevelBean[selection.product].legLevelBean[0].seatBean.seatDetailsSeatNumber /} */
                                    {/if}
                                    {if legIndicator.indicator == "PPT"}
                                     {if legIndicator.action == "1"}
                                      {set seatChangeEligibility = false/}
                                     {/if}
                                   {/if}
                                  {/foreach}
                            {/foreach}

                            {/if}

							{foreach productIden in cpr.customerLevel[customerInd].productLevelBean[selection.product].productIdentifiersBean}
                                          /* If a customer is associated with an infant, set all the values needed */
                                          {if productIden.referenceQualifier == "JID"}

                                          {elseif productIden.referenceQualifier == "DID" /}
                                            {set customerID = productIden.primeId /}
                                          {/if}
                            {/foreach}
                            {foreach detail in deliverDocumentInput}
                               {if detail.customerIdentifier == cpr.customerLevel[customerInd].uniqueCustomerIdBean.primeId && detail.productIdentifier == cpr.customerLevel[customerInd].productLevelBean[selection.product].productIdentifiersBean[0].primeId}
                                {set seatChangeEligibility = false /}
                              {/if}
                            {/foreach}

                            {if cpr.customerLevel.length == 1}
                            {set seatChangeEligibility = seatChangeEligibility && boardingPassIssued/}
                            {/if}

                            {if seatChangeEligibility == true && paxCheckedinForSeat == true}
                                {if validPaxForSeat.push({"customer" : customerInd ,"product" : selection.product, "customerId" : customerID})}
                                {/if}
                            {/if}
                          {/foreach}
                        {var customerListForSeat = []/}
                        {var productForSeat = "" /}

                     {if validPaxForSeat.length >0}
                      {foreach validSeat in validPaxForSeat}
                       {if customerListForSeat.push(validSeat.customer)}
                       {/if}
                       {set productForSeat = validSeat.product /}
                        {set seatDetails = this.moduleCtrl.getSeat(validSeat.customer, validSeat.product , validSeat.customerId) /}

                     {/foreach}
                    {/if}

                    {if customerListForSeat.length == 1}
                      {if inputForSeat.push({"product":productForSeat,"customer": customerListForSeat[0].toString()})}
                      {/if}
                    {elseif customerListForSeat.length != 0 /}
                      {if inputForSeat.push({"product":productForSeat,"customer": customerListForSeat})}
                      {/if}
                    {/if}
                 // {var handlerName = MC.appCtrl.registerHandler(this.onSeatMapClick, this, {product : selection.product, seat:seatDetails})/}
                 /*Commented part of sq feedback*/
                 /* <li data-service="seat">
                  {if validPaxForSeat.length >0}
                  {if this.moduleCtrl.setAcceptedValueForSeat(inputForSeat)}{/if}
                       <a href="javascript:void(0)" {on click {fn: "onSeatMapClick" , args : {product : selection.product, seat:seatDetails}}/} class="secondary">${label.Seat}</a>
                  {elseif validPaxForSeat.length <= 0 /}
                       <a href="javascript:void(0)" class="secondary disabled">${label.Seat}</a>
                   {/if}
                   </li>
                  {if flow!= "manageCheckin"}
                        <li data-service="seat"><a href="javascript:void(0)" class="secondary disabled">${label.Seat}</a></li>
                  {/if} */
                  /*Added part of sq feedback*/
                  {if validPaxForSeat.length >0}
                  {if this.moduleCtrl.setAcceptedValueForSeat(inputForSeat)}{/if}
                       <a href="javascript:void(0)" {on click {fn: "onSeatMapClick" , args : {product : selection.product, seat:seatDetails}}/} class="secondary">${label.Seat}</a>
                  {elseif validPaxForSeat.length <= 0 /}
                       <a href="javascript:void(0)" class="secondary disabled">${label.Seat}</a>
                   {/if}

            {/if}
            /*Commented part of sq feedback*/
       /* </ul>*/
   {/macro}

   {macro showPaxDetails(selection_index, selectedcpr, selection, cpr, acceptedcpr, custListForCancellation, label, flow)}
      {var isLast = false/}
     {if selection_index == selectedcpr.length-1}
      {set isLast = true /}
     {/if}
       <ul class="services-pax selectable">
          {var typeOfPax="" /}
          {var custId = "" /}
        {foreach customer inArray selection.customer}<!-- 1 foreach -->
          {var disableCheckBox = false/}
  {var paxCheckedinFlag = false /}
       {if selection_index != selectedcpr.length-1}
      {foreach leg in cpr.customerLevel[customer].productLevelBean[parseInt(selection.product)+1].legLevelBean}//SJ
                            {foreach legIndicator in leg.legLevelIndicatorBean}
                              {if legIndicator.indicator == "CAC"}
                                {if legIndicator.action == "1"}
            {set paxCheckedinFlag = true /}
          {/if}
        {/if}
        {/foreach}
       {/foreach}

  {if paxCheckedinFlag == true}
          {set disableCheckBox = true/}
  {/if}
       {/if}
          {foreach leg in cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean}
            {set cancelCheckInStatus = true/}
              {foreach legIndicator in leg.legLevelIndicatorBean}
                 {if legIndicator.indicator == "PPT"}
                   {if legIndicator.action == "1"}
                    {set disableCheckBox = true/}
                    {set noBpIssuesErr = noBpIssuesErr && false/}
                   {/if}
                 {/if}
            {/foreach}
        {/foreach}
          {if cpr.customerLevel[customer].customerDetailsType != "IN"}
            {var deliverDocumentInput = this.moduleCtrl.getValidDeliverDocInput()/}
            {foreach emailDet in deliverDocumentInput}
                  {if emailDet.customerIdentifier == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId && emailDet.productIdentifier == cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId}
                    {set noBpIssuesErr = noBpIssuesErr && false/}
                    {set disableCheckBox = true/}
                  {/if}
            {/foreach}

            {if cpr.customerLevel[customer].productLevelBean[selection.product].baggageInfoBean}
             {foreach infoBean in cpr.customerLevel[customer].productLevelBean[selection.product].baggageInfoBean}
                 {foreach baggIten in infoBean.baggageItineraries}
                     {if baggIten.activationStatusBean}
                      {if baggIten.activationStatusBean.indicator == "BAS"}
                         {if baggIten.activationStatusBean.action == "BFA"}
                             {set disableCheckBox = true/}
                            {set noBagStatusErr = noBagStatusErr && false /}
                         {/if}
                      {/if}
                    {/if}
                 {/foreach}
               {/foreach}
            {/if}


            {if cpr.customerLevel.length ==1}
              {var isBoardingPassNtIssed = this.moduleCtrl.getBoardingPassNtIssued()/}
            {/if}

            {var custId = "" /}
            {var isInfantToPax = false /}
            {var infantToPax = "" /}
            {var infantPrimeId = "" /}
            {var paxCST = false /}
            {var ssr = true /}
            {foreach productIdentifier in cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean} <!-- 2 for each -->
                  /* If a customer is associated with an infant, set all the values needed */
                  {if productIdentifier.referenceQualifier == "JID"}
                    {set isInfantToPax = true /}
                    {set infantToPax = cpr.customerLevel[customer].uniqueCustomerIdBean.primeId /}
                    {set infantPrimeId = productIdentifier.primeId /}
                  {elseif productIdentifier.referenceQualifier == "DID" /}
                    {set custId = productIdentifier.primeId /}
                  {/if}
             {/foreach}<!-- -2 -->
              {if  acceptedcpr != null}
                        {foreach acceptedcust in acceptedcpr.customerAndProductsBean}
                          {if acceptedcust.customerIdentifierPrimeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
                            {foreach leg in acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances}
                              {foreach legIndicator in leg.statuses}
                                {if legIndicator.indicator == "CAC"}
                                  {if legIndicator.action == "1"}
                                    /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                    {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].validApp == true}
                                     {set paxCheckedin = true /}
                                    {/if}
                                   {if custListForCancellation.push(customer)}
                                   {/if}
                                    {set issueBp = true /}
                                    {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0] && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber && acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber!=""}
                                      {set seat = acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].legAcceptances[0].seatNumber.seatDetailsSeatNumber /}
                                    {else /}
                                      {set seat = label.NotAdded /}
                                    {/if}
                                  {/if}
                                {/if}
                                {if legIndicator.indicator == "CST"}
                                  {if legIndicator.action == "1"}
                                  {if acceptedcust.acceptanceJourneies[selection.acceptanceConResProdIndx].validApp==true}
                                    {set paxCST = true /}
                                   {set paxCheckedin = true /}
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
                                  /* If customer is already accepted, then set pax checkedin and issue boasrding pass as true */
                                  {set paxCheckedin = true /}
                                    {if custListForCancellation.push(customer)}
                                   {/if}
                                  {set issueBp = true /}
                                {if cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean}
                                  {set seat = cpr.customerLevel[customer].productLevelBean[selection.product].legLevelBean[0].seatBean.seatDetailsSeatNumber /}
                                {else /}
                                {set seat = label.NotAdded /}
                                {/if}
                                {/if}
                              {/if}
                              {if legIndicator.indicator == "CST"}
                                {if legIndicator.action == "1"}
                                  {set paxCST = true /}
                                    {set paxCheckedin = true /}
                                {/if}
                              {/if}
                            {/foreach}
                         {/foreach}
                    {/if}<!-- end of if -->
                      /* If customer has e-ticket eligibility, set eTicket to true */
                          {if cpr.customerLevel[customer].productLevelBean[selection.product].candidateETicketsBean != null}
                            {set eTicket = true /}
                          {/if}
                      /* Check if customer is eligible for ssr */
                          {if cpr.customerLevel[customer].productLevelBean[selection.product].ssrEligible}
                            {set ssrEligible = true /}
                          {/if}
                      {var index = customer /}
                      {var customer = cpr.customerLevel[customer] /}
                       {if paxCheckedin}
                        {if customer.customerDetailsType == "C"}
                            <li class="child">
                          <input  {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id="${index}" name="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}" value="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}" {if disableCheckBox} disabled {/if}{if cpr.customerLevel.length == 1 && !isBoardingPassNtIssed} disabled {/if}>
                            <label for="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}">
                            {set typeOfPax="C" /}
                        {elseif customer.customerDetailsType == "IN"/}
                            <li class="infant">
                            {if isInfantToPax}
                               {call common.infantMacroForConfirmation(cpr.customerLevel , infantToPax , selection.prod , paxCheckedin , infantPrimeId , paxCheckedin , label , true , true) /}
                            {/if}
                 /*        <input {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id="pax05" name="05" value="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}">
                            <label for="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}">*/
                            {set typeOfPax="IN" /}
                         {elseif customer.customerDetailsType == "A"/}
                            {set typeOfPax="A" /}
                            <li>
                        {/if}
                             {if typeOfPax == "A"}
                              <input {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id="${index}" name="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}" value="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}"{if disableCheckBox} disabled {/if}{if cpr.customerLevel.length == 1 && !isBoardingPassNtIssed} disabled {/if}">
                                <label for="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}">
                                    {if customer.otherPaxDetailsBean[0].title}
                                        <h4>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].title,customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}</h4>
                                    {else /}
                                      <h4>${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}</h4>
                                    {/if}
                                    /*{if customer.productLevelBean[selection.product].fqtvInfoBean && customer.productLevelBean[selection.product].fqtvInfoBean[0].frequentTravellerDetails}
                                      <dl>
                                      <dt>${label.FFNumber}: </dt>
                                      <dd> ${customer.productLevelBean[selection.product].fqtvInfoBean[0].frequentTravellerDetails[0].number}</dd>
                                      </dl>
                                    {/if}*/
                               {else /}
                               <h4>${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])} <i class="textSmaller">(Child)</i></h4>
                               {/if}
                                     /*<dl>
                                       <dt>${label.Cabin}:</dt>
                                       <dd> ${customer.productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} <abbr>(${customer.productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClass})</abbr> </dd>
                                       <dt>${label.Seat}: </dt>
                                       <dd>
                                      {set seat = this.moduleCtrl.getSeat(customer_index , selection.product , custId) /}
                                      {if seat == "Not Added"}
                                        ${label.NotAdded}
                                      {else /}
                                        ${seat}
                                      {/if}
                                      </dd>
                                       {if customer.productLevelBean[selection.product].servicesBean}
                                          {call common.MealDetails(customer.productLevelBean[selection.product].servicesBean,label)/}
                                       {/if}
                                    </dl>*/
                                    </label>
                                  </li>
                                 {if isInfantToPax}
                                     {call common.infantMacroForConfirmation(cpr.customerLevel , infantToPax , selection.product , paxCheckedin , infantPrimeId , paxCheckedin , label , true , true) /}
                                 {/if}
                                {/if}
                               {else/}
                                <li class="infant">
                                {if cpr.customerLevel[customer].otherPaxDetailsBean}

                                  /*<input type="checkbox" id="pax02" name="pax02" value="" disabled>
                                  <label for="${cpr.customerLevel[customer_index].otherPaxDetailsBean[0].givenName}">
                                  <h4>${jQuery.substitute(label.PaxNameInfant, [cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName, cpr.customerLevel[customer].customerDetailsSurname])}</h4>
                                   <dl>
                                       <dt>${label.Cabin}:</dt>
                                       <dd> ${cpr.customerLevel[customer].productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} <abbr>(${cpr.customerLevel[customer].productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClass})</abbr> </dd>
                                       <dt>${label.Seat}: </dt>
                                       <dd>
                                      {set seat = this.moduleCtrl.getSeat(customer_index , selection.product , custId) /}
                                      {if seat == "Not Added"}
                                        ${label.NotAdded}
                                      {else /}
                                        ${seat}
                                      {/if}
                                      </dd>
                                       {if cpr.customerLevel[customer].productLevelBean[selection.product].servicesBean}
                                          {call common.MealDetails(cpr.customerLevel[customer].productLevelBean[selection.product].servicesBean,label)/}
                                       {/if}
                                    </dl>*/
                                {else /}
                                <label for="${cpr.customerLevel[customer].customerDetailsSurname}">
                              <input {if flow != 'manageCheckin'} type="hidden" {else/} type="checkbox" {/if} id="pax02" name="pax02" value="" disabled>
                                <h4>${jQuery.substitute(label.PaxNameInfant, ["", cpr.customerLevel[customer].customerDetailsSurname])}</h4>
                                  /*<dl>
                                       <dt>${label.Cabin}:</dt>
                                       <dd> ${cpr.customerLevel[customer].productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} <abbr>(${cpr.customerLevel[customer].productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClass})</abbr> </dd>
                                       <dt>${label.Seat}: </dt>
                                       <dd>
                                      {set seat = this.moduleCtrl.getSeat(customer_index , selection.product , custId) /}
                                      {if seat == "Not Added"}
                                        ${label.NotAdded}
                                      {else /}
                                        ${seat}
                                      {/if}
                                      </dd>
                                       {if cpr.customerLevel[customer].productLevelBean[selection.product].servicesBean}
                                          {call common.MealDetails(cpr.customerLevel[customer].productLevelBean[selection.product].servicesBean,label)/}
                                       {/if}
                                    </dl>*/
                                {/if}
                                </li>

                               {/if}
                            {/foreach}
                       </ul>


   {/macro}
  {/Template}