/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Performs a boolean NOT on the argument.
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.transform.NotTransform',
    $constructor : function () {
        this.$JsObject.constructor.call(this);
    },
    $prototype : {
        toWidget : function (val) {
            return !val;
        },
        fromWidget : function (val) {
            return !val;
        }
    }
});
