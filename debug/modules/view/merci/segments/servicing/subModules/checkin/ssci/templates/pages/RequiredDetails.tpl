{Template {
	$classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.RequiredDetails',
	$macrolibs : {
		common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	},
	$hasScript:true
}}
{macro main()}


{var label = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.labels /}
{var nationalityLabel = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.Nationality /}
{var countryDetails = this.moduleCtrl.getFormattedCuntryList() /}
{var cpr = this.moduleCtrl.getCPR() /}
{var selectedCPR=this.moduleCtrl.getSelectedCPR() /}
{var journeyID=selectedCPR.journey /}
{var currentDate=this.currDate /}
{var usaCountryDetails = this.data.availableStatesUSAAutoComplete /}
{var usaCodeTostate = this.data.usaStatesCodeToStateNameMap /}
{var errors = moduleCtrl.getErrors() /}

/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
{set currentDate = "" /}

/*{if this.data.regPageLandingPaxIndex=0}{/if}*/
<div id="regulatoryCoreErrors" class="showCoreErrorMessage">
</div>
<footer class="buttons displayNone">
   <button type="button" {on click {fn : "onHomeClick"}/} class="validation" data-seatinfo="chargeable-seats">${label.exitCheckin}</button>
</footer>
<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionRequiredDetailsBase'>
<section>
/*Displaying SSCI Warnings */
<div id="pageWiseCommonWarnings"></div>
<div id="regulatoryErrors">
</div>
<div id="regulatoryOtherErrors">
{if errors != null}
          {@html:Template {
            "classpath" : "modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages",
            data : {
              "messages" : errors,
              "type" : "error" }
          }/}
{/if}
</div>
<div id="natErrors"></div>

  <form id="MRequiredDetails_A" {on submit "chooseSubmit"/}>

    <nav class="breadcrumbs">
      <ul>
        <li><span>1</span></li>
        <li class="active"><span>2</span></li>
        <li><span>3</span></li>
        <li><span>4</span></li>
      </ul>
    </nav>

    <div class="message info">
	  <p>${nationalityLabel.NationalityInfo}</p>
    </div>

    <article class="panel">

		<span id="IDSectionHolder">
			{var selectedPaxId=selectedCPR.custtoflight[this.data.regPageLandingPaxIndex].customer /}

			/*Header name details*/
			{var namePrefix = "" /}
			{if cpr[journeyID][selectedPaxId] && cpr[journeyID][selectedPaxId].personNames.length > 0 && cpr[journeyID][selectedPaxId].personNames[0].namePrefixs.length > 0}
				{set namePrefix = cpr[journeyID][selectedPaxId].personNames[0].namePrefixs[0] /}
			{/if}

			{var givenName = "" /}
			{if cpr[journeyID][selectedPaxId] && cpr[journeyID][selectedPaxId].personNames.length > 0 && cpr[journeyID][selectedPaxId].personNames[0].givenNames[0].length > 0}
				{set givenName = cpr[journeyID][selectedPaxId].personNames[0].givenNames[0] /}
			{/if}

			{var surName = "" /}
			{if cpr[journeyID][selectedPaxId] && cpr[journeyID][selectedPaxId].personNames.length > 0 && cpr[journeyID][selectedPaxId].personNames[0].surname}
				{set surName = cpr[journeyID][selectedPaxId].personNames[0].surname /}
			{/if}

			/*ADT - adult, CHD- child, INF - infant*/
			{var passengerTypeCode = "" /}
			{var paxType = "adult" /}
			{if cpr[journeyID][selectedPaxId].passengerTypeCode}
				{set passengerTypeCode = cpr[journeyID][selectedPaxId].passengerTypeCode /}
			{/if}
			/*End header*/

			/*Taking Nationality & Customer Information*/
			{var nationality="" /}
			{var nationalityCls="" /}
			{var reqclearFieldImg = true/}

			{var DOB="" /}
			{var COR="" /}
			{var POB="" /}
			{var gender="" /}
			{var contactInfoReq = "displayNone" /}

			/*Taking gender details from Cpr*/
			{if gender == "" && cpr[journeyID]["customerDetailsBeans"][selectedPaxId].gender && cpr[journeyID]["customerDetailsBeans"][selectedPaxId].gender != ""}
				{if cpr[journeyID]["customerDetailsBeans"][selectedPaxId].gender.search(/^(m)$|^(male)$/i) != -1}
					{set gender="M" /}
				{else /}
					{set gender="F" /}
				{/if}
				{set contactInfoReq = "displayBlock" /}
			{/if}

			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}

					{if nationality == "" && selectedOne.personalDetailsNationality}
						{set nationality=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.personalDetailsNationality] /}
						{set nationalityCls="disabled" /}
						{set reqclearFieldImg = false/}
					{/if}
					{if DOB == "" && selectedOne.personalDetailsBirthDate}
						{set DOB=selectedOne.personalDetailsBirthDate /}
						{set contactInfoReq = "displayBlock" /}
					{/if}
					{if COR == "" && selectedOne.personalDetailsResidenceCountry}
						{set COR=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.personalDetailsResidenceCountry] /}
						{set contactInfoReq = "displayBlock" /}
					{/if}
					{if POB == "" && selectedOne.personalDetailsBirthPlace}
						{set POB=selectedOne.personalDetailsBirthPlace /}
						{set contactInfoReq = "displayBlock" /}
					{/if}

				{/foreach}
			{/if}

			/*Find out nationality requirement for any other product as we have to make nat field readonly or not based on this*/
			{var regBean=cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails /}
	    	{var regChoics=regBean.choices /}
	    	{foreach regChoic in regChoics}
	    		//Nationalaty Details
	    		{if regChoic.type != null && regChoic.type != undefined && regChoic.type == "Nationality"}
	    			{set reqclearFieldImg = true/}
	    		{/if}
	    	{/foreach}

			/*End taking nationality*/

			/*Taking Passport info -- 2*/
      {var pspIssueCntry="" /}
      {var pspIssueAth="" /}
      {var pspIssueCity="" /}
      {var pspFirstName="" /}
      {var pspLastName="" /}
      {var pspIssueDate="" /}
			{var pspNum="" /}
			{var pspExpDate="" /}
			{var pspInfoReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}
					{if selectedOne.documentDocument}
						{set selectedOne = selectedOne.documentDocument /}
					{/if}
					{if selectedOne.doc == "2"}
						{if selectedOne.docID}
							{set pspNum=selectedOne.docID /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.docIssueLocation}
							{set pspIssueCity=selectedOne.docIssueLocation /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{if !jQuery.isUndefined(selectedOne.choice) && !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName)}
							{if !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName.givenNames)}
								{set pspFirstName=selectedOne.choice.docHolderFormattedName.givenNames[0] /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
							{if !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName.surname)}
								{set pspLastName=selectedOne.choice.docHolderFormattedName.surname /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.expireDate}
							{set pspExpDate=selectedOne.effectiveExpireOptionalDate.expireDate /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.effectiveDate}
							{set pspIssueDate=selectedOne.effectiveExpireOptionalDate.effectiveDate /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.docIssueCountry}
              {set pspIssueAth=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docIssueCountry] /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.docHolderNationality}
              {set pspIssueCntry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docHolderNationality] /}
							{set pspInfoReq = "displayBlock" /}
						{/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Passport info*/

			/*Taking Visa info -- 1*/
      {var visaIssueCntry="" /}
      {var visaIssueAth="" /}
      {var visaIssueCity="" /}
      {var visaIssueDate="" /}
			{var visaNum="" /}
			{var visaExpDate="" /}
			{var visaPlsOfIssue="" /}
			{var visaInfoReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}
					{if selectedOne.documentDocument}
						{set selectedOne = selectedOne.documentDocument /}
					{/if}
					{if selectedOne.doc == "1"}
						{if selectedOne.docID}
							{set visaNum=selectedOne.docID /}
							{set visaInfoReq = "displayBlock" /}
						{/if}

						{if selectedOne.docIssueLocation}
							{set visaIssueCity=selectedOne.docIssueLocation /}
							{set visaInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.expireDate}
							{set visaExpDate=selectedOne.effectiveExpireOptionalDate.expireDate /}
							{set visaInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.effectiveDate}
							{set visaIssueDate=selectedOne.effectiveExpireOptionalDate.effectiveDate /}
							{set visaInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.docIssueCountry}
              {set visaIssueAth=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docIssueCountry] /}
							{set visaInfoReq = "displayBlock" /}
						{/if}
						{if selectedOne.docHolderNationality}
              {set visaIssueCntry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docHolderNationality] /}
							{set visaInfoReq = "displayBlock" /}
						{/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Visa info*/

			/*Taking Other doc info -- doc node in response in anything between this.othDocList is other document*/
			{var OthDocumentType="" /}
			{var OthDocumentNum="" /}
			{var OthDocumentExpDate="" /}
      {var othIssueAth="" /}
      {var othIssueCntry="" /}
      {var othIssueCity="" /}
      {var othFirstName="" /}
      {var othLastName="" /}
      {var othIssueDate="" /}
			{var otherDocReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}
					{if selectedOne.documentDocument}
						{set selectedOne = selectedOne.documentDocument /}
					{/if}
					{if this.othDocList.indexOf(parseInt(selectedOne.doc)) != -1}
						{set OthDocumentType=selectedOne.doc /}
						{set otherDocReq = "displayBlock" /}
						{if selectedOne.docID}
							{set OthDocumentNum=selectedOne.docID /}
							{set otherDocReq = "displayBlock" /}
						{/if}
						{if selectedOne.docIssueLocation}
							{set othIssueCity=selectedOne.docIssueLocation /}
							{set otherDocReq = "displayBlock" /}
						{/if}
						{if !jQuery.isUndefined(selectedOne.choice) && !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName)}
							{if !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName.givenNames)}
								{set othFirstName=selectedOne.choice.docHolderFormattedName.givenNames[0] /}
							{set otherDocReq = "displayBlock" /}
						{/if}
							{if !jQuery.isUndefined(selectedOne.choice.docHolderFormattedName.surname)}
								{set othLastName=selectedOne.choice.docHolderFormattedName.surname /}
							{set otherDocReq = "displayBlock" /}
							{/if}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.expireDate}
							{set OthDocumentExpDate=selectedOne.effectiveExpireOptionalDate.expireDate /}
							{set otherDocReq = "displayBlock" /}
						{/if}
						{if selectedOne.effectiveExpireOptionalDate && selectedOne.effectiveExpireOptionalDate.effectiveDate}
							{set othIssueDate=selectedOne.effectiveExpireOptionalDate.effectiveDate /}
							{set otherDocReq = "displayBlock" /}
						{/if}


            {if selectedOne.docHolderNationality}
              {set othIssueCntry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docHolderNationality] /}
              {set otherDocReq = "displayBlock" /}
            {/if}

            {if selectedOne.docIssueCountry}
              {set othIssueAth=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.docIssueCountry] /}
              {set otherDocReq = "displayBlock" /}
            {/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Other doc info*/

			/*Taking Home address details*/
			{var homeStret="" /}
			{var homeCity="" /}
			{var homeState="" /}
			{var homeZip="" /}
			{var homeCuntry="" /}
			{var homeReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}

					{if selectedOne.homeAddress && selectedOne.homeAddress.postalCode}
						{if selectedOne.homeAddress.addressLines && selectedOne.homeAddress.addressLines.length >0}
							{set homeStret=selectedOne.homeAddress.addressLines[0] /}
							{set homeReq = "displayBlock" /}
						{/if}
						{if selectedOne.homeAddress.cityName}
							{set homeCity=selectedOne.homeAddress.cityName /}
							{set homeReq = "displayBlock" /}
						{/if}
						{if selectedOne.homeAddress.stateProv}
							{if selectedOne.homeAddress.stateProv.string && selectedOne.homeAddress.stateProv.string !=""}
								{set homeState=selectedOne.homeAddress.stateProv.string /}
								{set homeReq = "displayBlock" /}
							{/if}
							{if selectedOne.homeAddress.stateProv.stateCode && selectedOne.homeAddress.stateProv.stateCode !=""}
								{set homeState=usaCodeTostate[selectedOne.homeAddress.stateProv.stateCode] /}
								{if homeState == undefined}
									{set homeState= selectedOne.homeAddress.stateProv.stateCode/}
								{/if}
								{set homeReq = "displayBlock" /}
							{/if}
						{/if}
						{if selectedOne.homeAddress.postalCode}
							{set homeZip=selectedOne.homeAddress.postalCode /}
							{set homeReq = "displayBlock" /}
						{/if}
						{if selectedOne.homeAddress.countryName && selectedOne.homeAddress.countryName.code}
							{set homeCuntry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.homeAddress.countryName.code] /}
							{set homeReq = "displayBlock" /}
						{/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Home address details*/

			/*Taking Dest address details*/
			{var destStret="" /}
			{var destCity="" /}
			{var destState="" /}
			{var destZip="" /}
			{var destCuntry="" /}
			{var destReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}

					{if selectedOne.destinationAddress && selectedOne.destinationAddress.postalCode}
						{if selectedOne.destinationAddress.addressLines && selectedOne.destinationAddress.addressLines.length >0}
							{set destStret=selectedOne.destinationAddress.addressLines[0] /}
							{set destReq = "displayBlock" /}
						{/if}
						{if selectedOne.destinationAddress.cityName}
							{set destCity=selectedOne.destinationAddress.cityName /}
							{set destReq = "displayBlock" /}
						{/if}
						{if selectedOne.destinationAddress.stateProv}
							{if selectedOne.destinationAddress.stateProv.string && selectedOne.destinationAddress.stateProv.string !=""}
								{set destState=selectedOne.destinationAddress.stateProv.string /}
								{set destReq = "displayBlock" /}
							{/if}
							{if selectedOne.destinationAddress.stateProv.stateCode && selectedOne.destinationAddress.stateProv.stateCode !=""}
								{set destState=usaCodeTostate[selectedOne.destinationAddress.stateProv.stateCode] /}
								{if destState == undefined}
									{set destState= selectedOne.destinationAddress.stateProv.stateCode/}
								{/if}
								{set destReq = "displayBlock" /}
							{/if}
						{/if}
						{if selectedOne.destinationAddress.postalCode}
							{set destZip=selectedOne.destinationAddress.postalCode /}
							{set destReq = "displayBlock" /}
						{/if}
						{if selectedOne.destinationAddress.countryName && selectedOne.destinationAddress.countryName.code}
							{set destCuntry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.destinationAddress.countryName.code] /}
							{set destReq = "displayBlock" /}
						{/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Dest address details*/

			/*Taking Emergency details*/
			{var contactName="" /}
			{var contactCountry="" /}
			{var contactTelePhone="" /}
			{var emer_declineDetails_flag=false /}
			{var emerDetReq = "displayNone" /}
			{if cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails && cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas.length > 0}
				{foreach selectedOne in cpr[journeyID].customerDetailsBeans[selectedPaxId].regulatoryDetails.requirementDatas}
					{if selectedOne.documentDocument}
						{set selectedOne = selectedOne.documentDocument /}
					{/if}
					{if selectedOne.emergencyContact && selectedOne.emergencyContact.personName}
						{if selectedOne.emergencyContact.personName.surname}
							{set contactName=selectedOne.emergencyContact.personName.surname /}
							{set emerDetReq = "displayBlock" /}

							/*
							in case emergency details decline true then all emrgency details comes "" or 0

							if all details "" or 0 which means emergency details declined
							*/
							{if contactName == ""}
								{set contactName="" /}
							{/if}
						{/if}
						{if selectedOne.emergencyContact.addresses && selectedOne.emergencyContact.addresses.length>0 && selectedOne.emergencyContact.addresses[0].countryName && selectedOne.emergencyContact.addresses[0].countryName.code}
							{set contactCountry=this.moduleCtrl.gettwoDigitThreeDigitAllCntryList()[selectedOne.emergencyContact.addresses[0].countryName.code] /}
							{set emerDetReq = "displayBlock" /}

							/*
							in case emergency details decline true then all emrgency details comes "" or 0

							if all details "" or 0 which means emergency details declined
							*/
							{if contactCountry == ""}
								{set contactCountry="" /}
							{/if}
						{/if}
						{if selectedOne.emergencyContact.telephones && selectedOne.emergencyContact.telephones.length > 0 && selectedOne.emergencyContact.telephones[0].telephone && selectedOne.emergencyContact.telephones[0].telephone.telephoneAttributes && selectedOne.emergencyContact.telephones[0].telephone.telephoneAttributes.phoneNumber}
							{set contactTelePhone=selectedOne.emergencyContact.telephones[0].telephone.telephoneAttributes.phoneNumber /}
							{set emerDetReq = "displayBlock" /}

							/*
							in case emergency details decline true then all emrgency details comes "" or 0

							if all details "" or 0 which means emergency details declined
							*/
							{if contactTelePhone == ""}
								{set contactTelePhone="" /}
							{/if}
						{/if}

						/*
						 if all emergency details is "" or 0 which means emerg declien true
						*/
						{if contactName == "" && contactCountry == "" && contactTelePhone == ""}
							{set emer_declineDetails_flag=true /}
						{/if}
					{/if}
				{/foreach}
			{/if}
			/*End taking Emergency details*/

			<div id="wrap">
				<ul id="mycarousel" class="jcarousel-skin-tango-requireddetails">

					<li class="displayBlock" data-customer-id="${selectedPaxId}" data-customer-index="${this.data.regPageLandingPaxIndex}">
					<span class="pax">${parseInt(this.data.regPageLandingPaxIndex+1)}</span>

					<span class="paxName"> ${jQuery.substitute(label.PaxName, [namePrefix, givenName, 	surName])} {if passengerTypeCode == "INF"}{set paxType = "infant" /}<small>(${label.Infant})</small>{/if}{if passengerTypeCode == "CHD"}{set paxType = "child" /}<small>(Child)</small>{/if}</span> </span>
					</li>

				</ul>

			</div>

			/*Nationality info*/
			<section class="{if nationality == ""}displayNone{else /}displayBlock{/if}">
        		<header>
          		<h2 class="subheader"> <span>${nationalityLabel.Title}</span>
            	<button type="button" role="button" class="toggle" data-aria-expanded="{if nationality == "" || reqclearFieldImg}true{else /}false{/if}" data-aria-controls="natInfo01"><span>Toggle</span></button>
          		</h2>
        		</header>

				<ul id="natInfo01" style="{if nationality == "" || reqclearFieldImg}display:block{else /}display:none{/if}" class="input-elements">
		          <li class="{if nationality == ""}displayNone{else /}displayBlock{/if} nationality">
		            <label for="nationality">${nationalityLabel.Title}<span class="mandatory">*</span></label>
		            <!--<input id="nationality" name="nationality" validators="req:${nationalityLabel.Title} - ${nationalityLabel.Title}|alpha:${nationalityLabel.Title} - ${nationalityLabel.Title}" errornumbers="21400059|21400062" autocorrect="off" autocapitalize="none" autocomplete="off" style="width:80%;" type="text">-->
		            {call autocomplete.createAutoComplete({
						name: "nationality",
						id: "nationality",
						type: 'text',
						validators : "req:"+nationalityLabel.Title,
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						class : "nationalityFieldWidth "+nationalityCls,
						value: nationality,
						source: countryDetails,
						datacountrysel:"select-country",
						reqclearFieldImg:reqclearFieldImg

					})/}
		            <button type="submit" id="natokbutton" role="button">${nationalityLabel.Ok}</button>
		            <button type="button" id="editnatbutton" {on click "editNationality"/} class="displayNone" role="button">${nationalityLabel.Edit}</button>
		          </li>
				</ul>
      		</section>

			/*Contact information*/
			<section class="${contactInfoReq}">
			<header>
          	<h2 class="subheader"> <span>${label.CustInfo}</span>
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="contactInfo0"><span>Toggle</span></button>
          	</h2>
        	</header>
			<ul class="input-elements" id="contactInfo0">


			<li class="{if gender && gender != ""}displayBlock{else /}displayNone{/if} top-input-element genderBlock">
            <label for="li1">${label.Gender}<span class="mandatory">*</span></label>
            <ul class="{if gender && gender != "" && parameters.SITE_SSCI_ALOW_GNDER_EDIT != undefined && parameters.SITE_SSCI_ALOW_GNDER_EDIT.search(/false/gi) != -1}disabled {/if}input-radio">
              <li class="width_50">
                <input name="gender" validators="req:${jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.Gender])}" errorNumbers="21400063" id="li1" type="radio" value="M" {if !gender || gender == "" || gender == "M"}checked="checked"{/if} {if gender && gender != "" && parameters.SITE_SSCI_ALOW_GNDER_EDIT != undefined && parameters.SITE_SSCI_ALOW_GNDER_EDIT.search(/false/gi) != -1}disabled="disabled"{/if} class="is-tab" />
                <label for="li1">${label.Male}</label>
              </li>
              <li class="width_50">
                <input name="gender" id="li2" validators="req:${jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.Gender])}" errorNumbers="21400063" value="F" {if gender && gender == "F"}checked="checked"{/if} {if gender && gender != "" && parameters.SITE_SSCI_ALOW_GNDER_EDIT != undefined && parameters.SITE_SSCI_ALOW_GNDER_EDIT.search(/false/gi) != -1}disabled="disabled"{/if} type="radio" class="is-tab" />
                <label for="li2">${label.Female}</label>
              </li>
            </ul>
          	</li>

			<li class="{if DOB != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="dob_0" data-info="ddb">
            <label for="dob">${label.DOB}<span class="mandatory">*</span></label>
            <input value="{if DOB == ""}${currentDate}{else /}${DOB}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
            <input val="dob_0" value="{if DOB == ""}${currentDate}{else /}${DOB}{/if}" pax="${paxType}" id="dob" name="dob" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
          	</li>

			<li class="pob {if POB != ""}displayBlock{else /}displayNone{/if}">
            <label for="pob">${label.PlaceOfBirth}<span class="mandatory">*</span></label>
            <input id="pob" name="pob" value="${POB}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, 	[label.CustInfo,label.PlaceOfBirth])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.CustInfo,label.PlaceOfBirth])}" errornumbers="21400059|21400062" type="text" />
            </li>

			<li class="cor {if COR != ""}displayBlock{else /}displayNone{/if}">
            <label for="cor">${label.CountryOfResidence}<span class="mandatory">*</span></label>
            /*<input id="cor" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req: label.CountryOfResidence" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
						name: "cor",
						id: "cor",
						type: 'text',
						validators : 'req:'+ label.CountryOfResidence,
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: COR,
						source: countryDetails,
						datacountrysel:"select-country"

					})/}
            </li>

			</ul>
			</section>

			/*Documents Required Details*/
			<section class="displayNone">
				<header>
				<h2 class="subheader"> <span>${label.docReqHeaderLbl}</span>
				<button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="documentsRequiredDetails0" data-aria-hidden="false"><span>Toggle</span></button>
				</h2>
				</header>
				<ul class="input-elements" id="documentsRequiredDetails0" style="display: block;">

					<li class="drd displayNone"><label for="documentsRequiredDetails">${label.documntSelectLbl.replace(":","")}<span class="mandatory">*</span></label>

					  <select {on change {fn:"changeDocumentsRequiredDetails",args:{value:"","call":"onchange"}} /} id="documentsRequiredDetails">
					    <option value="pspnumber">${label.PassportInfo}</option>
					    <option value="othdoctype">${label.OtherDocInfo}</option>
					  </select>
					</li>

				</ul>
			</section>
			/*End documents Required Details*/

			/*Passport info*/
			<section class="${pspInfoReq}">
			<header>
          	<h2 class="subheader"> <span>${label.PassportInfo}</span>
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="pspinfo0"><span>Toggle</span></button>
          	</h2>
        	</header>
			<ul class="input-elements" id="pspinfo0">


	<li data-fieldno="2" class="{if pspFirstName != ""}displayBlock{else /}displayNone{/if}" data-info="pspfirstname">
              <label for="pspfirstname">${label.FirstName} <span class="mandatory">*</span></label>
              <input id="pspfirstname" name="pspfirstname" value="{if pspFirstName != ""}${pspFirstName}{else /}${givenName}{/if}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.FirstName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.FirstName])}" errornumbers="21400059|21400062" type="text" />
          </li>
     <li data-fieldno="1" class="{if pspLastName != ""}displayBlock{else /}displayNone{/if}" data-info="psplastname">
              <label for="psplastname">${label.LastName} <span class="mandatory">*</span></label>
              <input id="psplastname" name="psplastname" value="{if pspLastName != ""}${pspLastName}{else /}${surName}{/if}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.LastName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.LastName])}" errornumbers="21400059|21400062" type="text" />
          </li>

			//{if pspNum != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="6" class="pspnumber {if pspNum != ""}displayBlock{else /}displayNone{/if}">
            <label for="pspnumber">${label.PassportNbr}<span class="mandatory">*</span></label>
            <input id="pspnumber" name="pspnumber" autocorrect="off" value="${pspNum}" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr])}" errornumbers="21400059|21400061" type="text" />
            </li>

      //{if pspIssueDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="13" class="{if pspIssueDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="datIssue_0" data-info="pspissuedate">
              <label for="pspissuedate">${label.issueDate}<span class="mandatory">*</span></label>
              <input value="{if pspIssueDate == ""}${currentDate}{else /}${pspIssueDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
              <input val="datIssue_0" value="{if pspIssueDate == ""}${currentDate}{else /}${pspIssueDate}{/if}" data-errLbl="${label.PassportInfo}" pax="${paxType}" id="pspissuedate" name="pspissuedate" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
            </li>

			//{if pspExpDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="14" class="pspexpdt {if pspExpDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="ed_0" data-info="pspexpdt">
            <label for="pspexpdt">${label.ExpDate}<span class="mandatory">*</span></label>
            <input value="{if pspExpDate == ""}${currentDate}{else /}${pspExpDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
            <input val="ed_0" name="psp_exp" doc="passport" value="{if pspExpDate == ""}${currentDate}{else /}${pspExpDate}{/if}" id="pspexpdt" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
          	</li>

      //{if pspIssueCity != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="10" class="{if pspIssueCity != ""}displayBlock{else /}displayNone{/if}" data-info="pspissuecity">
              <label for="pspissuecity">${label.City} <span class="mandatory">*</span></label>
              <input id="pspissuecity" name="pspissuecity" value="${pspIssueCity}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.City])}" errornumbers="21400059|21400062" type="text" />
          </li>

      //{if pspIssueAth != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="15" class="pspissueath {if pspIssueAth != ""}displayBlock{else /}displayNone{/if}">
            <label for="pspissueath">${label.documentIssuingCountry}<span class="mandatory">*</span></label>
            /*<input id="pspissueath" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.documentIssuingCountry])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
						name: "pspissueath",
						id: "pspissueath",
						type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.documentIssuingCountry]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
            value: pspIssueAth,
            source: countryDetails,
            datacountrysel:"select-country"

      })/}
            </li>

      //{if pspIssueCntry != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="7" class="pspissuecntry {if pspIssueCntry != ""}displayBlock{else /}displayNone{/if}">
            <label for="pspissuecntry">${label.Country}<span class="mandatory">*</span></label>
            /*<input id="pspissuecntry" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.Country])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
            name: "pspissuecntry",
            id: "pspissuecntry",
            type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.Country]),
            errornumbers : "21400059",
            autocorrect:"off",
            autocapitalize:"none",
            autocomplete:"off",
            value: pspIssueCntry,
						source: countryDetails,
						datacountrysel:"select-country"

			})/}
            </li>

			</ul>
			</section>

			/*Other doc info*/
			<section class="${otherDocReq}">
			<header>
          	<h2 class="subheader"> <span>${label.OtherDocInfo}</span>
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="othdocinfo0"><span>Toggle</span></button>
          	</h2>
        	</header>
			<ul class="input-elements" id="othdocinfo0">

			<li data-fieldno="2" class="{if othFirstName != ""}displayBlock{else /}displayNone{/if}" data-info="othfirstname">
              <label for="othfirstname">${label.FirstName} <span class="mandatory">*</span></label>
              <input id="othfirstname" name="othfirstname" value="{if othFirstName != ""}${othFirstName}{else /}${givenName}{/if}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.FirstName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.FirstName])}" errornumbers="21400059|21400062" type="text" />
          </li>
     <li data-fieldno="1" class="{if othLastName != ""}displayBlock{else /}displayNone{/if}" data-info="othlastname">
              <label for="othlastname">${label.LastName} <span class="mandatory">*</span></label>
              <input id="othlastname" name="othlastname" value="{if othLastName != ""}${othLastName}{else /}${surName}{/if}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.LastName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.LastName])}" errornumbers="21400059|21400062" type="text" />
          </li>

			<li class="othdoctype">
            <label for="othdoctype">${label.DocType}<span class="mandatory">*</span></label>
            <select id="othdoctype" name="othdoctype" disabled=disabled validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocType])}" errornumbers="21400063" id="pass-auth">
              {foreach id in this.data.otherDocumentTypeList}
              	<option value="${id_index}" {if OthDocumentType == id_index}selected="selected"{/if}>${id}</option>
              {/foreach}
			  <!--<option value="B">${label.BoarderCard}</option>
			  <option value="C">${label.PermResCard}</option>-->
            </select>
            </li>

      //{if OthDocumentNum != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="6" class="othdocnumber {if OthDocumentNum != ""}displayBlock{else /}displayNone{/if}">
            <label for="othdocnumber">${label.DocNbr}<span class="mandatory">*</span></label>
            <input id="othdocnumber" name="othdocnumber" value="${OthDocumentNum}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocNbr])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.DocNbr])}" errornumbers="21400059|21400061" type="text" />
            </li>

	  //{if othIssueDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="13" class="{if othIssueDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="datIssue_0" data-info="othissuedate">
              <label for="othissuedate">${label.issueDate}<span class="mandatory">*</span></label>
              <input value="{if othIssueDate == ""}${currentDate}{else /}${othIssueDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
              <input val="datIssue_0" value="{if othIssueDate == ""}${currentDate}{else /}${othIssueDate}{/if}" data-errLbl="${label.OtherDocInfo}" pax="${paxType}" id="othissuedate" name="othissuedate" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
            </li>

			//{if OthDocumentExpDate!= ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="14" data-is-date-li="ed_0" data-info="othdocexpdt" class="{if OthDocumentExpDate != ""}displayBlock{else /}displayNone{/if}">
            <label for="othdocexpdt">${label.DocExpDate}<span class="mandatory">*</span></label>
            <input value="{if OthDocumentExpDate==""}${currentDate}{else /}${OthDocumentExpDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
            <input id="othdocexpdt" name="othdocexpdt" doc="otherdocument" value="{if OthDocumentExpDate==""}${currentDate}{else /}${OthDocumentExpDate}{/if}" autocorrect="off" name="doc_exp" autocapitalize="none" autocomplete="off" val="ed_0" type="hidden" />
          	</li>

      //{if othIssueCity != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="10" class="{if othIssueCity != ""}displayBlock{else /}displayNone{/if}" data-info="othissuecity">
              <label for="othissuecity">${label.City} <span class="mandatory">*</span></label>
              <input id="othissuecity" name="othissuecity" value="${othIssueCity}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.City])}" errornumbers="21400059|21400062" type="text" />
            </li>

      //{if othIssueAth != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="15" class="othissueath {if othIssueAth != ""}displayBlock{else /}displayNone{/if}">
            <label for="othissueath">${label.documentIssuingCountry}<span class="mandatory">*</span></label>
            /*<input id="othissueath" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.documentIssuingCountry])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
						name: "othissueath",
						id: "othissueath",
						type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.documentIssuingCountry]),
            errornumbers : "21400059",
            autocorrect:"off",
            autocapitalize:"none",
            autocomplete:"off",
            value: othIssueAth,
            source: countryDetails,
            datacountrysel:"select-country"

      })/}
            </li>

      //{if othIssueCntry != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="7" class="othissuecntry {if othIssueCntry != ""}displayBlock{else /}displayNone{/if}">
            <label for="othissuecntry">${label.Country}<span class="mandatory">*</span></label>
            /*<input id="othissuecntry" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.Country])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
            name: "othissuecntry",
            id: "othissuecntry",
            type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.Country]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
            value: othIssueCntry,
						source: countryDetails,
						datacountrysel:"select-country"

			})/}
            </li>

			</ul>
			</section>

/*Visa info*/
			<section class="${visaInfoReq}">
			<header>
          	<h2 class="subheader"> <span>${label.VisaInfo}</span>
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="visainfo0"><span>Toggle</span></button>
          	</h2>
        	</header>
			<ul class="input-elements" id="visainfo0">

			//{if visaNum!= ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="6" class="visanumber {if visaNum != ""}displayBlock{else /}displayNone{/if}">
            <label for="visanumber">${label.VisaNbr}<span class="mandatory">*</span></label>
            <input id="visanumber" name="visanumber" value="${visaNum}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.VisaNbr])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.VisaNbr])}" errornumbers="21400059|21400061" type="text" />
            </li>

	  //{if visaIssueDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="13" class="{if visaIssueDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="datIssue_0" data-info="visaissuedate">
              <label for="visaissuedate">${label.issueDate}<span class="mandatory">*</span></label>
              <input value="{if visaIssueDate == ""}${currentDate}{else /}${visaIssueDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
              <input val="datIssue_0" value="{if visaIssueDate == ""}${currentDate}{else /}${visaIssueDate}{/if}" data-errLbl="${label.VisaInfo}" pax="${paxType}" id="visaissuedate" name="visaissuedate" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
            </li>

			//{if visaExpDate!= ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="14" class="{if visaExpDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="ed_0" data-info="visaexpdt">
            <label for="visaexpdt">${label.ExpDate}<span class="mandatory">*</span></label>
            <input value="{if visaExpDate==""}${currentDate}{else /}${visaExpDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
            <input val="ed_0" name="visa_exp" doc="visa" value="{if visaExpDate==""}${currentDate}{else /}${visaExpDate}{/if}" id="visaexpdt" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
          	</li>

			//{if visaPlsOfIssue!= ""}displayBlock{else /}displayNone{/if}
          	//REMOVED BECAUSE IT IS NOT MANDATORY FROM BACKEND -- AS DISCUSSED WITH DALMIYA
          	/*<li class="visaplaceocissue">
            <label for="visaplaceocissue">${label.CityOfIssue}<span class="mandatory">*</span></label>
            <input id="visaplaceocissue" name="visaplaceocissue" value="${visaPlsOfIssue}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.CityOfIssue])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.CityOfIssue])}" errornumbers="21400059|21400062" type="text" />
            </li>*/

      //{if visaIssueCity != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="10" class="{if visaIssueCity != ""}displayBlock{else /}displayNone{/if}" data-info="visaissuecity">
              <label for="visaissuecity">${label.City} <span class="mandatory">*</span></label>
              <input id="visaissuecity" name="visaissuecity" value="${visaIssueCity}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.City])}" errornumbers="21400059|21400062" type="text" />
          </li>

      //{if visaIssueAth != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="15" class="visaissueath {if visaIssueAth != ""}displayBlock{else /}displayNone{/if}">
            <label for="visaissueath">${label.documentIssuingCountry}<span class="mandatory">*</span></label>
            /*<input id="visaissueath" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.documentIssuingCountry])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
						name: "visaissueath",
						id: "visaissueath",
						type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.documentIssuingCountry]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
            value: visaIssueAth,
						source: countryDetails,
						datacountrysel:"select-country"

			})/}
            </li>

      //{if visaIssueCntry != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="7" class="visaissueath {if visaIssueCntry != ""}displayBlock{else /}displayNone{/if}">
            <label for="visaissuecntry">${label.Country}<span class="mandatory">*</span></label>
            /*<input id="visaissuecntry" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.Country])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
            name: "visaissuecntry",
            id: "visaissuecntry",
            type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.VisaInfo,label.Country]),
            errornumbers : "21400059",
            autocorrect:"off",
            autocapitalize:"none",
            autocomplete:"off",
            value: visaIssueCntry,
            source: countryDetails,
            datacountrysel:"select-country"

      })/}
            </li>


			</ul>
			</section>


			/*Home address details*/
			<section class="${homeReq}">
	        <header>
	          <h2 class="subheader"> <span>${label.HomeAddr}</span>
	            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="homeaddress01"><span>Toggle</span></button>
	          </h2>
	        </header>
	        <ul class="input-elements" id="homeaddress01">
	          //{if homeStret!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="9" class="{if homeStret != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="homeaddrstreet">${label.Street}<span class="mandatory">*</span></label>
	            /*<input id="homeaddrstreet" name="homeaddrstreet" value="${homeStret}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Street])}|state:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Street])}" errornumbers="21400059|213002228" type="text" />*/
	            {call autocomplete.createAutoComplete({
						name: "homeaddrstreet",
						id: "homeaddrstreet",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Street])+'|state:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Street]),
						errornumbers : "21400059|213002228",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: homeStret,
						source: this.data.regHomeDetailsAutocomplete.autocompleteHomestreetResult,
						selectFn: {fn:"copyFromOtherPaxHomeDetal",scope:this},
						fromField:"street"

				 })/}
	          </li>

	          //{if homeCity!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="10" class="{if homeCity != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="homeaddrcity">${label.City} <span class="mandatory">*</span></label>
	            <input id="homeaddrcity" name="homeaddrcity" value="${homeCity}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City])}" errornumbers="21400059|21400062" type="text" />
	            /*{call autocomplete.createAutoComplete({
						name: "homeaddrcity",
						id: "homeaddrcity",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.City]),
						errornumbers : "21400059|21400062",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: homeCity,
						source: this.data.regHomeDetailsAutocomplete.autocompleteCityNameResult

				 })/}*/
	          </li>

	          //{if homeState!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="11" class="{if homeState != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="homeaddrstate">${label.State} <span class="mandatory">*</span></label>
	            /*<input id="homeaddrstate" name="homeaddrstate" value="${homeState}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State])}" errornumbers="21400059|21400062" type="text" >*/
	            {call autocomplete.createAutoComplete({
						name: "homeaddrstate",
						id: "homeaddrstate",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.State]),
						errornumbers : "21400059|21400062",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: homeState,
						source: usaCountryDetails,
						datastatesel:"select-state"

				 })/}
	          </li>

			  //{if homeZip!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="12" class="{if homeZip != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="homeaddrzip">${label.ZipCode} <span class="mandatory">*</span></label>
	            <input id="homeaddrzip" name="homeaddrzip" value="${homeZip}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode])}" errornumbers="21400059|21400061" type="text" />
	            /*{call autocomplete.createAutoComplete({
						name: "homeaddrzip",
						id: "homeaddrzip",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.ZipCode]),
						errornumbers : "21400059|21400061",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: homeZip,
						source: this.data.regHomeDetailsAutocomplete.autocompletePostalCodeResult

				 })/}*/
	          </li>

			  //{if homeCuntry!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="7" class="{if homeCuntry != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="homeaddrcuntry" >${label.Country} <span class="mandatory">*</span></label>
	            /*<input id="homeaddress5" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Country])}" errornumbers="21400059" datacountrysel="select-country" type="text" >*/
	            {call autocomplete.createAutoComplete({
						name: "homeaddrcuntry",
						id: "homeaddrcuntry",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.HomeAddr,label.Country]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: homeCuntry,
						source: countryDetails,
						datacountrysel:"select-country"

				})/}
	          </li>

	        </ul>
      		</section>

      		/*dest address details*/
			<section class="${destReq}">
	        <header>
	          <h2 class="subheader"> <span>${label.DestInfo}</span>
	            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="destaddress01"><span>Toggle</span></button>
	          </h2>
	        </header>
	        <ul class="input-elements" id="destaddress01">
	          //{if destStret!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="9" class="{if destStret != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="destaddrstreet">${label.Street} <span class="mandatory">*</span></label>
	            /*<input id="destaddrstreet" name="destaddrstreet" value="${destStret}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Street])}|state:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Street])}" errornumbers="21400059|213002228" type="text" />*/
	            {call autocomplete.createAutoComplete({
						name: "destaddrstreet",
						id: "destaddrstreet",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Street])+'|state:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Street]),
						errornumbers : "21400059|213002228",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: destStret,
						source: this.data.regDestDetailsAutocomplete.autocompleteDeststreetResult,
						selectFn: {fn:"copyFromOtherPaxDestDetal",scope:this},
						fromField:"street"

				 })/}
	          </li>

	          //{if destCity!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="10" class="{if destCity != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="destaddrcity">${label.City} <span class="mandatory">*</span></label>
	            <input id="destaddrcity" name="destaddrcity" value="${destCity}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City])}" errornumbers="21400059|21400062" type="text" />
	            /*{call autocomplete.createAutoComplete({
						name: "destaddrcity",
						id: "destaddrcity",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.City]),
						errornumbers : "21400059|21400062",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: destCity,
						source: this.data.regDestDetailsAutocomplete.autocompleteCityNameResult

				 })/}*/
	          </li>

	          //{if destState!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="11" class="{if destState != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="destaddrstate">${label.State} <span class="mandatory">*</span></label>
	            /*<input id="destaddrstate" name="destaddrstate" value="${destState}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State])}" errornumbers="21400059|21400062" type="text" >*/
	             {call autocomplete.createAutoComplete({
						name: "destaddrstate",
						id: "destaddrstate",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State])+'|alpha:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.State]),
						errornumbers : "21400059|21400062",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: destState,
						source: usaCountryDetails,
						datastatesel:"select-state"

				 })/}
	          </li>

			  //{if destZip!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="12" class="{if destZip != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="destaddrzip">${label.ZipCode} <span class="mandatory">*</span></label>
	            <input id="destaddrzip" name="destaddrzip" value="${destZip}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode])}" errornumbers="21400059|21400061" type="text" />
	            /*{call autocomplete.createAutoComplete({
						name: "destaddrzip",
						id: "destaddrzip",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode])+'|alphanum:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.ZipCode]),
						errornumbers : "21400059|21400061",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: destZip,
						source: this.data.regDestDetailsAutocomplete.autocompletePostalCodeResult

				 })/}*/
	          </li>

			  //{if destCuntry!= ""}displayBlock{else /}displayNone{/if}
            <li data-fieldno="7" class="{if destCuntry != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="destaddrcuntry" >${label.Country} <span class="mandatory">*</span></label>
	            /*<input id="destaddress5" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Country])}" errornumbers="21400059" datacountrysel="select-country" type="text" >*/
	             {call autocomplete.createAutoComplete({
						name: "destaddrcuntry",
						id: "destaddrcuntry",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.DestInfo,label.Country]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: destCuntry,
						source: countryDetails,
						datacountrysel:"select-country"

				})/}
	          </li>

	        </ul>
      		</section>

      		/*Emergency details*/
			<section class="${emerDetReq}">
	        <header>
	          <h2 class="subheader"> <span>${label.EmerContactInfo}</span>
	            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="Emergencydetails01"><span>Toggle</span></button>
	          </h2>
	        </header>
	        <div id="Emergencydetails01">
	        <ul class="emergency-list">
	            <li>

                <label for="declineEmergencyConactDetails">${label.emergencyDetailsLabel}</label>

	              <div>
	                  <div class="onoffswitch">
	                    <input type="checkbox" name="declineEmergencyConactDetails" value="yes" role="button" class="onoffswitch-checkbox" id="declineEmergencyConactDetails" data-role="checkbox" data-aria-controls="Emergencyaddress01" data-aria-expanded="{if emer_declineDetails_flag}false{else /}true{/if}" {if emer_declineDetails_flag}checked="checked"{/if}>
	                    <label class="onoffswitch-label" for="declineEmergencyConactDetails">
	                        <div class="onoffswitch-inner">
                            <div class="onoffswitch-active">${label.yes}</div>
                            <div class="onoffswitch-inactive">${label.no}</div>
	                        </div>
	                        <div class="onoffswitch-switch"></div>
	                    </label>
	                  </div>
	                  </div>
	          	</li>
      		</ul>
	        <ul class="input-elements" style="{if emer_declineDetails_flag}display: none{else /}display: block{/if}" id="Emergencyaddress01">
	          //{if contactName!= ""}displayBlock{else /}displayNone{/if}
            <li class="{if contactName != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="emgrcontactname">${label.ContactName} <span class="mandatory">*</span></label>
	            <input id="emgrcontactname" name="emgrcontactname" value="${contactName}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.ContactName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.ContactName])}" errornumbers="21400059|21400062" type="text" />
	          </li>

	          //{if contactCountry!= ""}displayBlock{else /}displayNone{/if}
            <li class="{if contactCountry != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="emgrcontrycode">${label.CountryCode} <span class="mandatory">*</span></label>
	            /*<input id="contrycode1" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.CountryCode])}" errornumbers="21400059" datacountrysel="select-country" type="text">*/
	            {call autocomplete.createAutoComplete({
						name: "emgrcontrycode",
						id: "emgrcontrycode",
						type: 'text',
						validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.CountryCode]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: contactCountry,
						source: countryDetails,
						datacountrysel:"select-country"

				})/}
	          </li>

	          //{if contactTelePhone!= ""}displayBlock{else /}displayNone{/if}
            <li class="{if contactTelePhone != ""}displayBlock{else /}displayNone{/if}" data-info="address">
	            <label for="emgrtelnumbr">${label.Phone} <span class="mandatory">*</span></label>
	            <input id="emgrtelnumbr" name="emgrtelnumbr" value="${contactTelePhone}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.Phone])}|numeric:${jQuery.substitute(label.ErrorMsg, [label.EmerContactInfo,label.Phone])}" errornumbers="21400059|21400064" type="tel" />
	          </li>

	        </ul>
	        </div>
      		</section>

      		/*For showing nationality edit block details*/
      		<section class="displayNone" id="nationalityEdit">
			<header>
          	<h2 class="subheader"> <span>${label.PassportInfo}</span>
            <button type="button" role="button" class="toggle" data-aria-expanded="true" data-aria-controls="natedit0"><span>Toggle</span></button>
          	</h2>
        	</header>
			<ul class="input-elements" id="natedit0">

			 <li class="nationality">
	            <label for="editnationality">${nationalityLabel.Title}<span class="mandatory">*</span></label>
	            {call autocomplete.createAutoComplete({
					name: "editnationality",
					id: "editnationality",
					type: 'text',
					validators : "req:"+nationalityLabel.Title,
					errornumbers : "21400059",
					autocorrect:"off",
					autocapitalize:"none",
					autocomplete:"off",
					class : "nationalityFieldWidth",
					value: "",
					source: countryDetails,
					datacountrysel:"select-country"
				})/}

		    </li>

	<li data-fieldno="2" class="{if pspFirstName != ""}displayBlock{else /}displayNone{/if}" data-info="pspfirstname">
              <label for="editpspfirstname">${label.FirstName} <span class="mandatory">*</span></label>
              <input id="editpspfirstname" name="editpspfirstname" value="${givenName}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.FirstName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.FirstName])}" errornumbers="21400059|21400062" type="text" />
          </li>
     <li data-fieldno="1" class="{if pspLastName != ""}displayBlock{else /}displayNone{/if}" data-info="psplastname">
              <label for="editpsplastname">${label.LastName} <span class="mandatory">*</span></label>
              <input id="editpsplastname" name="editpsplastname" value="${surName}" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.LastName])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.LastName])}" errornumbers="21400059|21400062" type="text" />
      </li>

      <li data-fieldno="6" class="pspnumber {if pspNum != ""}displayBlock{else /}displayNone{/if}">
            <label for="editpspnumber">${label.PassportNbr}<span class="mandatory">*</span></label>
            <input id="editpspnumber" name="editpspnumber" autocorrect="off" value="" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr])}|alphanum:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.PassportNbr])}" errornumbers="21400059|21400061" type="text" />
            </li>

		//{if pspIssueDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="13" class="{if pspIssueDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="datIssue_0" data-info="pspissuedate">
              <label for="editpspissuedate">${label.issueDate}<span class="mandatory">*</span></label>
              <input value="{if pspExpDate == ""}${currentDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
              <input val="datIssue_0" value="{if pspExpDate == ""}${currentDate}{/if}" data-errLbl="${label.PassportInfo}" pax="${paxType}" id="editpspissuedate" name="editpspissuedate" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
            </li>

			//{if pspExpDate != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="14" class="pspexpdt {if pspExpDate != ""}displayBlock{else /}displayNone{/if}" data-is-date-li="ed_0" data-info="pspexpdt">
            <label for="editpspexpdt">${label.ExpDate}<span class="mandatory">*</span></label>
            <input value="{if pspExpDate == ""}${currentDate}{/if}" type="date" {if this.dateSupportByBrowser == false}readonly="readonly"{/if} />
            <input val="ed_0" name="editpsp_exp" doc="passport" value="{if pspExpDate == ""}${currentDate}{/if}" id="editpspexpdt" autocorrect="off" autocapitalize="none" autocomplete="off" type="hidden" />
          	</li>

	  //{if pspIssueCity != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="10" class="{if pspIssueCity != ""}displayBlock{else /}displayNone{/if}" data-info="pspissuecity">
              <label for="editpspissuecity">${label.City} <span class="mandatory">*</span></label>
              <input id="editpspissuecity" name="editpspissuecity" value="" autocorrect="off" autocapitalize="none" autocomplete="off" validators="req:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.City])}|alpha:${jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.City])}" errornumbers="21400059|21400062" type="text" />
          </li>

      <li data-fieldno="15" class="pspissueath {if pspIssueAth != ""}displayBlock{else /}displayNone{/if}">
            <label for="editpspissueath">${label.documentIssuingCountry}<span class="mandatory">*</span></label>
            /*<input id="pspissueath" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.CountryOfIssue])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
						name: "editpspissueath",
						id: "editpspissueath",
						type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.documentIssuingCountry]),
            errornumbers : "21400059",
            autocorrect:"off",
            autocapitalize:"none",
            autocomplete:"off",
            value: "",
            source: countryDetails,
            datacountrysel:"select-country"

      })/}
            </li>

 	//{if pspIssueCntry != ""}displayBlock{else /}displayNone{/if}
      <li data-fieldno="7" class="pspissuecntry {if pspIssueCntry != ""}displayBlock{else /}displayNone{/if}">
            <label for="editpspissuecntry">${label.Country}<span class="mandatory">*</span></label>
            /*<input id="pspissuecntry" autocorrect="off" autocapitalize="none" autocomplete="off" datacountrysel="select-country" validators="req:jQuery.substitute(label.ErrorMsg, [label.OtherDocInfo,label.Country])" errornumbers="21400059" type="text">*/
            {call autocomplete.createAutoComplete({
            name: "editpspissuecntry",
            id: "editpspissuecntry",
            type: 'text',
            validators : 'req:'+jQuery.substitute(label.ErrorMsg, [label.PassportInfo,label.Country]),
						errornumbers : "21400059",
						autocorrect:"off",
						autocapitalize:"none",
						autocomplete:"off",
						value: "",
						source: countryDetails,
						datacountrysel:"select-country"

			})/}
            </li>

			</ul>
			</section>

		</span>
    </article>

	<footer class="buttons">
		<button type="submit" class="validation {if this.data.regPageLandingPaxIndex==selectedCPR.custtoflight.length-1}displayBlock{else /}displayNone{/if}" id="continueButton">${label.Continue}</button>
		<button type="submit" class="validation {if this.data.regPageLandingPaxIndex<selectedCPR.custtoflight.length-1}displayBlock{else /}displayNone{/if}" id="nextButton">${label.Next}</button>
		<button type="button" {on click "onPrevious"/} class="validation previousButton {if this.data.regPageLandingPaxIndex==0}disabled{/if}" {if this.data.regPageLandingPaxIndex==0}disabled="disabled"{/if} id="previousButton">${label.Previous}</button>
		<button type="button" {on click "onBackClick"/} class="validation cancel">${label.Cancel}</button>
	</footer>

  </form>
</section>
</div>
   {/macro}
{/Template}
