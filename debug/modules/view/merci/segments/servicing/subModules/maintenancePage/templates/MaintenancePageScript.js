Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.maintenancePage.templates.MaintenancePageScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
	$constructor: function() {},
	$prototype: {

		$dataReady: function() {
			var headerInfo = this.moduleCtrl.getHeaderInfo();
			this.moduleCtrl.setHeaderInfo(headerInfo);
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MaintenancePage",
						data:{}
					});
			}
		}
	}
});