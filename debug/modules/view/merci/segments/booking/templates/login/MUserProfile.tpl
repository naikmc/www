{Template { 
	$classpath : "modules.view.merci.segments.booking.templates.login.MUserProfile" , 
	$hasScript : true ,
	$macrolibs: {
    common: 'modules.view.merci.common.utils.MerciCommonLib',
    message: 'modules.view.merci.common.utils.MerciMsgLib'
	}
}}
		
	{macro main()}
		{if (this.moduleCtrl.getModuleData().login.MUserProfile_A != null)}
			{var labels = this.moduleCtrl.getModuleData().login.MUserProfile_A.labels/}
			{var siteParameters = this.moduleCtrl.getModuleData().login.MUserProfile_A.siteParam /}
			{var gblLists = this.moduleCtrl.getModuleData().login.MUserProfile_A.globalList /}
			{var rqstParams = this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam /}
			{var errors = this.moduleCtrl.getModuleData().login.MUserProfile_A.errorStrings /}
		{/if}
        {call includeError(labels) /}
		<nav class="tabs baselineText" id="edit">
			<ul>
				<li><a class="active navigation" id = "tab_1" href="javascript:void(0);" data-tabs="passenger" {on tap {fn:'swap', scope: this , args:{}} /}>
					${labels.tx_merci_dl_passenger}</a></li>
				<li><a class="navigation" id = "tab_2" href="javascript:void(0);" data-tabs="payment" {on tap {fn:'reSwap', scope: this , args:{} } /}>${labels.tx_merci_dl_payment}</a></li>
			</ul>
		</nav>	
				
		<form name="profileForm" id="profileForm" {on submit {fn: 'onSubmitProfile'}/} >	
			<input type="hidden" name="PAGE_TICKET" value="" />
			<input type="hidden" name="result" value="json" />
			{if rqstParams.ENABLE_DIRECT_LOGIN != null && rqstParams.ENABLE_DIRECT_LOGIN != "undefined"}
				<input type="hidden" name="ENABLE_DIRECT_LOGIN" value="${rqstParams.ENABLE_DIRECT_LOGIN}" />
			{elseif rqstParams.ENABLE_EARLY_LOGIN != null && rqstParams.ENABLE_EARLY_LOGIN != "undefined"/}
				<input type="hidden" name="ENABLE_EARLY_LOGIN" value="${rqstParams.ENABLE_EARLY_LOGIN}" />
			{/if}
			
			<section class="tabs" id="passenger" >
				<article class="panel pax" >
					<header>
						<h1>${labels.tx_merci_dl_identification}
						<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="identification" {on click {fn:'toggle', scope: this, args : { ID1 : 'identification' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>
						</h1>
					</header>
					<section id="section_identification" aria-hidden="false">
						<div class="pax">
							<p>
								<label>${labels.tx_merci_dl_id}</label>
									<input id="profileID" type="text" {if rqstParams.USER_ID_1.indexOf("undefined") == -1} value="${rqstParams.USER_ID_1}" {/if}  readonly />
								</p>
							<p class="password" id="profilePassword" >
								<label for="profilePassword" id = "profilePassword1">${labels.tx_merci_dl_password}</label>
								{if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}
									<input id="profilePassword2" type="text"  placeholder="*******" class="inputField widthClearFull securitymask" {if rqstParams.PASSWORD_1.indexOf("undefined") == -1}  value = "${rqstParams.PASSWORD_1}" {/if} readonly/>
								{elseif (rqstParams.ENABLE_EARLY_LOGIN == "YES") /}
									<input id="profilePassword2" type="text" name="PASSWORD_1" placeholder="*******" class="inputField widthClearFull securitymask" {if rqstParams.PASSWORD_1.indexOf("undefined") == -1} value = "${rqstParams.PASSWORD_1}" {/if} />
								{/if} 
							</p>
							<p class="createpassword" id="newPassword">
								<label for="newPassword">${labels.tx_merci_dl_newPassword}</label>
							</p>
							<p id="newPassword" hidden="true">
								<label >${labels.tx_merci_dl_strengthPassword}</label><span class="passwordstrength"></span> 
							</p>
							
							<p class="create2password" id="new2Password" >
								<label for="new2Password">${labels.tx_merci_dl_reenterPassword}</label>
							</p>
						 </div>
							<footer aria-hidden="false">
								<button id="changePassword" type="button" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")} disabled {/if} {on click {fn:'createPassword', scope: this} /}>${labels.tx_merci_dl_changePassword}</button>
								{if !(rqstParams.ENABLE_DIRECT_LOGIN == "YES")}
									<button id="createPass">${labels.tx_merci_dl_savePassword}</button>
								{/if}
							</footer>
					</section>
				</article>
			
				<article class="panel pax"   >
					<header>
						<h1>
							{if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}
								{if rqstParams.TITLE_1.indexOf("undefined") == -1}${rqstParams.TITLE_1}&nbsp;{/if}{if rqstParams.FIRST_NAME_1.indexOf("undefined") == -1}${rqstParams.FIRST_NAME_1}&nbsp;{/if}{if rqstParams.LAST_NAME_1.indexOf("undefined") == -1}${rqstParams.LAST_NAME_1}{/if}
							{elseif (rqstParams.ENABLE_EARLY_LOGIN == "YES") /}
								{if rqstParams.TITLE_1.indexOf("undefined") == -1}${rqstParams.TITLE_1}&nbsp;{/if}{if rqstParams.FIRST_NAME_1.indexOf("undefined") == -1}${rqstParams.FIRST_NAME_1}&nbsp;{/if}{if rqstParams.LAST_NAME_1.indexOf("undefined") == -1}${rqstParams.LAST_NAME_1}{/if}
							{/if}
							<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="${rqstParams.USER_ID}" {on click {fn:'toggle', scope: this, args : {ID1 : rqstParams.USER_ID} }/}><span>${labels.tx_merci_dl_toggle}</span></button>
						</h1>
					</header>
					<section id="section_${rqstParams.USER_ID}">
						<div>
							{@html:Template {
								id : "paxDetails",
								defaultTemplate: "modules.view.merci.segments.booking.templates.alpi.MAlpiPaxDetails",
								data: {
									labels : labels,
									siteParameters : siteParameters,
									gblLists : gblLists,
									rqstParams : rqstParams,
									directLogin : rqstParams.ENABLE_DIRECT_LOGIN,
									earlyLogin : rqstParams.ENABLE_EARLY_LOGIN,
									flowFrom : "profilePage"
									}
							} /}
						</div>
					</section>
				</article >

				/*Frequent Flyer Panel*/
				<article class="panel pax"  >
					<header>
						<h1 >
							/*${labels.tx_merci_fl_frequentFlyerDetails}*/Frequent Flyer Details
							<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="frequentFlyer" {on click {fn:'toggle', scope: this, args : { ID1 : 'frequentFlyer' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>
						</h1>					
					</header>
					<section id="section_frequentFlyer">
						{@html:Template {
							id:"frequentFlyerDetails",
							defaultTemplate: "modules.view.merci.segments.booking.templates.alpi.fqtv.MAlpiFQTV",
							data: {
								labels : labels,
								rqstParams : rqstParams,
								gblLists : gblLists,
								siteParameters : siteParameters,
								directLogin : rqstParams.ENABLE_DIRECT_LOGIN,
								earlyLogin : rqstParams.ENABLE_EARLY_LOGIN,
								flowFrom : "profilePage"
							}
						} /}
					</section>
				</article> 
		 
				<article class="panel pax" >
					{@html:Template {
						id:"contactInfoAlpiTemplate",
						defaultTemplate: "modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtended",
						data: {
							labels : labels,
							rqstParams : rqstParams, 
							gblLists : gblLists,
							siteParameters : siteParameters,
							directLogin : rqstParams.ENABLE_DIRECT_LOGIN,
							earlyLogin : rqstParams.ENABLE_EARLY_LOGIN,
							flowFrom : "profilePage"
						}
					} /}
				</article>
				{if rqstParams.ENABLE_EARLY_LOGIN == "undefined" || !rqstParams.ENABLE_EARLY_LOGIN === "YES"}
					<article class="panel pax" >
						<header>
							<h1 >
								${labels.tx_merci_text_dl_passportInfo}Passport Information
								<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="passportInformation" {on click {fn:'toggle', scope: this, args : { ID1 : 'passportInformation' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>
							</h1>
						</header>
						<section id="section_passportInformation">
							<p class="">
								<label>${labels.tx_merci_text_dl_document}</label>
								<input type="text" value="${labels.tx_merci_dl_passport}" readonly = "readonly" id="input102">
							</p>
							
							<p class="">
								<input  id="passport1" type="checkbox"  checked= "checked" {on click {fn :"useName"}/}/>
								<label for="passport1">${labels.tx_merci_dl_useName}</label>
							</p>
							
							<p class="">
								<label>${labels.tx_merci_dl_namePassport}</label>
								<input type="text" {if rqstParams.FIRST_NAME_1.indexOf("undefined") == -1} value="${rqstParams.FIRST_NAME_1}" {/if} id="passportName" readonly />
							</p>
							
							<ul class="input-elements" id="passInfo01">
								<li class="top-input-element">
									<label>${labels.tx_merci_dl_gender}</label>
									<ul class="input-radio">
										{if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}
											<li class="width_50">
												<input name="gender" id="li1" type="radio" disabled {if rqstParams.GENDER_1 == "M" || rqstParams.GENDER_1 == "m" } checked= "checked"  {/if} class="is-tab">
												<label for="li1">${labels.tx_merci_dl_male}</label>
											</li>
											<li class="width_50">
											  <input name="gender" id="li2" type="radio" {if rqstParams.GENDER_1 == "F" || rqstParams.GENDER_1 == "f" } checked= "checked" {/if} disabled class="is-tab">
											  <label for="li2">${labels.tx_merci_dl_female}</label>
											</li>
										{elseif rqstParams.ENABLE_EARLY_LOGIN == "YES" /}
											<li class="width_50">
												<input name="gender" id="li1" type="radio"  {if rqstParams.GENDER_1 == "M" || rqstParams.GENDER_1 == "m" } checked= "checked"  {/if} class="is-tab">
												<label for="li1">${labels.tx_merci_dl_male}</label>
											</li>
											<li class="width_50">
											  <input name="gender" id="li2" type="radio" {if rqstParams.GENDER_1 == "F" || rqstParams.GENDER_1 == "f" } checked= "checked" {/if} class="is-tab">
											  <label for="li2">${labels.tx_merci_dl_female}</label>
											</li>
										{/if}
									</ul>
								</li>
							</ul>
							
							{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
								<p class="">
									<label>${labels.tx_merci_dl_nationality}</label>
									<input type="text" {if rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY.indexOf("undefined") == -1}value="${rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY}" {/if} id="input102" readonly = "readonly" />
								</p>
							{elseif rqstParams.ENABLE_EARLY_LOGIN == "YES" /}
								<p class="">
									<label>${labels.tx_merci_dl_nationality}</label>
									<input type="text"  id="input102" >
								</p>
							{/if}
							
							{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
								<p class="">
									<label>${labels.tx_merci_dl_pNumber}</label>
									<input type="text" {if rqstParams.PASSPORT_NUMBER_1_1.indexOf("undefined") == -1} value="${rqstParams.PASSPORT_NUMBER_1_1}" {/if} id="input103" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if} />
								</p>
							{elseif rqstParams.ENABLE_EARLY_LOGIN == "YES"  /}
								<p class="">
									<label>${labels.tx_merci_dl_pNumber}</label>
									<input type="text" value="${rqstParams.PASSPORT_NUMBER_1_1}" id="input103" />
								</p>
							{/if}
							
							{var expMonth = "" /}
							{var expYear = "" /}
							{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
								<div class="list expiry userProfile">
									<label for="select32">${labels.tx_merci_dl_expDate}</label>
									{set expMonth = rqstParams.PASSPORT_EXP_DATE_1_1.substring(4,6)/}
									{set expYear = rqstParams.PASSPORT_EXP_DATE_1_1.substring(0,4)/}
									<ul class="input">
										<li>
											<label for="expMonth_${rqstParams.USER_ID_1}">${labels.tx_merci_dl_month}</label>
											<select  id="expMonth_${rqstParams.USER_ID_1}" name="expMonth_${rqstParams.USER_ID_1}" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")} disabled {/if} >
												{foreach month in gblLists.slShortMonthList}
													<option value="${month_ct}" {if ((expMonth) == month_ct)}selected="selected" {/if}>${gblLists.slShortMonthList[month_index][1]}</option>
												{/foreach}
												</select>
										</li>
										{var presentDate = new Date()/}
										{set presentYear = presentDate.getFullYear()/}
										<li>
											<label for="expYear_${rqstParams.USER_ID_1}">${labels.tx_merci_dl_year}</label>
											<select  id="expYear_${rqstParams.USER_ID_1}" name="expYear_${rqstParams.USER_ID_1}" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")} disabled {/if}>
												{for var j=0; j<= 112 ; j++}
													<option value="${presentYear + j}" {if (expYear == (presentYear + j))}selected="selected"{/if}>${presentYear+j}</option>
												{/for}
											</select>
										</li>
									</ul>
								</div>
								<p class="">
									<label>${labels.tx_merci_dl_passIssueAuthority}</label>
									<input type="text" value="" id="input105" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}>
								</p>
							{/if}
						</section>
					</article>
				{/if}
			</section > 	
		
		
			<section class="tabs" id="payment">
				<article class="panel payment billing" >
					<header>
						<h1>
							${labels.tx_merci_dl_paymentInfo}
							<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="paymentInformation" {on click {fn:'toggle', scope: this, args : { ID1 : 'paymentInformation' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>
						</h1>
					</header>
					<section id="section_paymentInformation">
						<p class="passport">
							<input  id="passport2" type="checkbox" checked/>
							<label for="passport2">${labels.tx_merci_dl_usePassName}</label>
						</p>
						{foreach card in rqstParams.listCCInformation}
							{foreach cardType in gblLists.slLanguageCreditCard}
								{if card.companyCode == cardType[0]}
									{var cardname = cardType[1] /}
								{/if}
							{/foreach}
							<header>
								<h2 class="subheader"> <span>${cardname}${card.accountNumber}</span>
									<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="payment1" {on click {fn:'divToggle', scope: this, args : { ID1 : 'payment1' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>        
								</h2>
							</header>
							<div id="div_payment_${card_ct}">
								<p><small>${labels.tx_merci_text_booking_alpi_indicates}</small></p>
								<p class="name">
									<label for="input20">${labels.tx_merci_dl_cardHolderName}</label>
									<input id="input20" type="text" {if card.ownerName.indexOf("undefined") == -1} value="${card.ownerName}" {/if} />
								</p>
								<p class="card">
									<label for="select1">${labels.tx_merci_dl_cardType}</label>
									<select  id="select1" name="AIR_CC_TYPE" >
										{foreach card in rqstParams.listCCInformation}
											{foreach cardType in gblLists.slLanguageCreditCard}
												{if card.companyCode == cardType[0]}
													<option value="${cardType[0]}" selected {if (this.data.directLogin=="YES")} disabled {/if}>${cardType[1]}</option>
												{/if}
											{/foreach}
										{/foreach}
									</select>
								</p>
								<p class="card-number">
									<label for="input21">${labels.tx_merci_dl_creditCardNumber}</label>
									<input id="input21" type="text" {if card.visibleAccountNumber.indexOf("undefined") == -1} value="${card.visibleAccountNumber}" {/if} placeholder="">
								</p>
								<div class="list expiry userProfile">
									{var dobMonth = ""/}
									{var dobYear = ""/}
									{set dobMonth = card.expiryDate.formatDateAsYYYYMM.substring(4,6)/}
									{set dobYear = card.expiryDate.formatDateAsYYYYMM.substring(0,4)/}
									<label for="select32">${labels.tx_merci_dl_expDate}</label>
									<ul class="input">
										<li>
											<label for="select32">${labels.tx_merci_dl_month}</label>
											<select id="CCexpiryDateMonth" name="CCexpiryDateMonth">
												{foreach month in gblLists.slShortMonthList}
													<option value="${month_ct}" {if ((dobMonth) == month_ct)}selected="selected" {/if}>${gblLists.slShortMonthList[month_index][1]}</option>
												{/foreach}
											</select>
										</li>
										<li>
											{var presentDate = new Date()/}
											{set presentYear = presentDate.getFullYear()/}
											<label for="input33">${labels.tx_merci_dl_year}</label>
											<select  id="input33" name="CCexpiryDateYear" >
												{for var j=0; j<= 112 ; j++}
													<option value="${presentYear + j}" {if (dobYear == (presentYear + j))}selected="selected"{/if}>${presentYear+j}</option>
												{/for}
											</select>
										</li>
									</ul>
								</div>
							</div>
						{/foreach}
					</section>
				</article>		
		
				{if rqstParams.ENABLE_EARLY_LOGIN == "undefined" || !rqstParams.ENABLE_EARLY_LOGIN === "YES"}	
					<article class="panel payment billing" >
						<header>
							<h1>${labels.tx_merci_dl_billInfo}
								<button type="button" role="button" class="toggle" aria-expanded="true" data-aria-controls="section22 footer22 p222" id ="billingInformation" {on click {fn:'toggle', scope: this, args : { ID1 : 'billingInformation' } }/}><span>${labels.tx_merci_dl_toggle}</span></button>
							</h1>
							<p id="p104"><small>${labels.tx_merci_dl_indicates}</small></p>
						</header>
						<section id="section_billingInformation">
							<h2>${labels.tx_merci_text_booking_purc_creditcardbill}</h2>
							<p class="copy-card">
								${labels.tx_merci_dl_pleaseEnter}Please enter in English alphabets/numbers and allowed special characters[#/'-,]
							</p>
							<p class="address">
								{var prefillVar = ''/}
								{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
									{if rqstParams.LIST_ADDRESS_INFORMATION_LINE_1.indexOf("undefined") == -1}
										{set prefillVar = rqstParams.LIST_ADDRESS_INFORMATION_LINE_1/}
									{/if}
								{/if}
								<label for="AIR_CC_ADDRESS_FIRSTLINE">${labels.tx_merci_text_booking_purc_insurance_address1}</label>
								<input id="AIR_CC_ADDRESS_FIRSTLINE" type="text" value="${prefillVar}"  autocorrect="off" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}/>
							</p>
							<p class="address">
								{set prefillVar = ''/}
								{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
									{if rqstParams.LIST_ADDRESS_INFORMATION_LINE_2.indexOf("undefined") == -1}
										{set prefillVar = rqstParams.LIST_ADDRESS_INFORMATION_LINE_2/}
									{/if}
								{/if}
								<label for="AIR_CC_ADDRESS_SECONDLINE">${labels.tx_merci_text_booking_purc_insurance_address2}</label>
								<input id="AIR_CC_ADDRESS_SECONDLINE"  type="text" autocorrect="off" value="${prefillVar}"  {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}/>
							</p>
							<p class="city">
								{set prefillVar = ''/}
								{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
									{if rqstParams.LIST_ADDRESS_INFORMATION_CITY.indexOf("undefined") == -1}
										{set prefillVar = rqstParams.LIST_ADDRESS_INFORMATION_CITY/}
									{/if}
								{/if}
								<label for="AIR_CC_ADDRESS_CITY">${labels.tx_merci_text_booking_purc_creditcardcity}</label>
								<input autocorrect="off" id="AIR_CC_ADDRESS_CITY"  type="text" value="${prefillVar}" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if} />
							</p>
							<div class="list state padBottom1px">
								<ul class="input">
									<li>
										{set prefillVar = ''/}
										{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
											{if rqstParams.LIST_ADDRESS_INFORMATION_STATE.indexOf("undefined") == -1}
												{set prefillVar = rqstParams.LIST_ADDRESS_INFORMATION_STATE/}
											{/if}
										{/if}
										<label for="AIR_CC_ADDRESS_STATE">
											${labels.tx_merci_text_booking_purc_creditcardstate}
										</label>
										<input autocorrect="off" id="AIR_CC_ADDRESS_STATE"  type="text" value="${prefillVar}" maxlength="3" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}>
									</li>
									<li>
										{set prefillVar = ''/}
										{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
											{if rqstParams.LIST_ADDRESS_INFORMATION_POSTAL_CODE.indexOf("undefined") == -1}
												{set prefillVar = rqstParams.LIST_ADDRESS_INFORMATION_POSTAL_CODE/}
											{/if}
										{/if}
										<label  for="AIR_CC_ADDRESS_ZIPCODE">
											${labels.tx_merci_text_booking_purc_creditcardpostcode}
										</label>
										<input autocorrect="off" id="AIR_CC_ADDRESS_ZIPCODE" type="text" value="${prefillVar}" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}/>
									</li>
								</ul>
							</div>
							<p class="country">
								{if rqstParams.ENABLE_DIRECT_LOGIN == "YES"}
									{if rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY.indexOf("undefined") == -1}
										{var countryCode = rqstParams.LIST_ADDRESS_INFORMATION_COUNTRY /}
									{/if}

									{var countryName = ''/}
									{if gblLists.slCountryCallingCodes != null}
										{foreach country in gblLists.slCountryCallingCodes}
											{if countryCode == country[0]}
												{set countryName = country[1]/}
											{/if}
										{/foreach}
									{/if}
								{/if}
								<label for="AIR_CC_ADDRESS_COUNTRY_TXT">${labels.tx_merci_text_purcui_country_label}</label>
								<input type="text" id="AIR_CC_ADDRESS_COUNTRY_TXT" value="${countryName}" {if (rqstParams.ENABLE_DIRECT_LOGIN == "YES")}  readonly = "readonly" {/if}/>
							</p>
						</section>
					</article>
				{/if}
			</section > 	
			<footer class="buttons" id = "buttons">
				<input type="hidden" name="MAIL_TO" value="" />
				<input type="hidden" name="CONTACT_POINT_SOS_NAME" value="" />
				<input type="hidden" name="CONTACT_POINT_SOS_PHONE" value="" />
				<input type="hidden" name="CONTACT_POINT_SOS_PHONE_ALTERNATE" value="" />
				{if !(rqstParams.ENABLE_DIRECT_LOGIN == "YES")} 
					<button class="validation " id="save" type="submit">Save</button>
					<button class="validation back cancel" id="cancel" type="button" {on click {fn : 'cancelUpdate'} /}>Cancel</button>
				{/if}
			</footer>
		</form>
	{/macro}
	
	{macro includeError(labels)}
		{section {
			id: 'errors',
			bindRefreshTo : [{
				inside : this.data,
				to : "errorOccured",
				recursive : true
			}],
			macro : {
				name: 'printErrors',
				args: [labels]
			}
		}/}
	{/macro}
	
	{macro printErrors(labels)}
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
			/* resetting binding flag */
			${this.data.errorOccured = false|eat}
		{/if}
	{/macro}
{/Template}