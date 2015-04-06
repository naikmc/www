Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MODETicketScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		getFFSourceList: function() {
			var sourceList = [];
			for (var i = 0; i < this.data.gblLst.slAirlineListPopup.length; i++) {
				sourceList.push({
					value: this.data.gblLst.slAirlineListPopup[0],
					label: this.data.gblLst.slAirlineListPopup[1]
				});
			}

			return sourceList;
		},

		_getSiteBoolean: function(key) {
			return this.data.siteParams[key] != null && (this.data.siteParams[key].toLowerCase() == 'true' || this.data.siteParams[key].toLowerCase() == 'y' || this.data.siteParams[key].toLowerCase() == 'yes');
		},

		_splitSiteParamList: function(key) {
			return this.data.siteParams[key].split(',');
		},

		$displayReady: function() {

			if (!this.__merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.travellersAsMap)) {

				// iterate over list of travellers
				for (var key in this.data.rqstParams.listTravellerBean.travellersAsMap) {

					// call updateCCDisplay method
					var traveller = this.data.rqstParams.listTravellerBean.travellersAsMap[key];
					this.updateCCDisplay(null, {
						id: null,
						paxNumber: traveller.paxNumber
					});
				}
			} else if (!this.__merciFunc.isEmptyObject(this.data.rqstParams.listTravellerBean.travellers)) {

				// iterate over list of travellers
				for (var i = 0; i < this.data.rqstParams.listTravellerBean.travellers.length; i++) {

					// call updateCCDisplay method
					var traveller = this.data.rqstParams.listTravellerBean.travellers[i];
					this.updateCCDisplay(null, {
						id: null,
						paxNumber: traveller.paxNumber
					});
				}
			}
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MODETicket",
						data:this.data
					});
			}
		},

		updateCCDisplay: function(event, args) {

			var obj = null;
			var type = null;

			// if valid id
			if (args.id != null) {
				document.getElementById(args.id);
			}

			if (obj == null) {
				var docType = document.getElementById("DOCUMENT_TYPE_" + args.paxNumber);
				if (docType != null) {
					type = docType.value;
				}
			} else if (obj.id == null) {
				type = obj;
			} else {
				type = obj.options[obj.options.selectedIndex].value;
				args.paxNumber = obj.id.substring(obj.id.length - 1, obj.id.length);
			}

			switch (type) {
				case 'CC':
					this.sec_hideLevel('GEN_EtcktDetails' + args.paxNumber);
					this.sec_showLevel('CC_EtcktDetails' + args.paxNumber);
					break;
				case 'FF':
					this.sec_showLevel('GEN_EtcktDetails' + args.paxNumber);
					this.sec_hideLevel('CC_EtcktDetails' + args.paxNumber);
					this.sec_showLevel('FFairlineField' + args.paxNumber);
					break;
				default:
					this.sec_showLevel('GEN_EtcktDetails' + args.paxNumber);
					this.sec_hideLevel('CC_EtcktDetails' + args.paxNumber);
					this.sec_hideLevel('FFairlineField' + args.paxNumber);
					break;
			}

			// change label
			this.sec_changeLabel(event, {
				id: null,
				paxNumber: args.paxNumber
			});
		},

		sec_changeLabel: function(event, args) {

			var obj = null;
			var type = null;

			// if valid id
			if (args.id != null) {
				document.getElementById(args.id);
			}

			if (obj == null) {
				if (document.getElementById("DOCUMENT_TYPE_" + args.paxNumber) != null) {
					type = document.getElementById("DOCUMENT_TYPE_" + args.paxNumber).value;
				}
			} else if (obj.id == null) {
				type = obj;
			} else {
				args.paxNumber = obj.id.substring(obj.id.length - 1, obj.id.length);
				type = obj.options[obj.options.selectedIndex].value;
			}

			switch (type) {
				case 'FF':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_frequentflyerairlinenumber, 'FF');
					break;
				case 'AB':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_membershipnumber, 'AB');
					break;
				case 'TP':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_travelpasscardnumber, 'TP');
					break;
				case 'CC':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_eticketcreditcardnumber, 'CC');
					break;
				case 'PP':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_passportnumber, 'PP');
					break;
				case 'DL':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_drivinglicensenumber, 'DL');
					break;
				case 'NI':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_nationalidentitycardnumber, 'NI');
					break;
				case 'OT':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_supportingreferences, 'OT');
					break;
				case 'DD':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_directdebitnumber, 'DD');
					break;
				case 'ID':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_idnumber, 'ID');
					break;
				case 'TN':
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_ticketnumber, 'TN');
					break;
				case 'CN':
					this.changeLabel(args.paxNumber, this.data.labels.tx_pltg_text_calendar_confirmation_num, 'CN');
					break;
				default:
					this.changeLabel(args.paxNumber, this.data.labels.tx_merci_text_frequentflyerairlinenumber, 'FF');
					break;
			}
		},

		changeLabel: function(index, label, docType) {

			label += ' <span class="mandatory">*</span>';
			var ccLevel = document.getElementById("CC_DOCUMENT_NUMBER" + index);
			var thisLevel = document.getElementById("GEN_DOCUMENT_NUMBER" + index);

			if (docType != 'CC' && thisLevel != null) {
				thisLevel.innerHTML = label;
			}

			if (docType == 'CC' && ccLevel != null) {
				ccLevel.innerHTML = label;
			}
		},

		sec_hideLevel: function(_levelId) {
			/** Valid level Id */
			if (!_levelId || _levelId == null)
				return;

			/** Get element by Id */
			var thisLevel = document.getElementById(_levelId);
			if (thisLevel != null) {
				/** Hide element */
				thisLevel.className += ' hidden';
			}
		},

		sec_showLevel: function(_levelId) {
			/** Valid level Id */
			if (!_levelId || _levelId == null)
				return;

			/** Get element by Id */
			var thisLevel = document.getElementById(_levelId);
			if (thisLevel != null) {
				/** Is element hidden? */
				if (thisLevel.className.indexOf('hidden') != -1) {
					/** Yes, show it then */
					thisLevel.className = thisLevel.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}
		}
	}
});