Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoExtendedScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		preferredNumbersMap = {};
		countryCallingCodeMap = {};
		preferredNumbersArray = new Array();
		this.utils = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {


		$dataReady: function() {

			var i = 0;
			var key = "";
			var value = "";
			var langNumbersAllowedArray = this.data.siteParameters.langNumbersAllowed.split(",");

			for (numberItem in langNumbersAllowedArray) {
				var numberElem = langNumbersAllowedArray[numberItem].split(":");
				key = numberElem[0];
				value = numberElem[1];
				preferredNumbersMap[key] = value;
				preferredNumbersArray[i] = new Array(numberElem[0], numberElem[1]);
				i++;
			}

			for (countryCode in this.data.gblLists.slCountryCallingCodes) {
				key = this.data.gblLists.slCountryCallingCodes[countryCode][0];
				value = this.data.gblLists.slCountryCallingCodes[countryCode][2];
				countryCallingCodeMap[key] = value;
			}

			this._merciFunc = modules.view.merci.common.utils.MCommonScript;

			if (this.data.rqstParams.CONTACT_POINT_PHONE_TYPE != undefined && !this.utils.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_TYPE) && this.data.rqstParams.CONTACT_POINT_PHONE_TYPE != "") {
				if (this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints[this.data.rqstParams.CONTACT_POINT_PHONE_TYPE] === undefined) {
					if (this.data.rqstParams.CONTACT_POINT_PHONE_TYPE === "M") {
						var M1 = {};
						M1.code = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE + "1";
						M1.description = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER;
						this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints.M1 = M1;
					} else if (this.data.rqstParams.CONTACT_POINT_PHONE_TYPE === "H") {
						var H1 = {};
						H1.code = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE + "1";
						H1.description = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER;
						this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints.H1 = H1;
					} else if (this.data.rqstParams.CONTACT_POINT_PHONE_TYPE === "O") {
						var O1 = {};
						O1.code = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE + "1";
						O1.description = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER;
						this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints.O1 = O1;
					}
				}

			} else if (this.utils.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_TYPE) && !this.utils.isEmptyObject(this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER)) {
				var H1 = {};
				H1.code = this.data.rqstParams.CONTACT_POINT_PHONE_TYPE + "1";
				H1.description = this.data.rqstParams.CONTACT_POINT_PHONE_NUMBER;
				this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints.H1 = H1;
			}
		},

		$viewReady: function() {
			this.showSelectedNumber();
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiContactInfoExtended",
						data:this.data
					});
			}
		},

		$displayReady: function(){
			this.toggleMandatoryBorder(null,{id: "PHONE_NUMBER", mandatory: true});			
			this.toggleMandatoryBorder(null,{id: "COUNTRY" ,mandatory: true});
			this.toggleMandatoryBorder(null,{id: "CONTACT_POINT_EMAIL_1", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_CONTACT_POINT_EMAIL_1"].mandatory});
			this.toggleMandatoryBorder(null,{id: "NOTIF_VALUE_1_1", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_NOTIF_VALUE_1"].mandatory});
		},
		updateContactHeaderPanel: function(evt,args) {			
			if(this._merciFunc.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.id});
			}
		},
		sortJSON: function(data, key) {
			return data.sort(function(a, b) {
				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		},


		getCountryList: function() {
			var countryList = new Array();
			var countryName, countryCode;
			if (this.data.htmlBean != null) {
				var direction = this.data.htmlBean.dir;
			} else {
				var direction = "";
			}
			// iterate on country global list
			for (countryItem in this.data.gblLists.countryList) {

				// read from global list
				countryCode = this.data.gblLists.countryList[countryItem][0];
				countryName = this.data.gblLists.countryList[countryItem][1];

				var countryText = countryName;
				var callingCode = countryCallingCodeMap[countryCode];

				if (callingCode != null && callingCode != "") {
					if (direction == 'rtl') {
						countryText = countryName + "-" + callingCode;
					} else {
						countryText = countryName + " (+" + callingCode + ")";
					}
				}

				countryName = countryText;
				if (countryName != undefined && countryName.indexOf("&#039;") != -1) {
					countryName = countryName.replace("&#039;", "'");
				}

				countryCode = "+" + callingCode;
				//countryList.push(countryName);
				countryList.push({
					code: countryCode,
					label: countryName
				});
			}
			// PTR 08419977
			countryList = this.sortJSON(countryList, 'code');
			return countryList;
		},

		createSourceList: function() {
			var sourceList = new Array();
			for (country in this.data.gblLists.slCountryCallingCodes) {
				key = this.data.gblLists.slCountryCallingCodes[country][1];
				value = this.data.gblLists.slCountryCallingCodes[country][2];
				sourceList.push(key + "(" + value + ")");
			}
			return sourceList;
		},

		/*	New Function to format phone number by taking (+countrycode), area code and phone number.
				After formation of new phone number, send this as part of other phone number fields so as
				to do server side validation. Fix as part of PTR: 05602147
		*/
		showSelectedNumber: function() {
			var DD = document.getElementById('PREFERRED_PHONE_NO');
			var phoneNumber = document.getElementById("PHONE_NUMBER");
			if (DD != null && phoneNumber != null) {
				var DDVal = DD.value;
				if (DDVal == "O")
					DDVal = "B";
				DDVal = DDVal + "1";
				var phNo = null;
				if (this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation != null) {
					phNo = this.data.rqstParams.listTravellerBean.primaryTraveller.identityInformation.contactPoints;
					if (phNo != null) {
						if (phNo[DDVal] != null) {
							var temp = phNo[DDVal].description;
							temp = temp.substring(temp.lastIndexOf("-") + 1, temp.length);
							phoneNumber.value = temp;
						} else {
							phoneNumber.value = "";
						}
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
			var apnCheck = this.data.siteParameters.isApnSupported;
			if (this._merciFunc.booleanValue(apnCheck)) {
				var index = (phone_number.split("-")).length - 1;
				for (var i = 0; i < index; i++) {
					phone_number = phone_number.replace("-", "");
				}
			}

			/* Send hidden parameters based on selected preferred phone type. Fix as part of PTR: 05625982*/
			/* Fix to format validation conditions for various phones and country. PTR: 05691338 */
			var selectedPhoneType = document.getElementById("PREFERRED_PHONE_NO").value;

			if (selectedPhoneType == "H") {
				document.getElementById("CONTACT_POINT_HOME_PHONE").value = phone_number;
				document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "true,1023,false,0,false,117311,false,0,false,0,true,117311";
				document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
				document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "false,1043,false,0,false,117312,false,0,false,0,false,0";
				document.getElementById("validationListForCOUNTRY").value = "true,1023,false,0,false,0,false,0,false,0,true,1023";
			} else if (selectedPhoneType == "M") {
				document.getElementById("CONTACT_POINT_MOBILE_1").value = phone_number;
				document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "true,2130007,false,0,false,117311,false,0,false,0,true,117311";
				document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "false,1023,false,0,false,0,false,0,false,0,false,0";
				document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "false,1043,false,0,false,117312,false,0,false,0,false,0";
				document.getElementById("validationListForCOUNTRY").value = "true,2130007,false,0,false,0,false,0,false,0,true,2130007";
			} else if (selectedPhoneType == "O") {
				document.getElementById("CONTACT_POINT_BUSINESS_PHONE").value = phone_number;
				document.getElementById("validationListForCONTACT_POINT_BUSINESS_PHONE").value = "true,1043,false,0,false,117312,false,0,false,0,true,117311";
				document.getElementById("validationListForCONTACT_POINT_MOBILE_1").value = "false,2130007,false,0,false,117311,false,0,false,0,false,0";
				document.getElementById("validationListForCONTACT_POINT_HOME_PHONE").value = "false,1023,false,0,false,0,false,0,false,0,false,0";
				document.getElementById("validationListForCOUNTRY").value = "true,1043,false,0,false,0,false,0,false,0,true,1043";
			}
		},
		clrSelected: function(atArg, args) {
			if (args.name != null) {
				var name = document.getElementById(args.name).value;
				if (name != null && name == "")
					$('#' + args.name).removeClass('nameSelected');
				this.showCross(atArg, args);
			}
		},
		prefillSMSNumber: function(){
			var select = document.getElementById("PREFERRED_PHONE_NO");
			if(select.options != undefined){
				var answer = select.options[select.selectedIndex].value;
			}
				
			if(answer == "M" || select.value=="Mobile" || "M" ){
				var country_id= document.getElementById("COUNTRY");
				var area_id=document.getElementById("AREA_CODE");
				var mob_phone_id = document.getElementById("PHONE_NUMBER");
				var sms_notif_id =  document.getElementById("NOTIF_VALUE_1_1");
				if (mob_phone_id != null && sms_notif_id != null) {
					var mobile_phone_val = mob_phone_id.value;
					if(mobile_phone_val != ""){
						var str1 = "00" ; 
						var country_val="";
						if(country_id!=null){
							if(country_id.value.charAt(0)=='+'){
								country_val=country_id.value.substring(1,country_id.value.length);							
							}
							else{
								country_val=country_id.value;								
							}
						}
						var area_val="";
						if(area_id!=null){
							area_val=area_id.value;
						} 
						str1=str1+country_val+area_val;
						sms_notif_id.value = str1.concat(mobile_phone_val);
						if (sms_notif_id.value.indexOf('+')!=-1){
							sms_notif_id.value=sms_notif_id.value.replace('+','');
						}
					}
				}
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
			if(this._merciFunc.booleanValue(args.mandatory)){				
				this.toggleMandatoryBorder(null,{id:args.id});
			}
			if(args.id == 'PHONE_NUMBER'){
				var mob_phone_id = document.getElementById("NOTIF_VALUE_1_1");
				mob_phone_id.value='';
				mob_phone_id.className = mob_phone_id.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
			}
		},

		hideCrossIcon: function(event, args) {
			setTimeout(function() {
				var delEL = document.getElementById('del' + args.id);
				delEL.className += ' hidden';	
			}, 500);		
		},

		/*	New funciton to set selected preferred phone type as preferred phone number.
				Fix as part of PTR: 05602147  */
		setSelectedNumber: function(event) {
			this.showSelectedNumber();
			// get prefferred number type
			var prefNumberType = null;
			var el = document.getElementById('PREFERRED_PHONE_NO');
			if (el != null) {
				prefNumberType = el.value;
			}

			var hmePhoneElement = document.getElementById("validateHmePhne");
			var mblPhoneElement = document.getElementById("validateMblePhne");
			var offPhoneElement = document.getElementById("validateBusinessPhne");

			if (mblPhoneElement != null) {
				mblPhoneElement.value = false;
			}

			if (hmePhoneElement != null) {
				hmePhoneElement.value = false;
			}

			if (offPhoneElement != null) {
				offPhoneElement.value = false;
			}

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
		toggleMandatoryBorder: function(evt,args){
			//function added to prefill the SMS Notification Number CR 8840420
			if(args.id=="COUNTRY"||args.id=="AREA_CODE"||args.id=="PHONE_NUMBER"){
			this.prefillSMSNumber();		
			}
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
		}
	}
});