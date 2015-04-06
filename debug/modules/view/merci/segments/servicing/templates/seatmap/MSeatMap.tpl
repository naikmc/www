{Template{
  $classpath: 'modules.view.merci.segments.servicing.templates.seatmap.MSeatMap',
  $macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
  $hasScript: true
}}

{var selectedSeatsByPax={}/}
/*Facilities Constants : Dictionary codes  : START */

/* Variables used across different macros: START */
  {var wingStarted=false/}
/*  Display Facilities available on each row : START  */
                    {var isLeftSideExit=false/}
                    {var isRightSideExit=false/}
                    {var isLeftSideToilet=false/}
                    {var isRightSideToilet=false/}
                    {var isLeftSideGalley=false/}
                    {var isRightSideGalley=false/}
                    {var isRightSideExitOnCabinBreak=false/}
                    {var isLeftSideExitOnCabinBreak=false/}
                    {var isCentreToilet=false/}
                    {var isExitFront=false/}
                    {var isExitRear=false/}
                    {var isLavatFront=false/}
                    {var isLavatRear=false/}
                    {var isGalleyFront=false/}
                    {var isGalleyRear=false/}
/*  Display Facilities available on each row : END */


/*Variables used across different macros: END */

  {macro main()}
    {section {
      id: 'seatMapPage',
      macro: 'loadContent'
    }/}
  {/macro}

  {macro loadContent()}
  
    {var labels = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.labels/}
    {var rqstParams = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.requestParam/}
    {var siteParameters = this.moduleCtrl.getModuleData().servicing.MseatMapv2_A.siteParam/}

    {var m_flagPreferredAsUnavail = false/}
    {var m_flagBassinetAsUnavail = false/}
    {var siteallowBassinet = siteParameters.siteallowBassinet /}
    {var showBscntMsg = siteParameters.showBscntMsg /}
    {var seatmappanelbean = rqstParams.seatmappanelbean/}
    {var listtravellerbean = rqstParams.listtravellerbean/}
    {var seatmapbean = rqstParams.seatmapbean/}
    {var listitinerarybean = rqstParams.listitinerarybean/}
    {var listseatassignmentbean = rqstParams.listseatassignmentbean/}
    {var m_ReadOnlyMode=seatmappanelbean.readonly/}
    {var decklist=seatmapbean.deckList/}
    {var profile = rqstParams.deviceBean.DEVICE_TYPE /}
    {var request = rqstParams.request /}
    {var frompage = request.FROMPAGE /}
    {var reply = rqstParams.reply /}

    {var noOfAvailable=0 /}

	${this.__setBassinetAvailableCheck()|eat}
	
    <section> //section 1
		{if this.isBassinetAvailable}

			{set siteallowBassinet = this.__getSiteAllowBassinet() /}

			{call includeError(labels, rqstParams) /}


			<form id="seatFormId">
				{if seatmappanelbean.displaySeatMap==true}
					<article class="panel seatmap is-scrollable">
						{if (this._merciFunc.isEmptyObject(frompage) || (frompage!='OIBOUND' ))}
							<header>
								{var travlrs=this.getPaxList()/}
								{var totalPax=travlrs.length/}
								{var nextPax=0/}

								/*New Pax Carrousel Implementation- START */
								
								{@html:Template {
									classpath: "modules.view.merci.common.templates.MPaxSelector",
									data: {
										passengers: travlrs,
										selectCallBack: {fn: this.paxCarrousel, scope: this},
										selectedPaxIndex: this.currentPax
									},
									block: true
								}/}
								/*New Pax Carrousel Implementation- END */

								/*  START SEAT / FLIGHT INFO BANNER  */
								<div class="m-sliding-banner"  {on tap {fn:"slideBanner", scope:this, args : {bannerName: ".m-sliding-banner"}} /}>
									<div class="m-sliding-content">
										<span data-seatinfo="seatnr" class="is-hidden" id="seatnum" style="width:0px;"><span id="noSeatIco" class="">&nbsp;</span></span>
										<ul id="movingBanner" class="" style="left: -86%;">
											<li class="is-seat">
												<span id="seatPrice" data-seatinfo="price">&nbsp;</span>
												<ul id="charList" data-seatinfo="charact">
												</ul>
												<a href="javascript:void(0)" class="expand-down" id="expandContent" {on tap {fn:"expand", scope:this,args : {id: "expandContent"}} /}>More</a>
											</li>

											{foreach legSeatMapElement in seatmappanelbean.legList}
												<li class="">
													{if (this._merciFunc.isEmptyObject(frompage) || (frompage!='OIBOUND' ))}
														{var legInfo=legSeatMapElement.legInfo/}
														{if (legInfo != null && legInfo != undefined)}
															{var param1=legInfo.beginLocation.cityName.concat(' (',legInfo.beginLocation.cityCode, ')')/}
															{var param2=legInfo.endLocation.cityName.concat(' (',legInfo.endLocation.cityCode, ')')/}
															{var paramsArr=[param1, param2]/}
															<span data-flightinfo="route"> ${getFormattedString(labels.tx_pltg_pattern_BCToEC, paramsArr)}</span>
														{/if}
													{/if}

													{if frompage != 'OIBOUND'}
														{var segment=seatmappanelbean.segment/}
														{var paramsArr1=[segment.airline.name, segment.airline.code, segment.flightNumber]/}
														<span data-flightinfo="flight">${getFormattedString(labels.tx_pltg_pattern_AirlineNameCodeFlight, paramsArr1)}</span>

														{if (legInfo != null && legInfo != undefined)}
															<span data-flightinfo="plane">${labels.tx_merci_text_booking_aircraft} ${legInfo.equipment}</span>
														{/if}
													{/if}
												</li>
											{/foreach}
										</ul>
									</div>
								</div>
								/*  END SEAT / FLIGHT INFO BANNER */

								/*  START SEAT OPTIONS DRAWER  */
								{if (siteParameters.filterSeats=="TRUE")}
									<section class="m-drawer">
										<header>
											<h2>Seat Options</h2>
												<button id="resetBtn" onclick="javascript:return false;" type="submit" data-control="reset"  {on click {fn:"resetAll", scope:this,args : {id: "resetBtn"}} /}>${labels.tx_merci_nwsm_resetall}</button>
												<dl>
													<dt>${labels.tx_merci_nwsm_seat_avail}</dt>
													<dd id="available" data-info="seats-available">0</dd>
													<dt>${labels.tx_merci_nwsm_optn_selct}</dt>
													<dd data-info="options-selected">0</dd>
												</dl>
										</header>
										<div id ="wrapper2">
											<div id="scroller">
												<ul class="list-view" id="seatOptions">
													{foreach charact in seatmappanelbean.cabin.seatCharacs}
														{var avlbl=getNumberAccToChars(charact_index)/}
														{if avlbl >0}
															<li>
																<a href="javascript:void(0)" id="${charact_index}" {on click {fn:"selectSeatChars", scope:this,args : {id: charact_index}} 	/}>${charact} <small>( ${avlbl} ${labels.tx_merci_text_seatsel_available})</small></a>
															</li>
														{/if}
													{/foreach}
												</ul>
											</div>
										</div>
										<footer> <a class="close-drawer" href="javascript:void(0)" {on click "closeOpenDrawer" /}>Options</a> </footer>
									</section>
								{/if}
								/*  END SEAT OPTIONS DRAWER  */
	
							</header>
						{/if} /* {if (this._merciFunc.isEmptyObject(frompage) || (frompage!='OIBOUND' ))} */
	
						<div id="wrapper" class="scrollable-content">
							<div id="scroller1">
								{if (frompage == 'OIBOUND' )}
									<p class="availFlightInfo">
										<span class="flight-number"><strong>${rqstParams.flightDetails}</strong></span>
										{foreach legSeatMapElement in seatmappanelbean.legList}
											{var legInfo=legSeatMapElement.legInfo/}
											{if (legInfo != null && legInfo != undefined)}
												<span class="route">
													<abbr class="city">${legInfo.beginLocation.cityCode}</abbr>
													<span class="dash">-</span>
													<abbr class="city">${legInfo.endLocation.cityCode}</abbr>
												</span>
											{/if}
										{/foreach}
									</p>
								{/if}

								<div class="seatmap">
									{if this._merciFunc.isEmptyObject(frompage) || (frompage != 'OIBOUND')}
										{if this._merciFunc.booleanValue(siteParameters.sitePnrNameFilter)}
											{if request.IS_SEAT_SERVICING != 'FALSE'} /*PTR 07209903- Changing the earlier logic of flowparam as we need to execute this logic in case of servicing flow only*/
												{var lastNames=rqstParams.listtravellerbean.primaryTraveller.identityInformation.lastName /}
												{if (lastNames.indexOf("@@@") != -1)}
													{if !this._merciFunc.isEmptyObject(lastNames)}
														{var statusVal=true/}
														{var allLastNamesArr=lastNames.split("@@@")/}
														{if allLastNamesArr.length != 1}
															{var firstLName=allLastNamesArr[0]/}
															{foreach lName in allLastNamesArr}
																{if ((lName != firstLName) && (statusVal==true))}
																	{set statusVal=false/}
																{/if}
															{/foreach}
														{/if}
													{/if}
												{/if}
											{else/}
												{var cookieLastNames=""/}
												{var append="N"/}
												{foreach passenger in listtravellerbean.travellers}
													{var pnrCookie=getPnrCookie(passenger.identityInformation.lastName)/}
													{if !this._merciFunc.isEmptyObject(rqstParams.cookie)}
														{foreach key in rqstParams.cookie}
															{if pnrCookie == key}
																{if append=="N"}
																	{var cookieLastNames = rqstParams.cookie[key]/}
																	{set append="Y"/}
																{else/}
																	{set cookieLastNames=cookieLastNames.concat("###", rqstParams.cookie[key])/}
																{/if}
															{/if}
														{/foreach}
													{/if}
												{/foreach}
												{if !this._merciFunc.isEmptyObject(cookieLastNames)}
													{set lastNames=cookieLastNames/}
												{/if}
											{/if}
										{/if} /* {if this._merciFunc.booleanValue(siteParameters.sitePnrNameFilter)} */
	
										/*   Create beans for pre-assigned seats : START  */
										{var allLastNames = this.getSelectedSeatsData('', 'STRING') /}
										{var selectCount = this.getSelectedSeatsData(0, 'NUMBER') /}
	
									{/if} /* {if this._merciFunc.isEmptyObject(frompage) || (frompage != 'OIBOUND')} */
	
									/*  Deck Links will be shown when upper deck is available : START */
									{var upperDeckAvailable=false/}
									{var lowerDeckAvailable=false/}
									{for var i=0;i<decklist.length;i++}
										{if (decklist[i].deckLabel=="UPPER")}
											{set upperDeckAvailable=true/}
										{/if}
										{if (decklist[i].deckLabel=="MAIN")}
											{set lowerDeckAvailable=true/}
										{/if}
									{/for}
									/*  Deck Links will be shown when upper deck is available : END */
	
									{foreach deck in decklist}
										{if deck.deckLabel=="UPPER"}
											{if (lowerDeckAvailable==false)}
												<div id="upperDeck"  role="tabpanel" data-aria-labeledby="btnToggleDeck" data-aria-hidden="false" class="deck">
											{else/}
												<div id="upperDeck"  role="tabpanel" data-aria-labeledby="btnToggleDeck" data-aria-hidden="true" class="deck displayNone">
											{/if}
											<h2>${labels.tx_merci_text_seatsel_upperdeck}
												<button type="button" class="secondary" id="btnUpperDeck" role="tab" data-aria-hidden="true" data-aria-expanded="false" onclick="javascript:return false" {on click {fn:"toggleDecks", scope:this,args : {hideId: "upperDeck", showId:"lowerDeck"}} /}><span>${labels.tx_merci_text_seatsel_viewlowerdeck}</span></button>
											</h2>
										{else/}
											<div id="lowerDeck" role="tabpanel" data-aria-hidden="false" data-aria-labeledby="btnToggleDeck" class="deck">
												<h2>${labels.tx_merci_text_seatsel_lowerdeck}
													{if upperDeckAvailable==true}
														<button type="button" class="secondary" id="btnLowerDeck" role="tab" data-aria-hidden="false" data-aria-expanded="false" onclick="javascript:return false" {on click {fn:"toggleDecks", scope:this,args : {hideId: "lowerDeck", showId:"upperDeck"}} /}<span>${labels.tx_merci_text_seatsel_viewupperdeck}</span></button>
													{/if}
												</h2>
										{/if}

										<table cellpadding="0" cellspacing="0" class="clear seatLayout"  id="layout">
											<tbody>
												{var columnIndexes=deck.colConfig/}
												{var colsLength=columnIndexes.length/}
												
												${this.__showWings(deck)|eat}
	
												/*   Column Titles : TOP START */
												{call printColumnTitles(columnIndexes)/}
												/*   Column Titles : TOP END */
	
												/*      Seats: START  */
												{set wingStarted=false/}
												{var isBassinetRowLogic=true/}
												{foreach cabin in deck.cabins}
													{foreach cabinMap in cabin.cabinMap}
														/*  Display Facilities available on this row : START  */
														{set isLeftSideExit=false/}
														{set isRightSideExit=false/}
														{set isLeftSideToilet=false/}
														{set isRightSideToilet=false/}
														{set isLeftSideGalley=false/}
														{set isRightSideGalley=false/}
														{set isRightSideExitOnCabinBreak=false/}
														{set isLeftSideExitOnCabinBreak=false/}
														{set isCentreToilet=false/}
														{set isExitFront=false/}
														{set isExitRear=false/}
														{set isLavatFront=false/}
														{set isLavatRear=false/}
														{set isGalleyFront=false/}
														{set isGalleyRear=false/}
														/*  Display Facilities available on this row : END */
														{if (cabinMap.facilities !=null)}
															{foreach facility in cabinMap.facilities}
																{if ((facility.code==this.EXIT_DOOR) && (facility.position==this.RIGHT|| facility.position==this.RIGHT_CENTER))}
																	{set isExitFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isExitFront=false/}
																		{set isExitRear=true/}
																	{/if}
																	{set isRightSideExit=true/}
																{/if}
	
																{if ((facility.code==this.EXIT_DOOR) && (facility.position==this.LEFT|| facility.position==this.LEFT_CENTER))}
																	{set isLeftSideExit=true/}
																	{set isExitFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isExitFront=false/}
																		{set isExitRear=true/}
																	{/if}
																{/if}
	
																{if ((facility.code==this.LAVATORY) && (facility.position==this.RIGHT|| facility.position==this.RIGHT_CENTER))}
																	{set isRightSideToilet=true/}
																	{set isLavatFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isLavatFront=false/}
																		{set isLavatRear=true/}
																	{/if}
																{/if}
	
																{if ((facility.code==this.LAVATORY) && (facility.position==this.LEFT|| facility.position==this.LEFT_CENTER))}
																	{set isLeftSideToilet=true/}
																	{set isLavatFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isLavatFront=false/}
																		{set isLavatRear=true/}
																	{/if}
																{/if}
	
																{if ((facility.code==this.LAVATORY) && (facility.position==this.CENTER))}
																	{set isCentreToilet=true/}
																	{set isLavatFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isLavatFront=false/}
																		{set isLavatRear=true/}
																	{/if}
																{/if}
	
																{if ((facility.code==this.GALLEY) && (facility.position==this.RIGHT|| facility.position==this.RIGHT_CENTER))}
																	{set isLeftSideGalley=true/}
																	{set isGalleyFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isGalleyFront=false/}
																		{set isGalleyRear=true/}
																	{/if}
																{/if}
	
																{if ((facility.code==this.GALLEY) && (facility.position==this.LEFT|| facility.position==this.LEFT_CENTER))}
																	{set isRightSideGalley=true/}
																	{set isGalleyFront=true/}
																	{if (facility.location==this.REAR)}
																		{set isGalleyFront=false/}
																		{set isGalleyRear=true/}
																	{/if}
																{/if}
	
																{if (cabinMap.exitRow==true)}
																	{set isRightSideExitOnCabinBreak=true/}
																	{set isLeftSideExitOnCabinBreak=true/}
																{/if}
															{/foreach}
														{/if}
	
														/*   Exit Row Logic : START */
														{if ((isRightSideExitOnCabinBreak==true) || (isLeftSideExitOnCabinBreak==true))}
															{call printSpecifiedRow("exitrowleft","exitrowright",cabinMap,colsLength,isLeftSideExitOnCabinBreak,isRightSideExitOnCabinBreak)/}
														{/if}
														/*  Exit Row Logic : END */
	
														/*  Exit Row Logic : START */
														{if ((isLeftSideExit==true) ||(isRightSideExit==true)) && (isExitFront==true)}
															{call printSpecifiedRow("exitrowleft","exitrowright",cabinMap,colsLength,isLeftSideExit,isRightSideExit)/}
														{/if}
														/*  Exit Row Logic : END */
	
														/*  Toilet Row Logic : START */
														{if ((isLeftSideToilet==true) ||(isRightSideToilet==true) || (isCentreToilet==true)) && (isLavatFront==true)}
															{call printSpecifiedRow("toilet","toilet",cabinMap,colsLength,isLeftSideToilet,isRightSideToilet)/}
														{/if}
														/*  Toilet Row Logic : END */
	
														/*  Galley Row Logic : START */
														{if ((isLeftSideGalley==true) || (isRightSideGalley==true)) && (isGalleyFront==true)}
															{call printSpecifiedRow("galley","galley",cabinMap,colsLength,isLeftSideGalley,isRightSideGalley)/}
														{/if}
														/*  Galley Row Logic : END */
	
														/*  Bassinet Row Logic- START */
														{var isBassinetSeatRow=false/}
														{var rowNo=aria.utils.String.trim(cabinMap.rowIndex)/}
														{foreach seatChars in cabinMap.rowData}
															{var isBassinetSeat=false/}
															{foreach chars in seatChars}
																{if (chars==this.BASSINET_SEAT)}
																	{set isBassinetSeat=true/}
																{/if}
															{/foreach}
															{if (isBassinetSeat==true)}
																{set isBassinetSeatRow=true/}
																{var bassinetSeatRowNo=aria.utils.String.trim((parseInt(rowNo)+1).toString())/}
															{/if}
														{/foreach}
	
														{if (frompage == 'OIBOUND')}
															{if ((isBassinetSeatRow==true) || (bassinetSeatRowNo==aria.utils.String.trim(rowNo)))}
																{set isBassinetRowLogic=true/}
															{else/}
																{foreach seatChars in cabinMap.rowData}
																	<td></td>
																	{set isBassinetRowLogic=false/}
																{/foreach}
															{/if}
														{/if}
														/*  Bassinet Row Logic- END */
	
														{if (isBassinetRowLogic==true)}
															{if (isBassinetSeatRow==true)}
																{if ((bassinetRowNo != null) && ((cabinMap.rowIndex - bassinetRowNo) > 1))}
																	<tr>
																		<td class=""  valign="middle" align="center"></td>
	
																		/*  Wings : START  */
																		{call printWings(cabinMap)/}
	
																		/*  Wall : START  */
																		{call printWall(isLeftSideExit,isRightSideExit,"LeftWall","ExitWall")/}
	
																		{foreach seatChars in cabinMap.rowData}
																			<td>--------</td>
																		{/foreach}
	
																		{call printWall(isLeftSideExit,isRightSideExit,"RightWall","ExitWall")/}
																		{call printWings(cabinMap)/}
																		<td class=""  valign="middle" align="center"></td>
																	</tr>
																{/if}
																{var bassinetRowNo = cabinMap.rowIndex/}
																<tr>
																	<td class=""  valign="middle" align="center"></td>
	
																	/*  Wings : START  */
																	{call printWings(cabinMap)/}
	
																	/*  Wall : START  */
																	{call printWall(isLeftSideExit,isRightSideExit,"LeftWall","ExitWall")/}
	
																	{foreach seatChars in cabinMap.rowData}
																		{var isAvailableSeat=false/}
																		{var isBassinetSeat=false/}
																		{var isPreferredSeat=false/}
																		{var isPreAssignedSeat=false/}
																		{var isNoSeat=false/}
																		{var isLavatory=false/}
																		{var isGalley=false/}
																		{foreach chars in seatChars}
																			/*  If Bassinet Seat */
																			{if (chars==this.BASSINET_SEAT)}
																				{set isBassinetSeat=true/}
																			{/if}
	
																			/*  Is Missed Seat */
																			{if ((chars==this.MISSED_SEAT) || (chars==this.NO_SEAT))}
																				{set isNoSeat=true/}
																			{/if}
	
																			/*  Is Chargeable/Preferred Seat */
																			{if (chars==this.PREFERRED_SEAT)}
																				{set isPreferredSeat=true/}
																			{/if}
																		{/foreach}
	
																		/*  If No Seat */
																		{if (isNoSeat==true)}
																			<td class="noSeat"></td>
																		{elseif (isBassinetSeat==true)/}
																			<td class="bassinetSeat">&nbsp;</td>
																		{else/}
																			<td>&nbsp;</td>
																		{/if}
																	{/foreach}
	
																	/*   Wall : START  */
																	{call printWall(isLeftSideExit,isRightSideExit,"RightWall","ExitWall")/}
																	{call printWings(cabinMap)/}
	
																	<td class=""  valign="middle" align="center"></td>
																</tr>
															{/if}
															<tr>
																/*   Row Number : START  */
																<td align="center" valign="middle" class="" >
																	${aria.utils.String.trim(rowNo)}
																</td>
	
																/*   Wings : START  */
																{call printWings(cabinMap)/}
	
																/*   Wall : START  */
																{call printWall(isLeftSideExit,isRightSideExit,"LeftWall","ExitWall")/}
	
																/*  Seats : START  */
																{var seatOcupOn=""/}
																{foreach seatChars in cabinMap.rowData}
																	{set isAvailableSeat=false/}
																	{set isBassinetSeat=false/}
																	{set isPreferredSeat=false/}
																	{set isPreAssignedSeat=false/}
																	{set isNoSeat=false/}
																	{set isLavatory=false/}
																	{set isGalley=false/}
	
																	/*   Get Seat Id    */
																	{var l_seatId="" /}
																	{var position=aria.utils.String.trim(deck.colConfig[seatChars_index]) /}
																	{if position.length>0}
																		{set l_seatId=getSeatId(cabinMap.rowIndex, deck.colConfig[seatChars_index])/}
																	{/if}
	
																	/*  Is Pre-Assigned Seat */
	
																	{foreach key in this.selectedSeatsByPax}
																		{if (key_index==l_seatId)}
																			{set isPreAssignedSeat=true/}
																		{/if}
																	{/foreach}
	
																	/*  Identify the characteristics of the seat */
	
																	{foreach chars in seatChars}
																		/*  Is Available Seat   */
																		{if (chars==this.AVAILABLE_SEAT)}
																			{set isAvailableSeat=true/}
																			{set noOfAvailable=incrementAvailable(noOfAvailable) /}
	
																			{if isBassinetSeat==true && isInfantInPnr==false}
																				{set noOfAvailable=decrementAvailable(noOfAvailable) /}
																			{/if}
																		{/if}
	
																		/*    Is Bassinet Seat   */
																		{if (chars==this.BASSINET_SEAT)}
																			{set isBassinetSeat=true/}
																		{/if}
	
																		/*   Is Preferred/Chargeable Seat   */
																		{if (chars==this.PREFERRED_SEAT)}
																			{set isPreferredSeat=true/}
																		{/if}
	
																		/*   Lavatory   */
																		{if (chars==this.LAVATORY)}
																			{set isLavatory=true/}
																		{/if}
	
																		/*   Galley   */
																		{if (chars==this.GALLEY)}
																			{set isGalley=true/}
																		{/if}
	
																		/*  Is Missed Seat/ No Seat   */
																		{if ((chars==this.MISSED_SEAT) || (chars==this.NO_SEAT))}
																			{set isNoSeat=true/}
																		{/if}
	
																		/*    Restricted Seats will be shown as available- To mimic e-Retail behaviour   */
																		/*  {if (chars==this.RESTRICTED_SEAT)}
																				{set isAvailableSeat=false/}
																			{/if} */
																	{/foreach}
	
																	/*   Seat Type = NO_SEAT  */
																	{if isNoSeat==true}
																		<td>
																			<input type="button" value="" class="noSeat">
																		</td>
																	{/if}
	
																	/*  Seat Type = Lavatory : Lavatory can appear in seat level also  */
																	{if isLavatory==true}
																		<td align="center" valign="middle" class="toilet" ></td>
																	{/if}
	
																	/*  Seat Type = Galley : Galley can appear in seat level also  */
																	{if isGalley==true}
																		<td align="center" valign="middle" class="seat_galleyDisplay" ></td>
																	{/if}
	
																	/*  Seat Type = AVAILABLE_SEAT  */
																	{if isAvailableSeat && !isPreferredSeat && !isBassinetSeat}
																		{call printSeat(isPreAssignedSeat, l_seatId, false) /}
																	{/if}

																	/*  Seat Type = PREFERRED_SEAT  */
																	{if (isPreferredSeat && isAvailableSeat)}
																		{if m_flagPreferredAsUnavail}
																			<td class="occupied"></td>
																		{else/}
																			{call printSeat(isPreAssignedSeat, l_seatId, true) /}
																		{/if}
																	{/if}
	
																	/*  Seat Type = BASSINET_SEAT  */
																	{if (isAvailableSeat && isBassinetSeat && !siteallowBassinet)}
																		{if m_flagBassinetAsUnavail}
																			<td class="occupied" ></td>
	
																		{else/}
																			{if isPreAssignedSeat}
																				<td class="occupied" id="${l_seatId}"></td>
	
																			{else/}
																				{if m_ReadOnlyMode}
																					<td align="center"  class="occupied" id="${l_seatId}"></td>
	
																				{else/}
																					<td align="center"  class="occupied" id="${l_seatId}"></td>
	
																				{/if}
																			{/if}
																		{/if}
																	{/if}
	
																	{if (isAvailableSeat && isBassinetSeat && siteallowBassinet)}
																		{if (m_flagBassinetAsUnavail)}
																			<td  class="occupied"></td>
																		{else/}
																			{if isPreAssignedSeat}
																				<td id="${l_seatId}" data-seatInfo-price="FREE">
																					<input class="selected" type="button"  value=""/>
																				</td>
																			{else/}
																				{if (m_ReadOnlyMode)}
																					<td data-type="seat"  data-seatInfo-price="FREE" id="${l_seatId}">
																						<input class="" type="button"  value=""  {on click {fn:"selectSeat", scope:this,args : {seatId: l_seatId,isChargeable:false}} /} /></td>
																				{else/}
																					<td data-type="seat"  data-seatInfo-price="FREE" id="${l_seatId}">
																						<input class="" type="button"  value=""  {on click {fn:"selectSeat", scope:this,args : {seatId: l_seatId,isChargeable:false}} /} /></td>
	
																				{/if}
																			{/if}
																		{/if}
																	{/if}
	
																	/*   Seat Type = UNAVAILABLE SEAT  */
																	{if !isAvailableSeat && !isNoSeat && !isLavatory && !isGalley}
																		{if isPreAssignedSeat}
																			{call printSeat(isPreAssignedSeat, l_seatId, false) /}
																		{else/}
																			<td class="occupied"></td>
																		{/if}
																	{/if}
	
																{/foreach}
	
																/*   SEATS : END    */
	
																/*   Wall : START  */
																{call printWall(isLeftSideExit,isRightSideExit,"LeftWall","ExitWall")/}
																/*   Wings : START  */
																{call printWings(cabinMap)/}
	
																/*   Row Number : START  */
																<td align="center" valign="middle" class="" >
																	${aria.utils.String.trim(rowNo)}
																</td>
															</tr>
	
															/*   Exit Row Logic : START */
															{if ((isLeftSideExit==true) ||(isRightSideExit==true)) && (isExitRear==true)}
																{call printSpecifiedRow("exitrowleft","exitrowright",cabinMap,colsLength,isLeftSideExit,isRightSideExit)/}
															{/if}
															/*   Exit Row Logic : END */
	
															/*   Toilet Row Logic : START */
															{if ((isLeftSideToilet==true) ||(isRightSideToilet==true) || (isCentreToilet==true)) && (isLavatRear==true)}
																{call printSpecifiedRow("toilet","toilet",cabinMap,colsLength,isLeftSideToilet,isRightSideToilet)/}
															{/if}
															/*   Toilet Row Logic : END */
	
															/*   Galley Row Logic : START */
															{if ((isLeftSideGalley==true) || (isRightSideGalley==true)) && (isGalleyRear==true)}
																{call printSpecifiedRow("galley","galley",cabinMap,colsLength,isLeftSideGalley,isRightSideGalley)/}
															{/if}
															/*   Galley Row Logic : END */
	
															{if (cabinMap.isWing)}
																{set wingStarted=true/}
															{/if}
														{/if}
													{/foreach} /* {foreach cabin in deck.cabins} */
												{/foreach} /* {foreach cabinMap in cabin.cabinMap} */
												/*   Column Titles : BOTTOM START */
												{call printColumnTitles(columnIndexes)/}
												/*   Column Titles : BOTTOM END */
											</tbody>
										</table>
									</div>
									{/foreach} /* {foreach deck in decklist} */
									/* DECK LIST */
	
								</div>
							</div>
						</div>
					</article>
				{/if} /* {if seatmappanelbean.displaySeatMap==true} */
				<input type="hidden" id="upsellOutLow" name="upsellOutLow" value="${request.upsellOutLow}" />
				<input type="hidden" id="upsellInLow" name="upsellInLow" value="${request.upsellInLow}" />
				<input type="hidden" id="TRIP_TYPE" name="TRIP_TYPE" value="${request.TRIP_TYPE}" />
				{if this._merciFunc.isEmptyObject(request.PAGE_TICKET)}
					<input type="hidden" name="PAGE_TICKET" id="PAGE_TICKET" value="" />
				{else/}
					<input type="hidden" name="PAGE_TICKET" id="PAGE_TICKET" value="${request.PAGE_TICKET}" />
				{/if}

				{if (!this._merciFunc.isEmptyObject(listtravellerbean.travellersAsMap))}
					<input type="hidden" name="TRAV_LIST_SIZE" id="TRAV_LIST_SIZE" value="${this.__getKeysCount(listtravellerbean.travellersAsMap)}"/>
				{/if}
				{if (!this._merciFunc.isEmptyObject(listtravellerbean.primaryTraveller))}
					<input type="hidden" name="DIRECT_RETRIEVE_LASTNAME" id="DIRECT_RETRIEVE_LASTNAME" value="${listtravellerbean.primaryTraveller.identityInformation.lastName}"/>
				{/if}
				<input type="hidden" name="SERVICE_PRICING_MODE" id="SERVICE_PRICING_MODE" value="UPDATE_PRICE" />
				<input type="hidden" name="REGISTER_START_OVER" id="REGISTER_START_OVER" value="false"/>
				<input type="hidden" name="updateInfoSuccess" id="updateInfoSuccess" value="21300045"/>
				<input type="hidden" name="PROFILE_ID" id="PROFILE_ID" value="${profile}"/>
				<input type="hidden" name="FROM_PAX" id="FROM_PAX" value="TRUE"/>
				<input type="hidden" name="result" id="result" value="json"/>
				<input type="hidden" name="continue" id="continue" value="TRUE"/>
				<input type="hidden" name="OUTPUT_TYPE" id="OUTPUT_TYPE" value="2" />
				<input type="hidden" name="SEAT_SELECTED_PARAM" id="SEAT_SELECTED_PARAM" value="TRUE" />

				{if (request.IS_SEAT_SERVICING == 'FALSE') || this._merciFunc.booleanValue(siteParameters.merciServiceCatalog)}

					{var filteredParams = ['SITE', 'LANGUAGE', 'PAGE_TICKET', 'BOOKING_CLASS', 'B_AIRPORT_CODE', 'E_AIRPORT_CODE',
					'B_DATE', 'B_TIME', 'E_TIME', 'EQUIPMENT_TYPE', 'DECK', 'AIRLINE_CODE','FLIGHT', 'SEGMENT_ID',
					'itinerary_index', 'HAS_OTHER_SEGMENTS','IS_SEAT_SERVICING', 'FROM_PAX', 'PROFILE_ID',
					'SERVICE_PRICING_MODE', 'updateInfoSuccess', 'REGISTER_START_OVER', 'PAGE_TICKET',
					'DIRECT_RETRIEVE_LASTNAME', 'JSP_NAME_KEY', 'TRAV_LIST_SIZE','LIST_TRAVELLER_INFORMATION',
					'TRAVELLER_INFORMATION', 'TRAVELLER_NUMBER'] /}

					{for key in request}
						{if request.hasOwnProperty(key) 
							&& filteredParams.indexOf(key) < 0 
							&& key != 'SEATS_INFORMATIONS'}
							<input type="hidden" name=${key} id=${key} value="${request[key]}">
						{/if}
					{/for}

					{var totalNoOfSegment = this.getTotalSegmentsCount() /}

					{var noOfSegment=0/}
					{foreach itinerary in listitinerarybean.itineraries}
						{foreach segment in itinerary.segments}
							{set noOfSegment=noOfSegment+1/}
							{if segment.id==parseInt(request.SEGMENT_ID,10)}
								{var itnToProcess=parseInt(request.itinerary_index,10)/}
								{if segment_index==totalNoOfSegment-1}
									{set itnToProcess=itnToProcess+1/}
								{/if}
								<input type="hidden" name="BOOKING_CLASS" id="BOOKING_CLASS" value="${segment.cabins[0].RBD}"/>
								<input type="hidden" name="B_AIRPORT_CODE" id="B_AIRPORT_CODE" value="${segment.beginLocation.locationCode}"/>
								<input type="hidden" name="E_AIRPORT_CODE" id="E_AIRPORT_CODE" value="${segment.endLocation.locationCode}"/>
								<input type="hidden" name="B_DATE" id="B_DATE" value="${segment.beginDateBean.yearMonthDay}"/>
								<input type="hidden" name="B_TIME" id="B_TIME" value="${segment.beginDateBean.formatTimeAsHHMM}"/>
								<input type="hidden" name="EQUIPMENT_TYPE" id="EQUIPMENT_TYPE" value="${segment.equipmentCode}"/>
								<input type="hidden" name="E_TIME" id="E_TIME" value="${segment.endDateBean.formatTimeAsHHMM}"/>
								<input type="hidden" name="DECK" id="DECK" value="L"/>
								<input type="hidden" name="AIRLINE_CODE" id="AIRLINE_CODE" value="${segment.airline.code}"/>
								<input type="hidden" name="FLIGHT" id="FLIGHT" value="${segment.flightNumber}"/>
								<input type="hidden" name="SEGMENT_ID" id="SEGMENT_ID" value="${request.SEGMENT_ID}"/>
								<input type="hidden" name="itinerary_index" id="itinerary_index" value="${itnToProcess}"/>
								<input type="hidden" name="IS_SEAT_SERVICING" id="IS_SEAT_SERVICING" value="FALSE"/>

								{var isOtherSegmentPresent = this.hasOtherSegments(noOfSegment, segment.id, totalNoOfSegment) /}
								{if isOtherSegmentPresent}
									<input type="hidden" name="HAS_OTHER_SEGMENTS" id="HAS_OTHER_SEGMENTS" value="TRUE"/>
								{else /}
									<input type="hidden" name="HAS_OTHER_SEGMENTS" id="HAS_OTHER_SEGMENTS" value="FALSE"/>
								{/if}
							{/if}
						{/foreach}
					{/foreach}

				{else/}
					<input type="hidden" name="SITE" value="${request.SITE}" />
					<input type="hidden" name="LANGUAGE" value="${request.LANGUAGE}"/>
					<input type="hidden" name="ACTION" value="MODIFY" />
					<input type="hidden" name="REC_LOC" value="${request.REC_LOC}" />
					<input type="hidden" name="SEGMENT_ID" value="${request.SEGMENT_ID}"/>
					<input type="hidden" name="IS_SEAT_SERVICING" id="IS_SEAT_SERVICING" value="${request.IS_SEAT_SERVICING}"/>
				{/if}

				<input type="hidden" name="FLOW_TYPE" value="${request.FLOW_TYPE}" />
					
			</form>

			{if this._merciFunc.isEmptyObject(frompage) || (frompage != 'OIBOUND')}
				{call buttonSection(rqstParams, siteParameters, labels) /}
			{/if}
	
		{else/} /* {if !isBassinetAvailableCheck} */
			<div class="seatMap noBassinet" id= "noBassinet">
				${labels.tx_merci_text_no_bsct_avail}
			</div>
		{/if}
    </section> //section 1
  {/macro}

  {macro printColumnTitles(columnIndexes)}
    <tr>
      <td align="center" valign="middle" class="seattext" ></td>
      {if this.isWingsToShow==true}
        <td align="center" valign="middle" class="seattext" ></td>
      {/if}
      <td align="center" valign="middle"></td>
      {foreach coltitle in columnIndexes}
        {set col=aria.utils.String.trim(coltitle)/}
        {set len=col.length/}
        {if len>0}
          <td     >${col}</td>
        {else/}
          <td     >&nbsp;</td>
        {/if}
      {/foreach}
      <td align="center" valign="middle"></td>
      {if this.isWingsToShow==true}
        <td align="center" valign="middle" class="seattext" ></td>
      {/if}
        <td align="center" valign="middle" class="seattext" ></td>
    </tr>
  {/macro}

  {macro printSpecifiedRow(classLeft,classRight,cabinMap,colsLength,left,right)}
    <tr>
      <td align="center" valign="middle" class="seattext" ></td>
      {if this.isWingsToShow==true}
        {if cabinMap.isWing==false}
          <td align="center" valign="middle" class="seattext" ></td>

        {elseif (cabinMap.isWing && wingStarted)/}
          <td class='TitleOnWings wingcell'></td>

        {elseif (cabinMap.isWing && !wingStarted)/}
          <td class='TitleStartWingsLeft wingcell'></td>

        {else/}
          <td class='TitleEndWingsLeft wingcell'></td>

        {/if}
      {/if}
      <td align="center" valign="middle"></td>

      {for var i=0; i<colsLength; i++}
        {if ((i==0)&&(left==true))}
          <td align="center" valign="middle" class=${classLeft} ></td>
        {elseif ((i==colsLength-1) && (right==true))/}
          <td align="center" valign="middle" class=${classRight} ></td>
        {else/}
          <td></td>
        {/if}
      {/for}
      <td align="center" valign="middle"></td>
      {if (this.isWingsToShow==true)}
        {if (cabinMap.isWing==false)}
          <td class='TitleNoWings wingcell'></td>
        {elseif ((cabinMap.isWing==true) &&(wingStarted==true))/}
          <td class='TitleOnWings wingcell'></td>
        {elseif ((cabinMap.isWing==true))/}
          <td class='TitleStartWingsRight wingcell'></td>
        {else/}
          <td class='TitleEndWingsRight wingcell'></td>
        {/if}
      {/if}
      <td align="center" valign="middle"></td>
    </tr>
  {/macro}

  {macro printWings(cabinMap)}
    {if (this.isWingsToShow==true)}
      {if (cabinMap.isWing==false)}
        <td class='TitleNoWings wingcell'></td>
      {elseif ((cabinMap.isWing==true) &&(wingStarted==true))/}
        <td class='TitleOnWings wingcell'></td>
      {elseif ((cabinMap.isWing==true) &&(wingStarted==false))/}
        <td class='TitleStartWingsRight wingcell'></td>
      {else/}
        <td class='TitleEndWingsRight wingcell'></td>
      {/if}
    {/if}
  {/macro}

  {macro printWall(left,right,class1,class2)}
    {if ((!left) || (right))}
      <td class=${class1}></td>
    {else/}
      <td class=${class2}></td>
    {/if}
  {/macro}

  {macro printSeat(isPreAssignedSeat, seatId, chargeable)}
    {var dataPrice = chargeable ? "Chargeable" : "FREE" /}
    {if isPreAssignedSeat}
      {var seatClass = "selected" /}
      {if this.selectedSeatsByPax[seatId] == this.moduleCtrl.getValuefromStorage('currentPax')}
        {set seatClass = "is-current" /}
      {/if}
      <td class="${seatClass}" data-type="seat" data-seatInfo-price="${dataPrice}" id="${seatId}">
        <input class="hidden" type="button" {on click {fn: "selectSeat", scope: this, args: {seatId: seatId, isChargeable: chargeable}} /} />
        <span class="paxSeatIndicator">${this.selectedSeatsByPax[seatId]}</span>
      </td>
    {else/}
      <td data-type="seat" data-seatInfo-price="${dataPrice}" id="${seatId}">
        <input type="button" {on click {fn: "selectSeat", scope: this, args: {seatId: seatId, isChargeable: chargeable}} /} />
      </td>
    {/if}
  {/macro}

  {macro buttonSection(rqstParams, siteParameters, labels) }
    <footer class="buttons footer padtop5">

              {if rqstParams.request.HAS_OTHER_SEGMENTS=="TRUE"}
                <button type="button" formaction="" class="validation" data-controlinfo="proceed" {on click {fn: "callActn"} /}>${labels.tx_merci_text_booking_seat_next_flight}</button>
              {else/}

              /* Changes made as a part of CR 6414833 - ReDesign Ancillary Services */
                {if this._merciFunc.booleanValue(siteParameters.merciServiceCatalog) && rqstParams.seatmappanelbean.displaySeatMap}
                  <button type="button" formaction="" class="validation" data-controlinfo="proceed" id="savBtn" {on click {fn:"proceedToCatalog" } /}>
                    ${labels.tx_merci_text_seatsel_btnsave}
                  </button>
              /* Changes made as a part of CR 6414833 - ReDesign Ancillary Services */
                {else/}
                {if rqstParams.request.isReterieve=="TRUE" && rqstParams.seatmappanelbean.displaySeatMap}
                  {if this._merciFunc.isEmptyObject(this.data.errors)}
                    <input type="hidden" name="FROM_PAGE" value="SERVICE" />
                    <button type="button" formaction="" id="savBtn" class="validation" data-controlinfo="proceed" {on click {fn:"proceedServicing" } /}>
                      ${labels.tx_merci_text_seatsel_btnsave}
                    </button>
                  {/if}
                {elseif (rqstParams.seatmappanelbean.displaySeatMap)/}
                  <button type="button" formaction="" class="validation" data-controlinfo="proceed" {on click {fn: "proceedToPay"} /}>
                    ${labels.tx_merci_text_booking_seat_to_payment}
                  </button>
                {elseif !rqstParams.seatmappanelbean.displaySeatMap && rqstParams.request.isReterieve!="TRUE"/}
                  <button type="button" formaction="" class="validation" data-controlinfo="proceed" {on click {fn: "proceedToPay"} /}>
                    ${labels.tx_merci_text_booking_seat_to_payment}
                  </button>
                {/if}
              {/if}
              {/if}

              {if rqstParams.request.isReterieve=="TRUE"}
                <span>
                  <button type="button" formaction="#" id="backBtn" class="validation" data-controlinfo="back-btn" {on click "backToRetrieve" /}>${labels.tx_merci_text_back}</button>
                </span>
              {/if}
              {if rqstParams.seatmappanelbean.displaySeatMap}
                <button type="button" formaction="#" id="revertBtn" class="validation cancel" data-controlinfo="revert-btn" {on click "revertSeatSelection" /}>${labels.tx_merci_checkin_selseat_revert}</button>
              {/if}

            </footer>
  {/macro}


  {macro includeError(labels)}
    {section {
      id: 'errors',
      bindRefreshTo : [{
        inside : this.data,
        to : "errorOccured"
      }],
      macro : {
        name: 'printErrors',
        args: [labels]
      }
    }/}
  {/macro}

  {macro printErrors(labels)}
    {if this.data.BEerrors != null && this.data.BEerrors.length > 0}
      {var errorTitle = ''/}
      {if labels != null && labels.tx_merci_text_error_message != null}
        {set errorTitle = labels.tx_merci_text_error_message/}
      {/if}
      {call message.showError({list: this.data.BEerrors, title: errorTitle})/}
    {/if}
	{if this.data.errors != null && this.data.errors.length > 0}
      {var errorTitle = ''/}
      {if labels != null && labels.tx_merci_text_error_message != null}
        {set errorTitle = labels.tx_merci_text_error_message/}
      {/if}
      {call message.showError({list: this.data.errors, title: errorTitle})/}
    {/if}
  {/macro}

{/Template}