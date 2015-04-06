{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.CountryListPrompt',
  $hasScript : true
}}

/* This panel is used to render the country list prompt */
{macro main()}
  {var cpr = moduleCtrl.getCPR() /}
  <div class="popUpWrapperaCKIN fwie {if aria.core.Browser.name == "IE"}ie{/if}">
    <div class="panelWrapperInner">
      <div class="panelContent">
        <div class="content padall">
          <div>
            <span class="cityPair"><span class="strong">Select Country</span></span>
            /* cross icon div for prompt, which acts like close button */
            <span id="calendarClose" class="cross"
              {var handlerName = MC.appCtrl.registerHandler(this.onCloseClick, this , {refid:data.refid} )/}
              ${uiResponseEvent}="${handlerName}(event);">
              &nbsp;
            </span>
          </div>
          /* Side div which contains all the alphabets */
          <div id="page" class="marginTop ">
            <div id="sidebar">
              <div id="navWrapper" {if touchPhone}class="navWrapper"{/if}>
                <ul id="navScroller" {if touchPhone} class="scrollable vertical" style="-webkit-transform: translate3d(0px, 0px, 0px);" {/if}>
                  {var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" /}
                  {foreach letter in alphabets}
                    <li {if letter == 'A'} class="current" {/if} id="list_${letter_index}" >
                      <a href="javascript:void(0)"
                        {on click {fn : "changetoCurrent" , args : {index : letter_index , letter : letter} } /}>
                        ${letter}
                      </a>
                    </li>
                  {/foreach}
                </ul>
              </div>
            </div>
            /* main div which renders all the countries listed under selected alphabet */
            <div class="contentS" id="alisted">
            {section {
              id:"countryList",
              macro: {name:'displayCountries', args: [cpr], scope:this}
            }/}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/macro}

{macro displayCountries(cpr)}
  <article id="contentWrapper" {if touchPhone}class="navWrapper"{/if}>
      <ul id="contentScroller" {if touchPhone} class="scrollable vertical" style="-webkit-transform: translate3d(0px, 0px, 0px);" {/if}>
        /* requirement for country code with size 2 */
        {if data.code == "2"}
          {var countries = cpr.countryList[0] /}
        {/if}
        /* requirement for country code with size 3 */
        {if data.code == "3"}
          {var countries = cpr.countryList[1] /}
        {/if}

        {var itemsWithSameFirstletter = countries[selectedLetter] /}
        {foreach item in itemsWithSameFirstletter}
          /* link for each and every country, when clicked gets selected */
          <li>
             <a href="javascript:void(0)"
                  {on click { fn : "onCountryLink" , args : {code:item[0] , sec : data.sec , cust : data.cust , prod:data.prod , refid : data.refid}}/}>
                  ${item[1]} &nbsp;
                  ${item[0]} <br>
              </a>
            </li>
          {/foreach}
      </ul>
    </article>
{/macro}

{/Template}