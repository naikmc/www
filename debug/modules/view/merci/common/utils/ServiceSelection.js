/**
 * Class encapsulating the JSON bean of a selection of ancillary services.
 * Can be used to read the section SERVICE_SELECTION of the TripPlanOutput or the ComputeServiceSelectionOuput
 */
Aria.classDefinition({
	$classpath: 'modules.view.merci.common.utils.ServiceSelection',
	$dependencies: ['aria.utils.Json'],

	$statics: {
		ASSO_SEG: 'SEG',
		ASSO_ELE: 'ELE',

		STATE: 'STATE',
		STATE_INITIAL: 'INITIAL',
		STATE_ADDED: 'ADDED',
		STATE_CANCELLED: 'CANCELLED'
	},

	/**
	 * Merges the given json selection with instance being constructed, so that the data of json can be accessed in the same way
	 * @param itineraries - Air itineraries used to compute service associations
	 */
	$constructor: function(jsonSelection, itineraries) {
		this._itineraries = itineraries;
		for (var member in jsonSelection) {
			if (jsonSelection.hasOwnProperty(member) && !aria.utils.Json.isMetadata(member)) {
				this[member] = jsonSelection[member];
			}
		}
	},

	$prototype: {

		/**
		 * Returns the array of services that match the given parameters.
		 * Each parameter may be null, in which case the parameter is not taken into account for the match
		 * @param category - category code
		 * @param paxNumber - e-retail passenger id
		 * @param boundId - e-retail bound id. All services that are segment-associated to a segment of the given bound will match
		 * @param segmentId - e-retail segment id. Services that cover more than the segment will match
		 * @param state - e-retail state (c.f STATE_* in $statics)
		 */
		getServices: function(category, paxNumber, boundId, segmentId, state) {
			var services = this.selectedServices || [];
			var result = [];
			for (var s = 0; s < services.length; s++) {
				var service = services[s];
				var match = (category == null || category === service.category || (category==service.code));
				match = match && (paxNumber == null || (service.passengerIds.indexOf(paxNumber) >= 0));
				match = match && (boundId == null || this.getBoundId(service) === boundId);
				match = match && (segmentId == null || this.getSegmentIds(service).indexOf(segmentId) >= 0);
				match = match && (state == null || this.getAttribute(service, this.STATE) === state);
				if (match) {
					result.push(service);
				}
			}
			return result;
		},

		/**
		 * Returns the value of service attribute with the given type, or undefined if it does not exist.
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
		 * Returns the value of the parameter with the given parameterCode from the given service and propertyCode,
		 * or undefined if this property does not exist.
		 * @parameterCode - optional, if not provided default value 'VALUE' is used.
		 */
		getPropertyValue: function(service, propertyCode, parameterCode) {
			parameterCode = parameterCode || 'VALUE';
			var property = this.getProperty(service, propertyCode);
			return this.getParameterValue(property, parameterCode);
		},

		/**
		 * Returns the service property object that has the given propertyCode,
		 * or undefined if this property does not exist
		 */
		getProperty: function(service, propertyCode) {
			var property;
			if (service && propertyCode) {
				var properties = service.listProperties || [];
				for (var p = 0; p < properties.length; p++) {
					if (properties[p].code === propertyCode) {
						property = properties[p];
						break;
					}
				}
			}
			return property;
		},

		/**
		 * Returns the value of the property parameter that has the given parameterCode,
		 * or undefined if this parameter does not exist.
		 */
		getParameterValue: function(property, parameterCode) {
			var value;
			if (property && parameterCode) {
				var parameters = property.inputParams || [];
				for (var p = 0; p < parameters.length; p++) {
					if (parameters[p].code === parameterCode) {
						value = parameters[p].value;
						break;
					}
				}
			}
			return value;
		},

		/**
		 * Sums the values of the given property code for all the given services
		 * If services is empty or if they have not the given property, 0 is returned.
		 */
		getTotalProperty: function(services, propertyCode) {
			var total = 0;
			for (var s = 0; s < services.length; s++) {
				total += Number(this.getPropertyValue(services[s], propertyCode)) || 0;
			}
			return total;
		},

		/**
		 * Returns the sum of total prices of given services
		 */
		getTotalPrice: function(services) {
			var total = 0;
			for (var s = 0; s < services.length; s++) {
				if (services[s].price) {
					total += services[s].price.totalAmount || 0;
				}
			}
			return total;
		},

		/**
		 * If the service is bound-associated, returns the id of the bound to which the given service is associated.
		 * If the service is segment-associated, returns the id of the bound of which the segment is part.
		 */
		getBoundId: function(service) {
			var bound;
			if (service.selectionAssociationMode === this.ASSO_ELE) {
				bound = service.elementIds[0];
			} else if (service.selectionAssociationMode === this.ASSO_SEG) {
				bound = this._getBoundOfSegment(service.elementIds[0]);
			}
			return bound;
		},

		/**
		 * If the service is segment-associated, returns an array with the id of the segment to which the service is associated
		 * If the service is bound-associated, returns an array with the segmentIds of the bound to which the service is associated
		 */
		getSegmentIds: function(service) {
			var segmentIds;
			if (service.selectionAssociationMode === this.ASSO_ELE) {
				segmentIds = this._getSegmentsOfBound(service.elementIds[0]);
			} else if (service.selectionAssociationMode === this.ASSO_SEG) {
				segmentIds = [service.elementIds[0]];
			}
			return segmentIds;
		},

		/**
		 * Returns an array with the segment IDs of the given bound,
		 * or an empty array if the bound does not exist
		 */
		_getSegmentsOfBound: function(boundId) {
			var segmentIds = [];
			for (var i = 0; i < this._itineraries.length; i++) {
				if (boundId === Number(this._itineraries[i].itemId)) {
					var segments = this._itineraries[i].segments;
					for (var s = 0; s < segments.length; s++) {
						segmentIds.push(segments[s].id);
					}
					break;
				}
			}
			return segmentIds;
		},

		/**
		 * Returns the id (as a Number) of the bound that the given segment is part of.
		 */
		_getBoundOfSegment: function(segId) {
			var boundId;
			for (var i = 0; i < this._itineraries.length; i++) {
				var segments = this._itineraries[i].segments;
				for (var s = 0; s < segments.length; s++) {
					if (segId === segments[s].id) {
						boundId = Number(this._itineraries[i].itemId);
						break;
					}
				}
			}
			return boundId;
		}

	}
});