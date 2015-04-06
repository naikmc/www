/**
 * Cmtng module controller interface
 */
Aria.interfaceDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.flightstatus.controller.IFlightStatusModuleCtrl',
	$extends: "modules.view.merci.segments.servicing.controller.IMerciServicingCtrl",
	$interface: {
		convertAircraftNameToJSON: function(array) {}
	}
});