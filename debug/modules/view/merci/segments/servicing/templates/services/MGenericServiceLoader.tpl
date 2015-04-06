{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MGenericServiceLoader",
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}
	{macro main()}
	  <section>
  		<form>
        {call includeError(this.labels)/}
  		  <article class="panel trip">
    		  <header>
      			{@html:Template {
      			  classpath: "modules.view.merci.common.templates.MPaxSelector",
      			  data: {
        				passengers: this.tripplan.paxInfo.travellers,
        				selectCallBack: {fn: this.selectPax, scope: this},
                selectedPaxIndex: this.data.defaultPaxIndex
      			  },
      			  block: true
      			}/}
    		  </header>
         {section {
            type: "div",
            bindRefreshTo: [{inside: this.data, to: "selectedPax"}],
            macro: {name: "outerSection", scope: this}
          }/}
  		  </article>
        {section {
          type: "div",
          bindRefreshTo: [{inside: this.data, to: "disableContinueFlag"}],
          macro: {name: "assistanceMessage", scope: this}
        }/}
  		  {section {
  		    type: "footer",
  		    attributes: {
  			   classList: ["buttons"]
  		    },
  		    bindRefreshTo: [{inside: this.data, to: "disableContinueFlag"}],
  		    macro: {name: "footerButtons", scope: this}
  		  }/}
  	  </form>
	  </section>
	{/macro}
  {macro outerSection()}  
    {var servicesSVC = this.getSVCServices(this.data.category.code) /}
      
    {if servicesSVC.length > 0}
     ${aria.utils.Json.setValue(this.data, "__pageLoadCounter", servicesSVC.length )|eat}
      {section {
        type: "section",
        attributes: {
          classList: ["services", "add-service"]
        },
        bindRefreshTo: [{inside: this.data, to: "selectedPax"},{inside: this.data, to: "selectedServiceFromDropdown"}],
        macro: {name: "dropdownServices", scope: this, args: [servicesSVC,"GND",null,null]}
      }/}
    {/if}
    {var servicesWholeTrip = this.getServicesForWholeTrip(this.data.category.code) /}
  
    {if servicesWholeTrip.length > 0}
      ${aria.utils.Json.setValue(this.data, "__pageLoadCounter", servicesWholeTrip.length )|eat}
      {section {
        type: "section",
        attributes: {
          classList: ["services", "add-service"]
        },
        bindRefreshTo: [{inside: this.data, to: "selectedServiceFromDropdown"}],
        macro: {name: "dropdownServices", scope: this, args: [servicesWholeTrip,"ITI",null,null]}
      }/}
    {/if}
    {foreach itinerary inArray this.tripplan.air.itineraries}
      // Display services for this bound (at ELE level)
      {var servicesForItinerary = this.getServicesForBound(itinerary.itemId, this.data.category.code) /}
      
      {if servicesForItinerary.length > 0}
      ${aria.utils.Json.setValue(this.data, "__pageLoadCounter", servicesForItinerary.length )|eat}
          {section {
            type: "section",
            attributes: {
              classList: ["services", "add-service"]
            },
            bindRefreshTo: [{inside: this.data, to: "selectedServiceFromDropdown"}],
            macro: {name: "dropdownServices", scope: this, args: [servicesForItinerary,"ELE",itinerary,null]}
          }/}
      {/if}
      // Display services per segment inside current bound
      {foreach segment inArray itinerary.segments}
        {var servicesForSegment = this.getServicesForSegment(segment.id, this.data.category.code) /}
        
        {if servicesForSegment.length > 0}
         ${aria.utils.Json.setValue(this.data, "__pageLoadCounter", servicesForSegment.length )|eat}
          {section {
            type: "section",
            attributes: {
              classList: ["services", "add-service"]
            },
            bindRefreshTo: [{inside: this.data, to: "selectedServiceFromDropdown"}],
            macro: {name: "dropdownServices", scope: this, args: [servicesForSegment,"SEG",itinerary,segment]}
          }/}
        {/if}
      {/foreach}//end foreach segment
    {/foreach}// end foreach itinerary
  {/macro}
  {macro dropdownServices(services, associationMode, itinerary, segment)}
    {var serviceDropdown = null/}
    {var servicesEligibleForPax= this.getEligibleServicesInCategory(services) /}
    {var elementId ="" /}
    {var svcEligKey = "" /}
    <header>
      <h2 class="subheader">
        {if associationMode == "ITI"}
          <span>${this.labels.tx_merci_services_for_your_trip}</span>
          {set elementId=createElementIdentifier(associationMode, 0, 0) /}
          {set serviceDropdown = createCategoryData(servicesEligibleForPax, null, null)/}
        {elseif associationMode == "ELE" /}
          <span>${itinerary.beginLocation.cityName} - ${itinerary.endLocation.cityName}</span>
          {set elementId=createElementIdentifier(associationMode, parseInt(itinerary.itemId), 0) /}
          {set serviceDropdown = createCategoryData(servicesEligibleForPax, parseInt(itinerary.itemId), null)/}       
        {elseif associationMode == "SEG" /}
          <span>${segment.beginLocation.cityName} - ${segment.endLocation.cityName}</span>
          {set elementId=createElementIdentifier(associationMode, 0, segment.id) /}
          {set serviceDropdown = createCategoryData(servicesEligibleForPax, parseInt(itinerary.itemId), segment.id)/}        
        {elseif associationMode == "GND" /}
          <span>${this.labels.tx_merci_svc_services}</span>
          {set elementId=createElementIdentifier(associationMode, 0, 0, 1) /}
          {set serviceDropdown = createCategoryData(servicesEligibleForPax, 0, 0)/}      
          {set svcEligKey = serviceDropdown[1].eligibilityKey /}
        {/if}
        <button {on click {fn:toggle , scope: this, args: {sectionId: elementId, buttonId:'toggle_'+elementId}}/} id="toggle_${elementId}" type="button" role="button" class="toggle" aria-expanded="true"><span>Toggle</span></button>
      </h2>
    </header>
    {var totalInstances = 1 /}
    {if svcEligKey!="" && this._servicesTotalInstances[svcEligKey]}
      {set totalInstances=this._servicesTotalInstances[svcEligKey] /}
    {/if}
    {for instanceIndex=1; instanceIndex<=totalInstances; instanceIndex++}
        {if associationMode=="GND" && instanceIndex!=1}
          {set elementId=createElementIdentifier(associationMode, 0, 0 , instanceIndex) /}
        {/if}
    <ul class="bagDrpDwn" id="${elementId}">
      <li class="item">
        <div class="prop">
          {if associationMode!="GND"}<label>${this.data.category.name}</label>{/if}
          {if this.data.category.description}  
              <div class="description"> 
                        <p>${this.data.category.description} </p>
                    </div> 
            {/if}
           {var selectedOption = null/}
           {var isDisabled = false /}
            {if this._selectedServices[this.data.selectedPax.paxNumber] && this._selectedServices[this.data.selectedPax.paxNumber][elementId]}      
              {set selectedOption = this._selectedServices[this.data.selectedPax.paxNumber][elementId]/}
              {if (selectedOption.state) && (selectedOption.state=="INITIAL")}
                {set isDisabled=true /}
              {/if}
            {/if}
            <select id="${elementId}" {if isDisabled} disabled {else/} {on change {fn:"selectService", scope:this, args:{options: serviceDropdown, elementId:elementId} } /}  {/if}>
            {if associationMode=="GND"}
                 {if !selectedOption}
                   {set selectedOption=serviceDropdown[1] /}
                  {/if}
                   {set service=selectedOption /}
               <option value="${selectedOption.serviceCode}" selected="selected" >
                ${selectedOption.label}</option>
                ${this.setServiceInSelectedServices(selectedOption, elementId)}
            {else /}
              {if serviceDropdown.length==2 && this.data.__pageLoadCounter<=services.length && this.moduleCtrl.getModuleData().framework.baseParams[11]=='BFLCBFLC'}
                {if !selectedOption}
                  {set selectedOption=serviceDropdown[1] /}
						      ${this.setServiceInSelectedServices(selectedOption, elementId)}
					      {/if}
                  ${aria.utils.Json.setValue(this.data, "__pageLoadCounter", this.data.__pageLoadCounter+1 )|eat}
				      {/if}
              {foreach service in serviceDropdown}
          			<option value="${service.serviceCode}" {if selectedOption && selectedOption.serviceCode==service.serviceCode} selected="selected" {/if} {if service.value=="EMPTY"}disabled selected{/if}>
                  ${service.label}
                </option>
              {/foreach}
            {/if}
            </select>
            {var enableDeleteButton = this.isDeleteButtonEnabled(elementId) /}
            <button class="" formaction="javascript:void(0)" {if !isDisabled } {on tap {fn: "onDeleteButtonClick", scope: this, args: {elementId: elementId}} /} {/if}><i class="icon-close"></i></button>
        </div>
        {if selectedOption && selectedOption.description}
              <div>
                <div class="description"> 
                    <p>${selectedOption.description} <strong></strong></p>
                </div>
              </div>
            {/if}
      </li>
      {section {
          type: "ul",
          attributes: {
            classList: ["itemContent"]
          },
          macro: {name: "displayService", scope: this, args: [servicesEligibleForPax, selectedOption, associationMode, elementId, instanceIndex ]}
      }/}
    </ul>
    {/for}
    {section {
      type: "footer",
      bindRefreshTo: [{inside: this.data, to: "refreshFooterFlag"}],
      macro: {name: "priceInfo", scope: this, args: [elementId, servicesEligibleForPax, selectedOption, associationMode]}
    }/}
  {/macro}
  {macro priceInfo(elementId, servicesEligibleForPax, selectedOption, associationMode)}    
    {var serviceCount = this.getServiceCount(elementId, associationMode)/}
    {var servicePrice = this.getServicePrice(elementId, servicesEligibleForPax, selectedOption)/} 
    {var totalServicePrice = Number(0).toFixed(2)/}  
    {if serviceCount!=0 && servicePrice!=0} 
      {if this._selectedServices[this.data.selectedPax.paxNumber][elementId].state=="INITIAL"}      
        {set totalServicePrice=(Number(servicePrice).toFixed(2))/}       
      {else/}
      {set totalServicePrice = Number(serviceCount*servicePrice).toFixed(2)/}
      {/if}      
    {/if}  
    <label><i class="icon-coin"></i>${serviceCount} ${this.data.category.name}</label>        
    <span class="data price total">${this.data.currency} ${totalServicePrice}</span>      
  {/macro} 
  {macro displayService(servicesEligibleForPax, selectedOption, displayType, elementId, instanceIndex)}
    {if selectedOption}
        {var service=null /}
        {foreach s in servicesEligibleForPax}
            {if s.code==selectedOption.serviceCode}
                {set service=s/}
            {/if}
        {/foreach}
        {var itineraryId = selectedOption.itineraryId/}
        {var segmentId = selectedOption.segmentId/}
        {var eligibility= selectedOption.eligibility /}
       {if service}
         {var serviceDisplayed = this.isServiceDisplayed(service)/}
          {if serviceDisplayed}
              // input parameter service
                  {if service.passengerAssociated}
                      {var selectedPaxId = this.data.selectedPax.paxNumber /}
                      {call displayInputParams(service, eligibility, displayType, elementId, itineraryId, segmentId, instanceIndex) /}
                       {var totalInstances = this._servicesTotalInstances[eligibility.eligibilityKey] || 1 /}
                       {if service.maxCardinality && (service.maxCardinality > totalInstances) && instanceIndex==totalInstances}
                            {if selectedOption.state!="INITIAL"}
                            <div class = "add" >
                               <button type = "button" class = "secondary" {on click {fn:"clickedAddService", args:{service:service, eligibility:eligibility, selectedOption: selectedOption, elementId:elementId}, scope:this} /}>
                                <i class = "icon-plus"> Add ${service.name} </i> </button>
                            </div>
                            {/if}
                       {/if}
                  {/if}//end if service.passengerAssociated
          {/if}//end if serviceDisplayed
        {/if} //end if service
    {/if} 
  {/macro} 
  {macro displayInputParams(service, eligibility, displayType, elementId, itineraryId, segmentId, instanceId)}
    {var travellerId= this.data.selectedPax.paxNumber /}
    {var eligibilityKey = eligibility.eligibilityKey/}
    {foreach property inArray eligibility.listProperties}
       {foreach inputParam inArray property.inputParams}
          {var isMandatory = isParamMandatory(property, inputParam) /}
          {if this.data.displayOptionalParamters || (!this.data.displayOptionalParamters && isMandatory)}
            {var inputPattern = moduleCtrl.getInputParamPattern(eligibilityKey,inputParam.inputTag, service.passengerAssociated, service.associationMode, itineraryId, segmentId, travellerId, instanceId) /}  
            {var isDisabled = this.isServiceDisabled(eligibility.eligibilityKey) /}
            {var helptext = "" /}
            {var displayBlock = false /}
            {var regex = null/}
            {var value = null/}
            {var maxValue = null /}
            {if inputParam.validationRegex}
              {set regex = inputParam.validationRegex/}
            {/if}
            {if inputParam.value}
              {set value = inputParam.value/}
            {/if}
            {if inputParam.maxValue}
              {set maxValue = inputParam.maxValue/}
            {/if}
            ${this.addInputParameterstoMap(elementId,eligibilityKey,inputPattern,property.code,regex,value,isMandatory, maxValue)}           
            {if inputParam.fieldType=="TEXTFIELD" }
              {if property.code=="WEIGHT" && inputParam.code!="UNIT"}
                  {call displayWeightCounter(inputParam.labelText,  isMandatory, isDisabled, inputPattern, elementId, eligibilityKey, maxValue) /}
              {elseif property.code=="NUMBER" /}
                  {call displayNumberField(inputParam.labelText, isMandatory, isDisabled, inputPattern, elementId, eligibilityKey) /}
              {else/}
                  {call displayTextField(inputParam.labelText, isMandatory, isDisabled, inputPattern, elementId, eligibilityKey) /}
              {/if}
            {elseif inputParam.fieldType == "SELECTBOX" /}
              {var availableValues = handleAvailableValues(inputParam) /}
              {call displaySelectBox(inputParam.labelText, isMandatory, isDisabled, inputPattern, availableValues, elementId, eligibilityKey) /}
            {elseif inputParam.fieldType == "CHECKBOX" /}
                {call displayCheckBox(inputParam.labelText, inputPattern, elementId, eligibilityKey) /}
            {elseif inputParam.fieldType == "DATE" /}
                {var attributes=null /}
                {if inputParam.attributes}
                  {set attributes=inputParam.attributes /}
                {/if}
               {call displayDatePicker(inputParam.labelText, isMandatory, isDisabled, inputPattern, attributes, elementId, eligibilityKey) /}
            {/if}
          {/if}
       {/foreach} //end of foreach inputparam
    {/foreach}  //end of property loop
  {/macro} 
  {macro displayNumberField(label, mandatory, disabled, inputPattern, elementId, eligibilityKey)}
    {var value = this.getInputParamValue(elementId, eligibilityKey, inputPattern)/}
    <li class="item">
      <div class="prop">
        <label>${label}{if mandatory}*{/if}</label>
        <input class="" type="text" value="${value}" maxlength="2" id="${inputPattern}" pattern="[0-9]*"
        {if disabled} disabled {else/} {on keyup {fn: "validateInputValue", scope:this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey }}/} {on blur {fn: "onInputParamChange", scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey }} /} {/if}>
      </div>
    </li>
  {/macro}
  {macro displayTextField(label, mandatory, disabled, inputPattern, elementId, eligibilityKey)}
    {var value = this.getInputParamValue(elementId, eligibilityKey, inputPattern)/}
    <li class="item">
      <div class="prop">
        <label>${label}{if mandatory}*{/if}</label>
        <input class="" type="text" value="${value}" id="${inputPattern}" {if disabled} disabled {else/} {on blur {fn: "onInputParamChange", scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey }} /}{/if}>
      </div>
    </li>
  {/macro}
  {macro displaySelectBox(label, mandatory, disabled, inputPattern, availableValues, elementId, eligibilityKey)}
      {var selectedOptionValue =this.getInputParamValue(elementId, eligibilityKey, inputPattern) /}
      {if selectedOptionValue == ""}
        {set selectedOptionValue = availableValues[0].value/}
      {/if}
      <li class="item">
      <div class="prop">
        <label>${label}{if mandatory}*{/if}</label>
          <select id="${inputPattern}" {if disabled} disabled {else/} {on change {fn: "onInputParamChange", scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey }} /} {/if}>
            {foreach avail in availableValues}
                  <option value="${avail.value}" {if avail.value == selectedOptionValue} selected="selected" {/if} {if avail.value==""} disabled selected {/if}>${avail.label}</option>
            {/foreach}
          </select>
      </div>
    </li>
  {/macro}
  {macro displayCheckBox(label, inputPattern, elementId, eligibilityKey)}
   {var value =this.getInputParamValue(elementId, eligibilityKey, inputPattern) /}
   {var checked=false /}
   {if value==1} {set checked=true /} {/if}
          <li>
            <div>
              <label>${label}</label>
              <div class="onoffswitch" {on click {fn: "toggleCheckBox", scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey }} /}>
                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="servicesOnOffSwitch_${elementId}" {if checked} checked {/if} />
                <label class="onoffswitch-label" >
                <div class="onoffswitch-inner">
                   <div class="onoffswitch-active">${this.labels.tx_merciapps_msg_yes}</div>
                  <div class="onoffswitch-inactive">${this.labels.tx_merciapps_msg_no}</div>
                </div>
                <div class="onoffswitch-switch"></div>
                </label>
              </div>
      </div>
    </li>
  {/macro}
  {macro displayDatePicker(label, mandatory, disabled, inputPattern, attributes, elementId, eligibilityKey)}
  {var selectedDateValue=this.getInputParamValue(elementId, eligibilityKey, inputPattern) /}
     {var inputPresentationFormat="" /}
   {if attributes && attributes.INPUT_PRESENTATION_FORMAT} 
      {set inputPresentationFormat=attributes.INPUT_PRESENTATION_FORMAT /} 
    {/if}
      <li class="item">
        <div class="prop">
          <label>${label}{if mandatory}*{/if}</label>
          //{if this.data.showNewDatePicker}
          <input type="text" {if disabled} disabled="disabled" {/if} class="ancillaryDatePicker" data-value="${selectedDateValue}" data-elementId="${elementId}" data-eligKey="${eligibilityKey}" id="${inputPattern}" data-inputFormat="${inputPresentationFormat}" />       
        </div>
      </li>
  {/macro}
  {macro displayWeightCounter(label,  mandatory, disabled, inputPattern, elementId, eligibilityKey, maxValue)}
   {var value = this.getInputParamValue(elementId, eligibilityKey, inputPattern)/}
    {var travellerId= this.data.selectedPax.paxNumber /}
   {var weightId= "weight_"+travellerId+"_"+elementId /}
   {if !value || value==""}
      {set value=0 /}
    {/if}
    <li class="item">
      <div class="prop">
        <label>${label}{if mandatory}*{/if}</label>
        <button type="button" class="decrease" {if !disabled}{on click {fn: this.incrValue, scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey, value:-1, id:weightId}} /}{/if}><span>Decrease</span></button>
        <input  type="number" id="${weightId}" value="${value}" {if maxValue}max="${maxValue}"{/if} min="0" readonly="" {if disabled}disabled=""{/if}/>
        <button type="button" class="increase" {if !disabled}{on click {fn: this.incrValue, scope: this, args: {elementId: elementId, paramId: inputPattern, eligibilityKey: eligibilityKey, value:1, id:weightId}} /}{/if}><span>Increase</span></button>
      </div>
    </li>
  {/macro}
  {macro footerButtons()}
      <button type="submit" formaction="javascript:void(0);" class="validation{if this.data.disableContinue} disabled{/if}"
           {if !this.data.disableContinue}{on click {fn: this.confirm, scope: this} /}{/if}>
        ${this.labels.tx_merci_text_addbag_btncont}
      </button>
      <button type="submit" formaction="javascript:void(0);" class="validation cancel"
           {on click {fn: this.moduleCtrl.navigateToCatalog, scope: this.moduleCtrl} /}>
        ${this.labels.tx_merci_text_addbag_btncancel}
      </button>
  {/macro}
  {macro assistanceMessage()}
    <div class="message info"{if !this.data.disableContinue && this.data.category.code=="SPE"}style="display:block;" {else/} style="display:none;" {/if}>
      <h2>${this.labels.tx_merci_services_assistance_request_save}</h2>
      <p>${this.labels.tx_merci_services_assistance_contact}</p>
      <ul>
        <li>${this.labels.tx_merci_services_assistance_phone} :<strong class="big">${this.data.siteServicesPhone}</strong></li>
        <li>${this.labels.tx_merci_services_assistance_mail} :<strong  class="big">${this.data.siteServicesEmail}</strong></li>
      </ul>
    </div>
  {/macro}
  {macro includeError(labels)}
    {section {
      id: 'errors',
      bindRefreshTo : [{
        inside : this.data,
        to : 'error_msg'
      }],
      macro : {
        name: 'printErrors',
        args: [labels]
      }
    }/}
  {/macro}
  {macro printErrors(labels)}
    {if this.data.errors != null && this.data.errors.length > 0}
      {var errorTitle = ''/}
      {if labels != null && labels.tx_merci_text_error_message != null}
        {set errorTitle = labels.tx_merci_text_error_message/}
      {/if}
      {call message.showError({list: this.data.errors, title: errorTitle})/}
    {/if}
    // resetting binding flag
    ${aria.utils.Json.setValue(this.data, 'error_msg', false)|eat}
  {/macro}
{/Template}