{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.TripListPageNew',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $hasScript : true
}}

  {macro main()}

{var cpr = ""/}
{var cprResponseForApp = ""/}
		{var PNRData = "" /}
  {if  moduleCtrl.getAllCPRList()}
   {set cpr = moduleCtrl.getAllCPRList() /}
  {else/}
     {var toUpdate = moduleCtrl.setAllCPRList(this.moduleCtrl.getModuleData().checkIn.MTripList_A.requestParam.CPRIdentification) /}
//{var lss = moduleCtrl.setLastName(JSONData.lstName) /}
    {set cpr = moduleCtrl.getAllCPRList() /}
    {if moduleCtrl.getSessionId() || moduleCtrl.getSessionId() == null }
          //{var ssID = moduleCtrl.setSessionId(JSONData.cprResponse.data.framework.sessionId) /}
    {/if}
  {/if}

    {var temp=[] /}

    {var opencheckin=false /}

      {var label = this.moduleCtrl.getModuleData().checkIn.MTripList_A.labels/}
    {var parameters = this.moduleCtrl.getModuleData().checkIn.MTripList_A.parameters/}

{var cprInput = this.moduleCtrl.cprInputSQ /}

{var myUrl=this.moduleCtrl.getModuleData().framework.baseParams.join("") /}
	{if !cprInput}
	{set cprInput = this.moduleCtrl.getUrlVars(myUrl) /}
	{/if}

<div id="TriplistpageErrors"></div>

<div class='sectionDefaultstyle'>
<section class="sectionTripListPage">
<div id="pageErrors"></div>
  <form>


    <!--<header>
      <h1>1 trip ready to checkin</h1>
        <p>3 trips in total</p>
    </header>-->


    <article class="carrousel-full">

        <h1 data-location="BKDL1.html" data-flightinfo="route">
          //SIN - HKG - SIN
            <a href="BKDL1.html"></a>
        </h1>

      {var totalListTracker=-1 /}
      <ul id="listboxa">
      {foreach AllCustomerLevels inArray cpr}
         {foreach customer inArray AllCustomerLevels.customerLevel}

          /*FOR NOT SHOWING TRIPS WHOSE ALL SEGMENTS ARE FLOWN OR NOT OPEN
          * open node true 2-48 hrs other wise false -- dalmiya
          */

          {if temp.indexOf(customer.recordLocatorBean.controlNumber) == -1 && customer.productLevelBean[0].open && !customer.productLevelBean[0].flown}
            {set totalListTracker+=1 /}
//{on click { fn:"gotoSelectPAX", args: {"flow" : "manageCheckin"}}/}
               {if customer.productLevelBean[0].flightOpen}
                  {var handlerName = "someThing" /}
                  {var handlerName_forheader = "someThing" /}
               {else /}
               {var handlerName = "" /}
               {var handlerName_forheader = "" /}
               {/if}

               {var opTrip="" /}
               {if customer.productLevelBean.length == 1}
			         <li id="ass" class="one-way multicity">
                  {set opTrip=customer.productLevelBean[0].operatingFlightDetailsBoardPoint+" - "+customer.productLevelBean[0].operatingFlightDetailsOffPoint /}
               {elseif customer.productLevelBean.length == 2 /}
			         <li class="multicity">
                      {foreach productbean inArray customer.productLevelBean}
                        {if productbean_index == 0}
                        {set opTrip=productbean.operatingFlightDetailsBoardPoint+" - " /}
                        {/if}

                        {if productbean_index+1 == customer.productLevelBean.length}
                        {set opTrip+=productbean.operatingFlightDetailsOffPoint /}
                        {else /}
                        {set opTrip+=productbean.operatingFlightDetailsOffPoint+" - " /}
                        {/if}

                      {/foreach}
                {else /}
                <li class="multicity">

                      {foreach productbean inArray customer.productLevelBean}

                        {if productbean_index+1 == customer.productLevelBean.length}
                        {set opTrip+=productbean.operatingFlightDetailsBoardPoint+" - "+productbean.operatingFlightDetailsOffPoint /}
                        {else /}
                        {set opTrip+=productbean.operatingFlightDetailsBoardPoint+" - "+productbean.operatingFlightDetailsOffPoint+" / " /}
                        {/if}

                      {/foreach}


               {/if}

                <article data-airp-list-tracker="${totalListTracker}" {if handlerName != ""}{on tap { fn:"setselectedPnrDetails", args: {custLevel:AllCustomerLevels.customerLevel,PNR:customer.recordLocatorBean.controlNumber,lastName:customer.customerDetailsSurname}}/} {on dblclick { fn:"setselectedPnrDetails", args: {custLevel:AllCustomerLevels.customerLevel,PNR:customer.recordLocatorBean.controlNumber,lastName:customer.customerDetailsSurname,header:"header"}}/}{else /}data-airp-list-onclick="" data-airp-list-forheader_onclick=""{/if} data-airp-points="${opTrip}" class="carrousel-full-item">

                    {if customer.productLevelBean.length == 1}
                        {set opencheckin=customer.productLevelBean[0].checkInOpen /}

                        {var date=eval(customer.productLevelBean[0].legLevelBean[0].legTimeBean[0].json) /}
                       /* {var CheckinOpensin=this.getUTCdateFindDiff(customer.productLevelBean[0].legLevelBean[0].legTimeBean[0]) /}*/
                        {var flightopen=customer.productLevelBean[0].flightOpen /}


                        {if customer.productLevelBean[0].flown && customer.productLevelBean[0].flown == true }
                          <section class="is-flown">
                          <span class="outboundFlightImg"></span>
                          <h3><span class="flightExpired">${label.FlightExpired}</span><span class="tripListPagesegmentsize">${customer.productLevelBean[0].operatingFlightDetailsBoardPoint} - ${customer.productLevelBean[0].operatingFlightDetailsOffPoint}</span></h3>
                        {elseif flightopen == false || opencheckin == false/}
                          <section>
                          <span class="outboundFlightImg"></span>
                          <h3><span class="checkinnotopen">${label.FlightNotOpen}</span><span class="tripListPagesegmentsize">${customer.productLevelBean[0].operatingFlightDetailsBoardPoint} - ${customer.productLevelBean[0].operatingFlightDetailsOffPoint}</span></h3>
                        {elseif opencheckin == true /}
                          <section class="is-checkin-open">
                          <span class="outboundFlightImg"></span>
                          <h3><span class="checkinopen">${label.Checkintext}</span><span class="tripListPagesegmentsize">${customer.productLevelBean[0].operatingFlightDetailsBoardPoint} - ${customer.productLevelBean[0].operatingFlightDetailsOffPoint}</span></h3>
                        {elseif customer.productLevelBean[0].openTime /}

                          {var CheckinOpensin=customer.productLevelBean[0].openTime /}

                          {if CheckinOpensin == 1}
                            {set CheckinOpensin=CheckinOpensin+" "+label.Hr /}
                          {elseif CheckinOpensin < 24 /}
                            {set CheckinOpensin=CheckinOpensin+" "+label.Hrs /}
                          {else /}
                            {set CheckinOpensin=Math.round(CheckinOpensin/24) /}
                            {if CheckinOpensin == 1}

                              {set CheckinOpensin=CheckinOpensin+" "+label.Day /}
                            {else /}
                              {set CheckinOpensin=CheckinOpensin+" "+label.Days /}
                            {/if}
                          {/if}

                          <section>
                          <span class="outboundFlightImg"></span>
                          <h3><span class="checkinnotopen">${label.OpensIn} <span>${CheckinOpensin}</span></span><span class="tripListPagesegmentsize">${customer.productLevelBean[0].operatingFlightDetailsBoardPoint} - ${customer.productLevelBean[0].operatingFlightDetailsOffPoint}</span></h3>
                        {/if}
                        <time>
                                <span>
                                  <span data-flightinfo="day-name">${moduleCtrl.getWeekDay(date).substr(0,3)}</span>
                                  <span data-flightinfo="day-number">{if date.getDate()< 10}0${date.getDate()}{else /}${date.getDate()}{/if}</span>
                                  <span data-flightinfo="month">${moduleCtrl.getMonth(date)}</span>
                                  <span data-flightinfo="year">${date.getFullYear()}</span>
                                </span>
                        </time>
                        </section>

                    {else /}

                      {foreach productbean inArray customer.productLevelBean}
                        {set opencheckin=productbean.checkInOpen /}
                        {var date=eval(productbean.legLevelBean[0].legTimeBean[0].json) /}
                        /*{var CheckinOpensin=this.getUTCdateFindDiff(productbean.legLevelBean[0].legTimeBean[0]) /}*/
                        {var flightopen=productbean.flightOpen /}

                        {if productbean.flown && productbean.flown == true }
                          <section class="is-flown">
                          {if customer.productLevelBean.length == 2}
                            {if customer.roundTrip && productbean_index == 1}
                              <span class="inboundFlightImg"></span>
                            {else /}
                              <span class="outboundFlightImg"></span>
                            {/if}
                          {/if}
                          <h3><span class="flightExpired">${label.FlightExpired}</span><span class="tripListPagesegmentsize">${productbean.operatingFlightDetailsBoardPoint} - ${productbean.operatingFlightDetailsOffPoint}</span></h3>
                        {elseif flightopen == false /}
                          <section>
                          {if customer.productLevelBean.length == 2}
                            {if customer.roundTrip && productbean_index == 1}
                              <span class="inboundFlightImg"></span>
                            {else /}
                              <span class="outboundFlightImg"></span>
                            {/if}
                          {/if}
                          <h3><span class="checkinnotopen">${label.FlightNotOpen}</span><span class="tripListPagesegmentsize">${productbean.operatingFlightDetailsBoardPoint} - ${productbean.operatingFlightDetailsOffPoint}</span></h3>
                        {elseif opencheckin == true /}
                          <section class="is-checkin-open">
                          {if customer.productLevelBean.length == 2}
                            {if customer.roundTrip && productbean_index == 1}
                              <span class="inboundFlightImg"></span>
                            {else /}
                              <span class="outboundFlightImg"></span>
                            {/if}
                          {/if}
                          <h3><span class="checkinopen">${label.Checkintext}</span><span class="tripListPagesegmentsize">${productbean.operatingFlightDetailsBoardPoint} - ${productbean.operatingFlightDetailsOffPoint}</span></h3>
                        {elseif productbean.openTime /}

                          {var CheckinOpensin=productbean.openTime /}

                          {if CheckinOpensin == 1}
                            {set CheckinOpensin=CheckinOpensin+" "+label.Hr /}
                          {elseif CheckinOpensin < 24 /}
                            {set CheckinOpensin=CheckinOpensin+" "+label.Hrs /}
                          {else /}
                            {set CheckinOpensin=Math.round(CheckinOpensin/24) /}
                            {if CheckinOpensin == 1}

                              {set CheckinOpensin=CheckinOpensin+" "+label.Day /}
                            {else /}
                              {set CheckinOpensin=CheckinOpensin+" "+label.Days /}
                            {/if}
                          {/if}

                          <section>
                          {if customer.productLevelBean.length == 2}
                            {if customer.roundTrip && productbean_index == 1}
                              <span class="inboundFlightImg"></span>
                            {else /}
                              <span class="outboundFlightImg"></span>
                            {/if}
                          {/if}
                          <h3><span class="checkinnotopen">${label.OpensIn} <span>${CheckinOpensin}</span></span><span class="tripListPagesegmentsize">${productbean.operatingFlightDetailsBoardPoint} - ${productbean.operatingFlightDetailsOffPoint}</span></h3>
                        {/if}
                        <time>
                        {if customer.productLevelBean.length > 2 && (productbean_index == 0 || productbean_index+1 == customer.productLevelBean.length)}
                            {if customer.roundTrip && productbean_index+1 == customer.productLevelBean.length}
                              <span class="inboundFlightImg"></span>
                            {else /}
                              <span class="outboundFlightImg"></span>
                            {/if}
                        {/if}
                                <span>
                                  <span data-flightinfo="day-name">${moduleCtrl.getWeekDay(date).substr(0,3)}</span>
                                  <span data-flightinfo="day-number">{if date.getDate()< 10}0${date.getDate()}{else /}${date.getDate()}{/if}</span>
                                  <span data-flightinfo="month">${moduleCtrl.getMonth(date)}</span>
                                  <span data-flightinfo="year">${date.getFullYear()}</span>
                                </span>
                        </time>
                        </section>

                      {/foreach}

                    {/if}

                </article>

            </li>
          {if temp.push(customer.recordLocatorBean.controlNumber)}
          {/if}

		  /*
		  	construct data to show in app boarding tab - each PNR details seperated by @
		  */
		{var productView = customer.productLevelBean/}
		{foreach product in productView}

		  /* Code added for SQ integration with Native Apps */
			  {if product_index == 0}
			  	{var tempOne=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customer.productLevelBean[0]) /}
					  {var temp1=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customer.productLevelBean[customer.productLevelBean.length-1]) /}
				  {if customer.productLevelBean[0].operatingFlightDetailsBoardPoint != customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPoint}
				  {set cprResponseForApp += customer.productLevelBean[0].operatingFlightDetailsBoardPointInfo.city + "|" +
									  customer.productLevelBean[0].operatingFlightDetailsBoardPoint + "|" +
									  customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPointInfo.city + "|" +
									  customer.productLevelBean[customer.productLevelBean.length-1].operatingFlightDetailsOffPoint + "|" +
									  1 + "|" +
									  tempOne.depDateInGMTDate + "|" +
									  temp1.arrDateInGMTDate + "|" /}
				  {else/}
				  {set cprResponseForApp += customer.productLevelBean[0].operatingFlightDetailsBoardPointInfo.city + "|" +
									  customer.productLevelBean[0].operatingFlightDetailsBoardPoint + "|" +
									  customer.productLevelBean[customer.productLevelBean.length-2].operatingFlightDetailsOffPointInfo.city + "|" +
									  customer.productLevelBean[customer.productLevelBean.length-2].operatingFlightDetailsOffPoint + "|" +
									  1 + "|" +
									  tempOne.depDateInGMTDate + "|" +
									  temp1.depDateInGMTDate + "|" /}
				  {/if}
						{foreach customerLvlProd in customer.productLevelBean}
						{var tempOne=this.moduleCtrl.arr_Dep_Date_TakingFrm_STDandSTA(customer, customerLvlProd) /}
							{if customerLvlProd_index != customer.productLevelBean.length -1}
								{set cprResponseForApp += customerLvlProd.operatingFlightDetailsFlightNumber + "^" + tempOne.depDateInGMTDate + "-" + tempOne.arrDateInGMTDate + "," /}
							{else/}
								{set cprResponseForApp += customerLvlProd.operatingFlightDetailsFlightNumber + "^" + tempOne.depDateInGMTDate + "-" + tempOne.arrDateInGMTDate /}
							{/if}
						{/foreach}
			  {/if}

		 {/foreach}

		 /*
		 	 For construct PNR data
		 */

			 {if cprInput && cprInput.lastName && cprInput.lastName != ""}
			  {set PNRData = PNRData + cprInput.lastName /}

			{else /}
			{set PNRData = PNRData + customer.customerDetailsSurname /}

			{/if}
			{if customer.recordLocatorBean.controlNumber != ""}
				{set PNRData = PNRData + "|" + customer.recordLocatorBean.controlNumber  /}

			{elseif cprInput && cprInput.rLoc && cprInput.rLoc != "" /}
				  {set PNRData = PNRData + "|" + cprInput.rLoc /}

			{else /}
				{set PNRData = PNRData + "|" + ""  /}
			{/if}
			{if localStorage.ffNumber}
				{set PNRData = PNRData + "|" + localStorage.ffNumber /}

			{elseif cprInput && cprInput.ffNbr && cprInput.ffNbr != "" /}
				  {set PNRData = PNRData + "|" + cprInput.ffNbr /}

			{else/}

				{var ffNumber="" /}
				{foreach eachPrd inArray customer.productLevelBean}
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

				{if ffNumber == ""}
					{set PNRData = PNRData + "|" + "" /}
				{else /}
					{set PNRData = PNRData + "|" + ffNumber /}
				{/if}

			{/if}

			{if cprInput &&   cprInput.carrier && cprInput.carrier != ""}
				{set PNRData = PNRData + "|" + cprInput.carrier /}

			{else/}

				{var ffCarrier="" /}
				{foreach eachPrd inArray customer.productLevelBean}
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

				{if ffCarrier == ""}
					{set PNRData = PNRData + "|" + "" /}
				{else /}
					{set PNRData = PNRData + "|" + ffCarrier /}
				{/if}

			{/if}

			{if cprInput &&   cprInput.eticketNumber && cprInput.eticketNumber != ""}
				{set PNRData = PNRData + "|" + cprInput.eticketNumber /}

			{else/}
				{var eTicketNum="" /}
				{foreach eachPrd inArray customer.productLevelBean}
					{if eachPrd.ticketsBean != undefined && eachPrd.ticketsBean.length > 0}
						{if eachPrd.ticketsBean[0].ticketDetailsNumber && eachPrd.ticketsBean[0].ticketDetailsNumber != "" && customer.productLevelBean[0].ticketsBean[0].ticketDetailsType && typeof customer.productLevelBean[0].ticketsBean[0].ticketDetailsType == "string" && customer.productLevelBean[0].ticketsBean[0].ticketDetailsType.search(/e/i) != -1}
							{set eTicketNum = eachPrd.ticketsBean[0].ticketDetailsNumber /}

						{/if}
					{/if}
				{/foreach}

				{if eTicketNum == ""}
					{set PNRData = PNRData + "|" + "" /}
				{else /}
					{set PNRData = PNRData + "|" + eTicketNum /}
				{/if}
			{/if}
		 /*
		 	 End for construct PNR data
		 */

		{set cprResponseForApp+="@" /}
		{set PNRData+="@" /}
		 /*
		  	End construct data to show in app boarding tab - each PNR details seperated by @
		  */


         {/if}

        {/foreach}
       {/foreach}

        </ul>

        <footer>
          <ul id="Indicator_details">

            </ul>

        </footer>


    </article>

    <aside>
  <nav class="buttons">
      <ul>
     // {var handlerName1 = MC.appCtrl.registerHandler(this.gotoCheckinHomePage, this, {flow : "retriveNewTrip"})/}
      <li><a href="javascript:void(0)" {on click { fn:"gotoCheckinHomePage", args: {"flow" : "manageCheckin"}}/} class="navigation">${label.TripNotHere}?</a></li>

      </ul>
    </nav>
  </aside>



  </form>
</section>
{if moduleCtrl.getEmbeded()}
<div class="displayNone">
<input type="text" value="${cprResponseForApp.substr(0,cprResponseForApp.length-1)}" id="PNRData" name="PNRData" />
<input type="text" value="${PNRData.substr(0,PNRData.length-1)}" id="retrievePNRData" name="retrievePNRData" />
</div>
{/if}
/*{if console.log(cprResponseForApp.substr(0,cprResponseForApp.length-1))}{/if}
{if console.log(PNRData.substr(0,PNRData.length-1))}{/if}*/
</div>
   {/macro}
{/Template}