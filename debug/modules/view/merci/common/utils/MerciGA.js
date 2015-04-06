Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciGA',
	$singleton: true,

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		trackPage: function(pageData) {

			if(this.utils.isGTMEnabled()){
				dataLayer =[{
					 'domain': pageData.domain,
					 'page': pageData.GTMPage
				}];
				if(!this.utils.isEmptyObject(pageData.sqData)){
					dataLayer[0]['sqData']= pageData.sqData;
				}					
				if(!this.utils.isEmptyObject(pageData.data)){
					dataLayer[0]['data']= pageData.data;
				}
			} else {
				if (this.__isParamEnabled(pageData.gaEnabled)) {

					/* START: cr6561154 AppCustomization*/
					if (this.utils.isRequestFromApps()) {
						/* Invoke Native phonegap GA */
						googleanalytics.sendScreenData(function(successMessage) {
							console.log("Recieved Success callback for send screen data from phonegap: " + JSON.stringify(successMessage));
						}, function(errorMessage) {
							console.log("Recieved Error callback for send screen data from phonegap: " + JSON.stringify(errorMessage));
						}, pageData.page);

					} else { /* END: cr6561154 AppCustomization*/
						
						if (typeof _gaq != 'undefined' && _gaq != null) {
							// set push data
							_gaq.push(['_setAccount', pageData.account]);
							_gaq.push(['_setDomainName', pageData.domain]);
							_gaq.push(['_setAllowLinker', true]);

							// push page name
							_gaq.push(['_set', 'page', pageData.page]);
							_gaq.push(['_trackPageview']);
						}
					}
				}

				var gaTrackEL = document.querySelectorAll('#ga_track_pageview')[0];
				if (gaTrackEL != null) {
					gaTrackEL.value = pageData.page;
				}
			}
			
		},

		/**
		 * @param eventData json with below values
		 * String category The general event category (e.g. "Videos").
		 * String action The action for the event (e.g. "Play").
		 * String opt_label An optional descriptor for the event.
		 * Int opt_value An optional value associated with the event. You can see your event values in the Overview, Categories, and Actions reports, where they are listed by event or aggregated across events, depending upon your report view.
		 * Boolean opt_noninteraction Default value is false. By default, the event hit sent by _trackEvent() will impact a visitor's bounce rate. By setting this parameter to true, this event hit will not be used in bounce rate calculations.
		 */
		trackEvent: function(eventData) {
			if(this.utils.isGTMEnabled()){
				var customData ={
    				'domain': eventData.domain,
    				'category': eventData.category,
    				'action': eventData.action,
    				'label': eventData.label,
    				'value': eventData.value,
    				'event' : "merciEvents"
    			};
				if(!this.utils.isEmptyObject(eventData.data)){
					customData['data']= eventData.data;
				}
				dataLayer.push(customData);
			}else{
				if (this.__isParamEnabled(eventData.gaEnabled)) {
					/* START: cr6561154 AppCustomization*/
					if (this.utils.isRequestFromApps()) {
						/* Invoke Native phonegap GA */
						if (!eventData.requireTrackPage) {
							googleanalytics.sendScreenData(function(successMessage) {
								console.log("Recieved Success callback for send screen data from phonegap: " + JSON.stringify(successMessage));
							}, function(errorMessage) {
								console.log("Recieved Error callback for send screen data from phonegap: " + JSON.stringify(errorMessage));
							}, "_trackPageview");

						}
						// track ga event
						googleanalytics.sendEventData(function(successMessage) {
							console.log("Recieved Success callback for send event data from phonegap: " + JSON.stringify(successMessage));
						}, function(errorMessage) {
							console.log("Recieved Error callback for send event data from phonegap: " + JSON.stringify(errorMessage));
						}, eventData.value, eventData.category, eventData.action, eventData.label);

					} else { /* END: cr6561154 AppCustomization*/

						if (typeof _gaq != 'undefined' && _gaq != null) {
							// set push data
							_gaq.push(['_setAccount', eventData.account]);
							_gaq.push(['_setDomainName', eventData.domain]);
							_gaq.push(['_setAllowLinker', true]);

							if (!eventData.requireTrackPage) {
								_gaq.push(['_trackPageview']);
							}

							// track ga event
							_gaq.push(['_trackEvent', eventData.category, eventData.action, eventData.label, eventData.value, eventData.noninteraction]);
						}
					}
				}
				if (jsonResponse.data.framework.baseParams.join("").indexOf("&client=") != -1) {
					document.querySelectorAll('#ga_track_event')[0].value = "Category=" + eventData.category + "&Action=" + eventData.action + "&Label=" + eventData.label + "&value=" + eventData.value;
				}
			}
			
		},

		trackTransaction: function(transactionData) {

			if(this.utils.isGTMEnabled()){
				dataLayer =[{
					'domain': transactionData.domain,
					'account': transactionData.account,
					'gaTransEnabled': transactionData.gaTransEnabled,
					'gaEnabled': transactionData.gaEnabled,
					'officeId': transactionData.officeId,
					'priceTTC': transactionData.priceTTC,
					'tax': transactionData.tax,
					'fee': '',
					'city': '',
					'state': '',
					'country': '',
					'transString': transactionData.transString,
					'itemString1': transactionData.itemString1,
					'itemString2': transactionData.itemString2,
					'itemString3': transactionData.itemString3,
					'unitPrice': transactionData.unitPrice,
					'nbPax': transactionData.nbPax,
					'currencyCode': transactionData.currencyCode,
					'page': transactionData.page,
					'pageid': transactionData.pageid,
					'flightNumber': transactionData.flightNumber,
					'milesCost':transactionData.milesCost,
					'category': transactionData.category,
					'conversionRate': transactionData.conversionRate
				}];
					if(!this.utils.isEmptyObject(transactionData.sqData)){
					dataLayer[0]['sqData']= transactionData.sqData;
				}
				
			} else {
				if (this.__isParamEnabled(transactionData.gaEnabled) && this.__isParamEnabled(transactionData.gaTransEnabled)) {
					/* START: cr6561154 AppCustomization*/
					if (this.utils.isRequestFromApps()) {

						googleanalytics.sendTransactionData(function(successMessage) {
							console.log("Recieved Success callback for send transaction data from phonegap: " + JSON.stringify(successMessage));
						}, function(errorMessage) {
							console.log("Recieved Error callback for send transaction data from phonegap: " + JSON.stringify(errorMessage));
						}, transactionData.transString, transactionData.officeId, transactionData.priceTTC, transactionData.tax, transactionData.fee, transactionData.currencyCode);

						googleanalytics.sendItemData(function(successMessage) {
							console.log("Recieved Success callback for send item data from phonegap: " + JSON.stringify(successMessage));
						}, function(errorMessage) {
							console.log("Recieved Error callback for send item data from phonegap: " + JSON.stringify(errorMessage));
						}, transactionData.transString, transactionData.itemString2, transactionData.itemString1, transactionData.itemString3, transactionData.unitPrice, transactionData.nbPax, transactionData.currencyCode);

					} else { /* END: cr6561154 AppCustomization*/
						
						if (typeof _gaq != 'undefined' && _gaq != null) {
							_gaq.push(['_setAccount', transactionData.account]);
							_gaq.push(['_setDomainName', transactionData.domain]);
							_gaq.push(['_setAllowLinker', true]);
							_gaq.push(['_trackPageview']);

							// track transaction
							_gaq.push(['_addTrans',
								transactionData.transString,
								transactionData.officeId,
								transactionData.priceTTC,
								transactionData.tax,
								transactionData.fee,
								transactionData.city,
								transactionData.state,
								transactionData.country
							]);
							_gaq.push(['_addItem',
								transactionData.transString,
								transactionData.itemString1,
								transactionData.itemString2,
								transactionData.itemString3,
								transactionData.unitPrice,
								transactionData.nbPax
							]);
							_gaq.push(['_set', 'currencyCode', transactionData.currencyCode]);
							_gaq.push(['_trackTrans']);
						}
					}
				}
			

				if (jsonResponse.data.framework.baseParams.join("").indexOf("&client=") != -1) {
					document.querySelectorAll('#ga_track_createTransaction')[0].value = "transactionId^" + transactionData.transString + "@affiliation^" + transactionData.officeId + "@revenue^" + transactionData.priceTTC + "@tax^" + transactionData.tax + "@shipping^" + transactionData.fee + "@currencyCode^" + transactionData.currencyCode;

					document.querySelectorAll('#ga_track_createItem')[0].value = "transactionId^" + transactionData.transString + "@name^" + transactionData.itemString1 + "@sku^" + transactionData.itemString2 + "@category^" + transactionData.itemString3 + "@price^" + transactionData.unitPrice + "@quantity^" + transactionData.nbPax + "@currencyCode^" + transactionData.currencyCode;
				}
			}
		},

		__isParamEnabled: function(parameter) {
			return parameter != null && parameter.toLowerCase() == 'true';
		}
	}
});