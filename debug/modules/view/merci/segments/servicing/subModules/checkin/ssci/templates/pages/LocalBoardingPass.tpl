{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.LocalBoardingPass',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common',
    autocomplete : 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
  },
  $hasScript : true
}}
  
  {macro main()}

	<div class='sectionDefaultstyle sectionDefaultstyleSsci sectionBoardingpassSpecific'>
		<div class="popup input-panel" style="display: none;" id="SharingPopup">
			<article class="panel email">
				<header>
					<hgroup>
						<h1><strong></strong></h1>
					</hgroup>
				</header>

					<section id = "shareEmail" style="display: none;">
						<div id="shareNotEmail"></div>

						<label>${label.tx_merci_text_mailA_from}:</label>
						<ul class="services-pax selectable">
							<ul class="input-elements" id="ul1" data-aria-expanded="true">
								<input name="FROM"  id="travellerFromEmail" type="text" placeholder=${label.tx_merci_text_sm_mail_from_placeholder} >
							</ul>
						</ul>
						<label>${label.tx_merci_text_mailA_to}:</label>
						<ul class="services-pax selectable">
							<ul class="input-elements" id="ul1" data-aria-expanded="true">
								<input name="TO" id="travellerToEmail" type="text" placeholder=${label.tx_merci_text_sm_mail_to_placeholder}>
							</ul>
						</ul>
						<small>${label.tx_merci_text_sm_mail_to_info}</small>
						<li></li><li></li>
						<textarea name="SUBJECT" id="subjectInput" cols="" rows="" class="subject" style="display:none;"readonly></textarea>
						<textarea name="BODY" style="width:100%;height:100px;" id="emailta"></textarea>
					</section>
					<footer id = "shareEmailButton"class="buttons">
						<!-- <button type="button" class="validation cancel" {on click {fn:'cancelEmailShare', args: {}}/} >${label.tx_merci_text_mail_btncancel}</button> -->
						<button type="button" class="validation cancel" {on click {fn:'cancelEmailShare', args: {}}/}> ${label.tx_merci_text_mail_btncancel}</button>
				  		<button type="button" class="validation" {on click {fn:'sendEmailShare', args: {}}/}>${label.tx_merci_text_mail_btnsend}</button>
					</footer>

					<section id = "shareSMS" style="display: none;">

						<div id="shareNotSMS"></div>
						<label>${label.tx_merci_text_mailA_to} :</label>
						<ul class="services-pax selectable">
							<ul class="input-group contact" id="ul1" data-aria-expanded="true">
								<li class="width_36">
									//<input id="travellerAreaCode" type="text" >
									{call autocomplete.createAutoComplete({
												name: "travellerAreaCode",
												id: "travellerAreaCode",
												type: 'text',
												autocorrect:"off",
												autocapitalize:"none",
												autocomplete:"off",
												placeholder:"0033",
												source: this.label.countryList,
												maxlength:4,
												selectCode : true

										  })/}
								</li>
								<li class="width_64">
									<input id="travellerPhoneNo" type="text"  placeholder=${label.tx_merci_text_booking_alpi_phone_number}>
								</li>
							</ul>
						</ul>
						<li></li><li></li>
						<textarea style="width:100%;height:100px;" id="smsta"></textarea>
					</section>
					<footer id = "shareSMSButton" class="buttons">
						 <!-- <button type="button" class="validation cancel" {on click {fn:'cancelEmailShare', args: {}}/} >${label.tx_merci_text_mail_btncancel}</button> -->
						<button type="button" class="validation cancel" {on click {fn:'cancelSMSShare', args: {}}/}> ${label.tx_merci_text_mail_btncancel}</button>
				  		<button type="button" class="validation" {on click {fn:'sendSMSShare', args: {}}/}>${label.tx_merci_text_mail_btnsend}</button>
					</footer>
			</article>
		</div>

	<div id="localBoardingWarnMsg">
    </div>

	<article class="carrousel-full" >
		<h1 data-flightinfo="route" data-location="#"></h1>
		{var headName ="" /}
		{var totalListTracker=-1 /}

		<ul id="listboxa">
		{foreach deliveredDocument in this.boardingPasses}

			{set totalListTracker+=1 /}
			{set headName =  deliveredDocument.customerName /}
			{if deliveredDocument.formattedDocument.content=="" || deliveredDocument.formattedDocument.content=="text/html"}
				{var encodedHTMLData= String.fromCharCode.apply(null, deliveredDocument.formattedDocument.base64Binary)/}
			{else/}
				{var encodedHTMLData = deliveredDocument.formattedDocument.content /}
			{/if}
			{var encodedHTMLData= deliveredDocument.formattedDocument.content /}
			  <li class="boardingindex">
		      <article class="carrousel-full-item" data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">
		      ${encodedHTMLData|escapeForHTML:false}

		      	{var boolPassBook = false /}
		      	{var ver = this.findIOSVersion()/}
			  	{var versionTrue = false /}
				{if typeof ver !== "undefined" && ver[0]>=6}
				  {set versionTrue = true/}
				{/if}
			  	{if aria.core.Browser != null && aria.core.Browser.isIOS != null && versionTrue && parameters.SITE_SSCI_PSSBK_FRMT_CD && parameters.SITE_SSCI_PSSBK_FRMT_CD.trim() != ""}
					{set boolPassBook = true /}
			  	{/if}
			  	{if boolPassBook == true}
				   <ul class="btnInPanel">
				   <ul class="sliderBtns passbooksliderBtns">
				        <li class="secondary">
				        <a{on click {fn : "addToPass",args : {productID: deliveredDocument_index,adultProdId: deliveredDocument.infantsAdultProdId}} /} >
				          <span id=passbookImage></span>${label.addToPassbook}
				        </a>
				        </li>
		     	   </ul>
		     	   </ul>
		      		//<button class="secondary passbookButton" {on click {fn : "addToPass", args : {productID: deliveredDocument_index,adultProdId: deliveredDocument.infantsAdultProdId} } /}>${label.addToPassbook}</button>
			  	{/if}
			  	
		      </article>
		      </li>
		      
		{/foreach}
		</ul>
	    
	    <footer>
	      <ul id = "Indicator_details">
	      </ul>
	    </footer>

	 </article>
	<footer class="buttons">
      <button type="button" class="validation cancel" {on click "onBackClick"/}>${label.Cancel}</button>
    </footer>
	 <div class="popupBGmask" class="displayNone">&nbsp;</div>
	</div>
  
  {/macro}
{/Template}
