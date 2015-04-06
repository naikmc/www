{Template {
  $classpath: 'modules.view.merci.common.templates.MMenuItems',
  $hasScript: true,
  $dependencies: ['modules.view.merci.common.utils.MCommonScript'],
  $css: ['modules.view.merci.common.templates.MMenuStyle']
}}

  {macro main()}
    // for binding
    {if jsonResponse.ui == null}
      ${jsonResponse.ui = {}|eat}
    {/if}
    
    {section {
      type: 'div',
      id: 'navbar',
      macro: {
        name: 'loadNav',
        scope: this
      }
    }/}
  {/macro}
 
  {macro loadNav()}
    {var tempData = this.customButton /}
	{var buttonNames = []/}
	{foreach buttons inArray tempData}
		{if this.isHomePage(buttons[3])}
			{var macroName = buttons[3].split("-")/}
			${buttonNames.push(macroName[0]+','+buttons[1]+','+buttons[2])|eat}
		{/if}
	{/foreach}
	
    <div class="burger">
      <ul {on click {fn: "toggleMenu"}/} class="sandwich">
        <li></li><li></li><li></li>
      </ul>
    </div>

     <div id="navbar-div" class="items" {on swipemove {fn :toggleMenuItem}/}>

		{foreach button inArray buttonNames}
			{var buttonArr = button.split(',')/}
			{set button = buttonArr[0]/}
			{if button === 'CUSTOM'}	
				{call customButtons(buttonArr[1],buttonArr[2]) /}

			{/if}
			
		{/foreach}
    </div>
  {/macro}
  
	{macro customButtons(label,url)}
		<li {on click {fn:'onClickURL',args:{"url":url,"label":label}}/}>
		
			<a id="hrefid" href="javascript:void(0);" class="">
			${label}</a>
		</li>
	{/macro}
{/Template}