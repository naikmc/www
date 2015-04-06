{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.services.MBaggage",
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
            type: "section",
            bindRefreshTo:[{inside: this.data.bagData, to: "selectedPax"}],
            macro: {name: "bagInputs", scope: this}
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

  {macro bagInputs()}
    {foreach bound inArray this.tripplan.air.itineraries}
      {var bagData = this.data.bagData.selectedPax.bounds[bound_index] /}
      {if bound_index !== 0}<br>{/if}
      <header>
        <h2 class="subheader"><span>${bound.beginLocation.cityName} - ${bound.endLocation.cityName}</span></h2>
      </header>
      {if bagData.available}
        {if bagData.pieces}
          {var piecesData = bagData.pieces /}
          {if parseInt(piecesData.booked)}
            ${this.utils.formatString(this.labels.tx_merci_text_addbag_already_added, piecesData.booked, this.labels.tx_merci_addbag_pieces)}<br>
          {/if}
          ${this.labels.tx_merci_addbag_selectpieces}
          {section {
            type: "section",
            attributes: {classList: ["services", "add-service", "bag"]},
            bindRefreshTo:[{inside: piecesData, to: "current"}],
            macro: {name: "bagInput", scope: this, args: [piecesData]}
          }/}
        {elseif bagData.weight/}
          {var weightData = bagData.weight /}
          {if parseInt(weightData.booked)}
            ${this.utils.formatString(this.labels.tx_merci_text_addbag_already_added, weightData.booked, weightData.unit)}<br>
          {/if}
          ${this.labels.tx_merci_addbag_selectweight}
          {section {
            type: "section",
            attributes: {classList: ["services", "add-service", "bag"]},
            bindRefreshTo:[{inside: weightData, to: "current"}],
            macro: {name: "bagInput", scope: this, args: [weightData]}
          }/}
        {/if}
      {else/}
        <section>${this.utils.formatString(this.labels.tx_merci_services_notavailable, this.data.bagName)}</section>
      {/if}
    {/foreach}
  {/macro}

  {macro bagInput(bagData)}
    <ul>
      <li>
        {var disabled = this.data.disableModif && parseInt(bagData.booked) /}
        {if bagData.inputType === this.INPUT_FREE}
          <button type="button" class="decrease" {if !disabled}{on click {fn: this.incrValue, scope: this, args: [bagData, -1], apply: true} /}{/if}><span>Decrease</span></button>
          <input  type="number" value="${bagData.current.value}" {if bagData.max}max="${bagData.max}"{/if} min="0" readonly="" {if disabled}disabled=""{/if}/>
          <button type="button" class="increase" {if !disabled}{on click {fn: this.incrValue, scope: this, args: [bagData, 1], apply: true} /}{/if}><span>Increase</span></button>
        {elseif bagData.inputType === this.INPUT_MULTIPLE /}
          <select {if disabled}disabled=""{else/}{on change {fn: this.setValue, scope: this, args: bagData} /}{/if}>
            <option value="0"></option>
            {foreach choice in bagData.choices}
              {var selected = (bagData.current && choice.value === bagData.current.value) /}
              <option value="${choice.value}" {if selected}selected="selected"{/if}>${choice.value} ${bagData.unit|default:""} - ${this.data.currency} ${choice.price.toFixed(2)}</option>
            {/foreach}
          </select>
        {/if}
      </li>
      <li>
        <label>${this.labels.tx_merci_text_addbag_exsbag}:</label>
        {var price = bagData.current ? bagData.current.price.toFixed(2) : "0.00" /}
        <span class="data price total">${this.data.currency} ${price}</span>
      </li>
    </ul>
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