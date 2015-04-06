{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.CPRIdentificationSinglePax',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript:true
}}
{macro main()}
{var label = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveSinglePax_A.labels /}
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
{var totalSeg = productView.length /}
{var totalPax = cpr.customerLevel.length /}
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

{var disableProduct = 0 /}
{var allPaxChecked = true/}
{var enableNextLeg = true/}
{var disableContinue = false /}
{var allSsrNotEligible = true /}
{var paxRestrictedTicket = false /}
{var psprtMismatch = false /}
{var checkinFlightCnt = 0 /}

{var warnings = moduleCtrl.getWarnings() /}
{var success = moduleCtrl.getSuccess() /}


<div class='sectionDefaultstyle'>
<section>
/* This div is used to display errors related to cpr */
<div id="cprErrors">
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
</div>
/* This div is used to display errors related to nationality edits occured on nationality page, as it is the fall back page */
<div id="nationalityErrors"></div>
/* This div is used to display errors related to regulatory edits occured on regulatory page, as it is the fall back page */
<div id="RegulatoryErrors"></div>
  <form id="uniqueCprIdentificationSinglePaxTpl">
   <nav class="breadcrumbs">
      <ul>
        <li class="active"><span>1</span><span class="bread"></span></li>
        <li><span>2</span></li>
        <li><span>3</span></li>
        <li><span>4</span></li>
      </ul>
    </nav>
    <article class="panel list">
      <header>
        <h1>${label.PassengersToCheckin}
			<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="section1"><span>${label.Toggle}</span></button>
        </h1>
      </header>
      <section id="section1">
          <ul class="checkin-list" data-info="pax-list">
            {foreach customer in cpr.customerLevel}
        {if customer.customerDetailsType != "IN"}
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
              {/if}
              {if legIndicator.indicator == "CST"}
                {if legIndicator.action == "1"}
                {set paxSBY = true /}
                {set paxCheckedin = true /}
                {set checkedinPax = checkedinPax+1 /}
                {set checkedinPaxCnt = checkedinPaxCnt+1 /}
				{set checkinFlightCnt = checkinFlightCnt+1 /}
                {/if}
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
          {if checkedinPax != totalPax*totalLegInSegment}
            {set allPaxChecked = false/}
          {else/}
            {set allPaxChecked = true/}
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
        {/foreach} /* End :: Product Iteration */
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
        /* Start :: Display the Selection box if passenger is eligible to checkin */

        {if !paxCheckedin}
        /* End :: To Check if passenge is checked in or in standby mode */
            {var fqtv = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId) /}
			{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId, "Phone") /}
			{var phoneNumber="" /}
			{var Email="" /}
          	{if phoneandEmail != ""}
            	{set phoneNumber=phoneandEmail.split("~")[0].substring(0,4)+"-"+phoneandEmail.split("~")[0].substring(4) /}
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
          	{if fqtv != ""}
        		{set fqtv=fqtv.split("~")[1] /}
      		{/if}
            {if customer.customerDetailsType == "A"}
              <li>
                <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                <button class="secondary edit" type="button" {on click { fn:"loadEditPAXScreen", args: {selectedPax : customer_index}}/} ><span>${label.Edit}</span></button>
                {if !paxPT || !infantPaxPT}
                    {set paxRestrictedTicket = true /}
                {/if}
				{if !customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
					  {set psprtMismatch = true /}
					  <span class="checkindenained">${label.PaprttLstNmMismatch}</span>
				{/if}
				{var tempObj = {"psprtMismatch":false} /}
                {if isInfantToPax}
				  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax",tempObj) /}
				{/if}
				{set psprtMismatch = tempObj.psprtMismatch /}
				{call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
              </li>
            {/if}
            {if customer.customerDetailsType == "C"}
              <li class="child">
                <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                <button class="secondary edit" type="button" {on click { fn:"loadEditPAXScreen", args: {selectedPax : customer_index}}/}><span>${label.Edit}</span></button>
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
                    <!--<span class="checkindenained">${label.TicketNotAssociated}</span>-->
                {/if}
				{if !customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
					  {set psprtMismatch = true /}
					  <span class="checkindenained">${label.PaprttLstNmMismatch}</span>
				{/if}
				{call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
              </li>
            {/if}
                {else/}
            {var fqtv = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId) /}
			{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(customer_index , 0 , customer.uniqueCustomerIdBean.primeId, "Phone") /}
			{var phoneNumber="" /}
			{var Email="" /}
          	{if phoneandEmail != ""}
            	{set phoneNumber=phoneandEmail.split("~")[0].substring(0,4)+"-"+phoneandEmail.split("~")[0].substring(4) /}
            	{set Email=phoneandEmail.split("~")[1] /}
          	{/if}
          	{if fqtv != ""}
        		{set fqtv=fqtv.split("~")[1] /}
      		{/if}

            {if customer.customerDetailsType == "A"}
              <li>
                <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                <button class="secondary edit" type="button" {on click { fn:"loadEditPAXScreen", args: {selectedPax : customer_index}}/}><span>${label.Edit}</span></button>
                {if paxPT && ssrEligible}
                                  {if paxSBY}
                                    <span class="greenHighlightIcon">${label.StandBy}</span>
                                  {elseif paxCheckedin /}
                                    <span class="checkedin">${label.CheckedIn}</span>
                                  {/if}
                                {elseif !ssrEligible/}
                                  <span class="checkindenained">${label.TicketNotAssociated}</span>
                                {elseif !paxPT || !infantPaxPT/}
                                  {set paxRestrictedTicket = true /}
                                  <!--<span class="checkindenained">${label.ResChkn}</span>-->
                                {/if}
								{if !customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
									  <span class="checkindenained">${label.PaprttLstNmMismatch}</span>
								{/if}
                                {if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax") /}
                                {/if}

                                {call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
              </li>
            {/if}
            {if customer.customerDetailsType == "C"}
              <li class="child">
                <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                <button class="secondary edit" type="button" {on click { fn:"loadEditPAXScreen", args: {selectedPax : customer_index}}/}><span>${label.Edit}</span></button>
                {if paxPT && ssrEligible}
                                  {if paxSBY}
                                    <span class="greenHighlightIcon">${label.StandBy}</span>
                                  {elseif paxCheckedin /}
                                    <span class="greenHighlightIcon">${label.CheckedIn}</span>
                                  {/if}
                                {elseif !ssrEligible/}
                                  <span class="greenHighlightIcon">${label.ResChkn}</span>
                                {elseif !paxPT || !infantPaxPT/}
                                  {set paxRestrictedTicket = true /}
								  <!--<span class="greenHighlightIcon">${label.ResChkn}</span>-->
                                {/if}
								{if !customer.customer.productLevelBean[0].psprtLstNameCheckWithCustLastName}
									  <span class="checkindenained">${label.PaprttLstNmMismatch}</span>
								{/if}
								{if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , paxCheckedin , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax") /}
                                {/if}

                                {call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
              </li>
            {/if}
          {/if}
      {/if}
      {/foreach}
          </ul>
      </section>
    </article>
	/* start: checking if any one product is open */
	{var anyOneSegOpenForCheckin = false /}
	{foreach product inArray productView}
		{if product.flightOpen}
			{set anyOneSegOpenForCheckin = true /}
		{/if}
	{/foreach}
	/* end: checking if any one product is open */
	{var segmentOccuredInPending = false /}
	{if anyOneSegOpenForCheckin}
    <article class="panel list">
      <header>
        <h1 class="checkin-ready">${label.FlightsOpenCheckin}</h1>
      </header>
      <section id="section4" data-aria-hidden="false">
          <ul class="checkin-list" data-info="flights-ready-list">
            {var isUserError = false /}
      {var checkedinPaxCnt = 0 /}
      /* Start Loop for segments */
      {foreach product inArray productView}
		{var paxRestrictedInCurrSegmentErr = false /}
		{if cpr.customerLevel.length == 1}
				/* Start :: Product Iteration */
				{foreach productPax in cpr.customerLevel[0].productLevelBean}
					{if productPax_index == product_index && !productPax.paxTicketEligible}
						{set paxRestrictedInCurrSegmentErr = true /}
					{/if}
				{/foreach}
				/* End :: Product Iteration */
		{else/}
			{var adtOrChdPaxTicket = false /}
			{foreach productPax in cpr.customerLevel[0].productLevelBean}
				{if productPax_index == product_index && !productPax.paxTicketEligible}
					{set adtOrChdPaxTicket = true /}
				{/if}
			{/foreach}
			{var infPaxTicket = false /}
			{foreach productPax in cpr.customerLevel[1].productLevelBean}
				{if productPax_index == product_index && !productPax.paxTicketEligible}
					{set infPaxTicket = true /}
				{/if}
			{/foreach}
			{if adtOrChdPaxTicket || infPaxTicket}
				{set paxRestrictedInCurrSegmentErr = true /}
			{/if}
		{/if}
		{set paxRestrictedTicket = paxRestrictedInCurrSegmentErr /}
        {var checkedinPax = 0 /}
        /* Start :: Display if Segment has not flown */
        {if !product.flown}
          {var eligibility = this.isFlightEligible(product,product_index) /}
          {if !eligibility}
            {set disableSegment = true /}
            {set disableProduct = disableProduct + 1 /}
          {else/}
            {if enableNextLeg}
              {set disableSegment = false /}
            {else/}
              {set disableSegment = true /}
            {/if}
          {/if}
          {if product.checkInOpen  && product.flightOpen  && !segmentOccuredInPending}
			{var finalSelPax = new Array() /}
			{var finalSelPaxTemp = finalSelPax.push("0") /}
			{var finalSelPaxTemp = finalSelPax.push("1") /}
			{set finalSelPax = finalSelPax.concat() /}
            <li class="is-checked">
              <input type="checkbox" id="flight0${product_index}" data-allPaxCheckedInSegment=${this.allPaxCheckedInSegment} name="${product_index}" onclick="currentElementRef=this"
              {on click { fn:"flightSelection", args: {prod : product_index}}/}
			  {if !enableNextLeg || paxRestrictedTicket || this.segmentBookingStatErr || psprtMismatch || disableSegment}disabled{/if}
			  {if enableNextLeg && !paxRestrictedTicket && !this.segmentBookingStatErr && !disableSegment && !psprtMismatch }data-stopover="${product.stopOverAllowed}" checked="checked"{/if}
			  {if isInfantToPax}
				infant="${infantToPax}" product="${product_index}" {/if} value="{if cpr.customerLevel.length == 1}0{else/}[${finalSelPax}]
			  {/if}"
			  />
              <label for="flight0${product_index}">
              {call
                common.FlightDetails(
                  product,
                  label.FlightDetails,
                  label.pattern,
                  "",
                  disableSegment,
                  label
                )
              /}
              </label>
              <!--<h4>Passengers selected for check-in:</h4>-->
              <ul data-info="pax-sub-list">
                {foreach customer in cpr.customerLevel}
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
                        {/if}
                      {/if}
                      {if legIndicator.indicator == "CST"}
                        {if legIndicator.action == "1"}
                        {set paxSBY = true /}
                        {set paxCheckedin = true /}
                        {set checkedinPax = checkedinPax+1 /}
                        {set checkedinPaxCnt = checkedinPaxCnt+1 /}
                        {/if}
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
                  {if checkedinPax != totalPax*totalLegInSegment}
                    {set allPaxChecked = false/}
                  {else/}
                    {set allPaxChecked = true/}
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

                /* Start :: Display the Selection box if passenger is eligible to checkin */
                {if !paxCheckedin}
                /* End :: To Check if passenge is checked in or in standby mode */
                    {if customer.customerDetailsType == "A"}
                      <li class="pax">
                        ${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
                      </li>
					  {if isInfantToPax}
                          {set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
						  <li class="pax infant">
							${jQuery.substitute(label.PassengerName, [cpr.customerLevel[associatedInfantIndex].otherPaxDetailsBean[0].givenName, cpr.customerLevel[associatedInfantIndex].customerDetailsSurname])|escapeForHTML:false}
							<i class="textSmaller">(Infant)</i>
						  </li>
                      {/if}
                    {/if}
                    {if customer.customerDetailsType == "C"}
                      <li class="pax child">
                        <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                      </li>
					  {if isInfantToPax}
                          {set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
						  <li class="pax infant">
							${jQuery.substitute(label.PassengerName, [cpr.customerLevel[associatedInfantIndex].otherPaxDetailsBean[0].givenName, cpr.customerLevel[associatedInfantIndex].customerDetailsSurname])|escapeForHTML:false}
							<i class="textSmaller">(Infant)</i>
						  </li>
                      {/if}
                    {/if}
                {else/}
                    {if customer.customerDetailsType == "A"}
                      <li class="pax">
                        <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                        {if paxPT && ssrEligible}
                          {if paxSBY}
                          <span class="greenHighlightIcon">${label.StandBy}</span>
                          {elseif paxCheckedin /}
                          <span class="checkedin">${label.CheckedIn}</span>
                          {/if}
                        {elseif !ssrEligible/}
                          <span class="checkindenained">${label.TicketNotAssociated}</span>
                        {elseif !paxPT/}
                          <span class="checkindenained">${label.TicketNotAssociated}</span>
                        {/if}
                      </li>
					  {if isInfantToPax}
                          {set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
						  <li class="pax infant">
							${jQuery.substitute(label.PassengerName, [cpr.customerLevel[associatedInfantIndex].otherPaxDetailsBean[0].givenName, cpr.customerLevel[associatedInfantIndex].customerDetailsSurname])|escapeForHTML:false}
							<i class="textSmaller">(Infant)</i>
						  </li>
                      {/if}
                    {/if}
                    {if customer.customerDetailsType == "C"}
                      <li class="pax child">
                        <p for="pax0${customer_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
                        {if paxPT && ssrEligible}
                          {if paxSBY}
                          <span class="greenHighlightIcon">${label.StandBy}</span>
                          {elseif paxCheckedin /}
                          <span class="greenHighlightIcon">${label.CheckedIn}</span>
                          {/if}
                        {elseif !ssrEligible/}
                          <span class="greenHighlightIcon">${label.TicketNotAssociated}</span>
                        {elseif !paxPT/}
                          <span class="greenHighlightIcon">${label.TicketNotAssociated}</span>
                        {/if}
                      </li>
					  {if isInfantToPax}
                          {set associatedInfantIndex = this.getInfantIndex(infantToPax,product_index,infantPrimeId) /}
						  <li class="pax infant">
							${jQuery.substitute(label.PassengerName, [cpr.customerLevel[associatedInfantIndex].otherPaxDetailsBean[0].givenName, cpr.customerLevel[associatedInfantIndex].customerDetailsSurname])|escapeForHTML:false}
							<i class="textSmaller">(Infant)</i>
						  </li>
                      {/if}
                    {/if}
                {/if}
              {/foreach}
				{if this.segmentBookingStatErr }
					</br>
					<span class="checkindenained" style="padding-left: 35px;">${label.StatErrMsg}</span>
				{/if}
				{if !eligibility}
					</br>
					<span class="checkindenained" style="padding-left: 0px;padding-top:5px;">${errorMsg}</span>
				{else/}
					{if paxRestrictedTicket}
						</br>
						<span class="checkindenained" style="padding-left: 0px;padding-top:5px;">${label.ResTkt}</span>
					{/if}
					{if !enableNextLeg}
						</br>
						<span class="checkindenained" style="padding-left: 0px;padding-top:5px;">${label.DisCheckin}</span>
					{/if}
				{/if}
              </li>
            </ul>
		  {else/}
				{set segmentOccuredInPending = true /}
          {/if}
        {/if}
        /* Start :: To test weather we can enable the sequential check or not */
        {var onward = ''/}
        {var current = ''/}
        {var cpid = ''/}
        {var lastSegmentofJour = false /}
        {if customer.productLevelBean[product_index].productIdentifiersBean}
          {foreach identifier in customer.productLevelBean[product_index].productIdentifiersBean}
            {if identifier.referenceQualifier == 'OID'}
              {set current = identifier.primeId/}
            {elseif identifier.referenceQualifier == 'DID'/}
              {set cpid = identifier.primeId /}
            {/if}
          {/foreach}
        {/if}
        {if totalSeg > product_index+1}
          {if customer.productLevelBean[product_index+1].productIdentifiersBean}
              {foreach identifier in customer.productLevelBean[product_index+1].productIdentifiersBean}
                {if identifier.referenceQualifier == 'DID'}
                  {set onward = identifier.primeId/}
                {/if}
              {/foreach}
          {/if}
        {/if}


        {if onward == current}
          {set enableNextLeg = true /}
        {elseif allPaxChecked/}
          {set enableNextLeg = true /}
        {else/}
          /* Changed from false to true to workaround for showing all the segments selected. Future, when we do journey calculation we have to consider this case */
		  {set enableNextLeg = true /}
        {/if}
      /* End :: To test weather we can enable the sequential check or not */
      {/foreach}
          </ul>
      </section>
    </article>
	{/if}
  /* Start Loop for segments */
  {var flightAvailInPendingCheckin = false /}
  {foreach product inArray productView}
    {var checkedinPax = 0 /}
    /* Start :: Display if Segment has not flown */
    {if !product.flown}
      {var eligibility = this.isFlightEligible(product,product_index) /}
      {if !eligibility}
        {set disableSegment = true /}
        {set disableProduct = disableProduct + 1 /}
      {else/}
        {if enableNextLeg}
          {set disableSegment = false /}
        {else/}
          {set disableSegment = true /}
        {/if}
      {/if}
      {if !product.checkInOpen || !product.flightOpen}
        {set flightAvailInPendingCheckin = true /}
      {/if}
    {/if}
  {/foreach}
  {if flightAvailInPendingCheckin}
    <article class="panel list">
      <header class="disabled">
        <h1>${label.FlightsPendingCheckin}
          <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="section5"><span>${label.Toggle}</span></button>
        </h1>
      </header>
      <section id="section5" data-aria-hidden="true">
          <ul class="checkin-list" data-info="flights-pending-list">
            {var isUserError = false /}
      {var checkedinPaxCnt = 0 /}
	  {var showFurthurSegments = false /}
      /* Start Loop for segments */
      {foreach product inArray productView}
        {var checkedinPax = 0 /}
        /* Start :: Display if Segment has not flown */
        {if !product.flown}
          {var eligibility = this.isFlightEligible(product,product_index) /}
          {if !eligibility}
            {set disableSegment = true /}
            {set disableProduct = disableProduct + 1 /}
          {else/}
            {if enableNextLeg}
              {set disableSegment = false /}
            {else/}
              {set disableSegment = true /}
            {/if}
          {/if}
          {if !product.checkInOpen  || !product.flightOpen || showFurthurSegments}
            {set showFurthurSegments = true /}
			<li>
              <label for="flight0${product_index}">
              {call
                common.FlightDetails(
                  product,
                  label.FlightDetails,
                  label.pattern,
                  "",
                  disableSegment,
                  label
                )
              /}
              {if !eligibility}

				<span class="checkindenained flightpendingerrDisp">${errorMsg}</span>
              {else/}
                {if !enableNextLeg}

				  <span class="checkindenained flightpendingerrDisp">${label.DisCheckin}</span>
                {/if}
              {/if}
              {if !eligibility}
                {if isCurrentPrime}
                  {set enableNextLeg = false /}
                {/if}
              {/if}
              </label>
            </li>
          {/if}
        {/if}
      {/foreach}
          </ul>
      </section>
    </article>
  {/if}
//    <article class="panel list">
//      <header>
//        <h1>${label.DgrGoods}</h1>
//      </header>
//      <section>
//        <ul class="checkin-list" data-info="dangerous-goods">
//          <li>
//                  <p class="onoffswitch-general-label">
//                    ${label.DangerousGoodsMsg}   <a {on click "loadDRGScreen" /} style="text-decoration:underline" href="javascript:void(0)" >${label.DangerousGoodsLbl}</a>
//                  </p>
//                  <div class="onoffswitch">
//            <input type="checkbox" class="onoffswitch-checkbox" id="myonoffswitch" {on click { fn:"dgrGoodsCheck", args: {}}/}>
//            <label class="onoffswitch-label" for="myonoffswitch">
//              <div class="onoffswitch-inner">
//                <div class="onoffswitch-active">Yes</div>
//                <div class="onoffswitch-inactive">No</div>
//              </div>
//              <div class="onoffswitch-switch"></div>
//            </label>
//          </div>
//          </li>
//        </ul>
//      </section>
// </article>
    <footer class="buttons">
      <button type="button" formaction="APIS.html" class="validation" id="flightSelContinue" {on click "onContinue"/}>${label.Continue}</button>
      <button type="button" class="validation cancel"
                {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
  </form>
</section>
/* this is for the SQ specific web app that is being created */
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
				{else /}
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
				{else /}
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
			{else /}
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
