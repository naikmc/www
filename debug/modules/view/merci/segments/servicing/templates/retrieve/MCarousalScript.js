Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MCarousalScript",
	$dependencies: [

	],

	$statics: {

	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		pageObjCarousal = this;
	},

	$prototype: {

		$dataReady: function() {
			pageObjCarousal.jsonPhotos = pageObjCarousal.moduleCtrl.getModuleData().tripphotos;
			if (pageObjCarousal.jsonPhotos != null && pageObjCarousal.jsonPhotos != undefined && pageObjCarousal.jsonPhotos != "") {
				pageObjCarousal.jsonPhotos = JSON.parse(pageObjCarousal.jsonPhotos);
			}
		},
		$viewReady: function() {
			if (pageObjCarousal.jsonPhotos != null && pageObjCarousal.jsonPhotos != undefined && pageObjCarousal.jsonPhotos != "") {
				var htmSlides = "";
				if(!pageObjBooking.labels){
					pageObjBooking = pageObjConf;
				}
				if (pageObjCarousal.jsonPhotos.trip != undefined) {
					var pnr = pageObjCarousal.jsonPhotos.trip;
					document.getElementById('tripPhotos').innerHTML = pageObjBooking.labels.carousal.tx_merci_trip_photo + " - " + pnr;

					var photos = pageObjCarousal.jsonPhotos.photos;

					var htmNav = "";
					var numberofphoto = photos.length;
					console.log("photos.length : " + photos.length);
					if (numberofphoto > 0) {
						for (var i = 0; i < numberofphoto; i++) {
							var photopath = photos[i].url;
							console.log("photopath : " + photopath);
							htmSlides = htmSlides + "<div class='touchslider-item' ><img src='" + photopath + "'></img></div>";
							htmNav = htmNav + "<a class='touchslider-nav-item'></a>";
						}
					} else {
						htmSlides = "<div><span>" + pageObjBooking.labels.carousal.tx_merciapps_msg_no_photo_added_description + "</span</div>";
					}
				} else {
					document.getElementById('tripPhotos').innerHTML = pageObjBooking.labels.carousal.tx_merci_trip_photo;
					htmSlides = "<div><span><br/>" + pageObjBooking.labels.carousal.tx_merciapps_msg_no_photo_added + "<br/>" + pageObjBooking.labels.carousal.tx_merciapps_msg_no_photo_added_description + "</span</div>";
				}
				jQuery(".trip-gallery").html(htmSlides);

			} else {
				document.getElementById('tripPhotos').innerHTML = pageObjBooking.labels.carousal.tx_merci_trip_photo;
				htmSlides = "<div><span><br/>" + pageObjBooking.labels.carousal.tx_merciapps_msg_no_photo_added + "<br/>" + pageObjBooking.labels.carousal.tx_merciapps_msg_no_photo_added_description + "</span</div>";
				jQuery(".trip-gallery").html(htmSlides);
			}

			pageObjCarousal.moduleCtrl.setHeaderInfo({
				title: pageObjBooking.labels.tx_merci_text_mybook_myflight,
				bannerHtmlL: pageObjBooking.request.bannerHtml,
				homePageURL: pageObjBooking.config.homeURL,
				showButton: true
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MCarousal",
						data:{}
					});
			}
		},

		$displayReady: function() {

		}
	}
});