{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.PassengerDetails',
$macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
  },
$hasScript: true
}}

  {macro main()}

   {var cpr = moduleCtrl.getCPR()[this.data.selectedCPR.journey] /}
   {var selectedPax = this.data.selectedCPR.customer /}
   {var warnings = moduleCtrl.getWarnings() /}
   {var label = this.label /}
   {var parameter = this.parameters /}
   //{var configuredAirlines = "0:--Select Airlines--,A3:Aegean Airlines - Miles and Bonus,AC:Air Canada - Aeroplan,AI:Air India - Flying Returns,AV:Avianca / TACA - LifeMiles,BR:EVA Air,CA:Air China / Shenzhen Airlines - PhoenixMiles,ET:Ethiopian Airlines - ShebaMiles,JJ:TAM Airlines - Fidelidade,LH:Lufthansa - Miles and More,MS:EgyptAir - EgyptAir Plus,NH:All Nippon Airways - ANA Mileage Club,NZ:Air New Zealand - Air Points,OZ:Asiana Airlines - Asiana Club Miles,SA:South African Airways - Voyager,SK:Scandinavian Airlines System - SAS Eurobonus,SQ:Singapore Airlines - KrisFlyer,TG:Thai Airways Intl - Royal Orchid Plus,TK:Turkish Airlines - Miles & Smiles,TP:TAP Portugal - Victoria,UA:United / Copa Airlines - MileagePlus,US:US Airways - Dividend Miles,VA:Virgin Australia International,VS:Virgin Atlantic Airways - Virgin Flying Club,VX:Virgin America" /}
   {if this.moduleCtrl.getFrequentFlyerList() != null}
   	{var configuredAirlines = "0:--Select Airlines--,"+this.moduleCtrl.getFrequentFlyerList().join(",") /}
   {else/}
   	{var configuredAirlines = "0:--Select Airlines--,"/}
   {/if}
    <div class='sectionDefaultstyle sectionDefaultstyleSsci'>

      <section>
      /* This div is used to display errors if any occurs */
    <div id="initiateandEditErrors"></div>
     /* This div is used to display warnings if any occurs */
    <div id="AcceptanceOverviewWarnings">
       {if warnings != null}
         {@html:Template {
           "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
           data : {
             "messages" : warnings,
             "type" : "warning" }
         }/}
       {/if}
    </div>
        <form>
          <article class="panel contact">

               {var totalNationalityCount=0 /}
               {var selcustomerIndex="" /}

            <div class = 'carrousel-header' id="wrap">
<a class="" id="leftArrow"  {on click {fn: 'previousPax', scope: this}/}>
0
  		</a>
  		<div id='paxscroller' class="carrousel-content">
            <ol id="mycarousel">



                {foreach selPaxDtls in selectedPax}
                 {var customer = cpr[selPaxDtls] /}
                  {if customer.passengerTypeCode != "INF"}

                    {set totalNationalityCount+=1 /}

                    {set selcustomerIndex+=selPaxDtls+"," /}

                    <li data-li-position="${totalNationalityCount}" id="title${selPaxDtls_index}">
                    <span class="pax">${totalNationalityCount}</span>

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


                    <span class="paxName">${jQuery.substitute(label.PaxName, [namePrefix, givenName, surName])} {if customer.passengerTypeCode == "IN"}<small>(${label.Infant})</small>{/if}</span>
                    </li>
                  {/if}
                {/foreach}


            </ol>
</div>
            <a class="" id="rightArrow" {on click {fn: 'nextPax', scope: this}/}>
${totalNationalityCount}
  		</a>
            </div>
{set totalNationalityCount=-1 /}


 {var knowFirstPaxLanding=true /}
          {foreach selPaxDtls in selectedPax}
            {var customer = cpr[selPaxDtls] /}
            {var infant_pax = false /}
            {if customer.passengerTypeCode == "INF"}
              {var infant_pax = true /}
            {/if}
              {set totalNationalityCount+=1 /}
{if infant_pax == false}
              <span data-selected-cust=${selcustomerIndex} {if knowFirstPaxLanding == false}style="display:none"{/if} class="PaxSelectionScreen">
            {set knowFirstPaxLanding=false /}
             /* <section>


              <header>
                <h2 class="subheader">
                  <span>${label.PaxInfo}</span>
                <button data-aria-hidden="false" data-aria-controls="passInfo${totalNationalityCount}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
                  </h2>
              </header>


               <ul id="passInfo${totalNationalityCount}" class="input-elements">

                  <li>
                  <label for="input1">${label.FirstName}</label>
                  <input type="text" disabled="true" value="${customer.otherPaxDetailsBean[0].givenName}">
                </li>

                <li>
                  <label for="input2">${label.LastName}</label>
                  <input type="text" disabled="true" value="${customer.customerDetailsSurname}" >
                </li>

               </ul>



              </section>*/


			/**
			 * BEGIN : Section of EMAIL and PHONE NO
			 */
			{if this.moduleCtrl.getPassengerDetailsFlow() != "TOVR"}
              <section>
              <header>
                <h2 class="subheader">
                  <span>${label.Contact}</span>
                <button data-aria-hidden="false" data-aria-controls="phoneInfo${totalNationalityCount}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
                  </h2>
              </header>


              {var phoneNumber="" /}
              {var areaCode="" /}
              {var Email="" /}
              {var phoneandEmail = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls,"Phone") /}
              {if phoneandEmail != ""}
                {set phoneNumber=phoneandEmail.split("~")[0].substring(4) /}
                {set areaCode = phoneandEmail.split("~")[0].substring(0,4) /}
                {set Email=phoneandEmail.split("~")[1] /}
              {/if}

              <ul id="phoneInfo${totalNationalityCount}" class="input-elements overflowVisible">
                <li>
                  <div class="list phone">
                    <ul class="input">
                  <li>
                      <label for="areaCode${selPaxDtls}">${label.AreaCode}</label>
                      /*<input maxlength="4" type="text" id="areaCode${selPaxDtls}" value="${areaCode}" placeholder="0033" autocomplete-enabled='true'>*/
                      {call autocomplete.createAutoComplete({
						name: "areaCode"+selPaxDtls,
						id: "areaCode"+selPaxDtls,
						type: 'text',
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						placeholder:"0033",
						value: areaCode,
						source: this.data.formattedPhoneList,
						maxlength:4,
						selectCode : true

					})/}
                  </li>
                  <li>
                      <label for="phoneNumber${selPaxDtls}">${label.PhoneNumber}</label>
                      <input maxlength="12" type="tel" id="phoneNumber${selPaxDtls}" value="${phoneNumber}" placeholder="${label.PhoneNumber}">
                  </li>
                </ul>
                    </div>


                </li>

                <li>
                  <label for="emailDetails${selPaxDtls}">${label.Email}</label>
                  <input type="email" maxlength=70 id="emailDetails${selPaxDtls}" value="${Email}" >
                </li>

               </ul>
              </section>
			{/if}

			/**
			 * END : Section of EMAIL and PHONE NO
			 */


              <section>


              <header>
                <h2 class="subheader">
                  <span>${label.FFlyer}</span>
                <button data-aria-hidden="false" data-aria-controls="freqFlyerInfo${totalNationalityCount}" data-aria-expanded="true" class="toggle" role="button" type="button"><span>Toggle</span></button>
                  </h2>
              </header>

              {var carrier="" /}
              {var number="" /}
              {var carrierExist = false /}

              {var fqtv = moduleCtrl.getPaxDetailsForPrefill(selPaxDtls) /}

              {if fqtv != ""}
                {set carrier=fqtv.split("~")[0] /}
                {set number=fqtv.split("~")[1] /}
              {/if}

              <ul id="freqFlyerInfo${totalNationalityCount}" class="input-elements">
                  <li>
                  <label>${label.FFCarrier}</label>
                    <select id = "fqtvType${selPaxDtls}" {if configuredAirlines.split(",").length <= 2}disabled="disabled"{/if} name="fqtvType${selPaxDtls}" >
                    <!--<option selected="selected" value="">Select Airline</option>-->
                      {var Airlinelist=configuredAirlines /}
                      {var airlineName ="" /}
                      {var airlineCode ="" /}
                      {foreach airlineNameCode in Airlinelist.split(",")}
                        {if airlineNameCode!= ""}
                          {set airlineCode = airlineNameCode.split(":")[0] /}
                          {set airlineName = airlineNameCode.split(":")[1] /}
                          {if airlineCode == carrier}
                          	{set carrierExist = true /}
                            <option selected="selected" value="${airlineCode}">${airlineName}</option>
                          {elseif airlineName != "" /}
                            <option {if configuredAirlines.split(",").length <= 2 && (parseInt(airlineNameCode_index)+1) == 2 }selected="selected"{/if} value="${airlineCode}">${airlineName}</option>
                          {/if}

                        {/if}
                      {/foreach}
                    </select>
                </li>

				{if carrierExist == false}
					{set number = "" /}
				{/if}
                <li>
                  <label for="fqtvinput${selPaxDtls}">${label.FFNumber}</label>
                  <input type="text" id="fqtvinput${selPaxDtls}" maxlength="${parameter.SITE_SSCI_FQTV_LENGTH}" value="${number}">

                </li>

               </ul>

              </section>

              </span>
{/if}

      {/foreach}

    </article>

    <footer class="buttons">
    <button class="validation" {on click "fqtvEditCPR"/} type="button">${label.SAVE}</button>
    <button class="validation cancel" {on click "onBackClick"/} type="button">${label.CANCEL}</button>
    </footer>
    </form>
  </section>

 </div>

  {/macro}
{/Template}