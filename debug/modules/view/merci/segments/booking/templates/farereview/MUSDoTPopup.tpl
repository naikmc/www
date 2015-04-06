{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MUSDoTPopup',
	$hasScript: true
}}

	{macro main()}

		//execute only when data is provided
		{if  this.data.rqstParams != null && this.data.globalList != null && this.data.labels != null}
			<!-- dot pop up -->
			{if this.data.rqstParams.airlineCodesMap != null}
				{call showInfo(this.data.rqstParams.airlineCodesMap, 'BAG')/}
			{/if}

			{if this.data.rqstParams.airlineCodesCarryOn != null}
				{call showInfo(this.data.rqstParams.airlineCodesCarryOn, 'COA')/}
			{/if}
			<!-- end dot pop up -->
		{/if}
	{/macro}

	{macro showInfo(serviceMap, currentPolicy)}

		{var idSuffix = ''/}
		{var disclaimer = ''/}
		{var bagDisplayed = false/}
		{var coaDisplayed = false/}

		{for airlineCode in serviceMap}
			{for originDest in serviceMap[airlineCode]}

				{var serviceGroup = serviceMap[airlineCode][originDest]/}
				{var originDest = originDest.substring(0,originDest.indexOf(' ')) + originDest.substring(originDest.indexOf(':') + 1)/}
				{var compString = 'OriginDestination ' + this.data.rqstParams.beginLoc + '-' + this.data.rqstParams.endLoc/}
				{var compStringItn = 'OriginDestination ' + this.data.rqstParams.beginLocItn + '-' + this.data.rqstParams.endLocItn/}

				{if originDest == compString || originDest == compStringItn}

					{set idSuffix = this.data.rqstParams.storedItinerary + '_' + this.data.rqstParams.segmentIndex + '_' + currentPolicy/}
					<article class="panel noShadow">
						<header>
							<h1>
								<span class="width80">${this.data.labels.tx_merci_text_bag_allowance_per_pax}</span>
								<button id="btn${idSuffix}" type="button" role="button" class="toggle" aria-expanded="true" {on click {fn: 'toggleExpand', scope: this, args: {sectionId:'sec' + idSuffix ,buttonId:'btn' + idSuffix}}/}>
									<span>Toggle</span>
								</button>
							</h1>
						</header>
						<section id="sec${idSuffix}" class="usDot">
							{if currentPolicy == 'BAG'}
								{set bagDisplayed = true/}
							{elseif currentPolicy == 'COA'/}
								{set coaDisplayed = true/}
							{/if}

							<table cellspacing="0" cellpadding="0" class="tableFlightConf" style="border-top:none;">

								{var currentTravId = ''/}
								{foreach baggagePolicy in serviceGroup}
									<tr>
										<td colspan="3">
											<strong>
												{if currentTravId != baggagePolicy.travellerId}
													{set currentTravId = baggagePolicy.travellerId/}

													{if baggagePolicy.travellerName != null && baggagePolicy.travellerName != ''}
														${baggagePolicy.travellerName}
													{else/}
														{var msg = new this._buffer(this.data.labels.tx_pltg_pattern_TravellerCount)/}
														${msg.formatString([baggagePolicy.travellerIndex])}
													{/if}
												{/if}
											</strong>
										</td>
									</tr>
									<tr>
										<td class="textBold flight">
											&nbsp;
										</td>
										<td colspan="2">
											<span class="serviceType strong">
												${this._getPolicyOrdinalNumber(baggagePolicy.policyId)}
												{if currentPolicy == 'BAG'}
													&nbsp;${this.data.labels.tx_plgt_text_CheckedBag}&nbsp;
												{elseif currentPolicy == 'COA'/}
													&nbsp;${this.data.labels.tx_plgt_text_CarryOnBag}&nbsp;
												{/if}
												{if baggagePolicy.isPieceConcept}
													{var msg = new this._buffer(this.data.labels.tx_pltg_pattern_piece_concept)/}
													${msg.formatString([baggagePolicy.parameterValue])}&nbsp;
												{/if}
												{if baggagePolicy.isWeightConcept}
													{var msg = new this._buffer(this.data.labels.tx_pltg_pattern_weight_concept)/}
													${msg.formatString([baggagePolicy.parameterValue, baggagePolicy.parameterUnit])}&nbsp;
												{/if}

												${baggagePolicy.description}:
											</span>

											{if !baggagePolicy.isChargeable && this._utils.isEmptyObject(baggagePolicy.detailsList)}
												<table cellspacing="0" cellpadding="0">
													<tbody>
														<tr>
															<td class="serviceAllowancePrice">
																${this.data.labels.tx_pltg_text_Free}
															</td>
															<td></td>
														</tr>
														<tr>
															<td colspan="2">&nbsp;</td>
														</tr>
													</tbody>
												</table>
											{/if}

											{foreach detailsInfo in baggagePolicy.detailsList}
												<table cellspacing="0" cellpadding="0" >
													<tbody>
														<tr>
															<td class="serviceAllowancePrice">
																{if !baggagePolicy.isChargeable}
																	${this.data.labels.tx_pltg_text_Free}
																{else/}
																	${this._getFormattedPriceDisplayed(detailsInfo)}
																{/if}
															</td>
															<td class="paddingLeft">
																{foreach nameDescription in detailsInfo.descriptionList}
																	${nameDescription.commercialName}
																	{if !this._utils.isEmptyObject(nameDescription.description)}
																		&nbsp;-&nbsp;${nameDescription.description}
																	{/if}

																	{if parseInt(nameDescription_index) == (detailsInfo.descriptionList.length - 1)}
																		&nbsp;-&nbsp;
																	{/if}
																{/foreach}
															</td>
														</tr>
														<tr>
															<td colspan="2">
																&nbsp;
																{if parseInt(detailsInfo_index) != (baggagePolicy.detailsList.length - 1)}
																	${this.data.labels.tx_pltg_text_or}
																{/if}
															</td>
														</tr>
													</tbody>
												</table>
											{/foreach}
										</td>
									</tr>
								{/foreach}
							</table>

							<ul>
								<li class="lgnd">${this.data.labels.tx_merci_text_usdot_legend}</li>
								<li>${this.data.labels.tx_merci_text_usdot_lb} ${this.data.labels.tx_merci_text_usdot_in} ${this.data.labels.tx_merci_text_usdot_kg} ${this.data.labels.tx_merci_text_usdot_cm}</li>

								{if this.data.rqstParams.showBaggageDisclaimer == true}

									<p class="betweenLines">
										${this.data.labels.tx_merci_text_usdot_msc_is} ${airlineCode} (${this._getAirlineName(airlineCode)})
									</p>

									{set disclaimer = this._getDisclaimer(airlineCode, currentPolicy)/}
									{if disclaimer != ''}
										${disclaimer}
									{/if}
								{/if}
							</ul>
						</section>
					</article>
				{/if}
			{/for}
		{/for}

	{/macro}
{/Template}