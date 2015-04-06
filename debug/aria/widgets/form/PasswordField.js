/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Password widget
 * @class aria.widgets.form.PasswordField
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.form.PasswordField',
    $extends : 'aria.widgets.form.TextInput',
    $dependencies : ['aria.widgets.controllers.TextDataController'],
    /**
     * PasswordField constructor
     * @param {aria.widgets.CfgBeans:PasswordFieldCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new aria.widgets.controllers.TextDataController();
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this._isPassword = true;
    },
    $prototype : {}
});
