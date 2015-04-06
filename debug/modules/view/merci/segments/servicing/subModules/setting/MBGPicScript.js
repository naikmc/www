Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.setting.MBGPicScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function() {        
		this.data={};
		this.data.printUI = false;
		this.json = {};
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},
	$prototype: {

		$dataReady: function() {

			var pageObjChngBckgrnd = this;
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this.urlManager = modules.view.merci.common.utils.URLManager;
			this.data.errors = null;
			this.data.appBackgroundImageList = '';
			this.data.appBackgroundImageListArray = [];
			this.data.appBackgroundImageURL = '';
			this.data.currentAppBackground = 'none';
			this.selectedCrumb = 0;
			this.lastName = jsonResponse.lastName;
			this.countryCode = modules.view.merci.common.utils.URLManager.__getCountrySite();
			this.languageCode = modules.view.merci.common.utils.URLManager.__getLanguageCode();
			this.__merciFunc.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					pageObjChngBckgrnd.json.labels = result.labels;
					pageObjChngBckgrnd.json.gblLists = result.gblLists;
					pageObjChngBckgrnd.json.rqstParams = result.rqstParams;
					pageObjChngBckgrnd.json.siteParams = result.siteParams;
					pageObjChngBckgrnd.json.jsonData = result.jsonData;
				}
				if (pageObjChngBckgrnd.json != null && pageObjChngBckgrnd.json != undefined) {
					if (!pageObjChngBckgrnd.utils.isEmptyObject(pageObjChngBckgrnd.json.siteParams.appBackgroundImageList)) {
						pageObjChngBckgrnd.__merciFunc.getStoredItemFromDevice(merciAppData.DB_USEBACKGROUND, function(result) {
							pageObjChngBckgrnd.data.currentAppBackground = result;
							pageObjChngBckgrnd.data.appBackgroundImageList = pageObjChngBckgrnd.json.siteParams.appBackgroundImageList;
							var backgroundImageListArray = pageObjChngBckgrnd.data.appBackgroundImageList.split(",");
							for(var x=0; x<backgroundImageListArray.length; x++){
								if(backgroundImageListArray[x]==pageObjChngBckgrnd.data.currentAppBackground){
									backgroundImageListArray.splice(x,1);
								}
							}
							pageObjChngBckgrnd.data.appBackgroundImageListArray = backgroundImageListArray;
							var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
							pageObjChngBckgrnd.data.appBackgroundImageURL = bp[0] + "://" + bp[1] + ":" + bp[2] + bp[10] + "/" + bp[4] + "/" + bp[5] + "/static/img/client/" ;
							pageObjChngBckgrnd.$json.setValue(pageObjChngBckgrnd.data,'printUI',true);	
						});
					}
				}				
			});
		},


		$displayReady: function() {
			var pageObjChngBckgrnd = this;
			
				var bgChangeData = {};
				bgChangeData.scrollId = this.$getId('bgChange_dynaScroller');
				bgChangeData.id = 'bgChange_dynaScroller';
				bgChangeData.olScroll = 'bgChange_olScroll';
				bgChangeData.liScroll = 'bgChange_liScroll_';
				bgChangeData.length = this.data.appBackgroundImageListArray.length;
				bgChangeData.callingPageCtx = pageObjChngBckgrnd;
				this.utils.setScroll(bgChangeData);
			
		},

		$viewReady: function() {
			
		},

		onSaveBackground: function(){				
			this.removeClass();
			jsonResponse.ui.tabValue = "tabHome";
			var hashPage = aria.utils.HashManager.getHashString();
			this.utils.showMskOverlay(true);
			var pageObjChngBckgrnd = this;
			var selectedImageName = this.data.appBackgroundImageListArray[this.selectedCrumb];
			var imageExtension = selectedImageName.substr(selectedImageName.lastIndexOf("."),selectedImageName.length);
			var selectedImageInHighResolution = selectedImageName.split("_low")[0]+"_high"+imageExtension;
			selectedImageInHighResolution = this.data.appBackgroundImageURL+selectedImageInHighResolution;
			
			/*var params = "imageURL="+selectedImageInHighResolution+"&result=json";
			var request = {
				parameters: params,
				action: 'MChangeBackground.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				cb: {
					fn: this.onSaveBackgroundCallback,
					scope: this,
					args: params
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);*/			
			this.getImageDataURL(selectedImageInHighResolution,imageExtension,this.onSaveBackgroundCallback);				
		},
		
		getImageDataURL: function(url,imageExt,func) {
			var that = this;
			var data, canvas, ctx;			
			var img = new Image();
			var imgType = "image/"+imageExt.replace(".","");
			img.onload = function(){
				// Create the canvas element.
				canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				// Get '2d' context and draw the image.
				ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				// Get canvas data URL
				try{
					data = canvas.toDataURL(imgType);
					func({data:data, that:that});
				}catch(e){
					console.log(e);
					func({data:null, that:that});
				}
			}
			// Load image URL.
			try{
				img.src = url;
			}catch(e){
				console.log("Error in loading imag.");
				func({data:null, that:that});
			}
			
		},

		onSaveBackgroundCallback: function(args){
			var pageObjChngBckgrnd = args.that;
			if(args){
				var imageData = args.data;
				if (imageData) {
					pageObjChngBckgrnd.utils.storeLocalInDevice(merciAppData.DB_BACKGROUND, imageData, "overwrite", "text");
					pageObjChngBckgrnd.utils.storeLocalInDevice(merciAppData.DB_USEBACKGROUND, pageObjChngBckgrnd.data.appBackgroundImageListArray[pageObjChngBckgrnd.selectedCrumb], "overwrite", "text");
				}
			}			
			pageObjChngBckgrnd.utils.getStoredItemFromDevice(merciAppData.DB_HOME, function(result) {
				if (result != null && result != '') {
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					if (!pageObjChngBckgrnd.utils.isEmptyObject(result)) {
						jsonResponse.ui.fromStorage = true;
						if(result.data.booking.Mindex_A.siteParam.isCustomHomeEnabled == 'TRUE'){
							pageObjChngBckgrnd.moduleCtrl.navigate(null, 'merci-MCustomHome_A');
						}
						if(result.data.booking.Mindex_A.siteParam.isDynamicHomeEnabled == 'TRUE'){
							pageObjChngBckgrnd.moduleCtrl.navigate(null, 'merci-MDynamicHome_A');
						}else{
							pageObjChngBckgrnd.moduleCtrl.navigate(null, 'merci-Mindex_A');
						}
					} else {
						jsonResponse.ui.fromStorage = false;
						pageObjChngBckgrnd.utils.sendNavigateRequest(null, 'MWelcome.action', pageObjChngBckgrnd);
					}
				} else {
					jsonResponse.ui.fromStorage = false;
					pageObjChngBckgrnd.utils.sendNavigateRequest(null, 'MWelcome.action', pageObjChngBckgrnd);
				}
			});
		},

		removeClass: function() {
			if (document.getElementsByClassName('hoverClass' + jsonResponse.ui.tabValue)[0] != null) {
				var id = document.getElementsByClassName('hoverClass' + jsonResponse.ui.tabValue)[0].id;
			}
			if (id == 'tabHome') {
				document.getElementById('tabHome').setAttribute('class', 'tab-home');
			} else if (id == 'tabBoarding') {
				document.getElementById('tabBoarding').setAttribute('class', 'tab-boarding');
			} else if (id == 'tabMyTrip') {
				document.getElementById('tabMyTrip').setAttribute('class', 'tab-my-trips');
			} else if (id == 'tabFavourite') {
				document.getElementById('tabFavourite').setAttribute('class', 'tab-my-favourites');
			} else if (id == 'tabSetting') {
				document.getElementById('tabSetting').setAttribute('class', 'tab-more');
			}
		}
	}
});
