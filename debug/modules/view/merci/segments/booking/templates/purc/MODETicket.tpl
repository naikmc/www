{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MODETicket',
	$macrolibs: {
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	},
	$hasScript: true
}}
	{macro main()}
		<article class='panel'>
			<header>
				<h1>${this.data.labels.tx_merci_text_eticketiddocumentwillbeused}</h1>
			</header>
			<section>
				{if !this.__merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.travellersAsMap)}
					{foreach traveller in this.data.rqstParams.listTravellerBean.travellersAsMap}
						{call setTravellerDetails(traveller)/}
					{/foreach}
					<input type="hidden" name="noOfTravellersM" value="${Object.keys(this.data.rqstParams.listTravellerBean.travellersAsMap).length}"/>
				{else/}
					{foreach traveller in this.data.rqstParams.listTravellerBean.travellers}
						{call setTravellerDetails(traveller)/}
					{/foreach}
					<input type="hidden" name="noOfTravellersM" value="${this.data.rqstParams.listTravellerBean.travellers.length}"/>
				{/if}
			</section>
		</article>
	{/macro}
	
	{macro setTravellerDetails(traveller)}
	
		{var ffNameList = this._splitSiteParamList('siteFFNameList')/}
		{var ffTypeList = this._splitSiteParamList('siteFFTypeList')/}
		{var numEtcktDoc = this.data.gblLst.slSiteLanguageDocument.length/}
		{var numOfFFRestrictedAirlines = this.data.gblLst.slSiteFFRestrictedList.length/}
		
		<input type="hidden" name="DOCUMENT_VENDOR_${traveller.paxNumber}" value=""/>
		<input type="hidden" id="DOCUMENT_NUMBER_${traveller.paxNumber}" name="DOCUMENT_NUMBER_${traveller.paxNumber}" value=""/>
		
		<div class='pax'>
			<h2>${traveller.fullName}</h2>
		</div>
		<p>
			<label for="DOCUMENT_TYPE_${traveller.paxNumber}">${this.data.labels.tx_merci_text_eticketiddocumenttxt} <span class="mandatory">*</span></label>
			{if numEtcktDoc > 1}
				<select id='DOCUMENT_TYPE_${traveller.paxNumber}' name='DOCUMENT_TYPE_${traveller.paxNumber}' {on change {fn: 'updateCCDisplay', scope: this, args: {paxNumber: traveller.paxNumber, id: 'DOCUMENT_TYPE_' + traveller.paxNumber}}/}>
					{foreach docItem in this.data.gblLst.slSiteLanguageDocument}
						<option value='${docItem[0]}'>${docItem[1]}</option>
					{/foreach}
				</select>
			{else/}
				<label>${this.data.gblLst.slSiteLanguageDocument[0][1]}</label>
				<input id='DOCUMENT_TYPE_${traveller.paxNumber}' name='DOCUMENT_TYPE_${traveller.paxNumber}' type="hidden" value='${this.data.gblLst.slSiteLanguageDocument[0][0]}'/>
			{/if}
		</p>
		<p id='GEN_EtcktDetails${traveller.paxNumber}'>
			{if !this._getSiteBoolean('siteSendFoidAirline') && this._getSiteBoolean('siteFoidUseFFVendor')}
				<span id='FFairlineField${traveller.paxNumber}'>
					{if ffTypeList[0] != 'none'}
						<label for="FFDOCUMENT_VENDOR_${traveller.paxNumber}">${this.data.labels.tx_merci_text_frequentflyerairline} <span class="mandatory">*</span></label>
					{/if}
					
					{if ffTypeList[0] == 'any'}
						{call autocomplete.createAutoComplete({
								name: 'FFDOCUMENT_VENDOR_' + traveller.paxNumber,
								id: 'FFDOCUMENT_VENDOR_' + traveller.paxNumber,
								type: 'text',
								source: this.getFFSourceList()
						})/}
					{elseif ffTypeList[0] == 'useFFList'/}
						{if numOfFFRestrictedAirlines == 1}
							<label>${this.data.gblLst.slSiteFFRestrictedList[0][1]}</label>
							<input id='FFDOCUMENT_VENDOR_${traveller.paxNumber}' name='FFDOCUMENT_VENDOR_${traveller.paxNumber}' type="hidden" value='${this.data.gblLst.slSiteFFRestrictedList[0][1]}'/>
						{elseif numOfFFRestrictedAirlines > 1/}
							<select id='FFDOCUMENT_VENDOR_${traveller.paxNumber}' name='FFDOCUMENT_VENDOR_${traveller.paxNumber}'>
								<option value="">${this.data.labels.tx_pltg_text_FFPleaseSelect}</option>
								{foreach docItem in this.data.gblLst.slSiteFFRestrictedList}
									<option value='${docItem[0]}'>${docItem[1]}</option>
								{/foreach}
							</select>
						{/if}
					{else/}
						<label>
							{if ffNameList[0] != '00'}
								${ffNameList[0]}
							{else/}
								${ffTypeList[0]}
							{/if}
						</label>
						<input type="hidden" name='FFDOCUMENT_VENDOR_${traveller.paxNumber}' id='FFDOCUMENT_VENDOR_${traveller.paxNumber}' value="${ffTypeList[0]}" />
					{/if}
				</span>
			{/if}
		</p>
		<p>
			<label for='GEN_DOCUMENT_NUMBER_${traveller.paxNumber}' id='GEN_DOCUMENT_NUMBER${traveller.paxNumber}'></label>
			<input id='GEN_DOCUMENT_NUMBER_${traveller.paxNumber}' name="GEN_DOCUMENT_NUMBER_${traveller.paxNumber}" type="text"/>
		</p>
		<p id='CC_EtcktDetails${traveller.paxNumber}'>
			<label for="CCDOCUMENT_VENDOR_${traveller.paxNumber}">${this.data.labels.tx_merci_text_eticketcreditcardtype} <span class="mandatory">*</span></label>
			<select id='CCDOCUMENT_VENDOR_${traveller.paxNumber}' name='CCDOCUMENT_VENDOR_${traveller.paxNumber}'>
				<option value="">${this.data.labels.tx_merci_text_eticketcreditcardtypedefaultselect}</option>
				{foreach creditCardItem in this.data.gblLst.slLanguageCreditCard}
					<option value='${creditCardItem[0]}'>${creditCardItem[1]}</option>
				{/foreach}
			</select>
			<label for='CC_DOCUMENT_NUMBER_${traveller.paxNumber}' id='CC_DOCUMENT_NUMBER${traveller.paxNumber}'></label>
			<input id='CC_DOCUMENT_NUMBER_${traveller.paxNumber}' name="CC_DOCUMENT_NUMBER_${traveller.paxNumber}" type="text"/>
		</p>
	{/macro}
{/Template}