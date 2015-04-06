/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Public API of the page engine available in templates and modules
 */
Aria.interfaceDefinition({
    $classpath : "aria.pageEngine.PageEngineInterface",
    $events : {
        "pageReady" : {
            description : "Raised when the page has been displayed",
            properties : {
                "pageId" : "Identifier of the page."
            }
        },
        "beforePageTransition" : {
            description : "Raised before displaying a new page, after its dependencies have already been loaded",
            properties : {
                "from" : "Id of the page that the pageEngine is navigating away from.",
                "to" : "Id of the page that the pageEngine is navigating to."
            }
        }
    },
    $interface : {

        /**
         * Navigate to a specific page
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest id and url of the page
         * @param {aria.core.CfgBeans:Callback} cb To be called when the navigation is complete
         */
        navigate : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Return the data of the application
         * @return {Object}
         *
         * <pre>
         * {
         *     appData : {Object} application data,
         *     pageData : {Object} data specific to the current page,
         *     pageInfo : {aria.pageEngine.CfgBeans.PageNavigationInformation} information on the current page
         * }
         * </pre>
         */
        getData : {
            $type : "Function"
        },

        /**
         * Return instance of the pageProvider
         * @return {aria.pageEngine.CfgBeans:Start.pageProvider}
         */
        getPageProvider : {
            $type : "Function"
        },

        /**
         * Tell whether a certain module is currently present on the page
         * @param {aria.tamplates.ModuleCtrl} module
         * @return {Boolean}
         */
        isModuleInPage : {
            $type : "Function"
        }

    }
});
