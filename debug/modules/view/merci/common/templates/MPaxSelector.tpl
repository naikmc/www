{Template{
  $classpath: "modules.view.merci.common.templates.MPaxSelector",
   $macrolibs: {
  	common: 'modules.view.merci.common.utils.MerciCommonLib',
  },
  $hasScript: true
}}

/**
* This tpl accepts the following data :
* passengers : array of all the traveller objects that are got from the listTraveller bean
* selectBinding : a json object with the keys 'inside' and 'to', which specify the object inside which and the value to which the tpl refresh is bound
* selectCallBack : the reference to the callBack function from the calling tpl
* selectedPaxIndex : the index of the pax which is selected by default
**/

   {macro main()}
     <div class = 'carrousel-header'>
  		<a class="" {id 'prevPax' /}  {on click {fn: 'previousPax', scope: this}/}>

  		</a>
  		<div {id 'pax_dynaScroller' /} class="carrousel-content">
  			<ol id="pax_olScroll">
        {var isRTLLang= this.isRTLLanguage() /}
        //fix for RTL language given as part of PTR 08587995 [Medium]: MeRCI R18 AeRE17.2 NonReg : IA : default pax is 2nd pax on seat map page for RTL
        {if isRTLLang}
          {var paxLength=this.data.passengers.length /}
            {for var p=paxLength-1; p>=0; p--}
                <li id="pax_liScroll_${p}"><span data-paxinfo="paxName">${this.data.passengers[p].fullName}</span></li>
            {/for}
        {else/}
  			{foreach passenger in this.data.passengers}
  				<li id="pax_liScroll_${passenger_index}"><span data-paxinfo="paxName">${passenger.fullName}</span></li>
  			{/foreach}
        {/if}
  			</ol>
  		</div>
  		{call common.createDynaCrumbs('pax',this.data.passengers.length)/}
  		<a class=""  {on click {fn: 'nextPax', scope: this}/}>

  		</a>
	  </div>
  {/macro}


{/Template}