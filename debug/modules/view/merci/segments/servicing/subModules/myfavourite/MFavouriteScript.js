Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.myfavourite.MFavouriteScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.URLManager'],
	$constructor: function() {
		pageObjFav = this;
		pageObjFav.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this._ajax = modules.view.merci.common.utils.URLManager;

	},

	$prototype: {

		$dataReady: function() {
			pageObjFav.printUI = false;
			//aria.utils.Json.setValue(pageObjFav.data, 'jsonObj', "");
			pageObjFav.getBookmarkData();
			this.shareData = {};
			this.shareData.shareResponse = {};
			this.data.shareDataFlag = false;
		},

		$displayReady: function() {
			$('body').attr('id', 'favourite');
			$('body').removeClass();
		
			if (pageObjFav.__merciFunc.booleanValue(pageObjFav.siteParams.enableLoyalty) == true && pageObjFav.rqstParams.IS_USER_LOGGED_IN == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: pageObjFav.labels.loyaltyLabels,
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
				title: pageObjFav.labels.tx_merciapps_my_favorite,
				bannerHtmlL: pageObjFav.siteParams.bannerHtml,
				homePageURL: pageObjFav.siteParams.homeURL,
				showButton: true,
				companyName: pageObjFav.siteParams.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});
		
		},
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFavourite",
						data:this.data
					});
			}
		},
		$afterRefresh: function() {

		},

		onFlightStatusClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {
				var keyData = args.keyData;
				jsonResponse.ui.Flow_Type = "MyFav";
				jsonResponse.ui.keyData = keyData;
				pageObjFav.__merciFunc.showMskOverlay(true);
				this.moduleCtrl.navigate(null, 'merci-MflightInfo_A');
			} else {
				$("#" + args.id).addClass('favdelete');
			}
		},

		toggle: function(a, b) {
			var attr1 = document.getElementById(b.buttonId).getAttribute("aria-expanded");
			if (attr1 == 'false') {
				document.getElementById(b.buttonId).setAttribute("aria-expanded", "true");
			} else {
				document.getElementById(b.buttonId).setAttribute("aria-expanded", "false");
			}
			if (document.getElementById("section_" + b.buttonId).style.display == "block" || document.getElementById("section_" + b.buttonId).style.display == "") {
				document.getElementById("section_" + b.buttonId).style.display = "none"
			} else {
				document.getElementById("section_" + b.buttonId).style.display = "block"
			}
		},

		onRenevnueFlowClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {

				if (args.flow == "Revenue") {
					args.rvnwInfoTrip += '&result=json';
					args.rvnwInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					jsonFare = args.rvnwInfoTrip.replace('\"', '');
				} else {
					args.dealInfoTrip += '&result=json';
					args.dealInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					args.dealInfoTrip += '&FLOW_TYPE=DEALS_AND_OFFER_FLOW';
					jsonFare = args.dealInfoTrip.replace('\"', '');
				};

				var request = {
					parameters: jsonFare,
					action: 'MAvailThenFare.action',
					method: 'POST',
					expectedResponseType: 'json',
					cb: {
						fn: this.__onRenevnueCallback,
						args: jsonFare,
						scope: this
					}
				};
				pageObjFav.__merciFunc.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				$("#" + args.id).addClass('favdelete');
			}

		},
		__onRenevnueCallback: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.booking == undefined) {
						json.booking = {};
					} {
						json.booking[dataId] = response.responseJSON.data.booking[dataId];
						json.header = response.responseJSON.data.header;
						// navigate to next page
						this.moduleCtrl.navigate(null, nextPage);
					}
				}
			}
		},

		onDealsOfferClick: function(event, args) {
			event.preventDefault();
			if ($("#" + args.id).hasClass("favdelete")) {
				var offerId = args.ID;
				var country = args.countrySite;
				pageObjFav.__merciFunc.storeLocal("OID", offerId, "overwrite", "text");

				pageObjFav.__merciFunc.storeLocal("countrySite", country, "overwrite", "text");
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				params = 'SITE=' + bp[11] + '&LANGUAGE=' + bp[12] + '&offer_id=' + offerId + '&result=json&COUNTRY_SITE=' + country;
				actionName = 'OffersApi.action';
				var request = {
					parameters: params,
					action: actionName,
					method: 'POST',
					loading: true,
					expectedResponseType: 'json',
					defaultParams: false,
					cb: {
						fn: pageObjFav.__onDealsOfferClickCallback,
						args: params,
						scope: pageObjFav
					}
				};
				pageObjFav.__merciFunc.showMskOverlay(true);
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {
				$("#" + args.id).addClass('favdelete');
			}

		},
		__onDealsOfferClickCallback: function(response, inputParams) {
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},
		formatDate: function(bDate, args) {
			var beginDate = bDate.split(",");
			var year = beginDate[0];
			var month = parseInt(beginDate[1]) + 1;
			var dt = beginDate[2];
			var hh = beginDate[3];
			var mm = beginDate[4];
			var ss = beginDate[5];
			if (args = "Date") {
				var date = year + month + dt;
				return (date);
			} else {
				var time = hh + mm + ss;
				return time;
			}

		},

		getBookmarkData: function() {
			
			var getFavData=this.moduleCtrl.getFavouriteData();
			
				var dateObj = new Date();
				var deleteData = false;
				dateObj = dateObj.getTime();
			dateObj = dateObj - (0 * 86400);         /* Add site parameter if user want to delete according to constant time*/
			if (getFavData !=undefined && getFavData != "") {
				if (typeof getFavData === 'string') {
					pageObjFav.jsonObj = JSON.parse(getFavData);
				}else{
					pageObjFav.jsonObj = (getFavData);
					}

					if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj)) {
						pageObjFav.labels = pageObjFav.jsonObj.labels;
						pageObjFav.siteParams = pageObjFav.jsonObj.siteParams;
						pageObjFav.rqstParams = pageObjFav.jsonObj.rqstParams;

						if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj.DEALSTATUS)) {
							for (var key in pageObjFav.jsonObj.DEALSTATUS) {
								if (dateObj > pageObjFav.jsonObj.DEALSTATUS[key].endTime) {
									delete pageObjFav.jsonObj.DEALSTATUS[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

						if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj.RVNWFARESTATUS)) {
							for (var key in pageObjFav.jsonObj.RVNWFARESTATUS) {
								if (dateObj > pageObjFav.jsonObj.RVNWFARESTATUS[key].beginDtObj) {
									delete pageObjFav.jsonObj.RVNWFARESTATUS[key];
									delete pageObjFav.jsonObj.RVNWFAREINFO[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

						if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj.DEALFARESTATUS)) {
							for (var key in pageObjFav.jsonObj.DEALFARESTATUS) {
								if (dateObj > pageObjFav.jsonObj.DEALFARESTATUS[key].beginDtObj) {
									delete pageObjFav.jsonObj.DEALFARESTATUS[key];
									delete pageObjFav.jsonObj.DEALFAREINFO[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

					dateObj = dateObj - (2 * 86400);     /* Add site parameter if user want to delete according to constant time*/
						if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj.FLIGHTSTATUS)) {
							for (var key in pageObjFav.jsonObj.FLIGHTSTATUS) {
								if (dateObj > pageObjFav.jsonObj.FLIGHTSTATUS[key].beginDtObj) {
									delete pageObjFav.jsonObj.FLIGHTSTATUS[key];
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}

						var todaysDate = new Date();
						if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj.SERVICESCATALOG)) {
							for(var servicesBookmarkCount = 0; servicesBookmarkCount < pageObjFav.jsonObj.SERVICESCATALOG.length; servicesBookmarkCount++){
								if(todaysDate > new Date (pageObjFav.jsonObj.SERVICESCATALOG[servicesBookmarkCount].itineraryData.lastSegmentFlownDate)){
									pageObjFav.jsonObj.SERVICESCATALOG.splice(servicesBookmarkCount,1);
									deleteData = true;
									if (jsonResponse.ui.cntBookMark > 0) {
										jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
									}
								}

							}
						}
						if (deleteData = true) {
							pageObj.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
							pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						};
					};
			}
		},

		onFlightDelData: function(event, args) {
			event.preventDefault();
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["FLIGHTSTATUS"])) {
				flightStatus = pageObjFav.jsonObj["FLIGHTSTATUS"];
				for (var key in flightStatus) {
					if (args.keyData == key) {
						delete flightStatus[args.keyData];
						pageObjFav.jsonObj['FLIGHTSTATUS'] = flightStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							pageObjFav.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						pageObjFav.$refresh();
					}
				}
			}

		},

		onDealDelData: function(event, args) {
			event.preventDefault();
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["DEALFAREINFO"])) {
				dealStatus = pageObjFav.jsonObj["DEALFAREINFO"];
				for (var key in dealStatus) {
					if (args.keyData == key) {
						delete dealStatus[args.keyData];
						pageObjFav.jsonObj['DEALFAREINFO'] = dealStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
					}
				}
			};
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["DEALFARESTATUS"])) {
				dealFareStatus = pageObjFav.jsonObj["DEALFARESTATUS"];
				for (var key in dealFareStatus) {
					if (args.keyData == key) {
						delete dealFareStatus[args.keyData];
						pageObjFav.jsonObj['DEALFARESTATUS'] = dealFareStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							pageObjFav.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						pageObjFav.$refresh();
					}
				}
			};
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["DEALSTATUS"])) {
				dealStatus = pageObjFav.jsonObj["DEALSTATUS"];
				for (var key in dealStatus) {
					if (args.keyData == key) {
						delete dealStatus[args.keyData];
						pageObjFav.jsonObj['DEALSTATUS'] = dealStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							pageObjFav.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						pageObjFav.$refresh();
					}
				}
			}


		},
		onFareDelData: function(event, args) {
			event.preventDefault();
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["RVNWFARESTATUS"])) {
				fareStatus = pageObjFav.jsonObj["RVNWFARESTATUS"];
				for (var key in fareStatus) {
					if (args.keyData == key) {
						delete fareStatus[args.keyData];
						pageObjFav.jsonObj['RVNWFARESTATUS'] = fareStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
					}
				}
			};
			if (!pageObjFav.__merciFunc.isEmptyObject(pageObjFav.jsonObj["RVNWFAREINFO"])) {
				fareStatus = pageObjFav.jsonObj["RVNWFAREINFO"];
				for (var key in fareStatus) {
					if (args.keyData == key) {
						delete fareStatus[args.keyData];
						pageObjFav.jsonObj['RVNWFAREINFO'] = fareStatus;
						pageObjFav.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObjFav.jsonObj, "overwrite", "json");
						test = true;
						if (jsonResponse.ui.cntBookMark > 0) {
							pageObjFav.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
						}
						pageObjFav.$refresh();
					}
				}
			}

		},
		delServicesBookmark: function(event, args) {
			event.preventDefault();
			this.__merciFunc.deleteServicesBookmark(args.recordLocator);
			this.getBookmarkData();
			if (jsonResponse.ui.cntBookMark > 0) {
				pageObjFav.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark-1);
			}
			pageObjFav.$refresh();
		},
		retrieveBookmark: function(event, args) {
			var basket = JSON.stringify(args.bookmark.basket);
			var recordLoc = args.bookmark.REC_LOC;
			var lastName = args.bookmark.DIRECT_RETRIEVE_LASTNAME;
			var params = {
				BASKET_OF_SERVICES: basket,
				REC_LOC: recordLoc,
				DIRECT_RETRIEVE_LASTNAME: lastName,
				DIRECT_RETRIEVE: true,
				ACTION: "MODIFY",
				FROM_PAX: true
			};
			this.__merciFunc.sendNavigateRequest(params, 'MBookmarkServiceRetrieve.action', this);
		},

		shareTrip: function(event,args) {
			var baseURLAttributes = modules.view.merci.common.utils.URLManager.getBaseParams();
			var actionName = (args.type == "revenue" ? "MAvailThenFare.action" : "OffersApi.action");
			var dataToEncrypt = "";
			if (args.type == "revenue") {
				if (args.flow == "Revenue") {
					args.rvnwInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					dataToEncrypt = args.rvnwInfoTrip.replace('\"', '');
				} else {
					args.dealInfoTrip += '&BOOKMARK_ID=' + args.currDT;
					args.dealInfoTrip += '&FLOW_TYPE=DEALS_AND_OFFER_FLOW';
					dataToEncrypt = args.dealInfoTrip.replace('\"', '');
				}
			}
			var newURL = baseURLAttributes[0]+"://"+baseURLAttributes[1]+baseURLAttributes[10]+"/"+baseURLAttributes[4]+"/"+actionName+"?"+baseURLAttributes[8];
			if(args.type != "revenue"){
				var offerId = args.ID;
				var country = args.countrySite;
				newURL = newURL+'&offer_id=' + offerId;
				if(newURL.indexOf('&COUNTRY_SITE=') == -1){
					newURL = newURL+'&COUNTRY_SITE=' + country;
				}
				else{
					var indx = 	newURL.indexOf('&COUNTRY_SITE=');
					if(newURL.indexOf('&COUNTRY_SITE=&') == -1){
						newURL = newURL.substr(0,indx) + '&COUNTRY_SITE='+country + newURL.substr((indx+16),newURL.length);
					}
					else{
						newURL = newURL.substr(0,indx) + '&COUNTRY_SITE='+country + newURL.substr((indx+14),newURL.length);
					}
				}				
			}
			dataToEncrypt = dataToEncrypt.replace(/&/g,";");
			newURL = newURL.replace(/&/g,";");
			var params = "";
			params = "dataToEncrypt="+dataToEncrypt+"&newURL="+newURL+"&destination="+args.destination;
			var request = {
				parameters: params,
				action: 'MEncryptURL.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.__onShareTripCallback,
					scope: this,
					args: args
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},
		
		onLongPressBookMark: function(event, args) {
			//event.preventDefault(true);
			event.preventDefault();
			var test = false;
			if (event.duration > 1000) {
				$("#" + args.id).removeClass('favdelete');
				document.getElementById(args.id).style.zIndex = "999";
				document.getElementById(args.id).style.cssFloat = "initial";
			};
			return false;
		},

		__onShareTripCallback: function(response,args) {
			if(!this.__merciFunc.isEmptyObject(response) && !this.__merciFunc.isEmptyObject(response.responseJSON))
			{
				this.data.destination = args.destination;
				this.$json.setValue(this.shareData,'shareResponse', response.responseJSON);
				this.$json.setValue(this.data,'shareDataFlag', !this.data.shareDataFlag);								
				this.__merciFunc.hideMskOverlay();
			}
		}
	}
});