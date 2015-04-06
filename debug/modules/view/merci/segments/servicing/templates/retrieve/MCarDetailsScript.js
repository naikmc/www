Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MCarDetailsScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		pageObj = this;
	},

	$prototype: {

		$dataReady: function() {
			if (this.utils.isRequestFromApps() == true) {
				var jsonMTrip = this.moduleCtrl.getModuleData();
				this.mTrip = jsonMTrip.flowFromTrip;
				this.key = jsonMTrip.pnr_Loc;

				if (this.mTrip != "mTrips") {
					if(this.moduleCtrl.getModuleData().booking && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MCarDetails){
						pageObj.model = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MCarDetails
					}
					else{
						pageObj.model = this.moduleCtrl.getModuleData().MCarDetails;
					}
					pageObj.storage = false;
				} else {
					pageObj.model = pageObjBooking.MCarDetails;
					pageObj.storage = true;
				}
			} else {
				if(this.moduleCtrl.getModuleData().booking && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MCarDetails){
					pageObj.model = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MCarDetails
				}else{
					pageObj.model = this.moduleCtrl.getModuleData().MCarDetails;
				}				
				pageObj.storage = false;
			};
			this.config = pageObj.model.config;
			this.labels = pageObj.model.labels;
			this.tripplan = pageObj.model.reply.tripplan;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MCarDetails",
						data:{}
					});
			}
		}
	}
});