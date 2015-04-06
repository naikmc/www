{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MAssistance",
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
		  {section {
			type: "section",
			attributes: {classList:["services","add-service"]},	
			bindRefreshTo:[{inside: this.data.assistanceData, to: "selectedPax"}],
			macro: {name: "assistanceInputs", scope: this}
		  }/}		  
        </article>
		{section {
          type: "div",          
          bindRefreshTo: [{inside: this.data, to: "disableContinue"}],
          macro: {name: "assistanceMessage", scope: this}
        }/}
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
  {macro assistanceInputs()}  
	  {var assistanceData = this.data.assistanceData.selectedPax /}
	  <header>
		<h2 class="subheader">
			<span>FOR YOUR TRIP</span>
			<button type="button" role="button" class="toggle" aria-expanded="true" aria-controls="sec00" ><span>Toggle</span></button>
		</h2>
	  </header>
	  <div id="sec00">		  		
		  {if assistanceData.available}				  
			  {if parseInt(assistanceData.booked)}
				${this.utils.formatString(this.labels.tx_merci_text_addbag_already_added, assistanceData.booked, this.labels.tx_merci_addbag_pieces)}<br>
			  {/if}          
			  {section {
				type: "ul",				
				bindRefreshTo:[{inside: assistanceData, to: "current"},{inside: this.data.assistanceData.selectedPax, to: "itemsAddedVar"}],
				macro: {name: "assistanceInput", scope: this, args: [assistanceData]}
			  }/}        				
		  {else/}
			<section>${this.utils.formatString(this.labels.tx_merci_services_notavailable, this.data.assistanceName)}</section>
		  {/if}		  
		  <div class="add">
			<button type="button" class="secondary" {on click {fn: this.addItems, scope: this} /}><i class="icon-plus" ></i> Add assistance</button>
		  </div>
	  </div>	 	
  {/macro}
  {macro assistanceInput(assistanceData)}
    {foreach item in assistanceData.items}
		<li class="item" id="${item.id}">
		  <ul>
			<li class="prop type">
				<label>Assistance request</label>
				{var disabled = this.data.disableModif && item.state==this.STATE_BOOKED /}
				{var currentCode = item.choice ? item.choice.code : '' /}
				<select {if disabled}disabled=""{else/}{on change {fn: this.setValue, scope: this, args: {assistanceData:assistanceData, itemId:item.id, state:item.state}} /}{/if}>
					<option value="0"></option>
					{foreach choice in assistanceData.choices}
					  {var selected = (currentCode==choice.code) /}
					  <option value="${choice.code}" {if selected}selected="selected"{/if}>
					  ${choice.name}
					  </option>
					{/foreach}
				</select>			
			</li>
			<li class="prop deleteServ">
			  <button class="" formaction="javascript:void(0)" {if item.state!=this.STATE_BOOKED}{on click {fn: this.__deleteItems, scope: this, args: item.id}/}{/if}><i class="icon-close"></i></button>
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
  {macro assistanceMessage()}
	<div class="message info"{if this.data.disableContinue}style="display:none;" {else/} style="display:block;" {/if}>
	  <h2>Your assitance request will be saved</h2>
	  <p>Due to your disability please contact us as soon as possible after your booking is made: </p>
	  <ul>
		<li>by phone: <strong class="big">${this.data.siteServicesPhone}</strong></li>
		<li>or by mail: <strong  class="big">${this.data.siteServicesEmail}</strong></li>
	  </ul>
	</div> 
  {/macro} 
{/Template} 