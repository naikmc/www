/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
// TODOC
{Template {
    $classpath:'aria.tester.runner.view.popup.Popup',
    $hasScript:true,
    $css:['aria.tester.runner.view.popup.PopupCSS']
}}
    {macro main()}
        {section {
            id:"mainSection",
            macro:"displayReport",
            bindRefreshTo:[{
                inside : data.flow,
                to : "currentState"
            }]
        }/}
    {/macro}
    {macro displayReport()}
        {if data.flow.currentState == "report"}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.report.Report"
            } /}
        {elseif data.flow.currentState == "failure"/}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.warning.Warning"
            } /}
        {elseif data.flow.currentState == "options"/}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.options.Options"
            } /}
        {/if}
    {/macro}
{/Template}
