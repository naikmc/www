/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
// TODOC
{Template {
    $classpath:'aria.tester.runner.view.main.Main',
     $css:['aria.tester.runner.view.main.MainCSS'],
    $hasScript:true,
    $width : {"min":180},
    $height : {"min":342}
}}
    {macro main()}
        {section {
            id : "mainSection",
            macro: "sectionContent",
            bindRefreshTo : [{
                inside : data.view.configuration,
                to : "mini"
            }]
        }/}
    {/macro}
    {macro sectionContent()}
        {if data.view.configuration.mini}
            {@aria:Template {
                width:$hdim(180,1),
                height:$vdim(342,1),
                defaultTemplate:"aria.tester.runner.view.mini.Mini"
            } /}
        {else/}
            {@aria:Template {
                width:$hdim(180,1),
                height:$vdim(342,1),
                defaultTemplate:"aria.tester.runner.view.normal.Normal"
            } /}
        {/if}
    {/macro}
{/Template}
