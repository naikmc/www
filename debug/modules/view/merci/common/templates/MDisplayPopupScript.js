Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MDisplayPopupScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {},
	$destructor: function() {
		var pageHeader = document.getElementById("top") ;
		pageHeader.className = pageHeader.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
		var bodu = document.getElementsByTagName("body")[0] ;
		bodu.className = bodu.className.replace(/(?:^|\s)body-popup(?!\S)/g, '');
		var divLayout = document.getElementById("layout") ;
		divLayout.className = divLayout.className.replace(/(?:^|\s)layout-popup(?!\S)/g, '');
	},

	$prototype: {

		$dataReady: function() {
			this.popup = this.moduleCtrl.getJsonData({
				key:'popup'
			}); 
			
			if(this.popup.data.showHeader!=true){
				var pageHeader = document.getElementById("top");
				if (pageHeader != null) {
					pageHeader.className += ' hidden';
				}
				var bodu = document.getElementsByTagName("body")[0] ;
				bodu.className += " body-popup";
				var divLayout = document.getElementById("layout") ;
				divLayout.className += " layout-popup";
			}else if(this.popup.data.showBack === true){
				// put delay for navbar
				var that = this;
				setTimeout(function(){
					that.moduleCtrl.setHeaderInfo({
						title:that.popup.data.title, 
						showButton: true
					});
				}, 500);
			}
		},

		closePopup: function() {
			this.moduleCtrl.goBack();
		}		
	}
});