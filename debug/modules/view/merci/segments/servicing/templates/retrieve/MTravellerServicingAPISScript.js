Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MTravellerServicingAPISScript",
	$dependencies: [
		'aria.utils.Date',
		'modules.view.merci.common.utils.MCommonScript'
	],

	$statics: {
		FILTERED_ERRORS: ['8134', '14300', '14250']
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {
			var model = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A;
			//this.__processError(model);
			/*if(!this.utils.isEmptyObject(model.requestParam.BEError)){
				var err = model.requestParam.BEError;
				var arr = [];
				for (var key in err){
					if(err.hasOwnProperty(key) && err[key] != null){
						var error = {'TEXT': err[key]};
						arr.push(error);
					}
				}
				this.data.messages = this.utils.readBEErrors(arr);
			}
			if(!this.utils.isEmptyObject(model.requestParam.errors)){
				this.data.messages = this.utils.readBEErrors(model.requestParam.errors);
			}
			if(!this.utils.isEmptyObject(model.requestParam.errorMap)){
				var err = model.requestParam.errorMap;
				var arr = [];
				for (var key in err){
					if(err.hasOwnProperty(key) && err[key] != null){
						var error = this.utils.convertErrorFromBean(model.errorStrings[err[key]]);
						arr.push(error);
					}
				}
				this.data.messages = this.utils.readBEErrors(arr);
			}		*/
			//window.scrollTo(0, 0);
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
						tpl:"MTravellerServicingAPIS",
						data:this.data
					});
			}
		},

		showPaxDetails: function(evt) {
			var json = this.moduleCtrl.getModuleData().APISdetails.MTravellerListAPIS_A;
			var params = {
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				SERVICE_PRICING_MODE: "INIT_PRICE",
				ACTION: "MODIFY",
				DIRECT_RETRIEVE_LASTNAME: json.requestParam.listTravellerBean.primaryTraveller.identityInformation.lastName,
				REC_LOC: json.requestParam.param.REC_LOC,
				PAGE_TICKET: json.requestParam.pageTicket,
				ISAPISMISSING: json.requestParam.param.isApisMissing
			};
			this.utils.sendNavigateRequest(params, 'MTravellerDetails.action', this);
		},

		onSave: function(evt) {
			this.data.errors = [];
			var formElmt = document.getElementById(this.$getId("APISForm"));
			var saveInput = document.createElement('input');
			saveInput.type = 'hidden';
			saveInput.id = 'buttonSave';
			saveInput.name = 'buttonSave';
			saveInput.value = 'Save';
			formElmt.appendChild(saveInput);
			var request = this.utils.navigateRequest(formElmt, 'MobileSaveApisInfoAction.action', {
				fn: this.__saveCallback,
				scope: this
			});
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
		},

		__saveCallback: function(response) {
			var json = response.responseJSON;
			if (json) {
				var nextPage = json.homePageId;
				var jsonData = this.moduleCtrl.getModuleData();
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				// navigate to next page
				if (dataId == 'MTravellerListAPIS_A') {
					this.__processError(json.data.APISdetails.MTravellerListAPIS_A);
					var pageID = document.getElementsByName('PAGE_TICKET');
					for (i = 0; i < pageID.length; i++)
						pageID[i].value = json.data.APISdetails.MTravellerListAPIS_A.requestParam.pageTicket
				} else {
					if (json.data.booking != null) {
						jsonData.booking[dataId] = json.data.booking[dataId];
					}
					if (json.data.MPassengerDetails != null) {
						jsonData.MPassengerDetails = json.data.MPassengerDetails;
					}
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		__processError: function(model) {
			if (!this.utils.isEmptyObject(model.requestParam.errorMap)) {
				var err = model.requestParam.errorMap;
				var arr = [];
				for (var key in err) {
					if (err.hasOwnProperty(key) && err[key] != null && model.errorStrings[err[key]] != undefined) {
						this.__addErrorMessage(model.errorStrings[err[key]].localizedMessage + " (" + model.errorStrings[err[key]].errorid + ")");
					}
				}
			}
			window.scrollTo(0, 0);
			aria.utils.Json.setValue(this.data, 'errorOccured', true);
		},

		__addErrorMessage: function(message) {
			// if errors is empty
			if (this.data.errors == null) {
				this.data.errors = new Array();
			}
			// create JSON and append to errors
			var error = {
				'TEXT': message
			};
			this.data.errors.push(error);
		}


	}
});