Aria.tplScriptDefinition({
  $classpath : 'modules.view.merci.segments.servicing.templates.services.MDynamicMealScript',
  $dependencies: [
      'modules.view.merci.common.utils.MCommonScript'
  ],

  $statics: {
      CATEGORY_MEAL: 'MEA',
      PTY_NUMBER: 'NUMBER',
      SERVICE_STATE: 'STATE',
    STATE_BOOKED: 'INITIAL',
    STATE_MODIFIED: 'MODIFIED',
    STATE_ADDED:'ADDED',
    STATE_CANCELLED:'CANCELLED',
    STANDARD_MEAL:'ANY',
    SPECIAL_MEAL:'SPML'
  },

  $constructor : function () {
      this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype : {

	$dataReady: function (){
        var model = this.moduleCtrl.getModuleData().MDynamicMeal;
        this.siteParams = model.config;
        this.labels = model.labels;
        this.request = model.request;
        this.reply = model.reply
        this.tripplan = this.moduleCtrl.getTripPlan();
        this.bookedSelection = new modules.view.merci.common.utils.ServiceSelection(this.tripplan.air.services, this.tripplan.air.itineraries);
        this.currentSelection = this.moduleCtrl.getCurrentSelection();
        this._catalog = this.moduleCtrl.getCatalog();
        this.data.messages = this.utils.readBEErrors(this.reply.LIST_MSG);
        this.data.defaultPaxIndex = this.__getDefaultPaxIndex(); //Index of pax to display by default in carousel
        this.data.currency = this._catalog.getCurrency();
        this.data.subCategories={};
        if(this.utils.booleanValue(this.siteParams.siteEnableMealGroup))
            this.getSubCategories();
        this.initMultipleMeal();         
        this.data.mealsData = this.__initMealsData();
        this.data.disableContinue = true; //State of 'Continue' button
        this._setDisableContinue();
        this.data.disableModif = !this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');
	},

    $viewReady: function() {
		var header = this.moduleCtrl.getModuleData().headerInfo;
		this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: header.showButton
		});
		
        document.body.className = 'pnr-retrieve meals';
        this.updatePax();

		if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MDynamicMeal",
						data:this.data
					});
			}
    },

    updatePax: function(){
        for (var s=0; s<this.data.mealsData.selectedPax.segments.length; s++) {
            var itemId = 'itemp0b'+0+'s'+s+'i0' ;
            this.updateMultipleMealList(itemId);
        }
    },

    initMultipleMeal : function(){

        var siteMultipleMealList = this.siteParams.siteMultipleMealList ;
        var mealArray =[];
        this.multipleMealConfig = {} ;
        this.maxNoOfMeal = 1 ;  
        if(!this.utils.isEmptyObject(siteMultipleMealList))
            mealArray = siteMultipleMealList.split(',') ;
        
        if(mealArray.length>0){

            for(var i=0; i<mealArray.length;i++){
              mealArray[i] = mealArray[i].split('-') ;
            }
            for(var i=0; i<mealArray.length;i++){
              this.multipleMealConfig[mealArray[i][0]] = parseInt(mealArray[i][1]) ;
            }
            this.maxNoOfMeal = this.multipleMealConfig["MAX"] ;
        }
        else{
            this.multipleMealConfig = {"MAX":1} ;
        }

        if(!this.utils.booleanValue(this.siteParams.siteAllowMultipleMeal)){
            this.maxNoOfMeal = 1 ;
            this.multipleMealConfig = {"MAX":1} ;
        }

        var siteSPMLMeals = this.siteParams.siteSPMLMeals ;
        var SPMLMeals = siteSPMLMeals.split(',');

        this.SPMLMeals = {} ;
        for(var i=0; i<SPMLMeals.length;i++){
            this.SPMLMeals[SPMLMeals[i]] = true ;
        }
    },

    getSubCategories: function(){

        var category = this._catalog.getCategory(this.CATEGORY_MEAL);
        
        if(!this.utils.isEmptyObject(category)){
            if(!this.utils.isEmptyObject(category.subcategories)){
                for(var i=0;i<category.subcategories.length;i++){
                    if(!this.utils.isEmptyObject(category.subcategories[i].name))
                        this.data.subCategories[category.subcategories[i].code]=category.subcategories[i].name;
                    else
                        this.data.subCategories[category.subcategories[i].code]=category.subcategories[i].code;
                }
            }
        }
    },



    /**
     * Reads from the request the index (in the pax array) of the passenger to be selected by default in the carousel
     */
    __getDefaultPaxIndex: function() {
        var defaultIndex = 0;
        if (!this.utils.isEmptyObject(this.request.passengerId)) {
            var defaultId = this.request.passengerId;
            var passengers = this.tripplan.paxInfo.travellers;
            for (var p=0; p<passengers.length; p++) {
                if (String(passengers[p].paxNumber) === defaultId) {
                    defaultIndex = p;
                }
            }
        }
        return defaultIndex;
    },

    /**
     * Creates the object describing the available bag options for each passenger and segment
     * Object structure: {
     *   passengers: [{
     *      segments: [{
     *          available:     <whether bag in catalogue for this pax and bound>,
     *          booked:        <Meal code in trip plan>,
     *          items:[{
     *              itemId:     <Id of the item that is being added>
     *              choice:     <choice>
     *          },..],
     *          choices: [{
     *              code:      <meal code>,
     *              name:      <localised meal name>,
     *              inputTags: <input tags to send>,
     *              price:     <price for current value>
     *          }, ...],
     *          current:       <an item of choices>
     *      }, ...]
     *   }, ...],
     *   selectedPax: <an item of passengers>
     * }
     */
    __initMealsData: function() {
        var mealsData = {
            passengers: []
        };
        var id=0;
        var bounds = this.tripplan.air.itineraries;
        var segments = [];
        for (var b=0; b<bounds.length; b++) {
            for (var s=0; s<bounds[b].segments.length; s++) {
                bounds[b].segments[s].boundId = b;
                //bounds[b].segments[s].id = id;
                segments.push(bounds[b].segments[s]);
                id++;
            }
        }

        var passengers = this.tripplan.paxInfo.travellers;
        for (var p=0; p<passengers.length; p++) {
            var paxNumber = passengers[p].paxNumber;
            mealsData.passengers[p] = {
                segments: [],
                paxId : p
            };
            for (var s=0; s<segments.length; s++) {
                var segmentData = this.__initSegmentData(paxNumber, segments[s], mealsData.passengers[p].segments.length,passengers[p].withInfant);
                //mealsData.passengers[p].segments[segments[s].id] = segmentData;
                mealsData.passengers[p].segments.push(segmentData);
            }
            if (p === this.data.defaultPaxIndex) {
                mealsData.selectedPax = mealsData.passengers[p];
            }
        }
        return mealsData;
    },

    /**
     * Creates the object describing the available bag options for the given passenger and segment
     */
    __initSegmentData: function(paxNumber, segment, segmentsLength,hasInfant) {
        var services = this._catalog.getServices(this.CATEGORY_MEAL, paxNumber, null, segment.id);
        var avail = services.length > 0;
        var segmentData = {
            boundId: segment.boundId,
            beginLocation:segment.beginLocation,
            endLocation:segment.endLocation,
            available: avail,
            hasChargeable: false,
            itemsAddedVar: true,
            items : []
        };


        var bookedMeals = this.bookedSelection.getServices(this.CATEGORY_MEAL, paxNumber, null, segment.id);
        
        var selectedMeals = this.currentSelection.getServices(this.CATEGORY_MEAL, paxNumber, null, segment.id);
        if (selectedMeals.length > 0) {
            segmentData.selected = selectedMeals[0].code;
        }
		    currentCode = segmentData.selected;
        if (avail) {
            var choices = [];
            for (var s=0; s<services.length; s++) {
                var choice = this.__createChoice(services[s], paxNumber, segment.id);
                choices.push(choice);
                for (var m=0;m<selectedMeals.length;m++){
                    var state = this.getAttribute(selectedMeals[m],this.SERVICE_STATE);  
                    if (choice.code === selectedMeals[m].code) {
                        var itemId=this.__getItemId(segmentData.items, paxNumber, segment.boundId,segmentsLength);
              					if(!segmentData.current){
              						  segmentData.current=[];
              					}
                        segmentData.current.push(choice);
                        var currentItem= {
                            id: itemId,
                            state: state,
                            choice: choice  
                        }; 
                        if(state && state!=this.STATE_CANCELLED)
                            segmentData.items.push(currentItem); 
                    }
                }
                for (var n=0;n<bookedMeals.length;n++){
                    if (choice.code === bookedMeals[n].code) {
                        if(!segmentData.booked){
                            segmentData.booked=[];
                        }
                        segmentData.booked.push(choice);
                    }
                }
                if (choice.price) {
                    segmentData.hasChargeable = true;
                }
            }
            segmentData.choices = choices;
        }        

        //sort by Meal Names
        if (!this.utils.isEmptyObject(segmentData.choices)) {
          segmentData.choices.sort(function(a,b) {
              if (a.name < b.name)
                  return -1;
              if (a.name > b.name)
                  return 1;
              return 0;
          });
        }

        //decrement MAX if infant is not present
        segmentData.hasInfant = hasInfant ;
        var maxNoOfMeal = aria.utils.Json.copy(this.maxNoOfMeal) ;
        var NoBBML = this.multipleMealConfig.BBML ;
        if(this.utils.isEmptyObject(NoBBML))
            NoBBML = 0 ;        
        maxNoOfMeal = maxNoOfMeal-NoBBML ;

        
        segmentData.multipleMealLists=[];
        for(var i=0;i<this.maxNoOfMeal;i++){
            segmentData.multipleMealLists[i] = {} ;
            segmentData.multipleMealLists[i].choice=  aria.utils.Json.copy(choices);
            segmentData.multipleMealLists[i].multipleMealConfig = aria.utils.Json.copy(this.multipleMealConfig) ;
            segmentData.multipleMealLists[i].multipleMealConfig.MAX = maxNoOfMeal ;
            if(!this.utils.booleanValue(segmentData.hasInfant))
                segmentData.multipleMealLists[i].multipleMealConfig.BBML = 0 ;
        }
        segmentData.multipleMealConfig = aria.utils.Json.copy(segmentData.multipleMealLists[0].multipleMealConfig) ;
        return segmentData;
    },
    addItems : function(evt , args){                //args=[boundId, segment_index, paxObject, selectedChoices]
      var pax=args[2];
      var itemsAddedVar = pax.segments[args[1]].itemsAddedVar;
      var arr = pax.segments[args[1]].items;
      var itemId = this.__getItemId(arr,pax.paxId,args[0],args[1]);
      arr.push({
              id: itemId
          });
      this.$json.setValue(this.data.mealsData.selectedPax.segments[args[1]], 'items', arr);  
      this.$json.setValue(this.data.mealsData.selectedPax.segments[args[1]], 'itemsAddedVar', !itemsAddedVar);       
      this.updateMultipleMealList(itemId,false);
    },
    getChoiceId:function(args){
      if(!this.utils.isEmptyObject(args))
        return args.substr(11,1) ;
      else
        return 0 ;
    },
    __getItemId: function(items,paxId,bound_index,segment_index){
      var itemNumber = 0;
      for(var i=0;i<this.maxNoOfMeal;i++){
        if(items.length>0){
          if(items[i] != undefined){
            if(i != parseInt(items[i].id.substr(11,1))){
              itemNumber=i; 
              break;
            }
          }
          else{
            itemNumber=i;
            break;
          }         
        }
      }
      return 'itemp'+paxId+'b'+bound_index+'s'+segment_index+'i'+itemNumber;
    },
    __deleteItems: function(evt, args){
      var id = args.itemId;
      var segment_index = id.substr(9,1);
      var itemsAddedVar = this.data.mealsData.selectedPax.segments[segment_index].itemsAddedVar;     
      var arr = this.data.mealsData.selectedPax.segments[segment_index].items;
      this.moduleCtrl.deleteItem(arr, id);
      //this.$json.setValue(this.data.mealsData.selectedPax.segments[segment_index], 'itemsAddedVar', !itemsAddedVar); 
      this._setDisableContinue();
      for(var j=0;j<arr.length;j++){
        arr[j].id = arr[j].id.substr(0,11) ;
        arr[j].id = arr[j].id+j ;
      }
      if(this.utils.booleanValue(this.siteParams.siteAllowMultipleMeal))
          this.updateMultipleMealList(id,true);  // args.currentCode
      else{
          this.$json.setValue(this.data.mealsData.selectedPax.segments[segment_index], 'itemsAddedVar', !itemsAddedVar);
      }
    },

    /**
     * Creates a single option of meal for the drop-down input
     */
    __createChoice: function(service, paxNumber, segmentId) {
        var eligGroup = this._catalog.getEligibilityGroupsFromService(service, paxNumber, null, segmentId)[0];
        var subcategoryCode = "" ;
        var subcategoryCodeToAppend = "" ;
        var type = "" ;
        if(!this.utils.isEmptyObject(service.subcategoryCode)){
            subcategoryCode = service.subcategoryCode ;
            if(this.utils.booleanValue(this.siteParams.siteEnableMealGroup)){
                if(!this.utils.isEmptyObject(this.data.subCategories[subcategoryCode])){
                    subcategoryCode = this.data.subCategories[subcategoryCode] ;
                }
                subcategoryCodeToAppend = subcategoryCode + " - " ;
            }
        }
        var serviceName = subcategoryCodeToAppend + service.name ;
        if(this.SPMLMeals[service.code]){
            type=this.SPECIAL_MEAL;
        }else{
            type=this.STANDARD_MEAL ;
        }
        if(service.code=="BBML")
            type = "BBML";
        var choice = {
            code: service.code,
            name: serviceName,
            subcategoryCode: subcategoryCode,
            type: type
        };

        var numberProperty = this._catalog.getFirstProperty(eligGroup, this.PTY_NUMBER);
        var tag = this._catalog.getParameterValue(numberProperty, 'VALUE', 'inputTag');
        tag = tag.replace('[p]', paxNumber).replace('[s]', segmentId).replace('[i]', 1);

        choice.inputTags = {};
        choice.inputTags[tag] = '1';

        if (eligGroup.priceInfo) {
            choice.price = eligGroup.priceInfo.totalAmount;
        }
        return choice;
    },

    /**
     * Call-back used by the carousel to tell that a new passenger was selected
     */
    selectPax: function(pId) {
        this.$json.setValue(this.data.mealsData, 'selectedPax', this.data.mealsData.passengers[pId]);
        this.updatePax();  
    },

    /**
     * Event handler when the user selects a value in the drop-down
     */
    setValue: function(evt, args) {
      //args:{itemId, mealsData}
        var value = evt.target.getValue();
        var current = null;
        var mealsData=args.mealsData;
        var itemsList=args.mealsData.items;
        if (value) {
            current={};
            current.id=args.itemId;
            if(value==args.code)
                current.state=args.state;
            else
                current.state="";
            for (var c=0; c<mealsData.choices.length; c++) {
                if (mealsData.choices[c].code === value) {
                    current.choice = aria.utils.Json.copy(mealsData.choices[c]);
                    break;
               }
            }
        }
        for(var i=0; i<itemsList.length;i++){
            if(itemsList[i].id==args.itemId){                
                itemsList[i]=current;
            }
        }
        this._setDisableContinue();
        var itemsAddedVar = mealsData.itemsAddedVar; 
        if(this.utils.booleanValue(this.siteParams.siteAllowMultipleMeal))
            this.updateMultipleMealList(args.itemId,false);
        else
            this.$json.setValue(mealsData, 'itemsAddedVar', !itemsAddedVar);
    },
    countInstances:function(code, itemsArray){
        var count=0;
        for(var i=0;i<itemsArray.length;i++){
          if(itemsArray[i].choice && code==itemsArray[i].choice.code)
            count++;
        }
        return count;
    },
    /**
     * Updates the state of the 'Confirm' button, so that it is enabled only if something is selected
     */
    _setDisableContinue: function() {
        var disable = true;
        var passengers = this.data.mealsData.passengers;
        if(this.currentSelection.getServices(this.CATEGORY_MEAL, null, null, null).length>0){
            this.$json.setValue(this.data, 'disableContinue', false);
        }else{
            for (var p=0; p<passengers.length; p++) {       
                var segments = passengers[p].segments;
                for (var s=0; s<segments.length ; s++) {
                    if (segments[s].available && passengers[p].segments[s].items.length>0) {  
                        var items = passengers[p].segments[s].items;
                        for (var i=0; i<items.length; i++){          
                            var current=items[i].choice;
                            if (!this.data.disableModif) {
                                disable = false;
                                break;                            
                            }
                            else{
                                if(items[i].state!=this.STATE_BOOKED && current && current.value != ""){
                                    disable = false;
                                    break;
                                }
                            }
                        }
                    }                
                    if (!disable) {
                      break;
                    }
                }
                this.$json.setValue(this.data, 'disableContinue', disable);
            }
        }

        
    },

    /**
     * Event handler when the user clicks on confirm.
     * Reads all the input tags from the mealsData and sends them.
     */
    confirm: function(evt) {
        var inputTags = {};
        var passengers = this.data.mealsData.passengers;

        for (var p=0; p<passengers.length; p++) {
            var segments = passengers[p].segments;
            for (var s=0; s<segments.length; s++) {
                if (segments[s]) {                   

                    //Basket Selections
                    for(var i in segments[s].current){
                        for (var t in segments[s].current[i].inputTags) {
                            if (!this.$json.isMetadata(t)) {
                                inputTags[t] = null;
                            }
                        }
                    }

                    //Booked Meals
                    for(var i in segments[s].booked){
                        for (var t in segments[s].booked[i].inputTags) {
                            if (!this.$json.isMetadata(t)) {
                                inputTags[t] = "0";
                            }
                        }
                    }

                    //Current Selection
                    for(var i in segments[s].items){
                        if(segments[s].items[i].choice){
                            for (var t in segments[s].items[i].choice.inputTags) {
                                if (!this.$json.isMetadata(t)) {
                                    inputTags[t] = segments[s].items[i].choice.inputTags[t];                                    
                                }
                            }
                        }
                    }
                }
            }
        }

        this.moduleCtrl.updateBasket(this.CATEGORY_MEAL, inputTags, {fn: this.__errorCallback, scope: this});
    },

    __errorCallback: function(reply) {
        var messages = this.utils.readBEErrors(reply.errors);
        this.$json.setValue(this.data, 'messages', messages);
    },
    /**
       * Returns the value of service attribute with the given type, or undefined if it does not exist.
       */
      getAttribute: function(service, attrType) {
        var value;
        var attributes = service.attributes;
        for (var a=0; a<attributes.length; a++) {
            if (attributes[a].type === attrType) {
                value = attributes[a].value;
                break;
            }
        }
        return value;
      },


      updateMultipleMealList: function(itemId,isDeleted){

        
        var segment_index = itemId.substr(9,1);
        var choiceId = parseInt(itemId.substr(11,1));
        var selectedMealsType = [];
        var subCategorySelected ;
        

        var selectedSegment = this.data.mealsData.selectedPax.segments[segment_index];

        //storing the selected meal codes in a array - selectedMealsType
        for(var it=0;it<selectedSegment.items.length;it++){
          if(!this.utils.isEmptyObject(selectedSegment.items[it].choice) && !this.utils.isEmptyObject(selectedSegment.items[it].choice.type)){
              selectedMealsType.push(selectedSegment.items[it].choice.type) ;
          }
        }

        //iniating the mealListConfig..
        for (var j = 0; j < selectedSegment.multipleMealLists.length; j++) {
              selectedSegment.multipleMealLists[j].multipleMealConfig = aria.utils.Json.copy(selectedSegment.multipleMealConfig) ;
              selectedSegment.multipleMealLists[j].choice = aria.utils.Json.copy(selectedSegment.choices) ;
        }  

        
        //updating the multipleMealConfig for every choices
        var itemType = "" ;
        for(var i=0;i<selectedMealsType.length;i++){
            for (var j = 0; j < selectedSegment.multipleMealLists.length; j++) { 
                itemType = "" ;
                if(selectedSegment.items[j] && selectedSegment.items[j].choice){
                    itemType = selectedSegment.items[j].choice.type ;
                } 
                if(itemType!=selectedMealsType[i]){
                    selectedSegment.multipleMealLists[j].multipleMealConfig[selectedMealsType[i]] -= 1  ;
                    if(selectedMealsType[i]!="BBML")
                        selectedSegment.multipleMealLists[j].multipleMealConfig["MAX"] -= 1 ;
                }
            }        
        }  

        //delete all meals which are selected once
        var itemCode ;
        for(var i=0 ; i<selectedSegment.items.length ; i++){
            itemCode = "" ;
            if(selectedSegment.items[i].choice){
                itemCode = selectedSegment.items[i].choice.code ;
            } 
            for (var j = 0; j < selectedSegment.multipleMealLists.length; j++){
                if( (i!=j) && !this.utils.isEmptyObject(itemCode))  
                    this.deleteByMealCode(selectedSegment.multipleMealLists[j].choice,itemCode);
            }
        }

        
        //deleting the meals from choice lists.
        for (var j = 0; j < selectedSegment.multipleMealLists.length; j++) { 
            itemType = "" ;
            if(selectedSegment.items[j] && selectedSegment.items[j].choice){
                itemType = selectedSegment.items[j].choice.type ;
            }
            for (var key in selectedSegment.multipleMealLists[j].multipleMealConfig) {
                if (selectedSegment.multipleMealLists[j].multipleMealConfig.hasOwnProperty(key)) {
                    if((selectedSegment.multipleMealLists[j].multipleMealConfig[key]<1)&&(itemType!=key)){
                        if(key=="MAX"){
                            this.deleteAllMeals(selectedSegment.multipleMealLists[j].choice,"BBML");
                        }else
                            this.deleteByTypeOfMeal(selectedSegment.multipleMealLists[j].choice,key); 
                    }      
                }
            } 
        }
        
        //If multiple meals within a group is activated.
        if(this.utils.booleanValue(this.siteParams.siteMultiMealGroup)){
            for(var i=0;i<selectedSegment.items.length;i++){
                subCategorySelected=-1;
                if(!this.utils.isEmptyObject(selectedSegment.items[i].choice)){
                      subCategorySelected = selectedSegment.items[i].choice.subcategoryCode;
                }
                if(subCategorySelected!=-1&&!this.utils.isEmptyObject(subCategorySelected)){
                    for(var j=0;j<selectedSegment.multipleMealLists.length;j++){
                        if(j!=i){
                            for(var k=0;k<selectedSegment.multipleMealLists[j].choice.length;k++){
                                if(selectedSegment.multipleMealLists[j].choice[k].subcategoryCode==subCategorySelected){
                                    selectedSegment.multipleMealLists[j].choice.splice(k,1);
                                    k--;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        var itemsAddedVar = selectedSegment.itemsAddedVar; 
        this.$json.setValue(this.data.mealsData.selectedPax.segments[segment_index], 'itemsAddedVar', !itemsAddedVar); 
      },

      deleteByTypeOfMeal: function(choice,mealType){
        if (!this.utils.isEmptyObject(choice)) {
          for(var i=0;i<choice.length;i++){
              if(choice[i].type==mealType){
                choice.splice(i,1);
                i--;
              }
          }
        }
      },

      deleteByMealCode: function(choice,mealCode){
          for(var i=0;i<choice.length;i++){
              if(choice[i].code==mealCode){
                choice.splice(i,1);
                i--;
              }
          }
      },  

      deleteAllMeals: function(choice,mealType){
          for(var i=0;i<choice.length;i++){
              if(choice[i].type!=mealType){
                  choice.splice(i,1);
                  i--;
              }
          }
      },

      areMealsAvailable: function(args){
          var maxNoOfMeal = args.multipleMealConfig.MAX ;
          if(this.utils.booleanValue(args.hasInfant)){
              maxNoOfMeal += args.multipleMealConfig.BBML;
          }              
          if(args.items.length>=maxNoOfMeal){
              return false;
          }
          for(var i=0;i<args.items.length;i++){
              if(this.utils.isEmptyObject(args.items[i].choice))
                  return false;
          }
          if(!this.utils.isEmptyObject(args.multipleMealLists[args.items.length])){
              if(args.multipleMealLists[args.items.length].choice.length > 0)
                  return true ;
          }else{
              return false;
          }   
          return false ;
      },

      toggleSegment: function (evt) {

          var args = {};
          var btnEL ;
          args.buttonId = evt.target.getProperty('id');

          btnEL = document.getElementById(args.buttonId);
          if (btnEL != null) {
              args.sectionId = btnEL.getAttribute('aria-controls');
          }

          // calling common method
          this.utils.toggleExpand(evt, args);
      }
  }
});