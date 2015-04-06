Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.templates.pages.RequiredDetailsScript',

	$dependencies: [

		'modules.view.merci.common.utils.MerciGA',
    'modules.view.merci.common.utils.MCommonScript'
	],

	$constructor: function() {
		this.utils = modules.view.merci.common.utils.MCommonScript;
		try {
			this.$logInfo('RequiredDetailsScript::Entering $constructor function');
			//The current layout is the one currently displayed
			var currdate = new Date();
			this.__data = {
				date: {
					curYear: currdate.getFullYear(),
					curMonth: currdate.getMonth(),
					curDay: currdate.getDate()
				},
				refId: null
			};

			this.__ga = modules.view.merci.common.utils.MerciGA;

		} catch (exception) {
			this.$logError(
				'RequiredDetailsScript::An error occured in $constructor function',
				exception);
		}
	},

	$prototype: {
		$dataReady: function() {
			this.$logInfo('RequiredDetailsScript::Entering dataReady function');
			this.requestParam = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.requestParam;
			this.label = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.labels;
			this.Nationality = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.Nationality;
			this.siteParams = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.siteParam;
			this.parameters = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.parameters;
			this.moduleCtrl.setHeaderInfo(this.label.Title, this.requestParam.bannerHtml, this.siteParams.homeURL, true);
			this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MRequiredDetails_A.errorStrings;
			this.currentPagePosition = 0;
			this.cprwithallproduct = [];
			this.currentNatEditpageBeforeState = [];
			this.currentNatEditpageBeforeStatesection = [];

		},


		$displayReady: function() {
			this.$logInfo('RequiredDetailsScript::Entering $displayReady function');
			var deviceDetails = navigator.userAgent;
			if (deviceDetails.indexOf("4.") != -1 && deviceDetails.substring(deviceDetails.indexOf("4."), deviceDetails.indexOf("4.") + 3) >= 4.1) {
				$('select, p select, p.cabin select').addClass("selctboxs2");

			}
			this.moduleCtrl.setCountryCode('');
			jQuery('#' + this.__data.refId).focus();
			// We initialize UI elements
			var currentCustFromAcceptOvrview = this.moduleCtrl.getCurrentCustomer();
			this.moduleCtrl.setCurrentCustomer(null);
			if (currentCustFromAcceptOvrview && currentCustFromAcceptOvrview != "") {
				$("#nextButton").attr("operating-customer", currentCustFromAcceptOvrview);
				this.data.regulatoryCurrentPaxIndex = currentCustFromAcceptOvrview;
			}
			this.onLoadDisplayFields();
			this.showIndexedCustomerDtls();
			this.dateChange();
			find_NumberDisabled_left = "left";
			find_NumberDisabled_right = "";
			find_header_page = "3";
			displayNumbers();
			this.enableAutoCompleteForCountrySelection();

			/*****For remove curosal effect for one pax********/
			var sizeOfPax = 1;
			if (sizeOfPax > 1) {
				sizeOfPax = "<div></div>";
			} else {
				sizeOfPax = null;
			}

			/*****For remove curosal pax div margin and pax********/
			if (sizeOfPax == null) {
				jQuery('#wrap').children("div").css("margin", "0");
				jQuery('#wrap').children("div").next().remove();
				jQuery('#wrap').children("div").next().remove();
			}
			/*** FOR ADDING DATE PICKER ******************/
			var _this = this;
			var commonIndex = 0;
			if (this.OperationgGroupOfAirlines) {
				$("[val*='dob']").each(function() {
					if ($(this).attr("disabled") == undefined) {
						var date = $(this).val();
						var pax_type = $(this).attr('pax');
						var dateArray = date.split("-");
						/*_this.checkDOB(
							_this , errors ,
							{	year : dateArray[0],
								month : dateArray[1],
								day : dateArray[2],
								pax : pax_type
							}
					);*/

						_this.datePicker($(this).attr("name"), this, "dob");
						var defaultYear1 = $.datepicker.formatDate('yy', $(this).datepicker('getDate'));
						var defaultMonth1 = $.datepicker.formatDate('mm', $(this).datepicker('getDate'));
						var defaultDay1 = $.datepicker.formatDate('dd', $(this).datepicker('getDate'));
						/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
						if (defaultYear1 == "" && defaultMonth1 == "" && defaultDay1 == "") {
							$(this).next().html("<time></time>");
						} else {
							$(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
						}

						$(this).next().click(function() {
							$('.sectionRequiredDetailsBase').hide();
							$('#ui-datepicker-div').show();
							$('.banner').hide();
						});
						commonIndex++;
					}

				});
				$("[val*='ed']").each(function() {
					//if($(this).parent().parent().parent().parent().hasClass('displayBlock') && $(this).parent().parent().parent().parent().is(':visible')){
					var date = $(this).val();
					var doc = $(this).attr('doc');
					var dateArray = date.split("-");
					_this.datePicker($(this).attr("name"), this);
					var defaultYear1 = $.datepicker.formatDate('yy', $(this).datepicker('getDate'));
					var defaultMonth1 = $.datepicker.formatDate('mm', $(this).datepicker('getDate'));
					var defaultDay1 = $.datepicker.formatDate('dd', $(this).datepicker('getDate'));
					/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
					if (defaultYear1 == "" && defaultMonth1 == "" && defaultDay1 == "") {
						$(this).next().html("<time></time>");
					} else {
						$(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
					}

					$(this).next().click(function() {
						$('.sectionRequiredDetailsBase').hide();
						$('#ui-datepicker-div').show();
						$('.banner').hide();
					});
					commonIndex++;
					//}

				});
      } else {

        /*
         * tell wether we r using select box or html date
         * */
        var from = "selectbox";
        if (this.isDateSupport()) {
          from = "htmldate";
        }

        $("[name^='forSelection_']").each(function() {

          var dobOrOther = "other";
          if ($(this).attr("date_thisis") != undefined) {
            dobOrOther = "dob";
          }

          var date = $(this).val();
          var dateArray = date.split("-");

          _this.datePicker($(this).attr("name"), this, (dobOrOther == "dob") ? from + "~dob" : from);
          var defaultYear1 = $.datepicker.formatDate('yy', $(this).datepicker('getDate'));
          var defaultMonth1 = $.datepicker.formatDate('mm', $(this).datepicker('getDate'));
          var defaultDay1 = $.datepicker.formatDate('dd', $(this).datepicker('getDate'));

          $(this).next().addClass("specialDatepicker");

          /*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
          if (defaultYear1 == "" && defaultMonth1 == "" && defaultDay1 == "") {
            $(this).next().html("<time></time>");

            /*If no date selected then fields should be empty means there should not be cirrent date selected*/
            if (from == "htmldate") {
              $(this).parent().find("input[type='date']").val("");
            } else {
              //For dropdowns
              $(this).parent().parent().find("select").val("");
            }

          } else {
            $(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
          }


          $(this).next().click(function() {
            $('.sectionRequiredDetailsBase').hide();
            $('#ui-datepicker-div').show();
            $('.banner').hide();
          });

        });

			}
			/*** END FOR ADDING DATE PICKER ******************/

			/** Displaying Error */
			if (_this.moduleCtrl.getOtherDocumentType() != null && _this.moduleCtrl.getOtherDocumentType() == "C") {
				_this.moduleCtrl.displayErrors([{
					"localizedMessage": _this.label.GreenCardReq
				}], "regulatoryErrors", "error");
			}
			if (_this.moduleCtrl.getMoreDetailsRequiredToProceed() && _this.moduleCtrl.getMoreDetailsRequiredToProceed() == true) {
				_this.moduleCtrl.setMoreDetailsRequiredToProceed(false);
				_this.moduleCtrl.displayErrors([{
					"localizedMessage": _this.label.MoreInfo
				}], "regulatoryErrors", "error");
			}

			this.moduleCtrl.clearOtherDocumentType();

			/* End Displaying Error */

			if (navigator.userAgent.search(/Android 2./ig) != -1) {
				/*	$('.breadcrumbs').addClass("breadcrumbsForS2"); */

			}

      /*
       * if date not support then adding place holder to it
       * */
      if (!this.isDateSupport("any")) {
        jQuery("input[type='date']").attr("placeholder", "yyyy-mm-dd");
      }

		},

		$viewReady: function() {

			this.$logInfo('RequiredDetailsScript::Entering $viewReady function');

			/**For increase document height incase when keyboard apper to give extra scroller*****************/
			$(document).off("focus",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select");
			$(document).off("blur",".sectionDefaultstyle input[type='text'],.sectionDefaultstyle input[type='tel'],.sectionDefaultstyle input[type='email'],.sectionDefaultstyle input[type='date'],.sectionDefaultstyle input[type='time'],.sectionDefaultstyle select");


			if (this.moduleCtrl.getEmbeded()) {
				jQuery("[name='ga_track_pageview']").val("Required details");
				window.location = "sqmobile" + "://?flow=MCI/pageloaded=EditCPR";

			} else {
				var GADetails = this.moduleCtrl.getGADetails();
				this.__ga.trackPage({
					domain: GADetails.siteGADomain,
					account: GADetails.siteGAAccount,
					gaEnabled: GADetails.siteGAEnable,
					page: 'Required details',
					GTMPage: 'Required details'
				});
			}

			/*GOOGLE ANALYTICS*/
			/* if(this.parameters.SITE_MCI_GA_ENABLE)
		     {
		    	//ga('send', 'pageview', {'page': 'Required details','title': 'Your Required details'});
		     }*/

		},

		datePicker: function(name, _this, rangeFlg) {

			var dateRange = new Date();
      var currentDate = new Date();
      if (rangeFlg != undefined && rangeFlg.search(/dob/i) != -1) {
				dateRange.setFullYear(dateRange.getFullYear() - 100);
				var minimDateForCal = dateRange;
				var maximDateForCal = 0;
				var defaultDepCal = +0;

        /*For min and max days for html date picker*/
        if (rangeFlg.split("~")[0] == "htmldate") {
          /*current date is max*/
          $(_this).parent().find("input[type='date']").attr("max", currentDate.getFullYear() + "-" + ((currentDate.getMonth() < 10) ? "0" + (parseInt(currentDate.getMonth()) + 1) : parseInt(currentDate.getMonth())).toString() + "-" + ((currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate()));
          /*range is min*/
          $(_this).parent().find("input[type='date']").attr("min", dateRange.getFullYear() + "-" + ((dateRange.getMonth() < 10) ? "0" + (parseInt(dateRange.getMonth()) + 1) : parseInt(dateRange.getMonth())).toString() + "-" + ((dateRange.getDate() < 10) ? "0" + dateRange.getDate() : dateRange.getDate()));
        }

			} else {
				dateRange.setFullYear(dateRange.getFullYear() + 100);
				var minimDateForCal = 0;
				var maximDateForCal = dateRange;
				var defaultDepCal = +0;

        /*For min and max days for html date picker*/
        if (rangeFlg != undefined && rangeFlg.split("~")[0] == "htmldate") {
          /*current date is min*/
          $(_this).parent().find("input[type='date']").attr("min", currentDate.getFullYear() + "-" + ((currentDate.getMonth() < 10) ? "0" + (parseInt(currentDate.getMonth()) + 1) : parseInt(currentDate.getMonth())).toString() + "-" + ((currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate()));
          /*range is max*/
          $(_this).parent().find("input[type='date']").attr("max", dateRange.getFullYear() + "-" + ((dateRange.getMonth() < 10) ? "0" + (parseInt(dateRange.getMonth()) + 1) : parseInt(dateRange.getMonth())).toString() + "-" + ((dateRange.getDate() < 10) ? "0" + dateRange.getDate() : dateRange.getDate()));
        }
      }

			var _thisPageRef = this;

			$('[name="' + name + '"]').datepicker({
				// beforeShowDay: unavailable,
				showOn: "button",
				buttonImage: "",
				buttonImageOnly: false,
				dateFormat: 'yy-mm-dd',
				inline: true,
				changeMonth: true,
				changeYear: true,
				yearRange: "c-100:c+100",
				minDate: minimDateForCal,
				maxDate: maximDateForCal,
				defaultDate: defaultDepCal,
				firstDay: 1,
				showButtonPanel: true,
				buttonText: "",
				beforeShow: function() {
					window.scrollTo(0,0);
					_thisPageRef.currentPagePosition = jQuery(document).scrollTop();
				},
				onSelect: function() {

					var Year1 = $.datepicker.formatDate('yy', $('[name="' + name + '"]').datepicker('getDate'));
					var Month1 = $.datepicker.formatDate('mm', $('[name="' + name + '"]').datepicker('getDate'));
					var Day1 = $.datepicker.formatDate('dd', $('[name="' + name + '"]').datepicker('getDate'));
					/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
					if (Year1 == "" && Month1 == "" && Day1 == "") {
						$(_this).next().html("");
					} else {
						$(_this).next().html("<time>" + Year1 + "-" + Month1 + "-" + Day1 + "</time>");
					}

          if (rangeFlg != undefined) {
            if (rangeFlg.split("~")[0] == "htmldate") {
              $(_this).parent().find("input[type='date']").val(Year1 + "-" + Month1 + "-" + Day1);
            } else if (rangeFlg.split("~")[0] == "selectbox") {
              $(this).parent().parent().find("select").eq(0).val("" + Year1);
              $(this).parent().parent().find("select").eq(1).val("" + Month1);
              $(this).parent().parent().find("select").eq(2).val("" + Day1);
            }

          }

					$('.sectionRequiredDetailsBase').show();
					$('.banner').show();
					$('#ui-datepicker-div').hide();
				},
				onClose: function() {
					$('.sectionRequiredDetailsBase').show();
					$('.banner').show();
					$('#ui-datepicker-div').hide();

					jQuery(document).scrollTop(_thisPageRef.currentPagePosition);
				}
			});



		},
    replaceChangeDateToDatePicker: function(event) {

      try {
        this.$logInfo('RequiredDetailsScript::Entering replaceChangeDateToDatePicker function');

        /*html Date picker*/
        if (event.target.getAttribute("type") != undefined && event.target.getAttribute("type") == "date") {
          /*For setting date picker hidden variable*/
          jQuery("[name='" + event.target.getAttribute("name") + "']").next().val(event.target.getValue());
          /*For setting date picker*/
          jQuery("[name='" + event.target.getAttribute("name") + "']").next().next().html("<time>" + event.target.getValue() + "</time>");
        } else {
          var year = jQuery("[name='" + event.target.getAttribute("name") + "']").parent().parent().find("select").eq(0).val();
          var month = jQuery("[name='" + event.target.getAttribute("name") + "']").parent().parent().find("select").eq(1).val();
          var day = jQuery("[name='" + event.target.getAttribute("name") + "']").parent().parent().find("select").eq(2).val();

          /*For setting date picker hidden variable*/
          jQuery("[name='" + event.target.getAttribute("name") + "']").parent().parent().find("li:last-child>input[type='hidden']").val(year + "-" + month + "-" + day);
          /*For setting date picker*/
          jQuery("[name='" + event.target.getAttribute("name") + "']").parent().parent().find("li:last-child>button").html("<time>" + year + "-" + month + "-" + day + "</time>");
        }

      } catch (exception) {
        this.$logError(
          'RequiredDetailsScript::An error occured in replaceChangeDateToDatePicker function',
          exception);
      }

    },
		__getPage: function() {
			try {
				this.$logInfo('RequiredDetailsScript::Entering __getPage function');
				return jQuery('#' + this.data.pageID);
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in __getPage function',
					exception);
			}
		},

		// Function to chk whether the date type is supported or not
    /*
     * this function return always true when call from tpl,
     * for JS(as we send flag, it gives wether particular browser support date or not)
     * */
    isDateSupport: function(flag) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering isDateSupport function');
        /*if ((aria.core.Browser.name == "Safari" && parseFloat(aria.core.Browser.version).toFixed(2) < 5.1) || aria.core.Browser.name == "Firefox" || aria.core.Browser.name == "Chrome" || aria.core.Browser.name == "IE") {
					return false;
				} else {
					return true;
        }*/

        var input = document.createElement('input');
        input.setAttribute('type', 'date');

        var notADateValue = 'not-a-date';
        input.setAttribute('value', notADateValue);

        if (flag == undefined) {
          return true;
        } else {
          return !(input.value === notADateValue);
        }


			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in isDateSupport function',
					exception);
			}
		},

		// Function to get current date
		getCurrentDate: function() {
			this.$logInfo('RequiredDetailsScript::Entering getCurrentDate function');
			return this.__data.date;
		},

		// Function to get number of days in selected month
		getNumberofDays: function(evt, args) {
			this.$logInfo('RequiredDetailsScript::Entering getNumberofDays function');
			var month = this.__data.date.curMonth;
			var year = this.__data.date.curYear;
			if (!jQuery.isUndefined(args)) {
				if (!jQuery.isUndefined(args.month)) {
					month = args.month;
				}
				if (!jQuery.isUndefined(args.year)) {
					year = args.year;
				}
			}
			var isleapyear = ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0));
			if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
				return 31;
			}
			if (month == 3 || month == 5 || month == 8 || month == 10) {
				return 30;
			}
			if (month == 1) {
				if (isleapyear) {
					return 29;
				} else {
					return 28;
				}
			}
		},

		// Function to populate the months and days with respect to the selection of year
		dateChange: function() {
			this.$logInfo('RequiredDetailsScript::Entering dateChange function');
			var _this = this;
			$("[id*='Year_']").change(function() {
        /*if ($(this).attr("val").indexOf("dob") == -1) {*/
					var selYear = $(this).val();
					_this.populateMonth(_this, {
						year: selYear,
						month: $(this).parent().next().children().eq(0).attr('id'),
						currmonth: _this.__data.date.curMonth,
						curryear: _this.__data.date.curYear
					});
					var monthid = $(this).parent().next().children().eq(0).attr('id');
					var selmonth = $('#' + monthid).val();
					_this.populateDays(_this, {
						year: selYear,
						month: selmonth,
						day: $('#' + monthid).parent().next().children().eq(0).attr('id'),
						currday: _this.__data.date.curDay,
						currmonth: _this.__data.date.curMonth,
						curryear: _this.__data.date.curYear,
						daysOption: true
					});
        /*}*/
			})
			$("[id*='Month_']").change(function() {
        /*if ($(this).attr("val").indexOf("dob") == -1) {*/
					var selMonth = $(this).val();
					var selYear = $(this).prev().val();
					_this.populateDays(_this, {
						year: selYear,
						month: selMonth,
						day: $(this).parent().next().children().eq(0).attr('id'),
						currday: _this.__data.date.curDay,
						currmonth: _this.__data.date.curMonth,
						curryear: _this.__data.date.curYear,
						daysOption: true
					});
        /*}*/
			})
		},

		// Function is called on page load to show information related to first pax. Rest all pax are made display:none

		showIndexedCustomerDtls: function() {
			this.$logInfo('RequiredDetailsScript::Entering showIndexedCustomerDtls function');

			if (this.cprwithallproduct.length == 0) {
				var cprInfo = this.moduleCtrl.getSelectedPax();
			} else {
				var cprInfo = this.cprwithallproduct;
			}
			var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
			var customer_index = $("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").substring($("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").length - 1);
			if (operatingCust > 0 && operatingCust < cprInfo[0].customer.length - 1) {
				// previous and next button need to be shown. continue hidden.
				//$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
				$("#previousButton").removeClass("disabled").removeAttr("disabled");
				$("#nextButton").removeClass("displayNone").addClass("displayBlock");
				var natId = $("#Nationality" + operatingCust).find("input").attr("id");
				if (jQuery("#" + natId).val() == "" || !jQuery("#" + natId).attr("readonly")) {
					$("#nextButton").attr("disabled", "true");
					$("#nextButton").addClass("disabled");
				} else {
					$("#nextButton").removeAttr("disabled");
					$("#nextButton").removeClass("disabled");
				}
				$("#continueButton").removeClass("displayBlock").addClass("displayNone");
				$("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
			} else if (operatingCust != 0 && operatingCust == cprInfo[0].customer.length - 1) {
				// previous and continue button need to be shown. next hidden.
				//$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
				$("#previousButton").removeClass("disabled").removeAttr("disabled");
				$("#nextButton").removeClass("displayBlock").addClass("displayNone");
				$("#continueButton").removeClass("displayNone").addClass("displayBlock");
				var natId = $("#Nationality" + operatingCust).find("input").attr("id");
				if (jQuery("#" + natId).val() == "" || !jQuery("#" + natId).attr("readonly")) {
					$("#continueButton").attr("disabled", "true");
					$("#continueButton").addClass("disabled");
				} else {
					$("#continueButton").removeAttr("disabled");
					$("#continueButton").removeClass("disabled");
				}
				$("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
			} else if (operatingCust == 0 && cprInfo[0].customer.length == 1) {
				//$("#previousButton").removeClass("displayBlock").addClass("displayNone") ;
				$("#previousButton").addClass("disabled").attr("disabled", "disabled");
				$("#nextButton").removeClass("displayBlock").addClass("displayNone");
				$("#continueButton").removeClass("displayNone").addClass("displayBlock");
				var natId = $("#Nationality" + operatingCust).find("input").attr("id");
				if (jQuery("#" + natId).val() == "" || !jQuery("#" + natId).attr("readonly")) {
					$("#continueButton").attr("disabled", "true");
					$("#continueButton").addClass("disabled");
				} else {
					$("#continueButton").removeAttr("disabled");
					$("#continueButton").removeClass("disabled");
				}
			} else if (operatingCust == 0) {
				var natId = $("#Nationality" + operatingCust).find("input").attr("id");
				if ($("#nextButton").is(":visible")) {
					if (jQuery("#" + natId).val() == "" || !jQuery("#" + natId).attr("readonly")) {
						$("#nextButton").attr("disabled", "true");
						$("#nextButton").addClass("disabled");
					} else {
						$("#nextButton").removeAttr("disabled");
						$("#nextButton").removeClass("disabled");
					}
				} else {
					if (jQuery("#" + natId).val() == "" || !jQuery("#" + natId).attr("readonly")) {
						$("#continueButton").attr("disabled", "true");
						$("#continueButton").addClass("disabled");
					} else {
						$("#continueButton").removeAttr("disabled");
						$("#continueButton").removeClass("disabled");
					}
				}
			}
			/* Hiding other pax details and showing details of the pax whose info need to be entered next */
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").addClass("sectionTempClass");
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

			jQuery("section[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
			jQuery(".sectionTempClass").attr("data-customer-index", operatingCust);
			jQuery(".sectionTempClass").removeClass("sectionTempClass");

			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").addClass("liTempClass");
			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

			jQuery("li[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
			jQuery(".liTempClass").attr("data-customer-index", operatingCust);
			jQuery(".liTempClass").removeClass("liTempClass");

			var id = $("#Nationality" + operatingCust).find("input").attr("id");

			if (jQuery("#" + id).val() != "") {
				jQuery("#MRequiredDetails_A>.message.info").css("display", "none");
			} else {
				jQuery("#MRequiredDetails_A>.message.info").css("display", "block");
			}

			if (jQuery("#" + id).val() != "" && jQuery("#" + natId).attr("readonly")) {
				jQuery("#" + id).attr("readonly", "readonly");

				if (this.parameters.SITE_MCI_REG_NATEDIT_REQ.toUpperCase() == "TRUE") {
					/*For nat edit button*/
					jQuery("#" + id).next().removeAttr("disabled").removeAttr("atdelegate");
					jQuery("#" + id).next().removeClass("disabled displayNone");
					jQuery("#" + id).next().prop("type", "button");
					jQuery("#" + id).next().text(this.label.Edit);
					/*End For nat edit button*/

				} else {
					jQuery("#" + id).next().attr("disabled", "disabled");
					jQuery("#" + id).next().addClass("disabled");
				}

				jQuery("[data-aria-controls='nationalityInfo" + operatingCust + "']").attr("data-aria-expanded", "false");
				jQuery("#nationalityInfo" + operatingCust).slideUp("400");
			}

			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").each(function(index) {
				if ($(this).children("ul").children("li").hasClass("displayBlock")) {

				} else {
					$(this).removeClass("displayBlock").addClass("displayNone");
				}
			});
			if (this.moduleCtrl.getCPR().regChkRequired) {
				var errors = [];
				this.validateDates(errors);
				if (errors != null && errors.length > 0) {
					jQuery("#natErrors").disposeTemplate();
					jQuery("#regulatoryErrors").disposeTemplate();
					//this.moduleCtrl.displayErrors(errors , "regulatoryErrors" , "error");
				}
			}


			/*For nat edit button*/
			var OriginalcustomerOperatingCust = parseInt(jQuery("section[data-customer-index=\"" + operatingCust + "\"]").eq(1).attr("id").substring(jQuery("section[data-customer-index=\"" + operatingCust + "\"]").eq(1).attr("id").length - 1));
			_thisRegMdlCtrl = this;
			var buttonEdit = jQuery("#" + id).next().attr("id");
			jQuery(document).on("click","#" + buttonEdit, function(event) {

				if (jQuery("#" + id).next().text() == _thisRegMdlCtrl.label.Edit) {
					//Hide all currently showing fields in page include nationality
					_thisRegMdlCtrl.currentNatEditpageBeforeState = jQuery("#MRequiredDetails_A>article>section>ul").children(".displayBlock");
					_thisRegMdlCtrl.currentNatEditpageBeforeStatesection = jQuery("#Nationality" + operatingCust).nextAll("[id$='_" + OriginalcustomerOperatingCust + "'].displayBlock");
					jQuery("#MRequiredDetails_A>article>section>ul").children(".displayBlock").removeClass("displayBlock").addClass("displayNone");
					jQuery("#Nationality" + operatingCust).nextAll("[id$='_" + OriginalcustomerOperatingCust + "']").removeClass("displayBlock").addClass("displayNone");
					jQuery("#Nationality" + operatingCust).removeClass("displayBlock").addClass("displayNone");

					/*changing nat related detils*/
					/*when use val("") to fill  it is giving error
	    			jQuery("#"+id).next().text(_thisRegMdlCtrl.Nationality.Ok);
	    			jQuery("#"+id).next().addClass("displayNone");*/

					//push nat fileds to passport block
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul").prepend("<li><label for=\"nationality\">" + jQuery("#" + id).prev().html() + "</label><input type=\"text\" value=\"\" id=\"" + id + "\" datacountrysel=\"select-country\" name=\"" + id + "\" style=\"width: 100%;\" /></li>");
					_thisRegMdlCtrl.enableAutoCompleteForCountrySelection();
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li input").attr("value", "");
					/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
					//jQuery("#PSP_DRD_"+OriginalcustomerOperatingCust+">ul>li").eq(2).find("input").attr("value",_thisRegMdlCtrl.moduleCtrl.getCurrentTime(true));
					//jQuery("#PSP_DRD_"+OriginalcustomerOperatingCust+">ul>li").eq(2).find("button time").text(_thisRegMdlCtrl.moduleCtrl.getCurrentTime(true));
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li").eq(2).find("input").attr("value", "");
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li").eq(2).find("input")[0].valueAsDate = "";
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li").eq(2).find("button time").text("");

					//Make nat block show
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayNone").addClass("displayBlock");
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li").removeClass("displayNone").addClass("displayBlock");

					/*removing id, name for actual nationality to newly created one to get effect*/
					jQuery("#" + id).removeAttr("id").removeAttr("name");

					/*For auto populate passport country*/
					var countryListCodeMap = _thisRegMdlCtrl.moduleCtrl.getCountryNameCodeMap();
					jQuery(document).on("blur","#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li input[name^='nationality_code_']", function(event) {

						if (!countryListCodeMap[jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li:last-child input").val().toUpperCase()] && !countryListCodeMap.codetocountry[jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li:last-child input").val().toUpperCase()]) {
							jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li:last-child input").val(jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust + ">ul>li input[name^='nationality_code_']").val());
						}


					});

				}
				event.preventDefault();
			});


			/*For display passport or other doc*/
			/*Added for impl or cond between passport and other documents*/
			jQuery(document).on("change","#passportOtherdoc" + OriginalcustomerOperatingCust, function() {

				if (jQuery(this).val() != "") {
					if (jQuery(this).val() == "P") {
						jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayNone").addClass("displayBlock");
						jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
					} else if (jQuery(this).val() != "") {
						jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust + " select").val(jQuery(this).val());
						jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayNone").addClass("displayBlock");
						jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
					}

				} else {
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
					jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
				}

			});


			/** For showing or hiding passport details **/
			/*Added for impl or cond between passport and other documents*/
			//operatingCust=parseInt(jQuery("section[data-customer-index=\""+operatingCust+"\"]").eq(1).attr("id").substring(jQuery("section[data-customer-index=\""+operatingCust+"\"]").eq(1).attr("id").length-1));
			if (!jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") && !jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") && jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).hasClass("displayBlock") && jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("displayBlock") && !this.data.isApisEligible) {
				jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
				jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
				jQuery("#choosebetweenpassportandnationality" + OriginalcustomerOperatingCust).removeClass("displayNone").addClass("displayBlock");

				/*For making select box initial state each tiem back forth to pax happen*/
				jQuery("#passportOtherdoc" + OriginalcustomerOperatingCust).val("P");
				jQuery("#passportOtherdoc" + OriginalcustomerOperatingCust).trigger("change");

				/*Added to show passport always incase passport and other document section comes*/
				jQuery("#choosebetweenpassportandnationality" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");

			} else if (jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") || jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") && !this.data.isApisEligible) {
				jQuery("#choosebetweenpassportandnationality" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");

			}

			/*For not showing other block if one block filled completely*/
			if (!this.data.isApisEligible) {
				if (jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") && !jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean")) {
					jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
				}
				if (!jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean") && jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean")) {
					jQuery("#PSP_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
				}
			}

			/*For showing other document only incase ig green card error comes, all other scenarios it will be hidden*/
			if ((this.moduleCtrl.getOtherDocumentType() != null && this.moduleCtrl.getOtherDocumentType() == "C") || (jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).hasClass("DetailsFilledByBean"))) {
				jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayNone").addClass("displayBlock");
				jQuery("#OTHER_DRD_0>ul>li").removeClass("displayNone").addClass("displayBlock");
			} else {
				jQuery("#OTHER_DRD_" + OriginalcustomerOperatingCust).removeClass("displayBlock").addClass("displayNone");
			}

		},

		chooseSubmit: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering chooseSubmit function');
				// We prevent default behaviour
				evt.preventDefault();
				if (!args) {
					args = {};
					var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
					var id = $("#Nationality" + operatingCust).find("input").next().attr("id");
					var customer = id.split("_")[2];
					var product = id.split("_")[3];
					args.currentcust = customer;
					args.currentprod = product;

				}
				args.id = "nationality_code_" + args.currentcust + "_" + args.currentprod;
				if ($("#continueButton").is(":visible") && !$("#continueButton").is(":disabled")) {
					this.onContinue(evt, args);
				} else if ($("#nextButton").is(":visible") && !$("#nextButton").is(":disabled")) {
					this.onNext(evt, args);
				} else {
					/*For nat edit screen*/

					/*if(!args){
						args = {} ;
						var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer") ;
						var id = $("#Nationality"+operatingCust).find("input").attr("id") ;
						var customer = id.split("_")[2] ;
						var product = id.split("_")[3] ;
						args.currentcust = customer ;
						args.currentprod = product ;

				}
					args.id="nationality_code_"+args.currentcust+"_"+args.currentprod;*/
					this.onSaveClick(evt, args);
				}

			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in chooseSubmit function',
					exception);
			}
		},

		// Function to enable autocomplete on the country list selection.
		enableAutoCompleteForCountrySelection: function() {
			this.$logInfo('RequiredDetailsScript::Entering enableAutoCompleteForCountrySelection function');
			var countryList = this.moduleCtrl.getCPR().countryList[1];
			var countryListJson = "";
			for (var i in countryList) {
				for (var j in countryList[i]) {
					countryListJson += "{\"label\":\"" + countryList[i][j][1] + "\",\"value\":\"" + countryList[i][j][1] + "\"},";
				}
			}
			countryListJson = countryListJson.substr(0, countryListJson.length - 1)
			countryListJson = JSON.parse("[" + countryListJson + "]");

			jQuery("input[dataCountrySel='select-country']").autocomplete({
				highlight: function(value, term) {
					return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
				},
				source: countryListJson,
				minLength: 1 // specifies the minimum number of characters a user. has to type before the Autocomplete activates.
			});
		},

		// Funtion is called on page load, to display the fields dynamically based on the requirement
		onLoadDisplayFields: function() {

			try {
				this.$logInfo('RequiredDetailsScript::Entering onLoadDisplayFields function');
				var chkRegJson = this.moduleCtrl.getCheckReg();

				if (this.cprwithallproduct.length == 0) {
					var selectedcpr = this.moduleCtrl.getSelectedPax();
				} else {
					var selectedcpr = this.cprwithallproduct;
				}
				var editCPRProdLvlErrorList = this.moduleCtrl.getProductLevelErrors();
				var prod = "";
				for (var i = 0; i < selectedcpr.length; i++) {
					if (i == 0) {
						var prod = selectedcpr[i].product;
					}
					var custArray = selectedcpr[i].customer;
					for (var j = 0; j < custArray.length; j++) {

						/*For redress and known travel information*/
						var cust_index = custArray[j];
						var prod_index = prod;
						var operatingCust = this.data.regulatoryCurrentPaxIndex;
						var natId = $("#Nationality" + operatingCust).find("input").attr("id");
						if (!(jQuery("#" + natId).is(":disabled") || jQuery("#" + natId).attr("readonly"))) {
							return false;
						}
						// Based on the error list, the fields are enabled
						var errorList = chkRegJson.regulatoryDetails[j].productLevelList[0].errorList;
						if (!jQuery.isUndefined(editCPRProdLvlErrorList)) {

							if(jQuery.isUndefined(errorList))
							{
								errorList=[];
							}

							errorList = errorList.concat(editCPRProdLvlErrorList);
						}
						for (var k = 0; !jQuery.isUndefined(errorList) && k < errorList.length; k++) {
							var code = errorList[k].errorCodeErrorCode;
							var field = code + "_" + cust_index + "_" + prod_index;

							jQuery('#' + 'knowntraveller_' + field).removeClass('displayNone');
							jQuery('#' + 'knowntraveller_' + field).addClass('displayBlock');
							jQuery('#' + 'redress_' + field).removeClass('displayNone');
							jQuery('#' + 'redress_' + field).addClass('displayBlock');
						}
						/*End*/

						/*For not to change fields showing in page by prefilling for pax other than showing*/
						if (operatingCust != j) {
							continue;
						}

						var proceed = false;
						var chkRegIndicatorList = chkRegJson.regulatoryDetails[j].productLevelList[0].regIndicatorList;
						for (var indicatorObjIndx = 0; indicatorObjIndx < chkRegIndicatorList.length; indicatorObjIndx++) {
							if ((chkRegIndicatorList[indicatorObjIndx].statusDetailsIndicator == "API" && chkRegIndicatorList[indicatorObjIndx].statusDetailsAction == "N") || (chkRegIndicatorList[indicatorObjIndx].statusDetailsIndicator == "AQQ" && chkRegIndicatorList[indicatorObjIndx].statusDetailsAction == "N")) {
								proceed = true;
							}
						}

						if (proceed) {
							var cust_index = custArray[j];
							var prod_index = prod;
							var natId = $("#Nationality" + operatingCust).find("input").attr("id");
							if (!(jQuery("#" + natId).is(":disabled") || jQuery("#" + natId).attr("readonly"))) {
								return false;
							}
							// Based on the error list, the fields are enabled
							var errorList = chkRegJson.regulatoryDetails[j].productLevelList[0].errorList;
							if (editCPRProdLvlErrorList) {
								errorList = errorList.concat(editCPRProdLvlErrorList);
							}
							for (var k = 0; k < errorList.length; k++) {
								var code = errorList[k].errorCodeErrorCode;
								var field = code + "_" + cust_index + "_" + prod_index;

								jQuery('#' + field).removeClass('displayNone');
								jQuery('#' + field).addClass('displayBlock');
								if (jQuery('#' + field).hasClass('displayBlock')) {
									if (jQuery('#' + field).children("input , select").length > 0) {
										/*jQuery('#'+field).children("input , select").attr('required','true');*/
									} else if (jQuery('#' + field).children("span").children("input").length > 0) {
										/*jQuery('#'+field).children("span").children("input").attr('required','true');*/
									}
								}

								if (jQuery('#' + field).parent().parent().hasClass('displayNone')) {
									var parentid = jQuery('#' + field).parent().parent();
									jQuery(parentid).removeClass('displayNone');
									jQuery(parentid).addClass('displayBlock');
								}

								/** To enable all the passport fields, if any one field in this block is enabled **/
								var pparentField = "PSP_DRD_" + cust_index;
								if (jQuery('#' + pparentField).hasClass('displayBlock')) {
									var pnumber = "14729_" + cust_index + "_" + prod_index;
									if (jQuery('#' + pnumber).hasClass('displayNone')) {
										jQuery('#' + pnumber).removeClass('displayNone');
										/*jQuery('#'+pnumber).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var eDate = "14733_" + cust_index + "_" + prod_index;
									if (jQuery('#' + eDate).hasClass('displayNone')) {
										jQuery('#' + eDate).removeClass('displayNone');
										/*jQuery('#'+eDate).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var ctryIssue = "14734_" + cust_index + "_" + prod_index;
									if (jQuery('#' + ctryIssue).hasClass('displayNone')) {
										jQuery('#' + ctryIssue).removeClass('displayNone');
										/*jQuery('#'+ctryIssue).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
								}

								/** To enable all the visa fields, if any one field in this block is enabled **/
								var vparentField = "VISA_DRD_" + cust_index;
								if (jQuery('#' + vparentField).hasClass('displayBlock')) {
									var vnumber = "14736_" + cust_index + "_" + prod_index;
									if (jQuery('#' + vnumber).hasClass('displayNone')) {
										jQuery('#' + vnumber).removeClass('displayNone');
										/*jQuery('#'+vnumber).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var vexpDate = "14737_" + cust_index + "_" + prod_index;
									if (jQuery('#' + vexpDate).hasClass('displayNone')) {
										jQuery('#' + vexpDate).removeClass('displayNone');
										/*jQuery('#'+vexpDate).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var vcityIssue = "14771_" + cust_index + "_" + prod_index;
									if (jQuery('#' + vcityIssue).hasClass('displayNone')) {
										jQuery('#' + vcityIssue).removeClass('displayNone');
										/*jQuery('#'+vcityIssue).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var vctryIssue = "14738_" + cust_index + "_" + prod_index;
									if (jQuery('#' + vctryIssue).hasClass('displayNone')) {
										jQuery('#' + vctryIssue).removeClass('displayNone');
										/*jQuery('#'+vctryIssue).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
								}

								/** To enable all the other doc fields, if any one field in this block is enabled **/
								var otherparentField = "OTHER_DRD_" + cust_index;
								if (jQuery('#' + otherparentField).hasClass('displayBlock')) {
									var dType = "14799_" + cust_index + "_" + prod_index;
									if (jQuery('#' + dType).hasClass('displayNone')) {
										jQuery('#' + dType).removeClass('displayNone');
										/*jQuery('#'+dType).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var oexpDate = "14801_" + cust_index + "_" + prod_index;
									if (jQuery('#' + oexpDate).hasClass('displayNone')) {
										jQuery('#' + oexpDate).removeClass('displayNone');
										/*jQuery('#'+oexpDate).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var dnumber = "14800_" + cust_index + "_" + prod_index;
									if (jQuery('#' + dnumber).hasClass('displayNone')) {
										jQuery('#' + dnumber).removeClass('displayNone');
										/*jQuery('#'+dnumber).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
								}

								/** To enable all the desination address fields, if any one field in this block is enabled **/
								var destparentField = "DEST_UAD_" + cust_index;
								if (jQuery('#' + destparentField).hasClass('displayBlock')) {
									var destStreet = "14740_" + cust_index + "_" + prod_index;
									if (jQuery('#' + destStreet).hasClass('displayNone')) {
										jQuery('#' + destStreet).removeClass('displayNone');
										/*jQuery('#'+destStreet).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var destCity = "14763_" + cust_index + "_" + prod_index;
									if (jQuery('#' + destCity).hasClass('displayNone')) {
										jQuery('#' + destCity).removeClass('displayNone');
										/*jQuery('#'+destCity).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var destState = "14764_" + cust_index + "_" + prod_index;
									if (jQuery('#' + destState).hasClass('displayNone')) {
										jQuery('#' + destState).removeClass('displayNone');
										/*jQuery('#'+destState).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var destZipCode = "14765_" + cust_index + "_" + prod_index;
									if (jQuery('#' + destZipCode).hasClass('displayNone')) {
										jQuery('#' + destZipCode).removeClass('displayNone');
										/*jQuery('#'+destZipCode).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var destCntry = "17331_" + cust_index + "_" + prod_index;
									if (jQuery('#' + destCntry).hasClass('displayNone')) {
										jQuery('#' + destCntry).removeClass('displayNone');
										/*jQuery('#'+destCntry).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}

								}
								/** To enable all the Home address fields, if any one field in this block is enabled **/
								var homeparentField = "HOME_UAD_" + cust_index;
								if (jQuery('#' + homeparentField).hasClass('displayBlock')) {
									var homeStreet = "14766_" + cust_index + "_" + prod_index;
									if (jQuery('#' + homeStreet).hasClass('displayNone')) {
										jQuery('#' + homeStreet).removeClass('displayNone');
										/*jQuery('#'+homeStreet).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var homeCity = "14767_" + cust_index + "_" + prod_index;
									if (jQuery('#' + homeCity).hasClass('displayNone')) {
										jQuery('#' + homeCity).removeClass('displayNone');
										/*jQuery('#'+homeCity).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var homeState = "14768_" + cust_index + "_" + prod_index;
									if (jQuery('#' + homeState).hasClass('displayNone')) {
										jQuery('#' + homeState).removeClass('displayNone');
										/*jQuery('#'+homeState).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var homeZipCode = "14769_" + cust_index + "_" + prod_index;
									if (jQuery('#' + homeZipCode).hasClass('displayNone')) {
										jQuery('#' + homeZipCode).removeClass('displayNone');
										/*jQuery('#'+homeZipCode).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}
									var homeCntry = "14770_" + cust_index + "_" + prod_index;
									if (jQuery('#' + homeCntry).hasClass('displayNone')) {
										jQuery('#' + homeCntry).removeClass('displayNone');
										/*jQuery('#'+homeCntry).addClass('displayBlock').children("span").children("input").attr('required','true');*/
									}

								}
							}
						}
					}
				}
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onLoadDisplayFields function',
					exception);
			}
		},

		// Funtion used to populate no of days in drop down, based on the month and year selection
		populateDays: function(evt, args) {
			this.$logInfo('RequiredDetailsScript::Entering populateDays function');
			var year = args.year;
			var month = args.month;
			var day = args.day;
			var currmonth = "0" + (args.currmonth + 1);
			var noOfDays = this.getNumberofDays(this, {
				year: year,
				month: month - 1
			});
			var start = 1;

			if ((year == args.curryear) && (month == currmonth) && (args.daysOption)) {
				start = args.currday;
			}

      $('#' + day).html("<option value=''>" + this.label.selectBoxDefaultText + "</option>");
			for (var i = start; i <= noOfDays; i++) {
				var j = "";
				if (i < 10) {
					j = "0" + i;
				} else {
					j = i;
				}
				var opt = "<option value='" + j + "'>" + j + "</option>";
				$('#' + day).append(opt);
			}
			$('#' + day).val(args.currday);
		},

		// Funtion used to populate months in drop down, based on the year selection
		populateMonth: function(evt, args) {
			this.$logInfo('RequiredDetailsScript::Entering populateMonth function');
			var _this = this;
			var cpr = _this.moduleCtrl.getCPR();
			var monthslist = cpr.monthsList;
			var start = 0;
			if (args.year == args.curryear) {
				start = args.currmonth;
			}
			$('#' + args.month).html("");
			for (var i = start; i < 12; i++) {
				var j = i + 1;
				if (j < 10) {
					j = "0" + j
				}
				var opt = "<option value='" + j + "'>" + monthslist[i] + "</option>";
				$('#' + args.month).append(opt);
			}
			var cmonth = args.currmonth + 1;
			if (cmonth < 10) {
				cmonth = "0" + cmonth
			}
			$('#' + args.month).val(cmonth);
		},

		//Funtion called on click of country search icon
		onCountryLinkClick: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onCountryLinkClick function');
				//turn the background off
				var _this = this;
				//input json
				var countryInput = {
					"code": args.code,
					"sec": args.sec,
					"cust": args.cust,
					"prod": args.prod,
					"refid": args.refid
				}
				jQuery(document).scrollTop("0");
				//_this.showOverlay(true);
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				// function used to display the country promptlist
				_this.moduleCtrl.countryListPrompt(countryInput, "serviceoverlayCKIN");
				jQuery('body').scrollTop("0");
				jQuery('#serviceoverlayCKIN').show();
				jQuery('#serviceoverlayCKIN').css('margin-top', '0px');
				jQuery('#splashScreen').hide();
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onCountryLinkClick function',
					exception);
			}
		},

		/**
		 * onModuleEvent : Module event handler called when a module event is raised.
		 */
		onModuleEvent: function(evt) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onModuleEvent function');
				if (!jQuery.isUndefined(evt.refId)) {
					this.__data.refId = evt.refId;
				}
				switch (evt.name) {
					case "page.callDisplayFieldsOnLoad":
						this.onLoadDisplayFields();
						this.showIndexedCustomerDtls();
						break;
					case "page.refresh":
						this.$refresh();
						break;
						// this case occurs when country is updated
					case "country.updated":
						jQuery('#serviceoverlayCKIN').hide();
						jQuery("#serviceoverlayCKIN").disposeTemplate();
						modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
						jQuery('#overlayCKIN').hide();
						if (evt.sec == "Res") {
							this.$refresh({
								filterSection: "countryofRes_" + evt.cust + "_" + evt.prod
							})
						}
						if (evt.sec == "Psp") {
							this.$refresh({
								filterSection: "countryOfIssueP_" + evt.cust + "_" + evt.prod
							})
						}
						if (evt.sec == "Visa") {
							this.$refresh({
								filterSection: "countryOfIssueV_" + evt.cust + "_" + evt.prod
							})
						}
						if (evt.sec == "Home") {
							this.$refresh({
								filterSection: "countryHome_" + evt.cust + "_" + evt.prod
							})
						}
						if (evt.sec == "Dest") {
							this.$refresh({
								filterSection: "countryDest_" + evt.cust + "_" + evt.prod
							})
						}
						if (evt.sec == "Emrg") {
							this.$refresh({
								filterSection: "countryCodeEmrg_" + evt.cust + "_" + evt.prod
							})
						}
						break;
						// this case occurs when country prompt list is closed
					case "country.close":
						jQuery('#serviceoverlayCKIN').hide();
						jQuery("#serviceoverlayCKIN").disposeTemplate();
						modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
						jQuery('#overlayCKIN').hide();
						this.$refresh({
							filterSection: "closeSection"
						})
						break;
					case "server.error":
						modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
						jQuery('#overlayCKIN').hide();
						jQuery('#splashScreen').hide();
						var errors = [];
						errors.push({
							"localizedMessage": this.errorStrings[21400069].localizedMessage,
							"code": this.errorStrings[21400069].errorid
						});
						this.moduleCtrl.displayErrors(errors, "regulatoryErrors", "error");
						break;
				}
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onModuleEvent function',
					exception);
			}
		},

		// Function called to validate the dates entered
		validateDates: function(errors) {
			this.$logInfo('RequiredDetailsScript::Entering validateDates function');
			var _this = this;
			// This validation approach occurs in case of date type support
			if (_this.isDateSupport() || _this.OperationgGroupOfAirlines) {
				$("[val*='dob']").each(function() {
					if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {
						//&& $(this).parent().parent().parent().parent().is(':visible')
						var date = $(this).val();
						var pax_type = $(this).attr('pax');
						var dateArray = date.split("-");

            /*
             * if date not support then adding place holder to it
             *
             * only incase it html date not supported inorder to take correct date from what user has given
             * */
            if (!_this.isDateSupport("any")) {
              dateArray[1] = ((parseInt(dateArray[1]) - 1) < 10 ? "0" + (parseInt(dateArray[1]) - 1) : (parseInt(dateArray[1]) - 1)).toString();
              dateArray[2] = ((parseInt(dateArray[2])) < 10 ? "0" + (parseInt(dateArray[2])) : (parseInt(dateArray[2]))).toString();
              var temp = new Date(dateArray[0], dateArray[1], dateArray[2]);
              dateArray = [];
              dateArray[0] = temp.getFullYear().toString();
              dateArray[1] = temp.getMonth();
              dateArray[2] = temp.getDate();
              dateArray[1] = ((parseInt(dateArray[1]) + 1) < 10 ? "0" + (parseInt(dateArray[1]) + 1) : (parseInt(dateArray[1]) + 1)).toString();
              dateArray[2] = ((parseInt(dateArray[2])) < 10 ? "0" + (parseInt(dateArray[2])) : (parseInt(dateArray[2]))).toString();

              //console.log(dateArray);
            }

						_this.checkDOB(
							_this, errors, {
								year: dateArray[0],
								month: dateArray[1],
								day: dateArray[2],
								pax: pax_type
							}
						);

					}
				})
				$("[val*='ed']").each(function() {
					if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {
						// && $(this).parent().parent().parent().parent().is(':visible')
						var date = $(this).val();
						var doc = $(this).attr('doc');
						var dateArray = date.split("-");

            /*
             * if date not support then adding place holder to it
             *
             * only incase it html date not supported inorder to take correct date from what user has given
             * */
            if (!_this.isDateSupport("any")) {
              dateArray[1] = (parseInt(dateArray[1]) - 1) < 10 ? "0" + (parseInt(dateArray[1]) - 1) : (parseInt(dateArray[1]) - 1);
              dateArray[2] = (parseInt(dateArray[2])) < 10 ? "0" + (parseInt(dateArray[2])) : (parseInt(dateArray[2]));
              var temp = new Date(dateArray[0], dateArray[1], dateArray[2]);
              dateArray = [];
              dateArray[0] = temp.getFullYear().toString();
              dateArray[1] = temp.getMonth();
              dateArray[2] = temp.getDate();
              dateArray[1] = ((parseInt(dateArray[1]) + 1) < 10 ? "0" + (parseInt(dateArray[1]) + 1) : (parseInt(dateArray[1]) + 1)).toString();
              dateArray[2] = ((parseInt(dateArray[2])) < 10 ? "0" + (parseInt(dateArray[2])) : (parseInt(dateArray[2]))).toString();

              //console.log(dateArray);
            }

						_this.checkED(
							_this, errors, {
								year: dateArray[0],
								month: dateArray[1],
								day: dateArray[2],
								doc: doc
							}
						);
					}
				})
			} // this validation occurs if the date is entered in 3 different fields, where date type is not supported
			else {
				var dateArray = $("[val*='dob']");
				for (var i = 0; i < dateArray.length; i += 3) {
					if (!jQuery(jQuery('#' + dateArray[i].id).parentsUntil("ul")[jQuery('#' + dateArray[i].id).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery('#' + dateArray[i].id).parents("section.displayBlock").length > 0 && jQuery(jQuery('#' + dateArray[i].id).parents("section.displayBlock")[jQuery('#' + dateArray[i].id).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {

						var pax_type = $('#' + dateArray[i].id).attr('pax');
						//if($('#'+dateArray[i].id).parent().parent().parent().parent().is(':visible')) {
						_this.checkDOB(
							_this, errors, {
								year: $('#' + dateArray[i].id).val(),
								month: $('#' + dateArray[i + 1].id).val(),
								day: $('#' + dateArray[i + 2].id).val(),
								pax: pax_type
							}
						);
						//}
					}
				}
				var eDateArray = $("[val*='ed']");
				for (var i = 0; i < eDateArray.length; i += 3) {
					if (!jQuery(jQuery('#' + eDateArray[i].id).parentsUntil("ul")[jQuery('#' + eDateArray[i].id).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery('#' + eDateArray[i].id).parents("section.displayBlock").length > 0 && jQuery(jQuery('#' + eDateArray[i].id).parents("section.displayBlock")[jQuery('#' + eDateArray[i].id).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {

						var doc = $('#' + eDateArray[i].id).attr('doc');
						//if($('#'+eDateArray[i].id).parent().parent().parent().parent().is(':visible')) {
						_this.checkED(
							_this, errors, {
								year: $('#' + eDateArray[i].id).val(),
								month: $('#' + eDateArray[i + 1].id).val(),
								day: $('#' + eDateArray[i + 2].id).val(),
								doc: doc
							}
						);
						//}
					}
				}
			}
		},

		// This function is used to validate the expiry date of documetns like passport, visa
		checkED: function(evt, errors, args) {
			this.$logInfo('RequiredDetailsScript::Entering checkED function');
			var newmonth;
			if (args.doc == "passport") {
				if (parseInt(this.parameters.SITE_MCI_MIN_EXPLFT_PSP, 10))
					newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_MCI_MIN_EXPLFT_PSP, 10);
				else
					newmonth = this.__data.date.curMonth + 1 + 0;
			}
			if (args.doc == "visa") {
				if (parseInt(this.parameters.SITE_MCI_MIN_EXPRY_VIS, 10))
					newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_MCI_MIN_EXPRY_VIS, 10);
				else
					newmonth = this.__data.date.curMonth + 1 + 0;
			}
			if (args.doc == "otherdocument") {
				if (parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH, 10))
					newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH, 10);
				else
					newmonth = this.__data.date.curMonth + 1 + 0;
			}
			var newyear = this.__data.date.curYear;
			var newday = this.__data.date.curDay;
			var valid = true;
			var flag = 0;
			while (newmonth > 12) {
				newmonth = newmonth - 12;
				newyear += 1;
			}

			/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
			if (args.year == "") {
				flag = 2;
			} else {
				if (args.year < this.__data.date.curYear) {
					flag = 1;
				} else if (args.year == this.__data.date.curYear) {
					if (args.month - 1 < this.__data.date.curMonth) {
						flag = 1;
					} else if (args.month - 1 == this.__data.date.curMonth) {
						if (args.day <= this.__data.date.curDay) {
							flag = 1;
						}
					}
				}
			}

			/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
			if (flag == 1 || flag == 2) {
				if (args.doc == "passport") {
					if (flag == 2) {
						errors.push({
							"localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.PassportInfo + " - " + this.label.ExpDate]),
							"code": this.errorStrings[21400059].errorid
						});
						return;
					} else {
						errors.push({
							"localizedMessage": this.errorStrings[25000002].localizedMessage,
							"code": this.errorStrings[25000002].errorid
						});
					}

				}
				if (args.doc == "visa") {
					if (flag == 2) {
						errors.push({
							"localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.VisaInfo + " - " + this.label.ExpDate]),
							"code": this.errorStrings[21400059].errorid
						});
						return;
					} else {
						errors.push({
							"localizedMessage": this.errorStrings[25000003].localizedMessage,
							"code": this.errorStrings[25000003].errorid
						});
					}

				}
				if (args.doc == "otherdocument") {
					if (flag == 2) {
						errors.push({
							"localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.OtherDocInfo + " - " + this.label.DocExpDate]),
							"code": this.errorStrings[21400059].errorid
						});
						return;
					} else {
						errors.push({
							"localizedMessage": this.errorStrings[25000004].localizedMessage,
							"code": this.errorStrings[25000004].errorid
						});
					}

				}
			}

			if (args.year > newyear) {
				valid = true;
			} else if (args.year == newyear) {
				if (args.month > newmonth) {
					valid = true;
				} else if (args.month == newmonth) {
					if (args.day > newday) {
						valid = true;
					} else {
						valid = false;
					}
				} else {
					valid = false;
				}
			} else {
				valid = false;
			}

			if (!valid) {
				if (args.doc == "passport") {
					//var expParam = parseInt(this.parameters.SITE_MCI_MIN_EXPLFT_PSP,10) ? parseInt(this.parameters.SITE_MCI_MIN_EXPLFT_PSP,10) : 0 ;
					errors.push({
						"localizedMessage": jQuery.substitute(this.errorStrings[213001069].localizedMessage, "6"),
						"code": this.errorStrings[213001069].errorid
					});
				}
				if (args.doc == "otherdocument") {
					//var expParam = parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH,10) ? parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH,10) : 0 ;
					errors.push({
						"localizedMessage": jQuery.substitute(this.errorStrings[213002101].localizedMessage.substring(1), "6"),
						"code": this.errorStrings[213002101].errorid
					});
				}
			}
		},

		// This function is used to validate the date of birth for adult, child and infant
		checkDOB: function(evt, errors, args) {
			this.$logInfo('RequiredDetailsScript::Entering checkDOB function');
			var month = new Array();
			month[0] = "Jan";
			month[1] = "Feb";
			month[2] = "Mar";
			month[3] = "Apr";
			month[4] = "May";
			month[5] = "Jun";
			month[6] = "Jul";
			month[7] = "Aug";
			month[8] = "Sep";
			month[9] = "Oct";
			month[10] = "Nov";
			month[11] = "Dec";
			var svtime = this.moduleCtrl.getsvTime();
			var svtm = svtime.split(' ');
			var mnt = 0;
			var timestamp = svtm[4].split(':')
			for (var ii = 0; ii < month.length; ii++) {
				if (month[ii] == svtm[2]) {
					mnt = ii;
				}
			}
			var dCurr = new Date(svtm[3], mnt, svtm[1]);
			var dSel = new Date(args.year, (args.month - 1), args.day);
			var years = 0;
			var flag = 0;

			/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
			if (args.year == "") {
				flag = 2;
			} else {
				if (args.year > dCurr.getFullYear()) {
					flag = 1;
				} else if (args.year == dCurr.getFullYear()) {
					if (args.month - 1 > dCurr.getMonth()) {
						flag = 1;
					} else if (args.month - 1 == dCurr.getMonth()) {
						if (args.day >= dCurr.getDate()) {
							flag = 1;
						}
					}
				}

			}

			/*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
			if (flag == 2) {
				errors.push({
					"localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.CustInfo + " - " + this.label.DOB]),
					"code": this.errorStrings[21400059].errorid
				});
				return;
			}

			if (flag == 1) {
				errors.push({
					"localizedMessage": this.errorStrings[25000008].localizedMessage,
					"code": this.errorStrings[25000008].errorid
				});
			}

			if (args.year < dCurr.getFullYear()) {
				if (args.month - 1 <= dCurr.getMonth()) {
					if (args.month - 1 == dCurr.getMonth()) {
						if (args.day <= dCurr.getDate()) {
							years = dCurr.getFullYear() - args.year;
						} else {
							years = dCurr.getFullYear() - args.year - 1;
						}
					} else {
						years = dCurr.getFullYear() - args.year;
					}
				} else {
					years = dCurr.getFullYear() - args.year - 1;
				}
			} else {
				years = 0;
			}



			var days = (dCurr.getTime() - dSel.getTime()) / (1000 * 3600 * 24);
			if (args.pax == "infant") {
				var daysParameter = 2; //parseInt(this.parameters.SITE_MCI_MIN_AGE_INF_DAY,10) ? parseInt(this.parameters.SITE_MCI_MIN_AGE_INF_DAY,10) : 0;
				var infMonths = 24; //parseInt(this.parameters.SITE_MCI_MAX_AGE_INF_YRS,10) ? parseInt(this.parameters.SITE_MCI_MAX_AGE_INF_YRS,10) : 0;

				if (!(days >= daysParameter && (years * 12) < infMonths)) {
					errors.push({
						"localizedMessage": jQuery.substitute(this.errorStrings[213002102].localizedMessage, ["2", "2"]),
						"code": this.errorStrings[213002102].errorid
					});
				}
			}
			if (args.pax == "child") {
				var childAgeMinParam = 2; //parseInt(this.parameters.SITE_MCI_MIN_AGE_CHLD,10) ? parseInt(this.parameters.SITE_MCI_MIN_AGE_CHLD,10) : 0;
				var childAgeMaxParam = 12; //parseInt(this.parameters.SITE_MCI_MAX_AGE_CHLD,10) ? parseInt(this.parameters.SITE_MCI_MAX_AGE_CHLD,10) : 0;

				if (!(years >= childAgeMinParam && years < childAgeMaxParam)) {
					errors.push({
						"localizedMessage": jQuery.substitute(this.errorStrings[213002103].localizedMessage, ["2", "12"]),
						"code": this.errorStrings[213002103].errorid
					});
				}
			}
			if (args.pax == "adult") {
				if (this.parameters.SITE_MCI_OP_AIRLINE.search(/SQ/ig) != -1) {
					var minorAgeLmtParam = 2;
				} else {
					var minorAgeLmtParam = parseInt(this.parameters.SITE_MCI_MINOR_AGE_LMT, 10) ? parseInt(this.parameters.SITE_MCI_MINOR_AGE_LMT, 10) : 0;
				}

				if (!(years >= minorAgeLmtParam)) {
					errors.push({
						"localizedMessage": jQuery.substitute(this.errorStrings[213001074].localizedMessage, minorAgeLmtParam),
						"code": this.errorStrings[213001074].errorid
					});
				}
			}
		},

		// This function is called when input fields are focused
		onInputFocus: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onInputFocus function');
				jQuery('#' + args.id).blur();
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onInputFocus function',
					exception);
			}
		},

		getFailedRegChkCustIndex: function() {
			var showPaxAtIndex = 0;

			if (this.cprwithallproduct.length == 0) {
				var selectedcpr = this.moduleCtrl.getSelectedPax();
			} else {
				var selectedcpr = this.cprwithallproduct;
			}
			var cpr = this.moduleCtrl.getCPR();
			for (var i = 0; i < selectedcpr.length; i++) {
				if (i == 0) {
					custArray = selectedcpr[i].customer;
					for (var cust = 0; cust < custArray.length; cust++) {
						if (cpr.customerLevel[custArray[cust]].adtDobFailed || cpr.customerLevel[custArray[cust]].pptExpFailed || cpr.customerLevel[custArray[cust]].vsaExpFailed || cpr.customerLevel[custArray[cust]].othExpFailed || cpr.customerLevel[custArray[cust]].infDobFailed) {
							showPaxAtIndex = cust;
							break;
						}
					}
				}
			}
			return showPaxAtIndex;
		},

		validateStateDetails: function(errors) {
			this.$logInfo('RequiredDetailsScript::Entering validateStateDetails function');
			var stateNameCodeMap = this.moduleCtrl.getUsaStatesNameToCodeMap();
			var stateNameArray = this.moduleCtrl.getAvailableStatesUSAAutoComplete();
			$('[id^=Country_]').each(function(index, value) {
				if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {
          if (this.value.search(/USA/i) != -1) {
						var country_id = this.id;
						var cust_index = country_id.substring(country_id.lastIndexOf("_") - 1).charAt(0);
						var validStateEntered = stateNameCodeMap[$("#State_" + cust_index + "_" + "0").eq(0).val().toUpperCase()] ? true : false;
						if (!validStateEntered) {
							errors.push({
								"localizedMessage": "Please enter a valid state name or select one from the list."
							});
							$("#State_" + cust_index + "_" + "0").autocomplete({
								highlight: function(value, term) {
									return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
								},
								source: stateNameArray,
								minLength: 1 // specifies the minimum number of characters a user. has to type before the Autocomplete activates.
							});
						}
					}
				}
			});
			$('[id^=dest_country_]').each(function(index, value) {
				if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {
          if (this.value.search(/USA/i) != -1) {
						var country_id = this.id;
						var cust_index = country_id.substring(country_id.lastIndexOf("_") - 1).charAt(0);
						var validStateEntered = stateNameCodeMap[$("#dest_state_" + cust_index + "_" + "0").eq(0).val().toUpperCase()] ? true : false;
						if (!validStateEntered) {
							errors.push({
								"localizedMessage": "Please enter a valid state name or select one from the list."
							});
							$("#dest_state_" + cust_index + "_" + "0").autocomplete({
								highlight: function(value, term) {
									return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
								},
								source: stateNameArray,
								minLength: 1 // specifies the minimum number of characters a user. has to type before the Autocomplete activates.
							});
						}
					}
				}
			});
		},

		onSaveClick: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onSaveClick function')
				evt.preventDefault();
				//this.showOverlay(true);
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				var form = jQuery("#MRequiredDetails_A");
				jQuery("#natErrors").disposeTemplate();
				jQuery("#regulatoryErrors").disposeTemplate();
				//jQuery('input').blur();
				var errors = [];
				invalidCountryEntered = false;
				var currNatField = $("#nationality_code_" + args.currentcust + "_" + args.currentprod);
				var countryListCodeMap = this.moduleCtrl.getCountryNameCodeMap();
				currNatField.each(function(idx) {
					if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock")) {
						if (!countryListCodeMap[this.value.toUpperCase()] && !countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							invalidCountryEntered = true;
						}
					}
				});
				if (invalidCountryEntered) {
					errors.push({
						"localizedMessage": this.errorStrings[41001].localizedMessage,
						"code": this.errorStrings[41001].errorid
					});
				}
				if (errors != null && errors.length > 0) {
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
					jQuery('#overlayCKIN').hide();
					jQuery('#splashScreen').hide();
					this.moduleCtrl.displayErrors(errors, "natErrors", "error");
					return null;
				}
				currNatField.each(function(idx) {
					if (this.value != "" && countryListCodeMap[this.value.toUpperCase()]) {
						this.value = countryListCodeMap[this.value.toUpperCase()];
					} else if (this.value != "" && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
						this.value = this.value.toUpperCase();
					}
				});
				var nationalityInput = $("#nationality_code_" + args.currentcust + "_" + args.currentprod).serialize();
				nationalityInputArr = nationalityInput.split("=");
				nationalityInput = {};
				nationalityInput[nationalityInputArr[0]] = nationalityInputArr[1];
				var editsReqArray = [];
				if (this.cprwithallproduct.length == 0) {
					var selected = this.moduleCtrl.getSelectedPax();
				} else {
					var selected = this.cprwithallproduct;
				}

				var cpr = this.moduleCtrl.getCPR();
				// chk whether the nationality edit is required or not and push into input array
				for (var k = 0; k < selected.length; k++) {
					var prod = selected[k].product;
					if (k == 0) {
						var firstProd = selected[k].product;
					}
					var customerArray = args.currentcust; //selected[k].customer;
					for (var l = 0; l < 1; l++) {
						if (k != 0) {
							var id = 'nationality_code_' + customerArray + '_' + prod;
							var sId = 'nationality_code_' + customerArray + '_' + firstProd;
							if (!jQuery.isUndefined(nationalityInput[sId])) {
								nationalityInput[id] = nationalityInput[sId];
							} else {
								nationalityInput[id] = cpr.customerLevel[customerArray[l]].productLevelBean[prod].nationalityBean[0].nationalityNationalityCode;
								nationalityInput[sId] = cpr.customerLevel[customerArray[l]].productLevelBean[prod].nationalityBean[0].nationalityNationalityCode;
							}
						}
						var natReq = false;
						var indicators = cpr.customerLevel[customerArray].productLevelBean[prod].productLevelIndicatorsBean;
						for (var j = 0; j < indicators.length; j++) {
							if (true) { // indicators[j].attribute == "NRA"
								natReq = true;
							}
						}
						if (true && natReq) { // cpr.customerLevel[customerArray[l]].productLevelBean[prod].regulatoryDocumentDetailsBean == null
							customer = customerArray;
							editsReqArray.push({
								"product": prod,
								"customer": customer
							});
						}
					}
				}
				//input json
				var nationalityEditInput = {
					"selectedCPR": selected,
					"nationalityInput": nationalityInput,
					"indicator": "NAT",
					"editsReqArray": editsReqArray,
					"currentProduct": args.currentprod,
					"currentCust": args.currentcust,
					"nationalityId": args.id
				}

				this.moduleCtrl.setCountryCode('');
				//we call the controller to retrive
				this.moduleCtrl.nationalityEdit(nationalityEditInput);
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onSaveClick function',
					exception);
			}
		},

		onPrevious: function(evt) {
			this.$logInfo('RequiredDetailsScript::Entering onPrevious function');
			jQuery("#natErrors").disposeTemplate();
			jQuery("#regulatoryErrors").disposeTemplate();
			//this.showOverlay(true);
			modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
			jQuery(document).scrollTop("0");

			if (this.cprwithallproduct.length == 0) {
				var selectedcpr = this.moduleCtrl.getSelectedPax();
			} else {
				var selectedcpr = this.cprwithallproduct;
			}
			var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
			operatingCust--;
			/*For nat edit button -- because reload is easy compare to alter DOm manually*/
			this.moduleCtrl.setCurrentCustomer(operatingCust);
			this.$refresh();
			setTimeout(500);
			modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
			return;
			/*End for nat edit button*/


			if (operatingCust > 0 && operatingCust < selectedcpr[0].customer.length - 1) {
				// previous and next button need to be shown. continue hidden.
				//$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
				$("#previousButton").removeClass("disabled").removeAttr("disabled");
				$("#nextButton").removeClass("displayNone").addClass("displayBlock");
				$("#continueButton").removeClass("displayBlock").addClass("displayNone");
				$("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
			} else if (operatingCust == selectedcpr[0].customer.length - 1) {
				// previous and continue button need to be shown. next hidden.
				//$("#previousButton").removeClass("displayNone").addClass("displayBlock") ;
				$("#previousButton").removeClass("disabled").removeAttr("disabled");
				$("#nextButton").removeClass("displayBlock").addClass("displayNone");
				$("#continueButton").removeClass("displayNone").addClass("displayBlock");
				$("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
			} else if (operatingCust == 0) {
				//$("#previousButton").removeClass("displayBlock").addClass("displayNone") ;
				$("#previousButton").addClass("disabled").attr("disabled", "disabled");
				$("#nextButton").removeClass("displayNone").addClass("displayBlock");
				$("#continueButton").removeClass("displayBlock").addClass("displayNone");
				$("#nextButton").removeAttr("operating-customer").attr("operating-customer", operatingCust);
			}
			/* Hiding other pax details and showing details of the pax whose info need to be entered next */
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").addClass("sectionTempClass");
			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

			jQuery("section[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
			jQuery(".sectionTempClass").attr("data-customer-index", operatingCust);
			jQuery(".sectionTempClass").removeClass("sectionTempClass");

			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeClass("displayNone").addClass("displayBlock");
			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").addClass("liTempClass");
			jQuery("li[data-customer-index=\"" + operatingCust + "\"]").removeAttr("data-customer-index");

			jQuery("li[data-customer-index]").removeClass("displayBlock").addClass("displayNone");
			jQuery(".liTempClass").attr("data-customer-index", operatingCust);
			jQuery(".liTempClass").removeClass("liTempClass");

			var id = $("#Nationality" + operatingCust).find("input").attr("id");

			if (jQuery("#" + id).val() != "") {
				jQuery("#MRequiredDetails_A>.message.info").css("display", "none");
			} else {
				jQuery("#MRequiredDetails_A>.message.info").css("display", "block");
			}

			if (!jQuery("#" + id).is(":disabled")) {
				if (jQuery("#" + id).val() != "") {
					/*jQuery("#"+id).attr("disabled","disabled") ;
				jQuery("#"+id).next().addClass("disabled") ;
				jQuery("#"+id).next().attr("disabled","disabled") ;*/
					jQuery("#" + id).attr("readonly", "readonly");
					if (this.parameters.SITE_MCI_REG_NATEDIT_REQ.toUpperCase() == "TRUE") {
						/*For nat edit button*/
						jQuery("#" + id).next().removeAttr("disabled").removeAttr("atdelegate");
						jQuery("#" + id).next().removeClass("disabled displayNone");
						jQuery("#" + id).next().text(this.label.Edit);
						/*End For nat edit button*/
					} else {
						jQuery("#" + id).next().addClass("disabled");
						jQuery("#" + id).next().attr("disabled", "disabled");
					}

					jQuery("[data-aria-controls='nationalityInfo" + operatingCust + "']").attr("data-aria-expanded", "false");
					jQuery("#nationalityInfo" + operatingCust).slideUp("400");
					$("#nextButton").removeClass("disabled");
					$("#continueButton").removeClass("disabled");
					$("#nextButton").removeAttr("disabled");
					$("#continueButton").removeAttr("disabled");
				}
			} else {
				$("#nextButton").removeClass("disabled");
				$("#continueButton").removeClass("disabled");
				$("#nextButton").removeAttr("disabled");
				$("#continueButton").removeAttr("disabled");
			}

			jQuery("section[data-customer-index=\"" + operatingCust + "\"]").each(function(index) {
				if ($(this).children("ul").children("li").hasClass("displayBlock")) {

				} else {
					$(this).removeClass("displayBlock").addClass("displayNone");
				}
			});


			/*Added for impl or cond between passport and other documents*/
			operatingCust = parseInt(jQuery("section[data-customer-index=\"" + operatingCust + "\"]").eq(1).attr("id").substring(jQuery("section[data-customer-index=\"" + operatingCust + "\"]").eq(1).attr("id").length - 1));
			if (!jQuery("#PSP_DRD_" + operatingCust).hasClass("DetailsFilledByBean") && !this.data.isApisEligible) {
				jQuery("#PSP_DRD_" + operatingCust).removeClass("displayBlock").addClass("displayNone");

			}
			if (!jQuery("#OTHER_DRD_" + operatingCust).hasClass("DetailsFilledByBean") && !this.data.isApisEligible) {
				jQuery("#OTHER_DRD_" + operatingCust).removeClass("displayBlock").addClass("displayNone");
			}
			if (jQuery("#PSP_DRD_" + operatingCust).hasClass("DetailsFilledByBean") || jQuery("#OTHER_DRD_" + operatingCust).hasClass("DetailsFilledByBean") && !this.data.isApisEligible) {
				jQuery("#choosebetweenpassportandnationality" + operatingCust).removeClass("displayBlock").addClass("displayNone");
			}


			setTimeout(500);
			modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
			jQuery('#overlayCKIN').hide();
			jQuery('#splashScreen').hide();
		},

		onNext: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onNext function');
				evt.preventDefault();
				jQuery('input').blur();
				jQuery(document).scrollTop("0");
				jQuery("#natErrors").disposeTemplate();
				jQuery("#regulatoryErrors").disposeTemplate();
				//this.showOverlay(true);
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				var form = jQuery("#MRequiredDetails_A");
				var errors = [];
				form.check(errors, true, this.errorStrings);
				var countryListCodeMap = this.moduleCtrl.getCountryNameCodeMap();

				/*For nationalty edit screen*/
				var fromNatEditFlow = jQuery("#PSP_DRD_" + args.currentcust).hasClass("displayBlock") && jQuery("#PSP_DRD_" + args.currentcust + " li > #nationality_code_" + args.currentcust + "_" + args.currentprod).length > 0;
				if (fromNatEditFlow) {
					var invalidCountryEntered = false;
					var currNatField = $("#nationality_code_" + args.currentcust + "_" + args.currentprod);

					currNatField.each(function(idx) {
						//if(!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length-1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length>0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length-1]).hasClass("displayBlock")) {
						if (!countryListCodeMap[this.value.toUpperCase()] && !countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							invalidCountryEntered = true;
						}
						//}
					});
					if (invalidCountryEntered) {
						errors.push({
							"localizedMessage": this.errorStrings[41001].localizedMessage,
							"code": this.errorStrings[41001].errorid
						});
					}

				}
				/*End For nationalty edit screen*/

				this.validateDates(errors);
				this.validateStateDetails(errors);

				var invalidCountryEntered = false;
				jQuery("input[dataCountrySel='select-country']").each(function(idx) {
					if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock") && this.id.indexOf("nationality_code_") == -1) {
						if (!countryListCodeMap[this.value.toUpperCase()] && !countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							invalidCountryEntered = true;
						}
					}
				});
				if (invalidCountryEntered) {
					errors.push({
						"localizedMessage": this.errorStrings[41001].localizedMessage,
						"code": this.errorStrings[41001].errorid
					});
				}
				if (errors != null && errors.length > 0) {
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
					jQuery('#overlayCKIN').hide();
					jQuery('#splashScreen').hide();
					jQuery('input').blur();
					this.moduleCtrl.displayErrors(errors, "regulatoryErrors", "error");
					return null;
				}

				/*For nationalty edit screen*/
				if (fromNatEditFlow && currNatField) {
					currNatField.each(function(idx) {
						if (this.value != "" && countryListCodeMap[this.value.toUpperCase()]) {
							this.value = countryListCodeMap[this.value.toUpperCase()];
						} else if (this.value != "" && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							this.value = this.value.toUpperCase();
						}
					});
				}
				/*End For nationalty edit screen*/

				jQuery("input[dataCountrySel='select-country']").each(function(idx) {
					if (this.value != "" && this.id.indexOf("nationality_code_") == -1 && countryListCodeMap[this.value.toUpperCase()]) {
						this.value = countryListCodeMap[this.value.toUpperCase()];
					} else if (this.value != "" && this.id.indexOf("nationality_code_") == -1 && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
						this.value = this.value.toUpperCase();
					}
				});
				var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
				var customer_index = $("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").substring($("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").length - 1);
				var stateNameCodeMap = this.moduleCtrl.getUsaStatesNameToCodeMap();
        if ($("#dest_country_" + customer_index + "_" + "0").eq(0).val().search(/USA/i) != -1) {
					$("#dest_state_" + customer_index + "_" + "0").eq(0).val(stateNameCodeMap[$("#dest_state_" + customer_index + "_" + "0").eq(0).val().toUpperCase()]);
				}
        if ($("#Country_" + customer_index + "_" + "0").eq(0).val().search(/USA/i) != -1) {
					$("#State_" + customer_index + "_" + "0").eq(0).val(stateNameCodeMap[$("#State_" + customer_index + "_" + "0").eq(0).val().toUpperCase()]);
				}

				/*to update nat to avoid XXX issue*/
				jQuery("[name^='nationality_code_']").each(function(idx) {
					if (jQuery(this).attr("readonly") && countryListCodeMap[this.value.toUpperCase()]) {
						this.value = countryListCodeMap[this.value.toUpperCase()];
					}
				});
				/*End*/

				var EditInput = form.serializeObject();

				// || fromNatEditFlow
				if (this.cprwithallproduct.length == 0) {
					var selectedcpr = this.moduleCtrl.getSelectedPax();
				} else {
					var selectedcpr = this.cprwithallproduct;
				}
				var cpr = this.moduleCtrl.getCPR();
				var chkRegJson = this.moduleCtrl.getCheckReg();
				var editCPR = this.moduleCtrl.getNatEditCPR();
				if (editCPR == null) {
					editCPR = this.moduleCtrl.getCPR();
				}
				var Indicators = [];
				var editsReqArray = [];
				var NoOfEdits = [];
				var prod = null;
				for (var i = 0; i < selectedcpr.length; i++) {
					if (i == 0) {
						var prod = selectedcpr[i].product;
					}
					var custArray = selectedcpr[i].customer;
					for (var j = 0; j < 1; j++) { // for(var j=0; j<custArray.length; j++){
						var ind = "N"; /*chkRegJson.regulatoryDetails[j].productLevelList[selectedcpr[i].product].apisDataOKInd.indicator; */
						// pushing all the indicators needed for edits
						if (ind == "N") {
							var customer = customer_index;
							var prod_index = prod;
							var editCount = 0;
							var field1 = "14475_" + customer + "_" + prod;
							// passenger info indicator
							if (jQuery('#' + field1).hasClass('displayBlock')) {
								var f1 = "DCG_" + customer
								Indicators.push(f1);
							}
							// date of birth indicator
							var field2 = "14476_" + customer + "_" + prod;
							if (this.isDateSupport() || this.OperationgGroupOfAirlines) {
								if (jQuery('#' + field2).hasClass('displayBlock') && !jQuery('#' + field2).find("input").is(":disabled")) {
									var f2 = "DDB_" + customer;
									Indicators.push(f2);
								}
							} else {
								if (jQuery('#' + field2).hasClass('displayBlock') && !jQuery('#' + field2).find("select").is(":disabled")) {
									var f2 = "DDB_" + customer;
									Indicators.push(f2);
								}
							}

							/*For redress and known travel information*/
							var fieldRedress = "redress_19507_" + customer + "_" + prod;
							var redID = "redress_number_" + customer + "_" + prod;
							var fieldKnownTraveller = "knowntraveller_19507_" + customer + "_" + prod;
							var knownTrvlID = "knowntraveler_number_" + customer + "_" + prod;
							if (jQuery('#' + fieldRedress).hasClass('displayBlock') && jQuery("#" + redID).val() != "") {
								var f1 = "REDRS_" + customer;
								editCount++;
								Indicators.push(f1);
							}
							if (jQuery('#' + fieldKnownTraveller).hasClass('displayBlock') && jQuery("#" + knownTrvlID).val() != "") {
								var f1 = "KNOWNTR_" + customer;
								editCount++;
								Indicators.push(f1);
							}
							/*End*/

							// passport document indicator
							var field4 = "PSP_DRD_" + customer;
							if (jQuery('#' + field4).hasClass('displayBlock')) {
								Indicators.push(field4);
								editCount++;
								/*Added for impl or cond between passport and other documents*/
								jQuery("#" + field4).addClass("DetailsFilledByBean");
							}
							// visa document indicator
							var field5 = "VISA_DRD_" + customer;
							if (jQuery('#' + field5).hasClass('displayBlock')) {
								Indicators.push(field5);
								editCount++;
							}
							// home address indicator
							var field3 = "HOME_UAD_" + customer;
							if (jQuery('#' + field3).hasClass('displayBlock')) {
								Indicators.push(field3);
								editCount++;
							}
							// destination address indicator
							var field6 = "DEST_UAD_" + customer;
							if (jQuery('#' + field6).hasClass('displayBlock')) {
								Indicators.push(field6);
								editCount++;
							}
							// emergency contact indicator
							var field7 = "DCL_" + customer;
							if (jQuery('#' + field7).hasClass('displayBlock')) {
								Indicators.push(field7);
								editCount++;
							}
							// other document indicator
							var field10 = "OTHER_DRD_" + customer;
							if (jQuery('#' + field10).hasClass('displayBlock')) {
								Indicators.push(field10);
								editCount++;
								/*Added for impl or cond between passport and other documents*/
								jQuery("#" + field10).addClass("DetailsFilledByBean");
							}
							// place of birth indicator
							var field8 = "14785_" + customer + "_" + prod;
							if (jQuery('#' + field8).hasClass('displayBlock')) {
								var f3 = "POB_DRD_" + customer;
								Indicators.push(f3);
								editCount++;
							}
							// country of residence indicator
							var field9 = "14732_" + customer + "_" + prod;
							if (jQuery('#' + field9).hasClass('displayBlock')) {
								var f4 = "COR_DRD_" + customer;
								Indicators.push(f4);
								editCount++;
							}

							/*For nationalty edit screen && to update nat to avoid XXX issue*/
							/*if(fromNatEditFlow)
							{*/
							editCount++;
							Indicators.push("NAT");
							/*}*/

							NoOfEdits.push({
								"customer": customer,
								"edits": editCount
							})
						}
					}
				}

				for (var k = 0; k < selectedcpr.length; k++) {
					var customerArray = [];
					var prod = selectedcpr[k].product;
					var firstProd = selectedcpr[0].product;
					var customer = customer_index; // selectedcpr[k].customer
					for (var l = 0; l < 1; l++) { //for(var l=0; l<customer.length; l++){
						var ind = "N"; /*chkRegJson.regulatoryDetails[l].productLevelList[selectedcpr[k].product].apisDataOKInd.indicator; */
						if (ind == "N") {
							customerArray.push(customer); //customer[l]
							if (k != 0) {
								for (key in EditInput) {
									var sId = key;
									var id = "";
									var temp = key.split('_')
									if (temp.length != 2) {
										if (temp.length == 3) {
											id = temp[0] + "_" + customer + "_" + prod; //id = temp[0]+"_"+customer[l]+"_"+prod;
										} else if (temp.length == 4) {
											id = temp[0] + "_" + temp[1] + "_" + customer + "_" + prod; //id = temp[0]+"_"+temp[1]+"_"+customer[l]+"_"+prod;
										} else if (temp.length == 5) {
											id = temp[0] + "_" + temp[1] + "_" + temp[2] + "_" + customer + "_" + prod; // id = temp[0]+"_"+temp[1]+"_"+temp[2]+"_"+customer[l]+"_"+prod;
										}
									}
                  if (id.charAt(id.lastIndexOf("_") - 1) == customer_index && sId.charAt(sId.lastIndexOf("_") - 1) == customer_index) {
										if (!EditInput[id]) {
											EditInput[id] = EditInput[sId];
										}
									}
								}
							}
						}
					}
					editsReqArray.push({
						"product": prod,
						"customer": customerArray
					});
				}

				var countMatchChars = function(str, match) {
					var res = str.match(new RegExp(match, "g"));
					if (res == null) {
						return 0;
					}
					return res.length;
				}
				for (key in EditInput) {

          if (typeof key == "string" && key.search(/^(nationality_code)/i) != -1) {
            EditInput[key] = EditInput[key].toUpperCase();
          }

					var sId = key;
					if (sId.charAt(sId.lastIndexOf("_") - 1) == customer_index || (countMatchChars(sId, "_") == 1 && sId.charAt(sId.lastIndexOf("_") + 1) == customer_index)) {
						continue;
					} else {
						delete EditInput[sId];
					}
				}

				/*For nationalty edit screen*/
				if (fromNatEditFlow) {
					jQuery("#Nationality" + operatingCust).removeClass("displayNone").addClass("displayBlock");
					this.currentNatEditpageBeforeState.removeClass("displayNone").addClass("displayBlock");
					this.currentNatEditpageBeforeStatesection.removeClass("displayNone").addClass("displayBlock");
					var id_nationality = jQuery("#PSP_DRD_" + customer_index + ">ul li input").eq(0).attr("id");
					var natupdated_value = jQuery("#PSP_DRD_" + customer_index + ">ul li input").eq(0).attr("value");
					jQuery("#PSP_DRD_" + customer_index + ">ul li").eq(0).remove();
					jQuery("#nationality_codebutton_" + customer_index + "_" + args.currentprod).prev().attr("id", id_nationality).attr("name", id_nationality).attr("value", natupdated_value);

					/*For taking latest updated nat to inat*/
					var natEditcpr = this.moduleCtrl.getNatEditCPR();
					if (natEditcpr) {
						for (var custo in natEditcpr.customerLevel) {
							if (natEditcpr.customerLevel[custo].uniqueCustomerIdBean.primeId == cpr.customerLevel[customer_index].uniqueCustomerIdBean.primeId) {
								for (var prodo in natEditcpr.customerLevel[custo].productLevelBean) {
									if (natEditcpr.customerLevel[custo].productLevelBean[prodo].nationalityBean != null) {
										natEditcpr.customerLevel[custo].productLevelBean[prodo].nationalityBean[0].nationalityNationalityCode = natupdated_value;
									}
								}

							}
						}
					}


				}

				/*For getting flight ids based on pax selected*/
				var selectpaxforprimeid = this.moduleCtrl.getSelectedPax();
				for (var i = 0; i < selectpaxforprimeid.length; i++) {
					this.data.selectedPaxUniqID.push(cpr.customerLevel[customer_index].productLevelBean[selectpaxforprimeid[i].product].productIdentifiersBean[0].primeId);
				}

				// input json
				var RegulatoryInput = {
					"editInput": EditInput,
					"indicators": Indicators,
					"editsReqArray": editsReqArray,
					"NoOfEdits": NoOfEdits,
					"selectedProdList": this.data.selectedPaxUniqID
				}
				this.moduleCtrl.regulatoryEditsNext(RegulatoryInput);
				this.data.selectedPaxUniqID = [];
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onNext function',
					exception);
			}
		},

		// This function is called on click of continue button
		onContinue: function(evt, args) {
			try {
				this.$logInfo('RequiredDetailsScript::Entering onContinue function');
				evt.preventDefault();
				jQuery('input').blur();
				jQuery(document).scrollTop("0");
				jQuery("#natErrors").disposeTemplate();
				jQuery("#regulatoryErrors").disposeTemplate();
				//this.showOverlay(true);
				modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
				var form = jQuery("#MRequiredDetails_A");
				var errors = [];
				var countryListCodeMap = this.moduleCtrl.getCountryNameCodeMap();
				form.check(errors, true, this.errorStrings);
				/*For nationalty edit screen*/

				var fromNatEditFlow = jQuery("#PSP_DRD_" + args.currentcust).hasClass("displayBlock") && jQuery("#PSP_DRD_" + args.currentcust + " li > #nationality_code_" + args.currentcust + "_" + args.currentprod).length > 0;
				if (fromNatEditFlow) {
					var invalidCountryEntered = false;
					var currNatField = $("#nationality_code_" + args.currentcust + "_" + args.currentprod);

					currNatField.each(function(idx) {
						//if(!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length-1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length>0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length-1]).hasClass("displayBlock")) {
						if (!countryListCodeMap[this.value.toUpperCase()] && !countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							invalidCountryEntered = true;
						}
						//}
					});
					if (invalidCountryEntered) {
						errors.push({
							"localizedMessage": this.errorStrings[41001].localizedMessage,
							"code": this.errorStrings[41001].errorid
						});
					}

				}
				/*End For nationalty edit screen*/


				this.validateDates(errors);
				this.validateStateDetails(errors);

				var invalidCountryEntered = false;
				jQuery("input[dataCountrySel='select-country']").each(function(idx) {
					if (!jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") && jQuery(this).parents("section.displayBlock").length > 0 && jQuery(jQuery(this).parents("section.displayBlock")[jQuery(this).parents("section.displayBlock").length - 1]).hasClass("displayBlock") && this.id.indexOf("nationality_code_") == -1) {
						if (!countryListCodeMap[this.value.toUpperCase()] && !countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							invalidCountryEntered = true;
						}
					}
				});
				if (invalidCountryEntered) {
					errors.push({
						"localizedMessage": this.errorStrings[41001].localizedMessage,
						"code": this.errorStrings[41001].errorid
					});
				}
				if (errors != null && errors.length > 0) {
					modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
					jQuery('#overlayCKIN').hide();
					jQuery('#splashScreen').hide();
					jQuery('input').blur();
					this.moduleCtrl.displayErrors(errors, "regulatoryErrors", "error");
					return null;
				}

				/*For nationalty edit screen*/
				if (fromNatEditFlow && currNatField) {
					currNatField.each(function(idx) {
						if (this.value != "" && countryListCodeMap[this.value.toUpperCase()]) {
							this.value = countryListCodeMap[this.value.toUpperCase()];
						} else if (this.value != "" && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
							this.value = this.value.toUpperCase();
						}
					});
				}
				/*End For nationalty edit screen*/

				var stateNameCodeMap = this.moduleCtrl.getUsaStatesNameToCodeMap();
				var operatingCust = $('[operating-customer]').eq(0).attr("operating-customer");
				var customer_index = $("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").substring($("[data-customer-index = " + operatingCust + "]").eq(2).attr("id").length - 1);
        if ($("#dest_country_" + customer_index + "_" + "0").eq(0).val().search(/USA/i) != -1) {
					$("#dest_state_" + customer_index + "_" + "0").eq(0).val(stateNameCodeMap[$("#dest_state_" + customer_index + "_" + "0").eq(0).val().toUpperCase()]);
				}
        if ($("#Country_" + customer_index + "_" + "0").eq(0).val().search(/USA/i) != -1) {
					$("#State_" + customer_index + "_" + "0").eq(0).val(stateNameCodeMap[$("#State_" + customer_index + "_" + "0").eq(0).val().toUpperCase()]);
				}
				jQuery("input[dataCountrySel='select-country']").each(function(idx) {
					if (this.value != "" && this.id.indexOf("nationality_code_") == -1 && countryListCodeMap[this.value.toUpperCase()]) {
						this.value = countryListCodeMap[this.value.toUpperCase()];
					} else if (this.value != "" && this.id.indexOf("nationality_code_") == -1 && countryListCodeMap.codetocountry[this.value.toUpperCase()]) {
						this.value = this.value.toUpperCase();
					}
				});

				/*to update nat to avoid XXX issue*/
				jQuery("[name^='nationality_code_']").each(function(idx) {
					if (jQuery(this).attr("readonly") && countryListCodeMap[this.value.toUpperCase()]) {
						this.value = countryListCodeMap[this.value.toUpperCase()];
					}
				});
				/*End*/

				var EditInput = form.serializeObject();

				// || fromNatEditFlow
				if (this.cprwithallproduct.length == 0) {
					var selectedcpr = this.moduleCtrl.getSelectedPax();
				} else {
					var selectedcpr = this.cprwithallproduct;
				}
				var cpr = this.moduleCtrl.getCPR();
				var chkRegJson = this.moduleCtrl.getCheckReg();
				var editCPR = this.moduleCtrl.getNatEditCPR();
				var Indicators = [];
				var editsReqArray = [];
				var NoOfEdits = [];
				var prod = null;
				for (var i = 0; i < selectedcpr.length; i++) {
					if (i == 0) {
						var prod = selectedcpr[i].product;
					}
					var custArray = selectedcpr[i].customer;
					for (var j = 0; j < custArray.length; j++) {
						var ind = "N"; /*chkRegJson.regulatoryDetails[j].productLevelList[selectedcpr[i].product].apisDataOKInd.indicator; */
						// pushing all the indicators needed for edits
						if (ind == "N") {
							var customer = custArray[j];
							var prod_index = prod;
							var editCount = 0;
							var field1 = "14475_" + customer + "_" + prod;
							// passenger info indicator
							if (jQuery('#' + field1).hasClass('displayBlock')) {
								var f1 = "DCG_" + customer
								Indicators.push(f1);
							}
							// date of birth indicator
							var field2 = "14476_" + customer + "_" + prod;
							if (this.isDateSupport() || this.OperationgGroupOfAirlines) {
								if (jQuery('#' + field2).hasClass('displayBlock') && !jQuery('#' + field2).find("input").is(":disabled")) {
									var f2 = "DDB_" + customer;
									Indicators.push(f2);
								}
							} else {
								if (jQuery('#' + field2).hasClass('displayBlock') && !jQuery('#' + field2).find("select").is(":disabled")) {
									var f2 = "DDB_" + customer;
									Indicators.push(f2);
								}
							}

							/*For redress and known travel information*/
							var fieldRedress = "redress_19507_" + customer + "_" + prod;
							var redID = "redress_number_" + customer + "_" + prod;
							var fieldKnownTraveller = "knowntraveller_19507_" + customer + "_" + prod;
							var knownTrvlID = "knowntraveler_number_" + customer + "_" + prod;
							if (jQuery('#' + fieldRedress).hasClass('displayBlock') && jQuery("#" + redID).val() != "") {
								var f1 = "REDRS_" + customer;
								editCount++;
								Indicators.push(f1);
							}
							if (jQuery('#' + fieldKnownTraveller).hasClass('displayBlock') && jQuery("#" + knownTrvlID).val() != "") {
								var f1 = "KNOWNTR_" + customer;
								editCount++;
								Indicators.push(f1);
							}
							/*End*/

							// passport document indicator
							var field4 = "PSP_DRD_" + customer;
							if (jQuery('#' + field4).hasClass('displayBlock')) {
								Indicators.push(field4);
								editCount++;
								/*Added for impl or cond between passport and other documents*/
								jQuery("#" + field4).addClass("DetailsFilledByBean");

								/*For nationalty edit screen && to update nat to avoid XXX issue*/
								/*if(fromNatEditFlow)
								{*/
								editCount++;
								Indicators.push("NAT");
								/*}*/
							}
							// visa document indicator
							var field5 = "VISA_DRD_" + customer;
							if (jQuery('#' + field5).hasClass('displayBlock')) {
								Indicators.push(field5);
								editCount++;
							}
							// home address indicator
							var field3 = "HOME_UAD_" + customer;
							if (jQuery('#' + field3).hasClass('displayBlock')) {
								Indicators.push(field3);
								editCount++;
							}
							// destination address indicator
							var field6 = "DEST_UAD_" + customer;
							if (jQuery('#' + field6).hasClass('displayBlock')) {
								Indicators.push(field6);
								editCount++;
							}
							// emergency contact indicator
							var field7 = "DCL_" + customer;
							if (jQuery('#' + field7).hasClass('displayBlock')) {
								Indicators.push(field7);
								editCount++;
							}
							// other document indicator
							var field10 = "OTHER_DRD_" + customer;
							if (jQuery('#' + field10).hasClass('displayBlock')) {
								Indicators.push(field10);
								editCount++;
								/*Added for impl or cond between passport and other documents*/
								jQuery("#" + field10).addClass("DetailsFilledByBean");
							}
							// place of birth indicator
							var field8 = "14785_" + customer + "_" + prod;
							if (jQuery('#' + field8).hasClass('displayBlock')) {
								var f3 = "POB_DRD_" + customer;
								Indicators.push(f3);
								editCount++;
							}
							// country of residence indicator
							var field9 = "14732_" + customer + "_" + prod;
							if (jQuery('#' + field9).hasClass('displayBlock')) {
								var f4 = "COR_DRD_" + customer;
								Indicators.push(f4);
								editCount++;
							}


							NoOfEdits.push({
								"customer": customer,
								"edits": editCount
							})
						}
					}
				}

				for (var k = 0; k < selectedcpr.length; k++) {
					var customerArray = [];
					var prod = selectedcpr[k].product;
					var firstProd = selectedcpr[0].product;
					var customer = selectedcpr[k].customer;
					for (var l = 0; l < customer.length; l++) {
						var ind = "N"; /*chkRegJson.regulatoryDetails[l].productLevelList[selectedcpr[k].product].apisDataOKInd.indicator; */
						if (ind == "N") {
							customerArray.push(customer[l]);
							if (k != 0) {
								for (key in EditInput) {
									var sId = key;
									var id = "";
									var temp = key.split('_')
									if (temp.length != 2) {
										if (temp.length == 3) {
											id = temp[0] + "_" + customer[l] + "_" + prod;
										} else if (temp.length == 4) {
											id = temp[0] + "_" + temp[1] + "_" + customer[l] + "_" + prod;
										} else if (temp.length == 5) {
											id = temp[0] + "_" + temp[1] + "_" + temp[2] + "_" + customer[l] + "_" + prod;
										}
									}
									if (id != "" && sId.charAt(sId.lastIndexOf("_") - 1) == customer[l] && !EditInput[id]) {
										EditInput[id] = EditInput[sId];
									}

								}
							}
						}
					}
					editsReqArray.push({
						"product": prod,
						"customer": customerArray
					});
        }

        for (key in EditInput) {

          if (typeof key == "string" && key.search(/^(nationality_code)/i) != -1) {
            EditInput[key] = EditInput[key].toUpperCase();
          }
				}

				/*For nationalty edit screen*/
				if (fromNatEditFlow) {
					jQuery("#Nationality" + operatingCust).removeClass("displayNone").addClass("displayBlock");
					this.currentNatEditpageBeforeState.removeClass("displayNone").addClass("displayBlock");
					this.currentNatEditpageBeforeStatesection.removeClass("displayNone").addClass("displayBlock");
					var id_nationality = jQuery("#PSP_DRD_" + customer_index + ">ul li input").eq(0).attr("id");
					var natupdated_value = jQuery("#PSP_DRD_" + customer_index + ">ul li input").eq(0).attr("value");
					jQuery("#PSP_DRD_" + customer_index + ">ul li").eq(0).remove();
					jQuery("#nationality_codebutton_" + customer_index + "_" + args.currentprod).prev().attr("id", id_nationality).attr("name", id_nationality).attr("value", natupdated_value);

					/*For taking latest updated nat to inat*/
					var natEditcpr = this.moduleCtrl.getNatEditCPR();
					if (natEditcpr) {
						for (var custo in natEditcpr.customerLevel) {
							if (natEditcpr.customerLevel[custo].uniqueCustomerIdBean.primeId == cpr.customerLevel[customer_index].uniqueCustomerIdBean.primeId) {
								for (var prodo in natEditcpr.customerLevel[custo].productLevelBean) {
									if (natEditcpr.customerLevel[custo].productLevelBean[prodo].nationalityBean != null) {
										natEditcpr.customerLevel[custo].productLevelBean[prodo].nationalityBean[0].nationalityNationalityCode = natupdated_value;
									}
								}

							}
						}
					}
				}


				/*For getting flight ids based on pax selected*/
				var selectpaxforprimeid = this.moduleCtrl.getSelectedPax();
				for (var j = 0; j < selectpaxforprimeid[0]["customer"].length; j++) {
					for (var i = 0; i < selectpaxforprimeid.length; i++) {
						this.data.selectedPaxUniqID.push(cpr.customerLevel[selectpaxforprimeid[0]["customer"][j]].productLevelBean[selectpaxforprimeid[i]["product"]].productIdentifiersBean[0].primeId);
					}
				}


				// input json
				var RegulatoryInput = {
					"editInput": EditInput,
					"indicators": Indicators,
					"editsReqArray": editsReqArray,
					"NoOfEdits": NoOfEdits,
					"selectedProdList": this.data.selectedPaxUniqID
				}
				this.moduleCtrl.regulatoryEdits(RegulatoryInput);
				this.data.selectedPaxUniqID = [];
			} catch (exception) {
				this.$logError(
					'RequiredDetailsScript::An error occured in onContinue function',
					exception);
			}
		},
		/**
		 * isPaxCheckedIn : Checking whether pax checked or not for a product level.
		 */
		isPaxCheckedIn: function(product_index, primeId) {

			var chkdin = false;
			try {
				this.$logInfo('CPRRetreiveMultiPaxScript::Entering isPaxCheckedIn function');
				var cpr = this.moduleCtrl.getCPR();
				for (var l = 0; l < cpr.customerLevel.length; l++) {
					if (cpr.customerLevel[l].uniqueCustomerIdBean.primeId == primeId) {
						var legArray = cpr.customerLevel[l].productLevelBean[product_index].legLevelBean;
						for (var m = 0; m < legArray.length; m++) {
							var indicators = legArray[m].legLevelIndicatorBean;
							for (var j = 0; j < indicators.length; j++) {
								if (indicators[j].indicator == "CAC" || indicators[j].indicator == "CST") {
									chkdin = true;
								}
							}
						}
					}
				}
			} catch (exception) {
				this.$logError(
					'CPRRetreiveMultiPaxScript::An error occured in isPaxCheckedIn function',
					exception);
			}
			return chkdin;
		},
		selectedCPRMinusChkInPax: function(selectedCPR) {

			var cpr = this.moduleCtrl.getCPR();
			var tempCPRindx = aria.utils.Json.copy(selectedCPR)

			for (var i = 0; i < selectedCPR.length; i++) {
				for (var j = 0; j < selectedCPR[i]["customer"].length; j++) {
					if (this.isPaxCheckedIn(selectedCPR[i]["product"], cpr.customerLevel[selectedCPR[i]["customer"][j]].uniqueCustomerIdBean.primeId)) {

						if (selectedCPR[i]["customer"].length == 1) {
							selectedCPR.splice(i, 1);
							i--;
							break;
						} else if (selectedCPR[i]["customer"].length > 1) {
							var temp = [];
							for (var k = 0; k < selectedCPR[i]["customer"].length; k++) {

								if (k != j) {
									temp.push(selectedCPR[i]["customer"][k]);
								}
							}
							//selectedCPR[i]["customer"].splice(j,1);
							selectedCPR[i]["customer"] = temp;
							j--;
							if (selectedCPR[i]["customer"].length == 1) {
								selectedCPR[i]["customer"] = "" + selectedCPR[i]["customer"][0];
							}

						}
					}

				}
			}
			return selectedCPR;

		},

		onBackClick: function() {
			this.moduleCtrl.onBackClick();
		}
	}
})