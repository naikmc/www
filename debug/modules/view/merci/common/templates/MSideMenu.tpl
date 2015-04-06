{Template {
  $classpath: 'modules.view.merci.common.templates.MSideMenu',
  $css: ['modules.view.merci.common.templates.MSideMenuStyle']
}}

	{macro main()}
		// for binding
		{if jsonResponse.ui == null}
			${jsonResponse.ui = {}|eat}
		{/if}
		
		{section {
			id : "menuHolder",
			macro : "createNavBar",
			type: 'div',
			bindRefreshTo : [{
				to : 'navbarFlag',
				inside : jsonResponse.ui,
				recursive : true
			}]
		}/}
		
	{/macro}
	
	{macro createNavBar()}
		{@html:Template {
			classpath: "modules.view.merci.common.templates.MIndexPage",
			moduleCtrl: {
				classpath:"modules.view.merci.segments.booking.controller.MerciBookingCtrl"
			}, 
			data:{
				fromMenu: true
			}
		}/}
	{/macro}
{/Template}