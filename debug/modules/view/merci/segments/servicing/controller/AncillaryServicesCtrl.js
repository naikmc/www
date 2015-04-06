Aria.classDefinition({
    $classpath: 'modules.view.merci.segments.servicing.controller.AncillaryServicesCtrl',
    $extends: 'modules.view.merci.segments.servicing.controller.MerciServicingCtrl',
    $implements: ['modules.view.merci.segments.servicing.controller.IAncillaryServicesCtrl'],
    $dependencies: [
        'aria.utils.DomOverlay',
        'aria.utils.HashManager',
        'modules.view.merci.common.utils.MCommonScript',
        'modules.view.merci.common.utils.ServiceCatalog',
        'modules.view.merci.common.utils.ServiceSelection',
        'modules.view.merci.common.utils.URLManager'
    ],

    $statics: {
        TYPE_AAAS: 'AIR_ANCILLARY_SERVICES',
        NON_PAX_ASSOCIATED_VALUE: "0", // passenger value to be used when service is not pax-associated
        NO_SEGMENT_ID: "0", // segment id to be used for services with assoc. mode ITI
        DEFAULT_SERVICE_INDEX: "1", // service index to be used for service selections (no multiple cardinality)
        INPUT_PARAM_SEGMENT_ID: "[s]", // placeholder for the segment id in an input param pattern
        INPUT_PARAM_LEG_ID: "[legId]", // placeholder for the leg id in an input param pattern
        INPUT_PARAM_TRAVELLER_ID: "[p]", // placeholder for the traveller id in an input param pattern
        INPUT_PARAM_INDEX: "[i]" // placeholder for the service selection index in an input param pattern
    },

    $constructor: function() {
        this.$MerciServicingCtrl.constructor.call(this);
        this.utils = modules.view.merci.common.utils.MCommonScript;
        this.urlManager = modules.view.merci.common.utils.URLManager;

        this.updateCallback = false;
    },

    $prototype: {
        $publicInterfaceName: 'modules.view.merci.segments.servicing.controller.IAncillaryServicesCtrl',

        init: function(args, initReadyCb) {
            this.$MerciServicingCtrl.init.call(this, args);
            //This is assuming that the controller is created when landing on catalogue page
            this._catalogPageId = 'merci-MDFSR_A';
            if(this.utils.isEmptyObject(this.getModuleData().MServicesCatalog) && !this.utils.isEmptyObject(this.getModuleData().servicing.MNewServicesCatalog))
            {
                this._catalogPageId = 'merci-MNewServicesCatalog';
            }
            if (!this._data.selectedValues) {
                this._data.selectedValues = {};
            }
            if (!this._data.inputParamsPerBound) {
                this._data.inputParamsPerBound = {};
            }
            this.$callback(initReadyCb);
        },

        /**
         * Stores and sends the given inputs.
         * When receiving BE response:
         *   - if they are some errors, refreshCb is called
         *   - otherwise updates the basket with selections in response and:
         *      * if already on catalogue page, refreshCb is called
         *      * otherwise goes to catalogue page.
         */
        updateBasket: function(category, inputTags, refreshCb) {
            this.__updateTags(this._basket.inputTags, inputTags);
            if (!this._basket.perCategory[category]) {
                this._basket.perCategory[category] = {
                    inputTags: {}
                };
            }
            this.__updateTags(this._basket.perCategory[category].inputTags, inputTags);
            this._computeServiceSelection(refreshCb);
        },

        /**
         * Calls the MComputServiceSelection with all the input tags, and updates the basket with the response
         */
        _computeServiceSelection: function(refreshCb) {
            var request = this.utils.navigateRequest(this._basket.inputTags, 'MComputeServiceSelection.action', {
                fn: this.__updateBasketCallback,
                scope: this,
                args: refreshCb
            });
            this.urlManager.makeServerRequest(request, false);
        },

        /**
         * Updates the basket with selections in response and goes to catalogue page.
         */
        __updateBasketCallback: function(response, refreshCb) {
            if (response.responseJSON) {
                var reply = response.responseJSON.data.reply;
                var messages = this.utils.readBEErrors(reply.errors);
                this._basket.messages = messages;
                if (messages.errors) {
                    this.$callback(refreshCb, reply);
                } else {
                    if(!this.utils.isEmptyObject(this.data.MServicesCatalog))
                    {
                        this.data.MServicesCatalog.request.fromPage = reply.fromPage || "";
                    }
                    if(!this.utils.isEmptyObject(this.data.servicing) && !this.utils.isEmptyObject(this.data.servicing.MNewServicesCatalog))
                    {
                        this.data.servicing.MNewServicesCatalog.requestParam.request.fromPage = reply.fromPage || "";
                    }
                    this._basket.selection = reply.selection;
                    var currentPage = aria.utils.HashManager.getHashString();
                    if (currentPage === this._catalogPageId) {
                        this.$callback(refreshCb, reply);
                    } else {
                        this.updateCallback = true;
                        this.navigateToCatalog();
                    }
                    this.utils.hideMskOverlay();
                }
            }
        },

        /**
         * Utility method to inject inputTags into object
         */
        __updateTags: function(object, inputTags) {
            for (var tag in inputTags) {
                if (inputTags[tag]) {
                    object[tag] = inputTags[tag];
                } else {
                    delete object[tag];
                }
            }
        },

        /**
         * Clears all the input tags associated to the given category, and refreshes the basket
         */
        cancelServices: function(category, refreshCb) {
            if (this._basket.perCategory[category]) {
                var cTags = this._basket.perCategory[category].inputTags;
                for (var tag in cTags) {
                    cTags[tag] = null;
                }
                //This will delete all the tags related to the category, since they are now null
                this.__updateTags(this._basket.inputTags, cTags);
                delete this._basket.perCategory[category];
                this._computeServiceSelection(refreshCb);
            }
        },

        /**
         * Calls the BE to update the trip plan with all the services of the basket
         */
        commitBasket: function(cb) {
            var fromPax = this._fromPax || false;
            if (!fromPax) {
                this._basket.inputTags.FROM_PAGE = 'SERVICE'; //used by PURC
            }
            if (!this.utils.isEmptyObject(this._pageTicket)) {
                this._basket.inputTags.PAGE_TICKET = this._pageTicket;
            }
            var request = this.utils.navigateRequest(this._basket.inputTags, 'MConfirmServiceSelection.action', cb);
            this.urlManager.makeServerRequest(request, false);
        },

        /**
         * Empties the basket.
         * To be called before leaving the catalogue page without committing.
         */
        rollbackBasket: function() {
            this._basket = this._initBasket();
        },

        /**
         * Initialise a basket with no new selection (selection = tripplan.selection)
         */
        _initBasket: function() {
            var fromPax = this._fromPax || false;
            var action = this._isServicing ? 'MODIFY' : 'BOOK'
            var basket = {
                selection: this._tripplan.air.services,
                inputTags: {
                    FROM_PAX: String(fromPax),
                    /* used by AddElements to compute insurance, and to avoid MOD/MOP data-checks */
                    ACTION: action
                },
                perCategory: {} /* Used for deleting services for whole category */
            };
            return basket;
        },

        /** Returns the AIR_ANCILLARY_SERVICES permission with the given name (ADD_DISABLED, ALLOW_MODIFY, etc) */
        getAncillaryPermission: function(permName) {
            var permissions = this._tripplan.permissions.byType;
            var permission = true;
            if (permissions.length) {
                for (var p = 0; p < permissions.length; p++) {
                    if (permissions[p].TYPE === this.TYPE_AAAS) {
                        permission = this.utils.booleanValue(permissions[p][permName]);
                        break;
                    }
                }
            }
            return permission;
        },

        /**
         * Navigates to catalogue page.
         * To be called when leaving a service selection page without confirming.
         */
        navigateToCatalog: function() {
            this.updateCallback = false;
            var args = {};
            args.forceReload = true;
            if (aria.utils.HashManager.getHashString() == "merci-MGenericServ_A") {
                this.navigate(null, this._catalogPageId);
            } else {
                this.navigate(args, this._catalogPageId);
            }
        },

        /** Sets the TripPlan object for usage by other pages */
        setTripPlan: function(tp) {
            //We must reset the basket only if the trip plan changed
            if (this._tripplan !== tp) {
                this._tripplan = tp;
                if (tp) {
                    this._basket = this._initBasket();
                }
            }
        },

        getTripPlan: function() {
            return this._tripplan;
        },

        /** Tells whether the previous page was ALPI page (required for insurance display on PURC). Should be called before setting the trip plan */
        setFromPax: function(fromPax) {
            this._fromPax = fromPax;
        },

        /** Tells whether we are in a servicing flow. Should be called before setting the trip plan */
        setIsServicing: function(isServicing) {
            this._isServicing = isServicing;
        },

        /** Tells which page ticket to use when confirming the basket */
        setPageTicket: function(pageTicket) {
            this._pageTicket = pageTicket;
        },

        /** Sets the catalogue object for usage by other pages */
        setCatalog: function(c) {
            if (c) {
                this._catalog = new modules.view.merci.common.utils.ServiceCatalog(c, this._tripplan.air.itineraries);
                this._data.catalog = this._catalog;
                this.__createServiceMaps();
            } else {
                this._catalog = c;
            }
        },

        getCatalog: function() {
            return this._catalog;
        },

        /** Returns the current services selection (includes already booked services), as an instance of ServiceSelection class */
        getCurrentSelection: function() {
            return new modules.view.merci.common.utils.ServiceSelection(this._basket.selection, this._tripplan.air.itineraries);
        },

        /** Returns the latest list of messages that came when updating the basket */
        getLatestMessages: function() {
            return this._basket.messages;
        },
        /*Deletes an item from the page*/
        deleteItem: function(itemsArray, id){
            for(var i=0;i<itemsArray.length; i++){
                 var nullInputTags={};
                if(itemsArray[i].id==id){  
                    var state=itemsArray[i].state;
                    if(this.utils.isEmptyObject(state) && !this.utils.isEmptyObject(itemsArray[i].choice))
                        state=itemsArray[i].choice.state ;
                    if(state=="ADDED"){
                        for(var t in itemsArray[i].choice.inputTags){
                            if (!aria.utils.Json.isMetadata(t)){
                                nullInputTags[t]=null;
                            }
                        }
                         this.__updateTags(this._basket.inputTags, nullInputTags);
                    }
                  itemsArray.splice(i,1);
                }
            }
        },

        /*
        Method to create category-wise Service Maps at the initialization of the module controller.
         */
        __createServiceMaps: function() {
            var itineraries = this._tripplan.air.itineraries;
            var mapSegmentToService = {};
            var mapItineraryToService = {};
            var nbItineraries = itineraries.length;
            for (var i = 0; i < nbItineraries; i++) {
                var itinerary = itineraries[i];
                var nbSegments = itinerary.segments.length;
                mapItineraryToService[itinerary.itemId] = this.__getServicesForElement("ELE", Number(itinerary.itemId));
                for (var j = 0; j < nbSegments; j++) {
                    var segment = itinerary.segments[j];
                    mapSegmentToService[segment.id] = this.__getServicesForElement("SEG", segment.id);
                }
            }
            this._data.servicesAllTrip = this.__getServicesForWholeTrip();
            this._data.servicesSVC = this.__getSVCServices();
            this._data.mapItineraryToService = mapItineraryToService;
            this._data.mapSegmentToService = mapSegmentToService;
        },
        /** Return the basket with all the selected services **/
        getBasket: function() {
            return this._basket;
        },

        /** Initialises basket with the available set of parameters when coming from bookmark **/
        setInputParamsPerCategoryInBasket: function(paramsPerCategory) {
            this._basket.perCategory = paramsPerCategory;
        },

        setInputTagsInBasket: function(inputTags) {
            for (tag in inputTags) {
                this._basket.inputTags[tag] = inputTags[tag];
            }
        },
        /**
         * Method to get services corresponding to the elementType(bound or segment), and its id.
         */
        __getServicesForElement: function(elementType, elementId) {
            var servicesForElement = {};
            var categories = this._data.catalog.categories;
            var nbCategories = categories.length;
            for (var i = 0; i < nbCategories; i++) {
                var category = categories[i];
                servicesForElement[category.code] = [];
                var nbServices = category.services.length;
                serviceLoop: for (var j = 0; j < nbServices; j++) {
                    var service = category.services[j];
                    var associationMode = service.associationMode;
                    if (service.associationMode == elementType) {
                        var nbEligibilityGroups = service.eligibilityGroups.length;
                        for (var k = 0; k < nbEligibilityGroups; k++) {
                            var eligibilityGroup = service.eligibilityGroups[k];
                            var nbEligibilities = eligibilityGroup.eligibilities.length;
                            for (var l = 0; l < nbEligibilities; l++) {
                                var eligibility = eligibilityGroup.eligibilities[l];
                                // check that eligibility is the same as the elementType
                                if (eligibility.eligibilityType == elementType) {
                                    // if no elementIds specified in eligibility (all elements are eligible)
                                    // or if this element id is contained in the list of eligible elementIds
                                    if (!eligibility.elementIds || eligibility.elementIds.length == 0 ||
                                        aria.utils.Array.contains(eligibility.elementIds, elementId)) {
                                        servicesForElement[category.code].push(service);
                                        // this service already added for this element, go to the next service
                                        continue serviceLoop;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return servicesForElement;
        },


        /**
         * Return array with services that are eligible for the whole trip (associationMode ITI)
         */
        __getServicesForWholeTrip: function() {
            var servicesWholeTrip = {};
            var categories = this._data.catalog.categories;
            var nbCategories = categories.length;
            for (var i = 0; i < nbCategories; i++) {
                var category = categories[i];
                servicesWholeTrip[category.code] = [];
                var nbServices = category.services.length;
                for (var j = 0; j < nbServices; j++) {
                    var service = category.services[j];
                    if (service.associationMode == "ITI") {
                        servicesWholeTrip[category.code].push(service);
                    }
                }
            }
            return servicesWholeTrip;
        },

        /**
         * Return array with services that are merchandising services (associationMode GND)
         */
        __getSVCServices: function() {
            var servicesWholeTrip = {};
            var categories = this._data.catalog.categories;
            var nbCategories = categories.length;
            for (var i = 0; i < nbCategories; i++) {
                var category = categories[i];
                servicesWholeTrip[category.code] = [];
                var nbServices = category.services.length;
                for (var j = 0; j < nbServices; j++) {
                    var service = category.services[j];
                    if (service.associationMode == "GND") {
                        servicesWholeTrip[category.code].push(service);
                    }
                }
            }
            return servicesWholeTrip;
        },

        /**
         * Get the eligibility for a service according to the association mode, itineraryId/segmentId, and travellerId
         */
        getEligibilityForService: function(service, displayType, itineraryId, segmentId, travellerId) {
            var eligibilityGroups = service.eligibilityGroups;
            var nbEligibilityGroups = eligibilityGroups.length;
            var elementId = 0;
            if (displayType == "SEG") {
                elementId = segmentId;
            } else if (displayType == "ELE") {
                elementId = itineraryId;
            }
            for (var i = 0; i < nbEligibilityGroups; i++) {
                var eligibilities = eligibilityGroups[i].eligibilities;
                var nbEligibilities = eligibilities.length;
                for (var j = 0; j < nbEligibilities; j++) {
                    var eligibility = eligibilities[j];
                    // if pax-associated, test if passenger is eligible
                    var paxValidEligibility = true;
                    if (service.passengerAssociated) {
                        if (!aria.utils.Array.contains(eligibility.passengerIds, parseInt(travellerId))) {
                            // if pax-associated and does not contain travellerId, elig is not valid
                            paxValidEligibility = false;
                        }
                    }
                    if (paxValidEligibility) {
                        if (eligibility.eligibilityType == displayType) {
                            // if display type is ITI or GND, do not need to check segment or bound ids
                            if (displayType == "ITI" || displayType == "GND") {
                                return eligibility;
                            } else {
                                if (aria.utils.Array.contains(eligibility.elementIds, elementId) || aria.utils.Array.contains(eligibility.elementIds, Number(elementId))) {
                                    return eligibility;
                                }
                            }
                        }
                    }
                }
            }
        },

        /*
         * Creates the input tag pattern replacing the itinerary, segment and passenger
         * placeholders and creates the structure in the data model
         */
        getInputParamPattern: function(eligibilityKey, inputPattern, passengerAssociated, associationMode, itineraryId, segmentId, travellerId, instanceId) {

            if (!inputPattern) {
                this.$logError("No input pattern defined for " + eligibilityKey);
                return "";
            }
            var inputPatternReplaced = inputPattern; // create copy of inputPattern on which the placeholders will be replaced
            var segmentIdToUse;
            if (associationMode == "SEG") {
                segmentIdToUse = segmentId;
            } else if (associationMode == "ELE") {
                segmentIdToUse = this._getFirstSegmentOfBound(itineraryId);
            }
            // send segment id of NO_SEGMENT_ID (0) when ITI
            else if (associationMode == "ITI") {
                segmentIdToUse = this.NO_SEGMENT_ID;
            }
            var serviceIndexToUse = this.DEFAULT_SERVICE_INDEX;
            if (associationMode == "GND" && instanceId) {
                serviceIndexToUse = instanceId + "";
            }
            var travellerIdToUse = travellerId;
            // if not passenger associated, associate to primary traveller (id=1)
            if (!passengerAssociated) {
                travellerIdToUse = this.NON_PAX_ASSOCIATED_VALUE;
            }
            // service index always replaced by 1 (no multiple selection of services supported yet)
            inputPatternReplaced = inputPatternReplaced.replace(this.INPUT_PARAM_INDEX, serviceIndexToUse);
            inputPatternReplaced = inputPatternReplaced.replace(this.INPUT_PARAM_SEGMENT_ID, segmentIdToUse);
            inputPatternReplaced = inputPatternReplaced.replace(this.INPUT_PARAM_TRAVELLER_ID, travellerIdToUse);

            // create the input pattern if it does not exist
            if (this._data.selectedValues[eligibilityKey] == null ||
                this._data.selectedValues[eligibilityKey][inputPatternReplaced] == null) {
                this.createInputParamData(eligibilityKey, inputPatternReplaced);
            }
            return inputPatternReplaced;
        },


        /**
         * Return the segment object of the first segment in the bound with id equal to the itineraryId argument
         */
        _getFirstSegmentOfBound: function(itineraryId) {
            var itineraries = this._tripplan.air.itineraries;
            var nbItineraries = itineraries.length;

            for (var i = 0; i < nbItineraries; i++) {
                if (Number(itineraries[i].itemId) == itineraryId) {
                    return itineraries[i].segments[0].id;
                }
            }
        },

        /*
         * Creates an empty value for an input parameter pattern
         */
        createInputParamData: function(eligibilityKey, inputPattern) {
            if (!this._data.selectedValues[eligibilityKey]) {
                this._data.selectedValues[eligibilityKey] = {};
            }
            this.json.setValue(this._data.selectedValues[eligibilityKey], inputPattern, "");
        },


        /**
         * get the eligibility object in the catalog with the specified eligibilityKey
         */
        getCatalogEligibility: function(services, eligibilityKey) {
            var exactMatch = false;
            if (eligibilityKey.indexOf("_I") != -1) {
                exactMatch = true;
            }
            var nbServices = services.length;
            for (var j = 0; j < nbServices; j++) {
                var eligibilityGroups = services[j].eligibilityGroups;
                var nbEligibilityGroups = eligibilityGroups.length;
                for (var k = 0; k < nbEligibilityGroups; k++) {
                    var eligibilities = eligibilityGroups[k].eligibilities;
                    var nbEligibilities = eligibilities.length;
                    for (var l = 0; l < nbEligibilities; l++) {
                        var eligToCompare;
                        if (exactMatch) {
                            eligToCompare = eligibilities[l].eligibilityKey;
                        } else {
                            eligToCompare = eligibilities[l].eligibilityKey.split("_I")[0];
                        }
                        if (eligToCompare == eligibilityKey) {
                            return eligibilities[l];
                        }
                    }
                }
            }
            this.$logError("getCatalogEligibility: eligibility " + eligibilityKey + " not found in catalog");
            return null;
        },

        /*Method to set the errors*/
        errorCallback: function(reply) {
            var messages = this.utils.readBEErrors(reply.errors);
            this.$json.setValue(this.data, 'messages', messages);
        },

        /**
         * Returns the value of service attribute with the given type, or undefined if it does not exist.
         */
        getAttribute: function(service, attrType) {
            var value;
            var attributes = service.attributes;
            for (var a = 0; a < attributes.length; a++) {
                if (attributes[a].type === attrType) {
                    value = attributes[a].value;
                    break;
                }
            }
            return value;
        },

        /*Method to set the errors*/
        setSelection: function(reply) {
            this._basket.selection = reply.selection || {};
        },
    }
});