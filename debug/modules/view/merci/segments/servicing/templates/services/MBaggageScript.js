Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.servicing.templates.services.MBaggageScript",
    $dependencies: [
        'aria.utils.Array',
        'aria.utils.Date',
        'modules.view.merci.common.utils.MCommonScript',
        'modules.view.merci.common.utils.MerciGA',
        'modules.view.merci.common.utils.ServiceCatalog',
        'modules.view.merci.common.utils.ServiceSelection'
    ],

    $statics: {
        CATEGORY_BAG: 'BAG',

        INPUT_FREE: 'FREETXT',
        INPUT_MULTIPLE: 'MULTIPLE',

        PTY_NUMBER: 'NUMBER',
        PTY_WEIGHT: 'WEIGHT',

        DEFAULT_UNIT: 'KG'
    },

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
        this.__ga = modules.view.merci.common.utils.MerciGA;
    },

    $prototype: {

        $dataReady: function() {
            var model = this.moduleCtrl.getModuleData().MBaggage;
            this.config = model.config;
            this.labels = model.labels;
            this.request = model.request;
            this.reply = model.reply;
            this.tripplan = this.moduleCtrl.getTripPlan();
            this.bookedSelection = new modules.view.merci.common.utils.ServiceSelection(this.tripplan.air.services, this.tripplan.air.itineraries);
            this.currentSelection = this.moduleCtrl.getCurrentSelection();
            this._catalog = this.moduleCtrl.getCatalog();

            this.data.messages = this.utils.readBEErrors(this.reply.errors);
            this.data.defaultPaxIndex = this.__getDefaultPaxIndex(); //Index of pax to display by default in carousel
            this.data.currency = this._catalog.getCurrency();
            this.data.bagData = this.__initBagData();
            this.data.bagName = this.__getBagName();
            this.data.disableContinue = true; //State of 'Continue' button
            this.data.disableModif = !this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');

            var base = modules.view.merci.common.utils.URLManager.getBaseParams();
            
            // google analytics
            this.__ga.trackPage({
                domain: this.config.siteGADomain,
                account: this.config.siteGAAccount,
                gaEnabled: this.config.siteGAEnable,
                page: 'Ser 1-Add Baggage?wt_market=' + ((base[13] != null) ? base[13] : '') +
                    '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeId + '&wt_sitecode=' + base[11],
                GTMPage: 'Ser 1-Add Baggage?wt_market=' + ((base[13] != null) ? base[13] : '') +
                    '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeId + '&wt_sitecode=' + base[11]
            });
			
        },

        $viewReady: function() {
            document.body.className = 'pnr-retrieve xbag';
            var header = this.moduleCtrl.getModuleData().headerInfo;
            this.moduleCtrl.setHeaderInfo({
                title: header.title,
                bannerHtmlL: header.bannerHtml,
                homePageURL: header.homeURL,
                showButton: header.showButton
            });
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MBaggage",
						data:this.data
					});
			}
        },

        /**
         * Reads from the request the index (in the pax array) of the passenger to be selected by default in the carousel
         */
        __getDefaultPaxIndex: function() {
            var defaultIndex = 0;
            if (!this.utils.isEmptyObject(this.request.passengerId)) {
                var defaultId = this.request.passengerId;
                var passengers = this.tripplan.paxInfo.travellers;
                for (var p = 0; p < passengers.length; p++) {
                    if (String(passengers[p].paxNumber) === defaultId) {
                        defaultIndex = p;
                    }
                }
            }
            return defaultIndex;
        },

        /**
         * Reads from the catalogue the localised name of the service being selected,
         * or an empty string if no bag is available (not supposed to happen)
         */
        __getBagName: function() {
            var bagServices = this._catalog.getServices(this.CATEGORY_BAG);
            var bagName = '';
            if (bagServices.length > 0) {
                bagName = bagServices[0].name;
            }
            return bagName;
        },

        /**
         * Creates the object describing the available bag options for each passenger and bound
         * Object structure: {
         *   passengers: [{
         *      bounds: [{
         *          available:         <whether bag in catalogue for this pax and bound>,
         *          weight: {          //only in case of weight concept
         *              booked:        <current trip plan value>,
         *              unit:          <weight unit>,
         *              inputType:     <FREETXT or MULTIPLE>,
         *              max:           <max value>, //only in case of FREETXT
         *              unitPrice:     <price per kilo>, //only in case of FREETXT
         *              choices: [{    //only in case of MULTIPLE
         *                  value:     <value currently selected>,
         *                  inputTags: <input tags to send>,
         *                  price:     <price for current value>
         *              }, ...],
         *              current:       <an item of choices, or similar object in case of FREETXT>
         *          },
         *          pieces: {          //only in case of piece concept
         *              //same as weight, except without unit
         *          }
         *      }, ...]
         *   }, ...],
         *   selectedPax: <an item of passengers>
         * }
         */
        __initBagData: function() {
            var bagData = {
                passengers: []
            };

            var passengers = this.tripplan.paxInfo.travellers;
            var bounds = this.tripplan.air.itineraries;
            for (var p = 0; p < passengers.length; p++) {
                var paxNumber = passengers[p].paxNumber;
                bagData.passengers[p] = {
                    bounds: []
                }
                for (var b = 0; b < bounds.length; b++) {
                    var boundData = this.__initBoundData(paxNumber, bounds[b]);
                    bagData.passengers[p].bounds[b] = boundData;
                }
                if (p === this.data.defaultPaxIndex) {
                    bagData.selectedPax = bagData.passengers[p];
                }
            }
            return bagData;
        },

        /**
         * Creates the object describing the available bag options for the given passenger and bound
         */
        __initBoundData: function(paxNumber, bound) {
            var boundId = Number(bound.itemId);
            var eligGroups = this._catalog.getEligibilityGroups(this.CATEGORY_BAG, paxNumber, boundId);
            var avail = eligGroups.length > 0;
            var boundData = {
                available: avail
            };
            if (avail) {
                var bookedBags = this.bookedSelection.getServices(this.CATEGORY_BAG, paxNumber, boundId);
                var nextIndex = "1";
                if (bookedBags.length) {
                    var index = bookedBags[0].selectionIndex;
                    index = index.substring(index.length - 1);
                    nextIndex = String(Number(index) + 1);
                }

                var weight = this._catalog.getFirstProperty(eligGroups[0], this.PTY_WEIGHT);
                //Creating the data for weight or pieces uses the same logic except for the input tags creation,
                //so the input tags creation is parameterised as a callback
                if (weight) {
                    var inputTagsCb = {
                        fn: this.__getWeightInputTags,
                        scope: this,
                        args: [paxNumber, bound, nextIndex],
                        apply: true
                    };
                    boundData.weight = this.__initParamData(eligGroups, this.PTY_WEIGHT, inputTagsCb, paxNumber, boundId);
                } else {
                    var inputTagsCb = {
                        fn: this.__getPieceInputTags,
                        scope: this,
                        args: [paxNumber, bound, nextIndex],
                        apply: true
                    };
                    boundData.pieces = this.__initParamData(eligGroups, this.PTY_NUMBER, inputTagsCb, paxNumber, boundId);
                }
            }
            return boundData;
        },

        /**
         * Initialises the concept-specific (weight/pieces) data
         */
        __initParamData: function(eligGroups, ptyCode, inputTagsCb, paxNumber, boundId) {
            var bookedBags = this.bookedSelection.getServices(this.CATEGORY_BAG, paxNumber, boundId);
            var bookedValue = this.bookedSelection.getTotalProperty(bookedBags, ptyCode);
            var totalBags = this.currentSelection.getServices(this.CATEGORY_BAG, paxNumber, boundId);
            var total = this.currentSelection.getTotalProperty(totalBags, ptyCode);
            var currentValue = total - bookedValue;

            var paramData = {
                booked: bookedValue
            };

            var property = this._catalog.getFirstProperty(eligGroups[0], ptyCode);
            //Assumes that UNIT has no default value and is hard-coded in format
            var unitValue = this._catalog.getParameterValue(property, 'UNIT', 'format');
            if (unitValue) {
                paramData.unit = unitValue.substring(1, unitValue.length - 1);
            } else { //Or else we assume it is Kg
                paramData.unit = this.DEFAULT_UNIT;
            }

            if (eligGroups.length > 1) {
                this.__initMultipleChoiceData(paramData, eligGroups, ptyCode, inputTagsCb, currentValue);
            } else {
                this.__initFreeTextData(paramData, eligGroups[0], ptyCode, inputTagsCb, currentValue);
            }
            return paramData;
        },

        /**
         * Initialises the bag data in case of free-text input
         */
        __initFreeTextData: function(bagData, eligGroup, ptyCode, inputTagsCb, currentValue) {
            bagData.inputType = this.INPUT_FREE;

            var property = this._catalog.getFirstProperty(eligGroup, ptyCode);
            bagData.max = this._catalog.getParameterValue(property, 'VALUE', 'maxValue');
            bagData.unitPrice = eligGroup.priceInfo ? eligGroup.priceInfo.totalAmount : 0;
            bagData.current = {
                value: currentValue,
                inputTags: this.$callback(inputTagsCb, eligGroup),
                price: currentValue * bagData.unitPrice
            };
        },

        /**
         * Initialises the bag data in case of drop-down input
         */
        __initMultipleChoiceData: function(bagData, eligGroups, ptyCode, inputTagsCb, currentValue) {
            bagData.inputType = this.INPUT_MULTIPLE;

            var choices = [];
            var current;
            for (var e = 0; e < eligGroups.length; e++) {
                var args = aria.utils.Array.clone(inputTagsCb.args); //because of AT bug in $callback - TODO remove after migrating to AT >= 1.4.8
                var choice = this.__createChoice(eligGroups[e], ptyCode, inputTagsCb);
                inputTagsCb.args = args; //because of AT bug in $callback - TODO remove after migrating to AT >= 1.4.8
                choices.push(choice);
                if (choice.value == currentValue) {
                    current = choice;
                }
            }

            bagData.current = current;
            bagData.choices = choices;
        },

        /**
         * Creates a single option of baggage for a drop-down input
         */
        __createChoice: function(eligGroup, ptyCode, inputTagCb) {
            var price = eligGroup.priceInfo ? eligGroup.priceInfo.totalAmount : 0;
            var property = this._catalog.getFirstProperty(eligGroup, ptyCode);
            var ptyValue = this._catalog.getParameterValue(property);
            var tags = this.$callback(inputTagCb, eligGroup);
            var choice = {
                value: ptyValue,
                inputTags: tags,
                price: price
            };
            return choice;
        },

        /**
         * Creates the input tags to send for the value of the given property.
         */
        __getInputTags: function(property, paxNumber, bound, nextIndex, value) {
            if (property != undefined) {
                var parameters = property.inputParams;
                var tags = {};
                for (var p = 0; p < parameters.length; p++) {
                    var rawTag = parameters[p].inputTag;
                    var code = parameters[p].code;
                    var tValue;
                    if (code === 'VALUE') {
                        tValue = value;
                    } else {
                        //When this is not a VALUE parameter, we try to read the value to send in 'value' field,
                        //or if it does not exist we assume that the default value is hard-coded in 'format' field
                        if (parameters[p].value) {
                            tValue = parameters[p].value;
                        } else {
                            var format = parameters[p].format;
                            if (format) {
                                tValue = format.substring(1, format.length - 1);
                            } else {
                                tValue = this.DEFAULT_UNIT; //If no value, hard-coded value. Please do not hit me it is not my fault. PTR 7346200
                            }
                        }
                    }
                    var segments = bound.segments;
                    for (var s = 0; s < segments.length; s++) {
                        var finalTag = rawTag.replace('[p]', paxNumber).replace('[s]', segments[s].id).replace('[i]', nextIndex);
                        tags[finalTag] = tValue;
                    }
                }
                return tags;
            }
        },

        /**
         * Creates the input tags for the piece concept use case
         * The tags that have a null value will be the ones holding the user input
         */
        __getPieceInputTags: function(eligGroup, paxNumber, bound, nextIndex) {
            var numberProperty = this._catalog.getFirstProperty(eligGroup, this.PTY_NUMBER);
            return this.__getInputTags(numberProperty, paxNumber, bound, nextIndex, null);
        },

        /**
         * Creates the input tags for the weight concept use case
         * The tags that have a null value will be the ones holding the user input
         */
        __getWeightInputTags: function(eligGroup, paxNumber, bound, nextIndex) {
            var numberProperty = this._catalog.getFirstProperty(eligGroup, this.PTY_NUMBER);
            var tags = this.__getInputTags(numberProperty, paxNumber, bound, nextIndex, '1');
            //Merge weight tags and number tags
            var weightProperty = this._catalog.getFirstProperty(eligGroup, this.PTY_WEIGHT);
            this.$json.inject(this.__getInputTags(weightProperty, paxNumber, bound, nextIndex, null), tags, false);

            return tags;
        },

        /**
         * Call-back used by the carousel to tell that a new passenger was selected
         */
        selectPax: function(pId) {
            this.$json.setValue(this.data.bagData, 'selectedPax', this.data.bagData.passengers[pId]);
        },

        /**
         * Event handler when the user clicks on the '+' (incr = 1) and '-' (incr = -1) buttons.
         */
        incrValue: function(evt, bagData, incr) {
            var currentValue = bagData.current.value + incr;
            if (currentValue >= 0 && (!bagData.max || currentValue <= bagData.max)) {
                var current = {
                    value: currentValue,
                    price: currentValue * bagData.unitPrice,
                    inputTags: bagData.current.inputTags
                };
                this.$json.setValue(bagData, 'current', current);
                this._setDisableContinue();
            }
        },

        /**
         * Event handler when the user selects a value in the drop-down
         */
        setValue: function(evt, bagData) {
            var value = evt.target.getValue();
            var current = null;
            if (value) {
                for (var c = 0; c < bagData.choices.length; c++) {
                    if (String(bagData.choices[c].value) === value) {
                        current = bagData.choices[c];
                        break;
                    }
                }
            }
            this.$json.setValue(bagData, 'current', current);
            this._setDisableContinue();
        },

        /**
         * Updates the state of the 'Confirm' button, so that it is enabled only if something is selected
         */
        _setDisableContinue: function() {
            var disable = true;
            var passengers = this.data.bagData.passengers;
            for (var p = 0; p < passengers.length; p++) {
                var bounds = passengers[p].bounds;
                for (var b = 0; b < bounds.length; b++) {
                    if (bounds[b].available) {
                        var current;
                        if (bounds[b].pieces) {
                            current = bounds[b].pieces.current;
                        } else if (bounds[b].weight) {
                            current = bounds[b].weight.current;
                        }
                        if (current && current.value > 0) {
                            disable = false;
                            break;
                        }
                    }
                }
                if (!disable) {
                    break;
                }
            }
            this.$json.setValue(this.data, 'disableContinue', disable);
        },

        /**
         * Event handler when the user clicks on confirm.
         * Reads all the input tags from the bagData and replaces as required the value with the user inputs.
         */
        confirm: function(evt) {
            var inputTags = {};
            var passengers = this.data.bagData.passengers;
            for (var p = 0; p < passengers.length; p++) {
                var bounds = passengers[p].bounds;
                for (var b = 0; b < bounds.length; b++) {
                    var bagData = null;
                    if (bounds[b].pieces) {
                        bagData = bounds[b].pieces.current;
                    } else if (bounds[b].weight) {
                        bagData = bounds[b].weight.current;
                    }
                    if (bagData && bagData.value) {
                        var tags = bagData.inputTags;
                        for (var t in tags) {
                            if (!this.$json.isMetadata(t)) {
                                if (tags[t]) {
                                    inputTags[t] = tags[t];
                                } else {
                                    inputTags[t] = bagData.value;
                                }
                            }
                        }
                    }
                }
            }

            this.moduleCtrl.updateBasket(this.CATEGORY_BAG, inputTags, {
                fn: this.__errorCallback,
                scope: this
            });
        },

        __errorCallback: function(reply) {
            var messages = this.utils.readBEErrors(reply.errors);
            this.$json.setValue(this.data, 'messages', messages);
        }

    }
});