{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.dealsoffers.MDealFareConditions',
	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib', tablet: 'modules.view.merci.common.utils.MerciTabletLib'},
	$dependencies: ['modules.view.merci.common.utils.URLManager','modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true
}}

	{var showCond = false/}
	
	{macro main()}
		{section {
			id: "fareCondContent",
			macro: 'printFareConditions'
		}/}
	{/macro}

	{macro printFareConditions()}			
	{if (showCond ==  true)}
		{var labels = this.moduleCtrl.getModuleData().booking.MFACS_A.labels/}
		{var siteParameters = this.moduleCtrl.getModuleData().booking.MFACS_A.siteParam/}
		{var gblLists = this.moduleCtrl.getModuleData().booking.MFACS_A.globalList/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam/}
		{var paxFlag = 0/}	
		
		<section>
			<article class="facs">
				<div class="accordion" role="tablist" id="accordian1" data-aria-multiselectable="true">
					<h2 tabindex="0" role="tab" data-aria-controls="panel1" aria-expanded="false" id="tab1"  {on click {fn:"toggle",args : {ID1 : "tab1", ID2: "panel1"} } /}>${labels.tx_merci_deals_minimum_passenger}</h2>
					<section role="tabpanel" data-aria-labeledby="tab1" id="panel1" data-aria-hidden="true" class="displayNone">				
							<ul>
								<li>
									{if this.isPaxExist('ADT')}
										{set paxFlag = 1/}	
										{var adultVal = rqstParams.selectedOfferBean.paxRestrictions.ADT.min/}
										{if (adultVal != -1)}
											${adultVal}&nbsp;${labels.tx_merci_text_booking_review_pb_adults},
										{/if}	
									{/if}
									{if this.isPaxExist('CHD')}
										{set paxFlag = 1/}
										{var childVal = rqstParams.selectedOfferBean.paxRestrictions.CHD.min/}
										{if (childVal != -1)}
											&nbsp;${childVal}&nbsp;{if childVal == 1}${labels.tx_merci_text_booking_child}{else/}${labels.tx_merci_text_booking_review_pb_children}{/if}
										{/if}	
									{/if}
									{if this.isPaxExist('INF')}
										{set paxFlag = 1/}
										{var infVal = rqstParams.selectedOfferBean.paxRestrictions.INF.min/}
										{if (infVal != -1)}
											,&nbsp;${infVal}&nbsp;{if infVal == 1}${labels.tx_merci_text_booking_alpi_infant}{else/}${labels.tx_merci_text_booking_review_pb_infants}{/if}
										{/if}	
									{/if}
									{if this.isPaxExist('YCD')}
										{set paxFlag = 1/}
										{var ycdVal = rqstParams.selectedOfferBean.paxRestrictions.YCD.min/}
										{if (ycdVal != -1)}
											,&nbsp;${ycdVal}&nbsp;{if ycdVal == 1}${labels.tx_mc_text_addPax_snr}{else/}${labels.tx_mc_text_addPax_snrs}{/if}
										{/if}	
									{/if}
									{if this.isPaxExist('STU')}
										{set paxFlag = 1/}
										{var stuVal = rqstParams.selectedOfferBean.paxRestrictions.STU.min/}
										{if (stuVal != -1)}
											,&nbsp;${stuVal}&nbsp;{if stuVal == 1}${labels.tx_mc_text_addPax_stdnt}{else/}${labels.tx_mc_text_addPax_stdnts}{/if}
										{/if}	
									{/if}
									{if this.isPaxExist('YTH')}
										{set paxFlag = 1/}
										{var ythVal = rqstParams.selectedOfferBean.paxRestrictions.YTH.min/}
										{if (ythVal != -1)}
											,&nbsp;${ythVal}&nbsp;{if ythVal == 1}${labels.tx_mc_text_addPax_yth}{else/}${labels.tx_mc_text_addPax_yths}{/if}
										{/if}	
									{/if}	
									{if this.isPaxExist('MIL')}
										{set paxFlag = 1/}
										{var milVal = rqstParams.selectedOfferBean.paxRestrictions.MIL.min/}
										{if (milVal != -1)}
											,&nbsp;${milVal}&nbsp;{if milVal == 1}${labels.tx_mc_text_addPax_mlty}{else/}${labels.tx_mc_text_addPax_militaries}{/if}
										{/if}	
									{/if}
									{if (paxFlag == 0)}								
										2&nbsp;${labels.tx_merci_text_pax}
									{/if}		
								</li>
							</ul>					
					</section>

					<h2 tabindex="-1" role="tab" data-aria-controls="panel2" id="tab2" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab2", ID2: "panel2"} } /} >${labels.tx_merci_deals_cabin_class}</h2>		
					<section role="tabpanel" data-aria-labeledby="tab2" id="panel2" data-aria-hidden="true" class="displayNone">
							{var cabinClass = rqstParams.selectedOfferBean.cabinClass/}
							<ul>
								{if (cabinClass == "")}
									<li>${labels.tx_merci_text_none}</li>
								{elseif (cabinClass == "Y" || cabinClass == "E" || cabinClass == "N" || cabinClass == "R") /}
									<li>${labels.tx_merci_ts_search_Economy}</li>
								{elseif (cabinClass == "J" || cabinClass == "B") /}
									<li>${labels.tx_merci_ts_search_Business}</li>
								{elseif (cabinClass == "P" || cabinClass == "F") /}	
									<li>${labels.tx_merci_ts_search_First}</li>
								{/if}
							</ul>
					</section>
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel3" id="tab3" aria-expanded="false"  {on click {fn:"toggle",args : {ID1 : "tab3", ID2: "panel3"} } /}>${labels.tx_merci_text_minstay}</h2>
					<section role="tabpanel" data-aria-labeledby="tab3" id="panel3" data-aria-hidden="true" class="displayNone">
							{var minStay = rqstParams.selectedOfferBean.minimumStay/}
							{var minStayUnit = rqstParams.selectedOfferBean.minimumStayUnit/}
						
							<ul>
								{if (minStay == "" || minStay == 0)}
									<li>${labels.tx_merci_text_none}</li>
								{else/}
									<li>${rqstParams.selectedOfferBean.minimumStay}&nbsp;
									{if (minStayUnit == "D") }
										${labels.tx_merci_text_days}
									{elseif (minStayUnit == "W" ) /}
										${labels.tx_merci_text_weeks}
									{else/}
										${labels.tx_merci_text_months}
									{/if}
									</li>		
								{/if}
							</ul>
					</section>
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel4" id="tab4" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab4", ID2: "panel4"} } /}>${labels.tx_merci_text_maxstay}</h2>
					<section role="tabpanel" data-aria-labeledby="tab4" id="panel4" data-aria-hidden="true" class="displayNone">
							{var maxStay = rqstParams.selectedOfferBean.maximumStay/}
							{var maxStayUnit = rqstParams.selectedOfferBean.maximumStayUnit/}
						
							<ul>
								{if (maxStay == "" || maxStay == 0)}
									<li>${labels.tx_merci_text_none}</li>
								{else/}
									<li>${rqstParams.selectedOfferBean.maximumStay}&nbsp;
									{if (maxStayUnit == "D") }
										${labels.tx_merci_text_days}
									{elseif (maxStayUnit == "W" ) /}
										${labels.tx_merci_text_weeks}
									{else/}
										${labels.tx_merci_text_months}
									{/if}
									</li>		
								{/if}
							</ul>
					</section>
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel5" id="tab5" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab5", ID2: "panel5"} } /}>${labels.tx_merci_deals_advance_purchase}</h2>
					<section role="tabpanel" data-aria-labeledby="tab5" id="panel5" data-aria-hidden="true" class="displayNone">
							{var adPurc = rqstParams.selectedOfferBean.advancedPurchase/}
						
							<ul>
								{if (adPurc == "" || adPurc == 0)}
									<li>${labels.tx_merci_text_none}</li>
								{else/}
									<li>${rqstParams.selectedOfferBean.advancedPurchase}&nbsp;${labels.tx_merci_text_days}</li>		
								{/if}
							</ul>
					</section>
					
					
					
					{var endDt = this.moduleCtrl.getValuefromStorage("TRAVEL_END_DATE")/}
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel6" id="tab6" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab6", ID2: "panel6"} } /}>${labels.tx_dls_travel_completion_date}</h2>		
					<section role="tabpanel" data-aria-labeledby="tab6" id="panel6" data-aria-hidden="true" class="displayNone">
						
							<ul>
								<li>${endDt}</li>
							</ul>
					</section>
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel7" id="tab7" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab7", ID2: "panel7"} } /}>${labels.tx_merci_deals_outbound_travel_period}</h2>		
					<section role="tabpanel" data-aria-labeledby="tab7" id="panel7" data-aria-hidden="true" class="displayNone">
						
							<ul>
								<li id="travelPeriod"></li>
							</ul>
					</section>
					
					<h2 tabindex="-1" role="tab" data-aria-controls="panel8" id="tab8" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab8", ID2: "panel8"} } /}>${labels.tx_merci_deals_special_conditions}</h2>		
					<section role="tabpanel" data-aria-labeledby="tab8" id="panel8" data-aria-hidden="true" class="displayNone">	
						<ul>
							<li id="spclCond">
								${rqstParams.dbean.specialCondition}
							</li>
						</ul>
					</section>
					<h2 tabindex="-1" role="tab" data-aria-controls="panel9" id="tab9" aria-expanded="false" {on click {fn:"toggle",args : {ID1 : "tab9", ID2: "panel9"}} /}>${labels.tx_merci_deals_other_conditions}</h2>		
					<section role="tabpanel" data-aria-labeledby="tab9" id="panel9" data-aria-hidden="true" class="displayNone">	
						<ul>
							<li id="otherCond">
								${rqstParams.dbean.otherCondition}
							</li>
						</ul>
					</section>
					
				</div>
		
			</article>
		</section>
		{/if}
	{/macro}
{/Template}