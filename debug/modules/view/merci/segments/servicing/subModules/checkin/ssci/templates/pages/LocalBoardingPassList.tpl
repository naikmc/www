{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.LocalBoardingPassList',
  $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
  $hasScript : true
}}

{macro main()}

<div class='sectionDefaultstyle sectionDefaultstyleSsci'>

<article class="carrousel-full" >
    <h1 data-flightinfo="route" data-location="#"></h1>
	{var headName ="" /}
	{var totalListTracker=-1 /}

    <ul id="listboxa">

    {foreach flight in this.sortedFlightList}
    
    {var flightWiseDoc = this.flightWiseDocs[flight] /}

		{var flightID = flight /}
		{set headName = flightWiseDoc[Object.keys(flightWiseDoc)[0]].departureCity +" - "+ flightWiseDoc[Object.keys(flightWiseDoc)[0]].arrivalCity /}

	  	{set totalListTracker+=1 /}
		  {var len = Object.keys(flightWiseDoc).length /}

      <li class="boardingindex">
      <button class="removeTripButton displayNone" id="remove_${flight}"{on tap { fn:"onRemoveClick", args: {mbps:flightWiseDoc}}/}></button>
      <article class="carrousel-full-item disable-select"
      {on tap { fn:"displayBPforSelectedFlights", args: {docs:flightWiseDoc, flight:flight }}/}
      {on longpress { fn:"onLongPressFlight", args: {flight:flight}}/}
      data-airp-list-tracker="${totalListTracker}" data-airp-points="${headName}">

          {var depDate = null /}
          <section class="boardingindex">
            <h3><strong>${len}</strong> Boarding pass</h3>
              <ul>
              	{foreach prd in flightWiseDoc}          		
					         {var paxName= prd.customerName /}
                   {set depDate= prd.depDate /}
                	 <li class = "boardingPax">${paxName.toLowerCase()}</li>
                {/foreach}
              </ul>

            {var date =new Date(depDate) /}
            <div>
              <time datetime="2013-02-22">
                <span data-flightinfo="day-number">${date.getUTCDate()}</span>
                  <span>
                    <span data-flightinfo="day-name">${this.getWeekDayUTC(date).substr(0,3)}</span>
                    <span data-flightinfo="month">${this.getMonthUTC(date)}</span>
                    <span data-flightinfo="year">${date.getUTCFullYear()}</span>
                  </span>
              </time>
            </div>
          </section>

      </article>
      </li>

      {/foreach}

    </ul>


    <footer>
      <ul id = "Indicator_details">
      </ul>
    </footer>

 </article>

<div class="popupBGmask" class="displayNone">&nbsp;</div>

<div class="dialog native" id="cancelConf" class="displayNone">
  <div class="glosyEffect"><span class="firstBlock"></span><span class="secondBlock"></span><span class="thirdBlock"></span></div>
  <p>${this.label.confirmDeleteBPmsg}</p>
  <footer class="buttons">
  <button id="okButton" class="validation active" type="submit">${this.label.yes}</button>   
  <button id="cancelButton" class="cancel" type="reset">${this.label.no}</button>
  </footer>
</div>
	<footer class="buttons">
      <button type="button" class="validation cancel" {on click "onBackClick"/}>${this.label.Cancel}</button>
    </footer>
</div>

{/macro}
{/Template}
