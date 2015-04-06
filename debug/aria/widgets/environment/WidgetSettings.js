/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Contains getters for the Number environment.
 * @class aria.utils.environment.WidgetSettings
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.widgets.environment.WidgetSettings",
    $extends : "aria.core.environment.EnvironmentBase",
    $dependencies : ["aria.widgets.environment.WidgetSettingsCfgBeans"],
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         * @protected
         */
        _cfgPackage : "aria.widgets.environment.WidgetSettingsCfgBeans.AppCfg",

        /**
         * Returns the widget settings
         * @public
         * @return {aria.widgets.environment.WidgetSettingsCfgBeans:AppCfg.WidgetSettingsCfg}
         */
        getWidgetSettings : function () {
            return this.checkApplicationSettings("widgetSettings");
        }

    }
});
