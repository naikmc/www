{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.NationalityNew',
$macrolibs : {
    common : 'modules.checkin.templates.lib.Common'
  },
$hasScript: true
}}

  {macro main()}

    {var cpr = moduleCtrl.getCPR() /}
    {var selectedcpr = moduleCtrl.getSelectedPax() /}
    {var natEditcpr = moduleCtrl.getNatEditCPR() /}
    {var productView = cpr.customerLevel[0].productLevelBean/}
    {var label = moduleRes.res.Nationality.label /}

	{if productView != null}
      <div class='sectionDefaultstyle'>
      <section>
        <div id="natErrors"></div>
        <form {on submit "onSaveClick"/}>

          <!-- Breadcrumbs -->

          <nav class="breadcrumbs">
            <ul>
              <li><span>1</span></li>
              <li class="active"><span>2</span><span class="bread"></span></li>
              <li><span>3</span></li>
              <li><span>4</span></li>
            </ul>
          </nav>

          <!-- Message -->

          <div class="message info">
          <p>${label.NationalityInfo}</p>
          </div>

          {var totalNationalityCount=0 /}
          <article class="panel">

              <div id="wrap">

              <ul id="mycarousel" class="jcarousel-skin-tango">
                      {foreach selection in  selectedcpr}
						 /* Passengers */
						{if selection_index == 0}

							{foreach customer inArray selection.customer}
								{set totalNationalityCount+=1 /}
								<li>
								<span class="pax">${customer_index+1}</span>
								{var namePrefix="" /}
								{if cpr.customerLevel[customer].otherPaxDetailsBean[0].title}{set namePrefix=cpr.customerLevel[customer].otherPaxDetailsBean[0].title /}{else /}{set namePrefix="" /}{/if}
								<span class="paxName">${jQuery.substitute(label.PaxName, [namePrefix, cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName, cpr.customerLevel[customer].customerDetailsSurname])} {if cpr.customerLevel[customer].customerDetailsType == "IN"}<small>(${label.Infant})</small>{/if}</span>

								</li>
							{/foreach}
						{/if}
					   {/foreach}

              </ul>
             <span id="leftArrow">0</span> <span id="rightArrow">${totalNationalityCount}</span>

                  </div>

            <section class="form">
              <ul class="input-elements">



      {foreach selection in  selectedcpr}

        {if selection_index == 0}

          {foreach customer inArray selection.customer}

				{var natReq = "" /}

				{var indicators = cpr.customerLevel[customer].productLevelBean[selection.product].productLevelIndicatorsBean /}

				{foreach indicator inArray indicators}

				 {if indicator.attribute == "NRA"}

				  {set natReq = true /}

				 {/if}

				{/foreach}

				/* If nationality is required,then provide dropdown list to select nationality */
				{if natReq }
						 {var code = "" /}
                         /* Set nationalitycode into code */
						 {if natEditcpr == null}

						  {if cpr.customerLevel[customer].productLevelBean[selection.product].nationalityBean != null}

							   {set code = cpr.customerLevel[customer].productLevelBean[selection.product].nationalityBean[0].nationalityNationalityCode /}

							{elseif cpr.customerLevel[customer].productLevelBean[selection.product].regulatoryDocumentDetailsBean /}

							   {if cpr.customerLevel[customer].productLevelBean[selection.product].regulatoryDocumentDetailsBean[0].documentIssuingCountries}
  												{set code = cpr.customerLevel[customer].productLevelBean[selection.product].regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code /}

						     {/if}
						   {/if}

						 {/if}

						 {if natEditcpr != null}
								{foreach cust inArray natEditcpr.customerLevel}
								  {if cust.uniqueCustomerIdBean.primeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
									 {foreach prod inArray cust.productLevelBean}
										{if prod.productIdentifiersBean[0].primeId == cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId }
										  {if prod.nationalityBean != null}
											  {set code = prod.nationalityBean[0].nationalityNationalityCode /}
										  {elseif prod.regulatoryDocumentDetailsBean /}
  											{if prod.regulatoryDocumentDetailsBean[0].documentIssuingCountries}
  												{set code = prod.regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code /}
  											{/if}
										  {/if}
										{/if}
									 {/foreach}
								  {/if}
								{/foreach}
						 {/if}

						 {var natval = "" /}

						 {if moduleCtrl.getCountryCode()}
						  {set natval = moduleCtrl.getCountryCode() /}
					     {else/}
						  {set natval= code /}
					     {/if}

						/* FOR SHOWING FIRST PAX WHEN LAND ON TO NATIONALITY PAGE */
						{if customer_index == 0}
							<li class="nationality">
							  <label for="nationality">Nationality</label>
							  /*{@aria:AutoComplete {
                resourcesHandler : getNationsHandler(1),
                bind: {
                    "value": { inside: JSONData, to: "SelectedNationality" }
                },
                onchange : {
                    fn : onChange
                },
                id : 'nationality_code_'+customer+'_'+selection.product,
                name : 'nationality_code_'+customer+'_'+selection.product
                }/}*/
							  <input type="text" value="${natval}" maxlength="3" {if natval != ""}readonly="readonly"{/if} id="nationality_code_${customer}_${selection.product}" name="nationality_code_${customer}_${selection.product}">
							</li>
						{else /}
							<li style="display:none" class="nationality">
							  <label for="nationality">Nationality</label>
							  /*{@aria:AutoComplete {
                resourcesHandler : getNationsHandler(1),
                bind: {
                    "value": { inside: data, to: "result" }
                },
                onchange : {
                    fn : onChange
                },
                id : 'nationality_code_'+customer+'_'+selection.product,
                name : 'nationality_code_'+customer+'_'+selection.product
                }/}*/
							  <input type="text" value="${natval}" maxlength="3" {if natval != ""}readonly="readonly"{/if} id="nationality_code_${customer}_${selection.product}" name="nationality_code_${customer}_${selection.product}">
							</li>
						{/if}
				{/if}
           {/foreach}

          {/if}

      {/foreach}


	{/if}





          </ul>


            </section>
          </article>
          <footer class="buttons">

            /* {var handlerName = MC.appCtrl.registerHandler(this.onSaveClick, this)/}
            ${uiResponseEvent}="${handlerName}(event);" */
            <button class="validation" type="submit">${label.Continue}</button>

            {var handlerName = MC.appCtrl.registerHandler(this.onBackClick, this)/}
             <button class="validation cancel"  ${uiResponseEvent}="${handlerName}(event);" type="button">${label.Cancel}</button>

          </footer>
        </form>
      </section>
    </div>
  {/macro}
{/Template}