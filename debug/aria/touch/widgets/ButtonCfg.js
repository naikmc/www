/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.touch.widgets.ButtonCfg",
    $description : "Configuration for Button widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "base" : "aria.html.beans.ElementCfg",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "Properties" : {
            $type : "base:Properties",
            $description : "Properties of a Button widget.",
            $properties : {
                "on" : {
                    $type : "base:Properties.$properties.on",
                    $properties : {
                        "type" : {
                            $type : "common:Callback",
                            $description : "Callback called when the user interacts with the button."
                        }
                    }
                },
                "isLink" : {
                    $type : "json:Boolean",
                    $description : "Whether the button is a link, which means a different highlighting pattern.",
                    $default : false
                },
                "delay" : {
                    $type : "json:Integer",
                    $description : "delay between and tapstart event and highlighting of the link or button in milliseconds."
                },
                "tagName" : {
                    $type : "base:Properties.$properties.tagName",
                    $description : "Tag to be used for Button markup."
                }
            }
        }
    }
});
