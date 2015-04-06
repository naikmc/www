{Template{
$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MInsurance",
$hasScript: true,
$dependencies: ['modules.view.merci.common.utils.URLManager']
}}
{macro main()}
{call insuranceSection()/}
{/macro}
{macro insuranceSection()}
{var urlBaseParams = modules.view.merci.common.utils.URLManager.getBaseParams()/}
{var ins = this.getInsuranceToDisplay() /}
{if ins}
<div>
  <article class="panel">
      <header>
         <h1>${this.labels.tx_merci_text_booking_ins_label}
            <button class="toggle" role="button" type="button" id="insuranceHeader" aria-expanded="true" {on click {fn:"toggleExpand", args : {sectionId: 'insurance_Section', buttonId: 'insuranceHeader'}, scope: modules.view.merci.common.utils.MCommonScript} /}>
         </h1>
         </button>
      </header>
      <section id="insurance_Section"  aria-hidden="false">
         <div class="services-catalog">
            <div class="draggable-parent">
               <div>
                  <ul class="services-checked draggable">
                     <li>
                        <a class="secondary expanded" {on click {fn:goToInsurancePage,scope: this} /}>
                        <span><img src="${urlBaseParams[0]}://${urlBaseParams[1]}:${urlBaseParams[2]}${urlBaseParams[10]}/default/${urlBaseParams[9]}/static/merciAT/modules/common/img/insurance.jpg"/>
                        <p class="label">${this.labels.tx_merci_text_booking_ins_label}</p>
                        <p class="price">${ins.priceLabel} ${ins.price}</p>
                        </a>
                     </li>
                  </ul>
               </div>
               <div class="secondary-services-promo">
                  <p><span><i aria-hidden="true" class="icon icon-tick"></i></span><span class="custom">${ins.selectionLabel}</span></p>
               </div>
            </div>
         </div>
      </section>
   </article>
</div>
{/if}
{/macro}
{/Template}