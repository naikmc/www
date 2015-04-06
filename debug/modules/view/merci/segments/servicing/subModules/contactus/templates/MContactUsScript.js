Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.contactus.templates.MContactUsScript',
	$dependencies: ['modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MerciGA',
		'modules.view.merci.common.utils.MCommonScript'
	],
	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;	
		contactUsObj = this;
	},

	$prototype: {
		__createAutocompleteSource: function(listCallCentres, listCountries) {

			var autoCompleteSource = [];

			/*To get the first country in the list */
			for (var j = 0; j < listCountries.length; j++) {
				if (listCallCentres.length > 0 && listCallCentres[0][0] == listCountries[j][0]) {
					autoCompleteSource.push(listCountries[j][1]);
				}
			}

			/*To get the remaining countries*/
			for (var i = 1; i < listCallCentres.length; i++) {
				for (var j = 0; j < listCountries.length; j++) {
					if ((listCallCentres[i][0] == listCountries[j][0]) && (listCallCentres[i][0] != listCallCentres[i - 1][0])) {
						autoCompleteSource.push(listCountries[j][1]);
					}
				}
			}
			return autoCompleteSource;
		},

		$dataReady: function() {
			$('body').attr('id', 'contactUs');
			// set JSON reference
			contactUsObj.initilizeVariable();

		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MContactUs",
						data:{}
					});
			}
		},

		initilizeVariable: function() {

			if (contactUsObj.moduleCtrl.getModuleData().servicing == undefined) {
				contactUsObj.getFromLocalStorage();
			} else {
				contactUsObj.list = contactUsObj.moduleCtrl.getModuleData().list;
				contactUsObj.labels = contactUsObj.moduleCtrl.getModuleData().servicing.MContact_A.labels;
				contactUsObj.gblLst = contactUsObj.moduleCtrl.getModuleData().servicing.MContact_A.globalList;
				contactUsObj.siteParams = contactUsObj.moduleCtrl.getModuleData().servicing.MContact_A.siteParam;
				contactUsObj.rqstParams = contactUsObj.moduleCtrl.getModuleData().servicing.MContact_A.requestParam;
				contactUsObj.storeLocalStorage();
			}
		},

		$displayReady: function() {
			/* setting autocomplete if UI is ready to be printed
			 * this will be set only after callback received with data */
			document.getElementsByTagName("body")[0].className = "";
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			
			// google analytics
			this.__ga.trackPage({
				domain: this.siteParams.siteGADomain,
				account: this.siteParams.siteGAAccount,
				gaEnabled: this.siteParams.siteGAEnable,
				page: 'Ser ContactUs?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParams.siteOfficeId + '&wt_sitecode=' + base[11],
				GTMPage: 'Ser ContactUs?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParams.siteOfficeId + '&wt_sitecode=' + base[11]
			});

			/*Initializing all the variables required for displaying data*/
			listCallCentres = this.list.callCentres;
			listCountries = this.gblLst.countryNameList;
			listCountriesWithCallCentres = this.__createAutocompleteSource(this.list.callCentres, this.gblLst.countryNameList);
			listCountryCodesWithCallCentres = [];

			this.displayAllContactInformation();

			// set header information
			if (this.__merciFunc.booleanValue(this.siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(this.rqstParams.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: this.labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}
			this.moduleCtrl.setHeaderInfo({
				title: this.labels.title,
				bannerHtmlL: this.rqstParams.bannerHtml,
				homePageURL: this.siteParams.homeURL,
				showButton: true,
				companyName: this.siteParams.sitePLCompanyName
			});

			this.setDefaultLocation();
		},

		displayAllContactInformation: function() {

			/*generate an array consisting of country codes of countries with call centres*/
			for (i = 0; i < listCountriesWithCallCentres.length; i++) {
				for (var j = 0; j < listCountries.length; j++) {
					if (listCountriesWithCallCentres[i] == listCountries[j][1])
						listCountryCodesWithCallCentres.push(listCountries[j][0]);
				}
			}
			//var imgPath=this.getImagePath();
			/*display all call centre details group by individual country*/
			var displayDiv = document.getElementById("contactUsAll");
			for (i = 0; i < listCountriesWithCallCentres.length; i++) {
				var newDiv = document.createElement("dl");
				newDiv.className = "on";
				var dt = document.createElement("dt");
				dt.innerHTML = "<div class='flag" + listCountryCodesWithCallCentres[i] + "'></div>" + listCountriesWithCallCentres[i];
				var dd = document.createElement("dd");
				var ul = document.createElement("ul");
				ul.className = "contactList";
				for (j = 0; j < listCallCentres.length; j++) {
					if (listCallCentres[j][0] == listCountryCodesWithCallCentres[i])
						ul.innerHTML += "<li>" + listCallCentres[j][2] + " : <a href='tel:" + listCallCentres[j][1] + "'>" + listCallCentres[j][1] + "</li>";
				}
				dd.appendChild(ul);
				newDiv.appendChild(dt);
				newDiv.appendChild(dd);
				displayDiv.appendChild(newDiv);
			}
		},

		displayIndividualContactInformation: function() {
			/*Create DOM elements, Fetch information from the input field*/

			var selectedCountry = document.getElementById("selectcountry").value;

			var mainDiv = document.getElementById("contactUs");
			var displayAllDiv = document.getElementById("contactUsAll");
			var displayIndividualDiv = document.getElementById("contactUsIndividual");

			/*hide the div which contains contact details for all countries*/
			displayAllDiv.style.display = 'none';

			/*generate an array consisting of country codes of countries with call centres*/
			for (i = 0; i < listCountriesWithCallCentres.length; i++) {
				for (var j = 0; j < listCountries.length; j++) {
					if (listCountriesWithCallCentres[i] == listCountries[j][1])
						listCountryCodesWithCallCentres.push(listCountries[j][0]);
				}
			}

			/*To remove any content present in the div*/
			displayIndividualDiv.innerHTML = "";
			//var imgPath=this.getImagePath();
			/*display call centre information based on the country selected from the input box*/
			if (selectedCountry == "") {
				displayAllDiv.style.display = 'block';
			} else {
				for (m = 0; m < listCountriesWithCallCentres.length; m++) {
					if (listCountriesWithCallCentres[m].toLowerCase().search(selectedCountry.toLowerCase()) == 0) {
						var newDiv = document.createElement("dl");
						newDiv.className = "on";
						var dt = document.createElement("dt");
						dt.innerHTML = dt.innerHTML = "<div class='flag" + listCountryCodesWithCallCentres[m] + "'></div>" + listCountriesWithCallCentres[m];
						var dd = document.createElement("dd");
						var ul = document.createElement("ul");
						ul.className = "contactList";
						for (k = 0; k < listCallCentres.length; k++) {
							if (listCallCentres[k][0] == listCountryCodesWithCallCentres[m])
								ul.innerHTML += "<li>" + listCallCentres[k][2] + " : <a href='tel:" + listCallCentres[k][1] + "'>" + listCallCentres[k][1] + "</li>";
						}
						dd.appendChild(ul);
						newDiv.appendChild(dt);
						newDiv.appendChild(dd);
						displayIndividualDiv.appendChild(newDiv);
					} else
						displayAllDiv.style.display = 'none';
				}
			}
		},

		getImagePath: function() {
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			return bp[0] + "://" + bp[1] + ":" + bp[2] + bp[10] + "/default/" + bp[9] + "/static/merciAT/modules/common/img/flags/";
		},

		setDefaultLocation: function() {
			var loc_var = "default";
			document.getElementById('selectcountry').value = '';
			if (loc_temp = this.__merciFunc.getCookie("merci.country")) {
				var countryNameList = this.gblLst.countryNameList;
				for (countryName in countryNameList) {
					if (countryNameList[countryName][0] == loc_temp) {
						loc_var = countryNameList[countryName][1];
					}
				}
				document.getElementById('selectcountry').value = loc_var;
				this.displayIndividualContactInformation();
			} else if (loc_temp = this.getLocationFromGeo()) {
				loc_var = loc_temp;
				document.getElementById('selectcountry').value = loc_var;
				this.displayIndividualContactInformation();
			}

		},

		getLocationFromGeo: function() {
			var country = "";
			var geoLoc = this.rqstParams.geoLoc;
			var countryNameList = this.gblLst.countryNameList;
			for (var countryName in countryNameList) {
				if (geoLoc != "--" && countryNameList[countryName][0] == geoLoc) {
					country = countryNameList[countryName][1];
				}
			}
			return country;
		},

		keyUp: function() {
			var idName = {
				id: "selectcountry"
			};
			this.displayIndividualContactInformation();
			this.__merciFunc.showCross(null, idName);
		},

		clearContactField: function() {
			var idName = {
				id: "selectcountry"
			};
			this.__merciFunc.clearField(null, idName);
			this.displayIndividualContactInformation();
		},

		storeLocalStorage: function() {
			contactUsObj.__merciFunc.getStoredItemFromDevice(merciAppData.DB_CONTACTUS, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						contactUsObj.jsonObj = JSON.parse(result);
					} else {
						contactUsObj.jsonObj = (result);
					}
				} else {
					contactUsObj.jsonObj = {};
				}

				contactUsObj.jsonObj["labels"] = contactUsObj.labels;

				contactUsObj.jsonObj["list"] = contactUsObj.list;

				contactUsObj.jsonObj["gblLst"] = contactUsObj.gblLst;

				contactUsObj.jsonObj["rqstParams"] = contactUsObj.rqstParams;

				contactUsObj.jsonObj["siteParams"] = contactUsObj.siteParams;

				if ((contactUsObj.jsonObj).hasOwnProperty('aria:parent')) {
					delete contactUsObj.jsonObj['aria:parent'];
				}
				contactUsObj.__merciFunc.storeLocalInDevice(merciAppData.DB_CONTACTUS, contactUsObj.jsonObj, "overwrite", "json");
			});
		},

		getFromLocalStorage: function() {
			contactUsObj.__merciFunc.getStoredItemFromDevice(merciAppData.DB_CONTACTUS, function(result) {
				if (result && result != "") {
					if (typeof result === 'string') {
						contactUsObj.jsonObj = JSON.parse(result);
					} else {
						contactUsObj.jsonObj = (result);
					}
					contactUsObj.labels = contactUsObj.jsonObj["labels"];

					contactUsObj.list = contactUsObj.jsonObj["list"];

					contactUsObj.gblLst = contactUsObj.jsonObj["gblLst"];

					contactUsObj.rqstParams = contactUsObj.jsonObj["rqstParams"];

					contactUsObj.siteParams = contactUsObj.jsonObj["siteParams"];
				}
			});
		}

	}

});