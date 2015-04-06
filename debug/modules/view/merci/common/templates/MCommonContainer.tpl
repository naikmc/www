{Template{
  $classpath:"modules.view.merci.common.templates.MCommonContainer",
	$hasScript: true
}}

  {macro main()}

      {@embed:Placeholder {
        name: "headerPanel"
      }/}

   <span  class="leftPanel" id="leftPanel">
     {@embed:Placeholder {
        name: "leftPanel"
      }/}
   </span>
    <div class="container">

      {@embed:Placeholder {
          name: "topPanel"
        }/}

			{@embed:Placeholder {
				name: "header"
			}/}

			{@embed:Placeholder {
				name: "body"
			}/}
			

			{@embed:Placeholder {
				name: "footer"
			}/}

        {@embed:Placeholder {
          name: "bottomPanel"
        }/}

    </div>
   <span class="rightPanel" id="rightPanel">
			{@embed:Placeholder {
				name: "rightPanel"
			}/}
   </span>
    {@embed:Placeholder {
        name: "footerPanel"
      }/}

		
		// popup div for showing html content
		<div class="popup" id="htmlContainer" style="display: none;">
			<div id="htmlPopup">
					
			</div>
			<button type="button" class="close" {on click {fn:'closePopup'}/}><span>Close</span></button>
		</div>
  {/macro}

{/Template}