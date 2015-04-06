{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpi',
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib',
		common: 'modules.view.merci.common.utils.MerciCommonLib',
		billingDetails: 'modules.view.merci.common.utils.MBillingDetails'
	},
	$dependencies: [
		'modules.view.merci.segments.booking.scripts.MBookingMethods',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$hasScript: true
}}

	{var id = ''/}
	{var showALPIContent = false/}

	{macro main()}
		{if (this.moduleCtrl.getModuleData().booking.MALPI_A != null)}
			{var siteParameters = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam/}
			{var gblLists = this.moduleCtrl.getModuleData().booking.MALPI_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam/}
			{var errors = this.moduleCtrl.getModuleData().booking.MALPI_A.errors/}
			{var isNewSearch = siteParameters.siteNewSearch/}
			{var searchURL = siteParameters.siteSearchURL/}

			<section id="formSection" class=" {if rqstParams.requestBean.HIDEALPI == "TRUE"} hidden {/if} pi_frmalpi" >
				<form name="alpiForm" id="alpiForm" {on submit {fn: 'onSubmitAlpi'}/}>
					<input type="hidden" name="ACTION" value="BOOK"/>
					<input type="hidden" name="FROM_PAX" value="TRUE"/>
					<input type="hidden" name="OFFICE_ID" value="${rqstParams.requestBean.OFFICE_ID}"/>
					<input type="hidden" name="PAGE_TICKET"  id="PAGE_TICKET" value="${rqstParams.pageTicket}" />
					<input type="hidden" name="SERVICE_PRICING_MODE" id="SERVICE_PRICING_MODE" value="INIT_PRICE"/>
					<input type="hidden" name="SESSION_ID" value=""/>
					<input type="hidden" name="SKIP_INSURANCE_CALL" value="FALSE"/>
					<input type="hidden" name="TYPE" value="AIR_TRIP_FARE"/>
					<input type="hidden" name="USE_INSURANCE" value="FALSE"/>
					<input type="hidden" name="mailType" value="HTML"/>
					<input type="hidden" name="IS_SPEED_BOOK" value="${rqstParams.requestBean.IS_SPEED_BOOK}" />
					<input type="hidden" name="IS_SPEED_BOOK1" value="${rqstParams.requestBean.IS_SPEED_BOOK1}" />
					<input type="hidden" name="SKIP_ALPI" value="${rqstParams.requestBean.SKIP_ALPI}" />
					<input type="hidden" name="JSP_NAME_KEY" value="SITE_JSP_STATE_RETRIEVED"/>
					<input type="hidden" id="TRIP_TYPE" name="TRIP_TYPE" value="${rqstParams.requestBean.TRIP_TYPE}" />
					<input type="hidden" id="page" name="page" value="5-Passenger Info" />
					<input type="hidden" id="upsellOutLow" name="upsellOutLow" value="${rqstParams.requestBean.upsellOutLow}" />
					<input type="hidden" id="upsellInLow" name="upsellInLow" value="${rqstParams.requestBean.upsellInLow}" />
					<input type="hidden" id="FLOW_TYPE" name="FLOW_TYPE" value="${rqstParams.requestBean.FLOW_TYPE}" />
					<input type="hidden" name="REGISTER_START_OVER" id="REGISTER_START_OVER" value=""/>
					<input type="hidden" name="updateInfoSuccess" id="updateInfoSuccess" value=""/>
					<input type="hidden" name="PROFILE_ID" value="${rqstParams.merciDeviceBean.DEVICE_TYPE}"/>
					<input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" id="DIRECT_RETRIEVE_LASTNAME" value=""/>
					<input type="hidden" name="FROM_APIS" value="TRUE" />
					<input type="hidden" name="continue" value="continue" />

					{if rqstParams.requestBean.IS_SPEED_BOOK1 != "TRUE"}
						<!-- Breadcrumbs -->
						{call common.showBreadcrumbs(4)/}
						{if !this.__merciFunc.isEmptyObject(rqstParams.DWM_HEADER_CONTENT)}
					          {@html:Template {
						            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
						            data: {
						            	placeholder: rqstParams.DWM_HEADER_CONTENT,
						            	placeholderType: "dwmHeader"
						            }
					          }/}
						{/if}
						{if siteParameters.showBackWarning == 'TRUE' && rqstParams.requestBean.client == null}
						  <div class="msg info">
							<ul>
								<li>
									<p> ${this.data.labels.tx_merci_text_booking_back_message} </p>
								<li>
							</ul>
						  </div>
						{/if}
					{/if}

					// include error tpl
					{call includeError(this.data.labels)/}
					{if rqstParams.requestBean.IS_SPEED_BOOK1 != "TRUE"}
						<div class="pi_alpifrecap">
							{section {
								id: "alpiRecap",
								macro: {name: 'alpiFareRecap', args: [rqstParams,siteParameters,this.currCode,this.exchRate]}
							}/}
						</div>

						<div class="pi_alpiirecap">
							{@html:Template {
								classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiItineraryRecap",
								data: {
									labels : this.data.labels,
									rqstParams : rqstParams
								}
							} /}
						</div>
					{/if}
           				
					<input type="hidden" name="hidDispPaxNumber" id="hidDispPaxNumber" value="${rqstParams.listTravellerBean.travellerBean.length}"/>
					<input type="hidden" name="noOfTravellersM" id="noOfTravellers" value="${rqstParams.listTravellerBean.travellerBean.length}" />
					<input type="hidden" name="noOfAdults" id="noOfAdults" value="${rqstParams.listTravellerBean.noOfAdt}"/>
					<input type="hidden" name="noOfInfants" id="noOfInfants" value="${rqstParams.listTravellerBean.noOfInf}"/>

					{var paxTitleCode = ""/}
					{var paxFirstName = ""/}
					{var paxLastName = ""/}
					{var paxNationalityCode = ""/}
					{var sendMandatoryInfo = "TRUE"/}

					{foreach traveller in rqstParams.listTravellerBean.travellerBean}
						{set apisSectionBean = traveller.identityInformation.apisSectionBean/}
						{if (traveller.identityInformation != null)}
							{set paxTitleCode = traveller.identityInformation.titleCode/}
							{set paxFirstName = traveller.identityInformation.firstName/}
							{set paxLastName = traveller.identityInformation.lastName/}
							{set paxNationalityCode = traveller.identityInformation.nationalityCode/}
						{/if}
						
						{var dobIDENReq = ''/}
						{var fNameIDENReq = ''/}
						{var lNameIDENReq = ''/}
						{var genderIDENReq = ''/}
						
						{var ApisIdent = ""/}
						{var ApisPSPT = ""/}
						{var ApisNat = ""/}
						{var sectionId = ""/}
						{if (apisSectionBean != null && apisSectionBean.hasPrimaryTravelDocumentsInDataMap != null)}
							{foreach doc in apisSectionBean.listPrimaryTravelDocuments}
								{set identityDocument = doc.identityDocument/}
								{set apisEntryBean = doc/}
								{set ApisNat = 'FALSE'/}
								{set ApisIdent = 'FALSE'/}
								{if (apisEntryBean != null && apisEntryBean.structureIdAttributes.enabled == 'Y')}
									{if (apisEntryBean.structureIdAttributes.NATNRequirement == 'OPTIONAL' || apisEntryBean.structureIdAttributes.NATNRequirement == 'MANDATORY')}
										{set ApisNat = 'TRUE'/}
									{/if}
									{if (apisEntryBean.structureIdAttributes.IDENRequirement == 'OPTIONAL' || apisEntryBean.structureIdAttributes.IDENRequirement == 'MANDATORY')}
										{set ApisIdent = 'TRUE'/}
									{/if}
									{if (apisEntryBean.structureIdAttributes.PSPTRequirement == 'OPTIONAL' || apisEntryBean.structureIdAttributes.PSPTRequirement == 'MANDATORY')}
										{set ApisPSPT = 'TRUE'/}
									{/if}

								{/if}
								{set genderIDENReq = identityDocument.genderAttributes.IDENRequirement/}
								{set dobIDENReq = identityDocument.dateOfBirthAttributes.IDENRequirement/}
								{set fNameIDENReq = identityDocument.firstNameAttributes.IDENRequirement/}
								{set lNameIDENReq = identityDocument.lastNameAttributes.IDENRequirement/}
							{/foreach}
							{set flowSuffix = 'BK'/}
							{set apisIndex = apisEntryBean.index/}
							{set sectionId = "APIS_PR_TDOC_"+traveller.paxNumber+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
							{set id = "PSPT_"+flowSuffix+"_"+apisEntryBean.target.type+"_"+apisEntryBean.target.value+"_"+apisIndex/}
							{if (traveller_index != 0)}
								{set sendMandatoryInfo = 'FALSE'/}
							{/if}
						{/if}
						
						<input type="hidden" value="${traveller.withInfant}" name="isAdtWithInfant_${traveller.paxNumber}" />
						<article class="pax panel " id="passenger_${traveller.paxNumber}" >
							<header class="pi_alpipaxhdr">
								{set firstName = "FIRST_NAME_${traveller.paxNumber}"/}
								{set lastName = "LAST_NAME_${traveller.paxNumber}"/}
								<h1 rel="travTitle_${traveller_index}" id="travTitle_${traveller_index}">
								{if (rqstParams.nomineeDetails[firstName] != undefined && rqstParams.nomineeDetails[lastName] != undefined)}
									${rqstParams.nomineeDetails[firstName]} ${rqstParams.nomineeDetails[lastName]}
								{else/}
									${this.data.labels.tx_merci_text_booking_passenger}&nbsp;
									{if (rqstParams.listTravellerBean.travellerBean.length > 1)}
										{var travellerIndex = parseInt(traveller_index)/}
										${travellerIndex+1}&nbsp;
									{/if}
									${this.data.labels.tx_merci_text_booking_apis_information}
								{/if}
								<button type="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="${traveller.paxNumber}" {on tap {fn:'toggle', scope: this, args : {ID1 : traveller.paxNumber} }/}><span>Toggle</span></button>
								</h1>
								<p id="pleaseNote_${traveller.paxNumber}">${this.data.labels.tx_merci_text_booking_pleasenotethat}</p>
								<p id="indicates_${traveller.paxNumber}"  data-aria-hidden="false"><span class="mandatory">*</span> <small>${this.data.labels.tx_merci_text_booking_alpi_indicates}</small></p>
							</header>
							<section id="section_${traveller.paxNumber}" data-aria-hidden="false">
								<div class="pax">
									<div class="pi_alpipaxd">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiPaxDetails",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												traveller : traveller,
												apisSectionBean : apisSectionBean,
												travellerIndex : traveller_index,
												paxTitleCode : paxTitleCode,
												paxFirstName : paxFirstName,
												paxLastName : paxLastName,
												paxNationalityCode : paxNationalityCode,
												genderIDENReq : genderIDENReq,
												id : id,
												sectionId : sectionId,
												ApisPSPT : ApisPSPT,
												ApisNat : ApisNat,
												directLogin : rqstParams.enableDirectLogin,
													ApisIdent : ApisIdent,
													dobIDENReq: dobIDENReq,
													fNameIDENReq: fNameIDENReq,
													lNameIDENReq: lNameIDENReq

											}
										} /}
									</div>
									<!-- APIS SECTION - START -->
									<div class="pi_alpipaxpspt">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPspt",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller,
												sendMandatoryInfo : sendMandatoryInfo
											}
										} /}
									</div>
									<div class="pi_alpipaxvsa">
									{@html:Template {
										classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa",
										data: {
											labels : this.data.labels,
											siteParameters : siteParameters,
											gblLists : gblLists,
											rqstParams : rqstParams,
											isAdultPsngr : 'Y',
											apisSectionBean : apisSectionBean,
											traveller : traveller
										}
									} /}
									</div>
									<div class="pi_alpipaxredn">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisRedn",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller
											}
										} /}
									</div>
									<div class="pi_alpipaxknwt">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisKnwt",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller
											}
										} /}
									</div>
									<div class="pi_alpipaxaddr">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisDestAddr",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller
											}
										} /}
									</div>
									<div class="pi_alpipaxres">
										{@html:Template {
											classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisResidenceAddr",
											data: {
												labels : this.data.labels,
												siteParameters : siteParameters,
												gblLists : gblLists,
												rqstParams : rqstParams,
												isAdultPsngr : 'Y',
												apisSectionBean : apisSectionBean,
												traveller : traveller
											}
										} /}
									</div>
									<!-- APIS SECTION - END -->
								</div>
								{if (traveller.withInfant)}
									{var infant = traveller.infant/}
									<div class="pax infant">
										<h2><span class="data">${this.data.labels.tx_merci_text_booking_alpi_infant}</span> {if (siteParameters.showInfantNewUI.toUpperCase() == 'TRUE')}<small>${this.data.labels.tx_merci_text_infant_age}</small>{/if}</h2>
										{if (siteParameters.showCopyName.toUpperCase() == 'TRUE')}
											<p class="copy-name">
												<input type="checkbox" id="cb-infant-${infant.infantNumber}" name="pax-type" {on click {fn:"copyLastName",args : {infantId : infant.infantNumber} } /}/>
												<label for="cb-infant">${this.data.labels.tx_merci_text_cop_fname}</label>
											</p>
										{/if}
										<div  class="pi_alpipaxinfnt">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiInfantPaxDetails",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													infant : infant,
													travellerIndex : traveller_index,
													paxNationalityCode : paxNationalityCode,
													id : id,
													ApisPSPT : ApisPSPT,
													genderIDENReq : genderIDENReq,
													ApisNat : ApisNat,
														ApisIdent : ApisIdent,
														dobIDENReq: dobIDENReq,
														fNameIDENReq: fNameIDENReq,
														lNameIDENReq: lNameIDENReq
												}
											} /}
										</div>

										<!-- INFANTAPIS SECTION - START -->
										<div class="pi_alpipaxipspt">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPspt",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller,
													infant : infant,
													sendMandatoryInfo : sendMandatoryInfo
												}
											} /}
										</div>
										<div class="pi_alpipaxivsa">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisa",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller
												}
											} /}
										</div>
										<div class="pi_alpipaxiredn">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisRedn",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller
												}
											} /}
										</div>
										<div class="pi_alpipaxiknwt">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisKnwt",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller
												}
											} /}
										</div>
										<div class="pi_alpipaxiaddr">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisDestAddr",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'N',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller
												}
											} /}
										</div>
										<div class="pi_alpipaxires">
											{@html:Template {
												classpath: "modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisResidenceAddr",
												data: {
													labels : this.data.labels,
													siteParameters : siteParameters,
													gblLists : gblLists,
													rqstParams : rqstParams,
													isAdultPsngr : 'Y',
													apisSectionBean : traveller.infant.apisSectionBean,
													traveller : traveller
												}
											} /}
										</div>
										<!-- INFANT APIS SECTION - END -->
									</div>
								{/if}
							</section>
						</article>
					{/foreach}

					{if siteParameters.showNewContactDisplay == 'TRUE' }
						<article class="panel contact">
							{@html:Template {
								id:"extendedContactInfoAlpiTemplate",
								classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtended",
								data: {
									labels : this.data.labels,
									siteParameters : siteParameters,
									gblLists : gblLists,
									rqstParams : rqstParams	,
									htmlBean : rqstParams.htmlBean,
									directLogin : rqstParams.enableDirectLogin
								}
							} /}
						</article>
					{/if}
					{if siteParameters.showNewContactDisplay == 'FALSE' }
						<article class="panel contact">
							{@html:Template {
								id:"contactInfoAlpiTemplate",
								classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfo",
								data: {
									labels : this.data.labels,
									siteParameters : siteParameters,
									gblLists : gblLists,
									rqstParams : rqstParams
								}
							} /}
						</article>
					{/if}
					
					{if this._siteBillingRequired() && this.data.siteParams.enableBillingInAlpi == "TRUE" &&  !(this._isRebookingFlow())}
						<article class="panel">
							{call billingDetails.billingDetails(this.data.labels,siteParameters,rqstParams,this._merciFunc,gblLists,'alpi')/}
						</article>
					{/if}

           			{if rqstParams.requestBean.IS_SPEED_BOOK1 != "TRUE"}
						<aside>
							{if (siteParameters.displayUMMessage == 'TRUE')}
								<div class="popup age" id="agePopup">
									<article class="panel age">
									  <header id="popupContentContainer">
									  </header>
									</article>
									<button type="button" class="close" {on tap {fn:"closeUNMRPopup" } /}><span>Close</span></button>
								</div>
								<p id="ageContentDisplay">${this.data.labels.tx_merci_text_umnr_disclaimer}</p>
								<p id="ageAlertBox"><a href="javascript:void(0);" class="popup-age-rules" {on tap {fn:"dispUNMRPopup" } /}>${this.data.labels.tx_merci_text_pax_under_18_years}</a></p>
							{/if}
							{var noOfSeg = 0/}
							{var showSeat = false /}
							{var isOperatedByOtherAirline = false /}
							{var eligibleSegments = [] /}
							{foreach itinerary in rqstParams.listItineraryBean.itineraries}
								{foreach segment in itinerary.segments}
									{set isOperatedByOtherAirline = false /}
									{set noOfSeg = noOfSeg+1 /}
									{if (segment_index == 0 && itinerary_index == 0)}
										<input type="hidden" name="BOOKING_CLASS" id="BOOKING_CLASS" value="${segment.cabins[0].RBD}"/>
										<input type="hidden" name="B_AIRPORT_CODE" id="B_AIRPORT_CODE" value="${segment.beginLocation.locationCode}"/>
										<input type="hidden" name="E_AIRPORT_CODE" id="E_AIRPORT_CODE" value="${segment.endLocation.locationCode}"/>
										<input type="hidden" name="B_DATE" id="B_DATE" value="${segment.beginDateBean.yearMonthDay}"/>
										<input type="hidden" name="B_TIME" id="B_TIME" value="${segment.beginDateBean.formatTimeAsHHMM}"/>
										<input type="hidden" name="EQUIPMENT_TYPE" id="EQUIPMENT_TYPE" value="${segment.equipmentCode}"/>
										<input type="hidden" name="E_TIME" id="E_TIME" value="${segment.endDateBean.formatTimeAsHHMM}"/>
										<input type="hidden" name="DECK" id="DECK" value="L"/>
										<input type="hidden" name="AIRLINE_CODE" id="AIRLINE_CODE" value="${segment.airline.code}"/>
										<input type="hidden" name="FLIGHT" id="FLIGHT" value="${segment.flightNumber}"/>
										<input type="hidden" name="OUTPUT_TYPE" id="OUTPUT_TYPE" value="2"/>
										<input type="hidden" name="itinerary_index" id="itinerary_index" value="1"/>
										<input type="hidden" name="IS_SEAT_SERVICING" id="IS_SEAT_SERVICING" value="FALSE"/>
									{/if}
									{if !this.__merciFunc.isEmptyObject(segment.opAirline) && segment.opAirline.code!=segment.airline.code}
										{set isOperatedByOtherAirline = true /}
									{/if}
									{if !isOperatedByOtherAirline || !this.__merciFunc.booleanValue(siteParameters.siteHideSeatCodeShare)}
										{set showSeat = true /}
										{set eligibleSegments = this.pushElement(eligibleSegments,segment.id) /}
									{/if}
								{/foreach}
							{/foreach}
							
							{var seatsEligSegmentsJSON = this.stringify(eligibleSegments) /}
							{if this.__merciFunc.booleanValue(siteParameters.siteHideSeatCodeShare)}
								<input type="hidden" name="SEGMENT_ID" id="SEGMENT_ID" value="${eligibleSegments[0]}"/>
							{else/}
								<input type="hidden" name="SEGMENT_ID" id="SEGMENT_ID" value="1"/>
							{/if}

							<input type="hidden" name="seatsEligibleSegments" id="seatsEligibleSegments" value="${seatsEligSegmentsJSON}"/>
							{if this.__merciFunc.booleanValue(siteParameters.SAPolicy) && this.__merciFunc.booleanValue(rqstParams.isSQSARegulnEnabled)}
								<div id="Above18">
									<input id="checkAbove18Box" name="checkAbove18Box" type="checkbox" {on click {fn: 'toggleSubmitAlpi'}/}>
									<label>${ this.__merciFunc.formatString(this.data.labels.tx_merci_sq_sapolicy,'<a href='+siteParameters.SAPolicyURL +' target="_blank">','</a>')}</label>
								</div>
							{/if}

							{if this.__merciFunc.booleanValue(siteParameters.siteUseEnhancedSeatmap) && this.__merciFunc.booleanValue(siteParameters.siteAllowSeatBooking)}
								
								{if !this.__merciFunc.booleanValue(siteParameters.servicesCatalog) 
									&& (!this.__merciFunc.booleanValue(siteParameters.siteHideSeatCodeShare) 
										|| (this.__merciFunc.booleanValue(siteParameters.siteHideSeatCodeShare) && this.__merciFunc.booleanValue(showSeat)))}
									
									<nav class="buttons tab-hidden">
										<ul>
											<li><a class="navigation seat submitAlpiButton" href="javascript:void(0);" {on click {fn:"onSeatSelectClick",args : {action: "MSEATAction.action"} } /}>${this.data.labels.tx_merci_text_booking_apis_select_seat_for_passenger}</a></li>
										</ul>
									</nav>
								{/if}
								
								{if (eligibleSegments.length > 1)}
									<input type="hidden" name="HAS_OTHER_SEGMENTS" id="HAS_OTHER_SEGMENTS" value="TRUE"/>
								{else/}
									<input type="hidden" name="HAS_OTHER_SEGMENTS" id="HAS_OTHER_SEGMENTS" value="FALSE"/>
								{/if}
							{/if}
						</aside>
					{/if}

					<input type="hidden" name="result" id="result" value="json"/>
					<input type="hidden" name="gotoChargeableFsr" id="gotoChargeableFsr" value="false"/>
					{if !this.__merciFunc.isEmptyObject(rqstParams.DWM_FOOTER_CONTENT)}
					          {@html:Template {
						            classpath: "modules.view.merci.common.templates.MDWMPlaceholder",
						            data: {
						            	placeholder: rqstParams.DWM_FOOTER_CONTENT,
						            	placeholderType: "dwmFooter"
						            }
					          }/}
						{/if}
					<footer class="buttons margin30 footer">
						{if rqstParams.requestBean.IS_SPEED_BOOK1 != "TRUE"}
							{if isNewSearch == 'TRUE'}
								<button class="validation newsearch" type="button" {on tap {fn:'restartBooking',args:searchURL}/}>${this.data.labels.tx_merci_text_booking_new_search}</button>
							{/if}
							{if !(this.__merciFunc.booleanValue(siteParameters.servicesCatalog) && this.__merciFunc.booleanValue(siteParameters.proceedToCatalog) && this.__merciFunc.booleanValue(showSeat))}
								<button class="validation submitAlpiButton">${this.data.labels.tx_merci_text_booking_apis_proceed_to_payment}</button>
							{/if}
							{if this.__merciFunc.booleanValue(showSeat) && this.__merciFunc.booleanValue(siteParameters.servicesCatalog)}
								<button class="validation submitAlpiButton" type="button" {on tap {fn:"onSubmitAlpi", args: this.getSubmitArgs(id, true)} /}>{if this.__merciFunc.booleanValue(siteParameters.proceedToCatalog)}${this.data.labels.tx_merci_text_booking_continue}{else/}${this.data.labels.tx_merci_alpi_addservices}{/if}</button>
							{else/}
								{if this.__merciFunc.booleanValue(siteParameters.siteUseEnhancedSeatmap) && this.__merciFunc.booleanValue(siteParameters.siteAllowSeatBooking) && (!this.__merciFunc.booleanValue(siteParameters.siteHideSeatCodeShare) || showSeat)}
									<button class="validation submitAlpiButton seat-select hidden" id="add_services" type="button" {on tap {fn:"onSeatSelectClick",args : {action: "MSEATAction.action"} } /}>${this.data.labels.tx_merci_text_booking_apis_select_seat_for_passenger}</button>
								{/if}
							{/if}
							<button class="validation back" type="button" {on tap {fn:'goBack', scope: this.moduleCtrl}/}>${this.data.labels.tx_merci_text_back}</button>
						{else/}
							<button type="button" class="validation submitAlpiButton" id="" {on tap {fn:"onSubmitAlpi", args: this.getSubmitArgs(id, false)} /} >${this.data.labels.tx_merci_text_seatsel_btnsave}</button>
							<button type="button" class="validation cancel" {on tap {fn:'goBack', scope: this.moduleCtrl}/}>${this.data.labels.tx_merci_cancel}</button>
						{/if}
					</footer>
				</form>
			</section>
		{/if}
	{/macro}

	{macro includeError()}
		{section {
			id: 'errors',
			bindRefreshTo : [{
				inside : this.data,
				to : "errorOccured",
				recursive : true
			}],
			macro : {
				name: 'printErrors'
			}
		}/}
	{/macro}

	{macro printErrors()}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
		{if this.data.labels != null && this.data.labels.tx_merci_text_error_message != null}
			{set errorTitle = this.data.labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
			// resetting binding flag
			${this.data.errorOccured = false|eat}
		{/if}
	{/macro}

	{macro alpiFareRecap(rqstParams,siteParameters,currCode,exchRate)}
		{@html:Template {
			classpath: "modules.view.merci.segments.booking.templates.alpi.MAlpiFareRecap",
			data: {
				labels : this.data.labels,
				rqstParams : rqstParams,
				siteParameters : siteParameters,
				currCode:currCode,
				exchRate:exchRate
			}
		} /}
	{/macro}
{/Template}