Aria.classDefinition({
	$classpath: 'modules.view.merci.common.controller.MerciPopupCtrl',
	$extends: 'modules.view.merci.common.controller.MerciCtrl',
	$implements: ['modules.view.merci.common.interfaces.IMerciPopupCtrlInterface'],
	$constructor: function(args) {
		this.$ModuleCtrl.constructor.call(this);
	},

	$prototype: {

		$publicInterfaceName: 'modules.view.merci.common.interfaces.IMerciPopupCtrlInterface'

	}
});