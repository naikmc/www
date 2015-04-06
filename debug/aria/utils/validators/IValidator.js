/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Implemented by all validators
 */
Aria.interfaceDefinition({
    $classpath : "aria.utils.validators.IValidator",
    $interface : {
        /**
         * Validate will always fail by default.
         * @param {String} value
         * @return {Object}
         */
        validate : "Function"
    }
});
