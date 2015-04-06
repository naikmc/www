{Template {
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MCyberSource',
	$dependencies: ['modules.view.merci.common.utils.MCommonScript']
}}
	
	{macro main()}
		{var labels = this.data.labels/}
		{var siteParams = this.data.siteParams/}
		{var rqstParams = this.data.rqstParams/}
		{var merciFunc = modules.view.merci.common.utils.MCommonScript/}
		
		{if merciFunc.isEmptyObject(rqstParams.callnumber)}
			{var recLoc = rqstParams.recLoc/}
			
			// for png URL [START] */
			{if siteParams.siteCyberSourcePNGURL != null && siteParams.siteCyberSourcePNGURL != ''}
				<p style="background:url(${siteParams.siteCyberSourcePNGURL}${recLoc})"></p>
				<img src="${siteParams.siteCyberSourcePNGURL}${recLoc}" alt=""/>
			{else/}
				<p style="background:url(${siteParams.siteCyberSourceServer}/fp/clear.png?org_id=${siteParams.siteCyberSourceOrgID}&m=1&session_id=${siteParams.siteCyberSourceMerchant}${recLoc})"></p>
				<img src="${siteParams.siteCyberSourceServer}/fp/clear.png?org_id=${siteParams.siteCyberSourceOrgID}&m=1&session_id=${siteParams.siteCyberSourceMerchant}${recLoc}" alt=""/>
			{/if}
			// for png URL [ END ] */
			
			// for JS URL [START] */
			{if siteParams.siteCyberSourceJSURL != null && siteParams.siteCyberSourceJSURL != ''}
				<script src="${siteParams.siteCyberSourceJSURL}${recLoc}" type="text/javascript"></script>
			{else/}
				<script src="${siteParams.siteCyberSourceServer}/fp/check.js?org_id=${siteParams.siteCyberSourceOrgID}&session_id=${siteParams.siteCyberSourceMerchant}${recLoc}" type="text/javascript"></script>
			{/if}
			// for JS URL [ END ] */
			
			// for png URL [START] */
			{if siteParams.siteCyberSourceFlashURL != null && siteParams.siteCyberSourceFlashURL != ''}
				<object type="application/x-shockwave-flash" data="${siteParams.siteCyberSourceFlashURL}${recLoc}" width="1" height="1" id="thm_fp">
					<param name="movie" value="${siteParams.siteCyberSourceFlashURL}${recLoc}"/>
					<div></div>
				</object>
			{else/}
				<object type="application/x-shockwave-flash" data="${siteParams.siteCyberSourceServer}/fp/fp.swf?org_id=${siteParams.siteCyberSourceOrgID}&session_id=${siteParams.siteCyberSourceMerchant}${recLoc}" width="1" height="1" id="thm_fp">
					<param name="movie" value="${siteParams.siteCyberSourceServer}/fp/fp.swf?org_id=${siteParams.siteCyberSourceOrgID}&session_id=${siteParams.siteCyberSourceMerchant}${recLoc}"/>
					<div></div>
				</object>
			{/if}
		{/if}
	{/macro}
	
{/Template}