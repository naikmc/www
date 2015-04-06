{Template {
	$classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.RequiredDetails',
	$macrolibs : {
		common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
	},
	$hasScript:true
}}
{var OperationgGroupOfAirlines=false /}
{macro main()}
	{var label = moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.labels /}
	{var nationalityLabel = moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.Nationality /}
	{var countryNameCodeMap = moduleCtrl.getCountryNameCodeMap() /}
	{var natEditcpr = moduleCtrl.getNatEditCPR() /}
	{var bannerInfo = moduleCtrl.getBannerInfo() /}
	{var jQuerydatepickerclass=false /}
	{if label.redressnum=label.redressnum.split(':')[0].trim()}{/if}
	{if label.knowntraveller=label.knowntraveller.split(':')[0].trim()}{/if}
	//{set OperationgGroupOfAirlines=this.moduleCtrl.getOperatingAirlinesList() /}
	{set OperationgGroupOfAirlines = this.parameters.SITE_MCI_OP_AIRLINE /}
	{if OperationgGroupOfAirlines.split(",").indexOf("SQ") != "-1"}
	{set OperationgGroupOfAirlines=true /}
	{set jQuerydatepickerclass=true /}
	{else /}
	{set OperationgGroupOfAirlines=false /}
	{set jQuerydatepickerclass=false /}
	{/if}
	/*
		For showing drop down always - SQ UAT REQUIREMENT
	*/
	{set OperationgGroupOfAirlines=false /}
	{set jQuerydatepickerclass=false /}
	/*
		End For showing drop down always - SQ UAT REQUIREMENT
	*/
	<div class='sectionDefaultstyle sectionRequiredDetailsBase'>
	<section>
	<div id="regulatoryErrors"></div>
	<div id="natErrors"></div>
	/*{if moduleCtrl.getOtherDocumentType() != null}
		{set othrType = moduleCtrl.getOtherDocumentType() /}
		{if othrType == 'C'}
			<div class="message warning" id='green-card'>
			  <p>${label.GreenCardReq}</p>
			</div>
		{/if}
	{/if}
	{if moduleCtrl.getMoreDetailsRequiredToProceed() && moduleCtrl.getMoreDetailsRequiredToProceed() == true}
		{var temp = moduleCtrl.setMoreDetailsRequiredToProceed(false) /}
		<div class="message warning" id='more-info-req'>
		  <p>${label.MoreInfo}</p>
		</div>
	{/if}*/
	{var showPaxAtIndex = 0 /}
	<form id="MRequiredDetails_A" {on submit "chooseSubmit"/}>
		<nav class="breadcrumbs">
		  <ul>
			<li><span>1</span></li>
			<li class="active"><span>2</span><span class="bread"></span></li>
			<li><span>3</span></li>
			<li><span>4</span></li>
		  </ul>
		</nav>
		<div class="message info">
          <p>${nationalityLabel.NationalityInfo}</p>
        </div>
		{var cpr = moduleCtrl.getCPR() /}
		{var editCPR = moduleCtrl.getEditCPR() /}
		{var chkRegJson = moduleCtrl.getCheckReg() /}
		{var profBean = null /}
		{if cpr.regChkRequired}
			{set showPaxAtIndex = this.getFailedRegChkCustIndex() /}
		{/if}

		{if this.data.regulatoryCurrentPaxIndex=showPaxAtIndex}{/if}

		{var productView = cpr.customerLevel[0].productLevelBean /}
		{var selectedcpr = this.$json.copy(moduleCtrl.getSelectedPax()) /}
		{if this.cprwithallproduct=[]}{/if}
		{if selectedcpr.length < productView.length}
			{for var i = 0 ; i < productView.length ; i++}
				{if this.cprwithallproduct.push({"customer":selectedcpr[0]["customer"],"product":i+""})}{/if}
			{/for}
			//{if this.cprwithallproduct=this.selectedCPRMinusChkInPax(this.cprwithallproduct)}{/if}
			/*Added to make selected CPR take all the products*/
			{var selectedcpr = this.cprwithallproduct /}
		{else /}
			//{if selectedcpr=this.selectedCPRMinusChkInPax(selectedcpr)}{/if}
		{/if}

		{var monthList = cpr.monthsList /}
		{var date = getCurrentDate() /}
		{var noOfDays = getNumberofDays()/}
		{var currDateIfDateSupp = date.curYear + "-" + (date.curMonth < 10 ? "0"+(date.curMonth + 1) : (date.curMonth+1) ) + "-" + (date.curDay < 10 ? "0"+date.curDay : date.curDay) /}
		/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
		{set currDateIfDateSupp = "" /}
		{var paxCount=0 /}
		{var dispControl = "displayNone" /}
		{var dispControlCountry = "displayNone" /}
		{var totalNationalityCount=-1 /}
		<article class="panel">
		<div id="wrap">
			  <ul id="mycarousel" class="jcarousel-skin-tango-requireddetails">
					  {foreach selection in  selectedcpr}
						 /* Passengers */
						{if selection_index == 0}
							{foreach customer inArray selection.customer}
								/*{var custLevelObj = chkRegJson.regulatoryDetails[customer_index] /}*/
								{set totalNationalityCount+=1 /}
									<li class="carrousalSingalePax" data-customer-index="${totalNationalityCount}">
									<span class="pax">${totalNationalityCount+1}</span>
									{var namePrefix="" /}
									{if cpr.customerLevel[customer].otherPaxDetailsBean[0].title}{set namePrefix=cpr.customerLevel[customer].otherPaxDetailsBean[0].title /}{else /}{set namePrefix="" /}{/if}
									<span class="paxName">${jQuery.substitute(label.PaxName, [namePrefix, cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName, 	cpr.customerLevel[customer].customerDetailsSurname])} {if cpr.customerLevel[customer].customerDetailsType == "IN"}<small>(${label.Infant})</small>{/if}{if cpr.customerLevel[customer].customerDetailsType == "C"}<small>(Child)</small>{/if}</span>
									</li>
							{/foreach}
								{/if}
							{/foreach}
			  </ul>
			  <!-- <span id="leftArrow">0</span> <span data-tc="${totalNationalityCount}" id="rightArrow">${totalNationalityCount}</span> -->
         </div>
		{set totalNationalityCount=-1 /}
		{foreach selection in  selectedcpr}
			<!-- Passengers -->
			{if selection_index == 0}
				{foreach customer inArray selection.customer}
					{if bannerInfo}
						{var currCustFFNmbr = moduleCtrl.getFFnumberPrefillPassSelct(customer,selection.product) /}
						{if currCustFFNmbr == bannerInfo.ffNumber}
							{set profBean = moduleCtrl.getBannerInfo() /}
						{elseif bannerInfo.firstName == cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName && bannerInfo.lastName == cpr.customerLevel[customer].customerDetailsSurname/}
							{set profBean = moduleCtrl.getBannerInfo() /}
						{else/}
							{set profBean = null /}
						{/if}
					{/if}
					{var pax_type = null /}
					{var cust_index = null /}
					{var prod_index = null /}
					/*{var custLevel = chkRegJson.regulatoryDetails[customer_index] /} */
						{set totalNationalityCount+=1 /}
						{set cust_index = customer /}
						{set prod_index = selection.product /}
						<!-- Pax1 -->
						/* Set pax type and display the passenger */
						{if cpr.customerLevel[cust_index].customerDetailsType != "IN"}
							{if cpr.customerLevel[cust_index].customerDetailsType == "C"}
								{set pax_type = "child" /}
							{else/}
								{set pax_type = "adult" /}
							{/if}
						{/if}
						{if cpr.customerLevel[cust_index].customerDetailsType == "IN"}
							{set pax_type = "infant" /}
						{/if}
					{var code = "" /}
					{var editNatpage = false /}
					{var editNatpageCount = 0 /}
					{var editNatpageflag = true /}
					 /* Set nationalitycode into code */
					 {if natEditcpr != null}
							{foreach custo inArray natEditcpr.customerLevel}
							  {if custo.uniqueCustomerIdBean.primeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
								  {foreach prodo inArray custo.productLevelBean}
									/*{if prodo.productIdentifiersBean[0].primeId == cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId }*/
									  {if prodo.nationalityBean != null}
										{if code == ""}
										{set code = prodo.nationalityBean[0].nationalityNationalityCode /}
										{/if}
										{set editNatpageCount = editNatpageCount+1 /}
										{set editNatpageflag = true /}
									  {/if}
									   {if !editNatpageflag && prodo.regulatoryDocumentDetailsBean && prodo.regulatoryDocumentDetailsBean[0].documentIssuingCountries }
										{if code == ""}
										{set code = prodo.regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code /}
										{/if}
										{set editNatpageCount = editNatpageCount+1 /}

									  {/if}
									/*{/if}*/
									{set editNatpageflag = false /}
								 {/foreach}
								 {if  editNatpageCount != custo.productLevelBean.length}
									{var editNatpage = true /}
						  		 {/if}
							  {/if}
							{/foreach}
					 {/if}
					 {set editNatpage = false /}
					{set editNatpageCount = 0 /}
					{set editNatpageflag = true /}
					 {if natEditcpr == null || code == ""}

						{if editCPR != null}
						  {foreach custo_editbean inArray editCPR.customerLevel}
							  	{if custo_editbean.uniqueCustomerIdBean.primeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
									{foreach prodo inArray custo_editbean.productLevelBean}
										{if prodo.nationalityBean != null }
											{if !cpr.customerLevel[customer].productLevelBean[prodo_index].nationalityBean}
												{if cpr.customerLevel[customer].productLevelBean[prodo_index].nationalityBean={}}{/if}
												{if cpr.customerLevel[customer].productLevelBean[prodo_index].nationalityBean=prodo.nationalityBean}{/if}
											{else /}
												{if cpr.customerLevel[customer].productLevelBean[prodo_index].nationalityBean=prodo.nationalityBean}{/if}
											{/if}
										{/if}
									{/foreach}
							  	{/if}
						  {/foreach}
						{/if}

						  {foreach forNatDetl inArray cpr.customerLevel[customer].productLevelBean}
							  {if cpr.customerLevel[customer].productLevelBean[forNatDetl_index].nationalityBean != null}
							  	{if code == ""}
									{set code = cpr.customerLevel[customer].productLevelBean[forNatDetl_index].nationalityBean[0].nationalityNationalityCode /}

								{/if}
								{set editNatpageCount = editNatpageCount+1 /}
								{set editNatpageflag = true /}
							  {/if}
							  {if !editNatpageflag && cpr.customerLevel[customer].productLevelBean[forNatDetl_index].regulatoryDocumentDetailsBean && cpr.customerLevel[customer].productLevelBean[forNatDetl_index].regulatoryDocumentDetailsBean[0].documentIssuingCountries }
								{if code == ""}
								{set code = cpr.customerLevel[customer].productLevelBean[forNatDetl_index].regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code /}
								{/if}
							  	{set editNatpageCount = editNatpageCount+1 /}
							  {/if}
							  {set editNatpageflag = false /}
						  {/foreach}
						  {if editNatpageCount != cpr.customerLevel[customer].productLevelBean.length}
								{var editNatpage = true /}
						  {/if}
					 {/if}
					/* {if editCPR != null}
							{foreach custo inArray editCPR.customerLevel}
							  {if custo.uniqueCustomerIdBean.primeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
								 {foreach prodo inArray custo.productLevelBean}
									//{if prodo.productIdentifiersBean[0].primeId == cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean[0].primeId }
									  {if prodo.nationalityBean != null }
										{if code == ""}
										{set code = prodo.nationalityBean[0].nationalityNationalityCode /}
										{/if}
										{set editNatpageCount = editNatpageCount+1 /}

									  {/if}
									  {if prodo.regulatoryDocumentDetailsBean && prodo.regulatoryDocumentDetailsBean[0].documentIssuingCountries }
										{if code == ""}
										{set code = prodo.regulatoryDocumentDetailsBean[0].documentIssuingCountries[0].locationDescriptionBean.code /}
										{/if}
										{set editNatpageRegCount = editNatpageRegCount+1 /}

									  {/if}
									//{/if}
								 {/foreach}
								 {if editNatpageRegCount+editNatpageCount > custo.productLevelBean.length}
									{var editNatpage = true /}
						  		 {/if}
							  {/if}
							{/foreach}
					 {/if}*/

					 {var natval = "" /}
					 {if moduleCtrl.getCountryCode()}
					  {set natval = moduleCtrl.getCountryCode() /}
					 {else/}
					  {set natval= code /}
					 {/if}

					 {var editCPRCustIndex = null /}
					 {if editCPR != null}
							{foreach custo inArray editCPR.customerLevel}
							  {if custo.uniqueCustomerIdBean.primeId == cpr.customerLevel[customer].uniqueCustomerIdBean.primeId}
									{set editCPRCustIndex = custo_index /}
							  {/if}
							{/foreach}
					 {/if}
					<section id="Nationality${totalNationalityCount}" class="displayBlock" data-customer-index="${totalNationalityCount}"  {if totalNationalityCount != 0}style="margin-top:0;"{/if}>
						<header>
						  <h2 class="subheader"> <span>${nationalityLabel.Title}</span>
							<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="nationalityInfo${totalNationalityCount}" data-aria-hidden="false"><span>Toggle</span></button>
						  </h2>
						</header>
						<ul class="inputForm marginTop" id="nationalityInfo${totalNationalityCount}">
							<li class="displayBlock">
							  <label for="nationality">${nationalityLabel.Title} <span class="mandatory">*</span></label>
							  <input type="text" value="${natval}" {if natval != "" && !editNatpage}readonly="readonly"{/if} id="nationality_code_${customer}_${selection.product}" dataCountrySel= "select-country" name="nationality_code_${customer}_${selection.product}" style="width:80%;">
							  <button type="submit" role="button" id="nationality_codebutton_${customer}_${selection.product}" {if natval != "" && !editNatpage}class='secondary nationalityTrigger disabled'{else /}class='secondary nationalityTrigger'{/if} style="right: 0em;height: 2.5em;" {if natval != "" && !editNatpage}disabled{/if} {on click { fn:"chooseSubmit", args: {currentcust : customer, currentprod : selection.product}}/}>${nationalityLabel.Ok}</button>
							</li>
						</ul>
					</section>
						<!--Contact info-->
					<section id="CONTACT_INFO_${cust_index}" class="displayBlock" data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.CustInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="contactInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
						<ul class="input-elements" id="contactInfo${cust_index}">
								/* Option to select gender */
								{var gender = null /}
								{set dispControl = "displayNone" /}
								{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].otherPaxDetailsBean != null}
									{set gender = editCPR.customerLevel[editCPRCustIndex].otherPaxDetailsBean[0].gender /}
									{set dispControl = "displayBlock" /}
								{elseif cpr.customerLevel[cust_index].otherPaxDetailsBean != null /}
									{set gender = cpr.customerLevel[cust_index].otherPaxDetailsBean[0].gender /}
									{set dispControl = "displayBlock" /}
								{elseif profBean && profBean.gender != null /}
									{set gender = profBean.gender /}
								{/if}
							{if natval == "" || editNatpage}
								{set dispControl = "displayNone" /}
							{/if}
							<li id = "14475_${cust_index}_${prod_index}" class="top-input-element ${dispControl}" name="DCG_${cust_index}" >
									<label class="di">${label.Gender}<span class="mandatory">*</span></label>
								<ul class="input-radio">
								  <li class="width_50">
										<input id="li1" type="radio" {if !gender || gender == "" || gender == "M"}checked="checked"{/if} {if gender && gender != ""}disabled="disabled"{/if} value="M" name="Type_${cust_index}"
										validators="req:${jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.Gender])}"
									errorNumbers="21400063" class="is-tab" gender-icon="gender">
									<label for="li1">${label.Male}</label>
								  </li>
								  <li class="width_50">
										<input id="li2" type="radio" value="F" {if gender == "F"}checked="checked"{/if} {if gender && gender != ""}disabled="disabled"{/if} name="Type_${cust_index}"
											validators="req:${jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.Gender])}"
										errorNumbers="21400063" class="is-tab" gender-icon="gender">
									<label for="li2">${label.Female}</label>
									  </li>
									</ul>
								</li>
								{var dispControl = "displayNone" /}
								/* Last name and first name of the pax */
								{var firstName = "" /}
								{var lastName = "" /}
							{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].otherPaxDetailsBean != null}
									{set firstName = editCPR.customerLevel[editCPRCustIndex].otherPaxDetailsBean[0].givenName/}
									{set lastName = editCPR.customerLevel[editCPRCustIndex].customerDetailsSurname /}
								{set dispControl = "displayBlock" /}
								{elseif cpr.customerLevel[cust_index].otherPaxDetailsBean != null /}
									{set firstName = cpr.customerLevel[cust_index].otherPaxDetailsBean[0].givenName/}
									{set lastName = cpr.customerLevel[customer].customerDetailsSurname /}
								{set dispControl = "displayBlock" /}
								{elseif profBean && profBean.firstName != null /}
									{set firstName = profBean.firstName /}
								{elseif profBean && profBean.lastName != null /}
									{set lastName = profBean.lastName /}
								{/if}
							{if natval == "" || editNatpage}
								{set dispControl = "displayNone" /}
							{/if}
							<li class="${dispControl}">
								<label for="input1">${label.FirstName}</label>
									{call
										common.textfield({
											type : 'text',
											id : 'FirstNameField_'+cust_index,
											name : 'FirstNameField_'+cust_index,
											value: firstName,
											options : {
												textfieldcls : 'inputField widthFull inputStyle',
												clearButton : false,
												readonly: true
											}
										})
									/}
								</li>
								<li class="${dispControl}">
								<label for="input2">${label.LastName}</label>
									{call
										common.textfield({
											type : 'text',
											id : 'LastNameField_'+cust_index,
											name : 'LastNameField_'+cust_index,
											value: lastName,
											options : {
												textfieldcls : 'inputField widthFull inputStyle',
												clearButton : false,
												readonly: true
											}
										})
									/}
								</li>
								{set dispControl = "displayNone" /}
								{var dob = null /}
								{var dobyear = date.curYear /}
								{var dobmonth = null /}
								{var dobday = null /}
							{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].dateOfBirthBean != null}
									{set dobyear = editCPR.customerLevel[editCPRCustIndex].dateOfBirthBean.year /}
									{set dobday = editCPR.customerLevel[editCPRCustIndex].dateOfBirthBean.day /}
 								    {if dobday < 10}
									   {set dobday = "0"+ dobday /}
								    {/if}
									{set dobmonth = editCPR.customerLevel[editCPRCustIndex].dateOfBirthBean.month /}
									   {if dobmonth < 10}
										  {set dobmonth = "0"+dobmonth /}
									   {/if}
									{set dob = dobyear+"-"+dobmonth+"-"+dobday /}
									{set dispControl = "displayBlock" /}
								{elseif cpr.customerLevel[cust_index].dateOfBirthBean != null /}
									{set dobyear = cpr.customerLevel[cust_index].dateOfBirthBean.year /}
									{set dobday = cpr.customerLevel[cust_index].dateOfBirthBean.day /}
 								    {if dobday < 10}
									   {set dobday = "0"+ dobday /}
								    {/if}
									{set dobmonth = cpr.customerLevel[cust_index].dateOfBirthBean.month /}
									   {if dobmonth < 10}
										  {set dobmonth = "0"+dobmonth /}
									   {/if}
									{set dob = dobyear+"-"+dobmonth+"-"+dobday /}
									{set dispControl = "displayBlock" /}
								{elseif profBean && profBean.dob /}
									{set dob = profBean.dob /}
									{set dobyear = dob.split("-")[0] /}
									{set dobday = dob.split("-")[2] /}
 								    {if dobday < 10}
									   {set dobday = "0"+ dobday /}
								    {/if}
									{set dobmonth = dob.split("-")[1] /}
								    {if dobmonth < 10}
									   {set dobmonth = "0"+dobmonth /}
								    {/if}
								{/if}
								<li id = "14476_${cust_index}_${prod_index}" class="${dispControl}" name="DDB_${cust_index}" >
								/* Date of birth entry */
								<div class="list expiry">
									<label>${label.DOB}<span class="mandatory">*</span></label>
									<ul class="input {if jQuerydatepickerclass==true}datepickerButton{elseif this.isDateSupport() /}htmlDatePicker{else /}selctBoxDatepicker{/if}">
									/* Chk if sq, for SQ jQuery calender */
									{if OperationgGroupOfAirlines}
										<li>
											/* -- removed as per SQ UAT PTR 07897593 {if dob && !cpr.regChkRequired}
												<input type="hidden" disabled="true" name="Date_${cust_index}" pax="${pax_type}" val="dob_${cust_index}" value="{if dob}${dob}{else/}${currDateIfDateSupp}{/if}" />
												<button disabled="true" class="ui-datepicker-trigger-disabled" type="button"><time>{if dob}${dob}{else/}${currDateIfDateSupp}{/if}</time></button>
											{else /}*/
												<input type="hidden" name="Date_${cust_index}" pax="${pax_type}" val="dob_${cust_index}" value="{if dob}${dob}{else/}${currDateIfDateSupp}{/if}" />
											/*{/if}*/
										</li>
									/* Chk if date type support is there or not */
									{elseif this.isDateSupport() /}
											<li>
											/*{if dob && !cpr.regChkRequired}disabled="true"{/if} -- removed as per SQ UAT PTR 07897593*/
											<input type="date" name="Date_${cust_index}" {on change "replaceChangeDateToDatePicker"/} pax="${pax_type}" val="dob_${cust_index}" value="{if dob}${dob}{else/}${currDateIfDateSupp}{/if}"/>
										<input type="hidden" name="forSelection_html_Date_${cust_index}" date_thisis="dob" value="{if dob}${dob}{else/}${currDateIfDateSupp}{/if}" />
										</li>
									{else/}
										{if !dob}
											{set dobyear = "" /}
											{set dobmonth = "" /}
											{set dobday = "" /}
										{/if}
										<li>
											/*{if dobyear && dobyear!=date.curYear && !cpr.regChkRequired}disabled="true"{/if}*/
											<select name="Year_${cust_index}" id="Year_${cust_index}" {on change "replaceChangeDateToDatePicker"/} value="${dobyear}" pax="${pax_type}" val="dob_${cust_index}">
													<option value="">${label.selectBoxDefaultText}</option>
													{for var i = 0 ; i < 100 ; i++}
														{var z = date.curYear - i /}
														<option value="${z}" {if dobyear == z}selected="selected"{/if}>${z}</option>
													{/for}
											</select>
											<!--<input type="number" {if dobyear && dobyear!=date.curYear}disabled="true"{/if} name="Year_${cust_index}" id="Year_${cust_index}" value="${dobyear}" pax="${pax_type}" val="dob_${cust_index}" class="widthApproxQuarter" />-->
										</li>
										<li>
											/*{if dobmonth && !cpr.regChkRequired}disabled="true"{/if}*/
											<select name="Month_${cust_index}" {on change "replaceChangeDateToDatePicker"/} id="Month_${cust_index}" pax="${pax_type}" val="dob_${cust_index}">
												    <option value="">${label.selectBoxDefaultText}</option>
												    /*{if !dobmonth}
														{set dobmonth = date.curMonth + 1 /}
														{if dobmonth <= 9}
															{set dobmonth = "0"+dobmonth /}
														{/if}
													{/if}*/
													{var j = ""/}
													{for var i = 0 ; i < 12 ; i++}
														{if i < 9}{set j = "0"+(i+1) /}{else/}{set j = i+1/}{/if}
														<option value="${j}" {if dobmonth && dobmonth == j}selected="selected"{/if}>${monthList[i]}</option>
													{/for}
											</select>
										</li>
										<li>
										   /*{if dobday && !cpr.regChkRequired}disabled="true"{/if}*/
											<select name="Day_${cust_index}" {on change "replaceChangeDateToDatePicker"/} id="Day_${cust_index}" pax="${pax_type}" val="dob_${cust_index}">
											<option value="">${label.selectBoxDefaultText}</option>
											/*{if !dobday}
												{set dobday = date.curDay /}
												{if dobday <= 9}
													{set dobday = "0"+dobday /}
												{/if}
											{/if}*/
											{var j="" /}
											  {for var i = 1 ; i <= noOfDays ; i++}
												{if i < 10}{set j = "0"+i /}{else/}{set j = i/}{/if}
												  <option value="${j}" {if dobday == j}selected="selected"{/if}>${j}</option>
											{/for}
											</select>
										</li>
										<li>
										<input type="hidden" name="forSelection_selecebox_Date_${cust_index}" date_thisis="dob" value="{if dob}${dob}{else/}${currDateIfDateSupp}{/if}" />
										</li>
									{/if}
									</ul>
								</div>
								</li>
								{set dispControl = "displayNone" /}
								{var pob = null /}
								{var cor = null /}
								{var redress = null /}
								{var knowntraveler = null /}
								{set dispControlCountry = "displayNone" /}
							{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].countriesBean != null}
									{foreach country in  editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].countriesBean}
										{if country.locationDescriptionBean.qualifier == "227" && country.locationDescriptionBean.code !=""}
										   {set pob = country.locationDescriptionBean.code /}
										   {set dispControl = "displayBlock" /}
										{/if}
										{if country.locationDescriptionBean.qualifier == "162" && country.locationDescriptionBean.code !=""}
										   {set cor = country.locationDescriptionBean.code /}
										   {set dispControlCountry = "displayBlock" /}
										{/if}
									{/foreach}
								 {elseif cpr.customerLevel[cust_index].productLevelBean[prod_index].countriesBean != null /}
									{foreach country in  cpr.customerLevel[cust_index].productLevelBean[prod_index].countriesBean}
										{if country.locationDescriptionBean.qualifier == "227" && country.locationDescriptionBean.code !=""}
										   {set pob = country.locationDescriptionBean.code /}
										   {set dispControl = "displayBlock" /}
										{/if}
										{if country.locationDescriptionBean.qualifier == "162" && country.locationDescriptionBean.code !=""}
										   {set cor = country.locationDescriptionBean.code /}
										   {set dispControlCountry = "displayBlock" /}
										{/if}
									{/foreach}
								 {elseif profBean && profBean.countryOfRes /}
									{set cor = profBean.countryOfRes /}
									{set dispControlCountry = "displayBlock" /}
								 {/if}

								<li id = "14785_${cust_index}_${prod_index}" class="${dispControl}" name="POB_${cust_index}" >
									/* Place of birth entry */
									<label>${label.PlaceOfBirth}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'pob_'+cust_index+'_'+prod_index,
											name : 'pob_'+cust_index+'_'+prod_index,
											value: pob,
											datacountrysel: "select-country",
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, 	[label.CustInfo,label.PlaceOfBirth])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.PlaceOfBirth]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>

								{set dispControl = "displayNone" /}
								{var redress = null /}
								{var knowntraveler = null /}
								{set dispControlKnowntraveller = "displayNone" /}
								{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].regulatoryDocumentDetailsBean != null}
									{foreach document inArray editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].regulatoryDocumentDetailsBean}
							  			{if document.travelerAndDocumentInfoType == "R"}
							  			    {set redress = document.travelerAndDocumentInfoNumber /}
										    {set dispControl = "displayBlock" /}
										{elseif document.travelerAndDocumentInfoType == "K" /}
											{set knowntraveler = document.travelerAndDocumentInfoNumber /}
										    {set dispControlKnowntraveller = "displayBlock" /}
							  			{/if}
							  		{/foreach}
							  	{elseif cpr.customerLevel[cust_index].productLevelBean[prod_index].regulatoryDocumentDetailsBean != null /}
									{foreach document inArray cpr.customerLevel[cust_index].productLevelBean[prod_index].regulatoryDocumentDetailsBean}
							  			{if document.travelerAndDocumentInfoType == "R"}
										    {set redress = document.travelerAndDocumentInfoNumber /}
										    {set dispControl = "displayBlock" /}
							  			{elseif document.travelerAndDocumentInfoType == "K" /}
										    {set knowntraveler = document.travelerAndDocumentInfoNumber /}
										   	{set dispControlKnowntraveller = "displayBlock" /}
							  			{/if}
							  		{/foreach}
							  	{/if}
								<li id = "redress_19507_${cust_index}_${prod_index}" class="${dispControl}" name="redress_${cust_index}" >
									/* Redress number*/
									<label>${label.redressnum}</label>
									{call
										common.textfield({
											type : 'text',
											id : 'redress_number_'+cust_index+'_'+prod_index,
											name : 'redress_number_'+cust_index+'_'+prod_index,
											value: redress,
											datacountrysel: "select-country",
											options : {
												textfieldcls : 'inputField widthFull',
												clearButton : true,
												validators : 'alphanumzeromore:'+label.redressnum,
												errorNumbers : '21400061'
											}
										})
									/}
								</li>
								<li id = "knowntraveller_19507_${cust_index}_${prod_index}" class="${dispControlKnowntraveller}" name="knowntraveler_${cust_index}" >
									/* known traveller number*/
									<label>${label.knowntraveller}</label>
									{call
										common.textfield({
											type : 'text',
											id : 'knowntraveler_number_'+cust_index+'_'+prod_index,
											name : 'knowntraveler_number_'+cust_index+'_'+prod_index,
											value: knowntraveler,
											datacountrysel: "select-country",
											options : {
												textfieldcls : 'inputField widthFull',
												clearButton : true,
												validators : 'alphanumzeromore:'+label.knowntraveller,
												errorNumbers : '21400061'
											}
										})
									/}
								</li>
								<li id = "14732_${cust_index}_${prod_index}" class="${dispControlCountry}" name="COR_${cust_index}" >
									/* Country of residence entry */
									<label>${label.CountryOfResidence}<span class="mandatory">*</span></label>
										{section {
											id: "countryofRes_"+cust_index+"_"+prod_index,
											macro: {name: 'getCountryOfResidence', args:[cust_index, prod_index, cor, countryNameCodeMap, label], scope:this}
										}/}
								</li>
								/*Added for impl or cond between passport and other documents*/
								<li id="choosebetweenpassportandnationality${cust_index}" class="displayNone">
									<label>Document type<span class="mandatory">*</span></label>
									<select class="inputField" id="passportOtherdoc${cust_index}" validators="req:Passport - Other Document Type" errornumbers="21400063">
									<!--<option value="" selected="selected">${label.SelectType}</option>-->
									<option value="P">${label.Passport}</option>
									<option value="I">${label.IdentityCard}</option>
									<option value="B">${label.BoarderCard}</option>
									<option value="C">${label.PermResCard}</option>
									</select>
								</li>
							</ul>
						</section>
						<!--passport info-->
						{set dispControl = "displayNone" /}
						{var isPsprtCntrl = false /}
						{var isVisaCntrl = false /}
						{var isOtherCntrl = false /}
						{var pspdocNumber = null /}
						{var pspCntryIssue = null /}
						{var pspExpiryYear = null /}
						{var pspExpiryMnth = null /}
						{var pspExpiryDay = null /}
						{var vdocNumber = null /}
						{var vCntryIssue = null /}
						{var vCityIssue = null /}
						{var visaExpiryYear = null /}
						{var visaExpiryMnth = null /}
						{var visaExpiryDay = null /}
						{var othrdocNumber = null /}
						{var othrType = null /}
						{var othrExpiryYear = null /}
						{var othrExpiryMnth = null /}
						{var othrExpiryDay = null /}

						/* set the country and city issues for respective documents */
					{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].regulatoryDocumentDetailsBean != null}
							{foreach document inArray editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].regulatoryDocumentDetailsBean}
							  {if document.travelerAndDocumentInfoType == "P"}
								{set pspdocNumber = document.travelerAndDocumentInfoNumber /}
								 {foreach docCountry inArray document.documentIssuingCountries}
								 {if docCountry.location == "91"}
								   {if docCountry.locationDescriptionBean && docCountry.locationDescriptionBean.code}
								   	{set pspCntryIssue =  docCountry.locationDescriptionBean.code /}
								   {/if}
								 {/if}
								 {/foreach}
								 {if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set pspExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set pspExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set pspExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								 {/if}
								 {set dispControl = "displayBlock" /}
								 {set isPsprtCntrl = true /}
							  {/if}
							  {if document.travelerAndDocumentInfoType == "V"}
								{set vdocNumber = document.travelerAndDocumentInfoNumber /}
								 {foreach docCountry inArray document.documentIssuingCountries}
								 {if docCountry.location == "91"}
								   {if docCountry.locationDescriptionBean && docCountry.locationDescriptionBean.code}
								   	{set vCntryIssue =  docCountry.locationDescriptionBean.code /}
								   {/if}
								   {if docCountry.firstLocationDetailsBean && docCountry.firstLocationDetailsBean.code}
								   	{set vCityIssue =  docCountry.firstLocationDetailsBean.code /}
								   {/if}
								 {/if}
								 {/foreach}
								 {if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set visaExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set visaExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set visaExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								 {/if}
								 {set dispControl = "displayBlock" /}
								 {var isVisaCntrl = true /}
							  {/if}
							  {if document.travelerAndDocumentInfoType != "P" && document.travelerAndDocumentInfoType != "V" && document.travelerAndDocumentInfoType.search(/^([i|b|c]){1}$/i)!= -1}
								{set othrdocNumber = document.travelerAndDocumentInfoNumber /}
								{set othrType = document.travelerAndDocumentInfoType /}
								{if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set othrExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set othrExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set othrExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								 {/if}
								{set dispControl = "displayBlock" /}
								{var isOtherCntrl = true /}
							  {/if}
							{/foreach}
						{elseif cpr.customerLevel[cust_index].productLevelBean[prod_index].regulatoryDocumentDetailsBean != null /}
							{foreach document inArray cpr.customerLevel[cust_index].productLevelBean[prod_index].regulatoryDocumentDetailsBean}
							  {if document.travelerAndDocumentInfoType == "P"}
								 {set pspdocNumber = document.travelerAndDocumentInfoNumber /}
								 {foreach docCountry inArray document.documentIssuingCountries}
								 {if docCountry.location == "91"}
								   {if docCountry.locationDescriptionBean && docCountry.locationDescriptionBean.code}
								   	{set pspCntryIssue =  docCountry.locationDescriptionBean.code /}
								   {/if}
								 {/if}
								 {/foreach}
								 {if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set pspExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set pspExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set pspExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								 {/if}
								 {set dispControl = "displayBlock" /}
								 {set isPsprtCntrl = true /}
							  {/if}
							  {if document.travelerAndDocumentInfoType == "V"}
								 {set vdocNumber = document.travelerAndDocumentInfoNumber /}
								 {foreach docCountry inArray document.documentIssuingCountries}
								 {if docCountry.location == "91"}
								   {if docCountry.locationDescriptionBean && docCountry.locationDescriptionBean.code}
								   	{set vCntryIssue =  docCountry.locationDescriptionBean.code /}
								   {/if}
								   {if docCountry.firstLocationDetailsBean && docCountry.firstLocationDetailsBean.code}
								   	{set vCityIssue =  docCountry.firstLocationDetailsBean.code /}
								   {/if}
								 {/if}
								 {/foreach}
								 {if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set visaExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set visaExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set visaExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								 {/if}
								{set dispControl = "displayBlock" /}
								{set isVisaCntrl = true /}
							  {/if}
							  {if document.travelerAndDocumentInfoType != "P" && document.travelerAndDocumentInfoType != "V" && document.travelerAndDocumentInfoType.search(/^([i|b|c]){1}$/i)!= -1}
								{set othrdocNumber = document.travelerAndDocumentInfoNumber /}
								{set othrType = document.travelerAndDocumentInfoType /}
								{if document.documentDates != null}
								 {foreach dateObj inArray document.documentDates}
									{if dateObj.dateTimeDescriptionDateTimeQualifier == "192"}
										{set othrExpiryYear =  dateObj.dateTimeDescriptionDateTimeDetails.substring(0,4) /}
										{set othrExpiryMnth =  dateObj.dateTimeDescriptionDateTimeDetails.substring(4,6) /}
										{set othrExpiryDay =  dateObj.dateTimeDescriptionDateTimeDetails.substring(6,8) /}
									{/if}
								 {/foreach}
								{/if}
								{set dispControl = "displayBlock" /}
								{set isOtherCntrl = true /}
							  {/if}
							{/foreach}
						{elseif profBean /}
							{if profBean.passportNumber}
								{set pspdocNumber = profBean.passportNumber /}
							{/if}
							{if profBean.passportExpDate}
								{set pspExpiryYear =  profBean.passportExpDate.split("-")[0] /}
								{set pspExpiryMnth =  profBean.passportExpDate.split("-")[1] /}
								{set pspExpiryDay =  profBean.passportExpDate.split("-")[2] /}
							{/if}
							{if profBean.passportIssueCountry}
								{set pspCntryIssue =  profBean.passportIssueCountry /}
							{/if}
						{/if}
						{if moduleCtrl.getOtherDocumentType() != null}
							{set othrType = moduleCtrl.getOtherDocumentType() /}
						{/if}
						/*Added for impl or cond between passport and other documents*/
						<section id="PSP_DRD_${cust_index}" {if isPsprtCntrl}class="${dispControl} DetailsFilledByBean"{else/}class="displayNone"{/if} data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.PsprtInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="passportInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="passportInfo${cust_index}">
								<li id="14729_${cust_index}_${prod_index}" {if isPsprtCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Pasport number entry */
									<label>${label.PassportNbr}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'pnumber_'+cust_index+'_'+prod_index,
											name : 'pnumber_'+cust_index+'_'+prod_index,
											value : pspdocNumber,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr]),
												errorNumbers : '21400059|21400061',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14733_${cust_index}_${prod_index}" {if isPsprtCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									<div class="list expiry">
										/* Expiry date entry */
										<label>${label.ExpDate}<span class="mandatory">*</span></label>
										<ul class="input {if jQuerydatepickerclass==true}datepickerButton{elseif this.isDateSupport() /}htmlDatePicker{else /}selctBoxDatepicker{/if}">
										/* Chk if sq, for SQ jQuery calender */
										{if OperationgGroupOfAirlines}
										<li>

										<input type="hidden" name="psp_Exp_Date_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="passport" value="{if pspExpiryYear && pspExpiryYear != ""}${pspExpiryYear+'-'+pspExpiryMnth+'-'+pspExpiryDay}{else/}${currDateIfDateSupp}{/if}" />

										</li>
										/* Chk if date type support is there or not */
										{elseif this.isDateSupport() /}
											<li>
											<input type="date" name="psp_Exp_Date_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} val="ed_${cust_index}" doc="passport" value="{if pspExpiryYear && pspExpiryYear != ""}${pspExpiryYear+'-'+pspExpiryMnth+'-'+pspExpiryDay}{else/}${currDateIfDateSupp}{/if}"/>
											<input type="hidden" name="forSelection_html_psp_Exp_Date_${cust_index}_${prod_index}" value="{if pspExpiryYear && pspExpiryYear != ""}${pspExpiryYear+'-'+pspExpiryMnth+'-'+pspExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{else/}
											{if pspExpiryYear && pspExpiryYear == ""}
												{set pspExpiryYear = "" /}
												{set pspExpiryMnth = "" /}
												{set pspExpiryDay = "" /}
											{/if}
											<li>
												<select name="psp_Exp_Year_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="psp_Exp_Year_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="passport" class="widthApproxQuarter" value="{if pspExpiryYear && pspExpiryYear != "" }${pspExpiryYear}{else/}${date.curYear}{/if}">
													<option value="">${label.selectBoxDefaultText}</option>
													/*{if !pspExpiryYear}
														{set pspExpiryYear = date.curYear /}
													{/if}*/
													{for var i = 0 ; i < 100 ; i++}
														{var z = date.curYear + i /}
														<option value="${z}" {if pspExpiryYear == z}selected="selected"{/if}>${z}</option>
													{/for}
												</select>
												<!--
												<input type="number" name="psp_Exp_Year_${cust_index}_${prod_index}" id="psp_Exp_Year_${cust_index}_${prod_index}" value="{if pspExpiryYear && pspExpiryYear != "" }${pspExpiryYear}{else/}${date.curYear}{/if}" val="ed_${cust_index}" doc="passport" class="widthApproxQuarter" /> -->
											</li>
											<li>
												<select name="psp_Exp_Month_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="psp_Exp_Month_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="passport">
													<option value="">${label.selectBoxDefaultText}</option>
													{var j = ""/}
													{for var i = date.curMonth ; i < 12 ; i++}
														{set j = i+1 /}
														{if i < 10}{set j = "0"+j /}{/if}
														<option value="${j}" {if pspExpiryMnth == j}selected="selected"{/if}>${monthList[i]}</option>
													{/for}
												</select>
											</li>
											<li>
												<select name="psp_Exp_Day_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="psp_Exp_Day_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="passport">
													<option value="">${label.selectBoxDefaultText}</option>
													{var j="" /}
													{for var i = date.curDay ; i <= noOfDays ; i++}
														{if i < 10}{set j = "0"+i /}{else/}{set j = i/}{/if}
														<option value="${j}" {if pspExpiryDay == j}selected="selected"{/if}>${j}</option>
													{/for}
												</select>
											</li>
											<li>
											<input type="hidden" name="forSelection_selecebox_psp_Exp_Date_${cust_index}_${prod_index}" value="{if pspExpiryYear && pspExpiryYear != ""}${pspExpiryYear+'-'+pspExpiryMnth+'-'+pspExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{/if}
										</ul>
									</div>
								</li>
								<li id="14734_${cust_index}_${prod_index}" {if isPsprtCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Country Of Issue entry */
									<label>${label.PsprtIssueAuth}<span class="mandatory">*</span></label>
									/* section gets refreshed when country is updated */
									{section {
										id: "countryOfIssueP_"+cust_index+"_"+prod_index,
										macro: {name: 'getPassportIssueAuth', args: [pspCntryIssue, natval, cust_index, prod_index, countryNameCodeMap, label], scope: this}
									}/}									
								</li>
							</ul>
						</section>
						<!--Visa info-->
						<section id="VISA_DRD_${cust_index}" {if isVisaCntrl}class="${dispControl}"{else/}class="displayNone"{/if} data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.VisaInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="visaInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="visaInfo${cust_index}">
								<li id="14736_${cust_index}_${prod_index}" {if isVisaCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Visa number entry */
									<label>${label.VisaNbr}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'Visa_number_'+cust_index+'_'+prod_index,
											name : 'Visa_number_'+cust_index+'_'+prod_index,
											value: vdocNumber,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.VisaNbr])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.VisaNbr]),
												errorNumbers : '21400059|21400061',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14737_${cust_index}_${prod_index}" {if isVisaCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									<div class="list expiry">
										/* Expiry date entry */
										<label>${label.ExpDate}<span class="mandatory">*</span></label>
										<ul class="input {if jQuerydatepickerclass==true}datepickerButton{elseif this.isDateSupport() /}htmlDatePicker{else /}selctBoxDatepicker{/if}">
										/* Chk if sq, for SQ jQuery calender */
										{if OperationgGroupOfAirlines}
										<li>

										<input type="hidden" name="visa_Exp_Date_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="visa" value="{if visaExpiryYear && visaExpiryYear != ""}${visaExpiryYear+'-'+visaExpiryMnth+'-'+visaExpiryDay}{else/}${currDateIfDateSupp}{/if}" />

										</li>
										/* Chk if date type support is there or not */
										{elseif this.isDateSupport() /}
											<li>
											<input type="date" name="visa_Exp_Date_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} val="ed_${cust_index}" doc="visa" value="{if visaExpiryYear && visaExpiryYear != ""}${visaExpiryYear+'-'+visaExpiryMnth+'-'+visaExpiryDay}{else/}${currDateIfDateSupp}{/if}"/>
											<input type="hidden" name="forSelection_html_visa_Exp_Date_${cust_index}_${prod_index}" value="{if visaExpiryYear && visaExpiryYear != ""}${visaExpiryYear+'-'+visaExpiryMnth+'-'+visaExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{else/}
											{if visaExpiryYear && visaExpiryYear == ""}
												{set visaExpiryYear = "" /}
												{set visaExpiryMnth = "" /}
												{set visaExpiryDay = "" /}
											{/if}
											<li>
											<select name="visa_Exp_Year_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="visa_Exp_Year_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="visa" class="widthApproxQuarter" value="{if visaExpiryYear && visaExpiryYear != "" }${visaExpiryYear}{else/}${date.curYear}{/if}">
													<option value="">${label.selectBoxDefaultText}</option>
													/*{if !visaExpiryYear}
														{set visaExpiryYear = date.curYear /}
													{/if}*/
													{for var i = 0 ; i < 100 ; i++}
														{var z = date.curYear + i /}
														<option value="${z}" {if visaExpiryYear == z}selected="selected"{/if}>${z}</option>
													{/for}
											</select>
											<!--<input type="number" name="visa_Exp_Year_${cust_index}_${prod_index}" id="visa_Exp_Year_${cust_index}_${prod_index}" value="{if visaExpiryYear && visaExpiryYear != "" }${visaExpiryYear}{else/}${date.curYear}{/if}" val="ed_${cust_index}" doc="visa" class="widthApproxQuarter" />-->
											</li>
											<li>
											<select name="visa_Exp_Month_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="visa_Exp_Month_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="visa">
												<option value="">${label.selectBoxDefaultText}</option>
												{var j = ""/}
												{for var i = date.curMonth ; i < 12 ; i++}
													{set j = i+1 /}
													{if i < 10}{set j = "0"+j /}{/if}
													<option value="${j}" {if visaExpiryMnth == j}selected="selected"{/if}>${monthList[i]}</option>
												{/for}
											</select>
											</li>
											<li>
											<select name="visa_Exp_Day_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="visa_Exp_Day_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="visa">
												<option value="">${label.selectBoxDefaultText}</option>
												{var j="" /}
												{for var i = date.curDay ; i <= noOfDays ; i++}
													{if i < 10}{set j = "0"+i /}{else/}{set j = i/}{/if}
													<option value="${j}" {if visaExpiryDay == j}selected="selected"{/if}>${j}</option>
												{/for}
											</select>
											</li>
											<li>
											<input type="hidden" name="forSelection_selecebox_visa_Exp_Date_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="visa" value="{if visaExpiryYear && visaExpiryYear != ""}${visaExpiryYear+'-'+visaExpiryMnth+'-'+visaExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{/if}
										</ul>
									</div>
								</li>
								<li id="14771_${cust_index}_${prod_index}" {if isVisaCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* City Of Issue entry */
									<label>${label.CityOfIssue}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'Visa_city_'+cust_index+'_'+prod_index,
											name : 'Visa_city_'+cust_index+'_'+prod_index,
											value: vCityIssue,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.CityOfIssue])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.CityOfIssue]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14738_${cust_index}_${prod_index}" {if isVisaCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Country Of Issue entry */
									<label>${label.VisaIssueAuth}<span class="mandatory">*</span></label>
									{section {
										id: "countryOfIssueV_"+cust_index+"_"+prod_index,
										macro: {name: 'getVisaIssueAuth', args: [vCntryIssue, cust_index, prod_index, countryNameCodeMap, label], scope: this}
									}/}
								</li>
							</ul>
						</section>
						<!--Other doc info-->
						/*Added for impl or cond between passport and other documents*/
						<section id="OTHER_DRD_${cust_index}" {if isOtherCntrl}class="${dispControl} DetailsFilledByBean"{else/}class="displayNone"{/if} data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.OtherDocInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="otherDocsInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="otherDocsInfo${cust_index}">
								<li id="14799_${cust_index}_${prod_index}" {if isOtherCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Document type drop down */
									<label>${label.DocType}<span class="mandatory">*</span></label>
									<select class="inputField" name="otype_${cust_index}_${prod_index}"
										validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocType])}" errorNumbers="21400063">
										<!--<option value="" selected="selected">${label.SelectType}</option>-->
										<option value="I" selected="selected">${label.IdentityCard}</option>
										<option value="B" {if othrType== "B"}selected="selected"{/if}>${label.BoarderCard}</option>
										<option value="C" {if othrType== "C"}selected="selected"{/if}>${label.PermResCard}</option>
									</select>
								</li>
								<li id="14801_${cust_index}_${prod_index}" {if isOtherCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									<div class="list expiry">
										/* Expiry date entry */
										<label>${label.DocExpDate}<span class="mandatory">*</span></label>

										<ul class="input {if jQuerydatepickerclass==true}datepickerButton{elseif this.isDateSupport() /}htmlDatePicker{else /}selctBoxDatepicker{/if}">
										/* Chk if sq, for SQ jQuery calender */
										{if OperationgGroupOfAirlines}
										<li>

										<input type="hidden" name="other_Exp_Date_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="otherdocument" value="{if othrExpiryYear && othrExpiryYear != ""}${othrExpiryYear+'-'+othrExpiryMnth+'-'+othrExpiryDay}{else/}${currDateIfDateSupp}{/if}" />

										</li>
										/* Chk if date type support is there or not */
										{elseif this.isDateSupport() /}
											<li>
											<input type="date" name="other_Exp_Date_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} val="ed_${cust_index}" doc="otherdocument" value="{if othrExpiryYear && othrExpiryYear != ""}${othrExpiryYear+'-'+othrExpiryMnth+'-'+othrExpiryDay}{else/}${currDateIfDateSupp}{/if}"/>
											<input type="hidden" name="forSelection_html_other_Exp_Date_${cust_index}_${prod_index}" value="{if othrExpiryYear && othrExpiryYear != ""}${othrExpiryYear+'-'+othrExpiryMnth+'-'+othrExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{else/}
											{if othrExpiryYear && othrExpiryYear == ""}
												{set othrExpiryYear = "" /}
												{set othrExpiryMnth = "" /}
												{set othrExpiryDay = "" /}
											{/if}
											<li>
											<select name="other_Exp_Year_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="other_Exp_Year_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="otherdocument" class="widthApproxQuarter"  value="{if othrExpiryYear && othrExpiryYear != ''}${othrExpiryYear}{else/}${date.curYear}{/if}">
													<option value="">${label.selectBoxDefaultText}</option>
													/*{if !othrExpiryYear}
														{set othrExpiryYear = date.curYear /}
													{/if}*/
													{for var i = 0 ; i < 100 ; i++}
														{var z = date.curYear + i /}
														<option value="${z}" {if othrExpiryYear == z}selected="selected"{/if}>${z}</option>
													{/for}
											</select>
											<!--
											<input type="number" name="other_Exp_Year_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="other_Exp_Year_${cust_index}_${prod_index}" value="{if othrExpiryYear && othrExpiryYear != ''}${othrExpiryYear}{else/}${date.curYear}{/if}" val="ed_${cust_index}" doc="otherdocument" class="widthApproxQuarter" /> -->
											</li>
											<li>
											<select name="other_Exp_Month_${cust_index}_${prod_index}" id="other_Exp_Month_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="otherdocument">
												<option value="">${label.selectBoxDefaultText}</option>
												{var j = ""/}
												{for var i = date.curMonth ; i < 12 ; i++}
													{set j = i+1 /}
													{if i < 10}{set j = "0"+j /}{/if}
													<option value="${j}" {if moduleCtrl.getOtherDocumentType() != 'C'}{if othrExpiryMnth == j}selected="selected"{/if}{/if}>${monthList[i]}</option>
												{/for}
											</select>
											</li>
											<li>
											<select name="other_Exp_Day_${cust_index}_${prod_index}" {on change "replaceChangeDateToDatePicker"/} id="other_Exp_Day_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="otherdocument">
												<option value="">${label.selectBoxDefaultText}</option>
												{var j="" /}
												{for var i = date.curDay ; i <= noOfDays ; i++}
													{if i < 10}{set j = "0"+i /}{else/}{set j = i/}{/if}
													<option value="${j}" {if moduleCtrl.getOtherDocumentType() != 'C'}{if othrExpiryDay == j}selected="selected"{/if}{/if}>${j}</option>
												{/for}
											</select>
											</li>
											<li>
											<input type="hidden" name="forSelection_selecebox_other_Exp_Date_${cust_index}_${prod_index}" val="ed_${cust_index}" doc="otherdocument" value="{if othrExpiryYear && othrExpiryYear != ""}${othrExpiryYear+'-'+othrExpiryMnth+'-'+othrExpiryDay}{else/}${currDateIfDateSupp}{/if}" />
											</li>
										{/if}
										</ul>
									</div>
								</li>
								<li id="14800_${cust_index}_${prod_index}" {if isOtherCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Document number entry */
									{if moduleCtrl.getOtherDocumentType() == 'C'}
										{set othrdocNumber = "" /}
									{/if}
									<label>${label.DocNbr}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'onumber_'+cust_index+'_'+prod_index,
											name : 'onumber_'+cust_index+'_'+prod_index,
											value: othrdocNumber,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocNbr])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocNbr]),
												errorNumbers : '21400059|21400061',
												clearButton : true
											}
										})
									/}
								</li>
							</ul>
						</section>
						{set dispControl = "displayNone" /}
						{var hStreet = null /}
						{var hCity = null /}
						{var hState = null /}
						{var hZipcode = null /}
						{var hCntryRes = null /}
						{var hAddressCntrl = false /}
						{var dStreet = null /}
						{var dCity = null /}
						{var dState = null /}
						{var dZipcode = null /}
						{var dCntry = null /}
						{var dAddressCntrl = false /}

						/* prefill destination and home address related information,if addressDetailBean is not null */
					{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].addressDetailBean != null}
							{foreach address inArray editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].addressDetailBean}
							  {if address.addressDetailsLocation == "80"}
								 {set dCity = address.addressDetailsTravelerCity /}
								 {set dCntry = address.addressDetailsTravelerCountryCode /}
								 {set dZipcode = address.addressDetailsTravelerPostcode /}
								 {if address.travelerAddressBean}
									{set dStreet = address.travelerAddressBean.street /}
								 {/if}
								 {if address.travelerCountryBean}
									{set dState = address.travelerCountryBean.countrySubEntityName /}
								 {/if}
								 {set dispControl = "displayBlock" /}
								 {var dAddressCntrl = true /}
							  {/if}
							  {if address.addressDetailsLocation == "174"}
								{set hCity = address.addressDetailsTravelerCity /}
								{set hCntryRes = address.addressDetailsTravelerCountryCode /}
								{set hZipcode = address.addressDetailsTravelerPostcode /}
								{if address.travelerAddressBean}
									{set hStreet = address.travelerAddressBean.street /}
								{/if}
								{if address.travelerCountryBean}
									{set hState = address.travelerCountryBean.countrySubEntityName /}
								{/if}
								{set dispControl = "displayBlock" /}
								{var hAddressCntrl = true /}
							  {/if}
							{/foreach}
						{elseif cpr.customerLevel[cust_index].productLevelBean[prod_index].addressDetailBean != null /}
							{foreach address inArray cpr.customerLevel[cust_index].productLevelBean[prod_index].addressDetailBean}
							  {if address.addressDetailsLocation == "80"}
								 {set dCity = address.addressDetailsTravelerCity /}
								 {set dCntry = address.addressDetailsTravelerCountryCode /}
								 {set dZipcode = address.addressDetailsTravelerPostcode /}
								 {if address.travelerAddressBean}
									{set dStreet = address.travelerAddressBean.street /}
								 {/if}
								 {if address.travelerCountryBean}
									{set dState = address.travelerCountryBean.countrySubEntityName /}
								 {/if}
								 {set dispControl = "displayBlock" /}
								 {var dAddressCntrl = true /}
							  {/if}
							  {if address.addressDetailsLocation == "174"}
								{set hCity = address.addressDetailsTravelerCity /}
								{set hCntryRes = address.addressDetailsTravelerCountryCode /}
								{set hZipcode = address.addressDetailsTravelerPostcode /}
								{if address.travelerAddressBean}
									{set hStreet = address.travelerAddressBean.street /}
								{/if}
								{if address.travelerCountryBean}
									{set hState = address.travelerCountryBean.countrySubEntityName /}
								{/if}
								{set dispControl = "displayBlock" /}
								{var hAddressCntrl = true /}
							  {/if}
							{/foreach}
						{elseif profBean /}
								{if profBean.city}
									{set hCity = profBean.city /}
								{/if}
								{if profBean.country }
									{set hCntryRes = profBean.country /}
								{/if}
								{if profBean.postCode}
									{set hZipcode = profBean.postCode /}
								{/if}
								{if profBean.state}
									{set hState = profBean.state /}
								{/if}
						{/if}
						<!-- Residential Info -->
						<section id="HOME_UAD_${cust_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.HomeAddr}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="homeUADInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="homeUADInfo${cust_index}">
								<li id = "14766_${cust_index}_${prod_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Street entry */
									<label>${label.Street}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'Street_'+cust_index+'_'+prod_index,
											name : 'Street_'+cust_index+'_'+prod_index,
											value: hStreet,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Street]),
												errorNumbers : '21400059',
												clearButton : true
											}
										})
									/}
								</li>
								<li id = "14767_${cust_index}_${prod_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* City entry */
									<label>${label.City}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'City_'+cust_index+'_'+prod_index,
											name : 'City_'+cust_index+'_'+prod_index,
											value: hCity,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>
								<li id = "14768_${cust_index}_${prod_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* State entry */
									<label>${label.State}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'State_'+cust_index+'_'+prod_index,
											name : 'State_'+cust_index+'_'+prod_index,
											value: hState,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>
								<li id = "14769_${cust_index}_${prod_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Zip code entry */
									<label>${label.ZipCode}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'ZipCode_'+cust_index+'_'+prod_index,
											name : 'ZipCode_'+cust_index+'_'+prod_index,
											value: hZipcode,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode]),
												errorNumbers : '21400059|21400061',
												clearButton : true
											}
										})
									/}
								</li>
								<li id = "14770_${cust_index}_${prod_index}" {if hAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Country of residence entry */
									<label>${label.Country}<span class="mandatory">*</span></label>
									{section {
										id: "countryHome_"+cust_index+"_"+prod_index,
										macro: {name: 'getCountryOfOrigin', args: [hCntryRes, cust_index, prod_index, countryNameCodeMap, label], scope: this}
									}/}
								</li>
							</ul>
						</section>
						<!--Destinaton info-->
						<section id="DEST_UAD_${cust_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.DestInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="destUADInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="destUADInfo${cust_index}">
								<li id="14740_${cust_index}_${prod_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Street entry */
									<label>${label.Street}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'dest_street_'+cust_index+'_'+prod_index,
											name : 'dest_street_'+cust_index+'_'+prod_index,
											value: dStreet,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Street]),
												errorNumbers : '21400059',
												clearButton : true
											}
										})
									/}
								 </li>
								<li id="14763_${cust_index}_${prod_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* City entry */
									<label>${label.City}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'dest_city_'+cust_index+'_'+prod_index,
											name : 'dest_city_'+cust_index+'_'+prod_index,
											value: dCity,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14764_${cust_index}_${prod_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* State entry */
									<label>${label.State}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'dest_state_'+cust_index+'_'+prod_index,
											name : 'dest_state_'+cust_index+'_'+prod_index,
											value: dState,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State]),
												errorNumbers : '21400059|21400062',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14765_${cust_index}_${prod_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Zip code entry */
									<label>${label.ZipCode}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'dest_zipCode_'+cust_index+'_'+prod_index,
											name : 'dest_zipCode_'+cust_index+'_'+prod_index,
											value: dZipcode,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode]),
												errorNumbers : '21400059|21400061',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="17331_${cust_index}_${prod_index}" {if dAddressCntrl}class="${dispControl}"{else/}class="displayNone"{/if} >
									/* Country entry */
									<label>${label.Country}<span class="mandatory">*</span></label>
									{section {
										id: "countryDest_"+cust_index+"_"+prod_index,
										macro: {name: 'getCountryOfDestination', args: [dCntry, cust_index, prod_index, countryNameCodeMap, label], scope: this}
									}/}
								</li>
							</ul>
						</section>
						{set dispControl = "displayNone" /}
						{var EmrgCntName = null /}
						{var EmrgCntryCode = null /}
						{var EmrgTelNo = null /}
						/* prefill emergency contact info, if emergencyContactBean is not null */
					{if editCPR && editCPR.customerLevel[editCPRCustIndex] && editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].emergencyContactBean != null}
							{set EmrgCntryCode = editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsCountryOfResidence /}
							{set EmrgCntName = editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsSurname /}
							{set EmrgTelNo = editCPR.customerLevel[editCPRCustIndex].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsPhoneNumber /}
							{set dispControl = "displayBlock" /}
						{elseif cpr.customerLevel[cust_index].productLevelBean[prod_index].emergencyContactBean != null /}
							{set EmrgCntryCode = cpr.customerLevel[cust_index].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsCountryOfResidence /}
							{set EmrgCntName = cpr.customerLevel[cust_index].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsSurname /}
							{set EmrgTelNo = cpr.customerLevel[cust_index].productLevelBean[prod_index].emergencyContactBean.emergencyContactDetailsPhoneNumber /}
							{set dispControl = "displayBlock" /}
						{/if}
						<!--Emergency contact info-->
						<section id="DCL_${cust_index}" class="${dispControl}" data-customer-index="${totalNationalityCount}">
							<header>
							  <h2 class="subheader"> <span>${label.EmerContactInfo}</span>
								<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="emergencyContactInfo${cust_index}" data-aria-hidden="false"><span>Toggle</span></button>
							  </h2>
							</header>
							<ul class="inputForm marginTop" id="emergencyContactInfo${cust_index}">
								<li id="14802_${cust_index}_${prod_index}" class="${dispControl}" >
									/* Contact name entry */
									<label>${label.ContactName}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'text',
											id : 'Emrg_name_'+cust_index+'_'+prod_index,
											name : 'Emrg_name_'+cust_index+'_'+prod_index,
											value: EmrgCntName,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.ContactName]),
												errorNumbers : '21400059',
												clearButton : true
											}
										})
									/}
								</li>
								<li id="14804_${cust_index}_${prod_index}" class="${dispControl}" >
									/* Country code entry */
									<label>${label.CountryCode}<span class="mandatory">*</span></label>
									{section {
										id: "countryCodeEmrg_"+cust_index+"_"+prod_index,
										macro: {name: 'getEmergencyCountryCode', args: [EmrgCntryCode, cust_index, prod_index, countryNameCodeMap, label], scope: this}
									}/}
								</li>
								<li id="14803_${cust_index}_${prod_index}" class="${dispControl}" >
									/* Phone entry */
									<label>${label.Phone}<span class="mandatory">*</span></label>
									{call
										common.textfield({
											type : 'tel',
											id : 'Emerg_PhNo_'+cust_index+'_'+prod_index,
											name : 'Emerg_PhNo_'+cust_index+'_'+prod_index,
											value: EmrgTelNo,
											options : {
												textfieldcls : 'inputField widthFull',
												validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.Phone])+'|numeric:'+jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.Phone]),
												errorNumbers : '21400059|21400064',
												clearButton : true
											}
										})
									/}
								</li>
							</ul>
						</section>
				{/foreach}
			{/if}
		{/foreach}
		{section {
			id: "closeSection",
			macro: {name: 'callCloseSection', scope:this}
		}/}
		</article>
		<footer class="buttons">
		  <button type="submit" class="validation {if totalNationalityCount == 0}displayBlock{else/}displayNone{/if}" id="continueButton">${label.Continue}</button>
		  <button type="submit" class="validation {if totalNationalityCount > 0}displayBlock{else/}displayNone{/if}" id="nextButton" operating-customer="${showPaxAtIndex}">${label.Next}</button>
		  <button type="button" class="validation disabled" disabled="disabled" id="previousButton" {on click "onPrevious"/}>${label.Previous}</button><br /><br /><br /><br />
		  <button type="button" formaction="javascript:void(0);" class="validation cancel"
					{on click "onBackClick"/}>${label.Cancel}</button>
		</footer>
	</form>
	</section>
	</div>
{/macro}

{macro callCloseSection()}

{/macro}

{macro getCountryOfResidence(cust_index, prod_index, cor, countryNameCodeMap, label)}
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, //{code:3 , sec : "Res", cust:cust_index , prod:prod_index , //refid:'cor_'+cust_index+'_'+prod_index })/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'cor_'+cust_index+'_'+prod_index}) /}
	{var resVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		 {set resVal= moduleCtrl.getCountryCode()/}
	{else/}
		 {set resVal = cor /}
	{/if}
	{call
		common.textfield({
			type : 'text',
			id : 'cor_'+cust_index+'_'+prod_index,
			name : 'cor_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[resVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+ label.CountryOfResidence,
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)"
	{on click { fn:"onCountryLinkClick", args: {code:3 , sec : "Res", cust:cust_index ,prod:prod_index ,refid:'cor_'+cust_index+'_'+prod_index}}/} >
		<span class="airportpicker"></span>
	</a>		
{/macro}

{macro getPassportIssueAuth(pspCntryIssue, natval, cust_index, prod_index, countryNameCodeMap, label)}
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, {code : 3 //, sec : "Psp", cust:cust_index , prod:prod_index , //refid:'psp_Country_issue_'+cust_index+'_'+prod_index})/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'psp_Country_issue_'+cust_index+'_'+prod_index}) /}
	{var pspVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		{set pspVal= moduleCtrl.getCountryCode()/}
    {else/}
		{set pspVal= pspCntryIssue /}
	{/if}
	/*For prefilling passport country based on nationality*/
	{if pspVal == "" || pspVal == undefined || pspVal == null}
	{set pspVal=natval /}
	{/if}

	{call
		common.textfield({
			type : 'text',
			id : 'psp_Country_issue_'+cust_index+'_'+prod_index,
			name : 'psp_Country_issue_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[pspVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.CountryOfIssue]),
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)" {on click { fn:"onCountryLinkClick", args: {code :3 ,sec: "Psp", cust:cust_index , prod:prod_index , refid:'psp_Country_issue_'+cust_index+'_'+prod_index}}/}>
		<span class="airportpicker"></span>
	</a>
{/macro}

{macro getVisaIssueAuth(vCntryIssue, cust_index, prod_index, countryNameCodeMap, label)}									
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, {code : 3 //, sec : "Visa", cust:cust_index , prod:prod_index , //refid:'Visa_country_'+cust_index+'_'+prod_index})/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'Visa_country_'+cust_index+'_'+prod_index}) /}
	{var visaVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		{set visaVal= moduleCtrl.getCountryCode()/}
	{else/}
		{set visaVal= vCntryIssue /}
	{/if}
	{call
		common.textfield({
			type : 'text',
			id : 'Visa_country_'+cust_index+'_'+prod_index,
			name : 'Visa_country_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[visaVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.CountryOfIssue]),
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)" {on click { fn:"onCountryLinkClick", args: {code : 3 , sec: "Visa", cust:cust_index , prod:prod_index , refid:'Visa_country_'+cust_index+'_'+prod_index}}/}>
	<span class="airportpicker"></span>
	</a>									
{/macro}

{macro getCountryOfOrigin(hCntryRes, cust_index, prod_index, countryNameCodeMap, label)}
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, {code : //3 , sec : "Home", cust:cust_index , prod:prod_index , //refid:'Country_'+cust_index+'_'+prod_index})/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'Country_'+cust_index+'_'+prod_index}) /}
	{var homeVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		{set homeVal= moduleCtrl.getCountryCode()/}
    {else/}
		{set homeVal= hCntryRes/}
	{/if}
	{call
		common.textfield({
			type : 'text',
			id : 'Country_'+cust_index+'_'+prod_index,
			name : 'Country_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[homeVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Country]),
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)" {on click { fn:"onCountryLinkClick", args: {code : 3 , sec: "Home", cust:cust_index , prod:prod_index , refid:'Country_'+cust_index+'_'+prod_index}}/}>
		<span class="airportpicker"></span>
	</a>									
{/macro}

{macro getCountryOfDestination(dCntry, cust_index, prod_index, countryNameCodeMap, label)}
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, {code : //3 , sec : "Dest", cust:cust_index , prod:prod_index , //refid:'dest_country_'+cust_index+'_'+prod_index})/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'dest_country_'+cust_index+'_'+prod_index}) /}
	{var destVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		{set destVal= moduleCtrl.getCountryCode()/}
    {else/}
		{set destVal= dCntry /}
	{/if}
	{call
		common.textfield({
			type : 'text',
			id : 'dest_country_'+cust_index+'_'+prod_index,
			name : 'dest_country_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[destVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Country]),
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)" {on click { fn:"onCountryLinkClick", args: {code : 3 , sec: "Dest", cust:cust_index , prod:prod_index , refid:'dest_country_'+cust_index+'_'+prod_index}}/}>
		<span class="airportpicker"></span>
	</a>									
{/macro}

{macro getEmergencyCountryCode(EmrgCntryCode, cust_index, prod_index, countryNameCodeMap, label)}
	//{var handlerName = MC.appCtrl.registerHandler(this.onCountryLinkClick, this, {code : //3 , sec : "Emrg", cust:cust_index , prod:prod_index , //refid:'Emrg_coutryCode_'+cust_index+'_'+prod_index})/}
	//{var handlerName1 = MC.appCtrl.registerHandler(this.onInputFocus, this, {id : //'Emrg_coutryCode_'+cust_index+'_'+prod_index}) /}
	{var emrgVal = "" /}
	{if moduleCtrl.getCountryCode()!= null}
		{set emrgVal= moduleCtrl.getCountryCode()/}
    {else/}
		{set emrgVal= EmrgCntryCode /}
	{/if}
	{call
		common.textfield({
			type : 'text',
			id : 'Emrg_coutryCode_'+cust_index+'_'+prod_index,
			name : 'Emrg_coutryCode_'+cust_index+'_'+prod_index,
			value: countryNameCodeMap.codetocountry[emrgVal],
			dataCountrySel: 'select-country',
			options : {
				textfieldcls : 'inputField widthFull inputStyle',
				validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.CountryCode]),
				errorNumbers : '21400059',
				clearButton : false
			}
		})
	/}
	<a href="javascript:void(0)" {on click { fn:"onCountryLinkClick", args: {code : 3 , sec: "Emrg", cust:cust_index , prod:prod_index , refid:'Emrg_coutryCode_'+cust_index+'_'+prod_index}}/}>
		<span class="airportpicker"></span>
	</a>									
{/macro}

{/Template}