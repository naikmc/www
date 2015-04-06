{Template {
  $classpath: 'modules.view.merci.segments.booking.templates.farereview.Minirule',
  $hasScript:true
}}
{macro main()}
<div class="mainwrapper margin30">
    {var catLen = ruleData.length/}
   <div id="nav" class="nav">
    <a class="a-left disabled" {id "prev1" /} {on click {fn: 'navigate',args: {link: 'prev'}}/}></a>
    <a class="a-right" {id "next1" /} {on click {fn: 'navigate',args: {link: 'next'}}/}></a>
    <div class="navitem active">1</div>
    {for var ci=1;ci<catLen;ci++}
      <div class="navitem">${ci}</div>
    {/for}
  </div>
  <div {id "wrapper" /} class="wrapper">
    <div class="scroller" {id "scroller" /}>
      <ul class="thelist">
        {for var rules in ruleData}
          {call displayRuleTitle(rules)/}
        {/for}
      </ul>
    </div>
  </div>
  <div class="msk" id="testMsk">&nbsp;</div>
</div>
  <div class="popup facs" style="display: none;">
    {@html:Template {
      classpath: "modules.view.merci.segments.booking.templates.farereview.MFareCondition",
      data: {
        'labels': this.data.labels,
        'siteParams': this.data.siteParam,
        'rqstParams': this.data.requestParam
      }
    }/}
  </div>
{/macro}
{macro displayRuleTitle(rules)}
    <li class="lists">
      {var mainRule = ruleData[rules] /}
      {var assumptionText = mainRule.assumptionText /}
      <div class="header">${mainRule.name}</div>
      {var listFareComponents = mainRule.listFareComponent/}
      {for var listFareComponent in listFareComponents}
      {var itr = listFareComponents[listFareComponent]/}
      //to make content expanded or not, based in site parameter
      {var isExpandable = this.data.siteParam.siteExpandMiniRule/}
      {var isExpand = "close"/}
      {if isExpandable.toLowerCase() == 'true'}
      {set isExpand = "open"/}
      {/if}
      {set itr.show = isExpand/}
          {section {
                macro : {
                  name : "displayIternary",
                  args: [itr,assumptionText]
                },
                type : "article",
                attributes : {
                    classList : [
                        "panel","blackColor"
                    ]
                },
                bindRefreshTo : [{
                  to : "show",
                  inside : itr
                }]
            } /}
      {/for}
    </li>
{/macro}
{macro displayIternary(itr,assumptionText)}
      <h2 class="${itr.show}">${itr.from} - ${itr.to}<span {on click {fn: 'showHide',args: {itr: itr}}/}></span></h2>
      <section class="${itr.show}">
      {var listSituations = itr.listSituation /}
      {var lfLen = listSituations.length /}
      {var noSituation = false /}
      {if lfLen == 1}
        {set noSituation = true /}
      {/if}
      {for var i = 0; i < lfLen; i++}
      {var condition = itr.listSituation[i]/}
      {call displayConditions(condition,assumptionText,noSituation)/}
     {/for}
     <a href="javascript:void(0);" class="popup-fare-cond displayBlock" {on click {fn:'openFareCondition'}/}>${this.data.labels.tx_merci_text_booking_full_fare}</a>
     </section>
{/macro}
{macro displayConditions(condition, aText, noSituation)}
        {if condition.name!= ""}
        <h3>${condition.name}</h3>
        {/if}
        {var listrules = condition.listRule/}
        {var lsLen = 0/}
        {if listrules != 'undefined' && listrules instanceof Object}
        {set lsLen = Object.keys(listrules).length /}
        {/if}
           <dd>
           {if noSituation && lsLen == 1}
           <h3>${aText}</h3>
           {/if}
          {for var listrule in listrules}
            {if listrule != 'aria:parent'}
              {var rules = condition.listRule[listrule]/} /*Array for rules[ADT/CHD/INF]*/
              {var len = Object.keys(rules).length /}
              {var icon = ''/}
              {if len > 2}
                <dl>
              {/if}
              {for var i = 0;i <len; i++}
               {for var key in rules[i]}
                  {if len > 2}
                    {set icon = '<i class="icon-'+key+'"></i><br/>'/}
                  {/if}
                  {if key != 'aria:parent'}
                    {var a = rules[i][key]/}
                    {if len <= 2}
                      <dl>
                    {/if}
                    ${a}${icon}
                    {if len <= 2}
                      </dl>
                    {/if}
                  {/if}
              {/for}
              {/for}
              {if len > 2}
                </dl>
              {/if}
            {/if}
          {/for}
            </dd>
  {/macro}
  {/Template}