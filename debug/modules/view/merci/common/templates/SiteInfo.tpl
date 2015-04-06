{Template {
  $classpath:'modules.view.merci.common.templates.SiteInfo',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript']
}}

	{macro main()}
		
		// set header
		${this.moduleCtrl.setHeaderInfo({title:'Site Configuration'})|eat}
		
		// get site request params
		{var utils = modules.view.merci.common.utils.MCommonScript/}
		{var rqstParams = this.moduleCtrl.getModuleData().servicing.site.requestParam/}

		<div style="padding-left: 5px; padding-right: 5px; padding-top:5px;">
			<table width="100%" border="1">
				<tr>
					<th colspan="2">SITE CONFIGURATION</th>
				</tr>
				<tr>
					<td>Site Code</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.sitecode)}
							${rqstParams.siteConfig.sitecode}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Name space</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.namespace)}
							${rqstParams.siteConfig.namespace}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Webapp</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.webapp)}
							${rqstParams.siteConfig.webapp}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Dynamic Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.siteInfo.dynamicVersion)}
							${rqstParams.siteConfig.siteInfo.dynamicVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Site Language</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.siteLanguage)}
							${rqstParams.siteConfig.siteLanguage}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Site Locale</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.siteLocale)}
							${rqstParams.siteConfig.siteLocale}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Current Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.currentVersion)}
							${rqstParams.siteConfig.currentVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Static Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.staticVersion)}
							${rqstParams.siteConfig.staticVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>JSLib Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.JSLibVersion)}
							${rqstParams.siteConfig.JSLibVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Standard Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.standardVersion)}
							${rqstParams.siteConfig.standardVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>PlanitGo Version</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.siteConfig.planitGoVersion)}
							${rqstParams.siteConfig.planitGoVersion}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Country Name</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.countryName)}
							${rqstParams.countryName}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>Country Code</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.countryCode)}
							${rqstParams.countryCode}
						{else/}
							--
						{/if}
					</td>
				</tr>
				<tr>
					<td>IP Address</td>
					<td>
						{if !utils.isEmptyObject(rqstParams.ipAddress)}
							${rqstParams.ipAddress}
						{else/}
							--
						{/if}
					</td>
				</tr>
			</table>
		</div>
	{/macro}
{/Template}