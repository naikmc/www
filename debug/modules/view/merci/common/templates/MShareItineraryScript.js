Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MShareItineraryScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this._ajax = modules.view.merci.common.utils.URLManager;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {

			this.printUI = false;
			if (jsonResponse.ui == null) {
				jsonResponse.ui = {};
			}
			this.shareData = {};
			this.shareData.shareResponse = {};
		},

		$viewReady: function() {
			var shareSection = document.getElementById('shareItin-email');
			if(shareSection != null)
			{
				this.__merciFunc.toggleClass(shareSection,'show');
			}
		},

		$displayReady: function() {
			if(this.data.errors == undefined || !(this.data.errors.length>=0)){
				$('.shareItin-email').slideToggle("slow");
				//$('.shoppingCartContainer').slideToggle( "slow" );
				$(".shareItin-email").css({ "display": "block" });
			}
		},

		toggleDisplay: function() {
			this.__merciFunc.toggleClass(document.getElementById('tab-1'),'current');
			this.__merciFunc.toggleClass(document.getElementById('tab-2'),'current');
			this.__merciFunc.toggleClass(document.getElementById('tab-1Content'),'current');
			this.__merciFunc.toggleClass(document.getElementById('tab-2Content'),'current');
		},

		sendEmail: function(event,args) {
			var toFieldEL = document.getElementById('travellerToEmail');
			var fromFieldEL = document.getElementById('travellerFromEmail');
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var errors = [];
			if (toFieldEL == null || !this.validateAllEmails(toFieldEL.value)) {
				errors.push({
					//TEXT: this.errorStrings['2130282'].localizedMessage + " (" + this.errorStrings['2130282'].errorid + ")"
					TEXT: this.data.labels.errors[2130282].localizedMessage
				});
			}
			if (fromFieldEL == null || !this.validateAllEmails(fromFieldEL.value)) {
				errors.push({
					//TEXT: this.errorStrings['25000048'].localizedMessage + " (" + this.errorStrings['25000048'].errorid + ")"
					TEXT: this.data.labels.errors[25000048].localizedMessage
				});
			}
			this.__clearErrors();
			if (errors.length == 0) {
			var toContent = document.getElementById('travellerToEmail').value;
			var fromContent = document.getElementById('travellerFromEmail').value;
			var titleContent = document.getElementById('emailTitle').value;
			var emailBody = document.getElementById('emailta').value;
				var params = "FROM="+fromContent+"&TO="+toContent+"&SUBJECT="+titleContent+"&BODY="+emailBody+"&SHARE_ITIN=TRUE&result=json";
			var request = {
				parameters: params,
				action: 'MMailWrapperAction.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__sendEmailCallback,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}
			else{
				this.__addErrors(errors);
			}
		},

		__sendEmailCallback: function(response, args) {
			this.__merciFunc.hideMskOverlay();
			//document.getElementsByClassName("msk loading")[0].style.display = "none";
			if(response){
				var json = response.responseJSON;
				if (json) {
					var pageId = json.homePageId;
					if (pageId === 'merci-MShareItinerary_A') {
						aria.utils.Json.setValue(this.data, 'success_msg', true);						
					} else {
					this.__addError({
							TEXT: this.data.labels.errors[2130024].localizedMessage
					}, true);
						//this.utils.navigateCallback(response, this.moduleCtrl);
						//aria.utils.DomOverlay.detachFrom(document.body);
					}
				}
			}			
		},

		validateAllEmails: function(emailIds) {
			var emailIdArray = emailIds.split(",");
			var areEmailsValid = true;
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			for(var i=0;i<emailIdArray.length;i++)
			{
				if (emailIdArray[i] == null || !filter.test(emailIdArray[i].trim()))
				{
					areEmailsValid = false;
				}
			}
			return areEmailsValid;
		},
		cancelShare: function(response, args) {
			$('.shareItin-email').slideToggle( "slow" );
			//$('.shoppingCartContainer').slideToggle( "slow");
			$(".mskBlue").css({ "display": "none" });
		},
		__addErrors: function(errors) {
			if (errors != null) {
				for (var i = 0; i < errors.length; i++) {
					this.__addError(errors[i], (i == errors.length - 1));
		}
			}
		},
		__addError: function(error, doRefresh) {
			if (error != null) {
				// if null then initialize
				if (this.data.errors == null) {
					this.data.errors = [];
				}
				this.data.errors.push(error);
				if (doRefresh) {
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},
		__clearErrors: function() {
			this.data.errors = [];
			aria.utils.Json.setValue(this.data, 'error_msg', true);
		},
		
		sendSMS : function(){
          var areaCode=document.getElementById('travellerAreaCode').value;
          var phoneNo=document.getElementById('travellerPhoneNo').value;
          var smsContent=document.getElementById('smsta').value;
          var ua = navigator.userAgent.toLowerCase();
          var optionalPlus;
          if(areaCode.indexOf("+") == -1)
          	optionalPlus = "+";
          else
          	optionalPlus = "";
          var url;
          if (areaCode != null && phoneNo != null && smsContent != null) {
	          if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) {				
	           if(ua.indexOf("OS 8_") > -1)
	           	url = "sms:" + optionalPlus + areaCode + phoneNo + "&body=" + encodeURIComponent(smsContent);
	           else
	           	url = "sms://" + optionalPlus + areaCode + phoneNo + ";body=" + encodeURIComponent(smsContent);
			  } else {
			  	url = "sms:" + optionalPlus + areaCode + phoneNo + "?body=" + encodeURIComponent(smsContent);				
			  }
          	window.location.href = url;
          }
		}

	}
});