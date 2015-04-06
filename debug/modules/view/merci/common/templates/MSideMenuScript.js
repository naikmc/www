Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.common.templates.MSideMenuScript",
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.util = modules.view.merci.common.utils.MCommonScript;
	},
	$prototype: {
		$dataReady: function() {
		},
		
		$viewReady: function() {
		},

		toggleMenu: function() {
	          var menuEle = document.querySelector("div#menuContainer");
	          var layoutEle = document.querySelector("div#layout");
	          if(menuEle){
	            var menuLeft = parseInt(menuEle.style.left);
	            var layoutLeft = parseInt(layoutEle.style.left);
	            if (menuLeft == 0) {
	              menuEle.style.left="-250px";
	              layoutEle.style.left="0px";
	            } else {
	              menuEle.style.left="0px";
	              layoutEle.style.left="250px";
	            }
	          }
	      }
	}
});