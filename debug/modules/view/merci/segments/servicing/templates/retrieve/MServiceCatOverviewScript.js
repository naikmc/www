Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.templates.retrieve.MServiceCatOverviewScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {
		$dataReady: function() {
			// get service page data
			this.data.labels = this.moduleCtrl.getModuleData().MServicesCatalog.labels;
			this.data.reply = this.moduleCtrl.getModuleData().MServicesCatalog.reply;
			this.data.request = this.moduleCtrl.getModuleData().MServicesCatalog.request;
			this.data.config = this.moduleCtrl.getModuleData().MServicesCatalog.config;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MServiceCatOverview",
						data:this.data
					});
			}
		}
	}
});