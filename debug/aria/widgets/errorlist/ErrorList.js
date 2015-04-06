/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Error list widget, which is a template-based widget. Most of the logic of the error list widget is implemented in the
 * ErrorListController class. This class only does the link between the properties of the error list widget and the
 * error list controller.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.errorlist.ErrorList",
    $extends : "aria.widgets.TemplateBasedWidget",
    $dependencies : ["aria.widgets.Template", "aria.widgets.errorlist.ErrorListController", "aria.DomEvent"],
    $onload : function () {
        /*
         * Preload the default template here, to improve performances TODO: find a better way, to also improve
         * performances for custom templates
         */
        Aria.load({
            templates : ['aria.widgets.errorlist.ErrorListTemplate']
        });
    },
    $constructor : function (cfg, ctxt) {
        this.$TemplateBasedWidget.constructor.apply(this, arguments);
        var skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, this._cfg.sclass);
        var divCfg = aria.utils.Json.copy(cfg, true, ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'block',
                'maxHeight']);
        divCfg.sclass = skinObj.divsclass;
        divCfg.margins = "0 0 0 0";
        divCfg.id = cfg.id + "_div";
        this._initTemplate({
            defaultTemplate : this._cfg.defaultTemplate,
            moduleCtrl : {
                classpath : "aria.widgets.errorlist.ErrorListController",
                initArgs : {
                    divCfg : divCfg,
                    filterTypes : cfg.filterTypes,
                    displayCodes : cfg.displayCodes,
                    title : cfg.title,
                    messages : cfg.messages
                }
            }
        });
    },

    $destructor : function () {
        this.$TemplateBasedWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @type String
         * @protected
         */
        _skinnableClass : "ErrorList",

        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            this._inOnBoundPropertyChange = true;
            try {
                if (propertyName == "messages") {
                    var domId = this._domElt;
                    this._subTplModuleCtrl.setMessages(newValue, domId);
                }
                this._cfg[propertyName] = newValue;
            } finally {
                this._inOnBoundPropertyChange = false;
            }
        }
    }
});
