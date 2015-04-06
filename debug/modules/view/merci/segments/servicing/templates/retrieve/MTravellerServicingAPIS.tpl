{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MTravellerServicingAPIS",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

	{macro main()}
		{if (this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A != null)}
			{var labels = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A.requestParam/}
			{var errors = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A.errorStrings/}
			<section>
				<form {id "APISForm" /}>				
					 {section {
						type: 'div',
						id: 'messages',
						macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
						bindRefreshTo: [{inside: this.data, to: 'messages'}]
					}/}
					{var travNoClicked =  rqstParams.travNoClicked /}
					{var paxSelected = rqstParams.listTravellerBean.travellerBean[travNoClicked-1]/}
					// include error tpl
					{call includeError(labels)/}
					<header>
						<h1>${labels.tx_pltg_text_Traveller}&nbsp;${travNoClicked}</h1>
						<p id=""><span class="required">*</span>${labels.tx_merci_text_booking_apis_mandatory}</p>
						<p id=""><span class="required">*</span>${labels.tx_merci_text_booking_apis_notmandatorynow}</p>
					</header>
					{foreach traveller in rqstParams.listTravellerBean.travellerBean}
						{var apisSectionBean = traveller.identityInformation.apisSectionBean/}
						{var sendMandatoryInfo = "TRUE"/}
						{if (traveller_index != 0)}
							{set sendMandatoryInfo = 'FALSE'/}
						{/if}
						<article class="panel pax {if traveller.paxNumber != travNoClicked}hidden{/if}" id="passenger_${traveller.paxNumber}">
							<header>
								<h1>${traveller.identityInformation.titleName}&nbsp;${traveller.identityInformation.firstName}&nbsp;${traveller.identityInformation.lastName}</h1>								
							</header>
							<section id="section_${traveller.paxNumber}" {if traveller.paxNumber != travNoClicked}class="hidden"{/if}>
								<div class="pax">
									<!-- APIS SECTION - START -->
										<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPspt",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'Y',
													apisSectionBean : apisSectionBean,
													traveller : traveller,
													sendMandatoryInfo : sendMandatoryInfo,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}
										</div>
										<div>
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa",
											data: {
												labels : labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												servicingAPIS : 'Y',
												paxClicked: travNoClicked	
											}
										} /}	
										</div>
										<div>
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisRedn",
											data: {
												labels : labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												servicingAPIS : 'Y',
												paxClicked: travNoClicked	
											}
										} /}	
										</div>
										<div>
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisKnwt",
											data: {
												labels : labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												servicingAPIS : 'Y',
												paxClicked: travNoClicked	
											}
										} /}	
										</div>
										<div>
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisDestAddr",
											data: {
												labels : labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												servicingAPIS : 'Y',
												paxClicked: travNoClicked	
											}
										} /}	
										</div>
										<div>
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisResidenceAddr",
											data: {
												labels : labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												servicingAPIS : 'Y',
												paxClicked: travNoClicked	
											}
										} /}	
										</div>
									<!-- APIS SECTION - END -->
								</div>
								{if (traveller.withInfant)}
									{var infant = traveller.infant/}
									<div class="pax infant">
										<p class="name">
											${infant.firstName}&nbsp;${infant.lastName}
										</p>
										<!-- INFANTAPIS SECTION - START -->
											<div>
												{@html:Template {
													classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPspt",
													data: {
														labels : labels,
														siteParameters : siteParameters,
														gblLists : gblLists,
														rqstParams : rqstParams,
														isAdultPsngr : 'N',
														apisSectionBean : traveller.infant.apisSectionBean,
														traveller : traveller,
														sendMandatoryInfo : sendMandatoryInfo,
														servicingAPIS : 'Y',
														paxClicked: travNoClicked	
													}
												} /}
											</div>
											<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}	
											</div>
											<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisRedn",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}	
											</div>
											<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisKnwt",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}	
											</div>
											<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisDestAddr",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}	
											</div>
											<div>
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisResidenceAddr",
												data: {
													labels : labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'Y',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													servicingAPIS : 'Y',
													paxClicked: travNoClicked	
												}
											} /}	
											</div>
										<!-- INFANT APIS SECTION - END -->
									</div>
								{/if}		
							</section>
						</article>	
					{/foreach}
					{call hiddenInputs(rqstParams) /}
				</form>
				
				<footer class="buttons">
				  <button class="validation cancel" {on click {fn: this.showPaxDetails, scope: this} /}>
					${labels.tx_merci_text_travdetl_cancel}
				  </button>
				  <button class="validation" {on click {fn: this.onSave, scope: this} /} formaction="javascript:void(0)">
					${labels.tx_merci_text_travdetl_save}
				  </button>
				</footer>		 
			</section>
		{/if}
	{/macro} 

	{macro hiddenInputs(rqstParams)}		
		<input type="hidden" name="result" value="json" />
		<input type="hidden" name="travNoClicked" value="${rqstParams.travNoClicked}" />
		<input type="hidden" name="REGISTER_START_OVER" value="false"/>		
		<input type="hidden" name="TRAVELLER_INFORMATION_MODIFICATION" value="true"/>
		<input type="hidden" name="ACTION" value="MODIFY"/>
		<input type="hidden" name="FROM_PAX" value="true"/>
		<input type="hidden" name="FROM_APIS" value="true"/>
		<input type="hidden" name="DIRECT_RETRIEVE" value="true"/>
		<input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED"/>
		<input type="hidden" name="REC_LOC" value="${rqstParams.requestBean.REC_LOC}"/>	
		<input type="hidden" name="updateInfoSuccess_1" value="21300052"/>
		<input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" value="${rqstParams.listTravellerBean.primaryTraveller.identityInformation.lastName}"/>	
		<input type="hidden" name="SERVICE_PRICING_MODE" value="INIT_PRICE"/>
		<input type="hidden" name="PAGE_TICKET" value="${rqstParams.requestBean.PAGE_TICKET}" />
		{if (rqstParams.requestBean.IS_PAY_ON_HOLD == 'IS_PAY_ON_HOLD')}
		  <input type="hidden" name="IS_PAY_ON_HOLD" value="IS_PAY_ON_HOLD" />
		{/if}
		<input type="hidden" name="TRAVELLER_NUMBER" value="${rqstParams.listTravellerBean.travellerBean.length}" />
		<input type="hidden" name="gotoChargeableFsr" value="${rqstParams.requestBean.gotoChargeableFsr}" />
		<input type="hidden" name="gotoFsr" value="${rqstParams.requestBean.gotoFsr}" />	
	{/macro}
	{macro includeError(labels)}			
		{section {
			id: 'errors',
			macro: {name:'displayError', args:[labels], scope: this},
			bindRefreshTo : [{
		        inside : this.data,
		        to : "errorOccured",
		        recursive : true
			}],
		}/}
	{/macro}

	{macro displayError(labels)}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
			// resetting binding flag
			${this.data.errorOccured = false|eat}
		{/if}
	{/macro}

{/Template}