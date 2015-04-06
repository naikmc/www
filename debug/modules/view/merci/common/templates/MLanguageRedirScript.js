Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MLanguageRedirScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {

	},

	$prototype: {

		$displayReady: function() {

			// set JSON for future reference
			this.data.baseParams = modules.view.merci.common.utils.URLManager.getBaseParams();
			this.data.rqstParams = this.moduleCtrl.getModuleData().booking.MLanguageRedir.requestParam;

			var url = this.data.baseParams[0] + '://' + this.data.baseParams[1] + this.data.baseParams[10] + '/' + this.data.baseParams[4] + '/' + this.data.rqstParams.action + '.action?' + 'SITE=' + this.data.rqstParams.site + '&LANGUAGE=' + this.data.rqstParams.language;

			var parameters = 'result=json';
			if (this.data.rqstParams.mt != null) {
				parameters += '&MT=' + this.data.rqstParams.mt;
			}

			var request = {
				action: url,
				parameters: parameters,
				isCompleteURL: true,
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this._onLangRedirCallback,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		_onLangRedirCallback: function(response, args) {

			// get response
			var json = response.responseJSON;

			if (json != null) {

				// get reference of module controller data
				var moduleData = this.moduleCtrl.getModuleData();

				for (var key in json.data) {
					if (json.data.hasOwnProperty(key)) {
						if (moduleData[key] == null) {
							moduleData[key] = {};
						}

						for (var data in json.data[key]) {
							// set response
							if (json.data[key].hasOwnProperty(data)) {
								moduleData[key][data] = json.data[key][data];
							}
						}
					}
				}

				// navigate to respective page
				modules.view.merci.common.utils.MCommonScript.resetPageInfo();
				this.moduleCtrl.navigate(null, json.homePageId);
			} else {
				// go to previous page
				this.moduleCtrl.goBack();
			}
		}
	}
});