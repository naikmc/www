{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.CheckInNew',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
  $dependencies: ['aria.core.Browser'],
  $hasScript : true
}}

{macro main()}
${moduleCtrl.setLastName(localStorage.lstName)}
{var embeded = moduleCtrl.getEmbeded() /}
{var lastName = moduleCtrl.getLastName() /}
{var typeOfPnr = moduleCtrl.getPnrType() /}
{var configuredAirlines = moduleCtrl.getOperatingAirlinesList()/}
{if typeOfPnr == null || typeOfPnr == ''}
  {set typeOfPnr = 'bookingNumber'/}
{/if}
/* Div for showing slider containing all the offline boarding passes
<div id="offlineData" class="displayNone"></div>*/
<div id="bpModal" class="displayNone"></div>
<div id="confirmation" class="padall poR displayNone"></div>
<div id="offlineMsg" class="displayNone"></div>

<div class='sectionDefaultstyle'>
  <section>
  <div id="pageErrors"></div>
  <form id="checkin-CheckInNew" form {on submit "onCprRet"/} >
    <article class="panel sear">

    <header>
        <h1>${this.label.checkIn}</h1>
      </header>

      <section>
        <ul class="input-elements">

          <li class="top-input-element" data-info="identify">
            <label for="identify">${this.label.IdentificationTypeSelector}</label>
            <select class="inputField widthFull" name="IdentificationType" id="IdentificationType"
            validators="req:IdentificationType" errorNumbers="" {on change {fn : pnrType}/}>
        <option value="bookingNumber" {if typeOfPnr == "bookingNumber"}selected="selected" {/if}>${this.label.RecLoc}</option>
        {if this.parameters.SITE_MCI_FFNBR_IDNTFCN != ""}
          {if this.moduleCtrl.booleanValue(this.parameters.SITE_MCI_FFNBR_IDNTFCN)}
              <option value="frequentFlyerNumber" {if typeOfPnr == "frequentFlyerNumber"} selected="selected"{/if}>${this.label.FFNbrText}</option>
          {/if}
        {/if}
        {if this.parameters.SITE_MCI_ETKT_IDNTFCN != ""}
          {if this.moduleCtrl.booleanValue(this.parameters.SITE_MCI_ETKT_IDNTFCN)}
              <option value="eticketNumber" {if typeOfPnr == "eticketNumber"} selected="selected" {/if}>${this.label.ETicketNbr}</option>
          {/if}
        {/if}
      </select>
          </li>

      {if typeOfPnr == "frequentFlyerNumber"}
     /* <li data-info="frequent-flyer" id="ffSelected">
            <label for="select2">${this.label.AirlineList}</label>
            <select class="inputField widthFull" name="carrier" id="carrier"
                validators="req:Airlines" errorNumbers="">
            {var Airlinelist=configuredAirlines /}
            {var airlineName ="" /}
            {var airlineCode ="" /}
            {foreach airlineNameCode in Airlinelist.split(",")}
              {if airlineNameCode!= ""}
              {set airlineCode = airlineNameCode.split(":")[0] /}
              {set airlineName = airlineNameCode.split(":")[1] /}
              <option value="${airlineCode}">${airlineName}</option>
              {/if}
            {/foreach}
      </select>
          </li>*/
      <li data-info="frequent-flyer" id="ffTextField">
            <label for="input2">${this.label.FFNbrText}</label>
            {call
             common.textfield({
             type : 'text',
             id : 'ffNumber',
             name : 'ffNumber',
             autocomplete : 'off',
             placeholder : this.label.FFLocPH,
             options : {
                 textfieldcls : 'inputField widthFull noMargin',
                 validators : 'req:Frequent Flyer Number|alphanum:Frequent Flyer Number',
                 errorNumbers : '21400059|21400061',
                 required : "required",
                 maxlength : '25',
                 clearButton : true,
                 size : '11'
                             }
                           })
                         /}
              {if aria.core.Browser.isBlackberry}
                <span>(${this.label.FFLocPH})</span>
             {/if}
          </li>
      {/if}

          {if typeOfPnr == "bookingNumber"}
      <li data-info="booking-number" id="BookingNumber">
            <label for="input2">${this.label.BookingNumber}</label>
            {call
             common.textfield({
             type : 'text',
             id : 'recLoc',
             name : 'recLoc',
             autocomplete : 'off',
             placeholder : this.label.RecLocPH,
             options : {
               textfieldcls : 'inputField widthFull noMargin textFieldsUpperCase',
               validators : 'req:Booking Reference|alphanum:Booking Reference|size:6',
               errorNumbers : '21400059|21400061|21400060',
               required : "required",
               clearButton : true,
               size : '8',
               maxlength : '6'
               }
              })
            /}
            {if aria.core.Browser.isBlackBerry}
                <span>(${this.label.RecLocPH})</span>
            {/if}
          </li>
      {/if}

      {if typeOfPnr == "eticketNumber"}
          <li data-info="eticket-number" id='eticketnumberLi'>
            <label for="input2">${this.label.ETicketNbr}</label>
            {call
             common.textfield({
             type : 'tel',
             id : 'eticketNumber',
             name : 'eticketNumber',
             autocomplete : 'off',
             placeholder : this.label.ETicketLocPH,
             options : {
                 textfieldcls : 'inputField widthFull noMargin',
                 validators : 'req:ETicket Number|numeric:ETicket Number',
                 errorNumbers : '21400059|21400061',
                 required : "required",
                 maxlength : '13',
                 clearButton : true,
                 size : '14'
              }
              })
            /}
            {if aria.core.Browser.isBlackberry}
                <span>(${this.label.ETicketLocPH})</span>
            {/if}
          </li>
      {/if}

          <li data-info="last-name">
            <label for="last-name">${this.label.LastName}</label>
            {call
                       common.textfield({
                       type : 'text',
                       id : 'lastName',
					   autocomplete : 'off',
                       name : 'lastName',
                       value : lastName,
                       options : {
                       textfieldcls : 'inputField widthFull',
                       validators : 'req:Last Name|lastName',
                       errorNumbers : '21400059|1037',
                       required : "required",
             maxlength : '64',
                       clearButton : true,
                       //namePicker : JSONData.embeded
                      }
                    })
                   /}
          </li>

        </ul>
      </section>
    </article>
    <footer class="buttons">
      <button class="validation" type="submit">${this.label.GetTrip}</button>
    </footer>
  </form>
</section>
</div>
  {/macro}
{/Template}
