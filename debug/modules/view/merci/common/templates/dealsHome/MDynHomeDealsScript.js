Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.dealsHome.MDynHomeDealsScript",
	$dependencies: ["modules.view.merci.common.utils.URLManager", "modules.view.merci.common.utils.MCommonScript", "modules.view.merci.common.utils.MerciGA"],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;	
	},

	$prototype: {

		$dataReady: function(args, cb) {
			
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var cntrySite = "";
			var cntryCode = "";
			var defaultCountry = "";
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null && this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam.siteDefaultCountrySel == 'IP' && (this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == "")) {
				defaultCountry = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.ipSelectedCountry;
				this.moduleCtrl.setValueforStorage(defaultCountry, 'defaultCountry');
			} else {
				defaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry');
			}
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {
				var retainAppCriteria = this.moduleCtrl.getModuleData().booking.MListOffers_A.requestParam.retainAppCriteria;
			} else {
				var retainAppCriteria = "";
			}
			if (defaultCountry == null || defaultCountry == "") {
				/* Condition for PTR 08032431: Deals displayed are not as per the country selected */
				if (!this.__merciFunc.isTabletDevice()) {
					defaultCountry = this.getParam('COUNTRY_SITE');
				}
				if (defaultCountry == null || defaultCountry == "") {
					defaultCountry = base[13];
					this.moduleCtrl.setValueforStorage(defaultCountry, 'defaultCountry');
				}
			}
			/*var siteParam = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;
			if ((siteParam.siteMyFavorite == "TRUE") && (siteParam.allowBookmarksParam == "TRUE")) {
				this.bookmarkBtn = true;				 
				this.getBookmarkData();
			} else {
				this.bookmarkBtn = false;
				pageDeals.printUI = true;
			}*/				
			if (this.moduleCtrl.getModuleData() == null || this.moduleCtrl.getModuleData().booking.MListOffers_A == null || (args != undefined && args.SELECTED_COUNTRY != null && args.SELECTED_COUNTRY != this.moduleCtrl.getValuefromStorage('defaultCountry')) || (this.__merciFunc.isTabletDevice() && this.getParam('COUNTRY_SITE') != this.moduleCtrl.getValuefromStorage('defaultCountry'))) {
				if (args != undefined && args.SELECTED_COUNTRY != null) {
					this.moduleCtrl.setValueforStorage(args.SELECTED_COUNTRY, 'defaultCountry');
					defaultCountry = args.SELECTED_COUNTRY;
				}
				var params = 'result=json&SELECTED_COUNTRY=' + defaultCountry + '&REMEMBER_SRCH_CRITERIA=' + retainAppCriteria;
				var request = {
					parameters: params,
					action: 'DealsOffersApi.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onDealsCallback,
						args: params,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				this.sectionReady = true;
			}
			if (document.getElementById("offer_id_list") != null) {
				var list = document.getElementById("offer_id_list").value;
				var listOfOffers = list.split("-");
				this.moduleCtrl.setValueforStorage(listOfOffers, 'offerListBookMarked');
			}
			if (this.moduleCtrl.getModuleData().booking.MListOffers_A != null) {
				var siteParams = this.moduleCtrl.getModuleData().booking.MListOffers_A.siteParam;				
				// google analytics
				this.__ga.trackPage({
					domain: siteParams.siteGADomain,
					account: siteParams.siteGAAccount,
					gaEnabled: siteParams.siteGAEnable,
					page: 'Fare Deals?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
					GTMPage: 'Fare Deals?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
				});
			}
		},

		$displayReady: function() {
			
		},
		$viewReady: function() {

		
		},
		__onDealsCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				modules.view.merci.common.utils.MCommonScript.hideMskOverlay(false);
				var json = this.moduleCtrl.getModuleData();
				json.booking.MListOffers_A = response.responseJSON.data.booking.MListOffers_A;
				//this.__setInitialData(json.booking);
				this.dealsSectionReady = true;
				this.$refresh({
					section: 'dealsContent'
				});
			}
		},
		getParam: function(name) {
			if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
				return decodeURIComponent(name[1]);
		},
		_isSelectedCountry: function(args) {

			var countryCodeMatched = this.getParam('COUNTRY_SITE') == args.country.code;
			var defaultCountryMatched = this.moduleCtrl.getValuefromStorage('defaultCountry') == args.country.code;
			var noCountryCode = this.getParam('COUNTRY_SITE') == null || this.getParam('COUNTRY_SITE') == '';
			var ipMatched = args.listParentOfferBean.ipCountry != null && args.listParentOfferBean.ipCountry == args.country.code;
			var noDefaultCountry = this.moduleCtrl.getValuefromStorage('defaultCountry') == null || this.moduleCtrl.getValuefromStorage('defaultCountry') == '';

			return defaultCountryMatched || (noDefaultCountry && (countryCodeMatched || (noCountryCode && ipMatched)));
		},
		setScroll:function(id,length){
			var that = this;
			setTimeout(function() {
				if(length!=0){
					var scrollerWidth = 100 * length;
					var liWidth = Math.round(1000/length) / 10;
			  		document.getElementById(id+'_olScroll').style.width = scrollerWidth.toString() + "%";
     			   	for (var panel=0; panel<length; panel++) {
						document.getElementById(id+'_liScroll_'+panel).style.width = liWidth.toString() + "%";
	 				}
					 that.myscroll = new iScroll(that.$getId(id+'_dynaScroller'), {
						 snap: true,
					     hScrollbar: false,
						 vScrollbar: false,
						 vScroll: false,
						 checkDOMChanges: true,
					     momentum: false,
					     onScrollEnd: function() {
							var setCrumb = {count: this.currPageX, id:id};
							that.$callback({
								fn: that.shiftCrumb,
								scope: that
							}, setCrumb);
						}
					});
				 }
			}, 10);
		},

		shiftCrumb: function(setCrumb){
			var that = this;
			that.setCrumb = setCrumb;
			$('nav#searchCrumb ol li').removeClass('on');
			$('nav#searchCrumb ol li').each(function(index){
				if(index == that.setCrumb.count){
					$(this).addClass('on');
				}
			});

		}
	}	
});