Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MPurcInsScript',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$constructor: function() {

	},
	$prototype: {

		$dataReady: function() {
			this.utils = modules.view.merci.common.utils.MCommonScript;
			this._bookUtil = modules.view.merci.segments.booking.scripts.MBookingMethods;
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MPurcIns",
						data:this.data
					});
			}
		},

		$displayReady: function() {

			if(!this.utils.isEmptyObject(this.data.rqstParams.insurancePanelKey)){
				if(!this.utils.isEmptyObject(this.data.rqstParams.insurancePanelKey.insProductList)){

					var fractionDigits = 0;
					if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1){
						fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length ;
					}
					for(var j=0; j < this.data.rqstParams.insurancePanelKey.insProductList.length;j++){
						var insProduct = this.data.rqstParams.insurancePanelKey.insProductList[j] ;
						var radio = document.getElementsByName("insuranceProductdetails") ;
						var formatIns = this.utils.printCurrency(insProduct.totalAmount, fractionDigits);

						if(jsonResponse.popup && jsonResponse.popup.fromPopupData){
							if(!this.utils.isEmptyObject(jsonResponse.popup.fromPopupData.insuranceProductdetails)){
								if( jsonResponse.popup.fromPopupData.insuranceProductdetails==(insProduct.providerCode+','+insProduct.productCode+','+insProduct.formatedTotalAmount)){
									this.insuranceSelected(null,{insAmt: formatIns});
								}
							}else{
								for(i=0;i<radio.length;i++){
									if(radio[i].checked==true && radio[i].value==(insProduct.providerCode+','+insProduct.productCode+','+insProduct.formatedTotalAmount)){
										this.insuranceSelected(null,{insAmt: formatIns});
									}
								}
							}
						}						
					}						
				}					
			}			
		},

		_isServicingFlow: function() {
			return !this.utils.isEmptyObject(this.data.isFromServicingFlow) && this.data.isFromServicingFlow;
		},

		__showInsDoc: function() {
			var hdIns = document.getElementById(this.$getId('insHeader'));
			var dlIns = document.getElementById(this.$getId('dlIns'));
			var dvInsDoc = document.getElementById(this.$getId('insuranceDoc'));

			if (dvInsDoc != null) {
				dvInsDoc.className = dvInsDoc.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			if (hdIns != null) {
				hdIns.className = hdIns.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}

			if (dlIns != null) {
				dlIns.className = dlIns.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			}
		},

		toggle: function(event, args) {
			this._bookUtil.toggle(event, args);
		},


		getCheapestInsurance: function(data) {

			var cheapestInsurance = 0;

			if (data.length > 0) {
				cheapestInsurance = data[0];
				var LeastPrice = data[0].totalAmount;;

				for (var i = 1; i < data.length; i++) {
					if (LeastPrice > data[i].totalAmount) {
						LeastPrice = data[i].totalAmount;
						cheapestInsurance = data[i];
					}
				}
			}

			return cheapestInsurance;

		},
		__hideInsDoc: function() {
			var hdIns = document.getElementById(this.$getId('insHeader'));
			var dlIns = document.getElementById(this.$getId('dlIns'));
			var dvInsDoc = document.getElementById(this.$getId('insuranceDoc'));

			if (dvInsDoc != null) {
				dvInsDoc.className += ' hidden';
			}

			if (hdIns != null) {
				hdIns.className += ' hidden';
			}

			if (dlIns != null) {
				dlIns.className += ' hidden';
			}
		},

		noInsurance: function(event, data) {
			if (this.utils.booleanValue(this.data.siteParams.siteMultipleMopAllowed)) {
				var fopList = this.data.siteParams.siteListMiscFOP;
				if (fopList != undefined && fopList.indexOf('PPAL') != -1) {
					this.__enablePayPal();
				}
			}
			if (this.data.siteParams.siteAllowPayLater == 'TRUE' && !this._isServicingFlow()) {
				aria.utils.Json.setValue(this.moduleCtrl, 'payLater', true);
			}
			this.__hideInsDoc();
			this.addInsurance(0);
			//Inform price breakdown on Purc
			this.$json.setValue(this.data.insData, 'amount', null);
		},

		insuranceSelected: function(event, data) {
			if (this.utils.booleanValue(this.data.siteParams.siteMultipleMopAllowed)) {
				var fopList = this.data.siteParams.siteListMiscFOP;
				if (fopList != null) {
					if (fopList.indexOf('PPAL') != -1) {
						this.__disablePayPal();
					}
				}
			}
			if (this.data.siteParams.siteAllowPayLater == 'TRUE' && !this._isServicingFlow()) {
				aria.utils.Json.setValue(this.moduleCtrl, 'payLater', false);
			}
			this.__showInsDoc();
			this.addInsurance(data.insAmt);
			//Inform price breakdown on Purc
			this.$json.setValue(this.data.insData, 'amount', data.insAmt);
		},

		__disablePayPal: function() {
			var selectobject = document.getElementById("paymethod")
			for (var i = 0; i < selectobject.length; i++) {
				if (selectobject.options[i].value == 'PPAL')
					selectobject.remove(i);
			}
		},
		__enablePayPal: function() {
			var selectobject = document.getElementById("paymethod")
			var opt = document.createElement('option');
			opt.value = "PPAL";
			opt.innerHTML = this.data.labels['PPAL'];
			selectobject.appendChild(opt);
		},
		addInsurance: function(insAmt) {

			this.insDataNew = {amount: insAmt} ;

			var fractionDigits = 0;
			if (this.data.siteParams.siteCurrencyFormat != null && this.data.siteParams.siteCurrencyFormat.indexOf('.') != -1) {
				fractionDigits = this.data.siteParams.siteCurrencyFormat.substring(this.data.siteParams.siteCurrencyFormat.indexOf('.') + 1).length;
			}

			if (this._isServicingFlow()) {

				var elInsAmount = document.getElementById(this.$getId('INS_AMT'));
				if (insAmt == null || insAmt == '') {
					insAmt = 0;
				}
				// calculate total amount
				var totalAmount = parseFloat(insAmt);
				// update in hidden elem.
				if (elInsAmount != null) {
					elInsAmount.value = insAmt;
				}
			} 
			else {
				var elFareAmt = document.getElementById('calcFinalAmnt');
				var elFareCode = document.getElementById('FARE_CODE');
				var elInsAmount = document.getElementById(this.$getId('INS_AMT'));
				var elInsuranceAmount = document.getElementById("INSURANCE_AMOUNT");
				var elPriceTotal = document.getElementById('dtPriceTotal');
				var elClientExist = document.getElementById('CLIENT_EXIST');
				var elInsuranceSel = document.getElementById('INSURANCE_SELECTED');
				var elFareBrkdwnTotal = document.getElementById('fareBrkTotalPrice');

				if (insAmt == null || insAmt == '') {
					insAmt = 0;
				}

				// calculate total amount
				var totalAmount = parseFloat(insAmt);
				if (elFareAmt != null) {
					totalAmount += parseFloat(elFareAmt.value);
				}

				// update in hidden elem.
				if (elInsAmount != null) {
					elInsAmount.value = insAmt;
				}

				// update in hidden elem.
				if (elInsuranceAmount != null) {
					elInsuranceAmount.value = insAmt;
				}

				// get client
				var client = '';
				if (elClientExist != null) {
					client = elClientExist.value;
				}

				// update INSURANCE_SELECTED hidden element
				if (elInsuranceSel != null) {
					elInsuranceSel.value = (insAmt > 0);
				}

				var fareCode = '';
				if (elFareCode != null) {
					fareCode = elFareCode.value;
				}

				// update total price on UI [START] */
				if (elPriceTotal != null) {
					elPriceTotal.innerHTML = fareCode + ' ' + this.utils.printCurrency(totalAmount, fractionDigits);
				}
			}
			// update total price on UI [ END ] */

		}
	}
});