Aria.interfaceDefinition({
	$classpath: "modules.view.merci.segments.servicing.controller.IStaticLocalStorageCtrl",
	$extends: "modules.view.merci.segments.servicing.controller.IMerciServicingCtrl",
	$interface: {
		getSettingData: function() {},
		setSettingData: function(n) {},
		getFavouriteData: function() {},
		setFavouriteData: function (n) {},
		getMorePageData: function () {},
		setMorePageData: function (n) {},
		getIndexData: function () {},
		setIndexData: function (n) {},
		getContactUsData: function () {},
		setContactUsData: function (n) {},
		getMyTripsData: function () {},
		setMyTripsData: function (n) {},
		getTripListData: function () {},
		setTripListData: function (n) {},
		convertAircraftNameToJSON: function(array) {},
		getFlightInfoData: function () {},
		setFlightInfoData: function (n) {}
	}
});