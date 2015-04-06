/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
// Default template for List Widget
{Template {
    $classpath:'aria.widgets.form.templates.TemplateMultiAuto',
    $extends :"aria.widgets.form.templates.TemplateMultiSelect"

}}
    {macro main()}
        // The Div is used to wrap the items with good looking border.
        {@aria:Div data.cfg}
                {section {id: 'Items', macro: 'renderList'} /}
                {call footer()/}

        {/@aria:Div}
    {/macro}
    {macro renderCheckboxLabel(item)}
    	{if (item.value.label)}
            {set checkboxLabel = item.value.label/}
        {/if}
        {if (data.displayOptions.tableMode == true)}
            {set checkboxLabel = ""/}
        {/if}
    {/macro}
    {/Template}
