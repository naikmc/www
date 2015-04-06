Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.fqtv.MAlpiFQTVScript',
	$constructor: function() {
		pageObj = this;
	},

	$prototype: {

		__onAirportSelectCB: function(response, inputParams) {


		},

		$dataReady: function() {

		},

		$displayReady: function() {

		},

		getAirlineList: function() {
			if (this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.MALPI_A != null) {
				var airlineList = this.moduleCtrl.getModuleData().booking.MALPI_A.globalList.freqFlyerRestList;
				var travellerBean = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerBean;
				var travellerMap = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerMap;
				var ffShowList = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam.siteFFShowList;

			} else if (this.moduleCtrl.getModuleData().MPassengerDetails != null) {
				var airlineList = this.moduleCtrl.getModuleData().MPassengerDetails.config.freqFlyerRestList;
				var travellerBean = this.moduleCtrl.getModuleData().MPassengerDetails.reply.forFQTV.listTravellerBean.travellerBean;
				var travellerMap = this.moduleCtrl.getModuleData().MPassengerDetails.reply.forFQTV.listTravellerBean.travellerMap;
				var ffShowList = this.moduleCtrl.getModuleData().MPassengerDetails.config.siteFFShowList;
			}
			if (airlineList != null) {
				var airlineListArr = [];
				for (j = 0; j < airlineList.length; j++) {
					var airline = airlineList[j][1] + " (" + airlineList[j][0] + ")";
					airlineListArr.push(airline);
				}
				return airlineListArr;
			}
		},

		$viewReady: function() {
			if (this.moduleCtrl.getModuleData().booking != null && this.moduleCtrl.getModuleData().booking.MALPI_A != null) {
				var airlineList = this.moduleCtrl.getModuleData().booking.MALPI_A.globalList.freqFlyerRestList;
				var travellerBean = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerBean;
				var travellerMap = this.moduleCtrl.getModuleData().booking.MALPI_A.requestParam.listTravellerBean.travellerMap;
				var ffShowList = this.moduleCtrl.getModuleData().booking.MALPI_A.siteParam.siteFFShowList;

			} else if (this.moduleCtrl.getModuleData().MPassengerDetails != null) {
				var airlineList = this.moduleCtrl.getModuleData().MPassengerDetails.config.freqFlyerRestList;
				var travellerBean = this.moduleCtrl.getModuleData().MPassengerDetails.reply.forFQTV.listTravellerBean.travellerBean;
				var travellerMap = this.moduleCtrl.getModuleData().MPassengerDetails.reply.forFQTV.listTravellerBean.travellerMap;
				var ffShowList = this.moduleCtrl.getModuleData().MPassengerDetails.config.siteFFShowList;
			} else {
				airlineList = [];
			}
			var airlineListArr = [];
			for (j = 0; j < airlineList.length; j++) {
				var airline = airlineList[j][1] + " (" + airlineList[j][0] + ")";
				airlineListArr.push(airline);
			}
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MAlpiFQTV",
						data:{}
					});
			}
		},


		clrSelected: function(event,args) {
			if (args.name != null) {
				var name = document.getElementById(args.name).value;
				if (name != null && name == "")
					$('#' + args.name).removeClass('nameSelected');
				this.showCross(event, args);
			}
		},

		showCross: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				if (inputEL.value == '' || inputEL.className.indexOf('hidden') != -1) {
					delEL.className += ' hidden';
				} else if (delEL.className.indexOf('hidden') != -1) {
					delEL.className = delEL.className.replace(/(?:^|\s)hidden(?!\S)/g, '');
					inputEL.className = inputEL.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
				}
			}
		},

		clearField: function(event, args) {

			var inputEL = document.getElementById(args.id);
			var delEL = document.getElementById('del' + args.id);

			if (inputEL != null && delEL != null) {
				inputEL.value = '';
				delEL.className += ' hidden';
				inputEL.className = inputEL.className.replace(/(?:^|\s)nameSelected(?!\S)/g, '');
			}
		}
	}
});