Aria.tplScriptDefinition({
	$classpath: 'modules.view.merci.segments.booking.templates.purc.MSocialSecurityCardScript',
	$constructor: function() {

	},

	$prototype: {

		__createCalendar: function() {

			this.selectedDay = document.getElementById('sscDobDay')!=null ? document.getElementById('sscDobDay').value : 0;
			this.selectedYear = document.getElementById('sscDobYear')!=null ? document.getElementById('sscDobYear').value : 0;
			this.selectedMonth = document.getElementById('sscDobMonth')!=null ? document.getElementById('sscDobMonth').value : 0;
			var todayDate = new Date();
			var selectedDate = new Date(this.selectedYear, parseInt(this.selectedMonth,10) -1, this.selectedDay, 0, 0, 0);
			var maxDate = todayDate.getFullYear() + '-' + ((todayDate.getMonth() < 10) ? '0' : '') + (todayDate.getMonth() + 1) + '-' + ((todayDate.getDate() < 10) ? '0' : '') + todayDate.getDate();

			$('#btnDatePicker').datepicker({
				showOn: "button",
				buttonImage: modules.view.merci.common.utils.MCommonScript.getImgLinkURL("calTrans.png"),
				buttonImageOnly: true,
				dateFormat: 'yy-mm-dd',
				yearRange: "c-70:+0",
				inline: true,
				changeMonth: true,
				changeYear: true,
				firstDay: 1,
				maxDate: maxDate,
				showButtonPanel: true,
				buttonText: "",
				onSelect: function() {
					var selDay = $.datepicker.formatDate('d', $("#btnDatePicker").datepicker('getDate'));
					var selYear = $.datepicker.formatDate('yy', $("#btnDatePicker").datepicker('getDate'));
					var selMonth = $.datepicker.formatDate('m', $("#btnDatePicker").datepicker('getDate'));

					var day = document.getElementById('sscDobDay');
					var year = document.getElementById('sscDobYear');
					var month = document.getElementById('sscDobMonth');

					if (day != null) {
						day.value = selDay;
					}

					if (year != null) {
						year.value = selYear;
					}

					if (month != null) {
						month.value = selMonth;
					}
					$('#purcForm').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				},
				onClose: function() {
					$('#purcForm').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				}
			});

			// set selected date as default date
			$("#btnDatePicker").datepicker("setDate", selectedDate);
		},
		
		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSocialSecurityCard",
						data:{}
					});
			}
		},

		$displayReady: function() {
			this.__createCalendar();
			$('.ui-datepicker-trigger').click(function() {
				$('#purcForm').hide();
				$('#ui-datepicker-div').show();
				$('.banner').addClass('hideThis');
			})
			$.datepicker._gotoTodayOriginal = $.datepicker._gotoToday;
			$.datepicker._gotoToday = function() {
				$(".ui-datepicker-current").click(function() {
					$('#purcForm').show();
					$('.banner').removeClass('hideThis');
					$('#ui-datepicker-div').hide();
				});
			}
		}
	}
});