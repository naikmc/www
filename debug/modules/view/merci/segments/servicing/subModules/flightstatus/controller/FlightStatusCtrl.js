Aria.classDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.controller.FlightStatusCtrl',
	$extends: 'modules.view.merci.segments.servicing.controller.MerciServicingCtrl',
	$implements: ["modules.view.merci.segments.servicing.subModules.flightstatus.controller.IFlightStatusModuleCtrl"],

	$constructor: function(args) {
		this.$MerciServicingCtrl.constructor.call(this);
		this.data = {};
	},

	$prototype: {

		$publicInterfaceName: "modules.view.merci.segments.servicing.subModules.flightstatus.controller.IFlightStatusModuleCtrl",

		convertAircraftNameToJSON: function(array) {
			var output = {};
			for (var i = 0; i < array.length; ++i) {
				output[array[i][0]] = array[i][1];
			}
			return output;
		}
	}
});