/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
// Default template LCResourceHandler
{Template {
    $classpath : 'aria.widgets.form.list.templates.LCTemplate',
    $extends : 'aria.widgets.form.list.templates.ListTemplate'
}}

    {macro renderItem(item, itemIdx)}
        {var className = _getClassForItem(item)/}
        {var entry = item.object.entry/}

        <a href="javascript:void(0)" class="${className}" data-itemIdx="${itemIdx}" onclick="return false;">
            {if ! item.label}
                &nbsp;
            {elseif item.value.multiWordMatch/}
                ${item.label|escapeForHTML:{text:true}|highlightfromnewword:entry|escapeForHTML:false}
            {else/}
                ${item.label|escapeForHTML:{text:true}|starthighlight:entry|escapeForHTML:false}
            {/if}
        </a>
    {/macro}

{/Template}
