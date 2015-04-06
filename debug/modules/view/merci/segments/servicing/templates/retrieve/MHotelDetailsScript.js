Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MHotelDetailsScript",
    $dependencies: [
        'modules.view.merci.common.utils.MCommonScript'
    ],

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
    },

    $prototype: {

        $dataReady: function() {

            if (this.utils.isRequestFromApps() == true) {
                var jsonMTrip = this.moduleCtrl.getModuleData();
                this.mTrip = jsonMTrip.flowFromTrip;
                this.key = jsonMTrip.pnr_Loc;

                if (this.mTrip != "mTrips") {
                    if(this.moduleCtrl.getModuleData().booking && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MHotelDetails){
						pageObj.model = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MHotelDetails
					}else{
						pageObj.model = this.moduleCtrl.getModuleData().MHotelDetails;
					}
                    pageObj.storage = false;
                } else {
                    pageObj.model = pageObjBooking.MHotelDetails;
                    pageObj.storage = true;
                }
            } else {
                if(this.moduleCtrl.getModuleData().booking && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MHotelDetails){
                    pageObj.model = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MHotelDetails
                }else{
					pageObj.model = this.moduleCtrl.getModuleData().MHotelDetails;
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
						tpl:"MHotelDetails",
						data:{}
					});
			}
		},

        showDescFromProvider: function(ptyInfo) {
            return this.utils.booleanValue(this.config.displayProviderRate) && ptyInfo.chainAccessLevel === '+';
        }

    }
});