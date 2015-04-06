Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.booking.templates.login.MUserProfileScript",

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		pageObjUser = this;
	},

	$prototype: {
		$dataReady: function() {
			this.rqstParams = this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam;
			this.gblLists = this.moduleCtrl.getModuleData().login.MUserProfile_A.globalList;
			this.data.errors = [];
		},

		$viewReady: function() {
		if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MUserProfile",
						data:this.data
					});
			}
		},

		$displayReady: function() {
			var headerButton = {};

			headerButton.scope = pageObjUser;
			var arr = [];
			arr.push("login");

			headerButton.loggedIn = true;


			headerButton.button = arr;
			labels = this.moduleCtrl.getModuleData().login.MUserProfile_A.labels;
			siteParam = this.moduleCtrl.getModuleData().login.MUserProfile_A.siteParam;
			requestParam = this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam;

			if (this.__merciFunc.booleanValue(siteParam.enableLoyalty) == true && this.__merciFunc.booleanValue(requestParam.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}

			// set header information
			this.moduleCtrl.setHeaderInfo({
				title: labels.tx_merci_dl_login,
				bannerHtml: requestParam.bannerHtml,
				homePageURL: siteParam.siteHomeURL,
				showButton: true,
				companyName: siteParam.sitePLCompanyName,
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			document.getElementById("passenger").style.display = "block";
			document.getElementById("payment").style.display = "none";
			document.getElementById("newPassword").style.display = "none";
			document.getElementById("new2Password").style.display = "none";
			if (this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam.ENABLE_DIRECT_LOGIN != null && !(this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam.ENABLE_DIRECT_LOGIN == "YES")) {
				document.getElementById("createPass").style.display = "none";
			}
		},



		toggle: function(event, args) {
			modules.view.merci.segments.booking.scripts.MBookingMethods.toggle(event, args);
		},


		divToggle: function(event, args) {
			var attrEL = document.getElementById(args.ID1);
			if (attrEL != null) {
				if (attrEL.getAttribute("aria-expanded") == 'false') {
					document.getElementById(args.ID1).setAttribute("aria-expanded", "true");
				} else {
					document.getElementById(args.ID1).setAttribute("aria-expanded", "false");
				}
			}

			if (document.getElementById("div_payment_" + args.ID1) != null) {
				if (document.getElementById("div_payment_" + args.ID1).style.display == "block" || document.getElementById("div_payment_" + args.ID1).style.display == "") {
					document.getElementById("div_payment_" + args.ID1).style.display = "none"
				} else {
					document.getElementById("div_payment_" + args.ID1).style.display = "block"
				}
			}
		},

		swap: function() {
			document.getElementById("passenger").style.display = "block";
			document.getElementById("payment").style.display = "none";
			document.getElementById("tab_2").className = "navigation";
			document.getElementById("tab_1").className = "active navigation";

		},

		reSwap: function() {
			document.getElementById("passenger").style.display = "none";
			document.getElementById("payment").style.display = "block";
			document.getElementById("tab_2").className = "active navigation";
			document.getElementById("tab_1").className = "navigation";
		},

		createPassword: function() {
			document.getElementById("newPassword").style.display = "block";
			document.getElementById("new2Password").style.display = "block";
			document.getElementById("createPass").style.display = "block";
			document.getElementById("changePassword").style.display = "none";
			var root = document.getElementById("profilePassword");
			var child1 = document.getElementById("profilePassword1");
			var child2 = document.getElementById("profilePassword2");
			root.removeChild(child1);
			root.removeChild(child2);

			input1 = document.createElement("input");
			input1.type = "text";
			input1.name = "PASSWORD_1";
			input1.setAttribute("class", "inputField widthClearFull securitymask");

			input2 = document.createElement("input");
			input2.type = "text";
			input2.name = "PASSWORD_2";
			input2.setAttribute("class", "inputField widthClearFull securitymask");

			document.getElementById("newPassword").appendChild(input1);
			document.getElementById("new2Password").appendChild(input2);


		},
		cancelUpdate: function() {
			this.moduleCtrl.navigate(null, 'merci-Mindex_A');
		},

		useName: function() {
			if (document.getElementById("passport1").checked == true) {
				document.getElementById("passportName").value = this.rqstParams.FIRST_NAME_1;
			} else
				document.getElementById("passportName").value = "";
		},

		logOutProfile: function(event, args) {
			if (this.data.errors != null) {
				for (var i = 0; i < this.data.errors.length; i++) {
					this.data.errors.pop();
				}
			}
			var params = 'result=json';
			var request = {
				parameters: params,
				action: 'MLogoff.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onLogOutCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onLogOutCallBack: function(response) {
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {
				if (dataId == 'Mindex_A') {
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		onSubmitProfile: function(event, args) {
			event.preventDefault();
			var isSubmit = true;
			if (isSubmit) {
				var request = {
					formObj: document.getElementById('profileForm'),
					action: 'MUpdateProfileTravellerInfo.action',
					method: 'POST',
					expectedResponseType: 'json',
					loading: true,
					cb: {
						fn: this.__onProfileFormCallBack,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			}
		},

		__onProfileFormCallBack: function(response) {
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			this.data.errors = [];
			var errorOccuredValue = !this.data.errorOccured;
			if (response.responseJSON.data != null) {

				if (dataId == 'Mindex_A') {
					if (this.data.errors != null) {
						this.data.errors.pop();
					}
					aria.utils.Json.setValue(this.data, 'errorOccured', errorOccuredValue);
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
					this.moduleCtrl.navigate(null, nextPage);
				} else if (dataId == 'MError_A') {
					var message = response.responseJSON.data.booking.MError_A.requestParam.msg[0].TEXT;
					var error = {
						'TEXT': message
					};
					this.data.errors.push(error);
					aria.utils.Json.setValue(this.data, 'errorOccured', errorOccuredValue);
					this.$refresh();
					var mask = document.getElementsByClassName("msk")[0];
					mask.style.display = "none";

				}
			}



		}



	}


});