/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.classDefinition({
    $classpath : "aria.utils.Orientation",
    $dependencies : ["aria.utils.Event"],
    $singleton : true,
    $events : {
        "change" : {
            description : "This event is fired when there is orientation change on the device",
            properties : {
                "screenOrientation" : "Current Orientation of the device",
                "isPortrait" : "Boolean values to tell if the screen is portrait"
            }
        }
    },

    /**
     * Adding a listener while initializing Orientation to listen to the native orientationchange event.
     */
    $constructor : function () {
        var window = Aria.$window;
        if (typeof(window.orientation) != "undefined") { // check if browser support orientation change
            this.screenOrientation = window.orientation;
            this.isPortrait = this.__isPortrait();

            // start listening native event orinetationchange.
            aria.utils.Event.addListener(window, "orientationchange", {
                fn : this._onOrientationChange,
                scope : this
            });
        }
    },

    $destructor : function () {
        aria.utils.Event.removeListener(Aria.$window, "orientationchange", {
            fn : this._onOrientationChange
        });
    },

    $prototype : {

        /**
         * Callback executed after orientation of the device is changed. This raises a wrapper event for the native
         * event orientationchange and provides properties screenOrientation which is exact value of window.orientation
         * and additional variable isPortrait to tell if device orientation is portrait
         * @protected
         */
        _onOrientationChange : function () {
            this.screenOrientation = Aria.$window.orientation;
            this.isPortrait = this.__isPortrait();
            // raise event "change" to notify about orientation change along with properties for current orientation
            this.$raiseEvent({
                name : "change",
                screenOrientation : this.screenOrientation,
                isPortrait : this.isPortrait
            });
        },

        /**
         * Returns a boolean value to signify if the device orientation is portrait.
         * @private
         * @return {Boolean}
         */
        __isPortrait : function () {
            if (Aria.$window.orientation % 180 === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
});
