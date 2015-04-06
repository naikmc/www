Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MSrvcTripOverviewScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {
		$dataReady: function() {

			// get purchase page data
			this.data.labels = this.moduleCtrl.getModuleData().booking.MCONF_A.labels;
			this.data.siteParams = this.moduleCtrl.getModuleData().booking.MCONF_A.siteParam;
			this.data.globalList = this.moduleCtrl.getModuleData().booking.MCONF_A.globalList;
			this.data.rqstParams = this.moduleCtrl.getModuleData().booking.MCONF_A.requestParam;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSrvcTripOverview",
						data:this.data
					});
			}
		}
	}
});