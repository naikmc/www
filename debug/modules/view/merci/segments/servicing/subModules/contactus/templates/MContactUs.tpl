{Template{
	$classpath: 'modules.view.merci.segments.servicing.subModules.contactus.templates.MContactUs',
	$css: ['modules.view.merci.segments.servicing.subModules.contactus.templates.MContactUsStyle'],
    $hasScript: true,
	$macrolibs: {		
		tablet: 'modules.view.merci.common.utils.MerciTabletLib'
	}
}}

	{var showUI = false/}

	{macro main()}
		{section {
			id: 'contactUsPage',
			type: 'section',
			macro: 'loadContent'
		}/}
	{/macro}

	{macro loadContent()}
		<article class="panel contact">
			<header>
				<h1>${this.labels.tx_merci_text_callus_contactus}</h1>
			</header>

			<section>
					<p class="location">						
						<input id="selectcountry" name="selectcountry" value="" type="text" autocomplete="off" {on keyup "keyUp"/} {on focus {fn:this.__merciFunc.onInputFocus, args: {id:"selectcountry"}}/} {on blur {fn:this.__merciFunc.onInputBlur, args: {id:"selectcountry"}}/}/><span class="delete hidden" {on click "clearContactField"/} id="delselectcountry"><span class="x">x</span></span>
					</p>

					<div id="contactUsAll"></div>
					<div id="contactUsIndividual"></div>

			</section>
		</article>
	{/macro}
{/Template}