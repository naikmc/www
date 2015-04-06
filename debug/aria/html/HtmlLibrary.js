/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.classDefinition({
    $classpath : "aria.html.HtmlLibrary",
    $extends : "aria.widgetLibs.WidgetLib",
    $singleton : true,
    $prototype : {
        widgets : {
            "TextInput" : "aria.html.TextInput",
            "TextArea" : "aria.html.TextArea",
            "Template" : "aria.html.Template",
            "CheckBox" : "aria.html.CheckBox",
            "RadioButton" : "aria.html.RadioButton",
            "Select" : "aria.html.Select"
        }
    }
});
