{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MConfButtons',
	$hasScript: true
}}
	{macro main()}
		//{if (this.data.request.tripPlanBean != null && this.data.request.listseatassignmentbean != null && this.data.request.isOperatedBySameAirline==true)}		
		{var seatElig = this.getSeatEligibility(this.data.segment, this.data.bound.itemId) /}
		<div class="buttons">
				<ul>
				{if seatElig.showLink && !this.utils.booleanValue(this.data.config.merciServiceCatalog)}			
					<li>
						<a href="javascript: void(0);" class="seat secondary {if seatElig.disabled}disabled{/if}"
							{if !seatElig.disabled}
									{on click {fn: this.selectSeat, scope: this, args: [this.data.segment, this.data.bound.itemId], apply:true, resIndex: 0} /}
							{/if}>
								${seatElig.linkLabel}
						</a>
					</li>
				{/if}
					{if this.data.request.hasInfant && this.utils.booleanValue(this.data.config.infantMealAllowed)}
						<li>
							<a href="javascript: void(0);" class="meal secondary"
									{on click {fn: this.selectInfMeal, scope: this, args: [this.data.segment, this.data.bound.itemId], apply:true, resIndex: 0} /}>
									{var isMealSelected= this.getIsMealSelected()/}
									{if !isMealSelected}
								${this.data.labels.tx_merci_text_add_infant_meal}
									{else/}
										${this.data.labels.tx_merci_text_chng_infant_meal}
									{/if}
							</a>
						</li>
					{/if}
					{if this.utils.booleanValue(this.data.config.siteEnablePassbook) && !this.utils.isEmptyObject(this.data.request.passbookParams)}
						<li>
							<a href="javascript: void(0);" class="passbook secondary"
									{on click {fn: this.addToPassbook, scope: this, args: this.data.request.passbookParams} /}>
								${this.data.labels.tx_merci_checkin_confirmation_psbk}
							</a>
						</li>
					{/if}
				</ul>
			</div>
	

		{if seatElig.showWarning}
			<div class="message info"><p>${this.data.labels.tx_merci_nwsm_warn_msg1}</p></div>
		{/if}
		/*{else/}
			<div class="buttons">
				<ul>					
					{if this.data.config.siteEnablePassbook && !this.utils.isEmptyObject(this.data.request.passbookParams)}
						<li>
							<a href="javascript: void(0);" class="passbook secondary"
									{on click {fn: this.addToPassbook, scope: this, args: this.data.request.passbookParams} /}>
								PASSBOOK
							</a>
						</li>
					{/if}
				</ul>
			</div>
		{/if}*/
	{/macro}
{/Template}