Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.farereview.MFareConditionScript',
	$dependencies: [
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.StringBufferImpl'
	],
	$constructor: function() {

	},

	$prototype: {

		__getBaseParams: function() {

			// getting request parameters and attributes
			var rqstParams = this.data.rqstParams;

			var baseURL = new modules.view.merci.common.utils.StringBufferImpl();
			baseURL.append('PAGE_TICKET=' + rqstParams.reply.pageTicket);
			baseURL.append('&PLTG_NEXT_ACTION=' + this.pltgAction);
			baseURL.append('&PLTG_PNR_TRAVELLER_TYPES_TITLES=' + this.pnrTravellerTypesTitle);
			baseURL.append('&PNR_ORDER=0');
			baseURL.append('&RECORD_LOCATOR=' + this.recLoc);
			baseURL.append('&PLTG_RECORD_LOCATORS=' + this.recLoc);
			baseURL.append('&PLTG_PAGE_FROM=Mfare');
			baseURL.append('&result=json');

			return baseURL.toString();
		},

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MFareCondition",
						data:this.data
					});
			}
		},

		__openPanel: function(tab, section) {
			tab.setAttribute('aria-hidden', 'false');
			tab.setAttribute('aria-expanded', 'true');
			section.setAttribute('aria-hidden', 'false');

			// replace hidden and add loading icon (if required)
			section.className = section.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
			if (section.innerHTML == null || section.innerHTML == '') {
				section.className += ' loading';
			}
		},

		__closePanel: function(tab, section) {
			section.className += ' hidden';
			tab.setAttribute('aria-hidden', 'true');
			tab.setAttribute('aria-expanded', 'false');
			section.setAttribute('aria-hidden', 'true');
		},

		__onFareConditionCallBack: function(response, sectionId) {

			var catOneInfo = '';
			var catZeroInfo = '';
			var tab = document.getElementById('tab' + sectionId);
			var section = document.getElementById('panel' + sectionId);

			// parsing JSON response
			if (response.responseJSON != null && response.responseJSON.data.list != null && response.responseJSON.data.list.callCentres.LIST_CATEGORY != null) {
				var categoryLength = response.responseJSON.data.list.callCentres.LIST_CATEGORY.length;
				for (var v = 0; v < categoryLength; v++) {

					catZeroInfo = catZeroInfo + response.responseJSON.data.list.callCentres.LIST_CATEGORY[v].LIST_TRAVELLER[0].INFORMATION;
				}
			}

			// setting data is available from JSON response
			if ((catZeroInfo != null && catZeroInfo != '') || (catOneInfo != null && catOneInfo != '')) {
				section.className = section.className.replace(/(?:^|\s)loading(?!\S)/g, '');
				section.innerHTML = '<pre class="conditions">' + catZeroInfo + catOneInfo + '</pre>';
			} else {
				this.__closePanel(tab, section);
			}
		},

		fetchData: function(args, data) {

			var sectionId = data.sectionId;
			var params = this.__getBaseParams() + data.params;
			var tab = document.getElementById('tab' + sectionId);
			var section = document.getElementById('panel' + sectionId);

			if (section.className.indexOf('hidden') == -1) {
				this.__closePanel(tab, section);
			} else {

				// open section
				this.__openPanel(tab, section);

				// do a AJAX request
				if (section.innerHTML == null || section.innerHTML == '') {

					var request = {
						action: this.pltgAction,
						parameters: params,
						method: 'POST',
						expectedResponseType: 'json',
						cb: {
							fn: this.__onFareConditionCallBack,
							args: sectionId,
							scope: this
						}
					};

					modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
				}
			}
		},

		closePopup: function(args, data) {
			// close the popup
			this.moduleCtrl.closePopup();
		}
	}
});