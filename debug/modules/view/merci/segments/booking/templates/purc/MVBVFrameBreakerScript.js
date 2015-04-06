Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MVBVFrameBreakerScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager'
	],
	$prototype: {

		$viewReady: function() {

			var request = {
				formObj: document.getElementById('BREAK_FORM'),
				action: 'MMBookTripPlan.action',
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.__onBreakFormCallBack,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MVBVFrameBreaker",
						data:{}
					});
			}
		},

		__onBreakFormCallBack: function(response, args) {

			if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {

				var json = this.moduleCtrl.getModuleData();
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

				json.booking[dataId] = response.responseJSON.data.booking[dataId];
				json.header = response.responseJSON.data.header;

				// navigate to next page
				this.moduleCtrl.navigate(null, nextPage);
			}
		}
	}
});