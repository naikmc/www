Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MPriceBreakdownScript',
	$constructor: function() {},

	$prototype: {
		$dataReady: function() {
			this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
			if(this.data.rqstParams.reply && this.data.rqstParams.reply.tripPlanBean != undefined){
				this.data.rqstParams.tripPlanBean = this.data.rqstParams.reply.tripPlanBean;
			}
			if(this.data.rqstParams.reply && this.data.rqstParams.reply.serviceCategories != undefined){
				this.data.rqstParams.serviceCategories = this.data.rqstParams.reply.serviceCategories;
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPriceBreakdown",
						data:this.data
					});
			}
		},

		openPriceDetails: function(evt) {

			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){

				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				aria.utils.Json.setValue(popup, 'data', {
					bRebooking: this.bRebookingNew,
					labels: this.data.labels,
					siteParams: this.data.siteParams,
					rqstParams: this.data.rqstParams,
					globalList: this.data.globalList,
					finalAmount: this.finalAmountNew,
					'currCode':this.data.currCode,
         			'exchRate':this.data.exchRate,
					fromPage: this.data.fromPage,
					insData: {
						amount: this.totalAmtNew
					},
						'payLaterElig': this.data.payLaterElig
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "priceBreakDown"
				});		

				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);	

				this.moduleCtrl.navigate(null, 'Popup');

			}else{

				if (evt != null) {
					evt.stopPropagation();
				}

				this.moduleCtrl.showMskOverlay();

				// showing all the popup with class as 'popup'
				var popups = document.getElementsByClassName('popup');
				for (var i = 0; i < popups.length; i++) {
					if (popups[i].id == 'pricePopup') {
						popups[i].style.display = 'block';
					}
				}

				// scroll to top
				window.scrollTo(0, 0);
			}
			
		},

		openFareCondition: function(evt) {

			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){

				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				aria.utils.Json.setValue(popup, 'data', {
					labels: this.data.labels,
					siteParams: this.data.siteParams,
					rqstParams: this.data.rqstParams
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "fareConditions"
				});			

				this.moduleCtrl.navigate(null, 'Popup');
				
			}else{

				if (evt != null) {
					evt.stopPropagation();
				}

				this.moduleCtrl.showMskOverlay();

				// showing all the popup with class as 'popup and facs'
				var popups = document.getElementsByClassName('popup facs');
				for (var i = 0; i < popups.length; i++) {
					popups[i].style.display = 'block';
				}

				// scroll to top
				window.scrollTo(0, 0);
			}
		},

		openHTML: function(args, data) {

			var enableNewPopup = false;
			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){
				enableNewPopup =  true ;
			}
			data.moduleCtrl = this.moduleCtrl ;
			data.enableNewPopup = enableNewPopup ;
			modules.view.merci.common.utils.MCommonScript.openHTML(data);
		},

		closePopup: function(args, data) {
			// close the popup
			this.moduleCtrl.closePopup();
		},

		getNumOfChargeableSeats: function(allServicesByPax, itineraries) {
			var count = 0;
			if (allServicesByPax != null) {
				for (var serviceByPaxRecord in allServicesByPax) {
					var allServicesByItinerary = allServicesByPax[serviceByPaxRecord].allServicesByItinerary;
					for (var i in itineraries) {
						var itinerary = itineraries[i];
						var servicesByItinerary = allServicesByItinerary[itinerary.itemId];
						if (servicesByItinerary != null) {
							for (var s in itinerary.segments) {
								var segment = itinerary.segments[s];
								var seatNumber = servicesByItinerary[segment.id];
								if (seatNumber != null && seatNumber.hasPriceInfo == true)
									count++;
							}
						}
					}
				}
			}
			return count;

		},
		//get Minirules data
		openFareRule: function(e, data) {
			var fareButtonsEnabled = modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableFareButtons);
			var miniRulesEnabled = modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.siteMiniRule) && modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.siteMCMiniRule);
			if(!miniRulesEnabled && fareButtonsEnabled){
				this.openFareCondition();
			}			
			else{	
			e.preventDefault();
			var actionCall = "MMiniRules";
			var request = {
				parameters: null,
				method: 'POST',
				expectedResponseType: 'json',
				cb: {
					fn: this.__miniRuleCallback,
					scope: this
				}
			}

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			request.isCompleteURL = true;
			request.action = bp[0] + "://" + bp[1] + ":" + bp[2] + "/plnext/" + bp[4] + "/" + actionCall + ".action;jsessionid=" + jsonResponse.data.framework.sessionId;
			request.action += "?SITE=" + bp[11];
			request.action += "&LANGUAGE=" + bp[12];
			request.action += "&TRANSACTION_ID=MiniRules";
			request.action += "&PAGE_TICKET=" + data.pgTkt;
			if (data.fromPage == "CONF") {
				request.action += "&RULE_SOURCE_1_ALL_SUBSOURCES_TYPE=TST";
				request.action += "&RULE_SOURCE_1_TYPE=RECORD_LOCATOR";
				request.action += "&RULE_SOURCE_1_ID=" + data.recLoc;
			}
			request.action += "&result=json";
			request.loading = true;

			// COUNTRY_SITE
			if (bp[13] != null && bp[13] != '') {
				request.action += "&COUNTRY_SITE=" + bp[13];
			}

			// CLIENT
			if (bp[14] != null && bp[14] != '') {
				request.action += "&client=" + bp[14];
			}

			// start an Ajax request
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			}	
		},
		//callback function for minirule request
		__miniRuleCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				if (response.responseJSON.data.booking.MError_A == null) {
					jsonResponse.data.booking.MMiniRule_A = response.responseJSON.data.booking.MMiniRule_A;
					var pageId = response.responseJSON.homePageId;
					this.moduleCtrl.navigate(null, pageId);
				} else {
					var pageId = response.responseJSON.homePageId;
					this.openFareCondition();
				}
			}
		},
		__getServicesPrices: function() {
			if (this.data.rqstParams.servicesSelection && this.data.rqstParams.servicesSelection.totalPrice != null && this.data.rqstParams.servicesSelection.totalPrice.totalAmount != null) {
				return this.data.rqstParams.servicesSelection.totalPrice.totalAmount;
			}

			return 0;
		}
	}

});