/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * SelectBox widget allows to select a value in an array of predefined values
 */
Aria.classDefinition({
    $classpath : "aria.widgets.form.SelectBox",
    $extends : "aria.widgets.form.DropDownTextInput",
    $dependencies : ["aria.widgets.form.DropDownListTrait", "aria.widgets.controllers.SelectBoxController"],
    $css : ["aria.widgets.form.SelectBoxStyle", "aria.widgets.form.list.ListStyle", "aria.widgets.container.DivStyle"],
    $statics : {
        DUPLICATE_VALUE : "%1 - Duplicate values %2 found in options"
    },
    /**
     * RadioButton constructor
     * @param {aria.widgets.CfgBeans:SelectBoxCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new aria.widgets.controllers.SelectBoxController();
        this.$DropDownTextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this.controller.setListOptions(this._cfg.options);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "SelectBox",

        $init : function (p) {
            var src = aria.widgets.form.DropDownListTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },
        /**
         * This method checks the consistancy of the values provided in the attributes of SelectBox and logs and error
         * if there are any descripancies
         */
        _checkCfgConsistency : function () {
            this.$DropDownTextInput._checkCfgConsistency.call(this);
            var opt = this._cfg.options;
            var values = [];
            var dupValues = [];
            var map = {};

            for (var count = 0; count < opt.length; count++) {
                if (map[opt[count].value]) {
                    dupValues.push(opt[count].value);
                } else {
                    map[opt[count].value] = true;
                    values.push(opt[count]);
                }
            }
            if (dupValues.length > 0) {
                this.controller.setListOptions(values);
                this.$logError(this.DUPLICATE_VALUE, [dupValues]);
            }

        },
        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */

        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {

            if (propertyName === "options") {
                this.controller.setListOptions(newValue);
                var report = this.controller.checkValue(null);
                this._reactToControllerReport(report, {
                    stopValueProp : true
                });
            } else {
                aria.widgets.form.SelectBox.superclass._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }
        }
    }
});
