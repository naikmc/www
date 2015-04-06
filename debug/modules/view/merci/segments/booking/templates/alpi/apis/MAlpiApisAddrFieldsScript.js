Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.apis.MAlpiApisAddrFieldsScript',
	$constructor: function() {
		pageObj = this;
	},

	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
		},
		$displayReady: function() {},

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiApisAddrFields",
						data:{}
					});
			}
		},

		docAddressEnabledCheck: function(ATarg, args) {
			var displayMandatory = "false";
			//proceed furhter if and only if the doc type is enabled
			if (args.isDocEnabled == "true") {
				//first get the field tag names and span tag names 
				var fieldNames = document.getElementById(args.docTypeKey + "field_" + args.paxIdPaxType);
				var spanTagNames = document.getElementById(args.docTypeKey + "span_" + args.paxIdPaxType);
				//now search in field tag names whether user has entered any value
				//split the field names 
				//check whether for any field user has entered value or not 
				var uniqueFieldNames = fieldNames.value;
				uniqueFieldNames = uniqueFieldNames.split(",");
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
							uniqueSpanTagName.className = "mandatory";
						} //end if
					} //end for

					/***************************************/
					/** END : 1 --> span tag class setting for mandatory display **/
					/***************************************/

					/***************************************/
					/** START : 2 --> DOC Type proper value passed + 
					3 --> valiation tag **/
					/***************************************/
					//now set the vaidation tags to true for only mandatory fields
					var validationTag = document.getElementById(args.docTypeKey + "validation_" + args.paxIdPaxType);
					validationTag = validationTag.value.split(",");
					for (k = 0; k < validationTag.length; k++) {
						if (validationTag[k].length > 0) {
							var uniqueValidationTag = document.getElementById(validationTag[k]);
							uniqueValidationTag.value = "TRUE";
						}
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
					//now set the vaidation tags to ""  for only mandatory fields
					var validationTag = document.getElementById(args.docTypeKey + "validation_" + args.paxIdPaxType);
					validationTag = validationTag.value.split(",");
					for (k = 0; k < validationTag.length; k++) {
						if (validationTag[k].length > 0) {
							var uniqueValidationTag = document.getElementById(validationTag[k]);
							uniqueValidationTag.value = "";
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

		$afterRefresh: function() {
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