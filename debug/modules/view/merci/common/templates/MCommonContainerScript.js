Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MCommonContainerScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {

		// variables to control UI
		if (jsonResponse.ui == null) {
			jsonResponse.ui = {};
		}
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		closePopup: function() {
			this.utils.closePopup();
		},

		$displayReady: function() {
			if ( typeof jsonResponse.ui != 'undefined' && jsonResponse.ui.keepSpinning == true) {
				jsonResponse.ui.keepSpinning = undefined;
				return;
			}

			if(this.utils.isRequestFromApps()==true){
				if($("div.menu-c").hasClass('show')){
					$("div[_template$=Container] div.container > div:nth-child(3)").addClass("blur");
				}else{
					$("div[_template$=Container] div.container > div:nth-child(3)").removeClass("blur");
				}
			}

			var then = this;
			setTimeout(function() {
				then.utils.hideMskOverlay();
			}, 500);
		},

		// setting GTM script
		setGTM: function(w,d,s,l,i){
			w[l] = w[l]||[];
			w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
			var f = d.getElementsByTagName(s)[0], j = d.createElement(s),dl = l != 'dataLayer'?'&l=' + l:'';
			j.async = true;
			j.id = 'merciGTM'
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			f.parentNode.insertBefore(j,f);
		},
		
		$viewReady: function() {
			
			// calling Google Tag Manager
			if (this.utils.isGTMEnabled()) {
				var gtmContainerVal = 'GTM-' + this.utils.getGTMContainerValue();
				this.setGTM(window,document,'script','dataLayer',gtmContainerVal);
			}

			/*	START: PTR 09218617 [Medium]: MeRCI R21:CR8888159 Fare Range On Fare Review Page Coming on Same View CR 8888159	*/

			/* Converting all href's starting with http to custom format to enable Cordova app to open the hyperlink in native browser. */
			
			if (this.utils.isRequestFromApps() == true) {

				for (i = 0; i < document.getElementsByTagName("a").length; i++) {
					var url = document.getElementsByTagName("a")[i].getAttribute("href");

					if(url != null && typeof url!='undefined' && url.length>4 && (url.substring(0,4) =="http" || url.substring(0,4) =="https") && url.indexOf("#")==-1){
						document.getElementsByTagName("a")[i].removeAttribute('href');
						document.getElementsByTagName("a")[i].removeAttribute('target');
						document.getElementsByTagName("a")[i].setAttribute('href', "javaScript:void(0)");
						aria.utils.Event.addListener(document.getElementsByTagName("a")[i], "click", {
							fn: this.utils.loadURLs,
							args: url
						}, true);
					}
				}
			}

			/*	END: PTR 09218617 [Medium]: MeRCI R21:CR8888159 Fare Range On Fare Review Page Coming on Same View CR 8888159	*/	
		}
	}
});