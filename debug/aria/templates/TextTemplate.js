/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Base class from which all text templates inherit.
 */
Aria.classDefinition({
    $classpath : "aria.templates.TextTemplate",
    $extends : "aria.templates.BaseTemplate",
    $dependencies : ["aria.templates.TxtCtxt"],
    $prototype : {
        /**
         * Data model available to the text template. It can be overridden by the text template context.
         * @type Object
         */
        data : {},
        /**
         * Prototype init method called at prototype creation time. Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         */
        $init : function (p, def) {
            // The prototype should be an instance of Template, that inherits from BaseTemplate
            p.$BaseTemplate.constructor.classDefinition.$prototype.$init(p, def);

            /**
             * This method can be called to process the Text Template: it receives data that the text template has
             * access to, it creates the text template context, and it calls the macro_main of the text template to
             * which the context is associated and it returns a string. It is a property of the constructor because it
             * is not desirable that it ends up in the prototype of the TextTemplate and all of its descendants.
             * @param {Object} data model available to the text template.
             * @return {String}
             */
            aria.templates.TextTemplate.processTextTemplate = function (data) {
                var textContext = new aria.templates.TxtCtxt();
                textContext.initTemplate({
                    "classpath" : this.prototype.$classpath,
                    "data" : data
                });
                var stringToReturn = textContext.getTextTemplateContent();
                textContext.$dispose();
                return stringToReturn;
            };

        }
    }
});
