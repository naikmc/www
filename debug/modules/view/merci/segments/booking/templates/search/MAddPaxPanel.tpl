{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MAddPaxPanel',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib', tablet: 'modules.view.merci.common.utils.MerciTabletLib'},
	$hasScript: true
}}



	{macro main()}

			{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList/}
			<div class="spanel" id="spanelPxtypes">
				<article class="panel">
					<header>
						<h1 class="cust_hadd_pax">${labels.tx_mc_text_addPax}</h1>
					</header>
					<section id="wrapper">

						<ul class="list-view pxTypes">
								{foreach paxTypeNames in gblLists.paxType}

									{if (paxTypeNames[0]=="ADT")}
										<li class="type-adult"> <a href="javascript:void(0)" id="paxTypeAdt" {on tap {fn: 'selectPaxType', scope: this, args:"paxTypeAdt"}/} class="type-selected"> ${labels.tx_merci_text_booking_adult}&nbsp;<small><span>(${labels.tx_mc_text_addPax_adtAge})</span></small></a> </li>
									{/if}

									{if (paxTypeNames[0]=="CHD")}
										<li class="type-child"> <a href="javascript:void(0)" id="paxTypeChd" {on tap {fn: 'selectPaxType', scope: this, args:"paxTypeChd"}/} >${labels.tx_merci_text_booking_child}&nbsp;<small><span>(${labels.tx_mc_text_addPax_chdAge})</span></small></a> </li>
									{/if}


									{if (paxTypeNames[0]=="INF")}
										<li class="type-infant"> <a href="javascript:void(0)" id="paxTypeInf" {on tap {fn: 'selectPaxType', scope: this, args:"paxTypeInf"}/}>${labels.tx_merci_text_booking_infant}&nbsp;<small><span>(${labels.tx_mc_text_addPax_infAge})</small></a> </li>
									{/if}

									{if (paxTypeNames[0]=="YCD")}
										<li class="type-senior"> <a href="javascript:void(0)" id="paxTypeSnr" {on tap {fn: 'selectPaxType', scope: this,args:"paxTypeSnr"}/}>${labels.tx_mc_text_addPax_snr}&nbsp;<small><span>(${labels.tx_mc_text_addPax_ycdAge})</small></a> </li>
									{/if}

									{if (paxTypeNames[0]=="STU")}
										<li class="type-student"> <a href="javascript:void(0)" id="paxTypeStu" {on tap {fn: 'selectPaxType', scope: this,args:"paxTypeStu"}/}>${labels.tx_mc_text_addPax_stdnt}&nbsp;<small><span>(${labels.tx_mc_text_addPax_stuAge})</small></a> </li>
									{/if}

									{if (paxTypeNames[0]=="YTH")}
										<li class="type-youth"> <a href="javascript:void(0)" id="paxTypeYth" {on tap {fn: 'selectPaxType', scope: this, args:"paxTypeYth"}/}>${labels.tx_mc_text_addPax_yth}&nbsp;<small><span>(${labels.tx_mc_text_addPax_ythAge})</small></a> </li>
									{/if}

									{if (paxTypeNames[0]=="MIL")}
										<li class=" type-military"> <a href="javascript:void(0)" id="paxTypeMil" {on tap {fn: 'selectPaxType', scope: this, args:"paxTypeMil"}/}>${labels.tx_mc_text_addPax_mlty}&nbsp;</a> </li>
									{/if}
								{/foreach}
						</ul>
					</section>
				</article>

		<footer class="buttons cust_fadd_pax">
			<button id="cancelBtn" formaction="javascript:return false;" class="validation closePanel" {on click "onCancelButtonClick"/}>${labels.tx_merci_cancel}</button>
			<button class="validation" formaction="javascript:return false;" type="submit" {on click "onSelectButtonClick"/}>${labels.tx_merci_text_booking_select}</button>
		</footer>
		</div>


	{/macro}
{/Template}