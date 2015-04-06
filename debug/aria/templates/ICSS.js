/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Interface exposed from a CSS template context to its CSS template.
 * @class aria.templates.ICSS
 */
Aria.interfaceDefinition({
    $classpath : 'aria.templates.ICSS',
    $extends : 'aria.templates.IBaseTemplate',
    $events : {},
    $interface : {
        /**
         * Prefix used by the CSS template
         * @type String
         */
        prefix : "Object"
    }
});
