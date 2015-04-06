/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.html.beans.TextAreaCfg",
    $description : "Configuration for Text Area widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "base" : "aria.html.beans.ElementCfg",
        "baseInput" : "aria.html.beans.InputElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a Text Input widget.",
            $properties : {
                "tagName" : {
                    $type : "base:Properties.tagName",
                    $description : "Automatically set to textarea by the framework. It cannot be overridden in the configuration.",
                    $mandatory : true
                },
                "bind" : {
                    $type : "baseInput:Properties.bind",
                    $properties : {
                        "value" : {
                            $type : "common:BindingRef",
                            $description : "Bi-directional binding. The text input's value is set in the bound object on blur."
                        }
                    }
                },
                "on" : {
                    $type : "base:Properties.on",
                    $properties : {
                        "type" : {
                            $type : "common:Callback",
                            $description : "Callback called when the user types inside the input. It corresponds to a keydown."
                        }
                    }
                },
                "autoselect" : {
                    $type : "json:Boolean",
                    $description : "Autoselect for the input field. If true, the whole text inside the field is automatically selected when the user clicks on it.",
                    $default : false
                }
            }
        }
    }
});
