Aria.classDefinition({
	$classpath: 'modules.view.merci.segments.servicing.controller.StaticLocalStorageCtrl',
	$extends: 'modules.view.merci.segments.servicing.controller.MerciServicingCtrl',
	$implements: ['modules.view.merci.segments.servicing.controller.IStaticLocalStorageCtrl'],
	$dependencies: ['aria.utils.HashManager', 'modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript'],
	$constructor: function(args) {
		this.$ModuleCtrl.constructor.call(this);
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.data = {};
	},
	$prototype: {
		$publicInterfaceName: 'modules.view.merci.segments.servicing.controller.IStaticLocalStorageCtrl',
		init: function(args, initReadyCb) {

			// initialization
			if (this.data == null) {
				this.data = {};
			}

			// if data default available
			if (jsonResponse != null && jsonResponse.data != null) {
				this.data = jsonResponse.data;
			}

			// if data default available
			if (jsonResponse != null) {
				this.localStorage = jsonResponse.localStorage || {};
			}

			this.__header = {};
			this.__currConverter = {};
			this.$callback(initReadyCb);
		},

		getSettingData: function() {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_SETTINGS])){
				return this.localStorage[merciAppData.DB_SETTINGS];
			}else{
				return null;
			}
		},
		setSettingData: function(data) {
			this.localStorage[merciAppData.DB_SETTINGS] = data;
		},
		getFavouriteData: function() {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_MYFAVOURITE])){
				return this.localStorage[merciAppData.DB_MYFAVOURITE];
			}else{
				return null;
			}
		},
		setFavouriteData: function (data) {
			this.localStorage[merciAppData.DB_MYFAVOURITE] = data;
		},
		getMorePageData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_MORE])){
				return this.localStorage[merciAppData.DB_MORE];
			}else{
				return null;
			}
		},
		setMorePageData: function (data) {
			this.localStorage[merciAppData.DB_MORE] = data;
		},
		getIndexData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_HOME])){
				return this.localStorage[merciAppData.DB_HOME];
			}else{
				return null;
			}
		},
		setIndexData: function (data) {
			this.localStorage[merciAppData.DB_HOME] = data;
		},
		getContactUsData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_CONTACTUS])){
				return this.localStorage[merciAppData.DB_CONTACTUS];
			}else{
				return null;
			}
		},
		setContactUsData: function (data) {
			this.localStorage[merciAppData.DB_CONTACTUS] = data;
		},
		getMyTripsData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_GETTRIP])){
				return this.localStorage[merciAppData.DB_GETTRIP];
			}else{
				return null;
			}
		},
		setMyTripsData: function (data) {
			this.localStorage[merciAppData.DB_GETTRIP] = data;
		},
		getTripListData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_TRIPLIST])){
				return this.localStorage[merciAppData.DB_TRIPLIST];
			}else{
				return null;
			}
		},
		setTripListData: function (data) {
			this.localStorage[merciAppData.DB_TRIPLIST] = data;
		},

		convertAircraftNameToJSON: function(array) {
			var output = {};
			for (var i = 0; i < array.length; ++i) {
				output[array[i][0]] = array[i][1];
			}
			return output;
		},
		
		getFlightInfoData: function () {
			if (!this.utils.isEmptyObject(this.localStorage[merciAppData.DB_FLIGHTINFO])){
				return this.localStorage[merciAppData.DB_FLIGHTINFO];
			}else{
				return null;
			}
		},
		
		setFlightInfoData: function (data) {
			this.localStorage[merciAppData.DB_FLIGHTINFO] = data;
		}
	}
});