/**
 * @class aria.templates.Template Base class from which all templates inherit.
 *        Some methods will be added to instances of this class, from the
 *        TemplateCtxt class.
 */
Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.GenericContainerScript',

  $prototype: {

    /**
     * onBackClick :
     * Event handler triggered when the user click/touch the
     * back element
     */
    onBackClick: function(evt) {
      try {
        MC.appCtrl.logInfo('GenericContainerScript::Entering onBackClick function');
        var _this = this;
        var fn = function(evt) {
          var lastLayout = _this.moduleCtrl.getLastLayout();
          if (lastLayout == "checkin/EditCPR") {
            window.history.go(-3);
          } else if (lastLayout == "checkin/Nationality") {
            //window.history.go(-2);
            window.history.back();
          } else if (lastLayout == "checkin/initiateAcceptance" && _this.moduleCtrl.getIsFlowInCancelCheckin() == 1) {
            _this.moduleCtrl.setIsFlowInCancelCheckin(0);
            MC.appCtrl.load("checkin/home");
          } else if (lastLayout == "checkin/home") {
            MC.appCtrl.load("checkin/home");
          } else {
            window.history.back();
          }
        };

        jQuery(jQuery.currentTarget(evt)).tap(fn);
      } catch (exception) {
        MC.appCtrl.logError(
          'GenericContainerScript::An error occured in onBackClick function',
          exception);
      }
    },

    /**
     * showOverlay :
     * This takes the window height into account and displays splash screen over an overlay
     */
    showOverlay: function(showSpinner) {
      try {
        MC.appCtrl.logInfo('GenericContainerScript::Entering showOverlay function');
        var field = document.createElement('input'); /** this is to handle the overlay issue when the keypad is active on the android device*/
        field.setAttribute('type', 'text');
        document.body.appendChild(field);
        var counter = 0;
        setTimeout(function() {
          counter++;
          if (counter == 0) {
            field.focus();
          } else {
            field.blur();
          }
          setTimeout(function() {
            field.setAttribute('style', 'display:none;');
          }, 50);
        }, 50);


        var htmlheight = $(document).height();
        if (this.data.pageID == "checkin-home" && this.moduleCtrl.getEmbeded()) {
          htmlheight = htmlheight + 100;
        }
        jQuery('#overlayCKIN').css('height', htmlheight + 'px');
        jQuery('#overlayCKIN').show();
        if (showSpinner) {
          window.scrollTo(0, 0);
          var scrolledHeight = $(window).scrollTop();
          var windowHeight = $(window).height();
          var height = scrolledHeight + (windowHeight / 2)
          jQuery('#splashScreen').css('top', height + 'px');
          jQuery('#splashScreen').show();
        }
        return;
      } catch (exception) {
        MC.appCtrl.logError(
          'GenericContainerScript::An error occured in showOverlay function',
          exception);
      }
    }
  }
});