/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Element widget for the Embed Lib
 */
Aria.classDefinition({
    $classpath : "aria.embed.Element",
    $extends : "aria.widgetLibs.BaseWidget",
    $dependencies : ["aria.embed.CfgBeans", "aria.utils.Html", "aria.core.JsonValidator", "aria.core.Log",
            "aria.utils.Dom"],
    $constructor : function (cfg, context, lineNumber) {
        // The parent constructor takes care of storing the config in this._cfg, the template context in this._context
        // and the line number in this._lineNumber
        this.$BaseWidget.constructor.apply(this, arguments);


        this._cfgOk = aria.core.JsonValidator.validateCfg(this._cfgBeanName, cfg);

    },
    $destructor : function () {
        if (this._domId) {
            /* BACKWARD COMATIBILITY BEGIN */
            // typo on onEmbeddedElementDispose
            if (this._cfg.controller.onEmbededElementDispose) {
                this.$logWarn("onEmbededElementDispose has been deprecated, please use onEmbeddedElementDispose");
                this._cfg.controller.onEmbededElementDispose(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
            } else {
            /* BACKWARD COMATIBILITY END */
                this._cfg.controller.onEmbeddedElementDispose(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
            /* BACKWARD COMATIBILITY BEGIN */
            }
            /* BACKWARD COMATIBILITY END */
            // When the backward compatibility is removed, only the else should remain
        }
        this.$BaseWidget.$destructor.apply(this, arguments);
    },
    $prototype : {

    _cfgBeanName : "aria.embed.CfgBeans.ElementCfg",

        /**
         * Main widget entry-point. Write the widget markup for a non-container widget.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            if (this._cfgOk) {
                this._domId = this._createDynamicId();
                var tagName = this._cfg.type;
                var markup = ['<', tagName, ' id="', this._domId, '"'];
                if (this._cfg.attributes) {
                    markup.push(' ' + aria.utils.Html.buildAttributeList(this._cfg.attributes));
                }
                markup.push('></' + tagName + '>');
                out.write(markup.join(''));
            }
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            if (this._cfgOk) {
                /* BACKWARD COMATIBILITY BEGIN */
                // typo on onEmbeddedElementDispose
                if (this._cfg.controller.onEmbededElementCreate) {
                    this.$logWarn("onEmbededElementCreate has been deprecated, please use onEmbeddedElementCreate");
                    this._cfg.controller.onEmbededElementCreate(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
                } else {
                /* BACKWARD COMATIBILITY END */
                    this._cfg.controller.onEmbeddedElementCreate(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
                /* BACKWARD COMATIBILITY BEGIN */
                }
                /* BACKWARD COMATIBILITY END */
                // When the backward compatibility is removed, only the else should remain
            }
        }
    }
});
