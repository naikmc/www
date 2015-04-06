Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.URLManager',
	$dependencies: [
		'aria.utils.HashManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$singleton: true,
	$prototype: {

		/* Get SITE code, if available */
		__getSiteCode: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {
				return this.getStringParam().SITE;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[11];
		},

		/* Get COUNTRY_SITE, if available */
		__getCountrySite: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {
				return this.getStringParam().COUNTRY_SITE;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[13];

		},

		/* Get language code, if available */
		__getLanguageCode: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {

				// for community app custom features
				if (jsonResponse.data.custom_framework != null && jsonResponse.data.custom_framework.baseParams != null) {
					return jsonResponse.data.custom_framework.baseParams[12];
				}

				return this.getStringParam().LANGUAGE;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[12];
		},

		/* Get client, if available */
		__getClient: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {
				return this.getStringParam().client;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[14];
		},

		/* Get ENABLE_DEVICECAL, if available */
		__getEnableDeviceCal: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {
				return this.getStringParam().ENABLE_DEVICECAL;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[15];
		},

		/**
		 * reads the current URL and extract the AeRE site name from it,
		 * for local platforms this will correspond to 'dev'
		 */
		__getSiteName: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {

				var url = document.URL;

				// do a substring on base URL to get site name
				url = url.substring(url.indexOf('//') + 2, url.length);
				url = url.substring(url.indexOf('/') + 1, url.length);
				url = url.substring(url.indexOf('/') + 1, url.length);
				url = url.substring(0, url.indexOf('/'));

				return url;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[4];
		},

		/**
		 * reads the current URL and extract the domain name,
		 * for local platforms it will return 'localhost'
		 */
		__getDomainName: function() {

			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {

				var url = document.URL;

				// do a substring on base URL to get domain name
				url = url.substring(url.indexOf('//') + 2, url.length);
				url = url.substring(0, url.indexOf('/'));

				return url;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[1];
		},

		/**
		 * reads the current URL and extract the current protocol used,
		 * if isSecured is passed as true it will return 'https' irrespective of current protocol
		 * @param isSecured if true, method will return 'https'
		 */
		__getProtocol: function(isSecured) {

			// if secured
			if (isSecured == true) {
				return 'https';
			}

			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {

				var url = document.URL;
				url = url.substring(0, url.indexOf('://'));

				return url;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[0];
		},

		keepExternalAppAlive: function() {

			// if in JSON then continue
			if (jsonResponse.data.framework == null ||
				jsonResponse.data.framework.keepAlive != null) {
				var img = new Image();
				img.src = jsonResponse.data.framework.keepAlive;
			}
		},

		/** CR 7107950 
		 *	This function sets the required parameters as a URL
		 */
		__getLoyaltyInformation: function() {
			var params = '';
			if (jsonResponse.data.framework != null) {
				if (jsonResponse.data.framework.baseParams[16] != null) {
					var airlineName = jsonResponse.data.framework.baseParams[16];
					var an = "&PREF_AIR_FREQ_AIRLINE_1_1=" + airlineName;
					params = params + an;
				}
				if (jsonResponse.data.framework.baseParams[17] != null) {
					var miles = jsonResponse.data.framework.baseParams[17];
					var m = "&PREF_AIR_FREQ_MILES_1_1=" + miles;
					params = params + m;
				}
				if (jsonResponse.data.framework.baseParams[18] != null) {
					var tier = jsonResponse.data.framework.baseParams[18];
					var t = "&PREF_AIR_FREQ_LEVEL_1_1=" + tier;
					params = params + t;
				}
				if (jsonResponse.data.framework.baseParams[19] != null) {
					var title = jsonResponse.data.framework.baseParams[19];
					var tl = "&PREF_AIR_FREQ_OWNER_TITLE_1_1=" + title;
					params = params + tl;
				}
				if (jsonResponse.data.framework.baseParams[20] != null) {
					var firstName = jsonResponse.data.framework.baseParams[20];
					var fname = "&PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1=" + firstName;
					params = params + fname;
				}
				if (jsonResponse.data.framework.baseParams[21] != null) {
					var lastName = jsonResponse.data.framework.baseParams[21];
					var lname = "&PREF_AIR_FREQ_OWNER_LASTNAME_1_1=" + lastName;
					params = params + lname;
				}
				if (jsonResponse.data.framework.baseParams[22] != null) {
					var programmeNo = jsonResponse.data.framework.baseParams[22];
					var pno = "&PREF_AIR_FREQ_NUMBER_1_1=" + programmeNo;
					params = params + pno;
				}
			}

			return params;

		},

		/* CR 7107950 */

		/**
		 * this function reads the current URL and returns an Object with key value mapping.
		 * Get Parameters can be accesses using the object as in example retObject.getParamName
		 */
		getStringParam: function() {

			var query_string = {};
			var query = Aria.$window.location.search.substring(1);
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {

				var pair = vars[i].split("=");

				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = pair[1];
				} else if (typeof query_string[pair[0]] === "string") {
					var arr = [query_string[pair[0]], pair[1]];
					query_string[pair[0]] = arr;
				} else {
					query_string[pair[0]].push(pair[1]);
				}
			}

			return query_string;
		},

		/**
		 * return array of parameters as send from server
		 * Get the list of parameters for the URL base.
		 * The indexes are:
		 * 0: The HTTP protocol value.
		 * 1: The host-name value.
		 * 2: The port value.
		 * 3: The context path (web-application name). Start with a slash.
		 * 4: The site name.
		 * 5: The static version or the skin.
		 * 6: The request URI. Start with a slash.
		 * 7: The request URL before the forward without the web-application name. Start with a slash.
		 * 8: The query.
		 * 9: The JavaScript library version.
		 * 10: The URL prefix. Start with a slash.
		 * 11: The SITE code
		 * 12: The LANGUAGE code
		 * 13: The COUNTRY_SITE value
		 * 14: The client parameter value
		 */
		getBaseParams: function() {

			if (jsonResponse.data.framework != null && jsonResponse.data.framework.baseParams != null) {
				return jsonResponse.data.framework.baseParams;
			}

			var baseParams = new Array();
			baseParams.push(this.__getProtocol(false)); // protocol
			baseParams.push(this.__getDomainName()); // host-name
			baseParams.push(''); // port no
			baseParams.push(''); // web application name
			baseParams.push(this.__getSiteName()); // site name
			baseParams.push(''); // static version
			baseParams.push(''); // request URI
			baseParams.push(''); // request URL
			baseParams.push(''); // query
			baseParams.push(''); // javascript library version
			baseParams.push(''); // URL prefix
			baseParams.push(this.__getSiteCode()); // Site Code
			baseParams.push(this.__getLanguageCode()); // Language Code
			baseParams.push(this.__getCountrySite()); // Country Site
			baseParams.push(this.__getClient()); // client
			baseParams.push(this.__getEnableDeviceCal()); // ENABLE_DEVICECAL
			return baseParams;
		},

		/**
		 * returns the URL with domain and site name,
		 * action is not added to this URL
		 * @param isSecured if true, URL will be created with https
		 */
		getModuleName: function(isSecured) {
			var methodName = this.__getProtocol(isSecured) + '://' + this.__getDomainName() + '/plnext/' + this.__getSiteName();
			return methodName;
		},

		/**
		 * return the name of action along with default parameters like SITE and language appended,
		 * default params will be appended only if defaultParams is passed as true
		 * @param action name of action
		 * @param settings JSON object with setting parameter like defaultParams and appendSession
		 */
		getActionName: function(action, settings) {

			var actionName = action;

			// getting settings value
			var appendSession = true;
			if (settings != null && settings.appendSession != null) {
				appendSession = settings.appendSession;
			}

			// appending session ID to URL
			if (appendSession == true && jsonResponse.data != null && jsonResponse.data.framework != null && jsonResponse.data.framework.sessionId != null) {
				actionName += ";jsessionid=" + jsonResponse.data.framework.sessionId;
			}

			var defaultParams = true;
			if (settings != null && settings.defaultParams != null) {
				defaultParams = settings.defaultParams;
			}

			if (defaultParams == true) {

				if (actionName.indexOf('?') !== -1) {
					actionName += '&';
				} else {
					actionName += '?';
				}

				actionName += 'SITE=' + this.__getSiteCode();
				actionName += '&LANGUAGE=' + this.__getLanguageCode();

				var client = this.__getClient();
				if (client != undefined) {
					actionName += '&client=' + client;
				}

				var countrySite = this.__getCountrySite();
				if (countrySite != undefined) {
					actionName += '&COUNTRY_SITE=' + countrySite;
				}
				var enableDeviceCal = this.__getEnableDeviceCal();
				if (enableDeviceCal != undefined) {
					actionName += '&ENABLE_DEVICECAL=' + enableDeviceCal;
				}
				var externalId = this.__getExternalId();
				if (externalId != undefined && externalId != '') {
					actionName += '&EXTERNAL_ID=' + externalId;
				}
			}

			// return
			return actionName;
		},

		/**
		 * creates a complete URL used to make server request
		 * @param action name of action
		 * @param settings JSON object with setting parameter like defaultParams and appendSession
		 */
		getFullURL: function(action, settings) {

			var isSecured = false;
			if (settings != null && settings.isSecured != null) {
				isSecured = settings.isSecured;
			}

			return this.getModuleName(isSecured) + '/' + this.getActionName(action, settings);
		},

		/**
		 * logs error to server
		 * @param data JSON object with all the required parameters to send error to server
		 *		Expected Params:
		 *			msg: error message
		 *          stack: error stack [OPTIONAL],
		 *          type: type of error i.e. E-> Error, I-> Info, W-> warning, D-> debug
		 *          file: name of template
		 *          method: name of method where error occurred
		 */
		logError: function(data) {
			var request = {
				url: this.getFullURL('MAriaLogMessage.action', null),
				type: 'POST',
				data: 'MSG_INFO=' + JSON.stringify(data),
				dataType: 'text',
				crossDomain: 'true',
				success: function(resp) {
					// log it on browser console
					console.log('Error Logged: ' + data.msg);
				}
			}

			$.ajax(request);
		},

		/**
		 * function triggered when hash tag in URL is changed
		 * this is implemented to exit app when back button is pressed from 1st page
		 */
		onHashChange: function() {
			var hashPage = aria.utils.HashManager.getHashString();
			if (hashPage == null || hashPage == '') {
				history.go(-1);
			} else {
				var calDiv = document.getElementById("ui-datepicker-div");
				if (calDiv) {
					calDiv.style.display = "none";
				}
			}

			var utils = modules.view.merci.common.utils.MCommonScript;
			if (utils.isRequestFromApps() && typeof merciAppData != 'undefined') {
				if (hashPage.indexOf('merci') == -1) {

					// remove merci css files
					this.removeCssFiles(merciAppData["cssFiles"]);


					// remove rtl css for merci
					this.removeCssFiles(merciAppData["rtlCssFiles"]);


					// add custom package css files
					this.addCssFiles(merciAppData["customCssFiles"]);


					// add rtl css files for custom package
					if (utils.isRTLLanguage()) {
						this.addCssFiles(merciAppData["rtlCustomCssFiles"]);
					}

				} else {

					// remove custom package css files
					this.removeCssFiles(merciAppData["customCssFiles"]);

					// remove rtl css for merci
					this.removeCssFiles(merciAppData["rtlCssFiles"]);

					// remove rtl css files for custom package
					this.removeCssFiles(merciAppData["rtlCustomCssFiles"]);


					// add merci css files
					this.addCssFiles(merciAppData["cssFiles"]);


					// add rtl css files for custom package
					if (utils.isRTLLanguage()) {
						this.addCssFiles(merciAppData["rtlCssFiles"]);
					}
				}
			}
		},

		/**
		 * adds a css file to DOM
		 * @param args
		 */
		addCssFiles: function(args) {
			if (args != null) {
				for (var key in args) {
					if (args.hasOwnProperty(key)) {
						if (args[key] != null && args[key] != '') {
							var element = document.getElementById(args[key].id);
							if (element == null) {
								var customcssLink = document.createElement('link');
								customcssLink.setAttribute('rel', 'stylesheet');
								customcssLink.setAttribute('type', 'text/css');
								customcssLink.setAttribute('id', args[key].id);
								customcssLink.setAttribute('href', args[key].url);
								customcssLink.setAttribute('media', 'screen');
								document.getElementsByTagName('head')[0].appendChild(customcssLink);
							}
						}
					}
				}
			}
		},

		/**
		 * removes a CSS file from DOM
		 * @param args
		 */
		removeCssFiles: function(args) {
			if (args != null) {
				for (var key in args) {
					if (args.hasOwnProperty(key)) {
						if (args[key] != null && args[key] != '') {
							var element = document.getElementById(args[key].id);
							if (element != null) {
								element.parentNode.removeChild(element);
							}
						}
					}
				}
			}
		},

		/**
		 * hit server using ARIA implementation of XMLHttpRequest
		 * @param data JSON object with all the required parameters to form a request.
		 *        Expected Params:
		 *                 defaultParams: if true all the default parameters as passed from previous action will be appended to new URL
		 *				   appendSession: if true then append session id after action, otherwise will not append session
		 *                 action: name of action,
		 *                 isCompleteURL: if action passed is complete URL and no additional need to appned domain and protocols etc
		 *                 method: String value, can be 'GET' or 'POST', default is POST
		 *                 expectedResponseType: pass as 'json' if expected response is JSON
		 *                 cb: an ARIA callback object
		 *                 postData: all parameters concated as string to be passed as POST data
		 *                 formObj: DOM element object representing a html form
		 *                 timeout: (Integer) timeout in ms - default: defaultTimeout
		 * @param submitForm boolean parameter, if set to true then aria.core.IO.asyncFormSubmit will be initiated 
							otherwise aria.core.IO.asyncRequest will be called
		 */
		makeServerRequest: function(data, submitForm, callback) {

			// for callback
			var current = this;

			// 'settings' JSON
			var settings = {
				defaultParams: true,
				isSecured: false,
				appendSession: true
			}

			// override defaultParam value if passed
			if (data.defaultParams != null) {
				settings.defaultParams = data.defaultParams;
			}

			// override appendSession value if passed
			if (data.appendSession != null) {
				settings.appendSession = data.appendSession;
			}
			// change from http to https
			if (data.isSecured != null) {
				settings.isSecured = data.isSecured;
			}

			// create complete URL if not a complete URL
			var actionURL = data.action;
			if (data.isCompleteURL == null || data.isCompleteURL == false) {
				actionURL = this.getFullURL(actionURL, settings);
			}

			// default method is 'POST'
			var method = 'POST';
			if (data.method != null) {
				method = data.method;
			}

			var params = null;
			// set form object
			if (submitForm == true && data.formObj != null) {
				params = $(data.formObj).serialize();
				params.replace('=', ':');
				params.replace('&', ',');
			} else if (submitForm == false && data.parameters != null) {
				params = data.parameters;
				params.replace('=', ':');
				params.replace('&', ',');
			}

			// improve loyality condition before uncommenting, this should not be done via URL manager
			/*var loyaltyInfo = this.__getLoyaltyInformation();
			if (loyaltyInfo != null && loyaltyInfo != '' && modules.view.merci.common.utils.MCommonScript.booleanValue(data.loyaltyInfoPassed) != true) {
				params += '&' + loyaltyInfo;
			}*/

			// send expected response type only if provided
			var reqDataType = '';
			if (data.expectedResponseType != null) {
				reqDataType = data.expectedResponseType;
			}

			if (data.loading == true) {
				// show msk overlay
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
			}
			
			if(modules.view.merci.common.utils.MCommonScript.isRequestFromApps()==true){
				if(typeof(currAppVersion) != "undefined"){
					if(actionURL.indexOf('?') == -1){
						actionURL=actionURL+"?"+"appVersion="+currAppVersion;
					}else{
						actionURL=actionURL+"&appVersion="+currAppVersion;
					}
				} 
			}

			var isLoyaltyBannerDataAvailable = false;

			if(!modules.view.merci.common.utils.MCommonScript.isEmptyObject(jsonResponse.data.loyaltyBannerData)){
				isLoyaltyBannerDataAvailable = true ;
			}

			var request = {
				url: actionURL,
				type: method,
				processData: false,
				dataType: 'text',
				crossDomain: 'true',
				contentType: "application/x-www-form-urlencoded;charset=UTF-8",
				success: function(resp) {
					var response = {
						error: '',
						responseJSON: '',
						responseText: '',
						responseXML: null
					};

					if (reqDataType == 'json') {
						response.responseJSON = resp;
					} else {
						response.responseText = resp;
					}

					// callback function
					current.__onServerRequestCallback(response, data);
				},
				error: function(a, b, c, d) {
					// in case of server error
					window.scrollTo(0, 0);
					current.__onServerRequestCallback(null, data);
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				}
			}

			if (params != null) {
				request.data = params;
			}

			if (request.data != null) {
				request.data += '&BANNER_AVAILABLE='  
						+  isLoyaltyBannerDataAvailable 
						+ '&INDEX_DATA_AVAILABLE=' 
						+ (jsonResponse.data.booking != null && jsonResponse.data.booking.Mindex_A != null); 
			}
			
			var externalId = this.__getExternalId();
			if (externalId) {
				if (request.data  == null || request.data == '') {
					request.data = 'EXTERNAL_ID='+ externalId;
				} else {
					request.data += '&EXTERNAL_ID='+ externalId;
 				}
			}

			if (reqDataType != '') {
				request.dataType = reqDataType;
			}

			//console.log("REQUEST === "+JSON.stringify(request));

			$.ajax(request);

			// keep alive implementation
			this.keepExternalAppAlive();
		},

		/**
		 * common callback for all server calls
		 * @param response server response
		 * @param params parameters passed by calling function to be used in callback
		 */
		__onServerRequestCallback: function(response, data) {

			if (response != null && response.responseJSON != null) {

				// set the framework data
				if (response.responseJSON.data != null && response.responseJSON.data.framework != null) {
					jsonResponse.data.framework = response.responseJSON.data.framework;
				}

				// if same page then hide the overlay
				if (response.responseJSON.homePageId == aria.utils.HashManager.getHashString()) {
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
				}
				// update data
				for (var key in response.responseJSON.data) {
					if (key != 'framework' && response.responseJSON.data.hasOwnProperty(key)) {
						if (jsonResponse.data[key] == null) {
							jsonResponse.data[key] = response.responseJSON.data[key];
						} else {
							for (var jKey in response.responseJSON.data[key]) {
								if (response.responseJSON.data[key].hasOwnProperty(jKey)) {
									jsonResponse.data[key][jKey] = response.responseJSON.data[key][jKey];
								}
							}
						}
					}
				}
				// update menu data
				if (response.responseJSON.hasOwnProperty("MenuButtons")) {
					jsonResponse["MenuButtons"] = response.responseJSON["MenuButtons"];
				}	

			}
			// redirect to template callback
			this.moduleCtrl = data.cb.scope.moduleCtrl;
			data.cb.scope[this.__getCallbackFunctionName(data.cb)](response, data.cb.args);
		},

		/**
		 * returns the name of function passed in callback object
		 * @param params callback object passed by calling function
		 */
		__getCallbackFunctionName: function(params) {
			if (params != null) {
				var funcName = params.fn.displayName;
				if (funcName == null) {
					funcName = params.fn;
				}
				if (funcName != null && funcName.indexOf('#') != -1) {
					funcName = funcName.replace("#", "");
				}

				return funcName;
			}

			return '';
		},
		/**
		 * Adds EXTERNAL_ID param with every request		 
		 */
		__getExternalId: function() {
			// if not in json read from URL
			if (jsonResponse.data.framework == null || jsonResponse.data.framework.baseParams == null) {
				return this.getStringParam().EXTERNAL_ID;
			}

			// if available in json
			return jsonResponse.data.framework.baseParams[23];
		}
	}
});