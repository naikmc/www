Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciMsgLibScript',
	$constructor: function() {

	},

	$prototype: {
		getMessage: function(message) {
			if (message.TEXT != null && message.TEXT != '') {
				if (message.NUMBER != null && message.NUMBER != "" && message.TEXT.indexOf(message.NUMBER) == -1) {
					return message.TEXT + " (" + message.NUMBER + ")";
				}
				return message.TEXT;
			} else if (message.TEST != null) {
				if (message.TEST.localizedMessage != null) {
					return message.TEST.localizedMessage;
				} else {
					return message.TEST;
				}
			} else if (message.message != null) {
				var msg = message.message;
				if (message.number != null && message.number != "") {
					msg += ' (' + message.number + ')';
				}

				return msg;
			}
		},

		getMessages: function(messages) {
			var msgList = [];
			for (var i = 0; i < messages.length; i++) {
				var message = this.getMessage(messages[i]);
				if (message != null && message != '') {
					msgList.push(message);
				}
			}

			return msgList;
		}
	}
});