Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.conf.MInstallmentDetailScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {


	}
});