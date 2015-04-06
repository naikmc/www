Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MEXTPScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		extrnlPayment = this;
		extrnlPayment.utils=modules.view.merci.common.utils.MCommonScript;
	},
	$prototype: {

		$viewReady: function() {
			// submit form
			if(extrnlPayment.utils.isRequestFromApps()){
				extrnlPayment.iframe = document.getElementById('myframe');
				document.forms['externalPayment'].setAttribute('target','myframe');
			}
			document.forms['externalPayment'].submit();
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MEXTP",
						data:{}
					});
			}
		},
		frameLoad: function() {
			
			if(extrnlPayment.iframe !=undefined){
				if(typeof hideLink !="undefined"){
					hideLink();
				}

				if(extrnlPayment.iframe.contentWindow !=undefined && extrnlPayment.iframe.contentWindow.jsonResponse !=undefined){
					var data=document.getElementById("myframe").contentWindow.jsonResponse;
					if(data.data !=undefined && data.data.booking !=undefined ){
						if(data.data.booking.MCONF_A !=undefined){
							jsonResponse.data.booking.MCONF_A=data.data.booking.MCONF_A;
							extrnlPayment.moduleCtrl.navigate(null, 'merci-book-MCONF_A');
						}else{
							extrnlPayment.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
						}
					}
				}
				var overlay=document.getElementById("extPaymentMsk");
				if(overlay!=null){
					extrnlPayment.utils.removeClass(overlay, "dark");
					extrnlPayment.utils.removeClass(overlay, "loading");
				}
			}
		},

		_getIFrameStyle: function() {
			var height = document.documentElement.clientHeight;
			return 'width:100%;margin-bottom: -30px;min-height:' + height + 'px';
		}
	}
});