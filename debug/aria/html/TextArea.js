/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * TextArea widget. Bindable widget providing bi-directional bind of 'value' and on 'type' event callback.
 */
Aria.classDefinition({
    $classpath : "aria.html.TextArea",
    $extends : "aria.html.TextInput",
    $dependencies : ["aria.html.beans.TextAreaCfg"],
    $constructor : function (cfg, context, line) {
        this.$TextInput.constructor.call(this, cfg, context, line);

        // TextInput adds a type attribute which is not needed and therefore removed
        delete cfg.attributes.type;
    },
    $prototype : {
        /**
         * Tagname to use to generate the markup of the widget
         */
        tagName : "textarea",

        /**
         * Classpath of the configuration bean for this widget.
         */
        $cfgBean : "aria.html.beans.TextAreaCfg.Properties",

        writeMarkup : function (out) {
            //skip direct parent to allow self-closing usage of the textarea widget
            this.$Element.writeMarkupBegin.call(this, out);
            this.$Element.writeMarkupEnd.call(this, out);
        }
    }
});
