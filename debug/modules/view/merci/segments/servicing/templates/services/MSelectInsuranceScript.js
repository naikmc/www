/**
 * @fileOverview used to display insurance selection page in servicing flow
 * @author Ksalicheemala
 */
Aria.tplScriptDefinition({
    $classpath: 'modules.view.merci.segments.servicing.templates.services.MSelectInsuranceScript',
    $dependencies: [
        'modules.view.merci.common.utils.MCommonScript'
    ],

    /**
     * @constructor
     */
    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
    },

    $prototype: {
        //Function used to load model and request parameters on data ready
        $dataReady: function() {
            var model = this.moduleCtrl.getModuleData().MSelectInsurance;
            this.requestParam = model.requestParam;
        },
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSelectInsurance",
						data:{}
					});
			}
		},

        //Function used to navigate to Purchase screen
        goToPurchasePage: function() {
            var formElmt = document.getElementById(this.$getId("MInsuranceForm"));
            this.utils.sendNavigateRequest(formElmt, 'MConfirmInsurance.action', this);

        },

        //Function used to navigate back to Retreive PNR page on click of Cancel button
        backToTrip: function() {
            var params = {
                DIRECT_RETRIEVE_LASTNAME: this.requestParam.DIRECT_RETRIEVE_LASTNAME,
                REC_LOC: this.requestParam.recLoc,
                DIRECT_RETRIEVE: "true",
                JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
                ACTION: "MODIFY",
                PAGE_TICKET: this.requestParam.reply.pageTicket
            };
            this.utils.sendNavigateRequest(params, 'MPNRValidate.action', this);
        }

    }
});