Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MiniruleScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.myScroll = null;
		this.myScroll2 = null;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$destructor: function() {
		if (this.myScroll != null) {
			this.myScroll.destroy();
		}
		if (this.myScroll2 != null) {
			this.myScroll2.destroy();
		}
		this.myScroll = null;
		this.myScroll2 = null;
	},

	$prototype: {
		$displayReady: function() {
			this.moduleCtrl.setHeaderInfo({
				title: this.data.labels.tx_merci_text_minirule_header,
				bannerHtmlL: '',
				homePageURL: this.data.siteParam.siteHomeURL,
				showButton: true
			});
		},
		$dataReady: function() {
			if (this.moduleCtrl.getModuleData().booking == null || this.moduleCtrl.getModuleData().booking.MMiniRule_A == null) {
				this.moduleCtrl.navigate(null, 'merci-book-MError_A');
			} else {
				this.ruleData = this.moduleCtrl.getModuleData().booking.MMiniRule_A.miniRulesData;
				this.data = this.moduleCtrl.getModuleData().booking.MFARE_A;
			}
		},
		$viewReady: function() {
			$('.container').wrap("<div id = 'minirule_outer_wrapper'><div id = 'page_outer_Scroller'></div></div>");
			var _this = this;
			this.setWidth(_this);
			window.onresize = function() {
				_this.setWidth(_this);
			};

			setTimeout(function() {
				_this.myScroll = new iScroll(_this.$getId('wrapper'), {
					snap: true,
					momentum: false,
					hScrollbar: false,
					checkDOMChanges: true,
					onScrollEnd: function() {
						//Adding Nav indicator
						var activeEl = document.querySelector('#nav > div.active');
						if (activeEl != null) {
							activeEl.className = 'navitem ';
						}

						var navitems = document.getElementsByClassName("navitem");
						var p = this.currPageX;

						var nextEl = navitems[p];
						if (nextEl != null) {
							nextEl.className = 'navitem active';
						}

						//Adding nav buttons
						if (this.currPageX == 0) {
							_this.$getElementById('prev1').classList.add('disabled');
						} else {
							_this.$getElementById('prev1').classList.remove('disabled');
						}
						if (this.currPageX == this.pagesX.length - 1) {
							_this.$getElementById('next1').classList.add('disabled');
						} else {
							_this.$getElementById('next1').classList.remove('disabled');
						}
					},
					onRefresh: function() {
						_this.$getElementById('prev1').classList.add('disabled');
						var scroller = document.getElementById(_this.$getId('scroller'));
						var styles = scroller.parentNode.currentStyle || window.getComputedStyle(scroller.parentNode, null);
						parentWidth = styles['width'];
						this.wrapperW = parseInt(parentWidth);
						//Adding nav buttons
						if (this.currPageX == 0) {
							_this.$getElementById('prev1').classList.add('disabled');
						} else {
							_this.$getElementById('prev1').classList.remove('disabled');
						}
						if (this.currPageX == this.pagesX.length - 1) {
							_this.$getElementById('next1').classList.add('disabled');
						} else {
							_this.$getElementById('next1').classList.remove('disabled');
						}
					}
				});
			}, 100);


			_this.myScroll2.destroy();
			_this.myScroll2 = new iScroll('minirule_outer_wrapper', {
				bounce: false
			});

			div = $('.popup.facs').detach();
			$(div).insertAfter($('#minirule_outer_wrapper'));
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && (bp[14].toLowerCase() == 'iphone' || bp[14].toLowerCase() == 'android')) {
				this.__merciFunc.appCallBack(this.data.siteParam.siteAppCallback,
					"://?flow=booking/pageload=merci-book-MMiniRule_A");
			}
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"Minirule",
						data:this.data
					});
			}
		},
		navigate: function(evt, opt) {
			this.myScroll.scrollToPage(opt.link, 0);
		},
		setWidth: function(_this) {
			_this.myScroll2 = new iScroll('minirule_outer_wrapper', {
				bounce: false
			});
			var scroller = document.getElementById(_this.$getId('scroller'));
			var styles = scroller.parentNode.currentStyle || window.getComputedStyle(scroller.parentNode, null);
			var parentWidth = null;
			if (styles != null) {
				parentWidth = parseInt(styles['width']);
			} else {
				return null;
			}
			var els = document.getElementsByClassName('lists');
			var l = els.length;
			scroller.style.width = ((parentWidth * l)) + "px";
			var iscrollObj = null
			if (_this.myScroll) {
				iscrollObj = _this.myScroll;
			} else if (this.myScroll) {
				iscrollObj = this.myScroll;
			}
			for (var i = 0; i < l; i++) {
				var o = els[i];
				o.style.width = (parentWidth) + "px";
				if (iscrollObj) {
					iscrollObj.pagesX[i] = 0 - parentWidth * i;
				}
			}
			if (iscrollObj) {
				iscrollObj.scrollTo((0 - (parentWidth * iscrollObj.currPageX)), null, 200);
				setTimeout(function() {
					iscrollObj.refresh()
				}, 400);
			}
		},
		showHide: function(evt, args) {
			if (this.$json.getValue(args.itr, "show") == "open") {
				this.$json.setValue(args.itr, "show", "close");
			} else {
				this.$json.setValue(args.itr, "show", "open");
			}
			this.myScroll2.destroy();
			this.setWidth(this);
		},
		openFareCondition: function() {

			$('#testMsk').show();

			// showing all the popup with class as 'popup and facs'
			var popups = document.getElementsByClassName('popup facs');
			for (var i = 0; i < popups.length; i++) {
				popups[i].style.display = 'block';
			}
		}
	}
});