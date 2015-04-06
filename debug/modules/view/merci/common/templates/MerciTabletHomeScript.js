Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MerciTabletHomeScript',
	$constructor: function() {

	},

	$prototype: {

		$displayReady: function() {
			$(".overlayTablet").hide();

			if (/iphone|ipod/i.test(navigator.userAgent) && !window.location.hash) {
				setTimeout(scroll, 1000);
			}

			// set iscroll for wrapper details
			if (document.getElementById('wrapperDeals') != null) {
				this.myScroll = new iScroll('wrapperDeals', {
					snap: 'li',
					momentum: false,
					hScrollbar: false,
					onScrollEnd: function() {
						document.querySelector('#listbox > li.active').className = '';
						document.querySelector('#listbox > li:nth-child(' + (this.currPageX + 1) + ')').className = 'active';

					}
				});
			}

			this.closePanel();
		},

		scroll: function() {
			if (!pageYOffset) window.scrollTo(0, 1);
		},

		closePanel: function() {
			$(".booking.sear.tablet").removeClass("show");
			$(".overlayTablet").hide();
			$(".navigation.tablet .navigation.home-link").toggleClass("selected");
			$(".navigation.tablet .navigation.book-flight.tabletBut").removeClass("selected");
		},

		overlayTabletClick: function() {
			$(".booking.sear.tablet").removeClass("show");
			$(".navigation.tablet .navigation.home-link").toggleClass("selected");
			$(".navigation.tablet .navigation.book-flight.tabletBut").removeClass("selected");
			$(".overlayTablet").hide();
		}
	}
});