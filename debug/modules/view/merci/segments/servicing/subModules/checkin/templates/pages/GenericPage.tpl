{Template {
  $classpath:'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.GenericPage',
  $hasScript:true
}}

  {macro main()}
    <div>
      {var embeded = moduleCtrl.getEmbeded() /}
      /* This div is to load header */
      /* This code is added for APP check. For APP native header should appear  */

      {if !embeded || operatingSystem != null && (operatingSystem.android != "Android" && (operatingSystem.iphone == null || operatingSystem.iphone.indexOf("iPhone") == -1))}

          {@html:Template {
            "classpath" : 'modules.checkin.templates.layouts.Header',
            "moduleCtrl": moduleCtrl,
            data : data
          }/}

      {/if}

      /* This div is used to load any messages associated with the current page*/
      {section {
        id: "messages",
        macro: {name: 'showMessages', scope: this}
      }/}        

      /* This div is to load template */
      {@html:Template {
        "classpath" : data.pageCfg[2],
        "moduleCtrl": moduleCtrl,
        data : data
      }/}

      /*{@html:Template {
        "classpath" : 'modules.checkin.templates.layout.Footer',
        "moduleCtrl": moduleCtrl,
        data : data
      }/}*/
    </div>
  {/macro}

  {macro showMessages()}
    {var messages = getMessages()/}
    {if !jQuery.isEmpty(messages)}
      <ul class="${type}">
        {foreach message in messages}
          <li>${message.localizedMessage}</li>
        {/foreach}
      </ul>
    {/if}
  {/macro}

{/Template}