Aria.tplScriptDefinition({
	$classpath: "modules.view.merci.segments.servicing.templates.email.MMailInfoScript",
	$dependencies: [
		'aria.utils.Date',
		'aria.utils.DomOverlay',
		'modules.view.merci.common.utils.MCommonScript',
		'modules.view.merci.common.utils.StringBufferImpl',
		'modules.view.merci.common.utils.URLManager',
		'modules.view.merci.common.utils.MerciGA'
	],

	$statics: {
		TIME_PATTERN: 'H:mm'
	},

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		this.__ga = modules.view.merci.common.utils.MerciGA;
	},

	$prototype: {

		$dataReady: function() {

			// get JSON data
			var model = this.moduleCtrl.getModuleData().MMailInfo;

			// set in tpl scope
			this.data.errors = [];
			this.reply = model.reply;
			this.labels = model.labels;
			this.config = model.config;
			this.request = model.request;
			this.tripplan = model.reply.tripplan;
			this.errorStrings = model.errorStrings;
			this.data.emailContent = new modules.view.merci.common.utils.StringBufferImpl();
			this.data.messages = this.utils.readBEErrors(this.reply.errors);
			var base = modules.view.merci.common.utils.URLManager.getBaseParams();

			// google analytics
			this.__ga.trackPage({
				domain: this.config.siteGADomain,
				account: this.config.siteGAAccount,
				gaEnabled: this.config.siteGAEnable,
				page: 'Ser Email Friend?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.officeId + '&wt_sitecode=' + base[11],
				GTMPage: 'Ser Email Friend?wt_market=' + ((base[13] != null) ? base[13] : '') +
					'&wt_language=' + base[12] + '&wt_officeid=' + this.config.officeId + '&wt_sitecode=' + base[11]
			});
			
		},

		$viewReady: function() {
			$('body').attr('id', 'sendMail');
			var header = this.moduleCtrl.getModuleData().headerInfo;
			if (this.utils.booleanValue(this.config.enableLoyalty) == true && this.utils.booleanValue(this.request.IS_USER_LOGGED_IN) == true) {
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
				homePageURL: "",
				showButton: true,
				loyaltyInfoBanner: loyaltyInfoJson
			});
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MMailInfo",
						data:this.data
					});
			}
		},

		/**
		 * Returns the default e-mail address of the primary pax
		 */
		getSenderEmail: function() {

			var email = '';
			var emails = this.tripplan.paxInfo.primary.emails;

			if (emails.E1) {
				email = emails.E1.description;
			} else if (emails.E2) {
				email = emails.E2.description;
			} else if (emails.E3) {
				email = emails.E3.description;
			}

			return email;
		},

		/**
		 * Tells whether the trip with the given itineraries is complex or open jaw
		 */
		isComplexTrip: function(itineraries) {
			return (itineraries.length > 2) || (itineraries.length === 2 && !this.isSwappedCities(itineraries[0], itineraries[1]))
		},

		/**
		 * Returns true if begin city matches of iti1 matches end city of iti2, and vice-versa.
		 */
		isSwappedCities: function(iti1, iti2) {
			return iti1.beginLocation.cityCode === iti2.endLocation.cityCode && iti2.beginLocation.cityCode === iti1.endLocation.cityCode;
		},

		/**
		 * converts date bean object to JavaScript Date object
		 * @param dateBean DateBean object
		 */
		_getDateFromBean: function(dateBean) {
			return new Date(dateBean.year,
				dateBean.month,
				dateBean.day,
				dateBean.hour,
				dateBean.minute,
				0);
		},

		/**
		 * Creates the default subject of the e-mail
		 */
		formatSubject: function() {
			var itineraries = this.tripplan.air.itineraries;
			var dateFormat = this.utils.getFormatFromEtvPattern(this.labels.tx_merci_pattern_FullDateFormat);
			var subject = new modules.view.merci.common.utils.StringBufferImpl();
			subject.append(itineraries[0].beginLocation.cityName)
			subject.append(' - ');
			subject.append(itineraries[0].endLocation.cityName);
			subject.append(', ');
			if (this.isComplexTrip(itineraries)) {
				subject.append('... ');
			}
			subject.append(aria.utils.Date.format(this._getDateFromBean(itineraries[0].beginDateBean), dateFormat, true));
			if (itineraries.length > 1) {
				subject.append(' - ');
				subject.append(aria.utils.Date.format(this._getDateFromBean(itineraries[itineraries.length - 1].beginDateBean), dateFormat, true))
			}
			subject.append('. ');
			subject.append(itineraries[0].segments[0].airline.name);
			return subject.toString();
		},

		/**
		 * Creates the default body of the e-mail
		 */
		formatEmail: function(itineraries, i, segment, s, itin) {

			// create string buffers
			var appender = new modules.view.merci.common.utils.StringBufferImpl();
			if (!this.utils.booleanValue(this.config.emailReadOnly)) {
				if (s == 0 && itin == 'new') {
					this.data.emailContent.append('\n');
					var str = this.__getItineraryPrefix(itineraries, i, s, "header");

				}
			}
			this.data.emailContent.append(':');
			this.data.emailContent.append('\n');
			// get date format from localized strings
			var dateFormat = this.utils.getFormatFromEtvPattern(this.labels.tx_merci_pattern_FullDateFormat);

			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				this.__formatItinerary(appender, itineraries[i], dateFormat, i, segment, s);
			} else {
				appender.append(': \n');
				this.__formatItinerary(appender, itineraries[i], dateFormat, i, segment, s);
			}

			return appender.toString();
		},

		/**
		 * Event handler when the user clicks on Cancel button.
		 * Goes back to booking details.
		 */
		onCancel: function(evt) {
			var params = {
				REC_LOC: this.tripplan.pnr.recLoc,
				DIRECT_RETRIEVE: 'true',
				BCKTOHOME: 'BCKTOHOME',
				JSP_NAME_KEY: 'SITE_JSP_STATE_RETRIEVED',
				PAGE_TICKET: this.reply.pageTicket,
				DIRECT_RETRIEVE_LASTNAME: this.tripplan.paxInfo.primary.lastName,
				page: 'Ser Email Friend'
			}

			if (!this.utils.isEmptyObject(this.request.isScheduleReject)) {
				params.isScheduleReject = this.request.isScheduleReject;
			} else if (!this.utils.isEmptyObject(this.request.isScheduleChange)) {
				params.isScheduleChange = this.request.isScheduleChange;
			}

			this.utils.sendNavigateRequest(params, 'MMailSendCancel.action', this);
		},

		/**
		 * Event handler when the user clicks on the Save button.
		 * Sends the e-mail
		 */
		onSend: function(evt) {

			var toFieldEL = document.getElementById('toInput');
			var fromFieldEL = document.getElementById('fromInput');
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			var errors = [];
			if (toFieldEL == null || !filter.test(toFieldEL.value)) {
				errors.push({
					TEXT: this.errorStrings['2130282'].localizedMessage + " (" + this.errorStrings['2130282'].errorid + ")"
				});
			}

			if (fromFieldEL == null || !filter.test(fromFieldEL.value)) {
				errors.push({
					TEXT: this.errorStrings['25000048'].localizedMessage + " (" + this.errorStrings['25000048'].errorid + ")"
				});
			}

			this.__clearErrors();
			if (errors.length == 0) {
				var formElmt = document.getElementById(this.$getId('MailForm'));
				var request = this.utils.navigateRequest(formElmt, 'MMailWrapperAction.action', {
					fn: this.__sendCallback,
					scope: this
				});
				modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
			} else {
				this.__addErrors(errors);
			}
		},

		__addErrors: function(errors) {

			if (errors != null) {
				for (var i = 0; i < errors.length; i++) {
					this.__addError(errors[i], (i == errors.length - 1));
				}
			}
		},

		__addError: function(error, doRefresh) {

			if (error != null) {

				// if null then initialize
				if (this.data.errors == null) {
					this.data.errors = [];
				}

				this.data.errors.push(error);
				if (doRefresh) {
					aria.utils.Json.setValue(this.data, 'error_msg', true);
				}
			}
		},

		__clearErrors: function() {
			this.data.errors = [];
			aria.utils.Json.setValue(this.data, 'error_msg', true);
		},

		/**
		 * Determines the label of itineraries[i], depending on number of itineraries and i
		 */
		__getItineraryPrefix: function(itineraries, i, s, header) {
			var itiPrefix;
			if (itineraries.length === 1) {
				itiPrefix = this.labels.tx_merci_text_booking_departureflight;
				if (header == "header") {
					this.data.emailContent.append(this.labels.tx_merci_text_booking_departureflight);
				}
			} else if (itineraries.length === 2 && (itineraries[i].segments.length > 1)) {
				var str = "";
				if (header == "") {
					str = String(s + 1);
				}

				if (i == 0) {
					itiPrefix = this.labels.tx_merci_text_booking_departureflight + " " + str;
					if (header == "header") {
						this.data.emailContent.append(this.labels.tx_merci_text_booking_departureflight);
					}
				} else {
					itiPrefix = this.labels.tx_merci_text_booking_returnflight + " " + str;
					if (header == "header") {
						this.data.emailContent.append(this.labels.tx_merci_text_booking_returnflight);
					}
				}
			} else {
				itiPrefix = this.labels.tx_merci_text_flight + ' ' + String(i + 1);
				if (header == "header") {
					this.data.emailContent.append(this.labels.tx_merci_text_flight + ' ' + String(i + 1));
				}
			}

			return itiPrefix;
		},

		/**
		 * Creates the itinerary description of the given itinerary to be put in the e-mail body
		 */
		__formatItinerary: function(appender, iti, dateFormat, itinCount, segment, s) {
			this.__formatRecap(appender, segment, dateFormat);
			appender.append('<p>')
			this.__formatLocation(appender, segment, 'tx_merci_text_booking_from', 'begin');
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				appender.append('&nbsp;');
				this.data.emailContent.append('\n');
			}

			this.__formatLocation(appender, segment, 'tx_merci_text_booking_to', 'end');
			appender.append('</p>')
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				this.data.emailContent.append('\n');
			} else {
				this.data.emailContent.append('\n');
			}

			this.__formatFlight(appender, segment);

			if (!this.utils.booleanValue(this.config.emailReadOnly)) {
				if (this.utils.booleanValue(this.config.showFlightInfo) && !this.utils.booleanValue(this.config.hideFlightInfo)) {
					this.__formatFlightInfoURL(appender, segment);
				}

				appender.append('\n');
			} else {
				this.moduleCtrl.setValueforStorage(segment, 'currentSegment_' + itinCount + '_' + s);
			}
		},

		/**
		 * Creates the summary of the given segment to be put in the e-mail body
		 */
		__formatRecap: function(appender, segment, dateFormat) {
			var formattedDate = aria.utils.Date.format(this._getDateFromBean(segment.beginDateBean), dateFormat, true);

			appender.append('<p><time>' + formattedDate);
			this.data.emailContent.append(formattedDate);
			appender.append(', </time>');
			this.data.emailContent.append(', ');
			appender.append('<span>' + segment.beginLocation.cityName + '</span>');
			this.data.emailContent.append(segment.beginLocation.cityName);
			appender.append('<span> - </span>');
			this.data.emailContent.append(' - ');
			appender.append('<span>' + segment.endLocation.cityName + '</span>');
			this.data.emailContent.append(segment.endLocation.cityName);
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				appender.append('</p>');
				this.data.emailContent.append('\n');
			} else {
				appender.append('\n');
				this.data.emailContent.append('\n');
			}
		},

		/**
		 * Creates the description of the origin/destination of the given segment, to be put in the e-mail body.
		 * @param labelId: string name for the prefix of the description
		 * @param locId: 'begin' for origin or 'end' for destination
		 */
		__formatLocation: function(appender, segment, labelId, locId) {
			var location = segment[locId + 'Location'];
			var date = segment[locId + 'DateBean'];
			appender.append('<span>' + this.labels[labelId]).append(': ').append('</span>');
			this.data.emailContent.append(this.labels[labelId]).append(': ');
			appender.append('<span> ' + location.cityName + ' ' + location.locationCode + ' ' + date.hour + ':' + date.minute + ' ');
			this.data.emailContent.append(location.cityName + ' ' + location.locationCode + ' ' + date.hour + ':' + date.minute + ' ');
			if (segment[locId + 'Terminal'] != null && segment[locId + 'Terminal'] != undefined && segment[locId + 'Terminal'] != '') {
				appender.append(this.labels.tx_merci_text_terminal + ' ' + segment[locId + 'Terminal'] + '</span>');
				this.data.emailContent.append(this.labels.tx_merci_text_terminal + ' ' + segment[locId + 'Terminal']);
			} else {
				appender.append('</span>');
			}
			if (!this.utils.booleanValue(this.config.emailReadOnly)) {
				appender.append('\n');
			}
		},

		/**
		 * Formats the flight number to be put in the e-mail body
		 */
		__formatFlight: function(appender, segment) {
			appender.append('<p><span> ' + this.labels.tx_merci_text_flight).append(':</span>');
			this.data.emailContent.append(this.labels.tx_merci_text_flight).append(': ');
			appender.append('<span> ' + segment.airline.name + '</span>');
			this.data.emailContent.append(segment.airline.name);
			appender.append(' ');
			this.data.emailContent.append(' ');
			appender.append('<span> ' + segment.airline.code).append(segment.flightNumber + ' </span>');
			this.data.emailContent.append(segment.airline.code).append(segment.flightNumber);
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				this.data.emailContent.append('\n');
			} else {
				appender.append('\n');
				this.data.emailContent.append('\n');
			}
		},

		/**
		 * Creates the Flight info URL to be put in the e-mail body
		 */
		__formatFlightInfoURL: function(appender, segment) {
			var baseParams = modules.view.merci.common.utils.URLManager.getBaseParams();
			var formatArgs = ['{0}://{1}{10}/{4}/Override.action?'].concat(baseParams);
			var baseUrl = this.utils.formatString.apply(this.utils, formatArgs);
			var date = this._getDateFromBean(segment.beginDateBean);
			var params = {
				fn: segment.airline.code + segment.flightNumber,
				dd: aria.utils.Date.format(date, 'dd', true),
				MMM: aria.utils.Date.format(date, 'MMM', true),
				YYYY: aria.utils.Date.format(date, 'yyyy', true),
				LANGUAGE: baseParams[12],
				SITE: baseParams[11],
				UI_EMBEDDED_TRANSACTION: 'MFIFOReq',
				SO_SITE_OFFICE_ID: this.config.officeId
			};

			// if read only email then send result as JSON
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				params.result = 'json';
			}

			var queryString = this.utils.getQueryFromMap(params, false);
			if (this.utils.booleanValue(this.config.emailReadOnly)) {
				return queryString;
			} else {
				this.data.emailContent.append(this.labels.tx_merci_text_mail_msgupdate + ':');
				this.data.emailContent.append(baseUrl);
				this.data.emailContent.append(queryString);
				this.data.emailContent.append('\n');
			}
		},

		/**
		 * Callback when receiving the response of the Send request
		 * If the next page is MmailError, forwards to MMail.action; otherwise regular behaviour
		 */
		__sendCallback: function(response) {
			document.getElementsByClassName("msk loading")[0].style.display = "none";
			var json = response.responseJSON;
			if (json) {
				var pageId = json.homePageId;
				if (pageId === 'merci-MmailError') {
					this.__addError({
						TEXT: this.errorStrings['2130024'].localizedMessage + " (" + this.errorStrings['2130024'].errorid + ")"
					}, true);
				} else {
					this.utils.navigateCallback(response, this.moduleCtrl);
					aria.utils.DomOverlay.detachFrom(document.body);
				}
			}
		},

		onFlightStatusClick: function(ATarg, args) {
			var segment = this.moduleCtrl.getValuefromStorage('currentSegment_' + args.itin + "_" + args.seg);
			var params = this.__formatFlightInfoURL("", segment);
			this.utils.sendNavigateRequest(params, 'MTTFIFOReq.action', this);
		}
	}
});