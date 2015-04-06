Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MPageRightPanelScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],


	$prototype: {

		$viewReady: function() {
			if (this.moduleCtrl.getModuleData().panelParams != "" && this.moduleCtrl.getModuleData().panelParams != undefined) {
				var rightPanel = this.moduleCtrl.getModuleData().panelParams.RIGHT_PANEL;
				var leftPanel = this.moduleCtrl.getModuleData().panelParams.LEFT_PANEL;
				var bothExists = false;
				if (rightPanel != "" && rightPanel != undefined && rightPanel.CONTENT != undefined) {
					$('#rightPanel').addClass('templateBodyRight');
					$('.container').addClass('rightExists');
					if (leftPanel != "" && leftPanel != undefined && leftPanel.CONTENT != undefined) {
						$('.container').removeClass('rightExists leftExists').addClass('bothExists');
						bothExists = true;
					}
				} else if (!bothExists && leftPanel != "" && leftPanel != undefined && leftPanel.CONTENT != undefined) {
					$('.container').removeClass('rightExists bothExists').addClass('leftExists');
				}
			}
		}
	}
});