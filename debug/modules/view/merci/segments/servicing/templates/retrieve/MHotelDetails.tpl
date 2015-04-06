{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MHotelDetails",
  $hasScript: true
}}

  {macro main()}
    {foreach hotel in this.tripplan.hotel.bookings}
      {call hotelSection(hotel) /}
    {/foreach}
  {/macro}

  {macro hotelSection(hotel)}
    {var ptyInfo = hotel.hotel /}
    {var htlInfo = hotel.hotelInformation /}
    <article class="panel trip marginLeftZero">
      <header>
        <h1>
		  ${this.labels.tx_merci_text_mybook_yourhotel}
          <button id="hotelDetailsToggle" class="toggle" type="button"
              aria-controls="hotel${hotel.itemId}" aria-expanded="true"
              {on click {fn: this.utils.toggleSection, scope: this.utils, args:this} /}>
            <span>Toggle</span>
          </button>
        </h1>
      </header>

      <section {id "hotel"+hotel.itemId /} aria-hidden="false">
        <div class="trip">
          <p>
            <strong>Company: </strong><span>${ptyInfo.company}</span>
          </p>

          {call reservationDetails(hotel) /}
          {call contactDetails(ptyInfo, htlInfo) /}
          {call roomDetails(hotel, ptyInfo) /}

        </div>
      </section>

    </article>
  {/macro}

  {macro reservationDetails(hotel)}
    <p>
      ${this.utils.formatString(this.labels.tx_pltg_pattern_HotelReservationNumber, hotel.confirmationNumber)}
    </p>

    <p><strong>${this.labels.tx_pltg_text_HotelCheckInTitle}</strong></p>
    <p>${new Date(hotel.beginDate)|dateformat: "EEEE, MMMM dd, yyyy"}</p>
    <p><strong>${this.labels.tx_pltg_text_HotelCheckOutTitle}</strong></p>
    <p>${new Date(hotel.endingDate)|dateformat: "EEEE, MMMM dd, yyyy"}</p>

    <p>
      {if hotel.numOfNights == 1}
        ${this.labels.tx_pltg_text_OneNight}
      {else/}
        ${this.utils.formatString(this.labels.tx_pltg_pattern_XNights, hotel.numOfNights)}
      {/if}
    </p>
  {/macro}

  {macro contactDetails(ptyInfo, htlInfo)}
    <p><strong>${ptyInfo.hotelName}</strong></p>
    {var address = htlInfo.address /}
    <p>${address.firstLine}</p>
    <p>${address.secondLine}</p>
    <p>${address.zipCode} ${address.city}, ${address.country}</p>
    <p>${address.state}</p>

    {if htlInfo.phoneNumber}
      <p>
        <strong>${this.utils.formatString(this.labels.tx_pltg_pattern_Telephone, htlInfo.phoneNumber)}</strong>
      </p>
    {/if}
    {if htlInfo.faxNumber}
      <p>
        <strong>${this.utils.formatString(this.labels.tx_pltg_pattern_Fax, htlInfo.faxNumber)}</strong>
      </p>
    {/if}
    {if htlInfo.telexNumber}
      <p>
        <strong>${this.utils.formatString(this.labels.tx_pltg_pattern_Telex, htlInfo.telexNumber)}</strong>
      </p>
    {/if}
  {/macro}

  {macro roomDetails(hotel, ptyInfo)}
    {if this.showDescFromProvider(ptyInfo)}
      {foreach roomDesc inArray hotel.room.listProviderRoomRateDescription}
        <p>
          ${roomDesc}
          {if roomDesc_index == 0}
            (${hotel.room.specialRoomRate.rateCode})
          {/if}
        </p>
      {/foreach}
    {else/}
      <p>
        <strong>${this.labels.tx_pltg_text_Room}</strong>
        {if hotel.room.numberOfBeds == 1}
          ${hotel.room.numberOfBeds}
        {/if}
        ${hotel.room.toomTypeName} (${hotel.room.specialRoomRate.rateCode})
      </p>
    {/if}
  {/macro}

{/Template}