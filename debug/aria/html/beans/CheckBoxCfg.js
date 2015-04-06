/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.html.beans.CheckBoxCfg",
    $description : "Configuration for CheckBox widget.",
    $namespaces : {
        "base" : "aria.html.beans.InputElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a CheckBox widget.",
            $properties : {
                "bind" : {
                    $type : "base:Properties.bind",
                    $properties : {
                        "checked" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding. The text input's checked property is set in the bound object."
                        }
                    }
                }
            }
        }
    }
});
