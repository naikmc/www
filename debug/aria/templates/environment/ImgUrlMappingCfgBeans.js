/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Bean definitions that are either common to multiple areas of the framework, or are needed before dependencies are
 * loaded by the framework.
 */
Aria.beanDefinitions({
    $package : "aria.templates.environment.ImgUrlMappingCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : "aria.core.JsonTypes"
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "imgUrlMapping" : {
                    $type : "json:FunctionRef",
                    $description : "Method to map img urls inside CSS templates.",
                    $default : null
                }
            }
        }
    }
});
