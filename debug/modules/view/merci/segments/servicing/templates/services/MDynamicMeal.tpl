{Template{
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MDynamicMeal',
	$hasScript: true,
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
  $macrolibs: {
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
            /*attributes: {
	            classList: ["services", "add-service"]
	          },*/
            bindRefreshTo:[{inside: this.data.mealsData, to: "selectedPax"}],
            macro: {name: "mealsInputs", scope: this}
          }/}
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

  {macro mealsInputs()}
    
      {foreach segment inArray this.data.mealsData.selectedPax.segments}
        <section class= "services add-service">
        {var mealsData = this.data.mealsData.selectedPax.segments[segment_index] /}
        {if segment.boundId !== 0 && segment_index !== 0}{/if}
        <header>
          <h2 class="subheader">
            <span>${segment.beginLocation.cityName} - ${segment.endLocation.cityName}</span>
            <button id="btn${segment.boundId}${segment_index}" role="button" type="button" class="toggle" aria-expanded="true" aria-controls="sec${segment.boundId}${segment_index}" 
                      {on click {fn: this.toggleSegment, scope: this, args:this} /}
            ><span>Toggle</span></button>
          </h2> 
        </header>

        <div class="meal-selection" id="sec${segment.boundId}${segment_index}">
			{if mealsData.available}
				  {section {
					type: "ul",							
					bindRefreshTo:[{inside: this.data.mealsData.selectedPax.segments[segment_index],to:"itemsAddedVar"}],
					macro: {name: "mealInput", scope: this, args: [mealsData,segment]}
				  }/}

        {var serviceName = "Meal(s)" /}
        {if !this.utils.isEmptyObject(this._catalog.getCategory(this.CATEGORY_MEAL)) && (this._catalog.getCategory(this.CATEGORY_MEAL).code!=this._catalog.getCategory(this.CATEGORY_MEAL).name)}
            {set serviceName = this._catalog.getCategory(this.CATEGORY_MEAL).name/}
        {/if}
				<div class="add">
					<button type="button"  {if (this.areMealsAvailable(mealsData))} class="secondary length" {on click {fn: this.addItems, scope: this, args: [segment.boundId,segment_index, this.data.mealsData.selectedPax]} /} {else/} class="secondary disabled" {/if}>
						<i class="icon-plus" ></i>${this.utils.formatString(this.labels.tx_merci_services_add_service,serviceName)}
					</button>
				</div>	
			{else/}
			  <section>${this.labels.tx_pltg_text_NoSpecialMeal}</section>
			{/if}	        
		</div>
			 	<footer>
			 		{var itemsCount = mealsData.items.length /}
			 		{var price = 0.0 /}
					  <label><i class="icon-coin"></i>${itemsCount} ${this.labels.tx_merci_services_meal_multiple}</label>
					  {foreach item in mealsData.items}
						{if item.choice != null && item.choice.price != null}
							{set price +=  item.choice.price /}
						{/if}
					  {/foreach}
					  <span class="data price total">${this.data.currency} ${price}</span> 
				</footer>
        </section>
      {/foreach}
  {/macro}
  {macro mealInput(mealsData,segment)}
  	{foreach item in mealsData.items}
			<li class = "item" id="${item.id}">
				<ul>
					<li class="prop type">
						<label for="meals${segment.id}">${this.labels.tx_merci_services_meal}</label>
	          {var currentCode = item.choice ? item.choice.code : '' /}
	          {var disabled = this.data.disableModif &&  item.state==this.STATE_BOOKED /}
	          <select id="meal_${item.id}" {if disabled}disabled=""{else/}{on change {fn: this.setValue, scope: this, args:{ mealsData:mealsData, itemId:item.id, state:item.state, code:currentCode}} /}{/if}>
                <option disabled selected>${this.labels.tx_pltg_text_NoSpecialMeal}</option>
                {foreach meal in mealsData.multipleMealLists[item_index].choice}
	              <option value="${meal.code}" {if currentCode === meal.code}
	              															 {set currentCodeName = meal.name /} 
	              															 {if meal.price}
	              															 		{var currentCodePrice = this.data.currency+" "+meal.price /}
	              															 	{elseif mealsData.hasChargeable /}
	              															 		{set currentCodePrice = this.labels.tx_merci_services_free /}
	              															 	{/if} }
	              																selected="selected"
	              															{/if}>
                    ${meal.name}{if meal.price} - ${this.data.currency} ${meal.price}{elseif mealsData.hasChargeable /} - ${this.labels.tx_merci_services_free}{/if}
                  </option>
                {/foreach}
              </select>
	        </li>	           
	 				<li class="prop deleteServ">
            <button class="" formaction="javascript:void(0)" {on click {fn: this.__deleteItems, scope: this, args: 
            {itemId: item.id, currentCode: currentCode } }/}>
							<i class="icon-close"></i>
						</button>
	 				</li>
	 			</ul>
	 			{var link = this.utils.getStaticLinkURL('meals'+'.png','img') /}
	 			<div class="description hidden" {if currentCode != null && currentCode == ""} style="display:none;" {/if}> <img src="" width="107" height="71">
	        <div>
	          <h4><strong>{if currentCode != null && currentCode != ""}${currentCodeName}{/if}</strong></h4>
	          <p>Meal description, this section could have a meal picture and could have a price <strong>${currentCodePrice}</strong></p>
            </div>
          </div>
	 		</li>
      {/foreach}

  {/macro}

  {macro footerButtons()}
      <button type="submit" formaction="javascript:void(0);" class="validation{if this.data.disableContinue} disabled{/if}"
           {if !this.data.disableContinue}{on click {fn: this.confirm, scope: this} /}{/if}>
        ${this.labels.tx_merci_text_mealsel_save}
      </button>
      <button type="submit" formaction="javascript:void(0);" class="validation cancel"
           {on click {fn: this.moduleCtrl.navigateToCatalog, scope: this.moduleCtrl} /}>
        ${this.labels.tx_merci_text_mealsel_cancel}
      </button>
  {/macro}

{/Template}