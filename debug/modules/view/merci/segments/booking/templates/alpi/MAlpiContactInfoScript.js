Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.MAlpiContactInfoScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$prototype: {


		$dataReady: function() {
			this.mFunc = modules.view.merci.common.utils.MCommonScript;
		},

		$displayReady: function() {			
			this.toggleMandatoryBorder(null,{id: "CONTACT_POINT_HOME_PHONE", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_CONTACT_POINT_HOME_PHONE"].mandatory});
			this.toggleMandatoryBorder(null,{id: "CONTACT_POINT_MOBILE_1", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_CONTACT_POINT_MOBILE_1"].mandatory});
			this.toggleMandatoryBorder(null,{id: "CONTACT_POINT_BUSINESS_PHONE", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_CONTACT_POINT_BUSINESS_PHONE"].mandatory});
			this.toggleMandatoryBorder(null,{id: "NOTIF_VALUE_1_1", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_NOTIF_VALUE_1"].mandatory});
			this.toggleMandatoryBorder(null,{id: "CONTACT_POINT_EMAIL_1", mandatory: this.data.rqstParams.profileFieldsAccessor["SITE_CONTACT_POINT_EMAIL_1"].mandatory});
		},

		$viewReady:function(){
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiContactInfo",
						data:this.data
					});
			}
		},

		updateContactHeaderPanel: function(evt, args) {
			this.prefillSMSNumber();
			if(this.mFunc.booleanValue(args.mandatory)){
				this.toggleMandatoryBorder(null,{id:args.id});
			}
		},

		clrSelected: function(atArg, args) {
			var name = document.getElementById(args.name).value;
			if (name != null && name == "")
				$('#' + args.name).removeClass('nameSelected');
			this.showCross(event, args);
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
			if(this.mFunc.booleanValue(args.mandatory)){				
				this.toggleMandatoryBorder(null,{id:args.id});
			}
			if(args.id == 'CONTACT_POINT_MOBILE_1'){
				var mob_phone_id = document.getElementById("NOTIF_VALUE_1_1");
				mob_phone_id.value='';
				mob_phone_id.className = mob_phone_id.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
			}
		},
		toggleMandatoryBorder: function(evt,args){		
			if(undefined != args.mandatory){
				if(this.mFunc.booleanValue(args.mandatory)){	
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
		prefillSMSNumber: function(){
			var select = document.getElementById("CONTACT_POINT_MOBILE_1");
			var answer = "";
			if(select != null){
				var answer = select.value;						
				if(answer != null){					
					var sms_notif_id =  document.getElementById("NOTIF_VALUE_1_1");
					if (sms_notif_id != null) {						
						var inital_number =  answer.substring(0, 2);
						var sms_notif_val = answer;
						if(inital_number == "00"){		
							sms_notif_id.value = answer;
						}
						else if(answer != ""){
							var str1 = "00" ; 
							if(answer.indexOf('+')!=-1){
								answer=answer.replace('+', '');
							}
							sms_notif_id.value = str1.concat(answer);
						}
					}
				}
			}	
		},
		
		/**
		 * get css field for phone numbers based on number of field enabled in UI
		 * @return String
		 */
		_getPhoneNoCss: function() {
			var homePhone = this.data.rqstParams.profileFieldsAccessor['SITE_CONTACT_POINT_HOME_PHONE'];
			var mobilePhone = this.data.rqstParams.profileFieldsAccessor['SITE_CONTACT_POINT_MOBILE_1'];
			var businessPhone = this.data.rqstParams.profileFieldsAccessor['SITE_CONTACT_POINT_BUSINESS_PHONE'];
			
			var count = 0;
			if (homePhone.enabled) {
				count++;
			}
			if (mobilePhone.enabled) {
				count++;
			}
			if (businessPhone.enabled) {
				count++;
			}
			
			// divide by 0 check
			if (count == 0) {
				count = 1;
			}
			
			return 'field-' + (12/count);
		},
		
		/**
		 * get css field for sms and email based on number of field enabled in UI
		 * @return String
		 */
		_getOtherContactCss: function() {
			var sms = this.data.rqstParams.profileFieldsAccessor['SITE_NOTIF_VALUE_1'];
			var email = this.data.rqstParams.profileFieldsAccessor['SITE_CONTACT_POINT_EMAIL_1'];
			
			var count = 0;
			if (sms.enabled) {
				count++;
			}
			if (email.enabled) {
				count++;
			}
			
			// divide by 0 check
			if (count == 0) {
				count = 1;
			}
			
			return 'field-' + (12/count);
		}
	}
});