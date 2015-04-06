Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MShoppingCartScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this._ajax = modules.view.merci.common.utils.URLManager;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		var pageObjHeader = this;
	},

	$prototype: {

		$dataReady: function() {

			this.printUI = false;
			this.getBookmarkData();
			if (jsonResponse.ui == null) {
				jsonResponse.ui = {};
			}
			this.shareData = {};
			this.shareData.shareResponse = {};
			this.getBookmarkData();
			this.headerBadge = jsonResponse.ui;
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
		},

		$viewReady: function() {
			//$('.shoppingCartContainer').slideToggle("slow");
		},

		$displayReady: function() {
			if (document.getElementById("shoppingCartContainer") != null) {
				document.getElementById("shoppingCartContainer").style.display = 'block';
			}
		},

		getBookmarkData: function() {
			var pageBookMark = this;
			var deleteData = false;
			var result = this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);

			var dateObj = new Date();
			dateObj = dateObj.getTime();
			if (result && result != "") {
				if (typeof result === 'string') {
					pageBookMark.jsonObj = JSON.parse(result);
				} else {
					pageBookMark.jsonObj = (result);
				}

				if (!pageBookMark.__merciFunc.isEmptyObject(pageBookMark.jsonObj.RVNWFARESTATUS)) {
					for (var key in pageBookMark.jsonObj.RVNWFARESTATUS) {
						if (dateObj > pageBookMark.jsonObj.RVNWFARESTATUS[key].beginDtObj) {
							delete pageBookMark.jsonObj.RVNWFARESTATUS[key];
							delete pageBookMark.jsonObj.RVNWFAREINFO[key];
							deleteData = true;
							if (jsonResponse.ui.cntBookMark > 0) {
								jsonResponse.ui.cntBookMark = jsonResponse.ui.cntBookMark - 1;
							}
						}
					}
				}


				if (!pageBookMark.__merciFunc.isEmptyObject(pageBookMark.jsonObj)) {
					pageBookMark.labels = pageBookMark.jsonObj.labels;
					pageBookMark.siteParams = pageBookMark.jsonObj.siteParams;
					pageBookMark.rqstParams = pageBookMark.jsonObj.rqstParams;

					if (!pageBookMark.__merciFunc.isEmptyObject(pageBookMark.jsonObj.RVNWFAREINFO)) {
						pageBookMark.fareInfo = pageBookMark.jsonObj.RVNWFAREINFO;
					}
					if (!pageBookMark.__merciFunc.isEmptyObject(pageBookMark.jsonObj.RVNWFARESTATUS)) {
						pageBookMark.fareStatus = pageBookMark.jsonObj.RVNWFARESTATUS;
					}

				}

				if (deleteData == true) {
					this.$json.setValue(jsonResponse.ui, "cntBookMark", jsonResponse.ui.cntBookMark);
					pageBookMark.__merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, pageBookMark.jsonObj, "overwrite", "json");
				};

			}
		},

		_getDate: function(dateBean) {
			if (dateBean != null && dateBean.jsDateParameters != null) {
				var dateParams = dateBean.jsDateParameters.split(',');
				return new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
			}

			return null;
		},

		deleteTrip: function(event, args) {

			var that = this;
			var checkout = document.getElementById('checkout');
			var jsonKey = args.id;
			var result = this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);
			//that._merciFunc.getStoredItemFromDevice('BOOKMARKJSON', function(result) {
			jsonObj = {};

			if (typeof result === 'string') {
				jsonObj = JSON.parse(result);
			} else {
				jsonObj = (result);
			}


			if (!that._merciFunc.isEmptyObject(jsonObj)) {
				for (var key in jsonObj) {
					if ('RVNWFAREINFO' == key) {
						var slctFareInfo = jsonObj[key];
					}
					if ('RVNWFARESTATUS' == key) {
						var slctFareStatus = jsonObj[key];
					}
				}
			}
			var test = false;
			if (!that._merciFunc.isEmptyObject(slctFareStatus)) {
				for (var key in slctFareStatus) {
					if (jsonKey == key) {
						delete slctFareStatus[key];
						jsonObj['RVNWFARESTATUS'] = slctFareStatus;

						that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
						test = true;
						break;
					}
				}
			}
			if (!that._merciFunc.isEmptyObject(slctFareInfo)) {
				for (var key in slctFareInfo) {
					if (jsonKey == key) {
						delete slctFareInfo[key];
						jsonObj['RVNWFAREINFO'] = slctFareInfo;
						that._merciFunc.storeLocalInDevice(merciAppData.DB_MYFAVOURITE, jsonObj, "overwrite", "json");
						test = true;
						break;
					}
				}
			}
			//});
			var parent = document.getElementById("shoppingDeals");
			var child = document.getElementById(args.id);
			parent.removeChild(child);
			that.$json.setValue(jsonResponse.ui, 'cntBookMark', (jsonResponse.ui.cntBookMark - 1));


			//pageObj.$json.setValue(jsonResponse.ui, "chkOutbtn", !jsonResponse.ui.chkOutbtn);

			if (checkout.getAttribute('relId') == jsonKey) {
				checkout.className += " disabled";
				checkout.setAttribute('rel', '');
				checkout.setAttribute('relId', '');
				document.getElementById('currency').innerHTML = ''
				document.getElementById('price').innerHTML = ''
			}

		},

		getShoppingCartBookmarkCount: function() {
			var shoppingCartBookmarksCount = 0;
			var result = this.moduleCtrl.getStaticData(merciAppData.DB_MYFAVOURITE);

			if (!this.__merciFunc.isEmptyObject(result) && (result != 'undefined')) {
				//var jsonObj = JSON.parse(result) || {};
				if (!this.__merciFunc.isEmptyObject(result)) {
					var shoppingCartBookmarks = result['RVNWFARESTATUS'] || {};
					for (key in shoppingCartBookmarks) {
						shoppingCartBookmarksCount++;
					}
				}
			}

			return shoppingCartBookmarksCount;
		},

		closeSlider: function() {
			this.moduleCtrl.goBack();
		},

		enableCheckOut: function(response, args) {
			this.__merciFunc.showMskOverlay(true);
			event.preventDefault();
			var checkOutBtn = document.getElementById('checkout');
			if (checkOutBtn != null && checkOutBtn.className.indexOf('disabled') < 0) {
				var jsonFare = checkOutBtn.getAttribute('rel').replace('\"', '');
				jsonFare += '&result=json';

				var request = {
					parameters: jsonFare,
					action: 'MAvailThenFare.action',
					method: 'POST',
					expectedResponseType: 'json',
					loading: true,
					cb: {
						fn: this.__onRenevnueCallback,
						args: jsonFare,
						scope: this
					}
				};

				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
				document.getElementById('shoppingCartContainer').style.display = 'none';
			}
		},



		__onRenevnueCallback: function(response, inputParams) {
			var pageBookMark = this;
			if (response.responseJSON != null) {

				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {

					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					if (json.booking == undefined) {
						json.booking = {};
					} else {
						pageBookMark.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
						this.moduleCtrl.navigate(null, nextPage);
					}
				}
			}
		},

		setCheckOut: function(response, args) {
			document.getElementById('currency').innerHTML = args.curr;
			document.getElementById('price').innerHTML = args.price;
			var checkout1 = document.getElementById('checkout');
			if (checkout1 != null) {
				checkout1.className = checkout1.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
				checkout1.setAttribute('rel', args.url);
				checkout1.setAttribute('relId', args.id);
			}
		},
		shareTrip: function(event,args) {
			var baseURLAttributes = modules.view.merci.common.utils.URLManager.getBaseParams();
			var newURL = baseURLAttributes[0]+"://"+baseURLAttributes[1]+baseURLAttributes[10]+"/"+baseURLAttributes[4]+"/MAvailThenFare.action"+"?"+baseURLAttributes[8];
			var dataToEncrypt = args.url;
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