Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.common.utils.MBillingDetailsScript',
	$constructor: function() {

	},

	$prototype: {

		getCountryList: function(globalList) {
			var sourceArr = new Array();
			for (var i = 0; i < globalList.slLangCountryList.length; i++) {
				sourceArr.push(globalList.slLangCountryList[i][1]);
			}
			return sourceArr;
		},

		getAddressList: function(retainSrch){

			if (retainSrch.toLowerCase() == "true") {
				var addressList = [],i, key;
				 if (window.localStorage.getItem("Address:index") != null) {
					for (i = 1; i < window.localStorage.getItem("Address:index"); i++) {
						if(window.localStorage.getItem("Address:" + i) && typeof window.localStorage.getItem("Address:" + i) != "undefined"){
							fNameJson = JSON.parse(window.localStorage.getItem("Address:" + i)).add1;
							var json = {
								label: fNameJson,
								code: fNameJson,
								image: {
									show: true,
									css: 'fave'
								}
							}
							addressList.push(json);
						}
					}
				}

				return addressList;
			};

		},

		setAddressDetails: function(event, ui) {
			var addressDet = this.getAddressList(ui.input.retainSrch);
			var addressList = new Array();
			for (var i = 0; i < addressDet.length; i++) {
				addressList[i] = addressDet[i].code;
			}
			var selIndex = $.inArray(ui.suggestion.code, addressList);
			selIndex++;
			var entry = window.localStorage.getItem("Address:" + selIndex);
			entry = JSON.parse(entry);
			if (entry != null) {
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


		_onProvinceSelection: function(event, args) {
			$('#AIR_CC_ADDRESS_STATE').val($('#province').val());
		},

		provinceDisplay: function(event, args, that) {
			var countryTxtField = $('#AIR_CC_ADDRESS_COUNTRY_TXT').val();

			var globalList = args.globalList;
			if(globalList == undefined){
				globalList = args.input.selectFn.args.globalList;
			}
			var siteParams = args.siteParams;
			if(siteParams == undefined){
				siteParams = args.input.selectFn.args.siteParams;
			}
			if (siteParams.siteCountryOrdr == true || siteParams.siteCountryOrdr.toLowerCase() == "true" && countryTxtField != "") {
				var countryCodes = new Array();
				var CC = "";
				for (var i = 0; i < globalList.slLangCountryList.length; i++) {
					var country = globalList.slLangCountryList[i];
					if (country[1].toLowerCase() == countryTxtField.toLowerCase()) {
						CC = country[0];
						break;
					}
				}
				if (CC != "" && siteParams.siteCountryList != undefined && siteParams.siteCountryList != null) {
					var countryList = siteParams.siteCountryList.split(",");
					var found = $.inArray(CC, countryList);
					var provList = globalList.slProvince;
					if (found != -1) {
						$('#province').children().remove();
						for (var i = 0; i < provList.length; i++) {
							if (provList[i][0] == CC && provList[i][1] != undefined) {
								$('#province').append($("<option></option>").attr("value", provList[i][1]).text(provList[i][1]));
							}
						}
						$('#AIR_CC_ADDRESS_STATE').hide().val($('#province').val());
						$('#province').show();
						$('#delAIR_CC_ADDRESS_STATE').hide();
					} else {
						$('#province').hide();
						$('#AIR_CC_ADDRESS_STATE').show().val("");
					}
				}
			}
		},

		toggle: function(event, args) {
			this._bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
			this._bookUtil.toggle(event, args);
		},

		toggleMandatoryBorder: function(evt,args){
			if(aria.utils.HashManager.getHashString() == "merci-book-MALPI_A"){
				this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
				this.__merciFunc.toggleMandatoryBorder(event, args);
			}
		},

		clearField: function(evt,args){

			this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
			this.__merciFunc.clearField(event, args);
		},

		clrSelected: function(event, args) {
			if (args.name != null) {
				this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
				var name = document.getElementById(args.name).value;
				if (name != null && name == "")
					$('#' + args.name).removeClass('nameSelected');
				this.__merciFunc.showCross(event, args);
			}
		},

		prefillProfileInfo: function(event, args) {
		   this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
		   this.__merciFunc.prefillProfileInfo(args.globalList, args.rqstParams);
		}
	}
});