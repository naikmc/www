Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.rebook.MRebookSearchScript",
	$dependencies: [
		'aria.utils.DomOverlay',
		'aria.utils.Json',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MerciGA'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		pageObj = this;
		this.__ga = modules.view.merci.common.utils.MerciGA;
		this.__merciFunc = modules.view.merci.common.utils.MCommonScript;
	},

	$prototype: {

		$dataReady: function() {
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();
			var model = this.moduleCtrl.getModuleData().servicing.MRebookSRCH_A;
			this.config = model.config;
			this.labels = model.labels;
			this.gblLists = model.globalList;
			this.request = model.request;
			this.IS_USER_LOGGED_IN = model.IS_USER_LOGGED_IN;
			this.reply = model.reply;
			this.tripplan = model.reply.tripPlan;

			this.data.messages = this.__initMessages();
			this.utils.readBEErrors(this.reply.errors, this.data.messages);
			this.data.flexDates = this.__initFlexData();
			this.data.bounds = this.__initBoundsData();

			// google analytics
			this.__ga.trackPage({
				domain: this.config.siteGADomain,
				account: this.config.siteGAAccount,
				gaEnabled: this.config.siteGAEnable,
				page: 'ATC 1c-Flight Change?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11],
				GTMPage: 'ATC 1c-Flight Change?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.siteOfficeID + '&wt_sitecode=' + base[11]
			});

			// remove class from body
			this.__merciFunc.updateBodyClass('');
		},

		$displayReady: function() {
			if (this.utils.booleanValue(this.config.useNewDatePicker)) {
				var datePickersArray = document.getElementsByClassName('datePickerClass');
				for (var i = 1; i <= datePickersArray.length; i++) {
					this.initDate(i);
				}
			}
			$('.ui-datepicker-trigger').click(function() {
				$('#rebookSearch').hide();
				$('#ui-datepicker-div').show();
				$('.banner').hide();
			})
		},

		$viewReady: function() {
			$('body').attr('id', 'resrch');
			var header = this.moduleCtrl.getModuleData().headerInfo;
			if (this.__merciFunc.booleanValue(this.config.enableLoyalty) == true && this.__merciFunc.booleanValue(this.IS_USER_LOGGED_IN) == true) {
				var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
				var loyaltyInfoJson = {
					loyaltyLabels: this.labels.loyaltyLabels,
					airline: bp[16],
					miles: bp[17],
					tier: bp[18],
					title: bp[19],
					firstName: bp[20],
					lastName: bp[21],
					programmeNo: bp[22]
				};
			}

			this.moduleCtrl.setHeaderInfo({
				title: header.title,
				bannerHtmlL: header.bannerHtml,
				homePageURL: header.homeURL,
				showButton: true,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			localStorage.removeItem('orgCurrency');
			localStorage.removeItem('convCurrency');
			var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
			if (bp[14] != null && bp[14].toLowerCase() == 'iphone') {
				/*HARD CODING CALLBACK URL TYPE to "sqmobile". Need to remove once data is present in JSON. this.__merciFunc.appCallBack(this.moduleCtrl.getModuleData().booking.MSRCH_A.siteParam.siteAppCallback,"://?flow=booking/pageload="+aria.utils.HashManager.getHashString());*/
				this.__merciFunc.appCallBack("sqmobile", "://?flow=booking/pageload=" + aria.utils.HashManager.getHashString());
			}

			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MRebookSearch",
						data:this.data
					});
			}
		},

		/**
		 * creates a Date object using the server date and time
		 */
		_getCurrentDate: function() {
			var currDateBean = jsonResponse.data.framework.date;
			return new Date(currDateBean.params.year, currDateBean.params.month, currDateBean.params.day, currDateBean.params.hour, currDateBean.params.minute, currDateBean.params.second);
		},

		/**
		 * based on the dateBean object, it identifies whether a PNR is flown or not
		 * @param dateBean JSONObject
		 * 		{
		 *			year: <value>,
		 *			month: <value>,
		 *			day: <value>,
		 *			hour: <value>,
		 *			minute: <value>
		 *		}
		 */
		_isFlownSegment: function(dateBean) {
			var depDate = new Date(dateBean.year, dateBean.month, dateBean.day, dateBean.hour, dateBean.minute, 0);
			return (this._getCurrentDate().getTime() - depDate.getTime()) > 0;
		},

		/* Contains the settings of the date picker */
		createDatePicker: function(boundIndex) {
			buttonImagePath = $("#calImgPath").val();
			buttonImgOnly = true;
			$("#datePick" + boundIndex).datepicker({
				showOn: "button",
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				minDate: 0,
				maxDate: "+364D",
				defaultDate: +0,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				onSelect: function() {
					pageObj.displayDateOnButton(boundIndex);
					var selDate = $("#datePick" + boundIndex).datepicker('getDate');
					pageObj.setInputDateParameters(boundIndex, selDate);
					$('#rebookSearch').show();
					$('.banner').show();
					$('#ui-datepicker-div').hide();
				}
			});
			var initialDate = pageObj.getInitialDate(boundIndex - 1);
			var changedDate = $("#datePick" + boundIndex).datepicker('getDate'); //Added for PTR 07263170- Date value changing on clicking of flexible dates
			if (initialDate == changedDate || changedDate == null) {
				$("#datePick" + boundIndex).datepicker('setDate', initialDate);
				this.setInputDateParameters(boundIndex, initialDate);
			} else {
				$("#datePick" + boundIndex).datepicker('setDate', changedDate);
				this.setInputDateParameters(boundIndex, changedDate);
			}

		},

		/* Initializes the Date picker on the buttons */
		initDate: function(boundIndex) {
			this.createDatePicker(boundIndex);
			var a = $('.ui-datepicker-trigger')[boundIndex - 1];
			$(a).attr("id", "depdate" + boundIndex);
			this.displayDateOnButton(boundIndex);
		},

		/*Display the date selected on the button*/
		displayDateOnButton: function(boundIndex) {
			var defaultDay = $.datepicker.formatDate('dd', $("#datePick" + boundIndex).datepicker('getDate'));
			var defaultMonth = $.datepicker.formatDate('M', $("#datePick" + boundIndex).datepicker('getDate'));
			var defaultYear = $.datepicker.formatDate('yy', $("#datePick" + boundIndex).datepicker('getDate'));
			$("#depdate" + boundIndex).html("<time>" + defaultMonth + " " + defaultDay + " , " + defaultYear + "</time>");
		},

		/*returns the selected date in the trip*/
		getInitialDate: function(index) {
			var newDate = new Date(this.tripplan.air.itineraries[index].beginDate);
			return newDate;
		},

		/*Set the input parameters sent to the next page*/
		setInputDateParameters: function(boundIndex, date) {
			if (this.data.bounds[boundIndex - 1].selected) {
				if (date.getMonth() < 10)
					var currentMonthYear = date.getFullYear().toString() + "0" + date.getMonth().toString();
				else
					var currentMonthYear = date.getFullYear().toString() + date.getMonth().toString();
				$("#Day" + boundIndex).attr("value", date.getDate());
				$("#Month" + boundIndex).attr("value", currentMonthYear);
			}
		},

		isChangeAllowed: function(boundIndex) {
			var itin = this.tripplan.air.itineraries[boundIndex];
			var modifAllowed = this.utils.booleanValue(itin.allowElementModifStatus);
			var flown = this.utils.booleanValue(itin.boolFlownStatus);
			var isRebookingFacility = this.utils.booleanValue(this.reply.search.isRebookingFacility);
			return !flown || (!isRebookingFacility && modifAllowed);
		},

		isPreviouslySelected: function(boundId) {
			return this.utils.booleanValue(this.request["BOUND_TO_MODIFY_" + boundId]);
		},

		toggleBound: function(evt, boundData) {

			var selected = !boundData.selected;
			var article = document.getElementById(this.$getId(boundData.articleId));
			article.setAttribute('aria-selected', String(selected));
			aria.utils.Json.setValue(boundData, 'selected', selected);

			var rebookButton = document.getElementById(this.$getId('rebookButton'));
			if (this.continueEnabled()) {
				this.utils.removeClass(rebookButton, "disabled")
			} else {
				this.utils.addClass(rebookButton, "disabled")
			}
		},

		getMonthYears: function() {
			var monthYears = this.reply.monthYears.split(',');
			monthYears.splice(0, 1);
			var formattedMonthYears = this.reply.formattedMonthYears.split(',');
			var result = [];
			for (var i = 0; i < monthYears.length; i++) {
				var fm = formattedMonthYears[i].substring(0, formattedMonthYears[i].length - 5);
				var fy = formattedMonthYears[i].substring(formattedMonthYears[i].length - 4);
				result[i] = {
					value: monthYears[i],
					fmtMonth: fm,
					fmtYear: fy
				};
			}
			return result;
		},

		toggleFlex: function(evt) {
			var flexChecked = !this.data.flexDates.checked;
			var range = (flexChecked ? this.config.flexRange : 0);
			this.data.flexDates.range = range;
			aria.utils.Json.setValue(this.data.flexDates, 'checked', flexChecked);
		},

		continueEnabled: function() {
			var enabled = false;
			for (var b = 0; b < this.data.bounds.length; b++) {
				if (this.data.bounds[b].selected) {
					enabled = true;
				}
			}
			return enabled;
		},

		onContinue: function(evt) {
			if (this.continueEnabled()) {
				this.data.errors = [];
				var modifBoundInput = document.getElementById(this.$getId("MODIFIED_BOUND"));
				modifBoundInput.value = this.__getModifiedBound();

				var formElmt = document.getElementById(this.$getId("searchForm"));
				var request = {
					formObj: formElmt,
					action: 'MRebookingAvailabilityFlowDispatcher.action',
					method: 'POST',
					expectedResponseType: 'json',
					loading: true,
					cb: {
						fn: this.__onRebookSearchFormCallBack,
						scope: this
					}
				};
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			}
		},
		__onRebookSearchFormCallBack: function(response) {
			// getting module ctrl data
			var json = this.moduleCtrl.getModuleData();

			// getting next page id
			var nextPage = response.responseJSON.homePageId;
			var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
			if (response.responseJSON.data != null) {
				if (dataId == 'MRebookSRCH_A') {
					this.__processError(response);
				} else {
					// setting data for next page
					this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
					// navigate to next page
					this.moduleCtrl.navigate(null, nextPage);
				}
			}
		},
		__processError: function(response) {
			// for handling errors
			var pageTicketEL = document.getElementsByName('PAGE_TICKET')[0];
			if (pageTicketEL != null && !this.__merciFunc.isEmptyObject(response.responseJSON.data.servicing.MRebookSRCH_A.reply.pageTicket)) {
				pageTicketEL.value = response.responseJSON.data.servicing.MRebookSRCH_A.reply.pageTicket;
			}
			if (!this.__merciFunc.isEmptyObject(response.responseJSON.data.servicing.MRebookSRCH_A.reply.listMsg)) {
				this.data.errors = response.responseJSON.data.servicing.MRebookSRCH_A.reply.listMsg;
				// refresh section
				window.scrollTo(0, 0);
				aria.utils.Json.setValue(this.data, 'errorOccured', true);
			}
		},
		__showATCWaiver: function() {
			return this.utils.booleanValue(this.config.enableATCWaiver) && this.utils.booleanValue(this.config.displayWaiverMsg) && this.utils.booleanValue(this.reply.eligibleToWaiver);
		},

		__initMessages: function() {
			var messages = {};
			if (this.__showATCWaiver()) {
				var err = {
					TYPE: 'E',
					TEXT: this.labels.tx_merci_text_waiver_message
				};
				messages.errors = {
					list: [err]
				};
			}
			if (this.utils.booleanValue(this.config.showNonFlightMsg)) {
				var inf = {
					TYPE: 'I',
					TEXT: this.labels.tx_merci_atc_seat_carried_msg
				};
				messages.infos = {
					list: [inf]
				};
			}
			return messages
		},

		__initFlexData: function() {
			var flexChecked = this.utils.booleanValue(this.config.enableDefaultFlexDates);
			return {
				checked: flexChecked,
				range: (flexChecked ? this.config.flexRange : 0)
			};
		},

		__initBoundsData: function() {
			var bounds = this.tripplan.air.itineraries;
			var result = [];
			for (var b = 0; b < bounds.length; b++) {
				result[b] = {
					articleId: 'bound' + b,
					changeAllowed: this.isChangeAllowed(b),
					selected: this.isPreviouslySelected(bounds[b].itemId)
				}
			}
			return result;
		},

		__getModifiedBound: function() {
			var modified = "";
			var firstSelected = this.data.bounds[0].selected;
			var secondSelected = this.data.bounds[1] && this.data.bounds[1].selected;
			if (firstSelected && !secondSelected) {
				modified = "0";
			} else if (!firstSelected && secondSelected) {
				modified = "1";
			}
			return modified;
		},
		setFlowType:function(event, args){
				if(args == "schedule") {
					$(".panel.flexible").hide();
					$(".cabin").show();
				}
				else {
					$(".cabin").hide();
					$(".panel.flexible").show();
				}
		},
		setCabin:function(){
			var value = $("#CABIN_CLASS").val();
			$("#CABIN").val(value);
		},

		onDateSelection: function(event, args) {
			if (args != null) {
				var myOption;
				var monId = document.getElementById(args.monthdd);
				var dayId = document.getElementById(args.daydd);
				var monthIndex = monId.options[monId.selectedIndex].value;
				var dayDate = new Date(monthIndex.substring(0, 4), parseInt(monthIndex.substring(4, 6)) + 1, 0);
				dayDate = dayDate.getDate();
				if (dayId.options[dayId.selectedIndex].value > dayDate) {
					dayId.value = dayDate;
				}
				if (dayId.length <= dayDate) {
					for (var ai = (1 + dayId.length); ai <= dayDate; ai++) {
						myOption = document.createElement("option");
						myOption.text = ai;
						myOption.value = ai;
						dayId.appendChild(myOption);
					}
				} else {
					for (var di = dayId.length - 1; di >= dayDate; di--) {
						dayId.remove(di);
					}
				}
			}
		}

	}
});