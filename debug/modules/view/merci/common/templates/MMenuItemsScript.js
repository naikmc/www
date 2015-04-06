Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.MMenuItemsScript",
	$dependencies: ['modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.URLManager'],
	
	$constructor: function() {
		menuItem = this;
		menuItem.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		menuItem._ajax = modules.view.merci.common.utils.URLManager;

	},
	
	$prototype: {
		$dataReady: function() {
		this.customButton=this.data.rqstParams;
		},
		
		$viewReady: function() {
			
		},

		toggleMenu: function() {
	           var wrapperEle = document.querySelector("div#menuContainer");
			   var layoutEle = document.querySelector("div#layout");
			   var hEle = document.querySelector("header.banner");
			   var layoutId = document.getElementById("navbar-div");
	           if(wrapperEle){
				if(wrapperEle.style.width ==undefined || wrapperEle.style.width ==""){
					wrapperEle.style.width=0;
				}
					var wrapperWidth = parseInt(wrapperEle.style.width);
					if (wrapperWidth == 0) {
					  wrapperEle.style.width="250px";
					  layoutEle.style.left="-250px";
					  hEle.style.left="-250px";
					  if(layoutId !=undefined && layoutId !=null){
					  		layoutId.style.display="block";
					  }
					} else {
					  wrapperEle.style.width="0px";
					  layoutEle.style.left="0px";
					  hEle.style.left="0px";
					  if(layoutId !=undefined && layoutId !=null){
					  		layoutId.style.display="none";
					  }
					}
					
	          }
	    },

		toggleMenuItem: function(evt,args) {
			if(evt.detail !=undefined){
				if(evt.detail.direction=="right" && evt.detail.distance>6){
		            var wrapperEle = document.querySelector("div#menuContainer");
				    var layoutEle = document.querySelector("div#layout");
				    var hEle = document.querySelector("header.banner");
				    var layoutId = document.getElementById("navbar-div");
		            if(wrapperEle){
						if(wrapperEle.style.width ==undefined || wrapperEle.style.width ==""){
							wrapperEle.style.width=0;
						}
						var wrapperWidth = parseInt(wrapperEle.style.width);
						if (wrapperWidth != 0) {
						  	wrapperEle.style.width="0px";
						  	layoutEle.style.left="0px";
						  	hEle.style.left="0px";
						  	if(layoutId !=undefined && layoutId !=null){
					  				layoutId.style.display="none";
					  		}
						}
						
		         	}
		        }
	    	}
	    },
		isHomePage:function(flowType){
			flowType = flowType.split('-');
			if(flowType[1]!=undefined && flowType[1]=='N'){
				return true;
			}
			return false;
		},
		
		onClickURL:function(wrapper,data){
			if(data.url=="TEST" && data.label=="Home"){
				this.onHomeClick();
			}else if(data.url=="TEST" && data.label=="Settings"){
				this.onSettingClick();
			}else if(data.url=="TEST" && data.label=="Favourite"){
				this.onMyFavoriteClick();
			}else if(data.url=="TEST" && data.label=="Time Table"){
				this.onTimeTableClick();
			}else if(data.url=="TEST" && data.label=="Flight Info"){
				this.onFlightInfoClick();
			}else{
				args={};
				args.forceReload=true;
				var jsonData={};
				jsonData.url=data.url;
				jsonData.label=data.label;
				jsonResponse.ui.navData=jsonData;
				menuItem.moduleCtrl.navigate(args, 'merci-MStaticPage_A');
			}
		},
		
		onHomeClick: function() {
			this.toggleMenu();
			menuItem.__merciFunc.sendNavigateRequest(null, 'MWelcome.action', this);
		},
		onSettingClick: function(evt) {
			this.toggleMenu();	
			if(aria.utils.HashManager.getHashString()!="merci-MSetting_A"){
				this.__merciFunc.showMskOverlay(true);
				menuItem.moduleCtrl.navigate(null, 'merci-MSetting_A');
			}
		},

		onMyFavoriteClick: function() {
			this.toggleMenu();	
			menuItem.moduleCtrl.navigate(null, 'merci-MFAVOURITE_A');
		},

		onFlightInfoClick: function() {
			this.toggleMenu();	
			menuItem.__merciFunc.sendNavigateRequest(null, 'MFIFOInput.action', this);
		},

		onTimeTableClick: function() {
			this.toggleMenu();	
			menuItem.__merciFunc.sendNavigateRequest(null, 'MTimeTableSearch.action', this);
		}
	}
});