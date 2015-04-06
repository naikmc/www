Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisPsptScript',
	$dependencies: [
		'modules.view.merci.segments.booking.scripts.MBookingMethods'
	],
	$constructor: function() {
		pageObj = this;
		this.id = "";
		this.idDocuDOBField = "";
	},

	$prototype: {

		$dataReady: function() {
			this.bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
			this.utils = modules.view.merci.common.utils.MCommonScript;
		},

		$displayReady: function() {
			var fieldsArray=['idDocuMNameField','idGender','idDocuNationalityField','idDocuDocTypeField','idDocuDocNumberField','idDocuIssCountryField'];
			for(f in fieldsArray){
				var fieldName=document.getElementById(fieldsArray[f]);
				if(fieldName!=null){
					this.toggleMandatoryBorder(null, {id : fieldName.value});
				}
			}
		},

		$viewReady: function() {

			args = {
				date: "Day_" + this.idDocuDOBField,
				month: "Month_" + this.idDocuDOBField,
				year: "Year_" + this.idDocuDOBField,
				fieldToSetValueIn: this.idDocuDOBField
			};
			this.pspt_frameDOB(null, args);

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiApisPspt",
						data:this.data
					});
			}
		},

		setDayField: function(event, args) {

			// set value for pax DOB
			var fieldName = '';
			if (this.data.infant == null) {
				fieldName = 'paxDobDay_' + this.data.traveller.paxNumber;
			} else {
				fieldName = 'infantDobDay_' + this.data.infant.infantNumber;
			}

			var fieldEL = document.getElementsByName(fieldName);
			if (fieldEL != null && fieldEL.length > 0 && event.target != null) {
				fieldEL[0].value = event.target.getValue();
			}

			// framing DOB for apis
			this.pspt_frameDOB(event, args);
		},

		setMonthField: function(event, args) {

			// set value for pax DOB
			var fieldName = '';
			if (this.data.infant == null) {
				fieldName = 'paxDobMonth_' + this.data.traveller.paxNumber;
			} else {
				fieldName = 'infantDobMonth_' + this.data.infant.infantNumber;
			}

			var fieldEL = document.getElementsByName(fieldName);
			if (fieldEL != null && fieldEL.length > 0 && event.target != null) {
				fieldEL[0].value = event.target.getValue();
			}

			// framing DOB for apis
			this.pspt_frameDOB(event, args);
		},

		setYearField: function(event, args) {

			// set value for pax DOB
			var fieldName = '';
			if (this.data.infant == null) {
				fieldName = 'paxDobYear_' + this.data.traveller.paxNumber;
			} else {
				fieldName = 'infantDobYear_' + this.data.infant.infantNumber;
			}

			var fieldEL = document.getElementsByName(fieldName);
			if (fieldEL != null && fieldEL.length > 0 && event.target != null) {
				fieldEL[0].value = event.target.getValue();
			}

			// framing DOB for apis
			this.pspt_frameDOB(event, args);
		},

		getMiddleNameDisplayed: function() {
			var middleNameDisplayed = false;
			if (!this.utils.isEmptyObject(this.moduleCtrl.getValuefromStorage("middleNameDisplayed"))) {
				middleNameDisplayed = this.moduleCtrl.getValuefromStorage("middleNameDisplayed");
			}
			return middleNameDisplayed;
		},

		pspt_frameDOB: function(ATarg, args) {
			this.bookUtil.pspt_frameDOB(ATarg, args);
		},

		fillNationalityValues: function(event,args){
			if(args.org=="TRUE"){
			 if(args.docCheck=='Y'){
				if(document.getElementById('NATIONALITY_'+args.paxno)!=null){
				 document.getElementById('NATIONALITY_'+args.paxno).value = document.getElementById(args.id).value;
				}else{
					var m_Cabin = document.createElement('input');
					m_Cabin.type = 'hidden';
					m_Cabin.name = 'NATIONALITY_'+args.paxno;
					m_Cabin.id = 'NATIONALITY_'+args.paxno;
					m_Cabin.value = document.getElementById(args.id).value;
					var formDom = document.getElementById("alpiForm");
	                formDom.appendChild(m_Cabin);
				 }
				}else{
					if(document.getElementById('INFANT_NATIONALITY_'+args.paxno)!=null){
						 document.getElementById('INFANT_NATIONALITY_'+args.paxno).value = document.getElementById(args.id).value;
						}else{
							var m_Cabin = document.createElement('input');
							m_Cabin.type = 'hidden';
							m_Cabin.name = 'INFANT_NATIONALITY_'+args.paxno;
							m_Cabin.id = 'INFANT_NATIONALITY_'+args.paxno;
							m_Cabin.value = document.getElementById(args.id).value;
							var formDom = document.getElementById("alpiForm");
			                formDom.appendChild(m_Cabin);
						}
				}
			}
			this.toggleMandatoryBorder(event,args);

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
		}
	}
});