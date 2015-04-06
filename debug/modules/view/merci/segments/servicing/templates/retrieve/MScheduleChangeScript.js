Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MScheduleChangeScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},


	$prototype: {

		$dataReady: function() {

			// remove any class from body
			var body = document.getElementsByTagName('body');
			for (var i = 0; i < body.length; i++) {
				body[i].className = '';
			}

			$('body').attr('id', 'schChange');
			var err = this.moduleCtrl.getModuleData().MScheduleChange.reply;
			if (err.errors != null) {
				this.data.errors = err.errors;
			}
		},

		$viewReady: function() {
			var header = this.moduleCtrl.getModuleData().headerInfo;
			this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: "",
				showButton: true
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MScheduleChange",
						data:this.data
					});
			}
		},

		/**
		 * Event handler when the user clicks on the 'Retrieve' button.
		 * Goes to retrieve form.
		 */
		onSave: function(evt) {
			var formElmt = document.getElementById(this.$getId('MAPForm'));
			this.utils.sendNavigateRequest(formElmt, 'MAcknowledgeSegments.action', this);
		}

	}
});