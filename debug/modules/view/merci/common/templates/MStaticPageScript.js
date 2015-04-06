Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MStaticPageScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this.__ajax = modules.view.merci.common.utils.URLManager;
	},

	$prototype: {

		$dataReady: function() {
			
		},

		$displayReady: function() {
			$('body').attr('id', 'customPage');
			$('#customPage').css('overflow-y', 'hidden');
			var url=jsonResponse.ui.navData.url;
			var label=jsonResponse.ui.navData.label;
			this.moduleCtrl.setHeaderInfo({
				title: "Custom",
				bannerHtmlL: "",
				homePageURL: "",
				showButton: true,
				companyName: ""
			});
			
			$("#customPageId").html('<object id="objectId"  onload="loadObjectSuccess();" data='+url+ '/>');
			
			if(typeof checkinLoad !="undefined" && label=="Checkin" ){
				checkinLoad(label);	
			}
			
			 var wrapperEle = document.querySelector("div#menuContainer");
			   var layoutEle = document.querySelector("div#layout");
			   var layoutId = document.getElementById("navbar-div");
	           if(wrapperEle){
				if(wrapperEle.style.width ==undefined || wrapperEle.style.width ==""){
					wrapperEle.style.width=0;
				}
					var wrapperWidth = parseInt(wrapperEle.style.width);
					if (wrapperWidth == 0 && label !="Checkin") {
					  wrapperEle.style.width="250px";
					  layoutEle.style.left="-250px";
					  if(layoutId !=undefined && layoutId !=null){
					 		layoutId.style.display="block";
					  }
					} else {
					  wrapperEle.style.width="0px";
					  layoutEle.style.left="0px";
					  if(layoutId !=undefined && layoutId !=null){
					  		layoutId.style.display="none";
					  }
					}
					
	          }
	          if(label =="Checkin"){
				$( ".msk").css("display", "none");
			}
		
		}
	}
});
