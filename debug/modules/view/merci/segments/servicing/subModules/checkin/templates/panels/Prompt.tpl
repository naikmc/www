{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.panels.Prompt',
$hasScript:true
}}
/* This function is used to display the prompt regarding security questions while confirmation */
{macro main()}
  {var label = moduleRes.res.Prompt.label /}
  <div class="popUpWrapperaCKIN">
    <div class="panelWrapperInner">
      <div class="panelContent">
        <h1 class="posR">${label.PanelTitle}
          /* cross icon div for prompt, which acts like close button */
          <span id="calendarClose" class="cross"
            {var handlerName = MC.appCtrl.registerHandler(this.onCancelClick, this)/}
            ${uiResponseEvent}="${handlerName}(event);">
              &nbsp;
          </span>
        </h1>
        
        /* Security questions displayed are based on the actions in prompt bean*/
        {if data.promptBean.action == "BSQ"}
          <h1 class="cityPair fontArial">${label.Que1}</h1>
        {elseif data.promptBean.action == "BCI" /}
          <h1 class="cityPair fontArial">${label.Que2}</h1>
        {elseif data.promptBean.action == "FFS" /}
          <h1 class="cityPair fontArial">${label.Que3}</h1>
        {/if}
        <form>
          /* This loop gets all the security questions and displays them, with options to select yes or no */
          {foreach prompt in data.promptListBean}
            <ul class="padTop padBottom padleftFlightAlign">
              {foreach error in prompt.errors}
                <li>${error.errorWarningDescription.freeTexts[0]}</li>
              {/foreach}
            </ul>
            <ul class="padTop padBottom padleftFlightAlign">
              <li class="displayInline padTop">
                <input id="yes" type="radio" value="Y" name="answer">
                <label class="padLeft" for="yes">${label.Yes}</label>
              </li>
              <li class="displayInline padLeft">
                <input id="no" type="radio" value="N" name="answer" checked>
                <label class="padLeft" for="no">${label.No}</label>
              </li>
            </ul>
          {/foreach}
          <!-- TYPE A code -->
          <div class="buttonHolder">
            <div class="buttonRow buttonSmallright buttonDirection floatL">
              /* Cancel button  */
              <a href="javascript:void(0)"
                {var handlerName = MC.appCtrl.registerHandler(this.onCancelClick, this)/}
                ${uiResponseEvent}="${handlerName}(event);">
                <span>${label.Cancel}</span>
              </a>
            </div>
            <div class="buttonRow buttonSmallright buttonDirection floatR">
              /* Continue button  */
              <a href="javascript:void(0)"
                {var handlerName = MC.appCtrl.registerHandler(this.onOkClick, this)/}
                ${uiResponseEvent}="${handlerName}(event);">
                <span>${label.Ok}</span>
              </a>
            </div>
          </div>
        </form>
        <!-- end TYPE A code -->
        <div class="clear"></div>
      </div>
    </div>
  </div>
{/macro}
{/Template}