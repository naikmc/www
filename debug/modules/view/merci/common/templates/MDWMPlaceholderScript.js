Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MDWMPlaceholderScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MDWMContentUtil'
	],
	$constructor: function() {
		this.dwm = modules.view.merci.common.utils.MDWMContentUtil;	
		this.urlMgr = modules.view.merci.common.utils.URLManager;
	},
	$destructor: function() {},

	$prototype: {

		$viewReady: function() {
			var element = document.getElementById(this.data.placeholderType);
			if (element != null) {
				this.dwm.processContainer({
					'element':  element,
					'cb': this.onClickFunc,
					'scope': this
				});
			}
		},

		onClickFunc:function(evt,args){
			if(!args.isExternal){
				var actionName = args.url;
				if(actionName != undefined){
					if(actionName.indexOf('.action') == -1){
						actionName += '.action';
					}
					var params = null;
					if(!this.utils.isEmptyObject(args.params)){
						params = args.params;
					}

					var request = this.utils.navigateRequest(null, actionName, {
		                fn: this.onClickFuncCallBack,
		                scope: this,
		                args: params
		            });
		            this.urlMgr.makeServerRequest(request, false);					
				}
			}
		},

		onClickFuncCallBack:function(response){
			if (response.responseJSON != null) {
				// getting next page id
				var nextPage = response.responseJSON.homePageId;				
				this.moduleCtrl.navigate(null, nextPage);
			}

		}		
	}
});