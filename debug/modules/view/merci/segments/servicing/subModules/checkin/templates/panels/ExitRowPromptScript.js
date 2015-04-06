Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.ExitRowPromptScript',

  $constructor: function() {},

  $prototype: {

	  $viewReady: function() {

		  setTimeout(function(){
			  jQuery(".forMCIDialogbox").removeClass("loading");
		        $('.msk.loading').css('display', 'none');
		        $('.msk.forMCIDialogbox').css('display', 'block');
		  },700);

	  },
    // Function called on cancel click
    onCancelClick: function(evt) {
      try {
    	  this.$logInfo('ExitRowPromptScript::Entering $dataReady function');
        // this function helps to close the prompt
        var fn = function() {

        	  jQuery('#serviceoverlayCKIN').hide();
              $('.msk.forMCIDialogbox').css('display', 'none');

          jQuery('#serviceoverlayCKIN').hide();
          jQuery("#serviceoverlayCKIN").disposeTemplate();
          window.history.back();
          this.raiseEvent({
            "name": "seat.updated.loaded",
            "args": emergencyExitInput
          });
        }
        jQuery(jQuery.currentTarget(evt)).tap(fn);
      } catch (exception) {
        this.logError(
          'ExitRowPromptScript::An error occured in $dataReady function',
          exception);
      }
    },

    // This function is called on continue click, the selected answer is noted and allocation of seat is continued
    onContinue: function(evt, args) {
      try {
    	  this.$logInfo('ExitRowPromptScript::Entering onContinue function');
        evt.preventDefault();
        var form = jQuery("#serviceoverlayCKIN form");
        //var promptAnswers = form.serializeObject();
        //var answer = jQuery('input[name=answer]:checked').val();
        var answer = args.value;
        this.moduleCtrl.setExitRowListAnswerForAll(answer);
        var selectedProdForSeatMap = this.moduleCtrl.getSelectedProductForSeatMap();
        var exitRowPassengers = this.moduleCtrl.getExitRowPsngrs();
        // input json
        var emergencyExitInput = {
          "exitRowPeassengers": exitRowPassengers,
          "selectedCPR": this.moduleCtrl.getSelectedPax(),
          "seatMapProdIndex": selectedProdForSeatMap.seatMapProdIndex,
          "STATUS_INDICATOR": answer
        }

        jQuery('#serviceoverlayCKIN').hide();
        $('.msk.forMCIDialogbox').css('display', 'none');

        //we call the controller to retrive
        this.moduleCtrl.emergencyExitSeatAlllocation(emergencyExitInput);

      } catch (exception) {
    	  this.logError(
          'ExitRowPromptScript::An error occured in onContinue function',
          exception);
      }
    }
  }
});