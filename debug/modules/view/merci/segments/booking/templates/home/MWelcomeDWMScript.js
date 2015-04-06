Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.home.MWelcomeDWMScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager'],
	$constructor: function() {
		this.urlMgr = modules.view.merci.common.utils.URLManager;
	},
	$prototype: {
		
		$dataReady: function() {
			// set HTML content
			this.data = jsonResponse.data.booking.MWelcomeDWM;
		},
		
		$viewReady: function() {
			this.$processContainer({
				el: document.getElementById(this.$getId('merci_wrapper'))
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MWelcomeDWM",
						data:this.data
					});
			}
		},
		
		/**
		 * process HTML elements and add relevant listener wherever applicable
		 * @param args JSON containing mandatory parameters
		 */
		$processContainer: function(args) {
			if (args.el != null) {
				var all = args.el.getElementsByTagName("*");
				for (var i = 0;all != null && i < all.length; i++) {
					if (all[i] != null) {
						var node = all[i];
						if (node.getAttribute('data-aria-type') == 'click') {
							// process and add listener
							aria.utils.Event.addListener(node, 'click', {
								fn: this.clickFunction,
								scope: this,
								args: {
									isExternal: node.getAttribute('data-aria-external') != null && node.getAttribute('data-aria-external'),
									url: node.getAttribute('data-aria-action')
								}
							}, true);
						} else if (node.nodeName != null && node.nodeName.toLowerCase() == 'script') {
							if (node.parentNode) {
								node.parentNode.removeChild(node);
							}
							
							this.$evalInnerScript({
								el: node
							});
						}
					}
				}
			}
		},

		$isNodeNameMatch: function(node, name) {
			
			return node != null 
				&& name != null 
				&& node.nodeName != null 
				&& node.nodeName.toUpperCase() === name.toUpperCase();
		},
		
		$evalInnerScript: function(args) {
			
			if (args == null 
				|| args.el == null) {
				return;
			}
			
			// get data
			var data = args.el.text || args.el.textContent || args.el.innerHTML || '';
			
			// create script
			var script = document.createElement('script');
			script.type = 'text/javascript';
			try {
				script.appendChild(document.createTextNode(data));
			} catch (e) {
				script.text = data;
			}
			
			// insert to head
			var head = document.getElementsByName('head')[0] || document.documentElement;
			head.insertBefore(script, head.firstChild);
			head.removeChild(script);
		},
		
		/**
		 * custom function called on click of any link
		 * @param event JSON containing event information
		 * @param args JSON containing mandatory parameters
		 */
		clickFunction: function(event, args) {
			if (args != null) {
				if (args.isExternal) {
					document.location.href = args.url;
				} else {
					var request = {
						method: 'POST',
						isCompleteURL: true,
						action: args.url,
						loading: true,
						expectedResponseType: 'json',
						cb: {
							fn: this._onActionCallback,
							scope: this
						}
					}
					
					// trigger an ajax call
					this.urlMgr.makeServerRequest(request, false);
				}
			}
		},
		
		/**
		 * function called once response received from server
		 * @param response JSON containing data
		 * @param args JSON containing parameters
		 */
		_onActionCallback: function(response, args) {
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			
			this.moduleCtrl.navigate(null, nextPage);
		}
	}
});