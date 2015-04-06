Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiPaxDetailsScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.segments.booking.scripts.MBookingMethods'
	],
	$constructor: function() {
		pageObjectALPI = this;
		pageObj = this;
		anotherPageObj = this;
		var dateTwo = null;
	},

	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this.buffer = modules.view.merci.common.utils.StringBufferImpl;
			this.bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
			this.apisSectionBean = this.data.apisSectionBean || {};
		},

		$viewReady: function() {
			if (this.data.flowFrom === "profilePage") {
				if (this.moduleCtrl.getModuleData().login != null && !this.utils.isEmptyObject(this.moduleCtrl.getModuleData().login.MUserProfile_A) && this.moduleCtrl.getModuleData().login.MUserProfile_A.requestParam.requestBean.ENABLE_EARLY_LOGIN == "YES" || this.moduleCtrl.getModuleData().booking != null && !this.utils.isEmptyObject(this.moduleCtrl.getModuleData().booking.MALPI_A) && this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.enableDirectLogin == "YES") {
					this.onChangeDOB();
				}
			}
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiPaxDetails",
						data:this.data
					});
			}
		},

		apisDobEnabled: function() {
			if (this.data.apisSectionBean != null && this.data.apisSectionBean.listPrimaryTravelDocuments != null) {
				for (var i = 0; i < this.data.apisSectionBean.listPrimaryTravelDocuments.length; i++) {
					if (this.data.apisSectionBean.listPrimaryTravelDocuments[i] != null && this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument != null && this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument.dateOfBirthAttributes != null && (this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument.dateOfBirthAttributes.IDENRequirement != "DISABLED"|| this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument.dateOfBirthAttributes.PSPTRequirement != "DISABLED")) {

						return true;
					}
				}
			}

			return false;
		},

		getTitleSource: function() {

			var siteParam = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam
			var titleSource = siteParam.langTitlesAllowed;
			titleSource = titleSource.split(",");
			return titleSource;
		},

		/**
		 * this is used to prefill nominee details
		 * @param event
		 * @param args
		 */
		modifyNominee: function(event, args) {

			var sel = document.getElementById("NOMINEE_" + args.paxNo);
			if (sel != null && sel.options[sel.selectedIndex].value != 'SEL') {

				var FFN = [];
				var DOB = [];
				var title = [];
				var airline = [];
				var lastName = [];
				var firstName = [];

				var titleSource = this.data.siteParameters.langTitlesAllowed;
				var loginProfiles = this.data.rqstParams.loginProfilesBean.travellersList;

				titleSource = titleSource.split(",");
				for (var i = 0; i < loginProfiles.length; i++) {

					if (loginProfiles[i].titleCode == 'dummyValue') {
						title.push("");
					} else {
						title.push(loginProfiles[i].titleCode);
					}

					DOB.push(loginProfiles[i].dateOfBirth);
					FFN.push(loginProfiles[i].freqFlyerNum1);
					lastName.push(loginProfiles[i].lastName);
					firstName.push(loginProfiles[i].firstName);
					airline.push(loginProfiles[i].freqFlyerCode1);
				}

				var nomineeId = parseInt(document.getElementById("NOMINEE_" + args.paxNo).value);
				if (nomineeId < 1 || title[nomineeId - 1] == "Dummyvalue" || title[nomineeId - 1] == undefined) {
					var titleEL = document.getElementById("TITLE_" + args.paxNo);
					if (titleEL != null) {
						titleEL.value = "";
					}
				} else {
					if (title[nomineeId - 1] != "") {
						for (j = 0; j < titleSource.length; j++) {
							if (title[nomineeId - 1] != undefined && title[nomineeId - 1].toUpperCase() == titleSource[j]) {
								title[nomineeId - 1] = titleSource[j];
							}
						}
					}

					var titleEL = document.getElementById("TITLE_" + args.paxNo);
					if (titleEL != null) {
						titleEL.value = title[nomineeId - 1];
					}
				}

				if (nomineeId < 1 || firstName[nomineeId - 1] == "Dummyvalue") {
					document.getElementById("FIRST_NAME_" + args.paxNo).value = "";
				} else {
					document.getElementById("FIRST_NAME_" + args.paxNo).value = firstName[nomineeId - 1];
				}
				if (nomineeId < 1 || lastName[nomineeId - 1] == "Dummyvalue") {
					document.getElementById("LAST_NAME_" + args.paxNo).value = "";
				} else {
					document.getElementById("LAST_NAME_" + args.paxNo).value = lastName[nomineeId - 1];
				}
				if (nomineeId < 1 || airline[nomineeId - 1] == "Dummyvalue" || airline[nomineeId - 1] == undefined && document.getElementById("PREF_AIR_FREQ_AIRLINE_" + args.paxNo + "_1") != null) {
					document.getElementById("PREF_AIR_FREQ_AIRLINE_" + args.paxNo + "_1").value = "";
				} else if (document.getElementById("PREF_AIR_FREQ_AIRLINE_" + args.paxNo + "_1") != null) {
					document.getElementById("PREF_AIR_FREQ_AIRLINE_" + args.paxNo + "_1").value = airline[nomineeId - 1];
				}
				if (nomineeId < 1 || FFN[nomineeId - 1] == "Dummyvalue" || FFN[nomineeId - 1] == undefined && document.getElementById("PREF_AIR_FREQ_NUMBER_" + args.paxNo + "_1") != null) {
					document.getElementById("PREF_AIR_FREQ_NUMBER_" + args.paxNo + "_1").value = "";
				} else if (document.getElementById("PREF_AIR_FREQ_NUMBER_" + args.paxNo + "_1") != null) {
					document.getElementById("PREF_AIR_FREQ_NUMBER_" + args.paxNo + "_1").value = FFN[nomineeId - 1];
				}
				var genderElement = document.getElementById("IDENTITY_DOCUMENT_GENDER_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1");
				if (nomineeId < 1 || (DOB[nomineeId - 1] == undefined)) {
					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth() + 1;
					var yyyy = today.getFullYear();
					if (this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[args.paxType][0]) {
						document.getElementById("paxDobDay_" + args.paxNo).value = 1;
						document.getElementById("paxDobMonth_" + args.paxNo).value = 0;
						document.getElementById("paxDobYear_" + args.paxNo).value = yyyy;
					}
					if (document.getElementById("Day_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1") != null) {
						document.getElementById("Day_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").value = 1;
						document.getElementById("Month_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").value = 0;
						document.getElementById("Year_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").value = yyyy;
					}					
					if (genderElement != null) {
						genderElement.value = "";
					}
				} else {
					var ymd = DOB[nomineeId - 1].yearMonthDay;
					var today = new Date();
					var presentYear = today.getFullYear();
					var day = ymd.substring(6, 8);
					if (day.indexOf('0') != -1) {
						day = day.substring(1, 2);
					}
					if (this.data.rqstParams.travellerInfoConfig.dateOfBirthPerTravellerType[args.paxType][0]) {
						document.getElementById("paxDobDay_" + args.paxNo).selectedIndex = day - 1;
						document.getElementById("paxDobMonth_" + args.paxNo).value = parseInt(ymd.substring(4, 6)) - 1;
						document.getElementById("paxDobYear_" + args.paxNo).value = ymd.substring(0, 4);
					}
					if (document.getElementById("Day_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1") != null) {
						document.getElementById("Day_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").selectedIndex = day - 1;
						document.getElementById("Month_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").value = parseInt(ymd.substring(4, 6)) - 1;
						document.getElementById("Year_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + args.paxNo + "_PSPT_BK_GLOBAL_DEFAULT_1").value = ymd.substring(0, 4);
					}					
					if (genderElement != null) {
						if ((nomineeId - 1 == 0)) {
							genderElement.value = gender;
						} else {
							genderElement.value = "";
						}
					}
				}

				var travName = '';
				if (firstName[nomineeId - 1] != null) {
					travName += firstName[nomineeId - 1];
				}

				if (lastName[nomineeId - 1] != null) {
					travName += ((travName != '') ? ' ' : '') + lastName[nomineeId - 1];
				}

				this.__updatePaxSectionTitle(args.paxIndex, travName);
			}
		},

		/**
		 *	updates the header with passenger name
		 *  @param index
		 *  @param travName
		 */
		__updatePaxSectionTitle: function(index, travName) {

			var travNmEl = document.getElementById("travTitle_" + index);
			if (travName == null || travName.trim() == '') {
				travName = this.data.labels.tx_merci_text_booking_passenger + ' ' + (index + 1) + ' ' + this.data.labels.tx_merci_text_booking_apis_information;
			}

			if (travNmEl != null) {
				travNmEl.innerHTML = travName;
			}
		},

		onChangeDOB: function() {
			var day = document.getElementById("DATE_OF_BIRTH_DAY_1").value;
			var month = document.getElementById("DATE_OF_BIRTH_MONTH_1").value;
			var monthInt = parseInt(month) + 1;
			var year = document.getElementById("DATE_OF_BIRTH_YEAR_1").value;

			if (parseInt(day) < 10)
				day = "0" + day;
			if (monthInt < 10) {
				month = monthInt.toString();
				month = "0" + month;
			} else {
				month = monthInt.toString();
			}
			dateOfBirth_1 = year + month + day + "0000";

			var dobElement = document.getElementById("DATE_OF_BIRTH_1");
			dobElement.value = dateOfBirth_1;
		},

		pspt_firstName: function(event, args) {

			var firstPart = "IDENTITY_DOCUMENT_";
			var lastPart = "_PSPT_BK_GLOBAL_DEFAULT_1";
			var firstNameTag = firstPart + args.firstName + lastPart;

			//get the alpi tag value
			var firstNameValue = document.getElementById(args.firstName);
			var apisFirstName = document.getElementById(firstNameTag);
			if (!this.utils.booleanValue(this.data.siteParameters.showMandatoryFirstName)){
				this.toggleMandatoryBorder(null,{id:args.firstName});
			}
			this.__updateHeaderPanel(args);
			if (apisFirstName != null && firstNameValue != null) {
				apisFirstName.value = firstNameValue.value;
			}
		},

		pspt_lastName: function(atArg, args) {

			var firstPart = "IDENTITY_DOCUMENT_";
			var lastPart = "_PSPT_BK_GLOBAL_DEFAULT_1";
			var apislastnametag = firstPart + args.lastName + lastPart;

			//get the alpi tag value
			var lastNameALPI = document.getElementById(args.lastName);
			var apisLastName = document.getElementById(apislastnametag);
			this.toggleMandatoryBorder(null,{id:args.lastName});
			this.__updateHeaderPanel(args);
			if (apisLastName != null && lastNameALPI != null) {
				apisLastName.value = lastNameALPI.value;
			}
		},

		setDay: function(event, args) {
			this.bookUtil.setDay(event, args);
			this.pspt_dob(args.TravllerIndex);
		},

		setMonth: function(event, args) {
			this.bookUtil.setMonth(event, args);
			this.pspt_dob(args.TravllerIndex);
		},

		setYear: function(event, args) {
			this.bookUtil.setYear(event, args);
			this.pspt_dob(args.TravllerIndex);
		},

		fillPsptValues: function(event, args) {
			if(this.utils.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.id});
			}			
			this.bookUtil.fillPsptValues(event, args);
		},

		__updateDays: function(event, args) {
			this.bookUtil.__updateDays(event, args);
			this.checkAge();
		},

		checkAge: function(){
			if( this.utils.booleanValue(this.data.rqstParams.isSQSARegulnEnabled) && this.utils.booleanValue(this.data.siteParameters.SAPolicy)){
				if (this.data.rqstParams.listTravellerBean.travellerBean.length > 0){
					var paxno = this.data.rqstParams.listTravellerBean.travellerBean.length;
				}
				this.bookUtil.checkIfDOBlessthan18(event, paxno);
			}
		},

		__updateHeaderPanel: function(args) {

			var panelId = document.getElementById('travTitle_' + args.travellerIndex);
			var firstNameValue = document.getElementById('FIRST_NAME_' + args.travellerNo);
			var lastNameValue = document.getElementById('LAST_NAME_' + args.travellerNo);

			if (panelId != null && firstNameValue != null && lastNameValue != null) {
				var travellerNum = args.travellerNo;
				var exisHTML = panelId.innerHTML;
				var remaining = exisHTML.substring(exisHTML.indexOf('<'), exisHTML.length);

				var travellerList = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerBean;
				if (travellerList.length == 1) {
					travellerNum = '';
				}
				if (firstNameValue.value.trim().length == 0 && lastNameValue.value.trim().length == 0) {
					panelId.innerHTML = this.data.labels.tx_merci_text_booking_passenger + ' ' + (travellerNum) + ' ' + this.data.labels.tx_merci_text_booking_apis_information + remaining;
				} else {
					panelId.innerHTML = firstNameValue.value + " " + lastNameValue.value + remaining;
				}
			}
		},

		selectFromARIA: function(event, ui) {
			var nm = this.getFirstNameList();
			var namesList = new Array();
			var current = this;
			var siteParam = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var param = this.data.rqstParams;
			var fname = "";
			var index = ui.input.id;
			index = index.match(/\d+/)[0];
			for (var i = 0; i < nm.length; i++) {
				namesList[i] = nm[i].code;
			}

			var counter = 0;
			for (var i = 0; i < namesList.length; i++) {
				if (namesList[i] === ui.suggestion.code) {
					fname = namesList[i];
					counter++;
				}
			}
			if (counter == 1) {
				var selIndex = $.inArray(ui.suggestion.code, namesList);
				selIndex++;
				if (null != bp[14] && bp[14] != "" && param.retainAppCriteria == "TRUE") {
					window.location = siteParam.siteAppCallback + "://?flow=passengerpage/contactIndex=" + index + "|selectedIndex=" + selIndex + "|firstName=" + fname + "|ADT";
				} else {
					var entry = window.localStorage.getItem("Contacts:" + selIndex);
					if (entry != null) {
						current.setPassengerCriteria(entry, index, selIndex);
					}
				}
			}

		},

		$displayReady: function() {
			/*To disable the mandatory border on the mandatory fields if they are pre-filled*/			
			var genderField = "IDENTITY_DOCUMENT_GENDER_"+this.data.traveller.paxNumber+"_"+this.data.id;
			var nationalityField = "NATIONALITY_"+this.data.traveller.paxNumber;
			var lnameField = "LAST_NAME_"+this.data.traveller.paxNumber;
			var fnameField = "FIRST_NAME_"+this.data.traveller.paxNumber;
			var titleField = "TITLE_"+this.data.traveller.paxNumber;
			var isTitlemandatory = 'FALSE';
			var titleProfileField = this.data.rqstParams.profileFieldsAccessor["SITE_TITLE_1"];
			if(!this.utils.isEmptyObject(titleProfileField) && titleProfileField.mandatory){
				isTitlemandatory = 'TRUE';
			}
			if(this.utils.booleanValue(isTitlemandatory)){
				this.toggleMandatoryBorder(null, {id : titleField, mandatory: isTitlemandatory});
			}
			var isNationalityFieldMandatory = 'FALSE';
			if (this.data.traveller.identityInformation.nationalityAttributes.mandatory == 'Y'){
				isNationalityFieldMandatory = 'TRUE';
			}
			this.toggleMandatoryBorder(null, { id : genderField, mandatory: true});
			if(this.utils.booleanValue(isNationalityFieldMandatory)){
				this.toggleMandatoryBorder(null, {id : nationalityField, mandatory: isNationalityFieldMandatory});
			}
			this.toggleMandatoryBorder(null,{id:lnameField});
			if (!this.utils.booleanValue(this.data.siteParameters.showMandatoryFirstName)){
				this.toggleMandatoryBorder(null,{id:fnameField});
			}
		},

		getFirstNameList: function() {

			var retainSrch = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam.siteRetainSearch;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			if ((retainSrch.toLowerCase() == "true") && (this.moduleCtrl.getModuleData().booking.MALPI_A != null) && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
				var firstNameList = [],
					i, key;
				var lastNameList = [],
					j;
				if (null != bp[14] && bp[14] != "" && this.data.rqstParams.retainAppCriteria == "TRUE") {
					var psgrAppJson = $('#app_json_data').val();
					if ("" != psgrAppJson) {
						var temp = null;
						try {
							JSON.parse(psgrAppJson);
						} catch (e) {
							temp = {};
						}

						if (null != temp && null != temp.ContactJson && "undefined" != temp.ContactJson) {
							psgrAppJson = temp.ContactJson;
							fArray = psgrAppJson.split(",");
							for(var k = 0; k < fArray.length; k++){
								var json = {
									label: fArray[k],
									code: fArray[k],
									image: {
										show: true,
										css: 'fave'
									}
								}
								firstNameList.push(json);
							}
						}
					}
				} else if (this.supports_local_storage() && window.localStorage.getItem("Contacts:index") != null) {
					for (i = 1; i < window.localStorage.getItem("Contacts:index"); i++) {
						if(window.localStorage.getItem("Contacts:" + i) && typeof window.localStorage.getItem("Contacts:" + i) != "undefined"){
							fNameJson = JSON.parse(window.localStorage.getItem("Contacts:" + i)).first_name;
							var json = {
								label: fNameJson,
								code: fNameJson,
								image: {
									show: true,
									css: 'fave'
								}
							}
							firstNameList.push(json);
						}
					}
				}

				var travellerList = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerBean;
				for (j = 0; j < travellerList.length; j++) {
					var pax = travellerList[j];
					if (firstNameList != null && firstNameList != "")
						return firstNameList;
				}
				return firstNameList;
			};
		},


		clrSelected: function(event, args) {
			if (args.name != null) {
				var name = document.getElementById(args.name).value;
				if (name != null && name == "")
					$('#' + args.name).removeClass('nameSelected');
				this.showCross(event, args);
			}
		},

		showCross: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				if (inputEL.value == '' || inputEL.className.indexOf('hidden') != -1) {
					delEL.className += ' hidden';
				} else if (delEL.className.indexOf('hidden') != -1) {
					delEL.className = delEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
					inputEL.className = inputEL.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
				}
			}
		},

		clearField: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				inputEL.value = '';
				delEL.className += ' hidden';
				inputEL.className = inputEL.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
			}
			if(this.utils.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.id});
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

		setMiddleNameDisplayed: function(middleNameDisplayed) {
			this.moduleCtrl.setValueforStorage(middleNameDisplayed, "middleNameDisplayed");
		},

		setPassengerCriteria: function(entry, index, selIndex) {
			entry = JSON.parse(entry);
			if (entry != null) {
				if (entry.title) {
					$("input#TITLE_" + index).val(entry.title).addClass('nameSelected');
					$("span#delTITLE_" + index).removeClass('hidden');
				}
				$("span#delFIRST_NAME_" + index).removeClass('hidden');
				$("input#FIRST_NAME_" + index).addClass('nameSelected');
				$("input#SET_FIRST_NAME_" + index).val(selIndex);
				$("input#LAST_NAME_" + index).val(entry.last_name).addClass('nameSelected');
				$("span#delLAST_NAME_" + index).removeClass('hidden');
				if (entry.ffp) {
					$("input#PREF_AIR_FREQ_AIRLINE_" + index + "_1").val(entry.ffp).addClass('nameSelected');
					$("span#delPREF_AIR_FREQ_AIRLINE_" + index + "_1").removeClass('hidden');
				} else
					$("input#PREF_AIR_FREQ_AIRLINE_" + index + "_1").val(entry.ffp).removeClass('nameSelected');
				if (entry.ffm) {
					$("input#PREF_AIR_FREQ_NUMBER_" + index + "_1").val(entry.ffm).addClass('nameSelected');
					$("span#delPREF_AIR_FREQ_NUMBER_" + index + "_1").removeClass('hidden');
				} else
					$("input#PREF_AIR_FREQ_NUMBER_" + index + "_1").val(entry.ffm).removeClass('nameSelected');

				$("#PREFERRED_PHONE_NO option[value='" + entry.contNum + "']").attr('selected', true);

				if (entry.country) {
					$("input#COUNTRY").val(entry.country).addClass('nameSelected');
					$("span#delCOUNTRY").removeClass('hidden');
				} else
					$("input#COUNTRY").val(entry.country).removeClass('nameSelected');

				if (entry.area) {
					$("input#AREA_CODE").val(entry.area).addClass('nameSelected');
					$("span#delAREA_CODE").removeClass('hidden');
				} else
					$("input#AREA_CODE").val(entry.area).removeClass('nameSelected');

				if (entry.ph) {
					$("input#PHONE_NUMBER").val(entry.ph).addClass('nameSelected');
					$("span#delPHONE_NUMBER").removeClass('hidden');
				} else
					$("input#PHONE_NUMBER").val(entry.ph).removeClass('nameSelected');

				if (entry.email) {
					$("input#CONTACT_POINT_EMAIL_1").val(entry.email).addClass('nameSelected');
					$("span#delCONTACT_POINT_EMAIL_1").removeClass('hidden');
				} else
					$("input#CONTACT_POINT_EMAIL_1").val(entry.email).removeClass('nameSelected');

				if (entry.oldHome) {
					$("input#CONTACT_POINT_HOME_PHONE").val(entry.oldHome).addClass('nameSelected');
					$("span#delCONTACT_POINT_HOME_PHONE").removeClass('hidden');
				} else
					$("input#CONTACT_POINT_HOME_PHONE").val(entry.oldHome).removeClass('nameSelected');
				if (entry.oldMob) {
					$("input#CONTACT_POINT_MOBILE_1").val(entry.oldMob).addClass('nameSelected');
					$("span#delCONTACT_POINT_MOBILE_1").removeClass('hidden');
				} else
					$("input#CONTACT_POINT_MOBILE_1").val(entry.oldMob).removeClass('nameSelected');
				if (entry.oldBus) {
					$("input#CONTACT_POINT_BUSINESS_PHONE").val(entry.oldBus).addClass('nameSelected');
					$("span#delCONTACT_POINT_BUSINESS_PHONE").removeClass('hidden');
				} else
					$("input#CONTACT_POINT_BUSINESS_PHONE").val(entry.oldBus).removeClass('nameSelected');
				if (entry.sms) {
					$("input#NOTIF_VALUE_1_1").val(entry.sms).addClass('nameSelected');
					$("span#delNOTIF_VALUE_1_1").removeClass('hidden');
				} else
					$("input#NOTIF_VALUE_1_1").val(entry.sms).removeClass('nameSelected');
				if (entry.add1) {
					$("input#AIR_CC_ADDRESS_FIRSTLINE").val(entry.add1).addClass('nameSelected');
					$("span#delAIR_CC_ADDRESS_FIRSTLINE").removeClass('hidden');
				} else
					$("input#AIR_CC_ADDRESS_FIRSTLINE").val(entry.add1).removeClass('nameSelected');
				if (entry.add2) {
					$("input#AIR_CC_ADDRESS_SECONDLINE").val(entry.add2).addClass('nameSelected');
					$("span#delAIR_CC_ADDRESS_SECONDLINE").removeClass('hidden');
				} else
					$("input#AIR_CC_ADDRESS_SECONDLINE").val(entry.add2).removeClass('nameSelected');
				if (entry.city) {
					$("input#AIR_CC_ADDRESS_CITY").val(entry.city).addClass('nameSelected');
					$("span#delAIR_CC_ADDRESS_CITY").removeClass('hidden');
				} else
					$("input#AIR_CC_ADDRESS_CITY").val(entry.city).removeClass('nameSelected');
				if (entry.state) {
					$("input#AIR_CC_ADDRESS_STATE").val(entry.state).addClass('nameSelected');
					$("span#delAIR_CC_ADDRESS_STATE").removeClass('hidden');
				} else
					$("input#AIR_CC_ADDRESS_STATE").val(entry.state).removeClass('nameSelected');
				if (entry.pincode) {
					$("input#AIR_CC_ADDRESS_ZIPCODE").val(entry.pincode).addClass('nameSelected');
					$("span#delAIR_CC_ADDRESS_ZIPCODE").removeClass('hidden');
				} else
					$("input#AIR_CC_ADDRESS_ZIPCODE").val(entry.pincode).removeClass('nameSelected');
				if (entry.billCountry) {
					$("input#AIR_CC_ADDRESS_COUNTRY_TXT").val(entry.billCountry).addClass('nameSelected');
				} else
					$("input#AIR_CC_ADDRESS_COUNTRY_TXT").val(entry.billCountry).removeClass('nameSelected');
			}
		},
		toggleMandatoryBorder: function(evt,args){		
			if(undefined != args.mandatory){
				if(this.utils.booleanValue(args.mandatory)){	
					var domElement = document.getElementById(args.id);
					if(domElement!=null){
						if(domElement.value==""){
							domElement.className=domElement.className.trim()+" mandatory";
						}
						else{
							if(domElement.className.indexOf("mandatory")!= -1){
								var classy = domElement.className.replace(/\bmandatory\b/g,'');
								domElement.className = classy;
							}
						}
					}			
				}				
			}else{
				var domElement = document.getElementById(args.id);
				if(domElement!=null){
					if(domElement.value==""){
						domElement.className=domElement.className.trim()+" mandatory";
					}
					else{
						if(domElement.className.indexOf("mandatory")!= -1){
							var classy = domElement.className.replace(/\bmandatory\b/g,'');
							domElement.className = classy;
						}
					}
				}
			}						
		},

		/**
		 * function used to fetch data related to middle name
		 * @param args JSON object with apisSectionBean and traveller
		 * @return JSON object
		 */
		_getMiddleNameInfo: function(args) {

			var response = {};
			if (!this.utils.isEmptyObject(args.apisSectionBean) 
				&& !this.utils.isEmptyObject(args.apisSectionBean.hasPrimaryTravelDocumentsInDataMap) 
				&& !this.utils.isEmptyObject(args.apisSectionBean.listPrimaryTravelDocuments)) {


				for (var doc in apisSectionBean.listPrimaryTravelDocuments) {
					
					var apisEntryBean = doc;
					var ApisPSPT = 'FALSE';
					response.identityDocument = doc.identityDocument;

					if (apisEntryBean.index <= 5 && apisEntryBean.structureIdAttributes.enabled == "Y") {
						if (apisEntryBean.structureIdAttributes.PSPTRequirement == 'OPTIONAL' 
							|| apisEntryBean.structureIdAttributes.PSPTRequirement == 'MANDATORY') {
							ApisPSPT = 'TRUE';
						}

						if (!(ApisPSPT == 'FALSE' && apisSectionBean.hasIdenOrNatn)) {
							response.mandatorySec = apisEntryBean.structureIdAttributes.mandatory;
							var enabledMiddleName = identityDocument.middleNameAttributes.enabled;
							response.mandatoryMiddleName = identityDocument.middleNameAttributes.mandatory;

							var flowSuffix = '';
							if (this.data.rqstParams.flowType.code == 'STANDARD_FLOW') {
								flowSuffix = 'BK';
							} else {
								flowSuffix = 'RT';
							}

							var apisIndex = apisEntryBean.index;
							var id = "PSPT_" + flowSuffix + "_" + apisEntryBean.target.type + "_" + apisEntryBean.target.value + "_" + apisIndex;
							
							response.idDocuMNameField = '';
							if (args.traveller.paxType.code != 'INF') {
								response.idDocuMNameField = "IDENTITY_DOCUMENT_MIDDLE_NAME_" + args.traveller.paxNumber + "_" + id;
							} else {
								response.idDocuMNameField = "INFANT_IDENTITY_DOCUMENT_MIDDLE_NAME_" + args.traveller.paxNumber + "_" + id;
							}

							if (enabledMiddleName == "Y" && identityDocument.category == "PSPT") {
								this.setMiddleNameDisplayed(true);
								response.enabledMiddleName = true;
								response.sendMandatoryInfo = this.data.sendMandatoryInfo;
							}
						}
					}

				}
			}

			return response;
		},

		/**
		 * read last name from scope and use that for prefilling
		 * @param args JSON Object with paramters
		 * @return response JSON object
		 */
		_getLastNameFromScope: function(args) {
			var response = {};
			if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") {
				response.lnameField = "LAST_NAME_"+this.data.rqstParams.USER_ID;
				response.lnameSet = "SET_LAST_NAME_"+this.data.rqstParams.USER_ID;
				if (!this.utils.isEmptyObject(this.data.rqstParams.LAST_NAME) 
					&& this.data.rqstParams.LAST_NAME.indexOf("undefined") == -1 ) {
					response.lnameFromScope = this.data.rqstParams.LAST_NAME;
				} else if (this.data.rqstParams.LAST_NAME_1 != null 
						&& this.data.rqstParams.LAST_NAME_1.indexOf("undefined") == -1 ) {
					response.lnameFromScope = this.data.rqstParams.LAST_NAME_1;
				}
			} else if (this.data.earlyLogin == "YES" ) {
				response.lnameField = "LAST_NAME_"+this.data.rqstParams.USER_ID_1;
				response.lnameSet = "SET_LAST_NAME_"+this.data.rqstParams.USER_ID;
				response.lnameFromScope = this.data.rqstParams.LAST_NAME_1;
			} else {
				response.lnameField = "LAST_NAME_" + args.traveller.paxNumber;
				response.lnameSet = "SET_LAST_NAME_" + this.data.rqstParams.USER_ID;

				if (this.data.paxLastName != null) {
					response.lnameFromScope = this.data.paxLastName;
				}
			}
			
			return response;
		},

		/**
		 * read first name from scope and use that for prefilling
		 * @param args JSON Object with paramters
		 * @return response JSON object
		 */
		_getFirstNameFromScope: function(args) {

			var response = {
				fnameFromScope: ''
			};
			if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage") {
				response.fnameField = "FIRST_NAME_"+this.data.rqstParams.USER_ID
				response.fnameSet = "SET_FIRST_NAME_"+this.data.rqstParams.USER_ID;
				if (!this.utils.isEmptyObject(this.data.rqstParams.FIRST_NAME) 
					&& this.data.rqstParams.FIRST_NAME.indexOf("undefined") == -1)  {
					response.fnameFromScope = this.data.rqstParams.FIRST_NAME;
				} else if (this.data.rqstParams.FIRST_NAME_1 != null 
					&& this.data.rqstParams.FIRST_NAME_1.indexOf("undefined") == -1) {
					response.fnameFromScope = this.data.rqstParams.FIRST_NAME_1;
				}
			} else if (this.data.earlyLogin == "YES" ) {
				response.fnameField = "FIRST_NAME_"+ this.data.rqstParams.USER_ID_1;
				response.fnameSet = "SET_FIRST_NAME_"+ this.data.rqstParams.USER_ID_1;
				response.fnameFromScope = this.data.rqstParams.FIRST_NAME_1;
			} else {
				response.fnameField = "FIRST_NAME_"+ args.traveller.paxNumber;
				response.fnameSet = "SET_FIRST_NAME_"+ args.traveller.paxNumber;
				if (this.data.paxFirstName != null) {
					response.fnameFromScope = this.data.paxFirstName;
				}
			}

			return response;
		},

		/**
		 * function used to decide if title field has to be shown in UI
		 * @return boolean true if title is enabled
		 */
		_isTitleEnabled: function(args) {
			return !this.utils.isEmptyObject(args.titleProfileField) 
				&& args.titleProfileField.enabled || this.data.directLogin == "YES" 
				&& this.data.flowFrom === "profilePage" || this.data.earlyLogin == "YES";
		},

		/**
		 * read title from scope and use that for prefilling
		 * @param args JSON Object with paramters
		 */
		_getTitleFromScope: function(args) {
			
			var titleFromScope = "";
			if (this.data.rqstParams.requestBean[args.titleField] != null) {
				titleFromScope = this.data.rqstParams.requestBean[args.titleField];
			}
			var paxNumberKey = false; 
			if (!this.utils.isEmptyObject(args.traveller)){
				if(args.traveller.paxNumber == 1){
					paxNumberKey = true;
				}
			}

			
			if (titleFromScope == "" 
				&& this.data.rqstParams.loginProfilesBean.travellersList != null 
				&& this.data.rqstParams.loginProfilesBean.travellersList[0] != null 
				&& this.data.rqstParams.loginProfilesBean.travellersList[0].titleCode != null 
				&& paxNumberKey) {
				
				titleFromScope = this.data.rqstParams.loginProfilesBean.travellersList[0].titleCode;
				if (titleFromScope.indexOf('Dummyvalue') != -1 || titleFromScope.indexOf('dummyValue') != -1){
					titleFromScope = "";
				}
			}

			if (titleFromScope == "") {
				if (!this.utils.isEmptyObject(this.data.rqstParams.titleFromSession) && args.traveller.paxNumber == 1) {
					titleFromScope = this.data.rqstParams.titleFromSession;
				}
			}
			
			if (titleFromScope == "") {
				if (!this.utils.isEmptyObject(this.data.paxTitleCode)) {
					titleFromScope = this.data.paxTitleCode;
				}
			}

			if (titleFromScope == "") {
				if (this.data.siteParameters.siteTitleDefaultSelect == 'TRUE') {
					titleFromScope = this.data.rqstParams.titlesMap['MR'].label;
				}
			}

			if (titleFromScope =="") {
				if ((this.data.directLogin == "YES" 
					&& this.data.flowFrom === "profilePage") 
					&& this.data.rqstParams.TITLE_1.indexOf("undefined") == -1) {
					titleFromScope = this.data.rqstParams.TITLE_1;
				} else if (this.data.earlyLogin == "YES" && this.data.rqstParams.TITLE_1.indexOf("undefined") == -1) {
					titleFromScope = this.data.rqstParams.TITLE_1;
				}
			}

			return titleFromScope;
		},

		/**
		 * function to check if nationality is enabled
		 * @return boolean true if enabled
		 **/
		_isNationalityEnabled: function() {
			return this.data.directLogin != "YES" && this.data.flowFrom === "profilePage" || this.data.earlyLogin == null;
		},


		formatDate: function(day, month, year) {
			
			if (parseInt(day) < 10)
				day = "0" + day;
			if (month < 10) {
				month = month.toString();
				month = "0" + month;
			} else {
				month = month.toString();
			}
			var dateOfBirth = year + month + day + "0000";
			return dateOfBirth;

		
		},

		pspt_dob: function(travellerIndex){
			var day = document.getElementById("paxDobDay_"+travellerIndex).value;
			var month = document.getElementById("paxDobMonth_"+travellerIndex).value;
			var monthInt = parseInt(month) + 1;
			var year = document.getElementById("paxDobYear_"+travellerIndex).value;
			var updatedDOB=this.formatDate(day, monthInt, year);

			var dobElement = document.getElementById("IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+travellerIndex+"_"+this.data.id);
			if(dobElement!=null){
				dobElement.value = updatedDOB;
			}

		},

		getDateFromflightTimeFromParam : function(flightTimeFromParam){
			dateTwo = flightTimeFromParam.substr(0,10);
			dateTwo = dateTwo+"T";
			dateTwo = dateTwo+flightTimeFromParam.substr(11,18);
			dateTwo = new Date(dateTwo).getTime();
			return dateTwo;
		}
	}
});