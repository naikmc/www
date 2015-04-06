Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.DangerousGoodsScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA',
    'modules.view.merci.common.utils.MCommonScript'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
    this.utils = modules.view.merci.common.utils.MCommonScript;
  },

  $prototype: {
    $displayReady: function() {
      this.$logInfo('DangerousGoodsScript::Entering displayReady function');

      var pageData = this.moduleCtrl.getModuleData().checkIn;

      if (!pageData && jsonResponse && jsonResponse.data && jsonResponse.data.checkIn) {
        pageData = jsonResponse.data.checkIn;
      }

      this.label = pageData.MDangerousGoods_A.labels;
      this.siteParams = pageData.MDangerousGoods_A.siteParam;
      this.rqstParams = pageData.MDangerousGoods_A.requestParam;
      this.moduleCtrl.setHeaderInfo(this.label.Title, this.rqstParams.bannerHtml, this.siteParams.homeURL, true);
    },
    $viewReady: function() {

      this.$logInfo('DangerousGoodsScript::Entering Viewready function');

      if (this.moduleCtrl.getEmbeded()) {
        jQuery("[name='ga_track_pageview']").val("Dangerous goods");
        window.location = "sqmobile" + "://?flow=MCI/pageloaded=DangerousGoods";

      } else {
        var GADetails = this.moduleCtrl.getGADetails();
       
        this.__ga.trackPage({
          domain: GADetails.siteGADomain,
          account: GADetails.siteGAAccount,
          gaEnabled: GADetails.siteGAEnable,
          page: 'Dangerous goods',
          GTMPage: 'Dangerous goods'
        });
        
      }

      /*GOOGLE ANALYTICS
       * */

      //FOR PAGE
      /*if(JSONData.parameters.SITE_MCI_GA_ENABLE)
     {
      ga('send', 'pageview', {'page': 'Dangerous goods','title': 'Your Dangerous goods'});
    }*/



    },
    onBackClick: function() {
      this.moduleCtrl.onBackClick();
    }
  }
})