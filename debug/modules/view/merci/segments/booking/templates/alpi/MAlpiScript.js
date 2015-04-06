Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],
	$constructor: function() {
		pageObj = this;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		this._bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
		this.currCode = "";
		this.exchRate = "";
	},

	$prototype: {

		$dataReady: function() {
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
			this.data.labels = this.moduleCtrl.getModuleData().booking.MALPI_A.labels;
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			this.data.siteParams = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam;
			this.data.rqstParams = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam;
			this.globalList = this.moduleCtrl.getModuleData().booking.MALPI_A.globalList;
			this._bookFunc = modules.view.merci.segments.booking.scripts.MBookingMethods;

			if(!this.__merciFunc.isEmptyObject(jsonResponse.currencyCode)){
				this.currCode = jsonResponse.currencyCode;
				delete jsonResponse.currencyCode;
			}
			if(!this.__merciFunc.isEmptyObject(jsonResponse.exchangeRate)){
				this.exchRate = jsonResponse.exchangeRate;
				delete jsonResponse.exchangeRate;
			}

		 	// google analytics
			this.__ga.trackPage({
				domain: this.data.siteParams.siteGADomain,
				account: this.data.siteParams.siteGAAccount,
				gaEnabled: this.data.siteParams.siteGAEnable,
				page: '5-Passenger Info?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.data.siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: '5-Passenger Info?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.data.siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
			});

			var headerButton = {};
			var arr = [];

			if (this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE') {
				arr.push("currInfoButton");
			};
			var loyaltyInfoJson = null;
			if (this._merciFunc.booleanValue(this.data.siteParams.enableLoyalty) && this.IS_USER_LOGGED_IN) {
				  loyaltyInfoJson = {
					loyaltyLabels: this.data.labels.loyaltyLabels,
					airline: base[16],
					miles: base[17],
					tier: base[18],
					title: base[19],
					firstName: base[20],
					lastName: base[21],
					programmeNo: base[22]
				};
			}
			//
			headerButton.button = arr;
			var headerButton = {};
			var arr = [];

			if (this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE') {
				arr.push("currInfoButton");
			};
			headerButton.button = arr;
			// set details for header
			this.moduleCtrl.setHeaderInfo({
				title: this.data.labels.tx_merci_text_booking_alpi_title,
				bannerHtmlL: this.data.rqstParams.bannerHtml,
				homePageURL: this.data.siteParams.homeURL,
				showButton: false,
				currencyConverter: {
					name: this.data.rqstParams.fareBreakdown.currencies[0].name,
					code: this.data.rqstParams.fareBreakdown.currencies[0].code,
					pgTkt: this.data.rqstParams.pageTicket,
					labels: this.data.labels,
					currency: {
						list: (this.globalList != null) ? this.globalList.currencyCode : [],
						disabled: this.data.siteParams.siteInhibitCurrency
					},
					currentPage: this,
					newPopupEnabled: this.__merciFunc.booleanValue(this.data.siteParams.enableNewPopup),
					showButton: this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE'
				},
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			if (this.data.rqstParams.requestBean != undefined){
				if (this.data.rqstParams.requestBean.HIDEALPI != undefined && this.data.rqstParams.requestBean.HIDEALPI == "TRUE" && this.data.rqstParams.requestBean.IS_SPEED_BOOK == 'TRUE'){
					if (typeof jsonResponse.ui == 'undefined') jsonResponse.ui = {};
					jsonResponse.ui.keepSpinning = true; /* let commoncontainer know, do not hide the loading layer */
				}
			}

		},

		$displayReady: function() {
			if(this.data.rqstParams.requestBean != undefined){
				if(this.data.rqstParams.requestBean.HIDEALPI != undefined && this.data.rqstParams.requestBean.HIDEALPI == "TRUE" && this.data.rqstParams.requestBean.IS_SPEED_BOOK == 'TRUE'){
				   this.data.rqstParams.requestBean.HIDEALPI = "FALSE";
						$('.msk.loading').show();
						$('select').removeAttr('disabled');
						   this.onSubmitAlpi();
				}
			}

			if(this._siteBillingRequired() && this.data.siteParams.enableBillingInAlpi == "TRUE" &&  !(this._isRebookingFlow())){
				this.__merciFunc.toggleMandatoryBorder(null,{id: "AIR_CC_ADDRESS_FIRSTLINE", mandatory: true});
				this.__merciFunc.toggleMandatoryBorder(null,{id: "AIR_CC_ADDRESS_CITY" ,mandatory: true});
			}
			modules.view.merci.common.utils.MCommonScript.prefillFormData("formPrefillData");
		},

		stringify: function(args) {
			return JSON.stringify(args);
		},

		_isRebookingFlow: function() {
			if (!this._merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown)) {
				return !this._merciFunc.isEmptyObject(this.data.rqstParams.fareBreakdown.rebookingStatus) && this.data.rqstParams.fareBreakdown.rebookingStatus;
			} else {
				return false;
			}
		},

		_siteBillingRequired: function() {
			return this.data.siteParams.siteBillingNotRequired == null || this.data.siteParams.siteBillingNotRequired.toLowerCase() == 'n' || this.data.siteParams.siteBillingNotRequired.toLowerCase() == 'false';
		},

		pushElement: function(arr, element) {
			arr.push(element);
			return arr;
		},

		toggleSubmitAlpi: function() {
			if( this._merciFunc.booleanValue(this.data.rqstParams.isSQSARegulnEnabled) && this._merciFunc.booleanValue(this.data.siteParams.SAPolicy)){
				var confirm = true;
				var btnConfirm = document.getElementsByClassName('submitAlpiButton');
				var chkBox = document.getElementById('checkAbove18Box');

				if (chkBox != null && chkBox.checked) {
					for (var i = 0; i<btnConfirm.length; i++) {
						btnConfirm[i].className = btnConfirm[i].className.replace(/(?:^|\s)disabled(?!\S)/g, '');
						btnConfirm[i].disabled=false;
					}
				} else {
					for (var i = 0; i<btnConfirm.length; i++) {
						btnConfirm[i].className += " disabled";
						btnConfirm[i].disabled=true;
					}
				}
			}
		},

		logOutProfile: function(event, args) {
			event.preventDefault();
			var params = 'result=json';
			var request = {
				parameters: params,
				action: 'MLogoff.action',
				method: 'POST',
				expectedResponseType: 'json',
				loading: true,
				isSecured: true,
				cb: {
					fn: this.__onLogOutCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onLogOutCallBack: function(response) {
			var json = this.moduleCtrl.getModuleData();
			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {
				if (dataId == 'Mindex_A') {
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data)
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		getSubmitArgs: function(id, goToCatalog) {
			return {
				trvlrIndxCount: this.data.rqstParams.listTravellerBean.travellerBean.length,
				id: id,
				action: "MALPIAction.action",
				goToCatalog: goToCatalog
			};
		},

		$viewReady: function() {
			$('body').attr('id', 'balpi');
			$('span').removeClass('xWidget');
			if (!this.__merciFunc.isEmptyObject(this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.awardsFlow) &&
				(this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.awardsFlow == true || this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.awardsFlow.toLowerCase() == "true")) {
				$('body').attr('id', 'aalpi');
			}

			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14] != "") {
				this.__merciFunc.appCallBack(this.data.siteParams.siteAppCallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}
			if( this._merciFunc.booleanValue(this.data.rqstParams.isSQSARegulnEnabled) && this._merciFunc.booleanValue(this.data.siteParams.SAPolicy)){
				//added as a part of SA Enhancements: 08799658
				var flightTimeFromBean = [];
				var flightTimeFromParam = "";

				var dateOne = "";
				var dateTwo = "";
				if (!this.__merciFunc.isEmptyObject(this.data.siteParams.siteSQ_SA_Policy_FlightTime)){
					flightTimeFromParam = this.data.siteParams.siteSQ_SA_Policy_FlightTime;
					dateTwo = new Date(flightTimeFromParam).getTime();
				}
				if(!this._merciFunc.isEmptyObject(this.data.rqstParams.listItineraryBean.itinerariesAsMap)){
					flightTimeFromBean = this.data.rqstParams.listItineraryBean.itinerariesAsMap[0].beginDate;
					dateOne = new Date(flightTimeFromBean).getTime();
				}


				if((dateOne != "" && dateTwo != "" && dateOne > dateTwo) || flightTimeFromParam == ""){
					if (this.data.rqstParams.listTravellerBean.travellerBean.length > 0){
						var paxno = this.data.rqstParams.listTravellerBean.travellerBean.length;
					}
					this._bookUtil.checkIfDOBlessthan18(event, paxno);
					this.toggleSubmitAlpi();
				}else{
					document.getElementById("Above18").style.display='none';
				}
			//finished SA CR
			}

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpi",
						data:this.data
					});
			}
		},

		toggle: function(event, args) {
			this._bookUtil.toggle(event, args);
		},

		onSubmitAlpi: function(event, args) {

			if(document.getElementById("add_services")!=null){
			 document.getElementById("add_services").focus(); //Fix of PTR 09374357
			}
			// preventing form submit
		    if(event!= undefined){
			 event.preventDefault(true);
		    }
			this.__validateAlpiPassportFields();

			this.data.errors = [];
			var rqstParams = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam;
			this.data.siteParams = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam;
			var retainSrch = this.data.siteParams.siteRetainSearch;
			var mandatFName = this.data.siteParams.showMandatoryFirstName;
			var showInfNewUI = this.data.siteParams.showInfantNewUI;
			var showNewContact = this.data.siteParams.showNewContactDisplay;
			var showNominee = this.data.siteParams.showNominee;
			var loginProfiles = rqstParams.loginProfilesBean.travellersList;
			var trvlrIndxCount = rqstParams.listTravellerBean.travellerBean.length;

			var isSubmit = true;
			this.__rectifyTitle();
			this.__copyIdenValues(trvlrIndxCount, this.id);

			if (showNewContact.toLowerCase() == "true") {
				this.formatPhoneNumber();
			} else {
				this.__formatSMSPhoneNumber();
			}

			if (mandatFName.toLowerCase() == "true") {
				this.__setFirstNames(trvlrIndxCount);
			}

			if ((retainSrch.toLowerCase() == "true") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
				this.__setFirstName_localStorage(trvlrIndxCount, rqstParams.retainAppCriteria);
			}

			if(this._siteBillingRequired() && this.data.siteParams.enableBillingInAlpi == "TRUE" &&  !(this._isRebookingFlow())){
				isSubmit = (!this.__validateAddressLineOne() || isSubmit);
				isSubmit = (!this.__validateAddressCity() || isSubmit);
				isSubmit = (!this.__validateAddressState() || isSubmit);
				isSubmit = (!this.__validateAddressZip() || isSubmit);
				isSubmit = (!this.__validateAddressCountry() || isSubmit);
		      }

			if (showInfNewUI.toLowerCase() == "true") {
				isSubmit = this.__checkInfDOB();
			}
			if (showNominee.toLowerCase() == "true" && loginProfiles != null) {
				isSubmit = this.__checkDupNominee();
			}
			if (args != null && args.goToCatalog) {
				document.getElementById("gotoChargeableFsr").value = "true";
			}

			if(!this._merciFunc.isEmptyObject(rqstParams.requestBean)){
				if(this.data.rqstParams.requestBean.IS_SPEED_BOOK == 'TRUE'){
				   	$('select').removeAttr('disabled');
					}
			}

			if (isSubmit) {
				var request = {
					formObj: document.getElementById('alpiForm'),
					action: 'MALPIAction.action',
					method: 'POST',
					expectedResponseType: 'json',
					loading: true,
					isSecured: true,
					cb: {
						fn: this.__onAlpiFormCallBack,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			}
		},

  		__validateAddressLineOne: function() {

			// validate if address field is provided with value
		var addressLine1 = document.getElementById('AIR_CC_ADDRESS_FIRSTLINE');
		if (addressLine1 != null && addressLine1.value.trim() != '') {
			return true;
		}

		// logic to display error
		var message = this.moduleCtrl.getModuleData().booking.MALPI_A.errors['2130108'].localizedMessage + ' (2130108)';
		this.__addErrorMessage(message);

		return false;
	},

	__validateAddressCity: function() {

		// validate if city field is provided with value
		var addressCity = document.getElementById('AIR_CC_ADDRESS_CITY');
		if (addressCity != null && addressCity.value.trim() != '') {
			return true;
		}

		// logic to display error
		var message = this.moduleCtrl.getModuleData().booking.MALPI_A.errors['2130133'].localizedMessage + ' (2130133)';
		this.__addErrorMessage(message);

		return false;
	},

	__validateAddressCountry: function() {


		// validate if country field is provided with value
		if (this.data.siteParams.sitePredTxtCountry!=null && this.data.siteParams.sitePredTxtCountry.toUpperCase() == 'TRUE') {
			var addressCountry = document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT');
		} else {
			var addressCountry = document.getElementById('AIR_CC_ADDRESS_COUNTRY');
		}


		if (addressCountry != null && addressCountry.value.trim() != '') {
			this.updateCountry();
			return true;
		}

		// logic to display error
		var message = this.moduleCtrl.getModuleData().booking.MALPI_A.errors['2130135'].localizedMessage + ' (2130135)';
		this.__addErrorMessage(message);

		return false;
	},


	__validateAddressState: function() {

		// validate if state field is provided with value
		var addressState = document.getElementById('AIR_CC_ADDRESS_STATE');
		if (!(this.data.rqstParams.profileFieldsAccessor && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrState && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrState.mandatory) ||
			(addressState != null && addressState.value.trim() != '')) {
			return true;
		}

		// logic to display error
		var message = this.moduleCtrl.getModuleData().booking.MALPI_A.errors['2130136'].localizedMessage + ' (2130136)';
		this.__addErrorMessage(message);

		return false;
	},

	__validateAddressZip: function() {


		// validate if state field is provided with value
		var addressZip = document.getElementById('AIR_CC_ADDRESS_ZIPCODE');
		if (!(this.data.rqstParams.profileFieldsAccessor && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrZip && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrZip.mandatory) ||
			(addressZip != null && addressZip.value.trim() != '')) {
			return true;
		}

		// logic to display error
		var message = this.moduleCtrl.getModuleData().booking.MALPI_A.errors['2130134'].localizedMessage + ' (2130134)';
		this.__addErrorMessage(message);

		return false;
	},

	updateCountry: function() {

		// if element exists in DOM then only create autocomplete
		if (this._siteBillingRequired() && this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.MALPI_A != null && this.globalList != null) {

			// declaring variable for later use
			var countryField = document.getElementById('AIR_CC_ADDRESS_COUNTRY');

			var countryTxtField = document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT');

			if (countryField != null) {
				// default value
				countryField.value = '';

				// iterating on list to match country
				for (var i = 0; i < this.globalList.slLangCountryList.length; i++) {
					var country = this.globalList.slLangCountryList[i];
					if (countryTxtField != null && country[1].toLowerCase() == countryTxtField.value.toLowerCase()) {
						// if matched
						countryField.value = country[0];
						break;
					}
				}
			}
		}
	},


		__formatSMSPhoneNumber: function() {
			var inputs = document.getElementsByTagName("input");
			for (var i = 0; i < inputs.length; i++) {
				if ((inputs[i].name.indexOf('NOTIF_VALUE') == 0) && (inputs[i].value.indexOf('00') != 0) && (inputs[i].value.indexOf('+') != 0) && !isNaN(inputs[i].value) && inputs[i].value != "") {
					var appendedZerosString = '00'.concat(inputs[i].value);
					inputs[i].value = appendedZerosString;
				}
			}
		},

		__validateAlpiPassportFields: function() {
			var inputs = document.getElementsByTagName("input");
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].name.indexOf('IDENTITY_DOCUMENT_NUMBER') == 0) {
					var noSpaceString = inputs[i].value.split(' ').join('');
					inputs[i].value = noSpaceString;
				}
				if (inputs[i].name.indexOf('INFANT_IDENTITY_DOCUMENT_NUMBER') == 0) {
					var noSpaceString = inputs[i].value.split(' ').join('');
					inputs[i].value = noSpaceString;
				}
			}
		},

		__onAlpiFormCallBack: function(response) {

			// getting module ctrl data
			var json = this.moduleCtrl.getModuleData();

			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

			if (response.responseJSON.data != null) {
				if (dataId == 'MALPI_A') {
					if(this.data.rqstParams.requestBean != undefined){
						if(this.data.rqstParams.requestBean.HIDEALPI != undefined && this.data.rqstParams.requestBean.HIDEALPI == 'FALSE' && this.data.rqstParams.requestBean.IS_SPEED_BOOK != undefined && this.data.rqstParams.requestBean.IS_SPEED_BOOK == 'TRUE'){
							$('#formSection').removeClass('hidden');
							$('.msk.loading').hide();
						}
					}
					this.__processError(response);
				} else {

					// setting data for next page
					this._merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);

					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}


		},


		__processError: function(response) {
			// for handling errors
			var errorMap = response.responseJSON.data.booking.MALPI_A.requestParam.errorMap;
			var errorStrings = response.responseJSON.data.booking.MALPI_A.errors;

			if (!this._merciFunc.isEmptyObject(errorMap)) {
				for (var key in errorMap) {
					if (errorMap.hasOwnProperty(key) && errorStrings[key] != null && errorStrings[key] != undefined) {
						this.__addErrorMessage(errorStrings[key].localizedMessage + " (" + errorStrings[key].errorid + ")");
					}
				}
			}

			if (!this._merciFunc.isEmptyObject(response.responseJSON.data.booking.MALPI_A.requestParam.errors)) {
				this.data.errors = response.responseJSON.data.booking.MALPI_A.requestParam.errors;
			}

			// update page ticket
			var pageTicketEL = document.getElementById('PAGE_TICKET');
			if (pageTicketEL != null && !this._merciFunc.isEmptyObject(response.responseJSON.data.booking.MALPI_A.requestParam.pageTicket)) {
				pageTicketEL.value = response.responseJSON.data.booking.MALPI_A.requestParam.pageTicket;
			}

			// refresh section
			window.scrollTo(0, 0);
			aria.utils.Json.setValue(this.data, 'errorOccured', true);
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


		dispUNMRPopup: function() {
			var fileName = 'MALPIUNMR_{0}_' + this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.merciDeviceBean.DEVICE_TYPE + '.html';
			var enableNewPopup = false;
			if(this.__merciFunc.booleanValue(this.data.siteParams.enableNewPopup)){
				enableNewPopup =  true ;
			}
			if(this._merciFunc.booleanValue(enableNewPopup)){
				var data = {} ;
				data.link = this._merciFunc.getStaticLinkURL(fileName,'html') ;
				data.moduleCtrl = this.moduleCtrl ;
				data.enableNewPopup = enableNewPopup ;
				this._merciFunc.openHTML(data);
			}else{
				this.moduleCtrl.showMskOverlay();
				this.__gethtml(this._merciFunc.getStaticLinkURL(fileName, 'html'), 'popupContentContainer');
				document.getElementById("agePopup").style.display = "block";

				// scroll to top
				window.scrollTo(0, 0);
			}
		},

		__gethtml: function(contentLink, id) {

			var request = {
				action: contentLink,
				isCompleteURL: true,
				method: 'GET',
				cb: {
					fn: this.__onHtmlFetchCallback,
					scope: this,
					args: id
				}
			};

			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},

		__onHtmlFetchCallback: function(response, params) {
			document.getElementById(params).innerHTML = response.responseText;
		},

		closeUNMRPopup: function(a, b) {
			this.moduleCtrl.hideMskOverlay();
			document.getElementById("agePopup").style.display = "none";
		},

		__copyIdenValues: function(paxno, id) {
			for (var paxIndex = 1; paxIndex <= paxno; paxIndex++) {
			var m_continue = document.createElement('input');
			m_continue.type = 'hidden';
			m_continue.name = 'continue';
			document.alpiForm.appendChild(m_continue);

			var name = "FIRST_NAME_" + paxIndex;
			var idenDocName = "IDENTITY_DOCUMENT_FIRST_NAME_" + paxIndex + "_" + id;
			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				document.getElementById(idenDocName).value = document.getElementById(name).value;
			}
			name = "LAST_NAME_" + paxIndex;
			idenDocName = "IDENTITY_DOCUMENT_LAST_NAME_" + paxIndex + "_" + id;
			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				document.getElementById(idenDocName).value = document.getElementById(name).value;
			}
			name = "paxDobDay_" + paxIndex;
			idenDocName = "IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + paxIndex + "_" + id;
			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				var stringDobDay = document.getElementById(name).value;
				if ((stringDobDay != null) && (stringDobDay.length == 1)) {
					stringDobDay = "0" + stringDobDay;
				}
				var stringDobMonth = document.getElementById("paxDobMonth_" + paxIndex).value;
				stringDobMonth = (parseInt(stringDobMonth) + 1).toString();
				if ((stringDobMonth != null) && (stringDobMonth.length == 1)) {
					stringDobMonth = "0" + stringDobMonth;
				}
				var dobValue = document.getElementById("paxDobYear_" + paxIndex).value + stringDobMonth + stringDobDay + '0000';
				document.getElementById(idenDocName).value = dobValue;
			}
			/* Infant Section */
			var name = "INFANT_FIRST_NAME_" + paxIndex;
			var idenDocName = "INFANT_IDENTITY_DOCUMENT_FIRST_NAME_" + paxIndex + "_" + id;
			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				document.getElementById(idenDocName).value = document.getElementById(name).value;
			}
			name = "INFANT_LAST_NAME_" + paxIndex;
			idenDocName = "INFANT_IDENTITY_DOCUMENT_LAST_NAME_" + paxIndex + "_" + id;
			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				document.getElementById(idenDocName).value = document.getElementById(name).value;
			}
			name = "infantDobDay_" + paxIndex;
			idenDocName = "INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + paxIndex + "_" + id;

			if (document.getElementById(name) != null && document.getElementById(idenDocName) != null) {
				var stringDobDay = document.getElementById(name).value;
				if ((stringDobDay != null) && (stringDobDay.length == 1)) {
					stringDobDay = "0" + stringDobDay;
				}
				var stringDobMonth = document.getElementById("infantDobMonth_" + paxIndex).value;
				stringDobMonth = (parseInt(stringDobMonth) + 1).toString();
				if ((stringDobMonth != null) && (stringDobMonth.length == 1)) {
					stringDobMonth = "0" + stringDobMonth;
				}
				var dobValue = document.getElementById("infantDobYear_" + paxIndex).value + stringDobMonth + stringDobDay + '0000';
				document.getElementById(idenDocName).value = dobValue;
			}
			}
		},

		__setFirstNames: function(paxNo) {
			for (var i = 1; i <= paxNo; i++) {
				var fname = document.getElementById("FIRST_NAME_" + i).value;
				if (fname == null || fname == "") {

					/* PTR 08107458 [Serious]: Merci: First Name changed to Mr. when left blank*/
					/*if (document.getElementById("TITLE_" + i) != null) {
						document.getElementById("FIRST_NAME_" + i).value = document.getElementById("TITLE_" + i).value;
						document.getElementById("TITLE_" + i).value = "";
					} */
					document.getElementById("MANDATORY_TITLE_" + i).value = "FALSE";

					if (document.getElementById("IDENTITY_DOCUMENT_FIRST_NAME_" + i + "_PSPT_BK_GLOBAL_DEFAULT_1") != null) {
						document.getElementById("IDENTITY_DOCUMENT_FIRST_NAME_" + i + "_PSPT_BK_GLOBAL_DEFAULT_1").value = "FNU"
					} else {
						var ssrFirstName = document.createElement('input');
						ssrFirstName.type = 'hidden';
						ssrFirstName.name = "IDENTITY_DOCUMENT_FIRST_NAME_" + i + "_PSPT_BK_GLOBAL_DEFAULT_1";
						ssrFirstName.value = "FNU";
						document.alpiForm.appendChild(ssrFirstName);


						var prTdoc = document.createElement('input');
						prTdoc.type = 'hidden';
						prTdoc.name = "APIS_PR_TDOC_" + i + "_GLOBAL_DEFAULT_1";
						prTdoc.value = "PSPT_BK_GLOBAL_DEFAULT_1";
						document.alpiForm.appendChild(prTdoc);

						var apisCheckView = document.createElement('input');
						apisCheckView.type = 'hidden';
						apisCheckView.name = "APIS_CHECK_VIEW";
						apisCheckView.value = "PSPT";
						document.alpiForm.appendChild(apisCheckView);

						var fromApis = document.createElement('input');
						fromApis.type = 'hidden';
						fromApis.name = "FROM_APIS";
						fromApis.value = "TRUE";
						document.alpiForm.appendChild(fromApis);
					}
				}
			}
		},
		__setFirstName_localStorage: function(paxCount, retainAppCriteria) {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var contactJson = "";
			var firstNameList = [],
				i, key;
			var client = false;
			var infCount = document.getElementById("noOfInfants").value;
			if (bp[14] != null && bp[14] != "" && retainAppCriteria == "TRUE") {
				client = true;
			}
			if (this.supports_local_storage()) {

				if (!(window.localStorage.getItem("Contacts:index"))) {
					window.localStorage.setItem("Contacts:index", 1);
				}

				if (!client) {

					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Contacts:\d+/.test(key)) {
							firstNameList.push(JSON.parse(window.localStorage.getItem(key)).first_name);
						}
					}
				} else {
					var psgrAppJson = $('#app_json_data').val();
					if ("" != psgrAppJson) {
						var temp = JSON.parse(psgrAppJson);
						if (null != temp && null != temp.ContactJson && "undefined" != temp.ContactJson) {
							psgrAppJson = temp.ContactJson;
							firstNameList = psgrAppJson.split(",");
						}
					}
				}

				for (i = 1; i <= paxCount; i++) {
					var sfnm = document.getElementById("SET_FIRST_NAME_" + i);
					var fname = document.getElementById("FIRST_NAME_" + i);
					var titleEl = document.getElementById("TITLE_" + i);
					var title;
					if (titleEl != null) {
						title = titleEl.value;
					} else {
						title = "";
					};
					var entry = {
						id: parseInt(window.localStorage.getItem("Contacts:index")),
						title: title,
						first_name: fname.value,
						last_name: document.getElementById("LAST_NAME_" + i).value,
						ffp: (document.getElementById("PREF_AIR_FREQ_AIRLINE_" + i + "_1") != null ? document.getElementById("PREF_AIR_FREQ_AIRLINE_" + i + "_1").value : ""),
						ffm: (document.getElementById("PREF_AIR_FREQ_NUMBER_" + i + "_1") != null ? document.getElementById("PREF_AIR_FREQ_NUMBER_" + i + "_1").value : ""),
						contNum: (document.getElementById("PREFERRED_PHONE_NO") != null ? document.getElementById("PREFERRED_PHONE_NO").value : ""),
						country: (document.getElementById("COUNTRY") != null ? document.getElementById("COUNTRY").value : ""),
						area: (document.getElementById("AREA_CODE") != null ? document.getElementById("AREA_CODE").value : ""),
						ph: (document.getElementById("PHONE_NUMBER") != null ? document.getElementById("PHONE_NUMBER").value : ""),
						email: (document.getElementById("CONTACT_POINT_EMAIL_1") != null ? document.getElementById("CONTACT_POINT_EMAIL_1").value : ""),
						oldHome: (document.getElementById("CONTACT_POINT_HOME_PHONE") != null ? document.getElementById("CONTACT_POINT_HOME_PHONE").value : ""),
						oldMob: (document.getElementById("CONTACT_POINT_MOBILE_1") != null ? document.getElementById("CONTACT_POINT_MOBILE_1").value : ""),
						oldBus: (document.getElementById("CONTACT_POINT_BUSINESS_PHONE") != null ? document.getElementById("CONTACT_POINT_BUSINESS_PHONE").value : ""),
						sms: (document.getElementById("NOTIF_VALUE_1_1") != null ? document.getElementById("NOTIF_VALUE_1_1").value : ""),
						add1: (document.getElementById("AIR_CC_ADDRESS_FIRSTLINE") != null ? document.getElementById("AIR_CC_ADDRESS_FIRSTLINE").value : ""),
						add2: (document.getElementById("AIR_CC_ADDRESS_SECONDLINE") != null ? document.getElementById("AIR_CC_ADDRESS_SECONDLINE").value : ""),
						city: (document.getElementById("AIR_CC_ADDRESS_CITY") != null ? document.getElementById("AIR_CC_ADDRESS_CITY").value : ""),
						state: (document.getElementById("AIR_CC_ADDRESS_STATE") != null ? document.getElementById("AIR_CC_ADDRESS_STATE").value : ""),
						pincode: (document.getElementById("AIR_CC_ADDRESS_ZIPCODE") != null ? document.getElementById("AIR_CC_ADDRESS_ZIPCODE").value : ""),
						billCountry: (document.getElementById("AIR_CC_ADDRESS_COUNTRY_TXT") != null ? document.getElementById("AIR_CC_ADDRESS_COUNTRY_TXT").value : "")
					} ;
					if (fname != null && fname.value != "") {
						if (sfnm != null && parseInt(sfnm.value) != 0 && ($.inArray(fname.value, firstNameList) != -1)) {
							entry.id = parseInt(sfnm.value);
							if (client) {
								contactJson = contactJson + "Contacts:" + entry.id + "=" + JSON.stringify(entry) + "|";
							} else {
								window.localStorage.setItem("Contacts:" + entry.id, JSON.stringify(entry));
							}

						} else {
							if (client) {
								contactJson = contactJson + "Contacts:" + entry.id + "=" + JSON.stringify(entry) + "|";
							} else {
								window.localStorage.setItem("Contacts:" + entry.id, JSON.stringify(entry));
							}
							window.localStorage.setItem("Contacts:index", ++entry.id);
						}
					}
				}

				for (i = 1; i <= infCount; i++) {
					var infsnm = document.getElementById("SET_INFANT_FIRST_NAME_" + i);
					var infname = document.getElementById("INFANT_FIRST_NAME_" + i);
					var infentry = {
						id: parseInt(window.localStorage.getItem("Contacts:index")),
						first_name: (document.getElementById("INFANT_FIRST_NAME_" + i) != null ? document.getElementById("INFANT_FIRST_NAME_" + i).value : ""),
						last_name: (document.getElementById("INFANT_LAST_NAME_" + i) != null ? document.getElementById("INFANT_LAST_NAME_" + i).value : "")
					};
					if (infname != null && infname.value != "") {

						if (infsnm != null && parseInt(infsnm.value) != 0 && ($.inArray(infname.value, firstNameList) != -1)) {
							infentry.id = parseInt(infsnm.value);
							if (client) {
								contactJson = contactJson + "Contacts:" + infentry.id + "=" + JSON.stringify(infentry) + "|";
							} else {
								window.localStorage.setItem("Contacts:" + infentry.id, JSON.stringify(infentry));

							}

						} else {
							if (client) {
								contactJson = contactJson + "Contacts:" + infentry.id + "=" + JSON.stringify(infentry) + "|";
							} else {
								window.localStorage.setItem("Contacts:" + infentry.id, JSON.stringify(infentry));
							}

							window.localStorage.setItem("Contacts:index", ++infentry.id);

						}
					}
				}

				if (client) {
					var contactList = contactJson.slice(0, -1);
					this.__merciFunc.appCallBack(this.data.siteParams.siteAppCallback, "://?flow=passengerpage/remember=" + contactList);
				}
			}

		},

		__checkInfDOB: function() {
			if (document.getElementById("noOfInfants") != null && document.getElementById("noOfInfants").value != '0') {
				var noOfInf = document.getElementById("noOfInfants").value;
				if (document.getElementById("B_DATE") != null) {
					var bDate = document.getElementById("B_DATE").value;
					var ONE_DAY = 1000 * 60 * 60 * 24;
					var bYear = bDate.substring(0, 4);
					var bMonth = bDate.substring(4, 6);
					var bDay = bDate.substring(6, 8);
					var firstTravelDate = new Date(bYear + "/" + bMonth + "/" + bDay);
					for (i = 1; i <= parseInt(noOfInf); i++) {
						if ((document.getElementById("infantDobDay_" + i) != null) && (document.getElementById("infantDobDay_" + i) != 'undefined')) {
							var infDay = document.getElementById("infantDobDay_" + i).value;
						}
						if ((document.getElementById("infantDobMonth_" + i) != null) && (document.getElementById("infantDobMonth_" + i) != 'undefined')) {
							var infMonth = document.getElementById("infantDobMonth_" + i).value;
						}
						infMonth = parseInt(infMonth) + 1;
						if ((document.getElementById("infantDobYear_" + i) != null) && (document.getElementById("infantDobYear_" + i) != 'undefined')) {
							var infYear = document.getElementById("infantDobYear_" + i).value;
						}
						var infDOB = new Date(infYear + "/" + infMonth + "/" + infDay);
						var day1 = firstTravelDate.getTime();
						var day2 = infDOB.getTime();
						var dayDiff = (day1 - day2) / ONE_DAY;
						if (dayDiff < 7) {
							$("#inf_error").show();
							$(window).scrollTop(0);
							return true;
							break;
						}
					}
				}
				//return false;
			}
			return true;
		},


		isEmptyObject: function(obj) {
			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					return false;
				}
			}
			return true;
		},

		__checkDupNominee: function() {
			var nomineesSelected = new Array();
			nomineesSelected = $('[id^="NOMINEE_"] option:selected');
			var nomineesSelectedArray = new Array();
			var nomineesValArray = new Array();
			for (i = 0; i < nomineesSelected.length; i++) {
				nomineesSelectedArray[i] = nomineesSelected[i].text;
				nomineesValArray[i] = nomineesSelected[i].value
			}
			//nomineesSelectedArray.sort();
			for (i = 0; i < nomineesSelectedArray.length; i++) {
				if (nomineesSelectedArray[i] == nomineesSelectedArray[i + 1] && nomineesValArray[i] != "SEL") {
					return false;
				}
			}
			return true;
		},

		__rectifyTitle: function() {
			var noOfTravellers = document.getElementById("noOfTravellers").value;
			for (i = 1; i <= noOfTravellers; i++) {
				var titleEl = document.getElementById("TITLE_" + i);
				if (titleEl != null) {
					var title = titleEl.value;
					if (title != "" && title.indexOf("&#039;") != -1) {
						title = title.replace("&#039;", "'");
						titleEl.value = title;
					}
				}
			}
		},

		formatPhoneNumber: function() {
			var country_element = "";
			var countryLen = "";
			var countryName = "";
			var countryCode = "";
			var phone_number = "";
			var areaCode = "";
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

			/* apn check added as a part of implementation for IR 7206489 */
			var apnCheck = this.data.siteParams.isApnSupported;
			if (this._merciFunc.booleanValue(apnCheck)) {
				var index = (phone_number.split("-")).length - 1;
				for (var i = 0; i < index; i++) {
					phone_number = phone_number.replace("-", "");
				}
			}

			/* Send hidden parameters based on selected preferred phone type. Fix as part of PTR: 05625982*/
			/* Fix to format validation conditions for various phones and country. PTR: 05691338 */
			var selectedPhoneType = document.getElementById("PREFERRED_PHONE_NO").value;
			this._bookUtil.setSelectedNumber(selectedPhoneType);
			if (selectedPhoneType == "H") {
				if (document.getElementById("CONTACT_POINT_HOME_PHONE") != null) {
					document.getElementById("CONTACT_POINT_HOME_PHONE").value = phone_number;
				}

				if (document.getElementById("validationListForCONTACT_POINT_HOME_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "true,1023,false,0,false,117311,false,0,false,0,true,117311";
				}

				if (document.getElementById("validationListForCONTACT_POINT_MOBILE_1") != null) {
					document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "false,1043,false,0,false,117312,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCOUNTRY") != null) {
					document.getElementById("validationListForCOUNTRY").value = "true,1023,false,0,false,0,false,0,false,0,true,1023";
				}

			} else if (selectedPhoneType == "M") {
				if (document.getElementById("CONTACT_POINT_MOBILE_1") != null) {
					document.getElementById("CONTACT_POINT_MOBILE_1").value = phone_number;
				}

				if (document.getElementById("validationListForCONTACT_POINT_MOBILE_1") != null) {
					document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "true,2130007,false,0,false,117311,false,0,false,0,true,117311";
				}

				if (document.getElementById("validationListForCONTACT_POINT_HOME_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "false,1023,false,0,false,0,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "false,1043,false,0,false,117312,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCOUNTRY") != null) {
					document.getElementById("validationListForCOUNTRY").value = "true,2130007,false,0,false,0,false,0,false,0,true,2130007";
				}
			} else if (selectedPhoneType == "O") {
				if (document.getElementById("CONTACT_POINT_BUSINESS_PHONE") != null) {
					document.getElementById("CONTACT_POINT_BUSINESS_PHONE").value = phone_number;
				}

				if (document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "true,1043,false,0,false,117312,false,0,false,0,true,117311";
				}

				if (document.getElementById("validationListForCONTACT_POINT_MOBILE_1") != null) {
					document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCONTACT_POINT_HOME_PHONE") != null) {
					document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "false,1023,false,0,false,0,false,0,false,0,false,0";
				}

				if (document.getElementById("validationListForCOUNTRY") != null) {
					document.getElementById("validationListForCOUNTRY").value = "true,1043,false,0,false,0,false,0,false,0,true,1043";
				}
			}
		},

		supports_local_storage: function() {
			try {
				var supportLS = 'localStorage' in window && window['localStorage'] !== null;
				if (supportLS) {
					/* This check is reqd for private browsing mode in iPad */
					try {
						localStorage.setItem("checkLS", "Supported");
					} catch (e) {
						if (e == QUOTA_EXCEEDED_ERR) {
							return false;
						}
					}
				}
				return supportLS;
			} catch (e) {
				return false;
			}
		},

		__onSelectSeatCallBack: function(response, params) {
			if (response.responseJSON.homePageId != 'merci-book-MALPI_A') {
				this.__merciFunc.navigateCallback(response, this.moduleCtrl, true);
			} else {
				this.__processError(response);
			}
		},

		onSeatSelectClick: function(ATarg, args) {
			this.data.errors = [];
			var showNewContact = this.data.siteParams.showNewContactDisplay;
			if (showNewContact.toLowerCase() == "true") {
				this.formatPhoneNumber();
			}
			var request = {
				formObj: document.getElementById('alpiForm'),
				action: args.action,
				method: 'POST',
				loading: true,
				isSecured: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onSelectSeatCallBack,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
		},

		copyLastName: function(atArg, args) {
			var lName = document.getElementById("LAST_NAME_" + args.infantId);
			if (lName != null) {
				var infLname = document.getElementById("INFANT_LAST_NAME_" + args.infantId);
				if (infLname != null) {
					if (document.getElementById("cb-infant-" + args.infantId).checked) {
						infLname.value = lName.value;
					} else {
						infLname.value = "";
					}
				}
			}
		},

		restartBooking: function(e, args) {
			this._bookFunc.openUrl(args);
		}
	}
});