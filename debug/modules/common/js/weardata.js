var WearData = {

	//This Method gets called when smart watch requests data
	SendData : function () {
		
       this.sendTripData();
	
	},
	
	//Creates trip List and Trip Details json and sends through Wear Plugin
	sendTripData : function () {
	    	var that = this;
	    	var jsonResponse = {};
	    	var jsonObj = [];
	    	//Method to retrieve data from trip list from database
	    	modules.view.merci.common.utils.MCommonScript.getStoredItemFromDevice(merciAppData.DB_TRIPLIST, function (result) {
				if (result != null && result != '') {
					if (typeof result === 'string') {
					result = JSON.parse(result);
					
					}
					
				if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(result)) {
						jsonResponse = result;
						
						 //Loop through array of trip List
						for (var key in jsonResponse.detailArray) {
							var pnrData = jsonResponse.detailArray[key];
							var formattedDepartureDate = pnrData.BDate;
							formattedDepartureDate = formattedDepartureDate.split(" ");
							var formattedDepartureTime = formattedDepartureDate[3].split(":");
							
								//Segment for tripList
								var tripObj = {
									recLoc: pnrData.recLoc,
		            				lastName:pnrData.lastName,
		            				departureLocation: {
		            					cityCode:pnrData.BCityCode,
										cityName:pnrData.BCityName
									},
		             				departureDate : {
		             					date: formattedDepartureDate[2] + " "+formattedDepartureDate[1]+" "+formattedDepartureDate[5],
										time: formattedDepartureTime[0] + ":"+formattedDepartureTime[1]
									},
		             				arrivalLocation: {
										cityCode:pnrData.ECityCode,
										cityName:pnrData.ECityName
									},
		             				arrivalDate: {
										date: "",
										time: ""
									}
								};
							
							jsonObj.push(tripObj);


						}
						
					var tripListObj = {
						tripList:jsonObj
					};
						
					
						console.log("Final Trip List :"+JSON.stringify(tripListObj));
						
						//Plugin call to send Trip List data to SmartWatch App
					    var wearSuccess = function (message) {console.log('SendDataToWear success ' + message);};
          			 	var wearFailure = function (message) {console.log('SendDataToWear failure ' + message);};
          			 	WearPlugin.sendDataToWear(tripListObj, "/message_wear_trip_list", wearSuccess, wearFailure);
						
						that.sendTripDetails(jsonObj);
						
						
					} else {
						alert("Unable to load app data. Please check your network settings and try again later.");
						//window.navigator.app.exitApp();
					}
					
				} else {
					//alert("Unable to load app data. Please check your network settings and try again later.");
				}
			});
	    	
	 },
	 
	 //Create trip details details Json and send through Wear Plugin
	 sendTripDetails : function(tripListObj) {
		 
		 var that = this;
	    	var jsonResponse = {};
	    	var BPArray = [];
	    	var finalBPArray = [];
	    	//Method to retrieve data from trip list from database
	    	modules.view.merci.common.utils.MCommonScript.getStoredItemFromDevice(merciAppData.DB_BOARDINGPASS, function (result) {
				if (result != null && result != '') {
					if (typeof result === 'string') {
					result = JSON.parse(result);
					
					}
					
				if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(result)) {
						jsonResponse = result;
						
						 //Loop through array of boarding pass
						for (var key in jsonResponse.boardingPassArray) {
							
							if(jsonResponse.boardingPassArray.hasOwnProperty(key)) {
								
								var pnrData = jsonResponse.boardingPassArray[key];
								var formattedDoc = pnrData.formattedDocument;
								var encodedArray = formattedDoc.base64Binary;
								
								var decodedHTMLData= String.fromCharCode.apply(null, encodedArray);
								decodedHTMLData = decodedHTMLData.replace("/\"", "\"");
								decodedHTMLData = decodedHTMLData.replace(/\s/g,'');
								
								var startIndex = decodedHTMLData.indexOf("png;base64,");
								var bpImgData = decodedHTMLData.substring(startIndex+11);
								var endIndex = bpImgData.indexOf("\"/>");
								//Final boarding pass qr code in encoded format
								bpImgData = bpImgData.substring(0,endIndex);
								
								startIndex = decodedHTMLData.indexOf("Gate:</span><spanclass=\"data\">");
								var bpGateData = decodedHTMLData.substring(startIndex+30);
								endIndex = bpGateData.indexOf("</span>");
								//Set the final gate number for the boarding pass
								bpGateData = bpGateData.substring(0,endIndex);
								
								startIndex = decodedHTMLData.indexOf("Boarding:</span><timeclass=\"hour\"datetime=\"");
								var bpBoardTimeData = decodedHTMLData.substring(startIndex+43);
								endIndex = bpBoardTimeData.indexOf("\">");
								//Set the final gate number for the boarding pass
								bpBoardTimeData = bpBoardTimeData.substring(0,endIndex);
								
								//Set the final seat number for the boarding pass
								var bpSeatData = pnrData.seat;
								var bpFlightNum = pnrData.flightID.split("-");
								//Set the final flight number for the boarding pass
								var bpFlightNumFormatted = bpFlightNum[0]+bpFlightNum[1];
								//Set the final PNR number for the boarding pass
								var bpcheckedInPNR = pnrData.recordLocator;
								//Set the final departure city for the boarding pass
								var bpDepCity = pnrData.departureCity;
								
								//Boarding Pass details json
								var bpObj = {
									PNR: bpcheckedInPNR,
									boardingpassData: {
										boardingpass: bpImgData,
										seatNumber: bpSeatData,
										gateNumber: bpGateData,
										flightNumber: bpFlightNumFormatted,
										departureCity: bpDepCity,
										boardingTime: bpBoardTimeData
									}
								};
								
								BPArray.push(bpObj);
								
							}
							
						}
						
						
						
						//Algorithm to remove duplicates from the final array and append duplicates to single PNR.
						var out= [];
						var obj= {};
						
						for(var i=0; i<BPArray.length; i++) {
							obj[BPArray[i].PNR] = 0;
						}
						
						for(var key in obj) {
							out.push(key);
						}
						
						
						for(var j=0; j<out.length; j++) {
							
							var bpDataArr = [];
							for(var k=0; k<BPArray.length; k++) {
								if(BPArray[k].PNR === out[j]) {
									bpDataArr.push(BPArray[k].boardingpassData);
								}
							}
							
							var finalBPObj = {
									PNR: out[j],
									boardingpassData: bpDataArr
							};
							
							finalBPArray.push(finalBPObj);
						}
						//Algorithm ends.
						
						
						console.log("Final Boarding Pass JSON:"+JSON.stringify(finalBPArray));
						
					} else {
						console.log("Unable to load app data. Please check your network settings and try again later.");
						//window.navigator.app.exitApp();

					}
					
				} else {
					//alert("Unable to load app data. Please check your network settings and try again later.");
					console.log("Unable to load app data.");

				}
				that.processfinalBPArray(tripListObj, finalBPArray);
			});
	    	
	 },
	 
	 processfinalBPArray: function(tripListObj, finalBPArray){
		 var tripCount;
		 var tripDetailObj = [];
		 
			var bpDataArray = finalBPArray;
				
			 //Loop through array of trip List
			 //tripCountChecker : Variable to check whether the iterations are completed. Avoids issues with asynchronous calls
			 for (tripCount = 0, tripCountChecker= 0; tripCount < tripListObj.length; tripCount++) {
			 		var pnr = tripListObj[tripCount].recLoc;
			 		console.log("pnr:"+pnr);
					
					var jsonResponse = {};
			    	var jsonObj = [];
			    	var trips = [];
			    	var key = pnr+"_"+merciAppData.DB_TRIPDETAIL;
			    	
			    	//Method to retrieve Trip Details data of each pnr from database
			    	
			    	alert("@@@key: "+key);
			    	modules.view.merci.common.utils.MCommonScript.getStoredItemFromDevice(key, function (result) {
			    		console.log("1111@@@"+result);
						if (result != null && result != '') {
							if (typeof result === 'string') {
								result = JSON.parse(result);
								
								alert(result);
							}
							if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(result)) {
								jsonResponse = result;
								var TripDetailPnr = jsonResponse.MFlightDetails.request.REC_LOC;
							
								var itineraryData = jsonResponse.MFlightDetails.reply.tripplan.air.itineraries;
								var finalObj = "";
								
								var onwardSeg = [];
								var returnSeg = [];
								var multiSeg = [];
								var localAirObj = [];
								
								var PNRboardingPassObj = null;
								
								//Loop through boarding pass array and find the BP object pertaining to the required PNR
								if(bpDataArray != null && bpDataArray.length > 0) {
									for(var bpCount = 0; bpCount<bpDataArray.length; bpCount++) {
										if(bpDataArray[bpCount].PNR.toLowerCase() == TripDetailPnr.toLowerCase()) {
											//get the boarding pass array of various segments within a pnr.
											PNRboardingPassObj = bpDataArray[bpCount].boardingpassData;
											console.log("here");
											break;
										}
									}
									
								}
								
								//Loop through array of itineraries
								for (var itenaryCount = 0; itenaryCount < itineraryData.length; itenaryCount++) {
									
									var segmentData = itineraryData[itenaryCount].segments;
									
									//Loop through array of segments in each itinerary
									for (var segment in segmentData) {
										var formattedDepartureDate = segmentData[segment].beginDate;
										formattedDepartureDate = formattedDepartureDate.split(" ");
										
										var formattedArrivalDate = segmentData[segment].endDate;
										formattedArrivalDate = formattedArrivalDate.split(" ");
										
										
										var beginTerminal = "";
										var endTerminal = "";
										if (segmentData[segment].beginTerminal != undefined)
											beginTerminal = segmentData[segment].beginTerminal;
										if (segmentData[segment].endTerminal != undefined)
											endTerminal = segmentData[segment].endTerminal;
						
										//Detailed Object of each segment
										var segmentDetailObj = {
												departureDate: {
													date: formattedDepartureDate[2] + " "+formattedDepartureDate[1]+" "+formattedDepartureDate[5],
													time: segmentData[segment].beginDateBean.hour+":"+segmentData[segment].beginDateBean.minute
												},
												departureLocation: {
													cityCode:segmentData[segment].beginLocation.cityCode,
													cityName:segmentData[segment].beginLocation.cityName,
													locationCode:segmentData[segment].beginLocation.locationCode,
													locationName:segmentData[segment].beginLocation.locationName,
													latitude:"",
													longitude:""
											
												},
												departureTerminal: beginTerminal,
												checkInDetails: {
													date:"",
													closingTime:"",
													desk:""
												},
												boardingDetails: {
													date:"",
													closingTime:"",
													gate:"",
													boardingPass:"",
													seat:""
												},
												arrivalDate: {
													date: formattedArrivalDate[2] + " "+formattedArrivalDate[1]+" "+formattedArrivalDate[5],
													time: segmentData[segment].endDateBean.hour+":"+segmentData[segment].endDateBean.minute
												},
												arrivalLocation: {
													cityCode:segmentData[segment].endLocation.cityCode,
													cityName:segmentData[segment].endLocation.cityName,
													locationCode:segmentData[segment].endLocation.locationCode,
													locationName:segmentData[segment].endLocation.locationName,
													latitude:"",
													longitude:""
												
												},
												arrivalTerminal: endTerminal,
													transportDetails: {
													mode:"Air",
													number:segmentData[segment].airline.code+segmentData[segment].flightNumber,
													name:segmentData[segment].airline.name
												}
											
										};
										
										
										if(PNRboardingPassObj != null && PNRboardingPassObj.length > 0) {
											
											for(var bpCount=0; bpCount<PNRboardingPassObj.length; bpCount++) {
												
												//check if object has the key
												if('departureCity' in PNRboardingPassObj[bpCount]) {
													if(PNRboardingPassObj[bpCount].departureCity.toLowerCase() === segmentData[segment].beginLocation.cityName.toLowerCase()) {
														segmentDetailObj.boardingDetails.boardingPass = PNRboardingPassObj[bpCount].boardingpass;
														segmentDetailObj.boardingDetails.seat = PNRboardingPassObj[bpCount].seatNumber;
														segmentDetailObj.boardingDetails.gate = PNRboardingPassObj[bpCount].gateNumber;
														segmentDetailObj.boardingDetails.closingTime = PNRboardingPassObj[bpCount].boardingTime;
													}
													
												}
											}
										}
										
										if (itenaryCount == 0) {
											onwardSeg.push(segmentDetailObj);
										} else if (itenaryCount == 1) {
											returnSeg.push(segmentDetailObj);
										} else if(itenaryCount > 1) {
											multiSeg.push(segmentDetailObj);
										}
										
										
									}
			
									console.log("##MultiObj:"+JSON.stringify(multiSeg));
									
									if (itineraryData.length == 1) {
										//Create Final Trip Details Object when there is only One Way Trip
										var segmentObj = {
											segments:onwardSeg
										};
			
										finalObj = {
												tripPNR:TripDetailPnr,
												onewayTrip:segmentObj
												};
												
									} else if (itineraryData.length == 2) {
									
										//Create Final Trip Details Object when there is Round Trip
										if (itenaryCount == 0) {
										
											var onwardSegmentObj = {
												segments:onwardSeg
											};
										
										} else if (itenaryCount == 1) {
										
											var returnSegmentObj = {
											segments:returnSeg
											};
											var roundTripObj = {
												onwardTrip:onwardSegmentObj,
												returnTrip:returnSegmentObj
											};
										
											finalObj = {
												tripPNR:TripDetailPnr,
												roundTrip:roundTripObj
											};
										
										}
									} else if (itineraryData.length > 2) {
										
										//Create Final Trip Details Object when there is Round Trip
										if (itenaryCount == itineraryData.length - 1) {
										
											var finalMultiTripArr = [];
											
											//add onward trips
											for(var j=0; j<onwardSeg.length; j++) {
												finalMultiTripArr.push(onwardSeg[j]);
											}
											
											//add return trips
											for(var k=0; k<returnSeg.length; k++) {
												finalMultiTripArr.push(returnSeg[k]);
											}
											
											//add multifaced trips
											for(var l=0; l<multiSeg.length; l++) {
												finalMultiTripArr.push(multiSeg[l]);
											}
											
											//Create Final Trip Details Object when there is multi faced Trip
											var segmentObj = {
												segments:finalMultiTripArr
											};

											finalObj = {
													tripPNR:TripDetailPnr,
													multiTrip:segmentObj
													};
										
										} 
										
									}
								
								} 
								
								console.log("FinalObject: "+JSON.stringify(finalObj));
			
								tripDetailObj.push(finalObj);
								
								tripCountChecker++;
						    		
						    	if (tripCountChecker == tripListObj.length) {
						    		var pnrData = {
						    			trips:tripDetailObj
						    			};
						    		
						    		console.log("MerciWear::"+JSON.stringify(pnrData));
						    		
						    		//Plugin call to send Trip Details data to SmartWatch App
						    		 var wearSuccess = function (message) {console.log('SendDataToWear success ' + message);};
		          			 	 	var wearFailure = function (message) {console.log('SendDataToWear failure ' + message);};
		          			 		WearPlugin.sendDataToWear(JSON.stringify(pnrData), "/message_wear_trip_details", wearSuccess, wearFailure);

		          			 		
						    	}
			        	
								
							} else {
								alert("TripDetails:Unable to load app data.");
								//window.navigator.app.exitApp();
							}
						} else {
							alert("TripDetails: Unable to load app data..");
							//window.navigator.app.exitApp();
						}
					});
			 	
			 }
	 }

};