{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcTripOverview'
}}

  {macro main()}
	<div class="tripOverviewPanel">
		
		{var labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels/}
		{var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam/}
		{var globalList = this.moduleCtrl.getModuleData().booking.MPURC_A.globalList/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam/}
		
		{@html:Template {
			classpath: "modules.view.merci.segments.booking.templates.farereview.MConfConn",
			data: {
				'labels': labels,
				'rqstParams': rqstParams,
				'siteParams': siteParams,
				'globalList': globalList,
				'fromPage':'PURC_TRIP_OVERVIEW'
			}
		}/}
	</div>
  {/macro}

{/Template}