Aria.interfaceDefinition({
	$classpath: 'modules.view.merci.common.interfaces.IMerciCtrlInterface',
	$extends: 'aria.templates.IModuleCtrl',
	$events: {
		'navigate': {
			description: 'Raised navigate event',
			properties: {
				'page': 'Page description.'
			}
		}
	},
	$interface: {
		getModuleData: function() {},
		getJsonData: function() {},
		goBack: function() {},
		raiseEvent: function(evt) {},
		navigate: function(args, layout) {},
		setHeaderInfo: function(title, bannerHtml, homePageURL, showButton) {},
		getHeaderInfo: function() {},
		getStaticData: function(data) {},
		setStaticData: function(data,value) {}
	}
});