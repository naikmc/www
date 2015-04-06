/**
 * @fileOverview used to display insurance section in servicing flow
 * @author Ksalicheemala
 */
Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MInsuranceScript",
    $dependencies: [
        'aria.utils.Json',
        'modules.view.merci.common.utils.MCommonScript',
        'modules.view.merci.common.utils.URLManager'
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
            var model = {};
            if(this.moduleCtrl.getModuleData().booking && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply && this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MInsuranceDetails){
                model = this.moduleCtrl.getModuleData().booking.MCONFRETRIEVE_A.requestParam.reply.MInsuranceDetails;
            }else{
                model = this.moduleCtrl.getModuleData().MInsuranceDetails;
            }           
            this.labels = model.labels;
            this.insuranceDetails = model.insurancePanel;

        },
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MInsurance",
						data:this.data
					});
			}
		},

        /**
         * @returns {Object} result Returns the insurance to display, if already selected an insurance returns it else returns cheapest Insurance
         */
        getInsuranceToDisplay: function() {
            var result = {};
            if (this.insuranceDetails.bookedInsurances.length) {
                result.priceLabel = this.labels.tx_merci_services_paid;
                result.price = this.insuranceDetails.bookedInsurances[0].formattedPrice;
                result.selectionLabel = this.insuranceDetails.bookedInsurances[0].insuranceProduct.productName;

            } else {

                var cheapest = this.getCheapestInsurance(this.insuranceDetails);

                if (cheapest) {
                    result.priceLabel = this.labels.tx_merci_services_from;
                    result.selectionLabel = this.labels.tx_merci_noinsuranceselected;
                    result.price = cheapest.formatedTotalAmount;
                } else result = cheapest;
            }
            return result;
        },

        //Function used to navigate to InsuranceSelection screen
        goToInsurancePage: function() {

            if (!(this.insuranceDetails.bookedInsurances.length)) {
                var params = {
                    DIRECT_RETRIEVE_LASTNAME: this.data.lastName
                };
                this.utils.sendNavigateRequest(params, 'MSelectInsurance.action', this);
            }
        },

        /**
         * @param {Object} insuranceDetails  contains list of Insurance products
         * @returns {Object} cheapestInsurance among the list of insurance products
         */
        getCheapestInsurance: function(insuranceDetails) {
            if (insuranceDetails.insuranceProductList.length) {

                var cheapestInsurance = insuranceDetails.insuranceProductList[0];
                var leastPrice = insuranceDetails.insuranceProductList[0].totalAmount;;

                for (var i = 1; i < insuranceDetails.insuranceProductList.length; i++) {
                    if (leastPrice > insuranceDetails.insuranceProductList[i].totalAmount) {
                        leastPrice = insuranceDetails.insuranceProductList[i].totalAmount;
                        cheapestInsurance = insuranceDetails.insuranceProductList[i];
                    }

                }
                return cheapestInsurance;
            } else {
                return false;
            }

        }


    }
});