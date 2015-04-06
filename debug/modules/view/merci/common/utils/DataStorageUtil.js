Aria.classDefinition({
  $classpath: 'modules.view.merci.common.utils.DataStorageUtil',
  $singleton: true,
  $dependencies: [
    'aria.utils.Date',
    'aria.utils.Number',
    'aria.utils.HashManager',
	'modules.view.merci.common.utils.URLManager',
	'modules.view.merci.common.utils.MCommonScript'
  ],
  
  $constructor: function() {
	this.reqManager = modules.view.merci.common.utils.URLManager;
	this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype: {
		
		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the settings page in case of the Merci App
		**/
		initSettingData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_SETTINGS] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_SETTINGS] = (result);
					}	
				}else {
					jsonResponse.localStorage[merciAppData.DB_SETTINGS] = {};
				};
			});
		},
		
		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the More page in case of the Merci App
		**/
		initMorePageData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_MORE, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_MORE] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_MORE] = (result);
					}		
				} else {
					jsonResponse.localStorage[merciAppData.DB_MORE] = {};
				};
			});
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the My Favourites page in case of the Merci App
		**/
		initFavData: function (data) {
			pageObj=this;
			if(data !=undefined && data.data !=undefined && data.data.booking !=undefined && data.data.booking.Mindex_A !=undefined){
				this.utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function (result) {
					if (result && result != "" && !pageObj.utils.isEmptyObject(result) ) {
						if (typeof result === 'string') {
                      		pageObj.jsonObj = JSON.parse(result);
                    	}else{
							pageObj.jsonObj = (result);
						}
						var count = 0;	
						if (pageObj.utils.booleanValue(data.data.booking.Mindex_A.siteParam.siteAllowBookmarkFlight) == true){
							if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.FLIGHTSTATUS)) {
								count += Object.keys(pageObj.jsonObj.FLIGHTSTATUS).length;
							};
						}
						if (pageObj.utils.booleanValue(data.data.booking.Mindex_A.siteParam.siteAllowbookMarkDeal) == true){
							if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.DEALFARESTATUS)) {
								count += Object.keys(pageObj.jsonObj.DEALFARESTATUS).length;
							};
						}
						if (pageObj.utils.booleanValue(data.data.booking.Mindex_A.siteParam.siteAllowbookMarkRvnw) == true){
							if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.RVNWFARESTATUS)) {
								count += Object.keys(pageObj.jsonObj.RVNWFARESTATUS).length;
							};
						}
						if (pageObj.utils.booleanValue(data.data.booking.Mindex_A.siteParam.siteAllowBookmarksParam) == true){
							if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.DEALSTATUS)) {
								count += Object.keys(pageObj.jsonObj.DEALSTATUS).length;
							};
						}
						if (pageObj.utils.booleanValue(data.data.booking.Mindex_A.siteParam.siteAllowBookmarkServices) == true){
							if (!pageObj.utils.isEmptyObject(pageObj.jsonObj.SERVICESCATALOG)) {
								count += Object.keys(pageObj.jsonObj.SERVICESCATALOG).length;
							};
						}
							if(jsonResponse.ui !=undefined && jsonResponse.ui !=null){
								jsonResponse.ui.cntBookMark=count;
							}
							else {
								jsonResponse.ui={};
								jsonResponse.ui.cntBookMark = count;
							}
					} else {
						pageObj.jsonObj = {};
					}
				
				var labels = {
					"tx_merciapps_my_favorite": data.data.booking.Mindex_A.labels.tx_merciapps_my_favorite,
					"tx_merciapps_no_flight": data.data.booking.Mindex_A.labels.tx_merciapps_no_flight,
					"tx_merciapps_no_deal": data.data.booking.Mindex_A.labels.tx_merciapps_no_deal,
					"tx_merciapps_no_book_miles": data.data.booking.Mindex_A.labels.tx_merciapps_no_book_miles,
					"tx_merciapps_no_book_flight": data.data.booking.Mindex_A.labels.tx_merciapps_no_book_flight,
					"tx_merciapps_msg_no_flights": data.data.booking.Mindex_A.labels.tx_merciapps_msg_no_flights,
					"tx_merciapps_book_a_flight": data.data.booking.Mindex_A.labels.tx_merciapps_book_a_flight,
					"tx_merciapps_faredeals": data.data.booking.Mindex_A.labels.tx_merciapps_faredeals,
					"tx_merciapps_book_with_miles": data.data.booking.Mindex_A.labels.tx_merciapps_book_with_miles,
					"tx_merci_text_do_fare_deals": data.data.booking.Mindex_A.labels.tx_merci_text_do_fare_deals,
					"tx_merciapps_flights_to_watch": data.data.booking.Mindex_A.labels.tx_merciapps_flights_to_watch,
					"tx_merci_BookServices": data.data.booking.Mindex_A.labels.tx_merci_BookServices,
					"tx_merci_no_services_bookmark_available": data.data.booking.Mindex_A.labels.tx_merci_no_services_bookmark_available,
					"tx_merci_mail_id_seperation": data.data.booking.Mindex_A.labels.tx_merci_mail_id_seperation,
					"tx_merci_my_booking_share": data.data.booking.Mindex_A.labels.tx_merci_my_booking_share,
					"tx_merci_SMS_share": data.data.booking.Mindex_A.labels.tx_merci_SMS_share,
					"tx_merci_email_share": data.data.booking.Mindex_A.labels.tx_merci_email_share,
					"tx_merci_text_mailA_to": data.data.booking.Mindex_A.labels.tx_merci_text_mailA_to,
					"tx_merci_text_mailA_from": data.data.booking.Mindex_A.labels.tx_merci_text_mailA_from,
					"tx_merci_text_mail_subject": data.data.booking.Mindex_A.labels.tx_merci_text_mail_subject,
					"tx_merci_text_mail_btncancel": data.data.booking.Mindex_A.labels.tx_merci_text_mail_btncancel,
					"tx_merci_text_mail_btnsend": data.data.booking.Mindex_A.labels.tx_merci_text_mail_btnsend,
					"tx_merciapps_book_a_flight_to": data.data.booking.Mindex_A.labels.tx_merciapps_book_a_flight_to,
					"tx_merci_text_mailA_to_placeholder": data.data.booking.Mindex_A.labels.tx_merci_text_mailA_to_placeholder,
					"tx_merci_text_mailA_from_placeholder": data.data.booking.Mindex_A.labels.tx_merci_text_mailA_from_placeholder,					
					"tx_merciapps_msg_delete": data.data.booking.Mindex_A.labels.tx_merciapps_msg_delete,					
					"errors":{
						"2130023":data.data.booking.Mindex_A.errors[2130023].localizedMessage,
						"2130024":data.data.booking.Mindex_A.errors[2130024].localizedMessage,
						"2130282":data.data.booking.Mindex_A.errors[2130282].localizedMessage,
						"25000048":data.data.booking.Mindex_A.errors[25000048].localizedMessage					
					},
					"loyaltyLabels": {
						"tx_merci_li_youHave": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_youHave,
						"tx_merci_li_miles": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_miles,
						"tx_merci_li_tier": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_tier,
						"tx_merci_li_hello": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_hello,
						"tx_merci_li_youOwn": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_youOwn,
						"tx_merci_li_yourMileage": data.data.booking.Mindex_A.labels.loyaltyLabels.tx_merci_li_yourMileage
					}

				};
				pageObj.jsonObj["labels"] = labels;

				var rqstParams = {
					"IS_USER_LOGGED_IN": ""
				};
				pageObj.jsonObj["rqstParams"] = rqstParams;

				var siteParams = {
					"allowBookmarksParam": data.data.booking.Mindex_A.siteParam.siteAllowBookmarksParam,
					"allowbookMarkAward": data.data.booking.Mindex_A.siteParam.siteAllowbookMarkAward,
					"allowbookMarkRvnw": data.data.booking.Mindex_A.siteParam.siteAllowbookMarkRvnw,
					"allowbookMarkDeal": data.data.booking.Mindex_A.siteParam.siteAllowbookMarkDeal,
					"allowbookMarkFareRvw": data.data.booking.Mindex_A.siteParam.siteAllowbookMarkFareRvw,
					"allowBookmarkFlight": data.data.booking.Mindex_A.siteParam.siteAllowBookmarkFlight,
					"bannerHtml": "",
					"homeURL": data.data.booking.Mindex_A.siteParam.homeURL,
					"siteAllowFavorite": data.data.booking.Mindex_A.siteParam.allowFavorite,
					"sitePLCompanyName": data.data.booking.Mindex_A.siteParam.sitePLCompanyName,
					"enableLoyalty": data.data.booking.Mindex_A.siteParam.enableLoyalty,
					"siteAllowBookmarkServices": data.data.booking.Mindex_A.siteParam.siteAllowBookmarkServices,
					"siteEnableShareBookmark": data.data.booking.Mindex_A.siteParam.siteEnableShareBookmark,
					"siteCurrencyFormat":data.data.booking.Mindex_A.siteParam.siteCurrencyFormat
				};
				pageObj.jsonObj["siteParams"] = siteParams;
				
				jsonResponse.localStorage[merciAppData.DB_MYFAVOURITE]=pageObj.jsonObj;
				
				pageObj.utils.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageObj.jsonObj, "overwrite", "json");
			});
			}else{
				this.utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function (result) {
					if (result && result != "" && !pageObj.utils.isEmptyObject(result) ) {
						if (typeof result === 'string') {
	                       pageObj.jsonObj = JSON.parse(result);
	                    }else{
							pageObj.jsonObj = (result);
						}
						jsonResponse.localStorage[merciAppData.DB_MYFAVOURITE]=pageObj.jsonObj;
					} else {
						pageObj.jsonObj = {};
					}
				});
			}
			
			/*this.utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function (result) {
				if (result && result != "") {
					if (typeof result === 'string') {
                       jsonResponse.localStorage[merciAppData.DB_MYFAVOURITE] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_MYFAVOURITE] = (result);
					}
				} else {
					jsonResponse.localStorage[merciAppData.DB_MYFAVOURITE] = {};
				}
			});*/
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the Index page in case of the Merci App
		**/
		initIndexData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_HOME, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_HOME] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_HOME] = (result);
					}
				} else {
					jsonResponse.localStorage[merciAppData.DB_HOME] = {};
				}
			});
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the Contact Us page in case of the Merci App
		**/
		initContactUsData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_CONTACTUS, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_CONTACTUS] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_CONTACTUS] = (result);
					}
				} else {
					jsonResponse.localStorage[merciAppData.DB_CONTACTUS] = {};
				}
			});
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the My Trips page in case of the Merci App
		**/
		initMyTripsData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_GETTRIP, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_GETTRIP] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_GETTRIP] = (result);
					}
				} else {
					jsonResponse.localStorage[merciAppData.DB_GETTRIP] = {};
				}
			});
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the Trip List page in case of the Merci App
		**/
		initTripListData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_TRIPLIST] = JSON.parse(result);
                        var storeData=JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_TRIPLIST] = (result);
						var storeData=JSON.parse(result);
					}

					/*Begin : Removing Old Trip From the List*/
					var EnablePastDeletion = false;
					if(jsonResponse.data.framework.settings.siteDeletePastTrip != undefined){
						EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastTrip;
					}
					if(EnablePastDeletion){
						var saveChanges = false;
						if(!that.utils.isEmptyObject(storeData.detailArray)){
							var currSvDate = new Date(jsonResponse.data.framework.date.date);
							for(var pnrDetailsIndex in storeData.detailArray){
								var pnrDetails = storeData.detailArray[pnrDetailsIndex];
								if(!that.utils.isEmptyObject(pnrDetails.segmentDetails) && (pnrDetails.segmentDetails.length > 0)
										&& !that.utils.isEmptyObject(pnrDetails.segmentDetails[pnrDetails.segmentDetails.length-1])){
									var segmentDetails = pnrDetails.segmentDetails[pnrDetails.segmentDetails.length-1];
									if(segmentDetails.arrDate != null && segmentDetails.arrDate != ""){
										var tripArDate = new Date(segmentDetails.arrDate);
										if((tripArDate-currSvDate) < 0){
											saveChanges = true;
											delete storeData.detailArray[pnrDetailsIndex];
											//jsonResponse.ui.cntTrip = jsonResponse.ui.cntTrip - 1;
										}
									}
								}
							}
						}
						if(saveChanges){
							that.utils.storeLocalInDevice(merciAppData.DB_TRIPLIST, storeData, "overwrite", "json");
						}
					}
					/*End : Removing Old Trip From the List*/


					var count = 0;
					if (!that.utils.isEmptyObject(storeData)) {
						count += Object.keys(storeData.detailArray).length;
					};
					if(jsonResponse.ui !=undefined && jsonResponse.ui !=null){
						jsonResponse.ui.cntTrip=count;
					}

				} else {
					jsonResponse.localStorage[merciAppData.DB_TRIPLIST] = {};
				}
			});
		},

		/**
		*	Get the data stored in the local storage 
		* 	which will be used to display the Trip List page in case of the Merci App
		**/
		initBoardingPassData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_BOARDINGPASS] = JSON.parse(result);
                        var storeData=JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_BOARDINGPASS] = (result);
						var storeData=JSON.parse(result);
					}

					/*Begin : Removing Old Boarding Passes From the List*/
					var EnablePastDeletion = false;
					if(jsonResponse.data.framework.settings.siteDeletePastBP != undefined){
						EnablePastDeletion = jsonResponse.data.framework.settings.siteDeletePastBP;
					}else{
						EnablePastDeletion = false;
					}
					if(EnablePastDeletion){
						var saveChanges = false;
						if(!that.utils.isEmptyObject(storeData.boardingPassArray)){
							var currSvDate = new Date(jsonResponse.data.framework.date.date);
							for(var boardingPassIndex in storeData.boardingPassArray){
								var boardingPassDetails = storeData.boardingPassArray[boardingPassIndex];
								if(boardingPassDetails.arrDate != null && boardingPassDetails.arrDate != ""){
									var tripArDate = new Date(boardingPassDetails.arrDate);
									if((tripArDate-currSvDate) < 0){
										saveChanges = true;
										delete storeData.boardingPassArray[boardingPassIndex];
										//jsonResponse.ui.cntTrip = jsonResponse.ui.cntTrip - 1;
									}
								}
							}
						}
						if(saveChanges){
							that.utils.storeLocalInDevice(merciAppData.DB_BOARDINGPASS, storeData, "overwrite", "json");
						}
					}
					/*End : Removing Old Boarding Passed From the List*/


					var count = 0;
					if (!that.utils.isEmptyObject(storeData)) {
						count += Object.keys(storeData.boardingPassArray).length;
					};
					if(jsonResponse.ui !=undefined && jsonResponse.ui !=null){
						jsonResponse.ui.cntBoardingPass=count;
					}

				} else {
					jsonResponse.localStorage[merciAppData.DB_BOARDINGPASS] = {};
				}
			});
		},

		/**
		*	Get the data stored in the local storage
		* 	which will be used to display the Trip List page in case of the Merci App
		**/
		initFlightInfoData: function () {
			var that=this;
			this.utils.getStoredItemFromDevice(merciAppData.DB_FLIGHTINFO, function (result) {
				if (result && result != "" && !that.utils.isEmptyObject(result) ) {
					if (typeof result === 'string') {
                        jsonResponse.localStorage[merciAppData.DB_FLIGHTINFO] = JSON.parse(result);
                    }else{
						jsonResponse.localStorage[merciAppData.DB_FLIGHTINFO] = (result);
					}
				} else {
					jsonResponse.localStorage[merciAppData.DB_FLIGHTINFO] = {};
				}
			});
		}
	}
});