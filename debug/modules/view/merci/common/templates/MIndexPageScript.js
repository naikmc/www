Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.MIndexPageScript",
	$dependencies: ["modules.view.merci.common.utils.URLManager", "modules.view.merci.common.utils.MCommonScript", "modules.view.merci.common.utils.MerciGA"],

	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {

			if (!this.data.fromMenu) {
				var bodyEls = document.getElementsByTagName('body');
				for (var i = 0; bodyEls != null && i < bodyEls.length; i++) {
					bodyEls[i].setAttribute('id', 'merci');
				}
			}

			var moduleData = this.moduleCtrl.getModuleData();
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();

			if (!jsonResponse.ui.fromStorage) {
				this.data.config = moduleData.booking.Mindex_A.siteParam;
				this.data.labels = moduleData.booking.Mindex_A.labels;
				this.data.request = moduleData.booking.Mindex_A.requestParam;
				this.data.globalList = moduleData.booking.Mindex_A.globalList;					
				this.indexDataCreation();
			} else {
				this.data.config = jsonResponse.data.booking.Mindex_A.siteParam;
				this.data.labels = jsonResponse.data.booking.Mindex_A.labels;
				this.data.request = jsonResponse.data.booking.Mindex_A.requestParam;
				this.data.globalList = jsonResponse.data.booking.Mindex_A.globalList;
			}

			if (this.data.request.lastName != undefined || this.data.request.lastName != null) {
				if (!this.utils.isEmptyObject(this.data.request.lastName)) {			
					this.lastName = this.data.request.lastName;
				} else {
					this.lastName = " ";
				}
			} else {
				this.lastName = " ";
			}
			if (moduleData.booking != null && !this.utils.isEmptyObject(this.data.request.IS_USER_LOGGED_IN)) {
				this.IS_USER_LOGGED_IN = this.data.request.IS_USER_LOGGED_IN;
				this.IS_USER_LOGGED_IN = this.utils.booleanValue(this.IS_USER_LOGGED_IN);
			} else if (moduleData.booking != null) {
				this.IS_USER_LOGGED_IN = this.data.request.IS_DIRECT_LOGGED_IN;
				//to convert into boolean value
				this.IS_USER_LOGGED_IN = this.utils.booleanValue(this.IS_USER_LOGGED_IN);
			};
			
			if (!this.data.fromMenu) {
				if (this.utils.isRequestFromApps() == true && this.utils.booleanValue(this.data.config.setAllowFooter) == true) {
					this.setFooter();
					this.getTripCount();
				};				
				this.__ga.trackPage({
					domain: this.data.config.siteGADomain,
					account: this.data.config.siteGAAccount,
					gaEnabled: this.data.config.siteGAEnable,
					page: 'Home?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + this.data.config.siteOfficeID + '&wt_sitecode=' + base[11],
					GTMPage: 'Home?wt_market=' + ((base[13] != null) ? base[13] : '') +
						'&wt_language=' + base[12] + '&wt_officeid=' + this.data.config.siteOfficeID + '&wt_sitecode=' + base[11]
				});			
				if (this.utils.isRequestFromApps() || ((typeof customerAppData !="undefined") && customerAppData.isWebEnvironment && customerAppData.isTestEnvironment)) {
					var force_upgrade_msg = merciAppData.FORCE_UPGRADE_MSG;
					if(typeof customerAppData !="undefined" && customerAppData.isCustomAirportList){
						getDepartureAirportListArray(this);
					}
				}
			}
		},

		$displayReady: function() {

			if (!this.data.fromMenu) {
				var arr = [];
				var headerButton = {};
				headerButton.scope = this;
				if (this.data.config.enableProfile != undefined && this.data.config.enableProfile.toLowerCase() == "true") {
					arr.push("login");
					if (this.IS_USER_LOGGED_IN) {
						headerButton.loggedIn = true;
					} else {
						headerButton.loggedIn = false;
					}
				}
				headerButton.button = arr;
				var base = modules.view.merci.common.utils.URLManager.getBaseParams();
				if (this.utils.booleanValue(this.data.config.enableLoyalty) && this.IS_USER_LOGGED_IN) {
					var loyaltyInfoJson = {
						loyaltyLabels: this.data.labels.loyaltyLabels,
						airline: base[16],
						miles: base[17],
						tier: base[18],
						title: base[19],
						firstName: base[20],
						lastName: base[21],
						programmeNo: base[22]
					};
				}
				// set header information
				this.moduleCtrl.setHeaderInfo({
					title: this.data.labels.tx_merci_text_home_home,
					bannerHtmlL: this.data.request.bannerHtml,
					homePageURL: null,
					showButton: false,
					companyName: this.data.config.sitePLCompanyName,
					currencyConverter: {
						name: '',
						code: '',
						pgTkt: '',
						labels: {
							tx_merci_currency_converter: '',
							tx_merci_org_currency: '',
							tx_merci_sel_currency: '',
							tx_merci_booking_avail_filter_apply: '',
							tx_merci_cancel: ''
						},
						showButton: false
					},
					headerButton: headerButton,
					loyaltyInfoBanner: loyaltyInfoJson
				});
				if (this.utils.isRequestFromApps()) {
					this.displayWCnote();
					this.displayCopyRightYear();
				}
				/*For local stored boarding pass to show on screen*/
				if (this.utils.isRequestFromApps()) {					
					this.setBackground();
				}
				this.displayBoardingPassesOnMerciHome();
			}
		},

		$viewReady: function() {

			if (!this.data.fromMenu && this.utils.isRequestFromApps()) {
				var force_upgrade_msg = merciAppData.FORCE_UPGRADE_MSG;
				var ignoreUpgradeAlert = this.utils.booleanValue(this.utils.getStoredItem("ignoreUpgradeAlert"));
				this.checkForAppUpgrade(this.data.labels.tx_merciapps_upgrade_prompt, this.data.config.siteIOSStoreLink,
										this.data.config.siteAndroidStoreLink, this.data.config.siteiOSVersion, this.data.config.siteAndroidVersion, 
										ignoreUpgradeAlert, this.data.config.forceUpgradeiPhone, this.data.config.forceUpgradeAndroid, 
					force_upgrade_msg /* Commenting due to unavailability of string this.data.labels.tx_merciapps_force_upgrade . Using string from merciAppData . Do note that tpl requires change*/ );
			};
		},

		/**
		 * returns a list of buttons based on passed arguments
		 * @param args JSON object containing parameters
		 */
		getButtons: function(args) {

			if (args.subButtons == null) {
				args.subButtons = {};
			}

			for (var i = 0; i < args.buttons.length; i++) {
				if (args.buttons[i][6] != null && args.buttons[i][6] != '' && args.buttons[i][6] != '0') {
					if (!args.subButtons[args.buttons[i][6]]) {
						args.subButtons[args.buttons[i][6]] = [];
					}

					// add button
					var flowInfo = this.getFlowType(args.buttons[i][3]);
					args.subButtons[args.buttons[i][6]].push(this.createButtonItem({
						flowInfo: flowInfo[0],
						button: args.buttons[i]
					}));
				}
			}

			if (this.data.fromMenu) {
				return this.getMenuButtons(args);
			} else {
				return this.getDisplayButtons(args);
			}
		},

		/**
		 * create button item for array
		 * @param args JSON with parameters
		 * @return String
		 */
		createButtonItem: function(args) {
			var item = args.flowInfo + '|' + args.button[1] + '|';
			if (args.subButtons != null) {
				item += JSON.stringify(args.subButtons[args.button[5]]);
			} else {
				item += args.button[2];
			}

			if (args.subButtons == null) {
				if (args.button.length > 9) {
					item += '|' + args.button[9];
				}

				if (args.button.length > 11) {
					item += '|' + args.button[11];
				}
				
				if (args.button.length > 10) {
					item += '|' + args.button[10];
				}
			}
			
			return item;
		},

		/**
		 * returns a list of buttons for nav bar based on passed arguments
		 * @param args JSON object containing parameters
		 */
		getMenuButtons: function(args) {

			var buttonNames = [];
			/*  Device is represented by the following logic:
				1: Mobile Web
				2: Mobile App
				3: Tablet Web
				4: Tablet App  */

			var device;
			var displayButton = true;


			if(application.isTablet()){
				device = 3;
			}else{
				device = 1;
			}
			if(this.utils.isRequestFromApps()){
				device += 1;
			}
			device=device.toString() ;

			for (var i = 0; i < args.buttons.length; i++) {
				var flowInfo = this.getFlowType(args.buttons[i][3]);
				displayButton = false ;
				if(!this.utils.isEmptyObject(args.buttons[i][8])){
					if( args.buttons[i][8] =="210"  || args.buttons[i][8].indexOf(device)!=-1 ){
						displayButton = true ;
					}
				}else{
					displayButton = true ;
				}

				if (flowInfo[1] == 'N' && (args.buttons[i][6] == '' || args.buttons[i][6] == null || args.buttons[i][6] == '0') && displayButton ) {
					if (args.subButtons != null && args.subButtons[args.buttons[i][5]] != null) {
						buttonNames.push(this.createButtonItem({
							flowInfo: 'PARENT_BUTTON',
							button: args.buttons[i],
							subButtons: args.subButtons
						}));
					} else {
						buttonNames.push(this.createButtonItem({
							flowInfo: flowInfo[0],
							button: args.buttons[i]
						}));
					}
				}
			}

			return buttonNames;
		},

		/**
		 * returns a list of home buttons based on passed arguments
		 * @param args JSON object containing parameters
		 */
		getDisplayButtons: function(args) {
			var buttonNames = [];
			if (this.utils.booleanValue(this.data.config.enblHomePageAlign) == true) {
				for (var i = 0; i < args.buttons.length; i++) {
					var flowInfo = this.getFlowType(args.buttons[i][3]);
					if (flowInfo[1] == 'H') {
						if (args.subButtons != null && args.subButtons[args.buttons[i][5]] != null) {
							buttonNames.push(this.createButtonItem({
								flowInfo: 'PARENT_BUTTON',
								button: args.buttons[i],
								subButtons: args.subButtons
							}));
						} else {
							buttonNames.push(this.createButtonItem({
								flowInfo: flowInfo[0],
								button: args.buttons[i]
							}));
						}
					}
				}
			} else {
				buttonNames = [
					'MY_PROFILE',
					'BOOKFLIGHT',
					'CHECKIN_HOME',
					'FAREDEALS',
					'RETRIEVE',
					'CONTACTUS',
					'FLIFO',
					'TIMETABLE',
					'FAVORITE',
					'CUSTOM',
					'TYPEB',
					'CHANGELANG',
					'DESKTOP',
					'SETTING'
				]
			}

			return buttonNames;
		},

		displayWCnote: function() {
			var welcomeNote = this.data.labels.tx_merci_text_booking_home_welcome;
			if (welcomeNote == "" || welcomeNote == null) {
				welcomeNote = merciAppData.WELCOME_NOTE;
			} else {
				$('#welcomeNote').html(welcomeNote);	
			}
			

		},

		exitDWMSplashScreen: function() {
			var dwmDiv = document.getElementById("DWMSplashScreen");
			if(dwmDiv!=null){
				dwmDiv.remove();
			}			
		},

		displayCopyRightYear: function() {
			var copyRightYear = this.data.config.siteCopyYear;
			if (copyRightYear == "" || copyRightYear == null) {
				copyRightYear = merciAppData.COPYRIGHT_YEAR;
			} else {
				$('#copyRightYear').html(copyRightYear);
			}	

		},

		/*
		 * For display locally stored boarding passes in merci home page
		 * */
		displayBoardingPassesOnMerciHome: function() {

			/*
			 * Check local storage support for this site
			 * */
			if (this.utils.isLocalStorageSupported()) {
				var storedBoardingPasses = localStorage.getItem('storedBoardingPasses');
				/*
				 * Check wether any locally stored boarding passes r there
				 * */
				if (storedBoardingPasses != undefined && storedBoardingPasses != "" && storedBoardingPasses.split("|||BP|||").length > 0) {
					storedBoardingPasses = storedBoardingPasses.split("|||BP|||");
					var one_day = 1000 * 60 * 60 * 24;
					var curDate = new Date();
					var BPHtml = "";

					for (var i in storedBoardingPasses) {
						var BPEligibilityDate = localStorage[storedBoardingPasses[i] + "_dateFormatted"].split("-");
						BPEligibilityDate = new Date(BPEligibilityDate[0], BPEligibilityDate[1], BPEligibilityDate[2]);
						BPEligibilityDate = Math.floor((curDate.getTime() - BPEligibilityDate.getTime()) / (one_day));
						/*
						 * BPEligibilityDate tell wether boarding pass is eligible or not, eligible if
						 * flight is flying in next 2 days
						 *
						BPEligibilityDate=1;*/
						if (BPEligibilityDate <= 2) {
							BPHtml += '<div id=\'' + storedBoardingPasses[i] + '-home\' class=\"slide\">' + localStorage[storedBoardingPasses[i] + "-home"] + '</div>';
						}
					}
					/*
					 * To load data to div and to show div
					 * */
					if (BPHtml != "") {

						$('#slideshow').removeClass("displayNone").addClass("displayBlock");
						$('#slidesContainer').html(BPHtml);
						/*
						 * For loading slider
						 * */
						this.sliderFunction();
					} else {
						$('#slideshow').removeClass("displayBlock").addClass("displayNone");
						$('#slidesContainer').html(BPHtml);
					}



				}

			}

		},

		sliderFunction: function() {
			var __this = this;
			var currentPosition = 0;
			var slides = $('.slide');
			var numberOfSlides = slides.length;
			var slideWidth = 100;
			// Remove scrollbar in JS
			$('#slidesContainer').css('overflow', 'hidden');
			// Wrap all .slides with #slideInner div
			slides
				.wrapAll('<div id="slideInner"></div>')
			// Float left to display horizontally, readjust .slides width
			.css({
				'float': 'left',
				'width': (slideWidth / numberOfSlides) + "%"
			});
			// Set #slideInner width equal to total width of all slides
			$('#slideInner').css('width', slideWidth * numberOfSlides + "%");
			// Insert controls in the DOM
			$('#slideshow')
				.prepend('<span class="control" id="leftControl">Clicking moves left</span>')
				.append('<span class="control" id="rightControl">Clicking moves right</span>');
			// Hide left arrow control on first load
			__this.manageControls(currentPosition, numberOfSlides);
			// Create event listeners for .controls clicks
			$(document)
				.on('click', ".control", function() {
					// Determine new position
					currentPosition = ($(this).attr('id') == 'rightControl') ? currentPosition + 1 : currentPosition - 1;
					// Hide / show controls
					__this.manageControls(currentPosition, numberOfSlides);
					// Move slideInner using margin-left
					$('#slideInner').animate({
						'marginLeft': slideWidth * (-currentPosition) + "%"
					});
				});

		},

		manageControls: function(position, numberOfSlides) {
			// Hide left arrow if position is first slide
			if (position == 0) {
				$('#leftControl').hide()
			} else {
				$('#leftControl').show()
			}

			// Hide right arrow if position is last slide
			if (position == numberOfSlides - 1) {
				$('#rightControl').hide()
			} else {
				$('#rightControl').show()
			}
		},


		setFooter: function() {
			this.footerJSON = {};
			this.footerJSON.setBoardingPass = this.data.config.merciCheckInEnabled;
			this.footerJSON.setAllowFooter = this.data.config.setAllowFooter;
			this.footerJSON.setFavAllow = this.data.config.allowFavorite;
			this.footerJSON.setRetrieveTrips = this.data.config.allowRetrieve;
			this.footerJSON.allowCustomRetrieve = this.data.config.allowCustomRetrieve;
			this.footerJSON.setSettingAllow = this.data.config.allowSetting;
			this.footerJSON.setBoardingLabel = this.data.labels.tx_merci_checkin_bptitle;
			this.footerJSON.setMyTripLabel = this.data.labels.tx_merci_text_mytrip;
			this.footerJSON.setMoreLabel = this.data.labels.tx_merciapps_more;
			this.footerJSON.setFavLabel = this.data.labels.tx_merciapps_my_favorite;
			this.footerJSON.setHomeLabel = this.data.labels.tx_merciapps_home;
			this.footerJSON.cancelMesg = this.data.labels.tx_merciapps_msg_booking_flow_exit;
			jsonResponse.data.footerJSON = this.footerJSON;
		},
	
		getTripCount: function() {
			
			pageObjIndex = this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function(result) {
				if (result && result != "") {
					var jsonObj = {};
					var count = 0;
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};

					if (!pageObjIndex.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.detailArray).length;
					};
					pageObjIndex.$json.setValue(jsonResponse.ui, "cntTrip", count);
				}


			});

			this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function(result) {
				if (result && result != "") {
					var jsonObj = {};
					var count = 0;
					if (typeof result === 'string') {
						jsonObj = JSON.parse(result);
					} else {
						jsonObj = (result);
					};

					if (!pageObjIndex.utils.isEmptyObject(jsonObj)) {
						count += Object.keys(jsonObj.boardingPassArray).length;
					};
					pageObjIndex.$json.setValue(jsonResponse.ui, "cntBoardingPass", count);
				}

				
			});

		},
		setBackground: function(){
			pageObjIndex = this;			
			this.utils.getStoredItemFromDevice(merciAppData.DB_BACKGROUND, function(resultImg) {
				if (resultImg != null && resultImg != '') {
					//var imgURL = "url(data:image/png;base64,"+resultImg+")";								
					var imgURL = "url("+resultImg+")";
					$("#sb-site").css("background-image", imgURL);								
				}
			});						
		},

		logInProfile: function(event, args) {
			//event.preventDefault();
			var params = 'result=json' + '&ENABLE_EARLY_LOGIN=YES';
			var request = {

				parameters: params,
				action: 'MDirectLoginAction.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onLogInProfileCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onLogInProfileCallBack: function(response, nextUrl) {
			var json = this.moduleCtrl.getModuleData();
			console.log(response);
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			console.log(nextPage);
			if (response.responseJSON.data != null) {
				if (dataId == 'MDL_A') {
					this.utils.extendModuleData(json, response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}

			}
		},

		logOutProfile: function(event, args) {
			//event.preventDefault();
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
			console.log(response);
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			console.log(nextPage);
			if (response.responseJSON.data != null) {
				if (dataId == 'Mindex_A') {
					var data = this.moduleCtrl.getModuleData();
					this.utils.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
					var unwantedData = this.moduleCtrl.getModuleData();
					this.moduleCtrl.navigate(null, nextPage);
					this.IS_USER_LOGGED_IN = response.responseJSON.data.booking.Mindex_A.requestParam.IS_USER_LOGGED_IN;
					this.$refresh();
				}
			}
		},

		indexDataCreation: function() {
			if (this.utils.isRequestFromApps() == true) {
				jsonResponse.ui.fromStorage = true;
				var jsonResponseCopy = {}
				jsonResponseCopy.data = aria.utils.Json.copy(jsonResponse.data);
				jsonResponseCopy.homePageId = aria.utils.Json.copy(jsonResponse.homePageId);
				this.utils.storeLocalInDevice(merciAppData.DB_HOME, JSON.stringify(jsonResponseCopy), "overwrite", "text");				
			}
		},

		getFlowType: function(flowType) {

			var flowInfo = ['', ''];
			if (flowType == null || flowType.indexOf('-') == -1) {
				flowInfo[0] = flowType;
			} else {
				flowInfo = flowType.split('-');
			}

			return flowInfo;
		},

	  	toggleForceUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById('forceUpgradeOverlay');
			this.utils.toggleClass(overlayDiv, 'on');
		},

		toggleAutoUpgradeAlert: function(args) {
			var overlayDiv = document.getElementById("appUpgradeOverlay");
			this.utils.toggleClass(overlayDiv, 'on');
		},

		handleAutoUpgrade: function(scope, args) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
	  	}

			switch (args.id) {
				case 'upgrade':
					isIgnored = false;
                    			localStorage.setItem("RemindMeLater", "FALSE");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && this.data.config.siteIOSStoreLink && this.data.config.siteIOSStoreLink.length > 0) {
						window.location.assign(this.data.config.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						this.toggleAutoUpgradeAlert("show");
					} else if (devicePlatform == 'Android' && this.data.config.siteAndroidStoreLink && this.data.config.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(this.data.config.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						this.toggleAutoUpgradeAlert("show");
					} else {
						this.toggleAutoUpgradeAlert("show");
					}
					break;
				case 'force':
					isIgnored = false;
                    			localStorage.setItem("RemindMeLater", "FALSE");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					if (devicePlatform == 'iOS' && this.data.config.siteIOSStoreLink && this.data.config.siteIOSStoreLink.length > 0) {
						window.location.assign(this.data.config.siteIOSStoreLink); //""itms-apps://itunes.com/apps/sqmobile""; //IOS_STORE_LINK
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else if (devicePlatform == 'Android' && this.data.config.siteAndroidStoreLink && this.data.config.siteAndroidStoreLink.length > 0) {
						navigator.app.loadUrl(this.data.config.siteAndroidStoreLink, {
							openExternal: true
						}); // https://play.google.com/store/apps/details?id=com.amadeus
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */
					} else {
						/* START: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP .
							Commenting to keep upgrade alert open.
						*/
						/* pageObjIndex.toggleForceUpgradeAlert("show"); */
						/* END: PTR 09212666 [Medium]: MeRCI R21 IA : KQ APP : Force Upgrade : Able to proceed without upgrading APP */						

					}
					break;
				case 'ignore':
					isIgnored = true;
					this.toggleAutoUpgradeAlert("show");
					this.utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
					break;
				case 'later':
                    			localStorage.setItem("RemindMeLater", "TRUE");
					this.toggleAutoUpgradeAlert("show");
					break;
				default:
					break;
			}
		},

		checkForAppUpgrade: function(str_upgradeMessage, param_AppStoreLink, param_GooglePlayLink, param_iOSVersion, param_AndroidVersion, isIgnored, param_forceUpgradeiPhone, param_forceUpgradeAndroid, str_forceUpgradeMessage) {
			if (typeof device != 'undefined') {
				var devicePlatform = device.platform;
			} else {
				var devicePlatform = null;
			}
			var utils = this.utils;
			if (!isIgnored && localStorage.getItem("RemindMeLater") != "TRUE") {
				utils.getAppVersion(function(result) {
					if (result && result.length > 0) {
						if (typeof(result) == "string") {
							appversion = parseFloat(result);
						} else {
							appversion = result;
						}
						if (devicePlatform == "iOS") {
							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - iOS:" + param_iOSVersion);
								if (typeof param_forceUpgradeiPhone != "undefined" && utils.booleanValue(param_forceUpgradeiPhone)) {
									console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									pageObjIndex.toggleForceUpgradeAlert("show");
								} else {
									console.log("iOS Auto App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
									pageObjIndex.toggleAutoUpgradeAlert("show");
								}
							} else {
								console.log("App Upgrade alert not required");
							}
						} else if (devicePlatform == "Android") {
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("App Upgrade alert shown. Version in App Store - Android:" + param_AndroidVersion);
								if (typeof param_forceUpgradeAndroid != "undefined" && utils.booleanValue(param_forceUpgradeAndroid)) {
									console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjIndex.toggleForceUpgradeAlert("show");
								} else {
									console.log("Android Auto Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
									pageObjIndex.toggleAutoUpgradeAlert("show");
								}
							} else {
								console.log("App Upgrade alert not required");
							}
						} else {
							console.log("Unable to identify platform");
						}
					}
				});
			} else {
				if (devicePlatform == "iOS" && typeof param_forceUpgradeiPhone != "undefined" && utils.booleanValue(param_forceUpgradeiPhone)) {
					utils.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_iOSVersion && parseFloat(param_iOSVersion) > appversion) {
								console.log("iOS Force App Upgrade initiated. Version in App Store - iOS:" + param_iOSVersion);
								pageObjIndex.toggleForceUpgradeAlert("show");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else if (devicePlatform == "Android" && typeof param_forceUpgradeAndroid != "undefined" && utils.booleanValue(param_forceUpgradeAndroid)) {
					utils.getAppVersion(function(result) {
						if (result && result.length > 0) {
							if (typeof(result) == "string") {
								appversion = parseFloat(result);
							} else {
								appversion = result;
							}
							if (param_AndroidVersion && parseFloat(param_AndroidVersion) > appversion) {
								console.log("Android Force Upgrade initiated. Version in App Store - Android:" + param_AndroidVersion);
								pageObjIndex.toggleForceUpgradeAlert("show");
							} else {
								console.log("Force app upgrade not required.");
							}
						}
					});
				} else {
					console.log("App upgrade prompt ignored.");
					utils.storeLocal("ignoreUpgradeAlert", isIgnored, "overwrite", "text");
				}
			}
		}
	}
});