Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.search.MAddPaxScript',
	$dependencies: [
		'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		var moduleData;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {
			moduleData = this.moduleCtrl.getModuleData().booking;
			if(moduleData.list != undefined){
				this.list = moduleData.list;
			}else
				this.list = moduleData.MSRCH_A.globalList.paxType;
		},

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAddPax",
						data:{}
					});
			}
		},
		
		$displayReady: function() {

			if (moduleData.selected != null) {

				// prefill
				this.fillSearchData();

				if (moduleData.selected == true) {
					this.afterSelection();
				} else {
					this.restoreSelection();
				}

				// reset
				moduleData.selected = null;
			}
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


		loadPanel: function(aria) {
			var allPax = document.getElementsByClassName("listpax");
			var existentPaxArray = new Array();

			for (var e = 0; e < allPax.length; e++) {
				if (allPax[e].className.indexOf("hidden") == -1) {
					existentPaxArray.push(allPax[e]);
				}
			}

			moduleData.existentPaxArray = existentPaxArray;

			this.storeSearchData();
			this.moduleCtrl.navigate(null, "merci-book-addPaxPanel");
		},

		getTravellerLiBlock: function(travellerId) {
			if (travellerId == 'FIELD_ADT_NUMBER') {
				return 'paxTypeAdult';
			} else if (travellerId == 'FIELD_CHD_NUMBER') {
				return 'paxTypeChild';
			} else if (travellerId == 'FIELD_INFANTS_NUMBER') {
				return 'paxTypeInfant';
			} else if (travellerId == 'FIELD_YCD_NUMBER') {
				return 'paxTypeSenior';
			} else if (travellerId == 'FIELD_STU_NUMBER') {
				return 'paxTypeStudent';
			} else if (travellerId == 'FIELD_YTH_NUMBER') {
				return 'paxTypeYouth';
			} else if (travellerId == 'FIELD_MIL_NUMBER') {
				return 'paxTypeMilitary';
			}

			return '';
		},

		afterSelection: function() {

			// get all the selected traveller types
			var selectedNamesArray = moduleData.addPaxPanel;

			// start iternation over json
			for (var key in selectedNamesArray) {
				if (selectedNamesArray.hasOwnProperty(key) && selectedNamesArray[key] != null) {

					var el = document.getElementById(selectedNamesArray[key]);
					if (el != null) {
						el.name = el.id;
						//el.selectedIndex = 0;- Commented for PTR 07212828. Pax count not getting updated.
					}

					// show pax type
					var secEl = document.getElementById(this.getTravellerLiBlock(selectedNamesArray[key]));
					if (secEl != null) {
						secEl.className = secEl.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
					}
				}
			}

			var enabAdt = selectedNamesArray['FIELD_ADT_NUMBER'] != null;
			var enabInf = selectedNamesArray['FIELD_INFANTS_NUMBER'] != null;
			var enabChd = selectedNamesArray['FIELD_CHD_NUMBER'] != null;
			var enabYth = selectedNamesArray['FIELD_YTH_NUMBER'] != null;
			var enabMil = selectedNamesArray['FIELD_MIL_NUMBER'] != null;
			var enabStu = selectedNamesArray['FIELD_STU_NUMBER'] != null;
			var enabSnr = selectedNamesArray['FIELD_YCD_NUMBER'] != null;

			if (enabAdt && enabInf && enabChd && enabYth && enabMil && enabStu && enabSnr) {
				document.getElementById("newPaxType").disabled = true;
			} else {
				document.getElementById("newPaxType").disabled = false;
				if ((enabYth || enabMil || enabStu || enabSnr) && (!enabAdt)) {
					this.__merciFunc.addClass(document.getElementById("paxTypeAdult"), 'hidden');
					var delId = document.getElementById('FIELD_ADT_NUMBER');
					delId.removeAttribute("name");

				} else {
					this.__merciFunc.removeClass(document.getElementById("paxTypeAdult"), 'hidden');
				}
			}

			this.checkFirstPax();

		},

		checkFirstPax: function() {
			var allPax = $('.paxtypes > li');
			$(allPax.get(t)).find('button.delete-button').removeClass('hidden');

			for (var t = 0; t < allPax.length; t++) {
				if (!$(allPax.get(t)).hasClass('hidden') && ($(allPax.get(t)).hasClass('type-adult') || $(allPax.get(t)).hasClass('type-student') || $(allPax.get(t)).hasClass('type-senior') || $(allPax.get(t)).hasClass('type-youth') || $(allPax.get(t)).hasClass('type-military'))) {
					$(allPax.get(t)).find('button.delete-button').addClass('hidden');

					break;
				}
			}

		},

		restoreSelection: function() {
			var selectedNamesArray = moduleData.existentPaxArray;
			for (var key in selectedNamesArray) {
				var eleId = selectedNamesArray[key];
				var ele = document.getElementById(eleId.id);
				if (ele != null) {
					ele.className = ele.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
				}
			}
		},

		onDeleteButtonClick: function(aria, args) {
			document.getElementById(args.id1).className += ' hidden';
			document.getElementById(args.id2).removeAttribute("name");

			var json = this.moduleCtrl.getModuleData().booking;
			json.addPaxPanel = {};
			json.addPaxPanel[args.id2] = null;

			paxselect = "";
			this.updateGlobalList(json.addPaxPanel);
		},

		storeSearchData: function() {
			var cityPair = parseInt(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.multicityMaxCityPair);

			if (document.getElementById("myonoffswitch") != null) {
				moduleData.myonoffswitch = document.getElementById("myonoffswitch").checked;
			}

			if (document.getElementById("B_LOCATION_1_SRCH") != null) {
				moduleData.B_LOCATION_1_SRCH = document.getElementById("B_LOCATION_1_SRCH").value;
			}

			if (document.getElementById("E_LOCATION_1_SRCH") != null) {
				moduleData.E_LOCATION_1_SRCH = document.getElementById("E_LOCATION_1_SRCH").value;
			}

			// if awards flow enabled
			if (moduleData.myonoffswitch == true) {

				// when UI is rendered for logged in user below steps are followed
				// 1. B_LOCATION_1_SRCH is prefilled with earlier search data
				// 2. E_LOCATION_1_SRCH is prefilled with earlier search data
				// 3. B_LOCATION_1_SRCH and E_LOCATION_1_SRCH is hidden and A_LOCATION_1 and C_LOCATION_1 is shown
				//    in UI with data of B_LOCATION_1_SRCH and E_LOCATION_1_SRCH respectively

				// store A_LOCATION_1 as B_LOCATION_1_SRCH
				if (document.getElementById("A_LOCATION_1") != null) {
					moduleData.A_LOCATION_1 = document.getElementById("A_LOCATION_1").value;
				}

				// store C_LOCATION_1 as E_LOCATION_1_SRCH
				if (document.getElementById("C_LOCATION_1") != null) {
					moduleData.C_LOCATION_1 = document.getElementById("C_LOCATION_1").value;
				}
			}

			// for flexible dates check box
			if (document.getElementById("DATE_RANGE_VALUE_1") != null) {
				moduleData.DATE_RANGE_VALUE_1 = document.getElementById("DATE_RANGE_VALUE_1").checked;
			}

			if (document.getElementById("day1") != null) {
				moduleData.Day1 = document.getElementById("day1").value;
			}

			if (document.getElementById("month1") != null) {
				moduleData.Month1 = document.getElementById("month1").value;
			}

			if (document.getElementById("day2") != null) {
				moduleData.Day2 = document.getElementById("day2").value;
			}

			if (document.getElementById("month2") != null) {
				moduleData.Month2 = document.getElementById("month2").value;
			}

			if (document.getElementById("FIELD_ADT_NUMBER") != null) {
				moduleData.FIELD_ADT_NUMBER = document.getElementById("FIELD_ADT_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_CHD_NUMBER") != null) {
				moduleData.FIELD_CHD_NUMBER = document.getElementById("FIELD_CHD_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_INFANTS_NUMBER") != null) {
				moduleData.FIELD_INFANTS_NUMBER = document.getElementById("FIELD_INFANTS_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_YCD_NUMBER") != null) {
				moduleData.FIELD_YCD_NUMBER = document.getElementById("FIELD_YCD_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_STU_NUMBER") != null) {
				moduleData.FIELD_STU_NUMBER = document.getElementById("FIELD_STU_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_YTH_NUMBER") != null) {
				moduleData.FIELD_YTH_NUMBER = document.getElementById("FIELD_YTH_NUMBER").selectedIndex;
			}

			if (document.getElementById("FIELD_MIL_NUMBER") != null) {
				moduleData.FIELD_MIL_NUMBER = document.getElementById("FIELD_MIL_NUMBER").selectedIndex;
			}

			if (document.getElementById("tripType") != null) {
				moduleData.tripTypeValue = document.getElementById("tripType").value;

				if(moduleData.tripTypeValue == 'M'){
					flights = $('section.mlcitySection').filter(function() {
			    		return $(this).css('display') == 'block';
					});
					moduleData["NO_MULTI_SEGMENTS"] = flights.length;

					for(var i=1;i<=cityPair;i++){
						if (document.getElementById("B_LOCATION_MULTI_"+i+"_SRCH") != null) {
							moduleData["B_LOCATION_MULTI_"+i+"_SRCH"] = document.getElementById("B_LOCATION_MULTI_"+i+"_SRCH").value;
						}

						if (document.getElementById("E_LOCATION_MULTI_"+i+"_SRCH") != null) {
							moduleData["E_LOCATION_MULTI_"+i+"_SRCH"] = document.getElementById("E_LOCATION_MULTI_"+i+"_SRCH").value;
						}

						// if awards flow enabled
						if (moduleData.myonoffswitch == true) {

							// when UI is rendered for logged in user below steps are followed
							// 1. B_LOCATION_1_SRCH is prefilled with earlier search data
							// 2. E_LOCATION_1_SRCH is prefilled with earlier search data
							// 3. B_LOCATION_1_SRCH and E_LOCATION_1_SRCH is hidden and A_LOCATION_1 and C_LOCATION_1 is shown
							//    in UI with data of B_LOCATION_1_SRCH and E_LOCATION_1_SRCH respectively

							// store A_LOCATION_1 as B_LOCATION_1_SRCH
							if (document.getElementById("A_LOCATION_MULTI_"+i+"_SRCH") != null) {
								moduleData["A_LOCATION_MULTI_"+i+"_SRCH"] = document.getElementById("A_LOCATION_MULTI_"+i+"_SRCH").value;
							}

							// store C_LOCATION_1 as E_LOCATION_1_SRCH
							if (document.getElementById("C_LOCATION_MULTI_"+i+"_SRCH") != null) {
								moduleData["C_LOCATION_MULTI_"+i+"_SRCH"] = document.getElementById("C_LOCATION_MULTI_"+i+"_SRCH").value;
							}
						}







						if (document.getElementById("day_mlcity"+i) != null) {
							moduleData["Day_mlcity"+i] = document.getElementById("day_mlcity"+i).value;
						}

						if (document.getElementById("month_mlcity"+i) != null) {
							moduleData["Month_mlcity"+i] = document.getElementById("month_mlcity"+i).value;
						}

						if($("#datePickSearch"+i).length > 0){
							moduleData["#datePickSearch"+i] = $("#datePickSearch"+i).datepicker('getDate');
						}
					}

				}
			}			

			if (document.getElementById("CABIN_CLASS") != null) {
				moduleData.CABIN_CLASS = document.getElementById("CABIN_CLASS").selectedIndex;
			}
		},

		fillSearchData: function() {
			var cityPair = parseInt(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.multicityMaxCityPair);
			


			// indicator to avoid B_LOCATION pre-population
			this.moduleCtrl.bookingTemplate.data.isAddPaxNav = true;

			var onOffSwitch = document.getElementById("myonoffswitch");
			if (onOffSwitch != null) {
				if (moduleData.myonoffswitch == true) {
					onOffSwitch.checked = true;
					this.moduleCtrl.bookingTemplate._enableAwards();
				} else {
					// not enabled
					onOffSwitch.checked = false;
					this.moduleCtrl.bookingTemplate._disableAwards();
				}
			}

			if (moduleData.myonoffswitch == true) {
				if (moduleData.A_LOCATION_1 != null) {
					document.getElementById("A_LOCATION_1").value = moduleData.A_LOCATION_1;
				}

				if (moduleData.C_LOCATION_1 != null) {
					document.getElementById("C_LOCATION_1").value = moduleData.C_LOCATION_1;
				}
			}

			if (moduleData.B_LOCATION_1_SRCH != null) {
				document.getElementById("B_LOCATION_1_SRCH").value = moduleData.B_LOCATION_1_SRCH;
			}

			if (moduleData.E_LOCATION_1_SRCH != null) {
				document.getElementById("E_LOCATION_1_SRCH").value = moduleData.E_LOCATION_1_SRCH;
			}

			if (moduleData.Day1 != null && document.getElementById("day1") != null) {
				this.moduleCtrl.bookingTemplate.data.Day1 = moduleData.Day1;
				document.getElementById("day1").value = moduleData.Day1;
			}

			if (moduleData.Month1 != null && document.getElementById("month1") != null) {
				this.moduleCtrl.bookingTemplate.data.Month1 = moduleData.Month1;
				document.getElementById("month1").value = moduleData.Month1;
			}

			if (moduleData.Day2 != null && document.getElementById("day2") != null) {
				this.moduleCtrl.bookingTemplate.data.Day2 = moduleData.Day2;
				document.getElementById("day2").value = moduleData.Day2;
			}

			if (moduleData.Month2 != null && document.getElementById("month2") != null) {
				this.moduleCtrl.bookingTemplate.data.Month2 = moduleData.Month2;
				document.getElementById("month2").value = moduleData.Month2;
			}

			if (moduleData.tripTypeValue != null) {

				// show one way
				document.getElementById("tripType").value = moduleData.tripTypeValue;
				var retJourney = document.getElementById('retJourney');

				// remove return journey drop down only if one way
				if (retJourney != null && moduleData.tripTypeValue == 'O') {
					retJourney.style.display = 'none';
				}

				if(moduleData.tripTypeValue == 'M'){
					if(moduleData["NO_MULTI_SEGMENTS"] !=null){
						var se = parseInt(moduleData["NO_MULTI_SEGMENTS"])
						$("section.mlcitySection:nth-of-type(-n+"+se+")").show();
					}
					

					for(var i= 1;i<=cityPair;i++){
						if (moduleData["B_LOCATION_MULTI_"+i+"_SRCH"] != null) {
							document.getElementById("B_LOCATION_MULTI_"+i+"_SRCH").value = moduleData["B_LOCATION_MULTI_"+i+"_SRCH"];
						}

						if (moduleData["E_LOCATION_MULTI_"+i+"_SRCH"] != null) {
							document.getElementById("E_LOCATION_MULTI_"+i+"_SRCH").value = moduleData["E_LOCATION_MULTI_"+i+"_SRCH"];
						}

						if (moduleData.myonoffswitch == true) {
							if (moduleData["A_LOCATION_MULTI_"+i+"_SRCH"] != null) {
								document.getElementById("A_LOCATION_MULTI_"+i+"_SRCH").value = moduleData["A_LOCATION_MULTI_"+i+"_SRCH"];
							}

							if (moduleData["C_LOCATION_MULTI_"+i+"_SRCH"] != null) {
								document.getElementById("C_LOCATION_MULTI_"+i+"_SRCH").value = moduleData["C_LOCATION_MULTI_"+i+"_SRCH"];
							}
						}


						if (moduleData["Day_mlcity"+i] != null && document.getElementById("day_mlcity"+i) != null) {
							this.moduleCtrl.bookingTemplate.data["Day_mlcity"+i] = moduleData["Day_mlcity"+i];
							document.getElementById("day_mlcity"+i).value = moduleData["Day_mlcity"+i];
						}

						if (moduleData["Month_mlcity"+i] != null && document.getElementById("month_mlcity"+i) != null) {
							this.moduleCtrl.bookingTemplate.data["Month_mlcity"+i] = moduleData["Month_mlcity"+i];
							document.getElementById("month_mlcity"+i).value = moduleData["Month_mlcity"+i];
						}
						if(moduleData["#datePickSearch"+i] != null ){
							$("#datePickSearch"+i).datepicker("setDate",moduleData["#datePickSearch"+i]);
						}

					}
				}
			}

			if (moduleData.DATE_RANGE_VALUE_1 != null) {
				document.getElementById("DATE_RANGE_VALUE_1").checked = moduleData.DATE_RANGE_VALUE_1;
			}

			if (document.getElementById("CABIN_CLASS") != null && moduleData.CABIN_CLASS != null) {
				document.getElementById("CABIN_CLASS").selectedIndex = moduleData.CABIN_CLASS;
			}

			var arr = ['FIELD_ADT_NUMBER', 'FIELD_CHD_NUMBER', 'FIELD_INFANTS_NUMBER', 'FIELD_YCD_NUMBER', 'FIELD_STU_NUMBER', 'FIELD_YTH_NUMBER', 'FIELD_MIL_NUMBER'];
			for (i = 0; i < arr.length; i++) {
				if (document.getElementById(arr[i]) != null) {
					document.getElementById(arr[i]).selectedIndex = moduleData[arr[i]];
				}
			}

			this.checkTravellers();
			this.checkFirstPax();
		},

		checkTravellers: function() {

			var getAdtVal = this.__merciFunc.getStoredItem('chkAdult');
			var getChdVal = this.__merciFunc.getStoredItem('chkChild');
			var getInfVal = this.__merciFunc.getStoredItem('chkInfant');
			var getYcdVal = this.__merciFunc.getStoredItem('chkSenior');
			var getStuVal = this.__merciFunc.getStoredItem('chkStudent');
			var getYthVal = this.__merciFunc.getStoredItem('chkYouth');
			var getMilVal = this.__merciFunc.getStoredItem('chkMilitary');

			if (getAdtVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeAdult"), 'hidden');
			} else {
				if (getYcdVal || getStuVal || getYthVal || getMilVal) {
					this.__merciFunc.addClass(document.getElementById("paxTypeAdult"), 'hidden');
				}
			}
			if (getChdVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeChild"), 'hidden');
				document.getElementById("FIELD_CHD_NUMBER").name = "FIELD_CHD_NUMBER";
			}
			if (getInfVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeInfant"), 'hidden');
				document.getElementById("FIELD_INFANTS_NUMBER").name = "FIELD_INFANTS_NUMBER";
			}
			if (getYcdVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeSenior"), 'hidden');
				document.getElementById("FIELD_YCD_NUMBER").name = "FIELD_YCD_NUMBER";
			}
			if (getStuVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeStudent"), 'hidden');
				document.getElementById("FIELD_STU_NUMBER").name = "FIELD_STU_NUMBER";
			}
			if (getYthVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeYouth"), 'hidden');
				document.getElementById("FIELD_YTH_NUMBER").name = "FIELD_YTH_NUMBER";
			}
			if (getMilVal == 'true') {
				this.__merciFunc.removeClass(document.getElementById("paxTypeMilitary"), 'hidden');
				document.getElementById("FIELD_MIL_NUMBER").name = "FIELD_MIL_NUMBER";
			}

		},

		_getTravellerSelected: function(trvlLabel) {
			var trvlStored = this.__merciFunc.getStoredItem(trvlLabel);
			if (trvlStored != null) {
				trvlStored = parseInt(trvlStored);
				if (trvlLabel == 'FIELD_ADT_NUMBER') {
					trvlStored += 1;
				}

				return trvlStored;
			} else {
				return 0;
			}
		},

		/* PTR - 07577835  start*/

		custompaxselect: function(evt, typeofPax) {
			var siteParams = this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam;
			if (this.__merciFunc.booleanValue(siteParams.siteCustomJS)) {
				addPax = siteParams.allowAddPax;
				paxselect({
					"type": typeofPax,
					"allowAddPax": addPax
				});
			}
		}

		/* PTR - 07577835  end*/
	}
});