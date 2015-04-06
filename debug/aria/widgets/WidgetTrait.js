/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * WidgetTrait is a class to share code between input widgets and action widgets, although this can be extended to
 * include other widget types in the future. The purpose of this class is not to be created directly, but to allow its
 * prototype to be imported.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.WidgetTrait",
    $dependencies : ["aria.widgets.form.InputValidationHandler"],
    $constructor : function () {
        // The purpose of this class is to provide a prototype to be imported, not to be created directly.
        this.$assert(11, false);
    },
    $prototype : {
        /**
         * Method used when a validation popup is needed for an input field
         * @protected
         */
        _validationPopupShow : function () {
            // check validation popup isn't already displayed
            if (!this._onValidatePopup) {
                this._onValidatePopup = new aria.widgets.form.InputValidationHandler(this);
            }
            this._onValidatePopup.show();
        },

        /**
         * Method used to close the validation popup of an input field
         * @protected
         */
        _validationPopupHide : function () {
            if (this._onValidatePopup) {
                this._onValidatePopup.hide();
            }
        },

        /**
         * Method used to get a dom reference for positioning the popup
         */
        getValidationPopupReference : function () {
            return this.getDom();
        }
    }
});
