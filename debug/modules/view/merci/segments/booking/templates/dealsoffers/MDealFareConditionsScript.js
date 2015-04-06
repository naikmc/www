Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.dealsoffers.MDealFareConditionsScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],

	$constructor: function() {
		pageObj = this;

		// merci common method
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		__onFareCondCB: function(response, inputParams) {

			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				var json = this.moduleCtrl.getModuleData();
				json.booking = response.responseJSON.data.booking;
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (dataId == 'MERROR_A') {
					this.moduleCtrl.navigate(null, nextPage);
				} else {
					var travelEndDate = this.getTravelEndDate();
					this.moduleCtrl.setValueforStorage(travelEndDate, 'TRAVEL_END_DATE');

					// displaying search page
					this.showCond = true;
					this.$refresh({
						section: 'fareCondContent'
					});
					document.getElementById("travelPeriod").innerHTML = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam.dbean.facsPageContent;
				}
			}
		},

		$dataReady: function() {
			_this = this;
			// if search page data is not available
			if (this.moduleCtrl.getModuleData().booking == null || this.moduleCtrl.getModuleData().booking.MFACS_A == null) {
				var oId = this.__merciFunc.getStoredItem('OID');
				var cSite = this.__merciFunc.getStoredItem('countrySite');
				var params = 'result=json&offer_id=' + oId + '&COUNTRY_SITE=' + cSite;
				var actionName = 'MFareCond.action';
				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onFareCondCB,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				var travelEndDate = this.getTravelEndDate();
				this.moduleCtrl.setValueforStorage(travelEndDate, 'TRAVEL_END_DATE');
				this.showCond = true;
			}
		},

		$displayReady: function() {
			$("body").removeClass();
			$("body").addClass("daof fac");

			// set details for header
			if (this.moduleCtrl.getModuleData().booking.MFACS_A != null) {

				var labels = this.moduleCtrl.getModuleData().booking.MFACS_A.labels;
				var siteParams = this.moduleCtrl.getModuleData().booking.MFACS_A.siteParam;
				var rqstParams = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam;

				if (this.__merciFunc.booleanValue(siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(rqstParams.IS_USER_LOGGED_IN) == true) {
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
				this.moduleCtrl.setHeaderInfo({
					title: labels.tx_merci_text_do_deals_and_offers,
					bannerHtmlL: rqstParams.bannerHtml,
					homePageURL: siteParams.homeURL,
					showButton: true
				});

				if (document.getElementById("travelPeriod").innerHTML == "") {
					document.getElementById("travelPeriod").innerHTML = rqstParams.dbean.facsPageContent;
				}
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MDealFareConditions",
						data:{}
					});
			}
		},

		toggle: function(a, b) {
			var attr1 = document.getElementById(b.ID1).getAttribute("aria-expanded");
			if (attr1 == 'false') {
				document.getElementById(b.ID1).setAttribute("aria-expanded", "true");
			} else {
				document.getElementById(b.ID1).setAttribute("aria-expanded", "false");
			}
			var attr2 = document.getElementById(b.ID2).getAttribute("aria-hidden");
			if (attr2 == 'false') {
				document.getElementById(b.ID2).setAttribute("aria-hidden", "true");
				document.getElementById(b.ID2).className = "displayNone";
			} else {
				document.getElementById(b.ID2).setAttribute("aria-hidden", "false");
				document.getElementById(b.ID2).className = "";
			}

			if (b.contentLink != null && b.dispID != null) {
				this.gethtml(b.contentLink, b.dispID);
			}
		},

		gethtml: function(contentLink, id) {
			var request = {
				action: contentLink,
				isCompleteURL: true,
				method: 'GET',
				cb: {
					fn: this.__onHtmlFetchCallback,
					scope: this,
					args: id
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},
		__onHtmlFetchCallback: function(response, params) {
			document.getElementById(params).innerHTML = response.responseText;
		},
		$afterRefresh: function() {

		},
		getTravelEndDate: function() {
			var endDate = this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam.selectedOfferBean.travelEnd;
			var endSplit = endDate.split(" ");
			var es = endSplit[0].replace(/-/g, '/');
			var endDT = new Date(es);
			var endDispDate = endDT.toString();
			var formatDate = endDispDate.split(" ");
			return formatDate[0] + " " + formatDate[2] + " " + formatDate[1] + " " + formatDate[3];
		},
		isPaxExist: function(paxType) {
			if (this.moduleCtrl.getModuleData().booking.MFACS_A.requestParam.selectedOfferBean.paxRestrictions[paxType] != null) {
				return true;
			} else {
				return false
			}
		}


	}
});