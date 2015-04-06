{Template {
  $classpath: 'modules.view.merci.common.templates.MerciTabletNavigation',
  $hasScript: true
}}
	
	{macro main()}
		<nav class="navigation tablet">
			<ul>
				<li class="tablet"> <a href="javascript:void(0)" class="navigation home-link selected" {on click {fn: 'navigateHome'}/}>Home</a></li>
				<li class="handheld"> <a href="javascript:void(0)" class="navigation book-flight" {on click {fn:'navigateBooking'}/}>Book flight</a></li>
				<li class="tablet"> <a href="javascript:void(0)" class="navigation book-flight tabletBut" {on click {fn:'showBooking'}/}>Book flight tablet</a></li>
				<li> <a href="javascript:void(0)" class="navigation fare-deals"><span class="clientElement">Fare deals</span><span class="baselineText">Deals and Offers</span></a> </li>
				<li> <a href="javascript:void(0)" class="navigation my-trip">My trip</a> </li>
				<li> <a href="javascript:void(0)" class="navigation flight-status">Flight status</a> </li>
				<li> <a href="javascript:void(0)" class="navigation timetable">Timetable</a> </li>
				<li> <a href="javascript:void(0)" class="navigation contact">Contact us</a> </li>
				<li> <a href="javascript:void(0)" class="navigation faq">FAQ</a> </li>
				<li> <a href="javascript:void(0)" class="navigation more">More</a> </li>
			</ul>
		</nav>
	{/macro}
	
{/Template}