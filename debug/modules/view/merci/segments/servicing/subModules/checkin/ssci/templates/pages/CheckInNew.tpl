{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CheckInNew',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
	autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
  },
  $dependencies: ['aria.core.Browser'],
  $hasScript : true
}}

{macro main(args)}
{if this.mainMacroArgs=args}{/if}
${moduleCtrl.setLastName(moduleCtrl.storeDataLocally("lstName"))}
{var embeded = moduleCtrl.getEmbeded() /}
{var lastName = moduleCtrl.getLastName() /}
{var typeOfPnr = moduleCtrl.getPnrType() /}
{var configuredAirlines = moduleCtrl.getOperatingAirlinesList()/}

/*
 * Additional IDC Fields
 * enblBoardPoint Currently Not Used
 */
//{var enblBoardPoint = this.parameters.SITE_SSCI_ENBL_BOARDPOINT/}
{var additionalIDC = this.parameters.SITE_SSCI_ADDITIONAL_IDC/}
{var maxDays = this.parameters.SITE_SSCI_MAX_DEP_DAYS/}
{var boardingPointDetails = this.data.boardingPointDetails/}

/*
 * Additional IDC Fields
 *
 */

{if typeOfPnr == null || typeOfPnr == ''}
  {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS != ""}
	  {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("REC_LOC") != -1}
	  		${moduleCtrl.setPnrType('bookingNumber')}
	  {elseif this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("FF_NUM") != -1 /}
	  		${moduleCtrl.setPnrType('frequentFlyerNumber')}
	  {elseif this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("E_TKT") != -1/}
  		${moduleCtrl.setPnrType('eticketNumber')}
	  {/if}
 {else/}
  	  ${moduleCtrl.setPnrType('bookingNumber')}
  {/if}
  {set typeOfPnr = moduleCtrl.getPnrType() /}
{/if}
/* Div for showing slider containing all the offline boarding passes
<div id="offlineData" class="displayNone"></div>*/
<div id="bpModal" class="displayNone"></div>
<div id="confirmation" class="padall poR displayNone"></div>
<div id="offlineMsg" class="displayNone"></div>

<div class='sectionDefaultstyle sectionDefaultstyleSsci'>
  <section>
  <div id="pageErrors"></div>
  <form id="checkin-CheckInNew" form {on submit "onCprRet"/} >
    <article class="panel sear">

    <header>
        <h1>{if !jQuery.isUndefined(args) && args.flow == "AddPassenger"}${this.label.addPassenger}{else/}${this.label.IdentificationFormHeader}{/if}</h1>
      </header>

      <section>
        <ul class="input-elements">

          <li class="top-input-element" data-info="identify">
            <label for="identify">${this.label.IdentificationTypeSelector}</label>
            <select class="inputField widthFull" name="IdentificationType" id="IdentificationType"
            validators="req:${label.IdentificationTypeSelector}" errorNumbers="21400059" {on change {fn : pnrType}/}>
        {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS != ""}
          {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("REC_LOC") != -1}
        	<option value="bookingNumber" {if typeOfPnr == "bookingNumber"}selected="selected" {/if}>${this.label.RecLoc}</option>
          {/if}
        {/if}
        {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS != ""}
          {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("FF_NUM") != -1}
              <option value="frequentFlyerNumber" {if typeOfPnr == "frequentFlyerNumber"} selected="selected"{/if}>${this.label.FFNbrText}</option>
          {/if}
        {/if}
        {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS != ""}
          {if this.parameters.SITE_SSCI_CHECKN_IDCFORMS.indexOf("E_TKT") != -1}
              <option value="eticketNumber" {if typeOfPnr == "eticketNumber"} selected="selected" {/if}>${this.label.ETicketNbr}</option>
          {/if}
        {/if}
      </select>
          </li>

      {if typeOfPnr == "frequentFlyerNumber"}
      <li data-info="frequent-flyer" id="ffSelected">
            <label for="select2">${this.label.AirlineList}</label>
            <select class="inputField widthFull" name="carrier" id="carrier"
                validators="req:${this.label.AirlineList}" errorNumbers="">
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
          </li>
      <li data-info="frequent-flyer" id="ffTextField">
            <label for="input2">${this.label.FFNbrText}</label>
            {call
             common.textfield({
             type : 'text',
             id : 'ffNumber',
             name : 'ffNumber',
             placeholder : this.label.FFLocPH,
             options : {
                 textfieldcls : 'inputField widthFull noMargin',
                 validators : 'req:'+this.label.FFNbrText+'|alphanum:'+this.label.FFNbrText+'|sizeLessThanEqual:'+this.parameters.SITE_SSCI_FQTV_LENGTH,
                 errorNumbers : '21400059|21400061|213002226',
                 required : "required",
                 maxlength : this.parameters.SITE_SSCI_FQTV_LENGTH,
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
             placeholder : this.label.RecLocPH,
             options : {
               textfieldcls : 'inputField widthFull noMargin textFieldsUpperCase',
               validators : 'req:'+this.label.BookingNumber+'|alphanum:'+this.label.BookingNumber+'|sizeLessThanEqual:'+this.parameters.SITE_SSCI_REC_LOC_LENGTH,
               errorNumbers : '21400059|21400061|213002224',
               required : "required",
               clearButton : true,
               size : '8',
               maxlength : this.parameters.SITE_SSCI_REC_LOC_LENGTH
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
             placeholder : this.label.ETicketLocPH,
             options : {
                 textfieldcls : 'inputField widthFull noMargin',
                 validators : 'req:'+this.label.ETicketNbr+'|numeric:'+this.label.ETicketNbr+'|sizeLessThanEqual:'+this.parameters.SITE_SSCI_E_TKT_LENGTH,
                 errorNumbers : '21400059|21400061|213002225',
                 required : "required",
                 maxlength : this.parameters.SITE_SSCI_E_TKT_LENGTH,
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


	  {if (additionalIDC.search(/BPOINT/i) != -1) && (additionalIDC.search(/DDATE/i) == -1) && (additionalIDC.search(/LNAME/i) == -1)}
	  	  <li data-info="board-point-name">
            <label for="board-point-name">${this.label.BoardingPoint}</label>
            {call autocomplete.createAutoComplete({
				name: "boardpoint",
				id: "boardpoint",
				type: 'text',
				validators : "req:"+"Please Provide BoardPoint",
				errornumbers : "21400059",
				autocorrect:"off",
				autocapitalize:"none",
				autocomplete:"off",
				placeholder : "eg. London,United Kingdom (Heathrow - LHR)",
				source: boardingPointDetails
			})/}
          </li>
	  {elseif additionalIDC.search(/DDATE/i) != -1 && (additionalIDC.search(/BPOINT/i) == -1) && (additionalIDC.search(/LNAME/i) == -1) /}
	          <li data-info="dept_date">
	            <label for="dept_date">${this.label.DepartureDate}</label>
	            	<select id = "departureDate" name="departureDate" >
	            		{var currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd") /}
	            		{var tempDate = new Date(currDate)/}
	            		{for var i=0 ; i<= parseInt(maxDays);i++}
							<option {if i==0}selected="selected"{/if} value="${tempDate|dateformat:'yyyy-MM-dd'}">${tempDate|dateformat:"dd MMM yyyy"}</option>
							{var d = tempDate.setDate(tempDate.getDate()+1)/}
	            		{/for}
	            	</select>
	           </li>
	   {else/}//${tempDate|dateformat:'yyyy-mm-dd'}

	           <li data-info="last-name">
	            <label for="last-name">${this.label.LastName}</label>
	            {call
	                       common.textfield({
	                       type : 'text',
	                       id : 'lastName',
	                       name : 'lastName',
	                       value : lastName,
	                       options : {
	                       textfieldcls : 'inputField widthFull',
	                       validators : 'req:'+this.label.LastName+'|lastName',
	                       errorNumbers : '21400059|1037',
	                       required : "required",
	             		   maxlength : '64',
	                       clearButton : true,
	                       //namePicker : JSONData.embeded
	                      }
	                    })
	                   /}
	            </li>

	   {/if}



        </ul>
      </section>
    </article>
    <footer class="buttons">
    {if !jQuery.isUndefined(args) && args.flow == "AddPassenger"}<button {on click { fn:"loadRequiredPage", args: {path:"modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.CPRRetreiveMultiPax",id:"multipaxAddpassengerBlock",input:{}}, scope:this.moduleCtrl}/} type="button" class="validation cancel" >${this.label.cancelForAddpax}</button>{/if}
      <button class="validation" type="submit">{if !jQuery.isUndefined(args) && args.flow == "AddPassenger"}${this.label.addPassenger}{else/}${this.label.GetTrip}{/if}</button>
    </footer>
  </form>
</section>
</div>
  {/macro}
{/Template}
