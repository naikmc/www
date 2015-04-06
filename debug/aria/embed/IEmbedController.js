/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Default interface for an embed controller
 */
Aria.interfaceDefinition({
    $classpath : "aria.embed.IEmbedController",
    $interface : {
        /**
         * Called when the widget is being displayed
         * @param {HTMLElement} domContainer Container of this embed based widget
         * @param {Object} args arguments given in the embed Element widget
         */
        onEmbeddedElementCreate : function (domContainer, arg) {},
        /**
         * Called when the widget is being disposed
         * @param {HTMLElement} domContainer Container of this embed based widget
         * @param {Object} args arguments given in the embed Element widget
         */
        onEmbeddedElementDispose : function (domContainer, arg) {}
    }
});
