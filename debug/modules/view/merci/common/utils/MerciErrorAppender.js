Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciErrorAppender',
	$extends: 'aria.core.log.DefaultAppender',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function(url, minInterval, minLogNb) {
		this.urlMgr = modules.view.merci.common.utils.URLManager;
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},
	$prototype: {
		
		/**
		 * intercepts any error logged in UI and log it in server
		 * @param className
		 * @param msg
		 * @param msgText
		 * @param e
		 */
		error: function(className, msg, msgText, e) {
			
			// create error
			if(this.utils.isEmptyObject(e)){
				e='E';
			}	
			var errorObj = {
				msg: msg,
				stack: null,
				type: e,
				file: className
			};
			
			
			this.urlMgr.makeServerRequest({
				action: 'MAriaLogMessage.action',
				appendSession: false,
				defaultParams: true,
				method: 'POST',
				parameters: 'MSG_INFO=' + JSON.stringify(errorObj),
				cb: {
					fn: this._onErrorLogged,
					scope: this,
					args: JSON.stringify(errorObj)
				}
			}, false);
			
			console.error(msg);
		},
		
		/**
		 * callback function when error is logged successfully on server
		 * @param response
		 * @param args
		 */
		_onErrorLogged: function(response, args) {
			console.log("error logged");
			if(this.utils.isEmptyObject(response)){
				this._onOffline(response,args);
		
			}
			else{
				if(!this.utils.isEmptyObject(this.utils.getItemFromWebStorage('errorArray'))){
					this._logStored();
				}
			}
		},
		
		/**
		 * intercepts any debug logged in UI
		 * @param className
		 * @param msg
		 * @param msgText
		 * @param e
		 */
		 

		 _onOffline: function(response, args){
			if(this.utils.isEmptyObject(this.utils.getItemFromWebStorage('errorArray'))){
					var errArr = args;
				}
				else{
					var errArr= this.utils.getItemFromWebStorage('errorArray');
					errArr = errArr+'#$%'+args;
				}
				
				this.utils.setItemInWebStorage('errorArray', errArr);
		},

			_logStored: function(){		
				var errArr = this.utils.getItemFromWebStorage('errorArray');
				errArr= errArr.split('#$%');
				this.utils.setItemInWebStorage('errorArray', '');
				for(var i=0; i < errArr.length; i++){
						if(!this.utils.isEmptyObject(errArr[i])){
							var errJson= JSON.parse(errArr[i]);
							this.error(errJson.file, null, errJson.msg, errJson.type);
						}
					}

				
				},

		debug: function(className, msg, msgText, e) {
			console.debug(msgText);
		},
		
		/**
		 * intercepts any info logged in UI
		 * @param className
		 * @param msg
		 * @param msgText
		 * @param e
		 */
		info: function(className, msg, msgText, e) {
			console.info(msgText);
		},
		
		/**
		 * intercepts any warning logged in UI
		 * @param className
		 * @param msg
		 * @param msgText
		 * @param e
		 */
		warn: function(className, msg, msgText, e) {
			console.warn(msgText);
		}
	}
});