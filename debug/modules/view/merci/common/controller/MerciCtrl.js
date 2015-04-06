Aria.classDefinition({
	$classpath: 'modules.view.merci.common.controller.MerciCtrl',
	$extends: 'aria.templates.ModuleCtrl',
	$implements: ['modules.view.merci.common.interfaces.IMerciCtrlInterface'],
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$constructor: function(args) {
		this.$ModuleCtrl.constructor.call(this);
	},

	$prototype: {

		$publicInterfaceName: 'modules.view.merci.common.interfaces.IMerciCtrlInterface',

		/**
		 * return the data corresponding to a module<br/>
		 * e.g. return jsonResponse.data.booking for booking module
		 */
		getModuleData: function() {
			return null;
		},

		/**
		 * return the data corresponding to a module<br/>
		 * e.g. return jsonResponse.data[key] for a module
		 */
		getJsonData: function(args) {
			if(jsonResponse.data[args.key]==null){
				jsonResponse.data[args.key] = {};
			}
			return jsonResponse.data[args.key];
		},

		/**
		 * raise an event to be catched by other controllers
		 * @param evt JSON object containing event information
		 */
		raiseEvent: function(evt) {
			this.$raiseEvent(evt);
		},

		/**
		 * function used to navigate back in application<br/>
		 * this function will be called by all the back buttons in UI
		 */
		goBack: function() {
			history.go(-1);
		},

		/**
		 * navigate from one template to other
		 * @param args aria parameters
		 * @param layout page id
		 */
		navigate: function(args, layout) {

			var boolReload = false;
			if (args != null) {
				boolReload = args.forceReload;
			}

			// navigate
			window.scrollTo(0, 0);
			application.navigate({
				pageId: layout,
				forceReload: boolReload
			});
		},

		/**
		 * this method is used to refresh header content
		 * @param title title for page header
		 * @param bannerHtml FF banner html (if any)
		 * @param homePageURL URL to navigate when user clicks logo or header text
		 * @param showButton boolean which indicates whether back button should be shown
		 */
		setHeaderInfo: function(headerJSON) {

			var header = {};
			var utils = modules.view.merci.common.utils.MCommonScript;

			header.title = headerJSON.title;
			header.bannerHtml = headerJSON.bannerHtmlL;
			header.showButton = headerJSON.showButton;
			header.showSearch = headerJSON.showSearch;
			header.homePageURL = headerJSON.homePageURL;
			header.selectedServices = headerJSON.selectedServices;
			header.backBtnLabel=headerJSON.backBtnLabel;
			if (!utils.isEmptyObject(headerJSON.loyaltyInfoBanner)) {
				header.loyaltyInfoBanner = headerJSON.loyaltyInfoBanner;
			}

			if (headerJSON.companyName != null) {
				header.companyName = headerJSON.companyName;
			}
			//check for shopping basket
			if (headerJSON.cart != null) {
				header.cart = headerJSON.cart;
			} else {
				header.cart = "";
			}

			if (headerJSON.headerButton != null) {
				header.headerButton = headerJSON.headerButton;
			} else {
				header.headerButton = "";
			}

			// page title
			if (header.title != null && header.companyName != null) {
				document.title = header.companyName + ' - ' + header.title;
			}

			// set currency converter data
			if (headerJSON.currencyConverter != null) {
				header['currencyConverter'] = headerJSON.currencyConverter;
			} else {
				if (header['currencyConverter'] == null) {
					header['currencyConverter'] = {
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
						showButton: false,
						newPopupEnabled: false
					}
				} else {
					header['currencyConverter'].showButton = false;
				}
			}

			// refresh header template
			jsonResponse.data.header = header;
			if (jsonResponse.pageHeader != null) {
				jsonResponse.pageHeader.$refresh();
			}
		},

		/**
		 * this method is used by header to fetch data<br/>
		 * @note soon will be updated by a better implementation
		 */
		getHeaderInfo: function() {
			return jsonResponse.data.header;
		},

		/**
         * fetch data from localstorage
         * @param data name of key
         */
        getStaticData: function(data) {

        	// reference to utility class
        	var utils = modules.view.merci.common.utils.MCommonScript;

			if(jsonResponse == null ){
                jsonResponse={};
                jsonResponse.localStorage= jsonResponse.localStorage || {};
                jsonResponse.localStorage[data]={};
                return jsonResponse.localStorage[data];
            }else{
                if(jsonResponse.localStorage==null || utils.isEmptyObject(jsonResponse.localStorage)){
                    jsonResponse.localStorage = jsonResponse.localStorage || {};
                    jsonResponse.localStorage[data]={};
                    return jsonResponse.localStorage[data];
                }else{
                    return jsonResponse.localStorage[data];
                }

            }
		},

		/**
         * set data in localstorage
         * @param data name of key
         * @param value value for the key
         */
		setStaticData: function(data,value) {
			// if data default available
			if (jsonResponse != null) {
				jsonResponse.localStorage[data]=value;
				return jsonResponse.localStorage;
			}
		}
	}
});