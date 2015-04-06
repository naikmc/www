/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.html.beans.InputElementCfg",
    $description : "Configuration for the generic InputElement.",
    $namespaces : {
        "base" : "aria.html.beans.ElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of an InputElement.",
            $properties : {
                "bind" : {
                    $type : "base:Properties.bind",
                    $properties : {
                        "disabled" : {
                            $type : "common:BindingRef",
                            $description : "Binding for the disabled attribute of the input element."
                        }
                    }
                }
            }
        }
    }
});
