Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.StringBufferImpl',
	$constructor: function(obj) {
		this.__str = new Array();
		if (obj != null) {
			// if value provided
			this.__str.push(obj);
		}
	},

	$prototype: {

		append: function(obj) {
			this.__str.push(obj);
			return this;
		},

		toString: function() {
			return this.__str.join('');
		},

		formatString: function(values) {

			var argSt = this.toString();
			for (var i = 0; i < values.length; i++) {
				var comparator = '{' + i + '}';
				if (argSt.indexOf(comparator) != -1) {
					argSt = argSt.replace(comparator, values[i]);
				}
			}

			return argSt;
		}
	}
});