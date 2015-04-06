Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.DangerousGoodsScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {

    this.__ga = modules.view.merci.common.utils.MerciGA;
  },

  $prototype: {
    $displayReady: function() {
      this.$logInfo('DangerousGoodsScript::Entering displayReady function');


    },
    $viewReady: function() {
      this.$logInfo('DangerousGoodsScript::Entering Viewready function');

    },

    onBackClick: function() {
      this.moduleCtrl.onBackClick();
    }
  }
});