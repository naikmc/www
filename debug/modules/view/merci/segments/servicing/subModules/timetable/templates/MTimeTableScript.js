Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],
	$constructor: function() {
		pageObj = this;
		this.ttData = {};
		this.ttData.contentId = 1;
		this.ttData.segmentSelected = 0;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {

			if (this.moduleCtrl.getModuleData().servicing == null && localStorage.getItem("currentHashString") == "merci-MTTBRE_A") {

				var params = localStorage.getItem("customParams");
				var actionName = localStorage.getItem("actionName");
				localStorage.setItem("currentHashString", "");
				localStorage.setItem("customParams", "");
				localStorage.setItem("actionName", "");
				$('body').addClass('timetable tmdv list');
				modules.view.merci.common.utils.MCommonScript.sendNavigateRequest(params, 'MTimeTable.action', this);
			}
			this.data.rqstParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam;
			this.data.labels = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.labels;
			this.setPageHeader();
			if(!this.__merciFunc.isEmptyObject(this.data.rqstParams.segmentSelected)){
				this.ttData.segmentSelected=this.data.rqstParams.segmentSelected;
			}
			this.moduleCtrl.getModuleData().timeTableParent = this;
			this.data.errors = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam.errors;
			aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
			// added as a part of CR : 09173131 
			this.setContentIDValue();
		},

		$displayReady: function() {
			$('body').removeClass('fava flight-status shtm sear');
			$('body').addClass('tmdv list timetable');
		},
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MTimeTable",
						data:this.data
					});
			}
		},
		// Added as a part of CR : 09173131 To make the TimeTable Day/Week View based on parameter MC_TIMETBL_DEF_VIEW
		setContentIDValue: function(){
		this.data.siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam;
			if (this.data.siteParams.timetableDefaultView == "DAY"){
				this.$json.setValue(this.ttData, "contentId", 1);
			}else{
				this.$json.setValue(this.ttData, "contentId", 2);
			}
		},
		changeTab: function(evt, arg) {



			this.$json.setValue(this.ttData, "contentId", arg.id);
			this.__merciFunc.addClass(document.getElementById(arg.current), "active");
			this.__merciFunc.removeClass(document.getElementById(arg.tochange), "active");

		},


		//Method added for PTR 07251900- back button implementation in case of custom flight info
		setPageHeader: function() {
			var header = this.moduleCtrl.getModuleData().headerInfo;
			this.data.siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam;
			if (this.__merciFunc.booleanValue(this.data.siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(this.data.rqstParams.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: this.data.labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}

			this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: true,
				companyName: this.data.siteParams.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});
		},


		__addMsg: function(type, msg) {
			// create JSON and append to errors
			var message = {
				'TEXT': msg
			};
			// if errors is empty
			if (type == "info") {
				if (this.infoMsgs == null) {
					this.infoMsgs = new Array();
				}

				if (this.infoMsgs.length == 0)
					this.infoMsgs.push(message);
				else {
					for (var i in this.infoMsgs) {
						if (this.infoMsgs[i].TEXT != msg)
							this.infoMsgs.push(message);
					}
				}
			} else {
				if (this.data.errors == null) {
					this.data.errors = new Array();
				}
				if (this.data.errors.length == 0)
					this.data.errors.push(message);
				else {
					for (var i in this.data.errors) {
						if (this.data.errors[i].TEXT != msg)
							this.data.errors.push(message);
					}

				}

			}

		},

		__removeWarning: function(msg) {
			for (var i in this.infoMsgs) {
				if (this.infoMsgs[i].TEXT == msg)
					this.infoMsgs.splice(i, 1);
			}
		}

	}
});