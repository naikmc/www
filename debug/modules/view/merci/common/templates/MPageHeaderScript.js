Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MPageHeaderScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.urlManager = modules.view.merci.common.utils.URLManager;
		this.buffer = modules.view.merci.common.utils.StringBufferImpl;
	},

	$prototype: {

		$dataReady: function() {
			// set reference
			jsonResponse.pageHeader = this;
			this.headerBadge = jsonResponse.ui;
		},

		$viewReady: function() {

			var po = document.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = 'https://apis.google.com/js/client:plusone.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);

			/*Removing class adding by mytrip to the body tag in order to over come my trip button css to checkin */
			jQuery("body").removeClass("pnr-retrieve over trip");
			/*PTR 08048870 [Medium]: SQ mob-UAT-R15-MCI : To leave a space before the word 'Booking reference' on the checkin identification*/

			if (aria.core.Browser.isIOS) {
				$('.sectionDefaultstyle select').addClass("iphoneselect");
			}
		},

		isSideNavBarEnabled: function() {
			return typeof application.navbarAlignment == 'function' 
					&& (application.navbarAlignment() == 'left' || application.navbarAlignment() == 'right') 
					&& application.slidebars;
		},

		_isSmartBannerLoaded: function(){
			var smartBanner = document.getElementById('smartbanner') ;
			if(!this.utils.isEmptyObject(smartBanner)){
				if(smartBanner.style.top == "0px")
					return true;
			}	
			return false ;		
		},

		$displayReady: function(){

			if (document.getElementById("bannerPanel") != null) {
				document.getElementById("bannerPanel").style.display = 'none';
			}
			if($("#imDiv").length >0){
				if($("#imDiv").hasClass("mcl")){
					if(this.utils.isRTLLanguage()){
						$("header.banner button.tools").css("left","40px");
						$('#tools-buttons-group').addClass('tools-box-important');
					}else{
						$("header.banner button.back").css("left","40px");
					}					
				}else{
					if(this.utils.isRTLLanguage()){
						$("header.banner button.back").css("right","40px");
					}else{
						$("header.banner button.tools").css("right","34px");
						$("header.banner div.tools-box").css("right","40px");
					}
					
				}				
			}	
			$("*[role=button][aria-controls]:not([aria-expanded])").click(function() {
				var control = "#" + $(this).attr('aria-controls').replace(/ /g, ',#');
				var value = $(control).attr('aria-expanded');
				if (value == "true") {
					val = "false"
				} else {
					val = "true"
				};

				if (val == "true") {

					$(control).animate({
						width: "show",
						opacity: 1
					}, {
						duration: "fast",
						easing: "swing",
						complete: function() {
							$(this).attr('aria-expanded', val);
						}
					});


				} else {
					$("#share-buttons-group1").removeClass("showShare");
					$(control).animate({
						width: "hide",
						opacity: 0
					}, {
						duration: "fast",
						easing: "swing",
						complete: function() {
							$(this).attr('aria-expanded', val);
						}
					});
				}

			});

			$('.icon-socialmedia').click(function() {
				$(".tools-box.share").toggleClass("showShare");
			});


			$('#buttonToolId').click(function() {
				if(document.getElementById('tools-buttons-group').style.display=="none" ||document.getElementById('tools-buttons-group').style.display==""){
					document.getElementById('tools-buttons-group').style.display="block";	
				}else{
					document.getElementById('tools-buttons-group').style.display="none";	
				}
				
			});

			$('.icon-close, .icon-key, .bookmark, .icon-currency-converter').click(function() {
				$(".tools-box.share").removeClass("showShare");
				$(".msk").hide();
			});

			$('#closeToolId').click(function() {
				
					if(document.getElementById('tools-buttons-group').style.display=="none"){
					document.getElementById('tools-buttons-group').style.display="block";	
				}else{
					document.getElementById('tools-buttons-group').style.display="none";	
				}	
			});
			

			if (this.headerData != null 
				&& !this.utils.isEmptyObject(loyaltyInfoBanner)) {
			/*CR 7107950*/
				var loyaltyInfoBanner = this.headerData.loyaltyInfoBanner;
				var $header = $(".animationText span");
				var header = [];
				var a = new this.buffer(loyaltyInfoBanner.tx_merci_li_hello);
				if (loyaltyInfoBanner.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1) {
					a = a.formatString([loyaltyInfoBanner.PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1]);
				} else
					a = a.formatString([""]);
				header.push(a);
				if (loyaltyInfoBanner.PREF_AIR_FREQ_LEVEL_1_1) {
					b = new this.buffer(loyaltyInfoBanner.tx_merci_li_youOwn);
					b = b.formatString([loyaltyInfoBanner.PREF_AIR_FREQ_LEVEL_1_1]);
					header.push(b);
				}
				if (loyaltyInfoBanner.PREF_AIR_FREQ_MILES_1_1) {
					var c = new this.buffer(loyaltyInfoBanner.tx_merci_li_yourMileage);
					c = c.formatString([loyaltyInfoBanner.PREF_AIR_FREQ_MILES_1_1]);
					header.push(c);
				}
				var position = -1;
				//Self Executing Function
				! function loop() {
					position = (position + 1) % header.length;
					$header.html(header[position]).fadeIn(2000).delay(2000).fadeOut(2000, loop);
				}();
			}

			/*For loading banner through function togglebanner of mercicommonscript removed here button attribute role='button'
			 * so that it will ignore selector in newuiscript file
			 * -- sectionDefaultstyle -- to decid eit is checkin flow, in checkin flow for all pages this class is there
			 */
			jQuery("#toggle1").attr("role", "");
			/*  END */
			
			if (this.headerData != null 
				&& this.headerData.headerButton != null 
				&& this.headerData.headerButton.button != null) {
				for (var i = 0; i < this.headerData.headerButton.button.length; i++) {
					if (this.headerData.headerButton.button && this.headerData.headerButton.button[i] == "currInfoButton") {
						$('.panel.currencyConverter .validation.cancel').click(function() {
							$(".panel.currencyConverter").removeClass("addHeight");
							$(".cConvertertools ").toggleClass("selected");
							$(".msk").hide();
						});
					};
				}
			}

			jQuery("#toggle1").attr("role", "");

			/* Added as a part of fix for the PTR 08558606, where forced update is done for the services bookmark*/
			if (!this.utils.isEmptyObject(this.headerData) && !this.utils.isEmptyObject(this.headerData.headerButton) && this.utils.booleanValue(this.headerData.headerButton.forceBookmarkUpdate)) {
				var bookmarkServicesData = this.headerData.headerButton.scope.getServicesBookmarkData(false);
				this.bookmarkData(bookmarkServicesData, 'SERVICESCATALOG');
			}
			if (document.getElementById('page_outer_wrapper') != null) {
				div = $('.panel.currencyConverter').detach();
				if (div != null && div.length > 0) {
					$(div).insertAfter($('#page_outer_wrapper'));
				}
			}

			// for side navbar
			if (this.isSideNavBarEnabled() 
				&& typeof application.slidebars.applyListener == 'function') {
				application.slidebars.applyListener({
					direction: application.navbarAlignment()
				});
			}


			if(!this.utils.isEmptyObject(this.headerData)){
				if(!this.utils.isEmptyObject(this.headerData.bannerHtml)){
					var divLayout = document.getElementById("layout");
					if(!this.utils.isEmptyObject(divLayout)){
						divLayout.className = divLayout.className + " bannerAvailable" ;
					}
				}
			}
			
		},

		/**
		 * function called when search icon is pressed
		 * @param event JSON object containing event arguments
		 * @param args JSON object containing arguments passed from caller
		 */
		onSearchClick: function(event, args) {
			if (jsonResponse.data.booking.MSRCH_A != null) {

				// set flag for modify search
				jsonResponse.data.booking.MSRCH_A.requestParam.isPopup = true;
				this.moduleCtrl.navigate(null,'merci-book-MSRCH_A');
			} else {

				this.urlManager.makeServerRequest({
					action: 'MAirSearchDispatcher.action',
					loading: true,
					method: 'POST',
					expectedResponseType: 'json',
					parameters: 'SHOW_PAGE_AS_POPUP=TRUE&result=json',
					cb: {
						fn: '_onSearchCallback',
						scope: this,
						args: args
					}
				}, false);

			}
		},

		/**
		 * function called when server response is received
		 * @param response
		 * @param args
		 */
		_onSearchCallback: function(response, args) {

			// i.e. incorrect response from server
			if (response == null || response.responseJSON == null) {
				return;
			}

			this.moduleCtrl.navigate(null, response.responseJSON.homePageId);
		},

		/**
		 * if homeURL is present from module controller then naviage to home page,
		 * otherwise call the navigate function defined in module controller
		 */
		goHome: function(event, args) {
			if (this.utils.isRequestFromApps() == false) {
				if (!this.utils.isEmptyObject(args.homeURL)) {
					document.location.href = args.homeURL;
				} else {
					var loggedIn = (!this.utils.isEmptyObject(this.data.request.IS_USER_LOGGED_IN)) ? this.data.request.IS_USER_LOGGED_IN : this.data.request.IS_DIRECT_LOGGED_IN;
					var params = 'result=json&IS_USER_LOGGED_IN=' + loggedIn;
					var request = {
						parameters: params,
						method: 'POST',
						loading: true,
						action: 'MWelcome.action',
						expectedResponseType: 'json',
						cb: {
							fn: this._onHomeNavCallBack,
							scope: this
						}
					}

					// start an Ajax request
					this.urlManager.makeServerRequest(request, false);
				}
			}
		},

		_onHomeNavCallBack: function(response, args) {
			if (response.responseJSON != null 
				&& response.responseJSON) {
				// navigate to next page
				this.moduleCtrl.navigate(null, response.responseJSON.homePageId);
			}
		},

		goManualBack: function(event, args) {
			document.location.href = args.manualBackURL;
		},

		openConverter: function() {
			if(this.utils.booleanValue(this.headerData.currencyConverter.newPopupEnabled)==true){
				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				aria.utils.Json.setValue(popup, 'data', {
					currData: this.headerData.currencyConverter
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "currencyConverter"
				});			

				this.utils.showMskOverlay(true);
				this.utils.storeFormData(null);
				this.moduleCtrl.navigate(null, 'Popup');
			} else {
				window.scrollTo(0, 0);
				var converterPanel = document.getElementById(this.$getId('currCvtr'));
				if (converterPanel != null) {
					if (converterPanel.className.indexOf('addHeight') == -1) {
						converterPanel.className += ' addHeight';
					} else {
						converterPanel.className = converterPanel.className.replace(/(?:^|\s)addHeight(?!\S)/g, '');
					}

					this.utils.showMskOverlay(false);
					if (converterPanel.className.indexOf('addHeight') == -1) {
						this.utils.hideMskOverlay();
					}
				}
				
				// toggle css class
				var cConvertertools = document.getElementsByClassName('cConvertertools');
				for (var i = 0; i < cConvertertools.length; i++) {
					if (cConvertertools[i].className.indexOf('selected') == -1) {
						cConvertertools[i].className += ' selected';
					} else {
						cConvertertools[i].className = cConvertertools[i].className.replace(/(?:^|\s)selected(?!\S)/g, '');
					}
				}
			}			
		},

		getCurrencyConversionSource: function(data) {
			var items = [];
			var blockCurrency = null;
			if (data.currency.disabled != null) {
				blockCurrency = data.currency.disabled.split(",");
			}

			if (data.currency.list != null && data.showButton) {
				$.each(data.currency.list, function(key, val) {
					if (!(blockCurrency != null && blockCurrency != '' && $.inArray(val[0], blockCurrency) != -1)) {
						items.push(val[1] + '(' + val[0] + ')');
					}
				});
			}

			return items;
		},

		/**
		 * method which makes the server call to apply currency
		 * @param event
		 * @param args
		 */
		applyCurrency: function(event, args) {
			var inputVal = $('#newCurrency').val();
			$('#convErrDiv').hide();
			if (inputVal.indexOf('(') != -1 && inputVal.indexOf(')') != -1) {
				var b = inputVal.split("(");
				var c = b[1];
				if (b[2] != undefined) {
					c = b[2];
				}
				var d = c.split(")");
				inputVal = d[0];
			}
			if (inputVal == "") {
				if ($('#myonoffswitch').is(':checked') == true) {
					inputVal = localStorage.getItem('convCurrency');
				} else {
					inputVal = localStorage.getItem('orgCurrency');
				}
			}

			$(".panel.currencyConverter").removeClass("addHeight");
			$(".cConvertertools ").toggleClass("selected");

			var params = 'CURRENCY_TO=' + inputVal + '&CURRENCY_FROM=' + args.currData.code + '&PAGE_TICKET=' + args.currData.pgTkt + '&result=json&PLTG_RECOMMENDATION_INDEX=';

			var actionName = 'MFareCurrencyConversion.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					'fn': this.__onCurrencyCB,
					'args': {
						current: this,
						requester: args.currData.currentPage
					},
					scope: this
				}
			};

			this.urlManager.makeServerRequest(request, false);
		},

		__onCurrencyCB: function(response, args) {
			var resData = response.responseJSON;
			var bp = this.urlManager.getBaseParams();
			if (resData.currencyCode != null && resData.exchangeRate != null && resData.errorMessage != "") {
				localStorage.setItem('convCurrency',resData.currencyCode);
				args.requester.currCode = resData.currencyCode;
				args.requester.exchRate = resData.exchangeRate;
				if ($('#newCurrency').val() != "") {
					localStorage.setItem("convCurrency", args.requester.currCode);
				}

				// refresh template
				args.requester.$refresh();
				if (typeof args.requester.$dataReady != 'undefined') {
					args.requester.$dataReady();
				}

				$('#newCurrency').val("");
				$("#delnewCurrency").addClass('hidden');
				if (bp[14] != null && bp[14] != "") {
					args.current.__merciFunc.appCallBack(args.current.data.siteParams.siteAppCallback, "://?flow=currencyConv/currencyConvDone=true");
				}

			} else {
				$(".panel.currencyConverter").toggleClass("addHeight");
				$(".cConvertertools ").toggleClass("selected");
				if (resData.data.booking.MError_A != null) {
					if (resData.data.booking.MError_A.requestParam.checkBEError[3001] != undefined) {
						resData.errorMessage = resData.data.booking.MError_A.requestParam.checkBEError[3001];
					}
				}
				$('#errMsg').text(resData.errorMessage);
				$('#convErrDiv').show();
			}

			this.utils.hideMskOverlay();
		},
		change: function() {
			if (document.getElementById("bannerPanel").style.display == "none") {
				document.getElementById("strip").style.display = "none";
				document.getElementById("bannerPanel").style.display = "block";
			} else if (document.getElementById("bannerPanel").style.display == "block") {
				document.getElementById("strip").style.display = "block";
				document.getElementById("bannerPanel").style.display = "none";
			}
		},

		shoppingCart: function() {
			this.$json.setValue(jsonResponse.ui, 'displayCart', !jsonResponse.ui.displayCart);
			this.moduleCtrl.navigate(null, 'merci-book-MShopBasket_A');

			var checkout = document.getElementById('checkout');
			if (jsonResponse.ui.cntBookMark == 1) {
				checkout.className = checkout.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
			}
		},

		matchKeyfromJSON: function() {
			var matchedKey = false;
			this.utils.getStoredItemFromDevice('BOOKMARKJSON', function(result) {
				if (!this.utils.isEmptyObject(result) && (result != 'undefined')) {
					var jsonObj = JSON.parse(result) || {};
					if (!this.utils.isEmptyObject(jsonObj)) {
						var shoppingCartBookmarks = jsonObj['RVNWFARESTATUS'] || {};
						for (key in shoppingCartBookmarks) {
							if (this.jsonkey == key) {
								matchedKey = true;
							}
						}
					}
				}
			});
			return matchedKey;
		},

		userButton: function() {
			var headerData = this.moduleCtrl.getHeaderInfo();
			if (headerData.headerButton.loggedIn) {
				if (headerData.headerButton.scopeFare != undefined) {
					headerData.headerButton.scopeFare.logOutProfile();
				} else {

					headerData.headerButton.scope.logOutProfile();
				}
			} else {
				if (headerData.headerButton.scopeFare != undefined) {
					headerData.headerButton.scopeFare.logInProfile();
				} else {
					headerData.headerButton.scope.logInProfile();
				}
			}
		},

		/**
		*	This function is used to bookmark the contents on the particular page
		*	uses a data object which is created on the page whose data is to be bookmarked.
		* 	uses this data object to create a bookmark in the MyFavourites page.
		* 	*** Exception in case of fare review page as this was already implemented.
		*	args should contain :
				@param headerData.headerButton.bookmarkPage : the page id of which the data is to be bookmarked
				@param headerData.headerButton.scope : the scope of the page (object reference to the page) of whose the data is to be bookmarked
		**/
		/*
			FIX IT : current implementation in the fare review page is different, this needs to be made inline with the generic bookmark approach
			SOLUTION : The function on the fare review page needs to be moved to this and might be a switch case can be used to create the data object
		*/
		onMyFavoriteClick: function(event, args) {
			var bookmarkPage = args.headerData.headerButton.bookmarkPage;
			switch (bookmarkPage) {
				case 'MServicesCatalogScript':
					var bookmarkServicesData = args.headerData.headerButton.scope.getServicesBookmarkData(true);
					this.bookmarkData(bookmarkServicesData, 'SERVICESCATALOG');
					break;
				case 'MNewServicesCatalogScript':
					var bookmarkServicesData = args.headerData.headerButton.scope.getServicesBookmarkData(true);
					this.bookmarkData(bookmarkServicesData, 'SERVICESCATALOG');
					break;
				default:
					args.headerData.headerButton.scope.onMyFavoriteClick();
					break;
			}
		},

		/**
		 * Stores the data required to bookmark with the name BookmarkedJson
		 * The parameter bookmarkedPage in the BookmarkedJson can be used to determine the page of which the bookmark was created
		 **/
		bookmarkData: function(data, key) {
			var result = this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			if (!this.utils.isEmptyObject(result) && (result != 'undefined')) {
				if (typeof result === 'string') {
					var jsonObj = JSON.parse(result);
				} else {
					var jsonObj = (result);
				}
				jsonObj[key] = data;
				var setData = this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE, jsonObj);
				this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, 'overwrite', 'json');
			} else {
				var newBookmarkJson = {};
				newBookmarkJson[key] = data;
				var setData = this.moduleCtrl.setStaticData(merciAppData.DB_MYFAVOURITE, newBookmarkJson);
				this.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, newBookmarkJson, 'overwrite', 'json');
			}
		},

		getShoppingCartBookmarkCount: function() {
			var shoppingCartBookmarksCount = 0;
			var result = this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			if (!this.utils.isEmptyObject(result) && (result != 'undefined')) {
				//var jsonObj = JSON.parse(result) || {};
				if (!this.utils.isEmptyObject(result)) {
					var shoppingCartBookmarks = result['RVNWFARESTATUS'] || {};
					for (key in shoppingCartBookmarks) {
						shoppingCartBookmarksCount++;
					}
				}
			}
			return shoppingCartBookmarksCount;
		},

		/**
		 * function to close the share panel
		 * @param event
		 * @param args
		 */
		cancelShare: function(event, args) {
			var el = document.getElementById('tools-buttons-group');
			if (el != null) {
				el.style.display = 'none';
			}
		}
	}
});