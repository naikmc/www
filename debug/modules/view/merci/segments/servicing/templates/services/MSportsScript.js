Aria.tplScriptDefinition({
  $classpath: "modules.view.merci.segments.servicing.templates.services.MSportsScript",
  $dependencies: [
    'aria.utils.Array',
    'aria.utils.Date',
    'modules.view.merci.common.utils.MCommonScript',
    'modules.view.merci.common.utils.MerciGA',
    'modules.view.merci.common.utils.ServiceCatalog',
    'modules.view.merci.common.utils.ServiceSelection'
  ],

  $statics: {
    CATEGORY_SPORTS: 'SPO',
    INPUT_FREE: 'FREETXT',
    INPUT_MULTIPLE: 'MULTIPLE',
    PTY_NUMBER: 'NUMBER',
    PTY_TYPE: 'TYPE',
    SERVICE_STATE: 'STATE',
    STATE_BOOKED: 'INITIAL',
    STATE_MODIFIED: 'MODIFIED',
    STATE_ADDED: 'ADDED',
    STATE_CANCELLED: 'CANCELLED'
  },

  $constructor: function() {
    this.utils = modules.view.merci.common.utils.MCommonScript;
    this.__ga = modules.view.merci.common.utils.MerciGA;
  },

  $prototype: {
    $dataReady: function() {
      var model = this.moduleCtrl.getModuleData().MSports;
      this.config = model.config;
      this.labels = model.labels;
      this.request = model.request;
      this.reply = model.reply;
      this.tripplan = this.moduleCtrl.getTripPlan();
      this.bookedSelection = new modules.view.merci.common.utils.ServiceSelection(this.tripplan.air.services, this.tripplan.air.itineraries);
      this.currentSelection = this.moduleCtrl.getCurrentSelection();
      this._catalog = this.moduleCtrl.getCatalog();

      this.data.messages = this.utils.readBEErrors(this.reply.errors);
      this.data.defaultPaxIndex = this.__getDefaultPaxIndex(); //Index of pax to display by default in carousel
      this.data.currency = this._catalog.getCurrency();
      this.data.sportsData = this.__initSportsData();
      this.data.sportsName = this.getSportsName();
      this.data.disableContinue = true; //State of 'Continue' button
      this._setDisableContinue();
      this.data.disableModif = !this.moduleCtrl.getAncillaryPermission('ALLOW_MODIFY');
      var base = modules.view.merci.common.utils.URLManager.getBaseParams();
      
      // google analytics
      this.__ga.trackPage({
        domain: this.config.siteGADomain,
        account: this.config.siteGAAccount,
        gaEnabled: this.config.siteGAEnable,
        page: 'Ser 1-Add Baggage?wt_market=' + ((base[13] != null) ? base[13] : '') +
          '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeId + '&wt_sitecode=' + base[11],
        GTMPage: 'Ser 1-Add Baggage?wt_market=' + ((base[13] != null) ? base[13] : '') +
          '&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeId + '&wt_sitecode=' + base[11]
      });
      
    },

    $viewReady: function() {
      // document.body.className = 'pnr-retrieve xbag';
	    var header = this.moduleCtrl.getModuleData().headerInfo;
	    this.moduleCtrl.setHeaderInfo({
	      title: header.title,
	      bannerHtmlL: header.bannerHtml,
	      homePageURL: header.homeURL,
	      showButton: header.showButton
	    });
	    this.moduleCtrl.setHeaderCurrInfo(false);
		
		if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSports",
						data:this.data
					});
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
        for (var p = 0; p < passengers.length; p++) {
          if (String(passengers[p].paxNumber) === defaultId) {
            defaultIndex = p;
          }
        }
      }
      return defaultIndex;
    },

    /**
     * Reads from the catalogue the localised name of the service being selected,
     * or an empty string if no bag is available (not supposed to happen)
     */
    getSportsName: function() {
      var spoServices = this._catalog.getServices(this.CATEGORY_SPORTS);
      var spoName = '';
      if (spoServices.length > 0) {
        spoName = spoServices[0].name;
      }
      return spoName;
    },

    /**
     * Structure of the JSON sportsData:
     *   passengers: [{
     *      bounds: [{
     *           available: < whether sports equipment in catalogue
     *           for this pax and bound > ,
     *           cardinality: < value of maxCardinality as coming in the catalog > ,
     *           itemsAddedVar: < variable to refresh the input dropdowns > ,
     *           itemsList: [{
     *               id: < the unique id of the item - 'itempNbNiN',
     *               where N >= 0 > ,
     *               choice: < a choice element >
     *           }, ...],
     *           choices: [{
     *               name: < service description > ,
     *               serviceCode: < the SSR code of the service > ,
     *               price: < price
     *               for the service > ,
     *               NUMBER: {
     *                   inputTags: < the input tags
     *                   for NUMBER property > ,
     *               },
     *               TYPE: [{ //only in case TYPE is present
     *                   code: < the code
     *                   for the specific service > ,
     *                   inputTags: < the input tags
     *                   for TYPE property >
     *                       name: < service description >
     *               }, ..]
     *          }, ...],
     *           current: < an item of choices>
     *
     *      }, ...]
     *   }, ...],
     *   selectedPax: <an item of passengers>
     * }
     */

    /**
     * Creates the object describing the available sports options for the given passenger
     */

    __initSportsData: function() {
      var sportsData = {
        passengers: []
      };

      var passengers = this.tripplan.paxInfo.travellers;
      var bounds = this.tripplan.air.itineraries;
      for (var p = 0; p < passengers.length; p++) {
        var paxNumber = passengers[p].paxNumber;
        sportsData.passengers[p] = {
          bounds: [],
          paxId: p
        }
        for (var b = 0; b < bounds.length; b++) {
          var boundData = this.__initBoundData(paxNumber, bounds[b]);
          sportsData.passengers[p].bounds[b] = boundData;
        }
        if (p === this.data.defaultPaxIndex) {
          sportsData.selectedPax = sportsData.passengers[p];
        }
      }
      return sportsData;
    },

    /**
     * Creates the object describing the available sports options for the given passenger and bound
     */
    __initBoundData: function(paxNumber, bound) {
      var boundId = Number(bound.itemId);
      var services = this._catalog.getServices(this.CATEGORY_SPORTS, paxNumber, boundId);
      var avail = services.length > 0;
      var maxCardinality = services[0].maxCardinality;
      var boundData = {
        available: avail,
        itemsAddedVar: true,
        cardinality: maxCardinality,
        itemsList: [],
        choices: []
      };
      var bookedSports = this.bookedSelection.getServices(this.CATEGORY_SPORTS, paxNumber, boundId);
      var selectedSports = this.currentSelection.getServices(this.CATEGORY_SPORTS, paxNumber, boundId);
      if (avail) {



        var nextIndex = "1";
        var inputTagsArgs = {
          paxNumber: paxNumber,
          bound: bound
        };

        for (var s = 0; s < services.length; s++) {
          var eligGroups = this._catalog.getEligibilityGroupsFromService(services[s], paxNumber, boundId);
          inputTagsArgs.nextIndex = nextIndex;
          this.__initPropertyData(boundData, eligGroups, services[s].code, services[s].name, inputTagsArgs);
        }

      }
      return boundData;
    },
    /**
     * Creates the choices for each of the properties present in listProperties
     */

    __initPropertyData: function(sportsData, eligGroups, srvCode, srvName, inputTagsArgs) {

      var selectedSports = this.currentSelection.getServices(this.CATEGORY_SPORTS, inputTagsArgs.paxNumber, Number(inputTagsArgs.bound.itemId));
      for (var e = 0; e < 1; e++) {
        var priceInfo = eligGroups[e].priceInfo ? eligGroups[e].priceInfo.totalAmount : 0;
        var singleChoice = {
          serviceCode: srvCode,
          price: priceInfo,
          name: srvName
        };

        var properties = eligGroups[e].eligibilities[0].listProperties;
        var listProperties = [];
        for (var p = 0; p < properties.length; p++) {
          this.__initChoiceData(sportsData, properties[p], singleChoice, inputTagsArgs);
          listProperties.push(properties[p].code);
        }

        sportsData.choices.push(singleChoice);
        //Loop to iterate over the selected/booked services and add them to the itemsList
        for (var s = 0; s < selectedSports.length; s++) {
          var state = this.getAttribute(selectedSports[s], this.SERVICE_STATE);
          if (selectedSports[s].code == singleChoice.serviceCode && state && state != this.STATE_CANCELLED) {
            var itemId = this.__getItemId(sportsData.itemsList, inputTagsArgs.paxNumber - 1, Number(inputTagsArgs.bound.itemId) - 1);
            var selectedChoice = {
              code: singleChoice.serviceCode,
              id: itemId,
              price: singleChoice.price,
              inputTags: singleChoice.NUMBER.inputTags,
              state: state,
              quantity: 0
            };

            var numberProperty = this._catalog.getFirstPropertyFromService(selectedSports[s], this.PTY_NUMBER);
            var inputParams = numberProperty ? numberProperty.inputParams[0] : {};
            if (!this.utils.isEmptyObject(inputParams)) {
              selectedChoice.quantity = inputParams.value;
            }
            if (singleChoice.TYPE) {
              var typeProperty = this._catalog.getFirstPropertyFromService(selectedSports[s], this.PTY_TYPE);
              var inputParams = typeProperty ? typeProperty.inputParams[0] : {};
              if (!this.utils.isEmptyObject(inputParams)) {
                for (var c in singleChoice.TYPE) {
                  if (singleChoice.TYPE[c].code == inputParams.value) {
                    //var itemId = this.__getItemId(sportsData.itemsList, inputTagsArgs.paxNumber-1, Number(inputTagsArgs.bound.itemId)-1);
                    selectedChoice.typeCode = singleChoice.TYPE[c].code;
                    this._catalog.addTags(selectedChoice.inputTags, singleChoice.TYPE[c].inputTags);

                  }
                }
              }
            }
            if (state == this.STATE_BOOKED || state == this.STATE_ADDED) {
              var tempChoice = aria.utils.Json.copy(selectedChoice);
              for (var t in tempChoice.inputTags) {
                var selectionIndex = selectedSports[s].selectionIndex.substring(selectedSports[s].selectionIndex.length - 1)
                var tag = t.replace('[i]', selectionIndex);
                if (tag.indexOf(this.PTY_NUMBER) != -1) {
                  tempChoice.inputTags[tag] = selectedChoice.quantity;
                } else {
                  tempChoice.inputTags[tag] = tempChoice.inputTags[t];
                }
                delete tempChoice.inputTags[t];
              }
              selectedChoice = tempChoice;
            } else {
              selectedChoice = choice;
            }
            sportsData.itemsList.push({
              id: itemId,
              choice: selectedChoice
            });

          }
        }
      }
    },

    /**
     * Initialises the sports data for each of the properties
     */
    __initChoiceData: function(sportsData, pty, singleChoice, inputTagsArgs) {
      var availableValues = this._catalog.getParameterValue(pty, 'VALUE', 'availableValues');
      var fieldType = this._catalog.getParameterValue(pty, 'VALUE', 'fieldType');
      if (!this.utils.isEmptyObject(availableValues)) {
        singleChoice[pty.code] = this.__createTypeChoices(pty, inputTagsArgs, availableValues);
      } else {
        var numberChoice = this.__createChoices(pty, inputTagsArgs);
        singleChoice[pty.code] = numberChoice;
      }

    },

    /**
     * Creates the choices for property with code 'TYPE' and available values
     */

    __createTypeChoices: function(property, inputTagsArgs, availableValues) {
      var typeChoices = [];
      var tags = this.__getInputTags(property, inputTagsArgs.paxNumber, inputTagsArgs.bound, inputTagsArgs.nextIndex);
      for (var a in availableValues) {
        var choice = {
          inputTags: {}
        };
        for (var t in tags) {
          if (!this.$json.isMetadata(t) && t.indexOf("TYPE") != -1) {
            choice.inputTags[t] = a;
          }
        }
        choice.code = a;
        choice.name = availableValues[a];
        typeChoices.push(choice);
      }
      return typeChoices;

    },

    /**
     * Creates a single choice for properties other than TYPE
     */
    __createChoices: function(property, inputTagsArgs) {
      var tags = this.__getInputTags(property, inputTagsArgs.paxNumber, inputTagsArgs.bound, inputTagsArgs.nextIndex, '1');
      var choice = {
        inputTags: tags
      };
      return choice;
    },

    /**
     * Creates the input tags to send for the value of the given property.
     */
    __getInputTags: function(property, paxNumber, bound, nextIndex, value) {
      if (property != undefined) {
        var parameters = property.inputParams;
        var tags = {};
        for (var p = 0; p < parameters.length; p++) {
          var rawTag = parameters[p].inputTag;
          var code = parameters[p].code;
          var tValue;
          if (code === 'VALUE') {
            tValue = value;
          } else {
            //When this is not a VALUE parameter, we try to read the value to send in 'value' field,
            //or if it does not exist we assume that the default value is hard-coded in 'format' field
            if (parameters[p].value) {
              tValue = parameters[p].value;
            } else {
              var format = parameters[p].format;
              if (format) {
                tValue = format.substring(1, format.length - 1);
              } else {
                tValue = this.DEFAULT_UNIT; //If no value, hard-coded value. Please do not hit me it is not my fault. PTR 7346200
              }
            }
          }
          var segments = bound.segments;
          for (var s = 0; s < segments.length; s++) {
            var finalTag = rawTag.replace('[p]', paxNumber).replace('[s]', segments[s].id);
            tags[finalTag] = tValue;
          }
        }
        return tags;
      }
    },

    /**
     * Call-back used by the carousel to tell that a new passenger was selected
     */
    selectPax: function(pId) {
      this.$json.setValue(this.data.sportsData, 'selectedPax', this.data.sportsData.passengers[pId]);
    },


    /**
     * Event handler when the user selects a value in the TYPE drop-down
     */
    setValue: function(evt, args) {
      var sportsData = args.sportsData;
      var id = args.itemId;
      var finalTags = {};
      var currentChoice = {
        id: id,
        quantity: 0
      };
      var value = evt.target.getValue();
      var listChoices = sportsData.choices;
      for (var c in listChoices) {
        if (listChoices[c].serviceCode == value) {
          this._catalog.addTags(finalTags, listChoices[c].NUMBER.inputTags);
          currentChoice.price = listChoices[c].price;
          currentChoice.code = value;
          if (listChoices[c].TYPE) {
            var selectTag = document.getElementById("type_" + id);
            var typeValue = selectTag.options[selectTag.selectedIndex].getAttribute("data-typecode");
            currentChoice.typeCode = typeValue;
            var types = listChoices[c].TYPE;
            for (var t in types) {
              if (types[t].code == typeValue) {
                this._catalog.addTags(finalTags, types[t].inputTags);
                currentChoice.state = args.state;
              }
            }
          } else {
            currentChoice.state = args.state;
          }
        } else {
          currentChoice.state = "";
        }
      }

      var itemsList = sportsData.itemsList;

      /*Loop to set the [i] value in input_Tag_[p]_[s]_[i]*/

      var count = this.countInstances(currentChoice.code, itemsList);
      for (var t in finalTags) {
        if (!this.$json.isMetadata(t) && t.indexOf('i') != -1) {
          var tag = t.replace('[i]', count + 1);
          finalTags[tag] = finalTags[t];
          delete finalTags[t];
        }
      }



      currentChoice.inputTags = finalTags;



      /*Loop to set the tags in case of modification of booked/selected services*/

      for (var i = 0; i < itemsList.length; i++) {
        if (itemsList[i].id == id) {
          if (itemsList[i].choice && itemsList[i].choice.state) {
            for (var t in itemsList[i].choice.inputTags) {
              if (!this.$json.isMetadata(t)) {
                if (itemsList[i].choice.state == this.STATE_BOOKED) /*To set the value of booked sports to 0*/
                  currentChoice.inputTags[t] = "0";
                else if (itemsList[i].choice.state == this.STATE_ADDED) /*To set the value of selected (but not booked) sports to null*/
                  currentChoice.inputTags[t] = null;
              }

            }
          } else {
            if (itemsList[i].choice) {
              for (var t in itemsList[i].choice.inputTags) {
                if (itemsList[i].choice.inputTags[t] == "0" && !this.$json.isMetadata(t))
                  currentChoice.inputTags[t] = "0";
              }
            }
          }
          itemsList[i].choice = currentChoice;
        }
      }

      this.$json.setValue(sportsData, 'itemsAddedVar', !sportsData.itemsAddedVar); /*To refresh the dropdown values*/
      this._setDisableContinue();
    },
    /**
     * Function to count the number of equipments of a given SSR code already selected
     */
    countInstances: function(code, itemsArray) {
      var count = 0;
      for (var i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].choice && code == itemsArray[i].choice.code)
          count++;
      }
      return count;
    },

    /**
     * Event handler when the user selects a value in the NUMBER drop-down
     */

    setNumberValue: function(evt, args) {
      var sportsData = args.sportsData;
      var currentChoice = null;
      var value = evt.target.getValue();
      var id = args.id;
      var itemsList = args.sportsData.itemsList;
      for (var i = 0; i < itemsList.length; i++) {
        if (itemsList[i].id == id) {
          itemsList[i].choice.quantity = value;
          var choiceTags = itemsList[i].choice.inputTags;
          for (var t in choiceTags) {
            if (!this.$json.isMetadata(t) && t.indexOf(this.PTY_NUMBER) != -1 && choiceTags[t] != null) {
              choiceTags[t] = value;
            }
          }
          currentChoice = itemsList[i].choice;
        }
      }
      this.$json.setValue(sportsData, 'current', currentChoice);
    },

    /**
     * Updates the state of the 'Confirm' button, so that it is enabled only if something is selected
     */
    _setDisableContinue: function() {
      var disable = true;
      var passengers = this.data.sportsData.passengers;
      for (var p = 0; p < passengers.length; p++) {
        var bounds = passengers[p].bounds;
        for (var b = 0; b < bounds.length; b++) {
          if (bounds[b].available && bounds[b].itemsList.length > 0) {
            var items = bounds[b].itemsList;
            for (var i = 0; i < items.length; i++) {
              var current = items[i].choice;
              if (!this.data.disableModif) {
                disable = false;
                break;
              } else {
                if (current.state != this.STATE_BOOKED && current && current.code != "") {
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
    },
    /**
     * Event handler when the user clicks on confirm.
     * Reads all the input tags from the bagData and replaces as required the value with the user inputs.
     */
    confirm: function(evt) {
      var inputTags = {};
      var passengers = this.data.sportsData.passengers;
      for (var p = 0; p < passengers.length; p++) {
        var bounds = passengers[p].bounds;
        for (var b = 0; b < bounds.length; b++) {
          var sportsItemsList = bounds[b].itemsList;
          for (var i in sportsItemsList) {
            if (sportsItemsList[i].choice && sportsItemsList[i].choice.state != this.STATE_BOOKED) {
              this._catalog.addTags(inputTags, sportsItemsList[i].choice.inputTags);
            }
          }
        }
      }

      this.moduleCtrl.updateBasket(this.CATEGORY_SPORTS, inputTags, {
        fn: this.__errorCallback,
        scope: this
      });
    },

    __errorCallback: function(reply) {
      var messages = this.utils.readBEErrors(reply.errors);
      this.$json.setValue(this.data, 'messages', messages);

    },

    /**
     * Event handler when user clicks on Add button
     */

    addItems: function(evt, args) { //args=[boundId, segment_index, paxObject, selectedChoices]
      var pax = args[1];
      var itemsAddedVar = pax.bounds[args[0]].itemsAddedVar;
      var arr = pax.bounds[args[0]].itemsList;
      var itemId = this.__getItemId(arr, pax.paxId, args[0]);
      arr.push({
        id: itemId
      });
      this.$json.setValue(this.data.sportsData.selectedPax.bounds[args[0]], 'itemsList', arr);
      this.$json.setValue(this.data.sportsData.selectedPax.bounds[args[0]], 'itemsAddedVar', !itemsAddedVar);
    },

    /**
     * Utility method to get the id of each added item dynamically
     */
    __getItemId: function(items, paxId, bound_index) {
      // var cardinality=this.data.sportsData.selectedPax.bounds[bound_index].maxCardinality;
      var cardinality = 5;
      var itemNumber = 0;
      for (var i = 0; i < cardinality; i++) {
        if (items.length > 0) {
          if (items[i] != undefined) {
            if (i != parseInt(items[i].id.substr(9, 1))) {
              itemNumber = i;
              break;
            }
          } else {
            itemNumber = i;
            break;
          }
        }
      }

      return 'itemp' + paxId + 'b' + bound_index + 'i' + itemNumber;
    },

    /**
     * Event handler when user clicks on the cross button
     */
    __deleteItems: function(evt, id) {
      var bound_index = id.substr(7, 1);
      var itemsAddedVar = this.data.sportsData.selectedPax.bounds[bound_index].itemsAddedVar;
      var arr = this.data.sportsData.selectedPax.bounds[bound_index].itemsList;
      this.moduleCtrl.deleteItem(arr, id);
      this.$json.setValue(this.data.sportsData.selectedPax.bounds[bound_index], 'itemsAddedVar', !itemsAddedVar);
      this._setDisableContinue();
    },

    getChoiceCardinality: function(bound_index) {
      var boundData = this.data.sportsData.selectedPax.bounds[bound_index];
      var maxCardinality = boundData.maxCardinality;
      var numOfTypes = 0;
      for (var c in boundData.choices) {
        if (choice.types) {
          numOfTypes = choice.types.length;
          break;
        }
      }
      if (numOfTypes != 0) {
        maxCardinality = numOfTypes;
      }
      return maxCardinality;
    },

    /**
     * Utility method to get a particular attribute of the service selected
     */

    getAttribute: function(service, attrType) {
      var value;
      var attributes = service.attributes;
      for (var a = 0; a < attributes.length; a++) {
        if (attributes[a].type === attrType) {
          value = attributes[a].value;
          break;
        }
      }
      return value;
    },
    /**
     * Method to get the total number of sports equipments selected
     */
    getTotalItems: function(sportsData) {
      var totalQuantity = 0;
      for (var i = 0; i < sportsData.itemsList.length; i++) {
        if (sportsData.itemsList[i].choice)
          totalQuantity = totalQuantity + Number(sportsData.itemsList[i].choice.quantity);
      }
      return totalQuantity;
    },
    /**
     * Method to get the total price of all the  sports equipments selected
     */
    getTotalPrice: function(sportsData) {
      var totalPrice = 0.0;
      for (var i = 0; i < sportsData.itemsList.length; i++) {
        if (sportsData.itemsList[i].choice)
          totalPrice = totalPrice + (sportsData.itemsList[i].choice.price * sportsData.itemsList[i].choice.quantity);
      }
      return totalPrice;
    }
  }
});