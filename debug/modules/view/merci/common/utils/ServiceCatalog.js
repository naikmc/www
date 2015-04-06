/**
 * Class encapsulating the JSON bean of a selection of ancillary services.
 * Can be used to read the section SERVICE_SELECTION of the TripPlanOutput or the ComputeServiceSelectionOuput
 */
Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.ServiceCatalog',
	$dependencies: ['aria.utils.Json'],

	$statics: {
		ASSO_SEG: 'SEG',
		ASSO_ELE: 'ELE'
	},

	/**
	 * Merges the given json selection with instance being constructed, so that the data of json can be accessed in the same way
	 * @param itineraries - Air itineraries used to compute service associations
	 */
	$constructor: function(jsonCatalog, itineraries) {
		this._itineraries = itineraries;
		for (var member in jsonCatalog) {
			if (jsonCatalog.hasOwnProperty(member) && !aria.utils.Json.isMetadata(member)) {
				this[member] = jsonCatalog[member];
			}
		}
	},

	$prototype: {

		/**
		 * Similar to getEligibilityGroups(), but returns service objects instead of eligibility groups (with no duplicate)
		 */
		getServices: function(categoryCode, paxNumber, boundId, segmentId) {
			var result = [];
			if (categoryCode !== null) {
				var category = this.getCategory(categoryCode);
				if (category) {
					result = result.concat(this._getServicesFromCategory(category, paxNumber, boundId, segmentId));
				}
			} else {
				for (var c = 0; c < this.categories.length; c++) {
					result = result.concat(this._getServicesFromCategory(category, paxNumber, boundId, segmentId));
				}
			}
			return result;
		},

		/**
		 * Similar to getEligibilityGroupsFromService(), but operates from whole catalogue and with additional category criterion
		 */
		getEligibilityGroups: function(categoryCode, paxNumber, boundId, segmentId) {
			var result = [];
			if (categoryCode !== null) {
				var category = this.getCategory(categoryCode);
				if (category) {
					result = result.concat(this.getEligibilityGroupsFromCategory(category, paxNumber, boundId, segmentId));
				}
			} else {
				for (var c = 0; c < this.categories.length; c++) {
					result = result.concat(this.getEligibilityGroupsFromCategory(category, paxNumber, boundId, segmentId));
				}
			}
			return result;
		},

		/**
		 * Similar to getEligibilityGroupsFromCategory(), but returns service objects instead of eligibility groups (with no duplicate)
		 */
		_getServicesFromCategory: function(category, paxNumber, boundId, segmentId) {
			var result = [];
			var services = category.services;
			for (var s = 0; s < services.length; s++) {
				var groups = this.getEligibilityGroupsFromService(services[s], paxNumber, boundId, segmentId);
				if (groups.length > 0) {
					result.push(services[s]);
				}
			}
			return result;
		},

		/**
		 * Similar to getEligibilityGroupsFromService(), but operates from the given category object (covering all the services of the category)
		 */
		getEligibilityGroupsFromCategory: function(category, paxNumber, boundId, segmentId) {
			var result = [];
			var services = category.services;
			for (var s = 0; s < services.length; s++) {
				var groups = this.getEligibilityGroupsFromService(services[s], paxNumber, boundId, segmentId);
				result = result.concat(groups);
			}
			return result;
		},

		/**
		 * Returns the array of eligibility groups from the given service that match the given parameters.
		 * Each parameter may be null, in which case the parameter is not taken into account for the match
		 * @param service - service object in which the eligibilities are searched
		 * @param paxNumber - e-retail passenger id
		 * @param boundId - e-retail bound id. Eligibilities that are not bound-associated will not match
		 * @param segmentId - e-retail segment id, assuming that the service is segment-associated. Eligibilities that cover more than this segment will match
		 * @return the array of groups, or an empty array if there is no match
		 */
		getEligibilityGroupsFromService: function(service, paxNumber, boundId, segmentId) {
			var result = [];
			var groups = service.eligibilityGroups;
			if (paxNumber == null && boundId == null && segmentId == null) {
				result = result.concat(groups);
			} else if (boundId == null || service.associationMode === this.ASSO_ELE) {
				for (var g = 0; g < groups.length; g++) {
					if (this.__matchEligibilityGroup(groups[g], paxNumber, boundId, segmentId)) {
						result.push(groups[g]);
					}
				}
			}
			return result;
		},

		/**
		 * Matches the given eligibility group against the given criteria.
		 * All criteria are optional, they are ignored for the match when they are null
		 * @param paxNumber - matches if equals to the first passenger of the group (assumes that the group is associated to one pax)
		 * @param boundId - matches if equals to the first associated element (assumes that the group is bound-associated and to one bound only)
		 * @param segmentId - matches if equals to one of the associated elements (assumes that the group is segment-associated)
		 * N.B.: With logic described above, it does not make sense to give both boundId and segmentId
		 */
		__matchEligibilityGroup: function(eligGroup, paxNumber, boundId, segmentId) {
			var eligibility = eligGroup.eligibilities[0];
			var match = (boundId == null || boundId === eligibility.elementIds[0]);
			match = match && (segmentId == null || eligibility.elementIds.indexOf(segmentId) >= 0);
			match = match && (paxNumber == null || paxNumber === eligibility.passengerIds[0]);
			return match;
		},

		/**
		 * Returns the category object that has the given code, or undefined if it does not exist
		 */
		getCategory: function(categoryCode) {
			var category;
			if (this.categories) {
				for (var c = 0; c < this.categories.length; c++) {
					if (this.categories[c].code === categoryCode) {
						category = this.categories[c];
						break;
					}
				}
			}
			return category;
		},

		/**
		 * Returns the property from the first eligibility of the given group, that has the given property code,
		 * or undefined if it does not exist
		 */
		getFirstProperty: function(eligibilityGroup, propertyCode) {
			var property;
			if (eligibilityGroup) {
				var eligibility = eligibilityGroup.eligibilities[0];
				for (var p = 0; p < eligibility.listProperties.length; p++) {
					if (eligibility.listProperties[p].code === propertyCode) {
						property = eligibility.listProperties[p];
						break;
					}
				}
			}
			return property;
		},

		getFirstPropertyFromService: function(service, propertyCode) {
			var property;
			if (service) {
				var listProperties = service.listProperties;
				for (var p = 0; p < listProperties.length; p++) {
					if (listProperties[p].code === propertyCode) {
						property = listProperties[p];
						break;
					}
				}
			}
			return property;
		},
		/**
		 * Returns property.inputParameter{code==parameterCode}[field], or undefined if does not exist
		 * @param parameterCode - optional, defaults to 'VALUE'
		 * @param field - option, default to 'value'
		 */
		getParameterValue: function(property, parameterCode, field) {
			var max;
			parameterCode = parameterCode || 'VALUE';
			field = field || 'value';
			if (property) {
				var parameters = property.inputParams || [];
				for (var p = 0; p < parameters.length; p++) {
					if (parameters[p].code === parameterCode) {
						max = parameters[p][field];
						break;
					}
				}
			}
			return max;
		},

		/**
		 * Returns the currency code used in the catalogue prices, assuming that all the prices use the same currency
		 */
		getCurrency: function() {
			if (this.categories == null) {
				return '';
			}
			for (var c = 0; c < this.categories.length; c++) {
				var services = this.categories[c].services;
				for (var s = 0; s < services.length; s++) {
					var groups = services[s].eligibilityGroups;
					for (var g = 0; g < groups.length; g++) {
						if (groups[g].priceInfo && groups[g].priceInfo.currency) {
							return groups[g].priceInfo.currency.code;
						}
					}
				}
			}
			return '';
		},
		/**
		 * Returns an aray of properties which are to be sent mandatorily in order to add the service.
		 */
		getMandatoryProperties: function(eligGroup) {
			var properties = [];
			if (eligGroup) {
				var eligibility = eligGroup.eligibilities[0];
				for (var p = 0; p < eligibility.listProperties.length; p++) {
					if (eligibility.listProperties[p].requiredLevel === "MANDATORY") {
						properties.push(eligibility.listProperties[p]);
					}
				}
			}
			return properties;
		},
		addTags: function(object, inputTags) {
			for (var tag in inputTags) {
				if (!aria.utils.Json.isMetadata(tag)) {
					object[tag] = inputTags[tag];
				}
			}
		}
	}
});