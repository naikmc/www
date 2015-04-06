{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.CPRRetreiveMultiPax',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript:true
}}

{macro main()}
{var label = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.labels /}
{var parameters = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.parameters/}
{var cpr = ""/}
  {if moduleCtrl && moduleCtrl.getCPR() && moduleCtrl.getCPR().customerLevel && moduleCtrl.getCPR().customerLevel.length > 0}
     {set cpr = moduleCtrl.getCPR() /}
  {elseif JSONData.cprResponse /}
    {set cpr = JSONData.cprResponse.data.model.CPRIdentification /}
    {if moduleCtrl.getSessionId() || moduleCtrl.getSessionId() == null }
        {var ssID = moduleCtrl.setSessionId(JSONData.cprResponse.data.framework.sessionId) /}
    {/if}
  {/if}
{var productView = cpr.customerLevel[0].productLevelBean/}
{var cprInput = this.moduleCtrl.cprInputSQ /}

{var myUrl=this.moduleCtrl.getModuleData().framework.baseParams.join("") /}
	{if !cprInput}
	{set cprInput = this.moduleCtrl.getUrlVars(myUrl) /}
	{/if}

{var notRetrievedLastNameList = null /}
{if cpr.retrPannelReq}
	{set notRetrievedLastNameList = moduleCtrl.findNotRetrievedLastNameList(cpr) /}
	{set temp = moduleCtrl.setNotRetrievedLastNames(notRetrievedLastNameList) /}
{/if}

{var totalSeg = productView.length /}
{var totalPax = cpr.customerLevel.length /}
{var disableProduct = 0 /}
{var allPaxChecked = true/}
{var enableNextLeg = true/}
{var disableContinue = false /}
{var allSsrNotEligible = true /}
{var checkinFlightCnt = 0 /}
{if productView != null}
<div class='sectionDefaultstyle sectionOfCPRRetriveMultiPax'>
{if productView.length > 0}
<section>
  /* This div is used to display errors related to cpr */
  <div id="cprErrors"></div>
  /* This div is used to display errors related to nationality edits occured on nationality page, as it is the fall back page */
  <div id="nationalityErrors"></div>
  /* This div is used to display errors related to regulatory edits occured on regulatory page, as it is the fall back page */
  <div id="RegulatoryErrors"></div>
  <form id="CPRRetrieveMultipax" {on submit "retrieveOtherPassengersInTrip"/}>
   <nav class="breadcrumbs">
      <ul>
        <li class="active"><span>1</span><span class="bread"></span></li>
        <li><span>2</span></li>
        <li><span>3</span></li>
        <li><span>4</span></li>
      </ul>
    </nav>
    {if cpr.retrPannelReq}
		<div class="message info">
		  <p>${label.Morepaxintrip}</p>
		</div>
		<article class="panel">
		  <header>
			<h1>${label.Retpax}</h1>
		  </header>
		  <section class="form">
			<ul class="input-elements">
			  <li class="nationality">
				<label for="lastNameToRetrieve">${label.LastnameFamily}</label>
				<input id="otherLastNameField" type="text">
			  </li>
			</ul>
			<div class="actions">
			  <button id="lastNameToRetrieveButton" class="validation" type="button" role="button" {on click { fn:"retrieveOtherPassengersInTrip", args: {}}/}>${label.RetrieveLbl}</button>
			</div>
		  </section>
		</article>
	{/if}
    <article class="panel list">
      <header>
        <h1>${label.PassengersToCheckin}</h1>
      </header>
      <section>
        <ul class="checkin-list is-selectable" data-info="pax-list">
      /* Display the information of passengers along with the checkbox with an option to select the pasengers for checkin*/
    {var totalPax = cpr.customerLevel.length /}
    {foreach customer in cpr.customerLevel} /* Start :: Loop into all Passengers */
	{if customer.custRetrieved}
      {if customer.customerDetailsType != "IN"}
		{var associatedInfantIndex = null /}
		{set checkinFlightCnt = 0 /}
	    {var paxCheckedin = false /}
        {var paxSBY = false /}
        {var isInfantToPax = false /}
        {var infantToPax = "" /}
        {var infantPrimeId = "" /}
        {var paxPT = false /}
        {var ssrEligible = true /}
        {var eTicket = false /}
        {var ssrBPEligible = true /}
        {var originEligibility = false /}
        {var checkedinPaxCnt = 0 /}
        {foreach product in customer.productLevelBean} /* Start :: Product Iteration */
		  {set paxCheckedin = false /}
          {var checkedinPax = 0 /}
          {var totalLegInSegment = customer.productLevelBean[product_index].legLevelBean.length /}
          {var destEligibility = true /}
          {foreach leg in customer.productLevelBean[product_index].legLevelBean}
            /* Start :: To Check if passenge is checked in or in standby mode */
            {foreach legIndicator in leg.legLevelIndicatorBean}
              {if legIndicator.indicator == "CAC"}
                {if legIndicator.action == "1"}
                {set paxCheckedin = true /}
                {set checkedinPax = checkedinPax+1 /}
                {set checkedinPaxCnt = checkedinPaxCnt+1 /}
				{set checkinFlightCnt = checkinFlightCnt+1 /}
                {/if}
              {else/}

              {/if}
              {if legIndicator.indicator == "CST"}
                {if legIndicator.action == "1"}
                {set paxSBY = true /}
                {set paxCheckedin = true /}
                {set checkedinPax = checkedinPax+1 /}
                {set checkedinPaxCnt = checkedinPaxCnt+1 /}
				{set checkinFlightCnt = checkinFlightCnt+1 /}
                {/if}
              {else/}

              {/if}
            {/foreach}
          {/foreach}

          {var paxPT = true /}
          {if customer.paxEligible}
            {set paxPT = true /}
          {else/}
            {set paxPT = false /}
          {/if}
          /* Start :: To check if all passenger has checkedin or not */
          {if checkedinPax != totalLegInSegment}
            {set paxCheckedin = false/}
          {else/}
            {set paxCheckedin = true/}
          {/if}
          /* End :: To check if all passenger has checkedin or not */
          /* Start :: To check if infant is associated to pax or not */
          {foreach productIdentifier in customer.productLevelBean[product_index].productIdentifiersBean}
            {if productIdentifier.referenceQualifier == "JID"}
            {set isInfantToPax = true /}
            {set infantToPax = customer_index /}
            {set infantPrimeId = productIdentifier.primeId /}
            {/if}
          {/foreach}
        /* End :: To check if infant is associated to pax or not */
        {/foreach}
		{if checkinFlightCnt != customer.productLevelBean.length}
			{set paxCheckedin = false /}
		{/if}
		{var infantPaxPT = true /}
		{if isInfantToPax}
			{set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
			{if !cpr.customerLevel[associatedInfantIndex].paxEligible}
				{set infantPaxPT = false /}
			{/if}
		{/if}
		/* End :: Product Iteration */
        /* Start :: Display the Selection box if passenger is eligible to checkin */
        {if !paxCheckedin}

        /* End :: To Check if passenge is checked in or in standby mode */
              <li {if customer.customerDetailsType == "C"}class="child"{/if}>
                <input type="checkbox" id="cust_${customer_index}" data-id="pax0${customer_index}" name="${customer_index}" value="${customer_index}"
                  {on click { fn:"paxSelection", args: {cust : customer_index, prod: product_index}}/}
                  {if customer.productLevelBean[0].servicesBean}
                  {var item=customer.productLevelBean[0].servicesBean /}
                  {foreach service in item}
                    {var currSSRCode = item[service_index].specialRequirementsInfoBean.ssrCode /}
                    /*{if JSONData.parameters.SITE_MCI_SSR_CANT_CI_ALON.toUpperCase().search(currSSRCode) != "-1" }
                      disabled="disabled"
                    {/if}*/
                    {if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
                      disabled="disabled"
                    {/if}
                  {/foreach}
                  {/if}
                  {if !paxPT || !infantPaxPT}
                      disabled="disabled"
                  {/if}
				  {if !customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
					  disabled="disabled"
				  {/if}
				  {if customer.hasMultipleNat}
					  disabled="disabled"
				  {/if}
				  {if customer.custRestrictedSSR}
					  disabled="disabled"
				  {/if}
                   />
                <label for="cust_${customer_index}">
					{if customer.customerDetailsType == "C"}
						<strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong>
					{else/}
						<strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong>
					{/if}
				</label>
                {if customer.productLevelBean[0].servicesBean}
                  {var item=customer.productLevelBean[0].servicesBean /}
                  {foreach service in item}
                    {var currSSRCode = item[service_index].specialRequirementsInfoBean.ssrCode /}
                    /*{if JSONData.parameters.SITE_MCI_SSR_CANT_CI_ALON.toUpperCase().search(currSSRCode) != "-1" }
                      <span class="checkindenained">${label.PaxSSRCantChkInAlone}</span>
                    {/if}*/
                    {if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
                      <span class="checkindenained">${label.SSRNotNotAllowed}</span>
                    {/if}
                  {/foreach}
                {/if}
                {if !paxPT}
                    <span class="checkindenained">${label.TicketNotAssociated}</span>
                {/if}
				{if !customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
					  <span class="checkindenained">${label.PaprttLstNmMismatch}</span>
				{/if}
				{if customer.hasMultipleNat}
					  <span class="checkindenained">${label.PaxMultiNationality}</span>
				{/if}
				{if customer.custRestrictedSSR}
					  <span class="checkindenained">${jQuery.substitute(label.SSRNotNotAllowed,this.parameters.SITE_MCI_RESTCTD_SSR_CHKN)|escapeForHTML:false}</span>
				{/if}
                {if isInfantToPax}
				  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT) /}
				{/if}
              </li>
                {else/}
            {if customer.customerDetailsType == "A"}
              <li>
                <input disabled="disabled" type="checkbox" data-id="pax0${customer_index}" id="cust_${customer_index}" name="${customer_index}" value="${customer_index}"
                   {on click { fn:"paxSelection", args: {cust : customer_index, prod: product_index}}/} />
                <label for="cust_${customer_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
                {if paxPT}
                                  {if paxSBY}
                                    <span class="checkedinTripsPage">${label.StandBy}</span>
                                  {elseif paxCheckedin /}
                                    <span class="checkedinTripsPage">${label.CheckedIn}</span>
                                  {/if}
                                {/if}
                </strong></label>
                                {if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT) /}
                                {/if}
              </li>
            {/if}
            {if customer.customerDetailsType == "C"}
              <li class="child">
                <input disabled="disabled" type="checkbox" data-id="pax0${customer_index}" id="cust_${customer_index}" value="${customer_index}"
                  {on click { fn:"paxSelection", args: {cust : customer_index, prod: product_index}}/} />
                <label for="cust_${customer_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
                {if paxPT}
                                  {if paxSBY}
                                    <span class="checkedinTripsPage">${label.StandBy}</span>
                                  {elseif paxCheckedin /}
                                    <span class="checkedinTripsPage">${label.CheckedIn}</span>
                                  {/if}
                  </strong></label>
                                {if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT) /}
                                {/if}

              </li>
            {/if}
          {/if}
        {/if}
      {/if}
	  {/if}
    {/foreach}
        </ul>
      </section>
    </article>
     <footer class="buttons">
      <button type="button" {on click "onContinue"/} class="validation disabled" id="multiPaxSelContinue">${label.Continue}</button>
      <button type="button" class="validation cancel" id="multiPaxSelCancel"
      //{var handlerName = MC.appCtrl.registerHandler(this.onBackClick, this)/}
            {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
  </form>
  {/if}
</section>
{/if}
{var cprResponseForApp = ""/}
{var PNRData = "" /}
{foreach product in productView}
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
  {/foreach}
 {/foreach}
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
	  /*{elseif cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean != undefined /}

				{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.length == undefined}
					{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails && cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails.length > 0}
						{set PNRData = PNRData + "|" + cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails[0].number /}
					{else/}
						{set PNRData = PNRData + "|" + "" /}
					{/if}
				{elseif cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.length > 0 /}
					{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails && cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails.length > 0}
						{set PNRData = PNRData + "|" + cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails[0].number /}
					{else/}
						{set PNRData = PNRData + "|" + "" /}
					{/if}
				{/if}*/
	  {else/}

			{var ffNumber="" /}
			 {foreach eachCust inArray cpr.customerLevel}

				{foreach eachPrd inArray eachCust.productLevelBean}

					{if eachPrd.fqtvInfoBean != undefined}
							{if eachPrd.fqtvInfoBean.length == undefined}
								{if eachPrd.fqtvInfoBean.frequentTravellerDetails && eachPrd.fqtvInfoBean.frequentTravellerDetails.length > 0}
									{set ffNumber=eachPrd.fqtvInfoBean.frequentTravellerDetails[0].number /}
								{/if}
							{elseif eachPrd.fqtvInfoBean.length > 0 /}
								{if eachPrd.fqtvInfoBean[0].frequentTravellerDetails && eachPrd.fqtvInfoBean[0].frequentTravellerDetails.length > 0}
									{set ffNumber=eachPrd.fqtvInfoBean[0].frequentTravellerDetails[0].number /}
				{/if}
							{/if}
						{/if}

			    {/foreach}

			 {/foreach}

			 {if ffNumber == ""}
		{set PNRData = PNRData + "|" + "" /}
	  {else/}
					{set PNRData = PNRData + "|" + ffNumber /}
				{/if}

	  {/if}

	  {if cprInput &&   cprInput.carrier && cprInput.carrier != ""}
		{set PNRData = PNRData + "|" + cprInput.carrier /}

	  /*{elseif cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean != undefined /}

				{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.length == undefined}
					{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails && cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails.length > 0}
						{set PNRData = PNRData + "|" + cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.frequentTravellerDetails[0].carrier /}
					{else/}
						{set PNRData = PNRData + "|" + "" /}
					{/if}
				{elseif cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean.length > 0 /}
					{if cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails && cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails.length > 0}
						{set PNRData = PNRData + "|" + cpr.customerLevel[0].productLevelBean[0].fqtvInfoBean[0].frequentTravellerDetails[0].carrier /}
	  {else/}
		{set PNRData = PNRData + "|" + "" /}
	  {/if}
				{/if}*/
	  {else/}
		{var ffCarrier="" /}
			 {foreach eachCust inArray cpr.customerLevel}

				{foreach eachPrd inArray eachCust.productLevelBean}

					{if eachPrd.fqtvInfoBean != undefined}
							{if eachPrd.fqtvInfoBean.length == undefined}
								{if eachPrd.fqtvInfoBean.frequentTravellerDetails && eachPrd.fqtvInfoBean.frequentTravellerDetails.length > 0}
									{set ffCarrier=eachPrd.fqtvInfoBean.frequentTravellerDetails[0].carrier /}
								{/if}
							{elseif eachPrd.fqtvInfoBean.length > 0 /}
								{if eachPrd.fqtvInfoBean[0].frequentTravellerDetails && eachPrd.fqtvInfoBean[0].frequentTravellerDetails.length > 0}
									{set ffCarrier=eachPrd.fqtvInfoBean[0].frequentTravellerDetails[0].carrier /}
								{/if}
				{/if}
						{/if}

			    {/foreach}

			 {/foreach}

			 {if ffCarrier == ""}
					{set PNRData = PNRData + "|" + "" /}
	  {else/}
					{set PNRData = PNRData + "|" + ffCarrier /}
				{/if}
	  {/if}

	  {if cprInput &&   cprInput.eticketNumber && cprInput.eticketNumber != ""}
		{set PNRData = PNRData + "|" + cprInput.eticketNumber /}
	  /*{elseif cpr.customerLevel[0].productLevelBean[0].ticketsBean != undefined && cpr.customerLevel[0].productLevelBean[0].ticketsBean.length > 0 /}

			{if cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsNumber && cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsNumber != "" && cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsType && typeof cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsType == "string" && cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsType.search(/e/i) != -1}
				{set PNRData = PNRData + "|" + cpr.customerLevel[0].productLevelBean[0].ticketsBean[0].ticketDetailsNumber /}
	  {else/}
		{set PNRData = PNRData + "|" + "" /}
			{/if}*/
	  {else/}
			{var eTicketNum="" /}

			{foreach eachCust inArray cpr.customerLevel}

					{foreach eachPrd inArray eachCust.productLevelBean}

						{if eachPrd.ticketsBean != undefined && eachPrd.ticketsBean.length > 0}
							{if eachPrd.ticketsBean[0].ticketDetailsNumber && eachPrd.ticketsBean[0].ticketDetailsNumber != "" && customer.productLevelBean[0].ticketsBean[0].ticketDetailsType && typeof customer.productLevelBean[0].ticketsBean[0].ticketDetailsType == "string" && customer.productLevelBean[0].ticketsBean[0].ticketDetailsType.search(/e/i) != -1}
								{set eTicketNum = eachPrd.ticketsBean[0].ticketDetailsNumber /}

							{/if}
			{/if}

					{/foreach}
			{/foreach}

			{if eTicketNum == ""}
				{set PNRData = PNRData + "|" + "" /}
	  {else/}
				{set PNRData = PNRData + "|" + eTicketNum /}
	  {/if}

	  {/if}

    {/if}
	<input type="text" value="${PNRData}" id="retrievePNRData" name="retrievePNRData" />
	</div>
/*{if console.log(cprResponseForApp)}{/if}
{if console.log(PNRData)}{/if}*/

</div>
{/macro}
{/Template}