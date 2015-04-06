{Template {
$classpath:'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.DangerousGoods',
$macrolibs : {
    common : 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.lib.Common'
  },
$hasScript: true
}}

  {macro main()}

     {var label = this.moduleCtrl.getModuleData().checkIn.MSSCIDangerousGoods_A.labels /}

     <div class='sectionDefaultstyle sectionDefaultstyleSsci'>

        <section>
        <form>
          <article class="panel sear">
            <header>
              <h1>${label.Title}</h1>
            </header>
            <section class="form">
              <p>${label.GoodsDesc} </p>
              <p>${label.GoodsElaboration1}</p>
              <ol>
                <li>${label.GoodsElaboration2}</li>
                <li>${label.GoodsElaboration3}</li>
                <li>${label.GoodsElaboration4}</li>
                <li>${label.GoodsElaboration5}</li>
                <li>${label.GoodsElaboration6}</li>
                <li>${label.GoodsElaboration7}</li>
                <li>${label.GoodsElaboration8}</li>
                <li>${label.GoodsElaboration9}</li>
                <li>${label.GoodsElaboration10}</li>
                <li>${label.GoodsElaboration11}</li>
                <li>${label.GoodsElaboration12}</li>
                <li>${label.GoodsElaboration13}</li>
              </ol>

            </section>
          </article>
          <footer class="buttons">
            <button class="validation cancel" {on click "onBackClick"/} type="button">${label.Back}</button>
          </footer>
        </form>
        </section>

     </div>

    {/macro}
  {/Template}
