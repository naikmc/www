Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciConfRetrieveScript',	
	$dependencies: [
	    'aria.utils.Type',
		'aria.utils.Date',
		'aria.utils.Number',
	    'aria.utils.Callback',
	    'aria.utils.HashManager',
	    'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.MCommonScript'
	],
	
	$constructor: function() {	
		pageObjBooking = this;		
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		
	},

	$prototype: {
		
		showServicesDetails: function(evt,args) {
			_this = args._this;
			/* if(document.getElementById("servicesTab") != null && document.getElementById("servicesTab").getAttribute("class") == "navigation active") {
				return;
			} else {
				document.getElementById("paxTabletTab").setAttribute("class", "navigation");
				document.getElementById("servicesTab").setAttribute("class", "navigation active");
			} */

			var jsonRec = this.getRecLocLname(_this);
			if (_this.sadad != true) {
				if (!this.__merciFunc.isEmptyObject(this.getServicesBookmarkForRecLoc(_this,jsonRec.recLoc))) {
					var bookmark = this.getServicesBookmarkForRecLoc(jsonRec.recLoc);
					var basket = JSON.stringify(bookmark.basket);
					var recordLoc = bookmark.REC_LOC;
					var lastName = bookmark.DIRECT_RETRIEVE_LASTNAME;
					var params = {
						BASKET_OF_SERVICES: basket,
						REC_LOC: recordLoc,
						DIRECT_RETRIEVE_LASTNAME: lastName,
						DIRECT_RETRIEVE: true,
						ACTION: "MODIFY",
						FROM_PAX: true
					};
					this.__merciFunc.sendNavigateRequest(params, 'MBookmarkServiceRetrieve.action', _this);
				} else {
					var params = {
						DIRECT_RETRIEVE: 'true',
						ACTION: 'MODIFY',
						finalValidationList: _this.rqstParams.param.finalValidationList,
						displayAlert: _this.rqstParams.param.displayAlert,
						DIRECT_RETRIEVE_LASTNAME: jsonRec.lastName,
						REC_LOC: jsonRec.recLoc,
						PAGE_TICKET: _this.reply.pageTicket
					};

					this.__merciFunc.sendNavigateRequest(params, 'MGetServiceCatalogFromCONF.action', _this);
				}
			}
		},
		
		getRecLocLname: function(_this) {
			var json = {
				recLoc: "",
				lastName: ""
			};
			if (_this.request && !this.__merciFunc.isEmptyObject(_this.request.REC_LOC)) {
				json.recLoc = _this.request.REC_LOC;
			} else {
				json.recLoc = _this.rqstParams.reply.tripPlanBean.REC_LOC;
			}
			if (_this.request && !this.__merciFunc.isEmptyObject(_this.request.DIRECT_RETRIEVE_LASTNAME)) {
				json.lastName = _this.request.DIRECT_RETRIEVE_LASTNAME;
			} else {
				json.lastName = _this.rqstParams.reply.tripPlanBean.primaryTraveller.identityInformation.lastName;
			}
			return json;
		},
		
		getServicesBookmarkForRecLoc: function(_this,recLoc) {
			var bookmarkedServices = this.getServicesBookmarkData(_this);
			var bookmarkedRecLoc = {};
			for (var i = 0; i < bookmarkedServices.length; i++) {
				if (bookmarkedServices[i].REC_LOC.toLowerCase() == recLoc.toLowerCase()) {
					bookmarkedRecLoc = bookmarkedServices[i];
				}
			}
			return bookmarkedRecLoc;
		},
		
		isServicesCatalogEnbld: function(_this) {
			var enblCatalog = false;
			if (this.__merciFunc.booleanValue(_this.config.merciServiceCatalog) && !this.__merciFunc.isEmptyObject(_this.reply.serviceCategories)) {
				enblCatalog = true;
			}
			if (this.__merciFunc.booleanValue(_this.config.siteAllowPayLater)  && !_this.reply.pnrStatusCode == 'P') {
				enblCatalog = false;
			}
			return enblCatalog;
		},
		
		getServicesBookmarkData: function(_this) {
			pageObjBooking.__merciFunc.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {
				var deleteData = false;
				if (result && result != "") {
					if (typeof result === 'string') {
						pageObjBooking.jsonObj = JSON.parse(result);
					}
					if (!pageObjBooking.__merciFunc.isEmptyObject(pageObjBooking.jsonObj)) {
						var todaysDate = new Date();
						if (!pageObjBooking.__merciFunc.isEmptyObject(pageObjBooking.jsonObj.SERVICESCATALOG)) {
							for (var key in pageObjBooking.jsonObj.SERVICESCATALOG) {
								if (todaysDate > pageObjBooking.jsonObj.SERVICESCATALOG[key].lastSegmentFlownDate) {
									delete pageObjBooking.jsonObj.SERVICESCATALOG[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}
						if (deleteData = true) {
							pageObjBooking.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
							pageObjBooking.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjBooking.jsonObj, "overwrite", "json");
						};
					};
				}
			});
			if (!this.__merciFunc.isEmptyObject(pageObjBooking.jsonObj) && !this.__merciFunc.isEmptyObject(pageObjBooking.jsonObj.SERVICESCATALOG)) {
				return pageObjBooking.jsonObj.SERVICESCATALOG;
			} else
				return [];
		},
		
		/**
		 * Event handler when the users clicks on "Passenger info' button
		 */
		showPaxDetails: function(evt,args) {
			_this = args._this;
			var jsonRec = this.getRecLocLname(_this);
			var params = {
				DIRECT_RETRIEVE: "true",
				ACTION: 'MODIFY',
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				finalValidationList: _this.rqstParams.param.finalValidationList,
				displayAlert: _this.rqstParams.param.displayAlert,
				DIRECT_RETRIEVE_LASTNAME: jsonRec.lastName,
				REC_LOC: jsonRec.recLoc,
				PAGE_TICKET: _this.reply.pageTicket,
				ISAPISMISSING: _this.apisMissing,
				IS_USER_LOGGED_IN: _this.rqstParams.param.IS_USER_LOGGED_IN
			};

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14] != ''  || pageObjBooking.__merciFunc.isRequestFromApps() ) {
				this.__merciFunc.sendNavigateRequest(params, 'MGetTravellerDetail.action', _this);
			} else {
				this.__merciFunc.sendNavigateRequest(params, 'MTravellerDetails.action', _this);
			}
		},
		formatDate: function(dateBean, pattern, utcTime) {
			var format = this.__merciFunc.getFormatFromEtvPattern(pattern);
			var jsDate = this._getDateFromBean(dateBean);
			return aria.utils.Date.format(jsDate, format, utcTime);
		},
		/**
		 * converts date bean object to JavaScript Date object
		 * @param dateBean DateBean object
		 */
		_getDateFromBean: function(dateBean) {
			return new Date(dateBean.year,
				dateBean.month,
				dateBean.day,
				dateBean.hour,
				dateBean.minute,
				0);
		}
	}
});
