Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.MerciGoogleMaps',
	$singleton: true,
	$dependencies: ['aria.utils.ScriptLoader'],
	$constructor: function() {
		this.map = null;
		this.loaded = false, this.attempt = 0;
		this.markers = [], this.infowindowsArray = [];;
	},
	$prototype: {
		/**
			Asynchronously loads google map. Done for performance improvement. CR8181598
		**/
		loadGoogleMaps: function() {
			if (typeof google === 'undefined' || !google.maps) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
					'callback=modules.view.merci.common.utils.MerciGoogleMaps.loadInfoBox';
				document.body.appendChild(script);
			}
		},

		/**
			Asynchronously loads InfoBox.js. Done for performance improvement. CR8181598
		**/
		loadInfoBox: function() {
			if (typeof InfoBox === 'undefined') {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var infoBoxFile = bp[0] + "://" + bp[1] + ":" + bp[2] + bp[10] + "/default/" + bp[9] + "/static/merciAT/dealsoffers/infoBox.js";
				aria.utils.ScriptLoader.load([infoBoxFile], modules.view.merci.common.utils.MerciGoogleMaps.loadCallback);
			}
		},

		loadCallback: function() {
			modules.view.merci.common.utils.MerciGoogleMaps.loaded = true;
		},

		initMap: function() {
			if (this.defaultLocation) {
				if (this.defaultLocation.lat && this.defaultLocation.lngt) {
					this.createMap({
						lat: this.defaultLocation.lat,
						lngt: this.defaultLocation.lngt
					});
				} else if (this.defaultLocation.name) {
					this.geoCode(this.defaultLocation.name, this.createMap);
				}
			} else {
				this.geoCode('Singapore', this.createMap);
			}
		},

		geoCode: function(placeName, callback) {
			var geocoder;
			geocoder = new google.maps.Geocoder();
			var address = placeName;
			var that = this;
			geocoder.geocode({
				'address': address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
					window.setTimeout(function() {
						that.geoCode.call(null, [placeName, callback]);
					}, 1000);
				}
				if (status == google.maps.GeocoderStatus.OK) {
					var temp = results[0].geometry.location + "";
					var locArr = temp.split(',');
					var lat = (locArr[0].substr(1));
					var lngt = (locArr[1].substr(1, (locArr[1].length - 2)));
					callback.call({
						lat: lat,
						lngt: lngt
					});
				}
			});
		},

		createMap: function(latlngt) {
			var myPlace = new google.maps.LatLng(latlngt.lat, latlngt.lngt);
			this.map = new google.maps.Map(document.getElementById("map"), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: myPlace,
				zoom: 3,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT
				}
			});
			this.callback.call(this.map);
		},

		addMarker: function(latlngt) {
			var loc = new google.maps.LatLng(latlngt.lat, latlngt.lngt);
			var marker = new google.maps.Marker({
				map: this.map,
				position: loc
			});
			this.markers.push(marker);
			return marker;
		},

		addInfobox: function(marker, options) {
			var infobox = new InfoBox(options);
			infobox.open(this.map, marker);
			this.infowindowsArray.push(infobox);
			return infobox;
		},

		attachMarkerListener: function(obj, callback) {
			if (obj instanceof google.maps.Marker) {
				google.maps.event.addListener(obj, "click", function() {
					callback.call();
				});
			}
		},

		clearOverlays: function() {
			for (var i in this.markers) {
				this.markers[i].setMap(null);
			}
			if (this.infowindowsArray) {
				for (var i in this.infowindowsArray) {
					this.infowindowsArray[i].setMap(null);
				}
			}
		},

		initialize: function(defaultLocation, callback) {
			this.clearOverlays();
			this.initialized = true;
			this.defaultLocation = defaultLocation;
			this.callback = callback;
			this.checkLoadingStatus();
		},

		checkLoadingStatus: function() {
			var self = modules.view.merci.common.utils.MerciGoogleMaps;
			if (!self.loaded && self.attempt < 5) {
				self.attempt++;
				window.setTimeout(self.checkLoadingStatus, 100);
			} else {
				self.initMap();
			}
		}

	}
});