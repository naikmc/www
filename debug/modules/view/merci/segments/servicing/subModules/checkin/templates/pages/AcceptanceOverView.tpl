{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.AcceptanceOverView',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}

     /*
     * Related to load specific pax in seatmap
     * */
    {if !moduleCtrl.getoriginalSelectedCPR()}

      {if moduleCtrl.setoriginalSelectedCPR(moduleCtrl.getSelectedPax())}{/if}

    {/if}
    {if moduleCtrl.setSelectedPax(moduleCtrl.getoriginalSelectedCPR())}{/if}
	{var pageData = this.moduleCtrl.getModuleData().checkIn/}
    {var label = this.moduleCtrl.getModuleData().checkIn.MAcceptanceOverview_A.labels /}
	{var parameters = this.moduleCtrl.getModuleData().checkIn.MAcceptanceOverview_A.parameters/}
	{var tripPattern = this.moduleCtrl.getModuleData().checkIn.MAcceptanceOverview_A.TripPattern/}
    {var cpr = moduleCtrl.getCPR() /}
    {var selectedcpr = moduleCtrl.getSelectedPax() /}
    {var productView = cpr.customerLevel[0].productLevelBean/}
    {var warnings = moduleCtrl.getWarnings() /}
{var success = moduleCtrl.getSuccess() /}

 <div class='sectionDefaultstyle sectionspecificAcceptanceOverviewtpl'>

<section>
 <!-- <form> -->

{if productView != null}
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
      </div>

  <nav class="breadcrumbs">
      <ul>
        <li><span>1</span></li>
        <li><span>2</span></li>
        <li class="active"><span>3</span><span class="bread"></span></li>
        <li><span>4</span></li>
      </ul>
    </nav>

  {var product = "" /}
  {foreach selection in  selectedcpr}

       {var seat = "" /}
       {var product = productView[selection.product] /}
       <article class="panel">


       <header>
      <h1>${jQuery.substitute(label.PanelTitle, [product.operatingFlightDetailsBoardPointInfo.city, product.operatingFlightDetailsOffPointInfo.city])}
            </h1>
       </header>

       <section>
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
                  /}</time>
              <time datetime="07:35">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      product.operatingFlightDetailsBoardPoint,
                      "",
                      "STD",
                      tripPattern.Time
                    )
                  /}</time>
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
                  /}</time>
              <time datetime="11:55">{call
                    common.dateTimeMacro(
                      product.legLevelBean,
                      "",
                      product.operatingFlightDetailsOffPoint,
                      "STA",
                      tripPattern.Time
                    )
                  /}</time>
              <span>${product.operatingFlightDetailsOffPointInfo.city}</span> <span>${product.operatingFlightDetailsOffPointInfo.city}, ${product.operatingFlightDetailsOffPointInfo.airport} <abbr>(${product.operatingFlightDetailsOffPoint})</abbr></span> <span style="display:block"><strong>{call common.newTerminalMacro(product.legLevelBean , product.operatingFlightDetailsOffPoint, label) /}</strong></span>
        </p>

      </div>
      <div class="details">
            <ul>
              <li class="fare-family"><span class="label">${label.Flight}:</span> <span class="data"><strong>${product.operatingFlightDetailsMarketingCarrier}${product.operatingFlightDetailsFlightNumber}</strong> {if product.legLevelBean.length == 1}(${label.Direct}){else /}(${label.InDirect}){/if}</span></li>
              /*<li><a {on click "showRegulatoryPage" /} style="text-decoration:underline">${label.ViewAllInformation}</a></li>
              <li class="duration"><span class="label">${label.Duration}:</span> <span class="data">{call
                    common.dateDiff(
                      product.legLevelBean[0].legTimeBean[0].json,
                      product.legLevelBean[0].legTimeBean[2].json,
                      label.DateDiff
                    )
                  /}</span></li>*/
            </ul>
            </div>

      </section>
    {if !product.flown}
  {var seat = "" /}
      <section>
      <header>
          <h2 class="subheader">
            <span>${label.PassengerDetails}</span>
          <button aria-hidden="false" data-aria-controls="TSservices${selection.product}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>${label.Toggle}</span></button>
          </h2>
        </header>

          <div aria-hidden="false" id="TSservices${selection.product}" style="display: block;">

            <!--<p class="services-checked-label">Select services to view or modify:</p>-->

           /* <ul class="services-checked">
        {if product.bookingStatusDetailsBean && product.bookingStatusDetailsBean.statusCodes[0] == "HK"}
        {var customerID="" /}
       {var seatDetails="" /}
        {foreach customerInd inArray selection.customer}
              {foreach productIden in cpr.customerLevel[customerInd].productLevelBean[selection.product].productIdentifiersBean}
                            // If a customer is associated with an infant, set all the values needed
                            {if productIden.referenceQualifier == "JID"}

                           {elseif productIden.referenceQualifier == "DID" /}
                              {set customerID = productIden.primeId /}
                            {/if}
              {/foreach}
        {set seatDetails = moduleCtrl.getSeat(customerInd , selection.product , customerID) /}
        {/foreach}
        //{var handlerName = MC.appCtrl.registerHandler(this.onSeatMapClick, this, {product : selection.product, seat:seatDetails})/}
              {if this.parameters.SITE_MCI_GRP_OF_AIRLINES.concat(","+this.parameters.SITE_MCI_OP_AIRLINE).split(",").indexOf(cpr.customerLevel[0].productLevelBean[selection.product].operatingFlightDetailsMarketingCarrier) == "-1" && this.parameters.SITE_MCI_GRP_OF_AIRLINES.concat(this.parameters.SITE_MCI_OP_AIRLINE) != ""}
                <li data-service="seat"><a href="javascript:void(0)" class="secondary disabled">${label.Seat}</a></li>
              {else /}
                <li data-service="seat"><a href="javascript:void(0)" {on click {fn: "onSeatMapClick" , args : {product : selection.product, seat:seatDetails}}/} class="secondary">${label.Seat}</a></li>
             {/if}

              <!--<li data-service="bag"><a href="javascript:void(0)" class="secondary disabled">Bags</a></li>
              <li data-service="meal"><a href="javascript:void(0)" class="secondary disabled">Meals</a></li>-->

        {else /}
        <li data-service="seat"><a href="javascript:void(0)" class="secondary disabled">${label.Seat}</a></li>
        <!--<li data-service="bag"><a href="javascript:void(0)" class="secondary disabled">Bags</a></li>
        <li data-service="meal"><a href="javascript:void(0)" class="secondary disabled">Meals</a></li>-->
        {/if}
          </ul>*/

            <ul class="services-pax">
              {var typeOfPax="" /}
        {var custId = "" /}
              {foreach customerIndex inArray selection.customer} /* Start :: Loop into all Passengers */
{var customer = cpr.customerLevel[customerIndex] /}
{if customer.customerDetailsType != "IN"}

{var paxPT = true /}
      {if customer.paxEligible && customer.oruBkingElgibty}
        {set paxPT = true /}
      {else/}
        {set paxPT = false /}
      {/if}

        {var isInfantToPax = false /}
            {var infantToPax = "" /}
            {var infantPrimeId = "" /}

        {foreach productIdentifier in cpr.customerLevel[customerIndex].productLevelBean[selection.product].productIdentifiersBean}
                            /* If a customer is associated with an infant, set all the values needed */
                            {if productIdentifier.referenceQualifier == "JID"}

                              {set isInfantToPax = true /}
                              {set infantToPax = customerIndex /}
                              {set infantPrimeId = productIdentifier.primeId /}

                            {elseif productIdentifier.referenceQualifier == "DID" /}
                              {set custId = productIdentifier.primeId /}
                            {/if}
              {/foreach}


              {if customer.customerDetailsType == "C"}
                <li class="child">
                {set typeOfPax="C" /}
                {elseif customer.customerDetailsType == "IN"/}
                <li class="infant">
                {set typeOfPax="IN" /}
                {elseif customer.customerDetailsType == "A"/}
                {set typeOfPax="A" /}
                <li>
              {/if}
                {if typeOfPax == "A"}
				    {if customer.otherPaxDetailsBean}
						{if customer.otherPaxDetailsBean[0].title}
							<h4>
							 ${jQuery.substitute(label.PaxName, [customer.otherPaxDetailsBean[0].title,customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}
							 <button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customerIndex_index}}/}><span>${label.Edit}</span></button>
							</h4>
						{else/}
							<h4>
							 ${jQuery.substitute(label.PaxName, ["",customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])}
							 <button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customerIndex_index}}/}><span>${label.Edit}</span></button>
							</h4>
						{/if}
                    {else/}
						<h4>
							 ${jQuery.substitute(label.PaxName, ["","", customer.customerDetailsSurname])}
							 <button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customerIndex_index}}/}><span>${label.Edit}</span></button>
						</h4>
					{/if}

					{var fqtv = moduleCtrl.getPaxDetailsForPrefill(customerIndex , 0 , customer.uniqueCustomerIdBean.primeId) /}

					{if fqtv != ""}
						{set fqtv = fqtv.split("~")[1] /}
						<dl>
							<dt>${label.FFNumber}: </dt>
							<dd> ${fqtv}</dd>
						</dl>
					{/if}
                {else /}
                  {if customer.otherPaxDetailsBean}
                    <h4>
						${jQuery.substitute(label.PaxNameInfant, [customer.otherPaxDetailsBean[0].givenName, customer.customerDetailsSurname])} <i class="textSmaller">(Child)</i>
						<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customerIndex_index}}/}><span>${label.Edit}</span></button>
					</h4>
                  {else /}
                    <h4>
						${jQuery.substitute(label.PaxNameInfant, ["", customer.customerDetailsSurname])} <i class="textSmaller">(Child)</i>
						<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : customerIndex_index}}/}><span>${label.Edit}</span></button>
					</h4>
                  {/if}
                {/if}
                 <dl>
                  <dt>${label.Cabin}:</dt>
                  <dd> ${customer.productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClassDescription.split(' ')[0]} <abbr>(${customer.productLevelBean[selection.product].bookedCabinCodeBean.cabinDetailsBookingClass})</abbr> </dd>
                  <dt>${label.Seat}: </dt>
                  <dd>
					  {set seat = moduleCtrl.getSeat(customerIndex , selection.product , custId) /}
					  {if seat == "Not Added"}
					  //${label.NotAdded}
					  -
					  {else /}
					  ${seat}
					  {/if}
				  </dd>
					  {if customer.productLevelBean[selection.product].servicesBean}
					  {call
								common.MealDetails(
								  customer.productLevelBean[selection.product].servicesBean,
								  label
								)
							  /}
					  {/if}
                  <!--<dt> ${label.Meal}: </dt>
                  <dd> vegetarian</dd>-->
                </dl>
              </li>

              {if isInfantToPax}
                    /*{call common.infantMacroForAcceptanceOverview(cpr.customerLevel , infantToPax , selection.product , false , infantPrimeId , false , label , true , paxPT,this) /}*/
					  {if cpr.customerLevel != null && cpr.customerLevel.length>0}
					  {foreach cust in cpr.customerLevel}
						{if cust.customerDetailsType == "IN"}
						  {foreach identifier in cust.productLevelBean[selection.product].productIdentifiersBean}
							{if identifier.referenceQualifier == "DID"}
							  {if identifier.primeId == infantPrimeId}
								  <li class="infant infantpaxpaddingTL">
									{if cust.otherPaxDetailsBean}
									  {if cust.otherPaxDetailsBean[0].title}
									  <h4>
											${jQuery.substitute(label.PaxName, [cust.otherPaxDetailsBean[0].title,cust.otherPaxDetailsBean[0].givenName, cust.customerDetailsSurname])}
											<i class="textSmaller">(${label.Infant})</i>
											{if false}
												<span class="checkedinTripsPage">${label.CheckedIn}</span>
											{/if}
											<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : cust_index}}/}><span>${label.Edit}</span></button>
									  </h4>
									  {else /}
									  <h4>
											${jQuery.substitute(label.PaxName, ["",cust.otherPaxDetailsBean[0].givenName, cust.customerDetailsSurname])}
											<i class="textSmaller">(${label.Infant})</i>
											{if false}
												<span class="checkedinTripsPage">${label.CheckedIn}</span>
											{/if}
											<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : cust_index}}/}><span>${label.Edit}</span></button>
									  </h4>
									  {/if}
									{else /}
									  <h4>
											${jQuery.substitute(label.PaxName, ["","", cust.customerDetailsSurname])}
											<i class="textSmaller">(${label.Infant})</i>
											{if false}
												<span class="checkedinTripsPage">${label.CheckedIn}</span>
											{/if}
											<button class="secondary edit" type="button" {on click { fn:"viewInfoCurCust", args: {currentcust : cust_index}}/}><span>${label.Edit}</span></button>
									  </h4>
									{/if}
								  </li>
							  {/if}
							{/if}
						  {/foreach}
						{/if}
					  {/foreach}
					{/if}
               {/if}
			  {/if}
              {/foreach}

            </ul>

          </div>


      </section>
   {/if}
    </article>


{/foreach}


	<article class="panel list">
      <header>
        <h1>${label.DgrGoods}</h1>
      </header>
      <section>
        <ul class="checkin-list" data-info="dangerous-goods">
          <li>
                  <p class="onoffswitch-general-label">
                  	<label for="myonoffswitch">${label.DangerousGoodsMsg|escapeForHTML:false}</label>
                  </p>
                  <div class="onoffswitch">
            <input type="checkbox" class="onoffswitch-checkbox" id="myonoffswitch" {on click { fn:"dgrGoodsCheck", args: {}}/}>
            <label class="onoffswitch-label" for="myonoffswitch">
              <div class="onoffswitch-inner">
                <div class="onoffswitch-active">Yes</div>
                <div class="onoffswitch-inactive">No</div>
              </div>
              <div class="onoffswitch-switch"></div>
            </label>
          </div>
          </li>
        </ul>
      </section>
 	</article>

	<div class="message info">
            <p>${label.SeatSelInfo}</p><!-- tx_merci_checkin_tripsummary_seatselinfo -->
    </div>

    <footer class="buttons">
    {section {
      id: "continueButtonSec",
      macro: {name: 'showContinuebutton', args:[label], scope:this}
    }/}
      //{var handlerName = MC.appCtrl.registerHandler(this.onBackClick, this)/}
      <button {on click "onBackClick"/} class="validation cancel" type="button">${label.cancel}</button>
    </footer>
    {/if}
  <!--</form>-->
</section>

 </div>
   {/macro}

   {macro showContinuebutton(label)}
    {var anyPaxActive = moduleCtrl.getIsAnyValidAppPax() && !(moduleCtrl.getBlackListOverBooked())/}
    //{var handlerName = MC.appCtrl.registerHandler(this.onContinue, this)/}
      <button type="button" class="validation disabled" id="tripSummaryContinue" {on click "onContinue"/} disabled="disabled">${label.checkInLbl}</button>
   {/macro}
{/Template}