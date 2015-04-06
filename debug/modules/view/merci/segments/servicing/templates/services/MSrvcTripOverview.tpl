{Template{
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MSrvcTripOverview',
	$hasScript: true
}}

  {macro main()}
	<div class="tripOverviewPanel">
		{var labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels/}
		{var siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam/}
		{var globalList = this.moduleCtrl.getModuleData().booking.MCONF_A.globalList/}
		{var rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam/}

		{@html:Template {
			classpath: "modules.view.merci.segments.booking.templates.farereview.MConfConn",
			data: {
				'labels': labels,
				'rqstParams': rqstParams,
				'siteParams': siteParams,
				'globalList': globalList,
				'fromPage':'CONF'
			}
		}/}
	</div>

	<div class = "insurancePanel">
	{if this.utils.booleanValue(this.moduleCtrl.getModuleData().MServicesCatalog.config.insuranceInServiceFlow)}
        {@html:Template {
          classpath: "modules.view.merci.segments.servicing.templates.retrieve.MInsurance",
		  data:{'lastName': this.moduleCtrl.getModuleData().MServicesCatalog.request.DIRECT_RETRIEVE_LASTNAME},
          block: true
        }/}
		{/if}
	</div>

  {/macro}

{/Template}