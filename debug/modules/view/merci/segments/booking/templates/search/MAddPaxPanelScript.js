Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.search.MAddPaxPanelScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {

	},

	$prototype: {

		$dataReady: function() {
			this._merciFunc = modules.view.merci.common.utils.MCommonScript;
		},

		$viewReady: function() {
			var labels = this.moduleCtrl.getModuleData().booking.MSRCH_A.labels;
			var siteParameters = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			var rqstParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.requestParam;

			this.moduleCtrl.setHeaderInfo({
				title: labels.tx_merci_text_booking_advs_bookflight,
				bannerHtmlL: rqstParams.bannerHtml,
				homePageURL: siteParameters.homeURL,
				showButton: false,
				companyName: siteParameters.sitePLCompanyName,
				headerButton: ""
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAddPaxPanel",
						data:{}
					});
			}
		},
		$displayReady: function() {
			
					
			var existentPaxArray = this.moduleCtrl.getModuleData().booking.existentPaxArray;

			var selPax = document.getElementsByClassName("type-selected");
			for (var x = 0; x < selPax.length; x++) {
				selPax[x].className = '';
			}

			for (var f = 0; f < existentPaxArray.length; f++) {
				var paxHTML = existentPaxArray[f].innerHTML;

				if (paxHTML.indexOf("Adult") != -1) {
					document.getElementById("paxTypeAdt").className += ' type-selected';
				}


				if (paxHTML.indexOf("Child") != -1) {
					document.getElementById("paxTypeChd").className += ' type-selected';
				}

				if (paxHTML.indexOf("Infant") != -1) {
					document.getElementById("paxTypeInf").className += ' type-selected';
				}

				if (paxHTML.indexOf("Student") != -1) {
					document.getElementById("paxTypeStu").className += ' type-selected';
				}

				if (paxHTML.indexOf("Senior") != -1) {
					document.getElementById("paxTypeSnr").className += ' type-selected';
				}

				if (paxHTML.indexOf("Youth") != -1) {
					document.getElementById("paxTypeYth").className += ' type-selected';
				}

				if (paxHTML.indexOf("Military") != -1) {
					document.getElementById("paxTypeMil").className += ' type-selected';
				}

			}

			var body = document.getElementsByTagName("body");
			this._merciFunc.addClass(body[0], "with-spanel");
		},

		$afterRefresh: function() {
			$('.spanel').animate({
				left: '0%'
			}, 500);
		},

		selectPaxType: function(a, args) {

			var id = this.getID(args);
			var padre = document.getElementById(args).parentNode;
			var bookJson = this.moduleCtrl.getModuleData().booking;

			// for additional pax
			if (this._merciFunc.isEmptyObject(bookJson.addPaxPanel)) {
				bookJson.addPaxPanel = {};
				if (this.hasClass('paxTypeAdt', "type-selected") == true) {
					bookJson.addPaxPanel["FIELD_ADT_NUMBER"] = "FIELD_ADT_NUMBER";
					this.changeFormSubmitAttribute("FIELD_ADT_NUMBER", false);
				}
			}

			if (!this.hasClass(args, "type-selected")) {
				if (padre.className.indexOf('type-infant') != -1 && (this.hasClass('paxTypeAdt', "type-selected") == false && this.hasClass('paxTypeStu', "type-selected") == false && this.hasClass('paxTypeSnr', "type-selected") == false && this.hasClass('paxTypeYth', "type-selected") == false && this.hasClass('paxTypeMil', "type-selected") == false)) {
					document.getElementById(args).className += ' type-selected';
					document.getElementById('paxTypeAdt').className += ' type-selected';
				} else {
					document.getElementById(args).className = ' type-selected';
				}

				bookJson.addPaxPanel[id] = id;
				this.changeFormSubmitAttribute(id, false);

			} else if (this.hasClass(args, "type-selected")) {
				bookJson.addPaxPanel[id] = null;
				this.changeFormSubmitAttribute(id, true);

				var el = document.getElementById(args);
				if (el != null) {
					el.className = el.className.replace(/(?:^|\s)type-selected(?!\S)/g, '');
				}
			}

			var list = this.updateGlobalList(bookJson.addPaxPanel);
			bookJson.list = list ; 

		},

		updateGlobalList : function(addPaxPanel){
			if(addPaxPanel != undefined){
				var paxTypeList = aria.utils.Json.copy(this.moduleCtrl.getModuleData().booking.MSRCH_A.globalList.paxType);
				for (var paxType in addPaxPanel){
					if(addPaxPanel[paxType] == null && paxType != "FIELD_ADT_NUMBER"){
						for(var i= 0 ; i<paxTypeList.length ; i++){
							if(paxTypeList[i][0] == paxType.substring(6,9)){
								paxTypeList.splice(i , 1);
							}
						}
					}
				} 
				return paxTypeList;
			}
		},

		getID: function(travellerId) {
			var id = '';
			if (travellerId == 'paxTypeChd') {
				id = 'FIELD_CHD_NUMBER';
			} else if (travellerId == 'paxTypeInf') {
				id = 'FIELD_INFANTS_NUMBER';
			} else if (travellerId == 'paxTypeSnr') {
				id = 'FIELD_YCD_NUMBER';
			} else if (travellerId == 'paxTypeStu') {
				id = 'FIELD_STU_NUMBER';
			} else if (travellerId == 'paxTypeYth') {
				id = 'FIELD_YTH_NUMBER';
			} else if (travellerId == 'paxTypeMil') {
				id = 'FIELD_MIL_NUMBER';
			} else if (travellerId == 'paxTypeAdt') {
				id = 'FIELD_ADT_NUMBER';
			}

			return id;
		},

		changeFormSubmitAttribute: function(id, remove) {
			var el = document.getElementById(id);
			if (el != null) {
				if (remove) {
					el.name = id;
				} else {
					el.name = '';
				}
			}
		},

		onSelectButtonClick: function() {
			var onlySelected = document.getElementsByClassName("type-selected");
			var pageObj = this;
			$('body').removeClass('with-spanel');
			$(".spanel").animate({
				left: '-105%'
			}, 400);
			setTimeout(function() {
				pageObj.moduleCtrl.navigate(null, "merci-book-MSRCH_A");
			}, 300);
			this.moduleCtrl.getModuleData().booking.selected = true;
		},

		onCancelButtonClick: function() {
			var pageObj = this;
			$('body').removeClass('with-spanel');
			$(".spanel").animate({
				left: '-105%'
			}, 400);
			setTimeout(function() {
				pageObj.moduleCtrl.navigate(null, "merci-book-MSRCH_A");
			}, 300);
			this.moduleCtrl.getModuleData().booking.selected = false;
		},

		hasClass: function(id, className) {
			var element = document.getElementById(id);
			if (element != null && element.className.indexOf(className) != -1) {
				return true;
			}

			return false;
		}

	}
});