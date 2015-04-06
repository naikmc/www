var merciAppData = {
    homeUrl: "http://test61.dev.amadeus.net/plnext/SQMobileBooking/MWelcome.action?LANGUAGE=GB&SITE=SQSQBOOK&MT=A&COUNTRY_SITE=SG&NO_MENU_BUTTONS=TRUE",
    merci: "application",	
    settings: {
        custom: {
            allowCustomNavBar: false,
            allowCustomPackages: false,
            customNavBarPath: 'modules.custom.ui.segments.home.templates.MMenuItems',
            allowCustomSubmit: true
        },
        isTabletEnabled: false
    },


    //Camera Configuration
    STORE_IMG_DATA: false,
    STORE_IMG_URI: true,
    STORE_IMG_KEY: "_photos",

    //Data Store Constants
    DBNAME: "merciDB",
    DBTABLE: "merciTable",
    DBVERSION: "1",
    DB_HOME: "DB_HOME",
    DB_BACKGROUND:"DB_BACKGROUND",
    DB_USEBACKGROUND:"DB_USEBACKGROUND",
    DB_CONTACTDETAILS: "DB_CONTACTDETAILS",
    DATA_AWARDMILEBKMRK_KEY: "AWARDMILEBKMRK",
    DATA_AWARDMILEDATA_KEY: "AWARDMILEDATA",

    NETWORK_ERROR: "NETWORK ERROR! Please check your internet connection.",
    WELCOME_NOTE: "Welcome!",
    COPYRIGHT_YEAR: "All rights reserved 2014",
    FORCE_UPGRADE_MSG: "The latest version of the app consists of some important fixes. Please update to the latest version or the app may not work as expected.",
    UPGRADE_BUTTON_TEXT: "Upgrade",
    IGNORE_BUTTON_TEXT: "Ignore",
    REMINDMELATER_BUTTON_TEXT:"Remind Me Later"
};


var appLaunch = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        appLaunch.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};