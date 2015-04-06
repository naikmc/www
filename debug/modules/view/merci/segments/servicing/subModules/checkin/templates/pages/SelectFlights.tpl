{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.SelectFlights',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript:true
}}
{macro main()}
{var label = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.SelectFlights.labels /}
{var patternLabel = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.pattern/}
{var flightDetailsLabel = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.FlightDetails/}
{var parameters = this.moduleCtrl.getModuleData().checkIn.MCPRRetrieveMultiPax_A.parameters/}
{var cpr = moduleCtrl.getCPR() /}
{var productView = cpr.customerLevel[0].productLevelBean/}
{var totalSeg = productView.length /}
{var disableProduct = 0 /}
{var allPaxChecked = true/}
{var enableNextLeg = true/}
{var disableContinue = false /}
{var allSsrNotEligible = true /}
{var cprResponseForApp = "" /}
{var cprInput = moduleCtrl.cprInputSQ /}
{var paxRestrictedTicket = false /}
{var selectedPax = moduleCtrl.getSelectedPaxOnly() /}
{var totalPax = cpr.customerLevel.length /}
{var totalSelPax = selectedPax.length /}

{var warnings = moduleCtrl.getWarnings() /}
{var success = moduleCtrl.getSuccess() /}


<div class='sectionDefaultstyle'>
<section>
/* This div is used to display errors related to cpr */
<div id="cprErrorsSelectFlight">
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
  <form id="MSelectFlights_A">
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
            {foreach selPaxDtls in selectedPax}
				{var customer = cpr.customerLevel[selPaxDtls] /}
				{if customer.customerDetailsType != "IN"}
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
						{set infantToPax = selPaxDtls_index /}
						{set infantPrimeId = productIdentifier.primeId /}
					  {/if}
					{/foreach}
				/* End :: To check if infant is associated to pax or not */
				{/foreach} /* End :: Product Iteration */
				/* Start :: Display the Selection box if passenger is eligible to checkin */
				{if !paxCheckedin}
					{if paxPT}
					{var fqtv = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls , 0 , customer.uniqueCustomerIdBean.primeId) /}
					{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls , 0 , customer.uniqueCustomerIdBean.primeId, "Phone") /}
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
			            {if temp.custNumber = selPaxDtls }{/if}
			            {if temp.uniqueCustomerIdBean = customer.uniqueCustomerIdBean}{/if}
						{if moduleCtrl.setPassengerDetails([temp])}{/if}

	              	{/if}
	              	{if fqtv != ""}
                		{set fqtv=fqtv.split("~")[1] /}
              		{/if}
			  /* End :: To Check if passenge is checked in or in standby mode */
						{if customer.customerDetailsType == "A"}
							<li>
								<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
								//{var handlerName = MC.appCtrl.registerHandler(this.loadEditPAXScreen, this, {selectedPax : //selPaxDtls_index})/}
								<button class="secondary edit" type="button" {on click {fn: "loadEditPAXScreen" , args : {selectedPax : selPaxDtls_index}}/} ><span>${label.Edit}</span></button>
								{if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , false , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax") /}
                                {/if}

								{call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
							</li>
						{/if}
						{if customer.customerDetailsType == "C"}
							<li class="child">
								<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
								//{var handlerName = MC.appCtrl.registerHandler(this.loadEditPAXScreen, this, {selectedPax : //selPaxDtls_index})/}
								<button class="secondary edit" {on click {fn: "loadEditPAXScreen" , args : {selectedPax : selPaxDtls_index}}/} type="button"><span>${label.Edit}</span></button>

								{call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
							</li>
						{/if}

					{/if}
                {else/}
						{var fqtv = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls , 0 , customer.uniqueCustomerIdBean.primeId) /}
						{var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls , 0 , customer.uniqueCustomerIdBean.primeId, "Phone") /}
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
								<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
								//{var handlerName = MC.appCtrl.registerHandler(this.loadEditPAXScreen, this, {selectedPax : //selPaxDtls_index})/}
								<button class="secondary edit" {on click {fn: "loadEditPAXScreen" , args : {selectedPax : selPaxDtls_index}}/} type="button"><span>${label.Edit}</span></button>

                                {if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , false , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax") /}
                                {/if}

								{call common.PaxDetilsFlightPage(label,fqtv,Email,phoneNumber) /}
							</li>
						{/if}
						{if customer.customerDetailsType == "C"}
							<li class="child">
								<p for="pax0${selPaxDtls_index}"><strong>${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}</strong></p>
								//{var handlerName = MC.appCtrl.registerHandler(this.loadEditPAXScreen, this, {selectedPax : //selPaxDtls_index})/}


								<button class="secondary edit" {on click {fn: "loadEditPAXScreen" , args : {selectedPax : selPaxDtls_index}}/} type="button"><span>${label.Edit}</span></button>

                                {if isInfantToPax}
                                  {call common.infantMacro(cpr.customerLevel , infantToPax , product_index , false , infantPrimeId , paxCheckedin , label , enableNextLeg , paxPT,"SinglePax") /}
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
				{var checkedinPax = 0 /}
				{var prodCheckedinPax = 0 /}
				{var prodAllPaxChecked=false /}
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
					{if product.checkInOpen && product.flightOpen  && !segmentOccuredInPending}
						<li class="is-checked">
						    {var finalSelPax = null /}
							{set finalSelPax = selectedPax.concat() /}
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
											{set prodCheckedinPax = prodCheckedinPax+1 /}
										  {/if}
										{/if}
										{if legIndicator_temp.indicator == "CST"}
										  {if legIndicator_temp.action == "1"}
											{set paxSBYH_temp = true /}
											{set paxCheckedin_temp = true /}
											{set prodCheckedinPax = prodCheckedinPax+1 /}
										  {/if}
										{/if}
									{/foreach}
								{/foreach}

								/* Start :: To check if all passenger has checkedin or not */
									{if prodCheckedinPax != totalSelPax*totalLegInSegment}
									  {set prodAllPaxChecked = false/}
									{else/}
									  {set prodAllPaxChecked = true/}
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
						  <input type="checkbox" id="flight0${product_index}" data-allPaxCheckedInSegment=${prodAllPaxChecked} onclick="currentElementRef=this" name="${product_index}" {on click { fn:"flightSelection", args: {prod : product_index}}/}
						  {if !enableNextLeg || allPaxChecked || this.segmentBookingStatErr || finalSelPax.length == 0 || disableSegment}disabled{/if}
						  {if enableNextLeg && !allPaxChecked  && !this.segmentBookingStatErr && finalSelPax.length != 0 && !disableSegment}data-stopover="${product.stopOverAllowed}" checked="checked"{/if}
						  {if isInfantToPax} infant="${infantToPax}" product="${product_index}" {/if}
						  value="{if finalSelPax.length == 1}${finalSelPax[0]}{else/}[${finalSelPax}]{/if}"
						  />
						  <label for="flight0${product_index}">
							{call
								common.FlightDetails(
								  product,
								  flightDetailsLabel,
								  patternLabel,
								  "",
								  disableSegment,
                  				  label
								)
							/}
						  </label>
						  <!--<h4>Passengers selected for check-in:</h4>-->
						  <ul data-info="pax-sub-list">
							  {foreach selPaxDtls in selectedPax}
								{var customer = cpr.customerLevel[selPaxDtls] /}
								{var customer_index = selPaxDtls_index /}
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
								//{foreach productPax in customer.productLevelBean} /* Start :: Product Iteration */
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
									{var paxRestrictedInCurrSegmentErr = false /}
									/* Start :: Product Iteration */
									{foreach productPax in customer.productLevelBean}
										{if productPax_index == product_index && !productPax.paxTicketEligible}
											{set paxRestrictedInCurrSegmentErr = true /}
										{/if}
									{/foreach}
									/* End :: Product Iteration */
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
								//{/foreach} /* End :: Product Iteration */
								/* Start :: Display the Selection box if passenger is eligible to checkin */
								{if !paxCheckedin}
							  /* End :: To Check if passenge is checked in or in standby mode */
										{if customer.customerDetailsType == "A"}
											<li class="pax">
												${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
												{if customer.productLevelBean[0].servicesBean}
													{var item=customer.productLevelBean[0].servicesBean /}
													{foreach service in item}
														{var currSSRCode = item[service_index].specialRequirementsInfoBean.ssrCode /}
														/*{if this.parameters.SITE_MCI_SSR_CANT_CI_ALON.toUpperCase().search(currSSRCode) != "-1" }
															<span class="checkindenained">${label.PaxSSRCantChkInAlone}</span>
														{/if}*/
														{if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
															<span class="checkindenained">${label.SSRNotNotAllowed}</span>
														{/if}
													{/foreach}
												{/if}
												{if paxRestrictedInCurrSegmentErr}
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
												${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
												{if customer.productLevelBean[0].servicesBean}
													{var item=customer.productLevelBean[0].servicesBean /}
													{foreach service in item}
														{var currSSRCode = item[service_index].specialRequirementsInfoBean.ssrCode /}
														/*{if this.parameters.SITE_MCI_SSR_CANT_CI_ALON.toUpperCase().search(currSSRCode) != "-1" }
															<span class="checkindenained">${label.PaxSSRCantChkInAlone}</span>
														{/if}*/
														{if currSSRCode == "CBBG" || currSSRCode == "STCR" || currSSRCode == "EXST" || currSSRCode == "UMNR"}
															<span class="checkindenained">${label.SSRNotNotAllowed}</span>
														{/if}
													{/foreach}
												{/if}
												{if paxRestrictedInCurrSegmentErr}
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
								{else/}
										{if customer.customerDetailsType == "A"}
											<li class="pax">
												${jQuery.substitute(label.PassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
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
												${jQuery.substitute(label.ChildPassengerName, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])|escapeForHTML:false}
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
						</ul>
						{if this.segmentBookingStatErr }
						   </br>
						   <span class="checkindenained" style="padding-left: 35px;">${label.StatErrMsg}</span>
					    {/if}
						{if !eligibility}
								<span class="checkindenained" style="padding-left: 35px;">${errorMsg}</span>
						{else/}
							{if !enableNextLeg}
								<span class="checkindenained" style="padding-left: 35px;">${label.DisCheckin}</span>
							{/if}
						{/if}
					</li>
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
					{if !product.checkInOpen || !product.flightOpen  || showFurthurSegments}
						{set showFurthurSegments = true /}
						<li>
						  <label for="flight0${product_index}">
							{call
								common.FlightDetails(
								  product,
								  flightDetailsLabel,
								  patternLabel,
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
//        	<li>
//                	<p class="onoffswitch-general-label">
//                	//{var handlerName = MC.appCtrl.registerHandler(this.loadDRGScreen, this)/}
//                  	${label.DangerousGoodsMsg} <a {on click "loadDRGScreen"/} style="text-decoration:underline" href="javascript:void(0)">${label.DangerousGoodsLbl} </a>
//                	</p>
//                	<div class="onoffswitch">
//						<input type="checkbox" class="onoffswitch-checkbox" id="myonoffswitch" {on click { fn:"dgrGoodsCheck", args: {}}/}>
//						<label class="onoffswitch-label" for="myonoffswitch">
//							<div class="onoffswitch-inner">
//								<div class="onoffswitch-active">Yes</div>
//								<div class="onoffswitch-inactive">No</div>
//							</div>
//							<div class="onoffswitch-switch"></div>
//						</label>
//					</div>
//       		</li>
//        </ul>
//      </section>
// </article>
    <footer class="buttons">
      <button type="button" class="validation" id="SlctFlgtsCont" {on click "onContinue"/}>${label.Continue}</button>
      <button type="button" class="validation cancel"
                {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
  </form>
</section>
</div>
{/macro}
{/Template}
