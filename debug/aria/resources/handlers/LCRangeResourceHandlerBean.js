/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Definition of the suggestions used in the MultiAutoComplete Handler
 * @class aria.resources.handlers.MultiAutoCompleteHandlerBean
 */
Aria.beanDefinitions({
    $package : "aria.resources.handlers.LCRangeResourceHandlerBean",
    $description : "Definition of the suggestions used in the MultiAutoComplete resource handler",
    $namespaces : {
        "base" : "aria.resources.handlers.LCResourcesHandlerBean",
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "Configuration" : {
            $type : "base:Configuration",
            $description : "Configuration Object for Suggestions with range of values",
            $restricted : false,
            $properties : {
                "allowRangeValues" : {
                    $type : "json:Boolean",
                    $description : "To add range of values",
                    $default : false
                }
            }
        }
    }
});