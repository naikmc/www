Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.segments.booking.scripts.MBookingMethods',
		'modules.view.merci.common.utils.URLManager'
	],
	$constructor: function() {
		this.ga = modules.view.merci.common.utils.MerciGA;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this._bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
		this.currCode = "";
		this.exchRate = "";
		this.urlManager = modules.view.merci.common.utils.URLManager;
		this.payment_type = null;
		this.submitAction = null;
		this.plActionFlag = false;
		this.selVal = "";
		pagePurc = this;
	},
	$destructor: function() {
		// release memory
		pagePurc = null;
	},
	$prototype: {

		__isWhole: function(s) {
			return (String(s).search(/^\s*\d+\s*$/) != -1);
		},

		__onPurcFormCallBack: function(response, params) {

			// if booking data is available
			if (response.responseJSON != null) {

				// getting next page id
				var nextPage = response.responseJSON.homePageId;
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);

				if (dataId == 'MPURC_A') {
					this.data.rqstParams = response.responseJSON.data.booking.MPURC_A.requestParam;
					this.$refresh({
						section: 'cyberSource'
					});

					// reset form fields
					// Dont reset for masterpass
					if (this.data.siteParams.siteAllowMasterPass == undefined || !this.data.siteParams.siteAllowMasterPass) {
						this.__resetFormFields();
					}
					// update page ticket
					var pageTicketEL = document.getElementById('PAGE_TICKET');
					if (pageTicketEL != null) {
						pageTicketEL.value = response.responseJSON.data.booking.MPURC_A.requestParam.reply.pageTicket;
					}

					// scroll to top
					window.scrollTo(0, 0);

					// display any server error
					this.data.errors = response.responseJSON.data.booking.MPURC_A.requestParam.reply.listMsg;
					var errorMap = response.responseJSON.data.booking.MPURC_A.requestParam.reqAttribMsgs;
					var errorStrings = response.responseJSON.data.booking.MPURC_A.errors;
					if (!this.utils.isEmptyObject(errorMap)) {
						for (var key in errorMap) {
							if (errorStrings[key] != null && errorStrings[key] != undefined) {
								this.__addErrorMessage(errorStrings[key].localizedMessage + " (" + errorStrings[key].errorid + ")")
							}
						}
					}

					aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
				} else if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {

					// setting data for next page
					var json = this.moduleCtrl.getModuleData();
					json.booking[dataId] = response.responseJSON.data.booking[dataId];
					json.header = response.responseJSON.data.header;

					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},

		// CR6084550 : adding US federal law notice : start
		__isUSRoute: function(itineraries) {
			var dispUSRegulation = false;
			for (var itinIndex in itineraries) {
				var itinerary = itineraries[itinIndex];
				if (itinerary != null && !dispUSRegulation) {
					for (var segIndex in itinerary.segments) {
						var segment = itinerary.segments[segIndex];
						if (segment != null) {
							if (segment.beginLocation != null && segment.beginLocation.countryCode != null && segment.beginLocation.countryCode.toLowerCase() == 'us') {
								dispUSRegulation = true;
								break;
							}
							if (segment.endLocation != null && segment.endLocation.countryCode != null && segment.endLocation.countryCode.toLowerCase() == 'us') {
								dispUSRegulation = true;
								break;
							}
						}
					}
				}
			}
			return dispUSRegulation;
		},
		// CR6084550 : adding US federal law notice : end

		__resetFormFields: function() {

			var ccType = document.getElementById('AIR_CC_TYPE');
			var ccNumber = document.getElementById('AIR_CC_NUMBER');
			var ccCCV = document.getElementById('CC_DIGIT_CODE_AIR_1');
			var ccExpiryYear = document.getElementById('CCexpiryDateYear');
			var ccExpiryMonth = document.getElementById('CCexpiryDateMonth');
			var ccHolderName = document.getElementById('AIR_CC_NAME_ON_CARD');

			if (ccNumber != null) {
				ccNumber.value = '';
			}

			if (ccCCV != null) {
				ccCCV.value = '';
			}

			if (ccHolderName != null) {
				ccHolderName.value = '';
			}

			if (ccType != null) {
				ccType.options[0].selected = true;
			}

			if (ccExpiryYear != null) {
				ccExpiryYear.options[0].selected = true;
			}

			if (ccExpiryMonth != null) {
				ccExpiryMonth.options[0].selected = true;
			}

			var ccFee = document.getElementById('CC-CARD-FEE');
			if (ccFee != null) {
				if (ccFee.className.indexOf('hidden') == -1) {
					ccFee.className += ' hidden';
				}

				var fareAmt = document.getElementById('FARE_AMT');
				var elFareCode = document.getElementById('FARE_CODE');
				var elPriceTotal = document.getElementById('dtPriceTotal');
				var elFareBrkdwnTotal = document.getElementById('fareBrkTotalPrice');
				var fractionDigits = 0;

				if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
					fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
				}
				var totalAmount = parseFloat(this.getFinalAmount());
				var fareCode = '';
				if (elFareCode != null) {
					fareCode = elFareCode.value;
				}

				// update total price on UI [START] */
				if (elPriceTotal != null) {
					elPriceTotal.innerHTML = fareCode + ' ' + this.utils.printCurrency(totalAmount, fractionDigits);
				}

				if (elFareBrkdwnTotal != null) {
					elFareBrkdwnTotal.innerHTML = this.utils.printCurrency(totalAmount, fractionDigits);
				}

				if (fareAmt != null) {
					//updating total amount
					fareAmt.value = totalAmount;
				}

				//displaying no card fee in case of no response data
				if (document.getElementById('CARD-FEE-LABEL') != null && document.getElementById('CARD_FEE') != null) {
					document.getElementById('CARD-FEE-LABEL').innerHTML = this.data.labels.tx_merci_noCardFee;
					document.getElementById('CARD_FEE').value = '-';
				}
			}
		},

		isFromServicingFlow: function() {
			var isServicingFlow = false;
			if(this.data.rqstParams.param.FROM_PAGE=="SERVICES" && this.data.rqstParams.param.ACTION=="MODIFY"){
				isServicingFlow = true;
			}
			return (this.utils.booleanValue(this.data.rqstParams.requestBean.DIRECT_RETRIEVE) || isServicingFlow);
		},

		toggle: function(event, args) {
			this._bookUtil.toggle(event, args);
		},

		__validateCardNumber: function() {

			// if credit card section is hidden
			if (this.__isCreditCardArticleHidden()) {
				return true;
			}

			var ccField = document.getElementById('AIR_CC_TYPE');
			var ccNumberField = document.getElementById('AIR_CC_NUMBER');
			if (ccField != null && ccNumberField != null) {

				// get credit card details
				var cc = ccField.value;
				var ccLength = ccNumberField.value.length;

				// default length
				var amexDigits = 15;
				var visaDigits1 = 13;
				var visaDigits2 = 16;
				var masterDigits = 16;
				var dinersDigits = 14;

				// 0 - no error
				var errorNumber = '';

				// check whether ccNumber is correct or not
				if (this.__isWhole(ccNumberField.value.trim())) {
					if (cc == 'VI') {
						// check for VISA card
						if (ccLength < visaDigits1 || ccLength > visaDigits1 && ccLength < visaDigits2) {
							errorNumber = '2130302';
						} else if (ccLength > visaDigits2) {
							errorNumber = '2130301';
						}
					} else if (cc == 'CA') {
						// check for MASTER card
						if (ccLength < masterDigits) {
							errorNumber = '2130302';
						} else if (ccLength > masterDigits) {
							errorNumber = '2130301';
						}
					} else if (cc == 'AX') {
						// check for AMEX card
						if (ccLength < amexDigits) {
							errorNumber = '2130302';
						} else if (ccLength > amexDigits) {
							errorNumber = '2130301';
						}
					} else if (cc == 'DC') {
						// check for DINER card
						if (ccLength < dinersDigits) {
							errorNumber = '2130302';
						} else if (ccLength > dinersDigits) {
							errorNumber = '2130301';
						}
					}
				} else {
					errorNumber = '2130303';
				}

				if (errorNumber != '') {
					// logic to display error
					var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors[errorNumber].localizedMessage + ' (' + errorNumber + ')';
					this.addErrorMessage(message);

					return false;
				}

				return true;

			}
		},

		

  		isCCNameValid: function(ccHolderName){
  			var regexAllowMultiLingualChars = /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/g; 
  			var regexAllowSpecialChars = /[`~,.<>;':"\/\[\]\|{}()-=_+!@#$%^&*]/;
  			if (ccHolderName != null && regexAllowMultiLingualChars.test(ccHolderName) && !regexAllowSpecialChars.test(ccHolderName)) {
				return true;
			}
			return false;  			
  		},

  		

		__validateCardHolderName: function() {

			// if credit card section is hidden
			if (this.__isCreditCardArticleHidden()) {
				return true;
			}

			// validate if name provided is valid alphabets
			var ccHolderName = document.getElementById('AIR_CC_NAME_ON_CARD');
			if(this.isCCNameValid(ccHolderName.value)){
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130140'].localizedMessage + ' (2130140)';
			this.addErrorMessage(message);

			return false;
		},

		__validateCVVNumber: function() {

			// if credit card section is hidden
			if (this.__isCreditCardArticleHidden()) {
				return true;
			}

			// validate if credit card is of length 3 or 4
			var cvvField = document.getElementById('CC_DIGIT_CODE_AIR_1');
			if (cvvField.className.indexOf('hidden') != -1 || (cvvField != null && /^[0-9]{3,4}$/.test(cvvField.value))) {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130255'].localizedMessage + ' (2130255)';
			this.addErrorMessage(message);

			return false;
		},

		__validateAddressLineOne: function() {

			if (this.__isCreditCardArticleHidden() || !this._siteBillingRequired()) {
				return true;
			}

			// validate if address field is provided with value
			var addressLine1 = document.getElementById('AIR_CC_ADDRESS_FIRSTLINE');
			if (addressLine1 != null && addressLine1.value.trim() != '') {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130108'].localizedMessage + ' (2130108)';
			this.addErrorMessage(message);

			return false;
		},

		__validateAddressCity: function() {

			if (this.__isCreditCardArticleHidden() || !this._siteBillingRequired()) {
				return true;
			}

			// validate if city field is provided with value
			var addressCity = document.getElementById('AIR_CC_ADDRESS_CITY');
			if (addressCity != null && addressCity.value.trim() != '') {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130133'].localizedMessage + ' (2130133)';
			this.addErrorMessage(message);

			return false;
		},

		__validateAddressCountry: function() {

			if (this.__isCreditCardArticleHidden() || !this._siteBillingRequired()) {
				return true;
			}

			// validate if country field is provided with value
			if (this._getSiteBoolean('sitePredTxtCountry')) {
				var addressCountry = document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT');
			} else {
				var addressCountry = document.getElementById('AIR_CC_ADDRESS_COUNTRY');
			}


			if (addressCountry != null && addressCountry.value.trim() != '') {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130135'].localizedMessage + ' (2130135)';
			this.addErrorMessage(message);

			return false;
		},

		__validateAddressState: function() {

			if (this.__isCreditCardArticleHidden() || !this._siteBillingRequired()) {
				return true;
			}

			// validate if state field is provided with value
			var addressState = document.getElementById('AIR_CC_ADDRESS_STATE');
			if (!(this.data.rqstParams.profileFieldsAccessor && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrState && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrState.mandatory) ||
				(addressState != null && addressState.value.trim() != '')) {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130136'].localizedMessage + ' (2130136)';
			this.addErrorMessage(message);

			return false;
		},

		__validateAddressZip: function() {

			if (this.__isCreditCardArticleHidden() || !this._siteBillingRequired()) {
				return true;
			}

			// validate if state field is provided with value
			var addressZip = document.getElementById('AIR_CC_ADDRESS_ZIPCODE');
			if (!(this.data.rqstParams.profileFieldsAccessor && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrZip && this.data.rqstParams.profileFieldsAccessor.siteAirCCAddrZip.mandatory) ||
				(addressZip != null && addressZip.value.trim() != '')) {
				return true;
			}

			// logic to display error
			var message = this.moduleCtrl.getModuleData().booking.MPURC_A.errors['2130134'].localizedMessage + ' (2130134)';
			this.addErrorMessage(message);

			return false;
		},

		__validateContactFields: function(valId, elId, errorKey) {

			// declare
			var errorOccured = false;
			var validateElem = 'false';
			var errors = this.moduleCtrl.getModuleData().booking.MPURC_A.errors;

			var valEL = document.getElementsByName(valId);
			if (valEL != null && valEL.length > 0) {
				validateElem = valEL[0].value;
			}

			if (validateElem.toLowerCase() == 'true') {
				var el = document.getElementsByName(elId);
				if (el != null && el.length > 0 && el[0].value == '') {
					errorOccured = true;

					// logic to display error
					var message = errors[errorKey].localizedMessage + ' (' + errorKey + ')';
					this.addErrorMessage(message);
				}
			}

			return errorOccured;
		},

		__validateContactInfo: function() {

			// flag to check error
			var errorOccured = false;

			// validate home phone number
			errorOccured = this.__validateContactFields('validateHmePhne', 'CONTACT_POINT_HOME_PHONE', '2130277') || errorOccured;

			// validate mobile phone number
			errorOccured = this.__validateContactFields('validateMblePhne', 'CONTACT_POINT_MOBILE_1', '2130279') || errorOccured;

			// validate sms notification number
			errorOccured = this.__validateContactFields('validateSmsMblePhne', 'NOTIF_VALUE_1_1', '2130287') || errorOccured;

			// validate office phone number
			errorOccured = this.__validateContactFields('validateBusinessPhne', 'CONTACT_POINT_BUSINESS_PHONE', '2130122') || errorOccured;

			// validate email ID
			errorOccured = this.__validateContactFields('validateEmail', 'CONTACT_POINT_EMAIL_1', '2130281') || errorOccured;

			// if no error return true
			// if error found return false
			return !errorOccured;
		},

		__validateExtendedContactInfo: function() {

			// flag to check error
			var errorOccured = false;
			var errors = this.moduleCtrl.getModuleData().booking.MPURC_A.errors;

			var countryEL = document.getElementById('COUNTRY');
			if (countryEL != null && countryEL.value.trim() == '') {

				var message = errors['2130107'].localizedMessage + ' (2130107)';
				this.addErrorMessage(message);

				errorOccured = true;
			}

			var phoneNumberEL = document.getElementById('PHONE_NUMBER');
			if (phoneNumberEL != null && phoneNumberEL.value.trim() == '') {

				var message = errors['2130249'].localizedMessage + ' (2130249)';
				this.addErrorMessage(message);

				errorOccured = true;
			}

			// validate sms and email
			errorOccured = this.__validateContactFields('validateSmsMblePhne', 'NOTIF_VALUE_1_1', '2130287') || errorOccured;
			errorOccured = this.__validateContactFields('validateEmail', 'CONTACT_POINT_EMAIL_1', '2130281') || errorOccured;

			// if no error return true
			// if error found return false
			return !errorOccured;
		},

		__validateCPFFields: function() {

			// flag to check error
			var errorOccured = false;
			var errors = this.moduleCtrl.getModuleData().booking.MPURC_A.errors;

			// get DOM elements
			var cpfNameEL = document.getElementById('AIR_CC_FULL_HOLDER_NAME');
			var cpfNumberEL = document.getElementById('AIR_CC_CUSTOMER_NUMBER');

			if (cpfNameEL != null && cpfNameEL.value.trim() == '') {

				var message = errors['1206'].localizedMessage + ' (1206)';
				this.addErrorMessage(message);

				errorOccured = true;
			}

			// social security number should be between 12 to 15 characters
			if (cpfNumberEL != null) {

				// trim value before comparison
				var cpfNumber = cpfNumberEL.value.trim();

				if (cpfNumber.length <= 0) {
					var message = errors['1166'].localizedMessage + ' (1166)';
					this.addErrorMessage(message);

					errorOccured = true;
				} else if (cpfNumber.length > 15 || cpfNumber.length < 11) {
					var message = errors['2131001'].localizedMessage + ' (2131001)';
					this.addErrorMessage(message);

					errorOccured = true;
				}
			}

			return !errorOccured;
		},

		addErrorMessage: function(message) {

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

		$dataReady: function() {

			// initialize variable
			this._strBuffer = modules.view.merci.common.utils.StringBufferImpl;
			this.data.base = modules.view.merci.common.utils.URLManager.getBaseParams();
			this.formPrefilled = false;

			// if errors available from BE then set those errors to be displayed on UI
			var bookingData = this.moduleCtrl.getModuleData().booking;
			if (bookingData != null && bookingData.MPURC_A != null) {
				this.data.errors = bookingData.MPURC_A.requestParam.reply.listMsg;
				this.data.siteParams = bookingData.MPURC_A.siteParam;
				this.data.labels = bookingData.MPURC_A.labels;
				this.data.rqstParams = bookingData.MPURC_A.requestParam;
				this.data.globalList = bookingData.MPURC_A.globalList;
				this.data.amops ={};


				// google analytics
				this.ga.trackPage({
					domain: this.data.siteParams.siteGADomain,
					account: this.data.siteParams.siteGAAccount,
					gaEnabled: this.data.siteParams.siteGAEnable,
					page: ((this.data.rqstParams.fareBreakdown.rebookingStatus == true) ? 'ATC 5-Purchase' : '6-Purchase') + '?wt_market=' + ((this.data.base[13] != null) ? this.data.base[13] : '') +
						'&wt_language=' + this.data.base[12] + '&wt_officeid=' + this.data.siteParams.siteOfficeId + '&wt_sitecode=' + this.data.base[11],
					GTMPage: ((this.data.rqstParams.fareBreakdown.rebookingStatus == true) ? 'ATC 5-Purchase' : '6-Purchase') + '?wt_market=' + ((this.data.base[13] != null) ? this.data.base[13] : '') +
						'&wt_language=' + this.data.base[12] + '&wt_officeid=' + this.data.siteParams.siteOfficeId + '&wt_sitecode=' + this.data.base[11]
				});
				if (localStorage.getItem('selectedPayMethod') != null) {
					this.data.isFop = localStorage.getItem('selectedPayMethod');
					if (localStorage.getItem('selectedPayMethod') == 'PPAL') {
						if (document.getElementById("btnConfirm") != null) {
							document.getElementById("btnConfirm").innerHTML = this.data.labels.tx_merci_text_ppal_confirm + " " + this.data.labels.tx_merci_text_ppal_text;
						}
					} else {
						var confirmLabel = this.__getCnfrmLabel();
						if (document.getElementById("btnConfirm") != null) {
							document.getElementById("btnConfirm").innerHTML = confirmLabel;
						}
					}
				} else {
					this.data.isFop = 'CC';
				}

				if(this.data.rqstParams.reply.mopList.length>0){
					this.data.amopsObj=this.data.rqstParams.reply.mopList[0].LIST_PAYMENT_TYPE;
					for(var i=0;i<this.data.amopsObj.length;i++){
						if(this.data.amopsObj[i].CODE =="AMOP"){
							this.data.amops[this.data.amopsObj[i].SUBCODE]=this.data.amopsObj[i].NAME;

						}
					}
				}
			}

			if(!this.utils.isEmptyObject(jsonResponse.currencyCode)){
				this.currCode = jsonResponse.currencyCode;
				delete jsonResponse.currencyCode;
			}
			if(!this.utils.isEmptyObject(jsonResponse.exchangeRate)){
				this.exchRate = jsonResponse.exchangeRate;
				delete jsonResponse.exchangeRate;
			}

			this.utils.updateBodyClass('');

			var headerButton = {};
			var arr = [];

			if (this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE') {
				arr.push("currInfoButton");
			};

			headerButton.button = arr;

			if (this.utils.booleanValue(this.data.siteParams.enableLoyalty) == true && this.data.rqstParams.reply.IS_USER_LOGGED_IN == true) {
				var loyaltyInfoJson = {
					loyaltyLabels: this.data.labels.loyaltyLabels,
					airline: this.data.base[16],
					miles: this.data.base[17],
					tier: this.data.base[18],
					title: this.data.base[19],
					firstName: this.data.base[20],
					lastName: this.data.base[21],
					programmeNo: this.data.base[22]
				};
			};

			// set details for header
			this.moduleCtrl.setHeaderInfo({
				title: this.data.labels.tx_merci_text_booking_purc_title,
				bannerHtmlL: this.data.rqstParams.bannerHtml,
				homePageURL: this.data.siteParams.homeURL,
				headerButton: headerButton,
				showButton: false,
				companyName: this.data.siteParams.sitePLCompanyName,
				currencyConverter: {
					name: this.data.rqstParams.fareBreakdown.currencies[0].name,
					code: this.data.rqstParams.fareBreakdown.currencies[0].code,
					pgTkt: this.data.rqstParams.reply.pageTicket,
					labels: this.data.labels,
					currency: {
						list: this.data.globalList.currencyCode,
						disabled: this.data.siteParams.siteInhibitCurrency
					},
					currentPage: this,
					newPopupEnabled: this.utils.booleanValue(this.data.siteParams.enableNewPopup),
					showButton: this.data.siteParams.siteEnableConversion != null && this.data.siteParams.siteEnableConversion.toUpperCase() == 'TRUE'
				},
				headerButton: headerButton,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			if (this.data.siteParams.siteAllowPayLater == 'TRUE' && !this.isFromServicingFlow()) {
				this.moduleCtrl.payLater = true;
				if (this.data.rqstParams.param.IS_PAY_ON_HOLD != null && this.data.rqstParams.param.IS_PAY_ON_HOLD == 'IS_PAY_ON_HOLD') {
					this.moduleCtrl.payLater = false;
				}
			}
			this.data.TTTCompatibleArr = [];

			if(jsonResponse.popup && jsonResponse.popup.fromPopupData){
				if(!this.utils.isEmptyObject(jsonResponse.popup.fromPopupData.insuranceProductdetails) && jsonResponse.popup.fromPopupData.insuranceProductdetails!="not_selected"){
						if (this.data.siteParams.siteAllowPayLater == 'TRUE' && !this.isFromServicingFlow()) {
							this.data.isFop = "CC" ;
							aria.utils.Json.setValue(this.moduleCtrl, 'payLater', false);
						}
				}
			}
		},

		$displayReady: function() {
			var sourceArr = new Array();
			for (var i = 0; i < this.data.globalList.slLangCountryList.length; i++) {
				sourceArr.push(this.data.globalList.slLangCountryList[i][1]);
			}

			// prefilling user information
			if (this.data.rqstParams.param.billingInfoChecked == 'TRUE') {
				var chkBox = document.getElementById('cb-card-detail');
				if (chkBox != null) {
					chkBox.checked = true;
					this.utils.prefillProfileInfo(this.data.globalList, this.data.rqstParams);
				}
			}


			/* PTR 08096759 : Credit card number auto-populated on Chargeable service payment */
			if (this.data.siteParams.siteAllowMasterPass == undefined || !this.data.siteParams.siteAllowMasterPass) {
				this.__resetFormFields();
			}
			if (this.data.rqstParams.param.SPEEDBOOK == "TRUE" && this.data.siteParams.siteEnableSpeedBook == "TRUE") {
				if (document.getElementById('AIR_CC_NUMBER') != null && document.getElementById('AIR_CC_NUMBER').value.trim().length == '0' && document.getElementById('ccSection') != null) {
					document.getElementById("ccSection").className += " inVisible";
				} else if (document.getElementById('AIR_CC_NUMBER') != null && document.getElementById('AIR_CC_NUMBER').value.trim().length > '0' && document.getElementById('ccSection') != null) {
					this._dispPaymentPanel();
				}
			}


			//restore page state
			modules.view.merci.common.utils.MCommonScript.prefillFormData("formPrefillData");
			if(this.formPrefilled===false && this.__checkPayLaterAction()){
				var payLaterElig = this.__getPayLaterEligibility();
				this.payment_type="CC";
				var argsData = {payLaterEnbl: payLaterElig.ispayLaterEnbl, timeToThinkEnbl: payLaterElig.timeToThinkEnbl, id: this.data.rqstParams.TIME_TO_THINK_PANEL_KEY.id} ;
				this.payLaterAction(null,argsData);
				this.formPrefilled=true;
			}
			this.toggleConfirm();
		},

		getCountryList: function() {
			var sourceArr = new Array();
			for (var i = 0; i < this.data.globalList.slLangCountryList.length; i++) {
				sourceArr.push(this.data.globalList.slLangCountryList[i][1]);
			}
			return sourceArr;
		},

		$viewReady: function() {
			$('body').attr('id', 'bpurc');
			if (this._isRebookingFlow()) {
				if (this._isAwardsFlow()) {
					$('body').attr('id', 'reapurc');
				}else{
					$('body').attr('id', 'repurc');
				}
			}else if (this._isAwardsFlow()) {
				$('body').attr('id', 'apurc');
			}

			if (this.data.base[14] != null && this.data.base[14].toLowerCase() == 'iphone') {
				this.utils.appCallBack(this.data.siteParams.siteAppCallback, "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}

			// error while page load
			if (!this.purcPageLoaded) {
				modules.view.merci.common.utils.URLManager.logError({
					msg: 'Purchase page load failed',
					stack: null,
					type: 'E',
					file: 'MPurc',
					method: 'viewReady'
				});
			}
			if(this.utils.booleanValue(this.data.siteParams.siteEnblREDFraudDet)){

				var custJSFile = "https://mpsnare.iesnare.com/snare.js";
				var custJS;
				custJS = document.createElement("script");

				// set attribute
				custJS.setAttribute("type", "text/javascript");
				custJS.setAttribute("src", custJSFile);

				// add to head
				document.getElementsByTagName("head")[0].appendChild(custJS);
			}

			// hide CVV field if required
			this._onCreditCardSelection(null, null);

			 if(this.data.siteParams.deleteStoredCC.toUpperCase() == 'TRUE' && this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length > 0 && this.data.rqstParams.reply.IS_USER_LOGGED_IN == true){
	                $('#storeCC').addClass('hidden');
	                $('#deleteCC').removeClass('hidden');
				 }

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPurc",
						data:this.data
					});
			}
		},

		toggleTPCheck: function(ATarg, args) {
			var TpChk = document.getElementById('thirdPartyCheck');
			if (TpChk.checked) {
				$('#input_SO_GL').text('<?xml version="1.0" encoding="iso-8859-1"?><SO_GL><GLOBAL_LIST mode="complete"><NAME>SO_SINGLE_MULTIPLE_COMMAND_BUILDER</NAME><LIST_ELEMENT><CODE>1</CODE><LIST_VALUE><![CDATA[' + args.str + ']]></LIST_VALUE><LIST_VALUE>S</LIST_VALUE><LIST_VALUE></LIST_VALUE><LIST_VALUE>ALLFLOWS</LIST_VALUE></LIST_ELEMENT></GLOBAL_LIST></SO_GL>');
			} else {
				$('#input_SO_GL').text('');
			}
		},

		__cancelPromo: function() {

			// get DOM elements
			var fareAmt = document.getElementById('FARE_AMT');
			var dlPromoEL = document.getElementById('dlPromo');
			var orgEL = document.getElementById('dtPriceTotal');
			var hdrPromoEL = document.getElementById('hdrPromo');
			var promoEL = document.getElementById(this.$getId('promo1'));
			var promoCodeHiddenEL = document.getElementById('PROMOTION_CODE');
			var btnPromoEl = document.getElementById(this.$getId('btnPromo'));
			var hTotalPrice = document.getElementById(this.$getId('hTtlPrice'));
			var promoDisEL = document.getElementById(this.$getId('promoDiscount'));
			var fareBrkdwnPriceEL = document.getElementById('fareBrkdwnPromoPrice');
			var fareBrkdwnTtlPriceEL = document.getElementById('fareBrkTotalPrice');
			var fareBrkAPCPriceEL = document.getElementById('fareBrkAPCPrice');
			var promoCodeEL = document.getElementById(this.$getId('PROMOTION_CODE'));
			var promoTtlPrice = document.getElementById(this.$getId('promoTtlPrice'));
			var orgPriceLblEL = document.getElementById(this.$getId('orgPriceLabel'));

			// reset button label
			if (btnPromoEl != null) {
				btnPromoEl.innerHTML = this.data.labels.tx_merci_text_book_promo_check;
			}

			// reset promo code input
			if (promoCodeEL != null) {
				promoCodeEL.value = '';
			}

			// set hidden input to empty
			if (promoCodeHiddenEL != null) {
				promoCodeHiddenEL.value = '';
			}

			// cancel new total price
			if (promoEL != null && hTotalPrice != null && promoTtlPrice != null && promoDisEL != null) {
				promoDisEL.innerHTML = '';
				promoTtlPrice.innerHTML = '';
				promoEL.className += ' hidden';
				hTotalPrice.className += ' hidden';
			}

			var fractionDigits = 0;
			if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			// reset farebreak down
			if (dlPromoEL != null && hdrPromoEL != null && fareBrkdwnPriceEL != null && fareBrkdwnTtlPriceEL != null) {

				// reset promo price
				fareBrkdwnPriceEL.innerHTML = '';
				fareBrkdwnTtlPriceEL.innerHTML = this.utils.printCurrency(this.getFinalAmount(), fractionDigits);

				if (fareBrkAPCPriceEL != null) {
					fareBrkAPCPriceEL.innerHTML = this.data.rqstParams.fareBreakdown.currencies[1].code + ' ' + this.data.rqstParams.fareBreakdown.tripPrices[1].totalAmount;
				}

				dlPromoEL.className += ' hidden';
				hdrPromoEL.className += ' hidden';
			}

			// show original price
			if (orgEL != null && orgPriceLblEL != null) {
				orgPriceLblEL.innerHTML = this.getTotalPriceLabel();

				// process innerHTML
				orgEL.innerHTML = orgEL.innerHTML.replace('</strike>', '');
				orgEL.innerHTML = orgEL.innerHTML.replace('<strike class="price total">', '');

				if (fareAmt != null) {
					fareAmt.value = this.utils.printCurrency(this.getFinalAmount(), fractionDigits);
				}
			}
		},

		__onPromoCallback: function(response, args) {

			// get JSON
			var resData = response.responseJSON;

			// error scenario
			var nextPage = resData.homePageId;
			if (nextPage != null) {

				// setting data for next page
				var json = this.moduleCtrl.getModuleData();
				var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
				json.booking[dataId] = response.responseJSON.data.booking[dataId];

				// navigate to next page
				this.moduleCtrl.navigate(null, nextPage);
			} else {

				// if success
				if (resData.pci != null && resData.ftpwc != null) {

					// get DOM elements
					var fareAmt = document.getElementById('FARE_AMT');
					var dlPromoEL = document.getElementById('dlPromo');
					var orgEL = document.getElementById('dtPriceTotal');
					var hdrPromoEL = document.getElementById('hdrPromo');
					var promoEL = document.getElementById(this.$getId('promo1'));
					var btnPromoEl = document.getElementById(this.$getId('btnPromo'));
					var hTotalPrice = document.getElementById(this.$getId('hTtlPrice'));
					var promoDisEL = document.getElementById(this.$getId('promoDiscount'));
					var fareBrkdwnPriceEL = document.getElementById('fareBrkdwnPromoPrice');
					var fareBrkdwnTtlPriceEL = document.getElementById('fareBrkTotalPrice');
					var fareBrkAPCPriceEL = document.getElementById('fareBrkAPCPrice');
					var promoCodeEL = document.getElementById(this.$getId('PROMOTION_CODE'));
					var promoTtlPrice = document.getElementById(this.$getId('promoTtlPrice'));
					var orgPriceLblEL = document.getElementById(this.$getId('orgPriceLabel'));

					// reset promo code input
					if (promoCodeEL != null) {
						promoCodeEL.value = '';
					}

					// reset button label
					if (btnPromoEl != null) {
						btnPromoEl.innerHTML = this.data.labels.tx_merci_text_book_promo_cancel;
					}

					// show new total price
					if (promoEL != null && hTotalPrice != null && promoTtlPrice != null && promoDisEL != null) {
						promoEL.className = promoEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
						hTotalPrice.className = hTotalPrice.className.replace(/(?:^|\s)hidden(?!\S)/g, '');

						// update discount
						if (resData.pci.vt == 'P') {
							// if percentage
							promoDisEL.innerHTML = resData.pci.c + ' ' + resData.pci.eda;
						} else {
							promoDisEL.innerHTML = resData.pci.c + ' ' + resData.pci.v;
						}

						// update total price
						promoTtlPrice.innerHTML = resData.pci.c + ' ' + resData.ftpwc;
						promoTtlPrice.innerHTML = resData.pci.c + ' ' + resData.ftpwc;
						if (resData.lca != undefined && resData.lca != null) {
							promoTtlPrice.innerHTML += '<br>' + resData.lca.c + ' ' + resData.fctwc;
						}
						if (fareAmt != null) {
							fareAmt.value = resData.ftpwc;
						}
					}

					// reset farebreak down
					if (dlPromoEL != null && hdrPromoEL != null && fareBrkdwnPriceEL != null && fareBrkdwnTtlPriceEL != null) {

						// promo discount (contains '-' symbol)
						fareBrkdwnPriceEL.innerHTML = resData.pci.fpwc;
						fareBrkdwnTtlPriceEL.innerHTML = resData.ftpwc;
						if (fareBrkAPCPriceEL != null) {
							fareBrkAPCPriceEL.innerHTML = resData.fctwc;
						}

						dlPromoEL.className = dlPromoEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
						hdrPromoEL.className = hdrPromoEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
					}

					// reset original price
					if (orgEL != null && orgPriceLblEL != null) {
						orgPriceLblEL.innerHTML = this.data.labels.tx_merci_text_book_promo_org_price;
						orgEL.innerHTML = '<strike class="price total">' + orgEL.innerHTML + '</strike>';
					}
				} else {

					// if promo code is not applied set hidden tag to empty
					var promoCodeHiddenEL = document.getElementById('PROMOTION_CODE');
					if (promoCodeHiddenEL != null) {
						promoCodeHiddenEL.value = '';
					}

					// print errors
					if (resData.errors != null) {

						// set promo code as empty in text
						var promoCodeEL = document.getElementById(this.$getId('PROMOTION_CODE'));
						if (promoCodeEL != null) {
							promoCodeEL.value = '';
						}

						// iterate and push errors to list
						for (var i = 0; i < resData.errors.length; i++) {
							if (resData.errors[i].t == 'E') {
								this.addErrorMessage(resData.errors[i].txt);
							} else if (resData.errors[i].t == 'W') {
								this.data.warnings.push({
									TEXT: resData.errors[i].txt
								});
							}

							// remove promo code option
							if (resData.errors[i].n == '73008') {

								var promo = document.getElementById(this.$getId('promo'));
								var promo1 = document.getElementById(this.$getId('promo1'));
								var hTtlPrice = document.getElementById(this.$getId('hTtlPrice'));

								if (promo != null) {
									promo.parentNode.removeChild(promo);
								}

								if (promo1 != null) {
									promo1.parentNode.removeChild(promo1);
								}

								if (hTtlPrice != null) {
									hTtlPrice.parentNode.removeChild(hTtlPrice);
								}

								// reset json data
								this.data.rqstParams.isPromoDisplay = 'NO';
							}
						}

						// call section refresh
						aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
						aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
						var msk = document.getElementsByClassName('msk loading');
						for (var i = 0; i < msk.length; i++) {
							msk[i].style.display = 'none';
						}
					}

				}
			}
			this.utils.hideMskOverlay();
		},

		applyPromoCode: function(event, args) {

			var promoCall = false;

			// reset errors
			this.data.errors = new Array();
			this.data.warnings = new Array();

			// JSON object

			var errors = this.moduleCtrl.getModuleData().booking.MPURC_A.errors;

			// get PROMOTION CODE text box
			var btnPromoEl = document.getElementById(this.$getId('btnPromo'));
			var promoCodeHiddenEL = document.getElementById('PROMOTION_CODE');
			var promoCodeEL = document.getElementById(this.$getId('PROMOTION_CODE'));

			// if button label is check then initiate an AJAX call
			if (btnPromoEl != null && btnPromoEl.innerHTML != null && btnPromoEl.innerHTML.trim() == this.data.labels.tx_merci_text_book_promo_check) {

				if (promoCodeEL != null && promoCodeEL.value != '') {

					promoCall = true;

					// set hidden input tag value
					if (promoCodeHiddenEL != null) {
						promoCodeHiddenEL.value = promoCodeEL.value;
					}

					// create POST parameters
					var parameters = '&PROMOTION_CODE=' + promoCodeEL.value + '&NB_PASSENGER=' + args.noOfPax + '&TOTAL_AMOUNT=' + args.totalAmount + '&VALIDATION_SUBTYPE=0' + '&ELEMENT_TYPE=AIR' + '&VALIDATION_TYPE=PROMO_Validation' + '&result=json';

					if (args.eDate == null) {
						// if one way
						parameters += '&DEPARTURE_DATE=&ARRIVAL_DATE=' + args.bDate;
					} else {
						// if round trip
						parameters += '&DEPARTURE_DATE=' + args.bDate + '&ARRIVAL_DATE=' + args.eDate;
					}

					// create JSON
					var request = {
						action: args.url,
						method: 'POST',
						loading: true,
						isSecured: true,
						parameters: parameters,
						expectedResponseType: 'json',
						cb: {
							fn: this.__onPromoCallback,
							scope: this,
							args: parameters
						}
					};

					// start an AJAX request
					modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

				} else {
					// show error on UI
					this.addErrorMessage(errors[73003].localizedMessage + ' [73003]');
				}

			} else {
				// show old price
				this.__cancelPromo();
			}


			if (promoCall == false) {
				aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
				aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
			}
		},


		__creditCardFeeResponse: function(response, args) {

			var resData = response.responseJSON;
			var ccDisp = document.getElementById('CREDIT_CARD_FEE');
			var ccLabel = document.getElementById('CC-FEE-DISP');
			var ccFee = document.getElementById('CC-CARD-FEE');
			var fareAmt = document.getElementById('FARE_AMT');
			var elFareCode = document.getElementById('FARE_CODE');
			var elPriceTotal = document.getElementById('dtPriceTotal');
			var elFareBrkdwnTotal = document.getElementById('fareBrkTotalPrice');
			var fractionDigits = 0;

			if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			var totalAmount = parseFloat(this.getFinalAmount());
			if (resData != null && resData != "") {

				if (fareAmt != null) {
					var amt = 0;
					if (resData.fee != null) {
						amt = resData.fee[0].amount;
					}
					if (amt == null || amt == '') {
						amt = 0;
					}
					totalAmount += parseFloat(amt);
					document.getElementById('CARD_FEE').value = amt;
					if (amt != null && amt != "" && amt != "0.00") {
						//setting different label and amount value in case of non zero value
						if (document.getElementById('CARD-FEE-LABEL') != null && document.getElementById('CARD_FEE') != null) {
							document.getElementById('CARD-FEE-LABEL').innerHTML = this.data.labels.tx_merci_cardFee + '&nbsp;' + '(' + this.data.rqstParams.fareBreakdown.currencies[0].code + ')';
							document.getElementById('CARD_FEE').value = amt;
						}
						if (ccFee != null && ccFee.className.indexOf('hidden') != -1) {
							ccFee.className = ccFee.className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
						}
					}
				}
				if (ccDisp != null) {
					if (amt != "" && amt != "0.00") {
						if (ccDisp.className.indexOf('hidden') != -1) {
							ccDisp.className = ccDisp.className.replace(
								/(?:^|\s)hidden(?!\S)/g, '').trim();
						}
						if (ccLabel != null) {
							if (ccLabel.className.indexOf('hidden') != -1) {
								ccLabel.className = ccLabel.className.replace(
									/(?:^|\s)hidden(?!\S)/g, '').trim();
							}
							document.getElementById('ccFee').innerHTML = amt;
						}
					} else {
						if (ccDisp.className.indexOf('hidden') == -1) {
							ccDisp.className += ' hidden';
						}
						if (ccLabel != null) {
							if (ccLabel.className.indexOf('hidden') == -1) {
								ccLabel.className += ' hidden';
							}
							document.getElementById('ccFee').innerHTML = this.utils.printCurrency(0, fractionDigits);
						}
					}
				}
			} else {
				if (ccDisp != null && ccDisp.className.indexOf('hidden') != -1) {
					ccDisp.className = ccDisp.className.replace(
						/(?:^|\s)hidden(?!\S)/g, '').trim();
				}
				if (ccLabel != null) {
					if (ccLabel.className.indexOf('hidden') != -1) {
						ccLabel.className = ccLabel.className.replace(
							/(?:^|\s)hidden(?!\S)/g, '').trim();
					}
					document.getElementById('ccFee').innerHTML = this.utils.printCurrency(0, fractionDigits);
				}
				if (document.getElementById('CARD-FEE-LABEL') != null && document.getElementById('CARD_FEE') != null) {
					//displaying no card fee in case of no response data
					document.getElementById('CARD-FEE-LABEL').innerHTML = this.data.labels.tx_merci_noCardFee;
					document.getElementById('CARD_FEE').value = '-';
				}
			}

			var fareCode = '';
			if (elFareCode != null) {
				fareCode = elFareCode.value;
			}

			// update total price on UI [START] */
			if (elPriceTotal != null) {
				elPriceTotal.innerHTML = fareCode + ' ' + this.utils.printCurrency(totalAmount, fractionDigits);
			}

			if (elFareBrkdwnTotal != null) {
				elFareBrkdwnTotal.innerHTML = this.utils.printCurrency(totalAmount, fractionDigits);
			}

			if (fareAmt != null) {
				//updating total amount
				fareAmt.value = totalAmount;
			}
		},

		retrieveCreditCardFee: function(event, args) {

			if (this.data.siteParams.siteOBFees != null && this.data.siteParams.siteOBFees != '' && this.data.siteParams.siteOBFees.toLowerCase() == 'true') {
				var ccNumberField = document.getElementById('AIR_CC_NUMBER');
				if (ccNumberField != null) {

					// create POST parameters
					var parameters = '&FOP_AMOUNT=' + args.amt + '&FOP_CC_NUMBER=' + ccNumberField.value.trim() + '&FOP_TYPE=' + args.type + '&REQ_ID=' + args.reqId + '&result=json';

					// create JSON
					var request = {
						action: args.url,
						method: 'POST',
						parameters: parameters,
						isSecured: true,
						expectedResponseType: 'json',
						cb: {
							fn: this.__creditCardFeeResponse,
							scope: this,
							args: args
						}
					};

					// start an AJAX request
					modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
				}
			}
		},

		getFinalAmount: function() {

			// JSON variables
			var finalAmount = 0;

			// if re-booking flow
			var tripPrices = this.__getTripPrice();

			if (!this.utils.isEmptyObject(tripPrices[0].totalAmount)) {
				finalAmount = tripPrices[0].totalAmount;
			}

			if (this.data.rqstParams.fareBreakdown.rebookingStatus == true) {
				if (!this.utils.isEmptyObject(tripPrices[0].rebookBalanceTotalAmount)) {
					finalAmount = tripPrices[0].rebookBalanceTotalAmount;
					if (finalAmount < 0) {
						finalAmount = (-1) * finalAmount;
					}
				} else {
					finalAmount = 0;
				}
			}


			if (this.data.rqstParams.requestBean.DIRECT_RETRIEVE == "TRUE") {
				var insAmt = this.data.rqstParams.requestBean.INS_AMT;
				if (finalAmount != null) {
					finalAmount = parseFloat(insAmt);
				}
			}
			return finalAmount;
		},

		__getServicesTotalAmount: function() {
			var finalAmount = 0;
			if (this.utils.booleanValue(this.data.siteParams.servicesCatalog)) {
				var servicePrice = this.data.rqstParams.servicesSelection.totalPrice;
				if (servicePrice && !isNaN(servicePrice.balancedAmount)) {
					finalAmount = servicePrice.balancedAmount;
				}
			} else if (!this.utils.isEmptyObject(this.data.rqstParams.servicesByPaxAndLoc) && !this.utils.isEmptyObject(this.data.rqstParams.servicesByPaxAndLoc.totalBalancedAmount) && this.data.rqstParams.servicesByPaxAndLoc.totalBalancedAmount != '') {
				finalAmount = this.data.rqstParams.servicesByPaxAndLoc.totalBalancedAmount;
			}

			return finalAmount;
		},

		getTotalPriceLabel: function() {

			// if rebooking flow
			var label = this.data.labels.tx_merci_atc_total_price;
			if (this.data.rqstParams.fareBreakdown.rebookingStatus == true) {
				if (this.__getTripPrice()[0].rebookBalanceTotalAmount >= 0) {
					label = this.data.labels.tx_merci_atc_topay;
				} else {
					label = this.data.labels.tx_merci_atc_to_refund;
				}
			}

			return label;
		},



		/**
		 * generate a new card id to be stored in DB
		 * @param listCCInformation list of cards already stored
		 */
		_getNewCardId: function(listCCInformation) {
			var ccNumber = 1;
			if (listCCInformation != null && listCCInformation.length > 0) {
				for (var i = 0; i < listCCInformation.length; i++) {
					try {
						var ccId = listCCInformation[i].creditCardId.split('_');
						if (parseInt(ccId[1]) != ccNumber) {
							break;
						}

						ccNumber += 1;
					} catch (e) {
						// NumberFormat or NullPointer exception can come
					}
				}
			}

			return ccNumber;
		},

		/*store credit card details:start*/
		_addRequestParamsStoreCC: function() {
			var siteparams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
			// JSON variables
			var labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
			var storeCCChkBox = document.getElementById('store_cc_details');
			if(document.getElementById('update_cc_details')!=null && document.getElementById('update_cc_details').checked == true && !($('#updateCC').hasClass('hidden'))){
			  storeCCChkBox = document.getElementById('update_cc_details');
			}
			if(document.getElementById('update_cc_details')==null && document.getElementById('update_cc_details')!=null){
				storeCCChkBox = document.getElementById('update_cc_details');
			}
			var data = {
				action: 'MPurchaseValidate.action'
			};
			var airCCEL = document.getElementById('AIR_CC_TYPE');
			if (airCCEL != null) {
				var ccType = airCCEL.options[airCCEL.selectedIndex].value;
				var displayname = airCCEL.options[airCCEL.selectedIndex].label;
				var ccId = airCCEL.options[airCCEL.selectedIndex].id;
				if (storeCCChkBox != null) {
					// store credit card is enabled and user is logged in
					//if existing card is selected, then it can only be update, (if checkbox is checked/unchecked)
					if (rqstParams.listCCInformation != null && displayname != null && displayname.indexOf('*') != -1 && ccId != null && storeCCChkBox.checked == true) {
						var updateLabel = this._checkCCUpdateNeeded(displayname, ccId, rqstParams.listCCInformation, ccType);
						//if update needed, get the current card id(1,2 or 3)
						if (updateLabel != null && updateLabel != '' && ccId != null) {
							//display pop up to confirm
							this.moduleCtrl.showMskOverlay();
							document.getElementById('updatecc-text').innerHTML = updateLabel;
							document.getElementById('dialog-updatecard').style.display = 'block';
							// scroll to top
							window.scrollTo(0, 0);
						} else {
							this.purchFormSubmit(data);
						}
					} else {
						//this will handle create scenario if checkbox is checked
						if (storeCCChkBox.checked == true) {
							//even when checkbox is checked, user might try to add same cc
							var cardExists = false;
							if (document.getElementById('AIR_CC_NUMBER') != null && document.getElementById('AIR_CC_NUMBER').value != null) {
								cardExists = this._isCardStored(document.getElementById('AIR_CC_NUMBER').value, ccType, rqstParams.listCCInformation);
							}
							//create new entry in db
							if (!cardExists) {
								this._prepareCCStoreParams(true, this._getNewCardId(rqstParams.listCCInformation));
							}
							this.purchFormSubmit(data);
						} else {
							this.purchFormSubmit(data);
						}
					}
				} else {
					//checkbox will not be displayed if there are 3 cards stored in db. in this case, if any exisitng card details are updated by user, this need to be updated in db
					if (siteparams.siteStoreCCDetails != null && siteparams.siteStoreCCDetails.toLowerCase() == 'true' && rqstParams.numberOfProfiles != null) {
						var noProfiles = Number(rqstParams.numberOfProfiles);
						//if user logged in and there are cc stored for user, then check if update needed
						if (noProfiles > 0) {
							//check is needed only if the card type selected is stored card
							if (rqstParams.listCCInformation != null && displayname != null && displayname.indexOf('*') != -1) {
							  if(document.getElementById('update_cc_details')!=null && document.getElementById('update_cc_details').checked == false && !($('#updateCC').hasClass('hidden'))){
									this.purchFormSubmit(data);
							  }else{
								var updateLabel = this._checkCCUpdateNeeded(displayname, ccId, rqstParams.listCCInformation, ccType);
								//if update needed, get the current card id(1,2 or 3)
								if (updateLabel != null && updateLabel != '' && ccId != null) {
									//display pop up to confirm
									this.moduleCtrl.showMskOverlay();
									document.getElementById('updatecc-text').innerHTML = updateLabel;
									document.getElementById('dialog-updatecard').style.display = 'block';
									// scroll to top
									window.scrollTo(0, 0);
								} else {
									this.purchFormSubmit(data);
								}
							  }
							} else {
								this.purchFormSubmit(data);
							}
						}
					}
				}
			} else {
				this.purchFormSubmit(data);
			}
		},
		_onbuttonClickCCUpdate: function(evt, args) {
			this.moduleCtrl.hideMskOverlay();
			document.getElementById('dialog-updatecard').style.display = 'none';
			if (args.cancel == 'false') {
				var airCCEL = document.getElementById('AIR_CC_TYPE');
				if (airCCEL != null) {
					var ccId = airCCEL.options[airCCEL.selectedIndex].id;
					var cardId = ccId.split('_');
					//call method to add request parameters to update with new data
					this._prepareCCStoreParams(false, cardId[1]);
				}
			}
			var data = {
				action: 'MPurchaseValidate.action'
			};
			this.purchFormSubmit(data);
		},
		/*method to check if the card is already stored in db */
		_isCardStored: function(cardNumber, cardType, listCCInfo) {
			for (var cardIndex in listCCInfo) {
				var cardInfo = listCCInfo[cardIndex];
				if (cardNumber == cardInfo.visibleAccountNumber && cardType == cardInfo.companyCode) {
					return true;
				}
			}
			return false;
		},
		/* called before form submit , adds all parameters specific to store cc*/
		_prepareCCStoreParams: function(isCreate, cardId) {
			if (cardId != null) {
				var formObj = document.getElementById('purcForm');
				//CC_NUBER_i
				if (document.getElementById('AIR_CC_NUMBER') != null && document.getElementById('AIR_CC_NUMBER').value != null) {
					formObj.appendChild(this._prepareInputElement('CC_NUMBER', cardId, document
						.getElementById('AIR_CC_NUMBER').value));
				}
				//CC_NAME_ON_CARD_i
				if (document.getElementById('AIR_CC_NAME_ON_CARD') != null && document
					.getElementById('AIR_CC_NAME_ON_CARD').value != null) {
					formObj.appendChild(this._prepareInputElement('CC_NAME_ON_CARD', cardId, document
						.getElementById('AIR_CC_NAME_ON_CARD').value));
				}
				//CC_TYPE_i
				if (document.getElementById('AIR_CC_TYPE') != null) {
					var cardTypeSelect = document.getElementById('AIR_CC_TYPE');
					formObj.appendChild(this._prepareInputElement('CC_TYPE', cardId, cardTypeSelect.options[cardTypeSelect.selectedIndex].value));
				}
				// set expiry date parameter value
				var ccExpiryYear = document.getElementById('CCexpiryDateYear');
				var ccExpiryMonth = document.getElementById('CCexpiryDateMonth');
				var expYear = '';
				var expMonth = '';
				if (ccExpiryYear != null) {
					expYear = ccExpiryYear.options[ccExpiryYear.selectedIndex].value;
				}
				if (expYear != null && expYear.length > 2) {
					expYear = expYear.substring(2);
				}
				if (ccExpiryMonth != null) {
					expMonth = ccExpiryMonth.options[ccExpiryMonth.selectedIndex].value;
				}
				if (expMonth != null && expYear != null) {
					formObj.appendChild(this._prepareInputElement('CC_EXP', cardId, expMonth + "/" + expYear));
				}
				//set value for CC_ID_i
				formObj.appendChild(this._prepareInputElement('CC_ID', cardId, 'CC_' + cardId));
				if (document.getElementsByName('CC_ID') != null && document.getElementsByName('CC_ID')[0] != null) {
					document.getElementsByName('CC_ID')[0].value = 'CC_' + cardId;
				} else {
					//CC_ID
					var input = document.createElement("input");
					input.type = "hidden";
					input.name = 'CC_ID';
					input.value = 'CC_' + cardId;
					formObj.appendChild(input);
				}
				//CC_DIGIT_CODE_i
				if (document.getElementById('CC_DIGIT_CODE_AIR_1') != null && document.getElementById('CC_DIGIT_CODE_AIR_1').value != null) {
					formObj.appendChild(this._prepareInputElement('CC_DIGIT_CODE', cardId, document.getElementById('CC_DIGIT_CODE_AIR_1').value));
				}
				//CC_TOBE_STORED_i
				formObj.appendChild(this._prepareInputElement('CC_TOBE_STORED', cardId, 'TRUE'));
				//if create add prev card ids
				if (isCreate && Number(cardId) > 1) {
					for (var index = cardId - 1; index > 0; index--) {
						//get prev card no's
						this._getPrevCardDetails('CC_' + index, 'CC_EXP_' + index, index);

					}
				}
			}
		},
		/*method to retrieve prev stored cc no using cc id passed */
		_getPrevCardDetails: function(cardId, cardexp, index) {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
			var listCCInfo = rqstParams.listCCInformation;
			if (listCCInfo != null) {
				var formObj = document.getElementById('purcForm');
				for (var cardIndex in listCCInfo) {
					var cardInfo = listCCInfo[cardIndex];
					if (cardId == cardInfo.creditCardId) {
						return cardInfo.visibleAccountNumber;
						formObj.appendChild(this._prepareInputElement('CC_NUMBER', index, cardInfo.visibleAccountNumber));
						var expValue = cardInfo.expiryDate.month + 1 + '/' + cardInfo.expiryDate.year.toString().substring(2, 4);
						formObj.appendChild(this._prepareInputElement(cardexp, index, expValue));
						break;
					}
				}
			}
		},
		/* method to prepare input element to be added to form object*/
		_prepareInputElement: function(name, index, value) {
			var input = document.createElement("input");
			input.type = "hidden";
			input.name = name + '_' + index;
			input.value = value;
			return input;
		},
		/*method to validate if it is cc update, returns the string/label to be displayed in pop up by validating the field that is changed */
		_checkCCUpdateNeeded: function(cardDisplayName, ccId, listCCInfo, ccType) {
			var displayName = cardDisplayName.split(' ');
			var updateLabel = '';
			var nameChanged = false;
			var expDateChanged = false;
			var labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels;
			for (var cardIndex in listCCInfo) {
				var cardInfo = listCCInfo[cardIndex];
				if (displayName[displayName.length - 1] != null && cardInfo != null && ccId != null && cardInfo.accountNumber == displayName[displayName.length - 1] && ccType == cardInfo.companyCode && ccId == cardInfo.creditCardId) {
					//stored card is selected, check for any changed value
					if (document.getElementById('AIR_CC_NAME_ON_CARD') != null && document.getElementById('AIR_CC_NAME_ON_CARD').value != cardInfo.ownerName) {
						nameChanged = true;
					}
					if (document.getElementById('CCexpiryDateMonth') != null && cardInfo.expiryDate.month != null && document.getElementById('CCexpiryDateMonth').value != cardInfo.expiryDate.month + 1) {
						expDateChanged = true;
					}
					if (document.getElementById('CCexpiryDateYear') != null && cardInfo.expiryDate.year != null && document.getElementById('CCexpiryDateYear').value != cardInfo.expiryDate.year.toString().substring(2, 4)) {
						expDateChanged = true;
					}
					if (expDateChanged && nameChanged) {
						updateLabel = labels.tx_merci_save_new_data_profile;
						break;
					} else if (expDateChanged) {
						updateLabel = labels.tx_merci_save_expiry_date_profile;
						break;
					} else if (nameChanged) {
						updateLabel = labels.tx_merci_save_new_name_profile;
						break;
					}
				}
			}
			return updateLabel;
		},
		/*method to form display name in drop down with encrypted card no and card name eg : "Visa ************0051" */
		_formCardName: function(encNumber, cardInfoList, cardType) {
			var newName = encNumber;
			for (var cardIndex in cardInfoList) {
				var cardInfo = cardInfoList[cardIndex];
				if (cardInfo != null) {
					if (cardInfo[0] == cardType) {
						newName = cardInfo[1] + ' ' + newName;
						break;
					}
				}
			}
			return newName;
		},
		/*method to prepopulate cc related fields */
		_prepopulateFields: function(cardDisplayName, listCCInfo, ccType, ccId) {
			if (cardDisplayName != null && cardDisplayName.indexOf('*') != -1) {
				var displayName = cardDisplayName.split(' ');
				for (var cardIndex in listCCInfo) {
					var cardInfo = listCCInfo[cardIndex];
					if (displayName[displayName.length - 1] != null && cardInfo != null && cardInfo.accountNumber == displayName[displayName.length - 1] && ccType == cardInfo.companyCode && ccId == cardInfo.creditCardId) {
						//prepopulate all fields with value
						//set card number
						if (document.getElementById('AIR_CC_NUMBER') != null) {
							document.getElementById('AIR_CC_NUMBER').value = cardInfo.visibleAccountNumber;
							document.getElementById('AIR_CC_NUMBER').readOnly = true;
						}
						if (document.getElementById('AIR_CC_NAME_ON_CARD') != null) {
							document.getElementById('AIR_CC_NAME_ON_CARD').value = cardInfo.ownerName;
						}
						if (document.getElementById('CCexpiryDateMonth') != null && cardInfo.expiryDate.month != null) {
							//setting value of expiry month drop down
							document.getElementById('CCexpiryDateMonth').value = cardInfo.expiryDate.month + 1;
						}
						if (document.getElementById('CCexpiryDateYear') != null && cardInfo.expiryDate.year != null) {
							//setting value of expiry month drop down
							document.getElementById('CCexpiryDateYear').value = cardInfo.expiryDate.year.toString().substring(2, 4);
						}
						break;
					}
				}
				if(this.data.siteParams.deleteStoredCC.toUpperCase() == 'TRUE' && this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length > 0){
	                $('#storeCC,#updateCC').addClass('hidden');
	                $('#deleteCC').removeClass('hidden');
				 }
			} else {
				/*fix as a part of PTR 08956895*/
				if (document.getElementById('AIR_CC_NAME_ON_CARD') != null) {
					document.getElementById('AIR_CC_NAME_ON_CARD').value = document.getElementById('AIR_CC_NAME_ON_CARD').value || '';
					}
				if (document
					.getElementById('AIR_CC_NUMBER') != null) {
					document
						.getElementById('AIR_CC_NUMBER').readOnly = false;
					document
						.getElementById('AIR_CC_NUMBER').value = '';
				}
				if (document
					.getElementById('CCexpiryDateMonth') != null) {
					// setting value of expiry month drop
					// down
					document
						.getElementById('CCexpiryDateMonth').value = document
						.getElementById('CCexpiryDateMonth').options[0].value;
				}
				if (document
					.getElementById('CCexpiryDateYear') != null) {
					//setting value of expiry month drop down
					document
						.getElementById('CCexpiryDateYear').value = document
						.getElementById('CCexpiryDateYear').options[0].value;
				}

				if(this.data.siteParams.deleteStoredCC.toUpperCase() == 'TRUE' && this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length > 0){
	                $('#deleteCC,#updateCC').addClass('hidden');
	                if(this.data.rqstParams.listCCInformation.length !=3){
	                 $('#storeCC').removeClass('hidden');
	                }
				 }
			}
		},
		/*store credit card details:end*/
		updateCountry: function(event, args) {

			// if element exists in DOM then only create autocomplete
			if (this._siteBillingRequired() && this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.MPURC_A != null && this.data.globalList != null) {

				// declaring variable for later use
				var countryField = document.getElementById('AIR_CC_ADDRESS_COUNTRY');

				var countryTxtField = document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT');

				if (countryField != null) {
					// default value
					countryField.value = '';

					// iterating on list to match country
					for (var i = 0; i < this.data.globalList.slLangCountryList.length; i++) {
						var country = this.data.globalList.slLangCountryList[i];
						if (countryTxtField != null && country[1].toLowerCase() == countryTxtField.value.toLowerCase()) {
							// if matched
							countryField.value = country[0];
							break;
						}
					}
				}
			}
		},

		openPriceDetails: function() {

			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){

				var totalPrice = 0 ;
				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				if(!this.utils.isEmptyObject(this.insDataNew)){
					var elFareAmt = document.getElementById('calcFinalAmnt');
					if (elFareAmt != null) {
						totalPrice = parseFloat(elFareAmt.value);
					}
					if(this.insDataNew.amount<1){
						this.insDataNew={};
					}
				}

				aria.utils.Json.setValue(popup, 'data', {
					bRebooking: this.bRebookingNew,
					labels: this.data.labels,
					siteParams: this.data.siteParams,
					rqstParams: this.data.rqstParams,
					globalList: this.data.globalList,
					finalAmount: this.finalAmountNew,
					'currCode':this.currCode,
         			'exchRate':this.exchRate,
					fromPage: 'purc',
					insData: this.insDataNew,
					totalPrice: totalPrice,
					'payLaterElig': this.payLaterEligNew
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "priceBreakDown"
				});
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				modules.view.merci.common.utils.MCommonScript.storeFormData("formPrefillData");
				this.moduleCtrl.navigate(null, 'Popup');

			}else{

				this.moduleCtrl.showMskOverlay();

				// showing all the popup with class as 'popup'
				var popups = document.getElementsByClassName('popup');
				for (var i = 0; i < popups.length; i++) {
					if (popups[i].id == 'pricePopup') {
						popups[i].style.display = 'block';
					}
				}

				// scroll to top
				window.scrollTo(0, 0);
			}
		},

		openFareCondition: function(e, data) {
			e.preventDefault();

			//if minirule enable CR 6432691
			this.moduleCtrl.showMskOverlay();
			if (this.data.siteParams.siteMiniRule.toLowerCase() == "true" && this.data.siteParams.siteMCMiniRule.toLowerCase() == "true") {
				var request = {
					parameters: null,
					method: 'POST',
					isSecured: true,
					expectedResponseType: 'json',
					cb: {
						fn: this.__miniRuleCallback,
						scope: this
					}
				}

				request.isCompleteURL = true;
				request.action = this.data.base[0] + "://" + this.data.base[1] + ":" + this.data.base[2] + "/plnext/" + this.data.base[4] + "/MMiniRules.action;jsessionid=" + jsonResponse.data.framework.sessionId;
				request.action += "?SITE=" + this.data.base[11];
				request.action += "&LANGUAGE=" + this.data.base[12];
				request.action += "&TRANSACTION_ID=MiniRules";
				request.action += "&PAGE_TICKET=" + data.pgTkt;
				request.action += "&RULE_SOURCE_1_TYPE=RECORD_LOCATOR";
				request.action += "&RULE_SOURCE_1_ID=" + data.recLoc;
				request.action += "&result=json";
				if (this.data.rqstParams.reply.IS_USER_LOGGED_IN != null && this.data.rqstParams.reply.IS_USER_LOGGED_IN == true) {
					request.action += "&IS_USER_LOGGED_IN=" + this.data.rqstParams.reply.IS_USER_LOGGED_IN;
				}
				// COUNTRY_SITE
				if (this.data.base[13] != null && this.data.base[13] != '') {
					request.action += "&COUNTRY_SITE=" + this.data.base[13];
				}

				/*CR 1707950 ** */
				if (this.data.base[16] != null && this.data.base[16] != '') {
					request.action += "&PREF_AIR_FREQ_AIRLINE_1_1=" + this.data.base[16];
				}
				if (this.data.base[17] != null && this.data.base[17] != '') {
					request.action += "&PREF_AIR_FREQ_MILES_1_1=" + this.data.base[17];
				}
				if (this.data.base[18] != null && this.data.base[18] != '') {
					request.action += "&PREF_AIR_FREQ_LEVEL_1_1=" + this.data.base[18];
				}
				if (this.data.base[19] != null && this.data.base[19] != '') {
					request.action += "&PREF_AIR_FREQ_OWNER_TITLE_1_1=" + this.data.base[19];
				}
				if (this.data.base[20] != null && this.data.base[20] != '') {
					request.action += "&PREF_AIR_FREQ_OWNER_FIRSTNAME_1_1=" + this.data.base[20];
				}
				if (this.data.base[21] != null && this.data.base[21] != '') {
					request.action += "&PREF_AIR_FREQ_OWNER_LASTNAME_1_1=" + this.data.base[21];
				}
				if (this.data.base[22] != null && this.data.base[22] != '') {
					request.action += "&PREF_AIR_FREQ_NUMBER_1_1=" + this.data.base[22];
				}
				/*END CR 1707950 ** */

				// start an Ajax request
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			} else {

				if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){

					var popup = this.moduleCtrl.getJsonData({
						"key": "popup"
					});

					aria.utils.Json.setValue(popup, 'data', {
						labels: this.data.labels,
						siteParams: this.data.siteParams,
						rqstParams: this.data.rqstParams
					});

					aria.utils.Json.setValue(popup, 'settings', {
						    	macro : "fareConditions"
					});

					modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
					modules.view.merci.common.utils.MCommonScript.storeFormData("formPrefillData");
					this.moduleCtrl.navigate(null, 'Popup');

				}else{
					// showing all the popup with class as 'popup and facs'
					var popups = document.getElementsByClassName('popup facs');
					for (var i = 0; i < popups.length; i++) {
						popups[i].style.display = 'block';
					}
				}
			}

			// scroll to top
			window.scrollTo(0, 0);
		},

		__miniRuleCallback: function(response, inputParams) {
			if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				if (response.responseJSON.data.booking.MError_A == null) {
					jsonResponse.data.booking.MMiniRule_A = response.responseJSON.data.booking.MMiniRule_A;
					var pageId = response.responseJSON.homePageId;
					this.moduleCtrl.navigate(null, pageId);
				}
				else if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){

					var popup = this.moduleCtrl.getJsonData({
						"key": "popup"
					});

					aria.utils.Json.setValue(popup, 'data', {
						labels: this.data.labels,
						siteParams: this.data.siteParams,
						rqstParams: this.data.rqstParams
					});

					aria.utils.Json.setValue(popup, 'settings', {
						    	macro : "fareConditions"
					});

					modules.view.merci.common.utils.MCommonScript.storeFormData("formPrefillData");
					modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
					this.moduleCtrl.navigate(null, 'Popup');

				}else {
					var pageId = response.responseJSON.homePageId;
					var popups = document.getElementsByClassName('popup facs');
					for (var i = 0; i < popups.length; i++) {
						popups[i].style.display = 'block';
					}
				}
			}
		},

		closePopup: function() {
			// close the popup
			this.moduleCtrl.closePopup();
		},

		openHTML: function(args, data) {
			// calling common method to open HTML page popup
			var enableNewPopup = false;
			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){
				enableNewPopup =  true ;
			}
			data.moduleCtrl = this.moduleCtrl ;
			data.enableNewPopup = enableNewPopup ;
			modules.view.merci.common.utils.MCommonScript.openHTML(data);
		},

		openTermsLink: function() {
			if(modules.view.merci.common.utils.MCommonScript.booleanValue(this.data.siteParams.enableNewPopup)){
				var popup = this.moduleCtrl.getJsonData({
					"key": "popup"
				});

				var currencies = this.__getCurrencies() ;

				aria.utils.Json.setValue(popup, 'data', {
					data: this.data,
					currencies: currencies
				});

				aria.utils.Json.setValue(popup, 'settings', {
					    	macro : "currencyTerms"
				});

				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				modules.view.merci.common.utils.MCommonScript.storeFormData("formPrefillData");
				this.moduleCtrl.navigate(null, 'Popup');
			}
			else{
				window.scrollTo(0, 0);
				this.utils.showMskOverlay(false);
				//$('.msk').show();
				$('#checkTermsPopUp').show();
			}
		},

		toggleConfirm: function(args, data) {
			// getting DOM element
			var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
			var confirm = true;
			var btnConfirm = document.getElementById('btnConfirm');
			var chkBox = document.getElementById('CheckPenaliesBox');
			var chkBoxTerms = document.getElementById('CheckTermsLink');

			var chkBox2 = document.getElementById('PromptFee');
			if (this._getSiteBoolean('sitePromptFee') && !chkBox2.checked) {
				confirm = false;
			}

			var chkBox3 = document.getElementById('usRegulation');
			if (this._getSiteBoolean('siteDispUSRegulation') && chkBox3 != null && !chkBox3.checked) {
				confirm = false;
			}

			// code to toggle
			if (chkBox != null && chkBox.checked && confirm) {
				if (this._getSiteBoolean('siteAllowAPC')) {
					// if checked the remove 'disabled' css class
					if (chkBoxTerms.checked) {
						btnConfirm.className = btnConfirm.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
					} else {
						btnConfirm.className += " disabled";
					}
				} else {
					btnConfirm.className = btnConfirm.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
				}
			} else {
				// if unchecked add disabled css class
				btnConfirm.className += " disabled";
			}
		},

		gotoHome: function() {

			// taking action based on response
			if (this.data.rqstParams.merciDeviceBean.client == true) {
				document.location.href = this.data.rqstParams.merciCallBack + '://';
			}
			else if(this.utils.isRequestFromApps()){
					this.moduleCtrl.navigate(null, 'merci-Mindex_A');
			}else {
				if (this.data.siteParams.homeURL != null && this.data.siteParams.homeURL != '') {
					document.location.href = this.data.siteParams.homeURL;
				} else {
					this.moduleCtrl.navigate(null, 'merci-book-MSRCH_A');
				}
			}

		},

		showCancelBox: function(event, args) {
			// show overlay
			window.scrollTo(0, 0);
			this.moduleCtrl.showMskOverlay();

			// display popup
			var popupEl = document.getElementById('cancel-box');
			if (popupEl != null) {
				popupEl.style.display = 'block';
			}
		},

		closeCancelPopup: function(event, args) {
			// hide overlay
			this.moduleCtrl.hideMskOverlay();

			// hide popup
			var popupEl = document.getElementById('cancel-box');
			if (popupEl != null) {
				popupEl.style.display = 'none';
			}
		},

		onMasterPassClick: function(ATarg, args) {

			var fareAmt = document.getElementById('FARE_AMT');
			var elFareCode = document.getElementById('FARE_CODE');
			var params = '&FARE_AMT=' + fareAmt.value + '&FARE_CODE=' + elFareCode.value;

			var request = {
				formObj: document.getElementById('purcForm'),
				method: 'POST',
				loading: true,
				isSecured: true,
				expectedResponseType: 'json',
				parameters: params,
				cb: {
					fn: this.__onMPResponseCallBack,
					scope: this,
					args: args
				}
			}

			request.action = args.action;
			// start an Ajax request
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

		},
		__onMPResponseCallBack: function(response, inputParams) {
			window.location = response.responseJSON.redirectUrl;
		},

		/**
		 * finds dom element and returns it value
		 * if element not present then return an empty string
		 * @param args
		 * @return String
		 */
		getElValue: function(args) {
			var el = document.getElementById(args.key);
			if (el != null) {
				return el.value;
			}

			return "";
		},

		/**
		 * finds dom element and set its value
		 * if element not present then no action is taken
		 * @param args
		 */
		setElValue: function(args) {
			var el = document.getElementById(args.key);
			if (el != null) {
				el.value = args.value;
			}
		},

		formatPhoneNumber: function() {

			var countryCode = "";
			var phone_number	= "";
			var phoneNumber = this.getElValue({key: 'PHONE_NUMBER'});
			var areaCode = this.getElValue({key: 'AREA_CODE'});
			var country = this.getElValue({key: 'COUNTRY'});

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


			/* Send hidden parameters based on selected preferred phone type. Fix as part of PTR: 05625982*/
			/* Fix to format validation conditions for various phones and country. PTR: 05691338 */
			var selectedPhoneType = this.getElValue({key: 'PREFERRED_PHONE_NO'});
			this._bookUtil.setSelectedNumber(selectedPhoneType);
			if (selectedPhoneType == "H") {
				this.setElValue({key: 'CONTACT_POINT_HOME_PHONE', value: phone_number});
				this.setElValue({key: 'validationListForCONTACT_POINT_HOME_PHONE', value: 'true,1023,false,0,false,117311,false,0,false,0,true,117311'});
				this.setElValue({key: 'validationListForCONTACT_POINT_MOBILE_1', value: 'false,2130007,false,0,false,117311,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCONTACT_POINT_BUSINESS_PHONE', value: 'false,1043,false,0,false,117312,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCOUNTRY', value: 'true,1023,false,0,false,0,false,0,false,0,true,1023'});
			} else if (selectedPhoneType == "M") {
				this.setElValue({key: 'CONTACT_POINT_MOBILE_1', value: phone_number});
				this.setElValue({key: 'validationListForCONTACT_POINT_HOME_PHONE', value: 'false,1023,false,0,false,0,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCONTACT_POINT_MOBILE_1', value: 'true,2130007,false,0,false,117311,false,0,false,0,true,117311'});
				this.setElValue({key: 'validationListForCONTACT_POINT_BUSINESS_PHONE', value: 'false,1043,false,0,false,117312,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCOUNTRY', value: 'true,2130007,false,0,false,0,false,0,false,0,true,2130007'});
			} else if (selectedPhoneType == "O") {
				this.setElValue({key: 'CONTACT_POINT_BUSINESS_PHONE', value: phone_number});
				this.setElValue({key: 'validationListForCONTACT_POINT_HOME_PHONE', value: 'false,1023,false,0,false,0,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCONTACT_POINT_MOBILE_1', value: 'false,2130007,false,0,false,117311,false,0,false,0,false,0'});
				this.setElValue({key: 'validationListForCONTACT_POINT_BUSINESS_PHONE', value: 'true,1043,false,0,false,117312,false,0,false,0,true,117311'});
				this.setElValue({key: 'validationListForCOUNTRY', value: 'true,1043,false,0,false,0,false,0,false,0,true,1043'});
			}
		},

		onPurcFormSubmit: function(args, data) {

			try {
				if(this.data.rqstParams.purchaseInformationConfig && this.data.rqstParams.purchaseInformationConfig.multipleMop){
					if(document.getElementsByName("PAYMENT_TYPE")!=null && document.getElementById("PAYMENTTYPE")){
						var elements = document.getElementsByName("PAYMENT_TYPE");
						for(var i=0; i<elements.length;i++){
							if(elements[i].checked){
								document.getElementById("PAYMENTTYPE").value = elements[i].value;
							}
						}
					}
				}
				// preventing form submit
				args.preventDefault(true);

				//store credit card changes:start
				var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
				var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
				var storeccFlow = false;
				if (siteParams.siteStoreCCDetails != null && siteParams.siteStoreCCDetails.toLowerCase() == 'true' && !this.utils.isEmptyObject(rqstParams.numberOfProfiles)) {
					var noProfiles = Number(rqstParams.numberOfProfiles);
					if (noProfiles > 0) {
						storeccFlow = true;
						this._addRequestParamsStoreCC();
					}
				}
				if (this.__checkPayLaterAction()) {
					document.getElementsByName('ACTION')[0].value = 'HOLD';
				} else {
					if (this.plActionFlag) {
						document.getElementsByName('ACTION')[0].value = this.submitAction;
					}
				}
				//store credit card changes:end
				//this flow is for other than store credit card flow
				if (!storeccFlow) {
					this.purchFormSubmit(data);
				}
			} catch (e) {
				// error while page submission
				modules.view.merci.common.utils.URLManager.logError({
					msg: e.message,
					stack: e.stack,
					type: 'E',
					file: 'MPurcScript',
					method: 'onPurcFormSubmit'
				});
			}
		},

		purchFormSubmit: function(data) {
			if (this._getSiteBoolean('siteAllowAPC')) {
				var checkTermLink = document.getElementById('CheckTermsLink');
				if (checkTermLink == null || checkTermLink.checked == false) {
					return;
				}
			}

			if (this._getSiteBoolean('siteDispUSRegulation')) {
				var chkUSRegLink = document.getElementById('usRegulation');
				if (chkUSRegLink != null && !chkUSRegLink.checked) {
					return;
				}
			}

			try {
				// if terms and conditions are accepted
				var tacEL = document.getElementById('CheckPenaliesBox');
				var TpChk = document.getElementById('thirdPartyCheck');
				if (TpChk != null && TpChk.checked) {
					data.action = "Override.action";
				}

				if (tacEL != null && tacEL.checked == true) {

					// reset all the errors
					this.data.errors = new Array();
					this.data.warnings = new Array();

					// check is done for cancel button
					if (data.action != null) {
						var errorOccured = false;

						if (this._isRebookingFlow() && this._getSiteBoolean('siteRbkDispContactInfo')) {
							this.formatPhoneNumber();
						}
						if (this._getSiteBoolean('siteRetainSearch')) {
							this.storeBillingDetails();
						}
						// start validation
						if (this.data.isFop.toLowerCase() == 'cc') {
							errorOccured = !this.__validateCardHolderName();
							errorOccured = (!this.__validateCardNumber() || errorOccured);
							errorOccured = (!this.__validateCVVNumber() || errorOccured);
					    if(this._isRebookingFlow() || !this.data.siteParams.enableBillingInAlpi && !(this._isRebookingFlow())){
							errorOccured = (!this.__validateAddressLineOne() || errorOccured);
							errorOccured = (!this.__validateAddressCity() || errorOccured);
							errorOccured = (!this.__validateAddressState() || errorOccured);
							errorOccured = (!this.__validateAddressZip() || errorOccured);
							errorOccured = (!this.__validateAddressCountry() || errorOccured);
					      }else{
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_FIRSTLINE!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_FIRSTLINE";
									inputElement.id = "AIR_CC_ADDRESS_FIRSTLINE";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_FIRSTLINE;
									document.forms.purcForm.appendChild(inputElement);
					    	   }
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_SECONDLINE!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_SECONDLINE";
									inputElement.id = "AIR_CC_ADDRESS_SECONDLINE";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_SECONDLINE;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_CITY!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_CITY";
									inputElement.id = "AIR_CC_ADDRESS_CITY";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_CITY;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					    	  var addr_state= document.getElementById("AIR_CC_ADDRESS_STATE");
					    	  if(addr_state==null && this.data.rqstParams.param.AIR_CC_ADDRESS_STATE!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_STATE";
									inputElement.id = "AIR_CC_ADDRESS_STATE";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_STATE;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_ZIPCODE!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_ZIPCODE";
									inputElement.id = "AIR_CC_ADDRESS_ZIPCODE";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_ZIPCODE;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_COUNTRY_TXT!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_COUNTRY_TXT";
									inputElement.id = "AIR_CC_ADDRESS_COUNTRY_TXT";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_COUNTRY_TXT;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					    	  if(this.data.rqstParams.param.AIR_CC_ADDRESS_COUNTRY!=null){
									var inputElement = document.createElement("input");
									inputElement.type = "hidden";
									inputElement.name = "AIR_CC_ADDRESS_COUNTRY";
									inputElement.id = "AIR_CC_ADDRESS_COUNTRY";
									inputElement.value = this.data.rqstParams.param.AIR_CC_ADDRESS_COUNTRY;
									document.forms.purcForm.appendChild(inputElement);
					    	  }
					      }
							// extra validation for rebooking flow
							if (this._isRebookingFlow() && this._getSiteBoolean('siteRbkDispContactInfo')) {
								if (!this._getSiteBoolean('siteNewContactInfo')) {
									errorOccured = (!this.__validateContactInfo() || errorOccured);
								} else {
									errorOccured = (!this.__validateExtendedContactInfo() || errorOccured);
								}
							}

							if (this._getSiteBoolean('siteEnableCollectCPF') && this._getSiteBoolean('sitePayUseTFOPCG')) {
								errorOccured = (!this.__validateCPFFields() || errorOccured);
							}
						}

						if (errorOccured == false) {
							// checking if the checkbox is checked or not
							// if checked then only continuing
							var chkBox = document.getElementById('CheckPenaliesBox');
							if (chkBox.checked) {

								//update country
								if (this._getSiteBoolean('sitePredTxtCountry')) {
									this.updateCountry();
								}

								// initiate ajax
								var request = {
									formObj: document.getElementById('purcForm'),
									action: data.action,
									method: 'POST',
									timeout: 600000,
									loading: true,
									isSecured: true,
									expectedResponseType: 'json',
									cb: {
										fn: this.__onPurcFormCallBack,
										scope: this
									}
								};

								modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
							}
						} else {

							// scroll to top
							window.scrollTo(0, 0);

							//log the errors
							if(!this.utils.isEmptyObject(this.data.errors)){
								for(var i=0; i<this.data.errors.length; i++){
									aria.core.Log.error('MPurcScript', "(purchFormSubmit): "+this.data.errors[i].TEXT ,[],'E');
								}
						}


							// if error then refresh error section
							aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
							aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
						}
					} // end of null check on action

				} // end of check whether terms and conditions are accepted
			} catch (e) {
				// error while page submission
				modules.view.merci.common.utils.URLManager.logError({
					msg: e.message,
					stack: e.stack,
					type: 'E',
					file: 'MPurcScript',
					method: 'purchFormSubmit'
				});
			}
		},

		/**
		 * toggle the diplay of 3DS flow credit card info
		 * @param event
		 * @param args contains the credit card type for DOM manipulation
		 */
		toggleCCInfo: function(event, args) {
			var cardFig = document.getElementById(this.$getId(args.card));
			var cardDD = document.getElementById(this.$getId('data' + args.card));

			if (cardDD != null) {
				if (cardDD.className.indexOf('hidden') == -1) {
					cardDD.className += ' hidden';
				} else {
					cardDD.className = cardDD.className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
				}
			}

			if (cardFig != null) {
				if (cardFig.className.indexOf('clicked') == -1) {
					cardFig.className += ' clicked';
				} else {
					cardFig.className = cardFig.className.replace(/(?:^|\s)clicked(?!\S)/g, '').trim();
				}
			}
		},

		removeCC: function(event, args) {

			  this.selVal = $('#AIR_CC_TYPE option:selected').attr('id');
			      if(this.selVal!= undefined){

			    	var num = this.selVal.split("_")[1]
					var parameters = 'CC_TOBE_DELETED_'+num+'=TRUE&CC_ID_'+num+'='+this.selVal+'&CC_TOBE_STORED_'+num+'=TRUE&UPDATE_TRIP_PLAN=TRUE';

					// create JSON
					var request = {
						action: args.action,
						method: 'POST',
						parameters: parameters,
						loading: true,
						isSecured: true,
						expectedResponseType: 'json',
						cb: {
							fn: this.__removeCCCallBack,
							scope: this,
							args: args
						}
					};

					// start an AJAX request
					modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
			       }
		},

		__removeCCCallBack: function(response, params){
			this.utils.hideMskOverlay();
			if(this.selVal!="" && this.selVal!= undefined){
				this.data.rqstParams.listCCInformation = $.grep(this.data.rqstParams.listCCInformation, function(a){
					                                                  return  a.creditCardId!= pagePurc.selVal;
					                                                });
				this.$refresh({
					section: "paymentType"
				});
			}
		},

		_onValueChange: function(){
			if(this.data.siteParams.deleteStoredCC.toUpperCase() == 'TRUE' && this.data.rqstParams.listCCInformation != null && this.data.rqstParams.listCCInformation.length > 0){
				var airCCEL = document.getElementById('AIR_CC_TYPE');
				var listCCInfo = this.data.rqstParams.listCCInformation;
				if(airCCEL != null){
					var cardDisplayName = airCCEL.options[airCCEL.selectedIndex].innerHTML;
					var expMonth = document.getElementById('CCexpiryDateMonth');
					var expYear = document.getElementById('CCexpiryDateYear');
					if (cardDisplayName != null && cardDisplayName.indexOf('*') != -1) {
						var ccEle = document.getElementById('AIR_CC_TYPE');
						var ccEleID = airCCEL.options[ccEle.selectedIndex].id;
						expMonth = expMonth.options[expMonth.selectedIndex].value;
						expYear = expYear.options[expYear.selectedIndex].innerHTML.trim();
						for (var cardIndex in listCCInfo) {
							var cardInfo = listCCInfo[cardIndex];
							if(ccEleID!="" && cardInfo.creditCardId == ccEleID){
								if (cardInfo.ownerName == document.getElementById('AIR_CC_NAME_ON_CARD').value.trim()&& cardInfo.expiryDate.month+1 == expMonth && cardInfo.expiryDate.year == expYear){
					                $('#updateCC,#storeCC').addClass('hidden');
					                $('#deleteCC').removeClass('hidden');
                				 }else{
 					                $('#deleteCC,#storeCC').addClass('hidden');
					                $('#updateCC').removeClass('hidden');
                				 }
					          break;
								}
							}
						}
					}
			 }
		},


		_anyAmtToPay: function(){
			var tripPrices = this.__getTripPrice();
			if(tripPrices.length>0){
				if(!this.utils.isEmptyObject(tripPrices[0].rebookBalanceTotalAmount)){
					if(tripPrices[0].rebookBalanceTotalAmount<=0){
						return false;
					}
				}
			}
			return true;
		},

		_siteBillingRequired: function() {
			return this.data.siteParams.siteBillingNotRequired == null || this.data.siteParams.siteBillingNotRequired.toLowerCase() == 'n' || this.data.siteParams.siteBillingNotRequired.toLowerCase() == 'false';
		},

		__isCreditCardArticleHidden: function() {
			// if credit card section is completely hidden
			var ccHolderArticle = document.getElementById('cccontrols');
			return ccHolderArticle != null && ccHolderArticle.className.indexOf('hidden') != -1;
		},

		__showExtPaymentRadio: function() {

			// get data
			var mopAvailabilityMap = this.data.rqstParams.purchaseInformationConfig.mopAirAvailabilityMap;
			return mopAvailabilityMap && (mopAvailabilityMap['EXT'].isAvailable && (this.utils.isEmptyObject(this.data.rqstParams.isMins) || this.data.rqstParams.isMins == false)) || (this.data.rqstParams.isMins == true && mopAvailabilityMap['EXT'].isAvailable && mopAvailabilityMap['EXT'].isInsCompatible);
		},

		__showDeferredRadio: function() {
			// get data
			var mopAvailabilityMap = this.data.rqstParams.purchaseInformationConfig.mopAirAvailabilityMap;
			return mopAvailabilityMap && mopAvailabilityMap['DFRR'].isAvailable && (this.utils.isEmptyObject(this.data.rqstParams.isMins) || this.data.rqstParams.isMins == false);
		},

		__showCCPaymentRadio: function() {
			return this.data.siteParams.siteMopCC != null && this.data.siteParams.siteMopCC.toLowerCase() == 'true';
		},

		__getTripPrice: function() {
			if (this.data.rqstParams.fareBreakdown.tripPrices != null && this.data.rqstParams.fareBreakdown.tripPrices.length > 0) {
				return this.data.rqstParams.fareBreakdown.tripPrices;
			}

			return [{}];
		},

		__getCurrencies: function() {
			if (this.data.rqstParams.fareBreakdown.currencies != null && this.data.rqstParams.fareBreakdown.currencies.length > 0) {
				return this.data.rqstParams.fareBreakdown.currencies;
			}

			return [{}];
		},

		__allowPromo: function() {
			// evaluate result
			return this.data.rqstParams.isPromoDisplay != 'NO' && !this._isRebookingFlow() && this.data.siteParams.siteAllowPromo != null && this.data.siteParams.siteAllowPromo.toLowerCase() == 'true';
		},

		__getPaxCount: function() {

			var paxCount = 0;
			if (!this.utils.isEmptyObject(this.data.rqstParams.listTravellerBean.numberOfTraveller)) {
				paxCount = this.data.rqstParams.listTravellerBean.numberOfTraveller;
			}

			return paxCount;
		},

		__getTotalPrice: function() {

			var totalPrice = 0;
			var tripPrices = this.__getTripPrice();

			if (!this.utils.isEmptyObject(tripPrices) && !this.utils.isEmptyObject(tripPrices[0].pricesWithTax)) {
				totalPrice = tripPrices[0].pricesWithTax;
			} else {
				totalPrice = tripPrices[0].totalAmount;
			}

			return totalPrice;
		},

		__getPromoDates: function() {
			var dates = {};

			if (this.data.rqstParams.listItineraryBean.itineraries != null) {
				for (var i = 0; i < this.data.rqstParams.listItineraryBean.itineraries.length; i++) {
					var itinerary = this.data.rqstParams.listItineraryBean.itineraries[i];
					if (i == 0) {
						dates.beginDate = itinerary.beginDateBean.formatDateTimeAsYYYYMMddHHMM;
					} else if (i == this.data.rqstParams.listItineraryBean.itineraries.length - 1) {
						dates.endDate = itinerary.endDateBean.formatDateTimeAsYYYYMMddHHMM;
					}
				}
			}

			return dates;
		},

		/**
		 * creates a new Date object from DateBean JSON object
		 */
		_getDate: function(dateBean) {
			if (dateBean != null) {
				return new Date(dateBean.year, dateBean.month, dateBean.day, dateBean.hour, dateBean.minute, 0);
			}

			return null;
		},

		_isRebookingFlow: function() {
			if (!this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown)) {
				return !this.utils.isEmptyObject(this.data.rqstParams.fareBreakdown.rebookingStatus) && this.data.rqstParams.fareBreakdown.rebookingStatus;
			} else {
				return false;
			}
		},

		_onCreditCardSelection: function(event, args) {
			if (this.data.isFop != undefined && this.data.isFop.toLowerCase() == 'cc') {

				// only when total to pay is more than 0
				if (!this._isRebookingFlow() || this.__getTripPrice()[0].rebookBalanceTotalAmount > 0) {

					// get DOM elements
					var airCCEL = document.getElementById('AIR_CC_TYPE');
					var ccvMandatoryEL = document.getElementById('isCvvMandatory');

					var ccType = null;
					var isMandatory = false;
					if (airCCEL != null) {
						ccType = airCCEL.options[airCCEL.selectedIndex].value;
					}

					if ((ccType == 'VI' || ccType == 'CA' || ccType == 'AX') &&
						this.data.siteParams.siteCCDigitCode != null && this.data.siteParams.siteCCDigitCode.toLowerCase() == 'true') {
						isMandatory = true;
					} else if ((ccType == 'DC' || ccType == 'JC') &&
						this.data.siteParams.siteSpecificCCDigitCo != null && this.data.siteParams.siteSpecificCCDigitCo.toLowerCase() == 'true') {
						isMandatory = true;
					} else {
						for (var i = 0; i < this.data.globalList.slSiteCreditCard.length; i++) {
							if (this.data.globalList.slSiteCreditCard[i][0] == ccType && this.data.globalList.slSiteCreditCard[i][8] == 'Y') {
								isMandatory = true;
								break;
							}
						}
					}

					if (ccvMandatoryEL != null) {
						ccvMandatoryEL.value = isMandatory;
					}

					// toggle CCV based on mandate
					this.__toggleCCVFields(isMandatory);
					//store credit card changes:start
					var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
					var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
					if (siteParams.siteStoreCCDetails != null && siteParams.siteStoreCCDetails.toLowerCase() == 'true' && rqstParams.numberOfProfiles != null) {
						var noProfiles = parseInt(rqstParams.numberOfProfiles);
						if (rqstParams.listCCInformation != null && ccType != null && noProfiles > 0) {
							var displayname = airCCEL.options[airCCEL.selectedIndex].innerHTML;
							var ccId = airCCEL.options[airCCEL.selectedIndex].id;
							this._prepopulateFields(displayname,
								rqstParams.listCCInformation,
								ccType, ccId);
						}
					}
				}
				//store credit card changes:end
			}
		},

		__toggleCCVFields: function(isVisible) {
			var lblCCV1 = document.getElementById('lblCCDigitAir1');
			var lblCCV2 = document.getElementById('lblCCDigitAir2');
			var ccvEL = document.getElementById('CC_DIGIT_CODE_AIR_1');

			if (ccvEL != null) {
				if (!isVisible) {
					ccvEL.className += ' hidden';
				} else {
					ccvEL.className = ccvEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}

			if (lblCCV1 != null) {
				if (!isVisible) {
					lblCCV1.className += ' hidden';
				} else {
					lblCCV1.className = lblCCV1.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}

			if (lblCCV2 != null) {
				if (!isVisible) {
					lblCCV2.className += ' hidden';
				} else {
					lblCCV2.className = lblCCV2.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}
		},

		_getSiteBoolean: function(key) {
			return this.data.siteParams[key] != null && (this.data.siteParams[key].toLowerCase() == 'true' || this.data.siteParams[key].toLowerCase() == 'y' || this.data.siteParams[key].toLowerCase() == 'yes');
		},

		_isAwardsFlow: function() {

			return this._getSiteBoolean('siteAllowAwards') && !this.utils.isEmptyObject(this.data.rqstParams.awardsFlow) || this.utils.booleanValue(this.data.rqstParams.param.isAwardsFlow);
		},

		_getCreditCardInfo: function() {

			var ccInfo = {
				isVisaActivated: false,
				isMasterCardActivated: false,
				listCreditCards: this.data.globalList.slLanguageCreditCard
			};

			// start iteration on global list
			for (var i = 0; i < this.data.globalList.slLanguageCreditCard.length; i++) {
				var langCreditCardItem = this.data.globalList.slLanguageCreditCard[i];
				for (var j = 0; j < this.data.globalList.slSiteCreditCard.length; j++) {
					var siteCreditCardItem = this.data.globalList.slSiteCreditCard[j];
					if (langCreditCardItem[0] == siteCreditCardItem[0]) {
						if (langCreditCardItem[0] == 'VI') {
							ccInfo.isVisaActivated = true;
						}

						if (langCreditCardItem[0] == 'CA') {
							ccInfo.isMasterCardActivated = true;
						}
					}
				}
			}

			if (!this.utils.isEmptyObject(this.data.rqstParams.purchaseInformationConfig) && !this.utils.isEmptyObject(this.data.rqstParams.purchaseInformationConfig.listCreditCards)) {
				ccInfo.listCreditCards = this.data.rqstParams.purchaseInformationConfig.listCreditCards;
			}

			return ccInfo;
		},

		_getFractionDigits: function() {

			var fractionDigits = 0;
			if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			return fractionDigits;
		},

		__addErrorMessage: function(message) {
			// if errors is empty
			if (this.data.errors == null || this.utils.isEmptyObject(this.data.errors)) {
				this.data.errors = new Array();
			}
			// create JSON and append to errors
			var error = {
				'TEXT': message
			};
			this.data.errors.push(error);
		},

		/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
		_onPayTypeSelection: function(event, args) {
			// get DOM elements
			var dpDownValue = document.getElementById('paymethod');
			var storeTempWarnings = this.data.warnings;
			this.data.warnings = new Array();
			aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
			var ccwarn = document.getElementById('ccwarn');
			var payLaterLabel = document.getElementById('payLabel');
			var cccontrols = document.getElementById('cccontrols');
			var promoPanel = document.getElementById(this.$getId('promo'));
			var btnPromoEl = document.getElementById(this.$getId('btnPromo'));
			if (ccwarn != null) {
				ccwarn.style.display = 'block';
			}
			if (payLaterLabel != null) {
				payLaterLabel.style.display = 'none';
			}
			if (cccontrols != null) {
				cccontrols.style.display = 'block';
			}
			if(this.data.siteParams.siteEnableSpeedBook == "TRUE" && this.data.rqstParams.param.SPEEDBOOK == "TRUE"){
				document.getElementById('paymentInfo').className = document.getElementById('paymentInfo').className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
			}
			if (promoPanel != null) {
				promoPanel.style.display = 'block';
			}
			if (dpDownValue != null) {
				var payType = dpDownValue.options[dpDownValue.selectedIndex].value;
				localStorage.setItem('selectedPayMethod', payType);
			}
			if (this.__checkPayLaterAction()) {
				if (args.payLaterEnbl == 'TRUE'){
				payType = 'PLCC';
				}else{
					payType = 'TTT';
				}
			} else {
				if (this.plActionFlag) {
					payType = this.payment_type;
				}
			}
			if(payType.indexOf("AMOP")>-1)  {
				var payTypeAMOP = payType;
				payType="AMOP";
			}
			switch (payType) {
				case "SADAD":
					//aria.utils.Json.setValue(this.data, 'isFop', "SADAD");
					this.data.isFop = "SADAD";
					this.toggleInsurancePanel("SADAD");
					if (this.utils.isEmptyObject(this.data.warnings)) {
						this.data.warnings = new Array();
					}
					storeTempWarnings = this.data.warnings;
					this.data.warnings.push({
						TEXT: this.data.labels.tx_merci_sadad_pay_warning
					});
					this.data.warnings.push({
						TEXT: this.data.labels.tx_merci_sadad_fare_warning
					});
					//aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
					break;
				case "PPAL":
					//aria.utils.Json.setValue(this.data, 'isFop', "PPAL");
					this.data.isFop = "PPAL";
					this.toggleInsurancePanel("PPAL");
					if (this.utils.isEmptyObject(this.data.warnings)) {
						this.data.warnings = new Array();
					}
					storeTempWarnings = this.data.warnings;
					this.data.warnings.push({
						TEXT: this.data.labels.tx_merci_text_ppal_redirect
					});
					this.data.warnings.push({
						TEXT: this.data.labels.tx_pltg_text_WrongPaymentOption
					});
					aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
					ccwarn.style.display = 'none';
					window.scrollTo(0, 0);
					break;
				case "CC":
					//aria.utils.Json.setValue(this.data, 'isFop', "CC");
					this.data.isFop = "CC";
					this.toggleInsurancePanel("CC");
					this.data.warnings = storeTempWarnings;
					aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
					break;
				case "PLCC":
					//aria.utils.Json.setValue(this.data, 'isFop', "PLCC");
					this.data.isFop = "PLCC";
					this.data.warnings = storeTempWarnings;
					aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
					payLaterLabel.style.display = 'inline-block';
					cccontrols.style.display = 'none';
					if(this.data.siteParams.siteEnableSpeedBook == "TRUE" && this.data.rqstParams.param.SPEEDBOOK == "TRUE"){
						document.getElementById('paymentInfo').className += " hidden";
					}
					ccwarn.style.display = 'none';
					if(promoPanel != null){
					promoPanel.style.display = 'none';
					}
					this.toggleInsurancePanel("PLCC");
					// if button label is check then initiate an AJAX call
					if (btnPromoEl != null && btnPromoEl.innerHTML != null && btnPromoEl.innerHTML.trim() == this.data.labels.tx_merci_text_book_promo_cancel) {
						this.__cancelPromo();
					}
					break;
				case "AMOP":
					//aria.utils.Json.setValue(this.data, 'isFop', payTypeAMOP);
					this.toggleInsurancePanel(payTypeAMOP);
					this.data.isFop = payTypeAMOP;
					// if (this.utils.isEmptyObject(this.data.warnings)) {
					// 	this.data.warnings = new Array();
					// }
					// storeTempWarnings = this.data.warnings;
					// aria.utils.Json.setValue(this.data, 'showWarning', !this.data.showWarning);
					ccwarn.style.display = 'none';
					//window.scrollTo(0, 0);
					break;
				case "TTT":
					payLaterLabel.style.display = 'inline-block';
					if(this.data.siteParams.siteEnableSpeedBook == "TRUE" && this.data.rqstParams.param.SPEEDBOOK == "TRUE"){
						document.getElementById('paymentInfo').className += " hidden";
					}
					if(promoPanel != null){
					promoPanel.style.display = 'none';
					}
					this.toggleInsurancePanel("PLCC");
					// if button label is check then initiate an AJAX call
					if (btnPromoEl != null && btnPromoEl.innerHTML != null && btnPromoEl.innerHTML.trim() == this.data.labels.tx_merci_text_book_promo_cancel) {
						this.__cancelPromo();
					}
					break;
				default:
					this.toggleInsurancePanel("CC");
					console.log("payType is NULL");
			}
			this.$refresh({
				section: 'paymentType'
			});
		},
		toggleInsurancePanel: function(fop) {
			var id = document.getElementsByClassName("insVal");
			for (i = 1; i <= id.length; i++) {
				if (fop == 'PPAL' || fop == 'PLCC' || fop == 'TTT') {
					document.getElementById("radio" + i).disabled = true;
				} else {
					document.getElementById("radio" + i).disabled = false;
				}
			}
			var labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels;
			if (fop == 'PPAL') {
				if (document.getElementById("btnConfirm") != null)
					document.getElementById("btnConfirm").innerHTML = labels.tx_merci_text_ppal_confirm + " " + labels.tx_merci_text_ppal_text;
			} else if (fop == 'PLCC') {
				if (document.getElementById("btnConfirm") != null)
					document.getElementById("btnConfirm").innerHTML = labels.tx_merci_ts_paymentpage_Paylater;
			} else {
				var getConfirmLabel = this.__getCnfrmLabel();
				if (document.getElementById("btnConfirm") != null)
					document.getElementById("btnConfirm").innerHTML = getConfirmLabel;
			}
		},

		getOpcDateSadad: function() {
			var onHoldBean = this.data.rqstParams.onHoldBean;
			var opcDate = null;
			if (!this.utils.isEmptyObject(onHoldBean)) {
				var dateParams = onHoldBean.pnrCancellationDate.jsDateParams.split(",");
				var opcDate = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				var opcDateSadadMilliseconds = opcDate.getTime() - 3600000; /*subtracting one hour according to SADAD guidelines*/
				opcDate = new Date(opcDateSadadMilliseconds);
			}
			return opcDate;
		},

		getFormattedDateString: function(opcDate) {
			var pattern = this.data.labels.tx_merci_pattern_sadad_cancel_warning;
			var opcDayString = aria.utils.Date.format(opcDate, "EEEE d MMMM yyyy");
			var opcTimeString = aria.utils.Date.format(opcDate, "HH:mm");
			var finalWarningMessage = this.utils.formatString(pattern, opcDayString, opcTimeString);
			var opcDayStringIndex = finalWarningMessage.indexOf(opcDayString);
			var opcTimeStringIndex = finalWarningMessage.indexOf(opcTimeString);
			var formattedWarningMessage = finalWarningMessage.substr(0, opcDayStringIndex) + '<b>' + opcDayString + '</b>' + finalWarningMessage.substr(opcDayStringIndex + opcDayString.length, opcTimeString.length) + '<b>' + opcTimeString + '</b>' + finalWarningMessage.substr(opcTimeStringIndex + opcTimeString.length);
			return formattedWarningMessage;
		},
		/*Methods added as part of CR 5533028- SADAD Implementation for MeRCI- END*/

		getInstallmentPlan: function() {
			var ccNumber = "";
			var ccType = "";
			if (document.getElementById("AIR_CC_NUMBER") != null)
				ccNumber = document.getElementById("AIR_CC_NUMBER").value;
			if (document.getElementById("AIR_CC_TYPE") != null)
				ccType = document.getElementById("AIR_CC_TYPE").options[document.getElementById("AIR_CC_TYPE").selectedIndex].value;
			var request = {
				action: 'MGetInstallmentPlan.action',
				method: 'POST',
				parameters: 'TRANSACTION_ID=GetInstallmentPlan&CC_NUMBER=' + ccNumber + '&CC_TYPE=' + ccType + '&CC_ID=1&OUTPUT_FORMAT=json&result=json',
				timeout: 600000,
				loading: false,
				isSecured: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.onInstallmentCallback,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
		},
		onInstallmentCallback: function(response) {
			this.moduleCtrl.getModuleData().booking.MPURC_A.installmentData = response.responseJSON;
			this.$refresh({
				section: "allInstallments"
			});
			this.utils.storeLocal("NO_OF_INSTALLMENTS", "1", "overwrite", "text");
			aria.utils.Json.setValue(this.data, 'showInstallments', !this.data.showInstallments);
		},
		onChangeInstallments: function() {
			var numOfInstlmnt = 0;
			var instlmntElement = document.getElementById("PAYMENT_GROUP_1_LIST_PAYMENT_1_INSTALLMENT_PLAN_ID");
			if (instlmntElement != null) {
				numOfInstlmnt = parseInt(instlmntElement.options[instlmntElement.selectedIndex].value, 10) + 1;
			}
			this.utils.storeLocal("NO_OF_INSTALLMENTS", numOfInstlmnt, "overwrite", "text");
			aria.utils.Json.setValue(this.data, 'showInstallments', !this.data.showInstallments);
		},
		_isInstallmentsEnabled: function() {
			var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
			return this.utils.booleanValue(siteParams.siteInstallmentsEnabled) && this.utils.booleanValue(siteParams.merciInstallmentsEnabled);
		},

		_isOnlyExtCreditCard: function() {
			return this.data.siteParams.siteCCPsp != null && this.data.siteParams.siteCCPsp.toLowerCase() == 'html' && this.__showCCPaymentRadio() && !this._getSiteBoolean('siteMopOffline') && !this._getSiteBoolean('siteMopExt');
		},

		_getExtPaymentParams: function() {
			var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
			var params = {
				actionInput: 'BOOK',
				uiAction: 'MMBookTripPlan.action'
			}
			if (rqstParams.templateName == 'mpurc') {
				params.uiAction = 'ModifyBookTripPlan.action';
				if (rqstParams.jspFrom != null && rqstParams.jspFrom == 'mfsr') {
					params.actionInput = 'MODIFY';
				}
			} else if (rqstParams.fareBreakdown.rebookingStatus == true) {
				params.actionInput = 'REBOOK';
				params.uiAction = 'MMBookTripPlan.action';
			} else if (rqstParams.flowType.voucherRedemptionFlow == true) {
				params.uiAction = 'MMBookTripPlan.action';
			} else if (rqstParams.templateName == 'mins') {
				params.uiAction = 'BookTripPlan.action';
				params.actionInput = 'ADD_INSURANCE';
			}
			return params;
		},
		_getExtPaymentURLs: function() {
			// get params
			var params = this._getExtPaymentParams();
			var siteParams = this.moduleCtrl.getModuleData().booking.MPURC_A.siteParam;
			// create a common action for confirmation or cancellation
			var commonPath = this.urlManager.getFullURL(params.uiAction, {
				defaultParam: true
			}) + "&ACTION=" + params.actionInput + "&OFFICE_ID=" + siteParams.siteOfficeId;
			// office id added to keep alive URL for PTR 07550299
			var keepAliveURL = this.urlManager.getFullURL("KeepAliveSessionAction.action", null) + "&ACTION=" + params.actionInput + "&OFFICE_ID=" + siteParams.siteOfficeId;
			var urls = {
				confirmationUrl: commonPath + "&STATUS=OK",
				cancellationUrl: commonPath + "&STATUS=KO",
				amopConfirmationUrl: commonPath.split("plnext").join("amop/confirm/plnext").replace(/[?&]/g,";"),
				keepAliveSessionUrl: keepAliveURL
			};
			return urls;
		},
		payLaterAction: function(args, data) {

			if (this.__checkPayLaterAction()) {
				this.plActionFlag = true;
				if (this.payment_type == null && document.getElementsByName('PAYMENT_TYPE')[0]) {
					this.payment_type = document.getElementsByName('PAYMENT_TYPE')[0].value;
				}
				if (this.submitAction == null) {
					this.submitAction = document.getElementsByName('ACTION')[0].value;
				}
				document.getElementsByName('ACTION')[0].value = 'HOLD';

				if(data.payLaterEnbl == 'FALSE' && data.timeToThinkEnbl == 'TRUE'){
					var rqstParams = this.moduleCtrl.getModuleData().booking.MPURC_A.requestParam;
					var listMop = rqstParams.purchaseInformationConfig.mopAirAvailabilityMap;
					if(this.data.TTTCompatibleArr == null || this.data.TTTCompatibleArr.length == 0){
						this.data.TTTCompatibleArr = new Array();
						for (item in listMop){
							if (listMop.hasOwnProperty(item)){
								var mop = listMop[item];
								if (mop.isTTTCompatible){
									this.data.TTTCompatibleArr.push(mop.typeCode);
								}
							}
						}
					}
					this.$refresh({
						section: 'extPayMethods'
					});
					this.data.showTTTPrice = true;
					this.$refresh({
						section: 'TTTPrice'
					});
					document.getElementById("TTTPriceBrkDown").style.display = 'block';
					var inputElement = document.createElement("input");
					inputElement.type = "hidden";
					inputElement.name = "TIME_TO_THINK_ID";
					inputElement.id = "TIME_TO_THINK_ID";
					inputElement.value = data.id;
					document.forms.purcForm.appendChild(inputElement);
					var inputElement1 = document.createElement("input");
					inputElement1.type = "hidden";
					inputElement1.name = "tttProduct_1";
					inputElement1.id = "tttProduct_1";
					inputElement1.value = "0|0";
					document.forms.purcForm.appendChild(inputElement1);
					document.forms.purcForm.elements.CONFIRMATION_URL.value = document.forms.purcForm.elements.CONFIRMATION_URL.value.replace("ACTION=BOOK", "ACTION=HOLD");
					document.forms.purcForm.elements.CANCELLATION_URL.value =  document.forms.purcForm.elements.CANCELLATION_URL.value.replace("ACTION=BOOK", "ACTION=HOLD");
					document.forms.purcForm.elements.TYPE.value = 'HOLD';
					document.forms.purcForm.elements.REC_LOC.value = document.forms.purcForm.elements.PLTG_RECORD_LOCATORS.value;
				}
				this._onPayTypeSelection(args, data);
			} else {
				if (document.getElementsByName('PAYMENT_TYPE')[0]) {
					document.getElementsByName('PAYMENT_TYPE')[0].value = this.payment_type;
				}
				document.getElementsByName('ACTION')[0].value = this.submitAction;
				if(data.payLaterEnbl == 'FALSE' && data.timeToThinkEnbl == 'TRUE'){
					this.data.TTTCompatibleArr = [];
					this.$refresh({
						section: 'extPayMethods'
					});
					this.data.showTTTPrice = false;
					this.$refresh({
						section: 'TTTPrice'
					});
					document.getElementById("TTTPriceBrkDown").style.display = 'none';
					//document.getElementById("TIME_TO_THINK_ID").value = "";
					document.getElementById("TIME_TO_THINK_ID").remove();
					document.getElementById("tttProduct_1").remove();
					document.forms.purcForm.elements.CONFIRMATION_URL.value = document.forms.purcForm.elements.CONFIRMATION_URL.value.replace("ACTION=HOLD","ACTION=BOOK");
					document.forms.purcForm.elements.CANCELLATION_URL.value =  document.forms.purcForm.elements.CANCELLATION_URL.value.replace("ACTION=HOLD","ACTION=BOOK");
					document.forms.purcForm.elements.TYPE.value = 'booking';
					document.forms.purcForm.elements.REC_LOC.value = "";
				}
				this._onPayTypeSelection(args, data);
			}
		},
		__checkPayLaterAction: function() {

			var onOffSwitch = document.getElementById('plonoffswitch');
			if (onOffSwitch != null) {
				return onOffSwitch.checked;
			} else {
				return false;
			}

		},
		__getCnfrmLabel: function() {
			var labels = this.moduleCtrl.getModuleData().booking.MPURC_A.labels;
			if (this._isRebookingFlow()) {
				return labels.tx_merci_atc_new_trip;
			} else {
				return labels.tx_merci_text_booking_purc_confirm_purchase
			}
		},
		_getDateTime: function(dateBean) {
			if (dateBean != null && (dateBean.jsDateParams != null || dateBean.jsDateParameters != null)) {
				if(dateBean.jsDateParams != null){
				var dateParams = dateBean.jsDateParams.split(',');
				}else if(dateBean.jsDateParameters != null){
					var dateParams = dateBean.jsDateParameters.split(',');
				}
				var dtTime = new Date(dateParams[0], dateParams[1], dateParams[2], dateParams[3], dateParams[4], dateParams[5]);
				return dtTime;
			}
			return null;
		},
		_navigateToAlpi: function(response, args) {

			var params = 'PAGE_TICKET=' + args.pgTkt + '&result=json&IS_SPEED_BOOK=TRUE&IS_SPEED_BOOK1=TRUE&SKIP_ALPI=FALSE';
			var actionName = 'MAddElementsTravellerInformation.action';
			var request = {
				parameters: params,
				action: actionName,
				method: 'POST',
				loading: true,
				expectedResponseType: 'json',
				cb: {
					fn: this.__onNavigateToALPICB,
					args: params,
					scope: this
				}
			};
			modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);

		},

		__onNavigateToALPICB: function(response, params) {
			var json = this.moduleCtrl.getModuleData();
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null && response.responseJSON.data.booking != null) {
				json.booking[dataId] = response.responseJSON.data.booking[dataId];
				json.header = response.responseJSON.data.header;
				// navigate to next page
				this.moduleCtrl.navigate(null, nextPage);
			}
		},

		_dispPayment: function() {
			document.getElementById('speedId1').style.display = 'none';
			document.getElementById('speedId2').style.display = 'none';
			document.getElementById('speedId3').style.display = 'none';
			document.getElementById('speedCCControls').className = "";
			document.getElementById('cccontrols').className = document.getElementById('cccontrols').className.replace(/(?:^|\s)hidden(?!\S)/g, '').trim();
			document.getElementById("speedId4").className = document.getElementById("speedId4").className.replace(/(?:^|\s)hidden(?!\S)/, '');
		},

		_revokeDispPayment: function(response, args) {
			if (args.save == 'true') {
				this._dispPaymentPanel();
			}
			document.getElementById('speedId1').style.display = 'block';
			document.getElementById('speedId2').style.display = 'block';
			document.getElementById('speedId3').style.display = 'block';
			document.getElementById('speedCCControls').className = "hidden";
			document.getElementById("speedId4").className += " hidden";
		},

		cloneCVV: function() {
			document.getElementById('CC_DIGIT_CODE_AIR_1').value = document.getElementById('CC_DIGIT_CODE_AIR_2').value;
		},

		_dispPaymentPanel: function() {
			var ccType = document.getElementById("AIR_CC_TYPE");
			var str = document.getElementById('AIR_CC_NUMBER').value;
			var firstLine = "",
				secLine = "",
				city = "",
				state = "",
				zip = "",
				country = ""
			if (document.getElementById('AIR_CC_ADDRESS_FIRSTLINE') != null && document.getElementById('AIR_CC_ADDRESS_FIRSTLINE').value != "") {
				firstLine = document.getElementById('AIR_CC_ADDRESS_FIRSTLINE').value + ", ";
			}
			if (document.getElementById('AIR_CC_ADDRESS_SECONDLINE') != null && document.getElementById('AIR_CC_ADDRESS_SECONDLINE').value != "") {
				secLine = document.getElementById('AIR_CC_ADDRESS_SECONDLINE').value + ", ";
			}
			if (document.getElementById('AIR_CC_ADDRESS_CITY') != null && document.getElementById('AIR_CC_ADDRESS_CITY').value != "") {
				city = document.getElementById('AIR_CC_ADDRESS_CITY').value + ", ";
			}
			if (document.getElementById('AIR_CC_ADDRESS_STATE') != null && document.getElementById('AIR_CC_ADDRESS_STATE').value != "") {
				state = document.getElementById('AIR_CC_ADDRESS_STATE').value + ", ";
			}
			if (document.getElementById('AIR_CC_ADDRESS_ZIPCODE') != null && document.getElementById('AIR_CC_ADDRESS_ZIPCODE').value != "") {
				zip = document.getElementById('AIR_CC_ADDRESS_ZIPCODE').value + " ";
			}
			if (document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT') != null) {
				country = document.getElementById('AIR_CC_ADDRESS_COUNTRY_TXT').value;
			}
			document.getElementById('cardType').innerHTML = ccType.options[ccType.selectedIndex].text;
			document.getElementById('visa').innerHTML = str.replace(/.(?=.{4})/g, '*');
			var expMonth = document.getElementById('CCexpiryDateMonth').value;
			if (expMonth.length == 1) {
				expMonth = "0" + expMonth;
			}
			document.getElementById('expDate').innerHTML = expMonth + "/" + document.getElementById('CCexpiryDateYear').value;
			document.getElementById('CC_DIGIT_CODE_AIR_2').value = document.getElementById('CC_DIGIT_CODE_AIR_1').value;
			document.getElementById('billingAdd').innerHTML = firstLine + secLine + city + state + zip + country;
			document.getElementById("ccSection").className = document.getElementById("ccSection").className.replace(/(?:^|\s)inVisible(?!\S)/, '');
		},
		__getPayLaterEligibility: function(){
			var payLaterEligibility = {
										"ispayLaterEnbl" : "FALSE",
										"timeToThinkEnbl" : "FALSE"
									}
			if (this._getSiteBoolean('siteAllowPayLater') && this.data.rqstParams.payLaterBean.onHoldEligible){
				payLaterEligibility.ispayLaterEnbl = "TRUE";
			}
			if (payLaterEligibility.ispayLaterEnbl == 'FALSE' && this._getSiteBoolean('siteTimeToThinkEnbl') && this.data.rqstParams.param.IS_PAY_ON_HOLD == null && !this.utils.isEmptyObject(this.data.rqstParams.TIME_TO_THINK_PANEL_KEY)){
				payLaterEligibility.timeToThinkEnbl = "TRUE";
			}
			return payLaterEligibility;
		},

		storeBillingDetails: function(){

			var billingDetJson = "";
			var firstLineList = [],
				i, key;
			var firstLine = document.getElementById("AIR_CC_ADDRESS_FIRSTLINE");
			if (this.supports_local_storage() && firstLine!= null && firstLine.value !="") {
				if (!(window.localStorage.getItem("Address:index"))) {
					window.localStorage.setItem("Address:index", 1);
				}

				for (i = 0; i < window.localStorage.length; i++) {
					key = window.localStorage.key(i);
					if (/Address:\d+/.test(key)) {
						firstLineList.push(JSON.parse(window.localStorage.getItem(key)).add1);
					}
				}
			 var entry = {
					id: parseInt(window.localStorage.getItem("Address:index")),
					add1: firstLine.value,
					add2: (document.getElementById("AIR_CC_ADDRESS_SECONDLINE") != null ? document.getElementById("AIR_CC_ADDRESS_SECONDLINE").value : ""),
					city: (document.getElementById("AIR_CC_ADDRESS_CITY") != null ? document.getElementById("AIR_CC_ADDRESS_CITY").value : ""),
					state: (document.getElementById("AIR_CC_ADDRESS_STATE") != null ? document.getElementById("AIR_CC_ADDRESS_STATE").value : ""),
					pincode: (document.getElementById("AIR_CC_ADDRESS_ZIPCODE") != null ? document.getElementById("AIR_CC_ADDRESS_ZIPCODE").value : ""),
					billCountry: (document.getElementById("AIR_CC_ADDRESS_COUNTRY_TXT") != null ? document.getElementById("AIR_CC_ADDRESS_COUNTRY_TXT").value : "")
				} ;

				if ($.inArray(firstLine.value, firstLineList) != -1) {
					entry.id = $.inArray(firstLine.value, firstLineList) + 1;
					 window.localStorage.setItem("Address:" + entry.id, JSON.stringify(entry));
        		}else{
					 window.localStorage.setItem("Address:" + entry.id, JSON.stringify(entry));
					 window.localStorage.setItem("Address:index", ++entry.id);
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



	}
});