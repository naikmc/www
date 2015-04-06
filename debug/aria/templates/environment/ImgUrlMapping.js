/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.classDefinition({
    $classpath : "aria.templates.environment.ImgUrlMapping",
    $dependencies : ["aria.templates.environment.ImgUrlMappingCfgBeans"],
    $extends : "aria.core.environment.EnvironmentBase",
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.templates.environment.ImgUrlMappingCfgBeans.AppCfg",

        /**
         * Get the imgUrlMapping classpath configuration. It is a copy of the current configuration and not a reference to
         * the object itself.
         * @public
         * @return {aria.core.environment.environment.EnvironmentBaseCfgBeans:AppCfg} The classpath configuration
         */
        getImgUrlMappingCfg : function () {
            return aria.utils.Json.copy(this.checkApplicationSettings("imgUrlMapping"));
        }
    }
});
