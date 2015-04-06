/*
* Copyright 2012 Amadeus s.a.s.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

Aria.beanDefinitions({
    $package : "modules.view.merci.common.widgets.SpinWheel.SpinWheelCfgBeans",
    $description : "SpinWheel configuration beans",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "common" : "aria.widgetLibs.CommonBeans",
        "base" : "aria.html.beans.ElementCfg"
    },
    $beans : {
        "SpinWheelCfg" : {
            $type : "json:Object",
            $description : "Configuration of the SpinWheel widget.",
            $properties : {
                id : {
                    $type : "json:String",
                    $description : "Id for SpinWheel widget.",
                    $default : "SpinWheelWidgetId"
                },
                monthInd : {
                    $type : "json:String",
                    $description : "Index of starting month.",
                    $default : "0"
                },                
                controlInputs : {
                    $type : "json:Object",
                    $description : "Elements to control by the widget",
                    $default : null
                },
                bind : {
                    $type : "json:Object",
                    $description : "Automatic bindings for the widget properties",
                    $properties : {
                        value : {
                            $type : "json:Object",
                            $description : "Binding for the widget's value",
                            $properties : {
                                inside : {
                                    $type : "json:ObjectRef",
                                    $description : "Reference to the object that holds the property to bind to.",
                                    $mandatory : true
                                },
                                to : {
                                    $type : "json:String",
                                    $description : "Name of the property to bind to.",
                                    $mandatory : true
                                }
                            }
                        }
                    }
                }
            }
        }

    }
});