Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MErrorPageScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function() {

	},

	$prototype: {

		__createErrorJSONObject: function(message) {
			return {
				TEST: message
			};
		},

		$dataReady: function() {

			this.data.errors = new Array();
			var merciFunc = modules.view.merci.common.utils.MCommonScript;
			var errors = this.moduleCtrl.getModuleData().booking.MError_A.errors;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MError_A.requestParam;
			var labels = this.moduleCtrl.getModuleData().booking.MError_A.labels;
			var siteParams = this.moduleCtrl.getModuleData().booking.MError_A.siteParam;

			var sessionExpired = false;
			var hasCheckError = !merciFunc.isEmptyObject(rqstParams.checkError) && rqstParams.checkError.length > 0;

			var homeURL = siteParams.homeURL;
			if (homeURL == null || homeURL == '') {
				homeURL = modules.view.merci.common.utils.URLManager.getFullURL('MHomeLogin.action', null);
			}

			// set header data
			this.moduleCtrl.setHeaderInfo({
				title: labels.tx_start_over,
				bannerHtmlL: null,
				homePageURL: homeURL,
				showButton: true
			});

			// iterate over CHECK_BE_ERROR
			if (!merciFunc.isEmptyObject(rqstParams.checkBEError)) {
				for (var key in rqstParams.checkBEError) {
					if (rqstParams.checkBEError.hasOwnProperty(key)) {
						if (rqstParams.checkBEError[key].indexOf('3001') != -1) {
							// reset list
							this.data.errors = new Array();
							this.data.errors.push(this.__createErrorJSONObject(rqstParams.checkBEError[key]));

							// break out of loop
							sessionExpired = true;
							break;
						} else {
							if (hasCheckError == false) {
								this.data.errors.push(this.__createErrorJSONObject(rqstParams.checkBEError[key]));
							} else {
								// add only 7072 error
								if (key == '7072') {
									this.data.errors.push(this.__createErrorJSONObject(errors['7072']));
								}
							}
						}
					}
				}
			}


			// iterate over LIST_MSG- added for timetable. PTR 7255948
			else if (!merciFunc.isEmptyObject(rqstParams.listMsg)) {
				for (var key in rqstParams.listMsg) {
					if (rqstParams.listMsg[key].NUMBER == 3001) {
						// reset list
						this.data.errors = new Array();
						this.data.errors.push(this.__createErrorJSONObject(rqstParams.listMsg[key].TEXT));

						// break out of loop
						sessionExpired = true;
						break;
					} else {
						if (hasCheckError == false) {
							this.data.errors.push(this.__createErrorJSONObject(rqstParams.listMsg[key].TEXT));
						} else {
							// add only 7072 error
							if (key == '7072') {
								this.data.errors.push(this.__createErrorJSONObject(errors['7072']));
							}
						}
					}

				}
			}

			// print error message if session has not expired
			if (sessionExpired == false && hasCheckError == true) {
				for (var key in rqstParams.checkError) {
					if (rqstParams.checkError.hasOwnProperty(key)) {
						if (key == '8132') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130039']));
						} else if (key == '8104') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130020']));
						} else if (key == '4649') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130038']));
						} else if (key == '15069') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130062']));
						} else if (key == '8500' || key == '8501' || key == '8502' || key == '8503' || key == '8504') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130037']));
						} else if (key == '10000') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130237']));
						} else if (key == '10001') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130182']));
						} else if (key == '10036') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130202']));
						} else if (key == '10031') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130203']));
						} else if (key == '10003') {
							this.data.errors.push(this.__createErrorJSONObject(rqstParams.checkError[key]));
						} else if (key == '10002' || key == '4002') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130153']));
						} else if (key == '66002') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130185']));
						} else if (key == '10031') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130201']));
						} else if (key == '10021') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130191']));
						} else if (key == '10026') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130192']));
						} else if (key == '3001') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130221']));
						} else if (key == '9100') {
							this.data.errors.push(this.__createErrorJSONObject(errors['2130238']));
						} else if (key == '10035') {
							this.data.errors.push(this.__createErrorJSONObject(rqstParams.checkError[key]));
						} else {
							this.data.errors.push(this.__createErrorJSONObject(rqstParams.checkError[key]));
						}
					}
				}
			}

			// if no error populated then
			if (this.data.errors.length == 0) {
				this.data.errors.push(this.__createErrorJSONObject(errors['7072']));
			}
		},

		_getLabels: function() {
			// if not null
			if (this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.MError_A != null && this.moduleCtrl.getModuleData().booking.MError_A.labels != null) {
				return this.moduleCtrl.getModuleData().booking.MError_A.labels;
			}

			return {};
		}

	}
});