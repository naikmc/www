Aria.tplScriptDefinition({
    $classpath: "modules.view.merci.segments.servicing.templates.speedbook.MSpeedBookSRCHScript",
    $dependencies: [
        'modules.view.merci.common.utils.MCommonScript'
    ],

    $constructor: function() {
        this.utils = modules.view.merci.common.utils.MCommonScript;
        pageObj = this;
    },

    $prototype: {
        $dataReady: function() {
            this.data.labels = this.moduleCtrl.getModuleData().booking.MSpeedBookSRCH_A.labels;
            this.data.rqstParams = this.moduleCtrl.getModuleData().booking.MSpeedBookSRCH_A.requestParam;
            this.data.siteParams = this.moduleCtrl.getModuleData().booking.MSpeedBookSRCH_A.siteParam;
            this.itineraries = this.data.rqstParams.air.itineraries;
            this.travellersInfo = this.data.rqstParams.travellerDetails;
            this.createDatePicker();
            var headerButton = {};
            var arr = [];
            headerButton.button = arr;
            this.moduleCtrl.setHeaderInfo({
                title: this.data.labels.tx_merci_text_booking_alpi_title,
                bannerHtmlL: this.data.rqstParams.bannerHtml,
                homePageURL: this.data.siteParams.homeURL,
                showButton: false,
                headerButton: headerButton
            });
        },

        $displayReady: function() {
            this.resetDate();
            document.body.id = "speedBookSeach";
            $('.ui-datepicker-trigger').click(function() {
                $('#speedBookSearch').hide();
                $('.banner').hide();
                $('#ui-datepicker-div').show();
            });
            $('body').removeClass('trip');
        },

		$viewReady: function() {
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MSpeedBookSRCH",
						data:this.data
					});
			}
		},

        createDatePicker: function() {
            var _this = this;
            var showNewDtPicker = 'TRUE';
            var buttonImgOnly = false;
            var buttonImagePath = "";
            var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            if (showNewDtPicker != 'TRUE') {
                buttonImagePath = $("#calImgPath").val();
                buttonImgOnly = true;
            }
            $('#datePickFlightF_0').datepicker({
                showOn: "button",
                buttonImage: buttonImagePath,
                buttonImageOnly: buttonImgOnly,
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
                    var day1 = $.datepicker.formatDate('dd', $("#datePickFlightF_0").datepicker('getDate'));
                    var month1 = $.datepicker.formatDate('M', $("#datePickFlightF_0").datepicker('getDate'));
                    var year1 = $.datepicker.formatDate('yy', $("#datePickFlightF_0").datepicker('getDate'));
                    var monthinNo = $.datepicker.formatDate('mm', $("#datePickFlightF_0").datepicker('getDate'));
                    var dayName1 = $.datepicker.formatDate('D', $("#datePickFlightF_0").datepicker('getDate'));

                    changedDate_0 = new Date(year1, parseInt(monthinNo) - 1, day1);
                    $('#datePickFlightF_0').datepicker('setDate', changedDate_0);
                    $("#depFlightdate_0").html("<time>" + dayName1 + " " + day1 + " " + month1 + " " + year1 + "</time>");
                    document.getElementById("depFlightdate_0").setAttribute("value", year1 + "" + monthinNo + "" + day1 + "0000");
                    if (showNewDtPicker != 'TRUE') {
                        if (parseInt(day1) < 10) {
                            day1 = day1.substring(1, 2);
                        }
                    }
                    $("#depFlightdate_0").attr("day1", day1);
                    $("#dd_0").attr("value", day1);
                    $("#MMM_0").attr("value", monthNames[parseInt(monthinNo) - 1]);
                    $("#YYYY_0").attr("value", year1);
                    if (pageObj.itineraries[1] != undefined) {
                        changedDate_0.setDate(changedDate_0.getDate() + parseInt(pageObj.data.siteParams.departureUIOffsetDate));
                        var month = $.datepicker.formatDate('M', changedDate_0);
                        var day = $.datepicker.formatDate('dd', changedDate_0);
                        var year = changedDate_0.getFullYear();
                        var monthinNo1 = $.datepicker.formatDate('mm', changedDate_0);
                        var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                        var dayNameIndex = changedDate_0.getDay() - 1;
                        if(dayNameIndex<0){
                            dayNameIndex=6;
                        }
                        var dayName = dayNames[dayNameIndex];
                        $("#dd_1").attr("value", day);
                        $("#MMM_1").attr("value", month);
                        $("#YYYY_0").attr("value", year);
                        $("#datePickFlightF_1").datepicker('setDate', changedDate_0);
                        $("#depFlightdate_1").html("<time>" + dayName + " " + day + " " + month + " " + year + "</time>");
                        document.getElementById("depFlightdate_1").setAttribute("value", year + "" + monthinNo1 + "" + day + "0000");
                    }
                    $('#speedBookSearch').show();
                    $('.banner').show();
                    pageObj.validateContinue();
                    $('#ui-datepicker-div').hide();
                },
                onClose: function() {
                    $('#speedBookSearch').show();
                    $('.banner').show();
                    $('#ui-datepicker-div').hide();
                }
            });
            if (this.itineraries[1] != undefined) {
                $('#datePickFlightF_1').datepicker({
                    showOn: "button",
                    buttonImage: buttonImagePath,
                    buttonImageOnly: buttonImgOnly,
                    dateFormat: 'yy-mm-dd',
                    inline: true,
                    changeMonth: true,
                    changeYear: true,
                    minDate: 0,
                    maxDate: "+364D",
                    firstDay: 1,
                    showButtonPanel: true,
                    buttonText: "",
                    onSelect: function() {
                        var day1 = $.datepicker.formatDate('dd', $("#datePickFlightF_1").datepicker('getDate'));
                        var month1 = $.datepicker.formatDate('M', $("#datePickFlightF_1").datepicker('getDate'));
                        var year1 = $.datepicker.formatDate('yy', $("#datePickFlightF_1").datepicker('getDate'));
                        var monthinNo = $.datepicker.formatDate('mm', $("#datePickFlightF_1").datepicker('getDate'));
                        var dayName1 = $.datepicker.formatDate('D', $("#datePickFlightF_1").datepicker('getDate'));

                        changedDate_1 = new Date(year1, parseInt(monthinNo) - 1, day1);
                        $('#datePickFlightF_1').datepicker('setDate', changedDate_1);

                        $("#depFlightdate_1").html("<time>" + dayName1 + " " + day1 + " " + month1 + " " + year1 + "</time>");
                        document.getElementById("depFlightdate_1").setAttribute("value", year1 + "" + monthinNo + "" + day1 + "0000");
                        pageObj.validateContinue();
                        if (showNewDtPicker != 'TRUE') {
                            if (parseInt(day1) < 10) {
                                day1 = day1.substring(1, 2);
                            }
                        }
                        $("#depFlightdate_1").attr("day1", day1);
                        $("#dd_1").attr("value", day1);
                        $("#MMM_1").attr("value", monthNames[parseInt(monthinNo) - 1]);
                        $("#YYYY_1").attr("value", year1);
                        $('#speedBookSearch').show();
                        $('.banner').show();
                        $('#ui-datepicker-div').hide();
                    },
                    onClose: function() {
                        $('#speedBookSearch').show();
                        $('.banner').show();
                        $('#ui-datepicker-div').hide();
                    }
                });
            }
            if ($("#dd_0").attr("value") == "" || $("#dd_0").attr("value") ==  undefined) {
                var todayDate = new Date();
                var month = monthNames[todayDate.getMonth()];
                var day = todayDate.getDate();
                var year = todayDate.getFullYear();
                var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                var dayNameIndex = todayDate.getDay() - 1;
                var dayName = dayNames[dayNameIndex];
                $("#dd_0").attr("value", day);
                $("#MMM_0").attr("value", month);
                $("#YYYY_0").attr("value", year);
                $("#datePickFlightF_0").datepicker('setDate', todayDate);

                todayDate.setDate(todayDate.getDate() + parseInt(this.data.siteParams.departureUIOffsetDate));
                var month = monthNames[todayDate.getMonth()];
                var day = todayDate.getDate();
                var year = todayDate.getFullYear();
                var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                var dayNameIndex = todayDate.getDay() - 1;
                var dayName = dayNames[dayNameIndex];
                $("#dd_1").attr("value", day);
                $("#MMM_1").attr("value", month);
                $("#YYYY_0").attr("value", year);
                $("#datePickFlightF_1").datepicker('setDate', todayDate);
            }

        },

        resetDate: function() {
            this.createDatePicker();
            var a = $('.ui-datepicker-trigger')[0];
            var b = $('.ui-datepicker-trigger')[1];
            $(a).attr("id", "depFlightdate_0");
            var defaultDay_0 = $.datepicker.formatDate('dd', $("#datePickFlightF_0").datepicker('getDate'));
            var defaultMonth_0 = $.datepicker.formatDate('M', $("#datePickFlightF_0").datepicker('getDate'));
            var defaultYear_0 = $.datepicker.formatDate('yy', $("#datePickFlightF_0").datepicker('getDate'));
            var monthinNo_0 = $.datepicker.formatDate('mm', $("#datePickFlightF_0").datepicker('getDate'));
            var defaultDayName_0 = $.datepicker.formatDate('D', $("#datePickFlightF_0").datepicker('getDate'));
            $("#depFlightdate_0").html("<time>" + defaultDayName_0 + " " + defaultDay_0 + " " + defaultMonth_0 + " " + defaultYear_0 + "</time>");
            $("#depFlightdate_0").attr("day1", defaultDay_0);
            document.getElementById("depFlightdate_0").setAttribute("value", defaultYear_0 + "" + monthinNo_0 + "" + defaultDay_0 + "0000");

            if (this.itineraries[1] != undefined) {
                $(b).attr("id", "depFlightdate_1");
                var defaultDay_1 = $.datepicker.formatDate('dd', $("#datePickFlightF_1").datepicker('getDate'));
                var defaultMonth_1 = $.datepicker.formatDate('M', $("#datePickFlightF_1").datepicker('getDate'));
                var defaultYear_1 = $.datepicker.formatDate('yy', $("#datePickFlightF_1").datepicker('getDate'));
                var monthinNo_1 = $.datepicker.formatDate('mm', $("#datePickFlightF_1").datepicker('getDate'));
                var defaultDayName_1 = $.datepicker.formatDate('D', $("#datePickFlightF_0").datepicker('getDate'));
                $("#depFlightdate_1").html("<time>" + defaultDayName_1 + " " + defaultDay_1 + " " + defaultMonth_1 + " " + defaultYear_1 + "</time>");
                $("#depFlightdate_1").attr("day1", defaultDay_1);
                document.getElementById("depFlightdate_1").setAttribute("value", defaultYear_1 + "" + monthinNo_1 + "" + defaultDay_1 + "0000");
            }
            this.validateContinue();
        },

        onSpeedBookSRCH: function(event, args) {

            event.preventDefault();
            var formElmt = document.getElementById("speedBookSearch");
            var request = {
                formObj: formElmt,
                action: 'MAvailThenFare.action',
                method: 'POST',
                expectedResponseType: 'json',
                loading: true,
                cb: {
                    fn: this.__onSpeedBookSRCHCallBack,
                    scope: this
                }
            };
            modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
        },

        __onSpeedBookSRCHCallBack: function(response, params) {
            // getting next page id
            var nextPage = response.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
            if (response.responseJSON.data != null) {
                if (dataId == 'MError_A' && response.responseJSON.data.booking.MError_A != null) {
                	var errParam = response.responseJSON.data.booking.MError_A.requestParam;
                	for (var key in errParam.checkBEError) {
    					if (errParam.checkBEError.hasOwnProperty(key)) {
    							$('#errMsg').text(errParam.checkBEError[key]);
        						$('#convErrDiv').show();
        						$('.msk').hide()
    					}
    				 }
                   } else {
                    // setting data for next page
                    this.utils.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
                    // navigate to next page
                    this.moduleCtrl.navigate(null, nextPage);
                }
            }
        },

        validateContinue: function() {
            this.outBoundDate = document.getElementById("depFlightdate_0").value;
            var outBoundBeginDte = this.itineraries[0].beginDateBean.formatDateAsYYYYMMdd;
            if (this.outBoundDate.slice(0, 8) === outBoundBeginDte) {
                document.getElementById("Continue").setAttribute('class', 'validation disabled');
                document.getElementById("Continue").setAttribute('disabled', 'disabled');
            } else if (this.itineraries[1] != undefined) {
                this.inBoundDate = document.getElementById("depFlightdate_1").value;
                var inBoundBeginDte = this.itineraries[1].beginDateBean.formatDateAsYYYYMMdd;
                if (this.inBoundDate.slice(0, 8) === inBoundBeginDte) {
                    document.getElementById("Continue").setAttribute('class', 'validation disabled');
                    document.getElementById("Continue").setAttribute('disabled', 'disabled');
                } else {
                    document.getElementById("Continue").setAttribute('class', 'validation');
                    document.getElementById("Continue").disabled = false;
                }
            } else {
                document.getElementById("Continue").setAttribute('class', 'validation');
                document.getElementById("Continue").disabled = false;
            }
            /*Adding the selected dates to dom objects and passing them as hidden variables on Continue click*/
            if (document.getElementsByName("B_DATE_1")[0] != undefined && document.getElementsByName("E_DATE_1")[0] != undefined) {
                document.getElementsByName("B_DATE_1")[0].value = this.outBoundDate;
                document.getElementsByName("E_DATE_1")[0].value = this.outBoundDate;
            } else {
                var bDate1 = document.createElement("input");
                bDate1.setAttribute("type", "hidden");
                bDate1.setAttribute("name", "B_DATE_1");
                bDate1.setAttribute("value", this.outBoundDate);
                var eDate1 = document.createElement("input");
                eDate1.setAttribute("type", "hidden");
                eDate1.setAttribute("name", "E_DATE_1");
                eDate1.setAttribute("value", this.outBoundDate);
                var container = document.getElementById("tabletContainerATC");
                container.appendChild(bDate1);
                container.appendChild(eDate1);
            }
            if (this.itineraries[1] != undefined) {
                if (document.getElementsByName("B_DATE_2")[0] != undefined && document.getElementsByName("E_DATE_2")[0] != undefined) {
                    document.getElementsByName("B_DATE_2")[0].value = this.inBoundDate;
                    document.getElementsByName("E_DATE_2")[0].value = this.inBoundDate;
                } else {
                    var bDate2 = document.createElement("input");
                    bDate2.setAttribute("type", "hidden");
                    bDate2.setAttribute("name", "B_DATE_2");
                    bDate2.setAttribute("value", this.inBoundDate);
                    var eDate2 = document.createElement("input");
                    eDate2.setAttribute("type", "hidden");
                    eDate2.setAttribute("name", "E_DATE_2");
                    eDate2.setAttribute("value", this.inBoundDate);
                    container.appendChild(bDate2);
                    container.appendChild(eDate2);
                }
            }
        },

        _getDate: function(dateString) {
            var newDate = (dateString).split(" ");
            var month = this.utils.getMonthInNo(newDate[1]);
            var date = new Date(newDate[5], month, newDate[2]);
            return date;
        }

    }



});