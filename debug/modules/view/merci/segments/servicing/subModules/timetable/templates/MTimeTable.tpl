{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTable',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript: true,
	 $macrolibs: {
    message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

	

{macro main()}
	
			{var labels = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.labels/}
			{var requestParam = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam/}
			{var siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam/}
			{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
	<section>
				{call includeError(labels) /}
				{call includeWarning(labels) /}

            <form>

		{if requestParam.dmIn.pageType != "ROUTE" }
			<nav class="tabs">
					<ul>

					{if !merciFunc.isEmptyObject(siteParams.timetableDefaultView) && siteParams.timetableDefaultView == "DAY"}
						<li><a href="javascript:void(0)" id="dayTab" class="navigation active" {on click {fn:changeTab, scope:this, args:{id:1, current:"dayTab", tochange:"weekTab"}}/}>${labels.tx_merci_text_tt_day_btn}</a></li>
						<li><a href="javascript:void(0)" id="weekTab" class="navigation" {on click {fn:changeTab, scope:this, args:{id:2, current:"weekTab", tochange:"dayTab"}}/}>${labels.tx_merci_text_tt_week_btn}</a></li>
					{elseif !merciFunc.isEmptyObject(siteParams.timetableDefaultView) && siteParams.timetableDefaultView == "WEEK"/}	
						<li><a href="javascript:void(0)" id="dayTab" class="navigation " {on click {fn:changeTab, scope:this, args:{id:1, current:"dayTab", tochange:"weekTab"}}/}>${labels.tx_merci_text_tt_day_btn}</a></li>
						<li><a href="javascript:void(0)" id="weekTab" class="navigation active" {on click {fn:changeTab, scope:this, args:{id:2, current:"weekTab", tochange:"dayTab"}}/}>${labels.tx_merci_text_tt_week_btn}</a></li>
					{/if}
					
					</ul>		
			</nav>
		{/if}	
		<article class="panel list">
		
		
			 {section {
				id: "ttTabContent",
				type: "div",
				macro: {name: "tabContent", scope : this},
				bindRefreshTo: [{to:"contentId", inside:this.ttData}],
			  }/}
			
			
		</article>
	  
	</form>
  
  
</section>
	
	
	{/macro}
	
	
	{macro tabContent()}
	
			{var labels = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.labels/}
			{var siteParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.siteParam/}
			{var globalList = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.globalList/}
			{var rqstParams = this.moduleCtrl.getModuleData().servicing.MTTBRE_A.requestParam/}
	
	{if this.ttData.contentId == 1}
			{@html:Template {
							classpath: "modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableDayView",
							data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'siteParams': siteParams,
								'globalList': globalList
							}
						}/}
	
		{elseif this.ttData.contentId == 2/}
		
		{@html:Template {
							classpath: "modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableWeekView",
							data: {
								'labels': labels,
								'rqstParams': rqstParams,
								'siteParams': siteParams,
								'globalList': globalList
							}
						}/}
		
		
		{/if}
	
	{/macro}
	
	
	{macro includeError(labels)}
		{section {
          type: 'div',
          id: 'errors',
          macro: {name: 'printErrors', args: [labels]},
          bindRefreshTo: [{inside: this.data, to: 'errorOccured'}]
        }/}
	{/macro}
	
	{macro printErrors(labels)}
	
		{if this.data.errors != null && this.data.errors.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_text_error_message != null}
				{set errorTitle = labels.tx_merci_text_error_message/}
			{/if}
			{call message.showError({list: this.data.errors, title: errorTitle})/}
		{/if}
	{/macro}
	
	
	{macro includeWarning(labels)}
		{section {
			id: 'warnings',
			bindRefreshTo : [{
        inside : this.data,
        to : "showWarning",
			}],
			macro : {
				name: 'printWarnings',
				args: [labels]
			}
		}/}
	{/macro}

	{macro printWarnings(labels)}
		{if this.infoMsgs!= null && this.infoMsgs.length > 0}
			{var errorTitle = ''/}
			{if labels != null && labels.tx_merci_warning_text != null}
				{set errorTitle = labels.tx_merci_warning_text/}
			{/if}
			{call message.showInfo({list: this.infoMsgs, title: errorTitle})/}
		{/if}
	{/macro}
{/Template}