/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.classDefinition({
    $classpath : 'aria.templates.PublicWrapper',
    $prototype : {
        /**
         * Classpath of the interface to be used as the public interface of this public wrapper.
         * @type String
         */
        $publicInterfaceName : null,

        /**
         * Return the public interface wrapper associated to an object.
         * @return {Object} the public interface object
         */
        $publicInterface : function () {
            return this.$interface(this.$publicInterfaceName);
        }
    }
});
