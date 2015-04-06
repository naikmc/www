/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Contains getters for the WidgetLibs environment.
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.widgetLibs.environment.WidgetLibsSettings",
    $extends : "aria.core.environment.EnvironmentBase",
    $dependencies : ["aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans"],
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans.AppCfg",

        /**
         * Return default widget libraries.
         * @public
         * @return {aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans:AppCfg.defaultWidgetLibs}
         */
        getWidgetLibs : function () {
            var res = this.checkApplicationSettings("defaultWidgetLibs");

            return res;
        }
    }
});
