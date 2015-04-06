/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Interface exposed from a map provider.
 * @class aria.map.providers.IMapProvider
 */
Aria.interfaceDefinition({
    $classpath : 'aria.map.providers.IMapProvider',
    $interface : {
        /**
         * Load the map scripts
         * @param {aria.core.CgfBeans:Callback} cb
         */
        load : function (cb) {},

        /**
         * @param {aria.map.CfgBeans:MapCfg} cfg
         * @return {Object} Map instance. null if the dependencies are not loaded
         */
        getMap : function (cfg) {},

        /**
         * @param {Object} map previously created through the getMap method
         */
        disposeMap : function () {}
    }
});
