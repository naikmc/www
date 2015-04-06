/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * @class aria.widgets.form.Textarea Textarea widget
 * @extends aria.widgets.form.TextInput
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.form.Textarea',
    $extends : 'aria.widgets.form.TextInput',
    $dependencies : ['aria.widgets.controllers.TextDataController'],
    $css : ["aria.widgets.form.TextareaStyle"],
    $statics : {
        LABEL_HEIGHT : 13
    },
    /**
     * Textarea constructor
     * @param {aria.widgets.CfgBeans.TextareaCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new aria.widgets.controllers.TextDataController();
        this.$TextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this._isTextarea = true;
        cfg.labelHeight = (cfg.labelHeight > -1) ? cfg.labelHeight : this.LABEL_HEIGHT;

        this.cfg = cfg;
    },

    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Textarea",

        _dom_onkeydown : function (event) {

            var maxlength = this.cfg.maxlength;
            if (maxlength > -1) {

                // The maxlength is managed by a setTimeout in order to manage each situation
                // For example, the cut and paste (the clipboard is not accessible in javascript)

                var textarea = this.getTextInputField();
                var caretPosition = this.getCaretPosition();
                var oldVal = textarea.value;
                var that = this;

                setTimeout(function () {
                    var newVal = textarea.value;
                    if (newVal.length > maxlength) {
                        // The selected part of the current value is not considered
                        var start = caretPosition.start;
                        var end = caretPosition.end;

                        var newPart = newVal.substr(start, maxlength - oldVal.length + end - start);

                        textarea.value = oldVal.substr(0, start) + newPart + oldVal.substr(end);
                        var index = start + newPart.length;
                        that.setCaretPosition(index, index);
                    }
                }, 25);
            }
        }
    }
});
