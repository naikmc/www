{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.panels.Messages'
}}
/* This function is used to display the error messages in messageErrorCKIN */
{macro main()}
  {if data.type == "error"}
    <div class="msg warning">
      <ul>
        {for var i = 0 ; i < data.messages.length ; i++}
          <li>
            {if data.messages[i].code != null && data.messages[i].code != "" && false}
              ${data.messages[i].code} -
            {/if}
            ${data.messages[i].localizedMessage|escapeForHTML:false}
          </li>
        {/for}
      </ul>
    </div>
 /* This function is used to display the warning messages in messageAlertCKIN */
  {elseif data.type == "warning" /}
    <div class="msg info">
      <ul>
        {for var i = 0 ; i < data.messages.length ; i++}
          <li>
            {if data.messages[i].code != null && data.messages[i].code != "" && false}
              ${data.messages[i].code} -
            {/if}
            ${data.messages[i].localizedMessage|escapeForHTML:false}
          </li>
        {/for}
      </ul>
    </div>
 /* This function is used to display the Success messages in messageAlertCKIN */
  {elseif data.type == "success" /}
    <div class="msg validation">
      <ul>
        {for var i = 0 ; i < data.messages.length ; i++}
          <li>
            {if data.messages[i].code != null && data.messages[i].code != "" && false}
              ${data.messages[i].code} -
            {/if}
            ${data.messages[i].localizedMessage|escapeForHTML:false}
          </li>
        {/for}
      </ul>
    </div>
 /* This function is used to display the question messages in messageAlertCKIN */
  {elseif data.type == "question" /}
    <div class="msg question">
      <ul>
        {for var i = 0 ; i < data.messages.length ; i++}
          <li>
            {if data.messages[i].code != null && data.messages[i].code != "" && false}
              ${data.messages[i].code} -
            {/if}
            ${data.messages[i].localizedMessage|escapeForHTML:false}
          </li>
        {/for}
      </ul>
    </div>
  {/if}
{/macro}
{/Template}