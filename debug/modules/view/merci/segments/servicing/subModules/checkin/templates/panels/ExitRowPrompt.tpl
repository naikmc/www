{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.ExitRowPrompt',
 $macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.templates.lib.Common'
  },
$hasScript:true
}}

/* Function to render the exit row seat prompt  */
{macro main(args)}

{var label = args.moduleCtrlData.labelDetails /}
  {var cpr = moduleCtrl.getCPR() /}
  {var selectedcpr = moduleCtrl.getSelectedPax() /}
  {var productView = cpr.customerLevel[0].productLevelBean/}
  {var emergnecyExitSeat =moduleCtrl.getEmergencyExitSeat()/}
  {var messageNotLoaded = true /}

  /*calling for initiate acceptance exitrow prompt*/
  {if moduleCtrl.getExitRowListPopupShow().grpPaxInfos.length > 0}
  {set emergnecyExitSeat =moduleCtrl.getExitRowListPopupShow() /}
  {/if}

  <div class='sectionDefaultstyle'>
  <div id="exitRowConf" class="dialog native" style="display:block">
  <div class="glosyEffect">
  <span class="firstBlock"></span><span class="secondBlock"></span><span class="thirdBlock"></span>
  </div>
     {if productView != null}
          {foreach selection in  selectedcpr}


                    {if emergnecyExitSeat.grpPaxInfos && emergnecyExitSeat.grpPaxInfos.length > 0 && messageNotLoaded}
                      //<p>${emergnecyExitSeat.grpPaxInfos[0].longTextSegment.text}</p>-->
                      <p>${label.Message}.</p>
                      {set messageNotLoaded = false /}
                    {/if}

                    <!-- Passengers -->

                    /* Display the information of passengers */
                    /*{foreach customer inArray selection.customer}
                        {var custId = "" /}
                        <ul class="padTop checkinCS padleftFlightAlignPax" >
                          {foreach productIdentifier in cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean}
                            {if productIdentifier.referenceQualifier == "DID" }
                              {set custId = productIdentifier.primeId /}
                            {/if}
                          {/foreach}
                          {foreach grpPaxInfo in emergnecyExitSeat.grpPaxInfos}
                            {if grpPaxInfo.idSections[0].primeId == custId}
                             <li id="pax${customer_index}" class="pax displayInline strong
                            {if cpr.customerLevel[customer].otherPaxDetailsBean[0].type == "F"}female{/if}">
                            <label>
                              ${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}&nbsp;
                            </label>
                            </li>
                            {/if}
                          {/foreach}

                        </ul>
                    {/foreach}*/

                    <div>
                    {foreach customer inArray selection.customer}
                        {var custId = "" /}
                        <ul>
                          {foreach productIdentifier in cpr.customerLevel[customer].productLevelBean[selection.product].productIdentifiersBean}
                            {if productIdentifier.referenceQualifier == "DID" }
                              {set custId = productIdentifier.primeId /}
                            {/if}
                          {/foreach}
                          {foreach grpPaxInfo in emergnecyExitSeat.grpPaxInfos}
                            {if grpPaxInfo.idSections[0].primeId == custId}
                             <li class="{if cpr.customerLevel[customer].customerDetailsType == "C"}child{else /}paxIcon{/if}">
                            /*{if cpr.customerLevel[customer].otherPaxDetailsBean[0].type == "F"}female{/if}*/

                              ${cpr.customerLevel[customer].otherPaxDetailsBean[0].givenName} ${cpr.customerLevel[customer].customerDetailsSurname}

                            </li>
                            {/if}
                          {/foreach}

                        </ul>
                    {/foreach}
                    </div>
          {/foreach}

          /* radio buttons to select whether the passenger satisfies the exit row prompt conditions or not
          <ul class="padTop padBottom padleftFlightAlign">
              <li class="displayInline padTop">
                <input id="answer" type="radio" value="Y" name="answer">
                <label class="padLeft" for="yes">${label.Yes}</label>
              </li>
              <li class="displayInline padLeft">
                <input id="answer" type="radio" value="N" name="answer" checked>
                <label class="padLeft" for="no">${label.No}</label>
              </li>
            </ul>*/

       {/if}


                    <footer class="buttons">
                      /*{var handlerName = MC.appCtrl.registerHandler(this.onContinue, this, {value : 'Y'})/}*/
                      <button {on tap {fn:"onContinue", args:{value : 'Y'}} /} class="validation active" type="button">${label.Confirm}</button>
                      /*{var handlerName = MC.appCtrl.registerHandler(this.onCancelClick, this)/}
                      {var handlerName = MC.appCtrl.registerHandler(this.onContinue, this, {value : 'N'})/}*/
                      <button type="button" {on tap {fn:"onContinue", args:{value : 'N'}} /} class="cancel">${label.Cancel}</button>
                    </footer>
                  </div>



</div>

{/macro}
{/Template}