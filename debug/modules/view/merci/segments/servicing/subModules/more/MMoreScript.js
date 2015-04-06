Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.more.MMoreScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.URLManager'],
	$constructor: function() {
		pageObjMore = this;
		pageObjMore.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		pageObjMore._ajax = modules.view.merci.common.utils.URLManager;
	},
	$prototype: {

		$dataReady: function() {
			pageObjMore.json = {};
			pageObjMore.__merciFunc.getStoredItemFromDevice(merciAppData.DB_MORE, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
		                        result = JSON.parse(result);
		                    }
				    pageObjMore.json.labels = result.labels;
				    pageObjMore.json.rqstParams = result.rqstParams;
					pageObjMore.json.siteParams = result.siteParams;
				}			
               			pageObjMore.printUI = true;
		                pageObjMore.$refresh();
			});
		},

		$displayReady: function() {},

		$viewReady: function() {
			if (pageObjMore.printUI == true) {
				if (pageObjMore.__merciFunc.booleanValue(pageObjMore.json.siteParams.enableLoyalty) == true && pageObjMore.json.rqstParams.IS_USER_LOGGED_IN == true) {
					var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
					var loyaltyInfoJson = {
						loyaltyLabels: pageObjMore.json.labels.loyaltyLabels,
						airline: bp[16],
						miles: bp[17],
						tier: bp[18],
						title: bp[19],
						firstName: bp[20],
						lastName: bp[21],
						programmeNo: bp[22]
					};
				}
				pageObjMore.moduleCtrl.setHeaderInfo({
					title: pageObjMore.json.labels.tx_merciapps_more,
					bannerHtmlL: pageObjMore.json.rqstParams.bannerHtml,
					homePageURL: pageObjMore.json.siteParams.homeURL,
					showButton: false,
					companyName: pageObjMore.json.siteParams.sitePLCompanyName,
					loyaltyInfoBanner: loyaltyInfoJson
				});
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MMore",
						data:{}
					});
			}
		},

		onSettingClick: function() {
			pageObjMore.moduleCtrl.navigate(null, 'merci-MSetting_A');
		},
		onTermCondClick: function() {},
		onFAQClick: function() {},
		onPrivacyPolicyClick: function() {}
	}
});