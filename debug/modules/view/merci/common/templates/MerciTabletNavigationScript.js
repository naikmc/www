Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.templates.MerciTabletNavigationScript',
	$constructor: function() {

	},

	$prototype: {

		showBooking: function() {
			$(".booking.sear.tablet").toggleClass("show");
			var overlays = document.getElementsByClassName('overlayTablet');
			for (var i = 0; i < overlays.length; i++) {
				if (overlays[i].style.display == 'none') {
					overlays[i].style.display = 'block';
				} else {
					overlays[i].style.display = 'none';
				}
			}

			$(".navigation.tablet .navigation.book-flight.tabletBut").toggleClass("selected");
			$(".navigation.tablet .navigation.home-link.selected").removeClass("selected");
		},

		navigateBooking: function() {
			// Booking Search page tpl
			this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
		},

		navigateHome: function() {
			// for time being we consider search page as home
			// ideally it should point to merci-MIndex_A
			this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
		}

	}
});