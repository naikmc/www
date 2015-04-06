{Template {
	$classpath: 'modules.view.merci.segments.servicing.subModules.maintenancePage.templates.MaintenancePage',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript'],
	$hasScript:true,
	$macrolibs: {
		message: 'modules.view.merci.common.utils.MerciMsgLib'
  }
}}

	

	{macro main()}
		<section>
		{var labels = this.moduleCtrl.getModuleData().MaintenancePage.labels/}
			<div class="msg info">
				<ul>
					<li>
						${labels.tx_merci_text_maintenance_msg}
					</li>
				</ul>
			</div>
		</section>
	{/macro}
{/Template}