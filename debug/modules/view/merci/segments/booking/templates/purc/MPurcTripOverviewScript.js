Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcTripOverviewScript',
	$constructor: function() {

	},
	$prototype: {
		$dataReady: function() {

			// get purchase page data
			this.data.labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels;
			this.data.siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
			this.data.globalList = this.moduleCtrl.getModuleData().booking.MPURC_A.globalList;
			this.data.rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPurcTripOverview",
						data:this.data
					});
			}
		}
	}
});