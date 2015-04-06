Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.retrieve.MPassengerDetailsScript",
	$dependencies: [
		'aria.utils.Date',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],

	$statics: {
		FILTERED_ERRORS: ['8134', '14300', '14250']
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		pageObjPassenger = this;
    },

	$prototype: {

		$dataReady: function() {

			this.selectedPaxId = this.data.selectedPaxId;
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			if(!this.utils.isEmptyObject(this.moduleCtrl.getModuleData().MPassengerDetails)){
				var model = this.moduleCtrl.getModuleData().MPassengerDetails;
			}else
				var model = this.moduleCtrl.getModuleData().MPassengerDetailsBackup;
			this.config = model.config;
			this.labels = model.labels;
			this.request = model.request;
			this.reply = model.reply;
			this.tripplan = model.reply.tripPlan;
			if (!this.utils.isEmptyObject(this.reply.errors)) {
				var err = this.reply.errors;
				var arr = [];
				for (var key in err) {
					if (err.hasOwnProperty(key) && err[key] != null) {
						var error = {
							'TEXT': err[key]
						};
						arr.push(error);
					}
				}
				window.scrollTo(0, 0);
				this.data.messages = this.utils.readBEErrors(arr);
			}

			if (!this.utils.isEmptyObject(this.reply.reqAttribMsgs)) {
				var err = this.reply.reqAttribMsgs;
				var arr = [];
				for (var key in err) {
					if (err.hasOwnProperty(key) && err[key] != null) {
						if (this.labels != undefined && this.labels.uiErrors[err[key]] != undefined) {
							var error = this.utils.convertErrorFromBean(this.labels.uiErrors[err[key]]);
							arr.push(error);
						}
					}
				}
				window.scrollTo(0, 0);
				this.data.messages = this.utils.readBEErrors(arr);
			}
			this.__filterErrors();
			this.__initUIMessages();
			
			// google analytics
			this.__ga.trackPage({
				domain: this.config.siteGADomain,
				account: this.config.siteGAAccount,
				gaEnabled: this.config.siteGAEnable,
				page: 'Ser Traveller Info?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: 'Ser Traveller Info?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11]
			});
			
		},

		$viewReady: function() {
			$('body').attr('id', 'myTrips');
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
				title: this.labels.tx_merci_text_travdetl_travdetl,
				bannerHtmlL: this.reply.bannerHtml,
				homePageURL: this.config.homeURL,
				loyaltyInfoBanner: loyaltyInfoJson,
				showButton: true
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPassengerDetails",
						data:this.data
					});
			}
		},

		/**
		 * Assembles the name elements for display
		 */
		formatName: function(identity) {
			var fmtName;
			if (identity.titleName) {
				fmtName = identity.titleName + ' ';
			} else {
				fmtName = '';
			}
			fmtName += identity.firstName;
			if (identity.firstName.length > 20) {
				fmtName += identity.lastName;
			} else {
				fmtName += ' ' + identity.lastName;
			}
			return fmtName;
		},

		getDataForContactInfo: function() {
			var data = this.reply.forBothContactInfo;
			data.listTravellerBean = this.tripplan.listTravellerBean;
			return data;
		},

		getDataForContactInfoExtended: function() {
			var data = this.reply.forContactInfoExtended;
			data.listTravellerBean = this.tripplan.listTravellerBean;
			for (var dataField in this.reply.forBothContactInfo) {
				if (this.reply.forBothContactInfo.hasOwnProperty(dataField)) {
					data[dataField] = this.reply.forBothContactInfo[dataField];
				}
			}
			return data;
		},

		getDataForFQTV: function() {
			var data = this.reply.forFQTV;
			return data;
		},

		toggle: function(event, args) {
			this.utils.toggleExpand(event, args);
		},

		/**
         * Event handler when the users clicks on "Services' button
         */
        showServicesDetails: function(evt) {

        	if (!this.utils.isEmptyObject(this.getServicesBookmarkForRecLoc(this.request.REC_LOC))) {
				var bookmark = this.getServicesBookmarkForRecLoc(this.request.REC_LOC);
				var basket = JSON.stringify(bookmark.basket);
				var recordLoc = bookmark.REC_LOC;
				var lastName = bookmark.DIRECT_RETRIEVE_LASTNAME;
				var params = {
					BASKET_OF_SERVICES: basket,
					REC_LOC: recordLoc,
					DIRECT_RETRIEVE_LASTNAME: lastName,
					DIRECT_RETRIEVE: true,
					ACTION: "MODIFY",
					FROM_PAX: true
				};
				this.utils.sendNavigateRequest(params, 'MBookmarkServiceRetrieve.action', this);
			} else {
				var params = {
                finalValidationList:        this.request.finalValidationList,
                displayAlert:               this.request.displayAlert,
                DIRECT_RETRIEVE_LASTNAME:   this.request.DIRECT_RETRIEVE_LASTNAME,
                REC_LOC:                    this.request.REC_LOC,
                PAGE_TICKET:                this.reply.pageTicket
            };
            this.utils.sendNavigateRequest(params, 'MGetServiceCatalog.action', this);
			}
            
        },

        _formatPhoneNumber: function() {
            var country_element = "";
            var countryLen      = "";
            var countryName     = "";
            var countryCode     = "";
            var phone_number    = "";
            var areaCode      = "";
            var country = document.getElementById("COUNTRY").value;
			if (null != document.getElementById("AREA_CODE")) {
                areaCode = document.getElementById("AREA_CODE").value;
            }

            var phoneNumber = document.getElementById("PHONE_NUMBER").value;
            if (phoneNumber.indexOf("-") > 1) {
                var areaCodeSplitArray = phoneNumber.split("-");
                areaCode = areaCodeSplitArray[0];
                phoneNumber = areaCodeSplitArray[1];
            }
            if (phoneNumber.indexOf("/") > 1) {
                var areaCodeSplitArray = phoneNumber.split("/");
                areaCode = areaCodeSplitArray[0];
                phoneNumber = areaCodeSplitArray[1];
            }

            /* Only if country contains +, do a split to get country code. Else have only */
            /*  country name. Fix as part of PTR: 05717167  */
			var pattCode = /\(\+[0-9]+\)/i;
            if (pattCode.test(country)) {
                countryCode = country.match(pattCode);
            } else if (country.indexOf('+') === 0) {
                countryCode = country.substr(1);
            } else if (parseInt(country)) {
                countryCode = country;
            }

            if (phoneNumber.length > 0) {
                phone_number = phoneNumber;
                if (areaCode.length > 0) {
                    phone_number = areaCode + "-" + phone_number;
                }
                if (countryCode != undefined && countryCode != null && countryCode.length > 0) {
                    phone_number = countryCode + "-" + phone_number;
                }
            }

          /* Send hidden parameters based on selected preferred phone type. Fix as part of PTR: 05625982*/
          /* Fix to format validation conditions for various phones and country. PTR: 05691338 */
          var selectedPhoneType = document.getElementById("PREFERRED_PHONE_NO").value;
          this.setSelectedNumber(selectedPhoneType);
			if (selectedPhoneType === "H") {
				if (document.getElementById("CONTACT_POINT_HOME_PHONE"))
                document.getElementById("CONTACT_POINT_HOME_PHONE").value = phone_number;
                document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value      = "true,1023,false,0,false,117311,false,0,false,0,true,117311";
                document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value        = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
                document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value  = "false,1043,false,0,false,117312,false,0,false,0,false,0";
                document.getElementById("validationListForCOUNTRY").value                       = "true,1023,false,0,false,0,false,0,false,0,true,1023";
			} else if (selectedPhoneType === "M") {
				if (document.getElementById("CONTACT_POINT_MOBILE_1"))
                document.getElementById("CONTACT_POINT_MOBILE_1").value = phone_number;
                document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value        = "true,2130007,false,0,false,117311,false,0,false,0,true,117311";
                document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value      = "false,1023,false,0,false,0,false,0,false,0,false,0";
                document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value  = "false,1043,false,0,false,117312,false,0,false,0,false,0";
                document.getElementById("validationListForCOUNTRY").value                       = "true,2130007,false,0,false,0,false,0,false,0,true,2130007";
			} else if (selectedPhoneType === "O") {
				if (document.getElementById("CONTACT_POINT_BUSINESS_PHONE"))
                document.getElementById("CONTACT_POINT_BUSINESS_PHONE").value = phone_number;
                document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value  = "true,1043,false,0,false,117312,false,0,false,0,true,117311";
                document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value        = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
                document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value      = "false,1023,false,0,false,0,false,0,false,0,false,0";
                document.getElementById("validationListForCOUNTRY").value                       = "true,1043,false,0,false,0,false,0,false,0,true,1043";
            }
        },

		/**
		 * Event handler when the user clicks on 'Trip' button
		 */
		showTripDetails: function(evt) {
			this.__backToTrip('MPNRValidate.action');
		},

		onCancel: function(evt) {
			this.__backToTrip('MCancelAction.action');
		},

		__backToTrip: function(actionName) {
			var params = {
				DIRECT_RETRIEVE_LASTNAME: this.request.DIRECT_RETRIEVE_LASTNAME,
				IS_USER_LOGGED_IN: this.request.IS_USER_LOGGED_IN,
				REC_LOC: this.request.REC_LOC,
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				ACTION: "MODIFY",
				PAGE_TICKET: this.reply.pageTicket
			};

			this.utils.sendNavigateRequest(params, actionName, this);
		},
		onAPISSave: function(evt, args) {
			document.getElementById("apisComplete").style.display = 'none';
			var m_buttonTrav = document.createElement('input');
			m_buttonTrav.type = 'hidden';
			m_buttonTrav.name = 'buttonTraveller' + args.paxNum;
			m_buttonTrav.value = args.paxName;
			document.MAPForm.appendChild(m_buttonTrav);
			this.onSave();
		},

		onSave: function(evt) {
			this.data.messages = [];
			var proceed = this.__checkUIErrors();
			if (proceed) {
				var formElmt = document.getElementById(this.$getId("MAPForm"));
				if (formElmt != null) {
					/* PTR 06082225: Send hidden parameter when save is clicked so as to support exclusively for safari browser */
					var saveInput = document.createElement('input');
					saveInput.type = 'hidden';
					saveInput.id = 'buttonSave';
					saveInput.name = 'buttonSave';
					saveInput.value = 'Save';
					formElmt.appendChild(saveInput);
				}

				if (this.utils.booleanValue(this.config.showNewContactDisplay)) {
					this._formatPhoneNumber();
				}

				for (index = 1; index <= this.reply.tripPlan.listTravellerBean.travellers.length; index++) {
					if (document.getElementById('PREF_AIR_FREQ_NUMBER_' + index + '_1')) {
						if (this.utils.isEmptyObject(document.getElementById('PREF_AIR_FREQ_NUMBER_' + index + '_1').value)) {
							document.getElementsByName('PREF_AIR_FREQ_AIRLINE_' + index + '_1')[0].value = null;
						}
					}
				}
				this.utils.sendNavigateRequest(formElmt, 'MTravellerDetailSaveDispatcherRetrieve.action', this);
			} else {
				if (this.data.errors.length > 0) {
					window.scrollTo(0, 0);
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},

		savePaxDetailsSucess: function(response) {
			this.utils.hideMskOverlay();

			if(!this.utils.isEmptyObject(response.responseJSON.data.MPassengerDetails)){
			var json = this.moduleCtrl.getModuleData();
			json.MPassengerDetails = response.responseJSON.data.MPassengerDetails;
			this.$dataReady();
			this.$refresh();
			}
			
			else{
				var json = response.responseJSON;
				this.moduleCtrl.navigate(null, json.homePageId);
			}
		},

		__checkUIErrors: function() {
			this.data.errors = [];
			var notifMandat = this.reply.forBothContactInfo.profileFieldsAccessor['SITE_NOTIF_VALUE_1'];
			var error = this.moduleCtrl.getModuleData().MPassengerDetails.errorStrings;
			if (notifMandat.mandatory) {
				var notif = document.getElementsByName('NOTIF_VALUE_1_1')
				if (notif[0].value == "") {
					this.__addErrorMessage(error['1771'].localizedMessage + ' (' + error['1771'].errorid + ')');
				}
			}
			if (this.data.errors.length > 0) {
				return false;
			}
			return true;
		},
		__addErrorMessage: function(message) {
			// if errors is empty
			if (this.data.errors == null) {
				this.data.errors = new Array();
			}
			// create JSON and append to errors
			var error = {
				'TEXT': message
			};
			this.data.errors.push(error);
		},

		__filterErrors: function() {
			if (this.data.messages && this.data.messages.errors) {
				var errors = this.data.messages.errors.list;
				var filtered = [];
				for (var e = 0; e < errors.length; e++) {
					if (this.FILTERED_ERRORS.indexOf(errors[e].NUMBER) === -1) {
						filtered.push(errors[e]);
					}
				}
				this.data.messages.errors.list = filtered;
			}
		},

		__initUIMessages: function() {
			if (this.__isIncompleteDetails()) {
				this.__addError(this.labels.tx_merci_text_complete_details);
			}

			var hasNoError = this.utils.isEmptyObject(this.reply.errors) && this.utils.isEmptyObject(this.reply.reqAttribMsgs);
			var hasUpdateItin = !this.utils.isEmptyObject(this.request.updateItinerary1) || !this.utils.isEmptyObject(this.request.updateItinerary2);
			if (hasUpdateItin && hasNoError) {
				if (!this.data.messages.infos) {
					this.data.messages.infos = {
						list: [],
						title: this.labels.tx_merci_text_info_message
					};
				} else {
					this.data.messages.infos.title = this.labels.tx_merci_text_info_message;
				}
				this.__addInfo(this.request.updateItinerary1);
				this.__addInfo(this.request.updateItinerary2);
			}else{
				if(this.data.messages){
					this.data.messages.infos = {
							list: [],
							title: ""
						};
				}
			}
		},

		__addError: function(errorMsg) {
			if (!this.data.messages.errors) {
				this.data.messages.errors = {
					list: []
				};
			}
			this.data.messages.errors.push(this.utils.createError(errorMsg));
		},

		__addInfo: function(infoNum) {
			if (infoNum && !this.utils.isEmptyObject(infoNum) && this.labels.uiErrors[infoNum]) {
				var info = this.utils.convertErrorFromBean(this.labels.uiErrors[infoNum]);
				this.data.messages.infos.list.push(info);
			}
		},

		__isIncompleteDetails: function() {
			if (!this.utils.isEmptyObject(this.request.finalValidationList)) {
				var paxIds = this.request.finalValidationList.split(',');
				var paxList = this.tripplan.listTravellerBean.travellers;
				for (var p = 0; p < paxList.length; p++) {
					if (paxIds.indexOf(String(p)) !== -1) {
						return true;
					}
				}
			}
			return false;
		},

		/*	New funciton to set selected preferred phone type as preferred phone number.
				Fix as part of PTR: 05602147  */
		setSelectedNumber: function(prefNumberType) {
			var hmePhoneElement = document.getElementById("validateHmePhne");
			var mblPhoneElement = document.getElementById("validateMblePhne");
			var offPhoneElement = document.getElementById("validateBusinessPhne");
			var selectedPhoneType = document.getElementById("selectedPhoneType");

			if (mblPhoneElement != null)
				mblPhoneElement.value = false;
			if (hmePhoneElement != null)
				hmePhoneElement.value = false;
			if (offPhoneElement != null)
				offPhoneElement.value = false;

			if (prefNumberType == "M") {
				mblPhoneElement.value = true;
				hmePhoneElement.value = false;
				offPhoneElement.value = false;
			} else if (prefNumberType == "H") {
				hmePhoneElement.value = true;
				mblPhoneElement.value = false;
				offPhoneElement.value = false;
			} else if (prefNumberType == "O") {
				offPhoneElement.value = true;
				hmePhoneElement.value = false;
				mblPhoneElement.value = false;
			}

		},

		getServicesBookmarkData: function() {
			pageObjPassenger.utils.getStoredItemFromDevice(merciAppData.DB_MYFAVOURITE, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
                        pageObjPassenger.jsonObj = JSON.parse(result);
                    }
				}
			});
			if (!pageObjPassenger.utils.isEmptyObject(pageObjPassenger.jsonObj)) {
				if (!pageObjPassenger.utils.isEmptyObject(pageObjPassenger.jsonObj.SERVICESCATALOG)) {
					return pageObjPassenger.jsonObj.SERVICESCATALOG;
				} else {
					return [];
				}
			} else {
				return [];
			}
		},

		getServicesBookmarkForRecLoc: function(recLoc) {
			var bookmarkedServices = this.getServicesBookmarkData();
			var bookmarkedRecLoc = {};
			for (var i = 0; i < bookmarkedServices.length; i++) {
				if (bookmarkedServices[i].REC_LOC.toLowerCase() == recLoc.toLowerCase()) {
					bookmarkedRecLoc = bookmarkedServices[i];
				}
			}
			return bookmarkedRecLoc;
		}

	}
});