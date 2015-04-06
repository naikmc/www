{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MInstallmentDetail',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.StringBufferImpl',
    'modules.view.merci.common.utils.MCommonScript'
	],
	$hasScript: true
}}

{macro main()}
{var numOfInst=this.data.rqstParams.installmentPlanDetails.numberOfInstallments /}
{var monetaryDetails=this.data.rqstParams.installmentPlanDetails.monetaryDetails /}
{var currencyCode=this.data.rqstParams.installmentPlanDetails.currencyCode /}
{var totalAmount=this.data.rqstParams.fareBreakdown.sumWithoutFees /}
{var merciFunc=modules.view.merci.common.utils.MCommonScript /}

{var firstInst=null /}
{var nextInst=null /}
{var interest=null /}

{for var i=0; i<monetaryDetails.length; i++}
  {if monetaryDetails[i].TYPE=="ISF"}
    {set firstInst=merciFunc.printCurrency(monetaryDetails[i].AMOUNT.VALUE, 2) /}
  {elseif monetaryDetails[i].TYPE=="ISN" /}
     {set nextInst=merciFunc.printCurrency(monetaryDetails[i].AMOUNT.VALUE, 2) /}
  {elseif monetaryDetails[i].TYPE=="ISI" /}
       {set interest=merciFunc.printCurrency(monetaryDetails[i].AMOUNT.VALUE, 2) /}
  {/if}
{/for}

	 <article class="panel sum installments">
      <header>
        <h1>${this.data.labels.tx_merci_txt_installment_plan}</h1>
      </header>
      <section>
        <div class="installments purchasePage">
          <ul>
          {for var i=0; i<numOfInst; i++}
            <li id="month${i+1}"><span>${this.data.labels.tx_merci_txt_str_installment} ${i+1}</span> <span class="value">${currencyCode} {if i==0} ${firstInst} {else/} ${nextInst} {/if}</span></li>
          {/for}
          </ul>
        </div>
      </section>

      <div class="installmentsControl"><span class="strong">${this.data.labels.tx_merci_txt_total_installment_plan}</span><span class="value"> ${currencyCode} ${(totalAmount).toFixed(2)}</span> </div>

      <section>
      {if interest!=0}
        <p class="inclusiveText">${this.data.labels.tx_merci_txt_installment_fees}  ${currencyCode} ${interest}</p>
      {/if}
      </section>
    </article>


{/macro}

{/Template}