Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.GenericPageScript',

  $constructor: function() {
    this.type = null;
    this.messages = [];
  },

  $prototype: {
    $viewReady: function() {
      try {
        MC.appCtrl.logInfo('GenericPageScript::Entering $viewReady function');
        this.moduleCtrl.raiseEvent({
          name: "page.load",
          pageID: this.data.pageID,
          pageCfg: this.data.pageCfg
        });
      } catch (exception) {
        MC.appCtrl.logError(
          'GenericPageScript::An error occured in $viewReady function',
          exception);
      }
    },

    /**
     * getMessages :
     * Retrieves the messages associated with the current page.
     */
    getMessages: function() {
      try {
        MC.appCtrl.logInfo('GenericPageScript::Entering getMessages function');
        return this.messages;
      } catch (exception) {
        MC.appCtrl.logError(
          'GenericPageScript::An error occured in getMessages function',
          exception);
      }
    },

    /**
     * onModuleEvent:
     * This method is called when module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        MC.appCtrl.logInfo('GenericPageScript::Entering onModuleEvent function');
        switch (evt.name) {
          case "page.refresh":
            if (this.data.pageID == evt.pageID) {
              this.messages = [];
              this.$refresh();
            }
            break;
          case "error.display":
          case "success.display":
          case "warning.display":
            if (this.data.pageID == evt.pageID) {
              this.type = evt.name.replace('.display', '');
              this.messages = evt.messages;
              this.$refresh({
                filterSection: 'messages'
              });
            }
            break;
        }
      } catch (exception) {
        MC.appCtrl.logError(
          'GenericPageScript::An error occured in onModuleEvent function',
          exception);
      }
    }
  }
});