Aria.classDefinition({
	$classpath: 'modules.view.merci.segments.booking.scripts.MBookingMethods',
	$singleton: true,

	$prototype: {

		/**
		 * this method is used to set preferred contact number
		 * @param prefNumberType
		 */
		setSelectedNumber: function(prefNumberType) {

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

		/**
		 * toggle function used on ALPI page,
		 * used on three tpls 1. MAlpi.tpl, 2. MAlpiContactInfoExtended.tpl 3. MAlpiItineraryRecap.tpl
		 * @param event
		 * @param args
		 */
		toggle: function(event, args) {

			var attrEL = document.getElementById(args.ID1);
			if (attrEL != null) {
				if (attrEL.getAttribute("aria-expanded") == 'false') {
					document.getElementById(args.ID1).setAttribute("aria-expanded", "true");
				} else {
					document.getElementById(args.ID1).setAttribute("aria-expanded", "false");
				}
			}

			if (document.getElementById("section_" + args.ID1) != null) {
				if (document.getElementById("section_" + args.ID1).style.display == "block" || document.getElementById("section_" + args.ID1).style.display == "") {
					document.getElementById("section_" + args.ID1).style.display = "none"
				} else {
					document.getElementById("section_" + args.ID1).style.display = "block"
				}
			}

			if (document.getElementById("pleaseNote_" + args.ID1) != null) {
				if (document.getElementById("pleaseNote_" + args.ID1).style.display == "block" || document.getElementById("pleaseNote_" + args.ID1).style.display == "") {
					document.getElementById("pleaseNote_" + args.ID1).style.display = "none"
				} else {
					document.getElementById("pleaseNote_" + args.ID1).style.display = "block"
				}
			}

			if (document.getElementById("indicates_" + args.ID1) != null) {
				if (document.getElementById("indicates_" + args.ID1).style.display == "block" || document.getElementById("indicates_" + args.ID1).style.display == "") {
					document.getElementById("indicates_" + args.ID1).style.display = "none"
				} else {
					document.getElementById("indicates_" + args.ID1).style.display = "block"
				}
			}
		},

		/**
		 * this function is used to fill passport information
		 * @param event
		 * @param args
		 */
		fillPsptValues: function(event, args) {

			var index = 0;
			var idEL = document.getElementById(args.id);
			if (idEL != null) {
				index = idEL.selectedIndex;
			}

			if (args.field == "gender") {
				this.__setIndex(index, "psptgender" + args.paxno);
			}

			if (args.field == "infant_gender") {
				this.__setIndex(index, "infantpsptgender" + args.paxno);
			}

			if (args.field == "nationality") {
				this.__setIndex(index, "IDENTITY_DOCUMENT_NATIONALITY_" + args.paxno + "_PSPT_BK_GLOBAL_DEFAULT_1");
			}
			if (args.field == "infant_nationality") {
				this.__setIndex(index, "INFANT_IDENTITY_DOCUMENT_NATIONALITY_" + args.paxno + "_PSPT_BK_GLOBAL_DEFAULT_1");
			}
		},

		setDay: function(event, args) {
			var fieldJSON = this.__getAPISJson(args.paxType, args.TravllerIndex);
			var obj = "";
			if (args.paxType == 'P') {
				obj = "paxDobDay_";
			} else if (args.paxType == 'I') {
				obj = "infantDobDay_";
			}

			var dayObj = document.getElementById(obj + args.TravllerIndex);
			var targetDay = document.getElementById(fieldJSON.date);
			if (dayObj != null && targetDay != null) {
				targetDay.value = dayObj.value;
				this.pspt_frameDOB("", fieldJSON);
			}
		},

		setMonth: function(atArg, args) {
			var fieldJSON = this.__getAPISJson(args.paxType, args.TravllerIndex);
			var obj = "";
			if (args.paxType == 'P') {
				obj = "paxDobMonth_";
			} else if (args.paxType == 'I') {
				obj = "infantDobMonth_";
			}

			var monthObj =	document.getElementById(obj + args.TravllerIndex);
			var targetMonth = document.getElementById(fieldJSON.month);
			if (monthObj != null && targetMonth != null) {
				var month = parseInt(monthObj.value);
				targetMonth.value = month;
				this.pspt_frameDOB("", fieldJSON);
			}
		},

		setYear: function(atArg, args) {
			var fieldJSON = this.__getAPISJson(args.paxType, args.TravllerIndex);
			var obj = "";
			if (args.paxType == 'P') {
				obj = "paxDobYear_";
			} else if (args.paxType == 'I') {
				obj = "infantDobYear_";
			}

			var yearObj =	document.getElementById(obj + args.TravllerIndex);
			var targetYear = document.getElementById(fieldJSON.year);
			if (yearObj != null && targetYear != null) {
				targetYear.value = yearObj.value;
				this.pspt_frameDOB("", fieldJSON);
			}
		},
		__getAPISJson: function(paxType, TravllerIndex) {
			var json = {
				date: "",
				month: "",
				year: "",
				fieldToSetValueIn: ""
			};
			var psptConst = "_PSPT_BK_GLOBAL_DEFAULT_1";
			if (paxType == 'P') {
				json.date = "Day_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.month = "Month_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.year = "Year_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.fieldToSetValueIn = "IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
			} else {
				json.date = "Day_INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.month = "Month_INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.year = "Year_INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
				json.fieldToSetValueIn = "INFANT_IDENTITY_DOCUMENT_DATE_OF_BIRTH_" + TravllerIndex + psptConst;
			}
			return json;
		},

		__setIndex: function(index, name) {
			var psptField = document.getElementById(name);
			if (psptField != null) {
				document.getElementById(name).selectedIndex = index;
			}
		},

		__updateDays: function(atArg, args) {
			var cmpDay;
			var cmpMonth;
			var cmpYear;

			if (args.paxType == 'P') {
				var dayTemplate = "paxDobDay_" + args.TravllerIndex;
				var mnthTemplate = "paxDobMonth_" + args.TravllerIndex;
				var yearTemplate = "paxDobYear_" + args.TravllerIndex;
				cmpDay = 	  document.getElementById(dayTemplate);
				cmpMonth =    document.getElementById(mnthTemplate);
				cmpYear = 	   document.getElementById(yearTemplate);
			} else if (args.paxType == 'I') { //traveller is an infant
				var dayTemplate = "infantDobDay_" + args.TravllerIndex;
				var mnthTemplate = "infantDobMonth_" + args.TravllerIndex;
				var yearTemplate = "infantDobYear_" + args.TravllerIndex;
				cmpDay = 	  document.getElementById(dayTemplate);
				cmpMonth =  document.getElementById(mnthTemplate);
				cmpYear = 	document.getElementById(yearTemplate);
			}

			var selectedDate =   cmpDay.value;
			var selectedMonth =  cmpMonth.value;
			var selectedYear =   cmpYear.value;

			/*fix of ptr 04483681*/
			var prevIndex = cmpDay.selectedIndex;

			//if the year value is not an integer
			if (parseInt(selectedYear, 10) <= 0) {
				selectedYear = "";
			}

			var maxDays = this.__getMaxDays(selectedMonth, selectedYear);
			while (cmpDay.options.length > 0) {
				cmpDay.options[0] = null;
			}
			//fill new day dropdown list
			for (var i = 1; i < maxDays + 1; i++) {
				cmpDay.options[i - 1] = new Option(i, i);
				cmpDay.options[i - 1].selected = false;
			}

			if ((cmpDay.options.length - 1) > prevIndex) {
				cmpDay.selectedIndex = prevIndex;
			} else {
				cmpDay.selectedIndex = cmpDay.options.length - 1;
			}
		},

		checkIfDOBlessthan18: function(event, paxno) {

			var todayDate = new Date();
			var dobArray = [] ;
			for (var paxIndex = 1; paxIndex <= paxno; paxIndex++) {
				name = "paxDobDay_" + paxIndex;
				if (document.getElementById(name) != null) {
					var stringDobDay = document.getElementById(name).value;
					if ((stringDobDay != null) && (stringDobDay.length == 1)) {
						stringDobDay = "0" + stringDobDay;
					}
					var stringDobMonth = document.getElementById("paxDobMonth_" + paxIndex).value;
					stringDobMonth = (parseInt(stringDobMonth)).toString();
					if ((stringDobMonth != null) && (stringDobMonth.length == 1)) {
						stringDobMonth = "0" + stringDobMonth;
					}
					var dobValueDate = new Date(document.getElementById("paxDobYear_" + paxIndex).value,stringDobMonth,stringDobDay);
					age = parseInt((todayDate-dobValueDate)/31536000000) ;
					dobArray.push(age);

				}
				/* Infant Section */
				name = "infantDobDay_" + paxIndex;

				if (document.getElementById(name) != null) {
					var stringDobDay = document.getElementById(name).value;
					if ((stringDobDay != null) && (stringDobDay.length == 1)) {
						stringDobDay = "0" + stringDobDay;
					}
					var stringDobMonth = document.getElementById("infantDobMonth_" + paxIndex).value;
					stringDobMonth = (parseInt(stringDobMonth)).toString();
					if ((stringDobMonth != null) && (stringDobMonth.length == 1)) {
						stringDobMonth = "0" + stringDobMonth;
					}
					var dobValueDate = new Date(document.getElementById("infantDobYear_" + paxIndex).value,stringDobMonth,stringDobDay);
					age = parseInt((todayDate-dobValueDate)/31536000000) ;
					dobArray.push(age);
				}
			}

			this.ageLessThan18 = true ;
			for(var i=0;i<dobArray.length;i++){
				if(dobArray[i]<18){
					this.ageLessThan18 = true ;
					break;
				}
				this.ageLessThan18=false;
			}
			var btnConfirm = document.getElementsByClassName('submitAlpiButton');
			if(this.ageLessThan18==true){
				document.getElementById('Above18').style.display = 'block' ;
				for (var i = 0; i<btnConfirm.length; i++) {
						btnConfirm[i].className += " disabled";
						btnConfirm[i].disabled=true;
					}
			}
			else{
			/*	document.getElementById('checkAbove18Box').checked=true; */
				document.getElementById('Above18').style.display = 'none';


				for (var i = 0; i<btnConfirm.length; i++) {
					btnConfirm[i].className = btnConfirm[i].className.replace(/(?:^|\s)disabled(?!\S)/g, '');
					btnConfirm[i].disabled=false;
				}
			}
		},

		__getMaxDays: function(numMonth, numYear) {
			var nbDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			if (numMonth != 1 || numYear == "") {
				return nbDays[numMonth];
			} else {
				if (numYear == 4 * Math.round(numYear / 4)) {
				return 29;
				} else {
					return 28;
				}
			}
		},
		pspt_frameDOB: function(ATarg, args) {
			var year = document.getElementById(args.year);
			var yearValue = "";
			if (year != null) {
				yearValue = year.value;
			}
			//get date
			var date =  document.getElementById(args.date);
			var dateValue =    "";
			if (date != null) {
				if (date.value.length == 1) {
					dateValue = "0" + date.value;
				} else { /*PTR 07611642 [Medium]: Recovery for MOBILE-SV: Error message appearance with Oct-Dec*/
					dateValue = date.value;
				}
			}

			//get month
			var month =    document.getElementById(args.month);
			var monthValue = 	"";
			if (month != null) {
				if (month.value.length == 1) {
					monthValue = "0" + month.value
				} else { /*PTR 07611642 [Medium]: Recovery for MOBILE-SV: Error message appearance with Oct-Dec*/
					monthValue = month.value;
				}
			}
			//get the fieldname
			//now as we have the date month year set the value in actual field
			var  fieldName = document.getElementById(args.fieldToSetValueIn);
			//alert('before setting the value '+ fieldName.value );
			if (fieldName != null) {
				fieldName.value = yearValue + monthValue + dateValue + "0000";
			}
		},

		//New function to go restart booking. Fix as part of PTR: 07428398
		openUrl: function(args) {
			if ((args.searchUrl != '') || (args.searchUrl != null)) {
				window.location.href = args;
			  } else {
				this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
			  }
		}
	}
});