{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MCheckInButton',
	$hasScript: true
}}
	{macro main()}
		<nav class="buttons">
		<ul>
		 {var isEligible = false /}
		 {if !this.utils.isEmptyObject(this.data.tripplan.itineraries)}
      {foreach itinerary inArray this.data.tripplan.itineraries}
        {foreach segment2 inArray  itinerary.segments}
        {if this.isCheckinEnabled(segment2) && isEligible == false}
         {set isEligible = true /}
         <li><a href="javascript:void(0)" class="navigation checkin">
         ${this.data.labels.tx_merci_text_air_check_in}
         </a></li>
        {/if}
        {/foreach}
      {/foreach}
     {/if}
	  </ul>
		</nav>
	{/macro}
{/Template}