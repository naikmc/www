Aria.classDefinition({
	$classpath: 'modules.view.merci.segments.servicing.controller.MerciServicingCtrl',
	$extends: 'modules.view.merci.common.controller.MerciCtrl',
	$implements: ['modules.view.merci.segments.servicing.controller.IMerciServicingCtrl'],
	$dependencies: [
		'aria.utils.HashManager', 
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function(args) {
		this.$ModuleCtrl.constructor.call(this);
	},
	$prototype: {
		$publicInterfaceName: 'modules.view.merci.segments.servicing.controller.IMerciServicingCtrl',

		init: function(args, initReadyCb) {

			// initialization
			if (this.data == null) {
				this.data = {};
			}

			// if data default available
			if (jsonResponse != null && jsonResponse.data != null) {
				this.data = jsonResponse.data;
			}
			
            this.__header = {};
            this.__currConverter = {};
			this.$callback(initReadyCb);
		},

		setModuleData: function(data) {
			this.data = data;
		},

		getModuleData: function() {
			return this.data;
		},

		raiseEvent: function(evt) {
			this.$raiseEvent(evt);
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
		},

		convertAircraftNameToJSON: function(array) {
			var output = {};
			for (var i = 0; i < array.length; ++i) {
				output[array[i][0]] = array[i][1];
			}
			return output;
		}
	}
});