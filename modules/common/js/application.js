
var _gaq = _gaq || null;
var jsonResponse = jsonResponse || {};
var merciAppData = merciAppData || {};
var isGTMEnabled = isGTMEnabled || false;
var siteGTMContainerValue = siteGTMContainerValue || '';

// RED [START] */
var io_operation="ioBegin";
var io_bbout_element_id="FINGER_PRINT_BD";
var io_install_stm=false;
var io_install_flash=false;
var io_exclude_stm=28;
var io_submit_element_id="PurchaseValidate";
var io_max_wait=5e3;
var io_submit_form_id="purcForm"
// RED [ END ] */

var application = (function() {

	var _isTablet = _isTablet || false;
	var _showSideMenu = _showSideMenu || '';
	var _pageEngine = _pageEngine || {};

	/**
	 * set the default data in global variable
	 * @params args JSON param containing the data
	 */
	var _initData = function(args) {

		if (args == null) {
			return;
		}

		jsonResponse = args.data;
	};

	/**
	 * function used to initialize Aria Templates
	 * @param args JSON params to be passed by calling function
	 */
	var _loadAria = function(args) {

		if (args == null || args.json == null) {
			return;
		}

		Aria.load({
			classes: [
				"aria.utils.Device",
				"aria.utils.HashManager",
				"aria.pageEngine.PageEngine",
				"modules.view.merci.common.utils.URLManager",
				"modules.view.merci.common.utils.MCommonScript",
				"aria.pageEngine.pageProviders.BasePageProvider",
				"modules.view.merci.common.utils.DataStorageUtil"
			],
			oncomplete: function() {

				// common
				var homeId = null;
				var utils = modules.view.merci.common.utils.MCommonScript;

				// create PageEngine instance
				// this same instance will be used to navigate
				_pageEngine = new aria.pageEngine.PageEngine();

				/* update aria settings */
				aria.core.environment.Environment.setEscapeHtmlByDefault(false);
				aria.core.environment.Environment.setLanguage(_getLocale(args.json.data.framework.baseParams[12]), null);

				if (args.json.homePageId != null && args.json.homePageId != ''){

					/* local storage check done for scenario where we show some result and based on that
					 we navigate to external page, when user press back from there we need to show same page
					 a typical scenario will be timetable result page, on click we goto to flight status */
					if(aria.utils.HashManager.getHashString() == localStorage.getItem('currentHashString')){
						homeId = localStorage.getItem('currentHashString');
					} else{
						homeId = args.json.homePageId;
					}

					/* PTR 7340471- load merci_rtl.css in case of RTL languages */
					utils.resetPageInfo();
				}

				var dataStorageUtil = modules.view.merci.common.utils.DataStorageUtil;
				dataStorageUtil.initSettingData();
				dataStorageUtil.initMorePageData();
				dataStorageUtil.initFavData(args.json);
				dataStorageUtil.initIndexData();
				dataStorageUtil.initFlightInfoData();
				dataStorageUtil.initContactUsData();
				dataStorageUtil.initMyTripsData();
				dataStorageUtil.initTripListData();
				dataStorageUtil.initBoardingPassData();

				_createHeader({
					'headerDiv': 'top'
				});

				if (homeId != null && homeId != '') {

					// set navbar direction
					_showSideMenu = args.showSideMenu;
					if (_showSideMenu != null) {
						_showSideMenu = _showSideMenu.toLowerCase();
					}

					/* set current hash, removing this will
						cause unexpected blank page during navigation */
					aria.utils.HashManager.setHash(homeId);

					/* get page config location */
					/* it can vary across channels */
					var pageBaseLoc = 'modules/view/merci/pages/mobile/';
					if (args.isTabletEnabled
						&& (aria.utils.Device.isTablet() || (!aria.utils.Device.isDevice() && aria.utils.Device.isTouch()))) {


						var merciCSSfilePath = null ;
						var customCSSfilePath = null ;

						if(typeof(isCommunityApp)!='undefined' && isCommunityApp==true) {
							merciCSSfilePath = 'modules/common/css/merci_tablet.css' ;
							customCSSfilePath = 'modules/common/css/custom_merci_tablet.css' ;
						}

						_addCss({
							json: args.json,
							fileName: 'merci_tablet.css',
							filePath: merciCSSfilePath
						});

						_addCss({
							json: args.json,
							loadCustom: true,
							fileName: 'custom_merci_tablet.css',
							filePath: customCSSfilePath
						});


						_isTablet = true;

						// for tablet menu is always on right
						if (_showSideMenu == 'left') {
							_showSideMenu = 'right';
						}
					}

					/* set a callback on hash change */
					aria.utils.HashManager.addCallback({
						fn: 'onHashChange',
						scope: modules.view.merci.common.utils.URLManager
					});

					_pageEngine.start({
						pageProvider : new aria.pageEngine.pageProviders.BasePageProvider({
							siteConfigLocation : 'modules/view/merci/pageEngine/site.json',
							pageBaseLocation : pageBaseLoc,
							homePageId : homeId
						})
					});
				}

				_createMenuBar({
					divId: 'menu-container',
					direction: _showSideMenu
				});

				_processGtm({
					isGTMEnabled: args.isGTMEnabled,
					gtmContainerValue: args.gtmContainerValue
				});


				if (typeof application.onPageEngineInitialized == 'function') {
					application.onPageEngineInitialized();
				}
			}
		});
	};

	/**
	 * set the environment under which application will run<br/>
	 * values like decmial format are set
	 * @param args JSON param containing data
	 */
	var _setAriaEnvironment = function(args) {
		var decimal = ".";
		var grouping = ",";
		var lang = _getLocale(args.language);
		if (lang == 'is_IS'){
			decimal = ",";
			grouping = ".";
		}

		aria.core.AppEnvironment.setEnvironment({
			defaultWidgetLibs : {
				"html" : "aria.html.HtmlLibrary",
				"embed" : "aria.embed.EmbedLib"
			},
			"decimalFormatSymbols" : {
				decimalSeparator : decimal,
				groupingSeparator : grouping,
				strictGrouping : false
			}
		});
	};

	/**
	 * add script to handle Google Analytics
	 * @param args JSON object containing configuration parameters
	 */
	var _addGoogleAnalytics = function(args) {
		if (args == null
			|| args.isGaEnabled == null
			|| args.isGaEnabled == false
			|| !args.isWebFlow) {
			return;
		}

		_gaq = _gaq || [];
		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	};

	/**
	 * function used to load application data required for MeRCI apps
	 */
	var _loadMeRCIAppData = function() {
		var temp = {
			DB_SETTINGS: "DB_SETTINGS",
			DB_CONTACTUS: "DB_CONTACTUS",
			DB_FLIGHTINFO: "DB_FLIGHTINFO",
			DB_GETTRIP: "DB_GETTRIP",
			DB_TRIPLIST: "DB_TRIPLIST",
			DB_TRIPDETAIL: "DB_TRIPDETAIL",
			DB_MYFAVOURITE: "DB_MYFAVOURITE",
			DB_MORE: "DB_MORE",
			DB_HOME: "DB_HOME",
			DB_BACKGROUND:"DB_BACKGROUND",
			DB_USEBACKGROUND:"DB_USEBACKGROUND",
			DB_BPTRIPLIST: "BPTRIPLIST",
			DB_BOARDINGPASS: "BOARDINGPASS",
			DATA_FLIGHTBKMRK_KEY: "FLIGHTBKMRK",
			DATA_FLIGHTDATA_KEY: "FLIGHTDATA",
			DATA_DEALOFFERSBKMRK_KEY: "DEALOFFERSBKMRK",
			DATA_FAREDEALBKMRK_KEY: "FAREDEALBKMRK",
			DATA_FAREDEALDATA_KEY: "FAREDEALDATA",
			DATA_REVENUEBKMRK_KEY: "REVENUEBKMRK",
			DATA_REVENUEDATA_KEY: "REVENUEDATA",
			DATA_AWARDMILEBKMRK_KEY: "AWARDMILEBKMRK",
			DATA_AWARDMILEDATA_KEY: "AWARDMILEDATA"
		}

		for (var key in temp) {
			if (temp.hasOwnProperty(key)) {
				merciAppData[key] = temp[key];
			}
		}
	};

	/**
	 * function used to load social media
	 * @param args JSON params send by calling function
	 */
	var _loadSocialMedia = function(args) {

		if (args == null) {
			return;
		}

		if (args.facebook == true) {
			var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
			if (document.getElementById(id) == null) {
				js = document.createElement('script'); js.id = id; js.async = true;
				js.src = "//connect.facebook.net/en_US/all.js";
				ref.parentNode.insertBefore(js, ref);
				js.onload = function() {
					if(args.isFBEnabled==true) {
						FB.init({ 
							appId  : '1583315721884316', 
							cookie : true, 
							xfbml : true, 
							version  : 'v2.2'
						});
	
						FB.getLoginStatus(function(response) {
							if (response.status === 'connected') {
		 						console.log('Already logged in!');
		 					} else {
								FB.login();
		 					}
						});
					}
				}
			}
		}

		if (args.twitter == true) {
			!function(d,s,id){
				var js,fjs=d.getElementsByTagName(s)[0];
				if(!d.getElementById(id)) {
					js=d.createElement(s);
					js.id=id;
					js.src="https://platform.twitter.com/widgets.js";
					fjs.parentNode.insertBefore(js,fjs);
				}
			}(document,"script","twitter-wjs");
		}
	};

	/**
	 * function used to add a new css to current view
	 * @param args JSON params with values
	 */
	var _addCss = function(args) {

		if (args == null
			|| args.fileName == null
			|| args.json == null
			|| args.json.data.framework == null
			|| args.json.data.framework.baseParams == null
			|| args.json.data.framework.baseParams.length < 10) {
			return;
		}

		var cssPath = args.filePath;

		if(cssPath == null) {
			cssPath = _getFilePath({
			json: args.json,
			fileName: args.fileName,
			fileType: 'css',
			loadCustom: args.loadCustom
		});
		}

		if (cssPath != null) {
			var css = document.createElement('link');
			css.setAttribute('rel', 'stylesheet');
			css.setAttribute('type', 'text/css');
			css.setAttribute('href', cssPath);

			var heads = document.getElementsByTagName('head');
			if (heads != null) {
				heads[0].appendChild(css);
			}
		}
	};

	/**
	 * function used to add a new js to current view
	 * @param args JSON params with values
	 */
	var _addJavascript = function(args) {

		if (args == null
			|| (args.filePath == null
				&& (args.fileName == null
					|| args.json == null
					|| args.json.data.framework == null
					|| args.json.data.framework.baseParams == null
					|| args.json.data.framework.baseParams.length < 10))) {
			return;
		}

		var jsPath = args.filePath;
		if (jsPath == null) {
			jsPath = _getFilePath({
				json: args.json,
				fileName: args.fileName,
				fileType: 'js',
				loadCustom: args.loadCustom
			});
		}

		if (jsPath != null) {
			var script = document.createElement('script');
			script.setAttribute('rel', 'stylesheet');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', jsPath);

			var bodies = document.getElementsByTagName('body');
			if (bodies != null) {
				bodies[0].appendChild(script);
			}
		}
	};

	/**
	 * get path to a file available in common folder
	 * @param args JSON with required parameters
	 */
	var _getFilePath = function(args) {

		var params = [];
		if (args == null
			|| args.fileName == null
			|| args.fileType == null
			|| args.json == null
			|| args.json.data.framework == null
			|| args.json.data.framework.baseParams == null
			|| args.json.data.framework.baseParams.length < 10) {
			return null;
		} else {
			params = args.json.data.framework.baseParams;
		}

		if (args.loadCustom == true) {
			return params[0] + '://' + params[1] + '/plnext/' + params[4] + '/' + params[5] + '/static/' + args.fileType + '/' + args.fileName;
		}

		return params[0] + '://' + params[1] + '/plnext/default/' + params[9] + '/static/merciAT/modules/common/' + args.fileType + '/' + args.fileName;
	};

	/**
	 * returns locale based on language code so that aria environment can be set
	 * this list of locale is taken from 'https://github.com/ariatemplates/ariatemplates/tree/master/src/aria/resources'
	 */
	var _getLocale = function(language) {
		switch (language) {
			case 'GB':
				return 'en_GB';
			case 'US':
				return 'en_US';
			case 'DE':
				return 'de_DE';
			case 'FR':
				return 'fr_FR';
			case 'ES':
				return 'es_ES';
			case 'CN':
				return 'zh_CN';
			case 'TW':
				return 'tw_TW';
			case 'KR':
				return 'ko_KR';
			case 'JP':
				return 'ja_JP';
			case 'IT':
				return 'it_IT';
			case 'HE':
				return 'he_IL';
			case 'RU':
				return 'ru_RU';
			case 'IT':
				return 'it_IT';
			case 'FI':
				return 'fi_FI';
			case 'NL':
				return 'nl_NL';
			case 'DK':
				return 'da_DK';
			case 'AR':
				return 'ar_SA';
			case 'IS':
				return 'is_IS';
			case 'NO':
				return 'no_NO';
			case 'PL':
				return 'pl_PL';
			case 'BR':
				return 'pt_BR';
			case 'PT':
				return 'pt_PT';
			case 'SE':
				return 'sv_SE';
			case 'TH':
				return 'th_TH';
			case 'TR':
				return 'tr_TR';
			default:
				return 'en_GB';
		}
	};

	/**
	 * process GTM content and add it to DOM
	 * @param args JSON data with all required paramters
	 */
	var _processGtm = function(args) {

		if (args == null
			|| args.isGTMEnabled == null
			|| args.gtmContainerValue == null) {
			return null;
		}

		if (args.isGTMEnabled == true) {
			var bodies = document.getElementsByTagName('body');
			if (bodies != null && bodies.length > 0) {

				var iFrame = document.createElement('iframe');
				iFrame.src = '//www.googletagmanager.com/ns.html?id=GTM-' + args.gtmContainerValue;
				iFrame.height = '0';
				iFrame.width = '0';
				iFrame.style = 'display:none;visibility:hidden';

				var noScript = document.createElement('noscript');
				noScript.appendChild(iFrame);

				bodies[0].appendChild(noScript);
			}
		}

		isGTMEnabled = args.isGTMEnabled;
		siteGTMContainerValue = args.gtmContainerValue;
	};

	var _createHeader = function(args) {

		if (args == null) {
			return;
		}

		Aria.loadTemplate({
			classpath: 'modules.view.merci.common.templates.MPageHeader',
			moduleCtrl: {
				classpath: 'modules.view.merci.common.controller.MerciCtrl'
			},
			div: args.headerDiv
		});
	};

	var _createMenuBar = function(args) {

		if (args == null || args.direction == null) {
			return;
		}

		args.direction = args.direction.toLowerCase();
		var bodies = document.getElementsByTagName('body');
		if (bodies != null && bodies.length > 0 && (args.direction == 'right' || args.direction == 'left')) {

			// apply css class to sb-site
			var sbSiteEl = document.getElementById('sb-site');
			if (sbSiteEl != null) {
				sbSiteEl.className += ' sb-site-layout';
			}

			var menuContainer = document.createElement('div');
			menuContainer.id = args.divId;
			menuContainer.className = 'sb-slidebar sb-' + args.direction;

			bodies[0].appendChild(menuContainer);

			Aria.loadTemplate({
				classpath: "modules.view.merci.common.templates.MSideMenu",
				div: args.divId
			});

			application.slidebars = _slidebars({
				'container': 'sb-site'
			});
		}
	};

	/**
	 * function used to load files related to check-in
	 * @param args JSON object carrying required parameters
	 */
	var _initCheckin = function(args) {

		if (args.isDebug === true || args.params == null || args.isCheckinEnabled != true) {
			return;
		}

		_addJavascript({
			filePath: args.params[0] + '://' + args.params[1] + '/plnext/default/' + args.params[9] + '/static/merciAT/checkin/mcheckin.js'
		});
	};

	/**
	 * create a slidebar
	 * @param args JSON object containing configuration parameter
	 */
	var _slidebars = function(args) {

		if (args == null) {
			args = {};
		}

		// ----------------------
		// 001 - Default Settings

		args['siteClose'] = true;
		args['scrollLock'] = false;
		args['disableOver'] = false;
		args['hideControlClasses'] = false;

		// -----------------------
		// 002 - Feature Detection

		var test = document.createElement('div').style, // Create element to test on.
		supportTransition = false, // Variable for testing transitions.
		supportTransform = false; // variable for testing transforms.

		// Test for CSS Transitions
		if (test.MozTransition === '' || test.WebkitTransition === '' || test.OTransition === '' || test.transition === '') supportTransition = true;

		// Test for CSS Transforms
		if (test.MozTransform === '' || test.WebkitTransform === '' || test.OTransform === '' || test.transform === '') supportTransform = true;

		// -----------------
		// 003 - User Agents

		var ua = navigator.userAgent, // Get user agent string.
		android = false, // Variable for storing android version.
		iOS = false; // Variable for storing iOS version.

		if (/Android/.test(ua)) { // Detect Android in user agent string.
			android = ua.substr(ua.indexOf('Android')+8, 3); // Set version of Android.
		} else if (/(iPhone|iPod|iPad)/.test(ua)) { // Detect iOS in user agent string.
			iOS = ua.substr(ua.indexOf('OS ')+3, 3).replace('_', '.'); // Set version of iOS.
		}

		if (android && android < 3 || iOS && iOS < 5) $('html').addClass('sb-static'); // Add helper class for older versions of Android & iOS.

		// -----------
		// 004 - Setup

		// Site container
		var $site = document.getElementById(args.container); // Cache the selector.

		// Left Slidebar
		if (document.getElementsByClassName('sb-left') != null) { // Check if the left Slidebar exists.
			var $left = document.getElementsByClassName('sb-left')[0], // Cache the selector.
			leftActive = false; // Used to check whether the left Slidebar is open or closed.
		}

		// Right Slidebar
		if (document.getElementsByClassName('sb-right') != null) { // Check if the right Slidebar exists.
			var $right = document.getElementsByClassName('sb-right')[0], // Cache the selector.
			rightActive = false; // Used to check whether the right Slidebar is open or closed.
		}

		var init = false; // Initialisation variable.
		var windowWidth = window.innerWidth; // Get width of window.

		var $controls = [];
		if (document.getElementsByClassName('sb-toggle-left') != null) {
			$controls.push(document.getElementsByClassName('sb-toggle-left')[0]);
		}

		if (document.getElementsByClassName('sb-toggle-right') != null) {
			$controls.push(document.getElementsByClassName('sb-toggle-right')[0]);
		}

		if (document.getElementsByClassName('sb-open-left') != null) {
			$controls.push(document.getElementsByClassName('sb-open-left')[0]);
		}

		if (document.getElementsByClassName('sb-open-right') != null) {
			$controls.push(document.getElementsByClassName('sb-open-right')[0]);
		}

		if (document.getElementsByClassName('sb-close') != null) {
			$controls.push(document.getElementsByClassName('sb-close')[0]);
		}

		var $slide = null;
		if (document.getElementsByClassName('sb-slide') != null) {
			$slide = document.getElementsByClassName('sb-slide')[0]; // Cache users elements to animate.
		}

		// Initailise Slidebars
		var _initialise = function() {
			if (!args.disableOver || (typeof args.disableOver === 'number' && args.disableOver >= windowWidth)) { // False or larger than window size.
				init = true; // true enabled Slidebars to open.

				if (document.getElementsByTagName('html') != null) {
					document.getElementsByTagName('html')[0].className += ' sb-init'; // Add helper class.
				}

				if (args.hideControlClasses) {
					for (var i = 0; i < $controls.length; i++) {
						$controls[i].className = $controls.className.replace(/(?:^|\s)sb-hide(?!\S)/g, '');
					}
				}

				_css(); // Set required inline styles.
			} else if (typeof args.disableOver === 'number' && args.disableOver < windowWidth) { // Less than window size.
				init = false; // false stop Slidebars from opening.
				if (document.getElementsByTagName('html') != null) {
					document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(/(?:^|\s)sb-init(?!\S)/g, '');// Add helper class.
				}

				if (args.hideControlClasses) {
					for (var i = 0; i < $controls.length; i++) {
						$controls[i].className += ' sb-hide'; // Hide controls
					}
				}

				if ($site.style.removeProperty) {
					$site.style.removeProperty('minHeight');
				} else {
					$site.style.removeAttribute('minHeight');
				}

				if (leftActive || rightActive) _close(); // Close Slidebars if open.
			}
		};

		var _getDocumentHeight = function() {
			return document.documentElement.clientHeight;
		};

		// Inline CSS
		var _css = function() {

			var html = document.documentElement;
			if (html == null) {
				return;
			}

			if ($site.style.removeProperty) {
				$site.style.removeProperty('minHeight');
			} else {
				$site.style.removeAttribute('minHeight');
			}

			// Set minimum height.
			$site.style['minHeight'] = _getDocumentHeight() + 'px';

			// Custom Slidebar widths.
			if ($left && $left.className.indexOf('sb-width-custom') != -1) {
				$left.style['width'] = $left.getAttribute('data-sb-width');
			}

			if ($right && $right.className.indexOf('sb-width-custom') != -1) {
				$right.style['width'] = $right.getAttribute('data-sb-width'); // Set user custom width
			}

			// Set off-canvas margins for Slidebars with push and overlay animations.
			if ($left && ($left.className.indexOf('sb-style-push') != -1 || $left.className.indexOf('sb-style-overlay') != -1)) {
				$left.style['marginLeft'] = '-' + $left.offsetWidth;
			}

			if ($right && ($right.className.indexOf('sb-style-push') != -1 || $right.className.indexOf('sb-style-overlay') != -1)) {
				$right.style['marginRight'] = '-' + $right.offsetWidth;
			}

			// Site scroll locking.
			if (args.scrollLock) {
				html.className += ' sb-scroll-lock'; // Add helper class.
			}
		};

		// Close either Slidebar
		var _close = function(callback) {
			if (leftActive || rightActive) { // If a Slidebar is open.
				if (leftActive) {
					_animate($left, '0px', 'left'); // Animation
					leftActive = false;
				}
				if (rightActive) {
					_animate($right, '0px', 'right'); // Animation
					rightActive = false;
				}

				setTimeout(function() { // Wait for closing animation to finish.

					var html = document.documentElement;
					if (html == null) {
						return;
					}

					// Remove active classes.
					html.className = html.className.replace(/(?:^|\s)sb-active(?!\S)/g, '');
					html.className = html.className.replace(/(?:^|\s)sb-active-left(?!\S)/g, '');
					html.className = html.className.replace(/(?:^|\s)sb-active-right(?!\S)/g, '');

					if ($left) {
						$left.className = $left.className.replace(/(?:^|\s)sb-active(?!\S)/g, '');
					}

					if ($right) {
						$right.className = $right.className.replace(/(?:^|\s)sb-active(?!\S)/g, '');
					}

					if (typeof callback === 'function') callback(); // Run callback function.
				}, 400);
			}
		};

		var _onWindowResize = function() {
			var resizedWindowWidth = window.innerWidth; // Get resized window width.
			if (windowWidth !== resizedWindowWidth) { // Slidebars is running and window was actually resized.
				windowWidth = resizedWindowWidth; // Set the new window width.
				_initialise(); // Call initalise to see if Slidebars should still be running.
				if (leftActive) _open('left'); // If left Slidebar is open, calling open will ensure it is the correct size.
				if (rightActive) _open('right'); // If right Slidebar is open, calling open will ensure it is the correct size.
			}
		};

		/**
		 * function used to animate method's setTimeout call
		 * @param args parameters to be passed
		 */
		var __animateTimeout = function(args) {

			if (args.type == null) {
				// If closed, remove the inline styling on completion of the animation.
				setTimeout(function() {
					if (args.amount === '0px' && args.el != null) {
						//args.el.removeAttribute('style'); *commented as part of CR 08788787: Choose picture background*
						_css();
					}
				}, 400);
			} else if (args.type == 'side') {
				setTimeout(function(el) { // Set a timeout to allow the 0 value to be applied above.
					if (args.el != null) {
						args.el.style[args.side] = args.amount; // Apply the animation.
					}
				}, 1);
			}
		};

		// Animate mixin.
		var _animate = function(object, amount, side) {

			// Choose selectors depending on animation style.
			var selector = [];
			var addFooter = false;

			if (object.className.indexOf('sb-style-push') != -1) {
				// Push - Animate site, Slidebar and user elements.
				addFooter = true;
				if ($site) { selector.push($site); }
				if (object) { selector.push(object); }
				if ($slide) { selector.push($slide); }
			} else if (object.className.indexOf('sb-style-overlay') != -1) {
				// Overlay - Animate Slidebar only.
				if (object) { selector.push(object); }
			} else {
				// Reveal - Animate site and user elements.
				addFooter = true;
				if ($site) { selector.push($site); }
				if ($slide) { selector.push($slide); }
			}

			// fetch footer
			if (addFooter == true) {
				var footers = _getFixedElements();
				if (footers && footers.length > 0) {
					for (var i = 0; i < footers.length; i++) {
						selector.push(footers[i]);
					}
				}
			}

			for (var i = 0; i < selector.length; i++) {

				// removed application of 'transform' for animation === 'translate'
				// it was creating issue when header and footer were in fixed position
				if (animation === 'translate' || animation === 'side') {
					if (amount[0] === '-') {
						amount = amount.substring(1); // Remove the '-' from the passed amount for side animations.
					}

					if (amount !== '0px') {
						selector[i].style[side] = '0px'; // Add a 0 value so css transition works.
					}

					__animateTimeout({
						el: selector[i],
						side: side,
						amount: amount,
						type: 'side'
					});
				} else if (animation === 'jQuery') {
					if (amount[0] === '-') {
						amount = amount.substring(1); // Remove the '-' from the passed amount for jQuery animations.
					}
					var properties = {};
					properties[side] = amount;
					$(selector[i]).stop().animate(properties, 400); // Stop any current jQuery animation before starting another.
				}

				__animateTimeout({
					el: selector[i],
					amount: amount
				});
			}
		};

		// Open a Slidebar
		var _open = function(side, callback) {
			// Check to see if opposite Slidebar is open.
			if (side === 'left' && $left && rightActive || side === 'right' && $right && leftActive) { // It's open, close it, then continue.
				_close();
				setTimeout(proceed, 400);
			} else { // Its not open, continue.
				proceed();
			}

			// Open
			function proceed() {

				var html = document.documentElement;
				if (html == null) {
					return;
				}

				if (init && side === 'left' && $left) { // Slidebars is initiated, left is in use and called to open.
					html.className += ' sb-active sb-active-left'; // Add active classes.
					$left.className += ' sb-active';
					_animate($left, $left.offsetWidth + 'px', 'left'); // Animation
					setTimeout(function() {
						leftActive = true;
						if (typeof callback === 'function') callback(); // Run callback function.
					}, 400); // Set active variables.
				} else if (init && side === 'right' && $right) { // Slidebars is initiated, right is in use and called to open.
					html.className += ' sb-active sb-active-right'; // Add active classes.
					$right.className += ' sb-active';
					_animate($right, '-' + $right.offsetWidth + 'px', 'right'); // Animation
					_animate($right, 'auto', 'left');
					setTimeout(function() {
						rightActive = true;
						if (typeof callback === 'function') callback(); // Run callback function.
					}, 400); // Set active variables.
				}
			}
		};

		// Toggle either Slidebar
		var _toggle = function(side, callback) {
			if (side === 'left' && $left) { // If left Slidebar is called and in use.
				if (!leftActive) {
					_open('left', callback); // Slidebar is closed, open it.
				} else {
					_close(null, callback); // Slidebar is open, close it.
				}
			}
			if (side === 'right' && $right) { // If right Slidebar is called and in use.
				if (!rightActive) {
					_open('right', callback); // Slidebar is closed, open it.
				} else {
					_close(null, callback); // Slidebar is open, close it.
				}
			}
		};

		var _eventHandler = function(event, selector) {
			event.stopPropagation(); // Stop event bubbling.
			event.preventDefault(); // Prevent default behaviour.
			if (event.type === 'touchend') {
				for (var i = 0; selector != null && i < selector.length; i++) {
					selector[i].removeEventListener('click'); // If event type was touch, turn off clicks to prevent phantom clicks.
				}
			}
		};

		/**
		 * method to get a reference to footer object
		 * @return array
		 */
		var _getFixedElements = function() {
			var elements = [];
			var footers = document.getElementsByClassName('footer');
			for (var i = 0; footers != null && i < footers.length; i++) {
				elements.push(footers[i])
			}

			var headers = document.getElementsByClassName('top');
			for (var i = 0; headers != null && i < headers.length; i++) {
				elements.push(headers[i])
			}

			return elements;
		};

		var _onSiteTouchClick = function(event) {
			if (args.siteClose && (leftActive || rightActive)) { // If settings permit closing by site and left or right Slidebar is open.

				// get footer
				var els = _getFixedElements();
				els.push($site);

				_eventHandler(event, els); // Handle the event.
				_close(); // Close it.
			}
		};

		var _eventOpen = function(event, args) {

			if (args == null) {
				return;
			}

			_eventHandler(event, args.els); // Handle the event.
			_open(args.direction); // Open the left Slidebar.
		};

		var _eventToggle = function(event, args) {

			if (args == null) {
				return;
			}

			_eventHandler(event, args.els); // Handle the event.
			_toggle(args.direction); // Toggle the left Slidbar.
		};

		/**
		 * attach multiple events to an element
		 * @param args JSON containing parameters for this method
		 */
		var _addListener = function(args) {

			// if parameters are not passed
			if (args == null || args.fn == null || args.els == null) {
				return;
			}

			for (var i = 0; i < args.els.length; i++) {
				var el = args.els[i];
				for (var key in args.fn) {
					if (args.fn.hasOwnProperty(key)) {

						var params = args.fn[key]['params'] || {};
						params['els'] = args.els;

						if(el.attachEvent) {
						    el.attachEvent('on' + key, function(e) {args.fn[key]['name'](e, params)}, false);
						} else if(el.addEventListener) {
						    el.addEventListener(key, function(e) {args.fn[key]['name'](e, params)}, false);
						}
					}
				}
			}
		};

		/**
		 * this function is used to get all the clickable items from side nav bar
		 * @param args
		 */
		var _getMenuItems = function(args) {

			if (args == null || args.sbMenus == null) {
				return [];
			}

			var menuItems = [];
			for (var i = 0; i < args.sbMenus.length; i++) {
				var sbMenu = args.sbMenus[i];
				for (var j = 0; j < sbMenu.childNodes.length; j++) {
					if (sbMenu.childNodes[j].className == null
						|| sbMenu.childNodes[j].className.indexOf('sb-sub-menu-holder') == -1) {
						menuItems.push(sbMenu.childNodes[j]);
					} else {
						var subMenuItems = _getMenuItems({
							'sbMenus': document.getElementsByClassName('sb-sub-menu')
						});

						if (subMenuItems != null && subMenuItems.length > 0) {
							for (var k = 0; k < subMenuItems.length; k++) {
								menuItems.push(subMenuItems[k]);
							}
						}
					}
				}
			}

			return menuItems;
		};

		_initialise();

		if(window.attachEvent) {
			window.attachEvent('onresize', _onWindowResize);
			window.attachEvent('onorientationchange', _onWindowResize);
		} else if(window.addEventListener) {
			window.addEventListener('resize', _onWindowResize, true);
			window.addEventListener('orientationchange', _onWindowResize, true);
		}
		// I may include a height check along side a width check here in future.

		// ---------------
		// 005 - Animation

		var animation; // Animation type.

		// Set animation type.
		if (supportTransition && supportTransform) { // Browser supports css transitions and transforms.
			animation = 'translate'; // Translate for browsers that support it.
			if (android && android < 4.4) animation = 'side'; // Android supports both, but can't translate any fixed positions, so use left instead.
		} else {
			animation = 'jQuery'; // Browsers that don't support css transitions and transitions.
		}


		// ----------------
		// 006 - User Input

		// Close Slidebar via site
		_addListener({
			els:[$site],
			fn: {
				'click': {
					'name': _onSiteTouchClick
				},
				'touchend': {
					'name': _onSiteTouchClick
				}
			}
		});

		// ---------
		// 007 - API

		return {
			open: _open, // Maps user variable name to the open method.
			close: _close, // Maps user variable name to the close method.
			toggle: _toggle, // Maps user variable name to the toggle method.
			init: function() { // Returns true or false whether Slidebars are running or not.
				return init; // Returns true or false whether Slidebars are running.
			},
			reInit: _initialise, // Run the init method to check if the plugin should still be running.
			resetCSS: _css, // Reset inline
			applyListener: function(args) {

				var toggleLeftEls = document.getElementsByClassName('sb-toggle-' + args.direction);
				var toggleRightEls = document.getElementsByClassName('sb-toggle-' + args.direction);
				var openLeftEls = document.getElementsByClassName('sb-open-' + args.direction);
				var openRightEls = document.getElementsByClassName('sb-open-' + args.direction);

				if ((toggleLeftEls != null && toggleLeftEls.length > 0)
					 || (toggleRightEls != null && toggleRightEls.length > 0)
					 || (openLeftEls != null && openLeftEls.length > 0)
					 || (openRightEls != null && openRightEls.length > 0)) {

					_addListener({
						els: toggleLeftEls,
						fn: {
							'click': {
								'name': _eventToggle,
								'params': {
									'direction': args.direction
								}
							},
							'touchend': {
								'name': _eventToggle,
								'params': {
									'direction': args.direction
								}
							}
						}
					});

					_addListener({
						els: openLeftEls,
						fn: {
							'click': {
								'name': _eventOpen,
								'params': {
									'direction': args.direction
								}
							},
							'touchend': {
								'name': _eventOpen,
								'params': {
									'direction': args.direction
								}
							}
						}
					});

					// apply listener on all menu items
					var menuItems = _getMenuItems({
						'sbMenus': document.getElementsByClassName('sb-menu')
					});

					if (menuItems.length > 0) {
						_addListener({
							els: menuItems,
							fn: {
								'click': {
									'name': _close,
									'params': {
										'direction': args.direction
									}
								}
							}
						});
					}
				}
			},
			active: function(side) { // Returns true or false whether Slidebar is open or closed.
				if (side === 'left' && $left) return leftActive;
				if (side === 'right' && $right) return rightActive;
			},
			destroy: function(side) { // Removes the Slidebar from the DOM.
				if (side === 'left' && $left) {
					if (leftActive) _close(); // Close if its open.
					setTimeout(function() {
						$left.parentNode.removeChild($left); // Remove it.
						$left = false; // Set variable to false so it cannot be opened again.
					}, 400);
				}
				if (side === 'right' && $right) {
					if (rightActive) _close(); // Close if its open.
					setTimeout(function() {
						$right.parentNode.removeChild($right); // Remove it.
						$right = false; // Set variable to false so it cannot be opened again.
					}, 400);
				}
			}
		};
	};

	return {

		/**
		 * flag to define if current view is tablet view<br/>
		 * it is based on site parameter + device detection using user agent
		 */
		isTablet: function() {
			return _isTablet;
		},

		/**
		 * defines where navbar should be places<br/>
		 * expected values are right and left, any other value implies that navbar will be hidden
		 */
		navbarAlignment: function() {
			return _showSideMenu;
		},

		/**
		 * function used to add a new css to current view
		 * @param args JSON params with values
		 *			{
		 *				json:{
		 *					framework: {
		 *						baseParams:[]
		 *					}
		 *				},
		 *				fileName: '',
		 *				loadCustom: true
		 *			}
		 */
		addCss: function(args) {
			_addCss(args);
		},

		/**
		 * function used to add a new css to current view
		 * @param args JSON params with values
		 *			{
		 *				json:{
		 *					framework: {
		 *						baseParams:[]
		 *					}
		 *				},
		 *				fileName: '',
		 *				loadCustom: true
		 *			}
		 */
		addJavascript: function(args) {
			_addJavascript(args);
		},

		/**
		 * returns the locale based on language
		 * @param args JSON containing language
		 */
		getLocale: function(args) {
			return _getLocale(args.language);   // to get value add return keywords in way to fix PTR 09331655
		},

		/**
		 * function to be called at page load<br/>
		 * executes all the required jobs to initialize MeRCI home page
		 * @param args JSON params to be passed from calling function
		 */
		initMeRCI: function(args) {

			if (args == null
				|| args.json == null
				|| args.json.data.framework == null
				|| args.json.data.framework.settings == null) {
				return;
			}
			args.json.ui = args.json.ui || {};
			args.json.ui.cntTrip = args.json.ui.cntTrip || 0;
			args.json.ui.cntBookMark = args.json.ui.cntBookMark || 0;
			args.json.ui.cntBoardPass = args.json.ui.cntBoardPass || 0;
			args.json.ui.tabValue = args.json.ui.tabValue || "tabHome";
			args.json.localStorage = args.json.localStorage || {};
			// set json variables
			args.json.localStorage = {};

			_initData({
				data: args.json
			});

			_loadMeRCIAppData();
			_addGoogleAnalytics({
				isWebFlow: args.isWebFlow,
				isGaEnabled: args.json.data.framework.settings.isGaEnabled
			});

			_loadSocialMedia({
				facebook: true,
				twitter: true,
				isFBEnabled: args.json.data.framework.settings.isFBEnabled
			});

			_initCheckin({
				isDebug: args.isDebug,
				params: args.json.data.framework.baseParams,
				isCheckinEnabled: args.json.data.framework.settings.isCheckinEnabled
			});

			_setAriaEnvironment({
				language: args.json.data.framework.baseParams[12]
			});

			_loadAria({
				json: args.json,
				isGTMEnabled: args.json.data.framework.settings.isGTMEnabled,
				showSideMenu: args.json.data.framework.settings.showSideMenu,
				gtmContainerValue: args.json.data.framework.settings.gtmContainerValue,
				isTabletEnabled: args.json.data.framework.settings.isTabletEnabled
			});

			/*-- some common string functions [START] --*/
			String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
			String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
			String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
			String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
			String.prototype.toLowerCase = function () { s=""; for(i=0;c=this.charCodeAt(i++);s+=String.fromCharCode(c>64&c<91?c+32:c));return s};
			/*-- some common string functions [ END ] --*/

			/*-- default time-out for ajax --*/
			aria.core.IO.defaultTimeout=300000;
			aria.core.IO.headers={'Cache-Control':'max-age=0'};
		},

		/**
		 * provides an interface to navigate within application<br/>
		 * this implementation relies on page engine navigate function
		 * @param args JSON object required to trigger navigation
		 */
		navigate: function(args) {
			_pageEngine.navigate({
				pageId: args.pageId,
				forceReload: args.forceReload
			});
		},

		/**
		 * checks whether localstorage is supported by application or not
		 * @return boolean
		 */
		supports_local_storage: function() {
			try {
				var supportLS = 'localStorage' in window && window['localStorage'] !== null;
				if (supportLS) {
					/* This check is reqd for private browsing mode in iPad */
					try {
						localStorage.setItem("checkLS", "Supported");
					} catch (e) {
						if (e == QUOTA_EXCEEDED_ERR) {
							return false;
						}
					}
				}
				return supportLS;
			} catch (e) {
				return false;
			}
		},

		/**
		 * function used to read cookie from browser
		 * @return cookie info
		 */
		getCookie: function(c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return null;
		},

		/**
		 * This method should not be used direcltly from other files. Please use getStoredItem
		 */
		getItemFromWebStorage: function(key) {
			return localStorage.getItem(key);
		},

		/**
		 * Use this method to get stored data only from Browser or WebView Local Storage
		 * @param name Key name
		 **/
		getStoredItem: function(name) {
			if (this.supports_local_storage()) {
				return this.getItemFromWebStorage(name);
			} else {
				return this.getCookie(name);
			}
		}
	}
})();

/**
 * callback function for google plus integration
 * @param args {
 *			"id_token": A JSON web token (JWT) that contains identity information about the user that is digitally signed by Google,
 *			"access_token": the access token,
 *			"expires_in": the validity of the token, in seconds,
 *			"error": The OAuth2 error type if problems occurred
 *		}
 * @return void
 */
function googlePlusInit(args) {
	// nothing required inside for now
}