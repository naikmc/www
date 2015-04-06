{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MTripList",
  $hasScript: true,
  $macrolibs: {message: 'modules.view.merci.common.utils.MerciMsgLib',tablet: 'modules.view.merci.common.utils.MerciTabletLib'}
}}

  {macro main()}

{if this.storage}
<div class='sectionDefaultstyle'>

{if !(this.utils.isEmptyObject(this.pnrList))}

<article class="carrousel-full" >
    <h1 data-flightinfo="route" data-location="#"></h1>
  {var headName ="" /}
  {var totalListTracker=-1 /}

    
    <ul id="listboxa">

    {foreach recLoc in this.sortedPNRs}
    {var pnr = this.pnrList[recLoc] /}

    {set totalListTracker+=1 /}
    {set headName= pnr.BCityName + " - " + pnr.ECityName /}
      <li>
      <button class="removeTripButton displayNone" id="remove_${recLoc}"{on tap { fn:"onRemoveClick", args: {pnr:recLoc}}/}></button>
      <article class="carrousel-full-item disable-select"
      {on tap { fn:"onTripClick", args: {recLoc: pnr.recLoc,lastName:pnr.lastName, bookingInfoFlag: pnr.bookingInfoFlag, cprInput:pnr.cprInput}}/}
      {on longpress { fn:"onLongPressTrip", args: {pnr:recLoc}}/}
      data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">

                  {if pnr.segmentDetails}
                  {foreach segment in pnr.segmentDetails}

                  {var depDate= new Date(segment.depDate) /}
                  {var depDay= depDate.getUTCDate() /}
                  {var weekday= this.getWeekDayUTC(depDate).substr(0, 3) /}
                  {var depMonth= this.getMonthUTC(depDate) /}
                  {var depYear= depDate.getUTCFullYear() /}

                  <section>
                    <h3><i aria-hidden="true" class="icon icon-tick"></i>${segment.departureCityCode} - ${segment.arrivalCityCode}</h3>
                    <time datetime="2013-02-22">
                        <span data-flightInfo="day-number">${depDay}</span>
                          <span>
                            <span data-flightInfo="day-name">${weekday}</span>
                            <span data-flightInfo="month">${depMonth}</span>
                            <span data-flightInfo="year">${depYear}</span>
                          </span>
                      </time>
                  </section>
                  {/foreach}

                  {else/}

                  {var depDate= new Date(pnr.BDate) /}
                  {var depDay= depDate.getUTCDate() /}
                  {var weekday= this.getWeekDayUTC(depDate).substr(0, 3) /}
                  {var depMonth= this.getMonthUTC(depDate) /}
                  {var depYear= depDate.getUTCFullYear() /}

                  <section>
                    <h3><i aria-hidden="true" class="icon icon-tick"></i>${pnr.BCityCode} - ${pnr.ECityCode}</h3>
                    <time datetime="2013-02-22">
                        <span data-flightInfo="day-number">${depDay}</span>
                          <span>
                            <span data-flightInfo="day-name">${weekday}</span>
                            <span data-flightInfo="month">${depMonth}</span>
                            <span data-flightInfo="year">${depYear}</span>
                          </span>
                      </time>
                  </section>

                  {/if}


      </article>
      </li>

    {/foreach}

    </ul>


    <footer>
      <ul id = "Indicator_details">
      </ul>
    </footer>

  </article>

  {/if}

  <aside>
  <nav class="buttons">
    <ul>
    <li><a class="navigation" {on click {fn: this.onRetrieveClick, scope: this} /} > {if this.labels.tripNotHere}${this.labels.tripNotHere}{else/}Your trip is not here?{/if}</a></li>
    </ul>
  </nav>
  </aside>


<div class="popupBGmask" class="displayNone">&nbsp;</div>

<div class="dialog native" id="cancelConf" class="displayNone">
  <div class="glosyEffect"><span class="firstBlock"></span><span class="secondBlock"></span><span class="thirdBlock"></span></div>
  <p>{if !jQuery.isUndefined(this.labels.confirmDeleteTripMsg)}${this.labels.confirmDeleteTripMsg}{else/}Are You Sure You Want To delete this trip?{/if}</p>
  <footer class="buttons">
  <button id="okButton" class="validation active" type="submit">{if !jQuery.isUndefined(this.labels.yes)}${this.labels.yes}{else/}Yes{/if}</button>
  <button id="cancelButton" class="cancel" type="reset">{if !jQuery.isUndefined(this.labels.no)}${this.labels.no}{else/}No{/if}</button>
  </footer>
</div>

</div>

{else/}
    <section>
      <form>
        {section {
          type: 'div',
          id: 'messages',
          macro: {name: 'showAllMessages', scope: message, args: [this.data.messages]},
          bindRefreshTo: [{inside: this.data, to: 'messages'}]
        }/}

        <article class="panel list triplist" id="tripList">
          <header>
            <h1>${this.labels.tx_merci_text_mytrip}</h1>
          </header>

          <section>
            <ul role="listbox" class="bookMarkClass">
              {set counter= 1 /}
              {foreach trip in this.pnrList}
                <li role="option" {on tap {fn: this.onPNRClick, scope: this, args: {"trip":trip,"id":"delTripList_"+counter}} /}>
                  <h2>
                    ${this.labels.tx_merci_text_booking_refnumber}&nbsp;
                    <span class="pnrRef">${this.utils.formatString(this.labels.tx_pltg_pattern_RecordLocator, trip.recLoc)}</span>
                  </h2>
                  {if trip.evoucher}
                    <p class="route">
                      <span>${this.labels.tx_pltg_text_EvoucherTrip}</span>
                    </p>
                  {else/}
                    <p class="route">
                      <span class="city">${trip.BCityName} <abbr>(${trip.BCityCode})</abbr></span>
                      <span class="dash">-</span>
                      <span class="city">${trip.ECityName} <abbr>(${trip.ECityCode})</abbr></span>
                    </p>
                    {if trip.BDate}
                      <p class="period">
                        {var bdate = new Date(trip.BDate) /}
                        <time class="date" datetime="${bdate|dateformat:"yyyy-MM-dd"}">
                          ${bdate|dateformat:"EEE dd MMM yyyy"}
                        </time>
                      </p>
                    {/if}
                  {/if}
                  <button id="delTripList_${counter}" role="checkbox" onclick="return false;" {on tap {fn:'onDelTripListData',args:{"keyData":trip.recLoc}}/} class="favdelete delClassReterieve"</button>
                </li>
                {set counter= counter+1/}
              {/foreach}
            </ul>
          </section>

          <footer>
            <p>${this.labels.tx_merci_text_is_trip_listed}</p>
            <a href="javascript:void(0)" class="secondary retrieve" {on click {fn: this.onRetrieveClick, scope: this} /}>
              ${this.labels.tx_merci_text_is_retrieve}
            </a>
            <p class="requiredText padLeft"><span class="mandatory">* </span><small>${this.labels.tx_merciapps_msg_delete}</small></p>
          </footer>
        </article>
      </form>
    </section>

  {/if}
  {/macro}
{/Template}