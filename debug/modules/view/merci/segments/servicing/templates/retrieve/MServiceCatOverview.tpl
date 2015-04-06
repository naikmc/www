{Template{
	$classpath: 'modules.view.merci.segments.servicing.templates.retrieve.MServiceCatOverview',
	$hasScript: true
}}

  {macro main()}
	<div class="serviceCatalogPanel">
		{var labels = this.moduleCtrl.getModuleData().MServicesCatalog.labels/}
		{var reply = this.moduleCtrl.getModuleData().MServicesCatalog.reply/}
		{var request = this.moduleCtrl.getModuleData().MServicesCatalog.request/}
		{var config = this.moduleCtrl.getModuleData().MServicesCatalog.config/}

		{@html:Template {
			classpath: "modules.view.merci.segments.servicing.templates.services.MServicesCatalog",
			data: {
				'labels': labels,
				'reply': reply,
				'request': request,
				'config': config
			}
		}/}
	</div>
  {/macro}

{/Template}