Aria.interfaceDefinition({
    $classpath: "modules.view.merci.segments.servicing.controller.IAncillaryServicesCtrl",
    $extends: "modules.view.merci.segments.servicing.controller.IMerciServicingCtrl",
    $interface: {
        /**
         * Updates the current services selection with the services represented with
         * the given input tags.
         * Services that are not affected by given input tags remain untouched in the selection
         * When receiving BE response:
         *   - if they are some errors, refreshCb is called
         *   - otherwise updates the basket with selections in response and:
         *      * if already on catalogue page, refreshCb is called
         *      * otherwise goes to catalogue page.
         */
        updateBasket: function(category, inputTags, refreshCb) {},

        /** Cancels all the services of the given category from the basket */
        cancelServices: function(category, refreshCb) {},

        /** Calls the BE to update the trip plan with all the services of the basket */
        commitBasket: function(callback) {},

        /** Empties the basket */
        rollbackBasket: function() {},

        /** Navigates to catalogue page */
        navigateToCatalog: function() {},

        /** Returns the AIR_ANCILLARY_SERVICES permission with the given name (ADD_DISABLED, ALLOW_MODIFY, etc) */
        getAncillaryPermission: function(permName) {},

        /** Returns the TripPlan object */
        getTripPlan: function() {},
        /** Sets the TripPlan object for usage by other pages */
        setTripPlan: function(tp) {},
        /** Tells whether the previous page was ALPI page (required for insurance display on PURC) */
        setFromPax: function(fromPax) {},
        /** Tells whether we are in a servicing flow */
        setIsServicing: function(isServicing) {},
        /** Tells which page ticket to use when confirming the basket */
        setPageTicket: function(pageTicket) {},
        /** Returns the catalogue object */
        getCatalog: function() {},
        /** Sets the catalogue object for usage by other pages */
        setCatalog: function(c) {},
        /** Returns the current services selection (includes already booked services) */
        getCurrentSelection: function() {},
        /** Returns the latest list of messages that came when updating the basket */
        getLatestMessages: function() {},
        deleteItem: function() {},
        /** Return the basket with all the selected services **/
        getBasket: function() {},
        /** Initialises basket with the available set of parameters when coming from bookmark **/
        setInputParamsPerCategoryInBasket: function() {},
        /** Set the input tags to be submitted to action in the basket **/
        setInputTagsInBasket: function() {},
        /*Method to create category-wise Service Maps at the initialization of the module controller.*/
        __createServiceMaps: function() {},
        /* Method to get services corresponding to the elementType(bound or segment), and its id.*/
        __getServicesForElement: function(elementType, elementId) {},
        /*Return array with services that are eligible for the whole trip (associationMode ITI) */
        __getServicesForWholeTrip: function() {},
        /* Return array with services that are merchandising services (associationMode GND) */
        __getSVCServices: function() {},

        /*Get the eligibility for a service according to the association mode, itineraryId/segmentId, and travellerId*/
        getEligibilityForService: function(service, displayType, itineraryId, segmentId, travellerId) {},

        /*Creates the input tag pattern replacing the itinerary, segment and passenger placeholders and creates the structure in the data model*/
        getInputParamPattern: function(eligibilityKey, inputPattern, passengerAssociated, associationMode, itineraryId, segmentId, travellerId, instanceId) {},
        /* Return the segment object of the first segment in the bound with id equal to the itineraryId argument*/
        _getFirstSegmentOfBound: function(itineraryId) {},
        /*Creates an empty value for an input parameter pattern*/
        createInputParamData: function(eligibilityKey, inputPattern) {},
        /*get the eligibility object in the catalog with the specified eligibilityKey*/
        getCatalogEligibility: function(services, eligibilityKey) {},
        /*Method to set the errors*/
        errorCallback: function(reply) {},
        /*Returns the value of service attribute with the given type, or undefined if it does not exist.*/
        getAttribute: function(service, attrType) {},
        /*Method to set the selection*/
        setSelection: function(reply) {},
    }
});