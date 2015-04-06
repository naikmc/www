{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MSports",
  $hasScript: true,
  $macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

  {macro refreshMessages()}{call message.showAllMessages(this.data.messages) /}{/macro}

  {macro main()}
    <section>
      <form>
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'refreshMessages', scope: this},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}

        <article class="panel">
          <header>
            {@html:Template {
              defaultTemplate: "modules.view.merci.common.templates.MPaxSelector",
              data: {
                passengers: this.tripplan.paxInfo.travellers,
                selectCallBack: {fn: this.selectPax, scope: this},
                selectedPaxIndex: this.data.defaultPaxIndex
              },
              block: true
            }/}
          </header>
		  
		  {foreach bound inArray this.tripplan.air.itineraries}
			  {section {
				type: "section",
				attributes: {classList:["services","add-service"]},	
				bindRefreshTo:[{inside: this.data.sportsData, to: "selectedPax"}],
				macro: {name: "sportsInputs", scope: this, args: [bound,bound_index]}
			  }/}
		  {/foreach}
		  
        </article>
        {section {
          type: "footer",
          attributes: {
            classList: ["buttons"]
          },
          bindRefreshTo: [{inside: this.data, to: "disableContinue"}],
          macro: {name: "footerButtons", scope: this}
        }/}
      </form>
    </section>
  {/macro}
  
  {macro sportsInputs(bound,bound_indx)}  
			
	  {var sportsData = this.data.sportsData.selectedPax.bounds[bound_indx] /}
	  
	  <header>
		<h2 class="subheader">
			<span>${bound.beginLocation.cityName} - ${bound.endLocation.cityName}</span>
			<button type="button" role="button" class="toggle" aria-expanded="true" aria-controls="sec0${bound_indx}" ><span>Toggle</span></button>
		</h2>
	  </header>
	  <div id="sec0${bound_indx}">
		  <ul>		
			  {if sportsData.available}				  
				  {section {
					type: "li",
					attributes: {
						classList: ["item"]
					},	
					bindRefreshTo:[{inside: sportsData, to: "itemsAddedVar"}],
					macro: {name: "sportsInput", scope: this, args: [sportsData]}
				  }/}        				
			  {else/}
				<section>${this.utils.formatString(this.labels.tx_merci_services_notavailable, this.data.sportsName)}</section>
			  {/if}
		  </ul>
		  <div class="add">
		<button type="button"   class="secondary length" {on click {fn: this.addItems, scope: this, args: [bound_indx,this.data.sportsData.selectedPax]} /} >
		<i class="icon-plus" > </i>Add equipment </button>
		  </div>
	  </div> 
{section {
			type: "footer",
			id: "priceQtySection",
			bindRefreshTo:[{inside: sportsData, to: "current"}],
			macro: {name: "priceSection", scope:this, args:[sportsData]}
		}/}
  {/macro}
  {macro priceSection(sportsData)}
  			{var itemsCount = this.getTotalItems(sportsData) /}
				{var price = this.getTotalPrice(sportsData) /}
			  
			<label><i class="icon-coin"></i>${itemsCount} Equipment(s)</label>
			<span class="data price total">${this.data.currency} ${price}</span>		
			 			
    
  {/macro}
  
  {macro sportsInput(sportsData)}
    
    {var listProperties = this.data.listProperties /}
    {foreach item in sportsData.itemsList} 
    {var currentState = item.choice ? item.choice.state : '' /}
    {var disabled = this.data.disableModif && currentState==this.STATE_BOOKED /}
		<li class = "item" {id item.id/}>

			
			<ul>
				<li class="prop type">
					<label>Equipment:</label>
						{var currentCode = item.choice ? item.choice.code : '' /}
						
						<select id="type_${item.id}" /*{id "type_"+item.id /}*/  {if disabled}disabled=""{else/}{on change {fn: this.setValue, scope: this, args:{ itemId:item.id, srvCode:currentCode, sportsData:sportsData, state:currentState} }/}{/if}>
							 <option disabled selected>No special equipment</option>
							{foreach choice in sportsData.choices}
								{if (choice.TYPE)}
								{if item.choice}
									{set currentCode = item.choice.typeCode ? item.choice.typeCode : currentCode /}
								{/if}
									{for var t=0; t<choice.TYPE.length; t++}
										<option data-typecode="${choice.TYPE[t].code}" value="${choice.serviceCode}"  {if currentCode == choice.TYPE[t].code} selected="selected" {/if}> ${choice.TYPE[t].name} </option>
									{/for}
								{else /}
										<option value="${choice.serviceCode}" {if currentCode === choice.serviceCode} selected="selected" {/if}> ${choice.name} </option>
								{/if}
							{/foreach}
						</select>
					</li>

					<li class="prop number priced">
					  <label>Number:</label>
					  {var currentPrice = 0.00 /}
					  {var currentQuantity = null /}
					  
					  {if (item.choice) }
					  	{set currentPrice = item.choice.price /}
					  	{if (item.choice.quantity)}
					  		{set currentQuantity=item.choice.quantity /}
					  	{/if}
					  {/if}
					  <select id="number_${item.id}" /*{id "number_"+item.id /}*/ {on change {fn:this.setNumberValue, scope:this, args:{id: item.id, sportsData:sportsData}} /}>
					  {var cardinality=8 /}

					  		<option disabled selected >  0 X ${this.data.currency}  ${currentPrice.toFixed(2)} </option>
					  {for var i=1; i<=cardinality; i++}
							<option value="${i}" {if i==currentQuantity} selected="selected" {/if}>  ${i} X ${this.data.currency}  ${currentPrice.toFixed(2)} </option>
						{/for}
						
					  </select>
					</li>
					<li class="prop deleteServ">
					  <button class="" formaction="javascript:void(0)" {if currentState!=this.STATE_BOOKED} {on click {fn: this.__deleteItems, scope: this, args: item.id}/} {/if}>
					  <i class="icon-close"></i></button>
					</li>	
					
				  </ul>   

		</li>
		{/foreach}
	
       
    
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
  
  
  
{/Template} 