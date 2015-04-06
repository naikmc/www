   /* --------------------------------------------------------------------------------*/
  /*                      ReConstructCPR - MAIN JAVASCRIPT                            */
  /* --------------------------------------------------------------------------------*/

  Aria.classDefinition({
  	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.ReConstructCPR',
  	$dependencies: [],

  	$prototype: {

  		modifiedResponse: function(data) {

  			var res = {};

  			for (var jrny in data.functionalContent.journeies) {
  				var jrny = data.functionalContent.journeies[jrny];
  				res[jrny.journeyLocalID] = {};

  				//Flight detail construction
  				for (var prod in jrny.flightIDs) {
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]] = this.getFlightPaxInfo(data.functionalContent.flights, jrny.flightIDs[prod]);

  					res[jrny.journeyLocalID].journeyID = jrny.journeyLocalID;

  					//arrival airport location
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].arrivalAirport.airportLocation = this.getAirportLocation(data.functionalContent.airportLocations, res[jrny.journeyLocalID][jrny.flightIDs[prod]].arrivalAirport.locationCode);

  					//arrival airport location
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].departureAirport.airportLocation = this.getAirportLocation(data.functionalContent.airportLocations, res[jrny.journeyLocalID][jrny.flightIDs[prod]].departureAirport.locationCode);

  					//timings
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].timings = this.getTimeInfo(data.functionalContent.timings, jrny.flightIDs[prod]);
  					var sat = null;
  					var sdt = null;
  					var sbt = null;
  					for (var prdBean_index in data.productDetailsBeans) {
  						if (data.productDetailsBeans[prdBean_index].flightId == jrny.flightIDs[prod]) {
  							sat = data.productDetailsBeans[prdBean_index].arrivalTime;
  							sdt = data.productDetailsBeans[prdBean_index].departureTime;
  							sbt = data.productDetailsBeans[prdBean_index].boardingTime;
  						}
  					}
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].timings.SAT.time = sat;
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].timings.SDT.time = sdt;
  					if (sbt != undefined) {
  						res[jrny.journeyLocalID][jrny.flightIDs[prod]].timings.SBT.time = sbt;
  					}

  					//leg
  					res[jrny.journeyLocalID][jrny.flightIDs[prod]].leg = this.getLegInfo(data.functionalContent.legs, jrny.flightIDs[prod]);

  					//firstflightid for identify origin of journey
  					if (prod == "0") {
  						res[jrny.journeyLocalID].firstflightid = jrny.flightIDs[prod];
  					}

  					//lastflightid for identify destination of journey
  					if (prod == jrny.flightIDs.length - 1) {
  						res[jrny.journeyLocalID].lastflightid = jrny.flightIDs[prod];
  					}



  				}

  				//Pax detail construction
  				for (var pax in jrny.passengerIDs) {
  					res[jrny.journeyLocalID][jrny.passengerIDs[pax]] = this.getFlightPaxInfo(data.functionalContent.passengers, jrny.passengerIDs[pax]);
  					res[jrny.journeyLocalID][jrny.passengerIDs[pax]].contactDetails = this.getContactInfo(data, jrny.passengerIDs[pax]);
  					res[jrny.journeyLocalID][jrny.passengerIDs[pax]].frequentFlyer = this.getFrequentFlyerInfo(data, jrny.passengerIDs[pax]);

  				}

  				/*
  				 *Id for flight list, can be used in trip list page
  				 */
  				res[jrny.journeyLocalID].flightList = jrny.flightIDs;

  				/*
  				 *Id for Pax list
  				 */
  				res[jrny.journeyLocalID].paxList = jrny.passengerIDs;

  				/*
  				 * All beans are key based so can access directly without loops
  				 */
  				//status bean
  				res[jrny.journeyLocalID].status = this.getStatus(data);

  				//ticket status
  				res[jrny.journeyLocalID].ticket = this.getTicket(data);

  				//Seat status
  				res[jrny.journeyLocalID].seat = this.getSeat(data);

  				//service status
  				res[jrny.journeyLocalID].service = this.getService(data);

  				//eligibility status
  				res[jrny.journeyLocalID].eligibility = this.getEligibility(data);

  				//eligibility status
  				res[jrny.journeyLocalID].cabinInformation = this.getCabinInformation(data);

  				//associated Products
  				res[jrny.journeyLocalID].associatedProducts = this.getAssociatedProducts(data);


  				//Product details bean
  				res[jrny.journeyLocalID].productDetailsBeans = this.getProductDetailBean(data.productDetailsBeans,res[jrny.journeyLocalID]);

  				//Customer Details bean
  				res[jrny.journeyLocalID].customerDetailsBeans = this.getCustomerDetailBean(data.customerDetailsBeans);

  				res[jrny.journeyLocalID].bookingInformations = this.getBookingInformation(data.functionalContent.bookingInformations);

  				res[jrny.journeyLocalID].retrPannelReq = data.retrPannelReq;
  				res[jrny.journeyLocalID].childCount = data.childCount;
  				res[jrny.journeyLocalID].regChkRequired = data.regChkRequired;
  				res[jrny.journeyLocalID].adultCount = data.adultCount;
  				res[jrny.journeyLocalID].allCheckedIn = data.allCheckedIn;
  				res[jrny.journeyLocalID].onePaxCheckedIn = data.onePaxCheckedIn;
  				res[jrny.journeyLocalID].infantCount = data.infantCount;

  			}


  			return res;

  		},
  		getBookingInformation: function(item) {
  			var data = {};
  			for (var i in item) {
  				data[item[i].passengerID] = item[i];
  			}
  			return data;
  		},

  		getCustomerDetailBean: function(item) {
  			var data = {};
  			for (var i in item) {
  				data[item[i].passengerId] = item[i];
  			}
  			return data;
  		},

  		getProductDetailBean: function(item,cpr) {

  			var data = {};



  			for (var i in item) {
  				/*IATCI Malipulating Values in ProductDetailsBeans for IATCI Segments only which are Not Prime Segments*/
  				if(item[i].IATCI_Flight && cpr.firstflightid != item[i].flightId){
  					item[i].acceptanceAllowed = true;
  					item[i].flightOpen = true;
  					item[i].primeFlightEligible = true;
  					item[i].seatChangeAllowed = true;
  				}
  				/*IATCI Malipulating Values in ProductDetailsBeans for IATCI Segments only*/
  				data[item[i].passengerId + item[i].flightId] = item[i];
  				//To Take the product detail bean of only Non Infant
  				if(!jQuery.isUndefined(cpr[item[i].passengerId]) && cpr[item[i].passengerId].passengerTypeCode != "INF"){
  				data[item[i].flightId] = item[i];
  				}
  			}
  			return data;
  		},

  		getFlightPaxInfo: function(item, key) {
  			for (var i in item) {
  				if (item[i].ID == key) {
  					return item[i];
  				}
  			}
  		},

  		getContactInfo: function(data, paxID) {
  			var contactDetails = [];
  			item = data.functionalContent.contactDetails
  			for (var i in item) {
  				if (item[i].passengerID == paxID) {
  					contactDetails.push(item[i]);
  				}
  			}
  			return contactDetails;
  		},

  		getFrequentFlyerInfo: function(data, paxID) {
  			var freqFlyer = [];
  			item = data.functionalContent.frequentFlyers;
  			for (var i in item) {
  				if ((item[i].referenceIDProductPassengerID != undefined && item[i].referenceIDProductPassengerID == paxID) || ((item[i].referenceIDPassengerID != undefined && item[i].referenceIDPassengerID == paxID))) {
  					freqFlyer.push(item[i]);
  				}
  			}
  			return freqFlyer;
  		},

  		getAirportLocation: function(item, key) {

  			for (var i in item) {
  				if (item[i].airportCodeID && item[i].airportCodeID == key) {
  					return item[i];
  				}
  			}

  		},

  		getTimeInfo: function(item, key) {
  			var prodSpecificList = {};
  			for (var i in item) {
  				if (item[i].referenceIDFlightID && item[i].referenceIDFlightID == key) {
  					prodSpecificList[item[i].type.code] = item[i];
  				}
  			}
  			return prodSpecificList;
  		},

  		getLegInfo: function(item, key) {
  			var prodSpecificList = [];
  			for (var i in item) {
  				if (item[i].flightID && item[i].flightID == key) {
  					prodSpecificList.push(item[i]);
  				}
  			}
  			return prodSpecificList;
  		},

  		getTicket: function(data) {
  			var item = data.functionalContent.tickets;
  			var temp = {};
  			for (var i in item) {
  				var key = item[i].referenceIDProductPassengerID + item[i].referenceIDProductFlightID;
  				//temp.key={};
  				temp[key] = item[i];
  			}

  			return temp;
  		},

  		getSeat: function(data) {
  			var item = data.functionalContent.seats;
  			var temp = {};
  			for (var i in item) {
  				var key = item[i].referenceIDLegPassengerPassengerID + item[i].referenceIDLegPassengerLegID + item[i].status.listCode;
  				//temp.key={};
  				temp[key] = item[i];
  			}

  			return temp;
  		},

  		getService: function(data) {
  			var item = data.functionalContent.services;
  			var temp = {};
  			for (var i in item) {
  				var key = item[i].referenceIDProductPassengerID + item[i].referenceIDProductFlightID + item[i].services[0].SSRCode;
  				//temp.key={};
  				temp[key] = item[i];
  			}

  			return temp;
  		},

  		getEligibility: function(data) {
  			var item = data.functionalContent.eligibilities;
  			var temp = {};
  			for (var i in item) {
  				/*PAXID+FLIGHTID+code*/
  				var key = item[i].referenceIDProductPassengerID + item[i].referenceIDProductFlightID + item[i].type.code;
  				//temp.key={};
  				temp[key] = item[i];

  				/*PAX ID+code*/
  				var key = item[i].referenceIDProductPassengerID + item[i].type.code;
  				//temp.key={};
  				temp[key] = item[i];

  				/*FLIGHT ID+code*/
  				var key = item[i].referenceIDProductFlightID + item[i].type.code;
  				//temp.key={};
  				temp[key] = item[i];
  			}

  			return temp;
  		},

  		getCabinInformation: function(data) {
  			var item = data.functionalContent.cabinInformations;
  			var temp = {};
  			temp.product = {};
  			temp.legPassenger = {};
  			for (var i in item) {
  				if (item[i].referenceIDProductProductID) {
  					var key = item[i].referenceIDProductPassengerID + item[i].referenceIDProductFlightID;
  					//temp.key={};
  					temp.product[key] = item[i];
  				}
  				if (item[i].referenceIDLegPassengerPassengerID) {
  					var key = item[i].referenceIDLegPassengerPassengerID + item[i].referenceIDLegPassengerLegID;
  					//temp.key={};
  					temp.legPassenger[key] = item[i];
  				}
  			}

  			return temp;
  		},

  		getStatus: function(data) {
  			var item = data.functionalContent.status;
  			var temp = {};
  			temp.paxStatus = {};
  			temp.prodStatus = {};
  			temp.legPassenger = {};
  			temp.flight = {};
  			temp.leg = {};
  			for (var i in item) {
  				if (item[i].referenceIDPassengerID) {
  					var key = item[i].referenceIDPassengerID + item[i].status[0].listCode;
  					//temp.key={};
  					temp.paxStatus[key] = item[i];
  				}
  				if (item[i].referenceIDProductProductID) {
  					var key = item[i].referenceIDProductPassengerID + item[i].referenceIDProductFlightID + item[i].status[0].code;
  					//temp.key={};
  					temp.prodStatus[key] = item[i];
  				}
  				if (item[i].referenceIDLegPassengerPassengerID) {
  					var key = item[i].referenceIDLegPassengerPassengerID + item[i].referenceIDLegPassengerLegID + item[i].status[0].listCode;
  					//temp.key={};
  					temp.legPassenger[key] = item[i];
  				}
  				if (item[i].referenceIDFlightID) {
  					var key = item[i].referenceIDFlightID + item[i].status[0].listCode;
  					//temp.key={};
  					temp.flight[key] = item[i];
  				}
  				if (item[i].referenceIDLegID) {
  					var key = item[i].referenceIDLegID + item[i].status[0].listCode;
  					//temp.key={};
  					temp.leg[key] = item[i];
  				}
  			}
  			return temp;
  		},
  		getAssociatedProducts: function(data) {
  			var item = data.functionalContent.associatedProducts;
  			var temp = {};
  			for (var i in item) {
  				var key = item[i].linkedProduct;
  				//temp.key={};
  				temp[key] = item[i];
  			}

  			return temp;
  		}

  	}
  });