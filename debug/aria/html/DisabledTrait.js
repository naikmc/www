/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Common class for all elements supporting a disabled attribute
 */
Aria.classDefinition({
    $classpath : "aria.html.DisabledTrait",
    $dependencies : ["aria.utils.Type", "aria.utils.Json"],
    $prototype : {

        /**
         * Initialize the disabled attribute of the widget by taking into account the data model to which it might be
         * bound.
         */
        initDisabledWidgetAttribute : function () {
            var bindings = this._cfg.bind;
            var binding = bindings.disabled;
            if (binding) {
                var newValue = this._transform(binding.transform, binding.inside[binding.to], "toWidget");
                if (aria.utils.Type.isBoolean(newValue)) {
                    this._domElt.disabled = newValue;
                } else {
                    aria.utils.Json.setValue(binding.inside, binding.to, this._domElt.disabled);
                }
            }
        },

        /**
         * Function called when a value inside 'bind' has changed. It only deals with the case in which the bound
         * property is 'disabled'
         * @param {String} name Name of the property
         * @param {Object} value Value of the changed property
         * @param {Object} oldValue Value of the property before the change happened
         */
        onDisabledBind : function (name, value, oldValue) {
            if (name === "disabled") {
                this._domElt.disabled = value;
            }
        }

    }
});
