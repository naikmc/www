Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.MDWMContentUtil',
	$singleton: true,
	$dependencies: [
	    'aria.utils.Type',
		'aria.utils.Date',
		'aria.utils.Number',
	    'aria.utils.Callback',
	    'aria.utils.HashManager',
	    'modules.view.merci.common.utils.StringBufferImpl',
	    'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {
		processContainer: function(args) {
			var allElements = [];
			if(args.element != null) {
				var allElement = [];
				if (typeof args.element.getElementsByTagName == 'function') {
					allElement = args.element.getElementsByTagName("*");
				}

				allElements.push(args.element);
				for(var len=0; len<allElement.length; len++) {
					allElements.push(allElement[len]);
				}

				if(!this.utils.isEmptyObject(allElements)) {
					for(var i=0; i<allElements.length; i++)
					{
						if(allElements[i] != null)
						{
							var node = allElements[i];
							if(typeof node.getAttribute == 'function' 
								&& node.getAttribute('data-aria-type') != null ) {
								var event = node.getAttribute('data-aria-type');
								// process and add listener
								aria.utils.Event.addListener(node, event, {
									fn: this.clickFunction,
									scope: this,
									args: {
										isExternal: node.getAttribute('data-aria-external') != null && node.getAttribute('data-aria-external'),
										url: node.getAttribute('data-aria-action'),
										params: node.getAttribute('data-aria-params'),
										cb: args.cb,
										scope: args.scope
									}
								}, true);
							} else if (node.nodeName != null && node.nodeName.toLowerCase() == 'script') {
								if (node.parentNode) {
									node.parentNode.removeChild(node);
								}

								this.evaluateInnerScript({
									element: node
								});
							}
						}
					}
				}
			}
		},

		evaluateInnerScript: function(args) {
			if(args == null || args.element == null)
			{
				return;
			}
			var data = args.element.text || args.element.textContent || args.element.innerHTML || '';

			var script = document.createElement('script');
			script.type = 'text/javascript';
			try{
				script.appendChild(document.createTextNode(data));
			} catch(e) {
				script.text = data;
			}

			var head = document.getElementsByName('head')[0] || document.documentElement;
			head.insertBefore(script, head.firstChild);
			head.removeChild(script);
		},

		clickFunction : function(evt, args) {
			var isExternal = this.utils.booleanValue(args.isExternal);
			var url = args.url || '';
			var params = args.params;
			if(this.utils.booleanValue(isExternal)){
				window.location = url;
			}
			else{
				this.executeFunction(args);
			}
		},

		executeFunction: function(args) {
			var params = args.params || {};
			if(typeof (params) == 'string')
			{
				while (params.indexOf("'") != -1) {
					params = params.replace("'", "\"");
				}
				params = JSON.parse(params);
			}
			args.params = params;
			var action = args.url || "";

			if(!this.utils.isEmptyObject(args.scope)){
				this.$callback({ 
					fn: args.cb,
					scope: args.scope,
					args: args
				});
			}else{
				this.$callback(args.cb,args);
			}
			
		}
	}
});
