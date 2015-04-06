/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * @class aria.widgets.action.ActionWidget Base class for all action widgets such as buttons, icon buttons and links.
 * This class will handle the onclick action.
 * @extends aria.widget.Widget
 */
Aria.classDefinition({
    $classpath : "aria.widgets.action.ActionWidget",
    $extends : "aria.widgets.Widget",
    $dependencies : ["aria.utils.Function", "aria.utils.Dom", "aria.templates.DomEventWrapper",
            "aria.widgets.WidgetTrait"],
    /**
     * ActionWidget constructor
     * @param {aria.widgets.CfgBeans:ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber line number in current template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$Widget.constructor.apply(this, arguments);

        /**
         * TODOC
         * @protected
         * @type HTMLElement
         */
        this._actingDom = null;
    },
    $destructor : function () {
        if (this._onValidatePopup) {
            this._onValidatePopup.$dispose();
            this._onValidatePopup = null;
        }
        if (this._actingDom) {
            this._actingDom = null;
        }

        this.$Widget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = aria.widgets.WidgetTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },

        /**
         * Called when a new instance is initialized
         * @protected
         */
        _init : function () {

            var actingDom = aria.utils.Dom.getDomElementChild(this.getDom(), 0);
            if (actingDom) {
                this._actingDom = actingDom;
                this._initActionWidget(actingDom);
            }
            actingDom = null;
        },

        /**
         * A method available to inheriting classes to be called at the end of the instance _init method
         * @param {HTMLElement} actingDom
         * @private
         */
        _initActionWidget : function (actingDom) {},

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} domEvent
         * @method
         * @private
         */
        _dom_onclick : function (domEvent) {
            this._performAction(domEvent);
        },

        /**
         * Performs the action associated with the widget. Normally called for example when clicked or a key is pressed
         */
        _performAction : function (domEvent) {
            var cfg = this._cfg;
            if (cfg) {
                var domEvtWrapper;
                if (domEvent) {
                    domEvtWrapper = new aria.templates.DomEventWrapper(domEvent);
                }
                var returnValue = this.evalCallback(cfg.onclick, domEvtWrapper);
                if (domEvtWrapper) {
                    domEvtWrapper.$dispose();
                }
                if (cfg.error && cfg.errorMessages.length) {
                    this._validationPopupShow();
                } else {
                    this._validationPopupHide();
                }
                return returnValue;
            }
            return true;
        },

        /**
         * Focus the Element
         */
        focus : function () {
            if (!this._focusElt) {
                this.getDom();
            }
            this._focusElt.focus();
        }
    }
});
