/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.html.beans.RadioButtonCfg",
    $description : "Configuration for RadioButton widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "base" : "aria.html.beans.InputElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a RadioButton widget.",
            $properties : {
                "value" : {
                    $type : "json:String",
                    $description : "The value associated with the radio button."
                },
                "bind" : {
                    $type : "base:Properties.$properties.bind",
                    $properties : {
                        "selectedValue" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding."
                        }
                    }
                }
            }
        }
    }
});
