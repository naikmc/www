  /* --------------------------------------------------------------------------------*/
  /*                      CHECKIN.APPCTRL - MAIN JAVASCRIPT                            */
  /* --------------------------------------------------------------------------------*/

  Aria.classDefinition({
    $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.AppCtrl',
    $dependencies: [],
    $constructor: function(devMode) {

      this._controller = null;
      //this._controllerPrivate = null;
      this._init = true; /* true while initializing the page. */
      this._refresh = false;
    },

    $prototype: {

      /*
       * function: init
       * This function init the checkin index page.
       *
       * parameters:
       *  - checkin module controller.
       * return:
       *  - none.
       * TODO code of this controller should be moved to Checkin module controller
       */
      init: function(moduleCtrl) {
        try {
          this.$logInfo('AppCtrl::Entering init function');
          this._controller = moduleCtrl;
          this._refresh = true;
        } catch (exception) {
          this.$logError('AppCtrl::An error occured in init function', null, exception);
        }
      },

      /*
       * load :
       * This function is a wrapper of history to load hash
       * URLs.
       *
       * parameters: - path : the path to load in history.
       *             - errors : errors to stored if any
       * return: - none.
       */
      load: function(path, errors) {
        try {
          this.$logInfo('AppCtrl::Entering load function');
          //this.__errors = errors;
          //var state = jQuery.history.appState;
          //if (path != state) {
          /*Try to load a diffrenet hash than the current one*/
          //jQuery.history.load(path);
          //} else {
          /*Load the same hash, will ultimatelly request a refresh */
          //this._controller.updateLayout(path, this.__errors);
          //}
          this._controller.navigate(null, path);
        } catch (exception) {
          this.$logError(
            'AppCtrl::An error occured in load function',
            exception);
        }
      },


      /**
       * onHistoryCallback :
       * This function is called by the jQuery history pluggin to init
       * and when new path is loaded.
       *
       * parameters:
       *  - hash : the value of the hash to load.
       * return:
       *  - none.
       */
      onHistoryCallback: function(hash) {
        try {
          this.$logInfo('AppCtrl::Entering onHistoryCallback function');

          if (!jQuery.isBlank(hash)) {
            var params = hash.split("/");
            if (!jQuery.isEmpty(params)) {
              var module = params.shift();
              var action = params.shift();
              switch (action) {
                default: this._controller.updateLayout(hash, this.__errors);
                break;
              }
            }
          } else {
            this.load("checkin/home");
          }

        } catch (exception) {
          this.$logError(
            'AppCtrl::An error occured in onHistoryCallback function',
            exception);
        }
      },

      /*
       * Register globaly an handler
       * parameters :
       * - the function which will be called when the event will occur
       * - the scope of the function
       */
      registerHandler: function(fn, context) {
        try {
          this.$logInfo('AppCtrl::Entering registerHandler function');
          var ts = jQuery.now();
          var random = Math.ceil(Math.random() * 100);
          var handlerName = 'handler' + ts + random;
          var additionalArgs = Array.prototype.slice.call(arguments, 2);
          var _this = this;
          window[handlerName] = function() {
            try {
              _this.$logInfo('AppCtrl::Entering registerHandler::' + handlerName + ' function');
              var args = Array.prototype.slice.call(arguments);
              fn.apply(context, args.concat(additionalArgs));
              return false;
            } catch (exception) {
              _this.$logError(
                'AppCtrl::An error occured in registerHandler::' + handlerName + ' function',
                exception);
            }
          };
          return handlerName;
        } catch (exception) {
          this.$logError(
            'AppCtrl::An error occured in registerHandler function',
            exception);
        }
      }
    }
  });