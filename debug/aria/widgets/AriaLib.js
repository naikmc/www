/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Widget library provided by the Aria Templates framework.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.AriaLib",
    $singleton : true,
    $extends : "aria.widgetLibs.WidgetLib",
    $prototype : {
        /**
         * Map of all the widgets in the library. Keys in the map are widget names as they can be used in templates.
         * Values are the corresponding classpaths.
         * @type {Object}
         */
        widgets : {
            "Fieldset" : "aria.widgets.container.Fieldset",
            "Button" : "aria.widgets.action.Button",
            "IconButton" : "aria.widgets.action.IconButton",
            "Tooltip" : "aria.widgets.container.Tooltip",
            "Text" : "aria.widgets.Text",
            "Calendar" : "aria.widgets.calendar.Calendar",
            "Dialog" : "aria.widgets.container.Dialog",
            "Link" : "aria.widgets.action.Link",
            "Div" : "aria.widgets.container.Div",
            "TextField" : "aria.widgets.form.TextField",
            "Textarea" : "aria.widgets.form.Textarea",
            "Splitter" : "aria.widgets.container.Splitter",
            "Tab" : "aria.widgets.container.Tab",
            "TabPanel" : "aria.widgets.container.TabPanel",
            "PasswordField" : "aria.widgets.form.PasswordField",
            "DateField" : "aria.widgets.form.DateField",
            "DatePicker" : "aria.widgets.form.DatePicker",
            "MultiSelect" : "aria.widgets.form.MultiSelect",
            "TimeField" : "aria.widgets.form.TimeField",
            "NumberField" : "aria.widgets.form.NumberField",
            "AutoComplete" : "aria.widgets.form.AutoComplete",
            "CheckBox" : "aria.widgets.form.CheckBox",
            "RadioButton" : "aria.widgets.form.RadioButton",
            "Icon" : "aria.widgets.Icon",
            "SelectBox" : "aria.widgets.form.SelectBox",
            "Select" : "aria.widgets.form.Select",
            "SortIndicator" : "aria.widgets.action.SortIndicator",
            "Template" : "aria.widgets.Template",
            "List" : "aria.widgets.form.list.List",
            "Gauge" : "aria.widgets.form.Gauge",
            "ErrorList" : "aria.widgets.errorlist.ErrorList",
            "MultiAutoComplete" : "aria.widgets.form.MultiAutoComplete"
        }
    }
});
