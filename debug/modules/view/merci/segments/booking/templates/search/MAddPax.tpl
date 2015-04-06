{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.search.MAddPax',
	$extends:'modules.view.merci.segments.booking.templates.search.MBookSearch',
	$hasScript: true
}}
	
	
	
	{macro main()}
			
	
	
			{var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList/}
			{var numOfTrav=siteParameters.numOfTrav/}
					<ul class="paxtypes">
									{foreach paxTypeNames in this.list}
										{if (paxTypeNames[0]=="ADT")}
											<li class="listpax type-adult" id="paxTypeAdult">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_merci_text_booking_adult}</span> <small><span>(${labels.tx_mc_text_addPax_adtAge})</span></small></a> </li>
												<li>
													
													<select name="FIELD_ADT_NUMBER" id="FIELD_ADT_NUMBER" {on change {fn:'custompaxselect', args: "adult", scope:this}/} >
											<!-- CR 06774022 Mobile: D&O enhancements START-->
												 {if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.ADT.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.ADT.min; i <= rqstParams.selectedOfferBean.paxRestrictions.ADT.max; i++}
														<option value="${i}" class="adtClass" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.ADT.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.ADT.min; i <=numOfTrav; i++}
														<option value="${i}" class="adtClass" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.ADT.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.ADT.max>0 /}
													{for var i = 1; i <= rqstParams.selectedOfferBean.paxRestrictions.ADT.max; i++}
														<option value="${i}" class="adtClass" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {else/}  
											<!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="adtClass" {if this._getTravellerSelected('FIELD_ADT_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
											    	{/if}
													</select>
												</li>
											</ul>
											<button type="button" class="delete-button hidden" onclick="javascript:return false" {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeAdult", id2:"FIELD_ADT_NUMBER",value: 'Adult'}}/}></button>
											</li>
										{elseif (paxTypeNames[0]=="CHD")/}
											<li class="listpax type-child hidden" id="paxTypeChild">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_merci_text_booking_child}</span> <small><span>(${labels.tx_mc_text_addPax_chdAge})</span></small></a> </li>
												<li>
													
													<select id="FIELD_CHD_NUMBER" {on change {fn:'custompaxselect', args: "child", scope:this}/}>
												<!-- CR 06774022 Mobile: D&O enhancements START-->
												 {if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.CHD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.CHD.min; i <= rqstParams.selectedOfferBean.paxRestrictions.CHD.max; i++}
														<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.CHD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.CHD.min; i <= numOfTrav; i++}
														<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.CHD.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.CHD.max>-1 /}
														{for var i = 0; i <= rqstParams.selectedOfferBean.paxRestrictions.CHD.max; i++}
															<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
													
		                                         {else/}
												 <!-- CR 06774022 Mobile: D&O enhancements END-->
												 {for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_CHD_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
												{/if}
													</select>
												</li>
											</ul>
												<button type="button" class="delete-button" onclick="javascript:return false"  {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeChild", id2:"FIELD_CHD_NUMBER"}}/}></button>
											</li>
										{elseif (paxTypeNames[0]=="INF")/}
											<li class="listpax type-infant hidden" id="paxTypeInfant">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_merci_text_booking_infant}</span> <small><span>(${labels.tx_mc_text_addPax_infAge})</span></small></a> </li>
												<li>
													
													<select id="FIELD_INFANTS_NUMBER" {on change {fn:'custompaxselect', args: "infant", scope:this}/} >
											<!-- CR 06774022 Mobile: D&O enhancements START-->
												{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.INF.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.INF.min; i <= rqstParams.selectedOfferBean.paxRestrictions.INF.max; i++}
														<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.INF.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.INF.min; i <= numOfTrav; i++}
														<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.INF.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.INF.max>-1 /}
													 {for var i =0; i <= rqstParams.selectedOfferBean.paxRestrictions.INF.max; i++}
													<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
													 {/for}
		                                       {else/}
											 <!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="infClass" {if this._getTravellerSelected('FIELD_INFANTS_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
														{/if}
													</select>
												</li>
											</ul>
												<button type="button" class="delete-button" onclick="javascript:return false"  {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeInfant", id2:"FIELD_INFANTS_NUMBER"}}/}></button>
											</li>	
										
										{elseif (paxTypeNames[0]=="YCD")/}
											<li class="listpax type-senior hidden" id="paxTypeSenior">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_mc_text_addPax_snr}</span> <small><span>(${labels.tx_mc_text_addPax_ycdAge})</span></small></a> </li>
												<li>
													
													<select  id="FIELD_YCD_NUMBER" {on change {fn:'custompaxselect', args: "senior", scope:this}/} >
											<!-- CR 06774022 Mobile: D&O enhancements START-->
												{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YCD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.YCD.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.YCD.min; i <= rqstParams.selectedOfferBean.paxRestrictions.YCD.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YCD_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YCD.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.YCD.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.YCD.min; i <= numOfTrav; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YCD_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YCD.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.YCD.max>-1 /}
													 {for var i =0; i <= rqstParams.selectedOfferBean.paxRestrictions.YCD.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YCD_NUMBER') == i}selected="selected"{/if}>${i}</option>
													 {/for}
		                                       {else/}
										   <!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YCD_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
												 {/if}
													</select>
											 	</li>
											</ul>
												<button type="button" class="delete-button"  onclick="javascript:return false" {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeSenior", id2:"FIELD_YCD_NUMBER"}}/}></button>
											</li>
										{elseif (paxTypeNames[0]=="STU")/}
											<li class="listpax type-student hidden" id="paxTypeStudent">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_mc_text_addPax_stdnt}</span> <small><span>(${labels.tx_mc_text_addPax_stuAge})</span></small></a> </li>
												<li>
												 <select  id="FIELD_STU_NUMBER" {on change {fn:'custompaxselect', args: "student", scope:this}/}>
												<!-- CR 06774022 Mobile: D&O enhancements START-->
												{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.STU.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.STU.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.STU.min; i <= rqstParams.selectedOfferBean.paxRestrictions.STU.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_STU_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.STU.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.STU.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.STU.min; i <= siteParameters.numOfTrav; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_STU_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.STU.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.STU.max>-1 /}
													 {for var i =0; i <= rqstParams.selectedOfferBean.paxRestrictions.STU.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_STU_NUMBER') == i}selected="selected"{/if}>${i}</option>
													 {/for}
		                                       {else/}
											   <!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_STU_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
												{/if}
													</select>
												</li>
											</ul>
												<button type="button" class="delete-button" onclick="javascript:return false"  {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeStudent", id2:"FIELD_STU_NUMBER"}}/}></button>
											</li>
											
										{elseif (paxTypeNames[0]=="YTH")/}
											<li class="listpax type-youth hidden" id="paxTypeYouth">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}><span>${labels.tx_mc_text_addPax_yth}</span> <small><span>(${labels.tx_mc_text_addPax_ythAge})</span></small></a> </li>
												<li>
													
													<select  id="FIELD_YTH_NUMBER" {on change {fn:'custompaxselect', args: "youth", scope:this}/} >
												<!-- CR 06774022 Mobile: D&O enhancements START-->
												{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YTH.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.YTH.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.YTH.min; i <= rqstParams.selectedOfferBean.paxRestrictions.YTH.max; i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YTH_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YTH.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.YTH.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.YTH.min; i <= numOfTrav; i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YTH_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
													{elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.YTH.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.YTH.max>-1 /}
													{for var i = 0; i <= rqstParams.selectedOfferBean.paxRestrictions.YTH.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YTH_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {else/}  
												<!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_YTH_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
													{/if}
													</select>
												</li>
											</ul>
												<button type="button" class="delete-button"  onclick="javascript:return false" {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeYouth", id2:"FIELD_YTH_NUMBER"}}/}></button>
											</li>	
										
										{elseif (paxTypeNames[0]=="MIL")/}
											<li class="listpax type-military hidden" id="paxTypeMilitary">
											<ul class="input">
												<li> <a href="javascript:void(0)"  {on click {fn:"loadPanel", scope:this}/}>${labels.tx_mc_text_addPax_mlty}</a> </li>
												<li>
													
													<select  id="FIELD_MIL_NUMBER" {on change {fn:'custompaxselect', args: "military", scope:this}/}>
											<!-- CR 06774022 Mobile: D&O enhancements START-->
												{if rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.MIL.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.MIL.max>-1}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.MIL.min; i <= rqstParams.selectedOfferBean.paxRestrictions.MIL.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_MIL_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												 {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.MIL.min>-1 && rqstParams.selectedOfferBean.paxRestrictions.MIL.max==-1 /}
													{for var i = rqstParams.selectedOfferBean.paxRestrictions.MIL.min; i <= numOfTrav; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_MIL_NUMBER') == i}selected="selected"{/if}>${i}</option>
													{/for}
												  {elseif rqstParams.flow == 'DEALS_AND_OFFER_FLOW' && rqstParams.selectedOfferBean.paxRestrictions.MIL.min==-1 && rqstParams.selectedOfferBean.paxRestrictions.MIL.max>-1 /}
														{for var i = 0; i <= rqstParams.selectedOfferBean.paxRestrictions.MIL.max; i++}
														<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_MIL_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
												  {else/}
											<!-- CR 06774022 Mobile: D&O enhancements END-->
														{for var i=1; i<=numOfTrav;i++}
															<option value="${i}" class="ycdClass" {if this._getTravellerSelected('FIELD_MIL_NUMBER') == i}selected="selected"{/if}>${i}</option>
														{/for}
											  {/if}
													</select>
												</li>
											</ul>
												<button type="button" class="delete-button" onclick="javascript:return false"  {on click {fn:"onDeleteButtonClick", scope:this, args:{id1:"paxTypeMilitary", id2:"FIELD_MIL_NUMBER"}}/}></button>
											</li>
										
										{/if}
										
									{/foreach}
								  </ul>
									
									<button type="button" class="add-pax" id="newPaxType" onclick="javascript:return false;" {on click {fn:"loadPanel", scope:this}/}>+ ${labels.tx_mc_text_addPax}</button>
									<div class="" id="paxErrorImg" style="display:none"></div>
			
	{/macro}
	
{/Template}