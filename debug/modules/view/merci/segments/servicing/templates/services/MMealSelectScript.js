Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.templates.services.MMealSelectScript',
	$dependencies: [
		'aria.utils.Date',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.MerciGA'
	],

	$statics: {
		MEAL_CODE: 'MEA',
		INITIAL: 2
	},

	$constructor: function() {
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.serviceLabelMap={};
	},

	$prototype: {

		$dataReady: function() {

			var model = this.moduleCtrl.getModuleData().servicing.Mmeal_A;
			this.labels = model.labels;
			this.siteParam = model.siteParam;
			this.globalList = model.globalList;
			this.requestParam = model.requestParam;
			this.request = model.request;
			this.mealLabels = this.buildMealLabels();
			this.data.messages = this.utils.readBEErrors(this.requestParam.reply.LIST_MSG);

			// google analytics
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();

			this.__ga.trackPage({
				domain: this.siteParam.siteGADomain,
				account: this.siteParam.siteGAAccount,
				gaEnabled: this.siteParam.siteGAEnable,
				page: 'Ser Meal?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParam.officeId + '&wt_sitecode=' + base[11],
				GTMPage: 'Ser Meal?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.siteParam.officeId + '&wt_sitecode=' + base[11]
			});
			this.__createServiceLabelMap();
		},
		$displayReady: function() {
			if(this.utils.booleanValue(this.siteParam.enblFFUriPopup) && this.siteParam.siteFpUICondType.toLowerCase() == 'uri'){
				var itin = this.requestParam.listItineraryBean.itineraries;
				for(var j=0; j< itin.length; j++){
					var seg = itin[j].segments;
					for (var i=0; i<seg.length; i++){
						var url = seg[i].fareFamily.condition.url;
						$("#htmlPopup_"+(j+1)+"_"+(i+1)).html('<object data='+url+'/>');
					}
				}
			}
		},

		$viewReady: function() {
			$('body').attr('id', 'mealPref');
			var header = this.moduleCtrl.getModuleData().headerInfo;

			if (this.utils.booleanValue(this.siteParam.enableLoyalty) == true && this.utils.booleanValue(this.requestParam.IS_USER_LOGGED_IN) == true) {
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
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: "",
				showButton: true,
				companyName: this.siteParam.sitePLCompanyName,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MMealSelect",
						data:this.data
					});
			}

		},

		isSegmentEligible: function(segment) {
			return !this.utils.booleanValue(segment.segmentFlown) && segment.status !== 'UC' && segment.status !== 'TK' && segment.status !== 'UN';
		},

		hasAncillaryMealService: function() {
			var siteChargeableService = this.globalList.siteChargeableService;
			var isAncillaryMealService = false;
			if (this.utils.booleanValue(this.siteParam.siteServiceCatalog)) {
				for (var cs = 0; cs < siteChargeableService.length && !isAncillaryMealService; cs++) {
					isAncillaryMealService = (siteChargeableService[cs][11] === this.MEAL_CODE);
				}
			}
			return isAncillaryMealService;
		},

		buildMealLabels: function() {
			var mealLabels = {};
			var labels = this.globalList.siteChargeableServiceLabels;
			for (var L = 0; L < labels.length; L++) {
				mealLabels[labels[L][0]] = labels[L][1];
			}
			return mealLabels;
		},

		isMealUnavailable: function(segment) {
			return this.utils.isEmptyObject(this.requestParam.servicesByPaxAndLoc) && !segment.travellerPreferences.travellers || (this.utils.booleanValue(this.siteParam.siteAllowSpecialMeal) && !segment.serviceMeals && this.displayMealsList());
		},

		getSelectedMeal: function(paxId, itiId, segId) {
			var servicesByPax = this.requestParam.servicesByPaxAndLoc;
			if (servicesByPax[paxId] && servicesByPax[paxId][itiId] && servicesByPax[paxId][itiId][0] && servicesByPax[paxId][itiId][0][segId]) {
				var services = servicesByPax[paxId][itiId][0][segId];
				for (var s = 0; s < services.length; s++) {
					if (!services[s].singleSegment && services[s].serviceSubType === this.MEAL_CODE) {
						return services[s];
					}
				}
			}
			return null;
		},

		getAirPreference: function(segment, paxId) {
			var preferences = segment.travellerPreferences.travellers;
			if (preferences) {
				for (var p = 0; p < preferences.length; p++) {
					if (preferences[p].paxNumber === paxId) {
						return preferences[p].preference;
					}
				}
			}
			return null;
		},

		isActivated: function(meal, airline, chargeable) {
			var configs = this.globalList.siteChargeableService;
			var result = null;
			for (var c = 0; c < configs.length; c++) {
				var config = configs[c];
				if (config[5] === 'SEG' && config[1] === airline && config[10] === 'ONB' && config[11] === this.MEAL_CODE && (typeof chargeable === 'undefined' || this.utils.booleanValue(config[6]) === chargeable)) {

					var codeMatch = false;
					for (var pname in meal.inputParameters) {
						if (meal.inputParameters[pname].value === config[0]) {
							codeMatch = true;
							break;
						}
					}
					if (codeMatch) {
						result = config;
						break;
					}

				}
			}
			return result;
		},

		displayMealsList: function() {
			return this.utils.booleanValue(this.siteParam.siteChargeAddService) && this.utils.booleanValue(this.siteParam.siteCheckAirServ) && (this.siteParam.siteSrvcEligStrat === 'AA') && this.utils.booleanValue(this.siteParam.siteShowMealInFares);
		},

		formatDate: function(strDate, pattern, utcTime) {
			var format = this.utils.getFormatFromEtvPattern(pattern);
			var jsDate = new Date(strDate);
			return aria.utils.Date.format(jsDate, format, utcTime);
		},

		_optionsFromGroup: function(mealGroup, airline) {
			var options = [];
			if (mealGroup != null) {
				var meals = mealGroup.singleServiceMap;
				for (var code in meals) {
					var config = this.isActivated(meals[code], airline, false);
					if (config) {
						var meal = {
							value: config[0],
							label: this.mealLabels[code],
							selected: (meals[code].status === this.INITIAL)
						};
						options.push(meal);
					}
				}
			}

			return options;
		},

		_optionsFromServiceMeals: function(serviceMeals, paxPref) {
			var options = [];
			var mealPref= "";
			if(!this.utils.isEmptyObject(paxPref)){
				mealPref= paxPref.mealCode;
			}
			for (var m = 0; m < serviceMeals.length; m++) {
				var meal = {
					value: serviceMeals[m].code,
					label: serviceMeals[m].name,
					selected: (serviceMeals[m].code === mealPref)
				};
				options.push(meal);
			}
			return options;
		},

		_optionsFromGlobalList: function(paxPref) {
			var options = [];
			var meals = this.globalList.slSiteLanguageMeal;
			for (var m = 0; m < meals.length; m++) {
				var meal = {
					value: meals[m][0],
					label: meals[m][1],
					selected: (meals[m][0] === paxPref.mealCode)
				};
				options.push(meal);
			}
			return options;
		},

		onCancel: function(evt) {
			var lastName = this.requestParam.listTravellerBean.primaryTraveller.identityInformation.lastName;
			var params = {
				DIRECT_RETRIEVE: "true",
				JSP_NAME_KEY: "SITE_JSP_STATE_RETRIEVED",
				PAGE_TICKET: this.requestParam.reply.PAGE_TICKET,
				DIRECT_RETRIEVE_LASTNAME: lastName,
				REC_LOC: this.requestParam.recLoc,
				SERVICE_PRICING_MODE: "INIT_PRICE",
				ACTION: "MODIFY",
				result: "json"
			};

			this.utils.sendNavigateRequest(params, 'MMealCancelAction.action', this);
		},

		onSave: function(evt) {
			var formElmt = document.getElementById(this.$getId("MAPForm"));
			var actionName;
			if (this.utils.booleanValue(this.siteParam.siteBilateralMeal)) {
				actionName = 'MRetrievePNRServices.action';
			} else {
				actionName = 'MMealPrefRequestAdditionalInformationMconfMpurcMfsr.action';
			}
			this.utils.sendNavigateRequest(formElmt, actionName, this);
		},

		/** Build a json list for infant meals available */
		buildInfantMealList: function() {
			var infantMealList = [];
			var services=this.globalList.siteChargeableService;
			for(var s=0; s<services.length; s++){
				var currentService=services[s];
				if(currentService[11]==this.MEAL_CODE){
					var label=currentService[0];
					if(this.serviceLabelMap[currentService[0]]){
						label=this.serviceLabelMap[currentService[0]];
					}
				var meal = {
						value:currentService[0],
						label:label
				};

					infantMealList.push(meal);
			}
			}
			return infantMealList;
		},
		createMealName: function(evt, args){
			var currentMeal=evt.target.getValue();
			var selectedInfMeal=this.getInfantMealSelection(args.segId, args.paxId);
			var element=document.getElementById("mealElement"+args.segId+"_"+args.paxId);
			if(element!=null){
				var name="ADD_SERV_"+currentMeal+"_NUMBER_"+args.paxId+"_"+args.segId+"_1";
				element.setAttribute("name", name);
				element.setAttribute("value", "1");
				if(currentMeal==""){
					element.setAttribute("name", "");
				}
				if(selectedInfMeal!=""){
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					input.setAttribute("name", "ADD_SERV_"+selectedInfMeal+"_NUMBER_"+args.paxId+"_"+args.segId);
					input.setAttribute("value", "0");
					document.getElementById(this.$getId("MAPForm")).appendChild(input);
				}
			}
		},
		__createServiceLabelMap:function(){
			var labels = this.globalList.siteChargeableServiceLabels;
			for(var l=0;l<labels.length;l++){
				var currentService=labels[l];
				this.serviceLabelMap[currentService[0]]=currentService[1];
			}
			var customLabels=this.globalList.siteCustomChargeableServiceLabels;
			for(var c=0;c<customLabels.length;c++){
				var currentService=customLabels[c];
				this.serviceLabelMap[currentService[0]]=currentService[1];
			}
		},
		getInfantMealSelection: function(segmentId, paxNumber) {
			var meal = "";
			if (this.utils.booleanValue(this.siteParam.siteBilateralMeal)) {
				if(this.utils.booleanValue(this.siteParam.siteAllowInfantMeal) && this.utils.booleanValue(this.requestParam.isInfantMeal)==true){
					var selectedServices=this.requestParam.serviceSelection.selectedServices || [];
					for(var s=0;s<selectedServices.length;s++){
						var service=selectedServices[s];
						if(service.subcategory=="MEA"){
							if(service.elementIds.indexOf(segmentId)>=0 && service.passengerIds.indexOf(paxNumber)>=0){
									meal=service.code;
							}
						}
					}
				}
			}
			return meal;
		}
	}
});