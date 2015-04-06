{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcInsDoc'
}}
	{macro main()}
		{var labels = this.data.labels/}
		{var rqstParams = this.data.rqstParams/}
		{var globalList = this.data.globalList/}
		
		{foreach documentIDPax in rqstParams.listTravellerBean.travellers}
			<p>
				<label>${documentIDPax.identityInformation.firstName} ${documentIDPax.identityInformation.lastName}</label>
			</p>
			<p>
				<label for="PNR_INSURANCE_DOCUMENT_TYPE_${documentIDpaxIndex.count}">${labels.tx_pltg_text_documentType} <span class="mandatory">*</span></label>
				<select id="PNR_INSURANCE_DOCUMENT_TYPE_${documentIDpaxIndex.count}" name="PNR_INSURANCE_DOCUMENT_TYPE_${documentIDpaxIndex.count}">
					<option value="not_selected">${labels.tx_pltg_text_PleaseSelect}</option>
					{foreach docItem in globalList.slInsuIdenDocList}
						<option value="${docItem[0]}" {if docItem[0] == rqstParams.param['PNR_INSURANCE_DOCUMENT_TYPE_' + documentIDpaxIndex.count]}selected="selected"{/if}>
							${docItem[2]}
						</option>
					{/foreach}
				</select>
			</p>
			<p>
				<label for="PNR_IDENTITY_DOCUMENT_NUMBER_${documentIDpaxIndex.count}_INSU_${documentIDpaxIndex.count}">${labels.tx_pltg_text_documentNumber} <span class="mandatory">*</span></label>
				<input id="PNR_IDENTITY_DOCUMENT_NUMBER_${documentIDpaxIndex.count}_INSU_${documentIDpaxIndex.count}" name="PNR_IDENTITY_DOCUMENT_NUMBER_${documentIDpaxIndex.count}_INSU_${documentIDpaxIndex.count}" type="text" value="rqstParams.param['PNR_IDENTITY_DOCUMENT_NUMBER_' + documentIDpaxIndex.count + '_INSU_' + documentIDpaxIndex.count]" placeholder="First name">
			</p>
				
			<input type="hidden" name="INSURANCE_DOCUMENT_ID_${documentIDpaxIndex.count}" value="INSU_${documentIDpaxIndex.count}"/>
		{/foreach}
	{/macro}
{/Template}