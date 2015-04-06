{Template {
		$classpath: 'modules.view.merci.common.templates.MTabletNavigation',
		$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
		$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
		$hasScript: true
}}

	{var searchTpl = false/}
	{var tripsTpl = false/}
	{var timeTableTpl = false/}
	{var contactUsTpl = false/}
	{var includeTpls = false/}

	{macro main()}

		<div class="overlayTablet displayNone" id="overlayTablet"></div>
		<nav class="navigation tablet">
			<ul>
			{foreach buttons inArray this.configParams.customButtons}
       {if this.isHomePage(buttons[3])}
         {var buttonArr = buttons[3].split('-')/}
         {var button = buttonArr[0]/}

				{if (button == 'CHANGELANG' && this.config.ENABLE_CLANG == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation changeLang-link tabletBut" {on click {fn:'onHomeClick',scope: this,args:{cls:'.navigation.home-link.tabletBut'} }/}>Home</a></li>
				{/if}
				{if (button == 'BOOKFLIGHT' && this.config.ENABLE_SEARCH == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation book-flight tabletBut" {on click {fn:"openPopUp", args:{ID:'.booking.sear.tablet.search',cls:'.navigation.book-flight.tabletBut'} } /}>Book flight tablet</a></li>
				{/if}
				{if (button == 'RETRIEVE' && this.config.ENABLE_RETRIEVE == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation my-trip tabletBut" {on click {fn:"openPopUp", args:{ID:'.panel.list.triplist.tablet',cls:'.navigation.my-trip.tabletBut'} } /}>My trip</a> </li>
				{/if}
				{if (button == 'FAREDEALS' && this.config.ENABLE_DEALS == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation fare-deals tabletBut" {on click {fn:"openPopUp", args:{ID:'.dealsListTablet',cls:'.navigation.fare-deals.tabletBut'} } /}>Deals and Offers</a> </li>
				{/if}
				{if (button == 'FLIFO' && this.config.ENABLE_FLIFO == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation flight-status tabletBut" {on click {fn:"openPopUp", args:{ID:'.flightStatus.tablet',cls:'.navigation.flight-status.tabletBut'} } /}>Flight status</a> </li>
				{/if}
				{if (button == 'TIMETABLE' && this.config.ENABLE_TIMETABLE == true)}
					<li class="tablet"> <a href="javascript:void(0);" class="navigation timetable tabletBut" {on click {fn:"openPopUp", args:{ID:'.timetable.tablet',cls:'.navigation.timetable.tabletBut'} } /}>Timetable</a> </li>
				{/if}
				{if (button == 'CONTACTUS' && this.config.ENABLE_CONTACT == true)}
					<li> <a href="javascript:void(0);" class="navigation contact tabletBut" {on click {fn:"openPopUp", args:{ID:'.contact.tablet',cls:'.navigation.contact.tabletBut'} } /}>Contact us</a> </li>
				{/if}
				{if button == 'CUSTOM'}
					<li><a href="${buttons[2]}" class="navigation customIco custom-tablet">${buttons[1]}</a></li>
				{/if}

			  {/if}
       {/foreach}
			</ul>
		</nav>

		{section {
			id: 'tpls',
			macro: {name: 'Templates',args:[this.config.ENABLE_SEARCH,this.config.ENABLE_RETRIEVE,this.config.ENABLE_DEALS,this.config.ENABLE_FLIFO,this.config.ENABLE_TIMETABLE,this.config.ENABLE_CONTACT]}
		}/}

		<div class="overlayTablet" style="display:none"></div>
	{/macro}

	{macro Templates(isSearchEnbl, isRetrieveEnbl, isDealsEnbl, isFlifoEnbl, isTimeTableEnbl, isContactEnbl)}
		// if flag indicates that data is loaded
		{if (this.includeTpls == true)}
			{if isSearchEnbl}
			{section {
				id: 'search',
				macro: {name: 'searchTemplate'}
			}/}
			{/if}

			{if isDealsEnbl}
			{section {
				id: 'deals',
				macro: {name: 'dealsTemplate'}
			}/}
			{/if}
			{if isTimeTableEnbl}
			{section {
				id: 'timeTable',
				macro: {name: 'timeTableTemplate'}
			}/}
			{/if}
			{if isFlifoEnbl}
			{section {
				id: 'flightStatus',
				macro: {name: 'flightStatusTemplate'}
			}/}
			{/if}

			{if isContactEnbl}
			{section {
				id: 'contactUs',
				macro: {name: 'contactUsTemplate'}
			}/}
			{/if}

			{if isRetrieveEnbl}
			{section {
				id: 'trips',
				macro: {name: 'tripsTemplate'}
			}/}
			{/if}
		{/if}
	{/macro}

	{macro searchTemplate()}
		{@html:Template {
			classpath: "modules.view.merci.segments.booking.templates.search.MBookSearch"
		}/}
	{/macro}

	{macro tripsTemplate()}
		{if (this.moduleCtrl.getModuleData().MTripList != null)}
			{@html:Template {
					classpath: "modules.view.merci.segments.servicing.templates.retrieve.MTripList"
			}/}
		{else/}
			{@html:Template {
					classpath: "modules.view.merci.segments.servicing.templates.retrieve.MGetTrip"
			}/}
		{/if}
	{/macro}

	{macro timeTableTemplate()}
		    {@html:Template {
					classpath: "modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableQuery"
			}/}
	{/macro}
	{macro dealsTemplate()}
		{@html:Template {
				classpath: "modules.view.merci.segments.booking.templates.dealsoffers.Deals"
		}/}
	{/macro}

	{macro flightStatusTemplate()}
		{@html:Template {
				classpath: "modules.view.merci.segments.servicing.subModules.flightstatus.templates.MFlightInfoRequest"
		}/}
	{/macro}
	{macro contactUsTemplate()}
		    {@html:Template {
					classpath: "modules.view.merci.segments.servicing.subModules.contactus.templates.MContactUs"
			}/}
	{/macro}
{/Template}