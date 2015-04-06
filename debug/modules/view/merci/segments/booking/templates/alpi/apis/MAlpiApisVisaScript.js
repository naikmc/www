Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisVisaScript',
	$dependencies: ['modules.view.merci.segments.booking.scripts.MBookingMethods'],
	$constructor: function() {
		this.bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$displayReady: function() {},

		$viewReady: function(){
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiApisVisa",
						data:{}
					});
			}
		},

		docEnabledCheck: function(ATarg, args) {
			var displayMandatory = "false";
			//proceed furhter if and only if the doc type is enabled
			if (args.isDocEnabled == "true") {
				//first get the field tag names and span tag names 
				var fieldNames = document.getElementById(args.docTypeKey + "_field_" + args.paxIdPaxType);
				var spanTagNames = document.getElementById(args.docTypeKey + "_span_" + args.paxIdPaxType);
				var uniqueFieldNames = fieldNames.value;
				uniqueFieldNames = uniqueFieldNames.split(",");
				var i=0;
				//alert("uniqueFieldNames " +  uniqueFieldNames);
				for (i = 0; i < uniqueFieldNames.length; i++) {
					if (uniqueFieldNames[i].length > 0 && uniqueFieldNames[i] != "") {
						//now get the field value for the corresponding field name 
						var uniqueFieldValue = document.getElementById(uniqueFieldNames[i]);
						uniqueFieldValue = uniqueFieldValue.value;
						if (uniqueFieldValue.length > 0 && uniqueFieldValue != "") {
							displayMandatory = "true";
							break;
						} //end if
					} //end if
				} //end for 

				/************************************************************************************************************/
				/**************START: LOGIC to display mandatory symbol and setting valiadation field to true    ************/
				/************************************************************************************************************/
				//here we have 2 if's first if is for to display mandatory symbol seding doc type key and setting the 
				//mandatory fields to true and second if to do the reverse ie dont display mandatory 
				//based on the result decide whether we have to display * or not 
				//as true display which ever is mandatory
				if (displayMandatory == "true") {
					/***************************************/
					/** START : 1 --> span tag class setting for mandatory display **/
					/***************************************/
					//now get the span tag names
					spanTagNames = spanTagNames.value.split(",");
					for (j = 0; j < spanTagNames.length; j++) {
						if (spanTagNames[j].length > 0) {
							var uniqueSpanTagName = document.getElementById(spanTagNames[j]);
							if(!this.__merciFunc.isEmptyObject(uniqueSpanTagName)){
								uniqueSpanTagName.className = "mandatory";
							}	//end if
						} //end if
					} //end for
					/***************************************/
					/** END : 1 --> span tag class setting for mandatory display **/
					/***************************************/

					/***************************************/
					/** START : 2 --> DOC Type proper value passed + 
					3 --> valiation tag **/
					/***************************************/
					//as we have made the fields either mandatory or not accordinly set the 
					//value of doc type tag also   IDENTITY_DOCUMENT_TYPE
					var docType = document.getElementById(args.docTypeKey + "_docTag_" + args.paxIdPaxType);
					docType = document.getElementById(docType.value);
					docType.value = args.docTypeUsed;
					//now set the vaidation tags to true for only mandatory fields
					var validationTag = document.getElementById(args.docTypeKey + "_validation_" + args.paxIdPaxType);
					validationTag = validationTag.value.split(",");
					for (k = 0; k < validationTag.length; k++) {
						if (validationTag[k].length > 0) {
							var uniqueValidationTag = document.getElementById(validationTag[k]);
							if(!this.__merciFunc.isEmptyObject(uniqueValidationTag)){
								uniqueValidationTag.value = "TRUE";
								}
						}
					}
					var isVisaMandatoryElement = document.getElementById("isVisaMandatoryField");
					if(isVisaMandatoryElement!=null){
						var name=isVisaMandatoryElement.getAttribute("data-name");
						var value=isVisaMandatoryElement.getAttribute("data-value");
						isVisaMandatoryElement.setAttribute("name", name);
						isVisaMandatoryElement.setAttribute("value", value);
					}
					/***************************************/
					/** END :2 --> DOC Type proper value passed + 
					3 -->          valiation tag **/
					/***************************************/
				} //end if
				//based on the result decide whether we have to display * or not 
				//as false for whatever field mandatory symbol is shown dont show now
				if (displayMandatory == "false") {
					/***************************************/
					/** START : 
					1 --> span tag class setting for not mandatory display + 
					2 --> DOC Type proper value passed + 
					3 --> valiation tag **/
					/***************************************/
					//now get the span tag names
					spanTagNames = spanTagNames.value.split(",");
					for (j = 0; j < spanTagNames.length; j++) {
						if (spanTagNames[j].length > 0) {
							var uniqueSpanTagName = document.getElementById(spanTagNames[j]);
							uniqueSpanTagName.className = "displayNone";
						} //end if
					} //end for
					//as we have made the fields either mandatory or not accordinly set the 
					//value of doc type tag also   IDENTITY_DOCUMENT_TYPE
					var docType = document.getElementById(args.docTypeKey + "_docTag_" + args.paxIdPaxType);
					docType = document.getElementById(docType.value);
					docType.value = "";
					//now set the vaidation tags to ""  for only mandatory fields
					var validationTag = document.getElementById(args.docTypeKey + "_validation_" + args.paxIdPaxType);
					validationTag = validationTag.value.split(",");
					for (k = 0; k < validationTag.length; k++) {
						if (validationTag[k].length > 0) {
							var uniqueValidationTag = document.getElementById(validationTag[k]);
							uniqueValidationTag.value = "";
						}
					}
					var isVisaMandatoryElement = document.getElementById("isVisaMandatoryField");
					if(isVisaMandatoryElement!=null){
						if (isVisaMandatoryElement.hasAttribute("name")){
							isVisaMandatoryElement.removeAttribute("name");
						}
						if (isVisaMandatoryElement.hasAttribute("value")){
							isVisaMandatoryElement.removeAttribute("value");
						}
					}
					/***************************************/
					/** END : 1 --> span tag class setting for mandatory display +
					2 --> DOC Type proper value passed + 
					3 --> valiation tag **/
					/***************************************/
				} //end if
				/************************************************************************************************************/
				/**************END: LOGIC to display mandatory symbol and setting valiadation field to true    ************/
				/************************************************************************************************************/
			}
			if(args.mandatory=='mandatory'){				
				this.toggleMandatoryBorder(null,{id:args.id});
			}
		},

		/**
		 * this method is called when year field for visa expiration date looses focus
		 * @param event wrapper object which contains information about calling object
		 * @param args parameter passed by calling object
		 */
		onInputFieldYearBlur: function(event, args) {
			var yearValue = document.getElementById(args.psptFrameDob.year).value;
			/* 
				Revert mandatory fields when user selects no date year 
				fixed as a part of the PTR 07764157
			*/
			if (!this.__merciFunc.isEmptyObject(yearValue)) {
				this.bookUtil.pspt_frameDOB(event, args.psptFrameDob);
			} else {
				document.getElementById(args.psptFrameDob.fieldToSetValueIn).value = "";
			}
			this.docEnabledCheck(event, args.docEnabledCheck);
		},
		toggleMandatoryBorder: function(evt,args){		
			if(undefined != args.mandatory){
				if(this.__merciFunc.booleanValue(args.mandatory)){	
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