Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.PromptScript',

  $constructor: function() {},

  $prototype: {

    // Function called on cancel click
    onCancelClick: function(evt) {
      try {
        MC.appCtrl.logInfo('PromptScript::Entering $dataReady function');
        // this function helps to close the prompt
        var fn = function() {
          jQuery('#overlayCKIN').hide();
          jQuery('#serviceoverlayCKIN').hide();
          jQuery("#serviceoverlayCKIN").disposeTemplate();
        }
        jQuery(jQuery.currentTarget(evt)).tap(fn);
      } catch (exception) {
        MC.appCtrl.logError(
          'PromptScript::An error occured in $dataReady function',
          exception);
      }
    },

    // This function is called on ok click, the selected answer is noted and confirmation is continued based on the answer
    onOkClick: function(evt) {
      try {
        MC.appCtrl.logInfo('PromptScript::Entering onOkClick function');
        evt.preventDefault();
        var form = jQuery("#serviceoverlayCKIN form");
        // If Yes is chosen, the corresponding errors are displayed
        if (jQuery('input[name=answer]:checked').val() == "Y") {
          jQuery('#overlayCKIN').hide();
          jQuery('#serviceoverlayCKIN').hide();
          var errors = [];
          errors.push({
            "localizedMessage": JSONData.uiErrors[25000013].localizedMessage
          });
          this.moduleCtrl.displayErrors(errors, "initiateandEditErrors", "error");
          jQuery("#serviceoverlayCKIN").disposeTemplate();
          return null;
        }
        // prompt answers
        var promptAnswers = [{
          "answer": jQuery('input[name=answer]:checked').val(),
          "action": this.data.promptBean.action
        }, {
          "action": "FFN",
          "answer": "Y"
        }];
        //input json
        var initiateAcceptInput = {
          "selectedCPR": this.moduleCtrl.getSelectedPax(),
          "promptAnswers": promptAnswers
        }

        jQuery('#serviceoverlayCKIN').hide();
        this.showOverlay(true);
        //we call the controller to retrive
        this.moduleCtrl.initiateAccept(initiateAcceptInput);

      } catch (exception) {
        MC.appCtrl.logError(
          'PromptScript::An error occured in onOkClick function',
          exception);
      }
    }
  }
});