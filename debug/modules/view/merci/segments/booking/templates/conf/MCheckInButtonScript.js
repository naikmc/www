Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.booking.templates.conf.MCheckInButtonScript",
    $dependencies: [
        'modules.view.merci.common.utils.MCommonScript'
    ],

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
    },

    $prototype: {
        isCheckinEnabled: function(segment) {
            var d1 = new Date(segment.beginDateGMT);
            var timeToDeparture = d1.getTime() / 1000;
            var d2 = new Date();
            var currTime = d2.getTime() / 1000;
            timeToDeparture = (timeToDeparture - currTime) / 3600;
            var timeFrame = 0;
            if (!this.utils.isEmptyObject(this.data.config.checkinTimeFrame) && this.data.config.checkinTimeFrame != "") {
                timeFrame = Number(this.data.config.checkinTimeFrame);
            }
            return this.utils.booleanValue(this.data.config.allowCheckin) && (timeToDeparture <= timeFrame);
        },
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MCheckInButton",
						data:this.data
					});
			}
		}
    }
});