Aria.classDefinition({
	$classpath: 'modules.view.merci.segments.booking.controller.MerciBookingCtrl',
	$extends: 'modules.view.merci.common.controller.MerciCtrl',
	$implements: ['modules.view.merci.segments.booking.controller.IMerciBookingCtrl'],
	dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'aria.utils.HashManager',
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function(args) {
		this.$ModuleCtrl.constructor.call(this);
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$publicInterfaceName: 'modules.view.merci.segments.booking.controller.IMerciBookingCtrl',

		init: function(args, initReadyCb) {

			// init
			this.__initData();
			this.$callback(initReadyCb);
		},

		__initData: function() {

			// if data default available
			if (jsonResponse != null && jsonResponse.data != null) {
				this.data = jsonResponse.data;
			}

			// setting default
			this.__header = {};
			this.__currConverter = {};
		},

		hideMskOverlay: function() {
			// common method to hide overlay from UI
			modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
		},

		closePopup: function(args, data) {
			// common method to close any popup element
			modules.view.merci.common.utils.MCommonScript.closePopup();
		},

		openHTML: function(args, data) {
			// common method to show any external HTML content
			modules.view.merci.common.utils.MCommonScript.openHTML(data);
		},
		
		openURLHTML: function(args,data){
			modules.view.merci.common.utils.MCommonScript.openURLHTML(data);
		},

		showMskOverlay: function() {
			// common method to show overlay
			modules.view.merci.common.utils.MCommonScript.showMskOverlay();
		},

		getModuleData: function() {

			if (this.data == null) {
				// init
				this.__initData();
			}

			return this.data;
		},

		setValueforStorage: function(n, m) {
			aria.utils.Json.setValue(this.data, m, n);
		},

		getValuefromStorage: function(n) {
			return (this.data[n]);
		},

		getParam: function(name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return decodeURIComponent(name[1]);
		},

		setFooterInfo: function() {
			// if data default available
			if (jsonResponse != null && jsonResponse.data != null) {
				this.response = jsonResponse.data.footerJSON;
				return this.response;
			}
		}
	}
});