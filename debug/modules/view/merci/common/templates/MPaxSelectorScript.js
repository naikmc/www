Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.common.templates.MPaxSelectorScript",
    $dependencies: [
        'modules.view.merci.common.utils.MCommonScript'
    ],

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
    },

    $prototype: {

        $dataReady: function() {
			this.selection = {
				"nextId": '',
				"previousId": '',
				"currentId": ''
			};
        },

		$displayReady: function() {

				 var sendData = {};
					sendData.scrollId = this.$getId('pax_dynaScroller');
					sendData.id = 'pax_dynaScroller';
					sendData.olScroll = 'pax_olScroll';
					sendData.liScroll = 'pax_liScroll_';
					sendData.length = this.data.passengers.length;
  				this.utils.setScroll(sendData);
		},

		previousPax: function(evt) {
			this.myscroll.scrollToPage('prev', 0);
			var setCrumb = {};
			setCrumb.id="pax_dynaScroller";
			setCrumb.count=this.myscroll.currPageX;
			this.utils.shiftCrumb(setCrumb);
		},

		nextPax: function(evt) {
			if(this.selection.nextId!=""){
			this.myscroll.scrollToPage('next', 0);
			var setCrumb = {};
			setCrumb.id="pax_dynaScroller";
			setCrumb.count=this.myscroll.currPageX;
			this.utils.shiftCrumb(setCrumb);
			}
		},


		$viewReady: function() {
			var that = this;
			setTimeout(function() {
					/* Fix for PTR 08277496 : Incorrect display of passenger info at seat selection - START */
					var pxs = that.data.passengers;
					var scrollerWidth = 100 * pxs.length;
					var liWidth = Math.round(1000 / pxs.length) / 10;

					document.getElementById("pax_olScroll").style.width = scrollerWidth.toString() + "%";
				for (var pax in pxs) {
						document.getElementById("pax_liScroll_" + pax).style.width = liWidth.toString() + "%";
					}
					/* Fix for PTR 08277496 - END */

					 that.myscroll = new iScroll(that.$getId('pax_dynaScroller'), {
						 snap: true,
					hScrollbar: false,
						 vScrollbar: false,
						 vScroll: false,
						 checkDOMChanges: true,
					momentum: false,
						 onScrollEnd: function() {
							var paxIndex = this.currPageX;
						that.$callback({
							fn: that.selectPax,
							scope: that
						}, paxIndex);
						 }
					});
					that.myscroll.scrollToPage((that.data.selectedPaxIndex), 0);
				}, 10);
		},

		selectPax: function(paxIndex) {
			if(this.data){
			var paxes = this.data.passengers;
			if ((paxIndex < paxes.length) && (paxIndex >= 0)) {
				if (paxIndex + 1 < paxes.length) {
					this.selection.nextId = paxIndex + 1;
				 } else {
					 this.selection.nextId = '';
					}
				 if (paxIndex > 0) {
					this.selection.previousId = paxIndex - 1;
				 } else {
					 this.selection.previousId = '';
				 }
				/* this.$json.setValue(this.selection, 'currentId', paxIndex); */
				var binding = this.data.selectBinding;
				if (binding) {
					this.$json.setValue(binding.inside, binding.to, paxes[paxIndex]);
				}
				var cb = this.data.selectCallBack;
				if (cb) {
					 this.$callback(cb, paxIndex);
				}
			 }
			}

		},
		isRTLLanguage:function(){
			return this.utils.isRTLLanguage();
		}
     }
});