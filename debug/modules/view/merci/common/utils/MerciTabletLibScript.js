Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciTabletLibScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {
		closePopUpTpl: function(AT, args) {
			if (args.ID == ".panel.addTrip.tablet.selected" && document.querySelector(".panel.list.tripList.tablet") != null && document.getElementById("tripList") && document.getElementById("getTrip") && document.getElementById("tripList").style.display == "none") {
				document.getElementById("getTrip").style.display = "none";
				document.getElementById("tripList").removeAttribute("style");
				this.moduleCtrl.fromTripList = false;
			} else {
				this.utils.hideMskOverlay();
				$('nav.navigation.tablet a').removeClass("selected");
				this.utils.toggleClass(document.querySelector(args.ID), "show");
				if (args.ID == ".flightStatus.tablet") {
					this.utils.removeClass(document.querySelector(".flightInfo.tablet"), "show");
				}
				if (args.ID == ".fareCondTablet.tablet") {
					this.utils.toggleClass(document.querySelector(".booking.sear.tablet.deals"), "show");
				}
			}
		}
	}
});