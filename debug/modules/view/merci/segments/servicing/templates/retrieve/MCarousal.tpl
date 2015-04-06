{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MCarousal",
  $hasScript: true,
  $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

{macro main()}

<article class="panel trip arrival" style="z-index:1;">
<header><h1 id="tripPhotos">Trip Photos</h1></header>

		{if pageObjCarousal.jsonPhotos != null && pageObjCarousal.jsonPhotos != undefined && pageObjCarousal.jsonPhotos != ""}
			<div class="touchslider" style="min-height:device-height;">
			    <div class="touchslider-viewport" style="width:90%;height:100%;margin:0 auto;">
					<div class="trip-gallery">
					</div>
				</div> 
			</div>

			<div class="touchslider-nav">
			</div>
		{else/}
			<div class="touchslider" style="min-height:device-height;">
				<div class="touchslider-viewport" style="width:90%;height:100%;margin:0 auto;">
					<div class="trip-gallery">
					</div>
				</div>
			</div>
		{/if}
</article>

{/macro}

{/Template}