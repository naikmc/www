/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
// TODOC
{Template {
    $classpath:'aria.tester.runner.view.header.Header',
    $hasScript:true,
    $width : {"min":178},
    $height : {value:50},
     $css:['aria.tester.runner.view.header.HeaderCSS']
}}
    {macro main()}
        <div id="header">
            {section {
                id: "startButton",
                macro: "displayStartButton",
                bindRefreshTo : [{
                    inside : data.flow,
                    to : "currentState"
                }]
            }/}
            {section {
                id: "gauge",
                macro: "displayGauge",
                bindRefreshTo : [{
                    inside : data.campaign,
                    to : "progress"
                }]
            }/}
            {section {
                id: "errorCounter",
                macro: "displayErrorCounter",
                bindRefreshTo : [{
                    inside : data.campaign,
                    to : "errorCount"
                },{
                    inside : data.flow,
                    to : "currentState"
                }]
              }/}
        </div>
    {/macro}

    {macro displayStartButton()}
          {var cssclass = "button"/}
          {if this.isButtonDisabled()}
              {set cssclass += " disabled"/}
          {/if}

          <div
            {on click {fn:"_onStartTestsButtonClick", scope: this, args: {}}/}
            id="startTestsButton" class="${cssclass}">
            ${this.getButtonLabel()|escapeForHTML:false}
        </div>
    {/macro}

    {macro displayGauge()}
        {var progress = data.campaign.progress/}
        {var containerWidth = $hdim(25)/}

        {var progressText = "Progress : " + progress + "%" /}
        {var filledWidth = (containerWidth/100)*progress/}
        {var emptyWidth = Math.floor(containerWidth - filledWidth)/}
        <div id="testGauge" style="width:${containerWidth}px">
            <span id="gaugeEmpty" style="width:${emptyWidth}px">${progressText}</span>
            <span id="gaugeFilled" style="width:${filledWidth}px">${progressText}</span>
        </div>
    {/macro}

    {macro displayErrorCounter()}
        {var errorCount = data.campaign.errorCount/}
        {var classname = "errorCounterBox"/}
        {if errorCount === 0}
            {set classname += " noError"/}
            {if data.flow.currentState=="finished"}
                {set classname += "Finished"/}
            {elseif data.flow.currentState=="ongoing"/}
                {set classname += "Ongoing"/}
            {/if}
        {else/}
            {set classname += " error"/}
        {/if}
        {if (data.flow.currentState!="finished")}
            {set classname += "Pushed"/}
        {/if}
        <div {on click {fn:"_onErrorCountClick", scope: this, args: {}}/}
        class="${classname}" title="${errorCount} failed test${errorCount!=1?"s":""}">
            ${errorCount}
        </div>
    {/macro}
{/Template}
