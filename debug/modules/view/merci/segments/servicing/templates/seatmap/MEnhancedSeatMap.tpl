{Template{
  	$classpath: 'modules.view.merci.segments.servicing.templates.seatmap.MEnhancedSeatMap',
  	$macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib'},
  	$hasScript: true
}}

	{macro main()}
      {if this.utils.booleanValue(this.siteParams.filterSeats)}
        <nav class="filterIcon" {on tap {fn:"toggleAnimateDisplay", scope:this, args:{element:'filters'}} /}> <a href="#"><span class="icon-filter-sign"></span></a></nav>
      {/if}
      <nav class="helpIcon" {on tap {fn:"toggleAnimateDisplay", scope:this, args:{element:'help'}} /}> <a href="#"><span class="icon-question-sign"></span></a></nav>
      {call includeError(this.labels) /}
    	{section {
  			id: 'seatHeader',
  			  type: 'header',
  			cssClass: 'stmpHeader',
  			  macro: 'createHeader',
  			bindRefreshTo: [{
   				to: 'currentSegment',
    			inside: this.data,
   				recursive: true
  			}]
    	}/}
      {section {
        id: 'seatLegend',
          type: 'section',
        cssClass: 'seat-map',
          macro: 'displayHelpMacro',
        bindRefreshTo: [{
          to: 'currentSegment',
          inside: this.data,
          recursive: true
        }]
      }/}
      {if this.utils.booleanValue(this.siteParams.filterSeats)}
        {section {
          id: 'seatFilters',
            type: 'section',
          cssClass: '',
            macro: 'displayFiltersMacro',
          bindRefreshTo: [{
            to: 'selectedFilters',
            inside: this.data,
            recursive: true
          },
          {
            to: 'currentSegment',
            inside: this.data,
            recursive: true
          }]
        }/}
      {/if}
      <div id="stmp_wrapper_main" {on pinch {fn:'onPinch', scope: this}/}>
        <div id="stmp_scroller_main">
          <div id="stmp_wrapper">
            <div id="stmp_scroller">
              {section {
                id: 'seatList',
                type: 'ul',
                cssClass: 'stmpPanel',
                macro: 'createSeatMaps',
                bindRefreshTo: [{
                  to: 'currentSeatMap',
                  inside: this.data,
                  recursive: true
                }]
              }/}
            </div>
          </div>
        </div>
        {section {
          id: 'footerSegment',
          type: 'nav',
          macro: 'createFooterNav',
          bindRefreshTo: [{
            to: 'currentSegment',
            inside: this.data,
            recursive: true
          }]
        }/}
      </div>
	{/macro}

	{macro createHeader()}
		{var currentSegment = this.data.currentSegment /}
		<hgroup class="current">
			<h1>${currentSegment.beginLocation.cityName} (${currentSegment.beginLocation.locationCode}) to <wbr>${currentSegment.endLocation.cityName} (${currentSegment.endLocation.locationCode})</h1>
			<h2>${currentSegment.defaultAirline.code}${currentSegment.flightNumber}: ${this.labels.tx_merci_text_operatedby} 
        {if !this.utils.isEmptyObject(currentSegment.operatingAirline) && !this.utils.isEmptyObject(currentSegment.operatingAirline.code)} 
          {if currentSegment.operatingAirline.code != currentSegment.defaultAirline.code} 
            ${currentSegment.operatingAirline.name} 
          {else/} 
            ${currentSegment.defaultAirline.name} 
          {/if} 
        {else/}
				 ${currentSegment.defaultAirline.name}
        {/if}
      </h2>
			<h3>${currentSegment.equipmentName}</h3>
	  </hgroup>
		<nav id="nav1">
      <div class="indicator-wrapper">
  			<ul id="indicator1" class="sm-list">
  				{foreach segment in this.requestParam.allSegments}
  					<li {if segment.segmentId == this.data.currentSegment.segmentId} class="active" {/if} {on tap {fn:"changeCurrentSegment", scope:this, args : {segmentId: segment.segmentId, scroll: true}} /}>
  						<a class="locations" href="#" {on click {fn:"changeCurrentSegment", scope:this, args : {segmentId: segment.segmentId, scroll: true}} /}>${segment.beginLocation.locationCode} - ${segment.endLocation.locationCode}</a>
  					</li>
  				{/foreach}
  			</ul>
      </div>
		</nav>
	{/macro}

	{macro createFooterNav()}
    <footer id="stmpFooterId" class="stmpFooter">
  		<button class="{if this.data.currentSegment.segmentId == this.requestParam.allSegments[0].segmentId}hidden{/if}" href="javascript: void(0);" {on tap {fn:'changeCurrentSegment', scope: this, args:{indicator: 'previous'}}/}>${this.labels.tx_merci_text_booking_seat_previous_flight}</button> 
      {var label = this.getButtonLabel() /}
      <button {on tap {fn:"proceedToPayment", scope:this, args : {}} /}>${label}</button>
    	<button class="{if this.data.currentSegment.segmentId == this.requestParam.allSegments[this.requestParam.allSegments.length-1].segmentId}hidden{/if}" href="javascript: void(0);" {on tap {fn:'changeCurrentSegment', scope: this, args:{indicator:'next'}}/}>${this.labels.tx_merci_text_booking_seat_next_flight}</button>
    </footer>
	{/macro}

  {macro displayHelpMacro()}
    <aside id="help" class="">
      <header>
        <h1>Legend</h1>
      </header>
      {var helpList = this.getHelpList()/}
      <section id="seat-legend" class="">
        <ul>
          {for var i=0 ; i<helpList.length; i++}
             <li class="${helpList[i].classname}">${helpList[i].text}</li>
          {/for}
        </ul>
      </section>
      <footer class="aside-footer"><a href="javascript:void(0);" class="close" {on tap {fn:"toggleAnimateDisplay", scope:this, args:{element:'help'}} /}>Close</a></footer>
    </aside>
  {/macro}

  {macro displayFiltersMacro()}
    {var availableCharacteristics = this.constructCharacteristicsMap(this.data.currentSeatMap) /}
    {if !this.utils.isEmptyObject(availableCharacteristics)}
      <aside id="filters">
        <header>
          <h1>Seat Options <button data-control="reset" class="hidden">Reset All</button></h1>
        </header>
        <section id="filters-legend">
          {var totalFilteredSeats = this.getTotalSeatsCount(availableCharacteristics) /}
          <p id="seatsCount_${this.data.currentSegment.segmentId}">Seats available: <span id="seats-available_${this.data.currentSegment.segmentId}" data-info="seats-available">${totalFilteredSeats}</span></p>
          <p id="optionsSelected_${this.data.currentSegment.segmentId}">Options selected: <span id="options-selected_${this.data.currentSegment.segmentId}" data-info="options-selected">${this.data.selectedFilters.length}</span></p>
          <ul class="list-view" id="seatOptions">
            {for var i=0 ; i<availableCharacteristics.length ; i++}
              {var availableCharacteristic = availableCharacteristics[i] /}
              <li class="fltr" id="${availableCharacteristic.characteristicId}_${this.data.currentSegment.segmentId}">
                <a href="#" {on tap {fn:"selectCharacteristic", scope:this, args:{characteristic:availableCharacteristic.characteristicId}} /}>${availableCharacteristic.characteristic} <small>(${availableCharacteristic.seatsCount} available)</small></a>
              </li>
            {/for}
          </ul>
        </section>
        <footer class="aside-footer"><a href="javascript:void(0);" class="close" {on tap {fn:"toggleAnimateDisplay", scope:this, args:{element:'filters'}} /}>Close</a></footer>
      </aside>
    {/if}
  {/macro}

  {macro createSeatMaps()}
    {var allSegments = this.requestParam.allSegments/}
    {for var i=0; i<allSegments.length; i++}
      {var colsList = this.getColumsList(allSegments[i].segmentId) /}
      <li class="stmpPanelLi" data-equipment="${allSegments[i].equipmentName}" data-cols="${colsList.length}" id="seatMap_${i}" >
        {var isSeatmapEligible = this.isSeatEligibleSegment(allSegments[i].segmentId) /}
        {if isSeatmapEligible}
          <div class="sm-flex" id="seatDeck_${i}">
            {var seatMap = this.getSeatMapForParticularSegment(allSegments[i].segmentId) || {}/}
            {if !this.utils.isEmptyObject(seatMap)}
              {if !this.utils.isEmptyObject(seatMap.seatMapPanel) && this.utils.booleanValue(seatMap.seatMapPanel.displaySeatMap)}
                {var whichDeck = this.getWhichDeck(i) /}
                {if this.isUpperDeckPresent(seatMap)}
                  <p class="sm-decksLink">
                    <a href="javascript:void(0);" {if whichDeck == 'MAIN'}class="active"{/if} id="lower_deck_${i}" {on tap {fn:'changeCurrentDeck', scope: this, args:{deck:'MAIN',index:i}}/}>Lower Deck</a>&nbsp;|&nbsp;
                    <a href="javascript:void(0);" {if whichDeck == 'UPPER'}class="active"{/if} id="upper_deck_${i}" {on tap {fn:'changeCurrentDeck', scope: this, args:{deck:"UPPER",index:i}}/}>Upper Deck</a>
                  </p>
                {/if}
                {var decksData = this.getDecksData(seatMap, whichDeck) /}
                {var rows = decksData.rows || [] /}
                {for var rowInt=0; rowInt<rows.length; rowInt++}
                  {var row = rows[rowInt] /}
                  {if !this.utils.isEmptyObject(row.facilities) && this.isFacilityInFront(row.facilities)}
                    {call printFacilities(row,rowInt,seatMap,'front') /}
                  {/if}
                  {if this.isBassinetInRow(row)}
                    {call printBassinet(row,rowInt,seatMap) /}
                  {/if}
                  {call printSeat(row,rowInt,seatMap) /}
                  {if !this.utils.isEmptyObject(row.facilities) && this.isFacilityInRear(row.facilities)}
                    {call printFacilities(row,rowInt,seatMap,'rear') /}
                  {/if}
                {/for}
              {else/}
                <h1 class="msg">
                  ${this.errorStrings[2130037].localizedMessage}
                </h1>
              {/if}
            {else/}
              
            {/if}
          </div>
        {else/}
          <h1 class="msg">
            ${this.errorStrings[2130037].localizedMessage}
          </h1>
        {/if}
      </li>
    {/for}
  {/macro}

  {macro printFacilities(row, rowInt, SeatMap, facilityPosition)}
    {var facilities = row.facilities || [] /}
    {var segmentId = SeatMap.segmentId /}
    {var columnsList = SeatMap.columnsList /}
    {var aircraftFacilities = SeatMap.seatMapPanel.dictionary.facilities||{} /}
    {var facilitiesMap = this.constructFacilitiesMap(row,aircraftFacilities, columnsList, facilityPosition) /}
    <div class="sm-row" id="facility_${rowInt}">
      {for var facility=0; facility<facilitiesMap.length; facility++}
        <div id="seat_${segmentId}_${rowInt}_${facility}"> 
          {if facilitiesMap[facility] == '-'}
            <div class="sm-aisle" data-column="${columnsList[facility]}"> </div>
          {else/}
            {var className = this.getFacilitiesClassName(facilitiesMap[facility]) /}
            <div class="${className}" data-column="${columnsList[facility]}"> </div>
          {/if}
        </div>
      {/for}
    </div>
    <div class="seatSelection" id="paxPanel_${segmentId}_${rowInt}"></div>
  {/macro}

  {macro printBassinet(row,rowInt,SeatMap)}
    {var bassinetMap = this.getBassinetMap(row,SeatMap.columnsList) /}
    {var columnsList = SeatMap.columnsList /}
    {var segmentId = SeatMap.segmentId /}
    <div class="sm-row" id="bassinet_${rowInt}">
      {for var bassinetIndex=0; bassinetIndex<bassinetMap.length; bassinetIndex++}
        <div id="seat_${segmentId}_${rowInt}_${bassinetIndex}"> 
          {if bassinetMap[bassinetIndex] == '-'}
            <div class="sm-aisle" data-column="${columnsList[bassinetIndex]}"> </div>
          {else/}
            <div class="sm-bassinet" data-column="${columnsList[bassinetIndex]}"> </div>
          {/if}
        </div>
      {/for}
    </div>
    <div class="seatSelection" id="paxPanel_${segmentId}_${rowInt}"></div>
  {/macro}

  {macro printSeat(row,rowInt,SeatMap)}
    {if !this.utils.isEmptyObject(row.columns)}
      {var columnsList = SeatMap.columnsList /}
      {var segmentId = SeatMap.segmentId /}
      <div class="sm-row {if this.isSelectedSeatInRow(row,segmentId)}on{/if}" id="row_${rowInt}" data-row="${row.index}" >
        {for var columnId=0; columnId<columnsList.length; columnId++}
          {var seatNum = row.index+""+columnsList[columnId] /}
          {var isSeatFilter = this.isSeatFiltered(seatNum) /}
          {var missingSeat = this.isMissingSeat(row, columnsList[columnId]) /}
          <div id="seat_${segmentId}_${rowInt}_${columnId}">
            {if this.utils.isEmptyObject(columnsList[columnId])}
              <div class="sm-ailse"></div>
            {elseif this.isMissingSeat(row, columnsList[columnId])/}
              {var missingclassName = this.getFacilitiesClassName(missingSeat) || "sm-aisle" /}
              <div class=${missingclassName}></div>
            {else/}
              {if this.isSeatOccupied(row, columnsList[columnId])}
                <div class="sm-seat {if this.isSeatSelected(seatNum) || (seatNum == this.data.selectedSeat)} selected{else/}occupied {/if}" data-seat="${row.index}-${columnsList[columnId]}" data-column="${columnsList[columnId]}">
                  {if this.isSeatSelected(seatNum)}<span>${this.isSeatSelected(seatNum)}</span>{/if}
                </div>
              {else/}
                {if this.isChargeableSeat(row, columnsList[columnId])}
                  <div class="sm-seat chargeable {if this.isSeatSelected(seatNum) || (seatNum == this.data.selectedSeat)} selected {/if} {if this.utils.booleanValue(isSeatFilter)} filtered {/if}" data-seat="${row.index}-${columnsList[columnId]}" data-column="${columnsList[columnId]}" {on tap {fn:'selectSeat', scope: this, args:{seatNum:seatNum,element:'seat_'+segmentId+'_'+rowInt+'_'+columnId}}/}>{if this.isSeatSelected(seatNum)}<span>${this.isSeatSelected(seatNum)}</span>{/if}</div>
                {else/}
                  <div class="sm-seat {if this.isSeatSelected(seatNum) || (seatNum == this.data.selectedSeat)} selected {/if} {if this.utils.booleanValue(isSeatFilter)} filtered {/if}" data-seat="${row.index}-${columnsList[columnId]}" data-column="${columnsList[columnId]}" {on tap {fn:'selectSeat', scope: this, args:{seatNum:seatNum,element:'seat_'+segmentId+'_'+rowInt+'_'+columnId}}/}>{if this.isSeatSelected(seatNum)}<span>${this.isSeatSelected(seatNum)}</span>{/if}</div>
                {/if}
              {/if}
            {/if}
          </div>
        {/for}
      </div> 
      <div class="seatSelection" id="paxPanel_${segmentId}_${rowInt}">
        {section {
          id: 'seatTeaser_'+segmentId+"_"+rowInt,
          type: 'div',
          macro : {
            name : "createTeaserDiv",
            args : [row,segmentId,rowInt]
          },
          bindRefreshTo: [{
            to: 'selectedSeat',
            inside: this.data,
            recursive: true
          }]
        }/}
      </div>
    {/if}
  {/macro}

  {macro createTeaserDiv(row,segmentId,rowInt)}
    {if this.isSelectedSeatInRow(row,segmentId)}
      <section class="seatTeaser" {id 'seatTeaser'/}}>
        <div class="close" {on tap {fn:'clearSelectedSeat', scope: this,args:{refresh:true}}/}></div>
        <div id="pointer"></div>
        <div class="seatInfo before">
          {var selectedSeatData = this.getSeatData(this.data.selectedSeat) /}
          <span class="seatNo">${this.data.selectedSeat}</span> - <span class="seatPrice">{if selectedSeatData.price.value == 0}${this.labels.tx_pltg_text_Free}{else/}${selectedSeatData.price.value} ${selectedSeatData.price.currency.code}{/if}</span> - <span class="seatDescription">${selectedSeatData.description}</span>
        </div>
        {for var travellerIndex=0; travellerIndex<this.data.currentTravellersMap.travellers.length; travellerIndex++}
          {var seat = this.data.currentTravellersMap.travellers[travellerIndex].selectedSeat /}
          {var paxStatus = this.getDisplaySpanClass(travellerIndex) /}
          {var currentTraveller = this.data.currentTravellersMap.travellers[travellerIndex] /}
          {var spanId = 'passenger'+this.data.currentTravellersMap.segmentId+"_"+currentTraveller.paxNumber /}

          <span id="${spanId}">
            <div id="" class="paxseat {if paxStatus == 'delete'}current{/if}" {on tap {fn:'modifySeat', scope: this, args:{action: paxStatus, travellerId: currentTraveller.paxNumber, segmentId: this.data.currentSegment.segmentId, seatNum: this.data.selectedSeat, updateCurrentTravellerMap: true, rowInt: rowInt}}/}>
              <h3 class="Adult ">
                <strong>${currentTraveller.paxNumber}</strong>${currentTraveller.fullName}
              </h3>
              {if !this.utils.isEmptyObject(paxStatus)}
                <p>
                  ${currentTraveller.selectedSeat}
                  <span class={if paxStatus == 'change'}"change-link pax-desc"{else/}"icon-trash pax-desc"{/if}>{if paxStatus == 'change'}Change To: ${this.data.selectedSeat}{else/}{/if}</span>
                </p>
                {var paxSeat = this.getSeatData(currentTraveller.selectedSeat) /}
                <p>{if paxSeat.price.value == 0}${this.labels.tx_pltg_text_Free}{else/}${paxSeat.price.value} ${paxSeat.price.currency.code}{/if} - ${paxSeat.description}</p>
              {/if}
            </div>
          </span>
        {/for}
      </section>
    {/if}
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