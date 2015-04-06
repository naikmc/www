Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.booking.templates.login.MDLScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager'

	],
	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.__merciURL = modules.view.merci.common.utils.URLManager;
	},

	$prototype: {
		$viewReady: function() {
			document.getElementById("enterEmailID").style.display = "none";
			document.getElementById("sendEmailButton").style.display = "none";
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MDL",
						data:this.data
					});
			}
		},

		$displayReady: function() {
			this.moduleCtrl.setHeaderInfo("Late Login", null, null, true);
		},

		$dataReady: function() {
			this.data.errors = [];
		},

		sendEmail: function() {
			document.getElementById("enterEmailID").style.display = "block";
			document.getElementById("sendEmailButton").style.display = "none";
			document.getElementById("loginCredentials").style.display = "none";
			document.getElementById("loginCredentialsFooter").style.display = "none";
			console.log(this.data.errors);
			this.data.errors.pop();
			console.log(this.data.errors);
			aria.utils.Json.setValue(this.data, 'errorOccured', true);


		},

		sendMail: function(event, args) {
			event.preventDefault(true);
			this.__userId;
			var elem = document.getElementById("userId");
			elem.value = this.__userId;
			var elem1 = document.getElementById("site");
			var elem2 = document.getElementById("language");
			elem1.value = this.__merciURL.__getSiteCode();
			elem2.value = this.__merciURL.__getLanguageCode();

			var request = {
				formObj: document.getElementById('mailPassword'),
				action: "MResetPassword.action",
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onEmailCallBack,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);

		},

		__onEmailCallBack: function(response) {
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {}
		},

		__onFareFormCallBack: function(response, params) {
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			this.data.errors = [];
			if (response.responseJSON.data != null) {
				if (dataId == 'MDL_A') {
					var message = response.responseJSON.data.login.MDL_A.errorStrings.msg[0].TEXT;
					var error = {
						'TEXT': message
					};
					this.data.errors.push(error);
					aria.utils.Json.setValue(this.data, 'errorOccured', true);
					document.getElementById("sendEmailButton").style.display = "block";
					document.getElementById("firstValidate").innerText = "Retry";
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
				} else {
					if (this.data.errors != null) {
						this.data.errors.pop();
					}
					aria.utils.Json.setValue(this.data, 'errorOccured', true);
					var json = this.moduleCtrl.getModuleData();
					this.__merciFunc.extendModuleData(json, response.responseJSON.data);
					this.moduleCtrl.navigate(null, nextPage);
				}
			}


		},



		submitLForm: function(args, data) {

			/* preventing form submit */
			args.preventDefault(true);
			this.__userId = document.getElementById("USER_ID").value;
			var request = {
				formObj: document.getElementById('loginForm'),
				action: "MDirectLoginResult.action",
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onFareFormCallBack,
					scope: this
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);

		}


	}
});