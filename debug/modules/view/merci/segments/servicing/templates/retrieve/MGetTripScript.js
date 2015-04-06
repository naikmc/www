Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MGetTripScript",
    $dependencies: [
        'aria.utils.Json',
        'modules.view.merci.common.utils.MCommonScript',
        'modules.view.merci.common.utils.MerciGA'
    ],

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;      
        this.__ga = modules.view.merci.common.utils.MerciGA;
        pageObjgetTrip = this;
    },

    $statics: {
        RECLOC_SIZE: 6,
        RECLOC_MAXSIZE: 12,
        TICKET_MAXSIZE: 13
    },

    $prototype: {

        $dataReady: function() {
            var base = modules.view.merci.common.utils.URLManager.getBaseParams();

            if (this.utils.isRequestFromApps() == true) {
                var jsonMTrip = this.moduleCtrl.getModuleData();
                if (jsonMTrip.navigation == true) {
                    if (jsonMTrip.TripData != null || jsonMTrip.TripData != undefined) {

                        this.jsonObj = JSON.parse(jsonMTrip.TripData);

                        if ((!this.utils.isEmptyObject(this.jsonObj)) && (this.jsonObj != null)) {

                            this.config = this.jsonObj.config;
                            this.labels = this.jsonObj.labels;
                            this.request = this.jsonObj.request;
                            this.reply = this.jsonObj.reply;
                            this.storage = true;
                        }
                    } else {
                        this.model = this.moduleCtrl.getModuleData().MGetTrip;
                        this.config = this.model.config;
                        this.labels = this.model.labels;
                        this.request = this.model.request;
                        this.reply = this.model.reply;
                        this.storage = false;

                    }
                } else {
                    this.model = this.moduleCtrl.getModuleData().MGetTrip;
                    this.config = this.model.config;
                    this.labels = this.model.labels;
                    this.request = this.model.request;
                    this.reply = this.model.reply;
                    this.storage = false;
                };
            } else {
                this.model = this.moduleCtrl.getModuleData().MGetTrip;
                this.config = this.model.config;
                this.labels = this.model.labels;
                this.request = this.model.request;
                this.reply = this.model.reply;
                this.storage = false;
            };

            this.data.inputErrors = {};
            this.data.messages = this.utils.readBEErrors(this.reply.errors);
            if (!this.utils.isEmptyObject(this.request.LAST_NAME)) {
                this.data.defaultLastName = this.request.LAST_NAME;
            } else {
                if (pageObjgetTrip.utils.isRequestFromApps() == true) {
                    pageObjgetTrip.data.defaultLastName=jsonResponse.lastName;
                    pageObjgetTrip.utils.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function(result) {
                        if (result && result != "") {
                            if (typeof result === 'string') {
                                pageObjgetTrip.getData = JSON.parse(result);
                            } else {
                                pageObjgetTrip.getData = result;
                            };
                            if (pageObjgetTrip.getData != undefined && !pageObjgetTrip.utils.isEmptyObject(pageObjgetTrip.getData)) {
                                if (pageObjgetTrip.getData.jsonData != undefined && !pageObjgetTrip.utils.isEmptyObject(pageObjgetTrip.getData.jsonData)) {
                                    pageObjgetTrip.data.defaultLastName = pageObjgetTrip.getData.jsonData["lName"];

                                } else {
                                    pageObjgetTrip.data.defaultLastName = '';
                                };
                            } else {
                                pageObjgetTrip.data.defaultLastName = '';
                            };
                        };
                    });
                } else {
                    pageObjgetTrip.data.defaultLastName = '';
                }
            }

            this.data.inputName = 'REC_LOC';
            this.data.showOnlyRefInput = false;
            this.data.reclocInputSize = this.getReclocInputSize();

            // google analytics
            this.__ga.trackPage({
                domain: this.config.siteGADomain,
                account: this.config.siteGAAccount,
                gaEnabled: this.config.siteGAEnable,
                page: 'ATC 1-Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                    '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11],
                GTMPage: 'ATC 1-Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                    '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11]
            });
            
            var pnrType = "";
            if (this.request.cancelOnHold != null && this.request.cancelOnHold == 'TRUE') {
                pnrType = "Pay Later Canceled PNR";
                action = this.request.recLoc != null ? this.request.recLoc : "NO PNR";
                this.__ga.trackEvent({
                    domain: this.config.siteGADomain,
                    account: this.config.siteGAAccount,
                    gaEnabled: this.config.siteGAEnable,
                    category: pnrType,
                    action: action,
                    label: "",
                    value: 1,
                    requireTrackPage: true,
                    noninteraction: ''
                });

            }
            // remove CSS class from body
            this.utils.updateBodyClass('');
        },

        $viewReady: function() {
            $('body').attr('id', 'getTrip');
            var header = this.moduleCtrl.getModuleData().headerInfo;

            if (this.utils.booleanValue(this.config.enableLoyalty) == true && this.utils.booleanValue(this.request.IS_USER_LOGGED_IN) == true) {
                var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
                var loyaltyInfoJson = {
                    loyaltyLabels: this.labels.loyaltyLabels,
                    airline: bp[16],
                    miles: bp[17],
                    tier: bp[18],
                    title: bp[19],
                    firstName: bp[20],
                    lastName: bp[21],
                    programmeNo: bp[22]
                };
            }

            this.moduleCtrl.setHeaderInfo({
                title: header.title,
                bannerHtmlL: header.bannerHtml,
                homePageURL: header.homeURL,
                showButton: true,
                companyName: this.config.sitePLCompanyName,
                loyaltyInfoBanner: loyaltyInfoJson
            });
                
            var id = document.getElementById("onHoldCancelStatus");
            if (id != null && this.request.cancelOnHold == 'TRUE') {
                id.style.display == 'block'
            }
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MGetTrip",
						data:this.data
					});
			}
        },

        /**
         * Determines the max size of recloc input based on config
         */
        getReclocInputSize: function() {
            var size = this.RECLOC_SIZE;
            if (this.utils.booleanValue(this.config.limitRecLength)) {
                size = this.RECLOC_MAXSIZE;
            }
            return size;
        },

        /**
         * Event handler when the user changes the reference type (recloc / tkt)
         */
        changeRefType: function(evt) {

            var refType = evt.target.getValue();
            var recEL = document.getElementById('recLocator');

            if (refType === 'BOOKINGREF') {
                this.data.inputName = 'REC_LOC';
                aria.utils.Json.setValue(this.data, 'reclocInputSize', this.getReclocInputSize());
                aria.utils.Json.setValue(this.data, 'showOnlyRefInput', false);
            } else {
                this.data.inputName = 'TICKET_NUMBER';
                aria.utils.Json.setValue(this.data, 'reclocInputSize', this.TICKET_MAXSIZE);
                aria.utils.Json.setValue(this.data, 'showOnlyRefInput', true);
            }
        },

        /**
         * Event handler when user clicks on 'Get trip'
         */
        getTrip: function(evt) {
            this.utils.scrollUp();
            var id = document.getElementById("onHoldCancelStatus");
            if (id != null && (id.style.display == 'block' || id.style.display == "")) {
                id.style.display == 'none';
            }
            evt.preventDefault(true);
            var e = document.getElementById("REC_LOC_TYPE");
            var recLocType = e.options[e.selectedIndex].value;
            var refValue = document.getElementById('recLocator').value;
            /* PTR 07685302 */
            refValue = refValue.toUpperCase();
            var passengerName = document.getElementById("DIRECT_RETRIEVE_LASTNAME").value;
            if (recLocType === "TICKET") {
                if (passengerName == "") {
                    this.__displayError(2130018, "DIRECT_RETRIEVE_LASTNAME");
                } else if (refValue == "") {
                    this.__displayError(2130405, 'recLocator');
                } else {
                    var airlineCode = refValue.substring(0, 3);
                    var ticketNumber = refValue.substring(3, refValue.length);
                    document.getElementById('AIRLINE_CODE').value = airlineCode;
                    document.getElementById('TICKET_CODE').value = ticketNumber;
                    this.__submitForm();
                }
            } else {
                if (passengerName == "") {
                    this.__displayError(2130018, "DIRECT_RETRIEVE_LASTNAME");
                } else if (refValue == "") {
                    this.__displayError(2130017, 'recLocator');
                } else {
                    passengerName = passengerName.replace("'", " ");
                    document.getElementById("DIRECT_RETRIEVE_LASTNAME").value = passengerName;
                    this.__submitForm();
                }
            }
        },

        /**
         * Submits the PNR retrieve form
         */
        __submitForm: function() {
            if (this.utils.isRequestFromApps() == true) {
                if (document.getElementById("chkBox") && document.getElementById("chkBox") != null && document.getElementById("chkBox") != undefined && document.getElementById("chkBox").checked) {
                    var pageObjgetTrip = this;
                    this.utils.getStoredItemFromDevice(merciAppData.DB_SETTINGS, function(result) {
                        if (result && result != "") {
                            if(typeof result ==='string'){
                                pageObjgetTrip.getData = JSON.parse(result);
                            }else{
                                pageObjgetTrip.getData = (result);
                            }
                            if (pageObjgetTrip.getData != undefined && !pageObjgetTrip.utils.isEmptyObject(pageObjgetTrip.getData)) {
                                if (pageObjgetTrip.getData.jsonData != undefined && !pageObjgetTrip.utils.isEmptyObject(pageObjgetTrip.getData.jsonData)) {
                                    pageObjgetTrip.getData.jsonData["lName"] = document.getElementById("DIRECT_RETRIEVE_LASTNAME").value;
                                    pageObjgetTrip.utils.storeLocalInDevice(merciAppData.DB_SETTINGS, pageObjgetTrip.getData, "overwrite", "json");
                                } else {
                                    pageObjgetTrip.getData.jsonData = {};
                                    pageObjgetTrip.getData.jsonData["lName"] = document.getElementById("DIRECT_RETRIEVE_LASTNAME").value;
                                    pageObjgetTrip.utils.storeLocalInDevice(merciAppData.DB_SETTINGS, pageObjgetTrip.getData, "overwrite", "json");
                                };
                            };
                        };
                    });
                };
                var jsonMTrip = this.moduleCtrl.getModuleData();
                jsonMTrip.flowFromTrip = "newTrips";
            };

            var request = {
                formObj: document.getElementById("MGetTripForm"),
                action: 'MPNRValidate.action',
                method: 'POST',
                loading: true,
                expectedResponseType: 'json',
                cb: {
                    fn: this.__onGetTripCallback,
                    scope: this
                }
            };

            modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
        },

        __onGetTripCallback: function(response, args) {
            var json = this.moduleCtrl.getModuleData();
            var nextPage = response.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
            if (response.responseJSON.data != null && response.responseJSON.data != null && dataId != 'MPNRTRIPS_A') {

                // changing implementation for last name storage
                if (document.getElementById('chkBox') && document.getElementById('chkBox').checked) {
                    localStorage.setItem('LAST_NAME', document.getElementById("DIRECT_RETRIEVE_LASTNAME").value);
                }

                // set data
                for (var key in response.responseJSON.data) {
                    if (response.responseJSON.data.hasOwnProperty(key)) {
                        json[key] = response.responseJSON.data[key];
                    }
                }

                // navigate to next page
                this.moduleCtrl.navigate(null, nextPage);
            } else {
                var reply = response.responseJSON.data.MGetTrip.reply;
                if (reply.errors != null) {
                    this.utils.hideMskOverlay();
                    this.data.messages = this.utils.readBEErrors(reply.errors);
                    this.$refresh({
                        section: "messages"
                    });
                }
            }
        },

        /**
         * Displays the given error (overwriting currently displayed errors)
         */
        __displayError: function(err, inputId) {
            var strerr = String(err);
            var error = this.utils.convertErrorFromBean(this.labels.uiErrors[strerr]);
            if (this.data.messages.errors) {
                aria.utils.Json.setValue(this.data.messages.errors, 'list', [error]);
            } else {
                aria.utils.Json.setValue(this.data.messages, 'errors', {
                    list: [error]
                });
            }

            // error indicator for Tablet. PTR : 08146802
            aria.utils.Json.setValue(this.data, 'error_occured', !this.data.error_occured);

            if (typeof GAError != 'undefined') {
                GAError(strerr + '(E)', 'ATC 1-Search');
            }
            if (inputId) {
                aria.utils.Json.setValue(this.data.inputErrors, inputId, true);
            }
        }

    }
});