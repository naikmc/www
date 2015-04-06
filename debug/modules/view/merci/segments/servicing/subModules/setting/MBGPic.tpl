{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.setting.MBGPic',
	$macrolibs: {
		common: 'modules.view.merci.common.utils.MerciCommonLib'
	},
	$hasScript: true
}}

	{macro main()}
			{section {
				id: 'changeBackgroundPage',
				macro: 'loadContent',
				type: 'div',
			classList: ['container'],
			bindRefreshTo: [{
				inside: this.data,
				to: 'printUI'
			}]
			}/}
	{/macro}

	{macro loadContent()}
		{if this.data.printUI == true}
		{var imageURL = this.data.appBackgroundImageURL /}
		{var bgImageList = this.data.appBackgroundImageListArray /}
		<div>
			<div>
				<section>
					<div id="appBackgrounds" class="swipeholder">
						<div class="carrousel-header">
							<div  {id 'bgChange_dynaScroller' /} class="carrousel-content Dynamic background" style="overflow: hidden;"><ol id="bgChange_olScroll" style="height:100%;">
								{foreach image in bgImageList}
											{var imageSrc = imageURL + bgImageList[parseInt(image_index)] /}<li id="bgChange_liScroll_${parseInt(image_index)}" class="bgChangeScroll_li"><img src="${imageSrc}" alt="${bgImageList[parseInt(image_index)]}">
										</li>{/foreach}</ol></div>
						</div>						
						{call common.createDynaCrumbs('bgChange',bgImageList.length)/}
						
					</div>		  
					<footer class="buttons footer bgoptions">
							<button type="submit" class="validation" id="btnConfirm" {on click {fn:'onSaveBackground', scope: this}/}> ${this.json.labels.tx_merciapps_lbl_save}</button>
							<button type="button" class="validation cancel" id="backbtn" {on click {fn:'goBack', scope: this.moduleCtrl}/}> ${this.json.labels.tx_merci_text_mail_btncancel}</button>
					</footer>
				</section>
			</div>
		</div>
			${aria.utils.Json.setValue(this.data, 'printUI', false)|eat}
		{/if}
	{/macro}
{/Template}