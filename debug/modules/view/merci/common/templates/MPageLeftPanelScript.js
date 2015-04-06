Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MPageLeftPanelScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],


	$prototype: {

		$viewReady: function() {
			if (this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams != undefined) {
				var leftPanel = this.moduleCtrl.getModuleData().panelParams.LEFT_PANEL;
				if (leftPanel != "" && leftPanel != undefined && leftPanel.CONTENT != undefined) {
					$('#leftPanel').addClass('templateBodyLeft');
				}
			}
		}
	}
});