{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.TripOverview',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}

    {var label = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.labels/}
  {var parameters = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.parameters/}

{var cpr = ""/}
{var cprInput = this.moduleCtrl.cprInputSQ /}
{var cprResponseForApp = "" /}
{var enableNextLeg = true/}
{var showFurthurSegments = false /}
{var allPaxChecked = true/}
{set cpr = this.moduleCtrl.getModuleData().checkIn.MTripOverview_A.requestParam.CPRIdentification/}

{var myUrl=this.moduleCtrl.getModuleData().framework.baseParams.join("") /}
	{if !cprInput}
	{set cprInput = this.moduleCtrl.getUrlVars(myUrl) /}
	{/if}

{var notRetrievedLastNameList = null /}
{if cpr.retrPannelReq}
	{set notRetrievedLastNameList = moduleCtrl.findNotRetrievedLastNameList(cpr) /}
	{set temp = moduleCtrl.setNotRetrievedLastNames(notRetrievedLastNameList) /}
{/if}

{var productView = cpr.customerLevel[0].productLevelBean/}
{var totalPax = cpr.customerLevel.length /}
 <div class='sectionDefaultstyle'>

<section>
    <header>
      <h3>${label.RefText}: <strong>${cpr.customerLevel[0].recordLocatorBean.controlNumber}</strong></h3>
    </header>
    <!-- <form> -->
  {foreach product inArray productView} /* Start Loop for Product *****************************************/
{var checkedinPax = 0 /}
	/* Start :: Display if Segment has not flown */
	{if !product.flown}

    {var eligibility = this.isFlightEligible(product,product_index) /}

	{if !eligibility}
		{set disableSegment = true /}
	{else/}
			{set disableSegment = false /}

	{/if}

	{var finalSelPax = null /}
	{set finalSelPax = selectedPax.concat() /}
	{if typeof finalSelPax == "string"}
		{set finalSelPax = [finalSelPax] /}
	{/if}
	{var tempCount = 0 /}

	{foreach selPaxDtlsFrInput in selectedPax}
	{var customerdtls = cpr.customerLevel[selPaxDtlsFrInput] /}
	{var customerdtls_index = selPaxDtlsFrInput_index /}
	{var paxCheckedin_temp = false /}
	{var paxSBYH_temp = false /}
	{var totalLegInSegment = customerdtls.productLevelBean[product_index].legLevelBean.length /}
	{foreach prodleg in customerdtls.productLevelBean[product_index].legLevelBean}
		/* Start :: To Check if passenge is checked in or in standby mode */
		{foreach legIndicator_temp in prodleg.legLevelIndicatorBean}
			{if legIndicator_temp.indicator == "CAC"}
			  {if legIndicator_temp.action == "1"}
				{set paxCheckedin_temp = true /}
				{set checkedinPax = checkedinPax+1 /}
			  {/if}
			{/if}
			{if legIndicator_temp.indicator == "CST"}
			  {if legIndicator_temp.action == "1"}
				{set paxSBYH_temp = true /}
				{set paxCheckedin_temp = true /}
				{set checkedinPax = checkedinPax+1 /}
			  {/if}
			{/if}
		{/foreach}
	{/foreach}

	/* Start :: To check if all passenger has checkedin or not */
		{if checkedinPax != totalPax*totalLegInSegment}
		  {set allPaxChecked = false/}
		{else/}
		  {set allPaxChecked = true/}
		{/if}
	/* End :: To check if all passenger has checkedin or not */

	{var paxRestrictedInCurrSegment = false /}
	/* Start :: Product Iteration */
	{foreach productPax in customerdtls.productLevelBean}
		{if productPax_index == product_index && !productPax.paxTicketEligible}
			{set paxRestrictedInCurrSegment = true /}
		{/if}
	{/foreach}
	/* End :: Product Iteration */
	/* Start :: Display the Selection box if passenger is eligible to checkin */
	{if paxCheckedin_temp || paxRestrictedInCurrSegment}
		{var indx = finalSelPax.splice(tempCount,1) /}
		{set tempCount = tempCount - 1 /}
	{/if}
	{set tempCount = tempCount + 1 /}
	{/foreach}

/*
Removed customer where customer is having some problem
*/
{var deletePax=false /}
{foreach selPaxDtlsFrInput in selectedPax}
 {var customerdtls = cpr.customerLevel[selPaxDtlsFrInput] /}

 {if customerdtls.customerDetailsType != "IN"}
	{var associatedInfantIndex = null /}
	{var isInfantToPax = false /}
	{var infantToPax = "" /}
	{var infantPrimeId = "" /}
	{var paxPT = false /}

	{var paxPT = true /}
	  {if customerdtls.paxEligible}
		{set paxPT = true /}
	{else/}
		{set paxPT = false /}
	{/if}
	{foreach productIdentifier in customerdtls.productLevelBean[product_index].productIdentifiersBean}
		{if productIdentifier.referenceQualifier == "JID"}
		{set isInfantToPax = true /}
		{set infantToPax = selPaxDtlsFrInput /}
		{set infantPrimeId = productIdentifier.primeId /}
		{/if}
	{/foreach}

	{var infantPaxPT = true /}
	{if isInfantToPax}
		{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
		{if !cpr.customerLevel[associatedInfantIndex].paxEligible}
			{set infantPaxPT = false /}
		{/if}
	{/if}

	{if customerdtls.productLevelBean[0].servicesBean}
		{var item=customerdtls.productLevelBean[0].servicesBean /}
		{foreach service in item}
		  {var currSSRCode = item[service_index].specialRequirementsInfoBean.ssrCode /}
		  {if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
			{set deletePax=true /}
		  {/if}
		{/foreach}
	{/if}
	{if !paxPT || !infantPaxPT}
		{set deletePax=true /}
	{/if}
	{if !customerdtls.productLevelBean[0].psprtLstNameCheckWithCustLastName}
		{set deletePax=true /}
	{/if}
	{if customerdtls.hasMultipleNat}
		{set deletePax=true /}
	{/if}
	{if customerdtls.custRestrictedSSR}
		{set deletePax=true /}
	{/if}

	/*
	remove from finalSelPax
	*/
	{if deletePax == true && finalSelPax.indexOf(selPaxDtlsFrInput) != -1}
		{var indx = finalSelPax.splice(finalSelPax.indexOf(selPaxDtlsFrInput),1) /}
	{/if}
	{if  deletePax == true && !infantPaxPT && finalSelPax.indexOf(associatedInfantIndex) != -1 }
		{var indx = finalSelPax.splice(finalSelPax.indexOf(associatedInfantIndex),1) /}
	{/if}

 {/if}

{/foreach}

/*Removing infant, cust if its corespondee is restricted*/
{set tempCount = 0 /}
{foreach finalSelPaxSelectee in finalSelPax}
	{var tmp_re=this.moduleCtrl.getInfantOrPaxIndex(finalSelPaxSelectee) /}
	{if tmp_re != -1 && finalSelPax.indexOf(tmp_re) == -1}
			{var indx = finalSelPax.splice(finalSelPaxSelectee_index,1) /}
			{set tempCount = tempCount - 1 /}
	{/if}
	{set tempCount = tempCount + 1 /}
{/foreach}

    <article data-validPanel="{if !product.checkInOpen || !product.flightOpen || this.segmentBookingStatErr || finalSelPax.length == 0 || disableSegment || showFurthurSegments}false{if !allPaxChecked}{set showFurthurSegments = true /}{/if}{else /}true{/if}" class="panel">
        <header>
          <h1>${jQuery.substitute(label.PanelTitle, [product.operatingFlightDetailsBoardPointInfo.city, product.operatingFlightDetailsOffPointInfo.city])}
            <button data-aria-hidden="false" data-aria-controls="TPsection${product_index}, TPsection${product_index}_${product_index+1}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
          </h1>
        </header>
        <section aria-hidden="false" id="TPsection${product_index}">
          <div class="trip large-display">
            <p>
              <time datetime="2013-03-25">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      product.operatingFlightDetailsBoardPoint,
                      "",
                      "STD",
                      label.TripPattern.Date
                    )
                  /}</time>
              <time datetime="07:35">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      product.operatingFlightDetailsBoardPoint,
                      "",
                      "STD",
                      label.TripPattern.Time
                    )
                  /}</time>
              <span>${product.operatingFlightDetailsBoardPointInfo.city}</span> <span>${product.operatingFlightDetailsBoardPointInfo.city}, ${product.operatingFlightDetailsBoardPointInfo.airport} <abbr>(${product.operatingFlightDetailsBoardPoint})</abbr></span> <span style="display:block"><strong>{call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsBoardPoint, label) /}</strong></span> </p>
            <p>
              <time datetime="2013-03-25">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      "",
                      product.operatingFlightDetailsOffPoint,
                      "STA",
                      label.TripPattern.Date
                    )
                  /}</time>
              <time datetime="11:55">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      "",
                      product.operatingFlightDetailsOffPoint,
                      "STA",
                      label.TripPattern.Time
                    )
                  /}</time>
              <span>${product.operatingFlightDetailsOffPointInfo.city}</span> <span>${product.operatingFlightDetailsOffPointInfo.city}, ${product.operatingFlightDetailsOffPointInfo.airport} <abbr>(${product.operatingFlightDetailsOffPoint})</abbr></span> <span style="display:block"><strong>{call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsOffPoint, label) /}</strong></span> </p>
          </div>
          <div class="details">
            <ul>
              <li class="fare-family"><span class="label">${label.Flight}:</span> <span class="data"><strong>${product.operatingFlightDetailsMarketingCarrier}${product.operatingFlightDetailsFlightNumber}</strong> {if product.legLevelBean.length == 1}(${label.Direct}){else /}(${label.InDirect}){/if}</span></li>
             <!-- <li class="duration"><span class="label">${label.Duration}:</span> <span class="data">{call
                    common.dateDiff(
                      product.legLevelBean[0].legTimeBean[0].json,
                      product.legLevelBean[0].legTimeBean[2].json,
                      label.DateDiff
                    )
                  /}</span></li>-->
            </ul>
          </div>
        </section>
        <section id="TPsection${product_index}_${product_index+1}">
          <header>
            <h2 class="subheader"> <span>${label.PaxServiceLabel}</span>
              <button data-aria-hidden="false" data-aria-controls="TPservices${product_index}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
            </h2>
          </header>
          <div data-aria-hidden="false" id="TPservices${product_index}">
            <ul class="services-pax">
              {var typeOfPax="" /}
              {var custId = "" /}
              {foreach customer inArray cpr.customerLevel} /* Start :: Loop into all Passengers */
			  /* Code added for SQ integration with Native Apps */
				  {if customer_index == 0 && product_index == 0}
					 {var temp=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customer.productLevelBean[0]) /}
					  {var temp1=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customer.productLevelBean[customer.productLevelBean.length-1]) /}
					  {if customer.productLevelBean[0].operatingFlightDetailsBoardPoint != customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPoint}
					  {set cprResponseForApp += customer.productLevelBean[0].operatingFlightDetailsBoardPointInfo.city + "|" +
										  customer.productLevelBean[0].operatingFlightDetailsBoardPoint + "|" +
										  customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPointInfo.city + "|" +
										  customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPoint + "|" +
										  cpr.customerLevel.length + "|" +
										  temp.depDateInGMTDate + "|" +
										  temp1.arrDateInGMTDate + "|" /}
					  {else/}
					  {set cprResponseForApp += customer.productLevelBean[0].operatingFlightDetailsBoardPointInfo.city + "|" +
										  customer.productLevelBean[0].operatingFlightDetailsBoardPoint + "|" +
										  customer.productLevelBean[customer.productLevelBean.length-2].operatingFlightDetailsOffPointInfo.city + "|" +
										  customer.productLevelBean[customer.productLevelBean.length-2].operatingFlightDetailsOffPoint + "|" +
										  cpr.customerLevel.length + "|" +
										  temp.depDateInGMTDate + "|" +
										  temp1.depDateInGMTDate + "|" /}
					  {/if}
							{foreach customerLvlProd in customer.productLevelBean}
							{var temp=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customerLvlProd) /}
								{if customerLvlProd_index != customer.productLevelBean.length -1}
									{set cprResponseForApp += customerLvlProd.operatingFlightDetailsFlightNumber + "^" + temp.depDateInGMTDate + "-" + temp.arrDateInGMTDate + "," /}
								{else/}
									{set cprResponseForApp += customerLvlProd.operatingFlightDetailsFlightNumber + "^" + temp.depDateInGMTDate + "-" + temp.arrDateInGMTDate /}
								{/if}
							{/foreach}
				  {/if}
			/* End of code added for SQ integration with Native Apps */
			{if customer.custRetrieved}
			{if customer.customerDetailsType != "IN"}

			/*For pre filling Email to module ctrl bean
			in order to get pre populated
			*/
			{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId, "Phone") /}
			{var phoneNumber="" /}
			{var Email="" /}
          	{if phoneandEmail != ""}

            	{set Email=phoneandEmail.split("~")[1] /}

				/*
					helps(pre fill email popup in conf page) incase email or phone in profile bean and we are landing on to

					confirmation page directly i.e with out coming to passenger details page

					in this case usually PassengerDetails bean is empty
				*/
            	{var temp = {}/}
	            {if phoneandEmail.split("~")[0].trim() != "-" && phoneandEmail.split("~")[0].trim() != ""}
			      {if temp.phoneNumber = phoneandEmail.split("~")[0]}{/if}
			    {else/}
			      {if temp.phoneNumber = ""}{/if}
			    {/if}
	            {if temp.email = Email }{/if}
	            {if temp.custNumber = customer_index }{/if}
	            {if temp.uniqueCustomerIdBean = customer.uniqueCustomerIdBean}{/if}
				{if moduleCtrl.setPassengerDetails([temp])}{/if}

          	{/if}

          /*Check for PAX CHECKED IN*/

            /* Start :: To Check if passenge is checked in or in standby mode */

            {var checkedinPax = 0 /}
            {var totalLegInSegment = customer.productLevelBean[product_index].legLevelBean.length /}
            {var paxCheckedin = false /}
      {var paxStandBy = false /}
      {var isInfantToPax = false /}
            {var infantToPax = "" /}
            {var infantPrimeId = "" /}

      {foreach leg in customer.productLevelBean[product_index].legLevelBean}
              {foreach legIndicator in leg.legLevelIndicatorBean}
                {if legIndicator.indicator == "CAC"}
                  {if legIndicator.action == "1"}
                  {set paxCheckedin = true /}
                  {set checkedinPax = checkedinPax+1 /}

                  {/if}
                {else/}

                {/if}
                {if legIndicator.indicator == "CST"}
                  {if legIndicator.action == "1"}

                  {var paxStandBy = true /}
                  {set checkedinPax = checkedinPax+1 /}

                  {/if}
                {else/}

                {/if}
              {/foreach}
            {/foreach}

      {if !eligibility}
          /*{if isCurrentPrime}
          {set enableNextLeg = false /}
        {/if}*/
      {/if}

      {var paxPT = true /}
      {if customer.paxEligible && customer.oruBkingElgibty}
        {set paxPT = true /}
      {else/}
        {set paxPT = false /}
      {/if}

      {foreach productIdentifier in customer.productLevelBean[product_index].productIdentifiersBean}
                              {if productIdentifier.referenceQualifier == "JID"}
                                {set isInfantToPax = true /}
                                {set infantToPax = customer_index /}
                                {set infantPrimeId = productIdentifier.primeId /}
                              {elseif productIdentifier.referenceQualifier == "DID" /}
                                {set custId = productIdentifier.primeId /}
                              {/if}
            {/foreach}

          /* Start :: To check if all passenger has checkedin or not */
          {if checkedinPax != totalLegInSegment}
            {set paxCheckedin = false/}
          {else/}
            {set paxCheckedin = true/}
          {/if}
          /* End :: To check if all passenger has checkedin or not */

          /*END Check for PAX CHECKED IN*/


          {if customer.customerDetailsType == "C"}
      <li class="child">
    {set typeOfPax="C" /}
      /*{elseif customer.customerDetailsType == "IN"/}
      <li class="infant">
      {set typeOfPax="IN" /}*/
    {elseif customer.customerDetailsType == "A"/}
    {set typeOfPax="A" /}
      <li>
      {/if}
          {if typeOfPax == "A"}
        {if customer.otherPaxDetailsBean}
          {if customer.otherPaxDetailsBean[0].title}
          <h4>${jQuery.substitute(label.PaxName, [customer.otherPaxDetailsBean[0].title,customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}{if paxStandBy}<span class="checkedinTripsPage">${label.StandBy}</span>{elseif paxCheckedin /}<span class="checkedinTripsPage">${label.CheckedIn}</span>{/if}</h4>
          {else /}
          <h4>${jQuery.substitute(label.PaxName, ["",customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}{if paxStandBy}<span class="checkedinTripsPage">${label.StandBy}</span>{elseif paxCheckedin /}<span class="checkedinTripsPage">${label.CheckedIn}</span>{/if}</h4>
          {/if}
        {else /}
        <h4>${jQuery.substitute(label.PaxName, ["","", customer.customerDetailsSurname])}{if paxStandBy}<span class="checkedinTripsPage">${label.StandBy}</span>{elseif paxCheckedin /}<span class="checkedinTripsPage">${label.CheckedIn}</span>{/if}</h4>
        {/if}

        {var fqtv = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId) /}

        {if fqtv && fqtv != ""}
        {set fqtv = fqtv.split("~")[1] /}
        <dl>
        <dt>${label.FFNumber}: </dt>
        <dd> ${fqtv}</dd>
        </dl>
        {/if}
      {else /}
        {if customer.otherPaxDetailsBean}
        <h4>${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])} <i class="textSmaller">(Child)</i>{if paxStandBy}<span class="checkedinTripsPage">${label.StandBy}</span>{elseif paxCheckedin /}<span class="checkedinTripsPage">${label.CheckedIn}</span>{/if}</h4>
        {else /}
        <h4>${jQuery.substitute(label.PaxNameInfant, ["", customer.customerDetailsSurname])} <i class="textSmaller">(Child)</i>{if paxStandBy}<span class="checkedinTripsPage">${label.StandBy}</span>{elseif paxCheckedin /}<span class="checkedinTripsPage">${label.CheckedIn}</span>{/if}</h4>
        {/if}
      {/if}

          <dl>
            <dt>${label.Cabin}:</dt>
            <dd> ${customer.productLevelBean[product_index].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} <abbr>(${customer.productLevelBean[product_index].bookedCabinCodeBean.cabinDetailsBookingClass})</abbr> </dd>
            <dt>${label.Seat}: </dt>
            <dd>
            {var seat = this.moduleCtrl.getSeat(customer_index , product_index , custId) /}
            {if seat == "Not Added"}
              ${label.NotAdded}
            {else /}
              ${seat}
            {/if}
            </dd>
            {if customer.productLevelBean[product_index].servicesBean}
            {call
                    common.MealDetails(
                      customer.productLevelBean[product_index].servicesBean,
                      label
                    )
                  /}
            {/if}
            <!--<dt> ${label.Meal}: </dt>
            <dd> vegetarian</dd>-->
          </dl>

          </li>
          {if isInfantToPax}
                                  {call common.infantMacroForTripList(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT) /}
                                {/if}
      {/if}
              {/if}
			  {/foreach}
			  </ul>
          </div>
        </section>
      </article>
  {/if}
{/foreach}
      {var flag = false/}
            {if !cpr.allCheckedIn}
      <footer class="buttons">

        <button class="validation" id="tripOverFlowCheckin" {on click { fn:"gotoSelectPAX", args: {"flow" : "checkin"}}/} type="button">${label.Checkin}</button>
        <button {on click { fn:"onBackClick"}/} class="validation cancel" type="button">${label.Modify}{set flag = true/}</button>
        </footer>
        {/if}
        {if cpr.onePaxCheckedIn}
        <footer class="buttons">
	{if flag == false}
        	<button {on click { fn:"onBackClick"}/} class="validation cancel" type="button">${label.Modify}</button>
	{/if}

        <button class="validation" {on click { fn:"gotoSelectPAX", args: {"flow" : "manageCheckin"}}/} type="button">${label.MngChkn}</button>
        </footer>
        {/if}

/*
<footer class="buttons">
		{if !cpr.allCheckedIn}
        	<button class="validation" {on click { fn:"gotoSelectPAX", args: {"flow" : "checkin"}}/} type="button">${label.Checkin}</button>
        {/if}
        {if cpr.onePaxCheckedIn}
            <button class="validation" {on click { fn:"gotoSelectPAX", args: {"flow" : "manageCheckin"}}/} type="button">${label.MngChkn}</button>
        {/if}
		<button {on click { fn:"onBackClick"}/} class="validation cancel" type="button">${label.Modify}</button>
        </footer>
*/

		{var PNRData = "" /}
    <!-- </form> -->
	<div class="displayNone">
	{if moduleCtrl.getEmbeded()}
		{var ffNbr = "" /}
		{var rLoc = "" /}
		<input type="text" value="${cprResponseForApp}" id="PNRData" name="PNRData" />
		 {if cprInput && cprInput.lastName && cprInput.lastName != ""}
		  {set PNRData = PNRData + cprInput.lastName /}
		  {set lstName = cprInput.lastName /}
		{else /}
		{set PNRData = PNRData + cpr.customerLevel[0].customerDetailsSurname /}
		  {set lstName = cpr.customerLevel[0].customerDetailsSurname /}
		 {/if}
	  {if cpr.customerLevel[0].recordLocatorBean.controlNumber != ""}
		{set PNRData = PNRData + "|" + cpr.customerLevel[0].recordLocatorBean.controlNumber  /}
		{set rLoc = cpr.customerLevel[0].recordLocatorBean.controlNumber /}
	  {elseif cprInput && cprInput.rLoc && cprInput.rLoc != "" /}
		  {set PNRData = PNRData + "|" + cprInput.rLoc /}
		  {set rLoc = cprInput.rLoc /}
	  {else /}
		{set PNRData = PNRData + "|" + ""  /}
	  {/if}
	  {if localStorage.ffNumber}
		{set PNRData = PNRData + "|" + localStorage.ffNumber /}
		{set ffNbr = localStorage.ffNumber /}
	 {elseif cprInput && cprInput.ffNbr && cprInput.ffNbr != "" /}
		  {set PNRData = PNRData + "|" + cprInput.ffNbr /}
		  {set ffNbr = cprInput.ffNbr /}
	  {else/}
		{set PNRData = PNRData + "|" + "" /}
	  {/if}

	  {if cprInput &&   cprInput.carrier && cprInput.carrier != ""}
		{set PNRData = PNRData + "|" + cprInput.carrier /}

	  {else/}
		{set PNRData = PNRData + "|" + "" /}
	  {/if}

	  {if cprInput &&   cprInput.eticketNumber && cprInput.eticketNumber != ""}
		{set PNRData = PNRData + "|" + cprInput.eticketNumber /}
	  {else/}
		{set PNRData = PNRData + "|" + "" /}
	  {/if}
    {/if}
	<input type="text" value="${PNRData}" id="retrievePNRData" name="retrievePNRData" />

	</div>

  </section>

 </div>
   {/macro}
{/Template}