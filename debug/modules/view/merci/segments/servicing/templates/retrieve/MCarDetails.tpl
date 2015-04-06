{Template{
  $classpath: "modules.view.merci.segments.servicing.templates.retrieve.MCarDetails",
  $hasScript: true
}}

  {macro main()}
    {foreach car in this.tripplan.car.bookings}
      {call carSection(car) /}
    {/foreach}
  {/macro}

  {macro carSection(car)}
    <article class="panel trip marginLeftZero">
      <header>
        <h1>
			${this.labels.tx_merci_text_mybook_yourcar}
          <button id="carToggle" class="toggle" type="button"
              aria-controls="car${car.itemId}" aria-expanded="true"
              {on click {fn: this.utils.toggleSection, scope: this.utils, args:this} /}>
            <span>Toggle</span>
          </button>
        </h1>
      </header>

      <section {id "car"+car.itemId /} aria-hidden="false">
        <div class="trip">
          <p>
            <strong>Company: </strong><span>${car.companyName}</span>
          </p>
          <p>
            ${this.utils.formatString(this.labels.tx_pltg_pattern_OneCarConfirmationNumber, car.confirmationNumber)}
          </p>

          <p><strong>${this.labels.tx_pltg_text_PickUpLabel}</strong></p>
          <p>${new Date(car.beginDate)|dateformat: "EEEE, MMMM dd, yyyy, HH:mm"}</p>
          <p>
            {if !this.utils.isEmptyObject(car.pickupCarCompanyBean) && car.pickupCarCompanyBean.address}
              ${this.utils.formatString(this.labels.tx_pltg_pattern_ConfCarLoc, car.pickupCarCompanyBean.address)}
            {else/}
              ${this.utils.formatString(this.labels.tx_pltg_pattern_ConfCarLocApt, car.beginCarLocationBean.locationBean.locationName)}
            {/if}
          </p>
          <p>${car.beginCarLocationBean.locationBean.cityName}</p>

          <p><strong>${this.labels.tx_pltg_text_DropOffLabel}</strong></p>
          <p>${new Date(car.endDate)|dateformat: "EEEE, MMMM dd, yyyy, HH:mm"}</p>
          <p>
            {if !this.utils.isEmptyObject(car.dropoffCarCompanyBean) && car.dropoffCarCompanyBean.address}
              ${this.utils.formatString(this.labels.tx_pltg_pattern_ConfCarLoc, car.dropoffCarCompanyBean.address)}
            {else/}
              ${this.utils.formatString(this.labels.tx_pltg_pattern_ConfCarLocApt, car.endCarLocationBean.locationBean.locationName)}
            {/if}
          </p>
          <p>${car.endCarLocationBean.locationBean.cityName}<p>
        </div>
      </section>

    </article>
  {/macro}

{/Template}