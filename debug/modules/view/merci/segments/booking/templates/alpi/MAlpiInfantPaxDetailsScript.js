Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiInfantPaxDetailsScript',
	$constructor: function() {
		pageObj = this;
		anotherPageObj = this;
		ariaAutoCompleteInfantScope = this;
	},

	$prototype: {


		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this.bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
		},

		$viewReady:function(){
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiInfantPaxDetails",
						data:this.data
					});
			}
		},

		selectFromARIA: function(event, ui) {
			var current = this;
			var moduleCtrl = this.moduleCtrl;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			var siteParam = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam;
			var param = this.data.rqstParams;
			var fname = "";
			var nm = this.getInfNameList();
			var namesList = new Array();
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
					window.location = siteParam.siteAppCallback + "://?flow=passengerpage/contactIndex=" + index + "|selectedIndex=" + selIndex + "|firstName=" + fname + "|INF";
				} else {
					var entry = window.localStorage.getItem("Contacts:" + selIndex);
					if (entry != null) {
						current.setPassengerInfCriteria(entry, index, selIndex);
					}
				}
			};

		},

		getInfNameList: function() {
			var retainSrch = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam.siteRetainSearch;
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();

			if ((retainSrch.toLowerCase() == "true") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
				if (this.moduleCtrl.getModuleData().booking.MALPI_A != null) {
					var firstNameList = [],
						i, key;
					var lastNameList = [],
						j;
					var firstNameJsonList = [];
					if (null != bp[14] && bp[14] != "" && this.data.rqstParams.retainAppCriteria == "TRUE") {
						var psgrAppJson = $('#app_json_data').val();

						if ("" != psgrAppJson) {
							var temp = JSON.parse(psgrAppJson);

							if (null != temp && null != temp.ContactJson && "undefined" != temp.ContactJson) {
								psgrAppJson = temp.ContactJson;
								firstNameList = psgrAppJson.split(",");
							}
						}
					} else if (this.supports_local_storage() && window.localStorage.getItem("Contacts:index") != null) {
						for (i = 1; i < window.localStorage.getItem("Contacts:index"); i++) {
							if(window.localStorage.getItem("Contacts:" + i) && typeof window.localStorage.getItem("Contacts:" + i) != "undefined"){
								firstNameList.push(JSON.parse(window.localStorage.getItem("Contacts:" + i)).first_name);
							}
						}
					}
					for (var m = 0; m < firstNameList.length; m++) {
						var json = {
							label: firstNameList[m],
							code: firstNameList[m],
							image: {
								show: true,
								css: 'fave'
							}
						}
						firstNameJsonList.push(json);
					}

					var travellerList = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerBean;
					for (j = 0; j < travellerList.length; j++) {
						var pax = travellerList[j];
						if (pax.withInfant) {
							return firstNameJsonList;
						}
					}
				}
			};

		},

		$displayReady: function() {
			var infFNameField = "INFANT_FIRST_NAME_"+ this.data.infant.infantNumber;
			this.toggleMandatoryBorder(null,{id:infFNameField});
			var infLNameField = "INFANT_LAST_NAME_"+ this.data.infant.infantNumber;
			this.toggleMandatoryBorder(null,{id:infLNameField});
			var genderField = "INFANT_IDENTITY_DOCUMENT_GENDER_"+this.data.traveller.paxNumber+"_"+this.data.id
			this.toggleMandatoryBorder(null, {id : genderField});
			var nationalityField = "INFANT_NATIONALITY_"+this.data.traveller.paxNumber;
			var isNationalityFieldMandatory = 'FALSE';
		    if (!this.utils.isEmptyObject(this.data.traveller.identityInformation.nationalityAttributes) && this.data.traveller.identityInformation.nationalityAttributes.enabled == 'Y'){
		    	if (this.data.traveller.identityInformation.nationalityAttributes.mandatory == 'Y'){
		    		isNationalityFieldMandatory = 'TRUE' ;
		    	}
		    }
			this.fillPsptValues(null, {id : nationalityField, mandatory: isNationalityFieldMandatory});
			if(this.data.dobIDENReq!='DISABLED'){
				this.pspt_dob(this.data.traveller.paxNumber);
			}
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

		apisDobEnabled: function() {
			if (this.data.apisSectionBean != null && this.data.apisSectionBean.listPrimaryTravelDocuments != null) {
				for (var i = 0; i < this.data.apisSectionBean.listPrimaryTravelDocuments.length; i++) {
					if (this.data.apisSectionBean.listPrimaryTravelDocuments[i] != null && this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument != null && this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument.dateOfBirthAttributes != null && this.data.apisSectionBean.listPrimaryTravelDocuments[i].identityDocument.dateOfBirthAttributes.IDENRequirement != "DISABLED") {

						return true;
					}
				}
			}

			return false;
		},

		pspt_InfantFirstName: function(event, args) {

			var firstPart = "INFANT_IDENTITY_DOCUMENT_";
			var lastPart = "_PSPT_BK_GLOBAL_DEFAULT_1";

			//first get the alpi infant first name
			var infantAlpiFirstName = document.getElementById(args.firstName);

			//now split the first name
			var infantShort = args.firstName.substr(7);
			var apisFirstName = document.getElementById(firstPart + infantShort + lastPart);
			if (apisFirstName != null && infantAlpiFirstName != null) {
				apisFirstName.value = infantAlpiFirstName.value;
			}
			if(this.utils.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.firstName});
			}
		},

		pspt_InfantLastName: function(atArg, args) {

			var firstPart = "INFANT_IDENTITY_DOCUMENT_";
			var lastPart = "_PSPT_BK_GLOBAL_DEFAULT_1";

			//first get teh alpi infant first name
			var infantAlpiLastName = document.getElementById(args.lastName);

			//now split the last name
			var infantShort = args.lastName.substr(7);
			var apisLastName = document.getElementById(firstPart + infantShort + lastPart);
			if (apisLastName != null && infantAlpiLastName != null) {
				apisLastName.value = infantAlpiLastName.value;
			}
			if(this.utils.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.lastName});
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
			var siteParam = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam;
			if( this.utils.booleanValue(this.data.rqstParams.isSQSARegulnEnabled) && this.utils.booleanValue(siteParam.SAPolicy)){
				if (this.data.rqstParams.listTravellerBean.travellerBean.length > 0){
					var paxno = this.data.rqstParams.listTravellerBean.travellerBean.length;
				}
				this.bookUtil.checkIfDOBlessthan18(event, paxno);
			}
		},

		setPassengerInfCriteria: function(entry, index, selIndex) {
			entry = JSON.parse(entry);
			if (entry != null) {
				$("input#INFANT_FIRST_NAME_" + index).addClass('nameSelected');
				$("span#delINFANT_FIRST_NAME_" + index).removeClass('hidden');
				if (entry.last_name) {
					$("input#INFANT_LAST_NAME_" + index).val(entry.last_name).addClass('nameSelected');
					$("span#delINFANT_LAST_NAME_" + index).removeClass('hidden');
				} else {
					$("input#INFANT_LAST_NAME_" + index).val(entry.last_name).removeClass('nameSelected');
				}
				$("input#SET_INFANT_FIRST_NAME_" + index).val(selIndex);
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
		pspt_dob: function(travellerIndex){
			
			var infDayEl = document.getElementById("infantDobDay_" + travellerIndex);
			var infMonthEl = document.getElementById("infantDobMonth_" + travellerIndex);
			var infYearEl = document.getElementById("infantDobYear_" + travellerIndex);
			
			var day = 0;
			if (infDayEl != null) {
				day = infDayEl.value;
			}
			
			var month = 0;
			if (infMonthEl != null) {
				month = infMonthEl.value;
			}
			
			var monthInt = parseInt(month) + 1;
			
			var year = 0;
			if (infYearEl != null) {
				year = infYearEl.value;
			}
			
			var updatedDOB = this.formatDate(day, monthInt, year);
			var dobElement = document.getElementById("INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_"+travellerIndex+"_"+this.data.id);
			if(dobElement!=null){
				dobElement.value = updatedDOB;
			}
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
		}
	}
});